---
title: Synchronized Volume Snapshots for Distributed Workloads on Kubernetes
date: 2021-01-14T18:10:48.848Z
featuredBlog: true
priority: 6
author: Michael Mattsson
authorimage: /img/blogs/Avatar3.svg
thumbnailimage: null
tags:
  - hpe-nimble-storage
  - hpe-3par-and-primera
  - hpe-greenlake
  - hpe-greenlake-for-private-cloud-enterprise
  - hpe-greenlake-for-private-cloud-enterprise-containers
  - developer
  - containers-service
---
Typically, Persistent Volume Claims on Kubernetes are treated as a singular entity completely decoupled from your workload. The actual physical location doesn't really matter. But what if you wanted an atomic operation where all Persistent Volume Claims that make up an application in a microservice architecture need to be atomically protected to ensure referential integrity? Would you stop the application, sequence the operation or take a shotgun approach and hope for the best? 

In this blog post, we'll use the HPE CSI Driver for Kubernetes to create Volume Groups that allow users to group Persistent Volume Claims together and use those Volume Groups to perform CSI Volume Snapshots through Snapshot Groups.

In other storage infrastructure management systems, the term "Volume Groups" is usually referred to as "Consistency Groups". It is the industry standard to create volume snapshots with referential integrity. This capability was introduced in the HPE CSI Driver for Kubernetes v1.4.0 and more information about the release may be found on [Around The Storage Block](https://community.hpe.com/t5/Around-the-Storage-Block/HPE-CSI-Driver-for-Kubernetes-v1-4-0-with-expanded-ecosystem-and/ba-p/7118180).

# TL;DR

A variant of the demonstrative steps below has been captured in a screencast that is available on YouTube. If you prefer watching and listening instead of reading, please go ahead and watch the screencast.

Just don’t forget to come back to read the "Learn more" section at the end of this article for important information.

[![Synchronize Volume Snapshots for Distributed Workloads using the HPE CSI Driver for Kubernetes](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/untitled-1610648109128.png)](https://youtu.be/zUj-bJ_KqHU "Synchronize Volume Snapshots for Distributed Workloads using the HPE CSI Driver for Kubernetes")
Watch on [YouTube](https://youtu.be/zUj-bJ_KqHU)!


# Prerequisites

The examples we're going to walk through require that the HPE CSI Driver for Kubernetes v1.4.0 or later has been installed along with the CSI external snapshotter. Examples also assume a `VolumeSnapshotClass` named "hpe-snapshot" exists on the cluster.

- Install the HPE CSI Driver using the [Helm Chart](https://artifacthub.io/packages/helm/hpe-storage/hpe-csi-driver)
- Enable [CSI snapshots](https://scod.hpedev.io/csi_driver/using.html#enabling_csi_snapshots)
- Add a [HPE storage backend](https://scod.hpedev.io/csi_driver/deployment.html#add_a_hpe_storage_backend)
- Create a [VolumeSnapshotClass](https://scod.hpedev.io/csi_driver/using.html#using_csi_snapshots) and of course a [StorageClass](https://scod.hpedev.io/csi_driver/using.html#base_storageclass_parameters)

No particular parameters are needed in either the `VolumeSnapshotClass` or `StorageClass` but the backend `Secret` is assumed to be named "hpe-backend" and reside in the "hpe-storage" `Namespace`.

In the examples below, we're using HPE Nimble Storage. Any Container Storage Provider (CSP) will work that supports `VolumeGroups` and `SnapshotGroups`.

# Pick an application

In order to illustrate the fact that multiple snapshots are being created, either pick an application that requires multiple volumes or deploy a microservice stack comprised of multiple stateful applications. In this example we'll use WordPress from the `bitnami/wordpress` Helm Chart.

We're using the following "values" file for the deployment:

```yaml
mariadb:
  architecture: replication
```

Add the Bitnami repo:

```markdown
helm repo add bitnami https://charts.bitnami.com/bitnami
```

Install the WordPress chart:

```markdown
helm install my-wordpress bitnami/wordpress -f wp-values.yaml
```

Once deployed, there should be three `PersistentVolumeClaims` on the cluster.

```markdown
kubectl get pvc -o name
persistentvolumeclaim/data-my-wordpress-mariadb-primary-0
persistentvolumeclaim/data-my-wordpress-mariadb-secondary-0
persistentvolumeclaim/my-wordpress
```

Adding content to the WordPress site being deployed is completely optional as restore procedures are not covered in this tutorial. However, if you're interested in performing a restore from the `VolumeSnapshots` we're creating, please see the CSI snapshots tutorial in this [HPE DEV blog post](/blog/PklOy39w8NtX6M2RvAxW/hpe-csi-driver-for-kubernetes-snapshots-clones-and-volume-expansion).

# Volume Groups

The `CustomResourceDefinition` (CRD) that users interact with is called a `VolumeGroup`. In order to facilitate the creation of `VolumeGroups` a Kubernetes cluster administrator needs to create another `CRD` called a `VolumeGroupClass`.

The Volume Group Provisioner (depicted below) is a Kubernetes CSI sidecar container that performs a number of duties to facilitate volume grouping.

![picture3](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/groups-1610651079691.png)

The `VolumeGroupContent` `CRD` is managed solely by the Volume Group Provisioner. 

Let's start by creating a `VolumeGroupClass`. The remaining YAML in this tutorial is assumed to be pasted into a terminal verbatim, like this:

```markdown
kubectl create -f- <hit ENTER>
< paste the YAML content >
^D <hit CTRL+D on a new line>
```

Let's begin:

```yaml
---
apiVersion: storage.hpe.com/v1
kind: VolumeGroupClass
metadata:
  name: my-volume-group-class
provisioner: csi.hpe.com
deletionPolicy: Delete
parameters:
  description: "HPE CSI Driver for Kubernetes Volume Group"
  csi.hpe.com/volume-group-provisioner-secret-name: hpe-backend
  csi.hpe.com/volume-group-provisioner-secret-namespace: hpe-storage
```

At this stage nothing has been created on the backend storage system. The next step is to create a blank `VolumeGroup`.

```yaml
---
apiVersion: storage.hpe.com/v1
kind: VolumeGroup
metadata:
  name: my-volume-group
spec:
  volumeGroupClassName: my-volume-group-class
```

Now, logging in to the backend HPE Nimble Storage array, we'll see a new Volume Collection has been created.

```markdown
Nimble OS $ volcoll --list
--------------------+---------------+-------------------------------------------
Volume Collection    Application     Owned By
Name                 Synchronization
--------------------+---------------+-------------------------------------------
volumegroup-e96aa858-93e9-424c-a593-6a6f216368c0 none            nva-grp
```

Inspecting further:

```markdown
Nimble OS $ volcoll --info volumegroup-e96aa858-93e9-424c-a593-6a6f216368c0
Name: volumegroup-e96aa858-93e9-424c-a593-6a6f216368c0
Description: HPE CSI Driver for Kubernetes Volume Group
Owned by: nva-grp
Application synchronization: none
Application server: N/A
Application ID: N/A
Cluster name: N/A
Service name: N/A
VMware vCenter hostname: N/A
VMware vCenter username: N/A
VMware vCenter password: N/A
Backup agent hostname: N/A
Backup agent username: N/A
Backup agent password: N/A
Associated volumes: none
Associated pinned volumes: none
Snapshot collection count: 0
Created: Jan 13 2021 16:40:48
Last configuration change: Jan 13 2021 16:40:48
Replication Type: Periodic Snapshot
Synchronous Replication State: N/A
Synchronous Replication Last In Sync: N/A
Synchronous Replication Resync %: N/A
```

Adding members to the `VolumeGroup` is done by adding annotations to `PersistentVolumeClaims`. This can be done in a number of ways. Either the claims may be created with the annotation, using the `kubectl patch` command and the `kubectl annotate` command. I prefer using the `kubectl annotate` command. Let's do it.

```markdown
kubectl annotate pvc/data-my-wordpress-mariadb-primary-0 \
  pvc/data-my-wordpress-mariadb-secondary-0 \
  pvc/my-wordpress \
  csi.hpe.com/volume-group=my-volume-group 
```

Annotations doesn't need to be created all at once. They can be added (or removed) individually.

At this stage you can inspect the `VolumeGroup` on the Kubernetes cluster or the Volume Collection on the array to confirm that `PersistentVolumeClaims` have been added to the `VolumeGroup`.

```markdown
kubectl get -o yaml volumegroup/my-volume-group \
  -o 'jsonpath={.spec.persistentVolumeClaimNames[*]}'
```

Next, let's create some atomic `VolumeSnapshots`.

# Snapshot Groups

The `SnapshotGroup` `CRD` is primarily what users interact with. The Snapshot Group Snapshotter depicted below carries out all the backend work and populates Kubernetes with the necessary `CRDs`.

![picture4](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/snaps-1610647869530.png)

In a similar fashion to `VolumeGroupClasses` a `SnapshotGroupClass` needs to be created by an administrator.

```yaml
---
apiVersion: storage.hpe.com/v1
kind: SnapshotGroupClass
metadata:
  name: my-snapshot-group-class
snapshotter: csi.hpe.com
deletionPolicy: Delete
parameters:
  csi.hpe.com/snapshot-group-snapshotter-secret-name: hpe-backend
  csi.hpe.com/snapshot-group-snapshotter-secret-namespace: hpe-storage
```

Now, users may create `SnapshotGroups`. Upon creation, the `SnapshotGroups` will automatically be populated by `VolumeSnapshots` by the Snapshot Group Snapshotter. Let's create a `SnapshotGroup` and see.

```yaml
---
apiVersion: storage.hpe.com/v1
kind: SnapshotGroup
metadata:
  name: my-snapshot-group-1
spec:
  source:
    kind: VolumeGroup
    apiGroup: storage.hpe.com
    name: my-volume-group
  snapshotGroupClassName: my-snapshot-group-class
  volumeSnapshotClassName: hpe-snapshot
```

While unrelated to this tutorial, the "hpe-snapshot" `VolumeSnapshotClass` should already exist on the cluster as described in the prerequisites above. The `.spec.source` indicates our previously created `VolumeGroup` to snapshot. Now, let's check for `VolumeSnapshots`.

```markdown
kubectl get volumesnapshots -o name
volumesnapshot.snapshot.storage.k8s.io/my-snapshot-group-1-data-my-wordpress-mariadb-primary-0
volumesnapshot.snapshot.storage.k8s.io/my-snapshot-group-1-data-my-wordpress-mariadb-secondary-0
volumesnapshot.snapshot.storage.k8s.io/my-snapshot-group-1-my-wordpress
```

Presto! Further, logging in to the backend array, we can now see a new Snapshot Collection with populated entries.

```markdown
Nimble OS $ snapcoll --list
--------------------+---------------------------------------+-------+-----------
Volume Collection    Snapshot Collection                     Num     Replication
Name                 Name                                    Snaps   Status
--------------------+---------------------------------------+-------+-----------
volumegroup-e96aa858-93e9-424c-a593-6a6f216368c0 snapshot-fde72bb7-6633-4e6f-841c-3efaa0444710      3 N/A
```

A few points to note.

- `SnapshotGroups` may be deleted from the cluster and will in turn delete the `VolumeSnapshots` and backend Snapshot Collection
- `VolumeSnapshots` may be used to perform restores (clone) from as any other `VolumeSnapshot`

# Learn more

This is just the tip of the iceberg when it comes to data management innovation from HPE. Stay tuned to the [HPE Developer Community](https://developer.hpe.com/) to learn more about upcoming features and capabilities. 

- Explore the HPE CSI Driver for Kubernetes [on GitHub](https://github.com/hpe-storage/csi-driver)
- Check out the release announcement on [Around The Storage Block](https://community.hpe.com/t5/Around-the-Storage-Block/HPE-CSI-Driver-for-Kubernetes-v1-4-0-with-expanded-ecosystem-and/ba-p/7118180)
- Install the latest HPE CSI Driver using the [Helm Chart from ArtifactHub.io](https://artifacthub.io/packages/helm/hpe-storage/hpe-csi-driver)
- Visit the [HPE Storage Container Orchestration Documentation](https://scod.hpedev.io) (SCOD) portal for everything pertaining to the HPE CSI Driver
- Sign up for a [HPE DEV Hack Shack Workshop](/hackshack/workshops) to learn about CSI on the HPE Ezmeral Container Platform

HPE is eager to learn what our customers and partners are doing with Kubernetes and data management. Join the HPE DEV Slack community to share your thoughts and engage with the team. Sign up at [slack.hpedev.io](http://slack.hpedev.io) and sign in at [hpedev.slack.com](http://hpedev.slack.com), we hang out in #nimblestorage, #3par-primera and #kubernetes.