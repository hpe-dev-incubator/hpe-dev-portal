---
title: "Introducing a multi-vendor CSI driver for Kubernetes"
date: 2019-08-30T17:57:28.031Z
author: Michael Mattsson 
tags: ["hpe-nimble-storage","hpe-3par-and-primera"]
path: introducing-a-multi-vendor-csi-driver-for-kubernetes
---
In true HPE storage tradition, we’re introducing an open source, multi-platform and multi-vendor container storage interface (CSI) driver for Kubernetes. In essence, it's meant to support multiple block and file backends from the HPE portfolio. We encourage others to implement our specification (more on this below) to take advantage of the driver architecture for any file and block backend, including those not from HPE. In the same way our FlexVolume driver (dory) and Dynamic Provisioner (doryd) provided an abstraction for any vendor’s Docker Volume plugin to Kubernetes, we are bringing a similar concept to life with the HPE CSI Driver for Kubernetes. In this blog post, I’ll walk you through the architecture, specification and deployment model. But first, let’s go through the basics of what CSI is.


# Container Storage Interface
CSI is a specification that allows container orchestration systems to implement a standardized interface to interact with storage. Kubernetes happens to be one container orchestration implementation that supports CSI. The CSI specification has evolved at a rapid pace since its inception nearly two years ago, steadily adding new features and capabilities. The Kubernetes community declared CSI stable and made it Generally Available (GA) in Kubernetes 1.13 which was released earlier this year. CSI improves the quality of life for both Dev and Ops staff. The developer gets a very consistent interface that allows him to consume storage resources. The Ops person benefits from a very consistent deployment model, as CSI drivers and relevant sidecar containers are simply Kubernetes workloads.


![HPE CSI Driver for Kubernetes with HPE Nimble Storage CSP](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/slides-csi-hpedev-market-1566866211263.png)


The Kubernetes implementation of CSI acts like an extension. This means the specification can evolve outside of [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) and be integrated selectively by downstream Kubernetes vendors. There’s an ongoing project to migrate all relevant Kubernetes in-tree storage drivers to CSI, so all Kubernetes users need to be familiar with CSI to leverage persistent storage in Kubernetes moving forward. The extensibility of CSI leans on a concept where you declare Customer Resource Definitions (CRD) to extend the functionality of Kubernetes. Further, vendors may write their own CRDs to abstract vendor-specific capabilities for end-users. At HPE, we are providing one such example in our deployment where you can easily extract node information that is relevant from a storage mapping perspective.


There are many advantages to using CSI over the previous interfaces that were available for storage vendors. At HPE, we used the parameter “overload” concept, as well as extensive PVC annotation, to abstract platform functionality for end-users. With CSI, many data management capabilities become API objects in Kubernetes. As an example, an underlying storage system snapshot becomes a snapshot API object.


The table below gives you an idea of where we’ve been and where we’re going with CSI.


![CSI spec 1.1.0 capabilities implemented by the HPE CSI Driver for Kubernetes](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/slides-csi-hpedev-feat-1566866257740.png)


# Container Storage Provider
The new HPE CSI Driver architecture introduces a sidecar deployment we call a Container Storage Provider (CSP). The CSP is unique per storage platform and responds to a minimal set of APIs that interfaces with the storage platform. The HPE CSI Driver does all the heavy lifting on the nodes themselves that is common across storage platforms, such as attach/detach a block device or mount a remote filesystem. The key here is that introducing a new storage platform to Kubernetes using the new HPE CSI Driver will now be quite trivial, as you only need to respond at the API endpoint and don’t need any knowledge of CSI or Kubernetes. The CSP can be written in any language capable of providing a RESTful API on a network port. Some vendors may choose to keep the CSP proprietary to protect their IP as it’s just a microservice and part of a larger system that happens to be open source. Also, running the CSP on Kubernetes is not a requirement either, as it could be an external service as part of an appliance or delivered as SaaS.


![Communication diagram for the HPE CSI Driver for Kubernetes](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/slides-csi-hpedev-1567184427188.png)


In the communication diagram above, you can see what component talks to which endpoint and the distinct boundaries of responsibilities. Innovation will happen at the HPE CSI Driver layer and CSPs will then be able to introduce the newly supported endpoints. For example, a future CSI spec will introduce replica API objects. The HPE CSI Driver takes care of all the minutia the CSI CRDs needs. When the new CSP API spec is ready, storage platform teams may implement the new API endpoint in their CSP and be confident that the CSI-specific work and potential host connectivity is already taken care of.


The HPE CSI Driver determines which spec of CSI the running version of Kubernetes supports. The CSP requires no modification or gated behavior based on which CSI spec is enforced on the Kubernetes cluster. This means that there’s a fairly large blast radius in terms of diversity in the Kubernetes environments a CSP can support.


# HPE Nimble Storage public beta
Our initial beta driver includes a CSP for HPE Nimble Storage with other HPE platforms and services being developed as we speak. The CSP has been in the works for quite a while and we expect full feature parity with our legacy FlexVolume plugin at its launch with a few additional features as we’ve evolved these two implementations in tandem. The HPE CSI Driver currently supports the current CSI v1.1.0 feature set which the CSP implements: Dynamic Provisioning (with a comprehensive set of parameters), Raw Block Volume, Volume Snapshots, Volume Expansion and Volume Cloning and Inline Ephemeral Volumes.


We’ve also taken the opportunity to modernize the deployment of the entire solution with a [Helm](https://helm.sh) chart. Helm is used to package software that runs on Kubernetes to give users a consistent way of running their workloads. Since the HPE Nimble Storage CSP runs on Kubernetes, this is the most practical way to deploy it.


Some of the features are easier to show than describe, so let us introduce the HPE CSI Driver for Kubernetes [in this interview with the architect](https://www.youtube.com/watch?v=TK5H4o3Tg_s), followed by a demo.


[![Introducing the multi-platform and multi-vendor HPE CSI Driver (beta) for Kubernetes](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/hpecsi-beta-thumb-1566865524360.png)](https://www.youtube.com/watch?v=TK5H4o3Tg_s)


__Note:__ All the examples used in the demo can be found [here](https://github.com/NimbleStorage/container-examples/tree/master/misc/CSI-beta/K8s-1.15).


As you can see, it’s quite easy to set up and use (you need a HPE Nimble Storage array to actually provision resources). We support a plethora of different use cases besides the few things we squeezed into the demo. Please see the comprehensive list of [StorageClass parameters](https://github.com/hpe-storage/csi-driver/blob/master/examples/kubernetes/hpe-nimble-storage/README.md) on GitHub.


# Future
We expect to hit GA later in the fall. More platforms, protocols, and services should follow shortly. We also expect a few example open source CSPs to surface that will be able to use the HPE CSI Driver from developers who may not own any HPE product. Since everything needed to build a CSP for any storage platform is available in the spec, we might see any number of non-HPE CSP implementations. 


The team has been hard at work bringing all this functionality together in this beta. We can’t be more excited to share it with the community! Stay tuned to [hpedev.io](https://hpedev.io) for news and updates as we bring more platforms and features into the fold.


## Resources
These are the various resources available around the HPE CSI Driver for Kubernetes
* HPE CSI Driver for Kubernetes on [GitHub](https://github.com/hpe-storage/csi-driver)
* HPE Nimble Storage CSP [StorageClass parameters](https://github.com/hpe-storage/csi-driver/blob/master/examples/kubernetes/hpe-nimble-storage/README.md)
* Container Storage Interface [specification](https://github.com/container-storage-interface/spec)
* Container Storage Provider [specification](https://github.com/hpe-storage/container-storage-provider)
* Container Storage Provider [Swagger documentation](https://developer.hpe.com/api/hpe-nimble-csp)
* Join us on the [HPE DEV slack](https://hpedev.slack.com/)! We're hanging out in #Kubernetes and #NimbleStorage
* [HPE CSI Driver for Kubernetes and Red Hat OpenShift in beta](https://community.hpe.com/t5/HPE-Storage-Tech-Insiders/HPE-CSI-Driver-for-Kubernetes-and-Red-Hat-OpenShift-in-beta/ba-p/7059941)