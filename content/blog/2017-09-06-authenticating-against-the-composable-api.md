---
title: Authenticating against the Composable API
date: 2017-09-06T17:11:08.159Z
author: Didier Lalli 
tags: ["HPE-OneView","OneView","RESTAPI"]
path: authenticating-against-the-composable-api
---
# Login Sessions

In the previous articles, we learned how to query the version of the HPE
Composable API (also referenced here as the HPE OneView API), using the
`GET /rest/version` call, and we discussed the importance of specifying
which version of the API is expected by an application. Let us now use
this to open a login session to HPE OneView. First, we can check the
syntax of the login session by looking up "login" in the online help.
This is what we find:

![check the syntax of the login session by looking up "login" in the online help](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/loginsession-1504732180732.png)

# Getting a session token

From the documentation, we can see that in order to open a login
session, we will need to use the POST method against the URI
/rest/login-sessions. This will create (remember POST is the verb used
in HTTP to create something) a session token, which we will use in the
subsequent calls to the API. We will ignore the login domain information
for now. We can also see in the documentation, that we will need to set
three HTTP Headers:

1. X-API-Version: set to the version of the API we want to use (let's
    assume 200)

2. Content-Type: set to application/json, to tell the API, that the
    payload we will be providing is in JSON notation

3. Accept: set to application/json, to tell the API to return response
    in JSON notation

The payload expected by the API must contains (at minimum) the following
parameters:

1. userName: set to the user name to use for authentication

2. password: set to the password for that user name

Note: Be careful, JSON is case sensitive. userName is expected here, not
username, nor UserName. As a rule, the API expects lower case words, but
capitalized, after the first word, if there are more than one word

# HttpRequester example


To keep it simple we can use HttpRequester (a plug-in for Firefox; or
POSTman a similar plug-in for Chrome) to test this. Set the following
parameters and hit Submit.

| Field   | Value                         | Try it here!                                           |
|---------|-------------------------------|--------------------------------------------------------|
| URL     | https://{ HPEOneViewappliance}/rest/login-sessions  | https://213.30.139.22:37441/rest/rest/login-sessions   |
| Verb    | POST                          |                                                        |
| Header  | Content-Type=application/json | 													   |
|		  |	Accept=application/json       | 													   |	
|         | X-API-Version=200             |                                                        |
| Payload | {                             |	                         							   |
|         |  "userName":"administrator",  |                              						   |
|         |  "password":"password"    	  |														   |	
|         |  }                            |                                                        |

![HttpRequester example to retrieve the login session token for Oneview login](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/httprequester-1504732233332.png)

The response we get is in the following form (extracted from online
documentation):

![HttpRequester response showing the session Id](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/httpresponse-1504732248902.png)

The **sessionID**, also known as the session token is what we are
looking for.

# Careful with that token!

Now in order to be authorized to call any other API methods, we will
need to provide the session token as another HTTP Header called Auth. So
remember, we now have two HTTP Headers, which *have to be provided* at
each call to the API: `Auth` and `X-API-Version`.

Note: You should also be aware that session tokens expire 24 hours after
the last utilization.

We can now test this token and call another API method. Let us pick `GET
/rest/global-settings` which returns the current settings of the HPE
OneView appliance.

Use HttpRequester with the following parameters and press Submit:

| Field   | Value                         | Try it here!                                           |
|---------|-------------------------------|--------------------------------------------------------|
| URL     |https://{HPEOneViewappliance}/rest/global-settings | https://213.30.139.22:37441/rest/global-settings   |
| Verb    | POST                          |                                                        |
| Header  | Content-Type=application/json | 													   |
|		  |	Accept=application/json       | 													   |	
|         | X-API-Version=200             |                                                        |
|         | Auth=your **sessionID**		  |                                                        |

![Retrieve global settings using the generated session token in API call](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/httprequesterwithauth-1504732241236.png)

As a quick check, remove the `Auth` HTTP Header, and try again. You should
get a 401 Status code (Unauthorized). The details of the error clearly
state that you forgot to provide an `Auth` header for that request.

Note: HTTP Headers are case insensitive: Auth or auth would work fine.

![Response showing Auth header is missing](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/forgotauthheader-1504732225620.png)

# Cleaning up

Finally, it is best practice to delete a token when it is not needed
anymore using the `DELETE /rest/login-sessions`. The session ID passed as
an `Auth` Header will be deleted and will not be valid for authentication
anymore. In HttpRequester, you can submit the following request:

| Field   | Value                         | Try it here!                                           |
|---------|-------------------------------|--------------------------------------------------------|
| URL     | https://{HPEOneViewappliance}/rest/login-sessions  | https://213.30.139.22:37441/rest/login-sessions        |
| Verb    | DELETE                        |                                                        |
| Header  | Content-Type=application/json | 													   |
|		  |	Accept=application/json       | 													   |	
|         | X-API-Version=200             |                                                        |
|         | Auth=your **sessionID**       |                                                        |

You should get a Status of 204 (anything in the 2xx is successful) with
no content for the response:

![Response showing successful token deletion](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/deletelogintoken-1504732217113.png)

The session token was deleted. If you are curious, try to reissue the
request from the HttpRequester History, which retrieved
`/rest/global-settings`. This time you should get another 401
Authorization error. Your token is not valid anymore.

![tokeninvaliderror](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/tokeninvaliderror-1504732255731.png)

# Key takeaways

Throughout the article, we have described what software will need to do
in order to integrate properly with HPE OneView API and the Composable
Infrastructure.

1. Query for the supported version of the API and verify compliance

2. Authenticate (using HTTP Headers: **X-API-Version**=version) and
    retrieve session token

3. Continue using the API (using HTTP Headers:
    **X-API-Version**=version and **Auth**=token)

4. Close the session (using HTTP Headers: **X-API-Version**=version and
    **Auth**=token)

    In the following articles, we will continue to investigate important
    concepts of the HPE OneView API.