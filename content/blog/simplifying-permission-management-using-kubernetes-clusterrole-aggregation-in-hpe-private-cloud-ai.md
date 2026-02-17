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

[HPE Private Cloud AI (PCAI)](https://developer.hpe.com/platform/hpe-private-cloud-ai/home/) is a turnkey, enterprise‑ready platform that brings together HPE and NVIDIA technologies to simplify and accelerate the deployment of AI workloads by running them on a K8s foundation. By leveraging standard K8s constructs, AI models, inference services, and supporting components are deployed into dedicated K8s namespaces in PCAI for clean separation, scalability, and lifecycle management. As part of its user‑centric design, PCAI automatically provisions a default Kubeflow notebook environment for each authenticated user, running as a containerized Pod inside that user’s personal K8s namespace, providing an isolated workspace for experimentation, data preparation, and model development.


The following sections will show you some practival examples of permission management in Kubeflow notebook server access in PCAI.

### Kubeflow Notebook servers

As part of a suite of pre‑integrated tools in PCAI, Kubeflow Notebooks has been deployed, along with a set of custom resource definitions (CRDs) and built‑in ClusterRoles. These ClusterRoles follow Kubernetes’ standard role patterns, *kubeflow-view*, *kubeflow-edit*, and *kubeflow-admin*, and can be assigned by K8s administrators to users or ServiceAccounts to manage access control within the cluster.

```shell


# kubectl get clusterroles | grep -e "kubeflow-edit" -e "kubeflow-view" -e "kubeflow-admin"
kubeflow-admin                                                         2025-11-20T03:25:34Z
kubeflow-edit                                                          2025-11-20T03:25:34Z
kubeflow-view                                                          2025-11-20T03:25:34Z

```

When a user logs into PCAI, a default Notebook server is already running inside that user’s dedicated project namespace, e.g., *project-user-guoping-jia*. 

![](/img/kubeflow-notebooks.png) 

Within this namespace, a RoleBinding named *default-editor* links the ServiceAccount *default-editor* to the Kubeflow ClusterRole *kubeflow-edit*. This ClusterRole provides the standard set of permissions required for typical Kubeflow operations. As a result, from the Notebook’s terminal, the user can read and write most Kubernetes resources within their namespace.


```shell
# kubectl get serviceaccount -n project-user-guoping-jia default-editor
NAME                      SECRETS   AGE

default-editor            0         24d

# kubectl get rolebinding -n project-user-guoping-jia default-editor
NAME                       ROLE                                   AGE
default-editor             ClusterRole/kubeflow-edit              24d
```

With default rolebinding binds to the ClusterRole *kubeflow-edit* in the namespace, it allows accessing to most K8s objects, including Secrets and Pods, etc. 

![](/img/notebook-server-terminal.png) 

### Granting additional permissions


With the default RoleBinding in the namespace, a user can access most K8s objects, including Pods and Secrets. However, they lack certain capabilities—such as listing all Secrets or performing privileged actions like executing commands inside a running Pod’s container. These permissions are sometimes necessary, for example, when verifying private container image configurations that depend on specific Secrets.

```shell







(base) guoping-jia@default-notebook-0:~$ kubectl auth can-i list secrets
no
(base) guoping-jia@default-notebook-0:~$ kubectl auth can-i get pods --subresource=exec
no

(base) guoping-jia@default-notebook-0:~$ kubectl exec -it default-notebook-0 -- sh
Error from server (Forbidden): pods "default-notebook-0" is forbidden: User "system:serviceaccount:project-user-guoping-jia:default-editor" cannot create resource "pods/exec" in API group "" in the namespace "project-user-guoping-jia"


(base) guoping-jia@default-notebook-0:~$ kubectl get secrets
Error from server (Forbidden): secrets is forbidden: User "system:serviceaccount:project-user-guoping-jia:default-editor" cannot list resource "secrets" in API group "" in the namespace "project-user-guoping-jia"
```

Considering the ClusterRole *kubeflow-edit* is binded to the ServiceAccount of each authenticated user to the PCAI, apporach of changing this shared ClusterRole by adding addtional permissions should not be taken. Othewise, all the other users will get additional permissions in their Kubeflow Notebook servers, which does not comply with the principle of the least privilegs.  

The following section describes an approach of creating a custom aggregated ClusterRole and easily extending it with additional permissions. 

* Create a *custom* version of ClusterRole *custom-kubeflow-edit* and apply it.

```shell



# cat custom-kubeflow-edit.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: custom-kubeflow-edit
aggregationRule:
  clusterRoleSelectors:
  - matchLabels:
      rbac.authorization.kubeflow.org/aggregate-to-custom-kubeflow-edit: "true"
rules: []

# kubectl apply -f custom-kubeflow-edit.yaml
clusterrole.rbac.authorization.k8s.io/custom-kubeflow-edit created

# kubectl get clusterroles custom-kubeflow-edit
NAME                   CREATED AT
custom-kubeflow-edit   2026-02-17T10:43:00Z
```

The custom label, *'rbac.authorization.kubeflow.org/aggregate-to-custom-kubeflow-edit: "true"'*, is defined in this ClusterRole, under its *aggregationRule* section. 

Type the following command to check the *rules* section of the deployed ClusterRole *custom*.

```shell
# kubectl get clusterrole custom-kubeflow-edit -o jsonpath='{.rules}' | jq .
null
```

* Create a ClusterRole *custom-list-secrets* for listing Secrets permissions and apply it.


GitHub repository:  https://github.com/GuopingJia/aggregate-clusterroles


```shell


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

# kubectl apply -f custom-list-secrets.yaml
clusterrole.rbac.authorization.k8s.io/custom-list-secret created
```

The ClusterRole defines a label, *'rbac.authorization.kubeflow.org/aggregate-to-custom-kubeflow-edit: "true"'*. 

Type the following command to verify the list Secrets permissions has been picked up and merged in to the aggregated ClusterRole *custom-kubeflow-edit*.

```shell
# kubectl get clusterrole custom-kubeflow-edit -o jsonpath='{.rules}' | jq .
[
  {
    "apiGroups": [
      ""
    ],
    "resources": [
      "secrets"
    ],
    "verbs": [
      "get",
      "list"
    ]
  }
]
```

* Create another ClusterRole *custom-list-secrets* for executing commands inside a Pod container, and apply it.

```shell
# cat custom-exec-pods.yaml
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

# kubectl apply -f custom-exec-pods.yaml
clusterrole.rbac.authorization.k8s.io/custom-exec-pods created
```

Type the following command to verify the exec commands permissions have been also picked up and merged in to the aggregated ClusterRole *custom-kubeflow-edit*.

```shell
[root@ai-cluster cr-aggregate]# k get clusterrole custom-kubeflow-edit -o jsonpath='{.rules}
' | jq .
[
  {
    "apiGroups": [
      "*"
    ],
    "resources": [
      "pods/exec"
    ],
    "verbs": [
      "*"
    ]
  },
  {
    "apiGroups": [
      ""
    ],
    "resources": [
      "secrets"
    ],
    "verbs": [
      "get",
      "list"
    ]
  }
]
```

* Create a RoleBinding to bind the custom ClusterRole *custom-kubeflow-edit* to the ServiceAccount *default-editor* in the user namespace *project-user-guoping-jia
```*. 

```shell


# cat custom-rolebinding.yaml
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

# kubectl apply -f custom-rolebinding.yaml
rolebinding.rbac.authorization.k8s.io/custom-editor created

# kubectl get rolebinding -n project-user-guoping-jia custom-editor
NAME            ROLE                               AGE
custom-editor   ClusterRole/custom-kubeflow-edit   84s                                                 2026-02-17T10:43:00Z
```

* Verify the added permissions

From Kubeflow Notebook server's terminal, you should be able to list the Secrets and execute the *bash* command in the Pods's container.  

```shell



(base) guoping-jia@default-notebook-0:~$ kubectl auth can-i list secrets
yes
(base) guoping-jia@default-notebook-0:~$ kubectl auth can-i get pods --subresource=exec
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
```

### Granting user access to other namespace


As another practical example of granting user permissions, this section describes another advanced permission requirement on accessing some other namespaces where some AI applications being deployed via PCAI Import Framework process and debugging any issue.

With default ClusterRole and RoleBinding settings, the authenticated user is not allowed to access other namespace, e.g., *custom-ns*. 

```shell




# kubectl create ns custom-ns
namespace/custom-ns created
# kubectl get ns | grep custom-ns
custom-ns                               Active   3s
```

```shell



(base) guoping-jia@default-notebook-0:~$ kubectl get ns custom-ns
Error from server (Forbidden): namespaces "custom-ns" is forbidden: User "system:serviceaccount:project-user-guoping-jia:default-editor" cannot get resource "namespaces" in API group "" in the namespace "custom-ns"
(base) guoping-jia@default-notebook-0:~$ kubectl get pods -n custom-ns
Error from server (Forbidden): pods is forbidden: User "system:serviceaccount:project-user-guoping-jia:default-editor" cannot list resource "pods" in API group "" in the namespace "custom-ns"
```

Follow up below steps to grant user access to the namespace.

* Create a RoleBinding *ns-default-editor* in the namespace *custom-ns* to bind the ClusterRole *default-editor* to the ServiceAccount *default-editor*. Apply it. 

```shell





# cat ns-default-editor.yaml
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


# kubectl apply -f ns-default-editor.yaml
rolebinding.rbac.authorization.k8s.io/default-editor created


# kubectl get rolebinding -n custom-ns
NAME             ROLE                        AGE
default-editor   ClusterRole/kubeflow-edit   10s
```

* Verify the namespace access.

```shell


(base) guoping-jia@default-notebook-0:~$ kubectl get ns custom-ns
NAME        STATUS   AGE
custom-ns   Active   13m
```

However, the user cann't list the Secrets in the namespace. Neither execute the commands in any running Pod's container.

```shell
(base) guoping-jia@default-notebook-0:~$ kubectl auth can-i list secrets -n custom-ns
no
(base) guoping-jia@default-notebook-0:~$ kubectl get secrets -n custom-ns
Error from server (Forbidden): secrets is forbidden: User "system:serviceaccount:project-user-guoping-jia:default-editor" cannot list resource "secrets" in API group "" in the namespace "custom-ns"
(base) guoping-jia@default-notebook-0:~$ kubectl auth can-i get pods --subresource=exec -n custom-ns
no
```

* Create another RoleBinding *ns-custom-editor* in the namespace *custom-ns* to bind the ClusterRole *custom-editor* to the ServiceAccount *default-editor* in the namespace *custom-ns*. Apply it. 

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


[root@ai-cluster cr-aggregate]# k apply -f ns-custom-editor.yaml
rolebinding.rbac.authorization.k8s.io/custom-editor created
[root@ai-cluster cr-aggregate]# k get rolebinding -n custom-ns
NAME             ROLE                               AGE
custom-editor    ClusterRole/custom-kubeflow-edit   8s
default-editor   ClusterRole/kubeflow-edit          12m
```

* Verify the permissions.

```shell
(base) guoping-jia@default-notebook-0:~$ kubectl auth can-i list secrets -n custom-ns
yes
(base) guoping-jia@default-notebook-0:~$ kubectl auth can-i get pods --subresource=exec -n custom-ns
yes



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


``` 


### Conclusion
 
This blog post discussed how to simplify permission management accessing K8s resources in HPE PCAI. By using aggregate ClusterRoles, permission management with Kubernetes RBAC becomes more flexible and extensible. When you need to grant users additional permissions for new resources or namespaces, this mechanism automates and simplifies what would otherwise require manually updating existing roles. 

This blog post explored how permission management for accessing K8s resources in HPE PCAI can be significantly streamlined through the use of ClusterRole aggregation. This approach makes K8s RBAC more flexible and extensible by automatically incorporating new permissions as additional roles are introduced, eliminating the need for manual updates. At its core, K8s RBAC serves as the cluster’s gatekeeper, ensuring every user and service receives precisely the access they require. With ClusterRole aggregation, that model becomes even easier to manage, allowing roles to be combined dynamically and keeping permissions clean, scalable, and secure as new capabilities are added.

 
Please keep coming back to the [HPE Developer Community blog](https://developer.hpe.com/blog/) to learn more about HPE Private Cloud AI and get more ideas on how you can use it in your everyday operations.
 