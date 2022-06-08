---
title: How to Set Up an Automation Pipeline to Measure Cluster Performance on
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

## How to Use Automation Pipeline Tools?

In Katalon, Test cases can be structured using test suites with environment variables. Test execution can be parameterized and parallelized using profiles. Remote execution in Katalon Studio can be triggered by CI systems via Docker container or command-line interface. Automation job can be triggered for Cluster Creation operation, following via Cluster Scale Up, Cluster Scale Down, and Cluster Deletion operation, 

The scripts for the above operations include verification points and required performance metrics. The automation suite starts recording the required time for the cluster to become ready upon the trigger of the cluster creation process. Similar way other cluster operations related data can be collected. Katalon Studio provides HTML-based reports or console logs to view the data after execution has been done. Any test script can help to extract the required data in form of a plain text-based file like .csv. CircleCI provides functionality to export this .csv file as an artifact inside the job. 

![Architectural Diagram](/img/architectural-diagram.jpg "Architectural Diagram")



Sample CircleCI config.yaml:

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
          name: "Execute Katalon performance test suite"
          command: xvfb-run katalonc -consoleLog -browserType="Chrome" -retry=0 -statusDelay=15 -testSuitePath="Test Suites/PerformanceSuite" -executionProfile='default' -projectPath='/project/sample.prj' --config -webui.autoUpdateDrivers=true
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
      - performance-run-chrome
          requires:
            - checkout-workspace
      - performance-run-firefox
          requires:
            - checkout-workspace 
      - updateTestResults
          requires:
            - checkout-workspace 

```



Sample CircleCI workflow can be demonstrated as below: 

![CircleCI Automation pipeline](/img/sample-pipeline.jpg "Sample CircleCI Automation pipeline")



An artifact file structure may look like what's shown below:

```sql
IDClusterCreation,DateTime,BlueprintType,ClusterCreationDuration,ClusterDeletionDuration,ClusterScaleUpDuration,ClusterScaleDownDuration
2a0810e6-0c32-451b-933b-74fbdf86358a,2022-06-15 20:00:00,demo,05,04,02,02
ce18d4e0-9af3-40da-8d43-266fe05d17ba,2022-06-15 20:10:00,large,04,05,02,02
767801bd-7f1e-4a9a-804e-b560f168d968,2022-06-15 20:20:00,xlarge,04,05,02,02
r3b185d5-c96a-49a5-b6de-13ae93c93fd4,2022-06-15 20:30:00,standard,05,04,02,02
```

To demonstrate the collected data in visualized manner, the Grafana dashboard can be helpful. 

Nightly CircleCI builds run will collect the artifacts and those can be filled into databases like MySQL or Prometheus. In Grafana, various data source configurations are available, where the user has to configure the required data source. There are various chart options available for visual interpretation. By providing various queries required graph can be generated. 

By monitoring these graphs, unusual measurements can be tracked providing useful information to debug issues.

```sql
select BlueprintType, AVG(ClusterCreationDuration) as "Time (Minutes)" from ClusterTable GROUP BY BlueprintType
 
select BlueprintType AS "Blueprint Type",
max(cast(ClusterCreationDuration as UNSIGNED)) as "Maximum Creation Time (Minutes)",
min(cast(ClusterCreationDuration as UNSIGNED)) as "Minimum Creation Time (Minutes)",
AVG(ClusterCreationDuration) as "Average Creation Time (Minutes)",
format(std(cast(ClusterCreationDuration as UNSIGNED)),2) AS "STD Dev.Creation Time(Minutes)"
from ClusterTable GROUP BY BlueprintType;
```

Note that, all data illustrated is for understanding purposes only. No relevance to actual HPE GreenLake performance is being shown or claimed in this blog post.

![SampleGrafanaDashboard](/img/sample-chart.jpg "Sample Grafana Dashboard (Data is for illustrative purpose only. Axis are hidden)")