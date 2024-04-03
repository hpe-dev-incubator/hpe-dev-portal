---
title: Getting started with HPE GreenLake API for Virtualization
date: 2024-04-03T21:18:41.183Z
author: Ron Dharma
authorimage: /img/rondbust.jpg
thumbnailimage: /img/alletra-element-small.png
disable: false
---
## What’s New?

Recently, a new set of REST APIs for HPE GreenLake edge-to-cloud platform was introduced on the HPE GreenLake Developer [website](https://developer.greenlake.hpe.com/docs/greenlake/services/virtualization/public/guide/).  These APIs are grouped under the set which is called HPE GreenLake API for Virtualization. Several articles will be written and posted on HPE Developer’s forum blog site to help you better understand and work with these APIs in conjunction with the family of data services on HPE GreenLake

This the 2nd blog post from the series of blog postings (Data-Services,  Backup and Recovery , and Private Cloud Business Edition ) that will introduce some useful tips and best practices about using this new set of APIs given a specific use case. The purpose of the Virtualization API is described from the Developer Guide: “The HPE GreenLake for Virtualization API provides management of virtual machines and other virtual resources in public clouds and on-premises systems.”  At time of release, this set of APIs supports for hypervisor includes VMware (7.X and 8.X) for on-prem hypervisors; additionally, AWS EC2 and Azure for cloud public-provider. The resources that are supported on-premises are *virtual machines, virtual machine images, datastores, VMware clusters (hosts, folders, networks, tags, networks, resource-pool)*. Conversely, the resources that are supported on cloud providers are *virtual machine instance, virtual machine images, and virtual machine instance types*. 

The specification for this set of APIs is publicized as OpenAPI specification in JSON format, and the specification is available for download from [this section](https://developer.greenlake.hpe.com/docs/greenlake/services/virtualization/public/openapi/virtualization-public-v1beta1/overview/) of the documentation as shown below. The specification follows the OpenAI standard 3.1.X which contains all information required so that this JSON spec-file can be consumed by any OpenApi tools to generate client library, SDK, server mock, or documentation as described in this [OpenAPI Initiative](https://tools.openapis.org/).

![](/img/virtualization-api-guide-website-and-download.png "HPE GreenLake API for Virtualization documentation.")

*The above figure shows HPE GreenLake API for  Virtualization's  drop down list, and the link to download the openAPI specification in JSON format.*

![](/img/virtualization-openapi-3.1-spec-file.png "HPE GreenLake OAS 3.1 specification for Virtualization download.")

*The above figure shows a sample of the downloaded OpenAPI specification of the HPE GreenLake virtualization API.*

## API versioning

This set of APIs is identified as revision V1Beta1 at the time of its introduction in March 2024. Moving forward, the APIs will be updated to it’s next revision as they evolves toward the long-term release version. As each individual API is updated, there will also be more capabilities added to any of the resources identified under the APIs. Furthermore, there will be more resources that are not currently available for this API, added in the future. For information about update stages, and deprecation, please follow the HPE GreenLake Developer Portal [Versioning Guide](https://developer.greenlake.hpe.com/docs/greenlake/guides/public/standards/versioning_basics/).

## What are these virtualization resources?

The following pictures depict some of the resources that are related to the virtualization APIs that can be discovered inside the two cloud data services that are part of the HPE GreenLake. The two services which leverage these APIs are HPE GreenLake for Backup and Recovery (GLBR), and HPE GreenLake for Private Cloud Business Edition (PCBE). Both services leverage the APIs to discover assets that would need to be onboarded, protected, orchestrated, nurtured, or retired following the CRUD principle of the REST API. Each object presented in the pictures below are part of the User Interface that can be manipulated using the APIs.

**Note:** Not all virtualization API resources at HPE GreenLake for Backup and Recovery and HPE GreenLake for Private Cloud Business Edition available in the user interface are going to be available inside this set of APIs upon its first release. Due to sharing of the virtualization services between the two services, any virtualization resources that are added into one HPE GreenLake workspace used by both services can be manipulated GreenLake API for virtualization using the same instance Id.

![](/img/resources-correspond-to-virtualization-api-in-glbr.png "On-prem resources in GLBR")

*T﻿he above figure shows virtualization resources related to VMware in HPE GreenLake for Backup and Recovery.*

![](/img/virtualization-api-in-pcbe.png "on-prem resources in PCBE")

*T﻿he above figure shows virtualization resources related to VMware in HPE GreenLake for Private Cloud Business Edition.*

![](/img/cloud-resources-for-aws-in-backup-and-recovery.png "Cloud resources in GLBR")

*The above figure shows virtualization resources related to Public Cloud Provider in HPE GreenLake for Backup and Recovery*

## Using the Virtualization APIs

This set of virtualization APIs uses the same authorization and permission as the rest of the family of HPE GreenLake API for data services. To ensure that all programmatic interaction with the HPE GreenLake platform services and resources is secure and authenticated, these APIs require an access token. The token is generated using the client ID and client Secret you obtained during the creation of the client API credentials. Documentation about getting started with the HPE GreenLake API is provided on the HPE Developer Community [website](https://developer.hpe.com/blog/oauth2-for-hpe-greenlake-data-services-cloud-console/), and on the HPE GreenLake Developer portal [website](https://developer.hpe.com/blog/oauth2-for-hpe-greenlake-data-services-cloud-console/). Nevertheless, there is also blog’s [posts ](https://developer.hpe.com/blog/learn-what-you-can-do-with-hpe-data-services-cloud-console-api-in-just-3-minutes/)that describes how to use publicly available tools to manipulate this API without a programming language, such as Postman. An additional blog post that describes using Postman for this API is also available in this link. Moreover, there will be blog posts available that provide guidance on how to convert this Open API  based on the OAS 3.1 to any scripting language library in the future.  Lastly, anyone can follow the examples provided by each API referenced in the documentation page, such as that which is shown on below figure. The documentation provides detail on the API syntax for a particular method, arguments used for the API, successful and failed responses, and several examples using cURL, JavaScript, Python, and Go. The documentation page also provides the ability to execute the API directly on the documentation page as explained in the previous [blog post](https://developer.hpe.com/blog/getting-started-with-hpe-greenlake-api-for-data-services/) (Getting started with HP GreenLake Data Services API).

![](/img/get-all-registered-hypervisor-managers-download.png "Get all registered hypervisors managers")

*T﻿he above figure shows three panel's interactive API reference documentation for one of HPE GreenLake API for virtualization request.*

## Some tips and examples

Even though there is documentation available in the HPE GreenLake Developer portal, here are some  recommendations and best practices for using the Virtualization API.

### Discovery of services for a given hypervisor

The discovery of the on-premises assets in a HPE GreenLake workspace is started by obtaining the access token, and apply it to the virtualization API **GET {baseURL}/virtualization/v1beta1/hypervisor-managers** to discover the hypervisors that are already onboarded into the your workspace. Along with the information about the hypervisor, the response of **GET {baseURL}/virtualization/v1beta1/hypervisor-managers**, provides additional information such as which HPE GreenLake services associated with the discovered hypervisor. To discover the information, you can use the **select** parameter with the API to discover information such as **dataOrchestratorInfo** and **services**. The values that are returned from this API execution provide the information on what service is associated with the hypervisor and the instance of Data Orchestrator VM that is providing protection against that hypervisor. 


The recommended select parameters to discover the hypervisor and services related to hypervisor is shown below.


```shellsession
{baseUrl}/virtualization/v1beta1/hypervisor-managers?select=name,id,state,status,dataOrchestratorInfo,services,hypervisorManagerType,releaseVersion
```


The example of the response using the above recommended parameter is shown below. From this response information, I can derive that hypervisor with name “**cds-tme-vcenter.rtplab.nimblestorage.com**” contains only “**backup-and-recovery**” services. However, the second hypervisor with name “**rtp-arra392-dhci.rtplab.nimblestorage.com**” contains both the “**hci-manager**” and “**backup-and-recovery**”. These give me an idea that this workspace contains two VMware vCenters, both of which are protected by HPE GreenLake for Backup-and-Recovery; however, only the second one is part of HPE GreenLake for Private Cloud Business Edition, which is built from HPE hyper-converged setup

```
{
    "items": [
        {
            "dataOrchestratorInfo": {
                "id": "d36122b2-ab2d-4474-ba97-15d2521926f0",
                "resourceUri": "/backup-recovery/v1beta1/data-orchestrators/d36122b2-ab2d-4474-ba97-15d2521926f0",
                "type": "backup-recovery/data-orchestrator"
            },
            "hypervisorManagerType": "VMWARE_VCENTER",
            "id": "0c9acaa0-fe6e-4037-bc43-eaa239798f6d",
            "name": "cds-tme-vcenter.rtplab.nimblestorage.com",
            "releaseVersion": "7.0.3",
            "services": [
                "backup-and-recovery”
            ],
            "state": "OK",
            "status": "OK"
        },
        {
            "dataOrchestratorInfo": {
                "id": "d36122b2-ab2d-4474-ba97-15d2521926f0",
                "resourceUri": "/backup-recovery/v1beta1/data-orchestrators/d36122b2-ab2d-4474-ba97-15d2521926f0",
                "type": "backup-recovery/data-orchestrator"
            },
            "hypervisorManagerType": "VMWARE_VCENTER",
            "id": "213a7f0d-1d97-4aac-9989-44e597c32121",
            "name": "rtp-array392-dhci.rtplab.nimblestorage.com",
            "releaseVersion": "7.0.3",
            "services": [
                "hci-manager",
                "backup-and-recovery"
            ],
            "state": "OK",
            "status": "OK"
        }
    ],
    "count": 2,
    "offset": 0,
    "total": 2
}
```

*T﻿he above code snippet display the response from hyper-managers API execution*.

### Creation and management of a virtual machine in a cloud service provider (AWS)
At the time of this release  (March 2024), the API resource to discover the Cloud Service Provider (CSP) account is not yet available as part of this released virtualization API set for HPE GreenLake. However, you can still obtain the information about the account Id at the CSP’s registration on HPE Private Cloud Business Enterprise’s Cloud account menu using the legacy CSP accounts list API GET {baseUrl}/api/v1/csp-accounts. Assuming that your AWS account had been onboarded into either HPE GreenLake Backup Recovery or HPE Private Cloud for Business Enterprise, this account Id will be used as one of the values for the body of this creation of virtual machine API as shown below.