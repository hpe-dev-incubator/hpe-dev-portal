---
title: How to provision HPE GreenLake private cloud resources from ServiceNow
  Service Catalog
date: 2022-03-08T06:13:00.000Z
author: Vinnarasu Ganesan, Thavamaniraja S
authorimage: /img/Avatar1.svg
thumbnailimage: /img/thumbnail.jpg
tags:
  - hpe-greenlake
---
## Introduction

A key strength of HPE GreenLake for private cloud is self-service
orchestration and automation, which you do from the HPE GreenLake for
private cloud dashboard and can be consumed using API and IaC. However,
some ServiceNow users prefer to provision resources from the ServiceNow
Service Catalog. For these users, HPE GreenLake for private cloud offers
a free Morpheus plugin for ServiceNow, which they can install from the
ServiceNow Store. After you install and configure the plugin, HPE
GreenLake for private cloud catalog items (In the previous
[blog](https://developer.hpe.com/blog/curate-and-expose-service-catalog-items-using-hpe-greenlake-for-private-cloud/),
we discussed how to curate and expose service catalog items using
HPE GreenLake for private cloud) can be presented in the ServiceNow
Service Catalog for ordering. You turn on this integration by installing
the Morpheus plugin on ServiceNow and sharing the wanted resources
from HPE GreenLake for private cloud. This article walks through the
process of integrating ServiceNow with HPE GreenLake for private cloud
and exposing Service Catalog Items to ServiceNow.

## Prerequisites

The process of integrating HPE GreenLake for private cloud on ServiceNow
needs the following:

* Morpheus plugin on ServiceNow: To obtain and install the Morpheus
  plugin, you must have your HI credentials.

  * Using HI account, search for Morpheus and install the Morpheus
    plugin
* HPE GreenLake for private cloud service user account in the
  sub-tenant: Before you begin the integration process, raise a HPE
  GreenLake support ticket to ensure that support is able to create
  the user in your HPE GreenLake for private cloud environment and
  then share it with you. For details, see [Request for sub-tenant
  service user for ServiceNow
  integration](https://support.hpe.com/hpesc/public/docDisplay?docId=a00092451en_us&page=request-for-subtenant-service-user-for-servicenow-integration.html).

* Private cloud user in ServiceNow: Follow the below procedure to
  create a private cloud user in ServiceNow

  * Log in to ServiceNow as admin user.
  * Create a HPE GreenLake for private cloud user by doing the
    following:

    * Open the Users table and click New
    * Assign the user the following roles:

      * catalog_admin
      * import_transformer
      * itil
      * rest_service
      * x_moda_morpheus_ca.integration (NOTE: You can only
        assign this role after installing the Morpheus plugin.
        If you are creating this user before that, you must go
        back and add this role after installing the plugin.)

## Integrating private cloud on ServiceNow

* From ServiceNow, go to **Morpheus Catalog** and select
  **Properties**
* Configure the following properties:

  * The Morpheus Appliance endpoint: Enter the full URL to your HPE
    GreenLake for private cloud appliance.
  * Username: Enter the name of the HPE GreenLake for private cloud
    Service user(Received from HPE Support) that the Morpheus plugin
    use to connect to the HPE GreenLake Private Cloud API
  * Password: Enter the HPE GreenLake for private cloud Service user
    password (Received from HPE Support).

![](/img/figure1.png)

## Integrating ServiceNow with HPE GreenLake for private cloud

* From HPE GreenLake Central, locate the HPE GreenLake for private
  cloud service card and click the Launch icon to open the HPE
  GreenLake for private cloud dashboard
* Navigate to Administration > Integrations
* From the NEW INTEGRATION drop-down list, select ITSM ServiceNow
* The NEW SERVICENOW INTEGRATION dialog box opens
* From the dialog box, configure the ServiceNow integration parameters

  * Name - Enter the integration name
  * ENABLED - Select to enable consumption of this ServiceNow
    integration in HPE GreenLake for private cloud. The integration
    is enabled by default
  * SERVICE NOW HOST-Enter the ServiceNow instance host URL
    (example: https://your.instance.service-now.com).
  * USER - Enter a ServiceNow user that has below roles

    * catalog_admin
    * itil
    * rest_service
    * import_transformer
    * x_moda_morpheus_ca.integration
  * PASSWORD -- Password of above-mentioned user
  * Optional variables (CMDB CUSTOM MAPPING, CMDB CLASS MAPPING
    DEFAULT CMDB BUSINESS CLASS) not required for this use case
* Click **SAVE CHANGES**

The ServiceNow integration is now displayed in the list of integrations.
Sample integration summary

![](/img/figure2.png)

## Expose private cloud resources to the ServiceNow Service Catalog

After creating catalog items in the HPE GreenLake for private cloud as
discussed in the previous
[blog](https://developer.hpe.com/blog/curate-and-expose-service-catalog-items-using-hpe-greenlake-for-private-cloud/),
the catalog items can be made available to ServiceNow service catalog by
following procedure

* Navigate to Administration > Integrations
* Select the ServiceNow integration
* From the Catalog Items tab, click **+ ADD CATALOG ITEM**
* Select the catalog item using the drop-down and click **SAVE CHANGES**

![](/img/figure3.png)

Below is the sample list of catalog items exposed to the ServiceNow
integration

![](/img/figure4.png)

Now, from ServiceNow, verify the availability of the resources as
follows:

* Log in to ServiceNow to access Service Catalog
* From the Service Catalog, access the Morpheus plugin

![](/img/figure5.png)


* Exposed  HPE GreenLake private cloud resources are now available in
  ServiceNow as Service Catalog

![](/img/figure6.png)


## Provision private cloud resources from ServiceNow

* Click on the service catalog and select the catalog item to order.
  For this example, RDS_MariaDB is chosen

![](/img/figure7.png)

* Click Order Now, after filling in the necessary details. Below is the
  sample order status

![](/img/figure8.png)

* Order is deployed in HPE GreenLake for private cloud

![](/img/figure9.png)

## Summary

With Morpheus plugin integration, Self-Service catalog items from HPE
GreenLake for private cloud can be presented as provisioning options in
the ServiceNow Service Catalog and the user can order and manage private
cloud resources directly from ServiceNow. Hopefully, you found this
tutorial helpful. Stay tuned to the [HPE DEV
blog](https://developer.hpe.com/blog) for more posts on topics like
this.