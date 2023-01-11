---
title: How to Set Up Credentials to Authenticate a Docker Registry in HPE
  GreenLake for Private Cloud Enterprise
date: 2022-05-10T08:20:45.683Z
author: Guoping Jia
authorimage: /img/guoping.png
tags:
  - hpe-greenlake
  - devops
  - hpe-greenlake-for-private-cloud-enterprise
---
**Editor’s Note – NAME CHANGE: HPE GreenLake for Containers is now part of HPE GreenLake for Private Cloud Enterprise.**

- - -

## Introduction
[*HPE GreenLake for Containers*](https://www.hpe.com/us/en/greenlake/containers.html), one of HPE GreenLake Cloud Services, is an HPE-designed, implemented, owned, and operated private cloud deployed at a customer site. It is built on [HPE Ezmeral Runtime Enterprise](https://www.hpe.com/us/en/software/ezmeral-runtime.html), featuring  open source Kubernetes container management. Customers can benefit from the use of HPE GreenLake for Containers by having a powerful underlying container-based infrastructure for both cloud-native apps and monolithic apps, and enjoy as-a-Service ease-of-use and economics. When working with Docker images, one can run into some issues, as Docker's image download rate limit can cause unexpected errors. In this blog post, I will walk you through the process of setting up a secret using the credentials for your Docker subscription in the Kubernetes cluster to avoid this issue.

With HPE GreenLake for Containers, it is configured to use a gateway host, acting as a proxy sever, that carries client requests from deployed application service endpoints in the Kubernetes clusters. The gateway host maps the private IP endpoints of services running inside the Kubernetes clusters to external accessible IP addresses and ports. It provides better security by exposing only the gateway host IP address to the public while keeping all the others behind the firewall. However, when you create your application from a Docker image in the Kubernetes cluster, your application pods may get stuck in the error state *`ErrImagePull`*. Below is a sample `ngnix` application deployment to the cluster and the received error message in the pod events:

```markdown
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
The above issue is caused by [the Docker policy changes for downloading images](https://docs.docker.com/docker-hub/download-rate-limit/). In particular, for anonymous users, the image download rate limit is set to 100 pulls per 6 hours per IP address. No matter who starts creating a new application from a Docker image, the Kubernetes cluster downloads the image as an anonymous user, which counts toward the new rate limit on the same gateway host IP. Given that other developers are using the same Kubernetes cluster, together with many *ArgoCD* jobs configured to run in the backend, the limit can be eventually reached and the *`ErrimagePull`* message pops up.



To deal with this situation, the following sections show you the details on how to set up a secret in the Kubernetes cluster using the credentials for your Docker subscription. The cluster then uses the secret to authenticate to your Docker account and pull the image as an authenticated user. The image download will count against individual limit of your Docker subscription instead of the 100 downloads shared across all anonymous cluster users in the cluster.

## Prerequisites

You need to have the following credentials for your Docker subscription, either a personal or a paid one: 

-	Docker Username
-	Docker Password or Access Token

The personal Docker subscription credentials allow you to log in to Docker as an authenticated user in which the image rate limit is set to 200 pulls per 6 hour period. The users with a paid Docker subscription have no limits in image downloads. It could make sense to have a paid Docker subscription at team or company level. However, you do not really need to upgrade your Docker account to a paid one. 200 pulls per 6-hour period as an authenticated user should be enough for an individual developer to work on application deployment to the Kubernetes cluster.

Note that the Docker access token, instead of a Docker password, would be recommended to be used as the credentials. You can refer to [Docker’s Manage Access Tokens](https://docs.docker.com/docker-hub/access-tokens/) to create such an access token of your Docker subscription. A Docker access token provides some advantages over the password. It can't be used for performing any admin activity on your Docker account. It also provides a way to check the last usage and can easily be disabled or deleted. In case you have two-factor authentication setup on your account, using the access token is the only way to authenticate to Docker.






## Setup Details

### Create a Registry Secret 
You can use the following command to create a registry secret using your Docker credentials:

```markdown
$ kubectl create secret docker-registry cfe-registry-key --docker-server=https://index.docker.io/v1/ --docker-username=<username> --docker-password=<password> --docker-email=<email>
```
Using `--docker-email` is optional. The `cfe-registry-key` is the sample secret name used in the setup process.

You can verify that the registry secret has been created:

```markdown
$ kubectl get secrets cfe-registry-key 
NAME               TYPE                             DATA   AGE
cfe-registry-key   kubernetes.io/dockerconfigjson   1      2m11s
```

### Specify `imagePullSecrets` on Pods
You can create pods or update existing ones to refer to the created registry secret by adding the following `imagePullSecrets` section to the Pod definition:

```json
imagePullSecrets:
- name: cfe-registry-key
```

With those pod manifest files, the Kubernetes cluster downloads the image as an authenticated user using the credentials from the registry secret. The image download will not count against the 100 download limit shared across all anonymous cluster users in the Kubernetes cluster. 

Although the setup works for most of your application deployment, it requires you to modify manifest files to add `imagePullSecrets` section. 

You can use the following step to add image pull secret to `service accounts`. When you try to create new applications, the `imagePullSecrets` will be automatically injected and used in downloading the images. This setup makes sense, especially when you have the paid Docker subscription. Other developers who use the same Kubernetes cluster can benefit from the setup having unlimited image download for their application deployment.




### Add `imagePullSecrets` to Service Accounts
You can run the following command to modify the default service account for the namespace to use `imagePullSecrets`:

```markdown
$ kubectl patch serviceaccount default -p '{"imagePullSecrets": [{"name": "cfe-registry-key"}]}'
serviceaccount/default patched
```
You can verify that the `imagePullSecrets` section has been added to the service account:

```markdown
$ kubectl get serviceaccount default -o yaml
kind: ServiceAccount
metadata:

  name: default
...
...
imagePullSecrets:
- name: cfe-registry-key
```
When you try to create a pod in the current namespace, you can verify the pod has its `sepc.imagePullSecrets` field set automatically:

```markdown
$ kubectl run cfe-nginx --image=nginx 
pod/cfe-nginx created

$ kubectl get pods
NAME        READY   STATUS    RESTARTS   AGE
cfe-nginx   1/1     Running   0          4m28s


$ kubectl get pod cfe-nginx -o=jsonpath='{.spec.imagePullSecrets[0].name}{"\n"}'
cfe-registry-key
```
If you deploy an application to a different namespace than the current one, you need run the command `kubectl patch serviceaccount` with the additional option `-n <namespace>` to add `imagePullSecrets` to the default service account in the new namespace. 

Similarly, if you deploy an application to a namespace using a different service account than the default one, you need to replace `default` in the command `kubectl patch serviceaccount`  with the service account name to add `imagePullSecrets` to this service account. By default, deploying an application to a namespace uses the default service account. You can define the `serviceAccountName` in your manifest files to specify the service account you want to use.

## Conclusion
Docker's image download rate limit has caused quite a bit of confusion for those using HPE GreenLake for Containers. This blog post describes you how to set up a secret using the credentials for your Docker subscription to pull images for your application deployment. Once follow up the procedure, your application deployment will be able to download images without hitting the rate limit error any more.
