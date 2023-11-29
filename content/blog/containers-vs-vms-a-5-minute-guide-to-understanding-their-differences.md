---
title: "Containers vs. VMs: A 5-Minute Guide to Understanding Their Differences"
date: 2021-01-29T05:33:44.878Z
author: Suzy Visvanathan 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","containers","virtual-machine"]
authorimage: "/img/blogs/Avatar6.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019 may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
"authorDisplayName": "Suzy Visvanathan",
"publish": "2018-05-16T10:45:00.000",
"tags": "mapr-platform"
```

---

Almost every organization is investing in or thinking of investing in containers. Containers are transitioning from being a hype to becoming a tangible entity in which applications are deployed, but that doesn’t mean virtual machines are suddenly out of date or not needed. While there are many articles highlighting the technical comparisons between how a container and VM image differ, articulating the advantages of one over the other for one’s business needs, and when to use which, requires a closer look.

![Containers vs. VMs](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/containers-vs-vms-wide-1611898725434.jpg)

## What’s in the package

Containers take only what the application needs and share system resources like OS, CPU, and memory, thereby making them easier to deploy. VMs, on the other hand, take up a lot of system resources within each image, which translates to a lot of memory and CPU cycles. Because of their agile nature, containers are the deployment of choice in development and testing environments.

Containers tend to run on one operating system, whereas the virtual hypervisor can run on any operating system. If you have one or a few consistent sets of applications on a single operating system, consider containers. If you have diverse applications with varying operating systems, consider VMs.

## It’s all about the money

Since containers don’t package system resources as much as VMs, you can run at least twice (or more) the number of applications on the same server with containers than if you were to run them with VMs. This advantage maximizes resource usage and brings down operating costs. Agile development and testing speeds up time to market with containers, more so than if done with VMs.

Both container and VM sprawl are a real problem that administrators face; however, because of the elasticity and portability of containers, they can easily be doubled or tripled to run the same set of applications, as opposed to VMs. So, while you can package more applications on a single host server with containers, running more containers than you need will end up consuming more resources.

Put simply, if you are looking to develop applications or run a single or a handful of applications in multiple instances and resource footprint is a concern, consider containers. If you are looking to run multiple applications and resource footprint can be fluid, consider VMs.

## About that security...

Security, by and large, has been the single biggest problem around containers. Containers, by their very nature of sharing OS, require root access, which makes the data vulnerable and at risk for unauthorized access. While there are several workarounds for this issue, they are quite lengthy and need to be thought out in detail. VMs, on the other hand, have a very robust, rich set of security services that make them attractive for sensitive data and for production environments. VMs also have a very mature ecosystem in terms of network, storage, data protection, and recovery that can make them better for production environments.

## Forecast is mostly cloudy

Cloud solutions have made huge strides in the services they offer.  However, the cost of using the cloud is not always significantly lower – as one might expect. The elasticity of containers allows organizations to create containers on demand and tear them down when done. Scaling up and down your services on cloud by spawning new containers is easier and more cost-effective than it is with VMs. Containers in cloud also allow you to use only the minimum cloud resources you need for your service, thereby keeping your subscription costs down.

To keep it simple, if you have a heavy development, test, or integration environment, switch to containers. If you have multiple applications with varying characteristics requiring a secure environment, remain on VMs. If you are looking to deploy in the cloud or offer services in the cloud, standardizing the deployment in containers will be a good idea. Eventually, it will be prudent to envision and plan for both containers and VMs to coexist in both data centers and in the cloud, since each has its own benefits and challenges.