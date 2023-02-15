---
title: Configuring Okta SSO for Aruba Central and the HPE GreenLake Cloud Platform
date: 2023-02-14T20:11:58.846Z
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
---
Aruba Central has gone GREEN…GreenLake that is! If you’re reading this, then you’ve likely heard that Aruba Central is now integrated into the new HPE GreenLake Common Cloud Platform (GLCP). This allows IT admins to view and orchestrate critical network services such as Wired, Wireless and SD-Branch, through the same dashboard as their compute and storage infrastructure.

If you are new to Aruba Central and are looking to enable SSO, this guide is for you. This will walk you through the process of configuring SSO for GreenLake and Aruba Central using Okta.

### Before you Begin

Please review the [GreenLake](https://support.hpe.com/hpesc/public/docDisplay?docId=a00120892en_us) User Guide to understand how the SAML framework works in the context of Common Cloud Services for the Aruba Central application.

### Steps to Configure SSO/SAML Application in Okta

To configure application metadata in Okta, complete the following steps:

* Step 1: Create an Okta SAML application
* Step 2: Configure Sign On settings
* Step 3: Export the SAML 2.0 IdP metadata
* Step 4: Configure the SAML connection in GreenLake

**Step 1: Create an Okta SAML Application**

1. Log in to the Okta administration console.
2. Click **Applications > Create App Integration.** The Create a new app integration window opens.
3. Select SAML 2.0 and click Next.

![](/img/ws-image0.png)

Provide a name for the Aruba GreenLake SSO service (Okta Application)

![](/img/ws-image1.png)

**Step 2: Configure Single Sign On settings**

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

   One of the additional features added as part of the GreenLake platform is Role Based Access Controls (RBAC) for Aruba Central and all other apps in GLCP. A new SAML attribute has been added “hpe_ccs_attribute” which tells GreenLake and Central the exact role/permissions for each user. The following describes how to format the attribute.

![](/img/ws-image2.png)

![](/img/ws-image3.png)

![](/img/ws-image4.png)

![](/img/ws-image5.png)

The **hpe\_ccs\_attribute** will always start with **version_1#**. First, we’ll configure the attributes for GreenLake CCS, then Central. First enter the PCID for the account, followed by the GreenLake application ID. This will always be **00000000-0000-0000-0000-000000000000**. Then followed by the role name and **ALL_SCOPES**. Next will be the Aruba Central info. Start with the **app cid**, then the role name (IE Aruba Central Administrator) then **ALL_SCOPES**.

Example:

**version_1#5b0ec0e8c4f422eca232ba72799953ac:00000000-0000-0000-0000-000000000000:Account Administrator:ALL_SCOPES:683da368-66cb-4ee7-90a9-ec1964768092:**

**Aruba Central Administrator:ALL_SCOPES**

If you want to add additional GreenLake applications or if you have multiple Aruba Central accounts, you can add them as well. Just follow the same syntax as before. Once you have the attribute defined, enter it into the SAML attribute statement in Okta as shown below.

![](/img/ws-image6.png)

2﻿. Complete the setup.

![](/img/ws-image7.png)

Click Next and Select “Internal App” then Finish

**Step 3:** **Export the SAML 2.0 IdP metadata**

1. Click Next – Configure the Sign On settings

   Two options available: **View Setup Instructions** which steps through the SAML config or **Identity Provider metadata** will produce an XML that can be loaded into Aruba Central.

   Suggestion: Click **Identity Provider metadata** and save the XML data to a file.

   ![](/img/ws-image9.png)
2. C﻿lick Next
3. Select Internal app and Click Finish

**Step 4: Create SAML Authorization Profile in GreenLake Cloud Platform**

1. Log into GreenLake and click Menu > Manage > Authentication and Click Set Up SAML Connection.

   *Before you can add a new SAML configuration, you must have at least one user account with that domain already enabled in GreenLake. Also, you must be logged into GreenLake with an account from that domain in order to enable SSO for that domain.*

   ![](/img/ws-image10.png)
2. Type in the domain you want to enable SSO on:

   ![](/img/ws-image11.png)
3. Input the metadata from the above step

   While GreenLake does support manually entering this info, it’s recommended to simply upload the XML metadata that was downloaded in the previous step. Select Metadata File and select the XML. Then click Next.

   ![](/img/ws-image12.png)
4. Enter the SAML attributes to match what was entered in Okta and set the idle timeout value as well.

   ![](/img/ws-image13.png)
5. Then click Next.
6. Create a recovery user in the event SSO fails, an admin will still be able to access GreenLake.

   ![](/img/ws-image14.png)

   Congratulations SSO will now be enabled for GreenLake as well as the Aruba Central application. Log out and on the GreenLake home page, click Sign in with SSO.

**Testing and Troubleshooting:**

On the GreenLake Cloud Platform home page, Click Sign in with SSO.

![](/img/ws-image15.png)

![](/img/ws-image16.png)

Enter the SSO credentials and you will be redirected to Okta to authenticate. Once you successfully authenticate, you will be redirected back to GreenLake. You can then click on the Aruba Central application and given access based on the configured role/permissions.

**Additional Notes:**

* There must be at least **one** verified user belonging to the **Domain** prior to configuration.
* In order to configure SSO, you must be logged into GreenLake with a user from the domain.
* SSO user access is determined by the “role_name” attribute included in the SAML hpe_ccs_attribute provided by the IdP.
* SSO users can initiate a Single Sign On request by trying to log in to Aruba Central (SP-initiated login).
* For more troubleshooting: <https://support.hpe.com/hpesc/public/docDisplay?docId=a00120892en_us>

