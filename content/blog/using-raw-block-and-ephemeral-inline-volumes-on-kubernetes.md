---
title: Using Raw Block and Ephemeral Inline Volumes on Kubernetes
date: 2020-06-11T21:18:38.870Z
featuredBlog: false
priority: null
author: Michael Mattsson
authorimage: /img/blogs/Avatar2.svg
thumbnailimage: null
tags:
  - hpe-nimble-storage
  - hpe-3par-and-primera
  - hpe-greenlake
  - hpe-greenlake-for-private-cloud-enterprise
  - developer
  - containers-service
  - hpe-greenlake-for-private-cloud-enterprise-containers
---
With the release of the [HPE CSI Driver for Kubernetes 1.2.0](https://community.hpe.com/t5/around-the-storage-block/hpe-csi-driver-for-kubernetes-1-2-0-available-now/ba-p/7091977) quite a few new Container Storage Interface (CSI) concepts were introduced as fully supported features. As always, new capabilities introduce new YAML stanzas that needs to be understood to take full advantage of these capabilities. In this blog post, we’ll explore how to expose raw block volumes and the different ways to declare an ephemeral inline volume for Kubernetes Pods.

Many CSI drivers support these capabilities. For the examples below, we’ll use a recent version of the HPE CSI Driver with the default `StorageClass` installed on Kubernetes 1.18. Do note that ephemeral inline volumes are still considered beta in Kubernetes.

# Raw block volumes 

Kubernetes supports running a diverse set of applications with various needs when it comes to infrastructure requirements, such as compute, networking and storage. Historically, a “volume” on Kubernetes translates to a POSIX-like filesystem to store persistent data at a given path inside a `Pod`. With the introduction of raw block volumes, there’s now a way to present the underlying block device that the filesystem normally is created on. This is beneficial for applications that are capable of addressing the device directly to store data. It effectively removes the double-buffering effects that filesystems introduces along with the POSIX semantics and filesystem internals. Applications that truly can take advantage of raw block volumes on Kubernetes are few and far between.

The concept of presenting a raw block volume to a `Pod` on Kubernetes is very similar to how Raw Device Mappings (RDMs) are presented on VMware vSphere, where a virtual machine get unfettered direct access to a LUN on a storage fabric exposed to the VMware ESX host.

Let’s compare the Kubernetes minutia needed to declare a regular volume versus a raw block volume.  

```yaml
apiVersion: v1 
kind: PersistentVolumeClaim 
metadata: 
  name: block-device 
spec: 
  accessModes: 
  - ReadWriteOnce 
  resources: 
    requests: 
      storage: 32Gi 
  volumeMode: Block 
```

This is a conventional Persistent Volume Claim (PVC). The only thing that stands out is the `.spec.volumeMode`. By default, `volumeMode` is set to `Filesystem` and is usually never called out explicitly. Setting the `volumeMode` attribute to `Block` will change this, presenting the device itself, once it is exposed to a `Pod`.

To be able to address the block device, there’s additional details that needs to be declared in the `Pod` specification. Let’s bring up a `Pod` as an example:

```bash
--- 
apiVersion: v1 
kind: Pod 
metadata: 
  name: ioping 
spec: 
  containers: 
  - name: ioping 
    image: hpestorage/ioping 
    command: [ "ioping" ] 
    args: [ "/dev/xvda" ] 
    volumeDevices: 
    - name: raw 
      devicePath: /dev/xvda 
  volumes: 
  - name: raw 
    persistentVolumeClaim: 
      claimName: block-device 
``` 

The `.spec.volumes` stanza is exactly the same as it would be for using a filesystem. It’s the `.spec.containers.volumeDevices` and `.spec.containers.volumeDevices.devicePath` that just got introduced. Creating the above PVC and `Pod` would result in the following log output:

```bash
$ kubectl logs -f pod/ioping 
4 KiB <<< /dev/xvda (block device 32 GiB): request=1 time=1.10 ms (warmup) 
4 KiB <<< /dev/xvda (block device 32 GiB): request=2 time=1.01 ms 
4 KiB <<< /dev/xvda (block device 32 GiB): request=3 time=862.1 us 
4 KiB <<< /dev/xvda (block device 32 GiB): request=4 time=1.11 ms 
4 KiB <<< /dev/xvda (block device 32 GiB): request=5 time=895.1 us 
4 KiB <<< /dev/xvda (block device 32 GiB): request=6 time=1.11 ms 
4 KiB <<< /dev/xvda (block device 32 GiB): request=7 time=976.4 us 
4 KiB <<< /dev/xvda (block device 32 GiB): request=8 time=853.5 us (fast) 
4 KiB <<< /dev/xvda (block device 32 GiB): request=9 time=912.7 us 
^C 
```

It’s evident that we are indeed accessing a raw block device from inside the `Pod`.

# Real world example for raw block volumes: Rook

[Rook](https://github.com/rook/rook) is a Cloud Native Computing Foundation (CNCF) incubator project (a graduation proposal in the works at this time) to provide open source cloud-native storage for Kubernetes. Rook provides object, file and block storage to Kubernetes using [CEPH](https://ceph.io/). Rook is complementary to the HPE CSI Driver, which only provide block (Nimble, Primera, 3PAR) versus Rook giving the option to deploy a distributed filesystem on Kubernetes backed by Enterprise storage to present additional data access protocols.

Let’s assume we have deployed the Rook Operator on the Kubernetes cluster. Creating a new `CephCluster` is done as follows:

```bash
--- 
apiVersion: ceph.rook.io/v1 
kind: CephCluster 
metadata: 
  name: rook-ceph 
  namespace: rook-ceph 
spec: 
  cephVersion: 
    image: ceph/ceph:v14.2.9 
  dataDirHostPath: /var/lib/rook 
  mon: 
    count: 3 
    volumeClaimTemplate: 
      spec: 
        storageClassName: hpe-standard 
        resources: 
          requests: 
            storage: 10Gi 
  storage: 
   storageClassDeviceSets: 
    - name: set1 
      count: 3 
      portable: true 
      tuneSlowDeviceClass: false 
      volumeClaimTemplates: 
      - metadata: 
          name: data 
        spec: 
          resources: 
            requests: 
              storage: 32Gi 
          storageClassName: hpe-standard 
          volumeMode: Block 
          accessModes: 
            - ReadWriteOnce 
```

Pay attention to the `volumeMode: Block` attribute in the specification. We can further inspect the PVC created by the `StatefulSet` that has been declared:

```bash
kubectl get pvc -n rook-ceph -l ceph.rook.io/DeviceSetPVCId=set1-data-0 -o json | json items.0.spec 
{ 
  "accessModes": [ 
    "ReadWriteOnce" 
  ], 
  "resources": { 
    "requests": { 
      "storage": "32Gi" 
    } 
  }, 
  "storageClassName": "hpe-standard", 
  "volumeMode": "Block", 
  "volumeName": "pvc-26e4e5d5-0e08-46c6-9a2e-679e0bde6264" 
}
```

It’s now possible to use the CEPH cluster to create [filesystems](https://rook.io/docs/rook/v1.3/ceph-filesystem.html) and [object stores](https://rook.io/docs/rook/v1.3/ceph-object.html).

> **Note!** Use Rook at your own risk. This is an example, not an endorsement.

# Ephemeral inline volumes

The term ephemeral inline volume is quite a mouthful for what it is – a temporary placement of data which you don’t really care about long-term, most commonly talked about as a "scratch disk". However, this is a very important construct for data intensive applications where Kubernetes administrators now have the ability to dictate placement of IO intensive applications that require temporary storage. Up until the introduction of ephemeral inline volumes, applications have simply used the container runtime provided union filesystem inside the container for scratch space or used other shared mechanisms like `hostPath` or `emptyDir`. Sharing resources on the host has its challenges. First off, the Kubernetes admin has no means to put any sort of boundaries in place for an individual container. That, in turn, could lead to potentially having a single container consume the entire host filesystem and starve other containers on the host for resources.

The term “inline” means the volume declaration resides inside the `Pod` specification. Each `Pod`, regardless of replica count, will be given a dedicated `ReadWriteOnce` volume as per the declaration. Let’s see what it looks like.

```bash
--- 
apiVersion: v1 
kind: Pod 
metadata: 
  name: my-pod-inline-mount-2 
spec: 
  containers: 
    - name: pod-datelog-1 
      image: nginx 
      command: ["bin/sh"] 
      args: ["-c", "while true; do date >> /data/mydata.txt; sleep 1; done"] 
      volumeMounts: 
        - name: my-volume-1 
          mountPath: /data 
  volumes: 
    - name: my-volume-1 
      csi: 
       driver: csi.hpe.com 
       fsType: ext3 
       volumeAttributes: 
         csi.storage.k8s.io/ephemeral: "true" 
         inline-volume-secret-name: nimble-secret 
         inline-volume-secret-namespace: kube-system 
         accessProtocol: "iscsi" 
         size: "7Gi" 
```

The interesting part here is the `.spec.volumes.csi` stanza. This is the bare minimum amount of parameters required to provision an inline volume. Any additional parameters supported by the Container Storage Provider (CSP) may be used here. Note that there’s no `StorageClass` at play here. All parameters, including the `Secret` needs to be part of the declaration. This is where a word of caution is warranted. Handing out the `Secret` to a user is the same as handing over credentials to the CSP backend!

CSI ephemeral inline volumes provide a means for the Kubernetes admin to make cluster users aware of how and where temporary storage resources may be provisioned. This is not a particularly good idea with the HPE Nimble Storage CSP at this time as there’s no mechanism to create the necessary separation. With the HPE 3PAR/Primera CSP, it’s possible to create a separate Virtual Domain for inline volumes and the user is essentially a tenant on the backend storage array.

# Next steps

It’s always exciting to talk about new features and capabilities. Take the new CSI driver for a spin and let us know what you think. We hang out on the HPE DEV Slack community. Sign up on [slack.hpedev.io](https://slack.hpedev.io) if you’re an external HPE user or login directly at [hpedev.slack.com](https://hpedev.slack.com) if you’re an HPE employee.

- HPE CSI Driver for Kubernetes [Helm Chart](https://hub.helm.sh/charts/hpe-storage/hpe-csi-driver) 
- HPE CSI Operator for Kubernetes on [OperatorHub.io](https://operatorhub.io/operator/hpe-csi-operator) 
- Learn about the CSI driver on [HPE Storage Container Orchestrator Documentation](https://scod.hpedev.io) (SCOD) 
- Visit the [HPE Nimble Storage](https://developer.hpe.com/platform/hpe-nimble-storage/home) or [HPE Primera](https://developer.hpe.com/platform/hpe-3par-and-primera/home) platform pages 
- Read the HPE CSI Driver for Kubernetes release blog on [Around The Storage Block](https://community.hpe.com/t5/around-the-storage-block/hpe-csi-driver-for-kubernetes-1-2-0-available-now/ba-p/7091977)