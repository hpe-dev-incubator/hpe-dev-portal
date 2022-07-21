---
title: KubeDirector
version: "1.0"
description: KubeDirector is an open source Kubernetes custom controller that
  simplifies implementing stateful scaleout application clusters on Kubernetes.
image: /img/platforms/kubedirector-logo.png
width: large
priority: 5
active: false
tags:
  - kubedirector
---
KubeDirector is an open source Kubernetes “custom controller” that simplifies implementing stateful scaleout application clusters on Kubernetes. Using standard Kubernetes (K8s) facilities to implement stateful scale out application clusters, it enables the transparent integration of K8s user/resource management and existing K8s clients and tools.


KubeDirector does not tie a custom resource definition to a particular type of application, or contain hardcoded application-specific logic within the controller. Application characteristics are instead defined by metadata and an associated package of configuration artifacts, simplifying application deployment. 

KubeDirector provides:


* **One operator for stateful apps**, enabling the deployment of legacy, stateful enterprise applications without writing or implementing application-specific operators   

* **An abstract framework**, allowing the definition of application characteristics through metadata and configuration artifacts   

* **Continuous validation of resources**, automating app deployment and validation   
   

* **Hooks for “Day two” operations**, simplifying lifecycle management
   


## Introduction to KubeDirector 

[Project web site](https://kubedirector.io/)

[KubeDirector Wiki](https://github.com/bluek8s/kubedirector/wiki)

--- 

## GitHub repositories 

[KubeDirector on GitHub](https://github.com/bluek8s/kubedirector): Main KubeDirector repository.   

[Learn Kubedirector on GitHub](https://hpe-container-platform-community.github.io/learn-kubedirector/docs/): Get hints on how to use

---

## Documentation and tutorials

[Quickstart Guide](https://github.com/bluek8s/kubedirector/blob/master/doc/quickstart.md)   


[Update release info](https://github.com/bluek8s/kubedirector/blob/master/HISTORY.md)   



---

## Workshops-on-Demand

Take advantage of our free, Jupyter-Notebook based Workshops-on-Demand available in the [Hack Shack](https://developer.hpe.com/hackshack/). These technical workshops provide you with an in-depth, hands-on learning experience where you can interact with and learn from the experts. Designed to fit your schedule, these workshops are available 24/7 – any time, from anywhere. KubeDirector workshops are available today.

<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
<div class="w3-container w3-center w3-margin-bottom">
  <a href="/hackshack/workshops"><button type="button" class="button">Try now!</button></a>
</div>

--- 

## Any questions on KubeDirector?

You can raise any questions and issues you might have on our [GitHub issues](https://github.com/bluek8s/kubedirector/issues) link.




