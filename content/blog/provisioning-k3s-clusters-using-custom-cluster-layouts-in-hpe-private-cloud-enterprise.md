---
title: Provisioning K3S clusters using custom cluster layouts in HPE Private
  Cloud Enterprise
date: 2025-09-26T15:47:53.318Z
author: Guoping
authorimage: /img/guoping.png
disable: false
---




The use case K104 demonstrates how to create a MKS cluster using a custom cluster layout. By leveraging various Morpheus components like *Node Type*, *Cluster Layout*, Automation *Task* and *Workflow*, a lightweight K8s distribution, *K3s*, has been selected and deployed into MKS as a sample K8s cluster.

These instructions have been tailored for the HPE GreenLake Tenant "*HPE GreenLake Hosted Trial TR1*"



## Prerequisites



- Access to GLC tenant with appropriate Role assignment to perform administrative tasks in the Virtual Machines Service, i.e. 'Private Cloud Tenant Owner'.
- Access to Internet from CMP.
- Morpheus MKS feature has been enabled



## Create node types

### Create an K3s Primary Master Node Type

- 1. Open the cloud management platform (CMP).
For details, see Accessing Private Cloud Enterprise: Virtual machines service and cloud management platform.

- 2. Navigate to **Library > Blueprints > Node Types**
- 3. Click *+ADD*
- 4. Populate the following fields according to below screen




- 5. Click *SAVE CHANGES*

### Create an K3s Secondary Master Node Type

- 1. Navigate to **Library > Blueprints > Node Types**
- 2. Click *+ADD*
- 3. Populate the following fields according to below screen





## Create file template

Create a file template to add K8s Secret

- 1. Navigate to **Library > Templates > File Templates**
- 2. Click *+ADD*
- 3. Populate the following fields according to below screen




- 4. Click *SAVE CHANGES*
Add the File Template to the K3s Primary Master Node Type

- 1. Navigate to **Library > Blueprints > Node Types**
- 2. Click *EDIT* button to "*k3s-primary-master*"
- 3. Under VMware VM Options, populate FILE TEMPLATES as below





## Create option list

### Create an Option List for K3s Version

- 1. Navigate to **Library** > **Options** > *Option Lists*
- 2. Click **+ADD**
- 3. Populate the following fields:







### Create an Option List for K3s Networking

- 1. Navigate to **Library > Options > Option Lists**
- 2. Click **+ADD**
- 3. Populate the following fields:





## Create inputs

### Create an Input for K3s Version

- 1. Navigate to **Library** > **Options** > **Inputs**
- 2. Click **+ADD**
- 3. Populate the following fields:




- 4. Click **SAVE CHANGES**

### Create an Input for K3s Networking

- 1. Navigate to **Library** > **Options** > **Inputs**
- 2. Click **+ADD**




4. Click **SAVE CHANGES**


### Create an Input for K3s Cluster VIP Address

- 1. Navigate to **Library > Options > Inputs**
- 2. Click **+ADD**
- 3. Populate the following fields:






### Create an Input for K3s Cluster CIDR

- 1. Navigate to **Library > Options > Inputs**
- 2. Click **+ADD**
- 3. Populate the following fields:




### Create an Input for K3s Service CIDR

1. Navigate to **Library > Options > Inputs**
2. Click **+ADD**


4. Click **SAVE CHANGES**

## Create automation tasks and workflows

### Create an Automation Task for HA K3s Cluster Install

- 1. Navigate to **Library > Automation 
- 2. Click *+ADD*
- 3. Populate the following fields:





*Note:* The K3s install script has been available from github repo at

*https://github.com/GuopingJia/k3s-demo/blob/main/K3s-Install-Script.sh*



- 4. Click **SAVE CHANGES**

### Create an Automation Workflow for K3s HA Install

- 1. Navigate to **Library** > **Automation** > *Workflows tab*
- 2. Click **+ADD**
- 3. Populate the following fields:





## Create K3s Cluster Layout



### Create an K3s HA cluster layout

- 1. Navigate to **Library** > **Blueprints** > *Cluster Layouts tab*
- 2. Click **+ADD**
- 3. Populate the following fields:




- 4. Click **SAVE CHANGES**

### Create a Single-Master K3s Cluster Layout



- 1. Navigate to **Library** > **Blueprints** > *Cluster Layouts tab*
- 2. Click **+ADD**
- 3. Populate the following fields:



- 4. Click **SAVE CHANGES**

## Create an K3s Cluster


- Navigate to **Infrastructure > Clusters**
- Click **+ADD CLUSTER**
- Select **CLUSTER TYPE**, e.g, *KUBERNETES CLUSTER*
- Click *NEXT*
- Select *Group*, e.g., *CFE Department B Group*
- Click *NEXT*
- Under Summary, populate the following fields:





## Verify Provisioned K3s HA Cluster

- 1. Navigate to **Infrastructure > Clusters**.
- 2. Check the *Status* of the K3s Cluster, e.g., *k3s-ha*




- 4. From the *Cluster* detail page, click the *History* tab. Each individual process output available by clicking on target process





## Access the K3s HA Cluster

- 1. Navigate to **Infrastructure > Clusters**.
- 2. Click the Cluster name '*k3s-ha*' to the Cluster detail page.
- 3. From *Control* tab, type commands, e.g., *get nodes*, *get pods*, etc.




## Create an K3s Single-Master Cluster

- 1. Navigate to **Infrastructure > Clusters**
- **2.** Click **+ADD CLUSTER**
- 3. Select **CLUSTER TYPE**, e.g, *KUBERNETES CLUSTER*
- 4. Click *NEXT*
- 5. Select *Group*, e.g., *CFE Department B Group*
- 6. Click *NEXT*



- 15. Review and select *COMPLETE*


## Verify Provisioned K3s Single-Master Cluster



- 5. Navigate to **Infrastructure > Clusters**.
- 6. Check the *Status* of the K3s Cluster, e.g., *k3s-single-master*



- *7.* Go to the Cluster detail page by clicking the Cluster name *k3s-single-master*




- 8. From the *Cluster* detail page, click the *History* tab. Each individual process output available by clicking on target process






## Access the K3s Single-Master Cluster



- 1. Navigate to **Infrastructure > Clusters**.
- 2. Click the Cluster name '*k3s-single-master*' to the Cluster detail page.
- 3. From *Control* tab, type commands, e.g., *get nodes*, *get pods*, etc






