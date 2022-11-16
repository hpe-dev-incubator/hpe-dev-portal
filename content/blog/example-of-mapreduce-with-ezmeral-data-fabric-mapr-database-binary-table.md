---
title: Using MapReduce with an HPE Ezmeral Data fabric database binary table
date: 2022-11-14T15:56:03.596Z
featuredBlog: false
author: Raymond Yan
authorimage: /img/raymondyan-profile.png
thumbnailimage: /img/mapreduce_with_edf_binarytable.png
disable: false
tags:
  - hpe-ezmeral-data-fabric
  - MapReduce
---
## Introduction

No matter what kind of application you want to develop, the underlying layer will need a database.
Nowadays, applications based on big data are generally divided into two types: BI (Business Intelligence) and AI (Artificial Intelligence).
Naturally, both of these two types of applications require a big data system as a base.
In traditional applications, we use RDBMS as the database, but in big data systems, we need to use NoSQL databases.
There is no need to elaborate on the difference between RDBMS and NoSQL.

**However, among the many NoSQL systems, why should we consider using HPE Ezmeral Data Fabric database?**
Let's first look at the position of the Ezmeral Data Fabric Database in the Ezmeral Data Fabric software stack.

![EDF Database is based on File System](/img/system_architecture_position-hpe-edf_database.png "Position of the Database in EDF stack")

Since the bottom layer of Ezmeral Data Fabric Database is the File System, this question also involves the advantages of Ezmeral Data Fabric File System compared to other similar products: better performance and simpler management and ease of use.

There is a detailed description in the official document, here I would like to talk about my personal feelings.
For example, using the open source Apache Hadoop, I need to consider merging small files before putting them into Hadoop. This is because of its design principles. In order to fully utilize the performance of Hadoop, it is necessary to do so. In Ezmeral Data Fabric File System, I don't have to care so much about whether small files need to be merged. This is because of the existence of the logical unit Volume in the Ezmeral Data Fabric File System. As long as we use this feature reasonably, saving many small files in the Ezmeral Data Fabric File System will not cause too much waste to the performance and capacity of the system.
Another advantage of Ezmeral Data Fabric File System is that it provides a very widely used protocol interface: NFS.
That is to say, you can mount Ezmeral Data Fabric File System as an NFS file system on your PC. This is something that Hadoop and other peer commercial software cannot do.

Of course, Ezmeral Data Fabric File System has other advantages. What I want to emphasize here is that Ezmeral Data Fabric Database is built on top of  File System, so these advantages are also the advantages of Database.

Now let me talk about the most important unique advantages of Ezmeral Data Fabric Database that I personally feel.
The first thing that comes to my mind is, the simplicity of the product.
For example, if you are using products in the Apache Hadoop ecosystem, or a commercial version of a big data system like Cloudera, you need to install and maintain the NoSQL service included in it separately. For example, we often come into contact with: HBase, MongoDB, etc.
But in Ezmeral Data Fabric, we don't need to deploy HBase and MongoDB separately, because these two different types of NoSQL systems have been integrated in Ezmeral Data Fabric Core as Ezmeral Data Fabric Database. From the process level, we only see one MFS process.
When you are using HBase, you need to care about the HBase Master and Region Server processes, as well as the underlying Hadoop Namenode and Datanode processes.
Ezmeral Data Fabric Database includes two different types of NoSQL database systems, namely: Binary Table and JSON Table, which correspond to open source HBase and MongoDB respectively.
Now, only one software process can be seen, which is MFS. And when you use a completely open source big data technology stack or other commercial big data platforms, you will still see a bunch of processes, which is one of the biggest differences: simplicity.

Although it seems that the column-oriented NoSQL database such as HBase is a bit outdated in design compared with the document-oriented NoSQL database such as MongoDB, but since I did not find other demo articles related to Binary Table(better replacement for HBase) in the HPE Dev Portal , I decided to write such an article to introduce the demo of MapReduce based on Binary Table.
Note: I found a demo of Spark based on HBase: \[Spark Streaming with HBase](\[SparkStreamingWithHbase]: https://developer.hpe.com/blog/spark-streaming-with-hbase/) (Author: Carol McDonald).

So, I briefly talked about why we need to consider using Ezmeral Data Fabric Database, what are its advantages over other similar products: simplicity, and the advantages of other Ezmeral Data Fabric File System compared with similar products: performance, ease of use, and ease of maintenance.
As for why we use this kind of NoSQL products, I don’t think I need to go into details here. This is the same as why Hadoop, a big data file system, was born. Simply put, it is because we need to build a distributed storage and computing system. In order to complete the analysis and computation tasks of huge data volumes on cheap commercial computers.
In addition, the main reason for me to write this article is: I did not find a demo article in the HPE Dev Portal that introduces the use of Binary Table and MapReduce together, so I would like to add such an example.

Now let's get to the topic.

This article will cover:

1. How to create a Development Environment for HPE Ezmeral Data Fabric on Linux, Microsoft Windows and Apple Mac. 

This is a one-node cluster based on Docker containers, with a choice of different Ezmeral Data Fabric versions, it integrates Ezmeral Ecosystem Packs.
This way you can quickly create an Ezmeral Data Fabric environment on your work computer.

2. Demonstrate a MapReduce application that uses Ezmeral Data Fabric's Database Binary Table as the backend service.

I will create the table using the hbase shell command line tool customized for Ezmeral Data Fabric Database and do aggregation operations using a MapReduce application.

## Prerequisite: Create a Development Environment for Ezmeral Data Fabric

There is already an article on the HPE Developer Portal blog that describes how to deploy a Development Environment👉: [Getting Started with Spark on MapR Sandbox](https://developer.hpe.com/blog/getting-started-with-spark-on-mapr-sandbox/)

However, I recommend you to read the latest official documentation first👉: [Development Environment for HPE Ezmeral Data Fabric](https://docs.datafabric.hpe.com/70/MapRContainerDevelopers/MapRContainerDevelopersOverview.html)

**Note**:
Basically you can follow the instructions in the documentation, the documentation tells you to install Docker Desktop on a Apple Mac, but you don't have to install Docker Desktop, it's fine to install the Docker Engine in a standard Linux distribution.

**It's worth noting that installing Docker Desktop in Microsoft Windows won't work.**

I tried the following: first install Microsoft WSL2 (Windows Subsystem Linux 2), then install Docker Desktop for Microsoft Windows and integrate with WSL2, then run the Ezmeral Data Fabric Development Environment install script, but it still fails.

So what I ended up doing was: install VMWare on my Microsoft Windows PC, create a CentOS8 VM, and run the Ezmeral Data Fabric Development Environment setup script in the VM. This approach is feasible.
Also, you can always choose the version of the Development Environment you want to deploy, you just need to change the tag of the Docker image.

## MapReduce on Ezmeral Data Fabric Database Binary Table

Ezmeral Data Fabric Database Binary Table is equivalent to the Ezmeral Data Fabric version of Apache HBase, but its technical implementation is different from HBase, which is of course, because the bottom layer of Ezmeral Data Fabric Database Binary Table is Ezmeral Data Fabric File Store.

For users, there is almost no difference between using Ezmeral Data Fabric Database Binary Table and using HBase.

Now, let's imagine that we want to build a User Notifications service.

Since HBase does not support any operations that across rows or across tables, in order to implement operations such as Joins and Group by in RDBMS, we will use MapReduce to complete some data analysis tasks.

### Create a Binary Table

**Important note**:

<ins>the commands in this article are all executed as the user "mapr", which is by default the admin user of the Ezmeral Data Fabric Development Environment.</ins>

<ins>You can also use the "root" user to create the table and run the application, but if you don't modify the ACEs of the table, the "mapr" user would be not able to see the data in the table.</ins>

We are going to use the [hbase shell](https://docs.datafabric.hpe.com/70/ReferenceGuide/HBaseShellforMapR-DB.html) to create a [Binary Table](https://docs.datafabric.hpe.com/70/MapR-DB/intro-binary-tables.html) inside the Ezmeral Data Fabric Database.
To be able to use the `hbase shell`, we need to install the **[mapr-hbase](https://docs.datafabric.hpe.com/70/AdvancedInstallation/InstallingHBase-client-node.html?hl=mapr-hbase)** package first.

**For convenience of data management, I would like to create a volume for the Binary Table, the command are as following:**

```bash
sudo -u mapr maprcli volume list -output terse -columns volumename,volumetype,actualreplication,localpath,mounted,mountdir,logicalUsed,used,nameContainerDataThresholdMB,nameContainerSizeMB,needsGfsck

maprcli volume create -name test.binarytable1 -path /testbinarytable1volume

# sudo -u mapr maprcli volume mount -name test.binarytable1 -path /testbinarytable1volume
sudo -u mapr hadoop fs -ls -d -h /testbinarytable1volume
sudo -u mapr hadoop mfs -ls /testbinarytable1volume
```

☝ The volume's name is: test.binarytable1 and it will be mounted as <ins>/testbinarytable1volume/</ins> in the Ezmeral Data Fabric File System.

**Now we can create the Binary Table**

👇 Inside `hbase shell`:

```
create '/testbinarytable1volume/notifications','attributes','metrics'
```

Table name is <ins>/testbinarytable1volume/notifications</ins>. **attributes** and **metrics** are column families.

**Note**: In Ezmeral Data Fabric Database Binary Table, the table name is by default a path in the File System.
You can change the style of the table name to be like in Apache HBase, refer to👉: [Mapping to HBase Table Namespaces](https://docs.datafabric.hpe.com/70/UpgradeGuide/.MappingTableNamespace-HBase-DBbinary_2.html).

### Build and Run The MapReduce Application

**Important note**: Before running the MapReduce application, if you are using the Development Environment, you have to complete the following steps: [Installing Hadoop and YARN](https://docs.datafabric.hpe.com/70/AdvancedInstallation/InstallingHadoop.html).

It's because by default the YARN framework is not installed and hence the MapReduce framework is not installed.

#### MapReduce Application Source Code

I have put the code on Github: [Example-MapReduce-With-EzmeralDataFabricMapR-DatabaseBinaryTable](https://github.com/aruruka/Example-MapReduce-With-EzmeralDataFabricMapR-DatabaseBinaryTable).
You can download it and compile it using Visual Studio Code.

This MapReduce application is simple, the following is the logic:

1. Get data from the source table: <ins>/testbinarytable1volume/notifications</ins> and output aggregated data to the target table: <ins>/testbinarytable1volume/summary</ins>.
2. It's basically a varietas of "Word Count". This MapReduce application simply aggregates the number of rows which contains a column called "type" in the "attributes" column family.

For example, there may be comment type, promotion type, friend-request type, etc. in this table.
Then the app will count how many rows of comment type, promotion typee, friend-request type are there.

#### How to Run it On Ezmeral Data Fabric

You can run the MapReduction application on your one-node cluster of Ezmeral Data Fabric Development Environment, then.
Refer to the following command:

First, we need to create a new table(target table) for storing the counter number:

```bash
create '/testbinarytable1volume/summary','metrics'
```

Then, run the MapReduce application via `yarn jar` command:

```bash
sudo -u mapr \
yarn jar ./target/original-hbase-example-1.0-SNAPSHOT.jar com.shouneng.learn.mapReduce.Main \
  -libjar ./hbase-server-1.4.13.200-eep-810.jar,hbase-client-1.4.13.200-eep-810.jar,hadoop-common-2.7.6.200-eep-810.jar,hbase-common-1.4.13.203-eep-810.jar
```

Output:

```markdown
yarn jar ./target/original-hbase-example-1.0-SNAPSHOT.jar com.shouneng.learn.mapReduce.Main
WARNING: An illegal reflective access operation has occurred
WARNING: Illegal reflective access by org.apache.hadoop.hbase.util.UnsafeAvailChecker (file:/opt/mapr/hadoop/hadoop-2.7.6/share/hadoop/common/hbase-common-1.4.13.200-eep-810.jar) to method java.nio.Bits.unaligned()
WARNING: Please consider reporting this to the maintainers of org.apache.hadoop.hbase.util.UnsafeAvailChecker
WARNING: Use --illegal-access=warn to enable warnings of further illegal reflective access operations
WARNING: All illegal access operations will be denied in a future release
22/09/18 13:09:58 WARN mapreduce.TableMapReduceUtil: The addDependencyJars(Configuration, Class<?>...) method has been deprecated since it is easy to use incorrectly. Most users should rely on addDependencyJars(Job) instead. See HBASE-8386 for more details.
22/09/18 13:09:58 WARN mapreduce.TableMapReduceUtil: The hbase-prefix-tree module jar containing PrefixTreeCodec is not present.  Continuing without it.
22/09/18 13:09:58 INFO mapreduce.TableMapReduceUtil: Configured mapr.hbase.default.db maprdb
22/09/18 13:09:59 WARN mapreduce.TableMapReduceUtil: The hbase-prefix-tree module jar containing PrefixTreeCodec is not present.  Continuing without it.
22/09/18 13:09:59 WARN mapreduce.TableMapReduceUtil: The hbase-prefix-tree module jar containing PrefixTreeCodec is not present.  Continuing without it.
22/09/18 13:09:59 INFO client.MapRZKBasedRMFailoverProxyProvider: Updated RM address to m2-maprts-vm99-173.mip.storage.hpecorp.net/10.163.173.99:8032
22/09/18 13:09:59 INFO client.ConnectionFactory: mapr.hbase.default.db unsetDB is neither MapRDB or HBase, set HBASE_MAPR mode since mapr client is installed.
22/09/18 13:09:59 INFO client.ConnectionFactory: ConnectionFactory receives mapr.hbase.default.db(unsetDB), set clusterType(HBASE_MAPR), user(mapr), hbase_admin_connect_at_construction(false)
22/09/18 13:09:59 WARN mapreduce.JobResourceUploader: Hadoop command-line option parsing not performed. Implement the Tool interface and execute your application with ToolRunner to remedy this.
22/09/18 13:10:00 INFO client.ConnectionFactory: mapr.hbase.default.db unsetDB is neither MapRDB or HBase, set HBASE_MAPR mode since mapr client is installed.
22/09/18 13:10:00 INFO client.ConnectionFactory: ConnectionFactory receives mapr.hbase.default.db(unsetDB), set clusterType(HBASE_MAPR), user(mapr), hbase_admin_connect_at_construction(false)
22/09/18 13:10:00 INFO util.RegionSizeCalculator: Region size calculation disabled for MapR tables /testbinarytable1volume/notifications
22/09/18 13:10:00 INFO mapreduce.JobSubmitter: number of splits:1
22/09/18 13:10:00 INFO mapreduce.JobSubmitter: Submitting tokens for job: job_1657816483829_0017
22/09/18 13:10:00 INFO mapreduce.JobSubmitter: Executing with tokens: []
22/09/18 13:10:01 INFO security.ExternalTokenManagerFactory: Initialized external token manager class - org.apache.hadoop.yarn.security.MapRTicketManager
22/09/18 13:10:01 INFO impl.YarnClientImpl: Submitted application application_1657816483829_0017
22/09/18 13:10:01 INFO mapreduce.Job: The url to track the job: http://m2-maprts-vm99-173.mip.storage.hpecorp.net:8088/proxy/application_1657816483829_0017/
22/09/18 13:10:01 INFO mapreduce.Job: Running job: job_1657816483829_0017
22/09/18 13:10:09 INFO mapreduce.Job: Job job_1657816483829_0017 running in uber mode : false
22/09/18 13:10:09 INFO mapreduce.Job:  map 0% reduce 0%
22/09/18 13:10:17 INFO mapreduce.Job:  map 100% reduce 0%
22/09/18 13:10:22 INFO mapreduce.Job:  map 100% reduce 100%
22/09/18 13:10:22 INFO mapreduce.Job: Job job_1657816483829_0017 completed successfully
22/09/18 13:10:22 INFO mapreduce.Job: Counters: 59
        File System Counters
                FILE: Number of bytes read=0
                FILE: Number of bytes written=282992
                FILE: Number of read operations=0
                FILE: Number of large read operations=0
                FILE: Number of write operations=0
                MAPRFS: Number of bytes read=347
                MAPRFS: Number of bytes written=170
                MAPRFS: Number of read operations=38
                MAPRFS: Number of large read operations=0
                MAPRFS: Number of write operations=42
        Job Counters
                Launched map tasks=1
                Launched reduce tasks=1
                Rack-local map tasks=1
                Total time spent by all maps in occupied slots (ms)=5632
                Total time spent by all reduces in occupied slots (ms)=8865
                Total time spent by all map tasks (ms)=5632
                Total time spent by all reduce tasks (ms)=2955
                Total vcore-seconds taken by all map tasks=5632
                Total vcore-seconds taken by all reduce tasks=2955
                Total megabyte-seconds taken by all map tasks=5767168
                Total megabyte-seconds taken by all reduce tasks=9077760
                DISK_MILLIS_MAPS=2816
                DISK_MILLIS_REDUCES=3930
        Map-Reduce Framework
                Map input records=4
                Map output records=4
                Map output bytes=55
                Map output materialized bytes=0
                Input split bytes=181
                Combine input records=0
                Combine output records=0
                Reduce input groups=2
                Reduce shuffle bytes=65
                Reduce input records=4
                Reduce output records=2
                Spilled Records=8
                Shuffled Maps =1
                Failed Shuffles=0
                Merged Map outputs=2
                GC time elapsed (ms)=209
                CPU time spent (ms)=4600
                Physical memory (bytes) snapshot=1240059904
                Virtual memory (bytes) snapshot=9576202240
                Total committed heap usage (bytes)=1421869056
        HBase Counters
                BYTES_IN_REMOTE_RESULTS=0
                BYTES_IN_RESULTS=0
                MILLIS_BETWEEN_NEXTS=0
                NOT_SERVING_REGION_EXCEPTION=0
                NUM_SCANNER_RESTARTS=0
                NUM_SCAN_RESULTS_STALE=0
                REGIONS_SCANNED=0
                REMOTE_RPC_CALLS=0
                REMOTE_RPC_RETRIES=0
                ROWS_FILTERED=0
                ROWS_SCANNED=0
                RPC_CALLS=0
                RPC_RETRIES=0
        Shuffle Errors
                IO_ERROR=0
        File Input Format Counters
                Bytes Read=0
        File Output Format Counters
                Bytes Written=0
```

**Important note**: If you encountered the issue that some of the HBase related Java packages are missing, you can simply copy the following packages from 📁<ins>/opt/mapr/hbase/hbase-{VERSION}/lib/</ins> to 📁<ins>/opt/mapr/hadoop/hadoop-{VERSION}/share/hadoop/common/</ins>.

* hbase-client-*.jar
* hbase-server-*.jar
* hbase-protocol-*.jar
* hbase-hadoop2-compat-*.jar
* hbase-hadoop-compat-*.jar
* hbase-metrics-*.jar
* hbase-metrics-api-*.jar
* hbase-shaded-gson-*.jar
* hbase-shaded-htrace-*.jar
* metrics-core-*.jar
* hbase-common-*.jar

You may run into this issue because the HBase related packages are considered as third-party libraries to the Hadoop system.
For more information, refer to👉: [Install the third-party libraries on each node that runs the program](https://docs.datafabric.hpe.com/70/DevelopmentGuide/Manage3rdPartyLibsForMapReduce.html).

## Glossary

<details>
<summary>HPE Ezmeral Data Fabric (aka. MapR)</summary>

HPE Ezmeral Data Fabric is a platform for data-driven analytics, ML, and AI workloads.
The platform serves as a secure data store and provides file storage, NoSQL databases, object storage, and event streams.
The patented filesystem architecture was designed and built for performance, reliability, and scalability.
📖[Documentation website](https://docs.datafabric.hpe.com/70/index.html)

</details>

<details>
<summary>Ezmeral Ecosystem Packs</summary>

This is a software collection package that includes computing scheduling frameworks and computing engines of common Hadoop ecosystems such as YARN, Spark, Drill, and Hive, as well as a service suite for monitoring performance indicators and logs of Ezmeral Data Fabric.
Users of Ezmeral Data Fabric will use these customized Spark, Drill, Hive and other software to complete computing, analysis tasks and machine learning tasks.

</details>

## Summary

In this blog post, I introduced the advantages of Ezmeral Data Fabric Database compared to similar products. I also demonstrated a MapReduce application based on Ezmeral Data Fabric Database binary table.
Ezmeral Data Fabric Database binary table is equivalent to a better alternative to Apache HBase.

I hope this blog post can help you quickly develop applications based on Ezmeral Data Fabric Database binary table.
Please note that developing an application based on Ezmeral Data Fabric Database binary table is essentially the same as developing an application based on Apache HBase, but some of the specific steps are different.
For example, in the step of creating a binary table, in addition to the method of using the `habse shell` demonstrated in this article, you can still use `maprcli`, a command line tool proprietary to Ezmeral Data Fabric.
Moreover, the experience of developing a MapReduce application based on Ezmeral Data Fabric Database binary table is also applicable to other computing engines, such as Spark.

Stay tuned to the [HPE Developer blog](https://developer.hpe.com/blog) for more interesting posts and tutorials on HPE Ezmeral Data Fabric.