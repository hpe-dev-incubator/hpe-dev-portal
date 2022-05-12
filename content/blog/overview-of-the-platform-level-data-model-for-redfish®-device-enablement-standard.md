---
title: Overview of the Platform Level Data Model for Redfish® Device Enablement
  standard
date: 2022-05-12T16:04:30.750Z
author: François Donzé
authorimage: /img/fdz-photoprofile.png
---
## Introduction

In 2019, the [Distributed Management Task Force](https://dmtf.org) (DMTF) published the first version of the Platform Level Data Model for Redfish Device Enablement ([PLDM for RDE](https://www.dmtf.org/dsp/DSP0218)). This Redfish standard started to be implemented in HPE iLO 5 based servers (Gen10 and Gen10 Plus) as well as in several storage controller and network adapter option cards (i.e HPE Smart Array).

This blog post positions the PLDM for RDE standard within the Redfish service, explains its benefits and provides practical configuration examples.

## Introduction to the Platform Level Data Model protocol suite

The DMTF PLDM protocol suite is composed of several [documents](https://www.dmtf.org/standards/pmci), and defines its base specification in the [DSP0240](https://www.dmtf.org/sites/default/files/standards/documents/DSP0240_1.1.0.pdf) document. In the introduction paragraph, you can read:

*PLDM is designed to be an effective interface and data model that provides efficient access to low-level platform inventory, monitoring, control, event, and data/parameters transfer functions. For example, temperature, voltage, or fan sensors can have a PLDM representation that can be used to monitor and control the platform using a set of PLDM messages. PLDM defines data representations and commands that abstract the platform management hardware.*

If you compare Redfish and PLDM you could say that Redfish defines server modeling and management communication from a remote location, while PLDM defines server component modeling and communication between those internal components.

The data modeling and the communication between Management Controllers (MC) and components like fans or sensors is simpler when compared to complex devices like option cards. To address component specificities and complexity, PLDM introduces generic types in which server components can be placed.  As an example, storage and network controllers, also called "devices" in PLDM terminology, are part of PLDM type six. The PLDM for Redfish Device Enablement standard is published in the [DSP0218](https://www.dmtf.org/dsp/DSP0218) document.

 In addition, the [PLDM base](https://www.dmtf.org/sites/default/files/standards/documents/DSP0240_1.1.0.pdf) specification does not mandate any transport protocol to transfer messages from one component to another. Theoretically, PLDM messages can be transferred by any transport protocol, including the [Management Component Transport Protocol](https://www.dmtf.org/dsp/DSP0239) (MCTP). Hence, a specific document ([DSP0241](https://www.dmtf.org/dsp/DSP0241)) had to be created to define the binding of PLDM messages over MCTP to complete the protocol suite.

## Operational model without PLDM for RDE

Generally speaking, most of today servers are architected around one or more Management Controllers. The majority of the server components are tightly coupled with the MC that has a total control on them in terms of monitoring and configuration. Typical examples are temperature sensors or power supplies. Other more complex components like option cards, also called "external provider devices", are loosely coupled with the MC.

Without the implementation of the PLDM for RDE standard, the MC (iLO) has
a partial knowledge of external provider device properties and capabilities. This knowledge has been hardcoded in the Redfish service of the iLO firmware. As a consequence, Redfish clients can only get and set the properties referenced in the MC. For an exhaustive management of an external provider device, specific applications like the HPE Smart Storage Administrator (SSA) or the HPE MegaRaid Storage Administrator (MRSA) are needed.

This paradigm (implementation of device properties in the iLO firmware) generates a lock step dependency between the iLO firmware and the device firmware; an update of the device firmware may lead to inaccurate iLO responses or errors if the iLO is not updated with a firmware embedding the new or modified device features.

The picture below shows an iLO based server with two network adapters and one storage adapter. The iLO firmware is in sync with the storage device and one network adapter. This same level of firmware is represented with a green "F". The second network adapter firmware is not in sync with the iLO firmware and, is represented with a red "F". A red cross between the iLO and the un-synced firmware represents potential communication problems.

In addition, this picture mentions the [Bus Master Interface Command](https://data.epo.org/publication-server/document?iDocId=698778&iFormat=0) (BMIC) and the Discovery and Configuration via iLO (DCi) protocols that are respectively patented and HPE proprietary protocols.

Using proprietary protocols between the MC and an external provider device, require their implementation in both the MC and the external provider device. This is a constraint imposed to the external providers who have to implement all the specific protocols of all the computer makers they want to support.

Moreover, device configuration is performed in two steps as explained in this [blog post](https://developer.hpe.com/blog/storage-management-with-redfish/): 1) the MC stores the modifications in a dedicated location. 2) The modifications are uploaded to the device during next server reboot. This reboot requirement is another drawback generated by the lack of PLDM implementation.

![Operational model without PLDM for RDE](/img/withoutpldmrde.png "Operational model without PLDM for RDE")

As a summary, the operational model without PLDM for RDE introduces the following problems:

* firmware lock step dependency between iLO and devices
* partial knowledge of device properties implemented iLO firmware
* use of proprietary communication protocols between iLO and devices
* Reboot required to load new device configuration settings