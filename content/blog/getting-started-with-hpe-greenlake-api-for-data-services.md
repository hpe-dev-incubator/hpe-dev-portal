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

This blog post will introduce some useful tips about using this HPE GreenLake API for Data Services given a specific use case. The introduction of these APIs arises from the necessity for manipulation of the common resources that are shared by the existing family of data services on HPE GreenLake (DataOps Manager, Block Storage, Backup and Recovery, Private Cloud Business Edition). This set of APIs provide users with the ability to perform any Create, Read, Update and Delete (CRUD) operations against these resources: *async-operations, dual-auth-operations, issues, secrets, software-releases, storage locations, and tags*.

The specification for these APIs is publicized as OpenAPI specification in JSON format, and the specification is available for download from this [section of the documentation](https://developer.greenlake.hpe.com/docs/greenlake/services/data-services/public/openapi/data-services-public-v1beta1/overview/) as shown below. Anyone can download the JSON file that contain the specification for this set, by clicking on the **Download** button. The specification follows the OpenAI standard 3.1.X, and contains all the information required so that this JSON on spec-file can be consumed by any OpenApi tools to provide client library, server mock, or documentation as described in this [OpenAPI Initiative](https://tools.openapis.org/)

![Figure 1. HPE GreenLake API for Data Services List](/img/data-services-api-download-page.png "Figure 1. HPE GreenLake API for Data Services List")

Figure 1. HPE GreenLake API for Data Services List

![Figure 2. An example of the downloaded data-services.json contents.](/img/data-services-api-json-file.png "Figure 2. An example of the downloaded data-services.json contents.")

Figure 2. An example of the downloaded data-services.json contents.

## API versioning

This set of APIs is identified as revision V1Beta1 at the time of its introduction in March 2024. Moving forward, the API will be updated to its next revision, moving toward the long-term release version. As each individual API is updated, there will also be more capabilities added to any of the resources identified under this set of APIs.  For information about update stages, and deprecation, please follow the HPE GreenLake Developer Portal Versioning Guide at this [link](https://developer.greenlake.hpe.com/docs/greenlake/guides/public/standards/versioning_basics/)

## What are these data services resources?

The following pictures depict some of the resources that are related to Data-Services that can be discovered on the main page for the Data Services Cloud Console (UI). Other resources, such as software-releases, storage-locations and tags, are embedded inside data services storage objects, such as the software deployed for Backup and Recovery’s Data Orchestrator, the location of the storage repository for Backup and Recovery’s cloud protection store, and tags associated with the storage array.


**Note:**  The resources that are presented as Tasks in this main page are identified as **async-operations**, which is the universal API used to monitor logs of all services under DSCC. Additionally, the async-operations API is also used to track any API operations that are running in background as covered later in this blog. Future iterations of the API release will also add more resources, e.g. email-notification, or add more capabilities, e.g.  POST/PATCH for tag (currently GET is the only available method for tag).