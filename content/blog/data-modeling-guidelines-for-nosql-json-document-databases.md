---
title: Data Modeling Guidelines for NoSQL JSON Document Databases
date: 2020-07-08T05:22:33.670Z
featuredBlog: false
priority: null
author: Carol McDonald
authorimage: /img/blogs/Avatar5.svg
thumbnailimage: null
tags:
  - hpe-ezmeral-data-fabric
  - MapR
  - opensource
  - data-ml-engineer
---
## Original Post Information:
```
"authorDisplayName": "Carol McDonald",
"publish": "2017-10-26T12:00:00.000",
"tags": "data modeling"
```

---

In this blog post, I’ll discuss how NoSQL data modeling is different from traditional relational schema data modeling, and I’ll also provide you with some guidelines for document database data modeling.  
Document databases, such as MapR Database (now part of [HPE Ezmeral Data Fabric](https://www.hpe.com/us/en/software/data-fabric.html)), are sometimes called "schema-less", but this is a misnomer. Document databases don't require the same predefined structure as a relational database, but you do have to define the facets of how you plan to organize your data.  Typically with a NoSQL data store you want to aggregate your data so that the data can quickly be read together, instead of using joins. A properly designed data model can make all the difference in how your application performs. One of our solution architects worked with a customer, and in a one-hour conversation about schema design, was able to improve access performance by a factor of 1,000x. These concepts matter.

## **Why NoSQL?**

Simply put the motivation behind NoSQL is data volume, velocity, and/or variety. MapR Database (now part of HPE Ezmeral Data Fabric) provides for data variety with two different data models:   

* HPE Ezmeral Data Fabric as a Wide column database with an Apache HBase API   

* HPE Ezmeral Data Fabric as a Document database with an Open JSON API   

<img src="/uploads/media/2020/6/mapr-db-json-1594186549663.png" alt="HPE Ezmeral Data Fabric" width="900">

HPE Ezmeral Data Fabric JSON is different than other Document data stores in that the row key design is the same for both models, and both can store data (columns or documents) with different access patterns in a different column family with the same row key.

## **Relational vs. NoSQL Data Modeling**

In relational design, the focus and effort is around describing the entity and its relation with other entities; the queries and indexes are designed later.  With a relational database you normalize your schema, which eliminates redundant data and makes storage efficient. Then queries with joins bring the data back together again. However joins cause bottlenecks on read, with data distributed across a cluster, this model does not scale horizontally. With HPE Ezmeral Data Fabric, a table is automatically partitioned across a cluster by key range, and each server is the source for a subset of a table (called a tablet). HPE Ezmeral Data Fabric has a “query-first” schema design, queries should be identified first, then the row key should be designed to distribute the data evenly and also to give a meaningful primary index to query by. The row document (JSON) or columns (HBase) should be designed to group data together that will be read together. With HPE Ezmeral Data Fabric you de-normalize your schema to store in one row or document what would be multiple tables with indexes in a relational world. Grouping the data by key range provides for fast reads and writes by row key.

<img src="/uploads/media/2020/6/mapr-db-read-writes-1594186238593.png" alt="HPE Ezmeral Data Fabric faster read and writes" width="900">

## **NoSQL Data Modeling Process**

It is useful to start off with [Entity Relationship](https://en.wikipedia.org/wiki/Entity%E2%80%93relationship_model) modeling in order to define the entities, relationships, and attributes in your application:   

* Entities: Main objects in your application   

* Attributes: properties of the objects in your application   

* Relationships: connections between entities - 1-1, 1-many, many-many   


![Artist - Performs - Song](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/artist-performs-song-1594186280849.png)

The E-R model can be used with your query and data access patterns to define the physical model so that the data that is read together is stored together.
As a modeling example we will use a social application similar to reddit (Note: I do not know how reddit is really implemented). Here are the use cases:   

 * Users can post URLs to articles by category (like news, sports…).

   ![Reddit use case](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/reddit-use-case-1-1594186305947.png)


 * Users can then make comments on posts   

   ![Reddit use case](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/reddit-use-case-2-1594186327388.png)

Some of the query requirements are:   

* Display the posts by category and date (most recent first)   

* Display the comments by post   

* Display the posts by userid   


## **Logical Model Example**

This is an E-R Diagram for our example social application:
![E-R Diagram](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/e-r-diagram-1594186359002.png)   

The Entities are:   

* User, Post, Comment, Category

The relations are:   

* A User makes a post   

* A Post has comments   

* A Post belongs to a category   


## **Relational Model Example**

This is the relational model for the example social application:
![Relation Model for Social Application](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/relation-model-social-app-1594186378259.png)   

* Users are stored in the user table   

* The posted URL is  stored in the Post table with a foreign key to the user that posted it, and a foreign key to the category for the post.   

* Comments about a post are stored in the comments table with a foreign key to the post and a foreign key to the user that commented.   

 ﻿
## **Normalization**

In a relational database, you normalize the schema to eliminate redundancy by putting repeating information into a table of its own. In this example below, we have an order table, which has a one-to-many relationship with an order items table. The order items table has a foreign key with the id of the corresponding order.

<img src="/uploads/media/2020/6/order-items-table-1594186396974.png" alt="Order Items Table" width="900">

## **Denormalization**

In a denormalized datastore, you store in one table what would be multiple indexes in a relational world. [Denormalization](https://en.wikipedia.org/wiki/Denormalization) can be thought of as a replacement for joins. Often with NoSQL, you de-normalize or duplicate data so that data is accessed and stored together.

## **Parent-Child Relationship–Embedded Entity**

Here is an example of denormalization of the SALES_ITEM schema in a Document database:

```json
{
   "_id": "123",
   "date": "10/10/2017",
   “ship_status”:”backordered”
   "orderitems": [
       {
           "itemid": "4348",
           "price": 10.00
       },
       {
           "itemid": "5648",
           "price": 15.00
       }]
}
```

If your tables exist in a one-to-many relationship, it’s possible to model it  as a single document. In this example, the order and related line items are stored together and can be read together with a find on the row key (\_id). This makes the reads a lot faster than joining tables together.
Note: that the maximum default row size is 32MB, and optimal size is between 50-100KB. If the embedded entities are really long then they could be bucketed by row key, or you could just store the id to the embedded entity table (which would require your application to query that table also).

## **Document Model Example**

This is the document model for the example social application:

<img src="/uploads/media/2020/6/document-model-social-app-1594186415200.png" alt="Document Model for Social Application" width="900">

There are 2 tables in the document model compared to 4 in the relational:

* User details are stored in the user table   

* Posted URLs are stored in the Post table   
 * The row key is composed of the category and a reverse timestamp so that posts will be grouped by category with the most recent first.   
 * There is a secondary index on the posted by attribute, to query by who submitted the URL.   
 * Comments are embedded in the post table   


## **Composite Row Key Design**

Row keys are the primary index for MapR Database (now part of HPE Ezmeral Data Fabric)  (HPE Ezmeral Data Fabric JSON 6.0 also has secondary indexes).  Data is automatically distributed as it is written by sorted row key range. You can include multiple data elements in a “composite” row key, which can be useful for grouping rows together for finding by key range. For example if you wanted to group posts by category and date, you could use a row key like `“SPORTS_20131012”` (if you want the most recent first use a reverse timestamp). If you wanted to group restaurants by location you could use a row key like `“TN_NASHVL_PANCAKEPANTRY”`.   

![Prefix](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/prefix-1594186429138.png)   

Another option is to add a hash prefix to the row key in order to get good distribution, and still have a secondary grouping.   

![Prefix the row key](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/prefix-row-key-1594186446213.png)   


## **Generic Data, Event Data, and Entity-Attribute-Value**

Generic data is often expressed as name value or entity attribute value. In a relational database, this is complicated to represent because every row represents an instance of a **similar object**. JSON allows easy variation across records.  Here is an example of clinical patient event data:

```json
patientid-timestamp, Temperature , "102"
patientid-timestamp, Coughing, "True"
patientid-timestamp, Heart Rate, "98"
```

This is the document model for the clinical patient event data:

<img src="/uploads/media/2020/6/document-model-event-data-1594186470650.png" alt="Document Model Event Data" width="900">

The Row Key is the patient ID plus a time stamp. The variable event type and measurement is put in name value pairs.

## **Tree, Adjacency List, Graph Data**

Here is an example of a tree, or [adjacency list](https://en.wikipedia.org/wiki/Adjacency_list)   

![Document Model Tree](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/document-model-tree-1594186489204.png)   

Here is a document model for the tree shown above (there are multiple ways to represent trees):

```json
{
   "_id": "USA",
   “type”:”state”,
   "children": ["TN",”FL]
   "parent": null
}
{
   "_id": "TN",
   “type”:”state”,
   "children": ["Nashville”,”Memphis”]
   "parent": "USA”
}
{
   "_id": "FL",
   “type”:”state”,
   "children": ["Miami”,”Jacksonville”]
   "parent": "USA”
}
{
   "_id": "Nashville",
   “type”:”city”,
   "children": []
   "parent": "TN”
}
```

Each document is a tree node, with the row key equal to the node id. The parent field stores the parent node id. The children field stores an array of children node ids. A secondary index on the parent and children fields allows to quickly find the parent or children nodes.

## **Inheritance Mapping**

In modern object-oriented programming models,  different object types can be related, for instance, by extending the same base type. In object-oriented design, these objects are considered instances of the same base type, as well as instances of their respective subtypes. It is useful to store objects in a single database table to simplify comparisons and calculations over multiple objects. But we also need to allow objects of each subtype to store their respective attributes, which may not apply to the base type or to other subtypes. This does not match a relational model  but is very easy to do with a document model.  Here is an example of object inheritance for store products,  bike, pedal, and jersey are all types of store products:
![Inheritance Mapping Online Store Example](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/inheritance-mapping-1594186510565.png)

In this online store example, the type of product is a prefix in the row key. Some of the name value pairs are different, and may be missing depending on the type of product. This allows to model different product types in the same table and to find a group of products easily by product type.

<img src="/uploads/media/2020/6/product-type-1594186531426.png" alt="Product Types" width="900">

In this blog post, you learned how document database data modeling is different from traditional relational schema modeling, and you also got some guidelines for document database data modeling.

## **For More Information:**

* [Open JSON Application Interface](https://github.com/ojai/ojai)   

* [Open JSON Application Interface wiki](https://github.com/ojai/ojai/wiki)   

* [Unified Data Modeling for Relational and NoSQL Databases](https://www.infoq.com/articles/unified-data-modeling-for-relational-and-nosql-databases)   

* [NOSQL DATA MODELING TECHNIQUES](https://highlyscalable.wordpress.com/2012/03/01/nosql-data-modeling-techniques/)   

