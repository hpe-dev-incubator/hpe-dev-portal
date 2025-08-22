---
title: Deploying a Kubernetes cluster using app blueprint with Ansible
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

![](/img/k8s-ansible-intg.png)

1. Navigate to **Administration** > **Integrations**
2. **+NEW INTEGRATION** -> **Automation** -> *Ansible*
3. Name: *cfe-ansible-k8s*

\| ANSIBLE GIT URL | https://github.com/guoping/alansible-kBs.git |

## Create app blueprint

### tasks and workflows

#### Create a task for K8s master

1. Navigate to **Library** -> **Automation** -> *Tasks tab*
2. **+ADD**
3. Name: *cfe-k8s-master*

![](/img/k8s-master-task.png)

#### Create a workflow for K8s master

1. Navigate to **Library** -> **Automation** -> *Workflows Tab*
2. **+ADD** -> *Provisioning Workflow*
3. Name: *cfe-k8s-master*

![](/img/k8s-master-workflow.png)

#### Create a task for K8s worker

1. Navigate to **Library** -> **Automation** -> *Tasks tab*
2. **+ADD**
3. Name: *cfe-k8s-worker*
4. TYPE: *Ansible Playbook*
5. Ansible Repo : *cfe-ansible-k8s*

![](/img/k8s-worker-task.png)

#### Create a workflow for K8s worker

1. Navigate to **Library** -> **Automation** -> *Workflows Tab*
2. **+ADD** -> *Provisioning Workflow*
3. Name: *cfe-k8s-worker*
4. Description: *CFE K8s worker workflow*

![](/img/k8s-worker-workflow.png)

## Create app blueprint for K8s cluster

1. Navigate to **Library** -> **Blueprints** -> *App Blueprints Tab*
2. **+ADD**
3. New Blueprint Summary

![](/img/k8s-app-blueprint-summary.png)


![](/img/k8s-app-blueprint-tier-name.png)


![](/img/k8s-app-vmware-config.png)


![](/img/k8s-app-blueprint-master.png)


![](/img/k8s-app-blueprint-auto-master.png)


![](/img/k8s-app-vmware-config.png)



![](/img/k8s-app-blueprint-worker.png)



![](/img/k8s-app-blueprint-auto-worker.png)



![](/img/k8s-app-blueprint-final.png)

## Deploy a K8s cluster

1. Navigate to **Provisioning** -> **Apps**
2. \| Select CFE-K8S-UBUNTU -> NEXT |

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