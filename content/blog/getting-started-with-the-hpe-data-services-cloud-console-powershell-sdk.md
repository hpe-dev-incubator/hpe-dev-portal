---
title: Getting started with the HPE Data Services Cloud Console Powershell SDK
date: 2023-08-07T09:01:09.212Z
author: Thomas Beha
authorimage: /img/thomasbeha.jpg
thumbnailimage: /img/dscc-api-spec.png
disable: false
tags:
  - data-services-cloud-console
  - api
  - PowerShell
  - RESTAPI
  - Storage
  - hpe-alletra
---
HPE provides the Data Services Cloud Console (DSCC), a SaaS-based cloud console, to eliminate silos and to reduce complexity by delivering a unified management of HPE storage arrays.  It's UI may be sufficient for many customer to manage their HPE storage assets, but lately I was approached from multiple customer that were looking for an efficient way to manage their HPE storage assets with PowerShell scripts. When I started looking into the available options to access the DSCC API with PowerShell, I first found the [PowerShell toolkit for managing the HPE Data Services Cloud Console](https://developer.hpe.com/blog/new-powershell-toolkit-available-for-managing-hpe-data-services-cloud-console/) on the [HPE Developer Community Portal](https://developer.hpe.com/). Working with this PowerShell toolkit, I realized that it is, on one hand, an honorable first approach by my colleagues to write such a toolkit, but it is not complete and not yet fully tested.
H﻿ence, a different solution needed to be found.

The DSCC provides an public OpenAPI 3.x spec that can be used to generate your preferred language SDK as it is described for Python in this [blog](https://developer.hpe.com/blog/get-started-building-dscc-api-client-libraries-for-python-using-openapi-generator/). U﻿sing the OpenAPI 3.x spec of the DSCC API has the benefit of providing complete list of possible API operations. And once the procedure to generate the SDK is in place, a new SDK can easily be created if new features are exposed via the DSCC API. 

In this blog, I will describe the steps I used to generate a DSCC PowerShell SDK and show how this SDK is used for daily tasks.

# Creating the DSCC Powershell SDK

My first step to generate the DSCC Powershell SDK was to download the current [YAML](https://console-us1.data.cloud.hpe.com/doc/api/v1/storage-api.yaml)- or [JSON](https://console-us1.data.cloud.hpe.com/doc/api/v1/storage-api.json) OpenAPI 3.x spec of the DSCC API that can be found on the [Data Services Cloud API documentation](https://console-us1.data.cloud.hpe.com/doc/api/v1/) page. 

![DSCC API Spec](/img/dscc-api-spec.png "DSCC API Documentation")

Y﻿ou can also download the DSCC API spec YAML file with the following PowerShell command:

```powershell
invoke-webrequest -uri  https://console-us1.data.cloud.hpe.com/doc/api/v1/storage-api.yaml -outfile storage-api.yaml
```

I﻿ ensured that I had the latest Microsoft PowerShell 7 installed on the Microsoft Windows system that I used to generate the DSCC PowerShell SDK. The easiest way to get the latest PowerShell 7 installed is to use the winget utility.  

```powershell
winget search Microsoft.PowerShell
winget install --id Microsoft.PowerShell --source winget
winget install --id Microsoft.PowerShell.Preview --source winget
```

There are multiple generators available to create a SDK out of the OpenAPI 3.x spec. In the end, I had the best result with [openapi-generator-cli-6.6.0.jar](https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/6.6.0/) 

T﻿he minimum requirement to execute this JAR File is to have as a minimum JAVA Runtime Environment (JRE) version 8 installed. I used the [Microsoft OpenJDK 17.0.8 LTS](https://learn.microsoft.com/en-us/java/openjdk/download) build as JRE on my system. Having all requirements in place, I simply created the DSCC PowerShell SDK with the following command:

```powershell
java -jar openapi-generator-cli-6.6.0.jar generate -i storage-api.yaml -g powershell -o dscc-powershell-sdk 
```

T﻿he output directory that I specified with the -o flag of the generate command contains the following files:

![](/img/openapigeneratoroutput.png "Openapi Generator Output")

A﻿fter generating the DSCC PowerShell SDK, I needed to install the PowerShell modules (stored in the src directory) locally before I could use it in PowerShell scripts. The local installation was done simply by running the Build.ps1 script located in the openapi-generator-cli output directory that is specified with the -o flag. 

```
powershell Build.ps1
```

H﻿aving completed all these steps, I was ready to use the DSCC PowerShell SDK to automate daily DSCC tasks. 

# How to use the DSCC PowerShell SDK

T﻿he DSCC PowerShell SDK output directory contains a README.md file that gives a complete overview of all API Endpoints. 

![](/img/dscc_ps_api_endpoints.png "DSCC PowerShell SDK API Endpoints")

T﻿o do what I did, you can scroll through the README.md file and use the links in the file to get to the detailed information for every available API endpoint. The detailed information includes usage examples for the commands, like the following one that is used getting all storage systems, *Invoke-SystemsList*:

```powershell
# general setting of the PowerShell module, e.g. base URL, authentication, etc
$Configuration = Get-Configuration
# Configure HTTP basic authorization: JWTAuth
$Configuration.Username = "YOUR_USERNAME"
$Configuration.Password = "YOUR_PASSWORD"

$Limit = 10 # Int32 | Number of items to return at a time (optional)
$Offset = 5 # Int32 | The offset of the first item in the collection to return (optional)
$Filter = "name eq VEGA_CB1507_8400_2N_150" # String | oData query to filter systems by Key. (optional)
$Sort = "id asc,name desc" # String | Query to sort the response with specified key and order (optional)
$Select = "id" # String | Query to select only the required parameters, separated by . if nested (optional)

# Get all storage systems
try {
    $Result = Invoke-SystemsList -Limit $Limit -Offset $Offset -Filter $Filter -Sort $Sort -Select $Select
} catch {
    Write-Host ("Exception occurred when calling Invoke-SystemsList: {0}" -f ($_.ErrorDetails | ConvertFrom-Json))
    Write-Host ("Response headers: {0}" -f ($_.Exception.Response.Headers | ConvertTo-Json))
}
```

Y﻿ou may be wondering ... how did I get from the example given in the README.md file to usable code. First of all, I  needed a Client Id and Client Secret in order to open a connection to the DSCC. If you do not have yet a Client Id / Client Secret pair, then you need to create one as it is described in the <!--StartFragment-->[Using HPE GreenLake Console's API Gateway for Data Services Cloud Console](https://developer.hpe.com/blog/api-console-for-data-services-cloud-console/)<!--EndFragment--> blog post.

U﻿sing the Client Id / Client Secret pair, I was able to retrieve an Access Token that was valid for two hours.

```powershell
Import-Module -Name '.\dscc-powershell-sdk\src\PSOpenAPITools'

$Configuration = Get-Configuration
$Configuration.BaseUrl  = 'https://eu1.data.cloud.hpe.com'
$Configuration.Username = 'Your Client Id'
$Configuration.Password = 'Your Client Secret'

$AuthUri = "https://sso.common.cloud.hpe.com/as/token.oauth2"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$AuthHeaders =  @{  'Content-Type' = 'application/x-www-form-urlencoded'
								}
$AuthBody    = [ordered]@{   'grant_type'    = 'client_credentials'
							 'client_id'     = $Configuration.Username
							 'client_secret' = $Configuration.Password
						  }
try {
    $Configuration.AccessToken = ( invoke-restmethod -uri $AuthURI -Method Post -headers $AuthHeaders -body $AuthBody ).access_token
} catch { 
    Write-Host ("Exception occurred when retrieving access toke: {0}" -f ($_.ErrorDetails | ConvertFrom-Json))
    Write-Host ("Response headers: {0}" -f ($_.Exception.Response.Headers | ConvertTo-Json))
    exit(-1)
}	
```

As you can see the Access Token, Client Id, Client Secret and the Base URL are stored in a global variable: $Configuration. The retrieved Access Token is valid for two hours and needs to be refreshed afterwards. 

P﻿lease note: the $Configuration.BaseUri depends on the DSCC location. You will need to use BaseUri given for your DSCC location. At the time of writing this blog the three possible DSCC BaseUri are:

* E﻿urope:  https://eu1.data.cloud.hpe.com
* U﻿SA:  https://us1.data.cloud.hpe.com
* A﻿PJ:   https://jp1.data.cloud.hpe.com

I﻿f you want to have a list of storage systems that you have access to on the DSCC, you can use the *Invoke-SystemList* API endpoint as shown in the following example:

```powershell
try {
    $Systems = (Invoke-SystemsList).items
    $SystemIds = @{}
	foreach($s in $Systems){
		$SystemIds += @{$s.name = $s.Id}
	}
} catch {
    Write-Host ("Exception occurred when calling Invoke-DeviceType1SystemsList: {0}" -f ($_.ErrorDetails | ConvertFrom-Json))
    Write-Host ("Response headers: {0}" -f ($_.Exception.Response.Headers | ConvertTo-Json))    
}
```

A﻿fter getting the systems list with the *Invoke-SystemsList* command, I storage the system name and system ID in an array because I needed the system ID for many of the possible API commands. Generally it is the case that  the systems, volume, hosts, initiators etc. you want to manipulate in your scripts are defined by their IDs. For example, if you work with the DSCC API, you will work with the id of the object you want to change or delete. 

F﻿or instance, if you want to create a new volume, then you need to to define the volume parameters like name, size etc. and the system where you want to create the volume. A new volume can be created with the *Invoke-VolumeCreate* command that has two input parameters: the system ID and the volume parameters that are stored in a *CreateVolumeInput* object using the *Initialize-CreateVolumeInput* method. 

```powershell
$SystemId = $System.Primera650
$CreateVolumeInput = Initialize-CreateVolumeInput -Comments "DSCC API -Thomas Beha" `
  -Count 1 `
  -DataReduction $true `
  -Name "DSCC-API-Vol" `
  -SizeMib 16384 `
  -SnapCpg "SSD_r6" `
  -UserCpg "SSD_r6"  
try {
	$Result = Invoke-VolumeCreate -SystemId $SystemId -CreateVolumeInput $CreateVolumeInput
} catch {
    Write-Host ("Exception occurred when calling Invoke-CreateVolume: {0}" -f ($_.ErrorDetails | ConvertFrom-Json))
    Write-Host ("Response headers: {0}" -f ($_.Exception.Response.Headers | ConvertTo-Json))	
}
```

T﻿he *Invoke-VolumeCreate* command will return the information of the generated task. You can use the *Get-Task* command to monitor the progress of this task.

```powershell
$Status = Get-Task $Result.taskUri
while( ($Status.progressPercent -lt 100) -and ($Status.state -ne "FAILED")){
    $Status.progressPercent
    Start-Sleep -Seconds 5	
    $Status = Get-Task  $TaskId
}
```

These are the steps I used to create a new Volume on my HPE Primera 650 array with a name of DSCC-API-Vol and a size of 16GB.

![](/img/dscc-api-vol.png "DSCC-API-Vol UI view")

# S﻿ummary

In conclusion, the DSCC PowerShell SDK, derived from the DSCC Open API 3.x spec, includes at the time of writing this blog already 349 commands that can be used to manage your storage with  the DSCC API. At the moment, it t is the most complete PowerShell tool to manage DSCC managed HPE storage arrays. Since it is also easily updated with new features once they are available - simply recreate it with the most current DSCC OpenAPI 3.x spec - it is the recommended way for customers  to build PowerShell scripts accessing the DSCC API. 

I﻿ hope the above example helps get you started with the DSCC PowerShell SDK. While I have not tested every possible command, I have not found any issue working with the SDK on the extensive daily task list received from my customers.