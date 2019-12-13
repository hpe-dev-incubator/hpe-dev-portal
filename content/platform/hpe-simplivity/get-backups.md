---
title: "Simplivity"
version: v 6.01.8964
description:
image: 
frontpage: false
priority: 2
tags: ["hpe-simplivity"]
---
Getting backups
===============

This example uses `curl` to retrieve a list of all the backups in the federation along with details about each backup.

```
curl -H "Accept: application/vnd.simplivity.v1+json" -H "Authorization:
Bearer [*access_token*]" -X GET -k -i https://[*host*]/api/backups
```

Where:

- `-H` (or `--header`) enables curl to add request headers.

- The `"Accept: application/vnd.simplivity.v1+json"` header indicates that the response should use version 1 of the HPE OmniStack JSON extension.

- *access_token* is the complete access token, for example, `f93f2059- afef-4310-9147-447645992a5d`.

- `-X GET` indicates an HTTP GET operation.

- `-k` allows the use of self-signed SSL/TLS certificates.

- *host* is the IP address of the Virtual Controller that you want to authenticate.

The GET request returns a JSON response similar to the following example:

```
{
"offset": 0,
"limit": 500,
"count": 21,
"backups": [
{
"id": "f6d5980c-478c-4292-aabf-67da627dbc57",
"name": "vm32_A_6-backup-2016-03-13T21:03:46-04:00",
"sent": 0,
"state": "PROTECTED",
"type": "MANUAL",
"omnistack_cluster_id": "0bf3988b-b684-4002-a04d-55bb8831b8c4",
"omnistack_cluster_name": "Boston -:- OmniCube CN-2000 5.5.0",
"datastore_id": "c1d172e2-bd89-4bad-ae2a-848e7fbe3dc4",
"datastore_name": "ds2",
"expiration_time": "NA",
"virtual_machine_id": "729861fd-a006-4849-bf08-b232551989c0",
"virtual_machine_name": "vm32_A_6",
"size": 12574720,
"application_consistent": false,
"created_at": "2016-03-14T01:03:46Z"
},
...
]
}
```

In the response, the count value indicates that there are a total of 21 backup objects (that is, resources). The response returns these backups in a JSON array of objects. The offset and limit values indicate that the response array starts at the backup with an offset of 0 and includes backups up to the maximum limit of 500 objects. These values for the offset and limit are the default values.
