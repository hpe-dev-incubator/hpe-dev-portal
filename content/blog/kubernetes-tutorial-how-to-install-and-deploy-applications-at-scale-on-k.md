---
title: "Kubernetes Tutorial: How to Install and Deploy Applications at Scale on
  K8s - Part 1 of 3"
date: 2020-11-02T06:12:48.791Z
featuredBlog: false
priority: null
author: Martijn Kieboom
authorimage: /img/blogs/Avatar6.svg
thumbnailimage: null
tags:
  - MapR
  - hpe-ezmeral-data-fabric
  - hpe-ezmeral
  - Kuberneter
  - Container
  - opensource
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019, may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
"authorDisplayName": "Martijn Kieboom",
"publish": "2018-04-26T10:45:00.000",
"tags": ["open-source-software","kubernetes"]
```

---

## Introduction

Containers are hot! But how do you manage hundreds or even thousands of containers in a production environment to support a 24/7 business? Various container management solutions have jumped into that business, but one is getting a lot of attention and adoption at the moment: Kubernetes.

Originally designed by Google but now open-sourced, Kubernetes is being adopted by many commercial vendors, including Docker Enterprise, Red Hat OpenShift, and Mesosphere as well as all major cloud providers. So there are plenty of ways to manage your containers using Kubernetes.

In this first out of three blog posts, we will look into what business benefits can be achieved by combining MapR with Kubernetes to run and manage your containers.

## Why Containers

What we hear from customers in their journey toward making data actionable are the following challenges:

*   Introducing new innovations or capabilities
*   Maintaining business SLAs in a changing environment
*   Using or introducing legacy services as a result of mergers and acquisitions
*   Ongoing upgrade of applications/services
*   Difficulty of packaging and distributing apps to end customers

Introducing new innovations while maintaining existing business SLAs is a big challenge with often a conflict of interest.  IT organizations are mainly focusing on delivering existing SLAs and therefore push back can be experienced when the business wants to launch new innovative products.

In addition, organizations are even more pressured when they acquire or merge businesses as that brings in the challenge of onboarding existing legacy systems.

Finally, the technology updates are going faster than ever before. Upgrading applications and services is becoming more complex and challenging every day. This goes hand in hand with the complexity involved in how apps are being packaged and distributed to your end customers.

In the following paragraphs, we will have a look at what MapR Technologies has to offer to overcome these challenges and really put your data into action.

## MapR Volume Driver Plugin for Kubernetes

![MapR Volume Driver Plugin for Kubernetes](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/mapr-volume-driver-plugin-1604297556537.png)

Let’s have a look at how we can combine existing applications with new innovative applications and services:

**Applications**

Placing applications and even microservices in container pods is a first step in making them flexible and agile. This allows us to distribute the application or service to where it runs best. It also allows physical separation of different types of applications. This way you can easily run classic applications and processes (for example, an ETL process) as well as an innovative machine learning application for image classification using Tensorflow on the same environment.

**Compute - Kubernetes**

Finally, Google’s Kubernetes is quickly gaining adoption as the container scheduler and orchestration solution to allow running applications and services anywhere. To maintain the agility and flexibility of the container-based applications running on Kubernetes, the MapR Kubernetes Volume Driver Plugin gives all applications and microservices seamless access to the MapR Data Platform.

**Data Stores**

The data required by these different applications and (micro)services can, however, be anywhere, as data nowadays is distributed geographically across multiple environments. From edge environments to a combination of private and public cloud, where the data actually is stored should be transparent to the applications and services.

Data - MapR Data Platform

That’s where the MapR Data Platform with its Global Namespace comes in. It virtually combines all MapR clusters into a single Global Data Fabric, providing applications and (micro)services seamless access to all data, irrespective of its physical location.

## Business Benefits

Combining MapR with Kubernetes integration delivers the following business benefit to any organization:

*   Faster innovation while running ongoing business and operations
*   Flexible scaling (up and down) to accommodate business needs
*   Easy integration of mergers and acquisitions
*   Ease of maintaining and rolling out upgrades
*   Ease of packaging and distributing apps to end customers

To summarize the business benefits of the powerful combination of Kubernetes with the MapR Data Platform:

Combining ongoing business operations with deploying new business innovations has never been easier. Scaling any application or service to accommodate ever-changing business and customer needs is simply a matter of scaling up or down the number of application container pods. Onboarding legacy services as part of mergers and acquisitions doesn’t have to stop you from innovating in parallel, rolling out new application and service results with quicker innovation and time to market. And finally, packaging and distributing applications and services to your customer allows you to adopt new technologies and innovation immediately.

[In the following blog post](/blog/kubernetes-tutorial-part-2-of-3-how-to-install-and-deploy-applications-at-scale-on-k8s), we will start deploying a Kubernetes cluster and load the MapR Volume Driver Plugin for Kubernetes to allow enabling these business benefits.
