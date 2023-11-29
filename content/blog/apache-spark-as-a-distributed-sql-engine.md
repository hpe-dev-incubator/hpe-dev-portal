---
title: "Apache Spark as a Distributed SQL Engine"
date: 2021-01-07T22:53:50.203Z
author: Nicolas Perez 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","apache-spark","opensource"]
authorimage: "/img/blogs/Avatar2.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019 may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
"authorDisplayName": "Nicolas A Perez",
"publish": "2016-03-17T07:00:00.000Z",
"tags": "apache-spark"
```

---

SQL has been here for awhile and people like it. However, the engines that power SQL have changed with time in order to solve new problems and keep up with demands from consumers.

Traditional engines such as Microsoft SQL Server had some problems with scalability that they have solved with time and cloud-based solutions. On the other hand, others have been built from the ground up to work in a distributed environment so they can put performance at the top of their priority list.

There is not a tool for all use cases. In fact, we believe that tools are built with use cases in mind, to solve a specific problem. Then they evolve to a more mature stage where they can be used to solve many other problems.

In a traditional SQL environment, the data is represented by tables and the relationships between them, but this representation is sometimes not enough, so new tools have been developed to solve this. We can find everywhere organizations that don’t use relational databases; instead, they prefer to go to the non-SQL ones.

## Hadoop

In the Hadoop world, we have a variety of different query engines; each of them has its own particularities, and they each solve a wide variety of problems.

In any Hadoop distribution, we can find Apache Hive, a SQL-like tool that offers data warehouse infrastructure and capabilities for big data queries and analysis.

Depending on the Hadoop distribution, we can also find Apache Impala and Apache Drill. All of them offer more or less the same capabilities, sharing a common goal. We can use SQL or SQL-like languages to query data stored in Hadoop. They also have their own limitations and advantages that you should be aware of.

## Apache Spark

Apache Spark is a lightning-fast cluster computing that can be deployed in a Hadoop cluster or stand alone mode. It can also be used as a SQL engine like the others we mentioned. Spark, however, offers some advantages over the previous ones.

Spark exposes APIs for different languages such as Scala, Java, Python, and R. This makes it accessible by many types of people, such as developers, data scientists, and those with statistics experience.

Interactive algorithms are easily implemented in Spark, especially machine learning ones.

Let’s walk through an example of how to use Spark as a SQL engine.

## Exploring Our Data Source

Our data set is a simple folder with a few terabytes in CSV-formatted files, and each file is about 40MB each. The size of the files does not affect the performance, because they are stored in a MapR cluster. MapR take cares of the [Hadoop small file problem](https://blog.cloudera.com/the-small-files-problem/) as I explain in [this post](https://medium.com/hackernoon/how-mapr-improves-our-productivity-and-simplify-our-design-2d777ab53120).

Because we are using MapR, copying files to the cluster is quite easy, since we have mounted a volume to our local file system.

In order to mount the MapR volume, we run this command:

```bash
sudo mount_nfs -o "hard,nolock" 10.21.112.209:/mapr/mapr.domain.com/datalake /Users/anicolaspp/mapr/
```

Now, if we run POSIX commands again in our local folder, they will in fact be executed in the MapR cluster.

## Preparing the Environment for Auto Schema Discovery

We are going to create a Spark application using Scala that will allow us to execute SQL statements over our data stored in the MapR Distribution.

In [this post](https://medium.com/@anicolaspp/sbt-scala-and-spark-6a57c0a2623a) I explained how to create an application in Spark and the previous steps we need to follow.

Our app class will look as follows:

```scala
/**
 * Created by anicolaspp.
 */
 
import org.apache.spark
import org.apache.spark._
import org.apache.spark.sql.hive.HiveContext
import org.apache.spark.sql.hive.thriftserver.HiveThriftServer2
import org.apache.spark.sql.{Row, SQLContext}
import org.apache.spark.sql.types.{StringType, StructField, StructType}

object app {  
    
    def main(args: Array[String]) {    
        
        val conf = new SparkConf().setAppName("testing")
        val sc = new SparkContext(conf)
        val sql = new HiveContext(sc)
    
        sql.setConf("hive.server2.thrift.port", "10001")   

        val delimiter = "\t"    
        val data = sc.textFile("datalake/myTestDataFolder/")   
        val headers = data.first.split(delimiter)
        val schema = StructType(headers.map(h => StructField(h, StringType)))
        val rowRDD  = data.map(p => Row.fromSeq(p.split(delimiter)))
        val dataFrame = sql.createDataFrame(rowRDD, schema)
    
        dataFrame.registerTempTable("someTableName")
        
        HiveThriftServer2.startWithContext(sql)
        
        while (true) {      
            
            Thread.`yield`()    
        }
    }
}
```

Let’s review our code.

First, we create the Spark Context based on a Config object.

```scala
val conf = new SparkConf().setAppName("testing")
val sc = new SparkContext(conf)
val sql = new HiveContext(sc)
```

Then, we set the thrift port to avoid conflicts with other components such as Hive.

```scala
sql.setConf("hive.server2.thrift.port", "10001")
```

Now, we set our CSV delimiter that in this case is the tab character. We also set the location of our data set by creating a Resilient Distributed Dataset (RDD) using the Spark Context (sc).

```scala
val delimiter = "\t"
val data = sc.textFile("datalake/myTestDataFolder/")
```

At this point, we want to be able to serve our data without worrying about the schema of our file; we want a self-service BI environment as I explained [here](https://medium.com/hackernoon/how-mapr-improves-our-productivity-and-simplify-our-design-2d777ab53120). Using the headers from our data files, we can create the schema automatically, so we don’t have to worry about schema changes in the future. Once we have the schema, we create a DataFrame that we are going to expose in order to be queried using SQL.

```scala
val headers = data.first.split(delimiter)
val schema = StructType(headers.map(h => StructField(h, StringType)))
val rowRDD = data.map(p => Row.fromSeq(p.split(delimiter)))
val dataFrame = sql.createDataFrame(rowRDD, schema)
```

The only part missing is the one that registers our data set as a table in the Hive meta store; we do that by doing:

```scala
dataFrame.registerTempTable("someTableName")
HiveThriftServer2.startWithContext(sql)
```

We have a loop just to keep our app alive. Note that RDD transformations are lazy and they will be only executed when a query is submitted for execution.

## Deploying Our Application

We build and test our app using SBT, and the resulting .jar can be copied to the cluster in the same way we copy files in our local file system.

cp pathToOurJar/app.jar /Users/anicolaspp/mapr/testing

Remember this is possible because we have previously mounted a MapR volume in our local file system.

Now we need to submit our application in the cluster, and we do that by using the spark-submit command. Detailed documentation about submitting Spark applications can be found on the [Spark website](https://spark.apache.org/docs/latest/running-on-yarn.html).

In our cluster, we run:

```bash
/spark-submit --master yarn /mapr/mapr.domain.com/datalake/testing/testing_2.10-1.0.jar
```

Our application should start running on YARN as we indicated when submitting it.

Our SQL engine is ready to be queried, so let’s move forward and test it out.

## SQL Clients

An easy way to test our SQL engine is to run [beeline](https://cwiki.apache.org/confluence/display/Hive/HiveServer2+Clients#HiveServer2Clients-Beeline%E2%80%93NewCommandLineShell), a command line tool that works as an SQL client.

We can find beeline in the Spark bin folder. To start it, we type ./beeline.

Within beeline, we need connect to the end point we have defined in our application, so we run:

```bash
!connect jdbc:hive2://localhost:10001
```

We should be ready to run SQL statements, but let’s verify we can see the table we registered.

```bash
show tables;
```

Spark SQL will return a table with the registered tables including the one we registered in our application (someTableName).

In the same way, we can connect using other clients such as Microstrategy or Tableau. We have tried both and they both can build and execute queries on tables registered by Spark applications. We can also combine different sources (Spark SQL, MS SQL Server, Hive, Impala, etc.) which gives us the flexibility of combining relational sources with non-relational data.

Spark SQL performs quite well and often better than the other providers in Hadoop, but be aware that performance can be degraded under certain conditions and use cases.

## Why Apache Spark

Certainly, Spark SQL offers some of the functionalities that other tools have within Hadoop. However, the possibility of exploring complex data sets is rather unique to Spark, since we can code custom serialization / deserialization processes in our application. Using Spark SQL, we can connect to any data source and present it as tables to be consumed by SQL clients. This is as easy as changing how we ready the data in those sources by changing our serializer in our application.

## Endings

There are very useful tools that we can use within Hadoop to query data in an SQL fashion and all of them have their advantages. The Spark SQL module from Apache Spark offers some flexibility that others lack while keeping performance as one of the main priorities.

Spark is not the only tool you can use, but we strongly advise that you include it in big data solutions where SQL statements are to be executed. You might need to use a mix of different tools, but Spark should be an important part of the system you are building.

[View the original.](https://medium.com/@anicolaspp/apache-spark-as-a-distributed-sql-engine-4373e254e0f9)
