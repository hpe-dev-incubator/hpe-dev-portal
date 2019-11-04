---
title: ""
version: v 6.01.8964
description:
image: 
frontpage: false
priority: 2
tags: ["Simplivity"]
---

Authenticating against the API
==============================

* * * * *

About OAuth 2 authentication and authorization

The REST API uses OAuth 2 authentication. To perform any operation using the REST API, you must log in and obtain a valid OAuth token. To log in, use the same username/password combination that you would use to create a session on the Virtual Controller using the `svt-session-start` CLI command. Once you have received an OAuth token, pass this token in with every REST API operation to authorize the operation. The privilege level of a REST API session is equivalent to the privilege level of a CLI session that uses the same credentials. For example, a read-only user can perform GET operations but cannot perform most POST/PUT/DELETE operations.

Requesting an OAuth 2 token
===========================

This example shows how to request an OAuth 2 token for use with the REST API using `curl`. OAuth 2 token requests are the only HTTP requests that use basic authentication. For these OAuth 2 token requests, use `simplivity` as the username and leave the password blank.

You need a username/password combination that to use to request an OAuth 2 token.

The following `curl` command requests an OAuth 2 token:

```
curl -k https://simplivity@[host]/api/oauth/token -d grant_type=password -d
username=[username] -d password=[password]
```

Where:

- *host* is the IP address of the Virtual Controller to which you want to authenticate.
- *username* is the username for a user account with the appropriate privileges for the REST API operations that you plan to perform.
- *password* is the password that corresponds to the *username* that you have specified.

You must supply the `-k` switch due to the use of self-signed certificates. You can import these certificates into your local certificate store.

This call returns a JSON response. For example:

```
{
"access_token":"d3c4782f-7fd9-496f-969b-29b7f7715972",
"token_type":"bearer",
"expires_in":81301,
"scope":"read write",
"updated_at":1455232016377
}
```

Note the value for the `access_token` in this response.

Pass the value for the `access_token` in every HTTP request header, using the following format: `Authorization: Bearer [access_token]`

For example:

`Authorization: Bearer d3c4782f-7fd9-496f-969b-29b7f7715972`
