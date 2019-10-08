---
title: HPE OneSphere - Deep dive on Azure support
date: 2018-06-25T06:14:01.618Z
author: gowri.m@hpe.com, prabhu.m4@hpe.com 
tags: []
path: hpe-onesphere-deep-dive-on-azure-support
---
# HPE OneSphere-Deep dive on Microsoft Azure support## Introduction

#### HPE OneSphere is a multi-cloud management platform delivered as a managed service. It provides a unified experience across Hybrid clouds (public & private) and software-defined infrastructure all through a single management console.

#### HPE OneSphere recently added the support for Microsoft Azure Enterprise Account(EA) and its Subscriptions

#### This blog details the deep dive on Microsoft Azure support in HPE OneSphere which includes the Azure Enterprise Account(EA) onboarding, Monitoring and costing. This includes the UI flow as well as the APIs used for Microsoft Azure support in OneSphere.
## Azure Onboarding flow #### This section explains on how the Azure billing account and the subscription account gets onboarded in HPE OneSphere. For the first release, HPE supports Azure Enterprise Agreement(EA) as the billing account and Azure Subscriptions as the provider account.

### Follow these steps for Azure onboarding:

** A.**  Onboard  Azure Enterprise Account(EA) account as the billing account.

** B.**  Create a project in HPE OneSphere.

** C.**  Add the Azure provider account in 'Add Public Account' option in the created project.

** D.**  While onboarding, provide the username and password of the account .

**E.**  Agree to the consent form.

** F.**  Select the subscription to be onboarded.

#### Below figure shows the Addition of Azure billing account from OneSphere. This will be achieved by clicking on Settings from OneSphere user Interface and selecting Public Billing Accounts. Provide Name, Active Directory Name, Enrollment Account Number and Enterprise Admin Key.

![azure_billing1](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/7/azure_billing1-1533012455985.png)

#### Below rest API explains the onboarding  of Azure billing account from OneSphere.  Values for the following fields needs to be provided for the rest API:  Customer-name, directoryUri, enrollmentNumber, apiAccessKey and name### Request URL :
```
curl -v -L -X POST -H "Authorization: Bearer <token>" -H "Content-Type: application/json"  https://<customer-name>/rest/billing-accounts -d {"directoryUri":"hpe.onmicrosoft.com","enrollmentNumber":"5053985","apiAccessKey":"*******","name":"EA","providerTypeUri":"/rest/provider-types/azure"}
```### Response :

```
{
  "id": "aff5c513-e666-4826-9919-68918414faa4",
  "name": "EA",
  "uri": "/rest/billing-accounts/aff5c513-e666-4826-9919-68918414faa4",
  "status": "OK",
  "state": "ENABLED",
  "providerTypeUri": "/rest/provider-types/azure",
  "enrollmentNumber": "5053985",
  "directoryUri": "hpe.onmicrosoft.com",
  "created": "2018-07-31T15:18:29.358147018Z",
  "modified": "2018-07-31T15:18:29.358147018Z"
}
```#### Below, the figure shows the creation of projects and how to associate public account to it. From HPE OneSphere, one needs to click on Projects and select '+' sign for creating project. Once the project is created, click on Project name and select 'Add Public Accounts' option. In that, select 'Microsoft Azure' and select the 'Azure billing account' and 'Azure Directory URI' where subscriptions are associated.

![azure_provider1](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/7/azure_provider1-1533015040242.png)

#### Below, the figure shows the consent form to allow the HPE OneSphere app to use the Azure data. Once you click on Accept, it will take you to the subscription selection page.

![azure_provider2](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/7/azure_provider2-1533015059201.png)

#### The below figure shows the Select subscription screen where all the Azure subscription are listed. The user has to select the appropriate subscriptions

![azure_provider3](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/7/azure_provider3-1533015113947.png)

#### Below, the rest API call is used to get the list of subscriptions that are available for the account admin who is logged in.### Request URL :
```
curl -v -L -X GET -H "Authorization: Bearer <token>" -H "Content-Type: application/json" https://<customer-name>/rest/onboarding/azure/subscriptions/71ff6703-72d9-412f-9591-c8acd9fb5dbf?directoryUri=1sqe.onmicrosoft.com&location=https%3A%2F%2Fteam-tiger1.test.hpedevops.net%2Fproject%2Fsubscriptions%3Fcode%3DAQABAAIAAADX8GCi6Js6SK82TsD2Pb7rb9ruNBNFsX1_curhHyaTMTJVayB-LRLAJ40x1n2zmJvJmOpnBV7ZeyP3OQ2nk6EJPU1R6OrcU4M6mYgLfzIc2f--mXGDIzCyWMt7SKEPO5L5q8EtxLxWYD0Cxnd1J7JfBNb1liwgirMro08_IlF_zOk6J4keQb89zv030_FDcDQbcqqxNheIDLNu-xEze7rPuTxo198VX6rmmEjE_s9eU1PFGYvnihq3AUqDE3EkAPAjb-mwvfYXUu0LXx1kH05m59Q6dZ9yoVwAM1tMhreGccdB8_uBzY3I768LtSplnLQSlxIdKtgEN0iciTxEF67j7akUfpRyM260BIbteGyKljsO-IyYOo7kaE7VGo4bQXZowDqAv5XrSp-6qUtv4Gl20w5b1q2rgT_u7X961x9kRFnULvPxSS4IO06eEtKjSqWGxssLWtk0SWACrJxOFHfYshve86-NXLlOtwUaecNxYFDB6vTNmZ7VO5HeV_9b-xT2iQ66p4MDRFwGWXj8m0Tvxx6wT07FkaFqjzVLkZkPkSB6vCxevViH9noJ2wLYYF6L2KmL9n5nsXw5BELpYlkT6M91ZTX95uzKwjNB9iZsiyAA%26state%3D%257b%2522projectUri%2522%253a%2522%252frest%252fprojects%252fd0123c1d19274371b5c6d6edc24b74d2%2522%252c%2522billingAccountUri%2522%253a%2522%252frest%252fbilling-accounts%252f81ce737f-31fd-47a1-8414-839e415e9896%2522%252c%2522directoryUri%2522%253a%25221sqe.onmicrosoft.com%2522%257d%26session_state%3Df65f2fb0-32d7-49f8-9332-3e439eec480b
```### Response :
```
{
  "members": [
    {
      "id": "71ff6703-72d9-412f-9591-c8acd9fb5dbf",
      "name": "Microsoft Azure Enterprise-Sai",
      "roles": [
        "Reader"
      ],
      "canAdd": true,
      "uri": "/rest/onboarding/azure/subscriptions/71ff6703-72d9-412f-9591-c8acd9fb5dbf"
    }
  ],
  "total": 1,
  "start": 0,
  "count": 1
}
```#### Below, the rest API call is used to assign reader role for the HPE OneSphere application in the selected subscription from the previous step.### Request URL :
```
curl -v -L -X PUT -H "Authorization: Bearer <token>" -H "Content-Type: application/json-patch+json" 
https://<customer-name>/rest/onboarding/azure/subscriptions/71ff6703-72d9-412f-9591-c8acd9fb5dbf?directoryUri=1sqe.onmicrosoft.com&location=https%3A%2F%2Fteam-tiger1.test.hpedevops.net%2Fproject%2Fsubscriptions%3Fcode%3DAQABAAIAAADX8GCi6Js6SK82TsD2Pb7rb9ruNBNFsX1_curhHyaTMTJVayB-LRLAJ40x1n2zmJvJmOpnBV7ZeyP3OQ2nk6EJPU1R6OrcU4M6mYgLfzIc2f--mXGDIzCyWMt7SKEPO5L5q8EtxLxWYD0Cxnd1J7JfBNb1liwgirMro08_IlF_zOk6J4keQb89zv030_FDcDQbcqqxNheIDLNu-xEze7rPuTxo198VX6rmmEjE_s9eU1PFGYvnihq3AUqDE3EkAPAjb-mwvfYXUu0LXx1kH05m59Q6dZ9yoVwAM1tMhreGccdB8_uBzY3I768LtSplnLQSlxIdKtgEN0iciTxEF67j7akUfpRyM260BIbteGyKljsO-IyYOo7kaE7VGo4bQXZowDqAv5XrSp-6qUtv4Gl20w5b1q2rgT_u7X961x9kRFnULvPxSS4IO06eEtKjSqWGxssLWtk0SWACrJxOFHfYshve86-NXLlOtwUaecNxYFDB6vTNmZ7VO5HeV_9b-xT2iQ66p4MDRFwGWXj8m0Tvxx6wT07FkaFqjzVLkZkPkSB6vCxevViH9noJ2wLYYF6L2KmL9n5nsXw5BELpYlkT6M91ZTX95uzKwjNB9iZsiyAA%26state%3D%257b%2522projectUri%2522%253a%2522%252frest%252fprojects%252fd0123c1d19274371b5c6d6edc24b74d2%2522%252c%2522billingAccountUri%2522%253a%2522%252frest%252fbilling-accounts%252f81ce737f-31fd-47a1-8414-839e415e9896%2522%252c%2522directoryUri%2522%253a%25221sqe.onmicrosoft.com%2522%257d%26session_state%3Df65f2fb0-32d7-49f8-9332-3e439eec480b  -d { [ {"op":"add", "path":"/roles","vaule":['Reader'] } ] }
```### Response :
```
{
  "id": "71ff6703-72d9-412f-9591-c8acd9fb5dbf",
  "name": "Microsoft Azure Enterprise-Sai",
  "roles": [
    "Reader"
  ],
  "canAdd": true,
  "uri": "/rest/onboarding/azure/subscriptions/71ff6703-72d9-412f-9591-c8acd9fb5dbf"
}
```#### Below, the rest API call is used to onboard the selected subscription into HPE OneSphere.### Request URL :
```
curl -v -L -X POST -H "Authorization: Bearer <token>" -H "Content-Type: application/json"  https://<customer-name>/rest/providers -d {"name":"Microsoft Azure Enterprise-Sai","subscriptionId":"71ff6703-72d9-412f-9591-c8acd9fb5dbf","billingAccountUri":"/rest/billing-accounts/81ce737f-31fd-47a1-8414-839e415e9896","projectURIs":["/rest/projects/d0123c1d19274371b5c6d6edc24b74d2"],"directoryUri":"1sqe.onmicrosoft.com","tenantId":"06ce6688-4f6a-42e0-aa33-ce711ea45b57","uniqueName":"gowri@1sqe.onmicrosoft.com","familyName":"M","givenName":"Gowri","providerTypeUri":"/rest/provider-types/azure","state":"Enabled"}
```###  Response :
```
{
  "id": "e341c82b-d9a9-4832-a924-d9b9ceb3cc81",
  "name": "EA billing_account-1337447006",
  "uri": "/rest/billing-accounts/e341c82b-d9a9-4832-a924-d9b9ceb3cc81",
  "status": "OK",
  "state": "ENABLED",
  "providerTypeUri": "/rest/provider-types/azure",
  "description": "Azure billing account",
  "enrollmentNumber": "5053985",
  "directoryUri": "1sqe.onmicrosoft.com",
  "created": "0001-01-01T00:00:00Z",
  "modified": "2018-07-31T10:35:34Z",
  "providers": [
    {
      "id": "ea1964af-6e9f-4164-b169-6a0a8cf3dd1f",
      "name": "Microsoft Azure Enterprise-Sai",
      "uri": "/rest/providers/ea1964af-6e9f-4164-b169-6a0a8cf3dd1f",
      "providerTypeUri": "/rest/provider-types/azure",
      "status": "Ok",
      "state": "Enabled",
      "projectUris": [
        "/rest/projects/7a3a7f437cd6424793c5998625a08b71"
      ],
      "billingAccountUri": "/rest/billing-accounts/e341c82b-d9a9-4832-a924-d9b9ceb3cc81",
      "subscriptionId": "71ff6703-72d9-412f-9591-c8acd9fb5dbf",
      "directoryUri": "1sqe.onmicrosoft.com",
      "tenantId": "105b2061-b669-4b31-92ac-24d304d195dc",
      "uniqueName": "test",
      "familyName": "hpe",
      "givenName": "gowri@1sqe.onmicrosoft.com",
      "created": "2018-07-30T06:07:53Z",
      "modified": "2018-07-30T06:07:53Z"
    }
  ]
}
```# Azure Monitoring#### Monitoring of the Azure providers in HPE OneSphere provides the score for the Utilization, Availability, Performance and Rating.#### The below figure shows the Score of the Rating, Utilization, Availability and Performance for the onboarded Azure subscription.

![azure_monitoring](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/7/azure_monitoring-1533015148287.png)

#### Below, the rest API shows the scores of the Azure subscription based on Rating, Utilization, Availability and Performance.### Request URL :
```
/rest/metrics?resourceUri=%2Frest%2Fprovider-types%2Fazure&name=score.overall&name=score.availability&name=score.utilization&name=score.performance&period=day&periodCount=30&periodStart=2018-06-28T00%3A00%3A00Z
```### Response :
```
{
  "total": 4,
  "start": 0,
  "count": 4,
  "members": [
    {
      "name": "score.availability",
      "resourceUri": "/rest/providers/ea1964af-6e9f-4164-b169-6a0a8cf3dd1f",
      "category": "providers",
      "units": "none",
      "description": "",
      "associations": [
        
      ],
      "values": [
        {
          "value": 1000,
          "start": "2018-07-30T00:00:00Z",
          "end": "2018-07-31T00:00:00Z"
        },
        {
          "value": 1000,
          "start": "2018-07-31T00:00:00Z",
          "end": "2018-08-01T00:00:00Z"
        }
      ]
    },
    {
      "name": "score.utilization",
      "resourceUri": "/rest/providers/ea1964af-6e9f-4164-b169-6a0a8cf3dd1f",
      "category": "providers",
      "units": "none",
      "description": "",
      "associations": [
        
      ],
      "values": [
        {
          "value": 2,
          "start": "2018-07-30T00:00:00Z",
          "end": "2018-07-31T00:00:00Z"
        },
        {
          "value": 2,
          "start": "2018-07-31T00:00:00Z",
          "end": "2018-08-01T00:00:00Z"
        }
      ]
    },
    {
      "name": "score.performance",
      "resourceUri": "/rest/providers/ea1964af-6e9f-4164-b169-6a0a8cf3dd1f",
      "category": "providers",
      "units": "none",
      "description": "",
      "associations": [
        
      ],
      "values": [
        {
          "value": 1000,
          "start": "2018-07-30T00:00:00Z",
          "end": "2018-07-31T00:00:00Z"
        },
        {
          "value": 1000,
          "start": "2018-07-31T00:00:00Z",
          "end": "2018-08-01T00:00:00Z"
        }
      ]
    },
    {
      "name": "score.overall",
      "resourceUri": "/rest/providers/ea1964af-6e9f-4164-b169-6a0a8cf3dd1f",
      "category": "providers",
      "units": "none",
      "description": "",
      "associations": [
        
      ],
      "values": [
        {
          "value": 700,
          "start": "2018-07-30T00:00:00Z",
          "end": "2018-07-31T00:00:00Z"
        },
        {
          "value": 700,
          "start": "2018-07-31T00:00:00Z",
          "end": "2018-08-01T00:00:00Z"
        }
      ]
    }
  ]
}
```#### Below, the rest API shows the status check of the virtual machine deployed in the Azure subscription. It shows the VM status, CPU usage, CPU total, VM IOPS current and VM IOPS peak.### Request URL :
```
/rest/metrics?resourceUri=%2Frest%2Fprovider-types%2Fazure&name=vm.status_checks&name=vm.status_down&name=vm.cpu.total&name=vm.cpu.usage&name=vm.iops.current&name=vm.iops.peak&period=day&periodStart=2018-06-28T00%3A00%3A00Z&periodCount=30
```### Response :
```
{
  "total": 6,
  "start": 0,
  "count": 6,
  "members": [
    {
      "name": "vm.status_checks",
      "resourceUri": "/rest/providers/ea1964af-6e9f-4164-b169-6a0a8cf3dd1f",
      "category": "providers",
      "units": "",
      "description": "Number of virtual machine status checks during the time period",
      "associations": [
        
      ],
      "values": [
        {
          "value": 228,
          "start": "2018-07-30T00:00:00Z",
          "end": "2018-07-31T00:00:00Z"
        },
        {
          "value": 178,
          "start": "2018-07-31T00:00:00Z",
          "end": "2018-08-01T00:00:00Z"
        }
      ]
    },
    {
      "name": "vm.status_down",
      "resourceUri": "/rest/providers/ea1964af-6e9f-4164-b169-6a0a8cf3dd1f",
      "category": "providers",
      "units": "",
      "description": "Number of virtual machine status checks returning down during the time period",
      "associations": [
        
      ],
      "values": [
        {
          "value": 0,
          "start": "2018-07-30T00:00:00Z",
          "end": "2018-07-31T00:00:00Z"
        },
        {
          "value": 0,
          "start": "2018-07-31T00:00:00Z",
          "end": "2018-08-01T00:00:00Z"
        }
      ]
    },
    {
      "name": "vm.cpu.total",
      "resourceUri": "/rest/providers/ea1964af-6e9f-4164-b169-6a0a8cf3dd1f",
      "category": "providers",
      "units": "cores",
      "description": "Average virtual machine cpu capacity over the time period in cores",
      "associations": [
        
      ],
      "values": [
        {
          "value": 4,
          "start": "2018-07-30T00:00:00Z",
          "end": "2018-07-31T00:00:00Z"
        },
        {
          "value": 3.8666666667,
          "start": "2018-07-31T00:00:00Z",
          "end": "2018-08-01T00:00:00Z"
        }
      ]
    },
    {
      "name": "vm.cpu.usage",
      "resourceUri": "/rest/providers/ea1964af-6e9f-4164-b169-6a0a8cf3dd1f",
      "category": "providers",
      "units": "cores",
      "description": "Average virtual machine cpu usage over the time period in cores",
      "associations": [
        
      ],
      "values": [
        {
          "value": 0.127058642,
          "start": "2018-07-30T00:00:00Z",
          "end": "2018-07-31T00:00:00Z"
        },
        {
          "value": 0.1204428571,
          "start": "2018-07-31T00:00:00Z",
          "end": "2018-08-01T00:00:00Z"
        }
      ]
    },
    {
      "name": "vm.iops.current",
      "resourceUri": "/rest/providers/ea1964af-6e9f-4164-b169-6a0a8cf3dd1f",
      "category": "providers",
      "units": "Count/s",
      "description": "Current Measured IOPs",
      "associations": [
        
      ],
      "values": [
        {
          "value": 0.6382604938,
          "start": "2018-07-30T00:00:00Z",
          "end": "2018-07-31T00:00:00Z"
        },
        {
          "value": 0.4320466667,
          "start": "2018-07-31T00:00:00Z",
          "end": "2018-08-01T00:00:00Z"
        }
      ]
    },
    {
      "name": "vm.iops.peak",
      "resourceUri": "/rest/providers/ea1964af-6e9f-4164-b169-6a0a8cf3dd1f",
      "category": "providers",
      "units": "Count/s",
      "description": "Peak Measured IOPs",
      "associations": [
        
      ],
      "values": [
        {
          "value": 150,
          "start": "2018-07-30T00:00:00Z",
          "end": "2018-07-31T00:00:00Z"
        },
        {
          "value": 143.3333333333,
          "start": "2018-07-31T00:00:00Z",
          "end": "2018-08-01T00:00:00Z"
        }
      ]
    }
  ]
}
```# Azure Costing#### Costing in HPE OneSphere shows the billing account costs and the costing based on Providers and Projects.#### Below figure shows the cost of the Provider type in Donut graph and the total cost and managed costs of the Azure provider-type. More interpretations on the various costs can be understood from the link given below at the end of this blog named Interpretation of costs.

![azure_cost_new1](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/7/azure_cost_new1-1533016011728.png)

#### The below figure shows the Project level cost where the Azure provider is associated and the provider level costs. More interpretations on the various costs can be understood from the link given below at the end of this blog named Interpretation of costs.

![azure_cost_new2](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/7/azure_cost_new2-1533016027827.png)

#### Below, the rest API shows the usage costs for the Azure provider which is associated with an HPE OneSphere project.### Request URL :
```
/rest/metrics?name=cost.usage&period=month&periodStart=2018-08-01T00%3A00%3A00Z&periodCount=-2&category=projects&query=providerUri+EQ+%2Frest%2Fproviders%2Fea1964af-6e9f-4164-b169-6a0a8cf3dd1f&view=full
```### Response :
```
{
  "total": 1,
  "start": 0,
  "count": 1,
  "members": [
    {
      "name": "cost.usage",
      "resourceUri": "/rest/projects/7a3a7f437cd6424793c5998625a08b71",
      "resource": {
        "name": "project azure-1409460572",
        "uri": "/rest/projects/7a3a7f437cd6424793c5998625a08b71",
        "zones": [
          {
            "name": "IN South",
            "uri": "/rest/zones/IN+South",
            "region": {
              "name": "insouth",
              "uri": "/rest/regions/insouth",
              "provider": {
                "name": "Microsoft Azure Enterprise-Sai",
                "uri": "/rest/providers/71ff6703-72d9-412f-9591-c8acd9fb5dbf",
                "providerType": {
                  "name": "Microsoft Azure",
                  "uri": "/rest/provider-types/azure"
                }
              }
            }
          },
          {
            "name": "All Regions",
            "uri": "/rest/zones/All+Regions",
            "region": {
              "name": "insouth",
              "uri": "/rest/regions/insouth",
              "provider": {
                "name": "Microsoft Azure Enterprise-Sai",
                "uri": "/rest/providers/71ff6703-72d9-412f-9591-c8acd9fb5dbf",
                "providerType": {
                  "name": "Microsoft Azure",
                  "uri": "/rest/provider-types/azure"
                }
              }
            }
          },
          {
            "name": "Zone 2",
            "uri": "/rest/zones/Zone+2",
            "region": {
              "name": "insouth",
              "uri": "/rest/regions/insouth",
              "provider": {
                "name": "Microsoft Azure Enterprise-Sai",
                "uri": "/rest/providers/71ff6703-72d9-412f-9591-c8acd9fb5dbf",
                "providerType": {
                  "name": "Microsoft Azure",
                  "uri": "/rest/provider-types/azure"
                }
              }
            }
          },
          {
            "name": "All Regions",
            "uri": "/rest/zones/All+Regions",
            "region": {
              "name": "USEast",
              "uri": "/rest/regions/USEast",
              "provider": {
                "name": "Microsoft Azure Enterprise-Sai",
                "uri": "/rest/providers/71ff6703-72d9-412f-9591-c8acd9fb5dbf",
                "providerType": {
                  "name": "Microsoft Azure",
                  "uri": "/rest/provider-types/azure"
                }
              }
            }
          },
          {
            "name": "US East",
            "uri": "/rest/zones/US+East",
            "region": {
              "name": "USEast",
              "uri": "/rest/regions/USEast",
              "provider": {
                "name": "Microsoft Azure Enterprise-Sai",
                "uri": "/rest/providers/71ff6703-72d9-412f-9591-c8acd9fb5dbf",
                "providerType": {
                  "name": "Microsoft Azure",
                  "uri": "/rest/provider-types/azure"
                }
              }
            }
          },
          {
            "name": "Zone 1",
            "uri": "/rest/zones/Zone+1",
            "region": {
              "name": "USEast",
              "uri": "/rest/regions/USEast",
              "provider": {
                "name": "Microsoft Azure Enterprise-Sai",
                "uri": "/rest/providers/71ff6703-72d9-412f-9591-c8acd9fb5dbf",
                "providerType": {
                  "name": "Microsoft Azure",
                  "uri": "/rest/provider-types/azure"
                }
              }
            }
          },
          {
            "name": "Zone 1",
            "uri": "/rest/zones/Zone+1",
            "region": {
              "name": "EastUS",
              "uri": "/rest/regions/EastUS",
              "provider": {
                "name": "Microsoft Azure Enterprise-Sai",
                "uri": "/rest/providers/71ff6703-72d9-412f-9591-c8acd9fb5dbf",
                "providerType": {
                  "name": "Microsoft Azure",
                  "uri": "/rest/provider-types/azure"
                }
              }
            }
          },
          {
            "name": "US East",
            "uri": "/rest/zones/US+East",
            "region": {
              "name": "EastUS",
              "uri": "/rest/regions/EastUS",
              "provider": {
                "name": "Microsoft Azure Enterprise-Sai",
                "uri": "/rest/providers/71ff6703-72d9-412f-9591-c8acd9fb5dbf",
                "providerType": {
                  "name": "Microsoft Azure",
                  "uri": "/rest/provider-types/azure"
                }
              }
            }
          },
          {
            "name": "All Regions",
            "uri": "/rest/zones/All+Regions",
            "region": {
              "name": "EastUS",
              "uri": "/rest/regions/EastUS",
              "provider": {
                "name": "Microsoft Azure Enterprise-Sai",
                "uri": "/rest/providers/71ff6703-72d9-412f-9591-c8acd9fb5dbf",
                "providerType": {
                  "name": "Microsoft Azure",
                  "uri": "/rest/provider-types/azure"
                }
              }
            }
          },
          {
            "name": "IN South",
            "uri": "/rest/zones/IN+South",
            "region": {
              "name": "IN South",
              "uri": "/rest/regions/IN+South",
              "provider": {
                "name": "Microsoft Azure Enterprise-Sai",
                "uri": "/rest/providers/71ff6703-72d9-412f-9591-c8acd9fb5dbf",
                "providerType": {
                  "name": "Microsoft Azure",
                  "uri": "/rest/provider-types/azure"
                }
              }
            }
          },
          {
            "name": "All Regions",
            "uri": "/rest/zones/All+Regions",
            "region": {
              "name": "IN South",
              "uri": "/rest/regions/IN+South",
              "provider": {
                "name": "Microsoft Azure Enterprise-Sai",
                "uri": "/rest/providers/71ff6703-72d9-412f-9591-c8acd9fb5dbf",
                "providerType": {
                  "name": "Microsoft Azure",
                  "uri": "/rest/provider-types/azure"
                }
              }
            }
          },
          {
            "name": "Zone 2",
            "uri": "/rest/zones/Zone+2",
            "region": {
              "name": "IN South",
              "uri": "/rest/regions/IN+South",
              "provider": {
                "name": "Microsoft Azure Enterprise-Sai",
                "uri": "/rest/providers/71ff6703-72d9-412f-9591-c8acd9fb5dbf",
                "providerType": {
                  "name": "Microsoft Azure",
                  "uri": "/rest/provider-types/azure"
                }
              }
            }
          },
          {
            "name": "All Regions",
            "uri": "/rest/zones/All+Regions",
            "region": {
              "name": "southindia",
              "uri": "/rest/regions/southindia",
              "provider": {
                "name": "Microsoft Azure Enterprise-Sai",
                "uri": "/rest/providers/71ff6703-72d9-412f-9591-c8acd9fb5dbf",
                "providerType": {
                  "name": "Microsoft Azure",
                  "uri": "/rest/provider-types/azure"
                }
              }
            }
          },
          {
            "name": "IN South",
            "uri": "/rest/zones/IN+South",
            "region": {
              "name": "southindia",
              "uri": "/rest/regions/southindia",
              "provider": {
                "name": "Microsoft Azure Enterprise-Sai",
                "uri": "/rest/providers/71ff6703-72d9-412f-9591-c8acd9fb5dbf",
                "providerType": {
                  "name": "Microsoft Azure",
                  "uri": "/rest/provider-types/azure"
                }
              }
            }
          }
        ]
      },
      "category": "projects",
      "units": "USD",
      "description": "The usage cost for a requested category.",
      "associations": [
        
      ],
      "values": [
        {
          "value": 171.11370000000002,
          "start": "2018-06-01T00:00:00Z",
          "end": "2018-06-30T00:00:00Z"
        },
        {
          "value": 316.8424,
          "start": "2018-07-01T00:00:00Z",
          "end": "2018-07-31T00:00:00Z"
        }
      ]
    }
  ]
}
```#### Below, the rest API shows the usage costs for the consumed services for the Azure provider.### Request URL :
```
/rest/metrics?name=cost.usage&period=month&periodStart=2018-08-01T00%3A00%3A00Z&periodCount=-2&category=provider-services&groupBy=providerServiceTypeUri&query=providerUri+EQ+%2Frest%2Fproviders%2Fea1964af-6e9f-4164-b169-6a0a8cf3dd1f+AND+projectUri+EQ+%2Frest%2Fprojects%2F7a3a7f437cd6424793c5998625a08b71&view=full
```### Response :
```
{
  "total": 6,
  "start": 0,
  "count": 6,
  "members": [
    {
      "name": "cost.usage",
      "resourceUri": "/rest/provider-service-types/Microsoft.DBforMySQL",
      "resource": {
        "name": "Microsoft.DBforMySQL",
        "uri": "/rest/provider-service-types/Microsoft.DBforMySQL"
      },
      "category": "provider-service-types",
      "units": "USD",
      "description": "The usage cost for a requested category.",
      "associations": [
        
      ],
      "values": [
        {
          "value": 12.42,
          "start": "2018-06-01T00:00:00Z",
          "end": "2018-06-30T00:00:00Z"
        },
        {
          "value": 140.4,
          "start": "2018-07-01T00:00:00Z",
          "end": "2018-07-31T00:00:00Z"
        }
      ]
    },
    {
      "name": "cost.usage",
      "resourceUri": "/rest/provider-service-types/Microsoft.Compute",
      "resource": {
        "name": "Microsoft.Compute",
        "uri": "/rest/provider-service-types/Microsoft.Compute"
      },
      "category": "provider-service-types",
      "units": "USD",
      "description": "The usage cost for a requested category.",
      "associations": [
        
      ],
      "values": [
        {
          "value": 150.7065,
          "start": "2018-06-01T00:00:00Z",
          "end": "2018-06-30T00:00:00Z"
        },
        {
          "value": 168.16520000000003,
          "start": "2018-07-01T00:00:00Z",
          "end": "2018-07-31T00:00:00Z"
        }
      ]
    },
    {
      "name": "cost.usage",
      "resourceUri": "/rest/provider-service-types/Microsoft.Storage",
      "resource": {
        "name": "Microsoft.Storage",
        "uri": "/rest/provider-service-types/Microsoft.Storage"
      },
      "category": "provider-service-types",
      "units": "USD",
      "description": "The usage cost for a requested category.",
      "associations": [
        
      ],
      "values": [
        {
          "value": 0.058800000000000005,
          "start": "2018-06-01T00:00:00Z",
          "end": "2018-06-30T00:00:00Z"
        },
        {
          "value": 0.0585,
          "start": "2018-07-01T00:00:00Z",
          "end": "2018-07-31T00:00:00Z"
        }
      ]
    },
    {
      "name": "cost.usage",
      "resourceUri": "/rest/provider-service-types/Storage",
      "resource": {
        "name": "Storage",
        "uri": "/rest/provider-service-types/Storage"
      },
      "category": "provider-service-types",
      "units": "USD",
      "description": "The usage cost for a requested category.",
      "associations": [
        
      ],
      "values": [
        {
          "value": 0.0661,
          "start": "2018-06-01T00:00:00Z",
          "end": "2018-06-30T00:00:00Z"
        },
        {
          "value": 0.06470000000000001,
          "start": "2018-07-01T00:00:00Z",
          "end": "2018-07-31T00:00:00Z"
        }
      ]
    },
    {
      "name": "cost.usage",
      "resourceUri": "/rest/provider-service-types/Microsoft.Network",
      "resource": {
        "name": "Microsoft.Network",
        "uri": "/rest/provider-service-types/Microsoft.Network"
      },
      "category": "provider-service-types",
      "units": "USD",
      "description": "The usage cost for a requested category.",
      "associations": [
        
      ],
      "values": [
        {
          "value": 6.7729,
          "start": "2018-06-01T00:00:00Z",
          "end": "2018-06-30T00:00:00Z"
        },
        {
          "value": 7.5052,
          "start": "2018-07-01T00:00:00Z",
          "end": "2018-07-31T00:00:00Z"
        }
      ]
    },
    {
      "name": "cost.usage",
      "resourceUri": "/rest/provider-service-types/Microsoft.Sql",
      "resource": {
        "name": "Microsoft.Sql",
        "uri": "/rest/provider-service-types/Microsoft.Sql"
      },
      "category": "provider-service-types",
      "units": "USD",
      "description": "The usage cost for a requested category.",
      "associations": [
        
      ],
      "values": [
        {
          "value": 1.0896,
          "start": "2018-06-01T00:00:00Z",
          "end": "2018-06-30T00:00:00Z"
        },
        {
          "value": 0.6487,
          "start": "2018-07-01T00:00:00Z",
          "end": "2018-07-31T00:00:00Z"
        }
      ]
    }
  ]
}
```#### This link explains the Interpretation of various costs in detail on the Insights page.