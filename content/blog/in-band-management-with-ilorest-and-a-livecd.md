---
title: In-band management with HPE iLOrest and a LiveCD
date: 2018-03-30T11:19:26.056Z
featuredBlog: false
priority: null
author: François Donzé
authorimage: /img/fdz-photoprofile.png
thumbnailimage: null
tags:
  - iLO
  - ilorest
  - ProLiant
---
<style> li { font-size: 27px; line-height: 33px; max-width: none; } </style>

Updated March 4 2024

In a <a href="https://developer.hpe.com/blog/in-band-management-with-ilorest-and-a-livecd" target="_blank">previous blog</a>, I explained how the HPE RESTful interface tool (<a href="https://github.com/HewlettPackard/python-redfish-utility/releases/latest" target="_blank">iLOREST</a>) is able to communicate securely with the underlying iLO and perform in band management of the lower layers of the server. This blog post provides a method to create a custom bootable LiveCD that embeds the HPE ilorest utility and potentially other management tools.

After booting the server on the LiveCD, it is possible, locally or from a remote location, to perform in-band management operations.

Although the solution presented here is based on Red Hat / CentOS distributions, it can be adapted to other Linux distributions as well as to Windows since the support of iLOrest in WinPE exists since `hprest` version 1.5 (at that time this utility was still called `hprest`).

## High level solution description

The Red Hat / CentOS ecosystem provides the `livecd-tools` package for an easy generation of customized bootable media. It contains the `livecd-creator` utility for the creation of bootable ISO using a classical kickstart configuration file.

The basic steps for embedding `ilorest` in a customized bootable LiveCD are:

1.  Setup of a RHEL / CentOS Media Server configured with the `livecd-tools` and the `createrepo` packages. The custom repository containing iLOrest (see next step) will also be hosted on this Media Server
2.  Creation of a custom repository on the Media Server holding the iLOrest package (and potentially other packages). 
3.  Customization of the LiveCD configuration file.
4.  Creation of the ISO bootable image.

Once the LiveCD ISO file is created we will describe how to use it:

1. Presentation of the LiveCD to a managed server as an iLO Virtual Drive.
2. Boot of the managed server on the LiveCD ISO image.
3. Submission of iLOrest in band management commands to the managed server using SSH.

## Media Server setup

The following instructions suppose you are logged in as root in a CentOS or RHEL 7 server with an Internet connection or with the ability to retrieve all required packages mentioned below.

The first step in the above list is not fully described in this article; I assume that [Apache](https://httpd.apache.org/download.cgi) or another Web server application is installed and configured to provide Linux YUM repositories to other servers on your network.

You can obtain the `livecd-tools` package from the <a href="http://fedoraproject.org/wiki/EPEL" target="_blank">Extra Packages for Enterprise Linux 7</a> (EPEL) repository. 

On a CentOS server issue:

~~~
MediaServer# yum epel-release
~~~

Read the [EPEL Wiki](http://fedoraproject.org/wiki/EPEL) for detailed installation instructions if you are using a RHEL Media Server.

Install the `livecd-tools`:

~~~
MediaServer# yum install livecd-tools
~~~

If you review the content of this package you will notice that it contains several binary tools and a minimal kickstart file for Fedora:

~~~
MediaServer# rpm –ql livecd-tools
...
/usr/bin/livecd-creator
...
/usr/share/doc/livecd-tools-13.4.9/livecd-fedora-minimal.ks
~~~

We could use this minimal configuration file as a starting point and modify it to create a RHEL or CentOS configuration.

Another possibility is to download a public configuration file, more suitable for our RHEL / CentOS Media Server in order to have only a few modifications to perform.

If not already done, create a directory that will contain the LiveCD ISO image. Make sure that this directory is HTTP-accessible by the managed server. Then, download the configuration file in this directory:


~~~
MediaServer# mkdir ISOs
MediaServer# cd ISOs

MediaServer# wget https://raw.githubusercontent.com/CentOS/sig-core-livemedia/master/kickstarts/centos-7-livecd.cfg
~~~

We will customize this kickstart file later.
## Create a package repository for `ilorest`

If not already done, download the <a href="https://github.com/HewlettPackard/python-redfish-utility/releases/latest" target="_blank">latest RESTful Interface Tool package</a> and store it on your Media Server in a location accessible from the network:

~~~
MediaServer# ls myrepo
ilorest-2.1-73.x86_64.rpm
~~~

Create your custom iLOrest repository with `createrepo(8`)and verify that a `repodata` directory has been created along with the iLOrest package. The `createrepo` utility is present by default on RHEL / CentOS, so you should not have to install it:

~~~
MediaServer# createrepo myrepo
…
MediaServer# ls myrepo
ilorest-2.1-73.x86_64.rpm  repodata
~~~

Ultimately, you should verify that this repository can be accessed by other servers on your network. A simple local test could be to retrieve the `repomd.xm` file using `wget` or `curl`:


~~~
MediaServer# cd /tmp
MediaServer# wget http://localhost/<Kit-DIR>/myrepo/repodata/repomd.xml
...
2016-07-13 16:06:34 (237 MB/s) - “repomd.xml” saved [2974/2974]
~~~
## Customization of the LiveCD configuration file

It is now time to edit and customize the RHEL/CentOS LiveCD configuration file. The minimum modifications are:

·         Allow SSH and HTTP protocols through the firewall

·         Start service `sshd`

·         Add the iLOrest repository

·         Add the iLOrest package

·         Modify the `sshd` config file to allow root’s SSH connections with a null password because the LiveCD post configuration script deletes the root password string (`passwd -d root`).

The corresponding modified and added lines are:

~~~
Host# vi centos-7-livecd.cfg
…
firewall --enabled --ssh --http
…
services --enabled=NetworkManager,sshd
…
repo --name=myrepo --baseurl=http://<MediaServerIP>/<KIT-DIR>/myrepo/
...
%packages
ilorest
...
%post
echo “Enabling SSH access with null root password”
cd /etc/ssh
sed -i 's/#\(PermitEmptyPasswords\) no/\1 yes/' sshd_config
...
~~~

I suggest performing the following additional modifications to reflect your environment location and needs:

~~~
timezone Europe/Paris --isutc
...
skipx
# xconfig –startxonboot
…
# gdm-libs
...

# gnome-settings-daemon-updates

~~~
## Creation of the ISO bootable LiveCD

The last step is to generate the LivCD ISO bootable file:

~~~
Host# livecd-creator --config centos-7-livecd.cfg
~~~

The above command generates a bootable `livecd-centos-7-livecd-<timestamp>.iso` image containing an OS and the required packages including iLOrest.

## Presenting the LiveCD to a server

To boot the server on this image, we just need to present it as an iLO Virtual Drive and make sure it boots automatically during next reboot. The iLO Web Graphical User Interface can help to perform those tasks in an interactive manner.

However, for didactic reasons, we will use the iLOrest interface tool in an Out-Of-Band manner from the Media Server. This tool provides atomic and macro commands for reading and setting parameters in the iLO, the BIOS or other subsystems

Moreover, it respects the good practices rules described in the *Getting Started with the iLO X Redfish API – A primer for coders* articles ([iLO 4](https://sourceforge.net/p/redfish-lab/wiki/Getting-started-with-the-iLO4-Redfish-API/), [iLO 5](https://sourceforge.net/p/redfish-lab/wiki/Getting-started-with-the-iLO5-Redfish-API/)]: It does not assume that REST objects are at a specific location, but smartly crawls the entire mesh of REST types and sub-types.

Fortunately, iLOrest provides a builtin macro command described in its <a href="https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/ilocommands/#virtualmedia-command" target="_blank">online documentation</a>.

To present the LiveCD to the managed server, the following basics steps will be performed from the Media Server:

1.     Open an iLOrest session with the managed iLO.

2.     Retrieve the ID number of the CD/DvD media type (usually 2):

3.     Present the LiveCD as a Virtual CD/DVD using the builtin `virtualmedia` command with the `--bootnextreset` option to trigger the next reboot on this Virtual Drive.

3.     Close the session

Opening an Out-of-Band management session with iLOrest is very straightforward. You just need to supply the IP address of the managed iLO and the privileged credentials:

~~~
Host# ilorest login <iLO_IP> -u <username> -p <password>
~~~

Use the `virtualmedia` command with no arguments to retrieve the CD/DVD Media ID:

~~~
Host# export VID=$(ilorest virtualmedia | awk '/CD/ {print $1}'  | cut -b2)
~~~

We are now ready to present the virtual CD/DVD with:

~~~
Host# ilorest virtualmedia $VID http://<MediaServerIP>/livecd-centos-7-livecd-<timestamp>.iso --bootnextreset
~~~

Make sure you logout this iLOrest session:

~~~
Host# ilorest logout
~~~



## In-Band Management with iLOrest

Once the managed server is powered on, it boots on the LiveCD and can be accessed via SSH, as root without supplying any password. This gives us the possibility to send iLOrest in-band management commands to the managed server:

~~~
MediaServer# ssh root@livecd ilorest login
MediaServer# ssh root@livecd ilorest types
MediaServer# ssh root@livecd ilorest select VirtualMedia.
MediaServer# ssh root@livecd ilorest ls --json
~~~

The above commands can be includes in a shell script file to perform specific actions or review specific BIOS or iLO parameters.

## Conclusion

We’ve learned how to create a Linux (RHEL / CentOS) LiveCD embedding the iLOrest RESTful interface tool and enabling in band management of a single managed server. In case you have more than one server to manage, it is also possible to use this solution and to configure all of them the exact same way at once. In this case you would use a tool like the parallel distributed shell (`pdsh`) or the cluster shell (`clush`). Look forward to more blogs that will cover topics like `pdsh` or `clush`. 
