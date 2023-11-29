---
title: "How to Persist Kafka Data as JSON in NoSQL Storage Using MapR Event Store and MapR Database"
date: 2020-09-25T06:11:31.778Z
author: Ian Downard 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","Kafka","noSQL","opensource", "data-ml-engineer"]
authorimage: "/img/blogs/Avatar3.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019, may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:
```
"authorDisplayName": "Ian Downard",
"publish": "2016-10-31T07:00:00.000Z",
"tags": "nosql"
```

---

## Streaming data is like the phrase, “Now you see it. Now you don’t!”

One of the challenges when working with streams, especially streams of fast data, is the transitory nature of the data. Kafka streams are characterized by a retention period that defines the point at which messages will be permanently deleted. For many applications, such as those fed by streams of rapidly generated sensor data, the retention period is a desirable and convenient way to purge stale data, but in other cases, such as with insurance or banking applications, record-retention laws may require data to be persisted far beyond the point at which that data has any practical value to streaming analytics. This is challenging in situations where rapidly ingested data creates pressure on stream consumers designed to write streaming records to a database. Even if we can ensure these consumers keep up, we still need to guarantee zero data loss in the unlikely event that they do fail.

**HPE Ezmeral Data Fabric Event Data Streams (Formerly MapR Event Store) and HPE Ezmeral Data Fabric Document Database (Formerly MapR Database) work together to provide a scalable and fault tolerant way to save streaming data in long-term storage.** They both have a distributed, scale-out design based on the HPE Ezmeral Data Fabric (Formerly MapR Data Platform). Furthermore, as a NoSQL data store, HPE Ezmeral Data Fabric Document Database makes it easy to persist data with the same schema encoded into streams. This is not only convenient for the developer but also minimizes the work required to transform streaming records into persistable objects.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/persist-kafka-json-streams-mapr-02_0-1601014236654.png)

Let's illustrate these concepts with an example that persists streaming data in 5 simple steps:

1.  Setup stream and database connections.
2.  Consume records from a MapR stream using the standard Kafka API.
3.  Convert each consumed record to a JSON object.
4.  Persist that JSON object in HPE Ezmeral Data Fabric Document Database.
5.  Update the stream cursor to ensure graceful recovery should a stream consumer fail.

## Step 1: Setup stream and database connections

Before we can do anything interesting we first have to setup our stream and database connections. We'll use the following two options that relate to fault tolerance:

*   We disable the `enable.auto.commit` consumer option in order to commit stream cursors only after their corresponding records have been writing to the database.
*   We disable the `BUFFERWRITE` table option in order to ensure database writes are not buffered on the client.

With these options we're sacrificing speed for higher fault tolerance but we can compensate for that tradeoff by creating more topic partitions and running more concurrent consumers in parallel.

So, here is what our database and consumer configurations look like:

```markdown
Table table;
String tableName = "/user/mapr/ticktable";
if (MapRDB.tableExists(tableName)) {
    table = MapRDB.getTable(tableName);
} else {
    table = MapRDB.createTable(tableName);
}
table.setOption(Table.TableOption.BUFFERWRITE, false);

Properties props = new Properties();
props.put("enable.auto.commit","false");
props.put("group.id", “mygroup”);
props.put("auto.offset.reset", "earliest");
props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
consumer = new KafkaConsumer<String, String>(props);
List<String> topics = new ArrayList<>();
topics.add(topic);
consumer.subscribe(topics);
```

## Step 2: Consume records from the stream

To consume records from a stream, you first poll the stream. This gives you a collection of `ConsumerRecords` which you then iterate through in order to access each individual stream record. This is standard Kafka API stuff, and it looks like this:

```markdown
ConsumerRecords<String, byte[]> records = consumer.poll(TIMEOUT);
Iterator<ConsumerRecord<String, byte[]>> iter = msg.iterator();
while (iter.hasNext())
{
    ConsumerRecord<String, byte[]> record = iter.next();
}
```

## Step 3: Convert streamed records to JSON

Before we write consumer records to the database, we need to put each record in a format that has columns. In our example we’re streaming byte arrays, which by themselves have no field related attributes, so we need to convert these byte arrays into a type containing attributes that will correspond to columns in our database. We’ll do this with a Java object, defined in <a target='\_blank'  href='https://gist.github.com/iandow/92d3276e50a7e77f41e69f5c69c8563b'>Tick.java</a>, which uses the @JsonProperty annotation to conveniently convert Tick objects encoded as byte arrays into a JSON document, like this:

```markdown
Tick tick = new Tick(record.value());
Document document = MapRDB.newDocument((Object)tick);
```

## Step 4: Persist the JSON document to HPE Ezmeral Data Fabric Document Database

This part is easy. We can insert each JSON document as a new row to a table in MapR Database with one line of code, like this:

```markdown
table.insertOrReplace(tick.getTradeSequenceNumber(), document);
```

The first parameter in the insertOrReplace method is Document ID (or rowkey). It’s a property of our dataset that the value returned by `tick.getTradeSequenceNumber()` is unique for each record, so we’re referencing that as the Document ID for our table insert in order to avoid persisting duplicate records even if duplicate messages are consumed from the stream. This guarantees idempotency in our stream consumer.

## Step 5: Update the stream cursor

Finally, we’ll update the cursor in our stream topic. In the unlikely event that our stream consumer fails, this ensures that a new consumer will be able to continue working from where the last consumer left off.

```markdown
consumer.commitSync();
```

## Summary

The design we just outlined provides a scalable approach to persisting stream data. It ensures thread-safety by processing immutable stream data with idempotent stream consumers and achieves fault tolerance by updating stream cursors only after records have been persisted in HPE Ezmeral Data Fabric Document Database. This represents an elastic, responsive, resilient, and message-driven design consistent with the characteristics of reactive microservices. This is a reliable approach to persisting Kafka streams in long-term NoSQL storage.

If you'd like to see a complete example application that uses the techniques described in this post, check out the <a target='\_blank'  href='https://github.com/mapr-demos/finserv-application-blueprint/blob/master/src/main/java/com/mapr/demo/finserv/Persister.java'>Persister.java</a> in the <a target='\_blank'  href='https://github.com/mapr-demos/finserv-application-blueprint'>Application blueprint</a> on GitHub.

**Editor’s Note:** MapR products referenced are now part of the [HPE Ezmeral Data Fabric](https://www.hpe.com/us/en/software/data-fabric.html).

To view more articles on this topic, be sure to check back regularly on the [HPE DEV blog site](/blog).