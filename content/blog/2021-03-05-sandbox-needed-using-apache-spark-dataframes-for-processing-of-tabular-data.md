---
title: SANDBOX NEEDED - Using Apache Spark DataFrames for Processing of Tabular Data
date: 2021-03-05T12:29:32.043Z
author: Carol McDonald
authorimage: /img/blogs/Avatar4.svg
tags:
  - hpe-ezmeral-data-fabric
  - opensource
---
## Original Post Information:
```
"authorDisplayName": "Carol McDonald",
"publish": "2015-06-24T07:00:00.000Z",
"tags": "spark"
```



---



This post will help you get started using Apache Spark DataFrames with Scala on the MapR Sandbox. The <a target='\_blank'  href='http://spark.apache.org/docs/latest/sql-programming-guide.html#datasets-and-dataframes'>new Spark DataFrames API</a> is designed to make big data processing on tabular data easier.



## What is a Spark DataFrame?



A Spark DataFrame is a distributed collection of data organized into named columns that provides operations to filter, group, or compute aggregates, and can be used with Spark SQL. DataFrames can be constructed from structured data files, existing RDDs, tables in Hive, or external databases.



In this post, you’ll learn how to:



*   Load data into Spark DataFrames


*   Explore data with Spark SQL



This post assumes a basic understanding of Spark concepts.



## Software



This tutorial will run on the MapR v5.0 Sandbox, which includes Spark 1.3



*   You can download the code and data to run these examples from here:
    *   <a target='\_blank'  href='https://github.com/caroljmcdonald/sparkdataframeexample'>https://github.com/caroljmcdonald/sparkdataframeexample</a>


*   The examples in this post can be run in the spark-shell, after launching with the spark-shell command.


*   You can also run the code as a standalone application.



**The sample data sets**



We will use two example datasets - one from <a target='\_blank'  href='http://www.modelingonlineauctions.com/datasets'>eBay online auctions</a> and one from the <a target='\_blank'  href='https://data.sfgov.org/Public-Safety/SFPD-Incidents-from-1-January-2003/tmnf-yvry'>SFPD Crime Incident Reporting system</a>.

The eBay online auction dataset has the following data fields:



**_auctionid_** - unique identifier of an auction  

**_bid_** - the proxy bid placed by a bidder  
**_bidtime_** - the time (in days) that the bid was placed, from the start of the auction  
**_bidder_** - eBay username of the bidder  
**_bidderrate_** - eBay feedback rating of the bidder  
**_openbid_** - the opening bid set by the seller  
**_price_** - the closing price that the item sold for (equivalent to the second highest bid + an increment)



The table below shows the data fields with some sample data: 
 
![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/blog_sparkdataframes_table1-1594352866875.png)



Using Spark DataFrames we will explore the data with questions like:



*   How many auctions were held?


*   How many bids were made per item?


*   What's the minimum, maximum, and average number of bids per item?


*   Show the bids with price > 100



The table below shows the SFPD data fields with some sample data: 
 
![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/blog_sparkdataframes_table2-1594352879759.png)



Using Spark DataFrames, we will explore the SFPD data with questions like:



*   What are the top 10 Resolutions?


*   How many Categories are there?


*   What are the top 10 incident Categories?



## Loading Data into Spark DataFrames



Log into the MapR Sandbox using userid user01, password mapr. Copy the sample data files to your sandbox home directory /user/user01 using scp. Start the spark shell with:  


`$ spark-shell`



First, we will import some packages and instantiate a sqlContext, which is the entry point for working with structured data (rows and columns) in Spark and allows the creation of DataFrame objects.  


(In the code boxes, <font color="lightgreen">comments are in Green</font> and <font color="lightblue">output is in Blue</font>)



<pre>
<font color="lightgreen">//  SQLContext entry point for working with structured data</font>
val sqlContext = new org.apache.spark.sql.SQLContext(sc)
<font color="lightgreen">// this is used to implicitly convert an RDD to a DataFrame.</font>
import sqlContext.implicits._
<font color="lightgreen">// Import Spark SQL data types and Row.</font>
import org.apache.spark.sql._
</pre>



Below we load the data from the ebay.csv file into a Resilient Distributed Dataset (RDD). RDDs can have transformations and actions; the `first()` action returns the first element in the RDD, which is the String `“8213034705,95,2.927373,jake7870,0,95,117.5,xbox,3”`



<pre>
<font color="lightgreen">// load the data into a  new RDD</font>
val ebayText = sc.textFile("ebay.csv")

<font color="lightgreen">// Return the first element in this RDD</font>
ebayText.first()
<font color="lightblue">// res6: String = 8213034705,95,2.927373,jake7870,0,95,117.5,xbox,3</font>
</pre>



Below we use a Scala case class to define the Auction schema corresponding to the ebay.csv file. Then `map()` transformations are applied to each element of ebayText to create the ebay RDD of Auction objects.



<pre>
<font color="lightgreen">//define the schema using a case class</font>
case class Auction(auctionid: String, bid: Float, bidtime: Float, bidder: String, bidderrate: Integer, openbid: Float, price: Float, item: String, daystolive: Integer)

<font color="lightgreen">// create an RDD of Auction objects</font>
val ebay = ebayText.map(_.split(",")).map(p => Auction(p(0),p(1).toFloat,p(2).toFloat,p(3),p(4).toInt,p(5).toFloat,p(6).toFloat,p(7),p(8).toInt ))
</pre>



The ebay RDD `first()` action returns the first element in the RDD, Auction = Auction( 8213034705, 95.0, 2.927373, jake7870, 0, 95.0, 117.5, xbox,3).



<pre>
<font color="lightgreen">// Return the first element in this RDD</font>
ebay.first()
<font color="lightblue">//res7: Auction = Auction(8213034705,95.0,2.927373,jake7870,0,95.0,117.5,xbox,3)</font>
<font color="lightgreen">// Return the number of elements in the RDD</font>
ebay.count()
res8: Long = 10654
</pre>



A DataFrame is <a target='\_blank'  href='https://databricks.com/blog/2015/02/17/introducing-dataframes-in-spark-for-large-scale-data-science.html'>a distributed collection of data organized into named columns.</a> Spark SQL supports automatically converting an RDD containing case classes to a DataFrame with the method `toDF()`:



<pre>
<font color="lightgreen">// change ebay RDD of Auction objects to a DataFrame</font>
val auction = ebay.toDF()
</pre>



The previous RDD transformations can also be written on one line like this:



<pre>
val auction = sc.textFile("ebay.csv").map(_.split(",")).map(p =>
Auction(p(0),p(1).toFloat,p(2).toFloat,p(3),p(4).toInt,p(5).toFloat,p(6).toFloat,p(7),p(8).toInt )).toDF()
</pre>



## Explore and Query the eBay Auction Data with Spark DataFrames



DataFrames provide a domain-specific language for structured data manipulation in Scala, Java, and Python; below are some examples with the auction DataFrame. The DataFrame `show()` action displays the top 20 rows in a tabular form.



<pre>
<font color="lightgreen">// Display the top 20 rows of DataFrame</font>
auction.show()
<font color="lightblue">// auctionid  bid   bidtime  bidder         bidderrate openbid price item daystolive
// 8213034705 95.0  2.927373 jake7870       0          95.0    117.5 xbox 3
// 8213034705 115.0 2.943484 davidbresler2  1          95.0    117.5 xbox 3 …</font>
</pre>



DataFrame `printSchema()` Prints the schema to the console in a tree format



<pre>
<font color="lightgreen">// Return the schema of this DataFrame</font>
auction.printSchema()
<font color="lightblue">root
 |-- auctionid: string (nullable = true)
 |-- bid: float (nullable = false)
 |-- bidtime: float (nullable = false)
 |-- bidder: string (nullable = true)
 |-- bidderrate: integer (nullable = true)
 |-- openbid: float (nullable = false)
 |-- price: float (nullable = false)
 |-- item: string (nullable = true)
 |-- daystolive: integer (nullable = true)</font>
</pre>



After a dataframe is instantiated, you can query it using SQL queries. Here are some example queries using the Scala DataFrame API:



<pre>
<font color="lightgreen">// How many auctions were held?</font>
auction.select("auctionid").distinct.count
<font color="lightblue">// Long = 627</font>

<font color="lightgreen">// How many bids per item?</font>
auction.groupBy("auctionid", "item").count.show
auctionid  item    count
3016429446 palm    10
8211851222 xbox    28
3014480955 palm    12
8214279576 xbox    4
3014844871 palm    18
3014012355 palm    35
1641457876 cartier 2
. . .
<font color="lightgreen">// What's the min number of bids per item? what's the average? what's the max?</font>
auction.groupBy("item", "auctionid").count.agg(min("count"), avg("count"),max("count")).show

<font color="lightblue">// MIN(count) AVG(count)        MAX(count)
// 1  16.992025518341308 75</font>

<font color="lightgreen">// Get the auctions with closing price > 100</font>
val highprice= auction.filter("price > 100")
<font color="lightblue">// highprice: org.apache.spark.sql.DataFrame = [auctionid: string, bid: float, bidtime: float, bidder: // string, bidderrate: int, openbid: float, price: float, item: string, daystolive: int]</font>

<font color="lightgreen">// display dataframe in a tabular format</font>
highprice.show()
<font color="lightblue">// auctionid  bid   bidtime  bidder         bidderrate openbid price item daystolive
// 8213034705 95.0  2.927373 jake7870       0          95.0    117.5 xbox 3        
// 8213034705 115.0 2.943484 davidbresler2  1          95.0    117.5 xbox 3</font>
</pre>



You can register a DataFrame as a temporary table using a given name, and then run SQL statements using the sql methods provided by sqlContext. Here are some example queries using <a target='\_blank'  href='https://spark.apache.org/docs/1.3.0/sql-programming-guide.html'>sqlContext</a>:



<pre>
<font color="lightgreen">// register the DataFrame as a temp table</font>
auction.registerTempTable("auction")
<font color="lightgreen">// SQL statements can be run
// How many  bids per auction?</font>
val results =sqlContext.sql("SELECT auctionid, item,  count(bid) FROM auction GROUP BY auctionid, item")
<font color="lightgreen">// display dataframe in a tabular format</font>
results.show()
<font color="lightblue">// auctionid  item    count
// 3016429446 palm    10
// 8211851222 xbox    28\. . .</font>

val results =sqlContext.sql("SELECT auctionid, MAX(price) FROM auction  GROUP BY item,auctionid")
results.show()
<font color="lightblue">// auctionid  c1
// 3019326300 207.5
// 8213060420 120.0 . . .</font>
</pre>



## Loading the SFPD Data into Spark dataframesUsing a csv Parsing Library



Now we will load the SFPD dataset into a Spark dataframe using the <a target='\_blank'  href='https://github.com/databricks/spark-csv'>spark-csv parsing library</a> from Databricks. You can use this library at the Spark shell by specifying --packages com.databricks:spark-csv_2.10:1.0.3 when starting the shell as shown below:



`$ spark-shell --packages com.databricks:spark-csv_2.10:1.0.3`



The load operation will parse the sfpd.csv file and return a dataframe using the first header line of the file for column names.



<pre>
import sqlContext.implicits._
import org.apache.spark.sql._

<font color="lightgreen">//  Return the dataset specified by data source as a DataFrame, use the header for column names</font>
val df = sqlContext.load("com.databricks.spark.csv", Map("path" -> "sfpd.csv", "header" -> "true"))
</pre>



The take operation returns the specified number of rows in the DataFame.



<pre>
<font color="lightgreen">// Return the first n rows in the DataFrame</font>
df.take(1)

<font color="lightblue">// res4: Array[org.apache.spark.sql.Row] = Array([150467944,LARCENY/THEFT,GRAND THEFT FROM LOCKED AUTO,Thursday,05/28/2015,23:59,TENDERLOIN,NONE,TAYLOR ST / OFARRELL ST,-122.411328369311,37.7859963050476,(37.7859963050476, -122.411328369311),15046794406244])</font>

<font color="lightgreen">// Print the schema to the console in a tree format</font>
df.printSchema()
<font color="lightblue">root
 |-- IncidntNum: string (nullable = true)
 |-- Category: string (nullable = true)
 |-- Descript: string (nullable = true)
 |-- DayOfWeek: string (nullable = true)
 |-- Date: string (nullable = true)
 |-- Time: string (nullable = true)
 |-- PdDistrict: string (nullable = true)
 |-- Resolution: string (nullable = true)
 |-- Address: string (nullable = true)
 |-- X: string (nullable = true)
 |-- Y: string (nullable = true)
 |-- Location: string (nullable = true)
 |-- PdId: string (nullable = true)</font>

<font color="lightgreen">// display dataframe in a tabular format</font>
df.show()
<font color="lightblue">IncidntNum Category Descript DayOfWeek Date Time PdDistrict Resolution Address X Y Location PdId
150467944  LARCENY/THEFT GRAND THEFT FROM ... Thursday  05/28/2015 23:59 TENDERLOIN NONE           TAYLOR ST / OFARR... -122.411328369311 37.7859963050476 (37.7859963050476... 15046794406244</font>
</pre>



## Here are Some Example Queries Using sqlContext:



<pre>
<font color="lightgreen">// how many categories are there?</font>
df.select("Category").distinct.count
<font color="lightblue">// res5: Long = 39</font>
<font color="lightgreen">// register as a temp table inorder to use sql</font>
df.registerTempTable("sfpd")

<font color="lightgreen">// How many categories are there</font>
sqlContext.sql("SELECT distinct Category FROM sfpd").collect().foreach(println)

<font color="lightblue">// [ASSAULT]
// [MISSING PERSON]
// [TREA] . . .</font>
</pre>

<pre>
<font color="lightgreen">// What are the top 10 Resolutions ?</font>
sqlContext.sql("SELECT Resolution , count(Resolution) as rescount FROM sfpd group by Resolution order by rescount desc limit 10").collect().foreach(println)
<font color="lightblue">// [NONE,1063775]
// [ARREST, BOOKED,414219]
// [ARREST, CITED,154033] . . .</font>
</pre>

<pre>
<font color="lightgreen">// What are the top 10 most incident Categories?</font>
val t =  sqlContext.sql("SELECT Category , count(Category) as catcount FROM sfpd group by Category order by catcount desc limit 10")

t.show()
<font color="lightblue">// Category       catcount
// LARCENY/THEFT  353793
// OTHER OFFENSES 253627
// NON-CRIMINAL   186272\. . .</font>

<font color="lightgreen">// The results of SQL queries are DataFrames and support RDD operations.
// The columns of a row in the result can be accessed by ordinal</font>
t.map(t => "column 0: " + t(0)).collect().foreach(println)
<font color="lightblue">// column 0: LARCENY/THEFT
// column 0: OTHER OFFENSES
// column 0: NON-CRIMINAL
// column 0: ASSAULT …</font>
</pre>



## The Physical Plan for DataFrames



The <a target='\_blank'  href='https://databricks.com/blog/2015/04/13/deep-dive-into-spark-sqls-catalyst-optimizer.html'>Catalyst query optimizer creates the physical Execution Plan</a> for DataFrames as shown in the diagram below:  
![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/blog_sparkdataframes_image3-1594352889505.png)



**Print the physical plan to the console**



DataFrames are designed to take the SQL queries constructed against them and optimize the execution as sequences of Spark Jobs as required. You can print the physical plan for a DataFrame using the explain operation as shown below:



<pre>
<font color="lightgreen">//  Prints the physical plan to the console for debugging purpose</font>
auction.select("auctionid").distinct.**explain**()

<font color="lightblue">// == Physical Plan ==
// Distinct false
// Exchange (HashPartitioning [auctionid#0], 200)
//  Distinct true
//   Project [auctionid#0]
 //   PhysicalRDD   //[auctionid#0,bid#1,bidtime#2,bidder#3,bidderrate#4,openbid#5,price#6,item#7,daystolive#8], MapPartitionsRDD[11] at mapPartitions at ExistingRDD.scala:37</font>
</pre>



## Summary



In this blog post, you’ve learned how to load data into Spark DataFrames, and explore data with Spark SQL. If you have any further questions, or want to share how you are using Spark DataFrames, please add your comments in the section below.



**Want to learn more?**



*   <a target='\_blank'  href='https://spark.apache.org/docs/1.3.0/sql-programming-guide.html#dataframes'>Spark SQL and DataFrame Guide</a>


*   <a target='\_blank'  href='http://shop.oreilly.com/product/0636920028512.do'>Learning Spark - O'Reilly Book</a>