---
title: How to integrate Chef automation with HPE GreenLake for private cloud
date: 2021-04-13T17:25:38.920Z
author: Vinnarasu Ganesan, John Lenihan & Junmei Zhang
authorimage: /img/Avatar1.svg
tags:
  - hpe-greenlake
---
![](/img/gettyimages-521980823_4x3_1600_0_72_rgb.jpg)

# Introduction

HPE GreenLake for private cloud is one of the cloud services powered by the HPE GreenLake Central platform. This service provides a cloud experience to manage virtual machines (VMs) in your on-premises, pay-per-use datacenter. It is an integrated solution comprised of HPE optimized hardware and software, fully managed by HPE. The solution provides rich application management capabilities for cloud-native and traditional applications along with a self-service portal and integrates with a lot of popular automation tools such as Ansible, Chef, Puppet, and others. This article explains how to integrate your existing Chef automation platform, Chef Infra, with HPE GreenLake for private cloud to help improve efficiency and minimize errors caused by manual configuration. And the tutorial walks you through the step-by-step process for two use case scenarios: 

• Scenario 1: Add Chef automation integration, and provision a new application instance (i.e. Nginx) bootstrapped to an integrated Chef Infra server using HPE GreenLake for private cloud self-service user interface (UI). 

• Scenario 2: Bootstrap an existing VM instance to the integrated Chef infra server using the HPE GreenLake for private cloud automation feature Tasks.

Before we dive into the use cases, let me give you an overview of Chef and its prerequisites before any integration with HPE GreenLake for private cloud.

# Chef overview

Chef is one of the most widely adopted open source automation solutions. Chef Infra is a powerful automation platform that transforms infrastructure into code. It provides for both infrastructure and application automation for physical or virtual machines, and helps in reducing manual and repetitive tasks. Chef Infra works on a three-tier client server model: Chef workstation, Chef Infra server, and Chef Infra client nodes. 

**Chef workstation:** This is where a user develops configuration files, such as Chef recipes and cookbooks, and uploads them to the Chef Infra server. 

**Chef Infra server:** This acts a hub for the configuration data. It stores cookbooks, policies that are applied to Chef Infra client nodes, and metadata that describes each registered Chef node. 

**Chef Infra client nodes:** Chef nodes are registered and managed by Chef Infra server. Chef client is installed on each node, which helps in setting up the communication between the Chef Infra server and Chef node. Nodes use Chef client to ask the Chef server for configuration details, such as recipes, templates, and file distributions. Chef client then does the configuration work on the nodes. 

For more information on Chef architecture, see <https://www.tutorialspoint.com/chef/index.htm>.

# Chef integration prerequisites with HPE GreenLake for private cloud

To integrate Chef with HPE GreenLake for private cloud, the following pre-requisites are assumed: 

• You have a Chef Infra server:  It can be hosted on either a public or private network. For a Chef Infra server hosted in a private network, make sure it is reachable from the HPE GreenLake Central platform.

• You have configured the organization, organization validator key, users, and user key on a Chef Infra server.

• You have uploaded a sample cookbook **mydocker** to the Chef Infra server. Refer to this [blog post](https://medium.com/@pierangelo1982/cooking-docker-nginx-with-chef-server-95f179aa17ca) to create the sample cookbook. The cookbook has a single recipe **default.rb** that will be referred as **recipe\[mydocker]** in the Chef runlist. The cookbook installs a docker environment on the VM, and then installs a Nginx docker container. A Chef runlist defines all the information necessary for Chef to configure a node into desired state.

```yaml
#
# Cookbook:: mydocker
# Recipe:: default
#
# Copyright:: 2021, The Authors, All Rights Reserved.
docker_service 'default' do
  action [:create, :start]
end

# Create Docker Service directory
directory '/etc/systemd/system/docker.service.d' do
  owner 'root'
  group 'root'
  mode '0755'
  action :create
end

# Creating Doxker Proxy Configuration
cookbook_file '/etc/systemd/system/docker.service.d/proxy.conf' do
  source 'proxy.conf'
  mode "0644"
  action :create
end

docker_service 'default' do
  action :restart
end


# Pull latest image
docker_image 'nginx' do
  tag 'latest'
  action :pull
end


# Run container exposing ports
docker_container 'my_nginx' do
  repo 'nginx'
  tag 'latest'
  port '85:80'
  volumes "/home/docker/default.conf:/etc/nginx/conf.d/default.conf:ro"
  volumes "/home/docker/html:/usr/share/nginx/html"
end

# create file default.conf for volumes doccker
template "/home/docker/default.conf" do
  source "default.conf.erb"
  #notifies :reload, "service[default]"
end

# create file index.html for volumes docker
template '/home/docker/html/index.html' do
  source 'index.html.erb'
  variables(
    :ambiente => node.chef_environment
  )
  action :create
  #notifies :restart, 'service[httpd]', :immediately
end
```

# Scenario 1: Add Chef automation integration and provision a new application instance Nginx bootstrapped to the integrated Chef Infra server using HPE GreenLake for private cloud self-service UI

For this scenario, we need to integrate Chef automation with the HPE GreenLake for private cloud first, then we provision a new application instance (i.e. Nginx) bootstrapped to the integrated Chef Infra server.

## Follow the below steps to add Chef automation integration in the HPE GreenLake for private cloud. 

1. In the HPE GreenLake for private cloud main menu dashboard, navigate to **Administration > Integrations**

  Image1.

2. Click the green **+ NEW INTEGRATION** drop-down menu, and select integration type **Chef**

   Image2.

3. Populate the following fields and save changes.

    * Name: Name of the Chef integration; for example, Local_Chef_Server
    
    * Chef Endpoint: URL of Chef Infra server API endpoint in [https://api.example.com](https://api.example.com) format. Do not add /organization/xxxx here, which is populated in the Chef Organization field. In this example, **https://chefserver.localdomain** is used.


    * Chef Version: Chef client version, which needs to be installed in the nodes. Use 16.1.X or greater. Version can be changed to use a different/more recent version of Chef. 


    * Chef Organization: Chef server organization


    * Chef User: Chef Infra server user


    * User Private Key: The private key of the user with access to this Chef Infra server
    
    * Organization Validator: Validator key for the organization
    
    * DataBags: Optional. Add it if it is configured in the Chef Infra server

Image3.

## Create a new infrastructure group for Chef integration.

1. From HPE GreenLake for private cloud main menu dashboard, navigate to **Infrastructure > Groups**

Image4.

2. Click the green **+ CREATE** icon to add a new group with the name of **ManagedChef**. Expand the **Advanced Options** section in the **Config Management** field, and select the previously configured Chef Integration **Local_Chef_Server**.

Image5.

Save changes. The added Chef integration is now available for use in HPE GreenLake for private cloud during instance provisioning. Please note that one infrastructure group can only associate with one Chef server.


## Provision the new instance.

With Chef integration added to an infrastructure group, when users provision a new instance into the infrastructure group, a **Chef** section will appear in the **Configure** section of the provisioning wizard. By default, Chef is enabled, but it can be disabled by expanding the **Chef** section and unchecking **Enable Chef**. Follow the steps below to provision the new instance using **CREATE INSTANCE** wizard.

1. In the wizard **GROUP** page, select the previous configured **ManagedChef** infrastructure group, enter the instance name **Demo2**, select environment, and click next.

Image6.

2. In the **CONFIGURE** menu, expand the **Chef** section and update the required fields as shown in the screen capture below. In the **CHEF RUNLIST** field, enter the Chef recipe **recipe[mydocker]** from the cookbook you previously uploaded to your Chef Infra server in the Prerequisite section.  If the **CHEF RUNLIST** field is left empty, the instance will be just bootstrapped to the Chef Infra server.

Image7.

3. Review the instance configuration and complete the installation.

Image8.

4. On successful completion of Instance provisioning, the instance **Demo2** is bootstrapped to the Chef server integrated to the selected Group. Expanding the instance **History** tab shows the bootstrap task status.

Image9.

5. You can also confirm the instance **Demo2** from Chef-Manage dashboard of the integrated Chef Infra server. Chef-Manage needs to be installed explicitly on the Chef Infra server. The screen below shows that instance **Demo2** is bootstrapped to the Chef server.

Image10.

Based on the recipe specified in the **CHEF RUNLIST** defined in the provisioning wizard, the Chef client on the newly created instance **demo2** pulled the recipe from the Chef server and configured an Nginx docker container on the instance.

Image11.

# Scenario 2: Bootstrap an existing VM instance to the integrated Chef Infra server using the HPE GreenLake for private cloud automation feature Tasks

HPE GreenLake for private cloud provides an option to bootstrap existing VM instances to Chef Infra server. This section describes a step-by-step process you can use to achieve that.

1. The first step is to create a Chef bootstrap task. On the HPE GreenLake for private cloud main menu screen, navigate to **Provisioning > Automation > Tasks**, and create a Chef bootstrap task. A task is an individual automation element; for example, a script or a Chef cookbook. Select **TYPE** as **Chef bootstrap** and choose the previously integrated Chef Infra server. In the **RUN LIST** field, enter **recipe[mydocker]** to refer the recipe from the cookbook you previously uploaded to your Chef Infra server. 

Image12.


2. To bootstrap any VM instances with this task, on the HPE GreenLake for private cloud main menu, navigate to **Provisioning > Instances**, and select the VM instance that needs to be bootstrapped. Select **Actions > Run** Task. The screen below shows the VM instance **Demo** detail page.

Image13.


3. Select the **chef-bootstrap** task created previously and execute it by clicking **EXECUTE**.

Image14.

Task will start the execution on the instance.

Image15.

4. On completion, the instance status is green and the task status can be seen in **History** tab.

Image 16. 

The instance is now bootstrapped as a Chef client registered in the Chef Infra server. The recipe is run as specified in the **Run List** from Chef-Manage dashboard of the integrated Chef Infra server, shown in screenshot below.

Image17.


# Summary
Chef Infra is a powerful automation platform that transforms infrastructure into code. By integrating it with HPE GreenLake for private cloud, you can utilize your existing Chef Infra code to automate the VMs and applications provisioned in HPE GreenLake for private cloud. This will greatly reduce errors caused by manual configuration and improve efficiency and agility.


To learn more about HPE GreenLake cloud services – the cloud that comes to wherever your apps and data live – visit the [HPE GreenLake homepage](https://www.hpe.com/greenlake). 


To learn more about Chef architecture, visit the [Chef Tutorial](https://www.tutorialspoint.com/chef/index.htm).   

More HPE GreenLake for private cloud white papers can be found on the [HPE Developer platform page](https://developer.hpe.com/platform/hpe-greenlake/home). 
