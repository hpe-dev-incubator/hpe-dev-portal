---
title: Unlocking organizational efficiency through OpsRamp APIs
date: 2026-05-26T06:35:45.251Z
author: Kheni Sandip
authorimage: /img/kheni-sandip.jpg
disable: false
---
OpsRamp, as a unified IT operations and observability platform, provides a set of common services that help organizations monitor, manage, and automate their IT environments. These services commonly include alerting and event intake, monitoring, resource management, and integrations with external systems. 

The OpsRamp platform exposes these capabilities through a collection of RESTful application programming interfaces (APIs) so that administrators and operators can interact with the platform programmatically—beyond what is available through the UI. 

If you are looking for a quick way to discover what you can do with the OpsRamp APIs using popular tools that don’t require programming (such as Postman), this blog post is for you. You can use these APIs to integrate external monitoring tools for alert ingestion, automate operational workflows, and retrieve platform data for reporting and analytics. 

In Part 1 of this series, we will get started by generating API credentials, defining Postman collection variables, obtaining an OAuth access token, and making one subsequent secure REST API call end-to-end: creating an alert in OpsRamp via API. 

**Introducing the foundational APIs for OpsRamp** 

The foundational APIs for OpsRamp are designed to enable IT administrators and IT operators to automate IT operations by programmatically interacting with platform services and resources. These APIs conform to REST principles, use JSON payloads, and support standard HTTP request methods such as GET and POST. 

For example, with OpsRamp APIs you can: 

* Create alerts from external systems and tools. 
* Retrieve operational data (for example, incidents) using search endpoints. 
* Create or manage resources depending on your use case and permissions. 

OpsRamp API documentation: [OpsRamp Developer Portal](https://develop.opsramp.com/) 

**Postman** 

Postman is an API platform for building and using APIs. You can sign into your Postman account either from the web application or from the desktop application. In this blog, we use Postman to configure collection variables once, generate an OAuth access token, and then make subsequent secure REST API calls. You can use any other software like Insomnia, Hoppscotch etc. instead of Postman.

**Preparing to use the OpsRamp APIs** 

As an IT administrator or a developer, before you can work with OpsRamp APIs, you will need to generate API client credentials (ClientId and ClientSecret) and capture your TenantId (tenant can be partner, client or service provider ID) and token endpoint. The internal OpsRamp guide achieves this by creating a Custom Integration configured for OAuth2. 

To generate API credentials in OpsRamp, proceed as follows: 

1. Log in to OpsRamp as an administrator (Partner admin is recommended). 
2. Select the client you want to use APIs for (you can also use Partner APIs but in most cases, client level APIs are preferred, and we have selected the same)
3. Go to Setup → Account → Integrations and ensure you are in the correct client. 
4. Search for Custom Integration and add a new one. 

![](/img/opramps-api1.png)

5. Open the integration. In the Inbound tab, select Authentication Type as OAUTH2 and set Role as Client Administrator (or any role with API access). 

![](/img/opramps-api2.png)

![](/img/opramps-api3.png)

![](/img/opramps-api4.png)

6. Click Generate Key and copy Tenant ID, Key (ClientId), and Secret (ClientSecret). 
7. Make a note of the Access Token URL shown by the integration.

**Important note:** You will be able to copy the Secret only at the time of creation. If you close the integration page, the secret will not be available for copying, and you will need to create a new integration to generate a new secret.

**Setting the Postman collection for the OpsRamp APIs**

You can organize your requests in a Postman collection so that all requests share the same variables and authentication settings. In this blog, you only need two requests in the collection: Generate Access Token and Create Alert.

**Defining the OpsRamp APIs collection variables**

The collection uses Postman collection variables that are available throughout all requests in the collection. Select your collection and then select the Variables tab as shown below. 

Environment > Create Environment.

![](/img/opramps-api5.png)

Define the current value of the collection variables to match your OpsRamp tenant context: 


**BaseUrl:** This variable defines the base URL of your OpsRamp REST API requests. OpsRamp supports tenant-specific API endpoints and also custom-branded URLs. Use the API endpoint you noted from your Custom Integration or your tenant API base. 


**ClientId and ClientSecret:** These variables must be set to the Key (ClientId) and Secret (ClientSecret) generated in your Custom Integration. They are used to request an OAuth access token using the client_credentials grant type.


**TokenUrl:** This variable is the OAuth token endpoint (Access Token URL) shown in your Custom Integration. Your internal guide shows this token endpoint as /auth/oauth/token on your POD URL. 


**TenantId:** This variable is the tenant identifier used to scope API calls. In OpsRamp APIs, the tenant identifier appears in the path (for example, /api/v2/tenants/{clientId}/...). 


**BearerToken:** Do not edit this variable manually. Keep it empty. It will be set automatically when you run the Generate Access Token request using a post-response script. 

```json
{ 
  "BaseUrl": "https://<your-tenant>.api.opsramp.com", 
  "TokenUrl": "https://<PODname>/auth/oauth/token", 
  "TenantId": "<Your TenantId>", 
  "ClientId": "<Your Key>", 
  "ClientSecret": "<Your Secret>", 
  "BearerToken": "" 
} 
```

**Note:** Do not edit other variables. Keep them empty. The collection variables will be set automatically upon successful execution of REST API calls using Postman scripts.

**Acquire an OAuth access token as your session bearer token**

OpsRamp APIs use a bearer token as an authorization type to ensure that all REST API requests access authorized platform services securely. So, you first need to obtain a token from the OAuth authorization server before you can make any REST API calls to OpsRamp APIs. To do so, proceed as follows:

From your collection, generate the token using the Generate Access Token request and click the Send button. 
