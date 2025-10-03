---
title: Exposing Grafana service using Tailscale for MKS monitoring in HPE
  Private Cloud Enterprise
date: 2025-09-26T20:28:43.991Z
author: Guoping Jia
authorimage: /img/guoping.png
disable: false
tags:
  - hpe-private-cloud-enterprise
  - MKS
  - Tailscale
  - MetalLB
  - Tailscale Funnel
  - Prometheus
  - Grafana
  - Kubernetes
  - Kubernetes monitoring
---
This blog post describes how to expose the *Grafana* service, running in an MKS cluster within HPE Private Cloud Enterprise, to the public Internet using *Tailscale* in combination with *MetalLB*. Without the usual complexity of networking or intricate security configurations, the exposed *Grafana* dashboard becomes accessible both from within the on-premises environment and externally. This approach offers a simple and effective way to monitor MKS clusters running in HPE Private Cloud Enterprise environment.

 
## Overview


[HPE Private Cloud Enterprise](https://www.hpe.com/us/en/hpe-private-cloud-enterprise.html) is a fully managed *Infrastructure as a Service* (IaaS) offering that brings a modern, cloud-like experience to on-premises environments. It combines the flexibility of hybrid cloud with the enterprise-grade control and security required by enterprise IT. 



Through the integration with [HPE Morpheus Enterprise](https://www.hpe.com/us/en/morpheus-enterprise-software.html), which serves as the cloud management and orchestration layer, HPE Private Cloud Enterprise delivers a unified self-service interface for provisioning virtual machines (VMs), creating containers, and deploying applications, all governed by role-based access control (RBAC). This integration now enables support for the Morpheus Kubernetes Service (MKS) feature, allowing users to deploy and manage Kubernetes (K8s) clusters with built-in automation and observability capabilities. You can refer to the blog post [Provisioning MKS clusters in HPE Private Cloud Enterprise](https://developer.hpe.com/blog/provisioning-mks-clusters-in-hpe-greenlake-for-private-cloud-enterprise/) to learn more about provisioning MKS clusters in HPE Private Cloud Enterprise.

Networking is one of the key challenges for applications deployed in MKS clusters. How can these applications be made accessbile, both within the HPE Private Cloud Enterprise environment and from external networks? The following sections will describe how to expose services running in MKS cluster within HPE Private Cloud Enterprise to the public Internet using *Tailscale* and *MetalLB*, without introducing additional complexity or security overhead. 



## Prerequisites



Ensure that the following prerequisites are fulfilled:

* An MKS cluster has been provisioned from an HPE Private Cloud Enterprise workspace. You can refer to the blog post [Provisioning an MKS cluster in HPE Private Cloud Enterprise](https://developer.hpe.com/blog/provisioning-mks-clusters-in-hpe-greenlake-for-private-cloud-enterprise/) to provision an MKS cluster.
* The *kubectl* CLI tool, together with the *kubeconfig* file for accessing the MKS cluster.

* The *helm* CLI tool, version 3.12.0 or later.

## *MetalLB* and *Tailscale*

[*MetalLB*](https://metallb.io/) is a software solution that provides a network load balancer implementation for K8s clusters using standard routing protocols. By installing *MetalLB*, it supports the *LoadBalancer* type services by assigning external IPs to services within the K8s clusters. This makes the applications easily reachable within your private network, without needing any special hardware or cloud services. 

[*Tailscale*](https://tailscale.com/) is a mesh virtual private network (VPN) service that uses the [WireGuard](https://www.wireguard.com/) protocol to securely connects devices across different networks. Instead of routing traffic through a central server like traditional VPNs, *Tailscale* creates encrypted peer-to-peer connections between devices. These connections form a private network called *tailnet*, where each device receives a unique *Tailscale* IP address for direct communication. A tailnet provides a secure, interconnected space of users, devices, and resources, all managed through Tailscale's admin console, where you can configure access controls, DNS settings, TLS certificates, and more.   

By leveraging the external IP addresses assigned by *MetalLB* to LoadBalancer-type services within the local private network, *Tailscale* securely exposes these services through publicly accessible URLs, without direct service IP address exposure.

## Set up the load balancer with *MetalLB*

You can install *MetalLB* and set up the load balancer in the MKS cluster by following the instructions found in the blog post [Setting up the load balancer with MetalLB](https://developer.hpe.com/blog/exposing-an-application-using-ingress-and-tls-termination-on-kubernetes-in-hpe-greenlake-for-private-cloud-enterprise/).

H﻿ere is the deployed *MetalLB* to the namespace *'metallb-system'* in the MKS cluster *mks-test*:

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

## Deploy *Tailscale*

### Install *Tailscale* client

In order to use *Tailscale*, you need first install the *Tailscale* client on your device. The *Tailscale* client is open source and available for various platforms, such as *Linux*, *Windows*, *MacOS*, *iOS*, *Android*, etc. It's used, via its admin console, to connect various devices securely to your private *Tailscale* network (*tailnet*). It's the bridge between your device and the rest of your tailnet. 

Here is the admin console of my Windows *Tailscale* client installed using the package avaible from [Tailscale download page](https://tailscale.com/download). It uses a *Tailscale* account by choosing GitHub as the Identity Provider. You can integrate your *Tailscale* account using your own identity providers for secure SSO login and multi-factor authentication. 

![](/img/tailscale-machines.png)

My Windows laptop joins the tailnet, a private network linked to my GitHub identity. 

### Generate *Tailscale* auth key

After installing *Tailscale* client, you need first generate an auth key from the *Tailscale* admin console.

1. Navigate to **Settings** -> **Keys**. Click ***Generate auth key***.

![](/img/tailscale-settings-keys.png)

2. Enter *Description* and set *Expiration*. Click ***Generate key***.

![](/img/tailscale-generate-auth-key.png)

3. Copy and save the generated new key.

![](/img/tailscale-auth-key.png)

Create a *Secret* YAML manifest file *'tailscale-auth.yaml'* using the generated auth key. 

```shell
apiVersion: v1
kind: Secret
metadata:
  name: tailscale-auth
  namespace: tailscale
stringData:
  TS_AUTHKEY: tskey-auth-<hidden>
```

Apply the *Secret* to the namespace *tailscale*. This secret will be used to securely join the cluster to your Tailscale network.

```shell
$ kubectl create ns tailscale
$ kubectl apply -f tailscale-auth.yaml
```
### Create tag *k8s-operator*

You need then create a tag named *k8s-operator* from the *Tailscale* admin console. *Tailscale* uses this tag to authenticate and identify the *Tailscale* K8s operator being deployed to the MKS cluster. 

1. Navigate to **Settings -> ** *Tags* tab. Click ***Create tag***.

![](/img/tailscale-create-tag.png)

2. Enter *Tag name* as *k8s-operator* and select *Tag owner* as *autogroup:member*. Click ***Save tag***.

![](/img/tailscale-tag-k8s-operator.png)

### Generate *Tailscale* OAuth client

You need then generate an OAuth client from the *Tailscale* admin console.

1. Navigate to **Settings** -> **OAuth clients**. Click ***Generate OAuth client***.

![](/img/tailscale-oauth-client.png)

2. Under **Devices**, select *Core* and add tag *k8s-operator*. Under Keys, select *Auth Keys* and add the tag *k8s-operator*. Click ***Generate client***.

![](/img/tailscale-oauth-client-k8s-operator.png)

3. Copy and save the generated *Client ID* and *Client secret* of the generated new OAuth client.

![](/img/tailscale-oauth-client-details.png)

### Deploy *Tailscale* K8s operator

You can now install the Tailscal operator to the namespace *tailscale* of the MKS cluster using *Helm* along with the generated *Tailscale* OAuth client, its *Client ID* and *Client secret*. 

```shell
$ helm repo add tailscale https://pkgs.tailscale.com/helmcharts
$ helm repo update

$ helm search repo tailscale
NAME                            CHART VERSION   APP VERSION     DESCRIPTION
tailscale/tailscale-operator    1.86.5          v1.86.5         A Helm chart for Tailscale Kubernetes operator

$ helm upgrade --install tailscale-operator tailscale/tailscale-operator \
--namespace=tailscale --set-string oauth.clientId=<hidden> \
--set-string oauth.clientSecret=tskey-client-<hidden> --wait
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

Check the *Tailscale* operator deployment details. 

```shell
$ kubectl get all -n tailscale
NAME                           READY   STATUS    RESTARTS   AGE
pod/operator-945796556-cgg86   1/1     Running   0          41s

NAME                       READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/operator   1/1     1            1           41s

NAME                                 DESIRED   CURRENT   READY   AGE
replicaset.apps/operator-945796556   1         1         1       41s
```

When the *Tailscale* operator has been installed and running, you should see a new machine named *'tailscale-operator'* under the **Machines** tab of your Tailscale admin console.

![](/img/tailscale-operator-machine.png)

## Expose Grafana service

As part of an MKS cluster provisioning, both *Prometheus* and *Grafana* have been installed and configured in the namespace *'monitoring'*. You can check the deployment details using below command:

```shell
$ kubectl get all -n monitoring
NAME                                      READY   STATUS    RESTARTS   AGE
pod/alertmanager-main-0                   2/2     Running   0           4d
pod/alertmanager-main-1                   2/2     Running   0           4d
pod/alertmanager-main-2                   2/2     Running   0           4d
pod/blackbox-exporter-84d969fb75-msbqd    3/3     Running   0           4d
pod/grafana-6698fc66bb-9rjk2              1/1     Running   0           4d
pod/kube-state-metrics-6f5f95b6bf-6b77k   3/3     Running   0           4d
pod/node-exporter-74nzh                   2/2     Running   0           4d
pod/node-exporter-89m4q                   2/2     Running   0           4d
pod/node-exporter-c699g                   2/2     Running   0           4d
pod/node-exporter-prmwt                   2/2     Running   0           4d
pod/node-exporter-vdfvj                   2/2     Running   0           4d
pod/prometheus-adapter-599c88b6c4-nd7xd   1/1     Running   0           4d
pod/prometheus-adapter-599c88b6c4-zh2z5   1/1     Running   0           4d
pod/prometheus-k8s-0                      2/2     Running   0           4d
pod/prometheus-k8s-1                      2/2     Running   0           4d
pod/prometheus-operator-75486dd88-pjdjh   2/2     Running   0           4d

NAME                            TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)                      AGE
service/alertmanager-main       ClusterIP   172.30.103.195  <none>        9093/TCP,8080/TCP             4d
service/alertmanager-operated   ClusterIP   None            <none>        9093/TCP,9094/TCP,9094/UDP    4d
service/blackbox-exporter       ClusterIP   172.30.165.12   <none>        9115/TCP,19115/TCP            4d
service/grafana                 ClusterIP   172.30.211.119  <none>        3000/TCP                      4d
service/kube-state-metrics      ClusterIP   None            <none>        8443/TCP,9443/TCP             4d
service/node-exporter           ClusterIP   None            <none>        9100/TCP                      4d
service/prometheus-adapter      ClusterIP   172.30.199.24   <none>        443/TCP                       4d
service/prometheus-k8s          ClusterIP   172.30.54.40    <none>        9090/TCP,8080/TCP             4d
service/prometheus-operated     ClusterIP   None            <none>        9090/TCP                      4d
service/prometheus-operator     ClusterIP   None            <none>        8443/TCP                      4d

NAME                           DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR            AGE
daemonset.apps/node-exporter   5         5         5       5            5           kubernetes.io/os=linux   43d

NAME                                  READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/blackbox-exporter     1/1     1            1            4d
deployment.apps/grafana               1/1     1            1            4d
deployment.apps/kube-state-metrics    1/1     1            1            4d
deployment.apps/prometheus-adapter    2/2     2            2            4d
deployment.apps/prometheus-operator   1/1     1            1            4d

NAME                                            DESIRED   CURRENT   READY   AGE
replicaset.apps/blackbox-exporter-84d969fb75    1         1         1        4d
replicaset.apps/grafana-6698fc66bb              1         1         1        4d
replicaset.apps/kube-state-metrics-6f5f95b6bf   1         1         1        4d
replicaset.apps/prometheus-adapter-599c88b6c4   2         2         2        4d
replicaset.apps/prometheus-operator-75486dd88   1         1         1        4d

NAME                                 READY   AGE
statefulset.apps/alertmanager-main   3/3      4d
statefulset.apps/prometheus-k8s      2/2      4d
```

In order to expose the *Grafana* service, you need change its service type from *ClusterIP* to *LoadBalancer* using the commmand *'kubectl edit svc  grafana -n monitoring'*. The *Grafana* service then is assigned an *EXTERNAL-IP* IP address, such as *'172.20.40.241'*.

```shell
$ kubectl get svc grafana -n monitoring
NAME      TYPE           CLUSTER-IP       EXTERNAL-IP     PORT(S)          AGE
grafana   LoadBalancer   172.30.211.119   172.20.40.241   3000:31469/TCP    4d
```

You can now expose the *Grafana* service to the public Internet using [Tailscale Funnel](https://tailscale.com/kb/1223/funnel) together with K8s *Ingress*. 

*Tailscale* Funnel exposes a local service running in the MKS to the Internet through a unique *Funnel URL* with the format *'<service-name>.<tailscale domain>'. When accessing the Funnel URL, it sends a request to the Funnel relay server. Then the Funnel relay server establishes an encrypted TCP tunnel, which protects the shared data and hides the IP details of the local service. The Funnel relay server cannot decrypt data sent over the TCP proxy. 

*Tailscale* Funnel is disabled by default. You can use the *Tailscale* CLI command *'tailscale funnel'* to enable it. The *Tailscale* CLI is installed as part of your Tailscale client installation.
 
You need then create a tag named *k8s* from the *Tailscale* admin console. 

![](/img/tailscale-tag-k8s.png)

You need also add a node attribute, under **Access controls -> ** *Node attributes* tab, from the admin console.

![](/img/tailscale-node-attribute-k8s.png)

Then create below *Ingress* YAML manifest file with the annotation *'tailscale.com/funnel: "true"'* and *'ingressClassName: tailscale'*. Apply it to the *monitoring* namespace.

```shell
$ cat ingress-grafana.yaml
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
$ kubectl apply -f ingress-grafana.yaml
ingress.networking.k8s.io/ingress-grafana created
```

After few minutes, the deployed Ingress *ingress-grafana* is showing up its assigned Funnel URL *grafana.qilin-beta.ts.net*. 

```shell
pce-trial@cfe-linux-jumphost:~$ k get ingress -n monitoring
NAME              CLASS       HOSTS   ADDRESS                     PORTS     AGE
ingress-grafana   tailscale   *       grafana.qilin-beta.ts.net   80, 443   9d
```

The **Machines** tab of the *Tailscale* admin console shows the newly added device *'grafana'*.

![](/img/grafana-machine.png)

You can now start your browser by pointing to the Funnel URL *'grafana.qilin-beta.ts.net '*. After login, you can land to one of the pre-configured dashboard, e.g., *Kubernetes/API server*.

![](/img/grafana-funnel.png)

You can access the exposed *Grafana* service from your mobile phone using the same Funnel URL to monitor your MKS cluster.

![](/img/grafana-mobile.png)

## Conclusions

, without adding layers of complexity or security risks?opening firewall ports or setting up any reverse proxies, can be used for MKS monitoring   pre-installed and configured in the MKS cluster 

Whether you’re developing new applications, debugging or demoing them, exposing these applications using *Tailscale* Funnel make it much easy and safe.




There are still quite a few security considerations when applying the *Tailscale* setup in your production environments. While traffic to the exposed Grafana service is encrypted end-to-end via *HTTPS*, you should further restrict access using *Tailscale* ACL in the production deployment. You should consider to configure *Tailscale* to disable Funnel automatically if *Tailscale* disconnects. As of recent *Tailscale* update, you can request *Tailscale* support for using your own domain with Funnel. This is useful for production-quality public links to your exposed services.