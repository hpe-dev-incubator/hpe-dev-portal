---
title: "Fast data processing pipeline for predicting flight delays using Apache
  APIs: Kafka, Spark Streaming and Machine Learning (part 3)"
date: 2021-10-11T21:12:59.805Z
author: Carol McDonald
authorimage: /img/Avatar1.svg
tags:
  - hpe-ezmeral-data-fabric
  - hpe-ezmeral
  - MapR
---
```bash
"authorDisplayName": "Carol McDonald",
"tags": "use-cases",
"publish": "2018-02-08T12:00:00.000Z"
```

**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019 may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit <https://www.hpe.com/us/en/software/data-fabric.html>

**Editor's Note:** This is a 3-part Series, see the previously published posts below:

* [Part 1 - Spark Machine Learning](https://developer.hpe.com/blog/fast-data-processing-pipeline-for-predicting-flight-delays-using-apache-/)
* [Part 2 - Kafka and Spark Streaming](https://developer.hpe.com/blog/fast-data-processing-pipeline-for-predicting-flight-delays-using-apache-apis-kafka-spark-streaming-and-machine-learning-part-2/)

According to Bob Renner, previous CEO of Liaison Technologies, the possibility to blend machine learning with real-time transactional data flowing through a single platform is opening a world of new possibilities, such as enabling organizations to take advantage of opportunities as they arise. According to [Gartner](https://www.gartner.com/newsroom/id/3812063) over the next few years, virtually every app, application and service will incorporate some level of machine learning. Leveraging these opportunities requires fast and scalable data processing pipelines.

<center><img alt="MapR Platform" src="/img/mapr-platform.png" width="700"></center>

This is the third in a series of blog posts, that discuss the architecture of a data pipeline that combines streaming data with machine learning and fast storage. [The first post](https://developer.hpe.com/blog/fast-data-processing-pipeline-for-predicting-flight-delays-using-apache-/) discussed creating a machine learning model to predict flight delays. The [second post](https://developer.hpe.com/blog/fast-data-processing-pipeline-for-predicting-flight-delays-using-apache-apis-kafka-spark-streaming-and-machine-learning-part-2/) discussed using the saved model with streaming data to do a real-time analysis of flight delays. This third post will discuss fast storage and analysis with MapR Database, Apache Spark, Apache Drill and OJAI.

**Machine Learning Logistics and Data Pipelines**

Machine Learning usually refers to the model training piece of an ML workflow. But, as data fabric expert Ted Dunning says, 90% of the effort around Machine Learning is data logistics which includes all of the aspects that occur before and after this training.  When you combine event streams with microservices, you can greatly enhance the agility with which you build, deploy, and maintain complex data pipelines. Pipelines are constructed by chaining together microservices, each of which listens for the arrival of some data, performs its designated task, and optionally publishes its own messages to another topic.  Combining event-driven data pipelines with machine learning can handle the logistics of machine learning in a flexible way by:

* Making input and output data available to independent consumers
* Managing and evaluating multiple models and easily deploying new models
* Monitoring and analyzing models, with historical and real-time data.

<center><img alt="MapR Architectures" src="/img/mapr-architectures.png" width="700"></center>

Architectures for these types of applications are discussed in more detail in the eBooks: [Machine Learning Logistics](https://www.oreilly.com/library/view/machine-learning-logistics/9781491997628/), [Streaming Architecture](https://www.oreilly.com/library/view/streaming-architecture/9781491953914/), and [Microservices and Containers](https://www.academia.edu/41522528/A_Practical_Guide_to_Microservices_and_Containers_Mastering_the_Cloud_Data_and_Digital_Transformation).

The following figure depicts the (simplified) data pipeline for this tutorial:

* Flight trip data is published to a MapR Event Streams (ES) topic using the Kafka API. (Note this data contains the actual delay label. In the real-world architecture, the actual delay label would come later in a different topic, but to keep the tutorial code simple it is combined with the input data).
* A Spark Streaming application subscribed to the first topic enriches the event with the flight predictions and publishes the results in JSON format to another topic. ( In the real-world architecture, there would be multiple consumers publishing model predictions, but to keep the tutorial code simple there is only one here).
* A Spark Streaming application subscribed to the second topic stores the flight trip data and predictions in MapR Database using the Spark MapR Database Connector.
* Apache Spark SQL, Apache Drill SQL, and Open JSON applications query MapR Database to analyze flight data and prediction performance.

<center><img alt="MapR Database" src="/img/mapr-db.png" width="700"></center>

**How to Store the Data**

One of the challenges, when you are processing lots of streaming data, is where do you want to store it? With a relational database and a normalized schema, related data is stored in different tables. Queries joining this data together can cause bottlenecks with lots of data. For this application, [MapR Database JSON](https://docs.datafabric.hpe.com/62/MapR-DB/developing_client_applications_for_mapr_db.html), a high-performance NoSQL database, was chosen for its scalability and flexible ease of use with JSON. MapR Database and a denormalized schema scale, because data that is read together is stored together.

<center><img alt="Storage Model" src="/img/storage-model.png" width="700"></center>

With MapR Database (HBase API or JSON API), a table is automatically partitioned into tablets across a cluster by key range, providing for scalable and fast reads and writes by row key.

<center><img alt="MapR Database Connector" src="/img/mapr-db-connector.png" width="700"></center>

The Spark MapR Database Connector leverages the Spark [DataSource API](https://databricks.com/blog/2015/01/09/spark-sql-data-sources-api-unified-data-access-for-the-spark-platform.html). The connector architecture has a connection object in every Spark Executor, allowing for distributed parallel writes, reads, or scans with MapR Database tablets.

<center><img alt="Spark Executor" src="/img/spark-executor.png" width="700"></center>

**JSON Schema Flexibility**

MapR Database supports JSON documents as a native data store. MapR Database makes it easy to store, query and build applications with JSON documents.  The Spark connector makes it easy to build real-time or batch pipelines between your JSON data and MapR Database and leverage Spark within the pipeline.

<center><img alt="JSON Schema Flexibility" src="/img/json-schema-flexibility.png" width="700"></center>

JSON facilitates the natural evolution of your data schema during the life of your application. For example, suppose at first we have the following schema, where each JSON message has the predicted flight delay using a decision tree:

```json
{
    "_id": "UA_2017-03-28_DEN_SFO_721",
    "dofW": 2,
    "carrier": "UA",
    "origin": "DEN",
    "dest": "SFO",
    "crsdephour": 11,
    "crsdeptime": 1120.0,
    "crsarrtime": 1308.0,
    "crselapsedtime": 168.0,
    "pred_dtree": 1.0
}
```

Later, you can easily capture more prediction data values quickly without changing the architecture of your application and without updating a database schema, by adding attributes. In the example below, we have added predictions for other machine learning models. These can be added dynamically to the same document instance in MapR Database without any database schema changes:

```json
{
    "_id": "UA_2017-03-28_DEN_SFO_721",
    "dofW": 2,
    "carrier": "UA",
    "origin": "DEN",
    "dest": "SFO",
    "crsdephour": 11,
    "crsdeptime": 1120.0,
    "crsarrtime": 1308.0,
    "crselapsedtime": 168.0,
    "pred_dtree": 1.0,
    "pred_randforest": 1.0,
    "pred_svm": 1.0,
    "actual_delay": 1.0


}
```

MapR Event Store allows processing of the same messages by different consumers. This makes it easy to add different consumers for the same message. With this type of architecture and flexible schema, you can easily add and deploy new microservices with new machine learning models.

**Spark Streaming writing to MapR Database**

The MapR Database OJAI Connector for Apache Spark enables you to use [MapR Database as a sink for Apache Spark Data Streams](https://docs.datafabric.hpe.com/62/Spark/SavingDStreamMapRDB.html).

<center><img alt="Spark Streaming writing to MapR Database" src="/img/spark-streaming-writing-to-mapr-db.png" width="700"></center>

You can read about the MapR Event Streams Spark Streaming code in [part 2 of this series](https://developer.hpe.com/blog/fast-data-processing-pipeline-for-predicting-flight-delays-using-apache-apis-kafka-spark-streaming-and-machine-learning-part-2/); here, we will focus on Spark streaming writing to MapR Database. The messages from the MapR Database topic are in JSON format and contain the following for each flight: the flight id, day of the week, carrier, origin, destination, scheduled departure hour, scheduled departure time, scheduled arrival time, scheduled travel time, delay prediction, and actual delay label (Note in the real-world architecture, the actual delay label would come later in a different topic, but to keep the tutorial code simple, it is combined here). An example is shown below:

```json
{
    "_id": "UA_2017-03-28_DEN_SFO_721",
    "dofW": 2,
    "carrier": "UA",
    "origin": "DEN",
    "dest": "SFO",
    "crsdephour": 11,
    "crsdeptime": 1120.0,
    "crsarrtime": 1308.0,
    "crselapsedtime": 168.0,
    "label": 0.0,
    "pred_dtree": 1.0
}
```

Below, we use a Scala case class and [Structype](https://spark.apache.org/docs/latest/sql-programming-guide.html#programmatically-specifying-the-schema) to define the schema, corresponding to the input data.

<center><img alt="Scala case class 1" src="/img/scala-case-class.png" width="500"></center>

<center><img alt="Scala case class 2" src="/img/scala-case-class-2.png" width="500"></center>

We use the KafkaUtils createDirectStream method with Kafka configuration parameters to create an input stream from a MapR Event Store topic. This creates a DStream that represents the stream of incoming data, where each message is a key value pair. We use the DStream map transformation to create a DStream with the message values.

<center><img alt="KafkaUtils createDirectStream method" src="/img/kafkautils-createdirectstream-method.png" width="700"></center>

<center><img alt="DStream" src="/img/dstream.png" width="700"></center>

In the code below, each RDD in the valuesDStream is transformed into a Spark Dataset. Then, the MapR Database Spark Connector DStream saveToMapRDB method performs a parallel partitioned bulk insert of JSON FlightwPred objects into MapR Database.

<center><img alt="RDD in the valuesDStream" src="/img/rdd-in-valuesdstream.png" width="700"></center>

<center><img alt="Save DStream to MapR Database JSON" src="/img/save-dsstream-mapr-db-json.png" width="700"></center>

**Querying MapR Database JSON with Spark SQL**

The Spark MapR Database Connector enables users to perform complex SQL queries and updates on top of MapR Database using a Spark Dataset, while applying critical techniques such as Projection and filter pushdown, custom partitioning, and data locality.

<center><img alt="Application" src="/img/application.png" width="700"></center>

A Spark Dataset is a distributed collection of data. Dataset is a newer interface, which provides the benefits of strong typing, the ability to use powerful lambda functions, efficient object serialization/deserialization, combined with the benefits of Spark SQL's optimized execution engine.

<center><img alt="Spark Dataset" src="/img/spark-dataset.png" width="700"></center>

A DataFrame is a Dataset organized into named columns Dataset\[Row]. (In Spark 2.0, the DataFrame APIs merged with Datasets APIs.)

<center><img alt="Unified Apache Spark 2.0 API" src="/img/unified-apache-spark.png" width="500"></center>

**Loading data from MapR Database into a Spark Dataset**

To [load data from a MapR Database JSON](https://docs.datafabric.hpe.com/62/Spark/LoadDataFromMapRDBasDataset.html) table into an Apache Spark Dataset, we invoke the loadFromMapRDB method on a SparkSession object, providing the tableName, schema and case class. This will return a Dataset of FlightwPred objects:

<center><img alt="load data from a MapR Database JSON" src="/img/load-data-from-mapr-db-json.png" width="700"></center>

**Explore and query the Flight data with Spark SQL**

Datasets provide a domain-specific language for structured data manipulation in Scala, Java, and Python. Below are some examples in scala. The Dataset show() action displays the top 20 rows in a tabular form.

<center><img alt="top 20 rows in a tabular form" src="/img/top-20-rows-tabular-form.png" width="700"></center>

In the code below, a filter is used to count the predicted delays, actual delays and total. This is then used to calculate the ratio wrong, correct, false positive. These type of calculations would be useful for continued analysis of models in production.

<center><img alt="delays, actual delays and total" src="/img/filter-count-predicted-delays.png" width="700"></center>

The output is shown below.

<center><img alt="Output of predicted delays, actual delays and total" src="/img/delays-actual-delays-total-output.png" width="500"></center>

**What is the count of predicted delay/notdelay for this dstream dataset?**

<center><img alt="What is the count of predicted delay/notdelay for this dstream dataset?" src="/img/count-predicted-dstream-dataset.png" width="700"></center>

You can register a Dataset as a temporary table using a given name, and then run Spark SQL. Here are some example Spark SQL queries on the Dataset of FlightwPred objects:

**What is the count of predicted delay/notdelay by day of the week?**

```scala
scala> spark.sql("select dofW, pred_dtree, count(pred_dtree) from flight group by dofW, pred_dtree order by dofW").show
```

<center><img alt="Spark SQL queries on the Dataset of FlightwPred objects" src="/img/queries-dataset-flightwpred-objects.png" width="500"></center>

**What is the count of predicted delay/notdelay by destination?**

```scala
scala> spark.sql("select dest, pred_dtree, count(pred_dtree) from flight group by dest, pred_dtree order by dest").show
```

<center><img alt="Delay/NotDelay destination" src="/img/delay-notdelay-destination.png" width="500"></center>

(The complete code, instructions and more example queries are in the github code link at the end.)

**Querying the Data with Apache Drill**

Apache Drill is an open source, low-latency query engine for big data that delivers interactive SQL analytics at petabyte scale. Drill provides a massively parallel processing execution engine, built to perform distributed query processing across the various nodes in a cluster.

<center><img alt="Querying the Data with Apache Drill" src="/img/querying-data-with-apache-drill.png" width="700"></center>

With Drill, you can use SQL to interactively query and join data from files in JSON, Parquet, or CSV format, Hive, and NoSQL stores, including HBase, MapR Database, and Mongo, without defining schemas. MapR provides a [Drill JDBC](https://package.mapr.com/tools/MapR-JDBC/MapR_Drill/) driver that you can use to connect Java applications, BI tools, such as SquirreL and Spotfire, to Drill. Below is a snippit of Java code for querying MapR Database using Drill and JDBC:

<center><img alt="querying MapR Database using Drill and JDBC" src="/img/querying-mapr-db-using-drill-jdbc.png" width="700"></center>

The output for this query **"What is the count of predicted delay/notdelay by origin?"** is shown below:

<center><img alt="output of predicted delay/notdelay by origin" src="/img/output-delay-notdelay-origin.png" width="500"></center>

Below are some example SQL queries using the Drill shell.

**What is the count of predicted delay/notdelay by origin**

<center><img alt="count of predicted delay/notdelay by origin" src="/img/count-predicted-delay-notdelay-origin.png" width="700"></center>

**What is the count of predicted delay/notdelay by origin and dest?**

<center><img alt="What is the count of predicted delay/notdelay by origin and dest?" src="/img/count-predicted-delay-notdelay-origin-dest.png" width="700"></center>


Follow the instructions in the github code README to [add a secondary index to MapR Database](https://docs.datafabric.hpe.com/62/Drill/optimizing_queries_with_indexes.html) and try more queries using the index.

**Querying with the Open JSON API (OJAI)**

Below is a Java example of using the OJAI Query interface to query documents in a MapR Database JSON table:

<center><img alt="OJAI Query interface to query documents in a MapR Database JSON" src="/img/ojai-query-interface-mapr-db.png" width="700"></center>

Partial output for this query to "find predicted late flights for AA" is shown below:

<center><img alt="find predicted late flights for AA" src="/img/find-predicted-late-flights-aa.png" width="700"></center>

Below are some example OJAI queries using the MapR Database shell.

**What are the SFO to DEN flights that were predicted late ?**

```json
maprdb> find /apps/flights -where '{"$and":[{"$eq":{"pred_dtree":1.0}},{ "$like" : {"_id":"%SFO_DEN%"} }]}' --f _id,pred_dtree
```

<center><img alt="MapR Database find /apps/flights" src="/img/mapr-db-find.png" width="500"></center>

**Summary**

In this blog post, you've learned how to consume streaming JSON events, store in a document database, and explore with SQL using Apache Spark, Apache Kafka API, Apache Drill, MapR Event Store, MapR Database, and OJAI.

**Code**

You can download the code and data to run these examples from here (refer to the README for complete instructions to run): https://github.com/mapr-demos/mapr-es-db-60-spark-flight

**Running the Code**

All of the components of the use case architecture we just discussed can run on the same cluster with the MapR Data Platform. The MapR Data Platform integrates global event streaming, real-time database capabilities, and scalable enterprise storage with a collection of data processing and analytical engines to power data processing pipelines and intelligent applications.

<center><img alt="MapR Data Platformm" src="/img/mapr-cdp.png" width="700"></center>

This example was developed using the [MapR 6.0 container for developers](https://docs.datafabric.hpe.com/62/MapRContainerDevelopers/MapRContainerDevelopersOverview.html), a docker container that enables you to create a single node MapR cluster. The container is lightweight and designed to run on your laptop. (refer to the code README for instructions on running the code).

You can also look at the following examples:

* [MapR Database 60-getting-started](https://github.com/mapr-demos/mapr-db-60-getting-started) to discover how to use DB Shell, Drill and OJAI to query and update documents, but also how to use indexes.
* [MapR Event Store getting started on MapR 6.0 developer container](https://github.com/mapr-demos/mapr-streams-60-getting-started)
* [Ojai 2.0 Examples](https://github.com/mapr-demos/ojai-2-examples) to learn more about OJAI 2.0 features
* [MapR Database Change Data Capture](https://github.com/mapr-demos/mapr-db-cdc-sample) to capture database events such as insert, update, delete and react to these events.

**WANT TO LEARN MORE?**

* [Free On-Demand Training](https://learn.ezmeral.software.hpe.com/)
* [MapR Database Rowkey Design](https://docs.datafabric.hpe.com/62/MapR-DB/designing_row_keys.html?hl=designing%2Crow%2Ckeys%2Cmapr-db)
* [MapR Database OJAI Connector for Apache Spark](https://docs.datafabric.hpe.com/62/Spark/NativeSparkConnectorJSON.html)
* [MapR Database shell](https://docs.datafabric.hpe.com/62/ReferenceGuide/mapr_dbshell.html)
* [Integrate Spark with MapR Event Store Documentation](https://docs.datafabric.hpe.com/62/Spark/Spark_IntegrateMapRStreams.html)
* [Apache Drill Tutorial](https://docs.datafabric.hpe.com/62/home/r_home_intro.html?origin=/display/MapR/Drill+Tutorial)
* [MapR Database secondary indexes](https://docs.datafabric.hpe.com/62/MapR-DB/Indexes/Indexes.html)
* [MapR Container for Developers](https://docs.datafabric.hpe.com/62/MapRContainerDevelopers/MapRContainerDevelopersOverview.html)
* [Apache Spark Streaming programming guide](http://spark.apache.org/docs/latest/streaming-programming-guide.html)
* [Spark SQL programming Guide](http://spark.apache.org/docs/latest/sql-programming-guide.html)