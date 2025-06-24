---
title: "Open Sourcing Workshops-on-Demand part 5: Deploying and Managing API-DB
  server"
date: 2025-06-24T09:52:09.975Z
author: Frederic Passeron
authorimage: /img/frederic-passeron-hpedev-192.jpg
disable: false
---
I﻿n previous articles of this series dedicated to the [open sourcing of our Workshops-on-Demand project](https://developer.hpe.com/blog/willing-to-build-up-your-own-workshops-on-demand-infrastructure/), I covered the reasons why we open sourced the project and how we did it. I also explained in details how you could install your own Workshops-on-Demand backend server. I also took the time to detail the automation that was hosted on this backend server. I also described to you the management of this backend server. This is what is often referred to as Day2 operations. I plan now to explain how to deploy and manage the API-DB server.

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

* A complete JupyterHub server with some addons (additional Jupyterhub kernels, Ansible galaxies, and PowerShell libraries) on your system, ready to host Workshops-on-Demand that you can find here.
* A postfix server used for the procmail API
* An Ansible engine to allow automation
* A fail2ban service
* An Admin user to manage everything
* A set of scripts to handle different tasks such as:

  * Notebooks deployment
  * Jupyterhub compliancy
  * Users compliancy
  * Security Management

#### Backend server preparation:

B﻿efore cloning the backend repository, you will need to prepare the server that will host the backend features. When ready, you will proceed with the cloning and then the installation process.

##### Prerequesites:

In order to setup the backend server, you will need: