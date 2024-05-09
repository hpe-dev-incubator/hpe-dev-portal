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
<style>
li {
   font-size: 27px;
   line-height: 33px;
   max-width: none;
}
</style>

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

From the documentation above, you can recognize that all these services APIs were provided as OpenAPI specification files in either JSON or YAML format. Furthermore, you also notice that a single set of the HPE GreenLake API called Data Services Cloud Console is based on the OpenAPI Standard 3.0; however, the rest of the HPE GreenLake API set are based on the OpenAPI Standard 3.1. 

These APIs’ resources as of this blog post are ongoing development cycle where each of the existing APIs will be updated, deprecated, or new resources will be introduced. The information about the versioning for the APIs based on the OpenAPI Standard 3.1 is available at this [link](https://developer.greenlake.hpe.com/docs/greenlake/guides/public/standards/versioning_basics/). For more information on the family of HPE GreenLake APIs, please see the following blog posts in HPE Developer forum: [Data Services Cloud Console](https://developer.hpe.com/blog/getting-started-with-the-hpe-data-services-cloud-console-public-rest-api), [Data Services](https://developer.hpe.com/blog/getting-started-with-hpe-greenlake-api-for-data-services/), [Virtualization](https://developer.hpe.com/blog/getting-started-with-hpe-greenlake-api-for-virtualization/), and [Backup and Recovery.](https://developer.hpe.com/blog/getting-started-with-hpe-greenlake-api-for-backup-and-recovery/)

## First tool of the day: a converter from OpenAPI Standard 3.1 to the OpenAPI Standard 3.0

The OpenAPI initiative provides a framework to describe any APIs so that these APIs can be consumed by different organizations for documentation, client side, server-side mocks, and many other opportunities. This framework has evolved from standard version 3.0 to version 3.1 with all the benefits as described in this [video](https://www.youtube.com/live/Sflpzh_cAcA?si=zkAKqGNYQz-5C6oe).  As described in this blog post, the top advantages of using the OpenAPI is to provide a way for a community to widely adopt the HPE GreenLake API by efficiently creating client libraries while in same time as the updates to HPE GreenLake API specs are happening. 

To accommodate the conversion, there are a couple of blog posts that have been created to explain the process for conversion of any HPE GreenLake spec file to [Python](https://developer.hpe.com/blog/get-started-building-dscc-api-client-libraries-for-python-using-openapi-generator/) client library and conversion from any HPE GreenLake spec file to [PowerShell ](https://developer.hpe.com/blog/getting-started-with-the-hpe-data-services-cloud-console-powershell-sdk/)client library. However, the challenge is that the open source [tool](https://openapi-generator.tech/) that is used to generate this client library can only facilitate the OpenAPI Standard version 3.0 spec file as the input; however, majority of the HPE GreenLake API sets that are written using the OpenAPI Standard version 3.1.

In this blog post, let me introduce a tool to convert the spec file in OpenAPI standard 3.1 to a spec file in OpenAPI standard 3.0 to enable conversion using the [openapi-generator-cli.](https://www.npmjs.com/package/@openapitools/openapi-generator-cli)  Let me introduce you to this open source tool named **apiture/openapi-down-convert** by David Biesack and Mike Ralphson which is documented in this GitHub [site](https://github.com/apiture/openapi-down-convert) and shown in figure below.

![openapi-down-convert Github website](/img/github-to-openapi-down-convert.png)

*The above figure shows the Github website for the documentation of the openapi-down-convert.*

To install this tool, you can follow the instructions at the Github [README](https://github.com/apiture/openapi-down-convert) using the JavaScript package manager called the **npm**.