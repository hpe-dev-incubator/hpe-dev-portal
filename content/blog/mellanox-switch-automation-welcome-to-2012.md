---
title: Mellanox switch automation welcome to 2012!
date: 2022-10-07T22:54:50.118Z
author: Rick Kauffman
authorimage: /img/me-art.jpg
---
T﻿he Mellanox 2010 ethernet switch is a curious thing. It is only half the width of a normal 19 inch rack mount switch. It has 18 10/25G ports. Perfect when you need two switches for high availability deployments but only a handful of ports are required. The fact they are only half width, you only need 1U of  a data center rack. I believe because of its features and price, it makes an excellent candidate for HPE dHCI deployments.

I﻿ recently was involved with a proof of concept for a very large customer where these Mellanox switches would be used. The end design calls for over 200 locations.A quick calculation tells us that 400 different switches will need to be configured. That would be a lot of typing on a terminal using the switch command line. I think this calls for some automation!

My role in the project is to configure the network to support all the different connections the deployment will require. I should get out my console cable and start hammering away on the command line. After all there are only two configurations at this site, should be easy. 

Fortunately, I love to automate things and I want to have consistency in all my switch configuration files. Let's take a look at the architecture.

 

![](/img/network_760x435.png "network")

There are only five networks. The ILO or Out of Band management, the VMware Management network, home of vcenter, a VM production network, and two ISCSI data networks.

Looking at a switch configuration file, most of the information is static. Very little of it is dynamic. There are only 17 variables that need to be collected before they can be applied to a Jinja2 template. The solution for me was a form.

The ultimate goal is to develop the application to speak directly to the switches via the Rest API. Without having access to the hardware makes it a bit of a challenge to develop the python bindings. So I needed to travel back in time to where I first learned about Jinja2 templates and Flask.

![](/img/form_597x384.png "Mellon")

I﻿ timed it and it only takes about three minutes to fill out the form and hit the generate button. The application will generate two configuration files which can be secure copied to the Mellanox switch.

I﻿ know not everybody likes to fill out forms. Some like to fill out spreadsheets. With the application there are two options, one will generate a pair of configuration files, the other will generate configuration files for many different sites or locations. 

B﻿y changing the values in column "c", you can generate a pair of configuration files.

![](/img/pair.png "Pair of switches")

I﻿f there are many sites to generate, then the bulk file can be used.

![](/img/bulk.png "Bulk sites")

A﻿ video tutorial can be found on  my personal blog here: <https://www.techworldwookie.com/automation-for-the-sake-of-automating/>

The application runs in Docker and docker-compose needs to be installed on the host system. I just use Docker Desktop and everything becomes quite portable. The application can be found over on my github account, here: <https://github.com/xod442/Mellon>

If I can ever get access to a physical switch I will finish the API version of this application, until then I give you Mellon. You can still do it the hard way if you like, but I find using Mellon gives me more time to code.