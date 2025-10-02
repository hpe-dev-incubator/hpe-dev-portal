---
title: Provisioning K3S clusters using custom cluster layouts in HPE Private
  Cloud Enterprise
date: 2025-09-26T15:47:53.318Z
author: Guoping Jia
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
This blog post outlines the steps to create a custom cluster layout for provisioning a Kubernetes (K8s) cluster using *K3s*, a lightweight K8s distribution, within HPE Private Cloud Enterprise environment. By utilizing a list of key Morpheus components, such as *Node Type*, *File Template*, *Option List*, *Input*, *Automation Task and Workflow*, and *Cluster Layout*, a custom cluster layout is created along with the *K3s* install script. Once created, this custom cluster layout enables provisioning and management of K3s clusters directly from the the Morpheus Clusters page. Same as the MKS, the deployed K3s clusters benefit from a curated set of built-in operations, including downloading kubeconfig, scaling the clusters, performing K3s upgrades, and cleaning up the clusters. These integrated capabilities streamline essential cluster management tasks, making K8s administration more efficient, easier, and user-friendly in HPE Private Cloud Enterprise. 

## Overview


[HPE Private Cloud Enterprise](https://www.hpe.com/us/en/hpe-private-cloud-enterprise.html) is a fully managed *Infrastructure as a Service* (IaaS) offering that brings a modern, cloud-like experience to on-premises environments. It combines the flexibility of hybrid cloud with the enterprise-grade control and security required by enterprise IT. 



Through the integration with [HPE Morpheus Enterprise](https://www.hpe.com/us/en/morpheus-enterprise-software.html), which serves as the cloud management and orchestration layer, HPE Private Cloud Enterprise offers a unified self-service interface for provisioning virtual machines (VMs), creating containers, and deploying applications, all governed by role-based access control (RBAC). This integration now supports the Morpheus Kubernetes Service (MKS), enabling users to provision and manage MKS clusters using a set of prebuilt MKS cluster layouts based on the native K8s distribution. Additionally, customers can define custom cluster layouts to provision K8s clusters using third-party K8s distribution such as *Amazon EKS Anywhere* or *K3s*. 

The following sections will walk you through the process of creating a custom cluster layout and using it provision an K3s cluster within HPE Private Cloud Enterprise. Once the cluster is provisioned, you will learn how to upgrade it to a newer K3s version using one of the it will show you how to upgrade the K3s cluster to a newer K3s version using one of the supported operations from the cluster's *Actions* menu. These built-in automation features streamline essential cluster operations, making cluster administration faster, easier, and more consistent.


## Prerequisites

Ensure that the following prerequisites are fulfilled:



* Access to an HPE Private Cloud Enterprise workspace with the '*Private Cloud Tenant Owner'* role, allowing administrative actions in the ***Virtual Machines*** service. 
* The group named *'CFE Department B Group'* and the network *'Green-network'* have already been created.
* HPE Morpheus Enterprise running *version 8.0.5* or higher.
* The MKS feature is enabled in HPE Private Cloud Enterprise. You can confirm the presence of the *Clusters* menu from ***Infrastructure*** tab.

## Create custom cluster layout

You can refer to the blog post [Provisioning MKS clusters in HPE Private Cloud Enterprise](https://developer.hpe.com/blog/provisioning-mks-clusters-in-hpe-greenlake-for-private-cloud-enterprise/) for the detailed process how to log in to HPE GreenLake Cloud and launch HPE Morpheus enterprise.
 
### 1. Create node types

From the HPE Morpheus Enterprise **Dashboard**, following the below steps to create node types for K3s master and worker nodes.

#### Create an K3s primary master node type

* Navigate to **Library > Blueprints > ** *Node Types* tab. Click ***+Add***.
* Enter NAME as *k3s-primary-master*, choose *Virtual Image* option and select VM IMAGE as *Morpheus Ubuntu 20.04 20250218 (vmdk) - 1178*. Click ***Save changes***.

![](/img/k3s-node-type-primary-master.png)

#### Create an K3s secondary master node type

* Navigate to **Library > Blueprints > ** *Node Types* tab. Click ***+Add***.
* Enter NAME as *k3s-secondary-master*, choose *Virtual Image* option and select VM IMAGE as *Morpheus Ubuntu 20.04 20250218 (vmdk) - 1178*. Click ***Save changes***.

![](/img/k3s-node-type-secondary-master.png)

#### Create an K3s worker node type

* Navigate to **Library > Blueprints > ** *Node Types* tab. Click ***+Add***.
* Enter NAME as *k3s worker*, choose *Virtual Image* option and select VM IMAGE as *Morpheus Ubuntu 20.04 20250218 (vmdk) - 1178*. Click ***Save changes***.

![](/img/k3s-node-type-worker.png)

### 2. Create file template

#### Create a file template to add K8s Secret

* Navigate to **Library > Templates > ** *File Templates* tab. Click ***+Add***.
* Enter NAME and FILE NAME, specify FILE PATH, select PHASE and provide TEMPLATE. Click ***Save changes***.

![](/img/file-template.png)

#### Configure the K3s primary master node

* Navigate to **Library > Blueprints > ** *Node Types* tab. Click ***+Edit*** to *k3s-primary-master*.
* Under **VMware VM Options**, add *morpheus-sa-file-template* to FILE TEMPLATES. Click ***Save changes***.

![](/img/primary-master-node-type-edit.png)

### 3. Create option lists

#### Create an option list for K3s versions

* Navigate to **Library** > **Options** > ** *Option Lists* tab. Click ***+Add***.
* Enter NAME as *K3s Versions*, select TYPE as *Manual* and provide DATASET. Click ***Save changes***.

![](/img/option-list-k3s-version.png)

#### Create an option list for K3s networking

* Navigate to **Library > Options > ** *Option Lists* tab. Click ***+Add***.
* Enter NAME as *K3s Networking Options*, select TYPE as *Manual* and provide DATASET. Click ***Save changes***.

![](/img/option-list-k3s-networking.png)

### 4. Create inputs

#### Create an input for K3s version

* Navigate to **Library > Options > ** *Inputs* tab. Click ***+Add***.
* Enter NAME as *K3s Version* and FIELD NAME as *k3sverion*, set REQUIRE FIELD and HELP BLOCK, select TYPE as *Select List* with LABEL as *Version* and choose OPTION LIST as *K3s Versions*. Click ***Save changes***.

![](/img/input-k3s-version.png)

#### Create an Input for K3s Networking

* Navigate to **Library > Options > ** *Inputs* tab. Click ***+Add***.
* Enter NAME as *K3s Networking* and FIELD NAME as *k3snetworking*, set REQUIRE FIELD and HELP BLOCK, select TYPE as *Select List* with LABEL as *Networking* and choose OPTION LIST as *K3s Networking Options*. Click ***Save changes***.

![](/img/input-k3s-networking.png)

#### Create an Input for K3s Cluster VIP Address

* Navigate to **Library > Options > ** *Inputs* tab. Click ***+Add***.
* Enter NAME as *K3s Cluster VIP Address* and FIELD NAME as *k3svipaddress*, set REQUIRE FIELD and HELP BLOCK, and select TYPE as *Text* with LABEL as *VIP Address*. Click ***Save changes***.

![](/img/input-k3s-vip.png)

#### Create an Input for K3s Cluster CIDR

* Navigate to **Library > Options > ** *Inputs* tab. Click ***+Add***.
* Enter NAME as *K3s Cluster CIDR* and FIELD NAME as *k3sclustercidr*, set REQUIRE FIELD and HELP BLOCK, and select TYPE as *Test* with LABEL as *Cluster CIDR*. Click ***Save changes***.

![](/img/input-k3s-cluster-cidr.png)

#### Create an Input for K3s Service CIDR

* Navigate to **Library > Options > ** *Inputs* tab. Click ***+Add***.
* Enter NAME as *K3s Service CIDR* and FIELD NAME as *k3sservicecidr*, set REQUIRE FIELD and HELP BLOCK, and select TYPE as *Test* with LABEL as *Service CIDR*. Click ***Save changes***.

![](/img/input-k3s-service-cidr.png)

### 5. Create automation tasks and workflows

#### Create an automation task using K3s cluster install script

* Navigate to **Library > Automation\> ** *Tasks* tab. Click ***+Add***.
* Enter NAME as *K3s HA Install Script*, select TYPE as *Shell Script*, choose *SUDO* and select SOURCE as *Local*, and provide CONTENT. Click ***Save changes***.

![](/img/k3s-install-task.png)

**Note:** The K3s HA install script has been available from [github repo](https://github.com/GuopingJia/k3s-demo/blob/main/K3s-Install-Script.sh).

#### Create an automation workflow

* Navigate to **Library** > **Automation** > *Workflows* tab. Click ***+Add***.
* Enter NAME as *K3s HA Install*, select PLATFORM as *Linux*, and add task *K3s HA Install Script* under **Provision**. Click ***Save changes***.

![](/img/k3s-install-workflow.png)

### 6. Create K3s custome cluster layout

#### Create an K3s HA cluster layout

* Navigate to **Library** > **Blueprints** > *Cluster Layouts* tab. Click ***+Add***.
* Enter NAME as *K3S HA Cluster*, select CLUSTER TYPE as *Kubernetes Cluster* and TECHNOLOGY as *VMware*, add **Inputs** and configure **Mater Nodes** and **Worker Nodes**. Click ***Save changes***.

![](/img/k3s-ha-cluster-layout.png)

#### Create a single-master K3s cluster layout

* Navigate to **Library** > **Blueprints** > *Cluster Layouts* tab. Click ***+Add***.
* Enter NAME as *K3S Single-Master Cluster*, select CLUSTER TYPE as *Kubernetes Cluster* and TECHNOLOGY as *VMware*, add **Inputs** and configure **Mater Nodes** and **Worker Nodes**. Click ***Save changes***.

![](/img/k3s-single-master-cluster-layout.png)

## Provision an K3s cluster

* Navigate to **Infrastructure > Clusters**. Click ***+Add Cluster***.
* Select *Cluster Type* as *KUBERNETES CLUSTER*. Click ***Next***.

![](/img/k3s-cluster-type.png)

* Select *Group*, e.g., *CFE Department B Group*. Click ***Next***.

![](/img/k3s-group.png)

* Select CLOUD, enter CLUSTER NAME as *k3s-ha*, and configure optional DESCRIPTION, RESOURCE NAME and LABELS. Click ***Next***.

![](/img/k3s-cluster-name.png)

* Select LAYOUT as *K3S HA Cluster* and PLAN, configure VOLUMES, select NETWORKS, VERSION and NETWORKING, and configure VIP ADDRESS, CLUSTER CIDR and SERVICE CIDR. Click ***Next***.

![](/img/k3s-cluster-master-config.png)

* Specify NUMBER OF WORKERS, along with PLAN, VOLUMES, and NETWORKS. You may retain the default settings or reuse the values previously configured. Click ***Next***.

![](/img/k3s-cluster-worker-config.png)

* Skip this step for Automation settings. The cluster review screen displays. Click ***Complete***.

![](/img/k3s-cluster-review.png)

After a few minutes, the K3s cluster *k3s-ha* is created using the specified cluster layout: *K3S-HA-cluster*.

![](/img/k3s-ha-cluster.png)

## Verify K3s cluster

* Navigate to **Infrastructure > Clusters**.
* Click the K3s Cluster *k3s-ha*.

![](/img/k3s-ha-cluster-details.png)

* Click the *History* tab. Each individual process output available by clicking on target process

![](/img/k3s-ha-cluster-history.png)

## Access the K3s HA Cluster

* Navigate to **Infrastructure > Clusters**.
* Click the cluster name '*k3s-ha*'.
* From *Control* tab, type command, e.g., *get nodes*.

![](/img/k3s-ha-cluster-access.png)

From ***Actions***, you can click *Upgrade Cluster* to upgrade the K3s cluster to its new version, e.g., *1.31.13*. 

![](/img/k3s-ha-cluster-upgrade.png)

## Conclusion



This blog post walked through the process of creating custom cluster layouts and using them to provision K3s clusters within HPE Private Cloud Enterprise. With support for both native and third-party K8s distributions, alongside preconfigred MKS cluster layouts and custom cluster layouts, HPE Private Cloud Enterprise offers flexible provisioning options tailored to your needs. Once a cluster is up and running, administrators can streamline operations using the built-in *Actions* menu to download kubeconfig files, scale worker nodes, perform version upgrades, and decommission unused clusters. These capabilities make K8s management more efficient, consistent, and intuitive across the enterprise.



Please keep coming back to the [HPE Developer Community blog](https://developer.hpe.com/blog/) to learn more about HPE Private Cloud Enterprise and get more ideas on how you can use it in your everyday operations.
