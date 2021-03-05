---
title: Spark Streaming and Twitter Sentiment Analysis
date: 2021-03-05T12:18:36.961Z
author: Nicolas Perez
authorimage: /img/blogs/Avatar1.svg
tags:
  - hpe-ezmeral-data-fabric
  - MapR
  - apache-spark
  - MapR
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019 may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)



## Original Post Information:

```
"authorDisplayName": "Nicolas A Perez",
"publish": "2016-04-19T07:00:00.000Z",
"tags": ["apache-spark","use-case"]
```



---



This blog post is the result of my efforts to show to a coworker how to get the insights he needed by using the streaming capabilities and concise API of Apache Spark. In this blog post, you'll learn how to do some simple, yet very interesting,  analytics that will help you solve real problems by analyzing specific areas of a social network.



Using a subset of a Twitter stream was the perfect choice to use in this demonstration, since it had everything we needed: an endless and continuous data source that was ready to be explored.



## Spark Streaming, Minimized



Spark Streaming is very well explained [_here_](http://spark.apache.org/docs/latest/streaming-programming-guide.html), so we are going to skip some of the details about the Streaming API and move on to setting up our app.



## Setting Up Our App



Let’s see how to prepare our app before doing anything else.



```scala
val config = new SparkConf().setAppName("twitter-stream-sentiment") val sc = new SparkContext(config) sc.setLogLevel("WARN") val ssc = new StreamingContext(sc, Seconds(5))  System.setProperty("twitter4j.oauth.consumerKey", "consumerKey")  System.setProperty("twitter4j.oauth.consumerSecret", "consumerSecret")  System.setProperty("twitter4j.oauth.accessToken", accessToken)  System.setProperty("twitter4j.oauth.accessTokenSecret", "accessTokenSecret") val stream = TwitterUtils.createStream(ssc, None)
```



Here, we have created the Spark Context **_sc_** and set the log level to _WARN_ to eliminate the noisy log Spark generates. We also created a Streaming Context **_ssc_** using **_sc_**. Then we set up our Twitter credentials (before doing this we needed to follow [these steps](https://iag.me/socialmedia/how-to-create-a-twitter-app-in-8-easy-steps/)) that we got from the Twitter website. _Now the real fun starts_.



## What is Trending Right Now on Twitter?



It is easy to find out what is trending on Twitter at any given moment; it is just a matter of counting the appearances of each tag on the stream. Let’s see how Spark allows us to do this operation.



```scala
val tags = stream.flatMap {status => status.getHashtagEntities.map(_.getText)  } tags.countByValue() .foreachRDD {rdd => val now = org.joda.time.DateTime.now() rdd.sortBy(_._2) .map(x => (x, now)) .saveAsTextFile(s"~/twitter/$now") }
```



First, we got the tags from the Tweets, counted how many times it (a tag) appeared, and sorted them by the count. After that, we persisted the result in order to point Splunk (or any other tool for that matter) to it. We could build some interesting dashboards using this information in order to track the most trending hashtags. Based on this information, my coworker could create campaigns and use these popular tags to attract a bigger audience.



## Analyzing Tweets



Now we want to add functionality to get an overall opinion of what people think about a set of topics. For the sake of this example, let’s say that we want to know the **_sentiment_** of Tweets about **Big Data** and **Food**, two very unrelated topics.



There are several APIs for analyzing sentiments from Tweets, but we are going to use an interesting library from **The Stanford Natural Language Processing Group** in order to extract the corresponding **_sentiments_**.



In our **_build.sbt_** file we need to add the corresponding dependencies.



```scala
libraryDependencies += "edu.stanford.nlp" % "stanford-corenlp" % "3.5.1" libraryDependencies += "edu.stanford.nlp" % "stanford-corenlp" % "3.5.1"classifier "models"
```



Now, we need to select only those Tweets we really care about by filtering the **_stream_** using certain _hashtag (#)_. This filtering is quite easy, thanks to a unified Spark API.



Let’s see how.



```scala
val tweets = stream.filter {t => val tags = t.getText.split(" ").filter(_.startsWith("#")).map(_.toLowerCase) tags.contains("#bigdata") && tags.contains("#food") }
```



Here, we get all tags in each Tweet, checking that it has been tagged with**_#bigdata_** and **_#food_**.



Once we have our Tweets, extracting the corresponding sentiment is quite easy. Let’s define a function that extracts the sentiment from the Tweet’s content so we can plug it in our pipeline.



```scala
def detectSentiment(message: String): SENTIMENT_TYPE
```



We are going to use this function, assuming it does what it should, and we will put its implementation at the end, since it's not the focus of this post. In order to get an idea of how it works, let's build some tests around it.



```scala
it("should detect not understood sentiment") { detectSentiment("")should equal (NOT_UNDERSTOOD)  } it("should detect a negative sentiment") { detectSentiment("I am feeling very sad and frustrated.")should equal (NEGATIVE)  } it("should detect a neutral sentiment") { detectSentiment("I'm watching a movie")should equal (NEUTRAL)  } it("should detect a positive sentiment") { detectSentiment("It was a nice experience.")should equal (POSITIVE)  } it("should detect a very positive sentiment") { detectSentiment("It was a very nice experience.")should equal (VERY_POSITIVE) }
```



These tests should be enough to show how **_detectSentiment_** works.



Let’s see an example.



```scala
val data = tweets.map {status => val sentiment = SentimentAnalysisUtils.detectSentiment(status.getText) val tags = status.getHashtagEntities.map(_.getText.toLowerCase) (status.getText, sentiment.toString, tags) }
```



Here, **_data_** represents a _DStream_ of Tweets we want, the associated sentiment, and the hashtags within the Tweet (here we should find the tags we used to filter).



## SQL Interoperability



Now we want to cross reference the sentiment data with an external dataset that we can query using SQL. For my coworker, it makes a lot of sense to be able to **_join_** the Twitter stream with his other dataset.



Let’s take a look at how we could achieve this.



```scala
val sqlContext = new SQLContext(sc)  import sqlContext.implicits._ 
data.foreachRDD {rdd => rdd.toDF().registerTempTable("sentiments") }
```



We have transformed our stream into a different representation (a **_DataFrame_**), which is also backed by all Spark concepts (resilient, distributed, very fast) and exposed it as a table so my coworker can use his beloved SQL to query different sources.



The table _sentiment_ (that we defined from our DataFrame) will be queried as any other table in his system. Another possibility is that we could query other data sources (Cassandra, Xmls, or our own binary formatted files) using Spark SQL and cross them with the stream.



You can find out more information about this topic [_here_](https://medium.com/@anicolaspp/apache-spark-as-a-distributed-sql-engine-4373e254e0f9#.55n08p6w4) and [_here_](https://medium.com/@anicolaspp/extending-our-spark-sql-query-engine-5f4a088de986#.9jm66wp3o).



An example of querying a DataFrame is shown next.



```scala
sqlContext.sql("select * from sentiments").show()
```



## Windowed Operations



Spark Streaming has the ability to look back in the stream, a functionality most streaming engines lack (if they do have this functionality, it's very hard to implement).



In order to implement a windowed operation, you'll need to _checkpoint_ the stream, but this is an easy task. You'll find more information about this [_here_](http://spark.apache.org/docs/latest/streaming-programming-guide.html#checkpointing).



Here's a small example of this kind of operation:



```scala
tags  
   .window(Minutes(1)) . (...)
```



## Conclusion



Even though our examples are quite simple, we were able to solve a real life problem using Spark. We now have the ability to identify trending topics on Twitter, which helps us both target and increase our audience. At the same time, we are able to access different data sets using a single set of tools such as SQL.

Very interesting results came back from **_#bigdata_** and **_#food_** at the same time. Perhaps people Tweet about big data at lunch time—who knows?