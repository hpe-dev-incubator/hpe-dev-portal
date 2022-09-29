---
title: Set up Apache SkyWalking for K8s and VM monitoring in HPE GreenLake
  Private Cloud
date: 2022-09-29T07:26:49.087Z
author: Guoping Jia and Thirukkannan M
authorimage: /img/Avatar1.svg
tags:
  - hpe-greenlake, kubernetes, virtual machine, monitoring
---
## Introduction

Available on the HPE GreenLake Central platform, [HPE GreenLake for Private Cloud Enterprise](https://www.hpe.com/us/en/greenlake/private-cloud-enterprise.html), one of the HPE GreenLake cloud services available on the HPE GreenLake Central platform, allows customers to open the Clusters screen to create a cluster, view details about existing clusters, and launch the HPE GreenLake for Container service console. It provides an enterprise-grade container management service using open source Kubernetes. 

This blog post describes the process of deploying a stateful MongoDB application on the created Kubernetes clusters in HPE GreenLake for Containers. Using the Kubernetes StatefulSet and Headless Service, together with the pre-provisioned persistent volumes, the MongoDB application can be deployed as a Replica Set that provides redundancy, fault tolerance and high availability. This MongoDB application deployment can be used for working with a large amount of data and a high number of workloads in customer production environments.

## Apache SkyWalking

[Apache SkyWalking](https://www.mongodb.com/) is an open source application performance monitor (APM) system, especially designed for microservices, cloud native, and container-based architectures.