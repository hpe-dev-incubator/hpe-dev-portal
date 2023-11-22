---
title: "Big Data Opportunities for Telecommunications"
date: 2020-11-05T16:27:29.955Z
author: Carol McDonald 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","apache-spark","opensource"]
authorimage: "/img/blogs/Avatar1.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019, may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
"authorDisplayName": "Carol McDonald",
"publish": "2017-05-09T00:00:00.000Z",
"tags": "apache-spark"
```

---

*The telecommunications industry is on the verge of a major transformation through the use of advanced analytics and big data technologies like the MapR Data Platform.*

## **The Motivation for Big Data**

With the rapid expansion of smart phones and other connected mobile devices, communications service providers (CSPs) need to rapidly process, store, and derive insights from the diverse volume of data traveling across their networks. Big data analytics can help CSPs improve profitability by optimizing network services/usage, enhancing customer experience, and improving security.  According to McKinsey, <a target="_blank" href="http://www.mckinsey.com/industries/telecommunications/our-insights/telcos-the-untapped-promise-of-big-data">the potential for Telcos to profit from applying data science effectively is substantial</a>. Examples include:

*   Predicting the periods of heaviest network usage, and targeting steps to relieve congestion
*   Identifying the customers most likely to defect, and targeting steps to prevent churn
*   Identifying the customers most likely to have problems paying bills, and targeting steps to improve the recovery of payments

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/0-1605076495751.png)

## **Big Data Use Cases In Telecom**

Telecommunication companies collect massive amounts of data from call detail records, mobile phone usage, network equipment, server logs, billing, and social networks, providing lots of information about their customers and network, but how can telecom companies use this data to improve their business?

Most telecom use cases fall into these main categories: customer acquisition and retention, network services optimization, and security.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/1-1605076513981.png)

## **Example Telecom Big Data Use Cases**

**Data-Driven Improvement of Services or Product**

Telecoms need to share data between cell towers, users and processing centers and due to the sheer volume of this data, it is important to process it near the source and then efficiently transfer it to various data centers for further use. <u>MapR Event Store</u>, a new distributed messaging system, is uniquely effective to transport huge amounts of data and to make this data available with reliable geo-distributed replication across multiple data centers. With MapR Event Store, you can replicate streams in a master-slave, many-to-one, or multi-master configuration between thousands of geographically distributed clusters.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/2-1605076542289.png)

One MapR customer is utilizing MapR Event Store to collect real-time data from all of its regional data centers and bring it to the HQ Central Data Center.

**BEFORE**

Before, the customer was using FTP to transfer data from antennas to regional data centers and to the HQ Central Data center, but the FTP transfer meant extreme latency throughout the data pipeline.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/3-1605076561221.png)

**AFTER**

Now data is collected at regional data centers with MapR Event Store and made available in real time to regional dashboards.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/4-1605076603434.png)

MapR Event Store Topics at regional data centers are replicated in a many-to-one configuration to the HQ Central Data Center, making events available in real time to the HQ dashboard. This means they can now monitor global performance and react fast enough to improve customer services.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/5-1-1605076623532.png)

Being able to process high throughput geo-distributed events in real time enables:

*   Understanding how and where service issues are trending and how that is affecting customers.
*   **Crowd-based antenna optimization**: Monitor quickly changing network usage patterns, and reconfigure network support to handle short-term surges, such as heavy usage near a stadium during a sporting event.
*   **Optimizing Services with Equipment Monitoring, Capacity Planning, and Preventative Maintenance**:
    *   Dropped calls
    *   Lack of network coverage, resulting in poor customer experience
    *   Bandwidth issues
    *   Poor download times
    *   Inordinate service wait times
    *   Switching, frequency utilization, capacity use

Analyzing these events in real time is the key to timely insights on network services in order to improve customer satisfaction.

## **Customer 360**

Using data science in order to better understand and predict customer behavior is an iterative process, which involves:

1. Data Discovery and Model Creation:
2. Analysis of historical data.
3. Identifying new data sources, which traditional analytics or databases are not using due to the format, size, or structure.
4. Collecting, correlating, and analyzing data across multiple data sources.
5. Knowing and applying the right kind of machine learning algorithms to get value out of the data.
6. Using the Model in production to make predictions
7. Data Discovery and updating the Model with new data.

In order to understand the customer, a number of factors can be analyzed such as:

*   Customer demographic data (age, marital status, etc.)
*   Sentiment analysis of social media
*   Customer usage patterns, geographical usage trends
*   Calling-circle data
*   Browsing behavior from clickstream logs
*   Support call center statistics
*   Historical data that shows patterns of behavior that suggest churn

With this analysis, telecom companies can gain insights to predict and enhance the customer experience, prevent churn, and tailor marketing campaigns.

## **Threat Detection**

Solutionary, a subsidiary of NTT Group, is a leader in Managed Security Services. They provide Threat Intelligence, Incident Response, Compliance and Vulnerability Management as a service to their clients. Their platform collects and correlates vast amounts of data from logs, endpoints, firewalls, and network devices.

They needed to improve scalability as the data volume grew, but it was cost-prohibitive with their existing Oracle database solution. The old solution could not process the unstructured log data at scale and there were also major performance issues.

They replaced their RDBMS solution with the MapR Data Platform to achieve scalability while still meeting reliability requirements. Their new solution combines machine learning algorithms, complex event processing, and predictive analytics to detect real-time security threats.

All of the components of the use case architectures we just discussed can run on the same cluster with the MapR Data Platform, which provides advantages such as:

*   Less complexity, fewer moving parts, fewer things to manage: converging multiple clusters for Streams/HBase/Spark/Hadoop into one cluster.
*   "Joining" data sources into one core data mediation platform so that applications consume data in an easier way.
*   Unified security.
*   High reliability and high availability, replication from datacenter to datacenter.
*   Multi-tenancy: MapR Event Store is able to have essentially unlimited topics for lots of tenants.

Telecom is a classic example of the big data issues of huge volume and velocity of data flow, but CSPs also have high requirements for quick responses to events, security, and reliability. The use cases we just went over showed how telecom companies can not only address these requirements, but also profit from the huge amount of information in their data to improve their business.