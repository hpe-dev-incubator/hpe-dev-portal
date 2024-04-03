---
title: Getting started with HPE GreenLake API for Virtualization
date: 2024-04-03T21:18:41.183Z
author: Ron Dharma
authorimage: /img/rondbust.jpg
thumbnailimage: /img/alletra-element-small.png
disable: false
---
## What’s New?

Recently, a new set of REST APIs for HPE GreenLake edge-to-cloud platform was introduced on the HPE GreenLake Developer [website](https://developer.greenlake.hpe.com/docs/greenlake/services/virtualization/public/guide/).  These APIs are grouped under the set which is called HPE GreenLake API for Virtualization. Several articles will be written and posted on HPE Developer’s forum blog site to help you better understand and work with these APIs in conjunction with the family of data services on HPE GreenLake

This the 2nd blog post from the series of blog postings (Data-Services,  Backup and Recovery , and Private Cloud Business Edition ) that will introduce some useful tips and best practices about using this new set of APIs given a specific use case. The purpose of the Virtualization API is described from the Developer Guide: “The HPE GreenLake for Virtualization API provides management of virtual machines and other virtual resources in public clouds and on-premises systems.”  At time of release, this set of APIs supports for hypervisor includes VMware (7.X and 8.X) for on-prem hypervisors; additionally, AWS EC2 and Azure for cloud public-provider. The resources that are supported on-premises are *virtual machines, virtual machine images, datastores, VMware clusters (hosts, folders, networks, tags, networks, resource-pool)*. Conversely, the resources that are supported on cloud providers are *virtual machine instance, virtual machine images, and virtual machine instance types*. 

The specification for this set of APIs is publicized as OpenAPI specification in JSON format, and the specification is available for download from [this section](https://developer.greenlake.hpe.com/docs/greenlake/services/virtualization/public/openapi/virtualization-public-v1beta1/overview/) of the documentation as shown below. The specification follows the OpenAI standard 3.1.X which contains all information required so that this JSON spec-file can be consumed by any OpenApi tools to generate client library, SDK, server mock, or documentation as described in this [OpenAPI Initiative](https://tools.openapis.org/).