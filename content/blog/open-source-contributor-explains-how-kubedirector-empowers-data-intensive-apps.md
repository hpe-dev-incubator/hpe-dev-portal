---
title: Open Source Contributor Explains How KubeDirector Empowers Data Intensive Apps
date: 2021-03-18T09:52:53.048Z
author: Dale Rensing
authorimage: /img/Avatar1.svg
tags:
  - kubedirector
  - hpe-ezmeral
  - hpe-ezmeral-container-platform
  - opensource
---
![Kartik Mathur](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/3/kartik-blog-small-1616160879068.jpg)

As a leading global, **edge-to-cloud platform-as-a-service company**, Hewlett Packard Enterprise (HPE) prides itself in employing team members who share one common purpose: to advance the way people live and work. In this blog series, you’ll get to meet a number of them as I interview some of the [open source](https://www.hpe.com/us/en/open-source.html) experts who make up the HPE team.
 

After having graduated with his MS in computer science from Indiana University Bloomington with a research focus on parallel computing and distributed systems, Kartik Mathur started his professional career at AMD. He then worked at several technology startup companies, including BlueData, which was acquired by HPE in 2019. Kartik is currently a Master Technologist at HPE and leads the MLOps initiatives on the HPE Ezmeral Software Platform. He has a keen interest in container orchestration for large scale data processing clusters and is a major contributor to the KubeDirector open source project.
  

## How did you get started with open source technologies?



I first started contributing to open source for a project that lets you query Cassandra tables using sparkSQL. But honestly, almost any piece of software that I’ve written or consumed was based on open source projects or libraries in some capacity. In my role at BlueData, I first used KubeDirector to orchestrate Big Data and ML pipelines, but then I started contributing as well. I found it so engaging that I’m currently the leading contributor and maintainer for the KubeDirector project.



## What makes KubeDirector so special?


KubeDirector empowers application developers to deploy their applications as a custom resource without having to implement a full-blown Kubernetes Operator. It decouples the operator boiler plate using application intelligence.
 
Basically, KubeDirector works as a custom controller for generic applications. It uses standard Kubernetes (K8s) facilities of custom resources and API extensions to implement stateful scaleout application clusters. This is a unique approach that enables the transparent integration with K8s user/resource management, as well as existing K8s clients and tools. 
 
KubeDirector is unique since it has a rich catalog of complex stateful applications as part of the open-source codebase. And we are constantly adding more and more applications that developers can use as a template/example to onboard their application of choice on Kubernetes. Without KubeDirector, this would be an intimidating task with a huge learning curve, especially for implementing Day2 operations for their applications, like scaling in and out. 

## How do HPE customers benefit from KubeDirector?



Over the course of the last few years, Kubernetes has become the de-facto standard for orchestrating containerized applications. It’s worked quite well for stateless applications; less so for stateful applications, such as those focused on AI, machine learning, and big data analytics. 



When containers were first introduced as a way to package microservices, they were designed to be entirely stateless and ephemeral. A container would spin up, do its job, and then disappear, without leaving any record of what happened while it was running. Stateful applications save data to persistent disk storage for use by the server, clients, and other applications. An example of a stateful application is a database or key-value store to which data is saved and retrieved by other applications. There are tools, such as Statefulset and Persistent Volumes, which help developers build stateful applications on Kubernetes, but it all becomes quite difficult to manage as an application scales.



Since KubeDirector provides an application-agnostic deployment pattern, it enables developers to run non-cloud native stateful applications on Kubernetes without modifying any code. It makes it easier to deploy data-intensive distributed applications for AI and analytics use cases, such as Hadoop, Spark, Kafka, TensorFlow, etc., on Kubernetes. HPE Ezmeral customers automatically receive the benefits of KubeDirector because it’s integrated into the HPE Ezmeral Software Platform, enabling them to more easily develop AI and ML applications.



## What’s up next for KubeDirector? 



The next big ticket item for me to work on is to tighten up the security. I’m currently looking at implementing Istio awareness for Kubedirector application endpoints, providing virtual endpoints to secure the microservices communication between them using JSON Web tokens (JWT).



## Is there any advice you’d like to give others who might follow in your footsteps? 



Robert Noyce, co-founder of Intel Corporation, once said “Knowledge shared is power multiplied.” I’m a huge fan of this quote. I feel as though open source projects are the biggest testament to the power of knowledge sharing. It gives me immense pleasure in being able to learn and collaborate with people worldwide, as being a part of the open source community helps me grow as an engineer and lift others as well.
 
To learn more about the open source projects that HPE is involved with, please visit [our website](https://www.hpe.com/us/en/open-source.html). Interested in exploring what HPE offers for developers and data scientists? Check out our [HPE DEV site](https://developer.hpe.com/) for a ton of articles, workshops, tutorials, and other resources.

