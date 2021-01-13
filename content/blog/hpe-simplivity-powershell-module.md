---
title: "HPE SimpliVity PowerShell Module"
date: 2019-05-16T01:37:52.554Z
author: Roy Atkins 
tags: ["hpe-simplivity"]
path: hpe-simplivity-powershell-module
---
# HPE SimpliVity PowerShell Module

This PowerShell module utilizes the HPE SimpliVity REST API to display information and manage an HPE SimpliVity federation. It works by connecting to any HPE OmniStack virtual controller in your environment. With the release of HPE SimpliVity V4.0.0 and above, you can now also implement and connect to a management virtual appliance, which is recommended.

All cmdlets are written as advanced cmdlets, with comment-based help and the majority have the ability to accept the output from another cmdlet as input. Most cmdlets that show information have parameters to limit the number of objects returned. The cmdlets have been written to adhere to the current recommendations with the REST API. For example, limiting the number of records when returning virtual machines and backup objects.

Most "Get" commands display default properties; use Format-List or Select-Object to show all the properties. For example: 

```powershell
    PS C:\> Connect-SVT -OVC 192.168.1.11 -Credential $Cred
    PS C:\> Get-SVThost
 
    HostName      DataCenterName    ClusterName   FreeSpaceGB    ManagementIP   StorageIP   FederationIP 
    --------      --------------    -----------   -----------    ------------   ---------    ------------
   srvr1.sg.com     SunGod          Production1         2,671    192.168.1.11   192.168.2.1   192.168.3.1
   srvr2.sg.com     SunGod          Production1         2,671    192.168.1.12   192.168.2.2   192.168.3.2
   srvr3.sg.com     SunGod          DR1                 2,671    192.170.1.11   192.170.2.1   192.170.3.1
 
    PS C:\>Get-SVThost -HostName 192.168.1.1 | Select-Object *
 
    PolicyEnabled            : True
    ClusterId                : 3baba7ec-6d02-4fb6-b510-5ce19cd9c1d0
    StorageMask              : 255.255.255.0
    Model                    : HPE SimpliVity 380 Series 4000
    HostName                 : srvr1.sg.com
    .
    .
    .
```




 ## Latest Update
Refer to the release notes [here]( https://github.com/atkinsroy/HPESimpliVity/blob/master/RELEASENOTES.md) for more details.

The module contains 58 exported cmdlets, divided into the following feature categories:

**Datastore** | **Backup** | **Backup Policy** |
:--- | :--- | :--- |
Get-SVTdatastore | Copy-SVTbackup | Get-SVTpolicy |
Get-SVTdatastoreComputeNode | Get-SVTbackup | Get-SVTpolicySchedule |
Get-SVTexternalStore | Get-SVTfile | New-SVTpolicy |
New-SVTdatastore | Lock-SVTbackup | New-SVTpolicyRule |
New-SVTexternalStore | New-SVTbackup | Remove-SVTpolicy |
Publish-SVTdatastore | Remove-SVTbackup | Remove-SVTpolicyRule |
Remove-SVTdatastore | Rename-SVTbackup | Rename-SVTpolicy |
Remove-SVTexternalStore | Restore-SVTfile | Resume-SVTpolicy |
Resize-SVTdatastore | Set-SVTbackupRetention | Suspend-SVTpolicy |
Set-SVTdatastorePolicy | Stop-SVTbackup | Update-SVTpolicyRule |
Set-SVTexternalStore | Update-SVTbackupUniqueSize |   |
Unpublish-SVTdatastore |    |    |

**Cluster & Utility** | **Host** | **Virtual Machine** |
:--- | :--- | :--- |
Connect-SVT | Get-SVTdisk | Get-SVTvm |
Get-SVTcapacity | Get-SVThardware | Get-SVTvmReplicaSet |
Get-SVTcluster | Get-SVThost | Move-SVTvm |
Get-SVTclusterConnected | Get-SVTshutdownStatus | New-SVTclone |
Get-SVTmetric | Get-SVTthroughput | Restore-SVTvm | 
Get-SVTtask | Remove-SVThost | Set-SVTvm |
Get-SVTtimezone | Start-SVTshutdown | Start-SVTvm |
Get-SVTversion | Stop-SVTshutdown | Stop-SVTvm |
Set-SVTtimezone |   |    |

## Requirements
* Windows PowerShell V5.1 or PowerShell Core V7.x (PowerShell Core V6.x is not recommended)
* The IP address and the credentials of an authorized OmniStack user account
* The module has been tested with HPE SimpliVity V4.0.1 and should be compatible with older versions (but has not been tested).

## Installation
* Install or update the HPESimplivity module from the PowerShell Galllery using the following respective commands:

```powershell
    PS C:\> Install-Module -Name HPESimpliVity
 # or
    PS C:\> Update-Module -Name HPESimpliVity
```
The module is signed, so it will work with an execution policy set to 'Remote Signed'.

* Restart PowerShell to load the module, or type: 

```powershell
    PS C:\> Import-Module HPESimpliVity -Force
```

* After this, the module will automatically load in new PowerShell sessions. Issue the following commands to confirm:

```powershell
    PS C:\> Get-Command -Module HPESimpliVity
    PS C:\> Get-Help Connect-SVT
    PS C:\> Get-Help Get-SVTbackup
```

* Once installed, you’re ready to connect to the OmniStack virtual controller or Management Virtual Appliance, as follows:  

```powershell
    PS C:\> $Cred = Get-Credential -Message 'Enter OVC/MVA Credentials'
    PS C:\> Connect-SVT -OVC  -Credential $Cred
    PS C:\> Get-SVThost
```

* Or, if you need to run commands in batch (non-interactively), save your credentials to a file first:

```powershell
    PS C:\> $Cred = Get-Credential -Username 'administrator@vsphere.local' | Export-Clixml .\OVCcred.XML 
```

and then in your script, import the credential:  


```powershell
    PS C:\> $Cred = Import-CLIXML .\OVCcred.XML
    PS C:\> Connect-SVT -OVC  -Credential $Cred
    PS C:\> Get-SVThost
```

**Note:** You must login with an admin account (e.g. an account with the vCenter Admin Role for VMware environments).

## Known issues with the REST API (HPE SimpliVity V4.0.1)

The API has some documented and undocumented issues:

* OMNI-69918: GET /virtual_machines fails with OutOfMemoryError. The HPE SimpliVity module limits the number of VMs returned to 8000, as per the recommendation
* OMNI-46361: REST API GET operations for backup objects and sorting filtering constraints. Comma separated list for filtering backup objects is not supported when connecting to OmniStack Virtual Controllers. Comma separated lists CAN be used when connected to a Management Virtual Appliance. For example, the following commands all work when connected to an MVA:

```powershell
    PS C:\> Get-SVTbackup -VmName Vm1,Vm2,Vm3
    PS C:\> Get-SVTbackup -Destination Cluster1,Cluster2
    PS C:\> Get-SVTbackup -Destination StoreOnce-Data01,StoreOnce-Data02
    PS C:\> Get-SVTbackup -Datastore DS01,DS02
    PS C:\> Get-SVTbackup -BackupName Test1,Test2
    PS C:\> Get-SVTbackup -BackupState FAILED,SAVING,QUEUED
    PS C:\> Get-SVTbackup -BackupId a9e82f..., bef1bd...
```

* Backups stored on external stores cannot be deleted if the VM has been deleted, with a “backup not found” error. This does not apply to backups stored on SimpliVity clusters. This restriction is specific to the API; the CLI command `svt-backup-delete` works as expected for external store backups.
* The `PUT  /policies/policyId/rules/ruleId` API call (implemented in `Update-SVTpolicyRule`) doesn’t work as expected in some circumstances. Changing a rules’ destination is not supported (this is documented). In addition, changing the consistency type to anything other than NONE or DEFAULT doesn’t work. If you attempt to change the consistency type to VSS, for example, the command is ignored. In this scenario, a work around would be to delete the rule entirely from the policy using `Remove-SVTpolicyRule` and then use `New-SVTpolicyRule` to create a new rule with the desired destination, consistency type and other settings. 
* Using `GET /backups` with a specific cluster_id (implemented as `Get-SVTbackup –DestinationName ClusterName`) will result in both backups located on the specified cluster AND external stores being displayed. This issue only applies when connected to an OVC; calls to an MVA work as expected. In either case, filtering on an external store works as expected (e.g. `Get-SVTbackup –DestinationName ExternalStore1`)

If you would like to keep up to date with the latest features, please visit the project website on [GitHub](https://github.com/atkinsroy/HPESimpliVity) and subscribe to receive notifications. Updates are published to the PowerShell Gallery at the same time.

Refer to the [HPE SimpliVity platform page](https://developer.hpe.com/platform/hpe-simplivity/home) on HPE DEV for more information. Don't forget to check out our other posts on the [HPE DEV blog site](https://developer.hpe.com/blog) or join us on our #simplivity [Slack Channel](https://slack.hpedev.io/) to ask a question.



