---
title: HPE X10000
version: v0.1
description: A paradigm shift in data infrastructure.
image: /img/alletra-element-small.png
width: large
priority: 12
date: 2026-07-16T09:12:23+02:00
active: true
tags:
  - hpe-alletra
  - storage
  - x10000
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


Accelerate AI pipelines with a high-performance, intelligent data platform—boosting throughput, maximizing GPU utilization, and turning data into AI-ready insight faster. 



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


| **Feature**           | **B10000**                                                 | **X10000**                                  |
| :----------------- | :-------------------------------------------------------------------------- | :-------------------------------------------------- |
| Data Type     | Structured                            | Unstructured                       |
| Primary Storage| Block Storage                         | Object Storage and File  |
| Typical Workloads  | Databases, Virtulization, ERP                                                       | AI, Data Lakes, Backup, Media             |
| Performance Focus    | Low Latency & HIgh IOPS                                       | Massive Scale & Throughput                         |
| Protocols   | NVME, Fibre Channel, iSCSI, File                                      | S3, Object Storage, NFS           |
| Scalability    | HPE GreenLake & Infosight | HPE GreenLake & Integrated Services |

Together, the B10000 and X10000 enable organizations to support both traditional enterprise applications and modern data-intensive workloads on the HPE Alletra MP platform, providing a unified operational experience while optimizing storage for different data types.

[For Developers Resources for HPE Alletra Storage MP B10000 (Unstructured Data)](/content/platform/hpe-alletra/home.md)



## Dev Resources


The HPE Alletra Storage MP X10000 is designed for cloud-native development and data-intensive applications. It provides standards-based interfaces and APIs that allow developers to build applications that store, retrieve, analyze, and manage large volumes of unstructured data. 

 
### S3-Compatible APIs 

HPE Alletra Storage MP X10000 provides an Amazon S3-compatible object storage interface, enabling developers and applications to interact with object storage using familiar AWS S3 APIs. This compatibility allows organizations to leverage existing S3-based tools, applications, and development workflows with minimal or no application code changes. 

'Note: The complete and current list of supported Amazon S3 APIs is available through HPE support documentation and product release notes'

Supported SDKs and tools include: 

* AWS SDK for Python (Boto3) 
* AWS SDK for Java 
* AWS SDK for Go 
* AWS SDK for C++ 
* AWS Command Line interface (AWS CLI)
* S3-compatible backup, archive, and data management applications 


### GreenLake API 


The GreenLake Cloud Platform and the GreenLake dedicated platform (on premises) provides a comprehensive suite of REST APIs that enable developers, administrators, and automation platforms to programmatically manage HPE Alletra Storage MP X10000 environments. These APIs provide a unified management framework across HPE infrastructure, allowing organizations to provision and configure unstructured storage resources, monitor system healthand performance, collect operational telemetry, and automate  routine administrative tasks. By exposing management capabilities through standardized REST interfaces, the platform facilitates integration with third-party tools, orchestration frameworks, and custom applications, helping organizations streamline operations, improve efficiency, and implement Infrastructure-as-Code (IaC) and DevOps-driven workflows.

Available APIs: 

* GreenLake Developer Portal: [HPE GreenLake Developer Portal](https://developer.greenlake.hpe.com/)

* Storage Fleet API: [GreenLake for Storage Fleet REST APIs](https://developer.greenlake.hpe.com/docs/greenlake/services/storage-fleet/public/openapi/storage-fleet-public-v1alpha1/storage-fleet-api)

* Object Storage API:  [GreenLake for Object Storage REST APIs ](https://developer.greenlake.hpe.com/docs/greenlake/services/object-storage/public/openapi/object-storage-public-v1alpha1/object-storage-api)


### Kubernetes Container Storage Interface (CSI) and Container Object Storage Interface (COSI) 


HPE Alletra Storage MP integrates with Kubernetes using industry-standard storage interfaces that enable applications to dynamically provision persistent storage.  The X10000 supports both CSI and COSI, allowing Kubernetes applications to consume either:

* NFS-based persistent file storage using CSI 
* Amazon S3-compatible object storage using COSI

**Storage Container Orchestrator Documentation(SCOD)**


The primary source for end-user documentation covering Kubernetes and related ecosystem integrations with HPE Alletra Storage MP X10000 is the Storage Container Orchestrator Documentation (SCOD) portal. 

* [SCOD portal](https://scod.hpedev.io/)
* HPE Storage GitHub Repository: [SCOD Repository![](Github)](https://github.com/hpe-storage/scod)


**HPE CSI Driver**


The HPE CSI Driver enables Kubernetes clusters to dynamically provision and manage NFS exports on the X10000 platform. This capability supports applications that require persistent shared file storage across multiple pods or nodes with RWX, RWO, and ROX access modes. 

Documentation and Resources:  

* [HPE CSI Documentation (SCOD)](https://scod.hpedev.io/csi_driver/)
* [Deployment guides](https://scod.hpedev.io/csi_driver/deployment.html)
* [Helm Chart](https://artifacthub.io/packages/helm/hpe-storage/hpe-csi-driver)
* [Operator for Kubernetes :![](Github)](https://github.com/hpe-storage)

**HPE COSI Driver**


The HPE COSI Driver enables Kubernetes applications to dynamically provision and manage Amazon S3-compatible object storage buckets directly on the X10000 platform. This provides cloud-native object storage services for applications that require scalable, API-driven object storage. 

Documentation and Resources: 

* [HPE COSI Driver Documentation (SCOD)](https://scod.hpedev.io/cosi_driver/index.html)
* [Deployment guides](https://scod.hpedev.io/cosi_driver/deployment.html)
* [Helm Chart](https://artifacthub.io/packages/helm/hpe-storage/hpe-cosi-driver) 

Together, the HPE CSI and COSI drivers provide Kubernetes administrators and developers with a unified approach to consuming both file and object storage services from HPE Alletra Storage MP X10000 using cloud-native standards.


## Model Context Protocol (MCP) Server 


The HPE Alletra Storage MP X10000 includes a native Model Context Protocol (MCP) Server that enables AI assistants, Large Language Models (LLMs), and autonomous AI agents to securely interact with object storage using the open Model Context Protocol standard. 

The MCP Server follows the standard MCP architecture consisting of: 

* Host – The AI application or MCP host (for example, Claude Desktop, VS Code, or an AI orchestration platform) 
* Client – Establishes and manages the MCP session with the X10000 
* MCP Server – Provides storage tools, resources, and prompts for interacting with the X10000 


Rather than requiring developers to build custom integrations with REST APIs or directly invoke Amazon S3 operations, the MCP Server exposes storage resources and operations through standardized MCP tools. This simplifies the development of AI-powered applications while providing secure, governed access to enterprise data. 

MCP User Guide Documentation: 

* [HPE Alletra Storage MP X10000 Model Context Protocol (MCP) Resource Manageability User Guide](https://support.hpe.com/hpesc/public/docDisplay?docId=sd00007928en_us) 
* [HPE Alletra Storage MP X10000 Model Context Protocol (MCP) Client Registration User Guide](https://support.hpe.com/hpesc/public/docDisplay?docId=sd00007927en_us) 



## Training


### Workshops-on-Demand

Take advantage of our free, Jupyter-Notebook based Workshops-on-Demand available in the [Hack Shack](/hackshack/). These technical workshops provide you with an in-depth, hands-on learning experience where you can interact with and learn from the experts. Designed to fit your schedule, these workshops are available 24/7 – any time, from anywhere.

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
HPE Alletra Storage MP X10000 Explainer Video                         | Accelerate AI and analytics with HPE Alletra Storage MP X10000—high-performance object storage built for scale, speed, and trusted data protection.                                                            | [Video](https://www.youtube.com/watch?v=7dfFIzVgw00)                                                     |
| GreenLake - HPE Alletra Storage MP X10000 walkthrough                          | In this video, HPE experts showcase a walkthrough of HPE Alletra Storage MP X10000 on GreenLake, highlighting simplified monitoring, alerting, management, and provisioning for X10000 fileshare. | [Video](https://www.youtube.com/watch?v=rF8jyKxtO5Y)                                                                                                                                                   |
| Demo - HPE Alletra Storage MP X10000 - AI, Analytics, Recovery                                    | This is a demo video highlighting HPE Alletra Storage MP X10000.                      | [Video](https://www.youtube.com/watch?v=sVfDx7EuyrA) |
| Fast track innovation: how HPE simplifies model deployment / object storage | This demo showcases the built-in machine learning services that simplify and automate model development and deployment.                                                                                                                  | [Video](https://www.youtube.com/watch?v=THeg2DwrF4c)                                                                                                                                                   |
| Enriching metadata with HPE Alletra Storage MP X100000 Data Intelligence               | In this video, Grishma explains how HPE Alletra Storage MP X10000 uses Data Intelligence to enrich metadata, improving data visibility, enabling smarter management, and delivering deeper insights for modern workloads.                                                                      | [Video](https://www.youtube.com/watch?v=IfDpI7spEy8)                                                                                                                                                   |

<br/>


## Community


### Any questions on HPE Alletra?

Join the [HPE DEV Slack Workspace](https://slack.hpedev.io/) and start a discussion in the [\#alletra](https://hpedev.slack.com/archives/C025D75HHGC) channel.

- - -
