---
title: "Spark Custom Streaming Sources"
date: 2021-01-14T05:34:57.546Z
author: Nicolas Perez 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","apache-spark"]
authorimage: "/img/blogs/Avatar6.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019, may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
"authorDisplayName": ["Nicolas A Perez"],
"publish": "2019-03-14T07:00:00.000Z",
"tags": "apache-spark"
```

---

Apache Spark is one of the most versatile big data frameworks out there. The ability to mix different kinds of workloads, in memory processing and functional style, makes it desirable for anyone coming to code in the data processing world.

One important aspect of Spark is that it has been built for extensibility. Writing new connectors for the **RDD** API or extending the **DataFrame/Dataset** API allows third parties to integrate with Spark with ease. Most people will use one of the built-in APIs, such as Kafka for streams processing or JSON/CVS for file processing. However, there are times where we need more specific implementations, closer to us. For example, we might have a proprietary database we use in our company, and there will not be a connector for it. We can simply write one, as we explained in this previous post [_**Spark Data Source API. Extending Our Spark SQL Query Engine**_](/blog/XvlK6AnLW6cRQAzVL8XL/spark-data-source-api-extending-our-spark-sql-query-engine).

Starting with Spark 2.0, we could create sources from streams, which gave life to the *Spark Structured Streaming API*. As we would imagine, there are some built-in streaming sources, Kafka being one of them, alongside **FileStreamSource, TextSocketSource**, etc.

Using the new *Structured Streaming API* should be preferred over the old **DStream** API. However, the same problem as before presents again. How can we extend this new API, so we can use our own streaming sources? The answer to this question is in this blog post.

## Extensibility Points

Let's start by reviewing the main components that we need to touch on in order to create our own streaming source.

First of all, **StreamSourceProvider** is what indicates what source will be used as the stream reader.

Secondly, **DataSourceRegister** will allow us to register our source within Spark, so it becomes available to the stream processing.

Thirdly, **Source** is the interface that we need to implement, so we provide streaming source-like behavior.

## Our Streaming Source

For the sake of this post, we will implement a rather easy streaming source, but the same concepts apply to any streaming source that you need to implement on your own.

Our streaming source is called **InMemoryRandomStrings**. It basically generates a sequence of random strings and their length, which are viewed as a **DataFrame** of pairs.

Since we want to keep it simple, we will store the batches in memory and discard them when the process is done. **InMemoryRandomStrings** is not fault-tolerant, since data is generated at the processing time in contrast to the built-in Kafka source, where data actually lives in a Kafka cluster. In most real-case scenarios, our data is consistently stored in advance systems that keep it secured and consistent; MapR Event Store for Apache Kafka and MapR Database are just a couple of these examples.

We can start by defining our **StreamSourceProvider**, which defines how our **Source** is created.

The class **DefaultSource** is our **StreamSourceProvider**, and we need to implement the two required functions, **sourceSchema** and **createSource**.

```scala
class DefaultSource extends StreamSourceProvider with DataSourceRegister {

  override def sourceSchema(sqlContext: SQLContext,
                            schema: Option[StructType],
                            providerName: String,
                            parameters: Map[String, String]): (String, StructType) = {

    (shortName(), InMemoryRandomStrings.schema)
  }

  override def createSource(sqlContext: SQLContext,
                            metadataPath: String,
                            schema: Option[StructType],
                            providerName: String,
                            parameters: Map[String, String]): Source = {

    new InMemoryRandomStrings(sqlContext)
  }

  override def shortName(): String = "InMemoryRandomStrings"
}
```

**InMemoryRandomStrings.schema** is the fixed schema we are going to use for the example, but the schema can be dynamically passed in.

The **createSource** function then returns an instance of **InMemoryRandomStrings** that is our actual **Source**.

## InMemoryRandomStrings

Now, let's see **InMemoryRandomStrings** code in parts, so we can focus on all the details.

```scala
class InMemoryRandomStrings(sqlContext: SQLContext) extends Source {

  override def schema: StructType = InMemoryRandomStrings.schema

  override def getOffset: Option[Offset] = ???

  override def getBatch(start: Option[Offset], end: Offset): DataFrame = ???

  override def commit(end: Offset): Unit = ???

  override def stop(): Unit = ???
}

object InMemoryRandomStrings {

  lazy val schema = StructType(List(StructField("value", StringType), StructField("ts", LongType)))

}
```

`schema` returns the schema that our source uses; in our case, we know that the schema is fixed.

`getOffset` should return the latest offset seen by our source.

```scala
class InMemoryRandomStrings(sqlContext: SQLContext) extends Source {
  private var offset: LongOffset = LongOffset(-1)

  override def schema: StructType = InMemoryRandomStrings.schema

  override def getOffset: Option[Offset] = this.synchronized {
    println(s"getOffset: $offset")

    if (offset.offset == -1) None else Some(offset)
  }

  override def getBatch(start: Option[Offset], end: Offset): DataFrame = ???

  override def commit(end: Offset): Unit = ???

  override def stop(): Unit = ???
}

object InMemoryRandomStrings {

  lazy val schema = StructType(List(StructField("value", StringType), StructField("ts", LongType)))

}
```

Notice that we added a variable called `offset` that will keep track of the seen data. Then, we return `None` if our source has never seen any data, `Some(offset)` otherwise.

Now, let's see how our source can produce some data; we will use a running thread for it. Please, notice the **dataGeneratorStartingThread** function.

```scala
class InMemoryRandomStrings(sqlContext: SQLContext) extends Source {
  private var offset: LongOffset = LongOffset(-1)

  private var batches = collection.mutable.ListBuffer.empty[(String, Long)]

  private val incrementalThread = dataGeneratorStartingThread()

  override def schema: StructType = InMemoryRandomStrings.schema

  override def getOffset: Option[Offset] = this.synchronized {
    println(s"getOffset: $offset")

    if (offset.offset == -1) None else Some(offset)
  }

  override def getBatch(start: Option[Offset], end: Offset): DataFrame = ???

  override def commit(end: Offset): Unit = ???

  override def stop(): Unit = incrementalThread.stop()

  private def dataGeneratorStartingThread() = {
    val t = new Thread("increment") {
      setDaemon(true)
      override def run(): Unit = {

        while (true) {
          try {
            this.synchronized {
              offset = offset + 1

              val value = Random.nextString(Random.nextInt(5))

              batches.append((value, offset.offset))
            }
          } catch {
            case e: Exception => println(e)
          }

          Thread.sleep(100)
        }
      }

    }

    t.start()

    t
  }
}

object InMemoryRandomStrings {

  lazy val schema = StructType(List(StructField("value", StringType), StructField("ts", LongType)))

}
```

In here, we have added a thread that generates random values and increments the offset while storing the value and offset on an internal buffer. The thread starts running as soon as our source is created. The `stop` function stops the running thread.

At this point, we are only two functions away from our goal.

`getBatch` returns a **DataFrame** back to Spark with data within the passed offset range.

```scala
override def getBatch(start: Option[Offset], end: Offset): DataFrame = this.synchronized {

    val s = start.flatMap(LongOffset.convert).getOrElse(LongOffset(-1)).offset + 1
    val e = LongOffset.convert(end).getOrElse(LongOffset(-1)).offset + 1

    println(s"generating batch range $start ; $end")

    val data = batches
      .par
      .filter { case (_, idx) => idx >= s && idx <= e }
      .map { case (v, _) => (v, v.length) }
      .seq

    val rdd = sqlContext
      .sparkContext
      .parallelize(data)
      .map { case (v, l) => InternalRow(UTF8String.fromString(v), l.toLong) }

    sqlContext.sparkSession.internalCreateDataFrame(rdd, schema, isStreaming = true)
  }
```

We can see that we are getting the data from our internal buffer so that the data has the corresponding indexes. From there, we generate the **DataFrame** that we then send back to Spark.

Finally, `commit` is how Spark indicates to us that it will not request offsets less or equal to the one being passed. In other words, we can remove all data from our internal buffer with an offset less than or equal to the one passed to `commit`. In this way, we can save some memory and avoid running out of heap space.

```scala
override def commit(end: Offset): Unit = this.synchronized {

    val committed = LongOffset.convert(end).getOrElse(LongOffset(-1)).offset

    val toKeep = batches.filter { case (_, idx) => idx > committed }

    batches = toKeep
  }
```

Now, we have completed our source; the entire code is the following:

```scala
class InMemoryRandomStrings(sqlContext: SQLContext) extends Source {
  private var offset: LongOffset = LongOffset(-1)

  private var batches = collection.mutable.ListBuffer.empty[(String, Long)]

  private val incrementalThread = dataGeneratorStartingThread()

  override def schema: StructType = InMemoryRandomStrings.schema

  override def getOffset: Option[Offset] = this.synchronized {
    println(s"getOffset: $offset")

    if (offset.offset == -1) None else Some(offset)
  }

  override def getBatch(start: Option[Offset], end: Offset): DataFrame = this.synchronized {

    val s = start.flatMap(LongOffset.convert).getOrElse(LongOffset(-1)).offset + 1
    val e = LongOffset.convert(end).getOrElse(LongOffset(-1)).offset + 1

    println(s"generating batch range $start ; $end")

    val data = batches
      .par
      .filter { case (_, idx) => idx >= s && idx <= e }
      .map { case (v, _) => (v, v.length) }
      .seq

    val rdd = sqlContext
      .sparkContext
      .parallelize(data)
      .map { case (v, l) => InternalRow(UTF8String.fromString(v), l.toLong) }

    sqlContext.sparkSession.internalCreateDataFrame(rdd, schema, isStreaming = true)
  }

  override def commit(end: Offset): Unit = this.synchronized {

    val committed = LongOffset.convert(end).getOrElse(LongOffset(-1)).offset

    val toKeep = batches.filter { case (_, idx) => idx > committed }

    batches = toKeep
  }

  override def stop(): Unit = incrementalThread.stop()

  private def dataGeneratorStartingThread() = {
    val t = new Thread("increment") {
      setDaemon(true)
      override def run(): Unit = {

        while (true) {
          try {
            this.synchronized {
              offset = offset + 1

              val value = Random.nextString(Random.nextInt(5))

              batches.append((value, offset.offset))
            }
          } catch {
            case e: Exception => println(e)
          }

          Thread.sleep(100)
        }
      }
    }

    t.start()

    t
  }
}


object InMemoryRandomStrings {
  lazy val schema = StructType(List(StructField("value", StringType), StructField("ts", LongType)))
}
```

## Using Our Custom Source

Now, we need to plug in our source into the Spark Structured Streaming API by indicating the correct format to be used.

```scala
val r = sparkSession
    .readStream
    .format("com.github.anicolaspp.spark.sql.streaming.DefaultSource")
    .load()
```

In here, we use the regular `.readStream` API and specify that the stream format is our implementation of `StreamSourceProvide`, that is: _**com.github.anicolaspp.spark.sql.streaming.DefaultSource.**_

Now we can query our streaming source as any other **DataFrame**.

```scala
r.createTempView("w")

    sparkSession
      .sql("select ts, count(*) as c from w group by ts order by ts, c desc")
      .writeStream
      .format("console")
      .outputMode(OutputMode.Complete())
      .start()
      .awaitTermination()
```

The output will look similar to this:

```markdown
-------------------------------------------
Batch: 3
-------------------------------------------
+---+---+
| ts|  c|
+---+---+
|  0| 81|
|  1| 78|
|  2| 74|
|  3| 82|
|  4| 80|
+---+---+
```

What we see is a continuous aggregation of the data generated by our source.

## Conclusions

Apache Spark is the way to go when processing data at scale. Its features outperform almost any other tool out there. Also, it can be extended in many different ways, and as we can see, we can write our own data sources and streaming sources, so they can be plugged into our Spark code with ease.

Originally posted January 14, 2019, [here](https://hackernoon.com/spark-custom-stream-sources-ec360b8ae240).

_**The entire project and source code can be found here: [SparkStreamSources](https://github.com/anicolaspp/SparkStreamSources).**_

*Happy Coding.*