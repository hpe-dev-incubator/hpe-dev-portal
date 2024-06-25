---
title: Setting up hierarchical namespaces in Kubernetes in HPE GreenLake for
  Private Cloud Enterprise
date: 2024-06-13T08:18:47.600Z
author: Guoping Jia
authorimage: /img/guoping.png
disable: false
tags:
  - HPE GreenLake for Private Cloud Enterprise
  - Kubernetes
  - Namespaces
---
<style> li { font-size: 27px; line-height: 33px; max-width: none; } </style>

This blog post shows the process to set up the hierarchical namespaces in Kubernetes (K8s) in HPE GreenLake for Private Cloud Enterprise. It demonstrates how easy to manage namespace relationships, propagate configurations and resources, and enforce access control policies using the hierarchical namespace in K8s for the cluster administrators. 


### Overview

[HPE GreenLake for Private Cloud Enterprise: Containers](https://www.hpe.com/us/en/greenlake/containers.html), one of the HPE GreenLake cloud services available on the HPE GreenLake for Private Cloud Enterprise, allows customers to create a K8s cluster and deploy containerized applications to the cluster. It provides an enterprise-grade container management service using open source K8s.  

### Prerequisites

Before starting, make sure you have the following:

* A K8s cluster, being provisioned in HPE GreenLake for Private Cloud Enterprise
* The *kubectl* CLI tool, together with the kubeconfig file for accessing the K8s cluster
* The *helm* CLI tool, version 3.12.0 or later
* A domain and a list of subdomains to generate the SSL certificate and host the game applications in the cluster
* The optional *openssl* CLI tool, for validating the generated certificates
* The [Python 3.8 or higher](https://www.python.org/downloads/), and *pip* that’s included by default in Python

### K8s namespaces


```shell
$ kubectl apply -f https://github.com/kubernetes-sigs/hierarchical-namespaces/releases/download/v1.1.0-rc2/default.yaml
namespace/hnc-system created
customresourcedefinition.apiextensions.k8s.io/hierarchicalresourcequotas.hnc.x-k8s.io created
customresourcedefinition.apiextensions.k8s.io/hierarchyconfigurations.hnc.x-k8s.io created
customresourcedefinition.apiextensions.k8s.io/hncconfigurations.hnc.x-k8s.io created
customresourcedefinition.apiextensions.k8s.io/subnamespaceanchors.hnc.x-k8s.io created
role.rbac.authorization.k8s.io/hnc-leader-election-role created
clusterrole.rbac.authorization.k8s.io/hnc-admin-role created
clusterrole.rbac.authorization.k8s.io/hnc-manager-role created
rolebinding.rbac.authorization.k8s.io/hnc-leader-election-rolebinding created
clusterrolebinding.rbac.authorization.k8s.io/hnc-manager-rolebinding created
secret/hnc-webhook-server-cert created
service/hnc-controller-manager-metrics-service created
service/hnc-webhook-service created
deployment.apps/hnc-controller-manager created
mutatingwebhookconfiguration.admissionregistration.k8s.io/hnc-mutating-webhook-configuration created
validatingwebhookconfiguration.admissionregistration.k8s.io/hnc-validating-webhook-configuration created
```


```shell
$ k get all -n hnc-system
NAME                                         READY   STATUS    RESTARTS      AGE
pod/hnc-controller-manager-9b5dbcd48-2268c   1/1     Running   1 (11s ago)   29s

NAME                                             TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
service/hnc-controller-manager-metrics-service   ClusterIP   10.96.255.60   <none>        8080/TCP   32s
service/hnc-webhook-service                      ClusterIP   10.96.73.3     <none>        443/TCP    32s

NAME                                     READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/hnc-controller-manager   1/1     1            1           31s

NAME                                               DESIRED   CURRENT   READY   AGE
replicaset.apps/hnc-controller-manager-9b5dbcd48   1         1         1       32s

```

### Install krew plugin

```shell



$ mktemp -d
/tmp/tmp.n1Bs2iqnlu

$ cd /tmp/tmp.n1Bs2iqnlu
$ OS="$(uname | tr '[:upper:]' '[:lower:]')"
$ echo $OS
linux
$ ARCH="$(uname -m | sed -e 's/x86_64/amd64/' -e 's/\(arm\)\(64\)\?.*/\1\2/' -e 's/aarch64$/a
rm64/')"
$ echo $ARCH
amd64
$ KREW="krew-${OS}_${ARCH}"
$ echo $KREW
krew-linux_amd64
$ curl -fsSLO "https://github.com/kubernetes-sigs/krew/releases/latest/download/${KREW}.tar.gz"
$ ls
krew-linux_amd64.tar.gz
$ tar zxvf "${KREW}.tar.gz"
./LICENSE
./krew-linux_amd64
$ ./krew-linux_amd64 install krew
Adding "default" plugin index from https://github.com/kubernetes-sigs/krew-index.git.
Updated the local copy of plugin index.
Installing plugin: krew
Installed plugin: krew
\
| Use this plugin:
|      kubectl krew
| Documentation:
|      https://krew.sigs.k8s.io/
| Caveats:
| \
|  | krew is now installed! To start using kubectl plugins, you need to add
|  | krew's installation directory to your PATH:
|  |
|  |   * macOS/Linux:
|  |     - Add the following to your ~/.bashrc or ~/.zshrc:
|  |         export PATH="${KREW_ROOT:-$HOME/.krew}/bin:$PATH"
|  |     - Restart your shell.
|  |
|  |   * Windows: Add %USERPROFILE%\.krew\bin to your PATH environment variable
|  |
|  | To list krew commands and to get help, run:
|  |   $ kubectl krew
|  | For a full list of available plugins, run:
|  |   $ kubectl krew search
|  |
|  | You can find documentation at
|  |   https://krew.sigs.k8s.io/docs/user-guide/quickstart/.
| /
/

```

### Install hns plugin for kubectl

```shell


$ kubectl krew update
Updated the local copy of plugin index.
guoping@guoping-HP-Z640-Workstation ~ $ k krew install hns
Updated the local copy of plugin index.
Installing plugin: hns
Installed plugin: hns
\
| Use this plugin:
|      kubectl hns
| Documentation:
|      https://github.com/kubernetes-sigs/hierarchical-namespaces/tree/master/docs/user-guide
| Caveats:
| \
|  | This plugin works best if you have the most recent minor version of HNC on
|  | your cluster. Get the latest version of HNC, as well as prior versions of
|  | this plugin, at:
|  |
|  |   https://github.com/kubernetes-sigs/hierarchical-namespaces
|  |
|  | Watch out for the following common misconceptions when using HNC:
|  |
|  | * Not all child namespaces are subnamespaces!
|  | * Only RBAC Roles and RoleBindings are propagated by default, but you can configure more.
|  |
|  | The user guide contains much more information.
| /
/
WARNING: You installed plugin "hns" from the krew-index plugin repository.
   These plugins are not audited for security by the Krew maintainers.
  Run them at your own risk.

```



```shell

$ kubectl create ns cfe-pce
namespace/cfe-pce created

$ kubectl create ns cfe-pce-vmaas
namespace/cfe-pce-vmaas created

$ kubectl create ns cfe-pce-caas
namespace/cfe-pce-caas created

$ kubectl hns set cfe-pce-vmaas --parent cfe-pce
Setting the parent of cfe-pce-vmaas to cfe-pce
Succesfully updated 1 property of the hierarchical configuration of cfe-pce-vmaas

$ kubectl hns set cfe-pce-caas --parent cfe-pce
Setting the parent of cfe-pce-caas to cfe-pce
Succesfully updated 1 property of the hierarchical configuration of cfe-pce-caas

$ kubectl hns tree cfe-pce
cfe-pce
├── cfe-pce-caas
└── cfe-pce-vmaas


```



```shell


```



