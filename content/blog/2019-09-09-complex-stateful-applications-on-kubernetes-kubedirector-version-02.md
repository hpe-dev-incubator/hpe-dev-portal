---
title: "Complex Stateful Applications on Kubernetes: KubeDirector version 0.2"
date: 2019-09-09T17:26:49.571Z
author: Tom Phelan 
tags: ["hpe-ezmeral-container-platform","hpe-container-platform","bluedata","container","opensource"]
path: complex-stateful-applications-on-kubernetes-kubedirector-version-02
---
Last summer, [I wrote here about our BlueK8s initiative and a new open source project](https://www.bluedata.com/blog/2018/07/operation-stateful-bluek8s-and-kubernetes-director/) for deploying and managing complex stateful scale-out applications on Kubernetes: __KubeDirector.__ KubeDirector enables data scientists familiar with data-intensive distributed applications such as Hadoop, Spark, Cassandra, TensorFlow, Caffe2, etc. to easily run these applications on Kubernetes.

In [my blog post on the Kubernetes site in the fall](https://kubernetes.io/blog/2018/10/03/kubedirector-the-easy-way-to-run-complex-stateful-applications-on-kubernetes/), I introduced version 0.1 of KubeDirector and described how it works. Since then, we’ve seen a lot of interest in KubeDirector from the community we’re very excited about the progress so far. The BlueData team behind this effort is [now part of HPE](https://www.bluedata.com/blog/2018/11/hpe-and-bluedata-joining-forces-in-ai-ml-big-data/), and the KubeDirector project continues to move full steam ahead.

![1*mbaqzb3tkv_zx36nxxdgbw](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/1mbaqzb3tkv_zx36nxxdgbw-1568050291276.jpeg)

To that end, we just pushed out the next release and our first public update of KubeDirector: version 0.2. You can check out the full details on our github site [here:](https://github.com/bluek8s/kubedirector/releases/tag/v0.2.0) https://github.com/bluek8s/kubedirector/releases/tag/v0.2.0

Some of the highlights of what’s new in version 0.2 of KubeDirector include:

* A fully deployable Cloudera 5.14.2 image is now available in the catalog of example applications
* Cluster launch performance has been enhanced through additional work on launch parallelization
* The “configcli” tool used in application setup is now included in the “nodeprep” directory.
* We’ve made additional improvements to the Makefile support and functionality:
    * KubeDirector can now be built and deployed on Ubuntu systems
    * “make deploy” now waits for deployment to succeed before returning
    * “make teardown” now waits for teardown to finish before returning.
* KubeDirector actions are now recorded as Kubernetes events and can be viewed by the standard “kubectl describe” command
* KubeDirector has been tested on the following Kubernetes platforms:
    * DigitalOcean Kubernetes (DOK)
    * Google Kubernetes Engine (GKE)
    * Amazon Elastic Container Service for Kubernetes (EKS)
    * Kubernetes version 1.13.2 on CentOS kernels

See below for a screenshot of KubeDirector v0.2 running four pods of a Spark cluster:

![1*6syu8q9lacfchtp9 ctdca](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/16syu8q9lacfchtp9-ctdca-1568050296650.png)

One of those pods is a Jupyter notebook, as shown below:

![1*bazfzfp7zyqvpvtww ekbw](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/1bazfzfp7zyqvpvtww-ekbw-1568050305473.png)

__Join the Community__

We’re working towards the next version of KubeDirector (and the broader BlueK8s initiative) and we’d welcome your help as developers, contributors, and adopters. Follow [@BlueK8s](https://twitter.com/BlueK8s/) on Twitter and get involved through these channels:

* KubeDirector [chat room on Slack](https://bluek8s.slack.com/join/shared_invite/enQtNTQzNDQzNjQwMDMyLTdjYjE0ZTg0OGJhZWUxMzhkZTZjNDg5ODIyNzZmNzZiYTk4ZjQxNDFjYzk4OWM0MjFlNmVkNWNlNmFjNzkzNjQ)
* KubeDirector [GitHub repo](https://github.com/bluek8s/kubedirector/)