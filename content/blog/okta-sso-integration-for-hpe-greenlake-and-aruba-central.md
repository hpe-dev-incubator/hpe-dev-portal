---
title: Okta SSO Integration for HPE GreenLake and Aruba Central
date: 2023-02-14T16:30:51.228Z
externalLink: https://blog.wifi-guys.com
author: "Will Smith - Consulting Systems Engineer (ACEX #34)"
authorimage: /img/willsmith-sm.jpg
thumbnailimage: /img/gl-sso.jpg
disable: false
---
Aruba Central has gone GREEN…GreenLake that is! If you’re reading this, then you’ve likely heard that Aruba Central is now integrated into the new HPE GreenLake Common Cloud Service (CCS) Platform. This allows IT admins to view and orchestrate critical network services such as Wired, Wireless and SD-Branch, through the same dashboard as their compute and storage infrastructure.

If you’ve already configured SSO with Aruba Central, then you don’t need to modify any of the existing SAML attributes. You can skip this post and follow the steps outlined in this [support advisory](https://dnrnwf7jtrmzj.cloudfront.net/prod/public/acc-1-asp/nc-22550/ARUBA-SA-20220207-PLN602%20Aruba%20Central%20SSO%20Migration%20(Rev-1)-20220208-0020.pdf?Expires=1649743011&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9kbnJud2Y3anRybXpqLmNsb3VkZnJvbnQubmV0L3Byb2QvcHVibGljL2FjYy0xLWFzcC9uYy0yMjU1MC9BUlVCQS1TQS0yMDIyMDIwNy1QTE42MDIgQXJ1YmEgQ2VudHJhbCBTU08gTWlncmF0aW9uIChSZXYtMSktMjAyMjAyMDgtMDAyMC5wZGYiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE2NDk3NDMwMTF9fX1dfQ__&Signature=ciAF48bi9yQUjLU7Rbq0mLpGHFL1CO2v5nHVy9hMl26k~muHL5QsboMvYBNt3QQJPhOKb1KPNFe3He55dA1Jal0TOWwn~Z2xhR1CAQKMBuNC7~51fZQOe9nziEi1VaoVDCj-7pq2B9sOdF8pwglhlGjEcQKzAT-EA55k40oMmkvtp301Wcf2nM5hPNcyuf0KsqbxVGpIkPXHkJakbVKA1vL2YiEaA~uEbRO8gIcIJ8SYxsZOef3VwwR~mg6MWPXGouKI5ZNimIuDTG39fe4Z7mGepBoNvjrAHPLauUXN~BsVENFH217K4n14KkdQBeHejDxde-FDYH4GpdxPYlRl0Q__&Key-Pair-Id=APKAJU5N2DC4BKLV5G4A). However, if you are new to Aruba Central or have never enabled SSO, this guide is for you. This will walk you through the process of configuring SSO for GreenLake and Aruba Central using Okta.

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

![](/img/image1.png)

Provide a name for the Aruba GreenLake SSO service (Okta Application)

**Step 2: Configure Single Sign On settings**

1. Enter the SAML information.
2. Under General:

   **Single Sign on URL**: <https://sso.common.cloud.hpe.com/sp/ACS.saml2>

   **Audience URI (SP Entity ID):** [https://sso.common.cloud.hpe.com](https://sso.common.cloud.hpe.com/)

   **Name ID format EmailAddress**

   **Application username Email**

   **NameID = user.email**

   **gl_first_name = user.FirstName**

   **gl_last_name = user.LastName**

   **hpe_ccs_attribute = (See Below)**

   See here for IdP attribute details: <https://support.hpe.com/hpesc/public/docDisplay?docId=a00120892en_us>

   One of the additional features added as part of the GreenLake CCS is Role Based Access Controls (RBAC) for Aruba Central and all other apps in CCS. A new SAML attribute has been added “hpe_ccs_attribute” which tells GreenLake and Central the exact role/permissions for each user. The following describes how to format the attribute.

![](/img/image2.png)

![](/img/image3.png)

![](/img/image4.png)

![](/img/image5.png)



The “**hpe_ccs_attribute**” will always start with “**version_1#**”. First, we’ll configure the attributes for GreenLake CCS, then Central. First enter the PCID for the account, followed by the GreenLake application ID. This will always be “**00000000-0000-0000-0000-000000000000**”. Then followed by the role name and “ALL_SCOPES”. Next will be the Aruba Central info. Start with the “**app cid**”, then the role name (IE Aruba Central Administrator) then “**ALL_SCOPES**”.

Example: **version_1#5b0ec0e8c4f422eca232ba72799953ac:00000000-0000-0000-0000-000000000000:Account Administrator:ALL_SCOPES:683da368-66cb-4ee7-90a9-ec1964768092:Aruba Central Administrator:ALL_SCOPES**

If you want to add additional GreenLake applications or if you have multiple Aruba Central accounts, you can add them as well. Just follow the same syntax as before. Once you have the attribute defined, enter it into the SAML attribute statement in Okta as shown below.

![](/img/image6.png)

![](/img/image7.png)

![](/img/image8.png)

Click Next and Select “Internal App” then Finish



**Step 3:** **Export the SAML 2.0 IdP metadata**

1. Click Next – Configure the Sign On settings

   Two options available: **View Setup Instructions** which steps through the SAML config or **Identity Provider metadata** will produce an XML that can be loaded into Aruba Central.

   Suggestion: Click **Identity Provider metadata** and save the XML data to a file.

   ![](/img/image9.png)
2. C﻿lick Next
3. Select Internal app and Click Finish



**Step 4: Create SAML Authorization Profile in GreenLake Cloud Platform**

1. Log into GreenLake and click Menu > Manage > Authentication and Click Set Up SAML Connection.

   *Before you can add a new SAML configuration, you must have at least one user account with that domain already enabled in GreenLake. Also, you must be logged into GreenLake with an account from that domain in order to enable SSO for that domain.*

   ![](/img/image10.png)
2. Type in the domain you want to enable SSO on:

   ![](/img/image11.png)
3. Input the metadata from the above step

   While GreenLake does support manually entering this info, it’s recommended to simply upload the XML metadata that was downloaded in the previous step. Select Metadata File and select the XML. Then click Next.

   ![](/img/image12.png)
4. Enter the SAML attributes to match what was entered in Okta and set the idle timeout value as well.

   ![](/img/image13.png)
5. Then click Next.
6. Create a recovery user in the event SSO fails, an admin will still be able to access GreenLake.

   ![](/img/image14.png)

   Congratulations SSO will now be enabled for GreenLake as well as the Aruba Central application. Log out and on the GrenLake home page, click Sign in with SSO.

**Testing and Troubleshooting:**

On the GreenLake Cloud Platform home page, Click Sign in with SSO.

![](/img/image15.png)

![](/img/image16.png)

Enter the SSO credentials and you will be redirected to Okta to authenticate. Once you successfully authenticate, you will be redirected back to GreenLake. You can then click on the Aruba Central application and given access based on the configured role/permissions.



**Additional Notes:**

* There must be at least **one** verified user belonging to the **Domain** prior to configuration.
* In order to configure SSO, you must be logged into GreenLake with a user from the domain.
* SSO user access is determined by the “role_name” attribute included in the SAML hpe_ccs_attribute provided by the IdP.
* SSO users can initiate a Single Sign On request by trying to log in to Aruba Central (SP-initiated login).
* For more troubleshooting: <https://support.hpe.com/hpesc/public/docDisplay?docId=a00120892en_us>

**Okta MFA Example:**

* Okta as well as many cloud identity providers support various MFA and other types of additional security policies.
* Okta Verify (Okta native MFA app) example:
* Okta Admin portal > Security > MFA > Factor Type – Okta Verify Enable

![](/img/image17.png)

1. Click Factor Enrollment and create an enrollment policy.
2. Then select the user groups to apply this policy to.
3. For MFA enable verify with push.

![](/img/image18.png)

![](/img/image19.jpeg)