---
title: Accessing HPE Ezmeral Data Fabric S3 Storage from Spring Boot S3 Micro
  Service deployed in K3S cluster
date: 2021-09-13T08:13:40.734Z
featuredBlog: true
priority: 0
author: Kiran Kumar Mavatoor
authorimage: /img/hpe-dev-grommet-gremlin-rockin.svg
tags:
  - K3S
  - Spring Boot
  - HPE Ezmeral Data Fabric S3 Storage
  - hpe-ezmeral-data-fabric
  - mapr
  - Quarkus
---
Object Store is a S3 storage service offered by HPE Ezmeral Data Fabric Platform that offers scalable, secure, and well performing object storage. In this article, we will discuss as how to access HPE Ezmeral Data Fabric Object Store (S3) using Spring Boot S3 Micro Service application deployed in [K3S cluster](https://k3s.io/) and perform basic S3 operations like upload, list, delete etc. Below diagram gives the architecture overview 



![](/img/hpe-ezmeral-data-fabric-s3-springboot-k3s.png)

Figure 1:  Architecture overview of Spring Boot S3 Micro Service on K3S with HPE Data Fabric S3 Storage as back end.

The brief description of technology stack used is described below sections :

**Data Fabric Object Storage**

The Object Store with S3-Compatible API stores data generated through multiple data protocols, such as NFS, POSIX, S3, and HDFS. Data in the Object Store is accessible through S3 API requests. The Object Store manages all inbound S3 API requests to store data in or retrieve data from an HPE Ezmeral Data Fabric cluster. More details can be found [here.](<https://docs.datafabric.hpe.com/62/MapRObjectStore/MapRObjectStorewithS3-compatibleAPI.html>)

**K3S**

K3S is Lightweight Kubernetes. Easy to install, half the memory, all in a binary of less than 100 MB. Its Great for Edge and IOT use cases. More information on K3S can be found at <https://rancher.com/docs/k3s/latest/en/> . Follow the steps as mentioned in [quick start guide](https://rancher.com/docs/k3s/latest/en/quick-start/) [](https://rancher.com/docs/k3s/latest/en/quick-start/) for installation of K3S cluster. 

**Spring Boot**

Spring Boot is an open source Java-based framework used to create a micro Service. Many Real world applications are written in Spring Boot for faster development and better maintainability. More information can be found at** <https://spring.io/projects/spring-boot>**

Note: We can move the Spring Boot application to Quarkus with no change in code.  Moving code to Quarkus will reduce the footprint of Spring Boot application. More information can be found at [quarkus site](<https://quarkus.io/blog/quarkus-for-spring-developers/>) [](https://quarkus.io/blog/quarkus-for-spring-developers/)

In this blog, we will checkout Spring Boot application from Git , customise it and execute. 

**Application Prerequisites**

<!--\\\\[if !supportLists]-->1.      <!--\\\\[endif]-->K3S cluster must be accessible. Note down the control plan node details. This information is required to deploy the Spring Boot application.

<!--\\\\[if !supportLists]-->      <!--\\\\[endif]-->

2.      Access the HPE Data Fabric Object Store service UI running on port 9000. For example URL  - https://FQDN:9000/ .  Note down the access key and secret key. Default access key and secret key is “minioadmin” and “minioadmin” respectively. It is advised to change the default values.

<!--\\\\[if !supportLists]-->3.      <!--\\\\[endif]-->Java 11 , Apache Maven 3.8+ , Docker Client.

**Build and Install Steps**

<!--\\\\[if !supportLists]-->1.    <!--\\\\[endif]-->Check out the code from git <https://github.hpe.com/kiran-mavatoor/df-s3-springboot-k3s-demo>  and go the project directory.

<!--\\\\[if !supportLists]-->

2.    <!--\\\\[endif]-->Copy the ssl_usertruststore.p12 from the HPE Data Fabric cluster into certs folder under project directory. The ssl_usertruststore.p12 file is located at /opt/mapr/conf directory in cluster node. The password for p12 can be copied from “ssl.client.truststore.password” property value in /opt/mapr/conf/ssl-client.xml .

<!--\\\\[if !supportLists]-->

3.    <!--\\\\[endif]-->From project directory, open resources/application.properties. Change the key values as per your environment. 

<!--\\\\[if !supportLists]-->

4.    <!--\\\\[endif]-->Execute “mvn clean install” .

<!--\\\\[if !supportLists]-->

5.    <!--\\\\[endif]-->The distributable is available in target/df-s3-springboot-k3s-demo-1.0-SNAPSHOT.jar .

<!--\\\\[if !supportLists]-->6.    <!--\\\\[endif]-->Edit the DockerFile located in project directory. The value of 

“-Djavax.net.ssl.trustStorePassword”  must be same as the value of  “ssl.client.truststore.password” obtained from step 2. 

Note:- This value can be configured using config-map.yaml in K3S cluster.

<!--\\\\[if !supportLists]-->7.    <!--\\\\[endif]-->Execute below docker commands to build docker image and push it to docker hub. 

Note:- We can use podman instead of docker to create images. More information on podman can be obtained from [here](<https://developers.redhat.com/blog/2020/11/19/transitioning-from-docker-to-podman#transition_to_the_podman_cli>) [](https://developers.redhat.com/blog/2020/11/19/transitioning-from-docker-to-podman#transition_to_the_podman_cli)

![]()

|     |
| --- |
|     |

<!--\\\\[if !supportLists]-->8.    <!--\\\\[endif]-->Create below df-s3-springboot-k3s-demo.yaml file for deploying the executable in K3S cluster. Sample yaml file is given in project directory. Please replace <dockerhub userid> with valid id.

|     |
| --- |
|     |

<!--\\\\[if !supportLists]-->9.    <!--\\\\[endif]-->Before deploying it in Kubernetes cluster, we can validate the docker or podman image by running the image. 

```

```

```

```

**Deploying in K3S cluster**

<!--\\\\[if !supportLists]-->1.    <!--\\\\[endif]-->Login to control plane node of K3S cluster. Create/Copy the df-s3-springboot-k3s-demo.yaml  to the node.

<!--\\\\[if !supportLists]-->

2.    <!--\\\\[endif]-->Execute “kubectl apply -f df-s3-springboot-k3s-demo.yaml”. if required we can specify the namespace option.

<!--\\\\[if !supportLists]-->

3.    <!--\\\\[endif]-->Check the pod creation status by using command “kubectl get pods -l app=df-s3-springboot-k3s-demo -o wide”

<!--\\\\[if !supportLists]-->

4.    <!--\\\\[endif]-->Verify if the services are properly deployed by using command “kubectl get service df-s3-springboot-k3s-demo-service”

Accessing the Swagger UI from the pod

<!--\\\\[if !supportLists]-->1.    <!--\\\\[endif]-->Connect to the pod http://pod-ip:8000/swagger-ui.html

<!--\\\\[if !supportLists]-->

2.    <!--\\\\[endif]-->Verify the services exposed in the Swagger-UI