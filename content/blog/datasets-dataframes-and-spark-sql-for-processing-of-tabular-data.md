---
title: "Datasets, DataFrames, and Spark SQL for Processing of Tabular Data"
date: 2020-08-19T06:24:20.022Z
author: Carol McDonald 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","Spark","opensource","data-scientist", "data-ml-engineer"]
authorimage: "/img/blogs/Avatar5.svg"
featuredBlog: false
priority:
thumbnailimage:
---
## Original Post Information:
```
"authorDisplayName": "Carol McDonald",
"publish": "2018-10-24T07:00:00.000Z",
"tags": "spark"
```

---

With Apache Spark 2.0 and later versions, big improvements were implemented to make Spark easier to program and execute faster. The Spark SQL and the Dataset/DataFrame APIs provide ease of use, space efficiency, and performance gains with Spark SQL's optimized execution engine. In this blog post we will give an introduction to Spark Datasets, DataFrames and Spark SQL. This is part 2 of a multi-blog series. You can read [part 1 here](/blog/4jqBP6MO3rc1Yy0QjMOq/spark-101-what-is-it-what-it-does-and-why-it-matters).

**Editor’s Note:** MapR products referenced are now part of the [HPE Ezmeral Data Fabric](https://www.hpe.com/us/en/software/data-fabric.html).

A Spark Dataset is a distributed collection of typed objects, which are partitioned across multiple nodes in a cluster and can be operated on in parallel. Datasets can be created from MapR XD files, MapR Database tables, or MapR Event Store topics, and can be cached, allowing reuse across parallel operations. A Dataset can be manipulated using functional transformations (map, flatMap, filter, etc.) and/or Spark SQL. A DataFrame is a Dataset of Row objects and represents a table of data with rows and columns. A DataFrame consists of partitions, each of which is a range of rows in cache on a data node.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/image12-1597819064184.png)

## The SparkSession Object

As discussed before, a Spark application runs as independent processes, coordinated by the SparkSession object in the driver program. The entry point to programming in Spark is the org.apache.spark.sql.SparkSession class, which you use to create a SparkSession object as shown below:

```scala
val spark =
SparkSession.builder().appName("example").master("local[*]".getOrCreate()
```

If you are using the spark-shell or a notebook, the SparkSession object is already created and available as the variable Spark.

## Interactive Analysis with the Spark Shell

The Spark shell provides an easy way to learn Spark interactively. You can start the shell with the following command:

```bash
$ /[installation path]/bin/spark-shell --master local[2]
```

You can enter the code from the rest of this chapter into the Spark shell. Outputs from the shell are prefaced with ---result---.

## Exploring U.S. Flight Data with Spark Datasets and DataFrames

To go over some core concepts of Spark Datasets, we will be using some flight information from the [United States Department of Transportation](https://www.transtats.bts.gov/DL_SelectFields.asp?Table_ID=236&DB_Short_Name=On-Time). Later, we will use this same data to predict flight delays, so we want to explore the flight attributes that contribute most to flight delays. Using Spark Datasets, we will explore the data to answer questions like: which airline carriers, days of the week, originating airport, and hours of the day have the highest number of flight delays, when a delay is greater than 40 minutes?

The flight data is in JSON files, with each flight having the following information:

* **id**: ID composed of carrier, date, origin, destination, flight number
* **dofW**: day of week (1=Monday, 7=Sunday)        
* **carrier**: carrier code        
* **origin**: origin airport code        
* **dest**: destination airport code
* **crsdephour**: scheduled departure hour        
* **crsdeptime**: scheduled departure time        
* **depdelay**: departure delay in minutes        
* **crsarrtime**: scheduled arrival time        
* **arrdelay**: arrival delay minutes        
* **crselapsedtime**: elapsed time        
* **dist**: distance        

It appears in the following format:

```markdown
{    
"_id": "AA_2017-01-01_ATL_LGA_1678",
"dofW": 7,
"carrier": "AA",
"origin": "ATL",
"dest": "LGA",
"crsdephour": 17,
"crsdeptime": 1700,
"depdelay": 0.0,
"crsarrtime": 1912,
"arrdelay": 0.0,
"crselapsedtime": 132.0,
"dist": 762.0
}
```

([The complete data and code for all examples are available here.](https://github.com/mapr-demos/mapr-spark2-ebook))

## Loading Data from a File into a Dataset

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/image10-1597819073355.png)

With the SparkSession `read` method, we can read data from a file into a DataFrame, specifying the file type, file path, and input options for the schema. The schema can optionally be inferred from the contents of the JSON file, but you will get better performance and accuracy by specifying the schema.

```scala
import org.apache.spark.sql.types._
import org.apache.spark.sql._
import org.apache.spark.sql.functions._

val schema = StructType(Array(
    StructField("_id", StringType, true),
    StructField("dofW", IntegerType, true),
    StructField("carrier", StringType, true),
    StructField("origin", StringType, true),
    StructField("dest", StringType, true),
    StructField("crsdephour", IntegerType, true),
    StructField("crsdeptime", DoubleType, true),
    StructField("crsarrtime", DoubleType, true),
    StructField("crselapsedtime", DoubleType, true),
    StructField("label", DoubleType, true),
    StructField("pred_dtree", DoubleType, true)
  ))
var file = "maprfs:///data/flights.json"

val df = spark.read.format("json").option("inferSchema", "false").schema(schema).load(file)

---result:---
df: org.apache.spark.sql.DataFrame = [_id: string, dofW: int ... 10 more fields]
```

The take method returns an array with objects from this Dataset, which we see is of type Row.

```markdown
df.take(1)

---result:---
Array[org.apache.spark.sql.Row] =
Array([ATL_LGA_2017-01-01_17_AA_1678, 7, AA, ATL, LGA, 17, 1700.0, 0.0, 1912.0, 0.0, 132.0, 762.0])
```

If we supply a case class with the `as` method when loading the data, then the data is read into a Dataset of typed objects corresponding to the case class.

```scala
case class Flight(_id: String, dofW: Integer, carrier: String, origin: String, dest: String, crsdephour: Integer, crsdeptime: Double, depdelay: Double,crsarrtime: Double, arrdelay: Double, crselapsedtime: Double, dist: Double) extends Serializable

val df = spark.read.format("json").option("inferSchema", "false").schema(schema).load(file).as[Flight]

---result---:
df: org.apache.spark.sql.Dataset[Flight] = [_id: string, dofW: int ... 10 more fields]
```

Now the take method returns an array of Flight objects.

```scala
df.take(1)

---result:---
Array[Flight] = Array(Flight(ATL_LGA_2017-01-01_17_AA_1678, 7,AA,ATL,LGA,17,1700.0,0.0,1912.0,0.0,132.0,762.0))
```

## Transformations and Actions

There are two types of operations you can perform on a Dataset:

* **transformations**: create a new Dataset from the current Dataset
* **actions**: trigger computation and return a result to the driver program

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/image1-1597819082131.png)

Transformations are lazily evaluated, which means they are not computed immediately. A transformation is executed only when it is triggered by an action. Once an action has run and the value is returned, the Dataset is no longer in memory, unless you call the `cache` method on the Dataset. If you will reuse a Dataset for more than one action, you should cache it.

**Datasets and Type Safety**

Datasets are composed of typed objects, which means that transformation syntax errors (like a typo in the method name) and analysis errors (like an incorrect input variable type) can be caught at compile time. DataFrames are composed of untyped Row objects, which means that only syntax errors can be caught at compile time. Spark SQL is composed of a string, which means that syntax errors and analysis errors are only caught at runtime. Datasets save a developer’s time by catching errors sooner, even while typing when using an IDE.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/image2-1597819089388.png)

**Dataset Transformations**

Here is a list of some commonly used typed transformations, which can be used on Datasets of typed objects (Dataset\[T\]).

| Transformation | Description |
| --- | --- | --- |
| map | Returns new Dataset with result of applying input function to each element |
| filter | Returns new Dataset containing elements where input function is true |
| groupByKey | Returns a KeyValueGroupedDataset where the data is grouped by the given key function |


This example filter transformation on the flight Dataset returns a Dataset with flights that departed at 10 AM. The take action returns an array of flight objects to the driver program.

```scala
df.filter(flight => flight.crsdephour == 10).take(3)

---result:---
Array[Flight] = Array(Flight(ORD_DEN_2017-01-01_AA_2300, 7,AA,ORD,DEN,10,1005.0,5.0,1145.0,3.0,160.0,888.0), Flight(MIA_ORD_2017-01-01_AA_2439,7,AA,MIA,ORD,10, 1005.0,4.0,1231.0,0.0,206.0,1197.0))
```

**DataFrame Transformations**

Here is a list of some commonly used untyped transformations, which can be used on Dataframes (Dataset\[Row\]).

| Transformation | Description |
| --- | --- | --- |
| select | Selects a set of columns |
| join | Join with another DataFrame, using the given join expression |
| groupBy | Groups the DataFrame, using the specified columns |

This `groupBy` transformation example groups the flight Dataset by carrier, then the count action counts the number of flights for each carrier. The show action prints out the resulting DataFrame rows in tabular format.

```scala
df.groupBy("carrier").count().show()

---result:---
+-------+-----+
|carrier|count|
+-------+-----+
|     UA|18873|
|     AA|10031|
|     DL|10055|
|     WN| 2389|
+-------+-----+
```

Here is a list of some commonly used Dataset actions.

| Action | Description |
| --- | --- | --- |
| show(n) | Displays the first n rows in a tabular form |
| take(n) | Returns the first n objects in the Dataset in an array |
| count | Returns the number of rows in the Dataset |

Here is an example using typed and untyped transformations and actions to get the destinations with the highest number of departure delays, where a delay is greater than 40 minutes. We count the departure delays greater than 40 minutes by destination and sort them with the highest first.

```scala
df.filter($"depdelay" > 40).groupBy("dest").count()
.orderBy(desc("count")).show(3)

---result:---
+----+-----+
|dest|count|
+----+-----+
| SFO|  711|
| EWR|  620|
| ORD|  593|
+----+-----+
```

## Exploring the Flight Dataset with Spark SQL

Now let’s explore the flight Dataset using Spark SQL and DataFrame transformations. After we register the DataFrame as a SQL temporary view, we can use SQL functions on the SparkSession to run SQL queries, which will return the results as a DataFrame. We cache the DataFrame, since we will reuse it and because Spark can cache DataFrames or Tables in columnar format in memory, which can improve memory usage and performance.

```scala
// cache DataFrame in columnar format in memory
df.cache

// create Table view of DataFrame for Spark SQL
df.createOrReplaceTempView("flights")

// cache flights table in columnar format in memory
spark.catalog.cacheTable("flights")
```

Below, we display information for the top five longest departure delays with Spark SQL and with DataFrame transformations (where a delay is considered greater than 40 minutes):

```scala
// Spark SQL
spark.sql("select carrier,origin, dest, depdelay,crsdephour, dist, dofW from flights where depdelay > 40 order by depdelay desc limit 5").show

// same query using DataFrame transformations

df.select($"carrier",$"origin",$"dest",$"depdelay", $"crsdephour").filter($"depdelay" > 40).orderBy(desc( "depdelay" )).show(5)

---result:---
+-------+------+----+--------+----------+
|carrier|origin|dest|depdelay|crsdephour|
+-------+------+----+--------+----------+
|     AA|   SFO| ORD|  1440.0|         8|
|     DL|   BOS| ATL|  1185.0|        17|
|     UA|   DEN| EWR|  1138.0|        12|
|     DL|   ORD| ATL|  1087.0|        19|
|     UA|   MIA| EWR|  1072.0|        20|
+-------+------+----+--------+----------+
```

Below, we display the average departure delay by carrier:

```scala
// DataFrame transformations

df.groupBy("carrier").agg(avg("depdelay")).show

---result:---
+-------+------------------+
|carrier|     avg(depdelay)|
+-------+------------------+
|     UA|17.477878450696764|
|     AA| 10.45768118831622|
|     DL|15.316061660865241|
|     WN|13.491000418585182|
+-------+------------------+
```

With a notebook like Zeppelin or Jupyter, you can also display the SQL results in graph formats.

```scala
// Spark SQL
%sql select carrier, avg(depdelay)
 from flights
 group by carrier
```

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/image9-1597819097878.png)

Let’s explore this data for flight delays, when the departure delay is greater than 40 minutes. Below, we see that United Airlines and Delta have the highest count of flight delays for January and February 2017 (the training set).

```scala
// __Count of Departure Delays by Carrier (where delay=40 minutes)__

df.filter($"depdelay" > 40)
.groupBy("carrier").count.orderBy(desc( "count")).show(5)

---result:---
+-------+-----+
|carrier|count|
+-------+-----+
|     UA| 2420|
|     DL| 1043|
|     AA|  757|
|     WN|  244|
+-------+-----+
```

```sql
// Count of Departure Delays by Carrier (where delay=40 minutes)

%sql
select carrier, count(depdelay)
from flights where depdelay > 40
group by carrier
```

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/image11-1597819106731.png)

In the query below, we see that Monday (1), Tuesday (2), and Sunday (7) have the highest count of flight delays.

```sql
// Count of Departure Delays by Day of the Week

%sql
select dofW, count(depdelay)
from flights where depdelay > 40
group by dofW
```

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/image8-1597819122799.png)

In the query below, we see that the hours between 13:00-19:00 have the highest count of flight delays.

```sql
%sql
select crsdephour, count(depdelay)
from flights where depdelay > 40
group by crsdephour order by crsdephour
```

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/image7-1597819140727.png)

In the query below, we see that the originating airports, Chicago and Atlanta, have the highest count of flight delays.

```sql
%sql
select origin, count(depdelay)
from flights where depdelay > 40
group by origin
ORDER BY count(depdelay) desc
```

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/image6-1597819149739.png)

In the query below, we see the count of departure delays by origin and destination. The routes ORD->SFO and DEN->SFO have the highest delays, maybe because of weather in January and February. Adding weather to this Dataset would give better results.

```sql
%sql
select origin, dest, count(depdelay)
from flights where depdelay > 40
group by origin, dest
ORDER BY count(depdelay) desc
```

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/image5-1597819157738.png)

## Summary

You have now learned how to load data into Spark Datasets and DataFrames and how to explore tabular data with Spark SQL. These code examples can be reused as the foundation to solve many types of business problems.
