---
title: "How to Log in Apache Spark"
date: 2020-08-19T06:01:02.274Z
author: Nicolas Perez 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","Spark","opensource"]
authorimage: "/img/blogs/Avatar4.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019, may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:
```
"authorDisplayName": "Nicolas A Perez",
"publish": "2016-03-01T08:00:00.000Z",
"tags": "spark"
```

---

An important part of any application is the underlying log system we incorporate into it. Logs are not only for debugging and traceability, but also for business intelligence. Building a robust logging system within our apps can provide significant insights into the business problems we are trying to solve.

## Log4j in Apache Spark

Spark uses `log4j` as the standard library for its own logging. Everything that happens inside Spark gets logged to the shell console and to the configured underlying storage. Spark also provides a template for app writers so we could use the same `log4j` libraries to add whatever `messages` we want to the existing login method for Spark.

## Configuring Log4j

Under the `SPARK_HOME/conf` folder, there is `log4j.properties.template` file which serves as an starting point for our own `logging` system.

Based on this file, we created the `log4j.properties` file and put it under the same directory.

`log4j.properties` looks like follows:

```markdown
log4j.appender.myConsoleAppender=org.apache.log4j.ConsoleAppender  
log4j.appender.myConsoleAppender.layout=org.apache.log4j.PatternLayout  
log4j.appender.myConsoleAppender.layout.ConversionPattern=%d [%t] %-5p %c - %m%n  

log4j.appender.RollingAppender=org.apache.log4j.DailyRollingFileAppender  
log4j.appender.RollingAppender.File=/var/log/spark.log  
log4j.appender.RollingAppender.DatePattern='.'yyyy-MM-dd  
log4j.appender.RollingAppender.layout=org.apache.log4j.PatternLayout  
log4j.appender.RollingAppender.layout.ConversionPattern=[%p] %d %c %M - %m%n  

log4j.appender.RollingAppenderU=org.apache.log4j.DailyRollingFileAppender  
log4j.appender.RollingAppenderU.File=/var/log/sparkU.log  
log4j.appender.RollingAppenderU.DatePattern='.'yyyy-MM-dd  
log4j.appender.RollingAppenderU.layout=org.apache.log4j.PatternLayout  
log4j.appender.RollingAppenderU.layout.ConversionPattern=[%p] %d %c %M - %m%n  
```

**By default, everything goes to console and file**

```markdown
log4j.rootLogger=INFO, RollingAppender, myConsoleAppender  
```

**My custom logging goes to another file**

```markdown
log4j.logger.myLogger=INFO, RollingAppenderU  
```

**The noisier spark logs go to file only**

```markdown
log4j.logger.spark.storage=INFO, RollingAppender  
log4j.additivity.spark.storage=false  
log4j.logger.spark.scheduler=INFO, RollingAppender  
log4j.additivity.spark.scheduler=false  
log4j.logger.spark.CacheTracker=INFO, RollingAppender  
log4j.additivity.spark.CacheTracker=false  
log4j.logger.spark.CacheTrackerActor=INFO, RollingAppender  
log4j.additivity.spark.CacheTrackerActor=false  
log4j.logger.spark.MapOutputTrackerActor=INFO, RollingAppender  
log4j.additivity.spark.MapOutputTrackerActor=false  
log4j.logger.spark.MapOutputTracker=INFO, RollingAppender  
log4j.additivty.spark.MapOutputTracker=false
```

Basically, we want to hide all logs Spark generates so we don’t have to deal with them in the shell. We redirect them to be logged in the file system. On the other hand, we want our own logs to be logged in the shell and in a separate file so they don’t get mixed up with the ones from Spark. From here, we will point Splunk to the files where our own logs are which in this particular case is `/var/log/sparkU.log.`

This (`log4j.properties`) file is picked up by Spark when the application starts so we don’t have to do anything aside of placing it in the designated location.

## Writing Our Own Logs

Now that we have configured the components that Spark requires in order to manage our logs, we just need to start writing logs within our apps.

In order to show how this is done, let’s write a small app that helps us in the demonstration.

Our app:

```scala
object app {  
 def main(args: Array[String]) {  
   val log = LogManager.getRootLogger  
   log.setLevel(Level.WARN)  

   val conf = new SparkConf().setAppName("demo-app")  
   val sc = new SparkContext(conf)  

   log.warn("Hello demo")  

   val data = sc.parallelize(1 to 100000)  

   log.warn("I am done")  
 }  
}
```

Running this Spark app will demonstrate that our log system works. We will be able to see `Hello demo` and `I am done` messages being logged in the shell and in the file system, while the Spark logs will only go to the file system.

So far, everything seems fine, yet there is a problem we haven’t mentioned.

The class `org.apache.log4j.Logger` is not `serializable`, which implies we cannot use it inside a `closure` while doing operations on some parts of the Spark API.

For example, if we do the following in our app:

```scala
val log = LogManager.getRootLogger  
val data = sc.parallelize(1 to 100000)  

data.map { value =>   
   log.info(value)  
   value.toString  
}
```

This will fail when running on Spark. Spark complains that the `log` object is not `Serializable`, so it cannot be sent over the network to the Spark workers.

This problem is actually easy to solve. Let’s create a class that does something to our data set while doing a lot of logging.

```scala
class Mapper(n: Int) extends Serializable{  
 @transient lazy val log = org.apache.log4j.LogManager.getLogger("myLogger")  

 def doSomeMappingOnDataSetAndLogIt(rdd: RDD[Int]): RDD[String] =  
   rdd.map{ i =>  
     log.warn("mapping: " + i)  
     (i + n).toString  
   }  
}
```

`Mapper` receives a `RDD[Int]` and returns a `RDD[String]` and it also logs what value is being mapped. In this case, note how the `log` object has been marked as `@transient`, which allows the serialization system to ignore the `log` object. Now, `Mapper` is being serialized and sent to each worker but the log object is being resolved when it is needed in the worker, solving our problem.

Another solution is to wrap the `log` object into a `object` construct and use it all over the place. We would rather have `log` within the class we are going to use it, but the alternative is also valid.

At this point, our entire app looks like the following:

```scala
import org.apache.log4j.{Level, LogManager, PropertyConfigurator}  
import org.apache.spark.`  
import org.apache.spark.rdd.RDD  

class Mapper(n: Int) extends Serializable{  
 @transient lazy val log = org.apache.log4j.LogManager.getLogger("myLogger")  
 def doSomeMappingOnDataSetAndLogIt(rdd: RDD[Int]): RDD[String] =  
   rdd.map{ i =>  
     log.warn("mapping: " + i)  
     (i + n).toString  
   }  
}  
object Mapper {  
 def apply(n: Int): Mapper = new Mapper(n)  
}  
object app {  
 def main(args: Array[String]) {  
   val log = LogManager.getRootLogger  
   log.setLevel(Level.WARN)  
   val conf = new SparkConf().setAppName("demo-app")  
   val sc = new SparkContext(conf)  

   log.warn("Hello demo")  

   val data = sc.parallelize(1 to 100000)  
   val mapper = Mapper(1)  
   val other = mapper.doSomeMappingOnDataSetAndLogIt(data)  
   other.collect()  

   log.warn("I am done")  
 }  
}
```

## Conclusions

Our logs are now being shown in the shell and also stored in their own files. Spark logs are being hidden from the shell and being logged into their own file. We also solved the serialization problem that appears when trying to log in different workers.

We now can build more robust BI systems based on our own Spark logs as we do with other non-distributed systems and applications we have today. Having the right insights is an important aspect of Business Intelligence, and this can help you achieve that.

This post was originally published <a target='\_blank'  href='https://medium.com/@anicolaspp/how-to-log-in-apache-spark-f4204fad78a#.xo31z5vrd'>here</a>.