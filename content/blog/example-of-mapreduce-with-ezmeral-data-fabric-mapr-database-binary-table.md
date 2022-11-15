---
title: Example of MapReduce With Ezmeral Data Fabric(MapR) Database Binary Table
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



This article will cover:



1. How to create Development Environment for HPE Ezmeral Data Fabric (EDF) on Linux, Windows and Mac.



This is a one-node cluster based on Docker containers, with a choice of different EDF versions, it integrates EEP.
This way you can quickly create an EDF environment on your work computer.



2. Demonstrate a MapReduce application that uses EDF's Database Binary Table as the backend service.



I will create the table using the hbase shell command line tool customized for EDF Database and do CRUD (Create, Read, Update, Delete) operations using a MapReduce application.



## Prerequisite: Create a Development Environment for EDF



There is already an article on the HPE Developer Portal blog that describes how to deploy a Development Environment👉: [Getting Started with Spark on MapR Sandbox][GettingStartedWithSparkOnMaprSandbox]


However, I recommend you to read the latest official documentation first👉: [Development Environment for HPE Ezmeral Data Fabric][DevelopmentEnvironmentForHpeEzmeral]



**Note**:
Basically you can follow the instructions in the documentation, the documentation tells you to install Docker Desktop on a Mac, but you don't have to install Docker Desktop, it's fine to install the Docker Engine in a standard Linux distribution.


**It's worth noting that installing Docker Desktop in Windows won't work.**


I tried the following: first install WSL2 (Windows Subsystem Linux 2), then install Docker Desktop for Windows and integrate with WSL2, then run the EDF Development Environment install script, but it still fails.


So what I ended up doing was: install VMWare on my Windows PC, create a CentOS8 VM, and run the EDF Development Environment setup script in the VM. This approach is feasible.
Also, you can always choose the version of the Development Environment you want to deploy, you just need to change the tag of the Docker image.



## MapReduce on EDF Database Binary Table



EDF Database Binary Table is equivalent to the EDF version of Apache HBase, but its technical implementation is different from HBase, which is of course, because the bottom layer of EDF Database Binary Table is EDF File Store.

For users, there is almost no difference between using EDF Database Binary Table and using HBase.


Now, let's imagine that we want to build a User Notifications service.


Since HBase does not support any operations that across rows or across tables, in order to implement operations such as Joins and Group by in RDBMS, we will use MapReduce to complete some data analysis tasks.



### Create a Binary Table



**Important note**:

<ins>the commands in this article are all executed as the user "mapr", which is by default the admin user of the EDF Development Environment.</ins>

<ins>You can also use the "root" user to create the table and run the application, but if you don't modify the ACEs of the table, the "mapr" user would be not able to see the data in the table.</ins>



We are going to use the [hbase shell][HbaseShell] to create a [Binary Table][BinaryTable] inside the EDF Database.
To be able to use the `hbase shell`, we need to install the **[mapr-hbase][MaprHbasePackage]** package first.



**For convenience of data management, I would like to create a volume for the Binary Table, the command are as following:**



```bash
sudo -u mapr maprcli volume list -output terse -columns volumename,volumetype,actualreplication,localpath,mounted,mountdir,logicalUsed,used,nameContainerDataThresholdMB,nameContainerSizeMB,needsGfsck

maprcli volume create -name test.binarytable1 -path /testbinarytable1volume

# sudo -u mapr maprcli volume mount -name test.binarytable1 -path /testbinarytable1volume
sudo -u mapr hadoop fs -ls -d -h /testbinarytable1volume
sudo -u mapr hadoop mfs -ls /testbinarytable1volume
```



☝ The volume's name is: test.binarytable1 and it will be mounted as <ins>/testbinarytable1volume/</ins> in the EDF File System.



**Now we can create the Binary Table**



👇 Inside `hbase shell`:



```
create '/testbinarytable1volume/notifications','attributes','metrics'
```



Table name is <ins>/testbinarytable1volume/notifications</ins>. **attributes** and **metrics** are column families.



**Note**: In EDF Database Binary Table, the table name is by default a path in the File System.
You can change the style of the table name to be like in Apache HBase, refer to👉: [Mapping to HBase Table Namespaces][MappingToHbaseTableNamespaces].



### Build and Run The MapReduce Application



**Important note**: Before running the MapReduce application, if you are using the Development Environment, you have to complete the following steps: [Installing Hadoop and YARN][InstallingHadoopAndYarn].


It's because by default the YARN framework is not installed and hence the MapReduce framework is not installed.



#### MapReduce Application Source Code



I have put the code on Github: [Example-MapReduce-With-EzmeralDataFabricMapR-DatabaseBinaryTable][MapReduceEDFDataBaseBinaryTable].
You can download it and compile it using Visual Studio Code.



This MapReduce application is simple, the following is the logic:



1. Get data from the source table: <ins>/testbinarytable1volume/notifications</ins> and output aggregated data to the target table: <ins>/testbinarytable1volume/summary</ins>.
2. It's basically a varietas of "Word Count". This MapReduce application simply aggregates the number of rows which contains a column called "type" in the "attributes" column family.



For example, there may be comment type, promotion type, friend-request type, etc. in this table.
Then the app will count how many rows of comment type, promotion typee, friend-request type are there.



#### How to Run it On EDF



You can run the MapReduction application on your one-node cluster of EDF Development Environment, then.
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



- hbase-client-\*.jar
- hbase-server-\*.jar
- hbase-protocol-\*.jar
- hbase-hadoop2-compat-\*.jar
- hbase-hadoop-compat-\*.jar
- hbase-metrics-\*.jar
- hbase-metrics-api-\*.jar
- hbase-shaded-gson-\*.jar
- hbase-shaded-htrace-\*.jar
- metrics-core-\*.jar
- hbase-common-\*.jar



This is because the HBase related packages are considered as third-party libraries to the Hadoop system, refer to👉: [Install the third-party libraries on each node that runs the program][InstallTheThird-partyLibrariesOn].



## Explanation of some glossary



<details>
<summary>HPE Ezmeral Data Fabric (AKA. MapR)</summary>



EDF for short.
HPE Ezmeral Data Fabric is a platform for data-driven analytics, ML, and AI workloads.
The platform serves as a secure data store and provides file storage, NoSQL databases, object storage, and event streams.
The patented filesystem architecture was designed and built for performance, reliability, and scalability.
📖[Documentation website][EDFDocumentation]



</details>



[EDFDocumentation]: https://docs.datafabric.hpe.com/70/index.html
[GettingStartedWithSparkOnMaprSandbox]: https://developer.hpe.com/blog/getting-started-with-spark-on-mapr-sandbox/
[DevelopmentEnvironmentForHpeEzmeral]: https://docs.datafabric.hpe.com/70/MapRContainerDevelopers/MapRContainerDevelopersOverview.html
[HbaseShell]: https://docs.datafabric.hpe.com/70/ReferenceGuide/HBaseShellforMapR-DB.html
[BinaryTable]: https://docs.datafabric.hpe.com/70/MapR-DB/intro-binary-tables.html
[MaprHbasePackage]: https://docs.datafabric.hpe.com/70/AdvancedInstallation/InstallingHBase-client-node.html?hl=mapr-hbase
[MappingToHbaseTableNamespaces]: https://docs.datafabric.hpe.com/70/UpgradeGuide/.MappingTableNamespace-HBase-DBbinary_2.html
[MapReduceEDFDataBaseBinaryTable]: https://github.com/aruruka/Example-MapReduce-With-EzmeralDataFabricMapR-DatabaseBinaryTable
[InstallingHadoopAndYarn]: https://docs.datafabric.hpe.com/70/AdvancedInstallation/InstallingHadoop.html
[InstallTheThird-partyLibrariesOn]: https://docs.datafabric.hpe.com/70/DevelopmentGuide/Manage3rdPartyLibsForMapReduce.html
