---
title: Setting up hierarchical namespaces in Kubernetes in HPE GreenLake for
  Private Cloud Enterprise
date: 2024-08-12T10:02:38.074Z
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
  - Hierarchical Namespaces
---
<style> li { font-size: 27px; line-height: 33px; max-width: none; } </style>

This blog post provides a step-by-step guide on how to set up hierarchical namespaces in Kubernetes (K8s) in HPE GreenLake for Private Cloud Enterprise. It explores and demonstrates the simplicity of handling relationships between K8s namespaces, propagating configurations and resource constraints, and applying access control policies using hierarchical namespaces in K8s. The utilization of hierarchical namespaces can result in a more steamlined namespace management and improved security in the complex K8s production environment. 


### Overview



[HPE GreenLake for Private Cloud Enterprise: Containers](https://www.hpe.com/us/en/greenlake/containers.html), one of the HPE GreenLake cloud services available on the HPE GreenLake for Private Cloud Enterprise, allows customers to create a K8s cluster and deploy containerized applications to the cluster. It provides an enterprise-grade container management service using open source K8s.  

A K8s [*namespace*](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/) is a fundamental API obejct within the K8s architecture. It provides a mechanism for grouping and isolating K8s resources within a single cluster. Each namespace has its own set of resources, policies and constraints. Cluster administrators can create roles using role-based access control (RBAC) to define permissions within a specific namespace. They can aslo enforce resource limits and quotas to control the consumption of resources by objects in a namespace. K8s namespaces facilitate the separation of resources and allow multiple users, teams, or projects to share a cluster within an organization. This approach is more cost-effective than creating a new cluster for each organizational unit. By applying various K8s configurations and policies to namespaces, cluster administrators can ensure safe and fair resource isolatiion and cluster sharing. 

K8s namespaces created within a cluster are peers, each fully isolated from the others. K8s namespaces don't align well with organizational structures. Cluster adminitrators must define roles and create policies and constraints for each individual namespace. At scale, managing numerous namespaces can become challenging, leading to potential management issues. The administrative overhead can make managing namespaces within the cluster tedious and prone to errors.





In 2020, K8s upstream introduced a K8s extension known as the [*Hierarchical Namespace Controller* (HNC)](https://github.com/kubernetes-sigs/hierarchical-namespaces#the-hierarchical-namespace-controller-hnc). HNC supports hierarchical namespaces and helps cluster adminitrators manage the security and capabilities of namespaces with less effort than the flat, peer-to-peer namespace model. Using HNC, administrators can organize namespaces according to an organizational hierarchy and allocate capabilities accordingly. 

This blog post outlines the steps to set up hierarchical namespaces in K8s in HPE GreenLake for Private Cloud Enterprise. It uses a list of K8s resources, such as *Role*/*RoleBinding*, *ResourceQuota* and *Secret*, to showcasae the befefits that hierarchical namespaces bring to K8s.

### Prerequisites



Before starting, make sure you have the following:

* A K8s cluster being provisioned, using [HPE GreenLake Terraform provider](https://developer.hpe.com/blog/kubernetes-clusters-as-code-part1/) for example, in HPE GreenLake for Private Cloud Enterprise
* The *kubectl* CLI tool, together with the kubeconfig file for accessing the K8s cluster
* [cURL](https://curl.se/) CLI tool



### Set up hierarchical namespaces

K8s does not come with hierarchical namespace support by default. There are  two components, the *HNC manager* and the optional kubectl plugin *kubectl-hns*, need to install in order to support hierarchical namespaces in K8s. 

#### Install the HNC manager

The HNC manager can be installed within the control plane of the K8s cluster by typing the following commands:

```shell
$ HNC_VERSION=v1.1.0

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

The above commands install the latest [HNC v1.1.0](https://github.com/kubernetes-sigs/hierarchical-namespaces/releases) to the namespace *'hnc-system'* in the cluster.



Type the following command to check the HNC manager installation:

```shell
$ kubectl get all -n hnc-system
NAME                                         READY   STATUS    RESTARTS      AGE
pod/hnc-controller-manager-9b5dbcd48-2268c   1/1     Running   0             29s

NAME                                             TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
service/hnc-controller-manager-metrics-service   ClusterIP   10.96.255.60   <none>        8080/TCP   32s
service/hnc-webhook-service                      ClusterIP   10.96.73.3     <none>        443/TCP    32s

NAME                                     READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/hnc-controller-manager   1/1     1            1           31s

NAME                                               DESIRED   CURRENT   READY   AGE
replicaset.apps/hnc-controller-manager-9b5dbcd48   1         1         1       32s
```

#### Install the *kubectl-hns* plugin

Once the HNC manager has been installed, hierarchical namespaces can be set up using directly the kubectl CLI tool, in conjunction with a list of HNC custom resource definitions (CRDs), such as *HierarchyConfiguration* and *SubnamespaceAnchor*. However, there is a kubectl plugin called *kubectl-hns* that you can install in your client environment. This kubectl plugin works together with the kubectl CLI tool and it greatly simplifies many hierachical namespace operations. This section shows you the process to install the *kubectl-hns* plugin to the Linux workstation in my local environment. 


Type the following commands to install the *kubectl-hns* plugin using *curl*:

```shell



$ HNC_PLATFORM=linux_amd64

$ curl -L https://github.com/kubernetes-sigs/hierarchical-namespaces/releases/download/$HNC_VERSION/kubectl-hns_$HNC_PLATFORM -o ./kubectl-hns
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
100 62.2M  100 62.2M    0     0  2340k      0  0:00:27  0:00:27 --:--:-- 2336k

$ chmod +x kubectl-hns
$ sudo mv kubectl-hns /usr/local/bin/kubectl-hns

```

Type the command below to verify the *kubectl-hns* plugin gets installed correctly and it works with kubectl:

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

Once you have installed both the HNC manager and the *kubectl-hns* plugin, you can begin creating hierarchical namespaces. This section sets up an imaginary hierarchical namespace structure, in which an organization, named **cfe-pce**, consists of two teams, *team-caas* & *team-vmaas*, each team running its *devops* and *iac* projects:

```shell
cfe-pce:
 - team-caas
    - caas-devops
    - caas-iac
 - team-vmaas
    - vmaas-devops
    - vmaas-iac
```



A hierarchical K8s namespace can be created using below command:

```shell

kubectl hns create <ns_child> -n <ns_parent>
```



where, *<ns_child>* is the child namespace you want to create, while *<ns_parent>* is the parent namespace that is created using the command *kubectl create ns <ns_parent>*. 



In case both *<ns_child>* and *<ns_parent>* already exist, you can still create a hierarchical structure by running below command:

```shell

kubectl hns set <ns_child> --parent <ns_parent>
```

Type the command below to create the root namespace *'cfe-pce'* representing the organization:

```shell

$ kubectl create ns cfe-pce
namespace/cfe-pce created
```

Then run the following commands to create the subnamespaces under the organization:

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
$ kubectl hns tree cfe-pce
cfe-pce
├── team-caas
│   ├── caas-devops
│   └── caas-iac
└── team-vmaas
    ├── vmaas-devops
    └── vmaas-iac
```

### Create resources and apply propagating capabilities

With the hierarchical namespace structure created, this section demonstrates how to add roles and rolebindings, using RBAC, to enforce access control within namespaces. It also covers setting up resource quotas and secrets to ensure safe cluster sharing. Hierarchical namespaces allow for the propagation of configurations and resources, enforcing access control policies across namespaces.

You can refer to the [HNC user guide](https://github.com/kubernetes-sigs/hierarchical-namespaces/blob/master/docs/user-guide/README.md) for setting up other K8s resources using HNC. 

#### Cascade roles and rolebindings 

[RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) is commonly used in K8s to limit access to the appropirate namespaces. It's essential to ensure that each user or workload has the correct access to only their designated namespaces. K8s *role* and *rolebinding* are two API objects used at the namespace level to enforce access control.  

Type the following commands to create an admin role across the whole organization *cfe-pce* and two site reliability engineer (SRE) roles for *team-vmaas* and *team-caas*: 

```shell

$ kubectl -n cfe-pce create role pce-admin --verb=* --resource=pod
role.rbac.authorization.k8s.io/pce-admin created

$ kubectl -n team-vmaas create role vmaas-sre --verb=update --resource=pod
role.rbac.authorization.k8s.io/vmaas-sre created

$ kubectl -n team-caas create role caas-sre --verb=update --resource=pod
role.rbac.authorization.k8s.io/caas-sre created
```

Type the commands below to create the rolebindings:

```shell

$ kubectl -n cfe-pce create rolebinding pce-admins --role pce-admin --serviceaccount=cfe-pce:default
rolebinding.rbac.authorization.k8s.io/pce-admins created

$ kubectl -n team-caas create rolebinding caas-sres --role caas-sre --serviceaccount=team-caas:default
rolebinding.rbac.authorization.k8s.io/caas-sres created

$ kubectl -n team-vmaas create rolebinding vmaas-sres --role vmaas-sre --serviceaccount=team-vmaas:default
rolebinding.rbac.authorization.k8s.io/vmaas-sres created

```
Besides the creation of roles and rolebindings in the parent namespaces, they are propagated to all associated subnamespaces at both the team and project levels:

```shell
$ kubectl get role -n cfe-pce pce-admin
NAME        CREATED AT
pce-admin   2024-06-27T12:45:51Z

$ kubectl get rolebindings -n cfe-pce pce-admins
NAME         ROLE             AGE
pce-admins   Role/pce-admin   44s

$ kubectl get role -n team-caas
NAME                            CREATED AT
...
caas-sre                        2024-06-27T12:45:53Z
pce-admin                       2024-06-27T12:45:51Z

$ kubectl get rolebindings -n team-caas
NAME                            ROLE                                 AGE
...
caas-sres                       Role/caas-sre                        44s
pce-admins                      Role/pce-admin                       63s

$ kubectl get role -n caas-devops
NAME                            CREATED AT
...
caas-sre                        2024-06-27T12:45:53Z
pce-admin                       2024-06-27T12:45:51Z

$ kubectl get rolebindings -n caas-devops
NAME                            ROLE                                 AGE
...
caas-sres                       Role/caas-sre                        53s
pce-admins                      Role/pce-admin                       63s

$ kubectl get role -n caas-iac
NAME                            CREATED AT
...
caas-sre                        2024-07-29T12:10:59Z
pce-admin                       2024-08-08T08:23:42Z

$ kubectl get rolebindings -n caas-iac
NAME                            ROLE                                 AGE
...
caas-sres                       Role/caas-sre                        53s
pce-admins                      Role/pce-admin                       63s

$ kubectl get role -n team-vmaas
NAME                            CREATED AT
...
pce-admin                       2024-06-27T12:45:51Z
vmaas-sre                       2024-06-27T12:45:52Z

$ kubectl get rolebindings -n team-vmaas
NAME                            ROLE                                 AGE
...
pce-admins                      Role/pce-admin                       63s
vmaas-sres                      Role/vmaas-sre                       43s

$ kubectl get role -n vmaas-devops
NAME                            CREATED AT
...
pce-admin                       2024-08-03T14:08:45Z
vmaas-sre                       2024-07-29T12:10:59Z

$ kubectl get rolebindings -n vmaas-devops
NAME                            ROLE                                 AGE
pce-admins                      Role/pce-admin                       63s
vmaas-sres                      Role/vmaas-sre                       43s

$ kubectl get role -n vmaas-iac
NAME                            CREATED AT
...
pce-admin                       2024-06-27T12:45:51Z
vmaas-sre                       2024-06-27T12:45:52Z

$ k get rolebindings -n vmaas-iac
NAME                            ROLE                                 AGE
...
pce-admins                      Role/pce-admin                       65s
vmaas-sres                      Role/vmaas-sre                       45s

```

#### Cascade resource quotas

K8s provides [ResourceQuota](https://kubernetes.io/docs/concepts/policy/resource-quotas/) API object that allows the cluster administrators to define resource quotas and 
limit ranges per namespace. Resource quota tracks aggregate usage of resources in the namspace and allow cluster operators to define hard resource usage limits that a namespace may consume. A limit range defines minimum and maximum constraints on the amount of resources a single entity can consume in a namespace. It's useful to make sure resource usgae is staying with certain bounds. This section shows the process to set up resource quotas using *ResourceQuota*.

Type below commands to apply two resource quotas, *'team-vmaas-quota'* & *'team-caas-quota'*, to the team namespaces *'team-vmaas'* and *'team-caas'*, respectively:

```shell



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
If you check the resouce quotas using the following commands, you will find they are only created in each team namespace. The quota resources are not propagated to any projects under the team namespaces: 

```shell
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

The lack of propagation of resource quotas to project namespaces is due to the default HNC configuration. The HNC configuration by default is configured to only propagate RBAC objects, specifically, *roles* and *rolebindings*. You have to update the HNC configuration to propagate other K8s resources. 

```shell

$ kubectl hns config describe
Synchronized resources:
* Propagating: rolebindings (rbac.authorization.k8s.io/v1)
* Propagating: roles (rbac.authorization.k8s.io/v1)

Conditions:

```

Type the following command to update the HNC configuration to propagate the K8s *ResourceQuota* resources:

```shell

$ kubectl hns config set-resource resourcequotas --mode Propagate

$ kubectl hns config describe
Synchronized resources:
* Propagating: resourcequotas (/v1)
* Propagating: rolebindings (rbac.authorization.k8s.io/v1)
* Propagating: roles (rbac.authorization.k8s.io/v1)

Conditions:

```

Then if you check again the resouce quotas, you will see the quota resources are propagated to all projects under each team namespace: 

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

This section shows the process to configure some sensitive data to be propagated through the namespace hierarchy. It uses the K8s [Secret](https://kubernetes.io/docs/concepts/configuration/secret/) API object. 

First type below command to update the HNC configuration to propagate the K8s *Secret* resouces:

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

Then execute the following commands to generate two K8s secrets of the *docker-registry* type within the *'team-caas'* and *'team-vmaas'* namespaces, respectively. These secrets can be used by the corresponding teams and their projects, enabling them to authenticate against their respective team Docker registries and retrieve private images necessary for the deployment of their applications.

```shell
 $ kubectl -n team-caas create secret generic team-caas-regcrd --from-file=.dockerconfigjson=/home/guoping/.docker/config-team-caas.json --type=kubernetes.io/dockerconfigjson
secret/team-caas-regcrd created

$ kubectl -n team-vmaas create secret generic team-vmaas-regcrd --from-file=.dockerconfigjson=/home/guoping/.docker/config-team-vmaas.json --type=kubernetes.io/dockerconfigjson
secret/team-vmaas-regcrd created

```
Besides being created within the team namespaces, these secrets are also automatically propagated to every project within each team namespace:

```shell

$ kubectl get secret -n team-caas team-caas-regcrd
NAME               TYPE                             DATA   AGE
team-caas-regcrd   kubernetes.io/dockerconfigjson   1      49s

$ kubectl get secret -n caas-devops team-caas-regcrd
NAME               TYPE                             DATA   AGE
team-caas-regcrd   kubernetes.io/dockerconfigjson   1      99s

$ kubectl get secret -n caas-iac team-caas-regcrd
NAME               TYPE                             DATA   AGE
team-caas-regcrd   kubernetes.io/dockerconfigjson   1      104s

$ kubectl get secret -n team-vmaas team-vmaas-regcrd
NAME                TYPE                             DATA   AGE
team-vmaas-regcrd   kubernetes.io/dockerconfigjson   1      40s

$ kubectl get secret -n vmaas-devops team-vmaas-regcrd
NAME                TYPE                             DATA   AGE
team-vmaas-regcrd   kubernetes.io/dockerconfigjson   1      59s

$ kubectl get secret -n vmaas-iac team-vmaas-regcrd
NAME                TYPE                             DATA   AGE
team-vmaas-regcrd   kubernetes.io/dockerconfigjson   1      65s




```

### Conclusion

This blog post provides a detailed guide on how to set up hierarchical namespaces in K8s in the HPE GreenLake for Private Cloud Enterprise. It delves into the capabilities of hierarchical namespaces and their impact on managing K8s namespaces. The support of hierarchical namespaces simplifies K8s management and addresses the complexities of administering large-scale namespaces. 

Please keep coming back to the [HPE Developer Community blog](https://developer.hpe.com/blog/) to learn more about HPE GreenLake for Private Cloud Enterprise and get more ideas on how you can use it in your everyday operations.