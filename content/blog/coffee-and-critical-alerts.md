---
title: "Coffee and Critical Alerts"
date: 2019-02-20T22:40:05.439Z
author: Brad Stanley 
tags: ["hpe-oneview-global-dashboard"]
path: coffee-and-critical-alerts
---
What could be better than starting your day with a hot cup of coffee and a custom-made critical alerts report? Ok, an exaggeration, but OneView Global Dashboard’s 1.7 (OVGD) release has several new features including a new report – Critical Alerts. This new report combined with the existing feature of scheduling reports can make a powerful ally in keeping your data center healthy by cutting time spent hunting for problems to fix and instead having them presented to you.

In this post I’ll share how to create a custom Critical Alerts report and how to schedule it.

Note: In order to create a custom report, enable email, and schedule a report, the user must have a role of type Infrastructure administrator. 

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/12/blog-figure1-1550702346651.png)

After logging in to OVGD, select the Reports page to see the *Critical Alerts* report. First, select the report, which will run it, the report has ellipsis in the top right show the options available to you – see Figure 1. 

If customizations are desired, you will need to save a custom version of this report. This can be done by selecting *Save*. Customizations could include a search, sorting on a different column in the table, filtering by selecting any subset of the meters in the two meter groups (*Alerts by Occurred Date* and *Alerts by Resource Type*), or by adding or remove columns from the table. You can add or remove columns by selecting *Manage Report Content*, also shown in Figure 1.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/12/blog-figure2-1550702392981.png)

Here is an example. Say you have an employee who troubleshoots all of the *server-hardware* issues. For that person, you could create a custom report filtered on the server-hardware meter underneath the Alerts by Resource Type meter group. Other customizations could be easily added as well. Once the report has the customizations you desire, remember to save it. Run that saved report and again click the ellipsis, but this time select *Schedule*. See Figure 2.

Whoever is responsible for getting your data center from red to green status can have a custom made email sent to them each morning with their area of expertise highlighted. Or everyone could receive the same emails by adding multiple recipients to each one. 

OVGD has lots of flexibility built into the *Reports* feature. A cup of coffee combined with OVGD email may be just what you need to save some time and start your day off right. 
