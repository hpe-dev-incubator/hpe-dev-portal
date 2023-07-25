---
title: Benefits of the Platform Level Data Model for Firmware Update Standard
date: 2022-06-07T16:35:17.136Z
author: François Donzé
authorimage: /img/fdz-photoprofile.png
tags:
  - ilo-restful-api
  - Redfish
---
### Updated July 25, 2023

## Introduction

In 2016, the [Distributed Management Task Force](https://dmtf.org) published the first version of the Platform Level Data Model for Firmware Update Specification ([PLDM for FWUPD](https://www.dmtf.org/dsp/DSP0267)). This DMTF standard started to be implemented in the Redfish® service of HPE iLO 5 version 2.30.

The best definition of PLDM for FWUPD is provided in the introduction paragraph of the [DSP0267](https://www.dmtf.org/sites/default/files/standards/documents/DSP0267_1.1.0.pdf) specification document:

"*The Platform Level Data Model (PLDM) Firmware Update Specification defines messages and data structures for updating firmware or other code objects maintained within the firmware devices of a platform management subsystem. Additional functions related to the sequence of identifying and transferring the firmware, are also defined.*"

This article explains how this standard simplifies and enhances the update firmware process of servers implementing it for the benefit of end customers, firmware suppliers and computer makers.

For more architecture detail concerning PLDM, read the [Overview of the Platform Level Data Model for Redfish Device Enablement Standard](https://developer.hpe.com/blog/overview-of-the-platform-level-data-model-for-redfish%C2%AE-device-enablement-standard/) (PLDM for RDE) blog post.

## Classification of the different firmware update types

Computer firmware update is a complex process involving several types of objects in different contexts. An attempt to explain how the Redfish service of HPE iLO implements this process is presented in the following three blog posts:

* [HPE firmware updates: Part 1 - File types and Smart Components](https://developer.hpe.com/blog/hpe-firmware-updates-part-3-the-redfish-update-service/) 

* [HPE firmware updates: Part 2 - Interaction in operating modes](https://developer.hpe.com/blog/hpe-firmware-updates-part-2-interaction-in-operating-modes/) 

* [HPE firmware updates: Part 3 - The Redfish update service](https://developer.hpe.com/blog/hpe-firmware-updates-part-3-the-redfish-update-service/) 

Although the above articles provide many definitions, acronyms and their relationship with the firmware update process, I will use, in this blog post, a different approach to this process than the one used in the three articles mentioned above.

Firmware updates can be classified in four types called A, B, C and D. This classification is HPE specific but you may read or hear references to it, like in the [HPE Redfish API Reference Document](https://servermanagementportal.ext.hpe.com/docs/redfishservices/ilos/ilo6/ilo6_145/ilo6_hpe_resourcedefns145/#configuration).

### Type A firmware update

In this type of firmware update, the firmware can be flashed to its destination component by the iLO and become active without any server reboot required.

Examples of firmware falling in this category:

* iLO firmware 

* Power Supply firmware 

* PLDM firmware 


### Type B

Firmware update of type B is similar to type A, but requires a host server reset for the firmware to become active.

Examples of type B firmware:

* Unified Extensible Firmware Interface (UEFI) firmware 

* Complex Programable Logic Devices (CPLD) firmware 


### Type C

This firmware type contains firmware flashed by the UEFI. A system reboot is required for the new firmware to become active.

Examples:

* Trusted Platform Module (TPM) firmware 

* Non Volatile DIMM firmware 


### Type D

UEFI and run time agents, like the Smart Update Manager (SUM) or the Smart Update Tool (SUT)) can flash the firmware content. This type of firmware update may require a system restart.

Examples:

* Smart Array controller firmware 

* Network Interface Cards (NICs) firmware 


> Note: devices associated to a type D firmware update are called *type-D devices*.

## Added value of PLDM for FWUPD

When PLDM for FWUPD is not implemented in a Redfish service (i.e. iLO 5 firmware prior to version 2.30), or, if a type D firmware package does not support PDLM for FWUPD, the target device is flashed by a run time agent (SUM or SUT). If no run time agent is present, the firmware cannot be updated as explained in the second  [part](https://developer.hpe.com/blog/hpe-firmware-updates-part-2-interaction-in-operating-modes/) of the above blog post list.

When PLDM for FWUPD is supported by both the iLO Redfish service and a firmware package of a type-D device, the firmware package falls in type A. As a result, the iLO can flash the bits and no server reboot is required to activate them anymore.

The advantage of the move from type D to type A has several important consequences:

* No downtime of the server 

* Faster update process 

* No need to have an operating system installed 

* No need of run time agents 


### How do I recognize a PLDM for FWUPD capable package ?

PLDM for FWUPD capable packages have a `.fwpkg` extension. Some of them specifically mention `PLDM` or `pldm` in their filename like the HPE MCX512F-ACHT Mellanox Adapter package:  `16_32_1010-MCX512F-ACH_Ax_Bx.pldm.fwpkg`. However, to be sure that a firmware package supports PLDM for FWUPD, you have to extract its `payload.json` file and look for the `UpdatableBy` and `PLDMImage` key/values as shown in the next picture. The content of this file clearly mentions that the firmware is a PLDM image and that it can be updated by the Baseboard Management Controller (BMC). It also specifies that no reset of the server is required, which confirms that this context is of type A.

![Partial extract of a PLDM for FWUPD payload.json file](/img/payloadofpldmimage.png "Partial extract of a PLDM for FWUPD payload.json file")

## Conclusion

By  transforming type-D devices into type-A, the Platform Level Data Model for Firmware Update specification provides a real benefit to end customers as no more server reboot is required. Firmware providers, too, can take advantage of this new standard, as they don't need to adapt their flash tools to each computer integrators' supporting their devices. Finally, computer makers don't need to provide run time agents supporting firmware provider flash tools.

In addition to the drastic simplification and enhancement of firmware management, the PLDM DMTF standard enhances and simplifies external device supplied devices, in terms of monitoring and configuration. Read the [PLDM for RDE](https://developer.hpe.com/blog/overview-of-the-platform-level-data-model-for-redfish®-device-enablement-standard) article to better understand how.

As previously mentioned, don't forget to check out some of my other [blog posts](https://developer.hpe.com/search/?term=donze) on the HPE Developer portal to learn more about Redfish tips and tricks.