---
title: "Kafka Connect and Kafka REST API on MapR: Streaming Just Became a Whole Lot Easier!"
date: 2021-01-29T05:29:20.597Z
author: Ankur Desai 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","kafka","event-streaming"]
authorimage: "/img/blogs/Avatar2.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019 may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
"authorDisplayName": "Ankur Desai",
"publish": "2016-12-09T06:00:00.000Z",
"tags": "nosql"
```

---

In my previous blog post [Real-Time Event Streaming: What Are Your Options?](/blog/LOV2B97WzAiAzmYlY17y/real-time-event-streaming-what-are-your-options), I explained the three major components of a streaming architecture. Most streaming architectures have three major components – producers, a streaming system, and consumers. Producers (such as Apache Flume) publish event data into a streaming system after collecting it from the data source, transforming it into the desired format, and optionally filtering, aggregating, and enriching it. The streaming or messaging system (such as Apache Kafka or MapR Event Store) takes the data published by the producers, persists it, and reliably delivers it to consumers. Consumers are typically stream processing engines (such as Apache Spark) that subscribe to data from streams and manipulate or analyze that data to look for alerts and insights. Furthermore, once the data is processed, it may need to be persisted in a database or a file for future use by downstream applications.

The following diagram illustrates the typical streaming architecture:

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/picture1-1611898227918.png)

However, as streaming becomes more pervasive, we are looking to simplify this architecture and, at the same time, make it more agile. Enter Kafka Connect and the Kafka REST API. The following diagram illustrates a new, simple, agile way of setting up your streaming:

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/picture2-1611898241971.png)

## Kafka Connect: Easily connect common data systems with Kafka

Kafka Connect provides pre-built connectors that allow legacy data stores (such as databases and data warehouses) and modern data stores (such as HDFS) to connect with Kafka. This connection eliminates the need of building a custom “producer” or “consumer” application to help these data systems to publish/subscribe to Kafka. It also eliminates the need for a third party data collector that provides connectors to these data stores.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/picture3-1611898250133.png)

Kafka Connect provides a convenient, reliable connection to the most common data stores. It helps to ingest data into Kafka as well as push data from Kafka into the most commonly used data systems. Moreover, to eliminate the need of custom producer apps, it allows pull-based ingestion of data, supporting sources that don't know how to push. Similarly, to eliminate custom consumer apps, it allows push-based export of data from Kafka, supporting data systems that don't know how to pull data from Kafka. As Kafka Connect continues to mature, more connectors will be created, opening up a large range of sources and sinks that can connect to Kafka out of the box.

## Kafka REST Proxy: Connect with Kafka using HTTP

New age data sources such as sensors, mobile devices, etc., know how to communicate using HTTP. However, they often do not have enough computing resources to run a Kafka producer application and a Kafka client. This deficiency is why the Kafka REST API is a game changer. It allows these devices to publish/subscribe to Kafka topics easily, which makes the architecture much more agile. Any device that can communicate using HTTP can now communicate directly with Kafka. This development has massive implications in simplifying IoT architectures. Any car, thermostat, machine sensor, etc., can now communicate directly with Kafka.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/picture4-1611898257677.png)

The Kafka REST API eliminates intermediate data collectors and simplifies the architecture by directly connecting the data sources with Kafka. Any programming language in any runtime environment can now connect with Kafka using HTTP. This ability gives developers the freedom to use the development framework of their choice and connect with Kafka using simple REST APIs, which reduces the time-to-market for streaming applications.

## MapR Data Platform: Further simplifying the architecture

The MapR Platform further simplifies the streaming architecture by providing event streaming, stream processing, and persistence (both database and files) on one single platform, in one system, in one cluster. You can connect the data sources with MapR Event Store - which is a more secure, reliable, and performant replacement for Kafka - using the Kafka REST API or Kafka Connect. All the components of your streaming architecture will be available on MapR, within one platform.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/picture5-1611898264954.png)

MapR Event Store uses the same APIs as Kafka (0.9), which means that applications built with Kafka as the messaging system can be easily ported over to MapR Event Store and vice versa. Without the converged platform, event streaming, stream processing, and persistence would run as separate systems that would need to be connected. Connected systems require cross-cluster data movement, which introduces additional latency. They also require more hardware, since resources cannot be shared across siloed systems and have higher administration cost. The MapR Data Platform eliminates these problems by providing one single system for all components (except the original data sources) of the streaming architecture.
