---
title: "HPE Container Platform REST API – Part 1: Authenticating  "
date: 2020-05-26T03:08:40.367Z
featuredBlog: false
priority: null
author: Denis Choukroun
authorimage: https://gravatar.com/avatar/f66dd9562c53567466149af06ae9d4f1?s=96
thumbnailimage: null
tags:
  - hpe-ezmeral
---
![image001](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/image001-1590504102737.png)


**Editor’s Note – HPE Ezmeral Container Platform is now HPE Ezmeral Runtime Enterprise**. For more information on why the name was changed, please [click here](https://community.hpe.com/t5/HPE-Ezmeral-Uncut/HPE-Ezmeral-Container-Platform-is-now-HPE-Ezmeral-Runtime/ba-p/7151720#.YW7nOxrMKM8).
 
- - -

Businesses are challenged today with being able to run their existing monolithic applications alongside their cloud-native apps in hybrid cloud environments. The [HPE Container Platform](https://developer.hpe.com/platform/hpe-container-platform/home) (HPE CP) uses container technology to make it simpler and more cost-effective to deploy, run and manage both cloud native microservices enterprise workloads and non-cloud native monolithic applications with containers. Businesses can take advantage of the HPE Container Platform for a variety of use cases, including machine learning (ML), data analytics, and DevOps workloads. Its abilities make the HPE Container Platform ideal for helping IT accelerate their application development and deployment on containers on-demand through a self-service portal. 

In this two-part blog series, I am going to discuss how the HPE Container Platform exposes a RESTful API that provides programmable access to capabilities via a self-service portal. I will then share some recent learnings and experience doing this.

>Note: This series does not cover how to perform IT administrative tasks through the HPE CP REST API.

These blog posts are targeted at developers who want to get started with the REST API so they can interact with the HPE Container Platform programmatically. This series is also designed for solution architects who simply want to understand the product from a developer and data scientist’s perspective so they can discuss its capabilities with their customers’ developers and data analysts.

In the first part of the series, you will interact with the HPE CP REST API using a handy graphical tool called [Postman.](https://www.postman.com/) You will also have the opportunity to use cURL [(Command-line URL),](https://curl.haxx.se/) the universal and well-appreciated command-line utility from the Linux community. In the second part, I will go a step further to explain how you can use this REST API to deploy containerized applications using a programmatic approach.  

If you are not already familiar with REST API calls and Postman, I encourage you to check out the [Understanding API basics and the value they provide](/blog/understanding-api-basics-and-the-value-they-provide) article. It explains REST API concepts such as HTTP verbs you call against a REST API service, the headers and payloads, and how to use Postman to make REST API calls.  

## The HPE Container Platform High-Level Architecture

The diagram below depicts a simplified view of the physical architecture within the HPE Container Platform being deployed for this tutorial. It illustrates how you can interact programmatically with the HPE Container Platform. 


![picture2](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/picture2-1590462775163.png)

The HPE Controller Platform deployment includes the following key components:

* The **Controller host** manages all the hosts that comprise the HPE Container Platform deployment. 
* The **Kubernetes (K8s) hosts** are under the direct control of the Controller host. These hosts can be grouped into one or more distinct Kubernetes clusters that run containerized applications.
* The **Gateway host** acts as a proxy server that carries client requests, i.e. HPE CP UI, REST API, K8s API (kubectl commands) to the HPE Container Platform controller, to one of the Kubernetes clusters, or to one of the containerized application services running in one of the Kubernetes clusters. Containerized application service endpoints are exposed outside the Kubernetes cluster to users via the gateway re-mapped ports. 
* The **Authentication Proxy** handles user authentication and forwards authenticated K8s API traffic (kubectl commands) to the Kubernetes cluster master and returns any responses to the request back to the user.
* The **HPE Data Fabric** (a MapR File System) is a storage provider for persistent volumes for the containerized applications that require persistence of data. The default StorageClass is available out of the box from the HPE Data Fabric (MapR) using the HPE Container Storage Interface (CSI) driver for MapR.

## The HPE Container Platform REST API Reference

The HPE CP REST API allows you to execute multiple actions programmatically, from performing administrative tasks like creating Kubernetes clusters to deploying applications for various use cases in a shared multi-tenant environment.

Before you can call the HPE CP REST API, you need to know what calls can be placed. The REST API reference documentation describes each object type, along with the supported operations, request input parameters, response model, and response codes. 

To access the HPE CP REST API reference documentation, obtain the IP address or hostname of the HPE Container Platform **Gateway** host or **Controller** host from the platform administrator. Then, in a web browser, navigate to the following URL: **http(s)://Gateway-or-Controller-IP-address-or-fqdn/apidocs**.  Access protocols for the HPE Container Platform REST API reference documentation varies depending on whether your platform has been configured to use HTTPS secure protocol (recommended) or non-secure HTTP protocol. 

## Session Authentication
With the exception of some REST API calls, most of the API calls you can do against the HPE CP REST API must be authenticated with a sort of token that is retrieved by sending a username, password, and tenant name to the HPE CP API server. The HPE Container Platform uses a *session location* to identify the **working tenant context** of a given REST API operation. The session location is then stored in the HTTP header of subsequent requests to perform Create, Read, Update, and Delete (CRUD) operations using HTTP verbs, such as POST, GET, PUT, PATCH, and DELETE.

A tenant is a group of users created by the platform administrator. A tenant is allocated a quota of resources such as CPU, GPU, memory, storage, and Kubernetes clusters resources. A tenant can represent, for example, an office location, a business unit, a department, or a project. Tenant users can then deploy applications within the context of their tenant. Once a resource is actively in use by one tenant, it will not be shared with other tenants. The platform administrator assigns users roles (tenant Member or Tenant Admin) and tenant membership through either LDAP/AD authentication groups or local directory user accounts. 

A working context establishes the user identity, its tenant name, and role (member or admin). Based on this context, tenant users are granted privileges and permissions to create and manage resources for their tenant on Kubernetes clusters managed by HPE CP.

You request an authentication *session location* by issuing an authentication request for a new login session, providing your username/password credentials and your tenant name in the JSON body. 

This is confirmed by looking at the HPE CP REST API reference documentation for session object: **POST /api/v2/session**.


![picture3](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/picture3-1590462845389.png)

You then get the session location (in the form */api/v2/session/sessionId*) from the JSON response header with a status *201 (created)*, which means that the session object has been created successfully as the result of the HTTP POST request. This is also confirmed by looking at the REST API reference guide, as you can see below:



![picture4](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/picture4-1590462859828.png)

You then extract and save the session location value from the JSON response header. For each subsequent call, you set a new HTTP header with its key set to **X-BDS-SESSION** and its value set to the session location value. This will set the **working tenant context** for your request.

**Now, let’s put it into action with Postman:**

The REST API calls shown below explicitly specify JSON as the exchange format between the API client (Postman) and the API server (HPE Container Platform).

The communication with REST API is HTTP or HTTP over HTTPS on port 8080. The communication protocol varies depending on whether your platform has been configured to use HTTPS secure protocol (recommended) or non-secure HTTP protocol.

All the API calls are in the form:
* An HTTP verb such as GET, POST, DELETE, PATCH, UPDATE, PUT
* The target REST API object URL:  **http(s)://Gateway-IP-or-fqdn:8080/api/v2/object**

![picture5](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/picture5-1590462875550.png)

In the example here, I am acting as a tenant user and I request an authentication session location through a **POST /api/v2/session** API call. The user credentials and tenant name are provided in the request body using Postman Environment variables:

![picture6](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/picture6-1590464352997.png)


When you click the **Send** button, you get the response, *201 created*, in the response body, which means the session resource was successfully created.


![picture7](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/picture7-1590464474273.png)

The response header provides the resource path for the created session object in the form `/api/v2/session/SessionId`. 

![picture8](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/picture8-1590464521826.png)


All subsequent REST API calls will need to specify the *session location* resource path in their headers to use as **working tenant context**. The REST API call must include an **X-BDS-SESSION** header with the value of the session object’s resource path `/api/v2/session/SessionId` previously created. In the example below, the GET REST API call request will fetch information about the session you have just established with the HPE Container Platform as a tenant user:


![picture9](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/picture9-1590464546066.png)

As tenant user, the response body lists information about your session, such as your username, tenant name, and expiration time. Notice that the session location token will remain valid for 1440 minutes (or 24 hours), after which time you will have to establish a new login session.

![picture10](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/picture10-1590464591318.png)

# From Postman to code
You may ask yourself, how do these calls translate into code you can use in your own application? Postman can help with that thanks to its embedded code-generators. Imagine you have been experimenting with a POST session request in Postman and you would like to run the same POST call from *cURL* in a script or from other code languages. As shown in the picture below, Postman lets you generate snippets of code in various languages and frameworks that will help you do this. You can use the **Code** link under the blue **Send** button to open the *GENERATE CODE SNIPPETS* and select your preferred language or framework. In the rest of this blog, cURL is used as the preferred script language.


![picture11](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/picture11-1590464615471.png)


```bash
curl –k –i –s --location --request POST 'http(s)://<Gateway-IP-Address-or-fqdn>:8080/api/v2/session' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--data-raw '{
	"name": "<YourUSername>",
	"password": "<YourPassword>",
	"tenant_name": "<YourTenantName>"
}'

```

An example of the response header received is shown below:


![picture12](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/picture12-1590464628659.png)

Extract the session location path value `/api/v2/session/<sessionId>` from the header response and use it in any subsequent REST API calls. As shown by the example below, you can use a *GET* REST API call for object **/api/v2/session** to fetch information about the session you have just established with the HPE Container Platform as a tenant user. You can combine *cURL* command with **jq** as the command line JSON processor to parse the JSON body responses and obtain a structured print of the output as shown here:

 
``` bash
curl -k -s --location --request GET 'http(s)://<Gateway-IP-Address-or-fqdn>:8080/api/v2/session' \
--header 'X-BDS-SESSION: /api/v2/session/<SessionId>' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' | jq 
```


![picture13](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/picture13-1590464642369.png)

Although sessions have a time to live (TTL) of 24 hours, it is a best practice in REST API programming to cleanup and delete those sessions when done with your REST API calls. You can use a *DELETE* call to the target object **/api/v2/session/SessionId** to achieve this:


```bash
curl -k -i -s --request DELETE 'http(s)://<Gateway-IP-Address-or-fqdn>:8080/api/v2/<SessionId>' \
--header 'X-BDS-SESSION: /api/v2/session/<SessionId>' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json'
```

You have now learned the basics of programmatic access to the HPE Container Platform through its REST API. In [the next article](/blog/hpe-container-platform-rest-api-part-2-deploying-containerized-applicati) in this series, I will discuss how you can deploy programmatically cloud native stateless, microservices-based applications and non-cloud native distributed, stateful applications within the context of Kubernetes clusters managed by the HPE Container Platform. 	
You can stay up to date with the latest news from HPE DEV by [signing up for our monthly newsletter.](https://developer.hpe.com/newsletter-signup) In it, you will receive more awesome developer and data scientist focused posts about the HPE Container Platform. You can also follow our community on [Twitter](https://twitter.com/HPE_Developer) and join the conversation on our [HPE DEV Slack Channel.](https://slack.hpedev.io/)
