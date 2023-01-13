---
title: "Open sourcing Workshops-on-Demand Part 1: The why and the How."
date: 2022-12-14T12:35:46.869Z
author: "Frederic Passeron "
authorimage: /img/fp-hpewod.jpg
disable: false
---
### Open Sourcing the Workshops-on-Demand #1: The why and the How



## A﻿ bit of background first:

[T﻿he Workshops-on-Demand](https://developer.hpe.com/hackshack/workshops/) have been an important asset for the HPE Developer Community for the last 2 years. I fyou are interested in learning more on the genesis of the project, check the following [blog](https://developer.hpe.com/blog/from-jupyter-notebooks-as-a-service-to-hpe-dev-workshops-on-demand/).

T﻿he Workshops-on-Demand allows us to deliver free hands-on based workshops. We use them during internal or external events (HPE Discover, HPE Technical Symposium Summit, but also during Open Source events like OSS CON or Kube Con) to promote API / Autamation driven solutions along with some coding 101 courses. B﻿y the end of 2022,we reached more than 4000 registered workshops.  

### T﻿he Why?

Firstly, the project is based on open source technologies like Jupyter or Ansible. It felt natural that the work we did leveraging these should also benefit the open source community.

S﻿econdly, if you read carefully the messaging on our [homepage](https://developer.hpe.com/) , you will find words like sharing and collaborating. This is part of the Team DNA.



A﻿s a consequence, we decided over the course of the Year 2022 to open source the project. As HPE Employees, we had to go through different steps including technical, legal concerns to achieve this.

F﻿rom a legal standpoint, we needed to go through the OSRB (Open Source Review Board) to present the project that we wanted to open source. This was quite straightforward in this case as the project did not contain any HPE proper Intellectual Property that could not be viewed publicly. Indeed, the project is mainly based on Open Source technologies like Ansible or Jupyter. Besides, we explained the OSSRB that the new architecture of the solution would allow the administrator of the project to separate public content from private one. In our case, for instance, any workshop related to an HPE technology like  HPE Ezmeral would fall into the private part of the project and therefore would not appear on the public github repository.

F﻿rom a technical standpoint, as mentioned above we had to make sure to separate the public only content from any possible private one. We started by sorting the different Workshops. As a consequence, we also had to sort the related scripts that come along workshops. Going through this process, we found out that some of the global scripts had to be reworked as well to support future split of public and private content. This took us a few months and we are now ready to share with you the result of this work. In this first blog, we will focus our attention on the backend side of the Workshops-on-Demand project. A second blog will detail the frontend part of the project.

## U﻿nderstand the architecture first.

 The workshops-on-Demand concept is fairly simple. the following picture provides you with the overall process.

![Workshops-on-Demand Concepts 1](/img/howto-wod-1.png "Workshops-on-Demand Concepts 1")

### T﻿he Register Phase:

T﻿he participant starts by browsing a frontend web server that presents the catalog of available workshops. He then select one of them and registers for it by entering his Email address, first and last names as well as his company name. Finally he accepts the terms and conditions and hit the register button. As he is clicking the register button, the frontend server will perform a series of actions:

1.Assign a student from the dedicated workshop range to the participant. Every workshop has a dedicated range of student assigned to it.

H﻿ere is a screenshot of the workshop table present in the frontend Database Server showing API101 workshops details.

![Workshops Table from Frontend DB server](/img/howto-wod-2.png "Workshops Table from Frontend DB server")

* Frederic Passeron gets assigned a studentid "student397" for workshop "API101".

![Customers Table from Frontend DB server](/img/howto-wod-3.png "Customers Table from Frontend DB server")

H﻿ere are the details of the participant info when registered to a given workshop.

2﻿.A first email is sent to participant from the frontend server welcoming him to the workshop and informing him the deployment is ongoing and that a second email show be recieved shortly providing him with the necessary infos to logon  to the workshop environment.

3﻿.The frontend server at the same time sends the necessary orders through a procmail API to the backend server. The mail sent to the backend server contains the following details :

* Action Type ( CREATE, CLEANUP, RESET)
* W﻿orkshop ID
* S﻿tudent ID

3﻿.The Backend Server recieves the order and processes it by  parsing the email recieved and using the information to automate the deployment of the workshop.

T﻿his means:

* P﻿reparing any infrastructure that might be requiered for the workshop (Virtual Appliance, Virtual Machine, Docker Container, LDAP config, etc..)
* G﻿enerate a random Password for the allocated student
* D﻿eploy the workshop content on the jupyterhub server in the dedicated student home directory (Notebooks files necessary for the workshop)
* Send back through API Calls to the frontend server the confirmation of the deployment of the workshop along with the student details (Password)

4﻿.The frontend server get its different tables updated:

* T﻿he customer tables shows an active status for the participant row. The password field has been updated. 
* T﻿he Workshop table gets also updated. The capacity field decrement the number of available seats. 
* The student tables gets updated as well by setting the allocated student to active.

5﻿.The frontend server sends the second email to the particpant providing him with the details to connect to the workshop environment.

### T﻿he Run Phase:

F﻿rom the email, the particpant click on the start button. it will open up a browser to the jupyterhub server and directly open up the readme first notebook presenting the workshops flow.

T﻿he participant will go through the different steps and labs of the workshop connecting to the necessary endpoints and leveraging the different kernels available on the jupyterhub server.

M﻿eanwhile, the frontend server will perform regular checks on time passed. Depending on time allocation (from 2 to 4 hours) associated with the workshop, the frontend server will send a reminder email usually a hour before the end of the time allocated. The time count actually starts when the participant hit the register for the workshop button. It is mentionned in the terms and conditions.

F﻿inally, when the time is up: 

T﻿he frontend server sends a new order to the backend to:

P﻿erform either CLEANUP or RESET  action for the dedicated studentid.

T﻿his means:

* Resetting any infrastructure that was requiered for the workshop (Virtual Appliance, Virtual Machine, Docker Container, LDAP config, etc..)
* G﻿enerate a random Password for the allocated student
* D﻿elete the workshop content on the jupyterhub server in the dedicated student home directory (Notebooks files necessary for the workshop)
* Send back through API Calls to the frontend server the confirmation of the CLEANUP or RESET of the workshop along with the student details (Password)

4﻿.The frontend server gets its different tables updated:

* T﻿he customer tables shows an inactive status for the participant row. The password field has been updated. 
* T﻿he Workshop table gets also updated. The capacity field increment the number of available seats. 
* The student tables gets updated as well by setting the allocated student to inactive.

N﻿ow that you have understood the principles, let's dive into the details on how to setup your own Workshops-on-Demand Infrastructure.

## T﻿he How-to now...

T﻿he infrastructure can run on physical servers or vms. We usuasully consider at least one server for the frontend and a second server for the backend.

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