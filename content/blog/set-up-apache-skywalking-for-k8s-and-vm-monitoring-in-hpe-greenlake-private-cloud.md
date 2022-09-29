---
title: Set up Apache SkyWalking for K8s and VM monitoring in HPE GreenLake
  Private Cloud
date: 2022-09-29T07:26:49.087Z
author: Guoping Jia and Thirukkannan M
authorimage: /img/Avatar1.svg
tags:
  - hpe-greenlake, kubernetes, virtual machine, monitoring
---
## Introduction

Available on the HPE GreenLake Central platform, [HPE GreenLake for Private Cloud Enterprise](https://www.hpe.com/us/en/greenlake/private-cloud-enterprise.html) is composed of the following suite of HPE services that are grouped specifically to create and manage a private cloud:

- HPE GreenLake for Virtual Machines
- HPE GreenLake for Containers
- HPE GreenLake for Bare Metal Servers

I﻿t provides an automated, flexible private cloud c﻿ustomers can use to run, support, and develop any of apps in their private environment, with modern cloud experience for VMs, containers, and bare metal. 

This blog post describes the process of deploying the Apache SkyWalking t﻿o the HPE GreenLake private cloud. in customer production environments. 



## Apache SkyWalking

[Apache SkyWalking](https://www.mongodb.com/) is an open source application performance monitor (APM) system, especially designed for microservices, cloud native, and container-based architectures.