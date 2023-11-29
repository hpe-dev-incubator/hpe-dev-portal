---
title: "Spark Streaming with HBase"
date: 2021-02-19T07:00:12.189Z
author: Carol McDonald 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","apache-spark"]
authorimage: "/img/blogs/Avatar5.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019 may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
"authorDisplayName": "Carol McDonald",
"publish": "2015-09-04T07:00:00.000Z",
"tags": "nosql"
```

---

This post will help you get started using <a target='\_blank'  href='http://spark.apache.org/streaming/'>Apache Spark Streaming</a> with HBase on MapR. Spark Streaming is an extension of the core Spark API that enables continuous data stream processing.

## What is Spark Streaming?

First of all, what is streaming? A data stream is an unbounded sequence of data arriving continuously. Streaming divides continuously flowing input data into discrete units for processing. Stream processing is low latency processing and the analysis of streaming data. Spark Streaming is an extension of the core Spark API that enables scalable, high-throughput, fault-tolerant stream processing of live data. Spark Streaming is for use cases that require a significant amount of data to be quickly processed as soon as it arrives. Example real-time use cases are:

*   Website monitoring
*   Network monitoring
*   Fraud detection
*   Web clicks
*   Advertising
*   IoT sensors

Spark Streaming supports data sources such as HDFS directories, TCP sockets, Kafka, Flume, Twitter, etc. Data Streams can be processed with Spark’s core APIS, DataFrames SQL, or machine learning APIs, and can be persisted to a filesystem, HDFS, databases, or any data source offering a Hadoop OutputFormat.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/sparkstream1-blog-1613718331029.png)

## How Spark Streaming Works

Streaming data is continuous and needs to be batched to process. Spark Streaming divides the data stream into batches of _x_ seconds called Dstreams, which internally is a sequence of RDDs. Your Spark Application processes the RDDs using Spark APIs, and the processed results of the RDD operations are returned in batches.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/sparkstream2-blog-1613718342309.png)

## The Streaming Application Example Architecture

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/sparkstream3-blog-1613718349956.png)

The Spark Streaming example code does the following:

*   Reads streaming data
*   Processes the streaming data
*   Writes the processed data to an HBase Table

Other Spark example code does the following:

*   Reads HBase Table data written by the streaming code
*   Calculates daily summary statistics
*   Writes summary statistics to the HBase table Column Family stats

## Example data set

The Oil Pump Sensor data comes in as comma separated value (csv) files dropped in a directory. Spark Streaming will monitor the directory and process any files created in that directory. (As stated before, Spark Streaming supports different streaming data sources. For simplicity, this example will use files.) Below is an example of the csv file with some sample data:

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/sparkstream4-blog-1613718358120.png)

We use a Scala case class to define the Sensor Schema corresponding to the sensor data csv files, and a parseSensor function to parse the comma separated values into the sensor case class.

```scala
// schema for sensor data
case class Sensor(resid: String, date: String, time: String, hz: Double, disp: Double, flo: Double,
          sedPPM: Double, psi: Double, chlPPM: Double)

object Sensor {
   // function to parse line of csv data into Sensor class
   def parseSensor(str: String): Sensor = {
       val p = str.split(",")
        Sensor(p(0), p(1), p(2), p(3).toDouble, p(4).toDouble, p(5).toDouble, p(6).toDouble,
            p(7).toDouble, p(8).toDouble)
  }
…
}

```

## HBase Table Schema

The HBase Table Schema for the streaming data is as follows:

*   Composite row key of the pump name date and time stamp

The Schema for the daily statistics summary rollups is as follows:

*   Composite row key of the pump name and date
*   Column Family stats
*   Columns for min, max, avg.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/sparkstream5-blog-1613718366157.png)

The function below converts a sensor object into an HBase Put object, which is used to insert a row into HBase.

```scala
val cfDataBytes = Bytes.toBytes("data")

object Sensor {
. . .
  //  Convert a row of sensor object data to an HBase put object
  def convertToPut(sensor: Sensor): (ImmutableBytesWritable, Put) = {
      val dateTime = sensor.date + " " + sensor.time
      // create a composite row key: sensorid_date time
      val rowkey = sensor.resid + "_" + dateTime
      val put = new Put(Bytes.toBytes(rowkey))
      // add to column family data, column  data values to put object
      put.add(cfDataBytes, Bytes.toBytes("hz"), Bytes.toBytes(sensor.hz))
      put.add(cfDataBytes, Bytes.toBytes("disp"), Bytes.toBytes(sensor.disp))
      put.add(cfDataBytes, Bytes.toBytes("flo"), Bytes.toBytes(sensor.flo))
      put.add(cfDataBytes, Bytes.toBytes("sedPPM"), Bytes.toBytes(sensor.sedPPM))
      put.add(cfDataBytes, Bytes.toBytes("psi"), Bytes.toBytes(sensor.psi))
      put.add(cfDataBytes, Bytes.toBytes("chlPPM"), Bytes.toBytes(sensor.chlPPM))
      return (new ImmutableBytesWritable(Bytes.toBytes(rowkey)), put)
  }
}

```

## Configuration for Writing to an HBase Table

You can use the <a target='\_blank'  href='https://hbase.apache.org/apidocs/org/apache/hadoop/hbase/mapreduce/TableOutputFormat.html'>TableOutputFormat</a> class with Spark to write to an HBase table, similar to how you would write to an HBase table from MapReduce. Below, we set up the configuration for writing to HBase using the `TableOutputFormat` class.

```scala
   val tableName = "sensor"

   // set up Hadoop HBase configuration using TableOutputFormat
    val conf = HBaseConfiguration.create()
    conf.set(**TableOutputFormat.OUTPUT_TABLE**, tableName)
    val jobConfig: jobConfig = new JobConf(conf, this.getClass)
    jobConfig.setOutputFormat(classOf[**TableOutputFormat**])
    jobConfig.set(**TableOutputFormat**.OUTPUT_TABLE, tableName)

```

## The Spark Streaming Example Code

These are the basic steps for Spark Streaming code:

1.  Initialize a Spark StreamingContext object.
2.  Apply transformations and output operations to DStreams.
3.  Start receiving data and processing it using `streamingContext.start()`.
4.  Wait for the processing to be stopped using `streamingContext.awaitTermination()`.

We will go through each of these steps with the example application code.

## Initializing the StreamingContext

First we create a <a target='\_blank'  href='http://spark.apache.org/docs/latest/api/scala/index.html#org.apache.spark.streaming.StreamingContext'>StreamingContext</a>, the main entry point for streaming functionality, with a 2 second <a target='\_blank'  href='http://spark.apache.org/docs/latest/streaming-programming-guide.html#setting-the-right-batch-interval'>batch interval</a>. (In the code boxes, comments are in grey)

```scala
val sparkConf = new SparkConf().setAppName("HBaseStream")

//  create a StreamingContext, the main entry point for all streaming functionality
val ssc = new StreamingContext(sparkConf, Seconds(2))

```

Next, we use the `StreamingContext textFileStream(directory)` method to create an input stream that monitors a Hadoop-compatible file system for new files and processes any files created in that directory.

```scala
// create a DStream that represents streaming data from a directory source
val linesDStream = ssc.textFileStream("/user/user01/stream")

```

The linesDStream represents the stream of data, each record is a line of text. Internally a DStream is a sequence of RDDs, one RDD per batch interval.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/sparkstream6-blog-1613718375057.png)

## Apply Transformations and Output Operations to DStreams

Next, we parse the lines of data into Sensor objects, with the map operation on the linesDStream.

```scala
// parse each line of data in linesDStream  into sensor objects

val sensorDStream = linesDStream.map(Sensor.parseSensor)

```

The map operation applies the `Sensor.parseSensor` function on the RDDs in the linesDStream, resulting in RDDs of Sensor objects.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/sparkstream7-blog-1613718382720.png)

Next, we use the DStream <a target='\_blank'  href='https://spark.apache.org/docs/1.0.0/api/java/org/apache/spark/streaming/dstream/DStream.html'>foreachRDD</a> method to apply processing to each RDD in this DStream. We filter the sensor objects for low psi to create alerts, then we write the sensor and alert data to HBase by converting them to Put objects, and using the PairRDDFunctions <a target='\_blank'  href='https://spark.apache.org/docs/1.0.0/api/java/org/apache/spark/rdd/PairRDDFunctions.html#saveAsHadoopDataset(org.apache.hadoop.mapred.JobConf)'>saveAsHadoopDataset</a> method, which outputs the RDD to any Hadoop-supported storage system using a Hadoop Configuration object for that storage system (see Hadoop Configuration for HBase above).

```scala
// for each RDD. performs function on each RDD in DStream
sensorRDD.foreachRDD { rdd =>
        // filter sensor data for low psi
     val alertRDD = rdd.filter(sensor => sensor.psi < 5.0)

      // convert sensor data to put object and write to HBase  Table CF data
      rdd.map(Sensor.convertToPut).saveAsHadoopDataset(jobConfig)

     // convert alert to put object write to HBase  Table CF alerts
     rdd.map(Sensor.convertToPutAlert).saveAsHadoopDataset(jobConfig)
}

```

The sensorRDD objects are converted to put objects, and then written to HBase.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/sparkstream8-blog-1613718390677.png)

## Start Receiving Data

To start receiving data, we must explicitly call `start()` on the StreamingContext, then call `awaitTermination` to wait for the streaming computation to finish.

```scala
    // Start the computation
    ssc.start()
    // Wait for the computation to terminate
    ssc.awaitTermination()

```

## Spark Reading from and Writing to HBase

Now we want to read the HBase sensor table data, calculate daily summary statistics and write these statistics to the stats column family.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/sparkstream9-blog-1613718398619.png)

The code below reads the HBase table sensor table psi column data, calculates statistics on this data using <a target='\_blank'  href='https://spark.apache.org/docs/0.6.2/api/core/spark/util/StatCounter.html'>StatCounter</a>, and then writes the statistics to the sensor stats column family.

```scala
     // configure HBase for reading
    val conf = HBaseConfiguration.create()
    conf.set(TableInputFormat.INPUT_TABLE, HBaseSensorStream.tableName)
    // scan data column family psi column
    conf.set(TableInputFormat.SCAN_COLUMNS, "data:psi")

// Load an RDD of (row key, row Result) tuples from the table
    val hBaseRDD = sc.newAPIHadoopRDD(conf, classOf[TableInputFormat],
      classOf[org.apache.hadoop.hbase.io.ImmutableBytesWritable],
      classOf[org.apache.hadoop.hbase.client.Result])

    // transform (row key, row Result) tuples into an RDD of Results
    val resultRDD = hBaseRDD.map(tuple => tuple._2)

    // transform into an RDD of (RowKey, ColumnValue)s , with Time removed from row key
    val keyValueRDD = resultRDD.
              map(result => (Bytes.toString(result.getRow()).
              split(" ")(0), Bytes.toDouble(result.value)))

    // group by rowkey , get statistics for column value
    val keyStatsRDD = keyValueRDD.
             groupByKey().
             mapValues(list => StatCounter(list))

    // convert rowkey, stats to put and write to hbase table stats column family
    keyStatsRDD.map { case (k, v) => convertToPut(k, v) }.saveAsHadoopDataset(jobConfig)

```

The diagram below shows that the output from `newAPIHadoopRDD` is an RDD of row key, result pairs. The `PairRDDFunctions saveAsHadoopDataset` saves the Put objects to HBase.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/sparkstream10-blog-1613718405899.png)

## Software

*   You can download the **code and data** to run these examples from here:
    *   Code: <a target='\_blank'  href='https://github.com/caroljmcdonald/SparkStreamingHBaseExample'>https://github.com/caroljmcdonald/SparkStreamingHBaseExample</a>

## Running the Application

You can run the code as a standalone application.

Here are the steps summarized:

1.  Log into MapR using userid user01, password mapr.
2.  Build the application using maven.
3.  Copy the jar file and data file to your home directory /user/user01 using scp.
4.  Run the streaming app:  

    ```scala
     /opt/mapr/spark/spark-1.3.1/bin/spark-submit --driver-class-path `hbase classpath`
       --class examples.HBaseSensorStream sparkstreamhbaseapp-1.0.jar

    ```

5.  Copy the streaming data file to the stream directory:  
    `cp sensordata.csv /user/user01/stream/`
6.  Read data and calculate stats for one column:  

    ```scala
       /opt/mapr/spark/spark-1.3.1/bin/spark-submit --driver-class-path `hbase classpath`
        --class examples.HBaseReadWrite sparkstreamhbaseapp-1.0.jar

    ```

7.  Calculate stats for whole row:  

    ```scala
      /opt/mapr/spark/spark-1.3.1/bin/spark-submit --driver-class-path `hbase classpath`
       --class examples.HBaseReadRowWriteStats sparkstreamhbaseapp-1.0.jar

    ```

## Summary

This concludes the tutorial on Spark Streaming with HBase. You can find more information here:

## References and More Information:

*   <a target='\_blank'  href='http://spark.apache.org/docs/latest/streaming-programming-guide.html'>Apache Spark Streaming Programming guide</a>
*   <a target='\_blank'  href='http://shop.oreilly.com/product/0636920028512.do'>Learning Spark O'Reilly Book</a>
*   <a target='\_blank'  href='https://databricks.com/blog/2015/07/30/diving-into-spark-streamings-execution-model.html'>Databricks Spark Streaming</a>
