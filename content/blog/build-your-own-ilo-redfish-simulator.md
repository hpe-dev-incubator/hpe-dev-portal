---
title: Build your own iLO Redfish simulator
date: 2021-06-08T15:41:30.488Z
featuredBlog: false
priority: 0
author: François Donzé
authorimage: /img/fdz-photoprofile.png
---
## Introduction

When I started the development of Redfish [Workshops-on-Demand](https://hackshack.hpedev.io/workshops), I rapidly realized that I would not be able to provision more than one or two physical servers with an embedded Redfish allowing students to perform write operations in addition to non-destructive read operations.

I started to look for Redfish simulators and found the [qemu](https://www.qemu.org/) based [OpenBmc](https://github.com/openbmc/openbmc) simulator that I used for the [Redfish API 101](https://hackshack.hpedev.io/workshops). This simulator was perfect for this workshop as its Redfish implementation is very light with no Original Equipment Manufacturer (OEM) [Extensions](https://redfish.dmtf.org/redfish/mockups/v1/1060).

Learning  [Redfish client tools](https://youtu.be/ur9UKRV_0S8)

