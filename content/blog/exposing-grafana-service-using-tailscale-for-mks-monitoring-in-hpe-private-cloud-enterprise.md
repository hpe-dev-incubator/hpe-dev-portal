---
title: Exposing Grafana service using Tailscale for MKS monitoring in HPE
  Private Cloud Enterprise
date: 2025-09-26T20:28:43.991Z
author: Guoping Jia
authorimage: /img/guoping.png
disable: false
---

## Overview

## MetalLB and Tailscale

*MetalLB* 

*Tailscale* is a secure, peer-to-peer VPN built on the [WireGuiad]() protocol. It uses WireGuard as its core trasport layer, benefiting from its open-source speed and security. 

## Set up the load balancer with MetalLB


You can install MetalLB and set up the load balancer in the MKS cluster by following the instructions found in the blog post [Setting up the load balancer with MetalLB](https://developer.hpe.com/blog/exposing-an-application-using-ingress-and-tls-termination-on-kubernetes-in-hpe-greenlake-for-private-cloud-enterprise/).



H﻿ere is the deployed MetalLB to the namespace 'metallb-system' in the MKS cluster *mks-test*:

```shell
$ kubectl get all -n metallb-system
NAME                                      READY   STATUS    RESTARTS   AGE
pod/metallb-controller-8474b54bc4-gdgmx   1/1     Running   0          14d
pod/metallb-speaker-2f8zj                 4/4     Running   0          14d
pod/metallb-speaker-qgg5p                 4/4     Running   0          14d
pod/metallb-speaker-qsv45                 4/4     Running   0          14d
pod/metallb-speaker-xhhcv                 4/4     Running   0          14d

NAME                              TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)   AGE
service/metallb-webhook-service   ClusterIP   172.30.168.138   <none>        443/TCP   14d

NAME                             DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR            AGE
daemonset.apps/metallb-speaker   4         4         4       4            4           kubernetes.io/os=linux   14d

NAME                                 READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/metallb-controller   1/1     1            1           14d

NAME                                            DESIRED   CURRENT   READY   AGE
replicaset.apps/metallb-controller-8474b54bc4   1         1         1       14d
```

You can see the range of virtual IP addresses, "172.20.40.240-172.20.40.250", defined in the CRD resource *IPAddressPool*, and the layer 2 service IP address announcement in the CRD resource *L2Advertisement*.

```shell



$ kubectl get ipaddresspool -n metallb-system
NAME       AUTO ASSIGN   AVOID BUGGY IPS   ADDRESSES
cfe-pool   true          false             ["172.20.40.240-172.20.40.250"]


$ kubectl get l2advertisement -n metallb-system
NAME           IPADDRESSPOOLS   IPADDRESSPOOL SELECTORS   INTERFACES
cfe-l2advert   ["cfe-pool"]

```


## Deploy Tailscale 

### Install Tailscale client

In order to use Tailscale, you need first install the Tailscale client on your device. The Tailscale client is open source and available for various platforms, such as Linux, Windows, MacOS, iOS, and Android, etc. It's used, via its Admin console, to connect various devices securely to your private Tailscale network (*tailnet*). It's the bridge between your device and the rest of your tailnet. 

Here is the Admin console of my Windows Tailscale client installed using the package avaible from [Tailscale download page](https://tailscale.com/download). It uses a Tailscale account by choosing GitHub as the Identity Provider. You can integrate your Tailscale account using your own identity providers for secure SSO login and multi-factor authentication. 

![](/img/tailscale-machines.png)

My Windows laptop joins the tailnet, a private network linked to my GitHub identity. 

### Generate Tailscale auth key

![](/img/tailscale-generate-auth-key.png)

![](/img/tailscale-auth-key.png)

### Generate Tailscale OAuth client

![](/img/tailscale-oauth-client.png)

![](/img/tailscale-oauth-client-k8s-operator.png)

![](/img/tailscale-oauth-client-details.png)

### Deploy Tailscale K8s operator


```shell
$ helm repo add tailscale https://pkgs.tailscale.com/helmcharts

$ helm repo update

$ helm search repo tailscale
NAME                            CHART VERSION   APP VERSION     DESCRIPTION
tailscale/tailscale-operator    1.86.5          v1.86.5         A Helm chart for Tailscale Kubernetes operator



$ helm upgrade --install tailscale-operator tailscale/tailscale-operator --namespace=tailscale --set-string oa
uth.clientId=kK2Rvpd9Ek11CNTRL --set-string oauth.clientSecret=tskey-client-kK2Rvpd9Ek11CNTRL-RC8mpdNA6JJnhGe8JDU6JJzkgiDPiacaU --wait
Release "tailscale-operator" does not exist. Installing it now.
NAME: tailscale-operator
LAST DEPLOYED: Wed Sep 24 15:02:41 2025
NAMESPACE: tailscale
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
You have successfully installed the Tailscale Kubernetes Operator!

Once connected, the operator should appear as a device within the Tailscale admin console:
https://login.tailscale.com/admin/machines

If you have not used the Tailscale operator before, here are some examples to try out:

* Private Kubernetes API access and authorization using the API server proxy
  https://tailscale.com/kb/1437/kubernetes-operator-api-server-proxy

* Private access to cluster Services using an ingress proxy
  https://tailscale.com/kb/1439/kubernetes-operator-cluster-ingress

* Private access to the cluster's available subnets using a subnet router
  https://tailscale.com/kb/1441/kubernetes-operator-connector

You can also explore the CRDs, operator, and associated resources within the tailscale namespace:

$ kubectl explain connector
$ kubectl explain proxygroup
$ kubectl explain proxyclass
$ kubectl explain recorder
$ kubectl explain dnsconfig

If you're interested to explore what resources were created:

$ kubectl --namespace=tailscale get all -l app.kubernetes.io/managed-by=Helm


$ kubectl --namespace=tailscale get all -l app.kubernetes.io/managed-by=Helm
```

```shell
$ kubectl get all -n tailscale
NAME                           READY   STATUS    RESTARTS   AGE
pod/operator-945796556-cgg86   1/1     Running   0          41s

NAME                       READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/operator   1/1     1            1           41s

NAME                                 DESIRED   CURRENT   READY   AGE
replicaset.apps/operator-945796556   1         1         1       41s



```

![](/img/tailscale-operator-machine.png)


## Expose Grafana service

```shell
$ kubectl get svc -n monitoring
NAME                    TYPE           CLUSTER-IP       EXTERNAL-IP     PORT(S)                      AGE
alertmanager-main       ClusterIP      172.30.103.195   <none>          9093/TCP,8080/TCP            14d
alertmanager-operated   ClusterIP      None             <none>          9093/TCP,9094/TCP,9094/UDP   14d
blackbox-exporter       ClusterIP      172.30.165.12    <none>          9115/TCP,19115/TCP           14d
grafana                 LoadBalancer   172.30.211.119   172.20.40.241   3000:31469/TCP               14d
kube-state-metrics      ClusterIP      None             <none>          8443/TCP,9443/TCP            14d
node-exporter           ClusterIP      None             <none>          9100/TCP                     14d
prometheus-adapter      ClusterIP      172.30.199.24    <none>          443/TCP                      14d
prometheus-k8s          ClusterIP      172.30.54.40     <none>          9090/TCP,8080/TCP            14d
prometheus-operated     ClusterIP      None             <none>          9090/TCP                     14d
prometheus-operator     ClusterIP      None             <none>          8443/TCP                     14d
pce-trial@cfe-linux-jumphost:~$ k get svc grafana -n monitoring
NAME      TYPE           CLUSTER-IP       EXTERNAL-IP     PORT(S)          AGE
grafana   LoadBalancer   172.30.211.119   172.20.40.241   3000:31469/TCP   14d

pce-trial@cfe-linux-jumphost:~/metallb$ cat ingress-grafana.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-grafana
  namespace: monitoring
  annotations:
    tailscale.com/funnel: "true"
spec:
  defaultBackend:
    service:
     name: grafana
      port:
        number: 3000
  ingressClassName: tailscale
  tls:
    - hosts:
        - grafana





pce-trial@cfe-linux-jumphost:~$ k get ingress -n monitoring
NAME              CLASS       HOSTS   ADDRESS                     PORTS     AGE
ingress-grafana   tailscale   *       grafana.qilin-beta.ts.net   80, 443   9d



```

![](/img/grafana-machine.png)

![](/img/grafana-funnel.png)


![](/img/grafana-mobile.png)



```shell


```