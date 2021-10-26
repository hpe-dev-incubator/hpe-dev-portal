---
title: Mapping Kubernetes Services to HPE Ezmeral Container Platform Gateway
date: 2021-10-26T05:44:07.981Z
author: Cenz Wong
authorimage: https://avatars.githubusercontent.com/u/44856918?s=400&u=37bb095377cd6b4ad21c3a7ab8b5afe185a46941&v=4
---
# Mapping Kubernetes Services to HPE Ezmeral Container Platform Gateway


(Talks more on the benefit on using the HPE Ezmeral Container Platform Gateway?)
The Gateway hosts map both the IP address of the Controller host and the private IP endpoints of services running on the virtual nodes/containers inside the virtual clusters to publicly-accessible IP addresses/ports. 



![image](https://user-images.githubusercontent.com/72959956/138654527-77f3bf2c-f001-4fc7-88f3-d17436368dc3.png)



# Create a Hello World Kubernetes Application



Let's create a hello-world application for Kubernetes. This is a simple webpage showing which pod are you using. To begin with, we have to create a deployment called `k8s-helloworld` with the hello-world image. After deploying, we can run `get deployment` and `describe deployment` to view the detail of the deployment. If you see `1/1` under the `READY` column. It is good to go.



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
kubectl get pods -l app=k8s-helloworld # copy your pod id
kubectl describe pods k8s-helloworld-5f84bb5d68-l9vch 
kubectl exec k8s-helloworld-5f84bb5d68-l9vch -- curl -s http://localhost:8080
```


![image](https://user-images.githubusercontent.com/72959956/138670950-75f96e40-3bc6-4ef6-aff6-578f45b90c04.png)




# Using a Service to Expose an Application in a Cluster



So now you got a website running on Kubernetes, and you want to share this website to your friends. It turns out that your friends cannot open the website. The reason behind is that in order to get a deployment expose to the public, a service object is needed to tell Kubernetes which services port is mapped to the deployment.

To expose your deployment, just run the command `expose deployment` with the name of the deployment and the port number the pod use to create a service object. In this case, it will be port 8080. Run `get services` to view the services and the mapped services port. Now you can access the website externally using the Kubernetes cluster IP together with the services port.



```
kubectl expose deployment/k8s-helloworld --type="NodePort" --port 8080
kubectl get svc -l app=k8s-helloworld

curl ez-vm01.hpeilab.com:31856
```


![image](https://user-images.githubusercontent.com/72959956/138665803-dea57cb9-1209-4b55-810a-5d564ea2b7e5.png)



Now, it is half way done. Move your eyes to the Kubernetes tenant management GUI. In the `Service endpoints` tab, you can see the access point is not yet mapped to HPE Ezmeral Container Platform Gateway.



![image](https://user-images.githubusercontent.com/72959956/138668470-ce8b6846-5fb4-4494-9a90-24aa2be73456.png)



# Mapping the exposed port to HPE Ezmeral Container Platform Gateway



One more step is needed to map your application with the HPE Ezmeral Container Platform Gateway. You have to apply a label `hpecp.hpe.com/hpecp-internal-gateway: "true"` on your Services object. You can do that by adding one line in your YAML files or run `label` command.  The label generates a service port on the Gateway host.




```bash
# Label the service named k8s-helloworld with hpecp.hpe.com/hpecp-internal-gateway=true
kubectl label service k8s-helloworld hpecp.hpe.com/hpecp-internal-gateway=true

# check your port number on the GUI
curl http://ez-gateway.hpeilab.com:10022/
```



![image](https://user-images.githubusercontent.com/72959956/138669273-fa2969b3-61f3-4bae-a2f6-66425daf0a7b.png)




Go back to the Kubernetes tenant management GUI. Now, in the `Service endpoints` tab, you can see the access point is mapped to HPE Ezmeral Container Platform Gateway. You can also find the port by running the command `describe services`. The access point will be shown under the key annotations.



![image](https://user-images.githubusercontent.com/72959956/138668836-0313c1c5-e720-4575-a759-842c85d5502c.png)



![image](https://user-images.githubusercontent.com/72959956/138810536-f1255048-2d91-44eb-ba33-ccc4bc52ca1e.png)





# Deleting the services and Deployment



After playing around with Kubernetes, if you would like to clean up the application. Remember to delete both services and the deployment.



```bash
# delete everything
kubectl delete services/k8s-helloworld
kubectl delete deployment/k8s-helloworld
```

