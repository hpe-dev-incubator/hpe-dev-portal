---
title: "Running Non-Cloud-Native Apps on Kubernetes with KubeDirector"
date: 2019-11-18T17:16:18.520Z
author: Tom Phelan 
tags: ["hpe-ezmeral-container-platform","hpe-container-platform","bluedata","container","opensource"]
path: running-non-cloud-native-apps-on-kubernetes-with-kubedirector
---
This week at [KubeCon North America,](https://events19.linuxfoundation.org/events/kubecon-cloudnativecon-north-america-2019/) Hewlett Packard Enterprise (HPE) unveiled the new [HPE Container Platform.](https://www.hpe.com/us/en/newsroom/press-release/2019/11/Hewlett-Packard-Enterprise-introduces-Kubernetes-based-platform-for-bare-metal-and-edge-to-cloud-deployments.html) It’s the industry’s first Kubernetes-based software platform designed to run both cloud-native and non-cloud-native applications in containers, enabling true hybrid cloud operations across any location: on-premises, public clouds, and the edge.  

It’s widely acknowledged that open source Kubernetes is the de facto standard for the orchestration of containerized cloud-native applications. However, it’s another thing entirely to use Kubernetes to orchestrate the containerized deployment and management of non-cloud-native monolithic applications as well. How can HPE make such a bold claim? 

Let’s take a peek under the hood at one of the technical innovations in the HPE Container Platform that permits HPE to back up such an aggressive claim. 
By way of background, I’m one of the co-founders of BlueData, a software company that HPE acquired just about a year ago. The HPE Container Platform represents the next major release of BlueData’s container-based software platform, combined with integrated persistent container storage from MapR (also recently acquired by HPE), and open source Kubernetes for container orchestration.  

Prior to the acquisition, the BlueData team initiated an Apache open source project called KubeDirector. The initiative was focused on running non-cloud-native, stateful applications on Kubernetes. You can refer to my earlier blog post [here,](https://kubernetes.io/blog/2018/10/03/kubedirector-the-easy-way-to-run-complex-stateful-applications-on-kubernetes/) where I described the KubeDirector project. Now, with the HPE Container Platform, KubeDirector has come into its own as a key component of the platform -- delivering on its objective to deploy and manage non-cloud-native applications on Kubernetes.

## KubeDirector and Non-Cloud-Native Applications

Non-cloud-native, monolithic applications (e.g. stateful applications with persistent storage) have a number of specific requirements. For example, they typically require fixed network configuration (i.e. static IP addresses). Kubernetes provides a construct, known as [StatefulSets,](https://developer.hpe.com/blog/kubedirector-the-easy-way-to-run-complex-stateful-applications-on-kubern) which permits an application to be deployed with stable, unique network identifiers. This means that the IP address of a container will be preserved across pod rescheduling.  

However, another attribute of non-cloud-native applications is that they may store data in /etc or other directories typically located on the root (“/”) file system of the container. When Kubernetes restarts a crashed container, the storage associated with the original instance of the container is lost. This means that any data stored by the stateful application in the /etc directory will be lost. 

Kubernetes uses the [PersistentVolume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) construct to overcome this default behavior and allow the container to store data in a unit of storage that persists beyond the lifespan of a single container. But PersistentVolumes cannot easily be used for the root or “/” file system of a container. Any data written to the root file system will be lost when the container exits. 

By clever use of the Kubernetes [Init Container](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/) concept, KubeDirector overcomes this limitation and allows the root file system of a container to persist beyond the life span of the container. In fact, KubeDirector permits the user to specify which of the directories typically located on the root file system (/etc, /bin, etc) need to be preserved. This means stateful applications that write data to their root file systems can now successfully run on Kubernetes.

Another common attribute of non-cloud-native, stateful applications is that they require careful management to survive node loss, software upgrade, and application cluster expansion and contraction. Common Kubernetes application deployment tools such Helm or KubeFlow are “client side” only mechanisms. This means that once they are used to deploy the application, they are out of the picture. There is no “server side” component to help the application respond to events such as node (container) loss, software upgrade, or application cluster expansion. In order to support these sorts of operations, an application-specific [Operator](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/) needs to be written. But writing an application Operator is not an easy task – it requires deep application domain knowledge as well as familiarity with the Kubernetes custom resource APIs. 

KubeDirector is an application deployment tool as well as a Kubernetes Operator, and it is application-neutral. In other words, the KubeDirector Operator can be used for multiple applications: it can deploy and manage any application using Kubernetes without additional code being written. The term KubeDirectorApp identifies a given application type managed by KubeDirector. A simple YAML file is used to describe the attributes of a given KubeDirectorApp. This YAML file is given to the KubeDirector Operator, which can then deploy the application and manage the application cluster-specific expansion, contraction, upgrade, node loss, and other operations. 

The use of the single KubeDirector operator to manage multiple KubeDirectorApps also removes the complex “Day 2” operations required to add a new Operator to a running Kubernetes cluster. No need to grant escalated privileges in order to add a new Operator to support a new application. Just write the YAML file describing the new application and KubeDirector does the rest.

In short, with KubeDirector, a lot less effort is required to add support for a new application to Kubernetes:

* No need to create or modify an application-specific Operator
* No need to rely on or certify an Operator from elsewhere
* No need to register a new Custom Resource Definition and/or update user/group ACLs
* No need to (possibly dramatically) change clients to deal with new schemas
* No need for complexity with an easy mechanism for configuring per user per KubeDirectorApp permissions

The new HPE Container Platform will be generally available early next year, so stay tuned for more. Many innovative aspects of the HPE Container Platform ease the deployment and management of containerized applications for environments requiring enterprise-grade security, performance, and scalability – running on bare-metal or virtualized infrastructure, from edge to core to cloud. And one thing is for sure: with KubeDirector under the hood, HPE is delivering on its claim to run non-cloud-native, stateful applications on Kubernetes.

If you’re at [KubeCon + CloudNativeCon](https://events19.linuxfoundation.org/events/kubecon-cloudnativecon-north-america-2019/) this week, you can join my presentation on Thursday afternoon with my colleague Joel Baxter to learn more: [KubeDirector - Deploying Complex Stateful Applications on Kubernetes.](https://kccncna19.sched.com/event/UaaF/kubedirector-deploying-complex-stateful-applications-on-kubernetes-joel-baxter-thomas-phelan-hewlett-packard-enterprise) You can also stop by the HPE booth (P28) at KubeCon to meet us and ask any questions, and check out the KubeDirector GitHub repo [here.](https://github.com/bluek8s/kubedirector/)
