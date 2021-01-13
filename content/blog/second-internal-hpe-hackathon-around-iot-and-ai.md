---
title: "Second internal HPE Hackathon around IoT and AI"
date: 2020-03-05T18:11:36.248Z
author: Marcel Jakob 
tags: ["hpe-ezmeral-container-platform","hpe-container-platform"]
path: second-internal-hpe-hackathon-around-iot-and-ai
---
![picture1](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/1/picture1-1583431980969.png)

Under the banner of *"We burn for IoT and AI", the HPE presales IoT & Data Analytics team recently hosted our second Hackathon in Boeblingen, Germany. As more and more concrete IoT and AI projects come our way, we find hackathons helpful in developing our knowledge base. Hackathons help us build proficiency by going beyond slide presentations and offering hands-on experience with the technologies required to address the needs of IoT and AI projects. 


As a Hybrid IT presales consultant who was responsible for the planning of the first and the second hackathon, I am proud to say that we not only doubled the number of participants but also the number of use cases we developed. About 20 highly motivated people from the HPE AI, Data Analytics & IoT Competence Center, HPE Pointnext Advisory and Professional Services, and HPE Pointnext Delivery groups pursued the goal of educating themselves and creating tangible outcomes. Besides colleagues from more traditional HPE departments, colleagues from new HPE acquisitions, BlueData and MapR, participated and made a noticeable impact on the development of the use cases. The HPE Customer Technology Center (CTC) in Boeblingen provided us with the perfect location for planning, developing and implementing our visions. 

Use case topics ranged from IoT to AI, with the goal of building Edge-to-Cloud Data Pipelines powered by HPE infrastructure and software that address today’s customer challenges. To give you an idea of what we were able to achieve, here’s a summary of the use cases we covered:## Industrial Data Fabric from Edge-to-Cloud with OT Link & MapR Edge Cluster

In our first use case, we aimed at setting up an Edge-to-Cloud Data Pipeline with an industrial focus. To achieve this, we built a MapR Edge cluster on an HPE Edgeline server and connected it to an already installed MapR datalake on HPE Apollo servers in the data center. Using features like the MapR global namespace and the event store for Apache Kafka, we were able to collect data at the edge and process it in the core/cloud. The data collection performed by an HPE OT Link instance brought the industrial focus to the use case. In fact, HPE OT Link was used to combine operation technology capabilities with enterprise-class IT capabilities in a single system. In the end, we were able to route Industrial IoT data acquired by the OT Link through a MapR Data Pipeline to the core/cloud.


![picture1](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/1/picture1-1583268352426.png)

## Image Classification using HPE ML Ops, powered by NVIDIA GPU acceleration

The goal of this use case was to recognize server parts through an Android app to assist users in differentiating components. A corresponding model for the classification of the components was trained using HPE ML Ops. The training and inference took place on HPE Apollo servers, equipped with Nvidia GPUs. In particular, HPE ML Ops along with GPU acceleration noticeably shortened the training process. The final result was a deep-learning model that was deployed with the feature set of HPE ML Ops.


![picture2](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/1/picture2-1583268373183.png)

## Industrial Data Pipeline and visualization for OEE calculation with Edgeline, OT Link and Azure IoT Hub

In the industrial Data Pipeline use case, we wanted to calculate the key performance indicator for Overall Equipment Effectiveness (OEE) in HPE OT Link and visualize it utilizing OT Links dashboard capabilities and Grafana. For this purpose, we gathered a variety of machine data and built different flows in OT Link in order to calculate the OEE. We sent the telemetry data to Microsoft Azure and added the Azure IoT Edge Device integration in OT Link. As a final result, data was sent to Azure and written into a time-series database. The real-time data is visualized in Grafana and in OT Link.


![picture3](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/1/picture3-1583268389028.png)

## Twitter Sentiment Analysis using MapR Event Store, Kafka, and R on HPE ML Ops

In the last use case, our goal was to perform social media sentiment analysis using HPE ML Ops. For this purpose, a Data Pipeline was built for batch analytics. Using the statistical programming language R, various statistical analyses about the popularity of the keyword were conducted. In a second step, a streaming component utilizing the MapR Event Store for Apache Kafka was added. The resulting real-time data was visualized using a dashboard displaying various reports. The result of this use case is an in-depth batch analysis and a real-time dashboard evaluation to the popularity of the given keyword.


![picture4](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/1/picture4-1583268402834.png)

Some impressions of a week full of hacking and new developments around HPE products and IoT/AI can be seen below:

![picture5](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/1/picture5-1583268416136.png)

Apart from topic-related synergy effects, the team spirit between colleagues in different positions was strengthened. We were excited that our organizational leaders were also interested in our challenges and came around to watch us tackling these challenges. Just like they did for our first hackathon, [HPE DEV](https://developer.hpe.com/community) supported us by supplying us not only equipment but also with helpful tips for planning the event. Additionally, we benefited from Nvidia’s support, since the Nvidia GPUs made a significant difference in training and inference for our second use case.

I want to thank the participants for a great week and fantastic achievements. A special thank you goes to our leaders for making this possible.

In the end, all I can say is that AI, Data Analytics & IoT Competence Center is already looking forward to the next Hackathon!
