---
title: '"The Challenges of Sharing GPUs and How to Solve Them"'
date: 2021-02-03T15:54:07.736Z
featuredBlog: false
priority: ""
author: Raz Haleva
authorimage: /img/blogs/Avatar1.svg
thumbnailimage: https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/pinkish-image-4-run-ai-post-1612367610553.JPG
tags:
  - hpe-ezmeral-container-platform
  - run:ai
  - GPU
  - AI
  - ML
---
![pinkish image 4 run ai post](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/pinkish-image-4-run-ai-post-1612367610553.JPG)

Whether purchasing GPUs for on-premise machines or renting them in the cloud, GPUs for AI can be expensive. Organizations want to get the most out of their on-premise GPUs and use GPUs in the cloud as efficiently as possible. The HPE Ezmeral team and [Run:AI](http://www.run.ai/) recently worked together in a number of customer engagements to help researchers take better advantage of their GPU resources. This post offers some of our takeaways and includes resources that can help you get started in doing the same. 

Though many [articles](https://www.zdnet.com/article/facebooks-latest-giant-language-ai-hits-computing-wall-at-500-nvidia-gpus/) cite examples of the [insatiable demand](https://syncedreview.com/2018/05/17/ai-doubling-its-compute-every-3-5-months/) for compute resources, in practice, GPUs are often underutilized. When Run:AI starts work with a new customer, we typically see a GPU utilization rate of between 25 and 30 percent. IT is typically surprised by this – they assume that resources are being fully utilized. But, if you think about it, it’s actually quite logical:
* GPUs tend to be idle during non-work hours (e.g. nights, weekends).
* They can also be idle during work breaks (e.g. coffee breaks, lunch).
* They can be idle when a researcher is building a model (e.g. developing a model in a Jupyter notebook).
>Note: A Jupyter Notebook is a classic example. A user working with a Jupyter Notebook usually alternates between writing code, executing it on the GPU, and examining the results. The GPU is kept idle for long periods of time during this process.
* They can even be idle during the execution of a GPU-consuming application, e.g. training workloads. This is because the application has some work to do on the CPU as well and wait for I/O.
>Note: Most applications have CPU and I/O work in between launching GPU kernels. The GPU utilization of a deep-learning model running solely on a GPU can be much less than 100%.

Increasing GPU utilization and minimizing idle times can drastically reduce costs and help achieve model accuracy faster. To do this, one needs to improve the sharing of GPU resources. 

### Sharing a GPU is complex
Applications running on the same GPU share its memory. Every byte allocated by one application leaves one less byte for other applications to use. The only way for multiple applications to run simultaneously is to cooperate with one another. Otherwise, applications can easily, and even mistakenly, impact each other.

In addition, many applications arrogantly assume they are the only ones running on that GPU, and allocate the entire GPU memory upfront by default (e.g. TensorFlow). This is a common paradigm when using an external processing unit (in addition to the CPU). Code modifications are required to change this default behavior (e.g. allow growth in TensorFlow) and might impact the application performance (i.e. due to fragmentation). This might be even impossible in some cases; for example, when executing sealed Docker images without access to the source code they contain.

When running multiple containers on the same GPU, cooperation is much less a legitimate requirement, as containers should not be aware of each other, and certainly should not be accessible to one another.

When multiple users are supposed to share a GPU, they require coordination between one another, making this a logistical issue as well and not only technical.

All the above makes sharing a GPU between applications, and containers in particular, inconvenient and not scalable or dynamic.

### What do we mean by “dynamic”?
Ideally, sharing a GPU would work like this; for me to have the resources I need, when I need them, and for you to have what you need, when you need them. That would require dynamic allocation of resources. 

Sharing the same GPU between multiple applications and containers has two requirements.

1. The first requirement is to be able to modify the application to use only a portion of the GPU memory (i.e. code changes and manual tweaks). This might seem easy but not every user can do so, as it might require deep knowledge with the internals of the application and how to configure it. Sometimes it might not even be possible - as explained above, an example of this would be when receiving a docker image without controlling what application is running inside and with which configuration.

2. The second requirement is to decide how much GPU memory should be used by each and every application. This might be relatively easy for a single user to do as there is only a single person who needs to decide. A team might also be able to do so, but in a very inefficient way.

In instances where a team is involved, the team can decide on a strict policy in which each member gets an equal, static share of the GPU. For example, in a team of three members, each one would be given exactly one third of the GPU memory.

This might sound satisfactory but the truth is that the GPU would be underutilized, based on the scenarios we outlined above. If, at any time, one of the team members did not use his or her share of the GPU memory, it would still be left unused. Additionally, the team members would never be able to use more than their share without breaking their agreement and risking applications of other members with Out Of Memory failures.

This unused GPU memory could have been allocated by another team member, allowing him or her to run more GPU-consuming applications (e.g. larger deep learning models).

### The answer: Share GPUs by enabling access to fractions of GPUs

A fractional GPU system, such as one built by Run:AI, transparently gives data science and AI engineering teams the ability to run multiple workloads simultaneously on a single GPU. Virtualized logical GPUs have their own memory and computing space that containers can use and access as if they were self-contained processors. This enables several deep learning workloads to run in containers side-by-side on the same GPU without interfering with each other. 




![gpu orchestration dashboard](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/gpu-orchestration-dashboard-1612369520951.png)

Fractional GPU capabilities enable simplified sharing of single and multiple GPUs. In the figure above, you can see that more than 70% of the 160 pooled GPUs are fully utilized. Researchers have maximized cluster utilization, and can see that there are still idle GPUs available to any researchers who need them. This is one way [HPE Ezmeral Container Platform and Run:AI](https://www.hpe.com/us/en/software/marketplace/runai.html) are able to help customers bring AI solutions to market faster. By maximizing the utilization of their GPU clusters, customers can build and train concurrent AI models without resource limitations. We’ve [shared some resources here](https://docs.run.ai/Researcher/Walkthroughs/walkthrough-fractions/) to help you get started with these concepts.

![run ai gpu orchestration architecture 2](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/run-ai-gpu-orchestration-architecture-2-1612435001011.jpg)

As shown in the picture above, Run:AI GPU orchestration solution creates a virtualization and acceleration layer over GPU resources that manage granular scheduling, prioritization, and allocation of compute power for the HPE Ezmeral Container Platform. Run:AI provides a dedicated batch scheduler, running on top of HPE Ezmeral Container Platform to manage GPU-based workloads. Find out more about the Run:AI GPU orchestration solution running on top of HPE Ezmeral Container Platform, including how you can get a free trial of the solution, by visiting the [HPE Ezmeral Marketplace] (https://www.hpe.com/us/en/software/marketplace/runai.html).

Keep coming back to the [HPE DEV blog](/blog) site for more interesting articles and tutorials on related topics.
