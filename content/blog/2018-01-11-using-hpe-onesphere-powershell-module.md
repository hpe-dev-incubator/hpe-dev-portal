---
title: Using HPE OneSphere PowerShell Module
date: 2018-01-11T11:17:29.895Z
author: Didier.Lalli@hpe.com 
tags: ["PowerShell","Windows","HPE-OneSphere","API","GettingStarted","REST"]
path: using-hpe-onesphere-powershell-module
---
## Summary
In previous articles, [Getting Started With OneSphere Programming](https://developer.hpe.com/blog/getting-started-with-hpe-onesphere-programming) and [Authenticating against HPE OneSphere API](https://developer.hpe.com/blog/authenticating-against-hpe-onesphere-api), we discovered the HPE OneSphere REST API, and most of this was done using a handy tool called Postman. In this article we will see that you can also use Microsoft PowerShell to access the HPE OneSphere API using the HPE OneSphere PowerShell module. 

## Why PowerShell?
Microsoft has been establishing PowerShell as the standard command line interface to manage everything on a Windows system for quite some time. All Windows versions come equipped with PowerShell and because Microsoft built PowerShell with extensibility in mind, it has spread to not only manage the Windows Operating System, but a lot of software running on top of Windows (Microsoft IIS, Microsoft Exchange, Microsoft SQL Server). In fact many other 3rd party software providers also created additional management modules for managing their software using PowerShell. For example, you can use PowerShell to manage VMware VSphere, or Amazon AWS. HPE is also providing PowerShell modules for most of its products, such as [HPE OneView](https://github.com/HewlettPackard/POSH-HPOneView), [HPE ProLiant](https://github.com/HewlettPackard/PowerShell-ProLiant-SDK) or  [3PAR Storage](https://h20392.www2.hpe.com/portal/swdepot/displayProductInfo.do?productNumber=3PARPSToolkit). It was logical to allow administrators to manage [HPE OneSphere](https://www.hpe.com/us/en/solutions/cloud/hybrid-it-management.html) also using PowerShell. 

## Cmdlets and Modules
PowerShell uses command lets (aka cmdlets) to interface with users. The following list shows a number of well-known cmdlets used to manage Windows:

- Get-Date
- Get-Volume
- Get-Process
- Get-Service | Where-Object {$_.Status -eq “Running”}
- Restart-Computer
- Start-Job

PowerShell extensibility resides in the capability to add custom cmdlets to your environment. This could be homemade cmdlets or 3rd party provided cmdlets. But, because in many cases managing a specific item will require more than one cmdlet, it is common to group several cmdlets into a module (also known as a library). HPE provides one of those for managing HPE OneSphere.

## Install the HPE OneSphere PowerShell module
There are multiple ways to install the HPE OneSphere PowerShell module. The easiest is to use the PowerShell Gallery which requires PowerShell V5 or above. 

### Installing from PowerShell Gallery
Installing from the PowerShell Gallery is very easy as it happens directly from PowerShell. You would simply have to run the following command:


````PowerShell
Install-Module -Name HPEOneSphere
````

> Note: You can always uninstall a module using the Uninstall-module cmdlet

### Installing from Github
The source code for the HPE OneSphere PowerShell module is actually provided on [HPE Github](https://github.com/HewlettPackard/hpe-onesphere-powershell). So a very simple option is to *git clone* the repository (if you are familiar with the Git toolset) to get a local copy of the module. A second option is to use the installer provided in the Release section of the GitHub repository. In this case, download and run the installer. This will install the PowerShell module in the right location. It is always possible to uninstall it from Control Panel.

## Load...
Next step is to load the installed module using the import-module cmdlet:

````PowerShell
Import-Module -Name HPEOneSphere
````
or

````PowerShell
Import-Module ./hpeonesphere
````
If you decided to run the module locally.

The next step is to understand the new set of cmdlets, provided by this module, that can now be used in your PowerShell environment.

````PowerShell
Get-Command -module hpeonesphere
````
You will see a fairly long list of cmdlets such as Connect-HPEOS, GET-HPEOSStatus, Get-HPEOSUser. The pattern, as you can guess, is always going to be Verb-HPEOSObject, which is the way PowerShell was designed. It means that we run the given *verb* on the provided type of *object*. 

For each of these you can get help by calling Get-Help (or just help for short)

````PowerShell
Get-Help get-hpeosstatus
Help get-hpeosstatus -examples
````
Remember we said in a previous article that retrieving HPE OneSphere status didn't require authentication, so let's try it:

````PowerShell
Get-HPEOSstatus -portal https://OneSphere
Status of HPE OneShere is: OK
````
## Connect...
That's cool, but let's now connect to this HPE OneSphere instance and continue exploring the rest of the module content. Well before you do this try to call GET-HPEOSUser and see what you get without connecting first.

````PowerShell
Get-HPEOSuser 
Not connected to any OneSphere portal
````
To connect, use the Connect-HPEOS cmdlet. It will prompt you for missing parameters if you omit them from the command line. For example, the URL to the portal is required as well as valid credentials.  

````PowerShell
Connect-HPEOS 
cmdlet Connect-HPEOS at command pipeline position 1
Supply values for the following parameters:
Portal: https://OneSphere
Credentials
````
It is good programming practice to cleanup when finished, and in this case to delete session tokens. You can use Disconnect-HPEOS to do this for you:

````PowerShell
Disconnect-HPEOS 
````
## Use interactively
If the operation was successful, you are now connected to HPE OneSphere, ready to run other cmdlets. Let's try a few, starting with the Get-HPEOSuser which failed before we connected:

````PowerShell
Get-HPEOSuser 
````
This will now return a nicely formatted list of registered users.

We have provided a default formatter with most types of objects, but if you want access to all properties of objects in a response you can always pipe the command with the format-list cmdlet (fl for short).

````PowerShell
Get-HPEOSuser | fl
````
We provide a Add-HPEOSuser cmdlet to add a new user of HPE OneSphere. Feel free to lookup the help for it.

````PowerShell
Add-HPEOSuser -name foo -email foo.bar@hpe.com -password supersecret123! -role administrator
````
> Note: the created object is also returned by the cmdlet, so it could be stored in a PowerShell variable with $newuser=Add-HPEOSUser -name foo -email foo.bar@hpe.com -password supersecret123! -role administrator

You can get the user list again to see that new user foo is now an administrator of HPE OneSphere. You can look up its Id and retrieve that single user with:

````PowerShell
Get-HPEOSuser -id 19b1e30b81da4abd963868326379f9da
````
Which leads me to show another powerful feature of PowerShell, which has an object-enabled pipeline. This means that if a cmdlet returns an object or a collection of objects (which most of them do), you can pipe this into another command which will use these objects as input parameters. Let's say we would like to delete the user foo we have just created. We can do it with:

````PowerShell
$foo = Get-HPEOSuser -id 19b1e30b81da4abd963868326379f9da
Remove-HPEOSuser -user $foo
````
or 

````PowerShell
Get-HPEOSuser -id 19b1e30b81da4abd963868326379f9da | Remove-HPEOSuser 
````
This is very powerful and dangerous too, as the command will process collections of users in one single line. In case of doubt you can always suffix a destructive command with the option -whatif. 


````PowerShell
Get-HPEOSuser -id 19b1e30b81da4abd963868326379f9da | Remove-HPEOSuser -whatif
What if: Performing the operation "Remove-HPEOSUser" on target "foo".
````
## and script too!
Using PowerShell in interactive mode is obviously nice, but the next step is to build your own PowerShell scripts to automate repetitive tasks. The interesting thing about PowerShell and the fact that it's an interpreted language, is that every succession of commands that you type interactively could be cut and pasted into a script.  We can do this with the cmdlets used so far in this article and build ourselves a file called myfirstscript.ps1  with the following content:


````PowerShell
Param
(
    [Parameter(Mandatory)]
    [string]$Portal,

    [Parameter(Mandatory)]
    [string]$Username,

    [Parameter(Mandatory)]
    [string]$Password

)

# Import HPE OneSphere Module
import-module  ./hpeonesphere # or just import-module  hpeonesphere

# Retrieve Status of Portal
get-HPEOSstatus -portal $Portal -verbose

# Create a credential object using username/password passed as input params
$secpasswd = ConvertTo-SecureString $Password -AsPlainText -Force
$Global:mycreds = New-Object System.Management.Automation.PSCredential ($Username, $secpasswd)

# Connect to HPE OneSphere
Connect-HPEOS -portal $Portal  -credentials $mycreds -verbose 

# Display Projects
write-host "Projects discovered: " @(Get-HPEOSProject).count
Get-HPEOSProject

# Display Users
write-host "Users discovered: " @(Get-HPEOSUser).count 
Get-HPEOSUser

# Disconnect from HPE OneSphere
Disconnect-HPEOS 

## Optionaly unload module
remove-module hpeonesphere
````
Once saved, run it with:
 
```` PowerShell
./myfirstscript.ps1
````
It will load the module, connect to HPE OneSphere, display the Status, the number of projects, the list of projects, then the number of users and the list of users.

You can explore the rest of the PowerShell cmdlets on your own. Feel free to provide feedback on [HPE Github](https://github.com/HewlettPackard/hpe-onesphere-powershell) page, so we can continue to improve the module.

> Note: If this is the first PowerShell script you run on your machine, you might have to loosen security to allow for script execution using the cmdlet set-executionpolicy.

## Next Step?
There are many ways to consume an API such as HPE OneSphere. PowerShell is one option, which makes a lot of sense if you are using a Windows system and are already familiar with PowerShell. In future articles we will explore other approaches.



