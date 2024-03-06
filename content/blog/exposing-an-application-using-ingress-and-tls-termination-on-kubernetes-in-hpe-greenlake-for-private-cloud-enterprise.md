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

### Set up load balancer


```shell
$ k get all -n metallb-system
NAME                              READY   STATUS    RESTARTS   AGE
pod/controller-57b4fdc957-56wv8   1/1     Running   0          22m
pod/speaker-c7sgk                 1/1     Running   0          22m
pod/speaker-dtlpm                 1/1     Running   0          22m
pod/speaker-gxccz                 1/1     Running   0          22m
pod/speaker-pwl87                 1/1     Running   0          22m
pod/speaker-rvvkz                 1/1     Running   0          22m
pod/speaker-wxd5n                 1/1     Running   0          22m

NAME                      TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
service/webhook-service   ClusterIP   10.102.54.20   <none>        443/TCP   22m

NAME                     DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR            AGE
daemonset.apps/speaker   6         6         6       6            6           kubernetes.io/os=linux   22m

NAME                         READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/controller   1/1     1            1           22m

NAME                                    DESIRED   CURRENT   READY   AGE
replicaset.apps/controller-57b4fdc957   1         1         1       22m
```

```shell
$ k get ipaddresspools -n metallb-system
NAME       AUTO ASSIGN   AVOID BUGGY IPS   ADDRESSES
cfe-pool   true          false             ["10.6.115.251-10.6.115.254"]
```

```shell
$ k get l2advertisements -n metallb-system
NAME           IPADDRESSPOOLS   IPADDRESSPOOL SELECTORS   INTERFACES
cfe-l2advert   ["cfe-pool"]
```

### Deploy Ngnix ingress controller

```shell
$ helm upgrade --install ingress-nginx ingress-nginx \
>   --repo https://kubernetes.github.io/ingress-nginx \
>   --namespace ingress-nginx --create-namespace
Release "ingress-nginx" does not exist. Installing it now.
NAME: ingress-nginx
LAST DEPLOYED: Wed Mar  6 18:30:55 2024
NAMESPACE: ingress-nginx
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
The ingress-nginx controller has been installed.
It may take a few minutes for the load balancer IP to be available.
You can watch the status by running 'kubectl get service --namespace ingress-nginx ingress-nginx-controller --output wide --watch'

An example Ingress that makes use of the controller:
  apiVersion: networking.k8s.io/v1
  kind: Ingress
  metadata:
    name: example
    namespace: foo
  spec:
    ingressClassName: nginx
    rules:
      - host: www.example.com
        http:
          paths:
            - pathType: Prefix
              backend:
                service:
                  name: exampleService
                  port:
                    number: 80
              path: /
    # This section is only required if TLS is to be enabled for the Ingress
    tls:
      - hosts:
        - www.example.com
        secretName: example-tls

If TLS is enabled for the Ingress, a Secret containing the certificate and key must also be provided:

  apiVersion: v1
  kind: Secret
  metadata:
    name: example-tls
    namespace: foo
  data:
    tls.crt: <base64 encoded cert>
    tls.key: <base64 encoded key>
  type: kubernetes.io/tls
```


```shell

guoping@guoping-vm ~/CFE/POC/ingress-nginx $ k get all -n ingress-nginx
NAME                                            READY   STATUS    RESTARTS   AGE
pod/ingress-nginx-controller-548768956f-8bz2q   1/1     Running   0          15m

NAME                                         TYPE           CLUSTER-IP       EXTERNAL-IP    PORT(S)                      AGE
service/ingress-nginx-controller             LoadBalancer   10.108.173.7     10.6.115.251   80:32734/TCP,443:32265/TCP   15m
service/ingress-nginx-controller-admission   ClusterIP      10.108.100.150   <none>         443/TCP                      15m

NAME                                       READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/ingress-nginx-controller   1/1     1            1           15m

NAME                                                  DESIRED   CURRENT   READY   AGE
replicaset.apps/ingress-nginx-controller-548768956f   1         1         1       15m
```
T﻿he service *ingress-nginx-controller* gets deployed as the service type of *LoadBalancer* with the *EXTERNAL-IP* assigned as *10.6.115.251*.

### Install cert-manager

```shell
$ k get all -n cert-manager
NAME                                           READY   STATUS    RESTARTS   AGE
pod/cert-manager-59fbb6655d-h7sqb              1/1     Running   0          18s
pod/cert-manager-cainjector-69548575fb-7fqd2   1/1     Running   0          18s
pod/cert-manager-webhook-57b78f476d-mp45s      1/1     Running   0          16s

NAME                           TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
service/cert-manager           ClusterIP   10.107.221.97    <none>        9402/TCP   20s
service/cert-manager-webhook   ClusterIP   10.104.243.185   <none>        443/TCP    19s

NAME                                      READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/cert-manager              1/1     1            1           18s
deployment.apps/cert-manager-cainjector   1/1     1            1           18s
deployment.apps/cert-manager-webhook      1/1     1            1           17s

NAME                                                 DESIRED   CURRENT   READY   AGE
replicaset.apps/cert-manager-59fbb6655d              1         1         1       19s
replicaset.apps/cert-manager-cainjector-69548575fb   1         1         1       19s
replicaset.apps/cert-manager-webhook-57b78f476d      1         1         1       18s
```



```shell
$ k create ns nginx-apps
namespace/nginx-apps created

$ cat issuer-selfsigned.yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
 name: cfe-selfsigned-issuer
spec:
 selfSigned: {}

$ k apply -f issuer-selfsigned.yaml -n nginx-apps
issuer.cert-manager.io/cfe-selfsigned-issuer created

 $ k get issuer -n nginx-apps
NAME                    READY   AGE
cfe-selfsigned-issuer   True    115s
```


```shell
$ cat certificate.yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
 name: cfe-selfsigned-tls
spec:
 # name of the tls secret to store
 # the automatically generated certificate/key pair
 secretName: cfe-tls-key-pair
 isCA: true
 issuerRef:
   name: cfe-selfsigned-issuer
   kind: Issuer
 commonName: "example.com"
 dnsNames:
 # one or more fully-qualified domain name
 # can be defined here
 - green.nginx.example.com
 - blue.nginx.example.com
 - nginx.example.com
 - example.com
```


```shell
$ k apply -f certificate.yaml -n nginx-apps
certificate.cert-manager.io/cfe-selfsigned-tls created

$ k get certificate -n nginx-apps
NAME                 READY   SECRET             AGE
cfe-selfsigned-tls   True    cfe-tls-key-pair   17s

$ k get secrets -n nginx-apps cfe-tls-key-pair
NAME               TYPE                DATA   AGE
cfe-tls-key-pair   kubernetes.io/tls   3      2m25s
```

### Install Nginx applications

```shell
$ tree ingress-demo/
ingress-demo/
├── apps
│   ├── nginx-blue.yaml
│   ├── nginx-green.yaml
│   └── nginx-main.yaml
├── ingress-host-based-selfsigned.yaml
├── ingress-path-based-selfsigned.yaml
└── README.md
```


```shell
$ cd ingress-demo/
$ k apply -f apps/nginx-main.yaml -n nginx-apps
service/nginx-main created
deployment.apps/nginx-main created
$ k apply -f apps/nginx-green.yaml -n nginx-apps
service/nginx-green created
deployment.apps/nginx-green created
$ k apply -f apps/nginx-blue.yaml -n nginx-apps
service/nginx-blue created
deployment.apps/nginx-blue created
```


```shell
$ k get all -n nginx-apps
NAME                              READY   STATUS    RESTARTS   AGE
pod/nginx-blue-78647f4c4b-z8wq9   1/1     Running   0          10s
pod/nginx-green-8956bbd9f-zz7hk   1/1     Running   0          22s
pod/nginx-main-64bfd77895-tf7xd   1/1     Running   0          31s

NAME                  TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
service/nginx-blue    ClusterIP   10.108.51.116   <none>        80/TCP    15s
service/nginx-green   ClusterIP   10.106.115.65   <none>        80/TCP    23s
service/nginx-main    ClusterIP   10.108.33.44    <none>        80/TCP    32s

NAME                          READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/nginx-blue    1/1     1            1           15s
deployment.apps/nginx-green   1/1     1            1           24s
deployment.apps/nginx-main    1/1     1            1           32s

NAME                                    DESIRED   CURRENT   READY   AGE
replicaset.apps/nginx-blue-78647f4c4b   1         1         1       15s
replicaset.apps/nginx-green-8956bbd9f   1         1         1       24s
replicaset.apps/nginx-main-64bfd77895   1         1         1       32s
```

### Deploy Ingress

```shell
 $ cat ingress-host-based-selfsigned.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-host-based-selfsigned
  annotations:
    ingress.kubernetes.io/ssl-redirect: "true"
    #kubernetes.io/ingress.class: "nginx"
    cert-manager.io/issuer: "nginx-selfsinged-issuer"
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
  - host: blue.nginx.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: nginx-blue
            port:
              number: 80
  - host: green.nginx.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: nginx-green
            port:
              number: 80
```


```shell
$ k apply -f ingress-host-based-selfsigned.yaml -n nginx-apps
ingress.networking.k8s.io/ingress-host-based-selfsigned created
$ k get ingress -n nginx-apps
NAME                            CLASS   HOSTS                                                              ADDRESS   PORTS     AGE
ingress-host-based-selfsigned   nginx   nginx.example.com,blue.nginx.example.com,green.nginx.example.com             80, 443   9s
$ k describe ingress -n nginx-apps
Name:             ingress-host-based-selfsigned
Labels:           <none>
Namespace:        nginx-apps
Address:
Ingress Class:    nginx
Default backend:  <default>
TLS:
  cfe-tls-key-pair terminates nginx.example.com
Rules:
  Host                     Path  Backends
  ----                     ----  --------
  nginx.example.com
                           /   nginx-main:80 (10.192.4.44:80)
  blue.nginx.example.com
                           /   nginx-blue:80 (10.192.3.78:80)
  green.nginx.example.com
                           /   nginx-green:80 (10.192.4.45:80)
Annotations:               cert-manager.io/issuer: nginx-selfsinged-issuer
                           ingress.kubernetes.io/ssl-redirect: true
Events:
  Type    Reason             Age   From                       Message
  ----    ------             ----  ----                       -------
  Normal  Sync               20s   nginx-ingress-controller   Scheduled for sync
  Normal  CreateCertificate  20s   cert-manager-ingress-shim  Successfully created Certificate "cfe-tls-key-pair"
```

```shell
$ host nginx.example.com
nginx.example.com has address 10.6.115.251
Host nginx.example.com not found: 3(NXDOMAIN)
$ host green.nginx.example.com
green.nginx.example.com has address 10.6.115.251
Host green.nginx.example.com not found: 3(NXDOMAIN)
$ host blue.nginx.example.com
blue.nginx.example.com has address 10.6.115.251
```

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


