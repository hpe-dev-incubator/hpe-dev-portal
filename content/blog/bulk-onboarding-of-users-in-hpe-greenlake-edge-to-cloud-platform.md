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

In this blog post, I will focus on one specific API call, part of Identity Management. The call is a `POST /identity/v1/users`, which invites users to an HPE GreenLake workspace. Full documentation on this API call can be found in the [HPE GreenLake developer portal](https://developer.greenlake.hpe.com/docs/greenlake/services/iam/workspaces/public/openapi/workspaces-v1/operation/invite_user_to_account_identity_v1_users_post/).

## Providing the right data to the script

Before writing any code, it’s important to understand what data is required to invite a user. According to the [API reference](https://developer.greenlake.hpe.com/docs/greenlake/services/iam/workspaces/public/openapi/workspaces-v1/operation/invite_user_to_account_identity_v1_users_post/), one simply needs the email address of the invited user. That’s easy! In the documentation, you can also see that there is no way to select a workspace to invite the user to. The reason for this is that the API credentials used to make the call is workspace specific, so it implicitly provides the workspace to which the user will be invited to. This means that one needs to collect API access credentials for every workspace that to the users are added to. For the script I am writing here, in a Workspace tab, I have stored the Client Id corresponding to API Access of a given Workspace. Because I don’t want to save Client Secrets, I will prompt for them and store them in memory.

So, my workspace contains the following 2 sheets: