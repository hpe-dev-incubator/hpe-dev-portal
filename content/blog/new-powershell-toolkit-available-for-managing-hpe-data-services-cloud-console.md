---
title: New PowerShell toolkit available for managing HPE Data Services Cloud Console
date: 2022-01-24T17:28:23.581Z
author: Chris Lionetti
authorimage: /img/Avatar5.svg
---
Hewlett Packard Enterprise (HPE) recently introduced a new way to manage IT data storage resources: [Data Services Cloud Console](https://www.hpe.com/us/en/storage/data-services-cloud-console.html) (DSCC) which takes a cloud-based approach to running on-prem data storage infrastructure and offers [an innovative way ](https://www.storagereview.com/news/hpe-alletra-cloud-native-high-performance-storage)to meet the management challenges of modern IT workloads. While DSCC initially added a Storage-as-a-Service layer on top of the new [HPE Alletra storage arrays,](https://www.hpe.com/us/en/storage/alletra.html) the vision of DSCC goes well beyond this, encompassing a full range of data storage services, monitoring, planning and data protection.

The DSCC architecture is built on an API-driven abstraction layer. The REST API was a key aspect of the service, enabling the linking of distributed components - of course across HPE, but also as a means to enable future customer and partner developers to create, consume, maintain and monitor various HPE data infrastructure services. And it enabled the development of this new toolkit you can download and use today!

## The cloud advantage

HPE GreenLake and DSCC allows you to manage across multiple storage platforms and across multiple sites, providing the advantage of using a single UI to span across ervers and storage. It also offers optmizations not possible when managing devices as single management endpoints. A fully functional REST API helps accomplish all standard management tasks, like deploying volumes to servers or configuring snapshots - all designed to enable Management-at-scale.

But what about the administrator who simply wants to either use a CLI or write very simple scripts to deploy and configure resources? This is where the DSCC PowerShell Toolkit comes in, helping you manage your cloud storage like a pro with PowerShell.

## How to implement the use of the REST API

In this post, I've outlined the steps required. First, you'll need to log into your [HPE GreenLake Portal](https://common.cloud.hpe.com/). Under the *Manage Account* option, you will see an option to configure API access.

![](/img/hpe-powershell-blog1.png)



You can then create your new API account which allows you to granularly control your scripting environment. You are allowed up to 5 API Client credentials per GreenLake user account, and each API Client credential can be separately managed. A Client credential is made up of the combination of a Client_ID and a Client_Secret, which can be used to communicate with the Authentication server to obtain a valid session token. To generate these credentials, click on the appropriate button:

![](/img/hpe-powershell-blog2.png)



You will need to identify which Cloud you want to generate these credentials for, as well as a common name for the Credential for later identification.

![](/img/hpe-powershell-blog3.png)



Once this has been created you will see a new screen that will show the Client_Id and Client_Secret. These will need to be recorded as once they are created and displayed to the user, there is no other way to retrieve them from the Cloud Console.

![](/img/hpe-powershell-blog4.png)



Next, you need to download and install the DSCC PowerShell Toolkit. From any Microsoft Windows machine, open a PowerShell window, and type in the following commands:



PS:> $PSTK = ‘[https://codeload.github.com/HPEDSCC-PowerShell-Toolkit-main.zip](https://codeload.github.com/HPEDSCC-PowerShell-Toolkit-main.zip%E2%80%99)’

PS:> $FOLDER = 'C:\Windows\System32\WindowsPowerShell\v1.0\Modules'

PS:> invoke-webrequest -uri $PSTK -outfile “MyFile.zip" 

PS:> expand-archive -path “MyFile.zip" -DestinationPath $FOLDER

As you can see, this little set of lines downloads the PowerShell Toolkit, which can also be found [here](https://github.com/HewlettPackard/HPEDSCC-PowerShell-Toolkit). It also unzips that folder into the Windows Modules folder so that it can later be found.

Once this download and install is complete, you can Import the Module into your current session, and then connect to your HPE GreenLake DSCC service using the following commands:

PS:> Import-Module HPEDSCC

PS:> Connect-DSCC –Client_id ‘IdHere’ –Client_secret ‘Sercrethere’ –GreenLakeType Dev –AutoRenew

![](/img/hpe-powershell-blog5.png)



The Connection command above is fairly straightforward, however there are a few items you may not recognize, such as the GreenLake Type. The GreenLake type can be *Dev*, *US*, *JP*, and *EU* depending on your cloud location, and using the *<TAB>* key will cycle through the valid values. Additionally the *AutoRenew* is a switch that is used to enable the PowerShell Toolkit to refresh the Token every 1 hour and 45 minutes as the Token will naturally expire every 2 hours. Without the –*AutoRenew* option, your PowerShell Toolkit session will simply time out at the 2 hour mark and you will need to run the connection command again. Once you close the PowerShell session, the Client credentials are lost, as they are not persistently stored.

Once you have connected, you will notice that the returned data from each PowerShell Call is a true PowerShell Object, which can be explored. To get a list of all of the available commands, and then to get detailed help from any command, use the following commands.

PS:> Get-Command – module DSCC

PS:> Get-Help –Command New-DSCCInitiator – detailed

![](/img/hpe-powershell-blog6.png)



As you can see, each command has complete *Help* defined for it that includes the parameters, as well as the valid values, for those parameters required, as well as multiple examples of the usage of each command with sample output from those commands.

## Objects are deeper than they may appear

Let's talk about Objects. When a PowerShell command returns data, you are presented with a table of the many values that are most likely to be useful at a glance. However, most understand that PowerShell Objects are far deeper than they appear to be on the surface. To explore this, first you can cast the value of any returned object to a variable. You can initially only return one item instead of all items. But you can then dig into the value of any part of that object using a ‘dot’ notation. In many cases you will find that as you go deeper and deeper into the object, even more details emerge. Using the PowerShell Count feature, you can determine, as in the following example, that 8 records exist in the object, and you can walk through each object using square brackets as shown below: