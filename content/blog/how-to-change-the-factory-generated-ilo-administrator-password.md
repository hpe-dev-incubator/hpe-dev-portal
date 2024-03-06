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
---
<style> li { font-size: 27px; line-height: 33px; max-width: none; } </style>

Updated March 6, 2024

You receive a bunch of brand new rack-mount ProLiant servers and want to get them up and running as soon as possible. Ansible, Chef, Puppet, Ironic, Python, PowerShell are your friends but, before being able to use those powerful and flexible tools to fully deploy the servers, you need one little thing: An access to the iLO to configure low level system parameters (i.e. iLO network, BIOS, storage…).

This blog  proposes a simple, quick and modern method to modify the factory randomly generated Administrator iLO password without knowing it. It can be used on one or several thousands of rack-mount ProLiant servers starting at Gen9 models. This problem does not exist for blades or Synergy compute modules because their embedded management modules (respectively OA and Composer) have the ability to perform those tasks without any credentials.

## In-band management with `ilorest` does the trick

HPE rack-mount servers, unless they have been customized by the [HPE Factory Express integration service](https://www.hpe.com/us/en/services/factory-express.html) comes with a randomly generated factory password visible on a physical paper/plastic tag located somewhere on the front side of the servers. To speed-up the collection of the passwords it is possible to scan and export them in a .csv formatted file, using a smartphone bar-code application. However, this method has its limits when it comes to processing several hundreds or thousands of servers.

Instead, I will use an in-band management access method with the [ilorest(8)](http://www.hpe.com/info/resttool) tool. This [RESTful Interface tool](http://www.hpe.com/info/resttool) can talk to iLO 4/5 either from remote (out-of-band) or from the Operating System (Linux or Windows) running on the server itself (In-band management).

To set the iLO 4/5 Administrator password, when logged in to the OS as a privileged user (root or Administrator), I just need to create a text file (i.e. `MyPassword.txt`) with the following content:

```
{
 "path": "/redfish/v1/AccountService/Accounts/1/",
  "body": {
           "Password": "MyPassword"
          }
}
```

Then, using the `ilorest` tool, I connect to the iLO via an internal path (no credential required here) and send the password request modification:

![Changing the iLO factory generated Administrator password with ilorest](/img/1-change-password-with-ilorest.png "Changing the iLO factory generated Administrator password with ilorest")

# Data model clean crawling

But are you sure you changed the Administrator password and not another password account? What if the Administrator account is not located at position “1” in this collection of object?

`ilorest` can help you isolate the exact location of the Administrator account. The following command returns in JSON format what you need:

![List iLO user account 1 with ilorest](/img/2-ilorest-list-manager-account.png)

With a simple parsing of the output of this command, you can create an error prone script to change the desired password.

Should you need to perform more complex digging to retrieve objects from this data model, the [Managing HP Servers Using the HP RESTful API](http://h20564.www2.hpe.com/hpsc/doc/public/display?docId=c04423967) manual explains very well with pseudo code examples how to crawl the data model without making bad assumptions.

# Building the complete solution

Using this in-band management feature you can easily foresee an entire solution starting with a PXE boot of the servers on a minimal WinPE or PE-Linux operating system containing the `ilorest(8)` tool and an automatic trigger of a script performing the iLO password change and other tasks if desired.

Don't forget to check out some of my other <a href="https://developer.hpe.com/search/?term=donze" target="_blank">blog posts</a> on the HPE Developer portal to learn more about Redfish tips and tricks.