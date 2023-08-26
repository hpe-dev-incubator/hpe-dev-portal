---
title: Sivayanama Simplifying open API specification with reusable common data models
date: 2023-08-26T08:06:19.141Z
author: BalaSubramanian Vetrivel
authorimage: /img/Avatar1.svg
disable: false
---
The open API specification is one of the most widely followed API contracts. It is language-agonistic.
With the help of these Open API specifications, clients can understand the API and invoke them without having access to the code or worrying about the implementation details. At times, this open specification file is becoming too complex to manage and understand. In this article, I will discuss the techniques to simplify the open specification with loosely coupled reusable data models.
## Items of open API specification
Open API specifications files have many definitions in them. However, the below List of entities is typically bigger in terms of the number of lines and tends to be reused
- schemas
- pathitems
- parameters
- requestBodies
- responses
- headers
- examples
- linkscallbacks
I will discuss four approaches to deal with these definitions.
## In line definition
The definition is inline right at the reference point as shown below.
```yaml
schema:
  type: object
  properties:
    id:
      type: string
    name:
      type: string
```
## In line inside components object
Components object in the Open API specification is the home of reusable object definitions. However, these defined objects must be explicitly referred to outside of the components section wherever required.
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
```yaml
$ref: '#/components/parameters/tenantId’
```
## Externalized definition
Data models can be defined outside of the Open API specification file.
```yaml
example-multiple-threshold-type-example-request:
   $ref: ./models/opsramp-monitoring-management/multiple-threshold-type-example-request-v1.yaml
```
### Content of multiple-threshold-type-example-request-v1.yaml
Please note that the request object definition should be defined within the *value:* as shown below.
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
The above externalized definition can be further improved by defining local aliases. The local aliases can be used instead of the relative path of the definition. The example is shown below.
```yaml
components:
  parameters:
    tenantId:
      $ref: ./models/opsramp-monitoring-management/tenantId-v1.yaml
      # this can be referred by #components/parameters/tenantId
```
## Advantages of externalised definitions 
- Externalized definitions have many advantages over traditional inline definitions. Here are a few 
- Loosely coupling data models, and definitions from Open API Specification.
- Data models can be reused with common definitions.
- This will reduce the Open API specification files significantly.
- Easy to manage and govern open API specification files.
   
## Conclusion
In this article, I have explained the four techniques to simplify the Open API specification using loosely coupled, reusable data model definitions. I have also explained the advantages of these approaches. 





