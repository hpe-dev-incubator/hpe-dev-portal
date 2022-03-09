---
title: Infrastructure-as-code on HPE GreenLake using Terraform
date: 2022-03-08T15:17:41.884Z
author: Didier Lalli
authorimage: /img/didier-lalli.png
---
```

```

The process of managing and provisioning computer data centers through machine-readable definition files, otherwise known as Infrastructure-as-Code (IaC), offers many significant benefits. It helps to increase operational agility, simplify management, reduce errors, and save cost. In this post, I’ll explore some of the benefits of using IaC on HPE GreenLake through the use of Terraform.

## Let’s harness some of the benefits of Infrastructure as Code

One of the superpowers of IaC is its repeatability, the fact that you can set something up once and then use the same information in multiple ways. Implementing IaC allows organizations to store configuration files describing the desired infrastructure as a single source of truth. It also allows you to apply the DevOps methodology that’s already in place for application code directly to the infrastructure. For example, configuration files can be stored and managed through GitHub using the same way your DevOps team manages the application code. This concept is often called “Shifting Left”, as you are describing the infrastructure to host an application earlier (left) in the delivery pipeline of the application. This allows for easier and consistent deployments of infrastructure across the complete infrastructure landscape of an organization.

## HPE GreenLake

HPE GreenLake is HPE’s edge-to-cloud platform. The HPE GreenLake platform provides a unified experience wherever your applications and its data are located on the edge, in colocations or in your own datacenter. This cloud experience everywhere includes the following capabilities:

* Self-service
* Infinite scalability
* Pay-as-you-go
* Managed for you

## HPE GreenLake Cloud Services

The HPE GreenLake ecosystem provides solutions for several top workloads such as containers, Machine Learning, private cloud, virtual machines, SAP HANA, HPC, VDI and many more. This page on [HPE GreenLake cloud services and ecosystem](https://www.hpe.com/us/en/greenlake/services.html) provides a complete list. The ecosystem also leverages many technologies from HPE partners such as Microsoft, VMware, SAP, Nutanix, Veeam and others. 

## HPE GreenLake for Private Cloud Service

One of the options provided by HPE GreenLake is to make it easy for customers to order and operate a private cloud with a mix of virtual machines, containers, and physical servers. This is exactly what the Private Cloud Service is all about. This service allows customers to point and click to create resources such as virtual machines. It also provides access via a public API, allowing developers to use  an Infrastructure-as-Code type of tool to automate provisioning, for example using Terraform.

## Terraform

Terraform is an open source Infrastructure-as-Code framework originally created by HashiCorp that is written in Go. It uses a declarative language (HashiCorp Configuration Language HCL or JSON more recently) to describe the desired state of the infrastructure in terms of cloud, virtual machines, networks, storage, and many other components. Terraform uses the concept of “providers” to integrate with all major public clouds. Terraform is a so-called idempotent system in the sense that it doesn’t generate any side effects if applied multiple times on an infrastructure already in its desired state. Terraform has gained quite the momentum in the last few years. Its main competition is Ansible, Amazon Cloud Formation, Puppet and Chef.

## Readying for your Infrastructure-as-Code implementation

Terraform installation

Your first step is to get your system ready to run Terraform. In case this has not been done yet, this will include:

1. Installing Terraform: follow [these steps](https://learn.hashicorp.com/tutorials/terraform/install-cli)
2. Verifying installation: terraform --help
3. Initializing Terraform in a new empty folder: terraform init

At this point, you are ready to start building your infrastructure description file.  

### Building a Terraform configuration file from scratch

Let’s start building this TF file using your favorite editor.

#### Selecting a Terraform provider

The first section of the file will enumerate the “providers” you rely upon for building your infrastructure, and they could be multiple providers in a single TF file. In this case here, you will only have the HPE GreenLake provider referenced as hewlettpackard/hpeg in the official Terraform registry: <https://registry.terraform.io/> 

The first lines of your Terraform configuration file should look like this:

```json
# Load HPE GreenLake terraform provider
terraform {
      required_providers {
         hpegl = {
            source  = "hewlettpackard/hpegl"
            version = "0.1.0-beta7"
         }
      }
   }
```

You can find out more about the HPE GreenLake Terraform provider from its [Terraform Registry page](https://registry.terraform.io/providers/HewlettPackard/hpegl/0.1.7).

![Terraform HPE GreenLake Provider](/img/terraformprovider.png "Terraform HPE GreenLake Provider")