---
title: Configuring Okta AD as the SAML IDP with HPE Greenlake Central (Private
  Cloud Enterprise) and HPE GreenLake (GLP) using Okta
date: 2023-11-27T16:04:10.145Z
featuredBlog: false
externalLink: ""
author: Prabhu Murthy - Cloud Operations
authorimage: /img/Avatar1.svg
thumbnailimage: /img/hpe-greenlake-sso-page.jpg
disable: false
tags:
  - HPE Greenlake Central (Private Cloud Enterprise)
  - hpe-greenlake-cloud-platform
  - sso
  - okta
  - Private Cloud Enterprise
  - hpe-greenlake
---
HPE Greenlake Central for Private Cloud Enterprise has been integrated into the HPE GreenLake Cloud Platform (GLCP).  GLCP supports Single Sign On (SSO) 

Many enterprises today are looking to implement a single-sign on (SSO) solution that enables their users to easily access all of their cloud and web applications. A key requirement of these solutions is Active Directory integration, which makes it possible to connect cloud applications back to a single source of truth, Active Directory.

I will walk you through the process of configuring Okta AD to authenticate users into the HPE GreenLake Cloud Platform (HPE GLCP) and HPE GreenLake for Private Cloud Enterprise application using SAML IDP.

### Before starting

Please review the [HPE GreenLake](https://support.hpe.com/hpesc/public/docDisplay?docId=a00120892en_us&page=GUID-D7192971-EF71-4304-B51E-548E7954E644.html) User Guide to understand how the SAML framework works in the context of Common Cloud Services for the HPE GreenLake Cloud Platform for HPE Greenlake Central (Private Cloud Enterprise) application.

### Configure SSO/SAML applications in Okta

To configure application metadata in Okta, complete the following steps:

* Step 1: Create an Okta SAML application
* Step 2: Configure Sign On settings
* Step 3: Export the SAML 2.0 IdP metadata
* Step 4: Configure the SAML connection in HPE GreenLake Cloud Platform

**Step 1: Create an Okta SAML application**

1. Log in to the Okta administration console.
2. Click **Applications > Create new app integration.** The Create a new app integration window opens.
3. Select SAML 2.0 and click **Next**.

![](/img/ws-image0.png)

Provide a name for the HPE Greenlake Central (Private Cloud Enterprise) application SSO service (Okta application)

![](/img/ws-image1.png)

**Step 2: How to configure Single Sign On settings**

1. Enter the SAML information.

   Under General:

    **Single Sign on URL:** https://sso.common.cloud.hpe.com/sp/ACS.saml2

    **Audience URI (SP Entity ID):** https://sso.common.cloud.hpe.com

    **Name ID format EmailAddress**

    **Application username Email**

    **NameID = user.email**

    **gl_first_name = user.FirstName**

    **gl_last_name = user.LastName**

    **hpe_ccs_attribute = (See Below)**

   See here for IdP attribute details: <https://support.hpe.com/hpesc/public/docDisplay?docId=a00120892en_us>

   A new SAML attribute has been added “hpe_ccs_attribute” which tells HPE GreenLake and HPE Greenlake Central (Private Cloud Enterprise) the exact role/permissions for each user. The following describes how to format the attribute.

   Format: {version}#{pcid}:{app id}:{role_name}:{ALL_SCOPES}

![](/img/hpe-greenlake-saml-attributes.jpg)

![](/img/workspace-pcid.jpg)

![](/img/glp_role_name.jpg)

The **hpe_ccs_attribute** always starts with version*1#. You must first configure the attributes for HPE GreenLake and To do so, enter the PCID for the account, followed by the HPE GreenLake application ID. This will always be **00000000-0000-0000-0000-000000000000**. Following this, enter the role name and ALL*SCOPES**.** 

Example:

version_1#7ede5c36b7b911edacf45a78eb8b07d1:00000000-0000-0000-0000-000000000000:Observer:ALL_SCOPES

![](/img/saml_settings.jpg)

2﻿. Complete the setup.

![](/img/ws-image7.png)

Click Next and Select “Internal App”, then Finish.

**Step 3:** **Export the SAML 2.0 IdP metadata**

1. Click Next – Configure the Sign On settings

   You will find two options are available: **View Setup Instructions** which steps you through the SAML configuration and **Identity Provider metadata**, which will produce an XML file that can be loaded into Aruba Central.

   Suggestion: Click **Identity Provider metadata** and save the XML data to a file.

   ![](/img/ws-image9.png)
2. C﻿lick Next.       
3. Select Internal app, and Click Finish.    

   **Step 3.1 :  Access to the SAML application and HPE Greenlake is determined by assigning only those members or group to the SAML application.**

![](/img/customer-user-assignment-to-saml.jpg)

**Step 4: Create SAML Authorization Profile in HPE GreenLake Cloud Platform**

1. Log into HPE GreenLake and click Menu > Manage > Authentication and Click Set Up SAML Connection.

   *Before you can add a new SAML configuration, you must have at least one user account with that domain already enabled in HPE GreenLake. Also, you must be logged into HPE GreenLake with an account from that domain in order to enable SSO for it.*

   ![](/img/ws-image10.png)
2. Type in the domain you want to enable SSO on:

   ![](/img/glp_domain.jpg)
3. Input the metadata from the step above.

   While HPE GreenLake does support entering this information manually, it's recommended that you simply upload the XML metadata that was downloaded in the previous step. To do so, Select Metadata File, selecting the XML file. Then, click Next.

   ![](/img/ws-image12.png)
4. Enter the SAML attributes to match what was entered in Okta. Set the idle timeout value as well.

   ![](/img/ws-image13.png)
5. Then click Next.    
6. Create a recover user so that, in the event SSO fails, an admin will still be able to access the HPE GreenLake portal.    

   ![](/img/ws-image14.png)

   Congratulations! SSO will now be enabled for HPE GreenLake as well as the Aruba Central application. Log out and on the HPE GreenLake home page, click **Sign in with SSO**.

**Testing and troubleshooting:**

On the HPE GreenLake Cloud Platform home page, click **Sign In with SSO**.

![](/img/ws-image15.png)

![](/img/hpe-greenlake-sso-page.jpg)

Enter the SSO credentials. You will be redirected to Okta to authenticate. Once you successfully authenticate, you will be redirected back to HPE GreenLake. You can then click on the Aruba Central application and be given access based on the configured role/permissions.

**Additional notes:**

* There must be at least **one** verified user belonging to the **Domain** prior to configuration.    
* In order to configure SSO, you must be logged into HPE GreenLake with a user from the domain.    
* SSO user access is determined by the “role_name” attribute included in the SAML hpe_ccs_attribute provided by the IdP.    
* SSO users can initiate a Single Sign On request by trying to log into Aruba Central (SP-initiated login).     
* For more troubleshooting: <https://support.hpe.com/hpesc/public/docDisplay?docId=a00120892en_us>

  Customer users should be given access to SAML application.

  After authentication when clicking the **HPE GreenLake for Private Cloud Enterprise application**, if it leads to the below error

  * **it will take 1 hr to sync, if not customer should contact HPE administrator.** 

![](/img/user_sync.jpg)