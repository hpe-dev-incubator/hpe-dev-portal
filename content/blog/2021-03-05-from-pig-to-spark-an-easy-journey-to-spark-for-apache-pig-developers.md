---
title: "From Pig to Spark: An Easy Journey to Spark for Apache Pig Developers"
date: 2021-03-05T11:54:50.148Z
author: Philippe de Cuzey
authorimage: /img/blogs/Avatar1.svg
tags:
  - hpe-ezmeral-data-fabric
  - MapR
  - apache-spark
  - opensource
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019 may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)



## Original Post Information:

```
"authorDisplayName": "Philippe de Cuzey",
"publish": "2016-07-13T07:00:00.000Z",
"tags": "apache-spark"
```



---



As a data analyst that primarily used Apache Pig in the past, I eventually needed to program more challenging jobs that required the use of Apache Spark, a more advanced and flexible language. At first, Spark may look a bit intimidating, but this blog post will show that the transition to Spark (especially PySpark) is quite easy.



However, I'm not advocating that you move from Apache Pig to Spark in all cases. Pig is a wonderful language. It's simple yet efficient when it comes to transforming data through projections and aggregations, and the productivity of Pig can't be beat for standard Map/Reduce jobs.



## Apache Pig has great features, but …



I like to think of Pig as a high-level Map/Reduce commands pipeline. As a former SQL programmer, I find it quite intuitive and, in my organization, our Hadoop jobs are still mostly developed in Pig.



Pig has a lot of qualities: it is stable, scales very well, and integrates natively with the Hive metastore HCatalog. By describing each step atomically, it minimizes conceptual bugs that you often find in complicated SQL code.



But sometimes, Pig has some limitations that makes it a poor programming paradigm to fit your needs. The three main limitations are:



Pig is a pipeline and doesn’t offer loops or code indirections (IF..THEN) which can sometimes be mandatory in your code. As beautifully stated in [an article by Jai Ranganathan and Matei Zaharia](https://databricks.com/blog/2014/03/20/apache-spark-a-delight-for-developers.html):



> _While scripting frameworks like Apache Pig provide many high-level operators as well, Spark allows you to access these operators in the context of a full programming language—thus, you can use control statements, functions, and classes as you would in a typical programming environment._



Finally, a third Pig limitation is related to input data formats: although Pig is good with CSV and HCatalog, it seems a bit less comfortable with reading and processing some other data formats like JSON (through JsonLoader), whereas Spark integrates them natively.



## Give Apache Spark a try



Time to take a dip in Spark! Pig and Spark share a common programming model that makes it easy to move from one to the other. Basically, you work through immutable transformations identified by an alias (Pig) or an RDD variable (Spark). Transformations are usually projections (maps), filters, or aggregations like GroupBy, sorts, etc.



This common programming approach means that, for a Pig developer, the learning curve to Spark is fairly quick.



PySpark is quite a natural choice for the data analyst who already has some Python basic skills, but the code would be similar in another flavor of Spark, such as Java or Scala.



## A complete example



As an illustration, let’s take an example of a Pig script that loads a log file, filters it for a specific day, calculates the number of log entries grouped by item, and adds the item description from another file:



```python
/* load a log file of user sessions. Filter for a specific date and count entries per item
*/

f0 = LOAD 'logfile' using PigStorage('\t') AS (log_date:chararray, item_id:chararray, some_stuff:chararray);
f1 = FILTER f0 BY log_date == '20160515';
f2 = FOREACH f1 GENERATE item_id;
f3 = GROUP f2 BY item_id;
f4 = FOREACH f3 GENERATE group AS item_id, COUNT(f2) AS nb_entries;

/* add item name
*/

item1 = LOAD 'item' using PigStorage('\t') AS (item_id:chararray, item_name:chararray);
join1 = JOIN f4 BY item_id LEFT, item1 BY item_id;
result = FOREACH join1 GENERATE f4::item_id, item_name, nb_entries;

STORE result INTO 'result_file' USING PigStorage('\t');

```



The code is fairly simple, and each step performs one transformation.

Now in Spark, we start with raw Spark using low-level RDDs to show similarities with Pig code. In the code, things are detailed one alias at a time, but obviously production code would be more compact.



## Raw Spark (using RDD)



```python
conf **=** SparkConf()
sc **=** SparkContext(conf=conf)
f0 **=** sc.textFile('logfile').map(**lambda** x: x.split('\t'))
f1 **=** f0.filter(**lambda** x: x[0] == '20160515')
f3 **=** f1.groupBy(**lambda** (log_date, item_id, some_stuff): item_id)
f4 **=** f3.map (**lambda** (item_id, iterable): (item_id, len(iterable)))

# add item name
item1 **=** sc.textFile('item').map(**lambda** x: x.split('\t'))

# no need to set the key item_id on both parts before performing the join,
# It's already on first place on each part.

join1 **=** f4.leftOuterJoin(item1)

result **=** join1.map(**lambda** (item_id, (nb_entries, item_name)): (item_id, item_name, str(nb_entries)))

# creating a line of tab separated fields, and save it in the result file
result_to_store **=** result.map (**lambda** record : '\t'.join(record))
result_to_store.saveAsTextFile('result_file')

```



We can see here a similar code outline between Pig and Spark, which makes it easier for a Pig developer to start coding in Spark. One drawback, however, is that for relatively simple operations like this, Pig is still more productive than Spark, even if execution time is better (but not astoundingly better) with Spark.

Now that we are getting familiar with this low-level RDD, code could be improved by using DataFrames and SparkSQL. The previous code could be rewritten in a more readable form:



## Spark with DataFrames and SparkSQL



```python
conf **=** SparkConf()
sc **=** SparkContext(conf=conf)

sqlContext **=** SQLContext(sc)

f0 **=** sc.textFile('logfile').map(**lambda** x: x.split('\t'))

fpFields = [ \
   StructField('log_date', StringType(), True), \
   StructField('item_id', StringType(), True), \
   StructField('some_stuff', StringType(), True) \
]

fpSchema **=** StructType(fpFields)
df_f0 **=** sqlContext.createDataFrame(f0, fpSchema)
df_f0.registerTempTable('log')

f1_df **=** sqlContext.sql(
   "SELECT log.item_id, count(*) AS nb_entries \
      FROM log \
     WHERE log_date **=** '20160515'\
  GROUP BY item_id"
)
f1_df.registerTempTable('log_agg')
# items dataframe

item1 **=** sc.textFile('item').map(**lambda** x: x.split('\t'))

itemFields **=** [ \
   StructField('item_id', StringType(), True), \
   StructField('item_name', StringType(), True) \
]

itemSchema **=** StructType(itemFields)
df_item1 **=** sqlContext.createDataFrame(item1, itemSchema)

df_item1.registerTempTable('item')

result **=** sqlContext.sql(
   'SELECT log_agg.item_id, item_name, format_number(nb_entries, 0) \
      FROM log_agg \
  LEFT OUTER JOIN item ON log_agg.item_id = item.item_id'
)

result_to_store **=** result.rdd \
     .map (**lambda** record : '\t'.join(record))

result_to_store.saveAsTextFile('result_file')

```



I’m sure there are even more compact and elegant ways to do it in Spark SQL, but this is the outline.



Now we have named fields, type safety, and compact SQL code that is more readable by a data analyst. Productivity has increased, and this is a better alternative to Pig.



The drawback is that each piece of SQL is now a black box that can be only tested as a whole, which can prove tricky if the result differs from the expected or if execution time is slow. It is then up to the developer to design steps that are still readable and could be executed as individual units of code.



## Loading data from Hive metastore HCatalog



If our data would have been stored in Hive HCatalog, all the DataFrame metadata would be inherited from the metastore and the Spark code would have been even simpler:



```python
conf **=** SparkConf()
sc **=** SparkContext(conf=conf)
sqlContext = HiveContext(sc)

f1_df **=** sqlContext.sql(
   "SELECT item_id, count(*****) AS nb_entries \
   FROM my_db.log \
   WHERE log_date **=** '20160515' \
   GROUP BY item_id"
)

f1_df.registerTempTable('log_agg')

result **=** sqlContext.sql(
   "SELECT log_agg.item_id, item_name, format_number(nb_entries, 0) \
      FROM log_agg \
LEFT OUTER JOIN my_db.item item ON log_agg.item_id **=** item.item_id"
)

result_to_store = result.rdd \
   .map (**lambda** record : '\t'.join(record))

result_to_store.saveAsTextFile(outputFileName)

```



Now, this is a more compact and readable piece of code :)

Let's push the advantage a bit further in favor of Spark: user-defined functions.



## User-defined functions

As stated previously, in Spark there is obviously no need for UDFs; you would just write the function as a Python method:



in Pig:



```python
/* the **function** below has been written and deployed in a jar file */
DEFINE myFancyUdf com.mydomain.myfunction1;

...

log1 = FOREACH log0 GENERATE field1, myFancyUdf (field1l);

```



In Spark:



```python
**def** myFancyUdf(f1):
   someStuff
   **return** result

log1 = log0.map (**lambda** field1: (field1, myFancyUdf(field1))

```



## More advanced topics



In this section, let's take a look at more powerful features of Pig in Spark through two examples:



## Map-side joins



One handy feature of Pig is map-side joins, where one of the tables to join is small enough to be sent to each worker to take part in the Map job (not requiring the more expensive Reduce job). This is conveniently performed by using the “replicated” hint on the `JOIN`.



Imagine that in our previous example, the ‘item’ table is small enough to fit in memory. The `join1` alias becomes:



```python
join1 = JOIN f4 BY item_id, item1 BY item_id USING ‘replicated;

result = FOREACH join1 GENERATE f4::item_id, item_name, nb_entries;

```



In Spark this is performed quite easily with [broadcast variables](http://spark.apache.org/docs/latest/rdd-programming-guide.html#broadcast-variables):



```python
# broadcast items
item_bc **=** sc.broadcast(item.collect())

 '''
gets item name from its id
''' 
**def** getItemName (item_id_to_match): # we know there will be only one result, so we take the first from the list
  (id, name) **=** filter(**lambda** (id, name): id **==** item_id_to_match, item_bc.value)[0]

```



The item table is broadcasted on each worker node. The `getItemName()` function then finds in the broadcasted table which record holds a given `item_id` and returns its name. This function is called in the map side of the Spark job, for each record processed.



The complete code now looks like:



```python
 '''
gets item name from its id
''' 

**def** getItemName (item_id_to_match):
 # we know there will be only one result, so we take the first from the
   (id, name) **=** filter(**lambda** (id, name): id **==** item_id_to_match, item_bc.value)[0]
   return name

f1_df **=** sqlContext.sql(
  "SELECT item_id, count(*****) AS nb_entries \
     FROM my_db.log \
    WHERE log_date **=** '20160515' \
   GROUP BY item_id"
)

item_df **=** sqlContext.sql(
   "SELECT item_id, item_name \
      FROM my_db.item"
)

item_bc **=** sc.broadcast(item_df.rdd.collect())

result **=** f1_df.rdd.map (**lambda****=** result.map (**lambda** record : '\t'.join(record))
result_to_store.saveAsTextFile('result_file')

```



## Window function: get n first occurrences of a sorted list of Grouped By items



It is sometimes required to find the top-n first records of a table, grouped by a common feature. From the log files of our example, let's get, for each item, the 10 most recent records (in SQL this would be a windowing function like `PARTITION BY`).



In Pig, this can be accomplished with a piece of code like:



```python
f0 = LOAD ‘logfile’ using PigStorage('\t') AS (log_date:char array, item_id:chararray, some_stuff:chararray); 

f1 = GROUP f0 BY item_id; 

f2 = FOREACH f1 {
   o = ORDER f0 BY log_date DESC;
   l = LIMIT o 10;
   GENERATE FLATTEN(l) AS (log_date, item_id, some_stuff);
}

```



In Spark it’s also feasible, either with low-level RDD stuff or with SparkSQL [Windowing capabilities](https://databricks.com/blog/2015/07/15/introducing-window-functions-in-spark-sql.html).



Let’s start with the RDD low-level solution:



```python
# create a tuple with the key for the GroupBy
f1 **=** f0.map (**lambda** (log_date, item_id, some_stuff): (item_id, (log_date, some_stuff)))

f2 **=** f1.groupByKey()

# result of the GroupBy is a tuple (item_id, iterable over grouped items)
# we sort the iterable according to log_date and retain only first 10 elements
f3 **=** f2.map (**lambda** (item_id, iter1): (item_id, sorted(list(iter1), key=lambda (log_date, item_id, some_stuff):log_date, reverse=True)[:10]))

# transform tuples of (item_id, [(log_date, item_id, some_stuff), ...]) into tuples of (log_date, item_id, some_stuff)
f4 = f3.flatMapValues(**lambda** x:x) \
.map (**lambda** (item_id, (log_date, some_stuff)):(log_date, item_id, some_stuff)

```



It's not very elegant, but it does the job.

Then the SparkSQL solution:



```python
f1_df **=** sqlContext.sql(
'SELECT \
  log_date, \
  item_id,  \
  some_stuff  \
FROM (  \
  SELECT  \
  log_date, \
  item_id,  \
  some_stuff, \
  dense_rank() OVER (PARTITION BY item_id ORDER BY log_date DESC) as rank \
FROM my_db.log) tmp \
WHERE rank <**=** 10')

f2 = f1_df.rdd.map (**lambda** row: (row.log_date, row.item_id, row.some_stuff))

```



Much better!



## Conclusion



I have voluntarily excluded from this blog post some interesting topics such as deploying, debugging, execution monitoring, dynamic resource allocation, partition and split size tuning, sampling, etc. The goal of this particular blog post is to show Pig developers how to start coding in Spark; I hope that from this perspective, you find it is helpful.