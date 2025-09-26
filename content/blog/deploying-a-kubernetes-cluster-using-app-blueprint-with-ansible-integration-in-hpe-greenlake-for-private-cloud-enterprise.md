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
<style> li { font-size: 27px; line-height: 33px; max-width: none; } </style>

This blog post provides a detailed step-to-step guide on how to deploy a Kubernetes (K8s) cluster using app blueprint with Ansible integration in [HPE Private Cloud Enterprise](https://www.hpe.com/us/en/hpe-private-cloud-enterprise.html).

## Overview

[HPE Private Cloud Enterprise](https://www.hpe.com/us/en/hpe-private-cloud-enterprise.html) is a fully managed *Infrastructure as a Service* (IaaS) offering that brings a modern, cloud-like experience to on-premises environments. It combines the flexibility of hybrid cloud with the enterprise-grade control and security required by enterprise IT. 

Through the integration with [HPE Morpheus Enterprise](https://www.hpe.com/us/en/morpheus-enterprise-software.html), which serves as the cloud management and orchestration layer, HPE Private Cloud Enterprise delivers a unified self-service interface for provisioning virtual machines (VMs), creating containers, and deploying applications, all governed by role-based access control (RBAC). 

HPE Morpheus Enterprise provides a set of prebuilt MKS cluster layouts that support a variety of K8s versions and cluster types. These cluster layouts provision MKS clusters using the native K8s distribution, streamlining and accelerating deployment. This blog post walks through the process of creating an MKS cluster using one of these preconfigured cluster layouts.

## Prerequisites

Ensure that the following prerequisites are fulfilled:

* Access to an HPE Private Cloud Enterprise workspace with the '*Private Cloud Tenant Owner'* role, allowing administrative actions in the _**Virtual Machines**_ service. 
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



6. From the Cloud Services _**Dashboard**_, locate the *Private Cloud Services* card and ensure that the correct location is selected from the drop-down list.



![](/img/launch-morpheus.png)



7. Click ***Launch HPE Morpheus Enterprise***. The Morpheus Dashboard screen (**Operations** > **Dashboard**) displays.



![](/img/morpheus-dashboard.png)

## Add Ansible integration

1. From Morpheus Dashboard screen, navigate to **Administration** > **Integrations**

![](/img/morpheus-intg.png)

2. Click **+NEW INTEGRATION** and select -> **Automation** -> *Ansible*

![](/img/morpheus-ansible-intg.png)

3. Enter NAME as 'cfe-ansible-k8s' and specify ANSIBLE GIT URL, DEFAULT BRANCH, PLAYBOOKS PATH, ROLES PATH, GROUP VARAIABLES PATH, DESCRIPTION, and HOST VARIABLES PATH. Click **SAVE CHANGES**.

![](/img/k8s-ansible-intg.png)

We use our sample Ansible playbooks from [GitHub repo](https://github.com/guoping/ansible-k8s.git) to provision an K8s cluster with single master and worker node using the native K8s distribution.

## Create tasks and workflows

### Create tasks for K8s master and worker

1. Navigate to **Library** -> **Automation** -> *Tasks tab* and click **+ADD**.
3. Enter NAME as 'cfe-k8s-master' and select TYPE as *Ansible Playbook*. Then specify ANSIBLE REPO as 'cfe-ansible-k8s' and PLAYBOOK as 'master.yml'. Click **SAVE CHANGES**.

![](/img/k8s-master-task.png)

Following up the same process to create a task for K8s worker:

![](/img/k8s-worker-task.png)

### Create workflows for K8s master and worker

1. Navigate to **Library** -> **Automation** -> *Workflows Tab*
2. Click **+ADD** and select *Provisioning Workflow*.

![](/img/morpheus-workflow.png)

3. Enter NAME as 'cfe-k8s-master' and select PLATFORM as *Linux*. Then search and select the task 'cfe-k8s-master' Click **SAVE CHANGES**.

![](/img/k8s-master-workflow.png)

Following up the same process to create a workflow for K8s worker:

![](/img/k8s-worker-workflow.png)

## Create app blueprint

1. Navigate to **Library** -> **Blueprints** -> *App Blueprints Tab* and click **+ADD**.
2. Enter NAME as 'CEF-K8s-Ubuntu' and select TYPE as *Morpheus*. Click **Next**.

![](/img/k8s-app-blueprint-summary.png)

3. Click on + (next to 'CFE-K8s-Ubuntu') and select 'Tier Name' as *App*

![](/img/k8s-app-blueprint-tier-name.png)

4. Click on 'App' and edit its CONFIGURATION with NAME as 'CFE-K8s-master' and BOOT ORDER as '0'.

![](/img/k8s-app-blueprint-master-config.png)

5. Click on + again (next to *CFE-K8s-Ubuntu*) and select 'Tier Name' as *App*. Then lick on 'App' and edit its CONFIGURATION with NAME as 'CFE-K8s-worker' and BOOT ORDER as '1'. 

![](/img/k8s-app-blueprint-worker-config.png)

Under *Connected Tiers*, it shows 'CFE-K8s-master' is selected.

6. Click on + (next to *CFE-K8s-master*) and select *vmware*.

![](/img/k8s-app-blueprint-vmware.png)

7. Click on + (next to *vmware*) and select 'Group', 'Cloud' and 'Environment'. Click **Add config**.

![](/img/k8s-app-blueprint-vmware-config.png)


8. Click the config and configure K8s master instance settings:

![](/img/k8s-app-blueprint-master.png)

9. Repeat step 6 to 8 to configure K8s worker instance settings.

![](/img/k8s-app-blueprint-worker.png)

10. Click **Complete**. The final app blueprint structure and configuration display.

![](/img/k8s-app-blueprint-final.png)

11. Click **Save** to save the app bleuprint.

## Deploy a K8s cluster

You can provision an K8s cluster using the created app blueprint 'CFE-K8s-Ubuntu' by taking up the following steps:

1. Navigate to **Provisioning** -> **Apps**
2. Click **+Add** and select the blueprint 'CFE-K8S-UBUNTU. Click **Next**.

![](/img/k8s-app-template.png)

![](/img/k8s-app-summary.png)

![](/img/k8s-app-status.png)

![](/img/k8s-details.png)

## Access CFE-K8s cluster from Jumpserver

| INSTANCES            |                                            |                                                                            |     |        |             |                  |     |
| -------------------- | ------------------------------------------ | -------------------------------------------------------------------------- | --- | ------ | ----------- | ---------------- | --- |
| (478/559) -Frick 8   | 4.4 (amaps                                 | \>   ALCharle                                                              | P   |        | «Авро       | a police         | 10- |
| NAME                 | THE LEW M : SE : MANULEP windownload       | Incation                                                                   |     | 977413 |             |                  |     |
| xxxl-150xphost-linux | He adde: 171 JULDU IDO Versixt. 211 - 12 - | Delivery Desgt TRI-transported. Cloudy PPP. Dream Like VALgeS Closen Trall |     | o      |             | 0                |     |
| Ubuntu               | olchial basiteres I                        | Replore                                                                    |     | STORA  | \-Integrama | INFICIPLE TENADE |     |

Using the kubeconfig file 'config' copied over from the master node IP 172.20.20.116:

| WOODSSmaders 211114440                                                  |        |               |     |          |
| ----------------------------------------------------------------------- | ------ | ------------- | --- | -------- |
| pce-trial@tr1-jumphost-linux:~$ kubectl --kubeconfig=./config get nodes |        |               |     |          |
| NAME                                                                    | STATUS | ROLES         | AGE | VERSION  |
| cfe-k8s-master-15                                                       | Ready  | control-plane | 24h | V1.28.15 |
| cfe-k8s-worker-15                                                       | Ready  | <none>        | 24h | V1.28.15 |

![](/img/k8s-jumpserver.png)

![](/img/k8s-access.png)

## Delete the Application

1. Navigate to **Provisioning**-> **Apps**
2. Select 'CFE-K8s'
3. Click **DELETE**
4. Verify the corresponding VMs gets deleted and doesn't get listed anymore.

![](/img/k8s-delete.png)

## Conclusion

This blog post offers you a comprehensive guide on how to deploy 

Please keep coming back to the [HPE Developer Community blog](https://developer.hpe.com/blog/) to learn more about HPE Private Cloud for AI and get more ideas on how you can use it in your everyday operations.