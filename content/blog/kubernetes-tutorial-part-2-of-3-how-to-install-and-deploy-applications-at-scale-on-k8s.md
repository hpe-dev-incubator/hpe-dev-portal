---
title: "Kubernetes Tutorial part 2 of 3: How to Install and Deploy Applications
  at Scale on K8s "
date: 2021-03-31T15:14:49.442Z
author: Martijn Kieboom
authorimage: /img/Avatar1.svg
tags:
  - kubernetes
  - hpe-ezmeral-data-fabric
  - hpe-ezmeral
  - MapR
  - container
  - opensource
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019, may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)



## Original Post Information:



```
"authorDisplayName": "Martijn Kieboom",
"publish": "2018-04-26T10:46:00.000",
"tags": "open-source-software"
```


---


_**Editor’s Note:**_ [Part 1 in this series](/blog/kubernetes-tutorial-how-to-install-and-deploy-applications-at-scale-on-k)



## Introduction



In my previous blog, I described the reasoning behind containers and how to manage them in large-scale production environments. This blog describes two ways to get started with Kubernetes:



For a small Kubernetes deployment, we will be using Minikube, a simple solution to run a single node environment locally on your environment using virtualization technology like VirtualBox or VMware.



After having some hands-on experience with Kubernetes using the Minikube environment, it is time to deploy an actual multi-node Kubernetes cluster. For that, we will be using a three node environment, running Red Hat/CentOS 7.x.



Time to roll up your sleeves and get started!



## Kubernetes Installation Using Minikube



If you don't have experience with Kubernetes, Minikube is a perfect way to take your first steps into the container management world. Minikube is an easy way to deploy a single node Kubernetes environment.



**Prerequisites**



Minikube leverages virtualization technology, like VirtualBox, VMware, Hyper-V, and others. So prior to running Minikube, make sure you have one of these virtualization technologies installed on your client. For a complete list of supported virtualization layers, visit the Minikube GitHub page at: [https://github.com/kubernetes/minikube](https://github.com/kubernetes/minikube)



With a virtualization technology installed on your machine, let's go ahead and install Minikube.



**Download Minikube**



Minikube comes in a precompiled, single executable file that you can simply download to your client:



```bash
# Install minikube on MacOS
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-amd64 && chmod +x minikube && sudo mv minikube /usr/local/bin/

# Install minikube on Linux
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 && chmod +x minikube && sudo mv minikube /usr/local/bin/

# Install minikube on Windows
# Download the executable file and save it as minikube.exe:
https://storage.googleapis.com/minikube/releases/latest/minikube-windows-amd64.exe

```



**Launch a Kubernetes Virtual Cluster**



With Minikube installed, it is time to launch our virtual single node Kubernetes cluster.



```bash
# Launch Kubernetes cluster
minikube start

# Alternatively, launch Kubernetes cluster with a specific Memory allocation
# default memory is 2048 MB
minikube start --memory 6144

```



That's all! No, really, it is.



Minikube will automatically download, import,and launch an image matching your virtualization technology. For that reason it does take a few minutes to complete. Notice that Minikube automatically imported a virtual machine into your virtualization environment.



There are many parameters you can configure as part of the 'start' command ('minikube start --help'), but as Minikube is aimed at ease of usage, the default values are a very solid standard to get started. One recommended parameter is to set the virtual machine's memory as configuration. It defaults to 2GB which might be on the small size if you want to try out a few containers on the Minikube cluster.



With the Kubernetes cluster running, we can use Minikube to connect to the VM and launch the Kubernetes Web Dashboard:


```bash
# Launch Kubernetes Dashboard
minikube dashboard

```


This will automatically launch your default browser and opens the Kubernetes dashboard. Whereas Kubernetes clusters will normally ask for a security token to login, Minikube is aimed at ease of use and therefore no login is required. Have a look around at the various Kubernetes menu options.



From here, you can now start deploying the MapR Volume Driver Plugin for Kubernetes.

If at any point in time you want to stop the Minikube cluster, it is as easy as you can imagine:



```bash
# Stop Kubernetes
minikube stop

```



The 'stop' command will gently shutdown your virtualized Kubernetes cluster, including all containers that you might have deployed on it. A simple 'minikube start' will relaunch the existing VM again, after which you can use 'minikube dashboard' to open the Kubernetes Dashboard.




Once you're done with the Minikube Kubernetes cluster, simply delete the VM:



```bash
# Delete the Kubernetes VM
minikube delete

```



## Kubernetes Installation on Red Hat/CentOS 7.x



Once you have experience with Kubernetes by using Minikube, it is time to deploy a multi-node Kubernetes cluster. This paragraph describes how to deploy a multi-node Kubernetes cluster on an environment running CentOS as the Operating System.

One final note before we start: do not openly connect this deployed cluster to the internet as securing the Kubernetes cluster is out of scope for this blog.



**Prerequisites**



The commands in this prerequisite chapter have to be executed on each of the Kubernetes cluster nodes individually.



If you're using AWS EC2 nodes, make sure to enable the 'extra’ repository:


```bash 
# On AWS EC2 enable the 'extra' repository containing git, docker, etc.

yum-config-manager --enable rhui-REGION-rhel-server-extras
```



To get started, we need to disable SELinux as well as memory swapping on all nodes:


```bash
# Disable SELinux
setenforce 0
sed -i '/^SELINUX./ { s/enforcing/disabled/; }' /etc/selinux/config

# Disable swap
swapoff -a
sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab

```



Additionally, we also need to enable bridged networking for Kubernetes:



```bash
# Set iptables
cat < /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
sysctl --system

```



And, as the last step of the prerequisites, we need to install Docker to run containers:



```bash
# Install docker
yum install -y docker

# Launch Docker and enable it on system boot
systemctl start docker
systemctl enable docker

```



**Kubernetes Installation**



The following commands also have to be executed on each of the individual cluster nodes.

Add the Kubernetes repository, and install the Kubernetes tools—kubelet, kubeadm, and kubectl:


```bash
# Install kubernetes repo
cat < /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF

# Install Kubernetes and start it
yum install -y kubelet kubeadm kubectl
systemctl start kubelet
systemctl enable kubelet

```



At this point, we have the Kubernetes packages installed on all cluster nodes. We can now start configuring Kubernetes. To do so, run the following commands on only one (1) single cluster node.



On the first node of the cluster, initialize the Kubernetes master by running kubeadm init. Please note that this task might take minutes to complete, as it will pull in all required containers.



```bash
# Initialize Kubernetes master
# Validate the ip-address of the node:
hostname --ip-address

# If the ip address in the above command is correct, run the following.
# Otherwise manually provide the correct address for apiserver-advertise-address
kubeadm init --pod-network-cidr=10.244.0.0/16 \
--apiserver-advertise-address=$(hostname --ip-address)

# The kubeadm command will take a few minutes and it will print a 'kubeadm join'
# command once completed. Make sure to capture and store this 'kubeadm join'
# command as it is required to add other nodes to the Kubernetes cluster
```



Once the cluster is initialized, we can copy the generated configuration file (admin.conf) to the home directory ($HOME/.kube/config) for easy cluster administration using the kubectl cli:



```bash
# Deploy kube config
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

```



To allow the pods and containers to communicate over the network with each other, a cluster network is required to set up. Flannel is one of the various cluster networking solutions that we will use in this blog. For more information on Kubernetes networking, visit: https://kubernetes.io/docs/concepts/cluster-administration/networking/



```bash
# Install Flanner for network
# Doc: https://kubernetes.io/docs/setup/independent/create-cluster-kubeadm/#44-joining-your-nodes
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/v0.9.1/Documentation/kube-flannel.yml
```



Per default,Kubernetes doesn't run pods on the master node as that could potentially result in a resource as well as security conflict. Pods might require such a large amount of system resources that the Kubernetes master might be negatively impacted. For single node clusters, however, (in case of testing, etc.), you can enforce pods to run on the master node as follows:



```bash
# Allow pods on master (not recommended for production clusters)
kubectl taint nodes --all node-role.kubernetes.io/master-
```



It will take a couple of minutes for all containers to start. Use the following command to validate that all pods are running prior to continuing:



```bash
# Validate all pods are running
kubectl get pods --all-namespaces
```


You can manage Kubernetes completely via the command line tool kubectl, but having a visual and graphical user interface to manage the cluster state can be very useful as well. To do so, let’s deploy the Kubernetes Dashboard:



```bash

# Deploy Dashboard web ui
# https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/
kubectl create -f https://raw.githubusercontent.com/kubernetes/dashboard/master/src/deploy/recommended/kubernetes-dashboard.yaml
```



As the Kubernetes dashboard is also running in a Docker container, we need to modify its networking to access the dashboard from the outside world:



```bash
# Edit the dashboard to be open to the world (for demos only!)
# Change type from 'ClusterIP' to 'NodePort'
kubectl -n kube-system edit service kubernetes-dashboard
```



Kubernetes user administration is out of scope for this blog post. Instead, we will be allowing the default kube-system user to become a cluster administrator user. Again: not for production clusters!



```bash
# Make default user part of cluster admin
# not for production clusters, for demos only!
kubectl create clusterrolebinding --user system:serviceaccount:kube-system:default kube-system-cluster-admin --clusterrole cluster-admin
```



To log on into the Kubernetes dashboard, a login token is required. To obtain the login ticket:



```bash
# Get the login token
kubectl describe serviceaccount default -n kube-system
kubectl describe secret default-token -n kube-system
```



Alternatively, it is possible to open the dashboard without login required (once again: not required for production systems). Simply click the 'skip' button in the Kubernetes dashboard login page after applying the following:



```bash
# Allow opening the k8 dashboard without login (not for production clusters, for demos only!)
cat < k8auth.yaml
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRoleBinding
metadata:
  name: kubernetes-dashboard
  labels:
    k8s-app: kubernetes-dashboard
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: kubernetes-dashboard
  namespace: kube-system
EOF
kubectl create -f k8auth.yaml
```



Pods on Kubernetes will, by default, open networking ports in the 30000+ range. To get the Kubernetes Dashboard port number, execute the following:



```bash
# Get the port that kubernetes dashboard runs on (should be a port in 30000+ range)
kubectl -n kube-system get service kubernetes-dashboard
```



Launch the Kubernetes dashboard in your favorite internet browser:



```bash
# Open browser and connect to the Kubernetes Dashboard
https://:
```



If you run into networking issues when connecting to the Dashboard, try using the Kubernetes proxy to connect to the Kubernetes internal networking:



```bash
# If unable to connect to Dashboard, try using the Kubernetes proxy:
kubectl proxy

# With proxy running, open the Dashboard using the following url:
http://127.0.0.1:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/
```



With the master node up and running, it is possible to add additional nodes to your Kubernetes cluster. To do so, use the 'kubeadm join …' command, as noted earlier in this blog. Please note, however, that the kubeadm command uses security tokens to authenticate itself with the master node. These tokens will expire after 24 hours, after which a new token has to be generated as explained below:



```bash
# Add additional nodes to the cluster (if required) using the earlier noted kubeadm join command
kubeadm join …

# On Master, show all nodes part of the cluster:
kubectl get nodes

# In case the token to join has expired, create a new token:
# On Master, list the existing tokens:
kubeadm token list

# On Master, if there are no valid tokens, create a new token and list it:
kubeadm token create
kubeadm token list

# Join additional nodes in the cluster with the newly created token, e.g.,:
kubeadm join 172.16.1.125:6443 --discovery-token-unsafe-skip-ca-verification --token 5d4164.15b01d9af2e64824
```



That's it: you now have a multi-node Kubernetes environment running!



**Troubleshooting and Reset**



When running into issues, use the following command to print logging information:



```bash
# Troubleshooting
journalctl -xeu kubelet
```



To remove a node from the cluster:



```bash
# On master, remove a node from the cluster (hard)
kubectl get nodes
kubectl delete nodes 

# On the removed node, reset and uninstall ubernetes installation
kubeadm reset
yum erase kube* -y
```



## MapR Volume Driver Plugin for Kubernetes



The MapR Volume Driver Plugin for Kubernetes allows running anyDocker container from Docker Hub on a Kubernetes cluster where MapR is the persistent data store for the container. Deployment of the MapR Volume Driver Plugin is very straightforward and will work both on the previously described Minikube and on the CentOS Kubernetes environments.

Make sure to check the latest documentation of the Volume Driver Plugin for any changes: [https://docs.datafabric.hpe.com/62/PersistentStorage/kdf_installation.html](https://docs.datafabric.hpe.com/62/PersistentStorage/kdf_installation.html).



The MapR Volume Driver Plugin (like any other Kubernetes configuration and deployment) consists of various so-called yaml files to configure and deploy pods and containers. The yaml files for the MapR Volume Driver Plugin can be found on the public [package.mapr.com](https://package.mapr.com/) repository:



```bash
# Locate and check the latest version of the MapR Volume Driver Plugin:
https://package.mapr.com/tools/KubernetesDataFabric/

# To download the version 1.0.0 files, for example:
wget https://package.mapr.com/tools/KubernetesDataFabric/v1.0.0/kdf-namespace.yaml
wget https://package.mapr.com/tools/KubernetesDataFabric/v1.0.0/kdf-rbac.yaml
wget https://package.mapr.com/tools/KubernetesDataFabric/v1.0.0/kdf-plugin-centos.yaml
wget https://package.mapr.com/tools/KubernetesDataFabric/v1.0.0/kdf-provisioner.yaml
```



With the yaml files downloaded, it is required to specify the ip address of the Kubernetes master in the Volume Driver Plugin yaml configuration:



```bash
# Configure the MapR Kubernetes storage plugin to point to the Kubernetes Master:
vi kdf-plugin-centos.yaml

- name : KUBERNETES_SERVICE_LOCATION
  value: "changeme!:6443"

# Set the KUBERNETES_SERVICE_LOCATION ip to match your Kubernetes master node
```



The final step is to deploy the Kubernetes configuration files to launch the MapR Volume Driver Plugin. We will start with creating the "mapr-system" namespace (kdf-namespace.yaml) to run the Volume Driver Plugin in. Additionally, we set the role-based access control (kdf-rbac.yaml) so that containers on Kubernetes can access the MapR Volume Driver Plugin. Finally, we will deploy the MapR Volume Driver Plugin.



Simply use the kubectl command line tool to load the yaml files into Kubernetes:



```bash
# Launch the various yaml files to deploy the MapR Volume Driver Plugin
kubectl create -f kdf-namespace.yaml
kubectl create -f kdf-rbac.yaml
kubectl create -f kdf-plugin-centos.yaml
kubectl create -f kdf-provisioner.yaml
```


That's it! Check your Kubernetes Dashboard to validate the deployment status by navigating to the overview of the 'mapr-system' namespace.



To remove the MapR Volume Driver Plugin from your Kubernetes cluster:



```bash
# Remove the MapR Volume Driver Plugin:
kubectl delete -f kdf-plugin-centos.yaml
kubectl delete -f kdf-provisioner.yaml
kubectl delete -f kdf-rbac.yaml
kubectl delete -f kdf-namespace.yaml
```



## Additional Resources:

*   [Part 1 in this series](/blog/kubernetes-tutorial-how-to-install-and-deploy-applications-at-scale-on-k)


*   [https://kubernetes.io/docs/setup/independent/install-kubeadm/](https://kubernetes.io/docs/setup/independent/install-kubeadm/)


*   [https://kubernetes.io/docs/setup/independent/create-cluster-kubeadm/](https://kubernetes.io/docs/setup/independent/create-cluster-kubeadm/)


*   [https://mapr.com/docs/home/PersistentStorage/kdf_overview.html](https://mapr.com/docs/home/PersistentStorage/kdf_overview.html)
 
