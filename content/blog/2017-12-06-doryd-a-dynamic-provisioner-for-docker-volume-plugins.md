---
title: Doryd&#58; A Dynamic Provisioner for Docker Volume plugins
date: 2017-12-06T00:39:08.306Z
author: Michael Mattsson 
tags: ["hpe-nimble-storage","dory","doryd","kubernetes","containers","docker"]
path: doryd-a-dynamic-provisioner-for-docker-volume-plugins
---
Many vendors have invested quite a lot of effort into building robust Docker Volume plugins, including HPE Nimble Storage and HPE 3PAR. Docker and Kubernetes (K8s) share the same fundamental principle of being able to bind mount a host filesystem inside a container through the `mnt` namespace. Any other similarity pretty much stops there as far as compatibility goes. K8s has a multitude of Persistent Volume (PV) plugins mainly focused on IaaS provider frameworks and native filesystems.

The FlexVolume plugin is part of K8s and allows vendors such as HPE to provide out-of-tree FlexVolume drivers. What is important to understand here is that the FlexVolume plugin only supports static provisioning. A K8s cluster administrator must create PVs manually for K8s users to create Persistent Volume Claims (PVC) against. This might seem a bit tedious but is still magnitudes more gracious than creating a volume on the backend array manually and present it to the cluster (don't forget to those IQNs or WWNs to the target when you expand your cluster!) if you would use the iSCSI or FC plugin for K8s. Although, I would argue this is good enough if you only have a handful of applications that require PVs on a fairly static cluster without any need for advanced data services or deny users to dynamically create PVs based on their needs.

Storage Classes (SC) allows dynamic provisioning of PVs based on PVCs created by a user. This feature has been around since K8s 1.2 and was promoted to beta in 1.4. SCs allows a cluster administrator to define named classes with certain attributes, such as which provisioner to use, default PV plugin parameters and so on. SCs enables policy-based storage management which essentially abstracts storage minutia for the user. This blog post will discuss this concept in great detail.

Our story around Dory: The FlexVolume driver that speaks whale, would not be complete without a dynamic provisioner as cluster administrators have better things to do than provision PVs to their users. A provisioner is a very simple daemon that listens for PVCs and satisfies those claims based on the defined SCs.

The rest of this blog post walks through the steps on how to get started with Dory and Doryd. Just replace `nimble` in the examples below with your particular Docker Volume plugin to get started. 

# Dory: A FlexVolume Recap
Dory is an [open source project available on GitHub](https://github.com/hpe-storage/dory). The latest instructions on how to build and install Dory will always be available in the [README.md](https://github.com/hpe-storage/dory/blob/master/docs/dory/README.md), steps vary between distributions. I've covered this [in the past](https://community.hpe.com/t5/HPE-Nimble-Storage-Tech-Blog/Dory-A-FlexVolume-Driver-that-speaks-Whale/ba-p/6986638) but it did not include Doryd and the naming schemes required for Doryd.

I currently have an Ubuntu 16.04.3 machine in front of me with K8s 1.8.4 and the latest Nimble Linux Toolkit (NLT) installed but I choose to install the binary instead. NLT contains the HPE Nimble Storage Docker Volume plugin and the rest of the guide assumes all hosts have the Docker Volume plugin installed and working.

```
sudo mkdir -p /usr/libexec/kubernetes/kubelet-plugins/volume/exec/dev.hpe.com~nimble
sudo curl -sLo /usr/libexec/kubernetes/kubelet-plugins/volume/exec/dev.hpe.com~nimble/nimble \
https://dl.bintray.com/hpe-storage/dory/dory-master
sudo chmod 755 /usr/libexec/kubernetes/kubelet-plugins/volume/exec/dev.hpe.com~nimble/nimble
```

**Note:** What is being made available to the kubelet is a FlexVolume driver referenced as `dev.hpe.com/nimble`. Changing `dev.hpe.com` to something else will break the stock provisioner we're going to use in the examples below. 

In the same directory where you placed the `dory` binary, in my case `dev.hpe.com~nimble`, you need to copy `dory.json` file from the Dory repository to `dev.hpe.com~nimble/nimble.json`. 

```
sudo curl -sLo /usr/libexec/kubernetes/kubelet-plugins/volume/exec/dev.hpe.com~nimble/nimble.json \
https://raw.githubusercontent.com/hpe-storage/dory/master/src/nimblestorage/cmd/dory/dory.json
```

The key here is to identify where the socket file to your Docker Volume plugin accepts API calls. Since this can vary between plugins and distributions as well, please `curl` an API call to the socket file you intend to use. For example, in my case:

```
sudo curl -XPOST --unix-socket /run/docker/plugins/nimble.sock http:/Plugin.Activate
{"Implements":["VolumeDriver"]}
```

**Note:** `curl --unix-socket` is a fairly new thing for `curl` and could be missing from your distribution.

Adjust your `dory.json` accordingly. Full documentation for each key is available in [the Dory repo](https://github.com/hpe-storage/dory/blob/master/docs/dory/README.md#building). In most cases, only `dockerVolumePluginSocketPath` needs to be changed.

```JSON
{
    "logFilePath": "/var/log/dory.log",
    "logDebug": false,
    "stripK8sFromOptions": true,
    "dockerVolumePluginSocketPath": "/run/docker/plugins/nimble.sock",
    "createVolumes": true,
    "enable1.6": false,
    "listOfStorageResourceOptions": [ "size", "sizeInGiB" ],
    "factorForConversion": 1073741824
}
```

**Note:** Neither Dory or Doryd cares if Docker is installed on the host or not. As long as there is a daemon responding to Docker Volume API calls, you're good. In other words, Dory and Doryd should work just fine with other container engines compatible with K8s, such as `rkt` or `cri-o`.

Another gotcha worth mentioning, if you intend to only create PVs against the FlexVolume driver. PVs are not created until a pod or deployment requests an attachment of the PV. In other words, just creating the PV and PVC won't create the Docker Volume itself.

**Important:** If you're using K8s < 1.8, The kubelet needs to be restarted to pick up the installed FlexVolume driver. This step may be different depending on how you run your kubelet, on Ubuntu 16.04 where the cluster has been installed with `kubeadm`, simply:

```
sudo systemctl restart kubelet
```

Watch `/var/log/dory.log` for initialization:

```
tail /var/log/dory.log
Info : 2017/12/02 20:50:31 dory.go:55: [5202] entry  : Driver=nimble Version=1.1.0-d95ad289 Socket=/run/docker/plugins/nimble.sock Overridden=true
Info : 2017/12/02 20:50:31 dory.go:58: [5202] request: init []
Info : 2017/12/02 20:50:31 dory.go:68: [5202] reply  : init []: {"status":"Success","capabilities":{"attach":false}}
```

We're now ready to move on to Doryd!

# Kubekuddle this!
Conveniently enough, `doryd` runs as a DaemonSet (DS), a DS ensures the provisioner runs (and keep running) on all the cluster nodes. You're given the option to build the `doryd` image and specify your own DS specification, however, the following specification is known to work under most circumstances:

```
kubectl apply -f https://raw.githubusercontent.com/hpe-storage/dory/985f0313440cd2181c27e5d94b31f9fe75714c3f/examples/ds-doryd.yaml
```

You may inspect the DS on the cluster by running:

```
kubectl describe ds/doryd
```

You'll see something similar to this:

```
Name:           doryd
Selector:       daemon=dory-daemon
Node-Selector:  <none>
Labels:         daemon=dory-daemon
Annotations:    kubectl.kubernetes.io/last-applied-configuration={"apiVersion":"extensions/v1beta1","kind":"DaemonSet","metadata":{"annotations":{},"name":"doryd","namespace":"default"},"spec":{"template":{"metadata"...
Desired Number of Nodes Scheduled: 1
Current Number of Nodes Scheduled: 1
Number of Nodes Scheduled with Up-to-date Pods: 1
Number of Nodes Scheduled with Available Pods: 1
Number of Nodes Misscheduled: 0
Pods Status:  1 Running / 0 Waiting / 0 Succeeded / 0 Failed
Pod Template:
  Labels:  daemon=dory-daemon
  Containers:
   dory:
    Image:        nimblestorage/doryd
    Port:         <none>
    Environment:  <none>
    Mounts:
      /etc/kubernetes from k8s (rw)
      /run/docker/plugins/ from dockersocket (rw)
      /usr/libexec/kubernetes/kubelet-plugins/volume/exec from flexvolumedriver (rw)
  Volumes:
   k8s:
    Type:  HostPath (bare host directory volume)
    Path:  /etc/kubernetes/
   flexvolumedriver:
    Type:  HostPath (bare host directory volume)
    Path:  /usr/libexec/kubernetes/kubelet-plugins/volume/exec
   dockersocket:
    Type:  HostPath (bare host directory volume)
    Path:  /run/docker/plugins/
Events:
  Type    Reason            Age   From        Message
  ----    ------            ----  ----        -------
  Normal  SuccessfulCreate  1m    daemon-set  Created pod: doryd-6m52b
```

That's it! We're ready to create some Storage Classes!

# Defining and consuming Storage Classes 
Specifications for SCs are defined by the cluster admin. Parameters that may be specific for your particular environment is the `provisioner` in the class. The particular parameters you want to be passed to down the underlying Docker Volume plugin has its own block as well. HPE Nimble Storage, in the below example, have a ton of different parameters but let's keep it lean and simple for these particular examples. 

A popular pattern throughout the history of storage has been the notion of categorizing storage into gold, silver and bronze "tiers" where each tier has certain performance, reliability or availability characteristics attached to each tier. At this time, HPE Nimble Storage goes from fast to faster, the reliability and availability is the same across the portfolio and we can't use this traditional tier paradigm. Instead, let's optimize each class for a certain workload and capacity. SCs named "transactionaldb", "unstructuredfile" and "securearchive" would be more descriptive examples.

HPE Nimble Storage uses Predictive Analytics to look across the install base to help optimize Performance Policies, such as block size, compression, caching and quota behavior. There's also the concept of Protection Templates where a storage administrator may define snapshot schedules, retention and replication to either another HPE Nimble Storage array or to the public cloud (Amazon AWS/Azure) via [HPE Cloud Volumes](https://www.hpe.com/us/en/storage/cloud-volumes.html).

The below YAML files are available in the [container-examples repository](https://github.com/NimbleStorage/container-examples/tree/master/dory/doryd-intro) on GitHub.

## transactionaldb
An example SC optimized for a transactional workload on an all-flash pool where we would attach a stock Protection Template.

```JSON
---
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
 name: transactionaldb
provisioner: dev.hpe.com/nimble
parameters:
  description: "Volume provisioned by doryd from transactionaldb StorageClass"
  perfPolicy: "SQL Server"
  protectionTemplate: "Retain-48Hourly-30Daily-52Weekly"
```

Create the SC with:

```
kubectl create -f https://raw.githubusercontent.com/NimbleStorage/container-examples/master/dory/doryd-intro/sc-transactionaldb.yml
```

This SC may then be referenced as such:

```JSON
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mariadb-claim
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 16Gi
  storageClassName: transactionaldb
```

Let's create the PVC and walk through what we can expect:

```
kubectl create -f https://raw.githubusercontent.com/NimbleStorage/container-examples/master/dory/doryd-intro/pvc-example.yml
```

A subtle difference between using SCs and the FlexVolume driver directly, is that Docker Volumes actually gets created upon creating the PVC. Example inspection:

```
$ kubectl get pvc/example-claim 
NAME            STATUS    VOLUME                                                 CAPACITY   ACCESS MODES   STORAGECLASS      AGE
example-claim   Bound     transactionaldb-8db1a469-d7f3-11e7-8f86-000c291bed2c   16Gi       RWO            transactionaldb   9m
$ kubectl get pv/transactionaldb-8db1a469-d7f3-11e7-8f86-000c291bed2c 
NAME                                                   CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS    CLAIM                   STORAGECLASS      REASON    AGE
transactionaldb-8db1a469-d7f3-11e7-8f86-000c291bed2c   16Gi       RWO            Delete           Bound     default/example-claim   transactionaldb             10m
$ docker volume inspect transactionaldb-8db1a469-d7f3-11e7-8f86-000c291bed2c --format '{{.Driver }} {{ .Name }}'
nimble transactionaldb-8db1a469-d7f3-11e7-8f86-000c291bed2c
```

That particular PVC could then be referenced from a pod or deployment to have the volume dynamically attached upon request. A complete example that creates a MariaDB deployment with a `transactionaldb` SC is available in the example repo. For completeness:

```
kubectl create -f https://raw.githubusercontent.com/NimbleStorage/container-examples/master/dory/doryd-intro/mariadb.yml
```

The below examples require your array to have certain resources setup and pre-configured and but discussed in the context of Storage Classes.

## unstructuredfile
Optimizing for a traditional file/web server dishing out fairly static content, with another stock Protection Template on a hybrid flash pool named `hybridflash`.

```JSON
---
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
 name: unstructuredfile
provisioner: dev.hpe.com/nimble
parameters:
  description: "Volume provisioned by doryd from unstructuredfile StorageClass"
  perfPolicy: "Windows File Server"
  protectionTemplate: "Retain-30Daily"
  pool: hybridflash
```

## securearchive
For PVs requiring a secure destination for archival data, you could potentially have an array in the group that has more stringent security measures and setup for long-term storage and protection. The below example would provision PVs in a performance restricted folder (a HPE Nimble Storage concept of collectively restricting bandwidth, IOPS and capacity to a group of volumes). A custom Performance Policy would deny caching of volumesand set a block size of 32KiB. Volumes are also encrypted at rest.

```JSON
---
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
 name: securearchive
provisioner: dev.hpe.com/nimble
parameters:
  description: "Volume provisioned by doryd from securearchive StorageClass"
  perfPolicy: "Archive"
  protectionTemplate: "Retain-90Daily-130Biweekly"
  encryption: "true"
  folder: "ElephantStorage"
```

# Advanced use cases for HPE Nimble Storage
One of the most useful features offered by the HPE Nimble Storage Docker Volume plugin is to create Zero-Copy Clones and Ephemeral Clones from any given snapshot or the current representation of the data in the volume. While this is something we're exploring with customers and prospects, I just want to give a short glimpse of how powerful these interfaces are.

## Zero-Copy Clone from Production
It's not too uncommon for developers wanting a sandbox copy of the latest production database to develop against and refresh at will. I refrain from using the term "[copy data management](http://searchstorage.techtarget.com/definition/copy-data-management-CDM)" as it means a lot of different things depending on your background but it's essentially exactly what is if you don't care about the anonymization (which you can do for yourself or some databases has built in with RBAC).

Assuming there is a production pod spawned that is actively using `transactionaldb-26063d7f-d7f2-11e7-8f86-000c291bed2c`. The cluster administrator would then create an SC along these lines:

```JSON
---
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
 name: from-production
provisioner: dev.hpe.com/nimble
parameters:
  description: "Clone from production database."
  cloneOf: "transactionaldb-26063d7f-d7f2-11e7-8f86-000c291bed2c"
  snapshot: "nightly-locktables"
```

The developer may then create/delete PVCs against that particular SC to refresh his data from the `nightly-locktables` snapshot.

```JSON
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: clone
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 0Gi
  storageClassName: from-production
```

The volume being created, could be inspected as such:

```
$ docker volume inspect from-production-dc10ebf3-d7f8-11e7-8f86-000c291bed2c --format '{{ .Status.Parent }} {{ .Status.ParentSnapshot }}'
transactionaldb-26063d7f-d7f2-11e7-8f86-000c291bed2c.kubernetes nightly-locktables
```

**Note:** The keys used in the custom output filter above are HPE Nimble Storage specific.

Assuming that there is particular column that needs to be scrambled before a developer gain access to it, how would you work around that? The cluster administrator would create a FlexVolume PV (no SC) based on the parameters above, run a batch pod that scrambled the column and later created a SC based on that processed cloned. It's really that simple!

## Ephemeral Clones for ETL and CI/CD pipelines
In the case where a temporary view is needed of a particular PV, be it for ETL (Extract, Transform, Load) or CI/CD (Continuous Integration/Continuous Deployment/Delivery) pipelines it becomes extremely powerful to create ephemeral representations of PVs. Think a container that has terabytes of data in it ready for processing without having to ship the data in a container image.

This SC will recreate the underlying Docker Volume for each attachment:

```JSON
---
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
 name: ephemeral
provisioner: dev.hpe.com/nimble
parameters:
  description: "Instant Ephemeral Clone from production database."
  cloneOf: "transactionaldb-26063d7f-d7f2-11e7-8f86-000c291bed2c"
  createSnapshot: "true"
  destroyOnDetach: "true"
```

**Note**: PVs and PVCs will remain intact and does not need to be manually deleted. Just reschedule the pod (or delete/create) and the data will be refreshed from the source. This differs from the developer use case in the sense that a developer might need to redeploy against the dataset he modified himself and not necessarily re-create the entire stack upon re-deploy. Also, `detroyOnDetach` will destroy the dependent snapshot and will keep the production volume clean from residual snapshots that eventually will reference deleted data from the parent volume. 

This is just the tip of the iceberg. If you have a lot of data that need to be represented in different stages for your containers, HPE has the solution!

# Start today!
HPE is working feverishly to release an officially supported product of Dory and Doryd exclusively for HPE Nimble Storage and HPE 3PAR arrays and go through the hoops of certifying the productized version against K8s and Red Hat OpenShift (a popular Enterprise K8s PaaS). Nothing prevents anyone to use the bits built from the Dory repository with any other vendor's Docker Volume plugin, it was the original intent, to translate the Docker Volume API into something K8s may consume. Please submit any issues you may find through GitHub and we'll get it straighten out. Always make sure to check for [tested Docker Volume plugins](https://github.com/hpe-storage/dory/blob/master/docs/plugins/README.md) and please submit pull requests against that page to help us keep track of what works!

[HPE DEV](https://developer.hpe.com) is a developer community that is launching to foster HPE related open source software, projects and integrations with contributions not only from HPE but we invite anyone who wants to collaborate on our projects. It's still early days and we just about launched the portal which serves as an umbrella across GitHub repos, Puppet Forge, Ansible Galaxy and of course this blog. 

We also have a Slack channel that is open to the public, please register [here](https://www.labs.hpe.com/slack) and join the conversation. I'm `michaelm` and you'll find me in #NimbleStorage #Kubernetes and #Docker. KubeCon is just around the corner and don't be shy to stop by the HPE DEV booth to have a chat about [Dory](https://github.com/hpe-storage/dory), [HPE OneSphere](https://www.hpe.com/us/en/solutions/cloud/hybrid-it-management.html) or [HPE DEV](https://developer.hpe.com) itself (there will be schwag!).