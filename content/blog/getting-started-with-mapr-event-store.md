---
title: "Getting Started with MapR Event Store"
date: 2021-02-19T06:51:45.400Z
author: Tugdual Grall 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","kafka"]
authorimage: "/img/blogs/Avatar6.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019 may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:
```
"authorDisplayName": "Tugdual Grall",
"publish": "2016-03-10T08:00:00.000Z",
"tags": "streaming"
```

---

MapR Event Store is a distributed messaging system for streaming event data at scale. It is integrated into the MapR converged platform. MapR Event Store uses the Apache Kafka API, so if you’re already familiar with Kafka, you’ll find it particularly easy to get started with MapR Event Store.  

Although MapR Event Store generally uses the <a target='\_blank'  href='http://kafka.apache.org/documentation.html#introduction'>Apache Kafka programming model</a>, there are a few key differences. For instance, there is a new kind of object in the MapR file-system called, appropriately enough, a stream. Each stream can handle a huge number of topics, and you can have many streams in a single cluster. Policies such as time-to-live or ACEs (Access Control Expressions) can be set at the stream level for convenient management of many topics together.
If you already have Kafka applications, it’s easy to migrate them over to MapR Event Store.
In this blog post we describe how to run a simple application we originally wrote for Kafka using MapR Event Store instead.  

## Sample Programs
As mentioned above, MapR Event Store uses <a target='\_blank'  href='http://kafka.apache.org/documentation.html#api'>Kafka API 0.9.0</a>, which means it is possible to reuse the same application with minor changes. Before diving into a concrete example, let’s take a look at what has to be changed: 

1.  The topic names change from "`topic-name`" to "`/stream-name:topic-name`", as MapR organizes the topics in streams for management reasons (security, TTL, etc.).

2.  The producer and consumer configuration parameters that are not used by MapR Event Store are automatically ignored, so no change here.

3.  The producer and consumer applications are using jars from MapR rather than the Apache Kafka jars.
You can find a complete application on the <a target='\_blank'  href='https://github.com/mapr-demos/mapr-streams-sample-programs'>Sample Programs for MapR Event Store</a> page. It’s a simple copy that includes minor changes of the <a target='\_blank'  href='https://github.com/mapr-demos/kafka-sample-programs'>Sample Programs for Kafka 0.9 API</a> project.

## Prerequisites
You will need basic Java programming skills, as well as access to:

*   A running MapR Cluster
*   <a target='\_blank'  href='https://maven.apache.org/'>Apache Maven 3.0</a> or later
*   Git to clone the <a target='\_blank'  href='https://github.com/mapr-demos/mapr-streams-sample-programs'>https://github.com/mapr-demos/mapr-streams-sample-programs</a> repository

## Running Your First MapR Event Store Application
### Step 1: Create the stream
A _stream_ is a collection of topics that you can manage together by:

1.  Setting security policies that apply to all topics in that stream

2.  Setting a default number of partitions for each new topic that is created in the stream

3.  Setting a time-to-live for messages in every topic in the stream.
Run the following command, as `mapr` user, on your MapR cluster:

```bash
$ maprcli stream create -path /sample-stream
```

By default, the produce and consume topic permissions are defaulted to the creator of the streams — the Unix user you are using to run the maprcli command. It is possible to configure the permission by editing the streams. For example, to make all of the topics available to anybody (public permission), you can run the following command:

```bash
$ maprcli stream edit -path /sample-stream -produceperm p -consumeperm p -topicperm p
```

### Step 2: Create the topics
We need two topics for the example program, which we can be created using `maprcli`:

```bash
$ maprcli stream topic create -path /sample-stream  -topic fast-messages
$ maprcli stream topic create -path /sample-stream  -topic summary-markers
```

These topics can be listed using the following command:

```bash
$ maprcli stream topic list -path /sample-stream
topic            partitions  logicalsize  consumers  maxlag  physicalsize
fast-messages    1           0            0          0       0
summary-markers  1           0            0          0       0
```

Note that the program will automatically create the topic if it does not already exist. For your applications, you should decide whether it is better to allow programs to automatically create topics simply by virtue of having mentioned them or whether it is better to strictly control which topics exist.

### Step 3: Compile and package the example programs
Go back to the directory where you have the example programs and build an example program.

```bash
$ cd ..
$ mvn package
...
```

The project creates a jar with all the external dependencies ( `./target/mapr-streams-examples-1.0-SNAPSHOT-jar-with-dependencies.jar`).

Note that you can build the project with the Apache Kafka dependencies as long as you do not package them into your application when you run and deploy it. This example has a dependency on the MapR Event Store client instead, which can be found in the `mapr.com` maven repository.

```scala
   <repositories>
       <repository>
           <id>mapr-maven</id>
           <url>http://repository.mapr.com/maven</url>
           <releases><enabled>true</enabled></releases>
           <snapshots><enabled>false</enabled></snapshots>
       </repository>
   </repositories>
   ...
       <dependency>
           <groupId>org.apache.kafka</groupId>
           <artifactId>kafka-clients</artifactId>
           <version>0.9.0.0-mapr-1602</version>
           <scope>provided</scope>
       </dependency>
  ...
```

### Step 4: Run the example producer
You can install the MapR Client and run the application locally or copy the jar file onto your cluster (any node). If you are installing the MapR Client, be sure you also install the MapR Kafka package using the following command on CentOS/RHEL:

```bash
`yum install mapr-kafka`
```

```bash
$ scp ./target/mapr-streams-examples-1.0-SNAPSHOT-jar-with-dependencies.jar mapr@<YOUR_MAPR_CLUSTER>:/home/mapr
```

The producer will send a large number of messages to `/sample-stream:fast-messages` along with occasional messages to `/sample-stream:summary-markers`. Since there isn't any consumer running yet, nobody will receive the messages.
If you compare this with the Kafka example used to build this application, the topic name is the only change to the code.
Any MapR Event Store application will need the MapR Client libraries. One way to make these libraries available is to add them to the application classpath using the `/opt/mapr/bin/mapr classpath` command. For example:

```bash
$ java -cp $(mapr classpath):./mapr-streams-examples-1.0-SNAPSHOT-jar-with-dependencies.jar com.mapr.examples.Run producer
Sent msg number 0
Sent msg number 1000
...
Sent msg number 998000
Sent msg number 999000
```

The only important difference here between an Apache Kafka application and MapR Event Store application is that the client libraries are different. This causes the MapR Producer to connect to the MapR cluster to post the messages, and not to a Kafka broker.

### Step 5: Start the example consumer
In another window, you can run the consumer using the following command:

```bash
$ java -cp $(mapr classpath):./mapr-streams-examples-1.0-SNAPSHOT-jar-with-dependencies.jar com.mapr.examples.Run consumer
1 messages received in period, latency(min, max, avg, 99%) = 20352, 20479, 20416.0, 20479 (ms)
1 messages received overall, latency(min, max, avg, 99%) = 20352, 20479, 20416.0, 20479 (ms)
1000 messages received in period, latency(min, max, avg, 99%) = 19840, 20095, 19968.3, 20095 (ms)
1001 messages received overall, latency(min, max, avg, 99%) = 19840, 20479, 19968.7, 20095 (ms)
...
1000 messages received in period, latency(min, max, avg, 99%) = 12032, 12159, 12119.4, 12159 (ms)
<998001 1000="" 12095="" 19583="" 999001="" messages="" received="" overall,="" latency(min,="" max,="" avg,="" 99%)="12032," 20479,="" 15073.9,="" (ms)="" in="" period,="" 12095,="" 12064.0,="" 15070.9,="" (ms)<="" pre="">
```

Note that there is a latency listed in the summaries for the message batches. This is because the consumer wasn't running when the messages were sent to MapR Event Store, and thus it is only getting them much later, long after they were sent.

## Monitoring your topics
At any time you can, use the maprcli tool to get some information about the topic. For example:

```bash
$ maprcli stream topic info -path /sample-stream -topic fast-messages -json
```

The `-json` option is used to get the topic information as a JSON document.

## Cleaning up
When you are done playing, you can delete the stream and all associated topics using the following command:

```bash
$ maprcli stream delete -path /sample-stream
```

## Conclusion
Using this example built from an Apache Kafka application, you have learned how to write, deploy, and run your first MapR Event Store application.
As you can see, the application code is really similar, and only a few changes need to be made (such as changing the topic names). This means it is possible to easily deploy your Kafka applications on MapR and reap the benefits of all the features of MapR Event Store, such as advanced security, geographically distributed deployment, very large number of topics, and much more. This also means that you can immediately use all of your Apache Kafka skills on a MapR deployment.