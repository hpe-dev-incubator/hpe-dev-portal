---
title: Federating SPIRE on HPE GreenLake for Private Cloud Enterprise
date: 2023-05-12T03:37:14.807Z
author: Akansha Sajimon, Nishant Chaturvedi
authorimage: /img/Avatar1.svg
disable: false
---
<!--StartFragment-->

SPIRE is designed to enable widespread deployment of mTLS between workloads in distributed systems. In this blog, we will install and federate SPIRE across two clusters: cluster 1 and 2. We will deploy a sample application to verify the federation and visualize the communication across services through a graph. 



![SPIRE Federation](/img/spire-federation.png)

<!--EndFragment-->

<!--StartFragment-->

# Step 1. Installing SPIRE: 

Using the QuickStart files provided in this [link](https://github.com/cxteamtrials/caas-trials-content/tree/main/services/spire) we can get started on installing SPIRE on both clusters. Since we are working with two clusters, the trust domain configured for the first cluster is ***cluster1.demo***, and the other is ***cluster2.demo***.  

## 1.1 Clone the repo using:

```shellsession
git clone https://github.com/cxteamtrials/caas-trials-content.git 
```

## 1.2 Apply the QuickStart file on each cluster using the following commands: 

```shellsession
kubectl apply -f services/spire/federation/spire-quickstart-cluster-1.yaml 
kubectl apply -f services/spire/federation/spire-quickstart-cluster-2.yaml 
```

This step will install SPIRE into your clusters, along with two additional components: the SPIFFE CSI Driver and the SPIRE Kubernetes Controller manager which facilitates the registration of workloads and establishment of federated relationships. 

Verify the installation by checking if all pods are running and containers within them are up. 

```shellsession
Cluster1:~ # kubectl get po -n spire 

NAME                            	 READY   	STATUS   	 RESTARTS      AGE 

spire-agent-92q5m              	      3/3     	Running   		0          24h 

spire-agent-jhgwf              	      3/3     	Running   		0          24h 

spire-agent-sm8gt                     3/3       Running   		0          24h 

spire-server-574474c7dc-gbzl6         2/2     	Running   		0          24h 
```

```shellsession
Cluster2:~ # kubectl get po -n spire 

NAME                            	 READY      STATUS      RESTARTS        AGE 

spire-agent-wttmd               	  3/3       Running      1 (24h ago)    24h 

spire-server-574474c7dc-2bfcx   	  2/2       Running      0              24h 
```

<!--EndFragment-->

<!--StartFragment-->

# Step 2. Installing Istio: 

On each of your clusters, install Istio and patch Istio ingress gateway. Istio can detect the existence of a UNIX Domain Socket that implements the Envoy SDS API on a defined socket path, allowing Envoy to communicate and fetch identities directly from it. SPIRE can be configured for Istio workloads through an integration with Envoy’s SDS API. 

## 2.1 Download the latest release: 

You can download the latest release using the official Istio repository or just copy the following command, which would do the same for you.

```shellsession
curl -L https://istio.io/downloadIstio | sh - 
```

Change to the Istio directory (cd command), and set the path by command:

 

```shellsession
cd istio-1.17.1 
export PATH=$PWD/bin:$PATH 
```

## 2.2 I﻿nstall Istio with custom patch: 

Install Istio with custom patches for the Ingress-gateway as well as for Istio-proxy.  

Get the Istio-spire-config patch using this [link](https://github.com/cxteamtrials/caas-trials-content/blob/main/services/istio/release-1.17/spire), and install that patch using the following commands:

```shellsession
istioctl apply -f services/istio/release-1.17/spire/spire-patch-cluster1.yaml 
istioctl apply -f services/istio/release-1.17/spire/spire-patch-cluster2.yaml 
```

Installing Istio with the custom patch will share the spiffe-csi-driver with the Ingress Gateway and the sidecars that are going to be injected on workload pods, granting them access to the SPIRE Agent’s UNIX Domain Socket. 

## 2.3 Patch Istio Ingress Gateway:

### 2﻿.3.1 Apply SPIFFE ID

The first step is to get and apply one of SPIRE controller manager’s CRD - ClusterSPIFFEID. The CRD - ClusterSPIFFEID is a cluster-wide resource used to register workloads with SPIRE. The ClusterSPIFFEID can target all workloads in the cluster or can be optionally scoped to specific pods or namespaces via label selectors.  

Create a ClusterSPIFFEID CRD to generate registration entries in SPIRE server for all workloads with label ***spiffe.io/spire-managed-identity: true.***

Get the ClusterSPIFFEID used for this demo using this [link](https://github.com/cxteamtrials/caas-trials-content/blob/main/services/spire/clusterspiffeid-example.yaml) and  apply it to both clusters. 

```shellsession
kubectl apply -f services/spire/clusterspiffeid-example.yaml 
```

### 2.3﻿.2 Patch Ingress Gateway

Now, simply patch the ingress-gateway with ***spiffe.io/spire managed-identity: true label.***

This patch will register your ingress-gateway pod into the server.

```shellsession
kubectl patch deployment istio-ingressgateway -n istio-system -p '{"spec":{"template":{"metadata":{"labels":{"spiffe.io/spire-managed-identity": "true"}}}}}' 
```

2﻿.3.3 After patching, confirm the working of your ingress-gateway pod, istiod and all their containers. 

```shellsession
Cluster1:~ # kubectl get po -n istio-system 

NAME                                   			READY   STATUS    RESTARTS      AGE 

istio-ingressgateway-5d77cdd9d-gh9w4   	         1/1    Running      0          24h 

istiod-d5bc8669c-4bdvh                 		     1/1    Running      0          24h 
```

```shellsession
Cluster2:~ #  kubectl get po -n istio-system 

NAME                                   			READY   STATUS    RESTARTS   AGE 

istio-ingressgateway-64bd5ccbbb-kqs2h 	         1/1    Running      0       24h 

istiod-d5bc8669c-thbpj                 		     1/1    Running      0       24h 
```

<!--EndFragment-->

<!--StartFragment-->

# Step 3. Federating SPIRE: 

<!--EndFragment-->