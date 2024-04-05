---
title: How to change the factory generated iLO Administrator password
date: 2018-03-29T15:34:24.958Z
featuredBlog: false
priority: null
author: François Donzé
authorimage: /img/fdz-photoprofile.png
thumbnailimage: null
tags:
  - iLO
  - Redfish
  - ilorest
  - ilo-restful-api
---
<style> li { font-size: 27px; line-height: 33px; max-width: none; } </style>

Updated March 6, 2024

You receive a bunch of brand new rack-mount ProLiant servers and want to get them up and running as soon as possible. Ansible, Chef, Puppet, Ironic, Python, PowerShell are your friends but, before being able to use those powerful and flexible tools to fully deploy the servers, you need one little thing: An access to the iLO to configure low level system parameters (i.e. iLO network, BIOS, storage…).

This blog post proposes a simple, quick and modern method to modify the factory randomly generated Administrator iLO password without knowing it. It can be used on one or several thousands of rack-mount ProLiant servers starting at Gen9 models. This problem does not exist for blades or Synergy compute modules because their embedded management modules (respectively OA and Composer) have the ability to perform those tasks without any credentials.

## In-band management with HPE iLOrest does the trick

HPE rack-mount servers, unless they have been customized by the <a href="https://www.hpe.com/us/en/services/factory-express.html" target="_blank">HPE Factory Express integration service</a> comes with a randomly generated factory password visible on a physical paper/plastic tag located somewhere on the front side of the servers. To speed-up the collection of the passwords it is possible to scan and export them in a `.csv` formatted file, using a smartphone bar-code application. However, this method has its limits when it comes to processing several hundreds or thousands of servers.

Instead, I will use an in-band management access method with the <a href="https://github.com/HewlettPackard/python-redfish-utility/releases/latest" target="_blank">HPE iLOrest</a> tool. This RESTful Interface tool can talk to iLO 4/5/6 either from remote (out-of-band) or from the Operating System (Linux or Windows) running on the server itself (In-band management).

> **NOTE**: The method presented below works only if the iLO security state is `Production`. In higher security states, it is required to supply credentials. Use the following command to retrieve the `SecurityState` property of an iLO:
>
> `ilorest get SecurityState --select HpeSecurityService. --url <ilo-ip> --user <ilo-user> --password password --logout`

To set the iLO Administrator password, when logged in to the OS as a privileged user (root or Administrator), I just need to create a text file (i.e. `MyPassword.txt`) with the following content:

```
{
 "path": "/redfish/v1/AccountService/Accounts/1/",
  "body": {
           "Password": "MyPassword"
          }
}
```

Then, using the HPE iLOrest tool, I connect to the iLO via the <a href="https://developer.hpe.com/blog/chif-driver-not-found/" target="_blank">Channel Interface</a> (CHIF). Again, when logged as a privileged user, when the iLO is in `Production` security state, you don't need to supply any credential, and you can send the password request modification:

![Changing the iLO factory generated Administrator password with iLOrest](/img/1-change-password-with-ilorest.png "Changing the iLO factory generated Administrator password with iLOrest")

## Data model clean crawling

But are you sure you changed the Administrator password and not another password account? What if the Administrator account is not located at position “1” in this collection of object?

HPE iLOrest can help you isolate the exact location of the Administrator account. The following command returns in JSON format what you need:

![Retrieve URI of iLO user account 1 with iLOrest](/img/2-ilorest-list-manager-account.png "Retrieve URI of iLO user account 1 with iLOrest")

With a simple parsing of the output of this command, you can create an error prone script to change the desired password.

Should you need to perform more complex digging to retrieve objects from this data model, the <a href="https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/" target="_blank">HPE iLOrest user guide</a> contains a lot of useful examples.

## Building the complete solution

Using this in-band management feature you can easily foresee an entire solution starting with a PXE boot of the servers on a minimal WinPE or PE-Linux operating system containing the iLOrest tool and an automatic trigger of a script performing the iLO password change and other tasks if desired.

Don't forget to check out some of my other <a href="https://developer.hpe.com/search/?term=donze" target="_blank">blog posts</a> on the HPE Developer portal to learn more about Redfish tips and tricks.