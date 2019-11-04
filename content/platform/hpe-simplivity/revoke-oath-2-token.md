---
title: ""
version: v 6.01.8964
description:
image: 
frontpage: false
priority: 2
tags: ["Simplivity"]
---

Revoking an OAuth 2 token
=========================

This example uses `curl` to illustrate how to revoke an OAuth 2 token. You might revoke a token when you are done using it and you want to free up any outstanding resources, such as vCenter Server sessions.

The following `curl` command revokes an OAuth 2 token:

```
curl -k https://[host]/api/oauth/revoke -H "Authorization: Bearer
0a08c809-17ff-479f-b0a8-aedd4d8305a0"
```

Where:

- *host* is the IP address of the Virtual Controller.

You must supply the `-k`switch due to the use of self-signed certificates. You can import these certificates into your local certificate store.

The call returns HTTP status 200 without any body.