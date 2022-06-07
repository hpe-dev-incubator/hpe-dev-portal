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

*[HPE GreenLake for Containers](https://www.hpe.com/us/en/greenlake/containers.html)*, one of the HPE GreenLake Cloud Services, is built upon [HPE Ezmeral Runtime Enterprise](https://www.hpe.com/us/en/software/ezmeral-runtime.html) and runs via underlying container-based opensource infrastructure Kubernetes. The HPE GreenLake Central dashboard allows performing several cluster-related operations via navigating to the *Clusters* module. This module includes operations such as cluster creation by using default and custom machine blueprints, cluster deletion, cluster scaling up, and cluster scaling down. It can navigate to the HPE Ezmeral Runtime Enterprise dashboard where an end-user can deploy various applications and fulfill the goal of reaching the containerization.

Before proceeding to the app deployment phase, an end-user may be interested to perform some primary data verifications that can be helpful in various ways, for example, sanity testing, regression testing, knowing infrastructure health, and finding on-prem issues at the early stage. As a part of the smart automated solution, the user needs to verify the data such as the cluster health, cluster status, node status, host IP, CPU, and memory allocation. This blog can guide to achieve one of the ways to implement the Automation Pipeline via using automation weapons like Katalon as an automation testing software tool, CircleCI as continuous integration and continuous delivery platform, and Grafana as an interactive visualization web application tool that uses time-series data to deploy meaningful graphs.



## How to Use the Tools?

In Katalon, Test cases can be structured using test suites with environment variables. Test execution can be parameterized and parallelized using profiles. Remote execution in Katalon Studio can be triggered by CI systems via Docker container or command-line interface. Automation job can be triggered for Cluster Creation operation, following via Cluster Deletion operation. 

Inside these operations, all required metrics and verification points can be checked. Upon trigger of the cluster creation process, the automation suite can start recording the required time for the cluster to become ready. Similar way other cluster operations related data can be collected. Katalon Studio provides HTML-based reports or console logs to view the data after execution has been done. Any test script can help to extract the required data in form of a plain text-based file like .csv. CircleCi provides functionality to export this .csv file as an artifact.

```
IDClusterCreation,DateTime,BlueprintType,ClusterCreationDuration,ClusterDeletionDuration,ClusterScaleUpDuration,ClusterScaleDownDuration
2a0810e6-0c32-451b-933b-74fbdf86358a,2022-06-15 20:00:00,demo,05,04
ce18d4e0-9af3-40da-8d43-266fe05d17ba,2022-06-15 20:10:00,large,04,05
767801bd-7f1e-4a9a-804e-b560f168d968,2022-06-15 20:20:00,xlarge,04,05
r3b185d5-c96a-49a5-b6de-13ae93c93fd4,2022-06-15 20:30:00,standard,05,04
```