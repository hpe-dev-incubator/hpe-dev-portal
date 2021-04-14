---
title: test denis
date: 2021-04-14T13:18:18.972Z
author: test denis
authorimage: /img/Avatar1.svg
tags:
  - hpedev
---
## Introduction

HPE GreenLake for private cloud is one of the cloud services powered by the HPE GreenLake Central platform. This service provides a cloud experience to manage virtual machines (VMs) in your on-premises, pay-per-use datacenter. It is an integrated solution comprised of HPE optimized hardware and software, fully managed by HPE. The solution provides rich application management capabilities for cloud-native and traditional applications along with a self-service portal and integrates with a lot of popular automation tools such as Ansible, Chef, Puppet, and others. This article explains how to integrate your existing Chef automation platform, Chef Infra, with HPE GreenLake for private cloud to help improve efficiency and minimize errors caused by manual configuration. And the tutorial walks you through the step-by-step process for two use case scenarios: 


* Scenario 1: Add Chef automation integration, and provision a new application instance (i.e. Ngnix) bootstrapped to an integrated Chef Infra server using HPE GreenLake for private cloud self-service user interface (UI). 

* Scenario 2: Bootstrap an existing VM instance to the integrated Chef infra server using the HPE GreenLake for private cloud automation feature Tasks.


Before we dive into the use cases, let me give you an overview of Chef and its prerequisites before any integration with HPE GreenLake for private cloud.
