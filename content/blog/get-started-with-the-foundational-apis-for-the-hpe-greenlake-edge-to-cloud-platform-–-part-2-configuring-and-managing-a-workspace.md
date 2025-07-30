---
title: "Get started with the foundational APIs for the HPE GreenLake platform –
  Part 2: Configuring and managing a workspace"
date: 2024-01-31T17:29:10.532Z
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

**Editor's note:** This blog post series may refer to older release of the HPE GreenLake platform APIs. For information about the current release of the HPE GreenLake service APIs, please visit the [HPE GreenLake API catalog](https://developer.greenlake.hpe.com/docs/greenlake/services/). 

This is Part 2 of a blog series that showcases the capabilities of APIs for common HPE GreenLake platform services through a real customer use case, presenting it from the perspective of a user of the platform, such as an IT administrator. 

[In the previous blog post](https://developer.hpe.com/blog/get-started-with-the-foundational-apis-for-the-hpe-greenlake-edge-to-cloud-platform-%E2%80%93-part-1-introduction-to-the-apis/), I described the current set of APIs for the HPE GreenLake platform, and I covered the Postman collection aspect I built to get started with these APIs.   

In this second part of the series, I will put on my IT administrator’s hat and assume the role of the HPE GreenLake platform Workspace Administrator for a ***Standard Enterprise*** workspace. This type of workspace is a *single-tenant* environment for a single customer and organization. As workspace administrator, I have full privileges to provision, manage and monitor the users and IT resources in the workspace.  

As I do so, I will show you how to use these foundational, common APIs to **programmatically** configure and manage workspace resources (users and infrastructure devices) like an administrator would do using the HPE GreenLake platform User Interface (UI). I will walk you through some of the most common REST API calls to the HPE GreenLake platform API services based on a typical customer scenario that will allow you to learn what you can do on the platform using this set of APIs:  

* Configuring and managing an HPE GreenLake platform workspace:

  * Invite users to join a workspace.
  * Add a device (for example an HPE Aruba Access Point) and subscription to the workspace.
  * Attach the device to a regional instance of a service deployed in the workspace (for example, HPE Aruba Networking Central service in Central Europe) and a subscription key (a license) to operate the device.
  * Remove service and subscription assignments for a device.  

## Obtaining the OAuth access token

As I prepare to access and use the HPE GreenLake platform workspace resources through REST API calls to the platform API services, I first need to generate an OAuth access token. Refer to [my blog post Part 1](https://developer.hpe.com/blog/get-started-with-the-foundational-apis-for-the-hpe-greenlake-edge-to-cloud-platform-%E2%80%93-part-1-introduction-to-the-apis/) to learn how to generate the access token using the Postman collection available [here](https://github.com/hpe-dev-incubator/GLP-API-Tooling/tree/main/Postman-Collections). 

Once the access token is generated, it will be used as the **authorization bearer token** for all subsequent REST API calls.

## Inviting a tenant user to collaborate in the workspace

As an administrator in my HPE GreenLake platform workspace, I can easily invite other members of my organization to join the workspace by sending them a sign-up link in email. Here I am using the **POST** REST API call - ***Invite a user***, taken from the Postman collection folder: ***Configuring and Managing GLP Workspace/Step2-IAM/Identity/v1/users***.

`POST {{baseUrl}}/identity/v1/users`

![Figure 1: Invite a user REST API call](/img/blog-part2-invite-user-image1.png "Figure 1: Invite a user REST API call")

> > <span style="color:grey; font-family:Arial; font-size:1em"> Figure 1: Invite a user REST API call</span>
>
> **Note:** You must be assigned the HPE GreenLake platform *Workspace Administrator* role to invite a user to join the workspace.

Let’s look at this REST API request **syntax**. All REST API calls to HPE GreenLake platform services are made by providing:

* The single unified domain endpoint (*https://global.api.greenlake.hpe.com*) defined in the baseURL variable, 
* The HTTP request method such as GET, POST, PUT/PATCH, or DELETE. In this example, the POST method is specified to create a new user instance in the workspace.
* The path (*API-group-name/API-Version/Workspace-Resources*). The path specifies the API group name (here identity), the version of the API (here v1), and the resource path in the workspace (here users).
* A data payload when using a method that involves changing (PUT/PATCH) or creating (POST) an object instance. In this example, as the method involves creating a user instance in the workspace, the data payload (the Body) specifies the e-mail user address, and a welcome email is sent to the user to invite the user to join the workspace.

To get started, I hit the **Send** button and I get a ***201 Created*** response indicating that the user has been successfully invited. The user then receives an email to confirm and accept the invitation. The user will then be invited to create and activate an HPE account to join the workspace.  Users who are invited are not **verified** users until they accept the email confirmation. 

I can then verify the user has joined the workspace by using the GET REST API call ***Get invited users by Username*** below: 

`GET {{baseUrl}}/identity/v1/users?filter=username eq '<user’s email address>'`

![Figure 2: Checking the status of the invited user in the workspace](/img/blog-part2-get-invited-user-image2.png "Figure 2: Checking the status of the invited user in the workspace")

> > <span style="color:grey; font-family:Arial; font-size:1em"> Figure 2: Checking the status of the invited user in the workspace</span>

The REST API call syntax is the same as the previous API request, but here a **GET** method is used to list the users in the workspace. 

One or more **query parameters** indicated after the question mark (“**?**”) in the URL can be used to filter the data that an API request returns. Typical query parameters are:

* **filter:** filter the set of resources returned based on the criteria specified in the filter query parameter 
* **limit:** maximum number of records to return 
* **offset:** resource offset to start the response from

In this example, I use ***filter*** as the query parameter to limit the scope of the output of the call to just the invited user’s email specified in the filter query parameter.

I now hit the **Send** button. The request indicates success (***Status: 200 OK***). In the response, a *userStatus* of *VERIFIED* means that the user has activated the HPE account and joined the workspace. A user who has already activated their HPE account will automatically be added to the workspace upon invitation. A *userStatus* of *UNVERIFIED* would mean that the user has not created and activated the HPE account yet.  

> **Note:** Thanks to the Postman *Post-response Script* associated with this request, the unique identifier of the invited user is automatically saved as collection variable. The identifier of the user is needed should an administrator want to disassociate (delete) a user from the workspace using the REST API call ***DELETE Disassociate a user***.

## Managing IT resources (devices and subscriptions) into the workspace

A typical scenario to manage infrastructure resources from the HPE GreenLake platform would be where one would:

1. Add an infrastructure device and a subscription key for this device to the workspace. In this scenario, I will add an HPE Aruba Access Point and associated subscription key to the inventory of the workspace. 
2. Attach the device to a service to manage and operate the device. In this scenario, I will assign the HPE Aruba Access Point to the HPE Aruba Networking Central service already deployed in the workspace. The HPE Aruba Networking Central service is a SaaS-based User Interface that lets customers manage their fleet of networking equipment from edge-to-cloud from a single web interface.
3. Assign a subscription key to the device. A subscription key is a license key needed to activate the device and allows the IT administrator to use and operate it using the appropriate service management console such as HPE Aruba Networking Central for networking devices, HPE GreenLake for Compute Ops Management for compute servers, and Data Services Cloud Console for storage arrays.
4. Remove assignment of a service or a subscription for a device.

### Adding a device and subscription

Here I am going to use the REST API calls from the Postman collection folder: ***Configuring and Managing GLP Workspace/Step4-Service Catalog, Devices and Subscriptions***.

The **POST** REST API call ***Add devices - Aruba Access Point with Tag*** from ***/devices/v1beta1/devices*** subfolder allows me to add an HPE Aruba Networking device to the inventory in the workspace by providing device details in the data payload (Body) of the request. The device information for HPE Aruba Networking equipment includes the *Serial Number* and the *MAC address*. 

Optionally I can assign a “**tag**” to the device while adding it to the inventory. Tags are *name-value* pairs that can be very useful for identifying and categorizing groups of resources. In the example below, the tag’s name is “*Location*”, and the value is “*Lab Building 2*”.

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
               "Location": "Lab Building 2"
             }
        }
    ]
}
```

The “**Add devices**” API call is an asynchronous operation. Asynchronous operations are API operations that cannot be completed immediately. The response of the request indicates ***Status: 202 Accepted*** and contains the _transaction Id_ of the asynchronous operation that I can use as a Path variable in the subsequent **GET** API call ***Get progress or status of async operations in devices*** to verify whether the asynchronous operation is successful or not:

`GET {{baseUrl}}/devices/v1beta1/async-operations/:id`

![Figure 3: Checking status of asynchronous operation for adding devices](/img/blog-part2-adding-device-async-operation-image5.png "Figure 3: Checking status of asynchronous operation for adding devices")

> > <span style="color:grey; font-family:Arial; font-size:1em"> Figure 3: Checking the status of the asynchronous operation for adding devices</span>

A similar sequence of REST API calls can be used to add a subscription key in the workspace inventory and verify the status of the asynchronous operation. The **POST** REST API call ***Add subscriptions key for AP device*** derived from the API call ***POST Add subscriptions*** from ***/subscriptions/v1beta1*** subfolder allows me to add a subscription for HPE Aruba Networking devices to the inventory in the workspace by providing the *subscription key* in the data payload (Body) of the request. The API call is an asynchronous operation.

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

The GET API call ***Get progress or status of async operations in subscriptions*** is used to verify status of the asynchronous operation:

`GET {{baseUrl}}/subscriptions/v1beta1/async-operations/:id`

I can now use the two subsequent REST API calls below to fetch detailed information about the device and the subscription key I have just added to the inventory: 

* The ***Get devices managed in a workspace*** API call allows me to obtain detailed information about the device by specifying the *SerialNumber* of the device in the filter query parameter. This request will allow me to save the unique identifier of the device as a collection variable.
* Similarly, the ***Get subscriptions of a workspace*** API call allows me to get detailed information about the *subscription key* and fetch the unique identifier of the subscription key as collection variable. 

`GET {{baseUrl}}/devices/v1beta1/devices?filter=serialNumber eq '<SerialNumber>'` 

`GET {{baseUrl}}/subscriptions/v1alpha1/subscriptions?filter=key eq '<SubcriptionKey>'`

> **Note:** I will need the *identifier* of the device to attach the device to a regional instance of a service management console. I will also need the *identifier* of the subscription key to assign the subscription key to the device as explained in the next step.

### Assigning the device to a regional instance of a service

Next, using the **PATCH** ***Update devices - Assign Application to a device*** REST API request (derived from the ***PATCH Update devices API call***), I can attach the device to a regional instance of the HPE Aruba Networking Central management console service already deployed in the workspace. The identifier of the device is specified as a query parameter, the HPE Aruba Networking Central service *identifier* and *region* are specified in the data payload (Body) as shown below: 

`PATCH {{baseUrl}}/devices/v1beta1/devices?id={{DeviceId}}`

```json
{
  "application": {
    "id": "{{Aruba_Application_Id}}"
  },
  "region": "<region>"
}
```

![Figure 4: Assign device to a regional service instance](/img/blog-part2-assign-app-to-device-image6.png "Figure 4: Assign device to a regional service instance")

> > <span style="color:grey; font-family:Arial; font-size:1em"> Figure 4: Assign device to a regional instance of the HPE Aruba Networking Central service</span>

This API call is an asynchronous operation, and I can use the **GET** API call ***Get progress or status of async operations in devices*** to verify the status of the operation.

### Applying a subscription key to the device

Similarly, I can use the same REST API call to assign a subscription key to the device specifying the identifier of the device as the query parameter and the identifier of the subscription key in the data payload (Body):

`PATCH {{baseUrl}}/devices/v1beta1/devices?id={{DeviceId}}`

```json
{
  "subscription": [
    {
      "id": "{{SubscriptionKeyId}}"
    }
  ]
}
```

![Figure 5: Assign a subscription key to a device](/img/blog-part2-assign-subscriptionkey-to-device-image7.png "Figure 5: Assign a subscription key to a device")

> > <span style="color:grey; font-family:Arial; font-size:1em"> Figure 5: Assign a subscription key to a device</span>

This API call is an asynchronous operation, and I can use the **GET** API call ***Get progress or status of async operations in devices*** to verify the status of the operation.

### Removing assignment of service and subscription

During ongoing operations in the workspace, I may need to remove assignment of a service and a subscription for a particular device. I can use the **PATCH** REST API calls ***Update devices – Unassign Application for a Device*** and ***Update devices - Unassign Subscription Key for a device*** respectively.

To remove an assignment of a service for a device, leave the *application* field as empty value in the data payload as shown here: 

`PATCH {{baseUrl}}/devices/v1beta1/devices?id={{DeviceId}}`

```json
{
  "application": {
  }
}
```

To remove an assignment of a subscription key for a device, leave the *subscription* field as empty value in the data payload as shown here: 

`PATCH {{baseUrl}}/devices/v1beta1/devices?id={{DeviceId}}`

```json
{
  "subscription": [
  ]
}
```

## Summary

This blog post walks you through the APIs for common HPE GreenLake platform services **for a single-tenant workspace** environment from the perspective of an IT administrator. I took advantage of the [Postman collection](https://github.com/hpe-dev-incubator/GLP-API-Tooling/tree/main/Postman-Collections) to help you get started with these APIs, learn through examples the REST API call syntax for the API requests and how to **programmatically** configure and manage workspace resources such as users, users’ roles and infrastructure devices. 

To learn more about all the REST API calls for the platform, I invite you to refer to the [HPE GreenLake platform documentation](https://developer.greenlake.hpe.com/docs/greenlake/services/) for these APIs. You can get the Postman collection from the [HPE Developer Community tooling GitHub repository](https://github.com/hpe-dev-incubator/GLP-API-Tooling/tree/main/Postman-Collections).

In [the next part](https://developer.hpe.com/blog/get-started-with-the-foundational-apis-for-the-hpe-greenlake-edge-to-cloud-platform-%E2%80%93-part-3-tracking-activities-and-monitoring-health/) of this blog series, I will explore the set of APIs used for tracking activities and monitoring overall health of services and devices in the workspace.

If you’re interested in trying out what I just discussed, you might want to check out one of our hands-on Workshops-on-Demand that lets you play with the HPE GreenLake APIs mentioned in this blog post. The workshops are free, available 24/7, and very easy to use. They give you a real-world experience without any risk. Check out our [catalog of workshops](https://developer.hpe.com/hackshack/workshops), register for the one you’re interested in and go! It’s as simple as that. 

If you still have any questions regarding the HPE GreenLake platform APIs, join the [HPE Developer Community Slack Workspace](https://developer.hpe.com/slack-signup/) and start a discussion in our [\#hpe-greenlake-api](https://hpedev.slack.com/archives/C02EG5XFK8Q) channel. We’re always here to help.