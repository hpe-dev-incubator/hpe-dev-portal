---
title: New PowerShell toolkit available for managing HPE Data Services Cloud Console
date: 2022-01-28T10:27:53.943Z
author: Chris Lionetti
authorimage: /img/Avatar5.svg
tags:
  - data-services-cloud-console
  - powershell
  - developer
  - hpe-greenlake-cloud-platform
  - hpe-greenlake
---
Hewlett Packard Enterprise (HPE) recently introduced a new way to manage IT data storage resources: [Data Services Cloud Console](https://www.hpe.com/us/en/storage/data-services-cloud-console.html) (DSCC) which takes a cloud-based approach to running on-prem data storage infrastructure and offers [an innovative way ](https://www.storagereview.com/news/hpe-alletra-cloud-native-high-performance-storage)to meet the management challenges of modern IT workloads. While DSCC initially added a Storage-as-a-Service layer on top of the new [HPE Alletra storage arrays,](https://www.hpe.com/us/en/storage/alletra.html) the vision of DSCC goes well beyond this, encompassing a full range of data storage services, monitoring, planning and data protection.

The DSCC architecture is built on an API-driven abstraction layer. The REST API was a key aspect of the service, enabling the linking of distributed components - of course across HPE, but also as a means to enable future customer and partner developers to create, consume, maintain and monitor various HPE data infrastructure services. And it enabled the development of this new toolkit you can download and use today!

## The cloud advantage

HPE GreenLake and DSCC allows you to manage across multiple storage platforms and across multiple sites, providing the advantage of using a single UI to span across servers and storage. It also offers optimizations not possible when managing devices as single management endpoints. A fully functional REST API helps accomplish all standard management tasks, like deploying volumes to servers or configuring snapshots - all designed to enable Management-at-scale.

But what about the administrator who simply wants to either use a CLI or write very simple scripts to deploy and configure resources? This is where the DSCC PowerShell Toolkit comes in, helping you manage your cloud storage like a pro with PowerShell.

## How to implement the use of the REST API

In this post, I've outlined the steps required. To learn more about the DSCC REST API, check out the post [here](https://developer.hpe.com/blog/api-console-for-data-services-cloud-console/). First, you'll need to log into your [HPE GreenLake Portal](https://common.cloud.hpe.com/). Under the *Manage Account* option, you will see an option to configure API access.

![](/img/powershell-manage-account-img.png)

You can then create your new API account which allows you to granularly control your scripting environment. You are allowed up to 5 API Client credentials per GreenLake user account, and each API Client credential can be separately managed. A Client credential is made up of the combination of a Client_ID and a Client_Secret, which can be used to communicate with the Authentication server to obtain a valid session token. To generate these credentials, click on the appropriate button:

![](/img/powershell-api-client-credentials-img.png)

You will need to identify which Cloud you want to generate these credentials for, as well as a common name for the Credential for later identification.

![](/img/powershell-create-credentials-img.png)

>Note: In the above example image, the application selected is FLEETSCALE(US West). Please take a look at the article [here](https://developer.hpe.com/blog/api-console-for-data-services-cloud-console) for the supported DSCC Application instance and the end-points for each DSCC regions.


Once this has been created you will see a new screen that will show the Client_Id and Client_Secret. These will need to be recorded as once they are created and displayed to the user, there is no other way to retrieve them from the Cloud Console.

![](/img/powershell-credentials-created-img.png)

Next, you need to download and install the DSCC PowerShell Toolkit. From any Microsoft Windows machine, open a PowerShell window, and type in the following commands:

```powershell
PS:> $PSTK = ‘[https://codeload.github.com/HPEDSCC-PowerShell-Toolkit-main.zip](https://codeload.github.com/HPEDSCC-PowerShell-Toolkit-main.zip%E2%80%99)’
PS:> $FOLDER = 'C:\Windows\System32\WindowsPowerShell\v1.0\Modules'
PS:> invoke-webrequest -uri $PSTK -outfile “MyFile.zip" 
PS:> expand-archive -path “MyFile.zip" -DestinationPath $FOLDER
```

As you can see, this little set of lines downloads the PowerShell Toolkit, which can also be found [here](https://github.com/HewlettPackard/HPEDSCC-PowerShell-Toolkit). It also unzips that folder into the Windows Modules folder so that it can later be found.

Once this download and install is complete, you can Import the Module into your current session, and then connect to your HPE GreenLake DSCC service using the following commands:

```powershell
PS:> Import-Module HPEDSCC
PS:> Connect-DSCC –Client_id ‘IdHere’ –Client_secret ‘Sercrethere’ –GreenLakeType Dev –AutoRenew
```

![](/img/powershell-codeblock-dscc-img1.png)

The Connection command above is fairly straightforward, however there are a few items you may not recognize, such as the GreenLake Type. The GreenLake type can be *Dev*, *US*, *JP*, and *EU* depending on your cloud location, and using the *<TAB>* key will cycle through the valid values. Additionally the *AutoRenew* is a switch that is used to enable the PowerShell Toolkit to refresh the Token every 1 hour and 45 minutes as the Token will naturally expire every 2 hours. Without the –*AutoRenew* option, your PowerShell Toolkit session will simply time out at the 2 hour mark and you will need to run the connection command again. Once you close the PowerShell session, the Client credentials are lost, as they are not persistently stored.

Once you have connected, you will notice that the returned data from each PowerShell Call is a true PowerShell Object, which can be explored. To get a list of all of the available commands, and then to get detailed help from any command, use the following commands.

```powershell
PS:> get-command –module HPEDSCC
PS:> get-help New-DSCCInitiator –Detailed
```

![](/img/powershell-codeblock-dscc-img2.png)

As you can see, each command has complete *Help* defined for it that includes the parameters, as well as the valid values, for those parameters required, as well as multiple examples of the usage of each command with sample output from those commands.

## Objects are deeper than they may appear

Let's talk about Objects. When a PowerShell command returns data, you are presented with a table of the many values that are most likely to be useful at a glance. However, most understand that PowerShell Objects are far deeper than they appear to be on the surface. To explore this, first you can cast the value of any returned object to a variable. You can initially only return one item instead of all items. But you can then dig into the value of any part of that object using a ‘dot’ notation. In many cases you will find that as you go deeper and deeper into the object, even more details emerge. Using the PowerShell Count feature, you can determine, as in the following example, that 8 records exist in the object, and you can walk through each object using square brackets as shown below:

```powershell
PS:> $DATA = Get-DSCCStorageSystem –DeviceType device-type1
PS:> $DATA.Count
PS:> $DATA
```

![](/img/powershell-codeblock-dscc-img3.png)

The value here is, that to extract the value of any of these fields, you need not write any parser or process any data, you simply need to know the object layout. If you want to see the entire object in long form, you can use the following command to list out all of the fields instead of just the most common. Additionally, if you would rather read the details of an object in the same format as it comes from the REST API call, you can use the PowerShell built-in function to convert it to raw JSON format.

```powershell
PS:> $DATA | format-list
```

![](/img/powershell-codeblock-dscc-img4.png)

Here, the objects are rather deep and you can get significantly more information than a GUI would present to you. You can dig into each object deeper and deeper using standard ‘DOT’ notation as shown below

```powershell
PS:> $DATA\[3].SystemWWN
PS:> ( $DATA\[3].SoftwareVersions ).fullVersion
PS:> ( $DATA\[3].SoftwareVersions ).Components
```

![](/img/powershell-codeblock-dscc-img5.png)

In addition to this object manipulation, you can also filter your results to see only the details you are interested directly from the command line using the pipe operator. There is a special symbol in PowerShell that allows you to access the piped data that looks like this ‘$_’

You can also work directly from the original command instead of casting the data to a variable. In the following example, you can limit the returned data to a single record using a search term such as an InitiatorID, or an IP Address, or you can limit the results to a sub-collection of results that that match a specific criteria such as iSCSI vs FC initiators. In the below example, you can see how using the ‘.count’ feature that the Get-DSCCInitiator command returns 202 results, however by filtering the results to only return those with Protocol type ‘ISCSI’ it decreases this count to 22. Running the same command without the ‘.count’ option returns the actual object collection.

```powershell
PS:> ( Get-DSCCInitiator ).count
PS:> ( Get-DSCCInitiator ) | where { $_.protocol –like ‘ISCSI’ } ).count
PS:> ( Get-DSCCInitiator ) | where { $_.protocol –like ‘ISCSI’ } )
```

![](/img/powershell-codeblock-dscc-img6.png)

You can also limit the results to only those with values such as all Volumes with a Free Space greater than a specific value. You may also chain these pipelines to add additional filters as well. In this case, you may want to filter a Volume list by size, but then filter that list again by additional criteria. In the example below, you can see it's been filtered again to limit the results to a single Storage System ID.

```powershell
PS:> ( Get-DSCCStorageSystem –DeviceType device-type1 | Get-DSCCVolume ).count
PS:> ( Get-DSCCStorageSystem –DeviceType device-type1 | Get-DSCCVolume | where { $_.sizeMiB –gt 524000 } ).count
PS:>   Get-DSCCStorageSystem –DeviceType device-type1 | Get-DSCCVolume | where { $_.sizeMiB –gt 524000 } 
```

![](/img/powershell-codeblock-dscc-img7.png)

There may also exist the case where you may wish to see the raw JSON return that each call returns. The good news is that PowerShell Objects and JSON Objects are the same thing, and with slight formatting changes, you can use the following pipeline operation to convert any PowerShell Object to native JSON formatting.

```powershell
PS:> ( Get-DSCCStorageSystem –DeviceType device-type1 )[1]
PS:> ( Get-DSCCStorageSystem –DeviceType device-type1 )[1] | ConvertTo-JSON
```

![](/img/powershell-codeblock-dscc-img8.png)

You may have noticed in the example that, when I make calls to Storage Systems I had to specify a DeviceType. This is because the RestAPI needs to treat the Primera/Alletra9K systems (Device-Type1) differently than Alletra6K/NimbleStorage systems (Device-Type2). 

## More tips and tricks

Another interesting trick of the toolkit is that many of the commands support discovery mode. For example, if you want to get the details of a specific storage system, you would run the command shown below.  But how do you find the required Storage System ID? That’s easy – you run the command without the System ID specified, in which case it will discover all of the Storage Systems and return that data.

```powershell
PS:> Get-DSCCStorageSystem –DeviceType device-type1
PS:> Get-DSCCStorageSystem –DeviceType device-type1 –SystemId ‘2M2042059T’
```

![](/img/powershell-codeblock-dscc-img9.png)

Another very useful tip is to accept pipeline input for some variables; i.e. the command to obtain a Storage Systems Controller Nodes require the System ID to query against; but If I want ALL of the Controller Nodes, I can discover them by using the first command to feed the system ID to the second command. Optionally you could request the Controller if you know the Storage System ID.

```powershell
PS:> Get-DSCCStorageSystem –DeviceType device-type1 –SystemId ‘2M2042059T’ 
PS:> Get-DSCCStorageSystem –DeviceType device-type1 –SystemId ‘2M2042059T’ | Get-DSCCController
PS:> Get-DSCCStorageSystem –DeviceType device-type1 | Get-DSCCController
```

![](/img/powershell-codeblock-dscc-img10.png)

## Understanding the REST API more deeply

Now that you are an expert at using the Toolkit, let’s see how you can use it to help you better understand the RestAPI model, in addition to the embedded help, Examples, and JSON conversion.

This would include a feature of all commands implemented as a switch called ‘-WHATIF’. By adding a ‘-whatif’ option to any command, you can see all the details of what is going to be sent to the RestAPI endpoint, including the URI, the Header, the method, connection type, and Body if one exists. Below is the example of this type of data.

```powershell
PS:> New-DSCCInitiator –address ‘deadbeefdeadbeeddeadbeef’ –hbaModel ‘LPe12002 –hostSpeed 10000 –ipAddress ’10.10.10.1’ –name    ‘MyInit’ –protocol iSCSI –vendor ‘Emulex’ -whatif
```

![](/img/powershell-codeblock-dscc-img11.png)

With this information, you can replicate any call in either Python, CURL, or other language of your choice. The primary reference should always be the RestAPI documentation, as well as any SDK that is produced for the DSCC, but the PowerShell Toolkit can be used to provide a functional solution, which you could then turn into a true programming project.

## Get the free toolkit today to manage your storage like a pro

The new HPE Data Services Cloud Console PowerShell Toolkit is a valuable innovation for managing the HPE Data Services Cloud Console. It leverages your familiarity with PowerShell to speed the management of HPE storage resources programmatically and at scale. You can download the toolkit for free [here](https://github.com/HewlettPackard/HPEDSCC-PowerShell-Toolkit) on GitHub.

