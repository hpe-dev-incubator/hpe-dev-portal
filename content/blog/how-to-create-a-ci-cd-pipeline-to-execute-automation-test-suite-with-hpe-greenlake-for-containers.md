---
title: How to Create a CI/CD Pipeline to Execute Automation Test Suite with HPE
  GreenLake for Containers
date: 2022-06-08T06:09:47.137Z
featuredBlog: true
priority: 1
author: Sweta Katkoria
authorimage: /img/swetakatkoria_photo.jpg
thumbnailimage: /img/thumbnail.jpeg
tags:
  - hpe-greenlake
  - CI/CD-pipeline
  - Automation
  - DevOps
---
## Introduction

*[HPE GreenLake for Containers](https://www.hpe.com/us/en/greenlake/containers.html)*, one of the HPE GreenLake Cloud Services, is built upon [HPE Ezmeral Runtime Enterprise](https://www.hpe.com/us/en/software/ezmeral-runtime.html) and runs via underlying container-based infrastructure Kubernetes. The HPE GreenLake Central dashboard allows you to perform several cluster-related operations via navigating to the Clusters module. Such operations include cluster creation by using default as well as custom machine blueprints, cluster deletion, cluster scaling up, and cluster scaling down operations. The cluster details screen can show the cluster health status, nodes status, and other cluster details. A similar page can navigate to the HPE Ezmeral Runtime Enterprise dashboard where an end-user can deploy various applications and can fulfill the goal of reaching containerization.

Any end-user needs to verify the cluster health, cluster status, node status, host IP, CPU and memory allocation, etc. before proceeding to the app deployment phase. In the era of faster product iterations, automated solutions such as CI/CD pipeline creation can be considered an essential solutions. This blog can guide to achieve one of the ways to implement the CI/CD pipeline via using Katalon as an automation testing software tool, CircleCI as continuous integration and continuous delivery platform that can be used to implement DevOps practices, Grafana is multi-platform open-source analytics and interactive visualization web application tool.

Kubernetes applications are running inside the cluster nodes serving as a private network. Access to the private network from the public network is restricted. So, to make communication among these two networks, we can use a certain API that can be called from the private network. In our example, CircleCI is deployed inside the public network while Grafana is a part of the private network. CircleCI provides an  [API token](https://circleci.com/docs/2.0/managing-api-tokens/) via which such network communication can happen.



![Configure API Token in Circle CI](/img/api-key-for-circle-ci.jpg "Configure API Token in Circle CI")