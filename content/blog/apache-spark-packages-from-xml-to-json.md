---
title: "Apache Spark Packages, from XML to JSON"
date: 2020-12-11T03:26:34.663Z
author: Nicolas Perez 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","apache-spark","opensource"]
authorimage: "/img/blogs/Avatar4.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019, may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
"authorDisplayName": "Nicolas A Perez",
"publish": "2016-08-23T07:00:00.000Z",
"tags": "apache-spark"
```

---

The Apache Spark community has put a lot of effort into extending Spark. Recently, we wanted to transform an XML dataset into something that was easier to query. We were mainly interested in doing data exploration on top of the billions of transactions that we get every day. XML is a well-known format, but sometimes it can be complicated to work with. In Apache Hive, for instance, we could define the structure of the schema of our XML and then query it using SQL.

However, it was hard for us to keep up with the changes on the XML structure, so the previous option was discarded. We were using Spark Streaming capabilities to bring these transactions to our cluster, and we were thinking of doing the required transformations within Spark. However, the same problem remained, as we had to change our Spark application every time the XML structure changed.

There must be another way!

There is an Apache Spark package from the community that we could use to solve these problems. In this blog post, I'll walk you through how to use an Apache Spark package from the community to read any XML file into a DataFrame.

Let’s load the Spark shell and see an example:

```Scala
./spark-shell — packages com.databricks:spark-xml_2.10:0.3.3
```

In here, we just added the XML package to our Spark environment. This of course can be added when writing a Spark app and packaging it into a jar file.

Using the package, we can read any XML file into a DataFrame. When loading the DataFrame, we could specify the schema of our data, but this was our main concern in the first place, so we will let Spark infer it. The inference of the DataFrame schema is a very powerful trick since we don’t need to know the schema anymore so it can change at any time.

Let’s see how we load our XML files into a DataFrame:

```Scala
val df = sqlContext
          .read
          .format("com.databricks.spark.xml")
          .option("rowTag", "OrderSale")
          .load("~/transactions_xml_folder/")

df.printSchema

```

Printing the DataFrame schema gives us an idea of what the inference system has done.

```Scala
root
 |-- @ApplicationVersion: string (nullable = true)
 |-- @BusinessDate: string (nullable = true)
 |-- @Change: double (nullable = true)
 |-- @EmployeeId: long (nullable = true)
 |-- @EmployeeName: string (nullable = true)
 |-- @EmployeeUserId: long (nullable = true)
 |-- @MealLocation: long (nullable = true)
 |-- @MessageId: string (nullable = true)
 |-- @OrderNumber: long (nullable = true)
 |-- @OrderSourceTypeId: long (nullable = true)
 |-- @PosId: long (nullable = true)
 |-- @RestaurantType: long (nullable = true)
 |-- @SatelliteNumber: long (nullable = true)
 |-- @SpmHostOrderCode: string (nullable = true)
 |-- @StoreNumber: long (nullable = true)
 |-- @TaxAmount: double (nullable = true)
 |-- @TaxExempt: boolean (nullable = true)
 |-- @TaxInclusiveAmount: double (nullable = true)
 |-- @TerminalNumber: long (nullable = true)
 |-- @TimeZoneName: string (nullable = true)
 |-- @TransactionDate: string (nullable = true)
 |-- @TransactionId: long (nullable = true)
 |-- @UTCOffSetMinutes: long (nullable = true)
 |-- @Version: double (nullable = true)
 |-- Items: struct (nullable = true)
 |    |-- MenuItem: struct (nullable = true)
 |    |    |-- #VALUE: string (nullable = true)
 |    |    |-- @AdjustedPrice: double (nullable = true)
 |    |    |-- @CategoryDescription: string (nullable = true)
 |    |    |-- @DepartmentDescription: string (nullable = true)
 |    |    |-- @Description: string (nullable = true)
 |    |    |-- @DiscountAmount: double (nullable = true)
 |    |    |-- @Id: long (nullable = true)
 |    |    |-- @PLU: long (nullable = true)
 |    |    |-- @PointsRedeemed: long (nullable = true)
 |    |    |-- @Price: double (nullable = true)
 |    |    |-- @PriceLessIncTax: double (nullable = true)
 |    |    |-- @PriceOverride: boolean (nullable = true)
 |    |    |-- @ProductivityUnitQuantity: double (nullable = true)
 |    |    |-- @Quantity: long (nullable = true)
 |    |    |-- @TaxAmount: double (nullable = true)
 |    |    |-- @TaxInclusiveAmount: double (nullable = true)
 |-- OrderTaxes: struct (nullable = true)
 |    |-- TaxByImposition: struct (nullable = true)
 |    |    |-- #VALUE: string (nullable = true)
 |    |    |-- @Amount: double (nullable = true)
 |    |    |-- @ImpositionId: long (nullable = true)
 |    |    |-- @ImpositionName: string (nullable = true)
 |-- Payments: struct (nullable = true)
 |    |-- Payment: struct (nullable = true)
 |    |    |-- #VALUE: string (nullable = true)
 |    |    |-- @AccountIDLast4: string (nullable = true 
```

At this point, we could use any SQL tool to query our XML using Spark SQL. Please read this post [Apache Spark as a Distributed SQL Engine](https://medium.com/@anicolaspp/apache-spark-as-a-distributed-sql-engine-4373e254e0f9#.w77z4ml3r) to learn more about Spark SQL. Going a step further, we could use tools that can read data in JSON format. Having JSON datasets are especially useful if you have something like Apache Drill.

As we could expect, with Spark we can do any kind of transformations, but there is no need to write a fancy JSON encoder because Spark already supports these features. Let’s convert our DataFrame to JSON and save it our file system.

```Scala
val jsons = df.toJSON
jsons.saveAsTextFile("~/json_folder/")

```

When applying the JSON function to the DataFrame, we get `an RDD[String]` with the JSON representation of our data. Then we save the RDD as a plain text file. Now, we could use Drill to read and query our new dataset and of course, we can always go back to Spark if we need to do something more complicated operations / transformations.

## Conclusion

Transforming our dataset from XML to JSON is an easy task in Spark, but the advantages of JSON over XML are a big deal. We now can rest assured that XML schema changes are not going to affect us at all. We have removed ourselves from the burden of changing our application for every XML change. We can also use powerful tools to query our JSON dataset such as Apache Drill in a schema free fashion while our clients can report on our data using SQL.