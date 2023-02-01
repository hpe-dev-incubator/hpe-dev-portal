---
title: "Handling application performance monitoring on HPE GreenLake for Private
  Cloud Enterprise – Part 1: A tools overview"
date: 2022-12-27T08:53:23.176Z
author: Guoping Jia
authorimage: /img/guoping.png
disable: false
tags:
  - hpe-greenlake
  - hpe-greenlake-for-private-cloud-enterprise
  - application performance monitoring
  - Splunk
  - Datadog
  - New Relic
  - Dynatrace
  - Prometheus
  - Elastic
  - Apache SkyWalking
---
## Introduction

[HPE GreenLake for Private Cloud Enterprise](https://www.hpe.com/us/en/greenlake/private-cloud-enterprise.html) delivers a modern private cloud to support your app workloads with bare metal, containers, and virtual machines (VMs) running in any combination across your edges, colocations, and data centers. It combines self-service resource access for developers with consumption and performance transparency for IT. Within this modern application environment, having a robust application performance monitoring (APM) tool is becoming essential. It can help IT professionals ensure that deployed applications meet the performance, reliability and valuable user experience required by developers, partners and customers.

This blog post will give an overview of the existing application performance monitoring (APM) tools, their key features, and their deployment and pricing models. It will provide some guidance on your effort in various APM feature evaluation and product selection. I have written it to help you analyze which parts of your stack require the most monitoring and select APM tools that align with the monitoring needs of your applications and operational environment.  

## Application Performance Monitoring (APM)

The continued availability and appropriate performance of an application are essential to a company’s ability to maintain uninterrupted business processes. This prevents unnecessary business disruptions and enhances customer satisfaction. To ensure this, many enterprises use application performance monitoring (APM). APM relies on a collection of tools and processes used to track the performance of applications and analyze the reports to spot anomalies and performance-related issues.

Modern application architectures can be complex, involving large numbers of services and distributed systems located across multiple networks and physical locations, including the cloud. These environments can be challenging to monitor.  

APM tools collect data through metrics, traces and logs to measure performance and identify potential problems. They help collect application data across a broader range of environments and performs sophisticated analytics on data patterns to provide insights on large and complex environments. As the business impact of outages rises day by day, more and more businesses are likely to spend money on the best APM tool that matches their monitoring needs. 

There are a broad range of APM tools to choose from, some specifically dedicated to APM tasks and others with APM functionality built into a broader array of features. Some of the most popular APM tools can be deployed as a Software-as-a-Service (SaaS) solution within a public cloud, or on-premises within a private cloud, or even across a hybrid environment. While you can find a number of APM tools that have a ton of features, covering most use cases, these can also come with premium pricing attached. Choosing a good APM tool that best fits both your monitoring needs and your budget is a challenge.  

## APM Tools: open-source vs commercial vendor

Open source-based APM tools offer a lot of freedom for users, since users can access and customize the tool's source code for their project-specific needs. They also allow for self-hosting, which can help in the context of tightening data protection laws and removing the privacy and security concerns customers may have to put customer data going to third-party services. Open source APM tools also often offer a vibrant community of active developers who might provide helpful plugins and tips.

However, many SaaS-based commercial APM tools offer free or reasonably priced bundles. Open source is rarely **really** free, and many commercial SaaS solutions offer better, more reliable, and reasonably priced APM tools. You should spend time and effort in APM feature evaluation and make the best decision that saves cost and works well with your stack.

## APM Tools Overview

From the [Gartner Research](https://www.gartner.com/reviews/market/application-performance-monitoring-and-observability), it provides the reviews and ratings of existing commercial vendor based application performance monitoring and observability tools in the market. In this blog post, I will take a look at some of those APM tools. I also choose some open-source based APM tools to look at in this blog post. 

### **Splunk**

![](/img/splunk.png)

[Splunk](https://www.splunk.com/) is an extensible data platform that offers a range of solutions for analytics, monitoring and security to identify data patterns, provide metrics and diagnose problems. It delivers real-time monitoring and alerting for all environments, on-premises, hybrid or multicloud.  

Key features:

* Collects data from virtually any source and location
* Converts logs into metrics and analyzes and correlates data to create real-time visualizations and dashboards
* Provides a policy-based mechanism to reserve system resources for workload collection
* Provides a search processing language for both simple searches and advanced data exploration
* Provides thresholds for monitoring events and proactively warns of potential problems when data passes the threshold
* Pushes alerts to notify regarding critical events and impending conditions in real-time
* Analyzes metrics and events data with visualizations like bar charts, reference lines, scatter plots and column charts
* Offers outlier and anomaly detection and predictive analytics using machine learning toolkit
* Supports open source algorithms and creates custom machine learning models to help operationalize data

Splunk is more focused on monitoring and analyzing data generated from various machines, converting them so that they can be analyzed by developers. It takes more of a log management approach that makes it ideal for managing and monitoring the large amount of data generated from the devices running on the network. It’s great for analyzing the huge number of log files generated by enterprise systems. It eliminates the need for IT to spend hours trawling through all the logs looking for performance issues. Splunk integrates data streams from a huge number of sources. It supports a wide range of data formats, and *.xml*, *.csv* and *.json* files are all supported. This is important if a company needs data stream integration from multiple data formats. 

Splunk is a much broader platform and toolset geared for a heavy duty large enterprise. It offers a breadth of management by providing a wide range of products. Splunk bundles similar tools together and offers them as two different types of platforms, _Splunk Cloud_ and _Splunk Enterprise_. Splunk Cloud can be hosted on the cloud server. The entire set of the configurations, as well as the maintenance, is completely done by Splunk. Splunk Enterprise can be maintained by the data center and users need to just style up the entire hardware infrastructure. The integration of Splunk Cloud and Splunk Enterprise provides end-to-end full-stack coverage across hybrid cloud environments.  

Apart from being regarded as a *Visionary* in the latest Gartner Magic Quadrant for APM and Observability, Splunk also has been named as a *Leader* in the latest [Gartner Magic Quadrant for Security Information and Event Management (SIEM)](https://www.splunk.com/en_us/blog/security/2022-gartner-magic-quadrant-for-siem-splunk-named-a-leader-for-the-9th-consecutive-year.html). Splunk includes more than *2300* out-of-the-box integrations for comprehensive tech stack visibility. In [StackShare community](https://stackshare.io/splunk), Splunk has been mentioned in *79* company stacks and *437* developer stacks. It belongs among the founding members and the number one contributor to _OpenTelemetry_. Splunk APM supports open, vendor-neutral instrumentation, allowing for even more flexibility.  

Splunk has a reputation for being expensive. It’s not a low-cost option. Upselling beyond APM, e.g., adding _SIEM_ module and real-time monitoring, can send the budget even higher. It’s very important to determine what you really need and what you can dispense with if you decide to go with Splunk.

### **New Relic**

![](/img/new-relic.png)

[New Relic](https://newrelic.com/) is a SaaS-based observability platform that includes APM as one of its key services. Organizations can trace dependencies across their distributed applications to detect anomalies, address errors, optimize performance and improve the customer experience. The product offers visibility into the application stack, from back-end APIs to the user devices.

Key features:

* Provides flexible instrumentation and dashboarding to collect data to meet the unique needs of specific applications and industries
* Guides appropriate engineer responses and helps them to the most important performance abnormalities using multiple techniques including AI and ML algorithms
* Correlates application performance to end-user experience through real-user monitoring and synthetic monitoring
* Connects application and infrastructure performance to explore the problem
* Uses multiple data types to count and measure every single request to have performance visibility down to the method level
* Supports real-time error analysis with on-demand diagnostic tools
* Integrates with various DevOps tools for incident response, logging and configuration management
* Supports important cloud service instrumentation
* Handles spikes in traffic with SaaS based architecture

New Relic is an *all-in-one* application performance tool that lets you see performance from the end user's experience, through servers and down to the line of application code. It addresses not only APM, but also infrastructure, user monitoring and performance analytics for desktop, web and mobile applications. It offers premium features such as real-time monitoring for mobile, web and cloud application performance. It has a personalized dashboard that keeps track of all monitoring, as well as other activity and application performance. It customizes dashboards and enables alerts with real-time tracking.

New Relic has been graded as a *Leader* in the latest [Gartner Magic Quadrant for APM and Observability](https://newrelic.com/blog/nerd-life/gartner-magic-quadrant-22). In [StackShare community](https://stackshare.io/new-relic#stacks), New Relic has a broader approval rating, being mentioned in *11589* company stacks and *7841* developer stacks. New Relic is very strong in using community resources for learning the application, training of users, and troubleshooting issue via self-serve. It provides support through blogs, meetups, and social media channels. New functions, such as anomaly detection in logs, greater support for Microsoft Azure and AWS integration, data exploration, correlation, browser monitoring, instrumentation and _AIOps_, keep being added and supported. New Relic has outstanding capabilities in reporting and dashboard, user interaction performance, and multicloud resource view. Its _OpenTelemetry_ capabilities and contributions place it ahead of many of other APM tools.

New Relic uses the freemium pricing strategy. It’s free to use with its most generous free tier that include *100GB* data ingest per month for unlimited basic users and 1 free full platform user, with the default data retention of 8 days and up. It then starts its *Standard* plan at *$0.30/GB* beyond, based on the amount of data you want to send to New Relic. Based on the number of users and their permissions, the *Standard* plan offers *$49/month* for core users, and *$99/month* for up to 5 full platform users. New Relic offers the *Pro* and *Enterprise* plans for teams with more than 5 users and those who have  advanced security and support needs. For some premium features, such as real-time application performance monitoring, New Relic is more expensive than other SaaS solutions. You should be careful when deciding whether the additional price for a particular feature is worth it for your company.

### **Datadog**

![](/img/datadog.png)

[Datadog](https://www.datadoghq.com/) is a monitoring, security and analytics platform for cloud applications. It brings together end-to-end traces, metrics, and logs to make applications, infrastructure and third-party services entirely observable. 

Key features:

* Aggregates metrics and events across the full DevOps stack with more than 600 built-in integrations
* Provides full visibility into modern applications for monitoring, troubleshooting and optimizing application performance
* Analyzes and explores log data in context for troubleshooting and alerting
* Monitors proactively the user experience in a single platform
* Correlates frontend performance with business impact
* Visualizes traffic flow in cloud-native environments
* Builds real-time interactive dashboards
* Gets alerted and notified on critical issues
* Instruments applications with new integrations

Datadog is a SaaS-based application that focuses on cloud monitoring and security with public, private and hybrid options. It takes an infrastructure monitoring approach geared toward analytics and application performance, and it is praised especially for its infrastructure and security monitoring features. Datadog handles the entire DevOps and SRE workflow, including the complete incident management and _SIEM_. With its built-in security monitoring capabilities, Datadog is able to send observational data to its Cloud SIEM product. It makes the incident management fairly easy by declaring and managing incidents from events and monitors. Users can create incidents, rank them by severity, manage incident resolution by assigning responsible users and teams, and send basic email and notifications. Some of the features provided by Datadog, such as the real-time alerts and automated reports, bring amazing advantages to organizations. New features, such as network monitoring, security analysis, _AIOps_, business analytics, and incident management, keep being added and supported in Datadog. It offers a much broader applicability both in terms of APM capabilities and monitoring other areas such as infrastructure, device, server, database, and log management. 

Datadog has been graded as a *Leader* in the latest [Gartner Magic Quadrant for API and Observability](https://www.datadoghq.com/resources/gartner-magic-quadrant-apm-observability-2022/). In [StackShare community](https://stackshare.io/datadog), Datadog has been mentioned in *1271* company stacks and *6360* developer stacks. It supports community APIs and extensions to integrate with existing IT infrastructure. Datadog is a major contributor to _OpenTelemetry_. Its learning platform offers web-based coding labs. It enables new users to get hands-on experience in a simulated environment and plunges users into the workflow from the start.

The Datadog interface offers extensive functionality and supports further customization to dashboards and interfaces. With many supported features, it could be difficult for new users who may be overwhelmed by the number of options. They definitely need to take their time to fully understand its features and how to maximize the benefits of those services. In the beginning, it can be hard to track the log data, and create and manage the customer dashboards. Datadog can work with a wide array of data formats and sources. However, it’s not a platform that can deal with a large number of information sources. Data formats, such as *.xml*, *.csv* and *.json*, are not supported. 

Datadog prices out at around *$15 per user*. It has an open pricing policy with published prices. Its pricing per-month options include per host, per million events, and per GB of analyzed log files. As a SaaS-based tool, Datadog offers generally low prices.

### **Dynatrace**

![](/img/dynatrace.png)

[Dynatrace](https://www.dynatrace.com/) is a software-intelligence monitoring platform offering various tools focused on monitoring modern infrastructures and distributed applications, user experience, and business intelligence. 

Key features:

* Provides a single agent to automatically discover, instrument and collect monitoring metrics for all types of entities in application environment
* Ingests metric data and events into its AI engine and provides code-level visibility and root-cause answers for applications
* Uses an interactive topology map to visualize the dynamic relationships among all application components across every tier
* Supports automated remediation through integration with any CI/CD tools
* Monitors cloud environments, virtual machines, network, process, host, server-side service, mobile app and real user
* Discovers and monitors dynamic microservice workloads running in containers
* Monitors message queues to gain visibility into microservice communications
* Provides full front-to-back observability ensuring every application is available, functional, and efficient across every channel for the best customer experiences

Dynatrace is an *all-in-one* platform that monitors the application performance, the underlying infrastructure and the experience of the end users, thanks to its integrated AI engine. Dynatrace deployment is fairly straightforward. The initial setup process offers sufficient onboarding support for deploying the agent based on the environment. It supports configuring the agent from its Web UI. This makes the setup of log monitoring and APM relatively seamless. Dynatrace’s documentation offers sufficient support to deploy, set up and tweak the agent. [Dynatrace University](https://university.dynatrace.com/) is available directly from the UI via a link in the user settings drop-down menu. 

Dynatrace can be deployed either as a SaaS solution with its data being retained in the cloud, or as a *self-managed* solution that allows customers to maintain control of where their data resides, whether in the cloud or on-premises. This deployment model can really help in the context of tightening data protection laws in the customer's environment. 

Dynatrace has been named as a *Leader* in the latest [Gartner Magic Quadrant for APM and Observability](https://www.dynatrace.com/monitoring/gartner-magic-quadrant-for-application-performance-monitoring-observability). In the latest Gartner Critical Capabilities report, Dynatrace has obtained the highest scores in *4* of *6* use cases, ranked as #1 IT Operations, Digital Experience Monitoring (DEM), DevOps/AppDev and SRE/Platform Operations. Dynatrace is a major contributor to _OpenTelemetry_. Its roadmap for _OpenTelemetry_ also puts it ahead of many of other APM tools.

Dynatrace offers minimal alerting, but almost no problem/incident management features out-of-the-box. The third-party incident management and status page solutions must be integrated. Dynatrace has no capabilities in the area of federated, hierarchical, or edge _AI/ML_. 

Dynatrace offers a full-stack pricing model, starting at _$74/month_ per 8 GB per host. It also offers individual product pricing models, such as infrastructure monitoring, digital experience monitoring, application security and open ingestion, etc. Each of those pricing models works as an add-on and is not included in the full-stack. They are charged with additional cost.

### **Elastic**

![](/img/elastic.png)

[Elastic](https://www.elastic.co/) is a distributed search and analytics solution. 

Key features:

* Operates in a distributed environment with scalability and resiliency
* Allows full control over data, users and cluster operations with a variety of management tools, such as snapshots, index lifecycle, data tiers, data streams
* Protects data with a list of security features, such as _keystore_,  encrypted communications, RBAC, IP filtering, security realms, SSO and audit logging
* Supports customized and reliable alerting and notification integration with any other third-party systems
* Allows to work with data using various language clients, Elasticsearch _DSL_ and _SQL_, and _REST APIs_
* Extends Elasticsearch functionality with various plugins and integrations
* Runs and manages Elasticsearch across public cloud, private cloud and Kubernetes using _Elastic Cloud_, _Elastic Cloud Enterprise_ and _Elastic Cloud on Kubernetes_
* Ingests any data type using language clients, ingest nodes, lightweight shippers or _Logstash_
* Enriches raw data using a variety of analyzers, tokenizer, filters, and enrichment options
* Supports document storage, time series analysis and metrics, and geospatial analytics
* Provides full-text search capabilities with its inverted index, tunable relevance scoring and advanced query _DSL_
* Finds data relationships through aggregations and graph exploration and creates alerts
* Models and automates the analysis of time series data, combines alerting and inference using machine learning

Elastic builds and maintains the *Elastic Stack*, an _all-in-one_ platform built upon the proven *Elasticsearch, Logstash, and Kibana (ELK) Stack* for the logs, metrics, and application trace data with a multitude of out-of-the-box integrations. Elastic Stack is the foundation for its primary solutions, *Elastic Enterprise Search*, the fleet of search solutions, *Elastic Observability*, the solution for unified visibility across logs, metrics and APM data, and *Elastic Security*, the solution that unifies endpoint protection and _SIEM_. You can easily deploy any of these solutions as a managed service with Elastic Cloud, with one stack powering three solutions. 

Elastic has been named as a *Visionary* in the latest [Gartner Magic Quadrant for APM and Observability](https://www.elastic.co/explore/devops-observability/2022-gartner-magic-quadrant-apm/). It has a modern initial interface that users can take advantage out of the box. It provides a lot of very powerful tools for data ingestion, data enrichment, data analysis and various plugins and open source integrations, from years of development and community input. Elastic has good capabilities across reporting and dashboards, user interaction performance, multicloud resource view, predictive analysis, and intelligent data push. It’s easy to use, but a bit of a hassle to configure and maintain. Since Elastic is based on open source code, it requires technical skills in open source and it has quite high threshold to get over to understand how the system works and how to configure it properly. 

Elastic offers a 14-day free trial of the *Standard* plan without requiring credit card details. After this, users can choose from 4 paid subscription plans. The *Standard* plan starts at *$95/month*, and it provides access to core security features and solutions including APM. The *Gold* plan adds custom plugins, while the *Platinum* plan offers advanced security features and machine learning support. It also includes endpoint detection and response, protection, and event collection capabilities. The *Enterprise* plan adds additional enterprise features, such as searchable snapshots, _Elastic Maps_ server and data retention for security related data, and raises its cost to *$175/month*.

### **Prometheus**

![](/img/prometheus.png)

[Prometheus](https://prometheus.io/) is an open source system monitoring and alerting toolkit and time series database originally developed by [SoundCloud](https://soundcloud.com/).

Key features:

* Implements a multi-dimensional data model with time series being identified by metric name and a set of key-value pairs
* Provides a flexible query language *PromQL* to leverage the dimensionality
* Stores time series in memory and on local disk in an efficient custom format with no dependency on distributed storage
* Records metrics in real time via a pull model over HTTP
* Allows slicing and dicing of collected time series data to generate ad-hoc graphs, tables, and alerts
* Supports of pushing time series via an intermediary gateway
* Discovers targets via service discovery or static configuration
* Supports multiple modes for visualizing data using a built-in expression browser, *Grafana* integration and a console template language

Prometheus joined [Cloud Native Computing Foundation (CNCF)](https://www.cncf.io) and became its second hosted project after Kubernetes. It has managed to obtain a large and vibrant community of contributors and users ever since. Prometheus is good and focuses mainly on application metric monitoring. In order to have a seamless experience with both metrics and traces that are required by APM, you can integrate Prometheus with other open source tracing tools, such as [Jaeger](https://www.jaegertracing.io/). However, since Jaeger lacks sophisticated capabilities for analyzing and segmenting all of a user's trace data, it has only some support for certain data filtering. Experience with such integration may not be great.

Prometheus is an open source tool with *46K* GitHub stars and *7.7K* Github forks. In [StackShare community](https://stackshare.io/prometheus), Prometheus has been mentioned in *852* company stacks and *1962* developer stacks. Since it is free, Prometheus certainly wins on pricing. However, full functionality of Prometheus demands skills in open source and competence in _Apache_ based applications. Without those required skills and experience, the Prometheus interface can be difficult to master, and some others even find it difficult to set it up and scale.

Prometheus is maintained by volunteers, not by a company. It relies on other open source tools for security. Fixing security issues in Prometheus is done on a *best-effort* basis. Prometheus strives to release security fixes within 7 days for its key components *alertmanager*, *node exporter*, *blackbox exporter* and *pushgateway*, etc.

### **Apache SkyWalking**

![](/img/skywalking.png)

[Apache SkyWalking](https://skywalking.apache.org/) is an open source APM tool with capabilities for monitoring, tracing and diagnosing distributed system. It’s especially designed for microservices, cloud native and container-based architectures. 

Key features:

* Provides metrics analysis of services, service instances and endpoints with distributed tracing, log collecting and metrics collecting and customization
* Supports root cause analysis with profiling the code on the runtime by in-process agent, _eBPF_ profiler and network profiler
* Provides dependency analysis of service instances and endpoints
* Supports service topology map analysis
* Detects slow services and endpoints and provides performance optimization
* Detects slow _SQL_ statement for database performance monitoring
* Provides message queue performance and consuming latency monitoring
* Starts tracing from browser for browser performance monitoring
* Supports infrastructure monitoring for Kubernetes and Linux
* Supports alerting using rules in both observability analysis language and metric analysis language

Apache SkyWalking provides a list of agents to be used for building *Java*, *.NET Core*, *PHP*, *Node.js*, *Golang*, *LUA*, *Rust* and *C++* apps. It supports to integrate and collect data from multiple sources, including _Prometheus_, _OpenTelemetry_ and _Zabbix_ for metrics and logs, _Zipkin_ for traces. It provides tracing, metrics analysis, alerting, service mesh observability and visualization. 

Apache SkyWalking is an open source tool with *21K* GitHub stars and *6K* GitHub forks. In [StackShare community](https://stackshare.io/apache-skywalking#stacks.), Apache SkyWalking does not yet have as great a share of the market, only being  mentioned in 12 developer stacks. However, Apache SkyWalking has more than *600* contributors on GitHub and thousands of contributions every year. All the agents for application instrumentation have been actively maintained. 

Apache SkyWalking is the first open source project that initialized and implemented an [Envoy Access Log Service (ALS)](https://www.envoyproxy.io/docs/envoy/v1.18.2/api-v2/service/accesslog/v2/als.proto) based solution to provide observability on the service mesh, no matter the architecture or language. Since service mesh provides full control of the routed _RPC_, including _HTTP_ and _TCP_, this observation solution is much easier to be added without language-specific technology. With this solution, users can get the application service topology map, metrics graph, request details and error message with a very nice visualization. This integration solution can be extremely important for monitoring and visualizing applications that consist of many microservices running across on-premises, cloud-based or hybrid environments. 

Apache SkyWalking is lightweight and scalable, and it supports alerting and visualization. It can be easily set up as a *self-managed* APM tool within an on-premises data center. This avoids leasing customer data to third-party services and removes the restricted security restriction in the user's environment. 

## Conclusion

In this blog post, I hope I gave you a closer look at some of the best APM tools that are out there, both open-source and commercial vendor based. In it, I have listed the key features of each APM tool and discussed each tool's strengths and weaknesses. The importance of a good APM solution is now indisputable. All it takes is to pick the right one based on your monitoring needs for your applications.   

This blog post is the first of three in a series. In [the second post of the series](https://developer.hpe.com/blog/set-up-apache-skywalking-for-k8s-and-vm-monitoring-in-hpe-greenlake-private-cloud/), I will show you the detailed process on how to set up the Apache SkyWalking APM tool for monitoring and alerting of customer applications deployed on Kubernetes cluster provisioned on HPE GreenLake for Private Cloud Enterprise. In [the third post of the series](https://developer.hpe.com/blog/set-up-apache-skywalking-for-k8s-monitoring-in-hpe-greenlake-for-private-cloud-enterprise/), I will expand on setting up Apache SkyWalking APM tool to monitor the infrastructure of Kubernetes clusters deployed on HPE GreenLake for Private Cloud Enterprise.

## Reference

* [HPE GreenLake for Private Cloud Enterprise](https://www.hpe.com/us/en/greenlake/private-cloud-enterprise.html) 
* [Splunk](https://www.splunk.com/)
* [New Relic](https://newrelic.com/) 
* [Datadog](https://www.datadoghq.com/)
* [Dynatrace](https://www.dynatrace.com/)
* [Elastic](https://www.elastic.co/)
* [Prometheus](https://prometheus.io/)
* [Apache SkyWalking](https://skywalking.apache.org/)