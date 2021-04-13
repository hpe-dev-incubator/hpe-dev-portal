---
title: "Simplivity"
version: v 6.01.8964
description:
image: /img/simplivity.jpg 
frontpage: false
priority: 2
tags: ["hpe-simplivity"]
---

Requesting authentication by emergency grant
============================================

The emergency grant type functions in a way that is similar to the password grant type. However, this grant type uses the emergency local svtcli account for authentication. This functionality is similar to the `--emergency` option in CLI commands.

This grant type is intended for use only when the Hypervisor Management System has become unavailable, and you want to access or restore backups of `virtual_machine` objects. Using this type of token, clients can only access the following limited set of API operations:

- GET /hosts
- GET /omnistack_clusters
- GET /backups
- GET /datastores
- GET /virtual_machines
- POST /backups/{bkpId}/restore

With this grant type, the REST API does not support sorting and filtering GET requests or querying for optional properties.

Use a `curl` command like the following to request a token for the HPE OmniStack CLI (svtcli) account from a Virtual Controller with *host* as the IP address, svtcli as the username, and *password* as the password:

```
curl -k https://simplivity@[host]/api/oauth/token -d grant_type=emergency -d
username=svtcli -d password=[password]
```

Where:

- *host* is the IP address of the Virtual Controller you want to authenticate to.
- svtcli is the username for the emergency local HPE OmniStack CLI account.
- *password* is the password for the emergency local HPE OmniStack CLI (svtcli) account.

You must supply the `-k` switch due to the use of self-signed certificates. You can import these certificates into your local certificate store.

This call returns a JSON response similar to the following:

```
{
"access_token":"6f9166c2-bc7f-4cfc-a304-56aadd85e214",
"token_type":"bearer",
"expires_in":86399,
"scope":"read write",
"updated_at":1489421129188
}
```

Note the value for the `access_token` in this response. Tokens expire either after ten minutes of inactivity or after 24 hours even with continuous activity. If you pass incorrect credentials, then the client receives a response similar to the following:

```
{
"error":"invalid_grant",
"error_description":"Invalid credentials"
}
```
