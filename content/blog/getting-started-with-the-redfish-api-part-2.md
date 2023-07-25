---
title: Getting started with the Redfish® API - Part 2
date: 2021-07-20T17:55:56.129Z
featuredBlog: false
priority: null
author: Mike Garrett- Architect iLO RESTful API
authorimage: /img/blogs/Avatar1.svg
thumbnailimage: null
tags:
  - ilo-restful-api
  - redfish
  - iLO 5
---
### Updated July 25, 2023

# **A primer for coders**

In my last blog [post](/blog/getting-started-with-ilo-restful-api-redfish-api-conformance) I began a discussion about best practices for writing Redfish API client code. Last time we talked about resource versioning and resource inter-linking. I explained that client code should discover the data model and avoid making incorrect assumptions. In this post I will continue discussing some issues you should be aware of in order to create durable clients that interoperate across different implementations of the Redfish API.

## HTTP Status Codes and Redirect

HTTP requests to any REST API return an HTTP status code as part of the response. When writing Redfish client code you should encounter and handle any status codes defined in the Redfish specification. In addition, iLO uses `308 Redirect` on some URIs to redirect the client from an older version of the API to the newer version. For instance, iLO 4 responded to GET `/rest/v1`. If you try this with iLO 5, you will receive an HTTP `308 Redirect` to `/redfish/v1/`.

## Unimplemented Properties

Redfish is designed to be extremely flexible in implementation which is why so much emphasis is placed upon a self-describing data model (`@odata` meta-data and links to related resources). Part of this flexibility is that properties within a resource may be omitted if not supported by an implementation. For instance, a server that does not implement an indicator LED may completely omit the `IndicatorLED` property in the data model.  Likewise, entire resources and the links to them may vary between implementations. Good client code should handle missing properties and links in whatever way is appropriate for your application.

## Null values for Properties

If you examine the [Redfish schema](http://redfish.dmtf.org/schemas/v1/) documents, you may notice that many properties are allowed to return a JSON null value. As an implementer of the API, returning null is not ideal but because of various relationships between open-architecture server components, the value of a property may not be available at all times. The iLO RESTful API  uses null as a return value when, due to system state, the value is either not yet available or too stale to be of use. Again, good client code should test the value.

## What Version of Redfish does iLO support?

We are often asked the question:  “What version of Redfish does iLO support?” Due to the flexibility of the API, the question is not straightforward to answer. Recall from [part 1](/blog/getting-started-with-ilo-restful-api-redfish-api-conformance) that the “Protocol” is versioned separately from the “Data Model”. iLO 5 implements the latest protocol version 1.3 at the time of writing. However, the individual resources in the data model each implement a specific schema and version. Some resources may report the latest version while some may report older versions. Since the versions are cumulative, if we need to report a newly defined property we will update the version to the schema that defines the new property. However, if we do not need to update a resource, we may choose to leave the versions information unchanged as well. Since schema updates are likely to occur on each iLO firmware update, the best answer is to inspect the API dynamically.

## What is next?

We hope we have given you enough information to get started with the iLO RESTful API and see the benefits of server automation from a single API. As we continue to improve and update our Redfish interface, please refer to our [documentation](https://servermanagementportal.ext.hpe.com/). 