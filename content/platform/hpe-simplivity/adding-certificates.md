---
title: "Simplivity"
version: v 6.01.8964
description:
image: 
frontpage: false
priority: 2
tags: ["hpe-simplivity"]
---

Adding certificates to the trust store
======================================

Add certificates to the trust store by using the `Add-HPESvtCertificate` cmdlet. You can specify the path to the certificate file or an X509Certificate2 object. The certificate file can be a PEM or a DER file. To use the `Add-HPESvtCertificate` cmdlet, you must first authenticate.

The following example shows how add a certificate called `test-node.pem` by path. It assumes that you have already authenticated.

```
PS C:\> Add-HPESvtCertificate -Path c:\temp\test-node.pem

certificate : -----BEGIN CERTIFICATE-----
              MIIELTCCAxWgAwIBAgIJAMptn/02hezjMA0GCSqGSIb3DQEBCwUAMIGsMQswCQYD
              VQQGEwJVUzEWMBQGA1UECAwNTWFzc2FjaHVzZXR0czEUMBIGA1UEBwwLV2VzdGJv
              W8rc/ZJmzmxtOmM1DPDCL6RpINS1V4ouJIF5DHo8kzP1UjZjHQcCAwEAAaNQME4w
              CQYDVR0TBAIwADALBgNVHQ8EBAMCBeAwHQYDVR0lBBYwFAYIKwYBBQUHAwEGCCsG
              AQUFBwMCMBUGA1UdEQQOMAyHBAqQAWeHBArPAfswDQYJKoZIhvcNAQELBQADggEB
              AKkXh9z6wo5Mt2zyDrh2p252AwUTmILLD7+YgGxU1stpjFaVlKL7wiEsW4/g37+J

     .
     .
     .
              -----END CERTIFICATE-----
hash        : 47ca6deb5880fd26ec4f546b3884aa65c78590df
subject     : EMAILADDRESS=security@myco.com,CN=omnicube.xxx.us-east.myco.local,O=myco,L=mycity,ST=mystate,C=US
issuer      : EMAILADDRESS=security@myco.com, CN=omnicubexx.us-east.myco.local, O=myco, L=mycity, ST=mystate, C=US
serialno    : ca6d9ffd3685ece2
```

This example shows how to add a root certificate by using an X509Certificate2 object:

```
$newrootcert = [System.Security.Cryptography.X509Certificates.X509Certificate2]::New($newrootpath)
Add-HPESvtCertificate -Certificate $newrootcert
```

Optionally, you can pipe the parameter to `Add-HPESvtCertificate` instead of passing it as an argument. For example:

```
'test.pem' | Add-HPESvtCertificate
```

or

```
$newrootcert | Add-HPESvtCertificate
```
