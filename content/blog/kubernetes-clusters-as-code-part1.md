---
title: Kubernetes Cluster as Code - Part 1
date: 2022-06-23T10:15:09.699Z
author: Rachana Kallada Jayaraj
authorimage: /img/photo-1-.jpg
tags:
  - hpe-greenlake
  - devops
  - terraform
  - opensource
  - hpe-greenlake-for-private-cloud-enterprise
  - developer
  - hpe-greenlake-for-private-cloud-enterprise-containers
  - containers-service
---
## Getting started

The process of managing and provisioning computer data centers through machine-readable definition files, also known as Infrastructure-as-Code (IaC), offers many significant benefits. It helps to increase operational agility, simplify management, reduce errors, and save cost. In this post, we will explore some of the benefits of using IaC to build a Kubernetes cluster from scratch, with all the necessary configuration and core services, on HPE GreenLake using Terraform (TF). Storing Kubernetes cluster and favorable configurations as code helps in repeatability and change management.

IaC with Kubernetes is not new. There are providers in the developer community that are quite good and well supported. Using the HPE GreenLake Terraform provider, you can bring up a Kubernetes cluster starting right from the infrastructure layer and way up in the stack to set up desired configurations and applications. For reference, see the below picture.

![](/img/image2022-6-20_12-36-56.png)

HPE GreenLake TF provider brings the Kubernetes stack up on the HPE GreenLake infrastructure, and exposes credentials for other TF providers to integrate further and build the complete stack, as desired. In the diagram above, 2 and 3 are community providers that are available, which can be used in combination with HPE GreenLake TF provider.

One of the options provided by HPE GreenLake is to make it easy for customers to order and operate a private cloud with a mix of virtual machines, containers, and physical servers. This is exactly what the private cloud service is all about. It provides access via a public API, allowing developers to use an infrastructure-as-code type of tool to automate provisioning, for example using Terraform. For customers to try out everything that is mentioned in this blog series, they should have subscribed to **HPE GreenLake for private cloud enterprise** that unifies Virtual Machines, Containers and Bare-metal in one cloud service.

In this two-part blog series, I’ll share my experience as a first-time user of HPE Greenlake TF provider. This blog series aims to provide a step by step walkthrough of how to bring up a Kubernetes cluster using Terraform and how to deploy applications on a pre-created Kubernetes cluster. 

In this first part, I will focus on the pre-requisites needed prior to using HPE GreenLake TF provider and the steps to be followed to bring up a Kubernetes cluster. I will also discuss on how 3rd party community providers can be used in tandem with HPE Greenlake TF provider.

In [the second part of this series](https://developer.hpe.com/blog/kubernetes-cluster-as-code-part-2/), I will illustrate how to deploy applications on a namespace in the pre-created Kubernetes cluster, using Terraform.

## Preparing for infrastructure-as-code implementation 

### Setting up API Client access

You need an API client to authenticate against HPE GreenLake.

> Note: You should have **IAM Owner** role for the appropriate tenant to proceed with API Client creation.

Follow the below steps for API Client creation:

1. From the HPE GreenLake platform, launch the **HPE GreenLake Central console** for the appropriate tenant. Under the settings icon on the tenant **Dashboard** page, select **User Management** option.

![](/img/dashboard.png)

2. Under the **API Clients** tab, click on **Create API Client**.

![](/img/2.png)

3.  Enter a **Name** (mandatory field) and **Description** (optional) for the API client, and click on **Create** button.

![](/img/3.png)

4.  Ensure you make a note of the **Issuer**, **Client ID** and **Client Secret** before clicking on the **Close** button. These details will be exported as environment variables in the next section.

![](/img/4.png)

5. In the **API Clients** page, select the newly created client, and click on **Create Assignment** button.

![](/img/5.png)

6. Create an assignment with **Role Assignment:** **Private Cloud Cluster Owner** and **Space:** **Default.**

![](/img/6.png)

The API client is now ready to be used to run the Terraform resources.

### Selecting a Terraform provider with container service configurations

#### 1. Ensure you have Terraform installed.

Terraform can be installed by following: [Terraform Installation](https://learn.hashicorp.com/tutorials/terraform/install-cli)

Installation can be verified using the below command.

```bash
$ terraform version
Terraform v1.1.9
on linux_amd64
```

#### 2. Export the following environment variables on your machine.

Export the Tenant ID and Space ID:

```markdown
export HPEGL_TENANT_ID=<Tenant ID>
export TF_VAR_HPEGL_SPACE=<Space ID>
```

Export the API client details based on what was noted down.

```markdown
export HPEGL_USER_ID=<Client ID>
export HPEGL_USER_SECRET=<Client Secret>
export HPEGL_IAM_SERVICE_URL=<Issuer>
```

#### 3. Choosing the appropriate Terraform provider.

The first section of the Terraform file will enumerate the “providers” you rely upon for building your infrastructure, and there could be multiple providers in a single TF file. In this case here, you will have the HPE GreenLake provider referenced as hpe/hpegl (**source**) and the available versions to choose from (**version**), in the official [Terraform registry](https://registry.terraform.io/providers/HPE/hpegl/0.2.2).

The first lines of your Terraform configuration file should look like this:

```json
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
```

## Create a cluster resource

### Terraform data source for cluster blueprint

In order to use the data source available for cluster blueprint, you should add the below block in your Terraform file, and specify the cluster blueprint name. Using this data source, Terraform will fetch the cluster Blueprint ID associated with it.

In the below block, "demo" is the cluster blueprint **name** provided:

```json
data "hpegl_caas_cluster_blueprint" "bp" {
  name = "demo"
  site_id = data.hpegl_caas_site.blr.id
}
```

The cluster blueprint ID can now be fetched by using:

```json
blueprint_id = data.hpegl_caas_cluster_blueprint.bp.id
```

### Terraform data source for site

In order to use the data source available for site, you should add the below block in your Terraform file, and specify the site name. Using this data source, Terraform will fetch the site ID associated with it.

In the below block, "BLR" is the site **name** provided:

```json
data "hpegl_caas_site" "blr" {
  name = "BLR"
  space_id = ""
}
```

The site ID can now be fetched by using:

```json
site_id = data.hpegl_caas_site.blr.id
```

###  Terraform data source for cluster

In order to use the data source available for cluster, you should add the below block and provide the cluster name and space id. Using this data source, Terraform will fetch the cluster server and user token associated with it.

In the below block, "tf-test" is the **name** of the pre-created Kubernetes cluster.

```json
data "hpegl_caas_cluster" "test" {
  name     = "tf-test"
  space_id = ""
}
```

The **host** (cluster server) and **token** (user token) can now be fetched from the cluster kubeconfig using:

```json
host     = yamldecode(base64decode(data.hpegl_caas_cluster.test.kubeconfig)).clusters[0].cluster.server
token    = yamldecode(base64decode(data.hpegl_caas_cluster.test.kubeconfig)).users[0].user.token
```

### Terraform resource for cluster

In order to create a Kubernetes cluster using the cluster resource, the following values should be specified in the **cluster-create.tf** file shown below:

1. Site Name: Fill in the appropriate site **name** in the **hpegl\_caas\_site** block. In the below example, name= "BLR" 
2. Cluster Blueprint Name: Fill in the appropriate cluster blueprint **name** in the **hpegl\_caas\_cluster\_blueprint** block. In the below example, name= "demo" 
3. Cluster Name: Fill in the cluster **name** of your choice in the **hpegl\_caas\_cluster** block. In the below example, name= "tf-test"

> Note: Here, the space\_id is automatically set to the value specified while exporting TF\_VAR\_HPEGL\_SPACE.

**cluster-create.tf**

> Note: You can name this file according to your preference. We are using cluster-create.tf here for easy reference.

```json
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

You can get information about each of the data sources and resources mentioned above from [Github](https://github.com/HPE/terraform-provider-hpegl/tree/main/docs).

### Initializing workspace & synchronizing infrastructure components

Place the cluster-create.tf file in your working directory and initialize the working directory using the command: **terraform init**

```markdown
$ terraform init
 
Initializing the backend...
 
Initializing provider plugins...
- Finding hpe/hpegl versions matching ">= 0.2.0"...
- Installing hpe/hpegl v0.2.2...
- Installed hpe/hpegl v0.2.2 (signed by a HashiCorp partner, key ID D1F277A1AC66CE3D)
 
Partner and community providers are signed by their developers.
If you'd like to know more about provider signing, you can read about it here:
https://www.terraform.io/docs/cli/plugins/signing.html
 
Terraform has created a lock file .terraform.lock.hcl to record the provider
selections it made above. Include this file in your version control repository
so that Terraform can guarantee to make the same selections by default when
you run "terraform init" in the future.
 
Terraform has been successfully initialized!
 
You may now begin working with Terraform. Try running "terraform plan" to see
any changes that are required for your infrastructure. All Terraform commands
should now work.
 
If you ever set or change modules or backend configuration for Terraform,
rerun this command to reinitialize your working directory. If you forget, other
commands will detect it and remind you to do so if necessary.
```

###  Terraform ready to plan

Terraform plan is a dry run that lets you preview the changes that Terraform plans to make to your infrastructure based on the data you provide in your Terraform file. To see this, run: **terraform plan**

```markdown
$ terraform plan
 
Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
  + create
 
Terraform will perform the following actions:
 
  # hpegl_caas_cluster.test will be created
  + resource "hpegl_caas_cluster" "test" {
      + api_endpoint                      = (known after apply)
      + appliance_name                    = (known after apply)
      + blueprint_id                      = "982be053-ae7d-4623-9af7-69a299e68bc9"
      + cluster_provider                  = (known after apply)
      + created_date                      = (known after apply)
      + default_storage_class             = (known after apply)
      + default_storage_class_description = (known after apply)
      + health                            = (known after apply)
      + id                                = (known after apply)
      + k8s_version                       = (known after apply)
      + kubeconfig                        = (known after apply)
      + last_update_date                  = (known after apply)
      + machine_sets                      = (known after apply)
      + machine_sets_detail               = (known after apply)
      + name                              = "tf-test"
      + service_endpoints                 = (known after apply)
      + site_id                           = "ecb6b8a4-3303-4528-96d1-42230336a9ec"
      + space_id                          = "8d5dfbc0-f996-4e45-ab34-e719588a96ca"
      + state                             = (known after apply)
    }
 
Plan: 1 to add, 0 to change, 0 to destroy.
 
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
 
Note: You didn't use the -out option to save this plan, so Terraform can't guarantee to take exactly these actions if you run "terraform apply" now.
```

### Terraform ready to apply

Terraform apply executes the actions proposed in the Terraform plan and deploys the resources. Run the command: **terraform apply** and type **yes** when asked to **Enter a value**.

```markdown
$ terraform apply
 
Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
  + create
 
Terraform will perform the following actions:
 
  # hpegl_caas_cluster.test will be created
  + resource "hpegl_caas_cluster" "test" {
      + api_endpoint                      = (known after apply)
      + appliance_name                    = (known after apply)
      + blueprint_id                      = "982be053-ae7d-4623-9af7-69a299e68bc9"
      + cluster_provider                  = (known after apply)
      + created_date                      = (known after apply)
      + default_storage_class             = (known after apply)
      + default_storage_class_description = (known after apply)
      + health                            = (known after apply)
      + id                                = (known after apply)
      + k8s_version                       = (known after apply)
      + kubeconfig                        = (known after apply)
      + last_update_date                  = (known after apply)
      + machine_sets                      = (known after apply)
      + machine_sets_detail               = (known after apply)
      + name                              = "tf-test"
      + service_endpoints                 = (known after apply)
      + site_id                           = "ecb6b8a4-3303-4528-96d1-42230336a9ec"
      + space_id                          = "8d5dfbc0-f996-4e45-ab34-e719588a96ca"
      + state                             = (known after apply)
    }
 
Plan: 1 to add, 0 to change, 0 to destroy.
 
Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.
 
  Enter a value: yes  hpegl_caas_cluster.test: Creating...
hpegl_caas_cluster.test: Still creating... [10s elapsed]
hpegl_caas_cluster.test: Still creating... [1m0s elapsed]
hpegl_caas_cluster.test: Still creating... [5m0s elapsed]
hpegl_caas_cluster.test: Still creating... [10m0s elapsed]
hpegl_caas_cluster.test: Still creating... [20m0s elapsed]
hpegl_caas_cluster.test: Still creating... [25m0s elapsed]
hpegl_caas_cluster.test: Still creating... [25m10s elapsed]
hpegl_caas_cluster.test: Still creating... [25m20s elapsed]
hpegl_caas_cluster.test: Still creating... [25m30s elapsed]
hpegl_caas_cluster.test: Still creating... [25m40s elapsed]
hpegl_caas_cluster.test: Still creating... [25m50s elapsed]
hpegl_caas_cluster.test: Still creating... [26m0s elapsed]
hpegl_caas_cluster.test: Still creating... [26m11s elapsed]
hpegl_caas_cluster.test: Still creating... [26m21s elapsed]
hpegl_caas_cluster.test: Still creating... [26m31s elapsed]
hpegl_caas_cluster.test: Still creating... [26m41s elapsed]
hpegl_caas_cluster.test: Still creating... [26m51s elapsed]
hpegl_caas_cluster.test: Still creating... [27m1s elapsed]
hpegl_caas_cluster.test: Still creating... [27m11s elapsed]
hpegl_caas_cluster.test: Still creating... [27m21s elapsed]
hpegl_caas_cluster.test: Still creating... [27m31s elapsed]
hpegl_caas_cluster.test: Still creating... [27m41s elapsed]
hpegl_caas_cluster.test: Still creating... [27m51s elapsed]
hpegl_caas_cluster.test: Still creating... [28m1s elapsed]
hpegl_caas_cluster.test: Still creating... [28m11s elapsed]
hpegl_caas_cluster.test: Still creating... [28m21s elapsed]
hpegl_caas_cluster.test: Still creating... [28m31s elapsed]
hpegl_caas_cluster.test: Still creating... [28m41s elapsed]
hpegl_caas_cluster.test: Still creating... [28m51s elapsed]
hpegl_caas_cluster.test: Still creating... [29m1s elapsed]
hpegl_caas_cluster.test: Creation complete after 29m1s [id=8a3396db-ae26-44fd-a128-264c357f71fb]
 
Apply complete! Resources: 1 added, 0 changed, 0 destroyed.
```

From the HPE GreenLake platform, launch the **HPE GreenLake Central console** for the appropriate tenant, and from the **Dashboard**, select **Clusters** to view the list of clusters. You will see **tf-test** cluster has been created successfully.

![](/img/create.png)

## Delete a cluster resource

In Terraform, clean-up can be done using the destroy command. This will automatically use the HPE GreenLake provider to clean the infrastructure in HPE GreenLake. Run the following command: **terraform destroy**

```markdown
$ terraform destroy
hpegl_caas_cluster.test: Refreshing state... [id=8a3396db-ae26-44fd-a128-264c357f71fb]
 
Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
  - destroy
 
Terraform will perform the following actions:
 
  # hpegl_caas_cluster.test will be destroyed
  - resource "hpegl_caas_cluster" "test" {
      - api_endpoint          = "https://gl-caas.gl-hpe.local:10003" -> null
      - appliance_name        = "Austin" -> null
      - blueprint_id          = "982be053-ae7d-4623-9af7-69a299e68bc9" -> null
      - cluster_provider      = "ecp" -> null
      - created_date          = "2022-06-12T11:11:55Z" -> null
      - default_storage_class = "gl-sbc-glhc-nimblestor" -> null
      - health                = "ok" -> null
      - id                    = "8a3396db-ae26-44fd-a128-264c357f71fb" -> null
      - k8s_version           = "v1.20.11.hpe-2" -> null
      - kubeconfig            = "YXBpVmVyc2lvbjogdjEKY2x1c3RlcnM6Ci0gY2x1c3RlcjoKICAgIGluc2VjdXJlLXNraXAtdGxzLXZlcm
lmeTogdHJ1ZQogICAgc2VydmVyOiBodHRwczovL2dsLWNhYXMuZ2wtaHBlLmxvY2FsOjEwMDAzCiAgbmFtZTogZGVmYXVsdApjb250ZXh0czoKLSBjb2
50ZXh0OgogICAgY2x1c3RlcjogZGVmYXVsdAogICAgbmFtZXNwYWNlOiBkZWZhdWx0CiAgICB1c2VyOiBkZWZhdWx0CiAgbmFtZTogZGVmYXVsdApjdX
JyZW50LWNvbnRleHQ6IGRlZmF1bHQKa2luZDogQ29uZmlnCnByZWZlcmVuY2VzOiB7fQp1c2VyczoKLSBuYW1lOiBkZWZhdWx0CiAgdXNlcjoKICAgIH
Rva2VuOiBleUpoYkdjaU9pSlNVekkxTmlJc0ltdHBaQ0k2SWpKM2NVNTRhbFpvT0RJM04xVTRRalZ0TjJ3elNUQnpVVmhxUkhCVWVrOURVRk5PT1VWRVc
ExOW5ha0VpZlEuZXlKcGMzTWlPaUpyZFdKbGNtNWxkR1Z6TDNObGNuWnBZMlZoWTJOdmRXNTBJaXdpYTNWaVpYSnVaWFJsY3k1cGJ5OXpaWEoyYVdObFl
XTmpiM1Z1ZEM5dVlXMWxjM0JoWTJVaU9pSnJkV0psTFhONWMzUmxiU0lzSW10MVltVnlibVYwWlhNdWFXOHZjMlZ5ZG1salpXRmpZMjkxYm5RdmMyVmpj
bVYwTG01aGJXVWlPaUowWlhKeVazlkUkU2cXA1RG5od3pDZnRvX2FQMXBPZwo=" -> null
      - last_update_date      = "2022-06-12T11:41:53Z" -> null
      - machine_sets          = [
          - {
              - count                = 1
              - machine_blueprint_id = "25d70b74-1048-4aae-8994-aa72f08cfacb"
              - name                 = "master"
              - os_image             = ""
              - os_version           = ""
            },
          - {
              - count                = 1
              - machine_blueprint_id = "ebcb6ad2-b201-4c92-9dad-1bbb0b90cde3"
              - name                 = "worker"
              - os_image             = ""
              - os_version           = ""
            },
        ] -> null
      - machine_sets_detail   = [
          - {
              - compute_type         = "General Purpose"
              - count                = 1
              - machine_blueprint_id = "25d70b74-1048-4aae-8994-aa72f08cfacb"
              - machine_provider     = "vmaas"
              - machine_roles        = [
                  - "controlplane",
                  - "etcd",
                ]
              - machines             = [
                  - {
                      - created_date     = "2022-06-12T11:11:55Z"
                      - health           = "ok"
                      - hostname         = "172.20.20.102"
                      - id               = "4247"
                      - last_update_date = "2022-06-12T11:41:35Z"
                      - name             = "k8s-tf-test-master-mshls-hwlgf"
                      - state            = "ready"
                    },
                ]
              - name                 = "master"
              - networks             = [
                  - "VM_Production",
                ]
              - os_image             = "sles-custom"
              - os_version           = "15"
              - proxy                = ""
              - size                 = "Large"
              - size_detail          = [
                  - {
                      - cpu             = 4
                      - ephemeral_disk  = 500
                      - memory          = 16384
                      - name            = "Large"
                      - persistent_disk = 0
                      - root_disk       = 120
                    },
                ]
              - storage_type         = "General Purpose"
            },
          - {
              - compute_type         = "General Purpose"
              - count                = 1
              - machine_blueprint_id = "ebcb6ad2-b201-4c92-9dad-1bbb0b90cde3"
              - machine_provider     = "vmaas"
              - machine_roles        = [
                  - "worker",
                ]
              - machines             = [
                  - {
                      - created_date     = "2022-06-12T11:11:55Z"
                      - health           = "ok"
                      - hostname         = "172.20.20.121"
                      - id               = "4248"
                      - last_update_date = "2022-06-12T11:41:35Z"
                      - name             = "k8s-tf-test-worker-58mvq-qvdch"
                      - state            = "ready"
                    },
                ]
              - name                 = "worker"
              - networks             = [
                  - "VM_Production",
                  - "iSCSI_A",
                  - "iSCSI_B",
                ]
              - os_image             = "sles-custom"
              - os_version           = "15"
              - proxy                = ""
              - size                 = "xLarge"
              - size_detail          = [
                  - {
                      - cpu             = 8
                      - ephemeral_disk  = 500
                      - memory          = 32768
                      - name            = "xLarge"
                      - persistent_disk = 0
                      - root_disk       = 120
                    },
                ]
              - storage_type         = "General Purpose"
            },
        ] -> null
      - name                  = "tf-test" -> null
      - service_endpoints     = [
          - {
              - endpoint  = "https://gl-caas.gl-hpe.local:10004"
              - name      = "Kubernetes Dashboard"
              - namespace = "kubernetes-dashboard"
              - type      = "system"
            },
        ] -> null
      - site_id               = "ecb6b8a4-3303-4528-96d1-42230336a9ec" -> null
      - space_id              = "8d5dfbc0-f996-4e45-ab34-e719588a96ca" -> null
      - state                 = "ready" -> null
    }
 
Plan: 0 to add, 0 to change, 1 to destroy.
 
Do you really want to destroy all resources?
  Terraform will destroy all your managed infrastructure, as shown above.
  There is no undo. Only 'yes' will be accepted to confirm.
 
  Enter a value: yes
 
hpegl_caas_cluster.test: Destroying... [id=8a3396db-ae26-44fd-a128-264c357f71fb]
hpegl_caas_cluster.test: Still destroying... [id=8a3396db-ae26-44fd-a128-264c357f71fb, 10s elapsed]
hpegl_caas_cluster.test: Still destroying... [id=8a3396db-ae26-44fd-a128-264c357f71fb, 1m0s elapsed]
hpegl_caas_cluster.test: Still destroying... [id=8a3396db-ae26-44fd-a128-264c357f71fb, 2m0s elapsed]
hpegl_caas_cluster.test: Still destroying... [id=8a3396db-ae26-44fd-a128-264c357f71fb, 3m0s elapsed]
hpegl_caas_cluster.test: Still destroying... [id=8a3396db-ae26-44fd-a128-264c357f71fb, 4m0s elapsed]
hpegl_caas_cluster.test: Still destroying... [id=8a3396db-ae26-44fd-a128-264c357f71fb, 5m0s elapsed]
hpegl_caas_cluster.test: Still destroying... [id=8a3396db-ae26-44fd-a128-264c357f71fb, 6m0s elapsed]
hpegl_caas_cluster.test: Still destroying... [id=8a3396db-ae26-44fd-a128-264c357f71fb, 7m40s elapsed]
hpegl_caas_cluster.test: Destruction complete after 7m48s
 
Destroy complete! Resources: 1 destroyed.
```

From the HPE GreenLake platform, launch the **HPE GreenLake Central console** for the appropriate tenant, and from the **Dashboard**, select **Clusters** to view the list of clusters. You will see **tf-test** cluster has been deleted.

![](/img/delete.png)

## Additional 3rd party provider of your choice from community

You can also use a 3rd party provider of your choice from the community. In this section, we will discuss on how to create a namespace in GL CaaS cluster using Kubernetes community provider.

### Kubernetes provider

Below is the code block for adding **Kubernetes** provider:

```json
provider "kubernetes" {
  host     = yamldecode(base64decode(data.hpegl_caas_cluster.test.kubeconfig)).clusters[0].cluster.server
  token    = yamldecode(base64decode(data.hpegl_caas_cluster.test.kubeconfig)).users[0].user.token
  insecure = true
}
```

### Terraform resource for namespace

You can create a Kubernetes namespace using the **kubernetes_namespace** resource and providing a namespace **name** of your choice. In the below example, name = "test-namespace".

```json
resource "kubernetes_namespace" "test-namespace" {
  metadata {
    name = "test-namespace"
  }
  lifecycle {
    ignore_changes = [
      metadata[0].labels,
    ]
  }
}
```

### Namespace creation using Terraform

**namespace-create.tf** : Below is a complete example of using the Kubernetes provider and creating a namespace on a pre-created Kubernetes cluster.

> Note: You can name this file according to your preference. We are using namespace-create.tf here for easy reference.

```json
# Copyright 2020 Hewlett Packard Enterprise Development LP
 
# Set-up for terraform >= v0.13
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
 
data "hpegl_caas_cluster" "test" {
  name     = "tf-test-7"
  space_id = var.HPEGL_SPACE
}  
 
provider "kubernetes" {
  host     = yamldecode(base64decode(data.hpegl_caas_cluster.test.kubeconfig)).clusters[0].cluster.server
  token    = yamldecode(base64decode(data.hpegl_caas_cluster.test.kubeconfig)).users[0].user.token
  insecure = true
}
 
resource "kubernetes_namespace" "test-namespace" {
  metadata {
    name = "test-namespace"
  }
  lifecycle {
    ignore_changes = [
      metadata[0].labels,
    ]
  }
}
```

### Initializing workspace & synchronizing infrastructure components

Place the namespace-create.tf file in your working directory and initialize the working directory using the command: **terraform init**

```markdown
$ terraform init
 
Initializing the backend...
 
Initializing provider plugins...
- Finding hpe/hpegl versions matching ">= 0.2.0"...
- Installing hpe/hpegl v0.2.2...
- Installed hpe/hpegl v0.2.2 (signed by a HashiCorp partner, key ID D1F277A1AC66CE3D)
 
Partner and community providers are signed by their developers.
If you'd like to know more about provider signing, you can read about it here:
https://www.terraform.io/docs/cli/plugins/signing.html
 
Terraform has created a lock file .terraform.lock.hcl to record the provider
selections it made above. Include this file in your version control repository
so that Terraform can guarantee to make the same selections by default when
you run "terraform init" in the future.
 
Terraform has been successfully initialized!
 
You may now begin working with Terraform. Try running "terraform plan" to see
any changes that are required for your infrastructure. All Terraform commands
should now work.
 
If you ever set or change modules or backend configuration for Terraform,
rerun this command to reinitialize your working directory. If you forget, other
commands will detect it and remind you to do so if necessary.
```

### Terraform ready to plan

Terraform plan is a dry run that lets you preview the changes that Terraform plans to make to your infrastructure based on the data you provide in your Terraform file. To see this, run: **terraform plan**

```markdown
$ terraform plan
 
Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
  + create
 
Terraform will perform the following actions:
 
  # kubernetes_namespace.test-namespace will be created
  + resource "kubernetes_namespace" "test-namespace" {
      + id = (known after apply)
 
      + metadata {
          + generation       = (known after apply)
          + name             = "test-namespace"
          + resource_version = (known after apply)
          + uid              = (known after apply)
        }
    }
 
Plan: 1 to add, 0 to change, 0 to destroy.
 
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
 
Note: You didn't use the -out option to save this plan, so Terraform can't guarantee to take exactly these actions if you run "terraform apply" now.
```

### Terraform ready to apply

Terraform apply executes the actions proposed in the Terraform plan and deploys the resources. Run **terraform apply** and then type **yes** when asked to **Enter a value**.

```markdown
$ terraform apply  Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
  + create
 
Terraform will perform the following actions:
 
  # kubernetes_namespace.test-namespace will be created
  + resource "kubernetes_namespace" "test-namespace" {
      + id = (known after apply)
 
      + metadata {
          + generation       = (known after apply)
          + name             = "test-namespace"
          + resource_version = (known after apply)
          + uid              = (known after apply)
        }
    }
 
Plan: 1 to add, 0 to change, 0 to destroy.
 
Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.
 
  Enter a value: yes
 
kubernetes_namespace.test-namespace: Creating...
kubernetes_namespace.test-namespace: Creation complete after 0s [id=test-namespace]
 
Apply complete! Resources: 1 added, 0 changed, 0 destroyed.
```

You can verify the created namespace **test-namespace**, by running the command: **kubectl get namespace**

![](/img/11.png)

## Next up

In [my next blog post](https://developer.hpe.com/blog/kubernetes-cluster-as-code-part-2/), we will continue our discussion on deploying applications on a pre-created Kubernetes cluster.
