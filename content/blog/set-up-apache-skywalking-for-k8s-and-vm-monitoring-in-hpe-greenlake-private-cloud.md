---
title: Set up Apache SkyWalking for application monitoring on K8s and VM in HPE
  GreenLake Private Cloud
date: 2022-09-29T07:26:49.087Z
author: Guoping Jia and Thirukkannan M
authorimage: /img/Avatar1.svg
tags:
  - hpe-greenlake, kubernetes, virtual machine, monitoring
---
![]()

## Introduction

Available on the HPE GreenLake Central platform, [HPE GreenLake for Private Cloud Enterprise](https://www.hpe.com/us/en/greenlake/private-cloud-enterprise.html) is composed of the following suite of HPE services that are grouped specifically to create and manage a private cloud:

* HPE GreenLake for Virtual Machines
* HPE GreenLake for Containers
* HPE GreenLake for Bare Metal Servers

I﻿t provides an automated, flexible private cloud c﻿ustomers can use to run, support, and develop any of apps in their private environment, with modern cloud experience for VMs, containers, and bare metal. 

This blog post describes the process of deploying the Apache SkyWalking t﻿o the HPE GreenLake private cloud. in customer production environments. 

## Apache SkyWalking

[Apache SkyWalking](https://www.mongodb.com/) is an open source application performance monitor (APM) system, especially designed for microservices, cloud native, and container-based architectures.

## Set up Apache SkyWalkinge for Application Monitoring on K8s

### Deploy Apache SkyWalkinge

Install SkyWalking using helm charts with elasticsearch as storage 

```markdown
$ git clone https://github.com/apache/skywalking-kubernetes 
$ cd skywalking-kubernetes/chart
$ helm repo add elastic https://helm.elastic.co
$ helm dep up skywalking
$ helm install skywalking skywalking –n skywalking \
--set oap.image.tag=9.1.0 \
--set oap.storageType=elasticsearch \
--set ui.image.tag=9.1.0 \
--set elasticsearch.imageTag=7.5.1 \
--set elasticsearch.persistence.enabled=true \
--set elasticsearch.sysctlInitContainer.enabled=false
NAME: skywalking
LAST DEPLOYED: Sat Sep 24 09:29:38 2022
NAMESPACE: skywalking
STATUS: deployed
REVISION: 1
NOTES:
************************************************************************
*                                                                      *
*                 SkyWalking Helm Chart by SkyWalking Team             *
*                                                                      *
************************************************************************

Thank you for installing skywalking.

Your release is named skywalking.

Learn more, please visit https://skywalking.apache.org/

Get the UI URL by running these commands:
  echo "Visit http://127.0.0.1:8080 to use your application"
  kubectl port-forward svc/skywalking-ui 8080:80 --namespace skywalking
```

T﻿he Apache SkyWalking is installed to the K8s cluster namespace *skywalking*. You can check the details by typing the following kubectl command:

```markdown
$ k get all -n skywalking
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

![](/img/skywalking-ui-0.pnp.png)

### Deploy Multi-tier Applications

The following multi-tier music application will be installed to the K8s cluster.

* App Server (NodeJS) & UI (React):
* Gateway (Spring)
* Recommendations (Python)
* Songs (Spring)

I﻿n order to monitor the multi-tier application from SkyWalking, various SkyWalking agent per programming language needs to be built into each service which collects application data and exports them to the SkyWalking OPA server. 

![](/img/skywalking-agents.png)

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

A﻿fter image files are rebuilt with the agent, the multi-tier application can be deployed to the K8s cluster:

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

### Monitor Multi-tier Applications from SkyWalking UI

![](/img/skywalking-ui-app.png)

![](/img/skywalking-ui-app-topology.png)

## Set up Apache SkyWalkinge for Application Monitoring on Virtual Machines

<﻿to be added>