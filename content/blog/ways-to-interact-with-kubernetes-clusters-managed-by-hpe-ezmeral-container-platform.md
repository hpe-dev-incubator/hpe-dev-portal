---
title: Ways to interact with Kubernetes Clusters managed by HPE Ezmeral
  Container Platform
date: 2021-05-28T08:40:17.101Z
author: Cenz Wong
authorimage: https://avatars.githubusercontent.com/u/44856918?v=4
thumbnailimage: https://user-images.githubusercontent.com/72959956/119960940-128cf180-bfd8-11eb-9018-8411eda59a91.png
tags:
  - hpe-ezmeral



**Editor’s Note – HPE Ezmeral Container Platform is now HPE Ezmeral Runtime Enterprise**. For more information on why the name was changed, please [click here](https://community.hpe.com/t5/HPE-Ezmeral-Uncut/HPE-Ezmeral-Container-Platform-is-now-HPE-Ezmeral-Runtime/ba-p/7151720#.YW7nOxrMKM8).
 
- - -

HPE Ezmeral Software Platform consists of a bundle of software that helps you run, manage, control, and secure the apps, data, and IT that run your business. A major component is the HPE Ezmeral Container Platform (HPE ECP),a unified cloud container software platform built on Kubernetes (K8s). You can use it to deploy a new Kubernetes cluster with a few clicks. But how exactly do you connect through HPE ECP to interact with K8s? Don't panic! This blog post will introduce to you most, if not all, of the ways to connect with a Kubernetes cluster using HPE ECP.




## WebUI
The first method by which you can interact with a Kubernetes Clusters managed by HPE ECP is, of course, through the web user interface (WebUI).

| Screenshot      | Description |
| ----------- | ----------- |
| ![](https://github.com/helloezmeral/cdn/raw/main/K8s-Cluster.png)     | In the Main Menu, if you are the administrator of the HPE Ezmeral CP, you can manage and monitor the status of the K8s clusters managed by HPE ECP.  |
| ![](https://github.com/helloezmeral/cdn/raw/main/K8s-Dashboard.png)   | You can access the Kubernetes Dashboard just as you would do with open source Kubernetes.  |

## WebTerminal
Inside the Kubernetes Tenant, at the bottom, there is a web terminal for you to interact with Kubernetes using the ```kubectl``` command.

| Screenshot      | Description |
| ----------- | ----------- |
| ![](https://github.com/helloezmeral/cdn/raw/main/K8s-Tenant.png)      | At the bottom, you can click "Initialize" to initiate the web terminal instance.  |
| ![](https://github.com/helloezmeral/cdn/raw/main/K8s-Tenant-02.png)   | Type your ``` kubectl ``` command to interact with Kubernetes.  |


## HPE Kubectl Plugin
If you want to use kubectl remotely, you must first install the kubectl-plugin to get the session ID to access HPE Ezmeral. To install the kubectl-hpecp plugin, you can run the following command. The HPE kubectl plugin is required to establish the tenant’s authenticated kubectl requests. Therefore, if you want to use kubectl remotely as a tenant user, you must first install the HPE kubectl plugin (kubectl-hpecp) to get an HPE ECP authentication token (a session ID), fetch the kubconfig manifest file, and then interact with the managed K8s clusters.

To install the kubectl-hpecp plugin, first fetch the plugin from the WebUI. Log in as a tenant user, and click on Download HPE Kubectl Plugin (as shown in the picture below) and download the plugin and installation instructions according to your target operating system. Note: the following code is all executed in a Linux environment.

| Screenshot      | Description |
| ----------- | ----------- |
| ![](https://github.com/helloezmeral/cdn/raw/main/K8s-Tenant-03.png)      | You can download the required binary here as well.  |

### Installation of ```kubectl``` and ```kubectl-hpecp```
#### Step 1: Make sure you have ```kubectl``` installed.
```bash
# Download the latest version of kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
# And place it anywhere in your PATH:
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```
> References:


> - [How to install and set up kubectl on Linux](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)
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
Check that ```kubectl-hpecp``` is installed correctly.

| Command | Screenshot      | 
| ----------- | ----------- |
| ``` kubectl plugin list ``` | ![](https://github.com/helloezmeral/cdn/raw/main/kubectl-plugin-list.png)        |
| ``` kubectl hpecp -h ``` | ![](https://github.com/helloezmeral/cdn/raw/main/kubectl-hpecp-h.png)       |

> References:


> - [Using the HPE Kubectl Plugin](https://docs.containerplatform.hpe.com/53/reference/kubernetes/using-kubernetes/Using_the_HPE_Kubectl_Plugin.html)


> - [Extend kubectl with plugins](https://kubernetes.io/docs/tasks/extend-kubectl/kubectl-plugins/)



### Getting the ```kubeconfig``` file
#### Using ```kubectl hpecp refresh``` command

The ```kubectl hpecp refresh``` command gets the user a new Kubeconfig. Using the Kubeconfig, you can interact with Kubernetes through the HPE Ezmeral Container Platform.

```bash
kubectl hpecp refresh <ip_address, host alias, or hostname> --insecure --hpecp-user=<new_username> --hpecp-pass=<new_password>
# Example
kubectl hpecp refresh 172.16.10.41 --insecure --hpecp-user=your-username --hpecp-pass=your-pass
kubectl hpecp refresh ez53-gateway.hpeilab.com --insecure --hpecp-user=your-username --hpecp-pass=your-pass
kubectl hpecp refresh ez53-gateway.hpeilab.com --insecure
```

Download your ```Kubeconfig``` file, and define the path to the ```Kubeconfig``` file as a shell environment variable.

![image](https://user-images.githubusercontent.com/72959956/117413580-bab71980-af48-11eb-808e-1f46f074451c.png)

```bash
# Example
export KUBECONFIG="/home/hpeadmin/.kube/.hpecp/ez53-gateway.hpeilab.com/config"
```

#### Download the ```Kubeconfig``` file manually
![image](https://user-images.githubusercontent.com/72959956/119962105-4b799600-bfd9-11eb-985d-2c867162902e.png)


Download your ```kubeconfig``` file, and define the ```Kubeconfig``` file as a shell environment variable:



```bash
# Example
export KUBECONFIG="/the/path/of/your/kubeconfig"
```

#### Using REST API
HPE Ezmeral Container Platform provides a REST API for you to interact with. Here is the set of REST API calls that allows you to download the ```Kubeconfig``` file.

```bash
# Authenticate as a tenant user in the specified tenant, getting the session ID:
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

Get the Kubeconfig file for your tenant working context: 

```bash
curl -k -s --request GET "http://ez53-gateway.hpeilab.com:8080/api/v2/k8skubeconfig" \
--header "X-BDS-SESSION: /api/v2/session/__thisisthesessionid__" \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' > ./kubeconfig

# Define the Kubeconfig file as a shell environment variable
export KUBECONFIG=kubeconfig
```
The screenshot below shows you how you can combine two commands into a single command:

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


> - [API_Access](https://docs.containerplatform.hpe.com/53/reference/accessing-the-applications/API_Access.html)


> - [Jupyter Notebook: Introduction to the HPE Ezmeral Container Platform REST API](https://github.com/HewlettPackard/hpe-notebooks/tree/master/HPECPAPI)


> - [API documents](https://github.com/bluedatainc/solutions/tree/master/APIs)


> - [HPE Container Platform REST API](https://developer.hpe.com/blog/hpe-container-platform-rest-api-part-1-authenticating/)



## hpecp python library (pre-alpha)
If you are looking for a way to interact with HPE Ezmeral programmatically, you can keep an eye on the hpecp python library from HPE Container Platform Community. Note that it is still a prototype, it may be unstable and subject to change until this library reaches beta.



> References:


> - [Github: HPECP Python Library](https://github.com/hpe-container-platform-community/hpecp-python-library)


> - [HPE Container Platform Python Library Documentation](https://hpe-container-platform-community.github.io/hpecp-python-library/index.html)


> - [HPECP Python Pypi](https://pypi.org/project/hpecp/)




## Conclusion
As you can see, HPE Ezmeral Container Platform provides a number of different ways for you to interact with Kubernetes clusters so you can take advantage of the benefits it provides. Just pick your favorite way for your favorite environment. Happy Kubectl!
