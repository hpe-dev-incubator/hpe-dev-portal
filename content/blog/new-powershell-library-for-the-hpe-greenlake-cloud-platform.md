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


CCS, short for Common Cloud Services, offers a multitude of API-enabled services that serve various functions. The primary ones being:
-	**Registration**: in charge of the user registration. Includes email verification, account creation and onboarding, HPE IDP (Identity Provider) with integration with PING Identity as the OIDC/RP provider (Relying Party performs user authentication, user consent and token issuance)
-	**Authentication**: takes care of the user authentication (aka AuthN) but also CCS to applications authentication. Includes unified login, Single or MFA or SSO (third party), federated authentication with customer’s IDP, single logout, user management, supports increased security with PKCE (Proof Key for Code Exchange, pronounced ‘pixy”) for OAuth 2.0. 
-	**Authorization**: provides authorization service for CCS (aka AuthZ), includes unified RBAC (Role-Based Access Control for users), custom roles and RRP (Resource Restriction Policy). Includes role creation, resource assignment to a role, role assignment to user…
-	**Device activation and inventory**: ZTP (Zero Touch Provisioning) and Asset inventory (contract and customer order processing), includes device firmware management (firmware repository for resources, latest FW check, FW upgrade, baseline upgrade).
-	**Subscription management**: Subscription inventory, support for different consumption models.
