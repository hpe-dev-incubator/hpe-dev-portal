---
title: Using API Gateway for Data Services Cloud Console
date: 2021-07-29T14:28:17.779Z
featuredBlog: false
priority: 1
author: Ron Dharma
authorimage: /img/dscc-icon.png
thumbnailimage: ""
tags:
  - data-services-cloud-console
---
## Authentication Process to Obtain the Access Token

The Data Services Cloud Console public API relies on an OAuth 2.0 third party authorization framework on behalf of the resource owner (DSCC user) for security. The user starts by authenticating into HPE GreenLake, which is accommodated by the Identity Provider (validated by username, password, MFA or SSO). Using the API Gateway menu in HPE GreenLake, customer registers their application to obtain the OAuth 2.0 API client credentials. This association allows user to obtain the access token.

The access token have a limited lifetime (about 720 seconds or 2 hours). Once it expires, the application must use the refresh API token and the refresh API to obtain the valid access tokens

![Access API process](/img/api-access-token-complete-path.png "Process to authenticate and to obtain secure access ")

## Accessing the API Gateway Console

To access the API console, user must login into the [GreenLake Common Cloud](https:\common.cloud.hpe.com), and deployed the Data Services Common Cloud Console Application into the organization that is associated with the user account. The **API** **Gateway** menu is available inside **Manage Account** menu.

![CCS Menu](/img/how-to-get-to-api-gateway.png "GreenLake Common Cloud Menu")

The API Gateway provides the following operations:

1. Manage API client applications.
2. Manage access tokens for applications.
3. Link to API documentation. 

![API Gateway](/img/dscc-api-gateway.png "DSCC API Gateway")

### Manage API client Applications

Each of the API client Applications Connection creates the relationship between the client and server (application).

![](/img/generate-apis-pairs.png)

Given that there is no client applications created, user will press the generate the client credentials for 1st time.

![Create Credential no input yet](/img/create-credential-prior.png "Generate Client Credentials 1st time")

Note that to create the credentials for the OAuth, you have to provide the application and the name of this credential. Select the Data Services Cloud Console Application on the appropriate region where the console are deployed for this organization.

![Select Application and Enter the name of this credentials](/img/create-credential-filled.png "Complete Credential and applications")

Once the Create Credential is selected, the following information about the OAuth will be shown.

![](/img/api-client-credential-created.png "Credentials Created Close")

After closing the credential creation menu, user can observe the created API Client Credentials

![](/img/application-credential-created-prior-shown.png "API Client Credentials are created")

Clicking on the down arrow, user can generate the access token required to use the API.

![](/img/api-client-credential-get-access-token.png "Time to obtain the Access Token")

Access token will then can be obtained

![](/img/create-credential-prior.png "New Menu to Generate Access Token")

New menu

![](/img/generate-access-token-with-secret.png "Use the client secret to generate Access Token")

Copy the Access Token for the API usage.

![](/img/access-token-created-and-close.png "Access Token Generated and Consumed")