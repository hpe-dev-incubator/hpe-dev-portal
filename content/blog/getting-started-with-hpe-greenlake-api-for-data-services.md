---
title: Getting started with HPE GreenLake APIs for Data Services
date: 2024-04-02T00:37:09.418Z
priority: 0
author: Ron Dharma
authorimage: /img/rondbust.jpg
thumbnailimage: /img/alletra-element-small.png
disable: false
tags:
  - API
  - hpe-greenlake
  - data-services-cloud-console
---
<style> li { font-size: 27px; line-height: 33px; max-width: none; } </style>

## What’s New?

Recently, a new set of REST APIs for HPE GreenLake edge-to-cloud Platform was introduced on the HPE GreenLake Developer [website](https://developer.greenlake.hpe.com/docs/greenlake/services/data-services/public/).  These APIs are grouped into a set called HPE GreenLake APIs for Data Services. Several articles will be written and posted on [HPE Developer's forum blog site](https://developer.hpe.com/blog) to help you better understand and use HPE GreenLake APIs to enhance your DataOps' operations.

This is the first in a series of blog postings ([Data-Services](https://developer.hpe.com/blogs/getting-started-with-hpe-greenlake-api-for-data-services), [Virtualization](https://developer.hpe.com/blogs/getting-started-with-hpe-greenlake-api-for-virtualization), [Backup and Recovery](https://developer.hpe.com/blogs/getting-started-with-hpe-greenlake-api-for-backup-and-recovery), and Private Cloud Business Edition) that introduce some useful tips and best practices about using this new set of APIs given a specific use case. The introduction of these APIs arises from the necessity for manipulation of the common resources that are shared by the existing family of data services on HPE GreenLake (DataOps Manager, Block Storage, virtualization, Backup and Recovery, Private Cloud Business Edition). This set of APIs provide users with the ability to perform any Create, Read, Update and Delete (CRUD) operations against these resources:  *async-operations, dual-auth-operations, issues, secrets, software-releases, storage locations, and tags*.

The specification for these APIs is publicized as an OpenAPI specification in JSON format, and the specification is available for download from this [section](https://developer.greenlake.hpe.com/docs/greenlake/services/data-services/public/openapi/data-services-public-v1beta1/overview/) of the documentation (shown below). Anyone can download the JSON file that contain the specification for this set, by clicking on the **Download** button. The specification follows the OpenAPI standard 3.1 that contains all information required so that this JSON OpenAPI spec-file can be consumed by any OpenAPI tools to provide client library, server mock, or documentation as described in this OpenAPI [Initiative](https://tools.openapis.org/). 

![Figure 1. HPE GreenLake API for Data Services List](/img/data-services-api-download-page.png "Figure 1. HPE GreenLake API for Data Services List")

*The above figure shows the list of HPE GreenLake APIs for Data Services* 

![Figure 2. An example of the downloaded data-services.json contents.](/img/data-services-api-json-file.png "Figure 2. An example of the downloaded data-services.json contents.")

*The above figure shows an example of the downloaded data-services.json contents.* 

This set of APIs is identified as revision v1beta1 at the time of its introduction in March 2024. Moving forward, the API will be updated to its next revision, moving toward the long-term release version. As each individual API is updated, there will also be more capabilities added to any of the resources identified under this set of APIs. Furthermore, there will be more resources that are not currently available for this API added in the future. For information about management of versioning, please follow the HPE GreenLake Developer Portal Versioning Guide at this [link](https://developer.greenlake.hpe.com/docs/greenlake/guides/public/standards/versioning_basics/).

## What are these data services' resources?

The following pictures depict some of the resources that are related to Data Services that can be discovered on the main page for the Data Services Cloud Console (UI). Other resources, such as software-releases, storage-locations and tags, are embedded inside data services storage objects. The examples of fore mentioned resources are the software deployed for Backup and Recovery’s Data Orchestrator, the location of the storage repository for Backup and Recovery’s cloud protection store, and tags associated with the storage array. 

> **Note:**  The resources that are presented as **Tasks** in this main page are identified as **async-operations**, which is the universal API resource used to monitor completion or status of all services under data services on HPE GreenLake. Additionally, the async-operations API is also used to track any API operations that are running in background as covered later in this blog post. Future iterations of the API release will also add more resources, e.g. email-notification, or add more capabilities, e.g.  POST/PATCH for tag (currently GET is the only available method for tag).

![](/img/data-services-resources-in-dscc-ui.png "Figure 3 Some of the resources that are managed by Data Services API.")

*The above figure shows some of the resources that are managed by HPE GreenLake APIs for data services*

## Using the HPE GreenLake APIs for data services

Documentation on using this set of APIs is provided on the HPE GreenLake Developer Portal at this [link](https://developer.greenlake.hpe.com/docs/greenlake/services/data-services/public/guide/).  There is also a blog post that describes how to use publicly available tools, such as Postman, to manipulate this set of APIs without using any programming languages found at this [link](https://developer.hpe.com/blog/oauth2-for-hpe-greenlake-data-services-cloud-console/). Additional blog post that describes about using Postman for this set of APIs is also found at this [link](https://developer.hpe.com/blog/learn-what-you-can-do-with-hpe-data-services-cloud-console-api-in-just-3-minutes/). Moreover, there will be blog posts available that provide guidance on how to convert this data services OpenAPI spec that is based on OpenAPI spec 3.1 to a scripting client library in future.  Anyone can follow the examples provided by each API reference in the documentation [page](https://developer.greenlake.hpe.com/docs/greenlake/services/data-services/public/) such as what’s shown below. The documentation provides details on the API syntax for a particular method, arguments used for the API, successful and failed responses, and several examples using cURL, JavaScript, Python, and Go. The documentation page also provides capability to execute the API directly from the API reference documentation, as explained in the following paragraph. 

![](/img/api-documentation-try-it-now.png "Figure 4 Documentation for Data Services REST API.")

*The above figure shows the three-panel interactive API reference guide for HPE GreenLake APIs for data services.*

## An example of executing an API Call from the API reference documentation

>﻿**Note:** All of the below examples assume that you have access to HPE GreenLake workspace. For more information on acquiring an HPE GreenLake workspace, please follow this [guide](https://support.hpe.com/hpesc/public/docDisplay?docLocale=en_US&docId=a00120892en_us).

You can start by obtaining an access token for the workspace where you have the permission. For  information on getting the access token, please see the following [guide](https://developer.greenlake.hpe.com/docs/greenlake/services), or  follow my other blog posts in this [link](https://developer.hpe.com/blog/api-console-for-data-services-cloud-console/). Once the access token is obtained, please copy it (Ctrl-c short cut in Microsoft Window) so that you can enter that token into the **Security>Bearer Token:** field of the API reference documentation page displaying the list of `async-operations` (as an example). 

To start with this example, go to the documentation page for the `async-operations` on this [link](https://developer.greenlake.hpe.com/docs/greenlake/services/data-services/public/openapi/data-services-public-v1beta1/operation/ListAsyncOperations/). Please click on the **Try It** button located at the top right side of the page, as shown below. 

![](/img/tryit-process.png)

Once you are at the next page, select the end-point of the region under **Target Server** menu where your workspace based on your access token is obtained. For my example, it would be: `<https://us1.data.cloud.hpe.com>` because my workspace was created at the US region. Afterward, please expand the **Security> Bearer Token:** field to enter the access token (Bearer Token). 

![](/img/enter-bearer-token-and-target-end-point.png)

Paste the valid access token into the **Bearer Token** using Ctrl-v (short cut in Microsoft Windows). Keep in mind that the access token will expire after 2 hours past from the time of creation. If the access token has expired, please obtain a new access token using your existing client-credentials.

![](/img/send-the-api-after-token-entered.png)

Click the **Send** button to execute that API and you will see the response page indicating a good status (**Status: 0x200**). Finish up by clicking on the **Body: Expand All** button to display the completed response body in JSON.

![](/img/response-from-the-tryit-test.png)

Congratulations! You have executed your first HPE GreenLake API for data services using the interactive API reference documentation page in the HPE GreenLake Developer website.

## Some tips and examples

Even though there is documentation available in the HPE GreenLake Developer website, here are some of the recommendations and best practices on how to use the API.

### async-operations

The responses from this resource are critical for debugging and monitoring the activities that happen from any API executions. Those APIs can be from Virtualization, Backup and Recovery, Block services, or Private Cloud Business Edition. Here is a tip on how to filter out those tasks (`async-operations`) that belong to a particular service. Use the parameter: `filter: <service> in services` like below.

> **Note**:  To simplify the response returned by this API, use the parameter: `select: associatedResources,displayName,services,createdAt` as shown below. 

![](/img/async-operations-invocation-parameters.png "Execution of async-services using filter, sort, and select parameters")

T﻿he response from the execution of `GET /data-services/v1beta1/async-operations` is provided below. From this response page, the property `associatedResources` pointed to the particular asset that encountered the execution. Additionally, the property `services` indicated which set of service that this `associatedResources` API execution applicable to. 

![](/img/api-response-from-filtered-and-selected-async-response.png)

The corresponding task message from the HPE GreenLake task’s UI is shown below.

![](/img/corresponding-task-for-the-async-operations.png)

### active-issues

This API provides the list of the issues that require attention by your HPE GreenLake users. The HPE GreenLake UI provides a bell icon on the top right of every HPE GreenLake's window (please see the previous UI image under *What are these data services resources?* paragraph in this blog post) to access issues from every available services under the HPE GreenLake.

To limit the display of properties from responses returned by this API, user can use parameter `select` as part of the parameter of the API execution. However, there are minimal set of properties required by `active-issues` API to be entered into the `select` parameter as shown in the below response from the `active-issues` API.

```json
https://<region-baseUrl>/data-services/v1beta1/issues?select=body
{
    "error": "Missing required field(s) - \"lastOccurredAt,customerId,createdAt,id,resourceUri,generation,type\"",
    "errorCode": "422",
    "traceId": "18e7b6adf90315de57f2b177652e3649"
}
```

To alleviate this condition, the user can add the required properties to the `select` parameter in addition to any other property that is desired, such as shown below.

```json
https://<region-baseUrl>/data-services/v1beta1/issues?select=body,lastOccuredAt,customerId,createdAt,id,resourceUri,generation,type
```

Following the above recommendation, the following request body shows where I entered the select parameters as required above.

![](/img/api-request-issue-required-select-parameters.png)

The completed execution of this API is shown below.

![Response from issues with the correct select](/img/execution-result-from-active-issues.png)

*The above figure shows the output from GET issues given the parameter: `select=body,createdAt,customerId,generation,id,lastOccuredAt,resourceURI,type,updatedAt`.*

### Completing POST method for REST API using `async-operations` API with `task id`

Almost any HPE GreenLake REST API for data services with `POST, DELETE or PATCH` methods (e.g. `POST /virtualization/v1beta1/virtual-machines`) will be executed asynchronously. The asynchronous execution means that execution of the API will complete and return with `response status= 0x202`. The POST REST API process will run in the background; nonetheless, this operation must be monitored until it comes to completion.

To accomplish that monitoring, the user will receive a `task id` value as part of `location` response property as shown in the figure below. The user ould then poll that task id using the `GET /data-services/v1beta1/async-operations/{Task Id}` to retrieve the progress and status of the completion. Below is an example of this use case, where I executed the creation of virtual machines in the on-premises hypervisor (VMware vCenter)

I executed the REST API `POST https://{baseURL}/virtualization/v1beta1/virtual-machines` and the response was completed with response status code of `0x202 (Accepted)`. Moreover, you can discover the task Id value: `0xcad794d1-27ec-4050-bed4-45d13a8de9d0` from the location property. 

![The task Id from response location field](/img/location-output-contains-the-task-id.png)

*T﻿he above figure displays the response header from `POST https://{baseUrl}/virtualization/v1beta1/virtual-machines`.*

From the task Id that was obtained from the response header, I used `GET async-operations` with the `specific task ID` (e.g. `https://{baseUrl}/data-services/v1beta1/async-operations/cad794d1-27ec-4050-bed4-45d13a8de9d0`) to obtain the status and progress of the previously executed REST API. 

![Request async-response for a particular id](/img/api-request-async-operations-request-of-particular-id.png)

The following response snippets depict two different responses from the polling using the `async-operations` API. The first response indicated the progress of the associated API execution at `40% (RUNNING)`, and the second response indicated the progress at `100%(SUCCEEDED)`. The progress between the two point of executions was about less than 3 minutes as shown by the difference from the following properties: `startedAt` and `endedAt`. 

Below is the f﻿irst poll of the VM provisioning REST API task id:

```json
{
    “displayName”: “Provisioning virtual machine 0-RRD-API-Deploy-4”,
    “endedAt”: “2024-03-24T00:13:53.558031307Z”,
    “healthStatus”: “OK”,
    “id”: “cad794d1-27ec-4050-bed4-45d13a8de9d0”,
    “logMessages”: [
        {
            “message”: “Task created”,
            “timestampAt”: “2024-03-24T00:13:52.002673131Z”
        },
        {
            “message”: “Task is running”,
            “timestampAt”: “2024-03-24T00:13:52.002675372Z”
        },
        {
            “message”: “Preparing parameters”,
            “timestampAt”: “2024-03-24T00:13:53.368619324Z”
        },
        {
            “message”: “Starting virtual machine deployment”,
            “timestampAt”: “2024-03-24T00:13:53.558043002Z”
        }
    ],
    “name”: “Provisioning virtual machine 0-RRD-API-Deploy-4”,
    “progressPercent”: 40,
    “services”: [
        “private-cloud-business-edition”
    ],
    “startedAt”: “2024-03-24T00:13:52.002663421Z”,
    “state”: “RUNNING”,
    “suggestedPollingIntervalSeconds”: 30,
    “type”: “task”,
    “updatedAt”: “2024-03-24T00:13:55.846052959Z”
} 
```

*The above response displays the result from the first poll of the VM provisioning REST API task Id with `progressPercent:40` and `state: RUNNING`*.

B﻿elow is the last poll of the VM provisioning REST API task id:

```json
{
    "displayName": "Provisioning virtual machine 0-RRD-API-Deploy-4",
    "endedAt": "2024-03-24T00:15:49.906710665Z",
    "error": null,
    "healthStatus": "OK",
    "id": "cad794d1-27ec-4050-bed4-45d13a8de9d0",
    "logMessages": [
        {
            "message": "Task created",
            "timestampAt": "2024-03-24T00:13:52.002673131Z"
        },
        {
            "message": "Task is running",
            "timestampAt": "2024-03-24T00:13:52.002675372Z"
        },
        {
            "message": "Preparing parameters",
            "timestampAt": "2024-03-24T00:13:53.368619324Z"
        },
        {
            "message": "Starting virtual machine deployment",
            "timestampAt": "2024-03-24T00:13:53.558043002Z"
        },
        {
            "message": "Applying protection policy",
            "timestampAt": "2024-03-24T00:15:49.598976645Z"
        },
        {
            "message": "Virtual machine provisioning completed and initiated a task for applying backup policy.",
            "timestampAt": "2024-03-24T00:15:49.906721852Z"
        },
        {
            "message": "Task succeeded",
            "timestampAt": "2024-03-24T00:15:49.906727488Z"
        }
    ],
    "name": "Provisioning virtual machine 0-RRD-API-Deploy-4",
    "progressPercent": 100,
    "services": [
        "private-cloud-business-edition"
    ],
    "startedAt": "2024-03-24T00:13:52.002663421Z",
    "state": "SUCCEEDED",
    "suggestedPollingIntervalSeconds": 30,
    "type": "task",
    "updatedAt": "2024-03-24T00:15:49.955699371Z"
}
```

*The above response displays that at the moment of the second poll of the VM provisioning REST API `task Id`, the creation of the virtual machines on-premises had completed successfully (`progressPercent: 100, state: SUCCEEDED`).* 

At that moment, I also discovered a virtual machine with the name `0-RRD-API-Deploy-4` available at the VMware cluster where this provisioning was executed. 

# Summary

This blog post introduces you to the new set of HPE Greenlake APIs for data services, to support resources such as: *async-operations, dual-auth-operations, issues, secrets, software-releases, storage locations, and tags.* This set of APIs will evolve throughout the future toward the long term supported version and the number of APIs will expand to support more resources in the future.

This March 2024 announcement introduces revision v1beta1 of the API, which is documented at HPE GreenLake Developer [website](https://developer.greenlake.hpe.com/docs/greenlake/services/data-services/public/) using the interactive reference documentation based on OpenAPI 3.1 standard. In this post, I also introduced methods to exercise the API directly from the API reference documentation page using the access token obtained from HPE GreenLake API gateway. Lastly, I provided a list of tips on using this HPE GreenLake API for the specific use cases.

Please don’t hesitate to explore this new set of HPE GreenLake APIs for data services and see how you can improve your agility in managing your data. If you have any questions on any of these APIs, or if you are interested sharing your feedback and use cases on this set of APIs, please join the HPE Developer Slack [Workspace](https://developer.hpe.com/slack-signup) and start a discussion in our *[\#hpe-greenlake-data-services](https://hpedev.slack.com/archives/C02D6H623JP)* Slack channel.