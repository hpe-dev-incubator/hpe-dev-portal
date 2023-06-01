---
title: Automate boot from SAN target configurations using Redfish
date: 2023-06-01T20:13:38.207Z
featuredBlog: false
author: "HPE Global Sales Engineering (GSE) "
authorimage: /img/Avatar5.svg
disable: false
---
As the scale and complexity of infrastructure deployed in a customer environment increases, the need for consistency, ease of management and agility in responding to the changing needs of the infrastructure consumers becomes a key priority for IT staff.  Operational efficiency has become a key business imperative for customers hosting large IT footprint, and the operational efficiency gains are often achieved through automation of repetitive tasks performed by IT staff to deploy, manage, and operate IT infrastructure.

\
There are several use-cases of infrastructure automation that exist, and in this blog post we will address the aspect of configuration of OS boot for a server from a Storage Area Network (SAN) based storage array.  Specifically, we will discuss the   procedure for configuring an HPE ProLiant DL Gen10, Gen10 plus and Gen11 servers to boot from a SAN target Logical Unit Number (LUN) using the Redfish® standard DMTF API. 

Note:

 
•	The steps outlined in this document were tested on HPE DL 380 Gen10 and Gen10 plus servers with Emulex based SN1610E FibreChannel (FC) cards, HPE iLO firmware 2.81 and Service Pack for ProLiant (SPP) available as of March 2023. 

•	 QLogic SN1610Q cards do not support the steps outlined in this document (as of April 2023) However, future firmware releases might enable this Redfish API based configuration method.

# Pre-requisite information


Before we dive into the steps for performing the automation, you will need to gather a few pieces of information, such as

*  HPE iLO Management port ip address and credentials

  * Storage target World Wide Number (WWN) and LUN id.  A storage administrator can typically provide you with this information.


Download and install the [HPE RESTful Interface Tool](https://www.hpe.com/info/resttool)  (version 4.1.0.0 or later) on the system you will initiate the automation actions from.
Once the RESTful Interface tool (referred to as iLOrest in the remainder of the document), you can review the current boot target and their order of execution by following the steps below


`ilorest login <ilo-ip> -u <ilo-user> -p password`

`
ilorest bootorder`


Refer to the [iLOrest documentation](https://hewlettpackard.github.io/python-redfish-utility/#bootorder-command) for more information on this command.