---
title: Deep Learning Model Training – A First-Time User’s Experience with
  Determined - Part 1
date: 2022-04-14T17:21:31.857Z
author: Denis Choukroun
authorimage: https://gravatar.com/avatar/f66dd9562c53567466149af06ae9d4f1?s=192
thumbnailimage: /img/detai-high-levl-architecture-thumbnail-v2.png
tags:
  - determined-ai
  - opensource
  - Ezmeral
  - developer
  - Kubernetes
  - deep-learning
  - data-scientist
  - data-ml-engineer
  - machine-learning
---
[Determined](https://github.com/determined-ai/determined) is an open-source deep learning training platform that helps data science teams train models more quickly, easily share GPU resources, and collaborate more effectively. The open-source version of Determined can be deployed on-premises in your data center, on any hardware, on Kubernetes, or in public clouds – wherever GPU resources are available to obtain the full benefit of Determined. 

In this two-part blog series, I’ll share my experience as a first-time user of Determined. This blog series aims to provide a high-level overview of the basic concepts behind Determined and why you should consider it if you find doing deep learning at scale a bit challenging.

In this first part, I’ll put on my IT Operations manager’s hat and explain how I deploy Determined on a Kubernetes cluster in an on-premises HPE Ezmeral Runtime Enterprise deployment. In this instance, it will enable my organization’s data science team to quickly try out Determined and assess its capabilities for their data science work. 

<center><img src="/img/detai-high-levl-architecture-thumbnail-v2.png" width="543" height="708" alt="High Level architecture diagram" title="High Level architecture diagram"></center>

[In the second part of this series](https://developer.hpe.com/blog/deep-learning-model-training-%E2%80%93-a-first-time-user%E2%80%99s-experience-with-determined-%E2%80%93-part-2/), I'll wear my data scientist/ML engineer hat as a member of a larger data science team that wants to get started with Determined and explore some of its fundamental concepts and features. I’ll review how to train neural network models using one or more GPUs with distributed training, and advanced functionality such as state-of-the-art hyperparameter search to improve model accuracy and find the best version of a model.

## Determined AI

Determined is an open-source platform built to accelerate deep learning (DL) model development and experimentation for data science teams at scale, handling the load easily as teams, clusters and data sets all increase in size. Teams can use Determined to build, train, and optimize their deep learning models while easily sharing GPU compute resources. Determined AI was acquired by HPE in June 2021 and now operates as a part of the High Performance Computing (HPC) and Artificial Intelligence (AI) business unit.

Determined provides the APIs, a command line interface (CLI), a web user interface, and tools for accelerating model experiments with integrated capabilities such as distributing training and automatic model tuning with hyperparameter search, also known as hyperparameter optimization (HPO).

## HPE Ezmeral Runtime Enterprise

Built from the ground up to be open and run in hybrid environment, [HPE Ezmeral Runtime Enterprise](https://developer.hpe.com/platform/hpe-ezmeral-runtime/home/) provides a secure, enterprise-grade platform designed to run both cloud-native and non-cloud-native applications at scale. It provides an integrated data fabric, multi-cluster Kubernetes management, enterprise-grade security and multi-tenancy capabilities.

HPE Ezmeral Runtime Enterprise with the pre-integrated HPE Ezmeral Data Fabric provides all the networking, compute, and storage resources needed to run the Determined open-source platform on premises on Kubernetes. 

## Components of my Determined deployment

<center><img src="/img/detai-lab-environment-architecture-v2.png" width="1332" height="725" alt="Figure1 Determined High Level Architecture on Kubernetes" title="Figure1 Determined High Level Architecture on Kubernetes"></center>

As the figure above indicates, my experimental deployment of Determined consists of:

* A Kubernetes cluster, managed by HPE Ezmeral Runtime Enterprise, with a set of worker nodes with [NVIDIA GPUs support enabled](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/) (1 GPU device per worker node in my Kubernetes cluster).

* A Determined **Master**, which is attached to a **PostgreSQL** database. The Determined Master and Database run as containers, each within a Kubernetes POD, in the worker nodes of the Kubernetes cluster.

    * The Master hosts the interface service endpoint that clients use to communicate with Determined through a CLI, WebUI, and APIs.

    * The Master schedules tasks and brings up PODs on Kubernetes worker nodes to run tasks on demand. For example, the model training tasks and auxiliary tasks (TensorBoard, Notebook).

    * As training tasks execute, the Master maintains communication with training task PODs and saves training model metadata, like the training and validation metrics received from the training tasks, as well as the state of the tasks, in the PostgreSQL database, for model experiment tracking and analysis.

* An ingress gateway makes the Master's interface service endpoint reachable from outside the Kubernetes cluster.

* A persistent storage volume for experiment tracking by logging the model’s metadata information, such as hyperparameters, the training and validation metrics, logs, date/time, on the PostgreSQL database.

* A volume shared across the Kubernetes worker nodes. The shared file system is needed to store the **model artifacts**, such as model code and model **checkpoint** files. The model checkpoint files are saved versions of the validated models that data science teams can access later for testing and analysis. This makes them available to a deployment or serving solution such as Seldon core. The shared file system can also be used by Determined to store the model datasets on which the model is trained by the training tasks.

## Installing Determined on a Kubernetes cluster managed by HPE Ezmeral Runtime Enterprise

The open-source version of Determined is available as a Helm chart and can be installed on a Kubernetes cluster running on HPE Ezmeral Runtime Enterprise. As such, I download the chart and modify the chart *values.yaml* file (which I’ll explain in this section) before installation of the Helm chart in my Kubernetes cluster.

Before deploying the Helm chart, an important aspect to understand is how to connect Determined to a shared storage volume. For this, I need to create a new tenant named **determinedai** on HPE Ezmeral Runtime Enterprise for my Kubernetes cluster. This tenant serves as a Kubernetes cluster "namespace". Each tenant created in HPE Ezmeral Runtime Enterprise is automatically provisioned with a tenant’s shared storage volume on the pre-integrated HPE Ezmeral Data Fabric cluster located at **/\<DataFabric-clusterName\>/exthcp/tenant-\<ID\>/fsmount**. The tenant’s shared storage volume is then automatically mounted on each Kubernetes cluster’s host on the path **/opt/bluedata/mapr/mnt**. This enables Determined to connect to the shared storage */opt/bluedata/mapr/mnt/\<DataFabric-clusterName\>/exthcp/tenant-\<ID\>/fsmount/* for accessing the training and validation datasets, and for storing model artifacts.

Furthermore, some aspects of Helm chart deployment must be configured before installing Determined on Kubernetes. Although most of the default Helm chart configuration settings are suitable for getting started with Determined on Kubernetes, some parameters must be configured in the chart *values.yaml* file to match the designated Kubernetes cluster deployment and available compute, storage and network resources such as:

* The use of the Kubernetes *NodePort* service type to expose the Determined Master service endpoint outside the Kubernetes cluster,

* The shared storage volume path to use to save validated model files and checkpoints for fault tolerance,

* The amount of GPU resources (known as ***slot***) available on the Kubernetes worker hosts. In my Determined deployment I have 1 GPU per worker host,

* The [advanced scheduler](https://docs.determined.ai/latest/concepts/scheduling.html) to use for large Kubernetes clusters with multiple GPUs per worker host. For my experimental Determined deployment, as I only have 1 GPU per worker host, it is recommended to let Determined use the **default Kubernetes scheduler** to schedule training tasks,

* The Determined *Admin* and *Determined* default user account passwords,

* The friendly name for Determined deployment.

For more information about the configuration options for the Helm Chart deployment, see the [installation guide documentation](https://docs.determined.ai/latest/sysadmin-deploy-on-k8s/install-on-kubernetes.html).

In my Determined deployment on Kubernetes, the following aspects of the Determined Helm chart deployment configuration is set in the chart *values.yaml* file as shown below. Other configuration settings are set to their default values.

```Markdown
useNodePortForMaster: true
checkpointStorage:
   type: shared_fs
   hostPath: /opt/bluedata/mapr/mnt/<DF-clusterName>/exthcp/tenant-<ID>/fsmount/checkpoints
maxSlotsPerPod: 1
clusterName: stagingdetai
defaultPassword: <myPassword>
```

With the namespace created, the kubeconfig file for the Kubernetes cluster sourced in my Linux workstation, and the Helm chart deployment configuration files in hand, I can deploy Determined software on the Kubernetes namespace *determinedai* using the following command:

```bash
helm install stagingdetai <relative path to determined-helm-chart repository> –n determinedai [--dry-run]
```

> Note: I recommend first using the `--dry-run` flag to validate and verify the chart manifest before actual Helm chart deployment. 

Upon completion, I can use the following commands to check the status of the Helm chart deployment for my Determined instance:

```bash
helm list -n determinedai
helm status stagingdetai -n determinedai
```

![Helm Chart deployment status](/img/determined-helm-install-status.png "Helm Chart deployment status")


At the time of the Determined installation on the Kubernetes cluster, an instance of the **Determined Master** and a **PostgreSQL database** are deployed in the Kubernetes cluster. Using the kubectl command below allows me to check the resources that are deployed on the Kubernetes cluster: 

```bash
kubectl get pod,services –n determinedai
```

![](/img/determined-pod-svc.png)

As shown in the above image, these components run as a container within a Kubernetes POD. Service endpoints for the Determined’s Master and the Database services are also deployed. The Determined Master service endpoint is a NodePort service that enables HPE Ezmeral Runtime Enterprise to expose that service outside the Kubernetes cluster through its **ingress gateway.**

## Installing the Determined Command Line Interface

As mentioned earlier, Determined provides a web user interface (WebUI), APIs (REST API and Python API), and a command line interface (CLI) tool to interact with the system. The CLI is the most common tool used by data scientists and ML engineers to interact with Determined, especially for launching deep learning model training tasks on Determined. The WebUI is mainly used to monitor the progress of model experiments and training tasks, and visualize the model training performance in graphs.

The Determined CLI is distributed as a Python package. I need Python 3.6 or later installed on my Linux workstation along with the latest version of `pip`. I can use the following command to install the CLI tool on my workstation:

```bash
#install latest version of pip if needed
python3 -m pip install --upgrade pip 

#install the Determined CLI
pip install determined 
```

## Using the Determined Command Line Interface

I am now ready to enter Determined CLI commands. All commands begin with **det** and any CLI command has the form:

 ***det \[-m <det_master_URL_or_IP:port>] <command_argument> <action_verb> \[-h]***

The Master service endpoint is referenced using the -m flag to specify the URL of the Determined Master that the CLI connects to. Instead of specifying the ***\-m*** flag in every command, I can define an environmental variable, ***DET_MASTER***, that points to the Determined Master service endpoint URL. 

> Note:  The help flag \[-h] can be used to learn more about CLI options.

To use and interact with Determined using the CLI, I need to tell the CLI where the Determined Master service is running. To do so, I first use the `kubectl describe service` command below and look at the **Annotations** section to get the **ingress gateway URL** and **network port** provided by HPE Ezmeral Runtime Enterprise for the Master service of the Determined deployment:

```bash
kubectl describe service determined-master-service-stagingdetai -n determinedai
```

![Ingress Gateway URL for the Determined Master endpoint service](/img/determined-master-endpoint-ofuscated.png "Ingress Gateway URL for the Determined Master endpoint service")

In this example, the network port is 13047. 

I now need to export on my workstation the **DET_MASTER** environmental variable, which points to that URL and port:

```bash
export DET_MASTER=http://gateway2.<mydomain.name>:13047
```

Finally, I need to authenticate as a Determined user. By default, at the time of the Determined installation, two user accounts are created: ***Admin*** an administrator account, and ***Determined*** a non-privileged user account with the password specified in the Helm chart *values.yaml* configuration file. Using the following command allows me to authenticate as an admin user. I will be prompted by the CLI for the password.

```bash
#format: det user login <username>
det user login admin
```

## Creating User accounts for the data science team

Determined is designed for data science teams. As such, I’d recommend creating a user account for each member of the team who wants to use Determined. This provides the organizational benefits of associating each Determined entity, such as model experiments and associated training tasks, with the user who created it.

I have experienced user account creation using both the CLI and the REST API. The ***Admin*** privileged user account must be used to create a user account and set the newly created user account password.

### Using the Det CLI

Once logged in as Admin user on Determined, I can use the following command to create a test user account. First, I create the user account. The newly created user account has a blank password by default. Then, I set the password for the user account using the second command, which prompts me for the password and password confirmation.

```bash
# Create the user account
det user create <username>
# Set the password for the user account
det user change-password <target-username>
```

### Using the REST API for a programmatic approach

Unlike the DET CLI, which requires keyboard input for the password, a programmatic approach to create user accounts might be more appropriate depending on the organization’s use case. Determined is also REST API enabled. The Determined REST API documentation is available [here](https://docs.determined.ai/latest/rest-api/index.html). 

Below is the sequence of REST API calls I can use to create a new user account (testuser1) in Determined and to set the password, all using code. You can see how I use ***cURL*** as an HTTP client to interact with Determined through its REST API.  

I first need to authenticate as Admin user to Determined and save the authentication token (bearer token) for subsequent REST API calls:

```bash
detMaster=http://gateway2.<mydomain.name>:13047
# Authenticate as admin user and get the authentication token for subsequent calls:
token=$(curl -i -s -X 'POST' \
  "${detMaster}/api/v1/auth/login" \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "username": "admin",
  "password": "<MyPassword>"
}' | grep token | awk '{print $1}' | tr -d '\r')

# Extract token value and remove trailing quotes 
MyToken=$(echo $token | cut -d':' -f 2 | cut -d',' -f 1 | tr -d '"') 
```

I then create a non-admin user account using the Admin access token as the bearer token authentication:

```bash
# Create a new user account “testuser1”
curl -X 'POST' \
  "${detMaster}/api/v1/users" \
  -H 'accept: application/json' \
  -H "Authorization: Bearer $MyToken" \
  -d '{
  "user": {
    "username": "testuser1",
    "admin": false,
    "active": true
   },
   "password": "<UserPassword>"
}'
```

Changing the password for an existing user account is a two-step process. You must first obtain the userID of the user before changing the password:

```bash
# Fetch the user ID for user "testuser1"
detUserId=$(curl -s -X 'GET' \
  "${detMaster}/api/v1/users" \
  -H 'accept: application/json' \
  -H "Authorization: Bearer $MyToken"| jq '.users[] | select(.username=="testuser1") | .id' | tr -d '"')
echo " the determined AI user ID for user testuser1 is : $detUserId"

# Set password for the user account “testuser1”
curl -X 'POST' \
"${detMaster}/api/v1/users/${detUserId}/password" \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $MyToken" \
  -d '"<userPassword>"'
```

> Note: The open-source version of Determined does not provide user access control features in case you have multiple data science teams (i.e.: multiple tenants). Open-source Determined uses a local user directory as a convenient method to show the entity created by the logged in users. However, the open-source version makes any entity (experiments, tasks) visible to all users, regardless of who created it. This can be a challenge for enterprises that need to keep strong model governance for audit purposes. The enterprise version of the open-source Determined product, [HPE Machine Learning Development Environment](https://www.hpe.com/us/en/solutions/artificial-intelligence/machine-learning-development-environment.html) addresses this limitation.

## Checking connectivity to the WebUI using the newly created user account

A good method to verify that a member of the data science team can interact with Determined is to test the connectivity to the WebUI. The WebUI is available on the same service endpoint URL as the CLI. Using my browser, I connect to the Master service URL and verify that I am prompted to login to the WebUI as shown in the following figure:

![Determined WebUI login page](/img/determined-webui-login.png "Determined WebUI login page")

Upon successful login, I land on the ***dashboard*** below. You’ll learn more about the WebUI in my second blog post in this series.

> Note: At the bottom left of the menu bar, you can see that having access to a running Determined instance allows me to navigate a Swagger UI version of the REST API in an interactive fashion.

![Determined WebUi Dashboard](/img/determined-webui-dashboard.png "Determined WebUi Dashboard")

That’s it! Everything is set. I am now ready to put on my data scientist hat, go and use Determined to train and tune a deep learning model in Determined using the CLI, visualize training results using the WebUI, and load and test models by making inferences. 

## Summary

As you can see, using my IT operations manager’s hat, I deployed Determined on a Kubernetes cluster running on HPE Ezmeral Runtime Enterprise, which provides all the components needed to run Determined: a task scheduler such as Kubernetes, a namespace, multi-tenancy, an ingress gateway, persistent storage for experiment tracking, and a shared file system for storing model artifacts and datasets.

[In the second post in this series](https://developer.hpe.com/blog/deep-learning-model-training-%E2%80%93-a-first-time-user%E2%80%99s-experience-with-determined-%E2%80%93-part-2/), I will walk through training a TensorFlow Keras model in Determined using features such as distributed training and automatic model tuning with hyperparameter search.

You can subscribe for updates from the HPE Dev Community by subscribing to our [newsletter](https://developer.hpe.com/community). I was able to write this post by joining and receiving help from the [Determined Community Slack](https://join.slack.com/t/determined-community/shared_invite/zt-cnj7802v-KcVbaUrIzQOwmkmY7gP0Ew), which you can also do .You can begin training models with Determined today by visiting the [Determined project on GitHub](https://github.com/determined-ai/determined).