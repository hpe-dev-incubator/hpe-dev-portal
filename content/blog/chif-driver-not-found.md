---
title: CHIF driver not found
date: 2021-06-22T12:06:33.680Z
author: François Donzé
authorimage: https://gravatar.com/avatar/6f3982d1461459da475f47e3a6c89d1d?s=192
---
## Introduction

When using the HPE RESTful Interface Tool ([iLOrest](http://hpe.com/info/resttool)) or other applications like the Smart Update Manager ([SUM](https://www.hpe.com/us/en/servers/smart-update.html)) or the integrated Smart Update Tool ([iSUT](https://support.hpe.com/hpesc/public/docDisplay?docLocale=en_US&docId=emr_na-a00068223en_us)) you may get errors similar to: `Chif driver not found, please check that the chif driver is installed` without any other information to identify the origin of the problem or to fix it. This article attempts to explain when this error occurs and why.

## What is the CHIF driver ?

The Channel Interface (CHIF) driver is an HPE proprietary driver allowing  in-band communication between applications and the Insight Lights Out (iLO) within HPE iLO based servers. This driver can only be loaded by the operating system kernel when an iLO chip set is embedded in the computer.

It is packaged with HPE applications requiring it and should never be imported or manipulated manually.

![The CHIF driver allows communication between applications and iLO](/img/chifdriver.png "The CHIF driver allows communication between applications and iLO")



## Quick reminder of iLOrest in-band management

The iLOrest tool allows in-band and out-of-band Redfish management as explained in [this article](https://developer.hpe.com/blog/managing-ilo-sessions-with-redfish/).

If you are logged in an HPE iLO 4 or iLO 5 based server as a privileged user (root or Administrator), you can perform in-band management tasks with iLOrest without providing any credentials or use the `login` command. You just have to issue GET or SET command in a straight forward manner. 

The following picture shows an SSH root session creation, toward an HPE DL360 Gen10 with the execution of an iLOrest GET command without any formal login process. The `Discovering data...Done` message means that iLOrest could effectively log into the local iLO 5 and save metadata in its cache. Then, it displays the output of the GET command (`Model=iLO 5`).

![Successful in-band GET command](/img/successfulinbandget.png "Successful in-band GET command")

But what happens if you SSH into a non HPE server or into a virtual machine ? In both cases, there is no iLO under the operating system. Hence the CHIF driver, although present somewhere on disk, could not be be loaded in the kernel and the application returns an error because it cannot connect to it.

The following picture shows an SSH login into a VMware virtual machine and an ilorest in-band management command returning the error. 

![Unsuccessful in-band GET from Virtual Machine](/img/unsuccessfulinbandgetinvm.png "Unsuccessful in-band GET from Virtual Machine")

The next screenshot shows the same iLOrest command launched from a Microsoft Windows computer, with no embeded iLO chip.

![Unsuccessful in-band GET from a Windows laptop](/img/unsuccessfulinbandgetinwinlaptop.png "Unsuccessful in-band GET from a Windows laptop")

## Common situations where you get this error

Getting this error message is very common and here are typical cases

### iLOrest scripts or interactive sessions

You don't notice that credentials are bad or you are not a privileged user. 

### Python / PowerShell scripts

Blobstore

### VMware infra: you don't notice you supplied the wrong credentials

## Other related problematic situations

The main purpose of this article is to explain the source and the reasons of the `Chif driver not found` error. However you can face situations where your iLOrest commands return a valid output, but from the wrong system. 

In the following picture, privileged user `roor` launches iLOrest from an iLO 4 based server toward an iLO5. The login credentials are wrong and the script does not test the login return code. Moreover, it even discards the login process output to keep the screen cleaner or for some other reasons.

Following the `login` command, the script perform a GET 

## Conclusion