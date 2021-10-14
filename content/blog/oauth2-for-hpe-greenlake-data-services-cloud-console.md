---
title: Oauth2 for HPE GreenLake Data Services Cloud Console
date: 2021-10-14T12:46:19.488Z
author: Ron Dharma
authorimage: /img/face-portrait-small.jpg
thumbnailimage: /img/dscc-icon-transparent.png
---
The top principle for public (Northbound) API to HPE GreenLake and Data Services Cloud Console is *secure interface that support authentication and authorization of the resource owner.* To support the previously mentioned principle, the HPE GreenLake implements the Oauth2 authorization granting the resource owner authorization rights without embedding the resource owner's user credential as in the API streams. This goal is achieved using the Oauth2 authorization and REST API, where every API call will embed the Access Token as part of the HTTP REST API URL stream using the keyword: *bearer*.

At the introduction of this public API, HPE GreenLake supports the **Client Credential authentication grant** type (a.k.a OAuth 2 authentication workflow.) This particular grant type allows the client application to authenticate using separate credentials (Client ID and Client Password) that is authorized using the Resource Owner's credential (User's Email and Password). 

The impact of this method of OAuth authentication workflow:

1. No