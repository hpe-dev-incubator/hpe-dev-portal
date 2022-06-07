---
title: How to create a Virtual Network in HPE GreenLake for private cloud
date: 2022-06-07T05:34:46.180Z
featuredBlog: true
author: Vinnarasu Ganesan, Thavamaniraja S
authorimage: /img/tmr_2.jpg
thumbnailimage: /img/greenlake-576x324.jpg
---
## Introduction

HPE GreenLake for private cloud is designed to deliver and help manage a private cloud. Available on the HPE GreenLake Central platform, the HPE GreenLake for private cloud is

* An HPE designed, implemented, owned, and operated private cloud that is deployed at a customer site
* Offered as a consumption-based service that enables customers to better align costs to outcomes
* An intuitive self-service portal UI to create and manage private cloud services such as compute, storage, and network (example described in this blog)

This blog focuses explains the steps to create a virtual network with a static IP pool and DHCP using NSX-T, network virtualization and a security platform that enables the virtual cloud network in HPE GreenLake for private cloud.

## Understanding private cloud networking

The following illustration shows how you can use NSX objects to achieve NSX logical networking in HPE GreenLake for private cloud.

![](/img/fig-2.jpg)

The network components are as follows:

##### **VM**

Tenant virtual machines (VMs) are connected to Blue and Green networks.

##### **NSX-T Segments**

NSX-T segments are layer 2 virtual domains and there are two types of segments in an NSX-T Data Center

* VLAN-backed segments: This is used for uplink traffic external to the NSX-T Data Center.
* Overlay-backed segments: This enables traffic flow between two virtual machines on different hosts. The hosts are attached to the same overlay segment and have their Layer 2 traffic carried by a tunnel between them.

##### **Blue-Network, Green-Network**

NSX-T segments that are attached to the tenant virtual machines and Tier1 gateway.

##### **Tier-1 Gateway**

Gateway with downlink connections to NSX-T segments and uplink connections to Tier-0 gateways using an internal transit network. Typically, a Tier-1 gateway is connected to a Tier-0 gateway in the northbound direction and to segments in the southbound direction.

##### **Internal Transit Network**

The Network enables the communication between the Tier-0 gateway and all Tier-1 gateways that are linked to it. This connectivity is established when the Tier-1 gateway is attached to the Tier-0 gateway.

##### **Tier-0 Gateway**

Gateway that processes the traffic between the logical and physical networks. A Tier-0 gateway has downlink connections to Tier1 gateways and uplink connections to the physical networks.

##### **Ext-Net**

Interface connected to Virtual Distributed Switch configured in customer environment for enabling external connectivity from the tenant virtual machines.

## Prerequisites

Role: Customer network admin with the following role permission to enable access to NSX network objects:

* Infrastructure: Networks
* Infrastructure: Network IP Pools

## How to create a virtual network with a static IP pool

### 1.Create IP Pool

Locate HPE GreenLake for private cloud card in the HPE GreenLake Central dashboard and click the Launcher icon to open the HPE GreenLake for private cloud dashboard.

* Navigate to Infrastructure &gt; Networks
* Click the IP Pools tab
* Click Add to open CREATE NETWORK POOL dialog box
* Configure the NSX-T IP pool parameters as follows

  * Name: IP Pool Name
  * Pool Type: Select &quot;Morpheus&quot;
  * IP Ranges: Specify the IP pool address range by entering the STARTING ADDRESS and ENDING ADDRESS

    ![](/img/fig-1.jpg)