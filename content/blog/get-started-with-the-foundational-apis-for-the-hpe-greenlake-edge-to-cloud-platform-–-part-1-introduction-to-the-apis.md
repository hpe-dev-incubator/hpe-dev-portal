---
title: "Get started with the foundational APIs for the HPE GreenLake platform –
  Part 1: Introduction to the APIs"
date: 2024-01-12T15:33:48.384Z
featuredBlog: false
priority: 10
author: Denis Choukroun
authorimage: https://gravatar.com/avatar/f66dd9562c53567466149af06ae9d4f1?s=96
disable: false
tags:
  - hpe-greenlake-platform
  - hpe-greenlake
---
 <style>
li {
   font-size: 27px;
   line-height: 33px;
   max-width: none;
}
</style>

**Editor's note:** This blog post series may refer to older release of the HPE GreenLake platform APIs. For information about the current release of the HPE GreenLake service APIs, please visit the [HPE GreenLake API catalog](https://developer.greenlake.hpe.com/docs/greenlake/services/).  

HPE’s unified management plane for hybrid cloud, the HPE GreenLake platform, provides a set of *common services* that are used by cloud services that run on top of the platform. Cloud services rely on these common services for user's authentication, authorization, devices and subscriptions management, monitoring, audit trail and more. 

The HPE GreenLake platform now provides a collection of RESTful application programming interfaces (APIs) for these foundational, common services. 

If you are looking for a quick way to discover what you can do with the HPE GreenLake platform APIs using popular tools that don’t require programming (such as [Postman](https://www.postman.com/product/what-is-postman/)), this blog post series is for you. This series will offer you the opportunity to automate IT operations via these APIs to achieve velocity, be more agile, get consistent results, reduce costs, and scale.

In Part 1 of this series, I will help you get started with the HPE GreenLake platform APIs by taking advantage of a Postman collection I built for you. I will describe the current set of APIs for HPE GreenLake platform. I will also show you how to obtain an OAuth access token to make subsequent secure REST API calls to the HPE GreenLake platform APIs. 

In [Part 2](https://developer.hpe.com/blog/get-started-with-the-foundational-apis-for-the-hpe-greenlake-edge-to-cloud-platform-%E2%80%93-part-2-configuring-and-managing-a-workspace/) and [Part 3](https://developer.hpe.com/blog/get-started-with-the-foundational-apis-for-the-hpe-greenlake-edge-to-cloud-platform-%E2%80%93-part-3-tracking-activities-and-monitoring-health/) of the blog series, I will take you on a deep dive into the foundational HPE GreenLake platform APIs through a typical customer scenario in which one automates IT operations via APIs such as managing users and resources, tracking activities and monitoring the overall health of services and devices in a ***Standard Enterprise*** workspace. This type of workspace is a single-tenant environment for a single customer and organization.

Let’s embark on this exciting journey into the HPE GreenLake platform APIs.

## Introducing the foundational APIs for the HPE GreenLake platform

The foundational APIs for the HPE GreenLake platform services are designed to enable IT administrators and IT operators to automate IT operations by **programmatically** managing users and resources in an HPE GreenLake platform **workspace**. 

> **Note:** A workspace is an identity and access management boundary. HPE GreenLake customers can organize their users, hardware and services into one or more workspaces. Users and resources must be in a workspace to be operated according to specific user permissions.

For example, the current set of APIs for common platform services allows HPE GreenLake customers and partners to **programmatically** add users, add devices and associated subscriptions (licenses), track users’ activities and monitor the overall health of the managed services and devices in the workspace.

> **Important note:** This set of APIs for common platform services differentiates from the specific APIs for the cloud services that HPE GreenLake administrators can deploy in their workspace to operate and manage workloads and their underlying infrastructure for networking, compute, storage and data services. You can find more information about these services’ specific APIs in the HPE Developer Community portal: [HPE Aruba Networking Central](https://developer.hpe.com/greenlake/aruba-central/home/), [HPE Compute Ops Management](https://developer.hpe.com/greenlake/hpe-greenlake-for-compute-ops-management/home/), and [HPE GreenLake for Data Services](https://developer.hpe.com/greenlake/data-services-on-the-hpe-greenlake-platform/home/).   

The set of APIs for common platform services includes:

* **Identity and Access management (IAM) services:** Identity and Access management services control access to HPE GreenLake workspace. The services ensure that users are granted appropriate access rights based on their roles. IAM includes the following services:

  * **Workspace management service:** Workspace management service allows you to manage workspace information and operate tenants for a Managed Service Provider (MSP) workspace.
  * **Identity management service:** Identity management service allows you to manage the workspace users. The service allows you to invite users to join the workspace, retrieve a list of existing users in the workspace and delete users from the workspace.
  * **API client credentials service:** HPE GreenLake API Client Credentials service allows programmatic access to manage workspace API Client credentials.
* **Location management:** Location management service manages service delivery information (SDI), including device location and support contact information.     
* **Device inventory management:** Device service maintains the inventory of all devices (networking, compute and storage devices) connected to the workspace.    
* **Subscription management:** Subscription management service maintains the subscriptions and licenses for cloud management of devices for networking, compute and storage, and cloud software as-a-service.    
* **Service catalog management:** Service Catalog service allows you to manage the workspace services and service managers that are used to operate and manage workloads and their underlying infrastructure. These services run on top of the HPE GreenLake platform.     
* **Audit log management:** Audit log service records the occurrence of events emitted by any device or service. These logs can also be used for auditing purposes, track user activity, investigate breaches and ensure compliance with regulatory requirements.    
* **Wellness event service:** Wellness service presents wellness events for several HPE services and products in the workspace. In a near future, it will also enable you to open a support ticket corresponding to a wellness event when appropriate.

These APIs conform to [OpenAPI specifications](https://spec.openapis.org/oas/latest.html) and are [RESTful](https://restfulapi.net/). This makes them easy to learn, discoverable by code, and accessible with any programming language. By using OAuth protocol to authenticate and authorize API client applications, secure and time-limited access to the collection of HPE GreenLake platform service APIs are provided via an access token. The token ensures that client API requests access HPE GreenLake platform services and resources securely and according to the authorization granted to the user who created the access token.

The REST APIs support standard HTTP request methods (GET, POST, PATCH, PUT and DELETE). An HTTP request is made by providing a single unified domain endpoint (*https://global.api.greenlake.hpe.com*) to the HPE GreenLake platform APIs, HTTP request method, access token and data payload. The HTTP response for these requests is returned in a JSON format.

> **Note:** The [HPE GreenLake platform documentation](https://developer.greenlake.hpe.com/docs/greenlake/services/) for these APIs leverages OpenAPI specifications and associated reference documentations. The documentation provides a complete explanation of the operations supported by these APIs for common HPE GreenLake platform services, as well as sample requests and responses.

## Postman

Postman is an API platform for building and using APIs. You can sign into your Postman account either from the [web application](https://identity.getpostman.com/login) or from the desktop application. If you don’t have a Postman account already, you can sign up for a Postman account [here](https://identity.getpostman.com/signup) or download the desktop application [here](https://www.postman.com/downloads/).

## Preparing to use the APIs for common platform services

As an IT administrator, before you can work with the APIs for common HPE GreenLake platform services, you will need to:

1. Create an HPE account and a company workspace for your organization. Ensure you get assigned the ***Workspace Administrator*** role in HPE GreenLake platform for your organization workspace. 

> **Note:** You can refer to the [HPE GreenLake platform user guide](https://support.hpe.com/hpesc/public/docDisplay?docId=a00120892en_us&page=index.html) to learn how to create an HPE account, a workspace and assign roles.  

2. Generate personal API client credentials for the *HPE GreenLake platform*. The credentials consist of a *ClientID* and *ClientSecret* pair that represents the permissions granted to the user who creates the personal API client credentials. **Save** the *ClientID* and *ClientSecret* to a safe location. You will need the credentials to generate and refresh an expired OAuth based access token when making REST API calls. Once the token is generated or refreshed, it can be used as an **authorization bearer token** to make further secure REST API calls to the APIs for HPE GreenLake platform common services. 

> **Note:** To make REST API calls to HPE GreenLake platform APIs, you will need to select “**HPE GreenLake platform**” as an option when configuring personal API client credentials. To learn how to create personal API client credentials for HPE GreenLake platform APIs, check out the [Creating a personal API client](https://support.hpe.com/hpesc/public/docDisplay?docId=a00120892en_us&page=GUID-23E6EE78-AAB7-472C-8D16-7169938BE628.html) and [Requesting access to HPE GreenLake platform APIs](https://support.hpe.com/hpesc/public/docDisplay?docId=a00120892en_us&page=GUID-771F9B3A-B029-43E5-A38F-6D8D04178FAB.html) in the HPE GreenLake platform user guide.

3. Gather the unique identifier of your organization workspace: Go to **Manage Workspace** in the [HPE GreenLake platform Graphical User Interface](https://common.cloud.hpe.com/) to get the identifier of your workspace. **Save** the *workspace identifier*.

4. Obtain the unique ***identifier*** of your services deployed in your workspace. These services are typically HPE Aruba Networking Central, Data Services, and HPE Compute Ops Management used to manage and operate your networking, storge and compute infrastructure. One method is to use your Internet browser, log in to the HPE GreenLake platform UI and launch the **inspect element** feature of your browser to inspect the **Network** activity. In your workspace, select **Services** and check the network activity in the inspect element. In the left-end panel, select **provisions**, and select **Response** in the Network activity panel to display the list of services provisioned in your workspace. **Save** the ***identifier*** (displayed as *application_id* in the *Response* tab) for each of your *PROVISIONED* services. Another method is to use the [Service catalog API](https://developer.greenlake.hpe.com/docs/greenlake/services/service-catalog/public/) to list the services that are ***provisioned*** in your workspace. You will need the information about the provisioned services when making REST API calls to the foundational, common services for the HPE GreenLake platform. 

5. Get information (email address) for a user to invite to your workspace.

6. Get information for a Networking device (Serial Number and MAC address), or for a Storage device (Serial Number), or for a Compute device (Serial Number and Product ID) to allow you to manage these devices from the HPE GreenLake platform workspace using the APIs. The product’s serial number and other identifying details are information you received in the product order confirmation email. You will also need to get the associated subscription keys for these devices.

## Setting the Postman collection for the HPE GreenLake platform APIs

As you know, one of the benefits of working within a community is the ability to take advantage of open collaboration, sharing hints, tools, and resources. Although you can build your own Postman collection by downloading the OpenAPI specification files from the [HPE GreenLake documentation](https://developer.greenlake.hpe.com/docs/greenlake/services/) and importing them to Postman, you can take advantage of the Postman collection I built for you. The Postman collection for the *APIs for common HPE GreenLake platform services* is available in the [HPE Developer Community tooling repository](https://github.com/hpe-dev-incubator/GLP-API-Tooling/tree/main/Postman-Collections). Simply download the JSON file and import it to Postman. Then set the collection variables as explained in the next section.

> **Note:** As HPE will enrich the APIs for common platform services over time, I will update the Postman collection as appropriate. So, check out the link above regularly to download the latest release of the Postman collection. 

### Defining the HPE GreenLake platform APIs collection variables

The collection I built makes use of collection variables that are available throughout all the REST API requests in the collection. Select the collection and then select the **Variables** tab as shown below:

![Figure 1: HPE GreenLake platform API collections variables](/img/blog-part1-collection-variables-image1.png "Figure 1: HPE GreenLake platform API collections variables")

> > <span style="color:grey; font-family:Arial; font-size:1em"> Figure 1: HPE GreenLake platform API collections variables</span>

Define the **current value** of the collection variables to match your HPE GreenLake platform workspace context:

* **BaseUrl:** This variable defines the base URL of the REST API requests. It matches the single unified domain endpoint (*https://global.api.greenlake.hpe.com*) to APIs for common HPE GreenLake platform services. 
* **ClientId** and **ClientSecret:** These variables should be set with the value of your personal Client Application API credentials you previously created using the HPE GreenLake platform GUI. These variables are used to request an OAuth access token by authenticating with the authorization server referenced in the **sso_URI** variable or the **TokenIssuerURL** variable.
* **sso_URI:** This variable is the URI of the OAuth authorization server. If your organization has set up their own HPE GreenLake SAML Single Sign-On (SSO) authorization server to create an access token, replace the current default value with your SSO URI. Otherwise you can keep the value for this variable as currently set to _sso.common.cloud.hpe.com/as/token.oauth2_.
* **TokenIssuerURL:** This variable is the URL of the Token Issuer you obtain when you create your personal API client credentials from the HPE GreenLake GUI for your workspace.
* **BearerToken:** Do not edit this variable. Keep the value field empty. The collection variable _BearerToken_ will be set automatically upon successful execution of the ***Generate AccessToken*** API call as explained in the next step.
* **Workspace ID:** This variable should be set with the value of the *identifier* of your Workspace you previously saved.
* **Aruba_Application_Id**, **COM_Application_Id**, and **DSCC_Application_Id:** These variables should be set with the value of the *identifier* of the services you deployed in your workspace to manage your infrastructure services for networking, compute and storage.
* **GLP_Application_Id:** This variable is the *identifier* of the HPE GreenLake platform. This is always set to value “00000000-0000-0000-0000-000000000000”.
* **ServiceManagerName:** This variable should be set with the name of a cloud service manager used to manage your infrastructure equipment for compute, storage and networking. For example "*Aruba Central*", "*Compute Ops Management*", or "*Data Services*".
* **RegionId:** This variable should be set with the name of the region where your service managers are installed. For example "*eu-central*".

**Note:** Do not edit the other variables. Keep the value field empty. The collection variables will be set automatically upon successful execution of REST API calls using Postman ***Scripts***.

## Acquire an OAuth access token as your session bearer token

The APIs for common HPE GreenLake platform services use a bearer token as an authorization type to ensure that all REST API requests access authorized platform services securely. So, you first need to obtain a token from the OAuth authorization server before you can make any REST API calls to the HPE GreenLake platform services. To do so, proceed as follows:

* From your collection, generate the token using the ***Generate AccessToken*** API call or the ***Generate AccessToken with TokenIssuerURL*** from the ***Step1-Generate Token*** folder. Click the **Send** button.
* Verify you get a status code of 200 for a successful response with token value in the response body.

The *Generate AccessToken* API call has defined a Post-response script in the **Scripts** tab (formerly known as Postman Tests script) to programmatically set the collection variable *BearerToken* as shown in the picture below. The programmatically defined token is then used to authenticate any subsequent REST API calls.

![Figure 2: Defining collection variables programmatically in script](/img/blog-part1-bearertoken-testscript-image2.png "Figure 2: Defining collection variables programmatically in script")

> > <span style="color:grey; font-family:Arial; font-size:1em"> Figure 2: Defining collection variables programmatically in script</span>
>
> **Note:** Access bearer tokens expire after 15 minutes for HPE GreenLake platform tokens. Run the *Generate AccessToken* API request or the *Generate AccessToken with TokenIssuerURL* API request again to refresh the token before or after it expires.

## Make subsequent secure REST API calls to HPE GreenLake platform services

All subsequent REST API requests are authenticated by presenting the access token as the authorization bearer token to the APIs for common HPE GreenLake platform services. The services validate the access token, and if valid, serve the requests.

As shown in the two pictures below, all REST API requests in the collection will inherit the authorization bearer token that is specified at the collection level:

![Figure 3: Authorization type (bearer token) specified at the collection level](/img/blog-part1-collection-level-authorization-image3.png "Figure 3: Authorization type (bearer token) specified at the collection level")

> > <span style="color:grey; font-family:Arial; font-size:1em"> Figure 3: Authorization type (bearer token) specified at the collection level</span>

![Figure 4: REST API request with authorization type inherited from parent collection](/img/blog-part1-collection-api-call-authorization-image4.png "Figure 4: REST API request with authorization type inherited from parent collection")

> > <span style="color:grey; font-family:Arial; font-size:1em"> Figure 4: REST API request with authorization type inherited from parent collection</span>

To validate the access token, pick the next REST API call ***Get workspace information*** from the ***Step1-Generate Token*** folder. Click the **Send** button and verify you get a *status code of 200* for a successful response. You will get a JSON representation of your HPE GreenLake platform workspace. An example is shown below:

```json
{
    "id": "<Your WorkspaceId>",
    "type": "workspace",
    "generation": 26,
    "createdAt": "2021-10-05T15:37:45.991228",
    "updatedAt": "2023-12-08T08:42:31.708206",
    "workspaceName": "<Your Workspace Name>",
    "createdBy": "<name of person who created the workspace>"
}
```

**Congratulations!** You have placed your first API calls to the common HPE GreenLake platform services using Postman.  

## Summary

This blog post helps you get started with the HPE GreenLake platform APIs by taking advantage of Postman collection. It explains you the preparation steps you need to take to use the APIs for common platform services and walks you through the steps required to obtain an OAuth access token to make secure REST API calls to the HPE GreenLake platform APIs.

You can get the Postman collection from the [HPE Developer Community tooling GitHub repository](https://github.com/hpe-dev-incubator/GLP-API-Tooling/tree/main/Postman-Collections).

Don’t miss [Part 2](https://developer.hpe.com/blog/get-started-with-the-foundational-apis-for-the-hpe-greenlake-edge-to-cloud-platform-%E2%80%93-part-2-configuring-and-managing-a-workspace/) and [Part 3](https://developer.hpe.com/blog/get-started-with-the-foundational-apis-for-the-hpe-greenlake-edge-to-cloud-platform-%E2%80%93-part-3-tracking-activities-and-monitoring-health/) of this blog series, where you will further explore the rest of the collection to learn how you, as an IT administrator of the HPE GreenLake platform, can configure and manage workspace resources (users’ identity, devices and subscriptions) and how you can track activities within your workspace and monitor overall health of services and devices in your workspace. 

If you’re interested in trying out what I just discussed, you might want to check out one of our hands-on Workshops-on-Demand that lets you play with the HPE GreenLake APIs mentioned in this blog post. The workshops are free, available 24/7, and very easy to use. They give you a real-world experience without any risk. Check out our [catalog of workshops](https://developer.hpe.com/hackshack/workshops), register for the one you’re interested in and go! It’s as simple as that. 

If you still have any questions regarding the HPE GreenLake platform APIs, join the [HPE Developer Community Slack Workspace](https://developer.hpe.com/slack-signup/) and start a discussion in our [\#hpe-greenlake-api](https://hpedev.slack.com/archives/C02EG5XFK8Q) channel. We’re always here to help.