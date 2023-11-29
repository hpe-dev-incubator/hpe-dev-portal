---
title: "Tips and Best Practices to Take Advantage of Spark 2.x"
date: 2020-07-08T05:54:32.934Z
author: Carol McDonald 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","Spark","AI","opensource", "data-scientist", "data-ml-engineer"]
authorimage: "/img/blogs/Avatar4.svg"
featuredBlog: false
priority:
thumbnailimage:
---
## Original post information:

```
"authorDisplayName": "Carol McDonald",
"publish": "2019-02-05T07:00:00.000Z",
"tags": "spark"
```

---

**Editor’s Note:** MapR products referenced are now part of the [HPE Ezmeral Data Fabric](https://www.hpe.com/us/en/software/data-fabric.html).

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/image1-1594188264230.png)

With Apache Spark 2.0 and later versions, big improvements were implemented to enable Spark to execute faster, making lot of earlier tips and best practices obsolete. This blog post will first give a quick overview of what changes were made and then some tips to take advantage of these changes.

## Project Tungsten

[Tungsten](https://databricks.com/glossary/tungsten) is the code name for the Spark project that makes changes to Apache Spark’s execution engine, focusing on improvements to the efficiency of memory and CPU usage.  Tungsten builds upon ideas from modern compilers and massively parallel processing (MPP) technologies, such as Apache Drill, [Presto](https://prestodb.io/docs/current/overview/concepts.html%23query-execution-model), and [Apache Arrow](https://arrow.apache.org/).  Spark 2.x improvements include:

*   To reduce JVM object memory size, creation, and garbage collection processing, Spark explicitly manages memory and converts most operations to operate directly against binary data.
*   [Columnar layout for memory data](https://arrow.apache.org/) avoids unnecessary I/O and accelerates analytical processing performance on modern CPUs and GPUs.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/image10-1594188764938.png)

*   Vectorization allows the CPU to operate on vectors, which are arrays of column values from multiple records. This takes advantage of modern CPU designs, by keeping all pipelines full to achieve efficiency.  

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/image9-1594188775215.png)

*   To improve the speed of data processing through more effective use of L1/ L2/L3 CPU caches, Spark algorithms and data structures exploit memory hierarchy with cache-aware computation.

*   Spark SQL’s Catalyst Optimizer underpins all the major new APIs in Spark 2.0 and later versions, from [DataFrames](https://databricks.com/glossary/what-are-dataframes) and [Datasets](https://databricks.com/glossary/what-are-datasets) to Structured Streaming.  The Catalyst optimizer handles: analysis, logical optimization, physical planning, and code generation to compile parts of queries to Java bytecode.  Catalyst now supports both rule-based and cost-based optimization.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/image12-1594188785209.png)

*   Spark SQL “Whole-Stage Java Code Generation” optimizes CPU usage by generating a single optimized function in bytecode for the set of operators in a SQL query (when possible), instead of generating iterator code for each operator.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/image11-1594188795498.png)

## Tips for Taking Advantage of Spark 2.x Improvements

### Use Dataset, DataFrames, Spark SQL

In order to take advantage of Spark 2.x, you should be using Datasets, DataFrames, and Spark SQL, instead of RDDs.  Datasets, DataFrames, and Spark SQL provide the following advantages:

*   Compact columnar memory format
*   Direct memory access
*   Reduced garbage collection processing overhead
*   Catalyst query optimization
*   Whole-stage code generation

When possible, use Spark SQL functions – for example, `to_date()`, `hour()` – instead of custom UDFs in order to benefit from the advantages above.

Datasets provide the advantage of compile time type safety over DataFrames. However, Dataset functional transformations (like map) will not take advantage of  query optimization, whole-stage code generation, and reduced GC.

### Use the Best Data Store for Your Use Case

Spark supports several data formats, including CSV, JSON, ORC, and Parquet, and several data sources or connectors, popular NoSQL databases, and distributed messaging stores.

But just because Spark supports a given data storage or format doesn’t mean you’ll get the same performance with all of them. Typically, data pipelines will involve multiple data sources and sinks and multiple formats to support different use cases and different read/write latency requirements. Here are some guidelines:

*   File data stores are good for write once (append only), read many use cases.  CSV and JSON data formats give excellent write path performance but are slower for reading; these formats are good candidates for collecting raw data for example logs, which require high throughput writes. Parquet is slower for writing but gives the best performance for reading;this format is good for BI and analytics, which require low latency reads.
*   Apache HBase and MapR Database (now part of [HPE Ezmeral Data Fabric](https://www.hpe.com/us/en/software/data-fabric.html)) are good for random read/write use cases. MapR Database supports consistent, predictable, high throughput, fast reads and writes with efficient updates, automatic partitioning, and sorting.
*   Apache Kafka and MapR Event Store for Kafka (also now part of [HPE Ezmeral Data Fabric](https://www.hpe.com/us/en/software/data-fabric.html)) are good for scalable reading and writing of real-time streaming data.  MapR Event Store is good for data pipelines with stream-first architecture patterns and kappa or lambda architectures.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/image13-1594188803710.png)

### CSV and JSON Tips and Best Practices

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/image8-1594188812308.png)

When persisting and compressing CSV and JSON files, make sure they are splittable, give high speeds, and yield reasonable compression. ZIP compression is not splittable, whereas Snappy is splittable; Snappy also gives reasonable compression with high speed.  When reading CSV and JSON files, you will get better performance by specifying the schema, instead of using inference; specifying the schema reduces errors for data types and is recommended for production code.

### Parquet Tips and Best Practices

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/image16-1594188820503.png)

Apache Parquet gives the fastest read performance with Spark. Parquet arranges data in columns, putting related values in close proximity to each other to optimize query performance, minimize I/O, and facilitate compression. Parquet detects and encodes the same or similar data, using a technique that conserves resources. Parquet also stores column metadata and statistics, which can be pushed down to filter columns (discussed below).  Spark 2.x has a vectorized Parquet reader that does decompression and decoding in column batches, providing ~ 10x faster read performance.  

Parquet files are immutable; modifications require a rewrite of the dataset. For streaming data, you can stream to a fast read/write data store, then extract data to Parquet files for specific analytic use cases or stream new datasets to a new partition (see partitioning below).

### Parquet Partitioning

Spark table partitioning optimizes reads by storing files in a hierarchy of  directories based on partitioning columns.  For example, a directory structure could be organized by location, such as state/city, or by date, such as year/month, shown below:

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/image7-1594188830995.png)

DataFrames can be saved as persistent tables into a Hive metastore, using the [saveAsTable](https://spark.apache.org/docs/latest/sql-data-sources-load-save-functions.html) command. If you do not have Hive setup, Spark will create a default local Hive metastore (using Derby). Persistent tables have several optimization benefits: partition and statistic metadata, and they can be bucketed (discussed later).

As an example with the flight dataset, a lot of queries about departure delays are organized around the originating airport (the src column), so this could make a good partitioning column.  Here is a JSON row from this Dataset:

```json
{    
"id": "ATL_LGA_2017-01-01_AA_1678",
"dofW": 7,
"carrier": "AA",
"src": "ATL",
"dst": "LGA",
"crsdephour": 17,
"crsdeptime": 1700,
"depdelay": 0.0,
"crsarrtime": 1912,
"arrdelay": 0.0,
"crselapsedtime": 132.0,
"dist": 762.0
}
```

Here is the code to persist a flights DataFrame as a table consisting of Parquet files partitioned by the src column:

```markdown
df.write.format("parquet")
.partitionBy("src")
.option("path", "/user/mapr/data/flights")
.saveAsTable("flights")
```

Below is the resulting directory structure as shown by a Hadoop list files command:

```markdown
hadoop fs -ls /user/mapr/data/flights
  /user/mapr/data/flights/src=ATL
  /user/mapr/data/flights/src=BOS
  /user/mapr/data/flights/src=CLT
  /user/mapr/data/flights/src=DEN
  /user/mapr/data/flights/src=DFW
  /user/mapr/data/flights/src=EWR
  /user/mapr/data/flights/src=IAH
  /user/mapr/data/flights/src=LAX
  /user/mapr/data/flights/src=LGA
  /user/mapr/data/flights/src=MIA
  /user/mapr/data/flights/src=ORD
  /user/mapr/data/flights/src=SEA
  /user/mapr/data/flights/src=SFO
```

Below, we see that the src=DEN subdirectory contains two Parquet files:

```markdown
hadoop fs -ls /user/mapr/data/flights/src=DEN

/user/mapr/data/flights/src=DEN/part-00000-deb4a3d4-d8c3-4983-8756-ad7e0b29e780.c000.snappy.parquet
/user/mapr/data/flights/src=DEN/part-00001-deb4a3d4-d8c3-4983-8756-ad7e0b29e780.c000.snappy.parquet
```

### Partition Pruning and Predicate Pushdown

Partition pruning is a performance optimization that limits the number of files and partitions that Spark reads when querying.  After partitioning the data, queries that match certain partition filter criteria improve performance by allowing Spark to only read a subset of the directories and files.  When partition filters are present, the catalyst optimizer pushes down the partition filters. The scan reads only the directories that match the partition filters, thus reducing disk I/O. For example, the following query reads only the files in the src=DEN partition directory in order to query the average departure delay for flights originating from Denver.

```markdown
df.filter("src = 'DEN' and depdelay > 1")
.groupBy("src", "dst").avg("depdelay")
.sort(desc("avg(depdelay)")).show()

result:
+---+---+------------------+
|src|dst|     avg(depdelay)|
+---+---+------------------+
|DEN|EWR|54.352020860495436|
|DEN|MIA| 48.95263157894737|
|DEN|SFO|47.189473684210526|
|DEN|ORD| 46.47721518987342|
|DEN|DFW|44.473118279569896|
|DEN|CLT|37.097744360902254|
|DEN|LAX|36.398936170212764|
|DEN|LGA| 34.59444444444444|
|DEN|BOS|33.633187772925766|
|DEN|IAH| 32.10775862068966|
|DEN|SEA|30.532345013477087|
|DEN|ATL| 29.29113924050633|
+---+---+------------------+
```

Or in SQL:

```sql
%sql
select src, dst, avg(depdelay)
from flights where src='DEN' and depdelay > 1
group by src, dst
ORDER BY src
```

You can see the physical plan for a DataFrame query in the Spark web UI SQL tab (discussed in chapter 3) or by calling the explain method shown below. Here in red, we see partition filter push down, which means that the src=DEN filter is pushed down into the Parquet file scan. This minimizes the files and data scanned and reduces the amount of data passed back to the Spark engine for the aggregation average on the departure delay.

```markdown
df.filter("src = 'DEN' and depdelay > 1")
.groupBy("src", "dst").avg("depdelay")
.sort(desc("avg(depdelay)")).explain

== Physical Plan ==
TakeOrderedAndProject(limit=1001, orderBy=[avg(depdelay)#304 DESC NULLS LAST], output=[src#157,dst#149,avg(depdelay)#314])

+- \*(2) HashAggregate(keys=[src#157, dst#149],
       functions=[avg(depdelay#152)],
       output=[src#157, dst#149, avg(depdelay)#304])

   +- Exchange hashpartitioning(src#157, dst#149, 200)

+- \*(1) HashAggregate(keys=[src#157, dst#149],
              functions=[partial_avg(depdelay#152)],  output=[src#157,  dst#149,
              sum#321, count#322L])

+- \*(1) Project[dst#149, depdelay#152, src#157]
     +- \*(1)Filter (isnotnull(depdelay#152) && (depdelay#152 > 1.0))

+- \*(1) FileScan parquet default.flights[dst#149,depdelay#152,src#157] Batched: true, Format: Parquet, Location: PrunedInMemoryFileIndex[maprfs:/user/mapr/data/flights/src=DEN], PartitionCount: 1, PartitionFilters: [isnotnull(src#157), (src#157 = DEN)], PushedFilters: [IsNotNull(depdelay), GreaterThan(depdelay,1.0)],
ReadSchema: struct<dst:string,depdelay:double&gt;
```

The physical plan is read from the bottom up, whereas the DAG is read from the top down. Note: the Exchange means a shuffle occurred between stages.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/image2-1594188838987.png)

### Partitioning Tips

The partition columns should be used frequently in queries for filtering and should have a small range of values with enough corresponding data to distribute the files in the directories. You want to avoid too many small files, which make scans less efficient with excessive parallelism.  You also want to avoid having too few large files, which can hurt parallelism.

### Coalesce and Repartition

Before or when writing a DataFrame, you can use dataframe.coalesce(N) to reduce the number of partitions in a DataFrame, without shuffling, or df.repartition(N) to reorder and either increase or decrease the number of partitions with shuffling data across the network to achieve even load balancing.

```markdown
df.write.format("parquet")
.repartition(13)
.partitionBy("src")
.option("path", "/user/mapr/data/flights")
.saveAsTable("flights")
```

### Bucketing

Bucketing is another data organization technique that groups data with the same bucket value across a fixed number of “buckets.”  This can improve performance in wide transformations and joins by avoiding “shuffles.”  With wide transformation shuffles, data is sent across the network to other nodes and written to disk, causing network and disk I/O and making the shuffle a costly operation. Below is a shuffle caused by a df.groupBy("carrier").count; if this dataset were bucketed by “carrier,” then the shuffle could be avoided.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/image14-1594188846233.png)

Bucketing is similar to partitioning, but partitioning creates a directory for each partition, whereas bucketing distributes data across a fixed number of buckets by a hash on the bucket value.  Tables can be bucketed on more than one value and bucketing can be used with or without partitioning.

As an example with the flight dataset, here is the code to persist a flights DataFrame as a table, consisting of Parquet files partitioned by the src column and bucketed by the dst and carrier columns (sorting by the id will sort by the src, dst, flightdate, and carrier, since that is what the id is made up of):

```markdown
df.write.format("parquet")
.sortBy("id")
.partitionBy("src")
.bucketBy(4,"dst","carrier")
.option("path", "/user/mapr/data/flightsbkdc")
.saveAsTable("flightsbkdc")
```

The resulting directory structure is the same as before, with the files in the src directories bucketed by dst and carrier.  The code below computes statistics on the table, which can then be used by the Catalyst optimizer.  Next, the partitioned and bucketed table is read into a new DataFrame df2.

```markdown
spark.sql("ANALYZE TABLE flightsbkdc COMPUTE STATISTICS")
val df2  = spark.table("flightsbkdc")
```

Next, let’s look at the optimizations for the following query:

```markdown
df2.filter("src = 'DEN' and depdelay > 1")
.groupBy("src", "dst","carrier")
.avg("depdelay")
.sort(desc("avg(depdelay)")).show()

result:
+---+---+-------+------------------+
|src|dst|carrier|     avg(depdelay)|
+---+---+-------+------------------+
|DEN|EWR|     UA| 60.95841209829867|
|DEN|LAX|     DL|59.849624060150376|
|DEN|SFO|     UA|59.058282208588956|
. . .
```

Here again, we see partition filter and filter pushdown, but we also see that there is no “Exchange” like there was before bucketing, which means there was no shuffle to aggregate by src, dst, and carrier.

```markdown
== Physical Plan ==
TakeOrderedAndProject(limit=1001, orderBy=[avg(depdelay)#491 DESC NULLS LAST], output=[src#460,dst#452,carrier#451,avg(depdelay)#504])

+- \*(1) HashAggregate(keys=[src#460, dst#452, carrier#451], functions=[avg(depdelay#455)], output=[src#460, dst#452, carrier#451, avg(depdelay)#491])
 +- \*(1) HashAggregate(keys=[src#460, dst#452, carrier#451], functions=[partial_avg(depdelay#455)], output=[src#460, dst#452, carrier#451, sum#512, count#513L])
  +- \*(1)Project [carrier#451, dst#452, depdelay#455, src#460]

   +- \*(1) Filter(isnotnull(depdelay#455) && (depdelay#455 > 1.0))

     +- \*(1) FileScan parquet default.flightsbkdc
          [carrier#451,dst#452,depdelay#455,src#460]
         Batched: true, Format: Parquet, Location:     PrunedInMemoryFileIndex
         [maprfs:/user/mapr/data/flightsbkdc/src=DEN],
         PartitionCount: 1, PartitionFilters: [isnotnull(src#460), (src#460 = DEN)],
 PushedFilters: [IsNotNull(depdelay), GreaterThan(depdelay,1.0)],
         ReadSchema:
struct<carrier:string,dst:string,depdelay:double&gt;
```

In the DAG below, we see that there is no exchange shuffle, and we see “Whole-Stage Java Code Generation,” which optimizes CPU usage by generating a single optimized function in bytecode.  

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/image15-1594188853521.png)

### Bucketing Tips

Partitioning should only be used with columns that have a limited number of values; bucketing works well when the number of unique values is large. Columns which are used often in queries and provide high selectivity are good choices for bucketing.  Spark tables that are bucketed store metadata about how they are bucketed and sorted, which optimizes:

*   Queries on bucketed values (Spark 2.4 supports bucket pruning)
*   Aggregations on bucketed values (wide transformations)
*   Joins on bucketed values

## Data Modeling, Partitioning, and Filter Pushdown

### Data Modeling: Partitioning and Row Key Design

With MapR Database (now part of [HPE Ezmeral Data Fabric](https://www.hpe.com/us/en/software/data-fabric.html)), a table is automatically partitioned into tablets across a cluster by key range, providing for scalable and fast reads and writes by row key.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/image6-1594188884373.png)

In this use case, the row key (the id) starts with the origin (destination airport codes), followed by the flightdate and carrier, so the table is automatically partitioned and sorted by the src, dst, date, and carrier.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/image4-1594188895684.png)

### Data Modeling: Avoiding JOINS with Nested Entities

If your tables exist in a one-to-many relationship, it’s possible to model it as a single document; this can avoid expensive JOINS. In the one-to-many relationship example below, we have an order table, which has a one-to-many relationship with an order items table.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/image5-1594188904918.png)

Here is a nested entity example of this one-to-many relationship in a document database.  In this example, the order and related line items are stored together and can be read together with a find on the row key (\_id). This makes the reads a lot faster than joining tables together.

```markdown
{
     “id”: “123”,
     “date”: “10/10/2017”,
     “ship_status”:”backordered”
     “orderitems”: \[
          {
               “itemid”: “4348”,
               “price”: 10.00
          },
          {
               “itemid”: “5648”,
               “price”: 15.00
          }]
}
```

### Projection and Filter Pushdown into MapR Database (now part of [HPE Ezmeral Data Fabric](https://www.hpe.com/us/en/software/data-fabric.html))

Below, we see the physical plan for a DataFrame query, with projection and filter pushdown highlighted in red. This means that the scanning of the src, dst, and depdelay columns and the filter on the depdelay column are pushed down into MapR Database, meaning that the scanning and filtering will take place in MapR Database before returning the data to Spark. Projection pushdown minimizes data transfer between MapR Database and the Spark engine by omitting unnecessary fields from table scans. It is especially beneficial when a table contains many columns. Filter pushdown improves performance by reducing the amount of data passed between MapR Database and the Spark engine when filtering data.

```markdown
df.filter("src = 'ATL' and depdelay > 1")
.groupBy("src", "dst")
.avg("depdelay").sort(desc("avg(depdelay)")).explain

== Physical Plan ==
\*(3) Sort [avg(depdelay)#273 DESC NULLS LAST], true, 0
+- Exchange rangepartitioning(avg(depdelay)#273 DESC NULLS LAST, 200)
   +- \*(2) HashAggregate(keys=[src#5, dst#6],
         functions=[avg(depdelay#9)])
      +- Exchange hashpartitioning(src#5, dst#6, 200)
         +- \*(1) HashAggregate(keys=[src#5, dst#6],
            functions=[partial_avg(depdelay#9)])
            +- \*(1) Filter (((isnotnull(src#5) &&
                isnotnull(depdelay#9)) &&
                            (src#5 = ATL)) && (depdelay#9 > 1.0))
               +- \*(1) Scan MapRDBRelation(/user/mapr/flighttable [src#5,dst#6,depdelay#9] PushedFilters: [IsNotNull(src), IsNotNull(depdelay), EqualTo(src,ATL), GreaterThan(depdelay,1.0)]
```

## Spark Web UI and SQL Tips

Here is a summary of tips and what to look for:

### SQL Tab

You can see details about the query plan produced by Catalyst on the web UI SQL tab.  In the query plan details, you can check and see:

*   The amount of time for each stage.
*   If partition filters, projection, and filter pushdown are occurring.
*   Shuffles between stages (Exchange) and the amount of data shuffled. If joins or aggregations are shuffling a lot of data, consider bucketing.  You can set the number of partitions to use when shuffling with the spark.sql.shuffle.partitions option.
*   The join algorithm being used. Broadcast join should be used when one table is small; sort-merge join should be used for large tables.  You can use broadcast hint to guide Spark to broadcast a table in a join. For faster joins with large tables using the sort-merge join algorithm, you can use bucketing to pre-sort and group tables; this will avoid shuffling in the sort merge.

Use the Spark SQL `ANALYZE TABLE tablename COMPUTE STATISTICS` to take advantage of cost-based optimization in the Catalyst Planner.

### Stages Tab

You can use the stage detail metrics to identify problems with an executor or task distribution.  Things to look for:

*   Tasks that are taking longer and/or killed tasks. If your task process time is not balanced, resources could be wasted.  
*   Shuffle read size that is not balanced.
*   If your partitions/tasks are not balanced, then consider repartition as described under partitioning.

### Storage Tab

Caching Datasets can make execution faster if the data will be reused. You can use the storage tab to see if important Datasets are fitting into memory.

### Executors Tab

You can use the executors tab to confirm that your application has the amount of resources needed.

*   Shuffle Read Write Columns: shows size of data transferred between stages
*   Storage Memory Column: shows the current used/available memory
*   Task Time Column: shows task time/garbage collection time

## References and More Information

*   [Project Tungsten: Bringing Apache Spark Closer to Bare Metal](https://databricks.com/blog/2015/04/28/project-tungsten-bringing-spark-closer-to-bare-metal.html)
*   [Apache Spark as a Compiler](https://databricks.com/blog/2016/05/23/apache-spark-as-a-compiler-joining-a-billion-rows-per-second-on-a-laptop.html)
*   [Apache Spark SQL Performance Tuning](https://spark.apache.org/docs/latest/sql-performance-tuning.html)
*   [Spark Summit Session: Optimizing Apache Spark SQL Joins](https://databricks.com/session/optimizing-apache-spark-sql-joins)
*   [Diving into Spark and Parquet Workloads, by Example](https://db-blog.web.cern.ch/blog/luca-canali/2017-06-diving-spark-and-parquet-workloads-example)
*   [Spark Summit Hive Bucketing in Apache Spark](https://databricks.com/session/hive-bucketing-in-apache-spark)
*   [Lessons from the Field, Episode II: Applying Best Practices to Your Apache Spark Applications](https://databricks.com/session/lessons-from-the-field-episode-ii-applying-best-practices-to-your-apache-spark-applications)
*   [Why You Should Care about Data Layout in the Filesystem](https://databricks.com/session/why-you-should-care-about-data-layout-in-the-filesystem)
*   [Spark + Parquet In Depth](https://databricks.com/session/spark-parquet-in-depth)
*   [Apache Spark: Config Cheatsheet](http://c2fo.io/c2fo/spark/aws/emr/2016/07/06/apache-spark-config-cheatsheet/)
*   [Spark Configuration](https://spark.apache.org/docs/latest/configuration.html)
*   [Apache Spark: Debugging and Logging Best Practices](https://dzone.com/articles/talend-and-apache-spark-debugging-and-logging-best)

**Editor’s Note:** MapR products referenced are now part of the [HPE Ezmeral Data Fabric](https://www.hpe.com/us/en/software/data-fabric.html).