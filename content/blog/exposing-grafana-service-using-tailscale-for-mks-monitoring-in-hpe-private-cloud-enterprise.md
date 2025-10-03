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
This blog post describes how to expose the *Grafana* service, running in an MKS cluster within HPE Private Cloud Enterprise, to the public Internet using *Tailscale* alongside *MetalLB*. Without the usual complexity of networking or intricate security configurations, the exposed *Grafana* dashboard becomes accessible both within the on-premises environment and from external networks. This approach offers a simple and effective way to monitor MKS clusters running in the HPE Private Cloud Enterprise environment.

## Overview

[HPE Private Cloud Enterprise](https://www.hpe.com/us/en/hpe-private-cloud-enterprise.html) is a fully managed *Infrastructure as a Service* (IaaS) offering that brings a modern, cloud-like experience to on-premises environments. It combines the flexibility of hybrid cloud with the enterprise-grade control and security required by enterprise IT. 

Through the integration with [HPE Morpheus Enterprise](https://www.hpe.com/us/en/morpheus-enterprise-software.html), which serves as the cloud management and orchestration layer, HPE Private Cloud Enterprise delivers a unified self-service interface for provisioning virtual machines (VMs), creating containers, and deploying applications, all governed by role-based access control (RBAC). This integration now enables support for the Morpheus Kubernetes Service (MKS) feature, allowing users to deploy and manage Kubernetes (K8s) clusters with built-in automation and observability capabilities. You can refer to the blog post [Provisioning MKS clusters in HPE Private Cloud Enterprise](https://developer.hpe.com/blog/provisioning-mks-clusters-in-hpe-greenlake-for-private-cloud-enterprise/) to learn more about provisioning MKS clusters in HPE Private Cloud Enterprise.

As you begin deploying applications in MKS clusters, networking quickly emerges as one of the key challenges. Traditional methods such as port forwarding, *NodePort* or *LoadBalancer* services, or manual virtual private network (VPN) setups can be cumbersome to configure, difficult to secure, and often require deep networking expertise. How can these applications be made accessible, both within the HPE Private Cloud Enterprise environment and from external networks, without the added complexity? 

The following sections will describe how to expose services, running in MKS clusters within HPE Private Cloud Enterprise, to the public Internet using *Tailscale* and *MetalLB*, offering a streamlined and secure alternative to conventional approaches.

## Prerequisites

Ensure that the following prerequisites are fulfilled:

* An MKS cluster has been provisioned from a HPE Private Cloud Enterprise workspace. You can refer to the blog post [Provisioning an MKS cluster in HPE Private Cloud Enterprise](https://developer.hpe.com/blog/provisioning-mks-clusters-in-hpe-greenlake-for-private-cloud-enterprise/) to provision an MKS cluster.
* The *kubectl* CLI tool, together with the *kubeconfig* file for accessing the MKS cluster.
* The *helm* CLI tool, version 3.12.0 or later.

## *MetalLB* and *Tailscale*

*[MetalLB](https://metallb.io/)* is a software solution that provides a network load balancer implementation for K8s clusters using standard routing protocols. By installing *MetalLB*, it supports the *LoadBalancer*-type services by assigning external IPs to services within the K8s clusters. This makes the applications easily reachable within your private network, without needing any special hardware or cloud services. 

*[Tailscale](https://tailscale.com/)* is a mesh VPN service that uses the [WireGuard](https://www.wireguard.com/) protocol to securely connects devices across different networks. Instead of routing traffic through a central server like traditional VPNs, *Tailscale* creates encrypted peer-to-peer connections between devices. These connections form a private network called *tailnet*, where each device receives a unique *Tailscale* IP address for direct communication. A tailnet provides a secure, interconnected space of users, devices, and resources, all managed through Tailscale's admin console, where you can configure access controls, *DNS* settings, *TLS* certificates, and more.   

By utilizing the external IP addresses assigned by *MetalLB* to *LoadBalancer*-type services within the local private network, *Tailscale* securely exposes these services via publicly accessible URLs, without revealing their underlying service IP addresses.

## Set up the load balancer with *MetalLB*

You can install *MetalLB* and set up the load balancer in the MKS cluster by following the instructions found in the blog post [Setting up the load balancer with MetalLB](https://developer.hpe.com/blog/exposing-an-application-using-ingress-and-tls-termination-on-kubernetes-in-hpe-greenlake-for-private-cloud-enterprise/).

Run the following command to view the deployed *MetalLB* in namespace *metallb-system* of the MKS cluster *mks-test*.

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

You can view the virtual IP address range "172.20.40.240-172.20.40.250" defined in the custom resource definition (CRD) *IPAddressPool*, along with the layer 2 service IP address announcement specified in the CRD resource *L2Advertisement*.

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

In order to use *Tailscale*, you need to install the *Tailscale* client on your device. The *Tailscale* client is open source and available for various platforms, such as *Linux*, *Windows*, *MacOS*, *iOS*, *Android*, etc. It's used, via its admin console, to connect various devices securely to your private *Tailscale* network (*tailnet*). It's the bridge between your device and the rest of your tailnet. 

Here is the admin console of my Windows *Tailscale* client installed using the package avaible from [Tailscale download page](https://tailscale.com/download). It uses a *Tailscale* account by choosing the *GitHub* as the identity provider. You can integrate your *Tailscale* account using your own identity provider for secure single sign-on (SSO) login and multi-factor authentication (MFA). 

![](/img/tailscale-machines.png)

My Windows laptop *guoping* is connected to the tailnet associated with my *GitHub* identity provider. 

### Generate *Tailscale* auth key

After installing the *Tailscale* client, you need to generate an auth key from the *Tailscale* admin console.

1. Navigate to **Settings** -> **Keys**. Click ***Generate auth key***.

![](/img/tailscale-settings-keys.png)

2. Enter *Description* as *mks-auth-key* and set *Expiration*. Click ***Generate key***.

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

Apply the *Secret* to the namespace *tailscale* of the MKS cluster. This secret will be used to securely join the cluster to your *Tailscale* network.

```shell
$ kubectl create ns tailscale
$ kubectl apply -f tailscale-auth.yaml
```

### Create tag *k8s-operator*

You need to create a tag named *k8s-operator* in the *Tailscale* admin console. This tag is used by *Tailscale* to authenticate and identify the *Tailscale* K8s operator that will be deployed to the MKS cluster. 

1. Navigate to **Access controls ->**  *Tags* tab. Click ***Create tag***.

![](/img/tailscale-create-tag.png)

2. Enter *Tag name* as *k8s-operator* and select *Tag owner* as *autogroup:member*. Click ***Save tag***.

![](/img/tailscale-tag-k8s-operator.png)

### Generate *Tailscale* OAuth client

You need to generate an OAuth client in the *Tailscale* admin console.

1. Navigate to **Settings** -> **OAuth clients**. Click ***Generate OAuth client***.

![](/img/tailscale-oauth-client.png)

2. Under **Devices**, select *Core* with *Read and Write* and add tag *k8s-operator*. Under Keys, select *Auth Keys* with *Read and Write* and add the tag *k8s-operator*. Click ***Generate client***.

![](/img/tailscale-oauth-client-k8s-operator.png)

3. Copy and save the generated *Client ID* and *Client secret*.

![](/img/tailscale-oauth-client-details.png)

### Deploy *Tailscale* K8s operator

You can now install the *Tailscale* K8s operator to the namespace *tailscale* of the MKS cluster using *Helm*, along with the generated *Tailscale* OAuth client, specifically the *Client ID* and *Client secret*. 

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

Type below command to check the *Tailscale* operator deployment details. 

```shell
$ kubectl get all -n tailscale
NAME                           READY   STATUS    RESTARTS   AGE
pod/operator-945796556-cgg86   1/1     Running   0          41s

NAME                       READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/operator   1/1     1            1           41s

NAME                                 DESIRED   CURRENT   READY   AGE
replicaset.apps/operator-945796556   1         1         1       41s
```

Once the *Tailscale* operator is successfully installed and running, a new machine named *tailscale-operator* appears under the **Machines** tab in your *Tailscale* admin console.

![](/img/tailscale-operator-machine.png)

## Expose *Grafana* service

As part of the MKS cluster provisioning process, both *Prometheus* and *Grafana* are installed and configured in the namespace *monitoring*. Use below command to view the details.

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

To expose the *Grafana* service, change its service type from *ClusterIP* to *LoadBalancer* by running the commmand *'kubectl edit svc grafana -n monitoring'*. Once updated, the *Grafana* service appears as a *LoadBalancer* type and is assigned with an *EXTERNAL-IP* address, such as *'172.20.40.241'*.

```shell
$ kubectl get svc grafana -n monitoring
NAME      TYPE           CLUSTER-IP       EXTERNAL-IP     PORT(S)          AGE
grafana   LoadBalancer   172.30.211.119   172.20.40.241   3000:31469/TCP    4d
```

You can now expose the *Grafana* service and make it publicly accessible using [Tailscale Funnel](https://tailscale.com/kb/1223/funnel). *Tailscale* Funnel exposes a local service running in the MKS cluster via a unique *Funnel URL*, formatted as *\<service-name\>.\<tailscale domain\>*. When someone accesses the Funnel URL, the request is routed to the Funnel relay server, which then establishes an encrypted TCP tunnel to the local service. This ensures the data remains secure and the service's IP aaadress stays hidden. The Funnel relay server cannot decrypt any data transmitted through the tunnel.  

*Tailscale* Funnel is disabled by default. To enable it, use the *Tailscale* CLI command *'tailscale funnel'*. The *Tailscale* CLI tool is included when you install the *Tailscale* client.

After *Tailscale* Funnel is enabled, you need to create a tag named *k8s* in the *Tailscale* admin console. 

![](/img/tailscale-tag-k8s.png)

You need also add a node attribute, under **Access controls ->**  *Node attributes* tab, in the admin console.

![](/img/tailscale-node-attribute-k8s.png)

Create below *Ingress* YAML manifest file with the annotation *tailscale.com/funnel: "true"* and *ingressClassName: tailscale*. Apply it to the *monitoring* namespace.

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

After few minutes, the deployed Ingress *ingress-grafana* displays its assigned Funnel URL *grafana.qilin-beta.ts.net*. 

```shell
$ kubectl get ingress -n monitoring
NAME              CLASS       HOSTS   ADDRESS                     PORTS     AGE
ingress-grafana   tailscale   *       grafana.qilin-beta.ts.net   80, 443   36s
```

The **Machines** tab of the *Tailscale* admin console shows the newly added device *grafana*, as well as its *Tailscale* IP address *100.110.103.12*.

![](/img/grafana-machine.png)

## Access *Grafana* dashboard

You can start your browser by pointing to the Funnel URL *'grafana.qilin-beta.ts.net '*. After login, you can land to one of the pre-configured *Grafana* dashboard, e.g., *Kubernetes/API server*.

![](/img/grafana-funnel.png)

You can access the exposed *Grafana* service from your mobile phone using the same Funnel URL to monitor your MKS cluster.

![](/img/grafana-mobile.png)

## Conclusions

This blog post showed the steps for exposing the *Grafana* service, running within the MKS cluster in HPE Private Cloud Enterprise, using *Tailscale* and *MetalLB*. Without opening firewall ports or configuring reverse proxies, the *Grafana* dashboard becomes publicly accessible via its Funnel URL. Whether you are developing, debugging or showcasing applications in MKS clustes within the HPE Private Cloud Enterprise environment, this approach offers s simple and secure way to expose services. 

However, when applying the *Tailscale* setup in production environments, several security considerations remain important. Although traffic to the exposed Grafana service is encrypted end-to-end via *HTTPS*, it's recommended to enforce strict access controls using *Tailscale* ACLs. Additionally, you should configure *Tailscale* to automatically disable Funnel if connection drops, ensuring services are not unintentionally exposed. With recent updates, *Tailscale* supports custom domain integration for Funnel URLs, ideal for creating production-grade public endpoints for your services. 

Please keep coming back to the [HPE Developer Community blog](https://developer.hpe.com/blog/) to learn more about HPE Private Cloud Enterprise and get more ideas on how you can use it in your everyday operations.