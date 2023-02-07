---
title: Secure containerized and traditional apps concurrently
date: 2021-09-30T08:48:31.534Z
author: Ka Wai Leung & Jason Mashak
authorimage: /img/Avatar1.svg
tags:
  - hpe-ezmeral
  - devops
	- sre
  - site-reliability-engineer
---
**Editor’s Note – HPE Ezmeral Container Platform is now HPE Ezmeral Runtime Enterprise**. For more information on why the name was changed, please [click here](https://community.hpe.com/t5/HPE-Ezmeral-Uncut/HPE-Ezmeral-Container-Platform-is-now-HPE-Ezmeral-Runtime/ba-p/7151720#.YW7nOxrMKM8).
 
- - -

IT Ops teams have run and managed Windows and Linux deployments for years. They are greatly experienced at dealing with the storage, networking, virtual machines and firewalls required for these environments. But container use, and the modern apps with which they are built, continues to gain ground as businesses move from small, proof-of-concept implementations to broader deployments. These modern applications require a whole new set of skills, which many administrative teams are just learning as new technologies, like Kubernetes, come into play.

The best practices used to monitor and guide these implementations continue to evolve, taking these newer technologies into account. One area that continues to crop up as an area of concern is security. Just how does one ensure the security of containerized workloads, especially during a time when they most probably need to co-exist with traditional applications?

## **Centralize security and compliance management with Runecast**

Hewlett Packard Enterprise (HPE) offers the [HPE Ezmeral Container Platform](https://www.hpe.com/us/en/solutions/container-platform.html), which comes integrated with Falco, an open source runtime threat detection engine.  Falco uses community-sourced detection of malicious activity and Common Vulnerabilities and Exposures (CVE) exploits to generate alerts.  In addition, HPE Ezmeral Container Platform also provides a core set of monitoring and alerting capabilities using a combination of Metricbeat data collector, Elasticsearch for search and analytics, and Kibana for dashboard displays. These tools provide IT Ops teams with the metrics they need to monitor traditional applications.

To further enhance the security capabilities on the HPE Ezmeral Container Platform, HPE partnered with [Runecast](https://www.runecast.com/) to offer an analyzer that provides insights to container security compliance and improves the stability of mission-critical IT applications as they migrate to a modern cloud architecture. Organizations can leverage Runecast Analyzer as a central security and compliance management console for both container and non-container environments.

## **Automate audits**

[Runecast Analyzer](https://www.runecast.com/how-does-runecast-analyzer-work) complements the base HPE Ezmeral Container Platform monitoring features with an analysis of best practices and security compliance checks. It does this for container-based workloads as well as workloads running on more traditional platforms; like VMware’s vSphere, vSAN, NSX, Horizon, and VMware Cloud Director. These capabilities are also available for AWS and Microsoft Azure – all from a single interface.

Runecast Analyzer provides continuous analysis of the workload infrastructure. It includes best practices (as detailed by the Cloud Native Computing Foundation, the maintainer of the Kubernetes open-source project) and security compliance checks against the latest benchmark from the Center for Internet Security (CIS). Runecast Analyzer provides full coverage for the entire CIS Benchmark for Kubernetes with 71 individual cross-referenced checks against entire Kubernetes environments, highlighting areas that may need improvement.

![How Runecast works with the HPE Ezmeral Container Platform](/img/runecast.png "How Runecast works with the HPE Ezmeral Container Platform")

With Runecast Analyzer, IT organizations gain a common tool for monitoring VMs, cloud, and HPE Ezmeral Container Platform applications. This shortens the learning curve for IT Ops teams in adopting Kubernetes. It also helps IT administrators deploy and manage VMs, containers, and cloud environments at scale with confidence.

To learn how Runecast helps you monitor and improve the security of your containerized and traditional apps, visit [www.runecast.com](https://urldefense.com/v3/__http:/www.runecast.com__;!!NpxR!20PeQhlxWuRFNki74flD2O5Cb4wduoVPQd30Aso29B0LbmGLbcLmPg9JZ2O3D_ao$). To learn more about Runecast and how it works on HPE Ezmeral, check out the [HPE Ezmeral Container Platform website](https://www.hpe.com/us/en/solutions/container-platform.html) and [technical paper](https://psnow.ext.hpe.com/doc/a50003809enw). To get Runecast Analyzer and run it natively on your HPE Ezmeral Container Platform (now HPE Ezmeral Runtime), go to the [HPE Ezmeral Marketplace](https://www.hpe.com/us/en/software/marketplace.html). For more articles on HPE Ezmeral Container Platform, check out the [HPE DEV blog](https://developer.hpe.com/blog) and [HPE Ezmeral UnCut blog](https://community.hpe.com/t5/HPE-Ezmeral-Uncut/bg-p/software/label-name/containers%20and%20devops#.YVNc4LhKg2w).
