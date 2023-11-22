---
title: "Streaming Data Pipeline to Transform, Store and Explore Healthcare Dataset With Apache Kafka API, Apache Spark, Apache Drill, JSON and MapR Database"
date: 2021-01-14T05:59:02.445Z
author: Carol McDonald 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","apache-spark","data-scientist", "data-ml-engineer"]
authorimage: "/img/blogs/Avatar3.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019, may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
"authorDisplayName": "Carol McDonald",
"publish": "2018-02-27T12:00:00.000",
"tags": "use-cases"
```

---

In the past, big data was interacted with in batch on a once-a-day basis. Now data is dynamic and data driven businesses need instant results from continuously changing data. Data Pipelines, which combine real-time Stream processing with the collection, analysis and storage of large amounts of data, enable modern, real-time applications, analytics and reporting.

This post is based on a recent workshop I helped develop and deliver at a large health services and innovation company's analytics conference. This company is combining streaming data pipelines with data science on top of the MapR Data Platform to improve healthcare outcomes, improve access to appropriate care, better manage cost, and reduce fraud, waste and abuse.

In this post we will:

- Use Apache Spark streaming to consume [Medicare Open payments](https://www.cms.gov/openpayments/) data using the Apache Kafka API
- Transform the streaming data into JSON format and save to the MapR Database document database.
- Query the MapR Database JSON table with Apache Spark SQL, Apache Drill, and the Open JSON API (OJAI) and Java.

![Example Streamline Processing Pipeline](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/example-streamline-processing-pipeline-1610604239860.png)

## Example Use Case Data Set

Since 2013, [Open Payments](https://www.cms.gov/openpayments/) is a federal program that collects information about the payments drug and device companies make to physicians and teaching hospitals for things like travel, research, gifts, speaking fees, and meals.

![Facts About Open Payments Data](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/facts-about-open-payments-data-1610604259299.png)

A large Health payment dataset, JSON, Apache Spark, MapR Event Store, and MapR Database are an interesting combination for a health analytics workshop because:

- JSON is an open-standard and efficient format that is easy for computer languages to manipulate. Newer standards for exchanging healthcare information such as [FHIR](https://www.hl7.org/fhir/overview.html) are easier to implement because they use a modern suite of API technology, including JSON.
- [Apache Spark SQL, Dataframes, and Datasets](https://spark.apache.org/docs/latest/sql-programming-guide.html) make it easy to load, process, transform, and analyze JSON data. MapR Event Store is a distributed messaging system for streaming event data at scale. MapR Event Store integrates with Spark Streaming via the Kafka API.
- MapR Database, a high performance NoSQL database, supports JSON documents as a native data store. MapR Database makes it easy to store, query and build applications with JSON documents. The Spark connector makes it easy to build real-time or batch pipelines between your JSON data and MapR Database and leverage Spark within the pipeline.

![MapR Database table](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/mapr-db-table-1610604274960.png)

## How Do You Build a Data Pipeline that handles millions of events in Real Time at Scale?

A common data pipeline architecture pattern is event sourcing using an append only publish subscribe event stream such as MapR Event Streams (which provides a Kafka API). MapR Event Store Topics are logical collections of events, which organize events into categories and decouple producers from consumers, making it easy to add new producers and consumers. Topics are partitioned for throughput and scalability, producers are load balanced and consumer can be grouped to read in parallel. MapR Event Store can scale to very high throughput levels, easily delivering millions of messages per second using very modest hardware.

![Kafka API](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/kafka-api-1610604290555.png)

## Processing Streaming Data with Spark

Apache Spark Streaming is an extension of the core Spark API that enables continuous data stream processing. Data streams can be processed with Spark's core, SQL, GraphX, or machine learning APIs, and can be persisted to a file system, HDFS, MapR XD, MapR Database, HBase, or any data source offering a Hadoop OutputFormat or Spark connector. Stream processing of events is useful for filtering, transforming, creating counters and aggregations, correlating values, joining streams together, machine learning, and publishing to a different topic for pipelines.

MapR Event Streams integrates with Spark Streaming via the Kafka direct approach. The MapR Database OJAI Connector for Apache Spark enables you to use [MapR Database as a sink for Apache Spark Data Streams](https://docs.datafabric.hpe.com/62/Spark/SavingDStreamMapRDB.html).

![Application](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/application-1610604303183.png)

The incoming data is in CSV format, an example is shown below:

```markdown
"NEW","Covered Recipient Physician",,,,"132655","GREGG","D","ALZATE",,"8745 AERO DRIVE","STE 200","SAN DIEGO","CA","92123","United States",,,"Medical Doctor","Allopathic & Osteopathic Physicians|Radiology|Diagnostic Radiology","CA",,,,,"DFINE, Inc","100000000326","DFINE, Inc","CA","United States",90.87,"02/12/2016","1","In-kind items and services","Food and Beverage",,,,"No","No Third Party Payment",,,,,"No","346039438","No","Yes","Covered","Device","Radiology","StabiliT",,"Covered","Device","Radiology","STAR Tumor Ablation System",,,,,,,,,,,,,,,,,"2016","06/30/2017"
```

There are a lot of fields in this data that we will not use; we will parse the following fields:

![Parse Fields](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/parse-fields-1610604316662.png)

And transform them into the following JSON document for storing in MapR Database:

```json
{

    "_id" :"317150_08/26/2016_346122858",
    "physician_id" :"317150",
    "date_payment" :"08/26/2016",
    "record_id" :"346122858",
    "payer" :"Mission Pharmacal Company",
    "amount" :9.23,
    "Physician_Specialty" :"Obstetrics & Gynecology",
    "Nature_of_payment" :"Food and Beverage"
}
```

![Transform](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/transform-1610604333567.png)

Spark Kafka Consumer Producer Code

>Note: Code snippets are shown here. You can download the complete code and instructions from the GitHub link at the end of this post.

## Parsing the Data Set Records

A Scala Payment case class defines the schema corresponding to the CSV data that we are interested in. The parsePayment function parses a line of comma separated values into the Payment case class.

![Parsing the Data Set Records](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/parsing-data-set-records-1610604356991.png)

A PaymentwId class defines the JSON document schema for MapR Database.

In order to save the JSON objects to MapR Database, we need to define the\_id field, which is the row key and primary index for MapR Database. The parsePaymentwID function creates an object with the id equal to a combination of the physician id, the date, and the record id. Since MapR Database row keys are partitioned and sorted by row key when inserted, the payment documents will be grouped by physician and date in MapR Database. This will give really fast queries, aggregations and sorting by physician id and date. We will also look at secondary indexes later in this post.

![Parsing the Data Set Records](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/parsing-data-set-records-2-1610604371777.png)

### Spark Streaming Code

We use the KafkaUtils createDirectStream method with Kafka configuration parameters to create an input stream from a MapR Event Store topic. This creates a DStream that represents the stream of incoming data, where each message is a key value pair. We use the DStream map transformation to create a DStream with the message values, and then another map transformation with the parsePaymentwID function to create a DStream of PaymentwID objects.

![Spark Streaming Code](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/spark-streaming-code-1-1610604388626.png)

![Spark Streaming Code](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/spark-streaming-code-2-1610604403278.png)

The output of the paymentDStream.print(3) is shown below

![output of the paymentDStream.print(3)](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/output-paymentdstream-1610604421331.png)

For storing lots of streaming data, we need a data store that supports fast writes and scales. The MapR Database Spark Connector DStream saveToMapRDB method performs a parallel partitioned bulk insert of JSON PaymentwID objects into MapR Database:

![MapR Database Spark Connector DStream saveToMapRDB method](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/mapr-db-spark-connector-dstream-savetomaprdb-method-1610604444456.png)

![Save to MapR Database JSON](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/save-to-mapr-db-json-1610604463458.png)

### MapR Database

One of the challenges when you are processing lots of data is where do you want to store it? With MapR Database (HBase API or JSON API), a table is automatically partitioned into tablets across a cluster by key range, providing for scalable and fast reads and writes by row key.

![Scalable and Fast Reads and Writes by Row Key](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/scalable-fast-reads-writes-row-key-1610604478573.png)

The Spark MapR Database Connector leverages the Spark [DataSource API](https://databricks.com/blog/2015/01/09/spark-sql-data-sources-api-unified-data-access-for-the-spark-platform.html). The connector architecture has a connection object in every Spark Executor, allowing for distributed parallel writes, reads, or scans with MapR Database tablets.

![Connection in Every Spark Executor](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/connection-in-spark-executor-1610604492674.png)

## Querying MapR Database JSON with Spark SQL

The Spark MapR Database Connector enables users to perform complex SQL queries and updates on top of MapR Database using a Spark Dataset, while applying critical techniques such as Projection and filter pushdown, custom partitioning, and data locality.

 ![Querying Application](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/querying-application-1610604507438.png)

A Spark [Dataset](http://spark.apache.org/docs/latest/api/scala/index.html#org.apache.spark.sql.Dataset) is a distributed collection of data. Dataset is a newer interface, which provides the benefits of strong typing, the ability to use powerful lambda functions, efficient object serialization/deserialization , combined with the benefits of Spark SQL's optimized execution engine.

![Dataset](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/dataset-1610604520672.png)

A DataFrame is a Dataset organized into named columns Dataset\[Row\]. (In Spark 2.0, the DataFrame APIs merged with [Datasets](https://databricks.com/blog/2016/01/04/introducing-apache-spark-datasets.html) APIs.)

![Unified Apache Spark](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/unified-apache-spark-1610604532100.png)

### Loading data from MapR Database into a Spark Dataset

To [load data from a MapR Database JSON](https://docs.datafabric.hpe.com/62/Spark/LoadDataFromMapRDBasDataset.html) table into an Apache Spark Dataset, we first define the Scala class and [Spark StructType ](https://spark.apache.org/docs/latest/sql-programming-guide.html)matching the structure of the JSON objects in the MapR Database table.

![load data from a MapR Database JSON](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/load-data-from-mapr-db-json-1610604545905.png)

Next, we invoke the loadFromMapRDB method on a SparkSession object, providing the tableName , schema and case class. This will return a Dataset of PaymentwId objects:

![Dataset of PaymentwId objects](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/dataset-paymentwid-objects-1610604560801.png)

Explore and query the Payment data with Spark SQL

Datasets provide a domain-specific language for structured data manipulation in Scala, Java, and Python. Below are some examples in scala. The Dataset show() action displays the top 20 rows in a tabular form.

![20 rows in a tabular form](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/20-rows-tabular-form-1610604575925.png)

What are the top 5 nature of payments by count?

![What are the top 5 nature of payments by count](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/5-nature-payments-by-count-1610604589757.png)

What is the count of Payers with payment amounts > $1000?

![Payers with payment amounts > $1000](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/payments-greater-than-1000-1610604608196.png)

You can register a Dataset as a temporary table using a given name and then run Spark SQL. Here are some example Spark SQL queries on the payments dataset:

What are the top 5 physician specialties by amount with count?

![5 physician specialties by amount with count](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/5-physician-speicialties-1610604623826.png)

# Querying the Data with Apache Drill

Apache Drill is an open source, low-latency query engine for big data that delivers interactive SQL analytics at petabyte scale. Drill provides a massively parallel processing execution engine, built to perform distributed query processing across the various nodes in a cluster.

![Apache Drill](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/apache-drill-1610604648035.png)

With Drill, you can use SQL to interactively query and join data from files in JSON, Parquet, or CSV format, Hive, and NoSQL stores, including HBase, MapR Database, and Mongo, without defining schemas. MapR provides a [Drill JDBC](https://package.mapr.com/tools/MapR-JDBC/MapR_Drill/) driver that you can use to connect Java applications, BI tools, such as SquirreL and Spotfire, to Drill. Below is an snippit of Java code for querying MapR Database using Drill and JDBC:

![Java code for querying MapR Database using Drill and JDBC](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/java-code-querying-1610604663404.png)

Partial output for this query is shown below:

![Partial output for this query](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/partial-output-for-query-1610604688017.png)

Below are some examples SQL queries using the Drill shell.

What are the top 5 physicians by total amount?

![top 5 physicians by total amount](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/5-physicians-by-total-amount-1610604702767.png)

What are the distinct payers in the Payments table?

![distinct payers in the Payments table](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/distinct-payers-payments-table-1610604719490.png)

Follow the instructions in the github code README to [add a secondary index to MapR Database](https://docs.datafabric.hpe.com/62/Drill/optimizing_queries_with_indexes.html) and try more queries.

## Querying with the Open JSON API (OJAI)

Below is a Java example of using the [OJAI Query interface to query documents in a MapR Database JSON](https://docs.datafabric.hpe.com/62/MapR-DB/JSON_DB/QueryingWithOJAI.html) table:

![Java example](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/java-example-1610604732007.png)

Partial output for this query is shown below:

![Partial output](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/partial-output-1610604746301.png)

## Summary

In this blog post, you've learned how to consume streaming Open Payments CSV data, transform to JSON, store in a document database, and explore with SQL using Apache Spark, MapR Event Store MapR Database, OJAI, and Apache Drill.

**Code**

You can download the code and data to run these examples from [here](https://github.com/mapr-demos/mapr-es-db-spark-payment). Refer to the README for complete instructions to run the code. 

**Running the Code**

All of the components of the use case architecture we just discussed can run on the same cluster with the MapR Data Platform.

![MapR-CDP](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/mapr-cdp-1610604758846.png)

This example was developed using the [MapR 6.0 container for developers](https://docs.datafabric.hpe.com/62/MapRContainerDevelopers/MapRContainerDevelopersOverview.html), a docker container that enables you to create a single node MapR cluster. The container is lightweight and designed to run on your laptop. Refer to the code README [here](https://github.com/mapr-demos/mapr-es-db-spark-payment) for instructions on running the code.