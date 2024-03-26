---
title: Configuring SSO for Aruba Central and HPE GreenLake using Okta
date: 2024-03-26T19:04:06.778Z
externalLink: ""
author: "Will Smith - Consulting Systems Engineer (ACEX #34)"
authorimage: /img/willsmith-sm.jpg
thumbnailimage: /img/gl-sso.jpg
disable: false
tags:
  - aruba-central
  - hpe-greenlake-cloud-platform
  - sso
  - okta
  - aruba
  - hpe-greenlake
---
Aruba Central has gone GREEN…GreenLake that is! Aruba Central has recently been integrated into the HPE GreenLake Cloud Platform (GLCP). This provides IT administrators with the ability to view and orchestrate critical network services, such as Wired, Wireless and SD-Branch, through the same dashboard as their compute and storage infrastructure. GLCP also supports Single Sign On (SSO) which helps simplify account management.

If you are new to Aruba Central and are looking to enable SSO, this guide is for you. It will walk you through the process of configuring SSO for HPE GreenLake and Aruba Central using Okta.

### Before starting

Please review the [HPE GreenLake](https://support.hpe.com/hpesc/public/docDisplay?docId=a00120892en_us) User Guide to understand how the SAML framework works in the context of Common Cloud Services for the Aruba Central application.

### Configure SSO/SAML applications in Okta

To configure application metadata in Okta, complete the following steps:

* Step 1: Create an Okta SAML application
* Step 2: Configure Sign On settings
* Step 3: Export the SAML 2.0 IdP metadata
* Step 4: Configure the SAML connection in HPE GreenLake

**Step 1: Create an Okta SAML application**

1. Log in to the Okta administration console.
2. Click **Applications > Create new app integration.** The Create a new app integration window opens.
3. Select SAML 2.0 and click **Next**.

![](/img/ws-image0.png)

Provide a name for the Aruba GreenLake SSO service (Okta application)

![](/img/ws-image1.png)

**Step 2: How to configure Single Sign On settings**

1. Enter the SAML information.

   Under General:

    **Single Sign on URL:** https://sso.common.cloud.hpe.com/sp/ACS.saml2

    **Audience URI (SP Entity ID):** https://sso.common.cloud.hpe.com

    **Name ID format EmailAddress**

    **Application username Email**

    **NameID = user.email**

    **gl\_first\_name = user.FirstName**

    **gl\_last\_name = user.LastName**

    **hpe\_ccs\_attribute = (See Below)**

   See here for IdP attribute details: <https://support.hpe.com/hpesc/public/docDisplay?docId=a00120892en_us>

   As part of the HPE GreenLake cloud platform integration, one of the additional features that was added is the Role Based Access Controls for Aruba Central and all other apps on the platform. A new SAML attribute has been added “hpe\_ccs\_attribute” which tells HPE GreenLake and Central the exact role/permissions for each user. The following describes how to format the attribute.

![](/img/ws-image2.png)

![](/img/ws-image3.png)

![](/img/ws-image17.png)

![](/img/ws-image5.png)

The **hpe\__ccs\__attribute** always starts with version_1#. You must first configure the attributes for HPE GreenLake CSS, and then Central. To do so, enter the PCID for the account, followed by the HPE GreenLake application ID. This will always be **00000000-0000-0000-0000-000000000000**. Following this, enter the role name and **ALL\_SCOPES**. Next, enter in the Aruba Central information. Start with the **app cid**, followed by the role name (i.e. Aruba Central Administrator), and then **ALL\_SCOPES**.

Example:

**version_1#5b0ec0e8c4f422eca232ba72799953ac:00000000-0000-0000-0000-000000000000:Account Administrator:ALL\_SCOPES:683da368-66cb-4ee7-90a9-ec1964768092:**

**Aruba Central Administrator:ALL\_SCOPES**

If you want to add additional HPE GreenLake applications, or if you have multiple Aruba Central accounts, you can add them as well. Just follow the same syntax as before. Once you have the attribute defined, enter it into the SAML attribute statement in Okta as shown below.

![](/img/ws-image6.png)

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

**Step 4: Create SAML Authorization Profile in HPE GreenLake Cloud Platform**

1. Log into HPE GreenLake and click Menu > Manage > Authentication and Click Set Up SAML Connection.

   *Before you can add a new SAML configuration, you must have at least one user account with that domain already enabled in HPE GreenLake. Also, you must be logged into HPE GreenLake with an account from that domain in order to enable SSO for it.*

   ![](/img/ws-image10.png)
2. Type in the domain you want to enable SSO on:

   ![](/img/ws-image11.png)
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

![](/img/ws-image16.png)

Enter the SSO credentials. You will be redirected to Okta to authenticate. Once you successfully authenticate, you will be redirected back to HPE GreenLake. You can then click on the Aruba Central application and be given access based on the configured role/permissions.

**Additional notes:**

* There must be at least **one** verified user belonging to the **Domain** prior to configuration.    
* In order to configure SSO, you must be logged into HPE GreenLake with a user from the domain.    
* SSO user access is determined by the “role_name” attribute included in the SAML hpe\_ccs\_attribute provided by the IdP.    
* SSO users can initiate a Single Sign On request by trying to log into Aruba Central (SP-initiated login).     
* For more troubleshooting: <https://support.hpe.com/hpesc/public/docDisplay?docId=a00120892en_us>