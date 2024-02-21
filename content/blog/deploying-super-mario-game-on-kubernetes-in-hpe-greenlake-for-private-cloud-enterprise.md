---
title: Deploying Super Mario game on Kubernetes in HPE GreenLake for Private
  Cloud Enterprise
date: 2024-02-20T14:54:51.767Z
author: Guoping Jia
authorimage: /img/guoping.png
disable: false
tags:
  - HPE GreenLake for Private Cloud Enterprise
  - Load balancer
  - SSL/TLS certificates
  - Ingress
  - Ingress controller
  - Super Mario
  - Tetris
---
T﻿his blog post shows you the detailed process to deploy Super Mario game to the Kubernetes in HPE GreenLake for Private Cloud Enterprise

### Prerequisites

Before starting, make sure you have the following:

* A K8s cluster, being provisioned in HPE GreenLake for Private Cloud Enterprise
* The kubectl CLI tool, together with the kubeconfig file for accessing the K8s cluster
* The o﻿ptional openssl CLI tool, for validating the generated certificates 

```shell
$ k get all -n metallb-system
NAME                              READY   STATUS    RESTARTS   AGE
pod/controller-57b4fdc957-dr4h4   1/1     Running   0          18d
pod/speaker-9kx9h                 1/1     Running   0          18d
pod/speaker-d6sdh                 1/1     Running   0          18d
pod/speaker-gxbbx                 1/1     Running   0          18d
pod/speaker-hflbj                 1/1     Running   0          18d
pod/speaker-wfw9n                 1/1     Running   0          18d

NAME                      TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)   AGE
service/webhook-service   ClusterIP   10.107.242.167   <none>        443/TCP   18d

NAME                     DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR            AGE
daemonset.apps/speaker   5         5         5       5            5           kubernetes.io/os=linux   18d

NAME                         READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/controller   1/1     1            1           18d

NAME                                    DESIRED   CURRENT   READY   AGE
replicaset.apps/controller-57b4fdc957   1         1         1       18d
```



```shell
$ k get all -n ingress-nginx
NAME                                            READY   STATUS    RESTARTS   AGE
pod/ingress-nginx-controller-5957546d75-zjwjh   1/1     Running   0          15d

NAME                                         TYPE           CLUSTER-IP       EXTERNAL-IP    PORT(S)                      AGE
service/ingress-nginx-controller             LoadBalancer   10.98.254.246    10.6.115.251   80:30209/TCP,443:30833/TCP   15d
service/ingress-nginx-controller-admission   ClusterIP      10.109.187.223   <none>         443/TCP                      15d

NAME                                       READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/ingress-nginx-controller   1/1     1            1           15d

NAME                                                  DESIRED   CURRENT   READY   AGE
replicaset.apps/ingress-nginx-controller-5957546d75   1         1         1       15d
```

```shell
 $ k get all -n cert-manager
NAME                                           READY   STATUS    RESTARTS   AGE
pod/cert-manager-6bcdd5f7c-f7lfw               1/1     Running   0          18d
pod/cert-manager-cainjector-5d4577b4d9-jmpsp   1/1     Running   0          18d
pod/cert-manager-webhook-bf957dc77-s9r2g       1/1     Running   0          18d

NAME                           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
service/cert-manager           ClusterIP   10.109.28.203   <none>        9402/TCP   18d
service/cert-manager-webhook   ClusterIP   10.100.82.119   <none>        443/TCP    18d

NAME                                      READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/cert-manager              1/1     1            1           18d
deployment.apps/cert-manager-cainjector   1/1     1            1           18d
deployment.apps/cert-manager-webhook      1/1     1            1           18d

NAME                                                 DESIRED   CURRENT   READY   AGE
replicaset.apps/cert-manager-6bcdd5f7c               1         1         1       18d
replicaset.apps/cert-manager-cainjector-5d4577b4d9   1         1         1       18d
replicaset.apps/cert-manager-webhook-bf957dc77       1         1         1       18d
```

