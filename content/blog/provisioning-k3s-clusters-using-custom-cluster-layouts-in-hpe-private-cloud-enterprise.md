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
---
The blog post demonstrates how to create an K3s cluster using a custom cluster layout in HPE Private Cloud Enterprise. By leveraging various Morpheus components like *Node Type*, *Cluster Layout*, Automation *Task* and *Workflow*, a lightweight K8s distribution, *K3s*, has been selected and deployed into MKS as a sample K8s cluster.

## Overview


## Prerequisites

* Access to GLC tenant with appropriate Role assignment to perform administrative tasks in the Virtual Machines Service, i.e. 'Private Cloud Tenant Owner'.
* Access to Internet from CMP.
* Morpheus MKS feature has been enabled

## Create custom cluster layout

### Create node types

1. Create an K3s primary master node type

* Open the cloud management platform (CMP).
  For details, see Accessing Private Cloud Enterprise: Virtual machines service and cloud management platform.
* Navigate to **Library > Blueprints > Node Types**.
* Click **+Add**.
* Populate the following fields according to below screen. Click **Save changes**.

![](/img/k3s-node-type-primary-master.png)

2. Create an K3s secondary master node type

* Navigate to **Library > Blueprints > Node Types**.
* Click **+Add**.
* Populate the following fields according to below screen. Click **Save changes**.

![](/img/k3s-node-type-secondary-master.png)

3. Create an K3s worker node type

* Navigate to **Library > Blueprints > Node Types**.
* Click **+Add**.
* Populate the following fields according to below screen. Click **Save changes**.

![](/img/k3s-node-type-worker.png)

### Create file template

1. Create a file template to add K8s Secret

* Navigate to **Library > Templates > File Templates**.
* Click **+Add**.
* Populate the following fields according to below screen. Click **Save changes**.

![](/img/file-template.png)

2. Set up the K3s primary master node

Add file template to the K3s primary Master Node Type.

* Navigate to **Library > Blueprints > Node Types**.
* Click **Edit** button to *k3s-primary-master*.
* Under VMware VM Options, populate FILE TEMPLATES as below. Click **Save changes**.

![](/img/primary-master-node-type-edit.png)

### Create option list

1. Create an Option List for K3s Version

* Navigate to **Library** > **Options** > *Option Lists*.
* Click **+Add**.
* Populate the following fields. Click **Save changes**.

![](/img/option-list-k3s-version.png)

2. Create an Option List for K3s Networking

* Navigate to **Library > Options > Option Lists**.
* Click **+Add**.
* Populate the following fields. Click **Save changes**.

![](/img/option-list-k3s-networking.png)

### Create inputs

1. Create an Input for K3s Version

* Navigate to **Library** > **Options** > **Inputs**.
* Click **+Add**.
* Populate the following fields. Click **Save changes**.

![](/img/input-k3s-version.png)

2. Create an Input for K3s Networking

* Navigate to **Library** > **Options** > **Inputs**.
* Click **+Add**. Click **Save changes**.

![](/img/input-k3s-networking.png)

3. Create an Input for K3s Cluster VIP Address

* Navigate to **Library > Options > Inputs**.
* Click **+Add**.
* Populate the following fields. Click **Save changes**.

![](/img/input-k3s-vip.png)

4. Create an Input for K3s Cluster CIDR

* Navigate to **Library > Options > Inputs**.
* Click **+Add**
* Populate the following fields. Click **Save changes**.

![](/img/input-k3s-cluster-cidr.png)

5. Create an Input for K3s Service CIDR

* Navigate to **Library > Options > Inputs**.
* Click **+ADD**
* Populate the following fields. Click **Save changes**.

![](/img/input-k3s-service-cidr.png)

### Create automation tasks and workflows

1. Create an Automation Task for HA K3s Cluster Install

* Navigate to \*\*Library > Automation\*\*.
* Click \*\**+Add\*\*.*
* Populate the following fieldsPopulate the following fields. Click **Save changes**.

![](/img/k3s-install-task.png)

*Note:* The K3s install script has been available from github repo at

*https://github.com/GuopingJia/k3s-demo/blob/main/K3s-Install-Script.sh*

2. Create an Automation Workflow for K3s HA Install

* Navigate to **Library** > **Automation** > *Workflows tab*
* Click *+ADD*
* Populate the following fieldsPopulate the following fields. Click **Save changes**.

![](/img/k3s-install-workflow.png)

### Create K3s custome cluster layout

1. Create an K3s HA cluster layout

* Navigate to **Library** > **Blueprints** > *Cluster Layouts tab*
* Click *+ADD*
* Populate the following fieldsPopulate the following fields. Click **Save changes**.

![](/img/k3s-ha-cluster-layout.png)

2. Create a single-master K3s cluster layout

* Navigate to **Library** > **Blueprints** > *Cluster Layouts tab*
* Click **+Add**
* Populate the following fieldsPopulate the following fields. Click **Save changes**.

![](/img/k3s-single-master-cluster-layout.png)

## Provision an K3s cluster

* Navigate to **Infrastructure > Clusters**. Click **+Add Cluster**.
* Select *Cluster Type* as *KUBERNETES CLUSTER*. Click **Next**.

![](/img/k3s-cluster-type.png)

* Select *Group*, e.g., *CFE Department B Group*. Click **Next**.

![](/img/k3s-group.png)

* Enter NAME, and optional RESOURCE NAME, DESCRIPTION and LABELS. Click **Next**.

![](/img/k3s-cluster-name.png)

* Select LAYOUT as *K3S HA Cluster* and PLAN. Specify VOLUMES, select NETWORKS and set VERSION, NETWORKING, VIP ADDRESS, CLUSTER CIDR and SERVICE CIDR. Click **Next**.

![](/img/k3s-cluster-master-config.png)

* Specify NUMBER OF WORKERS and keep other default settings. Click **Next**.

![](/img/k3s-cluster-worker-config.png)

* Skip Automation step and review settings. Click **Complete**.

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

From **Actions**, you can click *Upgrade Cluster* to upgrade the K3s cluster to its new version. 

![](/img/k3s-ha-cluster-upgrade.png)