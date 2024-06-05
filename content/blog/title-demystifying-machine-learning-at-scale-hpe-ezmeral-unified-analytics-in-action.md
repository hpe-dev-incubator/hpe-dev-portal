---
title: "Demystifying machine learning at scale: HPE Ezmeral Unified Analytics in
  action"
date: 2024-05-20T20:24:58.642Z
featuredBlog: false
author: "Alex Ollman "
authorimage: /img/alex.jpg
thumbnailimage: /img/modern-retail.jpg
disable: false
tags:
  - data analytics
  - "machine learning "
  - Gen AI
  - LLMs
  - AI
  - hpe-ezmeral
---
In 2024, businesses are scuffling to seek innovative ways to leverage Generative AI to elevate customer experiences and streamline operational workflows. Traditional machine learning workflows, tools and trades are the bedrock on which the data-driven world is built – and no matter how loud the hype, that will not change anytime soon.

Whilst generative AI (such as Large Language Models and ChatGPT) can be leveraged to deliver very human-like experiences to end customers, they quite often miss the mark on delivering actual, specific business value. Smaller, custom models that analyze, predict, and deliver based on relevant, tailored data will always win out when counted on to deliver invaluable insights and real, helpful customer experiences that surprise and delight. The challenge isn't just having the skills to wrangle data and develop models, but also setting up the necessary tools and infrastructure, which becomes especially difficult when dealing with large amounts of data.

Enter HPE Ezmeral Unified Analytics – a single-touch, scalable deployment of the best-in-class open-source data, analytics, and machine learning tools on top of any infrastructure.

In this blog post I'll take you on a journey using a smart retail experience that showcases the capabilities of HPE Ezmeral Unified Analytics to gather, process, and interpret retail data from stores across several European countries. This journey will show you how easy it is to work with data and models using HPE Ezmeral Unified Analytics and how you can leverage these tools to create cutting-edge customer experiences.

![This screenshot shows the built-in ecosystem of open source tools segmented by data engineering, analytics, and data science personas. ](/img/demystifying-ml-unifiedanalytics-img1.png "HPE managed ecosystem of open source tools built into HPE Ezmeral Unified Analytics.")

**Embarking on the journey: Harnessing Apache Spark for customer insights**

The journey commences with a fundamental need: understanding diverse customer shopping experiences across European regions utilizing Apache Spark on HPE Ezmeral Unified Analytics. The objective is clear yet ambitious: to analyze extensive sales data and derive actionable insights. **Apache Spark**, renowned for its agility and scalability in handling voluminous datasets, emerges as the natural choice. Seamlessly integrated within HPE Ezmeral Unified Analytics, it furnishes a scalable ecosystem for data processing, eliminating the complexities of manual setups.

![This screenshot show the ability to create a spark session from the Unified Analytics user interface. ](/img/demystifying-ml-spark-img2.png "Simplified Apache Spark management from HPE Ezmeral Unified Analytics. ")

In the Smart Retail Experience, a Spark Interactive session powered by **Apache Livy** generates synthetic sales data reflecting diverse currencies, store locations and stores in delta tables for enhanced data reliability and managed version control.

This initial phase of data prep-work lays the foundation for informed decision-making. Insights into trends, such as regional product preferences and seasonal sales peaks can now be unearthed, setting the stage for advanced, data-driven strategies.

**Advancing with Apache Presto to streamline data connectivity**

The journey progresses with **Apache Presto**, an integral component of HPE Ezmeral Software that amplifies Presto's capabilities, enabling the connection to and querying of various data sources seamlessly within a unified environment. With Presto, data from different stores can be amalgamated into a single view that you can easily manipulate and analyze. This seamless integration empowers real-time access to insights from data lakes, allowing for federated queries on data without worrying about the underlying complexity of tying each application to each data source individually.

![This screenshot how HPE Ezmeral Software amplifies Presto's capabilities by connecting to and querying of various data sources within a unified environment. ](/img/demystifying-ml-presto-img3.png "From a unified interface, quickly connect to and query multiple data sources then manipulate and analyze. ")

What's really impressive about Presto is its integration within the HPE Ezmeral Unified Analytics ecosystem, allowing not just for querying but directly connecting processed outputs for further analysis or visualization in tools like Apache Superset. The convenience of managing data sources, running queries, and directly utilizing this data across various stages of the MLOps pipeline underlines the unified approach of HPE Ezmeral Unified Analytics, streamlining workflows and eliminating the need for disjointed tool management.

**Visualizing Insights: Unveiling data using Apache Superset**

Next, visualization with **Apache Superset** illustrates the ease of creating engaging, insightful dashboards that outline pivotal business metrics, like the top-selling fruits, variation in sales over different years, or customer purchasing behavior. Clear visual storytelling delivers powerful insights, informing both store operations and strategic decision-making.

![This shows a sample of visualization capabilities within HPE Ezmeral Unified Analytics. ](/img/demystifying-ml-superset-img4.png "Quick generate visualizations within HPE Ezmeral Unified Analytics to reduce redundant data preparation steps. ")

The ability to generate these visualizations from Cached Assets within the HPE Ezmeral Unified Analytics platform adds layers of efficiency—data that is queried and transformed through Presto can directly feed into Superset without redundant steps of data preparation.

**Towards enhanced checkout experiences: Harnessing machine learning**

Armed with substantial insights, attention turns to enhancing the customer checkout experience through machine learning. A MobileNetV2 object recognition model is trained using **TensorFlow** to recognize fresh produce via vision-based machine learning, presenting a transformative solution for streamlining checkout processes, particularly in self-service scenarios.

![This screenshot highlights integration between MLflow and HPE Ezmeral Unified Analytics for managing model training, tracking, and version control. ](/img/demystifying-ml-mlflow-img5.png "Effortless integration between MLflow and HPE Ezmeral Unified analytics reduces the complexity of managing the machine learning lifecycle. ")

In the subsequent exercises, we delve into the model-building phase using TensorFlow, followed by MLflow for managing the machine learning lifecycle, including model training, tracking, and version control.

HPE Ezmeral Unified Analytics seamless integration with **MLflow** via internally hosted Jupyter notebooks removes all the pain of managing the machine learning lifecycle, from model training and tracking to version control and storing. This integrated workflow not only simplifies the complex process of machine learning model development but also ensures models are scalable, reproducible, and ready for deployment.

**Seamless model deployment with KServe**

With the model primed for deployment, the focus shifts to deployment logistics. KServe, a model serving framework on HPE Ezmeral, emerges as the solution, enabling efficient deployment and management of machine learning models. Noteworthy is its capability to auto-scale based on demand and seamlessly integrate with existing Kubernetes infrastructure, all under the umbrella of HPE Ezmeral Unified Analytics.

![This screenshot depicts KServe and HPE Ezmeral work together to efficiently deploy and manage machine learning models. ](/img/demystifying-ml-kserve-img6.png "Flawless integration between KServe and HPE Ezmeral Software simplifies ML model deployment, management, and auto-scaling with existing Kubernetes infrastructure. ")

**Bringing it all together**

The Smart Retail Experience culminates with the transition from background operations to front-end application, where a custom-built smart retail application leverages the [served](<>) model to identify fresh produce through a clean user interface and a connected webcam.

Just like a self-checkout lane at a store, this application demonstrates how HPE Ezmeral Unified Analytics lets you easily deploy machine learning models you build and use.

![This pictures shows a human presenting an orange to a checkout webcam. ](/img/alex-blog-visual-ai-orange.png "Leveraging the served model, the smart retail application can identify fresh produce through a connected webcam and clean user interface. ")

![This pictures shows the end result of the ML model and webcam simplifying a retail checkout process by identifying and placing the cost of an orange in the customer's virtual basket. ](/img/retail2-with-pricing-.png "The end result of this blog shows the model identifying the orange and charging the customer in the checkout basket. ")

**Summary**

See how easy it is to deliver data analytics and machine learning projects with HPE Ezmeral Unified Analytics in our technical demonstration. By leveraging powerful open-source tools, businesses can create unique and impactful customer experiences.

Thank you for accompanying us on this detailed exploration of data analytics, machine learning, and application deployment within the retail sector using HPE Ezmeral Unified Analytics. We trust this tutorial informed and inspired, propelling your business towards transformative possibilities.

Don't miss future updates and tutorials from Hewlett Packard Enterprise as we explore how AI can revolutionize various industries.