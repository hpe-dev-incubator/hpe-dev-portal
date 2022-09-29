---
title: Set up Apache SkyWalking for application monitoring on K8s and VM in HPE
  GreenLake Private Cloud
date: 2022-09-29T07:26:49.087Z
author: Guoping Jia and Thirukkannan M
authorimage: /img/Avatar1.svg
tags:
  - hpe-greenlake, kubernetes, virtual machine, monitoring
---
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

$ k get service skywalking-ui -n skywalking 
NAME            TYPE       CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
skywalking-ui   NodePort   10.102.186.131   <none>        80:30048/TCP   19m
```

## Set up Apache SkyWalkinge for Application Monitoring on Virtual Machines

<﻿to be added>