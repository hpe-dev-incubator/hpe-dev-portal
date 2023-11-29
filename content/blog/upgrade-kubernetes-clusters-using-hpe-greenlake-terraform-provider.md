---
title: Upgrade Kubernetes clusters using HPE GreenLake Terraform Provider
date: 2023-05-16T09:00:43.186Z
author: Tanushi Agarwal
authorimage: /img/photoforblog.jpg
disable: false
tags:
  - hpe-greenlake
  - hpe-greenlake-for-private-cloud-enterprise
  - hpe-greenlake-for-private-cloud-enterprise-containers
  - devops
  - terraform
  - opensource
  - containers-service
  - developer
  - devops
  - sre
  - site-reliability-engineer
---
IaC, or Infrastructure as code, is a practice of automating the process of managing and provisioning infrastructure through the use of code instead of using manual processes. It gives organizations the tools required to create, manage, and destroy compute resources by statically defining and declaring these resources in codeblocks. It helps increase operational agility, simplify management, reduce errors, and save cost.

I﻿n this post, I will explore options used to declare and upgrade Kubernetes clusters on HPE GreenLake using the HPE GreenLake Terraform Provider.

In terms of upgrades, the following 2 scenarios are supported:

1. Scaling of a cluster's worker nodes. Please refer to the blog post [Scale Kubernetes Clusters using HPE GreenLake Terraform Provider](https://developer.hpe.com/blog/scale-kubernetes-cluster-using-hpe-greenlake-terraform-provider/) to check out scaling options available for worker nodes.
2. Upgrade the Kubernetes version of the cluster. This step is covered in this blog.

# Prerequisite

Before implementing the steps shown in this tutorial, please read the blog post [Kubernetes Cluster as Code - Part 1](https://developer.hpe.com/blog/kubernetes-clusters-as-code-part1/), which includes the steps required to create a Kubernetes cluster.  This post expands upon that scenario by examining how to upgrade a cluster's Kubernetes version.

# Verify existing Kubernetes cluster

After the cluster is created following the instructions found in the  [Kubernetes Cluster as Code - Part 1 blog post](https://developer.hpe.com/blog/kubernetes-clusters-as-code-part1/), launch the HPE GreenLake Central console and verify that the cluster is present under the appropriate tenant.

You should see the  **tf-test**  cluster present under  **Dashboard -> Manage your Private Cloud -> Containers**.

![](https://developer.hpe.com/img/cluster_list.jpg)

Shown below is the reference Terraform configuration file for the existing cluster.

```hcl
terraform {
  required_providers {
    hpegl = {
      source  = "hpe/hpegl"
      version = ">= 0.2.2"
    }
  }
}
 
provider hpegl {
  caas {
  }
}
 
variable "HPEGL_SPACE" {
  type = string
}
 
data "hpegl_caas_site" "blr" {
  name = "BLR"
  space_id = var.HPEGL_SPACE
 }
 
data "hpegl_caas_cluster_blueprint" "bp" {
  name = "demo"
  site_id = data.hpegl_caas_site.blr.id
}
 
resource hpegl_caas_cluster test {
  name         = "tf-test"
  blueprint_id = data.hpegl_caas_cluster_blueprint.bp.id
  site_id      = data.hpegl_caas_site.blr.id
  space_id     = var.HPEGL_SPACE
}
```

# Upgrade the Kubernetes version

For the Kubernetes version upgrade, you need to specify the new version of Kubernetes that is available for upgrade in the resources block. 

1. **kubernetes_version**: Use the Kubernetes version that pops up on the cluster details page in the UI.

![](/img/blog1.jpg)

Below you can see the reference Terraform configuration for updating the cluster's Kubernetes version.

```hcl
terraform {
 required_providers {
   hpegl = {
     source  = "hpe/hpegl"
     version = ">= 0.2.2"
   }
 }
}

provider hpegl {
 caas {
 }
}

variable "HPEGL_SPACE" {
 type = string
}

data "hpegl_caas_site" "blr" {
 name = "BLR"
 space_id = var.HPEGL_SPACE
}

data "hpegl_caas_cluster_blueprint" "bp" {
 name = "demo"
 site_id = data.hpegl_caas_site.blr.id
}

resource hpegl_caas_cluster test {
 name         = "tf-test"
 blueprint_id = data.hpegl_caas_cluster_blueprint.bp.id
 site_id      = data.hpegl_caas_site.blr.id
 space_id     = var.HPEGL_SPACE
 kubernetes_version = "1.23.13-hpe1"
}
```

## Run Terraform plan

Terraform plan is a dry run that lets you preview the changes that Terraform plans to make to your infrastructure based on the data you provide in your Terraform file. To see this, run  **terraform plan.**

```shellsession
$ terraform plan

hpegl_caas_cluster.test: Refreshing state... [id=a32fabb9-7c19-42d1-9a38-ebf122810c0a]

Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
  ~ update in-place

Terraform will perform the following actions:

  # hpegl_caas_cluster.test will be updated in-place
  ~ resource "hpegl_caas_cluster" "test" {
        id                    = "a32fabb9-7c19-42d1-9a38-ebf122810c0a"
      ~ kubernetes_version    = "1.22.9-hpe1" -> "1.23.13-hpe1"
        name                  = "tf-test"
        # (17 unchanged attributes hidden)
    }

Plan: 0 to add, 1 to change, 0 to destroy.

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

Note: You didn't use the -out option to save this plan, so Terraform can't guarantee to take exactly these actions if you run "terraform apply" now.
```

## Run Terraform apply

Terraform apply executes the actions proposed in the Terraform plan and updates the resources. Run the command  **terraform apply**  and type  **yes**  when asked to  **Enter a value**.

```shellsession
$ terraform apply

hpegl_caas_cluster.test: Refreshing state... [id=a32fabb9-7c19-42d1-9a38-ebf122810c0a]

Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
  ~ update in-place

Terraform will perform the following actions:

  # hpegl_caas_cluster.test will be updated in-place
  ~ resource "hpegl_caas_cluster" "test" {
        id                    = "a32fabb9-7c19-42d1-9a38-ebf122810c0a"
      ~ kubernetes_version    = "1.22.9-hpe1" -> "1.23.13-hpe1"
        name                  = "tf-test"
        # (17 unchanged attributes hidden)
    }

Plan: 0 to add, 1 to change, 0 to destroy.

Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  Enter a value: yes

hpegl_caas_cluster.test: Modifying... [id=a32fabb9-7c19-42d1-9a38-ebf122810c0a]
hpegl_caas_cluster.test: Still modifying... [id=a32fabb9-7c19-42d1-9a38-ebf122810c0a, 10s elapsed]
hpegl_caas_cluster.test: Still modifying... [id=a32fabb9-7c19-42d1-9a38-ebf122810c0a, 1m10s elapsed]
hpegl_caas_cluster.test: Still modifying... [id=a32fabb9-7c19-42d1-9a38-ebf122810c0a, 3m10s elapsed]
hpegl_caas_cluster.test: Still modifying... [id=a32fabb9-7c19-42d1-9a38-ebf122810c0a, 5m10s elapsed]
hpegl_caas_cluster.test: Still modifying... [id=a32fabb9-7c19-42d1-9a38-ebf122810c0a, 7m10s elapsed]
hpegl_caas_cluster.test: Still modifying... [id=a32fabb9-7c19-42d1-9a38-ebf122810c0a, 9m10s elapsed]
hpegl_caas_cluster.test: Still modifying... [id=a32fabb9-7c19-42d1-9a38-ebf122810c0a, 11m10s elapsed]
hpegl_caas_cluster.test: Still modifying... [id=a32fabb9-7c19-42d1-9a38-ebf122810c0a, 13m10s elapsed]
hpegl_caas_cluster.test: Still modifying... [id=a32fabb9-7c19-42d1-9a38-ebf122810c0a, 15m10s elapsed]
hpegl_caas_cluster.test: Still modifying... [id=a32fabb9-7c19-42d1-9a38-ebf122810c0a, 17m10s elapsed]
hpegl_caas_cluster.test: Still modifying... [id=a32fabb9-7c19-42d1-9a38-ebf122810c0a, 19m10s elapsed]
hpegl_caas_cluster.test: Still modifying... [id=a32fabb9-7c19-42d1-9a38-ebf122810c0a, 21m10s elapsed]
hpegl_caas_cluster.test: Still modifying... [id=a32fabb9-7c19-42d1-9a38-ebf122810c0a, 23m10s elapsed]
hpegl_caas_cluster.test: Still modifying... [id=a32fabb9-7c19-42d1-9a38-ebf122810c0a, 25m10s elapsed]
hpegl_caas_cluster.test: Still modifying... [id=a32fabb9-7c19-42d1-9a38-ebf122810c0a, 27m10s elapsed]
hpegl_caas_cluster.test: Still modifying... [id=a32fabb9-7c19-42d1-9a38-ebf122810c0a, 29m10s elapsed]
hpegl_caas_cluster.test: Still modifying... [id=a32fabb9-7c19-42d1-9a38-ebf122810c0a, 31m10s elapsed]
hpegl_caas_cluster.test: Still modifying... [id=a32fabb9-7c19-42d1-9a38-ebf122810c0a, 33m10s elapsed]
hpegl_caas_cluster.test: Still modifying... [id=a32fabb9-7c19-42d1-9a38-ebf122810c0a, 35m10s elapsed]
hpegl_caas_cluster.test: Modifications complete after 35m18s [id=a32fabb9-7c19-42d1-9a38-ebf122810c0a]

Apply complete! Resources: 0 added, 1 changed, 0 destroyed.
```

**Note:** Kubernetes version update can be performed simultainously with scaling of worker nodes by introducing the worker_nodes block in the terraform configuration file. 

# Summary

In this blog, I covered how to update Kubernetes clusters with Terraform provider for HPE GreenLake. I showed you how to update the Kubernetes version of the cluster. Also I discussed how update can be performed while scaling a cluster. 

I hope you found this information interesting and useful while considering the upgrade of Kubernetes cluster with HPE GreenLake Terraform provider. Use the following links to understand more about Terraform and HPE GreenLake Terraform Provider.

* [Learn more about Terraform](https://www.terraform.io/)
* [Learn more about HPE GreenLake](https://www.hpe.com/us/en/greenlake.html)
* [Learn more about the HPE GreenLake Terraform provider](https://registry.terraform.io/providers/HPE/hpegl/latest/docs)

Don’t forget, you can always find other tutorials and articles on HPE GreenLake on the  [HPE Developer blog](https://developer.hpe.com/blog/tag/hpe-greenlake).