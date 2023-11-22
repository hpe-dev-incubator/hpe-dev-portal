---
title: "Getting Started with MapR Client Container"
date: 2021-02-13T06:58:44.317Z
author: Tugdual Grall 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR"]
authorimage: "/img/blogs/Avatar2.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019 may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
"authorDisplayName": "Tugdual Grall",
"publish": "2017-02-07T06:00:00.000Z",
"tags": "streaming"
```

---

## Introduction

The MapR Persistent Application Client Container (PACC) is a Docker-based container image that includes a container-optimized MapR client. The PACC provides secure access to MapR Data Platform services, including MapR XD, MapR Database, and MapR Event Store. The PACC makes it fast and easy to run containerized applications that access data in MapR. 

In this article, you will learn how you can easily deploy and run your MapR application in the container.

## About the application

This sample application is made of two services:

*   "MapR Sensor" is a Java application that captures the information about the computer (CPU, Memory, ...) and publishes the data on a topic every 500ms.
*   "MapR Web Application" is a Web application, powered by Jetty, that prints the messages from this topic into a Web page. Jetty HTTP Request log files are saved into MapR XD. This is interesting to have a centralized log management but also to run some processing or analytics jobs using Apache Spark or Drill.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/1-1613199562954.png)

## Prerequisite

*   Docker 1.12.5 or later
*   Apache Maven 3.x or later
*   A Git client

## Build and Deploy the Application using Docker

Clone the application from Github using the following command:

```bash
$ git clone https://github.com/mapr-demos/mapr-pacc-sample

```

Let's look at the project structure:

```
mapr-pacc-sample
├── pom.xml
├── sensor-service
│   ├── Dockerfile
│   ├── docker.env
│   ├── pom.xml
│   ├── run.sh
│   └── src
└── webserver-service
    ├── Dockerfile
    ├── docker.env
    ├── pom.xml
    ├── run.sh
    └── src
```

The project is made of two modules: sensor-service and webserver-service, part of the Apache Maven project.

Each of the projects contains a Dockerfile defining a custom image.

## Create Custom Docker Files

The Docker files should be configured to:

1.  Install and configure the MapR Client. This is done by building the container from the MapR PACC image.
2.  Deploy the Java application. This is done by copying the Jar into the container.
3.  Run the Java application. This is done by simply calling the Java command.

**Docker file for Sensor/Producer**

Open the file /mapr-pacc-sample/sensor-service/Dockerfile:

```bash
FROM maprtech/pacc:5.2.0_2.0_centos7

# Create a directory for your MapR Application and copy the Application
RUN mkdir -p /usr/share/mapr-apps/
COPY ./target/sensor-service-1.0-SNAPSHOT.jar /usr/share/mapr-apps/sensor-service.jar
COPY run.sh /usr/share/mapr-apps/run.sh
RUN chmod +x /usr/share/mapr-apps/run.sh

CMD ["start", "/usr/share/mapr-apps/run.sh", "/apps/sensors:computer"]

```

**Docker file for Web/Consumer**

Open the file /mapr-pacc-sample/webserver-service/Dockerfile:

```bash
FROM maprtech/pacc:5.2.0_2.0_centos7

EXPOSE 8080

# Create a directory for your MapR Application and copy the Application
RUN mkdir -p /usr/share/mapr-apps/
COPY ./target/webserver-service-1.0-SNAPSHOT-jar-with-dependencies.jar /usr/share/mapr-apps/webserver-service.jar
COPY run.sh /usr/share/mapr-apps/run.sh
RUN chmod +x /usr/share/mapr-apps/run.sh

CMD ["start", "/usr/share/mapr-apps/run.sh", "/apps/sensors:computer" , "/mapr/my.cluster.com/apps/logs/"]

```

The docker files are based on the MapR pacc:5.2.0_2.0_centos7 image. The application will automatically inherit from the various components installed by this container: MapR Database and Streams Client, POSIX Client for Containers, and Java 8.

Both Docker files are defined with the following steps:

*   Create a new directory /usr/share/mapr-apps/ to deploy the application 
*   Copy the application from maven target directory into this directory
*   Copy the run.sh file to this folder and make it executable
*   For the Web service the HTTP port 8080 is exposed
*   The run.sh is automatically started using the CMD command

The run.sh script will create /apps/logs using mount point and will start the Java application when the container starts.

Now that you understand how to create your Dockerfile based on MapR PACC, let's build and run the application services.

**Build and Run Docker images**

Before starting the application, you must create a new MapR Event Store and new folder in MapR Distributed File and Object Store. Execute the following steps on MapR cluster:

**1- Create a MapR Stream and Topic**

On your MapR cluster, using a terminal window, run the following commands to create the /apps/sensors:computer topic:

```bash
$ maprcli stream create -path /apps/sensors -produceperm p -consumeperm p -topicperm p

$ maprcli stream topic create -path /apps/sensors -topic computer
```

**2- Monitor the MapR Stream Topic**

Start the Kafka Consumer Console to monitor the messages in the /apps/sensors:computer topic; in the terminal window of your MapR Cluster run:

```bash
$ /opt/mapr/kafka/kafka-0.9.0/bin/kafka-console-consumer.sh --new-consumer --bootstrap-server this.will.be.ignored:9092 --topic /apps/sensors:computer

```

>Note: You'll need to install mapr-kafka package on cluster to execute kafka-console-*.sh commands.

**Application "Sensor Producer"**

**1- Build the new customer image**

Build a new custom image for the sensor producer using the following commands:

```bash
$ cd sensor-service

$ mvn clean package

$ docker build -t mapr-sensor-producer .
```

**2- Run the new container**

Run the container with the following command:

```bash
$ docker run -it -e MAPR_CLDB_HOSTS=192.168.99.18 -e MAPR_CLUSTER=my.cluster.com -e MAPR_CONTAINER_USER=mapr --name producer -i -t mapr-sensor-producer

```

This command creates a new container based on the mapr-sensor-producer image that we just built. The command use the following mandatory variables:

*   The name of the container is producer
*   MAPR_CLDB_HOSTS: the list of CLDB hosts of your MapR cluster
*   MAPR_CLUSTER: the name of the cluster
*   MAPR_CONTAINER_USER : the user that will be used to run the application

These two variables are used to configure the MapR Client embedded in the container.

The Java application is automatically started by Docker, and you should see messages in the Kafka Console.

You can start/stop the container, using the following command:

```bash
$ docker start producer

$ docker stop producer
```

**Application "Web Consumer"**

**1- Build the new customer image**

Build a new custom image for the sensor producer, using the following commands:

```bash
$ cd webserver-service

$ mvn clean package

$ docker build -t mapr-web-consumer .

```

**2- Run the new container**

Run the container with the following command:

```bash
$ docker run -it --privileged --cap-add SYS_ADMIN --cap-add SYS_RESOURCE --device /dev/fuse -e MAPR_CLDB_HOSTS=192.168.99.18 -e MAPR_CLUSTER=my.cluster.com -e MAPR_CONTAINER_USER=mapr -e MAPR_MOUNT_PATH=/mapr -p 8080:8080 --device /dev/fuse --name web -i -t mapr-web-consumer

```

This command creates a new container based on the mapr-web-consumer image that we just built. The command use the following variables:

*   The name of the container is web
*   The -p 8080:8080 is used to map the HTTP port from the container to your host
*   --device /dev/fuse is used to add a fuse client to the container
*   --privileged --cap-add SYS_ADMIN --cap-add SYS_RESOURCE are needed for the /dev/fuse to work
*   MAPR_CLDB_HOSTS: the list of CLDB hosts of your MapR cluster
*   MAPR_CLUSTER: the name of the cluster
*   MAPR_CONTAINER_USER : the user that will be used to run the application
*   MAPR_MOUNT_PATH: the mount path of MapR FUSE client, providing direct access to MapR XD

This container starts the Java application that is an embedded Jetty. You can access the Web application from your host, using `http://localhost:8080`.

This application is a simple web page that show the last messages published to the topic. This page is automatically refreshed every 5 seconds.

The Jetty server is saving the HTTP Request logs directly in MapR XD, using the Fuse client; you can look at the logs in the /apps/logs folder of your MapR cluster.

You can start/stop the container, using the following command:

```bash
$ docker start web

$ docker stop web
```

## Conclusion

In this article, you have learned how to use the MapR PACC to deploy and run applications. The security on the MapR cluster used by this sample has not been enabled; if your cluster is secured, you can use additional MapR configuration to authenticate your services using security token.