---
title: Oauth2 for Client Application of HPE DSCC
date: 2021-10-14T12:46:19.488Z
author: Ron Dharma
authorimage: /img/face-portrait-small.jpg
thumbnailimage: /img/dscc-icon-transparent.png
tags:
  - data-services-cloud-console
---
## HPE GreenLake API Security

The major principle for public (Northbound) API to HPE GreenLake and Data Services Cloud Console is *secure interface that support authentication and authorization of the resource owner.* To support the previously mentioned principle, the HPE GreenLake implements the Oauth2 authorization granting the resource owner authorization rights without embedding the resource owner's user credential as in the API streams. This goal is achieved using the Oauth2 authorization and REST API, where every API call will embed the Access Token as part of the HTTP REST API URL stream using the keyword: *bearer*.

At the introduction of this public API, HPE GreenLake supports the **Client Credential authentication grant** **type** (a.k.a. OAuth 2 client credential authentication workflow.) This particular grant type allows the client application to authenticate using separate credentials (Client ID and Client Password) that is authorized inside the API Gateway menu using the HPE GreenLake User's Email and Password.

**The impact of Client Credential OAuth authentication grant:**

1. The authentication for Client does not involve the transmission of the HPE GreenLake user credentials.
2. Changing the *Client Password* or deleting the *Client ID* will not impact HPE GreenLake user credentials.
3. According to OAuth 2.0 [tools.ietf.org/html/rfc6749#section-4.4](tools.ietf.org/html/rfc6749#section-4.4) Client Credential grant type allows the client Application to authenticate by itself independent of user (no user intervention) which makes this grant type appropriate for machine-to-machine (M2M) application that can safely protect the registered client credentials (Confidential Clients) such as scripts, daemon, or services contained in a host. Please refer to this [](https://tools.ietf.org/html/rfc6749#section-2.1)<https://tools.ietf.org/html/rfc6749#section-2.1> for more information.

### Hmmm, how do I implement the API in client application?

After user obtains the Client ID and Client Password which is detailed in my article titled **Using API Gateway to Data Services Cloud Console** as shown in this picture:

![image of the client id and client secret](/img/credentials-created-client.png "Client Credentials")

The User Owner who generate this Client-ID and Client-Secret Pair must store them and transfer them securely to the designated client (application or scripts) to consume the resources in the GreenLake Cloud Console in order to achieve the customer's outcome. 

For the client to perform the API to the HPE DSCC, the application must obtain the access token from HPE GreenLake Console as described in below diagram. 

![Diagram for client credential ](/img/client-credential-access-token.png "Client Credential")

The method required to obtain the access token is described in the following HTTPs request.