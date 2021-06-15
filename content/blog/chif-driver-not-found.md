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

## When does this error occurs ?

The most typical situation for this error to occur is with the iLOrest tool. This tool allows in-band and out-of-band Redfish management as explained in [this article](https://developer.hpe.com/blog/managing-ilo-sessions-with-redfish/).

If you are logged in an HPE iLO 4 or iLO 5 based server as a privileged user (root or Administrator), you can perform in-band management tasks with iLOrest without providing any credentials or use the `login` command. You just have to issue GET or SET command in a straight forward manner. 

The following picture shows a root SSH session creation toward an HPE DL360 Gen10 and the execution of an `ilorest get` command without any login process. The  TBD

![Successful in-band GET command](/img/successfulinbandget.png "Successful in-band GET command")



### In VMware / ESXi infrastructures

TBD

### iLOrest scripts or interactive sessions

Getting this error message is very common and here are typical cases 

### Python / PowerShell scripts

TBD

## Conclusion