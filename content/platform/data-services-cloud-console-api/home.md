---
title: Data Services Cloud Console
version: 0.1.1
description: Easy to read guides, tips and documentation to rapidly help any
  developer working with Data Services Cloud Console APIs.
image: /img/platforms/image-1-dscc.svg
width: large
priority: 1
tags:
  - data-services-cloud-console
  - greenlake-common-cloud
---
Today, every organization are required to unleash the power of data to drive digital transformation. But fragmented data management tools, manual processes, and infrastructure silos spanning edge to cloud are getting in the way. Customers across industries are struggling with the complexity of managing data and infrastructure, because it  creates a roadblock to innovation and agility, but also drives business risk. And it’s only getting harder as data continues to grow, apps continue to evolve, and infrastructure continues to spread edge-to-cloud.

![Intelligent Data Platform](/img/dscc-high-level-diagram.jpg "DSCC Diagram")

This API provides resources for any customers that are looking to enhance their infrastructure management and data-ops using the programmatical extensions from Data Services Cloud Console. Data Services Cloud Console brings the cloud experience wherever data lives and streamlines data management across your hybrid cloud. It provides a suite of cloud services across your edge, core, and cloud to accelerate data, agility, and innovation for everyone, from data managers to data innovators.

![DSCC Automation](/img/dscc-api-value.png "API for Automation at Scale")

## REST API

The REST API is designed for customers, partners or any other external clients to consume these interface to achieve the objectives mentioned above. The Data Services Cloud console public API is specified based on the OpenAPI format version 3 ([OpenAPI 3.0 information](https://swagger.io/blog/news/whats-new-in-openapi-3-0/)).  The specification defines standard, language agnostic interface to RESTful API allowing the clients (both human and computer) to consume capabilities of DSCC services efficiently. The API definition is available for download in OpenAPI 3 yaml format at this link. 

Some of the advantages to distribution in OpenAPI 3.0 format:

1. Updates to the API can be generated in more agile manner where documentation are embedded as description to any endpoints, parameters, and many more such as contact information, license, terms of use.
2. Consumer of this API can also consume this API in an agile manner using the converter from this openAPI format to any language that were used as part of the their automation or CI/CD workflow. (Please check <https://openapi.tools> for more information for the API tools to generate client code)

## REST API Details

Any customer can download this OpenAPI Specification (OAS) v3 definition of the DSCC from the following link:

[Link to the API repository](https://docs.ccs.arubathena.com/)

### Documentation and Tutorials

The overview of the Data Services Cloud Console is available at [this link](https://www.hpe.com/us/en/storage/data-services-cloud-console.html#overview). There will be more blogs that will provide more information to help customer adopting this API with examples, code snippets and many other helpful information.

### Documented Attributes

* **API Name & Description** - Provides short description of the objective for this API with the supported HTTP request method (POST, GET, DELETE, PATCH, PUT etc).
* **API Path** - Provides detail URL path as the end-point to issue the API call.
* **API Parameter** - Provides the client to input information such as the object for the manipulation, select a filter to limit the returned objects, and other purposes.
* **API Data/Body/Payload** - This the data passed along in different part of the REST API usually associated with operation such as POST/PATCH/PUT
* **API Response** - Provides detail response information on the result of the particular API and may include more data in JSON format. 
* **API Error Codes** - Provide result of the execution of the API, will return either good or error along with the error message due to incorrect, or unauthorized API call.

### Supported API Categories (Services)

The API categories for DSCC grows in accordance to the expansion of the DSCC services that are going to released in future. Current services that are available as recorded today is:

1. DataOps Manager
2. Event Audit
3. Task tracking
4. Search
5. Helps, Issues and announcement

### Versioning

The major version number will be provided in the resource path as v1 in this example:

```md
/api/v1/<resource group>/...
```

Some examples of these resource paths:

```markdown
/api/v1/storage-systems/...

/api/v1/controllers/...

/api/v1/volumes/...
```

Some examples of the resource groups under the same root:

Clients will be able to adopt the backward compatibility from the higher major version incremental.  However, both the new and old version of API will be supported until the announcement of the deprecation. Nonetheless, the older major version will always be frozen with exception of bug fixes. There will also be announcement of deprecation in the header and sunset header. 

```md
/api/v1/<resource group>/...

/api/v2/<resource group>/...
```

### HTTP Request Methods

| HTTP Verbs | Description                                                         |
| ---------- | ------------------------------------------------------------------- |
| GET        | Retrieves target resource                                           |
| POST       | Creates an entity or changes state                                  |
| PUT        | Replaces target resource with data part of the HTTP Request payload |
| DELETE     | Remove the target source                                            |

### Authentication

Client can only access this API after the client successfully authenticate through the customer's credential 

### Relationship Authorization

The client will receive only the properties that are authorized based on the Role Base Access Control for the user who created the access token. The authorization for the client will inherit the user's permission who created the Client Application registration under the API Gateway. Note that subsequent change to the user's permission after the Client Application registered will impact the response returned based on current authority.

### Asynchronous Response

All of the REST API operations are stateless in nature, such as POST, in that scenario the task resource will return a response with HTTP code 202 "Accepted" and the reference to the task as follows:

```md
Response: 202 Accepted
```

```md
{
   "taskURi": "/api/v1/tasks/{task id}"
}
```

In order to ensure the completion of this remote procedural call through POST, user will use the task resource to query the status of this asynchronous task.

```md
/api/v1/tasks/{task id}

GET responses
{
  state: {state ENUM}
}

state ENUM:
- UNSPECIFIED
- INITIALIZED
- RUNNING
- FAILED
- SUCCEEDED
- TIMEDOUT
- PAUSED
```

### Any Questions on Data Services Cloud Console API?

Please join [HPEDEV Slack Workspace](https://slack.hpedev.io/) and start a discussion in our #DSCC channel