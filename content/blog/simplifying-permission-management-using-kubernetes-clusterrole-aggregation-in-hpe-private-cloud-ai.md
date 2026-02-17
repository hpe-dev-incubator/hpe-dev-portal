---
title: Simplifying permission management using Kubernetes ClusterRole
  aggregation in HPE Private Cloud AI.
date: 2026-02-11T07:36:43.381Z
author: Guoping Jia
authorimage: /img/guoping.png
disable: false
tags:
  - HPE Private Cloud AI
  - Kubernetes
  - Role-based Access Control
  - ClusterRole
  - Kubeflow Notebooks
---
<style> li { font-size: 27px; line-height: 33px; max-width: none; } </style>
 
When operating Kubernetes (K8s), Role‑Based Access Control (RBAC) serves as a core security mechanism for managing permissions across the cluster. It enables precise control by mapping users and processes to specific sets of permissions, enforcing the principle of least privilege. However, managing these permissions can become cumbersome. While Roles and ClusterRoles offer a structured way to assign resource‑level access, manually updating and managing them becomes increasingly challenging as new access requests arise and clusters evolve.

This blog post explores how ClusterRole aggregation can help address that challenge. It introduces the key concepts and advantages of aggregated ClusterRoles and explains how they can streamline permission management. The post then walks through practical examples of applying ClusterRole aggregation in the HPE Private Cloud AI environment to make RBAC administration more scalable and efficient.




### What is K8s RBAC?
 
K8s RBAC is a native authorization framework integrated directly into the K8s API server. It is composed of four primary object types: *Roles*, which define permissions for namespaced resources; *ClusterRoles*, which define permissions at the cluster scope; *RoleBindings*, which associate a Role with a user, group, or ServiceAccount within a specific namespace; and *ClusterRoleBindings*, which bind subjects to a ClusterRole across the entire cluster. Together, these constructs privide fine‑grained, declarative control over resource access and enforce least-privilege authorization across the environment. 

Despite its flexibility, K8s RBAC introduces several operational challenges, largely due to its mixed namespace and cluster-scoped permission model. Because RBAC permissions must span both namespaced and global resources, teams often struggle to maintain strict least‑privilege boundaries without resorting to overly broad ClusterRoles, raising the risk of misconfiguration and privilege escalation. The high granularity of K8s API resources and verbs, combined with the separation of Roles/ClusterRoles from their Bindings, makes it difficult to understand the effective permissions granted to a subject. As multiple teams modify RBAC objects over time, policies tend to drift, accumulate inconsistencies, and unintentionally propagate privileges through shared bindings. In large-scale environments such as HPE Private Cloud AI, K8s RBAC management becomes complex, error‑prone, and operationally fragile. 

To address these challenges as environments grow and the number of roles increases, K8s provides *ClusterRole aggregation*, a mechanism designed to simplify and streamline permission management.

 

### What is ClusterRole aggregation?

[ClusterRole aggregation](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#aggregated-clusterroles), introduced and supported since K8s v1.9, are a mechanism that automatically aggregates several ClusterRoles into one combined ClusterRole through specified labels. A controller, running as part of the cluster control plane, watches for ClusterRole objects with an aggregationRule set. The aggregationRule in a ClusterRole defines a label selector that the controller uses to match other ClusterRole objects that should be combined into the rules field of this one. 

Aggregated ClusterRoles offer several key advantages in Kubernetes RBAC. They simplify management by reducing the need to maintain numerous individual roles, keeping permissions organized and easier to oversee. They also update automatically when underlying roles change, eliminating manual adjustments and reducing administrative overhead. As your cluster grows, aggregated roles scale naturally—new roles can be added as needed, and Kubernetes handles the aggregation seamlessly. This approach also enhances security by encouraging smaller, more focused roles, minimizing the risk of granting overly broad permissions.

The K8s API server creates a set of default ClusterRole objects. Many of these are prefixed with 'system', indicating that they are managed directly by the cluster control plane. The remaining default ClusterRoles, that is, those without the system prefix, are intended as user‑facing roles. K8s ships these user-facing roles to cover the most common permission levels for users, most notably view, edit, and admin, which form a natural progression from read‑only access to full namespace‑level administration.


```shell


apiVersion: rbac.authorization.k8s.io/v1

kind: ClusterRole

metadata:

  name: custom-cr

aggregationRule:

  clusterRoleSelectors:

  - matchLabels:

      rbac.authorization.k8s.io/aggregate-to-edit: "true"

rules: [] 
```



It should be noted that the control plane automatically fills in the rules field and it overwrites any values that you manually specify in the rules field of an aggregate ClusterRole. If you want to change or add rules, do so in the ClusterRole objects that are selected by the aggregateRule.



It uses a user-facing ClusterRole, kubeflow-edit, to grant read/write access to most K8s objects in a PCAI user namespace. This ClusterRole uses ClusterRole aggregation to allow the controller to include rules for custom resources. To add rules, create a ClusterRole with the following lablel:

```shell


metadata:

  labels:

    rbac.authorization.k8s.io/aggregate-to-edit: "true"
```


It uses

### HPE Private Cloud AI

[HPE Private Cloud AI (PCAI)](https://developer.hpe.com/platform/hpe-private-cloud-ai/home/) is a turnkey, enterprise‑ready platform that brings together HPE and NVIDIA technologies to simplify and accelerate the deployment of AI workloads by running them on a K8s foundation. By leveraging standard K8s constructs, AI models, inference services, and supporting components are deployed into dedicated K8s namespaces for clean separation, scalability, and lifecycle management. As part of its user‑centric design, PCAI automatically provisions a default notebook environment for each authenticated user, running as a containerized Pod inside that user’s personal Kubernetes namespace, providing an isolated workspace for experimentation, data preparation, and model development.

![](/img/kubeflow-notebooks.png) 


A key architectural foundation of HPE PCAI is its deep integration with Kubernetes (K8s). Kubernetes functions as the orchestration layer that schedules, isolates, manages, and scales AI workloads across PCAI’s compute nodes. Instead of custom orchestration or proprietary schedulers, PCAI leverages standard Kubernetes constructs—namespaces, deployments, autoscaling policies, and Helm-based packaging—to deliver repeatable and scalable AI services. This Kubernetes-native approach removes complexity and aligns PCAI with modern cloud‑native operational practices.

HPE Private Cloud AI is a turnkey, enterprise‑ready platform that brings together HPE and NVIDIA technologies to simplify and accelerate the deployment of AI workloads by running them on a Kubernetes foundation, where models, inference services, and supporting components are deployed into dedicated Kubernetes namespaces for clean separation, scalability, and lifecycle management.  As part of its user‑centric design, PCAI automatically provisions a default notebook environment for each authenticated user, running as a containerized Pod inside that user’s personal Kubernetes namespace, providing an isolated workspace for experimentation, data preparation, and model development.


![](/img/notebook-server-terminal.png) 

```shell




(base) guoping-jia@default-notebook-0:~$ kubectl get pods
NAME                                       READY   STATUS    RESTARTS   AGE
default-notebook-0                         2/2     Running   0          42h
fs-65cbb7b876-x9564                        2/2     Running   0          24d
ml-pipeline-ui-artifact-696cff4647-46slx   2/2     Running   0          24d
(base) guoping-jia@default-notebook-0:~$ kubectl exec -it default-notebook-0 -- sh
Error from server (Forbidden): pods "default-notebook-0" is forbidden: User "system:serviceaccount:project-user-guoping-jia:default-editor" cannot create resource "pods/exec" in API group "" in the namespace "project-user-guoping-jia"
(base) guoping-jia@default-notebook-0:~$ 
(base) guoping-jia@default-notebook-0:~$ 
(base) guoping-jia@default-notebook-0:~$ kubectl auth can-i list secrets
no
(base) guoping-jia@default-notebook-0:~$ kubectl auth can-i get pods --subresource=exec
no
(base) guoping-jia@default-notebook-0:~$ kubectl get secrets
Error from server (Forbidden): secrets is forbidden: User "system:serviceaccount:project-user-guoping-jia:default-editor" cannot list resource "secrets" in API group "" in the namespace "project-user-guoping-jia"
```


```shell



[root@ai-cluster ~]# kubectl get clusterrole | grep kubeflow-edit
kubeflow-edit                                                          2025-11-20T03:25:34Z
[root@ai-cluster ~]# kubectl get serviceaccount -n project-user-guoping-jia
NAME                      SECRETS   AGE
airflow-service-account   0         24d
default                   0         24d
default-editor            0         24d
default-viewer            0         24d
kserve-local-s3           0         24d
spark-runner              0         24d
spark-submitter           0         24d
tenantcli                 0         24d
[root@ai-cluster ~]# kubectl get rolebinding -n project-user-guoping-jia
NAME                       ROLE                                   AGE
default-editor             ClusterRole/kubeflow-edit              24d
default-viewer             ClusterRole/kubeflow-view              24d
hpe-airflow-role-binding   ClusterRole/hpe-airflow-cluster-role   24d
namespaceAdmin             ClusterRole/kubeflow-admin             24d
spark-run                  ClusterRole/spark-run                  24d
spark-submit               ClusterRole/spark-submit               24d
tenant-user                ClusterRole/spark-submit               24d
tenantcli                  ClusterRole/tenantcli                  24d
user-guoping-jia           ClusterRole/ezproject-admin            24d
workflow-default-binding   Role/workflow-role                     24d
[root@ai-cluster ~]# kubectl get rolebinding -n project-user-guoping-jia default-editor -o yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  creationTimestamp: "2026-01-12T10:21:56Z"
  name: default-editor
  namespace: project-user-guoping-jia
  ownerReferences:
  - apiVersion: kubeflow.org/v1
    blockOwnerDeletion: true
    controller: true
    kind: Profile
    name: project-user-guoping-jia
    uid: 7aea8b98-cbcd-4806-95fd-403be84d0b8f
  resourceVersion: "97649010"
  uid: 4fbb18ac-289c-45a5-bafa-9ecf141d3974
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: kubeflow-edit
subjects:
- kind: ServiceAccount
  name: default-editor
  namespace: project-user-guoping-jia 
```
 
### Prerequisites
 
Before starting, make sure you have the following:
 
* A K8s cluster, being provisioned in HPE GreenLake for Private Cloud Enterprise
* The *kubectl* CLI tool, together with the kubeconfig file for accessing the K8s cluster
* The *helm* CLI tool, version 3.12.0 or later
* A domain and a list of subdomains to generate the SSL certificate and host the g﻿ame applications in the cluster
* The o﻿ptional *openssl* CLI tool, for validating the generated certificates
 
 
Detailed setup
 
### Set up details
 

![](/img/private.png)

```shell
[root@ai-cluster cr-aggregate]# k get sa -n project-user-guoping-jia
NAME                      SECRETS   AGE
airflow-service-account   0         24d
default                   0         24d
default-editor            0         24d
default-viewer            0         24d
kserve-local-s3           0         24d
spark-runner              0         24d
spark-submitter           0         24d
tenantcli                 0         24d
[root@ai-cluster cr-aggregate]# k get rolebinding -n project-user-guoping-jia
NAME                       ROLE                                   AGE
default-editor             ClusterRole/kubeflow-edit              24d
default-viewer             ClusterRole/kubeflow-view              24d
hpe-airflow-role-binding   ClusterRole/hpe-airflow-cluster-role   24d
namespaceAdmin             ClusterRole/kubeflow-admin             24d
spark-run                  ClusterRole/spark-run                  24d
spark-submit               ClusterRole/spark-submit               24d
tenant-user                ClusterRole/spark-submit               24d
tenantcli                  ClusterRole/tenantcli                  24d
user-guoping-jia           ClusterRole/ezproject-admin            24d
workflow-default-binding   Role/workflow-role                     24d
[root@ai-cluster cr-aggregate]# k get rolebinding -n project-user-guoping-jia default-editor -o yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  creationTimestamp: "2026-01-12T10:21:56Z"
  name: default-editor
  namespace: project-user-guoping-jia
  ownerReferences:
  - apiVersion: kubeflow.org/v1
    blockOwnerDeletion: true
    controller: true
    kind: Profile
    name: project-user-guoping-jia
    uid: 7aea8b98-cbcd-4806-95fd-403be84d0b8f
  resourceVersion: "97649010"
  uid: 4fbb18ac-289c-45a5-bafa-9ecf141d3974
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: kubeflow-edit
subjects:
- kind: ServiceAccount
  name: default-editor
  namespace: project-user-guoping-jia
```




GitHub repository:  https://github.com/GuopingJia/aggregate-clusterroles


```shell
[root@ai-cluster cr-aggregate]# k get clusterrole | grep kubeflow-edit
kubeflow-edit                                                          2025-11-20T03:25:34Z

[root@ai-cluster cr-aggregate]# cat custom-list-secrets.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: custom-list-secret
  labels:
    rbac.authorization.kubeflow.org/aggregate-to-custom-kubeflow-edit: "true"
rules:
  - apiGroups:
    - ""
    resources:
    - secrets
    verbs:
    - get
    - list
[root@ai-cluster cr-aggregate]# cat custom-exec-pods.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: custom-exec-pods
  labels:
    rbac.authorization.kubeflow.org/aggregate-to-custom-kubeflow-edit: "true"
rules:
  - apiGroups:
    - "*"
    resources:
    - pods/exec
    verbs:
    - "*"
```

```shell


# k apply -f custom-list-secrets.yaml
clusterrole.rbac.authorization.k8s.io/custom-list-secret created
# k apply -f custom-exec-pods.yaml
clusterrole.rbac.authorization.k8s.io/custom-exec-pods created
```

```shell



[root@ai-cluster cr-aggregate]# cat custom-kubeflow-edit.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: custom-kubeflow-edit
aggregationRule:
  clusterRoleSelectors:
  - matchLabels:
      rbac.authorization.kubeflow.org/aggregate-to-custom-kubeflow-edit: "true"
rules: []
```

```shell

[root@ai-cluster cr-aggregate]# k apply -f custom-kubeflow-edit.yaml
clusterrole.rbac.authorization.k8s.io/custom-kubeflow-edit created

```

```shell
[root@ai-cluster cr-aggregate]# k get clusterrole custom-kubeflow-edit -o yaml
aggregationRule:
  clusterRoleSelectors:
  - matchLabels:
      rbac.authorization.kubeflow.org/aggregate-to-custom-kubeflow-edit: "true"
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: |
      {"aggregationRule":{"clusterRoleSelectors":[{"matchLabels":{"rbac.authorization.kubeflow.org/aggregate-to-custom-kubeflow-edit":"true"}}]},"apiVersion":"rbac.authorization.k8s.io/v1","kind":"ClusterRole","metadata":{"annotations":{},"name":"custom-kubeflow-edit"},"rules":[]}
  creationTimestamp: "2026-02-05T14:14:30Z"
  name: custom-kubeflow-edit
  resourceVersion: "143469537"
  uid: acab13d6-804d-4b85-af96-ef8c2222f43d
rules:
- apiGroups:
  - '*'
  resources:
  - pods/exec
  verbs:
  - '*'
- apiGroups:
  - ""
  resources:
  - secrets
  verbs:
  - get
  - list
```

```shell


[root@ai-cluster cr-aggregate]# cat custom-rolebinding.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: custom-editor
  namespace: project-user-guoping-jia
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: custom-kubeflow-edit
subjects:
- kind: ServiceAccount
  name: default-editor
  namespace: project-user-guoping-jia
```


```shell

[root@ai-cluster cr-aggregate]# k apply custom-rolebinding.yaml
error: Unexpected args: [custom-rolebinding.yaml]
See 'kubectl apply -h' for help and examples
[root@ai-cluster cr-aggregate]# k apply -f custom-rolebinding.yaml
rolebinding.rbac.authorization.k8s.io/custom-editor created
[root@ai-cluster cr-aggregate]# k get rolebindings -n project-user-guoping-jia
NAME                       ROLE                                   AGE
custom-editor              ClusterRole/custom-kubeflow-edit       20s
default-editor             ClusterRole/kubeflow-edit              24d
default-viewer             ClusterRole/kubeflow-view              24d
hpe-airflow-role-binding   ClusterRole/hpe-airflow-cluster-role   24d
namespaceAdmin             ClusterRole/kubeflow-admin             24d
spark-run                  ClusterRole/spark-run                  24d
spark-submit               ClusterRole/spark-submit               24d
tenant-user                ClusterRole/spark-submit               24d
tenantcli                  ClusterRole/tenantcli                  24d
user-guoping-jia           ClusterRole/ezproject-admin            24d
workflow-default-binding   Role/workflow-role                     24d
```

```shell



(base) guoping-jia@default-notebook-0:~$ kubectl auth can-i get pods --subresource=exec
yes
(base) guoping-jia@default-notebook-0:~$ kubectl auth can-i list secrets
yes
(base) guoping-jia@default-notebook-0:~$ 


(base) guoping-jia@default-notebook-0:~$ kubectl get secrets
NAME                    TYPE                             DATA   AGE
access-token            Opaque                           1      24d
af-cluster-airflowui    Opaque                           6      24d
hpe-imagepull-secrets   kubernetes.io/dockerconfigjson   1      24d
imagepull               kubernetes.io/dockerconfigjson   1      24d
ngc-cli-secret          Opaque                           2      24d
(base) guoping-jia@default-notebook-0:~$ kubectl get pods
NAME                                       READY   STATUS    RESTARTS   AGE
default-notebook-0                         2/2     Running   0          45h
fs-65cbb7b876-x9564                        2/2     Running   0          24d
ml-pipeline-ui-artifact-696cff4647-46slx   2/2     Running   0          24d
(base) guoping-jia@default-notebook-0:~$ kubectl exec -it default-notebook-0 -- bash
root@default-notebook-0:/# pwd
/
root@default-notebook-0:/# exit
exit
(base) guoping-jia@default-notebook-0:~$ 
```

```shell




[root@ai-cluster cr-aggregate]# k create ns custom-ns
namespace/custom-ns created
[root@ai-cluster cr-aggregate]# k get ns | grep custom-ns
custom-ns                               Active   3s
```

```shell



(base) guoping-jia@default-notebook-0:~$ kubectl get ns custom-ns
Error from server (Forbidden): namespaces "custom-ns" is forbidden: User "system:serviceaccount:project-user-guoping-jia:default-editor" cannot get resource "namespaces" in API group "" in the namespace "custom-ns"
(base) guoping-jia@default-notebook-0:~$ kubectl get pods -n custom-ns
Error from server (Forbidden): pods is forbidden: User "system:serviceaccount:project-user-guoping-jia:default-editor" cannot list resource "pods" in API group "" in the namespace "custom-ns"
(base) guoping-jia@default-notebook-0:~$ 
```

```shell





[root@ai-cluster cr-aggregate]# cat ns-default-editor.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: default-editor
  namespace: custom-ns
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: kubeflow-edit
subjects:
- kind: ServiceAccount
  name: default-editor
  namespace: project-user-guoping-jia
[root@ai-cluster cr-aggregate]# k apply -f ns-default-editor.yaml
rolebinding.rbac.authorization.k8s.io/default-editor created
```

```shell

[root@ai-cluster cr-aggregate]# k get rolebinding -n custom-ns
NAME             ROLE                        AGE
default-editor   ClusterRole/kubeflow-edit   10s
```

```shell


(base) guoping-jia@default-notebook-0:~$ kubectl get ns custom-ns
NAME        STATUS   AGE
custom-ns   Active   13m
(base) guoping-jia@default-notebook-0:~$ kubectl create deploy mybox -n custom-ns --image=busybox 
deployment.apps/mybox created
(base) guoping-jia@default-notebook-0:~$ kubectl get pods -n custom-ns
NAME                    READY   STATUS      RESTARTS     AGE
mybox-84bdf9578-b6tkh   0/1     Completed   1 (4s ago)   8s

(base) guoping-jia@default-notebook-0:~$ kubectl exec -it mybox-84bdf9578-b6tkh -n custom-ns -- bash
Error from server (Forbidden): pods "mybox-84bdf9578-b6tkh" is forbidden: User "system:serviceaccount:project-user-guoping-jia:default-editor" cannot create resource "pods/exec" in API group "" in the namespace "custom-ns"
```

```shell


[root@ai-cluster cr-aggregate]# cat ns-custom-editor.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: custom-editor
  namespace: custom-ns
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: custom-kubeflow-edit
subjects:
- kind: ServiceAccount
  name: default-editor
  namespace: project-user-guoping-jia
```

```shell

[root@ai-cluster cr-aggregate]# k apply -f ns-custom-editor.yaml
rolebinding.rbac.authorization.k8s.io/custom-editor created
[root@ai-cluster cr-aggregate]# k get rolebinding -n custom-ns
NAME             ROLE                               AGE
custom-editor    ClusterRole/custom-kubeflow-edit   8s
default-editor   ClusterRole/kubeflow-edit          12m
```

```shell


(base) guoping-jia@default-notebook-0:~$ kubectl create deploy nginx -n custom-ns --image=nginx 
deployment.apps/nginx created
(base) guoping-jia@default-notebook-0:~$ kubectl get pods -n custom-ns
NAME                     READY   STATUS    RESTARTS   AGE
nginx-5869d7778c-b4tcw   1/1     Running   0          56s
(base) guoping-jia@default-notebook-0:~$ kubectl exec -it nginx-5869d7778c-b4tcw -n custom-ns -- bash
root@nginx-5869d7778c-b4tcw:/# ls -al  
total 4
drwxr-xr-x.    1 root root   39 Feb  5 14:49 .
drwxr-xr-x.    1 root root   39 Feb  5 14:49 ..
lrwxrwxrwx.    1 root root    7 Jan  2 12:35 bin -> usr/bin
drwxr-xr-x.    2 root root    6 Jan  2 12:35 boot
drwxr-xr-x     5 root root  360 Feb  5 14:49 dev
drwxr-xr-x.    1 root root   41 Feb  4 23:53 docker-entrypoint.d
-rwxr-xr-x.    1 root root 1620 Feb  4 23:52 docker-entrypoint.sh
drwxr-xr-x.    1 root root   32 Feb  5 14:49 etc
drwxr-xr-x.    2 root root    6 Jan  2 12:35 home
lrwxrwxrwx.    1 root root    7 Jan  2 12:35 lib -> usr/lib
lrwxrwxrwx.    1 root root    9 Jan  2 12:35 lib64 -> usr/lib64
drwxr-xr-x.    2 root root    6 Feb  2 00:00 media
drwxr-xr-x.    2 root root    6 Feb  2 00:00 mnt
drwxr-xr-x.    2 root root    6 Feb  2 00:00 opt
dr-xr-xr-x. 3149 root root    0 Feb  5 14:49 proc
drwx------.    2 root root   37 Feb  2 00:00 root
drwxr-xr-x.    1 root root   38 Feb  5 14:49 run
lrwxrwxrwx.    1 root root    8 Jan  2 12:35 sbin -> usr/sbin
drwxr-xr-x.    2 root root    6 Feb  2 00:00 srv
dr-xr-xr-x.   13 root root    0 Nov 14 17:04 sys
drwxrwxrwt.    2 root root    6 Feb  2 00:00 tmp
drwxr-xr-x.    1 root root   66 Feb  2 00:00 usr
drwxr-xr-x.    1 root root   19 Feb  2 00:00 var
root@nginx-5869d7778c-b4tcw:/# exit
Exit
(base) guoping-jia@default-notebook-0:~$ 

``` 
 
Conclusion
 
### Conclusion
 
This blog post discussed how to simplify permission management accessing K8s resources in HPE PCAI. By using aggregate ClusterRoles, permission management with Kubernetes RBAC becomes more flexible and extensible. When you need to grant users additional permissions for new resources or namespaces, this mechanism automates and simplifies what would otherwise require manually updating existing roles. 

This blog post explored how permission management for accessing K8s resources in HPE PCAI can be significantly streamlined through the use of ClusterRole aggregation. This approach makes K8s RBAC more flexible and extensible by automatically incorporating new permissions as additional roles are introduced, eliminating the need for manual updates. At its core, K8s RBAC serves as the cluster’s gatekeeper, ensuring every user and service receives precisely the access they require. With ClusterRole aggregation, that model becomes even easier to manage, allowing roles to be combined dynamically and keeping permissions clean, scalable, and secure as new capabilities are added.

 
Please keep coming back to the [HPE Developer Community blog](https://developer.hpe.com/blog/) to learn more about HPE Private Cloud AI and get more ideas on how you can use it in your everyday operations.
 