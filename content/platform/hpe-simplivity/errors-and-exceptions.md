---
title: "Simplivity"
version: v 6.01.8964
description:
image: 
frontpage: false
priority: 2
tags: ["hpe-simplivity"]
---

About REST API errors and exceptions
====================================

Shallow validation REST API errors
----------------------------------

The service performs shallow validation to identify errors immediately upon the submission of an operation. In this case, the service does not create a task instance for the operation. Rather, it returns an HTTP response, such as a 400 (Bad Request) error, that includes a JSON body to explain the error.

The following example shows the JSON body of an error response for an attempt to rename a policy using a name that is already in use:

```
  "exception": "com.simplivity.rpc.common.TaskException",
  "path": "/api/policies/0fa0d890-6847-4eb0-8480-78d6fc3a9913/rename",
  "error_code": "13",
  "message": "Duplicate name exists.",
  "timestamp": 1460129027118,
  "status": "400"
```

In this example, the error occurred because the attempted to rename a policy using a name that already existed in the . The JSON body includes the following information:

- path: displays the affected object and attempted operation.
- error_code: displays the numeric code that uniquely identifies the error that occurred
- message: displays a description of the error that occurred
- timestamp: displays the date and time at which the error occurred
- status: Displays the status of the operation, that is, the HTTP response code

The REST API service also performs certain additional validation checks before creating a task for the operation. These additional checks serve to identify crucial errors immediately.

Deep validation REST API errors
-------------------------------

The REST API performs deep validation to identify errors after the submission of an operation. If an operation fails after the service has created a task instance for the operation, the task instance reports error information. In this case, you can GET the task instance, and this GET returns HTTP response 200. The following example shows the JSON body of a task instance that reports an error caused by an attempt to move a virtual machine while it is powered on:

```
  "task": {
    "id": "420b50a4-99b0-d27a-4f28-ea2c9e899da0:420b50a4-99b0-d27a-4f28-ea2c9e899da0:20102ad9-69c1-46b3-b70d-171fc5df033f",
    "state": "FAILED",
    "message": "The VM power state is not acceptable.",
    "affected_objects": [],
    "error_code": 130,
    "start_time": "2016-05-09T20:37:08Z",
    "end_time": "2016-05-09T20:37:09Z"
  }
}
```

The JSON body of the task instance for a failed operation includes the following information:

- id: displays the unique identifier for the task
- state: displays the state of the task, that is, FAILED
- message: displays a description of the error that occurred
- affected_objects: displays information about the objects that were the targets of the failed operation
- error_code: displays the numeric code that uniquely identifies the error that occurred
- start_time: displays the date and time at which the failed task started
- end_time: displays the date and time at which the failed task ended with an error

ID not found errors
-------------------

If you specify an ID in a GET or other operation, and this ID does not exist for the object type that you have specified, the REST API service returns HTTP response 404, along with a JSON error body, such as the following example:

```
{
  "exception": "com.simplivity.restapi.exceptions.ObjectNotFoundException",
  "path": "/api/backups/badid/rename",
  "message": "Object type: backup id: badid could not be found",
  "timestamp": 1460140207690,
  "status": "404"
}
```

The JSON body of the response for an error reporting an ID that the REST API service did not find includes the following information:

- path: displays badid as the affected object and the attempted operation
- message: dDisplays a description of the error that occurred
- timestamp: displays the date and time at which the error occurred
- status: displays the status of the operation, that is, the HTTP response code