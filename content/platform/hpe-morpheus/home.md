---
title: HPE Morpheus
version: "1.1"
description: HPE Morpheus is a vendor-agnostic management platform for multi-cloud
  orchestration, unified operations, and self-service provisioning.
image: /img/platforms/morpheus-logo-192x187.png
width: large
priority: 7
date: 2025-12-05T11:31:31+01:00
active: true
quickLinks:
  - label: 'API Docs'
    url: 'https://apidocs.morpheusdata.com/reference/listactivity'
  - label: 'HPE Morpheus Terraform Provider'
    url: 'https://github.com/HPE/terraform-provider-hpe/tree/main'
  - label: 'HPE Morpheus Software Ecosystem'
    url: '#hpe-morpheus-software-ecosystem'
  - label: 'Morpheus Website'
    url: 'https://morpheusdata.com/'
tags:
  - morpheus
  - hybrid-cloud
---
HPE Morpheus Software is the governed control plane for the agentic enterprise—simplifying management, automating operations, and reducing costs across VMs, containers, clouds, and AI-era infrastructure. 

Learn more about [HPE Morpheus](https://www.hpe.com/us/en/products/software/morpheus-software.html).
## Features

| **Category** | **VM Essentials** | **Advanced** | **Enterprise** |
| :----------------- | :-------------------------------------------------------------------------- | :-------------------------------------------------- | :------------------------------------------- |
| Best for / use case + provisioning scope | Lower-cost virtualization and VMware coexistence—provision and manage VMs across HVM and VMware through a unified interface | Private cloud operations for VMs and containers—deliver self-service workloads across virtualization and Kubernetes | Governed hybrid and multi-cloud platform operations—provision and manage applications across private cloud, public cloud, Kubernetes, and bare metal |
| Included runtime | HVM (KVM-based hypervisor) for enterprise virtualization without VMware lock-in | HVM plus integrated HKS (HPE's Kubernetes service) support for modern application platforms| HVM plus HKS support as part of a broader hybrid and multi-cloud runtime model |
| Orchestration and provisioning | VM provisioning and lifecycle management | Self-service provisioning for VMs, containers, and private cloud services | Application-centric orchestration across private cloud, public cloud, Kubernetes, and bare metal |
| Automation | Basic provisioning and scripting to streamline VM lifecycle tasks | Expanded automation and workflow tooling across infrastructure and platforms | Full lifecycle orchestration across clouds, workloads, and teams with a unified automation engine |
| AI & AI operations | AI integration via MCP (Model Context Protocol) to extend automation workflows | AI-assisted workflows and monitoring with bring-your-own-model support and operational insights | AI-driven operations with workflows, monitoring, AI chat, and proactive agents to automate operations and accelerate troubleshooting |
| Kubernetes and containers | Not included—focused on virtualization use cases | Included with integrated Kubernetes services for private cloud environments | Included with broader hybrid and multi-cloud Kubernetes support and application lifecycle management |
| Integrations and ecosystem | Core virtualization integrations for storage, networking, and hypervisors | Broader integration set for private cloud tools and automation frameworks | Extensive ecosystem support across infrastructure, ITSM, automation, networking, storage, backup, and monitoring tools |
| Networking | Virtualization networking support for standard VM connectivity and segmentation | Expanded private cloud networking with enhanced connectivity and service controls | Software-defined networking (SDN) with multi-environment orchestration and advanced segmentation (including overlays and micro-segmentation) |


![](/img/platforms/hpe-morpheus.png)

## API Documentation

The Morpheus platform offers an extensive REST API to manage the configuration of the platform as well as deploy workloads to the various clouds that the platform supports. Detailed information about the REST API and how to use it can be found in the [HPE Morpheus API documentation](https://apidocs.morpheusdata.com/reference/listactivity).

### Getting started with the HPE Morpheus API:
The Morpheus API is an HTTP interface for interacting with the Morpheus appliance. It provides a RESTful interface where GET reads, POST creates, PUT updates and DELETE destroys resources.

[Start here](https://apidocs.morpheusdata.com/docs/getting_started)

## CLI Documentation Reference
`Note: IMPORTANT
This reference contains all CLI commands and options available for customers using HPE Morpheus Enterprise Software. This reference is also applicable to customers using HPE Morpheus VM Essentials Software, however certain commands and options pertain to features that exist only in HPE Morpheus Enterprise Software.`

[The Morpheus CLI](https://support.hpe.com/hpesc/public/docDisplay?docId=sd00006978en_us&page=GUID-5BD5970D-0FFC-4C2C-92E5-62482EE3C238.html) is a command line interface for the Morpheus appliance. It's a ruby gem that provides the morpheus executable. It works by making HTTP requests to the Morpheus API.

The Morpheus CLI is written in Ruby and requires ruby 2.5 or newer to be installed. Most UNIX-based systems will have this installed already.

## HPE Morpheus Software Ecosystem

HPE Morpheus Software works with your existing ecosystem—so you can modernize without starting over. With [90+ codeless integrations](https://www.hpe.com/us/en/products/software/morpheus-software/ecosystem.html), extensible plugins, and validated support across backup, networking, ITSM, identity, Kubernetes, and more, it unifies your hybrid cloud operations, reduces tool sprawl, and provides the flexibility to evolve on your terms—without vendor lock-in.

* **HPE Morpheus Developer Zone** 
From [OpenAPI documentation for the Morpheus API ![](github)](https://github.com/HewlettPackard/morpheus-openapi) to [Morpheus Plugin Documentation](https://developer.morpheusdata.com/docs), or [Morpheus Plugin API Details](https://developer.morpheusdata.com/api/index.html?overview-summary.html), Everything a dev needs is there.

* **Morpheus Golang SDK:** The Morpheus Golang library provides an interface for interacting with the Morpheus platform within a Golang application. Details on using the library can be found at [morpheus-go-sdk ![](Github)](https://github.com/HPE/terraform-provider-hpe/tree/main/internal/sdk). SDK source now lives in the provider: the SDK is vendored in-tree at HPE/terraform-provider-hpe under internal/sdk/oapigen (generated) and internal/sdk/legacy.
Generation moved into the provider's codegen pipeline: the oapigen SDK is now generated from the OpenAPI spec and delivered into the provider by an internal code-generation pipeline. There are no more oapigen/vX.Y.Z releases.

* **Morpheus Terraform Provider:** The Morpheus Terraform provider enables the Morpheus platform to be managed in a declarative fashion using HashiCorp Terraform. Documentation for the Terraform provider can be found at [HPE Terraform Provider ![](github)](https://github.com/HPE/terraform-provider-hpe/tree/main).

## Training

### Gain hands-on experience with HPE Morpheus

The Morpheus platform includes a community edition that enables users to get hands-on experience with the Morpheus platform. The platform can be quickly deployed on a single Linux server running in a home lab, datacenter, or public cloud environment. Get started with the community edition at [https://morpheusdata.com/community](https://morpheusdata.com/community).

### Workshops-on-Demand

Take advantage of our free, Jupyter-Notebook based Workshops-on-Demand available in the [Hack Shack](/hackshack/). These technical workshops provide you with an in-depth, hands-on learning experience where you can interact with and learn from the experts. Designed to fit your schedule, these workshops are available 24/7 – any time, from anywhere.

<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
<div class="w3-container w3-center w3-margin-bottom">
  <a href="/hackshack/workshops"><button type="button" class="button">Try now!</button></a>
</div>

### Technical Demos

![](/img/platforms/x10000-console.png)

<br/>

| Demo                                                                        | Description                                                                                                                                                                                                                              | Link                                                                                                                                                                                                   |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|
HPE Morpheus YouTube Playlist                        | A complete set of short videos adressing HPE Morpheus product features                                                            | [Playlist](https://www.youtube.com/playlist?list=PLtS6YX0YOX4e6iZPN6ywDyLmCQ-DOBMr7)                                                     |
| HPE Morpheus VM Essentials Software                         | In this demo, experts from Hewlett Packard Enterprise showcase HPE Morpheus Enterprise and how it enables unified cloud management, automation, and governance across hybrid environments. | [Video](https://www.youtube.com/watch?v=jtlp3WU95mQ)|
| Integrating Morpheus and GitHub Actions                                    | This Morpheus Tech Brief demonstrates the integration of the Morpheus platform with GitHub Actions, highlighting its CI/CD capabilities.                     | [Video](https://www.youtube.com/watch?v=VY5dQfsUkho) |
Morpheus Orchestration Copilot Demo  |   This demonstration shows how HPE Morpheus brings infrastructure data, automation, and AI-driven operations together through a single conversational control plane. |                   [Video](https://www.youtube.com/watch?v=Q_AVNgsEn28)                                                                                                                                                   |
| Getting Started with Morpheus REST API_HPE              | This video tutorial offers an introductory guide to using the Morpheus Res API.          | [Video](https://www.youtube.com/watch?v=QDhM6yJ04Aw)                                                                                                                                                   |

<br/>

## Community

### Any questions on HPE Morpheus Software?

Join the [HPE DEV Slack Workspace](https://developer.hpe.com/slack-signup) and start a discussion in the [\#HPE Morpheus Software](https://hpedev.slack.com/archives/C0BFX309T8E) channel.
