---
title: How to provision HPE GreenLake for Private Cloud Enterprise resources
  from the ServiceNow Service Catalog
date: 2022-03-08T06:13:00.000Z
author: Vinnarasu Ganesan, Thavamaniraja S
authorimage: /img/Avatar1.svg
thumbnailimage: /img/thumbnail.jpg
tags:
  - hpe-greenlake
  - hpe-greenlake-for-private-cloud-enterprise
---
**Editor’s Note – NAME CHANGE: HPE GreenLake for Private Cloud is now part of HPE GreenLake for Private Cloud Enterprise.**

- - -

## Introduction

A key strength of HPE GreenLake for private cloud is its self-service
orchestration and automation, which is done from the HPE GreenLake for
private cloud dashboard and can be consumed using API and Infrastructure-as-Code (IaC). However,
some ServiceNow users prefer to provision resources from the ServiceNow
Service Catalog. For these users, HPE GreenLake for private cloud offers
a free Morpheus plugin for ServiceNow, which can be installed from the
ServiceNow Store. Once the plugin is installed and configured, HPE
GreenLake for private cloud [catalog items](https://developer.hpe.com/blog/curate-and-expose-service-catalog-items-using-hpe-greenlake-for-private-cloud)
can be presented in the ServiceNow
Service Catalog for ordering. 

This article walks through the
process of integrating ServiceNow with HPE GreenLake for private cloud
and exposing Service Catalog items to ServiceNow.

## Prerequisites

<!--StartFragment-->

The process of integrating HPE GreenLake for private cloud on ServiceNow requires different things depending on your environment. In any case, you will need the Morpheus plugin on ServiceNow, HPE GreenLake for private cloud service user account and Private cloud user in ServiceNow. 

#### Install the Morpheus plugin

To obtain and install the Morpheus plugin, you must have your HI credentials. Using your HI account, simply search for Morpheus and install the Morpheus plugin.

#### Private cloud service user account

Before you begin the integration process, raise a ticket on HPE GreenLake support to create a service user in your HPE GreenLake for private cloud environment. For details, see [Request for sub-tenant service user for ServiceNow integration](https://support.hpe.com/hpesc/public/docDisplay?docId=a00092451en_us&page=request-for-subtenant-service-user-for-servicenow-integration.html).

#### Private cloud user in ServiceNow

Using ServiceNow admin user, create a HPE GreenLake for private cloud user in ServiceNow with the below roles:

* catalog_admin
* import_transformer
* itil
* rest_service
* xmodamorpheus_ca.integration *(NOTE: You can only assign this role after installing the Morpheus plugin. If you are creating this user before that, you must go back and add this role after installing the plugin.)*

<!--EndFragment-->

## Integrating private cloud on ServiceNow

Configure Morpheus properties in ServiceNow with the following parameters:

* The Morpheus Appliance endpoint: Enter the full URL to your HPE
  GreenLake for private cloud appliance
* Username: Enter the name of the HPE GreenLake for private cloud
  Service user (Received from HPE Support) that the Morpheus plugin
  used to connect to the HPE GreenLake Private Cloud API
* Password: Enter the HPE GreenLake for private cloud Service user
  password (Received from HPE Support)

![](/img/figure1.png)

## Integrating ServiceNow with HPE GreenLake for private cloud

<!--StartFragment-->

Navigate to *Administration > Integrations > +New Integration > ITSM> ServiceNow* in the HPE GreenLake for private cloud portal.

Configure ServiceNow integration with the below parameters:

* Name - Enter the integration name
* ENABLED - Select to enable consumption of this ServiceNow integration in HPE GreenLake for private cloud. The integration is enabled by default
* SERVICE NOW HOST-Enter the ServiceNow instance host URL (example: [https://your.instance.service-now.com](https://your.instance.service-now.com/)).
* USER - Enter a ServiceNow user created as part of pre-requistes
* PASSWORD - Password of the above-mentioned user
* Optional variables (CMDB CUSTOM MAPPING, CMDB CLASS MAPPING DEFAULT CMDB BUSINESS CLASS) not required for this use case
* Click SAVE CHANGES

![](/img/figure10.png)

The ServiceNow integration is now displayed in the list of integrations. 

Sample of the ServiceNow integration summary:

<!--EndFragment-->

![](/img/figure2.png)

## Expose private cloud resources to the ServiceNow Service Catalog

After creating catalog items in the HPE GreenLake for private cloud as
discussed in the previous
[blog](https://developer.hpe.com/blog/curate-and-expose-service-catalog-items-using-hpe-greenlake-for-private-cloud/),
the catalog items can be made available to ServiceNow Service Catalog by
following procedure:

* Navigate to Administration > Integrations
* Select the ServiceNow integration
* From the Catalog Items tab, click + ADD CATALOG ITEM
* Select the catalog item using the drop-down and click SAVE CHANGES

![](/img/figure3.png)

Below is the sample list of catalog items exposed to the ServiceNow
integration:

![](/img/figure4.png)

Now, from ServiceNow, verify the availability of the resources as
follows:

* Log in to ServiceNow to access the Service Catalog
* From the Service Catalog, access the Morpheus plugin

![](/img/figure5.png)

Exposed HPE GreenLake private cloud resources are now available in the Self-Service Service Catalog.

![](/img/figure6.png)

## Provision private cloud resources from ServiceNow

Click on the service catalog and select the catalog item to order.
  For this example, RDS_MariaDB is chosen.

![](/img/figure7.png)

Click Order Now, after filling in the necessary details. Below is the
  sample order status.

![](/img/figure8.png)

Order is deployed in HPE GreenLake for private cloud.

![](/img/figure9.png)

## Summary

With Morpheus plugin integration, Self-Service catalog items from HPE
GreenLake for private cloud can be presented as provisioning options in
the ServiceNow Service Catalog and the user can order and manage private
cloud resources directly from ServiceNow. Hopefully, you found this
tutorial helpful. Stay tuned to the [HPE DEV
blog](https://developer.hpe.com/blog) for more posts on topics like
this.