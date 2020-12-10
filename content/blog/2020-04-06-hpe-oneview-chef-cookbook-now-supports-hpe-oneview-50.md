---
title: "HPE OneView Chef Cookbook now supports HPE OneView 5.0"
date: 2020-04-06T16:38:30.754Z
author: Chris Pasek 
tags: ["hpe-oneview"]
path: hpe-oneview-chef-cookbook-now-supports-hpe-oneview-50
---
The HPE OneView Chef Cookbook 3.2.0 now supports HPE OneView 5.0 (REST API version 1200). The Cookbook provides Chef recipes to interact with HPE OneView and HPE Synergy Image Streamer APIs, enabling IT automation teams to easily build integrations and scalable solutions. By automating the provisioning of physical infrastructure on-demand, using software-defined templates from HPE OneView, this integration allows administrators to create a resource topology and user experience similar to that of a public cloud on their own physical infrastructure. In addition, it significantly increases reliability, compliance, and deployment flexibility. 

Chef recipes configure a series of HPE OneView and HPE Synergy Composable Infrastructure resources to a particular state. They define how the resources are to be configured, which specific versions of software to run, and ensure that software is installed in the correct order, based on dependencies. Chef checks that each resource is properly configured and corrects the configuration of any resources that are not in the desired state. This lets IT organizations streamline the task of configuring and maintaining a company's servers, in addition to enabling integration with cloud-based platforms to automatically provision and configure new machines.

A Chef Cookbook is where a collection of recipes are stored. Each cookbook should relate to a single task, but can have multiple recipes or server configurations stored together. The Chef server stores each of these cookbooks. When a new Chef client node checks in with the server, recipes are sent to tell the node how to configure itself. The client will then check in every now and again to make sure that no changes have occurred and no modifications need to be made. If there is a change, the client will take action to manage the change. Patches and updates can be rolled out over an entire infrastructure simply by changing the recipe, eliminating the need to interact with each machine individually.

Chef is a one of the industry's most popular Infrastructure-as-Code tools. It is based on the Ruby programming language, which can be leveraged to model solutions for complex or custom scenarios. Additional support can be found in Chef’s open-source development community. 

The list of supported resources and changes is available at: 

https://github.com/HewlettPackard/oneview-chef/releases/tag/v3.2.0

The repository with code and examples is available on GitHub at: 

https://github.com/HewlettPackard/oneview-chef

Chef Supermarket details are available at: 

https://supermarket.chef.io/cookbooks/oneview
