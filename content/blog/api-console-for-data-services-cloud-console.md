---
title: Using HPE GreenLake Console's API Gateway for Data Services Cloud Console
date: 2021-11-30T15:28:17.779Z
featuredBlog: false
priority: 7
author: Ron Dharma
authorimage: https://gravatar.com/avatar/8102f2adeef249065ccb9c43b8866d17?s=192
thumbnailimage: /img/dscc-icon.png
tags:
  - data-services-cloud-console
---
## Secured, Yet Agile

A major guiding principle in the creation of the Application Programming Interface (API) for Data Services Cloud Console from Hewlett Packard Enterprise (HPE) is security. However, to be able to be used by applications or tools that rely on the API to extend their features using the console, the API must also be flexible. To provide both security and flexibility, the console's REST API uses the 0Auth 2.0 authentication flow based on the client credential, which generates a limited lifetime access token. This access token is then embedded in the header of each REST API request as the authorization bearer.

This blog will walk through the essential steps required to exercise or experiment with the Data Services Cloud Console REST API.

### Authentication Process to Obtain the Access Token

The Data Services Cloud Console public API relies on an OAuth 2.0 third party authorization framework on behalf of the resource owner (HPE GreenLake's user) for security. The user starts by logging and authenticating into HPE GreenLake console, which is authenticated by the Identity Provider (validated through username, password, or Multi Factor Authentication). Using the API gateway menu in the HPE GreenLake, a customer registers their client application (REST API client) to obtain the OAuth 2.0 API client credentials (client id and client secret). This association allows the user to obtain the access token from the menu, and the user can then use the access token inside the token bearer field (header) with any REST API request. This action allows any client application or script to perform any API request to the correct instance of Data Services Cloud Console.

![client-credential application flow](/img/greenlake-api-access-flow.png "obtain client-id and client-secret")

The access token has a limited lifetime (about 7200 seconds or 2 hours). Once it expires, the client application must use the obtained client id and client secret to generate a new access token. One indication of the expiration of the access token, the request to console's API will return a response error: '401 Unauthorized HTTP.'  If the client application generates a new access token before the current one has expired, then the current access token will be invalidated or treated as not authorized. 

Additionally, a user can also change the client secret to update the authorization when the authorized client application has lost it's client secret, or when the client secret has been compromised. 

And lastly, when access to the console's REST API must be disabled, a user can delete the API client credential associated with client id and client secret in the API Gateway menu.

The following flow chart describes steps required to perform the console's REST API request. The flow starts from the GreenLake authorized user creating the client id and client secret to be used to obtain the access token. The access token will be used in the authorization bearer to ensure the secure REST API request. 

![Access API process](/img/user-guide-for-authorization.png "Process to authenticate and to obtain secure access ")

## Accessing the API Gateway Menu

To access the API gateway menu, the user must log into the [HPE GreenLake Console,](https://common.cloud.hpe.com) deployed the DSCC to the intended region, and onboarded a storage array (HPE Alletra, HPE Nimble, or HPE Primera) into the organization that is associated with the user account. The user must have the role that is required to perform the intended operation at the instance of DSCC where the storage has been deployed. For instance, the user must have volume management capability in the Data Ops Management to create a storage volume in US region. For more information about the role based access control, please take a look at the [HPE GreenLake User Guide](https://support.hpe.com/hpesc/public/docDisplay?docId=ccs-help_en_us)

The API Gateway menu is available inside the HPE GreenLake's Manage menu. From HPE Greenlake Console click on Menu to access this Manage Menu.

![Access Menu ](/img/accesing-manage-menu-from-console.png "Menu in Cloud Console")

![CCS Menu](/img/accesing-api-gateway-from-manage-menu.png "GreenLake Common Cloud Menu")

The API Gateway menu provides the following operations:

1. Creates and manages API client credential association in order to obtain:

   1. Instance ID of the DSCC at the particular region (Hexadecimals).
   2. Client ID (Hexadecimals).
   3. Client Secret (Hexadecimals).
   4. URL to the HPE GreenLake Console API end-point (string).
   5. URL to the HPE DSCC API end-point (string).
2. Generates access token, changes client secret, and deletes client credential.

![API Gateway Menu](/img/api-gateway-block.png "DSCC API Gateway Menu")

### Manages API client application

Each instance of API client credential represents the authorization relationship between the client application and the DSCC REST API resources. Please click on the Create Credentials button to generate a client credential. Afterwards, the user can obtain the client secret and client secret, and use them to generate the access token.

![API client credentials](/img/create-credentials-button.png "Create API Client Credentials")

Inside the Create Credentials menu, click on the V button to show the pull down list and use the mouse to click on the desired application. For the purpose of using the DSCC REST API, please select Data Services Cloud Console instance in the region where the array has been deployed. The list shows all instances with the regions where the applications are deployed.

![select the application](/img/select-the-desired-application.png "Choose application (DSCC)")

After selecting the correct application, enter the Credential Name (Please see [HPE GreenLake Cloud Console User Guide](https://support.hpe.com/hpesc/public/docDisplay?docId=ccs-help_en_us) for supported characters).  Click the Create Credentials button to proceed with Client Credentials creation.

![Create Credential no input yet](/img/create-credentials-menu.png "Generate Client Credentials 1st time")

Once the Create Credential button is clicked, the following information about the OAuth (Open Authorization) will be shown. These are the Client ID and Client Secret information menus that are going to be shown only once. Please copy both client id and client secret to a safely recorded location. In the case that the user missed copying this information, then the user can only regenerate the client secret at a later time using the Reset Client Secret menu.

![](/img/api-client-credential-created.png "Credentials Created Close")

After closing the credential creation menu, the user can observe the prior created API client credential by identifying the credential name on the menu.

![](/img/application-credential-created-prior-shown.png "API Client Credentials are created")

After clicking on the down arrow button, the user can see the Generate Access Token button in order to generate the access token required to be used for the DSCC REST API request. Please click on the Generate Access Token to generate an access token.

![](/img/api-client-credential-get-access-token.png "Time to obtain the Access Token")

After clicking on the Generate Access Token button, the Generate Access Token menu will appear. The menu requires the user to enter the client secret obtained from the associated API client credential. The user must copy and paste the recorded client secret from Credential Created menu (in the previous image in this blog) so that the user can obtain the access token. Click on the Create Access Token button to generate the access token.

![obtained from client credential.](/img/generate-access-token-with-secret.png "Use the client secret to generate Access Token")

The Access Token Created menu will appear and shows the generated access token. Copy the access token using using the "sheets" icon and store this access token to a safely recorded location. Click Close button to continue.

![](/img/access-token-created-and-close.png "Access Token Generated and Consumed")

Afterward, the user can embed the access token to the REST API request in order to perform the HTTP method against the desired resource in order to obtain the response.  Note that the user must use the correct base-URL according to the region where the DSCC is deployed. Currently these are the base-URL and the corresponding region where the DSCC is deployed (November 2021).

| DSCC Region  | base-URL                       |
| ------------ | ------------------------------ |
| EU Central   | https://eu1.data.cloud.hpe.com |
| AP Northeast | https://jp1.data.cloud.hpe.com |
| US West      | https://us1.data.cloud.hpe.com |

#### Oops! What if I missed to copy the client secret for this instance of client credential?

The client secret can be recreated inside the create credentials menu by clicking on the three dots at the bottom menu. Once the three dot menu opened, the user must click on the Reset Client Secret button to display the newly created client secret. This prior action will open the Credentials Created menu to show the new client secret for one time only. Note that user must copy this newly created secret to a secured location so that it can be used to generate new access token.

![Reset the client secret](/img/reset-the-client-secret-in-client-credential-menu.png "resetting the client secret")

#### Nice! Can you give me an example of using the access token?

The access token is a long string of JSON Web Token that is signed using RS256 algorithm. Note that the access token must be added into the header of with keyword "Authorization: Bearer <access token in JWT>" for any DSCC REST API request. This following example is based on ubiquitous cURL tool, and it uses "https://scalpha-app.qa.cds.hpe.com" as the base URL. Note that this base URL is the DSCC testing-site only. For your exercise, please use one of the base-URL noted in the above table. The following example of the DSCC REST API request uses GET method for this resource /api/v1/audit-events to obtain a list of the available audit-events. Note the additional parameter with keyword "Authorization: Bearer" is added into the header of this REST API request.

```shell
>curl -X GET https://scalpha-app.qa.cds.hpe.com/api/v1/audit-events 
-H "Accept: application/json" 
-H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IllUMU9MZWRYeDFCbHZ2and6OU1FNm8ya1BQayIsInBpLmF0bSI6ImRlejAifQ.eyJjbGllbnRfaWQiOiIwMGNmZmY3MC04NmFiLTRmNjYtODI0NS0xZWIwNTQ2MzljMzgiLCJpc3MiOiJodHRwczovL3Nzby5jb21tb24uY2xvdWQuaHBlLmNvbSIsImF1ZCI6ImV4dGVybmFsX2FwaSIsInN1YiI6InJvbmFsZC5kaGFybWFAaHBlLmNvbSIsInVzZXJfY3R4IjoiZThhNGRhMmVlZmMzMTFlYmEwMmNiNjAzNDIyYmMwYTAiLCJhdXRoX3NvdXJjZSI6ImNjc190b2tlbl9tYW5hZ2VtZW50IiwicGxhdGZvcm1fY3VzdG9tZXJfaWQiOiIyMzRkNzZjNmU5ZDAxMWViYjczMDgyYjIxMmFkNmZlYSIsImlhdCI6MTYzNzAwNjk0NSwiYXBwbGljYXRpb25faW5zdGFuY2VfaWQiOiIzYzE4YmQwMy04MzA2LTRjN2MtOTQyZS1jNzA0YTRiODc0NGMiLCJleHAiOjE2MzcwMTQxNDV9.gHcBzl0n2wwrMRR2tSbT6jHN68d1TSNT743GED3LuF2B08ABYh9ePKQjhqYW6mjY-oSfEW2BTfG7TfTzZj9MtQ2kJGmq3DvLBl6fAaN6MEkSIz54hu0PdmDW8His6oET2txq_0kp5XJ7T6n_QJzZY0xvSoquE-48gCxwGFPWIRwefIpdw_1URFXYgfdKCxCIDTdPfYKs8kD8hzwyF9uvgLgVPWZJD6b1UHJK5OpNnBOpAxrs1xfFBz688b0vheZdARCJsl5E3Qxjyg68hw2cjavZZOX-_RWpd6JWPrQnqxyxQeYQ5yYy7giVCViM5SUZkv6j0Ts3TVguapE2kvahkQ"
```

The response is returned in the form of JSON string, as shown in the below example. Note that, the user can use additional parameter of the REST API Get audit-events to filter particular events. Please take a look at the [DSCC API documentation](https://console-us1.data.cloud.hpe.com/doc/api/v1/) for more information on additional parameters that are available for /api/v1/audit-events resource.

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

The recommended tool at this moment of time to experiment with the REST API for DSCC is the Postman which is downloadable from the [Postman website](https://www.postman.com/downloads/). The postman is a versatile tool, that anyone can copy the access token (or better to use the client id and client secret) from the API Gateway menu and issue a REST API request without using programming language. Furthermore, user can also test the parameters and format the responses of each REST API request using the Postman tool.

In conclusion, this blog gives you a great example on how to obtain the access token and experiment with the DSCC REST API. Please take a look at the next blog on getting the access token programmatically to enable any client application using any familiar tool like Postman, use a programming, or a scripting language.