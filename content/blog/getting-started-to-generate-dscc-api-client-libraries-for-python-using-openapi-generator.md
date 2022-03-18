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

  ![](/img/yamlfile.png "DSCC Open API specification (YAML)")

  With this definition file (YAML or JSON), users can generate client libraries and use them to consume the capabilities of the DSCC programmatically. Currently, there are many tools in the market which does this job, some of the well-known tools are:

  * [OpenAPI generator](https://openapi-generator.tech/)
  * [Swagger Codegen](https://swagger.io/tools/swagger-codegen/)
  * [Azure AutoRest](https://github.com/Azure/autorest)
  * REST API Client Code generator (Found within [Visual Studio MarketPlace](https://marketplace.visualstudio.com/items?itemName=ChristianResmaHelle.ApiClientCodeGenerator))

### Generating Client Libraries using OpenAPI Generator:

OpenAPI generator allows generation of API client libraries (SDK Generation), server stubs, documentation, and configuration automatically given an OpenAPI spec (both 2.0 and 3.0 are supported). This tool supports more than 50 programming languages and Devops tools.

This tool is available in various forms for usage:

* A downloadable and executable JAR file
* Docker image
* Dependencies in Maven and  Gradle projects
* Node package manager (npm) package wrapper

![](/img/openapi-generator.png "OpenAPI Generator GitHub Page")



Lets look at the simple installation of openAPI generator, that is a JAR file. Actually using JAR file doesn't need installation at all, just download the JAR file and use it directly. The prerequisite to use the JAR file is to have Java runtime 8 (JRE) at a minimum.

The JAR file is available at Maven.org and its location is <https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/5.4.0/openapi-generator-cli-5.4.0.jar>

For Mac/Linux users:

```
wget https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/5.4.0/openapi-generator-cli-5.4.0.jar -O openapi-generator-cli.jar
```

For Windows users:

```
Invoke-WebRequest -OutFile openapi-generator-cli.jar https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/5.4.0/openapi-generator-cli-5.4.0.jar
```

![]()

```javascript
java -jar openapi-generator-cli.jar generate -i storage-api.yaml -g python -o sdks/dscc-python-sdk
```