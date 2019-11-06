---
title: Terraform Provider for HPE OneSphere
date: 2019-04-12T20:37:05.289Z
author: Pramod Reddy Sareddy, Developer 
tags: ["Terraform","Go","HPE-OneSphere","API","REST"]
path: terraform-provider-for-hpe-onesphere
---
In previous articles, [Getting Started with HPE OneSphere Programming]
(/blog/getting-started-with-hpe-onesphere-programming) and [Authenticating against HPE OneSphere API,] (/blog/authenticating-against-hpe-onesphere-api)  we examined the HPE OneSphere REST API. Most of this was done using a handy tool called Postman. In this article I will show you the basics of how HPE OneSphere Terraform provider can used to interact with the HPE Hybrid Cloud management Platform.

## Why Terraform?

HashiCorp Terraform is a powerful infrastructure orchestration tool used to create, manage, and update infrastructure resources. These resources may be physical machines, VMs, network switches, containers, or others. Almost any infrastructure type can be represented as a resource in Terraform. 

HashiCorp Terraform manages existing and popular service provider platforms, as well as custom in-house solutions.  Service providers, such as those delivering IaaS, PaaS, or SaaS (e.g. HPE OneSphere) capabilities, are responsible for understanding the API interactions and exposing the appropriate resources.

## HPE OneSphere Provider

[HPE OneSphere](https://www.hpe.com/us/en/solutions/cloud/onesphere.html) is a software-as-a-service (SaaS) hybrid cloud management platform that helps you build clouds, deploy apps, and gain insights faster.  Providers using HashiCorp Terraform are responsible for the lifecycle of a resource: create, read, update, delete. HPE OneSphere Provider enables operators to create and manage resources like users, projects, deployments, etc. Organizations now have access to compute, network, and many other resources critical to provisioning applications in both test & dev environments. Understand that the provider needs to be configured with the proper credentials before it can be used.

## HPE OneSphere Provider in Action Example

To demonstrate the workflow of HPE OneSphere provider, I am going to deploy a simple infrastructure on the HPE OneSphere platform. My goal is to deploy a virtual machine in HPE OneSphere using the HPE OneSphere provider. The first step is to setup the HashiCorp Terraform environment.

## Installing terraform-provider-onesphere with Go

* Install Go 1.11. For previous versions, you may have to set your $GOPATH manually, if you haven't done it yet.
* Install Terraform 0.9.x or above from here and save it into /usr/local/bin/terraform folder (create it if it doesn't exists)
* Download the code by issuing a go get command.

    #Download the source code for terraform-provider-onesphere

     #and build the needed binary, by saving it inside $GOPATH/bin

     $ go get -u github.com/HewlettPackard/terraform-provider-onesphere

     #Copy the binary to have it along the terraform binary

     $ mv $GOPATH/bin/terraform-provider-onesphere /usr/local/bin/terraform

## HPE OneSphere Setup

Before you can start, you need to have an administrator account to access the HPE OneSphere portal and perform the required operations.

## Terraform Deployment

An infrastructure managed by Terraform is defined in .tf files, which are written in HashiCorp Configuration Language (HCL) or JSON. HashiCorp Terraform supports variable interpolation based on different sources such as files, environment variables, other resources, and so on.

Create a new definition file called example.tf inside /usr/local/bin/terraform folder.



```js
# example.tf file
# OneSphere Credentials
provider "onesphere" {
  os_username = ONESPHERE_USERNAME
  os_password = ONESPHERE_PASSWORD
  os_endpoint = ONESPHERE_PORTAL_URL
  os_sslverify = true
}
```
Running terraform init will give the following output:

![5bf2e1a0cd93d0796238ae01-blog-content-1555105142616](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/4/picture2-1555105142615.png)

For now, I am going to use four basic commands: plan, apply, show, and destroy. Similar to the init command, these can be executed using the HashiCorp Terraform CLI (terraform command).

## Steps

### Add Project

First, I am going to create an HPE OneSphere project by including a resource configuration block “onesphere_project” in example.tf file.


```js
#example.tf
# Create a new OneSphere Project
resource "onesphere_project" "terraform" {
  name        = "terraform"
  description = "terraform project"
  taguris     = ["/rest/tags/environment=demonstration", "/rest/tags/line-of-business=incubation", "/rest/tags/tier=gold"]
}
```
Running terraform plan tells me that it will create the new project called “terraform” once I apply the changes.


![5bf2e1a0cd93d0796238ae01-blog-content-1555102758368](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/4/123-1555102758367.png)

Other than the id field, there are no other <computed> fields from the pasted output. A computed field means that HashiCorp Terraform will produce a value once the plan is executed. You will see later how you can access those computed values directly rather than using terraform show.

I next execute terraform apply. It will first print the plan and ask for confirmation.


![5bf2e1a0cd93d0796238ae01-blog-content-1555102800319](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/4/2222-1555102800318.png)

When I approve, the resources will be created in the correct order. HashiCorp Terraform parallelizes the creation of independent resources.

![5bf2e1a0cd93d0796238ae01-blog-content-1555102847372](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/4/ee-1555102847371.png)

__Add Network:__

As the network is already present in HPE OneSphere, I first need to import the network to bring it under HashiCorp Terraform management. The current version of terraform import can only import resources into the state. It does not generate a configuration. A future version will also generate the configuration. Because of this, prior to running terraform import, it is necessary to manually write a resource configuration block for the resource to which the imported object will be mapped.

Here, I create an HPE OneSphere network resource configuration block to which the imported object will be mapped.


```js
#example.tf
# Import a OneSphere Network
resource "onesphere_network" "terraformnetwork" {
}
```

Now, I will execute terraform import –provider=onesphere onesphere_network.terraformnetwork <Id.>  <Id.> is the network id.


![5bf2e1a0cd93d0796238ae01-blog-content-1555103112729](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/4/onw-1555103112728.png)

The next step is to provide network access to the created project “Terraform” by performing “add” operation. 


```js
#example.tf
# Provide Network access to the Project
resource "onesphere_network" "projectnetwork" {
  networkname       = "VMDeployment171"
  zonename          = "synergy-vsan-deic"
  operation         = "add"
  projectname       = "terraform"
}


![5bf2e1a0cd93d0796238ae01-blog-content-1555103151459](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/4/code-1555103151458.png)

Running terraform plan will tell me that it will update the network called “terraformnetwork” once we apply the changes.

![5bf2e1a0cd93d0796238ae01-blog-content-1555103194531](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/4/dd-1555103194527.png)

Once again, I execute terraform apply. Again, it will print the plan and ask for confirmation.

![5bf2e1a0cd93d0796238ae01-blog-content-1555103235777](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/4/ww-1555103235776.png)

When I approve, the network access will be provided to the project. 

![5bf2e1a0cd93d0796238ae01-blog-content-1555103281033](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/4/33-1555103281032.png)

__Add Deployment__

NOTE: The administrator needs to create a service group with services and expose it to the terraform project. Only those services can be deployed under the project.

Let’s assume that administrator exposed “rhel61forsca” service to the terraform project.

Now I create an HPE OneSphere deployment by including a resource configuration block “onesphere_deployment” in example.tf file.


```js
#example.tf
# Create a new deployment
resource "onesphere_deployment" "terraform" {
  name                          = "Terraform-Deployment"
  zonename                      = "synergy-vsan-deic"
  regionname                    = "emea-mougins-fr"
  servicename                   = "rhel61forcsa"
  projectname                   = "terraform"
  virtualmachineprofileid       = "2"
  networkname                   = "VMDeployment171"
}

Running terraform plan will tell me that it will create the new deployment called “Terraform-Deployment” once I apply the changes.

![5bf2e1a0cd93d0796238ae01-blog-content-1555103395434](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/4/e1e-1555103395432.png)

Once again, I must execute terraform apply. It will print the plan and ask for confirmation.

![5bf2e1a0cd93d0796238ae01-blog-content-1555103435688](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/4/picture1sss-1555103435686.png)

When I approve, the resources will be created in the correct order. Terraform parallelizes the creation of independent resources.

![5bf2e1a0cd93d0796238ae01-blog-content-1555103480734](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/4/picture1ssq-1555103480733.png)

The goal to create a virtual machine using HPE OneSphere provider was successful.

## Authentication

The HPE OneSphere provider supports static credentials and environment variables.

## Next Steps

There are many ways to consume an API such as HPE OneSphere. HPE OneSphere provider is one option. In future articles, I will explore other approaches. I've posted a [helpful HPE OneSphere interactive API guide] (https://developer.hpe.com/api/onesphere/) here on our Developer Portal. Use this guide to learn which routes your application can use. And if you're already an HPE OneSphere customer, simply use the `https://my-instance-name.hpeonesphere.com/docs/api/` URL to see your own fully interactive API guide.
