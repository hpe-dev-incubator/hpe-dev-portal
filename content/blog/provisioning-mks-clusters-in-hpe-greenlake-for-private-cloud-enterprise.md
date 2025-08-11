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
---
[HPE GreenLake for Private Cloud Enterprise (PCE)](https://www.hpe.com/us/en/greenlake.html) can now enable the Morpheus Kubernetes Service (MKS) feature, allowing users to deploy and manage Kubernetes (K8s) clusters directly through [HPE Morpheus Enterprise software]((https://www.hpe.com/us/en/morpheus-enterprise-software.html)). With HPE GreenLake PCE, now in its *Beta* phase with MKS feature enabled, customers can take advantage of streamlined MKS cluster provisioning using predefined cluster layouts, making it easier to launch and manage their containerized workloads.

In this blog post, I will guide you through the process of provisioning an MKS cluster in HPE GreenLake PCE, followed by essential post-deployment-tasks, including downloading the *kubeconfig* file, upgrading the K8s cluster version, scaling cluster with additional workers, deploying applications via running workflows, and ultimately, deleting the MKS cluster when needed. 

## Overview

[HPE GreenLake for Private Cloud Enterprise (PCE)](https://www.hpe.com/us/en/greenlake.html) is a fully managed *Infrastructure as a Service* (IaaS) offering that brings a modern, cloud-like experience to on-premises environments. It combines the flexibility of hybrid cloud with the enterprise-grade control and security required by enterprise IT. 

Through deep integration with [HPE Morpheus Enterprise](https://www.hpe.com/us/en/morpheus-enterprise-software.html), which serves as the cloud management and orchestration layer, HPE GreenLake PCE delivers a unified self-service interface for provisioning virtual machines (VMs), creating containers, and deploying applications, all governed by role-based access control (RBAC). This integration now enables support for the MKS feature, allowing users to deploy and manage K8s clusters with built-in automation and observability capabilities. 

HPE Morpheus Enterprise provides a set of prebuilt MKS cluster layouts that support a variety of K8s versions and cluster types. These cluster layouts provision MKS clusters using the native K8s distribution, streamlining and accelerating deployment. This blog post walks through the process of creating an MKS cluster using one of these preconfigured cluster layouts.

## Prerequisites

Before starting, make sure you have the following:

* Access to HPE GreenLake PCE tenant with the '*Private Cloud Tenant Owner'* role, allowing administrative actions in the _**Virtual Machines**_ service 
* HPE Morpheus Enterprise running version 8.0.5 or later
* MKS feature being enabled in HPE GreenLake PCE, confirmed by the presence of the *Clusters* menu under _**Infrastructure**_:

![](/img/mks-feature.png)

## Provision an MKS cluster

To start provisioning an MKS cluster, navigate to HPE GreenLake PCE and click *Launch Service Console* from the _**Virtual Machines**_ service page. In the Service Console, click *Infrastructure* and select *Clusters*. 

![](/img/add-cluster.png)

In the *CLUSTERS* table, click **+Add Cluster** to initiate MKS cluster provisioning. Then follow the steps outlined below.

1. **Choose cluster type**

In the *CREATE CLUSTER* wizard, select _**KUBERNETES CLUSTER**_ as the *Cluster Type*, then click _**Next**_ to proceed.

![](/img/cluster-type.png)

2. **Select group**

Choose *GROUP*, such as _**Customer Department B**_:

![](/img/cluster-group.png)

3. **Specify cluster name**

Enter *CLUSTER NAME* as _**mks-demo**_, and optionally specify *RESOURCE NAME*, *DESCRIPTION*, and *LABELS*:

![](/img/cluster-name.png)

4. **Select cluster layout & configure master**

Select *LAYOUT* and *PLAN*, configure *VOLUMES*, and choose the appropriate *NETWORKS*:

![](/img/cluster-config.png)

For demonstration purpose, the _**'MKS Kubernetes 1.31 Cluster on Ubuntu 22.04'**_ is selected. This cluster layout provisons an MKS cluster using a single master with K8s version *1.31*. 

**Important:** The *POD CIDR* and *SERVICE CIDR* define the internal IP ranges by routers to K8s *Pods* and *Services*. To prevent conflicts, ensure these CIDRs are distinct from the network settings.

5. **Configure worker**

Specify *NUMBER OF WORKERS*, along with *PLAN*, *VOLUMES*, and *NETWORKS*. You may retain the default settings or re-use the values previously configured for the master node.

![](/img/cluster-worker.png)

6. **Review cluster details**

Skip the step for automation settings, then the cluster review page appears:

![](/img/cluster-review.png)

Click _**Complete**_ button to begin provisioning the MKS cluster:

![](/img/cluster-provisioning.png)

## Verify MKS Cluster

After a few minutes, the cluster _**mks-demo**_ is created using the specified cluster layout: *MKS Kubernetes 1.31 Cluster on Ubuntu 22.04*. 

![](/img/cluster-status.png)

## Access MKS Cluster

Click the _**mks-demo**_ cluster to view its details under the *Summary* tab:

![](/img/cluster-details.png)

Navigate to the *Control* tab and run the command *'kubectl get nodes'* to view the cluster's node information:

![](/img/cluster-nodes.png)

In line with the cluster type, *MKS Kubernetes 1.31 Cluster on Ubuntu 22.04.*, the **mks-demo** cluster consists of one master node and three worker nodes.

## Supported day-to-day operations

On the cluster details page, the **Actions** menu provides a list of supported day-to-day operations for managing the cluster lifecycle:

![](/img/cluster-actions.png)

* **View and download Kube config**

![](/img/view-kubeconfig-menu.png)

Click *View Kube Config* to show the Kube config content of the MKS cluster. 

![](/img/view-kubeconfig.png)

Save the Kube config content to a file. This file can then be used with the *kubectl* CLI or the *Helm* tool to access the MKS cluster and deploy applications using either YAML menifest files or Helm charts. 

![](/img/kubectl-console.png)

* **Add addtional worker**

In K8s, adding new workers to an existing cluster involves setting up self-registration, provisioning VM instances, and integrating them into the cluster. This process can be time-consuming and often demands custom automation scripts to streamline the workflow.

In MKS, this operation is easily supported via the **Actions** menu. To begin adding a new worker to the MKS cluster, simply click **Add VMware Kubernetes Worker** and follow the steps outlined below:

![](/img/add-worker.png)

1. Specify *NAME* and the optional *DESCRIPTION*:

![](/img/cluster-add-worker-name.png)

2. Select *PLAN* and set up *VOLUMES*, *NETWORKS*. 

![](/img/cluster-add-worker-config.png)

If you want to add multiple workers at once, simply set the desired value in the **NUBMER OF WORKERS** field. 

After reviewing the worker configuration, click *Complete* to begin provisioning new VM instances. These will be automatically added to the MKS cluster as new workers. 

![](/img/cluster-new-worker-adding.png)

Click the *Nodes* tab, the new worker 'new-mks-worker' shows in the node list.

![](/img/cluster-new-worker.png)

* **Upgrade MKS cluster version**

K8s follows a frequent release cycle, every 4 months on average, to ensure stability, innovation and timely security updates. While upgrading a K8s cluster is crucial for maintaining security, performance, and access to the latest features, it remains a complex and demanding task. The upgrade process presents significant challenges, including managing scale and complexity, minimizing downtime risks, and handling substantial operational overhead that can span weeks and require coordination across multiple teams.

In MKS, upgrading the cluster is straightforward using the **Actions** menu. To initiate the process, click **Upgrade Cluster**. 

![](/img/upgrade-cluster-menu.png)

This opens the *UPGRADE CLUSTER* pop-up, where you see the list of supported versions available for upgrade:

![](/img/upgrade-cluster.png)

After *Apply*, it starts upgrading the cluster to the new version.

![](/img/upgrading-cluster.png)

After a few minutes, the cluster status updates to  **Ok**, displaying its layout as *MKS Kubernetes 1.32 Cluster on Ubuntu 22.04*:

![](/img/upgraded-cluster.png)

## Deploy applications

* **Deploy applications under Control tab**

Under **Control** tab from the cluster *mks-demo*, deploy a sample application 'nginx-demo' to the namespace *app-demo* by running the command *kubectl create deployment nginx-demo --image=nginx --namespace app-demo*.

![](/img/kubectl-create-deploy.png)

* **Deploy applications via Run Workload**

Click *Run Workload* from **Actions** of the cluster *mks-demo*

![](/img/run-workload-menu.png)

Provide the following *Deployment* YAML file to *CUSTOM SPEC* to deploy the same *nginx-demo* application to the namespace *default*:

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

Type *'kubectl get all -n default'* to verify the application *nginx-demo* is deployed to the namespace *default*:

![](/img/get-workload.png)

## Conclusion

This blog post provided a step-by-step guide to provisioning an MKS cluster within the HPE GreenLake PCE environment using the enabled MKS Beta feature. By selecting from a list of pre-configured MKS cluster layouts, you can quickly deploy your MKS cluster with the expected cluster type and the desired K8s cluster version. After cluster provisioning, adding additional workers is as simple as clicking the button from the *Actions* menu. You can also upgrade your MKS cluser to a newer K8s version by following up the same streamlined process. 

Please keep coming back to the [HPE Developer Community blog](https://developer.hpe.com/blog/) to learn more about HPE GreenLake PCE and get more ideas on how you can use it in your everyday operations.