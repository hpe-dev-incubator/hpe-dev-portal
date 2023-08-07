---
title: Getting started with the HPE Data Services Cloud Console Powershell SDK
date: 2023-08-07T09:01:09.212Z
author: Thomas Beha
authorimage: /img/Avatar1.svg
disable: false
---
The Data Services Cloud Console (DSCC) UI might be sufficient for many customer (maybe even most of them), but lately I was approached from multiple customer that were looking for an efficient way to manage the HPE storage assets with PowerShell scripts. When I started looking into the available option to access the DSCC API with PowerShell I obviously first found the [PowerShell toolkit for managing the HPE Data Services Cloud Console](https://developer.hpe.com/blog/new-powershell-toolkit-available-for-managing-hpe-data-services-cloud-console/) on the [HPE Developer Portal](https://developer.hpe.com/). Working with this PowerShell toolkit I realized that it is on one hand an honorable first approach of my colleagues to write such a toolkit, but it is not complete and not yet fully tested. On the other hand, the DSCC provides an public Open API 3.X spec that can be used to generate your preferred language SDK as it is described for Python in this [blog](https://developer.hpe.com/blog/get-started-building-dscc-api-client-libraries-for-python-using-openapi-generator/). Using the Open API 3.X spec of the DSCC API has the benefit, that it is providing a complete list of possible API operations. 

In this blog I will describe the steps I used to generate a DSCC PowerShell SDK and show in a view examples how this SDK is used for daily tasks, my customer asked me for help.

# **Creating the DSCC Powershell SDK**

My first step to generate the DSCC Powershell SDK was to download the current [YAML](https://console-us1.data.cloud.hpe.com/doc/api/v1/storage-api.yaml)- or [JSON](https://console-us1.data.cloud.hpe.com/doc/api/v1/storage-api.json) Open API 3.x spec of the DSCC API that you can find on the [Data Services Cloud API documentation](https://console-us1.data.cloud.hpe.com/doc/api/v1/) page. 

![DSCC API Spec](/img/dscc-api-spec.png "DSCC API Documentation")

Y﻿ou can also download the DSCC API spec YAML file with the following PowerShell command:

```powershell
invoke-webrequest -uri  https://console-us1.data.cloud.hpe.com/doc/api/v1/storage-api.yaml -outfile storage-api.yaml
```

I﻿ ensured that I have the latest Microsoft PowerShell 7 installed on the Microsoft Windows system I used to generate the DSCC PowerShell SDK. The easiest way to get the latest PowerShell 7 installed is to use the winget utility.  

```powershell
winget search Microsoft.PowerShell
winget install --id Microsoft.PowerShell --source winget
winget install --id Microsoft.PowerShell.Preview --source winget
```

I﻿ used the openapi-generator-cli v.6.6.0 that you can download from the maven