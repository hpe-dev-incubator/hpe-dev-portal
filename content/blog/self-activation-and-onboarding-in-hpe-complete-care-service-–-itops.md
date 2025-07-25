---
title: Self-activation and onboarding in HPE Complete Care Service – ITOps
date: 2025-07-25T15:08:33.719Z
author: Denis Choukroun
authorimage: https://gravatar.com/avatar/f66dd9562c53567466149af06ae9d4f1?s=96
disable: false
tags:
  - activation-and-onboarding-in-hpe-complete-care-service-itops
---
<style>
li {
   font-size: 27px;
   line-height: 33px;
   max-width: none;
}
</style>

One of the HPE Complete Care Service - ITOps slogans is **Smart decisions start with good data**. HPE Complete Care service - ITOps is an HPE service that helps customers monitor, manage, and operate their entire IT environment regardless of the location of those IT assets — on-premises or cloud native.

This service includes a cloud-based observability service, powered by [HPE OpsRamp Software](https://www.hpe.com/us/en/opsramp.html), a SaaS-based IT Operations Management (ITOM) solution. HPE OpsRamp Software is an AI-powered command center that simplifies and optimizes IT operations. HPE OpsRamp Software gives customers complete control over their hybrid IT environment to discover, map, monitor, and troubleshoot infrastructure health and service performance, all from a single centralized command center.

HPE OpsRamp Software leverages OpenTelemetry and the extended Berkeley Packet Filter (eBPF) technologies to collect telemetry data. It enables real time monitoring, spot anomalies, predict potential issues, so customers can stay ahead of performance issues before they impact their business.

HPE Complete Care service – ITOps provides customers with enterprise licenses, 24x7 access to HPE OpsRamp platform and 24x7 access to HPE OpsRamp experts. The number of licenses is determined by the configuration, such as the number of devices. 

The HPE Account Service Manager (ASM) will reach out to the HPE Complete Care customers to gather information from the customers to configure the observability service enabled by HPE OpsRamp software and begin the onboarding process of the HPE OpsRamp Software command center.

After you get access to the HPE OpsRamp Software command center for the HPE Complete Care service – ITOps, you can get started with the journey to **self-activate** the observability service enabled by HPE OpsRamp Software. 

This blog post walks you through the sequence of steps through a series of **audio-visual learning experience** that helps you get started with the setup of the HPE OpsRamp Software command center to discover, monitor, and observe the health, performance and availability of systems and devices included in your HPE Complete Care Service – ITOps contract. 

## Assumptions

In this scenario, it is assumed that the HPE Account Service Manager (ASM) has reached out to you to complete the [HPE Complete Care Service – ITOps request form](https://forms.office.com/pages/responsepage.aspx?id=YSBbEGm2MUuSrCTTBNGV3MNwzZIB3zBHp5x5QZ1HakFURjRaWU1JRTVSSkJHRFlGSUI4SDk0STRBRC4u)  to setup and configure your HPE OpsRamp Software command center instance. 

## Prerequisites

Once you get your HPE OpsRamp Software command center instance, for a **self-activation** of the instance to monitor, control and manage resources, there are some setup requirements that must be fulfilled:

1. Installing a gateway collector appliance in a virtual environment as a prerequisite to enable discovery of systems and resources before they can be monitored.

2. Installing integration modules to discover, monitor and manage agentless SSH-enabled resource and physical compute device.

3. Creating and customizing modern dashboards to easily identify anomalies and troubleshoot issues quickly.

## Installing and configuring a gateway collector appliance

Resources need to be discovered before they can be monitored, and metrics are collected. With the HPE OpsRamp Software, you discover, monitor, and manage infrastructure resources (compute, storage, network) using an **agentless** method with a **gateway collector appliance** installed **within your firewall** environment. This appliance can be a virtual machine or a cloud-native application that runs on your own Kubernetes environment.

There is [a short video on YouTube](https://www.youtube.com/watch?v=c0ZmdwACq2A&list=PLtS6YX0YOX4fWMwKbp9blyI1GLdXlbWjY) that walks through the installation of the gateway collector appliance in the HPE Complete Care Service – ITOps command center instance. For details about installing and registering a gateway collector appliance, you can refer to the blog post [Initial configuration to enable the discovery of resources](https://developer.hpe.com/blog/hybrid-observability-service-%E2%80%93-part-2-initial-configuration-to-enable-the-discovery-of-resources-in-hpe-greenlake-flex-solutions/), section ***Installing and configuring a gateway collector appliance***.

To learn more about the gateway collector appliance installation and activation procedures, and deployment requirements, refer to the [HPE OpsRamp Software documentation](https://docs.opsramp.com/platform-features/).

>**Note:** Agent-based methods can also be used for the discovery of resources running Linux and Microsoft Windows Operating Systems. To learn more about agents, refer to the [HPE OpsRamp Software Agent documentation](https://docs.opsramp.com/platform-features/agents/).

## Installing an agentless SSH-enabled integration module

HPE OpsRamp Software command center supports agentless monitoring. Agentless monitors use the **gateway collector appliance** to discover resources via SSH and monitor IT infrastructure agentless resources to track their health, performance, and availability.

The SSH Agentless Integration module discovers Linux/Unix-based systems **without installing an agent**, by securely connecting to the device over SSH via the gateway collector appliance. A **Monitoring Template** then needs to be assigned to the target agentless system for collecting data for monitoring the metrics and resource availability.

There is [a short video on YouTube](https://www.youtube.com/watch?v=a1GVV-b9hCI&list=PLtS6YX0YOX4fWMwKbp9blyI1GLdXlbWjY) that walks through the installation of the agentless SSH-enables system integration module in the HPE Complete Care Service – ITOps command center instance. For details about installing and configuring an agentless SSH integration module, you can refer to the blog post [Enabling the monitoring of agentless SSH-enabled systems](https://developer.hpe.com/blog/hybrid-observability-service-%E2%80%93-part-3-enabling-the-monitoring-of-agentless-ssh-enabled-systems-in-hpe-greenlake-flex-solutions/). 

## Discovering and monitoring physical computing devices via the Redfish API

The [Redfish - Server integration module](https://docs.opsramp.com/integrations/compute/server-hardware-monitoring-redfish/redfish-server/) monitors and manages physical servers via the Redfish API, a modern, standardized interface for out-of-band hardware management.

The Redfish Server integration module enables the **discovery** of physical server hardware and its components (CPU, memory, storage, power supplies, fans, temperature, and so on). Once discovered, Redfish Server monitors are **automatically** applied to the resource via predefined **Global Monitoring Templates** and **Global Device Management Policies** to manage the health and status of the server’s hardware components.

There is [a short video on YouTube](https://www.youtube.com/watch?v=htZwkW-zG00&list=PLtS6YX0YOX4fWMwKbp9blyI1GLdXlbWjY) that walks through the installation of the Redfish - Server integration module in the HPE Complete Care Service – ITOps command center instance. For details about installing a Redfish – Server integration module, you can refer to the blog post [Enabling the monitoring of physical devices](https://developer.hpe.com/blog/hybrid-observability-service-%E2%80%93-part-4-enabling-the-monitoring-of-physical-devices-in-hpe-greenlake-flex-solutions/).

## Creating and customizing modern dashboards

Once monitoring tools have collected metrics, the next step in creating actionable insights is to visualize them in a dashboard. A dashboard is a collection of charts based on tiles and widgets for visualizing metrics data measured over intervals of time.
 
The purpose of using and creating customizable dashboards is to easily identify anomalies so IT operations can identify them and troubleshoot issues quickly.

You can choose from the classic dashboard or dashboard 2.0. HPE **recommends leveraging the modern dashboard 2.0** for its advanced capabilities.

There is [a short video on YouTube](https://www.youtube.com/watch?v=MPTq-3EA60E&list=PLtS6YX0YOX4fWMwKbp9blyI1GLdXlbWjY) that walks through the creation and customization of a modern dashboard in the HPE Complete Care Service – ITOps command center instance. For details about creating and customizing a modern dashboard, you can refer to the blog post [Enabling the monitoring of physical devices](https://developer.hpe.com/blog/hybrid-observability-service-%E2%80%93-part-4-enabling-the-monitoring-of-physical-devices-in-hpe-greenlake-flex-solutions/), section **Dashboard**.

To learn more about dashboards, see the [HPE OpsRamp Software Dashboards documentation](https://docs.opsramp.com/platform-features/feature-guides/dashboards/).

## Summary

The HPE Complete Care Service – ITOps, powered by HPE OpsRamp Software, discovers the compute, networks, and storage infrastructure, the applications, and workloads they host, and their dependencies. It then observes and monitors the health, performance, and capacity events, metrics, logs, traces, and network flows providing customers with true end-to-end visibility.

This blog post walked you through the sequence of steps, leveraging a series of video tutorials, for a self-activation of the HPE Complete Care Service – ITOps command center instance. This set of videos goes through the setup of the HPE OpsRamp Software command center to discover, monitor, and observe the health, performance, and availability of resources through a gateway collector appliance, and creation of a modern dashboard 2.0. 

To resolve issues with HPE Complete Care Service – ITOps command center instance, contact the HPE support team. Refer to the [HPE Contractual Support service documentation](https://www.hpe.com/us/en/collaterals/collateral.a50009342enw.html) for detailed information. 
