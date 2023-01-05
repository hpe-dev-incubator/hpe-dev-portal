---
title: How-To build up your own Workshops-on-Demand Infrastructure?
date: 2022-12-14T12:35:46.869Z
author: "Frederic Passeron "
authorimage: /img/fp-hpewod.jpg
disable: false
---
# H﻿ow-to build up your own Workshops-on-Demand Infrastructure.

## A﻿ bit of background first:

[T﻿he Workshops-on-Demand](https://developer.hpe.com/hackshack/workshops/) have been an important asset for the HPE Developer Community for the last 2 years. We lately reached more than 4000 registered workshops. The project was used during physical and virtual events like HPE Discover, HPE Technical Symposium Summit, but also during Open Source events like OSS CON or Kube Con. Overtime, people have actually asked us how they could setup their own Workshops-on-Demand infrastructure. 

A﻿s a consequence, we decided over the course of the Year 2022 to open source the project. As HPE Employees, we had to go through different steps including technical, legal concerns to achieve this.

F﻿rom a legal standpoint, we needed to go through the OSSRB (Open Source Review Board) to present the project that we wanted to open source. This was quite straightforward in this case as the project did not contain any HPE proper Intellectual Property that could not be viewed publicly. Indeed, the project is mainly based on Open Source technologies like Ansible or Jupyter. Besides, we explained the OSSRB that the new architecture of the solution would allow the administrator of the project to separate public content from private one. In our case, for instance, any workshop related to an HPE technology like  HPE Ezmeral would fall into the private part of the project and therefore would not appear on the public github repository.

F﻿rom a technical standpoint, as mentioned above we had to make sure to separate the public only content from any possible private one. We started by sorting the different Workshops. As a consequence, we also had to sort the related scripts that come along workshops. Going through this process, we found out that some of the global scripts had to be reworked as well to support future split of public and private content. This took us a few months and we are now ready to share with you the result of this work.

## U﻿nderstand the architecture first.

 The workshops-on-Demand concept is fairly simple. the following picture provides you with the overall process.

![Workshops-on-Demand Concepts 1](/img/howto-wod-1.png "Workshops-on-Demand Concepts 1")