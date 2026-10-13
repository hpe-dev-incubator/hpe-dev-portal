---
title: HPE Alletra Storage MP B10000
version: v0.1
description: A paradigm shift in data infrastructure.
image: /img/alletra-element-small.png
width: large
priority: 12
date: 2025-06-16T09:12:23+02:00
active: true
quickLinks:
  - label: 'Web Service API'
    url: '#Hhpe-alletra-storage-mp-b10000-web-service-api-v3'
  - label: 'CSI'
    url: '#csi-driver'
  - label: 'SCOD Portal'
    url: 'https://scod.hpedev.io/'
  - label: 'Prometheus Array Exporter'
    url: '#prometheus-array-exporter'
  - label: 'Slack Channel'
    url: 'https://hpedev.slack.com/archives/C08URLVQRRR'
tags:
  - hpe-alletra
  - storage
  - B10000
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
Shed the complexity and silos inherent in conventional hybrid cloud environments with category-defining cloud-native data infrastructure that delivers a cloud operating and consumption experience wherever data lives. Stop managing infrastructure — and start simply accessing and utilizing it, as a service and on demand.

* Get the agility of cloud — everywhere
* Run any app — without compromise
* Free your data across hybrid cloud
## Features

HPE Alletra MP is Hewlett Packard Enterprise's modular, cloud-operational storage platform designed to consolidate enterprise storage workloads while providing independent scaling of compute and capacity. Built with a disaggregated architecture, HPE Alletra MP enables organizations to deploy different storage personalities on a common hardware platform, improving flexibility, efficiency, and operational simplicity.

![](/img/platforms/x10000.png)

Key benefits include:

* Modular, scale-out architecture
* Independent scaling of controllers and storage capacity
* Cloud-based management through HPE GreenLake
* High availability and enterprise-grade resiliency
* Support for both structured and unstructured data workloads

### Summary

The HPE Alletra MP platform provides a common hardware foundation capable of supporting multiple storage personalities.

| **Feature** | **B10000** | **X10000** |
| :----------------- | :-------------------------------------------------------------------------- | :-------------------------------------------------- |
| Data Type | Structured | Unstructured |
| Primary Storage | Block and file Storage | Object Storage and File |
| Typical Workloads | Databases, Virtualization, ERP | AI, Data Lakes, Backup, Media |
| Performance Focus | Low Latency & Intensive IOPS | Massive Scale & Throughput |
| Protocols | NVME, Fibre Channel, iSCSI, File | S3, Object Storage, NFS |
| Scalability | HPE GreenLake & Infosight | HPE GreenLake & Integrated Services |

Together, the B10000 and X10000 enable organizations to support both traditional enterprise applications and modern data-intensive workloads on the HPE Alletra MP platform, providing a unified operational experience while optimizing storage for different data types.

[For Developers Resources for HPE Alletra Storage MP X10000 (Unstructured Data)](/platform/hpe-alletra-X10000/home/)


## HPE Alletra Storage MP B10000 Web Service API v3

The HPE Alletra Storage MP B10000 platform offers a rich set of REST APIs to manage the system configuration, provision storage, and run other administrative operations.  See the links below for additional information about the REST API and how to use them:  

* [HPE Alletra Storage MP B10000: Web Services API Developer Guide v3](https://www.hpe.com/support/AlletraMP-B10000-WSAPIV3-devguide)
* [HPE Alletra Storage MP B10000: Web Services API Documentation and v3 OpenAPI specification](/ws/api-spec)
* [HPE Alletra Storage MP B10000 Web Services API v3 FAQ](https://www.hpe.com/psnow/doc/a00148521enw)  


# Projects

Plugins, SDKs and documentation.

## CSI Driver

A Container Storage Interface (CSI) Driver for Kubernetes. The HPE CSI Driver for Kubernetes allows you to use a Container Storage Provider to perform data management operations on storage resources.


* [CSI Driver Github Repository ![](Github)](https://github.com/hpe-storage/csi-driver)
* [View the API documentation](https://developer.hpe.com/api/hpe-nimble-csp/)
* [Helm Chart](https://artifacthub.io/packages/helm/hpe-storage/hpe-csi-driver)
* [Operator for Kubernetes](https://artifacthub.io/packages/olm/community-operators/hpe-csi-operator)
* [Operator for OpenShift](https://access.redhat.com/containers/#/registry.connect.redhat.com/hpestorage/csi-driver-operator)
* [Visit documentation on SCOD](https://scod.hpedev.io/csi_driver/index.html)

## [Storage Container Orchestrator Documentation ![](Github)](https://github.com/hpe-storage/scod)

The definitive source for end-user documentation using Kubernetes and neighboring partner ecosystems with HPE Alletra.

* [Explore the SCOD portal](https://scod.hpedev.io/)

## Prometheus Array Exporter

[Prometheus Array Exporter Github Repository![](Github)](https://github.com/hpe-storage/array-exporter)

A Prometheus array exporter that may be deployed as a standalone binary or directly on Kubernetes. There's also an exporter for the CSI driver that may be deployed separately.

* [Read the documentation](https://hpe-storage.github.io/array-exporter)
* [Learn about the CSI info metrics provider on SCOD](https://scod.hpedev.io/csi_driver/metrics.html)

# Workshops-on-Demand

Take advantage of our free, Jupyter-Notebook based Workshops-on-Demand available in the [Hack Shack](/hackshack/). These technical workshops provide you with an in-depth, hands-on learning experience where you can interact with and learn from the experts. Designed to fit your schedule, these workshops are available 24/7 – any time, from anywhere. A CSI workshop for HPE Alletra is available today.

<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
<div class="w3-container w3-center w3-margin-bottom">
  <a href="/hackshack/workshops"><button type="button" class="button">Try now!</button></a>
</div>

- - -

## Any questions on HPE Alletra MP B10000?

Join the [HPE DEV Slack Workspace](https://slack.hpedev.io/) and start a discussion in the [#hpe-alletra-b10k-api](https://hpedev.slack.com/archives/C08URLVQRRR) channel.
