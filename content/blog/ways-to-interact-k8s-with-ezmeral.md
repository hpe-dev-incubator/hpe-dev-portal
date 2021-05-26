---
title: Ways to Interact K8s with Ezmeral
date: 2021-05-26T02:57:01.717Z
author: Cenz Wong
authorimage: /img/Avatar1.svg
thumbnailimage: /img/pic.png
tags:
  - Ezmeral
  - Kubectl
---
HPE Ezmeral Software Platform consists of a bundle of software that helps you run, manage, control, and secure the apps, data, and IT that run your business. A major component is the HPE Ezmeral Container Platform (HPE ECP), a unified cloud container software platform built on Kubernetes (K8s). You can deploy a new Kubernetes cluster with a few clicks. But how exactly do you connect to HPE ECP to interact with K8s? Don't panic! This blog post will introduce to you most, if not all, of the ways to connect with the Kubernetes using HPE ECP.

## WebUI

The first method by which you can interact with a Kubernetes Cluster using HPE ECP is, of course, through the web user interface (WebUI). 

| Screenshot                                                          | Description                                                                                                                                        |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| ![](https://github.com/helloezmeral/cdn/raw/main/K8s-Cluster.png)   | In the Main Menu, if you are the administrator of the HPE Ezmeral CP, ou can manage and monitor the status of the K8s clusters managed by HPE ECP. |
| ![](https://github.com/helloezmeral/cdn/raw/main/K8s-Dashboard.png) | You can access the Kubernetes Dashboard, you would do with open source Kubernetes.                                                                 |

## WebTerminal

Inside the Kubernetes Tenant, at the bottom, there is a web terminal for you to interact with Kubernetes using the `Kubectl` command.

| Screenshot                                                          | Description                                                                          |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| ![](https://github.com/helloezmeral/cdn/raw/main/K8s-Tenant.png)    | At the bottom, you can click "Initialize" button to start the web terminal instance. |
| ![](https://github.com/helloezmeral/cdn/raw/main/K8s-Tenant-02.png) | Type your `kubectl` command to interact with Kubernetes.                             |

## HPE Kubectl Plugin

The HPE kubectl plugin is required to establish the tenant’s authenticated `kubectl` requests. Therefore, if you want to use `kubectl` remotely as a tenant user, you must first install the HPE kubectl plugin (`kubectl-hpecp`) to get an HPE ECP authentication token (a session ID), fetch the kubconfig manifest file, and then interact with the managed K8s clusters.

To install the `kubectl-hpecp` plugin, first fetch the plugin from the WebUI. Log in as a tenant user, and click on Download HPE Kubectl Plugin( as shown in the picture below) and download the plugin and installation instructions according to your target operating system.

| Screenshot                                                          | Description                                        |
| ------------------------------------------------------------------- | -------------------------------------------------- |
| ![](https://github.com/helloezmeral/cdn/raw/main/K8s-Tenant-03.png) | You can download the required binary here as well. |

### Installation of `kubectl` and `kubectl-hpecp`

The following steps are for Linux users.

#### Step 1: Make sure you have Kubectl installed.

```shell

```

> Reference:
>
> * [How to install and set up kubectl on Linux](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)

#### Step 2: Install hpe kubectl plugin

```bash

```

Check `kubectl-hpecp` is installed correctly.

| Command               | Screenshot                                                                |
| --------------------- | ------------------------------------------------------------------------- |
| `kubectl plugin list` | ![](https://github.com/helloezmeral/cdn/raw/main/kubectl-plugin-list.png) |
| `kubectl hpecp -h`    | ![](https://github.com/helloezmeral/cdn/raw/main/kubectl-hpecp-h.png)     |

> Reference:
>
> * [Installing kubectl plugins](https://kubernetes.io/docs/tasks/extend-kubectl/kubectl-plugins/#installing-kubectl-plugins)
> * [Using the HPE Kubectl Plugin](https://docs.containerplatform.hpe.com/53/reference/kubernetes/using-kubernetes/Using_the_HPE_Kubectl_Plugin.html)

### Getting the `kubeconfig` file

#### Using `kubectl hpecp refresh` command

The `kubectl hpecp refresh` command gets the user a new Kubeconfig, which authenticate you to interact with Kubernetes though the HPE Ezmeral Container Platform.

```shell

```

Running the hpecp refresh command, will prompt some messages. Follow the instructions to define the Kubeconfig file as a shell environment variable.

![image](https://user-images.githubusercontent.com/72959956/117413580-bab71980-af48-11eb-808e-1f46f074451c.png)

```shell

```

#### Download the Kubeconfig file manually

![image](https://user-images.githubusercontent.com/72959956/117415089-7a589b00-af4a-11eb-8fbb-54386bcbdbbd.png)

* Download your `kubeconfig` file, and define the Kubeconfig file as a shell environment variable

```bash

```

#### Using REST API

HPE Ezmeral Container Platform provides REST API for you to interact with. Here is the command that downloads the Kubeconfig file.

Authenticate as a tenant user in the specified tenant, getting the session ID: 

```shell

```

Get the Kubeconfig file for your tenant working context: 

```shell

```

The screenshot below shows you how you can combine two commands into a single command.

```shell

```

> Resources:
>
> * [HPE Ezmeral Documentation: API Access](https://docs.containerplatform.hpe.com/53/reference/accessing-the-applications/API_Access.html)
> * [Github: HPECP API](https://github.com/HewlettPackard/hpe-notebooks/tree/master/HPECPAPI)
> * [Github: API Document](https://github.com/bluedatainc/solutions/tree/master/APIs)
> * [Blog: HPE Container Platform REST API](https://developer.hpe.com/blog/hpe-container-platform-rest-api-part-1-authenticating/)

<br/>

## hpecp python library (pre-alpha)

If you are looking for a way to interact with HPE Ezmeral programmatically, you can keep an eye on the hpecp python library from HPE Container Platform Community. Note that it is still a prototype, it may be unstable and subject to change until this library reaches beta.

> Reference:
>
> * https://github.com/hpe-container-platform-community/hpecp-python-library
> * https://hpe-container-platform-community.github.io/hpecp-python-library/hpecp.license.html
> * https://pypi.org/project/hpecp/

## Conclusion

As you can see, HPE Ezmeral Container Platform provides a number of different ways for you to interact with Kubernetes in order to …. Just pick your favorite way for your favorite environment. Happy Kubectl!

for easier management of your Kubernetes Clusters, to make life easier for xyz, etc.