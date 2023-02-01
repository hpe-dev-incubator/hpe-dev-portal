---
title: "Handling application performance monitoring on HPE GreenLake for Private
  Cloud Enterprise – Part 2: App monitoring using Apache SkyWalking"
date: 2023-01-10T07:31:55.711Z
author: Guoping Jia
authorimage: /img/guoping.png
tags:
  - hpe-greenlake
  - hpe-greenlake-for-private-cloud-enterprise
  - Kubernetes
  - application performance monitoring
  - Apache SkyWalking
---
## Introduction

[HPE GreenLake for Private Cloud Enterprise](https://www.hpe.com/us/en/greenlake/private-cloud-enterprise.html) delivers a modern private cloud to support your app workloads with bare metal, containers, and virtual machines (VMs) running in any combination across your edges, colocations, and data centers. It combines self-service resource access for developers with consumption and performance transparency for IT. Within this modern application environment, having a robust application performance monitoring (APM) tool is becoming essential. It can help IT professionals to ensure that deployed applications meet the performance, reliability and valuable user experience required by developers, partners and customers.

In [my first blog post](https://developer.hpe.com/blog/get-started-with-application-performance-monitoring-tools-overview/), I walked through some of the best APM tools, describing their key features, strengths, and weaknesses. In this blog post, using one of the APM tools I covered in my previous post, I will describe, in detail, the process of how to set it up in HPE GreenLake for Private Cloud Enterprise for monitoring and alerting customer applications. 

## Apache SkyWalking

[Apache SkyWalking](https://skywalking.apache.org/) is an open source APM tool with capabilities for monitoring, tracing and diagnosing distributed systems. It’s especially designed for microservices, cloud native and container-based architectures. 

Apache SkyWalking provides a list of agents to be used for building *Java*, *.NET Core*, *PHP*, *NodeJS*, *Golang*, *LUA*, *Rust* and *C++* apps. It provides tracing, metrics analysis, alerting, service mesh observability and visualization.

Apache SkyWalking is lightweight and scalable. It can be easily set up as a *self-managed* APM tool within an on-premises data center. This avoids leasing customer data to third party services and matches well with the strict security parameters of HPE GreenLake for Private Cloud environment. 

## Set up Apache SkyWalking for application monitoring

I will take you through setting up Apache SkyWalking as a *self-managed* APM tool within the Kubernetes cluster created in HPE GreenLake for Private Cloud Enterprise. By setting up the APM tool within this environment, it can benefit from the security features of HPE GreenLake. 

### Prerequisites

Before starting, make sure you have the following requirements:

* A Kubernetes cluster, being provisioned in HPE GreenLake for Private Cloud Enterprise
* The *kubectl* CLI tool, version 1.23 or later, together with the *kubeconfig* files for accessing the Kubernetes cluster 
* The *[Helm](https://helm.sh/docs/intro/install/)* CLI tool, version 3.8.1 or later 

### Deploy Apache SkyWalking

Install Apache SkyWalking using Helm charts with *elasticsearch* as storage:

```markdown
$ git clone https://github.com/apache/skywalking-kubernetes 
$ cd skywalking-kubernetes/chart
$ helm repo add elastic https://helm.elastic.co
$ helm dep up skywalking
$﻿ kubectl create ns skywalking
$ helm install skywalking skywalking –n skywalking \
--set oap.image.tag=9.2.0 \
--set oap.storageType=elasticsearch \
--set ui.image.tag=9.2.0 \
--set elasticsearch.imageTag=7.17.1 \
--set elasticsearch.persistence.enabled=true \
--set elasticsearch.sysctlInitContainer.enabled=false
```

After running the above commands, Apache SkyWalking is installed on the Kubernetes cluster's namespace *skywalking*. The option *elasticsearch.persistence.enabled=true* in the above Helm install command creates the *elasticsearch* as the `StatefulSet` object, running a pod on each worker node. The command runs the Apache SkyWalking Observability Analysis Platform (OAP) with replicas as 2 to provide high availability. 

It should be noted that the last option *elasticsearch.sysctlInitContainer.enabled=false* in the above Helm install command is necessary. Otherwise, the command will try to set up *vm.max_map_count* using a privileged container during *elasticsearch* installation. Running privileged containers leaves a large chance that an attacker will be able to run code as root. There is one *PodSecurityPolicy*, **`psp-privileged-container`**, which has been pre-deployed in K8s clusters to deny privileged container running in the HPE GreenLake for Private Cloud Enterprise environment. This policy will fail the Helm install. 

You can check the detailed Apache SkyWalking installation by typing the following *kubectl* command:

```markdown
$ kubectl get all -n skywalking
NAME                                  READY   STATUS      RESTARTS   AGE
pod/elasticsearch-master-0            1/1     Running     0          8m7s
pod/elasticsearch-master-1            1/1     Running     0          8m7s
pod/elasticsearch-master-2            1/1     Running     0          8m7s
pod/skywalking-es-init-m9t5c          0/1     Completed   0          8m7s
pod/skywalking-oap-7f757c7668-nq2cz   1/1     Running     0          8m8s
pod/skywalking-oap-7f757c7668-q8z7m   1/1     Running     0          8m8s
pod/skywalking-ui-549dc5989f-jq9b9    1/1     Running     0          8m8s

NAME                                    TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)               AGE
service/elasticsearch-master            ClusterIP   10.110.35.173    <none>        9200/TCP,9300/TCP     8m5s
service/elasticsearch-master-headless   ClusterIP   None             <none>        9200/TCP,9300/TCP     8m5s
service/skywalking-oap                  ClusterIP   10.108.29.84     <none>        11800/TCP,12800/TCP   8m5s
service/skywalking-ui                   ClusterIP   10.102.186.131   <none>        80/TCP                8m5s

NAME                             READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/skywalking-oap   2/2     2            2           8m6s
deployment.apps/skywalking-ui    1/1     1            1           8m6s

NAME                                        DESIRED   CURRENT   READY   AGE
replicaset.apps/skywalking-oap-7f757c7668   2         2         2       8m9s
replicaset.apps/skywalking-ui-549dc5989f    1         1         1       8m9s

NAME                                    READY   AGE
statefulset.apps/elasticsearch-master   3/3     8m5s

NAME                           COMPLETIONS   DURATION   AGE
job.batch/skywalking-es-init   1/1           7m27s      8m6s
```

You can edit the deployed SkyWalking UI service *skywalking_ui* and change its type from *ClusterIP* to *NodePort*. The service will be automatically mapped to a gateway host with an assigned port.

```markdown
$ k edit service/skywalking-ui -n skywalking

$ k describe service/skywalking-ui -n skywalking 
Name:                     skywalking-ui
Namespace:                skywalking
Labels:                   app=skywalking
                          app.kubernetes.io/managed-by=Helm
                          chart=skywalking-4.2.0
                          component=ui
                          heritage=Helm
                          hpecp.hpe.com/hpecp-internal-gateway=true
                          release=skywalking
Annotations:              hpecp-internal-gateway/80: gl2-caas.gl-hpe.local:10037
                          meta.helm.sh/release-name: skywalking
                          meta.helm.sh/release-namespace: skywalking
Selector:                 app=skywalking,component=ui,release=skywalking
Type:                     NodePort
IP:                       10.102.186.131
Port:                     <unset>  80/TCP
TargetPort:               8080/TCP
NodePort:                 <unset>  32748/TCP
Endpoints:                10.192.7.25:8080
Session Affinity:         None
External Traffic Policy:  Cluster
Events:                   <none>
```

As shown in the ***Annotations*** section of the service description above, the SkyWalking UI can then be accessed in the browser by typing the address *gl2-caas.gl-hpe.local:10037*: 

![](/img/sw-ui.png)

### Deploy a sample application: *SpringBoot*

A﻿s my first demo application, I will create a *SpingBoot* Web app that provides a REST endpoint **/message** to print some nice message. Then, I will generate a *jar* package using the [Apache Maven](https://maven.apache.org/what-is-maven.html) command *mvn* with the *pom.xml* file:   
 
```markdown
├── Dockerfile
├── Dockerfile.agentless
├── pom.xml
├── README.md
├── src
│   ├── main
│   └── test
└── target
    ├── springboot-k8s-demo.jar
    └── test-classes

$﻿ cat pom.xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>2.6.1</version>
		<relativePath/> <!-- lookup parent from repository -->
	</parent>
	<groupId>com.javatechie</groupId>
	<artifactId>springboot-k8s-demo</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>springboot-k8s-demo</name>
	<description>Demo project for Spring Boot</description>
	<properties>
		<java.version>1.8</java.version>
	</properties>
	<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>

		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>
	</dependencies>

	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
			</plugin>
		</plugins>
		<finalName>springboot-k8s-demo</finalName>
	</build>

</project>

$﻿ mvn compile
$﻿ mvn package
$ ls target/springboot-k8s-demo.jar
target/springboot-k8s-demo.jar
```

You can see the *jar* package *springboot-k8s-demo.jar* is created in the *target* folder. B﻿y building a *Docker* image using this generated *jar* file, the *SpringBoot* web app can be easily deployed as a containerized application in the Kubernetes cluster.

Apache SkyWalking provides a list of agents for instrumenting applications. A specific agent per programming language can be used to build a corresponding service that collects application data and exports them to the SkyWalking OAP server.   

![](/img/sw-agents.png)

I﻿n order to monitor the sample  *SpringBoot* web app from Apache SkyWalking, download the Java agent and rebuild the image.

![](/img/java-agent.png)

H﻿ere is the *Dockerfile* for building the image with the Java agent:

```markdown
$ cat Dockerfile
FROM adoptopenjdk:11-jre-hotspot
# copy extracted java agent folder from the downloaded apache skywalking archive
ADD agent /opt/agent
# copy the app jar file
EXPOSE 8080
ADD target/springboot-k8s-demo.jar /app/springboot-k8s-demo.jar
WORKDIR /app
ENTRYPOINT ["java","-javaagent:/opt/agent/skywalking-agent.jar=agent.namespace=default,agent.service_name=springboot-k8s-app,collector.backend_service=skywalking-oap.skywalking.svc.cluster.local:11800, plugin.jdbc.trace_sql_parameters = true,profile.active=true","-jar","/app/springboot-k8s-app.jar"]
```

### Monitor SpringBoot application from SkyWalking UI

After building the Docker image *guopingjia/springboot-k8s-demo:pce* and pushing it to the *DockerHub* registry, deploy the *SpringBoot* web app in the Kubernetes cluster with the *deployment.yaml* manifest file:

```markdown
$﻿ cat deployment.yaml
apiVersion: apps/v1
kind: Deployment 
metadata:
  name: springboot-k8s-demo
spec:
  selector:
    matchLabels:
      app: springboot-k8s-demo
  replicas: 1  
  template:
    metadata:
      labels:
        app: springboot-k8s-demo
    spec:
      containers:
        - name: springboot-k8s-demo
          image: docker.io/guopingjia/springboot-k8s-demo:pce

          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 8080

$﻿ kubectl apply -f deployment.yaml
```

Upon web app deployment, the built-in Java agent will start collecting application data and posting it to the SkyWalking OAP. All the application metrics will be available in the SkyWalking UI, under the *General Service* tab:

![](/img/java-app.png)

Below is the *SpringBoot* web app topology map:

![](/img/java-app-map.png)

### Deploy a multi-tier application

A﻿s my second demo application, I will deploy a multi-tier *music* application, available as part of [Apache SkyWalking showcase application](https://github.com/apache/skywalking-showcase). This multi-tier music application consists of a frontend app server and its UI, a backend gateway service, a recommendation service and songs service, together with an *H2* database. Each microservice is implemented with a different programming language, e.g. *NodeJS*, *React*, *Java Spring*, *Python*, etc. 

![](/img/multl-tier-app-music.png)

I﻿n order to monitor this multi-tier *music* application from Apache SkyWalking, you need to pick up the SkyWalking agent per programming language and rebuild the corresponding service to collect and send application metrics to the SkyWalking OAP server.

Y﻿ou can rebuild the *Docker* image per service using the agent version file ***Dockerfile*** in each service's folder from the multi-tier *music* application repo:

```markdown
├── app
│   ├── Dockerfile
│   ├── Dockerfile.agentless
│   ├── Makefile
│   ├── package.json
│   ├── package-lock.json
│   ├── server
│   └── ui
├── gateway-service
│   ├── build.gradle
│   ├── Dockerfile
│   ├── Dockerfile.agentless
│   ├── gradle
│   ├── gradle.properties
│   ├── gradlew
│   ├── gradlew.bat
│   ├── Makefile
│   ├── settings.gradle
│   └── src
├── recommendation-service
│   ├── Dockerfile
│   ├── Dockerfile.agentless
│   ├── Makefile
│   ├── requirements.txt
│   └── src
└── songs-service
    ├── build.gradle
    ├── Dockerfile
    ├── Dockerfile.agentless
    ├── gradle
    ├── gradle.properties
    ├── gradlew
    ├── gradlew.bat
    ├── Makefile
    ├── settings.gradle
    └── src
```

A﻿fter image files are rebuilt with the agents, the multi-tier *music* application can be deployed in the Kubernetes cluster:

```markdown
$ envsubst < resources.yaml | kubectl create -f -
service/gateway created
deployment.apps/gateway-deployment created
service/songs created
deployment.apps/songs-deployment created
service/rcmd created
deployment.apps/recommendation-deployment created
service/app created
deployment.apps/app-deployment created
deployment.apps/loadgen-deployment created
```

### Monitor multi-tier application from SkyWalking UI

When the multi-tier *music* app gets deployed, the agents built with each microservice will start collecting application data and post it to the SkyWalking OAP. The multi-tier *music* application metrics will be available in the SkyWalking UI, under the *General Service* tab:

![](/img/multl-tier-app.png)

Below is the multi-tier *music* application topology map:

![](/img/multl-tier-app-map.png)

You can also check the following multi-tier *music* application trace page. It's very helpful when you debug any performance issue in the application.

![](/img/sw-app-trace.png)

### Application alerting

Apache SkyWalking provides an alerting mechanism to measure application performance according to a list of pre-defined metrics, e.g., *service_resp_time*, *database_access_resp_time*, and *service_sla*. It will trigger alerting when some metrics reach pre-defined thresholds. You can define new metrics using Observability Analysis Language (OAL) or customize the existing metrics with new thresholds. 

Here you can see the alarms page from SkyWalking UI showing all the triggered alerts for deployed multi-tier *music* application: 

![](/img/sw-app-alarms.png)

T﻿he alarms page shows *Successful rate of service agent::app is lower than 80% in 2 minutes of last 10 minutes*. It indicates an issue from the frontend app server in the multi-tier *music* application.

A﻿pache SkyWalking configures the alerting using a collection of alerting rules located in */skywalking/config/alarm-settings.yml* from the SkyWalking OAP pod. You can check the content by running the following command:

```markdown
$ kukectl exec pod/skywalking-skywalking-helm-oap-bfb57fbf8-5g7k7 -n skywalking -it -- cat /skywalking/config/alarm-settings.yml 
```

When comparing it to the output of the *alarm-settings.yml*, you can see the alerts from the alarms page are triggered by the following metric alerting rule *service\_sla*:  

```markdown
  service_sla_rule:
    # Metrics value need to be long, double or int
    metrics-name: service_sla
    op: "<"
    threshold: 8000
    # The length of time to evaluate the metrics
    period: 10
    # How many times after the metrics match the condition, will trigger alarm
    count: 2
    # How many times of checks, the alarm keeps silence after alarm triggered, default as same as period.
    silence-period: 3
    message: Successful rate of service {name} is lower than 80% in 2 minutes of last 10 minutes
```

You can go to the frontend app by clicking the service `agent::app` from SkyWalking UI Service page. From the below service `agent::app` overview page, it shows **Success Rate 66.66%**. 

![](/img/sw-svc-app-overview.png)

You may check further the service's trace page and try to figure out the root cause for this issue.

![](/img/sw-svc-app-trace.png)

## Conclusion

In this blog post, I used the Apache SkyWalking application performance monitoring (APM) tool and explained in detail how to set it up as a *self-managed* environment in HPE GreenLake for Private Cloud Enterprise to be used for monitoring and alerting applications. Using the instrumentation of multiple supported agents from Apache SkyWalking, the application workloads can be easily monitored through the integrated Apache SkyWalking UI, with a nice application topology map, tracing details and real-time alarms for any application performance issues.  

I﻿n [the next blog post of the series](https://developer.hpe.com/blog/set-up-apache-skywalking-for-k8s-monitoring-in-hpe-greenlake-for-private-cloud-enterprise/) , I will show you how to use the Apache SkyWalking APM tool for monitoring of Kubernetes clusters provisioned on HPE GreenLake for Private Cloud Enterprise.