---
title: "Getting started with iLO RESTful API- Redfish® API Conformance "
date: 2021-07-20T18:09:08.553Z
featuredBlog: false
priority: null
author: Mike Garrett – Architect iLO RESTful API
authorimage: /img/blogs/Avatar3.svg
thumbnailimage: null
tags:
  - ilo-restful-api
  - redfish
---
### Updated July 25, 2023

# **A primer for coders**

## Introduction

With the introduction of iLO 4 2.00 on ProLiant Gen9 servers, we introduced our next generation programmatic interface for server management. HPE iLO has a rich history of remote management capabilities including IPMI, SNMP and the XML scripting language used with HPQONCFG. The need for a new API was so obvious to us that we also began an effort with the DMTF to create a standard around it, which eventually emerged in August 2015 as the “Redfish API”. The fundamental features of the API were quickly agreed upon by the participants, but as always happens in standards bodies, what emerged had some details changed.  The iLO 2.30 release in September 2015 was the beginning of convergence with the Redfish standard. The release included Redfish properties (including the newly introduced `@odata` meta-properties) as well as the compatible pre-Redfish data model. As we move forward with our HPE Gen10 Servers, iLO 4 and iLO 5 will follow Redfish mode and we encourage our customers to code to the Redfish standard and move away from any pre-Redfish implementation. If you are just now beginning to look at leveraging the Redfish API, you should make sure your client code is interacting with iLO using Redfish API standards:

- Read the [Redfish specification](http://www.dmtf.org/standards/redfish). Make sure your assumptions about service URIs, including the starting URI, do not exceed the specification’s guarantees.

- Include the HTTP header `"OData-Version": "4.0"' in all HTTP requests. This causes iLO 4 2.30 to hide pre-Redfish properties, decreasing your chance of inadvertently creating a dependency on something that will be removed in the future.

- For iLO 5, we updated the HPE branding on the OEM extension properties, so some updates might be needed from your iLO 4 scripts if you have already integrated with the API. For detailed information of the differences between iLO 4 and iLO 5 visit our [documentation](https://servermanagementportal.ext.hpe.com/docs/redfishservices/ilos/ilo5/ilo5_adaptation/).

Differences between HPE iLO 5 and iLO 6 are also listed in the [documentation](https://servermanagementportal.ext.hpe.com/docs/redfishservices/ilos/ilo6/ilo6_adaptation/)

## Redfish Versioning

Redfish and its release process is designed to allow the data model to develop quickly as needed by the industry while limiting protocol and specification changes to very infrequent updates.  Data model and protocol are both versioned independently and move at their own pace. The goal of the design is to ensure the data model can be adapted easily to future implementations, as new technologies need to be represented, without having to revise the specification repeatedly. This is one reason you do not find many specified URIs in the specification.

## Redfish URIs – Writing Durable Client Code

Keeping with the vision of infrequent specification and protocol updates, the API is designed with a self-describing data model with each resource containing its own type and version information and links to other resources. Redfish is a "hypermedia API" by design which means that the navigation of the data model is built into the data itself rather than defined by specification. Instead of a published list of resource URIs, a client discovers the data model dynamically by following links between resources. This is to avoid building in restrictive assumptions to the data model that will make it difficult to adapt to future hardware implementations.

A URI should be treated by the client as opaque. A client should not attempt to deconstruct URIs into a template pattern. It is entirely legitimate that a resource at `/redfish/v1/systems/1` could contain a link to `/arbitrary/stuff`. Only specific top level URIs documented in the specification may be assumed, and even these may be absent based upon the implementation. The other URIs must be discovered dynamically by following `@odata.id` links contained in the data model, which point to other resources.

For example, iLO on an HPE ProLiant DL360 server has one compute node, and we happen to give the resource that describes that compute node the URI `/redfish/v1/systems/1/` but there are implementations in the industry, and even the demonstration mockups, that use alternate paths including things like system serial number as the “leaf” of the URI (e.g. `/redfish/v1/systems/`). If you assume too much about the URIs you will discover that your client code is not portable across various implementations of Redfish.

## Traversing the Resource Model

Because objects link together, there are some best practices you should be aware of as you create new client code. If you create a generic “crawler” app that simply GETs every resource and follows its links, your crawl will never terminate because the various object interlinks mean that the data model is not strictly a tree, but a graph.  A generic crawler must keep track of visited URIs and not re-crawl them.  Additionally, as best practice you should treat the visited resource URIs set as case insensitive (iLO does). Most use cases are not generic crawls so this won’t be an issue. Typically you know what you want to find in the data model and you should make sure you correctly find and iterate the collections needed to get to the specific resource you are interested in. To explore a data model demo visit our [iLO RESTful API Demo](https://ilorestfulapiexplorer.ext.hpe.com/).

## Interoperability

The good news is that our internal tools at HPE required very little tweaking to work correctly on another industry implementation of Redfish. If you read the specification and understand the principles behind the design choices you have a very good chance of writing durable client code that is widely interoperable.

HPE Developers have additional resources that can help you understand and integrate more effectively with the iLO RESTful API. To get the latest libraries and sample code available visit the [iLO RESTful API](https://developer.hpe.com/platform/ilo-restful-api/home/) platform page.
