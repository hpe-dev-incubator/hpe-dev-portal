---
title: Using the hpegl and Morpheus Terraform Providers to provision a VMaaS workload
date: 2025-01-15T14:58:20.593Z
author: Eamonn O'Toole, John Lenihan
authorimage: /img/head-shot.jpg
disable: false
tags:
  - hpegl
  - PCE
  - Morpheus
  - GreenLake
  - HCL
  - Terraform
  - OpenTofu
  - VMaaS
  - hpe-greenlake-for-private-cloud-enterprise
---
<style> li { font-size: 27px; line-height: 33px; max-width: none; } </style>

# **Introduction**

Many customers of HPE GreenLake for Private Cloud Enterprise want to use [Terraform](https://www.terraform.io/) or the open-source alternative [OpenTofu](https://opentofu.org/) to create, provision and manage VMaaS (Virtual Machines as a Service, a service offering in HPE GreenLake for Private Cloud Enterprise) VMs. The cloud-based VMaaS service interacts with [Morpheus](https://morpheusdata.com/) (recently acquired by HPE) running on-premise which provides the core Virtual Machine functionality. There is a HPE GreenLake Terraform provider called *[hpegl](https://registry.terraform.io/providers/HPE/hpegl/latest)* (HPE GreenLake) and a separate [Morpheus](https://registry.terraform.io/providers/gomorpheus/morpheus/latest) provider. Both providers complement each other and when used in concert offer a rich set of IaC capabilities.

In this blog post we will demonstrate how to use the two providers in concert to create, provision and manage VMaaS VM instances. Central to this is a hpegl data-source which can be used to retrieve an Access Token and URL for the on-premise Morpheus instance which are then passed to the Morpheus provider.

# **IaC and HPE GreenLake Private Cloud Enterprise**

[IaC](https://en.wikipedia.org/wiki/Infrastructure_as_code) (Infrastructure as Code) is a well-established approach to configuring, creating, and managing resources. Terraform and its OpenSource alternative OpenTofu, along with per-service providers, are especially popular. For HPE GreenLake for Private Cloud Enterprise's VMaaS (VM as a Service) service, there are two relevant providers: 

* hpegl (HPE GreenLake), which interacts with the HPE GreenLake for Private Cloud Enterprise Services such as Identity and Access Management (IAM) and VMaaS 
* Morpheus, which interacts with the on-premise Morpheus instance or instances that are associated with the VMaaS service.  Each Morpheus instance is a separate on-premise installation of Morpheus 

These two providers complement each other: 

* hpegl deals with HPE GreenLake IAM and manages VMaaS resources, including VM instances 
* Morpheus deals with underlying Morpheus resources on which the VMaaS resources – including VM instances – depend. This covers resources such as Clouds, VM images, Node Types, Groups, Instance Types, and Instance Layouts. 

The glue between these two providers is a hpegl *data source* called *hpegl_vmaas_morpheus_details*. For a specific VMaaS *location*, this data source will output: 

* A Morpheus access token. 
* The URL of the Morpheus instance. 
* The time to expiry of the access token (in seconds). 

The first two outputs can then be passed into a Morpheus provider stanza. See the following example where there is just one *location* for a VMaaS instance:

```hcl
provider "hpegl" {
  vmaas {
    location   = var.location
    space_name = var.space
  }
}

data "hpegl_vmaas_morpheus_details" "morpheus_details" {}

provider "morpheus" {
  url          = data.hpegl_vmaas_morpheus_details.morpheus_details.url
  access_token = data.hpegl_vmaas_morpheus_details.morpheus_details.access_token
}
```

For VMaaS instances with multiple locations *provider aliasing* can be used to tie a specific VMaaS *location* to the corresponding Morpheus instance:

```hcl
# Location 1
provider "hpegl" {
  vmaas {
    location   = var.location_1
    space_name = var.space_1
  }

  alias = "location_1"
}

data "hpegl_vmaas_morpheus_details" "location_1" {
  provider = hpegl.location_1
}

provider "morpheus" {
  url          = data.hpegl_vmaas_morpheus_details.location_1.url
  access_token = data.hpegl_vmaas_morpheus_details.location_1.access_token

  alias = "morpheus_location_1"
}


# Location 2
provider "hpegl" {
  vmaas {
    location   = var.location_2
    space_name = var.space_2
  }

  alias = "location_2"
}

data "hpegl_vmaas_morpheus_details" "location_2" {
  provider = hpegl.location_2
}

provider "morpheus" {
  url          = data.hpegl_vmaas_morpheus_details.location_2.url
  access_token = data.hpegl_vmaas_morpheus_details.location_2.access_token

  alias = "morpheus_location_2"
}
```

# **Complete examples for One VMaaS location**

In the next two sections we present complete HCL examples for two configurations each with one VMaaS location: 

* One VMaaS Cloud, with one VMaaS instance 
* Two VMaaS Clouds, each with one VMaaS instance for a total of two VMaaS instances 

 The clouds are VMware vSphere clouds.  In both cases: 

* hpegl is used to: 

  * Define the VMaaS location and space 
  * Retrieve the relevant Morpheus Token and URL 
  * Retrieve details for the VMaaS Datastore, Network, Resource Pool, Plan, Environment and Cloud Folder 
  * Create a VMaaS instance 
* Morpheus is used to: 

  * Retrieve details for the VMaaS Cloud 
  * Create a Group for the above cloud 
  * Create an Instance Type 
  * Retrieve details for a VM Image 
  * Create a Node Type for the VM Image 
  * Create an Instance Layout for the above Node Type and Instance Type 

## **One location/One VMaaS Cloud/One VMaaS Instance example**

![](/img/hpegl-and-morpheus-terraform-blog-post-frame-1-1-.jpg)

### HCL

[View the example HCL](https://github.com/hpe-dev-incubator/GLP-API-Tooling/tree/main/Terraform/HPEGL-Morpheus-PCE-VMaaS/One-Location/One-Cloud-One-Instance/1_location_1_cloud)

### The output from a Terraform run (v1.5.7) to create the VMaaS Instance:

```shellsession
➜  1_location_1_cloud git:(blog1) ✗ terraform apply -var-file variables_tenant.tfvars -auto-approve
data.hpegl_vmaas_environment.env: Reading...
data.hpegl_vmaas_network.blue_segment: Reading...
data.hpegl_vmaas_plan.g1_large: Reading...
data.hpegl_vmaas_morpheus_details.morpheus_details: Reading...
data.hpegl_vmaas_plan.g1_large: Read complete after 0s [id=407]
data.hpegl_vmaas_network.blue_segment: Read complete after 0s [id=14]
data.hpegl_vmaas_environment.env: Read complete after 1s [id=1]
data.hpegl_vmaas_morpheus_details.morpheus_details: Read complete after 2s [id=94de0616-db52-4737-8afe-aeef618db00b]
data.morpheus_cloud.cloud: Reading...
data.morpheus_virtual_image.example_virtual_image: Reading...
data.morpheus_cloud.cloud: Read complete after 2s [name=HPE GreenLake VMaaS Cloud-Trial3]
data.hpegl_vmaas_datastore.c_3par: Reading...
data.hpegl_vmaas_resource_pool.cl_resource_pool: Reading...
data.hpegl_vmaas_cloud_folder.compute_folder: Reading...
data.hpegl_vmaas_resource_pool.cl_resource_pool: Read complete after 0s [id=3]
data.hpegl_vmaas_datastore.c_3par: Read complete after 0s [id=1]
data.morpheus_virtual_image.example_virtual_image: Read complete after 2s [name=ubuntu-20]
data.hpegl_vmaas_cloud_folder.compute_folder: Read complete after 0s [id=6]

Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  # hpegl_vmaas_instance.sample_vm[0] will be created
  + resource "hpegl_vmaas_instance" "sample_vm" {
      + cloud_id           = 1
      + containers         = (known after apply)
      + environment_code   = "dev"
      + group_id           = (known after apply)
      + history            = (known after apply)
      + hostname           = (known after apply)
      + id                 = (known after apply)
      + instance_type_code = "cfe_tf_example_instance"
      + labels             = [
          + "sample_vm",
        ]
      + layout_id          = (known after apply)
      + name               = (known after apply)
      + plan_id            = 407
      + server_id          = (known after apply)
      + status             = (known after apply)
      + tags               = {
          + "APPLICATION"       = "Custom Ubuntu"
          + "BillingCostCenter" = "999"
          + "Division"          = "AUK"
          + "PatchGroup"        = "None"
          + "ResourceContact"   = "john.lenihan@hpe.com"
          + "ResourcePurpose"   = "CFE"
          + "purpose"           = "sample"
        }

      + config {
          + asset_tag        = "vm_tag"
          + create_user      = true
          + folder_code      = "group-v41"
          + no_agent         = false
          + resource_pool_id = 3
        }

      + network {
          + id          = 14
          + internal_id = (known after apply)
          + is_primary  = (known after apply)
          + name        = (known after apply)
        }

      + volume {
          + datastore_id = "1"
          + id           = (known after apply)
          + name         = "root_vol"
          + root         = true
          + size         = 30
        }
    }

  # morpheus_group.tf_example_group will be created
  + resource "morpheus_group" "tf_example_group" {
      + cloud_ids = [
          + 1,
        ]
      + code      = "CFE TF Group"
      + id        = (known after apply)
      + location  = "galway"
      + name      = "CFE TF Group"
    }

  # morpheus_instance_layout.tf_example_instance_layout will be created
  + resource "morpheus_instance_layout" "tf_example_instance_layout" {
      + creatable                  = true
      + description                = (known after apply)
      + id                         = (known after apply)
      + instance_type_id           = (known after apply)
      + labels                     = [
          + "demo",
          + "layout",
          + "terraform",
        ]
      + minimum_memory             = (known after apply)
      + name                       = "cfe_todo_app_frontend"
      + node_type_ids              = (known after apply)
      + option_type_ids            = (known after apply)
      + price_set_ids              = (known after apply)
      + spec_template_ids          = (known after apply)
      + support_convert_to_managed = (known after apply)
      + technology                 = "vmware"
      + version                    = "1.0"
      + workflow_id                = (known after apply)
    }

  # morpheus_instance_type.tf_example_instance_type will be created
  + resource "morpheus_instance_type" "tf_example_instance_type" {
      + category           = "web"
      + code               = "cfe_tf_example_instance"
      + description        = "Terraform Example Instance Type"
      + enable_deployments = (known after apply)
      + enable_scaling     = (known after apply)
      + enable_settings    = (known after apply)
      + environment_prefix = (known after apply)
      + featured           = true
      + id                 = (known after apply)
      + labels             = [
          + "demo",
          + "instance",
          + "terraform",
        ]
      + name               = "cfe_tf_example_instance"
      + option_type_ids    = (known after apply)
      + price_set_ids      = (known after apply)
      + visibility         = "public"
    }

  # morpheus_node_type.tf_example_node will be created
  + resource "morpheus_node_type" "tf_example_node" {
      + category            = "tfexample"
      + file_template_ids   = (known after apply)
      + id                  = (known after apply)
      + labels              = [
          + "demo",
          + "instance",
          + "terraform",
        ]
      + name                = "cfe_tf_example_node_type_1"
      + script_template_ids = (known after apply)
      + short_name          = "tfexamplenodetype1"
      + technology          = "vmware"
      + version             = "2.0"
      + virtual_image_id    = 967
    }

  # random_integer.random will be created
  + resource "random_integer" "random" {
      + id     = (known after apply)
      + max    = 50000
      + min    = 1
      + result = (known after apply)
    }

Plan: 6 to add, 0 to change, 0 to destroy.
morpheus_group.tf_example_group: Creating...
morpheus_node_type.tf_example_node: Creating...
morpheus_instance_type.tf_example_instance_type: Creating...
random_integer.random: Creating...
random_integer.random: Creation complete after 0s [id=34008]
morpheus_node_type.tf_example_node: Creation complete after 1s [id=1968]
morpheus_instance_type.tf_example_instance_type: Creation complete after 1s [id=207]
morpheus_instance_layout.tf_example_instance_layout: Creating...
morpheus_group.tf_example_group: Creation complete after 2s [id=83]
morpheus_instance_layout.tf_example_instance_layout: Creation complete after 2s [id=1409]
hpegl_vmaas_instance.sample_vm[0]: Creating...
hpegl_vmaas_instance.sample_vm[0]: Still creating... [10s elapsed]
hpegl_vmaas_instance.sample_vm[0]: Still creating... [20s elapsed]
hpegl_vmaas_instance.sample_vm[0]: Still creating... [30s elapsed]
hpegl_vmaas_instance.sample_vm[0]: Still creating... [40s elapsed]
hpegl_vmaas_instance.sample_vm[0]: Still creating... [50s elapsed]
hpegl_vmaas_instance.sample_vm[0]: Still creating... [1m0s elapsed]
hpegl_vmaas_instance.sample_vm[0]: Still creating... [1m10s elapsed]
hpegl_vmaas_instance.sample_vm[0]: Still creating... [1m20s elapsed]
hpegl_vmaas_instance.sample_vm[0]: Still creating... [1m30s elapsed]
hpegl_vmaas_instance.sample_vm[0]: Still creating... [1m40s elapsed]
hpegl_vmaas_instance.sample_vm[0]: Still creating... [1m50s elapsed]
hpegl_vmaas_instance.sample_vm[0]: Creation complete after 1m51s [id=52688]

Apply complete! Resources: 6 added, 0 changed, 0 destroyed.

 
```

### The output from an OpenTofu run (v1.6.2) to create the VMaaS Instance:

```shellsession
➜  1_location_1_cloud git:(blog1) ✗ tofu apply -var-file variables_tenant.tfvars -auto-approve
data.hpegl_vmaas_network.blue_segment: Reading...
data.hpegl_vmaas_morpheus_details.morpheus_details: Reading...
data.hpegl_vmaas_plan.g1_large: Reading...
data.hpegl_vmaas_environment.env: Reading...
data.hpegl_vmaas_environment.env: Read complete after 0s [id=1]
data.hpegl_vmaas_plan.g1_large: Read complete after 0s [id=407]
data.hpegl_vmaas_network.blue_segment: Read complete after 1s [id=14]
data.hpegl_vmaas_morpheus_details.morpheus_details: Read complete after 2s [id=94de0616-db52-4737-8afe-aeef618db00b]
data.morpheus_cloud.cloud: Reading...
data.morpheus_virtual_image.example_virtual_image: Reading...
data.morpheus_cloud.cloud: Read complete after 1s [name=HPE GreenLake VMaaS Cloud-Trial3]
data.hpegl_vmaas_resource_pool.cl_resource_pool: Reading...
data.hpegl_vmaas_datastore.c_3par: Reading...
data.hpegl_vmaas_cloud_folder.compute_folder: Reading...
data.hpegl_vmaas_resource_pool.cl_resource_pool: Read complete after 1s [id=3]
data.hpegl_vmaas_cloud_folder.compute_folder: Read complete after 1s [id=6]
data.morpheus_virtual_image.example_virtual_image: Read complete after 2s [name=ubuntu-20]
data.hpegl_vmaas_datastore.c_3par: Read complete after 1s [id=1]

OpenTofu used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
  + create

OpenTofu will perform the following actions:

  # hpegl_vmaas_instance.sample_vm[0] will be created
  + resource "hpegl_vmaas_instance" "sample_vm" {
      + cloud_id           = 1
      + containers         = (known after apply)
      + environment_code   = "dev"
      + group_id           = (known after apply)
      + history            = (known after apply)
      + hostname           = (known after apply)
      + id                 = (known after apply)
      + instance_type_code = "cfe_tf_example_instance"
      + labels             = [
          + "sample_vm",
        ]
      + layout_id          = (known after apply)
      + name               = (known after apply)
      + plan_id            = 407
      + server_id          = (known after apply)
      + status             = (known after apply)
      + tags               = {
          + "APPLICATION"       = "Custom Ubuntu"
          + "BillingCostCenter" = "999"
          + "Division"          = "AUK"
          + "PatchGroup"        = "None"
          + "ResourceContact"   = "john.lenihan@hpe.com"
          + "ResourcePurpose"   = "CFE"
          + "purpose"           = "sample"
        }

      + config {
          + asset_tag        = "vm_tag"
          + create_user      = true
          + folder_code      = "group-v41"
          + no_agent         = false
          + resource_pool_id = 3
        }

      + network {
          + id          = 14
          + internal_id = (known after apply)
          + is_primary  = (known after apply)
          + name        = (known after apply)
        }

      + volume {
          + datastore_id = "1"
          + id           = (known after apply)
          + name         = "root_vol"
          + root         = true
          + size         = 30
        }
    }

  # morpheus_group.tf_example_group will be created
  + resource "morpheus_group" "tf_example_group" {
      + cloud_ids = [
          + 1,
        ]
      + code      = "CFE TF Group"
      + id        = (known after apply)
      + location  = "galway"
      + name      = "CFE TF Group"
    }

  # morpheus_instance_layout.tf_example_instance_layout will be created
  + resource "morpheus_instance_layout" "tf_example_instance_layout" {
      + creatable                  = true
      + description                = (known after apply)
      + id                         = (known after apply)
      + instance_type_id           = (known after apply)
      + labels                     = [
          + "demo",
          + "layout",
          + "terraform",
        ]
      + minimum_memory             = (known after apply)
      + name                       = "cfe_todo_app_frontend"
      + node_type_ids              = (known after apply)
      + option_type_ids            = (known after apply)
      + price_set_ids              = (known after apply)
      + spec_template_ids          = (known after apply)
      + support_convert_to_managed = (known after apply)
      + technology                 = "vmware"
      + version                    = "1.0"
      + workflow_id                = (known after apply)
    }

  # morpheus_instance_type.tf_example_instance_type will be created
  + resource "morpheus_instance_type" "tf_example_instance_type" {
      + category           = "web"
      + code               = "cfe_tf_example_instance"
      + description        = "Terraform Example Instance Type"
      + enable_deployments = (known after apply)
      + enable_scaling     = (known after apply)
      + enable_settings    = (known after apply)
      + environment_prefix = (known after apply)
      + featured           = true
      + id                 = (known after apply)
      + labels             = [
          + "demo",
          + "instance",
          + "terraform",
        ]
      + name               = "cfe_tf_example_instance"
      + option_type_ids    = (known after apply)
      + price_set_ids      = (known after apply)
      + visibility         = "public"
    }

  # morpheus_node_type.tf_example_node will be created
  + resource "morpheus_node_type" "tf_example_node" {
      + category            = "tfexample"
      + file_template_ids   = (known after apply)
      + id                  = (known after apply)
      + labels              = [
          + "demo",
          + "instance",
          + "terraform",
        ]
      + name                = "cfe_tf_example_node_type_1"
      + script_template_ids = (known after apply)
      + short_name          = "tfexamplenodetype1"
      + technology          = "vmware"
      + version             = "2.0"
      + virtual_image_id    = 967
    }

  # random_integer.random will be created
  + resource "random_integer" "random" {
      + id     = (known after apply)
      + max    = 50000
      + min    = 1
      + result = (known after apply)
    }

Plan: 6 to add, 0 to change, 0 to destroy.
morpheus_node_type.tf_example_node: Creating...
morpheus_instance_type.tf_example_instance_type: Creating...
morpheus_group.tf_example_group: Creating...
random_integer.random: Creating...
random_integer.random: Creation complete after 0s [id=38926]
morpheus_instance_type.tf_example_instance_type: Creation complete after 2s [id=208]
morpheus_node_type.tf_example_node: Creation complete after 2s [id=1969]
morpheus_instance_layout.tf_example_instance_layout: Creating...
morpheus_group.tf_example_group: Creation complete after 2s [id=84]
morpheus_instance_layout.tf_example_instance_layout: Creation complete after 2s [id=1410]
hpegl_vmaas_instance.sample_vm[0]: Creating...
hpegl_vmaas_instance.sample_vm[0]: Still creating... [10s elapsed]
hpegl_vmaas_instance.sample_vm[0]: Still creating... [20s elapsed]
hpegl_vmaas_instance.sample_vm[0]: Still creating... [30s elapsed]
hpegl_vmaas_instance.sample_vm[0]: Still creating... [40s elapsed]
hpegl_vmaas_instance.sample_vm[0]: Still creating... [50s elapsed]
hpegl_vmaas_instance.sample_vm[0]: Still creating... [1m0s elapsed]
hpegl_vmaas_instance.sample_vm[0]: Still creating... [1m10s elapsed]
hpegl_vmaas_instance.sample_vm[0]: Still creating... [1m20s elapsed]
hpegl_vmaas_instance.sample_vm[0]: Still creating... [1m30s elapsed]
hpegl_vmaas_instance.sample_vm[0]: Creation complete after 1m34s [id=52689]

Apply complete! Resources: 6 added, 0 changed, 0 destroyed.
```

## One location/Two VMaaS Clouds/Two VMaaS Instances example

![](/img/hpegl-and-morpheus-terraform-blog-post-frame-2-1-.jpg)

The example HCL used here is based on the HCL for the first example.  However we have created two separate *Modules* based on that HCL: 

*morpheus_artefacts* which does the followingi. 

  * Takes as input: 

    * A VMaaS cloud name 
    * A group name 
    * An image name 
  * Creates: 

    * A group 
    * An instance type 
    * An instance layout 
    * A node type 
  * Outputs: 

    * Instance type details 
    * Instance layout details 
    * Node type details 
    * Group details 
    * Cloud ID

*vmaas_instance* which does the following. 

  * Takes inputs from an instance of the “morpheus_artefacts” module 
  * Retrieves details for the following VMaaS resources: 

    * VMaaS datastore 
    * VMaaS network 
    * VMaaS resource pool 
    * VMaaS plan 
    * VMaaS environment 
    * VMaaS cloud folder 
  * Creates a VMaaS instance 

These modules can be combined in different ways. In our specific case we: 

* Make two calls to *morpheus_artefacts* 
* Make two calls to *vmaas_instance* each using outputs from one of the above calls to *morpheus_artefacts* 

In this way we create two VMaaS instances each in a separate VMaaS Cloud based on the one underlying on-premise Morpheus instance.

### HCL

[View the example HCL](https://github.com/hpe-dev-incubator/GLP-API-Tooling/tree/main/Terraform/HPEGL-Morpheus-PCE-VMaaS/One-Location/One-Cloud-One-Instance/1_location_1_cloud)

### The output from a Terraform run (v1.5.7) to create the two VMaaS instances:

```shellsession
➜  2_clouds_module_nest git:(blog1) ✗ terraform apply -var-file variables_tenant.tfvars -auto-approve
data.hpegl_vmaas_morpheus_details.morpheus_details: Reading...
module.instance_cloud_1.data.hpegl_vmaas_environment.env: Reading...
module.instance_cloud_1.data.hpegl_vmaas_network.blue_segment: Reading...
module.instance_cloud_2.data.hpegl_vmaas_plan.g1_large: Reading...
module.instance_cloud_1.data.hpegl_vmaas_plan.g1_large: Reading...
module.instance_cloud_2.data.hpegl_vmaas_environment.env: Reading...
module.instance_cloud_2.data.hpegl_vmaas_network.blue_segment: Reading...
module.instance_cloud_1.data.hpegl_vmaas_network.blue_segment: Read complete after 2s [id=22]
module.instance_cloud_1.data.hpegl_vmaas_environment.env: Read complete after 2s [id=1]
module.instance_cloud_2.data.hpegl_vmaas_network.blue_segment: Read complete after 3s [id=41]
module.instance_cloud_2.data.hpegl_vmaas_plan.g1_large: Read complete after 3s [id=877]
module.instance_cloud_1.data.hpegl_vmaas_plan.g1_large: Read complete after 3s [id=877]
module.instance_cloud_2.data.hpegl_vmaas_environment.env: Read complete after 3s [id=1]
data.hpegl_vmaas_morpheus_details.morpheus_details: Read complete after 5s [id=4c4fcdd1-e283-4d9e-8a43-d050a3d201f9]
module.morpheus_artefacts_1.data.morpheus_cloud.cloud: Reading...
module.morpheus_artefacts_1.data.morpheus_virtual_image.example_virtual_image: Reading...
module.morpheus_artefacts_2.data.morpheus_cloud.cloud: Reading...
module.morpheus_artefacts_2.data.morpheus_virtual_image.example_virtual_image: Reading...
module.morpheus_artefacts_1.data.morpheus_cloud.cloud: Read complete after 5s [name=HPE GreenLake VMaaS Cloud]
module.morpheus_artefacts_2.data.morpheus_cloud.cloud: Read complete after 5s [name=ST01]
module.instance_cloud_1.data.hpegl_vmaas_resource_pool.cl_resource_pool: Reading...
module.instance_cloud_1.data.hpegl_vmaas_datastore.c_3par: Reading...
module.instance_cloud_1.data.hpegl_vmaas_cloud_folder.compute_folder: Reading...
module.instance_cloud_2.data.hpegl_vmaas_cloud_folder.compute_folder: Reading...
module.instance_cloud_2.data.hpegl_vmaas_datastore.c_3par: Reading...
module.instance_cloud_2.data.hpegl_vmaas_resource_pool.cl_resource_pool: Reading...
module.morpheus_artefacts_1.data.morpheus_virtual_image.example_virtual_image: Read complete after 5s [name=ubuntu20]
module.morpheus_artefacts_2.data.morpheus_virtual_image.example_virtual_image: Read complete after 5s [name=ubuntu-20]
module.instance_cloud_1.data.hpegl_vmaas_resource_pool.cl_resource_pool: Read complete after 2s [id=1]
module.instance_cloud_1.data.hpegl_vmaas_cloud_folder.compute_folder: Read complete after 2s [id=4]
module.instance_cloud_1.data.hpegl_vmaas_datastore.c_3par: Read complete after 2s [id=4]
module.instance_cloud_2.data.hpegl_vmaas_resource_pool.cl_resource_pool: Read complete after 2s [id=8]
module.instance_cloud_2.data.hpegl_vmaas_cloud_folder.compute_folder: Read complete after 2s [id=11]
module.instance_cloud_2.data.hpegl_vmaas_datastore.c_3par: Read complete after 2s [id=11]

Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  # module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0] will be created
  + resource "hpegl_vmaas_instance" "sample_vm" {
      + cloud_id           = 1
      + containers         = (known after apply)
      + environment_code   = "dev"
      + group_id           = (known after apply)
      + history            = (known after apply)
      + hostname           = (known after apply)
      + id                 = (known after apply)
      + instance_type_code = (known after apply)
      + labels             = [
          + "sample_vm",
        ]
      + layout_id          = (known after apply)
      + name               = (known after apply)
      + plan_id            = 877
      + server_id          = (known after apply)
      + status             = (known after apply)
      + tags               = {
          + "APPLICATION"       = "Custom Ubuntu"
          + "BillingCostCenter" = "999"
          + "Division"          = "AUK"
          + "PatchGroup"        = "None"
          + "ResourceContact"   = "john.lenihan@hpe.com"
          + "ResourcePurpose"   = "CFE"
          + "purpose"           = "sample"
        }

      + config {
          + asset_tag        = "vm_tag"
          + create_user      = true
          + folder_code      = "group-v1009"
          + no_agent         = false
          + resource_pool_id = 1
        }

      + network {
          + id          = 22
          + internal_id = (known after apply)
          + is_primary  = (known after apply)
          + name        = (known after apply)
        }

      + volume {
          + datastore_id = "4"
          + id           = (known after apply)
          + name         = "root_vol"
          + root         = true
          + size         = 30
        }
    }

  # module.instance_cloud_1.random_integer.random will be created
  + resource "random_integer" "random" {
      + id      = (known after apply)
      + keepers = {
          + "cloud" = "1"
        }
      + max     = 50000
      + min     = 1
      + result  = (known after apply)
    }

  # module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0] will be created
  + resource "hpegl_vmaas_instance" "sample_vm" {
      + cloud_id           = 5
      + containers         = (known after apply)
      + environment_code   = "dev"
      + group_id           = (known after apply)
      + history            = (known after apply)
      + hostname           = (known after apply)
      + id                 = (known after apply)
      + instance_type_code = (known after apply)
      + labels             = [
          + "sample_vm",
        ]
      + layout_id          = (known after apply)
      + name               = (known after apply)
      + plan_id            = 877
      + server_id          = (known after apply)
      + status             = (known after apply)
      + tags               = {
          + "APPLICATION"       = "Custom Ubuntu"
          + "BillingCostCenter" = "999"
          + "Division"          = "AUK"
          + "PatchGroup"        = "None"
          + "ResourceContact"   = "john.lenihan@hpe.com"
          + "ResourcePurpose"   = "CFE"
          + "purpose"           = "sample"
        }

      + config {
          + asset_tag        = "vm_tag"
          + create_user      = true
          + folder_code      = "group-v68"
          + no_agent         = false
          + resource_pool_id = 8
        }

      + network {
          + id          = 41
          + internal_id = (known after apply)
          + is_primary  = (known after apply)
          + name        = (known after apply)
        }

      + volume {
          + datastore_id = "11"
          + id           = (known after apply)
          + name         = "root_vol"
          + root         = true
          + size         = 30
        }
    }

  # module.instance_cloud_2.random_integer.random will be created
  + resource "random_integer" "random" {
      + id      = (known after apply)
      + keepers = {
          + "cloud" = "5"
        }
      + max     = 50000
      + min     = 1
      + result  = (known after apply)
    }

  # module.morpheus_artefacts_1.morpheus_group.tf_example_group will be created
  + resource "morpheus_group" "tf_example_group" {
      + cloud_ids = [
          + 1,
        ]
      + code      = (known after apply)
      + id        = (known after apply)
      + location  = "galway"
      + name      = (known after apply)
    }

  # module.morpheus_artefacts_1.morpheus_instance_layout.tf_example_instance_layout will be created
  + resource "morpheus_instance_layout" "tf_example_instance_layout" {
      + creatable                  = true
      + description                = (known after apply)
      + id                         = (known after apply)
      + instance_type_id           = (known after apply)
      + labels                     = [
          + "demo",
          + "layout",
          + "terraform",
        ]
      + minimum_memory             = (known after apply)
      + name                       = (known after apply)
      + node_type_ids              = (known after apply)
      + option_type_ids            = (known after apply)
      + price_set_ids              = (known after apply)
      + spec_template_ids          = (known after apply)
      + support_convert_to_managed = (known after apply)
      + technology                 = "vmware"
      + version                    = "1.0"
      + workflow_id                = (known after apply)
    }

  # module.morpheus_artefacts_1.morpheus_instance_type.tf_example_instance_type will be created
  + resource "morpheus_instance_type" "tf_example_instance_type" {
      + category           = "web"
      + code               = (known after apply)
      + description        = "Terraform Example Instance Type"
      + enable_deployments = (known after apply)
      + enable_scaling     = (known after apply)
      + enable_settings    = (known after apply)
      + environment_prefix = (known after apply)
      + featured           = true
      + id                 = (known after apply)
      + labels             = [
          + "demo",
          + "instance",
          + "terraform",
        ]
      + name               = (known after apply)
      + option_type_ids    = (known after apply)
      + price_set_ids      = (known after apply)
      + visibility         = "public"
    }

  # module.morpheus_artefacts_1.morpheus_node_type.tf_example_node will be created
  + resource "morpheus_node_type" "tf_example_node" {
      + category            = "tfexample"
      + file_template_ids   = (known after apply)
      + id                  = (known after apply)
      + labels              = [
          + "demo",
          + "instance",
          + "terraform",
        ]
      + name                = (known after apply)
      + script_template_ids = (known after apply)
      + short_name          = "tfexamplenodetype-ubuntu20"
      + technology          = "vmware"
      + version             = "2.0"
      + virtual_image_id    = 3065
    }

  # module.morpheus_artefacts_1.random_integer.random will be created
  + resource "random_integer" "random" {
      + id      = (known after apply)
      + keepers = {
          + "cloud" = "HPE GreenLake VMaaS Cloud"
        }
      + max     = 50000
      + min     = 1
      + result  = (known after apply)
    }

  # module.morpheus_artefacts_2.morpheus_group.tf_example_group will be created
  + resource "morpheus_group" "tf_example_group" {
      + cloud_ids = [
          + 5,
        ]
      + code      = (known after apply)
      + id        = (known after apply)
      + location  = "galway"
      + name      = (known after apply)
    }

  # module.morpheus_artefacts_2.morpheus_instance_layout.tf_example_instance_layout will be created
  + resource "morpheus_instance_layout" "tf_example_instance_layout" {
      + creatable                  = true
      + description                = (known after apply)
      + id                         = (known after apply)
      + instance_type_id           = (known after apply)
      + labels                     = [
          + "demo",
          + "layout",
          + "terraform",
        ]
      + minimum_memory             = (known after apply)
      + name                       = (known after apply)
      + node_type_ids              = (known after apply)
      + option_type_ids            = (known after apply)
      + price_set_ids              = (known after apply)
      + spec_template_ids          = (known after apply)
      + support_convert_to_managed = (known after apply)
      + technology                 = "vmware"
      + version                    = "1.0"
      + workflow_id                = (known after apply)
    }

  # module.morpheus_artefacts_2.morpheus_instance_type.tf_example_instance_type will be created
  + resource "morpheus_instance_type" "tf_example_instance_type" {
      + category           = "web"
      + code               = (known after apply)
      + description        = "Terraform Example Instance Type"
      + enable_deployments = (known after apply)
      + enable_scaling     = (known after apply)
      + enable_settings    = (known after apply)
      + environment_prefix = (known after apply)
      + featured           = true
      + id                 = (known after apply)
      + labels             = [
          + "demo",
          + "instance",
          + "terraform",
        ]
      + name               = (known after apply)
      + option_type_ids    = (known after apply)
      + price_set_ids      = (known after apply)
      + visibility         = "public"
    }

  # module.morpheus_artefacts_2.morpheus_node_type.tf_example_node will be created
  + resource "morpheus_node_type" "tf_example_node" {
      + category            = "tfexample"
      + file_template_ids   = (known after apply)
      + id                  = (known after apply)
      + labels              = [
          + "demo",
          + "instance",
          + "terraform",
        ]
      + name                = (known after apply)
      + script_template_ids = (known after apply)
      + short_name          = "tfexamplenodetype-ubuntu-20"
      + technology          = "vmware"
      + version             = "2.0"
      + virtual_image_id    = 3056
    }

  # module.morpheus_artefacts_2.random_integer.random will be created
  + resource "random_integer" "random" {
      + id      = (known after apply)
      + keepers = {
          + "cloud" = "ST01"
        }
      + max     = 50000
      + min     = 1
      + result  = (known after apply)
    }

Plan: 14 to add, 0 to change, 0 to destroy.

Changes to Outputs:
  + instance_ids_cloud_1         = (known after apply)
  + instance_ids_cloud_2         = (known after apply)
  + instance_layout_id_cloud_1   = (known after apply)
  + instance_layout_id_cloud_2   = (known after apply)
  + instance_layout_name_cloud_1 = (known after apply)
  + instance_layout_name_cloud_2 = (known after apply)
  + instance_names_cloud_1       = (known after apply)
  + instance_names_cloud_2       = (known after apply)
  + node_type_id_cloud_1         = (known after apply)
  + node_type_id_cloud_2         = (known after apply)
  + node_type_name_cloud_1       = (known after apply)
  + node_type_name_cloud_2       = (known after apply)
module.morpheus_artefacts_2.random_integer.random: Creating...
module.morpheus_artefacts_1.random_integer.random: Creating...
module.morpheus_artefacts_2.random_integer.random: Creation complete after 0s [id=29896]
module.morpheus_artefacts_1.random_integer.random: Creation complete after 0s [id=17891]
module.morpheus_artefacts_1.morpheus_group.tf_example_group: Creating...
module.morpheus_artefacts_1.morpheus_instance_type.tf_example_instance_type: Creating...
module.morpheus_artefacts_2.morpheus_instance_type.tf_example_instance_type: Creating...
module.morpheus_artefacts_1.morpheus_node_type.tf_example_node: Creating...
module.instance_cloud_1.random_integer.random: Creating...
module.instance_cloud_2.random_integer.random: Creating...
module.morpheus_artefacts_2.morpheus_group.tf_example_group: Creating...
module.morpheus_artefacts_2.morpheus_node_type.tf_example_node: Creating...
module.instance_cloud_1.random_integer.random: Creation complete after 0s [id=39454]
module.instance_cloud_2.random_integer.random: Creation complete after 0s [id=48337]
module.morpheus_artefacts_1.morpheus_node_type.tf_example_node: Creation complete after 5s [id=5104]
module.morpheus_artefacts_2.morpheus_node_type.tf_example_node: Creation complete after 5s [id=5107]
module.morpheus_artefacts_1.morpheus_instance_type.tf_example_instance_type: Creation complete after 5s [id=328]
module.morpheus_artefacts_1.morpheus_instance_layout.tf_example_instance_layout: Creating...
module.morpheus_artefacts_2.morpheus_instance_type.tf_example_instance_type: Creation complete after 6s [id=325]
module.morpheus_artefacts_2.morpheus_instance_layout.tf_example_instance_layout: Creating...
module.morpheus_artefacts_2.morpheus_group.tf_example_group: Creation complete after 7s [id=88]
module.morpheus_artefacts_1.morpheus_group.tf_example_group: Creation complete after 8s [id=85]
module.morpheus_artefacts_1.morpheus_instance_layout.tf_example_instance_layout: Creation complete after 6s [id=3556]
module.morpheus_artefacts_2.morpheus_instance_layout.tf_example_instance_layout: Creation complete after 5s [id=3553]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Creating...
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Creating...
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [10s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [10s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [20s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [20s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [30s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [30s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [40s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [40s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [50s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [50s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [1m0s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [1m0s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [1m10s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [1m10s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [1m20s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [1m20s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [1m30s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [1m30s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [1m40s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [1m40s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [1m50s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [1m50s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [2m0s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [2m0s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [2m10s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [2m10s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [2m20s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [2m20s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [2m30s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [2m30s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [2m40s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [2m40s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [2m50s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [2m50s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [3m0s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [3m0s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [3m10s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [3m10s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [3m20s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [3m20s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [3m30s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [3m30s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [3m40s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [3m40s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [3m50s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [3m50s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [4m0s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [4m0s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [4m10s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [4m10s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Creation complete after 4m18s [id=628]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [4m20s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [4m30s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Creation complete after 4m35s [id=631]

Apply complete! Resources: 14 added, 0 changed, 0 destroyed.

Outputs:

instance_ids_cloud_1 = "628"
instance_ids_cloud_2 = "631"
instance_layout_id_cloud_1 = "3556"
instance_layout_id_cloud_2 = "3553"
instance_layout_name_cloud_1 = "cfe_todo_app_frontend--17891"
instance_layout_name_cloud_2 = "cfe_todo_app_frontend--29896"
instance_names_cloud_1 = "CFE morpheus-vmaas sample VM 1-39454-0"
instance_names_cloud_2 = "CFE morpheus-vmaas sample VM 1-48337-0"
node_type_id_cloud_1 = "5104"
node_type_id_cloud_2 = "5107"
node_type_name_cloud_1 = "cfe_tf_example_node_type--17891"
node_type_name_cloud_2 = "cfe_tf_example_node_type--29896"
```

### The output from an OpenTofu run (v1.6.2) to create the two VMaaS instances:

```shellsession
➜  2_clouds_module_nest git:(blog1) ✗ tofu apply -var-file variables_tenant.tfvars -auto-approve
module.instance_cloud_1.data.hpegl_vmaas_environment.env: Reading...
module.instance_cloud_2.data.hpegl_vmaas_environment.env: Reading...
module.instance_cloud_1.data.hpegl_vmaas_network.blue_segment: Reading...
module.instance_cloud_2.data.hpegl_vmaas_plan.g1_large: Reading...
module.instance_cloud_1.data.hpegl_vmaas_plan.g1_large: Reading...
module.instance_cloud_2.data.hpegl_vmaas_network.blue_segment: Reading...
data.hpegl_vmaas_morpheus_details.morpheus_details: Reading...
module.instance_cloud_2.data.hpegl_vmaas_environment.env: Read complete after 2s [id=1]
module.instance_cloud_2.data.hpegl_vmaas_network.blue_segment: Read complete after 2s [id=41]
module.instance_cloud_1.data.hpegl_vmaas_environment.env: Read complete after 3s [id=1]
module.instance_cloud_1.data.hpegl_vmaas_network.blue_segment: Read complete after 3s [id=22]
module.instance_cloud_1.data.hpegl_vmaas_plan.g1_large: Read complete after 3s [id=877]
module.instance_cloud_2.data.hpegl_vmaas_plan.g1_large: Read complete after 3s [id=877]
data.hpegl_vmaas_morpheus_details.morpheus_details: Read complete after 5s [id=4c4fcdd1-e283-4d9e-8a43-d050a3d201f9]
module.morpheus_artefacts_2.data.morpheus_cloud.cloud: Reading...
module.morpheus_artefacts_2.data.morpheus_virtual_image.example_virtual_image: Reading...
module.morpheus_artefacts_1.data.morpheus_cloud.cloud: Reading...
module.morpheus_artefacts_1.data.morpheus_virtual_image.example_virtual_image: Reading...
module.morpheus_artefacts_2.data.morpheus_cloud.cloud: Read complete after 5s [name=ST01]
module.instance_cloud_2.data.hpegl_vmaas_cloud_folder.compute_folder: Reading...
module.instance_cloud_2.data.hpegl_vmaas_resource_pool.cl_resource_pool: Reading...
module.instance_cloud_2.data.hpegl_vmaas_datastore.c_3par: Reading...
module.morpheus_artefacts_2.data.morpheus_virtual_image.example_virtual_image: Read complete after 5s [name=ubuntu-20]
module.morpheus_artefacts_1.data.morpheus_virtual_image.example_virtual_image: Read complete after 5s [name=ubuntu20]
module.morpheus_artefacts_1.data.morpheus_cloud.cloud: Read complete after 5s [name=HPE GreenLake VMaaS Cloud]
module.instance_cloud_1.data.hpegl_vmaas_cloud_folder.compute_folder: Reading...
module.instance_cloud_1.data.hpegl_vmaas_resource_pool.cl_resource_pool: Reading...
module.instance_cloud_1.data.hpegl_vmaas_datastore.c_3par: Reading...
module.instance_cloud_2.data.hpegl_vmaas_datastore.c_3par: Read complete after 2s [id=11]
module.instance_cloud_2.data.hpegl_vmaas_cloud_folder.compute_folder: Read complete after 2s [id=11]
module.instance_cloud_2.data.hpegl_vmaas_resource_pool.cl_resource_pool: Read complete after 3s [id=8]
module.instance_cloud_1.data.hpegl_vmaas_resource_pool.cl_resource_pool: Read complete after 3s [id=1]
module.instance_cloud_1.data.hpegl_vmaas_cloud_folder.compute_folder: Read complete after 3s [id=4]
module.instance_cloud_1.data.hpegl_vmaas_datastore.c_3par: Read complete after 3s [id=4]

OpenTofu used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
  + create

OpenTofu will perform the following actions:

  # module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0] will be created
  + resource "hpegl_vmaas_instance" "sample_vm" {
      + cloud_id           = 1
      + containers         = (known after apply)
      + environment_code   = "dev"
      + group_id           = (known after apply)
      + history            = (known after apply)
      + hostname           = (known after apply)
      + id                 = (known after apply)
      + instance_type_code = (known after apply)
      + labels             = [
          + "sample_vm",
        ]
      + layout_id          = (known after apply)
      + name               = (known after apply)
      + plan_id            = 877
      + server_id          = (known after apply)
      + status             = (known after apply)
      + tags               = {
          + "APPLICATION"       = "Custom Ubuntu"
          + "BillingCostCenter" = "999"
          + "Division"          = "AUK"
          + "PatchGroup"        = "None"
          + "ResourceContact"   = "john.lenihan@hpe.com"
          + "ResourcePurpose"   = "CFE"
          + "purpose"           = "sample"
        }

      + config {
          + asset_tag        = "vm_tag"
          + create_user      = true
          + folder_code      = "group-v1009"
          + no_agent         = false
          + resource_pool_id = 1
        }

      + network {
          + id          = 22
          + internal_id = (known after apply)
          + is_primary  = (known after apply)
          + name        = (known after apply)
        }

      + volume {
          + datastore_id = "4"
          + id           = (known after apply)
          + name         = "root_vol"
          + root         = true
          + size         = 30
        }
    }

  # module.instance_cloud_1.random_integer.random will be created
  + resource "random_integer" "random" {
      + id      = (known after apply)
      + keepers = {
          + "cloud" = "1"
        }
      + max     = 50000
      + min     = 1
      + result  = (known after apply)
    }

  # module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0] will be created
  + resource "hpegl_vmaas_instance" "sample_vm" {
      + cloud_id           = 5
      + containers         = (known after apply)
      + environment_code   = "dev"
      + group_id           = (known after apply)
      + history            = (known after apply)
      + hostname           = (known after apply)
      + id                 = (known after apply)
      + instance_type_code = (known after apply)
      + labels             = [
          + "sample_vm",
        ]
      + layout_id          = (known after apply)
      + name               = (known after apply)
      + plan_id            = 877
      + server_id          = (known after apply)
      + status             = (known after apply)
      + tags               = {
          + "APPLICATION"       = "Custom Ubuntu"
          + "BillingCostCenter" = "999"
          + "Division"          = "AUK"
          + "PatchGroup"        = "None"
          + "ResourceContact"   = "john.lenihan@hpe.com"
          + "ResourcePurpose"   = "CFE"
          + "purpose"           = "sample"
        }

      + config {
          + asset_tag        = "vm_tag"
          + create_user      = true
          + folder_code      = "group-v68"
          + no_agent         = false
          + resource_pool_id = 8
        }

      + network {
          + id          = 41
          + internal_id = (known after apply)
          + is_primary  = (known after apply)
          + name        = (known after apply)
        }

      + volume {
          + datastore_id = "11"
          + id           = (known after apply)
          + name         = "root_vol"
          + root         = true
          + size         = 30
        }
    }

  # module.instance_cloud_2.random_integer.random will be created
  + resource "random_integer" "random" {
      + id      = (known after apply)
      + keepers = {
          + "cloud" = "5"
        }
      + max     = 50000
      + min     = 1
      + result  = (known after apply)
    }

  # module.morpheus_artefacts_1.morpheus_group.tf_example_group will be created
  + resource "morpheus_group" "tf_example_group" {
      + cloud_ids = [
          + 1,
        ]
      + code      = (known after apply)
      + id        = (known after apply)
      + location  = "galway"
      + name      = (known after apply)
    }

  # module.morpheus_artefacts_1.morpheus_instance_layout.tf_example_instance_layout will be created
  + resource "morpheus_instance_layout" "tf_example_instance_layout" {
      + creatable                  = true
      + description                = (known after apply)
      + id                         = (known after apply)
      + instance_type_id           = (known after apply)
      + labels                     = [
          + "demo",
          + "layout",
          + "terraform",
        ]
      + minimum_memory             = (known after apply)
      + name                       = (known after apply)
      + node_type_ids              = (known after apply)
      + option_type_ids            = (known after apply)
      + price_set_ids              = (known after apply)
      + spec_template_ids          = (known after apply)
      + support_convert_to_managed = (known after apply)
      + technology                 = "vmware"
      + version                    = "1.0"
      + workflow_id                = (known after apply)
    }

  # module.morpheus_artefacts_1.morpheus_instance_type.tf_example_instance_type will be created
  + resource "morpheus_instance_type" "tf_example_instance_type" {
      + category           = "web"
      + code               = (known after apply)
      + description        = "Terraform Example Instance Type"
      + enable_deployments = (known after apply)
      + enable_scaling     = (known after apply)
      + enable_settings    = (known after apply)
      + environment_prefix = (known after apply)
      + featured           = true
      + id                 = (known after apply)
      + labels             = [
          + "demo",
          + "instance",
          + "terraform",
        ]
      + name               = (known after apply)
      + option_type_ids    = (known after apply)
      + price_set_ids      = (known after apply)
      + visibility         = "public"
    }

  # module.morpheus_artefacts_1.morpheus_node_type.tf_example_node will be created
  + resource "morpheus_node_type" "tf_example_node" {
      + category            = "tfexample"
      + file_template_ids   = (known after apply)
      + id                  = (known after apply)
      + labels              = [
          + "demo",
          + "instance",
          + "terraform",
        ]
      + name                = (known after apply)
      + script_template_ids = (known after apply)
      + short_name          = "tfexamplenodetype-ubuntu20"
      + technology          = "vmware"
      + version             = "2.0"
      + virtual_image_id    = 3065
    }

  # module.morpheus_artefacts_1.random_integer.random will be created
  + resource "random_integer" "random" {
      + id      = (known after apply)
      + keepers = {
          + "cloud" = "HPE GreenLake VMaaS Cloud"
        }
      + max     = 50000
      + min     = 1
      + result  = (known after apply)
    }

  # module.morpheus_artefacts_2.morpheus_group.tf_example_group will be created
  + resource "morpheus_group" "tf_example_group" {
      + cloud_ids = [
          + 5,
        ]
      + code      = (known after apply)
      + id        = (known after apply)
      + location  = "galway"
      + name      = (known after apply)
    }

  # module.morpheus_artefacts_2.morpheus_instance_layout.tf_example_instance_layout will be created
  + resource "morpheus_instance_layout" "tf_example_instance_layout" {
      + creatable                  = true
      + description                = (known after apply)
      + id                         = (known after apply)
      + instance_type_id           = (known after apply)
      + labels                     = [
          + "demo",
          + "layout",
          + "terraform",
        ]
      + minimum_memory             = (known after apply)
      + name                       = (known after apply)
      + node_type_ids              = (known after apply)
      + option_type_ids            = (known after apply)
      + price_set_ids              = (known after apply)
      + spec_template_ids          = (known after apply)
      + support_convert_to_managed = (known after apply)
      + technology                 = "vmware"
      + version                    = "1.0"
      + workflow_id                = (known after apply)
    }

  # module.morpheus_artefacts_2.morpheus_instance_type.tf_example_instance_type will be created
  + resource "morpheus_instance_type" "tf_example_instance_type" {
      + category           = "web"
      + code               = (known after apply)
      + description        = "Terraform Example Instance Type"
      + enable_deployments = (known after apply)
      + enable_scaling     = (known after apply)
      + enable_settings    = (known after apply)
      + environment_prefix = (known after apply)
      + featured           = true
      + id                 = (known after apply)
      + labels             = [
          + "demo",
          + "instance",
          + "terraform",
        ]
      + name               = (known after apply)
      + option_type_ids    = (known after apply)
      + price_set_ids      = (known after apply)
      + visibility         = "public"
    }

  # module.morpheus_artefacts_2.morpheus_node_type.tf_example_node will be created
  + resource "morpheus_node_type" "tf_example_node" {
      + category            = "tfexample"
      + file_template_ids   = (known after apply)
      + id                  = (known after apply)
      + labels              = [
          + "demo",
          + "instance",
          + "terraform",
        ]
      + name                = (known after apply)
      + script_template_ids = (known after apply)
      + short_name          = "tfexamplenodetype-ubuntu-20"
      + technology          = "vmware"
      + version             = "2.0"
      + virtual_image_id    = 3056
    }

  # module.morpheus_artefacts_2.random_integer.random will be created
  + resource "random_integer" "random" {
      + id      = (known after apply)
      + keepers = {
          + "cloud" = "ST01"
        }
      + max     = 50000
      + min     = 1
      + result  = (known after apply)
    }

Plan: 14 to add, 0 to change, 0 to destroy.

Changes to Outputs:
  + instance_ids_cloud_1         = (known after apply)
  + instance_ids_cloud_2         = (known after apply)
  + instance_layout_id_cloud_1   = (known after apply)
  + instance_layout_id_cloud_2   = (known after apply)
  + instance_layout_name_cloud_1 = (known after apply)
  + instance_layout_name_cloud_2 = (known after apply)
  + instance_names_cloud_1       = (known after apply)
  + instance_names_cloud_2       = (known after apply)
  + node_type_id_cloud_1         = (known after apply)
  + node_type_id_cloud_2         = (known after apply)
  + node_type_name_cloud_1       = (known after apply)
  + node_type_name_cloud_2       = (known after apply)
module.morpheus_artefacts_2.random_integer.random: Creating...
module.instance_cloud_2.random_integer.random: Creating...
module.instance_cloud_1.random_integer.random: Creating...
module.morpheus_artefacts_1.random_integer.random: Creating...
module.instance_cloud_2.random_integer.random: Creation complete after 0s [id=10027]
module.morpheus_artefacts_1.random_integer.random: Creation complete after 0s [id=40272]
module.morpheus_artefacts_2.random_integer.random: Creation complete after 0s [id=1661]
module.instance_cloud_1.random_integer.random: Creation complete after 0s [id=36444]
module.morpheus_artefacts_2.morpheus_group.tf_example_group: Creating...
module.morpheus_artefacts_2.morpheus_instance_type.tf_example_instance_type: Creating...
module.morpheus_artefacts_1.morpheus_instance_type.tf_example_instance_type: Creating...
module.morpheus_artefacts_1.morpheus_group.tf_example_group: Creating...
module.morpheus_artefacts_2.morpheus_node_type.tf_example_node: Creating...
module.morpheus_artefacts_1.morpheus_node_type.tf_example_node: Creating...
module.morpheus_artefacts_2.morpheus_instance_type.tf_example_instance_type: Creation complete after 5s [id=334]
module.morpheus_artefacts_1.morpheus_node_type.tf_example_node: Creation complete after 5s [id=5113]
module.morpheus_artefacts_2.morpheus_node_type.tf_example_node: Creation complete after 5s [id=5110]
module.morpheus_artefacts_2.morpheus_instance_layout.tf_example_instance_layout: Creating...
module.morpheus_artefacts_1.morpheus_instance_type.tf_example_instance_type: Creation complete after 5s [id=331]
module.morpheus_artefacts_1.morpheus_instance_layout.tf_example_instance_layout: Creating...
module.morpheus_artefacts_1.morpheus_group.tf_example_group: Creation complete after 7s [id=91]
module.morpheus_artefacts_2.morpheus_group.tf_example_group: Creation complete after 9s [id=94]
module.morpheus_artefacts_2.morpheus_instance_layout.tf_example_instance_layout: Creation complete after 5s [id=3559]
module.morpheus_artefacts_1.morpheus_instance_layout.tf_example_instance_layout: Creation complete after 5s [id=3562]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Creating...
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Creating...
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [10s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [10s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [20s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [20s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [30s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [30s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [40s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [40s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [50s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [50s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [1m0s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [1m0s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [1m10s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [1m10s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [1m20s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [1m20s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [1m30s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [1m30s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [1m40s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [1m40s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [1m50s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [1m50s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [2m0s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [2m0s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [2m10s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [2m10s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [2m20s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [2m20s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [2m30s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [2m30s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [2m40s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [2m40s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [2m50s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [2m50s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [3m0s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [3m0s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [3m10s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [3m10s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [3m20s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [3m20s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [3m30s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [3m30s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [3m40s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [3m40s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [3m50s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [3m50s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [4m0s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [4m0s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [4m10s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Still creating... [4m10s elapsed]
module.instance_cloud_1.hpegl_vmaas_instance.sample_vm[0]: Creation complete after 4m20s [id=637]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Still creating... [4m20s elapsed]
module.instance_cloud_2.hpegl_vmaas_instance.sample_vm[0]: Creation complete after 4m21s [id=634]

Apply complete! Resources: 14 added, 0 changed, 0 destroyed.

Outputs:

instance_ids_cloud_1 = "637"
instance_ids_cloud_2 = "634"
instance_layout_id_cloud_1 = "3562"
instance_layout_id_cloud_2 = "3559"
instance_layout_name_cloud_1 = "cfe_todo_app_frontend--40272"
instance_layout_name_cloud_2 = "cfe_todo_app_frontend--1661"
instance_names_cloud_1 = "CFE morpheus-vmaas sample VM 1-36444-0"
instance_names_cloud_2 = "CFE morpheus-vmaas sample VM 1-10027-0"
node_type_id_cloud_1 = "5113"
node_type_id_cloud_2 = "5110"
node_type_name_cloud_1 = "cfe_tf_example_node_type--40272"
node_type_name_cloud_2 = "cfe_tf_example_node_type--1661"
```

# Summary 

When using Terraform (or OpenTofu) to interact with HPE GreenLake for Private Cloud Enterprise VMaaS there are two complementary providers: 

* [hpegl](https://registry.terraform.io/providers/HPE/hpegl/latest)
* [Morpheus](https://registry.terraform.io/providers/gomorpheus/morpheus/latest)

 When used in concert these two providers enable a rich set of IaC functionality. The hpegl provider has a *Data Source* named *hpegl_vmaas_morpheus_details* which can be used to retrieve an access token and URL for the on-premise Morpheus instance associated with the specific VMaaS *location*. These can be used as inputs to the provider stanza for the Morpheus provider. 

We have included example HCL for two separate VMaaS configurations: 

* One location, One VMaaS Cloud with One VMaaS Instance 
* One location, Two VMaaS Clouds each with One VMaaS Instance 

 The HCL for the second configuration is built around a pair of HCL modules that can be combined in various ways to work with a number of different VMaaS configurations, including those with more than one on-premise Morpheus instance. These modules are:

* [morpheus_artefacts](https://github.com/eamonnotoole/GLP-API-Tooling/tree/main/Terraform/HPEGL-Morpheus-PCE-VMaaS/One-Location/Two-Clouds-Two-Instances/morpheus_artefacts) which uses the Morpheus provider to create a group, instance type, instance layout and node type in the target VMaaS cloud
* [vmaas_instance](https://github.com/eamonnotoole/GLP-API-Tooling/tree/main/Terraform/HPEGL-Morpheus-PCE-VMaaS/One-Location/Two-Clouds-Two-Instances/vmaas_instance) which takes inputs from morpheus_artefacts and uses the hpegl provider to retrieve details about VMaaS resources and creates and launches a VMaaS VM Instance

HPE GreenLake for Private Cloud Enterprise customers are encouraged to use these example HCL bundles as a starting point for their own investigations into using the two providers (hpegl and Morpheus) for IaC with their environments.