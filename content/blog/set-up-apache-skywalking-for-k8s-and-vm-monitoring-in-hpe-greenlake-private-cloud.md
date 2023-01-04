---
title: Set up Apache SkyWalking for application monitoring in HPE GreenLake for
  Private Cloud Enterprise
date: 2023-01-04T07:31:55.711Z
author: Guoping Jia
authorimage: /img/guoping.png
tags:
  - hpe-greenlake, kubernetes, application performance monitoring, Apache
    SkyWalking
---
## Introduction

[HPE GreenLake for Private Cloud Enterprise](https://www.hpe.com/us/en/greenlake/private-cloud-enterprise.html) delivers a modern private cloud to support your app workloads with bare metal, containers, and virtual machines (VMs) running in any combination across your edges, colocations, and data centers. It combines self-service resource access for developers with consumption and performance transparency for IT. Within this modern application environment, having a robust application performance monitoring (APM) tool is becoming essential. It can help IT professionals to ensure that deployed applications meet the performance, reliability and valuable user experience required by developers, partners and customers.

In [the first blog post](https://developer.hpe.com/blog/get-started-with-application-performance-monitoring-tools-overview/), we walked through some of the best APM tools, described their key features and discussed in details their strengths and weaknesses.

In this blog post, we will start choosing one APM tool,  *Apache SkyWalking*, and describe the detailed process how to set it up in HPE GreenLake for Private Cloud Enterprise for monitoring and alerting customer applications. 

## Apache SkyWalking

[Apache SkyWalking](https://skywalking.apache.org/) is an open source APM tool with capabilities for monitoring, tracing and diagnosing distributed system. It’s especially designed for microservices, cloud native and container-based architectures. 

Apache SkyWalking provides a list of agents to be used for building *Java*, *.NET Core*, *PHP*, *NodeJS*, *Golang*, *LUA*, *Rust* and *C++* apps. It provides tracing, metrics analysis, alerting, service mesh observability and visualization.

Apache SkyWalking is lightweight and scalable. It can be easily set up as a *self-managed* APM tool within an on-premises data center. This avoids leasing customer data to third party services and matches well with the strict security restriction in HPE GreenLake for Private Cloud Enterprise environment. 

## Set up Apache SkyWalking for Application Monitoring

We will take the approach to setting up the Apache SkyWalking as a *self-managed* APM tool within the Kubernetes cluster created in HPE GreenLake for Private Cloud Enterprise. This mainly takes into account the security concerns in HPE GreenLake product environment. 

### Prerequisites

Before we start, make sure we meet the following requirements:

* A Kubernetes cluster, being provisioned in HPE GreenLake for Private Cloud Enterprise;
* The *kubectl* CLI tool, version 1.23 or later, together with the *kubeconfig* files for accessing the Kubernetes cluster; 
* The *[Helm](https://helm.sh/docs/intro/install/)* CLI tool, version 3.8.1 or later. 

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

After running above commands, t﻿he Apache SkyWalking is installed to the Kubernetes cluster's namespace *skywalking*. It creates the *elasticsearch* as the `StatefulSet`, running a pod on each worker node. It runs the Apache SkyWalking OAP with replicas as 2 to provide high availability. 

It should be noted that the last option *elasticsearch.sysctlInitContainer.enabled=false* is necessary. Otherwise, it will try to set up *vm.max_map_count* using a privileged container during *elasticsearch* installation. It will violate the existing *PodSecurityPolicy* deployed in the HPE GreenLake environment. It therefore will fail the Helm install. 

We can check the detailed Apache SkyWalking installation by typing the following *kubectl* command:

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

We can edit the deployed SkyWalking UI service *skywalking_ui* and change its type from *ClusterIP* to *NodePort*. The service will be automatically mapped to gateway host with an assigned port.

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

T﻿he SkyWalking UI can then be accessed in the browser by typing the address *gl2-caas.gl-hpe.local:10037*: 

![](/img/sw-ui.png)

### Deploy a Sample SpringBoot Application

A﻿s the first demo application, create a *SpingBoot* Web app that provides a REST endpoint **/message** to print some nice message. Then generate a *jar* file *springboot-k8s-demo.jar* to the target folder:

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
```

B﻿y building a *Docker* image using the generated *jar* file, this *SpringBoot* app can be easily deployed as a containerized application to the Kubernetes cluster.

Apache SkyWalking provides a list of agents for instrumenting applications. A specific agent per programming language can be used for building into corresponding service which collects application data and exports them to the SkyWalking OAP server.   

![](/img/sw-agents.png)

I﻿n order to monitor the sample  *SpringBoot* Web app from Apache SkyWalking, we need to download the Java agent and rebuild the image.

![](/img/java-agent.png)

H﻿ere is the *Dockerfile* for building the image with Java agent:

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

### Monitor SpringBoot Application from SkyWalking UI

After build the Docker image *guopingjia/springboot-k8s-demo:pce* and push it to the *DockerHub* registry, we deploy the *SpringBoot* Web app to the Kubernetes cluster:

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

Upon the Web app gets deployed, the built-in Java agent will start collecting application data and post it to the SkyWalking OAP. All the application metrics will be available in the SkyWalking UI, under _General Service_ tab:

![](/img/java-app.png)

Below is the *SpingBoot* Web app topology map:

![](/img/java-app-map.png)

### Deploy a Multi-tier Application

A﻿s the second demo application, we will deploy a multi-tier *music* application, available as part of [Apache SkyWalking showcase application](https://github.com/apache/skywalking-showcase). This multi-tier music application consists of a frontend app server and its UI, backend gateway service, recommendation service and songs service, together with a *H2* database. Each microservice is coding with different programming languages, *NodeJS*, *React*, *Spring*, *Python*, etc.

![](/img/multl-tier-app-music.png)

I﻿n order to monitor this multi-tier *music* application from Apache SkyWalking, we need to pick up the SkyWalking agent per programming language and rebuild corresponding service to instrument the application to the SkyWalking OAP server.

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

A﻿fter image files are rebuilt with the agents, the multi-tier *music* application can be deployed to the K8s cluster:

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

### Monitor Multi-tier Application from SkyWalking UI

When the multi-tier *music* app gets deployed, the agents built with each microservice will start collecting application data and post it to the SkyWalking OAP. The multi-tier *music* application metrics will be available in the SkyWalking UI, under _General Service_ tab:

![](/img/multl-tier-app.png)

Below is the multi-tier *music* application topology map:

![](/img/multl-tier-app-map.png)

You can also check the following multi-tier *music* application trace page. It's very helpful when you debug any performance issue in the application.

![](/img/sw-app-trace.png)

### Application Alerting

Apache SkyWalking provides an alerting mechanism to measure application performance according to a list of pre-defined metrics, e.g., _service_resp_time_, _database_access_resp_time_, and _service_sla_. It will trigger alerting when some metrics reach its pre-defined thresholds. We can define new metrics or customize the existing metrics with new thresholds. 

Here is the alarms page from SkyWalking UI showing all the triggered alerting for deployed multi-tier *music* app: 

![](/img/sw-app-alarms.png)

T﻿he alarms page shows *Successful rate of service agent::app is lower than 80% in 2 minutes of last 10 minutes*. It indicates issue from the frontend app server in multi-tier *music* application.

The alerts are triggered by the following metric alerting rule _service_sla_: 

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
W﻿e can go to the frontend app by clicking the service `agent::app` from SkyWalking UI Service page. From the below service `agent::app` overview page, it shows **Success Rate 66.66%**. 

![](/img/sw-svc-app-overview.png)

We may check further the service's trace page and try to figure out the root cause for this issue.

![](/img/sw-svc-app-trace.png) 

## Conclusion

This blog post took the Apache SkyWalking as the application performance monitoring (APM) tool and showed the detailed process to set it up, as a *self-managed* environment in HPE GreenLake for Private Cloud Enterprise, for monitoring and alerting applications. Using the instrumentation of multiple supported agents from Apache SkyWalking, the application workloads can be easily monitored through the integrated Apache SkyWalking UI, with nice application topology map, tracing details and real-time alarms for any application performance issues.  

I﻿n the next blog, we will show you how to use Apache SkyWalking for Kubernetes monitoring in HPE GreenLake for Private Cloud Enterprise.