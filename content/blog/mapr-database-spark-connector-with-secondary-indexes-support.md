---
title: "MapR Database Spark Connector with Secondary Indexes Support"
date: 2021-02-19T05:57:39.803Z
author: Nicolas Perez 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","apache-spark"]
authorimage: "/img/blogs/Avatar6.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019 may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
"authorDisplayName": ["Nicolas A Perez"],
"publish": "2019-03-08T07:00:00.000Z",
"tags": "apache-spark"
```

---

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/image2-1613714507521.jpg)

MapR Data Platform offers significant advantages over any other tool on the big data space. MapR Database is one of the core components of the platform, and it offers state-of-the-art capabilities that blow away most of the NoSQL databases out there.

An important add-on to MapR Database is the ability to use, for writing and querying, Apache Spark through the [_**Connector for Apache Spark**_](https://docs.datafabric.hpe.com/61/Spark/SparkConnectorsMapRDB.html). Using this connector comes in very handy, since it can read and write from Spark to MapR Database, using the different Spark APIs, such as RDDs, [DataFrames](https://docs.datafabric.hpe.com/60/Spark/SparkSQLandDataFrames.html), and Streams.

Using the connector, we can issue queries like the following one:

```scala
val df: DataFrame = sparkSession.loadFromMapRDB("/tmp/user_profiles", someSchema)
```

The resulting type is a `DataFrame` that we can use as any other DataFrame from any other source, as we normally do in Spark.

But when using the provided connector for Apache Spark, and if we filter our dataset out, problems may start to emerge as any filter that is being applied to a field that is part of an index will not be used by the connector to optimize the reading from MapR Database. For instance, let's look at the following query:

```scala
val df = sparkSession.loadFromMapRDB("/tmp/user_profiles")

val filteredDF = df.filter("first_name = 'Bill'")
```

The filter is being pushed down, so MapR Database does the filtering and only sends back the data that complies with the filter, reducing the amount of data transferred between MapR Database and Spark. However, if the field ***first_name*** is part of an index, the index is ignored and the table is fully scanned, trying to find the rows that comply with the filter resulting in a non-optimized query.

By having an index on a field, we expect to use it so queries on that field are optimized, ultimately speeding up the computation. The provided connector for Apache Spark is simply not using the index capabilities of MapR Database to optimize the reading from MapR Database.

## Necessity

Our team, MapR Professional Services, knows that filtering using MapR Database secondary indexes makes a huge difference in performance. Since many of our customers actually try to take advantages of this feature (secondary indexes), we have taken different approaches in order to force the use of the indexes when using Spark.

In another blog post, "[_**How to Use Secondary Indexes in Spark with OJAI**_](/blog/GJVN37RWmoumz0L2LM8V/how-to-use-secondary-indexes-in-spark-with-open-json-application-interfa)," a fellow coworker explains some ways to overcome the issue on hand.

Even when we take some shortcuts, we have to give up some of the nice constructs the default connector has, such as `.loadFromMapRDB(...)`. Even though this solution is not scalable, we can use some of these ideas, which aim generalizing the concept that can be used for general purpose computation with Spark in a generic approach.

## An Independent Connector

In the past, I have extended Apache Spark in _**so**_ many ways. I have written my own [_**Custom Data Sources**_](https://hackernoon.com/extending-our-spark-sql-query-engine-5f4a088de986) and most recently a [_**Custom Streaming Source for Spark Structured Streams**_](https://hackernoon.com/spark-custom-stream-sources-ec360b8ae240).

Once again, I have sailed into the adventure of writing my own Spark data source, but this time for MapR Database, so we can leverage the full advantage of secondary indexes while keeping the same API that the current MapR Database Connector for Apache Spark already has.

By the end of this post, we will be able to write a query in the following way while fully using secondary indexes:

```scala
val schema = StructType(Seq(StructField("_id", StringType), StructField("uid", StringType)))

val data = sparkSession
  .loadFromMapRDB("/user/mapr/tables/data", schema)
  .filter("uid = '101'")
  .select("_id")

data.take(3).foreach(println)
```

## Spark Data Sources, Version 2

The following data source implementation uses Spark 2.3.1 and uses the data source API V2.

Let's start by looking at the things we need.

1.  **ReadSupportWithSchema**, which allows us to create a DataSourceReader.
2.  **DataSourceReader**, which allows us to get the schema for our data, while we specify how to create a **DataReaderFactory**.
3.  **SupportsPushDownFilters**, which allows us to intercept the query filters, so we can push them down to MapR Database.
4.  **SupportsPushDownRequiredColumns**, which allows us to intercept the query projections, so we can push them down to MapR Database.

Let's start by implementing `ReadSupportWithSchema`.

```scala
class Reader extends ReadSupportWithSchema {

  override def createReader(schema: StructType, options: DataSourceOptions): DataSourceReader = {

    val tablePath = options.get("path").get()

    new MapRDBDataSourceReader(schema, tablePath)
  }
}
```

As we can see, we simply get the table path and the schema we want to use when reading from MapR Database. Then we pass them to `MapRDBDataSourceReader`.

## MapRDBDataSourceReader

`MapRDBDataSourceReader` implements `DataSourceReader`, and we are also mixing in `SupportsPushDownFilters` and `SupportsPushDownRequiredColumns` to indicate that we want to push filters and projections down to MapR Database.

Let's look at each piece separately, so we can understand them better.  

```scala
class MapRDBDataSourceReader(schema: StructType, tablePath: String)
  extends DataSourceReader
    with SupportsPushDownFilters
    with SupportsPushDownRequiredColumns {

  private var projections: Option[StructType] = None

  override def readSchema(): StructType = ???

  override def pushFilters(filters: Array[Filter]): Array[Filter] = ???

  override def pushedFilters(): Array[Filter] = ???

  override def pruneColumns(requiredSchema: StructType): Unit = ???

  override def createDataReaderFactories(): util.List[DataReaderFactory[Row]] = ???

}
```

The `projections` variable will hold the schema we want to project, if any. In case we don't explicitly project fields by doing `.select`, we will project all the fields on the `schema` variable.

`readSchema` works in conjunction with `projections` and `pruneColumns`. If in our Spark query we specify a `select`, then the selected fields are passed to `pruneColumns`, and those are the only fields we will bring from MapR Database.

```scala
private var projections: Option[StructType] = None

override def readSchema(): StructType = projections match {
  case None                  => schema
  case Some(fieldsToProject) => fieldsToProject
}

override def pruneColumns(requiredSchema: StructType): Unit = projections =
  Some(requiredSchema)
```

`pushFilters` indicates what filters we have specified in the `where` or `filter` clause in our Spark query. Basically, we have to decide which of those we want to push down to MapR Database; the other ones will be applied by Spark after the data is in memory.

```scala
private var supportedFilters: List[Filter] = List.empty

override def pushFilters(filters: Array[Filter]): Array[Filter] =
 filters.partition(isSupportedFilter) match {
   case (supported, unsupported) =>
     supportedFilters = supported.toList

     unsupported
 }

override def pushedFilters(): Array[Filter] = supportedFilters.toArray

private def isSupportedFilter(filter: Filter) = filter match {
 case _: And => true
 case _: Or => true
 case _: IsNull => true
 case _: IsNotNull => true
 case _: In => true
 case _: StringStartsWith => true
 case _: EqualTo => true
 case _: LessThan => true
 case _: LessThanOrEqual => true
 case _: GreaterThan => true
 case _: GreaterThanOrEqual => true

 case _ => false
}
```

In the snippet above, the series of filters we are pushing down match the filters handled by the official connector, so we provide the same functionality as the official connector at this level.

`createDataReaderFactories` creates a list of data readers that actually do the heavy work of reading from our source, MapR Database. In our case here, we are getting the table information and creating a reader for each region/partition in the table, so we can take advantage of the parallelism offered by MapR Database.

```scala
override def createDataReaderFactories(): util.List[DataReaderFactory[Row]] =
    com.mapr.db.MapRDB
       .getTable(tablePath)
       .getTabletInfos
       .zipWithIndex
       .map { case (descriptor, idx) =>
          logTabletInfo(descriptor, idx)

          MapRDBTabletInfo(idx,
                           descriptor.getLocations,           
                           descriptor.getCondition.asJsonString)
       }
       .map(createReaderFactory)
       .toList

private def createReaderFactory(tabletInfo: MapRDBTabletInfo) =
 new MapRDBDataPartitionReader(
   tablePath,
   supportedFilters,
   readSchema(),
   tabletInfo,
   hintedIndexes)

}
```

## MapRDBDataPartitionReader

We are almost done, yet the most important part is about to come.

The `MapRDBDataPartitionReader` is where we actually build the MapR Database query and execute it in our MapR Database table. Notice that we are passing the table we are going to read from, and the filters and projections we want to push down, along with the partition each particular reader will be reading from. Remember that we are creating multiple instances of this class; each will read from a different MapR Database region/partition.

```scala
class MapRDBDataPartitionReader(table: String,
                               filters: List[Filter],
                               schema: StructType,
                               tabletInfo: MapRDBTabletInfo,
                               hintedIndexes: List[String]
) extends DataReaderFactory[Row] {

  override def createDataReader(): DataReader[Row] = ???
}
```

Now we need to connect to MapR Database by opening a connection and creating a document store object.

```scala
class MapRDBDataPartitionReader(table: String,
                               filters: List[Filter],
                               schema: StructType,
                               tabletInfo: MapRDBTabletInfo,
                               hintedIndexes: List[String]
) extends DataReaderFactory[Row] {


  import org.ojai.store._

  @transient private lazy val connection = DriverManager.getConnection("ojai:mapr:")

  @transient private lazy val store: DocumentStore = connection.getStore(table)

  override def createDataReader(): DataReader[Row] = ???
}
```

`query` creates the final command to be sent to MapR Database. This task is a matter of applying the query condition and the projections to our `connection` object.

```scala
private def query = {
  val condition = buildQueryConditionFrom(filters)(connection)

  val query = connection
    .newQuery()
    .select(schema.fields.map(_.name): _*)  // push projections down
    .where(condition)                       // push filters down
    .build()

  query
}
}
```

The `buildQueryConditionFrom` method reads the Spark filters and transforms them into OJAI filters with the corresponding data types; this is where we push the filters down.

*It is very important to notice that since we are using **OJAI**, it will automatically use any secondary indexes for fields that are part of the filters we are applying. Make sure you check the output at the end of this post.*

`documents` is a stream of data coming from MapR Database, based on `query`.

```scala
@transient private lazy val documents = {
  val queryResult = store.find(query)

  println(s"QUERY PLAN: ${queryResult.getQueryPlan}")

  queryResult.asScala.iterator
}
```

`createDataReader` uses the stream we have created (`documents`) to do the actual reading and returning of the data back to Spark.

```scala
override def createDataReader(): DataReader[Row] = new DataReader[Row] {
    override def next(): Boolean = documents.hasNext

    override def get(): Row = {
      val document = ParsableDocument(documents.next())

      val values = schema
                      .fields
                      .foldLeft(List.empty[Any])((xs, field) =>
                         document.get(field) :: xs)
                      .reverse

      Row.fromSeq(values)
    }

    override def close(): Unit = {
      store.close()
      connection.close()
    }
  }
```

Notice that `ParsableDocument(document).get(field)` handles the transformation from OJAI types back to Spark types. We support all OJAI types, except for *Interval*. Types are transformed recursively, so if we have a *Map* that has another *Map* inside with *Arrays* of *Ints*, we've got you covered.

## Using Our Connector

At this point, we are ready to plug in our custom data source into Spark in the following way:

```scala
sparkSession
  .read
  .format("com.github.anicolaspp.spark.sql.Reader")
  .schema(schema)
  .load(path)
```

This allows us to use our own way to read from MapR Database, so that any filter being applied that is part of a secondary index on the physical table will be used to optimize the reading.

## Syntax

In order to maintain a similar API to the one offered by the default MapR Database Connector, we added some syntax to our library in the following way:

```scala
object MapRDB {

  implicit class ExtendedSession(sparkSession: SparkSession) {

    def loadFromMapRDB(path: String, schema: StructType): DataFrame = {

      sparkSession
        .read
        .format("com.github.anicolaspp.spark.sql.Reader")
        .schema(schema)
        .load(path)
    }
  }

}
```

Notice that our `loadFromMapRDB` method requires a `schema` to be passed in. This is a small difference from the official connector that supports schema inference. However, this is a design decision, since we know that most of the time we have the schema available. On the other hand, we know that inferring the schema does not always work correctly on the official connector.

We can now use our connector in the same way we used the default/official connector.

```scala
val schema = StructType(Seq(StructField("_id", StringType), StructField("uid", StringType)))

val data = sparkSession
  .loadFromMapRDB("/user/mapr/tables/data", schema)
  .filter("uid = '101'")
  .select("_id")

data.take(3).foreach(println)
```

## Using MapR Database Secondary Indexes

When we run the code above, the **TRACE** output from **OJAI** looks similar to the following:

```scala
QUERY PLAN: {"QueryPlan":[
  [{
    "streamName":"DBDocumentStream",
    "parameters":{
      "queryConditionPath":false,
      "indexName":"uid_idx",
      "projectionPath":[
        "uid",
        "_id"
      ],
      "primaryTable":"/user/mapr/tables/data"
    }
  }
  ]
]}
```

Notice that it automatically uses the index called `uid_idx`, which is an index for the field `uid` that at the same time is the field being used in the Spark filter.

## Conclusions

MapR Database is a powerful tool that runs as part of the MapR Data Platform. The Spark Connector offers an interesting way to interact with MapR Database, since it allows us to use all Spark constructs at scale when working with this NoSQL system. However, sometimes the default connector falls short because it does not use the secondary index capabilities of MapR Database when we need them the most.

On the other hand, our implementation mimics the Connector API and ensures that the implemented Spark data source uses MapR Database secondary indexes, since it relies on pure OJAI queries that are able to support secondary indexes out of the box.

* * *

*Our library code can be found here: [MapRDBConnector](https://github.com/anicolaspp/MapRDBConnector).*

*You can get the binaries directly from Maven Central:*

```scala
<dependency>
  <groupId>com.github.anicolaspp</groupId>
  <artifactId>maprdbconnector_2.11</artifactId>
  <version>1.0.2</version>
</dependency>
```

Or using sbt:

```scala
libraryDependencies += "com.github.anicolaspp" % "maprdbconnector_2.11" % "1.0.2"
```

* * *

_Disclaimer: This is an independent effort to improve querying MapR Database. This library is not a substitute for the official [**Connector for Apache Spark**](https://docs.datafabric.hpe.com/61/Spark/SparkConnectorsMapRDB.html) offered by MapR as part of its distribution._

This blog post was originally published on [Medium](https://hackernoon.com/mapr-db-spark-connector-with-secondary-indexes-df41909f28ea?sk%3D3dd8eb1038b07bfbc11ae35c37f60743).