---
title: Learn what you can do with HPE Data Services Cloud Console API in just 3
  minutes
date: 2023-01-27T14:17:03.517Z
author: Denis Choukroun
authorimage: https://gravatar.com/avatar/f66dd9562c53567466149af06ae9d4f1?s=96
disable: false
tags:
  - hpe-greenlake
  - hpe-greenlake-cloud-platform
  - data-services-cloud-console
---
[HPE Data Services Cloud Console](https://developer.hpe.com/greenlake/data-services-cloud-console/home/), available through the [HPE GreenLake edge-to-cloud platform](https://developer.hpe.com/greenlake/hpe-greenlake-cloud-platform/home/), is a Software-as-a-service (SaaS) based cloud console application that delivers a suite of cloud data services that enable a unified data operations as a service for storage infrastructure, simplify storage and data management, and bring the cloud experience to wherever data lives. Data Services Cloud Console also offers a unified and fully programmable API that enables developers to automate data infrastructure management. 

If you’re looking for a quick way to discover everything you can do with the HPE GreenLake Data Services Cloud Console API using popular tools that doesn’t require programming such as Postman, this blog post is definitely for you. 

As you know, one of the benefits of working within a community is the ability to take advantage of open collaboration, sharing hints, tools, and resources. This is exactly what I am doing here. This post helps you get started with the Data Services Cloud Console API for HPE GreenLake for Block Storage cloud data service by taking advantage of the Postman collection contributed by one of our HPE Developer Community members. 

> **Note:** This blog post assumes you have created an [HPE GreenLake account](https://console.greenlake.hpe.com/) and joined your account to your company account (also called an ***organization***). You also got assigned appropriate roles and permissions by the administrator for your organization in order to access HPE data services resources (for example storage arrays and volumes) through the Data Services Cloud Console application instances. A Data Service Cloud Console application instance is a service cluster running in one of the HPE regions.

### Data Services Cloud Console and REST API

Data Services Cloud Console supports a set of REST APIs that allows users to integrate HPE Data Services Cloud Console with their custom applications. By using [OAuth 2.0 protocol](https://oauth.net/2/) to authenticate and authorize applications, secure and time-limited (***120 minutes***) access to HPE data services are provided via an **access token**. The token ensures that client API requests access HPE data services for the requested operation, securely and according to the authorization granted to the user who created it.

> **Note:** You can find the Data Services Cloud Console API Documentation [here](https://console-us1.data.cloud.hpe.com/doc/api/v1/) and in the help section of the [HPE GreenLake Cloud Platform](https://console.greenlake.hpe.com/).    

The REST APIs support standard HTTP request methods (GET, POST, PATCH, PUT and DELETE). A HTTP request is made by providing a specific HPE regional connectivity endpoint for the Data Service Cloud Service application instance, HTTP request method, access token and data payload. The HTTP response for these requests are returned in the JSON format.

Currently, there are three HPE regional Data Services Cloud Console application instance endpoints: 

* EU Central    

  * https://eu1.data.cloud.hpe.com   
 
* AP Northeast    

  * https://jp1.data.cloud.hpe.com    

* US West    

  * https://us1.data.cloud.hpe.com    


HPE GreenLake Cloud Platform allows developers to make API calls on a particular regional Data Services Cloud Console customer instances. Using the API functionality in the HPE GreenLake Cloud Platform graphical user interface (GUI), developers can create their **API client application** credentials. The credentials consist of a *ClientID-ClientSecret* pair that represents the permissions granted to the user who creates the API client application credentials, to access the protected resources. The credentials is then used to generate and refresh expired OAuth based access token. Once the token is generated or refreshed, it can be used as **authorization bearer token** to make further secure REST API calls to HPE data services resources via the regional Data Services Cloud Console application instance.

You can refer to [this blog post](https://developer.hpe.com/blog/api-console-for-data-services-cloud-console/) to learn how to create API client application credentials for your specific regional Data Services Cloud Console application instance. Make sure to copy the *ClientID* and *ClientSecret* values to a safe location as you will need them to generate the access token via a REST API call as explained in the next sections.

**Ready? Let’s get started!**

### Step 1 – Sign in to your Postman account

You can sign in to your Postman account either from the [web app](https://identity.getpostman.com/login) or from the desktop app. If you don’t have a Postman account already, you can sign up for a Postman account [here](https://identity.getpostman.com/signup) and download the desktop app [here](https://www.postman.com/downloads/).

### Step 2 – Copy the existing HPE GreenLake Data Services Cloud Console API public collection

Upon log in to your Postman account, from the ***Search*** bar, look for the public collection "**Data Services Cloud Console API**" and select the public collection from one of our community contributor, [Mark van Silfhout](mailto:mark.van.silfhout@hpe.com) as shown below:

![The Data Services Cloud Console API public collection](/img/search-dscc-collection-postman-figure1.png "The Data Services Cloud Console API public collection")

<span style="color:grey; font-family:Arial; font-size:1em">Figure 1: The Data Services Cloud Console API public collection.</span>

You can then fork the collection to make a copy of it in your Postman workspace. You can then work with your own copy of the collection and perform changes without affecting the parent collection. Select the ***more actions*** icon (the ellipsis) next to the collection, then select ***Create a fork***. When you fork the public collection, you can choose to watch the original collection to be notified about changes made to the parent collection. This allows you to pull updates from the parent collection into your forked copy, should the parent collection be updated.

Alternatively, you can export the public collection locally to your local storage as JSON file and import it as a new collection in your Postman workspace. 

> **Note:** You must sign in to your Postman account to create a fork or export the public collection. To fork a collection within a public workspace, you must also enable your public profile in your Postman profile settings.  

### Step 3 – Set your Data Services Cloud Console collection variables

The Data Services Cloud Console API collection built by Mark makes use of collection variables that are available throughout the REST API requests in the collection. Select the collection in your workspace and then select the ***Variables*** tab as shown below.

![HPE Data Services Cloud Console collection variables](/img/variables-dscc-collection-postman-figure2.png "HPE Data Services Cloud Console collection variables")

<span style="color:grey; font-family:Arial; font-size:1em">Figure 2: HPE Data Services Cloud Console collection variables.</span>

Define the Current Value of the collection variables to match your Data Services Cloud Console context:    

* **baseUrl**: This variable defines the base URL of the REST API requests. It should match the regional endpoint of your Data Services Cloud Console application instance where your storage devices are registered.    

* **ClientId** and **ClientSecret**: they should be set with the value of your Client Application API credentials you previously created using the HPE GreenLake Cloud Platform GUI. These variables are used to request an OAuth access token by authenticating with the authorization server referenced in the **sso_URI** variable.    

* **sso_URI**: This variable is the URI of the OAuth authorization server. If your organization has set up their own HPE GreenLake SAML Single Sign-On (SSO) authorization server to create access token, replace the current default value with your SSO URI. Otherwise keep the value for this variable as currently set to *sso.common.cloud.hpe.com/as/token.oauth2*.    

* **BearerToken:** Do not edit this variable. Keep the value field empty. The collection variable BearerToken will be set automatically upon successful execution of the ***GetToken*** API call as explained in the next step.    


### Step 4 – Acquire an OAuth access token as your session bearer token

Data Services Cloud Console API uses bearer token as authorization type to ensure that all REST API requests access authorized data services securely. So you first need to obtain a token from the OAuth authorization server before you can make any REST API calls to your regional Data Services Cloud Console application instance. To do so, proceed as follows:

* From your collection, generate the token using the ***GetToken*** API call from the ***GetToken-Using-Variables*** folder.    

* Verify you get a status code of 200 for a successful response with the token value in the response body.    

* Check the token value has been automatically defined for the collection variable ***BearerToken***.    


The *GetToken* API call has defined a script in the ***Tests*** tab to programmatically set the collection variable BearerToken as shown in the picture below. The programmatically defined token is then used to authenticate any subsequent REST API calls.

![Defining collection variables programmatically in script](/img/tests-capturebearertoken-dscc-collection-postman-figure3.png "Defining collection variables programmatically in script")

<span style="color:grey; font-family:Arial; font-size:1em">Figure 3: Defining collection variables programmatically in script.</span>

> **Note:** Access bearer token expires after 120 minutes. Run the *GetToken* API request again to refresh the token before or after it expires.

### Step 5 – Make subsequent secure REST API calls

The client REST API requests are authenticated by presenting the access token as authorization bearer token to the regional Data Services Cloud Console application instance. The instance validates the access token, and if valid, serves the request.

Pick one REST API call from the ***storage-systems*** folder to ***Get all storage systems*** registered with your regional Data Services Cloud Console application instance. 

As shown in the two pictures below, all REST API requests in the collection will inherit the authorization bearer token that is specified at the collection level. 

![Authorization type (bearer token) specified at the collection level](/img/authorization-dscc-collection-postman-figure4.png "Authorization type (bearer token) specified at the collection level")

<span style="color:grey; font-family:Arial; font-size:1em">Figure 4: Authorization type (bearer token) specified at the collection level.</span>

![REST API request with authorization type inherited from parent collection](/img/authorization-inherited-dscc-collection-postman-figure5.png "REST API request with authorization type inherited from parent collection")

<span style="color:grey; font-family:Arial; font-size:1em">Figure 5: REST API request with authorization type inherited from parent collection.</span>

As depicted in the figure below, the API supports several query parameters (click on Params tab in the request) depending on the resource type, such as filter (filter the set of resources returned), limit (maximum number of records to return), offset (resource offset to start the response from) and sort (order in which to return the resources in the collection). 

![REST API request with query parameter to search for storage array of type HPE Alletra 9060](/img/getallstoragesystems-dscc-collection-postman-figure6.png "REST API request with query parameter to search for storage array of type HPE Alletra 9060")

<span style="color:grey; font-family:Arial; font-size:1em">Figure 6: REST API request with query parameter to search for storage array of type HPE Alletra 9060.</span>

The query parameters are indicated after the question mark (“?”) in the REST API URL. Select and adjust the query parameters according to your environment. Make sure to refer to [the API documentation](https://console-us1.data.cloud.hpe.com/doc/api/v1/) to understand the query parameters that can be used for each HPE Data Services Cloud Console API requests. 

Finally click the **Send** button. You will get a JSON representation of the storage system resources registered based on the query parameters specified. Here, I am getting the list of storage systems of type “*HPE Alletra 9060*”.

```json
{
    "items": [
        {
            "systemWWN": "2FF70002AC07EB29",
            "name": "s3294",
            "id": "4UW0003294",
            "description": "System s3294",
            "mgmtIp": "16.182.41.5",
            "softwareVersions": "9.5.0",
            "model": "HPE Alletra 9060",
            "productFamily": "deviceType1",
            "state": "NORMAL",
            "callhomeStatus": "ENABLED_NORMAL",
            "resourceUri": "/api/v1/storage-systems/device-type1/4UW0003294",
            "upSince": 1670726169000,
            "fqdn": "s3294.mip.storage.hpecorp.net",
            "capacityDetail": {
                "volumeSpace": 21092875,
                "snapSpace": 1676167,
                "totalUsedSpace": 22769042
            },
            "associatedLinks": [
                {
                    "type": "storage-pools",
                    "resourceUri": "/api/v1/storage-systems/4UW0003294/storage-pools"
                },
                {
                    "type": "volumes",
                    "resourceUri": "/api/v1/storage-systems/4UW0003294/volumes"
                },
                {
                    "type": "swupdatestatus",
                    "resourceUri": "/api/v1/storage-systems/4UW0003294/swupdate/status"
                }
            ],
            "arrayList": null,
            "collectionStatus": {
                "metricStatus": {
                    "status": "NORMAL"
                },
                "configStatus": {
                    "status": "NORMAL"
                },
                "overAllStatus": "NORMAL"
            },
            "lastConnectedTime": 1674674119,
            "connectionStatus": "CONNECTED",
            "customerId": "c93de31c382811ecb478320c1ce21c93",
            "generation": 1674674119,
            "type": "storage-system",
            "tierType": "STORAGE_TIER_9000_NVME",
            "tierName": "HPE Alletra 9000"
        }
    ],
    "total": 1,
    "pageLimit": 50,
    "pageOffset": 0,
    "requestUri": "https://us1.data.cloud.hpe.com/api/v1/storage-systems?filter=model%20eq%20%22HPE%20Alletra%209060%22"
```

**That’s it. No more than 3 minutes!**

## Summary

This blog gives you a great example on how to obtain the access token using API call and help you get started with the Data Services Cloud Console REST API for the *HPE GreenLake for Block Storage* data service using Postman. Additional HPE data services APIs will be published in accordance to the expansion of cloud data services delivered through the HPE Data Services Cloud Console. So make sure to stay tuned for any update of Mark’s public Postman collection for Data Services Cloud Console API.  

If you have more time, I invite you to explore further the rest of the collection on your own while adjusting the query parameters to match your Data Services Cloud Console context. Also, don’t hesitate to provide Mark with feedback on his very convenient collection.

Any questions on HPE GreenLake Data Services Cloud Console API? Please join the [HPE Developer Slack Workspace](https://slack.hpedev.io/) and start a discussion in our [\#hpe-greenlake-data-services-cloud-console](https://hpedev.slack.com/archives/C02D6H623JP) channel.