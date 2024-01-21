---
title: How to backup and restore stateful applications on Kubernetes using
  Kasten K10 in HPE GreenLake for Private Cloud Enterprise
date: 2024-01-18T07:33:24.381Z
author: Guoping Jia
authorimage: /img/guoping.png
disable: false
---
T﻿his blog post describes how to backup and restore using Kasten K10 the stateful applications running in a Kubernetes (K8s) cluster in HPE GreenLake for Private Cloud Enterprise. Using pre-installed HPE CSI driver for K8s in the cluster, Kasten K10 works seamlessly for 

### Prerequisites

Before starting, make sure you meet the following requirements:

<style> li { font-size: 100%; line-height: 23px; max-width: none; } </style>

* A K8s cluster, being provisioned in HPE GreenLake for Private Cloud Enterprise
* The kubectl CLI tool, together with the kubeconfig file for accessing the K8s cluster
* The o﻿ptional mysql CLI tool, for accessing the deployed sample MySQL database service

### HPE CSI driver for K8s

The Container Storage Interface (CSI) defines a standard interface for container orchestration systems, like K8s, to expose arbitrary block and file storage systems to their containerized workloads. Support for CSI in K8s was introduced as *alpha* in its v1.9 release, and promoted to *beta* in its v1.10 release. Since v1.13 release, the implementation of the CSI has been in *GA* in K8s. With the adoption of CSI, the K8s volume layer becomes truly extensible. Using CSI, 3rd party storage providers, such as HPE,  can write and deploy plugins exposing new storage systems in K8s without ever having to touch the core K8s code. This gives K8s users more options for storage and makes the system more secure and reliable.


A CSI driver for K8s is a plugin that allows K8s to access different types of storage systems, such as Azure Disks, AWS EBS, and HPE Storage, etc. HPE CSI driver for K8s is one of those CSI driver plugins that follows the K8s CSI specification and enables K8s to use various HPE storage systems, such as Nimble Storage, 3PAR and Primera. 

As part of K8s cluster provisioning in HPE GreenLake for Private Cloud Enterprise, HPE CSI driver for K8s has been installed on the cluster. The installation consists of two components, a _controller_ component and a _per-node_ component. The controller component is deployed as a *Deployment* on any node in the K8s cluster. It implements the CSI Controller service and a list of sidecar containers, such as _external-provisioner_, _external-attacher_, _external-snapshotter_, and _external-resizer_, etc. These controller sidecar containers typically interact with K8s objects, make calls to the driver’s CSI Controller service, manage K8s events and make the appropriate calls to the CSI driver. The per-node component is deployed on every node in the cluster through a _DaemonSet_. It implements the CSI Node service and the _node-driver-registrar_ sidecar container that registers the CSI driver to kubelet running on every cluster node and being responsible for making the CSI Node service calls. These calls mount and unmount the storage volume from the HPE storage system, making it available to the Pod to consume.   


As part of HPE CSI driver configuration, a list of _StorageClasses_ is created that refers to the CSI driver name. The _PersistentVolumeClaim_ (PVCs) can then be created that uses the _StorageClass_ to dynamically provision persisten volume backed by the HPE storage systems. 

Apart from features such as dynamic provisioning, raw block volumes, inline ephemeral volumes, and volume encryption, HPE CSI driver implements and supports volume snapshot on K8s cluster. The common snapshot controller _snapshot-controller_ and a _VolumeSnapshotClass_, together with a list of snapshot CustomResourceDefinitions (CRDs), gets deployed and added to the cluster.  
 
The following shows the details about deployed HPE CSI driver for K8s in the cluster to the namespace *hpe-storage*: 
 
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
### Install Kasten K10

```markdown
$ helm repo add kasten https://charts.kasten.io/
$ helm repo update





$ helm install k10 kasten/k10 --namespace=kasten-io --create-namespace
NAME: k10
LAST DEPLOYED: Thu Jan 18 22:34:17 2024
NAMESPACE: kasten-io
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
Thank you for installing Kasten\u2019s K10 Data Management Platform 6.5.2!

Documentation can be found at https://docs.kasten.io/.

How to access the K10 Dashboard:

To establish a connection to it use the following `kubectl` command:

`kubectl --namespace kasten-io port-forward service/gateway 8080:8000`

The Kasten dashboard will be available at: `http://127.0.0.1:8080/k10/#/`
```

T﻿he Kasten K10 will be installed to the the namespace *kasten-io* in cluster. Helm installs a list of Pods to the namespace. It takes a while before all those Pods start and running. Typing the following command to keep checking Pod states to be sure they are all in running status:

```markdown
$ k get pods -n kasten-io -w
NAME                                    READY   STATUS    RESTARTS   AGE
aggregatedapis-svc-6fc8fcf7bd-cdw8p     1/1     Running   0          15m
auth-svc-6fcb76d7df-pt748               1/1     Running   0          15m
catalog-svc-7c6f8b76fb-bsdqn            2/2     Running   0          15m
controllermanager-svc-5fffc97d7-b5whv   1/1     Running   0          15m
crypto-svc-8568584f9f-br8kn             4/4     Running   0          15m
dashboardbff-svc-b58b6d8cd-gnt5n        2/2     Running   0          15m
executor-svc-cb5fd4698-7zqjg            1/1     Running   0          15m
executor-svc-cb5fd4698-n27d5            1/1     Running   0          15m
executor-svc-cb5fd4698-rvj4v            1/1     Running   0          15m
frontend-svc-6c5677595b-9tsmj           1/1     Running   0          15m
gateway-54d778c955-n9wt5                1/1     Running   0          15m
jobs-svc-668b76cb86-q27nk               1/1     Running   0          15m
k10-grafana-889ff545b-g7px7             1/1     Running   0          15m
kanister-svc-76cdb967bd-hkhql           1/1     Running   0          15m
logging-svc-79599589f6-hdsp5            1/1     Running   0          15m
metering-svc-55f84f7766-rsm5f           1/1     Running   0          15m
prometheus-server-689ccf5f57-j9hpz      2/2     Running   0          15m
state-svc-b4b996d9b-jnbrl               3/3     Running   0          15m
```

A﻿fter all the Pods are in running states, edit the service *gateway* to change its service type from *ClusterIP* to *NodePort*:

```markdown
$ k edit svc gateway -n kasten-io
…
spec:
  clusterIP: 10.102.36.25
  clusterIPs:
  - 10.102.36.25
  externalTrafficPolicy: Cluster
  internalTrafficPolicy: Cluster
  ipFamilies:
  - IPv4
  ipFamilyPolicy: SingleStack
  ports:
  - name: http
    nodePort: 31334
    port: 8000
    protocol: TCP
    targetPort: 8000
  selector:
    service: gateway
  sessionAffinity: None
  type: NodePort
…
service/gateway edited
```



```markdown
$ kubectl get svc gateway -n kasten-io -o jsonpath={.metadata.annotations.hpecp-internal-gateway/8000}
gl-tor-upc-cp-gw-node1.customer.yyz.gl-hpe.local:10021
```

T﻿he Kasten K10 service dashboard can be accessed by pointing the URL *http://gl-tor-upc-cp-gw-node1.customer.yyz.gl-hpe.local:10021/k10/#/* in the browser:

![](/img/k10-login.png)

![](/img/k10-dashboard.png)

![](/img/k10-backup.png)

![](/img/k10-data-backup.png)

![](/img/k10-dashboard-backup.png)

![](/img/k10-restore.png)

![](/img/k10-dashboard-restore.png)

### Deploy MySQL database

I﻿n order to show backup and restore process, [a MySQL database](https://github.com/GuopingJia/mysql-app) will be deployed as a sample stateful application to the cluster.
 
MySQL database requires a persistent volume to store data. Here is the PVC YAML manifest files: 

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

The YAML manifest files in the folder *base* will be used to install the WordPress applicaiton using [Kustomize](https://kustomize.io/).

```markdown
$ tree mysql-app/base
mysql-app/base
├── kustomization.yaml
├── mysql-deployment.yaml
└── mysql-pvc.yaml
```
The file kustomization.yaml lists all YAML files in its resources section, together with the secret generator for MySQL password:

```markdown
$ cat mysql-app/base/kustomization.yaml 
secretGenerator:
- name: mysql-pass
  namespace: wordpress
  literals:
  - password=CfeDemo@123
resources:
  - mysql-deployment.yaml
  - mysql-pvc.yaml

```

T﻿yping below command to install the MySQL application to the namespace *mysql*:

```markdown
$ kubectl apply -k mysql-app/base
namespace/mysql created
secret/mysql-pass-m62cbhd9kf created
service/mysql created
persistentvolumeclaim/mysql-pvc created
deployment.apps/mysql created

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

Y﻿ou can check the PVC and the PV created as part of application deployment:

```markdown
$ kubectl get persistentvolumes 
NAME                                       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                                                                                                                 STORAGECLASS               REASON   AGE

pvc-3e55e9b3-097f-4ddf-bdcb-60825a7905ec   1Gi        RWO            Delete           Bound    mysql/mysql-pvc                                                                                                                           

$ kubectl get persistentvolumeclaims -n mysql
NAME        STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS               AGE
mysql-pvc   Bound    pvc-3e55e9b3-097f-4ddf-bdcb-60825a7905ec   1Gi        RWO            gl-sbp-frank-gl1-sstor01   9m50s
```

In order to access MySQL database service using the mysql CLI, set first the port-forward of _service/mysql_:   

```markdown
$ k port-forward service/mysql -n mysql :3306
Forwarding from 127.0.0.1:42281 -> 3306
Forwarding from [::1]:42281 -> 3306
Handling connection for 42281
```

The d﻿eployed MySQL database service can be accessed by typing the following mysql command:

```markdown
$ mysql -h 127.0.0.1 -uroot -pCfeDemo@123 -P 42281
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
| mysql              |
| performance_schema |
+--------------------+
3 rows in set (0,282 sec)
```

The MySQL database repo has the *test* folder that contains a list of scripts for populating data records and testing the contents. 

T﻿yping the following command to populate a sample *employees* data to the database:

```markdown


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

T﻿he added sample data records *employees* can be checked and verified by below commands:

```markdown
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


```markdown

```