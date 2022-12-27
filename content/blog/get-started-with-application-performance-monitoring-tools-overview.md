---
title: "Get started with application performance monitoring: tools overview"
date: 2022-12-27T08:53:23.176Z
author: Guoping Jia
authorimage: /img/guoping.png
disable: false
tags:
  - hpe-greenlake
  - Application Performance Monitoring
  - Datadog
  - New Relic
  - Splunk
  - Prometheus
  - Elastic
  - Apache SkyWalking
  - Synatrace
---
## Introduction

[HPE GreenLake for Private Cloud Enterprise](https://www.hpe.com/us/en/greenlake/private-cloud-enterprise.html) delivers a modern private cloud to support your app workloads with bare metal, containers, and virtual machines (VMs) running in any combination across your edges, colocations, and data centers. It combines self-service resource access for developers with consumption and performance transparency for IT. Within this modern application environment, having a good application performance monitoring (APM) tool is becoming a must. It can help IT professionals to ensure that deployed applications meet the performance, reliability and valuable user experience required by partners and customers. 

This blog post will give an overview of the existing application performance monitoring (APM) tools, their key features, and the deployment and pricing models. It can help you and provide some guidance on your effort in various APM feature evaluation and product selection by deciding the most beneficial data for your application and selecting APM tools based on your monitoring needs for your applications and its operational environment.

## Application Performance Monitoring (APM)

Application performance monitoring (APM) is the collection of tools and processes to track the performance of application and analyze it to spot anomalies and performance-related issues. The continued availability and appropriate performance of an application are essential to a company’s ability to maintain uninterrupted business processes. This prevents unnecessary business disruptions and enhances customer satisfaction. Modern application architectures can be complex, involving large numbers of services and distributed systems located across multiple networks and physical locations, including the cloud. This evolution can present challenging environments to monitor.
APM tools have been configured to collect data through metrics, traces and logs to measure performance and identify potential problems. It helps to collect application data across a broader range of environments and performs sophisticated analytics on data patterns to provide insights on large and complex environments.
It provides a list of core capabilities, including automatic discovery and mapping, end-to-end observability, mobile and desktop application monitoring, root-cause and impact analysis, integration and automation, endpoint monitoring, VDI monitoring, API monitoring, application architecture, service monitoring, container monitoring and end-user experience monitoring.

There is a wealth of APM tools, either dedicated to APM tasks or with APM functionality built into a broader array of features. Some of the most popular tools for APM include both open-source and commercial vendor offerings. They can be deployed as SaaS solution to public cloud, or on-premises to private cloud, or even to hybrid environment. Choosing a good APM tool that best fits your needs is a challenge. You should spend time and effort in APM feature evaluation and product selection by deciding the most beneficial data for your application and selecting APM tools based on your monitoring needs for your applications and its operational environment.

## APM Tools: open-source vs commercial vendor

The market is saturated with commercial but also free and open-source based APM tools. Picking the right one for your stack might be tricky. 

Open source based APM tools give a lot of freedom to their users since they can access and customize the tool’s source code for their project-specific needs. It also allows for self-hosting, which can help in the context of tightening data protection laws and remove the privacy and security concerns customers may have to put customer data going to third party services. Open source APM tools also often offer a vibrant community of active developers who might provide helpful plugins and tips.

However, many SaaS-based commercial APM tools offer free or reasonably priced bundles. Open source is rarely free, and many commercial SaaS solutions offer better, more reliable, and reasonably priced APM tools.

## APM Tools Overview

Let’s take a look at some of the most common, most reliable and community-approved APM tools.

### **Splunk**

![](/img/splunk.png)

[Splunk](https://www.splunk.com/) is an extensible data platform that offers a range of solutions for analytics, monitoring and security to identify data patterns, provide metrics and diagnose problems. It delivers real-time monitoring and alerting for all environment, on-premises, hybrid or multi-cloud.  

Key features:

* collect data from virtually any source and location;
* convert logs into metrics and analyze and correlate data to create real-time visualizations and dashboards;
* provide a policy-based mechanism to reserve system resources for workload collection;
* provides a search processing language for both simple searches and advanced data exploration;
* provide thresholds for monitoring events and proactively warn of potential problems when data passes the threshold;
* push alerts to notify critical events and impending conditions in real-time;
* enable to convert logs into metrics consisting of numerical data points captured over time;
* enable to analyze metrics and events data with visualizations like bar charts, reference lines, scatter plots and column charts, etc.;
* offer outlier and anomaly detection and predictive analytics using machine learning toolkit;
* support open source algorithms and create custom machine learning models to help operationalize data; 

Splunk is more focused on monitoring and analyzing data generated from various machines, converting them so that they can be analyzed by developers. It takes more of a log management approach that makes it ideal for managing and monitoring the large amount of data generated from the devices running on the network. It’s great for analyzing the huge number of log files generated by enterprise systems. It eliminates the need for IT to spend hours trawling through all the logs looking for performance issues. Splunk integrates data streams from a huge number of sources. It supports a wide range of data formats, and *.xml*, *.csv* and *.json* files are all supported. This is important if company needs data stream integration from multiple data formats. 

Splunk is a much broader platform and toolset geared for a heavy duty large enterprise. It offers a breadth of management by providing a wide range of products.  Splunk bundles similar tools together and offers them as two different types of platforms, Splunk Cloud and Splunk Enterprise. Splunk Cloud can be hosted on the cloud server. The entire set of the configurations, as well as the maintenance , is completely done by Splunk. Splunk Enterprise can be maintained by the data center and users need to just style up the entire hardware infrastructure.  

Apart from being regarded as a *Visionary* in the latest Gartner Magic Quadrant for APM and Observability, Splunk has been named also as a *Leader* in the latest [Gartner Magic Quadrant for Security Information and Event Management (SIEM)](https://www.splunk.com/en_us/blog/security/2022-gartner-magic-quadrant-for-siem-splunk-named-a-leader-for-the-9th-consecutive-year.html). Splunk includes more than *2300* out-of-the-box integrations for comprehensive tech stack visibility. In [StackShare community](https://stackshare.io/splunk), Splunk has been mentioned in *79* company stacks and *437* developer stacks. It belongs among the founding members and active contributors to OpenTelemetry, Splunk APM supports open, vendor-neutral instrumentation, allowing for even more flexibility.

Splunk has a reputation for being expensive. It’s not a low-cost option. Upselling beyond APM, e.g., adding SIEM module and real-time monitoring, can send the budget even much higher. It’s very important to determine what you really need and what you can dispense with Splunk.

### **New Relic**

![](/img/new-relic.png)

[New Relic](https://newrelic.com/) is a SaaS-based observability platform that includes APM as one of its key services. Organizations can trace dependencies across their distributed applications to detect anomalies, address errors, optimize performance and improve the customer experience. The product offers visibility into the application stack, from back-end APIs to the user devices.

Key features:

* An all-in-one observability platform with focus on data process and analysis for application monitoring;
* provide flexible instrumentation and dashboarding to collect data to meet the unique needs of specific applications and industries;
* guide appropriate engineer responses and help them to the most important performance abnormalities using multiple techniques including AI and ML algorithms;
* correlate application performance to end-user experience through real-user monitoring and synthetic monitoring;
* connect application and infrastructure performance to explore the problem;
* use multiple data types to count and measure every single request to have performance visibility down to the method level;
* support real-time error analysis with on-demand diagnostic tools;
* integrate with various DevOps tools for incident response, logging and configuration management;
* support important cloud service instrumentation;
* handle spikes in traffic with SaaS based architecture;

New Relic is an *all-in-one* application performance tool that lets you see performance from the end user experience, through servers and down to the line of application code. It has been graded as a *Leader* in the latest [Gartner Magic Quadrant for APM and Observability](https://newrelic.com/blog/nerd-life/gartner-magic-quadrant-22). In [StackShare community](https://stackshare.io/new-relic#stacks), New Relic has a broader approval, being mentioned in *11589* company stacks and *7841* developer stacks. New Relic is very strong using community resources for learning the application, training of users, and troubleshooting issue via self-serve. It provides available supports in blogs, meetups, and social media channels. New functions such as anomaly detection in logs, greater support for Azure and AWS integration, data exploration, correlation, browser monitoring, instrumentation and AIOps are kept being added and supported. 

New Relic addresses not only APM, but also infrastructure, user monitoring and performance analytics for desktop, web and mobile applications. It offers premium features such as real-time monitoring for mobile, web and cloud application performance. It has a personalized dashboard that keeps track of all monitoring, as well as other activity and application performance. It customizes dashboards and enable alerts with real-time tracking.

New Relic takes the freemium pricing strategy. It’s free to use with its most generous free tier that include *100GB* data ingest per month for unlimited basic users and 1 free full platform user, with the default data retention of 8 days and up. It then starts its *Standard* plan at *$0.30/GB* beyond based on the amount of data to send to New Relic. Based on the number of users and their permissions, the *Standard* plan offers *$49/month* for core users, and *$99/month* for up to 5 full platform users. New Relic offers the *Pro* and *Enterprise* plans for teams with more than 5 users and advanced security and support needs. For some premium features such as real-time application performance monitoring, New Relic is more expensive than other SaaS solutions. You should be careful when decide whether an additional price tag, e.g., real-time monitoring, is worth for your company.

### **Datadog**

![](/img/datadog.png)

[Datadog](https://www.datadoghq.com/) is a monitoring, security and analytics platform for cloud applications. It brings together end-to-end traces, metrics, and logs to make applications, infrastructure and third-party services entirely observable. 

Key features:

* aggregate metrics and events across the full DevOps stack with more than 600 built-in integrations;
* provide full visibility into modern applicaiotns for monitoring, troubleshooting and optimizing application performance;
* analyze and explore log data in context for troubleshooting and alerting;
* monitor proactively the user experience in a single platform;
* correlate frontend performance with business impact;
* visualize traffic flow in cloud-native environments;
* build real-time interactive dashboards;
* get alerted and notified on critical issues;
* instrument applications with new integrations;

Datadog is a SaaS-based application that focus on cloud monitoring and security. It takes an infrastructure monitoring approach geared toward analytics and application performance, and it is praised especially for its infrastructure and security monitoring features. Datadog handles the entire DevOps and SRE workflow, including the complete incident management and SIEM. It makes the incident management fairly easy by declaring and managing incidents from events and monitors. Users can create incidents, rank them by severity, manage incident resolution by assigning responsible users and teams, and send basic email and notifications. Some of the features provided by Datadog, such as the real-time alerts and automated reports, bring amazing advantages to organizations. New features, such as network monitoring, security analysis, AIOps, business analytics, and incident management, are kept being added and supported in Datadog. It offers much broader applicability both in terms of APM capabilities and monitoring other areas such as infrastructure, device, server, database, and log management.

Datadog has been graded as a *Leader* in the latest [Gartner Magic Quadrant for API and Observability](https://www.datadoghq.com/resources/gartner-magic-quadrant-apm-observability-2022/). In [StackShare community](https://stackshare.io/datadog), Datadog has been mentioned in *1271* company stacks and *6360* developer stacks. It supports community APIs and extensions to integrate with existing IT infrastructure. Datadog’s learning platform offers web-based coding labs, It enables new users to get hands-on experience in a simulated environment and plunges users into the workflow from the start.

Datadog interface offers extensive functionality and it supports further to customize dashboards and interfaces to the way customers want. With many supported features, it could be difficult for new users who may be overwhelmed by the number of options. They definitely need to take their time to fully understand its features and how to maximize the benefits of those services. In the beginning, it can be hard to track the log data and create and manage the customer dashboards. Datadog can work with a wide array of data formats and sources. However, it’s not a platform that can deal with a large number of information sources. Data formats, such as *.xml*, *.csv* and *.json*, are not supported. 

Datadog prices out at around *$15 per user*. It has an open pricing policy with published prices. Its pricing per-month options include per host, per million events, and per GB of analyzed log files. As a SaaS-based tool, Datadog offers generally low prices.

### **Dynatrace**

![](/img/dynatrace.png)

[Dynatrace](https://www.dynatrace.com/) is a software-intelligence monitoring platform offering various tools focused on monitoring modern infrastructures and distributed applications, user experience, and business intelligence. 

Key features:

* provide a single agent to automatically discover, instrument and collect monitoring metrics for all types of entities in application environment;
* ingest metric data and events into its AI engine and provide code-level visibility and root-cause answers for applications;
* use an interactive topology map to visualize the dynamic relationships among all application components across every tier;
* support automated remediation through integration with any CI/CD tools;
* monitor cloud environments, virtual machines, network, process, host, server-side service, mobile app and real user;
* discover and monitor dynamic microservice workloads running in containers;
* monitor message queues to gain visibility into microservice communications;
* provide full front-to-back observability ensuring every application is available, functional, and efficient across every channel for the best customer experiences;

Dynatrace is an *all-in-one* platform that monitors the application performance, the underlying infrastructure and the experience of the end users, thanks to its integrated AI engine. It has been named as a *Leader* in the latest [Gartner Magic Quadrant for APM and Observability](https://www.dynatrace.com/monitoring/gartner-magic-quadrant-for-application-performance-monitoring-observability). In the latest Gartner Critical Capabilities report, Dynatrace has obtained the highest scores in *4* of *6* use cases,  ranked as #1 IT Operations, Digital Experience Monitoring (DEM), DevOps/AppDev and SRE/Platform Operations.

Dynatrace deployment is fairly straightforward. The initial setup process offers sufficient onboarding support for deploying the agent based on the environment. It supports to configure the agent from its Web UI, this makes the setup of log monitoring and APM relatively seamless. Dynatrace’s documentation offers sufficient support to deploy, set up and tweak the agent. Its university is available directly from the UI via a link in the user settings drop-down menu. Dynatrace can be deployed either as a SaaS solution with its data being retained in the cloud, or as a *self-managed* solution that allow customers to maintain control of where their data resides, whether in the cloud or on-premises. This deployment model can really help in the context of tightening data protection laws in the customer environment. 

Dynatrace offers minimal alerting, but almost no problem/incident management features out-of-the-box. The third-party incident management and status page solutions must be integrated.

Dynatrace offers a full-stack pricing model, starting at $74/month per 8 GB per host. It also offers individual product pricing models, such as infrastructure monitoring, digital experience monitoring, application security and open ingestion, etc. Each of those pricing models works as an add-on and is not included in the full-stack. They are charged with additional cost.

### **Elastic**

![](/img/elastic.png)

[Elastic](https://www.elastic.co/) is a distributed search and analytics solution. 

Key features:

* operate in a distributed environment with scalability and resiliency;
* allow full control over data, users and cluster operations with a variety of management tools, such as snapshots, index lifecycle, data tiers, data streams, etc;
* protect data with a list of security features, such as keystore,  encrypted communications, RBAC, IP filtering, security realms, SSO and audit logging, etc;
* support customized and reliable alerting and notification integration with any other third-party systems;
* allow to work with data using various language clients, Elasticsearch DSL and SQL, and REST APIs;
* extend Elasticsearch functionality with various plugins and integrations;
* run and manage Elasticserach across public cloud, private cloud and Kubernetes using Elastic Cloud, Elastic Cloud Enterprise and Elastic Cloud on Kubernetes;
* ingest any data type using language clients, ingest nodes, lightweight shippers or Logstash;
* enrich raw data using a variety of analyzers, tokenizer, filters, and enrichment options;
* support document storage, time series analysis and metrics, and geospatial analytics;
* provide full-text search capabilities with its inverted index, tunable relevance scoring and advanced query DSL;
* find data relationships through aggregations and graph exploration and create alerts
* model and automate the analysis of time series data, combine alerting and inference using machine learning;

Elastic builds and maintains the *Elastic Stack*, an all-in-one platform built upon the proven *ELK Stack* for the logs, metrics, and application trace data with a multitude of out-of-the-box integrations. Elastic Stack is the foundation for its primary solutions, *Elastic Enterprise Search*, the fleet of search solutions, *Elastic Observability*,  , the solution for unified visibility across logs, metrics, and APM data, and *Elastic Security*, the solution that unifies endpoint protection and SIEM. You can easily deploy any of these solutions as a managed service with Elastic Cloud, with one stack powering three solutions, that you can deploy anywhere.

Elastic has been named as a *Visionary* in the latest [Gartner Magic Quadrant for APM and Observability](https://www.elastic.co/explore/devops-observability/2022-gartner-magic-quadrant-apm/). It has a modern initial interface that users can take advantage out of the box. It provides a lot of very powerful tools for data ingestion, data enrichment, data analysis and various plugins and open source integrations, from years of development and community input. It’s easy to use, but a bit of a hassle to configure and maintain. Elastic requires quite high threshold to get over to understand how the system works and how to configure it properly.

Elastic offers a 14-day free trial of the *Standard* plan without requiring credit card details. After which users can choose from 4 paid subscription plans. The *Standard* plan starts at *$95/month*, and it provides access to core security features and solutions including APM. The *Gold* plan adds custom plugins, while the *Platinum* plan offers advanced security features and machine leaning support. It also includes endpoint detection and response, protection,  and event collection capabilities. The *Enterprise* plan adds further some enterprise features such as searchable snapshots, Elastic Maps server and data retention for security related data, etc., and its cost raises to *$175/month*.

### **Prometheus**

![](/img/prometheus.png)

[Prometheus](https://prometheus.io/) is an open-source system monitoring and alerting toolkit and time series database originally developed by [SoundCloud](https://soundcloud.com/).

Key features:



* implement a multi-dimensional data model with time series being identified by metric name and a set of key-value pairs;
* provide a flexible query language _PromQL_ to leverage the dimensionality; 
* store time series in memory and on local disk in an efficient custom format with no dependency on distributed storage;
* record metrics in real time via a pull model over HTTP;
* allow slicing and dicing of collected time series data to generate ad-hoc graphs, tables, and alerts;
* support of pushing time series via an intermediary gateway;
* discover targets via service discovery or static configuration;
* support multiple modes for visualizing data using a built-in expression browser, _Grafana_ integration and a console template language;

Prometheus was joined [Cloud Native Computing Foundation (CNCF)](https://www.cncf.io) and became the second hosted project after Kubernetes. It has managed to obtain a large and vibrant community of contributors and users ever since. Prometheus is good and focuses mainly on application metric monitoring. In order to have a seamless experience with both metrics and traces that are required by APM, you can integrate Prometheus with other open source tracing tool, such as [Jaeger](https://www.jaegertracing.io/). However, since Jaeger lacks sophisticated capabilities for analyzing and segmenting all of user trace data, it has only some support for filtering certain data, experience of such integration may not be great.



Prometheus is considered simple to install and easy to use. However, it requires you already have skills in the open source world and know Apache. Prometheus is an open source tool with _46K_ GitHub stars and _7.7K_ Github forks. In [StackShare community](https://stackshare.io/prometheus), Prometheus has been mentioned in _852_ company stacks and _1962_ developer stacks. Since it is free, Prometheus certainly wins on pricing. However, full functionality of Prometheus demands skills in open source and competence in Apache based applications. Without those required skills and experience, the Prometheus interface can be difficult to master, and some others even find it difficult to set it up and scale.



Prometheus is maintained by volunteers, not by a company. It relies on other open source tools for security. Fixing security issues in Prometheus is done on a _best-effort_ basis. Prometheus strives to release security fixes within 7 days for its key components _alertmanager_, _node exporter_, _blackbox exporter_ and _pushgateway_, etc.


### **Apache SkyWalking**



![](/img/skywalking.png)



[Apache SkyWalking](https://skywalking.apache.org/) is an open source APM tool with capabilities for monitoring, tracing and diagnosing distributed system. It’s especially designed for microservices, cloud native and container-based architectures. 



Key features:



* provide metrics analysis of service, service instance and endpoint with distributed tracing, log collecting and metrics collecting and customization;
* support root cause analysis with profiling the code on the runtime by in-process agent , eBPF profiler and network profiler;
* provide dependency analysis of service instance and endpoint; 
* support service topology map analysis;
* detect slow services and endpoints and provide performance optimization;
* detect slow SQL statement for database performance monitoring;
* provide message queue performance and consuming latency monitoring;
* start tracing from browser for browser performance monitoring;
* support infrastructure monitoring for Kubernetes and Linux;
* support alerting using rules in both observability analysis language and metric analysis language;


Apache SkyWalking provides a list of agents to be used for building _Java_, _.NET core_, _PHP_, _Node.js_, _Golang_, _LUA_, _Rust_ and _C++_ apps. It supports to integrate and collect data from multiple sources, including Prometheus, OpenTelemetry and Zabbix for metrics and logs, Zipkin for traces. It provides tracing, metrics analysis, alerting, service mesh observability and visualization. Apache SkyWalking is an open source tool with _21K_ GitHub stars and _6K_ GitHub forks. In [StackShare community](https://stackshare.io/apache-skywalking#stacks.), Apache Skywalking does not yet have many approval, only being  mentioned in 12 developer stacks. However, Apache SkyWalking has more than _600_ contributors on GitHub and thousands of contributions every year. All the agents for application instrumentation have been actively maintained. 

 Apache SkyWalking is the first open source project that initialized and implemented an [Envoy Access Log Service (ALS)](https://www.envoyproxy.io/docs/envoy/v1.18.2/api-v2/service/accesslog/v2/als.proto) based solution to provide observability on the service mesh, no matter the architecture or language. Since service mesh provides full control of RPC, this observation solution is much easier to be added without language specific technology. With this solution, users could get the application service topology map, metrics graph, request details and error message with a very nice visualization. This integration solution can be extremely important for monitoring and visualizing application that consists of many microservices running across on-premises, cloud-based and hybrid environments. 



Apache SkyWalking is lightweight, scalable, and supports alerting and visualization. It can be easily set up as a _self-managed_ APM tool within an on-premises data center. This avoids leasing customer data to third party services and removes the restricted security restriction in user environment.   

## Conclusion

This blog post gave a closer look at some of the best APM tools, either open-source or commercial vendor based. It listed the key features of each APM tool, and discussed in details their strengths and weaknesses. The importance of a good APM solution is now indisputable. So all it takes is to pick the right one based on your monitoring needs for your applications.   



This blog post is the first of two in a series. In the second post, I will show you the detailed process how to set up the _Apache SkyWalking_, as the APM tool, in HPE GreenLake Private Cloud Enterprise  for monitoring and alerting both customer application and Kubernetes cluster. 



## Reference
 
* [HPE GreenLake for Private Cloud Enterprise](https://www.hpe.com/us/en/greenlake/private-cloud-enterprise.html) 
* [Splunk](https://www.splunk.com/) 
* [New Relic](https://newrelic.com/) 
* [Datadog](https://www.datadoghq.com/)
* [Dynatrace](https://www.dynatrace.com/)
* [Elastic](https://www.elastic.co/)
* [Prometheus] (https://prometheus.io/)
* [Apache SkyWalking](https://skywalking.apache.org/)
