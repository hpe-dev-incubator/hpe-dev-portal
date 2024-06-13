---
title: Setting up hierarchical namespaces in Kubernetes in HPE GreenLake for
  Private Cloud Enterprise
date: 2024-06-13T08:18:47.600Z
author: Guoping Jia
authorimage: /img/guoping.png
disable: false
tags:
  - HPE GreenLake for Private Cloud Enterprise
  - Kubernetes
  - Namespaces
---
<style> li { font-size: 27px; line-height: 33px; max-width: none; } </style>

This blog post shows the process to set up the hierarchical namespaces in Kubernetes (K8s) in HPE GreenLake for Private Cloud Enterprise. It demonstrates how easy to manage namespace relationships, propagate configurations and resources, and enforce access control policies using the hierarchical namespace in K8s for the cluster administrators. 


### Overview

[HPE GreenLake for Private Cloud Enterprise: Containers](https://www.hpe.com/us/en/greenlake/containers.html), one of the HPE GreenLake cloud services available on the HPE GreenLake for Private Cloud Enterprise, allows customers to create a K8s cluster and deploy containerized applications to the cluster. It provides an enterprise-grade container management service using open source K8s.  

### Prerequisites

Before starting, make sure you have the following:

* A K8s cluster, being provisioned in HPE GreenLake for Private Cloud Enterprise
* The *kubectl* CLI tool, together with the kubeconfig file for accessing the K8s cluster
* The *helm* CLI tool, version 3.12.0 or later
* A domain and a list of subdomains to generate the SSL certificate and host the game applications in the cluster
* The optional *openssl* CLI tool, for validating the generated certificates
* The [Python 3.8 or higher](https://www.python.org/downloads/), and *pip* that’s included by default in Python

### K8s namespaces