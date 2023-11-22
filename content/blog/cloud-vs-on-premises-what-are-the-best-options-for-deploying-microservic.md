---
title: "Cloud vs. On-Premises – What Are the Best Options for Deploying Microservices with Containers?"
date: 2020-12-16T06:55:47.622Z
author: Jim Scott 
tags: ["cloud-computing","microservices","hpe-ezmeral-data-fabric","hpe-ezmeral","MapR"]
authorimage: "/img/blogs/Avatar3.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019, may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
"authorDisplayName": "Jim Scott",
"publish": "2018-04-18T11:00:00.000",
"tags": "cloud-computing"
```

---

Microservices are great. Don't just take my word for it: there are many sources saying the same thing, and the industry is transitioning to this model. Containers are a key piece of the success of microservices. Once a microservice is built and put into a container, the task of deploying the application comes next. For the sake of simplicity, I am going to focus on the type of infrastructure to deploy services. Deployment options fall into four basic models, which can be **mixed and matched** as needed.

## On-Premises Infrastructure

On-premises infrastructure has been the dominant enterprise computing model for more than 50 years. Organizations maintain their own equipment and software in a captive data center with full control over all aspects of processing, scheduling, administration, and maintenance. Many organizations in regulated industries have had no choice but to use an on-premises model because of the need to tightly control data and document processes. However, the cost and significant capital expense involved with building and maintaining on-premises infrastructure is prompting many organizations to shift some or all of their workloads to more-flexible cloud options. On-premises computing won't go away anytime soon, however. Legacy equipment and applications may be incompatible with a cloud environment, and organizations that want to protect investments in hardware and software may choose to maintain on-premises investments for years until depreciation cycles have run their course and applications can be redeveloped.

## Public Cloud

Public cloud makes resources, such as processors, memory, operating systems, applications, and storage, available over the public internet on a pay-per-usage basis. Think of it as a computer in the sky. Public cloud is like using a local server, but the server is virtualized and managed elsewhere by a cloud provider with a high degree of automation.

Organizations use public cloud for a variety of reasons, but the most popular are flexibility, scalability, and ease of administration. Public cloud instances can be launched with a few mouse clicks and just as easily taken down when no longer needed. Developers and end-users can, in many cases, deploy their own cloud instances without approval from IT and its accompanying delays. Billing is usually based upon usage, which gives organizations accountability and flexibility to pay only for the resources they use. Public cloud instances can be scaled up or down with relative ease, and many cloud providers offer best-of-breed automation tools to make administration easy. Public cloud is also an excellent platform for developing applications that will "live" in the cloud, such as those meant for use on mobile devices or with services that are exposed via APIs.

## Private Cloud

For organizations that want the flexible automation benefits of public cloud but need to keep resources on-premises for control or compliance reasons, private cloud is a popular alternative. This model provides the same scalability, automation, and flexibility advantages of public cloud and on-premises environments that can be physically secured and tightly managed. Private clouds can be built using existing data center equipment architecture or licensed from public cloud providers, which could deliver what is essentially a version of their existing services in a secure environment. True private cloud is more than just virtualization. The research firm Wikibon [defines](https://wikibon.com/true-private-cloud-will-begin-shipping-to-the-market-in-2016/) it as encompassing converged architecture, virtualized software and hardware, self-service provisioning, orchestration/automation, and a single point of control.

## Hybrid Cloud

When you combine a public and private cloud, you get a hybrid cloud. This architecture combines both models in a manner that is seamless and that permits workloads to easily move back and forth. This gives organizations a combination of control and flexibility that can be adjusted to the situation. Hybrid architecture preserves existing hardware and software investments while giving companies the flexibility to move applications to the cloud as resources and budgets permit. Not all applications can be moved easily, and some may continue to live for a long time in private data centers. In those cases, organizations may opt for a "cloud bursting" approach, in which demand spills over to a duplicate or compatible cloud application as needed. This reduces the need to add on-premises infrastructure that sits idle much of the time. There are even cloud-cloud options, in which applications move back and forth between multiple public clouds.

## The Plethora of Options

Perhaps the biggest challenge facing IT with respect to cloud is the obvious realization that there is no one single cloud. Rather, there are many, and most enterprises will deploy applications to several of them simultaneously. The challenge is one of orchestration and integration of data across various clouds.

For example, consider the app/dev environment. Ideally, a lot of prototyping and testing would be done in the public cloud, with its scale-on-demand capabilities that make it easy for developers to get this vital work done without imposing on internal resources. Most organizations still choose to retain their most sensitive data on premises, however. Yet to complete the app/dev process from development to test to production, data must flow securely and seamlessly among these different environments in what is known as the hybrid IT world (a combination of on-premises and off-premises, public and private cloud as well as use of traditional on-premises non-cloud clusters).

What is sorely needed to make all this happen is a distributed data platform and processing model that scales easily across all locations and environments. In other words, a converged data platform.