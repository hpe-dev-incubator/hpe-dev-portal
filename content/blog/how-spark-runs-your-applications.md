---
title: "How Spark Runs Your Applications"
date: 2020-11-18T23:48:48.210Z
author: Carol McDonald 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","apache-spark","opensource"]
authorimage: "/img/blogs/Avatar1.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019, may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
"authorDisplayName": "Carol McDonald",
"publish": "2018-10-31T07:00:00.000Z",
"tags": "apache-spark"
```

---

Recall that your Spark application runs as a set of parallel tasks. In this blog post, we will go over how Spark translates Dataset transformations and actions into an execution model.  

With Spark 2.0 and later versions, big improvements were implemented to make Spark easier to program and execute faster.

In order to understand how your application runs on a cluster, an important thing to know about Dataset transformations is that they fall into two types, narrow and wide, which we will discuss first, before explaining the execution model.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/image18-1605743734060.png)

## Narrow and Wide Transformations  

As a review, transformations create a new Dataset from an existing one.  Narrow transformations do not have to move data between partitions when creating a new dataset from an existing one. Some example narrow transformations are `filter` and `select`, which are used in the example below to retrieve flight information for the carrier "AA":

```scala
// select and filter are narrow transformations
df.select($"carrier",$"origin",  $"dest", $"depdelay", $"crsdephour").filter($"carrier" === "AA" ).show(2)

result:
+-------+------+----+--------+----------+
|carrier|origin|dest|depdelay|crsdephour|
+-------+------+----+--------+----------+
|     AA|   ATL| LGA|     0.0|        17|
|     AA|   LGA| ATL|     0.0|        13|
+-------+------+----+--------+----------+
```

Multiple narrow transformations can be performed on a Dataset in memory, in a process called pipelining, making narrow transformations very efficient.

Wide transformations cause data to be moved between partitions when creating a new Dataset, in a process called the shuffle.  With wide transformation shuffles, data is sent across the network to other nodes and written to disk, causing network and disk I/O, and making the shuffle a costly operation. Some example wide transformations are `groupBy`, `agg`, `sortBy`, and `orderBy`. Below is a wide transformation to count the number of flights by carrier.

```scala
df.groupBy("carrier").count.show
result:

+-------+-----+
|carrier|count|
+-------+-----+
|     UA|18873|
|     AA|10031|
|     DL|10055|
|     WN| 2389|
+-------+-----+
```

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/image12-1605743742466.png)

## The Spark Execution Model

The Spark execution model can be defined in three phases: creating the logical plan, translating that into a physical plan, and then executing the tasks on a cluster.

You can view useful information about your Spark jobs in real time in a web browser with this URL: http://<driver-node>:4040. For Spark applications that have finished, you can use the Spark history server to see this information in a web browser at this URL: http://<server-url>:18080.  Let’s walk through the three phases and the Spark UI information about the phases, with some example code.

## The Logical Plan

In the first phase, the logical plan is created. This is the plan that shows which steps will be executed when an action gets applied. Recall that when you apply a transformation on a Dataset, a new Dataset is created. When this happens, that new Dataset points back to the parent, resulting in a lineage or directed acyclic graph (DAG) for how Spark will execute these transformations.  

## The Physical Plan

Actions trigger the translation of the logical DAG into a physical execution plan. The Spark Catalyst query optimizer creates the physical execution plan for DataFrames, as shown in the diagram below:

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/image9-1605743750828.png)

_(Image reference: Databricks)_

The physical plan identifies resources, such as memory partitions and compute tasks, that will execute the plan.

## Viewing the Logical and Physical Plan

You can see the logical and physical plan for a Dataset by calling the `explain(true)` method. In the code below, we see that the DAG for df2 consists of a `FileScan`, a `Filter` on `depdelay`, and a `Project` (selecting columns).

```scala
import org.apache.spark.sql.types._
import org.apache.spark.sql._
import org.apache.spark.sql.functions._

var file = "maprfs:///data/flights20170102.json"

case class Flight(_id: String, dofW: Long, carrier: String, origin: String, dest: String, crsdephour: Long, crsdeptime: Double, depdelay: Double,crsarrtime: Double, arrdelay: Double, crselapsedtime: Double, dist: Double) extends Serializable

val df = spark.read.format("json").option("inferSchema", "true").load(file).as[Flight]

val df2 = df.filter($"depdelay" > 40)

df2.take(1)

result:
Array[Flight] = Array(Flight(MIA_IAH_2017-01-01_AA_2315, 7,AA,MIA,IAH,20,2045.0,80.0,2238.0,63.0,173.0,964.0))

df2.explain(true)

result:
== Parsed Logical Plan ==
'Filter ('depdelay > 40)
+- Relation[_id#8,arrdelay#9,…] json

== Analyzed Logical Plan ==
_id: string, arrdelay: double…
Filter (depdelay#15 > cast(40 as double))
+- Relation[_id#8,arrdelay#9…] json

== Optimized Logical Plan ==
Filter (isnotnull(depdelay#15) && (depdelay#15 > 40.0))
+- Relation[_id#8,arrdelay#9,…] json

== Physical Plan ==
*Project [_id#8, arrdelay#9,…]
+- *Filter (isnotnull(depdelay#15) && (depdelay#15 > 40.0))
   +- *FileScan json [_id#8,arrdelay#9,…] Batched: false, Format: JSON, Location: InMemoryFileIndex[maprfs:///..],
```

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/image11-1605743758827.png)

You can see more details about the plan produced by Catalyst on the web UI SQL tab (http://<driver-node>:4040/SQL/).  Clicking on the query description link displays the DAG and details for the query.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/image19-1605743768630.png)

In the code below, after the `explain`, we see that the physical plan for df3 consists of a `FileScan`, `Filter`, `Project`, `HashAggregate`, `Exchange`, and `HashAggregate`. The **Exchange** is the shuffle caused by the `groupBy` transformation. Spark performs a hash aggregation for each partition before shuffling the data in the Exchange. After the exchange, there is a hash aggregation of the previous sub-aggregations. Note that we would have an in-memory scan instead of a file scan in this DAG, if df2 were cached.  

```scala
val df3 = df2.groupBy("carrier").count

df3.collect

result:
Array[Row] = Array([UA,2420], [AA,757], [DL,1043], [WN,244])

df3.explain

result:
== Physical Plan ==
*HashAggregate(keys=[carrier#124], functions=[count(1)])
+- Exchange hashpartitioning(carrier#124, 200)
+- *HashAggregate(keys=[carrier#124], functions=[partial_count(1)])
      +- *Project [carrier#124]
         +- *Filter (isnotnull(depdelay#129) && (depdelay#129 > 40.0))
+- *FileScan json [carrier#124,depdelay#129]
```

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/image6-1605743777932.png)

Clicking on the SQL tab link for this query displays the DAG below.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/image5-1605743786007.png)

## Executing the Tasks on a Cluster

In the third phase, the tasks are scheduled and executed on the cluster. The scheduler splits the graph into stages, based on the transformations. The narrow transformations (transformations without data movement) will be grouped (pipe-lined) together into a single stage. The physical plan for this example has two stages, with everything before the exchange in the first stage.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/image16-1605743813015.png)

Each stage is comprised of tasks, based on partitions of the Dataset, which will perform the same computation in parallel.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/image17-1605743851321.png)

The scheduler submits the stage task set to the task scheduler, which launches tasks via a cluster manager. These phases are executed in order, and the action is considered complete when the final phase in a job completes. This sequence can occur many times when new Datasets are created.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/image4-1605743864900.png)

Here is a summary of the components of execution:

*   **Task:** a unit of execution that runs on a single machine
*   **Stage:** a group of tasks, based on partitions of the input data, which will perform the same computation in parallel
*   **Job:** has one or more stages
*   **Pipelining:** collapsing of Datasets into a single stage, when Dataset transformations can be computed without data movement
*   **DAG:** Logical graph of Dataset operations

## Exploring the Task Execution on the Web UI

Here is a screenshot of the web UI Jobs tab, after running the code above. The Jobs page gives you detailed execution information for active and recently completed Spark jobs. It gives you the performance of a job and also the progress of running jobs, stages, and tasks. In this example, Job Id 2 is the job that was triggered by the `collect` action on df3.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/image2-1605743873603.png)

Clicking the link in the Description column on the Jobs page takes you to the Job Details page. This page gives you details on the progress of the job, stages, and tasks.  We see this job consists of 2 stages, with 2 tasks in the stage before the shuffle and 200 in the stage after the shuffle.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/image15-1605743880620.png)

The number of tasks correspond to the partitions: after reading the file in the first stage, there are 2 partitions; after a `shuffle`, the default number of partitions is 200. You can see the number of partitions on a Dataset with the `rdd.partitions.size` method shown below.

```scala
df3.rdd.partitions.size
result: Int = 200

df2.rdd.partitions.size
result: Int = 2
```

Under the Stages tab, you can see the details for a stage by clicking on its link in the description column.  

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/image8-1605743887018.png)

Here we have summary metrics and aggregated metrics for tasks and aggregated metrics by executor.  You can use these metrics to identify problems with an executor or task distribution. If your task process time is not balanced, then resources could be wasted.

The Storage tab provides information about persisted Datasets. The Dataset is persisted if you called Persist or Cache on the Dataset, followed by an action to compute on that Dataset. This page tells you which fraction of the Dataset’s underlying RDD is cached and the quantity of data cached in various storage media. Look at this page to see if important Datasets are fitting into memory. You can also click on the link to view more details about the persisted Dataset. If you no longer need a cached Dataset, you can call `Unpersist` to uncache it.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/image7-1605743893255.png)

Try caching df2, performing an action, then seeing how this gets persisted on the storage tab and how it changes the plan and execution time for df3 on the job details page. Notice how the execution time is faster after caching.

```scala
df2.cache
df2.count
df3.collect
```

Notice how the first stage is skipped in job4, when df2 is cached and df3 collect is executed again.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/image14-1605743900253.png)

The Environment tab lists all the active properties of your Spark applicationenvironment. Use this page when you want to see which configuration flags are enabled.  Only values specified through spark-defaults.conf, SparkSession, or the command line will be displayed here. For all other configuration properties, the default value is used.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/image3-1605743907003.png)

Under the Executors tab, you can see processing and storage for each executor:

*   **Shuffle Read Write Columns:** shows size of data transferred between stages
*   **Storage Memory Column:** shows the current used/available memory
*   **Task Time Column:** shows task time/garbage collection time

Use this page to confirm that your application has the amount of resources you were expecting.  You can look at the thread call stack by clicking on the thread dump link.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/image20-1605743914411.png)

## Summary

In this post, we discussed the Spark execution model, and we explored task execution on the Spark Web UI. This understanding of how Spark runs your applications is important when debugging, analyzing, and tuning the performance of your applications.