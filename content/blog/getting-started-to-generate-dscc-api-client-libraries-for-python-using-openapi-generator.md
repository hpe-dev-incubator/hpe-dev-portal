---
title: Getting started to generate DSCC API Client Libraries for Python using
  OpenAPI-Generator
date: 2022-03-07T13:34:56.483Z
priority: 2
author: Anusha, Y; Sijeesh; RonD
authorimage: /img/404 developer.svg
thumbnailimage: /img/dscc-icon-transparent.png
tags:
  - data-services-cloud-console
---
# Getting started to generate DSCC API Client Libraries for Python using OpenAPI-Generator (painlessly!)

Data Services Cloud Console public REST API provides the interface for customers who are looking to enhance their data-ops using the programmatic extensions from Data Services Cloud Console (DSCC). The [Data Services Cloud Console Platform page](https://developer.hpe.com/platform/data-services-cloud-console/home/) details information about the DSCC benefits to customer.  Please see [Getting Started with DSCC API](https://developer.hpe.com/blog/getting-started-with-the-hpe-data-services-cloud-console-public-rest-api/) blog for the detail information to access the [DSCC API specification](https://console-us1.data.cloud.hpe.com/doc/api/v1/) that is created using [OpenAPI 3.X specification](https://swagger.io/docs/specification/about/). The API definition is available for download in either YAML or JSON format.

![DSCC API download](/img/dscc-api-spec.png "DSCC API specification download")

The definition file contains information about the following:

* All the endpoints of DSCC resources along with their HTTP headers, parameters, and the responses for each endpoint.
* Syntax of the HTTP methods (GET, POST, UPDATE, DELETE) and path (relative path)
* Description of each endpoint

  With this definition file (YAML or JSON), users can generate client libraries and use them to consume the capabilities of the DSCC programmatically. Currently, there are many tools in the market which does this job, some of the well-known tools are:

  * [OpenAPI generator](https://openapi-generator.tech/)
  * [Swagger Codegen](https://swagger.io/tools/swagger-codegen/)
  * [Azure AutoRest](https://github.com/Azure/autorest)
  * REST API Client Code generator (Found within [Visual Studio MarketPlace](https://marketplace.visualstudio.com/items?itemName=ChristianResmaHelle.ApiClientCodeGenerator))



![]()



```javascript
java -jar openapi-generator-cli.jar generate -i storage-api.yaml -g python -o sdks/dscc-python-sdk
```