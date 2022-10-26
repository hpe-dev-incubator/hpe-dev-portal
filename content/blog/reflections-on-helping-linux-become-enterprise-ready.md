---
title: Reflections on helping Linux become enterprise-ready
date: 2022-10-26T15:17:41.359Z
author: Dale Rensing
authorimage: /img/Avatar6.svg
disable: false
---
In this blog series, you’ll meet some of the open source experts working with the HPE Developer Community team. In this post, I’ll be interviewing Suparna Bhattacharya who works in the HPE AI Research Lab on foundations and techniques for data centric trustworthy AI. She is an HPE Fellow and also the architect for Project Data Map, an innovation project in the CTO. Suparna was a Linux kernel contributor between 2000 and 2007 during the period when Linux was evolving into an enterprise OS.

Some of the contributions Suparna made to Linux were in the areas of filesystems, IO and RAS (reliability, availability, and serviceability), helping to establish Linux as an enterprise-grade OS. During her tenure as a contributor, Suparna learned many things she was able to apply throughout her engineering career and shared them with me here.

#### Suparna, can you set the stage for me as to your involvement with contributing to the Linux kernel?

Back in 2000, there were a number of companies interested in helping Linux evolve into an operating system that could be used in enterprise-scale environments. I was working at IBM at the time and looking for ways I could contribute to help in that effort. My specific project was intended to look at serviceability capabilities, i.e. RAS features. But I wound up contributing in several areas that made their way into the kernel over the course of several years (2000-2007), including:

* Aspects of block I/O
* Asynchronous file system I/O
* ext4 file system
* pre-emptible RCU
* RAS features, including kprobes and kdump

**You’ve likened your experience to bridging Lilliput and Brobdingnag, places found in Gulliver’s Travels by Jonathan Swift. Can you explain what you mean by that?**

Up until that point, Linux had predominantly been used on relatively smaller systems. The challenge now was to make it work well on much larger systems in order to support the enterprise. It felt like trying to build a city where both the Lilliputians could live alongside the Brobdingnagians. You had to be careful that, when you introduced code to support the larger systems, you didn’t trample on the Lilliputians.  In other words, our challenge was to advance the scalability, responsiveness and dependability of Linux for enterprise workloads without introducing additional overhead for non-enterprise users.

#### **Can you give an example?**

Because I had experience working on file systems, my interest was piqued in relation to the Linux IO stack and the file system stack. I noticed some developments coming out of the community to expand the block IO subsystem to support larger IO requests, which is what is needed for databases. A group of developers came up with this new abstraction called kiobuf that intrigued me. I thought to myself, well, okay, if you have this, then you may need to do a few additional things when the IO request completes. So I tried building a little something on to that, adding new techniques so you could work when the IO request completed and trigger callbacks. I came up with a mechanism for doing that, and as I was discussing it on some of the IRC channels, an experienced kernel developer encouraged me to post it as an RFC so I could get feedback from the community.

In doing so, I inadvertently triggered a whole firestorm of emails around kiobuf itself between several stalwarts in the kernel development community. I wasn’t even trying to do anything to change the kiobuf layout. I was merely suggesting the addition of some new features on top of it. But apparently I had drawn the attention of some important members of the community to the kiobufs, descriptors that were being proposed for large IO systems and databases, supporting “big iron”. It was pointed out that, in the process of trying to support these bigger systems, we were making it more difficult for anything that required low-latency handling, like floppy disks and smaller devices.

#### **What was the fallout from the email firestorm?**

One developer started looking at how to rewrite the block IO sub-system. The challenge was to be able to support these larger IO requests while at the same time supporting the diverse workloads and devices at the low end.

Leaning on some of my past experience, I studied his re-write as he posted his patches and came up with notes on the block IO evolution that captured the design issues and tradeoffs. Some of these “bionotes” eventually became part of the block IO design documentation. While I was writing this up, a few others pointed out that there were still places where the new system was inefficient for certain kinds of IO devices, and I had to come up with some patches to fix that. It’s kind of funny how, although my original objective was to get Linux to the point where it worked better for the enterprise, I found myself contributing patches to make it better so that changes we were making ensured it still worked efficiently for smaller systems .

Still, I found that writing up these design issues and design documentation and then contributing patches was a very nice way to get deeply involved with the community.

#### **What did you learn from this?**

This issue of potentially fixing one aspect for one set of users while introducing challenges for others led me to the understanding that, wherever you make a change, it’s better to make minimal changes and not make huge changes in one shot. Each contribution lays the groundwork for someone else to add more to it, so you can evolve the code carefully.

Traditionally, we’ve always been used to building systems in a modular fashion. And Linux is no exception. That’s why you can work on one part of the subsystem without breaking things in other areas. But modularity can also lead to very bloated subsystems. So that’s why you want to proceed carefully, making small changes, sharing it with the community, get feedback, etc.  Don’t make one huge change all at once.

#### **Were you able to get those RAS features in that you wanted?**

It took a few years to get RAS capabilities accepted into Linux. Part of it, as I pointed out earlier, had to do with how difficult it was to support large enterprises while ensuring that we didn’t make the kernel unusable for desktop or low-end systems. But another part of it had to do with a long-held belief amongst the contributor community that you should be able to look at the code and understand why it failed, helping you identify the root cause, and not have to rely on injecting things into the kernel that might be considered intrusive.

For example, a key piece of RAS is serviceability. If something goes wrong in an enterprise environment, you need the service engineers to be able to figure out what went wrong, and the only way they can tell is by inserting probes, like running a trace utility, doing a crash dump, etc. There was quite a lot of apprehension about incorporating these features into the mainline kernel because they were perceived as intrusive and polluting the elegance of kernel code. Many also worried that one might look at the debugger and apply “band-aid” fixes but wouldn’t really get at the root cause. It wasn’t that the community was against including these capabilities… they just didn’t want them done in a way that made the kernel messy or complicated.

Eventually, we were able to add in kernel dynamic probes, aka kprobes, a dynamic tracing capability. The idea here was that, on a running kernel, you could put a probe in at any point and collect information instead of using a static trace. It took a long time to be incorporated; we posted our first implementation in August of 2000 and it took four years to get into the main line. I also worked on a crash dump feature, where again I learned that a minimalist approach is the best approach.

#### **Tell me how the kprobes work emphasized the need for minimalism to you.**

I call this my journey from Modularity to Minimalism, because the first time we tried to implement it, we tried to make it do everything. We wanted it to have this probing capability, but also ensure some safety restrictions and wrote an in-kernel interpreter to allow users to write these probe functions in a new language, and all of it eventually amounted to 6,000 lines of kernel code. It was all very well thought out and we expected it would be well-received by the community. But it wasn’t. It wasn’t that folks didn’t like the capability or the techniques. It was just that they felt that it really didn’t belong in the kernel. It was too much.

A kernel developer in Australia helped us out by suggesting we create just a simple patch that let you put a probe on the kernel function and register the output from that. We would isolate that tiny little patch and post it on the kernel mailing list. This brought our 6000 lines of code down to 550. It took care of the main issues to ensure correctness but didn’t attempt to address a whole lot of different situations. We also came up with a simple trick to enable developers to easily probe function arguments.

After that, it received a lot better reception. There were other things that still needed to be added to it, and they eventually were. What I learned through doing this was that sometimes you need to go backwards in order to move forward. We had to undo a lot of the work and just tease out the very minimal elements. But that’s what led to success, because then folks were willing to adopt it and build upon it. After it was adopted, others added on C Perf probes, System tap, EPF, and a lot of other things.

#### **What about the crash dump feature – what was the difficulty there?**

Crash dump had been integrated into every other OS I had worked with, but it wasn’t in Linux. I started working with this project called Linux Kernel Crash Dump, which started to add that capability and I made a lot of contributions there, but again, it was pretty hard to get into the mainline kernel.

The critical need here was a reliable and flexible crash dump mechanism that would support a wide-range of target devices and environments, while at the same time being easy to use and maintain. We first considered modular solutions. These provided a pluggable framework that was flexible, but the problem was that it was just too complex. It took 5000 lines of code just to capture a crash dump, and that code was being executed when the kernel was already in deep trouble.

So there was this intrinsic challenge – we needed something simple and minimalist but most attempts to address the needs of diverse environments would make everything complex. What I learned here was that, when you have conflicting design goals like this, it’s a great opportunity for innovation.

In the end, we asked ourselves “What is the minimal base for a crash dump?” You would need to save registers and invoke a safe soft reboot to a kernel in reserved memory while preserving a core file “view” of the crashed kernel’s memory.  This would make it possible to reuse existing utilities, such as cp to save a copy of the file (to create a disk dump) or scp and ftp (to create a network dump). When we looked at it that way, we achieved more with less; we got better flexibility and wider applicability, with barely 1000 lines of code (over kexec).

#### **Working on Linux really made an impact on you, didn’t it?**

It was a very exciting time, probably the most enjoyable phase of my entire career. We had no idea back then of how significant and ubiquitous Linux would be in the years to come – some refer to it as “the software that runs the world”.  I learned that participating in open source communities can bring a deep satisfaction from making contributions that can have a lasting impact, while also instilling lasting lessons for how one approaches their work.

For example, one of the most important lessons I learned was that, when addressing design goals for new features, conventional approaches are not always good enough. You have to rethink and challenge long held beliefs to gracefully cope with evolving needs. New challenges are always emerging.

And finally, I learned the power of simplicity, learning to do more with less. You want to reduce things down to the most essential features and avoid unnecessary complexity. Understanding these things has helped me to bring about change more easily in each and every engineering organization I’ve been a part of throughout my career.