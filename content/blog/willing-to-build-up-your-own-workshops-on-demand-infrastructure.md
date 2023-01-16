---
title: "Open sourcing Workshops-on-Demand Part 1: The why and the How."
date: 2022-12-14T12:35:46.869Z
author: "Frederic Passeron "
authorimage: /img/fp-hpewod.jpg
disable: false
---
### Open Sourcing the Workshops-on-Demand #1: The why and the how

## A﻿ bit of background first:

[T﻿he Workshops-on-Demand](https://developer.hpe.com/hackshack/workshops/) have been an important asset for the HPE Developer Community for the last 2 years. If you are interested in learning more on the genesis of the project, check the following [blog](https://developer.hpe.com/blog/from-jupyter-notebooks-as-a-service-to-hpe-dev-workshops-on-demand/).

T﻿he Workshops-on-Demand allows us to deliver free hands-on based workshops. We use them during internal or external events (HPE Discover, HPE Technical Symposium Summit, but also during Open Source events like OSS CON or Kube Con) to promote API / Automation driven solutions along with some coding 101 courses. B﻿y the end of 2022, we reached more than 4000 registered workshops.  

### T﻿he Why?

Firstly, if you read carefully the messaging on our [homepage](https://developer.hpe.com/) , you will find words like sharing and collaborating. This is part of the Team's DNA. 

S﻿econdly, the project is based on open source technologies like Jupyter or Ansible. It felt natural that the work we did leveraging these should also benefit the open source community.

W﻿e actually did share with the HPE DEV Community and to a wider extent the Open Source Community the fondamentals of the project though different internal and external events. And the feedbacks were always positive. Some people found the project very appealing. Originally, people were mainly interested in the content and not necessarily in the infrastructure. The students wanted to be able to reuse some of the notebooks. And in a few cases, they also asked for details about the infrastructure itself, asking about the notebooks delivery mechanism and other subjects like the [procmail API](https://www.youtube.com/watch?v=zZm6ObQATDI).

E﻿arly last year, we got contacted by an HPE Colleague who was willing to replicate our setup in order to deliver Notebooks to its AI/ML engineers. His purpose was to provide a simple, central point of delivery of notebooks. Engineers would develop notebooks that would later be published on the workshops-on-demand infrastructure frontend portal, allowing content to be reused and shared amongst engineers. While we had worked over time a lot on automating content delivery and some parts of the infrastructure setup, we needed now to rework and package the overall solution to make it completly open source and reusable by others.

A﻿s a consequence, we started over the course of the Year 2022 to open source the project. As HPE Employees, we had to go through different steps including technical, branding, and legal concerns to achieve this.

#### L﻿egal side of things...

F﻿rom a legal standpoint, we needed to go through the HPE OSRB (Open Source Review Board) to present the project that we wanted to open source. We had to follow the following process 

![HPE OSRB Process](/img/wod-osrb1.png "HPE OSRB process")

 This was quite straightforward in this case as the project did not contain any HPE proprietary software. And HPE did not want to exploit commercially the generated intellectual property. Indeed, the project is uniquely based on Open Source technologies like Ansible or Jupyter. Besides, we explained the OSRB that the new architecture of the solution would allow the administrator of the project to separate public content from private one. This had a huge influence on the future architecture of the project that originally did not allow it. In our case, for instance, any workshop related to an HPE technology like  HPE Ezmeral would fall into the private part of the project and therefore would not appear on the public github repository that we had to create for the overall project distribution.

#### T﻿echnical side of things

F﻿rom a technical standpoint, as mentioned above we had to make sure to separate the public only content from any possible private one. We started by sorting the different Workshops. As a consequence, we also had to sort the related scripts that come along workshops. Going through this process, we found out that some of the global scripts had to be reworked as well to support future split of public and private content. Similarly, we had to address the branding aspect, variabalizing it instead of hardcoding it as it was in the first version.

This took us a few months and we are now ready to share with you the result of this work. In this first blog, we will focus our attention on the architecture side of the Workshops-on-Demand project. 

F﻿urther blog articles will help you setup your own architecture.

## U﻿nderstand the architecture first.

 The workshops-on-Demand concept is fairly simple. the following picture provides you with the overall process.

![Workshops-on-Demand Concepts 1](/img/wod-blogserie1.png "Workshops-on-Demand Concepts 10000 feet view")

N﻿ow that you have understood the overall principle, let's look at the details now. The following picture  will show from a protocol standpoint what happens at each stage.

![](/img/howto-wod-4.png)

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

4﻿.The Backend Server recieves the order and processes it by  parsing the email recieved using the procmail API. the procmail API automates the managementof the workshops.

Like any API, it uses verbs to perform tasks.

CREATE to deploy a workshop

C﻿LEANUP to delete a workshop

R﻿ESET to reset associated workshop's resource

T﻿his means:

* P﻿reparing any infrastructure that might be requiered for the workshop (Virtual Appliance, Virtual Machine, Docker Container, LDAP config, etc..)
* G﻿enerate a random Password for the allocated student
* D﻿eploy the workshop content on the jupyterhub server in the dedicated student home directory (Notebooks files necessary for the workshop)
* Send back through API Calls to the frontend server the confirmation of the deployment of the workshop along with the student details (Password)

5﻿.The frontend server get its different tables updated:

* T﻿he customer tables shows an active status for the participant row. The password field has been updated. 
* T﻿he Workshop table gets also updated. The capacity field decrement the number of available seats. 
* The student tables gets updated as well by setting the allocated student to active.

6﻿.The frontend server sends the second email to the particpant providing him with the details to connect to the workshop environment.

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

P﻿cture of the detailled prtocol based architecture  here

N﻿ow that you have understood the principles, let's dive into the details on how to setup your own Workshops-on-Demand Infrastructure.