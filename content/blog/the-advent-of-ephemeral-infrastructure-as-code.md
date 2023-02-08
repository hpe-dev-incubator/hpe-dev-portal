---
title: "The Advent of Ephemeral Infrastructure as Code"
date: 2019-01-02T15:40:59.636Z
author: Katreena Mullican 
tags: ["devops","sre","site-reliability-engineer"]
authorimage: "/img/blogs/Avatar3.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**“Ephemeral infrastructure as code”** refers to compute, storage, and networking that is programmatically assembled, provisioned and configured on demand to suit a variety of workloads. Once each workload execution is complete, resulting output is pushed to permanent storage and the infrastructure is available to be re-assembled and re-provisioned. These “composable” building blocks of compute, storage, and networking resources are available in the flexible workhorse known as HPE Synergy. Synergy offers a mix and match of compute nodes and storage drawers within each frame and is managed by a pair of Composer modules, running HPE OneView. A pair of redundant Image Streamer appliances is also available, which provides flexibility for automatically provisioning operating system and applications onto the Synergy nodes. Synergy plus Image Streamer is a powerful combination that is used at HudsonAlpha Institute for Biotechnology, a nonprofit genomics and genetics research institute in Huntsville, AL, to achieve ephemeral infrastructure as code.

You may be thinking, “Write code and maintain GitHub repos? Isn't that more like a Developer or DevOps Engineer role? That's not really an IT thing.” But it can and should be! If your IT operations team is not writing code to communicate with infrastructure via API (application programming interface), you are missing an opportunity to decrease errors and increase innovation and speed of delivery of resources to developers and other end-users. Start by stocking the data center with API-capable hardware and then adopt a DevOps mentality within IT. There's something for everyone … HPE has OneView SDKs (Software Development Kits) available for a variety of languages including Python, Ruby, Go, Java, Hubot, and PowerShell.

For the HudsonAlpha environment, I've chosen to use the Python SDK to provision 6 use cases onto Synergy nodes including OpenStack private cloud, bare metal Docker, and Kubernetes (K8s) cluster running on Fedora 27 and CentOS 7.4. The use cases align with the requirements for our genomic application pipelines.  

I've written a single Python script that can provision any one of the use cases and requires just a single argument of a use case configuration file. The Python script sends requests to Synergy's Composer via the OneView API, which applies the appropriate OneView profile template onto a Synergy node. The profile template contains an Image Streamer Deployment Plan, which consists of a Golden Image and Plan Scripts. The act of applying the profile template to the node includes automatic creation of an Image Streamer iSCSI boot volume for that node and creation of a clone of the Golden Image that is automatically customized per the Plan Scripts. The node boots from the iSCSI volume on Image Streamer and is fully personalized. How do I know once a node has booted and is ready? My Plan Scripts include automatic registration of the node with Hashicorp Consul, which is a service discovery tool. I can query Consul to see active nodes. I also include automatic installation of the DataDog monitoring daemon, so as soon as the node boots, metrics for the host OS and applications are visible within DataDog.

HPE provides ready-to-use Artifact Bundles containing Deployment Plans for RHEL and SLES operating systems. But as I’ve shown, it is possible to create your own as well. See “docs” in my GitHub repo for instructions on creating Fedora 27 and CentOS 7.4 Golden Images, and more information about Consul and DataDog. Plan Scripts and OS Build Plans are stored within “Artifact Bundles” and Python scripts are inside the “projects” directory. Image Streamer is flexible, and there are many ways to accomplish automation. My approach and our use cases at HudsonAlpha are always evolving. I look forward to reading how others are using this technology!

GitHub: https://hudsonalpha.github.io/synergy  
HudsonAlpha Institute for Biotechnology: http://www.hudsonalpha.org  

Twitter: [@katmullican](https://twitter.com/katmullican)