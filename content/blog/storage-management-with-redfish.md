---
title: Storage management with Redfish
date: 2018-10-30T17:05:18.375Z
featuredBlog: false
priority: null
author: François Donzé
authorimage: https://gravatar.com/avatar/6f3982d1461459da475f47e3a6c89d1d?s=192
thumbnailimage: null
tags:
  - ilo-restful-api
  - Redfish
  - SmartStorage
  - SmartArray
  - Synergy
  - ProLiant
  - iLO5
---
<style> li { font-size: 27px; line-height: 33px; max-width: none; } </style>

Updated: March 6, 2024

## Introduction

Integrated Lights-Out (<a href="https://www.hpe.com/info/ilo" target="_blank">iLO</a>)  is an HPE ProLiant and Synergy server-embedded technology that delivers the core foundation for server intelligence along with out-of-band and in-band management facilities. This technology is a combination of the iLO ASIC that is part of the server board and the firmware that powers the ASIC. Out of the box, HPE iLO simplifies server setup, provides access to server health information, and enables server management at scale, including basic remote administration. Different generations of ProLiant Servers carry different versions of the iLO ASIC.  

In HPE ProLiant and Synergy Gen10 servers, HPE iLO 5 introduced the management of storage controllers via its graphical user interface and via the <a href="https://www.dmtf.org/standards/redfish" target="_blank">Redfish</a> RESTful API standard. Although <a href="https://www.youtube.com/channel/UCIZhrIYcNh3wHLiY4ola5ew/search?query=logicaldrive"  target="_blank">videos</a> already exist that cover the graphical user interface, I wanted to address this feature with a pure Redfish API approach, bypassing the <a href="https://github.com/HewlettPackard/python-redfish-utility/releases/latest" target="_blank">iLOrest interface tool</a> and its `SmartController` macro commands.

In this article you start by learning how to cleanup and prepare a SmartRAID (SR) storage Controller for receiving a configuration with one or more logical drives using an HPE proprietary OEM process. Then, on this fresh environment, you will learn how to create a simple RAID array configuration prior to more complex ones.

**NOTE**: The HPE proprietary `SmartStorageConfig` introduced with HPE iLO 5 has been <a href="https://servermanagementportal.ext.hpe.com/docs/redfishservices/ilos/ilo6/ilo6_adaptation/#hpe-smart-storage-model-oem-deprecated" target="_blank">deprecated</a> in iLO 6 based servers (Gen11) in favor of the standard <a href="https://servermanagementportal.ext.hpe.com/docs/redfishservices/ilos/supplementdocuments/storage/" target="_blank">DMTF storage model<a>. For backward compatibility, HPE iLO 5 implements both models.

## Foreword

I've used the <a href="https://www.getpostman.com/" target="_blank">Postman</a> API development to illustrate our examples. This should give you the ability to implement these raw examples using your own preferred language.

The reader should have the knowledge of HTTP <a href="https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol#Request_methods" target="_blank">request methods</a> like `GET`, `PUT` and `PATCH`.

Moreover, it is assumed that the reader knows how to manage Redfish sessions as described in the <a href="https://servermanagementportal.ext.hpe.com/docs/concepts/redfishauthentication/" target="_blank">HPE Redfish API Reference documentation</a>. More hints for managing iLO sessions with Redfish can be found in this <a href="https://developer.hpe.com/blog/managing-ilo-sessions-with-redfish/" target="_blank">article</a>.

## Storage data models

The Redfish standard defines a `storage` data model as part of the `ComputerSystem` resource type under the `/redfish/v1/Systems/{item}/` URI. With the implementation of new standards, like the Platform Level Data Model for Redfish Device Enablement (<a href="https://developer.hpe.com/blog/overview-of-the-platform-level-data-model-for-redfish%C2%AE-device-enablement-standard/" target="_blank">PLDM for RDE</a>), this model is fully operational in terms of read, write and event operations against modern external provider devices. Starting at Gen10 and Gen10 Plus (firmware 2.30+), HPE servers can take advantage of it. Note that it is the only storage data model implemented in Gen11 servers and beyond.

HPE initially developed the `SmartStorage` Redfish OEM data model for HPE ProLiant DL580 Gen8 servers, before any Redfish specification was published. This model supports inventory (GET) and monitoring (Events) features only.

In HPE ProLiant Gen10, the `SmartStorageConfig` resource was added to support the system's configuration. This OEM model uses a proprietary API that only supports the SmartRAID (SR) line of HPE storage controllers. 

> **Note**: The HPE OEM `SmartStorageConfig` data model is removed in HPE Gen11 servers. 
>
> **Note**: This article focuses only on the HPE OEM `SmartStorageConfig` data model.

As stated earlier, HPE Gen10 and Gen10 Plus servers implement the description and the configuration of their Smart Storage SR devices respectively in the `SmartStorage` and `SmartStorageConfigX` (**X** is being an ID number) entry points of the same `ComputerSystem` type. When multiple controllers are present in a system,
a `SmartStorage/ArrayControllers/{item}/` entry point is present for each controller description and a `SmartStorageConfigX` entry point exits for the configuration entry points. Note that `{item}` and **`X`** are not correlated.

![HPE's legacy SmartStorage URIs](/img/0-smartstoragearraysentrypoints.png "HPE's legacy SmartStorage URIs")

![HPE's SmartStorageConfig URIs](/img/0-smartstorageconfigentrypoints.png "HPE's SmartStorageConfig URIs")

Since the infrastructure used for this article contains only HPE storage devices and the iLO 5 firmware version is below 2.30, the `Storage` DMTF URI is not populated. Only the `SmartStorage` and `SmartStorageConfigX` locations are populated. The following picture shows the URIs of four disk drives in the first controller of our infrastructure. Their properties can be obtained with a simple `GET` request.  

![Physical Drives seen from the SmartStorage location](/img/1-physicaldrives.png "Physical Drives seen from the SmartStorage location")

If you only need the physical location of the disks to use for your logical drives, you can `GET` them from the `SmartStorageConfig` location as shown below. Note that for the first controller found in the system, the **`X`** ID number is omitted.

![Physical Drives seen from the SmartStorageConfig location](/img/2-physicaldrives.png "Physical Drives seen from the SmartStorageConfig location")

## Storage controller configuration process

As described in my previous blog, <a href="https://developer.hpe.com/blog/master-the-redfish-server-states-to-improve-your-monitoring-and-manageme/" target="_blank">Master the Redfish Server States to improve your monitoring and management applications</a>, and to be sure the configuration process happens smoothly,  you should first verify that your managed systems are not at the `UEFI/System Utilities` level. Being in the `Off` state is a good state to start.

Modification of Bios and storage controller configurations are performed in two stages as explained in the <a href="https://developer.hpe.com/blog/setting-bios-and-storage-controller-properties-with-redfish/" target="_blank">Setting Bios and Storage Controller Properties with Redfish</a> article. The first stage consists of setting the required parameters in the "pending settings area" of the Redfish data model (`/redfish/v1/Systems/{item}/SmartStorageConfig/Settings/`). During the next server reboot, parameters in the "pending settings area", after validation, are transferred to the "current configuration" at `/redfish/v1/Systems/{item}/SmartStorageConfig/`.

Upon reboot, and once the server has finished its Pre-OS Tasks (POST), you should check carefully whether the modifications have been accepted as the current configuration.

## The DataGuard property

The management of HPE Smart Storage devices requires a proper understanding of the `DataGuard` property part of the `SmartStorageConfig` sub-tree. The value of this attribute "*indicates  whether or not data destructive actions are allowed*" as explained in the [API Reference documentation](https://servermanagementportal.ext.hpe.com/docs/redfishservices/ilos/ilo5/ilo5_290/ilo5_other_resourcedefns290/#dataguard).

This property is set in the pending settings (`SmartStorageConfig/Settings`) along with the directives to be performed by the Smart Storage device (i.e. Logical Volume Creation, Deletion...). During the next POST, the firmware checks its value and performs, or does not perform, the requested directives.

If the value is `Strict`, which is the default value when not changed in the pending settings, the firmware denies any destructive data action (create/delete logical drives or clear drive metadata....).

If the value is set to `Disabled`, destructive data actions are allowed. Finally, when the value is `Permissive`, only destructive data actions are allowed on the specified objects.

Refer to the <a href="https://servermanagementportal.ext.hpe.com/docs/redfishservices/ilos/supplementdocuments/storage/" target="_blank">iLO RESTful API documentation</a> for more information.

## Storage controller and physical disks preparation

Imagine you just received a bunch of brand new servers or you want to re-deploy servers for a new project. In this context, you would want to remove completely the entire storage configuration as well as all meta data stored in the physical drives to get a clean Smart Storage subsystem.

The HPE OEM storage subsystem models logical drives as a JSON collection stored in an array of objects represented like: `"LogicalDrives": [{ld-1},{ld-2,...{ld-n}]`. Each `ld-i` of this array contains the necessary properties to describe precisely the corresponding logical drive.

The following screenshot shows the `LogicalDrives` array containing one element and its attributes. In it, you can see that this logical drive is a RAID 0 made of a single data drive (`1I:3:1`).

![The LogicalDrives[] array](/img/3-logicaldrivecollection.png "The LogicalDrives[] array")

### Removing all logical drives

Removing all the logical drives of an HPE SR Smart Storage Controller is equivalent to the removal of all the elements of the `LogicalDrives` array. In practice, you need to request an empty array to the Redfish server.

Since this action is data destructive, you must disable the `DataGuard` property to make sure the firmware allows this operation during the next reboot/POST of the system.

The next screenshot contains all the necessary information to complete this remove operation:  Perform an HTTP `PUT` to the pending settings (`SmartStorageConfig/Settings/`):

![Deleting all HPE Logical drives](/img/3-deletealllogicaldrives.png "Deleting all HPE Logical drives")

### Clearing disk drives configuration metadata

HPE Smart Array RAID uses a reserved area at the end of each physical drive to store information about the logical drive configuration they are part of.  When the <a href="https://www.hpe.com/us/en/product-catalog/detail/pip.5409020.html" target="_blank">Smart Storage Administrator</a> (SSA) application or Redfish is used to delete a logical drive, the metadata is cleaned up.  However, if drives are moved around, there may be leftover metadata on the drives.  The controller may show a failed logical drive or keep the drive from being presented to the OS.  The `ClearConfigurationMetadata` action with the `DataGuard` property disabled using the `PATCH` method can be used to remedy this problem.

![Clear disk drives configuration metadata](/img/4-clearconfigmetadata.png)

If you want to perform a single request removing all the logical drives and clearing the metadata, you have to perform a `PUT` of the pending settings with the following body:

```json
{
    "Actions": [
        {
            "Action": "ClearConfigurationMetadata"
        }
        ],
    "LogicalDrives": [],
    "DataGuard": "Disabled"
}
```

### Removing a single/specific logical drive

To delete a specific logical drive you have to send a `PUT` request to the `SmartStorageConfig/settings` (pending settings). This request must contain the unique identifier of the desired logical drive as well as the `DataGuard` property set to `Permissive` to avoid the removal of other logical drives, if any:

![Specific logical drive deletion](/img/7-deletespecificlogicaldrive.png)

### Sanitizing / disk drives

In addition to the removal of logical drives and the meta data cleanup of physical drives, you may want to erase / sanitize a list of physical drives. To perform this (long) operation, send the following `PATCH` action with the correct list of the drives to erase, separated by a comma.  Don't forget to disabled  the `DataGuard` property as well:

![Sanitize physical disk drives](/img/5-sanitizephysicaldrive.png)

The `ErasePattern` property supports the following [values](https://servermanagementportal.ext.hpe.com/docs/redfishservices/ilos/ilo5/ilo5_290/ilo5_other_resourcedefns290/#actions-array):

```text
    SanitizeRestrictedBlockErase
    SanitizeUnrestrictedBlockErase
    SanitizeRestrictedOverwrite
    SanitizeUnrestrictedOverwrite
    SanitizeRestrictedCryptoScramble
    SanitizeUnrestrictedCryptoScramble
    OnePass
    TwoPass
    ThreePass
```

As mentioned above, the sanitize process is extremely long and you can retrieve the erase status in the disk drive properties under the `SmartStorage` sub-tree:

![Sanitize / Erase status](/img/6-erasestatus.png)

## Logical drive creation

Logical drives can be created using the `PUT` method. In some circumstances a `PATCH` can be used. To keep things simple, I'll only use the `PUT` method.

For this section, start with the clean infrastructure generated previously to create a 100GB RAID1 logical drive with a `Roaming` spare drive.

Then, add a RAID0 Logical drive located on a single hard disk without spare drive and spanning the entire disk (300GB).

Finally, add a second logical drive of 50 GB in the RAID1 array created earlier.

While this scenario may not be completely realistic, the goal here is to more didactic than realistic.

### First logical drive creation

In this clean context, you just need to send a `PUT` request to the `SmartStorageConfig/settings` (pending settings) with the properties of the desired logical drive as an element of the `LogicalDrives` array and the `DataGuard` value set to `Disabled`.

The following picture shows the entire body of the `PUT` request with the mandatory properties in green boxes: `DataGuard`, `DataDrives` list, `Raid` type, `SpareDrives` list and `SpareRebuildMode`. Other properties will be defaulted if not supplied.

A `200` return status with a `SystemResetRequired` "Error"
message indicates that the remote SmartArray pending settings has been changed.

![RAID1 with Spare drive creation](/img/8-logical-raid1spare-creation.png)

Upon reboot of the server, you should verify that the current configuration contains only the `Success` message. This ensures that the configuration happened effectively.

![Successful Logical Drive creation](/img/9-runningzoneaftercreation.png)

### Creating more logical drives

Now, I would like to show you how to add a logical drive without altering the existing configuration. This operation could be noted "`=+`" in high level programming languages. I will use this analogy to build the body of the corresponding `PUT` request.

The "`=`" portion of this process is performed by copying the entire `SmartStorageConfig` current configuration into the body of a `PUT` request. The remote iLO Redfish server is smart enough to keep only needed properties.

The "`+`" part consists of adding the desired logical drive into the `LogicalDrives` array and changing the `DataGuard` value.

The body of this `PUT` request is now ready to be sent to the `SmartStorageConfig/settings` (pending settings) of the managed iLO.

![Add a logical drive in a separate array](/img/11-addlogicaldrive.png)

Again and again, you must check the return status, reboot if it is `Ok`, and verify that the current configuration contains only a single `Success` message to be sure that your modification was made.

### Adding a logical drive in an existing disk array

This last exercise consists of adding a RAID0 logical drive of 50GB in the first storage array that was created earlier. This array has a capacity of 300GB and, only 100GB are consumed with logical drive `RAID1-1-100`.

As I showed you in the previous section you have to perform a "`=+`" operation including a modification of the `DataGuard` property and the addition of a logical drive.

The following screenshot shows the characteristics of the added RAID0 logical drive. It mentions its size as well as the `DataDrives` list and the spare drive used in the storage array created  for the RAID1 logical drive in my first example. This ensures the creation of the desired logical drive in the right place.

![Adding a logical drive in an existing array](/img/12-addlogicaldrivetoexistingarray.png "Adding a logical drive in an existing array")

After reboot, the requested RAID0 logical drive is visible in the current configuration. Note that the `SpareRebuildMode` has been automatically adjusted to `Dedicated` since `Roaming` is not a valid value anymore.

![Current configuration after the addition of logical drive in an existing array](/img/13-runningzoneafteraddition.png "Current configuration after the addition of logical drive in an existing array")

## Conclusion

Redfish is a powerful, open source method of being able to manage systems. With a RESTful interface, it is designed to leverage existing internet standards and tool chains, making it usable by both amateurs as well as professionals.The ability of managing HPE Smart Storage with Redfish is a major step forward to the full control of HPE Gen10 and future servers using a single RESTful API.

Make sure you continue to follow my blog posts on HPE DEV for more hints on working with Redfish in HPE environments. You can connect with me in <a href="https://hpedev.slack.com/" target="_blank">the Redfish channel on Slack</a> for specific questions.