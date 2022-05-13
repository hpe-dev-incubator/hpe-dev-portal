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
*HPE GreenLake for Containers* is built on HPE Ezmeral Container Platform, based on open source Kubernetes. It provides a pay-as-you go Kubernetes-based container optimized stack, delivered as a service to help you operationalize your containers at scale. In HPE GreenLake for Containers, it configures to use a gateway host, acting as a proxy sever, that carries client requests from deployed application service endpoints in the Kubernetes clusters. The gateway host maps the private IP endpoints of services running inside the Kubernetes clusters to external accessible IP addresses and ports. It provides better security by exposing only the gateway host IP address to the external while keeping all the others behind the firewall. However, when you deploy some applications to the clusters, you may hit issue, from time to time, and receive the error state *`ErrImagePull`* in your applicaiton pods. Here is a sample `ngnix` application deployment and the received issue:

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
The above issue is caused by recent [Docker policy changes for downloading images](https://docs.docker.com/docker-hub/download-rate-limit/). In particular, for anonymous users, the image download rate limit is set to 100 pulls per 6 hours per IP address. No matter who starts creating a new application from Docker image, the Kubernetes cluster downloads the image as an anonymous user, which counts toward the new rate limit on the same gateway host IP. Gvien that other developers are using the same Kubernetes cluster, together with many ArgoCD jobs configured to run in the backend, the limit can be eventually reached and the `ErrimagePull` message pops up.



This article 
## Prerequirements

You need to have the following credentials of your personal Docker subscription or a paid Docker subscription: 

-	Docker Username
-	Docker Password or Access Token

Note that the Docker access token instead of Docker password would be recommended to be used as the credentials. You can refer to [Docker’s Manage Access Tokens page](https://docs.docker.com/docker-hub/access-tokens/) to create such an access token of your Docker subscriptions. Docker access token provides some advantages over the password. It can't be used for performing any admin activity on your Docker account, and it provides a way to check the last usage and it can be easily disabled or deleted. In case you have two-factor authentication setup on your account, using the access token is the only way to authenticate to Docker.

The personal Docker account credentials allow you to log in to Docker as an authenticated user in which the image rate limit is set to 200 pulls per 6 hour period. The users with a paid Docker subscription have no limits in image downloads. It could make sense to have a paid Docker subscription at team or company level. However you do not really need to upgrade your Docker account to a paid one. 200 pulls per 6 hours period as an authenticated user should be enough to work on for individual developer in your application deployment to the Kubernetes clusters.

The Docker credentials are used to create a secret and install it in the Kubernetes cluster to pull docker images as part of application deployments.


## Setup Details

### Create a Registry Secret 
You can use the following command to create a registry secret using your credentials:

```
$ kubectl create secret docker-registry cfe-registry-key --docker-server=https://index.docker.io/v1/ --docker-username=<username> --docker-password=<password> --docker-email=<email>
```

You can verify the registry secret has been created:
```
$ kubectl get secrets cfe-registry-key 
NAME               TYPE                             DATA   AGE
cfe-registry-key   kubernetes.io/dockerconfigjson   1      2m11s
```

### Specify `imagePullSecrets` on Pods
You can create pods or update existing ones to refer to the created registry secret by adding the following `imagePullSecrets` section to Pod definition:

```json
imagePullSecrets:
- name: cfe-registry-key
```

With those pod manifest files, the Kubernetes cluster downloads the image as an authenticated user using the credentials from the registry secret. The image download will not count against the 100 download limit shared across all anonymous cluster users in the Kubernetes cluster. 

Although it works for most of your application deployment, it requires to modify manifest files to add `imagePullSecrets` section. 

You can use the following step to add image pull secret to `service accounts`. When you try to create new applications, the `imagePullSecrets` will be automatically injected and used in downloading the images. The setup makes sense especially when you have the paid Docker subscriptions. Other developers use the same Kubernetes cluster can benefit the setup to have unlimited image download in their application deployment.




### Add `imagePullSecrets` to Service Accounts
You can run the following command to modify the default service account to use `imagePullSecret`:

```





$ kubectl patch serviceaccount default -p '{"imagePullSecrets": [{"name": "cfe-registry-key"}]}'
serviceaccount/default patched


$ kubectl get serviceaccount default -o yaml
kind: ServiceAccount
metadata:

  name: default
...
...
imagePullSecrets:
- name: cfe-registry-key



$ kubectl run cfe-nginx --image=nginx 
pod/cfe-nginx created


$ kubectl get pods
NAME        READY   STATUS    RESTARTS   AGE
cfe-nginx   1/1     Running   0          4m28s


$ kubectl get pod cfe-nginx -o=jsonpath='{.spec.imagePullSecrets[0].name}{"\n"}'
cfe-registry-key
```

## Conclusion
Docker's image download rate limit has caused quite a few confusion in HPE GreenLake for Containers. This article describes you how to set up the registry secret with your docker Hub credentials to pull images in your application deployment. Once follow up the procedure, your application deployment will be able to download images without hitting any more the rate limit error.

* [Learn more about HPE GreenLake](https://www.hpe.com/us/en/greenlake.html)
* [Docker download rate limit](https://docs.docker.com/docker-hub/download-rate-limit/)
* [Manage Access Tokens](https://docs.docker.com/docker-hub/access-tokens/)
