---
title: An Open Service Broker Project Delivers a Sample DevOps Environment to AWS
date: 2019-05-23T19:07:42.640Z
author: Peng Liu 
tags: []
path: an-open-service-broker-project-delivers-a-sample-devops-environment-to-a
---
As described by [Wikipedia, “DevOps](https://en.wikipedia.org/wiki/DevOps) is a set of software development practices that combines software development (Dev) and information technology operations (Ops).” DevOps shortens the systems development life cycle while delivering features, fixes, and updates frequently in close alignment with business objectives. In a DevOps environment, different disciplines collaborate, making quality everyone's “job.” DevOps is often hailed as a giant step towards bringing better software to market faster and many organizations now view it as an important goal to establish an efficient DevOps pipeline and attain a true DevOps environment.  

Because it is so unlike traditional software development methods, implementing DevOps introduces some challenges. DevOps works differently and the working environment uses distinct virtual machines, tool sets, and utilities. Infrastructure and the surrounding software environment needs to be provisioned from scratch, maintained, and managed differently from ITOps.

There are many ways to provision a DevOps environment. This blog describes one method that uses Open Service Broker, AWS CloudFormation, and Ansible. This methodology uses Python, AWS CloudFormation template, and Ansible playbooks. These tools are all put under version control so that you can trace changes and find and debug potential problems. This method has several advantages:

* Open Service Broker (OSB) is a service delivery method. For any portal or component that supports OSB API, the service can be brought up to their portal to make it available for its users. [HPE OneSphere](https://www.hpe.com/us/en/solutions/cloud/onesphere.html) supports key OSB APIs so you can easily register the DevOps broker to HPE OneSphere to be consumed by HPE OneSphere customers.

* AWS CloudFormation provides a common language to describe and provision all the infrastructure resources in an AWS cloud environment. Using AWS CloudFormation also makes it easier to manage the resources. For example, a DevOps environment normally requires more than one virtual machine. With AWS CloudFormation, you can group all virtual machines into one [stack.](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacks.html)

* Ansible is used to provision tools, utilities, and applications in the infrastructure. The tools and applications may be any software such as Java, Git, Nginx, MariaDB, PHP, and Jenkins. IT admins can centrally manage the Ansible playbook easily and then push out to the DevOps environment. Different versions of applications can be dynamically installed on the fly instead of pre-burned into a virtual machine image.

### Prepare the environment for running OSB service and Ansible

In this first step, prepare the virtual machine environment for hosting the OSB broker service.

* Ubuntu 16.04 (the hosting VM) in azure.com was chosen for hosting the OSB broker service. Other versions of Linux (such as CentOS) will also work. The hosting environment can be either in a cloud (such as AWS) or on-prem (such as VMware).
* In the hosting VM, use ssh-keygen to generate an SSH secure key pair, then create the security key pair in AWS and copy/paste the content of public key over to the AWS key pair. Please remember the key pair name, which will be used later.
* Make sure that [python 3.5.2 or above is installed](http://ubuntuhandbook.org/index.php/2017/07/install-python-3-6-1-in-ubuntu-16-04-lts/) in the hosting VM. 
* Make sure that [pip3 is installed](https://linuxize.com/post/how-to-install-pip-on-ubuntu-18.04/) in the hosting VM.
* [Install Ansible](https://tecadmin.net/install-ansible-on-ubuntu-16-04-xenial/) in the hosting VM.
* Make sure the Ansible working folder exists in the hosting VM.
    * Normally, it is “/etc/ansible”. Create the folder if it does not exist.
* [Install the following Ansible roles in the Ansible working folder](https://docs.ansible.com/ansible/latest/reference_appendices/galaxy.html#installing-roles) in the hosting VM.
    * apache
    * jenkins
    * php
    * phpunit
* Configure Ansible dynamic inventory modules in the Ansible working folder in the hosting VM.  
    * [Download ec2.py](https://github.com/ansible/ansible/blob/devel/contrib/inventory/ec2.py).     
    * Modify first line of ec2.py to make sure python3 is chosen: #!/usr/bin/env python3.     
    * [Download ec2.ini](https://github.com/ansible/ansible/blob/devel/contrib/inventory/ec2.ini).   
    * Modify ec2.ini to point at the right regions, for example: regions = us-west-1
#regions_exclude = us-gov-west-1, cn-north-1.   
* [Install awscli](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) in the hosting VM.

### Get and run the OSB broker service

* Create an OSB working folder in the hosting VM. Use any folder you prefer.
* [Get the OSB broker service](https://github.hpe.com/peng-liu/osb-devops) 
    * You can download the zip file and unzip the package to the OSB working folder.
* Install the required the packages
    * sudo pip3 install --no-cache-dir -r requirements.txt
* Start the OSB service broker: 
    * python3 osb_template.py

### Register the DevOps OSB service in HPE OneSphere

Log in to HPE OneSphere instance, choose Settings (see Figure 1), then click on Catalog Registry.



![5bf2e1a0cd93d0796238ae01-blog-content-1558638905137](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/5/picture1-1558638905136.png)

Figure 1. HPE OneSphere Settings

Register the OSB broker service in the catalog by clicking the plus (+) sign in the Catalog Registry page.


![5bf2e1a0cd93d0796238ae01-blog-content-1558638965078](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/5/picture11-1558638965078.png)

Figure 2. Register OSB broker service.

The broker service now appears in the HPE OneSphere catalog.


![5bf2e1a0cd93d0796238ae01-blog-content-1558639040081](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/5/picture13-1558639040081.png)

Figure 3. The OSB broker service appears as osb-devops.

### Deploy an instance of the OSB broker service – DevOps environment

The DevOps OSB broker service offers two virtual environments; one is for Jenkins with PHP and PHPUnit, and the other is for an Apache Webserver with PHP.

Deploying this broker service provisions two AWS CloudFormation stacks. Each stack has one virtual machine. Corresponding software will be installed into each VM respectively, with all dependent tools and utilities. The deployment will also create security groups for both virtual machines and open ports for Jenkins service and WebServer.

Figure 4 shows the screen start deploying an instance of the DevOps environment. 


![5bf2e1a0cd93d0796238ae01-blog-content-1558639104804](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/5/picture14-1558639104803.png)

Figure 4. Start deploying an instance of the OSB broker service.

The deployment of OSB broker service within HPE OneSphere is in progress.


![5bf2e1a0cd93d0796238ae01-blog-content-1558639161151](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/5/picture15-1558639161150.png)

Figure 5. The deployment in progress.

In the AWS CloudFormation service portal, two stacks (one for Jenkins and the other for the web server) are in the process of being deployed.


![5bf2e1a0cd93d0796238ae01-blog-content-1558639251376](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/5/picture16-1558639251375.png)

Figure 6. Showing the DevOps stacks creation in progress.

After a while, the deployment of the OSB service broker completes.


![5bf2e1a0cd93d0796238ae01-blog-content-1558639363749](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/5/picture20-1558639363748.png)

Figure 7. The completed OSB service broker deployment

After an instance of the OSB broker service is successfully deployed, you can access the DevOps environment from either the AWS CloudFormation portal or HPE OneSphere portal.

In the AWS CloudFormation portal, when you click on each stack, you should see both the SSH connection information and a WebUrl link.


![5bf2e1a0cd93d0796238ae01-blog-content-1558639415295](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/5/picture111-1558639415294.png)

Figure 8. AWS CloudFormation portal showing the SSH connection and WebUrl link.

In the HPE OneSphere portal, access information is available by clicking on the Access link in the deployment page.


![5bf2e1a0cd93d0796238ae01-blog-content-1558639474818](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/5/picture671-1558639474817.png)

Figure 9. Access page shows both SSH connection and Web URL link.

To open the Jenkins portal, click on the WebUrl link of the Jenkins stack. Follow the on-screen instructions to log in with a default initial password, and you will be connected to the Jenkins portal.


![5bf2e1a0cd93d0796238ae01-blog-content-1558639531780](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/5/picture551-1558639531779.png)

Figure 10. Jenkins portal.

A web server home page served by a sample index page (PHP) will open when you click on the WebUrl link of the WebServer stack.


![5bf2e1a0cd93d0796238ae01-blog-content-1558639581209](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/5/picturel1-1558639581208.png)

Figure 11. Web server index page.

### Delete the DevOps deployment

You can delete a deployment in HPE OneSphere. The deletion will further delete the DevOps stacks in AWS. This means that the security group and all virtual machines instances will be deleted.


![5bf2e1a0cd93d0796238ae01-blog-content-1558639696893](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/5/pictures1-1558639696893.png)

Figure 12. Deleting the DevOps deployment from HPE OneSphere.

![5bf2e1a0cd93d0796238ae01-blog-content-1558639745848](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/5/picture001-1558639745847.png)

Figure 13. DevOps stacks are being deleted in the AWS CloudFormation portal.

### Unregister the OSB broker service

You can also disable an OSB broker service and delete it from the HPE OneSphere portal.

### Use the test program to simulate a service consumer

The [test program (test.py) in the repository](https://github.hpe.com/peng-liu/osb-devops) calls out the OSB broker service to list the catalog and provision the DevOps environment in AWS. It can be used and modified to include more functions to simulate a portal environment where the OSB broker service is to be registered.

### Next Steps

This blog shows a very simple beginning step to automate the DevOps provisioning process using OSB, AWS CloudFormation, and Ansible. Stay tuned for more blog posts regarding this topic, and more mature and complete packages for managing the DevOps environment. 
