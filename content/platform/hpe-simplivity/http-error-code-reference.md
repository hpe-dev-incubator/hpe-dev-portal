---
title: "Simplivity"
version: v 6.01.8964
description:
image: 
frontpage: false
priority: 2
tags: ["hpe-simplivity"]
---

HTTP error code reference
-------------------------

Use this reference for information about the HTTP error codes returned by the REST API. The error codes are returned in the `status` field of the JSON error response body.

### 400-Bad Request

| Exception | Description |
| --- | --- |
| InvalidBodyException | You tried to pass invalid information in the body of a POST or PUT request. |
| InvalidParameterException | You passed an invalid query parameter. |
| InvalidSortCriteriaException | You passed an invalid limit or sort criteria query parameter. |
| ObjectInUseException | You tried to DELETE a policy that is in use by a datastore or virtual machine. |
| PermissionDeniedException | You tried to view or modify an object without the required permissions. |
| TypeMismatchException | You passed in an incorrect object type. For example, you passed in a String, but an Integer was expected. |

### 401---Unauthorized

| Exception | Description |
| --- | --- |
| SvtExceptions$UnauthorizedException | You submitted an invalid access token or the access token has expired. Tokens expire after 24 hours or after 10 minutes of inactivity. |

### 404---Not Found

| Exception | Description |
| --- | --- |
| ObjectNotFoundException | You tried to GET or act on an object, but the object cannot be found. |

### 405---Method Not Allowed

| Exception | Description |
| --- | --- |
| HttpRequestMethodNotSupportedException | You tried to perform an HTTP operation on a resource that is not supported. |

### 413---Payload Too Large

| Exception | Description |
| --- | --- |
| BodyTooLargeException | You submitted a request body that is too large. |

### 415---Unsupported Media Type

| Exception | Description |
| --- | --- |
| HttpMediaTypeNotSupportedException | You submitted a PUT or POST request and the content type that is not valid. For example: `Content type 'application/xml' not supported.` |

### 500---Internal Server Error

| Exception | Description |
| --- | --- |
| InternalServerException | You submitted a request, there are unexpected problems. Check the log for more details. |

### 502---Bad Gateway

| Exception | Description |
| --- | --- |
| Bad Gateway | There are too many simultaneous REST requests. |

### 504---Gateway Timeout

| Exception | Description |
| --- | --- |
| Gateway Time-out | The REST request took more than 60 seconds to complete. |
