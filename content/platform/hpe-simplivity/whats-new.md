---
title: ""
version: v 6.01.8964
description:
image: 
frontpage: false
priority: 2
tags: ["Simplivity"]
---
What's new in each version
==========================

The following sections list the features added in each version of the HPE OmniStack REST API.

Version 1.13 (released with HPE OmniStack 3.7.10)
-------------------------------------------------

Version 1.13 of the REST API added no new features.

Version 1.12 (released with HPE OmniStack 3.7.9)
------------------------------------------------

Version 1.12 of the REST API added the following features:

- The certificates URI was renamed to security/certificates
- cluster_feature_level was added to omnistack_clusters

Version 1.11 (released with HPE OmniStack 3.7.8)
------------------------------------------------

Version 1.11 of the REST API added the following features:

- Added infosight_configuration properties to the `hosts` and `omnistack_clusters` objects

Version 1.10 (released with HPE OmniStack 3.7.7)
------------------------------------------------

Version 1.10 of the REST API added the following features:

- Certificate management
- Improved performance for GET backups

Version 1.9 (released with HPE OmniStack 3.7.6)
-----------------------------------------------

Version 1.9 of the REST API added the following features:

- Perform file level restore from backups
- Shutdown a Virtual Controller, cancel the shutdown, and check the status of the shutdown operation
- Remove an HPE OmniStack host from a federation
- Backup rule impact reporting

Version 1.8 (released with HPE OmniStack 3.7.5)
-----------------------------------------------

Version 1.8 of the REST API added the following features:

- Share a datastore with a standard host (host without HPE OmniStack software)

- Stop sharing a datastore with a standard host

- Provide details on standard hosts that can share a datastore (unique ID, IP address, host name, sharing status, virtual machine count)

- Save virtual machine backup parameters (includes backup type application consistent or crash consistent and virtual machine credentials to access VSS if necessary to create an application-consistent backup with VSS instead of a VMware snapshot)

- Show the name of the hypervisor management system for clusters, hosts, datastores, and virtual machines

Version 1.7 (released with HPE OmniStack 3.7.3)
-----------------------------------------------

Version 1.7 of the REST API added the following new operations for `backups` objects:

- Calculates the unique size of a specified backup
- Cancels a specific running backup

Version 1.6 (released with HPE OmniStack 3.7.2)
-----------------------------------------------

Version 1.6 of the REST API added the following features:

- Added the following fields for `host` objects:
  - `federation_mask`
  - `federation_mtu`
  - `management_mask`
  - `management_mtu`
  - `storage_mask`
  - `storage_mtu`
- Added the following field for `datastore` and `omnistack_clusters` objects:

  - `hypervisor_management_system`

Version 1.5 (released with HPE OmniStack 3.7.0)
-----------------------------------------------

Version 1.5 of the REST API added the following features:

- Set backup policy for multiple `virtual_machines` with one operation
- Renamed `hypervisor_management_system` to `hypervisor_type`
- Added support for an emergency `grant_type` to enable you to restore virtual machines in situations in which the Hypervisor Management System has become unavailable
- Added support for revoking OAuth tokens
- Added support for searching for objects by one or more IDs

Version 1.4 (released with HPE OmniStack 3.6.2)
-----------------------------------------------

Version 1.4 of the REST API added the following features:

- Suspend or resume policy-based backups for a `host`, `omnistack_cluster`, or entire federation
- Delete multiple backups with one POST request
- Added `hypervisor_management_system` for `backup`, `datastore`, `omnistack_cluster`, and `virtual_machine` objects
- Added the following fields for `backup`, `datastore`, and `virtual_machine` objects:

  - `compute_cluster_parent_hypervisor_object_id`
  - `compute_cluster_parent_name` +Added the following fields for `backup` objects:
  - `unique_size_bytes`
  - `unique_size_timestamp` +`virtual_machine_type` +Added the following optional fields for `virtual_machine` objects:
  - `hypervisor_allocated_capacity`
  - `hypervisor_cpu_count`
  - `hypervisor_free_space`
  - `hypervisor_is_template`
  - `hypervisor_total_memory`
  - `hypervisor_virtual_disk_count`
- Added the following fields for `host` objects:

  - `can_rollback`
  - `compute_cluster_parent_hypervisor_object_id`
  - `compute_cluster_parent_name`
  - `current_feature_level`
  - `policy_enabled`
  - `potential_feature_level`
  - `upgrade_state`
- Added `version` for `omnistack_cluster` objects
- Faster performance and additional query options for `omnistack_cluster` objects
- Filter `backup`, `datastore`, and `omnistack_cluster` objects using multiple values in a comma-separated (OR) list

Version 1.3 (released with HPE OmniStack 3.6.1)
-----------------------------------------------

Version 1.3 of the added the following features:

- Association of `omnistack_cluster` objects with Hypervisor Management System (HMS) clusters
- The new `hypervisor_object_parent_name` and `hypervisor_object_parent_id` properties identify the parent of an `omnistack_cluster`
- Set the retention time for one or more backups
- Cluster throughput
- Cluster connectivity
- Set the time zone for a cluster
- Request a list of valid time zones for use when setting the time zone for a cluster
- Request the amount of life remaining for solid state drives (SSDs)
- Get the upgrade status for clusters
- Increased security resulting from removing the ability to refresh OAuth 2 tokens
- Filter `virtual_machine` objects using multiple values in a comma-separated (OR) list

Version 1.2 (released with HPE OmniStack 3.5.3)
-----------------------------------------------

Version 1.2 of the added the following features:

- Ability to set a backup policy for a datastore
- Host capacity metrics
- `virtual_machine` hypervisor power state
- `omnistack_cluster` associated hypervisor object ID and time zone
- Host associated compute cluster information

Version 1.1 (released with HPE OmniStack 3.5.2)
-----------------------------------------------

Version 1.1 of the added the following features:

- Ability to query the REST version
- vCenter Server linked mode support
- Rename, copy, and lock backups
- Performance metrics
- Host hardware reporting

Version 1 (released with HPE OmniStack 3.5.1)
---------------------------------------------

The initial version of the REST API focused on orchestration tools and included the following features:

- Management: Perform common operations, such as clone, back up, restore, move, and set policy
- Reporting: Retrieve storage utilization per node and datacenter efficiency data
- Simple query support: Retrieve and information using straight-forward, intuitive queries, and perform sorting, filtering, and paging for all object types
- Interactive documentation: Access an intuitive, comprehensive, real-time HTML5 reference