---
title: Meet Linux Distinguished Technologist and Open Source evangelist, Bruno Cornec
date: 2021-08-18T16:39:18.068Z
author: Dale Rensing
authorimage: /img/Avatar4.svg
tags:
  - EVANGELIST
  - opensource
---
As a leading global, edge-to-cloud platform-as-a-service company, Hewlett Packard Enterprise (HPE) prides itself in employing team members who share one common purpose: to advance the way people live and work. In this blog series, you’ll get to meet a number of them as I interview some of the open source experts working with the HPE DEV team.



Bruno Cornec has been administrating Unix systems since 1987, and Linux systems since 1993. He began his career as an engineer in Software Engineering focused on Software Configuration Management. He was responsible for nearly everything related to the product, including design, development, presales, consulting, and training.



Bruno discovered the Free Libre Open Source Software (FLOSS) movement in 1993 thanks to Linux and has worked with it ever since, engaging in various aspects such as development, presales, technical writing, translation, consulting, training, and small technical team management. He is also involved in a number of open source projects, like [MondoRescue](http://www.mondorescue.org/), [Mageia](http://www.mageia.org/), [project-builder.org](http://www.project-builder.org/), [python-redfish](https://opendev.org/x/python-redfish/), [FOSSology](http://www.fossology.org/), and LinuxCOE. He is now a strong Linux and open source advocate and continues to evangelize its use in many conferences around the globe.

## Bruno, can you tell me a little about these different open source projects that you are working on? 
My work on open source projects all started with MondoRescue back in 2000 when I began working in what was then HP in Grenoble, France as a Linux Technologist. I was chartered with allowing our plants to preinstall Linux distributions on our servers, and I found this tool that was nearly doing everything I wanted for that purpose. 



Two or three patches later, it was ready for me to use to build the installation media for a remote team to use to preinstall Red Hat and SUSE distributions on our servers that even launched automatic tests at the end of the setup so the machines could be validated before being sent to customers.



I worked with the upstream MondoRescue project lead to have my patches adopted in the project, and voilà, that’s how you become an upstream contributor! I then took over the maintenance of the project and created a package build environment for more than 150 different distributions. This became the Project-Builder.org project. I used my packaging knowledge to help the Mageia distribution, which I’m using daily on HPE desktops and servers, both at work and at home. 



Each time I looked at another technology, there were FLOSS projects related to it that could benefit from some contributions linked to an HPE usage. This has allowed me to work with the Fossology developer team while looking at FLOSS to tool open source governance, as well as create a Python-Redfish module to have a Python-based implementation of a Redfish (DMTF standard) library and CLI tool.

## I understand that you’ve been collaborating with the HPE DEV team to automate the backend infrastructure that hosts our Workshops-on-Demand. Can you tell me a little more about your role in regards to this project? 
My official role is to act as the liaison between the HPE DEV team and the World Wide Customer Innovation Center (CIC) team for which I work. We are in charge of the WW [HPE demonstration portal](https://hpedemoportal.ext.hpe.com/), and are always looking for content to share with our presales and partners communities. Integrating the technical and educational HPE DEV developed content into our portal was an obvious thing to do. 



My role quickly expanded, however. Before integrating the content, I helped the HPE DEV team with the automation steps I thought were required to ensure the best customer service. We worked on the set up and automation  of the JupyterHub portals, using some scripts and lots of Ansible playbooks. We also automated the setup of training appliances from end-to-end to serve both as the documentation of these installations and a nice way to recover in case of any issues. As the back-end infrastructure is not directly accessible from the Internet, I introduced the team to some old-fashioned, but extremely useful, tools such as procmail to create a very functional non-REST API. Going through the firewall without security concerns using mail was, I think, one of the more interesting ideas I introduced to the HPE DEV team in parallel to their more “classical” HTTPS-based REST API development. 



Once all that was ready and working well, we could finally make the two portals interact so that, with single sign-on authentication, our presales and partner colleagues could easily consume the HPE DEV Workshops-on-Demand from our CIC portal.

## I understand you collaborate with the HPE DEV team on other projects as well. Can you expand on that? 
I’m also helping with the Greenlake integration. We’re designing it so the full JupyterHub and appliances stack can be instantiated at will as-a-service in Greenlake through one touch of a button. At least, that’s the goal, and we now have many pieces in place to make that successful.



As I’m also interested in sharing knowledge, and have always been active around training either in HPE or Open Source events in the past, I’m converting [my former Labs](https://github.com/bcornec/Labs/) into Jupyter Notebooks starting with the most popular, the Docker 101. I’m hoping this will attract more system admins and help them discover all the other Workshops-on-Demand the HPE DEV team offers. I’m a firm believer in continuing to educate oneself over the course of their career. The HPE DEV Workshops-on-Demand offer a great way to do this.

## Speaking of training, you recently held a training class for the Campus Numérique in the Alps. I’d love to hear more about that. 

The [Campus Numérique in the Alps’](https://le-campus-numerique.fr/) role is to bring people back to IT jobs. They train a wide variety of students, from people without a diploma who become Webmasters all the way up to doctors in science to become future (big) data specialists (the Data-8 track). They manage 170 students across 4 sites, with the help of benevolent experts that share their knowledge, in addition to their own teachers - 100 people in total. They deliver 5 different diplomas that are recognized at the European level.



Their teaching practice is based on experimentation first and introducing theory as they see fit. Thus, the possibility of using the HPE DEV Workshops-on-Demand in this context was particularly well-suited. I was chartered with explaining to Data-8 students the FLOSS ecosystem and the notion of contribution, licenses, etc. 



Before working on a concrete example of code contribution, I had the students refresh their Git knowledge of using Git as a base tool for project contribution using the [Git 101 Workshop-on-Demand](https://hackshack.hpedev.io/workshop/17). I also used the [API 101 Workshop-on-Demand](https://hackshack.hpedev.io/workshop/9) to teach them what an API is and how they could interact with a tool providing one. As the [Hack Shack portal](https://hackshack.hpedev.io/) is easily accessible to everybody, I used it to support my training sessions.



## Is there anything else you’d like to share with our readers? 

What is great about FLOSS is that, even 28 years after having started looking at it, you continue to learn. The ability to have such easy access to everything from code, to docs, to training materials, empowers you incredibly. My next step with the HPE DEV team is to make the contents we develop, and later on, the platform itself, available under a FLOSS license in order to give back for what I got out of it for all these years. Many thanks to HPE for supporting [our FLOSS contributions](https://www.hpe.com/us/en/open-source.html) with our Open Source Program Office!



And all that can only continue if you, dear readers, go on sharing your knowledge and code so we can all capitalize on it to always build even greater pieces of software. As said on the MondoRescue website: “All rights reversed”.







To learn more about the open source projects that HPE is involved with, please visit our website. Interested in exploring what HPE offers for developers and data scientists? Check out our [HPE DEV site](https://developer.hpe.com/) for a ton of articles, workshops, tutorials, and other resources.




