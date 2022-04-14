---
title: Deep Learning Model Training – A First-Time User’s Experience with
  Determined - Part 1
date: 2022-04-14T17:21:31.857Z
author: Denis Choukroun
authorimage: https://gravatar.com/avatar/f66dd9562c53567466149af06ae9d4f1?s=192
thumbnailimage: /img/detai-high-levl-architecture-thumbnail.png
tags:
  - determined-ai
  - opensource
  - data-scientist
  - data-ml-engineer
  - developer
  - machine-learning
  - deep-learning
  - artificial intelligence
  - Kubernetes
  - "Ezmeral "
---
[Determined](https://github.com/determined-ai/determined) is an open-source deep learning training platform that helps data science teams train models more quickly, easily share GPU resources, and collaborate more effectively. The open-source version of Determined can be deployed on-premises in your data center, on any hardware, on Kubernetes, or in public clouds – wherever GPU resources are available to obtain the full benefit of Determined. 

In this two-part blog series, I’ll share my experience as a first-time user of Determined. This blog series aims to provide a high-level overview of the basic concepts behind Determined and why you should consider it if you find doing deep learning at scale a bit challenging.

In this first part, I’ll put on my IT Operations manager’s hat and explain how I deploy Determined on a Kubernetes cluster in an on-premises HPE Ezmeral Runtime Enterprise deployment. In this instance, it will enable my organization’s data science team to quickly try out Determined and assess its capabilities for their data science work. 

In the second part of this series, I'll wear my data scientist/ML engineer hat as a member of a larger data science team that wants to get started with Determined and explore some of its fundamental concepts and features. I’ll review how to train neural network models using one or more GPUs with distributed training, and advanced functionality such as state-of-the-art hyperparameter search to improve model accuracy and find the best version of a model.

## Determined AI

Determined is an open-source platform built to accelerate deep learning (DL) model development and experimentation for data science teams at scale, handling the load easily as teams, clusters and data sets all increase in size. Teams can use Determined to build, train, and optimize their deep learning models while easily sharing GPU compute resources. Determined AI was acquired by HPE in June 2021 and now operates as a part of the High Performance Computing (HPC) and Artificial Intelligence (AI) business unit.

Determined provides the APIs, a command line interface (CLI), a web user interface, and tools for accelerating model experiments with integrated capabilities such as distributing training and automatic model tuning with hyperparameter search, also known as hyperparameter optimization (HPO).

## HPE Ezmeral Runtime Enterprise

Built from the ground up to be open and run in hybrid environment, [HPE Ezmeral Runtime Enterprise](https://developer.hpe.com/platform/hpe-ezmeral-runtime/home/) provides a secure, enterprise-grade platform designed to run both cloud-native and non-cloud-native applications at scale. It provides an integrated data fabric, multi-cluster Kubernetes management, enterprise-grade security and multi-tenancy capabilities.

HPE Ezmeral Runtime Enterprise with the pre-integrated HPE Ezmeral Data Fabric provides all the networking, compute, and storage resources needed to run the Determined open-source platform on premises on Kubernetes. 

## Components of Determined on Kubernetes

![Figure1 Determined  High Level Architecture on Kubernetes ](/img/detai-lab-environment-architecture.png "Figure1 Determined High Level Architecture on Kubernetes")

As the figure above indicates, my experimental deployment of Determined consists of:

* A Kubernetes cluster, managed by HPE Ezmeral Runtime Enterprise, with a set of worker nodes with [NVIDIA GPUs support enabled](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/) (1 GPU device per worker node in my Kubernetes cluster).
* A Determined **Master**, which is attached to a **PostgreSQL** database. The Determined Master and Database run as containers, each within a Kubernetes POD, in the worker nodes of the Kubernetes cluster. 

  * The Master hosts the interfaces service endpoint that clients use to communicate with Determined through a CLI, WebUI, and APIs. 
  * The Master schedules tasks and brings up PODs on Kubernetes worker nodes to run tasks on demand. For example, the model training tasks and auxiliary tasks (TensorBoard, Notebook).
  * As training tasks execute, the Master maintains communication with training task PODs and saves training model metadata, like the training and validation metrics received from the training tasks, as well as the state of the tasks, in the PostgreSQL database, for model experiment tracking and analysis.  
* An ingress gateway makes the Master's interface service endpoint reachable from outside the Kubernetes cluster.
* A persistent storage volume for experiment tracking by logging the model’s metadata information, such as hyperparameters, the training and validation metrics, logs, date/time, on the PostgreSQL database. 
* A volume shared across the Kubernetes worker nodes. The shared file system is needed to store the **model artifacts**, such as model code and model **checkpoint** files. The model checkpoint files are saved versions of the validated models that data science teams can access later for testing and analysis. This makes them available to a deployment or serving solution such as Seldon core. The shared file system can also be used by Determined to store the model datasets on which the model is trained by the training tasks.

## Installing Determined on a Kubernetes cluster managed by HPE Ezmeral Runtime Enterprise

The open-source version of Determined is available as a Helm chart and can be installed on a Kubernetes cluster running on HPE Ezmeral Runtime Enterprise. As such, I download the chart and modify the chart *values.yaml* file (which I’ll explain in this section) before installation of the Helm chart in my Kubernetes cluster.

Before deploying the Helm chart, an important aspect to understand is how to connect Determined to a shared storage volume. For this, I need to create a new tenant named **determinedai** on HPE Ezmeral Runtime Enterprise for my Kubernetes cluster. This tenant serves as a Kubernetes cluster "namespace". Each tenant created in HPE Ezmeral Runtime Enterprise is automatically provisioned with a tenant’s shared storage volume on the pre-integrated HPE Ezmeral Data Fabric cluster located at **/<DataFabric-clusterName>/exthcp/tenant-<ID>/fsmount**. The tenant’s shared storage volume is then automatically mounted on each Kubernetes cluster’s host on the path **/opt/bluedata/mapr/mnt**. This enables Determined to connect to the shared storage */opt/bluedata/mapr/mnt/<DataFabric-clusterName>/exthcp/tenant-<ID>/fsmount/* for accessing the training and validation datasets, and for storing model artifacts.

Furthermore, some aspects of Helm chart deployment must be configured before installing Determined on Kubernetes. Although most of the default Helm chart configuration settings are suitable for getting started with Determined on Kubernetes, some parameters must be configured in the chart *values.yaml* file to match the designated Kubernetes cluster deployment and available compute, storage and network resources such as:

* The use of the Kubernetes *NodePort* service type to expose the Determined Master service endpoint outside the Kubernetes cluster,
* The shared storage volume path to use to save validated model files and checkpoints for fault tolerance, 
* The amount of GPU resources available on the Kubernetes worker hosts, 
* The [advanced scheduler](https://docs.determined.ai/latest/concepts/scheduling.html) for large Kubernetes clusters with multiple GPUs per worker host. For my experimental Determined deployment, as I only have 1 GPU per worker host, the default Kubernetes scheduler will be used by Determined to schedule training tasks.  
* The Determined *Admin* and *Determined* default user account passwords
* The friendly name for Determined deployment.

For more information about the configuration options for the Helm Chart deployment, see the [installation guide documentation](https://docs.determined.ai/latest/sysadmin-deploy-on-k8s/install-on-kubernetes.html).

In my Determined deployment on Kubernetes, the following aspects of the Determined Helm chart deployment configuration is set in the chart *values.yaml* file as shown below. Other configuration settings are set to their default values.

```Markdown
useNodePortForMaster: true
checkpointStorage:
   type: shared_fs
   hostPath: /opt/bluedata/mapr/mnt/<DF-clusterName>/exthcp/tenant-<ID>/fsmount/checkpoints
maxSlotsPerPod: 1
clusterName: stagingdetai
defaultPassword: <myPassword>
```

With the namespace created, the kubeconfig file for the Kubernetes cluster sourced in my Linux workstation, and the Helm chart deployment configuration files in hand, I can deploy Determined software on the Kubernetes namespace *determinedai* using the following command:

```bash
helm install stagingdetai <relative path to determined-helm-chart repository> –n determinedai [--dry-run]
```

> Note: I recommend first using the `--dry-run` flag to validate and verify the chart manifest before actual Helm chart deployment. 

Upon completion, I can use the following commands to check the status of the Helm chart deployment for my Determined instance:

```bash
helm list -n determinedai
helm status stagingdetai -n determinedai
```

![Helm Chart deployment status](/img/determined-helm-install-status.png "Helm Chart deployment status")

At the time of the Determined installation on the Kubernetes cluster, an instance of the **Determined Master** and a **PostgreSQL database** are deployed in the Kubernetes cluster. Using the kubectl command below allows me to check the resources that are deployed on the Kubernetes cluster: 

```bash
kubectl get pod,services –n determinedai
```


![](/img/determined-pod-svc.png)

As shown in the above image, these components run as a container within a Kubernetes POD. Service endpoints for the Determined’s Master and the Database services are also deployed. The Determined Master service endpoint is a NodePort service that enables HPE Ezmeral Runtime Enterprise to expose that service outside the Kubernetes cluster through its **ingress gateway.**
