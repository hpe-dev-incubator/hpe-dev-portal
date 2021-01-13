---
title: "Master the automation universe the easy way! Part 1: Introduction to StackStorm"
date: 2020-06-22T07:20:59.673Z
author: Rick Kauffman 
tags: ["automation","StackStorm","opensource"]
path: master-the-automation-universe-the-easy-way-part-1-introduction-to-stack
---
![stackstorm](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/stackstorm-1592810807425.png)

In case you haven’t noticed, the world is obsessed with automation. You hear it every day in meetings with sales people, team members and in the latest blog entries about data centers. Inevitably, someone will mention the words “Rest API” and, to prove they really know what they are talking about, they quickly mention Salt, Chef, Puppet, and Ansible, just like a trusted advisor would. Talk about name-dropping!

But not everyone is reading off the same script. The automation space is filled with a lot of choices when it comes to picking a solution and there are plenty of ways one can *automate* tasks. When I hear the word *automate*, I naturally think *remove humans from the process*.  This means choosing a solution that can be *aware* of the environment, something that can listen and watch. Then, when a predefined event happens, automation can spring into action and do the heavy lifting for us humans.

When we look at automation tools like Salt, Chef, Puppet, and Ansible, they all have a place in the automation world. These are tried and true industry solutions but, for the most part, need to be initiated by some sort of process, even if it’s simply logging in and manually kicking it off. StackStorm takes a different approach. StackStorm (st2) is an event-based automation framework that is often described as *If this, then that* automation. StackStorm can use sensors to monitor systems and listen for specific events. If an event happens, then a rule can be applied to run a single action or a complex set of actions called a *workflow*.

![stackstorm view](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/stackstorm-view-1592810817247.png)

StackStorm has quite a few moving parts. The good news is you can start small, automating with a couple of **actions**, and later begin using **sensors** and **rules** as your understanding grows. Let’s take a closer look at actions. **Actions** are just scripts, pieces of code that can perform automation or remediation tasks. They are the workhorse of StackStorm. Actions can restart a service on a server, spin up a VM, or send an alert or notification, just to name a few possibilities. These examples are really not all that impressive, but hold on, ‘cause we’re just getting started. 

**Sensors** are deployed to watch event/alarm queues. An alarm sensor can listen for specific alarms and recognize when the alarm is present. Next, the sensor will load a **trigger** that is assigned to a **rule**. When the trigger fires, the rule that is tied to that trigger runs the actions or workflows that are assigned to the rule. This could be something like sending a notification to pager duty, spin up or down a VM, or open an incident report in **Service Now**.

My point here is that when an event happens, several things are put into motion with no human intervention. Sure, tools like Ansible, Chef, and Puppet have capabilities to take action and make changes, but what they are missing is the ability to automatically *know* when something happens.

StackStorm sensors, actions, trigger, rules, and workflows are all provided together in StackStorm packs. If you have a st2 server, you can own all the pre-written automation required to integrate into something like **Service Now** simply by typing ` st2 pack install servicenow `. With one command, you have installed all the automation software you need to fully integrate with **Service Now**.

If you point your web browser to [exchange.stackstorm.com](https://exchange.stackstorm.com), you will discover over 170 StackStorm automation packs just waiting for you to consume. Azure, AWS, VMware… hundreds of actions just waiting for you to install and use to automate just about anything.

I have been deep into StackStorm for over a year and a half now. I’ve developed st2 packs for HPE OneView, iLoAmplifier, HPE Composable Fabric, Aruba CX and Qumulo and I am just getting started. Want to learn more? Head on over to my [StackStorm tutorial](https://github.com/xod442/stackstorm-tutorial) and you, too, can master the automation universe, if you’re into that sort of thing. Keep an eye out on the [HPE DEV blog](https://developer.hpe.com/blog) site for more interesting articles and tutorials on automation.
