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