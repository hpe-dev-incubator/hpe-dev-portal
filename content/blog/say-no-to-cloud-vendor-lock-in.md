---
title: "Say NO to (Cloud) Vendor Lock-in!"
date: 2019-09-03T17:13:05.705Z
author: Didier Lalli 
tags: ["hpe-ezmeral"]
authorimage: "/img/blogs/Avatar1.svg"
featuredBlog: false
priority:
thumbnailimage:
---
![gettyimages 761603815](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/gettyimages-761603815-1567544802064.jpg)

During my 30 year technology career, working for Digital Equipment Corporation (DEC), Compaq Computer, Hewlett Packard (HP) and now Hewlett-Packard Enterprise (HPE), I was in the center of the action when the industry-standard server tsunami hit the computer industry. I rode the wave as we moved away from vendor-specific operating systems (HP-UX, SunOS, AIX, VMS) running on vendor-specific servers (HP, IBM, DEC, Sun) that were powered by vendor-specific processors (PA-RISC, Alpha, Sparc, Power, etc.). Intel x86 powered servers, running Linux, available from any kind of vendor, quickly took over. Death to vendor lock-in! That was our motto at the time. 

Soon after, database and other software enablers ran into a similar situation. It was an open source snowball effect, having everything to do with avoiding vendor lock-in and encouraging customers to part ways with Oracle, DB2, and RDB. When virtualization technologies came along, they again started out very vendor specific (and still are with VMware, for the most part) but open source solutions also emerged, i.e OpenStack. These solutions now allow customers to build open source private clouds that run on any industry-standard server. 

Next came the container revolution. Right from the start, containers appeared as an open source solution and that certainly helped in its incredible adoption rate. The success of the container management framework, Kubernetes, is the latest proof of the power of open source and vendor lock-in avoidance. 

So, what’s the story with public cloud? Some vendors, like Google, are active open source contributors. For the most part, though, public cloud vendors are acting like the HP/Compaq/IBM/DEC of the ‘80s: they propose attractive and innovative solutions only available on their specific cloud technologies and lock you in. The minute you start using some of the best APIs from AWS right in the heart of your code, you are hooked! If you decide to run your application on another cloud, you must rewrite the application to a different API. There are multiple reasons why the ability to deploy on another cloud could become important for your application, whether it’s because of a large customer requirement, merger and acquisition, or cost, as explained by one of Hashi Corp’s founders [here.](https://www.reddit.com/r/devops/comments/91afzz/why_multicloud/e2x156y/)

If you think about it, public cloud today is all about vendor lock-in. Going [serverless](https://en.wikipedia.org/wiki/Serverless_computing) (i.e. AWS Lambda, Azure Functions, Google Cloud Functions), meaning the ability to write code that can run on anything and for which you just pay for what’s used, isn't going to help, as it locks you up even tighter. But if serverless is what developers really want, then the next logical step would be cloudless. With cloudless, you could write cloud-agnostic applications that can run on any public or private cloud in an everything-as-a-service consumption model. Given everything that I’ve seen, this makes the most sense and is probably where the industry is headed so make sure you learn more about [Cloudless]( https://www.hpe.com/us/en/insights/articles/cloudless-1906.html) from [here.](https://www.hpe.com/cloudless) Finally, don’t make the same mistakes some made 20 years ago and get entangled in proprietary solutions: say __No__ to vendor lock-in now!
