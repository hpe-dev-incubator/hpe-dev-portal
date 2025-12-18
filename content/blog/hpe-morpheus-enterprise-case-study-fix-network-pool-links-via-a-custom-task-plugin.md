---
title: "HPE Morpheus Enterprise case study: Fix Network Pool Links via a Custom
  Task Plugin"
date: 2025-12-18T11:45:51.565Z
author: Neil van Rensburg
authorimage: /img/Avatar1.svg
disable: false
---
In a previous [blog](https://developer.hpe.com/blog/morpheus-plugin-tutorial-how-to-build-and-compile/), we explored the basics around building and compiling HPE Morpheus Enterprise plugins. In this article, we expand on the subject by implementing a minimal Custom Task plugin. The logic will target IP Pools, where links between the host entries and the VM workloads are broken or missing.

## Problem Statement

In a nutshell, we need a way to link a NetworkPoolIp entry to a ComputeServer object, where a network interface falls within the same Network/NetworkPool.

These reference links exist via the refType and refId properties of the NetworkPoolIp object, as shown below:

![refType and refId relationship](/img/morphblog_linknetworks_reftype_refid_small.png)

Upon provisioning, the refType property is set to the literal value of 'ComputeServer' and the refId property is assigned the Id of the ComputeServer object itself.

When a NetworkPool is migrated/changed, or added to the Network After Instance provisioning, NetworkPoolIp records are created or synchronized from IPAM, without the refId link populated. This causes orphan host entries when workloads are later deleted.

To reproduce this, we will provision a single VM instance into a simple lab, then add the IP Pool to the related network, afterward.

## Normal Behavior

First, consider the normal day-today use case. We associate our network with the IP pool as shown below: