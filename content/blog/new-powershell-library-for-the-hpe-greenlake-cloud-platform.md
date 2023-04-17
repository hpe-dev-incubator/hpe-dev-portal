---
title: New PowerShell Library for the HPE GreenLake Cloud Platform
date: 2023-04-17T10:57:44.709Z
externalLink: https://github.com/HewlettPackard/POSH-HPEGreenLake
author: Lionel Jullien
authorimage: /img/small-size-id.jpg
disable: false
---
The aim of this blog is to acquaint readers with the recently launched PowerShell library for HPE GreenLake Edge-to-Cloud platform. This library enables PowerShell developers, IT automation experts, and DevOps professionals to utilize the platform's API without having to depend on the graphical user interface.

With the introduction of this new library, individuals possessing basic PowerShell proficiency can now automate infrastructure policies, leverage numerous resources offered by the Cloud Platform, assign roles and create users. Additionally, they can implement restricted resource policies, completely automate device onboarding, generate API credentials for specific application instances like COM/DSCC/Aruba Central, extend their experience with GreenLake API, and make API calls to any HPE GreenLake application instances.

The HPE GreenLake platform provides a shared set of common cloud services for various application instances and different services. This common service experience brings together all HPE service offerings into a single, comprehensive customer experience.

![](/img/ccs.png)

HPE GreenLake CCS, short for HPE GreenLake Common Cloud Services, offers a collection of API-enabled services that serve various functions. The primary ones being:

* **Registration**: in charge of the user registration. Includes email verification, account creation with HPE IDP (Identity Provider) with integration with PING Identity as the OIDC/RP provider (Relying Party for user authenticity verification and token issuance)
* **Authentication**: takes care of the user authentication but also HPE GreenLake CCS to applications authentication. Includes unified login, Single or MFA or SSO (third party), federated authentication with customer’s identity DP, single logout, user management, supports increased security with PKCE (Proof Key for Code Exchange, pronounced ‘pixy”) for OAuth 2.0. 
* **Authorization**: provides authorization service for HPE GreenLake CCS, includes unified RBAC (Role-Based Access Control for users), custom roles and RRP (Resource Restriction Policy). Includes role creation, resource assignment to a role, role assignment to user…
* **Device activation and inventory**: ZTP (Zero Touch Provisioning) and Asset inventory (contract and customer order processing), includes device firmware management (firmware repository for resources, latest FW check, FW upgrade, baseline upgrade).
* **Subscription management**: Subscription inventory, support for different consumption models.

  ![](/img/glcp2.png)

The majority of these essential functions can be performed using the HPE GreenLake PowerShell library, which includes tasks such as account and user creation, role and permission assignment, device integration, application assignment, and tag and subscription definition.

PowerShell offers numerous benefits, such as its flexibility and ease of learning, and with this new library, you can significantly boost your productivity, be agile while reducing the risk of manual errors. Most. if not all, of the HPE GreenLake tasks can be automated in a smarter way, making it a must-have tool for any IT automation engineer or DevOps personnel.

# Introduction to the HPE GreenLake PowerShell Library

You can find the HPE GreenLake PowerShell Library primarily on the Hewlett Packard Enterprise GitHub repository at the following [location](https://github.com/HewlettPackard/POSH-HPEGreenLake).    

![](/img/github_-glcp.png)

This module is also published in the PowerShell Gallery. The PowerShell Gallery is a repository for sharing and distributing PowerShell modules and scripts. It's a community-driven platform that provides access to various PowerShell resources, enabling you to easily discover, install, and publish your own PowerShell content. The PowerShell Gallery can be accessed through the PowerShellGet module, which comes pre-installed with Windows PowerShell 5.0 and above.

In most GitHub repositories, the **README.md** file is a crucial file that provides essential information about the project. It typically contains instructions on how to install and use the module, as well as any other important details that potential users or contributors may need to know. Other files and folders in the repository includes source code, documentation, configuration files, samples, and more. These files are organized into different directories to help keep things organized and easy to find. As mentioned, the **README.md** file is an excellent starting point for getting familiar with this new module. 

The **Samples** folder provides several scripts and csv files examples to demonstrate how this library can be best used. These examples illustrate the variety of functionality in the library, including connecting to the platform, integrating devices, generating API credentials, interacting with iLO, etc.

The **[Issues](https://github.com/HewlettPackard/POSH-HPEGreenLake/issues)** tab is a feature commonly found on websites that use version control systems such as Git, GitHub, or Bitbucket. It allows users to report issues, request new features, or provide feedback related to a project. When users click on one of the Get Started buttons, they are redirected to a form where they can enter details about their issue or suggestion. This information is then stored as a new issue in the project's issue tracker, where developers can see it and take action accordingly. The Issues tab is a valuable tool for effective communication between developers and users, allowing for a more transparent and collaborative development process.  

![](/img/github_-glcp_issues.png)

# Installation of the HPE GreenLake PowerShell Library

**Install-Module** cmdlet is a common way to install PowerShell modules from online repositories. The cmdlet downloads and installs the module and any associated dependencies that it may have. To use the **Install-Module** cmdlet, you can simply open as an **Administrator** a PowerShell console (or a PowerShell ISE console or VS Code), connect to the internet, and run the following command:

`> Install-Module HPEGreenLake`

This will download and install the module from the official PowerShell Gallery repository. If this is your first time installing a module from the PowerShell Gallery, it will ask you to confirm whether you trust the repository or not. You can type Y and press Enter to continue with the installation.
Note: You need to be running PowerShell 5.0 or later and have an internet connection to install modules from the PowerShell Gallery. 
Note: There could be several issues you may encounter while using the `Install-Module` cmdlet in PowerShell, some of which are:

* **Insufficient permissions**: You need administrative privileges to install modules. If you don't have sufficient privileges or if the PowerShell session is not running as an administrator, the cmdlet will fail. Make sure you launch your PowerShell client as Administrator:

  ![](/img/picture5.png)
* **Blocked security protocols**: Sometimes, the security protocols built into PowerShell can prevent the installation process. This usually happens when the PowerShell execution policy is set to "Restricted". If `Get-ExecutionPolicy`shows Restricted, you may need to run `Set-ExecutionPolicy RemoteSigned`

To find all cmdlets in a module that can be used with a specific resource, you can use the `Get-Command` cmdlet along with the `-Module` parameter to specify the name of the module. 

`> Get-Command -Module HPEGreenLake`

In this first release, about 50 cmdlets are available with the HPE GreenLake module.

In PowerShell, cmdlet names are constructed using a verb-noun format. The verb describes the action that the cmdlet performs (Get, Set, Remove, Invoke, etc.), and the noun specifies the object that the cmdlet acts upon. For example, the **Get-HPEGLUserRole** retrieves information about the user role in the HPE GreenLake platform. Note that object resource with the HPE GreenLake library always starts with `HPEGL<resource_name>` (GL for GreenLake). 

`Get-Help` is an important cmdlet in PowerShell as it provides detailed information about a specific cmdlet or function. To get the full help details for the `Get-HPEGLUserRole` cmdlet, you can use the following command:

`> Get-Help Get-HPEGLUserRole -Full`

To view the detailed examples of how to use a particular cmdlet, you can use the `Get-Help` cmdlet along with the `-Examples` parameter followed by the name of the cmdlet. Here's an example command that you can use to get the examples of `Get-HPEGLUserRole` cmdlet:

`> Get-Help Get-HPEGLUserRole -Examples`

This will display all the available examples for the `Get-HPEGLUserRole` cmdlet in a list format. You can review the examples and use them according to your requirements.

# Connection to the HPE GreenLake Cloud platform

The connection to the HPE GreenLake Cloud Platform is done using the `Connect-HPEGL` cmdlet.

* **Important note**: The library currently only supports single-factor authentication. Multi-factor authentication (MFA) and SAML single sign-on are not supported.
  These limitations mean that HPE employees cannot use their hpe.com corporate email to connect with `Connect-HPEGL` because hpe.com emails use SSO authentication. It is therefore mandatory that they use a non-hpe.com email. 
  To add a non-hpe.com secondary email into your HPE GreenLake account, just go to GreenLake GUI and use **Invite Users** card in **Manage** / **Identity & Access** to send an invitation to your personal email. Once you receive the email, accept the invitation and you will be taken to the HPE GreenLake interface where you can set a password. Once done, you can use this email and password with `Connect-HPEGL`.

After successfully authenticating to the HPE GreenLake platform, the `[HPEGreenLake.Connection]` object is returned to the caller and at the same time is added to the global session tracker `$HPEGreenLakeSession`.

To display the content of this global variable in the console, use: 

`> $HPEGreenLakeSession | format-List`

![](/img/lj-picture6.png)

This object contains the following properties:

* **session** - Web session object containing information about the HPE GreenLake session, including cookies and credentials.
* **oauth2AccessToken** - OAuth2 access token string returned by the API after successful authentication. 
* **oauth2IdToken** - OAuth2 ID Token string returned by the API after successful authentication. 
* **oauth2RefreshToken** - OAuth2 refresh token string returned by the API after successful authentication. 
* **userName** - Email address that was authenticated with HPE GreenLake
* **customerId** - HPE GreenLake customer ID
* **companyName** - Name of the Company account  
* **oauth2TokenCreation** - OAuth2 token creation datetime value.
* **oauth2TokenCreationEpoch** - Unix time since creation of the OAuth2 token.
* **userSessionIdleTimeout** - HPE GreenLake user session timeout in minutes.
* **apiCredentials** - Collection of application API credentials created during the session. Each API credential object contains the following properties:

  * **credential_name** - Name of the API credential
  * **application_name** - Name of the application using this credential
  * **ccs_region** - Region of the application using this credential
  * **application_instance_id** - Instance ID of the application using this credential
  * **client_id** - Client ID of the API credential
  * **client_secret** - Client Secret of the API credential
  * **connectivity_endpoint** - Connectivity endpoint of the application instance

> **Note**: **apiCredentials** property is only filled in when using `New-HPEGLAPIcredential` during a session. 

All properties in this object are important. **Session** stores what the library uses to make all the calls in the cmdlets. You can open session using:

`> $HPEGreenLakeSession.session`

![](/img/lj-picture7.png)

Note that in the headers, an **Authorization Bearer <token>** header is defined. 

This token is a JWT (JSON Web Token) pronounced “Jot” is a type of token used in the OAuth 2.0 standard for authentication and authorization purposes. OAuth 2.0 is a protocol designed to allow secure access to user resources in HPE GreenLake without requiring their credentials to be shared with HPE GreenLake, the client application.

The JWT typically contains data about the token, such as its type and signature algorithm, statements about the user, such as their ID, name, email address, or role, and an expiration time. Finally, a signature that is used to verify that the token has not been altered during transmission and that it was issued by a trusted source.

It's important to keep in mind that the access token will only be valid for a period of 2 hours, after which it will expire and no longer be usable. 

The `Connect-HPEGL` cmdlet handles the entire authorization process, which includes authorizing with the third-party identity provider and collecting various tokens. Once all the necessary tokens have been obtained, a session is created by utilizing bearer authentication with the HPE GreenLake Common cloud Services (CCS) API using the id_token present in the payload to confirm our identity.

When the session is created, CCS sets a unique session ID in a cookie that the library stores in `$HPEGreenLakeSession.session.cookies` so that all subsequent requests can use it. Other cookies are also added to maintain the session state between the PowerShell session and the CCS API. For each request from the HPE GreenLake library, these cookies are sent back to the CCS API, which allows the cloud platform to identify the user, associate it with their session data and grant various permissions.

# Interaction with the HPE GreenLake API

## Main Cmdlets for roles, permissions, and restrictions

With HPE GreenLake, you have the ability to manage users and their permissions to services and resources within your account. The management of these permissions is done through Roles which are composed of a set of permissions that provide access to users in your HPE GreenLake account. 

Additionally, you can restrict access to specific resources by creating custom resource groupings using Resource Restriction Policies.

The main cmdlets for managing users and their access to HPE GreenLake resources are the following:

- To manage users: 
  - `Get-HPEGLUser`: to get users and their activity status and roles.
  - `Send-HPEGLUserInvitation`: to invite users to your account. 
  - `Remove-HPEGLUser`: to delete users from your account.

- To view and manage user roles and permissions: 
  - `Get-HPEGLRole`: to view the role (= group of permissions) that you can specify and assign to users in your HPE GreenLake account.  
  - `Get-HPEGLUserRole`: to view user roles and permissions. 
  - `Set-HPEGLUserRole`: to set user roles and permissions. 
  - `Remove-HPEGLUserRole`: to remove user roles and permissions. 

- To define Resource Restriction Policies and manage access to resources:
   - `Get-HPEGLResourceRestrictionPolicy`: to view resource restriction policies in your HPE GreenLake account.
   - `New-HPEGLResourceRestrictionPolicy`: to set resource restriction policies in your HPE GreenLake account.
   - `Remove-HPEGLResourceRestrictionPolicy`: to remove resource restriction policies in your HPE GreenLake account.

# Managing devices with the HPE GreenLake PowerShell Library 

In HPE GreenLake, devices are the resource for compute, network and storage devices that you can onboard on the platform in your HPE GreenLake account. Once onboarded, devices can be viewed, assigned to an application instance, applied to a subscription, and tagged.

In the library, the main cmdlet to get information on devices is `Get-HPEGLDevice`.

`> Get-HPEGLdevice`

As in the GUI, the bare cmdlet (without parameters) returns a subset of resources in a page. A maximum of 100 devices are displayed by default. The `-Nolimit` parameter can be used to display all available devices, but this may result in a longer response time. 

The cmdlets in this library usually generate formatted objects when they are displayed on the console to enhance readability and ease of understanding. As an example, if you enter:

> Get-HPEGLdevice -Limit 10 

The generated output is "formatted". To get the full view of a formatted object in PowerShell, you can use the Format-List cmdlet (or fl its alias). This cmdlet allows you to display all the properties and values of an object in a list form. Try this time:

> Get-HPEGLdevice -Limit 10 | fl



