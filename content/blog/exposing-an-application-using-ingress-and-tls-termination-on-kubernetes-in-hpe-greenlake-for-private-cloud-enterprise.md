---
title: Exposing an application using Ingress and TLS termination on Kubernetes
  in HPE GreenLake for Private Cloud Enterprise
date: 2024-02-21T09:22:08.283Z
author: Guoping Jia
authorimage: /img/guoping.png
disable: false
tags:
  - HPE GreenLake for Private Cloud Enterprise
  - Kubernetes
  - Ingress
  - Ingress Controller
  - TLS Termination
  - Load balancer
  - metalLB
  - cert-manager
  - Nginx Ingress controller
  - SSL/TLS certificates
  - hpe-greenlake-for-private-cloud-enterprise
---
<style> li { font-size: 27px; line-height: 33px; max-width: none; } </style>

This blog post describes the process to expose an application that's deployed and runs on Kubernetes in HPE GreenLake for Private Cloud Enterprise to the external world. 
A Nginx app that serves as a Web server that prints out a customized application name will be used as a sample app to expose. The application itself will be deployed as 
the service type of *ClusterIP*, running on the port 80 over HTTP. Using cert-manager and TLS termination on configured MetalLB load balancer, the application will be exposed over HTTPS. 



### Overview

### Prerequisites

Before starting, make sure you have the following:

* A K8s cluster, being provisioned in HPE GreenLake for Private Cloud Enterprise
* The kubectl CLI tool, together with the kubeconfig file for accessing the K8s cluster
* The o﻿ptional openssl CLI tool, for validating the generated certificates 

#﻿### Configure Ingress

```shell
 $ cat ingress-simple-selfsigned.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nginx-ingress-selfsigned
  annotations:
    ingress.kubernetes.io/ssl-redirect: "true"
    #kubernetes.io/ingress.class: "nginx"
    cert-manager.io/issuer: "cfe-selfsinged-issuer"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - nginx.example.com
    secretName: cfe-tls-key-pair
  rules:
  - host: nginx.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: nginx-main
            port:
              number: 80
```


```shell
$ k apply -f ingress-simple-selfsigned.yaml -n cfe-apps
ingress.networking.k8s.io/nginx-ingress-selfsigned created
```



```shell
$ k apply -f ingress-simple-selfsigned.yaml -n cfe-apps
ingress.networking.k8s.io/nginx-ingress-selfsigned created
```



```shell
$ host nginx.example.com
nginx.example.com has address 10.6.115.251
```

![](/img/nginx-private.png)  

![](/img/nginx-cert.png)

![](/img/nginx-app-https.png)


