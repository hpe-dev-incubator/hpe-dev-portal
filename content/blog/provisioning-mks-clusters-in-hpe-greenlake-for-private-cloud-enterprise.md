---
title: Provisioning MKS clusters in HPE GreenLake for Private Cloud Enterprise
date: 2025-08-08T08:09:07.564Z
author: Guoping Jia
authorimage: /img/guoping.png
disable: false
tags:
  - hpe-greenlake-for-private-cloud-enterprise
  - Kubernetes
  - "HPE Morpheus Enterprise "
  - Morpheus Kubernetes Services
  - kubectl
  - helm
---
<style> li { font-size: 27px; line-height: 33px; max-width: none; } </style>

[HPE GreenLake for Private Cloud Enterprise (PCE)](https://www.hpe.com/us/en/greenlake.html) can now enable the Morpheus Kubernetes Service (MKS) feature, allowing users to deploy and manage Kubernetes (K8s) clusters directly through [HPE Morpheus Enterprise software]((https://www.hpe.com/us/en/morpheus-enterprise-software.html)). With HPE GreenLake PCE, now in its *Beta* phase with MKS feature enabled, customers can take advantage of streamlined MKS cluster provisioning using predefined cluster layouts, making it easier to launch and manage their containerized workloads.

In this blog post, I will guide you through the process of provisioning an MKS cluster in HPE GreenLake PCE, followed by essential post-deployment-tasks, including downloading the *kubeconfig* file, scaling cluster with additional workers, upgrading the K8s cluster version,  deploying applications via running workflows, and ultimately, deleting the MKS cluster when needed. 

## Overview

[HPE GreenLake for Private Cloud Enterprise (PCE)](https://www.hpe.com/us/en/greenlake.html) is a fully managed *Infrastructure as a Service* (IaaS) offering that brings a modern, cloud-like experience to on-premises environments. It combines the flexibility of hybrid cloud with the enterprise-grade control and security required by enterprise IT. 

Through deep integration with [HPE Morpheus Enterprise](https://www.hpe.com/us/en/morpheus-enterprise-software.html), which serves as the cloud management and orchestration layer, HPE GreenLake PCE delivers a unified self-service interface for provisioning virtual machines (VMs), creating containers, and deploying applications, all governed by role-based access control (RBAC). This integration now enables support for the Morpheus Kubernetes Service (MKS) feature, allowing users to deploy and manage K8s clusters with built-in automation and observability capabilities. 

HPE Morpheus Enterprise provides a set of prebuilt MKS cluster layouts that support a variety of K8s versions and cluster types. These cluster layouts provision MKS clusters using the native K8s distribution, streamlining and accelerating deployment. This blog post walks through the process of creating an MKS cluster using one of these preconfigured cluster layouts.

## Prerequisites

Before starting, make sure you have the following:

* Access to HPE GreenLake PCE tenant with the '*Private Cloud Tenant Owner'* role, allowing administrative actions in the _**Virtual Machines**_ service 
* Group named *'Customer Department B'* and network *'Green-Segment'* already created
* HPE Morpheus Enterprise running version 8.0.5 or later
* MKS feature enabled in HPE GreenLake PCE, confirmed by the presence of the *Clusters* menu under _**Infrastructure**_:

![](/img/mks-feature.png)

## Provision an MKS cluster

To start provisioning an MKS cluster, navigate to HPE GreenLake PCE and click *Launch Service Console* from the _**Virtual Machines**_ service page. In the Service Console, click *Infrastructure* and select *Clusters*. 

![](/img/add-cluster.png)

In the *CLUSTERS* table, click **+Add Cluster** to initiate MKS cluster provisioning. Then follow the steps outlined below.

1. **Choose cluster type**

In the *CREATE CLUSTER* wizard, select _**KUBERNETES CLUSTER**_ as the *Cluster Type*, then click _**Next**_ to proceed.

![](/img/cluster-type.png)

2. **Select group**

Choose *GROUP*, such as *'Customer Department B'*:

![](/img/cluster-group.png)

3. **Specify cluster name**

Enter *CLUSTER NAME* as *'mks-demo'*, and optionally specify *RESOURCE NAME*, *DESCRIPTION*, and *LABELS*:

![](/img/cluster-name.png)

4. **Select cluster layout & configure master**

Select *LAYOUT* and *PLAN*, configure *VOLUMES*, and choose the appropriate *NETWORKS*, such as *'Green-Segment'*::

![](/img/cluster-config.png)

For demonstration purpose, the _**'MKS Kubernetes 1.31 Cluster on Ubuntu 22.04'**_ is selected. This cluster layout provisons an MKS cluster using a single master with K8s version *1.31*. 

**Important:** The *POD CIDR* and *SERVICE CIDR* define the internal IP ranges by routers to K8s *Pods* and *Services*. To prevent conflicts, ensure these CIDRs are distinct from the network settings.

5. **Configure worker**

Specify *NUMBER OF WORKERS*, along with *PLAN*, *VOLUMES*, and *NETWORKS*. You may retain the default settings or re-use the values previously configured for the master.

![](/img/cluster-worker.png)

6. **Review cluster details**

Skip the step for automation settings, then the cluster review page appears:

![](/img/cluster-review.png)

Click _**Complete**_ to begin provisioning the MKS cluster:

![](/img/cluster-provisioning.png)

## Verify MKS cluster

After a few minutes, the cluster *'mks-demo'* is created using the specified cluster layout: *MKS Kubernetes 1.31 Cluster on Ubuntu 22.04*. 

![](/img/cluster-status.png)

## Access MKS cluster

Click the *'mks-demo'* cluster to view its details under the *Summary* tab:

![](/img/cluster-details.png)

Navigate to the _**Control**_ tab and run the command *'kubectl get nodes'* to view the cluster's node information:

![](/img/cluster-nodes.png)

In line with the cluster type, *MKS Kubernetes 1.31 Cluster on Ubuntu 22.04.*, the *'mks-demo'* cluster consists of one master and three workers.

## Run daily cluster operations

From the provisioned MKS cluster, the _**Actions**_ menu provides a curated set of supported operations that simplify and streamline day-to-day cluster management. From downloading kubeconfig to scaling the cluster and performing upgrade, these built-in actions help automate key cluster operations, making cluster administration faster, easier and more consistent. 

![](/img/cluster-actions.png)

The following sections explore how to perform these day-to-day cluster operations.

* **View and download kube config**

From the *'mkd-demo'* cluster, click _**Actions**_:

![](/img/view-kubeconfig-menu.png)

Click *View Kube Config* to show the Kube config of the cluster: 

![](/img/view-kubeconfig.png)

Save the Kube config content to a file, for example, *'mks-demo.kubeconfig'* on a *Linux* client as shown below. This file can then be used with the *kubectl* CLI or the *Helm* tool to access the MKS cluster and deploy applications using either YAML manifests or Helm charts. 

![](/img/kubectl-console.png)

* **Add addtional worker**

In K8s, adding new workers to an existing cluster involves setting up self-registration, provisioning VM instances, and integrating them into the cluster. This process can be time-consuming and often demands custom automation scripts to streamline the workflow.

In MKS, this operation is supported by simply clicking _**Actions**_ from the cluster:

![](/img/add-worker.png)

Click *Add VMware Kubernetes Worker* to begin adding new worker to the cluster. Then follow the steps outlined below:

1. Specify *NAME* and the optional *DESCRIPTION*:

![](/img/cluster-add-worker-name.png)

2. Select *PLAN* and configure *VOLUMES* and *NETWORKS*: 

![](/img/cluster-add-worker-config.png)

If you want to add multiple workers at once, set the desired value in the *NUMBER OF WORKERS* field. 

3. Review worker details

Skip the step for automation settings, then the worker review page appears:

![](/img/cluster-add-worker-review.png)

Click _**Complete**_ to begin provisioning new VM instances and adding them to the cluster as new workers. 

![](/img/cluster-new-worker-adding.png)

4. Verify new worker

Navigate to the _**Nodes**_ tab to check the new worker *'new-mks-worker'* is listed in the node list:

![](/img/cluster-new-worker.png)

* **Upgrade MKS cluster**

K8s follows a frequent release cycle, every 4 months on average, to ensure stability, innovation and timely security updates. While upgrading a K8s cluster is crucial for maintaining security, performance, and access to the latest features, it remains a complex and demanding task. The upgrade process presents significant challenges, including managing scale and complexity, minimizing downtime risks, and handling substantial operational overhead that can span weeks and require coordination across multiple teams.

In MKS, upgrading the cluster is supported by simply clicking _**Actions**_ from the cluster:

![](/img/upgrade-cluster-menu.png)

Click *Upgrade Cluster* to open the *UPGRADE CLUSTER* pop-up, which desplays a list of supported versions available for upgrade:

![](/img/upgrade-cluster.png)

Select version *1.32.7*, then click _**Apply**_ to start upgrading the cluster:

![](/img/upgrading-cluster.png)

After a few minutes, the cluster status updates to _**Ok**_, displaying its cluster layout as *'MKS Kubernetes 1.32 Cluster on Ubuntu 22.04'*:

![](/img/upgraded-cluster.png)

## Deploy applications

After downloading the kubeconfig file as outlined earlier, you can easily deploy applications to the MKS cluster using the *kubectl* CLI or *Helm*. This section walks you through deploying applications using the built-in features available from the provisioned MKS cluster in the *Service Console*.

* **Deploy applications under cluster's *Control* tab**

Under _**Control**_ tab of the *'mks-demo'* cluster, deploy a sample application 'nginx-demo' to the namespace *app-demo* by running the commands *'kubectl create namespace app-demo'* and *'kubectl create deployment nginx-demo --image=nginx --namespace app-demo'*.

![](/img/kubectl-create-deploy.png)

* **Deploy applications via *Run Workload* under *Actions***

Click *Run Workload* under _**Actions**_ from the *'mks-demo'* cluster:

![](/img/run-workload-menu.png)

Define the following *Deployment* YAML in *CUSTOM SPEC* to deploy the *'nginx-demo'* application to the *'default'* namespace:

```shell
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: nginx
  name: nginx-demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx
        name: nginx
```

![](/img/run-workload.png)

Run *'kubectl get all -n default'* to confirm that the *nginx-demo* has been deployed to the *default* namespace:

![](/img/get-workload.png)

## Conclusion

This blog post provided a step-by-step guide to provisioning an MKS cluster using the MKS Beta feature within the HPE GreenLake PCE environment. By selecting from a list of preconfigured MKS cluster layouts, you can quickly deploy an MKS cluster with your preferred cluster type and K8s version. Once provisioned, adding more workers is as simple as clicking the button from the cluster's *Actions* menu. Cluster upgrading to a newer K8s version follows the same streamlined process. This makes cluster administration more efficient, consistent, and user-friendly.

Please keep coming back to the [HPE Developer Community blog](https://developer.hpe.com/blog/) to learn more about HPE GreenLake PCE and get more ideas on how you can use it in your everyday operations.