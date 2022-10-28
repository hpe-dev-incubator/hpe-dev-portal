---
title: How to use an API Access Token for HPE GreenLake for Compute Ops Management
date: 2022-10-27T17:16:38.426Z
author: Nisha Thomas
authorimage: /img/nishathomas-small_blog.jpg
disable: false
tags:
  - hpe-greenlake, hpe-greenlake-for-compute-ops-management
---
The Compute Ops Management REST API uses the OAuth 2.0 HPE GreenLake authentication flow. A limited lifetime access token needs to be provided in the header of each REST API request as the authorization bearer. The access token is associated with a subject (person or service) and has all the same permissions and privileges as the subject. The access token expires after 120 minutes.

This blog will discuss the essential steps required to generate the limited lifetime access token.

## HPE GreenLake steps to obtain the access token for Compute Ops Management

The user starts the process by logging in and authenticating into HPE GreenLake, which is authenticated by the Identity Provider (validated through username, password, Single Sign-On, or Multi-Factor Authentication). 
The prerequisite is that Compute Ops Management is provisioned/added to the user’s customer account. The user must have a role required to perform the intended operation in the instance of Compute Ops Management. 
First, users need to create the API client credentials for the specific Compute Ops Management application instance, which is used to generate the access token. Once the token is generated, it can make further API calls.

### Configuring API Client Credentials

To configure your API Client Credentials, perform the following steps:

1. Click on the **Manage** link on the header on the GreenLake platform
2. Select the **API** tile
3. Click the **Create Credential** link. The **Create Credentials** screen displays.

![GreenLake manage link](/img/glcp_manage.png "GreenLake manage link")

![GreenLake API link](/img/glcp_api.png "GreenLake API link")

![GreenLake Create Credential Button](/img/glcp_create_cred.png "GreenLake Create Credential Button")

4. Select the **Application** you want to access. 
5. Provide a Credential Name.
6. Click the **Create Credentials** button to continue. 

![GreenLake Create Credential Dialog](/img/glcp_create_cred_dialog.png "GreenLake Create Credential Dialog")

7. The **Credentials Created** Screen displays your credentials. 
8. Next, you must copy the **Client Secret** to a safe and secure location. HPE GLCP does not store your **Client Secret**. Select the Copy icon to save your information. 
9. Click the **Close** button to continue. 

![GreenLake Copy Credential](/img/glcp_create_cred_copy.png "GreenLake Copy Credential")

## Generating an Access Token

Once you have created credentials, you can view their details on the API page.  This token has a limited lifespan and will no longer work after a few hours.  Using this method, you will need to return to the page to generate another token after it has expired.

1. Click the arrow next to the credential name to display the credential details. It allows you to **Generate Access Token**.
2. Click **Generate Access Token** to continue. The Generated Access Token screen displays.

![Generate GreenLake  Access Token](/img/glcp_generate_token.png "Generate GreenLake Access Token")

3. Enter your **Client Secret** and click the **Create Access Token** button.
4. The **Access Token Created** screen displays your **Access Token**.
   **Note:** Since access tokens are not stored, HPE GreenLake recommends you make a copy of your access token and keep it in a safe location. 
5. Click the **Close** button when you are finished.

**Note:** This access token is referenced later as “<copy_access_token_here>” when demonstrating an API call.

![Copy GreenLake Access Token](/img/glcp_copy_token.png "Copy GreenLake Access Token")

### Resetting Your Client Secret

There may be a time when you want to reset your client secret for security purposes or if you did not copy the client secret. You can recreate it by using the Reset option. Resetting the client secret will invalidate all tokens associated with the Client ID and secret. 

1. Click the ellipsis next to the Generate Access Token button to reset your client secret.
2. Click the **Reset Client Secret** link. The client secret is deleted.

![Reset GreenLake Access Token](/img/glcp_reset_token.png "Reset GreenLake Access Token")

# How to use the access token

The user can embed the access token in the REST API request to perform the HTTP method against the desired Compute Ops Management resource to obtain the response. Note that the user must use the correct connectivity endpoint according to the region where Compute Ops Management is deployed. Currently, these are the connectivity endpoints for the possible regions:

* **EU Central** - <https://eu-central1-api.compute.cloud.hpe.com>
* **AP Northeast** - <https://ap-northeast1-api.compute.cloud.hpe.com>
* **US West** - <https://us-west2-api.compute.cloud.hpe.com>

![GreenLake API Endpoint](/img/glcp_endpoint.png "GreenLake API Endpoint")

The access token must be added to the header "Authorization: Bearer " for any REST API request.  The name “Bearer authentication” can be understood as “giving access to the bearer of this token.”  The following example uses the GET method for the resource servers to obtain a list of available servers.

## How to use the access token - cURL method

curl -X GET https://us-west2-api.compute.cloud.hpe.com/compute-ops/v1beta2/servers -H "Accept:application/json" -H "Authorization:Bearer <copy_access_token_here>”

Response - List of compute servers onboarded and assigned to the corresponding application for the user’s customer account

```json
{
   "offset":0,
   "count":1,
   "total":1,
   "items":[
      {
         "id":"P07595-B21+MXQ1140XVX",
         "type":"compute-ops/server",
         "platformFamily":null,
         "resourceUri":"/compute-ops/v1beta2/servers/P07595-B21+MXQ1140XVX",
         "name":"MXQ1140XVX",
         "createdAt":"2022-09-15T18:46:21.488619+00:00",
         "updatedAt":"2022-09-15T18:46:21.488619+00:00",
         "generation":1,
         "state":{
            "managed":true,
            "connected":false,
            "connectedModifiedAt":null,
            "subscriptionState":"REQUIRED",
            "subscriptionTier":null,
            "subscriptionExpiresAt":null
         }
      }
   ]
}
```

## How to use the access token - POSTMAN

To execute the REST API using the Postman tool, the access token needs to be copied to the Bearer Token section of the Authorization tab.

![GreenLake API Call with POSTMAN](/img/glcp_postman.png "GreenLake API Call with POSTMAN")

# Deleting Client Credentials

Deleting the client ID and secret will invalidate all tokens associated with the ID and secret.

1. Click the ellipsis next to the Generate Access Token button to delete your client credentials. 
2. Select the **Delete Credentials** link. 
   **Note:** If a user is deleted from HPE GreenLake, any tokens or client IDs generated and associated with any applications owned by this user will no longer be valid.

![Delete GreenLake Client Credential](/img/glcp_delete_cred.png "Delete GreenLake Client Credential")

This blog gives you an example of how to obtain the access token from HPE GreenLake and use it with the Compute Ops Management REST API. 
Please look at the blog on the Compute Ops Management REST API for the essential steps required to explore the API.