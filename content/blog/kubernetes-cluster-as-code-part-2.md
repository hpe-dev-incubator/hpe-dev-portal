---
title: Kubernetes Cluster as Code - Part 2
date: 2022-06-23T14:01:05.923Z
author: Rachana Kallada Jayaraj
authorimage: /img/photo-1-.jpg
tags:
  - hpe-greenlake
  - devops
  - terraform
  - open source
---
<!--StartFragment-->

## Getting Started

The process of managing and provisioning computer data centers through machine-readable definition files, also known as Infrastructure-as-Code (IaC), offers many significant benefits. It helps to increase operational agility, simplify management, reduce errors, and save cost. In this post, we will explore some of the benefits of using IaC to build a Kubernetes cluster from scratch, with all the necessary configuration and core services, on HPE GreenLake using Terraform (TF). Storing Kubernetes cluster and favorable configurations as code, helps in repeatability and change management.

IaC with Kubernetes is not new. There are providers in the developer community which are quite good and well supported. Using the HPE GreenLake Terraform provider, you can bring up a Kubernetes cluster starting right from the infrastructure layer and way up in the stack, to set up desired configurations and applications. For reference, see the below picture.

<!--EndFragment-->

![](/img/image2022-6-20_12-36-56.png)

<!--StartFragment-->

HPE GreenLake TF provider brings the Kubernetes stack up on the HPE GreenLake Infrastructure, and exposes credentials for other TF providers to integrate further and build the complete stack, as desired. In the diagram above, 2 and 3 are community providers that are available, which can be used in combination with HPE GreenLake TF provider. 

<br/>

## Let's Recap

In [](https://rndwiki-pro.its.hpecorp.net/display/HCSS/Blog+%3A+Kubernetes+clusters+as+Code+-+Part1)the Kubernetes Cluster as Code - Part 1 blog , we covered the usage of the HPE GreenLake Terraform provider:

* To create and destroy a cluster resource.
* To incorporate community providers like kubernetes and create namespaces in the created cluster.

In this blog, we will focus on managing application deployments using IaC. Here, we will be deploying applications on an existing/pre-created cluster. Hence, the pre-requisite to proceed, would be, to have a cluster and a namespace created. You can follow the steps mentioned in Kubernetes Cluster as Code - Part 1 blog.

<br/>

## Application deployment on a cluster

### Helm provider

Below is the code block for adding **helm** communityprovider. Please refer to Kubernetes Cluster as Code - Part 1 blog for details regarding **hpegl\_caas\_cluster** data source.

<!--EndFragment-->

```
provider "helm" {
  kubernetes {
       host     = yamldecode(base64decode(data.hpegl_caas_cluster.tf-test-7.kubeconfig)).clusters[0].cluster.server
       token    = yamldecode(base64decode(data.hpegl_caas_cluster.tf-test-7.kubeconfig)).users[0].user.token
       insecure = true
  }
}
```

<!--StartFragment-->

<br/>

### Helm-release terraform resource for Prometheus stack deployment

In order to deploy prometheus stack using the helm-release resource, the following values have to be filled in the **prometheus-deploy.tf** file:

1. Cluster Name: Fill in the **name** of the pre-created cluster in **hpegl\_caas\_cluster** block. In the below example, name= "tf-test-7"
2. Namespace: Fill in the appropriate **namespace** in the **helm\_release** block. In the below example, namespace= "test-namespace" 

**prometheus-deploy.tf** 

```markdown
Note: You can name this file according to your preference. We are using prometheus-deploy.tf here for easy reference.
```

<!--EndFragment-->

```markdown
terraform {
  required_providers {
    hpegl = {
      source  = "hpe/hpegl"
      version = ">= 0.2.2"
    }
  }
}
 
provider "hpegl" {
  caas {
  }
}
 
variable "HPEGL_SPACE" {
  type = string
}
 
data "hpegl_caas_cluster" "tf-test-7" {
  name     = "tf-test-7"
  space_id = var.HPEGL_SPACE
}
 
provider "helm" {
  kubernetes {
       host     = yamldecode(base64decode(data.hpegl_caas_cluster.tf-test-7.kubeconfig)).clusters[0].cluster.server
       token    = yamldecode(base64decode(data.hpegl_caas_cluster.tf-test-7.kubeconfig)).users[0].user.token
       insecure = true
  }
}
 
resource "helm_release" "prometheus-stack" {
   name = "prometheus-stack"
   repository = "https://prometheus-community.github.io/helm-charts"
   chart = "kube-prometheus-stack"
 
   namespace = "test-namespace"
 
   set {
    name  = "grafana.service.type"
    value = "NodePort"
  }
}
```

<!--StartFragment-->

### Initializing workspace & Synchronizing Infrastructure components

Place the **prometheus-deploy.tf** file in your working directory and initialize the working directory using the command: **terraform init**

<!--EndFragment-->

```
$ terraform init
 
Initializing the backend...
 
Initializing provider plugins...
- Reusing previous version of hashicorp/helm from the dependency lock file
- Reusing previous version of terraform.example.com/caas/hpegl from the dependency lock file
- Using previously-installed hashicorp/helm v2.5.1
- Using previously-installed terraform.example.com/caas/hpegl v0.0.1
 
Terraform has made some changes to the provider dependency selections recorded
in the .terraform.lock.hcl file. Review those changes and commit them to your
version control system if they represent changes you intended to make.
 
Terraform has been successfully initialized!
 
You may now begin working with Terraform. Try running "terraform plan" to see
any changes that are required for your infrastructure. All Terraform commands
should now work.
 
If you ever set or change modules or backend configuration for Terraform,
rerun this command to reinitialize your working directory. If you forget, other
commands will detect it and remind you to do so if necessary.
```

<!--StartFragment-->

### Terraform ready to plan

Terraform plan is a dry run which lets you preview the changes that Terraform plans to make to your infrastructure based on the data you provide in your Terraform file. To see this, run: **terraform plan**

<!--EndFragment-->

```markdown
$ terraform plan
 
Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
  + create
 
Terraform will perform the following actions:
 
  # helm_release.prometheus-stack will be created
  + resource "helm_release" "prometheus-stack" {
      + atomic                     = false
      + chart                      = "kube-prometheus-stack"
      + cleanup_on_fail            = false
      + create_namespace           = false
      + dependency_update          = false
      + disable_crd_hooks          = false
      + disable_openapi_validation = false
      + disable_webhooks           = false
      + force_update               = false
      + id                         = (known after apply)
      + lint                       = false
      + manifest                   = (known after apply)
      + max_history                = 0
      + metadata                   = (known after apply)
      + name                       = "prometheus-stack"
      + namespace                  = "test-namespace"
      + recreate_pods              = false
      + render_subchart_notes      = true
      + replace                    = false
      + repository                 = "https://prometheus-community.github.io/helm-charts"
      + reset_values               = false
      + reuse_values               = false
      + skip_crds                  = false
      + status                     = "deployed"
      + timeout                    = 300
      + verify                     = false
      + version                    = "36.0.2"
      + wait                       = true
      + wait_for_jobs              = false
 
      + set {
          + name  = "grafana.service.type"
          + value = "NodePort"
        }
    }
 
Plan: 1 to add, 0 to change, 0 to destroy.
 
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
 
Note: You didn't use the -out option to save this plan, so Terraform can't guarantee to take exactly these actions if you run "terraform apply" now.
```

<!--StartFragment-->

### Terraform ready to apply

Terraform apply executes the actions proposed in the Terraform plan and deploys the resources. Run **terraform apply** and then type yes when asked to **Enter a value**.

<!--EndFragment-->

```markdown
$ terraform apply
 
Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
  + create
 
Terraform will perform the following actions:
 
  # helm_release.prometheus-stack will be created
  + resource "helm_release" "prometheus-stack" {
      + atomic                     = false
      + chart                      = "kube-prometheus-stack"
      + cleanup_on_fail            = false
      + create_namespace           = false
      + dependency_update          = false
      + disable_crd_hooks          = false
      + disable_openapi_validation = false
      + disable_webhooks           = false
      + force_update               = false
      + id                         = (known after apply)
      + lint                       = false
      + manifest                   = (known after apply)
      + max_history                = 0
      + metadata                   = (known after apply)
      + name                       = "prometheus-stack"
      + namespace                  = "test-namespace"
      + recreate_pods              = false
      + render_subchart_notes      = true
      + replace                    = false
      + repository                 = "https://prometheus-community.github.io/helm-charts"
      + reset_values               = false
      + reuse_values               = false
      + skip_crds                  = false
      + status                     = "deployed"
      + timeout                    = 300
      + verify                     = false
      + version                    = "36.0.2"
      + wait                       = true
      + wait_for_jobs              = false
 
      + set {
          + name  = "grafana.service.type"
          + value = "NodePort"
        }
    }
 
Plan: 1 to add, 0 to change, 0 to destroy.
 
Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.
 
  Enter a value: yes
 
helm_release.prometheus-stack: Creating...
helm_release.prometheus-stack: Still creating... [10s elapsed]
helm_release.prometheus-stack: Still creating... [20s elapsed]
helm_release.prometheus-stack: Still creating... [30s elapsed]
helm_release.prometheus-stack: Still creating... [40s elapsed]
helm_release.prometheus-stack: Still creating... [50s elapsed]
helm_release.prometheus-stack: Still creating... [1m0s elapsed]
helm_release.prometheus-stack: Still creating... [1m10s elapsed]
helm_release.prometheus-stack: Still creating... [1m20s elapsed]
helm_release.prometheus-stack: Still creating... [1m30s elapsed]
helm_release.prometheus-stack: Still creating... [1m40s elapsed]
helm_release.prometheus-stack: Still creating... [1m50s elapsed]
helm_release.prometheus-stack: Still creating... [2m0s elapsed]
helm_release.prometheus-stack: Creation complete after 2m2s [id=prometheus-stack]
 
Apply complete! Resources: 1 added, 0 changed, 0 destroyed.
```

<!--StartFragment-->

After Terraform apply is complete, you can see the prometheus pods deployed, by running the command:

```markdown
$ kubectl get po -n <namespace>
```

<!--EndFragment-->

![](/img/12.png)

<!--StartFragment-->

You can see the prometheus services, by running the command: 

```markdown
$ kubectl get svc-n <namespace>
```

<!--EndFragment-->

![](/img/13.png)

<!--StartFragment-->

You can fetch the node IP, by running the command: 

```markdown
$ kubectl get nodes -o wide
```

<!--EndFragment-->

![](/img/14.png)

<!--StartFragment-->

Since grafana is exposed as a NodePort, this **PORT**: 32424 and the node's internal IP **INTERNAL-IP**: 172.16.17.168, can be used to access grafana portal as follows:

<!--EndFragment-->

```markdown
https://<INTERNAL-IP>:<PORT>
```

For example, http://172.16.17.168:32424

![](/img/14-2-.png)