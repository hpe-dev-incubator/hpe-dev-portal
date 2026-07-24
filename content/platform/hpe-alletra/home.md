---
title: HPE Alletra
version: v0.1
description: A paradigm shift in data infrastructure.
image: /img/alletra-element-small.png
width: large
priority: 12
date: 2025-06-16T09:12:23+02:00
active: true
tags:
  - storage
  - B10000
  - hpe-alletra
  - hpe-alletra-6000
  - hpe-alletra-9000
  - MCP
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


HPE Alletra MP is Hewlett Packard Enterprise's modular, cloud-operational storage platform designed to consolidate enterprise storage workloads while providing independent scaling of compute and capacity. 


## Features

Built with a disaggregated architecture, HPE Alletra MP enables organizations to deploy different storage personalities on a common hardware platform, improving flexibility, efficiency, and operational simplicity. 

![](/img/platforms/x10000.png)


Key benefits include: 

* Get the agility of cloud — everywhere
* Run any app — without compromise
* Free your data across hybrid cloud


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

[For Developers Resources for HPE Alletra Storage MP X10000 (Unstructured Data)](/content/platform/hpe-alletra-X1000/home.md)

## Dev Resources

The B10000 provides Developers with SDKs, sample code, and REST-based APIs for storage provisioning, monitoring, automation, and lifecycle management. These APIs can be integrated into orchestration platforms, custom portals, and enterprise automation frameworks. 

HPE GreenLake API Documentation 

Kubernetes Integration 

HPE Storage SDKs 

HPE GitHub repositories containing automation examples, Ansible collections, Terraform providers, and PowerShell modules 

### HPE Alletra Storage MP B10000 Web Service API v3

The HPE Alletra Storage MP B10000 platform offers a rich set of REST APIs to manage the system configuration, provision storage, and run other administrative operations.  See the links below for additional information about the REST API and how to use them:  

* [HPE Alletra Storage MP B10000: Web Services API Developer Guide v3](https://www.hpe.com/support/AlletraMP-B10000-WSAPIV3-devguide)
* [HPE Alletra Storage MP B10000: Web Services API Documentation and v3 OpenAPI specification](/ws/api-spec)
* [HPE Alletra Storage MP B10000 Web Services API v3 FAQ](https://www.hpe.com/psnow/doc/a00148521enw)  


### Kubernetes Integration 

HPE Alletra Storage MP integrates with Kubernetes using industry-standard storage interfaces that enable applications to dynamically provision persistent storage. Depending on the storage personality, developers can use the Container Storage Interface (CSI) for block and file storage 

The definitive source for end-user documentation using Kubernetes and neighboring partner ecosystems with HPE Alletra MP B10000.

[* Storage Container Orchestrator Documentation](https://github.com/hpe-storage/scod)
* [Explore the SCOD portal ](https://scod.hpedev.io/)

### HPE Alletra Storage MP B10000 Container Storage Interface (CSI) 

The HPE Alletra Storage MP B10000 is designed for stateful Kubernetes workloads that require high-performance enterprise block storage. The HPE CSI Driver enables Kubernetes to dynamically provision, manage, and consume persistent storage directly from the B10000 platform. 

* [CSI Driver Repository ](https://github.com/hpe-storage/csi-driver)
* [View the API documentation ](https://developer.hpe.com/api/hpe-nimble-csp/)
* [Helm Chart](https://artifacthub.io/packages/helm/hpe-storage/hpe-csi-driver)
* [Operator for Kubernetes](https://artifacthub.io/packages/olm/community-operators/hpe-csi-operator)
* [Operator for OpenShift](https://access.redhat.com/containers/#/registry.connect.redhat.com/hpestorage/csi-driver-operator)
* [Visit documentation on SCOD] (https://scod.hpedev.io/csi_driver/index.html)

### Prometheus Array Exporter

A Prometheus array exporter that may be deployed as a standalone binary or directly on Kubernetes. There's also an exporter for the CSI driver that may be deployed separately.

* [Prometheus Array Exporter ![](Github)](https://github.com/hpe-storage/array-exporter)
* [Read the documentation](https://hpe-storage.github.io/array-exporter)
* [Learn about the CSI info metrics provider on SCOD](https://scod.hpedev.io/csi_driver/metrics.html)


## Training

### Workshops-on-Demand

Take advantage of our free, Jupyter-Notebook based Workshops-on-Demand available in the [Hack Shack](/hackshack/). These technical workshops provide you with an in-depth, hands-on learning experience where you can interact with and learn from the experts. Designed to fit your schedule, these workshops are available 24/7 – any time, from anywhere. A CSI workshop for HPE Alletra is available today.

<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
<div class="w3-container w3-center w3-margin-bottom">
  <a href="/hackshack/workshops"><button type="button" class="button">Try now!</button></a>
</div>

### Technical Demos:

![](/img/platforms/x10000-console.png)

<br/>

| Demo                                                                        | Description                                                                                                                                                                                                                              | Link                                                                                                                                                                                                   |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 
HPE Alletra Storage MP B10000: Agentic Support Automation                        | In this video, HPE demonstrates how Agentic Support Automation for HPE Alletra Storage MP B10000 uses AI-driven anomaly detection, operational intelligence, and proactive remediation to identify and resolve potential issues before they impact business operations.                                                            | [Video](https://www.hpe.com/ca/fr/resource-library.video.hpe-alletra-storage-mp-b10000-agentic-support-automation.v100014858.html)                                                     |
| HPE Alletra Storage MP B10000 An industry leading architecture                          | This video explores the HPE Alletra Storage MP B10000, a cutting-edge, scalable storage platform built for high performance and efficiency. | [Video](https://www.hpe.com/emea_europe/en/resource-library.video.hpe-alletra-storage-mp-b10000-an-industry-leading-architecture.v100006684.html)                                                                                                                                                   | 
<br/>


## Community

### Any questions on HPE Alletra?

Join the [HPE DEV Slack Workspace](https://slack.hpedev.io/) and start a discussion in the [\#alletra](https://hpedev.slack.com/archives/C025D75HHGC) channel.

- - -