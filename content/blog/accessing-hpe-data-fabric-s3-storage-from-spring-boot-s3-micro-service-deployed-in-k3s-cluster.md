---
title: Accessing HPE Ezmeral Data Fabric S3 Storage from Spring Boot S3 Micro
  Service deployed in K3S cluster
date: 2021-09-13T08:13:40.734Z
featuredBlog: false
priority: 0
author: Kiran Kumar Mavatoor
authorimage: https://gravatar.com/avatar/dddba13c1f3712cb7d1ae9a1111d86d6?s=96
tags:
  - K3S
  - Spring Boot
  - HPE Ezmeral Data Fabric S3 Storage
  - Hpe-Ezmeral-Data-Fabric
  - MapR
  - Quarkus
  - Kubernetes
  - S3
  - Object storage
---
Object Store is a S3 storage service offered by HPE Ezmeral Data Fabric Platform that offers scalable, secure, and well performing object storage. In this article, we will discuss as how to access HPE Ezmeral Data Fabric Object Store (S3) using Spring Boot S3 Micro Service application deployed in [K3S cluster](https://k3s.io/) and perform basic S3 operations like upload, list, delete etc. Below diagram gives the architecture overview 

![](/img/hpe-ezmeral-data-fabric-s3-springboot-k3s.png)

Figure 1:  Architecture overview of Spring Boot S3 Micro Service on K3S with HPE Data Fabric S3 Storage as back end.

The brief description of technology stack used is described below sections :

**Data Fabric Object Storage**

The Object Store with S3-Compatible API stores data generated through multiple data protocols, such as NFS, POSIX, S3, and HDFS. Data in the Object Store is accessible through S3 API requests. The Object Store manages all inbound S3 API requests to store data in or retrieve data from an HPE Ezmeral Data Fabric cluster. More details can be found [here.](https://docs.datafabric.hpe.com/62/MapRObjectStore/MapRObjectStorewithS3-compatibleAPI.html)

**K3S**

K3S is Lightweight Kubernetes. Easy to install, half the memory, all in a binary of less than 100 MB. Its Great for Edge and IOT use cases. More information on K3S can be found at [Rancher](<https://rancher.com/docs/k3s/latest/en/>) site[](https://rancher.com/docs/k3s/latest/en/) . Follow the steps as mentioned in [QuickStart Guide](https://rancher.com/docs/k3s/latest/en/quick-start/) [](https://rancher.com/docs/k3s/latest/en/quick-start/) for installation of K3S cluster. 

**Spring Boot**

Spring Boot is an open source Java-based framework used to create a micro Service. Many Real world applications are written in Spring Boot for faster development and better maintainability. More information can be found at** [spring.io](https://spring.io/projects/spring-boot)**

Note: We can move the Spring Boot application to Quarkus with no change in code.  Moving code to Quarkus will reduce the footprint of Spring Boot application. More information can be found at [Quarkus site](https://quarkus.io/blog/quarkus-for-spring-developers/)

In this blog, checkout existing Spring Boot application from [GitHub](https://github.hpe.com/kiran-mavatoor/df-s3-springboot-k3s-demo) , customise it and execute. 

**Application Prerequisites**

1.      K3S cluster must be accessible. Note down the control plan node details. This information is required to deploy the Spring Boot application.

2.      Access the HPE Data Fabric Object Store service UI running on port 9000. For example URL  - https://FQDN:9000/ .  Note down the access key and secret key. Default access key and secret key is “minioadmin” and “minioadmin” respectively. It is advised to change the default values.

3.      Java 11 , Apache Maven 3.8+ , Docker Client.

**Build and Install Steps**

1.      Check out  an existing Spring Boot application from \[github](<https://github.hpe.com/kiran-mavatoor/df-s3-springboot-k3s-demo>).

2.      Copy the ssl_usertruststore.p12 from the HPE Data Fabric cluster into certs folder under project directory. The ssl_usertruststore.p12 file is located at /opt/mapr/conf directory in cluster node. The password for p12 can be copied from “ssl.client.truststore.password” property value in /opt/mapr/conf/ssl-client.xml .

3.      From project directory, open resources/application.properties. Change the key values as per your environment. 

4.      Execute “mvn clean install” .

5.      The distributable is available in target/df-s3-springboot-k3s-demo-1.0-SNAPSHOT.jar .

6.      Edit the DockerFile located in project directory. The value of 

“-Djavax.net.ssl.trustStorePassword”  must be same as the value of  “ssl.client.truststore.password” obtained from step 2. 

Note: This value can be configured using config-map.yaml in K3S cluster.

7.      Execute below docker commands to build docker image and push it to docker hub. 

Note: Alternatively , we can use podman instead of docker to create images. More information on podman can be obtained from [here](https://developers.redhat.com/blog/2020/11/19/transitioning-from-docker-to-podman#transition_to_the_podman_cli) [](https://developers.redhat.com/blog/2020/11/19/transitioning-from-docker-to-podman#transition_to_the_podman_cli)

```bash
docker build -f Dockerfile -t <Dockerhub user id>/df-s3-springboot-k3s-demo:latest .
docker image ls
docker login -u <Dockerhub user id>
> enter password:  <Dockerhub password>
docker push <Dockerhub user id>/df-s3-springboot-k3s-demo:latest

```

8.      Create below df-s3-springboot-k3s-demo.yaml file for deploying the executable in K3S cluster. Sample yaml file is given in project directory. Please replace <dockerhub userid> with valid id.

```Yaml
apiVersion: v1
kind: Service
metadata:
  name: df-s3-springboot-k3s-demo-service
spec:
  selector:
    app: df-s3-springboot-k3s-demo
  ports:
  - protocol: TCP
    name: df-s3-springboot-k3s-demo
    port: 8000
    targetPort: 8000
  type: LoadBalancer

---

apiVersion: apps/v1
kind: Deployment
metadata:
  name: df-s3-springboot-k3s-demo
spec:
  selector:
    matchLabels:
      app: df-s3-springboot-k3s-demo
  replicas: 1
  template:
    metadata:
      labels:
        app: df-s3-springboot-k3s-demo
    spec:
      containers:
      - name: df-s3-springboot-k3s-demo
        image: <Dockerhub userid>/df-s3-springboot-k3s-demo:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 8000
```

9.      Before deploying it in Kubernetes cluster, validate the docker or podman image by running the image. 

```bash
docker run -p 8000:8000 <Dockerhub userid>/df-s3-springboot-k3s-demo
```

```UI
http://localhost:8000/swagger-ui.hmtl
```

**Deploying in K3S cluster**

1.      Login to control plane node of K3S cluster. Create/Copy the df-s3-springboot-k3s-demo.yaml  to the node.

2.      Execute “kubectl apply -f df-s3-springboot-k3s-demo.yaml”. if required we can specify the namespace option.

3.      Check the pod creation status by using command “kubectl get pods -l app=df-s3-springboot-k3s-demo -o wide”

4.      Verify if the services are properly deployed by using command “kubectl get service df-s3-springboot-k3s-demo-service”

**Accessing the Swagger UI from the pod**

1.      Connect to the pod http://pod-ip:8000/swagger-ui.html

2.      Verify the services exposed in the Swagger-UI

![Swagger UI](/img/swagger-ui.png)