---
title: Massive parallel management with iLOrest on Linux
date: 2022-01-03T14:57:18.386Z
featuredBlog: false
priority: null
author: François Donzé - Technical consultant
authorimage: https://gravatar.com/avatar/6f3982d1461459da475f47e3a6c89d1d?s=192
thumbnailimage: null
tags:
  - ilo-restful-api
  - Redfish
  - iLO
---
Thanks to HPE having provided the [iLOrest Python API](http://hpe.com/info/restfulapi), an entirely new avenue has been opened to developers for managing their servers. It allows them to add in their favorite deployment tools (i.e. [Ansible](https://hackshack.hpedev.io/workshop/23)) or other management tools, like [HPE OneView](http://hpe.com/info/oneview) (as described in several articles found here, in the [HPE DEV Blog](https://developer.hpe.com/blog/)).

But what if you are not a Python geek? What if you prefer managing your servers the old way with `bash` / `grep` / `awk` / `jq` / `curl` / `wget`? In that case, you can loop over the list of your iLO IP addresses and use `curl` / `wget` for getting and setting Redfish parameters.

However, this loop approach brings out two fundamental problems: 1) Using `curl` and `wget` in management scripts implies the creation of smart crawling functions (as explained in this [article](https://developer.hpe.com/blog/getting-started-with-ilo-restful-api-redfish-api-conformance)), 2) a sequential management with loops is fine for taking care of five or ten servers, but not more.  A parallel approach should be considered for an important number of managed servers.

This blog post explains how to manage many servers in parallel using bash scripts without the need of implementing schema crawlers, thus allowing a long-term stability to the scripts.

To achieve this goal, you will combine a parallel task launcher (namely the [ClusterShell](https://clustershell.readthedocs.io/en/latest/index.html) and/or the Parallel Distributed Shell) with [iLOrest](https://www.hpe.com/info/resttool) (former `hprest`) the HPE RESTful Interface Tool in a more detailed and slightly different manner than what you can read already in the [user guide](https://hewlettpackard.github.io/python-redfish-utility/#overview).

## Clush and pdsh: Quick (and dirty) overview

The Parallel Distributed Shell (`pdsh`) and the ClusterShell (`clush`) are both part of the [Extra Package for Enterprise Linux](https://fedoraproject.org/wiki/EPEL) (EPEL) repository and they give the ability to perform local or remote commands in parallel. `Pdsh` came first as a replacement of an IBM utility (DSH) with Google being the main contributor. However, Google pulled out from this project in 2013.

The ClusterShell is an interesting alternative to `pdsh` for many reasons. First the basic syntax and most of the switches, options and arguments are identical to `pdsh`.  Hence, moving from pdsh to clush is easy. Additionally, `clush` provides more flexibility for selecting the remote nodes you want to execute commands against or on. It is associated with the [`nodeset(1)`](https://clustershell.readthedocs.io/en/latest/tools/nodeset.html) command for computing advanced nodeset operations like `expand`, `fold`, `group`, etc. Another advantage of `clush` over `pdsh` is that it is written in Python and can be used in Python scripts whenever you are ready to use this language.

For the purposes of this article, I will use ClusterShell only.

For those systems running Red Hat or a similar distribution, you need to mention the two packages containing the code and the eco-system:

```bash
sudo dnf install python3-clustershell clustershell
```

On Ubuntu systems, just mention the `clustershell` parameter on the command line to install both packages:

```bash
sudo apt install clustershell
```

Here are basic examples to illustrate the launch of several commands in parallel on the local node and then one command on several remote nodes.

If you want to perform a parallel `ping` toward `node1`, `node2` and `node3` type:

```bash
clush -R exec -w node[1-3] ping %h
```

`-R exec` specifies a local execution of the `ping` command toward the list of hosts: `node[1-3]`. `%h` is substituted with `node1`, `node2` and `node3` for each `ping` command. When you hit the return key, your system forks in parallel the following 3 tasks:

```bash
ping node1 
ping node2 
ping node3
```

Imagine now that you  want the root user of `node1`, `node2` and `node4` to `ping` a remote gateway called `aremotegateway`. With the above syntax you can issue:

```bash
clush -R exec -w node[1-2,4] ssh -l root %h "ping aremotegateway"`
```

However, EPEL provides `clush` compiled with an `ssh` (default) module, allowing the following simplified syntax:

```bash
clush -w node[1-2,4] -l root "ping aremotegateway"`
```

Since the `-R` switch is not present, the `ssh` default module is used toward `node[1-2,4]`  and the `ping` command is executed on this list or remote nodes.

## Nodeset management

The list of remote nodes following the `-w` switch can be the output of a `nodeset` command taking its input from a node set configuration file. The possible locations of the configuration file depends on the `groups.conf(5)` file. For this article, I populated the default file located in my home directory (`~/.local/etc/clustershell/groups.d/local.cfg`).

Here is one example showing the power of this `clush` companion command.

Imagine you define two groups of iLOs in the nodeset configuration file:

```bash
ilo-sales: ilo-sales[1-10]
ilo-marketing: ilo-foo,ilo-bar,ilo-test
```

The  `ilo-sales` group contains ten iLO names and ilo-marketing group contains three. If you want to select both groups and exclude node `ilo-test`, you can do it with:

```bash
nodeset --fold @ilo-sales,@ilo-marketing  --exclude ilo-test
```

![nodeset exclude example](/img/1-nodeset-exclude.png "nodeset exclude example")

You can now combine the `nodeset` command with `clush` to issue a parallel `ping` toward this list with:

```bash
clush -R exec -w $(nodeset -f @ilo-sales,@ilo-marketing -x ilo-test) ping -c 2 %h 
```

## Out-of-band or in-band: that is the question

As discussed in this [blog](https://developer.hpe.com/blog/chif-driver-not-found/) post, iLOrest offers both out-of-band and in-band management. In the first form, you need to log into a remote iLO with the credentials of an iLO user. The following sequence of commands retrieves the Bios version of a remote server using an out-of-band management:

```bash
ilorest login ilo-IP -u ilo-user -p ilo-password
ilorest select computersystem. 
ilorest ls oem/hpe/bios/current # On Gen9, replace with bios/current
ilorest logout
```

> Note: You can always use out-of-band management even when the server is OFF or when there is no operating system installed. The iLO constantly listens on the network as long as a power cable is plugged in the server.

Performing in-band management with iLOrest means that you need to first access the operating system before launching the local `ilorest`. If you login as a privileged user (root or Administrator), you don't need to supply any username/password credentials to access the underlying iLO:

```bash
ssh root@server ilorest login
ssh root@server  ilorest select computersystem.
ssh root@server ilorest ls oem/hpe/bios/current # On Gen9 replace with bios/current
ssh root@server ilorest logout
```

## Who kicked me out?

All of this is awesome except that in both examples (out-of-band and in-band), a cache directory location is not explicitly specified. Hence, you will be kicked out if a concurrent iLOrest session is opened using the default cache directory as shown in the following picture.

The picture below shows the following sequence of events: (1) you first log into ilo-lab1. (2) Then you select the `Bios.` type (select `HpBios.` on Gen9 servers) and (3) verify that it has been selected. 

(4) In the other terminal session and from the same server, log into ilo-lab2 without selecting any type. This second session clears off the iLOrest cache including the selection we performed in the first terminal. As a result, (5) asking for the resource type selection returns an error.

![Demonstrating iLOrest local cache](/img/2-kicked-out.png "Demonstrating iLOrest local cache")

As a consequence (and to be safe), you should always specify a specific cache directory location for your iLOrest sessions which will avoid such contention. One possible solution is to generate a random string of ASCII characters and use it as a location for the iLOrest cache.

With a random string of 16 characters (lowercase, uppercase, digits) for a cache directory name, the out-of-band example becomes:

```bash
UUID=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | head -c 16)
iLOrest="ilorest --cache-dir=/tmp/$UUID"
$iLOrest   login ilo-IP -u ilo-user -p ilo-password
$iLOrest select computersystem. 
$iLOrest ls oem/hpe/bios/current # On Gen9, replace with bios/current
$iLOrest logout
```

And the in-band example:

```bash
UUID=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | head -c 16) 
iLOrest="ilorest --cache-dir=/tmp/$UUID"
ssh root@server $iLOrest login
ssh root@server  $iLOrest select computersystem.
ssh root@server $iLOrest ls oem/hpe/bios/current  # On Gen9, replace with bios/current
ssh root@server $iLOrest logout
```

## Parallel out-of-band management

You are now ready to send iLOrest commands in parallel toward a set of iLOs sharing common administrator credentials.

This example applies a Bios configuration file to a list of servers. The Bios configuration has been created and customized in an ASCII/json file called `BiosConfig.json` using the `ilorest save` command. The list of target servers to configure is represented by a group of iLOs defined in the nodeset configuration file as explained earlier. Note that, for a performance reason, I grouped the type selection (`Bios.`) with the login process:

```bash
CLUSH="clush -R exec" 
iLOrest="ilorest --nologo --cache-dir=/tmp/cache-%h"
ILO_LIST=$(nodeset @myilos)
$CLUSH -w $ILO_LIST $iLOrest login %h -u ilo-admin -p password --selector=Bios. # On gen9, selector is HpBios
$CLUSH -w $ILO_LIST $iLOrest load -f BiosConfig.json
$CLUSH  -w $ILO_LIST $iLOrest logout
```

I personally successfully tested this example against 24 servers. I am pretty optimistic that it works as well for a larger number of servers, although a risk of bumping into iLOrest timeouts exists.

## Parallel in-band management

Offloading iLOrest processing onto remote servers may be required in secure environments where iLOs are physically disconnected from the network.

In this case, in-band management requires that an operating environment is up and running with `sshd` and `ilorest` installed and configured on all the managed nodes. This operating environment could be a customized Live-CD booted via the iLO virtual Drive facility as explained in a [previous article](https://developer.hpe.com/blog/in-band-management-with-ilorest-and-a-livecd/).

The in-band version of our Bios configuration requires one more step compared to the out-of-band method: the copy of the JSON configuration file onto all the managed nodes. This operation is simple to perform with the `--copy` and `--dest` clush options dedicated to that purpose. Moreover, this copy will not impact the overall process time because the JSON configuration file to transfer is a small ASCII file:

```bash
UUID=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | head -c 16)
CLUSH="clush -l root "
iLOrest="ilorest --nologo --cache-dir=/tmp/cache-${UUID}"
SRV_LIST=$(nodeset -f "@lab")

$CLUSH -w SRV_LIST --copy BiosConfig.json --dest /tmp/. 

$CLUSH -w $SRV_LIST "$iLOrest login --selector=Bios." # selector is HpBios. on Gen9 servers
$CLUSH -w $SRV_LIST "$iLOrest load -f /tmp/BiosConfig.json "
$CLUSH -w $SRV_LIST $iLOrest logout
```

## Conclusion

In Linux infrastructures, iLOrest combined to the ClusterShell offers easy out-of-band and in-band management scripting possibilities for system administrators who prefer using Bash to pure Python. Of course, there are pros and cons to both methods. Out-of-band iLOrest management does not require a customized operating environment running on the managed servers. In-band management offers the possibility to physically disconnect iLOs to decrease the network footprint.

In Windows environments, system managers should be able to perform similar efficient parallel configuration of their servers using [PowerShell](https://devblogs.microsoft.com/scripting/parallel-processing-with-jobs-in-powershell/).