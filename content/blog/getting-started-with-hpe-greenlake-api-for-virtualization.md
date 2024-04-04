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

At the time of this release  (March 2024), the API resource to discover the Cloud Service Provider (CSP) account is not yet available as part of this released virtualization API set for HPE GreenLake. However, you can still obtain the information about the account Id at the CSP’s registration on HPE Private Cloud Business Enterprise’s Cloud account menu using the legacy CSP accounts list API **GET {baseUrl}/api/v1/csp-accounts**. Assuming that your AWS account had been onboarded into either HPE GreenLake Backup Recovery or HPE Private Cloud for Business Enterprise, this account Id will be used as one of the values for the body of this creation of virtual machine API as shown below.

![](/img/list-available-csp-account-response.png "List available CSP accounts (DSCC API v1.4)")

*T﻿he above figure shows the CSP id account that was onboarded into this workspace.*

Another important information, the **imageId** value that is presented below, corresponds to the AWS Linux VM (free tier) that is going to be deployed at the AWS account. I used the following API **GET /virtualization/v1beta1/csp-machine-images** to discover that AWS machine image (AMI) from existing VM that had already been deployed inside the AWS Elastic Cloud Compute (ECS). You can use **GET /virtualization/v1beta1/csp-machine-instances** to get the machine-id required to execute the below API. 

![](/img/obtain-machineid-from-a-machine-instance.png "return imageId from csp-machine-images")

*T﻿he above figure shows the imageId value obtained from existing machine instance.*

The figure below shows of the documentation of HPE GreenLake Virtualization API using a POST method to deploy a virtual machine in your CSP account: **POST /virtualization/v1beta1/csp-machine-instances**. Note that this API requires that you provide a **body** as part of the API invocation. The documentation for this virtualization API in the https://developer.greenlake.hpe.com uses another terminology which is called **Payload**.  It is presented as one of the tabs in the **Request samples** window, as shown below.  This **Payload** contains multiple key-pair values that is specified in the documentation for this API. 

![](/img/documentation-of-the-post-csp-machine-instance-with-required-payload.png "display csp-machine-instances with the required Payload to POST")

*T﻿he above figure shows the documentation on POST /virtualization/v1beta1/csp-machine-instances to deploy a VM inside the cloud service provider.*

You can see in below figure, I performed the deployment of a virtual machine example using Postman, which provides the special field for you to enter the JSON body according to the definition of payload in the developer’s API guide. Please note that I used the raw form of the body with JSON definition as shown below. Combining the information that I gathered above; I entered the values required by the key-pairs part of the body. The key of **keyPairName** is the name for the certificate key-pair required to login into the VM.

![](/img/deployment-of-csp-machine-instance-using-post-and-payload.png "Deploy a machine instance based on the payload POST")

*T﻿he above figure provides example of providing Payload (Body) to provision a VM inside the cloud service provider.*

Using the API **GET async-operations** on the task Id provided from location value in the response header of the above API, I was able to track the completion of the execution of the create virtual-machine in the AWS account. For more information on using the asynchronous-operation API, please look at my [blog](https://developer.hpe.com/blog/getting-started-with-hpe-greenlake-api-for-data-services/) post (Getting Started with GreenLake Data-Services API).

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
    “customerId”: “eb988b5e2dcb11ec840712b3b5263ef4”,
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
    “id”: “5f54e591-a231-46ce-a2e2-bebadb977f93”,
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
    “userId”: “ ronald.dharma@hpe.com”
}
```

*T﻿he above snippet of response code depicted that execution of POST /virtual/v1beta1/machine-instance had completed successfully.*

To progress further, I needed to find the Id that corresponds to the newly created virtual-machine instance in the AWS account using the Create CSP machine instance API. To find the virtual machine Id of the deployed VM, I used a legacy HPE GreenLake Data Services Cloud Console API GET {baseUrl}/api/v1/csp-machine-instances to get the list of virtual-machine-instance that exist in that AWS account. From the response of that API, I obtained the VM instance Id of that Virtual Machine that was created in prior example.  

![](/img/after-deployment-get-the-machine-instance-id.png "obtain the machine instance id")

*T﻿he above figure display the name and the machine-instance id so that you can manipulate the machine's state.*

To control cost, I used the API **POST {baseUrl}/virtualization/v1beta1/csp-machine-instances/{vmId}/power-off** to power off the virtual-machine instance in the AWS account. Lastly, I invoked another API **DEL {baseUrl}/virtualization/v1beta1/csp-machine-instances/{vmId}** to terminate that virtual machine and retire it (delete) from the inventory of EC2.  Just like any invocation of POST API, the invocation of DEL method was asynchronously executed. Hence the same strategy of using the async-operation API applies. Finally, the result of the execution will be returned as part of the response API from async-operation indicated that VM that I had created recently has already been terminated, as shown below.

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
    "customerId": "eb988b5e2dcb11ec840712b3b5263ef4",
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
    "resourceUri": "/data-services/v1beta1/async-operations/de6d9725-7803-4ef5-9cce-f40ad05f879f",
    "rootTask": {
        "id": "de6d9725-7803-4ef5-9cce-f40ad05f879f",
        "name": "",
        "resourceUri": "/data-services/v1beta1/async-operations/de6d9725-7803-4ef5-9cce-f40ad05f879f",
        "type": "task"
    },
    "services": [
        "private-cloud-business-edition"
    ],
    "sourceResource": {
        "name": "RonD-deploy-CSP-1",
        "resourceUri": "/api/v1/csp-machine-instances/d4c46c6e-51ff-59c0-a24a-ef52d77f0b16",
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

### Wow… that was so cool. What about provisioning  a VMware Datastore on-premises?

Here is another example of using the virtualization API to provision a datastore out of an HPE dHCI system that is going to be deployed on-premises.  The API that is used for the datastore provisioning is **POST {baseUrl} /virtualization/v1beta1/datastores**, which also requires a definition of this JSON structure with values in the **body (Payload)**. The information about this JSON body is presented in the documentation below.

![](/img/create-datastore-on-dhci.png)

*T﻿he above figure display the required body (Payload) to deploy datastore into a hyper-converged instance with VMware.*

This virtualization API incorporates the virtual machine provisioning policy that is part of the HPE GreenLake for Private Cloud Business Edition. Use the HPE GreenLake for Private Cloud Business Edition API **GET {baseUrl}/private-cloud-business/v1beta1/vm-provisioning-policies** to obtain the **provisioningPolicyId** and enter it into the Body JSON key-pair values.

![](/img/get-provisioning-policy-for-pcbe-in-dhci.png "get the provisioning policy for deploying datastores in a dHCI using PCBE")

Using another API from the virtualization API such as **GET {baseUrl}/virtualization/v1beta1/hypervisors-clusters** to obtain the **HyperClusterId** is shown below.

![](/img/obtain-the-cluster-id-for-deployment-at-dhci-using-pcbe.png "Obtain the cluster id which is required to deploy a datastore in a dHCI using PCBE")

And using the legacy API such as **GET {baseUrl}/api/v1/storage-systems/device-type2** to obtain the **Storage System Id** is shown below.

![](/img/obtain-the-storage-system-id-using-the-legacy-api.png "legacy API to display the storage system Id")

Finally, all the above values were entered into the JSON body below as part of the Virtualization API to create a datastore in the designated cluster using the attached storage system.

![](/img/create-a-datastore-using-virtualization-api-post-datastores-with-all-required-body.png "Deploy POST to create the datastore in the DHCI using PCBE")

From the response of the API aync-operations for the task Id shown below, I confirmed that creation of the datastore was completed. Note that the creation of datastore also applied the HPE GreenLake Backup Recovery data protection-policy to the newly created datastore. 

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
    "customerId": "eb988b5e2dcb11ec840712b3b5263ef4",
    "displayName": "Provisioning datastore VVOL-ds1",
    "endedAt": "2024-03-29T00:59:22.975723884Z",
    "error": null,
    "estimatedRunningDurationMinutes": 0,
    "generation": 8,
    "groups": [
        {
            "id": "eb988b5e2dcb11ec840712b3b5263ef4",
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
    "resourceUri": "/data-services/v1beta1/async-operations/9825d5e8-5213-433b-8fbf-1945bb4496e1",
    "rootTask": {
        "id": "9825d5e8-5213-433b-8fbf-1945bb4496e1",
        "name": "",
        "resourceUri": "/data-services/v1beta1/async-operations/9825d5e8-5213-433b-8fbf-1945bb4496e1",
        "type": "task"
    },
    "services": [
        "private-cloud-business-edition"
    ],
    "sourceResource": {
        "name": "VVOL-ds2",
        "resourceUri": "/api/v1/datastores/fdcc724f-3f22-5fa6-8477-81f0fd701512",
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

*T﻿he above figure shows the termination of machine-instance in AWS reached 100% progress and completed successfully.*

## Summary

This blog post introduces you to the new set of HPE Greenlake API for data services named virtualization to support resources such as: hypervisor includes VMware (6.7.X, 7.X and 8.X) for on-prem hypervisors, AWS EC2 and Azure for cloud public-provider. This API set will evolve throughout next release in the future. The March 2024 announcement introduces V1Beta1 of the API version. This set of APIs is documented at HPE GreenLake Developer [website ](https://developer.greenlake.hpe.com) and it is available for download as Open API 3.1.X specification in JSON file. 

In this post, I started by introducing the HPE GreenLake virtualization API on the API documentation page. Afterward, I provided a couple of tips on using this Virtualization REST API such as discovery of the on-premises resources and determined the services that were applied against the VMware cluster. In the following, I provided a complete guides to deploy a Virtual Machine inside the Cloud Service Provider (AWS). Lastly, I also introduced an example on how to invoke DEL method of the Virtual Machines at the Cloud to clean up the deployed Virtual Machines on the Cloud Service Provider. As a bonus, I also provided example to deploy datastores in the on-premises VMware infrastructure part of the HPE GreenLake Private Cloud Business Edition. In future blogs, I will provide examples that incorporate HPE GreenLake APIs for virtualization with different sets of APIs from different data services on HPE GreenLake. 

Please don’t hesitate to explore this new set of HPE GreenLake API for virtualization and see how you can improve your agility in managing your data. Any questions on HPE GreenLake API for virtualization? Or do you have any suggestions or cool ideas that you want share with the community? Please [join](https://developer.hpe.com/slack-signup/) the HPE Developer Slack Workspace and start a discussion in our #hpe-greenlak-data-services [slack channel](https://hpedev.slack.com/archives/C02D6H623JP).