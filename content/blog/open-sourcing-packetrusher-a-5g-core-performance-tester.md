---
title: "Open-sourcing PacketRusher: A 5G Core performance tester"
date: 2023-12-13T09:44:43.865Z
author: Valentin D'Emmanuele
authorimage: /img/profile.png
thumbnailimage: /img/thumbnail.png
disable: false
tags:
  - opensource
  - 5g
  - gnodeb
  - ue
  - simulator
---
In the fast-evolving landscape of 5G technology, the demand for robust and efficient testing tools has never been higher. Enter PacketRusher, a cutting-edge 5G Core Network performance testing tool. As the lead developer behind this groundbreaking project, I am thrilled to share the power and potential PacketRusher holds in revolutionizing the way we test and optimize 5G networks.

## PacketRusher
PacketRusher is a tool dedicated to the performance testing and automatic validation of 5G Core Networks using simulated UEs (user equipments) and gNodeBs (5G base station). It enables users to tests 5G Core Networks with up to 100k simulated UEs simultaneously all from a simple virtual machine, without the needs for expensive commercial tools, or 100k phones on a table ;-)

## Features
* Simulate multiple UEs and gNodeB from a single tool
  * We tested up to 10k UEs!
* Supports both N2 (NGAP) and N1 (NAS) interfaces for stress testing
* --pcap parameter to capture pcap of N1/N2 traffic
* Implements main control plane procedures:
  * Supports UE attach/detach (registration/authentifcation/security mode) procedures
  * Supports Create/Delete PDU Sessions,  up to 15 PDU Sessions per UE
  * Supports Roaming
* Implements high-performant N3 (GTP-U) interface
  * Generic tunnel supporting all kind of traffic (TCP, UDP, Video…)
    * We tested iperf3 traffic, and Youtube traffic through PacketRusher
    * We roughly reach 5 GB/s per UE, which is more than what a real UE can achieve.
* Integrated all-in-one mocked 5GC/AMF for PacketRusher's integration testing


![High-level diagram of a 5G deployment](/img/high-level-diagram-of-a-5g-deployment.png "High-level diagram of a 5G deployment")

![﻿High-level diagram of the PacketRusher's architecture and its interaction with a 5G Core's AMF and UPF](/img/packetrusher-architecture.png "﻿High-level diagram of the PacketRusher's architecture and its interaction with a 5G Core's AMF and UPF")

## Community contributions

Excitingly, PacketRusher has caught the attention of a leading industry player. Orange, a key player in the telecommunications sector, has recognized the potential of PacketRusher and is actively integrating it into their open-source GitHub project, [toward-5gs](https://github.com/Orange-OpenSource/towards5gs-helm).\
We can also mention the outstanding work of Github User [s5uishida](https://github.com/s5uishida) who made a [high-quality performance comparison](https://github.com/s5uishida/simple_measurement_of_upf_performance) of open-source UPF using PacketRusher.


## Join the 5G Revolution

We believe that the future of 5G is a collaborative one, and we invite you to be a part of this exciting journey. Whether you are a seasoned developer, a researcher, or simply passionate about the possibilities of 5G, your contributions can make a significant impact.\
To get started, visit our [GitHub repository](https://github.com/HewlettPackard/PacketRusher) to access the source code, documentation, and engage with the community. Your feedback, suggestions, and contributions are invaluable in shaping the future of 5G technology.\
At HPE, we are committed to pushing the boundaries of innovation, and with the release of PacketRusher as open-source, we are laying the foundation for a new era of connectivity.   

Let's build the future of 5G together!

[V﻿alentin D'Emmanuele](https://www.linkedin.com/in/valentin-d-emmanuele/),\
Lead Developer and Maintainer, PacketRusher