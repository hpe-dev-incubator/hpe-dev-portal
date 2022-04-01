---
title: Highlighting key features of HPE Ezmeral Runtime Enterprise Release 5.4
date: 2022-03-31T18:18:53.021Z
author: Srikanth Venkata Seshu
authorimage: /img/Avatar1.svg
tags:
  - hpe-ezmeral
  - data-scientist
  - data-ml-engineer
---
It’s a cliché to say that data is an important asset to organizations. Organizations of all sizes are looking at data as a strategic asset to help them create a digital advantage. From delivering frictionless customer experiences and fraud detection, to accelerating breakthrough innovations in healthcare and personal medicine, enterprises are moving into the digital economy very rapidly. Data-first artificial intelligence (AI) and machine learning (ML) initiatives are seen as a strategic enabler and a top investment priority for these organizations. Yet, 80-85% of Enterprises* find it difficult to move their AI/ML initiatives beyond the experimentation stage and thus fail to deliver any meaningful business outcomes.

###### \* Gartner: Don't Stumble at the Last Mile: Leveraging MLOps and DataOps to Operationalize ML and AI

## Common operational challenges 

I speak to a lot of customers across different industries and verticals. It is fascinating to see that they all have many challenges in common. Some that I hear repeatedly are: 

#### Fragmented data and governance controls 

It is true that enterprises have large amounts of data at their disposal. However, the data is often silo’ed, with inconsistent governance controls, which makes it difficult for the consumers of data, namely, Data Engineers, Data Analysts and Data Scientists, to access the data in a timely, safe and self-service fashion. 

#### Enabling modern analytics at scale

Enterprises are looking beyond Hadoop to modernize their analytics stacks, considering applications such as Apache Spark™ to run on Kubernetes. While the new approach yields several benefits, including self-service access to Spark clusters, elastic and independent scaling of compute and storage, rolling upgrades to newer Spark versions, etc., the transition from the legacy world is not that simple. There is a learning curve associated with operationalizing Kubernetes, putting the right security and access controls in place, establishing data connectivity to many different data sources, etc., just to name a few considerations. 

In addition, every persona has a certain preference for using their tool of choice to interact with Spark. Then, there is the data consistency problem. While data lakes are cost efficient, ensuring the data consistency and data reliability that is required for AI/ML applications is a huge challenge. 

#### Runtime environment consistency

Deploying Kubernetes has become a lot simpler today, which leads to different development teams easily spinning up new clusters. However, these clusters may not be in compliance or meet enterprise security standards. The question is, how do you make it easier for application teams to self-provision Kubernetes clusters and, at the same time, enforce immutable security controls that are centrally governed? 

## HPE Ezmeral Runtime Enterprise – Modern approach to delivering end-to-end analytics solutions at scale

[HPE Ezmeral Runtime Enterprise](https://www.hpe.com/us/en/software/ezmeral-runtime.html) is a turnkey platform designed to support clients’ AI, analytics and data needs, as well as help them innovate faster. Built on the foundation of Kubernetes, the Ezmeral Runtime Enterprise platform brings simplicity to operationalizing the ML lifecycle through [HPE Ezmeral ML Ops](https://docs.containerplatform.hpe.com/54/reference/universal-concepts/About_HPE_Ezmeral_ML_Ops.html) and [HPE Ezmeral Runtime Enterprise Analytics for Apache Spark]( https://docs.containerplatform.hpe.com/54/reference/HPE_Ezmeral_Runtime_Analytics_for_Spark.html) at the edge, on-premises or on public clouds with an infrastructure agnostic approach to deploying and managing the analytics stack.

HPE Ezmeral Runtime Enterprise natively includes ***[Ezmeral Data Fabric](https://www.hpe.com/us/en/software/ezmeral-data-fabric.html)*** – a modern data platform with global namespace and built-in capabilities to store files, objects, event stream store, databases – binary and JSON db – and provide access to data via various protocols including NFS, HDFS, S3 and POSIX. HPE Ezmeral Runtime Enterprise also provides the flexibility to connect to existing data lakes and data sources such as HDFS, S3 Object stores and third-party storage systems, to enable analytical applications running on K8s clusters remote access to data, thus enabling compute-storage separation. 

The latest 5.4 release of HPE Ezmeral Runtime Enterprise includes quite a few new capabilities, so without further delay, let me highlight these new features. 

#### HPE Ezmeral Unified Analytics 

[HPE Ezmeral Unified Analytics](https://www.hpe.com/us/en/software/ezmeral-unified-analytics.html) is a modern approach to delivering elastic open-source based Spark clusters combined with the Delta Lake for a data lakehouse architecture solution. More on this later. But before that, let me walk you through some common challenges that I hear repeatedly from both Spark administrators and users (think Data Engineers, Data Analysts, and Data Scientists):

Challenges of a Spark administrator:

* Provision multiple versions of Spark to cater to different application teams’ needs
* Consistent user authentication and authorization from application to downstream data layer
* Efficient use of resources, including expensive GPU accelerators 
* Ability to connect to diverse sets of data sources 
* Enterprise support with SLAs

Spark users, on the other hand, have their own concerns:

* Ability to use REST, CLI, or scripted workflows for Spark job submissions
* Desire to use CPU and/or GPU for Spark jobs, including for dynamic scaling
* Multiple storage options – S3, MapR FS, Hadoop data lakes access
* Support for real-time and batch workloads at scale

## How does HPE Ezmeral Unified Analytics solve these challenges? 

Let me summarize the features and benefits here. 

#### Multi-version Spark support 

One-click deployment of a Spark Operator on Kubernetes cluster. This single Spark Operator manages Spark version 2.4.7 and Spark version 3.1.2 and enables users to run multi-version Spark applications. This also includes Spark images with support for multiple languages including Python, R, Java, Scala, etc. 

#### Interactive Spark experience through Livy 

This is for personas that are adept at using REST APIs to interact with Spark. HPE has included [Livy support](https://docs.containerplatform.hpe.com/54/reference/kubernetes-applications/spark/submit_spark_application_using_livy.html) for both Spark 2 and 3 versions. This allows personas, like Data Scientists, to interact with Spark from their Jupyter notebooks. You simply launch the Livy server with one click, connect to the server endpoint, and start submitting Spark jobs. 

#### Interaction with BI tools 

The [Thrift Server](https://docs.containerplatform.hpe.com/54/reference/kubernetes-applications/spark/installing-and-configuring-spark-thrift-server.html) component provides a JDBC/ODBC interface for enabling Data Analysts to interact with Spark from BI tools such as Tableau, PowerBI, Qlik, etc.

#### Shared [Hive metastore](https://docs.containerplatform.hpe.com/54/reference/kubernetes-applications/spark/install_configure_hive_metastore.html) service 

This enables multiple Spark applications running across different tenants or K8s clusters to share common metadata/schema. 

#### Intuitive Job submission interface 

This provides a [wizard-driven UI](https://docs.containerplatform.hpe.com/54/reference/kubernetes-applications/spark/managing_spark_applications_using_gui.html) for tenant users to submit their Spark applications. HPE Ezmeral Runtime Enterprise also allows users to bring their YAML files and upload them to UI to run their Spark job immediately, or schedule it to run at a specified time interval. Users can monitor the status of running jobs, as well as look at the events and log files all from an intuitive user interface. 

#### Airflow DAGs 

Data engineers responsible for building data pipelines often resort to automation provided by workflow orchestration tools, like [Airflow](https://docs.containerplatform.hpe.com/54/reference/kubernetes/kubernetes-administrator/airflow/airflow_installation.html), to sequence a set of tasks using Directed Acyclic Graph (DAG). HPE Ezmeral Runtime Enterprise includes an Airflow operator - enabled with one click during Kubernetes cluster creation. Once enabled, users create and submit Spark jobs using DAGs. Users can store their DAGs in Git, version control it and configure HPE Ezmeral Runtime Enterprise to run those from the Git repository.

#### Delta Lake support 

Delta Lake is a storage architecture that enables a lakehouse architecture on Spark. It combines the best of data warehouse characteristics, such as ACID properties, schema enforcement, and versioning features, to unstructured and semi-structured data stored in a massively scalable and cost-optimized data lake. With this, you get the data consistency and data reliability that are key requirements in environments with multiple concurrent data pipelines acting on data. The HPE Ezmeral Unified Analytics stack includes open delta libraries by default, enabling applications to read and write data using the delta format in parquet files on HPE Ezmeral Data Fabric or on any S3-compatible object stores.

#### Read and write data from different data sources 

HPE Ezmeral Runtime Enterprise provides DataTap to connect Spark applications to remote HDFS data sources, thereby bringing compute closer to data. You can also connect Spark apps to any S3-compatible object store to access and store data. 

#### Enterprise-grade Security 

Enterprise-grade security secures access to Spark clusters. Users are authenticated against AD/LDAP, and authenticated users are allowed to perform operations on Spark clusters based on the RBACs. The identity of authenticated/authorized user is preserved during data access. 

Hopefully, this gives you enough information to whet your appetite about the HPE Ezmeral Unified Analytics solution. 

## Let’s move on to HPE Ezmeral ML Ops 

[HPE Ezmeral MLOps](https://www.hpe.com/us/en/solutions/ezmeral-machine-learning-operations.html) is an end-to-end Machine Learning lifecycle management platform for building, training and operationalizing ML models. Here are some of the key features of HPE Ezmeral ML Ops in release 5.4.

#### Introducing support for KubeFlow (KF) 1.3

Single click deployment of KF 1.3. This includes integration with MLFlow for model management, experiment tracking and improved collaboration among data scientists operating on projects to share ML models and model metadata.

#### Enhancing data scientist productivity

* Kale extensions: Kale stands for KubeFlow Automated Pipeline Engine. This is an add-on to Jupyter notebooks that provides a simple way for data scientists to annotate notebook cells, as opposed to writing complex code to craft KF pipelines. 
* Prebuilt library of functions: The release adds “ezmllib”, which includes several functions that makes it easy for code-first data scientists to interact with Spark, KubeFlow, ML Model registry, etc. from their notebooks and simplifies the coding experience.

#### Accelerating Model training and inferencing 

HPE Ezmeral ML Ops is adding support for NVIDIA MIG-enabled GPUs to be leveraged by data scientists in their notebooks for model building and training. ML/DL frameworks such as Tensorflow and Pytorch have been updated with the right CUDA (Compute Unified Device Architecture) libraries to take advantage of fractionalized GPUs providing cost-efficiency and secure isolation of workloads. 

## HPE Ezmeral Runtime Control plane – The wizard behind the curtain

The HPE Ezmeral Runtime Enterprise control plane is responsible for lifecycle management of on-premises K8s clusters; orchestrating cloud provider-managed K8s clusters – EKS, AKS and GKE; managing user identity and access controls; and securing ingress and access to service endpoints, to name a few of its capabilities.

#### New features in this release include: 

**Fractional GPU support for NVIDIA MIG-enabled devices:** Multi-instance GPU (MIG) provides a way to partition GPU resources into slices to improve GPU utilization, as well as offer workload security through fault isolation. HPE Ezmeral Runtime Enterprise has been enhanced to set up MIG profiles (single and mixed strategy) and expose those to workloads (Tensorflow, Pytorch, etc.) via CUDA libraries. Different classes of GPU devices (V, P, T, A classes of NVIDIA GPUs) can coexist on the Kubernetes hosts and HPE Ezmeral Runtime Enterprise can orchestrate workload placement on the right GPU device. In addition, HPE Ezmeral Runtime Enterprise automatically persists these MIG profiles to survive host reboots.

**Day 2 enhancements for Centralized Policy management:** The previous 5.3 release included a GitOps-based centralized policy management feature to declaratively construct K8s clusters that conformed to organizations policies. The policy management feature also brought in drift management and reconciliation capabilities to create immutable clusters. The 5.4 release offers a simpler way for admins to visualize the effects of cluster policies on a dashboard. Admins can quickly see which of the existing Kubernetes objects and workloads are in non-compliance with the policy set or the new objects that are being blocked from creation due to the enforced policies. This way, admins can make better decisions about the effects of policies and fine tune them as needed.

## Where to go from here

As you can tell, there are quite a few new features and capabilities included in the HPE Ezmeral Runtime Enterprise 5.4 release and we are excited to share them with you. 

To learn more about the HPE Ezmeral products, please contact the HPE Sales team, or visit [www.hpe.com/ezmeral](https://www.hpe.com/us/en/software.html) to explore how HPE Ezmeral Runtime Enterprise can accelerate your AI and Analytics journey. To learn more about this release, please refer to the [documentation and release notes](https://docs.containerplatform.hpe.com/54/). More information on [HPE Ezmeral](https://developer.hpe.com/platform/hpe-ezmeral/home/) can be found on the HPE Developer portal. You can view other articles on HPE Ezmeral here on the [HPE DEV blog](https://developer.hpe.com/blog).



###### Apache® and Apache Spark™ are either registered trademarks or trademarks of the Apache Software Foundation in the United States and/or other countries. No endorsement by the Apache Software Foundation is implied by the use of these marks.