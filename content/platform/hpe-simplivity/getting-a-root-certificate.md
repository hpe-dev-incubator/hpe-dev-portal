---
title: "Simplivity"
version: v 6.01.8964
description:
image: 
frontpage: false
priority: 2
tags: ["hpe-simplivity"]
---

Getting root certificates
=========================

The `Get-HPESvtRootCertificate` cmdlet returns an array of X509Certificate2 objects from the vCenter Server. This cmdlet does not require that you authenticate.

When you use this cmdlet, you must independently verify that the certificate is what you expect it to be because the command does not perform validation checks on the certificate.

```
Get-HPESvtRootCertificate -hmsHostname 192.0.2.2 | Format-list

Subject      : OU=VMware Engineering, O=vc-147-50-53, S=California, C=US, DC=local, DC=vsphere, CN=CA
Issuer       : OU=VMware Engineering, O=vc-147-50-53, S=California, C=US, DC=local, DC=vsphere, CN=CA
Thumbprint   : 83754908A5088D883FBC86275EF1FD964E2153C0
FriendlyName :
NotBefore    : 7/9/2017 10:48:12 PM
NotAfter     : 7/7/2027 10:48:12 PM
Extensions   : {System.Security.Cryptography.Oid, System.Security.Cryptography.Oid, System.Security.Cryptography.Oid, System.Security.Cryptography.Oid}
```

Use the `Get-HPESvtRootCertificate` cmdlet in conjunction with the `Add-HPESvtCertificate` cmdlet to populate the certificate trust store on the Virtual Controller.

