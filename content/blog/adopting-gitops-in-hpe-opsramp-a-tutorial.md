---
title: "Adopting GitOps in HPE OpsRamp: a tutorial"
date: 2026-07-01T07:00:00.000Z
author: Jorge Martínez López
authorimage: /img/j-final5-square.jpg
disable: false
tags:
  - hpe-opsramp
  - opensource
  - terraform
  - opentofu
  - git
  - tutorial
---
## Introduction

Our HPE colleague Enrique Larriba wrote an excellent post on [automating HPE OpsRamp using Terraform Infrastructure as Code](https://developer.hpe.com/blog/automating-opsramp-with-terraform-infrastructure-as-code-for-autonomous-it-operations/). Customers successfully adopting this practice will benefit from the speed and consistency of deploying configuration declaratively, but will face two challenges in their adoption journey:

1. Unless the configuration is used for a one-off provisioning activity, they will need to maintain a ''golden'' configuration as source of truth.
2. Users running provisioning and configuration activities will need to share the state file that represents the infrastructure that has been built using OpenTofu / Terraform. This state file contains secrets and sensitive information so the file will need to be stored in a secure location.

Fortunately, the first challenge has already been resolved by version control solutions such as Git. The second one can be resolved by setting up a secure file repository.

This post is a tutorial on how to set up a basic GitOps environment with GitHub as configuration and secret version-controlled repository and Amazon Web Services (AWS) S3 as shared storage for the state file.