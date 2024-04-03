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

![](/img/virtualization-api-guide-website-and-download.png "HPE GreenLake API for Virtualization documentation.")

*The above figure shows HPE GreenLake API for  Virtualization's  drop down list, and the link to download the openAPI specification in JSON format.*

![](/img/virtualization-openapi-3.1-spec-file.png "HPE GreenLake OAS 3.1 specification for Virtualization download.")

*The above figure shows a sample of the downloaded OpenAPI specification of the HPE GreenLake virtualization API.*

## API versioning

This set of APIs is identified as revision V1Beta1 at the time of its introduction in March 2024. Moving forward, the APIs will be updated to it’s next revision as they evolves toward the long-term release version. As each individual API is updated, there will also be more capabilities added to any of the resources identified under the APIs. Furthermore, there will be more resources that are not currently available for this API, added in the future. For information about update stages, and deprecation, please follow the HPE GreenLake Developer Portal [Versioning Guide](https://developer.greenlake.hpe.com/docs/greenlake/guides/public/standards/versioning_basics/).

## What are these virtualization resources?

The following pictures depict some of the resources that are related to the virtualization APIs that can be discovered inside the two cloud data services that are part of the HPE GreenLake. The two services which leverage these APIs are HPE GreenLake for Backup and Recovery (GLBR), and HPE GreenLake for Private Cloud Business Edition (PCBE). Both services leverage the APIs to discover assets that would need to be onboarded, protected, orchestrated, nurtured, or retired following the CRUD principle of the REST API. Each object presented in the pictures below are part of the User Interface that can be manipulated using the APIs.


**Note:** Not all virtualization API resources at HPE GreenLake for Backup and Recovery and HPE GreenLake for Private Cloud Business Edition available in the user interface are going to be available inside this set of APIs upon its first release. Due to sharing of the virtualization services between the two services, any virtualization resources that are added into one HPE GreenLake workspace used by both services can be manipulated GreenLake API for virtualization using the same instance Id.

![](/img/resources-correspond-to-virtualization-api-in-glbr.png "On-prem resources in GLBR")

*T﻿he above figure shows virtualization resources related to VMware in HPE GreenLake for Backup and Recovery.*