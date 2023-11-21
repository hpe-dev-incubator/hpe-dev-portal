---
title: "Event-Driven Microservices on the MapR Data Platform"
date: 2021-02-05T07:05:46.365Z
author: Rachel Silver 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR"]
authorimage: "/img/blogs/Avatar3.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019 may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
"authorDisplayName": "Rachel Silver",
"publish": "2016-09-27T07:00:00.000Z",
"tags": "use-cases"
```

---

MapR is pleased to announce support for event-driven microservices on the MapR Data Platform. In this blog post, I’d like to explain what this means and how it fits into our bigger idea of “convergence.”

## What are event-driven microservices?

Microservices are simple, single-purpose applications that work in unison via lightweight communications, such as data streams. They allow you to more easily manage segmented efforts to build, integrate, and coordinate your applications in ways that have traditionally been impossible with monolithic applications.

By breaking up the pieces of a large application and isolating them into smaller microservice apps, you introduce agility, as these can typically be built and maintained by small, often cross-functional teams. And, they offer flexibility by promoting reuse across different solutions.

Event-driven microservices leverage event streaming engines like MapR Event Store for Apache Kafka as the communications vehicles between them. And by converging file, database, and streaming services using our publish-and-subscribe framework, we can enable you to run analytical workloads using a combination of recent and historical data.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/operational-analytics-in-mapr-converged-platform-1612508715159.png)

## What advantages do microservices provide?

The logical and functional isolation of services provided by our microservices support is ideal for all complex workflows, but for machine learning training in particular. This is because it’s a natural infrastructure for tracking the different outputs of evolving application versions.

**To illustrate this, let’s take a look at an example using data versioning and snapshots:**

During your application development life cycle, enhancements to your code will result in different outputs, and these outputs are important to preserve during the development life cycle to compare results and verify improvement.

MapR Volumes are logical partitions in your cluster that can contain databases, files, and streams. Thus, each application version output can be directed to a specific volume with the associated output data. And, in a microservices architecture, all versions can be deployed in parallel to make live comparisons and ensure a more graceful upgrade process.

In addition, input data can be organized in a volume and then actively preserved using a snapshot. This creates an immutable copy of the data that can be used as the basis for ongoing testing against future versions of your application. You can keep enhancing your application and run it against a known data set to ensure you can identify changes that are a direct result of your code changes, not due to changes in the data.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/snapshots-in-app-development-1612508723835.png)

Different versions of database records, files, and event data need to be tracked and managed together in a streaming environment.

Ready for a real-world example? The diagram below shows the high-level architecture of the converged application blueprint.

This was built to be specific to stock trading data analysis, but the concepts apply to any environment that deals with combining real-time streams & historical data. This application is a great example of how you can process a high-speed stream of incoming data and enable both operational and analytical workloads on a single converged cluster. Take a look!

![App Blueprint](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/blueprint-arch-final-1612508815719.jpg)

## How does this all work?

An integrated publish-and-subscribe framework to support event-driven applications.

The foundation of our microservices offering is our low latency messaging system. It’s adaptable, scalable, and allows you to leverage your converged platform to integrate data-in-motion and data-at-rest to support real-time applications.

It’s a remarkably versatile framework allowing communication pipelines in hybrid cloud microservice architectures, between local applications, and among Docker containers. Built-in resource multi-tenancy allow you to run both processing and messaging services in the same cluster and on the same nodes.

MapR Event Store consumers will automatically load-balance across partitions, enabling the application to scale linearly with increasing data rates, and the stream can be queried directly with the results integrated with the output of any microservice app in the pipeline.

## Simplified Microservices Monitoring and Management

As more organizations adopt these microservices architectures, they will need better tools for monitoring and management. The MapR Data Platform has already accomplished much of this with the following:

*   Comprehensive monitoring of resource usage using MapR Monitoring components
*   Support for containerized applications in Docker
*   Continuous high availability and multi-master disaster recovery capabilities
*   Unified security with access control expressions for stream access and analytics