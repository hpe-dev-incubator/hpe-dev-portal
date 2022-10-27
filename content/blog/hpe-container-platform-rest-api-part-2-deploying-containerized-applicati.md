---
title: "HPE Container Platform REST API – Part 2: Deploying containerized
  applications"
date: 2020-06-04T16:41:01.009Z
featuredBlog: false
priority: null
author: Denis Choukroun
authorimage: https://gravatar.com/avatar/f66dd9562c53567466149af06ae9d4f1?s=96
thumbnailimage: null
tags:
  - hpe-ezmeral
  - kubedirector
  - opensource
---
**Editor’s Note – HPE Ezmeral Container Platform is now HPE Ezmeral Runtime Enterprise**. For more information on why the name was changed, please [click here](https://community.hpe.com/t5/HPE-Ezmeral-Uncut/HPE-Ezmeral-Container-Platform-is-now-HPE-Ezmeral-Runtime/ba-p/7151720#.YW7nOxrMKM8).
 
- - -

In my previous blog post, [HPE Container platform REST API – Part 1: Authenticating](/blog/hpe-container-platform-rest-api-part-1-authenticating), I introduced the HPE Container Platform (HPE CP) REST API. I showed you how to authenticate to the HPE Container Platform API endpoint and retrieve data from objects in a secure way using the command line cURL. Continuing with this series, my second article will walk you through the steps you need to take to deploy containerized applications programmatically on Kubernetes clusters that are managed by the HPE Container Platform. It will show you how to take the REST API authentication call you established while going through the first blog and apply it to a real life scenario focused on the following areas:

* Deployment of cloud native microservices based applications
* Deployment of non-cloud native, stateful, distributed analytics workloads using pre-configured [KubeDirector applications](/blog/kubedirector-the-easy-way-to-run-complex-stateful-applications-on-kubern)

## Deploying stateless and stateful containerized applications using a programmatic approach 

This tutorial assumes you have established a login session with the HPE Container Platform as explained in the first part of this series. The next step in deploying a containerized application in Kubernetes clusters managed by the HPE Container Platform is to get the kubeconfig file for your tenant working context. 

>Note: A working context establishes the user identity, its tenant name and role (member or admin). Based on this context, tenant users are granted privileges and permissions to create and manage resources for their tenant on Kubernetes clusters managed by HPE CP.

The HPE CP REST API call below allows you to obtain the kubeconfig file used to access the Kubernetes cluster for your tenant user account based on your assigned role (tenant member or tenant admin), just as if you had downloaded it from the HPE CP UI.

The REST API call is a **GET** request for the target URL **/api/v2/k8skubeconfig** authenticated for your working tenant context (X-BDS-SESSION). Here, the kubeconfig file is saved as *config* in your $HOME/.kube directory. The call retrieves a configuration file suitable for use by K8s API client such as *kubectl*, which includes a valid session location (token) for your current session. 


```markdown

curl -k -s --request GET "https://<Gateway-IP-Address-or-fqdn>:8080/api/v2/k8skubeconfig" \
--header "X-BDS-SESSION: $sessionlocation" \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' > $HOME/.kube/config

```

You can now send Kubernetes API requests using kubectl to deploy enterprise workloads to the kubernetes cluster using the privileges assigned to your tenant role.

>Note: Once the session location expires (after 24 hours by default), any attempt to execute kubectl commands will prompt you for your password and will require you to log in again before continuing.

Let's see how this works by deploying a simple hello-world stateless, microservices application. We’ll also try it with a complex, distributed, stateful application, using big data analytics-processing, such as Spark.

### Hello-World stateless application deployment

The hello-world application is a **stateless** application because it does not require persistence of data nor an application state. The hello-world application is a very simple application that will return `Hello Kubernetes!` when accessed. The YAML file below describes the application resources involved, such as the deployment, the Pod, the Docker container image and port, and the NodePort service used to expose the application outside of the Kubernetes cluster.


```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-world-demouser
spec:
  selector:
    matchLabels:
      run: hello-demouser
  replicas: 2
  template:
    metadata:
      labels:
        run: hello-demouser
    spec:
      containers:
        - name: hello-world-demouser
          image: gcr.io/google-samples/node-hello:1.0
          ports:
            - containerPort: 8080
              protocol: TCP
---
apiVersion: v1
kind: Service
metadata:
  name: hello-world-service-demouser
spec:
  selector:
    run: hello-demouser
  ports:
  - name: http-hello
    protocol: TCP
    port: 8080
    targetPort: 8080
  type: NodePort

```

The next step is to save the file, for example as *hello-world-app.yaml*, and deploy the application using the K8s API call `kubectl apply -f hello-world-app.yaml`. As shown by the command `kubectl get` below, this simple hello-world application will be represented by standard Kubernetes resource elements (Deployment, Pods and Service) that compose your containerized application.


```markdown
kubectl get deploy,pod,service 

 
NAME                                   READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/hello-world-demouser   2/2     2            2           3m6s

NAME                                        READY   STATUS    RESTARTS   AGE
pod/hello-world-demouser-54b6fcd974-mt8sc   1/1     Running   0          3m6s
pod/hello-world-demouser-54b6fcd974-wnkld   1/1     Running   0          3m6s

NAME                                   TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)                                                    
service/hello-world-service-demouser   NodePort  10.96.113.175  <none>  8080:32295/TCP                         
  

```

For this tutorial, the HPE Container Platform has been configured to automatically map the NodePort service endpoint to the HPE Container Platform gateway host. In this setup, access to application services running in containers in the HPE Container Platform is proxied via the gateway host and a port number greater than 10000. The following `kubectl` command can be used to obtain the application service endpoint from the annotations:


```markdown
kubectl describe service hello-world-service-demouser

Name:                     hello-world-service-demouser
Namespace:                k8shacktenant
Labels:                   hpecp.hpe.com/hpecp-internal-gateway=true
Annotations:              hpecp-internal-gateway/8080: gateway1.hpedevlab.net:10012
                          kubectl.kubernetes.io/last-applied-configuration:
                            {"apiVersion":"v1","kind":"Service","metadata":{"annotations":{},"name":"hello-world-service-demouser","namespace":"k8shacktenant"},"spec"...
Selector:                 run=hello-demouser
Type:                     NodePort
IP:                       10.96.113.175
Port:                     http-hello  8080/TCP
TargetPort:               8080/TCP
NodePort:                 http-hello  32295/TCP
Endpoints:                10.192.0.217:8080,10.192.1.102:8080
Session Affinity:         None
External Traffic Policy:  Cluster
Events:
  Type    Reason  Age   From         Message
  ----    ------  ----  ----         -------
  Normal  HpeCp   16s   hpecp-agent  Created HPECP K8S service


```

In this example, the application service endpoint is *gateway1.hpedevlab.net:10012*. You can connect to the application using the cURL command below or connect through your favorite browser:


```markdown
curl –k –s --request GET https://gateway1.hpedevlab.net:10012
Hello Kubernetes!

```

### Spark stateful application deployment using KubeDirector

HPE has been working within the open source Kubernetes community to add capabilities that enable the running of **stateful** analytics workloads (e.g: data-intensive, AI/ML and analytics-processing distributed applications) on Kubernetes.  The open source project is known as **Kubernetes Director** or **KubeDirector** for short. 

KubeDirector is a key component of the HPE Container Platform, implemented as a Kubernetes custom controller (also known as operator) on every Kubernetes cluster managed by the HPE Container Platform. You can find more information about KubeDirector by visiting the HPE DEV portal [here.](https://developer.hpe.com/platform/hpe-container-platform/home)

A **stateful** application may require persistence of network identity (i.e.: hostname) and persistence of certain mount points across application cluster nodes rescheduling, restarts, upgrades and rollbacks. In the HPE Container Platform, these applications generally refer to a distributed, single-node or multi-node application **virtual cluster**. Each application virtual cluster node runs as a **container** in a Pod in the Kubernetes cluster managed by the HPE Container Platform.

In our HPE CP deployment, three pre-configured KubeDirector Application types have been installed on the Kubernetes cluster managed by HPE Controller Platform. As tenant user, you can get the list of KubeDirector applications that are visible to your tenant using the `kubectl` command below:  


```markdown
kubectl get kubedirectorapp
NAME                  AGE
centos7x              37d
ml-jupyter-notebook   37d
spark221e2            37d


```

Now, let’s inspect the definition of the Spark application type using kubectl command `kubectl describe kubedirectorapp spark221e2`

Spark is a non-cloud native multi-tier application with tightly coupled and interdependent services. As shown in the output of command below, the Spark221e2 KubeDirector Application describes the application metadata: the service roles, the service endpoints port and port name prefix (that comes from the URL Scheme), the Docker images, the configuration packages, the cardinality (minimum number of members in a role), and the root file system directories (e.g.: /etc, /bin, /opt, /var, /usr) of the containers to persist beyond the life span of the containers. This means stateful applications that require writing data to their root file systems can now successfully run on Kubernetes.


```markdown
kubectl describe kubedirectorapp spark221e2
Name:         spark221e2
Namespace:    k8shacktenant
Labels:       <none>
Annotations:  <none>
API Version:  kubedirector.hpe.com/v1beta1
Kind:         KubeDirectorApp
Metadata:
  Creation Timestamp:  2020-03-24T08:25:15Z
  Generation:          1
  Resource Version:    981021
  Self Link:           /apis/kubedirector.hpe.com/v1beta1/namespaces/k8shacktenant/kubedirectorapps/spark221e2
  UID:                 753618be-1edf-470c-bff5-385d0e76fafe
Spec:
  Config:
    Role Services:
      Role ID:  controller
      Service I Ds:
        ssh
        spark
        spark-master
        spark-worker
      Role ID:  worker
      Service I Ds:
        ssh
        spark-worker
      Role ID:  jupyter
      Service I Ds:
        ssh
        jupyter-nb
    Selected Roles:
      controller
      worker
      jupyter
  Config Schema Version:  7
  Distro ID:              bluedata/spark221e2
  Label:
    Description:  Spark 2.2.1 with Jupyter notebook
    Name:         Spark 2.2.1 + Jupyter
  Roles:
    Cardinality:  1
    Config Package:
      Package URL:   file:///opt/configscripts/appconfig-2.6.tgz
    Id:              controller
    Image Repo Tag:  docker.io/bluedata/sparkbase:2.2
    Persist Dirs:
      /usr
      /opt
      /var
      /data
    Cardinality:  0+
    Config Package:
      Package URL:   file:///opt/configscripts/appconfig-2.6.tgz
    Id:              worker
    Image Repo Tag:  docker.io/bluedata/sparkbase:2.2
    Persist Dirs:
      /usr
      /opt
      /var
      /data
    Cardinality:  0+
    Config Package:
      Package URL:   file:///opt/configscripts/appconfig-2.6.tgz
    Id:              jupyter
    Image Repo Tag:  docker.io/bluedata/jupyter:2.3
    Persist Dirs:
      /usr
      /opt
      /var
      /data
  Services:
    Endpoint:
      Is Dashboard:  false
      Port:          22
    Id:              ssh
    Label:
      Name:  SSH
    Endpoint:
      Is Dashboard:  true
      Path:          /
      Port:          8080
      URL Scheme:    http
    Id:              spark
    Label:
      Name:  Spark master
    Endpoint:
      Is Dashboard:  false
      Port:          7077
      URL Scheme:    spark
    Id:              spark-master
    Label:
      Name:  Spark master
    Endpoint:
      Is Dashboard:  true
      Path:          /
      Port:          8081
      URL Scheme:    http
    Id:              spark-worker
    Label:
      Name:  Spark worker
    Endpoint:
      Is Dashboard:  true
      Path:          /
      Port:          8888
      URL Scheme:    http
    Id:              jupyter-nb
    Label:
      Name:          Jupyter Notebook
  Systemd Required:  true
  Version:           2.7
Events:              <none>

```

A configuration manifest YAML file is then used to create an application virtual cluster that __instantiates__ a defined KubeDirector Application type. The configuration file is used to describe the attributes of a given KubeDirector Application type instance, such as the application instance name, KubeDirector App type, the service roles and their number of nodes and compute size, as well as the persistent storage size.

>Note: The Spark KubeDirector Application variant used in this tutorial is a distributed implementation of the data-processing Spark cluster where the master (Spark driver) and worker (Spark executors) services run on different cluster nodes (1 controller node and 2 worker nodes). A separate Jupyter node is used as an interactive client to execute programs on the Spark cluster.


```yaml
apiVersion: "kubedirector.hpe.com/v1beta1"
kind: "KubeDirectorCluster"
metadata: 
  name: "spark221e2-demouser"
spec: 
  app: "spark221e2"
  appCatalog: "local"
  roles: 
    - 
      id: "controller"
      members: 1
      resources: 
        requests: 
          memory: "4Gi"
          cpu: "2"
        limits: 
          memory: "4Gi"
          cpu: "2"
      storage: 
        size: "10Gi"
    - 
      id: "worker"
      members: 2
      resources: 
        requests: 
          memory: "4Gi"
          cpu: "2"
        limits: 
          memory: "4Gi"
          cpu: "2"
      storage: 
        size: "10Gi"
    - 
      id: "jupyter"
      members: 1
      resources: 
        requests: 
          memory: "4Gi"
          cpu: "2"
        limits: 
          memory: "4Gi"
          cpu: "2"
      storage: 
        size: "10Gi"

```

Now, you can save the file, for example as *spark-config.yaml*, and deploy the application using the K8s API call `kubectl apply –f spark-config.yaml`.

Your Spark application virtual cluster will be represented in the Kubernetes cluster by a resource of type **KubeDirectorCluster**, with the name that was indicated inside the YAML file used to create it. You can use the `kubectl describe kubedirectorcluster <clustername>` command below to observe the status of all the resources that compose the virtual cluster, the state of the virtual cluster, and any events logged against it. Upon successful creation of the virtual cluster, the state of the cluster should have a value of __"configured"__.

As shown in the output of the kubectl commands below, the instance of the KubeDirector Application virtual cluster is made up of a __StatefulSet__ per role (Spark controller, Spark workers, and jupyter), a __Pod__ (a cluster node) per service role member, a __NodePort Service__ per service role member, a __headless service__ for the application cluster, and a __Persistent Volume Claim (pvc)__ per Pod that requested persistent storage.  

Some lines have been deleted from the output of the kubectl command to display the essential information.


```markdown
kubectl describe kubedirectorcluster spark221e2-demouser
Name:         spark221e2-demouser
Namespace:    k8shacktenant
…
…
Kind:         KubeDirectorCluster
…
…
Status:
  Cluster Service:  kdhs-lbjmt
  …
  …
  Roles:
    Id:  controller
    Members:
      Node ID:  1
      Pod:      kdss-j2v6x-0
      Pvc:      p-kdss-j2v6x-0
      Service:  s-kdss-j2v6x-0
      State:    configured
    Stateful Set:  kdss-j2v6x
    …
    …
    Id:  worker
    Members:
      Node ID:  2
      Pod:      kdss-7dtqk-0
      Pvc:      p-kdss-7dtqk-0
      Service:  s-kdss-7dtqk-0
      State:    configured

      …
      …
      Node ID:  3
      Pod:      kdss-7dtqk-1
      Pvc:      p-kdss-7dtqk-1
      Service:  s-kdss-7dtqk-1
      State:    configured
    Stateful Set:  kdss-7dtqk
    …
    …   
    Id: jupyter
    Members:
      Node ID:  4
      Pod:      kdss-mwkh4-0
      Pvc:      p-kdss-mwkh4-0
      Service:  s-kdss-mwkh4-0
      State:    configured
    Stateful Set:  kdss-mwkh4
    …
    …
    State:      configured
Events:
  Type    Reason   Age                    From          Message
  ----    ------   ----                   ----          -------
  Normal  Cluster  31m                    kubedirector  new
  Normal  Role     31m                    kubedirector  creating role
  …
  …

```


```markdown
kubectl get all -l kubedirector.hpe.com/kdcluster= spark221e2-demouser
NAME               READY   STATUS    RESTARTS   AGE
pod/kdss-7dtqk-0   1/1     Running   0          31m
pod/kdss-7dtqk-1   1/1     Running   0          31m
pod/kdss-j2v6x-0   1/1     Running   0          31m
pod/kdss-mwkh4-0   1/1     Running   0          31m

NAME                     TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)                                                     
service/kdhs-lbjmt       ClusterIP   None           <none>       8888/TCP                                                    
service/s-kdss-7dtqk-0   NodePort    10.96.141.31   <none>   	22:32677/TCP,8081:31223/TCP                                 
service/s-kdss-7dtqk-1   NodePort    10.96.44.156   <none>   22:32143/TCP,8081:30019/TCP                                 
service/s-kdss-j2v6x-0   NodePort    10.96.215.65   <none>   22:30358/TCP,8080:31430/TCP,7077:31358/TCP,8081:31160/TCP   
service/s-kdss-mwkh4-0   NodePort    10.96.5.87     <none>   22:30390/TCP,8888:30227/TCP                                 

NAME                          READY   AGE
statefulset.apps/kdss-7dtqk   2/2     31m
statefulset.apps/kdss-j2v6x   1/1     31m
statefulset.apps/kdss-mwkh4   1/1     31m

```



```markdown
kubectl get pvc -l kubedirector.hpe.com/kdcluster= spark221e2-demouser

NAME             STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
p-kdss-7dtqk-0   Bound    mapr-pv-84ebfd58-e33e-4535-8856-6ef3b54f84a5   10Gi       RWO            default        31m
p-kdss-7dtqk-1   Bound    mapr-pv-898d2f58-f516-40ef-bc37-7bd418888f78   10Gi       RWO            default        31m
p-kdss-j2v6x-0   Bound    mapr-pv-c635bfa2-b773-430b-aabf-ecc3e0a8bfb5   10Gi       RWO            default        31m
p-kdss-mwkh4-0   Bound    mapr-pv-49b9ffb5-b14a-4703-95a3-95b4695eb4f7   10Gi       RWO            default        31m

```

In the output above, the HPE Container Platform defines HPE Data Fabric (MapR) as default Kubernetes StorageClass for the Kubernetes Clusters managed by the HPE Container Platform. HPE CP uses MapR Container Storage Interface (CSI) storage plugin to expose the HPE Data Fabric as storage provider to the Kubernetes containerized workloads (Pods) that request persistent storage. 

The ClusterIP service is the headless service required by a Kubernetes StatefulSet to work. It maintains a stable Pod network identity (that is, persistence of the hostname of the Pods across Pods rescheduling). 

And, the NodePort services expose the application services outside the Kubernetes cluster. The HPE Container Platform automatically maps the NodePort Service endpoints to the HPE Container Platform gateway host to port greater than 10000. To get a report on all the services related to a specific virtual cluster, you can use the command `kubectl describe service -l  kubedirector.hpe.com/kdcluster=kubedirectorclusterName`

Now, you can connect to the Spark dashboard and the Jupyter Notebook from your browser and start your real time data processing.

![picture1](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/picture1-1591289916989.png)



![picture2](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/picture2-1591289929686.png)

To increase or decrease the number of members in a role, you would just have to edit the configuration YAML file for your application and use the `kubectl apply -f file.yaml` command to implement the changes. The KubeDirector operator will manage the application cluster expansion or shrinkage for you.

Hopefully, this blog has helped you learn how to programmatically interact with the HPE Container Platform to deploy both cloud native stateless, microservices based applications and non-cloud native distributed stateful [KubeDirector](/blog/running-non-cloud-native-apps-on-kubernetes-with-kubedirector) applications for various use cases. 

You can stay up to date with the latest news from HPE DEV by [signing up for our monthly newsletter.](https://developer.hpe.com/newsletter-signup) In it, you will find more awesome developers and data scientists focused posts about the HPE Container Platform. You can also follow our community on [Twitter](https://twitter.com/HPE_Developer) and join the conversation on our [HPE DEV Slack Channel.](https://slack.hpedev.io/)

