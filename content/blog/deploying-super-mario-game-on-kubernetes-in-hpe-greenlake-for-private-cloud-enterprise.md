---
title: Deploying Super Mario game on Kubernetes in HPE GreenLake for Private
  Cloud Enterprise
date: 2024-02-20T14:54:51.767Z
author: Guoping Jia
authorimage: /img/guoping.png
disable: false
tags:
  - HPE GreenLake for Private Cloud Enterprise
  - Load balancer
  - SSL/TLS certificates
  - Ingress
  - Ingress controller
  - Super Mario
  - Tetris
---
T﻿his blog post shows you the detailed process to deploy Super Mario game to the Kubernetes in HPE GreenLake for Private Cloud Enterprise

### Prerequisites

Before starting, make sure you have the following:

* A K8s cluster, being provisioned in HPE GreenLake for Private Cloud Enterprise
* The kubectl CLI tool, together with the kubeconfig file for accessing the K8s cluster
* The o﻿ptional openssl CLI tool, for validating the generated certificates 