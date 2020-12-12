---
title: "How to Register a Grommet OSB Broker in a Kubernetes Service Catalog"
date: 2019-08-21T18:44:52.096Z
author: Pramod Sareddy 
tags: ["grommet","opensource"]
path: how-to-register-a-grommet-osb-broker-in-a-kubernetes-service-catalog
---
![registering a broker](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/registering-a-broker-1566920379874.png)

In my previous article, [Using Open Service Broker as a Quick and Easy Way to Offer Everything as-a-Service,](https://developer.hpe.com/blog/using-open-service-broker-as-a-quick-and-easy-way-to-offer-everything-as) we examined what a Open Service Broker (OSB) API is and how it can be used to expose the Grommet development environment as-a-Service. Now, I would like to show you how to register and consume services offered by the Grommet OSB Broker in a Kubernetes Service Catalog to provision, bind, unbind, and deprovision a Grommet Dev Instance. 

This tutorial will be helpful for developers in many companies who today deploy Kubernetes clusters to ensure scalability for their applications. Applications running inside Kubernetes clusters may need  access  to 3rd party services, like databases or additional storage, and you need to be able to provide that service to app developers as part of the Kubernetes Service Catalog. One way of exposing a service is to use OSB. Once you register your OSB inside the Kubernetes Service Catalog, you can see the service, and then you can provision and bind the service to your application. 

This tutorial assumes that you've installed a Service Catalog onto your Kubernetes cluster. If you haven't, please see the [installation instructions.](https://github.com/kubernetes-sigs/service-catalog/blob/master/docs/install.md) Optionally you may install the Service Catalog CLI, svcat. Examples for both svcat and kubectl are provided.

All commands shown assume that you're operating out of the root of this repository.

In the figure below, you can see the overall architecture setup of the Kubernetes Service Catalog running on premise interacting with Grommet OSB broker running in AWS cloud to provision, bind, and deprovision a Grommet Dev Instance in the cloud.


![picture1](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/picture1-1566414261415.png)

In this architecture, the Kubernetes Service Catalog establishes an association with the Grommet OSB broker by sending a GET request to the /v2/catalog endpoint, which then responds with a 200 OK and a body containing all the information about the services it offers. Kubernetes stores and exposes these services to consumers via the Kubernetes Service Catalog. Cloud operators will instantiate the service by sending a PUT request to the /v2/service_instances/:service_id end point. The broker will do the actual provisioning of the service instance. Let’s discuss each of these components individually.

## Kubernetes Internal Architecture

To start, I will briefly cover the basics of how Kubernetes works internally. There is an API server that listens to user requests. Users perform most actions by declaratively describing Kubernetes resources in yaml files that get written through to Etcd, shared key-value store. In my example here, a user is declaring some object Foo, which creates a record in the Etcd.


![picture2](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/picture2-1566414265789.png)

As you can see, we have a Foo Controller, which is watching the shared Etcd through the API Server for any changes in Foo objects. Now that we just created a new one, our Foo Controller sees the change and begins taking actions to implement this change of state.

![picture3](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/picture3-1566414269747.png)

This results in ithe Foo controller creating a new Foo object. Depending on what Foo is, this action could be doing something directly or it could be sending a command to another Kubernetes component. Nevertheless, the general principle remains the same. This particular example was for some object-type Foo, but there are many resources in Kubernetes and, correspondingly, many API servers and controllers.

![picture4](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/picture4-1566414273123.png)

## Kubernetes Service Catalog

A Kubernetes Service Catalog is an extension API that enables applications running in Kubernetes clusters to easily use externally managed software offerings, such as a datastore service offered by a cloud provider or a standalone VM, like a Grommet Dev Environment as-a-Service.

The service catalog provides a way to list, provision, and bind with externally managed services from service brokers without needing detailed knowledge about how those services are created or managed.

With that in mind, here is an overview of what the service catalog looks like. It’s a custom Kube API server and controller that maintains the state for five new resource types that correspond to their equivalents from the [OSB API.](https://www.openservicebrokerapi.org) The controller implements the client side of the OSB API, allowing it to query service brokers for their catalogs, and to manipulate them so it can provision and maintain services. It also makes use of a native Kubernetes resource, Secrets, to inject credentials for service bindings into running Pods, but more on that in a moment.

Everything I mentioned about the OSB architecture in my [previous blog,](https://developer.hpe.com/blog/using-open-service-broker-as-a-quick-and-easy-way-to-offer-everything-as) is contained in this interface between the controller and the service brokers. App developers don’t have to be aware of it, and they can continue to use Kubernetes the same as before, issuing normal CRUD commands through the API service.


![picture5](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/picture5-1566414276654.png)

Once again, this tutorial assumes that you've installed a Service Catalog onto your Kubernetes cluster. If you haven't, please see the [installation instructions.](https://github.com/kubernetes-sigs/service-catalog/blob/master/docs/install.md) Optionally, you may install the Service Catalog CLI, svcat. Examples for both svcat and kubectl are provided.

All commands in this post assume that you're operating out of the root of this repository.

* NOTE: For the purposes of this post, we'll be using Grommet OSB broker, a broker that we deployed in AWS cloud and one that is accessible at this [endpoint.](http://3.86.206.101:8099/)

## Step 1 – Deploy a broker
In the real world, the broker could be deployed within our cluster, next to our cluster in the same data center, out on the Internet, or anywhere in between. For the purpose of this post, we'll be using Grommet OSB broker, a broker that we deployed in AWS cloud. 

## Step 2 - Register Grommet Broker
In this second step, the, cluster operator creates a ClusterServiceBroker resource within the servicecatalog.k8.io group. This resource contains the URL and connection details necessary to access a service broker endpoint. The service catalog control manager triggers a call to the external service broker for a list of all available services. The service broker returns a list of available managed services and a list of service plans, which are cached locally as ClusterServiceClass and ClusterServicePlan resources respectively. A cluster operator can then get the list of available managed services and service plans using kubectl get clusterservicecalassess or clusterserviceplans commands.


![picture6](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/picture6-1566414280554.png)

Because we haven't created any resources in the service-catalog API server yet, querying the service catalog returns an empty list of resources:


```bash
$ svcat get brokers
  NAME   URL   STATUS
+------+-----+--------+

$ kubectl get clusterservicebrokers,clusterserviceclasses,serviceinstances,servicebindings
No resources found.
```

We'll register a broker server with the catalog by creating a new ClusterServiceBroker resource:


```bash
$ cat grommet-broker-clusterservicebroker.yaml
apiVersion: servicecatalog.k8s.io/v1beta1
kind: ClusterServiceBroker
metadata:
  name: grommet-broker
spec:
        url: http://3.86.206.101:8099
```


```bash
$ kubectl create -f grommet-broker-clusterservicebroker.yaml
clusterservicebroker.servicecatalog.k8s.io/grommet-broker created
```

When we create this ClusterServiceBroker resource, the service catalog controller responds by querying the broker server to see what services it offers and creates a ClusterServiceClass for each.

We can check the status of the broker by entering the following commands:


```bash
$ svcat describe broker grommet-broker
 Name:     grommet-broker
  Scope:    cluster
  URL:      http://3.86.206.101:8099
  Status:   Ready - Successfully fetched catalog entries from broker @ 2019-07-09 19:17:10 +0000 UTC

$ kubectl get clusterservicebrokers grommet-broker -o yaml
apiVersion: servicecatalog.k8s.io/v1beta1
kind: ClusterServiceBroker
metadata:
  creationTimestamp: "2019-07-09T19:17:10Z"
  finalizers:
  - kubernetes-incubator/service-catalog
  generation: 1
  name: grommet-broker
  resourceVersion: "8"
  selfLink: /apis/servicecatalog.k8s.io/v1beta1/clusterservicebrokers/grommet-broker
  uid: 266bed9b-a27e-11e9-9f3e-3aac54c90eba
spec:
  relistBehavior: Duration
  relistRequests: 0
  url: http://3.86.206.101:8099
status:
  conditions:
  - lastTransitionTime: "2019-07-09T19:17:10Z"
    message: Successfully fetched catalog entries from broker.
    reason: FetchedCatalog
    status: "True"
    type: Ready
  lastCatalogRetrievalTime: "2019-07-09T19:17:10Z"
  reconciledGeneration: 1
```
Notice that the status reflects that the broker's catalog of service offerings has been successfully added to our cluster's service catalog.

## Step 3 – Viewing ClusterServiceClasses and ClusterServicePlans

The controller has already created a ClusterServiceClass for each service that the grommet broker provides. We can view the ClusterServiceClass resources available:

```bash
$ svcat get classes
   NAME     NAMESPACE     DESCRIPTION
+---------+-----------+-----------------+
  grommet               grommet service

$ kubectl get clusterserviceclasses
NAME                                   EXTERNAL-NAME   BROKER           AGE
97ca7e25-8f63-44a7-99d1-a75729ebfb5e   grommet         grommet-broker   4m30s

```
* NOTE: The above kubectl command uses a custom set of columns. The NAME field is the Kubernetes name of the ClusterServiceClass and the EXTERNAL NAME field is the human-readable name for the service that the broker returns.

```bash
$ svcat describe class grommet
  Name:              grommet
  Scope:             cluster
  Description:       grommet service
  Kubernetes Name:   97ca7e25-8f63-44a7-99d1-a75729ebfb5e
  Status:            Active
  Tags:              ui, grommet
  Broker:            grommet-broker

Plans:
       NAME         DESCRIPTION
+----------------+----------------+
  grommet-plan-1   t2.micro instance with NodeJS
  grommet-plan-2   t2.small instance with NodeJS

$ kubectl get clusterserviceclasses 97ca7e25-8f63-44a7-99d1-a75729ebfb5e -o yaml
apiVersion: servicecatalog.k8s.io/v1beta1
kind: ClusterServiceClass
metadata:
  creationTimestamp: "2019-07-09T19:17:10Z"
  name: 97ca7e25-8f63-44a7-99d1-a75729ebfb5e
  ownerReferences:
  - apiVersion: servicecatalog.k8s.io/v1beta1
    blockOwnerDeletion: false
    controller: true
    kind: ClusterServiceBroker
    name: grommet-broker
    uid: 266bed9b-a27e-11e9-9f3e-3aac54c90eba
  resourceVersion: "5"
  selfLink: /apis/servicecatalog.k8s.io/v1beta1/clusterserviceclasses/97ca7e25-8f63-44a7-99d1-a75729ebfb5e
  uid: 268d3344-a27e-11e9-9f3e-3aac54c90eba
spec:
  bindable: true
  bindingRetrievable: false
  clusterServiceBrokerName: grommet-broker
  description: grommet service
  externalID: 97ca7e25-8f63-44a7-99d1-a75729ebfb5e
  externalMetadata:
    displayName: The Grommet Broker
    listing:
      blurb: Add a blurb here
      imageUrl: http://example.com/cat.gif
      longDescription: UI component library, in a galaxy far far away...
    provider:
      name: The grommet
  externalName: grommet
  planUpdatable: true
  requires:
  - route_forwarding
  tags:
  - ui
  - grommet
status:
  removedFromBrokerCatalog: false
```
Additionally, the controller created a ClusterServicePlan for each of the plans for the broker's services. We can view the ClusterServicePlan resources available in the cluster:

```bash
$ svcat get plans
       NAME        NAMESPACE    CLASS     DESCRIPTION
+----------------+-----------+---------+----------------+
  grommet-plan-1               grommet   t2.micro instance with NodeJS
  grommet-plan-2               grommet   t2.small instance with NodeJS

$ kubectl get clusterserviceplans
NAME                                   EXTERNAL-NAME    BROKER           CLASS                                  AGE
2a44ed0e-2c09-4be6-8a81-761ddba2f733   grommet-plan-1   grommet-broker   97ca7e25-8f63-44a7-99d1-a75729ebfb5e   7m2s
e3c4f66b-b7ae-4f64-b5a3-51c910b19ac0   grommet-plan-2   grommet-broker   97ca7e25-8f63-44a7-99d1-a75729ebfb5e   7m2s

```
You can view the details of a ClusterServicePlan with this command:

```bash
$ svcat describe plan grommet/default

$ kubectl get clusterserviceplans 86064792-7ea2-467b-af93-ac9694d96d52 -o yaml
apiVersion: servicecatalog.k8s.io/v1beta1
kind: ClusterServicePlan
metadata:
  creationTimestamp: "2019-07-09T19:17:10Z"
  name: 2a44ed0e-2c09-4be6-8a81-761ddba2f733
  ownerReferences:
  - apiVersion: servicecatalog.k8s.io/v1beta1
    blockOwnerDeletion: false
    controller: true
    kind: ClusterServiceBroker
    name: grommet-broker
    uid: 266bed9b-a27e-11e9-9f3e-3aac54c90eba
  resourceVersion: "6"
  selfLink: /apis/servicecatalog.k8s.io/v1beta1/clusterserviceplans/2a44ed0e-2c09-4be6-8a81-761ddba2f733
  uid: 268e25b5-a27e-11e9-9f3e-3aac54c90eba
spec:
  clusterServiceBrokerName: grommet-broker
  clusterServiceClassRef:
    name: 97ca7e25-8f63-44a7-99d1-a75729ebfb5e

```
## Step 4 – Creating a New ServiceInstance

Here, the cluster operator can instantiate the provisioning of a new instance by creating a ServiceInstance resource within the servicecatalog.k8.io group. When the ServiceInstance resource is created, the service catalog control manager initiates a call to the external service broker to provision an instance of the service.

The service broker creates a new instance of the managed service and returns an HTTP response. A cluster operator can then check the status of the instance to see if it is ready.


![picture7](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/picture7-1566414285460.png)

Now that a ClusterServiceClass named grommet exists within our cluster's service catalog, we can create a ServiceInstance that points to it.

Unlike ClusterServiceBroker and ClusterServiceClass resources, ServiceInstance resources must be namespaced. Create a namespace with the following command:


```bash
$ kubectl create namespace grommet-ns
namespace/grommet-ns created
```
Then, create the ServiceInstance:

```bash
$ cat grommet-broker-instance.yaml
apiVersion: servicecatalog.k8s.io/v1beta1
kind: ServiceInstance
metadata:
  name: grommet-broker-instance
  namespace: grommet-ns
spec:
  clusterServiceClassExternalName: grommet
  clusterServicePlanExternalName: grommet-plan-1
  parameters:
    region: "us-east-1"
    Access_Key_ID: "XXXXXXXXXXXXXX"
    Secret_Access_Key: "XXXXXXXXXXX"
    Image_ID: "ami-05f07ee3c7aa"
    Flavor: "t2.small"
    NodeJS_version: "12.1.0"

$ kubectl create -f grommet-broker-instance.yaml –n grommet-ns
serviceinstance.servicecatalog.k8s.io/grommet-broker-instance created
```

After the ServiceInstance is created, the service catalog controller will communicate with the appropriate broker server to initiate provisioning. Check the status of that process:


```bash
$ svcat describe instance -n grommet-ns grommet-broker-instance
  Name:           grommet-broker-instance
  Namespace:      grommet-ns
  Status:         Ready - The instance was provisioned successfully @ 2019-07-09 23:15:56 +0000 UTC
  DashboardURL:   http://:3000
  Class:          grommet
  Plan:           grommet-plan-1

Parameters:
  Access_Key_ID: XXXXXXXXX
  Flavor: t2.small
  Image_ID: ami-05f07ee3c7aa
  NodeJS_version: 12.1.0
  Secret_Access_Key: XXXXXXXXXXX
  region: us-east-1

Bindings:
No bindings defined

$ kubectl get serviceinstances -n grommet-ns grommet-broker-instance -o yaml
apiVersion: servicecatalog.k8s.io/v1beta1
kind: ServiceInstance
metadata:
  creationTimestamp: "2019-07-09T22:40:41Z"
  finalizers:
  - kubernetes-incubator/service-catalog
  generation: 1
  name: grommet-broker-instance
  namespace: grommet-ns
  resourceVersion: "83"
  selfLink: /apis/servicecatalog.k8s.io/v1beta1/namespaces/grommet-ns/serviceinstances/grommet-broker-instance
  uid: 9479a488-a29a-11e9-9f3e-3aac54c90eba
spec:
  clusterServiceClassExternalName: grommet
  clusterServiceClassRef:
    name: 97ca7e25-8f63-44a7-99d1-a75729ebfb5e
  clusterServicePlanExternalName: grommet-plan-1
  clusterServicePlanRef:
    name: 2a44ed0e-2c09-4be6-8a81-761ddba2f733
  externalID: 9479a40b-a29a-11e9-9f3e-3aac54c90eba
  parameters:
    Access_Key_ID: XXXXXXXXXX
    Flavor: t2.small
    Image_ID: ami-05f07ee3c7aaadaaa
    NodeJS_version: 12.1.0
    Secret_Access_Key: XXXXXXXXXX
    region: us-east-1
  updateRequests: 0
  userInfo:
    groups:
    - system:masters
    - system:authenticated
    uid: ""
    username: kubernetes-admin
status:
  asyncOpInProgress: false
  conditions:
  - lastTransitionTime: "2019-07-09T23:15:56Z"
    message: The instance was provisioned successfully
    reason: ProvisionedSuccessfully
    status: "True"
    type: Ready
  dashboardURL: http://:3000
  deprovisionStatus: Required
  externalProperties:
    clusterServicePlanExternalID: 2a44ed0e-2c09-4be6-8a81-761ddba2f733
    clusterServicePlanExternalName: grommet-plan-1
    parameterChecksum: 2ffa186d88170935135d51e53d4048f2950386d5e3a54e08e811bac054f78779
    parameters:
      Access_Key_ID: XXXXXXXXXX
      Flavor: t2.small
      Image_ID: ami-05f07ee3c7aaadaaa
      NodeJS_version: 12.1.0
      Secret_Access_Key: XXXXXXXXXX
      region: us-east-1
    userInfo:
      groups:
      - system:masters
      - system:authenticated
      uid: ""
      username: kubernetes-admin
  observedGeneration: 1
  orphanMitigationInProgress: false
  provisionStatus: Provisioned
  reconciledGeneration: 1
```
## Step 5 – Requesting a ServiceBinding to use the ServiceInstance

After a new instance has been provisioned, a cluster operator must bind to the managed service to get the connection credentials and service account details necessary for the application to use the service or to access the service. This is done by creating a ServiceBinding resource.

After the ServiceBinding is created, the service catalog makes a call to the external service broker requesting the information necessary to bind with the service instance.

The service broker enables the application permissions/roles for the appropriate service account.

The service broker returns the information necessary to connect and access the managed service instance. This is provider and service-specific so the information returned may differ between service providers and their managed services. In our case, the Grommet broker returns the Grommet Dev Instance access credentials.


![picture8](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/picture8-1566414289475.png)

Now that our ServiceInstance has been created, we can bind to it. Create a ServiceBinding resource:


```bash
$ kubectl create -f grommet-broker-binding.yaml
servicebinding.servicecatalog.k8s.io/grommet-broker-binding created
```

After the ServiceBinding resource is created, the service catalog controller will communicate with the appropriate broker server to initiate binding. Generally, this will cause the broker server to create and issue credentials that the service catalog controller will insert into a Kubernetes Secret. We can check the status of this process like so:


```bash
$ svcat describe binding -n grommet-ns grommet-broker-binding
  Name:        grommet-broker-binding
  Namespace:   grommet-ns
  Status:      Ready - Injected bind result @ 2019-07-09 23:37:18 +0000 UTC
  Secret:      grommet-broker-binding
  Instance:    grommet-broker-instance

Parameters:
  No parameters defined

Secret Data:
  uri        25 bytes
  username   6 bytes

$ kubectl get servicebindings -n grommet-ns grommet-broker-binding -o yaml
apiVersion: servicecatalog.k8s.io/v1beta1
kind: ServiceBinding
metadata:
  creationTimestamp: "2019-07-09T23:37:17Z"
  finalizers:
  - kubernetes-incubator/service-catalog
  generation: 1
  name: grommet-broker-binding
  namespace: grommet-ns
  resourceVersion: "90"
  selfLink: /apis/servicecatalog.k8s.io/v1beta1/namespaces/grommet-ns/servicebindings/grommet-broker-binding
  uid: 7cf4999a-a2a2-11e9-9f3e-3aac54c90eba
spec:
  externalID: 7cf498f3-a2a2-11e9-9f3e-3aac54c90eba
  instanceRef:
    name: grommet-broker-instance
  secretName: grommet-broker-binding
  userInfo:
    groups:
    - system:masters
    - system:authenticated
    uid: ""
    username: kubernetes-admin
status:
  asyncOpInProgress: false
  conditions:
  - lastTransitionTime: "2019-07-09T23:37:18Z"
    message: Injected bind result
    reason: InjectedBindResult
    status: "True"
    type: Ready
  externalProperties:
    userInfo:
      groups:
      - system:masters
      - system:authenticated
      uid: ""
      username: kubernetes-admin
  orphanMitigationInProgress: false
  reconciledGeneration: 1
  unbindStatus: Required
```

Notice that the status has a Ready condition set. This means our binding is ready to use! If we look at the Secrets in our grommet-ns namespace, we should see a new one:


```bash
$ kubectl get secrets -n grommet-ns
NAME                     TYPE                                  DATA   AGE
default-token-hjm6z      kubernetes.io/service-account-token   3      139m
grommet-broker-binding   Opaque                                2      3m37s
```
* Notice that a new Secret named grommet-broker-binding has been created.

## Step 6 – Delete the ServiceBinding
Now, let's unbind the instance:

```bash
$ svcat unbind -n grommet-ns grommet-broker-instance
deleted grommet-broker-binding
```
After the deletion is complete, we should see that the Secret is gone:

```bash
$ kubectl get secrets -n grommet-ns
NAME                  TYPE                                  DATA   AGE
default-token-hjm6z   kubernetes.io/service-account-token   3      154m
```
## Step 7 – Deleting the ServiceInstance
There may be times you want to delete a ServiceInstance. In that case you can deprovision it. You can do so using the following steps:

```bash
$ svcat deprovision -n grommet-ns grommet-broker-instance
deleted grommet-broker-instance
```

## Step 8 – Deleting the ClusterServiceBroker
Next, remove the ClusterServiceBroker resource. This tells the service catalog to remove the broker's services from the catalog. Do so with this command:

```bash
$ kubectl delete clusterservicebrokers grommet-broker
clusterservicebroker.servicecatalog.k8s.io "grommet-broker" deleted
```
You should now see that all the ClusterServiceClass resources that came from that broker have also been deleted:


```bash
$ svcat get classes
  NAME   NAMESPACE   DESCRIPTION
+------+-----------+-------------+

$ kubectl get clusterserviceclasses
No resources found.
```

## Next Steps

There are many ways to consume the services offered by an OSB broker such as the Grommet OSB broker. Using a Kubernetes Service Catalog is one option. In our next article, you’ll learn how to download a standalone Open Service broker client application built on Grommet, and how to register an OSB inside that application. You can also use it to test an OSB you already have. Keep an eye out on the [HPE DEV site](https://developer.hpe.com/blog) for more articles on OSB.
