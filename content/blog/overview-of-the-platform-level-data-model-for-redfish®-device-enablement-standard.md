---
title: Overview of the Platform Level Data Model for Redfish® Device Enablement
  Standard
date: 2022-05-12T16:04:30.750Z
author: François Donzé
authorimage: /img/fdz-photoprofile.png
tags:
  - Redfish
  - ilo-restful-api
---
Update July 26, 2023

## Introduction

In 2019, the [Distributed Management Task Force](https://dmtf.org) (DMTF) published the first version of the Platform Level Data Model for Redfish Device Enablement ([PLDM for RDE](https://www.dmtf.org/dsp/DSP0218)) standard. This Redfish standard extension started to be implemented in HPE iLO 5 based servers (Gen10 and Gen10 Plus) as well as in several storage controller (i.e. HPE Smart Array) and network adapter option cards.

This blog post positions the PLDM for RDE standard within the Redfish service, explains its benefits and provides practical configuration examples.

## Introduction to the Platform Level Data Model protocol suite

The DMTF PLDM protocol suite is composed of several [documents](https://www.dmtf.org/standards/pmci), and defines its base specification in the [DSP0240](https://www.dmtf.org/sites/default/files/standards/documents/DSP0240_1.1.0.pdf) document. In the introductory paragraph, you can read:

"*PLDM is designed to be an effective interface and data model that provides efficient access to low-level platform inventory, monitoring, control, event, and data/parameters transfer functions. For example, temperature, voltage, or fan sensors can have a PLDM representation that can be used to monitor and control the platform using a set of PLDM messages. PLDM defines data representations and commands that abstract the platform management hardware.*"

If you compare Redfish and PLDM, you could say that Redfish defines server modeling and management communications from a remote location, while PLDM defines server component modeling and communications between those internal components.

The data modeling and the communication between Management Controllers (MC) and components, like fans or sensors, is simpler when compared to complex devices, like option cards. To address component specificities and complexity, PLDM introduces generic types in which server components can be placed.  As an example, storage and network controllers, also called "devices" in PLDM terminology, are part of PLDM type six. The PLDM for Redfish Device Enablement standard is published in the [DSP0218](https://www.dmtf.org/dsp/DSP0218) document.

 In addition, the [PLDM base](https://www.dmtf.org/sites/default/files/standards/documents/DSP0240_1.1.0.pdf) specification does not mandate any transport protocol to transfer messages from one component to another. Theoretically, PLDM messages can be transferred by any transport protocol, including the [Management Component Transport Protocol](https://www.dmtf.org/dsp/DSP0239) (MCTP). Hence, a specific document ([DSP0241](https://www.dmtf.org/dsp/DSP0241)) had to be created to define the binding of PLDM messages over MCTP to complete the protocol suite.

## Operational model without PLDM for RDE

Generally speaking, most of today's servers are architected around one or more management controllers (MC). The majority of the server components are tightly coupled with the MC that has a total control of them in terms of monitoring and configuration. Typical examples are temperature sensors or power supplies. Other more complex components, like option cards (also called "external provider devices"), are loosely coupled with the MC.

Without the implementation of the PLDM for RDE standard, the MC (iLO) has a partial knowledge of external provider device properties and capabilities. This knowledge has been hard-coded in the Redfish service of the iLO firmware. As a consequence, Redfish clients can only get and set the properties referenced in the MC. For an exhaustive management of an external provider device, specific applications like the HPE Smart Storage Administrator (SSA) or the HPE MegaRaid Storage Administrator (MRSA) are needed.

This paradigm (implementation of device properties in the iLO firmware) generates a lock-step dependency between the iLO firmware and the device firmware; an update of the device firmware may lead to inaccurate iLO responses or errors if the iLO is not updated with firmware embedding the new or modified device features.

The picture below shows an iLO based server with two network adapters and one storage adapter. The iLO firmware is in sync with the storage device and one network adapter. This same level of firmware is represented with a green "F". The second network adapter firmware is not in sync with the iLO firmware and is represented with a red "F". A red cross between the iLO and the un-synced firmware represents potential communication problems.

In addition, this picture mentions the [Bus Master Interface Command](https://data.epo.org/publication-server/document?iDocId=698778&iFormat=0) (BMIC) and the Discovery and Configuration via iLO (DCi) protocols that are respectively patented and HPE proprietary protocols.

Using proprietary protocols between the MC and an external provider device require their implementation in both the MC and the external provider device. This is a constraint imposed to the external providers who have to implement all the specific protocols of all the computer makers they want to support.

Moreover, device configuration is performed in two steps as explained in this [blog post](https://developer.hpe.com/blog/storage-management-with-redfish/): 

1. The MC stores the modifications in a dedicated location.   

2. The modifications are uploaded to the device during the next server reboot.   


The reboot requirement mentioned in the second bullet is another drawback generated by the lack of PLDM implementation.

![Operational model without PLDM for RDE](/img/withoutpldmrde.png "Operational model without PLDM for RDE")

As a summary, the operational model without PLDM for RDE introduces the following problems:

* Firmware lock-step dependency between iLO and devices   

* Partial knowledge of device properties implemented iLO firmware   

* Use of proprietary communication protocols between iLO and devices   

* Reboot required to load new device configuration settings   


## Operational model with PLDM for RDE

The implementation of PLDM for RDE standard, in both iLO and devices, changes the iLO role from "active" to "pass-through". In this configuration, the iLO receives HTTP requests from Redfish clients and translates them into a set of RDE requests to the device. When the PLDM dialog between the iLO and the device is over, the iLO sends back a final HTTP response to the Redfish client (See picture below).

![Operational model with PLDM for RDE](/img/withpldmrde.png "Operational model with PLDM for RDE")

In this model, the management controller and device firmware don't need to be aligned because the MC does not contain any device properties. It contains only the necessary information to translate the Redfish client requests into PLDM for RDE messages.

As a result, if all the computer makers implement the PLDM for RDE protocol suite in their Redfish service, the number of communication protocols to be implemented and maintained by the device providers is reduced to one.

Lastly, PLDM for RDE device modifications do not require a reboot of the server to become effective in the device. However, a reboot may be required by the operating system or by applications.

## HPE implementation of PLDM for RDE

On the server side, the implementation of [PLDM for RDE](https://servermanagementportal.ext.hpe.com/docs/redfishservices/ilos/supplementdocuments/rdesupport/#redfish-device-enablement-rde-support) started in iLO 5 firmware version 2.33 and in iLO 6 version 1.05. Newer firmware releases implement more and more PLDM related features that can be leveraged by devices providing their support of this standard. As an example, Redfish clients connected to an iLO 5 version 2.65 can perform read and write operations on logical drives (LD) hosted by  [HPE SR Smart Arrays](https://www.hpe.com/psnow/doc/a00047736enw.html?jumpid=in_pdp-psnow-qs) running firmware version 5.00 and above.

This statement is clearly mentioned in the `readme.txt` file embedded in the `ilo5_265.fwpkg` firmware package. You can use the `unzip` utility to extract this file from the package as shown in the next picture.

![RDE support in iLO 5 firmware version 2.65](/img/rdesupportinfw265.png "RDE support in iLO 5 firmware version 2.65")

### Storage controllers

The [Enhancements paragraph](https://support.hpe.com/connect/s/softwaredetails?language=en_US&softwareId=MTX_a06269a339da44ada286007600&tab=Enhancements) of HPE Smart Arrays version 5.00 mentions several new PLDM and DMTF features for this version (see picture below).

![PLDM Enhancements](/img/firmwareenhancements.png "PLDM Enhancements")

MegaRAID (MR) storage controllers support read and write operations since version [52.24.3-4948](https://internal.support.hpe.com/connect/s/softwaredetails?language=en_US&softwareId=MTX_7770514895d94ff4b1fcb86c5b&tab=Enhancements). 

If you power on a server containing this type of storage controller (SR or MR) and the correct firmware versions, you will notice a device with string `DE` in its URI similar to : `/redfish/v1/systems/1/DExxxxxx`. This `DE` string is synonymous with a device supporting the PLDM for RDE standard and discovered as such by the Redfish service.

A GET request toward this URI returns links to controllers, drives and volumes property end points as shown in the next picture.

![RDE storage end point](/img/rdestorageendpoint.png "RDE storage end point")

If you want to create a Logical Drive (aka volume), you can POST a request toward `{{iloURI}}/redfish/v1/Systems/1/Storage/DE07C000/Volumes` with a payload similar to:

```json
{
    "RAIDType": "RAID1",
    "DisplayName": "Raid1-1",
    "ReadCachePolicy": "ReadAhead",
    "VolumeUsage": "Data",
    "InitializeMethod": "Background",
    "Links": {
        "Drives": [
            {
                "@odata.id": "/redfish/v1/Systems/1/Storage/DE07C000/Drives/0"
            },
            {
                "@odata.id": "/redfish/v1/Systems/1/Storage/DE07C000/Drives/1"
            }
        ]
    }
}
```

The request will be transferred to the device and analyzed. If the device can process it, you will receive a `201 Created` HTTP response code. The just-created logical drive can be used immediately by the operating system without any system reboot. You may have to ask the OS to re-scan storage devices to discover this newly created LD.

The deletion of a RDE Logical Drive is straight forward; you just have to send a DELETE request toward the LD URI:

```Bash
curl --request DELETE "$iloURI/redfish/v1/Systems/1/Storage/DE07C000/Volumes/1"
```

**NOTE**: For backward compatibility concerning HPE Smart Array SR devices, HPE Gen10 and Gen10 Plus servers offer the possibility to manage those devices using both `SmartStorageConfig` and `Storage` data types. However, always stick to a single management data type. Mixing those data types may lead to hazardous results.

**NOTE**: Gen11 HPE servers don't implement the `SmartStorageConfig` OEM data type. The `Storage` data type and its sub-resources (Volume, Drive) is the only implemented type.

Refer to the [HPE Storage Controllers: Management Overview](https://www.hpe.com/psnow/doc/a50006146enw?from=app&section=search&isFutureVersion=true) document for more information

### Network adapters

Several network adapter suppliers implement PLDM for RDE in their devices. The [Intel E810 XXVDA2 Network Adapter](https://www.hpe.com/psnow/doc/a00073559enw.html?jumpid=in_pdp-psnow-qs) support this new technology in its firmware version 3.10. This firmware is packaged in a file called `HPE_E810_XXVDA2_SD_3p10_PLDMoMCTP_8000AD4A.fwpkg` mentioning explicitly PLDM over MCTP, meaning that PLDM messages between the management controller and the device are transported by the Management Component Transport Protocol mentioned above.

When this firmware is deployed, a network adapter containing string `/DE` is present under the `NetworkAdapter.` data type location. The next picture extracts three properties (URI, Name and Settings URI) from the `NetworkAdapter.` data type of a system containing two network adapters: an HPE 631FLR-SFP28 and an Intel E810. The HPE 631FLR-SFP28 adapter does not support RDE and is referred to a `/DC` device. Moreover, it contains a settings URI used to store modifications before being transferred to the device during the next system reboot.

The Intel E810 adapter is referred to a `/DE` device supporting RDE. Moreover, it does not contain any settings URI because modifications are transferred to the device in real time by the iLO and no server reboot is required to take those modification into account.

![Setting an RDE network adapter property with iLOrest](/img/networkadapters.png "Setting an RDE network adapter property with iLOrest")

The following picture shows a real-time property modification on port 0 of an Intel E810 network adapter, using [iLOrest](http://hpe.com/info/resttool) version 3.5.

The first instruction explicitly selects the `port.v1_3_1` data type that includes this adapter. Using a `ilorest select port.` data would also select other data versions (i.e. data types related to non RDE adapters). If several data types are selected, the filtering of properties is harder.

Then, it retrieves the `FlowControlConfiguration` of port 0, and sets it to a different value. The last instruction once again retrieves the value of this property to show that it has changed without any reboot.

**NOTE**: No `commit` instruction was needed with this version of iLOrest to modify this property. This may be different with later versions.

![Set port property in RDE network adapter](/img/setrdenetworkadapterproperty.png "Set port property in RDE network adapter")

If you want to perform the same configuration using another Redfish client, you can send a PATCH request toward `{{iloURI}}/redfish/v1/Chassis/1/NetworkAdapters/DE081000/Ports/0` with the following body:

```json
{
    "Ethernet": {
        "FlowControlConfiguration": "TX"
    }
}
```

## Conclusion

By leveraging several standards published before the Redfish standard (PLDM base specification, MCTP), the DMTF substantially enhanced the flexibility and ease of use of server management with the PLDM for RDE standard. HPE adopted it very early in its iLO 5 based servers as well as most (if not all) of its external device providers. As a result, HPE customers benefit from this partnership and can save precious time during their management tasks.

Don't forget to check out some of my other [blog posts](https://developer.hpe.com/search/?term=donze) on the HPE Developer portal to learn more about Redfish tips and tricks.