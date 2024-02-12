---
title: Getting started with the HPE GreenLake Developer Portal
date: 2024-01-24T13:53:38.494Z
author: Frederic Passeron
authorimage: /img/frederic-passeron-hpedev-192.jpg
disable: false
tags:
  - " API,hpe-greenlake,hpe-greenlake-platform"
---
You know about the [HPE Developer Community portal](https://developer.hpe.com/) that provides an entry point to everything you need to know about HPE from a software developer and  IT Ops standpoint, including how to access APIs (application programming interfaces), SDKs (software development kits), and training. The HPE Developer Community portal covers a wide range of HPE products, from HPE OneView, iLO, and Cray to the HPE GreenLake platform. 

From the HPE Developer Community portal, you can access the HPE GreenLake-specific developer portal where you can find the API documentation along with some trial capabilities. 

When reaching the [HPE GreenLake Developer Portal](https://developer.greenlake.hpe.com/), you are presented with three tiles that allow you to make the best use of the portal.

![](/img/blog-greenlake-dev-portal1.png)

## Guides: Learn how to get started using the HPE GreenLake Developer Portal

The minimal requirement of being able to start using the portal is to have an HPE user account or an HPE GreenLake Account. To leverage the HPE GreenLake platform APIs, the user will need to obtain  API client credentials for the HPE GreenLake platform. With the API client credentials, the user will be able to create an access token.  

One cannot generate an access token without having an HPE account associated to a workspace. You will be guided through all the different steps to create the account either through the HPE GreenLake developer portal or through the HPE GreenLake portal. 



It is important to note that some content on the portal is private or only visible to a restricted group (for example, partners or developers). W﻿ithin each group, several roles are identified and have specific privileges:  

 *Public* 

Guest: Every visitor will have this role with a single permission to read all public content on the portal. 

Authenticated-User: Every logged in user will have this role. 

*Partner* 

Users with the Partner role can access restricted content that is specific to a Partner.  

## Services:  Discover the HPE GreenLake platform APIs  

Clicking on the second tile (Services), provides you with access to the HPE GreenLake APIs. But, as mentioned previously, an API needs a token to be tested. Therefore, the very first step described in the documentation n API [here](https://developer.greenlake.hpe.com/docs/greenlake/guides/#generate-or-reset-application-credentials) is to create API client credentials for the HPE GreenLake platform and generate an access token. 

![](/img/blog-greenlake-dev-portal2.png)

Once you have your token, you can try the different APIs that are related to the different services listed on the left-hand side of the page.  

[The HPE GreenLake audit log service](https://developer.greenlake.hpe.com/docs/greenlake/services/audit-logs/public/), for instance, will offer a collection of RESTful APIs for publishing audit logs, managing configurations, and retrieving application-specific and overall platform logs.

Each service section offers, at a minimum, an overview, a guide, the Open API specification, and the associated API reference documentation. Some services provide additional parts to dive into more specific's areas of the service. For instance, HPE GreenLake for Compute Ops Management service provide additional details about event webhooks and jobs. A webhook is an HTTP-based callback function that allows lightweight, event-driven communication between two APIs.  A job is a multi-step task that is managed by Compute Ops Management to perform an action on a resource. For example, performing power operations or firmware updates on a server. 

The Overview gives a definition of the service. The Guide explains the core details of the service from an API standpoint. Finally, the API reference documentation will provide you with a download link to the Open API specification file in JSON format of the API. This JSON file can be used in Postman, allowing you to build collection of REST API calls. In fact, the HPE Developer Community team has already put together a nice HPE GreenLake platform API collection. You can get the Postman collection from the [HPE Developer Community tooling GitHub repository](https://github.com/hpe-dev-incubator/GLP-API-Tooling/tree/main/Postman-Collections)

Finally, “la cerise sur le gateau” as we say in French, the try part. There you can make real API calls related to the selected service, bearing in mind that you have an HPE account, joined a workspace, and that you have generated the necessary API client credentials and access token. 

By simply clicking the Try it button, you can get access to the API. 

![](/img/blog-greenlake-dev-portal3.png)

Now, you can pass your first API call. Simply paste the token in the security window and hit the Send button. 

![](/img/blog-greenlake-dev-portal4.png)

As a result, a 200 status will inform you that the call was passed correctly, and the Headers window will display the result of the call. 

On the right-hand side of the windows, you will see that samples are being presented. You will find Curl, JavaScript, Node.js, Java, Python versions that you can copy / paste to test, allowing you to integrate them easily. 

![](/img/blog-greenlake-dev-portal5.png)

In addition, a Change Log section will inform you about the versioning of the API and changes related to it.

## HPE Developer Community

T﻿her third tile allows you to reach out to us,  \[the HPE Developer Community](https://developer.hpe.com/). Our web portal as mentionned in the introductionnary words of this blog, will help you find all things software at HPE.[Join us](https://developer.hpe.com/community) to collaborate and build applications and integrations with HPE products using the latest software and open source technologies.

The HPE GreenLake Developer Portal offers one last important feature: 

## **The search window:**

Rather than browsing through the page to look for a necessary piece of information, you can use the search box and get the result you need straight away. Let's say you would like to know about HPE GreenLake for Compute Ops Management' APIs. A quick search will present you with many relevant entries. 

![](/img/blog-greenlake-dev-portal6.png)

## Summary 

This blog post is intended to help you get started with the HPE GreenLake Developer Portal. Additional posts on the HPE GreenLake platform APIs have been produced by the HPE Developer Community team. There is [a three-part series](https://developer.hpe.com/blog/get-started-with-the-foundational-apis-for-the-hpe-greenlake-edge-to-cloud-platform-%E2%80%93-part-1-introduction-to-the-apis/) that takes you through the preparation steps you need  to use the APIs for common platform services and walks you through the steps required to obtain an OAuth access token to make secure REST API calls to the HPE GreenLake platform APIs. Then, you can dive into the Postman collection to learn how you, as an IT (Information Technology) administrator of the HPE GreenLake platform, can configure and manage workspace resources (users’ identity, devices, and subscriptions), and how you can track activities within your workspace to monitor the overall health of services and devices in your workspace. There is also a blog post about [HPE GreenLake edge-to-cloud platform scripting fundamentals](https://developer.hpe.com/blog/hpe-greenlake-edge-to-cloud-platform-scripting-fundamentals/) where you can learn about the HPE GreenLake platform APIs through simple coding examples leveraging bash, PowerShell, and Python.

Another way to experience these APIs is to check out one of our hands-on Workshops-on-Demand that lets you play with the HPE GreenLake APIs mentioned in this blog post. The workshops are free, available 24/7, and quite easy to use. They give you a real-world experience without any risk. Check out our [catalog of workshops](https://developer.hpe.com/hackshack/workshops), register for the one you are interested and go! It is as simple as that.  

If you still have any questions regarding the HPE GreenLake platform APIs, join the [HPE Developer Community Slack Workspace](https://developer.hpe.com/slack-signup/) and start a discussion in our [\#hpe-greenlake-api](https://hpedev.slack.com/archives/C02EG5XFK8Q) channel. We are always here to help.