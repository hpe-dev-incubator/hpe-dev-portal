---
title: Getting Started with the HPE Data Services Cloud Console Public REST API
date: 2021-12-15T16:01:03.611Z
priority: 2
author: Ron Dharma
authorimage: https://gravatar.com/avatar/8102f2adeef249065ccb9c43b8866d17?s=192
thumbnailimage: /img/dscc-icon.png
---
![Unified DataOps ](/img/dscc-idp-core-architect.png "Unified DataOps")

Customers across industries are struggling with the complexity of managing data and infrastructure, because it creates a roadblock to innovation and agility. Today, every organization is required to unleash the power of data to drive digital transformation, but fragmented data management tools, manual processes, and infrastructure silos - spanning edge to cloud - are getting in the way. This complexity also amplifies business risk, and it's only getting harder as data continues to grow, apps evolve, and infrastructure continues its spread from edge to cloud. 

Data Services Cloud Console public REST API provides a resource for customers who are looking to enhance their infrastructure management and data-ops using the programmatic extensions from Data Services Cloud Console (DSCC).

### A Public REST API which is based on the OpenAPI 3.X Specification

![API diagram](/img/universal-public-api.png "API ")

Hewlett Packard Enterprise (HPE) offers the DSCC public REST API to provide the agility previously mentioned. It is specified based on the OpenAPI format version 3 (OpenAPI 3.0 information). The specification defines a standard, language-agnostic interface to the RESTful API allowing clients (both human and computer) to consume capabilities of DSCC services efficiently. The API definition is available for download in either OpenAPI 3 YAML or JSON format at the link mentioned in at the next chapter.


Some of the advantages of distributing the API in OpenAPI 3.0 format:

1. Updates to the API can be generated in a more agile manner where documentation is embedded, describing any endpoints, parameters, and more; such as contact information, license, terms of use.
2. Consumers of this API also gain the benefits of agility, by using the converter from openAPI yaml, or json to any programming language that is used as part of their automation or CI/CD workflow. (Please check https://openapi.tools for more information for the API tools to generate client code)

### DSCC REST API Details

Anyone can download this OpenAPI Specification (OAS) v3 definition of the DSCC from the following: [Link to the API repository](https://console-us1.data.cloud.hpe.com/doc/api/v1/)