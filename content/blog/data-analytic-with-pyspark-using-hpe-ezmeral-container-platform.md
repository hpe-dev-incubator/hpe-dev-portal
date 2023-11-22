---
title: Data Analytics with PySpark using HPE Ezmeral Container Platform
date: 2021-09-07T02:12:15.242Z
author: Cenz Wong
authorimage: https://avatars.githubusercontent.com/u/44856918?v=4
thumbnailimage: ""
tags:
  - hpe-ezmeral
  - hpe-ezmeral-data-fabric
  - hpe-ezmeral
---
**Editor’s Note – HPE Ezmeral Container Platform is now HPE Ezmeral Runtime Enterprise**. For more information on why the name was changed, please [click here](https://community.hpe.com/t5/HPE-Ezmeral-Uncut/HPE-Ezmeral-Container-Platform-is-now-HPE-Ezmeral-Runtime/ba-p/7151720#.YW7nOxrMKM8).

---

PySpark is an interface for Apache Spark in Python. [Apache Spark](https://spark.apache.org/) is a unified analytics engine for big data processing. It allows developers to perform data processing on files in a distributed filesystem, like the Hadoop distributed filesystem or HPE Ezmeral Data Fabric (formerly known as MapR-XD). Due to its complexity, setting up a Spark environment is always a pain for data scientists. Hopefully, HPE Ezmeral Container Platform can make this much easier. 

You can run Apache Spark jobs on Kubernetes-managed clusters on the HPE Ezmeral Container Platform. The HPE Ezmeral Container Platform provides you with access to a wealth of MLOps tools such as Apache Spark Operator, and things like a [Kubedirector](https://kubedirector.io/) Jupyter Notebook where you will do your Data Science work and interact with the Apache Spark Operator to run your Apache Spark jobs. 

Once logged in as an MLOps tenant member, you can deploy an instance of Jupyter Notebook. From the Jupyter Notebook, you can either run Spark jobs with Apache Livy to make REST API calls to Spark Operator, or you can directly run a Spark job against the Spark Operator with the PySpark module. 

In this post, I will focus on running simple Spark jobs using the PySpark module on a Jupyter Notebook cluster instance deployed on HPE Ezmeral Container Platform. For those who want to squeeze the best performance out of Spark and run Spark Jobs with Apache Livy, visit this [post](https://developer.hpe.com/blog/on-premise-adventures-how-to-build-an-apache-spark-lab-on-kubernetes/).

## Preparing the Jupyter Notebook Cluster

First, we have to prepare our favorite Jupyter Notebook environment. Inside a MLOps tenant, navigate to **Notebooks** tab. You will see a Jupyter Notebook KubeDirector app prepared for you. After clicking the **Launch** button, you will need to configure the compute resource needed.

![image](https://user-images.githubusercontent.com/72959956/120459929-39c63300-c3cb-11eb-9e7a-65189f4367d3.png)

As you can see below, you must specify the name of the Jupyter Notebook cluster. Click **Enable DataTap** to expand access to shared data by specifying a named path to a specified storage resource.

![image](https://user-images.githubusercontent.com/72959956/132812471-d1ce5ce8-0d47-41ae-bd96-879262018f84.png)

Switching to the **Notebook Endpoints** tab, you can see that the access points are prepared for you. Just click the link and, after logging in with your LDAP/AD account, your favorite Jupyter environment is ready for you.

![image](https://user-images.githubusercontent.com/72959956/120460678-ea343700-c3cb-11eb-9aef-8afc9252d471.png)

Different kernels are already installed for you. No matter which languages you are using, there will be one that suits your ML project. There are two kernels which are Python related, i.e. Python3 and PySpark kernel. Python3 kernel is the kernel for you to run single node workloads while PySpark kernel, connected with Spark Operator and Livy, is the kernel for you to run distributed workloads. In this post, I am running a simple Spark job. So I will pick the Python3 kernel and import the PySpark module in the runtime.

![image](https://user-images.githubusercontent.com/72959956/120460537-cc66d200-c3cb-11eb-8410-3b7ec95051d5.png)

## Preparing the datasets

Imagine that you have a very large CSV file ready for analysis. You need to put the file to the distributed filesystem. Of course, you can do that with the graphic user interface provided through HPE Ezmeral Container Platform.

![image](https://user-images.githubusercontent.com/72959956/120461217-67f84280-c3cc-11eb-9126-e69cacef4432.png)

The other way to do this would be to drag the file to the left panel of the local Jupyter Notebook cluster and run the following HDFS commands to put the file to the "TenantStorage" through DataTap.

```bash
# Put a file from local filesystem to distributed filesystem using HDFS commands
hdfs dfs -put enhanced_sur_covid_19_eng.csv dtap://TenantStorage/enhanced_sur_covid_19_eng.csv
# List the files or directories
hdfs dfs -ls dtap://TenantStorage/
# List the files or directories
hdfs dfs -tail dtap://TenantStorage/enhanced_sur_covid_19_eng_.csv
```

![image](https://user-images.githubusercontent.com/72959956/129331881-dbe602e7-b3d9-4541-a9d0-4ea274aa7e51.png)

# Getting Started with PySpark

The PySpark module is already installed for you. No extra installation is needed. So convenient, isn't it? Some configurations for the PySpark runtime are needed in order to read files from DataTap.

```py
# python3 kernel
from PySpark import SparkConf, SparkContext

# Specify the path of the jars files
conf = SparkConf().set("spark.jars", "/opt/bdfs/bluedata-dtap.jar")
sc = SparkContext(conf=conf)
# Specify the Hadoop configurations.
sc._jsc.hadoopConfiguration().set('fs.dtap.impl', 'com.bluedata.hadoop.bdfs.Bdfs')
sc._jsc.hadoopConfiguration().set('fs.AbstractFileSystem.dtap.impl', 'com.bluedata.hadoop.bdfs.BdAbstractFS')
```

## Reading datasets from HPE Ezmeral Data Fabric

After some configuration, your Spark engine is connected to the platform and you can now read files from HPE Ezmeral Data Fabric through Data Tap.

```py
# Commands for reading DataTap file.
text = sc.textFile("dtap://TenantStorage/hello.txt")
text.take(5)
```

For reading CSV files as a Spark dataframe, run the following commands:

```py
# Commands for importing PySpark SQL module.
from pyspark.sql import SparkSession

spark = SparkSession.builder.getOrCreate()

# Commands for reading DataTap csv file.
df = spark.read.csv('dtap://TenantStorage/enhanced_sur_covid_19_eng.csv', header=True, inferSchema=True)
df.take(3)
```

![image](https://user-images.githubusercontent.com/72959956/122021373-333ab100-cdf8-11eb-9e58-edbccf43f0b2.png)

![image](https://user-images.githubusercontent.com/72959956/122021431-3e8ddc80-cdf8-11eb-9c61-d9bd400a4c9b.png)

## Data analytics with PySpark

With PySpark, you can easily read data from files, cleanse data and do analytics within a Jupyter notebook. To view the entire notebook, click [here](https://github.com/helloezmeral/HPE-Ezmeral-HelloWorld/blob/main/pyspark/pyspark_covidhk.ipynb).

| Screenshot                                                                                                      | Description                                                                                   |
| --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| ![image](https://user-images.githubusercontent.com/72959956/122021467-45b4ea80-cdf8-11eb-8ca4-ffc11c03f1ad.png) | You can run `df.printSchema()` to view the schema of your dataframe.                          |
| ![image](https://user-images.githubusercontent.com/72959956/122021502-4baacb80-cdf8-11eb-87d3-b29ef643b373.png) | These are the commands for selecting columns of data and filtering according to the criteria. |
| ![image](https://user-images.githubusercontent.com/72959956/122021550-56fdf700-cdf8-11eb-9c31-e0d171c7406e.png) | Some common commands to interact with your datasets.                                          |
| ![image](https://user-images.githubusercontent.com/72959956/122021576-5ebd9b80-cdf8-11eb-9810-36d744560327.png) | Commands for data aggregation.                                                                |
| ![image](https://user-images.githubusercontent.com/72959956/122021616-667d4000-cdf8-11eb-8400-2dc03f4290f3.png) | Example for visualizing your datasets.                                                        |

## Possible error

You may encounter the error, "permission denied", when running HDFS commands. To solve this error, you have to "exec" into the pod and change the access mode for the core-site.xml.

![image](https://user-images.githubusercontent.com/72959956/124234611-d6086480-db46-11eb-849e-7d4f7a8c35e4.png)

You can "exec" into it through the Jupyter notebook or using the WebTerminal that comes along with HPE Ezmeral Container Platform. To grab the Kubectl credential from HPE Ezmeral Container Platform, run the following command:

```bash
# Bash Kernel
# Grap the kubectl credential
kubectl hpecp refresh ez-gateway.hpeilab.com --insecure --hpecp-user=hpecli --hpecp-pass=hpecli
kubectl get pods --all-namespaces
kubectl get pods --namespace=poc-tenant
```

Run the following command for accessing the bash of pod:

```bash
# 1: exec into the pod
kubectl exec -it <pod name> -- /bin/bash
# example
kubectl exec -it testnotebook-controller-6kq7r-0 --namespace=poc-tenant -- /bin/bash
```

Run the following command for changing the access mode:

```bash
# 2: changed the access mode for the core-site.xml
chmod 666 /opt/bluedata/hadoop-2.8.5/etc/hadoop/core-site.xml
```

And now you can run the HDFS command without error.

# Key takeaway

I hope this post offered you some tips on how to do big data analytics using the Apache Spark Python API with less time spent on setting up the environment and more time on digging out business insight from your data. Keep this notebook handy so you can refer back to it often. Also, keep an eye out on the [HPE DEV blog](https://developer.hpe.com/blog) to make sure you catch future articles on this subject.
