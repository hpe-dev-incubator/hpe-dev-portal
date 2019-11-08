---
title: "Simplivity"
version: v 6.01.8964
description:
image: 
frontpage: false
priority: 2
tags: ["Simplivity"]
---

Feature and function support by REST API version
================================================

The tables in this section list the features and functions that each version of the REST API supports for the following object types:

- backups
- cluster_groups
- datastores
- hosts
- omnistack_clusters
- policies
- security/certificates
- tasks
- virtual_machines

* * * * *

`backups`
=========

The REST API supports the following features and functions for the `backups` object type:

| Operation | 1.13 | 1.12 | 1.11 | 1.10 | 1.9 | 1.8 | 1.7 | 1.6 | 1.5 | 1.4 | 1.3 | 1.2 | 1.1 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GET | X | X | X | X | X | X | X | X | X | X | X | X | X | X |
| Additional returned properties: |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| compute_cluster_parent_hypervisor_object_id | X | X | X | X | X | X | X | X | X | X |  |  |  |  |
| compute_cluster_parent_name | X | X | X | X | X | X | X | X | X | X |  |  |  |  |
| consistency_type | X | X | X | X | X | X | X | X | X | X | X |  |  |  |
| hypervisor_type | X | X | X | X | X | X | X | X | X |  |  |  |  |  |
| sent_completion_time | X | X | X | X | X | X |  |  |  |  |  |  |  |  |
| sent_duration | X | X | X | X | X | X |  |  |  |  |  |  |  |  |
| unique_size_bytes | X | X | X | X | X | X | X | X | X | X |  |  |  |  |
| unique_size_timestamp | X | X | X | X | X | X | X | X | X | X |  |  |  |  |
| virtual_machine_state | X | X | X | X | X | X | X | X | X | X | X | X |  |  |
| virtual_machine_type | X | X | X | X | X | X | X | X | X | X |  |  |  |  |
| GET virtual_disks | X | X | X | X | X |  |  |  |  |  |  |  |  |  |
| GET virtual_disk_partitions | X | X | X | X | X |  |  |  |  |  |  |  |  |  |
| GET virtual_disk_partition_files | X | X | X | X | X |  |  |  |  |  |  |  |  |  |
| DELETE | X | X | X | X | X | X | X | X | X | X | X | X | X | X |
| POST calculate_unique_size | X | X | X | X | X | X | X |  |  |  |  |  |  |  |
| POST cancel | X | X | X | X | X | X | X |  |  |  |  |  |  |  |
| POST copy | X | X | X | X | X | X | X | X | X | X | X | X | X |  |
| POST delete | X | X | X | X | X | X | X | X | X | X |  |  |  |  |
| POST lock | X | X | X | X | X | X | X | X | X | X | X | X | X |  |
| POST rename | X | X | X | X | X | X | X | X | X | X | X | X | X | X |
| POST restore | X | X | X | X | X | X | X | X | X | X | X | X | X | X |
| POST restore_file | X | X | X | X | X |  |  |  |  |  |  |  |  |  |
| POST restore_files | X | X | X | X | X |  |  |  |  |  |  |  |  |  |
| POST set_retention | X | X | X | X | X | X | X | X | X | X | X |  |  |  |

`cluster_groups`
================

The REST API supports the following features and functions for the `cluster_groups` object type:

| Operation | 1.13 | 1.12 | 1.11 | 1.10 | 1.9 | 1.8 | 1.7 | 1.6 | 1.5 | 1.4 | 1.3 | 1.2 | 1.1 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GET | X | X | X |  |  |  |  |  |  |  |  |  |  |  |
| POST rename | X | X | X |  |  |  |  |  |  |  |  |  |  |  |

datastores
==========

The REST API supports the following features and functions for the `datastore` object type:

| Operation | 1.13 | 1.12 | 1.11 | 1.10 | 1.9 | 1.8 | 1.7 | 1.6 | 1.5 | 1.4 | 1.3 | 1.2 | 1.1 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GET | X | X | X | X | X | X | X | X | X | X | X | X | X | X |
| Additional returned properties: |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| compute_cluster_parent_hypervisor_object_id | X | X | X | X | X | X | X | X | X | X |  |  |  |  |
| compute_cluster_parent_name | X | X | X | X | X | X | X | X | X | X |  |  |  |  |
| hypervisor_management_system | X | X | X | X | X | X | X | X |  |  |  |  |  |  |
| hypervisor_management_system_name | X | X | X | X | X | X |  |  |  |  |  |  |  |  |
| hypervisor_object_id | X | X | X | X | X | X | X | X | X | X | X | X | X |  |
| hypervisor_type | X | X | X | X | X | X | X | X | X |  |  |  |  |  |
| DELETE | X | X | X | X | X | X | X | X | X | X | X | X | X | X |
| GET standard_hosts | X | X | X | X | X | X |  |  |  |  |  |  |  |  |
| POST | X | X | X | X | X | X | X | X | X | X | X | X | X | X |
| POST resize | X | X | X | X | X | X | X | X | X | X | X | X | X |  |
| POST set_policy | X | X | X | X | X | X | X | X | X | X | X | X |  |  |
| POST share | X | X | X | X | X | X |  |  |  |  |  |  |  |  |
| Post unshare | X | X | X | X | X | X |  |  |  |  |  |  |  |  |

hosts
=====

The REST API supports the following features and functions for the `host` object type:

| Operation | 1.13 | 1.12 | 1.11 | 1.10 | 1.9 | 1.8 | 1.7 | 1.6 | 1.5 | 1.4 | 1.3 | 1.2 | 1.1 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GET | X | X | X | X | X | X | X | X | X | X | X | X | X | X |
| Additional returned properties: |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| can_rollback | X | X | X | X | X | X | X | X | X | X |  |  |  |  |
| compute_cluster_hypervisor_object_id | X | X | X | X | X | X | X | X | X | X | X | X |  |  |
| compute_cluster_name | X | X | X | X | X | X | X | X | X | X | X | X |  |  |
| compute_cluster_parent_hypervisor_object_id | X | X | X | X | X | X | X | X | X | X |  |  |  |  |
| compute_cluster_parent_name | X | X | X | X | X | X | X | X | X | X |  |  |  |  |
| current_feature_level | X | X | X | X | X | X | X | X | X | X |  |  |  |  |
| date | X | X | X | X | X | X | X | X | X | X | X | X |  |  |
| federation_ip | X | X | X | X | X | X | X | X | X | X | X |  |  |  |
| federation_mask | X | X | X | X | X | X | X | X |  |  |  |  |  |  |
| federation_mtu | X | X | X | X | X | X | X | X |  |  |  |  |  |  |
| hypervisor_management_system |  |  |  |  |  |  |  |  | X | X | X | X | X | X |
| hypervisor_management_system_name | X | X | X | X | X | X |  |  |  |  |  |  |  |  |
| infosight_configuration | X | X | X |  |  |  |  |  |  |  |  |  |  |  |
| life_remaining | X | X | X | X | X | X | X | X | X | X | X |  |  |  |
| management_mask | X | X | X | X | X | X | X | X |  |  |  |  |  |  |
| management_mtu | X | X | X | X | X | X | X | X |  |  |  |  |  |  |
| omnistack_cluster_id | X | X | X | X | X |  |  |  |  |  |  |  |  |  |
| policy_enabled | X | X | X | X | X | X | X | X | X | X |  |  |  |  |
| potential_feature_level | X | X | X | X | X | X | X | X | X | X |  |  |  |  |
| storage_ip | X | X | X | X | X | X | X | X | X | X | X |  |  |  |
| storage_mask | X | X | X | X | X | X | X | X |  |  |  |  |  |  |
| storage_mtu | X | X | X | X | X | X | X | X |  |  |  |  |  |  |
| upgrade_state | X | X | X | X | X | X | X | X | X | X |  |  |  |  |
| virtual_controller_name | X | X | X | X | X | X | X | X | X | X | X |  |  |  |
| GET capacity | X | X | X | X | X | X | X | X | X | X | X | X |  |  |
| GET hardware | X | X | X | X | X | X | X | X | X | X | X | X | X |  |
| GET metrics | X | X | X | X | X | X | X | X | X | X | X | X |  |  |
| GET virtual_controller_shutdown_status | X | X | X | X | X |  |  |  |  |  |  |  |  |  |
| POST cancel_virtual_controller_shutdown | X | X | X | X | X |  |  |  |  |  |  |  |  |  |
| POST remove_from_federation | X | X | X | X | X |  |  |  |  |  |  |  |  |  |
| POST shutdown_virtual_controller | X | X | X | X | X |  |  |  |  |  |  |  |  |  |

omnistack_clusters
==================

The REST API supports the following features and functions for the `omnistack_cluster` object type:

| Operation | 1.13 | 1.12 | 1.11 | 1.10 | 1.9 | 1.8 | 1.7 | 1.6 | 1.5 | 1.4 | 1.3 | 1.2 | 1.1 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GET | X | X | X | X | X | X | X | X | X | X | X | X | X | X |
| Additional returned properties: |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| arbiter_address | X | X | X | X | X | X | X | X | X | X | X | X | X |  |
| arbiter_connected | X | X | X | X | X | X | X | X | X | X | X | X | X |  |
| cluster_feature_level | X | X |  |  |  |  |  |  |  |  |  |  |  |  |
| connected_cluster | X | X | X | X | X |  |  |  |  |  |  |  |  |  |
| hypervisor_management_system | X | X | X | X | X | X | X | X |  |  |  |  |  |  |
| hypervisor_management_system_name | X | X | X | X | X | X |  |  |  |  |  |  |  |  |
| hypervisor_object_id | X | X | X | X | X | X | X | X | X | X | X | X |  |  |
| hypervisor_object_parent_id | X | X | X | X | X | X | X | X | X | X | X |  |  |  |
| hypervisor_object_parent_name | X | X | X | X | X | X | X | X | X | X | X |  |  |  |
| hypervisor_type | X | X | X | X | X | X | X | X | X |  |  |  |  |  |
| infosight_configuration | X | X | X |  |  |  |  |  |  |  |  |  |  |  |
| time_zone | X | X | X | X | X | X | X | X | X | X | X | X |  |  |
| upgrade_state | X | X | X | X | X | X | X | X | X | X | X |  |  |  |
| upgrade_task_id | X | X | X | X | X | X | X | X | X | X | X |  |  |  |
| version | X | X | X | X | X | X | X | X | X | X |  |  |  |  |
| GET connected_clusters | X | X | X | X | X | X | X | X | X | X | X |  |  |  |
| GET metrics | X | X | X | X | X | X | X | X | X | X | X | X | X |  |
| GET throughput | X | X | X | X | X | X | X | X | X | X | X |  |  |  |
| GET time_zone_list | X | X | X | X | X | X | X | X | X | X | X |  |  |  |
| POST set_time_zone | X | X | X | X | X | X | X | X | X | X | X | X |  |  |

policies
========

The REST API supports the following features and functions for the `policy` object type:

| Operation | 1.13 | 1.12 | 1.11 | 1.10 | 1.9 | 1.8 | 1.7 | 1.6 | 1.5 | 1.4 | 1.3 | 1.2 | 1.1 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GET | X | X | X | X | X | X | X | X | X | X | X | X | X | X |
| GET datastores | X | X | X | X | X | X | X | X | X | X | X | X | X | X |
| GET /policies/policy_schedule_report | X | X | X |  |  |  |  |  |  |  |  |  |  |  |
| GET virtual_machines | X | X | X | X | X | X | X | X | X | X | X | X | X | X |
| DELETE | X | X | X | X | X | X | X | X | X | X | X | X | X | X |
| POST policies | X | X | X | X | X | X | X | X | X | X | X | X | X | X |
| POST rename | X | X | X | X | X | X | X | X | X | X | X | X | X |  |
| POST resume | X | X | X | X | X | X | X | X | X | X |  |  |  |  |
| POST rules | X | X | X | X | X | X | X | X | X | X | X | X | X (multiple rules) | X (one rule) |
| POST suspend | X | X | X | X | X | X | X | X | X | X |  |  |  |  |
| POST impact_report/create_rules | X | X | X | X | X |  |  |  |  |  |  |  |  |  |
| POST impact_report/edit_rules | X | X | X | X | X |  |  |  |  |  |  |  |  |  |
| POST impact_report/delete_rule | X | X | X | X | X |  |  |  |  |  |  |  |  |  |
| PUT rule | X | X | X | X | X | X | X | X | X | X | X | X | X | X |

`security/certificates`
=======================

The REST API supports the following features and functions for the `security/certificates` object type:

| Operation | 1.13 | 1.12 | 1.11 | 1.10 | 1.9 | 1.8 | 1.7 | 1.6 | 1.5 | 1.4 | 1.3 | 1.2 | 1.1 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GET | X | X | X | X |  |  |  |  |  |  |  |  |  |  |
| Additional returned properties: |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| hash | X | X | X | X |  |  |  |  |  |  |  |  |  |  |
| certificate | X | X | X | X |  |  |  |  |  |  |  |  |  |  |
| subject | X | X | X | X |  |  |  |  |  |  |  |  |  |  |
| issuer | X | X | X | X |  |  |  |  |  |  |  |  |  |  |
| serialno | X | X | X | X |  |  |  |  |  |  |  |  |  |  |
| DELETE | X | X | X | X |  |  |  |  |  |  |  |  |  |  |
| POST | X | X | X | X |  |  |  |  |  |  |  |  |  |  |

tasks
=====

The REST API supports the following features and functions for the `task` object type:

| Operation | 1.13 | 1.12 | 1.11 | 1.10 | 1.9 | 1.8 | 1.7 | 1.6 | 1.5 | 1.4 | 1.3 | 1.2 | 1.1 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GET | X | X | X | X | X | X | X | X | X | X | X | X | X | X |

virtual_machines
================

The REST API supports the following features and functions for the `virtual_machine` object type:

| Operation | 1.13 | 1.12 | 1.11 | 1.10 | 1.9 | 1.8 | 1.7 | 1.6 | 1.5 | 1.4 | 1.3 | 1.2 | 1.1 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GET | X | X | X | X | X | X | X | X | X | X | X | X | X | X |
| Additional returned properties: |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| adapter_type | X | X | X | X | X | X |  |  |  |  |  |  |  |  |
| app_aware_vm_status | X | X | X | X | X | X | X | X | X | X | X |  |  |  |
| compute_cluster_parent_hypervisor_object_id | X | X | X | X | X | X | X | X | X | X |  |  |  |  |
| compute_cluster_parent_name | X | X | X | X | X | X | X | X | X | X |  |  |  |  |
| deleted_at | X | X | X | X | X | X | X | X | X |  |  |  |  |  |
| device_number | X | X | X | X | X | X | X | X | X |  |  |  |  |  |
| network_interfaces | X | X | X | X | X | X |  |  |  |  |  |  |  |  |
| network_label | X | X | X | X | X | X |  |  |  |  |  |  |  |  |
| ha_resynchronization_progress | X | X | X | X | X | X | X | X | X | X | X | X | X |  |
| host_id | X | X | X | X | X | X | X | X | X | X | X | X | X |  |
| hypervisor_allocated_capacity | X | X | X | X | X | X | X | X | X | X |  |  |  |  |
| hypervisor_allocated_cpu | X | X | X | X | X | X |  |  |  |  |  |  |  |  |
| hypervisor_consumed_cpu | X | X | X | X | X | X |  |  |  |  |  |  |  |  |
| hypervisor_consumed_memory | X | X | X | X | X | X |  |  |  |  |  |  |  |  |
| hypervisor_cpu_count | X | X | X | X | X | X | X | X | X | X |  |  |  |  |
| hypervisor_free_space | X | X | X | X | X | X | X | X | X | X |  |  |  |  |
| hypervisor_folder_name | X | X | X | X | X | X |  |  |  |  |  |  |  |  |
| hypervisor_is_template | X | X | X | X | X | X | X | X | X | X |  |  |  |  |
| hypervisor_management_system | X | X | X | X | X | X | X |  |  |  |  |  |  |  |
| hypervisor_management_system_name | X | X | X | X | X | X |  |  |  |  |  |  |  |  |
| hypervisor_total_memory | X | X | X | X | X | X | X | X | X | X |  |  |  |  |
| hypervisor_type | X | X | X | X | X | X | X | X | X |  |  |  |  |  |
| hypervisor_virtual_disk_count | X | X | X | X | X | X | X | X | X | X |  |  |  |  |
| hypervisor_virtual_machine_power_state | X | X | X | X | X | X | X | X | X | X | X | X |  |  |
| modified_at | X | X | X | X | X | X |  |  |  |  |  |  |  |  |
| ipv4_addresses | X | X | X | X | X | X |  |  |  |  |  |  |  |  |
| mac_address | X | X | X | X | X | X |  |  |  |  |  |  |  |  |
| mac_generation | X | X | X | X | X | X |  |  |  |  |  |  |  |  |
| network_interfaces | X | X | X | X | X | X |  |  |  |  |  |  |  |  |
| replica_set | X | X | X | X | X | X | X | X | X | X | X | X | X |  |
| GET backups | X | X | X | X | X | X | X | X | X | X | X | X | X | X |
| GET metrics | X | X | X | X | X | X | X | X | X | X | X | X | X |  |
| POST backup | X | X | X | X | X | X | X | X | X | X | X | X | X | X |
| POST backup_parameters | X | X | X | X | X | X |  |  |  |  |  |  |  |  |
| POST clone | X | X | X | X | X | X | X | X | X | X | X | X | X | X |
| POST move | X | X | X | X | X | X | X | X | X | X | X | X | X | X |
| POST set_policy | X | X | X | X | X | X | X | X | X | X | X | X | X | X |
| POST validate_backup_credentials | X | X | X | X | X | X |  |  |  |  |  |  |  |  |
| POST policy_impact_report/apply_policy | X | X | X | X | X |  |  |  |  |  |  |  |  |  |
| POST power_off | X | X | X |  |  |  |  |  |  |  |  |  |  |