---
title: Learn what you can do with HPE Data Services Cloud Console API in just 3
  minutes
date: 2023-01-27T14:17:03.517Z
author: Denis Choukroun
authorimage: https://gravatar.com/avatar/f66dd9562c53567466149af06ae9d4f1?s=96
disable: false
tags:
  - hpe-greenlake
  - hpe-greenalke-cloud-platform
  - data-services-cloud-console
---
[HPE Data Services Cloud Console](https://developer.hpe.com/greenlake/data-services-cloud-console/home/), available through the [HPE GreenLake edge-to-cloud platform](https://developer.hpe.com/greenlake/hpe-greenlake-cloud-platform/home/), is a Software-as-a-service (SaaS) based cloud console application that delivers a suite of cloud data services that enable a unified data operations as a service for storage infrastructure, simplify storage and data management, and bring the cloud experience to wherever data lives. Data Services Cloud Console also offers a unified and fully programmable API that enables developers to automate data infrastructure management. 

If you’re looking for a quick way to discover everything you can do with the HPE GreenLake Data Services Cloud Console API using popular tools that doesn’t require programming such as Postman, this blog post is definitely for you. It helps you get started with the Data Services Cloud Console API for _HPE GreenLake for Block Storage_ cloud data service by taking advantage of the **Postman collection** contributed by one of our HPE Developer Community members.

>**Note:** This blog post assumes you have created an [HPE GreenLake account](https://console.greenlake.hpe.com/) and joined your account to your company account (also called an ***organization***). You also got assigned appropriate roles and permissions by the administrator for your organization in order to access HPE data services resources (for example storage arrays and volumes) through the Data Services Cloud Console application instances. A Data Service Cloud Console application instance is a service cluster running in one of the HPE regions.

### Data Services Cloud Console and REST API

Data Services Cloud Console supports a set of REST APIs that allows users to integrate HPE Data Services Cloud Console with their custom applications. By using [OAuth 2.0 protocol](https://oauth.net/2/) to authenticate and authorize applications, secure and time-limited (***120 minutes***) access to HPE data services are provided via an **access token**. The token ensures that client API requests access HPE data services for the requested operation, securely and according to the authorization granted to the user who created it.

>**Note:** You can find the Data Services Cloud Console API Documentation [here](https://console-us1.data.cloud.hpe.com/doc/api/v1/) and in the help section of the [HPE GreenLake Cloud Platform](https://console.greenlake.hpe.com/).    

The REST APIs support standard HTTP request methods (GET, POST, PATCH, PUT and DELETE). A HTTP request is made by providing a specific HPE regional connectivity endpoint for the Data Service Cloud Service application instance, HTTP request method, access token and data payload. The HTTP response for these requests are returned in the JSON format.

Currently, there are three HPE regional Data Services Cloud Console application instance endpoints: 

* EU Central    
    * https://eu1.data.cloud.hpe.com    

* AP Northeast    
    * https://jp1.data.cloud.hpe.com    

* US West    
    * https://us1.data.cloud.hpe.com    


HPE GreenLake Cloud Platform allows developers to make API calls on a particular regional Data Services Cloud Console customer instances. Using the API functionality in the HPE GreenLake Cloud Platform graphical user interface (GUI), developers can create their **API client application** credentials. The credentials consist of a _ClientID-ClientSecret_ pair that represents the permissions granted to the user who creates the API client application credentials, to access the protected resources. The credentials is then used to generate and refresh expired OAuth based access token. Once the token is generated or refreshed, it can be used as **authorization bearer token** to make further secure REST API calls to HPE data services resources via the regional Data Services Cloud Console application instance.

You can refer to [this blog post](https://developer.hpe.com/blog/api-console-for-data-services-cloud-console/) to learn how to create API client application credentials for your specific regional Data Services Cloud Console application instance. Make sure to copy the _ClientID_ and _ClientSecret_ values to a safe location as you will need them to generate the access token via a REST API call as explained in the next sections.

**Ready? Let’s get started!**

### Step 1 – Sign in to your Postman account

You can sign in to your Postman account either from the [web app](https://identity.getpostman.com/login) or from the desktop app. If you don’t have a Postman account already, you can sign up for a Postman account [here](https://identity.getpostman.com/signup) and download the desktop app [here](https://www.postman.com/downloads/).

### Step 2 – Copy the existing HPE GreenLake Data Services Cloud Console API public collection

Upon log in to your Postman account, from the ***Search*** bar, look for the public collection "**Data Services Cloud Console API**" and select the public collection from one of our community contributor, [Mark van Silfhout](mailto:mark.van.silfhout@hpe.com) as shown below:

[figure 1]    
<span style="color:grey; font-family:Arial; font-size:1em">Figure 1: The Data Services Cloud Console API public collection.</span>


You can then fork the collection to make a copy of it in your Postman workspace. You can then work with your own copy of the collection and perform changes without affecting the parent collection. Select the ***more actions*** icon (the ellipsis) next to the collection, then select ***Create a fork***. When you fork the public collection, you can choose to watch the original collection to be notified about changes made to the parent collection. This allows you to pull updates from the parent collection into your forked copy, should the parent collection be updated.

Alternatively, you can export the public collection locally to your local storage as JSON file and import it as a new collection in your Postman workspace. 

>**Note:** You must sign in to your Postman account to create a fork or export the public collection. To fork a collection within a public workspace, you must also enable your public profile in your Postman profile settings.  

### Step 3 – Set your Data Services Cloud Console collection variables

The Data Services Cloud Console API collection built by Mark makes use of collection variables that are available throughout the REST API requests in the collection. Select the collection in your workspace and then select the ***Variables*** tab as shown below.

[Figure 2]     
<span style="color:grey; font-family:Arial; font-size:1em">Figure 2: HPE Data Services Cloud Console collection variables.</span>

Define the Current Value of the collection variables to match your Data Services Cloud Console context:    

* **baseUrl**: This variable defines the base URL of the REST API requests. It should match the regional endpoint of your Data Services Cloud Console application instance where your storage devices are registered.    
 
* **ClientId** and **ClientSecret**: they should be set with the value of your Client Application API credentials you previously created using the HPE GreenLake Cloud Platform GUI. These variables are used to request an OAuth access token by authenticating with the authorization server referenced in the **sso_URI** variable.    

* **sso_URI**: This variable is the URI of the OAuth authorization server. If your organization has set up their own HPE GreenLake SAML Single Sign-On (SSO) authorization server to create access token, replace the current default value with your SSO URI. Otherwise keep the value for this variable as currently set to _sso.common.cloud.hpe.com/as/token.oauth2_.    

* **BearerToken:** Do not edit this variable. Keep the value field empty. The collection variable BearerToken will be set automatically upon successful execution of the ***GetToken*** API call as explained in the next step.

