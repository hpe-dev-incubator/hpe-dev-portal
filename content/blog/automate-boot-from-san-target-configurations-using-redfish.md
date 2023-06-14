---
title: Automate boot from SAN target configurations using Redfish
date: 2023-06-01T20:13:38.207Z
featuredBlog: false
author: HPE Global Sales Engineering (GSE) team
authorimage: /img/Avatar5.svg
disable: false
tags:
  - redfish
  - restapi
  - ilo-restful-api
---
As the scale and complexity of infrastructure deployed in a customer environment increases, the need for consistency, ease of management and agility in responding to the changing needs of the infrastructure consumers becomes a key priority for IT staff.  Operational efficiency has become a key business imperative for customers hosting any large IT footprint, and the operational efficiency gains are often achieved through automation of repetitive tasks performed by IT staff to deploy, manage, and operate IT infrastructure.

There are several use-cases of infrastructure automation that exist, and in this blog post we will address the aspect of configuration of OS boot for a server from a Storage Area Network (SAN) based storage array.  Specifically, we will discuss the   procedure for configuring an HPE ProLiant DL Gen10, Gen10 plus and Gen11 servers to boot from a SAN target Logical Unit Number (LUN) using the Redfish® standard DMTF API. 

**Note**:

* The steps outlined in this document were tested on HPE DL 380 Gen10 and Gen10 plus servers with Emulex based SN1610E FibreChannel (FC) cards, HPE iLO firmware 2.81 and Service Pack for ProLiant (SPP) available as of March 2023.
* QLogic SN1610Q cards do not support the steps outlined in this document (as of April 2023). However, future firmware releases might enable this Redfish API-based configuration method.

# Pre-requisite information

Before we dive into the steps for performing the automation, you will need to gather a few pieces of information, such as

* HPE iLO Management port IP address and credentials. 
* Storage target World Wide Number (WWN) and LUN id.  A storage administrator can typically provide you with this information.

Download and install the [HPE RESTful Interface Tool](https://www.hpe.com/info/resttool)  (version 4.1.0.0 or later) on the system you will initiate the automation actions from.
Once the RESTful Interface tool (referred to as iLOrest in the remainder of the document), you can review the current boot target and their order of execution by following the steps below

`ilorest login <ilo-ip> -u <ilo-user> -p password`

`ilorest bootorder`

Refer to the [iLOrest documentation](https://hewlettpackard.github.io/python-redfish-utility/#bootorder-command) for more information on this command.

# Configuration Steps

Now that you have gathered the pre-requisite information and installed the ilorest tool, let’s discuss the detailed steps for implementing the automation.

## Step 1: Ensure that the `FCScanPolicy` value is set to ‘AllTargets’

```markdown
ilorest  get FCScanPolicy --selector Bios
```

Expected output:

```markdown
FCScanPolicy=AllTargets
```

If the value is not set to AllTargets, you can change it using the following:

```markdown
ilorest set "FCScanPolicy"="AllTargets" --selector Bios

ilorest commit

ilorest reboot
```

**Note**:

A﻿fter restarting the server, remember to retrieve the updated Bios settings from the iLO of the server with the following command

```markdown
ilorest select Bios. --refresh
```

You can monitor the server restart state and continue the configuration when it reaches the `FinishedPost` state, and the `vMainDeviceDiscoveryComplete` device discovery state.  More details about monitoring server state is described in this [article](https://developer.hpe.com/blog/master-the-redfish-server-states-to-improve-your-monitoring-and-manageme/).

The server state can be retrieved with

```markdown
ilorest serverstate
```

The device discovery state can be obtained with the following commands

```markdown
ilorest select ComputerSystem. --refresh
ilorest get Oem/Hpe/DeviceDiscoveryComplete/DeviceDiscovery --json
```

After restarting the server, you can verify that the settings have taken effect using the BIOS menus as shown in Figure 1 or using the commands

```
ilorest select Bios. --refresh
ilorest get FCScanPolicy
```

![Figure 1: FCScanPolicy Bios setting](/img/picture1.png "Figure 1: FCScanPolicy Bios setting")

## Step 2: Identify the right FC Card

The server you are trying to configure might have one or more FC cards in it, and you need to identify the right card using the steps below.

List out available network adapters (includes FC cards)

```markdown
ilorest rawget /redfish/v1/Chassis/1/NetworkAdapters/
```

The previous command returns the following output: 

```json
{ 
 
  "@odata.context": "/redfish/v1/$metadata#NetworkAdapterCollection.NetworkAdapterCollection", 
 
  "@odata.etag": "W/"F09DE05C"", "@odata.id": "/redfish/v1/Chassis/1/NetworkAdapters/", 
  
  "@odata.type": "#NetworkAdapterCollection.NetworkAdapterCollection", 
 
  "Description": "The collection of network adapter resource instances available in this chassis.",
 
  "Members": [ 
 
  { "@odata.id": "/redfish/v1/Chassis/1/NetworkAdapters/DC080000/" }, 
 
  { "@odata.id": "/redfish/v1/Chassis/1/NetworkAdapters/DE083000/" }, 

  { "@odata.id": "/redfish/v1/Chassis/1/NetworkAdapters/DE081000/" }, 

  { "@odata.id": "/redfish/v1/Chassis/1/NetworkAdapters/DE07B000/" } 

  ],

"Members@odata.count": 4, 
…
```

Make a note of the device IDs in the output above - DC080000, DE083000, DE081000, DE07B000.  The values for these items might be different on the server you are using.

Query these items using the device ID to verify it is the right FC card that you would like to configure, for example using DE083000 device (your output and device IDs might be different).

```markdown
ilorest rawget /redfish/v1/Chassis/1/NetworkAdapters/DE083000
```

Look for the following in the output.

```markdown
"Location": {
        "PartLocation": {
          "LocationOrdinalValue": 4,
          "LocationType": "Slot",
          "ServiceLabel": "PCI-E Slot 4"
        }
…

"Manufacturer": "Hewlett Packard Enterprise",

"Model": "HPE StoreFabric SN1610E 32Gb 2-port Fibre Channel Host Bus Adapt",

"Name": "HPE SN1610E 32Gb 2p FC HBA"
```

The above values can help you ascertain that you have the right card, and its device ID.

## Step 3: Verify that Redfish configuration is Enabled

Before you can change the boot from SAN configurations on an FC card, you will have to set `RedfishConfiguration` key to "Enabled" for the specific adapter, if not already done.

The current value of this key can be viewed by querying the adapter.

```markdown
ilorest rawget /redfish/v1/Chassis/1/NetworkAdapters/DE083000
```

If the value is not set, please perform  the following:

1. Create a file named enable-redfish.txt with the following contents

   ```json
   {
     "/redfish/v1/Chassis/1/NetworkAdapters/DE083000/":
    {
     "Oem":
     {
      "Hpe":
      {
          "RedfishConfiguration": "Enabled"
      }
     }
    }
   }
   ```
2. Apply this patch via iLOrest

   ```markdown
   ilorest rawpatch <file path>\enable-redfish.txt
   ```
3. To make this patch permanent, flush the configuration to the iLO NVRAM by creating a file name flushtonvm.txt, with the following contents

   ```json
   {
    "/redfish/v1/Chassis/1/NetworkAdapters/DE083000/Actions/Oem/Hpe/HpeNetworkAdapter.FlushConfigurationToNVM/":
    {
    }
   }
   ```
4. Post the flush action via iLOrest

   ```markdown
   ilorest rawpost <file path>\flushtonvm.txt
   ```
5. Reboot the server

   ```markdown
   ilorest reboot
   ```

## Step 4: Set Boot from SAN value to Enable for the Adapter

For each SN1610E adapter on your server that you would like to enable for SAN boot, there is a variable "BootMode" that needs to have a value of "FibreChannel".  

This can be viewed from BIOS configuration UI at the location shown in Figure 2.

![](/img/picture2.png "Figure 2: Set boot from SAN")

This value is part of the FC adapter configuration, and is visible in the output of the following command:

```markdown
ilorest rawget /redfish/v1/Chassis/1/NetworkAdapters/DE083000/NetworkDeviceFunctions/1/
```

Look for "BootMode" in the output generated.

To modify the value of this property, 

1. Create a file named enable-sanboot.txt with the following

   ```json
   {
    "/redfish/v1/Chassis/1/NetworkAdapters/DE083000/NetworkDeviceFunctions/1/":
    {
       "BootMode":"FibreChannel"
    }
   }
   ```
2. Apply this patch via iLOrest

   ```markdown
   ilorest rawpatch <file path>\enable-sanboot.txt
   ```
3. Flush or commit the changes to ilo NVM using the flushtonvm.txt file created before

   ```markdown
   ilorest rawpost <file path>\flushtonvm.txt
   ```

   ## Step 5: Create the SAN boot target entry

   Once the boot from SAN is enabled on the FC card, you will need to create a mapping for the Storage LUN that would be used as a boot entry for the server.  

   This entry is created within the BootTargets collection for the Port on the Adapter.

   ```markdown
   ilorest rawget /redfish/v1/Chassis/1/NetworkAdapters/DE083000/NetworkDeviceFunctions/1/
   ```

   In the output, look for entries such as:

   ```json
   "FibreChannel": {
          "BootTargets": [
            {
              "BootPriority": 0,
              "LUNID": "00:00:00:00:00:00:00:00",
              "WWPN": "00:00:00:00:00:00:00:00"
            }
   ```

   To create this entry, you will need to find out the Storage WWN and the LUN number exported to this server.

   1. Create a patch file (example bootentry.txt file contents shown below).

      ```json
      {
        "/redfish/v1/Chassis/1/NetworkAdapters/DE083000/NetworkDeviceFunctions/1":
        {
        "FibreChannel":
          {
          "BootTargets":[
            {
            "BootPriority": 0,
            "LUNID": "00:00:00:00:00:00:00:00",
            "WWPN": "00:00:00:00:00:00:00:C3"
            }
          ]
         }
        }
      }
      ```
   2. Apply this patch file via iLOrest

      ```markdown
      ilorest rawpatch <file path>\bootentry.txt
      ```
   3. Commit the changes by flashing the ilo NVRAM using the using the flushtonvm.txt file created before

      ```markdown
      ilorest rawpost <file path>\flushtonvm.txt
      ```
   4. Restart the server

      ```markdown
      ilorest reboot
      ```
   5. Once the server has restarted, you can view the boot order to verify that the new entry for the SAN boot target has been created.

      ```markdown
      ilorest bootorder
      ```

      # Summary

      In this blog post, we have learnt how easy it is to automate the configuration of boot from SAN targets for HPE servers using the iLOrest tool.  There are other aspects of server provisioning, monitoring, and management that you can automate with this tool and using the Redfish API interface supported by HPE iLO.  

      To learn more about these topics, check out [HPE Developer portal](https://developer.hpe.com/search/?term=redfish) for additional blogs and technical articles.