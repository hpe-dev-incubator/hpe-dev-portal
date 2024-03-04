---
title: Setting Bios and Storage Controller Properties with Redfish®
date: 2018-07-19T15:11:44.185Z
featuredBlog: false
priority: null
author: Francois Donze
authorimage: /img/fdz-photoprofile.png
thumbnailimage: null
tags:
  - ilo-restful-api
  - Redfish
  - SmartArray
  - Bios
  - Postman
---
<style> li { font-size: 27px; line-height: 33px; max-width: none; } </style>

Updated March 5, 2024

The concept of deferred / pending settings in the <a href="https://servermanagementportal.ext.hpe.com/docs/concepts/biosdatamodel/#bios-current-and-pending-areas" target="_blank">Bios</a> and `SmartStorageConfig` subsystems of HPE iLO 5 is briefly presented in the <a href="https://servermanagementportal.ext.hpe.com/" target="_blank">HPE Reference API</a> documentation. With two examples, this document illustrates what is happening when properties are modified in those subsystems using the Redfish REST API against HPE servers.

**NOTE**: The `SmartStorageConfig` <a href="https://servermanagementportal.ext.hpe.com/docs/concepts/datatypesandcollections/" target="_blank">data type</a> is <a href="https://servermanagementportal.ext.hpe.com/docs/redfishservices/ilos/ilo6/ilo6_adaptation/#hpe-smart-storage-model-oem-deprecated" target="_blank">deprecated in HPE iLO 6</a> based servers.

**NOTE**: The latest versions of iLO 5 firmware support both the HPE `SmartStorageConfig` and the DMTF standard storage models. Volume management with controllers implementing the DMTF storage model is described in the <a href="https://servermanagementportal.ext.hpe.com/docs/redfishservices/ilos/supplementdocuments/storage/" target="_blank">HPE server management portal</a>.

We assume that the reader is familiar with REST APIs in general and Redfish in particular. A good entry point for developers to grasp the power of Redfish is the <a href="https://www.hpe.com/us/en/servers/restful-api.html#" target="_blank">iLO RESTful API Ecosystem</a>.

## Foreword

For didactic purposes, we use direct URIs to targets instead of crawling  the Redfish tree to discover the target URIs, as explained in the <a href="https://developer.hpe.com/blog/getting-started-with-the-redfish-api-part-2/" target="_blank">Getting Started with the Redfish® API Part 2</a> blog post.

In the following paragraphs, `{{Subsystem-URI}}` refers to an URI like `https://<ilo-IP>/redfish/v1/<subsystem>/` where `<subsystem>` represents either `Bios` or `SmartStorageConfig`. These subsystems contains the currently used properties.

Each of them has a pending sub-zone called `Settings/` and explained in the next paragraph.

## Deferred / pending high level concept description

1. Modifications in these subsystems are performed using HTTP `PATCH` or HTTP `PUT` against `{{Subsystem-URI}}/`**`Settings/`**.
2. Upon a successful transaction, the HTTP return code is `200 OK` with the associated message: `One or more properties were changed and will not take effect until the system is reset`.
3. During the next system reset, the content of `{{Subsystem-URI}}/Settings/` is transferred one level up, in `{{Subsystem-URI}}/`. The return status of this transfer is present in `{{Subsystem-URI}}` with an associated message.

The important thing to note in this flow is that the final status code and associated message of a property setting is visible **after the system reset**.

## Successful example

In this example, we create a Raid1 storage array of two physical disks using Postman. To achieve this goal, we have to issue a `PUT` to `{{iloURI}}/redfish/v1/Systems/1/SmartStorageConfig/Settings/` with a body (aka payload) similar to the example shown below:

![Body to PUT to .../SmartStorageConfig/Settings/](/img/1-put-body.png "Body to PUT to .../SmartStorageConfig/Settings/")

Upon successful completion of this `PUT` request, the HTTP status return code is `200 OK`, which means that the remote Web server understood what to do with this well-formed payload.

The Body of the HTTP response contains an `error` property with a `SystemResetRequired` message. This property is a Redfish object sent by the Redfish server. It is there to give details about the next step to perform to finish the modification process.

![PUT Return Status](/img/2-put-return-status.png "PUT Return Status")

At this stage of the process, only the staging / "pending zone" of the Smart Array has changed and contains the `PUT` payload. We can verify this assertion by comparing the content of  `{{Subsystem-URI}}/Settings/` with the content of `{{Subsystem-URI/}}`.

In the pending zone (`.../SmartStorageConfig/Settings/`) we can see the payload we sent to the Redfish server. However, in the "running zone" (`.../SmartStorageConfig/`) the `LogicalDrives` array is still empty:

![GET Pending and Current LogicalDrives](/img/3-getpendinglogicadrives.bmp "GET Pending and Current LogicalDrives")

It is now time to reset the server and perform a `GET` of the running zone. In the response body of this operation, the first Redfish object is a `@Redfish.Settings` collection containing a single `MessageID` mentioning `Success`. This single message is synonym of a successful transfer of the "pending zone" in to the "running zone". We will see later in this document what we get in case of an un-successful transfer.

![GET Running zone after server reset](/img/5-getafterreset.png "GET Running zone after server reset")

Further down in this response we find the `LogicalDrives` array containing the Raid1 disk array:

![GET LogicalDrives from running zone](/img/6-getafterreset-2.png "GET LogicalDrives from running zone")

## Unsuccessful example

In order to emphasize the fact that the modification status of properties in the `Bios` and `SmartStorage` subsystems must be done after a system reset, we will study a case where the JSON `PUT` payload is syntactically correct but embedding a value typo (`Raid` instead of `Raid1`) and missing a required key-value (`DataGuard=Disabled`):

![PUT of a bad payload](/img/7-badpayload.png "PUT of a bad payload")

Sending this request returns an HTTP `200 OK` status and a `SystemResetRequired` Redfish message just like in the previous example:

![PUT return status of bad Redfish request](/img/8-put-return-status-of-bad-request.png "PUT return status of bad Redfish request")

The pending zone contains the faulty payload:

![Faulty payload in pending zone](/img/9-pendingzonewithbadrequest.png "Faulty payload in pending zone")

After the server reset, a `GET` of the running zone responds with a `MessageArgs=[DataGuard]` object and two `MessageID`keys. The first one mentions `DataGuard` as a missing property and the second one (`Success`) means that the analysis of the transfer from the pending zone to the running zone has successfully ended. This `Success` message does not means that the transfer has occurred.

Moreover, note that there is nothing mentioning the `Raid` typo. It means that analysis of the payload to transfer stops at the first error found.

![DataGuard Property Missing](/img/10-dataguardpropertymissing.png "DataGuard Property Missing")

If we drill down to the `LogicalDrives` array we notice that it is still empty. Hence the transfer did not occur.

![Empty LogicalDrives array](/img/11-emptylogicaldrivesarray.png "Empty LogicalDrives array")

If we `PUT` a new payload with the `DataGuard=Disabled` property but still without correct Raid level and reset the server, we notice an `InvalidRAIDLevel` message explaining the problem.

![Wrong Raid Level error](/img/12-wrongraidlevel.png "Wrong Raid Level error")

## Conclusion

Understanding the pending / deferred process when modifying Bios and SmartStorage properties using the Redfish API as well as the different types of return codes (HTTP, MessageID...) should ease program development and troubleshooting sessions.

Don't forget to check out some of my other <a href="https://developer.hpe.com/search/?term=donze" target="_blank">blog posts</a> on the HPE Developer portal to learn more about Redfish tips and tricks.