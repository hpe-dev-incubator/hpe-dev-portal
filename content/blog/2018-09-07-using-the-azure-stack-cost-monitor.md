---
title: Using the Azure Stack cost monitor
date: 2018-09-07T21:43:43.204Z
author: Vivek Kulkarni 
tags: ["hpe-proliant-for-microsoft-azure-stack"]
path: using-the-azure-stack-cost-monitor
---
# Overview
The Azure Stack cost monitor scripts are used to pull resource consumption data from an Azure Stack instance.  This data can then be imported, manipulated and displayed in a variety of ways. This article describes how to pull this data and provides an example of what it looks like when displayed in a PowerBI dashboard.

# Prerequisites 
* PowerShell for Azure Stack 
* Operator level access to Azure Stack
* Connectivity to Azure Stack ARM endpoints
* Familiarity with PowerBI

# Concepts used in tool 
The tool obtains resource consumption data directly  from the Azure Stack ARM endpoint using the resource usage API.   The tool workflow is as follows:
* Confirm resource rates for Azure Stack meters 
* Run the tool against the Azure Stack ARM endpoint with operator credentials
* Use the JSON  output to display the resource usage data in PowerBI# Procedure 

## Install PowerShell for Azure Stack
If you have not already done so, install PowerShell for Azure Stack using [these instructions] (https://docs.microsoft.com/azure/azure-stack/azure-stack-powershell-install).  Be sure it's installed on the computer you will use to access the Azure Stack endpoints. 

## Verify connectivity to Azure Stack ARM endpoint
* Launch PowerShell
* Copy the lines below into your PowerShell window.  Replace the name and endpoint details for your Azure Stack environment

````powershell
# To get this value for Azure Stack integrated systems, contact your administrator who deployed Azure Stack.
#Example: For an Azure Stack that has been deployed with regionname=seattle; externalFQDN=stackcloud.com use value as, https://adminmanagement.seattle.stackcloud.com
$ArmEndpoint = "<Admin Resource Manager endpoint for your environment>"

#Use Azure Stack operator credentials to log in
Add-AzureRMEnvironment  -Name "AzureStackAdmin" -ArmEndpoint $ArmEndpoint

# After signing in to your environment, Azure Stack cmdlets can be easily targeted at your Azure Stack instance.
Add-AzureRmAccount -EnvironmentName "AzureStackAdmin"

Get-AzureRmResourceGroup
````
These commands should list the resource groups available on the Azure Stack instance.   If this succeeds, then you have verified connectivity to the Azure Stack endpoint.  If you encounter any errors, check with your Azure Stack administrator to fix the connectivity.

## Export resource usage data
* Download [usage monitor tool] (https://github.com/HewlettPackard/hpe-azurestack/blob/master/Usage-Monitor/Get-AzureStackUsageDataWithCost.ps1) to a local folder

* Supply the parameter values you want to use with the tool.   The complete list of parameters is in the tool.  Among the parameters that should be specified are:
  * Granularity : Daily or Hourly
  * Time range : From, To datetimes
  * Aggregation Level : Provider or Tenant


````powershell
#
# EXAMPLE1: To get AzureStack Admin usage report with hourly granularity
# 
.\Get-AzsUsageInfo.ps1 -StartTime 3/01/2018 -EndTime 3/21/201 -AzureStackDomain azurestack.local -AzureStackRegion "local" -AzureStackCloudName "Local MAS Cloud" -AADDomain mydir.onmicrosoft.com  -Granularity Hourly 
# *** The generated output file will be <AzureStackRegion>-<AzureStackDomain>-Hourly-UsageSummary.json
       
#
# EXAMPLE2: To get AzureStack tenant usage report with daily granularity
.\Get-AzsUsageInfo.ps1 -StartTime 3/01/2018 -EndTime 3/21/2018 -AzureStackDomain azurestack.local -AzureStackRegion "local" -AzureStackCloudName "Local MAS Cloud" -AADDomain mydir.onmicrosoft.com -Granularity Daily -TenantUsage

# The generated output file will be <AzureStackRegion>-<AzureStackDomain>-Daily-TenantUsageSummary.json
````
## Generate a PowerBI dashboard
Use the data from the generated JSON files with powerBI and create dashboard reports with your  desired visualizations.# Examples
Below are example PowerBI dashboards using data extracted from HPE Azure Stack lab environments.  

The first dashboard shows daily usage over a 2 month period:

![](/uploads/media/2018/9/dailyusagesummary-1536947449691.png "DailyUsageReport")

The second dashboard shows hourly usage over a 3 day period:

![](/uploads/media/2018/9/hourlyusagesummary-1536947466387.png "HourlyUsageReport")# Summary
Controlling cloud resource consumption and cost is a large consideration for cloud customers.  This tool enables you to see which resources are driving your costs and as well as which ones may be silently wasting capacity.  This allows Azure Stack operators to better monitor their consumption throughout the month.


To further extend this tool, the entire process could be automated by periodically exporting usage data and refreshing the dashboard.

# Next Steps
If you'd like to learn more about development on the HPE ProLiant for Microsoft Azure Stack as well as other HPE platforms, join the HPE Developer community below. 

If you have any new project ideas for Azure Stack, contact the team at [asic@hpe.com](mailto:asic@hpe.com).