---
title: "MapR, Kubernetes, Spark and Drill: A Two-Part Guide to Accelerating Your AI and Analytics Workloads"
date: 2020-11-03T16:17:29.186Z
author: Suresh Ollala 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","opensource"]
authorimage: "/img/blogs/Avatar5.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019, may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
"authorDisplayName": "Suresh Ollala",
"publish": "2019-04-02T07:00:01.000Z",
"tags": "mapr-platform"
```

---

*Highly available, scalable, and elastic data platform for analytics and AI/ML*

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/image3-1604420243941.png)

The early days of big data platforms focused on optimizing storage and compute on commodity hardware, mostly by software-level capabilities such as data locality support, better local caching, and effective data distribution. This worked well, but at a cost of flexibility.

Things have changed over the last 5 years – hardware innovation in networking, CPU, and disk has made data locality no longer a bottleneck. A hybrid infrastructure of on-premises and cloud technology adoption forced innovation to scale storage and compute separately: AI/ML workloads require compute burst infrastructure, and cloud-native apps require flexibility of scheduling.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/image1-1604420235871.png)

## Scalability and Manageability

Separating storage from compute makes scaling infrastructure to match bursty and rapidly growing workloads as well as datasets more manageable. One can scale up or down strictly based on the workload and independent of each other. It also provides total flexibility in matching resources to the actual storage and compute capacity required at any given time. The separation of the two also reduces the complexity of managing multiple environments. For instance, production, development, and ad hoc analytics processes could run against the same dataset, thereby eliminating the administrative overhead of data replication and potential synchronization.

## Agility

Decoupling storage and compute gives infrastructure greater agility. By relying on modern scalable storage systems, teams don't have to know the compute and storage capacity needed well in advance, freeing them from having to do a guesstimate, which results in either over-provisioning or under-provisioning the resources.

In addition, with innovation in systems and cloud infrastructure, it's easier to choose storage-optimized, compute-optimized, and memory-optimized systems. This removes lock-in to particular set of machines or vendors. Flexible configurations enable admins to determine to what degree to optimize for cost vs. performance. For example, if a particular workload needs to be processed quickly and cost is not a key factor, then the admin can configure more nodes to speed up processing. If controlling cost is critical, then the admin can configure less nodes and utilize other cost-saving features, such as Auto Scaling and Spot Instances.

## Lower TCO

Decoupling storage and compute can lead to lower total cost of ownership. Modern data infrastructure allows admins to configure the infrastructure for a pay-per-use model, so organizations only pay for storage space and point-in-time compute capacity. Today's organizations depend on a flexible infrastructure to speed up new initiatives, which requires low cost and faster infrastructure provisioning. DevOps culture is widely adapted to cut down on the red tape for system procurement and provisioning. It is important to note that organizations are looking for hybrid infrastructure, where cost is an important factor to consider along with consistent user and admin experience.

## Evolution of Kubernetes as an Infrastructure Neutral Platform

Kubernetes has evolved to meet the needs of Developer, IT, and DevOps users.

If you are a **Developer**, Kubernetes provides the necessary APIs that are needed today to build the next generation of applications, while at the same time supporting the more traditional ones. This lets developers focus on the app's functionality, instead of worrying about all the nitty-gritty details of how to manage the application. With Kubernetes, the developer experience is consistent, whether they work on their laptops or in a production environment. The application will not break when moved from a local machine to production, which saves the headache of debugging it.

**IT Operations Perspective:** System administrators like Kubernetes because it automates a lot of the mundane, boring, and error-prone operational tasks to keep applications running smoothly at scale. With Kubernetes, a server outage no longer keeps them up at night.

## An Infrastructure Framework for Today

These days, developers are called on to write applications that run across multiple operating environments, including dedicated on-prem servers, virtualized private clouds, and public clouds such as AWS and Azure. Traditionally, applications and the tooling that support them have been closely tied to the underlying infrastructure, so it was costly to use other deployment models, despite their potential advantages. This meant that applications became dependent on a particular environment in several respects, including performance issues related to a specific network architecture, adherence to cloud provider-specific constructs, such as proprietary orchestration techniques, and dependencies on a particular back-end storage system.

PaaS tries to get around these issues, but often at the cost of imposing strict requirements in areas like programming languages and application frameworks. Thus, PaaS is off limits to many development teams.

Kubernetes eliminates infrastructure lock-in by providing core capabilities for containers without imposing restrictions. It achieves this through a combination of features within the Kubernetes platform, including Pods and Services.

## Better Management Through Modularity

Containers allow applications to be decomposed into smaller parts with a clear separation of concerns. The abstraction layer provided for an individual container image allows us to fundamentally rethink how distributed applications are built. This modular approach enables faster development by smaller, more focused teams that are each responsible for specific containers. It also allows us to isolate dependencies and make wider use of well-tuned, smaller components.

But this can't be achieved by containers alone; it requires a system for integrating and orchestrating these modular parts. Kubernetes achieves this in part using Pods – typically a collection of containers that are controlled as a single application. The containers share resources, such as file systems, kernel namespaces, and an IP address. By allowing containers to be collocated in this manner, Kubernetes removes the temptation to cram too much functionality into a single container image.

The concept of a Service in Kubernetes is used to group together a collection of Pods that perform a similar function. Services can be easily configured for discoverability, observability, horizontal scaling, and load balancing.

## Deploying and Updating Software at Scale

DevOps emerged as a method to speed the process of building, testing, and releasing software. Its corollary has been a shift in emphasis from managing infrastructure to managing how software is deployed and updated at scale. Most infrastructure frameworks don't support this model, but Kubernetes does, in part through Kubernetes Controllers. Thanks to controllers, it's easy to use infrastructure to manage the application lifecycle.

The Deployment Controller simplifies a number of complex management tasks. For example:

-   **Scalability.** Software can be deployed for the first time in a scale-out manner across Pods, and deployments can be scaled in or out at any time.
-   **Visibility.** Identify completed, in-process, and failing deployments with status querying capabilities.
-   **Time savings.** Pause a deployment at any time and resume it later.
-   **Version control.** Update deployed Pods using newer versions of application images and roll back to an earlier deployment if the current version is not stable.

Among other possibilities, Kubernetes simplifies a few specific deployment operations that are especially valuable to developers of modern applications. These include the following:

-   **Horizontal autoscaling.** Kubernetes automatically sizes a deployment's number of Pods based on the usage of specified resources (within defined limits).
-   **Rolling updates.** Updates to a Kubernetes deployment are orchestrated in "rolling fashion," across the deployment's Pods. These rolling updates are orchestrated while working with optional predefined limits on the number of Pods that can be unavailable and the number of spare Pods that may exist temporarily.
-   **Canary deployments.** A useful pattern when deploying a new version of a deployment is to first test the new deployment in production, in parallel with the previous version, and then scale up the new deployment while simultaneously scaling down the previous deployment.

Kubernetes marks a breakthrough for DevOps because it allows teams to keep pace with the requirements of modern software development. In the absence of Kubernetes, teams have often been forced to script their own software deployment, scaling, and update workflows. Some organizations employ large teams to handle those tasks alone. Kubernetes allows us to derive maximum utility from containers and build cloud-native applications that can run anywhere, independent of cloud-specific requirements. This is clearly the efficient model for application development and operations we've been waiting for.

## Why MapR is Best Suited for Kubernetes

The MapR Data Platform, time-tested across very large deployments, aligns with Kubernetes by offering several "add-on" features. MapR augments the capabilities of Kubernetes by offering heuristics on optimal CPU resources required by app containers. For instance, to run a Spark cluster, MapR offers a typical t-shirt sizing of small, medium, and large options with CPU and memory resources to pick from. This ability, combined with the auto scaling features of Kubernetes, lends end users the capability to create and scale compute, up and down intelligently. MapR also introduces the concept of a tenant, with CPU resources dedicated to it, wherein a tenant can be any app container – Spark, Drill, or a custom app. Multiple tenants with resource isolation can be efficiently run on the same platform with MapR data volumes mounted to tenants in an exclusive or shared mode.

With these succinct capabilities, MapR along with Kubernetes offers ease of use and management, making it attractive for organizations to embrace Kubernetes and running applications in containers.