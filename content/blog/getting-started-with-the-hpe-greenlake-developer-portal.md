---
title: Getting started with the HPE GreenLake Developer Portal
date: 2024-01-24T13:53:38.494Z
author: Frederic Passeron
authorimage: /img/frederic-passeron-hpedev-192.jpg
disable: false
---
# Getting started with the HPE GreenLake Developer Portal 

You know about the [HPE Developer Community portal](https://developer.hpe.com/) that provides an entry point to everything you need to know about HPE from a software developer and user standpoint, including how to access APIs (application programming interfaces), SDKs (software development kits), and training. The HPE Developer Community portal covers a wide range of HPE products, from HPE OneView, iLO, and Cray to the HPE GreenLake platform. 

From the HPE Developer Community portal, you can access the HPE GreenLake-specific developer portal where you can access the API documentation along with some trial capabilities. 


Once you have your token, you can try the different APIs that are related to the different services listed on the left-hand side of the page.  

The HPE GreenLake audit log service, for instance, will offer a collection of RESTful APIs for publishing audit logs, managing configurations, and retrieving application-specific and overall platform logs. 

Each service section offers, at a minimum, an overview, a guide, the Open API specification, and the associated API reference documentation. Some services provide additional parts to dive into more specific's areas of the service. For instance, HPE GreenLake for Compute Ops Management service provide additional details about event webhooks and jobs. A webhook is an HTTP-based callback function that allows lightweight, event-driven communication between two APIs.  A job is a multi-step task that is managed by Compute Ops Management to perform an action on a resource. For example, performing power operations or firmware updates on a server. 

The Overview gives a definition of the service. The Guide explains the core details of the service from an API standpoint. Finally, the API reference documentation will provide you with a download link to the Open API specification file in JSON format of the API. This JSON file can be used in Postman, allowing you to build collection of REST API calls. In fact, the HPE Developer Community team has already put together a nice HPE GreenLake platform API collection. You can get the Postman collection from the \[HPE Developer Community tooling GitHub repository] (https://github.com/hpe-dev-incubator/GLP-API-Tooling/tree/main/Postman-Collections). 

Finally, “la cerise sur le gateau” as we say in French, the try part. There you can make real API calls related to the selected service, bearing in mind that you have an HPE account, joined a workspace, and that you have generated the necessary API client credentials and access token. 

By simply clicking the Try it button, you can get access to the API. 

Summary 

This blog post is intended to help you get started with the HPE GreenLake Developer Portal. Additional posts on the HPE GreenLake platform APIs have been produced by the HPE Developer Community team. There is a three-part series that takes you through the preparation steps you need  to use the APIs for common platform services and walks you through the steps required to obtain an OAuth access token to make secure REST API calls to the HPE GreenLake platform APIs. Then, you can dive into the Postman collection to learn how you, as an IT (Information Technology) administrator of the HPE GreenLake platform, can configure and manage workspace resources (users’ identity, devices, and subscriptions), and how you can track activities within your workspace to monitor the overall health of services and devices in your workspace.  

Another way to experience these APIs is to check out one of our hands-on Workshops-on-Demand that lets you play with the HPE GreenLake APIs mentioned in this blog post. The workshops are free, available 24/7, and quite easy to use. They give you a real-world experience without any risk. Check out our \[catalog of workshops] (https://developer.hpe.com/hackshack/workshops), register for the one you are interested and go! It is as simple as that.  

If you still have any questions regarding the HPE GreenLake platform APIs, join the \[HPE Developer Community Slack Workspace] (https://developer.hpe.com/slack-signup/) and start a discussion in our \[#hpe-greenlake-api] (https://hpedev.slack.com/archives/C02EG5XFK8Q) channel. We are always here to help.