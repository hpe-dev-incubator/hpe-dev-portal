---
title: "The 5-Minute Guide to Understanding the Significance of Apache Spark"
date: 2020-11-25T02:19:48.521Z
author: Nitin Bandugula 
tags: ["opensource","mapr","apache-spark","hpe-ezmeral-data-fabric","hpe-ezmeral"]
authorimage: "/img/blogs/Avatar2.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019, may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
"authorDisplayName": "Nitin Bandugula",
"publish": "2015-06-23T07:00:00.000Z",
"tags": "apache-spark"
```

---

In this blog, I’d like to talk about the differences between Apache Spark and MapReduce, why it’s easier to develop on Spark, and the top five use cases.

## So what is Spark?

Spark is another execution framework. Like MapReduce, it works with the filesystem to distribute your data across the cluster, and process that data in parallel. Like MapReduce, it also takes a set of instructions from an application written by a developer. MapReduce was generally coded from Java; Spark supports not only Java, but also Python and Scala, which is a newer language that contains some attractive properties for manipulating data.

## What are the key differences between Spark and MapReduce?

1.  **Spark tries to keep things in memory, whereas MapReduce keeps shuffling things in and out of disk.** MapReduce inserts barriers, and it takes a long time to write things to disk and read them back. Hence MapReduce can be slow and laborious. The elimination of this restriction makes Spark orders of magnitude faster. For things like SQL engines such as Hive, a chain of MapReduce operations is usually needed, and this requires a lot of I/O activity. On to disk, off of disk—on to disk, off of disk. When similar operations are run on Spark, Spark can keep things in memory without I/O, so you can keep operating on the same data quickly. This results in dramatic improvements in performance, and that means Spark definitely moves us into at least the interactive category. For the record, there are some benefits to MapReduce doing all that recording to disk — as recording everything to disk allows for the possibility of restarting after failure. If you’re running a multi-hour job, you don’t want to begin again from scratch. For applications on Spark that run in the seconds or minutes, restart is obviously less of an issue.

2.  **It’s easier to develop for Spark**. Spark is much more powerful and expressive in terms of how you give it instructions to crunch data. Spark has a Map and a Reduce function like MapReduce, but it adds others like Filter, Join and Group-by, so it’s easier to develop for Spark. In fact, Spark provides for lots of instructions that are a higher level of abstraction than what MapReduce provided. You can think more about how you want the data processed, rather than about how to cajole MapReduce into doing what you want. This might not seem that important, until you look at this:  [MapReduce-Wordcount](https://hadoop.apache.org/docs/r1.2.1/mapred_tutorial.html#Example%3A+WordCount+v2.0). This is the code to calculate a count of words in a text file, done in MapReduce (not Spark). It’s over 100 lines of code, and fairly unintuitive. The equivalent in Spark is found on this page: [Spark Examples](https://spark.apache.org/examples.html) (look for the Word Count example). It’s four lines versus over 100\. If you’re trying to do risk calculations on Wall Street, which one are you going to choose? Same thing goes for someone writing a new analytics application or a new query engine. It’s a no-brainer.

Related to this theme of ease of development, Spark is more intelligent about how it operates on data. Spark supports lazy evaluation. Normally we don’t like anything to be lazy, but in this case, lazy evaluation means that if you tell Spark to operate on a set of data, it listens to what you ask it to do, writes down some shorthand for it so it doesn’t forget, and then does absolutely nothing. It will continue to do nothing, until you ask it for the final answer.

Why is this great? Because often work magically goes away. This is a bit like when you were in high school, and your mom came in to ask you to do a chore (“fetch me some milk for tonight’s dinner”). Your response: say that you were going to do it, then keep right on doing what you were already doing. Sometimes your mom would come back in and say she didn’t need the chore done after all (“I substituted water instead”). Magic, work saved! Sometimes the laziest finish first.

Spark is the same. It waits until you’re done giving it operators, and only when you ask it to give you the final answer does it evaluate, and it always looks to limit how much work it has to do. Suppose you first ask Spark to filter a petabyte of data for something—say, find you all the point of sale records for the Chicago store—then next you ask for it to give you just the first result that comes back. This is a really common thing to do. Sometimes a data analyst just wants to see a typical record for the Chicago store. If Spark were to run things explicitly as you gave it instructions, it would load the entire file, then filter for all the Chicago records, then once it had all those, pick out just the first line for you. That’s a huge waste of time and resources. Spark will instead wait to see the full list of instructions, and understand the entire chain as a whole. If you only wanted the first line that matches the filter, then Spark will just find the first Chicago POS record, then it will emit that as the answer, and stop. It’s much easier than first filtering everything, then picking out only the first line.

Now, you could write your MapReduce jobs more intelligently to similarly avoid over-using resource, but it’s much more difficult to do that. Spark makes this happen automatically for you. Normally, software like Hive goes into contortions to avoid running too many MapReduce jobs, and programmers write very complex and hard-to-read code to force as much as possible into each Map and Reduce job. This makes development hard, and makes the code hard to maintain over time. By using Spark instead, you can write code that describes how you want to process data, not how you want the execution to run, and then Spark “does the right thing” on your behalf to run it as efficiently as possible. This is the same thing a good high-level programming language does: it raises the abstraction layer, letting the developer talk more powerfully and expressively, and does the work behind the scenes to ensure it runs as fast as possible.

1.  **Spark also adds libraries for doing things like machine learning, streaming, graph programming and SQL** (see image below). This also makes things much easier for developers. These libraries are integrated, so improvements in Spark over time provide benefits to the additional packages as well. Most data analysts would otherwise have to resort to using lots of other unrelated packages to get their work done, which makes things complex. Spark’s libraries are designed to all work together, on the same piece of data, which is more integrated and easier to use. Spark streaming in particular provides a way to do real-time stream processing. The aforementioned Apache Storm project was designed to do this kind of work, but Spark is much easier to develop for than Storm. Spark will enable developers to do real-time analysis of everything from trading data to web clicks, in an easy to develop environment, which tremendous speed.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/spark-core-stack-db-1606270847095.jpg)

**So to summarize, Spark is promising to speed up application development by 10-100x, make applications more portable and extensible, and make the actual application run 100x faster.** This should make it clear why people are excited.

## How does someone develop an application for Spark?

Spark is a set of libraries. You can program to those libraries from three programming languages today: Java, Python, and a newer language called Scala. There aren’t a lot of Scala developers today, while there are millions of Java and Python developers. But Scala is better designed to work with Spark, and it offers the greatest reduction in the number of lines of code to stand up an application. Many complex applications that were hundreds of lines can be re-written in Scala in less than a hundred lines. The design methodology of Scala is more congruent with that of Spark than any other language. Scala also compiles down to the same bytecode that a Java Virtual Machine (JVM) executes, so any existing code you’ve got in Java can be used by Scala. This is one of Scala’s biggest wins: it gives you the best of both worlds. Scala offers first-class support for integrating Java; in fact, much of Scala is actually directly reliant on Java. All the Java code you’ve already got working can be repurposed. And the really important code that represents the critical part of the data-crunching application can be re-written in Scala in a much smaller form factor that is much easier for developers to read, repurpose and maintain. Note that with Java 8.0 supporting lambda expressions, a Java developer can become lot more productive without switching to Scala completely.

The libraries provided by Spark were discussed previously. The developer community is excited about Spark because everything is integrated with Spark. If you wanted to do applications with MapReduce, you had a bunch of problems. First, MapReduce pretty much had to be done with Java. That’s not the case with Spark: Python and Scala are first-class citizens. Second, you had to marry up MapReduce with other technologies. Wanted machine learning? You’ve got to separately integrate something like Mahout, H2O, or Oryx to get things done, and you’ve got to figure out how it works, and how to bolt it on. Wanted a graph database, with inbuilt tools for graph analytics? Well, again, you’ve got to select from Giraph, TitanDB, neo4j, or some other technology. The point is that the integration of all these parts would definitely not be seamless; each of them wants to be used in its own way.

Spark offers a different model. You get SQL, machine learning, graph analytics and streaming in a single set of libraries that all work together with the Spark core. You can manipulate the same datasets with all of these. And when Spark core gets improvements, all of the libraries also improve. Integration is much easier, applications are far easier to maintain, costs go down, developers are happier. Most important for the field teams to understand: If a company developing applications is going to make a bet on a single foundation for your applications, Spark is looking like the best choice right now.

Spark does not replace Hadoop. You still need a single data layer, preferably one that is hyper-scalable and extremely fast, and that’s where MapR comes in. MapR makes Spark faster, more scalable, and more reliable.

## What are the Spark use cases?

Databricks (a company founded by the creators of Apache Spark) lists the following cases for Spark:

1.  Data integration and ETL
2.  Interactive analytics or business intelligence
3.  High performance batch computation
4.  Machine learning and advanced analytics
5.  Real-time stream processing

Tons of people are doing data integration and ETL on MapReduce, as well as batch computation, machine learning and batch analytics. But these things are going to be much faster on Spark. Interactive analytics and BI are possible on Spark, and the same goes for real-time stream processing. So some of the new use cases are just the old use cases, done faster, while some are totally new. There are some things that just couldn’t have been done with acceptable performance on MapReduce.

## Summary

In this blog post, you’ve learned about the key differences between Spark and MapReduce, why it’s easier to develop on Spark, and the top five use cases. 