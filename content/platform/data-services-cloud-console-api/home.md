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
Customers across industries are struggling with the complexity of managing data and infrastructure, because it creates a roadblock to innovation and agility. Today, every organization is required to unleash the power of data to drive digital transformation, but fragmented data management tools, manual processes, and infrastructure silos - spanning edge to cloud - are getting in the way. This complexity also amplifies business risk, and it's only getting harder as data continues to grow, apps evolve, and infrastructure continues its spread from edge to cloud.

![Intelligent Data Platform](/img/dscc-idp-core-architect.png "DSCC Diagram")

Data Services Cloud Console public REST API provides a resource for customers who are looking to enhance their infrastructure management and data-ops using the programmatical extensions from Data Services Cloud Console. Data Services Cloud Console (DSCC) brings the cloud experience to wherever data lives and streamlines data management across your hybrid cloud. It provides a suite of cloud services across your edge, core, and cloud to accelerate data, agility, and innovation for everyone, from data managers to data innovators.

![DSCC Automation](/img/dscc-api-value.png "API for Automation at Scale")

## A Public REST API which is based on OpenAPI

This REST API is designed to provide the agility as previously mentioned . The DSCC public API is specified based on the OpenAPI format version 3 ([OpenAPI 3.0 information](https://swagger.io/blog/news/whats-new-in-openapi-3-0/)).  The specification defines a standard, language-agnostic interface to the RESTful API allowing the clients (both human and computer) to consume capabilities of DSCC services efficiently. The API definition is available for download in OpenAPI 3 YAML or JSON format at the link mentioned in the next paragraph.

Some of the advantages of distributing in OpenAPI 3.0 format:

1. Updates to the API can be generated in a more agile manner where documentation is embedded, describing any endpoints, parameters, and more; such as contact information, license, terms of use. 
2. Consumers of this API also gain the benefits the agility, using the converter from openAPI yaml, or json to any programming language that were used as part of the their automation or CI/CD workflow. (Please check <https://openapi.tools> for more information for the API tools to generate client code)

## REST API Details

Any one can download this OpenAPI Specification (OAS) v3 definition of the DSCC from the following: [Link to the API repository](https://console-us1.data.cloud.hpe.com/doc/api/v1/)

![DSCC_API_Doc](/img/api-documentation-display.png "DSCC API Documentation")

The website also provides several other information:

1. The list of the REST API resources that are supported as of the release. 
2. The information about the HTTP method, parameters and the responses that are expected out for this resource
3. The syntax for the HTTP method and path to this resource. Note that this path is relative path, for the complete path, please add the base-URL documented below to provide the full path.
4. The body of response is returned in JSON format according to the response status of the REST API.

The website also provides the links to download the DSCC open-API definitions in either json or yaml format. Below is an example of the downloaded json file from the DSCC REST API documentation website.

![](/img/open-api-yaml.png)

### Documentation and Tutorials

The overview of the Data Services Cloud Console is available at [this link](https://www.hpe.com/us/en/storage/data-services-cloud-console.html#overview). There will be more blogs that will provide more information to help customers adopting this API with examples, code snippets and many other helpful information.

### Documented Attributes

* **API Name & Description** - Provides short description of the objective for this API with the supported HTTP request method (POST, GET, DELETE, PATCH, PUT etc).
* **API Path** - Provides detail URL path as the end-point to issue the API call. Note that user must add the base path URL to extend this path to the correct resource end-point.
* **API Parameter** - Provides the client to input information such as the object for the manipulation, select a filter to limit the returned objects, and other purposes.
* **API Data/Body/Payload** - This the data passed along in different part of the REST API usually associated with operation such as POST/PATCH/PUT
* **API Response** - Provides detail response information on the result of the particular API and may include more data in JSON format. 
* **API Error Codes** - Provide result of the execution of the API, will return either good or error along with the error message due to incorrect, or unauthorized API call.

### Supported API Categories (Services)

The API categories for DSCC will grow in accordance to the expansion of the DSCC services that are going to released in future. Current services that are available, as recorded today:

#### Common (Alletra-6K, Alletra-9K, Primera, Nimble)

1. Authentication
2. Tasks
3. Event Audit
4. AuthZ (User RBAC permissions)
5. Issues
6. controllers
7. host-initiator-groups
8. Host-initiators
9. ports
10. shelves
11. storage-pools
12. storage-systems
13. system-settings
14. volume-sets
15. volumes

#### Alletra-6K or Nimble

1. protection-templates
2. disks

### Versioning

The major version number will be provided in the resource path as "v1" in this example:

```md
/api/v1/<resource group>/...
```

Some examples of these resource paths that contain several resource groups under the same root:

```markdown
/api/v1/storage-systems/...

/api/v1/controllers/...

/api/v1/volumes/...
```

Existing clients will be able to maintain the backward compatibility from the higher major version incremental, and adopt newly introduced API.  However, both the new and old version of API will be supported until the announcement of the deprecation for the old version of API. Nonetheless, the older major version will always be frozen with exception of bug fixes. There will also be an announcement of deprecation in the header and sunset header. 

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

### Authorization through OAuth2 Client-Credential work-flow

The client's application can issue REST API request using the access-token as the bearer of the token.  The client obtains this access-token from the after the client successfully authenticate through an associated customer's application credential (client-id and client-secret). This application credential is created by the DSCC user who has the permission to access resources (such as controllers, volumes etc.) under the DSCC instances. This access-token expiration time, by default, is set for 7200 seconds (2 hours). When the the resource server see this expired access token, and return 0x401 response (not authorized).  The client must then reauthenticate using the associated client-id and client-secret to obtain the next access-token to use for the next REST API request.

### Authorization Policies

The client can only receive properties from the authorized API resources based on the Role Base Access Control for the user who created the client-credential pair (client-id and client-secret). This authorization derives from the organization, capability and scope (roles) that the associated user is assigned. As the result, the authorization for the client application will inherit the user's permission who created the client-application registration under the API Gateway. Note that subsequent change to the user's permission after the Client Application registered will impact the response returned based on current authority.

### The API End-Points (baseURL) for Each DSCC Region

The REST API for DSCC requires client application to issue the REST API request to the URL that is associated with the DSCC instance deployed at the associated region of the storage array. As of November 2021, here are the list of the Domain URLs where client application must use as the base-URL to the resource path of REST API.

| DSCC Region  | base-URL                       |
| ------------ | ------------------------------ |
| EU Central   | https://eu1.data.cloud.hpe.com |
| AP Northeast | https://jp1.data.cloud.hpe.com |
| US West      | https://us1.data.cloud.hpe.com |

### Asynchronous Response

All of the REST API operations are stateless in nature. One example is such as POST, in that scenario the task resource will return a response with HTTP code 202 "Accepted" and the reference to the task as follows:

```md
Response: 202 Accepted
```

```md
{
   "taskURi": "/api/v1/tasks/{task id}"
}
```

In order to ensure the completion of this remote procedural call through POST, the users will use the task resource to query the status of this asynchronous task.

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