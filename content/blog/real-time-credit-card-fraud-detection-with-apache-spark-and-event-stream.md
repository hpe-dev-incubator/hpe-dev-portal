---
title: "Real Time Credit Card Fraud Detection with Apache Spark and Event Streaming"
date: 2020-11-18T23:37:40.398Z
author: Carol McDonald 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","apache-spark","opensource"]
authorimage: "/img/blogs/Avatar4.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019, may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
"authorDisplayName": "Carol McDonald",
"publish": "2016-05-03T07:00:00.000Z",
"tags": "apache-spark, "
```

---

In this post we are going to discuss building a real time solution for credit card fraud detection.

There are 2 phases to Real Time Fraud detection:

*   The first phase involves analysis and forensics on historical data to build the machine learning model.  
*   The second phase uses the model in production to make predictions  on live events. 

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/spark-fraud-1-1605742738606.jpg)

## Building the Model

**Classification**

Classification is a family of supervised machine learning algorithms that identify which category an item belongs to (for example whether a transaction is fraud  or not fraud), based on labeled examples of known items (for example transactions known to be fraud or not). Classification takes a set of data with known labels and pre-determined features and learns how to label new records based on that information.  Features are the “if questions” that you ask. The label is the answer to those questions. In the example below, if it walks, swims, and quacks like a duck, then the label is "duck".

![recommendation engine with ducks](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/spark-fraud-2-1605742750342.jpg)

Let’s go through an example of car insurance fraud:

*   What are we trying to predict?   
    *   This is the Label: The Amount of Fraud
*   What are the  “if questions” or properties that you can use to predict ?
    *   These are the Features, to build a classifier model, you extract the features of interest that most contribute to the classification.
    *   In this simple example we will use the the claimed amount.

![fraud detection with spark](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/spark-fraud-3-1605742767766.jpg)

Linear regression models the relationship between the Y “Label” and the X “Feature”,  in this case the relationship between the amount of fraud and the claimed amount.  The coefficient measures the impact of the feature, the claimed amount, on the label, the fraud amount.  

Multiple linear regression models the relationship between two or more “Features” and a response “Label”.  For example  if we wanted to model the relationship between the amount of fraud and the the age of the claimant, the claimed amount, and the severity of the accident, the multiple linear regression function would look like this:

![fraud detection algorithm ](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/spark-fraud-4-1605742785380.jpg)

**AmntFraud = intercept+ coeff1 * age + coeff2 * claimedAmnt + coeff3 * severity + error.**   

The coefficients measure the impact on the fraud amount  of each of the features.

Let’s take credit card fraud as another example:

*   Example Features: transaction amount, type of merchant, distance from and time since last transaction .
*   Example Label:  Probability of Fraud

![fraud detection with spark](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/spark-fraud-5-1605742798937.jpg)

Logistic regression measures the relationship between the Y “Label”  and the X “Features” by estimating probabilities using a <a target='\_blank'  href='https://en.wikipedia.org/wiki/Logistic_function'>logistic function</a>. The model  predicts a probability  which is used to predict the label class.

*   Classification: identifies which category (eg fraud or not fraud)
*   Linear Regression: predicts a value (eg amount of fraud)
*   Logistic Regression: predicts a probability (eg probability of fraud)

Linear and Logistic Regression are just a couple of algorithms used in machine learning, there are many more as shown <a target='\_blank'  href='http://scikit-learn.org/stable/tutorial/machine_learning_map/'>in this cheat sheet</a>.

![fraud detection with spark](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/spark-fraud-6-1605742814936.png)

## Feature Engineering

Feature engineering is the process of transforming raw data into inputs for a machine learning algorithm. Feature engineering is extremely dependent on the type of use case and potential data sources.  

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/spark-fraud-7-1605742828673.jpg)

(reference <a target='\_blank'  href='http://shop.oreilly.com/product/0636920028512.do'>Learning Spark</a>)

Looking more in depth at the credit card fraud example for feature engineering,  our goal is to distinguish normal card usage from fraudulent card usage.

*   Goal: we are looking for someone using the card other than the cardholder
*   Strategy: we want to design features to measure the differences between recent and historical activities.

For a credit card transaction we have features associated with the transaction, features associated with the card holder, and features derived from transaction history. Some examples of each are shown below:

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/spark-fraud-8-1605742836968.png)

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/spark-fraud-9-1605742844958.png)

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/spark-fraud-9a-1605742851836.png)

## Model Building Workflow

A typical supervised machine learning workflow has the following steps:

*   Feature engineering to transform historical data into feature and label inputs for a machine learning algorithm.
*   Split the data into two parts, one for building the model and one for testing the model.
*   Build the model with the training features and labels
*   Test the model with the test features to get predictions. Compare the test predictions to the test labels.
*   Loop until satisfied with the model accuracy:
    *   Adjust the model fitting parameters, and repeat tests.
    *   Adjust the features and/or machine learning algorithm and repeat tests.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/spark-fraud-9b-1605742860922.jpg)

## Read Time Fraud Detection Solution in Production

The figure below shows the high level architecture of a real time fraud detection solution, which is capable of high performance at scale.  Credit card transaction events are delivered through the MapR Event Store messaging system, which supports the Kafka .09 API. The events are processed and checked for Fraud by Spark Streaming using Spark Machine Learning with the deployed model.  MapR XD, which supports the posix NFS API  and  HDFS API, is used for storing event data. MapR Database a NoSql database which supports the HBase API, is used for storing and providing fast access to credit card holder profile data.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/spark-fraud-9c-1605742870860.jpg)

## Streaming Data Ingestion

MapR Event Store is a new distributed messaging system which enables producers and consumers to exchange events in real time via the Apache Kafka 0.9 API. MapR Event Store topics are logical collections of messages which organize events into categories. In this solution there are 3 categories:

*   Raw Trans: raw credit card transaction events.
*   Enriched: credit card transaction events enriched with card holder features,  which were predicted to be not fraud.
*   Fraud Alert: credit card transaction events enriched with card holder features which were predicted to be fraud.

Topics are partitioned, spreading the load for parallel messaging across multiple servers,  which provides for faster throughput and scalability.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/spark-fraud-9d-1605742879420.jpg)

## Real-time Fraud Prediction Using Spark Streaming

Spark Streaming lets you use the same Spark APIs for streaming and batch processing, meaning that well modularized Spark functions written for the offline machine learning can be re-used for the real time machine learning.

The data flow for the real time fraud detection using Spark Streaming is as follows:

1) Raw events come into Spark Streaming as DStreams,  which internally is a sequence of RDDs.  RDDs are like a Java Collection, except that the data elements contained in RDDs are partitioned across a cluster. RDD operations are performed in parallel on the data cached in memory, making the iterative algorithms often used in machine learning much faster for processing lots of data.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/spark-fraud-9e-wide-1605857312275.png)

2) The credit card transaction data is parsed to get the features associated with the transaction.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/spark-fraud-9f-1605742904521.jpg)

3) Card holder features and profile history are read from MapR Database using the account number as the row key.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/spark-fraud-9g-1605742912597.png)

4) Some derived features are re-calculated with the latest transaction data.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/spark-fraud-9h-1605742920965.png)

5) Features are run with the model algorithm to produce fraud prediction scores.

6) Non fraud events enriched with derived features are published to the enriched topic. Fraud events with derived features are published to the fraud topic.

## Storage of Credit Card Events

Messages are not deleted from Topics when read, and topics can have multiple different consumers, this allows processing of the same messages by different consumers for different purposes.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/spark-fraud-9i-1605742927931.png)

In this solution, MapR Event Store consumers read and store all raw events, enriched events, and alarms to MapR XD for future analysis, model training and updating. MapR Event Store consumers read enriched events and Alerts to update the Card holder features in MapR Database. Alerts events are also used to update Dashboards in real time.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/spark-fraud-9j-1605742935016.jpg)

## Rapid Reads and Writes with MapR Database

With MapR Database (HBase API), a table is automatically partitioned across a cluster by key range, and each server is the source for a subset of a table. Grouping the data by key range provides for really fast read and writes by row key.

Also with MapR Database each partitioned subset or region of a table has a write and read cache. Recently read or written data and cached column families are available in memory; all of this provides for really fast read and writes.

![fraud detection with Hadoop, NoSQL, streaming](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/spark-fraud-9k-1605742944012.jpg)

All of the components of the use case architecture we just discussed can run on the same cluster with the MapR Data Platform. There are several advantages of having MapR Event Store on the same cluster as all the other components. For example, maintaining only one cluster means less infrastructure to provision, manage, and monitor. Likewise, having producers and consumers on the same cluster means fewer delays related to copying and moving data between clusters, and between applications.

![fraud detection software stack](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/11/spark-fraud-9l-1605742956048.jpg)

## Summary

In this blog post, you learned how the MapR Data Platform integrates Hadoop and Spark with real-time database capabilities, global event streaming, and scalable enterprise storage.

References and More Information:

*   [Free Online training](https://learn.ezmeral.software.hpe.com/)
*   <a target='\_blank'  href='http://spark.apache.org/docs/latest/streaming-programming-guide.html'>Apache Spark Streaming Programming Guide</a>
*   Fraud Analytics Using Descriptive, Predictive, and Social Network Techniques: A Guide to Data Science for Fraud Detection Book, by Wouter Verbeke; Veronique Van Vlasselaer; Bart Baesens
*   Learning Spark Book, By Holden Karau, Andy Konwinski, Patrick Wendell, Matei Zaharia