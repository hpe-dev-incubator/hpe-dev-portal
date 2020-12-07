---
title: "Container Images for HPE OneView SDKs are now available"
date: 2020-07-13T18:18:16.000Z
author: Christopher Pasek 
tags: ["hpe-oneview","containers"]
path: container-images-for-hpe-oneview-sdks-are-now-available
---
In keeping with Hewlett Packard Enterprise’s strategic vision on container use for hybrid IT, I am pleased to report that container images of HPE OneView 5.2 SDKs are now available. Docker images of [Ansible](https://hub.docker.com/repository/docker/hewlettpackardenterprise/hpe-oneview-sdk-for-ansible), [Terraform](https://hub.docker.com/repository/docker/hewlettpackardenterprise/hpe-oneview-sdk-for-terraform), [Chef](https://hub.docker.com/repository/docker/hewlettpackardenterprise/hpe-oneview-sdk-for-chef), [Puppet](https://hub.docker.com/repository/docker/hewlettpackardenterprise/hpe-oneview-sdk-for-puppet), [Python](https://hub.docker.com/repository/docker/hewlettpackardenterprise/hpe-oneview-sdk-for-python), [Golang](https://hub.docker.com/repository/docker/hewlettpackardenterprise/hpe-oneview-sdk-for-golang) and [Ruby](https://hub.docker.com/repository/docker/hewlettpackardenterprise/hpe-oneview-sdk-for-ruby) SDKs are now all available on Docker Hub. All prerequisite materials are incorporated into the container images to enable streamlined deployment, which will allow you to simplify maintenance, improve infrastructure agility, and reduce costs.  In addition, you can expect all SDK releases in the future to incorporate an updated Docker image.  

Why this focus on containers? The advantage of using containers is that containers offer a virtual runtime environment that runs on top of a single operating system (OS) kernel. Containers virtualize at the operating system level, with multiple containers running atop the OS kernel directly, instead of virtualizing the hardware stack, as with the virtual machine approach. This means that containers are far more lightweight: they share the OS kernel, start much faster, and use a fraction of the memory when compared to booting an entire OS.

Container images include everything required to enable a streamlined deployment process. They eliminate the need to sort through complex support matrices and package dependencies, offering one succinct manifest that can be version controlled and that allows for easy replication across machines in a cluster. Container images also include the software dependencies needed by the SDK, such as specific versions of programming language, runtimes and other software libraries.

Containerized SDKs simplify maintenance as the images contain only the necessary package dependences. In addition, they do not require a dedicated node or OS, which guarantees deployment consistency. Combined with a service-based architecture, the entire unit that developers are asked to reason about becomes much smaller, leading to greater agility and productivity. Using containers eases development, testing, and overall management.

All this translates to reduced cost through increased productivity. Not only do containers help developers. When containers are used, IT operations teams can focus on application deployment and management without bothering with details such as specific software versions and configurations. Teams spend less time debugging and diagnosing differences in environments, and more time shipping new functionality for users. Container use also means fewer bugs overall, since developers can now make assumptions in dev and test environments they can be sure will hold true in production. 

SDK Docker images are available in Docker Hub and GitHub SDK repositories. For more information, please refer to the following:

* [HPE OneView SDK for Terraform](https://hub.docker.com/repository/docker/hewlettpackardenterprise/hpe-oneview-sdk-for-terraform)
* [HPE OneView SDK for Ruby](https://hub.docker.com/repository/docker/hewlettpackardenterprise/hpe-oneview-sdk-for-ruby)
* [HPE OneView SDK for Python](https://hub.docker.com/repository/docker/hewlettpackardenterprise/hpe-oneview-sdk-for-python)
* [HPE OneView SDK for Puppet](https://hub.docker.com/repository/docker/hewlettpackardenterprise/hpe-oneview-sdk-for-puppet)
* [HPE OneView SDK for Chef](https://hub.docker.com/repository/docker/hewlettpackardenterprise/hpe-oneview-sdk-for-chef)
* [HPE OneView SDK for Golang](https://hub.docker.com/repository/docker/hewlettpackardenterprise/hpe-oneview-sdk-for-golang)
* [HPE OneView SDK for Ansible](https://hub.docker.com/repository/docker/hewlettpackardenterprise/hpe-oneview-sdk-for-ansible)
