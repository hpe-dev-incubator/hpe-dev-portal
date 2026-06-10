---
title: HPE OpsRamp Service Desk Overview
date: 2026-06-10T09:35:11.564Z
priority: ""
author: Sudhir K
authorimage: /img/Avatar1.svg
disable: false
tags:
  - ITSM
  - HPE OpsRamp Service Desk
  - hpe-opsramp
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

A Unified, Automated, and Insight Driven ITSM Platform 

## Purpose of This Guide

This document provides an overview of HPE OpsRamp Service Desk capabilities, configuration areas, automation features, and reporting. It is intended to help users understand how the platform works.

### Overview

HPE OpsRamp Service Desk delivers a modern IT Service Management (ITSM) experience that unifies people, processes, and automation—enabling IT teams to operate with speed, clarity, and scale.  Built on ITIL aligned principles, OpsRamp Service Desk helps organizations manage incidents, service requests, changes, and operational workflows from a single, intuitive platform—while delivering real time insight and governance. 

HPE OpsRamp supports all key IT service management scenarios through standardized entities: 

* **Incidents** for service disruptions
* **Service Requests** for pre approved user needs 
* **Problems** to address root causes 
* **Changes** with controlled approvals 
* **Tasks** & **Time Bound** activities for operational execution

Why HPE OpsRamp Service Desk?

Key Business Outcomes

* Centralized ticket management
* Faster incident resolution 
* Consistent service delivery with SLA enforcement 
* Reduced manual effort through automation 
* Clear visibility with role based access and reporting 
* Designed for Simplicity and Scale

**Service Desk** provides a single experience for: 

* Ticket Operations
* Configuration 
* Automation
* Reporting 

#### Navigation Overview

Command Center

```
       └── Tickets (Operations & Views) 
```

 Setup

```
  └── Account 
    
           └── Service Desk (Configuration & Automation) 
```

### Core ITSM Capabilities

Standardized entities ensure consistent reporting, automation, and SLA tracking across teams.

OpsRamp supports all major ITSM entities required for day to day operations:

<div align="center">

Entity Type     | Purpose     |
| -------- | ------- |
| Service Request | Low risk, pre approved user requests |
| Incident | Service disruptions or failures  |
| Problem    | Root cause analysis for recurring issues     |
| Change | Controlled changes with approvals  | 
| Task | One time scheduled operational activities  |
| Time Bound| Recurring or scheduled access activities with approvals | 
</div>

**Callout** — Best Practice 
Standardized entities ensure consistent reporting, automation, and SLA tracking across teams. 

###  Service Desk Configuration
OpsRamp allows deep configuration without customization overhead. 

#### Configuration Components 

* Settings (Rules & Behavior) 
* Custom Forms (Business Context) 
* Business Impacts and Urgencies
* Categories (Logical Grouping) 
* Status Flow (Controlled Transitions) 
* Priority Matrix
* Status Change Reasons

#### Settings
Settings allows admins to define how different ticket entities behave during their lifecycle.

* Ticket conversations, email notifications, SLA, approvals, etc

#### Customize ticket fields using Custom Forms

Custom Forms help customize tickets with:
* Addition of custom fields to ticket entities to capture business specific information

* Custom fields use in alert policy filters
* Custom fields visibility restriction to specific users.


#### Organize using Categories
Categories help to streamline and organize tickets by grouping similar types of requests. This will further help sort, filter, report and analyse ticket trends.


#### Workflow Governance with Status Flows 
Clear Ownership at Every Stage

Ticket Flow

[New → Open → Pending / On-Hold → Resolved → Closed]


* Ensures accountability 
* Prevents uncontrolled state changes 
* Improves SLA compliance 

Callout - Ticket Flow can be customized per user’s need using Status Flows
