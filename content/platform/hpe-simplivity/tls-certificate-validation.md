---
title: "Simplivity"
version: v 6.01.8964
description:
image: 
frontpage: false
priority: 2
tags: ["hpe-simplivity"]
---

Disabling/enabling TLS certificate validation on HPE OmniStack for vSphere
==========================================================================

In some cases, it may be necessary to temporarily disable TLS certification validation while you are fixing various certificate issues. However, use these steps only when it is necessary to re-establish communication to the Virtual Controller. Re-enable validation immediately after you diagnose and fix the certificate issues.

WARNING

*Removing all certificates from the trust store causes HPE SimpliVity to stop performing TLS certificate validation which is a potential security risk.*

Disabling TLS certificate validation
------------------------------------

If you need to turn off certificate validation across reboots, you can disable TLS validation by removing all of the certificates from the trust store by using the PowerShell certificate management cmdlets.

When TLS is not working properly in your environment, you must connect to the Virtual Controller using the `svtcli` account because HMS entities cannot be validated when the connection is down.

This procedure assumes that you have downloaded and installed the certificate management cmdlets.

To begin, open a Powershell window and run the following script to remove all of the certificates from the trust store. Update the script to use the IP addresses and credentials for your system.

```
$ErrorActionPreference = "Stop"

$hmsip = "192.0.2.2"
$ovcip = "192.0.2.5"

#
# When the certficates are bad, use the "emergency" account
#
$emergencypwd = ConvertTo-SecureString "password" -AsPlainText -Force
$emergencycreds = New-Object System.Management.Automation.PSCredential("svtcli",$emergencypwd)
$oauthcred = Get-HPESvtAuthToken -HostName $ovcip -credential $emergencycreds -emergency

#
# delete all of the certificates - this turns off TLS validation
#

HPESvtCertificate | ForEach-Object -Process {
    # remove from OVC trust store
    Remove-HPESvtCertificate -Thumbprint $_.Thumbprint
}

#
# The HMS user should be able to logon now
#

$oauthcred = Get-HPESvtAuthToken -HostName $ovcip -credential $creds
```

Enabling TLS certificate validation
-----------------------------------

Leaving validation off is not an acceptable long term solution. Fix the issues with the HMS certificate and then re-enable TLS validation.

This procedure assumes that you have downloaded and installed the certificate management cmdlets.

To begin, open a Powershell window and run the following script to add the HMS certificate to the trust store to restore TLS validation. Update the script to use the IP addresses and credentials for your system.

The script gets the vCenter certificates then adds them to the Virtual Controller's trust store. When certificate validation is turned off or not working, you must connect using the `svtcli` account.

```
$ErrorActionPreference = "Stop"

$hmsip = "192.0.2.2"
$ovcip =  "192.0.2.5"

$secpasswd = ConvertTo-SecureString "password" -AsPlainText -Force
$creds = New-Object System.Management.Automation.PSCredential("administrator",$secpasswd)

#
# When the certificates are bad, use the "emergency" account
#
$emergencypwd = ConvertTo-SecureString "password" -AsPlainText -Force
$emergencycreds = New-Object System.Management.Automation.PSCredential("svtcli",$emergencypwd)
$oauthcred = Get-HPESvtAuthToken -HostName $ovcip -credential $emergencycreds -emergency

#
# grab vmware certs from HMS
#
$vmwarecerts = Get-HPESvtRootCertificate -HostName $hmsip

#
# add them into trust store
#
$vmwarecerts | ForEach-Object -Process {
    Add-HPESvtCertificate -Certificate $_
}

#
# The HMS user should still be able to logon
#
$oauthcred = Get-HPESvtAuthToken -HostName $ovcip -credential $creds
Write-Host $oauthcred
```
