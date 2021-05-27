---
title: Multitenancy for Kubernetes clusters using HPE Alletra 6000 and Nimble Storage
date: 2021-06-15T15:00:00.000Z
author: Michael Mattsson
authorimage: http://1.gravatar.com/avatar/4e631ed7e332979c790e519d00388368.jpg?s=320
tags:
  - Kubernetes
  - HPE Alletra
  - HPE Nimble Storage
  - HPE Primera
  - CSI
---
In a storage infrastructure economy where IT is under constant pressure to deliver more with less, yet still provide a high standard in data services directly to end users without compromising system or data security.

With the introduction of [HPE CSI Driver for Kubernetes 2.0](https://community.hpe.com/t5/Around-the-Storage-Block/HPE-CSI-Driver-for-Kubernetes-now-available-for-HPE-Alletra/ba-p/7136280) and the software powering HPE Alletra 6000 and Nimble Storage, Hewlett Packard Enterprise introduces multitenancy for Kubernetes clusters accessing persistent volumes on the aforementioned storage arrays.

In this blog post we'll step through some of the basic elements to enable storage administrators to safely hand over credentials to Kubernetes administrators.

# The enabling primitives

HPE Alletra 6000 and NimbleOS 6.0 includes a new command-line interface (CLI) called `tenantadmin`. This new CLI enables storage administrators to confine a tenant user account into specific folders. Folders need to exist on the array prior creating a new tenant.

The synopsis of the `--help` help flag gives an overview of the supported workflows.

```markdown
HPE Alletra $ tenantadmin --help
Usage: tenantadmin [options]
Manage Tenants.

Available options are:
  --help                           Program help.

  --list                           List Tenants.

  --info name                      Tenant info.

  --add tenant_name                Add a tenant.
    --folders folders              List of folder paths (comma separated
                                   pool_name:fqn) the tenant will be able to
                                   access (mandatory).

  --remove name                    Remove a tenant.

  --add_folder tenant_name         Add a folder path for tenant access.
    --name folder_name             Name of the folder path (pool_name:fqn) to
                                   be added (mandatory).

  --remove_folder tenant_name      Remove a folder path from tenant access.
    --name folder_name             Name of the folder path (pool_name:fqn) to
                                   be removed (mandatory).

  --passwd                         Change tenant's login password.
    --tenant name                  Change a specific tenant's login password
                                   (mandatory).
```

With these basic create, read, update and delete (CRUD) elements, the storage administrator is now empowered to delegate and confine all the storage resource management to a folder for a Kubernetes administrator to household with.

# The storage administrator's workflow

Assume a new Kubernetes environment is being deployed within an Enterprise. Each cluster needs to be compartmentalized to not consume all the performance and capacity of the array.

First step, create a new restricted folder in the pool of your choice.

```markdown
folder --create k8s-prod \
  --iops_limit 75000 --usage_limit 2500000 \
  --description="Kubernetes Production Cluster"
```

Next, create a new tenant. 

```markdown
tenantadmin --add K8sAdminProd --folders default:/k8s-prod
Enter new password: ********
Retype new password: ********
Created User K8sAdminProd
```

**Hint:** Username must be alphanumeric, cannot start with a number and cannot exceed 32 characters in length. The password policy enforced is derived from the system policy.

At this point, the storage administrator hands over the credentials to the Kubernetes administrator.

It's important to understand that giving the folder name to the Kubernetes administrator is completely optional. This could be useful in situations where it has been determined that a tenant need different performance characteristics for the folders. Like a "gold", "silver" and "bronze" scheme. The Container Storage Provider (CSP) will, by default, pick the folder with the most available capacity for the tenant. The upside by omitting the folder information to the Kubernetes administrator is that the storage administrator has all the power and flexibility to grow storage to new pools for a tenant without the tenant knowing about it. A very popular cloud operational model.

# Apply Kubernetes configuration

Applying the tenant configuration to the Kubernetes cluster is not more difficult than using a standard "administrator" or "poweruser" account on the array.

YAML declarations below are created with:

```markdown
kubectl create -f-
< Paste the YAML content >
Hit CTRL-D on a new line.
```

Let's create a `Secret` referencing the HPE Alletra 6000 with the tenant credentials.

```yaml
---
apiVersion: v1
kind: Secret
metadata:
  name: hpe-backend
  namespace: hpe-storage
stringData:
  serviceName: alletra6000-csp-svc
  servicePort: "8080"
  backend: 192.168.1.30
  username: K8sAdminProd
  password: qweqwe123
```

Next, create a new `StorageClass`.

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
  csi.storage.k8s.io/fstype: xfs
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
  description: "Volume created by the HPE CSI Driver for Kubernetes"
reclaimPolicy: Delete
allowVolumeExpansion: true
```

At this point the Kubernetes cluster is ready to accept `PersistentStorageClaims`. Let's create one.

```yaml
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-first-pvc
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 32Gi
```

Once the `PersistentVolume` has been bound we can inspect the array and determine that volume has been placed in the tenant's folder.

![HPE Alletra 6000 Multitenancy for Kubernetes Clusters](/img/multitenancy-hpedev-screenshot.png "HPE Alletra 6000 Multitenancy for Kubernetes Clusters")

That's it. Multitenant storage is now properly configured!

# Container Storage Provider (CSP) access only

Multitenant storage is only available today through the HPE Alletra 6000 and Nimble Storage Container Storage Provider for Kubernetes. The CSP uses an undisclosed REST API resource of the array to perform CRUD operations on objects that in turn are being tagged and grouped accordingly to create the notion of a full blown cloud experience both from the Kubernetes administrator perspective but most importantly for the storage administrator. The storage administrator does not need to worry about storage system credentials being compromised and wreaking havoc beyond the compartment they were assigned for.

At the time of writing, no limitations on the CSP functionality is restricted by using a tenant instead of a system account with the "administrator" or "poweruser" role. HPE recommends switching over to the tenant model for Kubernetes clusters accessing HPE Alletra 6000 or Nimble Storage arrays running NimbleOS 6.0.0 or later.

Visit [HPE Storage Container Orchestrator Documentation](https://scod.hpedev.io) (SCOD) to learn more about what storage resources are being exposed to tenants.

# Example use cases

There are plenty of different use cases that multitenancy enables for IT Ops looking to manage and secure storage resources for a diverse set of applications running on Kubernetes.

## Ephemeral Inline Volumes

End users that deploy applications on Kubernetes that require ephemeral storage at a capacity beyond of what a worker node is capable of providing, may use Ephemeral Inline Volumes. Before multitenancy, Kubernetes administrators had to share the `Secret` with the end user to allow provisioning of the Ephemeral Inline Volume. That is not very practical for a lot of reasons. Now, the end user may request a separate tenant to allow management of Ephemeral Inline Volumes securely for their application.

Example.

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: my-csi-app-inline-volume
spec:
  containers:
    - name: my-frontend
      image: busybox
      command: [ "sleep", "100000" ]
      volumeMounts:
      - mountPath: "/data"
        name: my-csi-volume
  volumes:
  - name: my-csi-volume
    csi:
      driver: csi.hpe.com
      nodePublishSecretRef:
        name: my-tenant-secret
      fsType: ext3
      volumeAttributes:
        csi.storage.k8s.io/ephemeral: "true"
        accessProtocol: "iscsi"
        size: "5Gi"
```

The `Secret` "my-tenant-secret" would have to exist in the same `Namespace` as the `Pod` and contain the necessary connectivity and credentials to the tenant.

## Virtualization and Containers

Deploying Kubernetes on a virtualization platform such as VMware vSphere, OpenStack or Hyper-V is by far the most popular pattern for deploying on-premises Kubernetes. Many times customers want to leverage the same array to provide persistent storage both for the virtualization platform and the container platform.

Allowing Kubernetes clusters "administrator" or "poweruser" access to the array served by the virtualization platform the cluster is running on might be feasible in a single tenant and single application type scenario. Once weaving in the Ephemeral Inline Volumes use case into the mix and we've basically given application administrators way too many privileges on the array.

In many cases the virtualization and storage administrator is combined into the same role, moving forward, this administrative function would be able to securely hand over credentials to Kubernetes administrators that needs a first class persistent storage solution.

## Kubernetes-as-a-Service

Cloud and Managed Service Providers (CSPs and MSPs) monetizing their infrastructure are in a constant battle to safely and securely share infrastructure resources between their tenants and at the same time provide a differentiating portfolio. In the case of dispensing Kubernetes clusters to their tenants they would have to resort to either using the virtualization platform CSI driver (such as the vSphere CSI driver) which is incredibly limited in functionality or running a Container Attached Storage (CAS) solution on the Kubernetes cluster itself which in turn would result in storage and performance inefficiencies.

With multitenancy, CSPs and MSPs are now enabled to create new tenants on the array as part of the their catalog workflows and provide an entirely new set of rich data services enabled by HPE Alletra 6000 and HPE Nimble Storage.

![Kubernetes as a Service](/img/kaas.png "Kubernetes as a Service")

# Summary

Expect more content that elaborates deeper on how multitenancy can be used with Kubernetes using HPE Alletra 6000 and Nimble Storage. Consider this blog post a teaser of the cornerstone capability of multitenancy.

- Visit SCOD to learn more about the [HPE Alletra 6000 CSP](https://scod.hpedev.io/container_storage_provider/hpe_nimble_storage/index.html)
- Explore the all-new [HPE Alletra](https://hpe.com/storage/alletra) 6000
- Check out the release blog of [HPE CSI Driver for Kubernetes 2.0](https://community.hpe.com/t5/Around-the-Storage-Block/HPE-CSI-Driver-for-Kubernetes-now-available-for-HPE-Alletra/ba-p/7136280)

The team hangs out in #kubernetes and #nimblestorage (Alletra channels pending) on Slack. Join at [slack.hpedev.io](https://slack.hpedev.io) and sign in at [hpedev.slack.com](https://hpedev.slack.com) and we're eager to learn about how you'll put multitenancy to use!