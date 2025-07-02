---
title: Setting up Harbor as a local container registry in HPE Private Cloud AI
date: 2025-06-30T15:31:53.670Z
author: Guoping Jia
authorimage: /img/guoping.png
disable: false
---
A container registry serves as a centralized system for storing and managing container images. In today’s fast-paced containerized application development landscape, speed, security and control over container workflows using a robust container registry are critical. While both cloud-based container registries, such as Google Container Registry (*GCR*), Azure Container Registry (*ACR*), and Amazon Elastic Container Registry (*ECR*), and third-party services like *DockerHub*, GitHub / GitLab Container Registry, and JFrog Container Registry, offer convenience, organizations often face challenges with latency, external dependencies, and security compliance constraints. 

This blog post describes the process of deploying *Harbor* and setting it up as a local container registry within *HPE Private Cloud AI*. By using *Harbor* as a local registry, organizations gain faster image access, reduced reliance on external networks, enhanced security posture, and a tailored environment that aligns with compliance and governance needs.

## HPE Private Cloud AI

[HPE Private Cloud AI (PCAI)](https://www.hpe.com/us/en/private-cloud-ai.html) offers a comprehensive, turnkey AI solution designed to address key enterprise challenges, from selecting the appropriate large language models (LLMs) to efficiently hosting and deploying them. Beyond these core functions, PCAI empowers organizations to take full control of their AI adoption journey by offering a curated set of pre-integrated NVIDIA NIM LLMs, along with a powerful suite of AI tools and frameworks for *Data Engineering*, *Analytics*, and *Data Science*. 

The *Import Framework* in PCAI further enhances flexibility by enabling customers to integrate their own applications or third-party solutions alongside pre-installed components, accommodating a wide range of enterprise-specific use cases. 

![](/img/pcai-import-framework.png)

This blog post guides you through the step-by-step process of deploying the open-source *Harbor* into PCAI using the *Import Framework*. Once deployed and configured, *Harbor* can serve as a local container registry within PCAI. With key features such as policy management, role-based access control (RBAC), security scanning, and image signing, *Harbor* strengthens container lifecycle security and governance. 

## Prerequisites

Before starting, make sure that [Docker Engine](https://docs.docker.com/engine/install/), version *28.1.1* or later, is installed, including the default *docker* CLI, which will used for building and pushing images.

The following sections detail application deployment using the *kubectl* CLI and *kubeconfig* to access the PCAI Kubernetes (K8s) cluster. However, direct cluster access via *kubectl* is generally not required.

## Harbor

*Harbor* is an open-source container registry designed for cloud-native environments like K8s. It securely stores and manages container images with policies and RBAC, ensures images are scanned and free from vulnerabilities, and signs images as trusted.  

The following sections describe in detail how to deploy *Harbor* into PCAI using the *Import Framework*. You will learn how to create a private project, create users and assign them with specific role permissions, and push images using *Harbor* credentials. Used as a local image registry witin PCAI, *Harbor* helps ensure your container images remain secure and well governed. 

### Harbor deployment via PCAI *Import Framework*

Based on the latest Helm charts from the official [*Harbor* site](https://helm.goharbor.io/harbor-1.17.0.tgz), the following required YAML manifest files have been added under *templates/ezua/*:

* *virtualService.yaml*: an Istio *VirtualService* configuration file to define routing rules for incoming requests.
* *kyverno-cluster-policy*: a Kyverno *ClusterPolicy* file to add the required labels to the deployment.

The default *values.yaml* file has been also updated with the following contents:

* appended an *ezua* section to define the *Istio Gateway* and expose a service endpoint: 

```bash
      ezua:

        virtualService:
          endpoint: "harbor.${DOMAIN_NAME}"
          istioGateway: "istio-system/ezaf-gateway"
```

* increased the *Harbor* registry size from the default *5G* to *500G*:

```bash
      persistence.persistentVolumeClaim.registry.size = 500G
```

The updated *Harbor* Helm charts have been available from GitHub repository [*pcai-helm-examples*](https://github.com/GuopingJia/pcai-helm-examples/tree/main/harbor).  
Using updated Helm charts, *Harbor* can be easily deployed into PCAI via the *Import Framework*:

![](/img/import-harbor.png)

### Harbor UI access via its endpoint

After *Harbor* is installed through PCAI *Import Framework*, an **Imported** *Harbor* tile is added to *Tools & Frameworks*, under *Data Science* tab. A virtual service endpoint, e.g., *https://harbor.ingress.pcai0104.ld7.hpecolo.net*, has been configured and exposed for *Harbor* access. 
 
![](/img/harbor-deployment.png)

Simply clicking *Open* button, or copying the endpoint URL to the browser, the *Harbor* login page shows up in a new window:

![](/img/harbor-login.png)

Using the default Harbor *admin* user credentials, you can log into *Harbor* projects page:

![](/img/harbor-ui.png)

### Harbor project and user creation

*Harbor* manages container images through projects. A project contains all image repositories of an application. Images cannot be pushed to *Harbor* before a project is created. By default, there is a public project *library* pre-created. You can create your project by clicking *+ NEW PRORJECT*:

![](/img/create-project.png)

You should always create a private project to restrict any user to pull images from the *Harbor* project. The private project *demo* is created using the default unlimited (**-1**) quota. However, you can add quota, e.g., *500G*, to limit project usage of registry capacity, in your production setup.

You can then create users and add them as the members to a project using RBAC. 

In this section, two users, *pcai-developer*, & *pcai-admin*, are created: 

![](/img/two-users-harbor.png)

In addition to the default admin user, these two newly created users have been added as members to the project *demo* with the role *Developer* and *Maintainer*, respectively. The user *pcai-developer* has read and write privileges for the project, while *pcai-admin* has elevated permissions including the ability to scan images, view replication jobs and delete images. 

![](/img/project-member.png)

Please refer to [Harbor Managing Users](https://goharbor.io/docs/2.13.0/administration/managing-users/) for the detailed permissions in each role. As a best practice in production environment, it’s highly recommended to set up users with different role assignments in *Harbor*. 

### Pushing Images to Harbor Registry

With the project and users created, you can now push the container images using the following steps:

* *Log into Harbor registry*

Log into *Harbor* registry from the Docker client by running the command using the user *pcai-admin* credentials:

```shell
$ docker login harbor.ingress.pcai0104.ld7.hpecolo.net
Username: pcai-developer
Password:

WARNING! Your credentials are stored unencrypted in '/home/guoping/.docker/config.json'.
Configure a credential helper to remove this warning. See
https://docs.docker.com/go/credential-store/

Login Succeeded
```

If you get any certificate error when trying to log in from your Linux client, you can edit the file */etc/docker/daemon.json* to add the line below, by replacing the *Harbor* registry URL with your own one. 

```shell
{
  "insecure-registries" : [" harbor.ingress.pcai0104.ld7.hpecolo.net "]
}
```

You need to run *'systemctl daemon-reload'* and restart the *docker* service after you edit the file */etc/docker/daemon.json*.

* *Tag an existing image*

Instead of building a Docker image using a Dockerfile, we pull a sample nginx image, *'pcaidemo/cfe-nginx'*, from *DockerHub* and tag it with the *Harbor* registry URL and project name: 

```shell
$ docker images
REPOSITORY           TAG       IMAGE ID       CREATED        SIZE
pcaidemo/cfe-nginx   v0.1.0    1e5f3c5b981a   2 months ago   192MB

$ docker tag pcaidemo/cfe-nginx:v0.1.0 harbor.ingress.pcai0104.ld7.hpecolo.net/demo/cfe-nginx:v0.1.0

$ docker images
REPOSITORY                                               TAG       IMAGE ID       CREATED        SIZE
pcaidemo/cfe-nginx                                       v0.1.0    1e5f3c5b981a   2 months ago   192MB
harbor.ingress.pcai0104.ld7.hpecolo.net/demo/cfe-nginx   v0.1.0    1e5f3c5b981a   2 months ago   192MB
```

* *Pushing the image to Harbor registry*

Push the image to the Harbor registry by running the command:

```shell
$ docker push harbor.ingress.pcai0104.ld7.hpecolo.net/demo/cfe-nginx:v0.1.0
The push refers to repository [harbor.ingress.pcai0104.ld7.hpecolo.net/demo/cfe-nginx]
7e893c1b6ee8: Pushed
463308bed0c9: Pushed
4197a611afec: Pushed
3e96162769d5: Pushed
892e805f6f4f: Pushed
626ab8a5d57b: Pushed
7fb72a7d1a8e: Pushed
v0.1.0: digest: sha256:114dff0fc8ee3d0200c3a12c60e3e2b79d0920dd953175ecb78a0b157425b25e size: 1778
```

* *Verifying the image from Harbor registry* 

The image *cfe-nginx* is showing up under *Repositories* tab of the *harbor* project *demo*:

![](/img/demo-project.png)

Log into *Harbor* registry as the user *pcai-developer*, then pull the image from the harbor registry:

```shell
$ docker login harbor.ingress.pcai0104.ld7.hpecolo.net
Username: pcai-developer
Password:

WARNING! Your credentials are stored unencrypted in '/home/guoping/.docker/config.json'.
Configure a credential helper to remove this warning. See
https://docs.docker.com/go/credential-store/

Login Succeeded

$ docker images
REPOSITORY   TAG       IMAGE ID   CREATED   SIZE
$ docker pull harbor.ingress.pcai0104.ld7.hpecolo.net/demo/cfe-nginx:v0.1.0
v0.1.0: Pulling from demo/cfe-nginx
b895f377d09e: Already exists
3b00567da964: Pull complete
56b81cfa547d: Pull complete
1bc5dc8b475d: Pull complete
979e6233a40a: Pull complete
d2a7ba8dbfee: Pull complete
32e44235e1d5: Pull complete
Digest: sha256:114dff0fc8ee3d0200c3a12c60e3e2b79d0920dd953175ecb78a0b157425b25e
Status: Downloaded newer image for harbor.ingress.pcai0104.ld7.hpecolo.net/demo/cfe-nginx:v0.1.0
harbor.ingress.pcai0104.ld7.hpecolo.net/demo/cfe-nginx:v0.1.0

$ docker images
REPOSITORY                                               TAG       IMAGE ID       CREATED        SIZE
harbor.ingress.pcai0104.ld7.hpecolo.net/demo/cfe-nginx   v0.1.0    1e5f3c5b981a   2 months ago   192MB
```

## Application deployment using Harbor registry

With images being pushed to *Harbor* registry, let’s try to deploy the application to PCAI using the same *Import Framework* and demonstrate pulling images from the *Harbor* registry. 

The Helm charts of the sample Nginx application has been available from GitHub repository [nginx-chart](https://github.com/GuopingJia/pcai-helm-examples/tree/main/nginx-chart). In addition to the *virtualService* and Kyverno *ClusterPolicy* YAML manifest files, the *values.yaml* of the sample Helm charts includes the *imageCredentials* section to provide the *Harbor* access credentials for the user *pcai-developer*. The *imagePullSecrets* uses the Secret resource *harbor*, which is created as part of deployment, for   
for pulling images from *Harbor* registry.

```shell
image:
  repository: harbor.ingress.pcai0104.ld7.hpecolo.net/demo/cfe-nginx
  pullPolicy: Always
  # Overrides the image tag whose default is the chart appVersion.
  tag: "v0.1.0"

imagePullSecrets: 
  - name: harbor

imageCredentials:
  registry: harbor.ingress.pcai0104.ld7.hpecolo.net
  username: pcai-developer
  password: PCAIDev12345
  email: glcs.cfe@hpe.com
```

Using this sample Helm charts, the CFE Nginx application can be easily deployed to PCAI using the *Import Framework*. An **Imported** *Nginx* tile shows up under *Tools & Framework*, with its virtual service endpoint: 

![](/img/nginx-deployment.png)

By clicking *Open* button, you land to the CFE Nginx page:

![](/img/nginx-ui.png)

The CFE Nginx application is deployed to the namespace *nginx* in the K8s cluster. If you have access to the cluster, type the following command to see the deployment:

```shell
# kubectl get all -n nginx
NAME                               READY   STATUS    RESTARTS   AGE
pod/nginx-chart-546476cd99-2nqzz   1/1     Running   0          6s

NAME                  TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
service/nginx-chart   ClusterIP   10.99.78.114   <none>        80/TCP    6s

NAME                          READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/nginx-chart   1/1     1            1           6s

NAME                                     DESIRED   CURRENT   READY   AGE
replicaset.apps/nginx-chart-546476cd99   1         1         1       6s
```

From the namespace *nginx*, the secrete *harbor* with the type *dockerconfigjson* is created. This secret is used when pulling the image from the *Harbor* registry’s private project *demo* during CFE Nginx application deployment:

```shell
# kubectl get secret harbor -n nginx
NAME     TYPE                             DATA   AGE
harbor   kubernetes.io/dockerconfigjson   1      3m41s
```
Type the following command, you can see the image *cfe-nginx* with tag *v0.1.0* is pulling from the *Harbor* registry:

```shell
[root@ez-master01 ~]# k describe pod/nginx-chart-546476cd99-2nqzz -n nginx
Name:             nginx-chart-546476cd99-2nqzz
Namespace:        nginx
...
...
Events:
  Type    Reason     Age    From                         Message
  ----    ------     ----   ----                         -------
  Normal  Scheduled  2m18s  scheduler-plugins-scheduler  Successfully assigned nginx/nginx-chart-546476cd99-2nqzz to scs04.pcai0104.ld7.hpecolo.net
  Normal  Pulling    2m18s  kubelet                      Pulling image "busybox"
  Normal  Pulled     2m17s  kubelet                      Successfully pulled image "busybox" in 860ms (860ms including waiting)
  Normal  Created    2m17s  kubelet                      Created container web-content
  Normal  Started    2m17s  kubelet                      Started container web-content
  Normal  Pulling    2m16s  kubelet                      Pulling image "harbor.ingress.pcai0104.ld7.hpecolo.net/demo/cfe-nginx:v0.1.0"
  Normal  Pulled     2m16s  kubelet                      Successfully pulled image "harbor.ingress.pcai0104.ld7.hpecolo.net/demo/cfe-nginx:v0.1.0" in 377ms (377ms including waiting)
  Normal  Created    2m16s  kubelet                      Created container nginx-chart
  Normal  Started    2m16s  kubelet                      Started container nginx-chart 
```
The *Logs* page of *Harbor* registry contains all the audit logs about project and user creation, image push and pull operations, etc. 

![](/img/harbor-audit.png)

### Conclusion

In this blog post, we explored how to deploy *Harbor* to HPE Private Cloud AI and configure it as a local local container registry. By setting up a private *Harbor* project and assigning user roles, organizations can securely manage, push and pull container images tailored to their application needs. 

More than just a container registry, *Harbor* strengthens security with built-in vulnerability scanning, image signing, and content trust features, ensuring only verified, compliant images are used across deployments. With *Harbor* integrated into PCAI, organizations can confidently host container images internally, eliminating the need for external registries. The local container registry offers greater control over image provenance and aligns more effectively with organization security policies and regulatory reuiqments. 

Please keep coming back to the [HPE Developer Community blog](https://developer.hpe.com/blog/) to learn more about HPE Private Cloud AI and get more ideas on how you can use it in your everyday operations.