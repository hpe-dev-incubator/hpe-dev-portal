---
title: "Becoming a Linux Kernel Contributor: Following the Journey of Souptick
  Joarder"
date: 2022-04-26T19:38:25.987Z
author: Dale Rensing
authorimage: /img/blog-author-rensing-96.jpg
thumbnailimage: /img/linux_source_code_primary_site.png
tags:
  - opensource
  - Linux
---
![The Linux Kernel Archive](/img/linux_source_code_primary_site.png "The Linux Kernel Archive")

As a leading global, edge-to-cloud company, Hewlett Packard Enterprise (HPE) prides itself in employing team members who share one common purpose: to advance the way people live and work. Because of this, HPE boasts some of the finest [Open Source](https://www.hpe.com/us/en/open-source.html) engineering talent. In this blog series, you’ll get to meet a number of them as I interview some of the Open Source experts who make up our team.

In this blog interview, Souptick Joarder, who has been contributing to Linux Kernel for the last four years, describes his journey on becoming a trusted patch reviewer and contributor to Linux. Souptick first encountered Linux while studying embedded systems and became interested in Linux kernel programming due how Linux lent itself to exploration and modification according to one’s needs. He appreciated being able to give back to the community. Souptick received his Master of Technology degree in software systems at the Birla Institute of Technology and Science and works for HPE as a storage systems engineer.

### Contributing to such a large Open Source project must be a daunting task. What advice would you give to would-be contributors?

To be sure, in the last four years that I’ve been involved, I’ve had to learn the ins-and-outs of making contributions and how to overcome the challenges involved. First and foremost, it’s important to understand that contributions to Linux are done through a trust-based development model. And it takes contributors a while to build that trust. Another thing that’s important to understand is the inherent hierarchy of the contribution process, since you’ll need to know who to connect to in order to build that trust. So, if you’re interested in being a kernel contributor, understand that you’ll need a lot of patience.

### What would you recommend as the best way to get started?

When getting started, I’d recommend that you choose a particular area that interests you to focus on. I spend most of my time acting as a reviewer for patches posted in the Memory Management mailing list for the Virtual Memory Management subsystem. The subsystem of Linux memory management is responsible to manage the memory inside the system. It contains the implementation of demand paging and virtual memory. Also, it contains memory allocation for user space programs and kernel internal structures.

![Memory Management Mailist List](/img/mm_mailing_list.png "Memory Management Mailist List")

In parallel, I fix warning/errors reported by different kernel test bots on the memory management mailing list. Here is [the link for list of patches](https://git.kernel.org/pub/scm/linux/kernel/git/next/linux-next.git/log/?qt=grep&q=jrdr.linux@gmail.com) for which I remain Author/ Reviewer/ Part of Discussion.

There are many different subsystems in Linux and each has a named maintainer called Lieutenant. For example, Andrew Morton is the Memory Management (MM) maintainer. He’ll screen patches posted primarily for memory management and check to see that the patches have followed the process and whether they actually do what they set out to do. Post review, he will merge it into his MM Git branch. He usually accepts small patches from new developers as well but for large scale changes he takes only from trusted developers. Over time, you’ll learn how to submit to each subsystem according to how the lieutenants like to receive contributions.

### How does one make an actual contribution?

Fixes/patches/enhancements are all submitted through mailing lists. Linux development is set up using a number of different mailing lists that align with different subsystems of the kernel. When you make your contribution, you’ll send it off to a specific mailing list and then you also want to CC the more general associated mailing list. 

For instance, when I make my contributions for the virtual memory management subsystem, I send it to the memory management mailing list. Then I also CC the higher-level, more general Linux Kernel Mailing List (LKML). There is a [MAINTAINERS file](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/MAINTAINERS) (text file) inside the kernel source code that will tell you exactly who should receive a review request for your patches. Once your patch is ready, you need to refer to this MAINTAINERS file and, based on the files you have modified, send patches to only those maintainers and mailing lists.

### How do you determine what to add or fix?

Reviewing patches is considered one of the most important things to do in terms of the Linux kernel development process. You can really make substantial contributions here. An additional benefit of reviewing patches from other developers is that you get the opportunity to be involved in their contribution work and learn from it. Kernel test bots work from the Git repositories and report out on warnings and errors. Any developer can analyze those issues and provide a fix by following the correct protocols. It’s a continuous process that developers can spend a good amount of time on.

### Could you give an example of one of your contributions?

There had been multiple VM\_FAULT\_ERR error code noted, usually reported by drivers upon failures. These VM\_FAULT\_ERR error code had been defined as macro. When the drivers return a VM\_FAULT\_ERR error code, the data type was not shown as unique across the kernel. Each driver chose their own datatype to report the error, which turned out to be a problem.

In many cases, the drivers failed to return the VM\_FAULT\_ERR error code despite seeing a failure and wound up returning SUCCESS instead. It also turned out that there was this silly inefficiency in the drivers (due to the lack of an appropriate API), resulting in ERRNO error codes sometimes being converted to a VM\_FAULT\_ERR error code before returning to memory management.

The plan was to introduce a new datatype (initially named vm\_fault\_t type) and then to enable all the drivers/filesystems in the entire kernel to use this new type. This would ensure that when any new driver used a datatype other than vm\_fault\_t to report the VM\_FAULT\_ERR error code, the compiler would catch it. This way, we would restrict all future callers to use only the vm\_fault\_t type to report a VM\_FAULT\_ERR error code. This allows the catching of errors much earlier in the build process (at compile time) instead of waiting for higher in the chain for execution.

As part of this change, we also identified all the buggy drivers which were not returning the correct VM\_FAULT\_ERR error code upon failure and fixed them. We also identified all the other drivers which were converting ERRNO to VM\_FAULT\_ERR before reporting a failure to memory management. A few new wrapper APIs were added to make the conversions easy.

Just to give you an idea of the patience that’s required to do this, this work started with Linux V. 4.17 and will finish with V5.1 – a whole year’s worth of time.

### Any final advice to developers who might like to start contributing to Linux?

It’s important to remember that Linux kernel development doesn’t work with a deadline-based approach. Patches are reviewed and tested by developers and maintainers all around the world and this takes time. So you need to have a lot of patience. It could take months, or even years, to get your changes merged into the mainline code. Because the maintainers, in the end, are responsible for maintaining any new pieces of code, they believe in the approach of **breaking the code first before accepting it**. This can take time.

Something else to keep in mind is that others will often criticize your changes. Sometimes it turns ugly. Learn to take criticism in a positive way. This is probably one of the most important pieces of advice I can give to fellow developers interested in working with the kernel community.

Finally, sometimes you’ll find more senior developers who will help you bring your patches forward. You’ll find this a great opportunity to learn new things and it’s also a great way to build your reputation within the community. Remember, since the entire development process is done through email communications, the only way the community will judge you will be by your work – so make your work shine!