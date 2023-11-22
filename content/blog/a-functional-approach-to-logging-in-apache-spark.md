---
title: "A Functional Approach to Logging in Apache Spark"
date: 2021-02-05T05:32:01.948Z
author: Nicolas Perez 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","apache-spark"]
authorimage: "/img/blogs/Avatar4.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019 may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
"authorDisplayName": "Nicolas A Perez",
"publish": "2016-07-28T07:00:00.000Z",
"tags": "apache-spark"
```

---

## A Functional Approach to Logging in Apache Spark

Logging in Apache Spark is very easy to do, since Spark offers access to a logobject out of the box; only some configuration setups need to be done. In a [previous post](/blog/0NBjLpX5VAF3JKoDEqOo/how-to-log-in-apache-spark), we looked at how to do this while identifying some problems that may arise. However, the solution presented might cause some problems when you are ready to collect the logs, since they are distributed across the entire cluster. Even if you utilize YARN log aggregation capabilities, there will be some contentions that might affect performance, or you could end up with log interleaves that corrupt the nature of the log itself.

In this blog post, I will demonstrate how to solve these problems by taking a different, more functional approach.

## The Monad Writer

I do not intend to go over the details about monads or the Monad Writer, so if you would like to learn more, please read “<a target='\_blank'  href='https://adit.io/posts/2013-04-17-functors,_applicatives,_and_monads_in_pictures.html'>Functors, Applicatives, And Monads In Pictures</a>” which is very informative about this topic.

Just to put things in context, let’s say that the monad writer (_writer_) is a container that holds the current value of a computation in addition to the history (log) of the value (set of transformation on the value).

Because the _writer_ has monadic properties, it allows us to do functional transformations, and we will soon see how everything sticks together.

## A Simplistic Log

The following code demonstrates a simplistic log.

```scala
object app {
  def main(args: Array[String]) {
    val log = LogManager.getRootLogger
    log.setLevel(Level.WARN)

    val conf = new SparkConf().setAppName("demo-app")
    val sc = new SparkContext(conf)

    log.warn("Hello demo")

    val data = sc.parallelize(1 to 100000)

    log.warn("I am done")
  }
}	

```

The only thing to note is that logging is actually happening on the Spark driver, so we don’t have synchronization or contention problems. However, everything starts to get complicated once we start distributing our computations.

The following code won’t work (read this [_previous post_](/blog/0NBjLpX5VAF3JKoDEqOo/how-to-log-in-apache-spark) to know why)

```scala
val log = LogManager.getRootLogger
val data = sc.parallelize(1 to 100000)

data.map { value => 
    log.info(value)
    value.toString
}

```

A solution to this was also presented in the [previous post](/blog/0NBjLpX5VAF3JKoDEqOo/how-to-log-in-apache-spark), but it requires extra work to manage the logs.

Once we start logging on each node of the cluster, we need to go to each node and collect each log file in order to make sense of whatever is in the logs. Hopefully, you are using some kind of tool to help you with this task, such as Splunk, Datalog, etc. However, you still need to know how to get those logs into your system.

## Our Data Set

Our data set is a collection of the class “Person” that is going to be transformed while keeping an unified log of the operations on our data set.

Let’s suppose we want our data set to get loaded, filter each person who is less than 20 years old, and finally, extract his/her name. This is a very silly example, but it will demonstrate how the logs are produced. You could replace these computations, but the idea of building a unified log will remain.

## Getting the Writer

In order to use the <a target='\_blank'  href='https://typelevel.org/projects/'>TypeLevel / Cats</a> library to import the monad writer, we add the following line to our build.sbt file.

`libraryDependencies += "org.typelevel" %% "cats" % "0.6.1"`

## Playing with our Data

Now, let’s define the transformations we are going to use. First, let’s load the data.

```scala
def loadPeopleFrom(path: String)(implicit sc: SparkContext) = 
  s"loading people from $path" ~> sc.textFile(path)
                                    .map(x => User(x.split(",")(0), x.split(",")(1).toInt))

```

In here, the ~> operation is defined via implicit conversions as follows:

```scala
implicit class toW(s: String) {
  def ~>[A](rdd: RDD[A]): Writer[List[String], RDD[A]] = Writer(s :: Nil, rdd)
}

```

If you look closely, our loading operation is not returning an RDD; in fact, it returns the monad writer that keeps track of the logs.

Let’s define the filter that we want to apply over the collection of users.

```scala
def filter(rdd: RDD[User])(f: User => Boolean) = "filtering users" ~> rdd.filter(f)
```

Again, we are applying the same function (~>) to keep track of this transformation.

Lastly, we define the mapping, which follows the same pattern we just saw.

```scala
def mapUsers(rdd: RDDUser])(prefix: String): Writer[List[String], RDD[String]] = 
  "mapping users" ~> rdd.map(p => prefix + p.name)

```

## Putting it together

So far we have only defined our transformations, but we need to stick them together. Scala for is a very convenient way to work with monadic structures. Let’s see how.

```scala
val result = for {
  person          <-< span=""> loadPeopleFrom("~/users_dataset/")(sc)
  filtered        <-< span=""> filter(person)(_.age < 20)
  namesWithPrefix <-< span=""> mapUsers(filtered)("hello")
} yield namesWithPrefix

val (log, rdd) = result.run 
```

Please note that the result is of the type:`Writer[List[String], RDD[String]]`.

Calling result.run will give us the `log: List[String]` and the final computation is expressed by `rdd: RDD[String]`.

At this point, we could use Spark logger to write down the log generated by the chain of transformations. Note that this operation will be executed on the Spark master, which implies that one log file will be created that contains all of the log information. We are also removing potential contention problems during the log writes. In addition, we are not locking the log file, which avoids performance issues by creating and writing to the file in a serial way.

## Conclusion

In this blog post, I’ve shown you how to improve how to log on Apache Spark by using the Monad Writer. This functional approach allows you to distribute the creation of logs along with your computations, which is something that Spark does very well. However, instead of writing the logs on each worker node, you are collecting them back to the master to write them down.

This mechanism has certain advantages over the previous implementation. You can now control exactly how and when your logs are going to be written down, you can boost performance by removing IO operations on the worker nodes, you can remove synchronization issues by writing the logs in a serial way, and you can avoid the hazard of fishing logs across your entire cluster.

This post was originally published <a target='\_blank'  href='https://medium.com/hackernoon/how-to-log-in-apache-spark-a-functional-approach-e48ffbbd935b#.87l91o1r3'>here.</a>