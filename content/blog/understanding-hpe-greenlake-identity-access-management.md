---
title: Understanding HPE GreenLake Central Identity & Access Management
date: 2022-05-10T07:35:34.558Z
author: John Lenihan
authorimage: /img/mugshot.png
tags:
  - hpe-greenlake
---


# Introduction

When configuring an HPE GreenLake Central tenant for diverse customer Identity and Access Management (IAM) needs, it is important to understand how the various features work, so you can take appropriate actions. Once you understand the features and how they work, you'll be able to arrange resources in an optimal way. It will also prevent the need to reconfigure anything in the future. 

With this in mind, I'd like to begin by describing the various features of Identity and Access Management available in HPE GreenLake Central and how to perform common tasks associated with IAM configuration. I'll also include some simple steps you can follow when designing IAM configurations based on customer requirements. Finally, I'll present several fictitious customer setups and show you how each is configured.

# IAM Definitions

## Users

All HPE GreenLake Central users start with getting an HPE GreenLake Central account and profile. Users are invited by a tenant administrator, or another user with appropriate permissions, to join the HPE GreenLake Central tenant.  HPE can assist with user management and can configure your HPE GreenLake environment to use the Customer's Single Sign-On (SSO) mechanism through a custom Services engagement. **NOTE: All users in a tenant have the same email domain name.**

## API Clients

API clients are nonhuman HPE GreenLake Central users for programmatic access to HPE GreenLake Central. They are assigned spaces and roles, similar to a regular user. 

## Tenants

A tenant is an isolated environment with unique users and workloads.  Within a tenant, users are invited to join the tenant by a tenant administrator or another user with the appropriate permissions.

## User Groups

User groups are a named set of users that share a common job function or access requirements. 

## Spaces

Spaces enable you to grant access to a defined subset of resources within a tenant. Resources can be a part of multiple spaces. Access to resources in a space is managed through the assignment of users, user groups or API clients to roles in a space. There is a default space where users land automatically upon login if they are assigned appropriate roles for that space. The all resources space is a dynamic list of all resources in a tenant. 

Users can be granted access to multiple spaces.

## Roles

Roles are a named set of permissions used to access resources. They are assigned to users, user groups or API clients. Roles grant permissions for a specific set of resources in a space.

Roles are available for the services that are available within the tenant. The following table is incomplete but lists the most common roles and definitions.

| **Role**                          | **Responsibility**                                                                                           |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **HPE Consumption Analytics**     |                                                                                                              |
| Consumption Analytics Viewer      | View cost information in HPE GreenLake Central (Customer only)                                               |
| Consumption Analytics Contributor | View cost information in HPE GreenLake Central and access HPE Consumption Analytics Platform (Customer only) |

\|
| **HPE GreenLake Capacity Planning**             |                                                                                                                                                                                                                           |
| Capacity Planning Viewer                        | Read capacity planning information                                                                                                                                                                                        |
|
| **HPE GreenLake Billing**                       |                                                                                                                                                                                                                           |
| Billing Contributor                             | View billing information and edit downstream rates                                                                                                                                                                        |
| Billing Viewer                                  | View billing information                                                                                                                                                                                                  |
| Billing Usage Viewer                            | View monthly charges card and report (usage information only - no cost information)                                                                                                                                       |
|
| **HPE GreenLake for Private Cloud Enterprise: Virtual Machines**             |                                                                                                                                                                                                                           |
| Private Cloud Tenant Owner                      | Administer HPE GreenLake for Private Cloud dashboard<br>Manage scheduling and activity<br>Manage infrastructure<br>Manage provisioning                                                                                    |
| Private Cloud Tenant Contributor                | Manage self-service VMs and app provisions                                                                                                                                                                                |
|
| **HPE GreenLake for Private Cloud: Containers on Virtual Machines**                |                                                                                                                                                                                                                           |
| Container Platform Cluster Owner                | Manage predefined and custom cluster blueprints, along with machine blueprints                                                                                                                                            |
| Container Platform Cluster Resource Contributor | Manage resources within a cluster namespace                                                                                                                                                                               |
|
| **HPE GreenLake for ML Ops**                    |                                                                                                                                                                                                                           |
| MLOps Admin and IAM Owner                       | Install services and manage projects, resources, and users, and view sites information                                                                                                                                    |
| MLOps Project Admin                             | Build, train, and deploy models, launch the AI/ML services<br>Corresponds to Project Administrator role in HPE Ezmeral Runtime Enterprise (previously known as HPE Ezmeral Container Platform)                            |
| MLOps Project Member                            | To build, train, and deploy models, launch the AI/ML projects and consume the AI/ML services<br>Corresponds to Project Member role in HPE Ezmeral Runtime Enterprise (previously known as HPE Ezmeral Container Platform) |
|
| **HPE GreenLake for HPC**                       |                                                                                                                                                                                                                           |
| HPCaaS Admin                                    | Perform all actions                                                                                                                                                                                                       |
| HPCaaS Job Contributor                          | Manage job and job-related information                                                                                                                                                                                    |
| HPCaaS Viewer                                   | View only                                                                                                                                                                                                                 |

For more detail on roles, please refer to the HPE GreenLake Central User Guide which can be found here: [HPE GreenLake Central User Guide](https://support.hpe.com/hpesc/public/docDisplay?docId=a00092451en_us&page=index.html)

* Owner roles apply to different aspects of Services. Some administrator Roles are only available to HPE Information Technology Operations Center (ITOC) and DevOps teams.
* Contributor roles also apply to services. These roles allow non-admin operations within a service.
* Viewer roles are 'read-only' roles which can be used to allow users to access services but not to modify them in any way.
* Custom roles can also be defined. These allow arbitrary collections of permissions to be combined into one or more roles and can be assigned as normal.

# Tenant On-Boarding

New tenants are requested via an HPE representative. The request includes an initial contact email address. This new user account is associated with the new tenant. Once the tenant is created and the billing account is promoted into production, the contact email address receives an email invitation to activate their account. The new user can then log into HPE GreenLake Central and can start the process of setting up their spaces, user groups, role assignments, etc. They can also invite other users to join the tenant and perform other activities relevant to the specific user permissions.

## Inviting Users

Once a tenant administrator is on-boarded, they can invite their users to join the tenant.

1. Access the User Management Service within the **wrench** icon.
2. Select the **Users** Tab
3. Under the **Actions** pull-down, choose Invite User

<img src="/img/invite-user.png" width="480" height="538" alt="Invite User">

The invited user receives an email inviting them to join the tenant. Once the user activates their account they can log into HPE GreenLake Central and switch to the tenant. The tenant administrator can add the new User to various User Groups, etc. The user will only receive an invitation email if they have not already been invited to join a tenant.

## Creating and modifying User Groups

1. Access the User Management Service within the **wrench** icon.
2. Select the **User Groups** tab
3. To modify an existing user group, click on it from the list of user groups

   * Members can be added by selecting the **Members** tab and selecting *Add Members* under the **Actions** pull-down
   * Members can be removed from the user group by clicking on the **Trash** icon beside the member name
4. To create a new user group, from the **User Groups** tab, click on the *Create User Group* button
5. Enter a user group name and description
6. Once the user group has been created it may be modified using the instructions above

## Creating and Modifying Spaces

1. Access the Management Service within the **wrench** icon.
2. Select the **Spaces** tab
3. To modify an existing space, click on it from the list of spaces

   1. Users and user groups can be added by selecting the **Assignments** tab and selecting *Create Assignment* under the **Actions** pull-down
   2. Select appropriate role(s) for the space

      * Users and user groups can be removed from the space by clicking on the **Trash** icon beside the subject name
      * Resources can be added and removed from the space by selecting the **Resources** tab and selecting *Update Resources* under the **Actions** pull-down
4. To create a new space, click on the **Create Space** button

   * Enter a space name and parent space   
   * Select **Resources** by expanding the **All Resources** list   

# Let's Explore Some Fictitious Customer Examples

## Example 1: ACME Corp.

### Design

![](/img/iam-document-example-1-tenant-1-1a.jpg "Example 1: ACME Corp.")

Customer ACME Corp. has users spread around the globe. The users' email addresses all take the form of [xyz@acmecorp.com.](mailto:xyz@acmecorp.com.) ACME Corp. has several departments that are also distributed around the globe. ACME Corp. wishes to use HPE GreenLake Private Cloud Enterprise to create and manage virtual machines and containers on behalf of the various departments. They also wish to use HPE GreenLake for ML Ops to examine their internal data and perform AI operations upon it and use HPE GreenLake for containers to run a sales application.

The ACME Corp. departments include:

* Office of CEO
* IT department
* Sales department
* R&D department
* Data Science department

Since all users in ACME Corp. have the same email address format, and since all departments wish to be able to use all resources, only one tenant is required. ACME Corp wishes to be billed centrally for all services so a single billing account is sufficient.

Once this is done, they can create user groups for each department, e.g.

* Office of CEO users
* IT department users
* Sales department users
* R&D department users
* Data Science department users

Each user group will consist of sets of users from each department:

![](/img/sales-department-users-members.png "Sales Department Users")

Next, the tenant administrator can create spaces for each department, e.g.

* Office of CEO space
* IT department space
* Sales department space
* R&D department space
* Data Science department space

When each space is created, appropriate resources are chosen and mapped to the space:

<img src="/img/resource-selection.png" width="600" height="359" alt="Resource Selection">

#### Office of CEO

The Office of CEO space needs access to billing across the entire company. They may also use HPE GreenLake for Private Cloud Enterprise to run some virtual machines. Finally, they occasionally run some AI on internal data.

![](/img/office-of-ceo-space-resources.png)

The user group is assigned appropriate roles for the selected services:

![](/img/office-of-ceo-space-assignments.png "Office of CEO Space")

The space looks like this to the users:

![](/img/office-of-ceo-space-view.png "Office of CEO Space View")

#### IT Department

The IT department space would need access to HPE GreenLake Enterprise Private Cloud: Virtual Machines, HPE GreenLake for ML Ops and HPE GreenLake for Private Cloud Enterprise: Containers resources. This would allow users in this department to manage the resources running in both services. Users in this department require admin roles for the selected resources.

![](/img/it-department-space-resources.png "IT Department Space Resources")

The user group is assigned appropriate roles for the selected services:

![](/img/it-department-space-assignments.png "IT Department Space Assignments")

The space looks like this to the users:

![](/img/it-department-space-view.png "IT Department Space View")

#### Sales Department

The sales department space runs a series of containers that provide a service to their field sales users. Since they maintain their own code they have two clusters: Integration and Production. They do not use other services.

![](/img/sales-department-space-resources.png "Sales Department Space Resources")

The user group is assigned appropriate roles for the selected services:

![](/img/sales-department-space-assignments.png "Sales Department Space Assignments")

The space looks like this to the users:

![](/img/sales-department-space-view.png)

#### R&D Department

The R&D department accesses a series of virtual machines in the HPE GreenLake for Private Cloud Enterprise: Virtual Machines service. Since the service is managed by the IT department, these users do not need administrative rights.

#### Data Science Users

These users access several HPE GreenLake for ML Ops projects. The service is managed by the IT department.

## Example 2: ABC Corp.

### Design

![](/img/iam-document-example-2-tenant-1-1-.jpg "Example 2: ABC Corp")

ABC Corp. is a small company with three departments, A, B and C. Since the company is small, some employees work across departments. ABC Corp. uses multiple HPE GreenLake services, each with separate billing accounts. A single tenant is sufficient for the small number of employees of ABC Corp.

The tenant administrator for ABC Corp can create user groups for each department, e.g.

* Department A users

  * Users: John, Mary
* Department B users

  * Users: Mary
* Department C users

  * Users: Robert

NOTE: User Mary is a member of both Department A and Department B user groups.

Next, the tenant administrator can create spaces for each department and select billing account resources and user groups as appropriate, e.g.

Department A space

* Billing resource HP-AMS-DMO-USA-99918
* Billing resource HP-AMS-DMO-USA-99919
* Department A users

Department B space

* Billing resource HP-AMS-DMO-USA-99920
* Department B users

Department C space

* Billing resource HP-AMS-DMO-USA-99918
* Billing resource HP-AMS-DMO-USA-99920
* Department C users

In this way, user John, who is a member of Department A users would only have access to Department A space and would be able to access billing resources HP-AMS-DMO-USA-99918 and HP-AMS-DMO-USA-99919.

User Mary, who is a member of both Department A users and Department B users would have access to both Department A space and Department B space. User Mary would be able to see any of the billing resources by selecting the appropriate space.

User Robert who is a member of the Department C users, would be able to access the Department C space with access to billing resources HP-AMS-DMO-USA-99918 and HP-AMS-DMO-USA-99920.

## Example 3: Big and Small Corp

### Design

![](/img/iam-document-example-3-tenant-1-1a.jpg)

![](/img/iam-document-example-3-tenant-2-1-.jpg)

![](/img/iam-document-example-3-tenant-3-1-.jpg)

Big and Small Corp. is a large multinational company with several divisions. Each division is located in a different region and manages its services separately. Big and Small (USA) is headquartered in the US and is the holding company for all US-based business. This division runs a large marketing service which has a web presence, hosted on a public cloud. Big and Small (USA) would like to replace the public cloud with HPE GreenLake for Private Cloud Enterprise and manage the charges for this service within the division. 

Big and Small (Europe) is headquartered in Berlin, Germany. This division designs and manufactures a wide range of products for the European market. To support the division, they currently own a large HPC cluster, which they would like to replace with HPE GreenLake for HPC. This division also would like to manage their HPE GreenLake expenses in a separate account. 

Finally, Big and Small (Japan) is an acquisition, based in Tokyo, Japan. This division had a previous relationship with HPE and already has a billing account, which they would like to retain. This division is responsible for future product development. They would like to use HPE GreenLake for ML Ops to develop innovative new products.

Since some divisions of Big and Small Corp. came via acquisition, they have different email addresses than the other divisions. Therefore, it is decided that each division should have a separate tenant. This will allow each division to manage their own HPE GreenLake Services and billing accounts.

**NOTE: Unless the customer has multiple entities and/or multiple email domains – HPE recommends consolidating all resources under a single tenant. This example is to show that multiple tenants/billing Accounts are supported but is not generally recommended unless specifically required.**

Each division has their own unique billing account:

| Division               | Billing Account       |
| ---------------------- | --------------------- |
| Big and Small (USA)    | HP-AMS-DMO-USA-99918  |
| Big and Small (Europe) | HP-EMEA-DMO-DEU-99919 |
| Big and Small (Japan)  | HP-APJ-DMO-JPN-99920  |

A tenant for Big and Small (USA) is created. The main service in this tenant is HPE GreenLake for Private Cloud Enterprise. This is configured such that the metrics from this service are sent to the billing account 'HP-AMS-DMO-USA-99918'.

Each department has their own separate user group, e.g. Department A users. Users from the various departments are added to the appropriate user groups.

A space, '**Main Space**' is created within the IAM Service of this tenant and resources are added. In this case, the resource for the billing account HP-AMS-DMO-USA-99918 and also the resource for the HPE GreenLake for Private Cloud Enterprise are added. Finally, the user groups are assigned to the space with the appropriate roles.

A tenant for Big and Small (Europe) is created. The main service in this tenant is HPE GreenLake for HPC. This is configured such that the metrics from this service are sent to the billing account 'HP-EMEA-DMO-DEU-99919'.

Each department has their own separate user group, e.g. Department D users. Users from the various departments are added to the appropriate user groups.

A space '**Main Space**' is created within the IAM Service of this tenant and resources are added. In this case, the resource for the billing account HP-EMEA-DMO-DEU-99919 and also the resource for the HPE GreenLake for HPC are added. Finally, the user groups are assigned to the space with the appropriate roles.

A tenant for Big and Small (Japan) is created. The main service in this tenant is HPE GreenLake for ML Ops. This is configured such that the metrics from this service are sent to the billing account 'HP-APJ-DMO-JPN-99920'.

Each department has their own separate user group, e.g. Department F users. Users from the various departments are added to the appropriate user groups.

A space '**Main Space**' is created within the IAM service of this tenant and resources are added. In this case, the resource for the billing account HP-APJ-DMO-JPN-99920 and also the resource for the HPE GreenLake for ML Ops are added. Finally, the user groups are assigned to the space with the appropriate roles.

# Conclusion

As you can see, the key to configuring Identity and Access Management in a tenant is to understand the building blocks and how to make informed decisions on how to design IAM resources to match customer requirements. I hope these examples will help you to see how the flexibility of HPE GreenLake Central Identity and Access Management allows an almost infinite number of possible configurations, giving the flexibility to match diverse customer requirements. 

Please feel free to reach out directly to me on the [HPE Developer Slack Workspace](https://slack.hpedev.io/) in the [\#hpe-greenlake](https://hpedev.slack.com/archives/C02EG5XFK8Q) channel.