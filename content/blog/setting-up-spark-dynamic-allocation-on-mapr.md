---
title: "Setting Up Spark Dynamic Allocation on MapR"
date: 2021-02-05T05:19:26.501Z
author: Tugdual Grall 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","apache-spark", "data-ml-engineer"]
authorimage: "/img/blogs/Avatar1.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019 may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
"authorDisplayName": "Tugdual Grall",
"publish": "2016-11-03T07:00:00.000Z",
"tags": "apache-spark"
```

---

Apache Spark can use various cluster managers to execute applications (Standalone, YARN, Apache Mesos). When you install Apache Spark on MapR, you can submit an application in Standalone mode or by using YARN.

This blog post focuses on YARN and dynamic allocation, a feature that lets Spark add or remove executors dynamically based on the workload. You can find more information about this feature in this presentation from Databricks:

*   <a target='\_blank'  href='https://www.slideshare.net/databricks/dynamic-allocation-in-spark'>Dynamic Allocation in Spark</a>

Let’s see how to configure Spark and YARN to use dynamic allocation (that is disabled by default).

## Prerequisites

*   MapR Data Platform cluster
*   Apache Spark for MapR installed

The example below is for MapR 5.2 with Apache Spark 1.6.1; you just need to adapt the version to your environment.

## Enabling Dynamic Allocation in Apache Spark

The first thing to do is to enable dynamic allocation in Spark. To do this, you need to edit the Spark configuration file on each Spark node

```bash
/opt/mapr/spark/spark-1.6.1/conf/spark-defaults.conf
```

and add the following entries:

```bash
spark.dynamicAllocation.enabled = true
spark.shuffle.service.enabled = true
spark.dynamicAllocation.minExecutors = 5 
spark.executor.instances = 0

```

You can find additional configuration options in the <a target='\_blank'  href='http://spark.apache.org/docs/1.6.1/configuration.html#dynamic-allocation'>Apache Spark Documentation</a>.

## Enabling Spark External Shuffle for YARN

Now you need to edit the YARN configuration to add information about Spark Shuffle Service. Edit the following file on each YARN node:

```bash
/opt/mapr/hadoop/hadoop-2.7.0/etc/hadoop/yarn-site.xml

```

and add these properties:

```bash
<property>
    <name>yarn.nodemanager.aux-services</name>
    <value>mapreduce_shuffle,mapr_direct_shuffle,spark_shuffle</value>
</property>
<property>
    <name>yarn.nodemanager.aux-services.spark_shuffle.class</name>
    <value>org.apache.spark.network.yarn.YarnShuffleService</value>
</property>

```

## Add Spark Shuffle to YARN classpath

Spark Shuffle service must be added to the YARN classpath. The jar is located in the Spark distribution:

```bash
/opt/mapr/spark/spark-1.6.1/lib/spark-1.6.1-mapr-1605-yarn-shuffle.jar
```

To do this, add the jar in the following folder on each node:

```bash
/opt/mapr/hadoop/hadoop-2.7.0/share/hadoop/yarn/lib

```

You can either copy the file or create a symlink:

```bash
$ ln -s /opt/mapr/spark/spark-1.6.1/lib/spark-1.6.1-mapr-1605-yarn-shuffle.jar /opt/mapr/hadoop/hadoop-2.7.0/share/hadoop/yarn/lib

```

## Restart YARN

Since you have changed the YARN configuration, you must restart your node managers using the following command:

```bash
$ maprcli node services -name nodemanager -action restart -nodes [list of nodes]

```

## Submitting a Spark Job

Your MapR cluster is now ready to use Spark dynamic allocation. This means that when you submit a job, you do not need to specify any resource configuration. For example:

```bash
/opt/mapr/spark/spark-1.6.1/bin/spark-submit \
  --class com.mapr.demo.WordCountSorted \
  --master yarn \
  ~/spark-examples-1.0-SNAPSHOT.jar \
  /mapr/my.cluster.com/input/4gb_txt_file.txt \
  /mapr/my.cluster.com/user/mapr/output/

```

Note that you can still specify the resources, but in this case, the dynamic allocation will not be used for this specific job. For example:

```bash
/opt/mapr/spark/spark-1.6.1/bin/spark-submit \
  --class com.mapr.demo.WordCountSorted \
  --master yarn \
  --num-executors 3
  --executor-memory 1G \
  ~/spark-examples-1.0-SNAPSHOT.jar \
  /mapr/my.cluster.com/input/4gb_txt_file.txt \
  /mapr/my.cluster.com/user/mapr/output/

```
In this blog post, you learned how to set up Spark dynamic allocation on MapR.