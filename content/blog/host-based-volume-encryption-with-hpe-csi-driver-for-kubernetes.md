---
title: Host-based Volume Encryption with HPE CSI Driver for Kubernetes
date: 2021-06-15T15:00:55.232Z
author: Michael Mattsson
authorimage: /img/portrait-192.jpg
tags:
  - hpe-3par-and-primera
  - " hpe-nimble-storage"
  - hpe-alletra
  - hpe-greenlake
  - developer
  - hpe-greenlake-for-private-cloud-enterprise
  - hpe-greenlake-for-private-cloud-enterprise-containers
  - containers-service
---
Security is on everyone's mind today, and storage should be considered of the utmost importance. In highly dynamic and agile environments where many hosts and applications share the same wire for consolidation purposes, it has become important to not only secure communication between endpoints, but also store data fully encrypted where only the designated reader and writer is capable of unlocking the data through the use of a private key.

In this blog post, we'll discuss how to use the host encryption feature of the HPE Container Storage Interface ("CSI") Driver for Kubernetes that was introduced in version 2.0. This functionality is available to use with all supported backend Container Storage Providers ("CSP").

# In-flight encryption VS data-at-rest encryption

Many of the supported HPE CSI Driver backends support encryption in one way or another. Let's examine the different modes to understand a little bit better where host encryption comes in.

## Full disk encryption

FDE (Full Disk encryption) and SED (Self-Encrypting Drives) are two technologies available to users on certain storage devices that encrypts the entire drive, whether it's a SSD or HDD. Software may be used to manage the keys to read and write data. Access is established during power on of the drive, and once the drive is powered off, the decryption key, or passphrase, is needed to read and write content to the drive. This method will protect data if a drive is stolen or lost. The downside is that FDE drives are usually more expensive and key/passphrase management can be impractical due to the key is needed close to the data it protects, unless an external key manager is being used.

## Storage appliance software encryption

A more sensible approach for a storage appliance is to have a proprietary software component to allow administrators to selectively choose logical volumes to be encrypted. Keys can be stored on the appliance, either password protected or automatically put the keys in place at boot. Drives taken out of the appliance will have encrypted data on them and if concerns of the whole appliance might be stolen or tampered with, an optional passphrase could be used.

Neither FDE or appliance-based encryption secures data coming off the data fabric serving client workloads, such as iSCSI, FC or NVMe-oF. If a host is compromised or spoofed on the fabric, full access to the volume content is granted. This is better known as data-at-rest encryption.

## Host encryption

Data that travels across a wire or data fabric in an encrypted fashion is known as in-flight encryption. In most cases, data is encrypted and decrypted at each side with a shared secret that has been established from either a trusted entity or a simple password. Data may be stored either encrypted or bare depending on the use case and usually there are separate technologies doing in-flight encryption and data-at-rest encryption.

Host based encryption works very similar to the storage appliance software encryption but the control of the encryption is at the disposal of the host administrator using platform independent standard on-disk format. If the host administrator lose the key, the data is lost. All data, in-flight and at-rest is done outside any controls the actual storage administrator has. If the storage appliance is compromised or a rogue node spoofs the fabric identity of a legit host, the data will not decrypt without the key.

Storing the key securely is where Kubernetes comes in and is necessary to transition volumes from node to node within a cluster. Let's walk through a simple example on how to use the host encryption for persistent volumes and how end-users are in full control of their own destiny on how their data is being secured.

# Cluster-wide or namespace local keys

Configuring host encryption for persistent volumes is controlled with `StorageClass` parameters. A `StorageClass` is a cluster object which restricted users that deploy apps normally don't have access to. The HPE CSI Driver for Kubernetes provide a construct that allows restricted users direct access to `StorageClass` parameters defined by an administrator. This gives the users and administrators immense flexibility in terms of what to encrypt and what to encrypt it with. Let's examine these in detail.

## Cluster administrator controlled host encryption

If an organization policy is to encrypt everything by default and only allow Kubernetes cluster administrators access to the key, a default `StorageClass` could look like the one below. Pay attention to `allowOverrides`, that would allow users who create persistent volume claims to opt-out encryption of certain persistent volumes.

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
  csi.storage.k8s.io/controller-expand-secret-name: hpe-backend
  csi.storage.k8s.io/controller-expand-secret-namespace: hpe-storage
  csi.storage.k8s.io/controller-publish-secret-name: hpe-backend
  csi.storage.k8s.io/controller-publish-secret-namespace: hpe-storage
  csi.storage.k8s.io/node-publish-secret-name: hpe-backend
  csi.storage.k8s.io/node-publish-secret-namespace: hpe-storage
  csi.storage.k8s.io/node-stage-secret-name: hpe-backend
  csi.storage.k8s.io/node-stage-secret-namespace: hpe-storage
  csi.storage.k8s.io/provisioner-secret-name: hpe-backend
  csi.storage.k8s.io/provisioner-secret-namespace: hpe-storage
  csi.storage.k8s.io/fstype: xfs
  allowOverrides: hostEncryption
  hostEncryption: "true"
  hostEncryptionSecretName: hpe-encrypt
  hostEncryptionSecretNamespace: hpe-storage
reclaimPolicy: Delete
allowVolumeExpansion: true
```

Any `PersistentVolumeClaim` created from this `StorageClass` would be encrypted with the below `Secret`.

```yaml
---
apiVersion: v1
kind: Secret
metadata:
  name: hpe-encrypt
  namespace: hpe-storage
stringData:
  hostEncryptionPassphrase: "This is a very secret passphrase"
```

If a user wants to opt-out of encryption for a certain `PersistentVolumeClaim`, the PVC needs to be annotated.

```yaml
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-unencrypted-pvc
  annotations:
    csi.hpe.com/hostEncryption: "false"
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 64Gi
```

There are good reasons for allowing certain volumes to be unencrypted as not all data is confidential and encryption does come with both compute overhead and storage inefficiencies (more on this later).

## Namespace controlled host encryption

In scenarios where the namespaced user need to be in control of the key, it's possible for the cluster administrator to delegate the key management. This is incredibly useful when data is being replicated or backed up to an off-site location and data is being reused for dev/test use cases, disaster recovery or running compute heavy analytics to offload production. To allow this behavior, the `StorageClass` needs to be tweaked. Pay attention to `allowOverrides`.

```yaml
---
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  annotations:
    storageclass.kubernetes.io/is-default-class: "false"
  name: hpe-standard-delegated
provisioner: csi.hpe.com
parameters:
  csi.storage.k8s.io/controller-expand-secret-name: hpe-backend
  csi.storage.k8s.io/controller-expand-secret-namespace: hpe-storage
  csi.storage.k8s.io/controller-publish-secret-name: hpe-backend
  csi.storage.k8s.io/controller-publish-secret-namespace: hpe-storage
  csi.storage.k8s.io/node-publish-secret-name: hpe-backend
  csi.storage.k8s.io/node-publish-secret-namespace: hpe-storage
  csi.storage.k8s.io/node-stage-secret-name: hpe-backend
  csi.storage.k8s.io/node-stage-secret-namespace: hpe-storage
  csi.storage.k8s.io/provisioner-secret-name: hpe-backend
  csi.storage.k8s.io/provisioner-secret-namespace: hpe-storage
  csi.storage.k8s.io/fstype: xfs
  allowOverrides: hostEncryption,hostEncryptionSecretName,hostEncryptionSecretNamespace
reclaimPolicy: Delete
allowVolumeExpansion: true
```

Now, the user first need to create their own `Secret`.

```yaml
---
apiVersion: v1
kind: Secret
metadata:
  name: my-encryption-key
  namespace: my-namespace
stringData:
  hostEncryptionPassphrase: "This is another secret, it's all mine!"
```

This `Secret` now needs to be referenced in a set of annotations of the `PersistentVolumeClaim`.

```yaml
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-encrypted-pvc
  annotations:
    csi.hpe.com/hostEncryption: "true"
    csi.hpe.com/hostEncryptionSecretName: my-encryption-key
    csi.hpe.com/hostEncryptionSecretNamespace: my-namespace
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 64Gi
  storageClassName: hpe-standard-delegated
```

Let's use the above `StorageClass`, `Secret` and `PersistentVolumeClaim` and attach a workload.

# Provisioning and writing data

In this example I'm just bringing up a sleeping `Pod` and attaching the `PersistentVolumeClaim` named "my-encrypted-pvc" created from the previous section.

```yaml
---
kind: Pod
apiVersion: v1
metadata:
  name: my-pod
spec:
  containers:
    - name: my-test-pod
      image: alpine
      command: ["/bin/sh"]
      args: ["-c", "while true; do echo Snoozing...; sleep 10; done"]
      volumeMounts:
        - name: my-encrypted-mount
          mountPath: /data
  volumes:
    - name: my-encrypted-mount
      persistentVolumeClaim:
        claimName: my-encrypted-pvc
```

Once the `Pod` has come up, we can inspect the mount point.

```markdown
$ kubectl exec pod/my-pod -- df -h /data
Filesystem              Size   Used   Available  Use%  Mounted on
/dev/mapper/enc-mpatha  64.0G  32.2M  63.9G      0%    /data
```

The important difference we can observe here versus an unencrypted `PersistentVolumeClaim` is the "enc" keyword in the device name. This means that the kernel module "dm-crypt" has been used to broker access to the actual volume via Linux Unified Key Setup (LUKS). The HPE CSI Driver uses the default cipher with "dm-crypt" which currently is "aes-xts-plain64" with a key size of 256 bits.

# Inspecting the wire

Assume we would write "Hello World" into an unencrypted volume versus an encrypted. In the following experiment I captured `echo "Hello World" > /data/file.txt && sync` with a network packet sniffer and loaded up the result in Wireshark.

![Hello World unencrypted](/img/unecrypted.png "Hello World unencrypted")

Imagine if this would be Personal Identifiable Information (PII) traveling across a compromised network. A security breach could potentially result in an expensive lawsuit if the information end up in the wrong hands. Let's repeat the experiment with an encrypted device.

![Hello World encrypted](/img/encrypted.png "Hello World encrypted")

Inspecting the same packet in the sequence, it's quite obvious the entire payload has been encrypted. This, of course, has impact on the actual storage. Data you know traditionally compress and deduplicate well, all of a sudden present a near 1:1 representation.

I conducted an experiment where I wrote an 8GiB file, filled with zeroes. Under normal circumstances, such a file is nearly invisible to any enterprise array. Not when encrypted.

```markdown
HPE Alletra $ vol --info  pvc-44159f94-0f2b-4109-ae90-e48d0df082b1 | grep ^Volume
Volume mapped usage (MiB): 7859
Volume compression: 0.97X
```

It's advised to consult with the storage administrator to ensure data-at-rest encryption on the array is turned off along with deduplication and compression to spare CPU cycles.

Naturally, there will be a performance impact on the host, and it's advised to study empirical data from benchmarks conducted with a production-like workload to understand the amount of CPU headroom that's needed to ensure the application meets its performance criteria.

# Maliciously trying to retrieve data

In the event of a rogue host gaining access to a volume without having the key, assume the LUN gets connected and discovered.

```bash
# mount /dev/mapper/mpatha /mnt
mount: unknown filesystem type 'crypto_LUKS'
```

The encrypted volume may, in this state, be brute forced or maliciously deleted. Therefore, it's advisable to use a strong, non-dictionary passphrase for encryption and decryption. The passphrase can be up to 512 characters long. The passphrase length does not affect performance or the cipher strength. It's only used to open the device to the host.

As an extra layer of security when using the iSCSI protocol, you can use the Challenge-Handshake Authentication Protocol (CHAP) facility available to the HPE CSI Driver. This ensures a mutual (between initiator and target) shared secret is needed to perform a discovery in the first place.

# Summary

Being able to confidently store sensitive data on storage systems out of your control over insecure networks is becoming more important in the era of data being the digital oil. With this solution, you can take your keys and walk away without any concern of your volumes (or replicas of them) being stolen, manipulated or sold to third parties.

* Check out the release announcement of [HPE CSI Driver for Kubernetes 2.0.0](https://community.hpe.com/t5/Around-the-Storage-Block/HPE-CSI-Driver-for-Kubernetes-now-available-for-HPE-Alletra/ba-p/7136280)

* Read the documentation on HPE Storage Container Orchestrator Documentation (SCOD) around the [host-based Volume Encryption](https://scod.hpedev.io/csi_driver/using.html#volume_encryption) feature

* Learn about the [new multitenancy feature on HPE Alletra 6000 and Nimble Storage](https://scod.hpedev.io/container_storage_provider/hpe_alletra_6000/index.html#multitenant_deployment) to further improve security of your storage infrastructure

The team hangs out on Slack and is eager to learn about your security challenges. Sign up at [slack.hpedev.io](http://slack.hpedev.io) and login to the community at [hpedev.slack.com](https://hpedev.slack.com), to check out #kubernetes #nimblestorage and #3par-primera.