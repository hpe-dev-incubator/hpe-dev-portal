---
title: "Introducing Kubernetes CSI Sidecar Containers from HPE"
date: 2020-08-25T01:45:01.828Z
author: Michael Mattsson 
tags: ["hpe-nimble-storage","hpe-3par-and-primera"]
path: introducing-kubernetes-csi-sidecar-containers-from-hpe
---
With the release of the upcoming HPE CSI Driver for Kubernetes version 1.3.0, Hewlett Packard Enterprise (HPE) introduces the concept of Container Storage Interface (CSI) extensions to the CSI driver using Kubernetes CSI sidecar containers. This concept is not foreign to anyone familiar with the CSI architecture as most new major features get implemented as a sidecar in a true microservice architecture. Services are tightly coupled and communicate over a UNIX socket using a high-speed Remote Procedure Call (RPC) interface, gRPC, for secure and reliable communication.

The interface allows third parties to write extensions to their drivers to expose a particular storage platform’s differentiating feature where it’s difficult to conceive a broad stroke feature in a vendor neutral manner. It’s also possible to leapfrog SIG Storage (the Kubernetes working group for storage) for features currently in the discovery or design phase if customer demand is being prioritized over standardization.

<img src="https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/6/csi-130-slate-1598320004312.png">

The first (yes, there’s quite a few in the works) CSI sidecar is a volume mutator. It will allow end-users to alter their `PersistentVolumeClaims` (PVCs) during runtime, even while the `PersistentVolume` (PV) is mounted and serving a workload. What attributes are mutable depends on the backend Container Storage Provider (CSP) being used. Also, what attributes are allowed to be altered by an end-user is controlled by the Kubernetes cluster administrator through the `StorageClass`.

Let’s go through an example on how you could put the volume mutator to work using the HPE Nimble Storage CSP.

# Mutating persistent volume claims

With the CSI driver deployed and a HPE Nimble Storage backend configured, it’s good to understand what attributes are mutable. On the [HPE Storage Container Orchestration Documentation](https://scod.hpedev.io/container_storage_provider/hpe_nimble_storage/index.html#common_parameters_for_provisioning_and_cloning) (SCOD) portal for the respective CSP, you'll find the supported parameters. For reference, this table represents the current mutable attributes.

| Attribute | Type | Description |
| ----------| -------|------|
| destroyOnDelete  |  Boolean | Used to control deletion of volume in the backend after PV removal |
| description   | Text | Volume description |
| folder   | Text | Place volume into an existing folder |
| limitIops |   Integer | Change IOPS limits on volume |
| limitMbps  |  Integer | Change Throughput limits on volume |
| performancePolicy  |  Text | Change performance policy for volume (within the same block size) |
| dedupeEnabled  |  Boolean | Enable/Disable deduplication on volume |
| thick  |  Boolean | Thick/thin provisioning of volume |
| syncOnDetach  |  Boolean | Control that a snapshot of the volume should be synced to the replication partner each time it is detached from a node. |

For the purposes of this example, let’s assume we want to allow users to be in control of a few storage attributes. We will also allow them to override the parameters during creation of the `PVC`. [Overriding parameters](https://scod.hpedev.io/csi_driver/using.html#using_pvc_overrides) during creation is a cornerstone feature that has been part of the HPE primary storage solution since the FlexVolume days.

Create a default `StorageClass` with the `allowOverrides` and `allowMutations` set to allow certain performance tuning.

```
---
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  annotations:
    storageclass.kubernetes.io/is-default-class: "true"
  name: hpe-standard
provisioner: csi.hpe.com
parameters:
  csi.storage.k8s.io/fstype: xfs
  csi.storage.k8s.io/controller-publish-secret-name: hpe-backend
  csi.storage.k8s.io/controller-publish-secret-namespace: kube-system
  csi.storage.k8s.io/node-publish-secret-name: hpe-backend
  csi.storage.k8s.io/node-publish-secret-namespace: kube-system
  csi.storage.k8s.io/node-stage-secret-name: hpe-backend
  csi.storage.k8s.io/node-stage-secret-namespace: kube-system
  csi.storage.k8s.io/provisioner-secret-name: hpe-backend
  csi.storage.k8s.io/provisioner-secret-namespace: kube-system
  description: "Volume created by the HPE CSI Driver for Kubernetes"
  allowOverrides: description,limitIops,limitMbps,performancePolicy
  allowMutations: description,limitIops,limitMbps,performancePolicy
```

> **Note:** The volume mutator sidecar is dependent on the `"csi.storage.k8s.io/provisioner-secret-name"` and `"csi.storage.k8s.io/provisioner-secret-namespace"` to mutate volumes.

Next, create a `PVC` with the following `.metadata.annotations`:

```
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-data
  annotations:
    csi.hpe.com/description: This is my volume description
    csi.hpe.com/limitIops: "10000"
    csi.hpe.com/limitMbps: "200"
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 32Gi
```

Switching over to the backend array, you can see that the volume was created with the desired overrides.

```
Nimble OS $ vol --info pvc-2d1795ec-7bce-4af8-b841-437a435f29e1 | egrep -iw 'description|iops|throughput|performance'
Description: This is my volume description
Performance policy: default
IOPS Limit: 10000
Throughput Limit (MiB/s): 200
```

> **Note:** The volume name may be retrieved with `kubectl get pvc/my-data`.

Let’s edit the object definition. This can be done with `kubectl edit` or you can create a YAML file and subsequently patch the `PVC`.

```
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-data
  annotations:
    csi.hpe.com/description: Need more oomph!
    csi.hpe.com/performancePolicy: double-down
    csi.hpe.com/limitIops: "50000"
    csi.hpe.com/limitMbps: "1000"
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 32Gi
```

Patch the `PVC`.

```
kubectl patch pvc/my-data --patch "$(cat my-data-boost.yaml)"
```

Back on the array, you can see that the attributes have changed.

```
Nimble OS $ vol --info pvc-2d1795ec-7bce-4af8-b841-437a435f29e1 | egrep -iw 'description|iops|throughput|performance'
Description: Need more oomph!
Performance policy: double-down
IOPS Limit: 50000
Throughput Limit (MiB/s): 1000
```

Since the `.spec.csi.volumeAttributes` of the `PV` that the backend volume was created with are immutable, the latest successful changes are annotated on the `PV`.

```
apiVersion: v1
kind: PersistentVolume
metadata:
  annotations:
    csi.hpe.com/description: Need more oomph!
    csi.hpe.com/limitIops: "50000"
    csi.hpe.com/limitMbps: "1000"
    csi.hpe.com/performancePolicy: double-down
    pv.kubernetes.io/provisioned-by: csi.hpe.com
...
```

Further adjustments may be performed anytime at any stage of the lifecycle of the `PV`.

# Use cases

Given the gamut of options for the HPE Nimble Storage CSP, there are a number of creative ways to accelerate certain use cases that require runtime tuning of storage characteristics.

## Performance management

Like in the example above, throttling volumes to adhere to a certain performance characteristic is by far the most prolific use case, especially if there's cost associated with the performance limits. The use case can be further extended by allowing users to move volumes between folders on the Nimble array, such as Gold, Silver and Bronze, all with different performance caps. Certain restrictions apply. See the [documentation](https://scod.hpedev.io/container_storage_provider/hpe_nimble_storage/index.html#common_parameters_for_provisioning_and_cloning) for more information.

## Data reduction changes

Using compression and deduplication may be desirable for the initial ingest of a dataset. Just note that future churn might cause issues on the workload requirement and data reduction capabilities may be toggled at will. The need might arise during runtime to prioritize space reserve. Toggling thin-provisioning with the `thick` parameter may be used to control the reservations.

## Data migration control

In the event where you need to perform a workload transition between clusters, it’s practical to apply `destroyOnDelete: "false"` and `syncOnDetach: "true"` on the backend volume. This is to ensure the replica destination gets updated with the latest data from the source when destaging the workload. Also, retaining the volume on the array when the Kubernetes objects are being cleaned out from the source namespace is neccesary in the event of the replica destination is being configured to reverse the replication after the transition.

It will be exciting to see what other use cases will surface from the installed base with this new capability!

# Next steps

The HPE CSI Driver for Kubernetes version 1.3.0 will become available in the next few weeks. `StorageClasses` may then be created with the `allowMutations` parameter and the CSI volume mutator may be used without any further tweaks.

- [Using volume mutations](https://scod.hpedev.io/csi_driver/using.html#using_volume_mutations) on SCOD
- Overview of the [HPE CSI Driver for Kubernetes](https://scod.hpedev.io/csi_driver/index.html)
- Source code [available on GitHub](https://github.com/hpe-storage/csi-driver)
- Check out the HPE primary storage platform pages: [HPE Nimble Storage](https://developer.hpe.com/platform/hpe-nimble-storage/home) and [HPE Primera](https://developer.hpe.com/platform/hpe-3par-and-primera/home)

Watch the [HPE Developer Community](https://hpedev.io) for future exciting updates to the HPE CSI Driver for Kubernetes!