---
title: "Addressing hybrid cloud application challenges using HPE GreenLake for
  Private Cloud Enterprise – Part 1: Deploying complex apps"
date: 2023-01-05T07:52:05.869Z
author: Guoping Jia
authorimage: /img/guoping.png
disable: false
tags:
  - hpe-greenlake
  - hpe-greenlake-for-private-cloud-enterprise
  - Skupper
  - AWS EKS
  - devops
  - sre
  - site-reliability-engineer
---
## Introduction

[HPE GreenLake for Private Cloud Enterprise](https://www.hpe.com/us/en/greenlake/private-cloud-enterprise.html) delivers a modern private cloud to support your app workloads with bare metal, containers, and virtual machines (VMs) running in any combination across your edges, colocations, and data centers. It combines self-service resource access for developers with consumption and performance transparency for IT. 

This blog post shows you how to deploy a complex application that consists of multiple microservices as a hybrid app that spans both a public AWS EKS cluster and a private Kubernetes cluster in HPE GreenLake for Private Cloud Enterprise. By using a hybrid cloud solution, you can combine the compliance benefits of a private cloud in HPE GreenLake for Private Cloud Enterprise environment with the scalability and connectivity of the public cloud. You can rely on the security of finely tuned, on-premises data centers while turning to the agility of cloud computing to manage the front end of an application in the public cloud. Using HPE GreenLake for Private Cloud Enterprise, you can optimize resource allocation, save costs, and improve overall productivity and performance in the process. 

## Prerequisites

Before you start, make sure you have the following required components: 

* A public Kubernetes cluster from one of the public cloud providers such as *AWS*, *Microsoft Azure* or *Google*. For the purposes of the use case being highlighted in this blog post, a single EKS cluster, named *eks-cfe-public* from AWS, is being used. However, it works if you choose a cluster from other providers.
* A private Kubernetes cluster, named *eks-pce-clu-1* provisioned in HPE GreenLake for Private Cloud Enterprise. 
* The *kubectl* CLI tool, version 1.23 or later, together with the *kubeconfig* files for accessing both the public AWS EKS cluster and private Kubernetes cluster in HPE GreenLake for Private Cloud Enterprise. To simplify the setup process, you can start two terminal sessions in your environment, export the environment variable `KUBECONFIG` in each session and point it to the *kubeconfig* file for accessing the public AWS EKS cluster and the private Kubernetes cluster, respectively. 
* The [Skupper](https://skupper.io/) CLI tool, the latest version 1.2.0. Use the [Skupper Installation](https://skupper.io/start/#step-1-install-the-skupper-command-line-tool-in-your-environment) to install this CLI tool to your environment. The *Skupper* CLI tool works w﻿ith the same environment setup for *kubectl* for accessing the public AWS EKS cluster and private Kubernetes cluster in HPE GreenLake for Private Cloud Enterprise. Some options, e.g., *\--kubeconfig*, *\--context*, and *\--namespace*, can be used explicitly in *Skupper* for using a specific *kubeconfig* file and context or accessing a Kubernetes namespace. 

## Online Boutique

[Online Boutique](https://github.com/GoogleCloudPlatform/microservices-demo) is a cloud-first microservices demo application. It consists of an *11-tier* microservices application. The application is a web-based e-commerce app where users can browse items, add them to the cart, and purchase them. This demo app has been used widely for demonstrating various technologies. It’s easy to deploy and it works on any Kubernetes cluster.

This blog post will use the *Online Boutique* as the demo application, deploying it across the public AWS EKS cluster and the private Kubernetes cluster in HPE GreenLake for Private Cloud Enterprise using *Skupper*. 

![](/img/apps.png)

## Skupper

[Skupper](https://skupper.io/) is a *Layer 7* service interconnect. It enables secure communication across multiple Kubernetes clusters through a Virtual Application Network (VAN). The VAN connects the applications and services in multiple clusters into a virtual network so that they can communicate with each other as if they were all running in the same site. VANs are able to provide connectivity across the hybrid cloud because they operate at Layer 7 (the application layer). They use Layer 7 application routers to route communication between Layer 7 application addresses. 

With *Skupper*, your application can span multiple cloud providers, data centers, and regions with no VPNs or special firewall rules.

## Deploy Online Boutique application

Clone the [Online Boutique](https://github.com/GoogleCloudPlatform/microservices-demo) GitHub repo to your local environment:

```markdown
$ git clone https://github.com/GoogleCloudPlatform/microservices-demo.git
$ cd microservices-demo/release/
```

From the manifests file *kubernetes-manifests.yaml*  in the folder, create the following 3 manifests files:

* **k8s-manifests-deploy-private.yaml**, including the following 3 *Deployment* manifests:

  * *emailservice*
  * *paymentservice*
  * *shippingservice*
* **k8s-manifests-deploy-public.yaml**, including the following 7 *Deployment* manifests:

  * *frontend*
  * *recommendationservice*
  * *productcatalogservice*
  * *checkoutservice*
  * *cartservice*
  * *currencyservice*
  * *redis-cart*
  * *adservice*
* **k8s-manifests-service-public.yaml**, including the following 2 *Service* manifests:

  * *frontend*
  * *frontend-external*

### Deploy application microservices to AWS EKS cluster

C﻿reate the namespace *boutique* in the AWS EKS cluster and then deploy 7 *Deployment* and 2 *Service* resources to the namespace:

```markdown
$ kubectl create ns boutique
$ kubectl config set-context --current --namespace boutique
$ kubectl apply -f k8s-manifests-deploy-public.yaml                  
deployment.apps/recommendationservice created                                                  
deployment.apps/frontend created                                                             
deployment.apps/productcatalogservice created                                               
deployment.apps/checkoutservice created                                                      
deployment.apps/cartservice created                                               
deployment.apps/currencyservice created                                                
deployment.apps/redis-cart created                                                      
deployment.apps/adservice created                                                            

$ kubectl apply -f k8s-manifests-service-public.yaml           
service/frontend created                                                              
service/frontend-external created    

$ kubectl get svc
frontend                ClusterIP      172.20.103.129   <none>                                                                    80/TCP                            40s   <none>
frontend-external       LoadBalancer   172.20.16.223    a52d7c861c01c4466803a44373bc11dc-1387384363.us-east-2.elb.amazonaws.com   80:31482/TCP                      40s   <none>                                    
```

### Deploy application microservices to private Kubernetes cluster

Similarly, create the namespace *boutique* in the private Kubernetes cluster running on HPE GreenLake for Private Cloud Enterprise and then deploy 3 *Deployment* resources to the namespace:

```markdown
$ kubectl create ns boutique
$ kubectl config set-context --current --namespace boutique
$ kubectl apply -f k8s-manifests-deploy-private.yaml    
deployment.apps/emailservice created
deployment.apps/paymentservice created
deployment.apps/shippingservice created
```

### Deploy Virtual Application Network

Define the Virtual Application Network using *Skupper* on both the public AWS EKS cluster and private Kubernetes cluster:

#### 1. In the public AWS EKS cluster, deploy the *aws-public* application router.

```markdown
$ kubectl config set-context --current –namespace boutique
$ skupper init --site-name aws-public                                                                                         
Waiting 115 seconds for LoadBalancer IP or hostname...                                         
Waiting 111 seconds for LoadBalancer IP or hostname...                                         
Waiting 108 seconds for LoadBalancer IP or hostname...                                        
Skupper is now installed in namespace 'boutique'.  Use 'skupper status' to get more information.            
                                                                        
$ skupper status             
Skupper is enabled for namespace "boutique" with site name "aws-public" in interior mode. It is connected to 1 other site. It has 10 exposed services.
The site console url is:  https://aea867abf6fb6413d8f577652da564c1-130946084.us-east-2.elb.amazonaws.com:8080
The credentials for internal console-auth mode are held in secret: 'skupper-console-users'
```

#### 2. In the private Kubernetes cluster, deploy the *pce-private* application router.

```markdown
$ kubectl config set-context --current –namespace boutique
$ skupper init --ingress none --site-name pce-private
Skupper is now installed in namespace 'boutique'.  Use 'skupper status' to get more information.

$ skupper status
Skupper is enabled for namespace "boutique" with site name "pce-private" in interior mode. It is not connected to any other sites. It has no exposed services
```

#### 3. In the public AWS EKS cluster, create a connection token for connection.

```markdown
$ skupper token create ~/aws-public-token.yaml                                                                              
Token written to /home/guoping/aws-public-token.yaml                                           
```

#### 4. In the private Kubernetes cluster, define the connections to the public AWS EKS cluster.

```markdown
$ skupper link create ~/aws-public-token.yaml 
Site configured to link to https://aea867abf6fb6413d8f577652da564c1-130946084.us-east-2.elb.amazonaws.com:8081/d2e35a8c-6654-11ed-bf10-000c295724b5 (name=link1)
Check the status of the link using 'skupper link status'.

$ skupper link status

Links created from this site:
-------------------------------
Link link1 is active

Currently active links from other sites:
----------------------------------------
There are no active links

$ skupper status
Skupper is enabled for namespace "boutique" with site name "pce-private" in interior mode. It is connected to 1 other site. It has no exposed services.
```

#### 5. In the public AWS EKS cluster, verify connectivity has been established.

```markdown
$ skupper status               
Skupper is enabled for namespace "aws-boutique" with site name "aws-public" in interior mode. It is connected to 1 other site. It has no exposed services.                                    
The site console url is:  https://aea867abf6fb6413d8f577652da564c1-130946084.us-east-2.elb.amazonaws.com:8080
The credentials for internal console-auth mode are held in secret: 'skupper-console-users'
```

F﻿rom the *Skupper* console URL at **https://aea867abf6fb6413d8f577652da564c1-130946084.us-east-2.elb.amazonaws.com:8080**, you can see the connections from
 the public AWS EKS cluster and the private Kubernetes cluster in HPE GreenLake for Private Cloud Enterprise:

![](/img/skupper-status.png)

### Expose application microservices to Virtual Application Network

#### 1. In the private Kubernetes cluster, expose 3 services:

```markdown
$ skupper expose deployment emailservice --address emailservice --port 5000 --protocol http2 --target-port 8080
deployment emailservice exposed as emailservice

$ skupper expose deployment paymentservice --address paymentservice --port 50051 --protocol http2 --target-port 50051
deployment paymentservice exposed as paymentservice

$ skupper expose deployment shippingservice --address shippingservice --port 50051 --protocol http2 --target-port 50051
deployment shippingservice exposed as shippingservice
```

#### 2. In the public AWS EKS cluster, expose 7 services:

```markdown
$ skupper expose deployment productcatalogservice --address productcatalogservice --port 3550 --protocol http2 --target-port 3550
deployment productcatalogservice exposed as productcatalogservice

$ skupper expose deployment recommendationservice --address recommendationservice --port 8080 --protocol http2 --target-port 8080
deployment recommendationservice exposed as recommendationservice

$ skupper expose deployment checkoutservice --address checkoutservice --port 5050 --protocol http2 --target-port 5050
deployment checkoutservice exposed as checkoutservice

$ skupper expose deployment cartservice --address cartservice --port 7070 --protocol http2 --target-port 7070
deployment cartservice exposed as cartservice

$ skupper expose deployment currencyservice --address currencyservice --port 7000 --protocol http2 --target-port 7000
deployment currencyservice exposed as currencyservice

$ skupper expose deployment adservice --address adservice --port 9555 --protocol http2 --target-port 9555
deployment adservice exposed as adservice                                                      

$ skupper expose deployment redis-cart --address redis-cart --port 6379 --protocol tcp --target-port 6379
deployment redis-cart exposed as redis-cart                                                    
```

### Access Online Boutique application

F﻿rom the *Skupper* console, you can see all the deployed services to the public AWS EKS cluster and the private Kubernetes cluster:  

![](/img/skupper-apps.png)

From the public AWS EKS cluster, check all the deployed services.

```markdown
$﻿ kubectl get svc -n boutique
NAME                    TYPE           CLUSTER-IP       EXTERNAL-IP                                                               PORT(S)                           AGE
adservice               ClusterIP      172.20.183.120   <none>                                                                    9555/TCP                          40d
cartservice             ClusterIP      172.20.255.202   <none>                                                                    7070/TCP                          40d
checkoutservice         ClusterIP      172.20.146.32    <none>                                                                    5050/TCP                          40d
currencyservice         ClusterIP      172.20.244.103   <none>                                                                    7000/TCP                          40d
emailservice            ClusterIP      172.20.136.4     <none>                                                                    5000/TCP                          28h
frontend                ClusterIP      172.20.103.129   <none>                                                                    80/TCP                            40d
frontend-external       LoadBalancer   172.20.16.223    a52d7c861c01c4466803a44373bc11dc-1387384363.us-east-2.elb.amazonaws.com   80:31482/TCP                      40d
paymentservice          ClusterIP      172.20.244.25    <none>                                                                    50051/TCP                         28h
productcatalogservice   ClusterIP      172.20.147.163   <none>                                                                    3550/TCP                          40d
recommendationservice   ClusterIP      172.20.83.157    <none>                                                                    8080/TCP                          40d
redis-cart              ClusterIP      172.20.179.232   <none>                                                                    6379/TCP                          40d
shippingservice         ClusterIP      172.20.16.129    <none>                                                                    50051/TCP                         28h
skupper                 LoadBalancer   172.20.111.44    aea867abf6fb6413d8f577652da564c1-130946084.us-east-2.elb.amazonaws.com    8080:31907/TCP,8081:30027/TCP     40d
skupper-router          LoadBalancer   172.20.182.70    acaedc6978d3b453b8555d6dead90943-1598691456.us-east-2.elb.amazonaws.com   55671:30272/TCP,45671:32499/TCP   40d
skupper-router-local    ClusterIP      172.20.175.145   <none>                                                                    5671/TCP                          40d
skupper-router-local    ClusterIP      172.20.249.51    <none>                                                                    5671/TCP                          35m                       
```

T﻿he *Online Boutique* application can be accessed from the assigned LoadBalancing host name **a52d7c861c01c4466803a44373bc11dc-1387384363.us-east-2.elb.amazonaws.com**:

![](/img/online-boutique-frontend.png)

You can start shopping by adding items to the shopping cart, creating your shipping address and choosing the payment method. Please note that both the payment and the shipping services are running from the private Kubernetes cluster in HPE GreenLake for Private Cloud Enterprise.

![](/img/online-boutique-payment.png)

You can then place an order to complete your shopping.

![](/img/online-boutique-order.png)

## Next Steps

This blog post described the process of deploying the *Online Boutique* application as a hybrid app across both a public EKS cluster in AWS and a private Kubernetes cluster in HPE GreenLake for Private Cloud Enterprise environment. 

Running applications and services in this hybrid cloud environment is becoming increasingly popular as more businesses and enterprises shift toward cloud-based computing. This model can amplify the benefits of both private and public clouds and allows for more seamless integration across technical barriers. 

In [my next blog post of the series](https://developer.hpe.com/blog/monitor-application-performance-across-hybrid-cloud-environment-using-apache-skywalking-and-service-mesh/), I will show you how to install and set up the Apache SkyWalking application performance monitoring tool to monitor the deployed application in such a hybrid cloud environment as this. It helps to reduce management complexity and deliver operational insights for more informed business practices, and protect your most valuable user data.
