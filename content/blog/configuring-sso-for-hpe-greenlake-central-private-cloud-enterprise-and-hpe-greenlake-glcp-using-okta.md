---
title: How to implement a single sign-on solution to authenticate users onto the
  HPE GreenLake edge-to-cloud platform
date: 2023-11-29T12:41:00.306Z
featuredBlog: false
externalLink: ""
author: Prabhu Murthy - Cloud Operations
authorimage: /img/Avatar1.svg
thumbnailimage: /img/hpe-greenlake-sso-page.jpg
disable: false
tags:
  - hpe-greenlake-platform
  - sso
  - okta
  - Active Directory
  - hpe-greenlake
---
<style>
li {
   font-size: 27px;
   line-height: 33px;
   max-width: none;
}
</style>


Enterprises looking to use HPE GreenLake for Private Cloud Enterprise can benefit from the use of SSO, as it has been integrated onto the HPE GreenLake edge-to-cloud platform (also known as HPE GreenLake platform), which supports single sign-on.

In this blog post, I will walk you through the process of configuring Okta Active Directory (AD) to authenticate users into the HPE GreenLake for Private Cloud Enterprise application on the HPE GreenLake platform using SAML Identity Provider (IdP) for single sign-on.

### Before starting

Please review the [HPE GreenLake](https://support.hpe.com/hpesc/public/docDisplay?docId=a00120892en_us&page=GUID-D7192971-EF71-4304-B51E-548E7954E644.html) User Guide to understand how the SAML framework works in the context of HPE GreenLake for Private Cloud Enterprise Services for the HPE GreenLake edge-to-cloud platform.

### Configure SSO/SAML applications in Okta

   To configure application metadata in Okta, complete the following steps:

* Step 1: Create an Okta SAML application
* Step 2: Configure Sign On settings
* Step 3: Export the SAML 2.0 IdP metadata
* Step 4: Configure the SAML connection in the HPE GreenLake platform

**Step 1: Create an Okta SAML application**

1. Log into the Okta administration console.
2. Click **Applications > Create new app integration.** The Create a new app integration window opens.
3. Select SAML 2.0 and click **Next**.

![](/img/ws-image0.png)

Provide a name for the SAML application which gets connected to the HPE GreenLake platform:

![](/img/saml_app-okta.jpg)

**Step 2: How to configure single sign-on settings**

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

   See here for IdP attribute details: [](https://support.hpe.com/hpesc/public/docDisplay?docId=a00120892en_us)<https://support.hpe.com/hpesc/public/docDisplay?docId=a00120892en_us&page=GUID-D7192971-EF71-4304-B51E-548E7954E644.html>

   A new SAML attribute has been added “hpe\_ccs\_attribute” which tells HPE GreenLake platform and HPE GreenLake for Private Cloud Enterprise application the exact role/permissions for each user. The following describes how to format the attribute.

   Format: {version}#{pcid}:{app id}:{role_name}:{ALL\_SCOPES}

   N﻿ote :  At present HPE GreenLake for Private Cloud Enterprise application role should be excluded.

![](/img/hpe-greenlake-saml-attributes.jpg)

![](/img/workspace-pcid.jpg)

![](/img/glp_role_name.jpg)

The **hpe\_ccs\_attribute** always starts with version1#. You must first configure the attributes for HPE GreenLake platform and to do so, enter the Platform Customer ID (PCID) for the account (this is the identifier assigned to your HPE GreenLake platform Workspace), followed by the HPE GreenLake platform application ID. This will always be **00000000-0000-0000-0000-000000000000**. Following this, enter the role name and ALL\_SCOPES**.** 

Example:

version_1\#7ede5c36b7b911edacf45a78eb8b07d1:00000000-0000-0000-0000-000000000000:Observer:ALL\_SCOPES

![](/img/saml_settings.jpg)

2﻿. Complete the setup.

![](/img/ws-image7.png)

Click **Next** and select **Internal App**, then **Finish**.

**Step 3:** **Export the SAML 2.0 IdP metadata**

1. Click Next – Configure the single sign-on settings

   You will find two options are available: **View Setup Instructions** which steps you through the SAML configuration and **Identity Provider metadata**, which will produce an XML file that can be loaded into HPE GreenLake platform application.

   Suggestion: click **Identity Provider metadata** and save the XML data to a file.

   ![](/img/ws-image9.png)

2. C﻿lick **Next**.   
    
3. Select **Internal app**, and click **Finish**.    

   ##### **Step 3.1 :  Access to the SAML application and HPE GreenLake platform is determined by assigning only those members or group to the SAML application.**

![](/img/customer-user-assignment-to-saml.jpg)



**Step 4:** **Configure the SAML connection in the HPE GreenLake platform**

1. Log into HPE GreenLake platform and click **Menu** > **Manage** > **Authentication** and click **Set Up SAML Connection**.

   _Before you can add a new SAML configuration, you must have at least **one** user account with that **domain** already enabled in HPE GreenLake platform. Also, you must be logged into HPE GreenLake platform with an account from that domain in order to enable SSO for it._

   ![](/img/ws-image10.png)

2. Type in the domain you want to enable SSO on:

   ![](/img/glp_domain.jpg)

3. Input the metadata from the step above.

   While HPE GreenLake platform does support entering this information manually, it's recommended that you simply upload the XML metadata that was downloaded in the previous step. To do so, select **Metadata File**, selecting the XML file. Then, click **Next**.

   ![](/img/ws-image12.png)

4. Enter the SAML attributes to match what was entered in Okta. Set the idle timeout value as well.

   ![](/img/config_setting_sso_appjpg.jpg)

5. Then click **Next**.
    
6. Create a recovery user so that, in the event SSO fails, an admin will still be able to access the HPE GreenLake platform.    

   ![](/img/recovery_user.jpg)

   Congratulations! SSO will now be enabled for HPE GreenLake platform as well as the HPE GreenLake for Private Cloud Enterprise application. Log out and on the HPE GreenLake platform home page, click **Sign in with SSO**.

**Testing and troubleshooting:**

On the HPE GreenLake edge-to-cloud platform home page, click **Sign In with SSO**.

![](/img/ws-image15.png)

![](/img/hpe-greenlake-sso-page.jpg)

Enter the SSO credentials. You will be redirected to Okta to authenticate. Once you successfully authenticate, you will be redirected back to HPE GreenLake platform. You can then click on the HPE GreenLake for Private Cloud Enterprise application and be given access based on the configured role/permissions.

**Additional notes:**

* There must be at least **one** verified user belonging to the **Domain** prior to configuration.    
* In order to configure SSO, you must be logged into the HPE GreenLake edge-to-cloud platform with a user from the domain.
* SSO user access is determined by the “role_name” attribute included in the SAML hpe_ccs_attribute provided by the IdP.    
* For more troubleshooting: <https://support.hpe.com/hpesc/public/docDisplay?docId=a00120892en_us>
* Customer users should be given access to SAML application.
* After authentication when clicking the HPE GreenLake for Private Cloud Enterprise application**,** if it leads to the below error, it will take 1 hr to sync. If it does not do so within that time period, the customer should contact their HPE administrator. 

I hope this blog post answers any questions you may have had in regards to how to configure single sign-on for HPE GreenLake for Private Cloud Enterprise on the HPE GreenLake platform using Okta Active Directory. Please return back to the [HPE Developer Community blog](https://developer.hpe.com/blog) for more tips and tricks on working with the HPE GreenLake platform.