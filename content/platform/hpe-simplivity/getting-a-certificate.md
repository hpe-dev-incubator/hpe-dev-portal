---
title: ""
version: v 6.01.8964
description:
image: 
frontpage: false
priority: 2
tags: ["Simplivity"]
---

Getting certificates from the trust store
=========================================

Use the `Get-HPESvtCertificate` cmdlet to list the all certificates in the trust store or to search for a specific one by the certificate's SHA1 thumbprint. To use the `Get-HPESvtCertificate`, you must be an authenticated user.

This example shows how to get the list of certificates. It assumes that you have already authenticated.

```
PS C:\ Get-HPESvtCertificate | Format-List

Thumbprint                                Subject
----------                                -------
7E084B44FCDAB6EF74AC40E8D9BD508337D96CDE  CN=omnicubexx.us-east.myco.local
2F43831D62C01FD2AF448DFA8BF86E126B8190DD  CN=omnicubexx.us-east.myco.local
77E44C4DFF0E565665B6CB27E77BA8FBAFFF88A2  CN==omnicubexx.us-east.myco.local
```

This example shows how to search by SHA1 thumbprint:

```
PS C:\ Get-HPESvtCertificate -Thumbprint EB2CD509BA53...D4C6

Thumbprint              Subject      EnhancedKeyUsageList
---------------        ---------           ---------------------------
EB2CD509BA53...D4C6    OU=VMware Enginee...
```
