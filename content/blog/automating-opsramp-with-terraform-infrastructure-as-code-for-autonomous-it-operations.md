---
title: "Automating HPE OpsRamp Software with Terraform: Infrastructure as Code
  for autonomous IT operations"
date: 2026-05-25T08:00:00.000Z
author: Enrique Larriba
authorimage: /img/blog_440894421_450_0_72_rgb.jpg
thumbnailimage: /img/dev-stories/dev-story-9.jpg
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

[HPE OpsRamp Software](https://www.hpe.com/us/en/opsramp.html) is a platform for driving autonomous IT operations, providing capabilities such as hybrid observability, AIOps-driven event management, and intelligent automation. It is commonly used by managed service providers (MSPs) and large enterprises as the backbone of their operations and observability teams.

Achieving autonomous IT operations often requires more than automating infrastructure. It also involves automating the configuration of the systems used to monitor and manage that infrastructure.

In HPE OpsRamp Software, this includes components such as service maps, device groups, roles, and permission sets. These configurations often need to be customized for each new client onboarded to the platform.

What if you could define all of this declaratively?

What if onboarding could be fully automated using Infrastructure as Code (IaC)?

I’m Enrique Larriba, a Solutions Architect passionate about HPE OpsRamp Software. In this post, I’ll walk you through the [Terraform Provider for OpsRamp](https://github.com/HPE/terraform-provider-opsramp) and show you how it can help automate and streamline your operations.

## Install

First, ensure you have either [Terraform](https://developer.hashicorp.com/terraform/install) or [OpenTofu](https://opentofu.org/docs/intro/install/) installed.

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

This works across Microsoft Windows, Linux, and Apple macOS.

## Usage

The provider requires an OAuth 2.0 API token to authenticate with the HPE OpsRamp Software. You can generate this token using the custom integration feature.

![Custom integration feature](/img/custom-integration.png "custom integration feature")

Create a project folder and a file named *main.tf*. The OpsRamp platform provides a *tenant_id*, a key (*client_id*, following the OAuth 2.0 standard), and a secret (*client_secret*) to configure the provider.

The permissions granted by these credentials depend on the role assigned during their creation. In this example,  the **Partner Administrator** role is used, but you can restrict access to only the permissions required for your use case.

```hcl
# file: main.tf
terraform {
  required_providers {
    opsramp = {
      source = "registry.terraform.io/HPE/opsramp"
      version = ">=0.1.4"
    }
  }
}

provider "opsramp" {
  client_id     = "00000000000000000000000000000000"
  client_secret = "*****"
  endpoint      = "score.api.opsramp.com"
  tenant        = "00000000-0000-0000-0000-000000000000"
}
```

This configuration allows Terraform or OpenTofu to load the provider for use in subsequent steps.

Run the following command to initialize the project:

```shell
# Terraform
terraform init
# OpenTofu
tofu init
```

#### Simple scenario

Create the following example file. It contains the declaration of a device group. This resource can group VMware virtual machines based on a custom attribute such as `ENV=PROD`.

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

Apply the configuration to create the resources in HPE OpsRamp Software:

```shell
# Terraform
terraform apply
# OpenTofu
tofu apply
```

After running this command, you should see Terraform report that the resource group was created successfully.

![Newly created device groups](/img/captura-de-pantalla-2026-05-19-151401.png "Newly created device groups")

#### Extended scenario

More advanced examples require additional resources. You can automatically create clients, the unit of multitenancy; service maps, roles, users, groups, and more. In the following example, you will deploy three clients with a standardized service map. First, you need to create a module directory that will declare what's needed on each client.

```hcl
# file: modules/client/main.tf
terraform {
  required_providers {
    opsramp = {
      source = "registry.terraform.io/HPE/opsramp"
      version = ">=0.1.4"
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

```hcl
# file: modules/client/variables.tf
variable "client_name" {
  description = "Name of the client to be created"
  type        = string
}
```

Then the main.tf file will use the recently created module for client creation. All these clients will be standardized by populating the template.

```hcl
# file: main.tf
provider "opsramp" {
  client_id     = "00000000000000000000000000000000"
  client_secret = "*****"
  endpoint      = "score.api.opsramp.com"
  tenant        = "00000000-0000-0000-0000-000000000000"
}
module "client_1" {
  source = "./modules/client"
  client_name = "My first client"
}
module "client_2" {
  source = "./modules/client"
  client_name = "My second client"
}
module "client_3" {
  source = "./modules/client"
  client_name = "My third client"
}
```

After applying the configuration, the platform creates all required clients.

![Newly created clients and their standard Service Map](/img/captura-de-pantalla-2026-05-19-162444.png "Newly created clients and their standard Service Map")

## Next steps

Infrastructure as Code enables scalable and repeatable operations. This provider will continue evolving to support more use cases and deeper integration with the HPE OpsRamp Software [API](https://develop.opsramp.com/).

Your feedback and contributions are welcomed. Feel free to open issues, submit feature requests, or contribute directly to the [Terraform Provider for OpsRamp](https://github.com/HPE/terraform-provider-opsramp) repository.

Continue exploring the [HPE Developer Community blog](https://developer.hpe.com/blog/) to learn more about HPE OpsRamp and discover new ways to use it in your daily operations. By learning, sharing, and contributing as a community, we can move closer to fully autonomous IT operations.
