---
title: How to create a virtual network in HPE GreenLake for Private Cloud Enterprise
date: 2022-06-07T05:34:46.180Z
featuredBlog: false
author: Vinnarasu Ganesan, Thavamaniraja S
authorimage: /img/Avatar1.svg
thumbnailimage: /img/greenlake-576x324.jpg
tags:
  - hpe-greenlake
  - hpe-greenlake-for-private-cloud-enterprise
  - cloud-architect
---
**Editor’s Note – NAME CHANGE: HPE GreenLake for Private Cloud is now part of HPE GreenLake for Private Cloud Enterprise.**

- - -


## Introduction

HPE GreenLake for private cloud is designed to deliver and help manage a private cloud. Available on the HPE GreenLake Central platform, the HPE GreenLake for private cloud is

* An HPE designed, implemented, owned, and operated private cloud that is deployed at a customer site
* Offered as a consumption-based service that enables customers to better align costs to outcomes
* An intuitive self-service portal UI is used to create and manage private cloud services such as compute, storage, and network (example described in this blog)

This blog post explains how a Customer Network Administrator can create a virtual network with a static IP pool and DHCP using NSX-T, network virtualization, and a security platform that enables the virtual cloud network in HPE GreenLake for private cloud.

## Prerequisites

Access to Network Management is controlled by a user’s role. 

With the Tenant Admin user, connect to HPE GreenLake Central, locate the HPE GreenLake for private cloud dashboard widget and click the Launch icon to open the HPE GreenLake for private cloud dashboard.

Navigate to Administration > Roles and select the role to update the permission.

From the ACCESS column of the selected role, select FULL for the below-mentioned NSX network objects:

* Infrastructure: Networks
* Infrastructure: Network IP Pools

## Understanding private cloud networking

The following illustration shows how you can use NSX objects to achieve NSX logical networking in HPE GreenLake for private cloud.

![](/img/fig-2.jpg)

The network components are as follows:

**VM**

Tenant virtual machines (VMs) are connected to Blue and Green networks.

**NSX-T Segments**

NSX-T segments are layer 2 virtual domains and there are two types of segments in an NSX-T Data Center:

* Overlay-backed segments(**Default**): This enables traffic flow between two virtual machines on different hosts. The hosts are attached to the same overlay segment and have their Layer 2 traffic carried by a tunnel between them. 
* VLAN-backed segments: This is used for uplink traffic external to the NSX-T Data Center.

   *Note: Raise HPE Support case to enable the backend infrastructure to support this type.*

**Blue-Network, Green-Network**

NSX-T segments that are attached to the tenant virtual machines and Tier1 gateway.

**Tier-1 Gateway**

Gateway with downlink connections to NSX-T segments and uplink connections to Tier-0 gateways using an internal transit network. Typically, a Tier-1 gateway is connected to a Tier-0 gateway in the northbound direction and to segments in the southbound direction.

**Internal Transit Network**

The Network enables the communication between the Tier-0 gateway and all Tier-1 gateways that are linked to it. This connectivity is established when the Tier-1 gateway is attached to the Tier-0 gateway.

**Tier-0 Gateway**

Gateway that processes the traffic between the logical and physical networks. A Tier-0 gateway has downlink connections to Tier1 gateways and uplink connections to the physical networks.

**Ext-Net**

Interface connected to Virtual Distributed Switch configured in a customer environment for enabling external connectivity from the tenant virtual machines.

## How to create a virtual network with a static IP pool

### Step 1: Create IP Pool

Locate HPE GreenLake for private cloud card in the HPE GreenLake Central dashboard and click the Launcher icon to open the HPE GreenLake for private cloud dashboard.

* Navigate to Infrastructure > Networks
* Click the IP Pools tab
* Click Add to open CREATE NETWORK POOL dialog box
* Configure the NSX-T IP pool parameters as follows:

  * **Name**: IP Pool Name
  * **Pool Type**: Select "Morpheus"
  * **IP Ranges**: Specify the IP pool address range by entering the STARTING ADDRESS and ENDING ADDRESS

![](/img/fig-1.jpg)

### Step 2: Create NSX-T Segment with Static IP Pool

Locate HPE GreenLake for private cloud card in the HPE GreenLake Central dashboard and click the Launcher icon to open the HPE GreenLake for private cloud dashboard.

* Navigate to Infrastructure > Networks
* From the Networks tab, click the ADD drop-down list, select NSX-T Segment
* From the dialog box, configure the NSX-T segment parameters as follows. For information about additional fields that are not described here, refer [User Guide](https://support.hpe.com/hpesc/public/docDisplay?docId=a00092451en_us&page=GUID-3DCFD624-DFE7-45A8-AFAC-BE004227C7EC.html).

  * **Group**: From the drop-down list, select an infrastructure user group to isolate the network at the group level. The default is Shared (all infrastructure groups)
  * **Network Service**: Select "NSX-T"
  * **Name**: Network Name
  * **ACTIVE**: Select to activate the network. Clear to deactivate the network
  * **Gateway**: (Optional) Enter the gateway address
  * **Primary DNS**: (Optional) Enter the primary DNS details
  * **Secondary DNS**: (Optional) Enter the secondary DNS details
  * **Connected Gateway**: (Optional) From the drop-down list, select a Tier1 gateway router
  * **Gateway CIDR**: Enter the Classless Inter-Domain Routing (CIDR) for the logical switch (example: 192.168.0.1/24)
  * **Transport Zone**: Select Overlay
  * **Network Pool**: Specify the IP Pool which was created in the prerequisites section

![](/img/fig-3.jpg)

* Click "Save Changes"

On successful creation, the network will list under the "Networks" tab. Use this segment for instance deployment.

![](/img/fig-10.jpg)

## How to create a virtual network with DHCP

Locate the HPE GreenLake for private cloud card in the HPE GreenLake Central dashboard and click the Launcher icon to open the HPE GreenLake for private cloud dashboard.

* Navigate to Infrastructure > Networks
* From the Networks tab, click the ADD drop-down list, select NSX-T Segment
* From the dialog box, configure the NSX-T segment parameters as follows. For information about additional fields that are not described here, refer [User Guide](https://support.hpe.com/hpesc/public/docDisplay?docId=a00092451en_us&page=GUID-3DCFD624-DFE7-45A8-AFAC-BE004227C7EC.html).

  * **Group**: From the drop-down list, select an infrastructure user group to isolate the network at the group level. The default is Shared (all infrastructure groups)
  * **Network Service**: Select "NSX-T"
  * **Name**: Network Name
  * **ACTIVE**: Select to activate the network. Clear to deactivate the network
  * **Gateway**: (Optional) Enter the gateway address
  * **Primary DNS**: (Optional) Enter the primary DNS details
  * **Secondary DNS**: (Optional) Enter the secondary DNS details
  * **Connected Gateway**: (Optional) From the drop-down list, select a Tier1 gateway router
  * **Gateway CIDR**: Enter the Classless Inter-Domain Routing (CIDR) for the logical switch (example: 192.168.0.1/24)
  * **Transport Zone**: Select Overlay
* Expand 'Subnet DHCP' Section and update the below fields:

  * DHCP Type: Local DHCP Server (default)
  * DHCP ENABLED: Select to Enable
  * DHCP Server Address: This address must not overlap the IP-ranges of the subnet, the gateway address of the subnet, or the DHCP static-binding addresses of this segment
  * DHCP Ranges: Enter the DHCP ranges as comma-separated values. Entries can be in either range format (192.168.1.10-192.168.1.100) or CIDR format (192.168.10/24).
  * DHCP LEASE TIME: (Optional) Enter the lease time. The default is one day.

![](/img/fig-4.jpg)

* Click "Save Changes"

On successful creation, the network will list under the "Networks" tab. Notice the tick mark in DHCP Column. Use this segment for instance deployment.

![](/img/fig-5.jpg)

## Manage the virtual networks

You can manage the virtual networks from the Infrastructure > Networks page. Below is the network details page of the sample network (Green-Segment) created in the previous step.

![](/img/fig-6.jpg)

Select the "Instances" tab to view the list of instances deployed using this network:

![](/img/fig-7.jpg)

Select the "Host Records" tab to view the records created for every deployment on the network.

**Grid View:**

![](/img/fig-8.jpg)

**List View:**

![](/img/fig-9.jpg)

## Summary

In this blog post, we covered how to get started with software-defined networking in HPE GreenLake for private cloud and explained the steps to create a sample virtual network with both static IP pool and DHCP. In the next article, we will cover the NSX distributed firewall feature of HPE GreenLake for private cloud and explain how to create and enforce firewall rules to restrict the network traffic to virtual machines.

Learn more about [HPE GreenLake for private cloud](https://support.hpe.com/hpesc/public/docDisplay?docId=a00092451en_us&page=HPE-GreenLake-private-cloud-networking.html) networking