---
title: HPE GreenLake edge-to-cloud platform scripting fundamentals
date: 2024-01-10T09:51:57.270Z
author: Didier Lalli
authorimage: /img/didier-lalli.png
disable: false
---
## What are the HPE GreenLake edge-to-cloud platform APIs  

The foundational APIs for common HPE GreenLake  platform services allow IT administrators and IT operators to programmatically operate and manage users and resources in an HPE GreenLake platform’s workspace.   

This set of APIs for common platform services includes API for workspace management, identity and access management, device and subscription, locations, audit logs, and wellness.   

Note: The [HPE Greenlake platform documentation](https://developer.greenlake.hpe.com/docs/greenlake/services/) for these APIs leverages OpenAPI specifications and associated reference material. The documentation provides a complete explanation of the operations supported by these APIs for common HPE GreenLake platform services, as well as sample requests and responses.   

 The following blog posts are an excellent way to learn more about the APIs using Postman. 

* URL Blog Denis Part 1 
* URL Blog Denis Part 2 

In this blog post here, I will explore the usage of the HPE GreenLake platform API one step further by using the APIs to build automation scripts or custom integrations. To develop my script, I will use bash, python and PowerShell. 

## Let’s pick a use case  

Let’s say I’d like to check  what is in my audit log at regular intervals in order to keep an eye on my HPE GreenLake workspace. The following graphics explain what I will be doing: 

Picture

For reference, I can also check the content of this audit log in the HPE GreenLake console, under the Manage Workspace tab. 

Picture

*Figure 1: Audit log in HPE GreenLake platform console* 

## High-level algorithm 

Let’s look at the steps necessary to accomplish this. 

1. Gather details about the API access  
2. Get an API access/session token 
3. Compute date for filtering events 
4. Call audit log API 
5. Extract data and print results 
6. Wait a bit and go to Step 3 

## Give me a token, my friend!  

The HPE GreenLake platform console provides a way to create an API access that will deliver a Client ID and a Client Secret, which, in turn, I am going to use to generate a session token.  

> Note: To learn how to create API credentials for HPE GreenLake platform APIS, check out the [Generate and Reset application credentials documentation](https://developer.greenlake.hpe.com/docs/greenlake/guides/#generate-or-reset-application-credentials).  

My script will prompt for these two values (client_id and client_secret) and will make sure that client_secret is never printed anywhere. Because these values are quite long, I will also test the presence of the operating system’s environment variables CLIENTID and CLIENTSECRET. If present, I will use their values and not prompt the user. 

 From the HPE GreenLake console, I’ve learned that the cURL command to get a session token is: 

```markdown
curl -s --location 'https://sso.common.cloud.hpe.com/as/token.oauth2' \ 
\--header 'Content-Type: application/x-www-form-urlencoded' \ 
\--data-urlencode 'grant_type=client_credentials' \ 
\--data-urlencode 'client_id='<CLIENTID>' \ 
\--data-urlencode 'client_secret='<CLIENTSECRET>'
```

You can see this in the API section of the Manage Workspace screen of the HPE GreenLake console shown below: 

Picture

Figure 2: API access management page 

The JSON response is received from this call in the following format: 

```json
{"access_token":"eyJhbGciOiJSUzI1NiIsImtpZCI6IjJGSmhvZ1lRMDZNazNBc2Q4UU8zU09ZVE9wayIsInBpLmF0bSI6ImRlejAifQ.eyJjbGllbnRfaWQiOiI1ZDVjMDVjMi00OGM5LTRmNzAtOWY4ZS1iMzIwZmQxNTA0NmYiLCJpc3MiOiJodHRwczovL3Nzby5jb21tb24uY2xvdWQuaHBZGUyODI1ZjIxMWVjOGE4NGZlZGViY2I0YTc1NCIsImF1dGhfc291cmNlIjoiY2NzX3Rva2VuX21hbmFnZW1lbnQiLCJwbGF0Zm9ybV9jdXN0b21lcl9pZCI6IjMwMQlkZTI4MjVmMjExZWM4YTg0ZmVkZWJjYjRhNzU0IiwiaWF0IjoxNzAyMDUxMDg1LCJhcHBsaWNhdGlvbl9pbnN0YW5jZV9pZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsImV4cCI6MTcwMjA1ODI4NX0.ocpBLPKG5XdL1s_ndMmuySGt5S2-ngcaZDTrb3P0L_M4px-6_7JOavSOW-x_lCns1i1mrYKk6vfswgsRtVVq7HQA-NT8PCbxNGBVzeBjhf0SLYtPUsDLr8tfZgIH3-tE4KoW9frAWVOM1plJ5DL8i7xIpj33yyrQiLEb84IAq5TuLQ6KesSvgatQyKgB4dGRZ6lISqh9jeXU7ZuoO2rnFRC8wDcPlx-XNX3oGM0-ZO5U-NXckdmxhaWMETKmDxnvvqmLbr_jvDxUwZWCcbPfIYyqP_OYpCljhtAPkGbj8U4V0xF7HMBms1qazSy9ZVgfJEPwvbdRwo5iRKAxi7oFnQ", 
"token_type":"Bearer", 
"expires_in":7199}
```

The response provides an access token of type “Bearer” with a time to live of 7200 seconds (2 hours). You should renew a token before expiration, but for the purposes of this blog, I will just check and terminate cleanly if it happens. 

Note: The token is returned as a standard JWT (JSON Web Token) described by [RFC 7519](https://datatracker.ietf.org/doc/html/rfc7519). You can dissect the content of your token using <https://jwt.io/>. Part of the data provided in the content is the date of expiration.