---
title: "How to Integrate Custom Data Sources Into Apache Spark"
date: 2021-01-29T05:41:49.300Z
author: Nicolas Perez 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","apache-spark","opensource"]
authorimage: "/img/blogs/Avatar4.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019 may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
"authorDisplayName": "Nicolas A Perez",
"publish": "2016-05-10T07:00:00.000Z",
"tags": "apache-spark"
```

---

Streaming data is a hot topic these days, and Apache Spark is an excellent framework for streaming. In this blog post, I'll show you how to integrate custom data sources into Spark.

Spark Streaming provides the ability to stream from a variety of sources while using the same concise API for accessing data streams, performing SQL queries, or creating machine learning algorithms. These abilities make Spark a preferable framework for streaming (or any type of workflow) applications, since we can use all aspects of the framework.

The challenge is figuring out how to integrate custom data sources into Spark so we can leverage its power without needing to change to more standard sources. It might seem logical to change, but in some cases it is just not possible or convenient to do so.

## Streaming Custom Receivers

Spark offers different extension points, as we could see when we extended the Data Source API for our example here in order to integrate our custom data store into Spark SQL.

In this example, we are going to do the same, but we are also going to extend the streaming API so we can stream from **anywhere**.

In order to implement our custom receiver, we need to extend the Receiver\[A\] class. Note that it has type annotation, so we can enforce type safety on our DStream from the streaming client side point of view.

We are going to use this custom receiver to stream orders that one of our applications sent over a socket.

The structure of the data traveling through the network looks like this:

```
1 5
1 1 2
2 1 1
2 1 1
4 1 1
2 2
1 2 2
```

We first receive the order ID and the total amount of the order, and then we receive the line items of the order. The first value is the item ID, the second is the order ID, (which matches the order ID value) and then the cost of the item. In this example, we have two orders. The first one has four items and the second has only one.

The idea is to hide all of this from our Spark application, so what it receives on the DStream is a complete order defined on a stream as follows:

```scala
val orderStream: DStream[Order] = .....
```

At the same time, we are also using the receiver to stream our custom streaming source. Even though it sends the data over a socket, it will be quite complicated to use the standard socket stream from Spark, since we will not be able to control how the data is coming in. In addition, we have the problem of conforming orders on the application itself. This could be very complicated, since, once we are in the app space, we are running in parallel, and it is hard to sync all of this incoming data. However, in the receiver space it is easy to create orders from the raw input text.

Let’s take a look at what our initial implementation looks like.

```scala
case class Order(id: Int, total: Int, items: List[Item] = null)
case class Item(id: Int, cost: Int)

class OrderReceiver(host: String, port: Int) extends Receiver[Order](StorageLevel.MEMORY_ONLY)  {

  override def onStart(): Unit = {

    println("starting...")

    val thread = new Thread("Receiver") {
      override def run() {receive() }
    }

    thread.start()
  }

  override def onStop(): Unit = stop("I am done")

  def receive() = ....
}
```

Our OrderReceiver extends Receiver\[Order\] which allows us to store an Order (type annotated) inside Spark. We also need to implement the onStart() and onStop() methods. Note that onStart() creates a thread so it is non-blocking, which is very important for proper behavior.

Now, let’s take a look at the receive method. This is where the magic really happens.

```scala
def receive() = {
    val socket = new Socket(host, port)
    var currentOrder: Order = null
    var currentItems: List[Item] = null

    val reader = new BufferedReader(new InputStreamReader (socket.getInputStream(), "UTF-8"))

    while (!isStopped()) {
      var userInput = reader.readLine()

      if (userInput == null) stop("Stream has ended")
      else {
        val parts = userInput.split(" ")

        if (parts.length == 2) {
          if (currentOrder != null) {
            store(Order(currentOrder.id, currentOrder.total, currentItems))
          }

          currentOrder = Order(parts(0).toInt, parts(1).toInt)
          currentItems = List[Item]()
        }
        else {
          currentItems = Item(parts(0).toInt, parts(1).toInt) :: currentItems
        }
      }
    }
  }
```

Here, we create a socket and point it to our source. Then we simply start reading from it until a stop command has been dispatched or our socket has no more data on it. Note that we are reading the same structure we have defined previously (how our data is being sent). Once we have completely read an Order, we call store(…) so it gets saved into Spark.

There is nothing left to do here but to use our receiver in our application, which looks like this:

```scala
val config = new SparkConf().setAppName("streaming")
val sc = new SparkContext(config)
val ssc = new StreamingContext(sc, Seconds(5))

val stream: DStream[Order] = ssc.receiverStream(new OrderReceiver(port))
```

Note how we have created the stream using our custom OrderReceiver (the val stream has been annotated only for clarity but it is not required). From now on, we use the stream (DString\[Order\]) as any other stream we have used in any other application.

```scala
stream.foreachRDD { rdd =>
      rdd.foreach(order => {
            println(order.id))              
            order.items.foreach(println)
      }
    }
```

## Summary

Spark Streaming comes in very handy when processing sources that generate endless data. You can use the same API that you use for Spark SQL and other components in the system, but it is also flexible enough to be extended to meet your particular needs.