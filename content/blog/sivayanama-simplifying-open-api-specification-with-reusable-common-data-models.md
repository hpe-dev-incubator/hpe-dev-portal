---
title: Simplifying OpenAPI specification with reusable common data models
date: 2023-08-26T08:06:19.141Z
author: BalaSubramanian Vetrivel
authorimage: /img/vetrivel-balasubramanian1-photo.jpg
disable: false
tags:
  - API
  - OpenAPI
  - OpenAPI specification
  - OpsRamp
  - Yaml
---
The [OpenAPI specification](https://www.openapis.org) (OAS)  is one of the most widely followed API contracts. It is language-agonistic.
With the help of the information found in the OpenAPI specification, clients can better understand APIs and how to invoke them without having access to the code or worrying about the implementation details. 

At times, this open specification file can be too complex to manage and understand. In this article, I will discuss the techniques to simplify the open specification with loosely coupled reusable data models.

## Items found in the OpenAPI Specification
OpenAPI specifications files have many definitions in them. However, the below list of entities are typically bigger in terms of the number of lines and tend to be reused in the specification file.

- schemas
- pathitems
- parameters
- requestBodies
- responses
- headers
- examples
- linkscallbacks

I will discuss four approaches to deal with these definitions.

## Inline definition
With inline definition, the definition is inline right at the reference point, as shown below:

```yaml
schema:
  type: object
  properties:
    id:
      type: string
    name:
      type: string
```

## Inline inside components object
The components object in the OpenAPI specification is the home of reusable object definitions. However, these defined objects must be explicitly referred to outside of the components section wherever required.

```yaml
components:
  parameters:
    tenantId:
      in: path
      name: tenantId
      schema:
        type: string
      required: true
      description: Describes the clientId or mspId of tenant
```

*$ref* is one of the fixed fields in the schema. It is a string value that refers to other components in the OpenAPI document, internally and externally. The above defined *tenantId* parameter can be referred to below: 


```yaml
$ref: '#/components/parameters/tenantId’
```

## Externalized definition
Data models can be defined outside of the OpenAPI specification file using a $ref reference to an external definition. For example:

```yaml
example-multiple-threshold-type-example-request:
   $ref: ./models/opsramp-monitoring-management/multiple-threshold-type-example-request-v1.yaml
```
### Content of multiple-threshold-type-example-request-v1.yaml
Please note that the request object definition should be defined within the *value:* as shown below:

```yaml
value:
  id: 1ecf993f-9b54-4ce3-9581-c365188f7e58
  name: OpsRamp Gateway Performance Template
  description: Monitors basic UNIX parameters like UNIXCPU, UNIXSTORAGE, UNIXUPTIME,
    UNIXMEMORY, UNIXLOAD and UNIXStats
  resourceType: DEVICE
  collectorType: OpsRamp Gateway
  status:
    state: ACTIVE
  generation: 2
  tags: Performance Monitors
  createdDate: '2022-10-09T15:03:44+0000'
  updatedDate: '2022-10-09T15:23:40+0000'
  scope: Client
  templateFamily: Performance Monitors Family
  notes: Sample notes related to performance monitors
```

## Externalized definition with local aliases 
The above externalized definition can be further improved by defining local aliases. The local aliases can be used instead of repeating the relative path of the definition in all references. In the example shown below, the external definition referenced with the $ref can be referred by *#components/parameters/tenanId*:

```yaml
components:
  parameters:
    tenantId:
      $ref: ./models/opsramp-monitoring-management/tenantId-v1.yaml
      # this can be referred by #components/parameters/tenantId
```

## Advantages of externalized definitions 
Externalized definitions have many advantages over traditional inline definitions, such as:

- Loosely coupled data models, and definitions from the OpenAPI Specification
- Reusable data models with common definitions
- This will reduce the OpenAPI specification files significantly
- Easy to manage and govern OpenAPI specification files
   

## Conclusion
In this article, I explained four techniques used to simplify the OpenAPI Specification using loosely coupled, reusable data model definitions and pointed out the advantages of these approaches. Check back for more articles on this and other subjects on the HPE Developer [blog](https://developer.hpe.com/blog).