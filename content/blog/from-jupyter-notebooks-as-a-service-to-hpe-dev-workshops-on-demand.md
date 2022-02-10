---
title: From Jupyter Notebooks-as-a-Service to HPE DEV Workshops-on-Demand
date: 2021-04-09T08:38:05.746Z
author: Frederic Passeron
authorimage: https://s.gravatar.com/avatar/3397fa0097e38d890aac69b996879a4e?s=80
thumbnailimage: https://s.gravatar.com/avatar/3397fa0097e38d890aac69b996879a4e?s=80
tags:
  - jupyter
  - notebooks
  - as-a-service
  - on-demand
  - workshop
---
[![HackShack]( https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/4/hackshack-1617960622993.png)]( /hackshack/workshops)



At the end of a [blog post](https://developer.hpe.com/blog/jupyter-saved-my-day) I wrote a year ago, I left off with an idea: Jupyter Notebooks-as-a-Service. Apparently, our HPE DEV team thought it was a great idea, because we went on to create the HPE DEV Workshops-on-Demand. While the name is different, the ultimate goal remained the same. Leveraging the JupyterHub technology, the HPE DEV team created a set of hands-on technology training workshops where anyone could connect to our service and benefit from notebook-based workshops at any time, and from anywhere. 


In our Workshops-on-Demand, users can actually interact and play with code to learn about a variety of different subjects. From infrastructure automation, coding 101 or API-related content, the Workshops-on-Demand catalog covers a broad range of subjects where you can learn about new technologies for free.


Check out all the different topics we offer [here](/hackshack/workshops).


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

Each location is defined through a set of yaml files to specify the different parameters linked to the location (IP Addresses, Hostnames, etc…)



```yaml
PBKDIR: staging
JPHOST: jupyter3.example.com
JPIP: xx.xx.xx.xx
JPHOSTEXT: nb3.example.com
JPHUBAPISRV: http://{{ JPHOST }}:8000
JPHUBTOKEN: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
BASESTDID: 0
APIENDPOINT: https://example.com/api
APIUSER: user
APIPWD: password
LDAPDMN: dc=example,dc=com
#
KIBANAPWD: "zzzzzzzzzzzzzzzzzzzzzzzzzzzzz"
KIBANAPORT: "xxxxxx"
#
STACKSTORMSRVNAME: "sta-stackstorm"
STACKSTORMSRIP: "xx.xx.xx.xx"
STACKSTORMWEBUIPORT: "yyyy"
#
VCENTERAPP: "vcenter.example.com"
VCENTERADMIN: "user"
VCENTERPWD: "xxxxxxx"
#
```



We standardized on Ubuntu 20.04 and Centos 7 for the operating systems and created a few Ansible playbooks to prepare the servers.



The first playbook based on a location parameter would perform:


- the JupyterHub installation
   - System Update
   - Repository Update
   - Apps Installation
   - System Performance Tuning
   - Security Setup
   - JupyterHub application installation and configuration
   - kernels setup & configuration 
   - Linux users creation
   - JupyterHub users creation



The second playbook would take care of deploying the reference notebooks on the newly created JupyterHub server.



A third playbook is run on demand and nightly to ensure that the configuration is consistent and up to date. 



We created two Git repositories, one for the infrastructure management (and all the development we did to automate our deployments) and a second one for the reference notebooks’ content.


## Running

While we worked on automating the deployment/redeployment of a JupyterHub at will, we also focused on improving the notebooks’ deployment automation that we implemented earlier during HPE Discover.



Let me first show you how the overall process works for our Workshops-on-Demand:

![Workshops-on-Demand](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/4/hackshack2-1617960613898.png)

If you’re looking for a live explanation of this automation, you can review [the following session](https://www.youtube.com/watch?v=D6Ss3T2p008&t=515s) Bruno Cornec and I delivered at Linuxconf in Australia in January 2021.



**Step 1:** The customer registers for a workshop online at our virtual [Hack Shack](/hackshack/workshops). When clicking the register button for the selected workshop and after agreeing to the terms and conditions, the front-end triggers the first REST API calls to:

-    Register the student in the Customers Database.
-    Send a welcome email to the student
-    Assign a student ID to him/her according to the student range allocated to the given workshop 

**Step 2:** The registration App then orders (through a mail API call managed by procmail) the backend to:

-    Generate a random password for the selected student
-    Deploy the selected workshop

**Step 3:** The backend Infrastructure calls back the registration application using its REST API to:

-    Provide back the new student password
-    Make the student’s database record active
 -    Decrement Workshop capacity

**Step 4:** The registration App sends:
-    The credentials email to allow the student to connect to the workshop

This infrastructure automation relies mainly on a few bash scripts and Ansible playbooks to: 

 -    Generate random passwords
     -    Update LDAP passwords accordingly when required
 -    Deploy the given workshop to the proper student home directory through an Ansible playbook
-    Update the notebook content through Ansible variables substitutions
     -    Student ID
     -    Student password
     -    API Endpoints definition
 -    Update student permissions
-    Perform all necessary create or reset actions linked to a given workshop outside of the notebook customization



The registration app actually sends an email to the backend with a dedicated format (an API!) that is then parsed by the Procmail process to retrieve the necessary information to perform the different tasks. We use 3 verbs: CREATE (to setup to the student environment as described upper), DELETE (to remove the user from tables), and RESET (to clean up the student content and reset the back-end infrastructure when needed).

At the end of this automated process, the backend makes a series of API calls to the registration app to send back the required information, like a new password, workshop status, etc.



More info on Procmail can be found [here](https://en.wikipedia.org/wiki/Procmail).



## Flying

In the fall, we started a pilot phase for a month. We opened the platform internally and gathered some feedback. We managed to discover a few bugs then that are now corrected. The platform went live in November 2020 and is used on a daily basis.

Since then, we have added new workshops on a monthly basis.  We lately returned to TSS using the Workshops-on-Demand to deliver our content; this time without any manual process in the scheme.



Our next steps include the following:



-   Implement complete deployment scenario
    -   OS Bare metal deployment
-    Provide a new backend on HPE GreenLake
     -     We have now a JupyterHub server running in HPE GreenLake
     -    We validated the relationship between this new backend and our registration application
     -   More testing to come
-    Automate the student ID range booking using a YAML configuration file
-    Open source our Workshops-on-Demand Notebooks content:
    -    This is work in progress. The repository is ready. Licensing is ok. 
    -    Only missing some automation layer again to sync different repositories

Before leaving you with some final thoughts, let me show you a screenshot of our dashboard presenting:


-    The number of Active Workshops
-    The active workshops by type
-    The total number of registrations from November 1st 2020 till today
-    The total number of Customer (student) registrations
-    The total workshops split


![Dashboard](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/4/hackshack3-1617960606167.png)



Didier Lalli from our HPE DEV team created this informative dashboard and wrote a blog about it. If you are interested in learning more about ElasticSearch, read it out [here](https://developer.hpe.com/blog/open-source-elasticsearch-helped-us-globally-support-virtual-labs).



As you can see, we have made significant progress over the past year, moving from a heavily manually oriented approach to now a fully automated one. If you are interested in seeing the result for yourself, [please register for one of our Workshops-on-Demand](/hackshack/workshops). Don’t forget to fill out the survey at the end of the workshop to provide us with feedback on your experience, as well as subjects you would like to see covered in the near future, as this really helps to improve the program.
