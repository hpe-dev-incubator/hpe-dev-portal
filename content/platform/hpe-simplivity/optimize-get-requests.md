---
title: "Simplivity"
version: v 6.01.8964
description:
image: 
frontpage: false
priority: 2
tags: ["Simplivity"]
---

Optimizing GET requests
=======================

You can increase the efficiency of the REST API by minimizing the amount of processing that occurs on the server and the amount of data that is transmitted over the network. This page describes a number of ways that you can sort and filter the output of GET requests to optimize them. You can increase the speed of these transactions by eliminating the transfer of unnecessary content.

Request specific fields
-----------------------

If you only need a small number of fields, you can request only these fields. The following example requests only the `id` and `name` fields:

```
GET /api/backups?fields=id,name
```

Limit the number of objects by relationship
-------------------------------------------

If you only want to retrieve a limited number of objects, you can use filtering parameters to return only objects associated with a particular resource. The following example queries for all backups of a specific virtual machine:

```
GET /api/backups?fields=id,name&virtual_machine_id=729861fd-a006-4849-bf08-b232551989c0
```

Sort returned data
------------------

To increase the efficiency of the returned data, you can sort these results by most fields. The following example sorts results by the `name` field:

```
GET /api/backups?fields=id,name&virtual_machine_id=729861fd-a006-4849-bf08-b232551989c0&sort=name
```

For most fields, the sort is a case-sensitive lexicographic sort. Numbers come before capital letters, which come before lowercase letters. The REST API service sorts backup names case-insensitively.

Request objects in sorted/filtered chunks
-----------------------------------------

You can use the `offset` and `limit` fields to request objects in sorted/filtered chunks. You can set the limit to any integer value up to 5000. The following example sorts results by the `name` field and requests chunks of 50 results at a time:

```
GET /api/backups?fields=id,name&virtual_machine_id=729861fd-a006-4849-bf08-
b232551989c0&sort=name&offset=50&limit=50
```

The REST API always performs sorting and filtering on enumerated values using the full uppercase enumerations. The REST API ignores the value of the case parameter when you sort or filter by fields with enumerated values.
