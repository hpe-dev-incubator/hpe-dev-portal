---
title: Deploying Cribl Stream Containers on HPE GreenLake
date: 2024-01-17T21:25:38.155Z
author: Elias Alagna, HPE Distinguished Technologist & Kam Amir, Cribl Director
  of Technical Alliances
authorimage: /img/Avatar1.svg
disable: false
tags:
  - ezmeral, hpe-ezmeral-container-platform, hpe-ezmeral-data-fabric,
    kubernetes, hpe-greenlake, as-a-service, PCE, Private Cloud Enterprise,
    logging, Splunk, GreenLake, Cribl
---
Hewlett Packard Enterprise and [Cribl](https://cribl.io/) bring together breakthrough technology to optimize and modernize observability data management offering new levels of performance and platform independence.

The challenges of security and log management are only partly solved by existing software solutions. HPE and Cribl address the remaining problems of optimizing, routing, and replaying logs to provide independence from the industry’s software products in this space. HPE provides a robust way to run multiple log management software solutions and the Cribl Stream in a modern, easy-to-use, and robust platform. Together HPE and Cribl reduce the total cost of ownership of log management systems by optimizing the software, accelerating infrastructure, and reducing management costs.

Cribl Stream is a vendor-agnostic observability pipeline that gives you the flexibility to collect, reduce, enrich, normalize, and route data from any source to any destination within your existing data infrastructure. HPE GreenLake is a private and hybrid cloud service that delivers the benefits of public cloud to your on-premises environment.

Deploying Cribl Stream containers on HPE GreenLake offers a number of advantages, including:

* **Agility:** Cribl Stream containers can be deployed quickly and easily on HPE GreenLake, giving you the agility to scale your observability pipeline up or down as needed.
* **Cost savings:** Cribl Stream containers can help you reduce the cost of your observability pipeline by optimizing your data storage and processing through data reduction, data normalization and log routing.
* **Security:** Cribl Stream containers can help you secure your data by encrypting it at rest and in transit.
* **Management simplicity:** HPE GreenLake provides a single management console for managing your Cribl Stream containers, making it easy to keep your observability pipeline running smoothly.

![Cribl architecture diagram](/img/criblarchitecure.png "Cribl architecture")

## Prerequisites

Before you deploy Cribl Stream containers on HPE GreenLake, you will need to:

* Have a HPE GreenLake account on <https://common.cloud.hpe.com/>.
* Install the HPE GreenLake CLI.
* Create a HPE GreenLake cluster.
* Install the Cribl Stream Kubernetes operator.

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

```yaml
export KUBECONFIG=<path_to_kube_settings>
kubectl get nodes -n cribl
kubectl get svc  -n cribl
```

Label the leader node and the worker nodes:

```yaml
kubectl label nodes <leader_node> stream=leader
kubectl label nodes <worker_node> stream=worker
```

Validate by running:

```yaml
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