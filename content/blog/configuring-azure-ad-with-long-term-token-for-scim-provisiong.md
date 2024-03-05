---
title: Configuring Azure AD with Long Term Token for SCIM Provisiong
date: 2024-03-05T22:06:07.623Z
priority: 9
author: Meena Krishnamoorthy
authorimage: /img/Avatar1.svg
disable: false
---
Azure Active Directory (Azure AD) is Microsoft's cloud-based identity and access management service, designed to simplify user authentication and authorization across various applications and platforms. It offers a centralized solution for managing user identities, enforcing security policies, and facilitating seamless access to cloud-based resources. Azure AD automatic user provisioning simplifies the creation, maintenance, and removal of user identities in SaaS applications based on business rules.

The Azure AD provisioning service provisions users to GreenLake portal by connecting to user management API endpoints provided by GreenLake IAM. These user management API endpoints allow Microsoft Entra ID to programmatically create, update, and remove users and groups. The Azure AD provisioning service uses GreenLake tenant API token to provision users and groups to GreenLake IAM. Tenant API tokens are only valid for fifteen minutes. Because Azure AD cannot automatically renew the token, long-term tokens are required.\
\
I'll explain the process for configuring Azure AD to use a long-term token for user and group provisioning.

## C﻿ontents

## \
T﻿erms used in this blog post

* **A﻿D**: Active Directory
* **I﻿AM**: Identity and Access Management

## S﻿teps to configure long-term token in Azure AD