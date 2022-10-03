---
title: Beta test our new HPE GreenLake for Data Fabric!
date: 2022-09-23T20:32:16.515Z
author: Alaric Thomas
authorimage: /img/alaric_0.1.jpg
thumbnailimage: /img/1338228_zh3kqtu6roaxv7asnc97_sw-dc-ezmeralwebinars-220921-gldatafabric-v1c.jpg
tags:
  - hpe-ezmeral
  - data-fabric
  - hpe-greenlake
---
The HPE Ezmeral Early Access program is a new program designed to ensure new and exciting products are constantly developed. Through this beta program, we are giving you the opportunity to test out products and provide feedback to the engineering team. With exemplary training and support provided by HPE, you’ll get hands-on experience with new features and capabilities. One of our newest, exciting projects revolves around HPE Ezmeral Data Fabric, as it is about to start a new journey in its delivery of an enterprise-grade data fabric for hybrid and multi-cloud enterprises, bringing enterprise-grade data fabric to the as-a-Service world.

**Chasing that single-source-of-truth**

As we look back on software technology evolution, particularly around the area of analytics, we see a major challenge and theme recurring around the establishment of a single-source-of-truth. Firstly, there’s EIS (Executive Information Systems), which were usually OLAP (online analytical processing) cubes (multi-dimensional arrays of data), professing a single point to capture, aggregate and share analytic data. Then, when OLAP cube scalability became too limiting, ROLAP (Relational Online Analytical Processing) became the preferred solution. By definition, ROLAP brought the relational database into analytic solutions and added technologies and terms such as query and reporting, the data mart, and data warehouse (with their star and snowflake schemas), all including the single-source-of-truth value proposition in their range of benefits to the enterprise.

Next came the data lake, predominantly driven by HDFS (Hadoop Distributed File System) taking mass, unstructured data storage to significantly higher scales. Structured use cases started to fold into HDFS with new iterations of columnar stores providing scale, with some structure, typically over HDFS / data lakes.

While this was going on, clouds were forming – however clouds posed a greater threat to the single-source-of-truth. Clouds wanted your data to reside outside your premises and made it hard (and/or expensive) to share. For enterprises that deploy across multiple clouds, and likely on-prem and at the edge, this meant new islands of data and multiple versions of the truth.

Today we have returned to the single data lake as one solution to the many versions of the truth issue. The single date lake is reminiscent of past approaches: bring all data into one location to standardize, normalize, aggregate and then distribute the results. A second approach, a federated approach, is to leave the data in place and retrieve only what is requested when it is requested, possibly with some query optimization and intelligent caching thrown in to minimize the impact on performance.

**Solving the issue with data fabric**

HPE Ezmeral Data Fabric started and grew up in the big data world. It has long been trusted as an enterprise-grade data fabric managing data at scale for mission-critical applications across industries and use cases. Users today enjoy a single global name space that provides one point to review all attached data assets across data fabric deployments. Multi-modal data access delivers on the need to build an application once and deploy anywhere there is a data fabric. In addition, the multi-modal nature of the data fabric allows the development of stream-based, object-based apps and file-based apps against the same data without duplicating that data – very much a single version of the truth. Additionally, and if needed, the data fabric is good at moving data securely and optimally from deployment to deployment. 

The upcoming release of HPE GreenLake for Data Fabric brings the same enterprise-grade data fabric to the as-a-Service world. The installation, configuration and management of deployments is no longer a customer responsibility. The data fabric comes installed, running and is maintained by HPE. Customer-facing management tasks are elevated to the level of creation of storage buckets and volumes, managing user quotas, sharing of entry points with fellow application developers and overall monitoring of usage, all driven through a central UI that can manage all your HPE GreenLake for Data Fabric deployments.

**Beta test it yourself**

With the upcoming HPE GreenLake for Data Fabric beta, we are targeting use cases in the hybrid and multi-cloud world, for example those who want to write an application once and run it on any deployment target using a consistent set of multi-modal APIs. It is for those who want to build a data plane that gives a consistent view of data assets across clouds via a single global name space and those that want to synchronize data across clouds securely and efficiently. The as-a-Service tooling allows the management of all clusters from a single interface, further simplifying management of your data plane. We will post additional resources on the [HPE Developer Community portal](https://developer.hpe.com/) that show example use cases. We will also provide you with [a Slack channel](https://hpedev.slack.com/archives/C044E295003) where you can connect with us to answer any questions you have.

HPE will begin the beta of this new service in November this year (2022) and you will be able to register soon. Beta testers, can deploy initially into AWS then other public clouds as well as on-prem hardware. Join us to learn more in our upcoming [HPE GreenLake for Data Fabric webinar](https://hpe.zoom.us/webinar/register/3716641878854/WN_xLR2ynonSi6SojUswkVmRw). We look forward to learning about your use cases.