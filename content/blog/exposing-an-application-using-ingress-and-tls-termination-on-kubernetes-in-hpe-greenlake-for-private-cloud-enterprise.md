---
title: Exposing applications using Ingress and TLS termination on Kubernetes in
  HPE GreenLake for Private Cloud Enterprise
date: 2024-03-20T10:06:33.740Z
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

### Overview

[HPE GreenLake for Private Cloud Enterprise: Containers](https://www.hpe.com/us/en/greenlake/containers.html), one of the HPE GreenLake cloud services available on the HPE GreenLake for Private Cloud Enterprise, allows customers to create a K8s cluster and deploy containerized applications to the cluster. It provides an enterprise-grade container management service using open source K8s.  

O﻿nce applications are deployed in a K8s cluster, the next step is to create services that expose these applications. By default, K8s services are created with the *ClusterIP* type, which supports internal connectivity among different components of the applications. However, these services are not directly accessible from outside the cluster. It can be challenging to securely expose the deployed applications over HTTPS. This involves generating and managing SSL/TLS certificates for multiple applications deployed in the cluster. These certificates are crucial for secure communication between services. Installing them and managing them correctly is essential to avoid access issues and security risks. 

To address exposing applications over HTTPS, K8s provides the concept of *Ingress*. An Ingress acts as an entry point for external traffic into the cluster. It can be configured with TLS termination. However, setting up K8s Ingress with TLS termination is intricate. It involves creating a K8s *Secret* to host the certificate and referencing the secret in the Ingress resource. It also requires an additional load balancer configuration in the cluster.

This blog post outlines the comprehensive steps used to expose applications u﻿sing Ingress and TLS termination on K8s in HPE GreenLake for Private Cloud Enterprise. [MetalLB](https://developer.hpe.com/blog/set-up-load-balancer-with-metallb-in-hpe-greenlake-for-private-cloud-enterprise/) is deployed to the cluster to set up the load balancer. It enables external access to services within the cluster. [Cert-manager](https://developer.hpe.com/blog/generating-self-signed-certificates-using-cert-manager-for-kubernetes-in-hpe-greenlake-for-private-cloud-entreprise/) is used for creating and managing SSL/TLS certificates. The generated certificate is stored as a K8s *Secret* object. This secret can be mounted by application Pods or used by an Ingress controller. The [Nginx Ingress controller](https://www.nginx.com/products/nginx-ingress-controller/) is deployed and configured in the cluster. It handles SSL certificates and facilitates secure access to applications in the backend.

![](/img/tls-termination-s.png)

Despite the complexities, securely exposing applications in a K8s cluster over HTTPS is attainable. It can be achieved by leveraging Ingress and TLS termination, along with a suite of suitable tools and utilities deployed within the K8s cluster in HPE GreenLake for Private Cloud Enterprise.

### Prerequisites

Before starting, make sure you have the following:

* A K8s cluster, being provisioned in HPE GreenLake for Private Cloud Enterprise
* The *kubectl* CLI tool, together with the kubeconfig file for accessing the K8s cluster
* The *helm* CLI tool, version 3.12.0 or later
* A domain and a list of subdomains to generate the SSL certificate and host the applications in the cluster

### Set up the load balancer with MetalLB

You can install MetalLB and set up the load balancer in the K8s cluster by following the instructions found in the blog post [Setting up the load balancer with MetalLB](https://developer.hpe.com/blog/set-up-load-balancer-with-metallb-in-hpe-greenlake-for-private-cloud-enterprise/).

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

You can see the range of virtual IP addresses, *"10.6.115.251-10.6.115.254"*, defined in the CRD resource *IPAddressPool*, and the layer 2 service IP address announcement in the CRD resource *L2Advertisement*:

```shell
$ kubectl get ipaddresspools -n metallb-system
NAME       AUTO ASSIGN   AVOID BUGGY IPS   ADDRESSES
cfe-pool   true          false             ["10.6.115.251-10.6.115.254"]

$ kubectl get l2advertisements -n metallb-system
NAME           IPADDRESSPOOLS   IPADDRESSPOOL SELECTORS   INTERFACES
cfe-l2advert   ["cfe-pool"]
```

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
pod/ingress-nginx-controller-548768956f-8bz2q   1/1     Running   0          15m

NAME                                         TYPE           CLUSTER-IP       EXTERNAL-IP    PORT(S)                      AGE
service/ingress-nginx-controller             LoadBalancer   10.108.173.7     10.6.115.251   80:32734/TCP,443:32265/TCP   15m
service/ingress-nginx-controller-admission   ClusterIP      10.108.100.150   <none>         443/TCP                      15m

NAME                                       READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/ingress-nginx-controller   1/1     1            1           15m

NAME                                                  DESIRED   CURRENT   READY   AGE
replicaset.apps/ingress-nginx-controller-548768956f   1         1         1       15m
```

T﻿he service *ingress-nginx-controller* gets deployed as the service type of *LoadBalancer* with the *EXTERNAL-IP* assigned as *10.6.115.251*. This IP address will be used for setting up domain and subdomain name resolution.

### Generate a self-signed certificate using cert-manager

You can d﻿eploy cert-manager to the K8s cluster and generate a self-signed certificate by following the instructions found in the blog post [Generating self-signed certificates using cert-manager](https://developer.hpe.com/blog/generating-self-signed-certificates-using-cert-manager-for-kubernetes-in-hpe-greenlake-for-private-cloud-entreprise/).

H﻿ere is the cert-manager deployed to the namespace *cert-manager* in the cluster:

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

Below is the deployed self-signed custom resource definition (CRD) *Issuer* in the namespace *nginx-apps* in which you want to generate the certificate:

```shell
$ kubectl get issuer -n nginx-apps
NAME                    READY   AGE
cfe-selfsigned-issuer   True    115s
```

Here is the generated self-signed certificate in the namespace *nginx-apps*:

```shell
$ kubectl get certificate -n nginx-apps
NAME                 READY   SECRET             AGE
cfe-selfsigned-tls   True    cfe-tls-key-pair   2m23s
```

T﻿he K8s *Secret* *'cfe-tls-key-pair'* is created automatically in the same namespace as part of certificate deployment:

```shell
$ kubectl get secrets -n nginx-apps cfe-tls-key-pair
NAME               TYPE                DATA   AGE
cfe-tls-key-pair   kubernetes.io/tls   3      2m25s
```

T﻿ype the following command to check the *commonName* and the *dnsNames* in the generated certificate:

```shell
$ kubectl describe certificate cfe-selfsigned-tls -n nginx-apps
Name:         cfe-selfsigned-tls
Namespace:    nginx-apps
Labels:       <none>
Annotations:  <none>
API Version:  cert-manager.io/v1
Kind:         Certificate
Metadata:
  Creation Timestamp:  2024-03-06T17:58:51Z
  Generation:          1
  Managed Fields:
    API Version:  cert-manager.io/v1
    Fields Type:  FieldsV1
    fieldsV1:
      f:metadata:
        f:annotations:
          .:
          f:kubectl.kubernetes.io/last-applied-configuration:
      f:spec:
        .:
        f:commonName:
        f:dnsNames:
        f:isCA:
        f:issuerRef:
          .:
          f:kind:
          f:name:
        f:secretName:
    Manager:      kubectl-client-side-apply
    Operation:    Update
    Time:         2024-03-06T17:58:51Z
    API Version:  cert-manager.io/v1
    Fields Type:  FieldsV1
    fieldsV1:
      f:status:
        f:revision:
    Manager:      cert-manager-certificates-issuing
    Operation:    Update
    Subresource:  status
    Time:         2024-03-06T17:58:52Z
    API Version:  cert-manager.io/v1
    Fields Type:  FieldsV1
    fieldsV1:
      f:status:
        .:
        f:conditions:
          .:
          k:{"type":"Ready"}:
            .:
            f:lastTransitionTime:
            f:message:
            f:observedGeneration:
            f:reason:
            f:status:
            f:type:
        f:notAfter:
        f:notBefore:
        f:renewalTime:
    Manager:         cert-manager-certificates-readiness
    Operation:       Update
    Subresource:     status
    Time:            2024-03-06T17:58:52Z
  Resource Version:  2128063
  UID:               977eaa8a-1612-489b-a34d-0e78ab113096
Spec:
  Common Name:  example.com
  Dns Names:
    green.nginx.example.com
    blue.nginx.example.com
    nginx.example.com
    example.com
  Is CA:  true
  Issuer Ref:
    Kind:       Issuer
    Name:       cfe-selfsigned-issuer
  Secret Name:  cfe-tls-key-pair
Status:
  Conditions:
    Last Transition Time:  2024-03-06T17:58:52Z
    Message:               Certificate is up to date and has not expired
    Observed Generation:   1
    Reason:                Ready
    Status:                True
    Type:                  Ready
  Not After:               2024-06-04T17:58:52Z
  Not Before:              2024-03-06T17:58:52Z
  Renewal Time:            2024-05-05T17:58:52Z
  Revision:                1
Events:                    <none>
```

### Deploy sample Nginx applications

In order to configure and validate the Ingress TLS termination, three sample Nginx applications will be deployed to the cluster using the YAML manifest files from the GitHub repo [ingress-demo](https://github.com/GuopingJia/ingress-demo):

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

Each YAML manifest file in the folder *'apps'* defines the *Deployment* and the *Service* resource.  

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

Type the command shown below to check the details of each application deployment:  

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

Three Nginx services, *nginx-main*, *nginx-blue* and *nginx-green*, are deployed as the *ClusterIP* type. They provide internal connectivity and can solely be accessed from within the cluster.

T﻿ype the following command to check that all the application service endpoints have been populated:

```shell
$ kubectl get endpoints -n nginx-apps
NAME          ENDPOINTS        AGE
nginx-blue    10.192.3.78:80    1m
nginx-green   10.192.4.45:80    1m
nginx-main    10.192.4.44:80    1m
```

### Set up Ingress TLS

The Ingress resource with TLS has to be created. Here is the sample Ingress TLS resource *ingress-host-based-selfsigned.yaml*, available from the GitHub repo [ingress-demo](https://github.com/GuopingJia/ingress-demo):

```shell
$ cat ingress-host-based-selfsigned.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-host-based-selfsigned
  annotations:
    ingress.kubernetes.io/ssl-redirect: "true"
    cert-manager.io/issuer: "nginx-selfsigned-issuer"
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

In the above sample YAML manifest file, there is the *'tls'* block that contains the hostname *'nginx.example.com'* and the secret *cfe-tls-key-pair* created in the certification step. There is also the *'rules'* block in which a list of routing rules is defined per host, e.g., host *nginx.example.com* will be routed to the application service *nginx-main* in the backend.  

T﻿ype the following command to deploy the Ingress resource to the namespace *nginx-apps*:

```shell
$ kubectl apply -f ingress-host-based-selfsigned.yaml -n nginx-apps
ingress.networking.k8s.io/ingress-host-based-selfsigned created
```

Check the details of the *TLS* and *Rules* settings by t﻿yping the command shown below:

```shell
$ kubectl describe ingress ingress-host-based-selfsigned -n nginx-apps
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

### Access deployed Nginx applications

B﻿efore accessing the deployed Nginx applications, you need set up the domain and the subdomain name resolution. For the sample domain name *nginx.example.com*, and its subdomains, *blue.nginx.example.com* and *green.nginx.example.com*, the workstation host file has been used for DNS resolution.  

Type the following commands to check that this is done correctly: 

```shell
$ host nginx.example.com
nginx.example.com has address 10.6.115.251

$ host green.nginx.example.com
green.nginx.example.com has address 10.6.115.251

$ host blue.nginx.example.com
blue.nginx.example.com has address 10.6.115.251
```

You can then validate the Ingres TLS configuration of the deployed Nginx applications using the browser. 

S﻿tart the browser and type the URL *nginx.example.com*. It will be redirected over HTTPS with the warning message *'Your connection is not private'*: 

![](/img/nginx-main-warning.png)

T﻿his is due to the fact that the self-signed certifcate is generated in cert-manager and configured in the K8s Ingress resource.

C﻿lick *Not secure* and start the Certificate Viewer to check the certificate:

![](/img/nginx-main-cert.png)

C﻿lick *Proceed to nginx.example.com (unsafe)*. You will then go to the Nginx *MAIN* page:

![](/img/nginx-main.png)

Type the URL *green.nginx.example.com* to the browser. It will be redirected over HTTPS with the same warning message *'Your connection is not private'*:   

![](/img/nginx-green-warning.png)

C﻿lick *Proceed to green.nginx.example.com (unsafe)*. You will then go to the Nginx *GREEN* page:

![](/img/nginx-green.png)

T﻿he same thing occurs when you type the URL *blue.nginx.example.com* to the browser. The access will be redirected over HTTPS with the same warning message *'Your connection is not private'*:  

![](/img/nginx-blue-warning.png)

C﻿lick *Proceed to blue.nginx.example.com (unsafe)*. You will then go to the Nginx *BLUE* page:  

![](/img/nginx-blue.png)

You have successfully configured the Ingress with the generated TLS c﻿ertificate and exposed the deployed applications with TLS termination. 

### Conclusion

This blog post provided a comprehensive guide on how to expose applications and make them accessible securely via HTTPS in a K8 cluster in HPE GreenLake for Private Cloud Enterprise. It detailed the process of configuring TLS termination on an Ingress controller, utilizing a K8s Ingress resource and a self-signed TLS certificate generated with cert-manager. While the emphasis of this post was on self-signed certificates, the outlined procedure is equally applicable to any type of certificates. This flexibility allows customers to follow the steps using their own CA certificates or any commercially issued certificates for Ingress TLS termination, ensuring secure exposure of their applications in the K8s cluster over HTTPS. 

Please keep coming back to the [HPE Developer Community blog](https://developer.hpe.com/blog/) to learn more about HPE GreenLake for Private Cloud Enterprise.