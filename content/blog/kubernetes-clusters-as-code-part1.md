---
title: Kubernetes clusters as Code - Part1
date: 2022-06-23T10:15:09.699Z
author: Rachana Kallada Jayaraj
authorimage: /img/photo-1-.jpg
---


<!--StartFragment-->

## Getting Started

The process of managing and provisioning computer data centers through machine-readable definition files, also known as Infrastructure-as-Code (IaC), offers many significant benefits. It helps to increase operational agility, simplify management, reduce errors, and save cost. In this post, we will explore some of the benefits of using IaC to build a Kubernetes cluster from scratch, with all the necessary configuration and core services, on HPE GreenLake using Terraform (TF). Storing Kubernetes cluster and favorable configurations as code, helps in repeatability and change management.

IaC with Kubernetes is not new. There are providers in the developer community which are quite good and well supported. Using the HPE GreenLake Terraform provider, you can bring up a Kubernetes cluster starting right from the infrastructure layer and way up in the stack, to set up desired configurations and applications. For reference, see the below picture.

![](/img/image2022-6-20_12-36-56.png)

<!--StartFragment-->

HPE GreenLake TF provider brings the Kubernetes stack up on the HPE GreenLake Infrastructure, and exposes credentials for other TF providers to integrate further and build the complete stack, as desired. In the diagram above, 2 and 3 are community providers that are available, which can be used in combination with HPE GreenLake TF provider. 

<!--EndFragment-->

<!--StartFragment-->

## Preparing for Infrastructure-as-code implementation 

### Setting up API clients

You need an API client to authenticate against HPE GreenLake. Follow the below steps for API Client creation.

1. Launch HPE GreenLake **Dashboard** for the appropriate tenant and select **User Management** option on the tenant page.

<!--EndFragment-->

![](/img/1.png)

<!--StartFragment-->

2. Under the **API Clients** tab, click on **Create API Client**.

<!--EndFragment-->

![](/img/2.png)

 <!--StartFragment-->

3.  Enter a **Name**(mandatory field) and **Description**(optional) for the API client, and click on**Create**button.

<!--EndFragment-->

![](/img/3.png)

<!--StartFragment-->

4.  Ensure to make a note of the **Issuer**, **Client ID** and **Client Secret** before clicking on the **Close** button. These details will be used in section 1.2.2.2.

<!--EndFragment-->

![](/img/4.png)

<!--StartFragment-->

5. In the **API Clients** page, select the newly created client, and click on **Create Assignment** button.

<!--EndFragment-->

![](/img/5.png)

<!--StartFragment-->

6. Create the assignment with below details:

**Role Assignment: Private Cloud Cluster Owner**

**Space: Default**

<!--EndFragment-->

![](/img/6.png)

<!--StartFragment-->

The API client is now ready to be used to run the Terraform resources.

<!--EndFragment-->

<!--StartFragment-->

###  Selecting a Terraform provider with Container service configurations

####  1. Ensure you have Terraform installed.

Terraform can be installed by following: [Terraform Installation](https://learn.hashicorp.com/tutorials/terraform/install-cli)

Installation can be verified using the below command.

<!--EndFragment-->