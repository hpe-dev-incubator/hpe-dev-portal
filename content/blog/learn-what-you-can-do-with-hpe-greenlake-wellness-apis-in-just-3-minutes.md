---
title: Learn what you can do with HPE GreenLake Wellness APIs in just 3 minutes
date: 2024-05-15T12:34:15.920Z
author: Frederic Passeron
authorimage: /img/frederic-passeron-hpedev-192.jpg
disable: false
---


[HPE GreenLake Wellness APIs](https://developer.greenlake.hpe.com/docs/greenlake/services/wellness/public/) facilitate the automation of IT operations by enabling you to monitor wellness events related to your infrastructure. These APIs provide various filtering options and KPI metrics to streamline integration workflows further.

In this blog, I plan to introduce to you simple use cases that an IT Admin can leverage using the HPE GreenLake Wellness APIS.

As you know, one of the benefits of working within a community is the ability to take advantage of open collaboration, sharing hints, tools, and resources. This is exactly what I am doing here. This post helps you get started with the HPE GreenLake Wellness APIS taking advantage of the Postman collection contributed by one of our HPE Developer Community members. 

> **Note:** This blog post assumes you have created an [HPE GreenLake account](https://console.greenlake.hpe.com/) and joined your account to your company account (also called an ***organization***). You also got assigned appropriate roles and permissions by the administrator for your organization in order to access events(for example simple power outage events) through the HPE GreenLake Wellness APIs.



## The HPE GreenLake Wellness APIs

Gone are the days where I would recieve alerts from my HP Toptools or Systems Insight Manager server telling about a server being unreachable, or informing me about reccurent ECC errors on the memory bank 3 of my HP ProLiant DL360 G6 servers...Yes I am that old. Today, HPE GreenLake offers you also some monitoring capabilities for the devices that are present in your inventory through the HPE Wellness APIs and a dashboard.

> **Note:** You can find the Data Services Cloud Console API documentation [here](https://console-us1.data.cloud.hpe.com/doc/api/v1/) and in the help section of the [HPE GreenLake Cloud Platform](https://console.greenlake.hpe.com/).    

The REST APIs support standard HTTP request methods (GET, POST, PATCH, PUT and DELETE). A HTTP request is made by providing a specific HPE regional connectivity endpoint for the Data Service Cloud Service application instance, HTTP request method, access token and data payload. The HTTP response for these requests are returned in a JSON format.

Currently, there are three HPE regional Data Services Cloud Console application instance endpoints: 

* EU Central    

  * https://eu1.data.cloud.hpe.com   
* AP Northeast    

  * https://jp1.data.cloud.hpe.com    
* US West    

  * https://us1.data.cloud.hpe.com