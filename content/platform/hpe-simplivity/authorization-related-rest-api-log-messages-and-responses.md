---
title: ""
version: v 6.01.8964
description:
image: 
frontpage: false
priority: 2
tags: ["Simplivity"]
---
Authorization-related REST API log messages and responses
=========================================================

### Successful OAuth 2 token request log messages

If you request and receive an OAuth 2 token for the REST API successfully, `svt-rest-api.log` displays relevant messages. For example:

```
2016-04-29 14:36:48.379 DEBUG 13430 --- [tp1872627924-22]
c.s.restapi.security.SvtSessionMap : User count after add: 1
2016-04-29 14:36:48.384 INFO 13430 --- [tp1872627924-22]
o.s.b.a.audit.listener.AuditListener : AuditEvent [timestamp=Fri Apr
29 14:36:48 EDT 2016, principal=administrator, type=AUTHENTICATION_SUCCESS,
data={details={grant_type=password, username=administrator}}]
2016-04-29 14:36:48.387 DEBUG 13430 --- [tp1872627924-22]
c.s.restapi.security.SvtTokenEnhancer : enhancing accessToken
28b42cf2-4d6b-40a4-a91e-101a9e21c1cc with updated_at=1461955008387
2016-04-29 14:36:48.387 DEBUG 13430 --- [tp1872627924-22]
c.s.r.security.SvtInMemoryTokenStore : Storing access token
28b42cf2-4d6b-40a4-a91e-101a9e21c1cc
2016-04-29 14:36:48.387 DEBUG 13430 --- [tp1872627924-22]
c.s.restapi.security.SvtTokenEnhancer : enhancing accessToken
28b42cf2-4d6b-40a4-a91e-101a9e21c1cc with updated_at=1461955008387
2016-04-29 14:36:48.388 DEBUG 13430 --- [tp1872627924-22]
c.s.restapi.security.SvtSessionMap : Adding HMS session map with
OAuth=28b42cf2-4d6b-40a4-a91e-101a9e21c1cc
2016-04-29 14:36:48.389 DEBUG 13430 --- [tp1872627924-22]
c.s.restapi.security.SvtSessionMap : Session count after add: 1
2016-04-29 14:36:48.389 DEBUG 13430 --- [tp1872627924-22]
c.s.restapi.security.SvtSessionMap : Expired session count after add: 0
```

### JSON response indicates unsuccessful OAuth 2 token request

If an authorization error occurs during the token request, the JSON response includes a series of fields that provide information about the cause of the failure. For example:

```
{
"timestamp": 1457970690535,
"status": 401,
"error": "Unauthorized",
"exception": "com.simplivity.restapi.exceptions.SvtExceptions
$UnauthorizedException",
"message": "Unauthorized",
"path": "/api/backups"
}
```

### Normal OAuth 2 token audit log messages

During normal REST API operations, `svt-rest-api.log` displays token audit messages. For example:

```
2016-04-29 14:53:29.895 DEBUG 13430 --- [tp1872627924-35]
c.s.restapi.security.SvtTokenServices : Time elapsed (ms) since last update of
access token: 53388
2016-04-29 14:53:29.895 INFO 13430 --- [tp1872627924-35]
o.s.b.a.audit.listener.AuditListener : AuditEvent [timestamp=Fri Apr
29 14:53:29 EDT 2016, principal=administrator, type=AUTHENTICATION_SUCCESS,
data={details=remoteAddress=172.16.43.1, tokenType=BearertokenValue=<TOKEN>}]
```

### JSON response indicates expired OAuth 2 token

Each OAuth 2 token expires after ten minutes of inactivity. The following example shows an HTTP 401 error response that indicates an expired token:

```
{
"error": "invalid_token",
"message": "Access token expired due to inactivity: 4a1da31f-5405-4a93-
af5c-799403ea70d6"
}
```

Tokens expire completely after 24 hours even with continuous activity during this time period. The following example shows an HTTP 401 error response that indicates a token that has expired after 24 hours:

```
{
"error": "invalid_token",
"message": "Access token expired: 4a1da31f-5405-4a93-af5c-799403ea70d6"
}
```

If a token expires, you can request a new token.

### Expired OAuth 2 token log messages

`svt-rest-api.log` contains messages to indicate a token that has expired due to inactivity. For example:

```
2016-04-29 16:58:07.953 DEBUG 14950 --- [ qtp39959931-18]
c.s.restapi.security.SvtTokenServices : Time elapsed (ms: 66702 since last
update of access token: ec7b184f-b591-4609-bee8-96777339cf0e
Chapter 2: Getting started 27
2016-04-29 16:58:09.372 DEBUG 14950 --- [ SessionTickler]
c.s.restapi.security.SessionTickler : HMS Session 16bc9cec-37eb-4a11-
b620-189c9d420410 tickled.
2016-04-29 16:58:11.126 DEBUG 14950 --- [ qtp39959931-18]
c.s.restapi.security.SvtTokenServices : Removing token ec7b184f-b591-4609-
bee8-96777339cf0e due to inactivity. inactiveTokenExpiration is 20000
2016-04-29 16:58:14.827 DEBUG 14950 --- [ SessionTickler]
c.s.restapi.security.SessionTickler : HMS Session 16bc9cec-37eb-4a11-
b620-189c9d420410 tickled.
2016-04-29 16:58:15.540 DEBUG 14950 --- [ qtp39959931-18]
c.s.r.security.SvtInMemoryTokenStore : Removing access token ec7b184fb591-
4609-bee8-96777339cf0e
2016-04-29 16:58:16.573 DEBUG 14950 --- [ qtp39959931-18]
c.s.restapi.security.SvtSessionMap : Removing session with oauth
id=ec7b184f-b591-4609-bee8-96777339cf0e
2016-04-29 16:58:16.574 DEBUG 14950 --- [ qtp39959931-18]
c.s.restapi.security.SvtSessionMap : Session count after remove: 0
2016-04-29 16:58:16.575 DEBUG 14950 --- [ qtp39959931-18]
c.s.restapi.security.SvtSessionMap : Expired session count after remove: 0
2016-04-29 16:58:20.820 INFO 14950 --- [ qtp39959931-18]
o.s.b.a.audit.listener.AuditListener : AuditEvent [timestamp=Fri Apr
29 16:58:20 EDT 2016, principal=access-token, type=AUTHENTICATION_FAILURE,
data={type=org.springframework.security.authentication.BadCredentialsException,
message=Access token expired due to inactivity: ec7b184f-b591-4609-
bee8-96777339cf0e}]
```

`svt-rest-api.log` contains a message to indicate a token that has expired after 24 hours. For example:

```
2016-04-28 10:17:27.605 INFO 23921 --- [qtp1909078861-30]
o.s.b.a.audit.listener.AuditListener : AuditEvent [timestamp=Thu Apr
28 10:17:27 EDT 2016, principal=access-token, type=AUTHENTICATION_FAILURE,
data={type=org.springframework.security.authentication.BadCredentialsException,
message=Access token expired: 2d65e35f-6306-40ce-a8b8-5a8278e44e73}]
```