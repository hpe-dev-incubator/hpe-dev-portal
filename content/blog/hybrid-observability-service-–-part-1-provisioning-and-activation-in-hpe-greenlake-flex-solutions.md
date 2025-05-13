---
title: "Hybrid observability service – Part 1: Provisioning and activation in
  HPE GreenLake Flex Solutions"
date: 2025-05-26T17:28:45.295Z
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

As organizations embrace cloud-native technologies, and adopt hybrid or multi-cloud environments, system architecture is becoming more complex and distributed than ever. With this, IT teams are under constant pressure to detect and resolve issues faster — so they can keep services reliable and business operations running smoothly.

To address these challenges, IT teams are turning to observability solutions to manage complex systems and proactively identify and resolve issues. Observability plays a critical role in modern IT Operations Management (ITOM), offering real-time visibility across hybrid and multi-cloud environments. With the observability tools, teams can understand what’s happening across their infrastructure, detect anomalies early, and resolve incidents quickly – keeping systems efficient, stable, and resilient.

[HPE GreenLake Flex Solutions](https://www.hpe.com/us/en/hpe-greenlake-flex-solutions.html) includes a cloud-based hybrid observability service, powered by [HPE OpsRamp Software](https://www.hpe.com/us/en/opsramp.html), an AI-powered command center that simplifies and optimizes IT operations.

Hybrid observability in HPE GreenLake Flex Solutions is a SaaS-based ITOM solution and AIOps monitoring and observability service. It is designed to handle the complexity of hybrid multi-cloud environments. By leveraging the hybrid observability service powered by HPE OpsRamp, you will have visibility and control to centrally monitor and manage the **physical** infrastructure resources (servers, storage, network equipment) that comes within the HPE GreenLake Flex Solutions.

You can also expand your observability capabilities by purchasing additional subscriptions to provide coverage of **logical resources** such as virtual machines, containers, and workloads, including those running on public clouds or non-HPE infrastructure.

Let’s get started with the journey to set up the hybrid observability service powered by HPE OpsRamp Software.

## Prerequisites

To enable monitoring and observability of physical devices in HPE GreenLake Flex Solutions, there are some requirements that must be fulfilled:

1. Create an HPE account, sign in to HPE GreenLake cloud and create a workspace for your organization. The workspace is the fundamental access management control boundary for HPE GreenLake resources. When you create a workspace, you are automatically assigned the role of ***Workspace Administrator***.

   > **Note:** If you haven’t already set up your HPE account and workspace, refer to the [HPE GreenLake Cloud User Guide](https://support.hpe.com/hpesc/public/docDisplay?docId=a00120892en_us&page=GUID-497192AA-FDC2-49C5-B572-0D2F58A23745.html) to create them. 
2. Ensure you receive the hybrid observability subscription key by email as part of the HPE GreenLake Flex Solutions contract.     
3. Provision and activate hybrid observability service on the HPE GreenLake workspace.     
4. Create a client account.     
5. Install a gateway collector appliance in a virtual environment to enable discovery of physical resources.     
6. Install integration modules to discover physical resources.     
7. Apply monitoring configuration to the discovered resources.       

In this blog post it is assumed that you have created an HPE account and a workspace. You will then learn how to:

* Provision the hybrid observability service powered by HPE OpsRamp Software in the HPE GreenLake Workspace.
* Activate the associated subscription key.
* Assign appropriate access role to desired users in the HPE GreenLake workspace. 
* Launch the hybrid observability service in HPE GreenLake Flex Solutions to begin your hybrid observability journey. 

In the subsequent blog posts of the series, I will walk you through setting up the hybrid observability service through the HPE OpsRamp user interface to monitor, manage, and control your physical infrastructure resources. 

## Provisioning the hybrid observability service powered by HPE OpsRamp Software in HPE GreenLake Flex Solutions

To activate the hybrid observability service in HPE GreenLake Flex Solutions and the associated subscription key on your workspace, you need to:

1. Provision the hybrid observability service powered by HPE OpsRamp Software in a desired region in your workspace using your HPE account with the Workspace Administrator role.     
2. Activate the subscription key for your workspace.     
3. Grant the ***OpsRamp Access*** role to the desired users in your workspace.     
4. Launch the HPE OpsRamp Software from the workspace to use and configure the hybrid observability service.     

**Let’s get started with this sequence of steps!** 

### Step 1 – Provision the HPE OpsRamp Software service in your workspace

Log in to your HPE GreenLake cloud workspace using your Workspace Administrator account. Provision the HPE OpsRamp Software to your workspace and select a deployment region. You can provision the HPE OpsRamp Software before adding the subscription key.

* Click **Services > Catalog**.

![HPE GreenLake Service catalog](/img/opsramp-activation-img-2.png "HPE GreenLake Service catalog")

* Under **Management & Governance**, select **OpsRamp**.
* Click **Provision**. 
* Select a **Deployment Region** from the drop-down. You can add more regions once the service is installed. 
* Click **Terms of Service** to review the terms, and then select the checkbox to confirm your agreement.
* Click **Deploy**.

![Provision HPE OpsRamp](/img/opsramp-activation-img-5.png "Provision HPE OpsRamp")

### Step 2 – Activate the subscription key in your workspace

As the Workspace Administrator, add the hybrid observability **subscription key** that you received via email for your workspace. A subscription key is needed to launch the service in your workspace:

* In your HPE GreenLake workspace, click **Services** and then **Service Subscriptions**.
* Click **Add Service Subscription**. 
* Enter the *Subscription key* you received by email.
* Click **Add**. 
* Click **Next**. 
* (Optional) You can assign tags to the subscription key or manage tags later. Tags allow you to categorize resources based on purpose, owner, location, or other criteria. Click **Assign** if you add a tag, then click **Next**.
* Showback rates are optional. Skip this step. Clear the **Add showback rates** checkbox.
* Click **Next**. 
* Click **Finish**. The subscription key is automatically applied to the workspace and the hybrid observability service powered by HPE OpsRamp.

![Activate HPE OpsRamp subscription key](/img/opsramp-activation-img-12.png "Activate HPE OpsRamp subscription key")

### Step 3 – Assign the OpsRamp Access role to the desired users

After you provisioned the HPE OpsRamp Software to your workspace, you must give the desired users permission to access and run the hybrid observability service. Users must be granted the built-in ***Opsramp Access*** role. Once users are assigned this role, they have the authorization they need.

* In your workspace, on the **Home** page, select **Manage Workspace** from the **Quick Links**.
* Click **Workspace identity & access**. 
* Click **Users**. 
* Select the desired user or select the ellipsis (...) on the right of the user.
* Click **Assign Role**. 
* Select the **OpsRamp** service.
* Select the **Opsramp Access** role.
* Do not slide the **Limit Resource Access** toggle to the right.
* Click **Assign Role**. 
* Click **Change Role Assignment**. 

![Assign OpsRamp Access role](/img/opsramp-activation-img-19.png "Assign OpsRamp Access role")

### Step 4 – Launch the hybrid observability service

With the HPE OpsRamp Software deployed in a region and attached to a valid subscription, users are ready to take advantage of the hybrid observability operations management solution. 

* Click the **Launch** button to access and use the hybrid observability user interface powered by HPE OpsRamp. The hybrid observability service provides a unified view of observability across multi-cloud and on-premises infrastructure devices, resources, and services. 
* The first time you access the service user interface, you must accept the **End User Agreement**.

![HPE OpsRamp service user interface](/img/opsramp-activation-img-20.png "HPE OpsRamp service user interface")

The service has now launched. You log in to the service as *Partner Administrator* role. 

By default, Partner’s advanced monitoring **Add-ons** are not enabled. It is recommended to enable the **Add-ons** for the Product Packages at the Partner organization level. To enable the advanced monitoring Add-ons, select **Setup > Setup > Accounts > Partner details**. Click **Edit** button at the top right, select the **Add Ons** tab and check all the Add-ons, then **Save**. To learn more about the Add-ons, see the [HPE OpsRamp Hybrid Discovery and Monitoring documentation](https://glp.docs.opsramp.com/guides/component-model/#hybrid-discovery-and-monitoring).

> **Note:** This feature will be made available under **Setup > Account** in an upcoming HPE OpsRamp release.
>
> **Note:** To enable Partner’s Add-ons, ensure your HPE GreenLake Workspace details (name, address) do not contain any special characters. 

The hybrid observability in HPE GreenLake Flex Solutions uses a multi-tenant model. As a Partner Administrator, you can manage multiple client accounts, each client account representing an individual organization, business unit, or customer environment. You’ll start setting up your hybrid observability service by:

* Defining a client account. 
* Assigning specific access roles to users. 
* Installing a virtual appliance, called a gateway collector appliance, that discovers and manages your on-premises physical devices. 
* Applying integration modules and monitoring configurations to resources. 

These steps will be explained in the subsequent blog posts of the series.

## Summary

This blog post helps you get started provisioning of the hybrid observability service powered by HPE OpsRamp Software and activating the subscription key in your HPE GreenLake cloud workspace. For more information about the provisioning of the service  and subscription key activation, check out the [HPE GreenLake Cloud User Guide](https://support.hpe.com/hpesc/public/docDisplay?docId=a00120892en_us&page=GUID-9EDAAB42-9182-488D-A06F-6E8CB4BFAB60.html). 

Stay tuned for my next post of the series, where I’ll delve into the hybrid observability service integration setup activities to **discover** infrastructure resources. 

I’ll create a tenant, also referred to as client account, for the Partner organization. I’ll also install and configure a gateway collector appliance as a prerequisite to enable the discovery of physical infrastructure devices included in the HPE GreenLake Flex Solutions contract.

To resolve issues with HPE GreenLake Flex Solutions or hybrid observability service powered by HPE OpsRamp, contact the support team. While logged in to your HPE GreenLake workspace: 

1. Click **Help & Support**.
2. Under **Help**, select OpsRamp or HPE GreenLake Flex Solutions.
3. Click **Create New Case**.

If you still have any questions regarding the hybrid observability service activation process, join the [HPE Developer Community Slack Workspace](https://developer.hpe.com/slack-signup/) and start a discussion on our [\#hpe-greenlake-flex-observability](https://hpedev.slack.com/archives/C08K4GV7YN5) Slack channel. We’re always here to help.