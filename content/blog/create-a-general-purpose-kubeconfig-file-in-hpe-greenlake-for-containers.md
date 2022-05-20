---
title: Create a General-Purpose Kubeconfig File in HPE GreenLake for Containers
date: 2022-05-20T07:02:51.728Z
author: Guoping Jia
authorimage: /img/guoping.png
---
## Introduction
[HPE GreenLake for Containers](https://www.hpe.com/us/en/greenlake/containers.html), one of the HPE GreenLake Cloud services, is built on  [HPE Ezmeral Runtime Enterprise](https://www.hpe.com/us/en/software/ezmeral-runtime.html) and deployed as an enterprise-grade container management service using open source Kubernetes. HPE GreenLake for Containers provides a standardized way to create Kubernetes clusters using cluster blueprints. It allows you to view details about created clusters and launch to the HPE Ezmeral Runtime Enterprise, where you can view a dashboard that displays the status of all Kubernetes services and resource utilization across all clusters. It also allows you to download the kubectl binary, together with the kubeconfig file of the cluster, in order to access and deploy applications to the cluster from the command line using kubectl. 

<img src="/img/hpe-ecp-dashboard.png" width="480" height="538" alt="HPE ECP Dashboard">

However, there are a couple of issues using the downloaded kubeconfig file from the dashboard:

1. The kubeconfig file is tied to the user who logs in to HPE GreenLake for Containers. There are a number of use cases that access the Kubernetes cluster from outside, with script that uses kubectl or a client library, which are not tied to any particular user. Providing a kubeconfig file that’s tied to your user is not considered to be a clean design. Given that each user may have different privileges, providing the kubeconfig file to allow access to the cluster might violate the principle of least privilege. 

2. Since launching to the HPE Ezmeral Runtime Enterprise is configured through SAML SSO, a session token is fetched and added to the kubeconfig file each time when you launch to the dashboard. With HPE GreenLake for Containers, the session token is configured to expire after an hour. You will be unable to use the downloaded kubeconfig file to access the cluster after token expiration. You have to re-launch to the dashboard and download again the kubeconfig file.

3. The kubeconfig is generated for the HPE Ezmeral Runtime Enterprise. It contains commands to show version, authenticate and refresh of the environment. The standard kubectl tool installed from the official Kubernetes site does not work with this kubeconfig file. You have to download the HPE kubectl plugin, available from the same dashboard, and use it together with the kubectl and the kubeconfig file. 

You need a cleaner solution to have a kubeconfig file that is not tied to a specific user, has the right set of privileges, and works permanently with the standard kubectl tool. This blog post walks you through the process of creating a general-purpose kubeconfig file that allows to access and deploy applications to the Kubernetes cluster in HPE GreenLake for Containers. The created kubeconfig files can be used by any external scripts, especially the CI/CD pipeline setup, to work with the Kubernetes cluster.

## Prerequisites
You need to download the Kubectl binary, together with the HPE Kubectl plugin and the kubeconfig file, from the launched HPE Ezmeral Runtime Enterprise Dashboard. The downloaded Kubectl binary and its plugin need to be set up in your environment. To simplify the setup process, you export the environment variable `KUBECONFIG` and point it to the downloaded kubeconfig file. With those setups in place, you can access the Kubernetes cluster created in the HPE GreenLake for Containers. You have access to permissions that can create and update the following resources in the Kubernetes cluster:
-	Kubernetes Service Account(s)
-	Kubernetes Roles & Rolebindings

## Setup Details
### Create a Kubernetes Service Account
Here is the yaml manifest file to create a service account in the Kubernetes cluster. You replace the name `cfe-demo-serviceaccount` with your service account name.
```json
# serviceaccount.yml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: cfe-demo-sa
```

```bash
$ kubectl apply -f serviceaccount.yaml 
serviceaccount/cfe-demo-sa created

$ kubectl get serviceaccounts cfe-demo-sa 
NAME          SECRETS   AGE
cfe-demo-sa   1         24s
```
### Create a Role
Here is the yaml manifest file to create a role with a set of permissions which represents the access rights that you want for your script and setup. 
```json
# role.yml
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: cfe-demo-role
rules:
- apiGroups:
  - ""
  resources:
  - bindings
  - podtemplates
  - replicationcontrollers
  - pods
  - services
  - serviceaccounts
  - endpoints
  - persistentvolumeclaims
  - events
  - configmaps
  - secrets
  - pods/exec
  - pods/log
  - pods/portforward
  verbs:
  - '*'
- apiGroups:
  - rbac.authorization.k8s.io
  resources:
  - roles
  - rolebindings
  verbs:
  - '*'
- apiGroups:
  - apps
  resources:
  - controllerrevisions
  - statefulsets
  - deployments
  - replicasets
  - daemonsets
  verbs:
  - '*'
- apiGroups:
  - autoscaling
  resources:
  - horizontalpodautoscalers
  verbs:
  - '*'
- apiGroups:
  - batch
  resources:
  - cronjobs
  - jobs
  verbs:
  - '*'
```
```bash
$ kubectl apply -f role.yaml 
role.rbac.authorization.k8s.io/cfe-demo-role created

$ kubectl get role cfe-demo-role 
NAME            CREATED AT
cfe-demo-role   2022-05-19T20:51:57Z
```
You replace the `cfe-demo-role` with your role name. The [Using RBAC Authorization](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) section of the Kubernetes documentation provides details on how to configure the Role resource. You check carefully the permissions for the access rights that you want for your script and setup by complying with the [Principle of Least Privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege).


### Grant Permissions to Service Account
Here is the RoleBinding manifest file to bind the role `cfe-demo-role` to the service account `cfe-demo-sa`. You replace those names with the names in your environment.


```json
# rolebinding.yml
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: cfe-demo-rb
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: cfe-demo-role # Should match name of Role
subjects:
- kind: ServiceAccount
  name: cfe-demo-sa # Should match service account name
```



```bash
$ kubectl apply -f rolebinding.yaml 
rolebinding.rbac.authorization.k8s.io/cfe-demo-rb created

$ kubectl get rolebindings cfe-demo-rb 
NAME          ROLE                 AGE
cfe-demo-rb   Role/cfe-demo-role   19s
```

### Extract Service Account Token

```bash
$ kubectl describe serviceaccounts cfe-demo-sa 
Name:                cfe-demo-sa
Namespace:           cfe-demo-cluster
Labels:              <none>
Annotations:         Image pull secrets:  <none>
Mountable secrets:   cfe-demo-sa-token-2zlzf
Tokens:              cfe-demo-sa-token-2zlzf
Events:              <none>

$ kubectl describe secrets cfe-demo-sa-token-2zlzf 
Name:         cfe-demo-sa-token-2zlzf
Namespace:    cfe-demo-cluster
Labels:       <none>
Annotations:  kubernetes.io/service-account.name: cfe-demo-sa
              kubernetes.io/service-account.uid: a467f9bd-655d-413f-ad77-5156d03d2322

Type:  kubernetes.io/service-account-token

Data
====
ca.crt:     1066 bytes
namespace:  16 bytes
token:      <hidden>
```

Note that if you use `-o yaml` instead of `describe`, you get a base64-encoded version of the token. You must decode it before you use it. 

If you access the Kubernetes API directly, e.g., from `curl`, you can use the token as the bearer token for the authorization header. Kubernetes clients, using kubectl directly or in your scripts, usually make you load configs from the kubecofnig file. You need to follow up the following sections to create such a kubeconfig file.



### Create a Kubeconfig File



```bash
# create-kubeconfig.sh

# Update those variables to match your environment
SERVICE_ACCOUNT_NAME="cfe-demo-sa"
CONTEXT=$(kubectl config current-context)
NEW_CONTEXT="cfe-demo-context"
TOKEN_USER="cfe-token-user"
KUBECONFIG_FILE="kubeconfig-sa"

# Extract service account token
SECRET_NAME=$(kubectl get serviceaccount ${SERVICE_ACCOUNT_NAME} --context ${CONTEXT}  -o jsonpath='{.secrets[0].name}')
TOKEN_DATA=$(kubectl get secret ${SECRET_NAME}  --context ${CONTEXT}  -o jsonpath='{.data.token}')
TOKEN=$(echo ${TOKEN_DATA} | base64 -d)

#Create a general-purpose kubeconfig file
kubectl config view --raw > tmp.raw
kubectl --kubeconfig tmp.raw config use-context ${CONTEXT}
kubectl --kubeconfig tmp.raw config view --flatten --minify > tmp.min
kubectl config --kubeconfig tmp.min rename-context ${CONTEXT} ${NEW_CONTEXT}
kubectl config --kubeconfig tmp.min  set-credentials ${TOKEN_USER} --token ${TOKEN}
kubectl config --kubeconfig tmp.min set-context ${NEW_CONTEXT} --user ${ TOKEN_USER }
kubectl config --kubeconfig tmp.min view --flatten --minify > ${KUBECONFIG_FILE}

# Cleanup tmp
rm tmp.raw
rm tmp.min

```


```bash
$ bash create-kubeconfig.sh 
Switched to context "fab-zero-cfe-demo-cluster-cfe-demo-cluster-guoping.jia@hpe.com".
Context "fab-zero-cfe-demo-cluster-cfe-demo-cluster-guoping.jia@hpe.com" renamed to "cfe-demo-context".
User "cfe-token-user" set.
Context "cfe-demo-context" modified.
```

A general-purpose kubeconfig file `kubeconfig-sa` is created by running above script. After export it as the environment variable `KUBECONFIG`, you can access the Kubernetes cluster and check all the resources by running `kubectl get all`.



```bash
$ export KUBECONFIG=kubeconfig-sa


$ kubectl get all
No resources found in cfe-demo-cluster namespace.
```
## Conclusion
This blog post shows you how to create a general-purpose kubeconfig file using a service account. The kubeconfig is not tied to any specific user. It is binded with a list of permissions carefully chosen for your access to the Kubernetes cluster. The created kubeconfig works permanently with both downloaded kubectl from HPE GreenLake for Containers Dashboard and the standard one from the Kubernetes site. This allows to use it in any Kubernetes client scripts, esp., in Kubernetes *CI/CD* pipelines.

