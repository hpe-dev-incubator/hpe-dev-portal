---
title: Oauth2 for HPE GreenLake Data Services Cloud Console
date: 2021-10-14T12:46:19.488Z
author: Ron Dharma
authorimage: /img/face-portrait-small.jpg
thumbnailimage: /img/dscc-icon-transparent.png
---
The top principle for public (Northbound) API to HPE GreenLake and Data Services Cloud Console is *secured interface that support authentication and authorization of the resource owner.* To support the aforementioned principle, the HPE GreenLake implements the Oauth2 authorization that represent the resource owner authorization rights without embedding the resource owner's user credential as in the API streams. Using the Oauth2 authorization and REST API, every API call will embed the Access Token as part of the HTTP REST API call using the keyword: *bearer*.