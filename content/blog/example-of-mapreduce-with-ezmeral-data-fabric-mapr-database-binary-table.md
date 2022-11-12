---
title: Example of MapReduce With Ezmeral Data Fabric(MapR) Database Binary Table
date: 2022-10-26T10:52:25.618Z
featuredBlog: false
author: Raymond Yan
authorimage: /img/raymondyan-profile.png
thumbnailimage: /img/mapreduce_with_edf_binarytable.png
disable: false
tags:
  - EzmeralDataFabric
  - MapReduce
---
## Explanation of some glossary



<details>
<summary>Ezmeral Data Fabric (AKA. MapR)</summary>



EDF for short.
HPE Ezmeral Data Fabric is a platform for data-driven analytics, ML, and AI workloads.
The platform serves as a secure data store and provides file storage, NoSQL databases, object storage, and event streams.
The patented filesystem architecture was designed and built for performance, reliability, and scalability.
📖[Documentation website][EDFDocumentation]



</details>



## Introduction



This article will cover:



1. How to create Development Environment for HPE Ezmeral Data Fabric on Linux, Windows and Mac.



    This is a one-node cluster based on Docker containers, with a choice of different EDF versions, it integrates EEP.
    This way you can quickly create an EDF environment on your work computer.



2. Demonstrate a MapReduce application that uses EDF's Database Binary Table as the backend service.



    I would create the table using the hbase shell command line tool customized for EDF Database and do CRUD operations using a MapReduce application.



## Prerequisite: Create a Development Environment for EDF



There is already an article on the HPE Developer Portal blog that describes how to deploy a Development Environment👉: [Getting Started with Spark on MapR Sandbox][GettingStartedWithSparkOnMaprSandbox]
However, I recommend you to read the latest official documentation first👉: [Development Environment for HPE Ezmeral Data Fabric][DevelopmentEnvironmentForHpeEzmeral]



**Note**: 

Basically you can follow the instructions in the documentation, the documentation tells you to install Docker Desktop on a Mac, but you don't have to install Docker Desktop, it's fine to install the Docker Engine in a standard Linux distribution.

**It's worth noting that installing Docker Desktop in Windows won't work.**
I tried the following: first install WSL2 (Windows Subsystem Linux 2), then install Docker Desktop for Windows and integrate with WSL2, then run the EDF Development Environment install script, but it still fails.
So what I ended up doing was: install VMWare on my Windows PC, create a CentOS8 VM, and run the EDF Development Environment setup script in the VM. This approach is feasible.



[EDFDocumentation]: https://docs.datafabric.hpe.com/70/index.html
[GettingStartedWithSparkOnMaprSandbox]: https://developer.hpe.com/blog/getting-started-with-spark-on-mapr-sandbox/
[DevelopmentEnvironmentForHpeEzmeral]: https://docs.datafabric.hpe.com/70/MapRContainerDevelopers/MapRContainerDevelopersOverview.html


