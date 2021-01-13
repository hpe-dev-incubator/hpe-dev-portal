---
title: "Creating a Powershell Module as a wrapper for the HPE Global Dashboard REST API"
date: 2019-04-23T16:59:48.878Z
author: Rudi Martinsen 
tags: []
path: creating-a-powershell-module-as-a-wrapper-for-the-hpe-global-dashboard-r
---
 
With the release of HPE Global Dashboard [version 1.60](https://support.hpe.com/hpsc/doc/public/display?docId=emr_na-a00056235en_us&docLocale=en_US) HPE shipped a new (public) RESTful API.

The documentation for the API is available through the Help section of the appliance itself, and there's a version of the API published on [swaggerhub](https://app.swaggerhub.com/apis-docs/hpe-global-dashboard/hpe-one_view_global_dashboard_rest_api/2).

You can also head over to [HPE Dev](https://developer.hpe.com/platform/hpe-oneview-global-dashboard/home) to get more information about the API and there's also a ["getting started" post](https://developer.hpe.com/blog/accessing-the-hpe-oneview-global-dashboard-api)

Currently there's no official Powershell module from HPE that let's you work with HPE Global Dashboard, and I haven't heard of any plans to create one either so I decided to create one my self.
 
## The HPE Global Dashboard Powershell module

 
At the time of this writing the module is at version 0.5.0.

It doesn't support all the functionality from the REST API yet. I've focused on the GET stuff and more specifically on the things we use in our environment. Currently the following can be done through the module:

- Connect, (and disconnect) to a HPE Global Dashboard (GD) instance
- Add, reconnect and remove a OneView appliance to the GD instance
- List the OneView appliances connected to the GD instance
- List the current GD appliance certificate
- List Converged Systems
- List Enclosures
- List Server Hardware
- List Server Profiles and Profile Templates
- List Storage Systems
- Create and delete logical groups
- List Logical groups
- List members of a logical group

### Install module

Installing the module is easiest done through the [Powershell Gallery](https://www.powershellgallery.com/packages/GlobalDashboardPS) (note that you should start PS as an Admin).
 
```powershell
Find-Module -Repository PSGallery -Name GlobalDashboardPS | Install-Module
```

![Install module from PS Gallery](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/4/gdps-psgallery-1556038459722.png)
 
You can also download the code from GitHub and import it the way you want to your Powershell session

### Usage

To check the available functions you can use we utilize the builtin Get-Command cmdlet

```powershell
Get-Command -Module GlobalDashboardPS
```

![Available functions](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/4/gdps-functions-1556038517571.png)
 
To start off we need to connect to the HPE Global Dashboard Instance. Note that currently you need to specify your credentials. I will add support for PS Credentials going forward.

```powershell
Connect-OVGD -Server "your-appliance-ip" -Username "your-username" -Directory "your-directory"
```
 
Just to show the basic usage of the module I'll demonstrate how we list Server Hardware. First with the default format (pulled from the ps1xml formatting file). 

```powershell
Get-OVGDServerHardware
```

![List server hardware](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/4/gdps-serverhwlist-1556038565601.png)
 
To see all details of an object you need to specify this.

```powershell
Get-OVGDServerHardware | select -First 1 *
```

![Server details](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/4/gdps-alldetails-1556038588225.png)
 
All functions have help text where you can see examples of the usage.

```powershell
Get-Help Get-OVGDServerHardware

Get-Help Get-OVGDServerHardware -Examples
```
 
### Paging and querying

Note that the API uses paging of results and defaults to 25 objects. You can specify the count of objects you want to return in the module functions, but currently it does not support paging as such.

Currently you can query for specific objects, but you need to use the ID of the object. I am working on adding support for querying by name as well.

## Summary

The full source of this project is available on [GitHub](https://github.com/rumart/GlobalDashboardPS) and the module is available on the [Powershell Gallery](https://www.powershellgallery.com/packages/GlobalDashboardPS)

There's quite a few things missing in the module, but hopefully I will be able to add in stuff going forward. Please feel free to contribute if you want!

The [changelog](https://github.com/rumart/GlobalDashboardPS/blob/master/changelog.md) should be up to date with current and upcoming features.

If you have any questions, comments, requests or want to contribute please contact me on [Twitter](https://twitter.com/RudiMartinsen), or open an issue on [GitHub](https://github.com/rumart/GlobalDashboardPS/issues).