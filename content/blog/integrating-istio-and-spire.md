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

```shellsession
kubectl apply -f spire-quickstart.yaml
```

This will install SPIRE into your cluster, along with two additional components: the SPIFFE CSI Driver and the SPIRE Kubernetes **Controller manager** which facilitate the registration of workloads and establishment of federation relationships.

Verify installation of SPIRE by checking if all pods are running and containers within them are up. Specifically, you are looking for agent and SPIRE server.

**Note:** Number of agents depends on number of nodes you are working with. Here we are working with three worker nodes, so three agents are assigned for each node. 

Use the command given below, and you will get the output as shown.

```shellsession
k8s-spiffe-integ-master-7j7fh-m67q9:~ kubectl get pods -n spire
NAME                            READY   STATUS    RESTARTS       AGE
spire-agent-5tlck               3/3     Running   2 (31d ago)    31d
spire-agent-gnwbj               3/3     Running   1 (31d ago)    31d
spire-agent-mghnw               3/3     Running   2 (31d ago)    31d
spire-server-574474c7dc-42kln   2/2     Running   4 (4d1h ago)   31d
```

### Step 3: Install Istio

#### Download the latest release:

\
You can download the latest release using the official Istio repository or just copy the following command, which would do the same for you.

```shellsession
curl -L https://istio.io/downloadIstio | sh -
```

For details reach out to **[ISTIO download page](https://istio.io/latest/docs/setup/getting-started/#download)**.

cd into the Istio directory and set the path by command:

```shellsession
export PATH=$PWD/bin:$PATH
```

After exporting get out of directory.

```shellsession
cd ..
```

**Note:** In the future, a case might occur when your cluster does not recognize istioctl. In this case, export the path again after getting into istio directory.

#### **Install Istio with patches:**

After deploying SPIRE into your environment and verifying that all deployments are in Ready state, install Istio with custom patches for the Ingress-gateway as well as for Istio-proxy.

Get the istio-spire-config patch using **[this link](https://raw.githubusercontent.com/cxteamtrials/caas-trials-content/main/services/istio/release-1.17/spire/spire-patch.yaml)** and copy that patch into your cluster. Install that patch using following command.

```shellsession
istioctl install -f istio-spire-config.yaml
```

This will share the spiffe-csi-driver with the Ingress Gateway and the sidecars that are going to be injected on workload pods, granting them access to the SPIRE Agent’s UNIX Domain Socket.

* #### Patching Istio-Ingress gateways

  If you receive the error shown below, your ingress-gateway is not patched yet and is not being registered onto the server.

  ![](/img/patch-error-ingress.jpg)

   For patching, the first step is to get and apply one of SPIRE controller manager’s [CRD(Custom Resource Definition)](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) ClusterSPIFFEID. It is a cluster-wide resource used to register workloads with SPIRE. The ClusterSPIFFEID can target all workloads in the cluster or can be optionally scoped to specific pods or namespaces via label selectors.

  Create a ClusterSPIFFEID CRD to generate registration entries in SPIRE server for all workloads with the label **`spiffe.io/spire-managed-identity: true`**.

  \
  Get the ClusterSPIFFEID used by us for this demo using **[this link](https://raw.githubusercontent.com/cxteamtrials/caas-trials-content/main/services/spire/clusterspiffeid-example.yaml)**, copy that into your cluster, and apply it.

  ```shellsession
  kubectl apply -f cluster-spiffeID-crd.yaml
  ```

  **Note:** You can create your own custom clusterSPIFFEID CRD with your own match label and own selector. For now, we have created simple CRD with one pod selector and one match label.

  Now simply patch the ingress-gateway with spiffe.io/spire managed-identity: true label.

   This will register your ingress-gateway pod into the server.  

  ```shellsession
  kubectl patch deployment istio-ingressgateway -n istio-system -p '{"spec":{"template":{"metadata":{"labels":{"spiffe.io/spire-managed-identity": "true"}}}}}'
  ```

  After patching, confirm the working of your ingress-gateway pod, istiod, and all their containers.



## Step 4: Deploying Sample Application

Now that our SPIRE and Istio are integrated, the identities to workloads must be issued by SPIRE. 

For our case, we will create a namespace “bookinfo” and will add a label **“spiffe.io/spire-managed-identity: true”** to it, then we will create a new ClusterSPIFFEID CRD with **namespace selector** with match label as “spiffe.io/spire-managed-identity: true.” 

Now when the new workload is added to this namespace or any other namespace which has the label mentioned above, then automatically it will get registered in the server. 

**4.1** Create a new namespace.    

```shellsession
kubectl create namespace <insert-namespace-name-here>
```

**4.2** Add a label to it, same as that you have used for clusterSPIFFEID.

```shellsession
kubectl label namespaces <namespace_name> spiffe.io/spire-managed-identity=true
```

**4.3** Enable istio-injection for this namespace so that any new pods that are created in that namespace will automatically have a sidecar added to them. You can achieve this by just adding another label in similar fashion.

```shellsession
kubectl label namespace <namespace_name> istio-injection=enabled --overwrite
```

After all edits to your namespace, the namespace would look similar as shown below.

**Note:** You can edit further if you want using following command, but take care that your resulting yaml is not invalid. You can validate your yaml using any online validator available.

```shellsession
kubectl edit ns <namespace_name>
```

```yaml
apiVersion: v1
kind: Namespace
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"v1","kind":"Namespace","metadata":{"annotations":{},"labels":{"name":"backend"},"name":"bookinfo"}}
  creationTimestamp: "2023-03-21T06:23:38Z"
  labels:
    istio-injection: enabled
    kubernetes.io/metadata.name: bookinfo
    spiffe.io/spire-managed-identity: "true"
  name: bookinfo
  resourceVersion: "6116523"
  uid: 6193a0b7-8455-46bd-a456-797ef69c045a
spec:
  finalizers:
  - kubernetes
status:
  phase: Active
```

**4.4** Create and apply a ClusterSPIFFEID CRD with namespace selector. 

Copy the clusterSPIFFEID from **[this link](https://raw.githubusercontent.com/cxteamtrials/caas-trials-content/main/services/spire/clusterspiffeid-example.yaml)** and just change the selector to **namespace selector** and make sure that the correct match label is there like shown below. 

```yaml
apiVersion: spire.spiffe.io/v1alpha1
kind: ClusterSPIFFEID
metadata:
  name: bookinfo
spec:
  spiffeIDTemplate: "spiffe://{{ .TrustDomain }}/ns/{{ .PodMeta.Namespace }}/sa/{{ .PodSpec.ServiceAccountName }}"
  namespaceSelector:
    matchLabels:
      spiffe.io/spire-managed-identity: "true"
```

After editing your clusterSPIFFEID, apply it using kubectl.

```shellsession
kubectl apply -f <your_clusterSPIFFEID_name>
```

**4.5**  After successfully creating namespace and applying CRD, deploy your application in the namespace you created. But before you deploy your application, the workloads will need the SPIFFE CSI Driver volume to access the SPIRE Agent socket. To accomplish this, we can leverage the SPIRE pod annotation template:

```yaml
annotations:
            inject.istio.io/templates: "sidecar,spire"
```

You can patch it to workload or just add this to your deployment manifest at **{spec:{template:{metadata:{ annotation:}}}}** as shown below.

![](/img/sidecar-patch.png)

You can get the sample bookinfo application manifest from **[this link](https://raw.githubusercontent.com/cxteamtrials/caas-trials-content/main/services/istio/release-1.16/samples/bookinfo/bookinfo.yaml)**.

**Note:** This manifest is annotation free, so you need to add annotation to its deployments by following above shown steps.

After editing the manifest, apply it in a newly created namespace.

```shellsession
kubectl apply -f bookinfo.yaml -n <namespace_name>
```

Verify all workloads and services you just deployed are running and up.

```shellsession
kubectl get all -n <namespace_name>
```

You will get output as shown below if everything is working fine.

```shellsession
k8s-spiffe-integ-master-7j7fh-m67q9:~ kubectl get all -n bookinfo
NAME                                 READY   STATUS    RESTARTS      AGE
pod/details-v1-f8957ccb4-7vdgw       2/2     Running   0             37d
pod/productpage-v1-cfb4bc854-5km2l   2/2     Running   0             37d
pod/ratings-v1-65cd6fbcd8-s9jnc      2/2     Running   0             37d
pod/reviews-v1-55f769fb78-czh7j      2/2     Running   0             37d
pod/reviews-v2-6b7c798cc8-wkpxg      2/2     Running   0             37d
pod/reviews-v3-695c7f59db-nzwwk      2/2     Running   2 (34d ago)   37d

NAME                  TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
service/details       ClusterIP   10.111.38.161    <none>        9080/TCP   37d
service/productpage   ClusterIP   10.102.189.161   <none>        9080/TCP   37d
service/ratings       ClusterIP   10.105.7.153     <none>        9080/TCP   37d
service/reviews       ClusterIP   10.106.49.246    <none>        9080/TCP   37d

NAME                             READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/details-v1       1/1     1            1           37d
deployment.apps/productpage-v1   1/1     1            1           37d
deployment.apps/ratings-v1       1/1     1            1           37d
deployment.apps/reviews-v1       1/1     1            1           37d
deployment.apps/reviews-v2       1/1     1            1           37d
deployment.apps/reviews-v3       1/1     1            1           37d

NAME                                       DESIRED   CURRENT   READY   AGE
replicaset.apps/details-v1-f8957ccb4       1         1         1       37d
replicaset.apps/productpage-v1-cfb4bc854   1         1         1       37d
replicaset.apps/ratings-v1-65cd6fbcd8      1         1         1       37d
replicaset.apps/reviews-v1-55f769fb78      1         1         1       37d
replicaset.apps/reviews-v2-6b7c798cc8      1         1         1       37d
replicaset.apps/reviews-v3-695c7f59db      1         1         1       37d
```

Once everything is up, all workloads would get registered under SPIRE server.

**4.6** You can verify the registration of workloads using the following command:

```shellsession
kubectl exec <spire-server_pod_name> -n spire -c spire-server -- ./bin/spire-server entry show
```

Verify that every workload with same label as clusterSPIFFEID CRD’s match label is registered in the server.

![](/img/server-entries.png)

**4.7** Verify that the certificate issuer of workloads is SPIRE using following commands for each workload.

```shellsession
istioctl proxy-config secret <pod_name> -n <namespace_name> -o json | jq -r '.dynamicActiveSecrets[0].secret.tlsCertificate.certificateChain.inlineBytes' | base64 --decode > chain.pem
```

```shellsession
k8s-spiffe-integ-master-7j7fh-m67q9:~ openssl x509 -in chain.pem -text | grep SPIRE
 Subject: C = US, O = SPIRE, x500UniqueIdentifier = e2f9c35b9198e1824373e874b13287d0
```

You should also check the same for ingress-gateway pod in Istio-system namespace and verify that your deployed workloads and ingress-gateway has the same issuer.

#### Step 5: Open the application outside traffic

The Bookinfo application is deployed but not accessible from the outside. To make it accessible, you need to create an Istio Ingress Gateway, which maps a path to a route at the edge of your mesh.

**5.1** Associate this application with the Istio gateway:

```shellsession
kubectl apply -f samples/bookinfo/networking/bookinfo-gateway.yaml -n bookinfo
```

**5.2** Ensure that there are no issues with the configuration:

```
k8s-spiffe-integ-master-7j7fh-m67q9:~ # istioctl analyze -n bookinfo

✔ No validation issues found when analyzing namespace: bookinfo.
```

**5.3** Execute the following command to determine if your Kubernetes cluster is running in an environment that supports external load balancers:

```shellsession
k8s-spiffe-integ-master-7j7fh-m67q9:~ kubectl get svc istio-ingressgateway -n istio-system
NAME                   TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)                                      AGE
istio-ingressgateway   LoadBalancer   10.105.191.32   172.16.17.5   15021:30189/TCP,80:30392/TCP,443:30566/TCP   32d
```

If the EXTERNAL-IP value is set, your environment has an external load balancer; if not, then set the external load balancer first then follow further steps.

For this cluster we are using metallb.

**5.4** Download and install Kiali dashboard and Prometheus.

**Install Kiali:**

**[Kiali](https://kiali.io/)** is an observability console for Istio with service mesh configuration and validation capabilities. It helps you understand the structure and health of your service mesh by monitoring traffic.

```shellsession
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.17/samples/addons/kiali.yaml
```

**Install Prometheus:** 

**[Prometheus](https://prometheus.io/)** is an open-source monitoring system and time series database. You can use Prometheus with Istio to record metrics that track the health of Istio and of applications within the service mesh.

```shellsession
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.17/samples/addons/prometheus.yaml
```

**5.5** Later after setting up ingress gateway and bookinfo gateway, we will view the dashboard, so for that you need to make these setting changes in your system proxy status.

Go to **Settings > Network > Proxy status >** Turn Use a **proxy server On**. In the exceptions field add your external IP address of kiali and ingressgateway service.

You can get IPs of these services by following command:

```shellsession
k8s-spiffe-integ-master-7j7fh-m67q9:~ kubectl get svc -n istio-system
NAME                   TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)                                      AGE
istio-ingressgateway   LoadBalancer   10.105.191.32   172.16.17.5   15021:30189/TCP,80:30392/TCP,443:30566/TCP   32d
istiod                 ClusterIP      10.101.27.65    <none>        15010/TCP,15012/TCP,443/TCP,15014/TCP        32d
kiali                  LoadBalancer   10.103.14.197   172.16.17.6   20001:32116/TCP,9090:31950/TCP               32d
prometheus             ClusterIP      10.98.101.102   <none>        9090/TCP                                     32d
```

![](/img/manual_proxy.png)

**Format:** `http://{external ip};`

**Note:** Your kiali service might be of ClusterIP type, so to get the external IP for this service, you first need to edit the service type to LoadBalancer.

* Use the following command to edit the service, then edit the service type.

  ```shellsession
  kubectl edit svc kiali -n istio-system
  ```

  Edit the service type **{spec: {type:LoadBalancer}}** as shown below

  ![](/img/service_edit.png)

**5﻿.6**  Set the ingress IP and ports:

```shellsession
export INGRESS_NAME=istio-ingressgateway

export INGRESS_NS=istio-system

export INGRESS_HOST=$(kubectl -n "$INGRESS_NS" get service "$INGRESS_NAME" -o jsonpath='{.status.loadBalancer.ingress[0].ip}')

export INGRESS_PORT=$(kubectl -n "$INGRESS_NS" get service "$INGRESS_NAME" -o jsonpath='{.spec.ports[?(@.name=="http2")].port}')
```

**5.7**  Export and Set GATEWAY_URL: 

```shellsession
export GATEWAY_URL=$INGRESS_HOST:$INGRESS_PORT
```

```shellsession
k8s-spiffe-integ-master-7j7fh-m67q9:~ echo "$GATEWAY_URL"
172.16.17.5:80
```

Curl into productpage using gateway URL using following command.

```shellsession
k8s-spiffe-integ-master-7j7fh-m67q9:~ curl -v  http://$GATEWAY_URL/productpage
* Uses proxy env variable no_proxy == 'localhost,127.0.0.1,10.96.0.1,172.16.5.41,172.16.5.42,172.16.5.43,172.16.5.44,172.16.5.45,172.16.5.46,172.16.5.40,glhc-caas.glhc-hpe.local,.glhc-hpe.local,glhc-caas.customer.hpe.net,172.16.17.20,172.16.17.21,172.16.17.22,172.16.5.47,gl-pulpnode.glhc-hpe.local,gl-pulpnode,10.96.0.1,10.192.0.0/12,10.96.0.0/12,.svc,.cluster.local,.default.svc,.customer.hpe.net,172.16.17.23,172.16.17.30,gl-cp-gw-node2.glhc-hpe.local,gl-cp-gw-node1.glhc-hpe.local,172.16.17.50'
* Uses proxy env variable http_proxy == 'http://172.16.0.250:8080'
*   Trying 172.16.0.250:8080...
* TCP_NODELAY set
* Connected to 172.16.0.250 (172.16.0.250) port 8080 (#0)
> GET http://172.16.17.5:80/productpage HTTP/1.1
> Host: 172.16.17.5
> User-Agent: curl/7.66.0
> Accept: */*
> Proxy-Connection: Keep-Alive
>
```

You can generate traffic on product page by just reaching out to shown http URL. 

**Note:** Before reaching out to this page and kiali in further step, ensure that you have followed step 5.5 properly.

**5.9** **Kiali Dashboard**

Generate traffic on product page and observe the graphs on Kiali dashboard.
Reach out to kiali dashboard in your browser by just copying external IP from above and http into that IP and port.

```shellsession
http://<kiali_external_ip>:<port>
```

After reaching kiali dashboard, generate traffic on product page and simultaneously, view and analyse traffic on kiali using various graphs and visualising methods.

**App Graph:**

![](/img/app_graph.png)

**Service Graph:**

![](/img/service_graph-1.png)

![](/img/service_graph-22.png)

The graph below shows services communication, and the lock here symbolises **mTls protocol**.

We hope that this blog has helped you in integrating Istio and SPIRE from scratch, getting SPIRE issued identities for your sample application workloads, and setting up Kiali on your cluster for better visualisation of your service mesh.