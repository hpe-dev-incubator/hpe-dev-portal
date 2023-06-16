---
title: Meet Open Source enthusiast and Fpart project developer, Ganael Laplanche
date: 2023-06-12T19:54:14.698Z
author: Ganael Laplanche
authorimage: /img/ganael.jpg
thumbnailimage: ""
disable: false
tags:
  - open source
  - fpart
  - fpsync
  - data
  - migration
  - FreeBSD
---
As part of our blog series on open source experts, the HPE Developer team recently met up with Ganael Laplanche, the project developer for [Fpart](https://www.fpart.org/), a sysadmin-oriented tool that helps users sort files and pack them into bags or 'partitions'. Here, we'll introduce you to his work, how it came about, and learn more about what got Ganael involved with working with open source software.

# Ganael, can you tell us a little about the tools Fpart and Fpsync?

The project started when I was working for a renowned center for biomedical research after a discussion with a friend of mine. We wanted to implement a fast bin-packing tool to produce filesystem tree partitions with the same size and number of files. The tool quickly evolved and got support for hooks that can be triggered when a partition is generated.

At that time, we needed to move petabyte-scale filesystems to freshly-acquired storage arrays. With its new hooking system, fpart seemed to be a good basement to launch small migration jobs in parallel through our SSH cluster. Initial tests ([see our article in French](https://connect.ed-diamond.com/GNU-Linux-Magazine/glmf-164/parallelisez-vos-transferts-de-fichiers)) were successful but we were still depending on our on-site scheduler to orchestrate submitted jobs and it was to be retired sooner or later. We needed a new scheduler.

That's where [fpsync](https://www.fpart.org/fpsync/) comes into play : the tool wraps fpart and embeds its own scheduler to trigger small rsync jobs to parallelize data migration *by itself*. It can leverage your SSH cluster to get the best from your data servers, acting as a powerful, standalone, data migration tool.

Of course, as an ardent open source supporter, those tools were released with an open source license (BSD 2-Clause "Simplified" License). They were quickly adopted by large companies (Intel, AWS, Microsoft, Alibaba, Oracle, ...) as well as research centers to migrate petabyte-scale filesystems.

# What attracted you to free software?

I first discovered free software by reading magazines that were surfing on Linux hype during mid-90's (and trying their GNU/Linux distros offered on CDROM). But I really began to understand what free software meant later during my studies. I was immediately seduced by the thought that it exemplified humanity's best attribute: the willingness to share knowledge in order to move forward together.

As a student, this was very important to me: it enabled me to learn more, as the code is freely available and the open source community very responsive. I quickly felt that I owed the community something in return; I didn't want to use all that free software (as in free beer) without giving something back. So I started looking at how I could make my own contribution. This is where FreeBSD played a important role, acting as a catalyst...

# Why did you come to FreeBSD as a development platform?

There are several reasons for that choice. As a curious student, I first tried [FreeBSD](https://www.freebsd.org/) in early 2000's, testing version 4.5. What impressed me first at that time was its documentation (["handbook"](https://docs.freebsd.org/en/books/handbook/)) and man pages. While GNU/Linux appeared to be complex to me, FreeBSD suddently appeared to be clear. With a very nice and welcoming community, it was the perfect platform for a newcomer into the UNIX world. I got caught and never returned to other systems since...

I later understood another reason of that clarity : it is a homogeneous system, not a patchwork of very different projects. That makes all the difference: a specific version of FreeBSD represents a specific version of world (a selection of base components) *and* kernel, making a complete system. Those components are maintained by the same entity ([FreeBSD developers](https://docs.freebsd.org/en/articles/contributors/)) and, as such, everything is consistent, from options to documentation to man pages. This is a great value for users and a guarantee of robustness and stability for the system.

About development, specifically, FreeBSD is a good choice because it is POSIX compliant ; this is important if you want to produce portable code. Also, it is very easy to access source code for world, kernel and ports (third-party applications ported to FreeBSD). One can easily patch things and test the modifications, which is a bit harder on other systems where you would often have to install a dedicated source package to be able to patch it.

Finally, the system is a pleasure to administrate and update. I think I have not reinstalled my machine since late 2000's, just performing upgrades since. Third-party applications can be easily installed and upgraded using binary packages, which was not the case when I started using FreeBSD.

All those reasons are why I use FreeBSD on my systems, for servers and development but also as a daily desktop OS. Lots of people still think FreeBSD is not ready for everyday use on a desktop, I am living proof this is not true!

# What other open source projects are you involved with?

I became a FreeBSD developer in 2011 and I now maintain more than 40 ports (a port is a set of patches and build options that makes a software work on FreeBSD, it also acts as the basis for binary packages). Maintaining ports is a fantastic hobby because one the one hand you have the chance to work for your favorite OS, and on the other hand you can contribute patches back upstream, so you are always in relation with different communities.

Aside from my FreeBSD activities, I have more [personal projects](https://contribs.martymac.org/): I wrote about Fpart and Fpsync, but I am also the author of the ldapscripts, a set of tools to simplify user and group management within an LDAP directory. They are quite old now, but they still do the job. I also worked on various smaller projects, such as sms1xxx kernel module (a port of Linux' Siano DVB-T driver to FreeBSD, now deprecated in favor of webcamd), evtViewer (a viewer for Ms event log files) or Grpar (a Build engine group archive extract tool). I also wrote several courses (in french).

I also try to contribute to software I use when I find a bug (either by fixing it or at least by reporting it).

# Is there anything else you’d like to share with our readers?

I owe a lot to free software. That's mostly what allowed me to learn computing, that's what made my career possible. That's why I contribute back the most I can.

But that takes time (that is, personal time) and money (we need machines to test on, as well as power to run them). I am glad to see more and more companies supporting open source. Recently, HPE provided me with a replacement for my old server, I'll never thank them enough for that kindness! This HPE ProLiant ML350 allows me to build my ports far more quicker than with my old machine. This is a sign that things are changing. I think everybody now understands why it is so important to support open source development. Providing hardware is a simple yet very efficient way of supporting open source developers, sharing code is another one. Let's encourage companies to continue that way!

As for individuals, do not hesitate to report bugs or share code. You will participate in making great things and get fantastic feedback from the community!