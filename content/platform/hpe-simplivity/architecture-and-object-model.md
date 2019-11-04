---
title: ""
version: v 6.01.8964
description:
image: 
frontpage: false
priority: 2
tags: ["Simplivity"]
---
Architecture
============

The HPE OmniStack REST API is available on every Virtual Controller. To issue a REST request, target the network address (IP address or DNS name) of the Virtual Controller. The REST API provides a secure portal into the Virtual Controller. Consequently, address REST API requests to secure port 443. The following diagram illustrates the basic architecture of the REST API:

![architecture diagram](https://developer.hpe.com/uploads/media/2018/7/svt-rest-api-arch-1532712778003.png)

Object model
============

The REST API object model enables you to monitor and manage a set of HPE OmniStack objects, including backups, datastores, hosts, clusters, policies, tasks, and virtual machines. The following table describes each of the types of objects that the REST API supports:

| Object type | Description |
| --- | --- |
| `backup` | A complete, standalone image of a virtual machine, taken at a specific point in time. You can retrieve all of the backups that are defined in the federation. You can copy, delete, lock, rename, restore, and set the retention time for backups. |
| `datastore` | A repository that contains the files of one or more virtual machines. You can retrieve all of the datastores that are defined in the federation. You can create new datastores, and you can delete, resize, and set policies for existing datastores. |
| `host` | An HPE OmniStack host in a federation. You can retrieve all of the hosts that are defined in a federation along with their capacity, hardware, and metrics data. |
| `omnistack_cluster` | A logical grouping of systems that are running the HPE OmniStack software. You define an `omnistack_cluster` to enable resources to be shared efficiently across the HPE OmniStack hosts in a federation. You can retrieve all of the `omnistack_cluster` objects that are defined in a federation. You can retrieve `omnistack_cluster` metrics, throughput, and connected clusters data, and you can set the time zone for an `omnistack_cluster`. |
| `policy` | Contains backup rules that can be applied to an individual datastore or virtual machine. You can retrieve all the policies that are defined in the federation. You can create, delete, and rename policies. You can also create, edit, and delete the rules associated with policies. |
| `task` | Tracks the progress of an HPE OmniStack operation. When the status of a task is `COMPLETED`, the `affected_objects` indicate any created or modified objects. You can retrieve tasks. |
| `virtual_machine` | Represents a single virtual machine that has been created within an HPE OmniStack datastore. You can retrieve all of the virtual machines in the federation. You can back up, clone, and move virtual machines. You can set policies for virtual machines and retrieve virtual machine backup and metrics data. |

REST API object type relationships
----------------------------------

The REST API supports the relationship of one object to another object of a different type by referencing the ID of the related object as a value of one of the properties of the base object. The following figure shows these object type relationships:

![object type relationships](https://developer.hpe.com/uploads/media/2018/7/svt-rest-api-object-type-relationships-1532712788492.png)

REST API tasks as managed objects
---------------------------------

The control plane treats tasks as true managed objects, which enables clients to efficiently determine the changes that requests have made on the system; for example, during the creation of new objects. Tasks contain meaningful information that enables clients to post-process requests in an intuitive and deterministic manner. The REST API task managed object has the following characteristics:

- A task has an ID value that enables a client to query for a task.
- The state of a task conveys where the task currently is in the processing sequence. Based on the current state, other properties of the task might not be set.
- If the task ends in failure, the `error_code` and `message` properties contain information about the failure.
- If the task completes successfully, the `affected_objects` array contains information about the object(s) that the task impacted. Each `affected_object` entry has a type-significant ID, as well as a type string. For example, if the move of a virtual machine completes successfully, the task that is associated with the move has an `affected_object` of the `virtual_machine` type, and the ID of the task is the system-assigned ID of the new virtual machine.
- Multiple `affected_objects` can be associated with a task (thus, the array of affected_objects).