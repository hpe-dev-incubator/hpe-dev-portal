---
title: Setting Bios and Storage Controller Properties with Redfish
date: 2018-07-19T15:11:44.185Z
featuredBlog: false
priority: null
author: Francois Donze
authorimage: /img/blogs/Avatar5.svg
thumbnailimage: null
tags:
  - ilo-restful-api
  - Redfish
  - SmartArray
  - Bios
  - Postman
---
Updated July 26, 2023

The concept of deferred / pending settings in the [Bios]( https://servermanagementportal.ext.hpe.com/docs/concepts/biosdatamodel/#bios-current-and-pending-areas) and `SmartStorageConfig` subsystems of HPE iLO 5 is briefly presented in the [HPE Reference API](https://servermanagementportal.ext.hpe.com/) documentation. With two examples, this document illustrates what is happening when properties are modified in those subsystems using the Redfish REST API against HPE servers.

**NOTE**: The `SmartStorageConfig` [data type](https://servermanagementportal.ext.hpe.com/docs/concepts/datatypesandcollections/) is [deprecated in HPE iLO 6](https://servermanagementportal.ext.hpe.com/docs/redfishservices/ilos/ilo6/ilo6_adaptation/#hpe-smart-storage-model-oem-deprecated) based servers.

**NOTE**: The latest versions of iLO 5 firmware support both the HPE `SmartStorageConfig` and the DMTF standard storage models. Volume management with controllers implementing the DMTF storage model is described in the [HPE server management portal](https://servermanagementportal.ext.hpe.com/docs/redfishservices/ilos/supplementdocuments/storage/).

We assume that the reader is familiar with REST APIs in general and Redfish in particular. A good entry point for developers to grasp the power of Redfish is the [iLO RESTful API Ecosystem](https://www.hpe.com/us/en/servers/restful-api.html#).

## Foreword

For didactic purposes, we use direct URIs to targets instead of crawling  the Redfish tree to discover the target URIs, as explained in the [Getting Started with the Redfish(c) API Part 2](/blog/getting-started-with-the-redfish-api-part-2) document.

In the following paragraphs, `{{Subsystem-URI}}` refers to an URI like `https://<ilo-IP>/redfish/v1/<subsystem>/` where `<subsystem>` represents either `Bios` or `SmartStorageConfig`. These subsystems contains the currently used properties.

Each of them has a pending sub-zone called `Settings/` and explained in the next paragraph.

## Deferred / pending high level concept description

1. Modifications in these subsystems are performed using HTTP `PATCH` or HTTP `PUT` against `{{Subsystem-URI}}/`**`Settings/`**.

2. Upon a successful transaction, the HTTP return code is `200 OK` with the associated message: `One or more properties were changed and will not take effect until the system is reset`.

3. During the next system reset, the content of `{{Subsystem-URI}}/Settings/` is transferred one level up, in `{{Subsystem-URI}}/`. The return status of this transfer is present in `{{Subsystem-URI}}` with an associated message.

The important thing to note in this flow is that the final status code and associated message of a property setting is visible **after the system reset**.

## Successful example

In this example, we create a Raid1 storage array of two physical disks using Postman. To achieve this goal, we have to issue a `PUT` to `{{iloURI}}/redfish/v1/Systems/1/SmartStorageConfig/Settings/` with a body (aka payload) similar to the example shown below:

![Body to PUT to .../SmartStorageConfig/Settings/](https://redfish-lab.sourceforge.io/media/redfish-wiki/Setting-Bios-and-StorageControllerProperties-with-Redfish/1-PUT-Body.png)

Upon successful completion of this `PUT` request, the HTTP status return code is `200 OK`, which means that the remote Web server understood what to do with this well-formed payload.

The Body of the HTTP response contains an `error` property with a `SystemResetRequired` message. This property is a Redfish object sent by the Redfish server. It is there to give details about the next step to perform to finish the modification process.

![PUT Return Status](https://redfish-lab.sourceforge.io/media/redfish-wiki/Setting-Bios-and-StorageControllerProperties-with-Redfish/2-PUT-Return-Status.png)

At this stage of the process, only the staging / "pending zone" of the Smart Array has changed and contains the `PUT` payload. We can verify this assertion by comparing the content of  `{{Subsystem-URI}}/Settings/` with the content of `{{Subsystem-URI/}}`.

In the pending zone (`.../SmartStorageConfig/Settings/`) we can see the payload we sent to the Redfish server. However, in the "running zone" (`.../SmartStorageConfig/`) the `LogicalDrives` array is still empty:

![GET Pending and Current LogicalDrives](https://redfish-lab.sourceforge.io/media/redfish-wiki/Setting-Bios-and-StorageControllerProperties-with-Redfish/4-GetPendingLogicalDrives.png)

It is now time to reset the server and perform a `GET` of the running zone. In the response body of this operation, the first Redfish object is a `@Redfish.Settings` collection containing a single `MessageID` mentioning `Success`. This single message is synonym of a successful transfer of the "pending zone" in to the "running zone". We will see later in this document what we get in case of an un-successful transfer.

![GET Running zone after server reset](https://redfish-lab.sourceforge.io/media/redfish-wiki/Setting-Bios-and-StorageControllerProperties-with-Redfish/5-GetAfterReset.png)

Further down in this response we find the `LogicalDrives` array containing the Raid1 disk array:

![GET LogicalDrives from running zone](https://redfish-lab.sourceforge.io/media/redfish-wiki/Setting-Bios-and-StorageControllerProperties-with-Redfish/6-GetAfterReset-2.png)

## Unsuccessful example

In order to emphasize the fact that the modification status of properties in the `Bios` and `SmartStorage` subsystems must be done after a system reset, we will study a case where the JSON `PUT` payload is syntactically correct but embedding a value typo (`Raid` instead of `Raid1`) and missing a required key-value (`DataGuard=Disabled`):

![PUT of a bad payload](https://redfish-lab.sourceforge.io/media/redfish-wiki/Setting-Bios-and-StorageControllerProperties-with-Redfish/7-BadPayload.png)

Sending this request returns an HTTP `200 OK` status and a `SystemResetRequired` Redfish message just like in the previous example:

![PUT return status of bad Redfish request](https://redfish-lab.sourceforge.io/media/redfish-wiki/Setting-Bios-and-StorageControllerProperties-with-Redfish/8-PUT-Return-Status-of-Bad-Request.png)

The pending zone contains the faulty payload:

![Faulty payload in pending zone](https://redfish-lab.sourceforge.io/media/redfish-wiki/Setting-Bios-and-StorageControllerProperties-with-Redfish/9-PendingZoneWithBadRequest.png)

After the server reset, a `GET` of the running zone responds with a `MessageArgs=[DataGuard]` object and two `MessageID`keys. The first one mentions `DataGuard` as a missing property and the second one (`Success`) means that the analysis of the transfer from the pending zone to the running zone has successfully ended. This `Success` message does not means that the transfer has occurred.

Moreover, note that there is nothing mentioning the `Raid` typo. It means that analysis of the payload to transfer stops at the first error found.

![DataGuard Property Missing](https://redfish-lab.sourceforge.io/media/redfish-wiki/Setting-Bios-and-StorageControllerProperties-with-Redfish/10-DataGuardPropertyMissing.png)

If we drill down to the `LogicalDrives` array we notice that it is still empty. Hence the transfer did not occur.

![Empty LogicalDrives array](https://redfish-lab.sourceforge.io/media/redfish-wiki/Setting-Bios-and-StorageControllerProperties-with-Redfish/11-EmptyLogicalDrivesArray.png)

If we `PUT` a new payload with the `DataGuard=Disabled` property but still without correct Raid level and reset the server, we notice an `InvalidRAIDLevel` message explaining the problem.

![Wrong Raid Level error](https://redfish-lab.sourceforge.io/media/redfish-wiki/Setting-Bios-and-StorageControllerProperties-with-Redfish/12-WrongRaidLevel.png)

## Conclusion

Understanding the pending / deferred process when modifying Bios and SmartStorage properties using the Redfish API as well as the different types of return codes (HTTP, MessageID...) should ease program development and troubleshooting sessions.