---
title: Set up Apache SkyWalking for application monitoring in HPE GreenLake for
  Private Cloud Enterprise
date: 2022-09-29T07:26:49.087Z
author: Guoping Jia
authorimage: /img/guoping.png
tags:
  - hpe-greenlake, kubernetes, application performance monitoring, Apache
    SkyWalking
---
## Introduction


[HPE GreenLake for Private Cloud Enterprise](https://www.hpe.com/us/en/greenlake/private-cloud-enterprise.html) delivers a modern private cloud to support your app workloads with bare metal, containers, and virtual machines (VMs) running in any combination across your edges, colocations, and data centers. It combines self-service resource access for developers with consumption and performance transparency for IT. Within this modern application environment, having a robust application performance monitoring (APM) tool is becoming essential. It can help IT professionals to ensure that deployed applications meet the performance, reliability and valuable user experience required by developers, partners and customers.

In [my first blog post](https://developer.hpe.com/blog/get-started-with-application-performance-monitoring-tools-overview/), we walked through some of the best APM tools, described their key features and discussed in details their strengths and weaknesses.



In this blog post, we will start choosing one APM tool,  _Apache SkyWalking_, and describe the detailed process to set it up in HPE GreenLake for Private Cloud Enterprise for monitoring customer applications.

## Apache SkyWalking

[Apache SkyWalking](https://skywalking.apache.org/) is an open source APM tool with capabilities for monitoring, tracing and diagnosing distributed system. It’s especially designed for microservices, cloud native and container-based architectures. 

Apache SkyWalking provides a list of agents to be used for building *Java*, *.NET Core*, *PHP*, *Node.js*, *Golang*, *LUA*, *Rust* and *C++* apps. It provides tracing, metrics analysis, alerting, service mesh observability and visualization.

Apache SkyWalking is lightweight, scalable, and supports alerting and visualization. It can be easily set up as a *self-managed* APM tool within an on-premises data center. This avoids leasing customer data to third party services and matches very well with the security restriction in HPE GreenLake for Private Cloud Enterprise environment. 

## Prerequisites

Before we start, make sure we meet the following requirements:



* A Kubernetes cluster, being provisioned in HPE GreenLake for Private Cloud Enterprise;


* The _kubectl_ CLI tool, together with the _kubeconfig_ files for accessing the Kubernetes clusters;

* The [_Helm_](https://helm.sh/docs/intro/install/) CLI tool. I﻿t will be used for installing the Apache SkyWalking;

## Set up Apache SkyWalking for Application Monitoring

We will take the approach to setting up the Apache SkyWalking as a _self-hosted_ APM tool within the Kubernetes cluster created in HPE GreenLake for Private Cloud Enterprise environment. This mainly takes into account the restricted security concerns in HPE GreenLake product environment. 

### Deploy Apache SkyWalking

Install Apache SkyWalking using Helm charts with *elasticsearch* as storage:

```markdown
$ git clone https://github.com/apache/skywalking-kubernetes 
$ cd skywalking-kubernetes/chart
$ helm repo add elastic https://helm.elastic.co
$ helm dep up skywalking
$﻿ kubectl create ns skywalking
$ helm install skywalking skywalking –n skywalking \
--set oap.image.tag=9.1.0 \
--set oap.storageType=elasticsearch \
--set ui.image.tag=9.1.0 \
--set elasticsearch.imageTag=7.5.1 \
--set elasticsearch.persistence.enabled=true \
--set elasticsearch.sysctlInitContainer.enabled=false
```

T﻿he Apache SkyWalking is installed to the Kubernetes cluster namespace *skywalking*. We can check the details by typing the following *kubectl* command:

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

Y﻿ou can edit the deployed SkyWalking UI service *skywalking_ui* and change its type from *ClusterIP* to *NodePort*. The service will be automatically mapped to gateway host with an assigned port.

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

T﻿he SkyWalking UI can then be accessed in your browser by typing the address *gl2-caas.gl-hpe.local:10037*: 

![](/img/sw-ui.png)

### Deploy a Sample SpringBoot Application

The following multi-tier music application will be installed to the K8s cluster.

* App Server (NodeJS) & UI (React):
* Gateway (Spring)
* Recommendations (Python)
* Songs (Spring)

![](/img/sw-agents.png)

I﻿n order to monitor the multi-tier application from SkyWalking, each SkyWalking agent per programming language needs to be built into corresponding service which collects application data and exports them to the SkyWalking OAP server. 

![](/img/java-agent.png)

```markdown
$ cat Dockerfile
FROM adoptopenjdk:11-jre-hotspot
# copy extracted agent folder from the downloaded archive
ADD agent /opt/agent
# copy the app jar file
EXPOSE 8080
ADD target/springboot-k8s-demo.jar /app/springboot-k8s-demo.jar
WORKDIR /app
ENTRYPOINT ["java","-javaagent:/opt/agent/skywalking-agent.jar=agent.namespace=default,agent.service_name=springboot-k8s-app,collector.backend_service=skywalking-oap.skywalking.svc.cluster.local: 11800, plugin.jdbc.trace_sql_parameters = true,profile.active=true","-jar","/app/springboot-k8s-app.jar"]
```

### Monitor SpringBoot Application from SkyWalking UI

![](/img/java-app.png)

![](/img/java-app-map.png)

### Deploy Multi-tier Application

The following multi-tier music application will be installed to the K8s cluster.

* App Server (NodeJS) & UI (React):
* Gateway (Spring)
* Recommendations (Python)
* Songs (Spring)

![](/img/multl-tier-app-music.png)

I﻿n order to monitor the multi-tier application from SkyWalking, each SkyWalking agent per programming language needs to be built into corresponding service which collects application data and exports them to the SkyWalking OAP server. 

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

A﻿fter image files are rebuilt with the agents, the multi-tier application can be deployed to the K8s cluster:

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

\-﻿ Multi-tier application services:

![](/img/sw-app-svc.png)

\-﻿ Multi-tier application topology:

![](/img/multl-tier-app-map.png)

\-﻿ Multi-tier application trace:

![](/img/sw-app-trace.png)

\-﻿ Multi-tier application alarms:

![](/img/sw-app-alarms.png)

T﻿he alarms page shows *Successful rate of service agent::app is lower than 80% in 2 minutes of last 10 minutes*. 

From the service `agent::app` overview page below, it shows *Success Rate 66.66%*. You may check the service's trace pages and try to figure out the root cause for this issue.

\-﻿ Multi-tier application service `agent::app` overview:

![](/img/sw-svc-app-overview.png)

\-﻿ Multi-tier application service `agent::app` trace:

![](/img/sw-svc-app-trace.png)

## Conclusion

<﻿to be added>