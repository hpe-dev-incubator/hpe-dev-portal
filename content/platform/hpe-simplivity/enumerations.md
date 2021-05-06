---
title: "Simplivity"
version: v 6.01.8964
description:
image: /img/simplivity.jpg
frontpage: false
priority: 2
tags: ["hpe-simplivity"]
---

Enumerations
============

Use this section as a reference for the REST API enumerations (enums).\
The REST API always performs sorting and filtering on enumerated values using the full uppercase enumerations. The REST API ignores the value of the case parameter when you sort or filter by fields with enumerated values.

* * * * *

adapter_type
------------

Used by: `NetworkInterface` object

| Element | Definition |
| --- | --- |
| `E1000`, `E1000E`, `PCNET32`, `VMXNET`, `VNXNET2`, and `VMXNET3` | The `adapter_type` assigned to the virtual machine. For more information about these values, see the VMware vSphere documentation. |
| `UNKNOWN` | The `adapter_type` cannot be determined. |

app\_aware\_type
--------------

Used by: `backup_parameters` object

| Element | Definition |
| --- | --- |
| DEFAULT | Crash-consistent. |
| NONE | Application-consistent backup using a VMware snapshot. |
| VSS | This backup is an application aware backup with Microsoft VSS. |

app\_aware\_vm\_status
-------------------

Used by: `virtual_machines` object

| Element | Definition |
| --- | --- |
| CAPABLE | The virtual machine is ready and can take application aware snapshots. |
| INVALID_CREDS | A valid set of credentials for the virtual machine is not available, which prevents application aware snapshots of this virtual machine. |
| INVALID_OS | The virtual machine is not running an appropriate operating system (OS) which prevents application aware snapshots of this virtual machine. |
| UNKNOWN | The state of the virtual machine with respect to readiness for an application aware snapshot is not known. |
| UNKNOWN_FAULT | A general failure has occurred that prevents application aware snapshots of the virtual machine. |
| VALID_CREDS | A valid set of credentials for the virtual machine is available which enables application aware snapshots of this virtual machine. |
| VMWARE_TOOLS_UNAVAILABLE | VMware Tools are not installed or not running on the virtual machine which prevents application aware snapshots of this virtual machine. |

consistency_type
----------------

Used by: `backup` object, `BackupVMMO` object, Policy rule, Policy rule POST body, create_or_edit_rule, rule

| Element | Definition |
| --- | --- |
| DEFAULT | An application consistent backup with VMware Snapshots. |
| NONE | A crash consistent backup or a backup that is not application consistent. |
| VSS | An application aware backup with Microsoft VSS. |

ha_status
---------

Used by: `virtual_machine` object

| Element | Definition |
| --- | --- |
| DEFUNCT | Object no longer exists but is still being referenced. |
| DEGRADED | Object is not fully replicated. |
| NOT_APPLICABLE | Object is intentionally not replicated. |
| OUT_OF_SCOPE | Status not available from this location. |
| SAFE | Object is replicated. |
| SYNCING | Object is becoming replicated. |
| UNKNOWN | Status could not be determined. |

hypervisor_type
---------------

Used by: `backup` object, `datastore` object, `omnistack_cluster`, `virtual_machine` object, `BackupMO`

| Element | Definition |
| --- | --- |
| VSPHERE | The Hypervisor Management System (HMS) associated with this backup is vSphere. |
| HYPERV | The HMS associated with this backup is Hyper-V. |

hypervisor\_virtual\_machine\_power\_state
--------------------------------------

Used by: `virtual_machine` object

| Element | Definition |
| --- | --- |
| OFF | The Hypervisor Management System (HMS) considers the virtual machine to be powered off. |
| ON | The HMS considers the virtual machine to be powered on. |
| SUSPENDED | The HMS considers the virtual machine to be suspended. |
| UNKNOWN | The hypervisor-based power state of the virtual machine cannot be determined. |

mac_generation
--------------

Used by: `NetworkInterface`

| Element | Definition |
| --- | --- |
| ASSIGNED | The MAC address is automatically assigned when you power on the virtual machine. |
| GENERATED | The MAC address was automatically generated. |
| MANUAL | The MAC address was statically assigned. |
| UNKNOWN | The mac_generation type could not be determined. |

media_type
----------

Used by: `physical_drive`

| Element | Definition |
| --- | --- |
| HDD | Hard disk drive. |
| SSD | Solid-state drive. |
| UNKNOWN | The `media_type` could not be determined. |

role
----

Used by: `ReplicaInfo`

| Element | Definition |
| --- | --- |
| PRIMARY | The ReplicaInfo id represents the ID of the host that contains the primary data replica of the virtual machine. |
| SECONDARY | The ReplicaInfo id represents the ID of the host that contains the secondary data replica of the virtual machine. |

state
-----

Used by:`backup` object

| Element | Definition |
| --- | --- |
| CANCELED | The backup operation was canceled successfully. |
| CANCELING | The backup operation is responding to a manual cancellation of a backup in progress. |
| DEGRADED | The backup is in an unprotected high availability state. This situation can occur when an HPE OmniStack host in the backup replica set is replaced by another HPE OmniStack host, and the backup has been saved to one HPE OmniStack host in a datacenter with multiple HPE OmniStack hosts. |
| DELETED | The backup data was deleted before the expiration of the backup. This situation can occur when removing an HPE OmniStack host may remove the last copy of a backup in a datacenter. |
| FAILED | The backup was unsuccessful. |
| NEW | The backup operation started, but the initial backup of the virtual machine and processing of the backup on the source datacenter is not complete. |
| PROTECTED | The backup is successful and is in a protected high availability (HA) state. If the backup was a remote backup, successful replication to the remote site has also completed. |
| QUEUED | The backup is waiting to be replicated to a remote datacenter. |
| REBUILDING | The backup data is rebuilding onto a second HPE OmniStack host to ensure high availability for the backup in a multi-node datacenter. |
| SAVING | The backup replication is in progress. The state changes to `Protected`, `Queued`, `Failed`, or `Degraded`. |
| UNKNOWN | The backup state cannot be determined. |

state
-----

Used by: `host` object

| Element | Definition |
| --- | --- |
| ALIVE | The HPE OmniStack host is healthy. |
| FAULTY | The HPE OmniStack host is in a critical error state, and operations have failed over to an alternate HPE OmniStack host in the federation. It is likely that one or more error or event messages were logged. |
| MANAGED | The Virtual Controller for this host is offline but can still be managed. |
| REMOVED | The HPE OmniStack host has been removed from the federation but is still being recognized. |
| SUSPECTED | The HPE OmniStack host has one or more components that show degraded performance. |
| UNKNOWN | The HPE OmniStack host status is indeterminate, perhaps because it is unable to communicate with other federation HPE OmniStack hosts. It is possible that one or more error or event messages were logged. |

state
-----

Used by: `task` object

| Element | Definition |
| --- | --- |
| COMPLETED | The task has completed successfully. |
| FAILED | The task has failed. |
| IN_PROGRESS | The task is currently being processed. |

state
-----

Used by: `virtual_machine` object

| Element | Definition |
| --- | --- |
| ALIVE | An active hypervisor-based virtual machine is associated with the `virtual_machine` object. |
| DELETED | The hypervisor-based virtual machine that is associated with the `virtual_machine` object has been deleted with at least one backup of that virtual machine still existing. |
| REMOVED | The hypervisor-based virtual machine that is associated with the `virtual_machine` object has been removed from the virtual machine inventory of the hypervisor. |

status
------

Used by: `credential_validation` object

| Element | Definition |
| --- | --- |
| VM_POWERED_OFF | The virtual machine is powered off, so it is not possible to determine if the credentials are valid. |
| INVALID | Credentials are invalid. |
| VALID | Credentials are valid. |

type
----

Used by:`backup`

| Element | Definition |
| --- | --- |
| MANUAL | A user created this backup manually. Manual backups are not deleted automatically. |
| POLICY | An automatic policy created this backup. The backup is subject to automatic deletion when the retention time for the backup expires or the maximum number of backups is exceeded. The oldest backups are deleted first. |
| UNSPECIFIED | The backup type cannot be determined. |

type
----

Used by: `omnistack_cluster` object

| Element | Definition |
| --- | --- |
| CLOUD | The `omnistack_cluster` is comprised of HPE OmniStack Cloud hosts. |
| OMNISTACK | The `omnistack_cluster` is comprised of HPE OmniStack hosts that share resources and provide high availability and load-balancing services. |
| UNKNOWN | The type could not be determined. |

upgrade_state
-------------

Used by: `host` object

| Element | Definition |
| --- | --- |
| FAIL | The HPE OmniStack host upgrade task failed, and an error code and message indicate the reason for the failure. |
| IN_PROGRESS | The HPE OmniStack upgrade task is proceeding. |
| NOOP | The HPE OmniStack host upgrade is incomplete. For example, a host may have failed to upgrade successfully, and the upgrade needs to be repeated, but this host is already at the correct version and does not need to be upgraded again. |
| SUCCESS | The HPE OmniStack host upgrade task completed successfully. |
| UNKNOWN | It is not possible to determine the status of the HPE OmniStack host upgrade task. |

upgrade_state
-------------

Used by: `omnistack_cluster`

| Element | Definition |
| --- | --- |
| FAIL_CAN_ROLLBACK | At least one software upgrade for this `omnistack_cluster` is in a state that cannot be upgraded, committed, or rolled back. This state should rarely occur. Contact Customer Support (support.hpe.com). |
| FAIL_CANNOT_ROLLBACK | One or more HPE OmniStack hosts failed the upgrade. The upgrade either rolled back automatically or failed before a rollback was required. Attempt the upgrade and, if it fails again, contact Customer Support (support.hpe.com). |
| IN_PROGRESS | The upgrade task is proceeding. |
| SUCCESS_COMMIT_NEEDED | The upgrade is ready to commit (or roll back). |
| SUCCESS_COMMITTED | The `omnistack_cluster` is committed to the current software version. Commits occur at the federation level, so all `omnistack_cluster` instances in the federation should be in this state. |
| SUCCESS_MIXED_VERSION | None of the HPE OmniStack hosts in the have an upgrade in progress, but the `omnistack_cluster` has mixed versions of software on different HPE OmniStack hosts. An upgrade is needed to make the `omnistack_cluster consistent`. This state can occur when a node with a different software version is added to the `omnistack_cluster`. An upgrade is required to ensure that all HPE OmniStack hosts are running the same version. |
| UNKNOWN | It is not possible to determine the status of the previous upgrade task. |

virtual\_machine\_state
---------------------

Used by: `backup` object, `BackupMO` object

| Element | Definition |
| --- | --- |
| ALIVE | An active hypervisor-based virtual machine is associated with the `virtual_machine` object. |
| DELETED | The hypervisor-based virtual machine that is associated with the `virtual_machine` object has been deleted with at least one backup of that virtual machine still existing. |
| REMOVED | The hypervisor-based virtual machine that is associated with the `virtual_machine` object has been removed from the virtual machine inventory of the hypervisor. |

virtual\_machine\_type
--------------------

Used by: `BackupMO`

| Element | Definition |
| --- | --- |
| TEMPLATE | The virtual machine instance associated with the backup is a virtual machine template. |
| UNKNOWN | The type of the virtual machine instance associated with the backup is unknown. |
| VM | The virtual machine instance associated with the backup is a virtual machine. |