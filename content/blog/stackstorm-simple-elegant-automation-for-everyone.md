---
title: StackStorm, simple, elegant automation for everyone!
date: 2021-11-18T15:16:44.594Z
author: Rick Kauffman
authorimage: /img/me-art-2.jpg
---
I have been thinking about the data centers and all the different systems communicating with one thing or the other. One question I would always ask, is why don't they all speak the same language. I was thinking something along the lines of routers sending BGP updates to a storage array. Crazy, neither one would understand what the other was saying. This lack of communication between devices is common among many data center resources. What if there was a way all these disparate things could communicate, and they could react to each other? Let me tell you how to do it.

I am amazed by how much information there is, speeding through all the fiber optic connections. Each strand moving massive volumes of information. The data center actors hold a host of information. vCenter, Storage arrays, Network Controllers, Switches, Routers, Power Systems, even cooling systems. Just about every current piece of hardware has a Restful API (application program interface). That means that using a high level programming language, like python, I could develop some code to leverage those APIs and get some sort of traffic flowing between two systems.

 

![](https://www.techworldwookie.com/images/actors.png)



Sounds like a lot of code to write. Every system I want to talk to I will have to write a separate module. For example, in vCenter, I want to build a new port group. It would be awesome if the act of creating the port group would automatically trigger something to add that port group information as a new VLAN (virtual LAN) Aruba central. I could write a python script to get that information from vCenter and then refactor it, and use a different API to send the information to Aruba Central. The plot thickens when I want to add another device like HPE OneView.

I like writing code, but you need to work smarter, not harder. After all, there is only so much time in the day. That is why I love using python. Python has a lot of pre-written modules that make it extremely extensible. By using the **import** command in my script I can take advantage of modules I have no idea how to even start writing. I like the **plug and play** of how easy it is to consume those extra modules. I like using **requests**, I can just code **import requests**, and I have access to a well developed chunk of code that I did not have to write.

What if we applied the same concept to our problem at the start of this blog? What if each of the resources in the data center had a **module** of sorts, that I could plug into some sort of framework? Something like StackStorm!

![](https://www.techworldwookie.com/images/stackstorm.png)

What if I told you there was a place called the StackStorm Exchange that already had 170 of these modules just waiting for you to plug into you projects? [Look at this link.](applewebdata://EBBB076B-5028-426E-9291-45124FE61477/exchange.stackstorm.com) It is quite an impressive stockpile of automation just waiting for you. I recently finished developing a StackStorm integration pack for HPE Primera Storage. Before that I developed a pack to integrate HPE Nimble Storage as well. What communication can we develop? Let's take a look.

Before we get too far here is a quick re-cap of what StackStorm is. StackStorm uses Sensors, Rules, Triggers, Actions, and Workflows. You can think of it as If-this-then-that automation. Based on a event on some device, a StackStorm sensor can detect it, and this could trigger a Rule. The Rule would have some logic in it and if the trigger launched the Rule, the Rule would run an action, or a series of actions called a Workflow. It might sound a little involved but it is all packaged together to make it easy to deploy these solutions.