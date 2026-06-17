---
title: An Overview of IT Service Management using HPE OpsRamp Service Desk
date: 2026-06-17T15:43:00.000Z
author: Kanigiri, Sudhir
authorimage: /img/Avatar1.svg
disable: false
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

A unified, automated, and insight driven ITSM platform 

## Overview

HPE OpsRamp Software Service Desk delivers a modern IT service management (ITSM) experience that unifies people, processes, and automation—enabling IT teams to operate with speed, clarity, and scale.  Built on ITIL aligned principles, HPE OpsRamp Software Service Desk helps organizations manage incidents, service requests, changes, and operational workflows from a single, intuitive platform—while delivering real time insight and governance. 

HPE OpsRamp Software supports the key IT service management scenarios through standardized entities: 

* **Incidents** for service disruptions 
* **Service requests** for preapproved user needs 
* **Problems** to address root causes 
* **Changes** with controlled approvals 
* **Tasks & time bound activities** for operational implementation

Why HPE OpsRamp Software Service Desk? 
**Key business outcomes** 

* Centralized ticket management
* Faster incident resolution 
* Consistent service delivery with service level agreement (SLA) enforcement 
* Reduced manual effort through automation 
* Clear visibility with role based access and reporting 
* Designed for simplicity and scale

**Service Desk** provides a single experience for: 

* Ticket operations 
* Configuration 
* Automation 
* Reporting

## Navigation overview

Command center 

```
  └── Tickets (operations & views)
```

 Setup

```
  └── Account 

      └── Service Desk (configuration & automation) 
```

Core ITSM capabilities 
Standardized entities ensure consistent reporting, automation, and SLA tracking across teams. 

HPE OpsRamp Software supports the major ITSM entities required for day to day operations: 

<div align="center">

| **Entity type** | **Purpose**                                              |
| --------------- | -------------------------------------------------------- |
| Service request | Tensor cores, attention units                            |
| Incident        | KV cache slices currently in use                         |
| Problem         | Overall KV cache across all layers                       |
| Change          | Prompt, documents                                        |
| Task            | Archived corpora, vector DB, documents                   |
| Time bound      | Recurring or scheduled access activities with approvals. |

</div>

**Best practice**

Standardized entities ensure consistent reporting, automation, and SLA tracking across teams. 

Service Desk configuration
HPE OpsRamp Software allows deep configuration without customization overhead. 
Configuration components 

* Settings (rules & behavior) 
* Custom Forms (business context) 
* Business Impacts and Urgencies
* Categories (logical grouping) 
* Status Flow (controlled transitions) 
* Priority Matrix
* Status Change Reasons

![](/img/opsramp-servicedesk1.png "Figure 1. Service Desk configurations")

**Settings**

Settings allows admins to define how different ticket entities behave during their lifecycle.

* Ticket conversations, email notifications, SLA, approvals, etc.

**Customize ticket fields using Custom Forms**

Custom Forms help customize tickets with

* Addition of custom fields to ticket entities to capture business specific information
* Custom fields use in alert policy filters
* Custom fields visibility restriction to specific users

**Organize using categories**

Categories help to streamline and organize tickets by grouping similar types of requests. This will further help sort, filter, report, and analyze ticket trends.

Clear ownership at every stage 
Ticket Flow => \[New → Open → Pending / OnHold → Resolved → Closed]

* Ensures accountability
* Prevents uncontrolled state changes 
* Improves SLA compliance

Ticket Flow can be customized per user’s need using Status Flows

Intelligent prioritization framework 
Impact × urgency = priority 
HPE OpsRamp Software derives ticket priority using a structured **Priority Matrix**.

* Business impact: Scope of service disruption 
* Urgency: Time sensitivity of resolution

**Consistency benefit:**

Every team prioritizes tickets the same way—reducing subjectivity and escalation noise. 

**Accountability with Status Change Reasons**

Visibility drives better outcomes 
By capturing reasons for every status change, HPE OpsRamp Software: 

* Improves audit and compliance readiness 
* Clarifies ticket history 
* Strengthens operational transparency 

**Service Desk automation**

Built in automation that scales IT operations 

![](/img/opsramp-servicedesk2.png "Figure 2. Service Desk automation")

**Service level agreements**

Setup → Account → Service Desk → Service Level Agreements

* Priority based response and resolution timers 
* Automated breach prevention 
* Applicable to incidents and service requests

**Notifications** 

Setup → Account → Service Desk → Notifications

```
 Triggered by: 
```

* Ticket creation or updates 
* Status changes 
* Priority thresholds 
* Source (manual, email, policy driven) 

**Auto close policies**

Setup → Account → Service Desk → Auto Close Policies

* Reduces ticket backlog
* Ensures system hygiene

**Canned response**

Setup  Account  Service Desk  Canned Response

* Faster, consistent user communication 
* Automated recurring operational activities 

**Scheduled tasks**

Setup → Account → Service Desk → Scheduled Tasks

Persona based user experience

Purpose driven access control 

<div align="center">

| **Persona**       | **Capabilities**                                                   |
| ----------------- | ------------------------------------------------------------------ |
| **Regular User**  | Full ticket lifecycle management                                   |
| **Business User** | View only or comment based access (RBAC) Role Based Access Control |

</div>

**Security & governance advantage**

Role based access ensures visibility without compromising control. 

**Regular User**

![](/img/opsramp-servicedesk3.png "Figure 3. Service Desk regular user")

 **Business User**

![](/img/opsramp-servidedesk4.png "Figure 4. Service Desk business user")

Ticket Views

* Quick Views: Predefined filters 
* Custom Views: User saved filters

Designed to help users manage workload efficiently

![](/img/opsramp-servicedesk5.png "Figure 5. Service Desk views")

**Reporting & insights**

Operational and executive visibility 

![](/img/opsramp-servicedesk6.png "Figure 6. Service Desk reporting apps")

**Ticket Details report**

* Transaction level data 
* Audits and deep operational analysis 

![](/img/opsramp-servicedesk7.png "Figure 7. Service Desk ticket details report")

**Ticket Insights report** 

Key metrics:

* Ticket volumes and trends 
* Priority and status breakdown 
* Open vs resolved tickets 
* Productivity averages per day 

![](/img/opsramp-servicedesk8.png "Figure 8. Service Desk ticket insights report")

**Insight to action**

Measure performance, identify bottlenecks, and drive continuous improvement

**Seamless integrations**

Email integration

* Create incidents, service requests, or change requests directly from email 
* Automatic parsing and categorization 
* Zero manual intervention


 
