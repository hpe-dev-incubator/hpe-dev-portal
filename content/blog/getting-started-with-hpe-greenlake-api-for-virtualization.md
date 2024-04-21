---
title: Getting started with HPE GreenLake API for Virtualization
date: 2024-04-03T21:18:41.183Z
author: Ron Dharma
authorimage: /img/rondbust.jpg
thumbnailimage: /img/alletra-element-small.png
disable: false
tags:
  - api
  - hpe-greenlake
  - data-services-cloud-console
---
<style> li { font-size: 27px; line-height: 33px; max-width: none; } </style>

## What’s New?

Recently, a new set of REST APIs for HPE GreenLake edge-to-cloud platform was introduced on the HPE GreenLake Developer [website](https://developer.greenlake.hpe.com/docs/greenlake/services/virtualization/public/guide/).  These APIs are grouped under the set which is called HPE GreenLake API for Virtualization. Several articles will be written and posted on HPE Developer Community [blog](https://developer.hpe.com/blog/) to help you better understand and work with these APIs in conjunction with the family of APIs for data services on HPE GreenLake.

This the second in a series of blog posts ([data services](https://developer.hpe.com/blogs/getting-started-with-hpe-greenlake-api-for-data-services), [virtualization](https://developer.hpe.com/blogs/getting-started-with-hpe-greenlake-api-for-virtualization), [Backup and Recovery](https://developer.hpe.com/blogs/getting-started-with-hpe-greenlake-api-for-backup-and-recovery)) that will introduce some useful tips and best practices about using this new set of APIs given a specific use case. The purpose of this virtualization API is described from the HPE GreenLake Developer [Guide](https://developer.greenlake.hpe.com/docs/greenlake/services/virtualization/public): “The HPE GreenLake for Virtualization API provides management of virtual machines and other virtual resources in public clouds and on-premises systems.”  

At time of release, this set of APIs' supports for on-premises hypervisor includes VMware (7.X and 8.X) and cloud public provider such as AWS Elastic Cloud Compute and Microsoft Azure virtual machine. The resources that are supported on-premises are *virtual machines, virtual machine images, datastores, VMware clusters (hosts, folders, networks, tags, networks, resource-pool)*. Conversely, the resources that are supported on cloud providers include *virtual machine instance, virtual machine images, and virtual machine instance types*. 

![](/img/virtualization-api-guide-website-and-download.png "The HPE GreenLake API for Virtualization documentation.")

*The above figure shows the HPE GreenLake APIs for Virtualization drop down list, and the link to download the OpenAPI specification in JSON format.*

The specification for this set of APIs is published as an OpenAPI specification in JSON format. The specification of this set of APIs is available for download from this [section](https://developer.greenlake.hpe.com/docs/greenlake/services/virtualization/public/openapi/virtualization-public-v1beta1/overview/) of the documentation (shown below). The specification follows the OpenAPI standard 3.1, which contains all the information required so that this JSON spec-file can be consumed by any OpenAP﻿I tools to generate client library, SDK, server mock, or documentation as described in this OpenAPI [Initiative](https://tools.openapis.org/).  

![](/img/virtualization-openapi-3.1-spec-file.png "HPE GreenLake OAS 3.1 specification for Virtualization download.")

*The above figure shows a sample of the downloaded OpenAPI specification of the HPE GreenLake API for Virtualization.*

## API versioning

This set of APIs is identified as revision V1 Beta 1 at the time of its introduction in March 2024. Moving forward, the APIs will be updated to their next revision as they evolves toward the long-term release version. As each individual API is updated, there will also be more capabilities added to any of the resources identified under the APIs. Furthermore, there will be more resources that are not currently available for this API added in the future. For information about update stages, and deprecation, please follow the HPE GreenLake Developer Portal Versioning [Guide](https://developer.greenlake.hpe.com/docs/greenlake/guides/public/standards/versioning_basics/). 

## What are these virtualization resources?

The following pictures depict some of the resources that are related to the virtualization APIs that can be discovered inside the two cloud data services that are part of HPE GreenLake. The two services which leverage these virtualization APIs are HPE GreenLake for Backup and Recovery (GLBR), and HPE GreenLake for Private Cloud Business Edition (PCBE). Both services leverage the virtualization APIs to discover assets that would need to be onboarded, protected, orchestrated, nurtured, or retired following the CRUD (create, revise, update, delete) principles of REST API. Each object presented in the pictures below are part of the User Interface that can be manipulated using this virtualization APIs.

> **Note:** Not all virtualization API resources that can be seen at HPE GreenLake for Backup and Recovery user interfaces and HPE GreenLake for Private Cloud Business Edition user interfaces, are going to be available inside this set of APIs upon its first release. Due to sharing of the virtualization services between the two services, any virtualization resources that are added into one HPE GreenLake workspace and used by both services can be manipulated by HPE GreenLake APIs for Virtualization using the same instance Id. 

![](/img/onprem-resources-virtualization-api-glbr.png "On-prem resources in GLBR")

*T﻿he above figure shows virtualization APIs resources related to VMware in HPE GreenLake for Backup and Recovery.* 

![](/img/onprem-resources-virtualization-api-pcbe.png "on-prem resources in PCBE")

*T﻿he above figure shows virtualization APIs resources related to VMware in HPE GreenLake for Private Cloud Business Edition.* 

![](/img/cloud-public-resources-inside-the-glbr.png "Cloud resources in GLBR")

*The above figure shows virtualization APIs resources related to Public Cloud Provider in HPE GreenLake for Backup and Recovery.*

## Using the HPE GreenLake APIs for Virtualization

This set of virtualization APIs uses the same authorization and permission as the rest of the family of HPE GreenLake APIs for data services. 

To ensure that all programmatic interaction with the HPE GreenLake platform services and resources is secure and authenticated, these APIs require an access token. The token is generated using the client ID and client Secret you obtained during the creation of the client API credentials. Documentation about getting started with the HPE GreenLake API is provided on the HPE Developer Community [website](https://developer.hpe.com/blog/api-console-for-data-services-cloud-console/), and on the HPE GreenLake Developer portal [website](https://developer.greenlake.hpe.com/docs/greenlake/services/). 

Nevertheless, there is also blog [post](https://developer.hpe.com/blog/learn-what-you-can-do-with-hpe-data-services-cloud-console-api-in-just-3-minutes/) that describes how to use publicly available tools to manipulate this API without a programming language, such as Postman. An additional blog post that describes using Postman for this API is also available at this [link](https://developer.hpe.com/blog/oauth2-for-hpe-greenlake-data-services-cloud-console). Moreover, there will be blog posts available that provide guidance on how to convert this Open API JSON file based on the OpenAPI 3.1 to any scripting language library.

Lastly, anyone can follow the examples provided by each virtualization API referenced in the HPE GreenLake Developer's documentation page, such as shown in the below figure. The documentation provides detail on the API syntax for a particular method, arguments used for the API, successful and failed responses, and several examples using cURL, JavaScript, Python, and Go. The documentation page also provides the ability to execute the API directly on the documentation page as explained in the previous blog [post](https://developer.hpe.com/blog/getting-started-with-hpe-greenlake-api-for-data-services/) (Getting started with HP GreenLake APIs for Data Services ). 

![](/img/get-all-registered-hypervisor-managers-download.png "Get all registered hypervisors managers")

*T﻿he above figure shows three-panel interactive API reference documentation for one of HPE GreenLake API for virtualization.*

## Some tips and examples

Even though there is documentation available in the HPE GreenLake Developer portal, here are some  recommendations and best practices for using the HPE GreenLake API for virtualization.

> ﻿**Note:** All of the below examples assume that you have access to HPE GreenLake workspace. For more information on acquiring an HPE GreenLake workspace, please follow this [guide](https://support.hpe.com/hpesc/public/docDisplay?docLocale=en_US&docId=a00120892en_us).

### Discovery of services for a given hypervisor

The discovery of the on-premises assets in a HPE GreenLake workspace is started by obtaining the access token, and applying it to the virtualization API `GET {baseURL}/virtualization/v1beta1/hypervisor-managers` to discover the hypervisors that are already onboarded into the your workspace.  

Along with the information about the hypervisor, the response of `GET {baseURL}/virtualization/v1beta1/hypervisor-managers` provides additional information such as which HPE GreenLake services are associated with the discovered hypervisor. To discover the information, you can use the `select` parameter with the API to discover properties such as `dataOrchestratorInfo` and `services`. The response values that are returned from this API execution provide the information on what services are associated with the hypervisor and the instance of Data Orchestrator VM that is providing protection against that hypervisor.  

The recommended select parameters to discover the hypervisor and services related to hypervisor is shown below.

```shellsession
GET https://{baseUrl}/virtualization/v1beta1/hypervisor-managers?select=name,id,state,status,dataOrchestratorInfo,services,hypervisorManagerType,releaseVersion
```

The example of the response using the above recommended parameter is shown below. From this response information, I could derive that the hypervisor with its name `cds-tme-vcenter.rtplab.nimblestorage.com` was associated with `backup-and-recovery` service. However, the second hypervisor with its name `rtp-arra392-dhci.rtplab.nimblestorage.com` was associated with both the `hci-manager` and `backup-and-recovery` services. These values gave me an idea that this workspace contained two sets of VMware vCenters, both of which were protected by HPE GreenLake for Backup and Recovery; however, only the second one was part of HPE GreenLake for Private Cloud Business Edition.

```json
{
    "items": [
        {
            "dataOrchestratorInfo": {
                "id": "d36122b2-xxxx-xxxx-xxxx-15d2521926f0",
                "resourceUri": "/backup-recovery/v1beta1/data-orchestrators/d36122b2-xxxx-xxxx-xxxx-15d2521926f0",
                "type": "backup-recovery/data-orchestrator"
            },
            "hypervisorManagerType": "VMWARE_VCENTER",
            "id": "0c9acaa0-xxxx-xxxx-xxxx-eaa239798f6d",
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
                "id": "d36122b2-xxxx-xxxx-xxxx-15d2521926f0",
                "resourceUri": "/backup-recovery/v1beta1/data-orchestrators/d36122b2-xxxx-xxxx-xxxx-15d2521926f0",
                "type": "backup-recovery/data-orchestrator"
            },
            "hypervisorManagerType": "VMWARE_VCENTER",
            "id": "213a7f0d-xxxx-xxxx-xxxx-44e597c32121",
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

*T﻿he above code snippet displays the response from `GET the hyper-managers` API execution*.

### Creation and management of a virtual machine in a cloud service provider (CSP)

The figure below shows the documentation of HPE GreenLake API for virtualization to deploy a virtual machine in your CSP account: `POST /virtualization/v1beta1/csp-machine-instances`. Note that this API requires that user to provide a `request body` as part of the API execution. The [documentation](https://developer.greenlake.hpe.com/docs/greenlake/services/virtualization/public/openapi/virtualization-public-v1beta1/operation/CreateCSPMachineInstance/) for this API at HPE GreenLake Developer website used another terminology which is called `Payload`. It is presented as one of the tabs in the `Request samples` window, as shown in the figure below.  This `Payload` tab provided details of the JSON structure required for the execution of the API `POST /virtualization/v1beta1/csp-machine-instance`. Inside the JSON body structures, I recognized that I need to provide multiple key-pair values such as 

```shellsession
accountId, imageId, instanceType, region, cspType, keyPairName, name
```

![](/img/documentation-of-the-post-csp-machine-instance-with-required-payload.png "display csp-machine-instances with the required Payload to POST")

*T﻿he above figure shows the documentation on `POST /virtualization/v1beta1/csp-machine-instances` to deploy a VM inside the cloud service provider.*

At the time of this release (March 2024), the API resource to discover the HPE GreenLake cloud service provider (CSP) `account id` is not yet available in this released set of HPE GreenLake APIs for Virtualization. To display that id, I used an existing legacy HPE GreenLake API `GET https://{baseUrl}/api/v1/csp-accounts`. My AWS CSP account was already onboarded into HPE GreenLake Private Cloud Business Edition, hence the prior API returned the `accountId` that I need to provide as one of the key-pair object in the JSON request body for the virtualization API `POST /virtualization/v1beta1/csp-machine-instances`.

![](/img/api-of-csp-account-to-obtain-accountid-csptype.png "List available CSP accounts (DSCC API v1.4)")

*T﻿he above figure shows the accountId and the cspType required for the deployment of the virtual machine on the CSP account.*

Another important information to deploy a virtual machine into my CSP account is the `imageId` value. That `imageId` (shown below) corresponded to the `AWS Linux VM (free tier)` which was a machine-image (template of the virtual machine) that is going to be deployed at the AWS account. I used the following virtualization API `GET /virtualization/v1beta1/csp-machine-images` to validate AWS machine image (AMI) from existing  virtual machine that had been deployed inside my CSP account. 

![](/img/api-of-csp-machine-image-based-on-known-aws-machine-id-in-us-east-1.png "return imageId from csp-machine-images")

*T﻿he above figure shows the imageId value obtained from the existing machine instance.*

You can see in the below figure, I performed the deployment of a virtual machine using Postman tool. This tool provided the special field for me to enter the JSON body structure according to the definition of Payload in the developer’s API [guide](https://developer.greenlake.hpe.com/docs/greenlake/services/virtualization/public/openapi/virtualization-public-v1beta1/operation/CreateCSPMachineInstance/). Please note that I used the raw form of the body with JSON structure (shown below). Combining the information that I gathered above, I entered the values required by the JSON structures part of the request body. The key of `keyPairName` was the name for the certificate key-pair created in my CSP account. I chose `RonD-deploy-CSP-1` for the name of the deployed virtual machine. Additionally, I used instanceType of `t2.micro` as the instance that was appropriate for this demo. 

![](/img/post-creation-of-a-virtual-machine-inside-the-csp-account.png "Deploy a machine instance based on the payload POST")

*T﻿he above figure provides the example of creating a Payload (Body) JSON structure to provision a VM inside the cloud service provider.*

Using the API `GET async-operations` on the `task Id` provided from location value in the response header of the above API, I was able to track the completion of the execution of the create virtual-machine in the AWS account. For more information on using the `GET async-operations` API, please take look at my blog [post](https://developer.hpe.com/blog/getting-started-with-hpe-greenlake-api-for-data-services/)  (Getting Started with HPE GreenLake API for Data Services).

```json
{
    “associatedResources”: [],
    “childTasks”: [
        {
            “name”: “Create Instance”,
            “resourceUri”: “/data-services/v1beta1/async-operations/286cc55c-8636-4a8a-8428-0a5694f42785”,
            “type”: “task”
        }
    ],
    “createdAt”: “2024-03-28T01:53:30.395518007Z”,
    “customerId”: “xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx”
    “displayName”: “Create Instance: RonD-deploy-CSP-1”,
    “endedAt”: “2024-03-28T01:54:04.245722969Z”,
    “error”: null,
    “estimatedRunningDurationMinutes”: 0,
    “generation”: 3,
    “groups”: [
        {
            “id”: “eb988b5e2dcb11ec840712b3b5263ef4”,
            “name”: “Default Group”
        }
    ],
    “healthStatus”: “OK”,
    “id”: “5f54e591-xxxx-xxx-xxxx-bebadb977f93”,
    “logMessages”: [
        {
            “message”: “Create Instance: RonD-deploy-CSP-1 task is created”,
            “timestampAt”: “2024-03-28T01:53:30.395526907Z”
        },
        {
            “message”: “Create Instance: RonD-deploy-CSP-1 task is running”,
            “timestampAt”: “2024-03-28T01:53:30.395529707Z”
        },
        {
            “message”: “Create Instance: RonD-deploy-CSP-1 task is succeeded”,
            “timestampAt”: “2024-03-28T01:54:04.245712087Z”
        }
    ],
    “name”: “Create Instance: RonD-deploy-CSP-1”,
    “parentTask”: null,
    “progressPercent”: 100,
    “recommendations”: [],
    “resourceUri”: “/data-services/v1beta1/async-operations/5f54e591-a231-46ce-a2e2-bebadb977f93”,
    “rootTask”: {
        “id”: “5f54e591-a231-46ce-a2e2-bebadb977f93”,
        “name”: “”,
        “resourceUri”: “/data-services/v1beta1/async-operations/5f54e591-a231-46ce-a2e2-bebadb977f93”,
        “type”: “task”
    },
    “services”: [
        “private-cloud-business-edition”
    ],
    “startedAt”: “2024-03-28T01:53:30.395520016Z”,
    “state”: “SUCCEEDED”,
    “subtreeTaskCount”: 1,
    “suggestedPollingIntervalSeconds”: 30,
    “type”: “task”,
    “updatedAt”: “2024-03-28T01:54:04.324786754Z”,
    “userId”: “xxxx.yyyy@abc.com"
}
```

*T﻿he above snippet of the response body depicts that execution of `POST /virtual/v1beta1/machine-instance` that was completed successfully.*

To progress further, I needed to find the id that corresponds to the newly created virtual-machine instance in the AWS CSP account (`csp-machine-instance id`). To find the virtual machine Id of the deployed VM, I used the legacy HPE GreenLake API `GET {baseUrl}/api/v1/csp-machine-instances` to get the list of virtual-machine-instance that exist in that AWS account. From the response of that API, I obtained the VM instance Id of that Virtual Machine that was created in the prior example using `filter:` parameter (shown below).

![](/img/get-csp-machine-instance-id-to-validate-the-body-structure.png "Get information about the VM deployed in the CSP to validate parameters")

*T﻿he above figure displays the name and the csp-machine-instance id so that I could manipulate the machine's state.* 

To control cost, I used the API `POST {baseUrl}/virtualization/v1beta1/csp-machine-instances/:id/power-off` to power off the virtual-machine instance in the AWS account. Lastly, I invoked another API `DEL {baseUrl}/virtualization/v1beta1/csp-machine-instances/:id` to terminate that virtual machine and retire it (delete) from the inventory of my AWS CSP account.  Just like any invocation of `POST API`, the invocation of DEL method was asynchronously executed. Hence, the same strategy of using the `GET async-operations` API would apply. Finally, the result of the execution will be returned as part of the response API from `GET async-operation` indicated that VM that I created recently has already been terminated, as shown below. 

```json
{
    "associatedResources": [],
    "childTasks": [
        {
            "name": "Terminate: RonD-deploy-CSP-1",
            "resourceUri": "/data-services/v1beta1/async-operations/f267be2d-5a04-4f41-a760-c803212840c8",
            "type": "task"
        }
    ],
    "createdAt": "2024-03-27T22:37:20.509665935Z",
    "customerId": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "displayName": "Terminate: RonD-deploy-CSP-1",
    "endedAt": "2024-03-27T22:37:37.652544571Z",
    "error": null,
    "estimatedRunningDurationMinutes": 0,
    "generation": 4,
    "groups": [
        {
            "id": "eb988b5e2dcb11ec840712b3b5263ef4",
            "name": "Default Group"
        }
    ],
    "healthStatus": "OK",
    "id": "de6d9725-7803-4ef5-9cce-f40ad05f879f",
    "logMessages": [
        {
            "message": "Terminate: d4c46c6e-51ff-59c0-a24a-ef52d77f0b16 task is created",
            "timestampAt": "2024-03-27T22:37:20.509674904Z"
        },
        {
            "message": "Terminate: d4c46c6e-51ff-59c0-a24a-ef52d77f0b16 task is running",
            "timestampAt": "2024-03-27T22:37:20.509678268Z"
        },
        {
            "message": "Terminate: RonD-deploy-CSP-1 task is running",
            "timestampAt": "2024-03-27T22:37:20.79512845Z"
        },
        {
            "message": "Terminate: RonD-deploy-CSP-1 task is succeeded",
            "timestampAt": "2024-03-27T22:37:37.652529902Z"
        }
    ],
    "name": "Terminate: RonD-deploy-CSP-1",
    "parentTask": null,
    "progressPercent": 100,
    "recommendations": [],
    "resourceUri": "/data-services/v1beta1/async-operations/de6d9725-xxxx-xxxx-xxxx-f40ad05f879f",
    "rootTask": {
        "id": "de6d9725-7803-4ef5-9cce-f40ad05f879f",
        "name": "",
        "resourceUri": "/data-services/v1beta1/async-operations/de6d9725-xxxx-xxxx-xxxx-f40ad05f879f",
        "type": "task"
    },
    "services": [
        "private-cloud-business-edition"
    ],
    "sourceResource": {
        "name": "RonD-deploy-CSP-1",
        "resourceUri": "/api/v1/csp-machine-instances/d4c46c6e-xxxx-xxxx-xxxx-ef52d77f0b16",
        "type": "AWS Instance"
    },
    "startedAt": "2024-03-27T22:37:20.509668598Z",
    "state": "SUCCEEDED",
    "subtreeTaskCount": 1,
    "suggestedPollingIntervalSeconds": 30,
    "type": "task",
    "updatedAt": "2024-03-27T22:37:37.688700579Z",
    "userId": "ronald.dharma@hpe.com"
}
```

*T﻿he above figure shows the termination of machine-instance in CSP reached 100% progress and completed successfully.*

### Wow… that was so cool. What about provisioning  a VMware datastore on-premises?

Here is another example of using the HPE GreenLake API for virtualization to provision a datastore out of an HPE disaggregated Hyperconverged Infrastructure (dHCI) system for on-premises deployment. The HPE dHCI instance had already been onboarded into the HPE GreenLake for Private Cloud Business Edition service (PCBE).  The [API](https://developer.greenlake.hpe.com/docs/greenlake/services/virtualization/public/openapi/virtualization-public-v1beta1/operation/CreateDS/) that is used for the datastore provisioning is `POST {baseUrl} /virtualization/v1beta1/datastores`, which also required a definition of this JSON structure with values in the `body (Payload)`. The information about this request JSON body is presented in the figure below.

![](/img/create-datastore-on-dhci.png)

*T﻿he above figure displays the required body (Payload) used to deploy datastore into a hyper-converged instance with VMware.* 

This virtualization API incorporated the virtual machine provisioning policy that is part of the HPE GreenLake for Private Cloud Business Edition. I used the HPE GreenLake for Private Cloud Business Edition API `GET /private-cloud-business/v1beta1/vm-provisioning-policies` to obtain the `provisioningPolicyId` and entered it into the Body JSON structure as required.

![obtain the provisioning policy for deploying datastores using HPE PCBE](/img/get-provisioning-policy-for-pcbe-in-dhci.png "get the provisioning policy for deploying datastores in a dHCI using HPE PCBE")

I used another API from the virtualization API such as `GET {baseUrl}/virtualization/v1beta1/hypervisors-clusters` to obtain the `HyperClusterId` (shown below). 

![](/img/obtain-the-cluster-id-for-deployment-at-dhci-using-pcbe.png "Obtain the cluster id which is required to deploy a datastore in a dHCI using PCBE")

Furthermore, I used the legacy API such as `GET /api/v1/storage-systems/device-type2` to obtain the `Storage System Id` (shown below).

![](/img/obtain-the-storage-system-id-using-the-legacy-api.png "legacy API to display the storage system Id")

Finally, I entered all the above values into the JSON body below as part of the virtualization API to create a datastore in the designated VMware cluster using the attached storage system.

![](/img/create-a-datastore-using-virtualization-api-post-datastores-with-all-required-body.png "Deploy POST to create the datastore in the DHCI using PCBE")

From the response of the API `GET aync-operations` for the task Id shown below, I confirmed that creation of the datastore was completed. Note that the creation of the datastore also applied the HPE GreenLake Backup Recovery data protection-policy to the newly created datastore. 

```json
{
    "associatedResources": [],
    "childTasks": [
        {
            "name": "Create datastore: VVOL-ds1",
            "resourceUri": "/data-services/v1beta1/async-operations/ad25f64d-7bd1-439e-ac31-17728e6cdbc6",
            "type": "task"
        }
    ],
    "createdAt": "2024-03-29T00:56:16.981296528Z",
    "customerId": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "displayName": "Provisioning datastore VVOL-ds1",
    "endedAt": "2024-03-29T00:59:22.975723884Z",
    "error": null,
    "estimatedRunningDurationMinutes": 0,
    "generation": 8,
    "groups": [
        {
            "id": "eb988b5exxx11ec8407xxxb5263ef4",
            "name": "Default Group"
        }
    ],
    "healthStatus": "OK",
    "id": "9825d5e8-5213-433b-8fbf-1945bb4496e1",
    "logMessages": [
        {
            "message": "Task created",
            "timestampAt": "2024-03-29T00:56:16.98131301Z"
        },
        {
            "message": "Task is running",
            "timestampAt": "2024-03-29T00:56:16.981315803Z"
        },
        {
            "message": "Preparing parameters",
            "timestampAt": "2024-03-29T00:56:18.622573215Z"
        },
        {
            "message": "Creating datastore",
            "timestampAt": "2024-03-29T00:56:19.797636611Z"
        },
        {
            "message": "Validating datastore",
            "timestampAt": "2024-03-29T00:56:36.120087916Z"
        },
        {
            "message": "Applying protection policy",
            "timestampAt": "2024-03-29T00:57:36.332756275Z"
        },
        {
            "message": "Task succeeded",
            "timestampAt": "2024-03-29T00:59:22.975739714Z"
        }
    ],
    "name": "Provisioning datastore VVOL-ds1",
    "parentTask": null,
    "progressPercent": 100,
    "recommendations": [],
    "resourceUri": "/data-services/v1beta1/async-operations/9825d5e8-xxx-xxx-xxx-1945bb4496e1",
    "rootTask": {
        "id": "9825d5e8-5213-433b-8fbf-1945bb4496e1",
        "name": "",
        "resourceUri": "/data-services/v1beta1/async-operations/9825d5e8-xxx-xxx-xxx-1945bb4496e1",
        "type": "task"
    },
    "services": [
        "private-cloud-business-edition"
    ],
    "sourceResource": {
        "name": "VVOL-ds2",
        "resourceUri": "/api/v1/datastores/fdcc724f-xxxx-xxx-xxx-81f0fd701512",
        "type": "Datastore"
    },
    "startedAt": "2024-03-29T00:56:16.981298562Z",
    "state": "SUCCEEDED",
    "subtreeTaskCount": 2,
    "suggestedPollingIntervalSeconds": 30,
    "type": "task",
    "updatedAt": "2024-03-29T00:59:23.013384523Z",
    "userId": "ronald.dharma@hpe.com"
}
```

*T﻿he above figure shows that API `POST {baseURL)/virtualization/v1beta1/datastores` executed succesfully.*

## Summary

This blog post introduces you to the new set of HPE GreenLake APIs for Virtualization, which is part of data services family APIs for HPE GreenLake. This is the set of APIs to support resources from an on-premises hypervisor, that includes VMware (6.7.X, 7.X and 8.X), as well as for cloud-public-providers such as AWS Elastic Cloud Compute and Microsoft Azure Virtual Machines. This set of APIs will evolve through future releases. The March 2024 announcement introduces version V1 Beta 1 of this set of APIs . This set of APIs is documented at HPE GreenLake Developer [website](https://developer.greenlake.hpe.com) and it is available for download as Open API 3.1 specification in JSON file.

In this post, I started by introducing the HPE GreenLake virtualization API on the API documentation page. Afterward, I provided a couple of tips on using this virtualization REST API such as to discover the on-premises hypervisor resources and to determine the services that were applied against the discovered hypervisor's cluster. Next, I provided a complete guides to deploy a virtual machine inside the cloud service provider (AWS). Lastly, I also introduced an example on how to invoke the DEL method of the virtual machines at the cloud to clean up the deployed virtual machines on the cloud service provider. As a bonus, I also provided an example to deploy datastores in the on-premises VMware infrastructure part of the HPE GreenLake Private Cloud Business Edition. In future blogs, I will provide examples that incorporate HPE GreenLake APIs for virtualization with the family of APIs from different data services on HPE GreenLake.

Please don’t hesitate to explore this new set of HPE GreenLake APIs for virtualization and see how you can improve your agility in managing your data. Any questions on HPE GreenLake APIs for virtualization? Or do you have any suggestions or cool ideas that you want share with the community? Please [join](https://developer.hpe.com/slack-signup/) the HPE Developer Slack Workspace and start a discussion in our #hpe-greenlake-data-services slack [channel](https://hpedev.slack.com/archives/C02D6H623JP).