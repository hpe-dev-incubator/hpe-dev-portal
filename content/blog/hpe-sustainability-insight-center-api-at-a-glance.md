---
title: HPE Sustainability Insight Center API at a glance
date: 2024-06-24T12:44:18.079Z
author: Didier Lalli
authorimage: /img/didier-lalli.png
disable: false
---
HPE GreenLake provides a new service called HPE Sustainability Insight Center that can assist you in obtaining detailed information about carbon emissions, energy consumption and the cost of the infrastructure that is managed by HPE GreenLake. In this blog post, I will explain how to extract data from this service in a programmatic way using cURL and the HPE Sustainability Insight Center API.

## 
What is HPE Sustainability Insight Center?


HPE Sustainability Insight Center is a service that runs on HPE GreenLake. I can add it into my workspace from the HPE GreenLake catalogue under the Management & Governance category.

Fig1

Once deployed, the service provides a dashboard, which I can use to monitor carbon emissions, energy consumption, and energy cost. You can get more details about HPE Sustainability Insight Center from the [User Guide](https://support.hpe.com/hpesc/public/docDisplay?docId=a00120892en_us&page=GUID-64E2035A-138E-44E8-8A04-7968A272A97E.html).

Fig2

In addition to the dashboard, HPE Sustainability Insight Center provides an API, to enable programmatically accessing this same data.

## What can I do with the HPE Sustainability Insight Center API?


Important use cases covered by the HPE Sustainability Insight Center API include:

* Achieving sustainability goals — Use data retrieved from the HPE Sustainability Insight Center API to measure your organization's power consumption and carbon footprint. With this data, your organization can make data-infused, informed decisions to reduce its climate impact and ensure its IT assets operate in a way that meets regulatory and business environmental sustainability goals.
* Monitoring IT costs — Use data available from the HPE Sustainability Insight Center API to rationalize the power consumption of IT assets operations for cost efficiency. This will free up budget for innovative and growth-orientated investments.
* Integrating into reporting workflows — Use data retrieved from the HPE Sustainability Insight Center to incorporate into existing analytics, reporting, dashboards, and forecasting workflows to give your organization a robust understanding of its IT operations.
  Where is the HPE Sustainability Insight Center API documented?
  The API specifications are found on the HPE GreenLake developer portal along with other HPE GreenLake APIs. For HPE Sustainability Insight Center, there are 3 API calls available:
  •	usageByEntity: Retrieves an aggregated energy usage list grouped by individual entities over a defined time frame.
  •	usageTotals: Returns the total aggregated power cost, power consumption, and carbon emissions over a defined time frame and supports filtering by entities.
  •	usageSeries: Retrieves aggregated energy usage statistics grouped by time bucket over a defined time frame and supports filtering by entities.
*
*
*
*
*
*
*
*
*
*

Note: You can download the OpenAPI specs from the HPE GreenLake developer portal, if you want to use the API from a tool such as Postman.

Be careful with tokens!
A little word of advice about tokens. Because the HPE Sustainability Insight Center is a service, you will need to create a dedicated API client credentials for it in your workspace (under Manage Workspace/API). You cannot use HPE GreenLake platform API client credentials, as it will result in a 403-error code. Also, you’ll need to be careful, as API client credentials are region specific. When creating an API client credentials, say for Europe (EU Central), make sure to use it to call the API endpoint for that region, as shown below (Connectivity Endpoint).