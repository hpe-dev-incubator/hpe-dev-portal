---
title: "HPE OneView 5.4 Ecosystem SDKs introduce new methods for ILO configuration and default API versioning"
date: 2020-10-13T18:55:34.129Z
author: Chris Pasek 
tags: ["hpe-oneview","devops","automation"]
path: hpe-oneview-54-ecosystem-sdks-introduce-new-methods-for-ilo-configuratio
---
HPE OneView Ecosystem SDKs ([Ansible](https://github.com/HewlettPackard/oneview-ansible), [Python](https://github.com/HewlettPackard/oneview-python), [Golang](https://github.com/HewlettPackard/oneview-golang), [Terraform](https://github.com/HewlettPackard/terraform-provider-oneview/releases/tag/v1.3.0), [Chef](https://github.com/HewlettPackard/oneview-chef), [Puppet](https://github.com/HewlettPackard/oneview-puppet), [PowerShell](https://github.com/HewlettPackard/POSH-HPOneView) and [Ruby](https://github.com/HewlettPackard/oneview-sdk-ruby)) now support  HPE OneView 5.4 (REST API version 2000). Each release introduces time savings and error reduction enhancements. 

With the latest release of the HPE OneView PowerShell library, you can now configure iLO settings through HPE OneView server profiles and server profile templates. This release adds ILO helper Cmdlets New-OVServerProfileIloPolicy, New-OVIloLocalUserAccount and New-OVIloDirectoryGroup for server profiles and server profile templates, which enable the configuration of ILO settings and eliminate the need for a separate login into the ILO to apply the necessary settings. 

The newest releases of Ansible, Python, Golang, Terraform, Chef, Puppet and Ruby SDKs introduce an enhanced method to set the default API version to the appliance’s max API version. This ensures that valid API settings are used as default settings, eliminating a potential source of error.

HPE OneView Python v5.4.0 and HPE OneView Ansible Module v5.8.0 introduce a breaking change from the previous SDK version. From this version onwards, the previous hpOneView module name has been renamed to hpeOneView. All HPE OneView libraries and examples will import the hpeOneView module as a parent for both SDKs. 

HPE OneView SDKs enable the automation of provisioning of physical infrastructure on-demand using software-defined templates from HPE OneView. This enables active and reactive monitoring and automated deployments, in addition to the provisioning of networks, storage and server infrastructure. You can also use these SDKs to develop a resource topology similar to that of a public cloud on physical infrastructure. This provides public cloud-like “node management”, with the extra flexibility to directly configure underlying infrastructure when needed.  

To simplify installation and maintenance for container environments, HPE OneView 5.4 SDKs are available as Docker images.  [Ansible](https://hub.docker.com/repository/docker/hewlettpackardenterprise/hpe-oneview-sdk-for-ansible) , [Terraform](https://hub.docker.com/repository/docker/hewlettpackardenterprise/hpe-oneview-sdk-for-terraform) , [Chef](https://hub.docker.com/repository/docker/hewlettpackardenterprise/hpe-oneview-sdk-for-chef) , [Puppet](https://hub.docker.com/repository/docker/hewlettpackardenterprise/hpe-oneview-sdk-for-puppet) , [Python](https://hub.docker.com/repository/docker/hewlettpackardenterprise/hpe-oneview-sdk-for-python) , [Golang](https://hub.docker.com/repository/docker/hewlettpackardenterprise/hpe-oneview-sdk-for-golang) and [Ruby](https://hub.docker.com/repository/docker/hewlettpackardenterprise/hpe-oneview-sdk-for-ruby) SDKs are now all available on Docker Hub. All prerequisite materials are incorporated into the container images to enable streamlined deployment to simplify maintenance, improve infrastructure agility, and reduce costs.

## For more information:

[HPE OneView on the HPE DEV platform site](https://developer.hpe.com/platform/hpe-oneview/home)

| SDK  | GitHub   | Docker Hub  | 
| -----  | ------ | ------- |
| Ansible | [HPE OneView Ansible Module v5.8.0](https://github.com/HewlettPackard/oneview-ansible/releases/tag/v5.8.0) | [HPE OneView SDK Docker Image for Ansible](https://hub.docker.com/repository/docker/hewlettpackardenterprise/hpe-oneview-sdk-for-ansible) |
| Terraform | [HPE OneView Terraform Provider v1.5.0](https://github.com/HewlettPackard/terraform-provider-oneview/releases/tag/v1.5.0) | [HPE OneView SDK Docker Image for Terraform](https://hub.docker.com/repository/docker/hewlettpackardenterprise/hpe-oneview-sdk-for-terraform) |
| Chef | [HPE OneView Chef Cookbook v3.6.0](https://github.com/HewlettPackard/oneview-chef/releases/tag/v3.6.0) | [HPE OneView SDK Docker Image for Chef](https://hub.docker.com/repository/docker/hewlettpackardenterprise/hpe-oneview-sdk-for-chef) |
| Puppet | [HPE OneView Puppet Module v2.8.0](https://github.com/HewlettPackard/oneview-puppet/releases/tag/v2.8.0) | [HPE OneView SDK Docker Image for Puppet](https://hub.docker.com/repository/docker/hewlettpackardenterprise/hpe-oneview-sdk-for-puppet) |
| Python | [HPE OneView Python SDK v5.4.0](https://github.com/HewlettPackard/oneview-python/releases/tag/v5.4.0) | [HPE OneView SDK Docker Image for Python](https://hub.docker.com/repository/docker/hewlettpackardenterprise/hpe-oneview-sdk-for-python) |
| Golang | [HPE OneView Golang SDK v1.6.0](https://github.com/HewlettPackard/oneview-golang/releases/tag/v1.6.0) | [HPE OneView SDK Docker Image for Golang](https://hub.docker.com/repository/docker/hewlettpackardenterprise/hpe-oneview-sdk-for-golang) |
| Ruby | [HPE OneView Ruby SDK v5.16.0](https://github.com/HewlettPackard/oneview-sdk-ruby/releases/tag/v5.16.0)  | [HPE OneView SDK Docker Image for Ruby](https://hub.docker.com/repository/docker/hewlettpackardenterprise/hpe-oneview-sdk-for-ruby) |
| PowerShell | [HPE OneView PowerShell module v5.40.2551.2353](https://github.com/HewlettPackard/POSH-HPEOneView/releases/tag/v5.40.2551.2353) |   |
