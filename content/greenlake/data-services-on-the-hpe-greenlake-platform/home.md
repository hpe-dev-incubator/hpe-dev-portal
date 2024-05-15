---
title: Data Services on the HPE GreenLake platform
version: 1.0.0
description: The landing page for all Storage BU related SaaS and cloud services
  with future unified API in the plan
image: /img/greenlake/dscc-icon-transparent.png
width: large
priority: 1
active: true
tags:
  - data-services-on-the-hpe-greenlake-platform
  - data-services-cloud-console
---
<style> li { font-size: 27px; line-height: 33px; max-width: none; } </style>


Data Services on the HPE GreenLake edge-to-cloud platform is a group of services which are part of the service catalogues in the HPE GreenLake edge-to-cloud Platform. These services bring the cloud experiences to HPE GreenLake customers, wherever the data lives, across on-premises or public cloud throughout its lifecycle. With the streamlined ordering, provisioning, management, protection, analysis, and archiving, customers can achieve higher agility to innovate using latest trend in I.T. such as artificial intelligence. For more information on how to leverage these Data Services on the HPE GreenLake edge-to-cloud platform, please visit HPE Data Management [website](https://www.hpe.com/us/en/storage/data-services-cloud-console.html).

## Introduction to Data Services on the HPE GreenLake edge-to-cloud platform

There are two major categories of services from Data Services on the HPE GreenLake edge-to-cloud platform: 

1. **Infrastructure Platform suites** for the HPE Storage family (for more info [visit](https://www.hpe.com/us/en/greenlake/storage.html) HPE GreenLake for Data Storage) to enable configuration, management, monitor and optimization of HPE Alletra Storage families for block, file, and object datas. These services known as the [HPE GreenLake Data Ops Manager](https://www.hpe.com/us/en/hpe-greenlake-compute-ops-management.html), [HPE GreenLake for Block Storage](https://www.hpe.com/us/en/hpe-greenlake-block-storage.html), [HPE GreenLake for File Storage](https://www.hpe.com/us/en/hpe-greenlake-file-storage.html), and [HPE GreenLake for Storage Fabric Management.](https://www.hpe.com/us/en/hpe-greenlake-storage-fabric-management.html)
2. **Cloud Data Services suites** for hybrid cloud workload lifecycle management, to enable data protection, to provide disaster recovery, to deploy self-service hybrid cloud, and to enable infrastructure analysis. These services known as [HPE GreenLake for Backup and Recovery](https://www.hpe.com/us/en/hpe-greenlake-backup-recovery.html), [HPE GreenLake for Private Cloud Business Edition](https://www.hpe.com/us/en/hpe-greenlake-private-cloud-business-edition.html), and [HPE GreenLake for Disaster Recovery](https://www.hpe.com/us/en/hpe-greenlake-disaster-recovery.html).

![HPE GreenLake Data Services Catalogue](/img/data-services-catalogues.png)

*The above figure displays the list of the services that are part of the Data Services on the [HPE GreenLake edge-to-cloud platform](https://support.hpe.com/hpesc/public/docDisplay?docId=a00120892en_us&page=index.html)*

## Data Services REST APIs

### The history

In **November 2021**, after the release of the HPE GreenLake edge-to-cloud platform, Data Services introduce the first set of APIs to manipulate resources made available under HPE GreenLake Data Ops Manager. Today, this set of API was expanded to include Block Storage, File Storage services, and current storage Family of HPE Primera, Nimble Gen5, and Alletra (6K,9K,MP). This set of APIs, was associated with **Infrastructure Platform suites**, also known as the **Data Services Cloud Console API v1.5 (March 2024)**. This existing API conforms to the **OpenAPI Standard 3.0** specification, and the spec file can be downloaded in **either YAML or JSON OpenAPI Specification** from the following [website](https://console-us1.data.cloud.hpe.com/doc/api/v1/). The blog posts about getting started with this set of existing APIs is available in this [HPE Developer Forum](https://developer.hpe.com/blog/getting-started-with-the-hpe-data-services-cloud-console-public-rest-api/). There are also additional blog posts that contains information such as [authentication using OAuth 2.0](https://developer.hpe.com/blog/oauth2-for-hpe-greenlake-data-services-cloud-console/) to generate the required [access token](https://developer.hpe.com/blog/getting-started-with-the-hpe-data-services-cloud-console-public-rest-api/), [using openapi-generator-cli](https://developer.hpe.com/blog/get-started-building-dscc-api-client-libraries-for-python-using-openapi-generator/) to convert the DSCC API OpenAPI Specifications to [PowerShell](https://developer.hpe.com/blog/getting-started-with-the-hpe-data-services-cloud-console-powershell-sdk/) and [Python client Library](https://developer.hpe.com/blog/get-started-building-dscc-api-client-libraries-for-python-using-openapi-generator/), a [PowerShell toolkit](https://developer.hpe.com/blog/new-powershell-toolkit-available-for-managing-hpe-data-services-cloud-console/) and [an example of ansible playbooks](https://developer.hpe.com/blog/automating-operations-on-dscc-using-ansible-playbooks/) to manage this storage sources.

### The current family of the APIs

With the announcements of additional API support for the Data Services suites on the HPE GreenLake edge-to-cloud platform in **March 2024**, Cloud Data Services introduce a family of API sets to expand the support of Data Services such as HPE GreenLake for Backup and Recovery and HPE GreenLake for Private Cloud Business Edition. These sets of API conforms to the **OpenAPI Standard 3.1** specification, and it can be downloaded in **JSON OpenAPI Specification** file from the [HPE GreenLake developer website](https://developer.greenlake.hpe.com/docs/greenlake/services/). These later API sets use the same authentication as the existing API (OAuth 2.0 Client Credential) and the same access token for all services inside a HPE GreenLake region. There are blog posts that introduce the new API sets, and tips to use available OpenAPI tool to convert the OpenAPI spec 3.1 to 3.0 so that the spec can be converted using the open-source openapi-generator into client-Libraries of multiple scripting languages.

### The new set of Data Services APIs

This set of APIs family are broken down into different groups:

1. **Data Services :** Group of APIs to accommodate common resources used for both Data Services and Infrastructure Platform suites such as Task List (Asynchronous Operations), Dual Authorization, Issues, Settings, Storage Locations, and displaying DSCC Tags
2. **Virtualization :** Group of APIs to accommodate common interaction with both on-premises and public cloud Hyper-Visors such as registration of VMware vCenter or AWS account, discovery of virtual machines or AWS EC2 instance, migration of virtual machines and many others use cases.
3. **Backup and Recovery :** Group of APIs designed to deploy and register the Data Orchestrator, the Protection Store Gateway, to create protection policy for VM, DataStores, Volumes, Microsoft SQL Server, AWS EC2, AWS EBS, and many other use cases in HPE GreenLake for Backup and Recovery.
4. **Private Cloud Business Edition :** Group of APIs designed to view inventory of a DHCI 2.0, SimpliVity, or Azure cloud account, to perform upgrades for Storage software, hyper-Visor software, to add, update delete provisioning policies and many other use cases in HPE GreenLake for Private Cloud Business Edition.

### The new documentation about the family of Data Services APIs

This is the pivoting point for the HPE GreenLake APIs for Data Services on the HPE GreenLake edge-to-cloud platform where HPE GreenLake user’s clients for API can perform more complex automation that involves all categories of services made available in the Data Services on HPE GreenLake edge-to-cloud platform. To accommodate the documentation for the combination of multiple sets of APIs, the HPE GreenLake documentation about the data services APIs had been updated to provide directions on how to access the family of the HPE GreenLake API for Data Services on HPE GreenLake edge-to-cloud platform shown in this [link](https://support.hpe.com/hpesc/public/docDisplay?docId=sd00003533en_us&page=ps_api_dscc.html). The help menu inside the HPE GreenLake for those data services as of March 2024 was also updated as shown below.

![HPE data services help menu after the update](/img/the-link-to-the-documentation-of-all-hpe-gl-apis-for-data-services-on-hpegl.png)

*The above figure shows the link that was added to points to the collection of the HPE GreenLake APIs for Data Services on HPE GreenLake platform which points further to the Help Menu for using the API.*

![Using the API links to the GL API for the family of data services](/img/landing-page-that-describes-all-of-the-rest-api-for-data-services-on-hpegl.png)

*The above figure shows the links to each set of HPE GreenLake APIs part of the family of Data Services on the HPE GreenLake platform.*

### The future for Data Services APIs

In the future, there will be some more sets of HPE GreenLake APIs related to the additional Data Services published at the HPE GreenLake Developer Website that conform with OpenAPI 3.1 specification. Furthermore, the Data Services Cloud Console API will eventually be published to conform to the OpenAPI 3.1 specifications just as the rest of the sets of OpenAPI specs. To accommodate powerful and comprehensive DataOps use cases such as presented in this blog [post](https://developer.hpe.com/blog/getting-started-with-hpe-greenlake-api-for-virtualization/) and another blog [post](https://developer.hpe.com/blog/getting-started-with-hpe-greenlake-api-for-backup-and-recovery/), the combination of multiple HPE GreenLake APIs from different sets of Data Services on HPE GreenLake platform has been used. 

### Learn more about the Data Services APIs

For getting started with the Data Services APIs and improve your agility in managing your data, please look at the following blog posts, Data Services documentation, and the video of the Developer Forum webinar in the HPE YouTube channel.

1. Blog [post](https://developer.hpe.com/blog/getting-started-with-hpe-greenlake-api-for-data-services/): Getting Started with HPE GreenLake APIs for Data Services.
2. Blog [post](https://developer.hpe.com/blog/getting-started-with-hpe-greenlake-api-for-virtualization/): Getting Started with HPE GreenLake APIs for Virtualization.
3. Blog [post](https://developer.hpe.com/blog/getting-started-with-hpe-greenlake-api-for-backup-and-recovery/): Getting Started with HPE GreenLake APIs for HPE GreenLake for Backup and Recovery
4. Future blog post: Getting Started with HPE GreenLake APIs for HPE GreenLake Private Cloud Business Edition.
5. The [link](https://support.hpe.com/hpesc/public/docDisplay?docId=sd00003533en_us&page=ps_api_dscc.html) to the documentation of the HPE GreenLake APIs at HPE GreenLake help menu.
6. The [link](https://www.youtube.com/watch?v=3ZZVwtyunaA&list=PLtS6YX0YOX4f5TyRI7jUdjm7D9H4laNlF) to the YouTube video of the Meetup webinar “The data services family of APIs for HPE GreenLake – Putting it all together” 

<iframe width="560" height="315" src="https://www.youtube.com/embed/3ZZVwtyunaA?si=zIoTTaUvf1WhCKVF" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

### Any questions on HPE GreenLake APIs for Data Services on HPE GreenLake platform?

Join the HPE Developer Community Slack [Workspace](https://developer.hpe.com/slack-signup/), and start a discussion in our [\#hpe-greenlake-data-services](https://hpedev.slack.com/archives/C02D6H623JP) Slack channel.