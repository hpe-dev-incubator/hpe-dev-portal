---
title: Getting started with Private Cloud Business Edition APIs
date: 2024-05-24T13:19:00.923Z
author: Mark van Silfhout
authorimage: /img/mark-genevax150.jpg
disable: false
tags:
  - HPE GreenLake for Private Cloud Business Edition
  - Private Cloud Business Edition
  - PCBE
---
<style>
li {
   font-size: 27px;
  line-height: 33px;
   max-width: none;
}
</style>

## HPE GreenLake for Private Cloud Business Edition

Deploy an agile, self-service private cloud wherever you need it. Simplify VM management across on-prem and public clouds as you leverage HPE’s modern hyperconverged infrastructure to build a workload-optimized private cloud.

Every organization wants to unleash the power of its data to drive digital transformation. But fragmented infrastructure complexity, manual processes across diverse environments across hybrid cloud, and infrastructure silos spanning edge to cloud are impeding data-driven innovation and agility and creating business risk.
Customers are looking for a radically simplified experience for data infrastructure at scale across the lifecycle — from streamlined device deployment to virtual machine (VM) provisioning, to a global VM and infrastructure management.
They are looking for a cloud-native control plane that scales with infrastructure, so managing hundreds of systems across geographies is as simple as one.

## Simplify infrastructure operations

With cloud agility Hewlett Packard Enterprise provides HPE GreenLake for Private Cloud
Business Edition delivering VMs across hybrid cloud, on demand. With this offering, customers can build their self-service cloud on demand when they need it and where they need it in data centers, at the edge, and beyond. HPE GreenLake for Private Cloud Business Edition changes the way customers procure and manage VMs with a cloud operational experience. HPE GreenLake for Private Cloud Business Edition helps eliminate complexity with a unified cloud service for VM to infrastructure management, including public cloud VMs.
The solution — delivered through the Data Services Cloud Console — enables global unified management and monitoring of VMs and infrastructure deployed at any location as well as 1-click, multisite upgrades. This enables IT to reduce operating costs while helping optimize resource utilization, move to a generalist
model, and shift from managing infrastructure to managing VMs and data, thereby refocusing resources and skills on higher-value strategic initiatives.

## Automating management

Besides the browser-based Data Services Cloud Console, HPE GreenLake for Private Cloud Business Edition offers a set of Application Programming Interfaces (API's) to automate management of HPE GreenLake for Private Cloud Enterprise or even integrate this with the customer's own management tools. These API's are
governed by role-based access controls (RBACs) similar to the regular users using the browser-based console. The API's will authenticate using a token, which is created from the client_id and client_secret key pair, and will have the same permissions as the user that created the client_id and client_secret key pair. Each API call will be audited and logged by the HPE GreenLake platform and will be listed under the users id (usually the email address of the user).

In this series of blog posts I will demonstrate how we can connect to the APIs and how the APIs can be used in scripting or integrated into management software. For this series Python will be used in the examples, however any other programming language supporting the http protocol can be used.

### Configuring API client credentials

To get started with the API you'll need to create a client_id/client_secret pair to authenticate each API request, this key pair is linked to the user creating it and every interaction using this token will be registered in the audit log. The token generated using this key pair has the same permissions as the user who created it. The token is valid for two hours and expires automatically.

1. Sign in to HPE GreenLake, select your Workspace, then select Manage Workspace.



1. Click the API card.

   ![](/img/workspace-small.png "Manage workspace")
2. Click Create Credentials. 

   ![](/img/create_credentials.png "Click create credentials")
3. Select the Service Manager you want to access.
4. Enter the Credential Name .
5. Click the Create Credentials button to continue. The Credentials Created screen displays showing your credentials were successfully created.
6. Copy the Client ID and the Client Secret to a safe and secure location. HPE GreenLake platform does not store your Client Secret.
7. Select the Copy icon to save your information to your desktop.
8. Click the Close button to continue. You are returned to the main API page, where you can now generate the access token using a sample code provided.

Example code:

```python
from oauthlib.oauth2 import BackendApplicationClient         
from requests.auth import HTTPBasicAuth         
from requests_oauthlib import OAuth2Session         

client = BackendApplicationClient('e21f3028-8097-4a4f-b491-a49b1d102d4a')         
        
oauth = OAuth2Session(client=client)         
auth = HTTPBasicAuth('e21f3028-8097-4a4f-b491-a49b1d102d4a', '05656940014f11ef9946a2408e898685')         
   
token = oauth.fetch_token(token_url='https://sso.common.cloud.hpe.com/as/token.oauth2', auth=auth)         
print(token["access_token"])
```

> *Note*: Make sure the modules oauthlib, requests and requests_oauthlib are installed in your environment, if not just install these using:

```powershell
pip install oauthlib
pip install requests
pip install requests_oauthlib
```

When running the example code JSON formatted data will be returned, like this:

```json
{
    "access_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjJGSmhvZ1lRMDZNazNBc2Q4UU8zU09ZVE9wayIsInBpLmF0bSI6ImRlejAifQ.eyJjbGllbnRfaWQiOiJlMjFmMzAyOC04MDk3LTRhNGYtYjQ5MS1hNDliMWQxMDJkNGEiLCJpc3MiOiJodHRwczovL3Nzby5jb21tb24uY2xvdWQuaHBlLmNvbSIsImF1ZCI6ImV4dGVybmFsX2FwaSIsInN1YiI6Im1hcmsudmFuLnNpbGZob3V0QGhwZS5jb20iLCJ1c2VyX2N0eCI6ImVmMDc3MDVjOGVhNjExZWNiNzNiMWEyNTZjMDNiNTQ2IiwiYXV0aF9zb3VyY2UiOiJjY3NfdG9rZW5fbWFuYWdlbWVudCIsInBsYXRmb3JtX2N1c3RvbWVyX2lkIjoiZDI2YmFmMjY4ZWE2MTFlYzljZmUwMmMwMzQ1YzI0M2MiLCJpYXQiOjE3MTM4NjI4OTYsImFwcGxpY2F0aW9uX2luc3RhbmNlX2lkIjoiZWYwMTA4MjMtYjMwMS00MWJmLTk0OWMtYTQ3NzE0OTRiMzg1IiwiZXhwIjoxNzEzODcwMDk2fQ.arTNjVsVZ-wcW5Ic5fuGUvBKAupzWvRokuvdzlW1I2UqXFoqp0-jw1cHVr-QgDUlBPXG6uc-aILnYXWN_h-QWOQQu1c8aTbLaqpfXEL89MndPyErF0x4By21JLoR1mq-8zkMEEJ2CHGOeBYau_hBim-SBr1BtcetX3BcFl4GoGRGS5lzL1nbwkC-Hi_OOs_2UnDH4ajyyPsp_Ka4wmsgHn1aSQhJjDFbxx4WiLmRdp8aNZT5r250v5EWR9qVeqE4TDOfKAf_BBhC2RB00mWAt1F_Rd4rPmMyZm0uPZd5f71aDjd3I5tl0gh-W2Z4HHt0jRKV-L1d4o52jzYkhL1nTA",
    "expires_at": 1713870095.208547,
    "expires_in": 7199,
    "token_type": "Bearer"
}
```

the JSON data holds the access_token itself and also the expiration time, which is 2 hours (7200 seconds).

> *Note*: For simplicity and demo reasons we store the client_id and client_secret in the code, obviously that should never be done in production! How to implement a more secure method will be explained in the next episode of this series.

## Calling an API

A list of available APIs for HPE GreenLake for Private Cloud Business Edition can be found at <https://developer.greenlake.hpe.com/docs/greenlake/services/private-cloud-business/public/> When publishing this blog post the APIs were still in beta, however the GA release is planned shortly after.

In this example we will collect an overview of all System Software Catalogs.

```python
import json

from oauthlib.oauth2 import BackendApplicationClient
from requests.auth import HTTPBasicAuth
from requests_oauthlib import OAuth2Session

client = BackendApplicationClient('e21f3028-8097-4a4f-b491-a49b1d102d4a')
oauth = OAuth2Session(client=client)
auth = HTTPBasicAuth('e21f3028-8097-4a4f-b491-a49b1d102d4a', '05656940014f11ef9946a2408e898685')
token = oauth.fetch_token(token_url='https://sso.common.cloud.hpe.com/as/token.oauth2', auth=auth)
access_token= token["access_token"]

url = "https://us1.data.cloud.hpe.com/private-cloud-business/v1beta1/system-software-catalogs"
headers = {"Authorization": f"Bearer {token}"}
response = requests.get(url, headers=headers)
print(json.dumps(response.json(), indent=4, sort_keys=True))
```

This will generate a JSON formatted data stream like:

```json
    "count": 10,
    "items": [
        {
            "createdAt": "2024-03-11T01:56:04Z",
            "customerId": "00000000000000000000000000000000",
            "eula": "https://update.nimblestorage.com/catalog/download/eula-rel-pebble-400.html",
            "generation": 991063,
            "hypervisor": null,
            "hypervisorManager": null,
            "id": "f3b72767-4f59-4af5-8e34-cc2828baa954",
            "name": "2.98",
            "releaseDate": "2024-03-05",
            "resourceUri": "/private-cloud-business/v1beta1/system-software-catalogs/f3b72767-4f59-4af5-8e34-cc2828baa954",
            "serverFirmware": null,
            "storageConnectionManager": null,
            "storageSoftware": null,
            "systemsWithUpdatePath": null,
            "type": "private-cloud-business/system-software-catalog",
            "updatedAt": "2024-05-03T13:32:55Z",
            "version": "2.98"
        },
        {
            "createdAt": "2024-03-11T01:58:06Z",
            "customerId": "00000000000000000000000000000000",
            "eula": "https://update.nimblestorage.com/catalog/download/eula-rel-pebble-400.html",
            "generation": 570404,
            "hypervisor": null,
            "hypervisorManager": null,
            "id": "993fae5e-a928-458e-8547-87e29f956952",
            "name": "7.61.34.18.37",
            "releaseDate": "2024-03-05",
            "resourceUri": "/private-cloud-business/v1beta1/system-software-catalogs/993fae5e-a928-458e-8547-87e29f956952",
            "serverFirmware": null,
            "storageConnectionManager": null,
            "storageSoftware": null,
            "systemsWithUpdatePath": null,
            "type": "private-cloud-business/system-software-catalog",
            "updatedAt": "2024-05-03T13:31:52Z",
            "version": "7.61.34.18.37"
        },
        {
            "createdAt": "2024-03-11T01:54:04Z",
            "customerId": "00000000000000000000000000000000",
            "eula": "https://update.nimblestorage.com/catalog/download/eula-rel-pebble-400.html",
            "generation": 970638,
            "hypervisor": null,
            "hypervisorManager": null,
            "id": "6cff3aef-c12c-41e4-8934-1e02fa19492a",
            "name": "7.6.35.18.36",
            "releaseDate": "2024-03-05",
            "resourceUri": "/private-cloud-business/v1beta1/system-software-catalogs/6cff3aef-c12c-41e4-8934-1e02fa19492a",
            "serverFirmware": null,
            "storageConnectionManager": null,
            "storageSoftware": null,
            "systemsWithUpdatePath": null,
            "type": "private-cloud-business/system-software-catalog",
            "updatedAt": "2024-05-03T13:32:55Z",
            "version": "7.6.35.18.36"
        },
        {
            "createdAt": "2023-11-02T18:39:13Z",
            "customerId": "00000000000000000000000000000000",
            "eula": "https://update.nimblestorage.com/catalog/download/eula-rel-juno-1100.html",
            "generation": 3181010,
            "hypervisor": {
                "name": "ESXi 7.0U2 May 2021",
                "releaseDate": "2021-05-13",
                "releaseNotesURL": "https://support.hpe.com/hpesc/public/docDisplay?docId=a00113634en_us",
                "version": "7.0.2-17867351"
            },
            "hypervisorManager": null,
            "id": "2df73503-6b84-41b7-9c49-eb23b6e850b2",
            "name": "1.70",
            "releaseDate": "2023-06-01",
            "resourceUri": "/private-cloud-business/v1beta1/system-software-catalogs/2df73503-6b84-41b7-9c49-eb23b6e850b2",
            "serverFirmware": {
                "name": "Service Pack for ProLiant",
                "releaseDate": "2022-09-28",
                "releaseNotesURL": "https://internal.support.hpe.com/hpesc/public/docDisplay?docLocale=en_US&docId=a00127259en_us",
                "version": "2022.09.1"
            },
            "storageConnectionManager": {
                "name": "Nimble Connection Manager",
                "releaseDate": "2020-10-21",
                "releaseNotesURL": "https://infosight.hpe.com/InfoSight/media/software/active/2/351/NCM701_RelNotes2.pdf",
                "version": "7.0.1-700003"
            },
            "storageSoftware": {
                "name": "Nimble OS",
                "releaseDate": "2023-06-13",
                "releaseNotesURL": "https://infosight.hpe.com/InfoSight/media/cms/active/NimbleOS_Release_Notes_5.2.1.1100.pdf",
                "version": "5.2.1.1100-1027043"
            },
            "systemsWithUpdatePath": null,
            "type": "private-cloud-business/system-software-catalog",
            "updatedAt": "2024-05-03T13:32:55Z",
            "version": "1.70"
        },
        {
            "createdAt": "2024-03-11T01:54:04Z",
            "customerId": "00000000000000000000000000000000",
            "eula": "https://update.nimblestorage.com/catalog/download/eula-rel-pebble-400.html",
            "generation": 952334,
            "hypervisor": null,
            "hypervisorManager": null,
            "id": "7332fe0c-9c98-4bf8-8071-d7b2cd8e8b37",
            "name": "7.6.34.18.36",
            "releaseDate": "2024-03-05",
            "resourceUri": "/private-cloud-business/v1beta1/system-software-catalogs/7332fe0c-9c98-4bf8-8071-d7b2cd8e8b37",
            "serverFirmware": null,
            "storageConnectionManager": null,
            "storageSoftware": null,
            "systemsWithUpdatePath": null,
            "type": "private-cloud-business/system-software-catalog",
            "updatedAt": "2024-05-03T13:32:55Z",
            "version": "7.6.34.18.36"
        },
        {
            "createdAt": "2024-03-11T01:56:04Z",
            "customerId": "00000000000000000000000000000000",
            "eula": "https://update.nimblestorage.com/catalog/download/eula-rel-pebble-400.html",
            "generation": 988428,
            "hypervisor": null,
            "hypervisorManager": null,
            "id": "50247e6c-13e1-426e-80d5-72aac49cbf3a",
            "name": "2.97",
            "releaseDate": "2024-03-05",
            "resourceUri": "/private-cloud-business/v1beta1/system-software-catalogs/50247e6c-13e1-426e-80d5-72aac49cbf3a",
            "serverFirmware": null,
            "storageConnectionManager": null,
            "storageSoftware": null,
            "systemsWithUpdatePath": null,
            "type": "private-cloud-business/system-software-catalog",
            "updatedAt": "2024-05-03T13:32:55Z",
            "version": "2.97"
        },
        {
            "createdAt": "2023-11-02T18:39:13Z",
            "customerId": "00000000000000000000000000000000",
            "eula": "https://update.nimblestorage.com/catalog/download/eula-rel-juno-1100.html",
            "generation": 3169145,
            "hypervisor": {
                "name": "ESXi 7.0U1 May 2021",
                "releaseDate": "2021-05-13",
                "releaseNotesURL": "https://support.hpe.com/hpesc/public/docDisplay?docId=a00113633en_us",
                "version": "7.0.1-17551050"
            },
            "hypervisorManager": null,
            "id": "2b1b935a-6640-4f65-bbbc-02141582de20",
            "name": "1.69",
            "releaseDate": "2023-06-01",
            "resourceUri": "/private-cloud-business/v1beta1/system-software-catalogs/2b1b935a-6640-4f65-bbbc-02141582de20",
            "serverFirmware": {
                "name": "Service Pack for ProLiant",
                "releaseDate": "2021-05-21",
                "releaseNotesURL": "https://downloads.hpe.com/pub/softlib2/software1/publishable-catalog/p291731480/v138520/SPP2021.05.0ReleaseNotes.pdf",
                "version": "2021.05.0"
            },
            "storageConnectionManager": {
                "name": "Nimble Connection Manager",
                "releaseDate": "2020-10-21",
                "releaseNotesURL": "https://infosight.hpe.com/InfoSight/media/software/active/2/351/NCM701_RelNotes2.pdf",
                "version": "7.0.1-700003"
            },
            "storageSoftware": {
                "name": "Nimble OS",
                "releaseDate": "2023-06-13",
                "releaseNotesURL": "https://infosight.hpe.com/InfoSight/media/cms/active/NimbleOS_Release_Notes_5.2.1.1100.pdf",
                "version": "5.2.1.1100-1027043"
            },
            "systemsWithUpdatePath": null,
            "type": "private-cloud-business/system-software-catalog",
            "updatedAt": "2024-05-03T13:32:55Z",
            "version": "1.69"
        },
        {
            "createdAt": "2024-02-20T02:56:40Z",
            "customerId": "00000000000000000000000000000000",
            "eula": "https://update.nimblestorage.com/catalog/download/eula-rel-juno-1100.html",
            "generation": 1447550,
            "hypervisor": null,
            "hypervisorManager": null,
            "id": "6b692b44-ce0d-44a2-8a19-4d9cbfd9330f",
            "name": "1.77",
            "releaseDate": "2024-02-11",
            "resourceUri": "/private-cloud-business/v1beta1/system-software-catalogs/6b692b44-ce0d-44a2-8a19-4d9cbfd9330f",
            "serverFirmware": null,
            "storageConnectionManager": null,
            "storageSoftware": null,
            "systemsWithUpdatePath": null,
            "type": "private-cloud-business/system-software-catalog",
            "updatedAt": "2024-05-03T13:32:55Z",
            "version": "1.77"
        },
        {
            "createdAt": "2024-03-11T01:57:07Z",
            "customerId": "00000000000000000000000000000000",
            "eula": "https://update.nimblestorage.com/catalog/download/eula-rel-pebble-400.html",
            "generation": 644305,
            "hypervisor": null,
            "hypervisorManager": null,
            "id": "f66777dd-e380-4319-9a32-a7ee24ff4cd4",
            "name": "7.61.35.18.37",
            "releaseDate": "2024-03-05",
            "resourceUri": "/private-cloud-business/v1beta1/system-software-catalogs/f66777dd-e380-4319-9a32-a7ee24ff4cd4",
            "serverFirmware": null,
            "storageConnectionManager": null,
            "storageSoftware": null,
            "systemsWithUpdatePath": null,
            "type": "private-cloud-business/system-software-catalog",
            "updatedAt": "2024-05-03T13:31:52Z",
            "version": "7.61.35.18.37"
        },
        {
            "createdAt": "2024-03-11T01:57:05Z",
            "customerId": "00000000000000000000000000000000",
            "eula": "https://update.nimblestorage.com/catalog/download/eula-rel-pebble-400.html",
            "generation": 990969,
            "hypervisor": null,
            "hypervisorManager": null,
            "id": "3f3a18be-00f8-4478-9a40-b0b316d47771",
            "name": "2.99",
            "releaseDate": "2024-03-05",
            "resourceUri": "/private-cloud-business/v1beta1/system-software-catalogs/3f3a18be-00f8-4478-9a40-b0b316d47771",
            "serverFirmware": null,
            "storageConnectionManager": null,
            "storageSoftware": null,
            "systemsWithUpdatePath": null,
            "type": "private-cloud-business/system-software-catalog",
            "updatedAt": "2024-05-03T13:32:55Z",
            "version": "2.99"
        }
    ],
    "offset": 0,
    "total": 11
}
```

In the next blog post of this series we will have a look at a more secure implementation of the client_secret, using a key chain manager to read the client_secret.