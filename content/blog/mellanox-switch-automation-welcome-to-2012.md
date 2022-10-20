---
title: Mellanox switch automation, my gift to the network challenged engineers
date: 2022-10-07T22:54:50.118Z
author: Rick Kauffman
authorimage: /img/me-art.jpg
---
T﻿he Mellanox 2010 ethernet switch is a curious thing. It is only half the width of a normal 19-inch rack mount-switch. It has 18 10/25G ports. This is perfect when you need two switches for high-availability deployments but only a handful of ports are required. The fact that they are only half-width you only need 1U of  a data center rack. I believe because of its features and price, it makes an excellent candidate for HPE dHCI deployments. 

In my recent involvement with a proof-of-concept for a very large customer who would be using Mellanox switches in over 200 locations, my job was to configure the network to support all the different connections the deployment required. I quickly calculated that 400 different switches would need to be configured. That would be a lot of typing on a terminal using the switch command line. Fortunately, I love to automate things and maintain consistency in all my switch configuration files.

You never know when you'll run into the same issue, so let me help you out here by showing you how I handled it and gifting you the application I developed to take care of instances like this. First, let's take a look at the architecture so you can better understand how I did it."



![](/img/network_760x435.png "network")

Within the architecture, there are only five networks; the iLO (or Out-of-Band management), the VMware Management network, the home of the vCenter, a VM production network, and two ISCSI data networks

My ultimate goal was to develop an application to speak directly to the switches via the REST API. Without having access to the hardware, it was a bit of a challenge to develop the Python bindings. Since I would be using Jinja2 templates and Flask, it required me to travel back in time to when I first learned them and remember the basic pieces I needed.

Looking at the switch configuration file, most of the information is static. Very little of it is dynamic. There are only 17 variables that need to be collected before they can be applied to a Jinja2 template. So, the solution for me was a form .to collect the variables. 

Writing the Python code can be quickly accomplished if you can see the results of the API requests. It  contains valuable information that gives guidance as to the specific structure of the information the switch sends back. Without access to the physical hardware, the next best thing is to create a configuration file that can be copied to the switch.  So I needed to travel back in time to where I first learned about Jinja2 templates and Flask. <https://flask.palletsprojects.com/en/2.2.x/>

Flask is a web server written in python, it makes it super easy to build elegant user interfaces. Jinja2 is a templating solution that allows placing variable information in a text file. Jinja2 will look for the “double mustache” or “{{ x }}”. This tells JInja2 where the variable information gets placed in the file. If I had a variable like “ip_address” which was 137.162.0.98 and a configuration like this: ip address {{ ip_address }}, Jinja2 would resolve the text to something like this; ip address 137.162.0.98.  You can learn more about Jinja2 by following this link: [](https://jinja.palletsprojects.com/en/3.1.x/)[https://svn.python.org/projects/external/Jinja-2.1.1/docs/_build/html/index.html](https://svn.python.org/projects/external/Jinja-2.1.1/docs/_build/html/index.html)



![](/img/form_597x384.png "Mellon")

I﻿ timed it and it only takes about three minutes to fill out the form and hit the generate button. The application I designed generates two configuration files, which can be secure copied to the Mellanox switch. 

With this application there are two options; one will generate a pair of configuration files, and the other will generate configuration files for many different sites or locations. 

In the main directory of the application, there is a comma separated variable file, known as a CSV. The title is mellanox_config.csv. Using Microsoft Excel, open the CSV file and you will see three columns. By changing the values in column “C”, you can generate a pair of configuration files. Below is an example of the contents of the file. At first it won't look as nice as the example. You will have to stretch out the columns and shade them to your liking (totally optional)

![](/img/pair.png "Pair of switches")

I﻿f there are many sites to generate, then the bulk file can be used.

![](/img/bulk.png "Bulk sites")

A﻿ video tutorial can be found on  my personal blog here: [](https://www.techworldwookie.com/automation-for-the-sake-of-automating/)<https://www.techworldwookie.com/automation-for-the-sake-of-automating>

The application runs in Docker and docker-compose needs to be installed on the host system. I just use Docker Desktop and everything becomes quite portable. The application can be found over on my GitHub account, here: [](https://github.com/xod442/Mellon)<https://github.com/xod442/Mellon>

If I can ever get access to a physical switch, I will finish the API version of this application. Until then, I give you Mellon. You can still do it the hard way if you like, but I find using Mellon gives me more time to code.