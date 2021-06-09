---
title: Build your own iLO Redfish simulator
date: 2021-06-08T15:41:30.488Z
featuredBlog: false
priority: 0
author: François Donzé
authorimage: /img/fdz-photoprofile.png
---
## Introduction

When I started the development of Redfish [Workshops-on-Demand](https://hackshack.hpedev.io/workshops), I rapidly realized that I would not be able to provision more than one or two physical servers with an embedded Redfish service allowing students to perform concurrent write operations.

I started to look for Redfish simulators and found the [qemu](https://www.qemu.org/) based [OpenBmc](https://github.com/openbmc/openbmc) simulator that I used for the [Redfish API 101](https://hackshack.hpedev.io/workshops) workshop. This simulator is perfect for this introductory lab as its Redfish implementation is simple without Original Equipment Manufacturer (OEM) [Extensions](https://redfish.dmtf.org/redfish/mockups/v1/1060).

For the other two [workshops](https://hackshack.hpedev.io/workshops) (iLOrest and Ansible/OneView), I had to look for a more featured Redfish implementation in order to propose a wider range of exapamples.

This article presents the [Distributed Management Task Force (DMTF)](https://redfish.dmtf.org/) [Redfish Mockup Creator](https://github.com/DMTF/Redfish-Mockup-Creator) and [Redfish Mockup Server](https://github.com/DMTF/Redfish-Mockup-Server) and how they can be used to learn and test the Redfish API.

## Redfish Mockup Creator

TBD

## Redfish Mockup Server

TBD

## iLOrest and the Redfish Mockup Server

TBD