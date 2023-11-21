---
title: "Using Python with Apache Spark"
date: 2021-02-13T07:12:32.201Z
author: Jim Scott 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","apache-spark"]
authorimage: "/img/blogs/Avatar4.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019 may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
"authorDisplayName": "Jim Scott",
"publish": "2015-11-23T08:00:00.000Z",
"tags": "apache-spark"
```

---

Apache Spark is awesome. <a target='\_blank'  href='https://www.python.org/'>Python</a> is awesome. This post will show you how to use your favorite programming language to process large datasets quickly.

## Why Python?

Python has become one of the major programming languages, joining the pantheon of essential languages like C, C++, and HTML. Why has it become so popular? Because Guido van Rossum designed it as a teaching tool, making Python easy to learn.

But it’s more than just easy. It’s also super useful due to its “batteries included” standard library. Python comes with a number of modules for interacting with the operating system, searching text with regular expressions, accessing the Internet, and just about anything else you could think of. You can download lots more or roll your own by interfacing with a C library.

Since it’s a dynamic, interpreted language, you don’t have to declare variables or deal with memory management bugs like you do with C.

For this reason, Python appeals to experienced programmers as well as beginners. Google uses it extensively.

While you can use Scala, which Spark is built upon, there are good reasons to use Python. More people will likely be familiar with Python than with Scala, which will flatten the learning curve.

Actually installing Spark is beyond the scope of this tutorial. This post will assume you have Python on your machine. Python is standard on most Linux/Unix distributions and Mac OS X. You can easily install Python from its homepage if you’re running Windows or just want a more recent version.

You can launch the interactive Python shell for Spark with the command ./bin/pyspark from the Spark directory.

The Spark equivalent of “Hello, world” is a word count. Here it is using Spark on Python, borrowed from the Apache Spark <a target='\_blank'  href='http://spark.apache.org/'>homepage:</a>

```python
text_file = spark.textFile("hdfs://...")
text_file.flatMap(lambda line: line.split())
    .map(lambda word: (word, 1))
    .reduceByKey(lambda a, b: a+b)

```

This creates a text_file object, splits it into lines, counts all the words in the line, and adds them back together.

## Transformations

The defining feature of Apache Spark is its Resilient Distributed Datasets, or RDDs. These RDDs represent the data as immutable collections across all of the nodes in a Spark cluster. Operations are made out of transformations which are chained together. This means that all the operations on your data are nondestructive, allowing the system to recover from failures.

Transformations can be applied to RDDs, thusly generating more RDDs. One of the more popular transformations available is `filter()`, which applies a function as an argument to all the values in your data and returns only the values that return true.

To transform an external text file into an RDD, just use the command `MyFile = sc.TextFile(“data.txt”)` where MyFile is the name you want to use and “data.txt” is the name of your file. `map()` is similar but applies the values to every value. `flatMap()`, seen in the earlier example, does the same thing but returns Seq instead of a value.

Here are some other transformations:

*   `reduceByKey()` takes a function as an argument and aggregates the data, such as adding values together.
*   `groupByKey()` takes the values and turns them into an iterable object.
*   `distinct()` removes duplicates from an RDD.

## Using Collections

You can use the `collect()` action to get all the data in an RDD and turn it into an array. This lets you apply an action to your data.

You can also parallelize an array for use on a Spark cluster.

```python
data = [1, 2, 3, 4, 5]
distData = sc.parallelize(data)

```

## Actions

While transformations create new RDDs, actions give you some kind of result. The `collect()` and `sc.parallelize()` are two examples of actions we’ve seen.

Here are some common actions:

*   `count()` counts the number of elements in an RDD.
*   `take()` fetches the first n elements as an argument from an RDD.
*   `foreach()` applies a function to each element in an RDD.
*   `saveAsTextFile()` saves an RDD into a text file in the specified path.

## Conclusion

Python is a powerful programming language that’s easy to code with. Combined with Apache Spark, you have a powerful, easy way to process Big Data either in real time or with scripts. The MapR distribution gives you everything you need to process Big Data in your favorite language. The <a target='\_blank'  href='http://spark.apache.org/documentation.html'>Apache Spark documentation</a> will give you more info on how to do so.