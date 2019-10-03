---
title: Package your applications to run anywhere using Habitat and HPE OneSphere
date: 2018-12-14T00:47:33.707Z
author: HPE DEV staff 
tags: ["onesphere","chef","inspec","compliance","automate"]
path: package-your-applications-to-run-anywhere-using-habitat-and-hpe-onespher
---
Mudassar Shafique

Partner Solutions Architect - Chef Software

<mshafique@chef.io>## Summary
Today’s pace of technology innovation is staggering. It’s hard to believe, but in October 2008 (over 10 years ago), Amazon Web Services (AWS) made their Elastic Compute Cloud (EC2) available to the public. More recently, we’ve seen the adoption of container-based technologies and platforms such as Docker and Kubernetes. 

Usually, you can follow one of the following two approaches to take advantage of the benefits offered by new platforms:

+ Lift and shift your applications
+ Rewrite your applications so they can use the native features of new platforms  

Habitat provides application automation capabilities that allow application teams to build, deploy, and manage any application in any environment—from traditional data centers to containerized microservices. With Habitat, you can package applications and export these packages to run on different platforms without rewriting any part of the application.

In this post, you learn how I packaged Nginx, a commonly used web server, with Habitat. I describe how to easily deploy this web server on an AWS-based virtual machine managed by [HPE OneSphere](https://www.hpe.com/us/en/solutions/cloud/hybrid-it-management.html). Then, I show how to take the same Habitat package and deploy it on a Kubernetes cluster based in a private cloud. This post includes a reference [Github repository](https://github.com/mudash/hab-web-example) that contains scripts and other artifacts used to prepare this example.


![chef phase2 fig 01](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/12/chef-phase2-fig-01-1544817980710.png)

## The Habitat way of building applications
Traditionally, we build applications starting from the infrastructure (servers, operating systems) up towards the application as shown in this diagram:


![chef phase2 fig 02](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/12/chef-phase2-fig-02-1544818000307.png)

This leads to a high degree of coupling between all of these elements. In fact, this entire stack becomes the application, which IT departments carry around until that application is replaced. This is extremely frustrating because everything under the application is just a supporting element. The business value sits at the top, but we must drag along everything else needed to support it. 

Habitat creates portability for all workloads by making an artifact (package) that only contains the application and a manifest of its dependencies. This frees the software from the operating system and middleware. You can export the Habitat package for it to run on different platforms using the exporters available with Habitat.


![chef phase2 fig 03](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/12/chef-phase2-fig-03-1544818011639.png)

A habitat package consists of a plan file and may also include application lifecycle hooks and service configuration files that describe the behavior and configuration of a running package. Detailed guidelines for writing plan are available at [Habitat website](https://www.habitat.sh/docs/developing-packages/). Once you write a plan for an application, you can use online [Habitat builder](https://bldr.habitat.sh/#/pkgs/core) service to build Habitat package or simply build it using studio that comes with Habitat.
## Deploying Nginx Habitat Package to HPE OneSphere managed VM

HPE OneSphere APIs make it easy to deploy virtual machines. Here is a summary of the steps used to deploy Nginx on an AWS VM in an HPE OneSphere environment:

1. Package Nginx with Habitat. It helps that a large number of Habitat [core plans](https://github.com/habitat-sh/core-plans) that package commonly used applications are publicly available. I have based my package on ```core/nginx``` by adding it in dependencies of my plan. My Habitat package is named as ```chefshafique/hab-webserver```, its details are available [here](https://github.com/mudash/hab-web-example/tree/master/web-server-package) in the reference repository. For detailed instructions on developing Habitat packages, refer the [tutorials](https://www.habitat.sh/docs/developing-packages/) available at Habitat website.

2. Write a [Chef recipe](https://github.com/mudash/hab-web-example/blob/master/web-server-recipe/hab_web_example/recipes/default.rb) that installs my Habitat package for Nginx. This simple recipe depends on [Habitat cookbook](https://supermarket.chef.io/cookbooks/habitat), which includes necessary Habitat resources. With the help of these resources, I can install my Habitat package and start its related service in a few lines of code.
```
hab_sup 'default'
hab_package 'chefshafique/hab-webserver' do
    channel 'stable'
end
hab_service 'chefshafique/hab-webserver'
```
3. Create a [script](https://github.com/mudash/hab-web-example/blob/master/vm-install/create-node) based on Python bindings of HPE OneSphere APIs that create AWS-based VM and installs my Habitat package using the above recipe I wrote in step 2. To configure this script for your own environment, refer to the details [here](https://github.com/mudash/hab-web-example/tree/master/vm-install).

4. Execute the script created in step 3 with the following switches. This creates a virtual machine that has Nginx installed with my Habitat package.
```
python3.6 create-node demo-webserver -a -v
```
The virtual machine appears in HPE OneSphere Portal.


![chef phase2 fig 04](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/12/chef-phase2-fig-04-1544818025134.png)

To verify, check that Nginx serves a sample web page.

![chef phase2 fig 05](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/12/chef-phase2-fig-05-1544818037191.png)

## Moving from Virtual Machines to Kubernetes

Habitat makes it easy to move packages to different platforms. I have used these two important tools to accomplish this task:

1. **Habitat exporter for Kubernetes:** Habitat has several exporters that allow packages to be formatted for target platforms. Kubernetes exporter provides a container image and a manifest file to deploy on Kubernetes cluster. You can find details of this and other exporters on [Habitat website](https://www.habitat.sh/docs/developing-packages/#pkg-exports).

2. **Habitat operator for Kubernetes:** This operator is a Kubernetes controller designed to solve running and managing Habitat services by using Custom Resource Definitions (CRD) on Kubernetes. To learn more, go [here](https://www.habitat.sh/get-started/kubernetes/).

Here is an example of the steps you take:

1. Create a new Kubernetes cluster in your private data center. You can find a catalog item in HPE OneSphere with name ‘Kubernetes Cluster’.


![chef phase2 fig 06](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/12/chef-phase2-fig-06-1544818046642.png)

Clicking this catalog item will lead you to a web form where you can enter specifications for the cluster to be created. Details of these steps can be seen [here](https://www.hpeonesphere.com/docs/article/deploying-virtual-machines-and-containers-to-the-private-cloud-vmware-esxi#deploying-a-kubernetes-cluster-private). Once created, the Kubernetes cluster will show up in your project and will allow you to download the kubeconfig file that you can use with kubectl to manage the cluster.

![chef phase2 fig 07](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/12/chef-phase2-fig-07-1544818089082.png)

2. Export the Habitat package using Kubernetes exporter from Habtiat studio using the following command
```
hab pkg export kubernetes chefshafique/hab-webserver
```
This provides a docker container image and a Kubernetes manifest file. I modified this [manifest file](https://github.com/mudash/hab-web-example/blob/master/k8s-install/deploy-k8s-webserver.yaml) to include a load balancer in addition to a default installation.

3. Push the container image to your docker hub
```
$ sudo docker push chefshafique/hab-webserver
```
4. Start the Habitat operator for Kubernetes
```
$ habitat-operator --kubeconfig ~/.kube/config
```
5. Deploy the Kubernetes manifest file (from step 2) to Kubernetes cluster
```
$ kubectl create -f ~/src/deploy-k8s-webserver.yaml
```
6. Verify the results 
```
$ kubectl get services
NAME            	TYPE           	CLUSTER-IP    	EXTERNAL-IP      	PORT(S)        
hab-webserver LoadBalancer   			10.21.63.31   	172.16.172.101   	80:30982/TCP   
kubernetes      ClusterIP      	  	10.21.0.1     	<none>          443/TCP        

$ kubectl get pods
NAME                   READY   STATUS    RESTARTS   
hab-webserver-0   	1/1     	Running   	0          
hab-webserver-1   	1/1     	Running   	0          
hab-webserver-2   	1/1     	Running   	0      
```
Check that Nginx serves the default web page.


![chef phase2 fig 08](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/12/chef-phase2-fig-08-1544818102087.png)

## Conclusion

Habitat exists to solve the problem of how we build, deploy, and manage applications. Building applications so they can run anywhere can sound ambitious. But, with Habitat, this complicated task becomes simple. In this post, I outlined steps for an example scenario that demonstrates deploying Nginx webserver on a virtual machine and a Kubernetes cluster. Since HPE OneSphere provides a unified cloud management portal that enables you to manage both public and private cloud resources hosted on different platforms such as virtual machines and Kubernetes clusters, Habitat can be an excellent tool in your toolkit to move applications between platforms while managing resources through HPE OneSphere.
