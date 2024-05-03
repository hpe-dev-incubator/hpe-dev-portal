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
governed by role-based access controls (RBACs) similar to the regular users using the browser-based console. 

In this series of blogs we will demonstrate how we can connect to the APIs and how the APIs can be used in scripting or integrated into management software.

### Configuring API client credentials

To get started with the API we'll need to create a client_id/client_secret pair to authenticate each API request, this key pair is linked to the user creating it and every interaction using this token will be registered in the audit log. The token generated using this key pair has the same permissions as the user who created it. The token is valid for two hours and expires automatically.

1. Sign in to HPE GreenLake, select your Workspace, then select Manage Workspace.
2. Click the API card.
3. Click Create Credentials. 
4. Select the Service Manager you want to access.
5. Enter the Credential Name .
6. Click the Create Credentials button to continue. The Credentials Created screen displays showing your credentials were successfully created.
7. Copy the Client ID and the Client Secret to a safe and secure location. HPE GreenLake platform does not store your Client Secret.
8. Select the Copy icon to save your information to your desktop.
9. Click the Close button to continue. You are returned to the main API page, where you can now generate the access token using a sample code provided.

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

Note: Makes sure the modules oauthlib, requests and requests_oauthlib are installed in your environment, if not just install these using:

```python
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

Note: For simplicity and demo reasons we store the client_id and client_secret in the code, obviously that should never be done in production! How to implement a more secure method will be explained in the next episode of this series.

## Calling an API

A list of available APIs for HPE GreenLake for Private Cloud Business Edition can be found at <https://developer.greenlake.hpe.com/docs/greenlake/services/private-cloud-business/public/>

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