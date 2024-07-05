---
title: SCIM Integration with Microsoft Entra ID
date: 2024-07-05T15:32:58.348Z
priority: 9
author: Prabhu Murthy
authorimage: /img/Avatar1.svg
disable: false
tags:
  - hpe-greenlake-for-private-cloud-enterprise, SCIM
---
Microsoft Entra ID (Azure AD) is Microsoft's cloud-based identity and access management service, designed to simplify user authentication and authorization across various applications and platforms. It offers a centralized solution for managing user identities, enforcing security policies, and facilitating seamless access to cloud-based resources. Azure AD automatic user provisioning simplifies the creation, maintenance, and removal of user identities in SaaS applications based on business rules.

The Azure AD provisioning service provisions users to the HPE GreenLake portal by connecting to the user management API endpoints provided by HPE GreenLake Identity and Access Management (IAM). These user management API endpoints allow Azure AD to programmatically create, update, and remove users and groups. The Azure AD provisioning service uses an HPE GreenLake tenant API token to provision users and groups to the HPE GreenLake IAM.  The HPE tenant API tokens are only valid for fifteen minutes. Because Azure AD cannot automatically renew the token, long-term tokens are required.

I﻿n this blog post, I'll explain the process for configuring Azure AD to use a long-term token for user and group provisioning.

## S﻿teps to configure long-term tokens in Microsoft Entra ID (Azure AD)

1. A﻿pply the System for Cross-domain Identity Management (SCIM) proxy token contributor role to IAM user/group
2. G﻿et a personal access token
3. C﻿reate a SCIM proxy token
4. U﻿pdate the SCIM proxy token and the tenant URL in Azure AD Enterprise Application
5. User/Group Provisioning

## S﻿tep 1: Apply System for Cross-domain Identity Management (SCIM) proxy token contributor role to IAM user/group

A﻿ssign "SCIM Proxy Token Contributor" role to the user or user group that will create the long-term token

* L﻿og in to the HPE GreenLake Flex Solutions.
* C﻿lick the "User Management" icon on the top-right corner.
* S﻿elect the user/user group that will generate the SCIM proxy token.
* S﻿elect "Actions" and then "Create Assignment".
* S﻿elect "SCIM Proxy Token Contributor" role.
* S﻿elect "All Resources"  space and "greenlake.service.system" scope.
* E﻿nable "I confirm that I want to create the assignments listed above".
* C﻿lick "Create Assignment" button.

**N﻿ote**: This must be applied by an HPE engineer who has HPE GreenLake IAM owner permissions.

## S﻿tep 2: G﻿et a personal access token

An API token issued by the HPE GreenLake Flex Solutions platform must be used as the Bearer token in the Authorization header of HPE GreenLake Flex Solutions REST API requests. Perform the following steps to get API access token from HPE GreenLake Flex Solutions portal:

* Log into HPE GreenLake Flex Solutions.
* Click the profile icon on the top-right corner.
* Select API Access.
* Copy the API access token.
* Save it for use with curl or an other REST API client.
* For example: export BEARER_TOKEN=<paste token value>

**N﻿ote**: This token is valid for 15 minutes after generation.

## S﻿tep 3: Create a SCIM proxy token

A SCIM Proxy Token is required for the SCIM integration to work. Run the following curl command to generate the SCIM Proxy token:

`curl -H "Authorization: bearer $BEARER_TOKEN" -X POST https://sps.us1.greenlake-hpe.com/v1alpha1/proxytoken`

**N﻿ote**: This step must be performed once during the initial setup and every time a token is deleted.

## S﻿tep 4: Update the SCIM proxy token and the tenant URL in Azure AD Enterprise Application

The generated SCIM Proxy Token should be copied and applied in the Azure AD Enterprise Application.

*  In Azure AD, go to the “Enterprise applications”.
*  Click the “SSO-Integration” application.
*  Click the “Provisioning” on the left navigation window.
*  Click the “Edit provisioning.
*  Click the “Admin Credentials”.
*  Update the generated token in the “Secret Token” field.
*  Update the URL https://sps.us1.greenlake-hpe.com/v1alpha1/scimproxy in the “Tenant URL” field.

![](/img/scim-page2.png)

## S﻿tep 5: User/Group Provisioning

For provisioning the user/group to HPE Greenlake Platform, Edit the attribute mapping tab:

![](/img/scim-page1.png "Application provisioning in Azure AD")

Attribute Mapping of User

Note: Update of user profile is not supported at this point

![](/img/scim-page3.png "Attribute Mapping of user")

Attribute Mapping of Group

![](/img/scim-page4.png "Attribute Mapping of Group")

Save the configuration and enable the provisioning status from "OFF" to "ON"

![](/img/scim-page6.png "Enabling the Provisioning status to \"ON\"")

Assign the Azure AD group to the Enterprise application

Note: This is very important to give access to the groups and users before provisioning the groups and users 

![](/img/scim-page5.png "Assign the Azure AD group to the Enterprise application")

All set to Provisioning the groups/users, 

* Click Start Provisioning to start 
* Click Stop Provisioning to stop
* Click View Provisioning logs to view the failures

![](/img/scim-page7.png)

Verify the users and groups are pushed to HPE GreenLake portal

U﻿sers can rotate a long-lived token before its expiration date using the following API:

﻿`curl -H "Authorization: bearer $BEARER_TOKEN" -X POST https://sps.us1.greenlake-hpe.com/v1alpha1/proxytoken/rotate?remove-current=true`

When the "remove_current" flag is enabled, it replaces the current token with a new one. During this process, there might be a temporary disruption in user and group provisioning, which will automatically resolve itself in the subsequent provisioning cycle. Alternatively, if the "remove_current" flag is disabled, the current token is replaced only after the new token takes effect, ensuring uninterrupted user experience without any provisioning failures.

I hope this blog post answers any questions you may have regarding configuration of SCIM with HPE GreenLake Platform. Please return to the HPE Developer Community blog for more tips and tricks on working with the HPE GreenLake platform.