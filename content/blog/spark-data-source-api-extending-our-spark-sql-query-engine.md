---
title: "Spark Data Source API: Extending Our Spark SQL Query Engine"
date: 2020-12-16T06:52:16.163Z
author: Nicolas Perez 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","apache-spark","opensource","data-scientist", "data-ml-engineer"]
authorimage: "/img/blogs/Avatar4.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019 may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
"authorDisplayName": "Nicolas A Perez",
"publish": "2016-03-23T07:00:00.000Z",
"tags": "apache-spark"
```

---

In my last post, [Apache Spark as a Distributed SQL Engine](/blog/xArv3gJz67Tl0Rv0kLVn/apache-spark-as-a-distributed-sql-engine), we explained how we could use SQL to query our data stored within Hadoop. Our engine is capable of reading CSV files from a distributed file system, auto discovering the schema from the files and exposing them as tables through the Hive meta store. All this was done to be able to connect standard SQL clients to our engine and explore our dataset without manually define the schema of our files, avoiding ETL work.

Spark provides a framework that can be extended and we will push its capabilities even further by extending some of its functionalities.

## Spark Data Source API

The Data Source API allows us to manage structured data in any format. Spark already has some standard structures built in such as Avro and Parquet, yet third parties have created new readers for CSV, JSON and others by extending this API. Today we are going to create our own.

We have two reasons to extend the API.

First, we want a library that is capable of reading our legacy format and transform our current data source into a new one that is easier to use.

Second, we want to share this library across all our applications that use our data avoiding complex packaging of applications that need to be shared in order to achieve the same goal.

## The Data Source

Our data source consists in a collection of files where each file is an entity by itself. For the sake of this example, we have defined a simple format where each file is a text file containing the information of a user, each field by line. Let’s see an example of a file.

```markdown
Pepe
20
Miami
Cube

```

This file represents a user called ‘Pepe’ who is 20 years old, lives in Miami and was born in Cuba.

In the real world, the format can be as complicated as we want, but the process we are going to explain will not change.

Each file has the same format and we have millions of them. We also want to expose them to be queried in SQL.

## Our Implementation

In order to extend the Data Source API, we need to implement certain classes from the Spark framework, so our custom reader can be loaded and used.

Let’s start by creating a Spark application as the entry point to our example. We can do this by following the post [SBT, Scala and Spark](https://medium.com/@anicolaspp/sbt-scala-and-spark-6a57c0a2623a#.yzj69ycnz).

The first thing we need to do once the app has been created is to link the correct Spark libraries. We are going to be running the examples on Spark 1.5.1 and our sbt file is defined as follow.

```markdown
name := "spark-datasource"  
version := "1.0"  
scalaVersion := "2.11.7"  
libraryDependencies += "org.apache.spark" % "spark-core_2.11" % "1.5.1"  
libraryDependencies += "org.apache.spark" % "spark-sql_2.11" % "1.5.1"
```

## Creating Our Schema

The starting extension point of the Data Source API is the RelationProvider class. The RelationProvider class will be used to create the necessary relations of our data.

We also need to mix the SchemaRelationProvider trait, which allows us to create the schema that we want.

We need to create a class named DefaultSource and Spark will look for it in a given package. The DefaultSource class will extend RelationProvider and mix SchemaRelationProvider

Our code so far looks as follow:

```scala
class DefaultSource extends RelationProvider with SchemaRelationProvider {  
  override def createRelation(sqlContext: SQLContext, parameters: Map[String, String])  
    : BaseRelation = {  
    createRelation(sqlContext, parameters, null)  
  }  
  override def createRelation(sqlContext: SQLContext, parameters: Map[String, String]  
    , schema: StructType)  
    : BaseRelation = {  
    parameters.getOrElse("path", sys.error("'path' must be specified for our data."))  
    return new LegacyRelation(parameters.get("path").get, schema)(sqlContext)  
  }  
}
```

In the code, we are basically creating a LegacyRelation object, which defined the Relation we want to create. Think about a relation like a collection of tuples with a known schema.

Let’s see how our Relation class is implemented.

```scala
class LegacyRelation(location: String, userSchema: StructType)  
(@transient val sqlContext: SQLContext)  
  extends BaseRelation  
       with Serializable {  
  override def schema: StructType = {  
    if (this.userSchema != null) {  
      return this.userSchema  
    }  
    else {  
      return StructType(Seq(StructField("name", StringType, true),   
                            StructField("age", IntegerType, true)))  
    }  
  }  
}
```

Here we are overriding the schema function so it returns the schema we want. In this example, we know the schema of our data, but in here, we could do anything we want to obtain the required schema. If the data were CSV, we could infer the schema using the headers of the file or do any other operations we need.

Notice that we only want the name and age fields instead of the entire content of our entities.

The next step is to test that we are getting the correct schema and we can do this by adding the following code to our app.

```scala
object app {  
  def main(args: Array[String]) {  
    val config = new SparkConf().setAppName("testing provider")  
    val sc = new SparkContext(config)  
    val sqlContext = new SQLContext(sc)  

    val df = sqlContext  
              .read  
              .format("com.nico.datasource.dat")  
              .load("/Users/anicolaspp/data/")     

    df.printSchema()  
  }  
}
```

This code creates a SparkContext and an SQLContext from it. Using the SQLContext we set the format by passing the package name(Remember Spark will look at this package for the DefaultSource class). Then we load the data in the specified path using our provider into a DataFrame.

```scala
df.printSchema()
```

This will print the schema we defined and the output should look as follows.

```markdown
root  
 |-- name: string (nullable = true)  
 |-- age: integer (nullable = true)
```

At this point, we only have created the schema we want, but there is nothing that says how to ready the data and how to structure it into our defined schema.

## Reading Data Into Our Schema

In order to read from our data source, our LegacyRelation class needs to mix the TableScan trait. TableScan has a method we need to implemented with the following signature:

```scala
def buildScan(): RDD[Row]
```

The method buildScan should return all rows from our data source. In our particular case, each row will be the selected content of each file. Let’s take a look at our implementation of the buildScan.

```scala
override def buildScan(): RDD[Row] = {  
    val rdd = sqlContext  
                .sparkContext  
                .wholeTextFiles(location)  
                .map(x => x._2)  

    val rows = rdd.map(file => {  
      val lines = file.split("\n")  
      Row.fromSeq(Seq(lines(0), lines(1)))  
    })  
    rows  
  }
```

Here we are using the wholeTextFiles method that reads the entire file (each file is an entity), reads the first two lines (the only fields we want) and creates a row from each of them. The result is a collection of rows where each row is created using only the part of the file we care about.

This will be enough to modify our app so it prints out the content of our data source. The app now looks as follows.

```scala
object app {  
  def main(args: Array[String]) {  
    val config = new SparkConf().setAppName("testing provider")  
    val sc = new SparkContext(config)  
    val sqlContext = new SQLContext(sc)  

    val df = sqlContext  
              .read  
              .format("com.nico.datasource.dat")  
              .load("/Users/anicolaspp/data/")     

    df.show()  
  }  
}
```

Even though we are reading the desired format into a data frame, there is no information about the field types of our data. Our schema definition supports different data types, yet we are not enforcing them.

Let’s modify our buildScan method so it infers the type information when creating each row.

```scala
override def buildScan(): RDD[Row] = {  
    val schemaFields = schema.fields  
    val rdd = sqlContext  
                .sparkContext  
                .wholeTextFiles(location)  
                .map(x => x._2)  

    val rows = rdd.map(file => {  
      val lines = file.split("\n")  

      val typedValues = lines.zipWithIndex.map {  
        case (value, index) => {  
          val dataType = schemaFields(index).dataType  
          castValue(value, dataType)  
        }  
    nbsp;  }  
      Row.fromSeq(typedValues)  
    })  

    rows  
  }  

   private def castValue(value: String, toType: DataType) = toType match {  
    case _: StringType      => value  
    case _: IntegerType     => value.toInt  
  }
```

Here, the only change is that we are casting each value read from our files into its correct type, inferred from the schema.fields object. In our particular case we are only interested that name is a String and age an Integer, but again, we could be very creative at this point.

Now, our final LegacyRelation class will look as follows.

```scala
class LegacyRelation(location: String, userSchema: StructType)  
  (@transient val sqlContext: SQLContext)  
  extends BaseRelation  
      with TableScan with Serializable {  
  override def schema: StructType = {  
    if (this.userSchema != null) {  
      return this.userSchema  
    }  
    else {  
      return StructType(Seq(StructField("name", StringType, true),   
                            StructField("age", IntegerType, true)))  
    }  
  }  
  private def castValue(value: String, toType: DataType) = toType match {  
    case _: StringType      => value  
    case _: IntegerType     => value.toInt  
  }  
  override def buildScan(): RDD[Row] = {  
    val schemaFields = schema.fields  
    val rdd = sqlContext  
              .sparkContext  
              .wholeTextFiles(location)  
              .map(x => x._2)  

    val rows = rdd.map(file => {  
      val lines = file.split("\n")  
      val typedValues = lines.zipWithIndex.map{  
        case (value, index) => {  
          val dataType = schemaFields(index).dataType  
          castValue(value, dataType)  
        }  
      }  
      Row.fromSeq(typedValues)  
    })  
    rows  
  }
```

Now we can load our data into a DataFrame and register it to be used by SQL clients as we explain in our previous post. Our app is as simple as shown below.

```scala
object app {  
  def main(args: Array[String]) {  
    val config = new SparkConf().setAppName("testing provider")  
    val sc = new SparkContext(config)  
    val sqlContext = new SQLContext(sc)  
    val df = sqlContext  
              .read  
              .format("com.nico.datasource.dat")  
              .load("/Users/anicolaspp/data/")     

    df.registerTempTable("users")  
    sqlContext.sql("select name from users").show()  
  }  
}
```

We have shown enough to read a custom format into a data frame so we can take advantage from the DataFrame API, yet more can be done.

The Data Source API not only offers functionalities for reading data, but also to write it in a custom format. This functionality is very powerful if we want to transform a data set from one  format to another one. Let’s see how we add these capabilities to our existing driver.

## Writing a Formatter

Let’s suppose we want to save our data so it can be read from other standard systems. We are going to load our custom data source and create a CSV-like output from it.

In order to support save calls from the API, our DefaultSource class has to mix with the CreatableRelationProvider trait. This trait has a method called createRelation we need to implement. Let’s take a look at it.

```scala
override def createRelation(sqlContext: SQLContext, mode: SaveMode,   
    parameters: Map[String, String], data: DataFrame): BaseRelation = {  

    saveAsCsvFile(data, parameters.get("path").get)  
    createRelation(sqlContext, parameters, data.schema)  
  }  

  def saveAsCsvFile(data: DataFrame, path: String) = {  
    val dataCustomRDD = data.rdd.map(row => {  
      val values = row.toSeq.map(value => value.toString)  
      values.mkString(",")  
    })  
    dataCustomRDD.saveAsTextFile(path)  
  }
```

We are basically saving our data frame as a CSV-like file and then returning a relation with a known schema.

The saveAsCsvFile method is creating a RDD\[String\] with our data formatted as CSV, then it saves it to the given path. For simplicity we did not include the headers in our output files, but remember we can do whatever we need to output the data in the format we require.

The entire code of our DefaultSource class is the following.

```scala
class DefaultSource extends RelationProvider   
    with SchemaRelationProvider   
    with CreatableRelationProvider {  
  override def createRelation(sqlContext: SQLContext,   
    parameters: Map[String, String]): BaseRelation = {  

        createRelation(sqlContext, parameters, null)  
  }  
  override def createRelation(sqlContext: SQLContext,   
    parameters: Map[String, String], schema: StructType): BaseRelation = {  

        parameters.getOrElse("path", sys.error("'path' must be specified for CSV data."))  
        return new LegacyRelation(parameters.get("path").get, schema)(sqlContext)  
  }  
  def saveAsCsvFile(data: DataFrame, path: String) = {  
    val dataCustomRDD = data.rdd.map(row => {  
      val values = row.toSeq.map(value => value.toString)  
      values.mkString(",")  
    })  
    dataCustomRDD.saveAsTextFile(path)  
  }  
  override def createRelation(sqlContext: SQLContext, mode: SaveMode,   
    parameters: Map[String, String], data: DataFrame): BaseRelation = {  

        saveAsCsvFile(data, parameters.get("path").get)  
        createRelation(sqlContext, parameters, data.schema)  
  }  
}
```

In order to save our original data as CSV-like format, we modify our app as follow.

```scala
object app {  
  def main(args: Array[String]) {  
    val config = new SparkConf().setAppName("testing provider")  
    val sc = new SparkContext(config)  
    val sqlContext = new SQLContext(sc)  

    val df = sqlContext  
              .read  
              .format("com.nico.datasource.dat")  
              .load("/Users/anicolaspp/data/")     

    df.write  
      .format("com.nico.datasource.dat")  
      .save("/Users/anicolaspp/data/output")  
  }  
}
```

Note that every time we read/write our data, we need to specify the package name where our DefaultSource class is located.

We now can package our library and include it in any project we need to use the data source we described. Many other libraries are being created to support all possible formats we can imagine and now you can create your own to contribute to the community or just to be used in your own projects.

## Endings

We have seen how to load data from a custom format into data frames using the Spark Data Source API. We also reviewed the classes involved in the process, especially how Spark uses our DefaultSource from our package to perform the required operations. We also implemented an output formatter so our data frames can be saved, as we like to.

There is much more we can do with the Data Source API, but finding the right documentation has been quite hard in my experience. I believe that better documentation could be created, specifically for those parts of the API that are very useful when extending them.

Even though our example shows how to extend the Data Source API to support a simple format, it can be modified to read and write more complex types such as binary encoded entities.

The ability to integrate our own data types into Spark makes it one of the top frameworks for data processing out there.

In the Hadoop world we can find a lot of tools that share goals and functionalities, but none of them is as flexible and versatile as Spark. This makes Spark very desirable in this field. If we are interested in a processing framework capable of work under limitless circumstances, then Apache Spark is the way to go.

[View the original](https://medium.com/@anicolaspp/extending-our-spark-sql-query-engine-5f4a088de986)