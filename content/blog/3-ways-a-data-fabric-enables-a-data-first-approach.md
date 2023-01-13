---
title: 3 ways a data fabric enables a data-first approach
date: 2022-03-15T10:07:10.175Z
author: Ted Dunning & Ellen Friedman
authorimage: /img/Avatar1.svg
disable: false
tags:
  - hpe-ezmeral-data-fabric
---
**Editor’s note: This article was originally posted on HPE Enterprise.nxt on March 15, 2022**

- - -

A well-engineered modern data fabric allows DevOps and other teams to access data in the way they prefer.

A data-first enterprise is a big advantage, but this strategy also puts a lot of demands on your data technology. That's all right unless your data technology puts a lot of demands on you.

Take modern cars. Vehicles can now easily contain over 100 computers to manage functions like adaptive cruise control, stability control, and anti-lock braking. These systems make cars much more complicated internally than decades ago, but they are much easier and safer to drive because of them.

Similarly, modern data technology needs to make it easier for users and system administrators of large-scale systems to work with data in more sophisticated and varied ways and at more locations, as is the case in a data-first enterprise. What does your data infrastructure need to do to help rather than be a hindrance?

### How does data fabric meet the demands of a data-first approach?

A data fabric is a highly scalable data infrastructure designed to store, manage, and move data as a unifying layer across an enterprise from edge to data center, on-premises or in the cloud.

In a data-first environment, data is treated as a foundational resource, one that is not used up when it is accessed. The capabilities of your data infrastructure should support the reuse of data and use by multiple applications. For example, the HPE Ezmeral Data Fabric File and Object Store software supports data reuse and data sharing by not requiring specialized data access methods. Off-the-shelf and custom applications can directly access data stored in the data fabric.

Here's a sample of some of the many ways a modern data fabric has a positive impact in a data-first approach.

### To move or not to move: Data where it needs to be

Data motion is a key issue in large-scale data systems. Data motion can include motion within a cluster and between clusters. Making wrong assumptions about data motion is one of the most common ways businesses inadvertently give up their ability to extract value from data.

At one extreme, people may have an ingrained assumption that data motion is not a viable option, based on legacy systems that lack any provision for moving data. Without motion, data that could have value if put into a more global context may be discarded instead.

>> <span style="font-family:Arial; font-size:1.2em;">The key to success is choice: You should be able to efficiently move data as needed or store and analyze it in place, all within the same system.</span>

At other companies, the pendulum has swung radically to the opposite extreme, with a policy that all data to be analyzed must be moved to a central data center, either on premises or in the cloud. Unfortunately, the costs of data motion mount up, and where large amounts of data are at issue, only a tiny fraction of all possible data will be moved. Once again, data you could analyze is simply discarded.

Fortunately, a new middle ground is emerging. In telecommunications, finance, media, manufacturing, and other business sectors, far more data is collected than could possibly be moved back to headquarters. Data is partially processed in situ before extracts and summaries are moved to a central location or a regional sub-center for further analysis on aggregates from many edge sources. This edge processing strategy commonly uses pattern recognition to pull out the interesting bits or anomalies for transfer.

There are many reasons to move data, including communication between data centers or to a secondary cluster as part of a disaster recovery plan. The key to success is choice: You should be able to efficiently move data as needed or store and analyze it in place, all within the same system. Data motion should not have to be coded into each application.

Taking the example of HPE Ezmeral Data Fabric, selective data motion can be configured rather than coded, and data fabric moves the data invisibly. The data fabric even builds in remote access via a global namespace in case you need it.

### Decouple the query engine from data storage

The term database conjures up images of big iron running a system like Postgres or Oracle or a data warehouse like Teradata. All of the classical databases had this in common: The software that handles the storage of data is tightly integrated with the software that optimizes and executes queries.

Another common element of such database systems is that when it comes to processing the data in the database, it is their way or the highway. You could submit queries from practically any computer language around, but you can't do what SQL won't do. For applications such as machine learning, a SQL database just isn't a good fit except for data extraction. Even then, severe scale limitations are common with high-end databases.

The situation is changing. The trend now is to separate the query and storage engines into independent parts. The functional independence of query and storage isn't entirely new, but the idea that a SQL query engine should mostly query data stored in ordinary files is a big change.

The practical impact of this separation is that you can reuse data for a completely different purpose than originally intended. If your original purpose was to clear payments and produce statements and bills for tens of millions of credit card accounts, then a SQL query engine like Presto might be just the ticket.

However, in a data-driven enterprise, the real value from data doesn't usually come from collecting entirely new data. Instead, it comes from reusing or combining existing data in new ways, often with new tools. Mixing and matching query engines on the same data strikes gold. Locking data up in a monolithic database is just the opposite.

For example, while recently working on an open source project, one of the authors (Dunning) built some geospatial processing that quickly outgrew the relational database in use. Python and Parquet files worked great for initial extraction and cleaning, but indexing and sorting the historical data involved billions of geohash (a public domain geocode system) operations.

Storing that data in a data fabric allowed a seamless transition to distributed processing steps in [the Julia programming language](https://julialang.org/) that ran 100 times faster and could scale more easily. Keeping simple tasks simple is a big win for data fabric in these kinds of systems.

### Object storage vs. files

One change that characterizes a data-first enterprise is that architectural control moves much closer to the developer and data scientists in the line of business. Previously, much of that control was in the technology group in IT. This change is, in fact, the core driving force behind the DevOps movement. A major consequence of this shift has been the commoditization of IT services, an approach taken to extremes by the public cloud vendors.

An unforeseen (but obvious in hindsight) side effect of this shift is a divergence between how DevOps teams view data infrastructure and how IT teams view it. The DevOps point of view is all about simplicity and flexibility, while the IT view has always been about optimization of provisioning combined with centralized control.

Pushing for simplicity and flexibility drives a preference for data access with as little participation by the operating system as possible and certainly no special OS privileges. These constraints may put something as simple as mounting a file system out of bounds. These limits make object storage systems very attractive, since objects are accessed directly using simple protocols like HTTP instead of asking the OS to get file data from some file store. All you need is network access. On the other hand, performance isn't usually very high, and objects don't work like files, so compatibility suffers.

Prioritizing optimization, in contrast, leads to highly manageable systems like storage appliances to provide block storage to blade servers. In this model, just enough storage is allocated to applications that primarily use non-distributed file systems for data. The operating system kernel mounts these file systems and controls all access. That's fine for some things, but it hurts scalability and makes DevOps harder.

The fact is, recent technology makes both goals achievable. If a modern data fabric is engineered to allow access to data as either files or as objects, this flexibility frees DevOps teams to access data in the way they prefer. In addition, a data fabric can have built-in capabilities for data management and data motion. These capabilities make it much easier for IT teams to manage the overall system at scale.

### Data fabric for data-first

Having the right data infrastructure lets you focus on the decisions that will make your organization a data-first enterprise. Whether it is choosing the right level of data motion, using multiple tools to analyze the same data, or storing data as objects or files, your data infrastructure needs to provide a host of advanced capabilities but still be easy enough to drive. A modern data fabric does just that.

### LESSONS FOR LEADERS

* A data fabric is a highly scalable data infrastructure designed to store, manage, and move data as a unifying layer across an enterprise from edge to data center, on premises or in the cloud.  
  
* A well-engineered modern data fabric allows DevOps and other teams to access data in the way they prefer.   
 
* Making wrong assumptions about data motion is one of the most common ways businesses inadvertently give up their ability to extract value from data.    
   

<br />

>> <span style="color:grey; font-family:Arial; font-size:1em"> This article/content was written by the individual writer identified and does not necessarily reflect the view of Hewlett Packard Enterprise Company.</span>

<br />

<u>**About the authors:**</u>

Ted Dunning is chief technologist for data fabric at HPE. He has a PhD in computer science and authored more than 10 books focused on data sciences. He has more than 25 patents in advanced computing and plays the mandolin and guitar, both poorly.

Ellen Friedman is a principal technologist at Hewlett Packard Enterprise focused on large-scale data analytics and machine learning. Ellen worked at MapR Technologies prior to her current role at HPE. She was a committer for the Apache Drill and Apache Mahout open source projects and is a co-author of multiple books published by O’Reilly Media, including AI & Analytics in Production, Machine Learning Logistics, and the Practical Machine Learning series.