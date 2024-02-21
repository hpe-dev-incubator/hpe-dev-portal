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
<style> li { font-size: 27px; line-height: 33px; max-width: none; } </style>

T﻿his blog post shows you the detailed process to deploy Super Mario game to the Kubernetes in HPE GreenLake for Private Cloud Enterprise.

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

```shell
$ cat issuer-selfsigned.yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
 name: cfe-selfsigned-issuer
spec:
 selfSigned: {}

$ k apply -f issuer-selfsigned.yaml -n cfe-games
issuer.cert-manager.io/cfe-selfsigned-issuer created

$ k get issuer -n cfe-games
NAME                    READY   AGE
cfe-selfsigned-issuer   True    10s
```

```shell
$ cat certificate-game.yaml
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
 - super-mario.example.com
 - tetris.example.com
 - example.com

$ k apply -f certificate-game.yaml -n cfe-games
certificate.cert-manager.io/cfe-selfsigned-tls created

$ k get certificate -n cfe-games
NAME                 READY   SECRET             AGE
cfe-selfsigned-tls   True    cfe-tls-key-pair   8s

$ k get secrets  -n cfe-games cfe-tls-key-pair
NAME               TYPE                DATA   AGE
cfe-tls-key-pair   kubernetes.io/tls   3      35s
```

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

```shell
$ k apply -f super-mario/ -n cfe-games
deployment.apps/mario-deployment created
service/mario-service created

$ k apply -f tetris/ -n cfe-games
deployment.apps/tetris-deployment created
service/tetris-service created


$ k get all -n cfe-games
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

```shell
$ cat ingress-host-based-selfsigned-games.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-host-based-selfsigned
  annotations:
    ingress.kubernetes.io/ssl-redirect: "true"
    #kubernetes.io/ingress.class: "nginx"
    cert-manager.io/issuer: "cfe-selfsinged-issuer"
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

```shell
$ k describe ingress ingress-host-based-selfsigned -n cfe-games
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

```shell
$ host super-mario.example.com
super-mario.example.com has address 10.6.115.251


$ host tetris.example.com
tetris.example.com has address 10.6.115.251
```

![](/img/mario-private.png)

![](/img/mario-certificate.png)

![](/img/super-mario.png)

![](/img/tetris-private.png)

![](/img/tetris-start.png)

![](/img/tetris.png)