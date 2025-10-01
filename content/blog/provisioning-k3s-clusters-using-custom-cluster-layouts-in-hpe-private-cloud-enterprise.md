---
title: Provisioning K3S clusters using custom cluster layouts in HPE Private
  Cloud Enterprise
date: 2025-09-26T15:47:53.318Z
author: Guoping
authorimage: /img/guoping.png
disable: false
tags:
  - Custom cluster layout
  - Kubernetes
  - HPE Private Cloud Enterprise
  - hpe-private-cloud-enterprise
  - Input template
  - K3s
  - MKS
  - HPE Morpheus Enterprise
---
This blog post outlines the steps to create a custom cluster layout for provisioning a Kubernetes (K8s) cluster using *K3s*, a lightweight K8s distribution, within HPE Private Cloud Enterprise environment. By utilizing a list of key Morpheus components, such as *Node Type*, *File Template*, *Option List*, *Input*, *Automation Task and Workflow*, and *Cluster Layout*, a custom cluster layout is created along with the *K3s* install script. Once created, this custom cluster layout enables provisioning and management of K3s clusters directly from the the Morpheus Clusters page. Same as the MKS provisioning, the deployed K3s clusters benefit from a curated set of built-in operations, including downloading kubeconfig, scaling the clusters, performing K3s upgrades, and cleaning up the clusters. These integrated capabilities streamline essential cluster management tasks, making K8s administration more efficient, easier, and user-friendly in HPE Private Cloud Enterprise. 

## Overview


[HPE Private Cloud Enterprise](https://www.hpe.com/us/en/hpe-private-cloud-enterprise.html) is a fully managed *Infrastructure as a Service* (IaaS) offering that brings a modern, cloud-like experience to on-premises environments. It combines the flexibility of hybrid cloud with the enterprise-grade control and security required by enterprise IT. 



Through the integration with [HPE Morpheus Enterprise](https://www.hpe.com/us/en/morpheus-enterprise-software.html), which serves as the cloud management and orchestration layer, HPE Private Cloud Enterprise delivers a unified self-service interface for provisioning virtual machines (VMs), creating containers, and deploying applications, all governed by role-based access control (RBAC). This integration now supports the Morpheus Kubernetes Service (MKS) feature, enabling users to provision and manage MKS clusters with a set of prebuilt MKS cluster layouts using the native K8s distribution. Meanwhile, it support create a custom cluster layout to provision an K8s cluster with the third-party K8s distribution, such as *Amazon EKS Anywhere* or *K3s*. 

The following sections will show the detailed steps to create a custom cluster layout and use it for provisioning an K3s cluster in HPE Private Cloud Enterprise. Once provisioned, it will show you how to upgrade the K3s cluster to a newer K3s version by simply  clicking the button from the cluster's *Actions* menu. It demonstrates how these built-in actions help automate key cluster operations, making cluster administration faster, easier, and more consistent.


## Prerequisites

Ensure that the following prerequisites are fulfilled:



* Access to an HPE Private Cloud Enterprise workspace with the '*Private Cloud Tenant Owner'* role, allowing administrative actions in the ***Virtual Machines*** service. 
* The group named *'CFE Department B Group'* and the network *'Green-network'* have already been created.
* HPE Morpheus Enterprise running *version 8.0.5* or higher.
* The MKS feature is enabled in HPE Private Cloud Enterprise. You can confirm the presence of the *Clusters* menu from ***Infrastructure*** tab.

## Create custom cluster layout

You can refer to the blog post [MKS]() for the detailed process how to log in to HPE GreenLake Cloud and launch HPE Morpheus enterprise.
 
### 1. Create node types

From the HPE Morpheus Enterprise **Dashboard**, following the below steps to create node types for K3s master and worker nodes.

#### Create an K3s primary master node type

* Navigate to **Library > Blueprints > ** *Node Types* tab. Click ***+Add***.
* Populate the following fields according to below screen. Click ***Save changes***.

![](/img/k3s-node-type-primary-master.png)

2. Create an K3s secondary master node type

* Navigate to **Library > Blueprints > ** *Node Types* tab. Click ***+Add***.
* Populate the following fields according to below screen. Click ***Save changes***.

![](/img/k3s-node-type-secondary-master.png)

3. Create an K3s worker node type

* Navigate to **Library > Blueprints > ** *Node Types* tab. Click ***+Add***.
* Populate the following fields according to below screen. Click ***Save changes***.

![](/img/k3s-node-type-worker.png)

### Create file template

1. Create a file template to add K8s Secret

* Navigate to **Library > Templates > ** *File Templates* tab. Click ***+Add***.
* Populate the following fields according to below screen. Click ***Save changes***.

![](/img/file-template.png)

2. Set up the K3s primary master node

Add file template to the K3s primary Master Node Type.

* Navigate to **Library > Blueprints > ** *Node Types* tab. Click ***+Edit*** to *k3s-primary-master*.
* Under VMware VM Options, populate *FILE TEMPLATES* as below. Click ***Save changes***.

![](/img/primary-master-node-type-edit.png)

### Create option list

1. Create an Option List for K3s Version

* Navigate to **Library** > **Options** > ** *Option Lists* tab. Click ***+Add***.
* Click **+Add**.
* Populate the following fields. Click **Save changes**.

![](/img/option-list-k3s-version.png)

2. Create an Option List for K3s Networking

* Navigate to **Library > Options > Option Lists**. Click ***+Add***.
* Click **+Add**.
* Populate the following fields. Click ***Save changes***.

![](/img/option-list-k3s-networking.png)

### Create inputs

1. Create an Input for K3s Version

* Navigate to **Library** > **Options** > **Inputs**. Click ***+Add***.
* Click **+Add**.
* Populate the following fields. Click ***Save changes***.

![](/img/input-k3s-version.png)

2. Create an Input for K3s Networking

* Navigate to **Library** > **Options** > **Inputs**. Click ***+Add***.
* Click **+Add**. Click ***Save changes***.

![](/img/input-k3s-networking.png)

3. Create an Input for K3s Cluster VIP Address

* Navigate to **Library > Options > Inputs**. Click ***+Add***.
* Click **+Add**.
* Populate the following fields. Click ***Save changes***.

![](/img/input-k3s-vip.png)

4. Create an Input for K3s Cluster CIDR

* Navigate to **Library > Options > Inputs**. Click ***+Add***.
* Click **+Add**
* Populate the following fields. Click ***Save changes***.

![](/img/input-k3s-cluster-cidr.png)

5. Create an Input for K3s Service CIDR

* Navigate to **Library > Options > Inputs**. Click ***+Add***.
* Click **+ADD**
* Populate the following fields. Click ***Save changes***.

![](/img/input-k3s-service-cidr.png)

### Create automation tasks and workflows

1. Create an Automation Task for HA K3s Cluster Install

* Navigate to \*\*Library > Automation\*\*. Click ***+Add***.
* Click \*\**+Add\*\*.*
* Populate the following fieldsPopulate the following fields. Click ***Save changes***.

![](/img/k3s-install-task.png)

*Note:* The K3s install script has been available from github repo at

*https://github.com/GuopingJia/k3s-demo/blob/main/K3s-Install-Script.sh*

2. Create an Automation Workflow for K3s HA Install

* Navigate to **Library** > **Automation** > *Workflows tab*. Click ***+Add***.
* Click *+ADD*
* Populate the following fieldsPopulate the following fields. Click ***Save changes***.

![](/img/k3s-install-workflow.png)

### Create K3s custome cluster layout

1. Create an K3s HA cluster layout

* Navigate to **Library** > **Blueprints** > *Cluster Layouts tab*. Click ***+Add***.
* Click *+ADD*
* Populate the following fieldsPopulate the following fields. Click ***Save changes***.

![](/img/k3s-ha-cluster-layout.png)

2. Create a single-master K3s cluster layout

* Navigate to **Library** > **Blueprints** > *Cluster Layouts tab*. Click ***+Add***.
* Click **+Add**
* Populate the following fieldsPopulate the following fields. Click ***Save changes***.

![](/img/k3s-single-master-cluster-layout.png)

## Provision an K3s cluster

* Navigate to **Infrastructure > Clusters**. Click ***+Add Cluster***.
* Select *Cluster Type* as *KUBERNETES CLUSTER*. Click ***Next***.

![](/img/k3s-cluster-type.png)

* Select *Group*, e.g., *CFE Department B Group*. Click ***Next***.

![](/img/k3s-group.png)

* Enter NAME, and optional RESOURCE NAME, DESCRIPTION and LABELS. Click ***Next***.

![](/img/k3s-cluster-name.png)

* Select LAYOUT as *K3S HA Cluster* and PLAN. Specify VOLUMES, select NETWORKS and set VERSION, NETWORKING, VIP ADDRESS, CLUSTER CIDR and SERVICE CIDR. Click ***Next***.

![](/img/k3s-cluster-master-config.png)

* Specify NUMBER OF WORKERS and keep other default settings. Click **Next**.

![](/img/k3s-cluster-worker-config.png)

* Skip Automation step and review settings. Click ***Complete***.

![](/img/k3s-cluster-review.png)

After a few minutes, the K3s cluster *k3s-ha* has been created with the custom cluster layout *K3S-HA-cluster*.

![](/img/k3s-ha-cluster.png)

## Verify K3s cluster

* Navigate to **Infrastructure > Clusters**.
* Click the K3s Cluster *k3s-ha*.

![](/img/k3s-ha-cluster-details.png)

* From the *Cluster* detail page, click the *History* tab. Each individual process output available by clicking on target process

![](/img/k3s-ha-cluster-history.png)

## Access the K3s HA Cluster

* Navigate to **Infrastructure > Clusters**.
* Click the Cluster name '*k3s-ha*' to the Cluster detail page.
* From *Control* tab, type commands, e.g., *get nodes*.

![](/img/k3s-ha-cluster-access.png)

From ***Actions***, you can click *Upgrade Cluster* to upgrade the K3s cluster to its new version. 

![](/img/k3s-ha-cluster-upgrade.png)

## Conclusion



This blog post provided a step-by-step guide to creating custom cluster layouts using the K3s install script and using them to provision an K3s cluster. Along with the preconfigred MKS cluster layouts, you can provision your K8s clusters using both native K8s distribution and any thrid party ones within the HPE Private Cloud Enterprise environment. Once cluster provisioned, it takes advantages of the list of supported operations from the cluster's *Actions* menu, downloading the kubeconfig file, adding more workers, upgrading cluster to a newer version, and cleaning up the cluster when it's used anymore. This makes cluster administration more efficient, consistent, and user-friendly.



Please keep coming back to the [HPE Developer Community blog](https://developer.hpe.com/blog/) to learn more about HPE Private Cloud Enterprise and get more ideas on how you can use it in your everyday operations.
