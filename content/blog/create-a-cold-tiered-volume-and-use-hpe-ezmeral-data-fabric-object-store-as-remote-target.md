---
title: Create a Cold-Tiered Volume and use HPE Ezmeral Data Fabric Object Store
  as remote target
date: 2023-02-18T07:02:29.335Z
author: Raymond Yan
authorimage: https://i.ibb.co/64JFMHq/mmexport1595671906156-1.png
thumbnailimage: https://i.ibb.co/rvp7d53/thumbnail-image.png
disable: false
tags:
  - hpe-ezmeral-data-fabric
  - data-tiering
  - object-store
---
## Introduction

In HPE Ezmeral Data Fabric, you can create a Cold-Tiered Volume, set corresponding Storage Policies, and periodically offload the data in the Volume to the remote object storage.

The remote object storage can be the object storage of AWS, GCP, Azure and other public clouds, or an object storage service compatible with Minio.

Of course, you can also use the Object Store of HPE Ezmeral Data Fabric as a remote target.

This article will demonstrate how to create a Cold-Tiered Volume and configure another Ezmeral Data Fabric Object Store as the remote target for offloading.

At the same time, I will also demonstrate how to create an Account, IAM user, and bucket in the HPE Ezmeral Data Fabric Object Store, and use the AWS CLI to perform a put object operation on this bucket through the above configuration.

### [](#advantages-of-using-data-tiering)Advantages of using Data Tiering

HPE Ezmeral Data Fabric (data fabric) provides rule-based automated tiering functionality that allows you to seamlessly integrate with:

* Low-cost storage as an additional storage tier in the data fabric cluster for storing file data that is less frequently accessed ("warm" data) in erasure-coded volume.
* 3rd party cloud object storage as an additional storage tier in the data fabric cluster to store file data that is rarely accessed or archived ("cold" data).

In this way, valuable on-premise storage resources can be used for more active or "hot" file data and applications, while "warm" and/or "cold" file data can be retained at minimum cost for compliance, historical, or other business reasons. HPE Ezmeral Data Fabric provides consistent and simplified access to and management of the data.

### [](#advantages-of-using-object-store)Advantages of using Object Store

HPE Ezmeral Data Fabric Object Store is a native object storage solution that efficiently stores objects and metadata for optimized access.

Underlying each Object Store bucket is a volume. Every bucket created in an Object Store account is automatically associated with a volume. You can snapshot or mirror a bucket volume for disaster recovery.

If you create an account in Object Store, specify the erasure coding scheme (ecscheme) in the storage_class. All buckets created in the account inherit the ecscheme. Underlying volumes are automatically tiered such that data in a bucket volume can be offloaded to a back-end volume to reclaim storage space.

Some potential Object Store use cases include:

* Archive data and build on-premises applications, or migrate to cloud-native applications.
* Store media for operational use; reduce costs of storing globally distributed media, such as music, video, and images.
* Run analytics on data with tools like Apache Spark, Apache Drill, Presto, and S3 Select to gain valuable insights into customers, operations, or markets.
* Maintain Spark Delta Lake time travel information. You can time travel to see different versions of the data when Object Store is configured as a data lake for Spark Delta Lake.
* Store ML model data and share the ML models in real-time with downstream applications.
* Publish S3 events to HPE Ezmeral Data Fabric Streams.