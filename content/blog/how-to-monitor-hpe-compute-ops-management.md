---
title: How to monitor HPE Compute Ops Management infrastructure with Grafana
  Metrics Dashboards
date: 2022-10-19T13:04:56.553Z
author: Lionel Jullien
authorimage: /img/small-size-id.jpg
---
<style>ul li{ font-size:26px;}</style>

<style> i{ color:grey;font-family:'Courier New';font-size:22px; } </style>

The purpose of this blog post is to describe how to generate Grafana dashboards to monitor any HPE Compute infrastructure managed by HPE Compute Ops Management.

# Grafana Dashboards

IT infrastructure metrics visualization is critical for health monitoring, prediction, and capacity planning. It provides a powerful way of viewing infrastructure utilization, revealing issues and helping maintain uninterrupted services.

Grafana’s time-series graphs are the perfect enabler for IT infrastructure optimization. They can assist administrators in monitoring temperature changes, network traffic performance, power consumption, and much more. They can be used to compare data over time to note trends and detect issues, allowing administrators to make any necessary adjustments and prevent downtime.

The following picture shows a typical HPE infrastructure dashboard with different panels generated from HPE Compute Ops Management:

![](/img/2022-10-19-15_14_34-hpe-com-using-infinity-uql-native-api-calls-grafana-—-mozilla-firefox.png)

# HPE Compute Ops Management REST API

HPE Compute Ops Management provides a northbound RESTful [API ](https://developer.greenlake.hpe.com/docs/greenlake/services/compute-ops/public/openapi/compute-ops-latest/overview/)that supports many operations. All the data you can get from the HPE Compute Ops Management API can be leveraged to create beautiful and instructive Grafana dashboards and the simplest solution is to use a generic Grafana plugin that can handle REST requests, parse json responses and generate tables. With this solution, we greatly reduce the complexity of the solution which in principle requires a database like Prometheus or InfluxDB. In this post, we will see how to do without a database...

HPE Compute Ops Management REST API uses the OAuth 2.0 authentication based on the client credential, which generates a limited lifetime access token.

The access token is a long string in the form of a JSON Web Token that is signed using RS256 algorithm. The access token must be added into the HTTP header with keyword "Authorization: Bearer {token}" for any REST API request. 

For information about how to generate an access token for Compute Ops Management, please refer to [this link ](https://developer.greenlake.hpe.com/docs/greenlake/guides/public/authentication/authentication/)for more details.

Only a few resource metrics are currently supported by HPE Compute Ops Management via the RESTful API, but things will change quickly in the coming months. Today, the only metric available is the carbon footprint report but many other resources are available to create nice Grafana dashboards such as data related to the number of servers, health of servers, service packs, groups, etc. 

# Grafana Infinity plugin

There are several Grafana plugins that support data collection via the REST API (e.g. Infinity, [JSON](https://grafana.com/grafana/plugins/simpod-json-datasource/), [JSON API](https://grafana.com/grafana/plugins/marcusolsson-json-datasource/)) but [Infinity ](https://grafana.com/grafana/plugins/yesoreyeram-infinity-datasource/)has the great advantage of offering an advanced query language that is essential for manipulating JSON data into a suitable format that Grafana can understand. This language is called [UQL](https://sriramajeyam.com/grafana-infinity-datasource/wiki/uql/), Infinity's unstructured query language.

UQL is not simple at first glance but I will provide examples in this blog. With UQL, you can customize the results you need regardless of the json format returned by the API.

A UQL query can be formed with a list of commands joined by |. Most of the time, fields are referenced in double quotes and string values are referenced in single quotes as shown below:

![](/img/2022-10-19-16_33_28-hpe-software-‎-onenote-for-windows-10.png)

The following diagram describes the different components of the solution:

![](/img/2022-10-19-16_15_11-lj-synergy-composable-fabric.pptx-powerpoint.png)

## Pros and Cons about this solution

Pros:

* Lightweight solution as it only requires Grafana and an easily installable plugin
* Supports collecting metrics from any API
* Cross-platform support, all components can be installed on Microsoft Windows or Linux.

Cons:

* Cannot create a time series Grafana visualization with non-time series data you may retrieve from an API. This would require the use of a database like Prometheus or InfluxDB
* Requires in-depth knowledge of the UQL language, API, authentication, and methods.

# Configuration

## Prerequisites

* Grafana must be installed, started, and enabled
* HPE Compute Ops Management API client credentials are required

## Infinity plugin installation

From an SSH session on the Grafana server, enter:\

> <i>grafana-cli plugins install yesoreyeram-infinity-datasource</i>\
> Then restart the Grafana service:\
> <i>service grafana-server restart</i>\
> For more details on how to install the Infinity plugin, you can refer to this [article](< https://github.com/yesoreyeram/grafana-infinity-datasource>).

## Grafana configuration

To launch the Grafana User Interface, open a web browser and navigate to **http://<grafana_IP or DNS name>:3000/**

Note: The default HTTP port that Grafana listens to is 3000 unless you have configured a different port. 

Click on the gear icon on the side menu and click **Data Sources**.

![](/img/lj-grafana-com-picture1.png)

Search for Infinity from the data source list. 

![](/img/lj-grafana-com-picture2.png)

Add **Infinity** as a new data source and name it **Infinity-COM**.

![](/img/2022-10-19-17_05_15-infinity-com_-settings-grafana-—-mozilla-firefox.png)

Leave all other settings as default and click **Save & test**.

Then to create a new Dashboard, click on the Dashboards icon on the side menu and select **New dashboard**.

![](/img/lj-grafana-com-picture3.png)

The next step is to create Grafana variables related to this dashboard. These will be used to simplify the API authentication process and the REST requests you will define later.

Click on **Dashboard settings**:

![](/img/lj-grafana-com-picture4.png)

Then select **Variables** then **Add variables**:

![](/img/lj-grafana-com-picture5.png)

Three variables are required:

1. A variable for the endpoint URL for your HPE Compute Ops Management API:

   Endpoints are the host URLs that you will submit your API requests to. HPE Compute Ops Management has unique endpoints in specific regions. Which region is used depends on which region the devices were onboarded into via the HPE GreenLake Cloud Platform.

   Use the following list to identify your application endpoint:

   * US West: https://us-west2-api.compute.cloud.hpe.com/
   * EU Central: https://eu-central1-api.compute.cloud.hpe.com/
   * AP NorthEast: https://ap-northeast1-api.compute.cloud.hpe.com/

   Create a new variable using the following parameters:

   * Name: **url**  
   * Type: **Custom**  
   * Value: *endpoint URL*

![](/img/2022-10-19-17_41_55-hpe-com-using-infinity-uql-native-api-calls-grafana-—-mozilla-firefox.png)

2. A variable to generate the access token for the API authentication:

   HPE Compute Ops Management REST API uses the OAuth 2.0 authentication based on the client credential, which generates a limited lifetime access token. So the variable must be created using:

   * Name: **session**
   * Data source: **Infinity-COM**
   * Query Type: **Infinity**
   * URL: **https://sso.common.cloud.hpe.com/as/token.oauth2**

   Click then on **HTTP method, Query param, Headers** and use the following parameters:

   * Method: **POST** 
   * Body: **grant_type=client_credentials&client_id=**<your-client-ID>**&client_secret=**<your-client-secret>

   And add in the headers tab: 

   * Header Name: **Content-type**
   * Header Value: **application/x-www-form-urlencoded**

![](/img/2022-10-19-17_52_33-hpe-com-using-infinity-uql-native-api-calls-grafana-—-mozilla-firefox.png)

![](/img/2022-10-19-18_07_06-hpe-com-using-infinity-uql-native-api-calls-grafana-—-mozilla-firefox.png)

![](/img/lj-grafana-com-picture6.png)

\    Once completed, the preview of values section at the bottom should show the access token generated by the HPE Compute Ops Management API:

![](/img/lj-grafana-com-picture7.png)

3. A variable for the carbon footprint report ID   

   I use a variable for the carbon footprint report ID, because each time a new report is generated, a new ID is created. So by using a variable, I can fetch the last report ID and be sure that all my CO2 report API requests will be successful.
   For this variable, use the following parameters:

   * Name: **reportID**
   * Data source: **Infinity-COM**
   * Query Type: **Infinity**
   * URL: **${url}/compute-ops/v1beta1/reports**
   * Column 1: **reportDataUri**
   * Method: **GET**
   * Header Name: **Authorization**
   * Header Value: **Bearer ${session}**

   Note: `${variablename}` is the general syntax for calling a variable in Grafana. So `${url}` used in the URL field calls the *url* variable you defined earlier. Same for `${session}`, it calls the access token generated by the API.

![](/img/2022-10-19-18_33_40-hpe-com-using-infinity-uql-native-api-calls-grafana-—-mozilla-firefox.png)

![](/img/2022-10-19-18_35_09-hpe-com-using-infinity-uql-native-api-calls-grafana-—-mozilla-firefox.png)

![](/img/2022-10-19-18_34_48-hpe-com-using-infinity-uql-native-api-calls-grafana-—-mozilla-firefox.png)

 Once completed, the preview of values section at the bottom should show the URI of the carbon footprint report:

![](/img/2022-10-19-19_02_23-hpe-com-using-infinity-uql-native-api-calls-grafana-—-mozilla-firefox.png)

This concludes this blog post. I hope you find it useful and should you have any feedback, please send me a [message](mailto:lio@hpe.com).