---
title: "Open Sourcing Workshops-on-Demand part 2: How to Deploy the infrastructure"
date: 2025-10-09T12:50:13.758Z
featuredBlog: true
priority: 3
author: Frederic Passeron
authorimage: /img/fp-hpewod.jpg
disable: false
tags:
  - opensource
  - Workshops-on-Demand
---
In the first [article](https://developer.hpe.com/blog/willing-to-build-up-your-own-workshops-on-demand-infrastructure/) of this series, I described the reasons behind the decision to open source our Workshops-on-Demand (WoD) project and gave you a comprehensive picture of the project's overall infrastructure. In this second article, I will explain how to deploy it.

The overall infrastructure can run on physical servers or Virtual Machines. We usually designate one server for the frontend and a second server for the backend. You could also decide to separate every single component of each side.

![](/img/howto-wod-5.png "wod infrastucture")

## H﻿ow to deploy your own Workshops-on-Demand infrastructure...

A﻿s explained in the previous [article](https://developer.hpe.com/blog/willing-to-build-up-your-own-workshops-on-demand-infrastructure/), the project is split into multiple repositories from the architectural and public / private aspects. Since the publication if of the previous article, additionnal repositories showed up as the installation process evolved over time. The architecture is divided between the frontend, api-db, and backend. The project admins will need to decide whether they are willing to develop and propose public-only content to the participants or add any proprietary and private content.

I﻿ will start with the simpliest scenario: A public-only approach. Then I will dive into the specificities related the private approach.

### P﻿ublic-only deployment: No private backend nor private workshops

**Important Note:**  

**T﻿his part is compulsory for any type of deployment. Public only or public + private.**

F﻿irst, you need a repository to clone. The Workshops-on-Demand GitHub projects can be found [here](https://github.com/Workshops-on-Demand/). W﻿e have packaged the project over several GitHub repos. Each repository handles a specific role in the overall architecture.

Here's a quick look at what can be found in each:

![](/img/wod-repository-2025.png "WOD Repositories")

**[w﻿od-notebooks](https://github.com/Workshops-on-Demand/wod-notebooks):** Public Workshops-on-Demand based on Jupyter Notebooks.

* You can test them live at <https://hackshack.hpedev.io/workshops>

**[w﻿od-install](https://github.com/Workshops-on-Demand/wod-install):** Installer part of the Workshops-on-Demand project.

**[w﻿od-backend](https://github.com/Workshops-on-Demand/wod-backend):** Back-end part of our Workshops-on-Demand setup. 

**[w﻿od-frontend](https://github.com/Workshops-on-Demand/wod-frontend):** Frontend part of the Workshops-on-Demand project.

* Based on NGINX and NodeJS technologies, it provides the participtants' Registration Portal used to enable booking of the workshops.

**[w﻿od-api-db](https://github.com/Workshops-on-Demand/wod-api-db):** Workshops-on-Demand registration portal application

* Open API 3.0 based api used to manage the Workshops-on-Demand project. It also provides a database hosting the different status of participants, workshops, and students. 

**[w﻿od-private](https://github.com/Workshops-on-Demand/wod-private):** Example Private configuration for Workshops-on-Demand (WoD).

**[w﻿od-frontend-private](https://github.com/Workshops-on-Demand/wod-frontend-private):** Private Frontend part of the Workshops-on-Demand project.

**[w﻿od-api-db-private](https://github.com/Workshops-on-Demand/wod-api-db-private):** Workshops-on-Demand registration portal application

* This provide examples for creating your own cutomization layer on top of the public standard WoD Backend / WoD Notebooks content. Do not put any confidential data here as this is a public repository!

**Note**: T﻿here are now 9 repositories available for now. 

![](/img/wod-blogserie2-2repos.png "Workshops-on-Demand repositories")

The Workshops-on-Demand project provides:

* An Installer that allows you to install either Backend, Api-DB server, or Frontend using a single line of command.
* A complete JupyterHub server with some add-ons (additional JupyterHub kernels, Ansible galaxies, and PowerShell libraries) on your system, ready to use.
* A Postfix server used for the procmail API 
* An Ansible engine to allow automation 
* A Fail2Ban service 
* An Admin user to manage everything 
* A set of scripts to handle different tasks such as: 

  * Notebooks deployment
  * JupyterHub compliancy
  * Users compliancy
  * Security Management
  * Workshops updates

#### Backend server preparation:

The installation process is handled by a dedicated repo : wod-install. This repo needs to be cloned on every single machine  constituting the WoD architecture. B﻿efore cloning the wod-install repository, you will need to prepare the server that will host the backend features. When ready, you will proceed with the cloning and then the installation process.

##### Prerequesites:

In order to setup the backend server, you will need:

* A fresh OS install on physical / virtualized server running Ubuntu 24.04 or Centos 7.9 leveraging any deployment mechanism of your choice.(e.g. iLO, vagrant, etc.). You may even use this vagrant file to automatically generate a complete setup leveraging vagrant, libvirt and QEMU/KVM. 
* A Linux account with sudo priviledges on your Linux distro. Name it `install`   

**Note**: In order to support 100 concurrent users, you will need:    

* 2 cpus or more machine
* 128 GB of RAM 
* 500 GB of storage 

As a point of interest, we are currently using  an HPE ProLiant DL360 Gen10 server on our different production sites.

When done with OS installation and preparation

* From the WoD-backend server (aka JupyterHub server), as the install user, you will need to clone the wod-install repo first.

```shellsession
install$ git clone https://github.com/Workshops-on-Demand/wod-install.git
install$ cd wod-install/
```

* Examine default installation parameters and adapt when necessary accordingly. Files are self-documented.

Look at the following files within ansible/group_vars directory.    

* `all.yml` file  

```shellsession
vi all.yml
---
# We create fixed user accounts to provide an isolated execution environment to run the jupyter notebooks
# They are called studentXXX where XXX is set between USERMIN and USERMAX defined below potentially with the addition of an offset (UIDBASE) for their uid/gid
# Their home directory is located under /student and is thus named /student/studentXXX
# Corresponding JupyterHub accounts are also created
#
# USERMIN indicates the starting ID of the Linux and Jupyter user account range
#
USERMIN: 1
#
# USERMAX indicates the ending ID of the Linux and Jupyter user account range
#
USERMAX: 20
#
# UIDBASE is the offset used to create the Linux user account IDs
# Example when creating user 35 with UIDBASE of 2000, the uid created is 2035
#
UIDBASE: 2000
#
# GIDBASE is the offset used to create the Linux group IDs
# Example: When creating user 35 with GIDBASE of 2000, the gid created is 2035
#
GIDBASE: 2000
#
# Set CLEAN to true if you want all Liunx & Jupyter user accounts to be removed before ansible check
#
CLEAN: false
#
# VAULTPWD is the password used to manage the Ansible vault
#
VAULTPWD: VeryComplexPasswd1234!
#
# NOCHECKSSH are ssh options used to dialog with appliances
# By default, avoid checking Host keys and Host file as they may change on a regular base
#
NOCHECKSSH: -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null
#
# Branding management - Use if you want to customize Logo and Notebooks branding
#
BRANDING: "WoD Developer"
BRANDINGWOD: "WoD Developer"
BRANDINGLOGO: "![HPEDEVlogo](Pictures/hpe-dev-logo.png)"
BRANDINGURL: "https://wod.io"
#
# Survey management - Use if you want to ask for feedback on your workshops - Look at existing conclusion notebooks
SURVEYURL: TBD
SURVEYCHALURL: TBD
#
# JPHUB  is the directory used to install the JupyterHub stack (a Python venv)
#
JPHUB: /opt/jupyterhub
#
#
# These variables are defined in Ansible playbooks. Do not change without knowing what you are doing.
#
STUDDIR: "{{ ansible_env.STUDDIR }}"
WODBEDIR: "{{ ansible_env.WODBEDIR }}"
WODPRIVDIR: "{{ ansible_env.WODPRIVDIR }}"
WODNOBO: "{{ ansible_env.WODNOBO }}"
WODAPIDBDIR: "{{ ansible_env.WODAPIDBDIR }}"
WODFEDIR: "{{ ansible_env.WODFEDIR }}"
SCRIPTDIR: "{{ WODBEDIR }}/scripts"
ANSIBLEDIR: "{{ WODBEDIR }}/ansible"
# This is the predefined structure for a private repo
WODPRIVNOBO: "{{ WODPRIVDIR }}/notebooks"
SCRIPTPRIVDIR: "{{ WODPRIVDIR }}/scripts"
ANSIBLEPRIVDIR: "{{ WODPRIVDIR }}/ansible"
```

* `wod-backend` file  

```shellsession
vi wod-backend
#
# These variables are located lower in the ansible tree to allow different values required for different backends while keeping a single frontend
#
# BASESTDID is the offset used to create users in the DB. It is required that each backend has a different non overlapping value.
# Overlap is defined by BASESTDID + USERMAX (from all.yml)
#
# Example:
# for student 35 in location A having BASESTDID to 0 the user is create as id 35
# for student 35 in location B having BASESTDID to 2000 the user is create as id 2035
# There is no overlap as long as you do not create more than 2000 users which should be the value of USERMAX in that case.
#
# This is different from the offset UIDBASE used for Linux uid
#
BASESTDID: 0
#
# POSTPORT is the Postfix Port on which the smtp service is listening to receive API mail requests from the frontend
#
POSTPORT: "10025"
#
# In case you are using an LDAP server to use, flag as such the corresponding workshops in the DB and use the following values:
#
LDAPSRVNAME: ldap.example.org
LDAPDMN: example.org
LDAPPWD: MotDePasseLDAPCompliquéAussi123!!!##
LDAPPORT: "389"
#
# For various existing public WoDs - These are needed. Adapt but do not remove!
#
SSHPORT-WKSHP-Docker101: 14101
SSHPORT-WKSHP-Ansible101: 16001
HTTPPORT-WKSHP-Docker101: 14151
HTTPPORT-WKSHP-Ansible101: 16051
HTTPPORT-WKSHP-Spark101: 17161
HTTPPORT-WKSHP-Concourse101: 19061
HTTPPORT-WKSHP-ML101: 18061
HTTPPORT-WKSHP-DataVisu101: 22161
CONCOURSEPORT-WKSHP-Concourse101: 19001
CONCOURSEPORT2-WKSHP-Concourse101: 19031
IP-WKSHP-DataVisu101: x.y.z.t
IP-WKSHP-Concourse101: x.y.z.t
IP-WKSHP-Docker101: x.y.z.t
IP-WKSHP-Ansible101: x.y.z.t
IP-WKSHP-Spark101: x.y.z.t
IP-WKSHP-ML101: x.y.z.t
IP-WKSHP-StackStorm101: x.y.z.t
SPARKPORT-WKSHP-Spark101: 17101
SPARKPORT2-WKSHP-Spark101: 17131
MLPORT-WKSHP-ML101: 18101
MLPORT2-WKSHP-ML101: 18031
DATAVISUPORT1-WKSHP-DataVisu101: 22101
DATAVISUPORT2-WKSHP-DataVisu101: 22131
```

* `wod-system` file

```shellsession
vi wod-system
#
# Backend API management
#
# Do not change, as the port is fixed in the JupyterHub install
#
WODBEAPIURL: http://{{ WODBEFQDN }}:8000
#
# Replace with a random one - TODO Do that automatically at install time
#
WODBETOKEN: 2c0246e2c8564dc6ac7b12c544b25d77
#
# You may want to use these variables if you have an OPNSense server as a security FW and are allowing http comm internally
#
#OPNSENSEKEY:
#OPNSENSESEC:
#OPNSENSEIP:
#OPNSENSEPORT:
#
# Front-end API management
#
# Do not change, as the port is fixed in the JupyterHub install
#
WODFEAPIURL: https://{{ WODAPIDBFQDN }}/api
#
# Adapt to your setup - Used by installer to setup the frontend
#
WODFEAPIUSER: moderator
WODFEAPIPWD: MotDePasseCompliquéAussi125!!!##
```

 S﻿ee the example below for a backend server.  

### B﻿ackend server installation :

[](https://github.com/Workshops-on-Demand/wod-backend/blob/main/INSTALL.md#for-private-based-workshops-on-demand-private-backend--private-workshops-or-if-you-need-to-modify-defaults)O﻿nce you are done with the files, you can can proceed with the installation itself. T﻿he installation is based on a common install script [install.sh ](https://github.com/Workshops-on-Demand/wod-backend/blob/main/install/install.sh)that allows the deployment of the different parts of the solution. The script is located under the `wod-install/install/` directory.

It can be called as follows:

`install.sh [-h][-t type][-g groupname][-b backend][-f frontend][-a api-db][-e external][-u user][-s sender]`

As you can see on the command line, the -t parameter will define whether you install a backend, an api-db, or a frontend server. Having this information, the script will clone the relevant repository for the installation. If `t=backend`, then the `wod-backend` repository is cloned as part of the installation process, and the relevant installation scripts are called. Same goes for api-db, and frontend servers.

`-﻿h` parameter provides help.

```shellsession
install@wod-backend2-u24:~/wod-install/install$ sudo ./install.sh -h
install.sh called with -h
install.sh [-h][-t type][-i ip][-g groupname][-b backend[:beport:[beproto]][-n number][-j backendext[:beportext[:beprotoext]]][-f frontend[:feport[:feproto]]][-w frontendext[:feportext[:feprotoext]]][-a api-db[:apidbport[:apidbproto]]][-e api-dbext[:apidbportext[:apidbprotoext]]][-u user][-p postport][-k][-c][-s sender]

where:
-a api-db    is the FQDN of the REST API/DB server
             potentially with a port (default 8021)
             potentially with a proto (default http)
             example: api.internal.example.org
             if empty using the name of the frontend

-b backend   is the FQDN of the backend JupyterHub server,
             potentially with a port (default 8000).
             potentially with a proto (default http)
             if empty uses the local name for the backend
             If you use multiple backend systems corresponding to
             multiple locations, use option -n to give the backend
             number currently being installed, starting at 1.

             When installing the api-db server you have to specify one
             or multiple backend servers, using their FQDN separated
             with ',' using the same order as given with the -n option
             during backend installation.

-e api-dbext is the FQDN of the REST API server accessible externally
             potentially with a port (default 8021)
             potentially with a proto (default http)
             example: api.external.example.org
             if empty using the name of the api-db
             useful when the name given with -a doesn't resolve from
             the client browser

-f frontend  is the FQDN of the frontend Web server
             potentially with a port (default 8000).
             potentially with a proto (default http)
             example: fe.external.example.org
             if empty using the name of the backend

-g groupname is the ansible group_vars name to be used
             example: production, staging, test, ...
             if empty using 'production'

-i ip        IP address of the backend server being used
             if empty, try to be autodetected from FQDN
             of the backend server
             Used in particular when the IP can't be guessed (Vagrant)
             or when you want to mask the external IP returned
             by an internal one for /etc/hosts creation

-j backext   is the FQDN of the backend JupyterHub server accessible externally
             potentially with a port (default 8000).
             potentially with a proto (default http)
             example: jupyterhub.external.example.org
             if empty using the name of the backend
             useful when the name given with -b doesn't resolve from
             the client browser

-k           if used, force the re-creation of ssh keys for
             the previously created admin user
             if not used keep the existing keys in place if any
             (backed up and restored)
             if the name of the admin user is changed, new keys
             systematically re-created

-c           if used, force insecured curl communications
             this is particularly useful for self-signed certificate
             on https services
             if not used keep curl verification, preventing self-signed
             certificates to work

-n           if used, this indicates the number of the backend
             currently installed
             used for the backend installation only, when multiple
             backend systems will be used in the configuration
             example (single backend server install on port 9999):
              -b be.int.example.org:9999
             example (first of the 2 backends installed):
              -b be1.int.example.org:8888 -n 1
             example 'second of the 2 backends installed):
              -b be2.int.example.org:8888 -n 2
             example (install of the corresponding api-db server):
              -b be.int.example.org:8888,be2.int.example.org:8888

-p postport  is the port on which the postfix service is listening
             on the backend server
             example: -p 10030
             if empty using default (10025)

-s sender    is the e-mail address used in the WoD frontend to send
             API procmail mails to the WoD backend
             example: sender@example.org
             if empty using wodadmin@localhost

-t type      is the installation type
             valid values: appliance, backend, frontend or api-db
             if empty using 'backend'

-u user      is the name of the admin user for the WoD project
             example: mywodadmin
             if empty using wodadmin
-w frontext  is the FQDN of the frontend JupyterHub server accessible externally
             potentially with a port (default 8000).
             potentially with a proto (default http)
             example: frontend.external.example.org
             if empty using the name of the frontend
             useful to solve CORS errors when external and internal names
             are different


Full installation example of a stack with:
- 2 backend servers be1 and be2 using port 8010
- 1 api-db server apidb on port 10000 using https
- 1 frontend server front on port 8000
- all declared on the .local network
- internal postfix server running on port 9000
- e-mail sender being wodmailer@local
- ansible groupname being test
- management user being wodmgr

On the be1 machine:
  ./install.sh -a apidb.local:10000:https -f front.local:8000 \
  -g test -u wodmgr -p 9000 -s wodmailer@local\
  -b be1.local:8010 -n 1 -t backend \
On the be2 machine:
  ./install.sh -a apidb.local:10000:https -f front.local:8000 \
  -g test -u wodmgr -p 9000 -s wodmailer@local\
  -b be2.local:8010 -n 2 -t backend \
On the apidb machine:
  ./install.sh -a apidb.local:10000:https -f front.local:8000 \
  -g test -u wodmgr -p 9000 -s wodmailer@local\
  -b be1.local:8010,be2.local:8010 -t api-db \
On the frontend machine:
  ./install.sh -a apidb.local:10000:https -f front.local:8000 \
  -g test -u wodmgr -p 9000 -s wodmailer@local\
  -t frontend \
```

`install.sh` performs the following tasks:

* Calls the `install-system-<< distribution name >>.sh` script      
* Installs minimal required (`ansible, git, jq, openssh server, npm`)
* Creates an admin user as defined upper (default is `wodadmin`) with sudo rights
* Calls the `install-system-common.sh` script that performs the following tasks:

  * Cleanup    
  * Github repos cloning (leveraging install.repo file) : public Backend and public Private repos    
  * Create ssh keys for wodadmin    
  * Creates GROUPNAME variables    
  * Creates Ansible inventory files  
* Calls the `install_system.sh` script with the type (backend, frontend, etc..) that performs the following tasks:    

  * Install the necessary stack based on selected type    
  * Create a `wod.sh` script in `wod-backend` directory to be used by all other scripts    
  * Source the `wod.sh` file     
  * Setup Ansible-galaxies (`community.general` and `posix`)     
  * Setup Ansible and call the playbook `install_<type>.yml` followed by the `ansible\_check\_<type>.yml`    

At the end of the installation process:

* You will have a JupyterHub server running on port 8000    
* You will get a new `wodadmin` user (Default admin)    
* You will get a set of 20 students (Default value)    

A﻿ll playbooks are self-documented. Please check for details.

**Note: A wod-install.log is available under the home folder of the install user under `.wod-install`. It contains the installation log along with a another file containing the wodadmin credentials.**

I'll leave it to you to handle the necessary port redirection and SSL certificates management when needed. In our case, I went for a simple yet efficient solution based on an OPNSense Firewall along with a HAProxy setup to manage ports'redirection, HTTP to HTTPS Redirection, SSL Certificates. The backend also includes a Fail2ban service for login security management.

At this point, you should be able to access your JupyterHub environment with a few pre-installed set of kernels like `Bash, Python, ansible, ssh, PowerShell`.

Y﻿ou can then start developing new notebooks for your public based environment. And if you don't know how to do this, I will explain how in a future article.

If you need to develop private content that cannot be shared with the wider Open Source Community because of dedicated IP, the next section in this article will explain how to handle this.

### **How to handle private-content based Workshops-on-Demand**

#### *(private backend + private workshops on top of default public backend and notebooks)*

T﻿he principle remains similar, with a few differences explained below.

* After cloning the wod-install repository, y﻿ou will fork the following public private [repo](https://github.com/Workshops-on-Demand/wod-private.git) on Github under your own Github account (we will refer to it as `Account`).    
* Next, clone the forked repo.    
* Edit the `all.yml` and `<groupname>` files to customize your setup. T﻿his variable `<groupname>` defines possible backend server in your environement. By default, the project comes with a sample working file named `production` in `ansible/group-vars`. But you could have multiple. In the case I've presented, I have defined `sandbox`, `test`, `staging` and several `production` files, all defining a different backend environment. These files will be used to override the default values specified by the public version delivered as part of the default public installation.    
* Commit and push changes to your repo.    
* Create an `install.priv` file located in `install` directory when using a private repo (consider looking at [install.repo](https://github.com/Workshops-on-Demand/wod-backend/blob/main/install/install.repo) file for a better understanding of the variables).
* Define the WODPRIVREPO and WODPRIVBRANCH variables as follows:    

  * `WODPRIVBRANCH="main"`     
  * `WODPRIVREPO="git@github.com:Account/Private-Repo.git wod-private"`    

**Note:** When using a token

Please refer to the following [url](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) to generate a `token` file in `install` directory of WoD-backend:

* Edit the `install.priv` file located in `install` directory of wod-install:  

  * Create line before variable declaration: ``token=`cat $EXEPATH/token` ``    
  * Use the token in the url WODPRIVREPO="git clone https://user:$token@github.com/Account/wod-private.git wod-private"    

Y﻿ou are now ready to perform the installation again to support a private repository. 

Please note that this setup phase can be concurrent with the public setup phase. Indeed, the install script should detect the presence of the private repository owing to the presence of the install.priv file. It will automatically adjust the different scripts and variables to add the relevant content. It will actually overload some of the variables with private ones.

Y﻿ou now have a working Workshops-on-Demand backend server in place. In order to install the api-db server as well as the frontend server, please follow the same steps. 

In order to setup the api-db server, you will need:

* A fresh OS install on physical / virtualized server running Ubuntu 24.04 or Centos 7.9 leveraging any deployment mechanism of your choice.(e.g. iLO, vagrant, etc.). You may even use this vagrant file to automatically generate a complete setup leveraging vagrant, libvirt and QEMU/KVM. 
* A Linux account with sudo priviledges on your Linux distro. Name it `install`   
* 2 cpus or more machine
* 16 GB of RAM 
* 60 GB of storage 

In order to setup the frontend server, you will need:

* A fresh OS install on physical / virtualized server running Ubuntu 24.04 or Centos 7.9 leveraging any deployment mechanism of your choice.(e.g. iLO, vagrant, etc.). You may even use this vagrant file to automatically generate a complete setup leveraging vagrant, libvirt and QEMU/KVM. 
* A Linux account with sudo priviledges on your Linux distro. Name it `install`   
* 2 cpus or more machine
* 8 GB of RAM 
* 60 GB of storage 



Congratulations! you should have now a running Workshops-on-Demand infrastructure. The next article in the series will help you better understand the lifecycle of the backend server. How does a workshop registration work from the backend server's side? How do you manage this server on a daily basis? How and when do you need to update it ? All these questions will be answered in the next article. And from there, I will help you move  finally to a workshop's creation process.

I﻿f you need support for this installation process, use our dedicated [slack channel](https://hpedev.slack.com/archives/C01B60X8SSD).

Please be sure to check back [HPE Developer blog site](https://developer.hpe.com/blog) to read all the articles in this series. Also, check out  the Hack Shack for new [workshops](https://developer.hpe.com/hackshack/workshops) [Data Visualization 101](https://developer.hpe.com/hackshack/replays/42) is now available! Stay tuned for additional Workshops-on-Demand in our catalog.