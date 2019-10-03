---
title: PowerShell-Defined Infrastructure
date: 2017-09-11T17:07:33.172Z
author: Didier Lalli 
tags: ["HPE-OneView","OneView","RESTAPI","JAVA","PowerShell"]
path: powershell-defined-infrastructure
---
In previous articles
([here](https://community.dev.hpe.com/t5/Blogs/First-steps-with-programming-the-HPE-Composable-Infrastructure/ba-p/235724),
[here](https://community.dev.hpe.com/t5/Blogs/Authenticating-against-HPE-Composable-Infrastructure-API/ba-p/235893)
and
[here](https://community.dev.hpe.com/t5/Blogs/Surviving-in-the-Schema-while-running-our-first-inventory/ba-p/235998)),
we used POSTman to experiment with the Composable Infrastructure API,
and then we reused some of these experiments
([here](https://community.dev.hpe.com/t5/Blogs/quot-cURL-ing-quot-through-the-HPE-Composable-Infrastructure-API/ba-p/236298)),
to script some automation using cURL in a Shell script (or from a
Windows Command prompt with some patience). Well, for Windows there is a
far better solution to script and automate a HPE Composable
Infrastructure, and it uses Windows PowerShell.

Windows PowerShell is THE Command Language Interface (CLI) and scripting
language unanimously adopted by all Windows administrators for several
reasons including:

• Its standard and normalized syntax. PowerShell uses the syntax of
verb-noun to interact with the system. You use the Get verb to query and
provide the object noun to specify the resource. For example,
Get-Process returns list of processes, Get-EventLog returns list of
event logs. To create new resources, you use the verb new, to update,
you use the verb set…. You learn the syntax once and apply the same
pattern for different resources[1]

• Its extensibility. By default, Windows PowerShell provides commands or
precisely Cmdlets to interact with the OS. Microsoft also provides a
rich set of libraries to interact with other components of Windows such
as Active Directory, DHCP, network... Libraries are packaged as modules
and administrators simply import the modules to get access to Cmdlets
related to components. For example, to get a list of Active Directory
users, you can run Get-ADuser; to get a list of disk volumes you can use
Get-Volumes. Going further, any Microsoft product is shipped with its
own PowerShell module and as a result, Windows PowerShell can be seen as
a management platform rather than just a rigid CLI.

On that trend, HPE provides an HPE OneView PowerShell module, which
consists of a set of script functions exported as Cmdlets. Script
functions wraps PowerShell code around the REST API and hides the
complexity of using REST API to interact with HPE OneView. Windows
administrators now can use their familiar syntax to interact with HPE
Oneview, for example Get-HPOVNetwork, get-HPOVServer and so on.

# Installing the HPE OneView PowerShell module

The HPE OneView PowerShell library is an HPE Open Source project that is
hosted on [GitHub](http://hewlettpackard.github.io/POSH-HPOneView/).

![Link to PowerShell library .exe hosted on GitHub](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/ps-basic-1-1505150268392.png)

The easiest way to install the PowerShell library is to select and
download the
[installer](https://github.com/HewlettPackard/POSH-HPOneView/releases)
to run. The Installer provides digitally signed assets and verifies
system requirements. You can also download the repository (zip or
tar.gz), which will only contain the library components, and it is up to
the administrator to put the library into the required directory and
validate that their system meets the requirements. Once it is installed,
you can use it in your PowerShell environment (interactive or script)
using an import-module command:

import-module hponeview.200

![ps basic 2](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/ps-basic-2-1505150284255.png)

# Looking for help?

We can check what this library offers with the following command:

get-command -module hponeview.200

There is a long list of commands available. You can get more details on
a given Cmdlet using the help command:

help connect-hpovmgmt

![import-module command of hponeview.200](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/ps-basic-3-1505150291900.png)

# Connect…

Let us try this immediately

Connect-HPOVMgmt 213.30.139.22:37441 -username administrator -password
password

![connect command to HPEOneview](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/ps-basic-4-1505150298918.png)

# And start scripting!

Once connected we can use the different Cmdlets to start automating an
HPE Composable Infrastructure from PowerShell. For example, let us
gather versions:

Get-HPOVVersion

Get-HPOVVersion -ApplianceVer

![Get HPE OneView version command](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/ps-basic-5-1505150306720.png)

As we did in previous articles using POSTman or cURL, let us now
retrieve the enclosures managed in this HPE Composable Infrastructure
using:

Get-HPOVEnclosure

![Retrieve HPE OneView enclosures](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/ps-basic-6-1505150314278.png)

We can also retrieve the list of servers available:

Get-HPOVServer

![Retrieve HPE OneView servers](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/ps-basic-7-1505150322382.png)

You can see that, the PowerShell library handles a lot of the hard work
we had to do while programming directly against the REST API. The HPE
OneView PowerShell library handles for us things such as HTTP Headers or
JSON parsing.

# We can always REST

However, what if we need to get something, which does not have a Cmdlet
available yet? For example in our REST based inventory, we listed the
datacenters managed by the HPE OneView appliance, but there is no
GET-HPOVDatacenter in the HPE OneView Module. Well, there is a solution
for this in the library, it is called Send-HPOVRequest, and it is a
great way to access the REST API directly. Send-HPOVRequest is very
similar to what we did with cURL in a previous article.

Let us use this to retrieve our datacenter list:

$datacenters=Send-HPOVRequest "/rest/datacenters"

$datacenters.members\[0\].name

![Retrieve datacenters using Send-HPOVRequest cmdlet](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/ps-basic-8-1505150331230.png)

We can use help Send-HPOVRequest to find out more about the Cmdlet, and
this shows that the default verb is GET, but we can also use other HTTP
verbs, for example let us say we want to change the currency property of
our Sophia Antipolis datacenter from USD to Euros:

$datacenters.members\[0\].currency

USD

$datacenters.members\[0\].currency="Euros"

Send-HPOVRequest $datacenters.members\[0\].uri "PUT"
$datacenters.members\[0\]

![ps basic 9](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/ps-basic-9-1505150337250.png)

# Feel like contributing?

Well, even better. If you think that instead of using Send-HPOVRequest,
it would be better to write a CmdLet for GET-HPOVDatacenter, and you
feel like doing it yourself, then you can contribute using the following
procedure:

-   From GitHub, fork the repo

-   Make the code change to add your contribution

-   From GitHub, submit a Pull request for review

# Beware with asynchronous operations

By design, HPE OneView is an asynchronous task-based system. Therefore,
Cmdlets might initiate an asynchronous operation, and return immediately
(this is documented in the CmdLet help). In these cases, it is best
practice to retrieve that task object returned by the Cmdlet and use the
Wait-HPOVTaskComplete to wait for task completion before moving on to
the next step. For example, let us use this technique to create a new
server profile:

New-HPOVServerProfile -name TestProfile -assignmentType 'unassigned'
-serverhardwaretype "BL460c Gen8 1" -enclosuregroup "HPE Composable
Infrastructure Enclosures" | Wait-HPOVTaskComplete

# The sky is the limit!

Well, I hope I gave you enough details to get your attention so that you
can start writing your own PowerShell scripts. We have also made
available on the
[Wiki](https://github.com/HewlettPackard/POSH-HPOneView/wiki) of the
GitHub page, a number of sample scripts, so do not hesitate to leverage
these as well. We will come back to some of these in upcoming articles.

[1] Microsoft Approved PowerShell Verbs:
https://msdn.microsoft.com/en-us/library/ms714428(v=vs.85).aspx