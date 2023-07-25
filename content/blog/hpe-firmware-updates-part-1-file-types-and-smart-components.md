---
title: "HPE firmware updates: Part 1 – File types and Smart Components"
date: 2020-08-21T15:07:31.534Z
featuredBlog: false
priority: null
author: François Donzé
authorimage: /img/fdz-photoprofile.png
thumbnailimage: null
tags:
  - ilo-restful-api
  - firmware
  - uefi
  - redfish
---
### Updated: July 25, 2023

## Introduction

Computer firmware updates are extremely important as they offer new features, fix bugs, and deliver security improvements. The diversity of devices within a computer that contain firmware is high and, unfortunately, due to their nature and origin, there is not a single path to update them. As an example, HPE ProLiant or Synergy BIOS/ROM firmware may not be updated with the same tools as a partner add-on network card.

An efficient firmware update strategy requires the knowledge of several key components like update agents and firmware package types, as well as an awareness of all the associated tools involved. This multipart blog series describes the main objects related to firmware updates in HPE iLO 5 based servers and the relationships between them, important information to know when addressing firmware updates.

In this first part, I will cover firmware file types and Smart Components (SC), including SC security and partner-specific considerations. It should be noted that I will not be covering the potential dependencies found with high-level management software like HPE OneView or the HPE iLO Amplifier Pack. For information on those topics, please refer to the specific product [documentation](http://www.hpe.com/support/hpesc).

The [second part](/blog/hpe-firmware-updates-part-2-interaction-in-operating-modes) concerns firmware operating modes on different network topologies. Finally, once the firmware concepts are well understood, you will be ready to read part three, which deals with the automation of firmware updates using the [Redfish®](https://redfish.dmtf.org/) standard.

## Firmware binaries

Depending on the device being updated (aka flashed), the type of file containing the firmware is different. As an example, the Power Management Controller firmware is embedded in a `.hex` file while the System Programmable Logic Device firmware file uses the extension `.vme`. The exhaustive list of HPE firmware binary types is presented in a Help pop-up window of the iLO Graphical User Interface: `Firmware & OS Software --> Update Firmware` (right pane) `--> ? 
 --> Server firmware file type details`.

![d1](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/7/d1-1598025868664.png)

## Smart Components

HPE and partner vendor (Intel, Mellanox, Marvell, etc.) firmware binaries are packaged in Smart Components. They are distributed individually via the online [HPE Support Center](https://support.hpe.com/hpesc/public/home/) or grouped in support packs like the [Service Support Pack for ProLiant](http://www.hpe.com/servers/spp) (SPP).

Smart Components are self-executable modules that contain firmware binaries, drivers, and JSON/XML metadata, as well as the code used to install or flash the embedded firmware or driver. They are packaged in different files types: `.fwpkg, .zip, .rpm` and `.exe`. In older SPPs, you may also find`.scexe` extensions.

You can browse and extract the content from Smart Components using tools like `7-Zip` on Windows or `unzip, rpm` or `rpm2cpio` combined with `cpio` on Linux (see below picture). The following screenshots show content from the different SC types.

![d2](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/7/d2-1598025876858.png)

![d3](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/7/d3-1598025882328.png)

![d4](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/7/d4-1598025888854.png)

## Security concerns

Smart Components are digitally signed by Hewlett Packard Enterprise (HPE) to avoid any injection of malware following the creation of the SC. The digital signature is either embedded in the SC (i.e. `.fwpkg`) or in an external companion file (`.compsig`). During the upload of Smart Components into the iLO Repository of a server, iLO verifies and validates the signature. If the signature does not validate correctly, iLO discards the SC and returns and error similar to “The file signature is invalid”.

![d5](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/7/d5-1598025894853.png)

![d6](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/7/d6-1598025903184.png)

HPE binaries contained in the SC also include an HPE signature. The following screenshot shows the beginning and the end of the fingerprint section found in an iLO. It also shows the ROM/BIOS firmware extracted from the respective Smart Components. 

![d7](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/7/d7-1598025910403.png)

Smart Components larger than 32 MiB have several associated `.compsig` files, because iLO, like all of the Baseboard Management Cards (BMC) compliant to the Redfish® standard, has a limited transfer size of 32 MiB. The following picture shows a component in SPP 2020.03 with four `.compsig` files. To upload this SC into an iLO repository, you will need to first split it into chunks of 33554432 bytes (32 \* 1024 \* 1024) to match the `.compsig` files. You can automatically and seamlessly perform this split operation using tools like [iSUT](https://h20195.www2.hpe.com/V2/getpdf.aspx/4AA4-6947ENW.pdf), [SUM](https://support.hpe.com/hpesc/public/docDisplay?docId=a00097903en_us) or [iLOrest](http://hpe.com/info/resttool).

![d8](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/7/d8-1598025918145.png)

## Update agents

HPE iLO can flash its own firmware as well as the firmware of other devices. However, it is not able to flash all types of firmware to their target locations. Other update agents exist that can help with this and are listed in the `UpdatableBy` JSON array mentioned in the [HPE Redfish API reference document](https://servermanagementportal.ext.hpe.com/docs/redfishservices/ilos/ilo6/ilo6_145/ilo6_hpe_resourcedefns145/#updatableby-array). The description of each element (`Uefi, RuntimeAgent` and `Bmc`) is shown in the following screenshot.

![UpdatableBy (array)](/img/8-updatablebyarray.png)

## Smart Component metadata

Smart Components contain metadata stored in one or more files with different suffixes (`.xml`, `.json`, etc). The `payload.json` file lists the update agents able to process the component. This list can be viewed from the iLO Graphical User Interface in the `Firmware & OS Software – iLO Repository` screen.

![d10](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/7/d10-1598025933118.png)

Note that, if you modify the SC metadata file and its list of supported update agents, iLO will refuse to upload the SC since the signature has changed.

## Partner Smart Components

HPE partner (Intel, Marvell, Mellanox, etc.) firmware and drivers are packaged in signed Smart Components by HPE. Very often, they also contain executables, scripts, and dynamically linked libraries (`.dll`) that are proprietary to the partner. It is crucial to understand that the list of update agents that are able to flash a partner’s firmware is dictated by the partner. Neither HPE nor end customers have the possibility to alter this list.

For example, Smart Component `cp040152.exe` contains firmware updates for Intel Fortville based adapters. As shown below, the embedded `payload.json` only lists `RuntimeAgent` in the `UpdatableBy` array. Moreover, the `FirmwareImages` section explicitly mentions that UEFI is not able to flash the binary file `.//FW/BootIMG.FLB`. In other words, only OS-based applications, like [iSUT](https://h20195.www2.hpe.com/V2/getpdf.aspx/4AA4-6947ENW.pdf) or [SUM](https://support.hpe.com/hpesc/public/docDisplay?docId=a00097903en_us), are able to perform the firmware updates of these converged network adapters by launching the tools provided by the partner. The consequences of using this type of SC is discussed in Part 2 of this series.

![d11](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/7/d11-1598025939128.png)

> Note: With the implementation of the Platform Level Data Model for Firmware Update [PLDM for FWUPD](/blog/benefits-of-the-platform-level-data-model-for-firmware-update-standard/) in both iLO firmware and external supplier devices, the firmware update process is simplified as it does not require any run time agents anymore.

## Summary

In this article, I covered the following objects and concepts involved in HPE firmware updates, as well as their relationships:

* HPE Firmware binary types 
* HPE and partner Smart Components 
* Update agents 
      

This is important information you need to plan your firmware update strategy, but it is not sufficient. In my second article on this subject, I will describe different update operating modes as well as the interactions between different objects. Make sure you check the [HPE DEV blog](/blog) site often to view my next post as well as other interesting tutorials and articles.