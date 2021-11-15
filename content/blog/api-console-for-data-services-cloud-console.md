---
title: Using HPE GreenLake Console's API Gateway for Data Services Cloud Console
date: 2021-07-29T14:28:17.779Z
featuredBlog: false
priority: 1
author: Ron Dharma
authorimage: /img/dscc-icon.png
thumbnailimage: ""
tags:
  - data-services-cloud-console
---
## Secured yet Agile

One major principle of Application Programming Interface (API) for the HPE Data Services Cloud Console (DSCC) is secured, but also flexible for consumption of multiple applications or tools that use this API to extend their function using the DSCC. One of many features for the delegated authorization below includes the ability to provide access to the API resources inside the DSCC (such as volumes, arrays, etc.) without embedding the user's credential (username, and password) in the API communication stream.

### Authentication Process to Obtain the Access Token

The DSCC public API relies on an OAuth 2.0 third party authorization framework on behalf of the resource owner (HPE GreenLake Console's user) for security. The user starts by logging and authenticating into HPE GreenLake Console, which is authenticated by the Identity Provider (validated through username, password, or MFA). Using the API Gateway menu in GreenLake Console, customer registers their client application to obtain the OAuth 2.0 API Client Credentials (Client ID and Client Secret). This association allows user to obtain the access-token from the menu, and user can then use the access-token into any REST API call inside the token bearer field. This action allows any client application or script to perform any HTTPS method to 

![](/img/greenlake-api-access-flow.png)

The Access Token have a limited lifetime (about 720 seconds or 2 hours). Once it expires, the client application must use the obtained Client ID and Client Secret to obtain a new Access Token. One indication of the expiration of Access Token, the API will return response Error: '401 Unauthorized HTTP.'  If the user generate new Access Token prior to it expires, then the current Access Token will be invalidated or treated as not Authorized. 

Additionally, user can also change the Client Secret to update the authorization when authorized user lost the Client Secret or the secret is compromised. And lastly, when access to the API must be disabled, user can delete the application association in the API Gateway.

![Access API process](/img/user-guide-for-authorization.png "Process to authenticate and to obtain secure access ")

## Accessing the API Gateway Console

To access the API console, user must login into the [GreenLake Common Cloud](https:\common.cloud.hpe.com), deployed the Data Services Common Cloud Console Application, and onboarded a Storage Array (Alletra, Nimble and Primera) into the organization that is associated with the user account. The user must have the role that is required to perform the intended operation at the instance of DSCC where the storage is deployed. e.g. User must have volume management capability in the Data Ops Management to create a storage volume in US West. 

The **API** **Gateway** menu is available inside **Manage** menu. From **Cloud Console** click on **Menu** to access this **Manage** Menu.

![Access Menu ](/img/accesing-manage-menu-from-console.png "Menu in Cloud Console")

![CCS Menu](/img/accesing-api-gateway-from-manage-menu.png "GreenLake Common Cloud Menu")

The API Gateway provides the following operations:

1. Create and manage API client applications association to obtain:

   1. Instance ID of the DSCC at the particular region (Hexadecimals)
   2. Client ID (Hexadecimals)
   3. Client Secret (Hexadecimals)
   4. URL to the HPE GreenLake Cloud Console end-point (string)
   5. URL to the HPE DSCC end-point (string)
2. Generate Access Token, change Client Secret, and delete Access Token.

![API Gateway](/img/api-gateway-block.png "DSCC API Gateway")

### Manage API Client Applications

Each of the API client Applications Connection creates the relationship between the client and server (application). Click on the **Create Credentials** button to generate a client credential to generate the Access Token.

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

User then can embed the access token to the REST API request in order to perform the HTTP method against the desired resource in order to obtain the response.  

### Nice! Can you give me an example of using the access token?

The recommended tool at this moment of time to experiment with the REST API for DSCC is the Postman which is downloadable from the [Postman website](https://www.postman.com/downloads/). The postman is a versatile tool, where we can copy the access token that we obtained and issue a REST API request in simple and format the response beautifully. 

In this particular exercise, we will be using the standard REST API request mode with authority of token bearer