---
title: Getting started with HPE GreenLake API for Data Services
date: 2024-04-02T00:37:09.418Z
priority: 0
author: Ron Dharma
authorimage: /img/rondbust.jpg
thumbnailimage: /img/alletra-element-small.png
disable: false
---
## What’s New?

Recently, a new set of REST APIs for GreenLake Edge to Cloud Platform was introduced on the [HPE GreenLake Developer website](https://developer.greenlake.hpe.com/docs/greenlake/services/data-services/public/) at https://developer.greenlake.hpe.com/docs/greenlake/services/data-services/public/.  These APIs are grouped under the set which is called HPE GreenLake API for Data Services.

This blog post will introduce some useful tips about using this Data Services  of APIs set given a specific use case. The introduction of these APIs arises from the necessity for manipulation of the common resources that are shared by the existing family of data services on HPE GreenLake (DataOps Manager, Block Storage, Backup and Recovery, Private Cloud Business Edition). This set of APIs provide users with the ability to perform any Create, Read, Update and Delete (CRUD) operations against these resources: *async-operations, dual-auth-operations, issues, secrets, software-releases, storage locations, and tags*.

The specification for these APIs is publicized as OpenAPI specification in JSON format, and the specification is available for download from this [section of the documentation](https://developer.greenlake.hpe.com/docs/greenlake/services/data-services/public/openapi/data-services-public-v1beta1/overview/) as shown below. Anyone can download the JSON file that contain the specification for this set, by clicking on the **Download** button. The specification follows the OpenAI standard 3.1.X, and contains all the information required so that this JSON on spec-file can be consumed by any OpenApi tools to provide client library, server mock, or documentation as described in this [OpenAPI Initiative](https://tools.openapis.org/)

![](/img/data-services-api-download-page.png "Figure 1. HPE GreenLake API for Data Services List")

![](/img/data-services-api-json-file.png "Figure 2. An example of the downloaded data-services.json contents.")