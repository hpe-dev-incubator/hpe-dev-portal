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
This blog post provides a detailed step-to-step guide on how to deploy a Kubernetes (K8s) cluster using app blueprint with Ansible integration in [HPE Private Cloud Enterprise](https://www.hpe.com/us/en/hpe-private-cloud-enterprise.html).

## Overview

[HPE Private Cloud Enterprise](https://www.hpe.com/us/en/hpe-private-cloud-enterprise.html) is a fully managed *Infrastructure as a Service* (IaaS) offering that brings a modern, cloud-like experience to on-premises environments. It combines the flexibility of hybrid cloud with the enterprise-grade control and security required by enterprise IT. 

Through the integration with [HPE Morpheus Enterprise](https://www.hpe.com/us/en/morpheus-enterprise-software.html), which serves as the cloud management and orchestration layer, HPE Private Cloud Enterprise delivers a unified self-service interface for provisioning virtual machines (VMs), creating containers, and deploying applications, all governed by role-based access control (RBAC). 

HPE Morpheus Enterprise provides a set of prebuilt MKS cluster layouts that support a variety of K8s versions and cluster types. These cluster layouts provision MKS clusters using the native K8s distribution, streamlining and accelerating deployment. This blog post walks through the process of creating an MKS cluster using one of these preconfigured cluster layouts.

## Prerequisites

Ensure that the following prerequisites are fulfilled:

* Access to an HPE Private Cloud Enterprise workspace with the '*Private Cloud Tenant Owner'* role, allowing administrative actions in the ***Virtual Machines*** service. 
* The group named *'CFE Department B Group'* and the network *'Green-Net'* have already been created.

## Access to HPE Private Cloud Enterprise

1. Log in to HPE GreenLake Cloud at *https://common.cloud.hpe.com/*.
2. Locate an HPE Private Cloud Enterprise workspace and click ***Go to Workspace***.

![](/img/workspace.png)

3. From the *Getting Started* screen, click ***Find Services***. (If you've already launched HPE GreenLake Flex Solutions, the service will appear under *Recent Services*, from which you can click ***Launch***, then skip to the step *6* below.)

![](/img/get-started.png)

4. From the *Services Catalog*, enter *'HPE GreenLake Flex Solutions'*. Click the ***HPE GreenLake Flex Solutions*** Workloads result.

![](/img/service-catalog.png)

5. From the Workloads ***Overview*** tab, click ***Launch*** to open the HPE GreenLake Flex Solutions. 

![](/img/launch-glc.png)

6. From the Cloud Services ***Dashboard***, locate the *Private Cloud Services* card and ensure that the correct location is selected from the drop-down list.

![](/img/launch-morpheus.png)

7. Click ***Launch HPE Morpheus Enterprise***. The Morpheus Dashboard screen (**Operations** > **Dashboard**) displays.

![](/img/morpheus-dashboard.png)

## Add Ansible integration

1. From Morpheus Dashboard screen, navigate to **Administration** > **Integrations**.

![](/img/morpheus-intg.png)

2. Click ***+New Integration*** and select *Ansible*.

![](/img/morpheus-ansible-intg.png)

3. Enter NAME as 'cfe-ansible-k8s' and specify ANSIBLE GIT URL, DEFAULT BRANCH, PLAYBOOKS PATH, ROLES PATH, GROUP VARAIABLES PATH, DESCRIPTION, and HOST VARIABLES PATH. Click ***SAVE CHANGES***.

![](/img/k8s-ansible-intg.png)

We use our sample Ansible playbooks from [GitHub repo](https://github.com/guoping/ansible-k8s.git) to provision an K8s cluster with a single master and a single worker node using the native K8s distribution.

## Create tasks and workflows

### Create tasks for K8s master and worker

1. Navigate to **Library** -> **Automation** -> *Tasks tab* and click ***+Add***.
2. Enter NAME as 'cfe-k8s-master' and select TYPE as *Ansible Playbook*. Then specify ANSIBLE REPO as 'cfe-ansible-k8s' and PLAYBOOK as 'master.yml'. Click ***SAVE CHANGES***.

![](/img/k8s-master-task.png)

4. Following up the same process to create a task for K8s worker.

![](/img/k8s-worker-task.png)

### Create workflows for K8s master and worker

1. Navigate to **Library** -> **Automation** -> *Workflows Tab*.
2. Click ***+Add*** and select *Provisioning Workflow*.

![](/img/morpheus-workflow.png)

3. Enter NAME as 'cfe-k8s-master' and select PLATFORM as *Linux*. Then search and select the task 'cfe-k8s-master'. Click ***SAVE CHANGES***.

![](/img/k8s-master-workflow.png)

4. Following up the same process to create a workflow for K8s worker.

![](/img/k8s-worker-workflow.png)

## Create app blueprint

1. Navigate to **Library** -> **Blueprints** -> *App Blueprints Tab*. Click ***+Add***.
2. Enter NAME as *CEF-K8s-Ubuntu* and select TYPE as *Morpheus*. Click ***Next***.

![](/img/k8s-app-blueprint-summary.png)

3. Click on ***+*** (next to *CFE-K8s-Ubuntu*) and select *Tier Name* as 'App'.

![](/img/k8s-app-blueprint-tier-name.png)

4. Click on *App* and edit its CONFIGURATION with NAME as 'CFE-K8s-master' and BOOT ORDER as '0'.

![](/img/k8s-app-blueprint-master-config.png)

5. Click on ***+*** again (next to *CFE-K8s-Ubuntu*) and select *Tier Name* as 'App'. Then click on *App* and edit its CONFIGURATION with NAME as 'CFE-K8s-worker' and BOOT ORDER as '1'. Under **Connected Tiers**, select 'CFE-K8s-master'.

![](/img/k8s-app-blueprint-worker-config.png)

6. Click on ***+*** (next to *CFE-K8s-master*) and select *vmware*.

![](/img/k8s-app-blueprint-vmware.png)

7. Click on ***+***  (next to *vmware*) and select *Group*, *Cloud* and *Environment*. Click ***Add config***.

![](/img/k8s-app-blueprint-vmware-config.png)

8. Click the added config and configure K8s master instance settings.

![](/img/k8s-app-blueprint-master.png)

9. Repeat step 6 to 8 to configure K8s worker instance settings.

![](/img/k8s-app-blueprint-worker.png)

10. Click ***Complete***. The final app blueprint structure and configuration display.

![](/img/k8s-app-blueprint-final.png)

11. Review and click ***Save***.

## Deploy K8s cluster

You can provision an K8s cluster using the created app blueprint 'CFE-K8s-Ubuntu' by taking up the following steps:

1. Navigate to **Provisioning** -> **Apps**.
2. Click ***+Add*** and select the blueprint *CFE-K8S-UBUNTU*. Click ***Next***.

![](/img/k8s-app-template.png)

3. Enter NAME as *CEF-K8s* and select GROUP, DEFAULT CLOUD, and ENVIRONMENT. Click ***Next***.

![](/img/k8s-app-summary.png)

4. Click the config under *CFE-K8s-master* and wait for green tick mark on it (you get this if all entries are up-to-date)

![](/img/k8s-app-master-status.png)

5. Click the config under *CFE-K8s-worker* and wait for green tick mark on it (you get this if all entries are up-to-date). Click ***Next***.

![](/img/k8s-app-worker-status.png)

6. Review and click ***Complete***.

![](/img/k8s-details.png)

After a few minutes, the K8s cluster CFE-K8s has been provisioned with *'Running'* status.

![](/img/k8s-cluster.png)


![](/img/k8s-cluster-details.png)

## Access K8s cluster

Provision a Ubuntu VM instance and set it up as a jumphost by adding a DNAT rule to the router. 

![](/img/k8s-jumpserver.png)

Copy the kubeconfig file of the K8s cluster 'CFE-K8s' from its master node IP  '172.20.20.116' and save it as 'config'. Then the cluster 'CFE-K8s' can be accessed using 'kubectl' CLI with the kubeconfig file 'config'.

![](/img/k8s-access.png)

## Delete K8s cluster

1. Navigate to **Provisioning**-> **Apps**.
2. Select *CFE-K8s* and click ***DELETE***.

![](/img/k8s-delete.png)

After few minutes, the cluster is deleted, along with all the provisioned VM instances. 

## Conclusion

This blog post offers you a comprehensive guide on how to provision an K8s cluster using app blueprint of Morpheus automation features with Ansible integration.  

Please keep coming back to the [HPE Developer Community blog](https://developer.hpe.com/blog/) to learn more about HPE Private Cloud for AI and get more ideas on how you can use it in your everyday operations.