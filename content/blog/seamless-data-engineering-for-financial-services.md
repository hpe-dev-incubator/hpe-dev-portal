---
title: "Seamless data engineering for financial services "
date: 2023-09-11T13:56:53.685Z
author: Abhishek Kumar Agarwal
authorimage: /img/abi.png
thumbnailimage: /img/some-requested-image.jpg
disable: false
tags:
  - hpe-ezmeral
  - data-engineering
  - hybrid-cloud
  - data-analytics
  - Spark
  - Presto
  - GPU
  - hybrid
---
Welcome to the three-part blog series showcasing the remarkable capabilities of HPE Ezmeral Unified Analytics through a real-world use case: Stock Market Prediction. In Part 1 of this series, I will delve into the data engineering aspect of the platform, exploring how it facilitates seamless data management and analysis.

In Part 2 of the blog series, we will take you on a deep dive into the platform's ML/AI capabilities. Together, we will explore how the transformed data can be utilized for model building, leveraging Jupyter notebooks to perform interactive data exploration, pre-processing, and model training. Additionally, you will see how HPE Ezmeral Unified Analytics integrates seamlessly with MLflow for efficient model management and KServe for inference, allowing you to track and reproduce experiments easily.

Finally, in Part 3 of the series, I will focus on automation using MLOps.  Now, let's embark on this exciting journey into the design and implementation of this cutting-edge solution.

## What is HPE Ezmeral Unified Analytics?

HPE Ezmeral Unified Analytics software is a usage-based Software-as-a-Service (SaaS) platform that fully manages, supports, and maintains hybrid and multi-cloud modern analytics workloads through open-source tools. It goes beyond traditional analytics by seamlessly integrating machine learning and artificial intelligence capabilities, empowering users to develop and deploy data, analytics, and AI applications. By providing access to secure, enterprise-grade versions of popular open-source frameworks, the platform enables efficient and flexible scalability while securely accessing data stored in distributed data platforms. With its consistent SaaS experience, organizations can unlock data and insights faster, make data-driven predictions, and gain valuable business insights for faster decision-making, regardless of whether they operate on private, public, or on-premises infrastructure.

![](https://lh6.googleusercontent.com/I8m-F21ZhxExbOUCZsUjrAlQ6i1oapby2gnfJcelgsVDgSXEtQt_hvOeQSLWBwXAPVydqEEwMjiC_C2_mG3d7EKFL6uN6igCaetumxr-PFPvHtBNa6DiMKgp-qSvan4WzHf3UfRRwhxPOvgsD9sN7gA)

This use case involves leveraging external pricing server/rest API calls, which are streamed into the data lake/data warehouse of a cloud provider (Microsoft Azure) using Spark from HPE Ezmeral Unified Analytics. Let me demonstrate how this platform enables data analysis using EzPresto (an enterprise-supported version of Presto) and empowers the creation of live dashboards using Superset. 

## Step 1: **Data Gathering**

The data consists of stock prices of different companies listed in National Stock Exchange (NSE) of India. The files consist of historical data from the year 2000 to 2021, which was transformed to a streaming data source. The data was pulled from external servers hosted publicly and then saved to HPE Ezmeral Data Fabric Volume.

 ![](https://lh4.googleusercontent.com/EqEcRejQD_tZemLF6h9J5I6KIZrzTJdqeAkvGzDUI0KN-x4XD5FrNTRzz2N8VvmRVwhk5YG_RtpClmbctddZyhz7t47ooK8ZipEEsHWyuEk3sTKavVtUtskbBGi1tKrBSBCP2aGWkqMxTdtQIKjQdlo)

## Step 2: **Data Ingestion**

## Apache Livy

HPE Ezmeral Unified Analytics gives access to Apache Livy, which enables easy interaction with the Spark cluster via REST interface. It simplifies the access between Spark cluster and application servers. It enables long running Spark contexts that can be used for multiple Spark jobs and multiple clients. Multiple Spark context can be managed that runs on the Spark Clusters. Spark applications can be either batch jobs or real-time streaming applications as per the business needs. Financial services have both long running batch applications as well as streaming applications, Apache Livy provides seamless management of Spark for the data engineers and application support team.

Apache Livy on the HPE Ezmeral platform enables programmatic, fault-tolerant, multi-tenant submission of Spark jobs from web/mobile apps (no Spark client needed). So, multiple users can interact with the Spark cluster concurrently and reliably. Livy speaks either Scala or Python, so clients can communicate with the Spark cluster via either language remotely. Also, batch job submissions can be done in Scala, Java, or Python.

It enables easy interaction with a Spark cluster over a REST interface. It enables easy submission of Spark jobs or snippets of Spark code, synchronous or asynchronous result retrieval, as well as Spark context management, all via a simple REST interface or an RPC client library.

HPE Ezmeral Unified Analytics provides functions like %reload_ext sparkmagics and %manage_spark for seamless connection to the Spark cluster. %reload_ext sparkmagics loads the Spark session and authenticates the user for secured access to the Spark session. %manage_spark will create the Spark session with predefined Spark cluster configuration in the background.

![](https://lh3.googleusercontent.com/uLQ2f7fgl0NeTwPaf9L9WvumSN4prHhtxZl7jdM1fdCKfOjGJmGqphn5DPqiUkDhP4-sNUEbpLlW_EuyEzx8zGx9lzuDPjrM6j6SGo6Rbm8LO1zWenZBpKQGfuNNk4IjG1gfZX5O__F1HBA4jv_pH-w)

Once the Livy session is enabled, the code can be run on the notebook servers.

![](https://lh3.googleusercontent.com/NLB3_xj7PZ0W5w9JDXVvMGL3gHOZpV1pdWlMf2_toidQjxWAv7kRuY9n8AQRatl55Ht1ULl-v-BeiWB0TPJi-Pv4f-nwyFMEsjluZPUIzY-gXThHbzLGLs_3Nv7bjHD3EX-pV-1l4BZv3Geanr0VN9k)

## Spark Streaming

Financial applications like real-time transaction processing, fraud detection, trade matching and settlement systems are widely distributed and deal with large volume and variety of data. These systems require parallel processing of transactions in a distributed computing architecture. Hence, Spark streaming best suits the needs of such financial applications like the stock market prediction analysis.

Spark Streaming is a real-time data processing module in Apache Spark, a popular distributed computing framework for big data processing. It enables processing and analysis of live data streams in a scalable and fault-tolerant manner. Spark Streaming brings the power and flexibility of Spark's batch processing capabilities to real-time data streams, making it a versatile choice for various real-time data processing use cases.

Micro-Batch Processing: Spark Streaming follows the micro-batch processing model, where it divides the continuous stream of data into small, discrete batches. Each batch of data is processed as a RDD (Resilient Distributed Dataset), which is Spark's fundamental data abstraction for distributed computing. This approach allows Spark Streaming to process data in mini-batches, providing low-latency processing and better resource utilization.

Data Sources and Sinks: Spark Streaming can ingest data from various sources, including Kafka, Flume, Kinesis, HDFS, TCP sockets, and more. It supports a wide range of input formats, making it compatible with different streaming data pipelines. Similarly, Spark Streaming can write the processed data to various sinks, such as HDFS, databases (e.g., MySQL, Cassandra), and external systems.

## Notebook servers

HPE Ezmeral Unified Analytics is equipped with notebook servers that can execute Python commands seamlessly along with scalable resources like CPUs, GPUs, and memory. Notebook servers can be spun up on Kubeflow using pre-defined Jupyter notebook images or custom-built notebook images based on your requirement. It will take a few minutes to bring the notebook server up and running. 

![](https://lh3.googleusercontent.com/8WjmN9__cQO0SYaS_s6Qq0bg0m4DRdSjrbyfdvL3QrsYWztDZB6am7tyjK0aWeMxGiwyNuVs-hZX8BYZbMgpakFsOUJQc_aUdHItNpLkF9tvEmY5-l6upUu8GHsLhZ_NKLZljEsEDo30FbJ1HN39M4Y)

Once it is available, you can connect to the notebook server either on HPE Ezmeral Unified Analytics Notebooks Tab or directly from the Kubeflow Notebooks.

 ![](https://lh6.googleusercontent.com/bY2CLk9ru69g0lTgPTpHECnv1oS_LZrRpeP7h3zN3-LlwQQMIAVE5LPeuD7aaOu0xPmrQN7tNwv_gqSYWfWwrTIrXUNe4U179lxbHUwOdlio0SeDohJB4nfan2IGYhg00xL8LylNoDVlV6rAUSoABFI)

## MySQL Database

A MySQL database was created and hosted in Microsoft Azure to capture the structured streaming data to a single table. The database server is configured to permit access to the select IP addresses.

## Step 3: **Streaming data to database**

The data is read from HPE Ezmeral Data Fabric volume by the Spark Streaming engine in constant time intervals. The Spark engine converts the files into batches and does some data engineering like transformations and aggregations on the data. Finally, it is saved to MySQL database using jdbc connections. It is mandatory for all the incoming files to share the same schema.

3.1 Load the required Spark libraries.

Once connected to the Livy server, the Spark connection is configured and managed internally by HPE Ezmeral Unified Analytics platform. Now you can directly import the required libraries and you’ll be ready to use Spark. 

![](https://lh5.googleusercontent.com/3-oBLpDhQ6DY4QJSn4K9-nR3fXB2IMtpQuphVxIcR9rd6SpSVaolvNg_xTp9VwUX726oJZJE8Cb9ii4xhrrJc-QtTee5xn2jes1qLDPnRVj3GKQUoWoCvl43IeACRSzCMJmVtDIOTK-p6CZ5eZFmj6s)

3.2 Define the Data Schema

Define the data schema for the data to stream in the application.

![](https://lh6.googleusercontent.com/vwbcqYFB0FdwVTsb_lFDHyBZKBWRrv18B0P3BWRaHWG2q7tXS-nNTrUEjA_GnJVP5e5r2RnZZ3ds3GLCVTY0XZOj6L9WJtL-f3ll_COXW1YIW8PjfqcVNQGPE31ODOhhEFeAKLvGDvBi-_0v9r2z3eE)

3.3 Read the input stream of files from the external server

![](https://lh5.googleusercontent.com/LRu4GZMlkTQZ8crHQBXBXd5aFtFDzATuVJXSXOpAcQDb3DSQ8NUH4PQuXAsATtrTcUON1j9quD28gFuzc_Bgj3er771mdrR62JtSKezBrcTlxPCwI8tVXseRg1pxeSxjh-ktolizmQV08H8u8_QaJ20)

3.4 Write the output stream to the destination path.

![](https://lh5.googleusercontent.com/aUcWv_pT4sW9AUowSlfnBHKBRy_BCebTyWO99epi3koEaw8srIYP5uLFQc6WKFUt9ZaFKCfrSS1ewWeWScU2-Tv65fHmcM2CPEGGEN8l7YZZv8zis_LEBq4qcr3qS2_8g3eBPFrqXdvLuXwhShdOL3Y)

3.5 Read the data using Spark SQL and perform Exploratory Data Analysis.

![](https://lh4.googleusercontent.com/gMBQ7IbeVKFi9YDjjVn485VXx8Kt-jcJvNBFV7HsWYjGqnSZzpdEKrgfvypRiTCUIYMVLlOag3FDjwhNFPdVJyZrXqqf9cOiLJkJ6T89MajBJccQizawt0lqo7gPrVM4DPTEbx9dJj5zR7BHVwbnFUs)

## Step 4: **Connecting the database to HPE Ezmeral Unified Analytics**

HPE Ezmeral Unified Analytics provides users with a quick and simple process to connect to external data sources like different databases, Hive, Snowflake, Teradata, etc. Here a new data source connection is added, and the source is selected as MySQL. The connection is established once the jdbc connection url, username and password are validated.

![](https://lh6.googleusercontent.com/BmmyC843T9xG9NukA_XqQ7-qxTD8S9SP3y1IH6UGnMflFmEYDMAN-J6-YgURJAuBFPC5fNkrXZBGKdHDthHo-nRqOQO_5R3W04FtYGq67yIiJRmCxQrBq0qZC-4lhzeD7wXe5-H8Bem1_X9EXDTCK2M)

This will connect the database to EzPresto, which is a distributed analytic query engine for big data, integrated into HPE Ezmeral Unified Analytics. This enables users to query the tables in the database using SQL commands. This service helps users to use the database seamlessly by enabling them to insert, delete, update and query records from the tables. The data can be accessed from a remote server or on HPE Ezmeral Data Fabric Software. 

![](https://lh3.googleusercontent.com/EJZsyxnH6tUhlduTbkddolYL3QHc3QUmAihD_QmE8L0_p1j_y1DfgA8HE0ug1dF3RecvRuomELlrp7LtSYIqWuk6U2vs15MR6SvmnLz-1zTeZGf_v9iXzkCu43kyrEpucyHnBVRTvAXb7nff5uWXEiM)

## Step 5: **Visualization using Superset**

Apache Superset, a data visualization tool has been integrated into HPE Ezmeral Unified Analytics, which helps with the graphical representation of data, from simple line charts to highly detailed geospatial charts. The dashboards help users to get a clear picture of the KPIs and other relevant metrices of the business.

Here, a new dashboard is created in HPE Ezmeral Unified Analytics, and the connection to the database is established. Different visuals on the stock data are integrated into the dashboard and it is customized to auto refresh to a customer-defined time interval. Once the data starts streaming, the dashboard updates the visuals periodically and the latest data is available on the dashboard for analysis.

![](https://lh6.googleusercontent.com/MvJQkbWinxA42eJ6J0-mOK-9sBNdh6JOeU0gMAplO308IyLPIFB1H7oweUZ9cTMngpkr4qyi9saWsQ9PaNFGSBxF8O9DE8HctUaqHmvDPGFmEL586UAySdnAW6b9KFxrC2vbUyiCP-WUvkeDjd5BJxI)

![](https://lh3.googleusercontent.com/QmnYcBblPyGIxZ-6lElbDCn0lCcG7PcPqSxHCwFslo3IVG9ExQxvSWdvmB1s5W6uOeiCJMCmSEuIZSUBtF8gJxrHP1nIw8qPyUTZH3QEn4kvPbW-GyXfNLvP4bAAbdIgbtOg6MsccLM-USWpFuDeKJ8)

![](https://lh3.googleusercontent.com/nQul3Zy2RuOYA7RXOqokiTIhCLQYDktS_VzCU5YBVLSjItmICHnRCQlLp_pzyLR1tnHKbvCcXLBnG7E7JeYfKh7pBC_OGGpxS5ewCKfi2IWvzXA7LVIq05Lk9DNFVdlc9EuqsxDN_xiPGrMsAWW8B38)

## Summary

In concluding Part 1 of this blog series, you’ve journeyed through the data engineering and analytics aspects of using Spark, EzPresto, and Superset, powered by HPE Ezmeral Unified Analytics. With a spotlight on assimilating external pricing data to craft a dynamic dashboard, I hope I have illuminated how this platform brings together best of breed open-source tools to transform complex data into valuable insights.

Don't miss Part 2, where you’ll get to explore the machine learning capabilities of our platform. To get familiar with HPE Unified Analytics Software, [try it](https://www.hpe.com/us/en/hpe-ezmeral-unified-analytics.html) for free or visit our [website](https://docs.ezmeral.hpe.com/unified-analytics/11/index.html) for details. Let's unlock the future of analytics together!

Contributors to this blog post include Suvralipi Mohanta ([suvralipi.mohanta@hpe.com](suvralipi.mohanta@hpe.com)), Harikrishnan Nair ([harikrishnan.nair@hpe.com](mailto:harikrishnan.nair@hpe.com)), and Joann Starke ([joann.starke@hpe.com](joann.starke@hpe.com)).