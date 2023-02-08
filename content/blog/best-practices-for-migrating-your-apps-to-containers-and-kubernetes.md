---
title: "Best Practices for Migrating Your Apps to Containers and Kubernetes"
date: 2020-11-25T02:26:04.249Z
author: Suzy Visvanathan 
tags: ["hpe-ezmeral-data-fabric","MapR","mapr-platform","containers","microservices","opensource","devops","sre","site-reliability-engineer"]
authorimage: "/img/blogs/Avatar6.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019, may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
"authorDisplayName": "Suzy Visvanathan",
"publish": "2018-05-15T10:45:00.000",
"tags": "mapr-platform"
```

---

I was having a discussion with a potential customer.  As I listened, I realized that this was a company going through a massive digital transformation.  They were not doing it in bits and pieces but rather through a massive overhaul. The discussion inevitably centered around containers, managing container-based workloads, and the steps they are taking to make this transformation happen.

That led me to ask: “What should an organization know, consider, and do in order to migrate to containers?” This response may not be specific to a digital transformation but, in general, applies to the considerations one must take in order to adopt containers.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/containers-wide-1606271200572.png)

This blog assumes the reader has a fair knowledge of containers, Kubernetes, and some of their unique value adds.

Many organizations made architecture, infrastructure, and solution decisions a long time ago and have followed the “if not broken, don’t fix it” model. Understandably so, since keeping up with technology trends came with a cost – investment in new skill sets, procurement of the latest, usually more expensive equipment, and, more importantly, disruption to business. For example, when VMware came out with the concept of virtualization, it took significant commitment from organizations to move from a physical to a virtual environment.

A few years down the road, Amazon (and then Microsoft and Google) made public cloud and a subscription-based cost model very attractive for deploying on infrastructure managed by someone else. This required a significant change in mindset – to educate oneself in the benefits of infrastructure as a service and then to adopt cloud-native architecture in order to move to the cloud.

Of all the technology trends introduced by innovators, Docker – with their containers technology – made it easy to be adopted, since it circumvented the complications of prior inventions by following the open source model. Open source brought containers more quickly to the enterprise and is propelling the maturity of containers, which is noticeably faster than the journey that VMs or cloud technology underwent. But with the proliferation of containers, managing them became a problem.  This prompted several vendors to come up with solutions, with Kubernetes largely becoming the de facto container management platform.

Cloud Native Computing Foundation (CNCF), which spearheads the development of open source projects like Kubernetes, has been busy releasing improvements at a rapid pace to keep up with the pace of adoption.  


## Move legacy applications to containers? Or not?

Containers allow applications to be broken into smaller manageable microservices. Each microservice is self-sufficient and can be changed and updated on its own without the need to touch the other services. For instance, if a revision or an update needs to be made, only the affected services need be changed and compiled instead of the entire application having to be recompiled. Kubernetes can be used to schedule and manage these individual services. In order to benefit from the full benefits of containers and Kubernetes, assess your legacy applications to see if they can be broken into modules. A very classic example is that of how Uber uses thousands of microservices to improve scalability and reliability.

In his book [A Practical Guide to Microservices and Containers](https://www.academia.edu/41522528/A_Practical_Guide_to_Microservices_and_Containers_Mastering_the_Cloud_Data_and_Digital_Transformation), Jim Scott, Director of Enterprise Strategy at MapR, draws out the intricate details of scaling and microservices by citing a simple web application.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/microservices-1606271160940.jpg)

Microservices sounds very fancy and not all legacy applications can be broken down into smaller modules.  Following these simple steps may help greatly toward the journey:

1.  Not adding anything more to legacy applications. Starting fresh is definitely a viable choice, especially if the decision has been made to fully convert to containers. Rewriting legacy applications into microservices architecture must also be considered.

2.  If legacy applications cannot be broken down into modules, the simplest thing to do may just be to enclose the application in a single container.

3.  Just splitting applications into containers doesn’t make it scalable automatically. Proper planning is needed to determine how these individual containers are to be run. Kubernetes creates containers in Pods and offers a DaemonSet, which is an automated way to create Pods of containers as more server nodes are added. Using such features to scale with microservices needs to be considered upfront.

4.  If certain applications are dependent on certain performance characteristics, pinning containers to certain hardware may be required. Kubernetes offers a feature, called stateful sets, which will allow containers to be locked to underlying infrastructure. If planned carefully, certain Pods carrying services can be spread across different performing servers to get the optimal environment.

5.  If applications cannot simply be broken down, it may be easier and cheaper to just write a new.

## Designing for containers

When designing new applications to run in containers, one key aspect to keep in mind is the concept of decoupling. Tightly coupling an application and its data together may be a non-starter. Keeping the characteristics of a container in mind, separating the data from the application’s dependencies from the start will speed up things greatly. Making use of cloud-native architecture and tools, along with a microservices approach, will make it easy to make the transition.

## Decide the environment

Decide, before starting, whether these containers will be run in the data center or in the cloud.
Running them in the cloud offers certain advantages when the decision to choose the right servers and everything that comes with maintaining an on-premises cluster is not needed. Expanding and shrinking in the cloud with containers reduces cost and speeds up deployment.

However, there is a value-add in running containers in data centers. Containers and Kubernetes are still a concept that is being familiarized in many organizations. Deploying them in small phases, in a controlled environment, will greatly assist in understanding the benefits of containers before “shifting” everything to containers and cloud.

One aspect every organization must understand is that digital transformation is not an end but a journey that never really ends. With careful planning and understanding of the environment, concept, and benefits, and by using tips as described in this blog, organizations can successfully embark on their digital transformation.

MapR offers a robust data platform to deploy applications in containers and Kubernetes. The MapR Data Platform can be run in on-premises data centers and across clouds, enabling disparate environments to be considered.