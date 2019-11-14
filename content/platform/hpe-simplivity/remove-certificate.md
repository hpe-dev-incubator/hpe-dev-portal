---
title: "Simplivity"
version: v 6.01.8964
description:
image: 
frontpage: false
priority: 2
tags: ["hpe-simplivity"]
---

Removing certificates from the trust store
==========================================

You might need to delete a certificate from the trust store on an HPE OmniStack host if the existing certificate has expired or is corrupted, and you want to replace it. If the certificate has expired or is corrupted, then you must authenticate to the HPE OmniStack Virtual Controller by using the emergency access account (`svtcli`).

You can remove certificates from the trust store by using the `Remove-HPESvtCertificate` cmdlet and specifying the certificate's SHA1 thumbprint.

The following sample code shows how delete a certificate from the trust store by thumbprint. It assumes that you have already authenticated.

```
Remove-HPESvtCertificate -Thumbprint 7E084B44FCDAB6EF74AC40E8D9BD508337D96CDE
```

