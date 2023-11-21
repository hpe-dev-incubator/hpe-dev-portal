---
title: "How to Build Stanzas Using MapR Installer for Easy and Efficient Provisioning"
date: 2020-09-19T05:31:19.092Z
author: Prashant Rathi 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","opensource"]
authorimage: "/img/blogs/Avatar1.svg"
featuredBlog: false
priority:
thumbnailimage:
---
## Original Post Information:
```
"authorDisplayName": "Prashant Rathi",
"publish": "2016-12-09T08:00:00.000Z",
"tags": "streaming"
```

---

**Editor’s Note:** MapR products referenced are now part of the [HPE Ezmeral Data Fabric](https://www.hpe.com/us/en/software/data-fabric.html).

The MapR Installer provides cluster operators an intuitive way to set up a cluster using a step-by-step wizard. The wizard guides you through:

*   Selecting a Core Version and ecosystem services
*   Using Auto-Provisioning templates
*   Specifying a list of Nodes and Disks
*   Grouping Services and laying them out across nodes
*   Verification of all dependencies before cluster installation

We have set up multiple clusters for several of our enterprise customers and learned quite a bit in the process. Increasingly, these deployments have not only grown in number, but have also evolved based on the type, purpose, and lifetime of these clusters. If you add to the mix the rapid innovation in the community and the complexity that it brings, there is a clear demand for a higher level of automated and consistent cluster provisioning.

Installer Stanzas enable API-driven installation for the industry’s only converged data platform. With this capability, operators can build a Stanza that contains layout and settings for the cluster to be installed and passes it programmatically to the installer to execute the set of instructions.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/stanza-1600932620174.png)

This new capability is very useful when you need a script-based tool to install the software and you do not want to click through the menus and options provided by the installer wizard. While this method provides less visual feedback than the GUI version, it can be faster and more efficient at installing software on clusters with many nodes. Not only that, but once a Stanza gets defined, you can automate the cluster setup process for each successive cluster creation with a minimum set of changes.

Read the detailed [“how-to” guide here](https://docs.datafabric.hpe.com/61/AdvancedInstallation/Stanzas/SilentInstaller.html). At the heart of these Stanzas is a YAML file. You must configure a YAML file before using this method to install or upgrade a cluster. Sample YAML files (basic and advanced) can be found in the installer package, but here are the top-level sections:

*   _**Environment**_ – specifies the mapr_core_version
*   _**Config**_ – specifies the list of nodes (with login information), disks, and other configuration info. Also includes the list of services chosen from pre-existing templates or custom-defined from from MapR Ecosystem Pack (MEP) versions.
*   _**Groups (optional)**_ – selection of services grouped across nodes for advanced layout option

Here’s an example structure for a 3-node cluster:

```markdown
environment:
   mapr_core_version: 5.2.0
config:
   hosts:
         - demonode[1-3].example.com
   ssh_id: root
   license_type: enterprise
   mep_version: 2.0
   disks:
         - /dev/sdb
  	 - /dev/sdc
   services:   
              template-05-converged:
```

MapR Installer Stanzas come with the following set of commands that can be executed on the command line:

*   <u>Install</u> – use to fresh install, incremental install, and upgrade a cluster
*   <u>Uninstall</u> – use to uninstall a cluster
*   <u>Export</u> – use to generate a YAML file to capture state of the cluster
*   <u>List</u> – list nodes, services, and groups in a cluster

**Quick set of steps to get started:**  

1. [Download the Installer](https://docs.datafabric.hpe.com/61/MapRInstaller.html).  
2.  [Review the detailed documentation here](https://docs.datafabric.hpe.com/61/AdvancedInstallation/Stanzas/SilentInstaller.html).  
3.  Start building new clusters!  

To view more articles on this topic, be sure to check back regularly on the [HPE DEV blog site](/blog).