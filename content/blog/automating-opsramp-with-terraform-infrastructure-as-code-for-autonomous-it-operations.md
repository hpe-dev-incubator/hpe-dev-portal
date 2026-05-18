---
title: "Automating OpsRamp with Terraform: Infrastructure as Code for Autonomous
  IT Operations"
date: 2026-05-25T08:00:00.000Z
author: Enrique Larriba
authorimage: /img/profilepic_198.png
thumbnailimage: /img/thumbnail.png
disable: false
tags:
  - hpe-opsramp
  - opensource
  - tutorial
  - Terraform
  - OpenTofu
  - OpsRamp
  - OpsRamp API
---
## Introduction

HPE OpsRamp Software is a platform for Autonomous IT Operations, providing capabilities such as hybrid observability, AIOps-driven event management, and intelligent automation. It is commonly used by Managed Service Providers (MSPs) and large enterprises as the backbone of their operations and observability teams.

Achieving Autonomous IT Operations often requires more than automating infrastructure. It also involves automating the configuration of the systems used to monitor and manage that infrastructure.

In OpsRamp, this includes components such as Service Maps, device groups, roles, and permission sets. These configurations often need to be customized for each new client onboarded to the platform.

What if you could define all of this declaratively?

What if onboarding could be fully automated using Infrastructure as Code (IaC)?

In this post, we introduce the \[Terraform Provider for OpsRamp](https://github.com/HPE/terraform-provider-opsramp).

## Install

First, ensure you have either \[Terraform](https://developer.hashicorp.com/terraform/install) or \[OpenTofu](https://opentofu.org/docs/intro/install/) installed.

#### Option 1: Build from source code

Clone the repository and build the provider:

```shell
git clone https://github.com/HPE/terraform-provider-opsramp
cd terraform-provider-opsramp
make install
```

#### Option 2: Download the binary

Alternatively, download the provider binary and place it in the appropriate directory structure expected by Terraform/OpenTofu:

```shell
yourproject/.terraform/providers/<hostname>/<namespace>/<provider>/<version>/<os>_<arch>/<binary>
```

For example:

```shell
yourproject\.terraform\providers\registry.terraform.io\hpe\opsramp\0.1.3\windows_amd64\terraform-provider-opsramp.exe
```

This works across Windows, Linux, and macOS.

## Usage

The provider requires an OAuth 2.0 API token to authenticate with OpsRamp. You can generate this token using the Custom Integration feature. 

![Custom Integration Configuration Panel](/img/custom-integration.png)

Create a project folder and a file named main.tf. Use your API credentials to configure the provider:

```hcl
# file: main.tf
terraform {
  required_providers {
    opsramp = {
      source = "registry.terraform.io/HPE/opsramp"
      version = ">=0.1.3"
    }
  }
}

provider "opsramp" {
  client_id     = "a3MYhKkSA4JR5FNyJDJuuEktsGkdFxmb"
  client_secret = "*****"
  endpoint      = "score.api.opsramp.com"
  tenant        = "02325580-6156-4398-b8b7-f74e31222593"
}
```

This configuration allows Terraform or OpenTofu to load the provider for use in subsequent steps. Let's execute these commands to initialize the project:

```shell
# Terraform
terraform init
# OpenTofu
tofu init
```

#### Simple scenario

Let’s start with a simple example: creating a Device Group. This resource can group VMware virtual machines based on a custom attribute such as `ENV=PROD`.

```hcl
# continue main.tf
resource "opsramp_device_group" "device_group_root" {
  name      = "VMWare Root Group"
}

resource "opsramp_device_group" "device_group_query" {
  parent       = opsramp_device_group.device_group_root.id
  name         = "VMWare Virtual Machines"
  search_query = "nativeType = \"VMWare Virtual Machine\" AND tag['ENV'] = \"PROD\""
}
```

Place this resource definition below the provider block in main.tf. The tool will take care of creating, updating or deleting resources as needed.

Apply the configuration to create the resources in OpsRamp:

```shell
# Terraform
terraform apply
# OpenTofu
tofu apply
```

After running this command, you should see Terraform report that the resource was created successfully.

#### Extended scenario

More complete examples require more resources. We can automatically create clients, the unit of multitenancy; service maps, roles, users, groups, and more. In the following example, we will deploy three clients with a standardized service map. First, we need to create a module directory that will declare what's needed on each client. 

```
# file: modules/client/main.tf
terraform {
  required_providers {
    opsramp = {
      source = "registry.terraform.io/HPE/opsramp"
      version = ">=0.1.3"
    }
  }
}

resource "opsramp_client" "client" {
  name      = var.client_name
  time_zone = "Europe/Paris"
}

resource "opsramp_device_group" "frontend_group" {
  client = opsramp_client.client.unique_id
  name   = "Frontend"
}
resource "opsramp_device_group" "backend_group" {
  client = opsramp_client.client.unique_id
  name   = "Backend"
}
resource "opsramp_device_group" "database_group" {
  client = opsramp_client.client.unique_id
  name   = "Database"
}

resource "opsramp_servicemap" "sm_root" {
  client = opsramp_client.client.unique_id
  name = format("Application - %s", var.client_name)
  type = "Service"
}

resource "opsramp_servicemap" "sm_child1" {
  client = opsramp_client.client.unique_id
  name = "Frontend"
  type = "Resource"
  parent = opsramp_servicemap.sm_root.id
  search_query = "deviceGroups.name = \"Frontend\""
}

resource "opsramp_servicemap" "sm_child2" {
  client = opsramp_client.client.unique_id
  name = "Backend"
  type = "Resource"
  parent = opsramp_servicemap.sm_root.id
  search_query = "deviceGroups.name = \"Backend\""
}

resource "opsramp_servicemap" "sm_child3" {
  client = opsramp_client.client.unique_id
  name = "Database"
  type = "Resource"
  parent = opsramp_servicemap.sm_root.id
  search_query = "deviceGroups.name = \"Database\""
}
```

This module uses `client_name` as an input variable to parameterize each client configuration. Create a variables.tf file within your module:

```
# file: modules/client/varibles.tf
variable "client_name" {
  description = "Name of the client to be created"
  type        = string
}
```

Then the main.tf file will use our recently created module for client creation. All these clients will be standardized by populating the template.

```
# file: main.tf

module "client_1" {
  source = "./modules/client"
  name = "My first client"
}

module "client_2" {
  source = "./modules/client"
  name = "My second client"
}

module "client_3" {
  source = "./modules/client"
  name = "My third client"
}
```

After applying the configuration, the platform creates all required clients with the specified configuration.

## Next steps

Infrastructure as Code enables scalable and repeatable operations. This provider will continue evolving to support more use cases and deeper integration with the OpsRamp API.

We welcome your feedback and contributions. Feel free to open issues, submit feature requests, or contribute directly to the repository.

Together, we can move closer to fully Autonomous IT Operations.