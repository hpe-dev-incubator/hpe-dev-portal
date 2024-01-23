---
title: Getting started with volume snapshots on a Kubernetes cluster in HPE
  GreenLake for Private Cloud Enterprise
date: 2024-01-23T14:24:28.483Z
author: Guoping Jia
authorimage: /img/guoping.png
disable: false
tags:
  - HPE GreenLake for Private Cloud Enterprise
  - Kubernetes
  - Persistent volumes
  - Volume snapshots
  - HPE CSI driver for Kubernetes
  - Stateful applications
  - Backup and restore
---
### Overview



[HPE GreenLake for Private Cloud Enterprise: Containers](https://www.hpe.com/us/en/greenlake/containers.html), one of the HPE GreenLake cloud services available on the HPE GreenLake for Private Cloud Enterprise, allows customers to create a Kubernetes (K8s) cluster, view details about existing clusters, and deploy containerized applications to the cluster. It provides an enterprise-grade container management service using open source K8s.  

In this blog post, I discuss first the persistent volumes and volume snapshots in K8s. Then I describe the Container Storage Interface (CSI) and HPE CSI driver for K8s in HPE GreenLake for Private Cloud Enterprise. With a MySQL database instance deployed as a sample stateful application using persistent volume in the cluster, I show the detailed steps to create a volume snapshot of the database as a backup using HPE CSI driver. Finally I describe how to restore MySQL database using the created volume snapshot. 

### Persistent volumes and volume snapshots  



In K8s, a persistent volume (PV) is a piece of storage in the cluster that has been provisioned, either statically by an administer or dynamically using *StorageClasses*. It provides a way for data to persist beyond the lifecycle of individual Pods. PV provides the necessary data persistence for stateful applications, ensuring that they function correctly even in the event of Pod or node failures. So it's a key component in managing storage in K8s. Backing up PVs is then becoming a critical aspect of managing stateful applications in K8s.



A volume snapshot is a copy of the data stored in a PV in K8s at a specific point in time. It provides the ability to create snapshot of a PV from stateful applications. Volume snapshot can be used to back up data of a PV, restore a PV from a previous state, or create a new PV from a snapshot. Volume snapshot provides K8s users with a standardized way to copy the contents of a PV at a particular point in time without creating an entirely new volume. This functionality enables, for example, database administrators to backup databases before perfoming edit or delete modifications.



Support of volume snapshots in K8s is only available for CSI driver deployed in the cluster. 

### HPE CSI driver for K8s



CSI defines a standard interface for container orchestration systems, like K8s, to expose arbitrary block and file storage systems to their containerized workloads. Support for CSI in K8s was introduced as *alpha* in its v1.9 release, and promoted to *beta* in its v1.10 release. Since v1.13 release, the implementation of the CSI has been in *GA* in K8s. With the adoption of CSI, the K8s volume layer becomes truly extensible. Using CSI, 3rd party storage providers, such as HPE,  can write and deploy plugins exposing new storage systems in K8s without ever having to touch the core K8s code. This gives K8s users more options for storage and makes the system more secure and reliable.




A CSI driver for K8s is a plugin that allows K8s to access different types of storage systems, such as Azure Disks, AWS EBS, and HPE Storage, etc. HPE CSI driver for K8s is one of those CSI driver plugins that follows the K8s CSI specification and enables K8s to use various HPE storage systems, such as Nimble Storage, 3PAR and Primera. 



As part of K8s cluster provisioning in HPE GreenLake for Private Cloud Enterprise, HPE CSI driver for K8s has been installed on the cluster. The installation consists of two components, a _controller_ component and a _per-node_ component. The controller component is deployed as a *Deployment* on any node in the K8s cluster. It implements the CSI Controller service and a list of sidecar containers, such as _external-provisioner_, _external-attacher_, _external-snapshotter_, and _external-resizer_, etc. These controller sidecar containers typically interact with K8s objects, make calls to the driver’s CSI Controller service, manage K8s events and make the appropriate calls to the CSI driver. The per-node component is deployed on every node in the cluster through a _DaemonSet_. It implements the CSI Node service and the _node-driver-registrar_ sidecar container that registers the CSI driver to kubelet running on every cluster node and being responsible for making the CSI Node service calls. These calls mount and unmount the storage volume from the HPE storage system, making it available to the Pod to consume.   


As part of HPE CSI driver configuration, a list of _StorageClasses_ is created that refers to the CSI driver name. The _PersistentVolumeClaim_ (PVCs) can then be created that uses the _StorageClass_ to dynamically provision persisten volume backed by the HPE storage systems. 

Apart from features such as dynamic provisioning, raw block volumes, inline ephemeral volumes, and volume encryption, HPE CSI driver implements and supports volume snapshot on K8s cluster. The common snapshot controller _snapshot-controller_ and a _VolumeSnapshotClass_, together with a list of snapshot CustomResourceDefinitions (CRDs), gets deployed and added to the cluster.  
 
The following shows the details about deployed HPE CSI driver for K8s in the cluster 
to the namespace *hpe-storage*: 
 
```markdown
$ k﻿ubectl get all -n hpe-storage
NAME                                       READY   STATUS    RESTARTS      AGE
pod/hpe-csi-controller-54cf448d85-g4w4c    9/9     Running   0             56d
pod/hpe-csi-node-5xtdb                     2/2     Running   0             56d
pod/nimble-csp-74d57f9487-qxwln            1/1     Running   0             56d
pod/primera3par-csp-59f5dfc499-hfghx       1/1     Running   0             56d
pod/snapshot-controller-5fd799f6b5-f6k7n   1/1     Running   6 (22d ago)   56d
pod/snapshot-controller-5fd799f6b5-z62dc   1/1     Running   2 (27d ago)   56d

NAME                          TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
service/alletra6000-csp-svc   ClusterIP   10.101.79.85    <none>        8080/TCP   56d
service/alletra9000-csp-svc   ClusterIP   10.97.147.230   <none>        8080/TCP   56d
service/nimble-csp-svc        ClusterIP   10.110.238.43   <none>        8080/TCP   56d
service/primera3par-csp-svc   ClusterIP   10.101.42.76    <none>        8080/TCP   56d

NAME                          DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE
daemonset.apps/hpe-csi-node   1         1         1       1            1           <none>          56d

NAME                                  READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/hpe-csi-controller    1/1     1            1           56d
deployment.apps/nimble-csp            1/1     1            1           56d
deployment.apps/primera3par-csp       1/1     1            1           56d
deployment.apps/snapshot-controller   2/2     2            2           56d

NAME                                             DESIRED   CURRENT   READY   AGE
replicaset.apps/hpe-csi-controller-54cf448d85    1         1         1       56d
replicaset.apps/nimble-csp-74d57f9487            1         1         1       56d
replicaset.apps/primera3par-csp-59f5dfc499       1         1         1       56d
replicaset.apps/snapshot-controller-5fd799f6b5   2         2         2       56d
```

Here is the list of _StorageClasses_ and the _VolumeSnapshotClass_ created in the cluster:

```markdown
$ k﻿ubectl get storageclasses
NAME                                 PROVISIONER                    RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
gl-sbc-hpe                           csi.hpe.com                    Delete          Immediate              true                   56d
gl-sbp-frank-gl1-sstor01 (default)   csi.hpe.com                    Delete          Immediate              true                   56d
hpe-hdd-storage                      kubernetes.io/no-provisioner   Delete          WaitForFirstConsumer   false                  56d
hpe-nvme-storage                     kubernetes.io/no-provisioner   Delete          WaitForFirstConsumer   false                  56d
hpe-ssd-storage                      kubernetes.io/no-provisioner   Delete          WaitForFirstConsumer   false                  56d

$ k﻿ubectl  get volumesnapshotclasses
NAME                                 DRIVER        DELETIONPOLICY   AGE
gl-sbp-frank-gl1-sstor01             csi.hpe.com   Delete           56d
```
 
