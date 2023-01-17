---
title: "Open Sourcing Workshops-on-Demand part2: Deploying the Backend"
date: 2023-01-13T17:08:52.384Z
author: Frederic Passeron
authorimage: /img/fp-hpewod.jpg
disable: false
---
# Open Sourcing Workshops-on-Demand part 2: Deploying the Backend T﻿he How-to now...

I﻿n the first article of this series, I described the reasons behing the decison of open sourcing our workshops-on-demand project. After reading it, you should have a better understanding of the project's infrastructure.

I﻿n this second article, I will cover the backend part of the project. I will explain how to deploy it in a first place. Then I will dive into the usage of the different components that constitutes it.

T﻿he overall infrastructure can run on physical servers or vms. We usuasully consider at least one server for the frontend and a second server for the backend. You could also decide to separate every single component of each side.



The github project is available [here](https://github.com/Workshops-on-Demand/). W﻿e have packaged the solution in several github repos. Repositories represent a certain role in the overall architecture. 

F﻿or the backend side: **wod-backend**

This project is the back-end part of our Workshop-on-Demand setup. It will setup:

* A complete jupyterhub with extensions on your system, ready to host Workshops-on-Demand that you can find [here ](https://github.com/Workshops-on-Demand/wod-notebooks.git)[](https://github.com/Workshops-on-Demand/wod-notebooks.git)
* A postfix server used for the procmail API
* An Ansible engine to allow automation
* A fail2ban server
* An Admin user to manage everything

### Jupyterhub server preparation:

* Fresh OS install on Physical / VM server running Ubuntu 20.04 or Centos 7.9 via ILO e.g: using ubuntu-20.04.1-live-server-amd64.iso or with a VM template or any autodeploy mechanism.
* In order to support 100 concurrent users :

  * 2 cpus or more machine
  * 128 Gigas of Ram
  * 500 Gigas of Drive

#### [](https://github.com/Workshops-on-Demand/wod-backend/blob/main/INSTALL.md#pre-requesites)Pre requesites:

From the wod-backend server aka Jupyterhub server

* Create a linux account with sudo priviledges on your linux distro.

As created user:

### [](https://github.com/Workshops-on-Demand/wod-backend/blob/main/INSTALL.md#for-public-only-based-workshops-on-demand-no-private-backend-nor-workshops)For public only based Workshops-on-Demand (No private backend nor workshops)

```shellsession
git clone <https://github.com/Workshops-on-Demand/wod-backend.git>
cd wod-backend/install
```

To examine default installation parameters: Please look at the following files within ansible/group_vars directory:

* all.yml file
* wod-system file
* wod-backend file

### [](https://github.com/Workshops-on-Demand/wod-backend/blob/main/INSTALL.md#for-private-based-workshops-on-demand-private-backend--private-workshops-or-if-you-need-to-modify-defaults)For private based Workshops-on-Demand (private backend + private workshops) or if you need to modify defaults

* Fork private repo (<https://github.com/Workshops-on-Demand/wod-private.git>) on github under your own github account
* Clone the forked repo:

```shellsession
git clone <https://github.com/...................../wod-private.git> wod-private
cd wod-private/ansible/group_vars
```

* Please edit the all.yml and << groupname >> files to customize your setup.
* Commit and push changes to your repo

```shellsession
cd $HOME/wod-backend/install
```

* create an install.priv file located in install directory if using a private repo :

  * Define the WODPRIVREPO with the correct url to clone (example in last line of install.repo) WODPRIVREPO="git clone [git@github.com](mailto:git@github.com):Account/Private-Repo.git wod-private"

\*\* Note If using a token\*\* 

PLease refer to the following [url](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) to generate token :

* edit the install.repo file located in install directory of wod-backend:

  * Uncomment line : token=`cat $EXEPATH/token`
  * use the token in the url WODPRIVREPO="git clone <https://user:$token@github.com/....../wod-private.git> wod-private"

### Install process details:

install script: install.sh usage() { echo "install.sh \[-h]\[-t type]\[-g groupname]\[-b backend]\[-f frontend]\[-a api-db]\[-e external]\[-u user] \[-s sender]"}

Example :

```shellsession
sudo ./install.sh -t backend -g staging -b jup.example.net -f notebooks.example.io -a api.example.io -e notebooks.example.io -s sender@example.io
```

Install.sh calls :

* install-system-<< distribution name >>.sh

  * Installs minimal requirered (Ansible, git, jq, openssh server, npm)
* creates an admin user as defined upper (default is wodadmin) with sudo rights
* install-system-common.sh does

  * cleanup
  * github repos cloning (leveraging install.repo file) : Backend and Private
  * Create ssh keys for wodadmin
  * Creates GROUPNAME variables
  * Creates ansible inventory files
* install_system.sh with type (Backend, Frontend, etc..)

  * Install the necessary stack based on selected type
  * Create a wod.sh script in wod-backend directory to be used by all other scripts
  * Source the wod.sh file
  * Setup ansible-galaxies (community.general and posix)
  * Setup Ansible and call the playbook install_<>.yml followed by the ansible\_check\_<>.yml

Playbooks are self documented. Please check for details.

At the end of the installation process:

* you will have a jupyterhub server running on port http 8000
* You will get a new wodadmin user
* You will get a set of students

You should then be able to access your jupyterhub environment with a few pre-installed set of kernels like Bash, Python, ansible, ssh, PowerShell.

Y﻿ou can then start developing new Notebooks for your environment.