---
title: Authenticating against HPE OneSphere API
date: 2018-01-10T13:21:38.956Z
author: Didier.Lalli@hpe.com 
tags: ["HPE-OneSphere","API","GettingStarted","REST"]
path: authenticating-against-hpe-onesphere-api
---
## Summary
In the previous article, [Getting Started With OneSphere Programming](/blog/getting-started-with-hpe-onesphere-programming), we discovered the HPE OneSphere REST API. We also discovered that apart from GET /rest/status, none of the other API calls function without authentication. In this article we will explain how to authenticate and use the rest of the HPE OneSphere API in a secure way.

## Session Token
In order to use any of the calls of the HPE OneSphere API, you need to authenticate against the API. This authentication mechanism is relatively standard in API programming. It uses a session "token". Think about a token as a key that grants access to the API. Getting one of these tokens is accomplished with the following steps:

- Call the API to request a new login session, providing valid credentials 
- Extract token from JSON response
- For each subsequent call, set a new HTTP Header with its key set to *Authorization* and its value set to the token value

>Note: The token will expire after 24 hours. 

## Let's get one!

The API call used to start a new login session is called */rest/session*. If you remember the verbs available in HTTP, you remember that there was one for creating a new object called POST. We can confirm this by looking at the online help for *POST /rest/session*

![](/uploads/media/2018/1/authenticating-against-hpe-onesphere-api-1-1515590404842.jpg "Online Help for POST /rest/session")

Because POST calls require data passed to the API, we will need to provide a body with the credentials, as explained in the online help. We will provide this data in JSON, so we will also need to set up an HTTP Header for *Content-Type:application/json*, to let the API know that we are passing a JSON payload.

Let's try this in Postman:

| **Field** | **Value** | | |
| --- | --- | --- | --- |
| **Verb** | POST | | |
| **URL** | https<nolink>://{HPEOneSphere}/rest/session | | |
| **Headers** | **Key** | **Value** | **Explanation** |
| |Content-Type | application/json | This header tells the API about the format of data you are providing in the body |
| | Accept | application/json | This header tells the API about the format of data you expect in the response |

We also need to set the following JSON body (in raw format)


```json
{
"userName":"MyOneSphereUser", "password":"MyOneSpherePassword"
}
```

In Postman it should look like this:

![](/uploads/media/2018/1/authenticating-against-hpe-onesphere-api-2-1515590437812.jpg "Sending POST /rest/session request to HPE OneSphere API")

If you hit **Send**, Postman will send this request to the HPE OneSphere API, and should return a successful status code (200) as shown below:

![](/uploads/media/2018/1/authenticating-against-hpe-onesphere-api-3-1515590466656.jpg "Session Token returned by HPE OneSphere API")

## Token based authentication

As explained earlier, we now have acquired a session token, which we need to present to any subsequent API call requiring proper authentication (that is all calls except **GET /rest/status** and **POST /rest/session**). The way to do this is to systematically add a HTTP Header for *Authorization*, with the value of the token, prefixed by the string “Bearer ”.

>More about Bearer authentication can be found [here](https://swagger.io/docs/specification/authentication/bearer-authentication/)

Let's now try this in Postman with another API call such as **GET /rest/projects**:

| **Field** | **Value** | | |
| --- | --- | --- | --- |
| **Verb** | GET | | |
| **URL** | https<nolink>://HPEOneSphere/rest/projects | | |
| **Headers** | **Key** | **Value** | **Explanation** |
| | Accept | application/json | This header tells the API about the format of data you expect in the response |
| | Authorization | Bearer YourToken | This header holds your session token retrieved in previous call |

The response from the API should display, in JSON, the list of projects currently defined in HPE OneSphere, as shown below:

![](/uploads/media/2018/1/authenticating-against-hpe-onesphere-api-4-1515590488364.jpg "Calling GET /rest/projects on HPE OneSphere API")

## Cleanup after yourself!
Although session tokens have a time to live (TTL) of 24 hours, it is best practice in REST API programming to cleanup and delete those tokens when done. We can use a **DELETE /rest/session** to achieve this:

| **Field** | **Value** | | |
| --- | --- | --- | --- |
| **Verb** | DELETE | | |
| **URL** | https<nolink>://HPEOneSphere/rest/session | | |
| **Headers** | **Key** | **Value** | **Explanation** |
| | Accept | application/json | This header tells the API about the format of data you expect in the response |
| | Authorization | Bearer YourToken | This header holds your session token retrieved in previous call |

After this, token would have been invalidated, so attempting another call to **GET /rest/projects** shall fail with a status code of 401 (Unauthorized).

## Next Step?

In the next articles we will continue to explore the HPE OneSphere API using Postman. Additionally, we will explore the use of this API in advanced languages such as PowerShell and Python which will help build automation scripts.

