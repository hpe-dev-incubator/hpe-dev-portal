---
title: Learning to manage HPE iLO 7 with RESTful Interface Tool 6.0
date: 2025-03-10T14:05:22.058Z
featuredBlog: false
priority: -1
author: Rajeevalochana Kallur
authorimage: /img/Avatar1.svg
disable: false
tags:
  - iLOrest
  - ilo-restful-api
  - ilo7
  - appaccount
  - vnic
  - REST
---

## Introduction

We know you love servers by Hewlett Packard Enterprise (HPE) for their security and ease of management. With the release of HPE iLO 7 on Gen12 servers, HPE has taken security to the next level. Unlike previous generations where Production was the default <a href="https://servermanagementportal.ext.hpe.com/docs/redfishservices/ilos/supplementdocuments/securityservice/#ilo-security-state" target="_blank">security state</a>, iLO 7 introduces the Secure Standard state by default, enhancing system security.

Another major change is in the default login method - Virtual NIC (<a href="https://servermanagementportal.ext.hpe.com/docs/redfishservices/ilos/supplementdocuments/vnic/#the-ilo-redfish-host-interface-virtual-nic" target="_blank">VNIC</a>) replaces the <a href="https://servermanagementportal.ext.hpe.com/docs/etc/glossaryterms/" target="_blank">CHIF</a> interface, which was used in iLO 6 and earlier versions.

In this article, I'll walk you through how to manage HPE iLO 7 using the iLOrest 6.0 tool via in-band access. We’ll start by **installing <a href="https://github.com/HewlettPackard/python-redfish-utility/releases/latest" target="_blank">iLOrest</a>** on different operating systems and then dive into **logging into iLO 7**. Since **iLO 7 introduces a new <a href="https://servermanagementportal.ext.hpe.com/docs/redfishservices/ilos/supplementdocuments/securityservice/#application-accounts" target="_blank">application account</a> login method**, I’ll also cover how iLOrest 6.0 fully supports this feature.

Let’s get started! 🚀

## Installation

### Linux:

On Linux, iLOrest can be installed as an RPM package. If you already have a previous version installed, you can upgrade it using the -Uvh option.
For a fresh installation, use:

```bash
rpm -ivh ilorest-6.0.x86_64.rpm
```

Here is a screenshot of a successful installation.

![](/img/rpm_linux.jpg)

**Application account creation during iLOrest installation**

During the RPM installation of iLOrest 6.0, you might notice that the installer prompts for iLO credentials to create an Application account. While this step is optional, HPE strongly recommends creating the Application account during installation itself. Why?

- The Application account provides an additional method for in-band authentication with iLO 7, enhancing security and flexibility.

- Once created, the Application account allows you to log in without needing traditional credentials every time.

If you choose to skip this step, you can always create the Application account later using the following command:

```bash
ilorest appaccount create -u ilo-user -p password --self
```

By leveraging this new authentication method, managing iLO 7 becomes even more seamless!!!

### Windows:

On Microsoft Windows, iLOrest is installed using an MSI package. During installation, a user interface will appear, prompting you to enter iLO credentials for the Application account creation.
Just like on Linux, this step is optional but recommended by HPE, as the Application account allows for in-band authentication with iLO 7 without requiring traditional credentials.
Here’s a screenshot of the Application account creation dialog box during installation:

![](/img/windows_msi.jpg)

### All other OSes:

On operating systems like Ubuntu and the macOS, the iLOrest tool can be installed effortlessly via PyPI using the following command:
```bash
pip install ilorest
```
On VMware ESXi, it is installed using

```bash
esxcli software component apply -d ilorest-component.zip
```

#### Creating an Application account

For these OSes, you can create an Application account using the following iLOrest command:
```bash
ilorest appaccount create -u ilo-user -p password --self
```
#### Logging into iLO 7

Once the Application account is created, you can perform an inband login with:
```bash
ilorest login
```
If you prefer to log in without using an Application account, you can opt for credential-based login instead:
```bash
ilorest login --no_app_account -u ilo-user -p password
```
## Summary

In this guide, I have demonstrated how to install iLOrest 6.0 across different operating systems and leverage the new Application account login method introduced in iLO 7. Get started today! Download <a href="https://github.com/HewlettPackard/python-redfish-utility/releases/latest" target="_blank">iLOrest</a>, explore its exciting new features, and take full control of iLO 7 with ease. 

For more information on HPE iLO, along with some tips and tricks in working with it, make sure you check out the HPE Developer blog regularly.




