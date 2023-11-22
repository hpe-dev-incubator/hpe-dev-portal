---
title: "CRUD with the New Golang Client for MapR Database"
date: 2020-09-18T20:27:10.747Z
author: Magnus Pierre 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","Golang","opensource", "data-ml-engineer"]
authorimage: "/img/blogs/Avatar4.svg"
featuredBlog: false
priority:
thumbnailimage:
---
## Original Post Information:
```
"authorDisplayName": ["Magnus Pierre"],
"publish": "2019-04-24T07:00:00.000Z",
"tags": "hpe-ezmeral-data-fabric","hpe-ezmeral"
```

---

**Editor’s Note:** MapR products referenced are now part of the [HPE Ezmeral Data Fabric](https://www.hpe.com/us/en/software/data-fabric.html).

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/image2-1600461098259.png)

## Introduction

HPE Ezmeral Data Fabric Document Database (formerly MapR Database) has come a long way since its inception. Today, the database can not only be used as a replacement of HBase, implementing the HBase API, but also as a document store, implementing an open source API called OJAI (Open JSON Application Interface).

Document stores have increased in popularity over the last few years, since they make it easy to store meaningful entities (documents) in a database and then do operations on them without having to retrieve the complete document. A typical example is to ask for a certain subtree of a document identified with a key or a set of documents that fulfill a certain condition. However, documents can also be modified in place, replaced, and deleted – basically, what is traditionally called CRUD (Create, Read, Update, Delete) in the database world. OJAI is an API to provide CRUD and flexible query capabilities to clients in a simple, consistent manner.

## New to Document Stores?

For those that have no experience with document stores, here’s a brief explanation, based on a comparison with traditional RDBMS technology.

Let’s consider a traditional Third Normal form (3NF) RDBMS database. One reason to divide data into tables/entities is to make data changes easie. Another is to simplify access. The normalization rules all database developers are educated in are there to guide the developers in how to organize/store the data, so it can be accessed and processed in a consistent manner by the consumers. Albeit a very useful and valuable evolution for data storage, the step of splitting the data into separate entities/tables aims to solve historical technical limitations that today are more easily handled. Normalizing and splitting data does make data access simple. It forces you to look at the data and make decisions on type and how it relates to other data, but it also comes with a lot of problems:

* The original format is not kept, which creates lineage issues.
* The data often needs to be transformed in order to fit into the defined entities, increasing the lineage issues as well as introducing new points where data can be wrongly represented.
* Depending on relationships (i.e. the table structure populated), it can be very complex and time-consuming to ingest new data.
* Data types (domains) need to be decided, which can be very hard for dynamic data and so on.
* And above all, it is very work-intensive and error-prone, meaning it takes a lot of time to develop a good database.

Let’s now consider another approach, where we throw all the rules out the window. Instead, we’ll create a table for customers and then store everything related to customers – orders, transactions, address information, products purchased, products offered, along with the complete history of the customer – in the same table. Please ignore the fact that it would not make sense in an RDBMS to do this. Consider it more from a conceptual perspective. Let’s also ignore types and so on. What would be the positive things this could give you?

* It would be easy to get a comprehensive overview of a single customer.
* Joins would be minimized, since most relevant data is already stored together.
* Conditions and filters could cover the whole scope of the customer engagement easily.
* Projections (what to return) would be central to extract a portion of the table to work with at a given time.
* Filtering would basically replace joins as the primary means of deciding what to retrieve.
* Locking would be simpler, since all information related to a customer would be in a single entity.
* Less initial work.

What would be the drawbacks?

* Harder to change the structure.
* Since cardinality would be different for different types of data, one would have to deal with this in a more programmatic manner.
* Duplication of data embedded in the structure.
* Hard to optimize access for a certain part of the table.
* Structure would dictate access path.
* Structure would dictate how you could process the data.

However, provided well-designed tools and APIs are available to operate on these *complex* structures, then the model of grouping all data together can make sense. This is really what a document database system such as the HPE Ezmeral Data Fabric Document Database provides – i.e., the tools necessary to process complex documents easily. There’s nothing in a document store that defines what the structure needs to look like and how each *row* can be different. So, in the example of the customer table, it could be one table with everything in it, or N documents with parts in it. The division is decided by the developers and what makes sense from the use case of the data.

## HPE Ezmeral Data Fabric Document Database

HPE Ezmeral Data Fabric Document Database supports JSON documents. A JSON document is hierarchical in nature, which I prefer to see as a small table of its own. Each document can have its unique structure in the database. The only requirement on the document, other than it has to be valid JSON, is that it needs to be identified by an ID (\_id). This ID can be used to find a unique document, or if the ID is generated using some type of logic, it can be used by filters.

In the HPE Ezmeral Data Fabric Document Database, trees in a document can be stored separately in so-called column families. Learn how to parallelize access [here](https://docs.datafabric.hpe.com/61/MapR-DB/introduction-to-column-families.html).

You can also improve scans by placing secondary indexes on attributes. Learn about that and more [here](https://docs.datafabric.hpe.com/61/MapR-DB/Indexes/Indexes.html).

None of this really matters for our Golang discussion, but you get the concept of a complete database environment supporting the document concept in full.

## Enter Language Bindings for OJAI

OJAI was originally a pure Java API, but since the API is really well designed, it fits well in other programming languages without significant changes to the conventions of the API. In order to support new languages, MapR introduced the Data Access Gateway 2.0 (DAG) in MapR Core 6.1. DAG provides the service back end for the language bindings, and in MapR Ecosystem Pack (MEP) 6.0 we shipped NodeJS and Python language bindings for HPE Ezmeral Data Fabric Document Database. Now it’s time to apply the same support for Golang (Go) and C#.

If comparing our language bindings with the original API, the API and the functions defined are basically the same in each language. If you understand OJAI in one language, you will also understand it in another language implementation. Of course, there are slight differences, and these are mostly dependent on language specifics. A dynamic language, such as JavaScript, is not the same as Golang, which is strictly typed and where it makes sense that, due to language conventions or capabilities of the language, there might be deviations. But, in general, the language implementations are very close to the original API.

Learn about supporting HPE Ezmeral Data Fabric Architecture for the Language Bindings [here](https://docs.datafabric.hpe.com/61/MapROverview/MapRDataAccessGateway.html#MapRDataAccessGateway).

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/image1-1600461364270.png)

The client library connects to the Data Access Gateway (DAG) over gRPC, and the Data Access Gateway talks directly with the HPE Ezmeral Data Fabric Document Database using MapR RPC.

Multiple Data Access Gateways can run on the same cluster, and you can integrate an external load balancer for high availability and failover of the DAG service. We have found gRPC DAG 2.0 is as fast as Java OJAI client performance. Always scale test your application and have at least two DAG services behind load balances for HA.

## The Golang Client

Golang, or “Go,” hardly needs an introduction. It is a fairly new and upcoming programming language out of Google, which is as fast as C but much easier to write. It is used in real production environments at Google. Good open source tools, such as Kubernetes and Docker, have been written in it, so it is quite battle-tested already.

## Installation of the HPE Ezmeral Data Fabric Document Database Golang Client

Installation is very simple. In the project where you are to use the client, install it using: `go get github.com/mapr/maprdb-go-client`

> Please observe that you need to have Golang installed on the system prior to running the command.

Once you have done this step, you can start using the API in the go files of your choice. A good convention, when using this API, is to provide an alias to the package in the import to get a simpler naming convention in the code itself:

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/code-1-1600461373867.png)

This will define client as the alias for the go client, meaning that everything you use from the API is referenced using client and then the function call you want to make.

## Make a Connection

Connections in the Golang client are established using a connection string. A description of the parts included in a connection string can be found [here](https://docs.datafabric.hpe.com/61/MapR-DB/JSON_DB/GettingStartedGoOJAI.html).

Some examples of connection strings:

* dag-somesystem.com:5678?auth=basic;user=mapr;password=somepasswd
* ojai:mapr:thin:v1@localhost:5768?auth=basic;user=fred;password=george;sslCA=/opt/app/conf/rootca.pem

In the example code, we use a very simple convenience function to create the connection string, based on some values that reside in a `Struct`:

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/code-2-1600461384388.png)

## Create / Get a Table

Once you have the connection string, you can connect to the HPE Ezmeral Data Fabric Document Database and connect to a database. In this example code, it will create a database if the database asked for does not exist. This is probably not what you would like to do in production, but for simple loads and test purposes, this is very convenient:

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/code-3-1600461391951.png)

## Insert Data

OJAI contains several convenience functions to, for instance, make sure you create valid documents, assign fields, and much more.

Here is a simple function that does the following:

* It receives a simple message of the type string that is used to create a Document by calling the function `CreateDocumentFromString`.
* It assigns the ID to `string(time.Now())`, using the OJAI `Document.SetIdString` function (not the best key but fits this simple example).
* It assigns a simple attribute called test the value 0 of the type Float64 in the Document, using `Document.SetFloat64`.
* It prints out the Document as a JSON, using the `Document.AsJsonString()` function to stdout.
* It adds the Document to the database, using `DocumentStore.InsertDocument()`.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/code-4-1600461399780.png)

## Query data

Querying data in OJAI can be done in a few different ways:

* `Find by ID`
* `Find by Query`
* `Find All`
* `FindQueryString`
* `FindQueryMap`

`Find by ID` searches the system for a specific ID. As you remember, the ID is the row key identifying the document, so this is blazingly fast. `Find All` is the equivalent of a scan in HBase.

## Making a Query

Queries are made using the convenience function, `MakeQuery`. `MakeQuery` receives a variant list of `QueryOptions`, which represents `SELECT`, `WHERE`, `ORDER BY`, `OFFSET`, and `LIMIT` and produces a `Query Object`. It has the same basic structure as Mutations and Conditions, and you work with them in a similar fashion. You also have the option to define an OJAI query directly in a JSON string and use it directly.

A simple query looks like the following:

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/code-5-1600461407820.png)

## How to Change/Update Data

Data is changed through the concept of mutations. Mutations are executed on the server and are applied using a `DocumentMutation` struct. You create a `DocumentMutation` struct and provide the wanted `MutationOperations` to the function `MakeDocumentMutation`.

The following mutations exist in OJAI and the respective convenience functions in the Go-client:

* Append
   * Read-modify-write operation. Use it to append specified values to existing binary, string, or array type fields.
   * Go convenience functions:
       * `AppendSlice`
       * `AppendString`
* Decrement
   * Decrements the value in the `fieldpath`. To decrement multiple field paths, use an array notation to list the field paths.
   * Go convenience functions:
       * `DecrementFloat64`
       * `DecrementFloat64ByOne`
       * `DecrementInt`
       * `DecrementIntByOne`
* Delete
   * Removes either a single field or a list of fields from a document. If the field does not exist, the delete ignores that field.
   * Go convenience functions:
       * `Delete`
* Increment
   * Increments the value in the `fieldpath`. To increment multiple field paths, use an array notation to list the field paths.
   * Go convenience functions:
       * `IncrementFloat64`
       * `IncrementFloat64ByOne`
       * `IncrementInt`
       * `IncrementIntByOne`
* Merge
   * Combines a nested document with an existing document at a specified fieldpath
   * Go convenience functions:
       * `MergeDocument`
       * `MergeMap`
* Put
   * Replace operation
   * Go convenience functions:
       * `SetOrReplace`
* Set
   * Updates one or more fields in a document.
   * Go convenience functions:
       * `Set`
       * `Set<Go Type> example SetInt`

It is also possible to provide the mutation as a map of the form:
`map[string] interface{}`, where each entry is of the same form – i.e., `map[string] interface{}`.

It is quite easy to create a static map, but if you need to generate maps and add them dynamically, a convenience function is probably needed that merges maps into a map and returns that map. I have an example in the GitHub repository of such a convenience function, if of interest, called `[MergeMaps](https://github.com/mapr/maprdb-go-client/search?q=MergeMaps&type=code)`.

Since the two different forms of creating mutations exists, a set of functions exists to convert the mutation type to a form that can be sent to the database:

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/code-6-1600461418004.png)

These functions are:

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/code-7-1600461425614.png)

Now we can send the `MapOrStructMutation` to the database using:

* `Update`, `CheckAndUpdate`

`CheckAndUpdate` is interesting, since it allows you to only do the update if a certain condition is validated to be true. This is where the OJAI API shows its true powers. By doing proper checking this way, you can avoid having to return the data to the client, do the manipulation, and then write it back to the database. All steps can happen in the database, where they belong, local to the data. This is a fundamental feature, important for everyone that deals with mutable structures with big data sizes.

## Conditions

Conditions share the same structure with mutations, i.e., the same underlying type structure, so you work with it in a similar fashion. A good way of understanding conditions comes from the HPE Ezmeral Data Fabric Document Database official documentation about writing conditions directly in JSON. With the Go client, it is not strictly necessary to write the conditions this way, however, since there’s convenience functions for each defined. Examples of conditions exist in the [referenced GitHub](https://github.com/mapr/maprdb-go-client) for more information.

## How to Delete Documents

Delete is very straight-forward and easily conducted, using the convenience functions: [`DeleteByIdBinary`](https://github.com/mapr/maprdb-go-client/search?q=DeleteByIdBinary), [`DeleteByIdString`](https://github.com/mapr/maprdb-go-client/search?q=DeleteByIdString), and [`DeleteDoc`](https://github.com/mapr/maprdb-go-client/search?q=DeleteDoc).

`DeleteByIdBinary` and `DeleteByIdString` deletes a document based on identity \_id, whilst `DeleteDoc` bases the delete on a Document on the client. Whether the `DeleteDoc` matches the complete document before deleting or if it just matches the identity of the document and then deletes is unknown by me. My guess is that it matches ID, but I will validate this.

## Behind the Scenes of OJAI

OJAI clients use the Data Access Gateway 2.0 introduced in MapR 6. However, in order to support good things, such as secondary indexes and queries on massive volumes of data, OJAI uses an internal service called OJAI Distributed QueryService. This QueryService is based on Apache Drill and utilizes the good capabilities of Drill to query massive volumes of data in an efficient manner. Drill is a distributed query engine that can query almost anything, but in this case, it is geared towards only asking questions against the HPE Ezmeral Data Fabric Document Database. By utilizing Drill, OJAI gets access to advanced SQL behind the scenes, a good cost-based query planner, and, of course, the parallel execution engine for processing the intermediary steps that may be the result of a complex query.

HPE Ezmeral Data Fabric has the ability to run multiple Drill clusters on one of the same clusters. In production, it may be important to isolate the load from OJAI clients using the Drill QueryService from regular use of Apache Drill, and this is easily doable by assigning multiple Drill clusters.  Please see the official documentation regarding this [here](https://docs.datafabric.hpe.com/61/Drill/config-multiple-drill-clusters.html).

## Summary

This blog post has focused on describing how to do CRUD using the Golang client for the HPE Ezmeral Data Fabric Document Database. The client provides all the tools necessary to do real applications with great database support on massive amounts of data. Mutations with conditions are key to being able to mutate data in a big data setting, since:

1. You cannot return the data to the client due to volume.
2. Even if you could, the round trip to fetch the data to the client, do the change, and then back again would be very costly.
3. The database architecture also makes it possible to do proper applications in, for instance, simple languages such as JavaScript that you would normally not use when processing millions upon millions of rows of data.

The Go client for the HPE Ezmeral Data Fabric Document Database supports really complex OJAI statements and is backed up with an architecture that is scalable and reliable.

First, we have the gateway service, which can be individually scaled across the cluster and load balanced to support massive amounts of clients. Then, we have the database with its always-on and distributed architecture, where a document can be distributed across column families for parallelization with support for in-database operations, such as mutations and support for secondary indexes. Finally, we have the query service for complex queries built on Apache Drill with its scalable architecture, leading to basically an infinitely scalable solution, where each component is individually scalable based on need.

Make sure to take a deep look at the client that fits your needs best – Node.js, Python, Golang, C#, and of course Java. You will see that they share the same wonderful architecture, the same ease of use, and the same wonderful API, making it a very good base for future applications.

**Editor’s Note:** MapR products referenced are now part of the [HPE Ezmeral Data Fabric](https://www.hpe.com/us/en/software/data-fabric.html).

To view more articles on this topic, be sure to check back regularly on the [HPE DEV blog site](/blog).