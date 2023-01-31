---
title: Introducing an NFS Server Provisioner for the HPE CSI Driver for Kubernetes
date: 2020-06-20T21:04:47.133Z
featuredBlog: false
priority: null
author: Michael Mattsson
authorimage: /img/blogs/Avatar1.svg
thumbnailimage: null
tags:
  - hpe-nimble-storage
  - hpe-3par-and-primera
  - hpe-greenlake
  - developer
  - hpe-greenlake-for-private-cloud-enterprise
  - hpe-greenlake-for-private-cloud-enterprise-containers
  - containers-service
---
With the release of HPE CSI Driver for Kubernetes 1.2.0, a new set of features has been made available as a technology preview, including an NFS Server Provisioner and a Pod Monitor. The motivation behind including these new features is explored in the official announcement – [Tech preview: Network File System Server Provisioner for HPE CSI Driver for Kubernetes](https://community.hpe.com/t5/around-the-storage-block/tech-preview-network-file-system-server-provisioner-for-hpe-csi/ba-p/7092948). In this blog post, I’ll demonstrate how to put these features to good use!

> **Note:** The features and capabilities showcased within this blog are considered beta and subject to change. Do not use for production workloads until the official general availability release. Currently on target for version 1.3.0 of the HPE CSI Driver for Kubernetes.

This tutorial assumes version 1.2.0 or later of the HPE CSI Driver for Kubernetes has been installed with a functioning backend, such as HPE Nimble Storage, HPE Primera or HPE 3PAR. The CSI driver is available as a [Helm chart](https://hub.helm.sh/charts/hpe-storage/hpe-csi-driver) or [Operator](https://operatorhub.io/operator/hpe-csi-operator).

# Background

The Container Storage Providers supported by the HPE CSI Driver are block storage solutions that serve volumes over either iSCSI or Fibre Channel. Inherently, traditional filesystems on these volumes are either XFS, ext3/4 or Btrfs. In other words, non-clustered filesystems that only allow a single host at time to access the volumes. With that limitation in mind, the HPE CSI Driver will only support `ReadWriteOnce` (RWO) `PersistentVolumeClaims` (PVCs) natively. In an effort to serve multiple `Pods` across multiple Kubernetes worker nodes, the user would have to be creative by either running Rook or the upstream NFS server provisioner to provide what is called `ReadWriteMany` (RWX) and `ReadOnlyMany` (ROX) access modes.

In an effort to simplify deployment, Hewlett Packard Enterprise opted to create a solution that is seamless for the HPE CSI Driver users and administrators.  More information about the design and the motivation behind it can be found in the [tech preview blog post](https://community.hpe.com/t5/around-the-storage-block/tech-preview-network-file-system-server-provisioner-for-hpe-csi/ba-p/7092948). 

# Enable the NFS Server Provisioner

Enabling the NFS Server Provisioner for PVCs is straightforward, as it’s controlled by the `StorageClass` option `nfsResources` parameter. What’s important to understand is that, once `nfsResources` have been enabled on a `StorageClass`, all PVCs are subject to be served by a NFS server setup by the NFS Server Provisioner, including RWO.

> **Note:** All API objects declarations below assumes `kubectl create -f-`, paste the YAML stanza and hit CTRL-D on a new line after pasting.

This is the shipping default `StorageClass` with `nfsResources` enabled.

```yaml
---
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  annotations:
    storageclass.kubernetes.io/is-default-class: "true"
  name: hpe-standard
provisioner: csi.hpe.com
parameters:
  csi.storage.k8s.io/controller-expand-secret-name: nimble-secret
  csi.storage.k8s.io/controller-expand-secret-namespace: kube-system
  csi.storage.k8s.io/controller-publish-secret-name: nimble-secret
  csi.storage.k8s.io/controller-publish-secret-namespace: kube-system
  csi.storage.k8s.io/node-publish-secret-name: nimble-secret
  csi.storage.k8s.io/node-publish-secret-namespace: kube-system
  csi.storage.k8s.io/node-stage-secret-name: nimble-secret
  csi.storage.k8s.io/node-stage-secret-namespace: kube-system
  csi.storage.k8s.io/provisioner-secret-name: nimble-secret
  csi.storage.k8s.io/provisioner-secret-namespace: kube-system
  description: Volume created by the HPE CSI Driver for Kubernetes
  accessProtocol: iscsi
  csi.storage.k8s.io/fstype: xfs
  nfsResources: "true"
reclaimPolicy: Delete
allowVolumeExpansion: true
```

Creating an RWX claim is as simple as it can be. 

```yaml
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-rwx-pvc
spec:
  accessModes:
  - ReadWriteMany
  resources:
    requests:
      storage: 32Gi
```

It’s now possible to create a `Deployment` with multiple replicas to access the claim.

```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  labels:
    app: my-app
spec:
  replicas: 5
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - image: datamattsson/my-app
          name: my-app
          volumeMounts:
            - name: my-app
              mountPath: /data
      volumes:
        - name: my-app
          persistentVolumeClaim:
            claimName: my-rwx-pvc
```

Once deployed and scaled, it should look like what you see below.

```bash
$ kubectl get pods -o wide
NAME                      READY   STATUS    RESTARTS   AGE   IP          NODE  
my-app-6bfbb6f87f-5gr8k   1/1     Running   0          37s   10.45.0.2   tme-lnx-worker4 
my-app-6bfbb6f87f-rzn64   1/1     Running   0          37s   10.36.0.2   tme-lnx-worker1  
my-app-6bfbb6f87f-tk4vx   1/1     Running   0          37s   10.44.0.3   tme-lnx-worker2  
my-app-6bfbb6f87f-vkqrc   1/1     Running   0          37s   10.44.0.2   tme-lnx-worker2  
my-app-6bfbb6f87f-z87p2   1/1     Running   0          37s   10.44.0.1   tme-lnx-worker2
```

> **Pro tip:** Creating a ROX claim requires the `Pod` to mount the claim read-only. Please check the documentation on the [HPE Storage Container Orchestrator Documentation](https://scod.hpedev.io/csi_driver/using.html#using_the_nfs_server_provisioner) (SCOD) for more details.

# Inspecting the actual NFS Deployment 

While all parts of both the NFS client and server are being deployed transparently for the user, it is important to understand what actually end up running on the Kubernetes cluster. By default, each PVC creates a single replica `Deployment`, a `Service`, and a RWO PVC that maps to a supported backend. The NFS mount for the Pods accessing the claim is being taken care of by the HPE CSI Driver.

Where the NFS servers gets deployed is controlled by the `nfsNamespace` parameter. The default is "hpe-nfs".

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/csi-120-rev1b-1592687082644.png)

Object [naming conventions and other diagnostics](https://scod.hpedev.io/csi_driver/diagnostics.html#nfs_server_provisioner_resources) are available on SCOD.

# User control of the NFS server

Sometimes it’s desired to have a single default `StorageClass` on the cluster for all access mode needs. This is possible but requires non-portable PVCs and a tweak to the `StorageClass` using `allowOverrides` and omitting `nfsResources`.

Another important detail is that the NFS server needs to be deployed in the same Namespace as the requesting claim to allow users to create CSI snapshots and clones.

```yaml
---
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  annotations:
    storageclass.kubernetes.io/is-default-class: "true"
  name: hpe-standard
provisioner: csi.hpe.com
parameters:
  csi.storage.k8s.io/controller-expand-secret-name: nimble-secret
  csi.storage.k8s.io/controller-expand-secret-namespace: kube-system
  csi.storage.k8s.io/controller-publish-secret-name: nimble-secret
  csi.storage.k8s.io/controller-publish-secret-namespace: kube-system
  csi.storage.k8s.io/node-publish-secret-name: nimble-secret
  csi.storage.k8s.io/node-publish-secret-namespace: kube-system
  csi.storage.k8s.io/node-stage-secret-name: nimble-secret
  csi.storage.k8s.io/node-stage-secret-namespace: kube-system
  csi.storage.k8s.io/provisioner-secret-name: nimble-secret
  csi.storage.k8s.io/provisioner-secret-namespace: kube-system
  description: Volume created by the HPE CSI Driver for Kubernetes
  accessProtocol: iscsi
  csi.storage.k8s.io/fstype: xfs
  allowOverrides: nfsResources,nfsNamespace
reclaimPolicy: Delete
allowVolumeExpansion: true
```

By annotating the PVC, a user can request the NFS Server Provisioner to serve the claim. The user can also deploy the server in the `Namespace` requesting the claim.

```yaml
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-other-rwx-pvc
  annotations:
    csi.hpe.com/nfsResources: "true"
    csi.hpe.com/nfsNamespace: default
spec:
  accessModes:
  - ReadWriteMany
  resources:
    requests:
      storage: 32Gi
```

Inspecting the `Namespace` where the claim was created, we may observe the API objects that were created.

```bash
$ kubectl get configmap,deploy,pvc,service -o name
configmap/hpe-nfs-config
deployment.apps/hpe-nfs-053b6374-db9c-46c9-94d9-d3c3e59a55e4
persistentvolumeclaim/hpe-nfs-053b6374-db9c-46c9-94d9-d3c3e59a55e4
persistentvolumeclaim/my-other-rwx-pvc
service/hpe-nfs-053b6374-db9c-46c9-94d9-d3c3e59a55e4
```

The user may now use the requesting claim as a `dataSource` in a new claim to clone it. For a comprehensive tutorial on how to use CSI snapshots and clones, check out this previous blog post: [HPE CSI Driver for Kubernetes: Snapshots, Clones and Volume Expansion](/blog/PklOy39w8NtX6M2RvAxW/hpe-csi-driver-for-kubernetes-snapshots-clones-and-volume-expansion)

# Advanced configuration

The tech preview is currently hardcoded to allow twenty running NFS servers per worker node in the cluster. Request limits are also unrestricted. It’s encouraged to tinker with the request limits during the tech preview as the engineering team is looking for real world guidance. In the GA release, the request limits will be not be unrestricted. We know that the NFS server has around 150MiB memory foot print coming up cold and it all comes around to how much buffer cache you want to put aside for servicing cached read requests. We also know the NFS server will consume quite a lot of CPU cycles during load tests.

These are the `StorageClass` parameters that control the request limits:

-  __nfsResourceLimitsCpuM__: Specify CPU limits for the server `Deployment` in milli CPU. Default: no limits applied. Example: "500m"
- __nfsResourceLimitsMemoryMi__: Specify memory limits (in megabytes) for the server `Deployment`. Default: no limits applied. Example: "500Mi"

It’s also possible to fine tune the NFS server itself. The `ConfigMap` "hpe-nfs-config" in the `Namespace` where the server is deployed represents the running server configuration. Samples can be found in the [NFS-Ganesha GitHub](https://github.com/nfs-ganesha/nfs-ganesha/tree/master/src/config_samples) repo.

The NFS client mount options are also tunable, this could be useful for making tweaks to fit a certain best practice for running a particular application over NFS. Do note that NFSv4 is the only version supported at this time.

- __nfsMountOptions__: Customize NFS mount options for the `Pods` to the server `Deployment`. Default: "nolock, hard,vers=4"

# Automatic recovery with the Pod Monitor

In an effort to ensure the NFS servers are kept alive, HPE introduced a customer facing feature called Pod Monitor. It monitors `Pods` on the cluster with the label `monitored-by: hpe-csi`. It checks the status of the `Pod` on 30 second intervals (tunable) and watches for the `NodeLost` transition. It also verifies that the node is indeed unreachable and effectively deletes the `Pod` and `VolumeAttachments` to let Kubernetes reschedule the `Pod` on a healthy node.

The Pod Monitor is necessary because the defaults in Kubernetes used to perform automatic recovery for node outages are too extreme and would stall workloads running over 10 minutes to recover. And, there would still be problems with the `VolumeAttachment`, as CSI won’t forcefully remove it because, for all it knows, the volume is still mounted on the node that became isolated. As the CSPs supported by the HPE CSI Driver strip the initiator groups from a volume before applying the new ones, split brain would never happen. There might be dirty buffers, but modern filesystems recover gracefully and if there’s an application level corruption, there should be backups or at least snapshots of the volume to recover from.

Read more about the [Pod Monitor](https://scod.hpedev.io/csi_driver/monitor.html) on SCOD as it’s possible to apply it to any workload backed by a HPE CSI Driver volume.

# Summary

Please take the NFS Server Provisioner and Pod Monitor for a spin if you get the chance. We value your feedback and we keep all channels of communication open for this purpose. If you’re an HPE employee, join our Slack community at [hpedev.slack.com](https://hpedev.slack.com). If you’re not an employee, sign up at [slack.hpedev.io](https://slack.hpedev.io) first. It’s also possible to [report issues through GitHub](https://github.com/hpe-storage/csi-driver/issues/new?title=Feedback%20on%20RWX%20functionality%20in%201.2.0). Beta feedback, questions and concerns may also be raised through a regular support ticket. Please check with your HPE representative of the respective storage backend on how to log a support case.

- HPE CSI Driver for Kubernetes [Helm Chart](https://hub.helm.sh/charts/hpe-storage/hpe-csi-driver)
- HPE CSI Operator on [OperatorHub.io](https://operatorhub.io/operator/hpe-csi-operator)
- Read the Tech Preview announcement blog COMING SOON!
- Visit [HPE Storage Container Orchestrator Documentation](https://scod.hpedev.io) (SCOD)
- HPE CSI Driver [source code](https://github.com/hpe-storage/csi-driver) on GitHub
- Browse the [CSP specification](https://developer.hpe.com/api/hpe-nimble-csp/) if you want to include your platform with the HPE CSI Driver

Until my next blog post, happy containerizing!