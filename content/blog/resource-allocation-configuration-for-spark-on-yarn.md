---
title: "Resource Allocation Configuration for Spark on YARN"
date: 2020-08-19T06:14:55.424Z
author: Nathan Burch 
tags: ["Spark","Yarn","opensource"]
path: resource-allocation-configuration-for-spark-on-yarn
---
## Original Post Information:
```
"authorDisplayName": "Hao Zhu",
"publish": "2015-09-11T07:00:00.000Z",
"tags": "spark"
```
---

In this blog post, I will explain the resource allocation configurations for Spark on YARN, describe the yarn-client and yarn-cluster modes, and include examples.

Spark can request two resources in YARN; CPU and memory. Note that Spark configurations for resource allocation are set in spark-defaults.conf, with a name like spark.xx.xx. Some of them have a corresponding flag for client tools such as spark-submit/spark-shell/pyspark, with a name like --xx-xx. If the configuration has a corresponding flag for client tools, you need to put the flag after the configurations in parenthesis"()". For example:

```
spark.driver.cores 
(--driver-cores)
```

## 1\. yarn-client vs. yarn-cluster mode

There are two deploy modes that can be used to launch Spark applications on YARN per <a target='\_blank'  href='https://spark.apache.org/docs/latest/running-on-yarn.html'>Spark documentation</a>:

*   In **yarn-client** mode, the driver runs in the client process and the application master is only used for requesting resources from YARN.
*   In **yarn-cluster** mode, the Spark driver runs inside an application master process that is managed by YARN on the cluster, and the client can go away after initiating the application.

## 2\. Application Master (AM)

**a. yarn-client**

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/reallocation-blog-img1-1597817848006.png)

Let’s look at the settings below as an example:

```
[root@h1 conf]# cat spark-defaults.conf |grep am
**spark.yarn.am.cores     4
spark.yarn.am.memory 777m**
```

By default, `spark.yarn.am.memoryOverhead` is AM memory \* 0.07, with a minimum of 384\. This means that if we set spark.yarn.am.memory to 777M, the actual AM container size would be 2G. This is because 777+Max(384, 777 \* 0.07) = 777+384 = 1161, and the default yarn.scheduler.minimum-allocation-mb=1024, so 2GB container will be allocated to AM. As a result, a (2G, 4 Cores) AM container with Java heap size -Xmx777M is allocated:

Assigned container container_1432752481069_0129_01_000001 of capacity

```
<memory:2048, vCores:4, disks:0.0>

```

**b. yarn-cluster**

In yarn-cluster mode, the Spark driver is inside the YARN AM. The driver-related configurations listed below also control the resource allocation for AM.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/reallocation-blog-img2-1597817860836.png)

Take a look at the settings below as an example:

```
MASTER=yarn-cluster /opt/mapr/spark/spark-1.3.1/bin/spark-submit --class org.apache.spark.examples.SparkPi  \
--driver-memory 1665m \
--driver-cores 2 \
/opt/mapr/spark/spark-1.3.1/lib/spark-examples*.jar 1000

```

Since 1665+Max(384,1665*0.07)=1665+384=2049 > 2048(2G), a 3G container will be allocated to AM. As a result, a (3G, 2 Cores) AM container with Java heap size -Xmx1665M is allocated:  
Assigned container container_1432752481069_0135_02_000001 of capacity

```
<**memory:3072, vCores:2**, disks:0.0>

```

## 3\. Containers for Spark executors

For Spark executor resources, yarn-client and yarn-cluster modes use the same configurations:

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/reallocation-blog-img3-1597817872761.png)

In `spark-defaults.conf`, `spark.executor.memory` is set to 2g.

Spark will start 2 (3G, 1 core) executor containers with Java heap size -Xmx2048M: Assigned container container_1432752481069_0140_01_000002 of capacity

```
<**memory:3072, vCores:1**, disks:0.0>
```
Assigned container container_1432752481069_0140_01_000003 of capacity
```
<**memory:3072, vCores:1**, disks:0.0>
```

However, one core per executor means only one task can be running at any time for one executor. In the case of a broadcast join, the memory can be shared by multiple running tasks in the same executor if we increase the number of cores per executor.

Note that if <a target='\_blank'  href='https://spark.apache.org/docs/latest/job-scheduling.html#dynamic-resource-allocation'>dynamic resource allocation</a> is enabled by setting `spark.dynamicAllocation.enabled` to true, Spark can scale the number of executors registered with this application up and down based on the workload. In this case, you do not need to specify `spark.executor.instances` manually.

## Key takeaways:

*   Spark driver resource related configurations also control the YARN application master resource in yarn-cluster mode.
*   Be aware of the max (7%, 384m) overhead off-heap memory when calculating the memory for executors.
*   The number of CPU cores per executor controls the number of concurrent tasks per executor.

In this blog post, you’ve learned about resource allocation configurations for Spark on YARN. If you have any further questions, please [reach out to us via Slack](https://slack.hpedev.io/).

Make sure you check the [HPE DEV blog](https://developer.hpe.com/blog) regularly to view more articles on this subject.