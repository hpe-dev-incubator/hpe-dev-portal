---
title: Getting Started with Data Services Cloud Console Public REST API
date: 2021-12-15T16:01:03.611Z
priority: 2
author: Ron Dharma
authorimage: https://gravatar.com/avatar/8102f2adeef249065ccb9c43b8866d17?s=192
thumbnailimage: /img/dscc-icon.png
tags:
  - data-services-cloud-console
  - developer
  - hpe-greenlake-cloud-platform
  - hpe-greenlake
---
<center><img src="/img/dscc-idp-core-architect.png" width="500" height="501" alt="Unified DataOps"></center>

Customers across industries are struggling with the complexity of managing data and infrastructure, because it creates a roadblock to innovation and agility. Today, every organization is required to unleash the power of data to drive digital transformation, but fragmented data management tools, manual processes, and infrastructure silos - spanning edge to cloud - are getting in the way. This complexity also amplifies business risk, and it's only getting harder as data continues to grow, apps evolve, and infrastructure continues its spread from edge to cloud. 

Data Services Cloud Console public REST API provides a resource for customers who are looking to enhance their infrastructure management and data-ops using the programmatic extensions from Data Services Cloud Console.

### A Public REST API which is based on the OpenAPI 3.X Specification

![API diagram](/img/universal-public-api.png "API ")

Hewlett Packard Enterprise (HPE) offers the Data Services Cloud Console unified REST API to provide the agility previously mentioned. It is specified based on the OpenAPI format version 3 (OpenAPI 3.0 information). The specification defines a standard, language-agnostic interface to the RESTful API allowing clients (both human and computer) to consume capabilities of the console's services efficiently. The API definition is available for download in either OpenAPI 3 YAML or JSON format at the link mentioned in the next chapter.

Some of the advantages of distributing the API in OpenAPI 3.0 format:

1. Updates to the API can be generated in a more agile manner where documentation is embedded, describing any endpoints, parameters, and more; such as contact information, license, terms of use.
2. Consumers of this API also gain the benefits of agility by using the converter from openAPI yaml, or json to any programming language that is used as part of their automation or CI/CD workflow. (Please check https://openapi.tools for more information for the API tools to generate client code)

### Data Services Cloud Console REST API Details

Anyone can download this OpenAPI Specification (OAS) v3 definition of the Data Services Cloud Console from the following: [Link to the API repository](https://console-us1.data.cloud.hpe.com/doc/api/v1/)

![HPE GreenLake API documentation](/img/api-documentation-display.png "API Doc")

The website also provides additional information:

1. The list of the REST API resources that are supported as of the release.
2. The information about the HTTP method, parameters and the responses that are expected from each resource.
3. The syntax for the HTTP method and path to this resource. Note that this path is a relative path. For the complete path, please add the base-URL documented below.
4. The body of response is returned in JSON format according to the response status of the REST API.


   The website also provides the links to download the cloud console OpenAPI definitions in either json or yaml format. Below is an example of the downloaded yaml definition file from the Data Services Cloud Console REST API documentation website.

![API definition yaml](/img/open-api-yaml.png "yaml")

Users can download the API definition from the API documentation website, and the API definition is available in both YAML and JSON version. It can be downloaded by clicking on the download button on the top left of the documentation website.

### Documented Attributes

* API Name & Description

  * Provides a short description of the objective for this API with the supported HTTP request method (POST, GET, DELETE, PATCH, PUT etc).
* API Path

  * Provides the detailed URL path as the end-point to issue the API call. Note that the user must add the base path URL to extend this path to the correct resource.
* API Parameter

  * Allows the client to input information, such as the object for manipulation, select a filter to limit the returned objects, and other purposes.
* API Data/Body/Payload

  * This is the data passed along in a different part of the REST API request, usually associated with HTTP method such as POST/PATCH/PUT.
* API Response

  * Provides detailed response information on the result of the particular API and may include more data in JSON format.
* API Error Codes

  * Provides the result of the execution of the API, returning either good or error, along with the error message due to an incorrect or unauthorized API call.

### Supported API Categories (Services)

The API categories for Data Services Cloud Console will grow in accordance to the expansion of future services. As recorded today, the current services that are available include:

#### **Common (Alletra-6K, Alletra-9K, Primera, Nimble)**

1. authentication
2. tasks
3. event Audit
4. authZ (User RBAC permissions)
5. issues
6. controllers
7. host-initiator-groups
8. host-initiators
9. ports
10. shelves
11. storage-pools
12. storage-systems
13. system-settings
14. volume-sets
15. volumes

#### **Alletra-6K or Nimble**

1. protection-templates
2. disks

### Versioning

The major version number will be provided in the resource path as "v1" in this example:

```jsoniq
/api/v1/<resource group>/...
```

Here are some examples of these resource paths that contain several resource groups under the same root:

```jsoniq
/api/v1/storage-systems/...

/api/v1/controllers/...

/api/v1/volumes/...
```

Existing clients will be able to maintain the backward compatibility from the higher major version incremental and adopt any newly introduced API. However, both the new and old version of the API will be supported until the announcement of the deprecation for the old version of the API. Nonetheless, the older major version will always be frozen, with the exception of bug fixes. There will also be an announcement of deprecation in the header and sunset header.

```jsoniq
/api/v1/<resource group>/...

/api/v2/<resource group>/...
```

### HTTP Request Methods

| HTTP Verbs | Description                                                         |
| ---------- | ------------------------------------------------------------------- |
| GET        | Retrieves target resource                                           |
| POST       | Creates an entity or changes state                                  |
| PUT        | Replaces target resource with data part of the HTTP request payload |
| DELETE     | Removes the resource                                                |

### Authorization through OAuth2 Client Credential Workflow

Glossary of the terms:

**[Resources](https://developer.hpe.com/blog/api-console-for-data-services-cloud-console/)**:  Components inside the cloud console, such as storage array, volumes, and many other objects that are consumable and related to each other, and provides methods to operate on it. Usually is represented by path that is appended to Endpoint e.g. /api/v1/storage-array.

**[Resource Owner](https://developer.hpe.com/blog/api-console-for-data-services-cloud-console/):**  The user that is registered inside the HPE GreenLake console that has the capability to authorize the client application access to the cloud console resources.

**[Client Application](https://developer.hpe.com/blog/api-console-for-data-services-cloud-console/):**  The stand-alone application that runs on the client machine, and usually represent the customer's business application for automation, ticketing, monitoring and many other business processes.

**[Access Token:](https://developer.hpe.com/blog/api-console-for-data-services-cloud-console/)** This is the object that describes the permission and the security context of which the client application was delegated. This token contains the identity and privileges of the cloud console user which create this token.

**[API Gateway](https://developer.hpe.com/blog/api-console-for-data-services-cloud-console/)**: The API Gateway is the menu in the HPE GreenLake console that is used to register a client application and obtain the API client credentials (client-id and client-secret) for that client application. These credentials are required to generate a short-lived access token that is used to make secure REST API calls to the Data Services Cloud Console application instance.

**[Endpoint](https://developer.hpe.com/blog/oauth2-for-hpe-greenlake-data-services-cloud-console/)**: Location where service can be accessed, usually is represented by URL (Uniform Resource Locator) e.g. https://eu1.data.cloud.hpe.com

![OAuth 2.0 flow](/img/dscc-public-api-introduction-updated_111122.jpg "authentication and authorization flow")

The client's application can issue a REST API request using the access token as the bearer of the token. The client can obtain this access token from the authorization API end point, after the client successfully authenticates through an associated customer's application credential (client-id and client-secret). This application credential is created by the console's user who has the permission to access resources (such as controllers, volumes etc.) under the console instances. This access token expiration time, by default, is set for 7200 seconds (2 hours). When the resource server sees this expired access token, it returns a 0x401 response (not authorized). The client must then authenticate using the associated client-id and client-secret to obtain the next access-token to use for the next REST API request.

### Authorization Policies

The client can only receive properties from the authorized API resources based on the Role Base Access Control for the user who created the client-credential pair (client-id and client-secret). This authorization derives from the organization, capability, and scope (roles) that the associated user is assigned. As a result, the authorization for the client application will inherit the user's permission who created the client-application registration under the API Gateway. Note that subsequent changes to the user's permission after the client application registered will impact the response returned based on current authority.

### The API Endpoints (base-URL) for each Data Services Cloud Console's Region

The REST API for Data Services Cloud Console requires the client application to issue the REST API request to the URL that is associated with the console's instance deployed at the associated region of the storage array. As of November 2021, here are the Domain URLs which the client application must use as the base-URL to the resource path of REST API.

| Data Services Cloud Console Region | Base-URL                       |
| ---------------------------------- | ------------------------------ |
| EU Central (Europe)                | https://eu1.data.cloud.hpe.com |
| AP Northeast (Asia Pacific)        | https://jp1.data.cloud.hpe.com |
| US West (United States)            | https://us1.data.cloud.hpe.com |

### Asynchronous Response

All of the REST API operations are stateless in nature. One example of such is POST. In that scenario, the task resource will return a response with HTTP code 0x202 "Accepted" and the reference to the task as follows:

```jsoniq
Response: 202 (Accepted)

{
  "taskURI":"/api/v1/tasks/{task id}
}
```

In order to ensure the completion of this remote procedural call through POST, the user will use the task resource to query the status of this asynchronous task.

```jsoniq
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

For more in depth discussion on the topics about API Gateway and OAuth 2.0 (Open Authorization), please take a look at these blogs in HPE DEV, tektalk on point at On24 website, and also the demo in Youtube.

<iframe title="Introduction to HPE Data Services Cloud Console public API" width="560" height="315" src="https://www.youtube.com/embed/g3UO0S-4r6I" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

* Blog: [Using HPE GreenLake's API Gateway for Data Services Cloud Console](https://developer.hpe.com/blog/api-console-for-data-services-cloud-console/)
* Blog: [Implementing OAuth 2 Flow for Data Services Cloud Console's Client Application](https://developer.hpe.com/blog/oauth2-for-hpe-greenlake-data-services-cloud-console/)
* TEKTALK ON POINT: [Introduction to Data Services Cloud Console public API](https://vshow.on24.com/vshow/HPETekTalks/content/3571890/)

More blog posts will be coming to help you take further advantage of its capabilities. Stay tuned to the [HPE DEV blog](https://developer.hpe.com/blog) for more blog posts about HPE Data Services Cloud Console REST API.

