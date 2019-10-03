---
title: HPE OneSphere Automation Using PowerShell and CSV
date: 2018-01-31T20:22:17.408Z
author: pramod-reddy.sareddy@hpe.com 
tags: ["PowerShell","Windows","HPE-OneSphere","API","GettingStarted","REST"]
path: hpe-onesphere-automation-using-powershell-and-csv
---
## Summary
In previous articles, [Getting Started With OneSphere Programming](/blog/getting-started-with-hpe-onesphere-programming) , [Authenticating against HPE OneSphere API](/blog/authenticating-against-hpe-onesphere-api) and [Using HPE OneSphere PowerShell Module](/blog/using-hpe-onesphere-powershell-module), we discovered the [HPE OneSphere](https://www.hpe.com/us/en/solutions/cloud/hybrid-it-management.html) REST API, why to use PowerShell. We also saw how to install and use HPE OneSphere PowerShell module to access the HPE OneSphere API. In this article you will be able to use PowerShell scripts and Excel spreadsheets to import and export resources from HPE OneSphere.

## Import and Export HPE OneSphere resources

Import-OSResources.ps1 and Export-OSResources.ps1 are PowerShell scripts that leverage the HPE OneSphere PowerShell library and Excel to automate configuration of HPE OneSphere resources. Import-OSResources.ps1 uses CSV files to provide settings for different resources. Export-OSresources.ps1 queries to HPE OneSphere to collect settings from HPE OneSphere resources and save them in CSV files.

## Prerequisites

Both scripts require the latest HPE OneSphere PowerShell library

You can install it by following the steps in the blog article [Using HPE OneSphere PowerShell Module.](/blog/using-hpe-onesphere-powershell-module)

## Get Import/Export Scripts
Both the scripts, Import-OVResources.PS1 and Export-OSResources.PS1, along with sample CSV files, are part of the HPE OneSphere PowerShell module Samples section and [availabe on GitHub.](https://github.com/HewlettPackard/hpe-onesphere-powershell/tree/master/Samples)

## CSV files
Each CSV file will be used as an input for the Import script.
The Export script will create CSV files corresponding to each HPE OneSphere resource.

## Folder Structure
After downloading it, the following folder structure is created:
```
your project folder
     |--Samples
        |-- Import-OSResources.ps1
        |-- Export-OSResources.ps1
        |-- ImportOneSphereCSV
            |-- Projects.csv
            |-- Users.csv  
        |-- ExportOneSphereCSV 
```

## Import-OSResources.PS1
Import-OSResources.ps1 is a PowerShell script that configures the HPE OneSphere resources based on CSV files, including:

* Users
* Projects

## Syntax

### To create Users
```
.\Import-OSResources.ps1 -Portal "YourHPEOneSpherePortalURL" -Username "YourHPEOneSpherePortalUsername" -Password "YourHPEOneSpherePortalPassword" -OSUsersCSV "PathToUsers.csv file"
```

### To create Projects
```
.\Import-OSResources.ps1 -Portal "YourHPEOneSpherePortalURL" -Username "YourHPEOneSpherePortalUsername" -Password "YourHPEOneSpherePortalPassword" -OSProjectsCSV "PathToProjects.csv file"
```

## Export-OSResources.PS1
Export-OSResources.ps1 is a PowerShell script that exports HPE OneSphere resources into CSV files including:

* Users
* Projects

## Syntax

### To export all resources

```
.\Export-OSResources.ps1 -Portal "YourHPEOneSpherePortalURL" -Username "YourHPEOneSpherePortalUsername" -Password "YourHPEOneSpherePortalPassword" -All
```

### To export Users
```
.\Export-OSResources.ps1 -Portal "YourHPEOneSpherePortalURL" -Username "YourHPEOneSpherePortalUsername" -Password "YourHPEOneSpherePortalPassword" -OSUsersCSV "PathToUsers.csv file"
```

### To export Projects
```
.\Export-OSResources.ps1 -Portal "YourHPEOneSpherePortalURL" -Username "YourHPEOneSpherePortalUsername" -Password "YourHPEOneSpherePortalPassword" -OSProjectsCSV "PathToProjects.csv file"
```
## Let's try few examples in PowerShell:

### Viewing Excel files
1. Navigate to the ImportOneSphereCSV inside your project Samples folder
2. Open the Projects.csv file

    The Projects.csv file contains all definitions for various attributes for the Project

![](/uploads/media/2018/1/hpe-onesphere-automation-using-powershell-and-csv-picture-1-1517429812944.png "Different attributes of Projects CSV file")

>Note: Ignore errors about Excel.

### Export OneSphere resources to CSV files
You will run Export-OSResources.ps1 script to export HPE OneSphere resources (Projects and Users) to corresponding CSV files.

1. Open a PowerShell window. Make sure hpeonsphere module is imported.

2. In the PowerShell window, navigate to the project samples folder and execute the following command by replacing with your HPE OneSphere credentials:

```
.\Export-OSResources.ps1 -Portal "YourHPEOneSpherePortalURL" -Username "YourHPEOneSpherePortalPassword" -Password "YourHPEOneSpherePortalPassword" -All
```

>Note: If there are errors, check the Portal URL, username and password

3. Observe the logging of the script in the PS command window

![](/uploads/media/2018/1/hpe-onesphere-automation-using-powershell-and-csv-picture-2-1517429828732.png "Export HPE OneSphere resources to CSV files")

4. Navigate to the project folder -> Samples -> ExportOneSphereCSV -> Open the created CSV files and Compare/check them with the values in the HPE OneSphere portal

### Creating Users
You will run Import-OSResources.ps1 script to create users in HPE OneSphere

1. Open PowerShell window, navigate to the project samples folder and execute the following command by replacing with your HPE OneSphere credentials:

```
.\Import-OSResources.ps1 -Portal "YourHPEOneSpherePortalURL" -Username "YourHPEOneSpherePortalPassword" -Password "YourHPEOneSpherePortalPassword" -OSUsersCSV .\ImportOneSphereCSV\Users.csv
```

>Note: If there are errors, check the Portal URL, username and password

2. Observe the logging of the script in the PS command window

![](/uploads/media/2018/1/hpe-onesphere-automation-using-powershell-and-csv-picture-3-1517429839388.png "Creating Users in HPE OneSphere from Users CSV file")

3. In the HPE OneSphere console, click on settings -> People.

![](/uploads/media/2018/1/hpe-onesphere-automation-using-powershell-and-csv-picture-4-1517435658336.png "Created Users in HPE OneSphere from Users CSV file")

4. Examine the Users and their settings. Compare/check them with the values defined in the Users.csv file by navigating to the project folder -> Samples -> ImportOneSphereCSV -> Users.csv

### Creating Projects
You will run Import-OSResources.ps1 script to create projects in HPE OneSphere

1. Open PowerShell window, navigate to the project folder and execute the following command by replacing with your HPE OneSphere credentials:

```
.\Import-OSResources.ps1 -Portal "YourHPEOneSpherePortalURL" -Username "YourHPEOneSpherePortalPassword" -Password "YourHPEOneSpherePortalPassword" -OSProjectsCSV .\ImportOneSphereCSV\Projects.csv
```

>Note: If there are errors, check the Portal URL, username and password

2. Observe the logging of the script in the PS command window

![](/uploads/media/2018/1/hpe-onesphere-automation-using-powershell-and-csv-picture-5-1517429859659.png "Creating Projects in HPE OneSphere from Projects CSV file")

3. In the HPE OneSphere console, click on Projects

![](/uploads/media/2018/1/hpe-onesphere-automation-using-powershell-and-csv-picture-6-1517429870281.png "Created Projects in HPE OneSphere from Projects CSV file")

4. Examine the Projects and their settings. Compare/check them with the values defined in the Projects.CSV file by navigating to the project folder -> Samples -> ImportOneSphereCSV -> Projects.csv

## Next Step?

There are many ways to automate resource creation and consumption of HPE OneSphere. Using  PowerShell and CSV files is one option. The others include [Go](/blog/using-hpe-onesphere-go-module), [Python](/blog/using-hpe-onesphere-python-module) and [Javascript.](/blog/using-hpe-onesphere-javascript-package)