---
title: Storage management with Redfish
date: 2018-10-30T17:05:18.375Z
author: Francois Donze 
tags: ["Redfish","SmartStorage","SmartArray","Synergy","ProLiant","iLO5"]
path: storage-management-with-redfish
---
# Storage management with Redfish&reg;

## Introduction

HPE Integrated Lights-Out 5 (iLO 5) in Gen10 servers introduced the management of storage controllers via its graphical user interface and via the [Redfish](http://www.dmtf.org/redfish) RESTful API standard. Although [videos](https://www.youtube.com/channel/UCIZhrIYcNh3wHLiY4ola5ew/search?query=logicaldrive) already exist on that subject, we wanted to address this feature with a pure Redfish API approach, bypassing the `ilorest` [interface tool](http://www.hpe.com/info/resttool) and its Smart Array macro commands.

In this article we start by learning how to cleanup and prepare a Smart Storage Controller for receiving a configuration with one or more logical drives. Then on this fresh environment we will create a simple RAID array configuration prior to more complex ones to complement the [API reference documentation](https://hewlettpackard.github.io/ilo-rest-api-docs/ilo5/#smartstorage-configuration).

## Foreword

The [Postman](https://www.getpostman.com/) API development environment is used to illustrate our examples. This should give you the ability to implement those raw examples using your own preferred language.

The reader should have the knowledge of HTTP [request methods](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol#Request_methods) like `GET`, `PUT` and `PATCH`.

Moreover, it is assumed that the reader knows how to manage Redfish sessions as described in the [Redfish API Reference documentation](https://hewlettpackard.github.io/ilo-rest-api-docs/ilo5/#authentication-and-sessions) as well as in this [article](https://developer.hpe.com/blog/managing-ilo-sessions-with-redfish).

## Storage information locations

The Redfish standard defines a `storage` subsystem as part of the `ComputerSystem` type under the `/redfish/v1/Systems/{item}/` location.

However, HPE implements the description and the configuration of its Smart Storage devices (i.e. SmartArray controllers) respectively in the `SmartStorage` and `SmartStorageConfig` sub-trees of the same `ComputerSystem` type.

Since our infrastructure contains only HPE storage devices, only the `SmartStorage*` locations are populated. The following picture shows the URIs of four disk drives in our infrastructure. Their properties can be obtained with a simple `GET` request.  

![Physical Drives seen from the `SmartStorage` location](https://redfish-lab.sourceforge.io/media/redfish-wiki/StorageManagementWithRedfifsh/1-PhysicalDrives.png)

If you only need the physical location of the disks to use for your logical drives, you can `GET` them from the `SmartStorageConfig` location as shown below.

![Physical Drives seen from the `SmartStorageConfig` location](https://redfish-lab.sourceforge.io/media/redfish-wiki/StorageManagementWithRedfifsh/2-PhysicalDrives.png)

## Storage controller configuration process

As described in a previous [blog](https://developer.hpe.com/blog/master-the-redfish-server-states-to-improve-your-monitoring-and-manageme), and to be sure the configuration process can happen smoothly,  you should first verify that your managed systems are not at the `UEFI/System Utilities` level. Being in the `Off` state is a good state to start.

Modification of Bios and storage controller configurations are performed in two stages as explained in the [Setting Bios and Storage Controller Properties with Redfish](https://developer.hpe.com/blog/setting-bios-and-storage-controller-properties-with-redfish) article. The first stage consists of setting the required parameters in the "pending settings area" of the Redfish data model (`/redfish/v1/Systems/{item}/SmartStorageConfig/Settings/`). During the next server reboot, parameters in the "pending settings area", after validation, are transferred to the "current configuration" at `/redfish/v1/Systems/{item}/SmartStorageConfig/`.

Upon reboot and once the server has finished its Pre-OS Tasks (POST) you should check carefully whether the modifications have been accepted as the current configuration.

## The `DataGuard` property

The management of HPE Smart Storage devices requires a proper understanding of the `DataGuard` property part of the `SmartStorageConfig` sub-tree. The value of this key "_indicates  whether or not data destructive actions are allowed_" as explained in the [API Reference documentation](https://hewlettpackard.github.io/ilo-rest-api-docs/ilo5/#dataguard).

This property is set in the pending settings (`SmartStoageConfig/Settings`) along with the directives to be performed by the Smart Storage device (i.e. Logical Volume Creation, Deletion...). During the next POST, the firmware checks its value and performs or not the requested directives.

If the value is `Strict`, which is the default value when not changed in the pending settings, the firmware denies any destructive data action (create/delete logical drives or clear drive metadata....).

If the value is set to `Disabled`, destructive data actions are allowed. Finally when the value is `Permissive`, only destructive data actions are allowed on the specified objects.

 Refer to the [documentation](https://hewlettpackard.github.io/ilo-rest-api-docs/ilo5/#delete-logical-drives) for more information.

## Storage controller and physical disks preparation

Imagine we just received a bunch of brand new servers or we want to re-deploy servers for a new project. In this context, we would like to remove completely the entire storage configuration as well as all meta data stored in the physical drives to get a clean Smart Storage subsystem.

Redfish models logical drives as a JSON collection stored in an array of objects represented like: `"LogicalDrives": [{ld-1},{ld-2,...{ld-n}]`. Each `ld-i` of this array contains the necessary properties to describe precisely the corresponding logical drive.

The following screenshot shows the `LogicalDrives` array containing one element and its attributes. We learn that this logical drive is a RAID 0 made of a single data drive (`1I:3:1`).

![Logical drive collection](https://redfish-lab.sourceforge.io/media/redfish-wiki/StorageManagementWithRedfifsh/3-LogicalDriveCollection.png)

### Removing all logical drives

Removing all the logical drives of a Smart Storage Controller is equivalent to the removal of all the elements of the `LogicalDrives` array. Practically we need to request an empty array to the Redfish server.

Since this action is data destructive we must disable the `DataGuard` property to make sure the firmware allows this operation during the next reboot/POST of the system.

The next screenshot contains all the necessary information to complete this remove operation:  Perform an HTTP `PUT` to the pending settings (`SmartStorageConfig/Settings/`):

![Deleting all HPE Logical drives](https://redfish-lab.sourceforge.io/media/redfish-wiki/StorageManagementWithRedfifsh/3-DeleteAllLogicalDrives.png)

### Clearing disk drives configuration metadata

HPE Smart Array RAID uses a reserved area at the end of each physical drive to store information about the logical drive configuration they are part of.  When the [Smart Storage Administrator (SSA)](https://www.hpe.com/us/en/product-catalog/detail/pip.5409020.html) application or Redfish is used to delete a logical drive, the metadata is cleaned up.  However, if drives are moved around, there may be leftover metadata on the drives.  The controller may show a failed logical drive or keep the drive from being presented to the OS.  The `ClearConfigurationMetadata` action with the `DataGuard` property disabled using the `PATCH` method can be used to remedy this problem.

![Clear disk drives configuration metadata](https://redfish-lab.sourceforge.io/media/redfish-wiki/StorageManagementWithRedfifsh/4-ClearConfigMetadata.png)

If you want to perform a single request removing all the logical drives and clearing the metadata, you have to perform a `PUT` of the pending settings with the following body:

````json
{
    "Actions": [
        {
            "Action": "ClearConfigurationMetadata"
        }
        ],
    "LogicalDrives": [],
    "DataGuard": "Disabled"
}

````

### Removing a single/specific logical drive

To delete a specific logical drive you have to send a `PUT` request to the `SmartStorageConfig/settings` (pending settings). This request must contain the unique identifier of the desired logical drive as well as the `DataGuard` property set to `Permissive` to avoid the removal of other logical drives, if any:

![Specific logical drive deletion](https://redfish-lab.sourceforge.io/media/redfish-wiki/StorageManagementWithRedfifsh/7-DeleteSpecificLogicalDrive.png)

### Sanitizing / disk drives

In addition to the removal of logical drives and the meta data cleanup of physical drives you may want to [erase / sanitize](https://hewlettpackard.github.io/ilo-rest-api-docs/ilo5/#sanitize-drives) a list of physical drives. To perform this (long) operation, send the following `PATCH` action with the correct list of the drives to erase separated by a comma.  Don't forget to disabled  the `DataGuard` property as well:

![Sanitize physical disk drives](https://redfish-lab.sourceforge.io/media/redfish-wiki/StorageManagementWithRedfifsh/5-SanitizePhysicalDrive.png)

The `ErasePattern` property supports the following [values](https://hewlettpackard.github.io/ilo-rest-api-docs/ilo5/#actions-array):

````text
    SanitizeRestrictedBlockErase
    SanitizeUnrestrictedBlockErase
    SanitizeRestrictedOverwrite
    SanitizeUnrestrictedOverwrite
    SanitizeRestrictedCryptoScramble
    SanitizeUnrestrictedCryptoScramble
    OnePass
    TwoPass
    ThreePass
````

As mentioned above, the sanitize process is extremely long and you can retrieve the erase status in the disk drive properties under the `SmartStorage` sub-tree:

![Sanitize / Erase status](https://redfish-lab.sourceforge.io/media/redfish-wiki/StorageManagementWithRedfifsh/6-EraseStatus.png)

## Logical drive creation

Logical drives can be created using the `PUT` method. In some circumstances a `PATCH` can be used but, to keep things simple, we'll only use the `PUT` method.

In this section we will start with the clean infrastructure generated previously to create a 100GB RAID1 logical drive with a [`Roaming`](https://hewlettpackard.github.io/ilo-rest-api-docs/ilo5/#sparerebuildmode) spare drive.

Then we will add a RAID0 Logical drive located on a single hard disk without spare drive and spanning the entire disk (300GB).

Finally we will add a second logical drive of 50 GB in the RAID1 array created earlier.

This scenario may not be completely realistic; however our goal is to more didactic than realistic.

### First logical drive creation

In this clean context, we just need to send a `PUT` request to the `SmartStorageConfig/settings` (pending settings) with the properties of the desired logical drive as an element of the `LogicalDrives` array and the `DataGuard` value set to `Disabled`.

The following picture shows the entire body of the `PUT` request with the mandatory properties in green boxes: `DataGuard`, `DataDrives` list, `Raid` type, `SpareDrives` list and `SpareRebuildMode`. Other properties will be defaulted if not supplied.

A `200` return status with a `SystemResetRequired` "Error"
message indicates that the remote SmartArray pending settings has been changed.

![RAID1 with Spare drive creation](https://redfish-lab.sourceforge.io/media/redfish-wiki/StorageManagementWithRedfifsh/8-Logical-RAID1Spare-Creation.png)

Upon reboot of the server you should verify that the current configuration contains only the `Success` message. This ensures that the configuration happened effectively.

![Successful Logical Drive creation](https://redfish-lab.sourceforge.io/media/redfish-wiki/StorageManagementWithRedfifsh/9-RunningZoneAfterCreation.png)

### Creating more logical drives

In this paragraph we want to add a logical drive without altering the existing configuration. This operation could be noted "`=+`" in high level programming languages and we will use this analogy to build the body of the corresponding `PUT` request.

The "`=`" portion of this process is performed by copying the entire `SmartStorageConfig` current configuration into the body of a `PUT` request. The remote iLO Redfish server is smart enough to keep only needed properties.

The "`+`" part consists of adding the desired logical drive into the `LogicalDrives` array and changing the `DataGuard` value.

The body of this `PUT` request is now ready to be sent to the `SmartStorageConfig/settings` (pending settings) of the managed iLO.

![Add a logical drive in a separate array](https://redfish-lab.sourceforge.io/media/redfish-wiki/StorageManagementWithRedfifsh/11-AddLogicalDrive.png)

Again and again, you must check the return status, reboot if it is `Ok` and verify that the current configuration contains only a single `Success` message to be sure that your modification is there.

### Adding a logical drive in an existing disk array

The last exercise consists of adding a RAID0 logical drive of 50GB in the first storage array we created earlier. This array has a capacity of 300GB and we are only consuming 100GB with logical drive `RAID1-1-100`.

Similarly to the previous paragraph we have to perform a "`=+`" operation including the modification of the `DataGuard` property and the addition logical drive .

The following screenshot shows the characteristics of the added RAID0 logical drive mentioning its size as well as the `DataDrives` and the spare drive used in the storage array created  for the RAID1 logical drive in our first example. This ensures the creation of the desired logical drive in the right place.

![Adding a logical drive in an existing array](https://redfish-lab.sourceforge.io/media/redfish-wiki/StorageManagementWithRedfifsh/12-AddLogicalDriveToExistingArray.png)

After reboot, the requested RAID0 logical drive is visible in the current configuration. Note that the `SpareRebuildMode` has been automatically adjusted to [`Dedicated`](https://hewlettpackard.github.io/ilo-rest-api-docs/ilo5/#sparerebuildmode) since `Roaming` is not a valid value anymore.

![Current configuration after the addition of logical drive in an existing array](https://redfish-lab.sourceforge.io/media/redfish-wiki/StorageManagementWithRedfifsh/13-RunningZoneAfterAddition.png)

## Conclusion

The ability of managing HPE Smart Storage with Redfish is a major step forward to the full control of Gen10 servers with a single RESTful API.