---
title: Converting HPE GreenLake API specifications in OAS 3.1 using OpenAPI tools
date: 2024-05-09T12:05:06.187Z
author: Ron Dharma
authorimage: /img/face-portraitlarge.jpg
thumbnailimage: /img/alletra-element-small.png
disable: false
tags:
  - hpe-greenlake
  - api
  - data-services-cloud-console
---
## What is HPE GreenLake APIs for data services?

The HPE GreenLake APIs are the family of the set of APIs to enable client users to perform manipulation of the REST API resources that are available as part of data services on HPE GreenLake. The data services on HPE GreenLake can be discovered under the Services’ [catalogue](https://common.cloud.hpe.com/services/service-catalog) that is named as the Storage as shown in below figure. Additionally, there is also HPE GreenLake Private Cloud  Business Edition service under the Services’ catalogue named as Private Cloud as shown in figure below.

![List of data services in the HPE GreenLake's Service-Catalog](/img/data-services-for-hpe-greenlake-list.png)

*The above figure shows the list of HPE GreenLake services part of the data services on HPE GreenLake family (snippets of the HPE GreenLake Service-catalogues)*

As of this publication of this blog post (May 2024), these are the list of those data services:

1. HPE DataOps Manager
2. HPE Block Storage service
3. HPE GreenLake for File Storage
4. HPE GreenLake for Storage Fabric Management
5. HPE GreenLake for Backup and Recovery
6. HPE GreenLake for Disaster Recovery
7. HPE GreenLake Private Cloud Business Edition

The REST APIs to support the services listed above, are documented in [this](https://support.hpe.com/hpesc/public/docDisplay?docId=sd00003533en_us&page=ps_api_dscc.html) HPE GreenLake documentation for REST API as shown in figure below.

![Menu that lists the GL OpenAPI documentation location](/img/openapi-top-documentation-available-at-hpe-support.png)

*The above figure shows the API documentation and the links to each set of HPE GreenLake APIs family for data services on HPE GreenLake.*

From the documentation, you can recognize that all these services REST API were provided as OpenAPI specifications file in either JSON or YAML format. Furthermore, you also notice that a single set of the HPE GreenLake API called Data Services Cloud Console is based on the OpenAPI Standard 3.0; however, the rest of the HPE GreenLake API set are based on the OpenAPI Standard 3.1. These APIs’ resources as of this blog post are ongoing development cycle where each of the existing APIs will be updated, deprecated, or new resources will be introduced. The information about the versioning for the APIs based on the OpenAPI Standard 3.1 is available at this link. For more information on the family of HPE GreenLake APIs, please see the following list of blog posts in HPE Developer forum: Data Services Cloud Console, Data Services, Virtualization, Backup and Recovery