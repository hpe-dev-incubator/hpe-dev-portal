---
title: Understanding HPE GreenLake Central Identity & Access Management
date: 2022-04-19T17:43:23.594Z
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

Spaces enable you to grant access to a defined subset of resources within a tenant. Access to resources in a space is managed through the assignment of users, user groups or API clients to roles in a space. There is a default space where users land automatically upon login. The all resources space is a dynamic list of all resources in a tenant. 

Users can be granted access to multiple spaces.

## Roles

Roles are a named set of permissions used to  access resources.  They are assigned to users, user groups or API clients to grant them permissions for a specific set of resources on a space.

Roles are available for the services that are available within the tenant. The following table is incomplete but lists the most common roles and definitions.

| **Role**                                        | **Responsibility**                                                                                                                                                   |     |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| **HPE Consumption Analytics**                   |                                                                                                                                                                      |     |
| Consumption Analytics Viewer                    | View cost information in HPE GreenLake Central (Customer only)                                                                                                       |     |
| Consumption Analytics Contributor               | View cost information in HPE GreenLake Central and access HPE Consumption Analytics Platform (Customer only)                                                         |     |
| **HPE GreenLake Capacity Planning**             |                                                                                                                                                                      |     |
| Capacity Planning Viewer                        | Read capacity planning information                                                                                                                                   |     |
| **HPE GreenLake Billing**                       |                                                                                                                                                                      |     |
| Billing Contributor                             | View billing information and edit downstream rates                                                                                                                   |     |
| Billing Viewer                                  | View billing information                                                                                                                                             |     |
| Billing Usage Viewer                            | View monthly charges card and report (usage information only - no cost information)                                                                                  |     |
| **HPE GreenLake for Private Cloud**             |                                                                                                                                                                      |     |
| Private Cloud Tenant Owner                      | Administer HPE GreenLake for private cloud dashboard<br>Manage scheduling and activity<br>Manage infrastructure<br>Manage provisioning                               |     |
| Private Cloud Tenant Contributor                | Manage self-service VMs and app provisions                                                                                                                           |     |
| **HPE GreenLake for Containers**                |                                                                                                                                                                      |     |
| Container Platform Cluster Owner                | Manage predefined and custom cluster blueprints, along with machine blueprints                                                                                       |     |
| Container Platform Cluster Resource Contributor | Manage resources within a cluster namespace                                                                                                                          |     |
| **HPE GreenLake for ML Ops**                    |                                                                                                                                                                      |     |
| MLOps Admin and IAM Owner                       | Install services and manage projects, resources, and users, and view sites information                                                                               |     |
| MLOps Project Admin                             | Build, train, and deploy models, launch the AI/ML services<br>Corresponds to Project Administrator role in HPE Ezmeral Runtime Enterprise                            |     |
| MLOps Project Member                            | To build, train, and deploy models, launch the AI/ML projects and consume the AI/ML services<br>Corresponds to Project Member role in HPE Ezmeral Runtime Enterprise |     |
| **HPE GreenLake for HPC**                       |                                                                                                                                                                      |     |
| HPCaaS Admin                                    | Perform all actions                                                                                                                                                  |     |
| HPCaaS Job Contributor                          | Manage job and job-related information                                                                                                                               |     |
| HPCaaS Viewer                                   | View only                                                                                                                                                            |     |

For more detail on roles, please refer to the HPE GreenLake Central User Guide which can be found here: [HPE GreenLake Central User Guide](https://support.hpe.com/hpesc/public/docDisplay?docId=a00092451en_us&page=index.html)

* Owner roles apply to different aspects of Services. Some administrator Roles are only available to HPE Information Technology Operations Center (ITOC) and DevOps teams.
* Contributor roles also apply to services. These roles allow non-admin operations within a service.
* Viewer roles are 'read-only' roles which can be used to allow users to access services but not to modify them in any way.
* Custom roles can also be defined. These allow arbitrary collections of permissions to be combined into one or more roles and can be assigned as normal.

# Tenant On-Boarding

New tenants are requested via an HPE representative. The request includes an initial contact email address. This new user account is associated with the new tenant. Once the tenant is created and the billing account is promoted into production, the contact email address receives an email invitation to activate their account. The new user can then log into HPE GreenLake Central and can start the process of setting up their spaces, user groups, role assignments, etc. They can also invite other users to join the tenant and perform other activities relevant to the specific user permissions.

## Inviting Users

Once a tenant administrator is on-boarded, they can invite their users to join the tenant.

1. Access the Identity & Access Service within the wrench icon.
2. Select the **Users** Tab
3. Under the **Actions** pull-down, choose Invite User

<img src="relative-path-of-your-image-in-the-form: /img/invite-user.png" width="480" height="538" alt="Invite User">

The invited user receives an email inviting them to join the tenant. Once the user activates their account they can log into HPE GreenLake Central and switch to the tenant. The tenant administrator can add the new User to various User Groups, etc.

## Creating and modifying User Groups

1. Access the Identity & Access Service within the Wrench icon.
2. Select the User Groups Tab
3. To modify an existing User Group, click on it from the list of User Groups

   * Members can be added by selecting the Members Tab and selecting 'Add Members' under the Actions pull-down
   * Members can be removed from the User Group by clicking on the Trash icon beside the Member name
4. To create a new User Group, click on the 'Create User Group' button
5. Enter a User Group Name and Description
6. Once the User Group has been created it may be modified using the instructions above

## Creating and modifying Spaces

1. Access the Identity & Access Service within the Wrench icon.
2. Select the Spaces Tab
3. To modify an existing Space, click on it from the list of Spaces

   1. Users and User Groups can be added by selecting the Assignments Tab and selecting 'Create Assignment' under the Actions pull-down
   2. Select appropriate Role(s) for the Space

      * Users and User Groups can be removed from the Space by clicking on the Trash icon beside the Subject name
      * Resources can be added and removed from the Space by selecting the Resources Tab and selecting 'Update Resources' under the Actions pull-down
4. To create a new Space, click on the 'Create Space' button

   * Enter a Space Name and Parent Space
   * Select Resources by expanding the 'All Resources' list

# Examples

## Example 1: ACME Corp.

### Design

![](/img/iam-document-example-1-tenant-1-1-.jpg "Example 1: ACME Corp.")

Customer ACME Corp. has users spread around the globe. The Users' email addresses are all of the form [xyz@acmecorp.com.](mailto:xyz@acmecorp.com.) ACME Corp. has several Departments which are also distributed around the globe. The customer wishes to use HPE GreenLake Private Cloud to create and manage virtual machines and Containers on behalf of the various departments. They also wish to use HPE GreenLake for ML Ops to examine their internal data and perform AI operations upon it and GreenLake for containers to run a Sales Application.

The Departments of ACME Corp. Are:

* Office of CEO
* IT Department
* Sales Department
* R&D Department
* Data Science Department

Since all users in ACME Corp. have the same email address format, and since all departments wish to be able to use all Resources, only one Tenant is required. ACME Corp wishes to be billed centrally for all services so a single Billing Account is sufficient.

Next, they can create User Groups for each Department, e.g.

* Office of CEO Users
* IT Department Users
* Sales Department Users
* R&D Department Users
* Data Science Users

Each User Group will consist of sets of users from each Department:

![](/img/sales-department-users-members.png "Sales Department Users")

Next, the Tenant Administrator can create Spaces for each Department, e.g.

* Office Of CEO Space
* IT Department Space
* Sales Department Space
* R&D Department Space
* Data Science Space

When each Space is created, appropriate Resources are chosen and mapped to the Space:

![](/img/resource-selection.png "Resource Selection")

#### Office of CEO

The Office of CEO Space needs access to Billing across the entire Company. They may also use HPE GreenLake for Private Cloud to run some Virtual Machines. Finally, they occasionally run some AI on internal data.

![](/img/office-of-ceo-space-resources.png)

The User Group is assigned appropriate Roles for the selected Services:

![](/img/office-of-ceo-space-assignments.png "Office of CEO Space")

The Space looks like this to the Users:

![](/img/office-of-ceo-space-view.png "Office of CEO Space View")

#### IT Department

The IT Department Space would need access to GreenLake for Private Cloud, HPE GreenLake for ML Ops and HPE GreenLake for Containers Resources. This would allow users in this Department to manage the Resources running in both Services. Users in this department require Admin Roles for the selected Resources.

![](/img/it-department-space-resources.png "IT Department Space Resources")

The User Group is assigned appropriate Roles for the selected Services:

![](/img/it-department-space-assignments.png "IT Department Space Assignments")

The Space looks like this to the Users:

![](/img/it-department-space-view.png "IT Department Space View")

#### Sales Department

The Sales Department Space runs a series of Containers which provide a service to their field sales users. Since they maintain their own code they have two Clusters: Integration and Production. They do not use other services.

![](/img/sales-department-space-resources.png "Sales Department Space Resources")

The User Group is assigned appropriate Roles for the selected Services:

![](/img/sales-department-space-assignments.png "Sales Department Space Assignments")

The Space looks like this to the Users:

![](/img/sales-department-space-view.png)

#### R&D Department

The R&D Department accesses a series of Virtual Machines in the HPE GreenLake for Private Cloud Service. Since the service is managed by the IT Department, these users do not need administrative rights.

#### Data Science Users

These users access several HPE GreenLake for ML Ops projects. The service is managed by the IT Department.

## Example 2: ABC Corp

### Design

![](/img/iam-document-example-2-tenant-1-1-.jpg "Example 2: ABC Corp")

ABC Corp is a small company with three departments, A, B and C. Since the company is small, some employees work across departments. ABC Corp Uses multiple GreenLake Services, each with separate Billing Accounts. A single Tenant is sufficient for the small number of employees of ABC Corp.

The Tenant Administrator for ABC Corp can create User Groups for each Department, e.g.

* Department A Users

  * Users: John, Mary
* Department B Users

  * Users: Mary
* Department C Users

  * Users: Robert

NOTE: User Mary is a member o f both Department A Users and Department B Users User group.

Next, the Tenant Administrator can create Spaces for each Department and select Billing Account Resources and User Groups as appropriate, e.g.

Department A Space

* Billing Resource HP-AMS-DMO-USA-99918
* Billing Resource HP-AMS-DMO-USA-99919
* Department A Users

Department B Space

* Billing Resource HP-AMS-DMO-USA-99920
* Department B Users

Department C Space

* Billing Resource HP-AMS-DMO-USA-99918
* Billing Resource HP-AMS-DMO-USA-99920
* Department C Users

In this way, user John, who is a member of Department A Users would only have access to Department A Space and would be able to access Billing Resources HP-AMS-DMO-USA-99918 and HP-AMS-DMO-USA-99919.

User Mary, who is a member of both Department A Users and Department B Users would have access to both Department A Space and Department B Space. User Mary would be able to see any of the Billing Resources by selecting the appropriate Space.

User Robert who is a member of the Department C Users would be able to access the Department C Space with access to Billing Resources HP-AMS-DMO-USA-99918 and HP-AMS-DMO-USA-99920.

## Example 3: Big And Small Corp

### Design

![](/img/iam-document-example-3-tenant-1-1-.jpg)

![](/img/iam-document-example-3-tenant-2-1-.jpg)

![](/img/iam-document-example-3-tenant-3-1-.jpg)

Big and Small Corp is a large multinational company with several divisions. Each division is located in a different region and manages its services separately. Big and Small (USA) is headquartered in the US and is the holding company for all US-based business. This division runs a large Marketing service which has a web presence, hosted on a Public Cloud. Big and Small (USA) would like to replace the Public Cloud with HPE GreenLake for Private Cloud and manage the charges for this service within the division. Big and Small (Europe) is headquartered in Berlin, Germany. This division designs and manufactures a wide range of products for the European market. To support the division, they currently own a large HPC cluster, which they would like to replace with HPE GreenLake for HPC. This division also would like to manage their GreenLake expenses in a separate account. Finally, Big and Small (Japan) is an acquisition, based in Tokyo, Japan. This division had a previous relationship with HPE and already has a billing account, which they would like to retain. This division is responsible for future product development. They would like to use HPE GreenLake for ML Ops to develop innovative new products.

Since some divisions of Big and Small Corp came via acquisition, they have different email addresses to other divisions. Therefore it is decided that each division should have a separate Tenant. This will allow each division to manage their own GreenLake Services and billing accounts.

**NOTE: Unless the customer has multiple entities and/or multiple email domains – HPE recommends consolidating all Resources under a single Tenant. This example is to show that multiple Tenants/Billing Accounts are supported but is not recommended unless required.**

Each division has their own unique billing account:

| Division               | Billing Account       |
| ---------------------- | --------------------- |
| Big and Small (USA)    | HP-AMS-DMO-USA-99918  |
| Big and Small (Europe) | HP-EMEA-DMO-DEU-99919 |
| Big and Small (Japan)  | HP-APJ-DMO-JPN-99920  |

A Tenant for Big and Small (USA) is created. The main service in this Tenant is HPE GreenLake for Private Cloud. This is configured such that the metrics from this service are sent to the Billing Account 'HP-AMS-DMO-USA-99918'.

Each Department has their own separate User Group, e.g. Department A Users. Users from the various Departments are added to the appropriate User Groups.

A Space 'Main Space' is created within the IAM Service of this Tenant and Resources are added. In this case, the Resource for the Billing Account HP-AMS-DMO-USA-99918 and also the Resource for the HPE GreenLake for Private Cloud are added. Finally, the User Groups are assigned to the Space with the appropriate Roles.

A Tenant for Big and Small (Europe) is created. The main service in this Tenant is HPE GreenLake for HPC. This is configured such that the metrics from this service are sent to the Billing Account 'HP-EMEA-DMO-DEU-99919'.

Each Department has their own separate User Group, e.g. Department D Users. Users from the various Departments are added to the appropriate User Groups.

A Space 'Main Space' is created within the IAM Service of this Tenant and Resources are added. In this case, the Resource for the Billing Account HP-EMEA-DMO-DEU-99919 and also the Resource for the HPE GreenLake for HPC are added. Finally, the User Groups are assigned to the Space with the appropriate Roles.

A Tenant for Big and Small (Japan) is created. The main service in this Tenant is HPE GreenLake for ML Ops. This is configured such that the metrics from this service are sent to the Billing Account 'HP-APJ-DMO-JPN-99920'.

Each Department has their own separate User Group, e.g. Department F Users. Users from the various Departments are added to the appropriate User Groups.

A Space 'Main Space' is created within the IAM Service of this Tenant and Resources are added. In this case, the Resource for the Billing Account HP-APJ-DMO-JPN-99920 and also the Resource for the HPE GreenLake for ML Ops are added. Finally, the User Groups are assigned to the Space with the appropriate Roles.

# Conclusion

As you can see, the key to configuring Identiy and Access Management in a Tenant is to understand the building blocks and how to make informed decisions on how to design IAM resources to match customer requirements. Finally, the examples will help you to see how the flexibility of GreenLake Central Identity and Access Management allows an almost infinite number of possible configurations, giving the flexibility to match diverse customer requirements. 

Please feel free to reach out directly if you have any questions.