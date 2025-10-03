---
title: Provisioning Kubernetes clusters using app blueprint with Ansible
  integration in HPE Private Cloud Enterprise
date: 2025-08-12T07:25:49.461Z
author: Guoping Jia
authorimage: /img/guoping.png
disable: false
tags:
  - hpe-greenlake-for-private-cloud-enterprise
  - Kubernetes
  - HPE Morpheus Enterprise
  - App Blueprints
  - Ansible
  - Ansible integration
  - hpe-private-cloud-enterprise
  - HPE GreenLake Flex Solutions
---
This blog post provides a detailed step-to-step guide on how to provision an Kubernetes (K8s) cluster using an app blueprint within the HPE Private Cloud Enterprise environment. Together with other key Morpheus components, such as *Ansible Integration* and *Automation Task and Workflow*, an app blueprint for provisioning K8s clusters can be created. Once configured, this app blueprint enables provisioning of K8s clusters directly in the Morpheus platform in HPE Private Cloud Enterprise.

## Overview

[HPE Private Cloud Enterprise](https://www.hpe.com/us/en/hpe-private-cloud-enterprise.html) is a fully managed *Infrastructure as a Service* (IaaS) offering that brings a modern, cloud-like experience to on-premises environments. It combines the flexibility of hybrid cloud with the enterprise-grade control and security required by enterprise IT. 

Through the integration with [HPE Morpheus Enterprise](https://www.hpe.com/us/en/morpheus-enterprise-software.html), which serves as the cloud management and orchestration layer, HPE Private Cloud Enterprise delivers a unified self-service interface for provisioning virtual machines (VMs), creating containers, and deploying applications, all governed by role-based access control (RBAC). 

Among a list of key Morpheus components, *Ansible Integration* and *Automation Task and Workflow* can be used for creating an app blueprint for provisioning K8s clusters using Ansible playbooks available from the *GitHub* repository. It automatically creates a list of required virtual machine (VM) instances and deploying K8s on top of these VM instances. This blog post walks through the process of creating an app blueprint and using it for K8s cluster provisioning in HPE Private Cloud Enterprise.

## Prerequisites

Ensure that the following prerequisites are fulfilled:

* Access to an HPE Private Cloud Enterprise workspace with the '*Private Cloud Tenant Owner'* role, allowing administrative actions in the ***Virtual Machines*** service. 
* The group named *'CFE Department B Group'* and the network *'Green-Net'* have already been created.

## Create app blueprint

To create an app blueprint, you need to log in to HPE GreenLake Cloud and launch the HPE Morpheus Enterprise Dashboard. For a detailed walkthrough of this process, refer to the blog post [Provisioning MKS clusters in HPE Private Cloud Enterprise](https://developer.hpe.com/blog/provisioning-mks-clusters-in-hpe-greenlake-for-private-cloud-enterprise/).

### 1.  Add Ansible integration

* From Morpheus Dashboard, navigate to **Administration** > **Integrations**.

![](/img/morpheus-intg.png)

* Click ***+New Integration*** and select *Ansible*.

![](/img/morpheus-ansible-intg.png)

3. Enter NAME as 'cfe-ansible-k8s' and specify ANSIBLE GIT URL, DEFAULT BRANCH, PLAYBOOKS PATH, ROLES PATH, GROUP VARAIABLES PATH, DESCRIPTION, and HOST VARIABLES PATH. Click ***SAVE CHANGES***.

![](/img/k8s-ansible-intg.png)

***Note***: Sample Ansible playbooks are avaible from this [*GitHub* repository](https://github.com/guoping/ansible-k8s.git) for provisioning an K8s cluster with one master and one worker node, using the native K8s distribution.

### 2. Create tasks and workflows

#### Create tasks for K8s master and worker

1. Navigate to **Library** -> **Automation** -> *Tasks tab*. Click ***+Add***.
2. Enter NAME as *cfe-k8s-master* and select TYPE as *Ansible Playbook*. Then specify ANSIBLE REPO as *cfe-ansible-k8s* and PLAYBOOK as *master.yml*. Click ***SAVE CHANGES***.

![](/img/k8s-master-task.png)

3. Repeat *step 1* and *step 2* to create a task for K8s worker as name *cfe-k8s-worker*.

![](/img/k8s-worker-task.png)

### Create workflows for K8s master and worker

1. Navigate to **Library** -> **Automation** -> *Workflows* tab.
2. Click ***+Add*** and select *Provisioning Workflow*.

![](/img/morpheus-workflow.png)

3. Enter NAME as *cfe-k8s-master* and select PLATFORM as *Linux*. Then search and select the task *cfe-k8s-master*. Click ***SAVE CHANGES***.

![](/img/k8s-master-workflow.png)

4. Repeat *step 1* to *step 3* to create a workflow for K8s worker as name *cfe-k8s-worker*.

![](/img/k8s-worker-workflow.png)

## Create app blueprint

1. Navigate to **Library** -> **Blueprints** -> *App Blueprints* tab. Click ***+Add***.
2. Enter NAME as *CEF-K8s-Ubuntu* and select TYPE as *Morpheus*. Click ***Next***.

![](/img/k8s-app-blueprint-summary.png)

3. Click on ***+*** (next to *CFE-K8s-Ubuntu*) and select *Tier Name* as *App*.

![](/img/k8s-app-blueprint-tier-name.png)

4. Click on *App* and edit its CONFIGURATION with NAME as *CFE-K8s-master* and BOOT ORDER as *0*.

![](/img/k8s-app-blueprint-master-config.png)

5. Click on ***+*** again (next to *CFE-K8s-Ubuntu*) and select *Tier Name* as *App*. Then click on *App* and edit its CONFIGURATION with NAME as *CFE-K8s-worker* and BOOT ORDER as *1*. Under **Connected Tiers**, select *CFE-K8s-master*.

![](/img/k8s-app-blueprint-worker-config.png)

6. Click on ***+*** (next to *CFE-K8s-master*) and select *vmware*.

![](/img/k8s-app-blueprint-vmware.png)

7. Click on ***+***  (next to *vmware*) and select *Group*, *Cloud* and *Environment*. Click ***Add config***.

![](/img/k8s-app-blueprint-vmware-config.png)

8. Click the added config and configure NAME, DESCRIPTION, LAYOUT, PLAN, VOLUMES, NETWORKS and IMAGE.

![](/img/k8s-app-blueprint-master.png)

9. Repeat *step 6* to *step 8* to configure K8s worker instance settings.

![](/img/k8s-app-blueprint-worker.png)

10. Click ***Complete***. The final app blueprint structure and configuration display.

![](/img/k8s-app-blueprint-final.png)

11. Review and click ***Save***.

## Deploy K8s cluster

Follow steps below to provision an K8s cluster using the app blueprint *CFE-K8s-Ubuntu*:

1. Navigate to **Provisioning** -> **Apps**. Click ***+Add*** 
2. Select blueprint *CFE-K8S-UBUNTU*. Click ***Next***.

![](/img/k8s-app-template.png)

3. Enter NAME as *CEF-K8s* and select GROUP, DEFAULT CLOUD, and ENVIRONMENT. Click ***Next***.

![](/img/k8s-app-summary.png)

4. Click on the config under *CFE-K8s-master* and wait for green check mark to appear (this indicates that all entries are up to date).

![](/img/k8s-app-master-status.png)

5. Click on the config under *CFE-K8s-worker* and wait for green check mark to appear (this indicates that all entries are up to date). Click ***Next***.

![](/img/k8s-app-worker-status.png)

6. Review and click ***Complete***.

![](/img/k8s-details.png)

After a few minutes, the K8s cluster *CFE-K8s* is successfully provisioned and displays a *Running* status.

![](/img/k8s-cluster.png)

7. Click cluster *CFE-K8s*.

![](/img/k8s-cluster-details.png)

The K8s cluster *CFE-K8s* has been provisioned using the app blueprint *CFE-K8s-Ubuntu* with 2 instances.

## Access K8s cluster

Provision an Ubuntu VM instance with *kubeclt* and *helm* installed, and set it up as jumphost by adding a *DNAT* rule to the *Router*. 

![](/img/k8s-jumpserver.png)

Copy the *kubeconfig* file of the K8s cluster 'CFE-K8s' from its master node at IP *172.20.20.116*, and save it locally as *config*. You can then access the cluster 'CFE-K8s' using the command *'kubectl --kubeconfig=./config get nodes'.

![](/img/k8s-access.png)

## Delete K8s cluster

Follow steps below to remove the K8s cluster *CFE-K8s* once it's no longer required.

1. Navigate to **Provisioning**-> **Apps**.
2. Select *CFE-K8s* and click ***DELETE***.

![](/img/k8s-delete.png)

After few minutes, the cluster is successfully deleted, and all associated VM instances are removed.

## Conclusion

This blog post provided a step-by-step walkthrough for provisioning an K8s cluster using an app blueprint integrated with Ansible in the HPE Private Cloud Enterprise environment. With the support of the Morpheus Kubernetes Service (MKS), HPE Private Cloud Enterprise now empowers users to deploy and manage K8s clusters with built-in automation and observability capabilities. 

You can refer to the blog post [Provisioning MKS clusters in HPE Private Cloud Enterprise](https://developer.hpe.com/blog/provisioning-mks-clusters-in-hpe-greenlake-for-private-cloud-enterprise/) for a guide to provisioning MKS clusters using a list of predefined MKS cluster layouts. Whether you prefer the flexibility of app blueprints or the streamlined structure of cluster layouts, HPE Private Cloud Enterprise gives you the freedom to choose the approach that best fits your operational needs.

Please keep coming back to the [HPE Developer Community blog](https://developer.hpe.com/blog/) to learn more about HPE Private Cloud for AI and get more ideas on how you can use it in your everyday operations.