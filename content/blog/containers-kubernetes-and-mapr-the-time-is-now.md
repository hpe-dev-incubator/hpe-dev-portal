---
title: "Containers, Kubernetes, and MapR: The Time is Now"
date: 2021-02-05T06:41:32.999Z
author: Suzy Visvanathan 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","kubernetes","container"]
authorimage: "/img/blogs/Avatar5.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019 may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
"authorDisplayName": "Suzy Visvanathan",
"publish": "2018-03-06T10:45:00.000",
"tags": "mapr-platform"
```

---

If you have been following the world of containers, you already know that Kubernetes has won the container orchestration war. Docker was instrumental in commercializing the use of containers as a method to deploy applications. However, Docker and Kubernetes only address a minor percentage of total applications. They struggle to support stateful applications that require persisted data. With the announcement today, MapR changes all that by enabling Kubernetes to support the containerization of all applications.

Containers allow an application to be packaged with a skeleton of its dependencies, giving it lightweight attributes, which ensures that the application can remain independent of the environment, infrastructure, and configuration. Containers, by nature, are stateless, which is a term to indicate that containers retain knowledge of data only during their lifecycle. Containers quickly became a developer's preferred platform, but it wasn't long before customers started thinking of deploying applications in production.

![Kubernetes List](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/kubernetes-list-1612507221998.png)

Containers in production bring forth a completely different set of requirements than containers in development. The biggest set of requirements is around data. The stateless nature of containers runs into significant challenges when relying on data that needs to be persisted across sessions or shared across applications.

Customers have various issues to consider, resulting in a steep learning curve. The checklist will vary from customer to customer, due in part to the complexity and disparity in environments. Docker, which has become synonymous with containers, even though containers have been in use for a long time, does not necessarily offer solutions for all of these aspects.

![Management de facto standard](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/standard-1612507235714.png)

If you consider management and orchestration, many solutions quickly cropped up to fill the gap of container management. Mesosphere Marathon, Google Kubernetes, Docker Swarm, OpenStack Magnum, and VMware Photon were all fighting for a piece of the container management pie. Initially, it appeared that Mesos would come out on top, but it has been quickly overtaken by Kubernetes, as is evident in the survey done by CNCF.


Kubernetes is fast becoming the container orchestration and management de facto standard. A quick primer on Kubernetes summarizes its benefits and many of the reasons for its growth in popularity.

* Offers intelligent and balanced scheduling of containers
* Automates creation, deletion, and movement of containers
* Assists with easy scaling of containers
* Offers monitoring and self-healing abilities


Leading public cloud vendors enable many aspects of services on Kubernetes. Kubernetes itself only manages and orchestrates containers but does not organically offer all of the aspects required for an organization to successfully deploy in production. The MapR integration with Kubernetes can assist customers through their journey of deploying containers in production.

![MapR CDP](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/mapr-cdp-1612507248730.png)

The MapR Data Platform (MCDP) provides an ideal platform for containerized applications. MCDP is built on the foundation of scale, high availability, and versatility in hosting different types of applications and across different environments. The distinctive aspect of the MapR Platform lies in how it combines a distributed data store that offers enterprise storage features to support all applications, including those running in containers, with a full-fledged, robust, big data analytics ecosystem. MapR addresses the aspects required for production deployments, starting with high availability, policy-driven data placement, and extending all the way to sound disaster recovery strategy. These are fundamental requirements that a data fabric must address. MapR customers build such data fabrics to capture, store, process, and analyze petabytes of data.

For Kubernetes-based container deployments, MapR brings its data fabric that extracts and exposes the underlying storage capacity as persistent storage volumes to Kubernetes. Customers can now run applications in containers managed by Kubernetes and take advantage of the benefits of the MapR platform.

![Versatility](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/versatility-1612507262825.png)

MapR achieves this versatility by starting with a few basics:

* Vast scalability
* Global namespace
* Support for diverse data
* Native multi-temperature management
* Cloud-grade reliability
* Multi-tenancy and security
* Naturally analytics-ready
* Built-in operational application capability
* Reliable global pub/sub stream transport
* Capable of spanning from edge to edge


Armed with these strong capabilities, MapR easily and naturally expands to varying use cases, applications, and organizations.

With Kubernetes and containers starting to play a major role in many of these use cases where MapR has distinct complementing features already baked into its platform, it would be remiss of organizations not to take advantage of such a powerful combined solution.

![MapR Data Fabric for Kubernetes](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/mapr-data-fabric-kubernetes-1612507274729.png)

This unique position of MapR Data Fabric for Kubernetes can assist with an enterprise organization's journey with containers and deliver a powerful impact on day-to-day business that will have a long-standing benefit. The time is now to take advantage of MapR Data Fabric for Kubernetes.