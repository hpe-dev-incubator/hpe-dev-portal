---
title: HPE Alletra
version: v0.2
description: A paradigm shift in data infrastructure.
image: /img/alletra-element-small.png
width: large
priority: 12
date: 2025-06-16T09:12:23+02:00
active: true
tags:
  - hpe-alletra
  - hpe-alletra-6000
  - hpe-alletra-9000
  - storage
  - x10000
  - b10000
---
<style>
table {
    display: table;
    width: 100%;
    max-width: 100%;
    margin: 20px auto;
    border-collapse: collapse;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    border: 1px solid grey;
}
th, td {
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    border: 1px solid grey;
    text-align: left !important;
    font-weight: normal !important;
    padding: 10px !important;
}
th {
    text-align: center !important;
    font-weight: bold !important;
    background-color: #f5f5f5;
    font-weight: bold !important;
}
</style>


Shed the complexity and silos inherent in conventional hybrid cloud environments with category-defining cloud-native data infrastructure that delivers a cloud operating and consumption experience wherever data lives. Stop managing infrastructure — and start simply accessing and utilizing it, as a service and on demand.



## Overview

HPE Alletra MP is Hewlett Packard Enterprise's modular, cloud-operational storage platform designed to consolidate enterprise storage workloads while providing independent scaling of compute and capacity. Built with a disaggregated architecture, HPE Alletra MP enables organizations to deploy different storage personalities on a common hardware platform, improving flexibility, efficiency, and operational simplicity. 

Key benefits include: 

* Modular, scale-out architecture 
* Independent scaling of controllers and storage capacity 
* Cloud-based management through HPE GreenLake 
* High availability and enterprise-grade resiliency 
* Support for both structured and unstructured data workloads 

### Summary

The HPE Alletra MP platform provides a common hardware foundation capable of supporting multiple storage personalities. 


| **Feature**           | **B10000**                                                 | **X10000**                                  |
| :----------------- | :-------------------------------------------------------------------------- | :-------------------------------------------------- |
| Data Type     | Structured                            | Unstructured                       |
| Primary Storage| Block Storage                         | Object Storage and File  |
| Typical Workloads  | Databases, Virtulization, ERP                                                       | AI, Data Lakes, Backup, Media             |
| Performance Focus    | Low Latency & HIgh IOPS                                       | Massive Scale & Throughput                         |
| Protocols   | NVME, Fibre Channel, iSCSI, File                                      | S3, Object Storage, NFS           |
| Scalability    | HPE GreenLake & Infosight | HPE GreenLake & Integrated Services |

Together, the B10000 and X10000 enable organizations to support both traditional enterprise applications and modern data-intensive workloads on the HPE Alletra MP platform, providing a unified operational experience while optimizing storage for different data types. 

Links: 

[For Developers Resources for HPE Alletra Storage MP B10000 (Structured Data)](bookmark://_HPE_Alletra_Storage) 

[For Developers Resources for HPE Alletra Storage MP X10000 (Unstructured Data)](bookmark://_HPE_Alletra_Storage_1)

## HPE Alletra Storage MP B10000 (Structured Data) 

### Purpose 

The HPE Alletra Storage MP B10000 is designed for mission-critical structured data workloads that require high performance, low latency, and enterprise-class availability. It is optimized for block storage used by databases, virtualization platforms, and business-critical applications.  HPE provides APIs, SDKs, and developer resources that enable partners, independent software vendors (ISVs), and customers to automate storage management, integrate with applications, and build custom solutions using the HPE Alletra Storage MP B10000 platform. 

### Developer Resources, REST APIs, and SDKs 

The B10000 provides Developers with SDKs, sample code, and REST-based APIs for storage provisioning, monitoring, automation, and lifecycle management. These APIs can be integrated into orchestration platforms, custom portals, and enterprise automation frameworks. 

* HPE GreenLake API Documentation 
* Kubernetes Integration 
* HPE Storage SDKs 
* HPE GitHub repositories containing automation examples, Ansible collections, Terraform providers, and PowerShell modules 


### HPE Alletra Storage MP B10000 Web Service API v3 

The HPE Alletra Storage MP B10000 platform offers a rich set of REST APIs to manage the system configuration, provision storage, and run other administrative operations.  See the links below for additional information about the REST API and how to use them: 

* [HPE Alletra Storage MP B10000: Web Services API Developer Guide v3](https://www.hpe.com/support/AlletraMP-B10000-WSAPIV3-devguide) 
* [HPE Alletra Storage MP B10000: Web Services API Documentation and v3 OpenAPI specification](https://developer.hpe.com/ws/api-spec)
* [HPE Alletra Storage MP B10000 Web Services API v3 FAQ](https://www.hpe.com/psnow/doc/a00148521enw)

Join the HPE DEV slack channel [#hpe-alletra-b10k-api](https://hpedev.slack.com/archives/C08URLVQRRR) to start a discussion 

 
### Kubernetes Integration 

HPE Alletra Storage MP integrates with Kubernetes using industry-standard storage interfaces that enable applications to dynamically provision persistent storage. Depending on the storage personality, developers can use the Container Storage Interface (CSI) for block and file storage 

The definitive source for end-user documentation using Kubernetes and neighboring partner ecosystems with HPE Alletra MP B10000. 

* [Storage Container Orchestrator Documentation ![](Github)](https://github.com/hpe-storage/scod)
* [Explore the SCOD portal](https://scod.hpedev.io/)

 

### HPE Alletra Storage MP B10000 Container Storage Interface (CSI) 

The HPE Alletra Storage MP B10000 is designed for stateful Kubernetes workloads that require high-performance enterprise block storage. The HPE CSI Driver enables Kubernetes to dynamically provision, manage, and consume persistent storage directly from the B10000 platform. 

* [View the API documentation](https://developer.hpe.com/api/hpe-nimble-csp/)
* [Helm Chart](https://artifacthub.io/packages/helm/hpe-storage/hpe-csi-driver)
* [Operator for Kubernetes](https://artifacthub.io/packages/olm/community-operators/hpe-csi-operator)
* [Operator for OpenShift](https://access.redhat.com/containers/#/registry.connect.redhat.com/hpestorage/csi-driver-operator)
* [Visit documentation on SCOD](https://scod.hpedev.io/csi_driver/index.html) 

 


### Prometheus Array Exporter 

A Prometheus array exporter that may be deployed as a standalone binary or directly on Kubernetes. There's also an exporter for the CSI driver that may be deployed separately.

* [Prometheus Array Exporter ![](Github)](https://github.com/hpe-storage/array-exporter)
* [Read the documentation](https://hpe-storage.github.io/array-exporter)
* [Learn about the CSI info metrics provider on SCOD](https://scod.hpedev.io/csi_driver/metrics.html)

## HPE Alletra Storage MP X10000 (Unstructured Data) 

### Purpose 

The HPE Alletra Storage MP X10000 is designed for unstructured data at scale. It combines enterprise object storage with integrated data services to support AI, analytics, media repositories, backup, archive, and large-scale file and object workloads. 

### Developer Resources, REST APIs, and SDKs 

The HPE Alletra Storage MP X10000 is designed for cloud-native development and data-intensive applications. It provides standards-based interfaces and APIs that allow developers to build applications that store, retrieve, analyze, and manage large volumes of unstructured data. 

 
### S3-Compatible APIs 

The X10000 exposes an Amazon S3-compatible object interface, allowing developers to use existing S3 SDKs and tools with minimal or no code changes. 

Supported SDKs include: 

* AWS SDK for Python (Boto3) 
* AWS SDK for Java 
* AWS SDK for Go 
* AWS SDK for C++ 
* AWS CLI 
* S3-compatible backup and data management applications 

 

### HPE GreenLake Cloud API 

The HPE GreenLake Cloud Platform provides a comprehensive set of REST APIs that enable developers, administrators, and automation platforms to programmatically manage HPE Alletra Storage MP environments. These APIs provide a unified management interface across HPE infrastructure, allowing applications to provision resources, monitor health, collect telemetry, and automate operational workflows. 

GreenLake Developers Portal: [HPE GreenLake Developers Portal](https://developer.greenlake.hpe.com/) 

 

### Kubernetes Container Storage Interface (CSI) and Container Object Storage Interface (COSI) 

HPE Alletra Storage MP integrates with Kubernetes using industry-standard storage interfaces that enable applications to dynamically provision persistent storage.  The X10000 supports both CSI and COSI, allowing Kubernetes applications to consume either NFS-based persistent file storage or Amazon S3-compatible object storage. 
The definitive source for end-user documentation using Kubernetes and neighboring partner ecosystems with HPE Alletra MP X10000. 

* Storage Container Orchestrator Documentation: [Explore the SCOD portal](https://scod.hpedev.io/)
* HPE Storage GitHub Repository: [SCOD Repository![](Github)](https://github.com/hpe-storage/scod)

The HPE CSI Driver enables Kubernetes clusters to dynamically provision NFS exports on the X10000 for applications requiring shared file storage.  The HPE COSI Driver enables Kubernetes applications to dynamically provision and manage Amazon S3-compatible object storage buckets directly from the X10000 platform. 

* Documentation includes links to the current deployment information, GitHub repositories, Helm charts, and other developer resources 

*  HPE CSI Driver documentation: [HPE CSI Documentation on SCOD](https://scod.hpedev.io/csi_driver/)
*  HPE COSI Driver documentation: [HPE COSI Documentation on SCOD](https://scod.hpedev.io/cosi_driver/) 

* [HPE Storage GitHub Repository:![](Github)](https://github.com/hpe-storage)

 

### Model Context Protocol (MCP) Server 

The HPE Alletra Storage MP X10000 includes a native Model Context Protocol (MCP) Server that enables AI assistants, Large Language Models (LLMs), and autonomous AI agents to securely interact with object storage using the open Model Context Protocol standard. 

The MCP Server follows the standard MCP architecture consisting of: 

* Host – The AI application or MCP host (for example, Claude Desktop, VS Code, or an AI orchestration platform) 
* Client – Establishes and manages the MCP session with the X10000 
* MCP Server – Provides storage tools, resources, and prompts for interacting with the X10000 

Rather than requiring developers to build custom integrations with REST APIs or directly invoke Amazon S3 operations, the MCP Server exposes storage resources and operations through standardized MCP tools. This simplifies the development of AI-powered applications while providing secure, governed access to enterprise data. 

MCP User Guide Documentation: 

* [HPE Alletra Storage MP X10000 Model Context Protocol (MCP) Resource Manageability User Guide](https://support.hpe.com/hpesc/public/docDisplay?docId=sd00007928en_us) 
* [HPE Alletra Storage MP X10000 Model Context Protocol (MCP) Client Registration User Guide](https://support.hpe.com/hpesc/public/docDisplay?docId=sd00007927en_us) 

 

# Workshops-on-Demand

Take advantage of our free, Jupyter-Notebook based Workshops-on-Demand available in the [Hack Shack](/hackshack/). These technical workshops provide you with an in-depth, hands-on learning experience where you can interact with and learn from the experts. Designed to fit your schedule, these workshops are available 24/7 – any time, from anywhere. A CSI workshop for HPE Alletra is available today.

<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
<div class="w3-container w3-center w3-margin-bottom">
  <a href="/hackshack/workshops"><button type="button" class="button">Try now!</button></a>
</div>

- - -

## Any questions on HPE Alletra?

Join the [HPE DEV Slack Workspace](https://slack.hpedev.io/) and start a discussion in the [\#alletra](https://hpedev.slack.com/archives/C025D75HHGC) channel.