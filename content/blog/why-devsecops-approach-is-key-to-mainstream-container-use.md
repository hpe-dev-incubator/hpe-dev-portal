---
title: Why DevSecOps approach is key to mainstream container use
date: 2020-03-17T11:46:32.457Z
author: Dana Gardner
authorimage: /img/Avatar1.svg
disable: false
tags:
  - devops
  - SRE
  - devsecops
  - containers
  - hpe-ezmeral
---
**Editor’s note: This article was originally posted on HPE Enterprise.nxt on March 17, 2020**

- - -

<br />

Container-based deployments are gaining in popularity, but to maintain this momentum, security must start early in project development.

Containers offer a range of benefits across enterprise computing environments―from corporate data centers to the cloud to the edge―and IT organizations are looking to increase use cases. But for container-based deployments to continue on this upward trajectory, security is a must, and it needs to be addressed at the start of development using DevSecOps best practices.

Join this discussion with HPE Pointnext Services' Simon Leech and host Dana Gardner to learn about the advantages containers bring, what it takes to move your projects from proof of concept to mainstream production, and why a DevSecOps approach to security is key to that.

<iframe width="560" height="315" src="https://www.youtube.com/embed/ayoJY1EGsAw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

<br />
<br />

**Dana Gardner:** Hello, and welcome to the next edition of the BriefingsDirect Voice of Innovation podcast series. I'm [Dana Gardner](https://www.linkedin.com/in/danagardner/), principal analyst at Interarbor Solutions, your host and moderator for this ongoing discussion on the latest insights into modern IT deployment architecture strategies.

[Container-based deployment models](https://www.hpe.com/us/en/insights/articles/podcast-the-surging-role-of-containers-in-the-hybrid-estate-1911.html) have rapidly gained popularity, from cloud models to corporate data centers. IT operators are now looking to [extend the benefits of containers](https://www.hpe.com/us/en/insights/articles/the-cloud-is-an-experience-not-a-destination-2002.html) to more use cases, including the computing [edge](https://www.hpe.com/us/en/insights/articles/embracing-the-intelligent-edge-1806.html).

Yet, in order to push containers further into the mainstream, security concerns need to be addressed across this new end-to-end container deployment spectrum―and that means [security addressed during development](https://www.hpe.com/us/en/insights/articles/5-ways-to-secure-your-containers-1904.html) and employment under the rubric of [DevSecOps](https://www.devsecops.org/blog/tag/DevSecOps+Explained) best practices.

Stay with us now as we examine the escalating benefits that come from secure and robust container use with our guest, [Simon Leech](https://www.linkedin.com/in/simonleech/), worldwide security and risk management practice at Hewlett Packard Enterprise (HPE) Pointnext Services. Welcome, Simon.

**Simon Leech:** Hey, Dana. Good afternoon.

**Gardner:** Simon, are we at an inflection point where we're going to see containers take off in the mainstream? Why is this the next level of virtualization?

### Mainstream containers coming

**Leech:** We are certainly seeing a lot of interest from our customers when we speak to them about the best practices they want to following in terms of rapid application development.

One of the things that always held people back a little bit with [virtualization](https://www.hpe.com/us/en/insights/articles/10-virtualization-mistakes-everyone-makes-1808.html) was that you are always reliant on an operating system managing the applications that sit on top of that OS in managing the application code that you would deploy to that environment.

But what we have seen with containers is that, as everything starts to follow a cloud-native approach, we start to deal with our applications as lots of individual [microservices](https://www.hpe.com/us/en/insights/articles/containers-and-microservices-and-serverless-oh-my-1805.html) that all communicate integrally to provide the application experience to the user. It makes a lot more sense from a development perspective to be able to address the development in these small, microservice-based or module-based development approaches.

So, while we are not seeing a massive influx of container-based projects going into mainstream production at the moment, there are certainly a lot of customers testing their toes in the water to identify the best possibilities to adopt and address container use within their own application development environments.

**Gardner:** And because we saw developers grok the benefits of containers early and often, we have also seen them operate within a closed environment, not necessarily thinking about deployment. Is now the time to get developers thinking differently about containers, as not just perhaps a proof of concept (POC) or test environment but as ready for the production mainstream?

**Leech:** Yes. One of the challenges I have seen with what you just described is a lot of container projects start as a developer's project behind his laptop. So the developer is going out there, identifying a container-based technology as something interesting to play around with, and as time has gone by, has realized he can actually make a lot of progress by developing his applications using a container-based architecture.

What that means from an organizational perspective is that this is often done under the radar of management. One of the things we are discussing with our customers as we go and talk about addressing DevSecOps and DevOps initiatives is to make sure that you do get that buy-in from the executive team and so you can start to enable some top-down integration.

Don't just see containers as a developer's laptop project, but look at it broadly and understand how you can integrate that into the overall IT processes that your organization is operating with. And that does require a good level of buy-in from the top.

**Gardner:** I imagine this requires a lifecycle approach to containers thinking―not just about the development but in how they are going to be used over time and in different places.

Now, 451 Research recently predicted that the [market for containers will hit $2.7 billion this year](https://451research.com/images/Marketing/press_releases/Application-container-market-will-reach-2-7bn-in-2020_final_graphic.pdf). Why do you think that the IT operators―the people who will be inheriting these applications and microservices―will also take advantage of containers? What does it bring to their needs and requirements beyond what the developers get out of it?

### Quick-change code artists

**Leech:** One of the biggest advantages from an operational perspective is the ability to make fast changes to the code you are using. So, whereas in the traditional application development environment, a developer would need to make a change to some code and it would involve requesting a downtime to be able to update the complete application, with a container-based architecture, you only have to update parts of the architecture.

So it allows you to make many more changes than you previously would have been able to deliver to the organization, and it allows you to address those changes very rapidly.

**Gardner:** How does this allow for a more common environment to [extend across hybrid IT](https://www.hpe.com/us/en/insights/articles/surprise-youre-running-hybrid-it-1803.html), from on premises to cloud to hybrid cloud and then ultimately to the edge?

**Leech:** Well, applications developed in containers and developed within a cloud-native approach typically are very portable. So you don't need to be restricted to a particular version or limits, for example. The container itself runs on top of any OS of the same genre. Obviously, you can't run a Windows container on top of a Linux OS or vice versa.

But within the general Linux space, that pretty much has compatibility. So it makes it very easy for the containers to be developed in one environment and then released into different environments.

**Gardner:** And that portability extends to the hyperscale cloud environments, the public cloud, so is there a multicloud extensibility benefit?

**Leech:** Yes, definitely. You see a lot of developers developing their applications in an on-premises environment with the intention that they are going to be provisioned into a cloud. If they are done properly, it shouldn't matter if that's a [Google Cloud Platform](https://cloud.google.com/) instance, a [Microsoft Azure](https://azure.microsoft.com/en-us/) instance, or [Amazon Web Services (AWS)](https://aws.amazon.com/).

**Gardner:** We have quite an opportunity in front of us with containers across the spectrum of continuous development and deployment and for multiple deployment scenarios. What challenges do we need to think about to embrace this as a lifecycle approach?

What are the [challenges to providing security](https://www.hpe.com/us/en/insights/articles/security-strategies-for-hybrid-it-hybrid-cloud-and-multicloud-environments-2002.html) specifically, making sure that the containers are not going to add risk and, in fact, improve the deployment productivity of organizations?

### Make security a business priority

**Leech:** When I address the security challenges with customers, I always focus on two areas. The first is the business challenge of adopting containers and the security concerns and constrains that come along with that. And the second one is much more around the technology or technical challenges.

If you begin by looking at the business challenges, of how to adopt containers securely, this requires a cultural shift, as I already mentioned. If we are going to adopt containers, we need to make sure we get the appropriate executive support and move past the concept that the developer is doing everything on his laptop. We train our coders on the needs for secure coding.

A lot of developers have as their main goal to produce high-quality software fast, and they are not trained as security specialists. It makes a lot of sense to put an education program into place that allows you to train those internal coders so that they understand the need to think a little bit more about security, especially in a container environment where you have fast release cycles and sometimes the security checks get missed or don't get properly instigated. It's good to start with a very secure baseline.

And once you have addressed the cultural shift, the next thing is to think about the role of the security team in your container development team, your DevOps development teams. And I always like to try and discuss with my customers the value of getting a security guy into the product development team from day one.

Often, we see in a traditional IT space that the application gets built, the infrastructure gets designed, and then the day before it's all going to go into production someone calls security. Security comes along and says, "Hey, have you done risk assessments on this?" And that ends up delaying the project.

If you introduce the security person into the small, agile team as you build it to deliver your container development strategy, then they can think together with the developers. They can start doing risk assessments and threat modeling right from the very beginning of the project. It allows us to reduce delays that you might have with security testing.

At the same time, it also allows us to shift our testing model left in a traditional waterfall model, where testing happens right before the product goes live. But in a DevOps or DevSecOps model, it's much better to embed the security, best practices, and proper tooling right into the [continuous integration/continuous delivery (CI/CD)](https://www.hpe.com/us/en/insights/articles/the-quickie-guide-to-continuous-delivery-in-devops-1708.html) pipeline.

The last point around the business view is that, again, going back to the comment I made earlier, developers often are not aware of secure coding and how to make things secure. Providing a secure-by-default approach―or even a security self-service approach―allows developers to gain a security registry, for example. That provides known good instances of container images or provides infrastructure and compliance code so that they can follow a much more template-based approach to security. That also pays a lot of dividends in the quality of the software as it goes out the door.

**Gardner:** Are we talking about the same security precautions that traditional IT people might be accustomed to but now extending to containers? Or is there something different about how containers need to be secured?

### Updates, the container way

**Leech:** A lot of the principles are the same. So, there's obviously still a need for network security tools. There's still a need to do vulnerability assessments. There is still a need for encryption capabilities. But the difference with the way you would go about using technical controls to protect a container environment is all around this concept of the [shared kernel](https://thenewstack.io/how-to-lock-down-the-kernel-to-secure-the-container/).

An interesting white paper has been released by the [National Institute of Standards and Technology](https://www.nist.gov/) in the U.S., [SP 800-190](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-190.pdf), which is their Application Container Security Guide. And this paper identifies five container security challenges around risks with the images, registry, orchestrator, the containers themselves, and the host OS.

So, when we're looking at defining a security architecture for our customers, we always look at the risks within those five areas and try to define a security model that protects those best of all.

One of the important things to understand when we're talking about securing containers is that we have a different approach to the way we do updates. In a traditional environment, we take a gold image for a virtual machine. We deploy it to the hypervisor. Then we realize that if there is a missing patch, or a required update, that we roll that update out using whatever patch management tools we use.

In a container environment, we take a completely different approach. We never update running containers. The source of your known good image is your registry. The registry is where we update containers, have updated versions of those containers, and use the container orchestration platform to make sure that next time somebody calls a new container that it's launched from the new container image.

It's important to remember we don't update things in the running environment. We always use the container lifecycle and involve the orchestration platform to make those updates. And that's really a change in the mindset for a lot of security professionals, because they think, "OK, I need to do a vulnerability assessment or risk assessment. Let me get out my Qualys and my Rapid7," or whatever, and, "I'm going to scan the environment. I'm going to find out what's missing, and then I'm going to deploy patches to plug in the risk."

So we need to make sure that our vulnerability assessment process gets built right into the CI/CD pipeline and into the container orchestration tools we use to address that needed change in behavior.

**Gardner:** It certainly sounds like the orchestration tools are playing a larger role in container security management. Do those in charge of the container orchestration need to be thinking more about security and risk?

### Simplify app separation

**Leech:** Yes and no. I think the orchestration platform definitely plays a role and the individuals that use it will need to be controlled in terms of making sure there is good privileged account management and integration into the enterprise authentication services. But there are a lot of capabilities built into the orchestration platforms today that make the job easier.

One of the challenges we've seen for a long time in software development, for example, is that developers take shortcuts by hard coding cleartext passwords into the text, because it's easier. And, yeah, that's understandable. You don't need to worry about managing or remembering passwords.

But what you see a lot of orchestration platforms offering is the capability to deliver sequence management. So rather than storing the passcode within the code, you can now request the secret from the secrets management platform that the orchestration platform offers to you.

These orchestration tools also give you the capability to separate container workloads for differing sensitivity levels within your organization.

For example, you would not want to run containers that operate your web applications on the same physical host as containers that operate your financial applications. Why? Because although you have the capability with the container environment using separate namespaces to separate the individual container architectures from one another, it's still a good security best practice to run those on completely different physical hosts or in a virtualized container environment on top of different VMs.

This provides physical separation between the applications. Very often the orchestrators will allow you to provide that functionality within the environment without having to think too much about it.

**Gardner:** There is another burgeoning new area where containers are being used. Not just in applications and runtime environments but also for data and persistent data. HPE has been leading the charge on making containers appropriate for use with data in addition to applications.

How should the all-important security around data caches and different data sources enter into our thinking?

### Save a slice for security

**Leech:** Because containers are temporary instances, it's important that you're not actually storing any data within the container itself. At the same time, as importantly, you're not storing any of that data on the host OS either.

It's important to provide persistent storage on an external storage array. So looking at storage arrays, things like from HPE, we have Nimble Storage or Primera. They have the capability through plug-ins to interact with the container environment and provide you with that persistent storage that remains even as the containers are being provisioned and deprovisioned.

So your container itself, as I said, doesn't store any of the data, but a well-architected application infrastructure will allow you to store that on a third-party storage array.

**Gardner:** Simon, I've had an opportunity to [read some of your blogs](https://community.hpe.com/t5/Transforming-IT/5-cultural-changes-to-make-container-security-and-DevSecOps-real/ba-p/7070077#.XlPrGC3MzUI), and one of your statements jumped out: "The organizational culture still lags behind when it comes to security." What did you mean by that? And how does that organizational culture need to be examined, particularly with an increased use of containers?

**Leech:** It's about getting the security guys involved in the DevSecOps projects early on in the lifecycle of that project. Don't bring them to the table toward the end of the project. Make them a valuable member of that team. There was a comment made about the idea of a [two-pizza team](http://blog.idonethis.com/two-pizza-team/).

A two-pizza team means a meeting should never have more people in it than can be fed by two pizzas, and I think that that applies equally to development teams when you're working on container projects. They don't need to be big; they don't need to be massive.

It's important to make sure there's enough pizza saved for the security guy! You need to have that security guy in the room from the beginning to understand what the risks are. That's a lot of where this cultural shift needs to change. And as I said, executive support plays a strong role in making sure that that happens.

**Gardner:** We've talked about people and process. There is also, of course, that third leg of the stool: the technology. Are the people building container platforms, like HPE, thinking along these lines as well? What does the technology and the way it's being designed bring to the table to help organizations be DevSecOps-oriented?

### Select specific, secure solutions

**Leech:** There are a couple of ways that [technology solutions](https://www.csoonline.com/article/3398485/28-devsecops-tools-for-baking-security-into-the-development-process.html) are going to help. The first are the pre-production commercial solutions. These are the things that tend to get integrated into the orchestration platform itself, like image scanning, secure registry services, and secrets management.

A lot of those are going to be built into any container orchestration platform that you choose to adopt. There are also commercial solutions that support similar functions. It's always up to an organization to do a thorough assessment of whether their needs can be met by the standard functions in the orchestration platform or if they need to look at some of the third-party vendors in that space, like [Aqua Security](https://www.aquasec.com/) or [Twistlock](https://www.twistlock.com/), which was recently acquired by [Palo Alto Networks](https://www.paloaltonetworks.com/), I believe.

And then there are the solutions that I would gather up as post-production commercial solutions. These are for things such as runtime protection of the container environment, container forensic capabilities, and network overlay products that allow you to separate your workloads at the network level and provide container-based firewalls and that sort of stuff.

Very few of these capabilities are actually built into the orchestration platforms. They tend to be third parties such as [Sysdig](https://sysdig.com/), [Guardicore](https://www.guardicore.com/), and [NeuVector](https://neuvector.com/). And then there's another bucket of solutions, which are more open source solutions. These typically focus on a single function in a very cost-effective way and are typically open source community-led. And these are solutions such as [SonarQube](https://www.sonarqube.org/), Platform as a Service (PaaS), and [Falco](https://sysdig.com/opensource/falco/), which is the open source project that Sysdig runs. You also have [Docker Bench](https://dockerbench.com/) and [Calico](https://www.projectcalico.org/), a networking security tool.

But no single solution covers all of an enterprise customer's requirements. It remains a bit of a task to assess where you have security shortcomings, what products you need, and who's going to be the best partner to deliver those products with those technology solutions for you.

**Gardner:** And how are you designing HPE Pointnext Services to fill that need to provide guidance across this still dynamic ecosystem of different solutions? How does the services part of the equation shake out?

**Leech:** We obviously have the technology solutions that we have built. For example, the HPE Container Platform, which is based around technology that we acquired as part of [the BlueData acquisition](https://www.hpe.com/us/en/solutions/bluedata.html). But at the end of the day, these are products. Companies need to understand how they can best use those products within their own specific enterprise environments.

I'm part of Pointnext Services, within the advisory and professional services team. A lot of the work that we do is around advising customers on the best approaches they can take. On one hand, we'd like them to purchase our HPE technology solutions, but on the other hand, a container-based engagement needs to be a services-led engagement, especially in the early phases where a lot of customers aren't necessarily aware of all of the changes they're going to have to make to their IT model.

At Pointnext, we deliver a number of container-oriented services, both in the general container implementation area as well as more specifically around container security. For example, I have developed and delivered transformation workshops around DevSecOps.

We also have container security planning workshops where we can help customers to understand the security requirements of containers in the context of their specific environments. A lot of this work is based around some discovery we've done to build our own container security solution reference architecture.

**Gardner:** Do you have any examples of organizations that have worked toward a DevSecOps perspective on continuous delivery and cloud native development? How are people putting this to work on the ground?

### Edge elevates container benefits

**Leech:** A lot of the customers we deal with today are still in the early phases of adopting containers. We see a lot of POC engagement where a particular customer may be wanting to understand how they could take traditional applications and modernize or architect those into cloud-native or container-based applications.

There's a lot of experimentation going on. A lot of the implementations we see start off small, so the customer may buy a single technology stack for the purpose of testing and playing around with containers in their environment. But they have intentions within 12 to 18 months of being able to take that into a production setting and reaping the benefits of container-based deployments.

**Gardner:** And over the past few years, we've heard an awful lot of the benefits for moving closer to the computing edge, bringing more compute and even data and analytics processing to the edge. This could be in a number of vertical industries, from autonomous vehicles to manufacturing and healthcare.

But one of the concerns, if we move more compute to the edge, is will security risks go up? Is there something about doing container security properly that will make that edge more robust and more secure?

**Leech:** Yes, a container project done properly can actually be more secure than a traditional VM environment. This begins from the way you manage the code in the environment. And when you're talking about edge deployments, that rings very true.

From the perspective of the amount of resources it has to use, it's going to be a lot lighter, when you're talking about something like autonomous driving, to have a shared kernel rather than lots of instances of a VM running, for example.

From a strictly security perspective, if you deal with container lifecycle management effectively; involve the security guys early; have a process around releasing, updating, and retiring container images into your registry; and have a process around introducing security controls and code scanning in your software development lifecycle―making sure that every container that gets released is signed with an appropriate enterprise signing key―then you have something that is very repeatable, compared with a traditional virtualized approach to application and delivery.

That's one of the big benefits of containers. It's very much a declarative environment. It's something that you prescribe. This is how it's going to look. And it's going to be repeatable every time you deploy that. Whereas with a VM environment, you have a lot of VM sprawl. And there are a lot of changes across the different platforms as different people have connected and changed things along the way for their own purposes.

There are many benefits with the tighter control in a container environment. That can give you some very good security benefits.

**Gardner:** What comes next? How do organizations get started? How should they set themselves up to take advantage of containers in the right way, a secure way?

### Begin with risk evaluation

**Leech:** The first step is to do the appropriate due diligence. Containers are not going to be for every application. There are going to be certain things that you just can't modernize, and they're going to remain in your traditional data center for a number of years.

I suggest looking for the projects that are going to give you the quickest wins and use those POCs to demonstrate the value that containers can deliver for your organization. Make sure that you do appropriate risk awareness, work with the services organizations that can help you. The advantage of a services organization is they've probably been there with another customer previously so they can use the best practices and experiences that they have already gained to help your organization adopt containers.

Just make sure that you approach it using a DevSecOps model. There is a lot of discussion in the market at the moment about it. Should we be calling it DevOps or should we call it SecDevOps or DevOpsSec? My personal opinion is call it DevSecOps because security in a DevSecOps module sits right in the middle of development and operations, and that's really where it belongs.

In terms of assets, there is plenty of information out there in a Google search; it finds you a lot of assets. But as I mentioned earlier, the [NIST white paper SP 800-190](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-190.pdf) is a great starting point to understand not only container security challenges but also to get a good understanding of what containers can deliver for you.

At the same time, at [HPE](https://www.hpe.com/us/en/home.html), we are also committed to delivering relevant information to our customers. If you look on our website and also our [Enterprise.nxt](https://www.hpe.com/us/en/insights.html) blog site, you will see a lot of articles about best practices on container deployments, case studies, and architectures for running container orchestration platforms on our hardware. All of this is available for people to download and to consume.

**Gardner:** I'm afraid we will have to leave it there. We have been exploring how container-based deployment models have gained popularity, from cloud models to corporate data centers. And we have learned how, in order to push containers further into the mainstream, security concerns need to be addressed across this new end-to-end container deployment spectrum.

So please join me in thanking our guest, Simon Leech, worldwide security and risk management practice at HPE Pointnext Services. Thank you so much, Simon.

**Leech:** Thanks for having me.

**Gardner:** I learned a lot. And thanks as well to our audience for joining this sponsored BriefingsDirect Voice of Innovation discussion. I'm Dana Gardner, principal analyst at Interarbor Solutions, your host for this ongoing series of HPE-supported discussions.

Thanks again for listening. Please pass this along to your IT community, and do come back next time.

Container deployment best practices: Lessons for leader

* Begin with a risk assessment―containers aren't appropriate for every application.    

* Look for projects that will give quick wins and show value.    

* Approach container projects using a DevSecOps model, with security integrated from the start.
This article/content was written by the individual writer identified and does not necessarily reflect the view of Hewlett Packard Enterprise Company.    

<u>**About the author:**</u>

Since 1999, Dana Gardner has emerged as a leading identifier of enterprise software solutions, strategies, partnerships, and markets and new IT business value opportunities. He is frequently quoted as a thought leader in top news and IT industry publications such as The New York Times, The Wall Street Journal, The Boston Globe, The Washington Post, Businessweek, San Francisco Chronicle, Reuters, Associated Press, MSNBC.com, CNN.com, and more. As a skilled multimedia communicator and evangelist, he has written dozens of industry reports on the business benefits of IT and Internet innovation for advancing general productivity, improving employee efficiency, and reducing total IT costs. As founder and president of Interarbor Solutions, Dana has taken a strong record in consulting services for IT vendors, carriers, and enterprises to yet another level: the exciting new communications capabilities around Internet social media. Businesses of all kinds are quickly exploiting blogs, podcasts, and video podcasts for education, communications, and viral outreach. Dana practices what he preaches as a frequent blogger, on ZDNet and his personal blog, as well as a podcaster. He began podcasting as a founding member of the Gillmor Gang in 2005.