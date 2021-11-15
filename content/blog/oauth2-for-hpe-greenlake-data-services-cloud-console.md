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

The major principle for public (Northbound) API to HPE GreenLake and Data Services Cloud Console is *secured interface that support authentication and authorization of the resource owner.* To support the previously mentioned principle, the HPE GreenLake implements the Oauth2 authorization granting the resource owner authorization rights without embedding the resource owner's user credential as in the API streams. This goal is achieved using the Oauth2 authorization and REST API, where every API call will embed the access token as part of the HTTP REST API URL stream using the keyword: *bearer*.

At the introduction of this public API, HPE GreenLake Console supports the **Client Credential authentication grant** **type** (a.k.a. OAuth 2 client-credential authentication workflow.) This particular grant type allows the client application to authenticate using separate credentials (Client ID and Client Password) that is authorized inside the API Gateway menu using the HPE GreenLake User's Email and Password.

**Some of the benefits of DSCC Client Credential OAuth authentication grant:**

1. The authentication for Client does not involve the transmission of the HPE GreenLake user credentials.
2. Changing the *Client Secret* or deleting the *Client ID* will not impact HPE GreenLake user credentials.
3. According to OAuth 2.0 [https://tools.ietf.org/html/rfc6749#section-4.4](https://datatracker.ietf.org/doc/html/rfc6749#section-4.4), Client Credential grant type allows the client Application to authenticate by itself independent of user (no user intervention) which makes this grant type appropriate for machine-to-machine (M2M) application that can safely protect the registered client credentials (confidential clients) such as scripts, daemon, or services contained in a host. Please refer to this [](https://tools.ietf.org/html/rfc6749#section-2.1)<https://tools.ietf.org/html/rfc6749#section-2.1> for more information.
4. Each client application uses different set of client ID and client secret to ensure secrecy and independency of each applications.

### How do I implement HPE DSCC API in my client application or my script?

This blog will go through example of client-application using the client-id, client-secret, DSCC API definition in yaml and Postman. The flow to get the Client ID and Client Secret from this menu is detailed in my blog titled **Using API Gateway to Data Services Cloud Console.** Note that client-id and client secret are shown only one time during the API credential creation.

![image of the client id and client secret](/img/credentials-created-client.png "Client Credentials")

The user owner who generate this client-id and client-secret pair must store them and transfer them securely to the designated client (application or scripts) to issue the REST API request to the resources in the DSCC in order to achieve the customer's outcome. The client application access to the DSCC resources depends on the authorization or RBAC of the user owner.

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

```bash
curl -X POST https://sso.common.cloud.hpe.com/as/token.oauth2 -H         
"Content-Type: application/x-www-form-urlencoded"         
-d "grant_type=client_credentials&client_id=$YOUR_CLIENT_ID&client_secret=$YOUR_CLIENT_SECRET"
```

The following snippet show the example of code using python to obtain the access token. The same as previous code snippet, YOUR_CLIENT_ID and YOUR_CLIENT_SECRET variables must be substituted accordingly.

```py
from oauthlib.oauth2 import BackendApplicationClient       
from requests.auth import HTTPBasicAuth       
from requests_oauthlib import OAuth2Session       

client = BackendApplicationClient(YOUR_CLIENT_ID)       
     
oauth = OAuth2Session(client=client)       
auth = HTTPBasicAuth(YOUR_CLIENT_ID, YOUR_CLIENT_SECRET)       
      
token = oauth.fetch_token(token_url='https://sso.common.cloud.hpe.com/as/token.oauth2', auth=auth)       
print(token["access_token"])
```

The access token contains the information in JWT form that is self-contained, securely encoded, and signed using RS256. 

```http
eyJhbGciOiJSUzI1NiIsImtpZCI6IjFvVEFmay1UOTZ1ZDd5cDBZTGlYM1ROSWdDWSIsInBpLmF0bSI6ImRlejAifQ.eyJjbGllbnRfaWQiOiIwMGNmZmY3MC04NmFiLTRmNjYtODI0NS0xZWIwNTQ2MzljMzgiLCJpc3MiOiJodHRwczovL3Nzby5jb21tb24uY2xvdWQuaHBlLmNvbSIsImF1ZCI6ImV4dGVybmFsX2FwaSIsInN1YiI6InJvbmFsZC5kaGFybWFAaHBlLmNvbSIsInVzZXJfY3R4IjoiZThhNGRhMmVlZmMzMTFlYmEwMmNiNjAzNDIyYmMwYTAiLCJhdXRoX3NvdXJjZSI6ImNjc190b2tlbl9tYW5hZ2VtZW50IiwicGxhdGZvcm1fY3VzdG9tZXJfaWQiOiIyMzRkNzZjNmU5ZDAxMWViYjczMDgyYjIxMmFkNmZlYSIsImlhdCI6MTYzNDc3OTIwNiwiYXBwbGljYXRpb25faW5zdGFuY2VfaWQiOiIzYzE4YmQwMy04MzA2LTRjN2MtOTQyZS1jNzA0YTRiODc0NGMiLCJleHAiOjE2MzQ3ODY0MDZ9.sz7GHvCdO_NjPgVt5rz7JHRSegZWD0pimNqiw7s_SC9vB2XsQnSEP71Kh1y3SqQxkKF8AgbJ02iEZYsk-GO-JmufGfeIUbl2idrFlfXPiKsKftn35dHO-uHW8s4KwL7mUF_HiPxUPIsixQ1zS_88-qdUGzAWDjcR0JO2gKnkaWeQ_AUGzdDw09ZSYZG3sxIoqU_HNjLF1c8hJmVV9Q6IN1ItKAspECc_UYTnjUBrZz5mpupDxuLIMJytTFUFwCriphi9cXQCTyQ3TXW_EALtRq_KdLEe311WFMX9mAL87zXP2JNc8bf8CTiiAty5eCjM2wxrPK9-ep0i5J5v6kJW_Q
```

Some of the information inside the JWT details the client-id, auth-source, and many others including time of expiration.

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



#### Well, I am not a developer. but how can I  explore this DSCC API?