---
title: Using HPE GreenLake Console's API Gateway for Data Services Cloud Console
date: 2021-07-29T14:28:17.779Z
featuredBlog: false
priority: 1
author: Ron Dharma
authorimage: https://gravatar.com/avatar/8102f2adeef249065ccb9c43b8866d17?s=192
thumbnailimage: /img/dscc-icon.png
tags:
  - data-services-cloud-console
---
## Secured, Yet Agile

A major guiding principle in the creation of the Application Programming Interface (API) for Data Services Cloud Console (DSCC) from Hewlett Packard Enterprise (HPE) is security. However, to be able to be used by applications or tools that rely on the API to extend their features using DSCC, the API must also be flexible. To provide both security and flexibility, the DSCC REST API uses the 0Auth 2.0 authentication flow based on the client credential, which generates a limited lifetime access token. This access token is then embedded in the header of each REST API request as the authorization bearer.

This blog will walk through the essential steps required to exercise or experiment with the DSCC REST API.

### Authentication Process to Obtain the Access Token

The DSCC public API relies on an OAuth 2.0 third party authorization framework on behalf of the resource owner (HPE GreenLake Console's user) for security. The user starts by logging and authenticating into HPE GreenLake Console, which is authenticated by the Identity Provider (validated through username, password, or Multi Factor Authentication). Using the API gateway menu in GreenLake Console, a customer registers their client application to obtain the OAuth 2.0 API client credentials (client-id and client-secret). This association allows the user to obtain the access token from the menu, and user can then use the access token inside the token bearer field (header) with any REST API request. This action allows any client application or script to perform any API request to the correct instance of DSCC.

![client-credential application flow](/img/greenlake-api-access-flow.png "obtain client-id and client-secret")

The access token have a limited lifetime (about 720 seconds or 2 hours). Once it expires, the client application must use the obtained client-id and client-secret to generate a new access token. One indication of the expiration of access-token, the request to DSCC API will return response error: '401 Unauthorized HTTP.'  If the client application generates new access token prior to it expires, then the current access-token will be invalidated or treated as not authorized. 

Additionally, a user can also change the client-secret to update the authorization when the authorized user has lost the client-secret or the secret has been compromised. 

And lastly, when access to the API must be disabled, a user can delete the API client credential associated with client-id and client-secret in the API Gateway.

![Access API process](/img/user-guide-for-authorization.png "Process to authenticate and to obtain secure access ")

## Accessing the API Gateway Console

To access the API console, the user must log into the [HPE GreenLake Console,](https://common.cloud.hpe.com) have deployed the DSCC to the intended region, and onboarded a storage array (HPE Alletra, HPE Nimble, or HPE Primera) into the organization that is associated with the user account. The user must have the role that is required to perform the intended operation at the instance of DSCC where the storage is deployed. For instance, the user must have volume management capability in the Data Ops Management to create a storage volume in US region. For more information about the role based access control, please take a look at the [HPE GreenLake User Guide](https://support.hpe.com/hpesc/public/docDisplay?docId=ccs-help_en_us)

The API Gateway menu is available inside the Manage menu. From HPE Greenlake Console click on Menu to access this Manage Menu.

![Access Menu ](/img/accesing-manage-menu-from-console.png "Menu in Cloud Console")

![CCS Menu](/img/accesing-api-gateway-from-manage-menu.png "GreenLake Common Cloud Menu")

The API Gateway menu provides the following operations:

1. Create and manage API client credential association in order to obtain:

   1. Instance ID of the DSCC at the particular region (Hexadecimals).
   2. Client ID (Hexadecimals).
   3. Client Secret (Hexadecimals).
   4. URL to the HPE GreenLake Console API end-point (string).
   5. URL to the HPE DSCC API end-point (string).
2. Generate Access Token, change Client Secret, and delete Access Token.

![API Gateway](/img/api-gateway-block.png "DSCC API Gateway")

### Manage API Client Applications

Each instance of the API client credential represents the authorization relationship between the client application and the DSCC REST API end point. Click on the Create Credentials button to generate a client credential. Afterward the user can obtain the client secret and client secret, and used them to generate the access token.

![](/img/create-credentials-button.png)

Inside the Create Credentials menu, click on the V button to show the pull down list and use the mouse to click on the desired application. i.e. For storage select the Data Services Cloud Console. The list also show region where the applications is deployed.

![select the application](/img/select-the-desired-application.png "Choose application (DSCC)")

After selecting the correct application enter the Credential Name (Please see HPE GreenLake Cloud Console user guide for supported characters.) Click the Create Credentials button to proceed with Client Credentials creation.

![Create Credential no input yet](/img/create-credentials-menu.png "Generate Client Credentials 1st time")

Note that to create the credentials for the OAuth, you have to provide the application and the name of this credential. Select the Data Services Cloud Console Application on the appropriate region where the console are deployed for this organization.

Once the Create Credential is selected, the following information about the OAuth will be shown.

![](/img/api-client-credential-created.png "Credentials Created Close")

After closing the credential creation menu, user can observe the created API Client Credentials

![](/img/application-credential-created-prior-shown.png "API Client Credentials are created")

Clicking on the down arrow, user can generate the access token required to use the API.

![](/img/api-client-credential-get-access-token.png "Time to obtain the Access Token")

After clicking on the Generate Access Tokens button, the menu requires user to enter the Client Secret obtained from the API Client Credentials 

![](/img/generate-access-token-with-secret.png "Use the client secret to generate Access Token")

Copy the Access Token for the API usage.

![](/img/access-token-created-and-close.png "Access Token Generated and Consumed")

User then can embed the access token to the REST API request in order to perform the HTTP method against the desired resource in order to obtain the response.  Note that you will need to use the correct base-URL according to the region where the DSCC is deployed. Currently these are the base-URL and the corresponding region where the DSCC is deployed (November 2021)

| DSCC Region  | base-URL                       |
| ------------ | ------------------------------ |
| EU Central   | https://eu1.data.cloud.hpe.com |
| AP Northeast | https://jp1.data.cloud.hpe.com |
| US West      | https://us1.data.cloud.hpe.com |

#### Nice! Can you give me an example of using the access token?

The access token is a long string of JSON Web Token that is signed using RS256 algorithm. Note that the access-token must be added into the header of with key-word "Authorization: Bearer <access-token in JWT>". This following example based on **curl** uses "scalpha-app.qa.cds.hpe.com" as base-URL. Note that this is DSCC testing-site only, please use one of the base-URL noted in the above table. The example uses GET REST API method for this resource **/api/v1/audit-events** to obtain lists of the audit-events available.

```powershell
>curl -X GET https://scalpha-app.qa.cds.hpe.com/api/v1/audit-events 
-H "Accept: application/json" 
-H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IllUMU9MZWRYeDFCbHZ2and6OU1FNm8ya1BQayIsInBpLmF0bSI6ImRlejAifQ.eyJjbGllbnRfaWQiOiIwMGNmZmY3MC04NmFiLTRmNjYtODI0NS0xZWIwNTQ2MzljMzgiLCJpc3MiOiJodHRwczovL3Nzby5jb21tb24uY2xvdWQuaHBlLmNvbSIsImF1ZCI6ImV4dGVybmFsX2FwaSIsInN1YiI6InJvbmFsZC5kaGFybWFAaHBlLmNvbSIsInVzZXJfY3R4IjoiZThhNGRhMmVlZmMzMTFlYmEwMmNiNjAzNDIyYmMwYTAiLCJhdXRoX3NvdXJjZSI6ImNjc190b2tlbl9tYW5hZ2VtZW50IiwicGxhdGZvcm1fY3VzdG9tZXJfaWQiOiIyMzRkNzZjNmU5ZDAxMWViYjczMDgyYjIxMmFkNmZlYSIsImlhdCI6MTYzNzAwNjk0NSwiYXBwbGljYXRpb25faW5zdGFuY2VfaWQiOiIzYzE4YmQwMy04MzA2LTRjN2MtOTQyZS1jNzA0YTRiODc0NGMiLCJleHAiOjE2MzcwMTQxNDV9.gHcBzl0n2wwrMRR2tSbT6jHN68d1TSNT743GED3LuF2B08ABYh9ePKQjhqYW6mjY-oSfEW2BTfG7TfTzZj9MtQ2kJGmq3DvLBl6fAaN6MEkSIz54hu0PdmDW8His6oET2txq_0kp5XJ7T6n_QJzZY0xvSoquE-48gCxwGFPWIRwefIpdw_1URFXYgfdKCxCIDTdPfYKs8kD8hzwyF9uvgLgVPWZJD6b1UHJK5OpNnBOpAxrs1xfFBz688b0vheZdARCJsl5E3Qxjyg68hw2cjavZZOX-_RWpd6JWPrQnqxyxQeYQ5yYy7giVCViM5SUZkv6j0Ts3TVguapE2kvahkQ"
```

The responses are returned as JSON strings as shown in below example. Note that we can use more parameters to return particular events through some filtering. Please take a look at the [DSCC API documentation](https://console-us1.data.cloud.hpe.com/doc/api/v1/) for more information.

```javascript
{
  "items": [
    {
      "associatedResource": {
        "id": "/api/v1/host-initiators?filter=editStatus%20in%20(Update_In_Progress,Update_Success,Update_Failed,Not_Applicable,Delete_Failed)",
        "name": "",
        "type": ""
      },
      "code": "Unauthorized privilege",
      "contextId": "",
      "customerId": "e8a4da2eefc311eba02cb603422bc0a0",
      "id": "9bafe7ae-84bf-42a2-9b82-2592ce62715e",
      "loggedAt": "2021-11-10T04:09:07Z",
      "message": "Unauthorized user access",
      "occurredAt": "2021-11-10T04:09:07Z",
      "permission": "data-services.host-initiator.read",
      "scope": "",
      "source": "/api/v1/host-initiators?filter=editStatus%20in%20(Update_In_Progress,Update_Success,Update_Failed,Not_Applicable,Delete_Failed)",
      "sourceIpAddress": "fleet-gql-data-graph:4000",
      "state": "PermissionDenied",
      "taskId": "",
      "uniqueId": "audit.events+0+3936",
      "userEmail": "mandy.shen@hpe.com",
      "version": 1
    },
    {
      "associatedResource": {
        "id": "/api/v1/host-initiators?filter=editStatus%20in%20(Update_In_Progress,Update_Success,Update_Failed,Not_Applicable,Delete_Failed)",
        "name": "",
        "type": ""
      },
      "code": "Unauthorized privilege",
      "contextId": "",
      "customerId": "e8a4da2eefc311eba02cb603422bc0a0",
      "id": "f0d2c4c6-d859-42f3-ae4b-60f8d3d2d89d",
      "loggedAt": "2021-11-10T04:09:03Z",
      "message": "Unauthorized user access",
      "occurredAt": "2021-11-10T04:09:03Z",
      "permission": "data-services.host-initiator.read",
      "scope": "",
      "source": "/api/v1/host-initiators?filter=editStatus%20in%20(Update_In_Progress,Update_Success,Update_Failed,Not_Applicable,Delete_Failed)",
      "sourceIpAddress": "fleet-gql-data-graph:4000",
      "state": "PermissionDenied",
      "taskId": "",
      "uniqueId": "audit.events+2+3975",
      "userEmail": "mandy.shen@hpe.com",
      "version": 1
    },
    
    .... snippet ....
    
      {
      "associatedResource": {
        "id": "/api/v1/storage-systems/volumes?filter=isSystemVolume%20eq%20false\u0026limit=1\u0026offset=0",
        "name": "",
        "type": ""
      },
      "code": "Unauthorized privilege",
      "contextId": "",
      "customerId": "e8a4da2eefc311eba02cb603422bc0a0",
      "id": "86988487-f7f4-403e-b33e-e15abfcd568a",
      "loggedAt": "2021-08-19T15:38:49Z",
      "message": "Unauthorized user access",
      "occurredAt": "2021-08-19T15:38:49Z",
      "permission": "data-services.volume.read",
      "scope": "",
      "source": "/api/v1/storage-systems/volumes?filter=isSystemVolume%20eq%20false\u0026limit=1\u0026offset=0",
      "sourceIpAddress": "scalpha-app.qa.cds.hpe.com",
      "state": "PermissionDenied",
      "taskId": "",
      "uniqueId": "audit.events+6+3057",
      "userEmail": "matt.haron@hpe.com",
      "version": ""
    }
  ],
  "total": 123,
  "numItems": 123,
  "pageLimit": 500,
  "pageOffset": 0
}
```

The recommended tool at this moment of time to experiment with the REST API for DSCC is the Postman which is downloadable from the [Postman website](https://www.postman.com/downloads/). The postman is a versatile tool, where anyone can use copy the access token (or better to use the client-id and client-secret) from the API Gateway and issue a REST API request without typing a lot of code, test the parameters and format the responses.

So this blog is a great example on how to obtain the access-token and experiment with the DSCC API. Please take a look at the next blog on getting the access token programmatically to enable any client-application using any familiar programming or scripting language.