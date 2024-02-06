---
title: Getting started with volume snapshots on a Kubernetes cluster in HPE
  GreenLake for Private Cloud Enterprise
date: 2024-01-23T14:24:28.483Z
author: Guoping Jia
authorimage: /img/guoping.png
disable: false
tags:
  - Kubernetes
  - Persistent volumes
  - Volume snapshots
  - HPE CSI driver for Kubernetes
  - Stateful application
  - Backup and restore
  - HPE GreenLake for Private Cloud Enterprise
  - hpe-greenlake-for-private-cloud-enterprise
---
<style> li { font-size: 27px; line-height: 33px; max-width: none; } </style>

### Overview



[HPE GreenLake for Private Cloud Enterprise: Containers](https://www.hpe.com/us/en/greenlake/containers.html) ("containers service"), one of the HPE GreenLake cloud services available on the HPE GreenLake for Private Cloud Enterprise, allows customers to create a Kubernetes (K8s) cluster, view details about existing clusters, and deploy containerized applications to the cluster. It provides an enterprise-grade container management service using open source K8s.  

In this blog post, I discuss first the persistent volumes and volume snapshots in K8s. Then, I describe the Container Storage Interface (CSI) and HPE CSI driver for K8s in HPE GreenLake for Private Cloud Enterprise. With a MySQL database instance deployed as a sample stateful application using persistent volume in the cluster, I show the detailed steps used to create a volume snapshot of the database as a backup using HPE CSI driver for K8s. Finally, I demonstrate how to restore the MySQL database using the created volume snapshot.

### Persistent volumes and volume snapshots  



In K8s, a persistent volume (PV) is a piece of storage in the cluster that has been provisioned, either statically by an administrator or dynamically using *StorageClasses*. It provides a way for data to persist beyond the lifecycle of individual Pods. PV provides the necessary data persistence for stateful applications, ensuring that they function correctly even in the event of Pod or node failures. It's a key component in managing storage in K8s. As such, backing up PVs has become a critical aspect of managing stateful applications in K8s.



A volume snapshot is a copy of the data stored in a PV in K8s at a specific point in time. It provides the ability to create a snapshot of a PV from stateful applications. A volume snapshot can be used to back up data from a PV, restore a PV from a previous state, or create a new PV from a snapshot. A volume snapshot provides K8s users with a standardized way to copy the contents of a PV at a particular point in time without creating an entirely new volume. As an example of how this is used, this functionality can enable database administrators to backup databases before performing edit or delete modifications.



Support of volume snapshots in K8s is only available for CSI driver deployed in the cluster. 

### HPE CSI driver for K8s



The CSI defines a standard interface for container orchestration systems, like K8s, to expose arbitrary block and file storage systems to their containerized workloads. Support for CSI in K8s was introduced as *alpha* in its v1.9 release, and promoted to *beta* in its v1.10 release. Implementation of the CSI has been in *GA* in K8s since v1.13 release. With the adoption of CSI, the K8s volume layer becomes truly extensible. Using CSI, 3rd party storage providers, such as HPE,  can write and deploy plugins exposing new storage systems in K8s without ever having to touch the core K8s code. This gives K8s users more options for storage and makes the system more secure and reliable.




A CSI driver for K8s is a plugin that allows K8s to access different types of storage systems, such as *Azure Disks*, *AWS EBS*, and *HPE Storage*, etc. HPE CSI driver for K8s is one of those CSI driver plugins that follows the K8s CSI specification and enables K8s to use various HPE storage systems, such as *Nimble Storage*, *3PAR* and *Primera*. 



As part of K8s cluster provisioning in HPE GreenLake for Private Cloud Enterprise, HPE CSI driver for K8s has been installed in the cluster. The installation consists of two components, a _controller_ component and a _per-node_ component. 

1. The controller component is deployed as a *Deployment* on any node in the K8s cluster. It implements the CSI Controller service and a list of sidecar containers, such as _external-provisioner_, _external-attacher_, _external-snapshotter_, and _external-resizer_, etc. These controller sidecar containers typically interact with K8s objects, make calls to the driver’s CSI Controller service, manage K8s events and make the appropriate calls to the CSI driver.

2. The per-node component is deployed as a _DaemonSet_ on every node in the cluster. It implements the CSI Node service, together with the _node-driver-registrar_ sidecar container, which registers the CSI driver to kubelet that runs on every cluster node and is responsible for making the CSI Node service calls. These calls mount and unmount the storage volume from the HPE storage system, making it available to the Pod to consume.

Details about the deployed HPE CSI driver for K8s in the cluster to its namespace *hpe-storage* are shown below:
 
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




As part of HPE CSI driver configuration, a list of _StorageClasses_ is created that refers to the CSI driver name. The _PersistentVolumeClaim_ (PVC) can then be created, which uses the _StorageClass_ to dynamically provision a PV backed by the HPE storage systems. Apart from features such as dynamic provisioning, raw block volumes, inline ephemeral volumes, and volume encryption, HPE CSI driver implements and supports volume snapshot on a K8s cluster. As you can see in above deployment, the common snapshot controller _snapshot-controller_ and a _VolumeSnapshotClass_, together with a list of snapshot *CustomResourceDefinitions* (CRDs), all get deployed and added to the cluster.
 


Here is the list of _StorageClasses_ and the _VolumeSnapshotClass_ created in this cluster:



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
 
Now that you understand the basics, in﻿ the following sections, I will describe how to create volume snapshots of persistent volumes in K8s using the HPE CSI driver for K8s.  

### Prerequisites



Before starting, make sure you have the following:





* A K8s cluster, being provisioned in HPE GreenLake for Private Cloud Enterprise
* The kubectl CLI tool, together with the kubeconfig file for accessing the K8s cluster
* The o﻿ptional mysql CLI tool, for accessing the deployed sample MySQL database service

### Deploy MySQL database



B﻿efore showing the volume snapshots, a MySQL database instance from [my GitHub repo](https://github.com/GuopingJia/mysql-app) will be deployed as a sample stateful application to the cluster. 


**1﻿. Install MySQL database**



MySQL database requires a persistent volume to store data. Here you can see the PVC YAML manifest file *mysql-pvc.yaml* in the repo's *base* folder:



```markdown


$ cat mysql-app/base/mysql-pvc.yaml 
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-pvc
  namespace: mysql
  labels:
    app: mysql
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi

```



This PVC file, together with other YAML manifest files in the folder *base*, will be used to install a MySQL database instance using [Kustomize](https://kustomize.io/). 



```markdown
 $ tree mysql-app/base
mysql-app/base
├── kustomization.yaml
├── mysql-deployment.yaml
└── mysql-pvc.yaml
```



The file *kustomization.yaml* lists all YAML files in its resources section, together with the secret generator for the MySQL password:



```markdown
$ cat mysql-app/base/kustomization.yaml
secretGenerator:
- name: mysql-pass
  namespace: mysql
  literals:
  - password=CfeDemo@123
resources:
  - mysql-deployment.yaml
  - mysql-pvc.yaml

```



T﻿ype command shown below to install the MySQL database to the namespace *mysql*:



```shell
$ kubectl apply -k mysql-app/base
namespace/mysql created
secret/mysql-pass-m62cbhd9kf created
service/mysql created
persistentvolumeclaim/mysql-pvc created
deployment.apps/mysql created


```

T﻿ype the following command to check the MySQL database deployment state. The MySQL Pod should be in *Running* status:

```shell
$ kubectl get all -n mysql
NAME                         READY   STATUS    RESTARTS   AGE
pod/mysql-6974b58d48-wb8g5   1/1     Running   0          14s

NAME            TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
service/mysql   ClusterIP   None         <none>        3306/TCP   24s

NAME                    READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/mysql   1/1     1            1           23s

NAME                               DESIRED   CURRENT   READY   AGE
replicaset.apps/mysql-6974b58d48   1         1         1       24s
```



Y﻿ou can check that the PVC and the PV are created as part of the MySQL database deployment:



```markdown
$ kubectl get persistentvolumes 
NAME                                       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                                                                                                                 STORAGECLASS               REASON   AGE

pvc-3e55e9b3-097f-4ddf-bdcb-60825a7905ec   1Gi        RWO            Delete           Bound    mysql/mysql-pvc    
                                                                                                                       

$ kubectl get persistentvolumeclaims -n mysql
NAME        STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS               AGE
mysql-pvc   Bound    pvc-3e55e9b3-097f-4ddf-bdcb-60825a7905ec   1Gi        RWO            gl-sbp-frank-gl1-sstor01   9m50s
```



**2﻿. Access MySQL database**



In order to access the MySQL database service using the mysql CLI, you must first set the port-forward of _service/mysql_:
 

```markdown
$ kubectl port-forward service/mysql -n mysql :3306
Forwarding from 127.0.0.1:41797 -> 3306
Forwarding from [::1]:41797 -> 3306
```



The d﻿eployed MySQL database service can be accessed by typing the following mysql command:



```shell
$ mysql -h 127.0.0.1 -uroot -pCfeDemo@123 -P 41797 
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MySQL connection id is 1
Server version: 5.6.51 MySQL Community Server (GPL)

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MySQL [(none)]> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
+--------------------+
3 rows in set (0,237 sec)
```



**3﻿. Populate MySQL database**



The MySQL application repo has a *test* folder that contains a list of scripts for populating data records and testing the contents: 



```shell
$ tree mysql-app/test
mysql-app/test
├── employees.sql
├── load_departments.dump
├── load_dept_emp.dump
├── load_dept_manager.dump
├── load_employees.dump
├── load_salaries1.dump
├── load_salaries2.dump
├── load_salaries3.dump
├── load_titles.dump
├── show_elapsed.sql
├── test_employees_md5.sql
└── test_employees_sha.sql
```



Type the following command to populate a sample *employees* data to the MySQL database:



```shell
$ cd mysql-app/test
$ mysql -h 127.0.0.1 -uroot -pCfeDemo@123 -P 41797 < employees.sql
INFO
CREATING DATABASE STRUCTURE
INFO
storage engine: InnoDB
INFO
LOADING departments
INFO
LOADING employees
INFO
LOADING dept_emp
INFO
LOADING dept_manager
INFO
LOADING titles
INFO
LOADING salaries
data_load_time_diff
NULL
```



The added sample data records called *employees* can be checked and verified by running the commands shown below:



```shell
$ mysql -h 127.0.0.1 -uroot -pCfeDemo@123 -P 41797 
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MySQL connection id is 3
Server version: 5.6.51 MySQL Community Server (GPL)

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MySQL [(none)]> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| employees          |
| mysql              |
| performance_schema |
+--------------------+
4 rows in set (0,237 sec)





$ mysql -h 127.0.0.1 -uroot -pCfeDemo@123 -P 41797 -t < test_employees_sha.sql
+----------------------+
| INFO                 |
+----------------------+
| TESTING INSTALLATION |
+----------------------+
+--------------+------------------+------------------------------------------+
| table_name   | expected_records | expected_crc                             |
+--------------+------------------+------------------------------------------+
| departments  |                9 | 4b315afa0e35ca6649df897b958345bcb3d2b764 |
| dept_emp     |           331603 | d95ab9fe07df0865f592574b3b33b9c741d9fd1b |
| dept_manager |               24 | 9687a7d6f93ca8847388a42a6d8d93982a841c6c |
| employees    |           300024 | 4d4aa689914d8fd41db7e45c2168e7dcb9697359 |
| salaries     |          2844047 | b5a1785c27d75e33a4173aaa22ccf41ebd7d4a9f |
| titles       |           443308 | d12d5f746b88f07e69b9e36675b6067abb01b60e |
+--------------+------------------+------------------------------------------+
+--------------+------------------+------------------------------------------+
| table_name   | found_records    | found_crc                                |
+--------------+------------------+------------------------------------------+
| departments  |                9 | 4b315afa0e35ca6649df897b958345bcb3d2b764 |
| dept_emp     |           331603 | d95ab9fe07df0865f592574b3b33b9c741d9fd1b |
| dept_manager |               24 | 9687a7d6f93ca8847388a42a6d8d93982a841c6c |
| employees    |           300024 | 4d4aa689914d8fd41db7e45c2168e7dcb9697359 |
| salaries     |          2844047 | b5a1785c27d75e33a4173aaa22ccf41ebd7d4a9f |
| titles       |           443308 | d12d5f746b88f07e69b9e36675b6067abb01b60e |
+--------------+------------------+------------------------------------------+
+--------------+---------------+-----------+
| table_name   | records_match | crc_match |
+--------------+---------------+-----------+
| departments  | OK            | ok        |
| dept_emp     | OK            | ok        |
| dept_manager | OK            | ok        |
| employees    | OK            | ok        |
| salaries     | OK            | ok        |
| titles       | OK            | ok        |
+--------------+---------------+-----------+
+------------------+
| computation_time |
+------------------+
| 00:00:27         |
+------------------+
+---------+--------+
| summary | result |
+---------+--------+
| CRC     | OK     |
| count   | OK     |
+---------+--------+
```



### Create volume snapshot



H﻿ere is the *VolumeSnapshot* YAML manifest file that creates a volume snapshot from the source PVC *'mysql-pvc'*:



```markdown
$ cat volumesnapshot.yaml 
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: mysql-snapshot
  namespace: mysql
spec:
  volumeSnapshotClassName: gl-sbp-frank-gl1-sstor01
  source:
persistentVolumeClaimName: mysql-pvc
```



T﻿ype the following command to create the volume snapshot:



```markdown
$ kubectl apply -f volumesnapshot.yaml 
volumesnapshot.snapshot.storage.k8s.io/mysql-snapshot created
```



Y﻿ou can check that a *VolumeSnapshot* *'mysql-snapshot'* is created in the namespace *mysql* together with a *VolumeSnapshotContent* object created at cluster level. The *READYTOUSE* of the *VolumeSnapshot* should show as *true*:



```markdown
$ kubectl get volumesnapshot -n mysql
NAME             READYTOUSE   SOURCEPVC   SOURCESNAPSHOTCONTENT   RESTORESIZE   SNAPSHOTCLASS              SNAPSHOTCONTENT                                    CREATIONTIME   AGE
mysql-snapshot   true         mysql-pvc                           1Gi           gl-sbp-frank-gl1-sstor01   snapcontent-41de6346-1ba3-4ce7-9483-2ca074e476a2   2m21s          2m22s


$ kubectl get volumesnapshotcontents
NAME                                               READYTOUSE   RESTORESIZE   DELETIONPOLICY   DRIVER        VOLUMESNAPSHOTCLASS        VOLUMESNAPSHOT                  VOLUMESNAPSHOTNAMESPACE   AGE
snapcontent-41de6346-1ba3-4ce7-9483-2ca074e476a2   true         1073741824    Delete           csi.hpe.com   gl-sbp-frank-gl1-sstor01   mysql-snapshot                  mysql                     2m50s

```



### Restore MySQL database using volume snapshot



B﻿efore showing the database restore, I﻿ will first delete a table from MySQL database to simulate a loss of data. Then, I will perform the database recovery from the created volume snapshot. 
 


#### Delete table



```shell
$ mysql -h 127.0.0.1 -uroot -pCfeDemo@123 -P 41797 
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MySQL connection id is 5
Server version: 5.6.51 MySQL Community Server (GPL)

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MySQL [(none)]> use employees;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
MySQL [employees]> show tables;
+----------------------+
| Tables_in_employees  |
+----------------------+
| current_dept_emp     |
| departments          |
| dept_emp             |
| dept_emp_latest_date |
| dept_manager         |
| employees            |
| salaries             |
| titles               |
+----------------------+
8 rows in set (0,237 sec)

MySQL [employees]> delete from departments;
Query OK, 9 rows affected (1,523 sec)
```



I﻿f you rerun the testing script *test_employees_sha.sql*, it will show the failures of *CRC* and *count*, which indicate the loss of data in the MySQL database:



```shell
$ mysql -h 127.0.0.1 -uroot -pCfeDemo@123 -P 41797 -t <test_employees_sha.sql
+----------------------+
| INFO                 |
+----------------------+
| TESTING INSTALLATION |
+----------------------+
+--------------+------------------+------------------------------------------+
| table_name   | expected_records | expected_crc                             |
+--------------+------------------+------------------------------------------+
| departments  |                9 | 4b315afa0e35ca6649df897b958345bcb3d2b764 |
| dept_emp     |           331603 | d95ab9fe07df0865f592574b3b33b9c741d9fd1b |
| dept_manager |               24 | 9687a7d6f93ca8847388a42a6d8d93982a841c6c |
| employees    |           300024 | 4d4aa689914d8fd41db7e45c2168e7dcb9697359 |
| salaries     |          2844047 | b5a1785c27d75e33a4173aaa22ccf41ebd7d4a9f |
| titles       |           443308 | d12d5f746b88f07e69b9e36675b6067abb01b60e |
+--------------+------------------+------------------------------------------+
+--------------+------------------+------------------------------------------+
| table_name   | found_records    | found_crc                                |
+--------------+------------------+------------------------------------------+
| departments  |                0 |                                          |
| dept_emp     |                0 |                                          |
| dept_manager |                0 |                                          |
| employees    |           300024 | 4d4aa689914d8fd41db7e45c2168e7dcb9697359 |
| salaries     |          2844047 | b5a1785c27d75e33a4173aaa22ccf41ebd7d4a9f |
| titles       |           443308 | d12d5f746b88f07e69b9e36675b6067abb01b60e |
+--------------+------------------+------------------------------------------+
+--------------+---------------+-----------+
| table_name   | records_match | crc_match |
+--------------+---------------+-----------+
| departments  | not ok        | not ok    |
| dept_emp     | not ok        | not ok    |
| dept_manager | not ok        | not ok    |
| employees    | OK            | ok        |
| salaries     | OK            | ok        |
| titles       | OK            | ok        |
+--------------+---------------+-----------+
+------------------+
| computation_time |
+------------------+
| 00:00:24         |
+------------------+
+---------+--------+
| summary | result |
+---------+--------+
| CRC     | FAIL   |
| count   | FAIL   |
+---------+--------+
```



#### Perform MySQL database restore



**1﻿. Scale MySQL database deployment config to 0**



Before starting the MySQL database restore, you first need to stop the mysql Pod by scaling the replicas in the MySQL deployment to 0: 



```markdown
$ kubectl scale deployment.apps/mysql -n mysql --replicas=0
deployment.apps/mysql scaled
```



T﻿ype the following command to check that the MySQL database deployment has 0 replica:



```markdown
$ kubectl get all -n mysql
NAME            TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
service/mysql   ClusterIP   None         <none>        3306/TCP   28m

NAME                    READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/mysql   0/0     0            0           28m

NAME                               DESIRED   CURRENT   READY   AGE
replicaset.apps/mysql-6974b58d48   0         0         0       28m
```



**2﻿. Create a new PVC using volume snapshot**



Here is the PVC YAML manifest file that creates a new PVC *mysql-pvc-restore* from the volume snapshot *mysql-snapshot*:



```shell
$ cat mysql-pvc-restore.yaml 
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-pvc-restore
  namespace: mysql
  labels:
    app: mysql
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
  dataSource:
    name: mysql-snapshot
    kind: VolumeSnapshot
    apiGroup: snapshot.storage.k8s.io



$ kubectl apply -f mysql-pvc-restore.yaml 
persistentvolumeclaim/mysql-pvc-restore created


```



Y﻿ou will see the new PVC *mysql-pvc-restore*, together with its PV, is created:



```shell
$ kubectl get persistentvolumeclaims -n mysql
NAME                STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS               AGE
mysql-pvc           Bound    pvc-3e55e9b3-097f-4ddf-bdcb-60825a7905ec   1Gi        RWO            gl-sbp-frank-gl1-sstor01   33m
mysql-pvc-restore   Bound    pvc-92940c36-eb1d-4de5-9c1e-57261ccbecad   1Gi        RWO            gl-sbp-frank-gl1-sstor01   8s



$ kubectl get persistentvolumes
NAME                                       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                                                                                                                 STORAGECLASS               REASON   AGE

pvc-3e55e9b3-097f-4ddf-bdcb-60825a7905ec   1Gi        RWO            Delete           Bound    mysql/mysql-pvc                                                                                                       gl-sbp-frank-gl1-sstor01            42m
pvc-92940c36-eb1d-4de5-9c1e-57261ccbecad   1Gi        RWO            Delete           Bound    mysql/mysql-pvc-restore                                                                                               gl-sbp-frank-gl1-sstor01            8m48s
```



**3﻿. Edit MySQL deployment config**



T﻿ype the following command to edit the MySQL deployment config and change the PVC name from *mysql-pvc* to *mysql-pvc-restore*: 



```shell
$ kubectl edit deployment.apps/mysql -n mysql
…
      volumes:
      - name: mysql-persistent-storage
        persistentVolumeClaim:
          claimName: mysql-pvc-restore
…

deployment.apps/mysql edited
```



**4﻿. Scale MySQL database deployment config back to 1** 



Start the mysql Pod by scaling the replicas in the MySQL deployment back to 1: 



```shell
$ kubectl scale deployment.apps/mysql -n mysql --replicas=1
deployment.apps/mysql scaled



$ kubectl get all -n mysql
NAME                         READY   STATUS    RESTARTS   AGE
pod/mysql-697499cd4c-k4phg   1/1     Running   0          13s

NAME            TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
service/mysql   ClusterIP   None         <none>        3306/TCP   36m

NAME                    READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/mysql   1/1     1            1           36m

NAME                               DESIRED   CURRENT   READY   AGE
replicaset.apps/mysql-697499cd4c   1         1         1       107s
replicaset.apps/mysql-6974b58d48   0         0         0       36m
```



**5﻿. Verify MySQL database data records**



Y﻿ou can connect to the MySQL database service and rerun the testing script. You should see the testing script now reports everything is *OK*:



```markdown
$ k port-forward service/mysql -n mysql :3306
Forwarding from 127.0.0.1:43959 -> 3306
Forwarding from [::1]:43959 -> 3306
```



```shell
$ mysql -h 127.0.0.1 -uroot -pCfeDemo@123 -P 43959
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MySQL connection id is 1
Server version: 5.6.51 MySQL Community Server (GPL)

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MySQL [(none)]> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| employees          |
| mysql              |
| performance_schema |
+--------------------+
4 rows in set (0,238 sec)




$ mysql -h 127.0.0.1 -uroot -pCfeDemo@123 -P 43959 -t <test_employees_sha.sql 
+----------------------+
| INFO                 |
+----------------------+
| TESTING INSTALLATION |
+----------------------+
+--------------+------------------+------------------------------------------+
| table_name   | expected_records | expected_crc                             |
+--------------+------------------+------------------------------------------+
| departments  |                9 | 4b315afa0e35ca6649df897b958345bcb3d2b764 |
| dept_emp     |           331603 | d95ab9fe07df0865f592574b3b33b9c741d9fd1b |
| dept_manager |               24 | 9687a7d6f93ca8847388a42a6d8d93982a841c6c |
| employees    |           300024 | 4d4aa689914d8fd41db7e45c2168e7dcb9697359 |
| salaries     |          2844047 | b5a1785c27d75e33a4173aaa22ccf41ebd7d4a9f |
| titles       |           443308 | d12d5f746b88f07e69b9e36675b6067abb01b60e |
+--------------+------------------+------------------------------------------+
+--------------+------------------+------------------------------------------+
| table_name   | found_records    | found_crc                                |
+--------------+------------------+------------------------------------------+
| departments  |                9 | 4b315afa0e35ca6649df897b958345bcb3d2b764 |
| dept_emp     |           331603 | d95ab9fe07df0865f592574b3b33b9c741d9fd1b |
| dept_manager |               24 | 9687a7d6f93ca8847388a42a6d8d93982a841c6c |
| employees    |           300024 | 4d4aa689914d8fd41db7e45c2168e7dcb9697359 |
| salaries     |          2844047 | b5a1785c27d75e33a4173aaa22ccf41ebd7d4a9f |
| titles       |           443308 | d12d5f746b88f07e69b9e36675b6067abb01b60e |
+--------------+------------------+------------------------------------------+
+--------------+---------------+-----------+
| table_name   | records_match | crc_match |
+--------------+---------------+-----------+
| departments  | OK            | ok        |
| dept_emp     | OK            | ok        |
| dept_manager | OK            | ok        |
| employees    | OK            | ok        |
| salaries     | OK            | ok        |
| titles       | OK            | ok        |
+--------------+---------------+-----------+
+------------------+
| computation_time |
+------------------+
| 00:00:29         |
+------------------+
+---------+--------+
| summary | result |
+---------+--------+
| CRC     | OK     |
| count   | OK     |
+---------+--------+
```

T﻿his indicates the database restore using the volume snapshot succeeded and the MySQL database data is back!



### Summary


I﻿n this blog post, I described persistent volumes, volume snapshots, and the CSI driver for K8s. Using HPE CSI driver for K8s, I demonstrated how to create a volume snapshot of a MySQL database and how to restore a database using the created volume snapshot in the cluster. The volume snapshot capability can be easily integrated with third-party tools like [Kasten K10 by Veeam](https://www.veeam.com/products/cloud/kubernetes-data-protection.html) as an automatic backup and recovery solution. It can significantly simplify the process and enhance the robustness of data management in a K8s cluster. Feel free to take a look at my blog post [How to backup and restore stateful app using Kasten 10](https://developer.hpe.com/blog/how-to-backup-and-restore-stateful-applications-on-kubernetes-using-kasten-k10-in-hpe-greenlake-for-private-cloud-enterprise/).

Please keep coming back to the [HPE Developer blog]( https://developer.hpe.com/blog/) to learn more about HPE GreenLake for Private Cloud Enterprise.