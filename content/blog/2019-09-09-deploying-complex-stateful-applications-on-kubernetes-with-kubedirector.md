---
title: Deploying Complex Stateful Applications on Kubernetes with KubeDirector
date: 2019-09-09T17:36:33.319Z
author: Tom Phelan & Joel Baxter 
tags: ["bluedata"]
path: deploying-complex-stateful-applications-on-kubernetes-with-kubedirector
---
Kubernetes is clearly the container orchestrator of choice for cloud-native stateless applications. And with StatefulSets and Persistent Volumes, it’s now possible to run stateful applications on Kubernetes. Tools like Kustomize, Helm, and Kubeflow help tackle some of the deployment complexity for stateful applications. However, running complex stateful applications for distributed AI, machine learning, and big data analytics on Kubernetes remains beyond the reach of most users.

Enter KubeDirector. KubeDirector is an open source Apache project that uses the standard Kubernetes custom resource functionality and API extensions to deploy and manage complex stateful scale-out application clusters. With KubeDirector, you can run complex stateful clusters for AI, machine learning, and big data analytics on Kubernetes without writing a single line of Go code.

This webinar will provide an overview of the KubeDirector architecture, show how to author the metadata and artifacts required for an example stateful application (e.g. with Spark, Jupyter, and Cassandra), and demonstrate the deployment and management of the cluster on Kubernetes using KubeDirector.