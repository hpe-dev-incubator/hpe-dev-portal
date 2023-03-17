---
title: Custom Docker Images  for EMR Serverless.
date: 2023-03-09T11:10:16.774Z
externalLink: ""
author: D.R.Niranjan, Chirag Talreja, Sagar Nayamagouda, Chinmay Chaturvedi,
  Kalapriya Kannan, Roopali Gupta
authorimage: /img/alletra-element-small.png
disable: false
tags: []
---
<!--StartFragment-->

EMR serverless is the latest addition from the AWS to offer out of box support for Elastic MapReduce paradigm with auto scaling and pay as you go model.  One often needs to build custom images in EMR serverless since the application uses specialized libraries that don't come with an EMR serverless base image. An explicit use case would be the requirements found with Delta Lake over S3 or specific Python modules, such as boto modules, database access libraries (i.e. pgcopy), etc. While there exists the option to have them installed at run time (i.e. when the image is running in a container and a custom script is used to install it), in production settings, it is encouraged to prebundle all the required libraries, modules, and jars. Dynamic installations are typically discouraged due to access permissions and internet connectivity issues.  Further, getting prebundled assembly jars with all the dependencies is feasible in certain programming such as a scala/java, but with widely used python the concept of creating assembly modules is missing. To address this, one option for all python based modules/libraries that are required by the application code is to be prebundle them into custom images.    We are going to show you a fairly quick and easy way to do this for AWS.

In this article we take two scenarios , one where the application expects the data jars to be in specific location for its execution as in case of Delta lake and another where we install specific python modules using pip install both of which are bundled into a custom docker image that the EMR serverless uses. 

Delta lake (<https://delta.io>) is an open-source storage framework that enables building a lake house architecture. One of the important features supported by delta lake is the checkpoint management for batch/streaming jobs that uses AWS S3 as a data lake. The most common approach to use Delta lake is via command line argument to run spark-submit command something like *"sparkSubmitParameters": "--packages io. delta:delta-core_2.12:1.2.1"*. This dynamically pulls the delta lake (via maven project) when the spark jobs run (ref. <https://docs.delta.io/latest/quick-start.html#pyspark-shell> ). The other approach is to use **pip install delta-spark==2.2.0** when python is used**.** However, both these approaches in production might not be possible as they require an active internet connection, necessary permissions on the production machine to download/install a library at run time in the EMR serverless application.

Our second use case is the installation of all custom libraries (in the form of jars etc.,) used by the code. We provide step by step walkthrough of how we build custom images addressing both the above scenarios, use the ECR to register our docker image, and finally use the docker image in the EMR Serverless.

*Step 1:*  Pre-requisites

*Step 2:*  Identify the base EMR Serverless Docker Image, packages/jars that need to be installed/downloaded, and prepare the custom docker Image.

*Step 3:*  Push the Docker Image to the ECR

*Step 4:* Create the EMR Serverless applications via

(a) Command using AWS CLI

(b) through settings in the UI when creating or updating the EMR serverless application.

## Step 1: Prerequisites to build a custom docker image:

* The latest version of the docker client
* The latest version of AWS CLI
* Verify the access to dependent repository from where resources (modules, code etc) might be downloaded.   

## **Step 2: Sample Docker file used to create custom EMRServerless image**

<!--StartFragment-->

*\# Refer AWS EMR documentation for the release version tag*\
*FROM public.ecr.aws/emr-serverless/spark/emr-6.9.0:20221108*

*USER root*

*\# Dependent JAR files*\
*RUN curl -O <https://repo1.maven.org/maven2/io/delta/delta-core_2.12/2.2.0/delta-core_2.12-2.2.0.jar>*\
*RUN curl -O <https://repo1.maven.org/maven2/io/delta/delta-storage/2.2.0/delta-storage-2.2.0.jar>*

*\# The base emr-image sets WORKDIR to /home/hadoop, hence the JAR files will be downloaded under /home/hadoop.*\
*\# Then these jars will be copied to /usr/lib/spark/jars which was set as SPARK_HOME by EMR base image.*\
*RUN cp /home/hadoop/delta-core_2.12–2.2.0.jar /usr/lib/spark/jars/*\
*RUN cp /home/hadoop/delta-storage-2.2.0.jar /usr/lib/spark/jars/*

*\# EMRS will run the image as hadoop*\
*USER hadoop:hadoop*

<!--EndFragment-->

## **Step 3: Pushing the docker image to the AWS ECR:**

Command to authenticate Docker to an AWS ECR public registry assuming region as us-east-1. As EMRServerless base docker image is present in ECR public registry, run below command before building your customized docker file.

<!--StartFragment-->

***aws ecr-public get-login-password — region us-east-1 — profile <profile_name_in_your_aws_credentials_file> | docker login — username AWS — password-stdin public.ecr.aws***

<!--EndFragment-->

Command to build docker image:

<!--StartFragment-->

***docker build -t local_docker_image_name:tag -f <docker_file_name> .***

<!--EndFragment-->

Command to tag locally built docker image in order to push to AWS ECR private registry:

<!--StartFragment-->

**docker tag local_docker_image_name:tag *[aws_account_id.dkr.ecr.region.amazonaws.com](http://aws_account_id.dkr.ecr.region.amazonaws.com)\*\****[/docker_image_name:](http://718515174980.dkr.ecr.us-east-1.amazonaws.com/emr-serverless-ci-examples:emr-serverless-6.9.0-V1)tag\*\*

<!--EndFragment-->

Command to authenticate Docker to an AWS ECR private registry assuming region as us-east-1. Run below command before pushing the docker image to AWS ECR private registry.

<!--StartFragment-->

***aws ecr get-login-password — region us-east-1 — profile <profile_name_in_your_aws_credentials_file> | docker login — username AWS — password-stdin [aws_account_id.dkr.ecr.region.amazonaws.com](http://aws_account_id.dkr.ecr.region.amazonaws.com)***

<!--EndFragment-->

        **Note:**

        1. When --profile option is not provided, then credentials will be picked from profile name <default> in the \~/.aws/credentials file. If you are using access credentials for different user, then include the profile section in \~/.aws/credentials files.

        2.  Example content of ~/.aws/credentials file:          

<!--StartFragment-->

\[default]\
aws_access_key_id =\
aws_secret_access_key =

\[testprofile]\
aws_access_key_id=\
aws_secret_access_key=

<!--EndFragment-->

Command to push docker image to AWS ECR private registry:

       **docker push *[aws_account_id.dkr.ecr.region.amazonaws.com](http://aws_account_id.dkr.ecr.region.amazonaws.com)\*\****[/docker_image_name:](http://718515174980.dkr.ecr.us-east-1.amazonaws.com/emr-serverless-ci-examples:emr-serverless-6.9.0-V1)tag\*\*

## **Step 4:  EMR Serverless using the custom Docker Image Created.**

There are two approaches for EMR Serverless to use the custom Image created

(a) via AWS CLA

(b) via EMR serverless application settings in AWS management console

### **4a) Via AWS CLI command to create simple EMRServerless application using custom docker image:**

AWS CLI reference for EMRServerless application management: <https://docs.aws.amazon.com/cli/latest/reference/emr-serverless/index.html>

<!--StartFragment-->

aws — region <region> emr-serverless create-application \
— release-label emr-6.9.0 \
— type “SPARK” \
— name emr-application-1 \
**— image-configuration ‘{ “imageUri”: “<your AWS account ID>.dkr.ecr.<region>.[amazonaws.com/<ecr_registry_name:](http://amazonaws.com/emr-serverless-ci-examples:emr-serverless-ci-ml)image_name>” }’**

<!--EndFragment-->

**Note:** Image URI can be copied from AWS ECR registry.

### **4b) Via EMR Serverless Settings in the EMR Management console**

##### **EMRServerless Custom Image Settings section in AWS EMR Serverless management console:**

![EMR Serverless Management Console Docker section](/img/customimagesettings-in-emrserverless.png)

##### Browse and select custom EMRServerless image from AWS ECR private registry in the same region:

![EMR Serverless Management Console to choose the Docker Image](/img/selectionofimagefromecr_registry.png)

### **Reference links to AWS documentations:**

* *Steps to build custom docker image for EMRServerless:* <https://aws.amazon.com/blogs/big-data/add-your-own-libraries-and-application-dependencies-to-spark-and-hive-on-amazon-emr-serverless-with-custom-images/>
* *How to pull docker image from AWS ECR registry:* <https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-pull-ecr-image.html>
* *How to authorize AWS ECR registry with docker client:* <https://docs.aws.amazon.com/AmazonECR/latest/userguide/registry_auth.html>
* *How to push docker image to AWS ECS registry:* <https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html>
* *AWS EMRServerless CLI reference:* <https://docs.aws.amazon.com/cli/latest/reference/emr-serverless/index.html>
* *How to customize image for multi CPU architecture:* <https://docs.aws.amazon.com/emr/latest/EMR-on-EKS-DevelopmentGuide/docker-custom-images-steps.html>

<!--EndFragment-->

## **About the Authors:**

![](/img/niranjan_2.jpg)

<!--StartFragment-->

D R Niranjan is a Senior software/Cloud application developer at HPE. Experienced in developing software and cloud applications for HPE Servers and Storage systems. Technically skilled in Python, Java, Scala, Spark programming, AWS, Dockers and Kubernetes, PgSQL/RDBMS. You can have a look at his LinkedIn profile here: <https://www.linkedin.com/in/niranjan-d-r/>

<!--EndFragment-->

![](/img/sagar-pic_2.jpg "sagar-nyamagouda@hpe.com")

Sagar Nyamagouda holds a  B.E(Information Science and Engineering) from BMS College of Engineering (BMSCE), Bengaluru and M.Tech in Software Systems from BITS Pilani. He is an experienced R&D Engineer working on Big Data Technologies and building AI/ML pipelines for give real time insights to customers. An AI/ML enthusiast. Currently working with HPE enabling advanced insights for DSCC - an HPE Flagship cloud offering.   LinkedIn Profile: www.linkedin.com/in/sagarny

![](/img/chirag_2.jpg "chirag.talreja@hpe.com")

Graduate from BITS Pilani, Pilani . Currently working as a Cloud Developer in HPE with over 6 years of experience in designing, developing, and implementing complex data processing pipelines . Experienced in microservice architecture,  big data tech stack like Apache Spark , Spark Streaming , SQL/NoSQL databases, Kafka, Core Java, Scala, python with  a good understanding of AWS platform. His linkedIn profile is available @ <https://www.linkedin.com/in/chiragtalreja29/>

![](/img/chinmay_2jpg.jpg "chinmay.chaturvedi@hpe.com")

Hello Everyone!! I am Chinmay , currently working in HPE as a Cloud Engineer. I have expertise in  various technologies of Big  Data Processing  including building ML/AI platforms, data engineering and processing out of which most recently are related to spark, AWS , SQL etc. Apart from work I like playing badminton and fond of going on trips. LinkedIn Profile: <https://www.linkedin.com/in/chinmay-chaturvedi-707886138>

[](https://www.linkedin.com/in/chinmay-chaturvedi-707886138)

![](/img/whatsapp-image-2021-11-02-at-10.01.24-am-1-.jpg)

Kalapriya Kannan currently works with HPE on cloud enablement of storage analytics.  She holds a Ph.D from IISc She has authored around 60 peer reviewed international conference papers and over a 100 disclosure submissions for patent filing out of which has been 65 granted patents.    Her interest are in the area of distributed and parallel system and currently she is working in processing of big data for analytical insights. Her linkedIn profile:  <https://www.linkedin.com/in/kalapriya-kannan-0862b55b>

![](/img/roopali_2.jpg)

<!--StartFragment-->

19 years of work experience in systems software development in the areas of operating system, file system and cloud technologies. Played various roles starting from developer to lead expert and product owner. In my current role, I am responsible for functional delivery and people management of Data Observability Analytics Project.

<!--EndFragment-->