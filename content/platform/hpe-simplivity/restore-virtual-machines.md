---
title: "Simplivity"
version: v 6.01.8964
description:
image: 
frontpage: false
priority: 2
tags: ["Simplivity"]
---

Restoring virtual machines
==========================

This example uses `curl` to issue a POST request to restore a specific virtual machine from a backup. The example assumes that you have obtained an OAuth 2 token and that you have retrieved the identifier of the object that you want to perform the operation on.

```
curl -X POST --H "Content-Type: application/vnd.simplivity.v1+json" --header
"Authorization: Bearer [access_token]" -d "{
\"virtual_machine_name\": \"new_vm_name\"
}" "https://[host]/api/backups/[id]/restore?restore_original=false"
```

Where:

- `-H` (or `--header`) enables `curl` to add request headers.
- `"Content-Type: application/vnd.simplivity.v1+json"` indicates that the data in the body of the request uses version 1 of the HPE OmniStack JSON extension.
- `access_token` is the complete access token. For example: `f93f2059-afef-4310-9147-447645992a5d`.
- The body of the POST request is a JSON object that includes the required `virtual_machine_name` field that specifies the desired name for the new virtual machine that you want to create from the backup.
- `/api/backups/[id]/restore` is the base URI for the POST restore operation: For example: `/api/backups/0f123f92-2d75-4640-aab1-fa22b0a037cd/restore`.
- `host` is the IP address of the Virtual Controller to authenticate.
- The query parameter `restore_original` indicates whether to restore the original virtual machine. Setting this parameter to `false` specifies that you want to create a new virtual machine from the backup, rather than restoring the backup to an existing virtual machine.

The REST API service returns a `task` instance as the response to this POST request. For example:

```
{
"task": {
"id": "422a3b5d-9125-467b-1909-9fb5f5c9c65e:422a3b5d-9125-467b-1909-
9fb5f5c9c65e:841eb5cf-19d2-4fbb-a7ec-20638373ccfc",
"state": "IN_PROGRESS",
"affected_objects": [],
"error_code": 0,
"start_time": "2016-03-15T15:43:24Z",
"end_time": "1970-01-01T00:00:00Z"
}
}
```

The following `curl` command monitors the status of this operation by retrieving the task instance:

```
curl -H "Accept: application/vnd.simplivity.v1+json" -H "Authorization:
Bearer [*access_token*]" -X GET -k -i https://[host]/api/tasks/[*task_id*]
```

Where:

- `-H` (or `--header`) enables curl to add request headers.

- The `"Accept: application/vnd.simplivity.v1+json"` header indicates that you want the response to use version 1 of the HPE OmniStack JSON extension.

- `access_token` is the complete access token.

- `-X GET` indicates an HTTP GET operation.

- `-k` allows the use of self-signed SSL/TLS certificates.

- `host` is the IP address of the Virtual Controller to authenticate against.

- `task_id` is the complete ID of the task to monitor. For example: `422a3b5d-9125-467b-1909-9fb5f5c9c65e:422a3b5d-9125-467b-1909- 9fb5f5c9c65e:841eb5cf-19d2-4fbb-a7ec-20638373ccfc`.

You can issue this command multiple times, as necessary, to monitor the state of the operation. Possible states include:

- `IN_PROGRESS`
- `COMPLETED`
- `FAILED`

Once the operation completes, the response to this GET request includes any affected objects. In this example, the `affected_objects` body includes the object type and ID of the new virtual machine that operation created.
