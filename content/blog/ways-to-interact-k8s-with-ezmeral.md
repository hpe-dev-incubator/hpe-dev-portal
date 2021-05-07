---
title: Ways to Interact K8s with Ezmeral
date: 2021-05-07T14:39:32.411Z
author: Cenz Wong
authorimage: /img/Avatar1.svg
thumbnailimage: https://github.com/helloezmeral/cdn/blob/main/HelloWorld%20with%20EPIC%20MLOps.png?raw=true
tags:
  - Ezmeral
  - Kubectl
---
HPE Ezmeral Software Platform has a bundle of software that helps you run, manage, control, and secure the apps, data, and IT that run your business. One of which is the HPE Ezmeral Container Platform (HPE ECP). It is a unified cloud container software platform built on Kubernetes. How exactly you can connect to HPE ECP to interact with K8s? Don't panic! This blog post will introduce to you most, if not all, of the ways to connect with the Kubernetes inside HPE ECP.
![](https://github.com/helloezmeral/cdn/blob/main/HelloWorld%20with%20EPIC%20MLOps.png?raw=true)

## Table of Contents
- 1. [WebUI](#1-webui)
- 2. [WebTerminal](#2-WebTerminal)
- 3. [HPE Kubectl Plugin](#3-HPE-Kubectl-Plugin)
   - 3.1. [Installation of Kubectl and Kubectl HPECP Plugin](#31-installation-of-kubectl-and-kubectl-hpecp)
   - 3.2. [Getting the Kubeconfig File](#32-getting-the-kubeconfig-file)
        - 3.2.1. [HPE Kubectl Plugin](#321-using-kubectl-hpecp-refresh-command)
        - 3.2.2. [Manual Download](#322-download-the-kubeconfig-file-manually)
        - 3.2.3. [Using REST API](#323-using-rest-api)
- 4. [hpecp Python Library](#4-hpecp-python-library-pre-alpha)

## 1. WebUI
The first method is, of course, through the web UI. 

| Screenshot      | Description |
| ----------- | ----------- |
| ![](https://github.com/helloezmeral/cdn/raw/main/K8s-Cluster.png)     | In the Main Menu, you can manage and navigate around Kubernetes.  |
| ![](https://github.com/helloezmeral/cdn/raw/main/K8s-Dashboard.png)   | You can access the Kubernetes Dashboard, just like what you did with Open-Source Kubernetes.  |

## 2. WebTerminal
Inside the Kubernetes Tenant, at the bottom, there is a web terminal for you to interact with the Kubernetes with ```Kubectl``` command.

| Screenshot      | Description |
| ----------- | ----------- |
| ![](https://github.com/helloezmeral/cdn/raw/main/K8s-Tenant.png)      | At the bottom, you can click initiate to initiate the web terminal instance.  |
| ![](https://github.com/helloezmeral/cdn/raw/main/K8s-Tenant-02.png)   | Type your lovely ``` kubectl ``` command to interact with Kubernetes  |


## 3. HPE Kubectl Plugin
If you wanna use Kubectl remotely, you have to install Kubectl-plugin to get the session ID to access HPE Ezmeral. To install the Kubectl-hpecp plugin, you can run the following command.

| Screenshot      | Description |
| ----------- | ----------- |
| ![](https://github.com/helloezmeral/cdn/raw/main/K8s-Tenant-03.png)      | You can download the required binary here as well  |

### 3.1 Installation of ```kubectl``` and ```kubectl-hpecp```
#### Step 1: Make sure you have Kubectl install.
```bash
# Download the latest version of kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
# And place it anywhere in your PATH:
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

> Reference:
> - https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/
> 

#### Step 2: Install hpe kubectl plugin
```bash
# This link might subject to be changed, renew this link on HPE Ezmeral
# Download kubectl-hpecp binary and untar the file
wget https://bluedata-releases.s3.amazonaws.com/kubectl-epic/3.4/14/linux/kubectl-hpecp.star
tar xf kubectl-hpecp.star
# And place it anywhere in your PATH:
sudo mv ./kubectl-hpecp /usr/local/bin
```
- check kubectl-hpecp is installed correctly

| Command | Screenshot      | 
| ----------- | ----------- |
| ``` kubectl plugin list ``` | ![](https://github.com/helloezmeral/cdn/raw/main/kubectl-plugin-list.png)        |
| ``` kubectl hpecp -h ``` | ![](https://github.com/helloezmeral/cdn/raw/main/kubectl-hpecp-h.png)       |

> Reference:
> - https://docs.containerplatform.hpe.com/53/reference/kubernetes/using-kubernetes/Using_the_HPE_Kubectl_Plugin.html
> - https://kubernetes.io/docs/tasks/extend-kubectl/kubectl-plugins/

### 3.2 Getting the ```kubeconfig``` file
#### 3.2.1 Using ```kubectl hpecp refresh``` command

The ```kubectl hpecp refresh``` command gets the user a new Kubeconfig. Using the Kubeconfig, you can interact with Kubernetes inside HPE Ezmeral.

```bash
kubectl hpecp refresh <ip_address, host alias, or hostname> --insecure --hpecp-user=<new_username> --hpecp-pass=<new_password>
# Example
kubectl hpecp refresh 172.16.10.41 --insecure --hpecp-user=your-username --hpecp-pass=your-pass
kubectl hpecp refresh ez53-gateway.hpeilab.com --insecure --hpecp-user=your-username --hpecp-pass=your-pass
kubectl hpecp refresh ez53-gateway.hpeilab.com --insecure
```

- After running hpecp refresh command, it will prompt some messages. Follow the instruction to define the Kubeconfig file as a shell environment variable.

![image](https://user-images.githubusercontent.com/72959956/117413580-bab71980-af48-11eb-808e-1f46f074451c.png)

```bash
# Example
export KUBECONFIG="/home/hpeadmin/.kube/.hpecp/ez53-gateway.hpeilab.com/config"
```

#### 3.2.2 Download the Kubeconfig file manually
![image](https://user-images.githubusercontent.com/72959956/117415089-7a589b00-af4a-11eb-8fbb-54386bcbdbbd.png)
- Download your ```kubeconfig``` file, and define the Kubeconfig file as a shell environment variable

```bash
# Example
export KUBECONFIG="/the/path/of/your/kubeconfig"
```

#### 3.2.3 Using REST API
HPE Ezmeral Container Platform provides REST API for you to interact. Here is the command that downloads the Kubeconfig file.

- Authenticate as a tenant user in the specified tenant, getting the session ID: 

```bash
curl -k -i -s --request POST "http://ez53-gateway.hpeilab.com:8080/api/v2/session" \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--data-raw '{
"name": "username",
"password": "password",
"tenant_name": "test-tenant"
}'

# output
HTTP/1.1 201 Created
Access-Control-Allow-Origin: *
Content-Length: 13
Content-Type: text/plain
Date: Fri, 30 Apr 2021 13:18:38 GMT
Location: /api/v2/session/__thisisthesessionid__
Server: HPE Ezmeral Container Platform 5.3

201 Created
```

- Get the Kubeconfig file for your tenant working context: 

```bash
curl -k -s --request GET "http://ez53-gateway.hpeilab.com:8080/api/v2/k8skubeconfig" \
--header "X-BDS-SESSION: /api/v2/session/__thisisthesessionid__" \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' > ./kubeconfig

# Define the Kubeconfig file as a shell environment variable
export KUBECONFIG=kubeconfig
```

- Combining two commands into one command

```bash
curl -k -s --request GET "http://<you-ez-gateway>:8080/api/v2/k8skubeconfig" \
--header "X-BDS-SESSION: $(curl -k -i -s --request POST "http://<you-ez-gateway>:8080/api/v2/session" \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--data-raw '{
"name": "<change-your-user-name>",
"password": "<change-your-user-password>",
"tenant_name": "<change-the-tenant-you-want>"
}' | grep Location | awk '{print $2}' | tr -d '\r')" \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' > ./kubeconfig

export KUBECONFIG="./kubeconfig"

kubectl get pods
```

> Resources:
> - https://docs.containerplatform.hpe.com/53/reference/accessing-the-applications/API_Access.html
> - https://github.com/HewlettPackard/hpe-notebooks/tree/master/HPECPAPI
> - https://github.com/bluedatainc/solutions/tree/master/APIs

## 4. hpecp python library (pre-alpha)
If you are looking for a way to interact with HPE Ezmeral programmatically, you can keep an eye on the hpecp python library from HPE Container Platform Community. Note that it is still a prototype, it may be unstable and subject to change until this library reaches beta.

> Reference:
> - https://github.com/hpe-container-platform-community/hpecp-python-library
> - https://hpe-container-platform-community.github.io/hpecp-python-library/hpecp.license.html
> - https://pypi.org/project/hpecp/
> 

## Conclusion
HPE Ezmeral Container Platform provides different ways for you to interact with Kubernetes. Just pick your favorite way in your favorite environment. Happy Kubectl!
