---
title: "Hybrid observability service – Part 2: Initial configuration to enable
  the discovery of resources in HPE GreenLake Flex Solutions"
date: 2025-05-26T18:59:30.769Z
author: Denis Choukroun
authorimage: https://gravatar.com/avatar/f66dd9562c53567466149af06ae9d4f1?s=96
disable: false
tags:
  - hybrid-observability-flex-solutions
  - hybrid observability
  - OpsRamp
---
<style>
li {
   font-size: 27px;
   line-height: 33px;
   max-width: none;
}
</style>


In my previous blog post <hotlink to 1st blog post>, I covered the steps to provision and activate the hybrid observability service powered by HPE OpsRamp Software in a HPE GreenLake cloud workspace as part of the HPE GreenLake Flex Solutions. You must complete this initial step before configuring the hybrid observability service to enable the observability of your IT infrastructure resources.

This is Part 2 of the blog series, and it explores the **initial configuration** of the hybrid observability service to **enable the discovery** of resources before they can be monitored, and metrics data collected from the resources. 
As requirements to enable the discovery of physical resources included in your HPE GreenLake Flex Solutions contract, I’ll start setting up the hybrid observability service by:

* Creating a **client account**. 
* Managing user accounts and permissions for your organization.
* Installing and registering a **gateway collector appliance** in a virtual environment. 

In Part 3 of the blog series, I’ll explore how to enable the observability of IT infrastructure devices included in the HPE GreenLake Flex Solutions by deploying integration modules and assigning monitoring configurations to a set of resources.

## Creating a Client Account

When the hybrid observability service powered by HPE OpsRamp is deployed in HPE GreenLake cloud by the **Workspace Administrator**, the service uses a **multi-tenant model** associated with a **partner account**. A partner account is the **master** tenant, including Clients who each have a client account. A Workspace Administrator is the user who created the workspace and has this role assigned by default, or invited users can get this role assigned by the Workspace Administrator.
 
In a multi-tenant model, a _client account_ is a tenant of a partner account. It represents a monitoring and management instance for an individual organization, a business unit, or a specific customer environment.

 > **Note:** By default, a _client account_ is created with the name of the HPE GreenLake workspace. You may want to create additional client accounts for an individual organization, business unit, or customer environment.

To start setting up the environment, log in to the service using an account provisioned with the _Partner Administrator_ role. The Workspace Administrator who provisioned the service in the HPE GreenLake cloud has this role assigned by default.  

> **Note:** The other users with the OpsRamp Access role granted in the workspace will have the role GLP Invited Partner User assigned in the service.

To create a new client account:

1. From the top navigation menu of HPE OpsRamp user interface, select **Setup > Setup**.

[img 1]

2. Select **Clients** on the left navigation bar and click **+Add** to add a new client account. If this is the first client of your partner account, click **Create New**.

[Img 2]

> **Note:** This feature will be made available under **Setup > Account** in an upcoming HPE OpsRamp release.


3. Enter the _Client Name_, _Address_, _Country_, and _Time Zone_. Contact email is also recommended. If you specify a client state, the length must be 3 characters maximum. Then click **Next**.

[Img 3]

4. Keep the default selection for **Product Package** entries for Hybrid Discovery and Monitoring, Event and Incident Management, Remediation and Automation.

[Img 5]

5. Click **Finish**.

6. Once the new client account is created, select the new client account from the list of **clients**.

[Img 6]

7. To see the new client and continue configuring the service, click **OpsRamp** icon on the upper left.

> **Note:** Alternatively, you can log out from the service and log in again from your HPE GreenLake workspace, and then select the **Partner** domain for your organization. You should see the new client account, in our example, **DreamCompany**, on the list of clients. Select the client account to continue with the configuration of the hybrid observability service for the client account.

[ Img 7]

8. Enabling advanced add-ons for the client account, as per the client’s operational requirements, is recommended:

   * Select **Setup > Setup > Accounts > Clients**.
   * Select the **client account** from the list of clients. 
   * Click **Edit** button for the **ADDONS** section and enable the Add-ons. To learn more about the Add-ons, see the [HPE OpsRamp Hybrid Discovery and Monitoring documentation](https://glp.docs.opsramp.com/guides/component-model/#hybrid-discovery-and-monitoring).

> **Note:** To enable client account Add-ons, make sure your HPE GreenLake Workspace details (name, address) do not contain any special characters. 

## Managing User Account

The _Partner Administrator_ role is provided to the HPE GreenLake cloud user who provisioned the hybrid observability service in the workspace. Invited HPE GreenLake users with the _OpsRamp Access_ role granted in the workspace will have the role **GLP Invited Partner User** assigned in the service.

1. When you log in to hybrid observability service user interface powered by HPE OpsRamp, ensure you have selected your partner organization on the top left menu.

2. From the top navigation menu, select **Setup > Account**.

[Img 8]

3. Select the **Users and Permissions** tile.

[Img 9]

4. Select the **Users** tile.

5. Select an invited user who launched and logged in to the service to visualize the details description of the user and the roles. You will see the default role assigned to the user as **GLP Invited Partner User**. You can assign the role of Partner Administrator to an invited user.

In HPE GreenLake Flex Solutions, as _Partner Administrator_, you can manage accounts for your partner organization. You can create permissions sets, roles, user groups, and assign them to users who have been granted _OpsRamp Access_ role in your workspace and launched the hybrid observability service.

> **Note:** In HPE GreenLake Flex Solutions, you cannot assign roles to users at the client account level. 
  
To learn more about account management, refer to the [HPE OpsRamp Account Management documentation](https://glp.docs.opsramp.com/platform-features/feature-guides/account-management/).

## Installing and configuring a gateway collector appliance

Resources need to be discovered before they can be monitored, and metrics collected.  

With the hybrid observability service, you discover, monitor, and manage infrastructure resources (compute, storage, network) included in the HPE GreenLake Flex Solutions using an **agentless** method with a **gateway collector appliance** installed **within** your firewall environment. This appliance can be a virtual machine or a cloud-native application that runs on your own Kubernetes environment.

To learn more about the gateway collector appliance installation and activation procedures, and deployment requirements, refer to the [HPE OpsRamp Platform documentation](ttps://glp.docs.opsramp.com/platform-features/).

There are two types of gateway collectors: 

* [Classic gateway](https://glp.docs.opsramp.com/platform-features/gateways/) that can be installed as a Virtual Machine (VM) in a hypervisor.
* [NextGen gateway](https://glp.docs.opsramp.com/platform-features/nextgen-gateways/) that runs on a Kubernetes environment. The NextGen gateway is a new generation gateway collector appliance, and it is **HPE’s recommended** gateway collector appliance.

> **Note:** Agent-based methods can also be used for the discovery of physical devices running Linux and Microsoft Windows Operating Systems. To learn more about agents, refer to the [HPE OpsRamp Agent documentation](https://glp.docs.opsramp.com/platform-features/agents/).

### Gateway Collector appliance prerequisites
