---
title: "Containers: Best Practices for Running in Production"
date: 2020-09-16T16:06:50.613Z
author: Suzy Visvanathan 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","containers","opensource","devops","sre","site-reliability-engineer"]
authorimage: "/img/blogs/Avatar4.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019, may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:
```
"authorDisplayName": "Suzy Visvanathan",
"publish": "2018-05-17T10:45:00.000",
"tags": "hpe-ezmeral-data-fabric","hpe-ezmeral"
```

---

Market shifts are propelling organizations to become digital. Companies feel pressure to find better ways to offer services, respond faster and proactively to their customers, and manage growth. In their quest for digital maturity, customers are looking for solutions that not only address the aspect of capacity growth, but also other aspects such as performance, handling of different types of data through different protocols, and ability to adopt newer technology trends that makes them more efficient.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/containers-wide-1600290064568.png)

Containers is one technology trend that is propelling a transition for IT. With the advent of Docker, containers became a popular method for DevOps and are quickly being adopted in production as well. But as I talk to customers, I find that many are still quite undecided about adopting containers, especially in production environments. There are several nuances to keep in mind when considering deploying applications in containers in production:

1.  **Start small.**  Unless you have already made an organization-wide decision to deploy containers, start with a handful of containers and measure the time it takes to build and deploy an application on containers versus, say, in VMs or bare metal. This will give you an idea of whether it is worthwhile moving to containers or not. Since containers consume CPU resources, such an exercise will help you plan your cluster configuration as well.

2.  **Orchestration tool?** Google search on this topic will produce a litany of articles that compares Kubernetes with Mesos or a Docker swarm and proclaims how Kubernetes has won the war. While that is great, most of you don’t need to start right away with any of these tools. Don’t get me wrong: I am a big proponent of these orchestration tools, but if you envision having just a few dozen containers in the next year or two, you are better off managing the environment manually, since it will give you good hands-on insight into how your environment behaves. If you are thinking instead of deploying hundreds or thousands of containers, by all means choose an orchestration tool.

3.  **Persistent storage for containers.**  When experimenting with containers, you can probably make do with local storage. If, on the other hand, you are contemplating running containers in production, then you will need persistent storage. Choose a data platform that is versatile in what it offers and not just storage for containers. A platform that has been built from the ground up for scale, reliability, and security with the ability to expand to newer technology trends is the ideal choice.

4.  **Network considerations.**  There are several CNI (Container Network Interface) solutions that are now available. Docker itself offers a pluggable interface and third-party vendors like Calico and Flannel offer solutions. Existing network frameworks in your data center should suffice for most deployments but evaluating CNI solutions to assess fit and needs in your data center is worth contemplating.

5.  **Standardizing on containers.** When building new applications, take into account design considerations to run these applications in containers, even if they won’t be deployed as containers in the short term. This will save a lot of time and cost in reformatting them later.

6.  **Containers and microservices.** Containers enable applications to be broken down into smaller modules, paving the way for a microservice architecture. Not all applications, especially legacy ones, can be easily broken down and may end up being more expensive to refactor, especially if you are moving to the cloud.

HPE offers several capabilities to address many of the above highlighted best practices. The [HPE Ezmeral Data Fabric](https://www.hpe.com/us/en/software/data-fabric.html) brings together a solid foundation with a distributed, scalable file system and an upper layer that caters to diverse types of data – files, tables, containers, and more. The Ezmeral Data Fabric for Kubernetes extends its capabilities to offer persistent storage for containers.

Armed with the right amount of education and access to community, one can easily make the transition to deploying containers in production. Taking a page out of DevOps, having operations teams understand, deploy, and educate other stakeholders will speed up understanding of the benefits and therefore adoption.