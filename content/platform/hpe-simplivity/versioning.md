---
title: "Simplivity"
version: v 6.01.8964
description:
image: 
frontpage: false
priority: 2
tags: ["Simplivity"]
---

Getting the API version
=======================

The REST API is backward compatible. As new attributes and operations are added in each release, older clients continue to work without any changes. Clients should strive to be backward compatible and should query the version of the REST API they are targeting to make sure that this version supports the needed functionality. The first version of the REST API was v1, followed by v1.1, v1.2, and so on.

You can issue a GET request to determine the version running on a Virtual Controller. To determine the version, issue a `GET /api/version` request. This request does not need to be authenticated. For example:

```
curl -k https://<host>/api/version
```

The response includes the REST API version and the SVTFS version. For example:

```
{
REST_API_Version: "1.1",
SVTFS_Version: "3.5.9904.284"
}
```

### Accept header

Use the `Accept` header to request a particular version of the REST API response objects. For example:

```
Accept: application/vnd.simplivity.v1.1+json
```

You always receive the current version representation, even if you request an older version.

### Content type

Each new version of the REST API introduces new operations. For detailed information about the operations that a particular REST API version supports, see the interactive REST API reference on the Virtual Controller you plan to interact with.

You must specify the correct minimum version using the `Content-Type` header. For example:

```
Content-Type: application/vnd.simplivity.v1.1+json
```

The following example shows how to use `curl` to specify the desired minimum version in the `Content-Type` header within a POST request to lock a backup:

```
curl -k -X POST --header "Content-Type: application/vnd.simplivity.v1.1+json"
"https://<host>/api/backups/a5f3e4ae-ae54-48cd-86fc-d168a542ef3f/lock"
```

If you specify a `Content-Type` that is too old while issuing a POST or PUT request, the REST API returns an exception. For example:

```
{
'status': '415',
'path': '/api/backups/f61a3e0f-829b-4739-86da-c82de96c2c85/lock',
'exception': 'org.springframework.web.HttpMediaTypeNotSupportedException',
'message': "Content type 'application/vnd.simplivity.v1+json' not supported",
'timestamp': '2016-05-16T18:25:01Z'
}
```