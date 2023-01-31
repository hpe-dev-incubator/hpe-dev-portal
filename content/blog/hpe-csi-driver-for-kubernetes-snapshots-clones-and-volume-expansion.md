---
title: "HPE CSI Driver for Kubernetes: Snapshots, Clones and Volume Expansion"
date: 2020-03-19T03:36:56.909Z
featuredBlog: false
priority: null
author: Michael Mattsson
authorimage: /img/blogs/Avatar4.svg
thumbnailimage: null
tags:
  - hpe-nimble-storage
  - hpe-greenlake-for-private-cloud-enterprise
  - hpe-greenlake-for-private-cloud-enterprise-containers
  - developer
  - containers-service
  - hpe-greenlake
---
The Container Storage Interface (CSI) introduces enterprise data management, such as volume snapshots and volume clones as native Kubernetes objects. In Kubernetes 1.17, these interfaces have matured to a beta state. Recently, Hewlett Packard Enterprise (HPE) [released version 1.1.0](https://community.hpe.com/t5/HPE-Storage-Tech-Insiders/HPE-CSI-Driver-for-Kubernetes-1-1-0-Generally-Available/ba-p/7082995) of the HPE CSI Driver for Kubernetes with full support for these features. Let’s walk through how a Kubernetes user can take advantage of these constructs to become more agile by deploying, testing and running stateful applications on Kubernetes.

# Deploy the CSI driver with Helm
In this tutorial, upstream Kubernetes 1.17.4 is being used along with Helm 3. Let’s add in the HPE storage container orchestrator deployments Helm repository.

```bash
helm repo add hpe-storage https://hpe-storage.github.io/co-deployments/
"hpe-storage" has been added to your repositories
```

Before installing the Helm chart, a values file needs to be created to instruct the driver on how to find and authenticate to the backend storage system. For this exercise, the `StorageClass` that will be installed is also marked as the default `StorageClass`.

```bash
# Contents of a file named values.yaml
secret:
  backend: 192.168.1.1
  username: admin
  password: admin
storageClass:
  defaultClass: true
```

Install the CSI driver into the "kube-system" namespace.

```bash
helm install hpe-csi-driver hpe-storage/hpe-csi-driver --version 1.1.0 --namespace kube-system -f values.yaml
NAME: hpe-csi-driver
LAST DEPLOYED: Tue Mar 17 09:21:12 2020
NAMESPACE: kube-system
STATUS: deployed
REVISION: 1
TEST SUITE: None
```

The required components should come online fairly quickly. The following `kubectl` command may be used to monitor the driver workloads.

```bash
kubectl get pods --all-namespaces -l 'app in (nimble-csp, hpe-csi-node, hpe-csi-controller)'
NAMESPACE     NAME                                  READY   STATUS    RESTARTS   AGE
kube-system   hpe-csi-controller-7d9cd6b855-zzmd9   5/5     Running   0          15s
kube-system   hpe-csi-node-dk5t4                    2/2     Running   0          15s
kube-system   hpe-csi-node-pwq2d                    2/2     Running   0          15s
kube-system   nimble-csp-546c9c4dd4-5lsdt           1/1     Running   0          15s
```

As described above, a default `StorageClass` is also deployed on the cluster.

```bash
kubectl get storageclass
NAME                     PROVISIONER   RECLAIMPOLICY   VOLUMEBINDINGMODE   ALLOWVOLUMEEXPANSION   AGE
hpe-standard (default)   csi.hpe.com   Delete          Immediate           true                   20s
```

# Kubernetes distribution specific details
As per the Kubernetes Special Interest Group (SIG) Storage, the snapshot controllers, custom resource definitions and RBAC resources should be deployed on the cluster by the vendor of the Kubernetes distribution, not the CSI driver vendor. These resources are not deployed on upstream Kubernetes 1.17.4, which is being used in this tutorial. Now, let’s deploy the necessary resources.

```bash
kubectl create -f https://raw.githubusercontent.com/kubernetes-csi/external-snapshotter/master/config/crd/snapshot.storage.k8s.io_volumesnapshotclasses.yaml
kubectl create -f https://raw.githubusercontent.com/kubernetes-csi/external-snapshotter/master/config/crd/snapshot.storage.k8s.io_volumesnapshotcontents.yaml
kubectl create -f https://raw.githubusercontent.com/kubernetes-csi/external-snapshotter/master/config/crd/snapshot.storage.k8s.io_volumesnapshots.yaml
kubectl create -f https://raw.githubusercontent.com/kubernetes-csi/external-snapshotter/master/deploy/kubernetes/snapshot-controller/rbac-snapshot-controller.yaml
kubectl create -f https://raw.githubusercontent.com/kubernetes-csi/external-snapshotter/master/deploy/kubernetes/snapshot-controller/setup-snapshot-controller.yaml
```

**Note:** The resources will be deployed in the "default" namespace.

For each CSI driver that supports snapshots, at least one `VolumeSnapshotClass` object needs to be created. There’s only one backend that supports snapshots on this cluster and the  `VolumeSnapshotClass` is therefore marked as default, which makes it easy for users to not care about implementation details.

```bash
apiVersion: snapshot.storage.k8s.io/v1beta1
kind: VolumeSnapshotClass
metadata:
  name: hpe-snapshot
  annotations:
    snapshot.storage.kubernetes.io/is-default-class: "true"
driver: csi.hpe.com
deletionPolicy: Delete
parameters:
  description: "Snapshot created by the HPE CSI Driver"
  csi.storage.k8s.io/snapshotter-secret-name: nimble-secret
  csi.storage.k8s.io/snapshotter-secret-namespace: kube-system
```

**Note:** All YAML presented in this blog post should be created with `kubectl create -f- <hit ENTER, then paste the content and hit CTRL-D on a new line>` unless otherwise specified.

# Get started!
The next set of tasks are completely agnostic to which particular storage vendor CSI driver being used. This is the ideal behavior for users interacting with Kubernetes so as to not worry about implementation details.

For this tutorial, a dual replica Redis deployment is being used as an example application. The default is three replicas, but the cluster only has two worker nodes and affinity rules can’t be fulfilled for the Redis chart with three replicas.

Ensure the upstream Helm stable repo is accessible.

```bash
helm repo add stable https://kubernetes-charts.storage.googleapis.com
"stable" has been added to your repositories
helm repo update
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "stable" chart repository
...Successfully got an update from the "hpe-storage" chart repository
Update Complete. ⎈ Happy Helming!⎈
```

In subsequent examples, some output has been truncated to enhance readability. Now, let’s install Redis and insert some data.

```bash
helm install prod stable/redis-ha --version 4.4.1 --set-string replicas=2
kubectl exec -it prod-redis-ha-server-0 sh -n default
Defaulting container name to redis.
/data $ redis-cli set hpedev testing
OK
/data $ exit
```

There’s a key in the Redis database named "hpedev" with the value "testing". Imagine this as state of the application that needs to be preserved. Now, let’s create a snapshot of the Persistent Volume Claims (PVC) that the Redis application requested.

```yaml

---

apiVersion: snapshot.storage.k8s.io/v1beta1
kind: VolumeSnapshot
metadata:
  name: snapshot-0
spec:
  source:
    persistentVolumeClaimName: data-prod-redis-ha-server-0

---

apiVersion: snapshot.storage.k8s.io/v1beta1
kind: VolumeSnapshot
metadata:
  name: snapshot-1
spec:
  source:
    persistentVolumeClaimName: data-prod-redis-ha-server-1
```

If everything went well, the snapshots may be enumerated.

```bash
kubectl get volumesnapshots
NAME         READYTOUSE   SOURCEPVC                     SOURCESNAPSHOTCONTENT   RESTORESIZE   SNAPSHOTCLASS   SNAPSHOTCONTENT                                    CREATIONTIME   AGE
snapshot-0   true         data-prod-redis-ha-server-0                           10Gi          hpe-snapshot    snapcontent-abc0c69c-a22e-499e-8353-b6a6611cd283   16s            17s
snapshot-1   true         data-prod-redis-ha-server-1                           10Gi          hpe-snapshot    snapcontent-b7f81e8c-661d-42df-b452-13cdab878505   16s            17s
```

We now have the opportunity to instantiate another Redis instance using these snapshots as the source for a new deployment. The key here is that the PVCs need to be created before we bring the new deployment online. Since naming is deterministic for Helm charts, this is quite simple. Create the following PVCs.

```bash

---

apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: data-test-redis-ha-server-0
spec:
  dataSource:
    name: snapshot-0
    kind: VolumeSnapshot
    apiGroup: snapshot.storage.k8s.io
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi

---

apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: data-test-redis-ha-server-1
spec:
  dataSource:
    name: snapshot-1
    kind: VolumeSnapshot
    apiGroup: snapshot.storage.k8s.io
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

Next, bring up a "test" deployment and read the key we inserted prior and insert another key we want to use for a subsequent test.

```bash
helm install test stable/redis-ha --version 4.4.1 --set-string replicas=2
kubectl exec -it test-redis-ha-server-0 sh -n default
Defaulting container name to redis.
/data $ redis-cli get hpedev
“testing"
/data $ redis-cli set upgrade anothertest
OK
/data $ exit
```

It’s now possible to transform the data of the "test" deployment without disturbing the data of the "prod" deployment. This opens up the possibility to create advanced testing and development workflows that uses an exact representation of production data. Whether this dataset is a few bytes or a handful of terabytes, the operation will only take a few seconds to execute as the snapshots and clones are not making any copies of the source data. 

The "upgrade" key inserted above will now be used in the next workflow. Clone directly from an existing PVC without creating a snapshot. Let’s now create a set of new PVCs.

```yaml

---

apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: data-clone-redis-ha-server-0
spec:
  dataSource:
    name: data-test-redis-ha-server-0
    kind: PersistentVolumeClaim
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi

---

apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: data-clone-redis-ha-server-1
spec:
  dataSource:
    name: data-test-redis-ha-server-1
    kind: PersistentVolumeClaim
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

Create a new "clone" Redis instance and retrieve the key from the previous workflow.

```bash
helm install clone stable/redis-ha --version 4.4.1 --set-string replicas=2
$ kubectl exec -it clone-redis-ha-server-0 sh -n default
Defaulting container name to redis.
/data $ redis-cli get upgrade
"anothertest"
/data $ exit
```

Not only does this demonstrate the ability to clone directly from a PVC as declared in the `dataSource`, but it also demonstrates the ability to perform a cloning operation on an already existing clone. It’s also possible to create forks of the Redis database to create even more sophisticated workflows. A practical example would be to create a snapshot of a production instance, clone from that instance, obfuscate some data for the end user (could be a potentially IO intensive operation when working with terabyte datasets) and then use the obfuscated clone as a source for subsequent workflows presented to end-users. The idea is to obfuscate the data once and stamp out many new permutations quickly from that one source.

# Volume expansion
One of the most common “Day 2” operations in storage and data management is to expand volume capacity. This feature has been in beta since Kubernetes 1.16 and is now available in the HPE CSI Driver for Kubernetes as a supported feature. In true Kubernetes simplistic fashion the end-user that created the PVC may simply increase the capacity of the PVC specification and the CSI resizer will pick it up and perform all the necessary operations. These operations include increasing the backend storage system volume size, rescanning the multipath device on the host and finally growing the filesystem. This used to be a tedious operation that required a storage admin and Kubernetes admin to satisfy a user requirement, which is very counter-productive.

Let’s expand the storage requests for the Redis production instance (this can be done with `kubectl edit` or `kubectl patch` as well). Run `kubectl apply` with the following specification.

```yaml

---

apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: data-prod-redis-ha-server-0
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 32Gi

---

apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: data-prod-redis-ha-server-1
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 32Gi
```

The original size of the PVC was 10Gi. In a few moments, the new size should be been picked up by the `Pod` running Redis.

```bash
kubectl exec -it prod-redis-ha-server-0 sh -n default
Defaulting container name to redis.
/data $ df -h .
Filesystem                Size      Used Available Use% Mounted on
/dev/mapper/mpathi       32.0G     32.7M     32.0G   0% /data
```

# Next steps
Stay tuned to HPE DEV for future blogs regarding the HPE CSI Driver for Kubernetes. In the meantime, connect with us on [Slack](https://hpedev.slack.com). We hang out in #kubernetes and #nimblestorage

If you want to learn more about Kubernetes, CSI and the integration with HPE storage products, here are a few pointers that would get you started.

* Learn about Kubernetes on [kubernetes.io](https://kubernetes.io)
* Explore the [Container Storage Interface](https://kubernetes-csi.github.io/)
* Check out the [HPE Container Platform](https://developer.hpe.com/platform/hpe-container-platform/home)
* GitHub repository for the [HPE CSI Driver for Kubernetes](https://github.com/hpe-storage/csi-driver)