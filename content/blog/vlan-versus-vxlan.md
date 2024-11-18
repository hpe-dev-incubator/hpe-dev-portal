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
In a modern data center or large-scale network environment, **network segmentation** and isolation are key to optimizing both **performance and security**. **Two popular technologies** that address this need are **VLANs and VXLANs**, but they serve slightly different purposes and have distinct configurations. Understanding the nuances of both is essential for network engineers, systems administrators, and architects when deciding how to structure their networks.

While the two technologies appear very similar from a high level, they **operate at different layers** in the networking stack and differ in capabilities, scalability, and use cases. In this post, I'll define what a VLAN and VXLAN is, provide details showing their headers, show how they are configured and benefits of using VXLAN over VLAN. 

### What is VLAN?

A **VLAN (Virtual Local Area Network)**, operates at **Layer 2** and segments a physical network into multiple isolated networks, through the use of **VLAN-ID**, which can range from **<1-4096> (12-bit)**. Different ports on a networking device can be assigned to different VLAN-IDs. The networking device ensures that the incoming or outgoing traffic is forwarded based on the VLAN-ID that is present in the ethernet frames.

So, if the physical network is defined as Layer 1, the segmented physical network using VLANs is the Layer 2 data link layer.

### What is VXLAN?

A **VXLAN (Virtual Extensible Local Area Networks)**,  operates as an encapsulation protocol designed to **extend Layer 2 networks over Layer 3** infrastructure. Due to this encapsulation, VXLAN is also called IP tunneling protocol to carry Layer 2 traffic over Layer 3 network for **wide area deployments**. 

VXLAN segment is identified by **VNI (Virtual Network Identifier)** which is 24 bits. The Layer 2 Ethernet frames are encapsulated by **VNI outer headers**. The VXLAN encapsulation is done by **VTEP (VXLAN tunnel end point)**.  A networking device which is configured as VTEP adds the VXLAN header to the Ethernet frame. 

#### How VXLAN encapsulation works?

The VTEP  must be configured on a networking device which encapsulate and decapsulates the ethernet frames into VXLAN packets. The intermediate networking devices receiving these VXLAN packets are routed as any other Layer 3 Packet.

The VXLAN encapsulated packet or the VNI outer headers contains:

**1. Other Ethernet Header (Layer 2)**

* **Destination MAC Address:** The MAC address of the next-hop device.
* **Source MAC address:** The MAC address of the VTEP device sending the encapsulated frame.
* **Ether Type:** Typically, `0x0800` for IPv4 or `0x86DD` for IPv6.

**2. Outer IP Header (Layer 3)**

* **Source IP Address**: The IP address of the VXLAN tunnel endpoint (VTEP) originating the packet.
* **Destination IP Address**: The IP address of the remote VTEP, where the VXLAN frame is being sent.
* **Protocol**: Usually, this is set to `0x11`, which signifies UDP (User Datagram Protocol).

**3. Outer UDP Header (Layer 4)**

* **Source Port**: Typically randomized by the sending VTEP.
* **Destination Port**: Fixed at `4789`, which is the well-known port for VXLAN.
* **Length**: Specifies the length of the UDP datagram, including the VXLAN header.

**4. VXLAN Header  (Layer 4)**

* The VXLAN header is inserted within the UDP payload.
* **VXLAN Network Identifier (VNI, 24 bits)**: A 24-bit field used to identify the VXLAN segment or virtual network. 

**5. Original Ethernet Frame (Layer 2)**

* This actual Ethernet frame including the originated Source MAC address, Destination MAC Address, Ether Type and it may contain the VLAN Header, IP Header, UDP Header and Application data.

#### Why do we need VXLAN?

With VLANs being used for segmentation across and within data centers, the Spanning Tree Protocol (STP) is used to build a loop-free logical topology for Ethernet networks. The basic function of STP is to prevent bridge loops and the broadcast radiation that results from them. **STP disables links** that are not part of the spanning tree, leaving a single active path between two network nodes. This can result in a **large number of disabled links**, an issue that can be **resolved by using a Layer 3 virtual tunnel over the Layer 2 network**.

Another issue that **VXLANs resolve** is that of **scalability**. A 12-bit VLAN ID is used in the Ethernet data frames to divide the larger Layer 2 network into multiple broadcast domains. As such, VLANs can only be used for data centers that require fewer than 4094 VLANs, limiting their scalability.

Consider a situation where there are 24 or 48 servers connected to a Top-of-the-Rack (ToR) switch. Instead of just one MAC address per server link, the **switch must learn all the MAC addresses of the virtual machines (VMs)** communicating across the servers. This **inadequate MAC address table issue** would be **addressed with the Layer 3 tunnel over the Layer 2 frames**.  

### VLAN Header in Ethernet Frame

This image illustrates the structure of an **Ethernet frame with a VLAN tag**. As you can see, the VLAN header is inserted after the source MAC address. VLAN header contains a **4-byte VLAN tag field used to identify the VLAN-ID** from which the packet originated. The format of VLAN-tagged frames is defined in IEEE 802.1Q standard.

![VLAN Header](/img/picture1.png "VLAN Header")

* The **VLAN tag** displays the following fields:

  * **TPID** – By Default VLAN Tagged packets has 0x8100.
  * **Priority** – To indicate the 802.1p priority of the frame
  * **CFI(Canonical Format Indicator)** – By default it is 0. 0 indicates MAC addresses are in standard format. 1 indicated non-standard format.
  * **VLAN-ID** – 12 Bit value to identify the VLAN.

### VXLAN Header in Ethernet Frame

This image illustrates the structure of VXLAN encapsulated Ethernet frame including the VXLAN header.

![VXLAN Header](/img/picture2.png "VXLAN Header")

* **VXLAN Header** contains the following fields:

  * **Flags** –  The `"I"` bit would be set to 1 for a valid VXLAN Network ID (VNI).  The other reserved 7 bits would be set to zero.
  * **VXLAN-ID** –  This is the 24 bit value used to designate the VXLAN overlay network.

### VLAN and VXLAN Configuration:

To understand VXLAN further, let us go through the **configurations of VLAN and VXLAN, VNI and VTEP.**  Each VNI would be mapped with the VLAN it is carrying.

![VLAN, VXLAN Configuration](/img/picture3.png "VLAN, VXLAN Configuration")

### FAQs

1. Will VXLAN replace VLAN standard?

   * VLAN standard is specified in the IEEE 802.1Q standard by IEEE. VXLAN standard is specified in the RFC 7438 by IETF. VXLAN encapsulates the VLAN tagged packet with four outer headers to transmit the packet in IP based network. It does not replace the VLAN standard.
2. Does VXLAN always have an outer VLAN header?

   * The outer VLAN header in VXLAN headers is optional. It is based on the deployment scenario.
3. Does VXLAN only solve the scalability issue? 

   * Apart from scalability issues, VXLAN addresses the issues below.
   * VXLAN encapsulated packet contains IP header. So, the VXLAN technology is used for having IP based traffic in core network.
   * The VNI (VXLAN Network Identifier) serves as a unique identifier for a Layer 2 segment (or virtual network) within a VXLAN environment. VXLAN based network segmentation which solves two major issues mentioned below:
   * This allows the MAC addresses of devices (such as virtual machines or VMs) within different VXLAN segments to overlap without causing any conflict or risk of traffic "crossover" between virtual networks.
   * This allows multiple VMs to exist within the same physical Layer 3 network but remain logically isolated in their own VXLAN segment, even if they have overlapping IP addresses and MAC addresses.
4. What’s the difference between QinQ and VXLAN?

   * QinQ (also known as 802.1ad or stacked VLANs) is a Layer 2 technology that adds an outer VLAN tag to the original Ethernet frame, allowing for a hierarchical VLAN structure. This technology is used in service provider environments, where multiple customers need to share the same physical network while maintaining their own isolated virtual networks.VXLAN is primarily used in data centers and cloud networks to create large-scale virtualized Layer 2 networks over a Layer 3 network.
   * VXLAN is primarily used in data centers and cloud networks to create large-scale virtualized Layer 2 networks over a Layer 3 network.





#### Summary

To summarize, both **VLAN and VXLAN** are valuable tools for **network segmentation**, but they serve different needs. VLANs remain a simple and effective choice for smaller, less complex networks, while VXLAN provides the **scalability and flexibility** needed for modern, distributed, and virtualized environments. Understanding the technical differences in configuration and their respective use cases will help you choose the right solution for your network architecture, ensuring optimal performance, security, and scalability. Both VLAN and VXLAN are used together to solve scalability issues and to **overcome the limitations of VLAN**.  

To learn more about VLANs and VXLANs, please check out this documentation here ([https://www.arubanetworks.com/techdocs/AOS-CX/10.12/PDF/vxlan.pdf)](https://www.arubanetworks.com/techdocs/AOS-CX/10.12/PDF/vxlan.pdf)