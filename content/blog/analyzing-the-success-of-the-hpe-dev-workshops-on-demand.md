---
title: Analyzing the success of the HPE DEV Workshops-on-Demand
date: 2021-09-16T07:14:18.418Z
author: Frederic Passeron
authorimage: /img/fp-hpewod.jpg
thumbnailimage: /img/fp-hpewod.jpg
---
![](/img/wodanalysisblog1.png "HPE DEV Hackshack")

In October of 2020, the HPE DEV team introduced a **very easy** way for users to learn about a variety of different software topics by interacting with code virtually – in the form of **free** HPE DEV Workshops-on-Demand. Starting with just three workshops, the program has continued to grow and now offers over 20 courses, ranging from basic coding 101 to sophisticated infrastructure automation.

![](/img/wodanalysisblog2.png)

These hands-on workshops cover a variety of [topics](https://hackshack.hpedev.io/workshops), including open source technologies (i.e. Kubernetes, SPIFFE/SPIRE, Grommet), popular programming languages (i.e. Python, RUST, StackStorm), coding tools (i.e. APIs, Git), and market-leading HPE technologies (i.e. HPE Ezmeral Container Platform and Data Fabric, HPE OneView, HPE iLO). Whether it’s due to the popularity of these topics, the workshop’s unique, easy-to-follow methodology, the associated badge recognition program, or the fact that they’re free – these workshops have certainly gained quite a lot of interest!

**Measuring success**

The goal of the HPE DEV program is to foster a community where members can innovate through shared experiences, collaboration, and learning. As just one of the services HPE DEV offers to the developer community, the Workshops-on-Demand program is an important one that fits these goals very nicely. Every so often we take stock of our programs to determine how much value each one offers so we can make any necessary adjustments. And, as the program manager for the HPE DEV Workshops-on-Demand, it really falls on me to make that determination.

From my standpoint, rocketing from offering 3 to now over 20 workshops during the course of a year could easily be seen as success. But from a participant‘s side, it might be different. So what data should be considered a good measure of success for this program?

I decided to analyze a few data points from different categories that appeared to provide some important insights:

* Participants:

  * Number of attendees
  * Type of attendees (including HPE employees, partners, customers)
  * Completed workshop surveys
* Content:

  * Number of workshops produced
  * Topics covered
* Infrastructure:

  * Resiliency of the platform
  * Accessibility

![](/img/wodanalysisblog3.png "Total Number of participants per month")

As you can see on the chart above, the increase in the number of people using the workshops has been growing steadily month over month. The times where you see noticeable jumps in attendance are due to events where the team would make use of the HPE DEV Workshops-on-Demand platform to deliver technical sessions; i.e. HPE Technology and Solutions Summit in March or HPE Discover in June. These events help promote the HPE DEV Workshops-on-Demand, as many event participants come back later to register for additional workshops. In my mind, having a participant show up to a workshop is good, but having him to come back for more sessions, knowing that they could take up to 4 hours, is impressive. I consider this as a good mark of success.

Analyzing the types of attendees helps us gauge whether the content being provided is appropriate. It helps us answer questions like “Is the technical level too deep?”, “Is more time required?”, and “Are we hitting the appropriate target audience?”

Another important measurement is the number of surveys filled out at the end of each workshop. These surveys are very important to us for several reasons:

**Reason #1**

They allow us to see if our content is relevant to the participant. In the completed surveys, participants gave the workshops an average rating of

* **4.64 stars out of 5 for technical level**
* **4.63 stars out of 5 for the overall value of the workshop**

**Reason #2**

They allow us to see if the delivery method is correct. The surveys indicated that the Jupyter Notebooks format has been very well accepted, with an average rating of

* **4.60 stars out of 5**

**Reason #3**

They help us define new topics and give us insight into the user’s experience. Comments such as “*Great initiative, the more technical format is the way to go for us engineers and developers, just try to go deeper (using more time if required)*.”and “*Great idea and a very suitable form of delivery.*” provide feedback that we can use to modify content and add additional, appropriate courses.

**Content**

Aligning with the HPE DEV charter, the workshops span topics that interest our audience, which tend to be related to:

* IT OPS and DevOPs in terms of API interaction, Automation
* Open source
* Programming languages
* Data analytics
* AI / MLOPS

The workshops range from simple 101-level sessions to more advanced labs. We try to keep a balance of courses available for participants who are just starting, to courses for those community members who are looking for more technical depth.

As mentioned earlier, we started small and have continued to build out a wide selection of workshops over this past year. We plan to continue to expand this program, always taking your feedback on which new topics should be offered.

![](/img/wodanalysisblog4.png)

Some topics tend to be more popular than others. You can see that the HPE Ezmeral workshops are very well attended. AI / MLOPS and HPE iLO/Redfish workshops are also quite popular. Open Source and Programming workshops follow close behind.

**Infrastructure**

From a backend perspective, we started the program with a single JupyterHub server to support the very first workshops. Each of the workshops are using different types of API endpoints. When reaching a public weather forecasting API, nothing much is required on the backend side apart from the JupyterHub server itself.

When targeting an HPE Ezmeral Container Platform API, however, the requirements are completely different. To face an ever growing number of workshops and participants, we decided to implement additional JupyterHub servers. In addition to the first JupyterHub server sitting in an HPE site in France, we created a second JupyterHub server in another HPE location. We also leverage HPE GreenLake cloud services to offload some workshops. We now have three production sites, which allow us to improve our workshop’s resiliency. We can now easily redirect an existing workshop from one site to another.

Although this is all transparent to the participant, this is key to the success of the program, as it allows our workshops to run 24/7, all year long, and still for free!

Our Ansible-based automation allows us to replicate content easily when combined with the right set of Git commands. We can build or rebuild a complete working and production-ready JupyterHub server in just a few hours and monitor the stability of the environment to ensure our workshops are always ready to go.

From a frontend perspective, we also improved several aspects. Our developer did a great work in redesigning the tiles layout providing a better presentation of the Workshops-on-Demand's catalog. We added a dedicated registration page per workshop too. Finally, we also performed a REST API integration of our frontend to the [HPE Demonstration Portal](https://hpedemoportal.ext.hpe.com/).

**Looking forward**

I plan to come back next year and summarize the achievements of the team regarding Phase 2 of the program. Planned upgrades include an even nicer portal for our workshops, a broader range of 101 workshops covering artificial intelligence (AI), MLOPS, Spark, Concourse and more.

If you haven’t taken one of our workshops yet, please [register for one of our Workshops-on-Demand](https://hackshack.hpedev.io/workshops), and see why they have attracted so many users. It’s really important to fill out the survey at the end of the workshop to provide us with feedback on your experience, as well as inform us about new subjects you would like to see offered. As always, it’s your feedback that really helps to improve this program within the HPE DEV Community.