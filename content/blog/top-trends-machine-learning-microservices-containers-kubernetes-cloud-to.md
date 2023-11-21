---
title: "Top Trends: Machine Learning, Microservices, Containers, Kubernetes, Cloud to Edge. What are they and how do they fit together?"
date: 2021-01-22T06:42:26.928Z
author: Carol McDonald 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","machine-learning","microservices"]
authorimage: "/img/blogs/Avatar2.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019 may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
"authorDisplayName": "Carol McDonald",
"publish": "2018-02-28T12:00:00.000",
"tags": "use-cases"
```

---

Developers, data scientists, and IT operations are working together to build intelligent apps with new technologies and architectures because of the flexibility, speed of delivery, and maintainability that they make possible. This post will go over some top trending technologies, such as machine learning, containers, Kubernetes, event streams (Kafka API), DataOps, and cloud to edge computing, which are driving this revolution.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/industries-1611298009552.png)

**AI, Machine Learning, Deep Learning**

Predictive machine learning uses algorithms to find patterns in data and then uses a model that recognizes those patterns to make predictions on new data.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/predictive-ml-1611298021253.png)

Why is this so hot? Analytical technology has changed dramatically over the last decade, with more powerful and less expensive distributed computing across commodity servers, streaming analytics, and improved machine learning technologies, enabling companies to store and analyze both far more data and many different types of it. According to [Gartner](https://www.gartner.com/newsroom/id/3812063), over the next few years, virtually every app, application, and service will incorporate some level of AI or machine learning.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/ml-examples-1611298030328.png)

**Microservices**

The [microservice architectural style](https://martinfowler.com/articles/microservices.html) is an approach to developing an application as a suite of small, independently deployable services built around specific business capabilities.

A monolithic application puts all of its functionality into a single process; scaling requires replicating the whole application, which has limitations. With microservices, functionality is put into separate services, allowing these services to be distributed and replicated across servers.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/microservices-1611298039137.png)

[A microservices approach is well-aligned to a typical big data deployment](http://ostatic.com/blog/q-a-maprs-jack-norris-on-the-impact-of-microservices). You can gain modularity, extensive parallelism, and cost-effective scaling by deploying services across many commodity hardware servers. Microservices modularity facilitates independent updates/deployments and helps to avoid single points of failure, which can help prevent large-scale outages.

**Event-Driven Microservices**

A common architecture pattern combined with microservices is event sourcing using an append-only publish subscribe event stream such as MapR Event Streams (which provides a Kafka API).

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/microservices-with-cdp-1611298050238.png)

MapR Event Store provides high performance messaging, which can scale to very high throughput levels, easily delivering millions of messages per second on modest hardware. The publish/subscribe Kafka API provides decoupled communications, wherein producers don't know who subscribes, and consumers don't know who publishes, making it easy to add new listeners or new publishers without disrupting existing processes.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/kafka-api-integration-1611298061346.png)

When you combine these messaging capabilities with the simple concept of microservices, you can greatly enhance the agility with which you build, deploy, and maintain complex data pipelines. Pipelines are constructed by simply chaining together multiple microservices, each of which listens for the arrival of some data, performs its designated task, and optionally publishes its own messages to a topic.

Take, for example, an online shopping application's item rating functionality, as shown in the image below:

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/online-shopping-application-1611298073294.png)

This could be decomposed into the following microservices:

- a service publishes "Rate Item" events to a Topic
- a service reads from the stream and persists a materialized view of the ratings in a NoSQL document datastore
- a browse item ratings service reads from the NoSQL document datastore

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/rating-functionality-decomposed-1611298085852.png)

With event-driven microservices, new functionality can easily be added by deploying new services; for example recommendations, predictive services, and fraud detection service, as shown below:

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/deploying-new-services-1611298100670.png)

Development teams can deploy new services or service upgrades more frequently and with less risk, because the production version does not need to be taken offline. Both versions of the service simply run in parallel, consuming new data as it arrives and producing multiple versions of output. Both output streams can be monitored over time; the older version can be decommissioned when it ceases to be useful.

**Event Streams and Machine Learning Logistics**

Combining event streams with machine learning can handle the logistics of machine learning in a flexible way by:

- Making input and output data available to independent consumers
- Managing and evaluating multiple models and easily deploying new models

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/event-streams-and-ml-logistics-1611298114104.png)

Architectures for these types of applications are discussed in more detail in the [eBook](https://www.scribd.com/document/435442431/Spark2018eBook-pdf) _Machine Learning Logistics_, _Streaming Architecture_, and _Microservices and Containers_.

**Containers**

A [container image](https://www.docker.com/what-container) packages an entire runtime environment: an application, plus all its dependencies, libraries and other binaries, and configuration files needed to execute the application. Compared to virtual machines, containers have similar resources and isolation benefits, but are more lightweight, because containers virtualize the operating system instead of the hardware. Containers are more portable and efficient; they take up less space, use far fewer system resources, and can be spun up in seconds.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/containers-1611298125788.png)

To learn more about containers, click [here](https://www.docker.com/what-container)

**DevOps and Containers**

Similar to how the agile software development movement broke down the handoff between business requirements, development, and testing, [DevOps](https://en.wikipedia.org/wiki/DevOps) breaks down silos between developers and operations with a collaborative process.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/devops-and-containers-1611298138209.png)

To learn more about DevOps, click [here] (https://en.wikipedia.org/wiki/DevOps)

Containers provide greater efficiency for developers: instead of waiting for operations to provision machines, DevOps teams can quickly package an application into a container and deploy it easily and consistently across different platforms, whether a laptop, a private data center, a public cloud, or hybrid environment.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/with-and-without-containers-1611298147637.png)

**Containers and Microservices**

Containers are perfect for microservices; each service can be packaged, and each instance deployed as a container, providing the following benefits:

- Services can be isolated to specific resources
- Each container can be health checked
- Containers can be started upon demand and stopped independently of each other

**Container and Cloud**

The National Institute of Standards and Technology [defines a cloud](https://martinfowler.com/bliki/CloudComputing.html) as access to a pool of computing resources that can be rapidly provisioned and made available with four deployment models: private, community, public, and hybrid. With containers, developers can deploy their microservices directly into production without porting efforts. This ability to deploy across different platforms is destined to become much more important in the emerging hybrid IT environment, in which infrastructure is a combination of existing legacy systems, on-premises and off-premises, private cloud and public cloud.

**Orchestration of Containers and Cloud**

[**Kubernetes**](https://kubernetes.io/) has been a big step toward making containers mainstream. Kubernetes automates "container orchestration": deployment, scaling, and management of containerized applications.

Kubernetes introduced a high-level abstraction layer called a "pod" that enables multiple containers to run on a host machine and share resources without the risk of conflict. A pod can be used to define shared services, like a directory or storage, and expose it to all the containers in the pod.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/kubernetes-1611298156941.png)

This simplifies the management of machines and services, enabling a single administrator to manage thousands of containers running simultaneously.

Kubernetes allows you to orchestrate across on-site deployments to public or private clouds and to hybrid deployments in-between. On-premises computation also is moving quickly to containerized orchestration, and when you can interchangeably schedule services anywhere, you have real revolution.

**DataOps**

Just as the broader IT world has embraced the concept of DevOps, which uses new technologies and processes to brings application developers and operations together in a cohesive and mutually beneficial manner, the data world today is moving toward DataOps. DataOps is an emerging practice utilized by large organizations with teams of data scientists, developers, and other data-focused roles that train machine learning models and deploy them to production. The goal of using a DataOps methodology is to create an agile, self-service workflow that fosters collaboration and boosts creativity while respecting data governance policies. A DataOps practice supports cross-functional collaboration and fast time-to-value. It is characterized by processes as well as the use of enabling technologies, such as the MapR Data Platform.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/dataops-1611298166619.png)

Combining microservices, containers, and event streams with DataOps makes managing and evaluating multiple models and easily deploying new models more efficient and agile.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/continuous-model-deployment-1611298180998.png)

**IoT, Edge Computing, Machine Learning, and the Cloud**

From automobile manufacturers to oil and gas companies, businesses across the globe seek to derive real business value from outcomes like predicting equipment failures, avoiding accidents, improving diagnostics, and more. There is a growing requirement for edge computing, which brings analytics and machine learning models close to IoT data sources. What makes [Edge different](https://www.cbronline.com/feature/edge-computing-artificial-intelligence-iot) is the ability to enable real-time analytics, leveraging local compute for running and feeding machine learning models. In the world of IoT, fast analytics is essential for anomaly detection, fraud detection, aircraft monitoring, oil rig monitoring, manufacturing monitoring, utility monitoring, and health sensor monitoring, where alerts may need to be acted upon rapidly. Imagine how, if machine learning had detected the BP valve pressure anomaly before the Deepwater Horizon explosion in the Gulf of Mexico, [the largest environmental disaster in U.S. history could have been avoided](https://en.wikipedia.org/wiki/Deepwater_Horizon_explosion).

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/cloud-to-the-edge-1611298192469.png)

[Cloud to the Edge](https://www.gartner.com/newsroom/id/3812063), also called [Fog](https://www.cbronline.com/in-depth/iot-fog-computing-cio), is one of the Gartner's top technology trends for 2018, in which a cloud service-oriented model is combined with edge computing for distributed processing that spans the continuum between the cloud and edge. Ted Dunning, Chief Application Architect at MapR, predicts that we will see a full-scale data fabric extend right to the edge next to devices, and, in some cases, we will see threads of the fabric extend right into the devices themselves.

**Conclusion**

A confluence of several different technology shifts have dramatically changed the way that applications are being built. The combination of machine learning, event-driven microservices, containers, DataOps, and cloud to edge computing is accelerating the development of next-generation intelligent applications, which are taking advantage of modern computational paradigms, powered by modern computational infrastructure. The MapR Data Platform integrates global event streaming, real-time database capabilities, and scalable enterprise storage with a collection of data processing and analytical engines to power this new generation of data processing pipelines and intelligent applications.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/mapr-cdp-1611298203271.png)

**Want to learn more?**

- [Why Microservices Running in Containers Need a Streaming Platform](https://thenewstack.io/microservices-running-containers-need-streaming-platform/)
- [Gartner Identifies the Top 10 Strategic Technology Trends for 2018](https://www.gartner.com/newsroom/id/3812063)
- [Gartner Top 10 Strategic Technology Trends for 2018](https://www.gartner.com/smarterwithgartner/gartner-top-10-strategic-technology-trends-for-2018/)