---
title: Integrating Istio and SPIRE on HPE GreenLake for Private Cloud Enterprise
date: 2023-04-25T09:54:00.229Z
author: Nishant Chaturvedi, Akansha Sajimon
authorimage: /img/Avatar1.svg
disable: false
tags:
  - spiffe-and-spire-projects
  - hpe-greenlake-for-private-cloud-enterprise
  - SPIFFE
  - SPIRE
  - istio
---
This blog demonstrates how to integrate Istio and SPIRE to enable advanced analysis and visualization of the service mesh.  

## Istio

Istio is an **open-source service mesh** that provides a uniform and efficient way to secure, connect, and monitor services. Istio automatically manages load balancing for HTTP, gRPC, WebSocket, and TCP traffic. For details, see [The Istio service mesh](https://istio.io/latest/about/service-mesh/).

![](https://istio.io/latest/docs/ops/deployment/architecture/arch.svg)

## SPIRE

SPIRE (SPIFFE Runtime Environment) is a production-ready implementation of the SPIFFE(Secure Production Identity Framework for Everyone) specification that performs node and workload attestation to securely issue cryptographic identities to workloads running in heterogeneous environments. 

![](/img/spire.png)

SPIRE can be configured as a source of cryptographic identities for Istio workloads through an integration with Envoy’s SDS (Secret Discovery Service) API. 
This integration with SPIRE provides flexible attestation options not available with the default Istio identity management while harnessing Istio’s powerful service management. 

![](/img/picture1.jpg)

Later this SPIRE issued certificates or identities to workloads or services can be used for communication between different trust domains or between two different clusters also. 

Use the steps in this blog to install Istio and SPIRE on the same cluster, then deploy a sample application using SPIRE-issued identities.  

### Step 1: Creating your own cluster

**1﻿.1**  Go to [HPE Greenlake ](https://client.greenlake.hpe.com/session/hub/choose)client page. 

**1.2**  Login to your tenant in HPE GreenLake Central  and navigate to HPE GreenLake for Private Cloud Enterprise dashboard. Click on Containers to launch into the containers dashboard. 

![](/img/picture2.png)

**1﻿.3**  You will notice a similar page as shown below. Click “create cluster” to create a new cluster, or you can also choose from the already created clusters. Ensure that you choose a cluster that does not have Istio pre-deployed, since this exercise will deploy SPIRE and Istio together.

![](/img/picture4.png)

**1.4**	 After clicking create cluster, give name and description to your cluster and type of cluster. In  our case we have chosen large type.

![](/img/picture5.png)

**1.5**	 Obtain Kubeconfig for your cluster and launch a Web terminal to access your cluster for further steps in the document. 

From the **Containers** main page, click **Launch Service Console** to launch the HPE Ezmeral Runtime Enterprise. Open Kubectl, which allows you to enter commands to communicate with your cluster.

If Kubectl is not installed, download Kubectl and the HPE Kubectl Plugin from the **Dashboard**.

For more information, see** [Dashboard - Kubernetes Tenant/Project Administrator](https://docs.containerplatform.hpe.com/55/reference/kubernetes/tenant-project-administration/Dashboard__Kubernetes_TenantProject_Administrator.html)** in the HPE Ezmeral Runtime Enterprise documentation.

### Step 2: Install SPIRE

Get the quickstart yaml file using **[this link](https://raw.githubusercontent.com/cxteamtrials/caas-trials-content/main/services/spire/spire-quickstart.yaml)** and copy that into your cluster and apply it by using kubectl.

**`kubectl apply -f spire-quickstart.yaml`**

This will install SPIRE into your cluster, along with two additional components: the SPIFFE CSI Driver and the SPIRE Kubernetes **Controller manager** which facilitate the registration of workloads and establishment of federation relationships.

Verify installation of SPIRE by checking if all pods are running and containers within them are up. Specifically, you are looking for agent and SPIRE server.

**Note:** Number of agents depends on number of nodes you are working with. Here we are working with three worker nodes, so three agents are assigned for each node. 

Use the command given below, and you will get the output as shown.

**`kubectl get pods -n spire`**

```shellsession
kubectl get pods -n spire
```

![](/img/getpodsspire.png)

### Step 3: Install Istio

1. #### Download the latest release:

   \
   You can download the latest release using the official Istio repository or just copy the following command, which would do the same for you.

   **`curl -L https://istio.io/downloadIstio | sh -`**

For details reach out to **[ISTIO download page](https://istio.io/latest/docs/setup/getting-started/#download)**.

cd into the Istio directory and set the path by command:

`export PATH=$PWD/bin:$PATH`

After exporting get out of directory.

**`cd ..`**

**Note:** In the future, a case might occur when your cluster does not recognize istioctl. In this case, export the path again after getting into istio directory.

2. #### Install Istio with patches:

   After deploying SPIRE into your environment and verifying that all deployments are in Ready state, install Istio with custom patches for the Ingress-gateway as well as for Istio-proxy.

   Get the istio-spire-config patch using **[this link](https://raw.githubusercontent.com/cxteamtrials/caas-trials-content/main/services/istio/release-1.17/spire/spire-patch.yaml)** and copy that patch into your cluster. Install that patch using following command.

   **`istioctl install -f istio-spire-config.yaml`**

   ```shellsession
   istioctl install -f istio-spire-config.yaml
   ```

   This will share the spiffe-csi-driver with the Ingress Gateway and the sidecars that are going to be injected on workload pods, granting them access to the SPIRE Agent’s UNIX Domain Socket.
3. #### Patching Istio-Ingress gateways

   If you receive the error shown below, your ingress-gateway is not patched yet and is not being registered onto the server.

   ![](/img/patch-error-ingress.jpg)

 **3.1**  For patching, the first step is to get and apply one of SPIRE controller manager’s [CRD(Custom Resource Definition)](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) ClusterSPIFFEID. It is a cluster-wide resource used to register workloads with SPIRE. The ClusterSPIFFEID can target all workloads in the cluster or can be optionally scoped to specific pods or namespaces via label selectors.

Create a ClusterSPIFFEID CRD to generate registration entries in SPIRE server for all workloads with the label **`spiffe.io/spire-managed-identity: true`**.

\
Get the ClusterSPIFFEID used by us for this demo using **[this link](https://raw.githubusercontent.com/cxteamtrials/caas-trials-content/main/services/spire/clusterspiffeid-example.yaml)**, copy that into your cluster, and apply it.

**`kubectl apply -f cluster-spiffeID-crd.yaml`**

**Note:** You can create your own custom clusterSPIFFEID CRD with your own match label and own selector. For now, we have created simple CRD with one pod selector and one match label.

**3.2** Now simply patch the ingress-gateway with spiffe.io/spire managed-identity: true label.

 This will register your ingress-gateway pod into the server.  

**`kubectl patch deployment istio-ingressgateway -n istio-system -p '{"spec":{"template":{"metadata":{"labels":{"spiffe.io/spire-managed-identity": "true"}}}}}'`**

After patching, confirm the working of your ingress-gateway pod, istiod, and all their containers.

**`kubectl get pods -n istio-system`**

![](/img/pods.png)

#### Step 4: Deploying Sample Application

Now that our SPIRE and Istio are integrated, the identities to workloads must be issued by SPIRE. 

For our case, we will create a namespace “bookinfo” and will add a label **“spiffe.io/spire-managed-identity: true”** to it, then we will create a new ClusterSPIFFEID CRD with **namespace selector** with match label as “spiffe.io/spire-managed-identity: true.” 

Now when the new workload is added to this namespace or any other namespace which has the label mentioned above, then automatically it will get registered in the server. 

**4.1** Create a new namespace.    

**`kubectl create namespace <insert-namespace-name-here>`**

**4.2** Add a label to it, same as that you have used for clusterSPIFFEID.

`kubectl label namespaces <namespace_name> spiffe.io/spire-managed-identity=true`

**4.3** Enable istio-injection for this namespace so that any new pods that are created in that namespace will automatically have a sidecar added to them. You can achieve this by just adding another label in similar fashion.

**`kubectl label namespace <namespace_name> istio-injection=enabled --overwrite`**

After all edits to your namespace, the namespace would look similar as shown below.

**Note:** You can edit further if you want using following command, but take care that your resulting yaml is not invalid. You can validate your yaml using any online validator available.

**`kubectl edit ns <namespace_name>`**

![](/img/namespace.png)

**4.4** Create and apply a ClusterSPIFFEID CRD with namespace selector. 

Copy the clusterSPIFFEID from **[this link](https://raw.githubusercontent.com/cxteamtrials/caas-trials-content/main/services/spire/clusterspiffeid-example.yaml)** and just change the selector to **namespace selector** and make sure that the correct match label is there like shown below. 

![](/img/crd.png)

After editing your clusterSPIFFEID, apply it using kubectl.

**`kubectl apply -f <your_clusterSPIFFEID_name>`**

**4.5**  After successfully creating namespace and applying CRD, deploy your application in the namespace you created. But before you deploy your application, the workloads will need the SPIFFE CSI Driver volume to access the SPIRE Agent socket. To accomplish this, we can leverage the SPIRE pod annotation template:

### `annotations:`

```
        inject.istio.io/templates: "sidecar,spire"
```

You can patch it to workload or just add this to your deployment manifest at **{spec:{template:{metadata:{ annotation:}}}}** as shown below.

![](/img/sidecar-patch.png)

You can get the sample bookinfo application manifest from **[this link](https://raw.githubusercontent.com/cxteamtrials/caas-trials-content/main/services/istio/release-1.16/samples/bookinfo/bookinfo.yaml)**.

**Note:** This manifest is annotation free, so you need to add annotation to its deployments by following above shown steps.

After editing the manifest, apply it in a newly created namespace.

**`kubectl apply -f bookinfo.yaml -n <namespace_name>`**

Verify all workloads and services you just deployed are running and up.

**`kubectl get all -n <namespace_name>`**

You will get output as shown below if everything is working fine.

![](/img/bookinfo-all-pods.png)

Once everything is up, all workloads would get registered under SPIRE server.

**4.6** You can verify the registration of workloads using the following command:

**`kubectl exec <spire-server_pod_name> -n spire -c spire-server -- ./bin/spire-server entry show`**

Verify that every workload with same label as clusterSPIFFEID CRD’s match label is registered in the server.

![](/img/server-entries.png)

**4.7** Verify that the certificate issuer of workloads is SPIRE using following commands for each workload.

**`istioctl proxy-config secret <pod_name> -n <namespace_name> -o json | jq -r '.dynamicActiveSecrets[0].secret.tlsCertificate.certificateChain.inlineBytes' | base64 --decode > chain.pem`**

**`openssl x509 -in chain.pem -text | grep SPIRE`**

![](/img/spire-verify.png)

You should also check the same for ingress-gateway pod in Istio-system namespace and verify that your deployed workloads and ingress-gateway has the same issuer.

#### Step 5: Open the application outside traffic

The Bookinfo application is deployed but not accessible from the outside. To make it accessible, you need to create an Istio Ingress Gateway, which maps a path to a route at the edge of your mesh.

**5.1** Associate this application with the Istio gateway:

**`kubectl apply -f samples/bookinfo/networking/bookinfo-gateway.yaml -n bookinfo`**

**5.2** Ensure that there are no issues with the configuration:

**`istioctl analyze -n bookinfo`**

![](/img/bookinfo-analyze.png)

**5.3** Execute the following command to determine if your Kubernetes cluster is running in an environment that supports external load balancers:

**`kubectl get svc istio-ingressgateway -n istio-system`**

![](/img/ingress-gateway-svc.png)

If the EXTERNAL-IP value is set, your environment has an external load balancer; if not, then set the external load balancer first then follow further steps.

For this cluster we are using metallb.

**5.4** Download and install Kiali dashboard and Prometheus.

**Install Kiali:**

**[Kiali](https://kiali.io/)** is an observability console for Istio with service mesh configuration and validation capabilities. It helps you understand the structure and health of your service mesh by monitoring traffic.

**`kubectl apply -f`[`https://raw.githubusercontent.com/istio/istio/release-1.17/samples/addons/kiali.yaml`](https://raw.githubusercontent.com/istio/istio/release-1.17/samples/addons/kiali.yaml)``**

**Install Prometheus:** 

**[Prometheus](https://prometheus.io/)** is an open-source monitoring system and time series database. You can use Prometheus with Istio to record metrics that track the health of Istio and of applications within the service mesh.

**`kubectl apply -f`[`https://raw.githubusercontent.com/istio/istio/release-1.17/samples/addons/prometheus.yaml`](https://raw.githubusercontent.com/istio/istio/release-1.17/samples/addons/prometheus.yaml)``**

**5.5** Later after setting up ingress gateway and bookinfo gateway, we will view the dashboard, so for that you need to make these setting changes in your system proxy status.

Go to **Settings > Network > Proxy status >** Turn Use a **proxy server On**. In the exceptions field add your external IP address of kiali and ingressgateway service.

You can get IPs of these services by following command:

**`kubectl get svc -n istio-system`**

![](/img/istio-system-svcs.png)

![](/img/manual_proxy.png)

**Format:** `http://{external ip};`

**Note:** Your kiali service might be of ClusterIP type, so to get the external IP for this service, you first need to edit the service type to LoadBalancer.

* Use the following command to edit the service, then edit the service type.

  **`kubectl edit svc kiali -n istio-system`**

  Edit the service type **{spec: {type:LoadBalancer}}** as shown below

  ![](/img/service_edit.png)

**5﻿.6**  Set the ingress IP and ports:

**`export INGRESS_NAME=istio-ingressgateway`**

**`export INGRESS_NS=istio-system`**

**`export INGRESS_HOST=$(kubectl -n "$INGRESS_NS" get service "$INGRESS_NAME" -o jsonpath='{.status.loadBalancer.ingress[0].ip}')`**

**`export INGRESS_PORT=$(kubectl -n "$INGRESS_NS" get service "$INGRESS_NAME" -o jsonpath='{.spec.ports[?(@.name=="http2")].port}')`**

**5.7**  Export and Set GATEWAY_URL: 

**`export GATEWAY_URL=$INGRESS_HOST:$INGRESS_PORT`**

**`echo "$GATEWAY_URL"`**

![](/img/gateway_url.png)

Curl into productpage using gateway URL using following command.

**`curl -v  http://$GATEWAY_URL/productpage`**

![](/img/prfuct_page.png)

You can generate traffic on product page by just reaching out to shown http URL. 

**Note:** Before reaching out to this page and kiali in further step, ensure that you have followed step 5.5 properly.

**5.9** **Kiali Dashboard**

Generate traffic on product page and observe the graphs on Kiali dashboard.
Reach out to kiali dashboard in your browser by just copying external IP from above and http into that IP and port.

**`http://<kiali_external_ip>:<port>`**

After reaching kiali dashboard, generate traffic on product page and simultaneously, view and analyse traffic on kiali using various graphs and visualising methods.

**App Graph:**

![](/img/app_graph.png)

**Service Graph:**

![](/img/service_graph-1.png)

![](/img/service_graph-22.png)

The graph below shows services communication, and the lock here symbolises **mTls protocol**.

We hope that this blog has helped you in integrating Istio and SPIRE from scratch, getting SPIRE issued identities for your sample application workloads, and setting up Kiali on your cluster for better visualisation of your service mesh.