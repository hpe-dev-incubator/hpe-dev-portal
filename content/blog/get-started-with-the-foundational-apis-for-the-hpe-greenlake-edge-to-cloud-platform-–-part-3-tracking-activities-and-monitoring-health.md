---
title: "Get started with the foundational APIs for the HPE GreenLake
  edge-to-cloud platform – Part 3: Tracking activities and monitoring health"
date: 2024-02-02T10:38:42.333Z
author: Denis Choukroun
authorimage: https://gravatar.com/avatar/f66dd9562c53567466149af06ae9d4f1?s=96
disable: false
tags:
  - hpe-greenlake
  - hpe-greenlake-platform
---
This is part three of a blog series that showcases the capabilities of the APIs for common HPE GreenLake platform services using a real customer scenario, displaying it from the perspective of a user of the platform, such as an IT administrator. 

Continuing on from the [second part of this series](https://developer.hpe.com/blog/get-started-with-the-foundational-apis-for-the-hpe-greenlake-edge-to-cloud-platform-%E2%80%93-part-2-configuring-and-managing-a-workspace/), where I had put on my IT administrator’s hat for a ***Standard Enterprise*** workspace, I will now explore the set of REST API calls used for tracking activities in the workspace and monitoring the overall health of HPE services and HPE products in the workspace.

## Tracking activities in the workspace
**Audit log** service records the occurrence of events emitted by users, any device or service in the workspace. These logs can be used for tracking user activities, doing root cause analysis of an incident, investigating breaches, and for auditing purposes.

Let’s assume that I have been notified of unusual activities in the workspace and I would like to act to begin an investigation and identify the root cause of the incident in the workspace. This involves an analysis of logs for the services and the platform in the workspace, and tracking activities for users. To conduct this analysis, I will use the set of audit log API calls from the Postman collection folder: ***Tracking GLP Workspace/Step5-audit-log/audit-log/v1beta1/logs***.

### Collecting service-specific logs and platform logs

The **GET** REST API request ***Get all audit logs of an application*** derived from the API call ***GET all audit logs of an application or user*** is used to get logs from a specific service in the workspace and platform logs in the workspace. I just need to specify the service identifier or the HPE GreenLake platform identifier to obtain the list of logs for a particular service or for the platform. In the example below, I specify the identifier of the HPE GreenLake platform and limit the output for activities that occurred after a certain date and time in UTC following the [ISO 8601 standard](https://en.wikipedia.org/wiki/ISO_8601):

`GET {{baseUrl}}/audit-log/v1beta1/logs?filter=application/id eq '{{GLP_Application_Id}}'&filter=createdAt ge '2023-12-10T11:00:00.00000Z'&limit=50&offset=0` 

![Figure 1: Audit logs for the HPE GreenLake platform in the workspace](/img/blog-part3-auditlog-application-specific-logs-image2.png "Figure 1: Audit logs for the HPE GreenLake platform in the workspace")

> > <span style="color:grey; font-family:Arial; font-size:1em"> Figure 1: Audit logs for the HPE GreenLake platform in the workspace</span>

### Tracking user-specific activities

The **GET** REST API call ***Get all audit logs of a user*** derived from the REST API call ***Get all audit logs of an application or user*** is used to track activities for a specific user in the workspace based on the criteria specified in the filter query parameters. In this example I limit the output for a particular user’s activities that occurred after a certain date and time in UTC following the [ISO 8601 standard](https://en.wikipedia.org/wiki/ISO_8601):

`GET {{baseUrl}}/audit-log/v1beta1/logs?filter=user/username eq '<UserEmail@example.com>'&filter=createdAt ge '2023-12-14T11:00:00.00000Z'&limit=300` 

> **Note:** You can specify additional query parameters to limit the scope of the output to a specific category of activities. For example, *User Management*, *Device Management*, or *Customer Management*.

![Figure 2: Tracking activities for a specific user](/img/blog-part3-auditlog-tracking-user-activities-image1.png "Figure 2: Tracking activities for a specific user")

> > <span style="color:grey; font-family:Arial; font-size:1em"> Figure 2: Tracking activities for a specific user</span>


### Monitoring health events for the workspace

The HPE GreenLake platform provides a **wellness** service to enable you to monitor the overall health of the managed services and devices in the workspace. The wellness service API provides programmatic access to view health events and insights about HPE services and HPE products in the workspace.

I will use the set of Wellness API calls from the Postman collection folder: ***Tracking GLP Workspace/Step6-Wellness/wellness/v2beta1/events***.

The **GET** REST API call ***Get list of wellness events*** is used to retrieve a list of health events for services (for example, Networking, Storage, Compute or HPE GreenLake platform services) and HPE device models in the workspace. In the example below, I use a set of query parameters to view health information for a specific device model, service and severity:

`GET {{baseUrl}}/wellness/v2beta1/events?filter=service in ('Storage')&filter=product in ('HPE Nimble Storage')&filter=severity eq 'warning'&limit=100` 

![Figure 3: Retrieve list of health events for a specific service, device model and severity](/img/blog-part3-list-wellness-events-for-service-product-severity-image3.png "Figure 3: Retrieve list of health events for a specific service, device model and severity")

> > <span style="color:grey; font-family:Arial; font-size:1em"> Figure 3:Retrieve list of health events for a specific service, device model and severity</span>

To view information about a specific event ID, I can use the REST API request ***Get Event with specific event ID*** by specifying the event ID as a Path variable in the parameters of the API call:

`GET {{baseUrl}}/wellness/v2beta1/events/:id`


![Figure 4: View information for a specific event ID](/img/blog-part3-view-wellness-event-for-specific-event-id-image4.png "Figure 4: View information for a specific event ID")

> > <span style="color:grey; font-family:Arial; font-size:1em"> Figure 4: View information for a specific event ID</span>

## Summary

This blog series walks you through the APIs for common HPE GreenLake platform services **for a single-tenant workspace** environment from the perspective of an IT administrator. I took advantage of the Postman collection available on the [HPE Developer Community tooling GitHub repository](https://github.com/hpe-dev-incubator/GLP-API-Tooling/tree/main/Postman-Collections) to help you get started with these APIs, learn the REST API call syntax for the API requests through the use of examples, how to **programmatically** configure and manage workspace resources such as users and infrastructure devices, and how to track activities and monitor health events for the workspace. 

To learn more about all the REST API calls for the platform, I invite you to refer to the [HPE GreenLake platform documentation](https://developer.greenlake.hpe.com/docs/greenlake/services/) for these APIs. The documentation leverages OpenAPI specifications and associated reference documentation for these API services. It provides a complete explanation of the operations supported by these APIs for common HPE GreenLake platform services, as well as sample requests and responses.

If you’re interested in trying out what I just discussed, you might want to check out one of our hands-on Workshops-on-Demand that lets you play with the HPE GreenLake APIs mentioned in this blog series. The workshops are free, available 24/7, and very easy to use. They give you a real-world experience without any risk. Check out our [catalog of workshops](https://developer.hpe.com/hackshack/workshops), register for the one you’re interested in and go! It’s as simple as that. 

If you still have any questions regarding the HPE GreenLake platform APIs, join the [HPE Developer Community Slack Workspace](https://developer.hpe.com/slack-signup/) and start a discussion in our [\#hpe-greenlake-api](https://hpedev.slack.com/archives/C02EG5XFK8Q) channel. We’re always here to help.