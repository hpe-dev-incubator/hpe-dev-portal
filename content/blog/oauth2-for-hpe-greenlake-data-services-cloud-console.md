---
title: "Implementing OAuth 2 Flow for Data Services Cloud Console's Client
  Application "
date: 2021-10-14T12:46:19.488Z
author: Ron Dharma
authorimage: /img/face-portrait-small.jpg
thumbnailimage: /img/dscc-icon-transparent.png
tags:
  - data-services-cloud-console
---
## HPE GreenLake API Security

At the introduction of this public API in this [blog](https://deploy-preview-707--hpe-dev-portal.netlify.app/blog/api-console-for-data-services-cloud-console/) **(Using HPE GreenLake Console's API Gateway for Data Services Cloud Console)**, I introduce that HPE GreenLake Console supports the Client-Credential authentication grant type (a.k.a. OAuth 2 client-credential authentication workflow.) This particular grant type allows the client application to authenticate using separate credentials (client-ID and client-secret) that is authorized inside the API Gateway menu using the HPE GreenLake User account (Resource Owner)

**Some of the benefits of DSCC Client Credential OAuth authentication grant:**

1. The authentication for Client does not involve the transmission of the HPE GreenLake user credentials.
2. Changing the Client Secret or deleting the Client ID will not impact HPE GreenLake user credentials.
3. According to OAuth 2.0 [https://tools.ietf.org/html/rfc6749#section-4.4](https://datatracker.ietf.org/doc/html/rfc6749#section-4.4), Client Credential grant type allows the client Application to authenticate by itself independent of user (no user intervention) which makes this grant type appropriate for machine-to-machine (M2M) application that can safely protect the registered client credentials (confidential clients) such as scripts, daemon, or services contained in a host. Please refer to this [](https://tools.ietf.org/html/rfc6749#section-2.1)<https://tools.ietf.org/html/rfc6749#section-2.1> for more information.
4. Each client application uses different set of client ID and client secret to ensure secrecy and independency of each client applications.

### How do I implement HPE DSCC API in my client application or my script?

This blog will go through example of setting up the client-application using the client-id, client-secret, DSCC API definition in yaml, and the Postman tool. The flow to get the client-id and client-secret from this menu is detailed in my blog titled **Using HPE GreenLake Console's API Gateway to Data Services Cloud Console.** Note that client-id and client secret are shown only one time during the API credential creation; hence it need to be securely recorded.

![image of the client id and client secret](/img/credentials-created-client.png "Client Credentials")

The user owner who generate this client-id and client-secret pair must store them and transfer them securely to the designated client (application or scripts) to issue the REST API request to the resources in the DSCC to achieve the customer's outcome. The client application access to the DSCC resources depends on the authorization or RBAC of the user owner.

For the client application to perform the API to the HPE DSCC, the application must obtain the access token from HPE GreenLake Console as described in below diagram. The end-point **https://sso.common.cloud.hpe.com/as/token.oauth2** provides access token in the response of the authentication request from any client application.

![Diagram for client credential ](/img/client-credential-access-token.png "Client Credential")

The method required to obtain the access token is described in the following HTTPs request as shown in this snippet of HTTP strings. 

```md
HTTP method: 
POST

URL: 
https://sso.common.cloud.hpe.com/as/token.oauth2 

Headers:
Content-Type: application/x-www-form-urlencoded

Body:
grant_type=client_credentials
&client_id=xxxxxxxxxx
&client_secret=xxxxxxxxxx
```

The following show the example of code snippet using curl to obtain the access token. The variables of the $YOUR_CLIENT_ID and $YOUR_CLIENT_SECRET will be substituted with the client id and client secret from the above menu.

```shell
curl -X POST https://sso.common.cloud.hpe.com/as/token.oauth2 -H         
"Content-Type: application/x-www-form-urlencoded"         
-d "grant_type=client_credentials&client_id=$YOUR_CLIENT_ID&client_secret=$YOUR_CLIENT_SECRET"
```

The following snippet show the example of code using python to obtain the access token. The same as previous code snippet, YOUR_CLIENT_ID and YOUR_CLIENT_SECRET variables must be substituted accordingly.

```python
from oauthlib.oauth2 import BackendApplicationClient       
from requests.auth import HTTPBasicAuth       
from requests_oauthlib import OAuth2Session       

client = BackendApplicationClient(YOUR_CLIENT_ID)       
     
oauth = OAuth2Session(client=client)       
auth = HTTPBasicAuth(YOUR_CLIENT_ID, YOUR_CLIENT_SECRET)       
      
token = oauth.fetch_token(token_url='https://sso.common.cloud.hpe.com/as/token.oauth2', auth=auth)       
print(token["access_token"])
```

Another snippet below shows the PowerShell code to obtain the access token accordingly. In this snippet, client application will need to replace the client_id and client_secret.

```powershell
$AuthUri = "https://sso.common.cloud.hpe.com/as/token.oauth2"
 [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
 $AuthHeaders = @{ 'Content-Type' = 'application/x-www-form-urlencoded' }
 $AuthBody    = [ordered]@{  'grant_type' = 'client_credentials',
                             'client_id' = {Insert Client ID Here},
                             'client_secret' = {Insert Client Secret Here } }   
 (invoke-restmethod -uri "$AuthURI" -Method Post -headers $AuthHeaders -body $MyBody).access_token
```

The access token contains the information in JWT format that is self-contained, securely encoded, and signed using RS256. The access-token is designed to enable secure transmission between the client application and the REST API server with limited lifetime (2 hours).

```http
eyJhbGciOiJSUzI1NiIsImtpZCI6IjFvVEFmay1UOTZ1ZDd5cDBZTGlYM1ROSWdDWSIsInBpLmF0bSI6ImRlejAifQ.eyJjbGllbnRfaWQiOiIwMGNmZmY3MC04NmFiLTRmNjYtODI0NS0xZWIwNTQ2MzljMzgiLCJpc3MiOiJodHRwczovL3Nzby5jb21tb24uY2xvdWQuaHBlLmNvbSIsImF1ZCI6ImV4dGVybmFsX2FwaSIsInN1YiI6InJvbmFsZC5kaGFybWFAaHBlLmNvbSIsInVzZXJfY3R4IjoiZThhNGRhMmVlZmMzMTFlYmEwMmNiNjAzNDIyYmMwYTAiLCJhdXRoX3NvdXJjZSI6ImNjc190b2tlbl9tYW5hZ2VtZW50IiwicGxhdGZvcm1fY3VzdG9tZXJfaWQiOiIyMzRkNzZjNmU5ZDAxMWViYjczMDgyYjIxMmFkNmZlYSIsImlhdCI6MTYzNDc3OTIwNiwiYXBwbGljYXRpb25faW5zdGFuY2VfaWQiOiIzYzE4YmQwMy04MzA2LTRjN2MtOTQyZS1jNzA0YTRiODc0NGMiLCJleHAiOjE2MzQ3ODY0MDZ9.sz7GHvCdO_NjPgVt5rz7JHRSegZWD0pimNqiw7s_SC9vB2XsQnSEP71Kh1y3SqQxkKF8AgbJ02iEZYsk-GO-JmufGfeIUbl2idrFlfXPiKsKftn35dHO-uHW8s4KwL7mUF_HiPxUPIsixQ1zS_88-qdUGzAWDjcR0JO2gKnkaWeQ_AUGzdDw09ZSYZG3sxIoqU_HNjLF1c8hJmVV9Q6IN1ItKAspECc_UYTnjUBrZz5mpupDxuLIMJytTFUFwCriphi9cXQCTyQ3TXW_EALtRq_KdLEe311WFMX9mAL87zXP2JNc8bf8CTiiAty5eCjM2wxrPK9-ep0i5J5v6kJW_Q
```

Some of the information inside the JWT details the client-id, source of authentication, and many others including time of expiration. 

```json
{
  "client_id": "00cfff70-86ab-4f66-8245-1eb054639c38",
  "iss": "https://sso.common.cloud.hpe.com",
  "aud": "external_api",
  "sub": "xxxxxxxxxxxxxx@hpe.com",
  "user_ctx": "e8a4da2eefc311eba02cb603422bc0a0",
  "auth_source": "ccs_token_management",
  "platform_customer_id": "234d76c6e9d011ebb73082b212ad6fea",
  "iat": 1634779206,
  "application_instance_id": "3c18bd03-8306-4c7c-942e-c704a4b8744c",
  "exp": 1634786406
}
```

#### I don't know any programming language; nevertheless, how can I explore this DSCC API?

Postman is the well known tool to explore REST API that provides flexibility to import the API, automate the access-token retrieval and experiment with the parameters. The Postman provides this capability with a lot less of typing and knowledge of programming language. To start experiment with Postman, the recommendation is to download the application based rather than web based. This is the **[download link](https://www.postman.com/downloads/)** for the Postman app  which is available in either Microsoft Windows and Macintosh MacOS version. Install the application on the workstation that has access to internet via website browser (HTTPS) and allowed to connect to https://*.cloud.hpe.com

Start by downloading the storage-api.yaml OpenAPI 3.0 definition into the workstation. Anyone can go the DSCC API documentation website through this link: <https://console-us1.data.cloud.hpe.com/doc/api/v1/>

Postman provides the ability to create a workspace where one can experiment with the HPE DSCC OpenAPI by importing the storage-api.yaml into the API library. The process started by selecting the Workspaces menu, click on Create Workspace button and type in the desired workspace name. In this example, it's called HPE DSCC API

![Create Workspace](/img/postman-create-workspace.png "Create the workspace in the Postman")

Inside this new workspace we will need to create environment variable called {baseUrl} that represents the URL toward the DSCC API that depends on region. This is the current list of the URL based on the region as of November 2021:

| DSCC Region  | base-URL                       |
| ------------ | ------------------------------ |
| EU Central   | https://eu1.data.cloud.hpe.com |
| AP Northeast | https://jp1.data.cloud.hpe.com |
| US West      | https://us1.data.cloud.hpe.com |

In this example, baseURL points to a developer's instance of DSCC which must be replaced with any of the base-Url that match the region where it's deployed based on the above table.  For any activities to issue the DSCC API request,  configure the environment context to "DSCC testing" under the HPE DSCC API workspace, and this environment contains the expanded value of the variable of {baseUrl}.

![Set Enviroment](/img/postman-create-environment-variable.png "Set baseUrl under this environment under the workspace")

Afterward, the time comes for importing the API definition into this workspace. Note that we are importing the storage-api.yaml rather than JSON; nevertheless, Postman can recognize the DSCC API in either format. To save the time for importing, you can un-check create documentation button. If need be, the documentation can be created after the importing.

![Select upload files to import API](/img/postman-import-api.png "Upload API definition")

Select the DSCC API definition in yaml format, that was downloaded from the [HPE DSCC API documentation](https://console-us1.data.cloud.hpe.com/doc/api/v1/) by clicking on the "Download YAML" button as shown below

![Download the API definition](/img/download-dscc-api-definition.png "Save the API definition")

Once the API definition completes the import, Postman recognize the fact that it's an OpenAPI 3.0 definition and build the API library automatically.

![Confirmation of the API Definition Import](/img/postman-import-load.png "OpenAPI 3.0 Confirmation")

As the result of the upload of the DSCC API, Postman can then the API definition under the Postment API menu as shown in below picture. Note that Postman validate that DSCC API definition doesn't have any issues as shown in the bottom of the picture.

![DSCC API loaded](/img/postman-api-loaded.png "DSCC API definition loaded")

After the API is loaded, we can then use the automation for obtaining that access token that is facilitated by Postman. To start the OAuth2 automation, select the Collections menu and display the rest of the API listing under the tree. At top of the tree we will initialize the authorization with correct parameters such as the client-id, client-secret, DSCC OAuth2 end-point, and other required parameters. With this setup, any API that inherit the authorization from the top of tree will be able to populate their header for REST API request with access token as the token bearer. Below display the configuration that is populated with the required parameters under the authorization menu.

1. **Type** = OAuth 2.0
2. **Add auth data to** = Request Headers
3. **Token Name** = <Strings>
4. **Grant Type** = Client Credentials
5. **Access Token URL** = https://sso.common.cloud.hpe.com/as/token.oauth2
6. **Client ID** = obtained from the client credential creation in API Gateway
7. **Client Secret** = obtained from the client credentil creation in API Gateway (The pair to the Client ID)
8. **Client Authentication** = Send client credentials in body

Click on the "Get New Access Token" button to obtain the valid access-token 

![]()

![]()

![]()