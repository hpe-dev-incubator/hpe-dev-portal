---
title: Exposing applications using Ingress and TLS termination on Kubernetes in
  HPE GreenLake for Private Cloud Enterprise
date: 2024-03-14T13:35:56.941Z
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

This blog post describes the process to expose applications that are deployed and run on Kubernetes (K8s) in HPE GreenLake for Private Cloud Enterprise to the external world. Three Nginx apps that serve as Web servers and each prints out a customized message will be used as sample applications to expose. The applications themselves will be deployed as the service types of *ClusterIP*, running on the port 80 over HTTP. Using cert-manager and TLS termination on configured MetalLB load balancer, the applications will be exposed over HTTPS. 

### Overview

[HPE GreenLake for Private Cloud Enterprise: Containers](https://www.hpe.com/us/en/greenlake/containers.html), one of the HPE GreenLake cloud services available on the HPE GreenLake for Private Cloud Enterprise, allows customers to create a Kubernetes (K8s) cluster, view details about existing clusters, and deploy containerized applications to the cluster. It provides an enterprise-grade container management service using open source K8s.  

When application workloads get deployed to the K8s cluster, you can create services to expose the applications. By default, a service is created with the service type of *ClusterIP* that supports internal connectivity between different components of the application. In HPE GreenLake for Private Cloud Enterprise: Containers, you can create services with the type of NodePort for the application workloads deployed in K8s clusters using the label hpecp.hpe.com/hpecp-internal-gateway=true. The services will be automatically exposed to a container platform gateway host with assigned ports. The deployed workloads will become accessible externally using the gateway host name and the assigned ports as access URLs. For both service type, *ClusterIP* and NodePort , applications themselves run on HTTP. There is one common requirement to expose the applications to be accessed securely over HTTPS. This requires to get a valid SSL/TLS certificate in K8s and work with load balancers and Ingress.

![](/img/tls-termination-s.png)

This blog post, I 

### Prerequisites

Before starting, make sure you have the following:

* A K8s cluster, being provisioned in HPE GreenLake for Private Cloud Enterprise
* The *kubectl* CLI tool, together with the kubeconfig file for accessing the K8s cluster
* The Helm CLI tool, version 3.12.0 or later
* A domain and a list of subdomain to generate the SSL certificate and host your applications in the cluster

### Set up load balancer with MetalLB

You can install and set up the load balancer by following up the blog post [Setting up the load balancer with MetalLB](https://developer.hpe.com/blog/set-up-load-balancer-with-metallb-in-hpe-greenlake-for-private-cloud-enterprise/).

H﻿ere is the deployed MetalLB to the namespace *metallb-system* in the cluster:

```shell
$ kubectl get all -n metallb-system
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

H﻿ere is the range of virtual IP addresses, *"10.6.115.251-10.6.115.254"*, defined in the CRD resource *IPAddressPool*, and the layer 2 service IP address announcement in the CRD resource *L2Advertisement*:

```shell
$ kubectl get ipaddresspools -n metallb-system
NAME       AUTO ASSIGN   AVOID BUGGY IPS   ADDRESSES
cfe-pool   true          false             ["10.6.115.251-10.6.115.254"]

$ kubectl get l2advertisements -n metallb-system
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
$ kubectl get all -n ingress-nginx
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
$ kubectl get all -n cert-manager
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
$ kubectl create ns nginx-apps
namespace/nginx-apps created

$ cat issuer-selfsigned.yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
 name: cfe-selfsigned-issuer
spec:
 selfSigned: {}

$ kubectl apply -f issuer-selfsigned.yaml -n nginx-apps
issuer.cert-manager.io/cfe-selfsigned-issuer created

$ kubectl get issuer -n nginx-apps
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
$ kubectl apply -f certificate.yaml -n nginx-apps
certificate.cert-manager.io/cfe-selfsigned-tls created

$ kubectl get certificate -n nginx-apps
NAME                 READY   SECRET             AGE
cfe-selfsigned-tls   True    cfe-tls-key-pair   17s

$ kubectl get secrets -n nginx-apps cfe-tls-key-pair
NAME               TYPE                DATA   AGE
cfe-tls-key-pair   kubernetes.io/tls   3      2m25s
```

### Install Nginx applications

Three Nginx applicaitons from the GitHub repo [ingress-demo](https://github.com/GuopingJia/ingress-demo.git) will be deployed as sample applications to the cluster. 

T﻿he repo's *apps* folder contains the Nginx applications' YAML manifest files:

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

T﻿ype the following commands to deploy those Nginx applications to the namespace *nginx-apps*:

```shell
$ cd ingress-demo/
$ kubectl apply -f apps/nginx-main.yaml -n nginx-apps
service/nginx-main created
deployment.apps/nginx-main created
$ kubectl apply -f apps/nginx-green.yaml -n nginx-apps
service/nginx-green created
deployment.apps/nginx-green created
$ kubectl apply -f apps/nginx-blue.yaml -n nginx-apps
service/nginx-blue created
deployment.apps/nginx-blue created
```

Check with below command to see that all the Nginx Pods are in Running state:  

```shell
$ kubectl get all -n nginx-apps
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

T﻿ype the following commend to check that all the application service endpoints have been populated:

```shell
$ kubectl get endpoints -n nginx-apps
NAME          ENDPOINTS        AGE
nginx-blue    10.192.3.78:80    1m
nginx-green   10.192.4.45:80    1m
nginx-main    10.192.4.44:80    1m
```

### Set up Ingress TLS

The Ingress resource with TLS has to be created. Here is the sample Ingress TLS resource:

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

In the above sample YAML manifest file, there is the *tls block* that contains the hostname *'nginx.example.com'* and the tls secret *cfe-tls-key-pair* created in the certification steps. There is also the *rules block* in which a list of routing rules is defined per host, e.g., host *nginx.example.com* will be routed to the application service *nginx-main* in the backend.  

T﻿ype the following command to deploy the Ingress resource to the namespace *nginx-apps*:

```shell
$ kubectl apply -f ingress-host-based-selfsigned.yaml -n nginx-apps
ingress.networking.k8s.io/ingress-host-based-selfsigned created
```

T﻿ype below command to check the details of the *TLS* and *Rules* settings:

```shell
$ kubectl get ingress -n nginx-apps
NAME                            CLASS   HOSTS                                                              ADDRESS   PORTS     AGE
ingress-host-based-selfsigned   nginx   nginx.example.com,blue.nginx.example.com,green.nginx.example.com             80, 443   9s
$ kubectl describe ingress -n nginx-apps
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

#﻿## Access deployed Nginx applications

W﻿ith all Nginx applications, together with the K8s Ingress resource, being deployed to the cluster, you need set up and make sure the domain and the subdomain names, i.e., *example.com* & **.nginx.example.com*, point to the the external IP address *'10.6.115.251'* which is assigned to the *Nginx ingress controller*.  

Type the following commands to check this is done correctly: 

```shell
$ host nginx.example.com
nginx.example.com has address 10.6.115.251

$ host green.nginx.example.com
green.nginx.example.com has address 10.6.115.251

$ host blue.nginx.example.com
blue.nginx.example.com has address 10.6.115.251
```

You can then validate the Ingres TLS configuration of the deployed Nginx applications to the cluster using the browser. 

S﻿tart the browser and type the URL *nginx.example.com*, it will be rediected over HTTPS with the warning message *'Your connection is not private'*: 

![](/img/nginx-main-warning.png)

T﻿his is due to the fact the self-signed certifcate is generated in cert-manager and configured in the K8s Ingress resource.

C﻿lick *Not secure* and start the Certificate Viewer to check the certificate:

![](/img/nginx-main-cert.png)

C﻿lick *Proceed to nginx.example.com (unsafe)*, you then go to the Nginx *MAIN* page:

![](/img/nginx-main.png)

Type the URL *green.nginx.example.com* to the browser, it will be rediected over HTTPS with the same warning message *'Your connection is not private'*:   

![](/img/nginx-green-warning.png)

C﻿lick *Proceed to green.nginx.example.com (unsafe)*, you then go to the Nginx *GREEN* page:

![](/img/nginx-green.png)

T﻿he same thing occurs when type the URL *blue.nginx.example.com* to the browser. The access will be rediected over HTTPS with the same warning message *'Your connection is not private'*:  

![](/img/nginx-blue-warning.png)

C﻿lick *Proceed to blue.nginx.example.com (unsafe)*, you then go to the Nginx *BLEU* page:  

![](/img/nginx-blue.png)

You have successfully configured the Ingress with the generated TLS c﻿ertificate and exposed the deployed applications with TLS termination. 

### Conclusion


This blog post provided a comprehensive guide on how to expose applications deployed in a K8 cluster and make them accessible securely via HTTPS. It detailed the process of configuring TLS termination on an Ingress controller, utilizing a K8s Ingress resource and a self-signed TLS certificate generated with cert-manager. Although the emphasis was on self-signed certificates, the procedure is applicable to any type of certificates. This 
enables customers to follow up the steps using their own CA certificates for Ingress TLS termination.

Please keep coming back to the [HPE Developer Community blog](https://developer.hpe.com/blog/) to learn more about HPE GreenLake for Private Cloud Enterprise.