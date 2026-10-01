---
title: HPE ProLiant
version: v0.1
description: HPE ProLiant servers, automation and IAC
image: /img/platforms/dev-thumb-compute.png
width: large
priority: 12
date: 2026-10-17T00:00:00+00:00
active: true
quickLinks:
  - label: 'HPE Compute'
    url: '/platform/hpe-compute/home/'
  - label: 'iLO RESTful API'
    url: '/platform/ilo-restful-api/home/'
  - label: 'Compute Ops management'
    url: '/greenlake/hpe-greenlake-for-compute-ops-management/home/'
  - label: 'HPE OneView'
    url: '/platform/hpe-oneview/home/'
  - label: 'HPE NonStop'
    url: '/platform/hpe-nonstop/home/'
tags:
  - hpe-proliant
  - hpe-compute
  - ilo
  - hpe-oneview
  - hpe-nonstop
  - server management
  - infrastructure automation
  - restful api

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

A portfolio of enterprise servers engineered for AI, virtualization,
data-intensive applications, and mission-critical workloads from edge to data
center. Built-in, industry leading security of HPE iLO 8, AI-driven operations
of HPE Compute Ops Management help simplify compute at the edge and in the data
center. Designed to accelerate innovation, improve efficiency, and deliver the
reliability organizations depend on.


## Features

For automating HPE ProLiant server operations, the main resource stack is HPE iLO with Redfish, supplemented by iLOrest, Ansible, HPE OneView, HPE Compute Ops Management, and firmware/lifecycle tools such as SPP
and Smart Update Manager. Additional resources includes Terraform providers and simulators.


* **Enterprise server portfolio:** A broad range of rack, tower, and density-optimized servers engineered for the edge and the data center.


* **Secure by design:** Protection built into silicon, firmware, and operations with HPE iLO and the Silicon Root of Trust.


* **Intelligent operations:** Automated lifecycle management across the compute estate with HPE Compute Ops Management and HPE OneView.


* **Optimized for modern workloads:** AI, virtualization, analytics, and business-critical applications.


- - -


## Dev Resources

HPE ProLiant servers are managed and automated through a common set of APIs and tools, so most of the deep technical
content lives on the platform pages linked below. This section highlights the resources developers use most often to
provision, configure, and integrate HPE ProLiant into their own tools and pipelines.

### iLO RESTful API and Redfish

Every HPE ProLiant server exposes a DMTF Redfish-conformant API through [HPE iLO](/platform/ilo-restful-api/home/), the
standard interface for out-of-band provisioning, configuration, inventory, and monitoring.

* [iLO RESTful API developer page](/platform/ilo-restful-api/home/) – SDKs for Python, PowerShell, Ruby, and JavaScript, plus Ansible, Chef, and Puppet integrations
* [python-ilorest-library](https://github.com/HewlettPackard/python-ilorest-library) – Python bindings for Redfish and iLO RESTful API automation
* [iLOrest CLI](https://github.com/HewlettPackard/python-redfish-utility) – scriptable, interactive Redfish client for Windows and Linux
* [PowerShell-ProLiant-SDK](https://github.com/HewlettPackard/PowerShell-ProLiant-SDK) – Cmdlets for managing ProLiant servers from PowerShell

### Simulate and test without hardware

* [iLO Redfish emulator](https://github.com/HewlettPackard/ilo-redfish-emulator) – emulates the iLO Redfish interface for several ProLiant generations, ideal for CI pipelines and scripting without physical servers
* [Build your own iLO Redfish simulator](https://developer.hpe.com/blog/build-your-own-ilo-redfish-simulator/) – HPE Developer Community walkthrough using DMTF Redfish mockup tools

### Fleet-scale management and IaC

* [HPE Compute Ops Management](/greenlake/hpe-greenlake-for-compute-ops-management/home/) – cloud-based, as-a-service management, monitoring, and firmware compliance across your ProLiant fleet
* [HPE Compute Ops Management APIs](https://developer.greenlake.hpe.com/docs/greenlake/services/compute-ops/public/) – on the HPE GreenLake Developer Portal
* [HPE OneView](/platform/hpe-oneview/home/) – REST API and SDKs for template-driven, infrastructure-as-code server profiles
* [OneView Ansible collection](https://github.com/HewlettPackard/oneview-ansible-collection) and [Terraform provider](https://github.com/HewlettPackard/terraform-provider-oneview) – automate ProLiant provisioning with your existing pipelines
* [OneView Terraform samples](https://github.com/HewlettPackard/oneview-terraform-samples) – ready-to-adapt HCL examples

### Firmware and lifecycle tooling

* [Service Pack for ProLiant (SPP)](https://www.hpe.com/us/en/servers/service-pack.html) – a curated, tested bundle of firmware, drivers, and system software for ProLiant servers
* [Smart Update Manager (SUM)](https://www.hpe.com/info/sum) – automated, agentless deployment of SPP updates across your fleet

### Additional resources

* [HPE ProLiant product page](https://www.hpe.com/us/en/products/compute/proliant.html) – full portfolio, specifications, and configurations
* [HPE AI Servers](https://www.hpe.com/us/en/compute/ai-servers.html) – purpose-built ProLiant systems for AI training, tuning, and inferencing
* [Workshops-on-Demand](/hackshack/workshops) – free, Jupyter-Notebook based, hands-on iLO/Redfish workshops in the [Hack Shack](/hackshack/)

## Any questions about HPE ProLiant?


Have questions or want to engage with other developers? Join
the [HPE Developer Community Slack Workspace](https://developer.hpe.com/slack-signup) or use the [platform-specific community channel](https://hpedev.slack.com/archives/C8D2EJ66S)
