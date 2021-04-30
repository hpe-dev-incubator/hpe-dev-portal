---
title: Introducing the Verified HPE OneView Terraform Provider
date: 2021-04-30T15:17:01.125Z
featuredBlog: false
author: Chrisyopher Pasek
authorimage: /img/Avatar6.svg
tags:
  - hpe-oneview
---
HPE and HashiCorp have worked together to verify the new HPE OneView Terraform Provider. The new provider is based on Terraform v0.13, which will enable users to take full advantage of the improved infrastructure automation capabilities available in the latest versions of the Terraform’s offer. The provider enables users to automate infrastructure through [HPE OneView](https://www.hpe.com/us/en/integrated-systems/software.html), which uses software-defined intelligence via a template-driven approach to automate the deployment, provisioning, updating, and integration of resources, such as compute, storage, and networking infrastructure.

HashiCorp verification of the HPE OneView Terraform Provider based on Terraform v0.13, enables HPE code to be available in the [Terraform Registry](https://registry.terraform.io/providers/HewlettPackard/oneview/latest). The registry enables the initialization of the Terraform Provider for HPE OneView, to be initiated directly from the registry maintained by HashiCorp, by introducing the provider source attribute in Terraform. The verification process also ensures that Provider code is from a reliable source, making automated installation a secure process. In the case of HPE’s OneView Provider, GPG encryption is used to digitally sign HPE code.

Terraform v0.13 is a major update that includes dozens of improvements and features spanning the breadth and depth of Terraform’ s functionality. One of the major changes in Terraform 0.13 is HCL2. HCL2 introduces Rich Data Types as a means to describe more complex structures with your Terraform Modules.\
The Terraform Provider for HPE OneView now uses Go Modules for dependency management and vending. The Terraform Provider for HPE OneView is also an upgrade to the Terraform Plugin SDK.  More details about the Terraform Plugin SDK can be found [here](https://www.terraform.io/docs/extend/guides/v1-upgrade-guide.html).


Terraform Provider for HPE OneView supports several installation paths, it can be installed from Source, Docker container or the Terraform Registry. HPE has produced an [Installation and User Guide](https://github.com/HewlettPackard/terraform-provider-oneview)  to simply migration from HPE OneView Providers based on previous versions of Terraform. The guide provides step by step instructions for each installation path.

For more information: 

[Code Repository and Examples](https://github.com/HewlettPackard/terraform-provider-oneview)\
[HPE OneView SDK Docker Image for Terraform](https://hub.docker.com/repository/docker/hewlettpackardenterprise/hpe-oneview-sdk-for-terraform)
[Installation and User Guide ](https://github.com/HewlettPackard/terraform-provider-oneview)
[HPE OneView](https://www.hpe.com/us/en/integrated-systems/software.html)

[Terraform Registry](https://registry.terraform.io/providers/HewlettPackard/oneview/latest)