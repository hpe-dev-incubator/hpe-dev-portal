---
title: HPE Onesphere-Introduction to Insights (Cost Analytics)
date: 2018-02-01T04:07:47.809Z
author: gowri.m@hpe.com 
tags: ["HPE-OneSphere","cost-analytics","insights"]
path: hpe-onesphere-introduction-to-insights-cost-analytics
---
# HPE OneSphere-Introduction to Insights## Introduction

#### HPE OneSphere is a multi-cloud management platform delivered as a managed service. It provides a unified experience across Hybrid clouds (public & private) and software-defined infrastructure all through a single management console.

#### HPE OneSphere Insights is a key component of HPE OneSphere and displays cost information about workload deployments on both public and private clouds. For the first release, HPE OneSphere Insights supports AWS (Amazon Web Services) public cloud and VMware based private cloud cost analytics. 

#### This blog details the interpretation of the various costs that are currently shown within HPE OneSphere Insights and also looks at some of the metric APIs that we are using to report these costs

# Insight on 'Insights'

![cc_donut_chart](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/2/cc_donut_chart-1519133152656.png)

**A.**  HPE Private cloud fixed costs for the current month.  
**B.**  AWS total costs for the current month.  
**C.** Total cost of AWS and HPE Private cloud fixed costs for the current month.  
**D.** Previous month total cost of AWS and HPE Private cloud fixed costs.  
**E.** The region where HPE Private cloud is deployed.  
**F.** The region where AWS is deployed.  

![ca_2_updated](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/2/ca_2_updated-1518419668635.png)

**A.**Total costs of all AWS accounts(payer and member), both enabled and disabled.  
**B.** HPE Private cloud zone fixed costs for the current month.  
**C.** Costs for managed AWS enabled accounts.  
**D.** Costs for deployments in Private cloud.  
**E.** Weighted score of deployed VMs in AWS managed accounts based on CPU Utilization.  
**F.** Weighted score of deployed VMs in HPE Private cloud zones based on CPU and memory utilization.  

![ca_3_updated](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/2/ca_3_updated-1518419689391.png)

**A.** Costs of AWS managed disabled accounts.  
**B.** Difference between total private fixed costs and managed costs.  
**C.** Managed costs of all zones enabled in the Private cloud.  
**D.** Cumulative costs of managed deployments (not onboarded member account) and unused private cloud capacity costs.  
**E.** Costs of Private cloud deployments done outside of HPE OneSphere.  
**F.** Deployment costs of onboarded AWS account linked to the project.  
**G.** Costs based on deployments in projects where 'incubation' LOB is associated.  
**H.** Costs based on deployments in projects where 'development' environment is associated.  
**I.** Costs based on deployments in projects where 'gold' tier is associated.  
**J.** Deployment costs for AWS instances takes 24 hours to show it in Insights. This is due to AWS generates the billing once in 24 hours.  



![ca_4_updated](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/2/ca_4_updated-1518419707068.png)

**A.** Drill down of any project shows the AWS and Private cloud services costs.# Metrics APIs to fetch the costs:

For all the below rest calls, we have taken the example to show the costs for the February month by giving the `periodStart` as 2018-02-01 and `periodCount` as 1.  

a) To get the usage costs of all the deployments based on the providers category:
```
/rest/metrics?name=cost.usage&period=month&periodStart=2018-02-01T00:00:00Z&periodCount=1&category=providers&view=full
```


![cost1](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/2/cost1-1519120309105.png)

b) To get the usage costs of all the deployments based on the projects category:
```
/rest/metrics?name=cost.usage&period=month&periodStart=2018-02-01T00%3A00%3A00Z&periodCount=1&category=projects&view=full
```


![cost2](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/2/cost2-1519120593778.png)

c) To get the usage costs of all deployments based on the projects which is associated to 'Tier' tag key:
```
/rest/metrics?name=cost.usage&period=month&periodStart=2018-02-01T00%3A00%3A00Z&periodCount=1&category=projects&groupBy=tagKeyUri&query=tagKeyUri+EQ+%2Frest%2Ftag-keys%2Ftier&view=full
```


![cost3](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/2/cost3-1519120610491.png)

d) To get the total cost of all providers grouped by provider-type:
```
/rest/metrics?name=cost.total&period=month&periodStart=2018-03-01T00%3A00%3A00Z&periodCount=-2&category=providers&groupBy=providerTypeUri&view=full
```


![cost4](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/2/cost4-1519120969465.png)

e) To get the managed utilization and the consolidated usage costs of all providers grouped by the provider-type:
```
/rest/metrics?name=cost.total&name=cost.efficiency&name=cost.usage&period=month&periodStart=2018-02-01T00%3A00%3A00Z&periodCount=1&category=providers&groupBy=providerTypeUri&view=full
```


![cost5](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/2/cost5-1519121259583.png)

f) To get the usage costs of all deployments based on the projects which is associated to 'environment' tag key:
```
/rest/metrics?name=cost.usage&period=month&periodStart=2018-02-01T00%3A00%3A00Z&periodCount=1&category=projects&groupBy=tagKeyUri&query=tagKeyUri+EQ+%2Frest%2Ftag-keys%2Fenvironment&view=full
```


![cost6](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/2/cost6-1519121506385.png)

g) To get the usage costs of all deployments based on the projects which is associated to 'line of business' tag key:
```
/rest/metrics?name=cost.usage&period=month&periodStart=2018-02-01T00%3A00%3A00Z&periodCount=1&category=projects&groupBy=tagKeyUri&query=tagKeyUri+EQ+%2Frest%2Ftag-keys%2Fline-of-business&view=full
```


![cost7](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/2/cost7-1519121672169.png)

