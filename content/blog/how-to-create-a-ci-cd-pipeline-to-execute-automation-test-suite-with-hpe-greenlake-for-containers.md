---
title: How to Set Up an Automation Pipeline to Achieve Observability on HPE
  GreenLake for Containers
date: 2022-06-08T06:09:47.137Z
featuredBlog: false
priority: 1
author: Sweta Katkoria
authorimage: /img/swetakatkoria_photo.jpg
thumbnailimage: ""
tags:
  - hpe-greenlake
  - Automation
  - Grafana
---
## Introduction

*[HPE GreenLake for Containers](https://www.hpe.com/us/en/greenlake/containers.html)*, one of the HPE GreenLake Cloud Services, is built upon [HPE Ezmeral Runtime Enterprise](https://www.hpe.com/us/en/software/ezmeral-runtime.html) and runs via an underlying container-based Kubernetes orchestrated infrastructure. The HPE GreenLake Central dashboard allows one to perform several cluster-related operations through the use of the *Clusters* module. This module enables operations, such as cluster creation by using default and custom machine blueprints, cluster deletion, cluster scale up, and cluster scale down. It allows one to navigate to the HPE Ezmeral Runtime where an end-user can deploy various applications and fulfill the goal of containerization. Moreover, on the page of cluster detail, some interesting insights like CPU usage, memory allocation, and storage availability can also be tracked. These are the essential metrics to track the usage of deployed applications and based on that decide the required resources resulting increase in the business!

It sounds interesting if one can get a history of such metrics to analyze application-specific metrics. As a part of one of the use cases, based on the past captured consumption usage data, a customer can decide whether he requires to scale up of nodes during some days of the year. For the rest of the days scale down of the cluster is required. For a system admin persona working on an abstract layer of application deployment,  it can be important to choose the type of blueprint based on the application usage. For example, if a graph shows high memory usage over a CPU usage then he may shift to the blueprint which provides high compute resources. This blog post will guide you through one method of implementing the Automation Pipeline which can result in beautiful graphs via the use of automation weapons like Katalon (as an automation testing software tool), CircleCI (as continuous integration and continuous delivery platform), MySQL (as a database provider) and Grafana (as an interactive visualization web application tool that uses time-series data to deploy meaningful graphs).

![Cluster detail](/img/cluster-detail.jpg "Cluster detail")



## How to Implement the Automation Pipeline?

In Katalon, test cases can be structured using test suites with environment variables. Test execution can be parameterized and parallelized using profiles. Remote execution in Katalon Studio can be triggered by CI systems via a Docker container or command-line interface. Automation jobs can be triggered at a scheduled time of duration to check various dynamic measurements on a graph for example to measure CPU usage, memory usage, storage capacity availability, count of worker nodes in cluster, count of the control plane in cluster, Cluster Creation operation time, Cluster Scale Up time, Cluster Scale Down time, Cluster Deletion time, etc for the type of a blueprint on which an application is deployed. 

Katalon Studio provides HTML-based reports or console logs to view the data after execution has been completed. Any test script can help to extract the required data in the form of a plain text-based file like .csv. However, CircleCI provides functionality to export this .csv file as an artifact inside the job. Such artifacts data can be combined into the database. To demonstrate the collected data in visualized manner, the Grafana dashboard can be helpful. Below can be the architecture for the same.

![Architectural Diagram of technology stack](/img/architectural-diagram.jpg "Architectural Diagram of technology stack")

## How to Create a  CircleCI pipeline?

A CircleCI pipeline includes various stages such as spinning up the environment by downloading required images and configuring test setup, preparing CircleCI environment, copyright check, cloning repository code, security checking, execution of test scripts, generating artifacts, generating results, and sending out results over email. A cron job schedules the execution of the automation pipeline. 

**Sample CircleCI config.yaml:**

```yaml
executors:
  katalon8_test_executor:
    docker:
      - image: default/katalon8:latest
jobs:
  checkout-workspace:
    docker:
      - image: circleci/golang:latest
  copyright-check:
    docker:
      - image: copyright-tool
    steps:
      - run:
        name: Check copy right
  performance-run-chrome:
    executor:
      name: katalon8_test_executor
    steps:
      - run:
          name: "Creating directory for artifacts"
          command: mkdir /tmp/project/
      - run:
          name: "Execute cluster metrics gathering test suite"
          command: xvfb-run katalonc -consoleLog -browserType="Chrome" -retry=0 -statusDelay=15 -testSuitePath="Test Suites/ClusterMetricsSuite" -executionProfile='default' -projectPath='/project/sample.prj' --config -webui.autoUpdateDrivers=true
      - store_test_results:
          path: ./tests/katalon/Reports
      - store_artifacts:
          path: /tmp/project/
workflows:
  performance-run:
    triggers:
      - schedule:
          cron: "0 20 * * *"
          filters:
            branches:
              only:
                - master
    jobs:
      - checkout-workspace
      - copyright-check
      - gather-cluster-metrics
          requires:
            - checkout-workspace
      - cluster-scaleup
          requires:
            - checkout-workspace
      - cluster-scaledown
          requires:
            - checkout-workspace             
      - update-results
          requires:
            - checkout-workspace 
```

**Sample CircleCI workflow can be demonstrated as below:** 

![CircleCI Automation pipeline](/img/sample-pipeline.jpg "Sample CircleCI Automation pipeline")

**A csvDataSource.csv artifact file may look like what's shown below:**

```sql
IDClusterCreation,DateTime,BlueprintType,ClusterCreationDuration,ClusterDeletionDuration,ClusterScaleUpDuration,ClusterScaleDownDuration
2a0810e6-0c32-451b-933b-74fbdf86358a,2022-06-15 20:00:00,demo,05,04,02,02
ce18d4e0-9af3-40da-8d43-266fe05d17ba,2022-06-15 20:10:00,large,04,05,02,02
767801bd-7f1e-4a9a-804e-b560f168d968,2022-06-15 20:20:00,xlarge,04,05,02,02
r3b185d5-c96a-49a5-b6de-13ae93c93fd4,2022-06-15 20:30:00,standard,05,04,02,02
```

## How to Download Artifacts from CircleCI Workflow Dynamically?

CircleCI provides [API Token](https://circleci.com/docs/2.0/managing-api-tokens/#creating-a-personal-api-token) to view pipelines via an API interface. Based upon requirements, various [APIs ](https://circleci.com/docs/api/v2/)can be selected. In the [postman ](https://www.postman.com/downloads/)tool, a user can try a combination of APIs for passing the output of one API result to the input of another API. A curl command for downloading artifacts from CircleCI API may look like the one mentioned below:

```shell
curl -H "Circle-Token: $TOKEN" "https://circleci.com/api/v2/project/gh/$repo/$project/$JOB_ID/artifacts" | grep -o 'https://[^"]*csvDataSource[^"]*' \
   | wget --timeout=10  --verbose --header "Circle-Token: $TOKEN" --input-file -
```

## Grafana Dashboard Configurations

Nightly CircleCI build runs will collect the artifacts and those can be filled into databases like MySQL or Prometheus. In Grafana, various data source configurations are available, where the user has to configure the required data source. There are various chart options available for visual interpretation. By providing various MySQL queries, the required graph can be generated. 

A sample MySQL query to display the maximum, minimum, and average cluster creation duration for each blueprint type can be written for Grafana as mentioned below.

```sql
select BlueprintType AS "Blueprint Type",
max(cast(ClusterCreationDuration as UNSIGNED)) as "Maximum Creation Time (Minutes)",
min(cast(ClusterCreationDuration as UNSIGNED)) as "Minimum Creation Time (Minutes)",
AVG(ClusterCreationDuration) as "Average Creation Time (Minutes)",
format(std(cast(ClusterCreationDuration as UNSIGNED)),2) AS "STD Dev.Creation Time(Minutes)"
from ClusterTable GROUP BY BlueprintType;
```

**Finally, the Grafana dashboard appears as:**

![SampleGrafanaDashboard](/img/sample-chart.jpg "Sample Grafana Dashboard (Data is for illustrative purpose only. Axis are hidden)")

Note that, all data illustrated is for understanding purposes only. No relevance to actual HPE GreenLake performance is being shown or claimed in this blog post.

## Conclusion

Automation pipelines are helpful to find defects yet tricky to implement. This blog guides the user to integrate various tools and generate graphs. By analyzing these graphs, a user can track the cluster's performance measurements for a period of time which may help to find out the reasons for the degraded behavior of various clusters.