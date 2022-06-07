---
title: How to Set up Automation Pipeline to Measure the Cluster Performance on
  HPE GreenLake for Containers
date: 2022-06-08T06:09:47.137Z
featuredBlog: false
priority: 1
author: Sweta Katkoria
authorimage: /img/swetakatkoria_photo.jpg
thumbnailimage: /img/thumbnail.jpeg
tags:
  - hpe-greenlake
  - Automation
  - Grafana
---
## Introduction

*[HPE GreenLake for Containers](https://www.hpe.com/us/en/greenlake/containers.html)*, one of the HPE GreenLake Cloud Services, is built upon [HPE Ezmeral Runtime Enterprise](https://www.hpe.com/us/en/software/ezmeral-runtime.html) and runs via underlying container-based opensource infrastructure Kubernetes. The HPE GreenLake Central dashboard allows performing several cluster-related operations via navigating to the Clusters module. This module includes operations such as cluster creation by using default and custom machine blueprints, cluster deletion, cluster scaling up, and cluster scaling down. It can navigate to the HPE Ezmeral Runtime Enterprise dashboard where an end-user can deploy various applications and fulfill the goal of reaching the containerization.

Before proceeding to the app deployment phase, an end-user may be interested to perform some primary data verifications that can be helpful in various ways, for example, sanity testing, regression testing, knowing infrastructure health, and finding configuration issues. As a part of the smart solution, the user needs to verify the data such as the cluster health, cluster status, node status, host IP, CPU, and memory allocation. This blog can guide to achieve one of the ways to implement the Automation Pipeline via using automation weapons like Katalon as an automation testing software tool, CircleCI as continuous integration and continuous delivery platform, and Grafana as analytics and interactive visualization web application tool.