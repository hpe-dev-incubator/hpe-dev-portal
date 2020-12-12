---
title: "Using HPE Cloud Volumes with Amazon EKS"
date: 2019-11-29T17:05:55.757Z
author: Michael Mattsson 
tags: ["hpe-nimble-storage","hpe-cloud-volumes"]
path: using-hpe-cloud-volumes-with-amazon-eks
---
  
Running applications on Kubernetes is becoming more mainstream by the minute. Kubernetes is fairly unambiguous to the developer but may pose challenges for the Ops teams. Private cloud, hybrid cloud or public cloud? Managed Kubernetes or BYO (build your own) Kubernetes? There’s an endless matrix of combinations. It becomes even more challenging when you start caring about stateful applications and persistent storage, as data has gravity in the sense it becomes sticky to where you deploy your application. This technical tutorial will explore the paradigm of managed Kubernetes and how Hewlett Packard Enterprise (HPE) bring value to the public cloud by providing advanced data services to Kubernetes on Amazon Web Services (AWS).

At KubeCon this year, HPE put together [a hybrid cloud CI/CD pipeline](https://community.hpe.com/t5/HPE-Storage-Tech-Insiders/HPE-storage-supporting-thech-HPE-Container-Platform-at-KubeCon/ba-p/7070094) using the new HPE Container Platform and Amazon EKS (Elastic Kubernetes Service). Central to the solution was the integration of HPE Nimble Storage and HPE Cloud Volumes, two key components that enable true hybrid cloud for containers. This blog post will focus on getting started with Amazon EKS, deploying the HPE Volume Driver for Kubernetes FlexVolume Plugin onto EKS, and using HPE Cloud Volumes instead of Amazon EBS (Elastic Block Storage) for persistent storage.

# Managed Kubernetes in Public Cloud 
There are plenty of ways to run Kubernetes in the public cloud. Many distributions of Kubernetes allow you to deploy directly to the hyper-scalers by using simple cloud native tooling to instantiate Kubernetes clusters. But doing so brings the inconvenience of managing your own control plane, the Kubernetes masters with their associated services, which can be a bit daunting and not highly valuable or impactful work. Managed Kubernetes also comes in different shapes and sizes. The most common model is centered around creating clusters, where the cloud provider manages the entire control plane for you, and only worker nodes are deployed as regular instances in your cloud infrastructure. This model brings the benefit of being able to choose instance type (CPU, GPU, and memory) and allows customization of the worker nodes, like installing custom packages and other tweaks necessary to run a certain workload.

The managed Kubernetes service I’m going to focus on in this blog post is Amazon EKS. HPE recently released the [HPE Volume Driver for Kubernetes FlexVolume Plugin](https://github.com/hpe-storage/flexvolume-driver) version 3.1, which supports HPE Cloud Volumes and includes support not only for EKS, but also for Azure AKS (Azure Kubernetes Service). As HPE just received connectivity with Google Cloud, expect full support for GKE (Google Kubernetes Engine) in the near future.

# Prerequisites 
This tutorial assumes a certain familiarity with AWS and HPE Cloud Volumes, as well as the following:

- HPE Cloud Volumes connectivity that is setup according to [the documentation](https://docs.cloudvolumes.hpe.com/help/) in a region that provides Amazon EKS. The litmus test is if you can connect a cloud volume to an EC2 instance in the same region.
- A VPC ID and IPv4 CIDR of the existing VPC from where HPE Cloud Volumes can be accessed.
- HPE Cloud Volumes API Access Key and API Secret Key generated for use by the FlexVolume driver. Make sure you're logged in to [cloudvolumes.hpe.com](https://cloudvolumes.hpe.com/login) and [copy from here](https://cloudvolumes.hpe.com/usersettings). 
- The environment variables `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` and `AWS_DEFAULT_REGION` set. 
- The utilities `aws`, `helm` (version 2), `kubectl` and `eksctl` installed on the machine you’re using to provision your EKS cluster (further info outlined where used below). 
-  An SSH public key that was generated from the provisioning host.

 If you have any questions on the prerequisites or need clarification, please feel free to reach out to me [on Slack](https://hpedev.slack.com/).

# Configure your subnets 
By default, `eksctl` creates new VPCs and subnets for the cluster it provisions. This is impractical when using HPE Cloud Volumes, as you want to use an existing VPC with subnets already accessible from HPE Cloud Volumes. In this tutorial, I’ll tag two subnets for the internal load-balancer and two subnets for the external load-balancer. These subnets will be referenced in the EKS setup later.


```
aws ec2 create-tags --resources subnet-AA000000 subnet-BB000000 --tags Key=kubernetes.io/role/elb,Value=1 
aws ec2 create-tags --resources subnet-CC000000 subnet-DD000000 --tags Key=kubernetes.io/role/internal-elb,Value=1 
``` 

 The above command produces no output if it is successful. Ensure the environment variables are set as outlined in the prerequisites. Learn more about the  [the AWS CLI here](https://aws.amazon.com/cli/). 

# Fire up the EKS cluster 
 The tool `eksctl` was initially developed outside of Amazon. It’s now a joint effort between Amazon and the original author, Weaveworks. Please see the  [the official documentation](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-eksctl.html)  for the `eksctl` tool to learn how to get started. 

Review and edit the `eksctl` command below to fit the target environment. Ensure there’s a public SSH key in place, environment variables set and the subnets have been tagged.  


``` 
eksctl create cluster \ 
--name HPEDEV \ 
--version 1.13 \ 
--region ${AWS_DEFAULT_REGION} \ 
--nodegroup-name standard-workers \ 
--node-type t3.medium \ 
--nodes 3 \ 
--nodes-min 1 \ 
--nodes-max 4 \ 
--ssh-public-key ~/.ssh/id_rsa.pub \ 
--node-ami auto \ 
--vpc-public-subnets subnet-AA000000,subnet-BB000000 \ 
--vpc-private-subnets subnet-CC000000,subnet-DD000000 
``` 

**Note:** Kubernetes 1.12 or 1.13 is currently required for the FlexVolume driver when deployed on EKS. Stay tuned for future updates. 

This command takes a few minutes to execute. Here’s an example output from a successful run: 


``` 
[ℹ]  eksctl version 0.8.0 
[ℹ]  using region us-west-2 
[✔]  using existing VPC (vpc-00000000) and subnets (private:[subnet-CC000000 subnet-DD000000] public:[subnet-AA000000 subnet-AA000000]) 
[!]  custom VPC/subnets will be used; if resulting cluster doesn't function as expected, make sure to review the configuration of VPC/subnets 
[ℹ]  nodegroup "standard-workers" will use "ami-04e247c4613de71fa" [AmazonLinux2/1.13] 
[ℹ]  using SSH public key "/home/ubuntu/.ssh/id_rsa.pub" as "eksctl-HPEDEV-nodegroup-standard-workers-d0:ac:7f:86:04:d6:1a:ec:71:cc:3d:75:cf:1b: 
f2:46" 
[ℹ]  using Kubernetes version 1.13 
[ℹ]  creating EKS cluster "HPEDEV" in "us-west-2" region 
[ℹ]  will create 2 separate CloudFormation stacks for cluster itself and the initial nodegroup 
[ℹ]  if you encounter any issues, check CloudFormation console or try 'eksctl utils describe-stacks --region=us-west-2 --cluster=HPEDEV' 
[ℹ]  CloudWatch logging will not be enabled for cluster "HPEDEV" in "us-west-2" 
[ℹ]  you can enable it with 'eksctl utils update-cluster-logging --region=us-west-2 --cluster=HPEDEV' 
[ℹ]  Kubernetes API endpoint access will use default of {publicAccess=true, privateAccess=false} for cluster "HPEDEV" in "us-west-2" 
[ℹ]  2 sequential tasks: { create cluster control plane "HPEDEV", create nodegroup "standard-workers" } 
[ℹ]  building cluster stack "eksctl-HPEDEV-cluster" 
[ℹ]  deploying stack "eksctl-HPEDEV-cluster" 
[ℹ]  building nodegroup stack "eksctl-HPEDEV-nodegroup-standard-workers" 
[ℹ]  deploying stack "eksctl-HPEDEV-nodegroup-standard-workers" 
[✔]  all EKS cluster resources for "HPEDEV" have been created 
[✔]  saved kubeconfig as "/home/ubuntu/.kube/config" 
[ℹ]  adding identity "arn:aws:iam::000000000000:role/eksctl-HPEDEV-nodegroup-standard-NodeInstanceRole-000000000000" to auth ConfigMap 
[ℹ]  nodegroup "standard-workers" has 0 node(s) 
[ℹ]  waiting for at least 1 node(s) to become ready in "standard-workers" 
[ℹ]  nodegroup "standard-workers" has 3 node(s) 
[ℹ]  node "ip-172-31-1-186.us-west-2.compute.internal" is not ready 
[ℹ]  node "ip-172-31-24-30.us-west-2.compute.internal" is not ready 
[ℹ]  node "ip-172-31-28-199.us-west-2.compute.internal" is ready 
[ℹ]  kubectl command should work with "/home/ubuntu/.kube/config", try 'kubectl get nodes' 
[✔]  EKS cluster "HPEDEV" in "us-west-2" region is ready 
``` 
 
At this point, you should have connectivity to the cluster using `kubectl`, as shown below:
 

``` 
$ kubectl get nodes 
NAME                                          STATUS   ROLES    AGE   VERSION 
ip-172-31-1-186.us-west-2.compute.internal    Ready    <none>   2m    v1.13.11-eks-5876d6 
ip-172-31-24-30.us-west-2.compute.internal    Ready    <none>   2m    v1.13.11-eks-5876d6 
ip-172-31-28-199.us-west-2.compute.internal   Ready    <none>   2m    v1.13.11-eks-5876d6 
``` 

![](/uploads/media/2019/10/screen-shot-2019-11-26-at-22906-pm-1574814807294.png)

You're now ready to deploy the FlexVolume driver! 

# Deploy the FlexVolume driver
The easiest way to install the HPE Volume Driver for Kubernetes FlexVolume Plugin is to use Helm. The FlexVolume driver Helm chart is available on [hub.helm.sh](https://hub.helm.sh/charts/hpe-storage/hpe-flexvolume-driver). But before you deploy the driver, you need to create a `values.yaml` file that corresponds to the HPE Cloud Volumes setup. This file is used as input to Helm.

Use this `values.yaml` file as a starting point:


``` 
--- 
backend: cloudvolumes.hpe.com 
username: < HPE Cloud Volumes API Access Key > 
password: < HPE Cloud Volumes API Secret Key > 
pluginType: cv 
fsType: xfs 
storageClass: 
  defaultClass: true 
cv: 
  config: 
    snapPrefix: BaseFor 
    automatedConnection: true 
    existingCloudSubnet: < CIDR network in VPC, i.e 172.31.0.0/16 > 
    region: us-west-2 
    privateCloud: < VPC ID, i.e vpc-00000000 > 
    cloudComputeProvider: "Amazon AWS" 
    perfPolicy: Other 
    volumeType: GPF 
    encryption: true 
    protectionTemplate: twicedaily:4 
    destroyOnRm: true 
    limitIOPS: "1000" 
    initiators: 
      - '"eth0"' 
      - '"eth1"' 
```
 
Next you need to install Tiller on your cluster. Helm 3 does not require Tiller, however, the Helm chart has not been tested with Helm 3.  So I'm using Helm 2 for this exercise.


``` 
kubectl -n kube-system create serviceaccount tiller 
kubectl create clusterrolebinding tiller \ 
  --clusterrole=cluster-admin \ 
  --serviceaccount=kube-system:tiller 
helm init --service-account tiller 
kubectl -n kube-system  rollout status deploy/tiller-deploy 
``` 

Tiller should now be installed on the cluster. Now install the chart: 


``` 
helm repo add hpe-storage https://hpe-storage.github.io/co-deployments/ 
helm install hpe-storage/hpe-flexvolume-driver --version 3.1.0 --namespace kube-system --name hpe-flexvolume-driver -f values.yaml 
``` 

It should take less than a minute or so to install the required components. Run the below `kubectl` command to verify that all components are running: 


``` 
kubectl -n kube-system get deploy/hpe-dynamic-provisioner deploy/cv-cp deploy/hpe-flexvolume-driver 
``` 

It should output something similar to this: 


``` 
NAME                                            READY   UP-TO-DATE   AVAILABLE   AGE 
deployment.extensions/hpe-dynamic-provisioner   1/1     1            1           30s 
deployment.extensions/cv-cp                     1/1     1            1           30s 
NAME                                         DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE 
daemonset.extensions/hpe-flexvolume-driver   3         3         3       3            3           <none>          30s 
``` 

**Note:** Incidentally, the cluster will end up with two default storage classes, which will block provisioning from a default storage class. Annotate the built-in “gp2” storage class to become non-default: 


``` 
kubectl annotate sc/gp2 storageclass.kubernetes.io/is-default-class=false --overwrite 
``` 

The EKS cluster is now ready for users to declare PVCs (Persistent Volume Claims) served by HPE Cloud Volumes! 

# Hello World 
In the current incarnation of HPE Cloud Volumes it may take some time for the first PV (Persistent Volume) to connect to the first Pod. Network resources are provisioned in the background as needed. The second volume to attach only takes a few seconds. Now create a PVC and attach a workload. 

Here’s a an example PVC that creates a 64GiB volume: 


``` 
--- 
apiVersion: v1 
kind: PersistentVolumeClaim 
metadata: 
  name: mypvc 
spec: 
  accessModes: 
  - ReadWriteOnce 
  resources: 
    requests: 
      storage: 64Gi 
``` 

Either create a file with the PVC stanza above or paste to `stdin` with `kubectl create -f <file>`. Once the PVC is declared, a PV will be created. Inspect it with the following: 


``` 
kubectl get pvc 
NAME    STATUS   VOLUME                                              CAPACITY   ACCESS MODES   STORAGECLASS   AGE 
mypvc   Bound    hpe-standard-5b75aaa8-10a7-11ea-8232-0a210d2b9ace   64Gi       RWO            hpe-standard   18s 
``` 

Volume creation does not attach the device to any host. The attachment is being done once a workload requests the claim. So, you must declare a simple Pod to attach the claim: 


``` 
--- 
apiVersion: v1 
kind: Pod 
metadata: 
  name: ioping 
spec: 
  containers: 
  - name: ioping 
    image: hpestorage/ioping 
    command: [ "ioping" ] 
    args: [ "/data" ] 
    volumeMounts: 
    - name: data 
      mountPath: /data 
  volumes: 
  - name: data 
    persistentVolumeClaim: 
      claimName: mypvc 
``` 

Depending on the environment, this initial deployment could take up to 10 minutes. I’ve been bouncing clusters up and down all day, hence my pod was up in less than a minute: 


``` 
kubectl get pod 
NAME     READY   STATUS    RESTARTS   AGE 
ioping   1/1     Running   0          53s 
``` 

Logs from the Pod indicate a XFS filesystem mount on /data served by a multipath device: 


``` 
kubectl logs pod/ioping 
4 KiB <<< /data (xfs /dev/mapper/mpatha): request=1 time=8.26 ms (warmup) 
4 KiB <<< /data (xfs /dev/mapper/mpatha): request=2 time=7.05 ms 
4 KiB <<< /data (xfs /dev/mapper/mpatha): request=3 time=7.33 ms 
4 KiB <<< /data (xfs /dev/mapper/mpatha): request=4 time=8.13 ms 
4 KiB <<< /data (xfs /dev/mapper/mpatha): request=5 time=8.44 ms 
^C 
``` 

At this point, you can also login to the HPE Cloud Volumes portal to observe the attached volume.

![](/uploads/media/2019/10/screen-shot-2019-11-26-at-43542-pm-1574815092842.png)

# Summary
Many infrastructure choices are available today that enable Kubernetes. Likewise, there are many options on the persistent storage side. HPE Cloud Volumes gives Ops teams much needed relief, as they may rely on a service to persist their applications data rather than becoming storage administrators. Not many of the cloud native software-defined storage (SDS) solutions for Kubernetes give you that luxury. Consuming storage services directly from the cloud provider creates an unnecessary lock-in situation, and the lack of enterprise-grade features is what drives users to alternative SDS solutions. HPE checks all the boxes by providing reliable and performant storage for Kubernetes. And it’s for private cloud, hybrid cloud, and public cloud as well as managed Kubernetes and BYO Kubernetes. Multicloud mobility and competitive pricing comes bundled!

Start today by learning more about: 

- [HPE Cloud Volumes](https://cloudvolumes.hpe.com)
- [HPE Cloud Volumes StorageClass parameters](https://github.com/hpe-storage/flexvolume-driver/tree/master/examples/kubernetes/hpe-cloud-volumes)
- [Amazon EKS](https://aws.amazon.com/eks/)