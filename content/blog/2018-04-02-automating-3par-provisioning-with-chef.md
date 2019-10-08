---
title: Automating 3PAR provisioning with Chef
date: 2018-04-02T08:46:25.782Z
author: Chris Snell 
tags: ["chef","hpe-3par","storeserv","cookbook","devops","configuration-management"]
path: automating-3par-provisioning-with-chef
---
# Using Chef to configure your 3PAR Storeserv

Traditionally storage has been one of the last components to be integrated into Automation. It has been viewed as one of the “untouchables” along with networking due to its complexity and risk potential. With the increased development of APIs, including the 3PAR WSAPI, including storage provisioning tasks into your DevOps project is not only becoming simpler but also a requirement to meet SLAs and policy requirements.

## A quick intro to Chef
Chef is a configuration management tool that uses a declarative syntax. It is different than scripting in a few ways, but mainly:

  * You define what the environment should look like, not how to do it. This removes a lot of complexity, and simplifies your configuration code.
  * Chef code lives primarily in recipes. 1 or more recipes are packaged inside a cookbook that has a single purpose. Cookbooks act like policies that are versioned and checked into source control, unlike many scripts.
  * Chef integrates with a whole host of tools that make testing easy and meaningful. ChefSpec, InSpec, and Test Kitchen are some of these tools. Just like your applications, you can test and release your configuration code using automated pipelines.

 Some common reasons you'd want (or need) to use a configuration management tool like Chef are to have success at scale, increase consistency, and gain visibility into your environment.
 For more in-depth information on Chef and its architecture, refer to [https://docs.chef.io](https://docs.chef.io)

## Developing with Chef and 3PAR
If you're new to Chef, I'd encourage you to go through some of the tutorials and self-paced trainings at [learn.chef.io](https://learn.chef.io) before going any further.

About the only thing you'll need to get started developing is some basic terminal knowledge and the ChefDK installed. This will give you Ruby, as well as tools such as Berkshelf, Test Kitchen, ChefSpec, Foodcritic, and Rubocop. For this guide, we'll use a Bash terminal; if you're on Windows, you may have to modify some of the system commands accordingly.

## Prerequisites
* 3PAR OS - 3.2.2 MU4, 3.3.1 MU1
* Ruby - 2.4.1 or higher
* Chef - 12.1 or higher
* WSAPI service should be enabled on the 3PAR storage arrays

## Examples
This section will help you get started using the 3PAR cookbook, and in doing so, explain some key concepts pertaining to Chef and how to use the 3PAR cookbook. It is also designed to show you how to create a basic recipe that includes real, working code and comments about how the resources work.

The main README found on [https://github.com/HewlettPackard/hpe3par_chef_cookbook](https://github.com/HewlettPackard/hpe3par_chef_cookbook) shows a few details about the resources in this cookbook, but mainly includes code to demonstrate the properties you can set on a resource. As such, many of those code "examples" are incomplete or contain much more than you'd want to use.

1.	To get started, we'll create a new directory named **chef-repo**; this is where we'll put our new cookbooks. Also in this directory, lives the **_chef/knife.rb_** configuration file used to connect to a Chef server.

```bash
$ mkdir chef-repo
$ cd chef-repo
```

2.	We’ll create a directory within our **_chef-repo_** named cookbooks, where our cookbooks will live:
```bash
$ mkdir cookbooks
$ cd cookbooks
```

3.	Now we will need to download the **_hpe3par_** cookbook.
```bash
# You can use knife to download the hpe3par cookbook or you can use git – use whichever you are most comfortable with

#----------------------------------------
# Using git example
# (make sure you are in chef-repo/cookbooks)
$ git clone https://github.com/HewlettPackard/hpe3par chef_cookbook.git
# We need to rename the directory to hpe3par from hpe3par_chef_cookbook – see note
$ mv hpe3par_3par_cookbook hpe3par

#----------------------------------------
# Using knife example
$ knife cookbook site download hpe3par

# Now we will need to untar the download
$ tar xvf hpe3par-*.tar.gz
# Now the hpe3par cookbook lives in chef-repo/hpe3par

# You can remove the tar file if you’d like, it is no longer needed
$ rm hpe3par-*.tar.gz
```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Note:** If you want to directly use from [https://github.com/HewlettPackard/hpe3par_chef_cookbook](https://github.com/HewlettPackard/hpe3par_chef_cookbook), you need to rename the cookbook directory to **_hpe3par_** from **_hpe3par_cookbook_** to use the resources.

4. Now we can use the chef command to generate a new cookbook named 'my-3par':

```bash
$ chef generate cookbook my_3par
$ cd my_3par
```

You can examine the files and folders that were created `ls -la`, the most important ones that we will be working with will be **_metadata.rb_** and **_recipes/default.rb_**.

 5. At this point, as noted in the main README, we need to specify a dependency to the `hpe3par` cookbook. We do this by adding the following line to the end of the **_metadata.rb_** file:

 ```bash
 # my_3par/metadata.rb
 ...
 depends 'hpe3par'
 ```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Tip:** Check out the [Chef docs](https://docs.chef.io/config_rb_metadata.html) to see what all else you can put in the **_metadata.rb_** file.

6.	Now we can create our first recipe. Open up **_recipes/default.rb_** and add the following lines:

```bash
#Configure Storage system
#Enter name, IP, user, and password

node.default['hpe3par']['storage_system'] = {
        name: 'my-3par',
        ip: '192.168.0.100',
        user: '3par_user',
        password: 'secret123'
}


#Create Virtual Volume ‘my_1st_chef_vol’ definitions

hpe3par_virtual_volume 'my_1st_chef_vol' do
  storage_system node['hpe3par']['storage_system']
  cpg node.default['hpe3par']['virtual_volume']['cpg'] = 'FC_r1'
  size node.default['hpe3par']['virtual_volume']['size'] = 10.0
  size_unit node.default['hpe3par']['virtual_volume']['size_unit'] = 'GiB'
  type node.default['hpe3par']['virtual_volume']['type'] = 'thin'
  snap_cpg node.default['hpe3par']['virtual_volume']['snap_cpg'] = 'FC_r1'

  action :create
end
```

**Tip:** We are defining the 3PAR connectivity settings within the recipe, there may be instances where you have multiple recipes in a cookbook and rather than defining the storage system (or other parameters i.e. virtual volumes, vvsets, etc) within each recipe, we can create global variables by setting parameters in the **_attributes/default.rb_** file.

For example:

```ruby
# global storage system - configured in attributes/default.rb
default['hpe3par']['storage_system'] = {
    name: 'my-3par',
    ip: '192.168.0.100',
    user: '3par_user',
    password: 'secret123'
}

#virtual_volume global parameters
default['hpe3par']['virtual_volume']['name'] = 'my_1st_chef_vol'
default['hpe3par']['virtual_volume']['cpg'] = 'FC_r1'
default['hpe3par']['virtual_volume']['size'] = 1024.0
default['hpe3par']['virtual_volume']['size_unit'] = 'MiB'
default['hpe3par']['virtual_volume']['type'] = 'thin'
default['hpe3par']['virtual_volume']['compression'] = false
default['hpe3par']['virtual_volume']['snap_cpg'] = 'FC_r1'
```

The recipe will change slightly as well. Note the parameters are missing, they are now being defined in the **_attributes/default.rb_** file:

```ruby
#Example recipe using attributes/default.rb defininition file

#Create Virtual Volume ‘my_1st_chef_vol’ definitions

hpe3par_virtual_volume node['hpe3par']['virtual_volume']['name'] do
  storage_system node['hpe3par']['storage_system']
  cpg node['hpe3par']['virtual_volume']['cpg']
  size node['hpe3par']['virtual_volume']['size']
  size_unit node['hpe3par']['virtual_volume']['size_unit']
  type node['hpe3par']['virtual_volume']['type']
  snap_cpg node['hpe3par']['virtual_volume']['snap_cpg']

  action :create
end
```

To learn more about attributes go here: [docs.chef.io/attributes](https://docs.chef.io/attributes.html)

7.	Now let’s run our recipe and see what happens:
```bash
$ chef-client -z -o my_3par::default
````

**Note:** If you see an error saying it can't find the correct cookbook, this is because Chef either can’t find our cookbooks or we haven't downloaded the cookbook dependencies (**_hpe3par_**) yet. We can fix this by creating a **_knife.rb_** file at **_chef-repo/.chef/knife.rb_** and adding:

```ruby
# See http://docs.chef.io/config_rb_knife.html for more information on knife configuration options

current_dir = File.dirname(__FILE__)
cookbook_path ["#{current_dir}/../cookbooks"]

# If you're behind a proxy, you'll need to set the http_proxy environment variable or set the http_proxy option here
# http_proxy 'http://proxy.company.com:3128'
```

Now download the **hpe3par** cookbook by running:

```bash
# (make sure we are in chef-repo/cookbooks)
$ pwd
$ knife cookbook site download hpe3par

# Now we will need to untar the download
$ tar xvf hpe3par-*.tar.gz
# Now the hpe3par cookbook lives in chef-repo/hpe3par

# You can remove the tar file if you’d like, it is no longer needed
$ rm hpe3par-*.tar.gz
```

8.	Now re-run **`chef-client -z -o my_3par::default`**. This time it should succeed, and if you log into your SSMC, you'll see the new volume **_my_1st_chef_vol_**.

That's it! You can re-run the recipe and it will tell you if the volume already exists.

Now that you've gotten your feet wet, please take another look at the main README to see the complete list of resources available to you. The 3PAR cookbook includes many of the same capabilities that are available via the SSMC.
