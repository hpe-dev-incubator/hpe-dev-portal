---
title: CHIF driver not found
date: 2021-06-14T07:29:21.829Z
author: François Donzé
authorimage: /img/Avatar1.svg
---
## Introduction

When using the HPE RESTful Interface Tool ([iLOrest](http://hpe.com/info/resttool)) or other applications like the Smart Update Manager ([SUM](https://www.hpe.com/us/en/servers/smart-update.html)) or the integrated Smart Update Tool ([iSUT](https://support.hpe.com/hpesc/public/docDisplay?docLocale=en_US&docId=emr_na-a00068223en_us)) you may get an error similar to: `Chif driver not found, please check that the chif driver is installed` without any other tip to identify the origin of the problem or to fix it. This article attempts to explain when this error occurs and why.

## What is the CHIF driver ?

The Channel Interface (CHIF) driver is an HPE proprietary driver allowing  in-band communication between applications and the Insight Lights Out (iLO) within HPE iLO based servers.

![The CHIF driver](/img/chifdriver.png "The CHIF driver")

This driver is packaged with the HPE applications that require it and should never been imported or manipulated manually.

## Quick reminder of iLOrest in-band management

The iLOrest tool allows in-band and out-of-band Redfish management as explained in [this article](https://developer.hpe.com/blog/managing-ilo-sessions-with-redfish/).

If you are logged in an HPE iLO 4 or iLO 5 based server as a privileged user (root or Administrator), you can perform in-band management tasks with iLOrest without providing any credentials or use the `login` command. You just have to issue GET or SET command in a straight forward manner. 

The following picture shows an SSH root session creation, toward an HPE DL360 Gen10 with the execution of an iLOrest GET command without any formal login process. The `Discovering data...Done` message means that iLOrest could effectively log into the local iLO 5 and save data in its cache. Then, it displays the output of the GET command (`Model=iLO 5`).

![Successful in-band GET command](/img/successfulinbandget.png "Successful in-band GET command")

## TBD

But what will happen if you SSH into a non HPE server or into a virtual machine ?

![Unsuccessful in-band GET from Virtual Machine](/img/unsuccessfulinbandgetinvm.png "Unsuccessful in-band GET from Virtual Machine")



### In VMware / ESXi infrastructures

TBD

### iLOrest scripts or interactive sessions

Getting this error message is very common and here are typical cases 

### Python / PowerShell scripts

TBD

## Conclusion