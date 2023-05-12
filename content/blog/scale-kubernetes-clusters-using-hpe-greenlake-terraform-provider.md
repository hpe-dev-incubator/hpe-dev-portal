---
title: Upgrade Kubernetes Clusters using HPE GreenLake Terraform Provider
date: 2023-05-12T03:06:12.264Z
author: Tanushi Agarwal
authorimage: /img/photoforblog.jpg
disable: false
---
IaC or Infrastructure as code is an practice of automating the process of managing and provisioning infrastructure through code instead of manual processes. It gives organizations tools to create, manage, and destroy compute resources by statically defining and declaring these resources in codeblocks. It helps to increase operational agility, simplify management, reduce errors, and save cost.

> I﻿n this post, I will explore options to declare and upgrade Kubernetes clusters on HPE GreenLake using the HPE GreenLake Terraform Provider.

A﻿s the part of upgrade, the following 3 scenarios are supported --  

1. Scaling of a cluster's worker nodes. Please refer blog post [Scale Kubernetes Clusters using HPE GreenLake Terraform Provider](https://developer.hpe.com/blog/scale-kubernetes-cluster-using-hpe-greenlake-terraform-provider/) to check out scaling options available for woker nodes. 
2. Upgrade the kubernetes version of the cluster. Covered in this blog.
3. Upgrade the OS version of the worker nodes inside a cluster. Covered in this blog.

# Prerequisite

Before starting this tutorial, it is recommended that you read the blog post  [Kubernetes Cluster as Code - Part 1](https://developer.hpe.com/blog/kubernetes-clusters-as-code-part1/), which includes steps for creating a Kubernetes cluster. This post expands upon that scenario by examining how to upgrade a cluster's kubernetes version & OS version of its woker nodes. 

# Verify existing Kubernetes cluster

After the cluster is created following the instructions found in the  [Kubernetes Cluster as Code - Part 1 blog post](https://developer.hpe.com/blog/kubernetes-clusters-as-code-part1/), launch HPE GreenLake Central console and verify that the cluster is present under the appropriate tenant.

You should see the  **tf-test**  cluster present under  **Dashboard -> Manage your Private Cloud -> Containers**.

![](https://developer.hpe.com/img/cluster_list.jpg)

Below is the reference Terraform configuration file for the existing cluster.

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

# Kubernetes version upgrade

For Kubernetes version upgrade, we need to specify the new version of kubernetes that is available for upgrade in the resources block. 

1. **kubernetes_version**: *Use the Kubernetes version that pops up on the cluster details page in the UI.*

   ![](/img/blog1.jpg)



 Below is the reference Terraform configuration for updating the cluster's kubernetes version.

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

# Ready to Terraform plan

Terraform plan is a dry run that lets you preview the changes that Terraform plans to make to your infrastructure based on the data you provide in your Terraform file. To see this, run  **terraform plan**

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

# Ready to Terraform apply

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

# OS Version upgrade

For OS version upgrade, we need to specify the new version of OS Image that is available for upgrade & the name of the OS Image in the worker node block.


**Note**: The OS version is specific to a worker node pool. All the nodes in the worker node pool will be updated to the same OS version. However, we can have different node pools supporting different OS versions. 

The worker node block consist of following fields - 

1. **name**: *The name of the worker nodepool. If you wish to update default or existing worker node pool, enter the name of that node pool or you can create a new node pool by specifying a new name.*
2. **machine_blueprint_id**: *Fill in the ID for the machine blueprint that is already present in HPE GreenLake Central for your tenant. Use the machine blueprint data source to retrieve the machine blueprint ID.*
3. **count**: *Add the number of nodes to be present as part of this node pool. We can scale up & down by updating the count value here.*
4. **os_image**: *The name of the OS image. Use the machine blueprint data source to retrieve the name of OS image.*
5. **os_version**: *The version to be upgraded to. We can get this version in the UI. Whenever there is a new version available, UI will pop up a banner mentioning the new version.*

W﻿e can find the new version by clicking on the **Actions->Update OS** button on the right side of cluster's details page. 

![](/img/blog2.jpg)

![](/img/blog4.jpg)

 Below is the reference Terraform configuration for updating the worker nodepool's OS version.

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

data "hpegl_caas_machine_blueprint" "standard_worker" {
 name = "standard-worker"
 site_id = "data.hpegl_caas_site.blr.id"
}

resource hpegl_caas_cluster test {
 name         = "tf-test"
 blueprint_id = data.hpegl_caas_cluster_blueprint.bp.id
 site_id      = data.hpegl_caas_site.blr.id
 space_id     = var.HPEGL_SPACE
 
worker_nodes {
   name = "test-node-pool"
   machine_blueprint_id = data.hpegl_caas_machine_blueprint.standard_worker.id
   count = "1"
   os_image = "sles-custom"
   os_version = "15.3"
 }
}
```

# Ready to Terraform plan

Again, to preview the changes, do a dry run by running **terraform plan**

```shellsession
$ terraform plan

hpegl_caas_cluster.test: Refreshing state... [id=a32fabb9-7c19-42d1-9a38-ebf122810c0a]

Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
  ~ update in-place

Terraform will perform the following actions:

  # hpegl_caas_cluster.test will be updated in-place
  ~ resource "hpegl_caas_cluster" "test" {
        id                    = "a32fabb9-7c19-42d1-9a38-ebf122810c0a"
        name                  = "tf-test"
        # (18 unchanged attributes hidden)

      + worker_nodes {
          + count                = 1
          + machine_blueprint_id = "0ac21c99-2fdb-491d-a590-a5016690b80b"
          + name                 = "test-node-pool"
          + os_image             = "sles-custom"
          + os_version           = "15.3"
        }
    }

Plan: 0 to add, 1 to change, 0 to destroy.

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

Note: You didn't use the -out option to save this plan, so Terraform can't guarantee to take exactly these actions if you run "terraform apply" now.
```

# Ready to Terraform apply

Run the command  **terraform apply**  and type  **yes**  when asked to  **Enter a value**.

```shellsession
$ terraform apply

hpegl_caas_cluster.test: Refreshing state... [id=a32fabb9-7c19-42d1-9a38-ebf122810c0a]

Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
  ~ update in-place

Terraform will perform the following actions:

  # hpegl_caas_cluster.test will be updated in-place
  ~ resource "hpegl_caas_cluster" "test" {
        id                    = "a32fabb9-7c19-42d1-9a38-ebf122810c0a"
        name                  = "tf-test"
        # (17 unchanged attributes hidden)

      + worker_nodes {
          + count                = 1
          + machine_blueprint_id = "0ac21c99-2fdb-491d-a590-a5016690b80b"
          + name                 = "test-node-pool"
          + os_image             = "sles-custom"
          + os_version           = "15.3"
        }
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
hpegl_caas_cluster.test: Still modifying... [id=a32fabb9-7c19-42d1-9a38-ebf122810c0a, 37m10s elapsed]
hpegl_caas_cluster.test: Still modifying... [id=a32fabb9-7c19-42d1-9a38-ebf122810c0a, 39m10s elapsed]
hpegl_caas_cluster.test: Still modifying... [id=a32fabb9-7c19-42d1-9a38-ebf122810c0a, 41m10s elapsed]
hpegl_caas_cluster.test: Still modifying... [id=a32fabb9-7c19-42d1-9a38-ebf122810c0a, 43m10s elapsed]
hpegl_caas_cluster.test: Modifications complete after 43m18s [id=a32fabb9-7c19-42d1-9a38-ebf122810c0a]

Apply complete! Resources: 0 added, 1 changed, 0 destroyed.
```

**Note**: If you wish to only scale up or down the worker node pool & not update the OS version, add only the 3 fields i.e. **name**, **machine_blueprint_id** & **count** in the worker node block. 

# Summary

In this blog, I covered how to update Kubernetes clusters with Terraform provider for HPE GreenLake. I showed you how to update the Kubernetes version of the cluster & how to upgrade the OS version of worker node pool. Also I discussed how update & upgrade can be performed while scaling a cluster. 

I hope you found this information interesting and useful while considering the upgrade of Kubernetes cluster with HPE GreenLake Terraform provider. Use the following links to understand more about Terraform and HPE GreenLake Terraform Provider.

* [Learn more about Terraform](https://www.terraform.io/)
* [Learn more about HPE GreenLake](https://www.hpe.com/us/en/greenlake.html)
* [Learn more about the HPE GreenLake Terraform provider](https://registry.terraform.io/providers/HPE/hpegl)

Don’t forget, you can always find other tutorials and articles on HPE GreenLake on the  [HPE Developer blog](https://developer.hpe.com/blog/tag/hpe-greenlake).

## Tags

[hpe-greenlake,](https://developer.hpe.com/blog/tag/hpe-greenlake)[devops,](https://developer.hpe.com/blog/tag/devops)[terraform,](https://developer.hpe.com/blog/tag/terraform)[opensource,](https://developer.hpe.com/blog/tag/opensource)[hpe-greenlake-for-private-cloud-enterprise,](https://developer.hpe.com/blog/tag/hpe-greenlake-for-private-cloud-enterprise)[hpe-greenlake-for-private-cloud-enterprise-containers,](https://developer.hpe.com/blog/tag/hpe-greenlake-for-private-cloud-enterprise-containers)[containers-service,](https://developer.hpe.com/blog/tag/containers-service)[developer,](https://developer.hpe.com/blog/tag/developer)[devops,](https://developer.hpe.com/blog/tag/devops)[sre,](https://developer.hpe.com/blog/tag/sre)[site-reliability-engineer](https://developer.hpe.com/blog/tag/site-reliability-engineer)