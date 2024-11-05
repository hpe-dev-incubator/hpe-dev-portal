---
title: Master the Redfish Server States to improve your monitoring and
  management applications
date: 2018-08-06T14:07:07.818Z
featuredBlog: false
priority: null
author: François Donzé
authorimage: /img/fdz-photoprofile.png
thumbnailimage: null
tags:
  - Redfish
  - PostState
  - PowerState
  - ServerState
  - iLO5
  - ProLiant
  - Synergy
---
Updated November, 2024

## Introduction

Server management and monitoring often require the knowledge of the state of the managed servers (On, Off....). The [Redfish®](https://www.dmtf.org/standards/redfish) standard defines the <a href="https://redfish.dmtf.org/schemas/v1/ComputerSystem.v1_5_0.json" target="_blank">PowerState</a> property with `Off` `On` as possible values. However, when the system is in the `On` state, you may want to know in which sub-state the server is: Pre-OS Tasks (POST), Operating System (OS) running. You may want to know, too, if the storage controllers or network cards have been discovered properly.

This blog presents the <a href="https://servermanagementportal.ext.hpe.com/docs/redfishservices/ilos/ilo6/ilo6_156/ilo6_computersystem_resourcedefns156/#oemhpepoststate" target="_blank">PostState</a> property available in the `Oem.Hpe` extension of the `ComputerSystem` Redfish sub-tree of HPE servers (Gen9, Gen10 and Gen11). It presents as well the `DeviceDiscoveryComplete` <a href="https://servermanagementportal.ext.hpe.com/docs/redfishservices/ilos/ilo6/ilo6_163/ilo6_computersystem_resourcedefns163/#oemhpedevicediscoverycomplete" target="_blank">property</a>, part of the same OEM extension and extremely important when you want to configure <a href="https://developer.hpe.com/blog/overview-of-the-platform-level-data-model-for-redfish%C2%AE-device-enablement-standard/" target="_blank">PLDM for RDE</a> devices.

In the last paragraph you will find a description of the `BootProgress{}`
<a href="https://servermanagementportal.ext.hpe.com/docs/redfishservices/ilos/ilo6/ilo6_163/ilo6_computersystem_resourcedefns163/#bootprogress"
target="_blank">object</a> and its properties providing valuable information related to the OS boot progress.

## HPE PostState

As mentioned in the [HPE iLO 4](https://hewlettpackard.github.io/ilo-rest-api-docs/ilo4/#poststate) API Reference documents, the `PostState` property can have the following values: `Null`, `Unknown`, `Reset`, `PowerOff`, `InPost`, `InPostDiscoveryComplete` and `FinishedPost`.

<a href="https://servermanagementportal.ext.hpe.com/docs/redfishservices/ilos/ilo6/ilo6_163/ilo6_computersystem_resourcedefns163/#oemhpepoststate"
target="_blank">Following HPE iLO generations</a> have one more value: `InPostDiscoveryStart`.

Since the first four values have a straight forward meaning, I'll focus only focus on the other ones.

The `InPost` value means that the server is still performing the Pre-OS Tasks (tests and hardware discovery). With a graphical console opened, when a server is in this state you can see a green progress bar:

![InPost state 1](/img/1-inpost.png "InPost state 1")

![InPost state 2](/img/2-inpost.png "InPost state 2")

`InPostDiscoveryStart` follows the `InPost` state and then, `InPostDiscoveryComplete`.  For the purpose of this blog, I'll assume that it corresponds to the state in which UEFI is loaded and running:

![InPostDiscoveryComplete / UEFI](/img/3-inpostdiscoverycomplete.png "InPostDiscoveryComplete / UEFI")

Note that when an UEFI executable is running (i.e. UEFI Shell, `grubx64.efi`...) the server stays in the `InPostDiscoveryComplete` state.

The last possible value for the `PostState` key is `FinishedPost`. In this state, the server is either booting an installed OS or has completely finished its boot process.

## PostState use cases

The first obvious use case for probing the `PostState` of a server or a set of servers is in a  monitoring application. Combined with the health status of the different components of the server, you will be able to draw dashboards or create reports.

In a server management and configuration context, several properties can only be modified when the server is in a particular state. For example, the boot order can only be modified in the `Off` or in the `FinishedPost` states.

In the following screenshot I used <a href="https://github.com/HewlettPackard/python-redfish-utility/releases/latest" target="_blank">iLOrest</a> to change the next boot entry of a server being in the `InPostDiscoveryComplete` state. In this case, the iLO returns a `[400]` error code with an explicit message.

![Boot Order cannot be changed when in POST](/img/4-cannotchangebootorderwheninpost.png "Boot Order cannot be changed when in POST")

In a Bios and/or storage controller configuration process, the `PostState` property plays a crucial role. As explained in
<a href="https://developer.hpe.com/blog/setting-bios-and-storage-controller-properties-with-redfish/"
target="_blank">Setting Bios and Storage Controller Properties with Redfish</a>
this process is performed in two phases: 1 - parameter setup into a Redfish pending area. 2 - Reset / Cold Boot of the server to trigger a POST during which the new settings will be verified and transferred, if validated, from  the pending area into the active area.

When the modifications are not validated during the second phase a message explaining the problem can be retrieved once the server is in the `InPostDiscoveryComplete` or `FinishedPost` states.

Hence, as a best practice, it is wise to pool the managed nodes and check for possible error messages when they are in one of those states (`InPost` or `InPostDiscoveryComplete`).

## How do I retrieve the Server State

The easiest way to obtain the `PostState` of a server is to issue the `serverstate` macro command of the <a href="https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/ilocommands/#serverstate-command" target="_blank">iLOrest</a> utility. ILOrest automatically detects the generation of the server (Gen9, Gen10...) and fetches the `PostState` value from the right Redfish URI.

The <a href="https://github.com/HewlettPackard/python-redfish-utility" target="_blank">Open Source</a> version of iLOrest contains the source of this <a href="https://github.com/HewlettPackard/python-redfish-utility/blob/master/src/extensions/iLO_COMMANDS/ServerStateCommand.py" target="_blank">ServerState</a> macro command in Python. Feel free to consult it.

![Retrieve `PostState` with iLOrest](/img/5-retrieveserverstatewithilorest.png "Retrieve `PostState` with iLOrest")

If you decide to create your own Redfish client, you will have to adapt your code to the potential Redfish <a href="https://servermanagementportal.ext.hpe.com/docs/redfishservices/ilos/ilo5/ilo5_adaptation/#ilo-5-data-model-changes" target="_blank">data model changes</a> between the different generations of servers or iLOs.

As a concrete example, in an HPE rack mount server the `PostState` property has moved from `/redfish/v1/Systems/1/Oem/Hp` in Gen9 models to `/redfish/v1/Systems/1/Oem/Hpe` in Gen10s and later.

## The DeviceDiscoveryComplete object

In addition to the `PowerState` and `PostState` properties, the <a href="https://servermanagementportal.ext.hpe.com/docs/redfishservices/ilos/ilo6/ilo6_156/ilo6_computersystem_resourcedefns156/#oemhpedevicediscoverycomplete"
target="_blank">DeviceDiscoveryComplete{} object</a> returns the states of the Agentless Management Service
(<a href="https://support.hpe.com/hpesc/public/docDisplay?docId=a00105236en_us&page=GUID-D47686D6-8CDF-4A49-9FC5-8895458A039E.html"
target="_blank">AMS</a>), SmartArrays (if any) and a third generic discovery state for all devices.

It may happen during startup that a system returns `InPostDiscoveryComplete` while not all of its devices have been discovered, like <a href="https://developer.hpe.com/blog/overview-of-the-platform-level-data-model-for-redfish%C2%AE-device-enablement-standard/" target="_blank">PLDM for RDE</a> capable devices.

The following script polls every other second the `PostState` and the `DeviceDiscoveryComplete` properties using the `cURL` Redfish client:

```shell
let i=1
while [ 1 ] ; do
    echo $i
    $CURL --silent --insecure -u ${ILO_USER}:${ILO_PASSWD}   \
        --request GET                                        \
        -H "OData-Version: 4.0"                              \
        https://${ILO_IP}/redfish/v1/Systems/1/              \
        | jq -r '.Oem.Hpe.PostState, .Oem.Hpe.DeviceDiscoveryComplete'
    sleep 2
    let i++
    echo
done
```

The following picture shows three iterations of the above script during the start of a server. In iteration 55 the server is `InPost` while the SmartArray is in a `Cached` state meaning that it will answer queries with cached data.

Two seconds later the next iteration returns the `InPostDiscoveryComplete` state and shows the SmartArray in `Busy` mode which means that it will return an error if queried during this state.

In iteration 62 we are still in `InPostDiscoveryComplete` but both `DeviceDiscovery` and `SmartArrayDiscovery` have reached their final `Complete` state. Hence the the corresponding devices can be queried safely.

![The `DeviceDiscoveryComplete{}` object](/img/6-devicediscoverycomplete.png "The `DeviceDiscoveryComplete{}` object")

If iLOrest is your preferred Redfish client tool, the above script looks like:

```shell
let i=1
u="ilo-user"
p="ilo-password"
ilo_ip="ilo-ip"
ilorest login $ilo_ip -u $u -p $p
while  [ 1 ] ; do
    echo $i
    ilorest get Oem/Hpe/PostState Oem/Hpe/DeviceDiscoveryComplete  \
            --select ComputerSystem. --refresh --json
    sleep 2
    let i++
    echo
done
```

## The BootProgress object

Starting with HPE iLO 6 version 1.63 and later, the `BootProgress{}`
<a href="https://servermanagementportal.ext.hpe.com/docs/redfishservices/ilos/ilo6/ilo6_163/ilo6_computersystem_resourcedefns163/#bootprogress"
target="_blank">object</a> is populated in the main
`ComputerSystem` member, under `/redfish/v1/Systems/1`, when the BIOS/ROM is modern enough.
In previous versions, this object was populated
only in <a href="https://servermanagementportal.ext.hpe.com/docs/redfishservices/ilos/supplementdocuments/smartnics/"
target="_blank">Data Processing Units (DPUs) and SmartNIC members</a>,
under `/redfish/v1/Systems/{item}` with `item > 1`.
The <a href="https://www.hpe.com/psnow/doc/a50001239enw"
target="_blank">Pensando</a> device is an example of such DPU with the `BootProgress{}` populated.

>Note: HPE iLO 5 only populates this object for members under
 `/redfish/v1/Systems/{item}` with `item > 1`.

 The `LastState` property of the `BootProgress{}`
 <a href="https://servermanagementportal.ext.hpe.com/docs/redfishservices/ilos/ilo6/ilo6_163/ilo6_computersystem_resourcedefns163/#bootprogress"
 target="_blank">object</a> contains
 interesting values like:

- `SetupEntered`: The system has entered the setup utility
- `OSRunning`: The operating system is running

You can monitor the `BootProgress.LastState` property with the following iLOrest script:

```shell
u="ilo-user"
p="ilo-password"
ip="ilo-ip"

ilorest login $ip -u $u -p $p
while [ 1 ] ; do
    ilorest get BootProgress/LastState --select ComputerSystem. --refresh --json
    sleep 3 ; echo
done
ilorest logout
```

## Conclusion

The global Power state of HPE iLO based servers can be retrieved
from the standard `PowerState` <a href="https://servermanagementportal.ext.hpe.com/docs/redfishservices/ilos/ilo5/ilo5_306/ilo5_chassis_resourcedefns306/#powerstate" target="_blank">property</a>. However, this property may
not be sufficient in all your management tasks.

In iLO 5 and later, additional sub states can be obtained from the OEM `PostState`
<a href="https://servermanagementportal.ext.hpe.com/docs/redfishservices/ilos/ilo5/ilo5_306/ilo5_computersystem_resourcedefns306/#oemhpepoststate">property</a>
and the `DeviceDiscoveryComplete{}`
<a href="https://servermanagementportal.ext.hpe.com/docs/redfishservices/ilos/ilo5/ilo5_306/ilo5_computersystem_resourcedefns306/#oemhpedevicediscoverycomplete"
target="_blank">resource</a>.

HPE iLO 6 and later feature the `BootProgress{}`
<a href="https://servermanagementportal.ext.hpe.com/docs/redfishservices/ilos/ilo6/ilo6_163/ilo6_computersystem_resourcedefns163/#bootprogress"
 target="_blank">object</a>
that provides a different view of the server states. Depending On
your needs, choose the most suitable resource.

HPE provides as well a rich Redfish ecosystem including the free <a href="https://github.com/HewlettPackard/python-redfish-utility/releases/latest" target="_blank">iLOrest tool</a>, its <a href="https://github.com/HewlettPackard/python-redfish-utility" target="_blank">Open Source</a> version and a <a href="https://github.com/HewlettPackard/python-ilorest-library" target="_blank">Python library</a>. PowerShell developers have the possibility to use a set of specific Redfish <a href="https://www.powershellgallery.com/packages/HPRESTCmdlets/" target="_blank">Cmdlets</a> required to run the <a href="https://github.com/HewlettPackard/PowerShell-ProLiant-SDK" target="_blank">GitHub ProLiant SDK</a>.

Don't forget to check out some of my other <a href="https://developer.hpe.com/search/?term=donze" target="_blank">blog posts</a> on the HPE Developer portal to learn more about Redfish tips and tricks.
