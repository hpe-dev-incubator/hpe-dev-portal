---
title: Setting up hierarchical namespaces in Kubernetes in HPE GreenLake for
  Private Cloud Enterprise
date: 2024-06-13T08:18:47.600Z
author: Guoping Jia
authorimage: /img/guoping.png
disable: false
tags:
  - hpe-greenlake-for-private-cloud-enterprise
  - Kubernetes
  - Namespaces
  - HPE GreenLake for Private Cloud Enterprise
  - RBAC
  - Role and RoleBinding
  - ResourceQuotas
  - Secrets
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

### Set up hierarchical namespaces

#### Install the hierarchical namespace controller

```shell
$ HNC_VERSION=v1.1.0
$ HNC_PLATFORM=linux_amd64

$ kubectl apply -f https://github.com/kubernetes-sigs/multi-tenancy/releases/download/hnc-$HNC_VERSION/hnc-manager.yaml
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

The command installs the latest [HNC v1.1.0](https://github.com/kubernetes-sigs/hierarchical-namespaces/releases) to the namespace *hnc-system* in the cluster.



Type the following command to check the HNC installation:

```shell
$ kubectl get all -n hnc-system
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

#### Install the hns plugin for kubectl 

```shell



$ curl -L https://github.com/kubernetes-sigs/hierarchical-namespaces/releases/download/$HNC_VERSION/kubectl-hns_$HNC_PLATFORM -o ./kubectl-hns
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
100 62.2M  100 62.2M    0     0  2340k      0  0:00:27  0:00:27 --:--:-- 2336k

$ chmod +x kubectl-hns
$ sudo mv kubectl-hns /usr/local/bin/kubectl-hns

```

Type the following command to verify the plugin *hns* installed and it works with kubectl:

```shell


$ kubectl hns
Manipulates hierarchical namespaces provided by HNC

Usage:
  kubectl-hns [command]

Available Commands:
  completion  generate the autocompletion script for the specified shell
  config      Manipulates the HNC configuration
  create      Creates a subnamespace under the given parent.
  describe    Displays information about the hierarchy configuration
  help        Help about any command
  hrq         Display one or more HierarchicalResourceQuota
  set         Sets hierarchical properties of the given namespace
  tree        Display one or more hierarchy trees
  version     Show version of HNC plugin

Flags:
      --as string                      Username to impersonate for the operation. User could be a regular user or a service account in a namespace.
      --as-group stringArray           Group to impersonate for the operation, this flag can be repeated to specify multiple groups.
      --as-uid string                  UID to impersonate for the operation.
      --cache-dir string               Default cache directory (default "/home/guoping/.kube/cache")
      --certificate-authority string   Path to a cert file for the certificate authority
      --client-certificate string      Path to a client certificate file for TLS
      --client-key string              Path to a client key file for TLS
      --cluster string                 The name of the kubeconfig cluster to use
      --context string                 The name of the kubeconfig context to use
  -h, --help                           help for kubectl-hns
      --insecure-skip-tls-verify       If true, the server's certificate will not be checked for validity. This will make your HTTPS connections insecure
      --kubeconfig string              Path to the kubeconfig file to use for CLI requests.
  -n, --namespace string               If present, the namespace scope for this CLI request
      --request-timeout string         The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests. (default "0")
  -s, --server string                  The address and port of the Kubernetes API server
      --tls-server-name string         Server name to use for server certificate validation. If it is not provided, the hostname used to contact the server is used
      --token string                   Bearer token for authentication to the API server
      --user string                    The name of the kubeconfig user to use
  -v, --version                        version for kubectl-hns

Use "kubectl-hns [command] --help" for more information about a command.

```

### Create hierarchical namespaces

This section sets up an imaginary hierarchical namespace structure, in which an organization named **cfe-pce** supports two teams, *team-caas* & *vmaas*, each running its *devops* and *iac* projects:

```shell
cfe-pce
├── team-caas
│   ├── caas-devops
│   └── caas-iac
└── team-vmaas
    ├── vmaas-devops
    └── vmaas-iac
```



Type below kubectl command to create the namespace *'cfe-pce'* to represent the organization:

```shell

$ kubectl create ns cfe-pce
namespace/cfe-pce created
```

You can continue to create other namespaces using *'kubectl creat ns'* for two teams and two projects under each team. You then run the command *'kubectl hns set'* to set hierarchical properties of those created namespaces. 

The following section will run the command *'kubectl hns create'* to create the subnamespaces under each parent:

```shell
$ kubectl hns create team-vmaas -n cfe-pce                                                                                                                                              
Successfully created "team-vmaas" subnamespace anchor in "cfe-pce" namespace
$ kubectl hns create vmaas-devops -n team-vmaas                                                                                                        
Successfully created "vmaas-devops" subnamespace anchor in "team-vmaas" namespace                                                                                                      
$ kubectl hns create vmaas-iac -n team-vmaas                                                                                                                                            
Successfully created "vmaas-iac" subnamespace anchor in "team-vmaas" namespace                                                                                                         
$ kubectl hns create team-caas -n cfe-pce                                                                                                                                               
Successfully created "team-caas" subnamespace anchor in "cfe-pce" namespace
$ kubectl hns create caas-devops -n team-caas
Successfully created "caas-devops" subnamespace anchor in "team-caas" namespace
$ kubectl hns create caas-iac -n team-caas
Successfully created "caas-iac" subnamespace anchor in "team-caas" namespace
```

Type the command *'kubectl hns tree'* to check the hierarchical namespaces:

```shell
$ k hns tree cfe-pce
cfe-pce
├── team-caas
│   ├── [s] caas-devops
│   └── [s] caas-iac
└── team-vmaas
    ├── vmaas-devops
    └── vmaas-iac

[s] indicates subnamespaces
```

### Apply propagating capabilities to hierarchical namespaces

The advantage of the hierarchical namespaces is that they enable administrators to build propagating permission structures to a Kubernetes cluster. Instead of setting up permission per namespace, the administators can do it at the parent. The permission will be propagated into its subnamespaces. 

#### Cascade roles and rolebindings 

```shell
# Create the roles

$ kubectl -n cfe-pce create role pce-admin --verb=* --resource=pod
role.rbac.authorization.k8s.io/pce-admin created
$ kubectl -n team-vmaas create role vmaas-sre --verb=update --resource=pod
role.rbac.authorization.k8s.io/vmaas-sre created
$ kubectl -n team-caas create role caas-sre --verb=update --resource=pod
role.rbac.authorization.k8s.io/caas-sre created

```

```shell
$ k get role -n cfe-pce
NAME                            CREATED AT
...
pce-admin                       2024-06-27T12:45:51Z

$ k get role -n team-caas
NAME                            CREATED AT
caas-sre                        2024-06-27T12:45:53Z
...
pce-admin                       2024-06-27T12:45:51Z

$ k get role -n vmaas-iac
NAME                            CREATED AT
...
pce-admin                       2024-06-27T12:45:51Z
vmaas-sre                       2024-06-27T12:45:52Z

$ k get role -n team-vmaas
NAME                            CREATED AT
hpe-cfe-pce-role                2024-06-27T12:36:05Z
...
pce-admin                       2024-06-27T12:45:51Z
vmaas-sre                       2024-06-27T12:45:52Z

$ k get role -n caas-devops
NAME                            CREATED AT
caas-sre                        2024-06-27T12:45:53Z
...
pce-admin                       2024-06-27T12:45:51Z

```

#### Cascade resource quotas

```shell
# Create the resource quotas


$ cat team-vmaas-quota.yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: team-vmaas-quota
spec:
  hard:
    cpu: "4"
    memory: 20Gi
    pods: "10"
    persistentvolumeclaims: "10"
    services.nodeports: "2"
    requests.storage: 20Gi



$ kubectl -n team-vmaas apply -f team-vmaas-quota.yaml

resourcequota/team-vmaas-quota created


$ cat team-caas-quota.yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: team-caas-quota
spec:
  hard:
    cpu: "8"
    memory: 60Gi
    pods: "30"
    persistentvolumeclaims: "30"
    services.nodeports: "6"
    requests.storage: 60Gi



$ kubectl -n team-caas apply -f team-caas-quota.yaml
resourcequota/team-caas-quota created


```

```shell
$ kubectl get resourcequota -n cfe-pce
No resources found in cfe-pce namespace.
$ kubectl get resourcequota -n team-caas
NAME               AGE   REQUEST                                                                                                                 LIMIT
team-caas-quota   67s   cpu: 0/8, memory: 0/60Gi, persistentvolumeclaims: 0/30, pods: 0/30, requests.storage: 0/60Gi, services.nodeports: 0/6

$ kubectl get resourcequota -n team-vmaas
NAME              AGE   REQUEST                                                                                                                 LIMIT
team-vmaas-quota   74s   cpu: 0/4, memory: 0/20Gi, persistentvolumeclaims: 0/10, pods: 0/10, requests.storage: 0/20Gi, services.nodeports: 0/2
$ kubectl get resourcequota -n vmaas-iac
No resources found in vmaas-iac namespace.
$ kubectl get resourcequota -n caas-iac
No resources found in caas-iac namespace.
$ kubectl get resourcequota -n caas-devops
No resources found in caas-devops namespace.
$ kubectl get resourcequota -n vmaas-devops
No resources found in vmaas-devops namespace.

```

```shell
# List the hnc configure
$ kubectl hns config describe
Synchronized resources:
* Propagating: rolebindings (rbac.authorization.k8s.io/v1)
* Propagating: roles (rbac.authorization.k8s.io/v1)

Conditions:

```

Type the following command to configure the K8s API resource *ResourceQuotas*:

```shell
# Set resource quotas
$ kubectl hns config set-resource resourcequotas --mode Propagate

```

```shell
Synchronized resources:
* Propagating: resourcequotas (/v1)
* Propagating: rolebindings (rbac.authorization.k8s.io/v1)
* Propagating: roles (rbac.authorization.k8s.io/v1)

Conditions:

```

```shell
$ kubectl get resourcequota -n team-caas
NAME               AGE     REQUEST                                                                                                                 LIMIT
team-caas-quota   3m39s   cpu: 0/8, memory: 0/60Gi, persistentvolumeclaims: 0/30, pods: 0/30, requests.storage: 0/60Gi, services.nodeports: 0/6

$ kubectl get resourcequota -n caas-iac
NAME               AGE   REQUEST                                                                                                                 LIMIT
team-caas-quota   45s   cpu: 0/8, memory: 0/60Gi, persistentvolumeclaims: 0/30, pods: 0/30, requests.storage: 0/60Gi, services.nodeports: 0/6

$ kubectl get resourcequota -n caas-devops
NAME               AGE   REQUEST                                                                                                                 LIMIT
team-caas-quota   60s   cpu: 0/8, memory: 0/60Gi, persistentvolumeclaims: 0/30, pods: 0/30, requests.storage: 0/60Gi, services.nodeports: 0/6

$ kubectl get resourcequota -n team-vmaas
NAME              AGE     REQUEST                                                                                                                 LIMIT
team-vmaas-quota   4m10s   cpu: 0/4, memory: 0/20Gi, persistentvolumeclaims: 0/10, pods: 0/10, requests.storage: 0/20Gi, services.nodeports: 0/2

$ kubectl get resourcequota -n vmaas-iac
NAME              AGE   REQUEST                                                                                                                 LIMIT
team-vmaas-quota   75s   cpu: 0/4, memory: 0/20Gi, persistentvolumeclaims: 0/10, pods: 0/10, requests.storage: 0/20Gi, services.nodeports: 0/2

$ kubectl get resourcequota -n vmaas-devops
NAME              AGE   REQUEST                                                                                                                 LIMIT
team-vmaas-quota   79s   cpu: 0/4, memory: 0/20Gi, persistentvolumeclaims: 0/10, pods: 0/10, requests.storage: 0/20Gi, services.nodeports: 0/2

```

#### Cascade secrets

```shell
$ kubectl hns config set-resource secrets --mode Propagate

$ kubectl hns config describe
Synchronized resources:
* Propagating: resourcequotas (/v1)
* Propagating: secrets (/v1)
* Propagating: rolebindings (rbac.authorization.k8s.io/v1)
* Propagating: roles (rbac.authorization.k8s.io/v1)

Conditions:

```

```shell
$ kubectl -n team-vmaas create secret generic vmaas-creds --from-literal=password=teamvmaas
secret/vmaas-creds created

$ kubectl -n team-caas create secret generic caas-creds --from-literal=password=teamcaas
secret/caas-creds created


```

```shell
$ kubectl get secrets -n cfe-pce | grep creds
$

$ kubectl get secrets -n team-vmaas | grep creds
vmaas-creds                           Opaque                                1      76s
$ kubectl get secrets -n team-caas | grep creds
caas-creds                           Opaque                                1      82s

$ kubectl get secrets -n vmaas-iac | grep creds
vmaas-creds                          Opaque                                1      96s
$ kubectl get secrets -n vmaas-devops | grep creds
vmaas-creds                             Opaque                                1      101s
$ kubectl get secrets -n caas-iac | grep creds
caas-creds                           Opaque                                1      114s
$ kubectl get secrets -n caas-devops | grep creds
caas-creds                             Opaque                                1      2m1s


```

### Conclusion







