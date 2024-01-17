---
title: "Get started with the foundational APIs for the HPE GreenLake
  edge-to-cloud platform – Part 2: Configuring and managing a workspace"
date: 2024-01-17T16:01:44.375Z
author: Denis Choukroun
authorimage: https://gravatar.com/avatar/f66dd9562c53567466149af06ae9d4f1?s=96
disable: false
tags:
  - hpe-greenlake
  - hpe-greenlake-platform
---
<style>
li {
   font-size: 27px;
   line-height: 33px;
   max-width: none;
}
</style>

This is Part 2 of a blog series that showcases the capabilities of APIs for common HPE GreenLake services through a real customer use case, presenting it from the perspective of a user of the platform, such as an IT administrator. 

[In the previous blog post](https://developer.hpe.com/blog/get-started-with-the-foundational-apis-for-the-hpe-greenlake-edge-to-cloud-platform-%E2%80%93-part-1-introduction-to-the-apis/), I described the current set of APIs for the HPE GreenLake platform, and I covered the Postman collection aspect I built to get started with these APIs.   

In this second part of the series, I will put on my IT administrator’s hat and assume the role of the HPE GreenLake platform workspace administrator for a ***Standard Enterprise*** workspace. This type of workspace is a _single-tenant_ environment for a single customer and organization. As workspace administrator, I have full privileges to provision, manage and monitor the users, users’ permissions, and IT resources in the workspace.  

As I do so, I will show you how to use these foundational, common APIs to **programmatically** configure and manage workspace resources (users and infrastructure devices) like an administrator would do using the HPE GreenLake platform User Interface (UI). I will walk you through some of the most common REST API calls to the HPE GreenLake platform API services based on a typical customer scenario that will allow you to learn what you can do on the platform using this set of APIs:  

* Configuring and managing an HPE GreenLake platform workspace:
  * Invite users to join a workspace.
  * Add a device (for example an HPE Aruba Access Point) and subscription to the workspace.
  * Attach the device to a regional application instance (for example, Aruba Central application in Central Europe) and a subscription key (a license) to operate the device.
  * Remove application and subscription assignments for a device.  

## Obtaining the OAuth access token
As I prepare to access and use the HPE GreenLake platform workspace resources through REST API calls to the platform API services, I first need to generate an OAuth access token. Refer to [my blog post Part 1](https://developer.hpe.com/blog/get-started-with-the-foundational-apis-for-the-hpe-greenlake-edge-to-cloud-platform-%E2%80%93-part-1-introduction-to-the-apis/) to learn how to generate the access token using the Postman collection available [here](https://github.com/hpe-dev-incubator/GLP-API-Tooling/tree/main/Postman-Collections). 

Once the access token is generated, it will be used as the **authorization bearer token** for all subsequent REST API calls.

## Inviting a tenant user to collaborate in the workspace
As a workspace administrator in my HPE GreenLake platform workspace, I can easily invite other members of my organization to join the workspace by sending them a sign-up link in email. Here I am using the **POST** REST API call - ***Invite a user***, taken from the Postman collection folder: ***Configuring and Managing GLP Workspace/Step2-IAM/Identity/v1/users***.

`POST {{baseUrl}}/identity/v1/users`

Image-1
>> <span style="color:grey; font-family:Arial; font-size:1em"> Figure 1: Invite a user REST API call</span>

> **Note:** You must be assigned the HPE GreenLake platform administrator role to invite a user to join the workspace.

Let’s look at this REST API request **syntax**. All REST API calls to HPE GreenLake platform services are made by providing:

* The single unified domain endpoint (_https://global.api.greenlake.hpe.com_) defined in the baseURL variable, 
* The HTTP request method such as GET, POST, PUT/PATCH, or DELETE. In this example, the POST method is specified to create a new user instance in the workspace.
* The path (_API-group-name/API-Version/Workspace-Resources_). The path specifies the API group name (here identity), the version of the API (here v1), and the resource path in the workspace (here users).
* A data payload when using a method that involves changing (PUT/PATCH) or creating (POST) an object instance. In this example, as the method involves creating a user instance in the workspace, the data payload (the Body) specifies the e-mail user address, and a welcome email is sent to the user to invite the user to join the workspace.

To get started, I hit the **Send** button and I get a ***201 Created*** response indicating that the user has been successfully invited. The user then receives an email to confirm and accept the invitation. The user will then be invited to create and activate an HPE account to join the workspace.  Users who are invited are not **verified** users until they accept the email confirmation. 

I can then verify the user has joined the workspace by using the GET REST API call ***Get invited users by Username*** below: 

`GET {{baseUrl}}/identity/v1/users?filter=username eq '<user’s email address>'`

Image-2
>> <span style="color:grey; font-family:Arial; font-size:1em"> Figure 2: Checking the status of the invited user in the workspace</span>

The REST API call syntax is the same as the previous API request, but here a **GET** method is used to list the users in the workspace. 

One or more **query parameters** indicated after the question mark (“**?**”) in the URL can be used to filter the data that an API request returns. Typical query parameters are:

   * **filter:** filter the set of resources returned based on the criteria specified in the filter query parameter 
   * **limit:** maximum number of records to return 
   * **offset:** resource offset to start the response from

In this example, I use ***filter*** as the query parameter to limit the scope of the output of the call to just the invited user’s email specified in the filter query parameter.

I now hit the **Send** button. The request indicates success (***Status: 200 OK***). In the response, a _userStatus_ of _VERIFIED_ means that the user has activated the HPE account and joined the workspace. A _userStatus_ of _UNVERIFIED_ would mean that the user has not created and activated the HPE account yet.  

> **Note:** Thanks to the _Test script_ associated with this request, the user-Id of the invited user is automatically saved as collection variable. The user-id is needed should an administrator want to disassociate (delete) a user from the workspace using the REST API call ***DELETE Disassociate a user***.

## Managing IT resources (devices and subscriptions) into the workspace
A typical scenario to manage infrastructure resources from the HPE GreenLake platform would be where one would:
* Add an infrastructure device and a subscription key for this device to the workspace. In this scenario, I will add an HPE Aruba Access Point and associated subscription key to the inventory of the workspace. 
* Attach the device to an application to manage and operate the device. In this scenario, I will assign the Aruba Access Point to the Aruba Central application already deployed in the workspace. The Aruba Central application is a SaaS-based User Interface that lets customers manage their fleet of networking equipment from edge-to-cloud from a single web interface.
* Assign a subscription key to the device. A subscription key is a license key needed to activate the device and allows the IT administrator to use and operate it using the appropriate application management console such as Aruba Central for Aruba networking devices, Compute Ops Management for compute servers, and Data Services Cloud Console for Storage arrays.
* Remove assignment of an application or a subscription for a device.

### Adding a device and subscription 
Here I am going to use the REST API calls from the Postman collection folder: ***Configuring and Managing GLP Workspace/Step4-Devices and Subscriptions***.

The **POST** REST API call ***Add devices - Aruba Access Point with Tag*** from ***/devices/v1beta1/devices*** subfolder allows me to add an Aruba networking device to the inventory in the workspace by providing device details in the data payload (Body) of the request. The device information for Aruba equipment includes the _Serial Number_ and the _MAC address_. 

Optionally I can assign a “**tag**” to the device while adding it to the inventory. Tags are _name-value_ pairs that can be very useful for identifying groups of resources. In the example below, the tag’s name is “_Aruba Access Point_”, and the value is “_Lab Building 2_”.

`POST {{baseUrl}}/devices/v1beta1/devices` 

```json
{
    "compute": [],
    "storage": [],
    "network": [
        {
            "serialNumber": "<SerialNumber of the device>",
            "macAddress": "<MAC-address of the device>",
             "tags": {
               "Aruba Access Point": "Lab Building 2"
             }
        }
    ]
}
```

The “**Add devices**” API call is an asynchronous operation, and the response of the request indicates ***Status: 202 Accepted***. The response contains the transaction Id of the asynchronous operation that I can use as a Path variable in the subsequent **GET** API call ***Get progress or status of async operations in devices*** to verify whether the asynchronous operation is successful or not:

`GET {{baseUrl}}/devices/v1beta1/async-operations/:id`

Image-3
>> <span style="color:grey; font-family:Arial; font-size:1em"> Figure 3: Checking the status of the asynchronous operation for adding devices</span>

A similar sequence of REST API calls can be used to add a subscription key in the workspace inventory and verify the status of the asynchronous operation. The **POST** REST API call ***Add subscriptions key for AP device** derived from the API call ***POST Add subscriptions*** from ***/subscriptions/v1beta1*** subfolder allows me to add a subscription for Aruba networking devices to the inventory in the workspace by providing the _subscription key_ in the data payload (Body) of the request. The API call is an asynchronous operation.

`POST {{baseUrl}}/subscriptions/v1beta1/subscriptions`

```json
{
  "subscriptions": [
    {
      "key": "<Subscription key>"
    }
  ]
}
```

The GET API call ***Get progress or status of async operations in subscriptions”*** is used to verify status of the asynchronous operation:

`GET {{baseUrl}}/subscriptions/v1beta1/async-operations/:id`

I can now use the two subsequent REST API calls below to fetch detailed information about the device and the subscription key I have just added to the inventory: 

* The ***Get devices managed in a workspace*** API call allows me to obtain detailed information about the device by specifying the SerialNumber of the device in the filter query parameter. This request will allow me to save the device ID as a collection variable.

* Similarly, the ***Get subscriptions of a workspace*** API call allows me to get detailed information about the subscription key and fetch the subscription key ID as collection variable. 

`GET {{baseUrl}}/devices/v1beta1/devices?filter=serialNumber eq '<SerialNumber>'` 

`GET {{baseUrl}}/subscriptions/v1alpha1/subscriptions?filter=key eq '<SubcriptionKey>'`

> **Note:** I will need the _device ID_ to attach the device to a regional instance of an application. I will also need the _subscription key ID_ to assign the subscription key to the device as explained in the next step.

