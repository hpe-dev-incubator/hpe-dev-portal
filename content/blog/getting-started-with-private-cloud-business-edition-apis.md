---
title: Getting started with Private Cloud Business Edition APIs
date: 2024-05-24T13:19:00.923Z
author: Mark van Silfhout
authorimage: /img/mark-genevax150.jpg
disable: false
---
# HPE GreenLake for Private Cloud Business Edition

Deploy an agile, self-service private cloud wherever you need it. Simplify VM management across on-prem and public clouds as you leverage HPE’s modern hyperconverged infrastructure to build a workload-optimized private cloud.

Every organization wants to unleash the power of its data to drive digital transformation. But fragmented infrastructure complexity, manual processes across diverse environments across hybrid cloud, and infrastructure silos spanning edge to cloud are impeding data-driven innovation and agility and creating business risk.
Customers are looking for a radically simplified experience for data infrastructure at scale across the lifecycle — from streamlined device deployment to virtual machine (VM) provisioning, to a global VM and infrastructure management.
They are looking for a cloud-native control plane that scales with infrastructure, so managing hundreds of systems across geographies is as simple as one.

## Simplify infrastructure operations

With cloud agility Hewlett Packard Enterprise provides HPE GreenLake for Private Cloud
Business Edition delivering VMs across hybrid cloud, on demand. With this offering, customers can build their self-service cloud on demand when they need it and where they need it in data centers, at the edge, and beyond. HPE GreenLake for Private Cloud Business Edition changes the way customers procure and manage VMs with a cloud operational experience. HPE GreenLake for Private Cloud Business Edition helps eliminate complexity with a unified cloud service for VM to infrastructure management, including public cloud VMs.
The solution — delivered through the Data Services Cloud Console — enables global unified management and monitoring of VMs and infrastructure deployed
at any location as well as 1-click, multisite upgrades. This enables IT to reduce operating costs while helping optimize resource utilization, move to a generalist
model, and shift from managing infrastructure to managing VMs and data, thereby refocusing resources and skills on higher-value strategic initiatives.

## Automating management

Besides the browser-based Data Services Cloud Console, HPE GreenLake for Private Cloud Business Edition offers a set of Application Programming Interfaces (API's) to automate management of HPE GreenLake for Private Cloud Enterprise or even integrate this with the customer's own management tools. These API's are
governed by role-based access controls (RBACs) similar to the regular users using the browser-based console.

### Configuring API client credentials

To get started with the API we'll need to create a client_id/client_secret pair, this pair is linked to the user creating it and every interaction using this token will be registered in the audit log.

1. Sign in to HPE GreenLake, select your Workspace, Select Manage Workspace.
2. ![Seletinh the API card](/img/workspace-small.png "Select the API card")

   Click the API card.
3. Click Create Credentials .
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