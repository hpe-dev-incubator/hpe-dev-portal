---
title: "How to Use Secondary Indexes in Spark With Open JSON Application Interface (OJAI)"
date: 2021-02-05T05:25:49.558Z
author: Ranjit Lingaiah 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","apache-spark", "data-ml-engineer"]
authorimage: "/img/blogs/Avatar3.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019 may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
"authorDisplayName": ["Ranjit Lingaiah"],
"publish": "2019-02-12T07:00:00.000Z",
"tags": "apache-spark"
```

---

## Introduction

Starting with MapR 6.0, MapR Database supports secondary indexes on fields in JSON tables.  

Indexes provide flexibility to access data stored in MapR Database JSON. Secondary indexes provide efficient access to a wide range of queries on MapR Database JSON tables.

By default, there is only one index on `_id` column; if applications query any other column, it can result in a full table scan to extract data from the underlying JSON tables. Secondary indexes solve this limitation by reducing the number of documents that applications would have to read from large tables. These indexes can be used with OJAI API, MapR Database JSON REST API, or MapR Drill, but not from Spark.

In this blog post, we will look into how Spark can use OJAI API to leverage secondary indexes.

## How to Use Secondary Indexes in Spark?

OJAI is the API to interface with MapR Database JSON. Most applications build using OJAI for filtering and sorting, which leverages secondary indexes to improve query response times. Here we will see how we can use this API in Spark to leverage secondary indexes.

## Here are the steps:

1.  Create a JSON table (user-info) with some JSON documents. One of the fields from this table will be used to look up fields from another table. The sample program, below, ingests the data into the table.

```bash
// Create JSON table
$ maprcli table create -path /tmp/user-info -tabletype json

// After the data is ingested into the table
$ echo "find /tmp/user-info" | mapr dbshell
====================================================
*                  MapR Database Shell                   *
* NOTE: This is a shell for JSON table operations. *
====================================================
Version: 6.0.1-mapr

MapR Database Shell
maprdb mapr:> find /tmp/user-info
{"_id":"101","address":{"Pin":{"$numberLong":95985},"city":"sunnyvale","street":"35 town way"},"dob":{"$dateDay":"1987-05-04"},"interests":["squash","comics","movies"]}
{"_id":"102","address":{"Pin":{"$numberLong":95652},"city":"san jose","street":"305 city way"},"dob":{"$dateDay":"1976-01-09"},"interests":["cricket","sketching"]}
2 document(s) found.
```

2.  Create another JSON table (data-table) with JSON documents, with one of the fields (uid) in this table matching the field in the table created in step #1, and ingest sample data.

```bash
// Create JSON table
$ maprcli table create -path /tmp/data-table -tabletype json

//Sample data for querying
$ cat data-type.json
{"_id":"1","uid":"101","first_name":"tom"}
{"_id":"2","uid":"102","first_name":"john"}
{"_id":"3","uid":"103","first_name":"sam"}
{"_id":"4","uid":"104","first_name":"thomas"}
{"_id":"5","uid":"105","first_name":"david"}
{"_id":"6","uid":"106","first_name":"robert"}
{"_id":"7","uid":"107","first_name":"william"}
{"_id":"8","uid":"108","first_name":"michael"}
{"_id":"9","uid":"109","first_name":"bill"}
{"_id":"10","uid":"110","first_name":"jarred"}

// Put the sample data in hdfs
$ hadoop fs -put data-table.json /tmp

// Ingest the sample data into the JSON table
$ mapr importJSON -idfield '_id' -mapreduce true -src /tmp/data-table.json -dst /tmp/data-table
```

3.  Create a secondary index on data-table field uid.

```bash
$ maprcli table index add -path /tmp/data-table -index uid_idx -indexedfields uid
```

4.  [Enable log tracing](https://docs.datafabric.hpe.com/60/MapR-DB/Indexes/ExaminingOJAIQueryPlan.html) by setting the property "log4j.logger.com.mapr.ojai.store.impl=TRACE, stdout" in `log4j.properties`, located in `/opt/mapr/conf` directory. This step is optional; it is used to see if the OJAI query plan used the secondary index.  This is not recommended for production clusters, as it will generate lot of log data.

5.  The complete sample program is listed below. In this sample program, the `getDocuments()` method invokes the OJAI API to leverage the secondary index and returns an RDD.

```scala
/* Copyright (c) 2009 & onwards. MapR Tech, Inc., All rights reserved */

package com.mapr.demo.spark.ojai.secondaryindex

import com.fasterxml.jackson.annotation.{JsonIgnoreProperties, JsonProperty}
import com.mapr.db.spark.impl.OJAIDocument
import org.apache.spark.{SparkConf, SparkContext}
import org.apache.spark.sql.SparkSession
import org.ojai.types.ODate
import com.mapr.db.spark.{field, _}
import org.ojai.store.DriverManager
import scala.collection.mutable.ListBuffer

object SparkOjaiApplication {

  val userInfo = "/tmp/user-info"
  val dataTable = "/tmp/data-table"

  def main(args: Array[String]): Unit = {
    val spark = SparkSession.builder.appName("Spark-OJAI Secondary Index Application").master("local[*]").getOrCreate()
    val allUsers = spark.sparkContext.parallelize(getUsers())
    val sc = spark.sparkContext

    //Save users to JSON table
    allUsers.saveToMapRDB(userInfo, createTable = false
    )

    //Load all the people from the JSON table
    val allUsersInfo = sc.loadFromMapRDB(userInfo)

    //Extract JSON documents using secondary index
    val documentsRDD = allUsersInfo.mapPartitions(getDocuments)

    // print a few documents
    documentsRDD.take(3).foreach(println(_))

    System.out.println("Number of documents extracted:" + documentsRDD.count())
  }

  //Invokes OJAI api to query JSON documents using seconary index.
  def getDocuments(iterator: Iterator[OJAIDocument]): Iterator[String] = {
    val connection = DriverManager.getConnection("ojai:mapr:")
    val store = connection.getStore(dataTable)
    val dm  = ListBuffer[String]()

    iterator.foreach(r => {
      val qs = "{\"$eq\": {\"uid\":\"%s\"}}".format(r.getDoc.getId.getString)
      System.out.println("Finding  documents for qs:" + qs);
      val  query = connection.newQuery().select("_id")
        //This option is not required. OJAI client makes the determination to use secondary index.
        // Since the sample data set is small, I'm enabling this option to use secondary index.
        .setOption(com.mapr.ojai.store.impl.OjaiOptions.OPTION_USE_INDEX, "uid_idx")
        .where(qs).build()
      val iterator = store.find(query).iterator()
      if (iterator.hasNext) {
        dm += iterator.next().asJsonString()
      }
    })

    //Close the Document Store
    store.close()

    //Close the OJAI connection
    connection.close()

    dm.toIterator
  }

  // User documents. The _id field of users is used to query  the user in the data-table.
  def getUsers(): Array[Person] = {
    val users: Array[Person] = Array(
      Person("101", ODate.parse("1976-1-9"), Seq("cricket", "sketching"), Map("city" -> "san jose", "street" -> "305 city way", "Pin" -> 95652)),
      Person("102", ODate.parse("1987-5-4"), Seq("squash", "comics", "movies"), Map("city" -> "sunnyvale", "street" -> "35 town way", "Pin" -> 95985))
    )
    users
  }
}

@JsonIgnoreProperties(ignoreUnknown = true)
case class Person (@JsonProperty("_id") id: String, @JsonProperty("dob") dob: ODate,
                   @JsonProperty("interests") interests: Seq[String], @JsonProperty("address") address: Map[String, Any])
```

6.  To build the sample program, clone the Git repo and use Maven to build the program.

```bash
$ git clone https://github.com/ranjitreddy2013/spark-using-ojai-secondary-index-example
$ cd spark-using-ojai-secondary-index-example
$ mvn clean install
```

7.  To run, copy spark-ojai-secondaryindex-1.0-SNAPSHOT.jar from target folder to an edge node or cluster node and submit to the cluster using `spark-submit`.

```bash
/opt/mapr/spark/spark-2.2.1/bin/spark-submit --class com.mapr.demo.spark.ojai.secondaryindex.SparkOjaiApplication --master yarn --deploy-mode client --driver-java-options "-Dlog4j.configuration=file:///opt/mapr/conf/log4j.properties" --conf "spark.yarn.executor.memoryOverhead=1G"  --executor-memory 2G --num-executors 1 --executor-cores 1 /home/mapr/spark-ojai-secondaryindex-1.0-SNAPSHOT.jar
```

8.  The sample output is shown below. In addition to this output, there will be DEBUG and TRACE logs.

```scala
Finding  documents for qs:{"$eq": {"uid":"101"}}
Finding  documents for qs:{"$eq": {"uid":"102"}}
{"_id":"1","first_name":"tom","uid":"101"}
{"_id":"2","first_name":"john","uid":"102"}

Number of documents extracted:2
```

9.  Verify the logs if the secondary index is used by the OJAI query plan. Note the `indexName` used by the OJAI query plan.

```bash
2019-01-11 10:49:35,876 TRACE com.mapr.ojai.store.impl.OjaiDocumentStore logQueryPlan Executor task launch worker for task 204: Ojai Query Plan: '[{"streamName":"DBDocumentStream","parameters":{"queryConditionPath":true,"indexName":"uid_idx","projectionPath":["_id"],"primaryTable":"/tmp/data-table"}},{"streamName":"RowkeyLookup","parameters":{"condition":"(uid = "88d800cf-39c9-482f-856c-486090c3de2c")","primaryTable":"/tmp/data-table"}}]'

2019-01-28 12:04:33,087 TRACE com.mapr.ojai.store.impl.OjaiDocumentStore logQueryPlan Executor task launch worker for task 201: Ojai Query Plan: '[{"streamName":"DBDocumentStream","parameters":{"queryConditionPath":true,"indexName":"uid_idx","projectionPath":["_id"],"primaryTable":"/tmp/data-table"}}]'
```

## Conclusion:

In this blog post, you learned how to use OJAI secondary indexes from Spark.

## Additional Resources:

*   [Developing OJAI Applications](https://docs.datafabric.hpe.com/61/MapR-DB/JSON_DB/getting_started_json_ojai_build_java_app.html)
*   [Determining Secondary Index Usage](https://docs.datafabric.hpe.com/60/MapR-DB/Indexes/DeterminingSIUsage.html)
*   [Adding Secondary Indexes on JSON Tables](https://docs.datafabric.hpe.com/60/MapR-DB/Indexes/admin-adding-indexes.html)
