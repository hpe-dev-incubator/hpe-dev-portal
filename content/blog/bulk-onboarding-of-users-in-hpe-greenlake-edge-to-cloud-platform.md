---
title: Bulk onboarding of users in HPE GreenLake edge-to-cloud platform
date: 2024-04-24T13:44:40.533Z
author: Didier Lalli
authorimage: /img/didier-lalli.png
disable: false
---
## HPE GreenLake API to the rescue

The use case covered in this document is part of what we call the Day 0 task list, i.e. things that must be done to onboard users in the HPE GreenLake platform. When a customer decides to use HPE GreenLake, it is critical that all customer collaborators who require access the HPE GreenLake platform are invited to join. When there are hundreds of collaborators to invite, using the HPE GreenLake console is too tedious, and error prone to be the appropriate solution. This is when an API comes to the rescue, as it allows you to write a script that reads a list of users from an Excel spreadsheet and automatically invites these users to access the HPE GreenLake platform.

## What are the HPE GreenLake edge-to-cloud platform APIs 

The foundational APIs for common HPE GreenLake platform services allow IT administrators and IT operators to programmatically operate and manage users and resources in an HPE GreenLake platform workspace.   

This set of APIs for common platform services includes APIs for workspace management, identity and access management, device and subscription, locations, audit logs, and wellness.  

*Note: The [HPE GreenLake platform documentation](https://developer.greenlake.hpe.com/docs/greenlake/services/) for these APIs leverages OpenAPI specifications and associated reference material. The documentation provides a complete explanation of the operations supported by these APIs for common HPE GreenLake platform services, as well as sample requests and responses.*  

The following blog posts are an excellent way to learn more about the APIs using Postman:

* [Get started with the foundational APIs for the HPE GreenLake edge-to-cloud platform – Part 1: Introduction to the APIs](https://developer.hpe.com/blog/get-started-with-the-foundational-apis-for-the-hpe-greenlake-edge-to-cloud-platform-%E2%80%93-part-1-introduction-to-the-apis/)
* [Get started with the foundational APIs for the HPE GreenLake edge-to-cloud platform – Part 2: Configuring and managing a workspace](https://developer.hpe.com/blog/get-started-with-the-foundational-apis-for-the-hpe-greenlake-edge-to-cloud-platform-%E2%80%93-part-2-configuring-and-managing-a-workspace/)
* [Get started with the foundational APIs for the HPE GreenLake edge-to-cloud platform – Part 3: Tracking activities and monitoring health](https://developer.hpe.com/blog/get-started-with-the-foundational-apis-for-the-hpe-greenlake-edge-to-cloud-platform-%E2%80%93-part-3-tracking-activities-and-monitoring-health/)