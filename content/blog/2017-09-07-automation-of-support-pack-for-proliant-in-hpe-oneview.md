---
title: Automation of Support Pack for ProLiant in HPE OneView
date: 2017-09-07T03:17:17.230Z
author: Didier Lalli 
tags: ["HPE-OneView","OneView","PowerShell"]
path: automation-of-support-pack-for-proliant-in-hpe-oneview
---
Support Pack for ProLiant (SPP) is the official HPE distribution of
updates to the ProLiant family of server. It is an ISO image, which
customers typically download from HPE website. Once locally available it
can be mounted on a ProLiant server and booted from, in order to update
the system software of the server such as the BIOS, component firmware
and OS drivers. It can also be used in combination with HPE Smart Update
Manager (HPSUM). The releases are named after their release date so for
example find SPP2016.10.0.iso for a SPP released in October 2016. HPE
OneView also offers the capability of leveraging this ISO image, by
loading it as a new "baseline" for automatic systems updates. This
article describes how to script this operation. More on the SPP web site
http://h17007.www1.hpe.com/us/en/enterprise/servers/products/service\_pack/spp/index.aspx

# Managing servers at scale

SPP ISO images can be mounted and booted on a single server in order to
upgrade its components. That is ok for a couple of servers but will
become a very tedious and time-consuming operation when managing
hundreds of servers in a datacenter. A more comprehensive way to use the
SPP is to combine it with HPE OneView. HPE OneView offers the option to
load a SPP and to use it as a property of a server profile.

# Server Profile

Before we look at how to load SPP into HPE OneView, let us review what a
server profile is. Server Profile is the most important concept in HPE
OneView. It represents the abstraction layer, which isolates a workload
from the underlying server-hardware on which it runs. The server-profile
artifact is the place where we setup BIOS settings, hardware type, and
number of network connections, SAN attachments, number and size of disks
for a given workload. We can create many of these server profiles, and
even create server profile templates, and these remain completely
disconnected from the hardware until finally applied to an available
compute resource. When this happens, properties of the profile are
applied to the designated server hardware, connections are made to the
network infrastructure, and disks are carved automatically. One of the
property of a server profile (or a server profile template) is the
Firmware Baseline. The picture below shows options available for
managing firmware baseline during the creation of a server profile.

![shows options available for managing firmware baseline during the creation of a server profile](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/spp-sp-1504754621422.png)

So if a server profile also has the Firmware property set to a given
baseline, this baseline will automatically be installed on the server
hardware as part of the profile deployment. This offline technique
(there are other online methods for applying firmware, using SUT - Smart
Update Tool) removes a lot of complexity for server administrators. It
adds a lot more flexibility too, as it allows to validate and apply
certain SPP to given workloads, and other SPP to other workloads, as
this is just another property of a server profile.

# Custom SPP

It is important to note that, while HPE provides its customers with
regular updates of the SPP ISO images, it is possible to build custom
SPP. With this technique, you can create smaller ISO images, for example
by selecting only components, which exist in the customer's datacenter.
More information on custom SPP on https://spp.hpe.com/custom/

# Loading SPP in HPE OneView

In order to get an SPP to appear in the list of available SPP to choose
from for server profile, it needs to be loaded in HPE OneView. The
obvious and GUI-based option to do this is in HPE OneView Web Console
Firmware Bundles page, as shown below:

![HPE OneView Web Console Firmware Bundles page](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/spp-firmwarebundle-1504754856328.png)

From there it is possible to load additional Firmware Bundle from SPP
ISO images.

# Automating it

Another approach to achieve this is to use PowerShell and the HPE
OneView library for PowerShell, which we discussed in the previous post
There is a couple of PowerShell commandlets in the library to deal with
Firmware Bundles. We have:

-   Get-HPOVBaseline

-   Add-HPOVBaseline

-   Remove-HPOVBaseline

There are several possible scenario to automate the management of
baselines. For example, we could:

1.  Permanently monitor the create/delete file in a given folder and add
    or remove ISO images as they show up. We can use the
    System.IO.FileSystemWatcher PowerShell object to achieve this

2.  Look for the files in a repository and compare with the baselines
    already loaded and keep them in synch

3.  Simply load ISO images from disk

To keep things simple we will implement option 3, as it requires less
PowerShell code. The steps of the scripts are the following:

-   Importing the HPE OneView library

Import-module HPEOneView.200

-   Connect to a given HPE OneView Appliance (if not already connected)

```postscript
if (!$global:myAppliance) {
	$global:myAppliance = Read-Host "HPE OneView FQDN or IP address"
}
if ($global:ConnectedSessions.Name -notcontains $global:myAppliance) {
	$connection=Connect-HPOVMgmt -appliance $global:myAppliance -User
	administrator -password 
 }
```

-   Enumerate Firmware Bundles already on appliance
```postscript
$bundlesloaded = get-hpovbaseline
write-host "Found the following baseline on appliance"
foreach ($item in $bundlesloaded) { write-host " - "
$item.isoFilename}
```

-   Enumerate ISO images in current folder
```postscript
$filesinfolder = get-item \*.iso
write-host "Found the following ISO in folder"
foreach ($item in $filesinfolder) { write-host " - " $item.Name}
```

-   Ask for confirmation
```postscript
Write-Host "Ok to upload ISO files on disk to appliance (Y/N)?"
$key = $Host.UI.RawUI.ReadKey("NoEcho, IncludeKeyDown")
if ($key.Character -ne "Y") { write-host You wimp! ; break }
```

-   And start uploading
```postscript
foreach ($item in $filesinfolder) {
write-host "Uploading file" $item.name "to appliance"
$task=add-hpovbaseline $item.name
$t = Wait-HPOVTaskComplete $task.uri -timeout (New-TimeSpan -Minutes 30)
}
```

-   Terminate
```postscript
Write-Host "Done!"
Write-Host "Disconnecting..."
disconnect-hpovmgmt
```

# Putting it all together

It is now time to save this PowerShell script and test it against an HPE
OneView Appliance or a HPE Synergy Composer.

Before we run our script, let us check the appliance baseline view
(empty to start with):

![HPE OneView Web Console Firmware Bundles page](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/spp-nofirmwarebundle-1504803548928.png)

In our first run, we can say Y(es) to confirm upload:

![Powershell console showing firmware bundle upload](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/spp-ps1-1504803751946.png)



![Powershell console showing firmware bundle addition](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/spp-ps2-1504803760139.png)



![Powershell console showing firmware bundle addition](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/spp-ps3-1504803766997.png)



![Powershell console showing firmware bundle upload process complete](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/spp-ps4-1504803773690.png)

After the run, we can check in HPE OneView again, to see that the
baseline is now loaded

![Check Baseline is loaded through HPE OneView web console](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/spp-firmwarebundle-1504754856328.png)

In the second run, we are notified that baseline is already there. We
can just say N(o) to exit:

![Powershell console notifying that baseline is already there in the second run of the script](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/spp-ps5-1504803781691.png)

&gt; **Note: be careful as HPE OneView modifies the filename of the bundle
&gt; by replacing unwanted characters such as "." and spaces, by "\_"**
