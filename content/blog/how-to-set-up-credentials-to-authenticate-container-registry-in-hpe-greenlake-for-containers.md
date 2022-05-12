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
HPE GreenLake for Containers uses a gateway host, acting as a proxy sever, that carries client requests from deployed application service endpoints in the Kubernetes clusters. 
The gateway host maps the private IP endpoints of services running on the Kubernetes nodes inside the clusters to publicly-accessible IP addresses and ports.


```
$ kubectl run cfe-nginx --image=nginx
pod/cfe-nginx created

$ kubectl get pods
NAME        READY   STATUS         RESTARTS   AGE
cfe-nginx   0/1     ErrImagePull   0          5s


$ kubectl describe pods cfe-nginx 
Name:         cfe-nginx
...
Events:
  Type     Reason     Age                            From                                                             Message
  ----     ------     ----                           ----                                                             -------
  Normal   Scheduled  <invalid>                      default-scheduler                                                Successfully assigned cfe-demo-cluster/cfe-nginx to k8s-cfe-demo-cluster-worker-67f75-24jmj.glhc-hpe.local
  Warning  Failed     <invalid>                      kubelet, k8s-cfe-demo-cluster-worker-67f75-24jmj.glhc-hpe.local  Failed to pull image "nginx": rpc error: code = Unknown desc = failed to pull and unpack image "docker.io/library/nginx:latest": failed to copy: httpReadSeeker: failed open: unexpected status code https://registry-1.docker.io/v2/library/nginx/manifests/sha256:19da26bd6ef0468ac8ef5c03f01ce1569a4dbfb82d4d7b7ffbd7aed16ad3eb46: 429 Too Many Requests - Server message: toomanyrequests: You have reached your pull rate limit. You may increase the limit by authenticating and upgrading: https://www.docker.com/increase-rate-limit
  Warning  Failed     <invalid>                      kubelet, k8s-cfe-demo-cluster-worker-67f75-24jmj.glhc-hpe.local  Error: ErrImagePull
  Normal   BackOff    <invalid>                      kubelet, k8s-cfe-demo-cluster-worker-67f75-24jmj.glhc-hpe.local  Back-off pulling image "nginx"
  Warning  Failed     <invalid>                      kubelet, k8s-cfe-demo-cluster-worker-67f75-24jmj.glhc-hpe.local  Error: ImagePullBackOff
  Normal   Pulling    <invalid> (x2 over <invalid>)  kubelet, k8s-cfe-demo-cluster-worker-67f75-24jmj.glhc-hpe.local  Pulling image "nginx"
```
The example uses a private registry in Docker Hub.


## Prerequirements

You need to have the following credentials of your personal Docker subscription or a paid one. 

-	Docker Username
-	Docker Password or Access Token

Note that the Docker access token instead of Docker password would be recommended to be used as the credentials. You can refer to Docker’s Manage Access Tokens page to create such an access token of your Docker subscriptions. 

The personal Docker account credentials allow you to log in to Docker as an authenticated user in which the image rate limit is set to 200 pulls per 6 hour period. The users with a paid Docker subscription have no limits in image downloads. It could make sense to have a paid Docker subscription at team or company level. However you do not really need to upgrade your Docker account to a paid one. 200 pulls per 6 hours period as an authenticated user should be enough to work on for individual developer in your application deployment to the Kubernetes clusters.

The Docker credentials can be used to create a secret and install in the Kubernetes cluster to pull docker images as part of application deployments.



## Setup Details
There are several ways to set up credentials to run containers from image registries. The approach of using imagePullSecrets is the recommended one.




```
$ kubectl create secret docker-registry cfe-registry-key --docker-server=https://registry-1.docker.io/v2 --docker-username=<user> --docker-password=<password> --docker-email=guoping.jia@hpe.com

$ kubectl get secrets cfe-registry-key 
NAME               TYPE                             DATA   AGE
cfe-registry-key   kubernetes.io/dockerconfigjson   1      2m11s

$ kubectl get serviceaccount
NAME                     SECRETS   AGE
default                  1         46d
hpecp-tenant-326-mpj2s   1         46d

$ kubectl patch sa default -p '{"imagePullSecrets": [{"name": "cfe-registry-key"}]}'
serviceaccount/default patched

$ kubectl get sa default -o yaml
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

$ kubectl run cfe-nginx --image=nginx 
pod/cfe-nginx created

$ kubectl get pods
NAME        READY   STATUS    RESTARTS   AGE
cfe-nginx   1/1     Running   0          4m28s

$ k get pod cfe-nginx -o=jsonpath='{.spec.imagePullSecrets[0].name}{"\n"}'
cfe-registry-key
```

## Conclusion
Docker's image download rate limit has caused quite a few confusion in HPE GreenLake for Containers. This article describes you how to set up the registry secret with your docker Hub credentials to pull images in your application deployment. Once follow up the procedure, your application deployment will be able to download images without hitting any more the rate limit error.

* [Learn more about HPE GreenLake](https://www.hpe.com/us/en/greenlake.html)
* [Docker download rate limit](https://docs.docker.com/docker-hub/download-rate-limit/)
* [Manage Access Tokens](https://docs.docker.com/docker-hub/access-tokens/)
