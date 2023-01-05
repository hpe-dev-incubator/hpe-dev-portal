---
title: How-To build up your own Workshops-on-Demand Infrastructure?
date: 2022-12-14T12:35:46.869Z
author: "Frederic Passeron "
authorimage: /img/fp-hpewod.jpg
disable: false
---
### H﻿ow-to build up your own Workshops-on-Demand Infrastructure.

## A﻿ bit of background first:

[T﻿he Workshops-on-Demand](https://developer.hpe.com/hackshack/workshops/) have been an important asset for the HPE Developer Community for the last 2 years. We lately reached more than 4000 registered workshops. The project was used during physical and virtual events like HPE Discover, HPE Technical Symposium Summit, but also during Open Source events like OSS CON or Kube Con. Overtime, people have actually asked us how they could setup their own Workshops-on-Demand infrastructure. 

A﻿s a consequence, we decided over the course of the Year 2022 to open source the project. As HPE Employees, we had to go through different steps including technical, legal concerns to achieve this.

F﻿rom a legal standpoint, we needed to go through the OSSRB (Open Source Review Board) to present the project that we wanted to open source. This was quite straightforward in this case as the project did not contain any HPE proper Intellectual Property that could not be viewed publicly. Indeed, the project is mainly based on Open Source technologies like Ansible or Jupyter. Besides, we explained the OSSRB that the new architecture of the solution would allow the administrator of the project to separate public content from private one. In our case, for instance, any workshop related to an HPE technology like  HPE Ezmeral would fall into the private part of the project and therefore would not appear on the public github repository.

F﻿rom a technical standpoint, as mentioned above we had to make sure to separate the public only content from any possible private one. We started by sorting the different Workshops. As a consequence, we also had to sort the related scripts that come along workshops. Going through this process, we found out that some of the global scripts had to be reworked as well to support future split of public and private content. This took us a few months and we are now ready to share with you the result of this work.

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

M﻿eanwhile, the frontend server will perform regular checks on time passed.