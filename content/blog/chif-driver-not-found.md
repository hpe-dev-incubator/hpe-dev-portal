---
title: CHIF driver not found
date: 2021-06-22T12:06:33.680Z
author: François Donzé
authorimage: https://gravatar.com/avatar/6f3982d1461459da475f47e3a6c89d1d?s=192
tags:
  - ilo-restful-api
  - redfish
  - chif driver
  - ilorest
  - ilo 5
---
## Introduction

When using the HPE RESTful Interface Tool ([iLOrest](http://hpe.com/info/resttool)) or other applications, like the Smart Update Manager ([SUM](https://www.hpe.com/us/en/servers/smart-update.html)) or the integrated Smart Update Tool ([iSUT](https://support.hpe.com/hpesc/public/docDisplay?docLocale=en_US&docId=emr_na-a00068223en_us)), you may get errors similar to the one shown below without any other information to identify the origin of the problem or how to fix it.

`Chif driver not found, please check that the chif driver is installed`

This article attempts to explain what causes this error and why.

## What is the CHIF driver ?

The Channel Interface (CHIF) driver is an HPE proprietary driver allowing in-band communication between applications and the Insight Lights Out (iLO) within HPE iLO based servers. It is stored as a dynamic loadable library file (`.dll`) on Microsoft Windows and a shared object (`.so`) on Linux.

This driver can only be loaded by applications when an iLO chip set is embedded in the computer.

![The CHIF driver allows communication between applications and iLO](/img/chifdriver.png "The CHIF driver allows communication between applications and iLO")

The CHIF driver comes packaged with HPE applications requiring it. You don't need to import it manually. However, for home grown applications using the HPE Redfish library or PowerShell Cmdlets (i.e. [HPESysinfoCmdlets](https://www.powershellgallery.com/packages?q=HPESysinfoCmdlets)), you will have to  install it from the HPE Software ProLiant Pack (SPP) or download it from the [HPE Support Center](https://internal.support.hpe.com/hpesc/public/km/search#q=ilo%205%20channel%20interface%20driver&t=DriversandSoftware&sort=relevancy&numberOfResults=25) before manual installation if it has not already been installed by an application that required it. 

## Quick reminder of iLOrest in-band management

The [iLOrest](http://hpe.com/info/resttool) tool allows in-band and out-of-band Redfish management, as explained in [this article](https://developer.hpe.com/blog/managing-ilo-sessions-with-redfish/).

If you are logged into an HPE iLO 4 or iLO 5 based server as a privileged user (`root` or `Administrator`), you can perform in-band management tasks with iLOrest without providing any credentials. You just have to issue GET or SET commands in a straight forward manner to query the local iLO Redfish service.

The following picture shows an SSH root session creation toward an HPE DL360 Gen10 with the execution of an iLOrest GET command without any formal login process. The `Discovering data...Done` message means that iLOrest could effectively log into the local iLO 5 and save metadata in its cache. Then, it displays the output of the GET command (`Model=iLO 5`).

![Successful in-band GET command](/img/successfulinbandget.png "Successful in-band GET command")

## What causes the Chif Driver not found error?

The most typical situation is when you are logged in, as a privileged user in a non-iLO based server, a virtual machine or a laptop, and you issue a script performing in-band Redfish commands.

In those cases, there is no iLO underneath the operating system. Hence the CHIF driver, although present as a file somewhere on disk, cannot be properly loaded by the application.

### Issuing iLOrest in-band commands on a non-iLO based server

The most typical iLOrest invocation is:

```shell
ilorest login <RedfishService-IP-address>
ilorest cmd1
ilorest cmd2
...
ilorest logout
```

If you don't provide any `<RedfishService-IP-address>` to the `iLOrest login` command, or if you completely omit this command, iLOrest uses the `blobstore://.` target URL and tries to connect to the local iLO via the CHIF driver.

If you use a [Redfish client](https://youtu.be/ur9UKRV_0S8) different from iLOrest that uses another library, like the [DMTF Python Redfish Library](https://github.com/DMTF/python-redfish-library), you will not be able to perform in-band management through the CHIF driver. An alternative is to enable the [iLO Virtual NIC](https://www.youtube.com/watch?v=KM1FZ-AlctA) and use its IP address as the target URL.

The following picture shows an SSH privileged session in a VMware virtual machine and an iLOrest in-band GET command returning the error. 

![Unsuccessful in-band GET from Virtual Machine](/img/unsuccessfulinbandgetinvm.png "Unsuccessful in-band GET from Virtual Machine")

The next screenshot shows the same iLOrest command launched from a Microsoft Windows laptop.

![Unsuccessful in-band GET from laptop](/img/unsuccessfulinbandgetinwinlaptop.png "Unsuccessful in-band GET from laptop")

The following paragraphs address In-band Python scripts, PowerShell Cmdlets and VMware infrastructures with respect to the CHIF driver. 

### In-band Python scripts

The `blobstore://.` URL mentioned above, can be used as well, in Redfish Python scripts based upon the [HPE python-ilorest-library](https://github.com/HewlettPackard/python-ilorest-library) to perform in-band management operations. Such programs will have the same behavior as iLOrest since iLOrest uses as well the HPE Python Redfish library. 

In picture below, you can see the Python example [get_ilo_ip.py](https://github.com/HewlettPackard/python-ilorest-library/blob/master/examples/Redfish/get_ilo_ip.py) configured for in-band management.

The `grep` command, following the `dmidecode` command, returns all the lines of the `get_ilo_ip.py` file, containing strings `SYSTEM_URL` or `LOGIN_ACCOUNT` or `LOGIN_PASSWORD`. Lines starting with a `#` sign are commented lines, and are thus not executed.

The target URL (`SYSTEM_URL`) points to `blobstore://.` and the `LOGIN_ACCOUNT` and `LOGIN_PASSWORD` variables are empty. With this configuration, the `RedfishClient` method will try to connect to the CHIF driver to access the local iLO. However, it fails because the script is executed on a virtual machine.

The result of this in-band configuration is a `ChifDriverMissingOrNotFound` error. 

> **NOTE**: Only the last two lines of the stack dump are displayed.

![blobstore target URL](/img/blobstoretarget.png "blobstore target URL")

### HPE PowerShell Cmdlets and in-band management

 As of the writing of this article, only the [HPESysinfoCmdlets](https://www.powershellgallery.com/packages?q=HPESysinfoCmdlets) uses the CHIF driver for in-band management. Other PowerShell Cmdlets like the [HPEiLOCmdlets](https://www.powershellgallery.com/packages/HPEiLOCmdlets/) or the [HPERedfishCmdlets](https://www.powershellgallery.com/packages/HPERedfishCmdlets/) cannot be configured for in-band management through the CHIF driver.

### Miss configured HPE/VMware infrastructures

I've seen cases where VMware system managers installed manually a `.rpm` iLOrest package in their ESXi hypervisor instead of getting it installed properly with a [supported HPE custom image](https://vibsdepot.hpe.com/). It is important to remember that HPE bundles and tests specific application packages of iLOrest, SUM, SUT and the Agentless Management Service (AMS) for the ESXi hypervisor. Manual installation of those applications will generate problems like the `Chif driver not found` error.

## Other related problematic situations

The previous sections of this article tried to explain the root causes of the `Chif driver not found` error. However you can face situations involving the CHIF driver where iLOrest commands return a valid output, but from the wrong system !

### iLOrest scripts accessing a wrong iLO

You may come across this error if you are a privileged user launching an iLOrest script from an iLO-based server targeting a remote iLO, but the script supplies the wrong credentials. In that case, iLOrest returns an error code, but sadly enough, the script does not test the return code of the login process and continues its execution. 

As you are privileged on a physical iLO based system with the CHIF driver up and running, iLOrest performs the following requests successfully on your system via the CHIF driver in place of the remote server. This situation is embarrassing because you are performing management actions on the wrong system.

The following picture displays a script launched from an iLO 4 based computer, targeting an iLO 5, but supplying a faulty username and password in the login command and discarding errors (`&> /dev/null`).

As a consequence, the next iLOrest command retrieves the local iLO 4 firmware version, instead of the remote iLO 5 firmware version ! 

![iLOrest accessing wrong iLO](/img/wrongchif.png "iLOrest accessing wrong iLO")

In order to avoid embarrassing situations like this, it's always good to double-check that your script tests iLOrest return codes.

## Take away

I hope you found this tutorial helpful. You can find many articles regarding iLO here in the [HPE DEV blog](https://developer.hpe.com/blog/). In this post, I've tried to point out situations where you may come across the Chif driver not found error and offer suggestions on how to avoid this. The most important things you should remember concerning this error are: 

* The CHIF driver is an HPE proprietary driver allowing communications between applications and iLO
* The error occurs when the CHIF driver cannot be loaded by applications calling it.
* Avoid performing remote management tasks as an OS privileged user.