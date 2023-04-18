---
title: New PowerShell Library for the HPE GreenLake Cloud Platform
date: 2023-04-17T10:57:44.709Z
externalLink: https://github.com/HewlettPackard/POSH-HPEGreenLake
author: Lionel Jullien
authorimage: /img/small-size-id.jpg
disable: false
tags:
  - GreenLake
  - GLCP
  - PowerShell
  - Common cloud services
  - Platform
  - Cloud
  - HPEGreenLake
---
<style>ul li{ font-size:26px;padding-bottom: 0.5em;}</style>

<style> i{ color:grey;font-family:'Courier New';font-size:22px; } </style>

The purpose of this blog is to familiarize readers with the recently released PowerShell library for the HPE GreenLake Edge-to-Cloud platform. This library allows PowerShell developers, IT automation experts, and DevOps professionals to use the platform's API without having to rely on the GUI.

With the introduction of this new library, anyone with basic PowerShell skills can now automate their interaction with the HPE GreenLake API, leverage the many resources offered by the HPE Cloud Platform, and enjoy increased productivity and efficiency.

Are you seeking agility and the ability to automate routine tasks through HPE GreenLake? If so, this library is the ideal solution for you!

Among many other operations, this library allows you to create users, assign roles, send invitations to users, add and archive devices, assign applications and attach subscriptions, add tags to any device, get all kinds of information about any HPE GreenLake resource. 

In addition, you can implement resource restriction policies, fully automate device onboarding, generate API credentials for specific application instances such as HPE Computes Ops Management or HPE Data Services Cloud Console, and extend on the fly your API calls to any HPE GreenLake application instance.

The HPE GreenLake platform provides a shared set of common cloud services for different application instances and services. This common service experience brings together all HPE service offerings into a single, comprehensive customer experience that this library leverages.

![](/img/ccs.png)

HPE GreenLake CCS, short for HPE GreenLake Common Cloud Services, offers a collection of API-enabled services that serve various functions. The primary ones being:

* **Registration**: in charge of the user registration. Includes email verification, account creation with HPE IDP (Identity Provider) with integration with PING Identity as the OIDC/RP provider (Relying Party for user authenticity verification and token issuance)
* **Authentication**: takes care of the user authentication but also HPE GreenLake CCS to applications authentication. Includes unified login, Single or MFA or SSO (third party), federated authentication with customer’s identity DP, single logout, user management, supports increased security with PKCE (Proof Key for Code Exchange, pronounced ‘pixy”) for OAuth 2.0. 
* **Authorization**: provides authorization service for HPE GreenLake CCS, includes unified RBAC (Role-Based Access Control for users), custom roles and RRP (Resource Restriction Policy). Includes role creation, resource assignment to a role, role assignment to user…
* **Device activation and inventory**: ZTP (Zero Touch Provisioning) and Asset inventory (contract and customer order processing), includes device firmware management (firmware repository for resources, latest FW check, FW upgrade, baseline upgrade).
* **Subscription management**: Subscription inventory, support for different consumption models.

  ![](/img/glcp2.png)

The majority of these essential functions can be performed effortlessly and with great efficiency using the HPE GreenLake PowerShell library.

PowerShell offers numerous benefits, such as its flexibility and ease of learning, and with this new library, you can significantly boost your productivity, be agile while reducing the risk of manual errors. Most, if not all, of the HPE GreenLake tasks can be automated in a smarter way, making it a must-have tool for any IT automation engineer or DevOps personnel.

# Introduction to the HPE GreenLake PowerShell Library

The new HPE GreenLake PowerShell Library can be found on the Hewlett Packard Enterprise GitHub repository at the following [location](https://github.com/HewlettPackard/POSH-HPEGreenLake).    

![](/img/github_-glcp.png)

This module is also published in the PowerShell Gallery. The PowerShell Gallery is a repository for sharing and distributing PowerShell modules and scripts. It's a community-driven platform that provides access to various PowerShell resources, enabling you to easily discover, install, and publish your own PowerShell content. The PowerShell Gallery can be accessed through the PowerShellGet module, which comes pre-installed with Windows PowerShell 5.0 and above.

In most GitHub repositories, the **README.md** file is a crucial file that provides essential information about the project. It typically contains instructions on how to install and use the module, as well as any other important details that potential users or contributors may need to know. Other files and folders in the repository includes source code, documentation, configuration files, samples, and more. These files are organized into different directories to help keep things organized and easy to find. As mentioned, the **README.md** file is an excellent starting point for getting familiar with this new module. 

The **Samples** folder provides several scripts and csv files examples to demonstrate how this library can be best used. These examples illustrate the variety of functionality in the library, including connecting to the platform, onboarding devices, generating API credentials, interacting with iLO, etc.

The **[Issues](https://github.com/HewlettPackard/POSH-HPEGreenLake/issues)** tab is a feature commonly found on websites that use version control systems such as Git, GitHub, or Bitbucket. It allows users to report issues, request new features, or provide feedback related to a project. When users click on one of the **Get Started** buttons, they are redirected to a form where they can enter details about their issue or suggestion. This information is then stored as a new issue in the project's issue tracker, where developers can see it and take action accordingly. The **Issues** tab is a valuable tool for effective communication between developers and users, allowing for a more transparent and collaborative development process.  

![](/img/github_-glcp_issues.png)

# Installation of the HPE GreenLake PowerShell Library

**Install-Module** cmdlet is a common way to install PowerShell modules from online repositories. The cmdlet downloads and installs the module and any associated dependencies that it may have. To use the **Install-Module** cmdlet, you can simply open as an **Administrator** a PowerShell console (or a PowerShell ISE console or VS Code), and run the following command:

`> Install-Module HPEGreenLake`

This will download and install the module from the official PowerShell Gallery repository. If this is your first time installing a module from the PowerShell Gallery, it will ask you to confirm whether you trust the repository or not. You can type **Y** and press **Enter** to continue with the installation.

> **Note**: You need to be running PowerShell 5.0 or later and have an internet connection to install modules from the PowerShell Gallery. 

There could be several issues you may encounter while using the `Install-Module` cmdlet in PowerShell, some of which are:

* **Insufficient permissions**: You need administrative privileges to install modules. If you don't have sufficient privileges or if the PowerShell session is not running as an administrator, the cmdlet will fail. Make sure you launch your PowerShell client as Administrator:

  ![](/img/lj-picture5.png)

* **Blocked security protocols**: Sometimes, the security protocols built into PowerShell can prevent the installation process. This usually happens when the PowerShell execution policy is set to "Restricted". If `Get-ExecutionPolicy`shows Restricted, you may need to run `Set-ExecutionPolicy RemoteSigned`.

To find all cmdlets in a module that can be used with a specific resource, you can use the `Get-Command` cmdlet along with the `-Module` parameter to specify the name of the module. 

`> Get-Command -Module HPEGreenLake`

In this first release, about 50 cmdlets are available with the HPE GreenLake module.

In PowerShell, cmdlet names are constructed using a verb-noun format. The verb describes the action that the cmdlet performs (Get, Set, Remove, Invoke, etc.), and the noun specifies the object that the cmdlet acts upon. For example, the `Get-HPEGLUserRole` retrieves information about the user role in the HPE GreenLake platform. Note that object resource with the HPE GreenLake library always starts with `HPEGL<resource_name>` (GL for GreenLake). 

`Get-Help` is an important cmdlet in PowerShell as it provides detailed information about a specific cmdlet or function. To get the full help details for the `Get-HPEGLUserRole` cmdlet, you can use the following command:

`> Get-Help Get-HPEGLUserRole -Full`

To view the detailed examples of how to use a particular cmdlet, you can use the `Get-Help` cmdlet along with the `-Examples` parameter followed by the name of the cmdlet. Here's an example command that you can use to get the examples of `Get-HPEGLUserRole` cmdlet:

`> Get-Help Get-HPEGLUserRole -Examples`

This will display all the available examples for the `Get-HPEGLUserRole` cmdlet in a list format. You can review the examples and use them according to your requirements.

# Connection to the HPE GreenLake Cloud platform

The connection to the HPE GreenLake Cloud Platform is done using the `Connect-HPEGL` cmdlet.

* **Important note**: The library currently only supports single-factor authentication. Multi-factor authentication (MFA) and SAML single sign-on are not supported. These limitations mean that HPE employees cannot use their hpe.com corporate email to connect with `Connect-HPEGL` because hpe.com emails use SSO authentication. It is therefore mandatory that they use a non-hpe.com email. 

* To add a non-hpe.com secondary email into your HPE GreenLake account, just go to GreenLake GUI and use **Invite Users** card in **Manage** / **Identity & Access** to send an invitation to your personal email. Once you receive the email, accept the invitation and you will be taken to the HPE GreenLake interface where you can set a password. Once done, you can use this email and password with `Connect-HPEGL`.

After successfully authenticating to the HPE GreenLake platform, the `[HPEGreenLake.Connection]` object is returned to the caller and at the same time is added to the global session tracker `$HPEGreenLakeSession`.

To display the full content of this global variable in the console, use: 

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

When the session is created, CCS sets a unique session ID in a cookie that the library stores in `$HPEGreenLakeSession.session.cookies` so that all subsequent requests can use it. Other cookies are also added to maintain the session state between the PowerShell session and the CCS API. For each request from the HPE GreenLake library, these cookies are sent back to the CCS API, which allows the cloud platform to identify the user and grant various permissions.

# Interaction with the HPE GreenLake API

## Main Cmdlets for roles, permissions, and restrictions

With HPE GreenLake, you have the ability to manage users and their permissions to services and resources within your account. The management of these permissions is done through Roles which are composed of a set of permissions that provide access to users in your HPE GreenLake account. 

Additionally, you can restrict access to specific resources by creating custom resource groupings using Resource Restriction Policies.

The main cmdlets for managing users and their access to HPE GreenLake resources are the following:

* To manage users: 

  * `Get-HPEGLUser`: to get users and their activity status and roles.
  * `Send-HPEGLUserInvitation`: to invite users to your account. 
  * `Remove-HPEGLUser`: to delete users from your account.
* To view and manage user roles and permissions: 

  * `Get-HPEGLRole`: to view the role (= group of permissions) that you can specify and assign to users in your HPE GreenLake account.  
  * `Get-HPEGLUserRole`: to view user roles and permissions. 
  * `Set-HPEGLUserRole`: to set user roles and permissions. 
  * `Remove-HPEGLUserRole`: to remove user roles and permissions. 
* To define Resource Restriction Policies and manage access to resources:

  * `Get-HPEGLResourceRestrictionPolicy`: to view resource restriction policies in your HPE GreenLake account.
  * `New-HPEGLResourceRestrictionPolicy`: to set resource restriction policies in your HPE GreenLake account.
  * `Remove-HPEGLResourceRestrictionPolicy`: to remove resource restriction policies in your HPE GreenLake account.

## Managing devices with the HPE GreenLake PowerShell Library

In HPE GreenLake, devices are the resource for compute, network and storage devices that you can onboard on the platform in your HPE GreenLake account. Once onboarded, devices can be viewed, assigned to an application instance, applied to a subscription, and tagged.

In the library, the main cmdlet to get information on devices is `Get-HPEGLDevice`.

`> Get-HPEGLdevice`

As in the GUI, the bare cmdlet (without parameters) returns a subset of resources in a page. A maximum of 100 devices are displayed by default. The `-Nolimit` parameter can be used to display all available devices, but this may result in a longer response time. 

The cmdlets in this library usually generate formatted objects when they are displayed on the console to enhance readability and ease of understanding. As an example, if you enter:

> Get-HPEGLdevice -Limit 10 
>
> ![](/img/lj-picture8.png)

The generated output is "formatted". To get the full view of a formatted object in PowerShell, you can use the `Format-List` cmdlet (or `fl` its alias). This cmdlet allows you to display all the properties and values of an object in a list form:

> Get-HPEGLdevice -Limit 10 | fl
>
> ![](/img/lj-picture9.png)

Several other parameters are available with `Get-HPEGLDEvice` (e.g. Tags, Archived, Stats, Devicetype, Serialnumber, etc.) you can use the help to get the complete list, and try them out at your convenience.

## Adding devices to the HPE GreenLake Platform

To manage devices using HPE GreenLake, one of the initial steps is to onboard the device onto the platform. When using the GUI, this step is typically done manually. One of the major advantages of using a library that supports automation is the ability to streamline and fully automate processes such as device onboarding. With automation, you can significantly increase efficiency, reduce errors, and save time and resources that would otherwise be spent on manual tasks.

`Add-HPEGLDeviceCompute` is the first cmdlet that you can use to simply add a Compute device to the HPE GreenLake console.  The sole purpose of this cmdlet is to add compute(s) with the specified tags to the platform and nothing beyond that.

It is worth noting that a CSV file can be utilized to add multiple computes to the platform by containing device information such as serial number, part number, and tags. To do so, this CSV file can be used as a pipeline input of this cmdlet using the following procedure: 

`> Import-Csv Compute_Devices.csv | Add-HPEGLDeviceCompute`

The content of the csv file must use the following format:

```
   SerialNumber, PartNumber, Tags
   WGX2380BLC,	P55181-B21, Country=US State=PACA App=RH
   AZX2380BLD,  P55182-B21, State=Texas Role=production
   7LKY23D9LM,  P54277-B21
```

Tags are optional but highly recommended. They are particularly useful when creating resource restriction policies. They must meet the string format: "`<Name>=<Value> <Name>=<Value>`" such as "`Country=US State=TX App=Grafana`" or "`Country=US`".

`Add-HPEGLDeviceComputeFullService` is a much more advanced cmdlet than the previous one. This specific command has the ability to perform all mandatory steps of Compute onboarding:

1. Connect to HPE GreenLake using the default account or the one provided using the `GLCompanyName` parameter.
2. Set the automatic assignment of subscriptions with the first Compute Enhanced subscription found that has not expired and has available subscription seats.
3. Onboard each device to the HPE GreenLake Cloud Platform account.      
4. Set optional server tags if defined with the `Tags` parameter.
5. Associate each device with the defined application instance (subscription is automatically assigned to each device as per auto assignment configuration).
6. Set each iLO to use a web proxy if defined via the different web proxy parameters.
7. Connect each iLO to the HPE Compute Ops Management instance.

This time, the content of the csv file that can be used as a pipeline input must have the  following format:

```
  IP, Username, Password, Tags
  192.168.3.193, Administrator, password, Country=FR City=Mougins App=InfluxDB Owner=LJ
  192.168.3.191, Administrator, password, Country=US State=Texas Role=Production Owner=LJ
  192.168.3.205, demo, password
```

All Compute data that is required by the HPE GreenLake Platform to complete the Compute onboarding is collected and managed by the cmdlet in the background using RedFish iLO calls.

You can use `Get-Help` to learn more about this cmdlet and particularly look at the different examples:

`> Help Add-HPEGLDeviceComputeFullService -full`

`Add-HPEGLDeviceStorageFullService` and `Add-HPEGLDeviceNetworkFullService` offer the same full onbording service for storage and networking devices. 

Overall, the ability to fully automate device onboarding is a significant advantage that can lead to many benefits for organizations of all sizes.

It's great to hear that there are [samples](https://github.com/HewlettPackard/POSH-HPEGreenLake/tree/master/Samples) available on GitHub repository which can help in learning how to use the full device onboarding cmdlets and how to build the csv files.

## Managing applications with the HPE GreenLake PowerShell Library

The main cmdlets for managing applications in the HPE GreenLake Platform are the followings:

* To manage applications: 

  * `Get-HPEGLApplication`: to get all applications available to you on your HPE GreenLake Platform, including the ones that are provisioned into your account and the ones that are not. 

* To add and remove applications:

  * `Add-HPEGLApplication`: to provision an application in a new region.

  > **Note**: A HPE GreenLake region refers to the geographical location where the HPE GreenLake services are hosted and provided from. This can vary depending on the customer's location and which HPE GreenLake application you are using. So customers can choose the region that best suits their needs in terms of location, availability, and compliance requirements.

  * `Remove-HPEGLApplication`: to delete an application instance. 

  > **Note**: This cmdlet has a high-impact and irreversible action. This action permanently deletes all data of the application instance and cannot be undone once the process has started. For example, removing the Compute Ops Management US-West instance would remove all user data, all devices, all server settings, all server groups, all API credentials, etc. It's great to hear that this cmdlet has a confirmation prompt before deleting an application instance. This feature can help prevent accidental deletions and provide an extra layer of protection for critical data in applications.

* To assign and unassign devices to applications:

  * `Set-HPEGLDeviceApplication`: to attach devices to an application instance.

  > **Note**: Assigning devices to an application instance is the process of attaching devices to an application in a region, so that these devices become visible and managed in the application instance by users.

* To create and delete API application credentials:

  * `New-HPEGLAPIcredential`: to create an API credential for an application instance. 

  > **Note**: With the HPE GreenLake platform, developers can make API calls on any application instance as long as they have the API credentials which consist of a client ID, client secret and connectivity endpoint. 
  >
  > **Note**: When API credentials are created, they are automatically stored in the global variable `$HPEGreenLakeSession.apiCredentials`. This global variable is accessible as long as the PowerShell console is active and `Disconnect-HPEGL` has not been used. In other words, as long as your session is active. This data is sensitive because it contains all you need to make API calls with an application API such as Compute Ops Management, Data Services Cloud Console, etc. To get a more complete example of how to deeply interact with Compute Ops Management, see [Interaction-with-COM_Sample](https://github.com/HewlettPackard/POSH-HPEGreenLake/blob/master/Samples/Interaction-with-COM_Sample.ps1) script sample.
  >
  > **Note**: To store the API credentials beyond the duration of the session, the cmdlet provides a `Location` parameter. This parameter can be used with `New-HPEGLAPIcredential` to save the API credentials in a directory and the `Encrypt` parameter can be utilized to encrypt the API credentials before exporting the JSON file into the designated `Location` directory.

  * `Remove-HPEGLAPIcredential`: to delete an API credential of an application instance.

  > **Note**: Once API credentials are deleted, access to the application instance API is lost permanently. This is because API credentials are used to authenticate and authorize access to the API. When the credentials are deleted, the corresponding API client ID is also invalidated, which means that any requests made using those credentials will be rejected by the API server.

## Managing subscriptions with the HPE GreenLake PowerShell Library

The main cmdlets for managing subscriptions in the HPE GreenLake Platform are the followings:

* To get information about subscriptions: 

  * `Get-HPEGLDeviceSubscription`: to get information about your device subscriptions available in your HPE GreenLake account. Several parameters can be used to display the subscriptions with available quantity, the subscriptions that are expired or not expired, etc. You can combine parameters to obtain for example only the subscription keys that have not expired and for which there are still licenses available: `Get-HPEGLDeviceSubscription -NotExpired -Available` 
* To manage device subscriptions:

  * `Add-HPEGLDeviceSubscription`: to add device subscription to the HPE GreenLake account.
  * `Set-HPEGLDeviceAutoSubscription`: to set automatic subscription assignment. This feature automatically assigns a subscription to any supported device that is added to the HPE GreenLake platform.
  * `Remove-HPEGLDeviceAutoSubscription`: to remove an automatic assignment of subscriptions.
* To apply subscription key to devices:

  * `Set-HPEGLDeviceSubscription`: to apply a subscription key to one or more devices. 

  >  **Note**: When the auto device subscription is not is not supported or not enabled for the type of device you use, you need to manually apply a subscription key.

  * `Remove-HPEGLDeviceSubscription`: to detach devices from a subscription key. 

# Summary

In this blog, we have introduced you to the primary cmdlets that are provided by this library. However, there are more cmdlets available and much more to explore. Nevertheless, you now possess the necessary knowledge to begin testing, to develop your own PowerShell script to start automating your tasks and experience greater productivity and afficiency.

If you encounter any questions, opinions, or problems during your testing, it's highly recommended that you [report](https://github.com/HewlettPackard/POSH-HPEGreenLake/issues) them on the library’s GitHub page. This can help improve the library and potentially benefit other users who may be facing similar issues. 

# Want more?

* [HPE GreenLake Developer Portal](https://developer.greenlake.hpe.com/).
* To learn more about the HPE GreenLake Platform, refer to the [HPE GreenLake Edge to Cloud Platform User Guide](https://support.hpe.com/hpesc/public/docDisplay?docId=a00120892en_us).