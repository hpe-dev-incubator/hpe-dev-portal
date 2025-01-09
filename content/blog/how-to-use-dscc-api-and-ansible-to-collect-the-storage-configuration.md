---
title: How to use DSCC API and Ansible to collect the storage configuration
date: 2025-02-28T10:15:57.315Z
priority: -1
author: Thomas Beha
authorimage: /img/thomasbeha.jpg
disable: false
---
Capturing the current storage configuration in order to verify it against best practices or configuration rules is a task that customer requested regularly. If the customer is using Ansible as the automation platform, then there is on one hand the [HPE 3PAR Ansible module](https://github.com/HewlettPackard/hpe3par_ansible_module?tab=readme-ov-file), that is  used to create and delete hosts, volumes etc, but it is not really a solution for gathering the complete current configuration. Furthermore, this module uses the WSAPI of individual Alletra storage systems, while the HPE Data Services Cloud Console (DSCC) would be the better option to collect storage configuration data of multiple systems that might even be distributed across multiple sites. The DSCC would over a central, single location to get the data of all storage systems.