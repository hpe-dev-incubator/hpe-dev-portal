---
title: "Jupyter saved my day"
date: 2020-03-10T20:48:19.809Z
author: Frederic Passeron 
tags: ["opensource","jupyter","notebook"]
path: jupyter-saved-my-day
---
Prepping for an industry event always requires a lot of planning, and sometimes a lot of last minute juggling. Preparing for the Hack Shack activities for HPE’s Technology and Solutions Summit (TSS) event in Paris was no different. With the event only a few weeks away, everything appeared to be ready to go. We had lined up the subjects matter experts, reserved our space, attracted a registered audience, and arranged for a dedicated infrastructure to host the technical activities. Unfortunately, the Coronavirus situation escalated and, for the safety of everyone, HPE has decided to adjust the onsite event and turn parts of it into a virtual event.

## How do you switch to a virtual event quickly?

Before the announcement of the onsite event cancellation, event organizers had already contacted the different teams who were participating to figure out how the event could be delivered virtually. They proposed that a subset of the sessions be offered. Those selected would need to be eligible for remote delivery. 

Because our team had already learned how to deal with remote delivery, most of our sessions already fit that requirement. This made it fairly easy to propose a new agenda that included nearly all of the originally planned workshops. It has been a few years since we last shipped material to an event location to support our labs or workshops. Due to budget constraints, and also simple noise issues (it is not easy to run a lab with racks full of servers running next to you), most of our lab activities became remote based-labs anyway. A simple and reliable internet connection is now all that one needs to run them. 

## Jupyter saves the day

HPE DEV Hack Shack sessions are a little more complicated than simple slide presentations. We always do our best to provide attendees with a hands-on experience that they can’t get elsewhere. So, how would we achieve similar results in a virtual situation?

During a TSS event in 2018, a participant provided his solution to a Hack Shack challenge in a Jupyter Notebook format. Didier Lalli, our team leader, found both the solution and the format interesting. As a consequence, he proposed that our team adopt this format for any future labs. I volunteered to take a look at Jupyter Notebooks and see how we could best use it to deliver our labs. In the end, I proposed we use Jupyterhub, as I felt it was the most appropriate tool to address our needs. As a happy happenstance, this decision put us in a great position to turn TSS 2020 into a virtual event. 

## What are Jupyter and Jupyterhub?

To give you a bit of background: The Jupyter project (for Julia / Python / R) is the result of a project called IPython, which is an advanced Python interpreter, that improves the productivity of your code in Python. IPython has gradually evolved, notably with the creation of Notebooks, and now offers a web interface in JSON format that allows you to run a Python kernel and to code directly in a browser with a display of intermediate results. The Jupyter Project was an important step forward for sharing and "interactive" development. [Project Jupyter’s](https://jupyter.org/index.html) [JupyterHub](https://jupyterhub.readthedocs.io/en/stable/) was created to support many users. The Hub can offer notebook servers to an entire class of students, a corporate data science workgroup, a scientific research project team, or a high-performance computing group. With [JupyterHub,](https://github.com/jupyterhub/jupyterhub) you can create a multi-user Hub that spawns, manages, and proxies multiple instances of the single-user [Jupyter Notebook](https://mybinder.org/v2/gh/ipython/ipython-in-depth/master?filepath=binder/Index.ipynb) server.


![picture1](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/1/picture1-1583962183422.png)

The setup we plan on using for the TSS event consists of one HPE ProLiant DL360 Gen 10 with 2x Intel Xeon Silver 4114 CPUs running at 2.2GHz with 10 Cores in each (20 in Hyperthreading mode). The system has 160 GB of ram. It is running an Ubuntu 18.04 distribution and installation was performed following the Jupyter guidelines provided [here.](https://jupyterhub.readthedocs.io/en/stable/installation-guide-hard.html) We are leveraging Python and Powershell kernels. I installed [Iframe](https://github.com/timkpaine/jupyterlab_iframe/) as well, but have not made any use of it so far.

## What is a Jupyter Notebook?

The Jupyter Notebook is an open-source web application that allows you to create and share documents that contain live code, equations, visualizations and narrative text. Uses include data cleaning and transformation, numerical simulation, statistical modeling, data visualization, machine learning, and much more. In our case, Notebooks contain simple Python or Powershell pieces of codes to interact with the different APIs available in the HPE portfolio. Instructions are provided in a markdown format. We centralize the different notebooks on a single Jupyterhub server. This allows us to replicate them across the 40 students currently configured on the server fairly easily through Ansible playbooks. When changes are necessary (fixing a typo for instance in a notebook), updates can be performed quickly by just launching the playbook.


![picture2](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/1/picture2-1583962189410.png)

## Advantages of using Jupyter Notebooks

From a course standpoint, the notebook format is a really simple and flexible solution. The HPE DEV team used to deliver labs in a very academic fashion providing Adobe Acrobat Reader files to the lab attendees. Lab attendees would follow the instructions of the lab, and copy and paste commands from the pdf file to the Windows terminal server session or to a simple PuTTY session. In many cases, errors would occur because some hidden characters were copied from the pdf document to the session (credentials for instance). 

In addition, the format was not the most flexible when any changes needed to be made to the master document (a doc file to be converted in pdf). One would have to redistribute the new version of the file to all the students, making things cumbersome. Even though we always managed to overcome these issues, Didier’s idea was quite appealing since most of our labs and workshops use coding exercises based on Python and Powershell. 


![picture3](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/1/picture3-1583962195154.png)

Taking Didier’s idea, from a logistical standpoint, we architected a solution that could be accessible on the internet. Using Jupyter Notebooks allows us to deliver labs from simply anywhere. The students only needs an internet access to our Jupyterhub server et voila! 
They can even download the notebooks and run them locally on their laptops if they want to do them again later on or reuse some of the code for their own projects.

As I worked on developing this solution, I realized that there were so many new possibilities for its use, like Jupyter Notebooks-as-a-Service. This could be a service that would allow you to learn about the latest and greatest updates from our different APIs. At a minimum, these Jupyter Notebooks will be used in the Hack Shack for future events, like HPE Discover 2020. We are also investigating a simple sharing possibility leveraging our GitHub repository in order to provide people with some of our notebooks.

We are just starting off using this Jupyter technology. The future holds great promise as the forthcoming HPE Container Platform will allow us to deploy and use Jupyter Notebooks beyond simple API calls. For instance, we will have the opportunity to dive into the Artificial Intelligence world through notebooks that make use of TensorFlow technology. Please be sure to check back at [HPE DEV](https://developer.hpe.com/) for a follow up on this.  
