---
title: Deploying Super Mario game on Kubernetes in HPE GreenLake for Private
  Cloud Enterprise
date: 2024-03-29T17:53:09.850Z
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
  - hpe-greenlake-for-private-cloud-enterprise
  - TLS termination
---
<style> li { font-size: 27px; line-height: 33px; max-width: none; } </style>

In my recent blog post, I showed you [how to expose applications using Ingress and TLS termination on Kubernetes (K8s) in HPE GreenLake for Private Cloud Enterprise](https://developer.hpe.com/blog/exposing-an-application-using-ingress-and-tls-termination-on-kubernetes-in-hpe-greenlake-for-private-cloud-enterprise/). Let's have a little fun practicing this through a real-world use case where I walk you through the steps of deploying gami﻿ng applications, like *Super Mario* and *Tetris*, on K8s in the HPE GreenLake for Private Cloud Enterprise. By using K8s Ingress, TLS termination, and a range of suitable tools, *Super Mario* and *Tetris* can be made available and securely accessible via HTTPS. The setup I show here strictly adheres to the rigorous security and compliance standards of the K8s production environment in HPE GreenLake for Private Cloud Enterprise.

### Overview

[HPE GreenLake for Private Cloud Enterprise: Containers](https://www.hpe.com/us/en/greenlake/containers.html), one of the HPE GreenLake cloud services available on the HPE GreenLake for Private Cloud Enterprise, allows customers to create a K8s cluster and deploy containerized applications to the cluster. It provides an enterprise-grade container management service using open source K8s.  

Utilizing *YAML* manifest files or *Helm* charts along with Docker images, the installation of gami﻿ng applications on the K8s cluster is a straightforward process. Tools like *kubectl*, *helm*, and [Kustomize](https://kustomize.io/) are available for this purpose. The complexity arises when it comes to securely exposing the deployed games for external access over HTTPS, a common requirement for on-premises K8s clusters. This involves the generation and management of SSL/TLS certificates for the games within the cluster. These certificates are vital for secure inter-service communication. Proper installation and management are key to preventing access issues and security threats. As game traffic increases, particularly during peak usage hours, it becomes crucial to set up gami﻿ng applications with load balancing access. This presents a significant challenge ensuring the availability of load balancing for gami﻿ng applications running on K8s.

Here's some of the things you need to deploy *Super Mario* and *Tetris* in an HPE GreenLake for Private Cloud Enterprise cluster and expose them using K8s Ingress and TLS termination. Remember that [MetalLB](https://developer.hpe.com/blog/set-up-load-balancer-with-metallb-in-hpe-greenlake-for-private-cloud-enterprise/) is employed to establish the load balancer in the cluster and [cert-manager](https://developer.hpe.com/blog/generating-self-signed-certificates-using-cert-manager-for-kubernetes-in-hpe-greenlake-for-private-cloud-entreprise/) is deployed for the generation and management of SSL/TLS certificates, which are stored as K8s *Secret* objects and made available to the entire cluster upon creation. The [Nginx Ingress controller](https://www.nginx.com/products/nginx-ingress-controller/) is deployed within the cluster. The Ingress TLS configuration is used to decrypt encrypted traffic over HTTPS at the load balancer setup and forward the decrypted traffic to the target gami﻿ng applications. This configuration offloads the resource-intensive cryptographic operations to the dedicated load balancer, allowing the backend gami﻿ng applications to concentrate on efficiently processing client requests and responses. The gami﻿ng applications are deployed with the *ClusterIP* service type in the backend, providing internal connectivity and being solely accessible from within the cluster. They do not directly handle SSL/TLS encryption and decryption.

![](/img/game-deploy.png)

### Prerequisites

Before starting, make sure you have the following:

* A K8s cluster, being provisioned in HPE GreenLake for Private Cloud Enterprise
* The *kubectl* CLI tool, together with the kubeconfig file for accessing the K8s cluster
* The *helm* CLI tool, version 3.12.0 or later
* A domain and a list of subdomains to generate the SSL certificate and host the g﻿ame applications in the cluster
* The o﻿ptional *openssl* CLI tool, for validating the generated certificates

### Deploy Super Mario

The game *Super Mario*, together with *Tetris*, can be deployed to the cluster using the *YAML* manifest files from the GitHub repo [k8s-games](https://github.com/GuopingJia/k8s-games): 

```shell
$ tree k8s-games/
k8s-games/
├── README.md
├── super-mario
│   ├── deployment.yaml
│   └── service.yaml
└── tetris
    ├── deployment.yaml
    └── service.yaml
```

T﻿ype the following commands to deploy *Super Mario* and *Tetris* to the namespace *cfe-games* in the cluster:

```shell
$ kubectl create ns cfe-games
namespace/cfe-games created

$ kubectl apply -f super-mario/ -n cfe-games
deployment.apps/mario-deployment created
service/mario-service created

$ kubectl apply -f tetris/ -n cfe-games
deployment.apps/tetris-deployment created
service/tetris-service created
```

Type the command shown below to check the details of the game deployment:  

```shell
$ kubectl get all -n cfe-games
NAME                                     READY   STATUS    RESTARTS   AGE
pod/mario-deployment-96f79d8f-dw9hh      1/1     Running   0          19s
pod/mario-deployment-96f79d8f-wsf7s      1/1     Running   0          13s
pod/tetris-deployment-86d744fb47-7kmwl   1/1     Running   0          7s
pod/tetris-deployment-86d744fb47-hqmgd   1/1     Running   0          10s

NAME                     TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
service/mario-service    ClusterIP   10.104.144.88   <none>        80/TCP    22s
service/tetris-service   ClusterIP   10.111.218.14   <none>        80/TCP    10s

NAME                                READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/mario-deployment    2/2     2            2           24s
deployment.apps/tetris-deployment   2/2     2            2           12s

NAME                                           DESIRED   CURRENT   READY   AGE
replicaset.apps/mario-deployment-96f79d8f      2         2         2       24s
replicaset.apps/tetris-deployment-86d744fb47   2         2         2       12s
```

Two games, *mario-deployment* and *tetris-deployment*, are deployed in the cluster, each running with 2 Pod replicas by default. T﻿hey are exposed as the *ClusterIP* type o﻿f services, providing internal connectivity and solely being accessible from within the cluster.

You can configure the [*Horizontal Pod Autoscaling* (HPA)](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) in the cluster by using the K8s *HorizontalPodAutoscaler* resource. It will automatically scale the workload by deploying more Pods in the cluster according to gami﻿ng application memory or CPU usage.

T﻿ype the following command to check that all the game service endpoints have been populated:

```shell
$ kubectl get endpoints -n cfe-games
NAME             ENDPOINTS                            AGE
mario-service    10.192.3.118:80,10.192.4.32:80       60s
tetris-service   10.192.3.119:3000,10.192.4.33:3000   50s
```

### Set up the load balancer with *MetalLB*

You can install *MetalLB* and set up the load balancer in the K8s cluster by following the instructions shown in the blog post [Setting up the load balancer with MetalLB](https://developer.hpe.com/blog/set-up-load-balancer-with-metallb-in-hpe-greenlake-for-private-cloud-enterprise/).

H﻿ere is the deployed *MetalLB* to the namespace *metallb-system* in the cluster:

```shell
$ kubectl get all -n metallb-system
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

By running the following commands, you can see a range of virtual IP addresses, *"10.6.115.251-10.6.115.254"*, defined in the CRD resource *IPAddressPool*, and the layer 2 service IP address announcement in the CRD resource *L2Advertisement*:

```shell
$ kubectl get ipaddresspools -n metallb-system
NAME       AUTO ASSIGN   AVOID BUGGY IPS   ADDRESSES
cfe-pool   true          false             ["10.6.115.251-10.6.115.254"]



$ kubectl get l2advertisements -n metallb-system
NAME           IPADDRESSPOOLS   IPADDRESSPOOL SELECTORS   INTERFACES
cfe-l2advert   ["cfe-pool"]
```

### Generate a self-signed certificate using cert-manager

You can d﻿eploy cert-manager to the K8s cluster and generate a self-signed certificate by following the instructions found in the blog post [Generating self-signed certificates using cert-manager](https://developer.hpe.com/blog/generating-self-signed-certificates-using-cert-manager-for-kubernetes-in-hpe-greenlake-for-private-cloud-entreprise/).

H﻿ere is the cert-manager deployed to the namespace *cert-manager* in the cluster:

```shell
$ kubectl get all -n cert-manager
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

Below is the deployed self-signed custom resource definition (CRD) *Issuer* in the namespace *cfe-games* where the game applications are deployed. You want to generate the certificate to this namespace.

```shell
$ kubectl get issuer -n cfe-games
NAME                    READY   AGE
cfe-selfsigned-issuer   True    10s
```

Here is the generated self-signed certificate in the namespace *cfe-games*:

```shell
$ kubectl get certificate -n cfe-games
NAME                 READY   SECRET             AGE
cfe-selfsigned-tls   True    cfe-tls-key-pair   8s
```

T﻿he K8s *Secret* *'cfe-tls-key-pair'* is created automatically in the same namespace as part of certificate deployment:

```shell
$ kubectl get secrets  -n cfe-games cfe-tls-key-pair
NAME               TYPE                DATA   AGE
cfe-tls-key-pair   kubernetes.io/tls   3      35s
```

T﻿ype the following *openssl* command to check the content of the generated certificate:

```shell
$ openssl x509 -in <(kubectl get secret -n cfe-games cfe-tls-key-pair -o jsonpath='{.data.tls\.crt}' | base64 -d) -text -noout
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number:
            2d:0e:ee:67:d2:e0:e2:e6:bc:f2:9a:da:2b:78:66:86
        Signature Algorithm: sha256WithRSAEncryption
        Issuer: CN = example.com
        Validity
            Not Before: Feb 21 17:33:40 2024 GMT
            Not After : May 21 17:33:40 2024 GMT
        Subject: CN = example.com
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                RSA Public-Key: (2048 bit)
                Modulus:
                    00:d7:88:2a:e6:67:20:62:e4:25:f8:cd:63:b7:75:
                    bf:ac:d4:5a:8a:32:1c:06:29:17:96:cb:6b:36:97:
                    7f:9b:1d:f2:d6:f2:a4:f1:63:32:9b:7f:42:a1:31:
                    40:b6:02:ec:0b:37:a6:60:fb:11:72:28:96:91:90:
                    55:26:c5:58:3c:dd:a0:4b:a2:ab:33:19:29:88:24:
                    da:73:81:af:99:9b:df:7f:26:14:36:1b:56:93:24:
                    e9:91:d0:89:e1:62:d0:45:22:64:0b:c4:1d:96:71:
                    ab:ee:61:94:00:f6:60:71:10:10:fc:3e:d1:6b:b6:
                    5b:0b:bf:18:0c:86:90:b0:f9:eb:78:8c:dc:90:4e:
                    ef:87:1f:ac:22:56:2b:92:23:ae:fe:bb:48:1e:13:
                    40:03:b7:54:02:44:8f:ae:c6:61:bf:d4:e9:f7:17:
                    72:a8:98:72:b7:a6:e0:16:29:8d:ca:4a:1e:08:89:
                    78:f7:88:b7:ac:d2:b8:8d:89:88:c3:c7:04:f4:ff:
                    00:64:37:6f:3f:5a:43:2c:ce:e4:69:b2:a8:44:fe:
                    77:41:ec:97:b8:7b:82:49:b0:65:8e:fc:1f:1c:2b:
                    37:ea:46:9d:e4:5c:a0:56:9f:d8:3b:78:83:28:b5:
                    ac:a9:61:ce:25:c7:54:c8:a3:96:f6:a8:48:f4:57:
                    56:3b
                Exponent: 65537 (0x10001)
        X509v3 extensions:
            X509v3 Key Usage: critical
                Digital Signature, Key Encipherment, Certificate Sign
            X509v3 Basic Constraints: critical
                CA:TRUE
            X509v3 Subject Key Identifier:
                3F:DD:BB:BB:DB:23:47:E1:EC:39:1E:BE:03:AC:D4:7E:2A:E2:A6:FA
            X509v3 Subject Alternative Name:
                DNS:super-mario.example.com, DNS:tetris.example.com, DNS:example.com
    Signature Algorithm: sha256WithRSAEncryption
         78:46:61:2d:b8:27:fe:18:59:b2:57:ef:88:2b:2f:20:9f:a5:
         4a:28:33:64:46:78:e3:c4:7f:40:4a:38:ad:ca:0a:2e:7d:31:
         7f:70:81:e1:50:b6:4e:a5:02:31:bf:26:44:89:b2:1f:5c:3d:
         63:b8:62:bf:9c:b3:f0:96:76:bb:b0:3e:47:0e:bc:5e:fa:9c:
         9c:98:36:1d:2f:72:3d:b9:11:30:94:b0:2e:2f:a3:57:18:07:
         5d:bf:aa:0d:c6:36:20:2a:8f:a6:11:7c:e4:2f:03:07:2e:c4:
         cd:33:07:3f:c2:54:30:e0:bf:d1:8e:20:0a:bc:a3:90:39:46:
         d4:ed:03:c2:71:a1:43:b4:a6:c0:73:13:14:ea:a4:52:39:8f:
         72:59:00:1a:5f:1c:6e:1e:b7:4d:b5:9e:43:cd:e7:89:5a:07:
         ad:ce:41:f4:5a:cd:73:ee:bc:f4:01:73:92:9d:c4:a6:f1:8d:
         eb:43:af:65:78:8d:f0:e6:c3:df:bc:44:ca:19:c5:da:3f:a2:
         4d:89:fa:8e:63:33:3d:4d:8d:b3:98:3b:d9:12:c0:d9:3a:82:
         07:bc:81:fb:5d:c9:e5:38:3c:ec:d3:3e:e9:bc:e4:13:84:07:
         f3:c7:85:8a:46:ba:69:13:c7:a8:14:42:4b:ee:f9:2a:b4:3b:
         d9:8f:9c:50
```

The line *X509v3 Subject Alternative Name* contains the *dnsNames*, *'super-mario.example.com'* & *'tetris.example.com'*, which host two games, *Super Mario* and *Tetris*, respectively in the cluster.

### Deploy Nginx Ingress controller

In order for an Ingress to work in the cluster, there must be an Ingress controller being deployed and running. It's the Ingress controller that accesses the certificate and the routing rules defined on the Ingress resource and makes them part of its configuration. 

A variety of Ingress controllers are available for deployment in the cluster, including [Traefik](https://doc.traefik.io/traefik/providers/kubernetes-ingress/), [HAProxy](https://github.com/haproxytech/kubernetes-ingress#readme) and [Nginx Ingress controller](https://www.nginx.com/products/nginx-ingress-controller/). Execute the command below to install the Nginx Ingress controller to the cluster using *Helm*:

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

T﻿he Nginx Ingress controller is deployed to the namespace *ingress-nginx* in the cluster. Type the following command to check the deployment details:

```shell
$ kubectl get all -n ingress-nginx
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

T﻿he service *ingress-nginx-controller* gets deployed as the service type of *LoadBalancer* with the *EXTERNAL-IP* assigned as *10.6.115.251*. This IP address will be used for setting up domain and subdomain name resolution.

### Set up Ingress TLS

The Ingress resource with TLS has to be created. Here is a sample Ingress TLS resource *ingress-host-based-selfsigned-games.yaml*:

```shell
$ cat ingress-host-based-selfsigned-games.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-host-based-selfsigned
  annotations:
    ingress.kubernetes.io/ssl-redirect: "true"
    cert-manager.io/issuer: "cfe-selfsigned-issuer"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - example.com
    secretName: cfe-tls-key-pair
  rules:
  - host: super-mario.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: mario-service
            port:
              number: 80
  - host: tetris.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: tetris-service
            port:
              number: 80
```

In the above sample YAML manifest file, there is the *'tls'* block that contains the hostname *'example.com'* and the secret *cfe-tls-key-pair* created in the certification step. There is also the *'rules'* block in which a list of routing rules is defined per host, e.g., the host *'super-mario.example.com'* will be routed to the Super Mario game service *'mario-service'* in the backend.  

T﻿ype the following command to deploy the Ingress resource to the namespace *cfe-games*:

```shell
$ kubectl apply -f ingress-host-based-selfsigned-games.yaml -n cfe-games
ingress.networking.k8s.io/ingress-host-based-selfsigned created
```

Check the details of the *TLS* and *Rules* settings by t﻿yping the following command:

```shell
$ kubectl describe ingress ingress-host-based-selfsigned -n cfe-games
Name:             ingress-host-based-selfsigned
Labels:           <none>
Namespace:        cfe-games
Address:
Ingress Class:    nginx
Default backend:  <default>
TLS:
  cfe-tls-key-pair terminates example.com
Rules:
  Host                     Path  Backends
  ----                     ----  --------
  super-mario.example.com
                           /   mario-service:80 (10.192.4.21:80,10.192.4.22:80)
  tetris.example.com
                           /   tetris-service:80 (10.192.3.231:3000,10.192.4.27:3000)
Annotations:               cert-manager.io/issuer: cfe-selfsinged-issuer
                           ingress.kubernetes.io/ssl-redirect: true
Events:
  Type    Reason             Age   From                       Message
  ----    ------             ----  ----                       -------
  Normal  Sync               30s   nginx-ingress-controller   Scheduled for sync
  Normal  CreateCertificate  30s   cert-manager-ingress-shim  Successfully created Certificate "cfe-tls-key-pair"
```

### Access deployed games

B﻿efore accessing the deployed games, you need set up the subdomain name resolution. For the subdomains, *super-mario.example.com* and *tetris.example.com*, the workstation host file has been used for DNS resolution.   

Type the following commands to check that the domain/subdomain name resolution is set up correctly:  

```shell
$ host super-mario.example.com
super-mario.example.com has address 10.6.115.251

$ host tetris.example.com
tetris.example.com has address 10.6.115.251
```

You can then access the deployed games using the browser. S﻿tart the browser and type the URL *super-mario.example.com*. It will be redirected over HTTPS with the warning message *'Your connection is not private'*: 

![](/img/mario-private.png)

T﻿his is due to the fact that the self-signed certifcate is generated in cert-manager and configured in the K8s Ingress resource.

C﻿lick *Not secure* and start the Certificate Viewer to check the certificate:

![](/img/mario-certificate.png)

C﻿lick *Proceed to super-mario.example.com (unsafe)*. You will land on the *SUPER MARIO* game page: 

![](/img/super-mario.png)

If you type the URL *tetris.example.com* to the browser, it will be redirected over HTTPS with the same warning message *'Your connection is not private'*:  

![](/img/tetris-private.png)

C﻿lick *Proceed to tetris.example.com (unsafe)*. You will then go to the Tetris *Start* page:

![](/img/tetris-start.png)

When you click on the *Start* button, you will land on the *Tetris* game page:

![](/img/tetris.png)

That's all there is to it! E﻿njoy playing your games!

### Conclusion

This blog post offers you a comprehensive guide on how to d﻿eploy *Super Mario* and *Tetris* in a K8 cluster and e﻿xpose those games to be securely accessed via HTTPS in HPE GreenLake for Private Cloud Enterprise. It details the process of configuring TLS termination on an Ingress controller at the load balancer setup, utilizing a K8s Ingress resource and a self-signed TLS certificate generated with cert-manager. This guide fully aligns with the stringent security and compliance requirements of the K8s production environment in HPE GreenLake for Private Cloud Enterprise. 

Please keep coming back to the [HPE Developer Community blog](https://developer.hpe.com/blog/) to learn more about HPE GreenLake for Private Cloud Enterprise and get more ideas on how you can use it in your everyday operations.