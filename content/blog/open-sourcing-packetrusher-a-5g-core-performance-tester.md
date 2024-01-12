---
title: "Open-sourcing PacketRusher: A 5G Core performance tester"
date: 2023-12-18T10:04:11.852Z
featuredBlog: true
priority: 5
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
In the fast-evolving landscape of 5G technology, the demand for robust and efficient testing tools has never been higher. Enter PacketRusher, a cutting-edge 5G core Network performance testing tool. As the lead developer behind this groundbreaking project, I am thrilled to share the power and potential PacketRusher holds in revolutionizing the way we test and optimize 5G networks.

## PacketRusher

PacketRusher is a tool dedicated to the performance testing and automatic validation of 5G Core Networks. It tests a 5G Core Network via its external interfaces as defined by the 3rd Generation Partnership Project (3GPP): N1, N2 and N3 interfaces.


The tool can emulate various types of user equipment (eg. 5G phones or 5G-enabled IoT devices) on the N1 interface using the Non-access Stratum (NAS-5GS) 5G protocol. It can do stress testing of the 5G Core with up to 100k simulated user equipment doing simultaneously multiple 5G Control Plane’s procedures: Registration with authentication and Deregistration, Creation and Deletions of Protocol Data-Unit (PDU) Sessions.


These user equipements can be used together with PacketRusher’s simulated gNodeBs (eg. antennas in Radio Access Network) implementing the N2 interface. These simulated gNodeB implements a set of pre-defined procedures on top of both New Generation Application Protocol (NGAP) which allow the usage of advanced gNodeB features as user equipment handover between gNodeB with PDU Session continuity.

The other most important feature of PacketRusher is its highly performant N3 generic tunnel. Alongside its control plane testing features, PacketRusher is also able to stress test the UPF of a 5G Core with user equipment being able to do each up to 5 GB/s of userplane traffic.

All of these features of PacketRusher can be offered from a simple Linux virtual machine, that can compiled in minutes, without the needs for expensive commercial tools, or 100k phones on a table ;-)


## Architecture
Before I show you how PacketRusher works, it's important to have an understanding of the components of a minimal 5G network:

![High-level diagram of a 5G deployment](/img/high-level-diagram-of-a-5g-deployment.png "High-level diagram of a 5G deployment")

To summarize, there are essentially three main components:   
- User equipment, which is any 5G device used directly by a user to communicate. For example, a smartphone or an IoT device.   
- The gNodeB, which is the radio used for wireless communication between the User Equipment and the 5G network core.   
- And finally, the 5G network core itself, which manages all mobile network functionalities. This is the component that will manage phone authentication in the network, quality of service, routing to the data network, and so on...   


![﻿High-level diagram of the PacketRusher's architecture and its interaction with a 5G Core's AMF and UPF](/img/packetrusher-architecture.png "﻿High-level diagram of the PacketRusher's architecture and its interaction with a 5G Core's AMF and UPF")

PacketRusher's behavior is quite simple; it essentially simulates two of the three major components of a 5G network:   
- the User Equipments, i.e. the phones   
- and the gNodeB, i.e. the antennas.   
- At the same time, it connects to the 5G Core via its external interfaces, as if it were a black box.   
PacketRusher simulates both components en masse, which means it can simulate several user devices and gNodeBs at the same time.

## Community contributions

Excitingly, PacketRusher has caught the attention of a leading industry player. Orange, a key player in the telecommunications sector, has recognized the potential of PacketRusher and is actively integrating it into their open-source GitHub project, [toward-5gs](https://github.com/Orange-OpenSource/towards5gs-helm).


I would also like to mention the outstanding work of Github User [s5uishida](https://github.com/s5uishida) who made a [high-quality performance comparison](https://github.com/s5uishida/simple_measurement_of_upf_performance) of open-source UPF using PacketRusher. 

## Join the 5G revolution

How 5G evolves will be based on community collaboration and you're invited to be a part of this exciting journey. Whether you are a seasoned developer, a researcher, or simply passionate about the possibilities of 5G, your contributions can make a significant impact.

To get started, visit the [GitHub repository](https://github.com/HewlettPackard/PacketRusher) to access the source code, documentation, and engage with the community. Your feedback, suggestions, and contributions are invaluable in shaping the future of 5G technology.

At HPE, we are committed to pushing the boundaries of innovation, and with the release of PacketRusher as open-source, we are laying the foundation for a new era of connectivity.   

PacketRusher is not just a testing tool; it's a community-driven effort to push the boundaries of 5G technology. Let's build the future of 5G together!

[V﻿alentin D'Emmanuele](https://www.linkedin.com/in/valentin-d-emmanuele/),   
Lead Developer and Maintainer, PacketRusher