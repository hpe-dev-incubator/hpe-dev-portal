---
title: "HPE Morpheus Enterprise case study: Fix Network Pool Links via a Custom
  Task Plugin"
date: 2025-12-18T11:45:51.565Z
author: Neil van Rensburg
authorimage: /img/morpheusgreen.png
disable: false
---
![]()

In a previous [blog](https://developer.hpe.com/blog/morpheus-plugin-tutorial-how-to-build-and-compile/), we explored the basics around building and compiling HPE Morpheus Enterprise plugins. In this article, we expand on the subject by implementing a minimal Custom Task plugin. The logic will target IP Pools, where links between the host entries and the VM workloads are broken or missing.

## Problem Statement

In a nutshell, we need a way to link a ***NetworkPoolIp*** entry to a ***ComputeServer*** object, where a network interface falls within the same ***Network***/***NetworkPool***.

These reference links exist via the ***refType*** and ***refId*** properties of the ***NetworkPoolIp*** object, as shown below:

![refType and refId relationship](/img/morphblog_linknetworks_reftype_refid_small.png)

Upon provisioning, the ***refType*** property is set to the literal value of 'ComputeServer' and the ***refId*** property is assigned the ***Id*** of the ***ComputeServer*** object itself.

When a ***NetworkPool*** is migrated/changed, or added to the ***Network*** After instance provisioning, ***NetworkPoolIp*** records are created or synchronized from IPAM, without the ***refId*** link populated. This causes orphan host entries when workloads are later deleted.

To reproduce this, we will provision a single VM instance into a simple lab, then add the IP Pool to the related network, afterward.

## Normal Behavior

First, consider the normal day-today use case. We associate our network with the IP pool as shown below:

![Network with IP Pool](/img/morphblog_linknetwork_network_with_pool.png)

Should we provision a VM instance into this network, a host record entry will be created in the IP pool:

![Instance provisioned](/img/morphblog_linknetwork_instance_provisioned.png)

![Host record created](/img/morphblog_linknetwork_host_record.png)

By querying the host record via the REST API, we can see the link back to the ComputeServer within the instance:

![Host record via REST API](/img/morphblog_linknetwork_api_host_record.png)

## Provision without IP pool

To illustrate the broken reference issue, we start off by removing the network-to-IP-pool association:

![Network without pool](/img/morphblog_linknetwork_network_without_pool.png)

Then provision a VM to the network:

![Provision VM to network](/img/morphblog_linknetwork_provision_vm.png)

![Provisioned VM to network](/img/morphblog_linknetwork_provisioned_vm.png)

Next, we create a host entry manually within the pool:

![New Pool IP](/img/morphblog_linknetworks_manual_host_record.png)