---
title: VLAN Versus VXLAN
date: 2024-11-11T14:57:37.063Z
author: Indira Manthri
authorimage: /img/indira_manthri.jpg
disable: false
tags:
  - aruba
  - aruba-central
  - networking
---
## Contents

This technical blog gives insight on basic understanding of VLAN and VXLAN and the purpose achieved by using VLAN and VXLAN. It is interesting to compare these two features as they look similar from top level but there is lot of difference in the networking layer they are used and the way the VLAN, VXLAN headers are embedded in the packet and the scalability issues resolved by these two features. A quick look into the sample configuration provided in this blog for inquisitive networking colleagues.

### What is VLAN

VLAN – Virtual Local Area Network – Layer 2 which segments a physical network into multiple isolated networks. This is achieved by VLAN-ID which can range from <1-4096> which is 12 bit. Different ports on a networking device can be associated to different VLAN-IDs and the networking device would ensure that the incoming/outgoing traffic is forwarded based on the VLAN-ID which is present in the ethernet frames.

So, if the physical network is layer-1, the physical network segmented using VLANs is called layer-2 data link layer.

### What is VXLAN

VXLAN – Virtual Extensible Local Area Networks – Layer 2 over Layer 3 network
VXLAN segment is identified by VNI (Virtual Network Identifier) which is 24 bits. The layer-2 ethernet frames are encapsulated by VNI outer headers. Due to this encapsulation, VXLAN is also called tunneling. The VXLAN tunnel end point is called VTEP. VTEPs encapsulate and decapsulates the ethernet frames into VXLAN packets. The intermediate networking devices receiving these VXLAN packets are routed as any other Layer3 Packet. 

### Why there is a need for VXLAN:

With VLANs being used for segmentation across and within the data centers, spanning tree protocol (STP) will be used for forming loop-free topology. STP disables few links which also results in large number of disabled links.
This issue would be solved by using a Layer-3 virtual tunnel over the layer-2 network.

A 12-bit VLAN ID is used in the Ethernet data frames to divide the larger Layer 2 network into multiple broadcast domains.  VLANs could be used only for data centers that require fewer than 4094 VLANs. So, scalability issue is resolved using VXLAN.

There could be 24 or 48 servers connected to the Top-of-the-Rack (ToR) switch. Instead of just one MAC address per server link, the switch must learn all the MAC addresses of the virtual machines (VMs) communicating across the servers. This inadequate MAC address table issue would be addressed with the layer3 tunnel over the layer2 frames.

VXLAN is a tunneling mechanism over layer2 ethernet frames. The encapsulation will be known to VTEPs alone and the VMs would not see it.

### VLAN Header in Ethernet Frame

![VLAN Header](/img/picture1.png "VLAN Header")

* The ethernet frame has 4 bytes VLAN tag field to identify the VLAN-ID that the packet originated from. The format of VLAN-tagged frames is defined in IEEE 802.1Q standard.

* The VLAN TAG has below fields:
  a. TPID – By Default VLAN Tagged packets has 0x8100. b.	Priority – To indicate the 802.1p priority of the framec.	CFI – By default it is 0. 0 indicates MAC addresses are in standard format. 1 indicated non-standard format.

### VXLAN Header in Ethernet Frame

![VXLAN Header](/img/picture2.png "VXLAN Header")

* The entire ethernet frame including DMAC, SMAC and IP-header or IPv6 header and UDP header is encapsulated with four headers:
  outer ethernet header, outer IP-header, outer UDP Header and VXLAN Header.

* VXLAN Header has the following fields
  Flags: I bit would be set to 1 for a valid VXLAN Network ID (VNI).  The other reserved 7 bits would be set to zero.
  o	VXLAN-ID: This is the 24 bit value used to designate the VXLAN overlay network.

### VLAN and VXLAN Configuration:

To understand VXLAN further, let us go through the configurations of VLAN and VXLAN. 
Each VNI would be mapped with the VLAN it is carrying.

![VLAN, VXLAN Configuration](/img/picture3.png "VLAN, VXLAN Configuration")

### FAQs

1. Will VXLAN replace VLAN standard?
   VLAN standard is specified in IEEE 802.1Q standard by IEEE.
   VXLAN standard is specified in RFC 7438 by IETF.
   VXLAN encapsulates the VLAN tagged packet with four outer headers to transmit the packet in IP based network. It does not replace the VLAN standard.
2. Does VXLAN always have outer VLAN header?
   The outer VLAN header in VXLAN headers is optional. It is based on the deployment scenario.
3. Does VXLAN only solve the scalability issue? 
   Along with scalability issue, VXLAN is used for having IP based traffic in core network. 
   As VXLAN is used for network segmentation which solves two major issues:
   Allows multiple VMs to share a single physical network without seeing each other’s traffic for the reuse of IP addresses.
   The VNI identifies the scope of the inner MAC frame originated by the individual VM.  Thus, it could have overlapping MAC addresses across VXLAN segments but never have traffic "cross over" since the traffic is isolated using the VNI.
4. What’s the difference between QinQ and VXLAN?
   QinQ and VXLAN are protocols designed for achieving virtual segmentation of physical network.
   QinQ adds an outer VLAN header on top of the original ethernet frame. This also solves scalability issues.
   Whereas VXLAN is tunnelling mechanism which is primarily layer3 over layer2 ethernet frame. VXLAN also adds outer UDP header.

To summarize, VLAN and VXLAN are used together to solve scalability issues and to overcome the limitations of VLAN.