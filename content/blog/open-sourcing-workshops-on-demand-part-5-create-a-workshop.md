---
title: "Open sourcing Workshops-on-Demand - Part 5: Create new workshops"
date: 2023-07-24T10:43:53.548Z
author: Frederic Passeron
authorimage: /img/frederic-passeron-hpedev-192.jpg
disable: false
---
I﻿n this new article that is part of this series dedicated to the [open sourcing of our Workshops-on-Demand project](https://developer.hpe.com/blog/willing-to-build-up-your-own-workshops-on-demand-infrastructure/), I will focus on the necessary steps to build up a new workshop. I already covered most of the infrastructure part that supports the workshops. It now makes sense to emphasize a bit on the content creation.

# O﻿verview

H﻿ere is a simple flowchart describing the 10000 feet view of the creation process:

![](/img/wod-b-process.png "Workshop's creation flow.")

A﻿s you can see, no rocket science here. Just common sense. Depending on the workshop you wish to create, some obvious requirements should show up. A workshop based on a programmatic language for instance, will require the relevant kernel to be setup on the JupyterHub server. The following [page](https://gist.github.com/chronitis/682c4e0d9f663e85e3d87e97cd7d1624) will list all available kernels.

S﻿ome other workshops might need a proper infrastructure to run on. A kubernetes101 workshop fro instance could not exist without the presence of a proper Kubernetes cluster. Same thing goes for any HPE related solutions.

F﻿rom an infrastructure standpoint, a minimum of environments are necessary. You will need a test/ dev,  a staging and at least one production environment. The HPE Developer Community actually started with only a test/dev/staging on one side and a production on the other side.

I﻿ will not focus here on the first steps. I leave it to you to figure out new subjects. I will talk a bit again about the infrastructure and especially the dedicated scripts and variables that you need to create to support the lifecycle of the workshop. As usual, there are two sides to the workshop's creation. What should be done on the backend and what needs to be done on the frontend (web portal and database server mainly)

![](/img/wod-blogserie3-archi3.png "WOD Overview.")

I﻿ will consider two scenarios going further. In the first one, I will create a simple workshop that does not require any infrastructure but the JupyterHub itself. Then, in a second phase, I will go through a more complex workshop creation process that will cover most of the possible cases I could think of.

# S﻿imple workshop example:

l﻿et's consider that I plan to create a new workshop on the Go language. It becomes more and more popular among the developer community I interact with and one of the the developer was kind enough to agree with working with me on creating this new workshop. After a first meeting, where I explainied to him the creation process, and the expectations, we quickly started to work together. We defined title, abstract,  notebooks' folder name, and student range. As far as infrastructure's requirements, a new kernel was needed. No additional scripts are requiered for this workshop.

A﻿s an admin of the Workshops-on-demand infrastructure, I had to perform several tasks:

##### O﻿n the backend server:

1. ###### Test and validate installation of the new kernel on the staging backend server by:

* Creating a new branch for this test
* M﻿odifying the [backend server installation yaml file ](https://github.com/Workshops-on-Demand/wod-backend/blob/main/ansible/install_backend.yml#L326)to include the new kernel.

  ![](/img/wod-go-yml1.png)

  ![](/img/wod-go-yaml2.png)
* Validating the changes by testing a new backend install process.
* Pushing the changes to the github repo.

2. ###### Creating a user for the workshop developer on the test/dev and staging backend servers.
3. ###### Providing to the developer the necessary information to connect to the test/dev and staging backend servers.
4. ###### Copy over the workshop developer's home folder a workshop template containing examples of introduction, conclusion and lab notebooks, allowing him to start his work.

##### O﻿n the database server:

In order to exist, a workshop requires serveral things:

I﻿n the **Workshops table:**

A﻿ new entry will need the following:

![](/img/wod-db-go-1.png "Workshop's fields in the Database.")

* **An id:** A workshop id to be used by backend server automation and Replays table to reference the associated replay video of the workshop.
* **A﻿ name:** The workshop's name as it will will be displayed on the registration portal.
* **A name of the folder** containing all the workshop's notebooks
* **A﻿ description / abstract**
* **A﻿ capacity:** The number of maximum concurrent students allowed to take on the workshop.
* **A﻿ student range:** The range between which students get picked at registration time.
* **R﻿eset and ldap** entries are to be used by backend server automation if dedicated reset scripts and ldap authentication are required by the workshop.
* **A﻿ session type:** Workshops-on-Demand by default
* **A﻿ location:** If your setup includes multiple production sites, use this field to allocate workshops according to your needs. In the case of the HPE Developer Community, some workshops can only run on a HPE GreenLake cloud environment. As a consequence, the location is set to greenlake in this case.
* **A﻿vatar, role and replayLink** are superseeded by entries in the replay table. I will explain later.

![](/img/wod-db-go-2.png "Workshop's fields in the Database #2.")

* **Compile:** This entry will be filled with the name of a script to be compiled at deployment time. This feature allows for instance the admin to hide login scripts and credentials in non-editable executable files.
* **Varpass:**  This defines whethere a workshop require some password variable to be leveraged or not.
* **R﻿eplayId:** This entry links the dedicated replay video to the workshop. it enables the presence of the replay in the learn more page of the workshop.
* **W﻿orkshopImg:** As part of the lifecycle of the workshop, several emails are sent to the student. A workshop image is embbeded in the first emails.
* **B﻿adgeImg:** As part of the lifecycle of the workshop, several emails are sent to the student. In the final email, a badge is included. It allows the student to share its accomplishment on SoME like linkedin for instance.

***N﻿ote:*** B﻿oth W﻿orkshopImg and B﻿adgeImg are located on the same remote web server.

* **B﻿eta:** Not implemented yet :-)
* **Category:** The workshops' registration portal proposes several filters to display the catlog's content. You can view all workshops, the most poular ones, or by category. Use this field to sort workshops accordingly.
* **A﻿lternateLocation:** Not implemented yet. The purpose is allow automation of the relocation of a workshop in case of primary location's failure.
* **D﻿uration:** All workshops are time bombed. You will define here the time alloacted to perform the workshop.
* **A﻿ctive:** Tag to set to enable visibility of the workshop's tile in the registration portal.

I﻿f you feel you need more details about the registration process, please take a look at the **Register Phase** paragraph in [the following introductionary blog](https://developer.hpe.com/blog/willing-to-build-up-your-own-workshops-on-demand-infrastructure/).

I﻿n the **Replays table:**

A﻿ new entry will need the following:

![](/img/wod-db-go-3.png)

* **Id:** This entry will be filled with the name of a script to be compiled at deployment time. This feature allows for instance the admin to hide login scripts and credentials in non-editable executable files.
* **Avatar:**  This defines whethere a workshop require some password variable to be leveraged or not.
* **D﻿escription:** Same description as the one available in the workshop's table entry
* **P﻿resenter:** Name of the presenter
* **Role:** Roe of the presenter (the workshop developer in fact: Solution Architect, Fullstack Developer, etc...)
* **V﻿ideoLink:** Youtube link of the recorded video to be used as a replay.
* **W﻿orkshopId:** Id of the workshop linked to the video. 
* **A﻿ctive:** Tag to set to enable visibility of the replay in registration portal.

A﻿s the developer of the Workshops-on-demand content, Matt had to perform several tasks:

##### O﻿n the backend server:

1. ###### Log on to the backend server and clone the notebook repo in his home folder.
2. ###### Create a new branch for his workshop following the naming convention defined with the admin and clone the notebooks repo.
3. ###### L﻿everage the template provided by me to build up the content of his workshop.
4. ###### T﻿est the workshop leveraging the `test-action.sh` script
5. ###### T﻿est the workshop using the staging registration portal.
6. ###### W﻿hen all tests are green, create a pull request to merge content with master repo.

A﻿s an admin, I need to check the pull request and accept it. Once done, the test/dev and staging environments will require an update.

1. ###### Log on to the backend server as wodadmin and update the notebook repository.
2. ###### R﻿un a wod-deliver to update the relevant backend server.

   ```
   git remote update
   git rebase
   wod-deliver
   ```

T﻿he very same processes will apply to the move to production phase.



* M﻿odifying the \[backend server installation yaml file ]



# Complex workshop example:

II will not repeat the steps I descirbed earlier for the simple workshop example. I will focus here on the specific aspects related to this  new workshop. Are you familiar with High Performance Computing (HPC)? I am not. Even tough I am surrounded by some experts in that field in the HPE Grenoble Office. Let's consider that one of these colleagues is willing to build up a dedicated workshop on HPC Stax. As usual, we will start by a meeting each of us will explain to the other his goals, and how to achieve them. Once I get a clearer understanding of the technology involved, he and I can move on figure out the best platform to run his woorkshop on.

A﻿s an admin of the Workshops-on-demand infrastructure, I had to perform several tasks:

##### O﻿n the backend server:

t﻿he  workshop will require:

* A dedicated server running docker to host the student containers in which the workshops' labs will take place.

* A﻿ set of Ansible playbooks to setup the dedicated server.

* A﻿ set of scripts to manage the workshop's lifecycle.

* A set of variables to be leveraged by the notebooks. 





A﻿ set of notebooks that will be used by the student to follow instructions cells in markdown and run code cells leveraging the relevant kernel. If you are not familiar with Jupyter notebooks, a simple [101 workshop](https://developer.hpe.com/hackshack/workshop/25) is available in our Workshops-on-Demand 's catalog.

O﻿ptional:

You should now have a better understanding of the maintenance tasks associated to the backend server. Similar actions are available for the other components of the project. Checking tasks have been created for the frontend and api-db server. Having now mostly covered all the subjects related to the backend server from an infrastructure standpoint, it is high time to discuss the content part. In my next blog, I plan to describe the workshop creation process.  Time to understand how to build up some content for the JupyterHub server!

If we can be of any help in clarifying any of this, please reach out to us on [Slack](https://slack.hpedev.io/). Please be sure to check back at [HPE DEV](https://developer.hpe.com/blog) for a follow up on this. Also, don't forget to check out also the Hack Shack for new [workshops](https://developer.hpe.com/hackshack/workshops)! Willing to collaborate with us? Contact us so we can build more workshops!