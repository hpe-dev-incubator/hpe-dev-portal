---
title: Designing, Installing, and Configuring a Failover Cluster with Hyper-V Managed by SCVMM 
date: 2019-08-05T15:40:49.039Z
author: Patrick Francois 
tags: []
path: designing-installing-and-configuring-a-failover-cluster-with-hyper-v-man
---
System Center Virtual Machine Manager (SCVMM) is a management tool developed by Microsoft to efficiently manage Hyper-V in a scalable way. While Hyper-V includes its own tools for managing virtual machines (VMs), as an enterprise scales to include failover clustering, Hyper-V replication, or multiple Hyper-V hosts across a variety of physical servers, SCVMM helps to simplify the management of the virtualized infrastructure. 

In this tutorial, you will learn how to install SCVMM in a Microsoft Windows Failover Cluster to improve the availability of applications and services. All you need are at least 2 servers running Windows server 2016 with Hyper-V role in a Domain environment to create this failover configuration using the SCVMM application.  

For the purposes of this tutorial, I used two blade servers, each with a 12-core CPU and 64 GB of memory, in an [HPE Synergy](https://www.hpe.com/us/en/integrated-systems/synergy.html) 12000 Frame. I created two profiles with three different network connections and three storage volumes (one for boot and two shared, with one for VMs and one for quorum). 

After a firmware upgrade with the latest Service Pack for ProLiant (SPP), I booted the systems from the virtual CD-ROM with the Windows Server 2016 ISO file. Once the servers became available, I configured the network with a static IP address, enabled Remote Desktop Service, installed Windows updates, and then activated the Windows key.

The servers were ready to join the Windows domain after they were rebooted to apply the new configuration.

Next, I installed Hyper-V role, then failover Clustering and the Multipath IO feature, after which I rebooted the systems again. 


![picture1](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/picture1-1565019791083.png)



![picture2](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/picture2-1565019843536.png)

The shared volumes were created to be added in the failover cluster from disks that were part of the Cluster Shared Volume (CVS).

![picture3](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/picture3-1565019886020.png)

As you can see, the Hyper-V Failover Cluster can now be validated.

![picture4](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/picture4-1565019943404.png)


I then installed the prerequisites for SCVMM including SQL Server 2016, Windows ADK (Assessment and Deployment Kit), and Windows PE (Pre-installation Environment), as well as created specific users and groups in the domain. Note that you must run the SCVMM Setup as an administrator. After answering a few questions, I Iaunched the application and connected to the Hyper-V Cluster.


![picture5](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/picture5-1565020033667.png)



![picture6](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/picture6-1565020039994.png)



![picture7](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/picture7-1565020045576.png)

For more detailed information, check out the following:

* [Prestage cluster computer objects in Active Directory Domain Services (ASDS)](https://docs.microsoft.com/en-us/windows-server/failover-clustering/prestage-cluster-adds)     
* [Configuring cluster accounts in Active Directory](https://docs.microsoft.com/en-us/windows-server/failover-clustering/configure-ad-accounts)    
* [Installing System Center Virtual Machine Manager (SCVMM)](http://www.garethjones294.com/installing-system-center-virtual-machine-manager-2016-step-by-step-quick-start-deployment-guide/)  
* [Event ID 1222](https://support.microsoft.com/en-gb/help/2770582/event-id-1222-when-you-create-a-windows-server-2012-failover-cluster)   
	
I hope you found this tutorial helpful in setting up System Center Virtual Machine Manager (SCVMM) in a Microsoft Windows Failover Cluster. Continue to monitor our [blog posts](https://developer.hpe.com/blog) for more hints that you can use to make your development environment more efficient.
