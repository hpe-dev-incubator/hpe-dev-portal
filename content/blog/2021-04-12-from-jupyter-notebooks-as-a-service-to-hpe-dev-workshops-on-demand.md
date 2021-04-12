---
title: From Jupyter Notebooks-as-a-Service to HPE DEV Workshops-on-Demand
date: 2021-04-09T08:38:05.746Z
author: Frederic Passeron
authorimage: /img/Avatar1.svg
tags:
  - jupyter
  - notebooks
  - as-a-service
  - on-demand
  - workshop
---
[![HackShack]( https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/4/hackshack-1617960622993.png)]( https://hackshack.hpedev.io/workshops)



At the end of a [blog post](https://developer.hpe.com/blog/jupyter-saved-my-day) I wrote a year ago, I left off with an idea: Jupyter Notebooks-as-a-Service. Apparently, our HPE DEV team thought it was a great idea, because we went on to create the HPE DEV Workshops-on-Demand. While the name is different, the ultimate goal remained the same. Leveraging the JupyterHub technology, the HPE DEV team created a set of hands-on technology training workshops where anyone could connect to our service and benefit from notebook-based workshops at any time, and from anywhere. 


In our Workshops-on-Demand, users can actually interact and play with code to learn about a variety of different subjects. From infrastructure automation, coding 101 or API-related content, the Workshops-on-Demand catalog covers a broad range of subjects where you can learn about new technologies for free.


Check out all the different topics we offer [here](https://hackshack.hpedev.io/workshops).


Now, let me explain how we made this possible…


## Early prototype

We built up our first JupyterHub server for the virtual HPE Technology & Solutions Summit (TSS) that took place in March 2020 and used it to deliver the workshops we would normally give in person in a virtual way. We hosted just a few Jupyter notebooks-based workshops and found that they scored really well in feedback we received from the students. All notebooks were delivered through a single instance of a JupyterHub server.


During the event, we ran only a single workshop at a time. We first set up a range of users (students) to match a given workshop. It required a lot of manual setup, a few scripts and a single Ansible playbook to handle the copy of the workshop content assigned to the desired range of students, with a few variable substitutions like student IDs, passwords, and some API endpoints when relevant. The student assignment was done manually, at the beginning of every workshop. For instance, Fred was student1, Didier was student2, and so on… which was quite cumbersome. When you only have a range of 25 students, one or two people handling the back end is sufficient. But if 40 people show up, then it becomes tricky.


## Standing up

We offered this virtual training first at TSS and then Aspire, (two internal HPE events.) Then HPE Discover, the largest HPE technology event, appeared on the radar. We were asked to renew the content of the workshops, add in new subjects like artificial intelligence (AI), machine learning operations (MLOPS), containers, etc. and that’s what we did. We also needed to provide a registration portal to allow automated customer registration. 


Both the workshop and challenge activities we planned on providing at HPE Discover were notebooks-based. The workshop was a follow-along, hands-on lab (aka an instructor-led workshop). The code challenges were different in that those who participated were asked to answer questions and then produce code snippets for a dedicated problem with the goal of winning a prize for the best submission. To assist in streamlining our processes, our developer, Pramod, stood up a nice app that allowed customers to register as well as automated the deployment of the notebooks. We implemented it only for the code challenges. The deployment for the workshops remained manual. These challenges allowed us to validate the beta version of the registration app.


## Walking (or First steps)

By the end of the summer, we had many of the pieces in place that we needed to make the dream of Notebooks-as-a-Service a reality. We had the content and the automation to deliver it through an automation layer like Ansible. We also now had a registration app that simplified customer registration as well as workshop management (workshop capacity, workshop reset specificities, etc.). From this point, we really had something we could build upon.


Where everything was manual or lightly scripted before, we really need it to be fully automated in order to make this a viable solution. We developed each new workshop on a staging environment. When ready, we moved it to the production environment. We also had a third environment located on a different site that could be used to recover a workshop. This proved very advantageous when, on the first day of HPE Discover 2020, we had to recover everything from the secondary site a few hours before the event started, since a backhoe cut the internet line on main site. Today, we are also leveraging our HPE GreenLake offering to build up one more environment. This continues to be a work in progress. 

As you can see, we have a few environments to deploy and manage. Without automation, it would be too much work and prone to error.


Each server is associated to a logical location and role (Production, Staging, Sandbox, and GreenLake): Jupyter1 is the production server. Jupyter2 is the sandbox server. It is used to perform some early testing and is located in a different datacenter from the production and staging servers. Jupyter3 is the staging server. Workshops are developed and validated on this server before moving to production. Finally, Jupyter4 is deployed in a dedicated HPE GreenLake tenant. It will serve over time as a second production site.
