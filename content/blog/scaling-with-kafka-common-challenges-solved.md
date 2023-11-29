---
title: "Scaling with Kafka – Common Challenges Solved"
date: 2021-01-29T05:13:45.899Z
author: Will Ochandarena 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","kafka", "data-ml-engineer"]
authorimage: "/img/blogs/Avatar1.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019 may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
"authorDisplayName": "Will Ochandarena",
"publish": "2016-05-05T07:00:00.000Z",
"tags": "streaming"
```

---

I attended several Kafka Summit sessions held in San Francisco given by Kafka users and talked to many more at the booth and in the hallway. The general consensus is the Kafka model and API is well suited to building horizontally-scalable, asynchronous data pipelines for data integration and stream processing. That said, the companies that are operating these systems at scale – billions of events per day or multiple data centers – described a consistent set of challenges.

We launched MapR Event Store, a publish-subscribe event streaming system built on top of the MapR platform, exposing the Kafka API. By leveraging the strong MapR foundation that supports our distributed file and object store (MapR XD) and database (MapR Database), both of which effortlessly scale to petabytes of data and thousands of nodes across multiple data centers, MapR Event Store inherently avoids several of the challenges described by the companies operating it at scale. In this blog, I’d like to highlight a few of these challenges and how MapR Event Store overcomes them.

**Topic Balancing**

The most universal pain point I heard had to do with how Kafka balances topic partitions between cluster nodes. Because Kafka assumes all partitions are equal in terms of size and throughput, a common occurrence is for multiple “heavy” partitions to be placed on the same node, resulting in hot spotting and storage imbalances. To overcome this, these companies devote a lot of resources to monitoring and manually intervene each time an issue is found to migrate partitions between nodes.  

Rather than pin partitions to a single node, MapR Event Store splits partitions into smaller linked objects, called “partitionlets”, that are spread among the nodes in the cluster. As data is written to the cluster, the active partitionlets (those handling new data) are dynamically balanced according to load, minimizing hotspotting.

**Infinite Topic Persistence**

Another common issue that was talked about was handling long-term persistence of streaming data. As mentioned above, Kafka partitions are pinned to a single node, meaning they can’t outgrow the storage capacity of that node.  Because of this, a common design pattern is to shovel streaming data from Kafka into HDFS for long-term persistence, also known as the Lamba architecture.  This creates huge complications around reprocessing of old data (either for new use cases or fixing bugs on existing streaming apps), as it forces companies to write two versions of each app – one for processing from Kafka, the other from HDFS.  

The MapR partitionlet approach described above also eliminates this issue, as it allows all historical data to be stored in a single system – MapR Event Store. This allows streaming apps, new or existing, to simply “scrollback to 0” and reprocess months or even years of historical data.

**Global Replication**

LinkedIn gave a presentation to a packed room called “More Clusters, More Problems” on designing for multi-datacenter. They listed several design challenges, to name a few -

*   Establishing tiered cluster types (local and aggregate) to avoid forming topology loops that infinitely replicate data.
*   Ensuring topic names are globally unique due to lack of namespacing.
*   Ensuring identical partition configuration on both ends to prevent re-ordering.
*   No ability to handle failover of applications in a disaster recovery scenario, as message offsets aren’t synchronized between clusters.

By building global replication into the platform, MapR Event Store overcomes all of the challenges above and more.