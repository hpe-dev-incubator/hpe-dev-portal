---
title: Automating application delivery to MKS clusters using GitOps with Argo CD
date: 2025-12-24T06:53:11.415Z
author: Guoping Jia
authorimage: /img/guoping.png
disable: false
---
This blog post describes how to automate application deployments to MKS clusters in HPE Private Cloud Enterprise using GitOps with *Argo CD*. By taking advantage of Argo CD's real-time monitoring and alerting features, it provides overall application deployment status and clear visibility into applicaiton synchronization. This approach helps ensure that deployed applications consistently reflect their declared state, improving reliability and reinforcing version control. 

### What is GitOps

GitOps is an operational model that extends core DevOps principles, like version control, collaboration, compliance, and CI (continuous integration)/CD (continuous delivery), and applies them to infrastructure automation. In a GitOps workflow, Git acts as the *single source of truth* for all declarative infrastructure and application configurations. The entire desired state of a Kubernetes (K8s) cluster, such as deployments, services, ConfigMaps, and more, is stored in Git. Automation tools like *Argo CD* or *Flux* continuously compare the cluster's live state with what's defined in the repository and reconcile any differences to ensure they match. Several well-known GitOps tools exist, including *Argo CD*, *Flux CD*, *Jenkins X*, and *Spinnaker*. For this blog, *Argo CD* will be the GitOps automation tool of choice. 

### What is Argo CD

*[Argo CD](https://argoproj.github.io/cd/)* is a declarative GitOps-driven continuous delivery tool for K8s. It enables automated, consistent, reliable and repeatable application deployment by using Git as the single source of truth for all configuration. *Argo CD* continuously monitors the live state of applications running in a K8s cluster and compares it with the desired state stored in a Git repository. When developers push updates to Git, *Argo CD* detects the changes and synchronizes them to the cluster. This synchronization can be configured to run automatically, commonly used for development and test envrionments, or manually, which is often preferred for production. You define the desired environment state in Git, while *Argo CD* ensures the applications deployed in the K8s cluster stay aligned with it. Beyond synchronization, *Argo CD* provides real-time visibility into application health, status, and drift through monitoring and alerting features. It integrates seamlessly with existing CI/CD pipelines and enforces GitOps best practices across the application deployment lifecyle.

### Prerequisites

Ensure that the following prerequisites are fulfilled:

* An MKS cluster has been provisioned from a HPE Private Cloud Enterprise workspace. You can refer to the blog post [Provisioning MKS clusters in HPE Private Cloud Enterprise](https://developer.hpe.com/blog/provisioning-mks-clusters-in-hpe-greenlake-for-private-cloud-enterprise/) to provision an MKS cluster.
* The *kubectl* CLI tool, together with the kubeconfig file for accessing the MKS cluster
* The *helm* CLI tool, version 3.12.0 or later

### Install Argo CD

You can install *Argo CD*, using either the install YAML script with *kubectl* or the Helm charts with \*\*helm. You can refer to the [Install Argo CD](https://argo-cd.readthedocs.io/en/stable/getting_started/) for the details.  

For the MKS clusters in HPE Private Cloud Enterprise, you can create a *Shell* script for installing *Argo CD* and add a Morpheus task using the *Shell* script as its content. The *Argo CD* can be installed by executing the Morpheus task from the MKS's master node. 

Here is the *Shell* script for installing *Argo CD*.

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

Perform the following steps to install *Argo CD* to the MKS cluster. 

1. From the Morpheus Dashboard, navigate to **Library -> Automation ->** *Tasks* tab. Click ***+Add***.

![](/img/add-task.png)

2. Enter NAME as *Install ArgoCD* and select TYPE as *Shell Script*. Then enable *SUDO* option and select SOURCE as *Local*. Paste the Shell script as CONTENT. Click ***SAVE CHANGES***.

![](/img/install-argocd-task.png)

3. Navigate to **Infrastructure -> Clusters**. Click the MKS cluster NAME, e.g., *mks-test*.

![](/img/mks-test-cluster.png)

4. Click *Nodes* tab. Click the MKS master node, e.g., *mks-test-master*.

![](/img/mks-test-nodes.png)

5. Click **Actions**. Select *Run Task*.

![](/img/mks-test-master-node.png)

6. Select *Install ArgoCD* as TASK. 

![](/img/mks-test-task-execute.png)

7. Click *History* tab. Click info *'i'* to see the logs of the *Run Task: Install ArgoCD*.

![](/img/mks-test-task-history.png)

You can check and confirm *Argo CD* is deployed successfully to the namespace *'argocd'*.

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

It should be noted that the *Argo CD* service *'argocd-server'* is configured as *ClusterIP* type. It can only be accessed internally within the cluster.

### Configure Argo CD access

In order to use *Argo CD* for application deployments, you need configure the *Argo CD* service to be accessible externally to the MKS cluster. There are some methods such as *port forwarding*, *NodePort* or *LoadBalancer* type services, or manual virtual private network (VPN) can be used. 

This section uses an alternative approach of exposing *Argo CD* service to public Internet using *Tailscale*. You can refer to the blog post [Exposing Grafana service using Tailscale for MKS monitoring in HPE Private Cloud Enterprise](https://developer.hpe.com/blog/exposing-grafana-service-using-tailscale-for-mks-monitoring-in-hpe-private-cloud-enterprise/) for the details about *Tailscale* and service exposing process. 

Perform the following steps to expost the *Argo CD* service endpoint. 

1. Change the *Argo CD* service type from *ClusterIP* to *LoadBalancer*.

```shell
$ kubectl edit svc/argocd-server -n argocd                                                                              service/argocd-server edited
```

2. Verify *Argo CD* service type.

```shell
$ kubectl get svc -n argocd
NAME                               TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)                      AGE
argocd-applicationset-controller   ClusterIP      172.30.219.75   <none>          7000/TCP                     2m47s
argocd-dex-server                  ClusterIP      172.30.32.229   <none>          5556/TCP,5557/TCP            2m47s
argocd-redis                       ClusterIP      172.30.65.186   <none>          6379/TCP                     2m47s
argocd-repo-server                 ClusterIP      172.30.1.116    <none>          8081/TCP                     2m47s
argocd-server                      LoadBalancer   172.30.64.166   172.20.20.242   80:30147/TCP,443:31601/TCP   2m47s
```

3. Create an *Ingress* YAML manifest file and apply it.

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

$ kubectl apply -f ingress-argocd.yaml
ingress.networking.k8s.io/ingress-argocd created

4. Verify the *Ingress* *'ingress-argocd'* is created with the assigned address.

$ k get ingress -n argocd
NAME             CLASS       HOSTS   ADDRESS                    PORTS     AGE
ingress-argocd   tailscale   *       argocd.qilin-beta.ts.net   80, 443   8s
```

5. From Tailscale admin console, a new machine named *'argocd'* appears under the *Machines* tab.

![](/img/tailscale-argocd.png)

6. Start the browser by pointing to the *Argo CD* Funnel URL, i.e., *'argocd.qilin-beta.ts.net '*.

![](/img/argocd-login.png)

You can log in to *Argo CD* using the username *'admin'*. 

Type the following command to get the admin password.

```shell
$ kubectl get secret -n argocd argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

### Deploy applications using *Argo CD*

Using *Argo CD* service endpoint, you can now start connecting your application code repository and deploying them to the MKS cluster. 

#### Connect application repository

The Helm charts of the sample *WordPress* application are available from GitHub repository [helm-demo](https://github.com/GuopingJia/helm-demo). This section describes the process to connect this application repository in *Argo CD*.

* Navigate ***Settings -> Repository***. Click ***+ CONNECT REPO***.

![](/img/argocd-git.png)

* Choose your connection method as *VIA HTTP/HTTPS*, select Type as *git* and Project as *default*, specify optional Name as *wordpress* and provide Repository URL, e.g., *https://github.com/GuopingJia/helm-demo*. Click **CONNECT**. 

![](/img/argocd-git-connect.png)

* After a few seconds, the CONNECTION STATUS of the Git repository shows as *Successful*.

![](/img/argocd-git-wordpress.png)

#### Create application

Follow the process to create a new app for application deployment.

* Click ***Applications***. Click ***CREATE APPLICATION***.

![](/img/argocd-application.png)

* Specify Application Name as *wordpress-app*, select Project Name as *default* and SYNC POLICY as *Automatic*, select SOURCE Repository URL, its Revision as *HEAD*, Path as *wordpress*, select DESTINATION Cluster URL as *https://kubernetes.default.svc* and Namespace as *wordpress*. Enable other options, e.g., ENABLE AUTO-SYNC, SELF HEAL, AUTO-CREATE NAMESPACE and RETRY. Click ***CREATE***.

***Note***: Under *SYNC POLICY*, if you select *Manual*, *Argo CD* will detect the changes in your Git repository, but it’s not going to apply them to the MKS cluster. You will need to go into *Argo CD* Applications page and hit the *SYNC* button before the changes are made to your application. 

![](/img/argocd-application-create.png)

* The application *wordpress-app* starts being deployed.

![](/img/argocd-application-pogressing.png)

* After a few seconds, the application is deployed successfully with APP HEALTH as *Healthy* and SYNC STATUS as *Synced*.

![](/img/argocd-application-running.png)

#### Make changes to application repository

Now let’s try to make some changes to the application repository, increasing the replica from the default *1* to *2* for the *WordPress* application.

![](/img/git-repo-changes.png)

As soon as you commit the changes in the repository, *Argo CD* will look for the changes and start sync'ing the changes in the MKS cluster.

![](/img/argocd-application-syncing.png)

Type the following command, you can check that the *WordPress* now has 2 PODs running in the MKS cluster.

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

### Access WordPress application

You can expose the *WordPress* application using *Tailscale*. 

1. Create an *Ingress* YAML manifest.

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

2. Apply the Ingress to the namespace *wordpress*.

```shell
$ kubectl apply -f ingress-wordpress.yaml
ingress.networking.k8s.io/ingress-wordpress created

3. Check the Ingress *ingress-wordpress* is create with its assigned Tailscale Funnel URL *wordpress.qilin-beta.ts.net*.

$ kubectl get ingress -n wordpress
NAME                CLASS       HOSTS   ADDRESS                       PORTS     AGE
ingress-wordpress   tailscale   *       wordpress.qilin-beta.ts.net   80, 443   7s
```

4. From Tailscale admin console, a new machine named *'wordpress'* appears under the *Machines* tab.

![](/img/tailscale-wordpress.png)

5. The *WordPress* application is accessible by pointing its Tailscale Funnel URL in the browser.

![](/img/wordpress-ui.png)

### Conclusion

This blog post provided a detailed walkthrough of how to automate application deployments to MKS clusters in HPE Private Cloud Enterprise using GitOps with *Argo CD*. It covered the process of deploying *Argo CD* through a Morpheus task executed on the MKS master node, configuring application deployments via a publicly accessible *Argo CD* endpoint exposed with *Tailscale Funnel*, and monitoring the real-time state of applications running in the MKS cluster. 

It's importatnt to remember that while *Argo CD* manages continuous delivery (CD), it still relies on a separate continuous integration (CI) pipeline. The CI pipeline is responsible for testing and building the application whenever developers update the source code. During this phase, the application is validated, container images are built and pushed to an image registry, and the CI system can update the configuration repository, often a separate repository from the application's source code and connected to *Argo CD*. These updates then trigger *Argo CD* to synchronize the desired state with the cluster. This workflow represents a common GitOps pattern used across many organizations. By integrating seamlessly with existing CI/CD systems, *Argo CD* helps teams implement GitOps practices effectively.

Please keep coming back to the [HPE Developer Community blog](https://developer.hpe.com/blog/) to learn more about HPE Private Cloud Enterprise and get more ideas on how you can use it in your everyday operations.