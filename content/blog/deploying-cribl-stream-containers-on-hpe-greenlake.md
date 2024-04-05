---
title: Deploying Cribl Stream Containers on HPE GreenLake for Private Cloud Enterprise
date: 2024-01-17T21:25:38.155Z
author: Elias Alagna & Kam Amir
authorimage: /img/Avatar1.svg
disable: false
tags:
  - ezmeral
  - hpe-ezmeral-container-platform
  - hpe-ezmeral-data-fabric
  - kubernetes
  - hpe-greenlake
  - as-a-service
  - PCE
  - Private Cloud Enterprise
  - logging
  - Splunk
  - HPE GreenLake
  - Cribl
  - hpe-ezmeral
---
Hewlett Packard Enterprise and [Cribl](https://cribl.io/) bring together breakthrough technology to optimize and modernize observability data management, offering new levels of performance and platform independence.

The challenges of security and log management are only partly solved by existing software solutions. HPE and Cribl address the remaining problems of optimizing, routing, and replaying logs to provide independence from the industry’s software products in this space. HPE provides a robust way to run multiple log management software solutions and the Cribl Stream in a modern, easy-to-use, and robust platform. Together, HPE and Cribl reduce the total cost of ownership of log management systems by optimizing the software, accelerating the infrastructure, and reducing management costs.

Cribl Stream is an observability and data streaming platform for real-time processing of logs, metrics, traces, and observability data that enables the ITops, SRE, SecOps and observability teams to collect the data they want, shape the data in the formats they need, route the data wherever they want it to go, and replay data on-demand; thereby enabling customers to observe more and spend less, to have choice and flexibility, and to provide control over their data. HPE GreenLake is a private and hybrid cloud service that delivers the benefits of public cloud to your on-premises environment.

C﻿ribl software can be deployed as stand alone software or run on a fully managed HPE GreenLake platform to offer further ease-of-use for organizations that want the benefits of cloud in an on-premise private cloud offering.

Deploying Cribl Stream containers on HPE GreenLake is a simple and effective way to implement a vendor-agnostic observability pipeline. Cribl Stream containers offer a number of advantages, including agility, cost savings, security, and management simplicity. [Cribl software](https://www.hpe.com/us/en/software/marketplace/cribl-stream.html) is available in the[ HPE GreenLake Marketplace](https://www.hpe.com/us/en/software/marketplace.html).

Deploying Cribl Stream containers on HPE GreenLake offers a number of advantages, including:

* **Agility:** Cribl Stream containers can be deployed quickly and easily on HPE GreenLake, giving you the agility to scale your observability pipeline up or down as needed.
* **Cost savings:** Cribl Stream containers can help you reduce the cost of your observability pipeline by optimizing your data storage and processing through data reduction, data normalization and log routing.
* **Security:** Cribl Stream containers can help you secure your data by encrypting it at rest and in transit.
* **Management simplicity:** HPE GreenLake provides a single management console for managing your Cribl Stream containers, making it easy to keep your observability pipeline running smoothly.

![Cribl architecture diagram](/img/cribl-on-hpe-architecture.png "Cribl architecture")

#### Prerequisites

Before you deploy Cribl Stream containers on HPE GreenLake, you will need to:

* Have an active HPE GreenLake agreement and deployed HPE GreenLake for Private Cloud Enterprise and an account on [https://common.cloud.hpe.com/](https://common.cloud.hpe.com/).
* Install the HPE Ezmeral Runtime Enterprise [Kubectl executable](https://docs.ezmeral.hpe.com/runtime-enterprise/56/reference/kubernetes/tenant-project-administration/Dashboard__Kubernetes_TenantProject_Administrator.html).
* Create a HPE Ezmeral Runtime Enterprise [Kubernetes cluster](https://youtu.be/HSYWa2MalF4).
* Install the Cribl Stream [Kubernetes operator](https://docs.cribl.io/stream/getting-started-guide/).

Steps to deploy Cribl Stream containers on HPE GreenLake:

1. Create a Cribl Stream deployment file. This file will specify the Cribl Stream containers that you want to deploy, as well as the resources that they need.
2. Deploy the Cribl Stream containers to your HPE GreenLake cluster using the Cribl Stream Kubernetes operator.
3. Verify that the Cribl Stream containers are running and healthy.
4. Configure Cribl Stream to collect and process your data.
5. Send your data to your analysis platform of choice.

#### Example deployment file

The following example deployment file deploys a Cribl Stream container that collects and processes logs from a Kubernetes cluster:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cribl-stream
spec:
  replicas: 1
  selector:
    matchLabels:
      app: cribl-stream
  template:
    metadata:
      labels:
        app: cribl-stream
    spec:
      containers:
      - name: cribl-stream
        image: cribl/cribl-stream:latest
        ports:
        - containerPort: 9000
        volumeMounts:
        - name: cribl-stream-config
          mountPath: /etc/cribl-stream
      volumes:
      - name: cribl-stream-config
        configMap:
          name: cribl-stream-config
```

#### Deploying Cribl Stream using Helm Charts

The Cribl Stream helm charts can be found on github (<https://github.com/criblio/helm-charts>). This assumes that the namespace is set to `cribl`. 

﻿Log into cloud CLI or jump box and issue the following commands:

```shell
export KUBECONFIG=<path_to_kube_settings>
kubectl get nodes -n cribl
kubectl get svc  -n cribl
```

Label the leader node and the worker nodes:

```shell
kubectl label nodes <leader_node> stream=leader
kubectl label nodes <worker_node> stream=worker
```

Validate by running:

```shell
kubectl get nodes --show-labels
```

Create and modify the `values.yaml` file for workers and leader nodes. For the leader nodes, create a file named `Leader_values.yaml` and modify line 97:

```yaml
nodeSelector:
     stream: leader
```

For the worker nodes, create a file named `Worker_values.yaml` and modify line 97:

```yaml
nodeSelector:
     stream: worker
```

Next, set the labels for your workers and leader node.

To do this, you'll first need to get a list of all the nodes and the labels associated with them.

```shell
kubectl get nodes --show-labels
```

Now, identify the nodes and make sure to label the nodes according to their role for this deployment. 

Here is an example of setting the host `k8s-cribl-master-t497j-92m66.gl-hpe.net` as a leader:

```shell
kubectl label nodes k8s-cribl-master-t497j-92m66.gl-hpe.net stream=leader
```

Here is an example of setting the host `k8s-cribl-wor8v32g-cdjdc-8tkhn.gl-hpe.net` as a worker node:

```shell
kubectl label nodes k8s-cribl-wor8v32g-cdjdc-8tkhn.gl-hpe.net stream=worker
```

If you accidentally label a node and want to remove or overwrite the label, you can use this command:

```shell
kubectl label nodes k8s-cribl-wor8v32g-cdjdc-876nq.gl-hpe.net stream=worker --overwrite=true
```

Once the labels have been set, you are ready to run the helm command and deploy Cribl Stream on your environment. The first command will deploy the Cribl Leader node:

```shell
helm install --generate-name cribl/logstream-leader -f leader_values.yaml -n cribl
```

When successful, you will see output similar to what's shown below: 

```shell
NAME: logstream-leader-1696441333
LAST DEPLOYED: Wed Oct  4 17:42:16 2023
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
```

Note that this will deploy the leader node with the parameters found in the `leader_values.yaml` file and into the namespace `cribl`. 

Next, deploy the worker nodes using the `worker_values.yaml` file into the namespace `cribl`.

```shell
helm install --generate-name cribl/logstream-workergroup -f workers_values.yaml
```

When successful, you will see a similar output like the one below:

```shell
NAME: logstream-workergroup-1696441592
LAST DEPLOYED: Wed Oct  4 17:46:36 2023
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
```

Now you can validate the deployment by running the following command:

```shell
kubectl get svc
```

You should see the following results:

```shell
NAME    	                          TYPE       	 CLUSTER-IP   	 EXTERNAL-IP  PORT(S)                                                                                                                                                    AGE
kubernetes                         	  ClusterIP  	 10.96.0.1    	 <none>    	  443/TCP                                                                                                                                                  	 22d
logstream-leader-1696441333        	  LoadBalancer   10.111.152.178  <pending> 	  9000:31200/TCP                                                                                                                                           	 9m56s
logstream-leader-1696441333-internal  ClusterIP      10.105.14.164	 <none>    	  9000/TCP,4200/TCP                                                                                                                                        	 9m56s
logstream-workergroup-1696441592   	  LoadBalancer   10.102.239.137  <pending> 	  10001:30942/TCP,9997:32609/TCP,10080:32174/TCP,10081:31898/TCP,5140:30771/TCP,8125:31937/TCP,9200:32134/TCP,8088:32016/TCP,10200:32528/TCP,10300:30836/TCP 5m35s
```

Note: the names and IP addresses will differ from the above example. To test that the deployment was successful, you can run the following command and log into your deployment using the localhost and port 9000:

```shell
kubectl port-forward service/logstream-leader-1696441333 9000:9000 &
```

#### Uninstalling Cribl using Helm

You can uninstall the Cribl deployment for both the leader and worker nodes by running the following commands respectively:

```shell
helm uninstall logstream-leader-1696441333 -n default
helm uninstall logstream-workergroup-1696441592 -n default
```

Make sure to use your leader and worker group name when uninstalling Cribl from your deployment.

#### Configuring Cribl Stream

Once you have [deployed the Cribl Stream](https://docs.cribl.io/stream/deploy-kubernetes-leader/) containers, you need to configure them to collect and process your data. You can do this by editing the Cribl Stream configuration file. The Cribl Stream documentation provides detailed instructions on how to configure Cribl Stream.

#### Sending your data to your analysis platform of choice

Once you have configured Cribl Stream to collect and process your data, you need to send it to your analysis platform of choice. Cribl Stream supports a wide range of analysis platforms, including Elasticsearch, Splunk, and Kafka.

#### Conclusion

For more information on Cribl Stream, check out [Optimized Enterprise Logging Solution With HPE Ezmeral And Cribl Business white paper](https://www.hpe.com/psnow/doc/a50006507enw).

For more blog posts related to HPE Ezmeral Software, keep coming back to the HPE Developer Community blog and search on HPE Ezmeral.