---
title: CHIF driver not found
date: 2021-06-14T07:29:21.829Z
author: François Donzé
authorimage: /img/Avatar1.svg
---
## Introduction

When using the HPE RESTful Interface Tool ([iLOrest](http://hpe.com/info/resttool)) or other applications like the Smart Update Manager ([SUM](https://www.hpe.com/us/en/servers/smart-update.html)) or the integrated Smart Update Tool ([iSUT](https://support.hpe.com/hpesc/public/docDisplay?docLocale=en_US&docId=emr_na-a00068223en_us)) you may get the error `Chif driver not found, please check that the chif driver is installed` without any other tip to identify the origin of the problem or to fix it. This article attempts to explain when this error occurs and why.

## What is the CHIF driver ?

The Channel Interface (CHIF) driver is an HPE proprietary driver allowing  in-band communication between applications and the Insight Lights Out (iLO) within HPE ilO based servers.

![The CHIF driver](/img/chifdriver.png "The CHIF driver")

This driver is packaged with the HPE applications that require it and should never been imported or manipulated manually. The following screenshot