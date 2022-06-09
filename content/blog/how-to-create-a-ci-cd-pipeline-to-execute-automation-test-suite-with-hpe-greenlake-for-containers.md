---
title: How to Set Up an Automation Pipeline to Achieve Observability on HPE
  GreenLake for Containers
date: 2022-06-09T11:05:39.047Z
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

*An HPE GreenLake Cloud Service, HPE GreenLake for Containers, is built upon HPE Ezmeral Runtime Enterprise and runs on a container-based Kubernetes orchestrated infrastructure.* Using the Clusters module of the HPE GreenLake Central dashboard, one can perform several cluster-related operations. A cluster can be created using default or custom machine blueprints, deleted, scaled up, or scaled-down using this module. A user can navigate to the HPE Ezmeral Runtime through which various applications can be deployed and containerization can be achieved. Additionally, the cluster detail page provides some interesting insights like CPU usage, memory allocation, and storage availability. Metrics like these are crucial to tracking application usage and, subsequently, determining the resources required to grow the business. Here is the image mentioned above.

![Cluster detail screen](/img/cluster-detail.jpg "Cluster detail screen")

It sounds interesting if one can get historical data of such metrics to analyze application-specific metrics. Using past consumption data, a customer can decide if the cluster should be scaled up on some days of the year and scaled down on others. For a system administrator working on an abstract layer of application deployment, choosing the right blueprint is crucial. A graph indicating high memory usage over CPU usage might lead him to change blueprints that offer high compute resources. The purpose of this blog post is to illustrate how a person can implement the Automation Pipeline which can provide observability via the use of automation weapons such as Katalon (UI automation tool), CircleCI (continuous integration and continuous delivery platform), MySQL (a database provider) and Grafana (an interactive visualization web application tool that uses time-series data to create meaningful graphs).



## How to Implement the Automation Pipeline?



[Kalalon studio ](https://katalon.com/katalon-studio/)software uses an open-source Selenium framework to interact with web browsers with HTTP commands. CI systems can trigger remote execution of Katalon Studio scripts through Docker containers or command-line interfaces. At a scheduled time and frequency, cron jobs can be configured to check various dynamic measurements of clusters such as CPU usage, memory usage, storage capacity availability, the number of worker nodes in the cluster, the number of control planes in the cluster, the time taken to scale up a cluster node, time taken to scale down a cluster node, the time taken to create a cluster, etc.

Katalon Studio provides HTML-based reports or console logs after execution is complete. It is possible to extract the required data in the form of a plain text-based file, such as .csv, using any script. CircleCI offers the capability to export this .csv file as an artifact inside the job. This artifact data can then be imported into the database. In order to visualize the collected data, the Grafana dashboard is helpful. This can be seen in the architecture below.

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