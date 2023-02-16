---
title: A guide to enable managed Istio service mesh in a Kubernetes cluster on
  HPE GreenLake for Private Cloud Enterprise
date: 2023-02-16T13:36:32.997Z
author: Akash Patel, Guoping Jia, Sonu Sudhakaran
authorimage: /img/Avatar1.svg
disable: false
tags:
  - HPE GreenLake for Containers
  - hpe-greenlake
  - developer
  - istio-service-mesh
  - add-on
  - hpe-greenlake-for-private-cloud-enterprise
  - containers-service
  - devops
  - sre
  - site-reliability-engineer
  - hpe-greenlake-for-private-cloud-enterprise-containers
---
**Introduction**

In this blog post, we demonstrate how an end user can deploy a containerized application or a managed service on a Kubernetes-based container stack using the cluster add-on feature provided by **HPE GreenLake for Private Cloud Enterprise: Containers** and then access it over an external network or internet. The containers service evaluates the user’s environment and makes add-ons available to the user so that they can add the containerized application or managed service to the cluster as required.

**HPE GreenLake for Private Cloud Enterprise: Containers: Enabling Istio service mesh add-on from a cluster**

**Service mesh** is a network of microservices that consists of distributed applications and communications between those applications. It is a dedicated infrastructure layer that facilitates service-to-service communications routed through the proxy, ensuring secure communication.

**Istio** is an open-source service mesh that provides a platform for distributed applications that includes API integrations with logging, telemetry, or policy systems. It provides a uniform and more efficient way to secure, connect, and monitor services. Istio automatically manages load balancing for HTTP, gRPC, WebSocket, and TCP traffic. For details, see **[The Istio service mesh](https://istio.io/latest/about/service-mesh/)**.

**Step-1: Create a Kubernetes cluster from containers page**

To create a cluster, you must have been assigned the roles of **Private Cloud Cluster Owner** and **Private Cloud Widget Viewer**.

* From the Containers main page, under the Clusters tab, click Create Cluster.
* In the Create Cluster form, provide the cluster name '**hpe**', and select the standard cluster blueprint. The new cluster appears in the list of clusters.

![](/img/clustermainpage-2.png)

As indicated above, there are multiple clusters deployed in parallel for multiple purposes. For the **Istio** service mesh add-on enablement/deployment in our example, we will use created cluster with the name '**hpe**'.

![](/img/clusterhpeview.png)

**Step-2: Enabling an add-on from a cluster**

* On the Containers main page, click a cluster row to open the cluster details screen.
* On the cluster details screen, click the Add-ons tab.
* Click Enable Add-on if no add-ons are enabled or click Enable Another Add-on.

![](/img/blankaddonpage.png)

* In the Enable Addon wizard, select the add-on and click Next.

![](/img/istioaddonpage-1.png)

* Provide the values for the fields that appear for the selected add-on and click Next.
* Read and accept the license agreement and click Enable.

![](/img/istioaddonpage-2.png)

![](/img/istioaddongreenstatus.png)

![](/img/istioaddondetailspage.png)

**Step-3: Launching the Kiali dashboard**

From the Overview tab, click the **KialiURL** link and use the **Kiali token**.

The **Kiali dashboard** launches in a new web page.

**Note**: KialiURL might be different in your environment.

![](/img/kiali-console.png)

**Note**: To take advantage of the Istio features, pods in the mesh must be running an Istio sidecar proxy. Injection of the proxy can be done either on a per-pod basis or at namespace level. To enable side car injection, see **<https://istio.io/latest/docs/setup/additional-setup/sidecar-injection/>**. For information about using Kiali, see the **[Kiali documentation](https://kiali.io/docs/)**.

**Step-4: Download scoped kubeconfig from Container platform page**

* From the Clusters tab, select the '**hpe**' Kubernetes cluster and click **Launch Service Console**. This will direct you to the container platform page.
* Click on Download **kubeconfig**.

**Note**: Launching HPE Ezmeral Runtime Enterprise from HPE GreenLake Central is configured through SAML SSO and adds a session token to the kubeconfig file. You will need to download the kubeconfig file again if you want to continue to access the cluster when the session token expires after an hour.

**Step-5: Deploying a sample Istio application**

This procedure follows the standard Istio documentation to deploy a sample application. To know more about Bookinfo Application, see **[Istio documentation](https://istio.io/latest/docs/examples/bookinfo/)**.

**Create the namespace and label for Istio sidecar proxy injection to deploy the application in bookinfo namespace**

```shellsession
$ kubectl create namespace bookinfo		
namespace/bookinfo created

$ kubectl label namespace bookinfo istio-injection=enabled
namespace/bookinfo labeled

$ kubectl get namespace bookinfo --show-labels
NAME       STATUS   AGE    LABELS
bookinfo   Active   105s   gl.hpe.com/namespaceid=10d70074-0c2b-4221-804e-1437ed1842ca,hpe.com/cluster=stub,hpe.com/namespacetype=Tenant,hpe.com/tenant=bookinfo,hpe.com/version=6.2.0,hpecp.hpe.com/hpecptenant=hpecp-tenant-106,istio-injection=enabled,kubernetes.io/metadata.name=bookinfo,serving.kubeflow.org/inferenceservice=enabled
```

**Deploy sample application by using the created namespace bookinfo**

Deploy the Bookinfo application using the YAML manifest file i.e. **services/istio/release-1.16/samples/bookinfo/bookinfo.yaml** from the Github repository **<https://github.com/cxteamtrials/caas-trials-content>**.

```shellsession
$ kubectl apply -f bookinfo.yaml -n bookinfo
service/details created
serviceaccount/bookinfo-details created
deployment.apps/details-v1 created
service/ratings created
serviceaccount/bookinfo-ratings created
deployment.apps/ratings-v1 created
service/reviews created
serviceaccount/bookinfo-reviews created
deployment.apps/reviews-v1 created
deployment.apps/reviews-v2 created
deployment.apps/reviews-v3 created
service/productpage created
serviceaccount/bookinfo-productpage created
deployment.apps/productpage-v1 created
```

**Confirm all pods and services are deployed successfully**

```shellsession
$ kubectl get pods,services -n bookinfo
NAME                             READY   STATUS    RESTARTS   AGE
details-v1-698b5d8c98-qglhw      2/2     Running   0          6m17s
productpage-v1-bf4b489d8-bkpdm   2/2     Running   0          6m17s
ratings-v1-5967f59c58-28kc5      2/2     Running   0          6m17s
reviews-v1-9c6bb6658-mw2df       2/2     Running   0          6m17s
reviews-v2-8454bb78d8-p4h9d      2/2     Running   0          6m17s
reviews-v3-6dc9897554-g7xqh      2/2     Running   0          6m17s

NAME          TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
details       ClusterIP   10.98.141.15     <none>        9080/TCP   14m
productpage   ClusterIP   10.104.123.90    <none>        9080/TCP   6m45s
ratings       ClusterIP   10.108.60.57     <none>        9080/TCP   6m46s
reviews       ClusterIP   10.106.208.181   <none>        9080/TCP   14m
```

**Configure the service to access the application outside of the cluster**

* Edit the deployed service **productpage**.
* Change service type from ClusterIP to **NodePort**.
* Add the label **hpecp.hpe.com/hpecp-internal-gateway=true**. The service will be automatically mapped/exposed to a **Container platform gateway host** with an assigned port.

```shellsession
$ kubectl describe svc productpage -n bookinfo
Name:                     productpage
Namespace:                bookinfo
Labels:                   app=productpage
                          hpecp.hpe.com/hpecp-internal-gateway=true
                          service=productpage
Annotations:              hpecp-internal-gateway/9080: epicgw.customer.hpe.net:10072
Selector:                 app=productpage
Type:                     NodePort
IP Family Policy:         SingleStack
IP Families:              IPv4
IP:                       10.104.123.90
IPs:                      10.104.123.90
Port:                     http  9080/TCP
TargetPort:               9080/TCP
NodePort:                 http  31766/TCP
Endpoints:                10.192.3.181:9080
Session Affinity:         None
External Traffic Policy:  Cluster
Events:
  Type    Reason  Age   From         Message
  ----    ------  ----  ----         -------
  Normal  HpeCp   21s   hpecp-agent  Created HPECP K8S service
```

**Confirm the application is accessible from outside the cluster**

Bookinfo application **productpage** can be accessed in the browser by typing the URL **http://epicgw.customer.hpe.net:10072**

Note : Above URL might be different in your environment. You can form the URL by referring annotations from the **productpage** service.

![](/img/sample-app.png)

![](/img/sample-app-page.png)

**Monitor the sample application using the Kiali dashboard**

Enter **bookinfo** into the field Filter by Namespace. The Kiali Overview screen displays the details about the namespace bookinfo. It shows that 4 applications are running in the **namespace bookinfo** with no inbound traffic.

![](/img/overview-kiali.png)

In the **Graph** tab from the left navigation menu, after selecting the **namespace bookinfo**, the screen shows an overview topology of the Bookinfo application.

![](/img/graph-kiali.png)

In the **Applications** tab from the left navigation menu, after selecting the **namespace bookinfo**, the screen shows application details of the Bookinfo application.

![](/img/application-kiali.png)

In the **Workloads** tab from the left navigation menu, after selecting the **namespace bookinfo**, the screen shows deployment details of the Bookinfo   application.

![](/img/workload.png)

In the **Services** tab from the left navigation menu, after selecting the **namespace bookinfo**, you can check all the services details of the Bookinfo application.

![](/img/services.png)

**HPE GreenLake for Private Cloud Enterprise: Containers: Demo Summary**

You can find the GitHub repository that hosts demo code **[here](https://github.com/cxteamtrials/caas-trials-content)**.

We hope that this blog post has provided you with enough information for you to get started deploying containerized application or a managed service on a Kubernetes-based container stack using the cluster add-on feature provided by HPE GreenLake for Private Cloud Enterprise: Containers, refer to the **[HPE Developer Community blog](https://developer.hpe.com/)**.