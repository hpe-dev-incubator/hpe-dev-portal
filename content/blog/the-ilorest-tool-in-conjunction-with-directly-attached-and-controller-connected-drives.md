---
title: The iLORest tool in conjunction with Direct-Attached and
  Controller-Connected Drives.
date: 2023-09-30T06:13:14.233Z
author: Rajeevalochana Kallur
authorimage: /img/Avatar1.svg
disable: false
tags:
  - iLORest tool
  - direct-attached
  - NVMe
  - storage controller
  - ilo-restful-api
---

**The iLORest tool in conjunction with Direct-Attached and Controller-Connected Drives.**

**Introduction**

In the domain of data storage and server setups, the method of connecting hard drives holds considerable sway over performance, scalability, and the general operational capabilities. Two prevalent techniques for linking hard drives to a server or storage system include direct-attached and controller-connected setups. This article will delve into a comprehensive examination of these two methodologies, investigating their respective merits, practical applications, and their impact on contemporary computing environments. Additionally, it will focus on examining how the iLORest tool facilitates Drive Firmware (FW) updates in both of these configurations.

**Direct-Attached Drives**

Direct-attached drives, as the name suggests, are storage devices that are directly connected to a server or host system. These drives can be connected using various interfaces, such as SATA (Serial Advanced Technology Attachment), NVMe (Non-Volatile Memory Express), or SAS (Serial Attached SCSI). Let's examine the key aspects of direct attached drives:

1. **Simplicity**: Direct-attached drives are straightforward to set up and manage. They are typically installed inside the server's chassis or externally connected via cables.
2. **Performance**: These drives often offer excellent performance, especially when used in high-speed interfaces like NVMe. They are well-suited for applications that demand low latency and high throughput.
3. **Scalability**: While direct-attached drives are easy to install, their scalability is somewhat limited. Expanding storage capacity often requires physically adding more drives to the server, which may not be suitable for large-scale data storage needs.
4. **Use Cases**: Direct-attached drives are commonly used in small to medium-sized businesses, as well as for specific applications where high-speed local storage is essential, such as gaming servers or databases.

In this specific configuration, iLORest identifies drives that are direct-attached, initiates the upload of the firmware component, and generates a UEFI task to perform the update. The UEFI task is scheduled to execute during the next server reboot, and the firmware update will be carried out at that time as well.

**Controller-Connected Drives**

Controller-connected drives, on the other hand, involve a more complex setup. These drives are connected to a storage controller or RAID (Redundant Array of Independent Disks) controller, which is then connected to the server. This controller manages the storage devices and can offer several advantages:

1. **Scalability**: Controller-connected drives are highly scalable. Storage controllers can handle a large number of drives, allowing for significant storage expansion without the need to clutter the server with additional physical drives.
2. **Data Protection**: Many controller systems offer RAID configurations, which provide data redundancy and protection against drive failures. This is crucial for mission-critical applications and data centers.
3. **Centralized Management**: Storage controllers often come with management interfaces that allow for centralized monitoring, configuration, and maintenance of all connected drives. This simplifies storage administration in large-scale environments.
4. **Use Cases**: Controller-connected drives are commonly used in enterprise environments, data centers, and any scenario where data reliability, scalability, and centralized management are paramount.

In this particular setup, iLORest identifies drives connected to the controller, initiates the upload of the firmware component, and then proceeds to flash it directly using iLO (BMC). In this configuration, there is no necessity to restart the server.

However, if the server incorporates a mix of direct-attached and controller-connected drives, both the direct flashing and UEFI task become essential. Consequently, a reboot is needed to finalize the firmware update process.

**Choosing the Right Attachment Method**

The choice between direct-attached drives and controller-connected drives depends on your specific requirements and use cases. Here are some considerations to guide your decision:

* **Performance vs. Scalability**: If you need high-performance local storage and have a limited number of drives, direct-attached drives may be sufficient. However, if scalability is crucial and data protection is a concern, controller-connected drives are a better choice.
* **Data Redundancy**: For applications where data loss is unacceptable, such as financial systems or healthcare databases, controller-connected drives with RAID configurations offer a higher level of data protection.
* **Cost**: Direct-attached drives are often more cost-effective for small to medium-sized deployments. Controller-connected drives can be more expensive due to the additional hardware required.
* **Management Complexity**: Consider the level of management and administration your storage solution requires. Controller-connected drives offer centralized management but may require more initial setup.

In summary, gaining a comprehensive understanding of how the iLORest tool updates firmware for both direct-attached and controller-connected drives is crucial. This knowledge forms the basis for making well-informed decisions when designing and overseeing your storage infrastructure. Each approach carries its own set of advantages and limitations, and your choice should align with the specific requirements and objectives of your organization. Whether you prioritize aspects such as performance, scalability, data protection, or cost-effectiveness, the selection of the appropriate hard drive attachment method can greatly influence the effectiveness of your IT infrastructure.
