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

3. Click **+ADD** to search for *Redfish*. 

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

![Visualizing the components of Redfish - Server](/img/integration-redfish-img7.png "Visualizing the components of Redfish - Server")

When the hybrid observability service connects to a Redfish-enabled system, it typically discovers and maps multiple components as separate resources:

* The **Manager** represents the baseboard management controller (BMC) — that is the iLO management controller of the HPE ProLiant server — used for out-of-band monitoring. The Hybrid observability service connects to the controller for inventory, control, and monitoring of the server hardware. 
* The **physical server resource** to monitor system-level hardware such as the processor, memory, and network interfaces.
* The **server with the operating system** (Linux in our example) detected via the agentless SSH integration module previously installed.

### Visualizing the metrics and monitoring templates

1. From the **Infrastructure > Search > COMPUTE > Redfish – Server**, select a sub-component of the Redfish - Server to open the resource details page. For example, select the **Compute System** or the **Manager**. Click on the component. You will see multiple tabs with detailed information about the Redfish - Server sub-component, such as Overview, Metrics, Attributes, Components, and Inventory.

2. Click on the **Metrics** tab to view the metric graphs. A graph is plotted for each metric that is enabled in the Monitoring Template automatically assigned to the sub-component.

3. On the upper right side of the Metrics tab, click the **Settings** icon to *View Monitoring Configuration*, such as the monitored metrics, the thresholds, and the availability monitor.

4. Navigate to **ASSIGNED TEMPLATES** to see the global monitoring template(s) assigned to the sub-component of the Redfish – Server.  

![Visualizing the metrics and monitoring templates](/img/integration-redfish-img7-bis2.png "Visualizing the metrics and monitoring templates")

Based on your IT operational requirements, you can clone and customize the Global Monitoring Templates, then apply them to the Redfish - Server components as appropriate. Refer to [Part 3 of the series](https://developer.hpe.com/blog/hybrid-observability-service-%E2%80%93-part-3-enabling-the-monitoring-of-agentless-ssh-enabled-systems-in-hpe-greenlake-flex-solutions/) to learn how to clone and apply a monitoring template to a resource.

### Getting a real-time view of the Redfish – Server components

You can also explore **Topology Maps**, a visual representation of relationships and dependencies between your infrastructure resources: 

* Go to **Infrastructure > Topology Maps** and select your Redfish - Server. 
* You can also select a resource for a sub-component of the Redfish - Server from **Infrastructure > Search > COMPUTE > Redfish – Server**. Click the ellipsis (…) at the top right and select **View Topology**.

![Topology Maps for Redfish - Server](/img/integration-redfish-img8-bis.png "Topology Maps for Redfish - Server")

When viewing **Topology Maps**, you can customize how much detail is shown and how deep the relationships go using **View Settings** (gear icon) on the top right and set the **Depth** and **Layout** options.

![Depth and Layout of the Topology Map](/img/integration-redfish-img9.png "Depth and Layout of the Topology Map")

The **depth** setting controls how many levels of relationships you see in the topology view, and the **Layout** defines how resources and their relationships are visually arranged on the screen:

![Topology Map with depth and layout](/img/integration-redfish-img10.png "Topology Map with depth and layout")

### Visualizing monitoring data in a dashboard

You can use the **dashboards** (classic dashboard and modern dashboard 2.0). A dashboard is a collection of widgets and tiles that present visualizations of your environment’s monitoring data, helping you gain a greater understanding of the state of the infrastructure.

## Discovering and monitoring of HPE Storage Array

HPE OpsRamp provides integration modules to discover and monitor storage arrays from many vendors, including HPE, Dell, Hitachi, NetApp, Vast and more.

The [HPE Alletra MP/9000 integration module](https://glp.docs.opsramp.com/integrations/storage/hpe/hpe-alletra/) is used for discovering, monitoring and managing HPE Alletra MP/9000 storage systems. This module helps you pull detailed health, performance, and inventory data from the storage arrays (disks, controllers, fans, capacity utilization, input/output operations per second, latency, throughput and so on). 

Once discovered, storage monitors are **automatically** applied to the resource via predefined Global Monitoring Templates and Global Device Management Policies, to manage the health and status of the storage system components. 

### Installing the storage array integration module

The storage array integration module installation process is very similar to the Redfish – Server integration module: 

1. Select the **client account**.

2. In the navigation bar, go to **Setup > Account > Integrations** and click **+ADD** to search for **Storage** category. 

3. Choose to install **HPE Alletra MP/9000** by selecting **ADD**.

4. Select the **application version** and select **+ADD** to input basic account information such as: 

   * The **Name** for the configuration.
   * The storage array type (Alletra MP or Alletra 9000).
   * Check the **Is Secure** checkbox.
   * Specify the **IP address/Host name** of the storage array that should be accessible from the gateway collector appliance. 
   * Specify the **WSAPI port** (port 443) and **SSH port** (port 22).

5. Select existing credentials that apply to the storage array or click **+ADD** to create the Credentials for the storage array account. Specify the credentials name, a description, the username, and password.

6. Although optional, it is recommended to select:

   * **App Failure Notification** to be notified by an event or an alert when availability is impacted due to an issue within the HPE Alletra MP/9000 storage environment.  
   * **Alert Polling** that allows HPE OpsRamp to check for and collect alerts generated by the storage array.  
   * **API Timeouts** to define the maximum amount of time HPE OpsRamp will wait for a response from the storage array when making an API call to fetch data such as alerts, events, metrics, or device information.

7. In **RESOURCE TYPE**, check **ALL** or specify the hardware components to be discovered.

8. The last step is to define a **Discovery Schedule**. You can select a minute, hourly, daily, weekly, or monthly schedule.

9. Select **ADD** to save the configuration of the integration module.

10. Click **NEXT** and **select** a collector profile. That is, the gateway collector appliance that will be used to install the integration module and discover the storage array resource.

11. Click **FINISH** to complete the installation of the integration module and initiate the resource discovery.

12. The gateway collector appliance is displayed with the status **CONFIGURED** for the storage array integration module. After a few minutes, the status of the gateway collector appliance will change to **RUNNING**.

### Visualizing the components of the storage array

After a few iterations of discovery and monitoring of the newly installed storage array integration module: 

Navigate to **Infrastructure > Search** and select **STORAGE > HPE Alletra MP/9000 Series** to check the monitoring status (color indication is green) of the storage array:

![Visualizing the components of the storage array](/img/integration-alletramp-img5.png "Visualizing the components of the storage array")

The **HPE Alletra Storage System** is the top-level resource being discovered and monitored. It refers to the entire managed storage array instance — a physical and logical collection of components that operate together to deliver enterprise-grade storage services. Components include controllers, disks, virtual storage pool, volumes, network interfaces, chassis, cache modules, and so on.

You can select each component of the storage array to visualize its monitoring status, attributes, and metrics. 

### Checking the Monitoring Templates assigned to the storage array

1. Select a component of the storage array to open the resource details page.

2. Click on the **Metrics** tab to view the metric graphs.

3. On the upper right side of the **Metrics** tab, click the **Settings** icon to view monitoring configurations such as the monitored metrics, the thresholds, and the availability monitor.

4. Navigate to **ASSIGNED TEMPLATES** to see the global monitoring templates assigned to the component of the storage array.  

Based on your IT operational requirements, you can clone the Global Monitoring Templates and customize them, then apply them to the storage array components as appropriate. 

> **Important Note:** For the HPE Alletra MP/9000 storage, although a Global Monitoring Template is automatically applied to the **HPE Alletra Storage System** component, **no availability monitor** is assigned. This feature will be made available in an upcoming HPE OpsRamp release. Meanwhile, to enable monitoring of the storage system component, you need to clone the monitoring template assigned to the **HPE Alletra Storage System**. Then you must customize it to enable one or two availability monitors for the metrics that are more important for the resource. Refer to [part 3 of the series](https://developer.hpe.com/blog/hybrid-observability-service-%E2%80%93-part-3-enabling-the-monitoring-of-agentless-ssh-enabled-systems-in-hpe-greenlake-flex-solutions/) to learn how to clone and apply a monitoring template to a resource.

### Getting a real-time view of the storage array components

You can explore **Topology Maps** to get a graphical, real-time view of the storage array components, their relationships, and dependencies. 

Navigate to **Infrastructure > Search** and select the storage system, click the ellipsis (…) at the top right, and select **View Topology**. Use the **View Settings** (gear icon) on the top right to set the **Depth** and **Layout** of the graphical representation.

Finally, you can use the dashboards (classic dashboard and modern dashboard 2.0) that represent monitoring data of your environment.

## Dashboard

Once monitoring tools have collected metrics, the next step in creating actionable insights is to visualize them in a dashboard. A dashboard is a collection of charts based on tiles and widgets for visualizing metrics data measured over intervals of time. Hybrid observability service powered by HPE OpsRamp leverages the open-source query language, Prometheus Query Language (PromQL), for dashboard creation.

The purpose of using and creating customizable dashboards is to easily identify anomalies so team members can identify them and troubleshoot issues quickly.

You can choose from the classic dashboard or dashboard 2.0. HPE **recommends leveraging the modern dashboard 2.0** for its advanced capabilities.

Dashboard 2.0 allows you to:

* Create a dashboard with common chart types for observability such as line charts, bar charts, value charts, list charts, gauge charts, honeycomb charts, or pie charts. 
* Leverage a set of predefined, **curated** dashboards. They are pre-built, use-case-specific dashboards that give IT teams immediate visibility into key areas of IT operations without needing to build dashboards.
* Group related dashboards by function, project, or team into the default collection (**My Dashboards**) or create a new collection.
* Copy a curated dashboard and customize it according to your operational requirements.
* Designate a dashboard as the default dashboard.
* Export a dashboard as a JSON file and import it into another environment or client account for your partner domain. 

To learn more about dashboards, see the [HPE OpsRamp Dashboards documentation](https://glp.docs.opsramp.com/platform-features/feature-guides/dashboards/).

### Creating a dashboard

As a *partner administrator* you can create and manage dashboards. In this example, I’ll show you the sequence of steps to create a new dashboard 2.0 in the default collection for the client account *DreamCompany* to monitor and manage the discovered Redfish - Server. 

1. Select the **client account**, navigate to **Dashboards**, and click **Dashboard**.

2. Click the menu (**three stacked horizontal lines**), also referred to as hamburger icon, on the left side of the dashboard.

3. Click **+CREATE DASHBOARD**.

4. Specify a dashboard name for the default collection **My Dashboards**. You can specify a new collection name.

5. Click **CREATE** to start designing the dashboard by adding tiles and widgets.

![Creating a dashboard 2.0](/img/create-dashboard-img2.png "Creating a dashboard 2.0")

6. Click **CREATE TILE** or **+** on the toolbar.

7. Select **Text & Images** tile to create a header. 

   * Select **Header** tab.
   * You can set the font, the size, and the background color of the header.
   * Click **ADD TILE**. 

8. Click **+** in the toolbar to add another tile. Here, I will add a **Metric** tile to visualize metrics coming from the Redfish - Server:     

   * Select **Build my own** tab.
   * In the **DATA** section, click **+QUERY** and select the metric that is important for you. For example, I selected the **ComputeSystem Average CPU** and the **Line/Bar** chart. You can also select the duration over which the selected metric data is displayed and calculated, for example, last 1 hour or last 24 hours.
   * Optionally, you can define **filters and operations** to help refine what data is shown and how it’s calculated.
   * Click the optional **Legend** icon and enter double curly brackets **{{** in the **Query a Legend** field to see a list of options. For example, I specify the *name* and *rootResourceIp* of the resource from the list of options to identify the resource in the chart. Click **DONE.**

![Metric tile](/img/create-dashboard-img7.png "Metric tile")

![Add a legend](/img/create-dashboard-img8.png "Add a legend")

9. In the **VISUALIZATION** section, you can specify a header for the tile. For example, *Avg CPU Utilization*. You can select **Line** or **Bar** as the graph type and its color. 

![Select header and graph for the metric tile](/img/create-dashboard-img9.png "Select header and graph for the metric tile")

10. You can also define **axis labels** for the chart and **thresholds**. Thresholds define **value ranges** for a metric and assign them a **color/status** (OK, Warning, Critical) to reflect performance or health. They help visually flag performance degradation or anomalies in the metrics and take corrective actions.

![Define axis labels and thresholds](/img/create-dashboard-img10.png "Define axis labels and thresholds")

11. Click **SAVE** or **CREATE** to save the tile.

12. To resize a tile, hover the mouse over the bottom-right corner of the tile in the dashboard. You will see a resize handle shown by a diagonal arrow. Click and drag the corner to increase or decrease the tile size both horizontally and vertically.

13. To edit a tile, hover the mouse to the top right of the tile, click the ellipsis (…), and select **Edit**.

14. To move a tile, hover the mouse over the top of the tile, and position the tile on your dashboard.

15. You can add other tiles to the dashboard for additional metrics, resource tile, alert tile, and so on.

Here is an example of a basic dashboard for monitoring the status of the Redfish - Server for the client account *DreamCompany*:

![Example of dashboard to monitor Redfish - Server](/img/create-dashboard-img14.png "Example of dashboard to monitor Redfish - Server")

### Importing a dashboard

The **Import Dashboard** feature allows you to upload and reuse dashboard configurations, usually in JSON format. This helps replicate dashboards, share dashboards between teams, and quickly deploy standard monitoring views.

1. Select the **client account**, navigate to **Dashboards** and click **Dashboard**.

2. Click the menu icon (three stacked horizontal lines) on the left side.

3. Click **IMPORT DASHBOARD** and upload a JSON dashboard file for the default collection of **My Dashboards**. Click **IMPORT** to import the dashboard JSON file.

4. The imported dashboard appears in the collection, and you can edit each tile to adjust the data to be collected the same way you created a new dashboard. You can also add, remove tiles, move tiles, and adjust the size of the tiles. 

## Summary

The hybrid observability solution, powered by HPE OpsRamp Software, discovers the compute, networks, and storage infrastructure, the applications, and workloads they host, and their dependencies. It then observes and monitors the health, performance, and capacity events, metrics, logs, traces, and network flows providing customers with true end-to-end visibility.

This blog series walked you through the sequence of steps to provision and activate the hybrid observability service in HPE GreenLake workspace, and set up the service to discover, monitor, and observe the health, performance, and availability of agentless SSH-enabled systems, and physical infrastructure devices included in the HPE GreenLake Flex Solutions contract.

There’s also a series of video tutorials on the [Hybrid observability in HPE GreenLake Flex Solutions landing page](https://developer.hpe.com/greenlake/hybrid-observability-flex-solutions/home/) that walks you through the contents described in this blog series for readers who prefer an audio-visual learning experience.

To resolve issues with HPE GreenLake Flex Solutions or HPE hybrid observability service powered by HPE OpsRamp, contact the support team. While logged in to your HPE GreenLake workspace: 

1. Click **Help & Support**. 
2. Under **Help**, select **OpsRamp** or **HPE GreenLake Flex Solutions**.
3. Click **Create New Case**. 

If you still have any questions regarding the hybrid observability service configuration, join the [HPE Developer Community Slack Workspace](https://developer.hpe.com/slack-signup/) and start a discussion on our [\#hpe-greenlake-flex-observability](https://hpedev.slack.com/archives/C08K4GV7YN5) Slack channel.