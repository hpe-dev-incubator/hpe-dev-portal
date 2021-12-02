---
title: "StackStorm: simple, elegant automation for everyone!"
date: 2021-11-18T15:16:44.594Z
author: Rick Kauffman
authorimage: /img/me-art-2.jpg
tags:
  - StackStorm
  - opensource
  - automation
---
There is so much information speeding through a data center from one resource to another - vCenter, storage arrays, network controllers, switches, routers, power systems, cooling systems, etc. Yet, oddly enough, these resources don't all speak the same language, hindering communications and their ability to react to one another. But, what if routers could could gain some insightful knowledge from a storage array? Or, maybe HPE OneView could automatically exchange vlan information with an Aruba Cx switch?

Since just about every piece of hardware today has a Restful API (application programming interface), there is actually a way to make this happen. Using a high-level programming language, like Python, one could develop some code to leverage those APIs to get traffic flowing between two disparate types of systems.

![](https://www.techworldwookie.com/images/actors.png)

Sounds like a lot of code to write. For every system I want to talk to, I will have to write a separate module. For example, in vCenter, I want to build a new port group. Wouldn't it be awesome if the act of creating the port group would automatically trigger something to add that port group information to a new VLAN (virtual LAN) Aruba central? I could write a python script to get that information from vCenter and then refactor it, and use a different API to send the information to Aruba Central. I still wouldn't have the automation I am looking for unless I scheduled a **cron job** to run my code. The task becomes exponentially harder when I want to add another device like HPE OneView into the conversation.

I like writing code, but prefer to work smarter, not harder. After all, there is only so much time in the day. That is why I love using Python. Python has a lot of pre-written modules that make it extremely extensible. By using the **import** command in my script I can take advantage of modules I have no idea how to even start writing. I like the **plug and play** of how easy it is to consume those extra modules. I like using **requests**, because I can just code **import requests** and I have access to a well-developed chunk of code that I did not have to write.

What if we applied the same concept to our problem at the start of this blog? What if each of the resources in the data center had a **module** of some sorts, that I could plug into some sort of framework? Something like StackStorm!

![](https://www.techworldwookie.com/images/stackstorm.png)

Before I go too far, let me give you a quick recap of what [StackStorm](https://developer.hpe.com/blog/master-the-automation-universe-the-easy-way-part-1-introduction-to-stack/) is. StackStorm uses **sensors**, **rules**, **triggers**, **actions**, and **workflows**. You can think of it as **If-this-then-that** automation. Based on a event on some device, a StackStorm sensor can detect it and this could trigger a rule. The rule would have some logic in it and if the trigger launched the rule, the rule would run an action, or a series of actions called a workflow. It might sound a little involved but all of the rules, actions, sensors and workflows are packaged together in a StackStorm pack to make it easy to deploy these solutions.

![](https://www.techworldwookie.com/images/process.png)

What if I told you there was a place called the StackStorm Exchange that already had 170 of these modules you can plug into your projects? [Look at this link](https://exchange.stackstorm.org/),  It is quite an impressive stockpile of automation just waiting for you just waiting for you to take advantage of it. I recently finished developing a StackStorm integration pack for HPE Primera Storage. Before that, I developed a pack to integrate HPE Nimble Storage. What communication can we develop?

Using these packs, I went about trying to determine what sort of communication could be developed between the two storage systems, I settled on volumes. I wanted to be able to create a volume on the HPE Primera and have it **automatically** appear on a HPE Nimble storage array. Maybe this is something cool, maybe not, but it was just going to demonstrate the power of HPE devices talking to one another and have the capability to talk to the StackStorm integration packs out on the exchange. The process would look something like this:

![](https://www.techworldwookie.com/images/flow.png)

The most important thing to remember is that when I run a StackStorm workflow, one step in the process can be running a StackStorm action from one integration pack, and the next task can be a StackStorm action from any other pack! Now, I have StackStorm integration packs for HPE OneView, HPE Nimble, and HPE Primera. Using these StackStorm integration packs allows HPE OneView, HPE Nimble, and HPE Primera communicate with one another. Because they are part of StackStorm, they now have access to all the pre-written automation packs available on the StackStorm Exchange! 

I have written StackStorm integration packs for **[Qumulo](https://github.com/xod442/Stackstorm-qumulo)**, HPE **[OneView](https://github.com/HewlettPackard/stackstorm-hpe-oneview)**, **[Aruba Fabric Composer](https://github.com/HewlettPackard/stackstorm-aruba-fc)**, **[iLo-amplifier](https://github.com/xod442/stackstorm-hpe-iloamplifier)**, [HPE Nimble](https://github.com/HewlettPackard/stackstorm-hpe-nimble). and even one for **[Arista Cloud Vision Portal](https://github.com/xod442/stackstorm-arista-dev)**. The list has grown quite a bit since I started this endeavour. What is the net result of this activity? The communication between servers, and storage, and networking in the data center just got a little better. I challenge myself, as well as you, to think about the solutions that could be developed by applying this automation. It is said that any process you can document, you should automate. If you can automate the process you no longer have to do it yourself and that can give you back precious minutes of your busy schedule.

If you have something you would like to have a StackStorm integration pack developed for, you can take action. You can start by reading my other blog posts [here:](https://developer.hpe.com/search/?term=stackstorm) You could check out the [Workshop-on-Demand](https://hackshack.hpedev.io/workshop/21) or take my free [StackStorm introductory training ](https://github.com/xod442/stackstorm-tutorial)and start your journey on your way to simple, elegant automation.