---
title: "Kafka REST Proxy - Performance Tuning for MapR Event Store"
date: 2021-02-05T06:32:34.390Z
author: Mathieu Dumoulin 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","kafka"]
authorimage: "/img/blogs/Avatar5.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019 may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
"authorDisplayName": "Mathieu Dumoulin",
"publish": "2017-04-04T12:00:00.000Z",
"tags": "nosql"
```

---

MapR Event Store is a “Kafka-esque” message streaming system which, similarly to Apache Kafka, provides very high throughput performance combined with low message latency and high reliability. Unique to MapR Event Store, however, is a broker-less design that vastly simplifies configuration and increases reliability, in addition to providing replication capabilities that enable some pretty cool use cases.

With MEP 2.0, the MapR Data Platform adds a Kafka REST Proxy server. This upgrade opens MapR Event Store to use any language that supports REST API calls over HTTP, which is to say, virtually all modern languages. For example, Python and the requests module work really well.

But is the Kafka REST Proxy able to access the tremendous performance potential of MapR Event Store at the same level as its primary Java API?

In this post, I’d like to go over a few performance objectives and provide some guidance to help data engineers get the most out of this very useful technology.

## The default case

We should start with some good news. MapR Event Store is very fast and is shipped by default with settings that should provide enough performance for most applications.

## Fix very high latency for single API call (with CURL)

You have a shiny new MapR 5.2 cluster installed with all the bells and whistles. Everything works great, and you get around to wanting to give MapR Event Store a try. With the REST Proxy, this is a piece of cake.

```bash
curl -X POST -H "Content-Type:application/vnd.kafka.json.v1+json" --data '{"records":[{"value":{"foo":"bar"}}]}' "http://demo1:8082/topics/%2Fstreams%2Ftest%3Atopic1"
```

And the response takes about 3 seconds to come back. This very high latency is because of the default streams buffer time value of 3000ms.

To fix, add the following to the kafka-rest.properties file (in /opt/mapr/kafka-rest/kafka-rest-<version>/config):

```bash
consumer.request.timeout.ms=125
streams.buffer.max.time.ms=125
```

Reference: https://docs.datafabric.hpe.com/62/Kafka/REST-config-parameters.html

**Beware of high CPU if the timeout is very low**

Lowering the value of this property seems to correlate to much higher CPU utilization. When the value is 0, one or two of my cores get pegged to 100%. Above about 125ms, the impact to CPU utilization isn’t noticeable, at least to something like top.

## About the URL for the topic

`“/%2Fstreams%2Ftest%3Atopic1”` in the URL is because MapR Event Store includes a path and topic (i.e. /path/to/stream:topic) and that’s going to need to be URL encoded or else it won’t work.

It’s possible to avoid this by setting a default stream, adding the following property to kafka-rest.properties:

```bash
streams.default.streams=/streams/test
```

In that case, the above example URL would simplify to `“http://demo1:8082/topics/topic1”.`

Reference: [https://docs.datafabric.hpe.com/62/Kafka/REST-get-topic-metadata.html](https://docs.datafabric.hpe.com/62/Kafka/REST-get-topic-metadata.html)

## Increase Throughput Performance

**Number of topics and partitions**

MapR Event Store is fast by default and handles a lot, albeit not everything, automatically. Some performance tuning comes from design considerations and just aren’t up to the streams messaging system at all.

**Partitions > topics**

Pros
-	Throughput should be good, and data spread out evenly across the cluster
-	Easier to create and use, less moving parts    

Cons
-	Finding data specific to a particular object/event type/location will require scanning through more data, which will be slower.

**Topics >> partitions**

Pros
-	It’s very efficient to get data from a specific object/event type/location if they are all stored in their own stream.
-	A very high number of streams (hundreds of thousands or even millions) will naturally spread across the cluster and will spread out well on all nodes of the cluster.    

Cons
-	The consumer needs to specify a regex pattern to pick all (or a group of) data. This may come at a performance penalty compared to a single topic with many partitions.
-	Stream split is a relatively heavy operation, and it could trigger high load as new topics are created after the initial creation of topics is done.

Of course, one could also decide to use an intermediate solution, in which there are lots of topics and each topic has some number of partitions. The way to decide is to consider how the application is going to be used and where flexibility is needed. In any case, the default number of partitions for new topics is one, so that’s something to change for sure.

How to create streams with a custom number of partitions:

```python
stream create
	 -path Stream Path
	[ -ttl Time to live in seconds. default:604800 ]
	[ -autocreate Auto create topics. default:true ]
	[ -defaultpartitions Default partitions per topic. default:1 ]

$> maprcli stream create -path /streams/test -defaultpartitions 10
```

As a rule of thumb, try to keep about 10 partitions per node per topic.

**Session keep-alive and record arrays**

To get the highest throughput, it’s going to be important to reduce overhead to maximize the CPU/network resources that do useful work moving your bits around. Here are some findings from recent engagements with customers using MapR Event Store in pilot and production projects:


**Use an array of records as payload**

Instead of producing a single record on each API call, push an array of records.

**Bad:**

```python
{"value":{"foo":"bar"}}

```

**Good:**

```python
{"records":[ {"value":{"foo1":"bar1"}},{"value":{"foo2":"bar2"}} ,… ]}
```

Getting the best performance will require some experimentation to find the balance between how frequently to make calls vs. how many records to pack into each call.

Our own experience shows that the Proxy can handle as much as 280MB/s on very large (100-200KB) message sizes. Internal tests demonstrate modest 5 node AWS clusters that are able to handle millions of small (1-200B) messages per second.

There is no substitute for experimentation, given variability of data set, throughput, and cluster hardware resources as well as the business requirements of a specific use case.

**Reuse a session to push data into the REST Proxy**

We’ve found significant gains from switching from single, isolated POST calls to multiple calls within the same session.

Here is an example with Python and the excellent requests module:

**Bad:**

```python
def produce(payload):  
    headers = {'Content-Type':'application/vnd.kafka.binary.v1+json'}
    r = requests.post('http://gw1:8082/topics/test', headers=headers, json=payload)
```

**Good:**

```python
def send_messages(url, payload):
    session = requests.Session()
    headers = {'Content-Type':'application/vnd.kafka.binary.v1+json'}
    while not is_done:
response = session.post(url, headers=headers, data=payload)
```

**Tuning the embedded Jetty server**

One of the resources that limits the throughput performance of the Kafka REST Proxy is CPU resource. Well, it turns out that the Proxy is running the Jetty 9 server in embedded mode. It is possible to do some tuning at that level.

There is a good article about tuning the operating system (of both load generator and server) and load generators and jetty for high load in Jetty server. For sure, we cannot tune Jetty as it's embedded. But have a look at the following link. You can certainly tune the following meetings for high load:

-	TCP buffer sizes
-	Queue sizes for connection listening queue
-	Port range at the load generator side, so it won’t starve on parts during high load

Reference: [http://wiki.eclipse.org/Jetty/Howto/High_Load](http://wiki.eclipse.org/Jetty/Howto/High_Load)

**How to increase the memory buffer**

It is possible to tune the “buffer.memory” parameter. Its default value is 32m. However, this setting cannot exceed the total memory that the producer is going to use. At the end of the day, the kaka-rest is a JVM process.

Without changing any parameters, the Kafka REST API uses 256m of memory at most. Therefore, the “buffer.memory” parameter cannot exceed this value. How come 256m? See the kaka-rest-run-class script (in /opt/mapr/kafka-rest/kakfa-rest-<version>/bin). It says the following:

```python
# Memory options
if [ -z "$KAFKAREST_HEAP_OPTS" ]; then
  KAFKAREST_HEAP_OPTS="-Xmx256M"
Fi
```

So, if you want to increase “`buffer.memory`” beyond 256m, provide the KAFKAREST_HEAP_OPTS value accordingly.

**Waste-of-time parameters**

The producer throughput of a single Kafka REST Proxy doesn't scale by increasing the “producer.threads” parameter. We tried to set it to 20, 50, 500, and even 10,000, but there were no visible performance differences.

According to [https://github.com/confluentinc/kafka-rest/issues/181](https://github.com/confluentinc/kafka-rest/issues/181), it is not used in Kafka REST code, and the Kafka REST Proxy that runs on MapR is largely identical to the Confluent implementation, only with the libraries changed to MapR libraries. Our implementation shares this known issue for now.

## Cluster Architecture

**Run the Proxy on dedicated server(s)**

A great way to ensure optimal performance for performance-critical use cases is to use one or more dedicated servers for the Kafka REST Proxy. Instead of installing it on a shared cluster node, you can install the MapR Client on a separate server and install the REST Proxy there.

To boost performance further, add additional servers and put them behind a load balancer. From the Client to the cluster, ensure that the network connectivity is as fast as can be afforded, since MapR will take advantage of all the network interfaces on the node automatically.

![Kafka REST Proxy](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/picture1-1612507057820.png)

**Run two or more Proxy processes on a dedicated node**    

This can be done by running the other server on a different port (e.g. 8083 instead of the default 8082). Given a server with enough physical cores, such as a two-socket design, this strategy can further increase the throughput.

Note that running two proxy processes on a single server will not scale linearly the throughput. Our testing, in one instance, showed throughput to increase from 1,580 msg/s to 2,660 msg/s, good for close to a 70% increase.

## About message size

The performance characteristics of MapR Event Store and the Kafka REST Proxy change depending on the message size. Very small messages will be handled faster than very large messages. Your design should take this difference into consideration and favor smaller messages.

Keep in mind that the largest message size that can be handled very efficiently is about 100KB. Larger messages will come at some cost in peak performance, with a maximum best practice size of 2MB. Smaller messages are super-efficiently handled, so those are always fine.

Given the large sweet spot, we’d advise favoring development simplicity and not worrying about it too much until individual messages get over about 100KB in size.


## Do's and Don'ts

-	DO choose your performance targets based on the business needs and the use case.
-	DO monitor the CPU, memory, and network load of the server running the Kafka REST Proxy.
-	DO consider your design (cluster architecture, topics vs. partitions) before changing parameters.
-	DO use a session if throughput is important.
-	Do favor lots of smaller messages.
-	DON'T change default parameters without a clear performance goal (latency, throughput, lower CPU usage, etc.).
-	DON’T create too large messages (2MB+).

## Some Additional Resources

**Script to measure throughput in MapR Event Store**


```python
#!/bin/bash

STREAM="/streams/stream1"
TOPIC="test"

function sum_of_offset {
  maprcli stream topic info -path $STREAM -topic $TOPIC -json | awk -F':|,' '/maxoffset/ {n+=$2} END {print n}' 2> /dev/null
}

function epoch_ms {
  date +%s%3N
}

date +%T,%3N

o=$(sum_of_offset); t=$(epoch_ms)

while true
do
  prev_o=$o; prev_t=$t
  o=$(sum_of_offset); t=$(epoch_ms)
  echo "$(date +%T,%3N) $((($o - $prev_o)*1000/($t - $prev_t))) msg/s"
done
```

_Thank you to Vince Gonzalez, Akihiko Kusanagi, Ted Dunning and Muthu Lalapet for their contributions to this blog post._