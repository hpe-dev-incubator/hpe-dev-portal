---
title: Leveraging cloud-init with HPE OneSphere
date: 2018-07-18T15:24:46.836Z
author: Didier.Lalli@hpe.com 
tags: ["powershell","cloud-init","hpe-onesphere"]
path: leveraging-cloud-init-with-hpe-onesphere
---
## What's cloud-init?
Cloud-init is a cloud technology which allows you to configure automatically a newly provisioned virtual machine in a public or private cloud. It is supported by all modern operating systems and most cloud providers.
It uses a cloud-config file to describe some configuration items, and allows for some scripting.
The configuration file is typically provided by a user at ordering time (via a user-data field) in the cloud portal and allows the configuration of a canned image with specific settings such as machine hostname, users, password, etc. It could also bootstrap a more complex configuration management system script (i.e.: Ansible, Chef).

## cloud-config file format
The cloud-config configuration file is written in YAML and it has to start with the following first line: 
````
#cloud-config
````
After this first line, it can contain any number of configuration directives (aka sections) . The most common directives are:
- **users**: we can use this directive to modify the user configuration
- **groups**: we can use this directive to modify the group configuration
- **chpasswd**: to set user password value and policy
- **packages**: to install additional software packages
- **ssh_authorized_keys**: to set authorized SSH keys for users
- **ssh_keys**: to inject SSH private keys
- **ca-certs**: to setup certificate authorities
- **resolv_conf**: to manage DNS configuration
- **power_state**: reboot the machine
- **write_files**: manipulate files on target filesystem
 
Each directive expects parameters, which will be set on the following lines, indented from directive as shown in the example below:
```` 
#cloud-config
manage-resolv-conf: true
resolv_conf:
  nameservers:
    - 192.168.1.1
    - 192.168.1.2
  domain: mydomain.com
````
It can also embed commands, which will be executed on the target system. The directive to do this is runcmd followed by lines of commands to be executed. For example:
````
#cloud-config
runcmd:
  - sed -i -e '/^Port/s/^.*$/Port 2112/' etc/ssh/sshd_config
  - sed -i -e '/^PermitRootLogin/s/^.*$/PermitRootLogin no/' /etc/ssh/sshd_config
  - restart ssh
````
You can mix configuration directives and runcmd commands in the same cloud-config. For example we could be generating a script using write_files directive then execute that same script using the runcmd directive, which becomes a very powerful post image configuration technique. In order to make sure the YAML syntax of our cloud-config file is correct we can use an online syntax validator at: https://coreos.com/validate/ 
 
> More on cloud-init at: http://cloudinit.readthedocs.io/en/latest/topics/format.html#cloud-config-data 
 
## Installing cloud-init
In order to be able to get user-data from a cloud portal executed on a target VM, we need to be sure that the image selected for the VM has cloud-init installed. Cloud-init is available for most Linux packages and can be installed using `yum -y install cloud-init` or `apt-get -y install cloud-init`

> Note that many of the standard public cloud images are provided with cloud-init already installed. This is the case with AWS AMI Linux images, for example. On Azure, several images are also cloud-init ready, check the following link: https://docs.microsoft.com/en-us/azure/virtual-machines/linux/using-cloud-init

## What about Windows?
Although cloud-init was initially provided on Linux, it is also available for Windows systems from https://cloudbase.it/cloudbase-init/ as Open source.
 
## Using cloud-init from HPE OneSphere 
In [HPE OneSphere](https://www.hpe.com/us/en/solutions/cloud/hybrid-it-management.html) cloud-init can be used when ordering a new deployment from the catalog of services.

![](/uploads/media/2018/7/pic1-1531927366800.jpg "HPE OneSphere Service Catalog")

When ordering through the GUI of HPE OneSphere, there is an option to cut/paste a cloud-config (a.k.a user-data field) as shown below:

![](/uploads/media/2018/7/pic2-1531927391837.jpg "HPE OneSphere Deployment Form")

## Using cloud-init from HPE OneSphere API
However, when consuming from outside the HPE OneSphere GUI, we can achieve the same using the HPE OneSphere API. Let us look at the details of the [API reference](https://developer.hpe.com/api/onesphere/) for call to POST /rest/deployments

![](/uploads/media/2018/7/pic3-1531927428142.jpg "HPE OneSphere API for POST /rest/deployments")

There is a *userData* which can be passed in a JSON payload which will contain the cloud-config content for cloud-init.

> The userData string is expected in Base64

## Using cloud-init from PowerShell
We can also use the PowerShell module for HPE OneSphere available from the [Microsoft PowerShell Gallery](https://www.powershellgallery.com/items?q=hpeonesphere&x=0&y=0) to deploy infrastructure and leverage cloud-init. We need to install (once) the following PowerShell module or simply import it (if already installed):

`Install-module hpeonesphere` or `Import-module hpeonesphere`

Then we can use the add-hpeosdeployment function to create a new VM using cloud-init. The help command reveals the user-data string parameter to use for passing the cloud-config content to HPE OneSphere
````
PS> help Add-HPEOSDeployment

NAME
    Add-HPEOSDeployment

SYNOPSIS
    Adds Deployment to OneSphere Management portal

SYNTAX
    Add-HPEOSDeployment [-DeploymentName] <String> [-Project] <Object> [-Service] <Object> [-VirtualMachineProfile] <Object> [-Networks] <Object[]> [[-Zone] <Object>] [[-Region] <Object>] [[-PublicKey]
    <String>] [[-UserData] <String>] [-NeedExternalIp] [<CommonParameters>]

DESCRIPTION
    Adds Deployment to OneSphere Management portal. Assumes portal is already connected

RELATED LINKS
    http://www.hpe.com/onesphere

REMARKS
    To see the examples, type: "get-help Add-HPEOSDeployment -examples".
    For more information, type: "get-help Add-HPEOSDeployment -detailed".
    For technical information, type: "get-help Add-HPEOSDeployment -full".
    For online help, type: "get-help Add-HPEOSDeployment -online"
````

## Putting it all together - a customer use case
There are many usage of cloud-init which can be used to bootstrap a Chef or a Puppet agent, or call a Salt Minion. However, in this use case, we would like to use CentOS as a target machine, using a standard image both on our (VMware based) private cloud and on AWS public cloud. The idea is to keep the number of curated images small and customize those images just-in-time with cloud-init, whether these are public or private images. In this use case, we simply would like to install the latest version of Docker on the target system. Moreover, because we use an automated CI/CD tooling, we need this to be done using a PowerShell script, without any GUI and human intervention.
First, let us assemble the following YAML file as a cloud-config script. This script will install Docker and some of the dependencies.
### cloud-config
````
package_upgrade: true
package_reboot_if_required: true
runcmd:
 - sudo sed -i -e 's/##proxy/proxy/' /etc/yum.conf
 - sudo yum remove docker docker-common docker-selinux docker-engine
 - sudo yum install -y yum-utils device-mapper-persistent-data lvm2
 - sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
 - sudo yum -y install docker-ce
 - sudo systemctl start docker
````
We have saved this file as cloud-config.yaml
### PowerShell Script
Let us now control the provisioning of this VM with the passing of the cloud-config file using a PowerShell script. In this script, we collect the parameters required by the add-hpeosdeployment (project, service, zone, network, virtual machine profile, public key and userdata)
````
# Connect to HPE OneSphere
connect-hpeos -portal https://<myportal>.hpeonesphere.com `
 didier.lalli@hpe.com

# Collect parameters for creating new deployment 
$my_project=get-hpeosproject  -UserQuery Didier
$my_service=get-hpeosservice -UserQuery Centos7-cloudinit
$my_zone=get-hpeoszone  | where name -eq SynergyVSANvC1
$my_network=Get-HPEOSNetwork -zone $my_zone | where name `
-eq Network-TenantExternal171
$my_vmprofile=Get-HPEOSVirtualMachineProfile -zone $my_zone | where name `
-eq m1.small

# Process public key from text file
$my_key=Get-Content .\key.pub 

# Process userData from yaml file
$my_userdata=Get-Content .\cloud-config.yaml
$my_64baseuserdata=[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($my_userdata))

# Order new deployment
$my_newdeployment=Add-HPEOSDeployment -DeploymentName test-with-cloud-init `
-Project $my_project -Service $my_service `
-VirtualMachineProfile $my_vmprofile -Networks $my_network `
-PublicKey $my_key -UserData $my_64baseuserdata
````
We should also enter a loop to query the status of the deployment until it becomes Ok and then retrieve the allocated IP address with something like the following:
````
do { $d=get-hpeosdeployment -id $my_newdeployment.id ; sleep 10 } `
while ($d.Status -ne "Ok")
$my_ip= $d.deploymentEndpoints[0].address
````
Finally we can login to the target machine at $my_ip using our SSH private key. We can immediately run the Docker toolset, and check that the cloud-init process installed the latest version automatically.

![](/uploads/media/2018/7/pic4-1531927439405.jpg "Docker installed by cloud-init on target VM")

 
## Troubleshooting cloud-init
Of course, things might go wrong. In this case:
- Make sure the YAML code has a valid syntax using a site like http://www.yamllint.com/
- If reading YAML from file, make sure YAML file has Unix style line feed (not Windows)
- Login to target machine 
- verify cloud-init log file at /var/log/cloud-init.log
- Make sure the cloud-config script is the one expected on target machine. It should be located in /var/lib/cloud/instance/user-data.txt

