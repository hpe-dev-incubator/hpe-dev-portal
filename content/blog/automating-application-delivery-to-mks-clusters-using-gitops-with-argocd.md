---
title: Automating application delivery to MKS clusters using GitOps with Argo CD
date: 2025-12-24T06:53:11.415Z
author: Guoping Jia
authorimage: /img/guoping.png
disable: false
---
<style> li { font-size: 27px; line-height: 33px; max-width: none; } </style>

### What is GitOps

GitOps is an operational framework that takes DevOps best practices used for application development such as version control, collaboration, compliance, and CI/CD tooling, and applies them to infrastructure automation. GitOps uses Git as the single source of truth for declarative infrastructure and applications. Everything about the desired state of your K8s cluster, such as deployments, services, ConfigMaps, etc, is stored in Git , and automation tools like *Argo CD* or Flux compare the live cluster state with the desired state in Git and sync the actual cluster state to match what’s in Git. There is a list of popular GitOps tools, such as *Argo CD*, *Flux CD*, *Jenkins X*, and *Spinnaker*, etc. This blog will choose *Argo CD* as one of GitOps automation tools. 

### What is Argo CD

[*Argo CD*](https://argoproj.github.io/cd/) is a declarative GitOps based continuous delivery tool for Kubernetes (K8s). It helps deploy and manage applications on K8s clusters in an automated, reliable and repeatable way. It does it by continuously monitoring the current live state of applications in a cluster and compares it against the desired state defined in a Git repository. This is commonly referred to as making Git your Source of Truth for your configurations. Whenever a developer pushes changes to a Git repository, *Argo CD* will detect the changes and sync them to the K8s cluster. Syncing can either be a manual or automatic process depending on how you configure it. It can be a prett common pattern to just automatically sync changes from Dev and Test environments but have your production applications require someone manually syncing. So, that’s really the big picture of what you need to know for *Argo CD* at a high level. You define your settings in a Git repository and *Argo CD* makes sure your environments reflect what’s in Git.  

### Prerequisites

Before starting, make sure you have the following:

* A K8s cluster, being provisioned in HPE GreenLake for Private Cloud Enterprise
* The *kubectl* CLI tool, together with the kubeconfig file for accessing the K8s cluster
* The *helm* CLI tool, version 3.12.0 or later

### Set up Argo CD

You can install *MetalLB* and set up the load balancer in the K8s cluster by following the instructions shown in the blog post [Setting up the load balancer with MetalLB](https://developer.hpe.com/blog/set-up-load-balancer-with-metallb-in-hpe-greenlake-for-private-cloud-enterprise/).

Type the following commands to deploy *Super Mario* and *Tetris* to the namespace *cfe-games* in the cluster:

The Shell script for installing *Argo CD*:

```shell
#!/bin/bash

curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3

chmod 700 get_helm.sh

./get_helm.sh

helm repo add argo https://argoproj.github.io/argo-helm

if [ -f "/etc/kubernetes/admin.conf" ];
then
  helm install argocd argo/argo-cd --version 9.1.3 -n argocd --create-namespace --kubeconfig /etc/kubernetes/admin.conf
else
  echo "Its worker node.!! skiping installation"
fi
```

![](/img/install-argocd-task.png)

![](/img/mks-test-cluster.png)

![](/img/mks-test-nodes.png)

![](/img/mks-test-master-node.png)

![](/img/mks-test-task-execute.png)

![](/img/mks-test-task-history.png)

```shell
$ kubectl get ns argocd
NAME     STATUS   AGE
argocd   Active   52s
$ k get all -n argocd
NAME                                                    READY   STATUS      RESTARTS   AGE
pod/argocd-application-controller-0                     1/1     Running     0          48s
pod/argocd-applicationset-controller-579f778f57-m4t4d   1/1     Running     0          48s
pod/argocd-dex-server-7d99b44d96-bjvxn                  1/1     Running     0          48s
pod/argocd-notifications-controller-57dd69d5d9-5dtw2    1/1     Running     0          48s
pod/argocd-redis-9ff9dddb8-x58gp                        1/1     Running     0          48s
pod/argocd-redis-secret-init-9hqtt                      0/1     Completed   0          52s
pod/argocd-repo-server-56dbf9bd9-xbx8z                  1/1     Running     0          48s
pod/argocd-server-5d56b98664-q2l5f                      1/1     Running     0          48s

NAME                                       TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)             AGE
service/argocd-applicationset-controller   ClusterIP   172.30.219.75   <none>        7000/TCP            50s
service/argocd-dex-server                  ClusterIP   172.30.32.229   <none>        5556/TCP,5557/TCP   50s
service/argocd-redis                       ClusterIP   172.30.65.186   <none>        6379/TCP            50s
service/argocd-repo-server                 ClusterIP   172.30.1.116    <none>        8081/TCP            50s
service/argocd-server                      ClusterIP   172.30.64.166   <none>        80/TCP,443/TCP      50s

NAME                                               READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/argocd-applicationset-controller   1/1     1            1           50s
deployment.apps/argocd-dex-server                  1/1     1            1           49s
deployment.apps/argocd-notifications-controller    1/1     1            1           50s
deployment.apps/argocd-redis                       1/1     1            1           49s
deployment.apps/argocd-repo-server                 1/1     1            1           50s
deployment.apps/argocd-server                      1/1     1            1           49s

NAME                                                          DESIRED   CURRENT   READY   AGE
replicaset.apps/argocd-applicationset-controller-579f778f57   1         1         1       50s
replicaset.apps/argocd-dex-server-7d99b44d96                  1         1         1       49s
replicaset.apps/argocd-notifications-controller-57dd69d5d9    1         1         1       50s
replicaset.apps/argocd-redis-9ff9dddb8                        1         1         1       49s
replicaset.apps/argocd-repo-server-56dbf9bd9                  1         1         1       49s
replicaset.apps/argocd-server-5d56b98664                      1         1         1       49s

NAME                                             READY   AGE
statefulset.apps/argocd-application-controller   1/1     49s

NAME                                 STATUS     COMPLETIONS   DURATION   AGE
job.batch/argocd-redis-secret-init   Complete   1/1           3s         53s
```

```shell
$ kubectl edit svc/argocd-server -n argocd                                                                              service/argocd-server edited


$ kubectl get svc -n argocd
NAME                               TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)                      AGE
argocd-applicationset-controller   ClusterIP      172.30.219.75   <none>          7000/TCP                     2m47s
argocd-dex-server                  ClusterIP      172.30.32.229   <none>          5556/TCP,5557/TCP            2m47s
argocd-redis                       ClusterIP      172.30.65.186   <none>          6379/TCP                     2m47s
argocd-repo-server                 ClusterIP      172.30.1.116    <none>          8081/TCP                     2m47s
argocd-server                      LoadBalancer   172.30.64.166   172.20.20.242   80:30147/TCP,443:31601/TCP   2m47s
```

```shell
$ cat ingress-argocd.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-argocd
  namespace: argocd
  annotations:
    tailscale.com/funnel: "true"
spec:
  defaultBackend:
    service:
      name: argocd-server
      port:
        number: 443
  ingressClassName: tailscale
  tls:
    - hosts:
        - argocd
```

```shell
$ kubectl apply -f ingress-argocd.yaml
ingress.networking.k8s.io/ingress-argocd created
$ k get ingress -n argocd
NAME             CLASS       HOSTS   ADDRESS                    PORTS     AGE
ingress-argocd   tailscale   *       argocd.qilin-beta.ts.net   80, 443   8s
```

![](/img/tailscale-argocd.png)

```shell
$ kubectl get secret -n argocd argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
XFnhHPm0JCMTIAvJ
```

![](/img/argocd-login.png)

Settings / Repositories / + CONNECT

![](/img/argocd-git-connect.png)

![](/img/argocd-git-wordpress.png)

Applications / CREATE APPLICATION 

![](/img/argocd-application-create.png)

![](/img/argocd-application-pogressing.png)

![](/img/argocd-application-running.png)

![](/img/git-repo-changes.png)

![](/img/argocd-application-syncing.png)

![](/img/argocd-application-synced.png)

```shell
$ kubectl get all -n wordpress
NAME                                READY   STATUS    RESTARTS   AGE
pod/wordpress-app-df478fc99-gwffz   1/1     Running   0          23s
pod/wordpress-app-df478fc99-qrrg4   1/1     Running   0          22s
pod/wordpress-app-mariadb-0         1/1     Running   0          162m

NAME                            TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)                      AGE
service/wordpress-app           LoadBalancer   172.30.18.82    172.20.20.243   80:30704/TCP,443:32092/TCP   162m
service/wordpress-app-mariadb   ClusterIP      172.30.18.199   <none>          3306/TCP                     162m

NAME                            READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/wordpress-app   2/2     2            2           162m

NAME                                       DESIRED   CURRENT   READY   AGE
replicaset.apps/wordpress-app-69fdf9dcd9   0         0         0       162m
replicaset.apps/wordpress-app-df478fc99    2         2         2       23s

NAME                                     READY   AGE
statefulset.apps/wordpress-app-mariadb   1/1     162m
```

```shell
$ cat ingress-wordpress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-wordpress
  namespace: wordpress
  annotations:
    tailscale.com/funnel: "true"
spec:
  defaultBackend:
    service:
      name: wordpress-app
      port:
        number: 443
  ingressClassName: tailscale
  tls:
    - hosts:
        - wordpress
```

```shell
$ kubectl apply -f ingress-wordpress.yaml
ingress.networking.k8s.io/ingress-wordpress created
$ k get ingress -n wordpress
NAME                CLASS       HOSTS   ADDRESS                       PORTS     AGE
ingress-wordpress   tailscale   *       wordpress.qilin-beta.ts.net   80, 443   7s
```

![](/img/tailscale-wordpress.png)

![](/img/wordpress-ui.png)

### Conclusion

This blog post offers you a comprehensive guide on 

Let’s now look at an example real world pipeline that should give you a better understanding of the complete flow.When it comes to GitOps, it’s a best practice to have two repositories. One for your application source code and another for your configuration code. In your configuration repository, you should have your K8s manifests, Helm charts, or customize files, which define your K8s resources, such as deployments, services, ConfigMap, whatever this configuration repository gets updated, that’s when ArgoCD is going to kick in and do its sync. But that’s not all there is to this story. Let’s remember that ArgoCD is a continuous delivery tool, we still require a pipeline for continuous integration that will test and build our application when a developer updates the application source code that’s when the code is going to be tested and the image will be built and pushed to a container repository your CI pipeline then could trigger updates to your configuration repository which would cause ArgoCD to sync. This is a good example pipeline that many companies use when implementing GitOps into their workflow. 

Please keep coming back to the [HPE Developer Community blog](https://developer.hpe.com/blog/) to learn more about HPE GreenLake for Private Cloud Enterprise and get more ideas on how you can use it in your everyday operations.