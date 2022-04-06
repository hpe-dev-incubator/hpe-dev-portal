---
title: File, objects, databases and streams – Oh my!
date: 2022-03-31T15:49:36.744Z
featuredBlog: true
priority: 1
author: Sridhar Reddy
authorimage: /img/sridhar-reddy.png
thumbnailimage: /img/data-fabric-7-1200-x-675.png
tags:
  - hpe-ezmeral-data-fabric
  - MapR
---
Analytics and machine learning (ML) have become key elements of every data-driven enterprise. The good news is that organizations have a lot of data at their disposal. The not-so-good news is that this data is distributed across data lakes, warehouses, edge, core, and data centers, making it more difficult for data engineers and scientists to do their jobs.  HPE Ezmeral Data Fabric solves this problem by ingesting and cleansing hybrid data distributed across edge to cloud into a single logical infrastructure providing data teams with a unified data source that increases data integrity and trust in analytic insights. 

<img src="/img/architecture-edf7-new.png" width="600" height="324" alt="Figure 1 Solution stack for HPE Ezmeral Data Fabric">

##### *Figure 1 Solution stack for HPE Ezmeral Data Fabric*

## Introducing HPE Ezmeral Data Fabric 7.0 with support for S3 compatible object store and FIPS compliance

The[ latest release of HPE Ezmeral Data Fabric](https://community.hpe.com/t5/HPE-Ezmeral-Uncut/HPE-Ezmeral-News-GA-for-the-Enterprise-Data-and-Unified/ba-p/7163244) adds support for the fastest growing data type today, object. This release makes HPE Ezmeral Data Fabric the industry’s first data fabric to centralize files, objects, NoSQL databases and streams into a single data store, simplifying data lifecycle and operational management.  Key features of this release include:

* A high-performance object store
* Federal Information Processing Standard (FIPS) compliance
* Security enhancements
* Dynamic data masking for JSON document databases
* Performance improvements using Remote Direct Memory Access (RDMA)

Let’s examine these features in detail.

## High-Performance Object Store

High-performance object store capabilities optimize all object sizes for both performance and storage efficiency. With HPE Ezmeral Data Fabric, multi-protocol access, using S3 API or standard interfaces, increases object availability to a wider set of traditional and cloud-native applications. As a part of this, HPE Ezmeral Data Fabric now allows you to: 

* Be Write Once Read Many (WORM) compliant, helping organizations that must satisfy record keeping rules that ensure data is not tampered with in any possible way. This governance and compliance for data retention periods is very useful in financial and healthcare vertical markets.
* Integrate with MCS: With the new object store UI, administrators can manage accounts, buckets, objects, access policies, and users through a simple, intuitive interface.
* Archive data and build on-premises applications or migrate to cloud-native applications.
* Store media for operational use with fast retrieval, reduce costs of storing globally distributed media, such as music, video, and images.
* Run analytics on object data with tools like Apache Spark, Apache Drill, Presto, and [S3 Select](https://docs-datafabric.mip.storage.hpecorp.net/70/MapROverview/query-s3-select.html) to gain valuable insights into customers, operations, or markets.
* Store ML model data and share the ML models in real-time with downstream applications.
* Publish S3 events to HPE Ezmeral Data Fabric streams for monitoring activity.
* Be compatible with opensource AWS S3 SDK and Minio SDK.

## Federal Information Processing Standard Support

The Federal Information Processing Standard (FIPS) is a US government standard used to approve cryptographic modules. FIPS-validated products give users the assurance that data within the product is protected using cryptographic algorithms meeting the stringent guidelines and testing procedures established by the FIPS standard. FIPS was established by the National Institute of Standards and Technology (NIST) and defines critical security parameters that vendors must use for encryption. Products sold to the US government must meet FIPS validation criteria. In addition, there is a growing need by organizations processing sensitive data, such as banks, financial institutions, legal and medical institutions, to have the products that are FIPS 140-2/3 validated.

The release of HPE Ezmeral Data Fabric includes [FIPS 140-2](https://csrc.nist.gov/projects/cryptographic-module-validation-program/certificate/819) Level 1 compliance to leverage operating systems that include FIPS 140-2 Level 1 certified cryptographic libraries provided by the user. It also includes support for Bouncy Castle Java FIPS API bundled with HPE Ezmeral Data Fabric, which runs on a compatible user-supplied JDK. 

In this release, HPE Ezmeral Data Fabric uses the open SSL cryptographic model distributed in operating systems supported by the core platform, which has obtained FIPS 140-2 Level 1 certification. It includes enhancements to the data fabric core platform that invokes FIPS 140-2 Level validated cryptography when FIPS mode is enabled and ensures that no sensitive data is stored in plain text. The following operating systems are supported:  Red Hat 8.x, Ubuntu 18.04 and 20.04 and SLES 15 SP 2. 

Note: For all supported operating systems listed above, HPE Ezmeral Data Fabric uses the Java FIPS API from [Bouncy Castle](https://www.bouncycastle.org/), which has FIPS 140-2 Level 1 approval.

## Security enhancements

This release includes a number of features that harden the HPE Ezmeral Data Fabric platform. The HPE Ezmeral Data Fabric platform now: 

* Eliminates all clear-text passwords. 
* Supports for the separation of passwords for key and trust stores 
* Enhances data-fabric SASL to enable applications that are not cluster aware (such as data-fabric ecosystem components) to gain access to services in another cluster for which they have a ticket. 
* Enhances the ***mrhsm*** utility. ***mrhsm*** is used to configure KMIP support and includes support for file-based key stores.
* Includes a new property ***(isFips)*** in the output of the ***maprcli node list*** command to indicate whether a particular node is FIPS-enabled.
* Offers a new ticket type: A new ***servicewithimpersonationandticket*** ticket type is introduced that allows some ticket holders to generate tickets subject to their impersonation authority. 
* Has cross-cluster security enhancements: ***configure-crosscluster.sh*** script to automate establishing security between two clusters. New options are provided to specify trust store passwords. The file ***/etc/hadoop/ssl-server.xml*** no longer includes the trust store passwords.

## Other enhancements

#### Dynamic Data Masking for JSON document database

Dynamic data masking is the ability to apply variety of data masks in real-time on customer-designated fields in database queries, to hide sensitive data.  This feature is perfect for Personal Identifiable Information (PII) or General Data Protection Regulation (GDPR) use cases. 

#### Performance Improvements using Remote Direct Memory Access

Remote Direct Memory Access (RDMA) transfers data directly between user space process buffers on separate servers to bypass the Linux kernel and server CPU for increased performance and lower CPU utilization.

#### Ezmeral Ecosystem Pack (EEP)

Ezmeral Ecosystem Pack (EEP) provides certified open-source tools and engines that can be directly layered onto the data fabric reducing time spent integrating and configuring open-source tools for analytics. New to this release is Apache Airflow 2.2.1 along with significant updates to Apache Spark™ 3.2.0. Enhancements are also made to many other Hadoop components as well as Apache Drill 1.16.1. 

## Get to know HPE Ezmeral Data Fabric better

Developers, data engineers and scientists need high quality data to deliver the trusted insights businesses run on. Trusted insights only happen when distributed data is centralized into a single data layer that is optimized for analytics use cases. HPE Ezmeral Data Fabric delivers that high-performance, unified data layer without compromising security and governance that allows organizations to go to the next level by layering open-source engines and tools to deliver insights faster. 

For more information, please refer to the below listed resources. You can find other articles on HPE Ezmeral Data Fabric on the[ HPE DEV blog](https://developer.hpe.com/blog).

* [Core](http://package.mapr.hpe.com/releases/v7.0.0) 
* [EEP 8.1.0](http://package.mapr.hpe.com/releases/MEP/MEP-8.1.0/)  
* [Documentation and release notes](https://docs.datafabric.hpe.com/70/home.html)