---
title: Application Modernization with the Application Workbench
date: 2021-05-10T08:22:34.902Z
featuredBlog: false
priority: null
author: Sahithi Gunna
authorimage: /img/Avatar1.svg
tags:
  - modernization
  - application
  - ezmeral
  - container
  - hpe-ezmeral
  - devops
	- sre
  - site-reliability-enginee
---
**Editor’s Note – HPE Ezmeral Container Platform is now HPE Ezmeral Runtime Enterprise**. For more information on why the name was changed, please [click here](https://community.hpe.com/t5/HPE-Ezmeral-Uncut/HPE-Ezmeral-Container-Platform-is-now-HPE-Ezmeral-Runtime/ba-p/7151720#.YW7nOxrMKM8).
 
- - -


One of the most significant issues facing enterprises in their journey towards digital transformation is the challenge of application modernization. Did you know that 70% of the Global IT budget is spent on legacy application maintenance?  In fact, 7 in 10 companies today struggle with legacy application maintenance while they tackle their digital transformation. Consider how counterproductive it is to spend that much time, energy, and money on something that doesn’t really help them move forward.

In this post, I’ll discuss the different approaches one can take to modernize an application and how the HPE Ezmeral Application Workbench can help.

## What is Application Modernization?

Application modernization is the process of taking legacy applications and the platforms they run on and making them new again by replacing or updating each with modern features and capabilities. It includes changing the underlying application architecture from a monolithic to a distributed model by taking the advantage of the integration and automation implicit in DevOps practices. It also often means that the architecture and source code are updated through the use of modern programming languages in order to support containers and microservices and can take advantage of built-in security and storage features.

One could equate application modernization to updating the design of a car. For instance, if you were to compare a vintage 1967 Ford Mustang to a modern 2021 version, the 1967 would not have disk brakes, ABS, fuel injection, air bags, shoulder belts, crush zones and all the other things that make it a modern, safe, reliable, and economical car. 

Truly, there is very little you can do to a 1967 Mustang to bring it up to the standards of a 2021 car. To transform it, you would need to change the 1967 car’s base architecture. Another option would be to completely replace the older car with a different brand that boasts a modern architecture, like Tesla. But that would probably change a lot about how you drive. If you happen to like Ford and want to stick with it because you’re familiar with how their cars work, that approach may not work well for you.

This same idea applies to modernizing software applications. You cannot simply update the underlying compute and storage infrastructure and expect an application to automatically behave as if it had modern features. An application that was built for a mainframe environment is very different from applications that are built today, applications that are optimized for distributed environments and developed through the use of DevOps practices. To have an application work efficiently and securely across hybrid clouds, it needs to be modernized.

## The Challenges of Modernizing Legacy Apps

Enterprises face a variety of challenges as they address application modernization, such as: 

- Isolating applications from their infrastructure is often a very time consuming and manual process.
- Legacy, monolithic systems are not designed with distributed hardware in mind and are difficult to break apart.
- Legacy apps lack security integrations.
- They also lack tight DevOps integration.
- Lastly, budget and cost control are difficult to estimate, as well as difficult to test and consolidate amongst legacy applications.

There are different approaches one can use to migrate legacy applications into modern architectures. Most of these solutions are offered in the [HPE Ezmeral Container Platform](https://www.hpe.com/us/en/solutions/container-platform.html) along with the [HPE Ezmeral Data Fabric](https://www.hpe.com/us/en/software/data-fabric.html). Depending on the customer use case, application, cost, and time requirements, HPE can help to smooth the way in this journey. 

## What are the Options for App Modernization?

There are several different paths organizations take in their attempt to modernize their applications: 

<img src="/img/1-gunna.png" width="600" height="359" class="center">

* **Rehost** – This simply means that a legacy application is moved to a modern compute and storage platform, either on premise or in the cloud, without altering the original code. In this case, the application does not magically acquire modern features. Going back to our car analogy, it would be like giving a 1967 Mustang new tires. You can’t expect that it would now also have all the features found in a 2021 Mustang. Rehosting an application does not modernize it.
* **Refactor**, **Redesign** and **Rebuild** – These options involve rewriting portions of the applications from scratch, while preserving the original scope and specifications. Using these methods will modernize an application by updating the source code to a newer programing language, the underlying data to modern formats, and the compute and storage infrastructure to support the newly modernized application.
* **Replace** – Another option is to replace the application altogether. This option eliminates the original application completely and replaces it with a new application better suited to an organization's current business needs.  

HPE Ezmeral has a part to play in each of these scenarios to assist in your application modernization goals. For instance, if you decide to **Rehost**, the [HPE Ezmeral Container Platform](https://www.hpe.com/us/en/solutions/container-platform.html) offers a central control plane for virtual or physical compute resources located on premise, in the cloud, or at the edge. It includes full support for standard Kubernetes (K8s) orchestration and the [HPE Ezmeral Data Fabric](https://www.hpe.com/us/en/software/data-fabric.html), which powers the data plane with a global namespace for data from core to edge – all wrapped in a secure, enterprise-class, highly available platform.

For those who wish to **Refactor** their code, HPE Ezmeral smooths the path to do so. There are many different resource management types for deploying an application on Kubernetes, and all of these are supported by the HPE Ezmeral Container Platform. You can use different options for refactoring or rebuilding the app, depending on what best matches your organization needs. A key feature of the HPE Ezmeral Container Platform is its use of KubeDirector, an open source Kubernetes custom controller that addresses stateful scale out application deployment in standard K8s clusters. This approach enables transparent integration with K8s user/resource management and existing K8s clients and tools.

HPE Ezmeral also offers the [HPE Ezmeral Application Workbench](https://docs.containerplatform.hpe.com/53/app-workbench-5-1/getting-started/AWB51_App_Workbench.html) for those who wish to **refactor** their code. The Workbench helps you rebuild or redesign application architecture while preserving their scope and specifications. Once you have built your new application, it can be easily deployed on the HPE Ezmeral Container Platform and leverage the HPE Ezmeral Data Fabric.

Finally, for those who prefer to **Replace** their application, HPE Ezmeral software is tested with a large partner ecosystem. Our partners offer modern applications through the [HPE Ezmeral Marketplace](https://www.hpe.com/us/en/software/marketplace.html) that can be used to replace legacy applications.  

## What is HPE Ezmeral Application Workbench?

HPE Ezmeral Application Workbench is a free, stand-alone, Python-based software development kit (SDK) that allows for the quick development of applications for Kubernetes, AI/ML, and other use cases, either from scratch or from existing container images. The HPE Ezmeral Application Workbench takes advantage of KubeDirector, an open-source project from HPE, which acts as a custom controller that allows you to easily bring your app into a standard K8s cluster. Kubedirector makes it easy to run complex stateful scale-out application clusters on Kubernetes.

![](/img/2-gunna.png)

HPE Ezmeral Application Workbench features a simple to use, workflow-based, web-based graphical user interface (WebUI) to help you build modern applications visually. Use it to update legacy source code to build a new, custom docker image, and convert your legacy application into a microservice-based, modern app. After installing the App Workbench on your workstation, you can [build your application](https://docs.containerplatform.hpe.com/53/app-workbench-5-1/getting-started/AWB51_Overview.html) using just a few simple steps.

Key features of the HPE Ezmeral Application Workbench include:

- KubeDirector Application support
- Public and private Docker registry support
- Source-to-Image capabilities, allowing users to transform monolithic application source code to executable Docker images
- A feature rich application development workspace, including the ability to:
 - Edit Dockerfiles, HTML, JSON, Markdown, Python, SH, XML, YAML files in one place.
 - Organize configuration scripts and application specific startup scripts in one place.
 - Output a fully formatted JSON or YAML file to apply to your K8s cluster with [KubeDirector operator](https://kubedirector.io/) installed.

The HPE Ezmeral Application Workbench allows you to point to a repository, bring in a Docker image, modify config scripts, and create your own startup script. With the help of the Workspace editor in the App Workbench tool set, users can create Dockerfiles by splitting the monolithic application components into a microservice or distributed model. This feature also helps in containerization refactoring where monolithic apps are moved into containers with minimal modifications, enabling users to incorporate cloud-native features and improve portability. Once you’re done, all you need to do is to use a standard kubectl command: **kubectl apply –f <yourapp.json/yaml>** of the JSON or YAML file that’s been outputted. The HPE Ezmeral Application Workbench delivers your app right into your HPE Ezmeral Container Platform App catalog.

## Advantages of using the HPE Ezmeral Application Workbench

The HPE Ezmeral Application Workbench offers support to build KubeDirector applications that can be deployed on a CNCF-certified K8s cluster with the KubeDirector operator add-on. KubeDirector is an open-source project that uses the Kubernetes Custom Resource Definition (CRD) framework to enable transparent integration with Kubernetes user/resource management, allowing you to deploy stateful applications on Kubernetes. It leverages native Kubernetes API extensions and acts as a scheduler and launcher of applications on top of the Kubernetes platform. 

KubeDirector empowers the application, doing a lot of stuff in the background for you. You don’t have to write “go code” or an operator for it; it will use what you have. And if you don’t have an operator, and you have a legacy application that needs statefulness and persistent directories, KubeDirector can assist. You can think of it as a custom operator. Using KubeDirector is a lot easier than using YAML, requiring less files and manual definition, and more powerful than using Helm charts, which don’t track the state of a node.

Because of KubeDirector, applications built using the HPE Ezmeral Application Workbench can be easily deployed on the HPE Ezmeral Container Platform, which allows it to leverage the HPE Ezmeral Data Fabric, for a full end-to-end Kubernetes application experience. Using the HPE Ezmeral Application Workbench accelerates time to value for all your application modernization projects, including big data, artificial intelligence / machine learning (AI/ML), developer operations (DevOps), and continuous integration / continuous deployment (CI/CD). 

## Conclusion

Legacy applications can hold you back in your digital transformation because it is software developed on outdated hardware and design principles. The success of your digital transformation depends on your ability to innovate and accelerate developer productivity at scale through newer, cloud native technologies.

Don’t let legacy applications hold you back in your digital transformation. Modernize your legacy applications in a cost-effective way, improve developer productivity, and accelerate time to value for your business with [HPE Ezmeral](https://www.hpe.com/us/en/ezmeral.html). For more information, access [HPE Ezmeral Container Platform Documentation on App Workbench](https://docs.containerplatform.hpe.com/53/app-workbench-5-1/getting-started/AWB51_App_Workbench.html).

For more articles designed to help you in your digital transformation, stay tuned to the [HPE DEV blog](https://developer.hpe.com/blog).
