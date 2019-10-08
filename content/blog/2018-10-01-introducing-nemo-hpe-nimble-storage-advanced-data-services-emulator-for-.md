---
title: Introducing Nemo&#58; HPE Nimble Storage Advanced Data Services Emulator for Containers
date: 2018-10-01T17:33:50.371Z
author: Michael Mattsson 
tags: ["kubernetes","hpe-nimble-storage","docker","nemo","dory","doryd"]
path: introducing-nemo-hpe-nimble-storage-advanced-data-services-emulator-for-
---
The [HPE Nimble Storage Docker Volume plugin](https://store.docker.com/plugins/nimble) brings a plethora of powerful capabilities to container ecosystems like Docker, Mesos and Kubernetes. The plugin can be used with either [Nimble arrays](https://hpe.com/storage/nimble) or in conjunction with a [HPE Cloud Volumes](https://hpe.com/storage/cloudvolumes) account. Both platforms are very suitable for high performing mission-critical production workloads, which is to be expected. However, given the advanced functionality the Docker Volume plugin provides, wouldn't one be more comfortable experimenting with the features in a completely isolated sandbox? On your laptop?

Nemo is the [HPE Nimble Storage Advanced Data Services Emulator for Containers](https://github.com/NimbleStorage/Nemo). It's a free-standing Open Source project blessed by HPE. It emulates some of the Advanced Data Services that the real plugin provides and it only depends on OpenZFS being available on the host OS. OpenZFS provides similar data management capabilities such as snapshot, clones and metadata storage per filesystem. Nemo is not providing block storage; it is only a local filesystem and does not come with a support contract.

HPE Nimble Storage does not use OpenZFS in any way in the shipping products.

# The Soda Challenge
Nemo is designed to emulate the HPE Nimble Storage Docker Volume plugin in so, at a glance, they look very similar. But, if you were actaully comparing the two one to one – it's apples and oranges in terms of functionality. The official plugins are targeted towards mission-critical Enterprise applications and workloads. Nemo is for the dabbler and tinkerer who is unable to access a Nimble array or HPE Cloud Volumes to learn how Advanced Data Services are incorporated into DevOps centric environments.

The options available to Nemo are divided in a number of self-explanatory sections to help layout the level of difference between the two:
* Universal Options: Help and size, very rudimentary
* Nimble Compatible Global Options: Basic parameters
* Nimble Compatible Clone Options: Clone parameters
* Nimble Compatible Import Dataset as Clone Options: Import existing OpenZFS datasets
* Nimble Compatible Vanity Options: These options does not provide any real functionality

These sections are outlined below and available in the `-o help` output from the plugin:
```
gem:~ mmattsson$ sudo docker volume create -d nemo -o help
Error response from daemon: create c6e7ad6cd8199feac4c485a5e79ad4edef8e231e9fa179e0191a1e5fadfe88fc: VolumeDriver.Create:  -o help

Nemo: HPE Nimble Storage Advanced Data Services Emulator for Containers

Create, Clone or Import an existing OpenZFS dataset into a locally scoped 
Docker Volume. All options are optional. Every '-o key=value' will be stored 
on the OpenZFS Dataset.

********************************************************************************

                            D I S C L A I M E R

 HPE Nimble Storage is not using OpenZFS in any of its products. Nemo is a tool
 to educate users how to integrate Advanced Data Services into DevOps workflows 
 using common developer and IT operations tools without owning or using a 
 HPE Nimble Storage product. Nemo is not supported by HPE Nimble Storage.

********************************************************************************
 
Universal Options:
  -o help           This help
  -o size=X         X is the quota of volume specified in GiB, 0 means no quota

Nimble Compatible Global Options:
  -o description=X      X is a vanity description set on the volume
  -o sizeInGiB=X        X is the alternative to 'size'
  -o destroyOnRm=X      X is either 'true' or 'false' to actually destroy a 
                        dataset after it has been removed. Can be "imported" 
                        with 'importVol'. Global default runtime flag available
  -o fsMode=X           X X is 1 to 4 octal digits that represent the file mode
                        to be applied to the root directory of the filesystem
  -o fsOwner=X:Y        X:Y is the uid:gid that should own the root directory of
                        the filesystem, in the form of uid:gid (string or nums)

Nimble Compatible Clone Options:
  -o cloneOf=X          X is the name of Docker Volume to create a clone of
  -o snapshot=X         X is the name of the snapshot to base the clone on 
                        (optional, if missing, a new snapshot is created)
  -o createSnapshot=X   'true' or 'false', indicates that a new snapshot of the
                        volume should be taken and used for the clone
  -o destroyOnDetach=X  indicates that the dataseut (including snapshots)
                        backing this volume should be destroyed when this volume
                        is unmounted or detached

Nimble Compatible Import Dataset as Clone Options:
  -o importVolAsClone=X X is an exisiting dataset without ZDVP properties to
                        import into a ZDVP dataset as a clone
  -o snapshot=X         X is an optional dataset snapshot to import clone from
  -o createSnapshot=X   X is either 'true' or 'false' to create a above snapshot
  -o destroyOnDetach=X  X indicates that the dataset (including snapshots)
                        backing this volume should be destroyed when this volume
                        is unmounted or detached

Nimble Compatible Import Options:
  -o importVol=X    X is an exisiting unmounted dataset without ZDVP properties
                    to import into a ZDVP dataset
  -o snapshot=X     X is an optional dataset snapshot to import from
  -o restore=X      X is dataset snapshot name to roll back to on import
  -o forceImport=X  Vanity flag, accepts any value, all imports are forced

Nimble Compatible Vanity Options (will be displayed in the "Status" field):
  -o limitIOPS=X            Defaults to '-1'
  -o limitMBPS=X            Defaults to '-1'
  -o dedupe=X               Defaults to 'false'
  -o thick=X                Defaults to 'false'
  -o encryption=X           Defaults to 'none'
  -o folder=X               Defaults to 'none'
  -o pool=X                 Defaults to 'default'
  -o perfPolicy=X           Defaults to 'DockerDefault'
  -o protectionTemplate=X   Defaults to 'none'

Additional OpenZFS Options:
 -o help=OpenZFS
```

The `docker volume inspect` output somewhat represents a fairly compatible output if the JSON output from a production system is being programmatically parsed. This would include the list of snapshots on a particular volume (snapshot naming conventions and timestamps differ slightly).

# Get started!
Nemo is primarily being distributed in source form but will be made available for broader developer-friendly container ecosystems. There's a managed Docker Volume plugin available that installs pretty much out-of-the-box on an Ubuntu 18.04 machine. Instructions to get OpenZFS and Nemo rolling on RHEL and CentOS is available for the tinkerer [in the repo](https://github.com/NimbleStorage/Nemo/tree/master/runtime/docker-v2#other-distributions). 

This is what a "get to know Nemo session" could look like on an Ubuntu server provisioned with `docker-machine`:
```
gem:~ mmattsson$ docker-machine create --driver generic --generic-ssh-port=22 --generic-ssh-user=vagrant --generic-ip-address=192.168.59.131 --generic-ssh-key=.vagrant/machines/default/vmware_fusion/private_key nemo
Running pre-create checks...
Creating machine...
(nemo) Importing SSH key...
Waiting for machine to be running, this may take a few minutes...
Detecting operating system of created instance...
Waiting for SSH to be available...
Detecting the provisioner...
Provisioning with ubuntu(systemd)...
Installing Docker...
Copying certs to the local machine directory...
Copying certs to the remote machine...
Setting Docker configuration on the remote daemon...
Checking connection to Docker...
Docker is up and running!
To see how to connect your Docker Client to the Docker Engine running on this virtual machine, run: docker-machine env nemo
```
```
gem:~ mmattsson$ eval $(docker-machine env nemo)
```
```
gem:~ mmattsson$ docker version
Client:
 Version:           18.06.0-ce
 API version:       1.38
 Go version:        go1.10.3
 Git commit:        0ffa825
 Built:             Wed Jul 18 19:05:26 2018
 OS/Arch:           darwin/amd64
 Experimental:      false

Server:
 Engine:
  Version:          18.06.1-ce
  API version:      1.38 (minimum version 1.12)
  Go version:       go1.10.3
  Git commit:       e68fc7a
  Built:            Tue Aug 21 17:23:15 2018
  OS/Arch:          linux/amd64
  Experimental:     false
```
```
gem:~ mmattsson$ docker plugin install --alias nemo --grant-all-permissions nimblestorage/nemo:1.0.0
1.0.0: Pulling from nimblestorage/nemo
6ff473112dfe: Download complete 
Digest: sha256:8f256853b8d2a97aa233938f93ac69686be4f5a280c7372e2cd672898519828c
Status: Downloaded newer image for nimblestorage/nemo:1.0.0
Installed plugin nimblestorage/nemo:1.0.0
```
```
gem:~ mmattsson$ docker volume create -d nemo myvol1
myvol1
```
```
gem:~ mmattsson$ docker volume inspect myvol1
[
    {
        "CreatedAt": "2018-09-26T16:13:10Z",
        "Driver": "nemo:latest",
        "Labels": {},
        "Mountpoint": "",
        "Name": "myvol1",
        "Options": {},
        "Scope": "local",
        "Status": {
            "ApplicationCategory": "Virtual Server",
            "CachePinned": "false",
            "CachingEnabled": "true",
            "Connections": "0",
            "DedupeEnabled": "false",
            "Description": "Docker knows this dataset as myvol1",
            "EncryptionCipher": "none",
            "Folder": "",
            "Group": "nemo",
            "LimitIOPS": "-1",
            "LimitMBPS": "-1",
            "LimitSnapPercentOfSize": "-1",
            "LimitVolPercentOfSize": "100",
            "PerfPolicy": "DockerDefault",
            "Pool": "default",
            "SnapUsageMiB": "0",
            "Snapshots": [],
            "ThinlyProvisioned": "true",
            "VolSizeMiB": 10240,
            "VolUsageMiB": 0,
            "destroyOnDetach": "false",
            "destroyOnRm": "false",
            "mountConflictDelay": "30"
        }
    }
]
```
```
gem:~ mmattsson$ docker run --rm -it -v myvol1:/data bash
Unable to find image 'bash:latest' locally
latest: Pulling from library/bash
4fe2ade4980c: Pull complete 
ec6d9ca5c66a: Pull complete 
d8685fbd86ca: Pull complete 
Digest: sha256:8634afcddefc8a10565b22d685df782058b096712a91bf45d75633f368dda729
Status: Downloaded newer image for bash:latest
bash-4.4# df -h /data
Filesystem                Size      Used Available Use% Mounted on
tank/v2/myvol1           10.0G    128.0K     10.0G   0% /data
bash-4.4# touch /data/myfile.txt
bash-4.4# exit
```
```
gem:~ mmattsson$ docker volume create -d nemo -o cloneOf=myvol1 myvol1-clone
myvol1-clone
```
```
gem:~ mmattsson$ docker run --rm -it -v myvol1-clone:/data bash
bash-4.4# ls /data
myfile.txt
```
In this simple workflow:
* A docker-machine was setup and the Nemo managed Docker Volume plugin was installed
* A default 10GiB volume got created
* A file was created on the volume
* A clone of the volume was created and attached to a new container

The exact same workflow, along with several others, is available with the HPE Nimble Storage Docker Volume plugin. 

**Note:** By default Nemo creates a pool on a loopback device mapped to a 64GiB file in `/var/lib/nemo` on the host.

# Plenty of fish in the sea
One might wonder if Nemo is compatible with [Dory](https://github.com/hpe-storage/dory)? That is a given! Nemo fully implements the Docker Volume API, `dory` and `doryd` pretty much work stock with the exception that certain defaults needs to be overridden. More details on the Kubernetes integration is available [in the repo](https://github.com/NimbleStorage/Nemo/tree/master/runtime/k8s).

Example setup procedures for Kubernetes:
```
gem:~ mmattsson$ kubectl create -f https://raw.githubusercontent.com/NimbleStorage/Nemo/master/runtime/k8s/daemonset-nemod.yaml
daemonset.apps/nemod created
```
```
gem:~ mmattsson$ kubectl create -f https://raw.githubusercontent.com/NimbleStorage/Nemo/master/runtime/k8s/deploy-doryd.yaml
clusterrole.rbac.authorization.k8s.io/doryd created
clusterrolebinding.rbac.authorization.k8s.io/doryd created
serviceaccount/doryd created
deployment.extensions/kube-storage-controller-doryd created
```

The cluster is now ready to create Storage Classes, Persistent Volume Claims or use the FlexVolume driver inline. A `StorageClass` and `StatefulSet` example is provided:
```
gem:~ mmattsson$ kubectl create -f https://raw.githubusercontent.com/NimbleStorage/Nemo/master/runtime/k8s/sc-transactionaldb.yaml
storageclass.storage.k8s.io/transactionaldb created
```
```
gem:~ mmattsson$ kubectl create -f https://raw.githubusercontent.com/NimbleStorage/Nemo/master/runtime/k8s/statefulset-mariadb.yaml
secret/mariadb created
statefulset.apps/mariadb created
service/mariadb created
```

The `PersistentVolumeClaim` created by the `volumeClaimTemplate` part of the `StatefulSet` can be inspect with `kubectl`:
```
gem:~ mmattsson$ kubectl get -o yaml pvc/mariadb-mariadb-0
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  annotations:
    pv.kubernetes.io/bind-completed: "yes"
    pv.kubernetes.io/bound-by-controller: "yes"
  creationTimestamp: 2018-09-28T00:03:06Z
  finalizers:
  - kubernetes.io/pvc-protection
  labels:
    app: mariadb
  name: mariadb-mariadb-0
  namespace: default
  resourceVersion: "111181"
  selfLink: /api/v1/namespaces/default/persistentvolumeclaims/mariadb-mariadb-0
  uid: e0572150-c2b1-11e8-a34c-000c290a512a
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
  storageClassName: transactionaldb
  volumeName: transactionaldb-e0572150-c2b1-11e8-a34c-000c290a512a
status:
  accessModes:
  - ReadWriteOnce
  capacity:
    storage: 1Gi
  phase: Bound
```

Due to the nature of Nemo attaching to local storage only, Pods and StatefulSets are the most common patterns for deploying stateful applications with. In single node clusters, like the one I used to create these examples, Replication Controllers and Deployments would also work as expected.

# Next steps
We are simply testing the waters with Nemo (pun intended) to figure out if this could be helpful for developers who wants to learn about Advanced Data Services. Further, understand how to integrate those services into CI/CD pipelines, kick the tires on lifting & shifting an application or validate more traditional workflows where you would provide production data to developers for Copy Data Management in containerized environments.

Please feel free to give it a whirl and don't be afraid to reach out on [Slack](https://www.labs.hpe.com/slack) or file any issues you may find on [GitHub](https://github.com/NimbleStorage/Nemo).