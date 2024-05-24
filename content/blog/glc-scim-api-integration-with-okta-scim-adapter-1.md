---
title: HPE GreenLake Flex Solutions SCIM API Integration with Okta SCIM Adapter
date: 2024-05-13T20:55:22.189Z
author: Namik Rujnic - Cloud Operations
authorimage: /img/Avatar1.svg
disable: false
tags:
  - hpe-greenlake-platform
  - sso
  - okta
  - Active Directory
  - hpe-greenlake
---
<style> li { font-size: 27px; line-height: 33px; max-width: none; } </style>

## Okta (SCIM) Adapter

You can synchronize users and groups from your Okta identity management service to HPE GreenLake Flex Solutions using the Okta System for Cross-domain Identity Management (SCIM) adapter. 
The Okta SCIM adapter application can be installed from the Okta Integration Network (OIN) into your Okta implementation to allow for integration with a SCIM-compliant API. Any user that needs to be synchronized to HPE GreenLake Flex Solutions must be assigned to the Okta SCIM adapter application in your Okta implementation. Groups whose memberships need to be synced to HPE GreenLake Flex Solutions must be added as a Push Group in the application. Users can be assigned to the application using the same groups that are synchronized to HPE GreenLake Flex Solutions.

# Configuring a SCIM application in Okta.
Step 1: In the Okta Admin Console, deploy an application from the app catalog. 
a. Go to Applications > Browse App Catalog.
b. In the search bar type SCIM 2.0, and find the app called: SCIM 2.0 Test App (OAuth Bearer Token)
c.   Select the app and then click Add Integration.
Step 2:  In the Add Scim2.0 Test App page, do the following:
a. Change the application label name if you want and make sure Automatically log in when user lands on login page is checked.

![](/img/scimgeneral.png)

Click **Next** the following page nothing needs to change so click **Done**.

* Step 3: After the application is created click on **Provisioning** tab > **Configure API Integration**, click on **Enable API Integration** box.
* SCIM 2.0 Base Url: https://sps.us1.greenlake-hpe.com/v1alpha1/scimproxy         
* Token: [link to create long-lived tokens for user provisioning](https://developer.hpe.com/blog/configuring-azure-ad-with-long-term-token-for-scim-provisiong/) **Step 2 & 3**
* **Uncheck** the box for Import Groups

After URL and Token are added test to make sure they are valid by clicking > **Test API** **Credentials** and **Save** if everything is correct should return the following message:

![](/img/scimtest.png)

* Step 4 a:  Under the **Provisioning** tab > **To App** section enable two settings

  1)**Create Users**                   2)**Deactivate Users**

![](/img/scim2app.png)

* Step 4 b: Here is a list of 6 attributes to keep and the rest can be discarded

![](/img/attributes.png)

The group will need to be assigned to the SCIM application under the application > **Assignments** tab and added to be part of the **Push Groups** tab.



**Assignments** tab:

![](/img/scim-group.png "Assignments tab")



**Push Groups** tab:

![](/img/scim-push.png "Push Groups tab:")

**Please note:**
***Adding group everyone to the SCIM application could have unintended side effects to all user(s).***

These are all of the steps required to configure SCIM 2.0 application.  A reminder that users will need to be part of a group that is assigned to the SCIM application and (that group) needs to be apart of push group. 
Now all configured groups can be pushed into HPE GreenLake Flex Solutions via the Okta SCIM Adapter.
