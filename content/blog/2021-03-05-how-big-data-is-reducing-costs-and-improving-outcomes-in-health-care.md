---
title: How Big Data is Reducing Costs and Improving Outcomes in Health Care
date: 2021-03-05T09:24:44.418Z
author: Carol McDonald
authorimage: /img/blogs/Avatar1.svg
tags:
  - hpe-ezmeral-data-fabric
  - MapR
  - apache-spark
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019 may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)



## Original Post Information:



```
"authorDisplayName": "Carol McDonald",
"publish": "2016-06-07T07:00:00.000Z",
"tags": "machine-learning, use-case, healthcare"
```



---



## The Motivation for Big Data

Health care costs are driving the demand for big-data driven Healthcare applications. U.S. health care spending has outpaced GDP growth for the past several decades and exceeds spending in any other developed country. Despite being more expensive, according to the Organisation for Economic Co-operation and Development (OECD), the US Health System ranks last among eleven countries on measures of access, equity, quality, efficiency, and healthy lives. Standards and incentives for the digitizing and sharing of healthcare data along with improvements and decreasing costs in storage and parallel processing on commodity hardware, are causing a [big data revolution in health care](http://www.mckinsey.com/industries/healthcare-systems-and-services/our-insights/the-big-data-revolution-in-us-health-care) with the goal of [better care at lower cost.](http://www.nationalacademies.org/hmd/Reports/2012/Best-Care-at-Lower-Cost-The-Path-to-Continuously-Learning-Health-Care-in-America.aspx)

![](/uploads/media/2021/1/life-expectancy-1-1611296455217.png)

## Value Based Care

A goal of the Affordable Care Act is to improve health care through the meaningful use of health information technology in order to:

*   Improve healthcare quality and coordination so that outcomes are consistent with current professional knowledge
*   Reduce healthcare costs, reduce avoidable overuse
*   Provide support for reformed payment structures

![](/uploads/media/2021/1/improved-health-care-2-1611296469408.png)

Health insurance companies, such as Medicare and Medicaid, are shifting from fee-for-service compensation to value-based data-driven incentives that reward high-quality, cost-effective patient care and demonstrate meaningful use of electronic health records.

![](/uploads/media/2021/1/improve-health0care-3-1611296489579.png)

## **Health Care Data**

Unstructured data forms about 80% of information in the healthcare industry and is growing exponentially. Getting access to this unstructured data—such as output from medical devices, doctor’s notes, lab results, imaging reports, medical correspondence, clinical data, and financial data—is an invaluable resource for improving patient care and increasing efficiency.

Examples of healthcare data sources that will benefit from big data and analytics:

*   Claims: are the documents providers submit to insurance companies to get paid. A key component of the [Health Insurance Portability and Accountability Act (HIPAA)](http://www.edibasics.com/edi-resources/document-standards/hipaa/) is the establishment of national standards for electronic healthcare transactions in order to improve efficiency by encouraging the widespread use of Electronic Document Interchange (EDI) between healthcare providers and insurance companies. Claim transactions include International Classification of Diseases (ICD) diagnostic codes, medications, dates, provider IDs, the cost, etc.
*   Electronic Health/Medical Record data (EHR or EMR): Medicare and Medicaid EHR [incentive programs](https://www.cms.gov/Regulations-and-Guidance/Legislation/EHRIncentivePrograms/index.html?redirect=/EHRincentivePrograms/) were established to encourage professionals and hospitals to adopt and demonstrate meaningful use of certified EHR technology. EHRs facilitate a comprehensive sharing of data with other providers and medical applications. EHRs contain the data from the delivery of healthcare, which includes diagnosis, treatment, prescriptions, lab tests, and radiology. [Health Level Seven International (HL7)](http://www.hl7.org/implement/standards/index.cfm?ref=nav) provides standards for the exchange, integration, sharing, and retrieval of electronic health record data.
*   Pharmaceutical R&D: Clinical Trials Data, Genomic Data.
*   Patient behavior and sentiment data.
*   Medical Device Data: Patient sensor data from the home or hospital.

![](/uploads/media/2021/1/health-data-inputs-4-1611296501518.png)

## **Big Data Trends in Healthcare**

There is a move toward evidence-based medicine, which involves making use of all clinical data available and factoring that into clinical and advanced analytics. Capturing and bringing all of the information about a patient together gives a more complete view for insight into care coordination and outcomes-based reimbursement, population health management, and patient engagement and outreach.

![](/uploads/media/2021/1/converged-data-platform-mapr-5-1611296512091.png)

## **Example Healthcare Big Data Use Cases**

### **Reducing Fraud Waste and Abuse with Big Data Analytics**

The cost of fraud, waste and abuse in the healthcare industry is a key contributor to spiraling health care costs in the United States, but big data analytics can be a game changer for health care fraud. The Centers for Medicare and Medicaid Services prevented more than $210.7 million in healthcare fraud in one year using predictive analytics. UnitedHealthcare transitioned to a predictive modeling environment based on a Hadoop big data platform, in order to identify inaccurate claims in a systematic, repeatable way and generated a 2200% return on their big data/advanced technology.

The key to identifying fraud is the ability to store and go back in history to analyze large unstructured datasets of historical claims and to use machine-learning algorithms to detect anomalies and patterns.

Healthcare organizations can analyze patient records and billing to detect anomalies such as a hospital’s overutilization of services in short time periods, patients receiving healthcare services from different hospitals in different locations simultaneously, or identical prescriptions for the same patient filled in multiple locations.

![](/uploads/media/2021/1/machine-learning-in-health-care-6-1611296525640.png)

The Centers for Medicare and Medicaid Services uses predictive analytics to assign risk scores to specific claims and providers, to identify billing patterns, and claim aberrancies difficult to detect by previous methods. Rules-based models flag certain charges automatically. Anomaly models raise suspicion based on factors that seem improbable. Predictive models compare charges against a fraud profile and raise suspicion. Graph models raise suspicion based on the relations of a provider; fraudulent billers are often organized as tight networks.

### **Predictive Analytics to Improve Outcomes**

Initiatives such as meaningful use are accelerating the adoption of Electronic Health Records and the volume and detail of patient information is growing rapidly. Being able to combine and analyze a variety of structured and unstructured data across multiple data sources aids in the accuracy of diagnosing patient conditions, matching treatments with outcomes, and predicting patients at risk for disease or readmission.

Predictive modeling over data derived from EHRs is being used for early diagnosis and is reducing mortality rates from problems such as congestive heart failure and [sepsis.](http://www.healthcareitnews.com/news/data-analytics-strategy-slashes-sepsis-death-rates) Congestive Heart Failure (CHF) accounts for the most health care spending. The earlier it is diagnosed the better it can be treated, avoiding expensive complications, but early manifestations can be easily missed by physicians. A machine learning example from Georgia Tech demonstrated that machine-learning algorithms could look at many more factors in patients’ charts than doctors and, by adding additional features, there was a substantial increase in the ability of the model to distinguish people who have CHF from people who don’t.

![](/uploads/media/2021/1/uncovering-features-7-1611296534274.png)

Predictive modeling and machine learning on large sample sizes, with more patient data, can uncover nuances and patterns that couldn’t be previously uncovered. [Optum Labs has collected EHRs](http://www.datapine.com/blog/big-data-examples-in-healthcare/) of over 30 million patients to create a database for predictive analytics tools that will help doctors make Big Data-informed decisions to improve patients’ treatment.

![](/uploads/media/2021/1/health-care-model-building-and-scoring-8-1611296546479.png)

### Real-time Monitoring of Patients

Healthcare facilities are looking to provide more proactive care to their patients by constantly monitoring patient vital signs. The data from these various monitors can be analyzed in real time and send alerts to care providers so they know instantly about changes in a patient’s condition. Processing real-time events with machine learning algorithms can provide physicians’ insights to make lifesaving decisions and allow for effective interventions.

![](/uploads/media/2021/1/medical-device-to-data-streaming-9-1611296558176.png)

## **Big Data Architecture for Healthcare: **What do we need to do? And how do we do this at scale?****

We need to collect the data, process the data, store the data, and finally serve the data for analysis, machine learning, and dashboards.

![](/uploads/media/2021/1/health-care-data-architecture-10-1611296569137.png)

## **Data Ingestion with NFS**

The Network File System (NFS) protocol provides remote access to shared disks across networks. An NFS-enabled server can share directories and files with clients, allowing users and programs to access files on remote systems as if they were stored locally.

Unlike other Hadoop distributions that only allow cluster data import or import as a batch operation, MapR lets you mount the cluster itself via NFS so that your applications can read and write data directly. The MapR Distributed File and Object Store enables direct file modification and multiple concurrent reads and writes via POSIX semantics. An NFS-mounted cluster allows easy data ingestion of data sources, such as files, images, etc., from other machines leveraging standard Linux commands, utilities, applications, and scripts.

![](/uploads/media/2021/1/data-sources-collection-storage-11-1611296581906.png)

From your MapR Cluster, you can move data to and from more expensive storage using NFS. For example, you can move processed hot data to a relational database or Data Warehouse and you can also move off colder data into lower cost Hadoop storage.

## **Streaming Data Ingestion with the Kafka API**

As more and more healthcare solutions require real-time analytics and fast moving data, ingesting data into the system using event streaming will become critical. MapR Event Store is a new distributed messaging system that enables producers and consumers to exchange events in real time via the Apache Kafka 0.9 API. Topics are logical collections of messages that organize events into categories.

Topics are partitioned, spreading the load for parallel messaging across multiple servers, which provides for faster throughput and scalability.

Messages are not deleted from topics when read and topics can have multiple different consumers. This allows processing of the same messages by different consumers for different purposes.

![](/uploads/media/2021/1/kafka-api-producers-and-consumers-12-1611296593323.png)

## **Batch Processing**

Batch processing is for processing bulk loads of data gathered over a period where a fast response time is not critical; for example, EDI claims gathered over a day and submitted together in a file for processing overnight.

Apache Hive is an open source Hadoop application for data warehousing. It offers a simple way to apply structure to large amounts of unstructured data, and then perform batch SQL-like queries on that data.

Apache Spark is a next generation distributed parallel processing framework that provides a rich set of APIs for machine learning, graph processing, SQL. Spark is much faster than MapReduce for iterative algorithms, because Spark tries to keep things in memory, whereas MapReduce involves more reading and writing from disk.

![](/uploads/media/2021/1/batch-processing-collect-to-processing-data-13-1611296604993.png)

## Stream Processing

Spark Streaming brings Spark's APIs to stream processing, letting you write streaming jobs the same way you write batch jobs. Other popular options for Stream processing are Apache Flink and Apache Storm.

![](/uploads/media/2021/1/stream-processing-streaming-and-processing-14-1611296616672.png)

## Storing in a NoSQL Database

For Storing lots of Data we need a data store that supports fast writes and scales. MapR Database was designed to scale due to the fact that data that is accessed together is stored together.

![](/uploads/media/2021/1/storing-in-nosql-rdbms-to-mapr-db-15-1611296626000.png)

With MapR Database, data is automatically distributed or partitioned across the cluster by key range. Each server is the source for a subset of data. Grouping the data by row key provides for really fast read and writes.

![](/uploads/media/2021/1/group-by-row-for-fast-read-writes-16-1611296635923.png)

**MapR Database has 2 APIs:**

*   JSON API for storing document models.
*   HBase API for wide column data models (typical for time series data).

![](/uploads/media/2021/1/mapr-db-apis-17-1611296648222.png)

## **Serving the Data**

End applications like dashboards, business intelligence tools and other applications use the processed data. The output can also be stored back in our database for further processing later.

Apache Drill enables self-service data exploration on big data with a schema-free SQL query engine. Drill offers the following benefits:

*   Drill can read from all kinds of data.
*   Drill is optimized for interactive applications, and thus is designed to process petabytes of data and trillions of records in seconds.
*   Drill can be used by data analysts, in conjunction with tools like Tableau, for fast visualizations.

![](/uploads/media/2021/1/big-data-architecture-components-18-1611296658517.png)

All of the components of the architecture we just discussed can run on the same cluster with the MapR Data Platform. There are several advantages of integrating Hadoop, Spark, real-time database capabilities, global event streaming, and scalable enterprise storage:

*   Maintaining only one cluster means less infrastructure to provision, manage, and monitor for security, reliability, and performance, dramatically lowering both hardware and operational costs.
*   Having producers and consumers on the same cluster means fewer delays related to copying and moving data between clusters, and between applications.

![](/uploads/media/2021/1/mapr-health-care-architecture-19-1611296669267.png)

## **Use Case Example Architectures**

![](/uploads/media/2021/1/data-lake-architecture-20-1611296679971.png)

The National Institutes for Health built a data lake to combine separate institute data sets, in order to have all the information at one location where it could be shared and manipulated.

UnitedHealthcare IT used Hadoop as the basic data framework and built a single platform equipped with the tools needed to analyze information generated by claims, prescriptions, plan participants and contracted care providers, and associated claim review outcomes.

## **Streaming System of Record for Healthcare**

Liaison Technologies provides cloud-based solutions to help organizations integrate, manage and secure data across the enterprise. One vertical solution they provide is for the healthcare and life sciences industry, which comes with two challenges–meeting HIPAA compliance requirements and the proliferation of data formats and representations. With MapR Event Store, the data lineage portion of the compliance challenge is solved because the stream becomes a system of record by being an infinite, immutable log of each data change.

![](/uploads/media/2021/1/streaming-system-of-record-health-care-21-1611296690735.png)

To illustrate the latter challenge, a patient record may be consumed in different ways &mdash; a document representation, a graph representation, or search &mdash; by different users, such as pharmaceutical companies, hospitals, clinics, physicians, etc. By streaming data changes in real-time to the MapR Database HBase, MapR Database JSON document, graph, and search databases, users always have the most up-to-date view of data in the most appropriate format. Further, by implementing this service on the MapR Data Platform, Liaison is able to secure all of the data components together, avoiding data and security silos that alternate solutions require.

## Genome Processing

The Novartis team chose Hadoop and Apache Spark to build a workflow system that allows them to integrate, process and analyze diverse data for Next Generation Sequencing (NGS) research while being responsive to advances in the scientific literature.

![](/uploads/media/2021/1/genome-processing-22-1611296700172.png)

The ability to capture, share, and store huge amounts of electronic healthcare data and transactions, along with advances in technology allowing the storage and fast processing of big data on commodity hardware, is transforming the healthcare industry by improving outcomes and reducing costs.

**References and More Information:**

[The Big Data Revolution in Health Care](http://www.mckinsey.com/industries/healthcare-systems-and-services/our-insights/the-big-data-revolution-in-us-health-care)

[Better Care at Lower Cost the Path to Continuously Learning Health Care](http://www.nationalacademies.org/hmd/Reports/2012/Best-Care-at-Lower-Cost-The-Path-to-Continuously-Learning-Health-Care-in-America.aspx)