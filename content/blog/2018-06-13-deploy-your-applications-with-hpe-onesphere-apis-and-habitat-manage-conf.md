---
title: Deploy your applications with HPE OneSphere APIs and Habitat, manage configuration with Chef Automate
date: 2018-06-13T03:14:24.884Z
author: HPE DEV staff 
tags: ["python","hpe-onesphere","chef","onesphere","habitat","automate"]
path: deploy-your-applications-with-hpe-onesphere-apis-and-habitat-manage-conf
---
Mudassar Shafique

Chef Solutions Architect

<mshafique@chef.io>

## Summary
[HPE OneSphere](https://www.hpe.com/us/en/solutions/cloud/hybrid-it-management.html) provides a hybrid cloud management platform that spans both private cloud as well as public clouds like AWS and Azure. Chef is the leader in continuous automation software, an innovator in cloud native operations and one of the founders of the DevOps movement. [Chef Automate](https://www.chef.io/automate/) is Chef’s continuous automation platform that allows application and infrastructure configuration management at the speed of business. [Habitat](https://www.habitat.sh/) is an open source platform that automates the process of building, deploying, and managing any application in any environment. Previous posts have explained about the [HPE OneSphere Rest APIs](https://developer.hpe.com/blog/getting-started-with-hpe-onesphere-programming) and how to consume them with [Python Module](https://developer.hpe.com/blog/using-hpe-onesphere-python-module). This post will include guidelines on how to deploy an application packaged with Habitat using HPE OneSphere APIs and Python. You will see how easy it is to start managing the VMware based application VMs using Chef Automate. [Sample code](https://github.com/HewlettPackard/hpe-onesphere-chef) is provided with this article and used to explain key concepts. 
## Overview
For this post, I will be following the reference architecture shown below. It presents an example of creating an HPE OneSphere deployment in a private cloud powered by VMware. This deployment can be created with the use of appropriate APIs. At the time of deployment creation, I can initialize the virtual machine to connect with a Chef Automate server, and also install a modern application using Habitat. An example application shows the location of the National Parks in the United States. It is a web application with Java at application layer and MongoDB at the database layer. Chef Automate server will be hosted at AWS Opsworks for this example, it can be hosted at a location of your choice if you choose to customize this example. I will cover some key integration details followed by guidelines on how to use included sample code. Once enabled, this architecture allows efficient cost management using the HPE OneSphere Portal and ongoing configuration management with Chef Automate.

![Figure 1 - Reference Architecture](/uploads/media/2018/6/chef-habitat-onesphere-1528860218340.png)## HPE OneSphere Deployments API
In the HPE OneSphere API reference, you will find Deployments API. Refer to POST operation of Deployments API to create a new deployment.
![Figure 2 - HPE OneSphere Deployments API](/uploads/media/2018/6/chef-habitat-onesphere-figure2-1528860473984.png)

There are several body parameters for the POST, here is how you can fill some key parameters required to create the deployment:

* **name:** Name of your virtual machine deployment
* **publicKey:** Public key used to login to the virtual machine
* **projectUri:** Unique to your HPE OneSphere project, can be obtained using Projects API with userQuery set to project name
* **serviceUri:** Represents services in your HPE OneSphere catalog, can be obtained using Services API with userQuery set to service name
* **zoneURI:** Zone where your service lives e.g. your private HPE Synergy cluster
* **virtualMachineProfileUri:** A VM profile represents CPU, memory and storage resource capacity, can be obtained via virtual-machine-profile API
* **networkUri:** Network assigned to your project
* **userData:** 64-bit encoded command set for VM initialization

An example implementation using Python bindings will look like this, complete script can be found at the included [repository](https://github.com/HewlettPackard/hpe-onesphere-chef).

````Python
def get_api_uris(conn, config):
    projectUri = field_from(conn.GetProjects(user_query=config['project_name']))
    serviceUri = field_from(conn.GetServices(user_query=config['service_name']))
    zoneUri = field_from(conn.GetServices(user_query=config['service_name']), field='zoneUri')
    networkUri = field_from(conn.GetNetworks("zoneUri EQ "+ zoneUri + "AND projectUri EQ " + projectUri))
    virtualMachineProfileUri = "/rest/virtual-machine-profiles/%s" % config['profile_id']
    return {
        'projectUri': projectUri,
        'serviceUri': serviceUri,
        'zoneUri': zoneUri,
        'virtualMachineProfileUri': virtualMachineProfileUri,
        'networks': [{"networkUri":networkUri}]
    }
````
## Connect with Chef Automate
I can configure the VM to initialize with a Chef client installation that will connect it to a Chef Automate Server. A small set of commands can be passed in userData API parameter mentioned above to achieve this. You can find detailed userData script in the reference GitHub [repository](https://github.com/HewlettPackard/hpe-onesphere-chef). Here are some points to note:

* Chef installation can be achieved with a simple command:
	curl -L https://omnitruck.chef.io/install.sh
* A client.rb file contains your Chef Automate server URL, default validator client name and path to private key to authenticate for the first run
* A firstboot.json file is used to set the runlist for your VM. This runlist will contain the Chef recipes that will maintain the configuration of the VM
## Deploy application with Habitat
Habitat allows you to package applications to deploy them in any environment. After configuration your application can be installed with a Chef recipe. You simply need to include the recipe in the runlist of VM listed in the firstboot.json above. Here is an example recipe that installs National Parks application. This is a web application that shows the location of US National Parks on a map. It has an application layer written in Java hosted on Apache Tomcat, whereas MongoDB is used at the data layer. 

````
hab_sup 'default'
hab_service 'np-mongodb'
hab_service 'national-parks' do
    strategy 'at-once'
    bind 'database:np-mongodb.default'
end
````
## Using the sample code
The sample Python code available in the Github [repository](https://github.com/HewlettPackard/hpe-onesphere-chef) provides a reference to create a VM in an HPE OneSphere connected private cloud, install National Parks application on this VM and connect it with your Chef Automate server. 
### Getting your Chef Automate server ready
Your Chef Automate server can live anywhere. I am using an AWS Opsworks based installation in this example. Follow [these](https://docs.aws.amazon.com/opsworks/latest/userguide/gettingstarted-opscm-create.html) steps to create a new Chef Automate server on AWS OpsWorks. Download the [starter kit](https://docs.aws.amazon.com/opsworks/latest/userguide/opscm-starterkit.html) and credentials for newly created server. 

You will need to upload the cookbooks to Chef Automate server before they can be applied to the new VM. Append the Berksfile found in the starter kit with the following:

````
cookbook "hab_national_parks", git: "https://github.com/chef-partners/hab_national_parks.git"
````
Now let’s upload the cookbooks:

````
berks install
berks upload
````
Use the following knife command to create initial validation key for Chef client, you will pass this key to the VM.

````
knife client key create default-validator -f validation.pem --key-name validation
````### Update the config file
Rename onesphere.conf.example file to onesphere.conf and update it with your environment details. Include the path to your public key for VM and validation key for Chef Automate generated earlier.

````
[onesphere]
hostname=https://YOURSERVER.hpeonesphere.com
username=you@example.com
password=ThisIsVerySecretPassword

[project]
project_name=My Example Project
service_name=CentOS7
profile_id=3
public_key_file=public_key.pem


[user_data]
chef_server_url=https://YOUR_AUTOMATE_SERVER/organizations/default
validator_key_file=default-validator.pem
run_list="role[foo]","recipe[bar]","recipe[baz]"
````
### Kick start the deployment
Now is the time to see all your work in action. Run the Python script with deployment name as parameter.

````python
python3 create-node national-parks
````
### Check the results
You should see a new deployment in the HPE OneSphere portal.
![Figure 3 - HPE OneSphere Deployment](/uploads/media/2018/6/chef-habitat-onesphere-figure3-1528860886263.png)

Chef Automate server will show a new node for the same deployment.
![Figure 4 - Chef Automate Node Scan](/uploads/media/2018/6/chef-habitat-onesphere-figure4-1528860923265.png)

And you can see the National Parks application live in browser. Obtain the IP address of your deployment and use the following URL pattern: http://your-deployment-ip:8080/national-parks/
![Figure 5 - National Parks Application](/uploads/media/2018/6/chef-habitat-onesphere-figure5-1528860943049.png)
## Next steps
In this post I have covered how HPE OneSphere and Chef Automate can be used together to achieve cost and configuration management. I also explained how easy it is to install applications using Habitat. Feel free to customize this reference implementation according to your needs. Stay tuned for another post in the HPE and Chef integration series.
