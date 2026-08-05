---
title: "Simplivity"
version: v 6.01.8964
description:
image: /img/simplivity.jpg 
frontpage: false
priority: 2
tags: ["hpe-simplivity"]
---

Installing the certificate management PowerShell module
=======================================================

You can download and install the HPE SimpliVity certificate management PowerShell module from the Powershell Gallery.

The module works with Powershell Core (PS6) on Ubuntu or Windows 10 and on PowerShell 5.1 (PS5.1).

Installing from the PowerShell Gallery
--------------------------------------

To install directly from PowerShell, run the following command from a Powershell window:

`Install-Module -Name HPESvtCmdlets`

If you are reinstalling to obtain a newer version, you might need to use the -Force option. You can always uninstall a module using the `Uninstall-module` cmdlet.

Loading the module
------------------

After you have downloaded the module, load it by using the `import-module` cmdlet. For example:

`Import-Module .\HpeSvtCmdlets\HPESvtCmdlets.psm1`

To verify that the module imported properly, run the following command and verify that it contains the full set of cmdlets.

`get-module HpeSvtCmdlets`

You see the list of cmdlets in the current version. For example:

```
ModuleType Version Name ExportedCommands
---------- ------- ---- ----------------
Script 1.1.21.0 HPESvtCmdlets {Add-HPESvtCertificate, Get-HPESvtAuthToken, Get-HPESvtCertificate, Get-HPESvtRootCertificate...}
```

You can get help on any command by calling `Get-Help` (or just `help` for short). For example:

`Get-Help Add-HPESvtCertificate`
