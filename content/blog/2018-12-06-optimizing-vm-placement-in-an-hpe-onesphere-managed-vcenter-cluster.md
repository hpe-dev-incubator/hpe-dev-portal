---
title: Optimizing VM placement in an HPE OneSphere managed vCenter cluster
date: 2018-12-06T10:48:05.804Z
author: Didier Lalli 
tags: ["hpe-onesphere","VMwarevCenter"]
path: optimizing-vm-placement-in-an-hpe-onesphere-managed-vcenter-cluster
---
# Problem Statement
HPE OneSphere can manage VMware vCenter based private cloud in customer datacenter as well as public clouds. After the VMware environment was "onboarded" in HPE OneSphere, VM Templates are surfaced in HPE OneSphere Service Catalog. Once discovered users can consume VMware VM templates directly from OneSphere Service Catalog, and create new deployments. If it all works very well for consumers in HPE OneSphere, the way the VMs are provisioned from VM Templates in VMware might not always fit well the VMware configuration established by vCenter administrators, this is particularly true when configuration requires VM to be dispatched in specific vCenter VM folders. 

# The solution
However there is a way to achieve a more appropriate VM placement from "outside" of HPE OneSphere, using a simple PowerShell script. The script is based on two important facts. First of all, VM, although managed by HPE OneSphere, can be moved within the Datacenter folder structure in vCenter. HPE OneSphere keep track of a VM by its Unique ID and this ID remains unchanged when VM is moved accross folders. The second point is that each VM created by HPE OneSphere on behalf of a user, is flagged with important context information located in the Notes field of the VM. And this allows for quite a number of options.

# The VM Notes field
What do we get in this Notes field? This is a multi-line text field which contains information about the HPE OneSphere User and some of the context when creating this VM. We can see for example what Project Name this VM belongs to. 
![VM Notes Field](/uploads/media/2018/12/vmnotes-1544093561814.jpg "VM Notes Field with HPE OneSphere information")
We can see other interesting fields such as username which could be used to notify user of certain types of messages. Let's focus on the project name in this article. The presence of this information in the Notes field allows us to be sure that the VM is managed by HPE OneSphere.

# Mapping HPE OneSphere Project names with vCenter folders
One typical use case we see implemented by VMware administrators is the fact that VMs are organized in folder named after projects. This could be a multi-level hierarchy of folders with location code or business division code. For example *Houston/QA/Apollo* or *Paris/Prod/SAP*.
In our example we used an Excel speadsheet to map HPE OneSphere Project names to VMware vCenter folder paths. 
![Excel mapping file](/uploads/media/2018/12/mappingfile-1544093542545.jpg "Excel Mapping File")
Another approach would be to have a way to compute folder path from project name but it offers less flexibility.
For each line in this spreadsheet, we have to maintain a folder path in vCenter.

# The PowerShell script
## Script outline
The solution is a PowerShell script which 
- connects to a given vCenter
- enumerate the VMs in the root folder 
- for each VM managed by HPE OneSphere, look it up in the mapping file to find corresponding folder path
- if there is a folder path, move the VM to that location

## Dependencies
This script requires two PowerShell modules, one for manipulating Excel spreadsheets and the second for interfacing with VMware vCenter. These two modules can be installed from the Microsoft PowerShell Gallery with the following instructions:
```` PowerShell
install-module importexcel
install-module VMware.VimAutomation.Core
````
## Script parameters
The script accepts several parameters such as vCenter ip/fqdn (**VCServerName**), vCenter username (**VCUserName**) and password (**VCServerPassword**), and vCenter Datacenter name (**DatacenterName**). All of which are mandatory parameters. There is also an optional parameter (**ExcelFilename**) to specify the Excel spreadsheet (default value is **ProjectMapping.xlsx** in the same location as the PowerShell script) and a couple of options to change the behavior of the script:
- **CreateFolder**
This string parameter accepts 3 different values: *never*, *always* and *only*, which configures what the behavior should be if the folder we need to copy the VM to, does not exist. By default the value is to *never* create the target folder. If *always* is used, then the folder (and all sub-folders necessary to complete the path) will be created automatically. If *only* is used then the folder will also be created but the VM will not be moved. This option is interesting if you wanted to test a folder structure prior to do any move.
- **reset**
This switch, which cannot be used together with **-CreateFolder**, can be used to revert a move operation and, for example, rework a folder structure. In this case, the script will enumerate all VMs in the Datacenter, and for each of the ones managed by HPE OneSphere, it will move it (back) to the Root folder of the vCenter Datacenter.

## Calling the script
The next example calls the script with all default option:
```` PowerShell
.\OneSphereVMMover.ps1 -VCServerName <vCenter-FQDN> -DatacenterName <DCName> -Username <vCenterUsername> -Password <vCenterPassword>
````
In the next call we would prefer to only create the folder structure but not move any VMs:
```` PowerShell
.\OneSphereVMMover.ps1 -VCServerName <vCenter-FQDN> -DatacenterName <DCName> -Username <vCenterUsername> -Password <vCenterPassword> -CreateTarget only
````
While in this call we want all VMs to be moved and folders created automatically:
```` PowerShell
.\OneSphereVMMover.ps1 -VCServerName <vCenter-FQDN> -DatacenterName <DCName> -Username <vCenterUsername> -Password <vCenterPassword> -CreateTarget always
````
The next call will bring back all VMs in the Root folder:
```` PowerShell
.\OneSphereVMMover.ps1 -VCServerName <vCenter-FQDN> -DatacenterName <DCName> -Username <vCenterUsername> -Password <vCenterPassword> -reset
````
Finally the next call uses a different location for the Excel Spreadsheet
```` PowerShell
.\OneSphereVMMover.ps1 -VCServerName <VeEnter-FQDN> -DatacenterName <DCName> -Username <vCenterUsername> -Password <vCenterPassword> -CreateFolder always -ExcelFilename myfile.xls
````
All these example can be used with the additional option **-verbose** to get more information about the decision made and the VM moved.
```` PowerShell
.\OneSphereVMMover.ps1 -VCServerName <vCenter-FQDN> -DatacenterName <DCName> -Username <vCenterUsername> -Password <vCenterPassword> -CreateTarget always -verbose
````
# Gathering feedback
We will be happy to collect feedback to improve this tool. Please use [Github](https://github.com/HewlettPackard/hpe-onesphere-vmmover) to contribute.