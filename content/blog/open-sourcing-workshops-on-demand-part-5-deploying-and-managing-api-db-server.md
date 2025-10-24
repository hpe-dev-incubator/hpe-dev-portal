---
title: "Open Sourcing Workshops-on-Demand part 5: Deploying and Managing API-DB
  server"
date: 2025-06-24T09:52:09.975Z
author: Frederic Passeron
authorimage: /img/frederic-passeron-hpedev-192.jpg
disable: true
tags:
  - opensource
  - Workshops-on-Demand
---








I﻿n previous articles of this series dedicated to the [open sourcing of our Workshops-on-Demand project](https://developer.hpe.com/blog/willing-to-build-up-your-own-workshops-on-demand-infrastructure/), I covered the reasons why we open sourced the project and how we did it. I also explained in details how you could install your own Workshops-on-Demand backend server. I also took the time to detail the automation that was hosted on this backend server. I also described to you the management of this backend server. This is what is often referred to as Day2 operations. I plan now to explain how to deploy and manage the API-DB server.

The api-db server provides an open API 3.0 based api used to manage the Workshops-on-Demand project. it also provides a Database hosting the different status of participants, workshops, students.

The following image is describing the different interactions existing between the different components of the wod architecture.

![](/img/howto-wod-1.png "WOD Architecture")

## H﻿ow to deploy your own api-db server...

A﻿s explained in the previous [article](https://developer.hpe.com/blog/willing-to-build-up-your-own-workshops-on-demand-infrastructure/), the project is split into multiple repositories from the architectural and public / private aspects. The architecture is divided between the frontend and backend. The project admins will need to decide whether they are willing to develop and propose public-only content to the participants or add any proprietary and private content.

I﻿ will start with the simpliest scenario: A public-only approach. Then we will dive into the specificities related the private approach.

### P﻿ublic-only Deployment: No private backend nor private workshops

**Important Note:**

**T﻿his part is compulsory for any type of deployment. Public only or public + private.**

F﻿irst, you need a repository to clone. The Workshops-on-Demand GitHub projects can be found [here](https://github.com/Workshops-on-Demand/). W﻿e have packaged the solution in several Github repos. Each repository handles a specific role in the overall architecture. We recently introduced a wod-install repository. 

This repository is the most important one when it comes to deploying the wod infrastructure. It contains all the installation scripts for every part of the solution.

Here's a quick look at what can be found in each:

![](/img/wod-blogserie2-2repos.png "WOD repositories")



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

* This provide examples for creating your own cutomization layer on top of the public standard WoD Backend / wod Notebooks content. Do not put any confidential data here as this is a public repository!

**Note**: T﻿here are now 7 repositories available for now. 

It provides:

* An Installer allowing you to install either Backend, Api-DB server, or Frontend using a single line of command.
* A complete JupyterHub server with some addons (additional Jupyterhub kernels, Ansible galaxies, and PowerShell libraries) on your system, ready to host Workshops-on-Demand that you can find here.
* An api-db Server to host Workshops data and provide an API server to retrieve relevant workshops data
* A frontend server to provide registration process
* A postfix server used for the procmail API
* An Ansible engine to allow automation
* A fail2ban service
* An Admin user to manage everything
* A set of scripts to handle different tasks such as:

  * Notebooks deployment
  * Jupyterhub compliancy
  * Users compliancy
  * Security Management

#### API-DB server preparation:

B﻿efore cloning the install repository, you will need to prepare the server that will host the backend features. When ready, you will proceed with the cloning and then the installation process.

##### Prerequesites:

In order to setup the api-db server, you will need:

* A fresh OS install on physical / virtualized server running Ubuntu 24.04 or Centos 7.9 leveraging any deployment mechanism of your choice.(e.g. iLO, vagrant, etc.). You may even use this vagrant file to automatically generate a complete setup leveraging vagrant, libvirt and QEMU/KVM.
* A Linux account with sudo priviledges on your Linux distro. Name it `install`
* Git installed on the machine

Our current setup leverages the following specs for our api-db server

* 2 cpus or more machine
* 16 GB of RAM
* 80 GB of storage

We are currently using a virtual machine on AWS for  our different production sites.

When done with OS installation and preparation

* From the WoD-api-db server, as the install user, you will need to clone the wod-install repo first.

```
install$ git clone https://github.com/Workshops-on-Demand/wod-install.git
install$ cd wod-install/install
```



* T﻿he installation is based on a common install script [install.sh ](https://github.com/Workshops-on-Demand/wod-backend/blob/main/install/install.sh)that allows the deployment of the different parts of the solution. It can be called as follows:

```
install$ install.sh [-h][-t type][-g groupname][-b backend][-f frontend][-a api-db][-e external][-u user][-s sender] 
```

`-﻿h` provides the help

`install.sh` performs the following tasks depending on the type 

* Calls the `install-system-<< distribution name >>.sh` script
* Installs minimal required (`ansible, git, jq, openssh server, npm`)
* Creates an admin user as defined upper (default is `wodadmin`) with sudo rights
* Calls the `install-system-common.sh` script that performs the following tasks:

  * Cleanup
  * Github repos cloning (leveraging install.repo file) : public Backend and public Private repos
  * Create ssh keys for wodadmin
  * Creates GROUPNAME variables
  * Creates Ansible inventory files
* Calls the `install_system.sh` script with the type (api-db, backend, or frontend) that performs the following tasks:

  * Install the necessary stack based on selected type
  * Create a `wod.sh` script in `wod-backend` directory to be used by all other scripts
  * Source the `wod.sh` file
  * Setup Ansible-galaxies (`community.general` and `posix`)
  * Setup Ansible and call the playbook `install_<type>.yml` followed by the `ansible\_check\_<type>.yml`

At the end of the api-db installation process:

* you will have a postgres database running in a docker container and populated with the data coming from the different workshops yaml files.
* You will have a postgres adminer running
* You will get a api server running along with his swagger description.

Please note that this setup phase can be concurrent with the public setup phase. Indeed, the install script should detect the presence of the private repository owing to the presence of the install.priv file. It will automatically adjust the different scripts and variables to add the relevant content. It will actually overload some of the variables with private ones.

Y﻿ou now have a working Workshops-on-Demand api-db server in place. 













Congratulations! The next article in the series will help you better understand the lifecycle of the backend server. How does a workshop registration work from the backend server 's side? How do you manage this server on a daily basis? How and when do you need to update it ? All these questions will be answered in the next article. And from there, we will move to the frontend side of things and finally to a workshop's creation process.

I﻿f you need support for this installation process, use our dedicated [slack channel](https://hpedev.slack.com/archives/C01B60X8SSD).

Please be sure to check back [HPE Developer blog site](https://developer.hpe.com/blog) to read all the articles in this series. Also, check out the Hack Shack for new [workshops](https://developer.hpe.com/hackshack/workshops) [Data Visualization 101](https://developer.hpe.com/hackshack/replays/42) is now available! Stay tuned for additional Workshops-on-Demand in our catalog.



## H﻿ow to manage your own api-db server...

The main component of the api-db server is database. there are two ways of managing the data content :

Postgres adminer:

in order to access the postgres adminer console: browse to either the internal or external (if any) IP Address on port 8083

![](/img/screenshot-2025-06-24-at-15.35.58.png "Postgres Adminer console login")

Using the console, the admin can update the relevant tables manually. 

![](/img/screenshot-2025-06-24-at-15.38.11.png "Postgres DB Workshops table")

However, we now recommand you leverage our scripts that will take care of updating the relevant data automatically.

Let's start with a simple example: 

### You want to add a new workshop to your catalog. How should you proceed?

* Start by developing a new workshop (a future blog will help you understand how to achieve this).
* As part of the workshop development, you will have to create a simple yaml file that will describe the workshop.
* Once the workshop content is ready, you will create a pull request to the wod-notebooks repository to update its content.
* From the api-db server, as the install user, launch now the seeders script to update the database. The script will parse the different yaml files and proceed with the necessary updates to the database.

Take a look at the folowing example:

```
%YAML 1.1
# Meta data for the API101 Workshop to populate seeder
---
name: 'API 101 - API basics and the value they provide'
description: 'You may know that application programming interfaces (APIs) allow applications to talk to other apps, but have you ever used them? Today, APIs are available for most products and solutions. You can take advantage of them when writing automation scripts, integrating code, or defining infrastructure-as-code, as long as you understand the mechanisms used to consume an API. In this hands-on workshop, we’ll review all the jargon and technology used by REST APIs.'
active: true
capacity: 20
priority: 1
range: [1,6]
reset: false
ldap: false
replayId: 9
varpass: false
compile: false
workshopImg: 'https://us-central1-grommet-designer.cloudfunctions.net/images/jay-giang-hpe-com/WOD_Opensource-API_101_REST_API_basics_and_the_value_they_provide.jpg'
badgeImg: 'https://us-central1-grommet-designer.cloudfunctions.net/images/jay-giang-hpe-com/Opensource-API_101_REST_API_basics_and_the_value_they_provide.jpg'
beta: false
category: ['Open Source']
duration: 2
presenter: 'Didier Lalli'
role: 'Distinguished Technologist'
avatar: '/img/wod/SpeakerImages/Didier.png'
replayLink: 'https://youtu.be/T57L-6LfUgw'
```

As you can see, it contains many information, from the name of the workshop, its description, whether it should be active in the databse, its capacity and much more...

Every single filed in this file with be leverage to add a workshop in the workshop table form the database. Using a seeding script, every single yaml file present in each workshop folder of the wod-notebook repositories (public and private) get imported in the databse as part of the api-db server install process. 

Leveraging the very same mechanism, one can add, update a workshop. 

### You want to add a new filed in the workshop table. How should you proceed?

In order to achieve this, you will need to update the workshops.js file in the model directory within the wod-api-db folder on the api-db server.