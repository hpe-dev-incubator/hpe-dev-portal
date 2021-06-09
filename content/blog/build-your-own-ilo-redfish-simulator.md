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

For the other two [workshops](https://hackshack.hpedev.io/workshops) (iLOrest and Ansible/OneView), I had to look for a more featured Redfish implementation in order to propose a wider range of examples.

This article presents the [Distributed Management Task Force (DMTF)](https://redfish.dmtf.org/) [Redfish Mockup Creator](https://github.com/DMTF/Redfish-Mockup-Creator) and [Redfish Mockup Server](https://github.com/DMTF/Redfish-Mockup-Server) and how they can be used to learn and test the Redfish API.

## The Redfish Mockup Creator

### Basic presentation, installation and invocation

To create your own Redfish simulator, you need to have access in read mode to a live Redfish service. Then, using the [DMTF Redfish Mockup Creator](https://github.com/DMTF/Redfish-Mockup-Creator) deployed in a place with network connectivity to the live Redfish service, you will be able to retrieve the entire Redfish resources in "index.json" text files under a specified directory.

The Redfish Mockup Creator is a single, simple and very easy to deploy [python 3](https://www.python.org/downloads/) script with a very small number of parameters and options that makes it easy to use. The associated documentation is up to date and provides several deployment methods and invocation examples in its GitHub [`README.md`](https://github.com/DMTF/Redfish-Mockup-Creator#readme) file. 

You can download the latest sources from the [release location](https://github.com/DMTF/Redfish-Mockup-Creator/releases/tag/1.1.1) in `.zip` or `.tar.gz` format. From there, you just need to unzip or untar the sources into a location from which Python 3 and companion modules is accessible.

> **IMPORTANT NOTE:** As mentioned in the [`requirements.txt`](https://github.com/DMTF/Redfish-Mockup-Creator/blob/1.1.1/requirements.txt) file, the DMTF `redfish` Python module is required to run the Mockup Creator. However, this module is not compatible with the HPE `python-redfish-library` because both of them contain a class called `redfish` but with different content. Use `pip uninstall python-redfish-library` before installing the DMTF `redfish` Python module with `pip install redfish`. 

The following command launches the `redfishMockupCreate.py` script against a remote Redfish service (`-r ilo5`) accessible with credentials (`-u`, `-p`).

The `--Secure` argument specifies the use of the `HTTPS` secure protocol. The `--Auth` parameter allows two modes of authentication in the remote Redfish service: `Basic` and `Session`. The `None` mode displayed in the help is synonym of `Basic` in the [Python code](https://github.com/DMTF/Redfish-Mockup-Creator/blob/1.1.1/redfishMockupCreate.py).

The `--Headers` options stores the response headers of each `GET` requests in a `headers.json`. More details are present in the in the next paragraph.

Lastly, the `--Dir` option provides the folder entry point for the mockup. 

> NOTE: The mockup target directory will be created if necessary. If it exists, it must be empty before the launch of the Mockup Creator.

```shell
python3.4 redfishMockupCreate.py -r ilo5 -u ilouser -p ilopassword \
     --Secure --Auth Session  --Headers \
     --Dir ./ilo5
```

### Mockup structure

Once command crawls the remote Redfish service tree

## Redfish Mockup Server

TBD

## Using iLOrest againt a Mockup Server

TBD

## Conclusion
In addition to a good quality, and from my personal experience, I found the DMTF maintainers of this project very responsive to address quality issues and proposed enhancements. 


TBD + pointer to [Redfish client video](https://youtu.be/ur9UKRV_0S8)
