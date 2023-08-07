---
title: Chapel scales new heights with 1.28.0
date: 2022-09-20T12:29:26.364Z
author: Dale Rensing
authorimage: /img/blog-author-rensing-96.jpg
thumbnailimage: /img/gettyimages-571979257_1600_0_72_rgb-1200-x-675.jpg
tags:
  - chapel
  - opensource
---
Exciting news for the Chapel community this month – Chapel 1.28.0 has just been released! Chapel, a productive parallel programming language that scales from laptops to supercomputers, now features improved GPU support, a new Communication module that supports low-level puts and gets, and improvements to the interface and other aspects of the code. This open source project is also being highlighted this month at the AnitaB.Org 2022 Grace Hopper Celebration where Michelle Strout and Lydia Duncan of the HPE High Performance Computing and AI group ran a Choose Your Own Adventure project during the Open Source Day, where developers could come to learn more about Chapel and how to contribute to the project.

As Chapel technical lead Brad Chamberlain pointed out in the announcement, many of the changes in Chapel 1.28.0 have been done to improve the language and libraries, thus stabilizing core features in preparation for its forthcoming 2.0 release. As an example, working with non-default numerical types, or combinations of numerical types, has been made simpler, more intuitive, and more consistent with other scientific languages. Implicit conversion and resolution rules have been updated to better preserve bit-widths and ensure operations combining disparate types generate natural, rather than surprising, results or any types of errors.

Adding to the GPU support that’s been added in the past few releases, Chapel 1.28.0 now permits a wider variety of parallel loop computations to be generated as GPU kernels. A new GPU utility module has also been added, providing the ability to assert that a computation will execute on the GPU as intended (or generate an explanation as to why it would not). The module also adds support for printing simple messages from within GPU loops.

A new Communication module has also been introduced in Chapel 1.28.0. This module supports put/get routines to perform explicit data transfers between locales (e.g. nodes in a cluster or on a supercomputer) for users who want to exert more control over low-level communication in their code. You’ll also find many other notable improvements to the ‘chpldoc’ and ‘mason’ tools, which respectively create documentation from commented Chapel code and provide packaging support for Chapel.

Here are some of the main highlights of the release:

* Significantly improved behavior for numerical ops on small/mixed types
* A new Communication module for performing low-level puts/gets
* Expanded idioms that can run on GPUs and a new GPU utility module
* Improvements to ‘chpldoc’ and ‘mason’
* Simplified and improved selection between overloaded routines
* Stabilized language and library improvements
* Reduced average compilation times using the LLVM support library
* Improved portability to ARM-based Macs

For complete details on this new release, please refer to the following resources:

* [Release announcement](https://chapel.discourse.group/t/announcing-chapel-1-28-0/16129)
* [Release changes list version 1.28.0](https://github.com/chapel-lang/chapel/blob/release/1.28/CHANGES.md)
* [Chapel Language Twitter page](https://twitter.com/ChapelLanguage)
* [Chapel Programing Language Facebook page](https://www.facebook.com/ChapelLanguage/)