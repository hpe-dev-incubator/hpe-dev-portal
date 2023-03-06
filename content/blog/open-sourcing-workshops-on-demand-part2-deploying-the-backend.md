---
title: "Open Sourcing Workshops-on-Demand part2: How to Deploy the backend"
date: 2023-03-01T17:23:03.445Z
author: Frederic Passeron
authorimage: /img/fp-hpewod.jpg
disable: false
tags:
  - open source
  - Workshops-on-Demand
---
In the first [article](https://developer.hpe.com/blog/willing-to-build-up-your-own-workshops-on-demand-infrastructure/) of this series, I described the reasons behind the decision to open source our Workshops-on-Demand (WoD) project and gave you a comprehensive picture of the project's overall infrastructure. In this second article, I will cover the backend part of the project and explain how to deploy it.

T﻿he overall infrastructure can run on physical servers or VMs. We usually designate one server for the frontend and a second server for the backend. You could also decide to separate every single component of each side.

![](/img/howto-wod-5.png)

## H﻿ow to deploy your own backend...

A﻿s explained in the previous [article](https://developer.hpe.com/blog/willing-to-build-up-your-own-workshops-on-demand-infrastructure/), the project is split into multiple repositories from the architectural and public / private aspects. The architecture is divided between the frontend and backend. The project admin will need to decide whether  he is willing to develop and propose public-only content to the participants or add any proprietary and private content.

I﻿ will start with the simpliest scenario: A public-only approach. Then we will dive into the specificties related the private approach.

### P﻿ublic-only Deployment: No private backend nor private workshops

**Important Note:**  

**T﻿his part is compulsory for any type of deployment. Public only or public + private.**

F﻿irst, you need a repository to clone. The Workshops-on-Demand GitHub projects can be found [here](https://github.com/Workshops-on-Demand/). W﻿e have packaged the solution in several Github repos. Each repository handles a specific role in the overall architecture.

Here's a quick look at what can be found in each:

![](/img/wod-blogserie2-repos.png "WOD Repositories")

**[w﻿od-notebooks](https://github.com/Workshops-on-Demand/wod-notebooks):** Public Workshops-on-Demand based on Jupyter Notebooks.

* You can test them live at <https://hackshack.hpedev.io/workshops>

**[w﻿od-frontend](https://github.com/Workshops-on-Demand/wod-frontend):** Frontend part of the Workshops-on-Demand project.

* Based on NGINX and NodeJS technologies, it provides the participtants' Registration Portal used to enable

  booking of the workshops.

**[w﻿od-api-db](https://github.com/Workshops-on-Demand/wod-api-db):** Workshops-on-Demand registration portal application

* Open API 3.0 based api used to manage the Workshops-on-Demand project. It also provides a database hosting the different status of participants, workshops, and students. 

**[w﻿od-private](https://github.com/Workshops-on-Demand/wod-private):** Example Private configuration for Workshops-on-Demand (WoD).

* This provide an example for creating your own cutomization layer on top of the public standard WoD Backend / wod Notebooks content. Do not put any confidential data here as this is a public repository!

**[w﻿od-backend](https://github.com/Workshops-on-Demand/wod-backend):** Back-end part of our Workshops-on-Demand setup.  

![](/img/wod-blogserie2repos.png "Workshops-on-Demand repositories")

It provides:

* A complete JupyterHub server with some addons (additional Jupyterhub kernels, Ansible galaxies, and PowerShell libraries) on your system, ready to host Workshops-on-Demand that you can find [here](https://developer.hpe.com/hackshack/workshops).[](https://github.com/Workshops-on-Demand/wod-notebooks.git)    
* A postfix server used for the procmail API    
* An Ansible engine to allow automation    
* A fail2ban service    
* An Admin user to manage everything    
* A﻿ set of scripts to handle different tasks such as:    

  * Notebooks deployment 
  * Jupyterhub compliancy
  * Users compliancy
  * Security Management

#### Backend server preparation:

B﻿efore cloning the backend repository, you will need to prepare the server that will host the backend features. When ready, you will proceed with the cloning and then the installation process.

### Prerequesites:

1. I﻿n order to setup the backend server, you will need:

   * A fresh OS install on physical / virtualized server running Ubuntu 20.04 or Centos 7.9 leveraging any deployment mechanism of your choice.(e.g. iLO, vagrant, etc.). You may even use this [vagrant file](https://github.com/Workshops-on-Demand/wod-backend/blob/main/install/Vagrantfile) to automatically generate a complete setup leveraging vagrant, libvirt and QEMU/KVM.    
   * A Linux account with sudo priviledges on your Linux distro. Name it `install`    

**Note:** In order to support 100 concurrent users, you need:

* 2 cpus or more machine
* 128 GB of RAM
* 500 GB of storage

W﻿e are currently using a DL360 Gen10 server on our different production sites.

2. W﻿hen done with OS installation and preparation

   * From the WoD-backend server (aka JupyterHub server), as the `install` user, you will need to clone the repo first.    

   ```shellsession
   install$ git clone https://github.com/Workshops-on-Demand/wod-backend.git
   install$ cd wod-backend/
   ```

   * Examine default installation parameters and adapt when necessary accordingly. Files are self documented.    

* Look at the following files within `ansible/group_vars` directory.     

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

#### B﻿ackend installation process:

[](https://github.com/Workshops-on-Demand/wod-backend/blob/main/INSTALL.md#for-private-based-workshops-on-demand-private-backend--private-workshops-or-if-you-need-to-modify-defaults)O﻿nce you are done with the files, you can can proceed with the installation itself. T﻿he installation is based on a common install script [install.sh ](https://github.com/Workshops-on-Demand/wod-backend/blob/main/install/install.sh)that allows the deployment of the different parts of the solution. It can be called as follows:

`install.sh [-h][-t type][-g groupname][-b backend][-f frontend][-a api-db][-e external][-u user][-s sender]`

`-﻿h` provides the help

```shellsession
./install.sh -h
install.sh called with -h
install.sh [-h][-t type][-g groupname][-b backend][-f frontend][-a api-db][-e external][-u user][-s sender]

where:
type      is the installation type
          example: backend, frontend or api-db
          if empty using 'backend'
groupname is the ansible group_vars name to be used
          example: production, staging, test, ...
          if empty using 'production'
backend   is the FQDN of the backend JupyterHub server
          example: be.internal.example.org
          if empty using the local name for the backend
frontend  is the FQDN of the frontend Web server
          example: fe.example.org
          if empty using the external name for the backend
api-db    is the FQDN of the API/DB server
          example: api.internal.example.org
          if empty using the name for the frontend
external  is the external FQDN of the backend JupyterHub server, reachable from the Internet
          example: jphub.example.org
          if empty using the internal name of the backend
user      is the name of the admin user for the WoD project
          example: mywodamin
          if empty using wodadmin
sender    is the e-mail address used in the WoD frontend to send API procmail mails to the WoD backend
          example: sender@example.org
          if empty using wodadmin@localhost
```

S﻿ee the example below for a backend server.

```shellsession
install$ sudo ./install.sh -t backend -g staging -b jup.example.net -f notebooks.example.io -a api.example.io -e notebooks.example.io -s sender@example.io
```

`install.sh` performs the following tasks:

* Calls the `install-system-<< distribution name >>.sh` script      
* Installs minimal required (`ansible, git, jq, openssh server, npm`)    
* Creates an admin user as defined upper (default is `wodadmin`) with sudo rights    
* Calls the `install-system-common.sh` script that performs the following tasks:    

  * cleanup
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

* you will have a JupyterHub server running on port 8000    
* You will get a new `wodadmin` user (Default admin)    
* You will get a set of 20 students (Default value)    

A﻿ll playbooks are self-documented. Please check for details.

W﻿e leave it to you to handle the necessary port redirection and SSL certificates management when needed. In our case, we went for a simple yet efficient solution based on an OPNSense Firewall along with a HAProxy setup to manage ports'redirection, HTTP to HTTPS Redirection, SSL Certificates. The backend also includes a Fail2ban service for login security management.

At this point, you should be able to access your JupyterHub environment with a few pre-installed set of kernels like `Bash, Python, ansible, ssh, PowerShell`.

Y﻿ou can then start developing new notebooks for your public based environment. And if you don't know how to do this, I will explain how in my next article

If you need to develop private content that cannot be shared with the wider Open Source Community because of dedicated IP, the next section in this article will explain how to handle this.

### **How to handle private-content based Workshops-on-Demand**

###### *(private backend + private workshops on top of default public backend and notebooks)*

T﻿he principle remains similar, with a few differences explained below.

* Y﻿ou will start by forking the following public private [repo](https://github.com/Workshops-on-Demand/wod-private.git) on Github under your own Github account (we will refer to it as `Account`).    
* Next, clone the forked repo.    

```shellsession
install$ git clone https://github.com/Account/wod-private.git wod-private
install$ cd $HOME/wod-private/ansible/group_vars
```

* Edit the `all.yml` and `<groupname>` files to customize your setup. T﻿his variable `<groupname>` defines possible backend server in your environement. By default, the project comes with a sample working file named `production` in `ansible/group-vars`. But you could have multiple. In our case, we have defined `sandbox`, `test`, `staging` and several `production` files, all defining a different backend environment. These files will be used to override the default values specified by the public version delivered as part of the default public installation.    
* Commit and push changes to your repo.    
* Create an `install.priv` file located in `install` directory when using a private repo (consider looking at [install.repo](https://github.com/Workshops-on-Demand/wod-backend/blob/main/install/install.repo) file for a better understanding of the variables).    

  * Define the WODPRIVREPO and WODPRIVBRANCH variables as follows:    
 
     * WODPRIVBRANCH="main"     

     * WODPRIVREPO="git@github.com:Account/Private-Repo.git wod-private"    


**Note:** When using a token

Please refer to the following [url](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) to generate a `token` file in `install` directory of WoD-backend:

* Edit the `install.priv` file located in `install` directory of WoD-backend:    

  * Create line before variable declaration: ``token=`cat $EXEPATH/token` ``    

  * Use the token in the url WODPRIVREPO="git clone https://user:$token@github.com/Account/wod-private.git wod-private"    


Y﻿ou are now ready to perform the installation again to support a private repository. 

```shellsession
cd $HOME/wod-backend/install
sudo ./install.sh -t backend -g staging -b jup.example.net -f notebooks.example.io -a api.example.io -e notebooks.example.io -s sender@example.io
```

Please note that this setup phase can be conccurent with the public setup phase. Indeed, the install script should detect the presence of the private repository owing to the presence of the install.priv file. It will automatically adjust the different scripts and variables to add the relevant content. It will actually overload some of the variables with private ones.

Y﻿ou now have a working Workshops-on-Demand backend server in place. Congratulations! The next article in the series will help you better understand the lifecycle of the backend server. How does a workshop registration work from the backend server 's side? How do you manage this server on a daily basis? How and when do you need to update it ? All these questions will be answered in the next article. And from there, we will move to the frontend side of things and finally to a workshop's creation process.

I﻿f you need support for this installation process, use our dedicated slack channel

Please be sure to check back [HPE Developer blog site](https://developer.hpe.com/blog) to read all the articles in this series. Also, check out  the Hack Shack for new [workshops](https://developer.hpe.com/hackshack/workshops) [Data Visualization 101](https://developer.hpe.com/hackshack/replays/42) is now available! HPE GreenLake for Compute Operations Management API 101 on its way too. Stay tuned!