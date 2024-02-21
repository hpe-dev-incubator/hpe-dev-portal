---
title: Exposing an application using Ingress and TLS termination on Kubernetes
  in HPE GreenLake for Private Cloud Enterprise
date: 2024-02-21T09:22:08.283Z
author: Guoping Jia
authorimage: /img/guoping.png
disable: false
tags:
  - HPE GreenLake for Private Cloud Enterprise
  - Kubernetes
  - Ingress
  - Ingress Controller
  - TLS Termination
---
This blog post describes the process to expose an application that's deployed and runs on Kubernetes in HPE GreenLake for Private Cloud Enterprise to the external world. 
A Nginx app that serves as a Web server that prints out a customized application name will be used as a sample app to expose. The application itself will be deployed as 
the service type of ClusterIP, runnin on HTTP. Using cert-manager and TLS termination on configured MetalLB load balancer, the application will be exposed over HTTPS. 



## Overview