---
title: How to Set Up Credentials to Authenticate Container Registry in HPE
  GreenLake for Containers
date: 2022-05-10T08:20:45.683Z
author: Guoping Jia
authorimage: /img/guoping.png
tags:
  - hpe-greenlake
---
## Introduction

The example uses a private registry in Docker Hub.


## Setup Details
There are several ways to set up credentials to run containers from image registries. The approach of using imagePullSecrets is the recommended one.




$ k create secret docker-registry cfe-registry-key --docker-server=https://registry-1.docker.io/v2 --docker-username=<user> --docker-password=<password> --docker-email=guoping.jia@hpe.com

$ k get secrets cfe-registry-key 
NAME               TYPE                             DATA   AGE
cfe-registry-key   kubernetes.io/dockerconfigjson   1      2m11s

$ k get serviceaccount
NAME                     SECRETS   AGE
default                  1         46d
hpecp-tenant-326-mpj2s   1         46d

$ k patch sa default -p '{"imagePullSecrets": [{"name": "cfe-registry-key"}]}'
serviceaccount/default patched

$ k get sa default -o yaml
apiVersion: v1
imagePullSecrets:
- name: cfe-registry-key
kind: ServiceAccount
metadata:
  creationTimestamp: "2022-03-24T07:17:36Z"
  name: default
  namespace: cfe-demo-cluster
  resourceVersion: "11710765"
  uid: 72706f80-26fc-405b-a154-ba5343a35ebe
secrets:
- name: default-token-zsscp

Verify imagePullSecrets got added to pod spec:

$ k run cfe-nginx --image=nginx 
pod/cfe-nginx created

$ k get pods
NAME        READY   STATUS    RESTARTS   AGE
cfe-nginx   1/1     Running   0          4m28s

$ k get pod cfe-nginx -o=jsonpath='{.spec.imagePullSecrets[0].name}{"\n"}'
cfe-registry-key
