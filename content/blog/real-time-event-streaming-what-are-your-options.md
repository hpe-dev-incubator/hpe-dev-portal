---
title: "Real-Time Event Streaming: What Are Your Options?"
date: 2021-01-29T05:22:57.331Z
author: Ankur Desai 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","apache-spark","event-streaming"]
authorimage: "/img/blogs/Avatar4.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019 may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
"authorDisplayName": "Ankur Desai",
"publish": "2016-04-14T07:00:00.000Z",
"tags": "open-source"
```

---

With the Internet of Things expected to bring billions of devices online, a lot of people are excited about the potential value of event streaming, that is, ingesting and analyzing lots of real-time data for immediate decision-making. But streaming also introduces new concepts and components that need a closer look. This blog post is intended to provide an introduction to the components of a typical streaming architecture and various options available at each stage.

## Three Components of a Streaming Architecture

Most streaming architectures have three major components – producers, a streaming system, and consumers.

**A producer** is a software-based system that is connected to the data source. Producers publish event data into a streaming system after collecting it from the data source, transforming it into the desired format, and optionally filtering, aggregating, and enriching it.

**The streaming system** takes the data published by the producers, persists it, and reliably delivers it to consumers.

**Consumers** are typically stream processing engines that subscribe to data from streams and manipulate or analyze that data to look for alerts and insights. There are lots of options to choose from, and more are on the way. Let’s look at what your options are for each stage.

### **Stage 1: Producers**

Data producers collect the data from data sources, convert it to the desired format, and publish the data into streaming platforms such as <a target='\_blank'  href='http://kafka.apache.org/'>Apache Kafka</a> and MapR Event Store. Apache Flume is commonly used as a producer to Kafka. StreamSets is an up-and-coming data collector that may be worth a look.

**<a target='\_blank'  href='https://flume.apache.org/'>Apache Flume</a>** is a distributed system for efficiently collecting, aggregating, and moving large amounts of data. Flume has a source and sink architecture. A Flume source collects the event data from the data sources. A Flume sink puts the event into an external repository, which is often a streaming system like Apache Kafka or MapR Event Store.

**<a target='\_blank'  href='https://streamsets.com/product/'>StreamSets Data Collector</a>** is open source software for the development and operation of complex data flows. It provides a graphical IDE for building ingest pipelines. StreamSets can help you connect with Kafka without writing a single line of code. StreamSets Data Collector includes out-of-the-box connectors for Kafka and many other sources and destinations.

### **Stage 2: Streaming System**

Two event transport systems that can easily scale to deliver billions of events per second are Apache Kafka and MapR Event Store. The ability to linearly scale to deliver billions of events per second differentiates Kafka and MapR Event Store from traditional messaging queues like <a target='\_blank'  href='http://www.tibco.com/products/automation/enterprise-messaging/enterprise-message-service'>Tibco EMS</a> and <a target='\_blank'  href='http://www-03.ibm.com/software/products/en/ibm-mq'>IBM MQ</a>. Kafka and MapR Event Store both use a publish-subscribe model in which the data producer is the publisher and the data consumer is the subscriber.

**Apache Kafka** is great at handling large volumes of data. You can set up a cluster as a data backbone, which gives you great scalability. You can then easily expand the cluster as needed without downtime. Kafka also stores messages on disk and replicates them within the cluster to reduce the risk of data loss when you encounter a hardware failure.

**MapR Event Store for Apache Kafka** is like Kafka – in fact, it uses <a target='\_blank'  href='http://kafka.apache.org/documentation.html'>the Kafka 0.9 API</a> – but it has certain enterprise features that provide additional support for very large and geographically diverse networks where data integrity is essential. MapR Event Store is integrated with the MapR Data Platform, which combines file storage, database services, and processing frameworks in a single cluster. That means batch, interactive, and stream processing engines all have direct access to event streams, which reduces data movement and ensures consistency.

### **Stage 3: Consumers (Processing)**

MapR Event Store and Kafka can deliver data from a wide variety of sources, at IoT scale. It’s then up to the processing engines to do something with it. Four important engines to know about include Apache Spark Streaming, Apache Flink, Apache Storm, and Apache Apex.

**Spark Streaming** is a built-in component of Apache Spark. Spark Streaming can consume event streams from MapR Event Store, Kafka, and many other systems. By being a built-in component of Spark, Spark Streaming runs in-memory, and allows you to run ad-hoc queries on stream data. Spark Streaming can be more accurately described as “micro-batching,” or processing small amounts of batch information in quick bursts.

**<a target='\_blank'  href='http://storm.apache.org/'>Apache Storm</a>** is another popular event processing engine. Unlike Spark, Storm is a pure real-time event-based analytics engine, which makes it most useful in situations in which each event needs to be processed instantaneously. Storm actually processes each event as soon as it is delivered.

**<a target='\_blank'  href='https://flink.apache.org/'>Apache Flink</a>** works in-memory and is notable for its speed and scalability. Similar to Storm, it is a pure real-time event-based processing engine. The differences between the two are quite technical, having to do with such things as the way each ensures data reliability, the programming languages they support, and the capabilities of their respective APIs. Flink supports the Apache Storm API, to make the transition from Storm easy for developers familiar with Storm.

**<a target='\_blank'  href='http://apex.incubator.apache.org/'>Apache Apex</a>** is a YARN-native platform that unifies stream and batch processing. It lowers the expertise required to write big data applications by providing a simple API that enables users to write or reuse generic Java code.

You can see that the enthusiasm over real-time processing is being met with a host of technologies. And the landscape is constantly evolving.
