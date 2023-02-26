---
title: Bare Metal provisioning on HPE GreenLake using Terraform
date: 2023-02-26T19:38:34.667Z
author: Chaita Mylarappachar
authorimage: /img/chaitra_mylarappachar.png
disable: false
---
# Introduction

The HPE GreenLake for Private Cloud Enterprise: bare metal (BMaaS) service offering enables you to create a dedicated compute instances deployed on a physical IT infrastructure facilitating on-demand scalability, convenience, and agility as a cloud service. 
Using BMaaS, you can create compute-instances provisioned with specific operating systems, network connections, one or more public SSH keys, and optional network-attached storage volumes.
The service can be accessed via GUI as well as via public APIs, enabling developers to use an Infrastructure-as-Code tool to build, change, and manage infrastructure in a consistent and repeatable way.

## HPE GreenLake Terraform Provider

The HPE GreenLake Terraform provider hpegl by HPE GreenLake provides Infrastructure-as-Code support for HPE GreenLake Cloud Services.
Using the hpegl Terraform provider you can automate the management of your infrastructure. You can provision OS on bare metal, spin Virtual Machines and bring up a Kubernetes cluster starting 
right from bare metal all the way up in the stack to desired configurations and applications.

In this blog post, I will walk you through the steps required to use the HPE GreenLake Terraform Provider to deploy and further manage bare metal compute instances.

# Preparing for Infrastructure-as-Code implementation

## Terraform Installation

Your first step is to get your system ready to run Terraform. In case this has not been done yet:

1. Download and install Terraform, version v0.13 or later.
   For more information, see https://learn.hashicorp.com/tutorials/terraform/install-cli. 
2. Verify the installation with terraform -help. 

   At this point, you are ready to start building your infrastructure description file. 

## Setting up API Client for access

You need an API client to authenticate against HPE GreenLake.

Follow the below steps for API Client creation:

1. From the HPE GreenLake platform, launch the HPE GreenLake Central console for the appropriate tenant. Under the settings icon on the tenant Dashboard page, select the User Management option.  

   ![User Management](/img/apiclient1.png "User Management")
2. Under the API Clients tab, click on Create API Client.

   ![](/img/apiclient2.png)
3. Enter a Name (mandatory field) and Description (optional) for the API client, and click on Create button.
4. Ensure you make a note of the Issuer, Client ID, and Client Secret before clicking on the Close button. These details will be exported as environment variables in the next section.
5. In the API Clients page, select the newly created client, and click on **Create Assignment** button.
6. Assign the roles **BMAAS Access Viewer** and **BMAAS Access Project Contributor** on the **Space: Default.**

The API Client is now ready to be used to run the Terraform resources.

## Select the Compute Group ID  

Compute Group is a logical grouping of bare metal resources that a team of Cloud Consumers can consume. You must specify the compute-group ID to interact with bare metal resources.

*Note*: Compute Group is AKA Project.

You can get the compute group ID from HPE GreenLake Console.

1. Navigate to HPE GreenLake for Private Cloud Services card -> Bare Metal -> Compute Groups.
2. Click on the desired compute group and extract the ID from the browser URL seen at that time.

This will later be exported as environment variable **HPE_METAL_PROJECT_ID** in the later section.

# Deploy Compute Instance 

## Select Terraform provider with bare metal service configurations

1. Export the following environment variables on your setup.

   E﻿xport the Tenant ID:

   ```shell
   export HPEGL_TENANT_ID="<Tenant ID>
   ```

   Export the API Client credentials that you obtained when you create an API Client within HPE GreenLake Central:

   ```shell
   export HPEGL_USER_ID="<API Client ID>"
   export HPEGL_USER_SECRET="<API Client Secret>"
   export HPEGL_IAM_SERVICE_URL="<Issuer URL>"

   ```

   E﻿xport the Compute Group ID:

   ```
   # compute group/project ID
   export HPEGL_METAL_PROJECT_ID="<Compute Group ID>"

   ```

    ﻿Export bare metal service REST URL:

   ```
   # Production Environment:  https://client.greenlake.hpe.com/api/metal
   # Integration Environment: https://client.greenlake.hpe-gl-intg.com/api/metal
   # local development: http://localhost:3002

   export HPEGL_METAL_REST_URL="<Metal Service REST Base URL"

   ```
2. Configure the Terraform provider.

   Create an empty folder and put a file in it called main.tf with the following contents:

   main.tf:

   ```hcl
   terraform {
     required_providers {
       hpegl = {
         source  = "HPE/hpegl"
         version = ">= 0.3.12"
       }
     }
   }

   provider "hpegl" {    
     # metal block for configuring bare metal resources.
     metal {   
     } 
   }

   ```

   T﻿his tells Terraform that you are going to be using HPE/hpegl as your provider and you are using bare metal service.

## Write resource configuration for Compute Instance creation

To deploy compute instance, you need to use the **hpegl_metal_host** terraform resource.

*Note*:

* compute instance is AKA host.
* compute instance type is AKA machine size

The **hpegl_metal_host** resource supports many different arguments, but these are the required ones:

* networks – List of networks both required and optional.
* machine_size – Compute Instance type.
* ssh – List of SSH keys that will be pushed to the host.
* location – The location of where the compute instance will be provisioned.
* Image – A specific flavor and version in the form of flavor@version

  Y﻿ou can also checck the documentation[ here ](https://registry.terraform.io/providers/HPE/hpegl/latest/docs/resources/metal_host)to see all the required and optional fields.

  Your next step with the TF file is to query the HPE GreenLake provider to collect the above-required information for creating a host. For this, you will use the Terraform data statements.  

### Querying for available OS images

In order to list the available OS images for OS, add the below data statements in your terraform file *main.tf*:

```hcl
data "hpegl_metal_available_images" "ubuntu" { 
  # select anything that looks like ubuntu:20.04
  filter {
    name   = "flavor"
    values = ["(?i)ubuntu"] 
  }

  filter {
    name   = "version"
    values = ["20.04*"] 
  }
}
```

The OS image list can now be fetched by using the following:

```hcl
locals {
  ubuntu_image = format("%s@%s", data.hpegl_metal_available_images.ubuntu.images[0].flavor,
                          data.hpegl_metal_available_images.ubuntu.images[0].version)
}
```

### \
Querying for other available resources

For this, you should use **hpegl_metal_available_resources** data resource.  For example, the following statements show how to retrieve the available SSH Key lists and store them in a local variable.

```hcl
# query available resources.
data "hpegl_metal_available_resources" "available" {
}

# using one of available SSH keys.
locals  {
  ssh_keys = data.hpegl_metal_available_resources.available.ssh_keys[0].name
}
```

Using a similar technique, you can retrieve the rest of the data you need - networks, machine_size, etc.

```hcl
# choosing a location that has at least one machine available.
locals {
  location = ([for msize in data.hpegl_metal_available_resources.available.machine_sizes : msize.location 
                    if msize.quantity > 0])[0]
}

# Listing required networks for this location.
locals {
  networks = ([for net in data.hpegl_metal_available_resources.available.networks : net.name 
                  if net.host_use == "Required"  && net.location == local.location])
}

# choosing machine size/Compute Instance Type to deploy OS.
locals {
  machine_size = ([for msize in data.hpegl_metal_available_resources.available.machine_sizes : msize.name 
                    if msize.location == local.location])
}
```

\
[Here ](https://registry.terraform.io/providers/HPE/hpegl/latest/docs/data-sources/metal_available_resources)you can get information about each of the bare metal data statements supported by the hpegl provider.

### Create Compute Instance

The last step is to define a hpegl_metal_host terraform resource to request a new compute instance (Host):

```hcl
resource "hpegl_metal_host" "demo_host" {
  name          = "demo-host-1"
  image         = local.ubuntu_image
  machine_size  = local.machine_size[0]
  ssh           = [ local.ssh_keys ]
  networks      = local.networks
  location      = local.location
  description   = "Simple Host Deployment Demo"
}
```

#### Initialize Terraform 

Before you can use Terraform, you will have to initialize it from the configuration file we have created. In the same directory as the **main.tf** file you created, **run : terraform init**

#### Validate and view the Terraform execution plan

Terraform plan is a dry run that lets you preview the changes that Terraform plans to make to your infrastructure based on the data you provide in your Terraform file. To see this, **run: terraform plan**

#### Apply the Terraform execution plan  

The command you need to use is now: **terraform apply**. This will rerun the plan command, then prompt you to confirm before it starts applying what’s in the plan: 

### \
Advanced example  

The above example shows how to deploy a compute instance from the pre-existing resource. Below is another example that demonstrates compute instance deployment with dependency on dynamic resources and a few other possible configuration options. 

```hcl
terraform {
  required_providers {
    hpegl = {
      source  = "HPE/hpegl"
      version = ">= 0.3.12"
    }
  }
}

provider "hpegl" {    
  # metal block for configuring bare metal resources.
  metal {   
  } 
}

locals {
  location = "USA:CO:FTC"
}

resource "hpegl_metal_ssh_key" "newssh_1" {
  name       = "newssh_1"
  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCv03o//GEQ9/6eI1qZleyBbSndg0n5AkcKVnf5D4fEjwkWrtSIJEnROqJddEAn2XYALAk9x1AcB4Nue3q4tDG17VeK3ODo0+9Dx0LYqUTawnFWmo4X80QKr658Jmt7Enmnk5x2IrUDcNwAzALVellkBbwq7QbYUu1swSycNlNhSfGizqo/lQCNIHXyeRQ8oJxOuZkbiturXHZL389blIrTeUo53xmwE1TolVS8QzZRN8ve1GjFvpC5dl6orzi6LXDcrDcbZaxlrW+YQqyaipFRAw1DyTalrfpqxtq/Y9+Elz5xgCnUaepHN6ha/k81wtI2rySHga6pMOcJKlxaRS5OfzdrWh7oi2tEAaiq2y3pTr9hROQ2OGcMNU5gxbVU2ymeXdHVsAHMCmyKvQe0g0/fJzmNA/excogFCWDN7Spy9s2V39IbEKttyXjD/dpave7re9eFzYHA1CBEnNjMuvJj0H4tnpAETdQ6UbnjbE4JYn5eKGvnJ2w1JTfSdMK8nMcxqo4HfHWuLFuntCV9GAlWIVIvJn1pYisY8kEOtN5w6QrLTfsei96/TfssAsfhrDrVtgcgNU3EvZlC6Uaaly7D0ISFeufsxkPswu+jGNUJvGEqDiqvt05lSEZWS5viR/TOROTlicaGN9dhez/fqHcj5cnuoK1pmibK5GT7/Yf1Gw== user1@quattronetworks.com"
}

resource "hpegl_metal_network" "newpnet_1" {
  name        = "newpnet_1"
  description = "New private network 1 description"
  location    = local.location
  ip_pool {
    name          = "npool"
    description   = "New IP pool description"
    ip_ver        = "IPv4"
    base_ip       = "10.0.0.0"
    netmask       = "/24"
    default_route = "10.0.0.1"
    sources {
      base_ip = "10.0.0.3"
      count   = 10
    }
    dns      = ["10.0.0.50"]
    proxy    = "https://10.0.0.60"
    no_proxy = "10.0.0.5"
    ntp      = ["10.0.0.80"]
  }
}


resource "hpegl_metal_host" "demo_advance" {
  count = 0
  name             = "demo-advance-1"
  image            = "ubuntu@20.04-20210713"
  machine_size     = "G2i"
  ssh              = [hpegl_metal_ssh_key.newssh_1.id]
  networks         = ["Public", hpegl_metal_network.newpnet_1.name]
  network_route    = "Public"
  network_untagged = hpegl_metal_network.newpnet_1.name
  location         = local.location
  description      = "Hello from Terraform"
  # Attaching tags 
  labels           = { "purpose" = "devops" }
}
```

## \
Cleaning up resources     ﻿

When you no longer need the resources created via Terraform, destroy the resources using the **terraform destroy** command.  This will automatically use the HPE GreenLake provider to clean the infrastructure in HPE GreenLake.

# Summary    

In this blog, I covered how to provision a compute instance with Terraform provider for HPE GreenLake using bare metal resources. I also showed you advanced usage of hpegl resource statements to deploy compute instance with dynamic resources. 
I hope you found this information interesting and useful in helping you get started with the HPE GreenLake Terraform provider. You can also go through the below links to understand more about the HPE GreenLake Terraform Provider. 

* [Kubernetes Cluster as Code – Part 1](https://developer.hpe.com/blog/kubernetes-clusters-as-code-part1/)
* [Kubernetes Cluster as Code – Part 2](https://developer.hpe.com/blog/kubernetes-cluster-as-code-part-2/)  
* [Learn more about the HPE GreenLake Terraform provider](https://registry.terraform.io/providers/hpe/hpegl/latest)