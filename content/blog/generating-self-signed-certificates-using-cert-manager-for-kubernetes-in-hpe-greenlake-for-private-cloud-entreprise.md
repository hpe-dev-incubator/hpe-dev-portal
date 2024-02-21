---
title: Generating self-signed certificates using cert-manager for Kubernetes in
  HPE GreenLake for Private Cloud Entreprise
date: 2024-02-07T09:19:25.857Z
author: Guoping Jia
authorimage: /img/guoping.png
disable: false
tags:
  - Self-signed certificate
  - Kubernetes
  - cert-manager
  - HPE GreenLake for Private Cloud Entreprise
---
<style> li { font-size: 27px; line-height: 33px; max-width: none; } </style>

I﻿n this blog post, I will describe you how to generate a self-signed certificate using cert-manager for K8s in HPE GreenLake for Private Cloud Entreprise. The generated self-signed certificates can be used for deploying TLS/SSL enabled applications in the cluster.

### Prerequisites

Before starting, make sure you have the following:

* A K8s cluster, being provisioned in HPE GreenLake for Private Cloud Enterprise
* The kubectl CLI tool, together with the kubeconfig file for accessing the K8s cluster
* The o﻿ptional openssl CLI tool, for validating the generated certificates 

### Deploy cert-manager

https://cert-manager.io/docs/installation/

```shell
$ kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.3/cert-manager.yaml
namespace/cert-manager created
customresourcedefinition.apiextensions.k8s.io/certificaterequests.cert-manager.io created
customresourcedefinition.apiextensions.k8s.io/certificates.cert-manager.io created
customresourcedefinition.apiextensions.k8s.io/challenges.acme.cert-manager.io created
customresourcedefinition.apiextensions.k8s.io/clusterissuers.cert-manager.io created
customresourcedefinition.apiextensions.k8s.io/issuers.cert-manager.io created
customresourcedefinition.apiextensions.k8s.io/orders.acme.cert-manager.io created
serviceaccount/cert-manager-cainjector created
serviceaccount/cert-manager created
serviceaccount/cert-manager-webhook created
configmap/cert-manager created
configmap/cert-manager-webhook created
clusterrole.rbac.authorization.k8s.io/cert-manager-cainjector created
clusterrole.rbac.authorization.k8s.io/cert-manager-controller-issuers created
clusterrole.rbac.authorization.k8s.io/cert-manager-controller-clusterissuers created
clusterrole.rbac.authorization.k8s.io/cert-manager-controller-certificates created
clusterrole.rbac.authorization.k8s.io/cert-manager-controller-orders created
clusterrole.rbac.authorization.k8s.io/cert-manager-controller-challenges created
clusterrole.rbac.authorization.k8s.io/cert-manager-controller-ingress-shim created
clusterrole.rbac.authorization.k8s.io/cert-manager-cluster-view created
clusterrole.rbac.authorization.k8s.io/cert-manager-view created
clusterrole.rbac.authorization.k8s.io/cert-manager-edit created
clusterrole.rbac.authorization.k8s.io/cert-manager-controller-approve:cert-manager-io created
clusterrole.rbac.authorization.k8s.io/cert-manager-controller-certificatesigningrequests created
clusterrole.rbac.authorization.k8s.io/cert-manager-webhook:subjectaccessreviews created
clusterrolebinding.rbac.authorization.k8s.io/cert-manager-cainjector created
clusterrolebinding.rbac.authorization.k8s.io/cert-manager-controller-issuers created
clusterrolebinding.rbac.authorization.k8s.io/cert-manager-controller-clusterissuers created
clusterrolebinding.rbac.authorization.k8s.io/cert-manager-controller-certificates created
clusterrolebinding.rbac.authorization.k8s.io/cert-manager-controller-orders created
clusterrolebinding.rbac.authorization.k8s.io/cert-manager-controller-challenges created
clusterrolebinding.rbac.authorization.k8s.io/cert-manager-controller-ingress-shim created
clusterrolebinding.rbac.authorization.k8s.io/cert-manager-controller-approve:cert-manager-io created
clusterrolebinding.rbac.authorization.k8s.io/cert-manager-controller-certificatesigningrequests created
clusterrolebinding.rbac.authorization.k8s.io/cert-manager-webhook:subjectaccessreviews created
role.rbac.authorization.k8s.io/cert-manager-cainjector:leaderelection created
role.rbac.authorization.k8s.io/cert-manager:leaderelection created
role.rbac.authorization.k8s.io/cert-manager-webhook:dynamic-serving created
rolebinding.rbac.authorization.k8s.io/cert-manager-cainjector:leaderelection created
rolebinding.rbac.authorization.k8s.io/cert-manager:leaderelection created
rolebinding.rbac.authorization.k8s.io/cert-manager-webhook:dynamic-serving created
service/cert-manager created
service/cert-manager-webhook created
deployment.apps/cert-manager-cainjector created
deployment.apps/cert-manager created
deployment.apps/cert-manager-webhook created
mutatingwebhookconfiguration.admissionregistration.k8s.io/cert-manager-webhook created
validatingwebhookconfiguration.admissionregistration.k8s.io/cert-manager-webhook created
```

T﻿he cert-manager will be installed to the namespace *cert-manager*. Type the following command to check that all the Pods  are in running status:

```shell



$ kubectl get all -n cert-manager
NAME                                           READY   STATUS    RESTARTS   AGE
pod/cert-manager-6bcdd5f7c-f7lfw               1/1     Running   0          3m36s
pod/cert-manager-cainjector-5d4577b4d9-jmpsp   1/1     Running   0          3m36s
pod/cert-manager-webhook-bf957dc77-s9r2g       1/1     Running   0          3m36s

NAME                           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
service/cert-manager           ClusterIP   10.109.28.203   <none>        9402/TCP   3m39s
service/cert-manager-webhook   ClusterIP   10.100.82.119   <none>        443/TCP    3m38s

NAME                                      READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/cert-manager              1/1     1            1           3m37s
deployment.apps/cert-manager-cainjector   1/1     1            1           3m38s
deployment.apps/cert-manager-webhook      1/1     1            1           3m37s

NAME                                                 DESIRED   CURRENT   READY   AGE
replicaset.apps/cert-manager-6bcdd5f7c               1         1         1       3m38s
replicaset.apps/cert-manager-cainjector-5d4577b4d9   1         1         1       3m39s
replicaset.apps/cert-manager-webhook-bf957dc77       1         1         1       3m38s
```
### Create a Certificate Issuer

**Create a namespace**

where you plan to generate certificates:

```shell


$ k create namespace game-mario
```



**Define a certificate issuer**

```shell


$ cat issuer-selfsigned.yaml                                                            
apiVersion: cert-manager.io/v1                                                                                                                   
kind: Issuer                                                                                                                                     
metadata:                                                                                                                                         
 name: cfe-selfsigned-issuer                                                                                                                     
spec:                                                                                                                                             
 selfSigned: {}
```

**Deploy a certificate issuer**

```shell

$ kubectl apply -f issuer-selfsigned.yaml -n game-mario
issuer.cert-manager.io/cfe-selfsigned-issuer created



$ k apply -f issuer-selfsigned.yaml -n cfe-apps
issuer.cert-manager.io/cfe-selfsigned-issuer created

$ k get issuer -n cfe-apps
NAME                    READY   AGE
cfe-selfsigned-issuer   True    30s

$ kubectl get issuer -n game-mario
NAME                    READY   AGE
cfe-selfsigned-issuer   True    7s
```

An issuer created in this way works only for the current namespace. If you want to be able to request certificates from any namespace in a cluster, create a custom Kubernetes resource called *ClusterIssuer* using the available selfsigned-issuer.yaml file:

```shell


$ cat clusterissuer.yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: selfsigned-cluster-issuer
spec:
  selfSigned: {}
```



### Generate a certificate


Generate a self-signed certificate by using the following Certificate yaml file:

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

 - nginx.example.com

 - example.com




$ kubectl apply -n game-mario -f certificate.yaml
certificate.cert-manager.io/cfe-selfsigned-tls created

$ k apply -f certificate.yaml -n cfe-apps
certificate.cert-manager.io/cfe-selfsigned-tls created

$ k get certificate -n cfe-apps
NAME                 READY   SECRET             AGE
cfe-selfsigned-tls   True    cfe-tls-key-pair   23s

$ k get secrets -n cfe-apps cfe-tls-key-pair
NAME               TYPE                DATA   AGE
cfe-tls-key-pair   kubernetes.io/tls   3      52s






$ kubectl get certificate -n game-mario
NAME                 READY   SECRET             AGE
cfe-selfsigned-tls   True    cfe-tls-key-pair   2m56s



$ kubectl get secret -n game-mario cfe-tls-key-pair
NAME               TYPE                DATA   AGE
cfe-tls-key-pair   kubernetes.io/tls   3      63s
```



View information about the Secret



It shows that there are 3 keys contained in the secret, ca.crt, tls.crt and tls.key.



### Test the certificate

```shell
$ openssl x509 -in <(kubectl get secret -n cfe-apps cfe-tls-key-pair -o jsonpath='{.data.tls\.crt}' | base64 -d)
-text -noout
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number:
            2a:2a:5d:0f:d1:e2:6f:60:3e:8a:93:4f:f4:e8:52:1e
        Signature Algorithm: sha256WithRSAEncryption
        Issuer: CN = example.com
        Validity
            Not Before: Feb 21 14:17:18 2024 GMT
            Not After : May 21 14:17:18 2024 GMT
        Subject: CN = example.com
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                RSA Public-Key: (2048 bit)
                Modulus:
                    00:b7:7d:95:7f:55:a7:32:fd:66:b2:78:c0:2b:1f:
                    1f:69:c6:de:1f:85:eb:fb:2b:69:f3:60:23:df:9d:
                    3e:3d:41:df:c9:6b:b0:92:80:fe:6a:6f:19:4d:61:
                    20:3e:fc:19:af:f1:1d:5e:f6:b6:4f:17:5d:76:99:
                    3f:f4:d3:4a:70:15:f8:d5:3e:02:5c:c4:29:32:75:
                    cd:e3:5a:07:7d:ea:47:71:37:3b:3d:36:89:36:e5:
                    8f:0e:03:57:ab:99:b3:6d:47:67:8a:6b:3b:2b:61:
                    b0:08:96:a6:a2:5d:46:ed:ee:f3:5a:e3:6b:1d:05:
                    08:f1:ab:1b:ea:49:a3:2f:0d:82:37:80:76:00:18:
                    77:99:39:08:2e:06:54:28:24:e2:c8:9f:48:9c:ec:
                    75:0e:5e:a6:7b:ce:0b:68:96:d1:1a:4e:56:e1:ca:
                    42:ab:8e:11:a8:37:e1:70:ae:25:e3:2f:26:f1:7c:
                    95:fa:da:48:57:1f:a3:d7:47:84:86:9d:76:b3:99:
                    a5:ef:10:98:96:31:ee:32:31:05:bc:5a:c0:94:bd:
                    25:ba:d6:86:32:d1:a6:3e:8c:21:99:a8:96:d6:5d:
                    69:35:01:8e:4f:d8:e9:90:78:17:ce:ac:4a:f8:13:
                    59:9b:e3:a8:9b:59:cc:c6:5f:5b:ca:6c:73:5e:e6:
                    88:f9
                Exponent: 65537 (0x10001)
        X509v3 extensions:
            X509v3 Key Usage: critical
                Digital Signature, Key Encipherment, Certificate Sign
            X509v3 Basic Constraints: critical
                CA:TRUE
            X509v3 Subject Key Identifier:
                53:55:6D:56:AA:75:E2:87:9E:BB:C2:C7:45:32:2F:E3:1C:FF:17:62
            X509v3 Subject Alternative Name:
                DNS:nginx.example.com, DNS:example.com
    Signature Algorithm: sha256WithRSAEncryption
         69:e4:ae:bb:15:c1:d7:1a:54:49:10:6b:04:f9:1b:ed:bf:64:
         0f:da:5e:b8:c2:e7:e2:d9:45:9e:66:92:0f:ce:f5:c9:5f:aa:
         b3:28:36:cd:16:da:6a:60:7f:eb:1d:85:fe:3a:38:65:71:0f:
         eb:da:e8:9e:1b:dc:f5:b7:14:4f:70:00:fd:bf:44:ed:37:35:
         bc:67:c7:4f:68:bc:5e:3b:bd:64:aa:5c:cd:1a:4f:11:90:c4:
         6f:6a:d2:4b:90:4c:25:e7:ab:83:12:d7:38:b1:bf:70:8c:d5:
         cc:cb:70:70:b6:de:dc:8f:66:21:42:88:d5:7e:59:5f:6e:83:
         73:81:e4:63:57:d1:c6:63:c0:9a:49:09:44:b5:d0:33:6b:3b:
         fd:3e:e4:c7:b7:d4:e4:72:0d:36:cf:a8:31:26:e3:ce:55:9f:
         46:b8:fd:ab:7c:cc:2a:4b:e2:a6:a5:cd:2f:0c:3a:b1:2d:84:
         1a:51:8b:e8:73:0f:cb:49:2e:a2:a6:ed:d5:e2:e8:cf:79:44:
         b9:2b:00:03:86:1a:a6:33:d4:20:33:9c:04:71:43:2d:9c:66:
         3b:13:9b:6f:9f:f6:5f:f2:e0:e4:4a:04:64:c3:e6:bd:78:18:
         19:22:d9:98:b5:47:85:0d:bd:b6:56:44:e6:89:34:30:90:20:
         36:63:4f:1e
$ openssl x509 -in <(kubectl get secret -n game-mario cfe-tls-key-pair -o jsonpath='{.data.tls\.crt}' | base64 -d) -text -noout
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number:
            25:db:00:3b:27:91:76:a1:d2:ba:15:1f:bc:0b:0d:d0
        Signature Algorithm: sha256WithRSAEncryption
        Issuer: CN = example.com
        Validity
            Not Before: Feb  5 17:12:18 2024 GMT
            Not After : May  5 17:12:18 2024 GMT
        Subject: CN = example.com
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                RSA Public-Key: (2048 bit)
                Modulus:
                    00:b5:13:33:b5:de:ae:e0:57:8e:15:86:21:96:b5:
                    0f:0e:d9:9e:2c:30:9d:5e:e8:2c:ba:2c:90:b3:67:
                    f7:3b:91:ee:2b:39:d6:6f:b9:a5:67:62:88:91:61:
                    07:1d:06:19:ae:6c:10:73:f0:5e:c4:35:67:01:23:
                    6c:b5:a3:7d:86:91:67:fe:0e:b8:03:5c:1c:72:2a:
                    f8:2f:b4:ce:7e:00:c7:8e:a7:0e:7b:7d:69:6b:8d:
                    24:9c:00:57:3e:c4:34:7d:37:57:fa:05:4c:c7:94:
                    a3:07:a2:e9:5d:4c:cb:ec:21:cf:82:a2:35:1a:e7:
                    ff:1e:ff:01:c8:09:9a:9b:7a:70:ee:84:4d:ed:82:
                    0d:c5:88:27:c7:ec:f2:52:c2:73:5c:33:07:dc:bc:
                    43:af:d5:1e:c6:3f:24:fe:9e:ca:81:0b:31:71:01:
                    59:37:76:b4:80:e6:bf:69:c4:1a:27:46:50:a0:bf:
                    01:71:72:12:ba:0f:da:a0:28:df:36:c9:fd:d4:46:
                    3b:2d:8e:78:72:39:e7:aa:46:a5:ac:b5:1b:0e:9a:
                    06:35:af:00:78:ef:26:f9:a6:33:6c:96:ff:8c:eb:
                    c6:88:bc:b1:90:a0:84:6b:b6:9b:0a:90:6d:64:92:
                    d0:9c:c9:a7:15:65:06:c9:69:03:bd:af:a6:9d:20:
                    32:e9
                Exponent: 65537 (0x10001)
        X509v3 extensions:
            X509v3 Key Usage: critical
                Digital Signature, Key Encipherment, Certificate Sign
            X509v3 Basic Constraints: critical
                CA:TRUE
            X509v3 Subject Key Identifier:
                7D:B6:37:6B:FB:3C:C9:CF:2A:5D:0A:FB:95:6D:DC:4A:8D:E9:6F:2E
            X509v3 Subject Alternative Name:
                DNS:nginx.example.com, DNS:example.com
    Signature Algorithm: sha256WithRSAEncryption
         0c:8f:ae:26:d6:f9:1b:9a:e4:c8:01:ef:32:44:5e:df:f6:5b:
         7f:0b:25:ed:c6:3d:4d:3e:a7:4d:dc:70:ca:16:5c:51:f4:1e:
         4d:b3:4d:47:76:9d:6e:5d:11:3c:be:1f:f5:60:63:d8:a4:a0:
         99:4b:bf:f6:39:1c:17:f1:bf:d2:a5:53:04:43:0a:b7:59:c7:
         c3:de:ec:40:f4:9c:37:b0:53:99:e5:9e:3a:e2:b8:cc:d9:4b:
         fb:66:64:dd:41:0f:b1:f5:d9:8f:ea:b0:bc:de:67:24:85:e7:
         3a:19:4f:1c:32:fe:0f:8f:8a:a2:34:f6:fa:b5:30:bd:c2:39:
         43:7e:e4:a3:4f:a7:90:ab:c0:61:a8:9c:42:cc:36:94:eb:23:
         59:62:b5:63:af:6b:a5:1b:65:73:c3:d9:cc:13:9d:5a:a0:87:
         25:21:91:d8:6c:bd:ab:08:9e:5d:58:a7:7f:98:a3:24:cf:1f:
         3c:23:d0:df:a5:b7:ca:26:21:d5:a1:8d:70:d6:50:51:c9:fe:
         c3:08:ca:92:49:76:b7:9b:7a:42:da:81:0b:5d:89:c5:fc:cb:
         57:41:d4:ff:16:0b:de:01:30:e1:51:de:11:4d:42:53:c5:67:
         32:4a:c6:2e:05:84:a0:b3:6c:80:ab:d3:42:a8:6d:b6:e6:05:
         e6:72:f6:cb

```

### Expose an app over TLS termination

```shell
$ cat apps/nginx.yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-main
  labels:
    run: nginx-main
spec:
  ports:
  - port: 80
    protocol: TCP
  selector:
    run: nginx-main
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    run: nginx
  name: nginx-main
spec:
  replicas: 1
  selector:
    matchLabels:
      run: nginx-main
  template:
    metadata:
      labels:
        run: nginx-main
    spec:
      volumes:
      - name: webdata
        emptyDir: {}
      initContainers:
      - name: web-content
        image: busybox
        volumeMounts:
        - name: webdata
          mountPath: "/webdata"
        command: ["/bin/sh", "-c", 'echo "<h1>This is the <font color=turquoise>Nginx MAIN app</font> over secure HTTP</h1>" > /webdata/index.html']
      containers:
      - image: nginx
        name: nginx
        volumeMounts:
        - name: webdata
          mountPath: "/usr/share/nginx/html"
```



```shell
$ k apply -f apps/nginx.yaml -n cfe-apps
service/nginx-main created
deployment.apps/nginx-main created
```



```shell
$ k get all -n cfe-apps
NAME                             READY   STATUS    RESTARTS   AGE
pod/nginx-main-88458c48d-n4qfk   1/1     Running   0          26s

NAME                 TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
service/nginx-main   ClusterIP   10.99.86.182   <none>        80/TCP    32s

NAME                         READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/nginx-main   1/1     1            1           32s

NAME                                   DESIRED   CURRENT   READY   AGE
replicaset.apps/nginx-main-88458c48d   1         1         1       32s
```



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




```shell

```




```shell

```