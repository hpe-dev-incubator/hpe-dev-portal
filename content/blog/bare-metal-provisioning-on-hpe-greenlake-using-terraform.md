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
2. Verify the installation with terraform –help
   At this point, you are ready to start building your infrastructure description file. 

## Setting up API Client for access

You need an API client to authenticate against HPE GreenLake.

Follow the below steps for API Client creation:

1. From the HPE GreenLake platform, launch the HPE GreenLake Central console for the appropriate tenant. Under the settings icon on the tenant Dashboard page, select User Management option.

   ![](/img/apiclient1.png)
2. Under the API Clients tab, click on Create API Client.
3. Enter a Name (mandatory field) and Description (optional) for the API client, and click on Create button.
4. Ensure you make a note of the Issuer, Client ID and Client Secret before clicking on the Close button.

These details will be exported as environment variables in the next section.

5. In the API Clients page, select the newly created client, and click on Create Assignment button.
6. Assign the roles BMAAS Access Viewer and BMAAS Access Project Contributor on the Space: Default.

The API Client is now ready to be used to run the Terraform resources.
Select the Compute Group ID
Compute Group is a logical grouping of bare metal resources that a team of Cloud Consumers can consume. You must specify the compute-group ID to interact with bare metal resources.

Note: Compute Group is AKA Project.

You can get the compute group ID from HPE GreenLake Console.

1. Navigate to HPE GreenLake for Private Cloud Services card -> Bare Metal -> Compute Groups.
2. Click on the desired compute group and extract the ID from the browser URL seen at that time.

This will later be exported as environment variable HPE_METAL_PROJECT_ID in the later section.

Deploy Compute Instance 
Select Terraform provider with bare metal service configurations

1. Export the following environment variables on your setup.

Export the Tenant ID:

```bash

```

Export the API Client credentials that you obtained when you create an API Client within HPE GreenLake Central:

```bash

```

Export the Compute Group ID:

```bash

```

Export bare metal service REST URL:

```bash

```

2. Configure the Terraform provider

Create an empty folder and put a file in it called main.tf with the following contents:

main.tf:

```hcl

```

This tells Terraform that you are going to be using HPE/hpegl as your provider and you are using bare metal service.

Write resource configuration for Compute Instance creation
To deploy compute instance, you need to use the hpegl_metal_host terraform resource.
Note:
•	compute instance is AKA host.
•	compute instance type is AKA machine size

The hpegl_metal_host resource supports many different arguments, but these are the required ones:

•	Image – A specific flavor and version in the form of flavor@version.
•	location – The location of where the compute instance will be provisioned.
•	machine_size – Compute Instance type.
•	networks – List of networks both required and optional.
•	ssh – List of SSH keys that will be pushed to the host.

```

```

Your next step with the TF file is to query the HPE GreenLake provider to collect the above required information for creating a host. 
For this, you will use the Terraform data statements.  

Querying for available OS images
In order to list the available OS images for OS, add the below data statements in your terraform file main.tf:

```hcl

```

The OS image list can now be fetched by using:

```hcl

```

Querying for other available resource
For this, you should use hpegl_metal_available_resources data resource. 
For example, the following statements shows how to retrieve the available SSH Key lists and store in local variable.

```hcl

```

Using a similar technique, you can retrieve the rest of the data you need - networks, machine_size etc.

```hcl

```

Here you can get information about each of the bare metal data statemens supported by the hpegl provider.

Create Compute Instance
The last step is to define a hpegl_metal_host terraform resource to request a new compute instance (Host):

```hcl

```

Initialize Terraform 
Before you can use Terraform, you will have to initialize it from the configuration file we have created. In the same directory as the main.tf file you created, run : terraform init

Validate and view the Terraform execution plan
Terraform plan is a dry run that lets you preview the changes that Terraform plans to make to your infrastructure based on the data you provide in your Terraform file. To see this, run: terraform plan

```

```

Apply the Terraform execution plan 
The command you need to use is now: terraform apply. This will rerun the plan command, then prompt you to confirm before it starts applying what’s in the plan:

```

```

Advanced example: 
The above example shows how to deploy a compute instance from the pre-existing resource. Below is another example that demonstrates compute instance deployment
with dependency on dynamic resources and few other possible configuration options.

```hcl

```

Cleaning up resources
When you no longer need the resources created via Terraform, destroy the resources using the terraform destroy command. 
This will automatically use the HPE GreenLake provider to clean the infrastructure in HPE GreenLake.

Summary
In this blog, I covered how to provision a compute instance with Terraform provider for HPE GreenLake using bare metal resources. I also showed you advanced usage of hpegl resource statements to deploy compute instance with dynamic resources. 
I hope you found this information interesting and useful in helping you get started with HPE GreenLake Terraform provider. You can also go through the below links to understand more about the HPE GreenLake Terraform Provider.
•	Learn more about the HPE GreenLake Terraform provider
•	Kubernetes Cluster as Code – Part 1
•	Kubernetes Cluster as Code – Part 2