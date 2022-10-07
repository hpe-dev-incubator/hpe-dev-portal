---
title: Mellanox switch automation welcome to 2012!
date: 2022-10-07T22:54:50.118Z
author: Rick Kauffman
authorimage: /img/me-art.jpg
---
T﻿he Mellanox 2010 ethernet switch is a curious thing. It is only half the width of a normal 19 in rack mount switch. It has 18 10/25G ports. Perfact when you need two switches for high availability deployments but only a handful of ports are required.The fact they they are only half width, you only need 1U of  a data center rack. I believe because of it's features and price, it makes an excellent candidate for HPE dHCI deployments.

I﻿ recently was involved with a proof of concept for a very large customer where these Mellanox switches would be used. The end design calls for over 200 locations.A quick calculation tells us that 400 different switches will need to be configured. That would be a lot of typing on a terminal using the switch command line. I think this calls for some automation!

I﻿magine walking into a site and looking at the equipment that needs configured. An Alletra Array, A handful of ProLiant DL servers, and two Mellanox 2010 switches.  My role in the project is to configure the network to support all the different connections the deployment will require. I can get out my console cable and start hammering away on the command line. After all there are only two configurations at this site, should be easy. 

Fortunately, I love to automate things and I want to have consistency in all my switch configuration files. Let's take a look at the architecture.

![](/img/network_760x435.png "network")

There are only five networks. The ILO or Out of Band management, the VMware Management network, home of vcenter, a VM production network, and two ISCSI data networks.

The ultimate goal is to develop the application to speak directly to the switches via the Rest API. Without having access to the hardware makes it a bit of a challenge to develop the python bindings. So I needed to travel back in time to where I first learned about Jinja2 templates and Flask.