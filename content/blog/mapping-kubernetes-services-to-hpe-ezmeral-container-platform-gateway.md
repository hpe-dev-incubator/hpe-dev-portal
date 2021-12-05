---
title: Mapping Kubernetes Services to HPE Ezmeral Runtime Gateway
date: 2021-10-26T05:44:07.981Z
author: Cenz Wong
authorimage: https://avatars.githubusercontent.com/u/44856918?s=400&u=37bb095377cd6b4ad21c3a7ab8b5afe185a46941&v=4
thumbnailimage: https://docs.containerplatform.hpe.com/53/images/5.2/01_unversal_concepts/gateway_hosts_logical_kubernetes.jpg
tags:
  - hpe-ezmeral-runtime
---

**Editor’s Note – NAME CHANGE: HPE Ezmeral Container Platform is now HPE Ezmeral Runtime.** HPE Ezmeral Runtime is a software platform designed to deploy cloud-native and non-cloud-native applications using 100% open source Kubernetes – running on bare-metal or virtualized infrastructure – on-premises, on any cloud, and at the edge. For more information on why the name was changed, please click [here](https://community.hpe.com/t5/HPE-Ezmeral-Uncut/HPE-Ezmeral-Container-Platform-is-now-HPE-Ezmeral-Runtime/ba-p/7151720#.YW7nOxrMKM8).

Imagine you have different Kubernetes services and different services come with different IP addresses. Does it have some tools to unify different services into single domain name? A gateway will be the answer of the question. There are several benefit of using a gateway. First, the gateway can act a load-balancer on different services. Second, only a gateway host IP address is exposed to the public while the rest of the host are still behind the firewall. Follow this blog if you would like to learn more about how to map Kubernetes Services to HPE Ezmeral Runtime Gateway.

HPE Ezmeral Runtime (formerly known as HPE Ezmeral Container Platform) comes with one or more gateway hosts. A gateway host acts as a proxy server that carries client requests like HPE Ezmeral Runtime UI, REST API calls, Kubernetes API and containerized application service endpoints. The Gateway host maps both the IP address of the Controller host and the private IP endpoints of services running on the Kubernetes nodes inside the Kubernetes clusters to publicly-accessible IP addresses/ports.



(Note: To learn more about the the Gateway Host, check [this](https://docs.containerplatform.hpe.com/53/reference/universal-concepts/Gateway_Hosts.html#v52_gateway-hosts__logical).)



To set up this architecture properly, you'll want to first set up a new Kubernetes (K8s) tenant, as shown in the image below, just check the box next to "Map Services To Gateway":



![image](https://user-images.githubusercontent.com/72959956/138654527-77f3bf2c-f001-4fc7-88f3-d17436368dc3.png)



# Create a Hello World Kubernetes Application



Let's create a hello-world application for Kubernetes. This is a simple webpage showing which pod are you using. To begin with, create a deployment called `k8s-helloworld` with the hello-world image. After that, run `get deployment` and `describe deployment` to view the detail of the deployment. If you see `1/1` under the `READY` column, it is good to go.



```bash
# Create deployment of the application k8s-helloworld using the specific image
kubectl create deployment k8s-helloworld --image=gcr.io/google-samples/kubernetes-bootcamp:v1

# Get the information of the deployment with label k8s-helloworld
kubectl get deployment -l app=k8s-helloworld

# Describe the detail information of the deployment named as k8s-helloworld
kubectl describe deployment k8s-helloworld
```


![image](https://user-images.githubusercontent.com/72959956/138656214-73c9418f-e291-4678-b3a2-c318a318d325.png)



The deployment will spin up some pods. To view which pods is running, you can run `get pods` commands. It will return a list of pods. Copy the pod name starting with k8s-helloworld and run an `exec` command to check the website is up or not. If you see the terminal reply you with `Hello Kubernetes bootcamp!`, you have successfully put a website on Kubernetes.



```bash
# Get the information of pods labeled with k8s-helloworld
kubectl get pods -l app=k8s-helloworld # copy your pod id
kubectl describe pods k8s-helloworld-5f84bb5d68-l9vch 

# exec curl command inside the pod

kubectl exec k8s-helloworld-5f84bb5d68-l9vch -- curl -s http://localhost:8080
```


![image](https://user-images.githubusercontent.com/72959956/138670950-75f96e40-3bc6-4ef6-aff6-578f45b90c04.png)




# Using a Service to Expose an Application in a Cluster



So now you got a website running on Kubernetes, and you want to share this website to your friends. It turns out that your friends cannot open the website. The reason behind is that in order to get a deployment expose to the public, a service object is needed to tell Kubernetes which services port is mapped to the deployment.

To expose your deployment, just run the command `expose deployment` with the name of the deployment and the port number the pod used to create a service object. In this case, it will be port 8080. Run `get services` to view the services and the mapped services port. Now you can access the website externally using the Kubernetes nodes IP address together with the services port.



```
# Expose the deployment with Port number 8080
kubectl expose deployment/k8s-helloworld --type="NodePort" --port 8080
# Get the information on Services labeled with k8s-helloworld
kubectl get svc -l app=k8s-helloworld
# Check if the application can be accessed from Kubernetes Cluster

curl ez-vm01.hpeilab.com:31856
```


![image](https://user-images.githubusercontent.com/72959956/138665803-dea57cb9-1209-4b55-810a-5d564ea2b7e5.png)



At this point, you are half way done. Now, move to the Kubernetes tenant management GUI (shown in the image below). In the `Service endpoints` tab, you can see that the access point is not yet mapped to HPE Ezmeral Runtime Gateway.



![image](https://user-images.githubusercontent.com/72959956/138668470-ce8b6846-5fb4-4494-9a90-24aa2be73456.png)



# Making the application available to users



One more step is needed to expose your containerized application to users outside your HPE Ezmeral Runtime infrastructure. You can expose the Kubernetes NodePort service of your application via the HPE Ezmeral Runtime gateway by setting up a port mapping. You have to apply a label `hpecp.hpe.com/hpecp-internal-gateway: "true"` on your NodePort Service object. You can do that by adding one line in your YAML files or run `label` command. The label generates a service port on the gateway host.




> Note: 
> 
> This behavior will be done automatically within any namespace associated with an HPE Ezmeral Runtime tenant and if that tenant has the "Map Services To Gateway" enabled. However you can control this behavior by labelling the NodePort service, either to force or to prevent the port mapping on the gateway host.






```bash
# Label the service named k8s-helloworld with hpecp.hpe.com/hpecp-internal-gateway=true
kubectl label service k8s-helloworld hpecp.hpe.com/hpecp-internal-gateway=true



```



![image](https://user-images.githubusercontent.com/72959956/138669273-fa2969b3-61f3-4bae-a2f6-66425daf0a7b.png)




Go back to the Kubernetes tenant management GUI. Now, in the `Service endpoints` tab, you can see the access point is mapped to HPE Ezmeral Runtime Gateway. 



![image](https://user-images.githubusercontent.com/72959956/138668836-0313c1c5-e720-4575-a759-842c85d5502c.png)

You can also find the port by running the command `kubectl describe services`. The access point will be shown under the key annotations.



![image](https://user-images.githubusercontent.com/72959956/138810536-f1255048-2d91-44eb-ba33-ccc4bc52ca1e.png)

Now, the services has mapped to the gateway and you can now access it though the gateway. A hello world message will appear when you `curl` a the URL.

```bash
# check your port number on the GUI
curl http://ez-gateway.hpeilab.com:10022/
```






# Deleting the services and deployment



After playing around with Kubernetes, if you would like to clean up the application, remember to delete both services and the deployment.



```bash
# delete everything
kubectl delete services/k8s-helloworld
kubectl delete deployment/k8s-helloworld
```

# Take away

Mapping Kubernetes services to HPE Ezmeral Runtime gateway gives you a single point of secure access to the platform, which also provides load-balancing. As you can see from what we just went through, it really isn't that hard. Feel free to ;Try it for yourself. After playing around with this, if you would like to clean up the application, remember to delete both the services and the deployment. Stay tuned to the [HPE DEV blog](https://developer.hpe.com/blog) to learn more on other [HPE Ezmeral Runtime](https://developer.hpe.com/platform/hpe-ezmeral-runtime/home/) related topics.


