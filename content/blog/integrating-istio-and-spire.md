---
title: Integrating ISTIO and SPIRE
date: 2023-04-25T09:54:00.229Z
author: Nishant Chaturvedi, Akansha Sajimon
authorimage: /img/Avatar1.svg
disable: false
---
This blog demonstrates how to integrate ISTIO and SPIRE to enable advanced analysis and visualization of the service mesh.  

## ISTIO 

Istio is an **open-source service mesh** that provides a uniform and efficient way to secure, connect, and monitor services. Istio automatically manages load balancing for HTTP, gRPC, WebSocket, and TCP traffic. For details, see [The Istio service mesh](https://istio.io/latest/about/service-mesh/).

![](https://istio.io/latest/docs/ops/deployment/architecture/arch.svg)



## SPIRE 

SPIRE (SPIFFE Runtime Environment) is a production-ready implementation of the SPIFFE specification that performs node and workload attestation to securely issue cryptographic identities to workloads running in heterogeneous environments. 

![](/img/spire.png)

SPIRE can be configured as a source of cryptographic identities for Istio workloads through an integration with Envoy’s SDS (Secret Discovery Service) API. 
This integration with SPIRE provides flexible attestation options not available with the default Istio identity management while harnessing Istio’s powerful service management. 

![](/img/picture1.jpg)

Later this spire issued certificates or identities to workloads or services can be used for communication between different trust domains or between two different clusters also. 
Use the steps in this blog to install Istio and Spire on the same cluster, then deploy a sample application using Spire-issued identities.  

### Step 1: Creating your own cluster

**1.1**	 Go to [Greenlake client page](https://client.greenlake.hpe.com/session/hub/choose). 

**1.2**	 Login to your tenant in HPE GreenLake Central  and navigate to HPE GreenLake for Private Cloud Enterprise dashboard. Click on Containers to launch into the containers dashboard. 

![](/img/picture2.png)

**1.3**	 You will notice a similar page as shown below. Click “create cluster” to create a new cluster, or you can also choose from the already created clusters. Ensure that you choose a cluster that does not have ISTIO pre-deployed, since this exercise will deploy SPIRE and ISTIO together.

![](/img/picture4.png)

**1.4**	 After clicking create cluster, give name and description to your cluster and type of cluster. In  our case we have chosen large type.

![](/img/picture5.png)

**1.5**	 Obtain Kubeconfig for your cluster and launch a Web terminal to access your cluster for further steps in the document. 
From the Containers main page, click Launch Service Console to launch the HPE Ezmeral Runtime Enterprise. Open Kubectl, which allows you to enter commands to communicate with your cluster.
If Kubectl is not installed, download Kubectl and the HPE Kubectl Plugin from the Dashboard.
For more information, see Dashboard - Kubernetes Tenant/Project Administrator in the HPE Ezmeral Runtime Enterprise documentation.

Step 2: Install Spire
Get the quickstart yaml file using this link and copy that into your cluster and apply it by using kubectl.

This will install SPIRE into your cluster, along with two additional components: the SPIFFE CSI Driver and the SPIRE Kubernetes Controller manager which facilitate the registration of workloads and establishment of federation relationships.
2.1 Verify installation of spire by checking if all pods are running and containers within them are up. Specifically, you are looking for agent and spire server.
Note: Number of agents depends on number of nodes you are working with. Here we are working with three worker nodes, so three agents are assigned for each node. 
Use the command given below, and you will get the output as shown.

Step 3: Install Istio

1. Download the latest release:\
   You can download the latest release using the official ISTIO repository or just copy the following command, which would do the same for you.

For details reach out to ISTIO download page.
cd into the Istio directory and set the path by command:

After exporting get out of directory.

Note: In the future, a case might occur when your cluster does not recognize “istioctl. ” In this case, export the path again after getting into istio directory.

2. Install Istio with patches: 
   After deploying SPIRE into your environment and verifying that all deployments are in Ready state, install Istio with custom patches for the Ingress-gateway as well as for Istio-proxy.
   Get the Istio-spire-config patch using this link and copy that patch into your cluster. Install that patch using following command. 	

This will share the spiffe-csi-driver with the Ingress Gateway and the sidecars that are going to be injected on workload pods, granting them access to the SPIRE Agent’s UNIX Domain Socket.

3. Patching Istio-Ingress gateways 
   If you receive the error shown below, your ingress-gateway is not patched yet and is not being registered onto the server.

3.1    For patching, the first step is to get and apply one of spire controller manager’s CRD ClusterSPIFFEID. It is a cluster-wide resource used to register workloads with SPIRE. The ClusterSPIFFEID can target all workloads in the cluster or can be optionally scoped to specific pods or namespaces via label selectors.
Create a ClusterSPIFFEID crd to generate registration entries in spire server for all workloads with the label spiffe.io/spire-managed-identity: true.\
Get the ClusterSPIFFEID used by us for this demo using this link, copy that into your cluster, and apply it.

Note: You can create your own custom clusterSPIFFEID crd with your own match label and own selector. For now, we have created simple crd with one pod selector and one match label.
3.2 Now simply patch the ingress-gateway with spiffe.io/spire managed-identity: true label.
 This will register your ingress-gateway pod into the server.  

After patching, confirm the working of your ingress-gateway pod, istiod, and all their containers.

Step 4: Deploying sample application
Now that our SPIRE and ISTIO are integrated, the identities to workloads must be issued by SPIRE. 
For our case, we will create a namespace “bookinfo” and will add a label “spiffe.io/spire-managed-identity: true” to it, then we will create a new ClusterSPIFFEID crd with namespace selector with match label as “spiffe.io/spire-managed-identity: true.” 
Now when the new workload is added to this namespace or any other namespace which has the label mentioned above, then automatically it will get registered in the server. 
4.1 Create a new namespace.

4.2 Add a label to it, same as that you have used for clusterSPIFFEID.

4.3 Enable istio-injection for this namespace so that any new pods that are created in that namespace will automatically have a sidecar added to them. You can achieve this by just adding another label in similar fashion.

After all edits to your namespace, the namespace would look similar as shown below.
Note: You can edit further if you want using following command, but take care that your resulting yaml is not invalid. You can validate your yaml using any online validator available.

4.2 Create and apply a ClusterSPIFFEID crd with namespace selector. 
Copy the clusterSPIFFEID from this link and just change the selector to namespace selector and make sure that the correct match label is there like shown below. 

After editing your clusterSPIFFEID, apply it using kubectl.

4.3 After successfully creating namespace and applying crd, deploy your application in the namespace you created. But before you deploy your application, the workloads will need the SPIFFE CSI Driver volume to access the SPIRE Agent socket. To accomplish this, we can leverage the spire pod annotation template:
annotations:
            inject.istio.io/templates: "sidecar,spire"
You can patch it to workload or just add this to your deployment manifest at {spec:{template:{metadata:{ annotation:}}}} as shown below.

You can get the sample bookinfo application manifest from this link.
Note: This manifest is annotation free, so you need to add annotation to its deployments by following above shown steps.
After editing the manifest, apply it in a newly created namespace.

Verify all workloads and services you just deployed are running and up.

You will get output as shown below if everything is working fine.

Once everything is up, all workloads would get registered under spire server.
4.5 You can verify the registration of workloads using the following command:

Verify that every workload with same label as clusterSPIFFEID crd’s match label is registered in the server.

4.6 Verify that the certificate issuer of workloads is spire using following commands for each workload.

You should also check the same for ingress-gateway pod in istio-system namespace and verify that your deployed workloads and ingress-gateway has the same issuer.

Step 5: Open the application outside traffic 
The Bookinfo application is deployed but not accessible from the outside. To make it accessible, you need to create an Istio Ingress Gateway, which maps a path to a route at the edge of your mesh.
5.1 Associate this application with the Istio gateway:

5.2 Ensure that there are no issues with the configuration:

5.3 Execute the following command to determine if your Kubernetes cluster is running in an environment that supports external load balancers:

If the EXTERNAL-IP value is set, your environment has an external load balancer; if not, then set the external load balancer first then follow further steps.
For this cluster we are using metallb.
5.4 Download and install Kiali dashboard and Prometheus.
Install Kiali:
Kiali is an observability console for Istio with service mesh configuration and validation capabilities. It helps you understand the structure and health of your service mesh by monitoring traffic.

Install Prometheus: 
Prometheus is an open-source monitoring system and time series database. You can use Prometheus with Istio to record metrics that track the health of Istio and of applications within the service mesh.

5.5 Later after setting up ingress gateway and bookinfo gateway, we will view the dashboard, so for that you need to make these setting changes in your system proxy status.
Go to Settings > Network > Proxy status > Turn Use a proxy server On. In the exceptions field add your external IP address of kiali and ingressgateway service.
You can get IPs of these services by following command:

Format: http://{external ip};
Note: Your kiali service might be of ClusterIP type, so to get the external IP for this service, you first need to edit the service type to LoadBalancer.

* Use the following command to edit the service, then edit the service type.

  ```

  ```

  5.6 Set the ingress IP and ports:

  5.7 Export and Set GATEWAY_URL:

  ```

  ```

You can generate traffic on product page by just reaching out to shown http URL. 
Note: Before reaching out to this page and kiali in further step, ensure that you have followed 
Step 5.5 properly.

5.9 Kiali Dashboard
Generate traffic on product page and observe the graphs on Kiali dashboard.
Reach out to kiali dashboard in your browser by just copying external IP from above and http into that IP and port.

After reaching kiali dashboard, generate traffic on product page and simultaneously, vview and analyse traffic on kiali using various graphs and visualising methods.
App Graph:

Service Graph:

The graph below shows services communication, and the lock here symbolises mTls protocol.

We hope that this blog has helped you in integrating ISTIO and SPIRE from scratch, getting SPIRE issued identities for your sample application workloads, and setting up Kiali on your cluster for better visualisation of your service mesh.