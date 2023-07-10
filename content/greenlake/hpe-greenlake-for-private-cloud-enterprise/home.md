---
title: HPE GreenLake for Private Cloud Enterprise
version: "1.0"
description: "HPE GreenLake for Private Cloud Enterprise reimagines the private
  cloud experience with a scalable, pay-per-use, enterprise-grade solution
  delivered to you as a managed service across your locations—from edge to
  cloud. "
image: /img/greenlake/greenlake.svg
width: large
priority: 9
active: true
---
<style>
li {
   font-size: 27px;
   line-height: 33px;
   max-width: none;
}
</style>

[HPE GreenLake for Private Cloud Enterprise](https://www.hpe.com/us/en/hpe-greenlake-private-cloud-enterprise.html) reimagines the private cloud experience with a scalable, pay-per-use, enterprise-grade solution delivered to you as a managed service across your locations — from edge to cloud. Built for both cloud-native and traditional applications, it supports the self‑service deployment of container, bare metal, and virtual machine services.

Its design principles are centered on leveraging open standards and open systems, preventing vendor lock-in with the ability to place your workloads in the environment of your choice based on cost and performance. You also get the full advantage of modern DevOps and automation with infrastructure-as-code (IaC) configuration management, REST APIs, and cloud command shell, for streamlined infrastructure provisioning and integration with existing DevOps/CI toolchains—speeding deployments for cloud admins and developers alike.

For a quick overview of the service, please watch the video below.

<iframe width="560" height="315" src="https://www.youtube.com/embed/ONRh2hUxrDk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## HPE GreenLake for Private Cloud Enterprise services

### Containers

Provision Kubernetes clusters on-demand to deploy and scale containerized applications and cloud-native workloads. The default container service is built on the HPE Ezmeral Runtime Environment and based on CNCF-compliant Kubernetes. You can create container clusters using VMs and/or bare-metal compute instances to meet a range of performance requirements.

HPE GreenLake for Private Cloud Enterprise also supports select third-party container platforms such as Amazon Elastic Kubernetes (EKS), so you can leverage the same container runtimes in your public and private cloud, streamlining workload portability and providing a consistent cloud-native experience across hybrid clouds for cloud or tenant admins (cloud system admins, DevOps admins, and more) and cloud consumers (developers, project contributors, and such).

### Bare Metal

Provision bare-metal instances on-demand to support workloads that require the performance of a dedicated physical server. You can organize bare-metal instances into compute groups; define a unique set of resources for each group (compute instances, storage volumes, VLAN segments, IP pools, SSH keys, and more).  Easily bring your sanctioned, hardened operating system images or your own virtualization or container technology stacks to meet your corporate IT standards and versioning policies.

### Virtual machines

Provision virtual machines on-demand to support traditional virtualized workloads.  The service supports the popular VMware ESXi™ hypervisor. Choose from a variety of virtual machine instances with different compute instance types and sizes to meet the price-performance requirements of different workloads. In addition, HPE supports predefined VM instance families aligned to compute modules with various memory, storage, and CPU characteristics. You can also define and size your VM instances to address the specific requirements of any application.  HPE GreenLake for Private Cloud Enterprise offers integrations with popular configuration management platforms, including Ansible, Ansible Tower, Chef, and Puppet.

To learn, more review the [HPE GreenLake for Private Cloud Enterprise technical white paper](https://www.hpe.com/psnow/doc/a50007892enw).

## Developer experience

HPE GreenLake for Private Cloud Enterprise includes powerful DevOps tools that streamline and automate repetitive tasks with repeatable workflows, super-charging productivity and increasing agility for faster, more consistent code collaboration. 

* Fast self-service access to leverage the platform and its resources 
* Reduce manual DevOps tasks with automation
* Integrate with your familiar DevOps toolchains
* Enable and disable projects and deployment pipelines
* Easily monitor and manage the status of projects


![HPE GreenLake for Private Cloud Enterprise architecture](/img/hpegl4pce-architecture.png "HPE GreenLake for Private Cloud Enterprise architecture")

### Infrastructure as code (IaC)

Leverage IaC functionality offered by the HPE GreenLake Terraform Provider to provision and manage your private cloud resources. The Terraform Registry resources can be [downloaded from here](https://registry.terraform.io/providers/HPE/hpegl/latest/docs).

Get some real, hands-on experience by registering for this workshops-on-demand:
[Introduction to Virtual Machine Infrastructure-as-Code using Terraform and HPE GreenLake for Private Cloud Enterprise](https://developer.hpe.com/hackshack/workshop/36)

### REST APIs
HPE GreenLake APIs provide a secure, standardized interface for automating common and repetitive tasks, programmatically configuring and provisioning services, and integrating applications with cloud services. The APIs are based on the OpenAPI specification and governed by administratively defined RBACs and strong authentication methods.

### Cloud shell

Cloud shell as an interactive browser-based shell enables secure access to your HPE GreenLake for Private Cloud Enterprise resources. Development packages, orchestration tools and the latest IaC libraries are pre-installed as part of the cloud shell.

* Access pre-loaded with latest libraries and utilities with in-built authentication 
  * Pre-packaged orchestration & IaC tools and templates (HPE GreenLake specific resources and tooling)
  * Development packages such as Terraform, Git, Docker / Docker Compose/ Docker CLI, Golang (latest), Python 3.x
* Clone GitHub repo in cloud shell, debug and deploy applications into HPE GreenLake for Private Cloud Enterprise resources
* Create and manage VM and container resources via IaC using HPE GreenLake Terraform modules
* Secure access to HPE GreenLake for Private Cloud Enterprise resources by automatically injecting the right security credentials (like kubeconfig for container clusters)
* Each cloud shell instance backed by 1GB of persistent storage provisioned for User's $HOME directory 

![HPE GreenLake for Private Cloud Enterprise cloud shell](/img/hpegl4pce-cloud-shell.png "HPE GreenLake for Private Cloud Enterprise cloud shell")

### DevOps

Cloud or tenant admins and cloud consumers can create DevOps projects—workspaces where authorized administrators and contributors can configure external connections such as GitHub, create and manage automated CD pipelines for external accounts, and associate Kubernetes container clusters with the deployment pipelines.

![HPE GreenLake for Private Cloud Enterprise DevOps CI/CD pipeline](/img/hpegl4pce-devops.png "HPE GreenLake for Private Cloud Enterprise DevOps CI/CD pipeline")

For more information on the HPE GreenLake DevOps capabilities, please watch these videos:

**Create a DevOps Project with HPE GreenLake for Private Cloud Enterprise**

<iframe width="560" height="315" src="https://www.youtube.com/embed/gU_LM-JHqz0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

**Create a CD pipeline with a release trigger with HPE GreenLake for Private Cloud Enterprise**

<iframe width="560" height="315" src="https://www.youtube.com/embed/i95-FO0bvgg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
 

## Resources

[Technical white paper](https://www.hpe.com/psnow/doc/a50007892enw)

[Support documentation](https://support.hpe.com/hpesc/public/docDisplay?docId=a00092451en_us&page=GUID-D06895CD-C9CC-4E85-AA8F-A9D3D22D5874.html)

- - -

## Workshops-on-Demand

Take advantage of our free, Jupyter-Notebook based workshops available in the HPE Developer [Hack Shack](https://developer.hpe.com/hackshack/). These technical workshops provide you with an in-depth, hands-on learning experience where you can interact with and learn from the experts. Designed to fit your schedule, these workshops are available 24/7 – any time, from anywhere. [Introduction to Virtual Machine Infrastructure-as-Code using Terraform and HPE GreenLake for Private Cloud Enterprise](https://developer.hpe.com/hackshack/workshop/36) is available today.

<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
<div class="w3-container w3-center w3-margin-bottom">
  <a href="/hackshack/workshops"><button type="button" class="button">Try now!</button></a>
</div>
