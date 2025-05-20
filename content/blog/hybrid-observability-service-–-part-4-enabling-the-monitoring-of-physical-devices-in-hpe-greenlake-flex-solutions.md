---
title: "Hybrid observability service – Part 4: Enabling the monitoring of
  physical devices in HPE GreenLake Flex Solutions"
date: 2025-05-26T16:38:17.727Z
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

In [my previous blog post](https://developer.hpe.com/blog/hybrid-observability-service-%E2%80%93-part-3-enabling-the-monitoring-of-agentless-ssh-enabled-systems-in-hpe-greenlake-flex-solutions/), I introduced the steps to install and configure an agentless SSH-enabled integration module and associated monitoring templates. This enables you to discover and monitor a Linux-based operating system in the hybrid observability service powered by HPE OpsRamp Software.  

Continuing from the third part of this series, I’ll dive into the observability of a physical HPE ProLiant compute server with an Integrated Lights-Out (iLO) 5 and above, out-of-band management interface, and an HPE storage array. I’ll also explore creating and importing a dashboard to visualize the collected metrics in charts.

## Discovering and monitoring of HPE physical servers via the Redfish API

The [Redfish - Server integration module](https://glp.docs.opsramp.com/integrations/compute/server-hardware-monitoring-redfish/redfish-server/) monitors and manages physical servers via the Redfish API, a modern, standardized interface for out-of-band hardware management.

Redfish is a RESTful API designed by the Distributed Management Task Force (DMTF) for managing servers, storage, and other hardware components over the network. It’s supported by most modern server vendors like Dell iDRAC, HPE iLO, and NVIDIA.

The Redfish Server integration module enables the **discovery** of physical server hardware and its components (CPU, memory, storage, power supplies, fans, temperature, and so on). Once discovered, Redfish Server monitors are **automatically** applied to the resource via predefined Global Monitoring Templates and Global Device Management Policies to manage the health and status of the server hardware components. You can customize the Global Monitoring Templates by cloning the templates as appropriate and applying the cloned monitoring template to your resource. Refer to [Part 3 of the series](https://developer.hpe.com/blog/hybrid-observability-service-%E2%80%93-part-3-enabling-the-monitoring-of-agentless-ssh-enabled-systems-in-hpe-greenlake-flex-solutions/) to learn how to clone and apply a monitoring template to a resource.

### Installing the Redfish – Server integration module

The Redfish Server integration module installation process for an HPE compute server is as follows: 

1. Select the **client account**.

2. From the navigation bar go to **Setup > Account > Integrations**.

3. Click **+ADD** to search for _Redfish_. 

4. Choose to install **Redfish – Server** by selecting **ADD**.

5. Select the application version and select **+ADD** to input basic account information, such as the **Name** for the configuration and the **IP address/Host name** of iLO for the HPE compute server that should be accessible from the gateway collector appliance. Specify the **Port** (typically port 443) and check the **Is Secure** checkbox.

6. You must assign credentials for iLO interface. You can either:

   * Select existing credentials for access to the iLO interface.
   * Create new credentials. Click **+ADD** and specify the credentials name, a description, the username and password to access the iLO interface of the compute server.

7. Although optional, it is recommended to select:

   * **App Failure Notifications** to be notified when the hybrid observability service can’t collect or process data from the Redfish-enabled server.
   * **Event Polling/Alert Configuration** for fetching events and alerts from the Integrated Management Log (IML) from the iLO. You can also select **Alert On Root Resource** for alerts to appear on the main server resource in the hybrid observability service.

> **Note:** Do not check the option **CLI Credentials** because it is only valid for HPE Edgeline servers.

8. In **RESOURCE TYPE**, check **ALL** or specify the hardware components to be discovered.  

9. Define a **Discovery Schedule**. You can select an hourly, daily, weekly, or monthly schedule.

10. Select **ADD** to save the configuration of the integration module. 

> **Note:** In the **ADVANCED SETTINGS**, notice the ***Bypass Resource Reconciliation*** option is checked by default. It controls how HPE OpsRamp handles previously discovered resources by another integration module when it runs discovery again. 

11. Click **NEXT** and **select** a collector profile. That is, the gateway collector appliance used to install the integration module and discover the Redfish – Server hardware resource. 

12. Click **FINISH** to complete the installation of the integration module and initiate the resource discovery and monitoring.

13. The gateway collector appliance displays with the status **CONFIGURED** for the Redfish – Server integration module. After a few minutes, the status of the gateway collector appliance will change to **RUNNING**.


### Visualizing the components of the Redfish - Server

After a few iterations of discovery and monitoring of the newly installed Redfish Server integration module:

1. Navigate to **Infrastructure > Search** and select **COMPUTE > Redfish – Server**.
2. Select either **MANAGER** or **SYSTEM** or **LINUX** in **MORE** option to view the sub-components of the compute device and the monitoring status (color indication is green which means the elements are now monitored):

[Img 1]

When the hybrid observability service connects to a Redfish-enabled system, it typically discovers and maps multiple components as separate resources:

* The **Manager** represents the baseboard management controller (BMC) — that is the iLO management controller of the HPE ProLiant server — used for out-of-band monitoring. The Hybrid observability service connects to the controller for inventory, control, and monitoring of the server hardware. 

* The **physical server resource** to monitor system-level hardware such as the processor, memory, and network interfaces.

* The **server with the operating system** (Linux in our example) detected via the agentless SSH integration module previously installed.


### Visualizing the metrics and monitoring templates

1. From the **Infrastructure > Search > COMPUTE > Redfish – Server**, select a sub-component of the Redfish - Server to open the resource details page. For example, select the **Compute System** or the **Manager**. Click on the component. You will see multiple tabs with detailed information about the Redfish - Server sub-component, such as Overview, Metrics, Attributes, Components, and Inventory.

2. Click on the **Metrics** tab to view the metric graphs. A graph is plotted for each metric that is enabled in the Monitoring Template automatically assigned to the sub-component.

3. On the upper right side of the Metrics tab, click the **Settings** icon to view monitoring configuration, such as the monitored metrics, the thresholds, and the availability monitor. 

4. Navigate to **ASSIGNED TEMPLATES** to see the global monitoring template(s) assigned to the sub-component of the Redfish – Server.  

[Img 2]

Based on your IT operational requirements, you can clone and customize the Global Monitoring Templates, then apply them to the Redfish - Server components as appropriate. Refer to [Part 3 of the series](https://developer.hpe.com/blog/hybrid-observability-service-%E2%80%93-part-3-enabling-the-monitoring-of-agentless-ssh-enabled-systems-in-hpe-greenlake-flex-solutions/) to learn how to clone and apply a monitoring template to a resource.

### Getting a real-time view of the Redfish – Server components

You can also explore **Topology Maps**, a visual representation of relationships and dependencies between your infrastructure resources. 

* Go to **Infrastructure > Topology Maps** and select your Redfish Server. 
* You can also select a resource for a sub-component of the Redfish - Server from **Infrastructure > Search > COMPUTE > Redfish – Server**. Click the ellipsis (…) at the top right and select **View Topology**.

[Img 3]

When viewing **Topology Maps**, you can customize how much detail is shown and how deep the relationships go using **View Settings** (gear icon) on the top right and set the **Depth** and **Layout** options.

[Img 4]

The **depth** setting controls how many levels of relationships you see in the topology view, and the **Layout** defines how resources and their relationships are visually arranged on the screen:

[Img 5]

### Visualizing monitoring data in a dashboard

You can use the **dashboards** (classic dashboard and modern dashboard 2.0). A dashboard is a collection of widgets and tiles that present visualizations of your environment’s monitoring data, helping you gain a greater understanding of the state of the infrastructure.

 [Img 6]


## Discovering and monitoring of HPE Storage Array

HPE OpsRamp provides integration modules to discover and monitor storage arrays from many vendors, including HPE, Dell, Hitachi, NetApp, Vast and more.

The [HPE Alletra MP/9000 integration module](https://glp.docs.opsramp.com/integrations/storage/hpe/hpe-alletra/) is used for discovering, monitoring and managing HPE Alletra MP/9000 storage systems. This module helps you pull detailed health, performance, and inventory data from the storage arrays (disks, controllers, fans, capacity utilization, input/output operations per second, latency, throughput and so on). 

Once discovered, storage monitors are **automatically** applied to the resource via predefined Global Monitoring Templates and Global Device Management Policies, to manage the health and status of the storage system components. 
