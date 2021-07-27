---
title: Data Services Cloud Console API
version: 0.1.1
description: Easy to read guides, tips and documentation to rapidly help any
  developer working with Data Services Cloud Console APIs.
image: /img/platforms/image-1-dscc.svg
width: large
priority: 1
tags:
  - data-services-cloud-console
  - greenlake-common-cloud
---
## Intro

Today, every organization are required to unleash the power of data to drive digital transformation. But fragmented data management tools, manual processes, and infrastructure silos spanning edge to cloud are getting in the way. Customers across industries are struggling with the complexity of managing data and infrastructure, because it  creates a roadblock to innovation and agility, but also drives business risk. And it’s only getting harder as data continues to grow, apps continue to evolve, and infrastructure continues to spread edge-to-cloud.

![Intelligent Data Platform](/img/dscc-high-level-diagram.jpg "DSCC Diagram")

This API provides resources for any customers that are looking to enhance their infrastructure management and data-ops using the programmatical extensions from Data Services Cloud Console. Data Services Cloud Console brings the cloud experience wherever data lives and streamlines data management across your hybrid cloud. It provides a suite of cloud services across your edge, core, and cloud to accelerate data, agility, and innovation for everyone, from data managers to data innovators.

![DSCC Automation](/img/dscc-api-value.png "API for Automation at Scale")

## REST API

The Data Services Cloud console public API is specified based on the OpenAPI format version 3 ([OpenAPI 3.0 information](https://swagger.io/blog/news/whats-new-in-openapi-3-0/)). The API definition is available for download in OpenAPI 3 yaml format at this link. Some of the advantages to distribution in OpenAPI 3.0 format:

1. Updates to the API can be generated in more agile manner where documentation are embedded as description to any endpoints, parameters, and many more such as contact information, license, terms of use.
2. Consumer of this API can also consume this API in an agile manner using the converter from this openAPI format to any language that were used as part of the their automation or CI/CD workflow. (Please check <https://openapi.tools> for more information for the API tools to generate client code)

[Link to the API repository](https://docs.ccs.arubathena.com/)

### Documentation and Tutorials

The overview of the Data Services Cloud Console is at [this link](https://www.hpe.com/us/en/storage/data-services-cloud-console.html#overview). There will be more blogs that will provide more information to help customer adopting this API.

### Supported API Categories (Services)

1. DataOps Manager
2. Event Audit
3. Task tracking
4. Search
5. Helps, Issues and announcement

### HTTP Request Methods

| HTTP verbs | Description               |
| ---------- | ------------------------- |
| GET        | Retrieves Target Resource |
| POST       | Creates an entity or changes state |
| PUT        | Replaces target resource with data part of the HTTP Request payload |
|----------- | ------------------------- |

### Any Questions on Data Services Cloud Console API?

Please join [HPEDEV Slack Workspace](https://slack.hpedev.io/) and start a discussion in our #DSCC channel

### Related Blogs