---
title: "Simplivity"
version: v 6.01.8964
description:
image: 
frontpage: false
priority: 2
tags: ["hpe-simplivity"]
---

Authenticating
==============

The certificate management cmdlets use OAuth to authenticate.

Use the `Get-HPESvtAuthToken` cmdlet to obtain an OAuth access_token. The access_token is stored in an encrypted file and is automatically used by any of the Powershell cmdlets during the same session. The access_token has a ten minute idle lifetime.

To add or delete a certificate, you must authenticate as a user in the hypervisor management system (HMS) administrator role or as the `svtcli` user. To get certificates, you need to authenticate with the HMS, but the HMS administrator role is not required.

You need to obtain a token from each Virtual Controller where you want to manage certificate trust stores by using the Powershell cmdlets.

Authenticating as the HMS administrator
---------------------------------------

At the command line, you can pass the username then provide the password when prompted by `Get-HPESvtAuthToken`. For example:

```
PS C:\> Get-HPESvtAuthToken 192.0.2.2  admin-username
```

If you are scripting the authentication, you can combine the credentials into an object, then pass the object. The following example uses the `$creds` object to pass the credentials.

```
# securely store the password
PS C:\HPESvtCmdlets> $secpasswd = ConvertTo-SecureString "password" -AsPlainText -Force

PS C:\HPESvtCmdlets> $creds = New-Object System.Management.Automation.PSCredential("admin-username", $secpasswd)
PS C:\HPESvtCmdlets> Get-HPESvtAuthToken 192.0.2.2 $creds
```

It returns an access_token. For example:

```
access_token : bd96becc-71e7-4eca-8859-cbbdfb6d1cdd
token_type   : bearer
expires_in   : 86399
scope        : read write
updated_at   : 1544475704159
```

Authenticating as the `svtcli` user
-----------------------------------

You might need to authenticate as the `svtcli` user when the hypervisor management system is not reachable by the Virtual Controller.

You can use the same technique of combining the credentials into the `$creds` object and then passing `$creds` on the command line, but when you authenticate as the `svtcli` user, you must pass the `-emergency` parameter. For example:

```
$emergencypwd = ConvertTo-SecureString "password" -AsPlainText -Force
$emergencycreds = New-Object System.Management.Automation.PSCredential("svtcli",$emergencypwd)
$oauthcred = Get-HPESvtAuthToken -HostName $ovcip -credential $emergencycreds -emergency
```

It returns an access_token. For example:

```
access_token : bd96becc-71e7-4eca-8859-cbbdfb6d1cdd
token_type   : bearer
expires_in   : 86399
scope        : read write
updated_at   : 1544475704159
```
