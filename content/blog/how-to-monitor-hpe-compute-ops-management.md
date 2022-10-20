---
title: How to monitor HPE Compute Ops Management infrastructure with Grafana
  Metrics Dashboards
date: 2022-10-19T18:21:24.504Z
author: Lionel Jullien
authorimage: /img/small-size-id.jpg
---
![]()

<style>ul li{ font-size:26px;}</style>

<style> i{ color:grey;font-family:'Courier New';font-size:22px; } </style>

The purpose of this blog post is to describe how to generate Grafana dashboards to monitor any HPE Compute infrastructure managed by HPE Compute Ops Management.

# Grafana Dashboards

IT infrastructure metrics visualization is critical for health monitoring, prediction, and capacity planning. It provides a powerful way of viewing infrastructure utilization, revealing issues and helping maintain uninterrupted services.

Grafana’s time-series graphs are the perfect enabler for IT infrastructure optimization. They can assist administrators in monitoring temperature changes, network traffic performance, power consumption, and much more. They can be used to compare data over time to note trends and detect issues, allowing administrators to make any necessary adjustments and prevent downtime.

The following picture shows a typical HPE infrastructure dashboard with different panels generated from HPE Compute Ops Management:

![](/img/2022-10-19-15_14_34-hpe-com-using-infinity-uql-native-api-calls-grafana-—-mozilla-firefox.png)

# HPE Compute Ops Management REST API

HPE Compute Ops Management provides a northbound RESTful [API ](https://developer.greenlake.hpe.com/docs/greenlake/services/compute-ops/public/openapi/compute-ops-latest/overview/)that supports many operations. All the data you can get from the HPE Compute Ops Management API can be leveraged to create beautiful and instructive Grafana dashboards. 

To take advantage of this, simply use a generic Grafana plugin that can handle REST requests, parse json responses and generate tables. With this solution, we greatly reduce the complexity of the solution which in principle requires a database like Prometheus or InfluxDB. In this post, I will show you how to do it without a database...

HPE Compute Ops Management REST API uses the OAuth 2.0 authentication based on the client credential, which generates a limited lifetime access token.

The access token is a long string in the form of a JSON Web Token that is signed using RS256 algorithm. The access token must be added into the HTTP header with keyword "Authorization: Bearer {token}" for any REST API request. 

For information about how to create API client credentials and how to generate an access token for HPE Compute Ops Management, refer to [this article](https://developer.greenlake.hpe.com/docs/greenlake/guides/public/authentication/authentication/).

Only a few resource metrics are currently supported by HPE Compute Ops Management via the RESTful API, but things will change quickly in the coming months. Today, the only metric available is the carbon footprint report but many other resources are available to create nice Grafana dashboards such as data related to the number of servers, health of servers, service packs, groups, etc. 

# Grafana Infinity plugin

There are several Grafana plugins that support data collection via the REST API (e.g. Infinity, [JSON](https://grafana.com/grafana/plugins/simpod-json-datasource/), [JSON API](https://grafana.com/grafana/plugins/marcusolsson-json-datasource/)) but [Infinity ](https://grafana.com/grafana/plugins/yesoreyeram-infinity-datasource/)has the great advantage of offering an advanced query language that is essential for manipulating JSON data into a suitable format that Grafana can understand. This language is called [UQL](https://sriramajeyam.com/grafana-infinity-datasource/wiki/uql/), Infinity's unstructured query language.

UQL is not simple at first glance, but I will provide examples in this blog. With UQL, you can customize the results you need regardless of the json format returned by the API.

A UQL query can be formed with a list of commands joined by "|". Most of the time, fields are referenced in double quotes and string values are referenced in single quotes as shown below:

![](/img/2022-10-19-16_33_28-hpe-software-‎-onenote-for-windows-10.png)

The following diagram describes the different components of the solution:

![](/img/2022-10-19-16_15_11-lj-synergy-composable-fabric.pptx-powerpoint.png)

## Pros and Cons about this solution

As with any solution, there are both Pros and Cons to using it.

Pros:

* A lightweight solution that only requires Grafana and an easily installable plugin
* Supports collecting metrics from any API
* Cross-platform support, all components can be installed on Microsoft Windows or Linux

Cons:

* Cannot create a time series Grafana visualization with non-time series data you may retrieve from an API (This would require the use of a database, like Prometheus or InfluxDB)
* Requires in-depth knowledge of the UQL language, API, authentication, and methods

# Configuration

## Prerequisites

* Grafana must be installed, started, and enabled
* HPE Compute Ops Management API client credentials are required (this consists of a *client ID* and a *client secret*)

## Infinity plugin installation

From an SSH session on the Grafana server, enter:

\> <i>grafana-cli plugins install yesoreyeram-infinity-datasource</i>

Then restart the Grafana service:

\> <i>service grafana-server restart</i>

For more details on how to install the Infinity plugin, you can check out the [Infinty GitHub repository](https://github.com/yesoreyeram/grafana-infinity-datasource).

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

1. A variable for the HPE Compute Ops Management API endpoint URL:

   Endpoints are the host URLs that you will submit your API requests to. HPE Compute Ops Management has unique endpoints in specific regions. Which region is used depends on which region the devices were onboarded into via the HPE GreenLake Cloud Platform.

   Use the following list to identify your application endpoint:

   * US West: https://us-west2-api.compute.cloud.hpe.com/
   * EU Central: https://eu-central1-api.compute.cloud.hpe.com/
   * AP NorthEast: https://ap-northeast1-api.compute.cloud.hpe.com/

   Create a new variable using the following parameters:

   * Name: **url** 


   * Type: **Custom**
   * Value: *endpoint URL*

       <img
     src="/img/2022-10-19-17_41_55-hpe-com-using-infinity-uql-native-api-calls-grafana-—-mozilla-firefox.png"
       />
2. A variable to generate the access token for the API authentication:

   HPE Compute Ops Management REST API uses the OAuth 2.0 authentication based on the client credential, which generates a limited lifetime access token. So the variable must be created using:

   * Name: **session**   


   * Data source: **Infinity-COM**   


   * Query Type: **Infinity**   


   * URL: **https://sso.common.cloud.hpe.com/as/token.oauth2**

       <img
     src="/img/2022-10-19-17_52_33-hpe-com-using-infinity-uql-native-api-calls-grafana-—-mozilla-firefox.png"
       />

   Click then on **HTTP method, Query param, Headers** and use the following parameters:

   * Method: **POST**
   * Body: **grant\_type=client\_credentials&client_id=**<your-client-ID>**&client_secret=**<your-client-secret>



     *\<your-client-ID>* and *\<your-client-secret>* are the HPE Compute Ops Management API client credentials generated from the HPE GreenLake Cloud Platform (GLCP) services.



       <img
     src="/img/2022-10-19-18_07_06-hpe-com-using-infinity-uql-native-api-calls-grafana-—-mozilla-firefox.png"
       />



   And add in the Headers tab: 

   * Header Name: **Content-type** 
   * Header Value: **application/x-www-form-urlencoded**

       <img
     src="/img/lj-grafana-com-picture6.png"
       />

    When everything is properly configured, the access token generated by the HPE Compute Ops Management API should be displayed in the *Preview of values* section at the bottom of the page:

    <img
    src="/img/lj-grafana-com-picture7.png"
    />
3. A variable for the carbon footprint report ID   

   I use a variable for the carbon footprint report ID, because each time a new report is generated, a new ID is created. So by using a variable, I can fetch the last report ID and be sure that all my CO2 report API requests will be successful.
   For this variable, use the following parameters:

   * Name: **reportID**   


   * Data source: **Infinity-COM**   


   * Query Type: **Infinity**   


   * URL: **${url}/compute-ops/v1beta1/reports**   


   * Column 1: **reportDataUri**

      <img
      src="/img/2022-10-19-18_33_40-hpe-com-using-infinity-uql-native-api-calls-grafana-—-mozilla-firefox.png"
      />
   * Method: **GET**

      <img
      src="/img/2022-10-19-18_35_09-hpe-com-using-infinity-uql-native-api-calls-grafana-—-mozilla-firefox.png"
      />

   Note: `${variablename}` is the general syntax for calling a variable in Grafana. So `${url}` used in the URL field calls the *url* variable you defined earlier. Same for `${session}`, it calls the access token generated by the API.

   * Header Name: **Authorization**  
   * Header Value: **Bearer ${session}**

       <img
     src="/img/2022-10-19-18_34_48-hpe-com-using-infinity-uql-native-api-calls-grafana-—-mozilla-firefox.png"
       />

   Once completed, the URI of the carbon footprint report should be displayed in the *Preview of values* section :

      <img
    src="/img/2022-10-19-19_02_23-hpe-com-using-infinity-uql-native-api-calls-grafana-—-mozilla-firefox.png"
      />

The variables and parameters of the dashboard are now complete. The warning on the `reportID` variable below is expected because this variable is not yet used by any panel. This will be corrected once `reportID` is used in a query.

![](/img/2022-10-19-19_17_15-hpe-com-using-infinity-uql-native-api-calls-grafana-—-mozilla-firefox.png)

Click on **Save dashboard** and give it an appropriate name.

## Creating Grafana panels

The last step of the configuration is to create panels for this new dashboard.

To create a first panel, click on the **Add panel** icon in the upper menu bar and click **Add a new panel**.

![](/img/2022-10-19-19_41_45-hpe-com-using-infinity-uql-native-api-calls-grafana-—-mozilla-firefox.png)

The following sections describe the settings needed for different types of resources and reports you can generate in Grafana. Each section will list the type of resource available, the API calls and their properties and the UQL queries to use.

### Carbon footprint Report (all servers)

Analyzing carbon emissions can help you understand the impact of your servers on the environment. Use the carbon footprint report to view the estimated carbon emissions generated by powering all the servers in a Compute Ops Management application region. The report displays the following information for the past seven days:

* Estimated total carbon emissions for all servers
* Estimated daily carbon emissions for all servers
* Estimated total carbon emissions for each server

The report does not include estimates of the embedded carbon footprint from manufacturing and distribution of the servers.

#### Panel overview

![](/img/2022-10-19-20_06_34-hpe-com-using-infinity-uql-native-api-calls-grafana-—-mozilla-firefox.png)

#### API request:

`get /compute-ops/v1beta1/reports/{id}/data`

#### API response:

```{
  "id": "843023bd-9412-46c2-8ac2-a3691f657fdb",
  "type": "compute-ops/report-data",
  "name": "Carbon Footprint Report (All Servers)",
  "request": {
    "reportDataStartAt": "2022-02-04T01:04:20+00:00",
    "reportDataEndAt": "2022-02-11T01:04:20+00:00",
    "reportType": "CARBON_FOOTPRINT"
  },
  "series": [
    {
      "name": "Carbon Emissions",
      "type": "CO2_EMISSIONS",
      "units": "kgCO2e",
      "unitsDisplayName": "kilograms of carbon dioxide equivalent",
      "subject": {
        "displayName": "1M512501AB",
        "id": "875765-S01+1M512501AB",
        "type": "SERVER"
      },
      "summary": {
        "avg": 6.4,
        "sum": 6.4
      },
      "bucketDurationInSec": 86961.3,
      "expectedSamplesPerBucket": 289.9,
      "buckets": [
        {
          "timestamp": "2019-08-24T14:15:22Z",
          "value": 6.4,
          "numSamples": 233,
          "noValueReason": null,
          "extrapolated": 8
        }
      ]
    }
  ]
}
```

#### Panel configuration:

* Data source: **Infinity-COM**  


* Type: **UQL**   


* Format: **Time Series** 


* URL: **${url}${reportID}**  


* Method: **GET**   


* Header: Name = **Authorization /** Value = **Bearer ${session}**  


* UQL:

  **parse-json**

     \
  **\| jsonata  "series\[subject.type = 'TOTAL']"**

   **\| scope "buckets"**

  \
  **\| project "timestamp"=todatetime("timestamp"), "Carbon Emissions (kgCO2e)"="value"**

  <img
    src="/img/2022-10-19-20_07_50-hpe-com-using-infinity-uql-native-api-calls-grafana-—-mozilla-firefox.png"
  />

   Note: JSONata is an open source expression language that is used for querying and transforming JSON data. You can refer to the following [JSONata Cheatsheet](https://www.stedi.com/docs/mappings/jsonata-cheatsheet) for tons of examples on how to manipulate json data.

### Carbon footprint Report (each server)

This report displays the estimated total carbon emissions for each server.

#### Panel overview

![](/img/2022-10-19-20_25_24-hpe-com-using-infinity-uql-native-api-calls-grafana-—-mozilla-firefox.png)

#### API request:

`get /compute-ops/v1beta1/reports/{id}/data`

#### API response:

```{
  "id": "843023bd-9412-46c2-8ac2-a3691f657fdb",
  "type": "compute-ops/report-data",
  "name": "Carbon Footprint Report (All Servers)",
  "request": {
    "reportDataStartAt": "2022-02-04T01:04:20+00:00",
    "reportDataEndAt": "2022-02-11T01:04:20+00:00",
    "reportType": "CARBON_FOOTPRINT"
  },
  "series": [
    {
      "name": "Carbon Emissions",
      "type": "CO2_EMISSIONS",
      "units": "kgCO2e",
      "unitsDisplayName": "kilograms of carbon dioxide equivalent",
      "subject": {
        "displayName": "1M512501AB",
        "id": "875765-S01+1M512501AB",
        "type": "SERVER"
      },
      "summary": {
        "avg": 6.4,
        "sum": 6.4
      },
      "bucketDurationInSec": 86961.3,
      "expectedSamplesPerBucket": 289.9,
      "buckets": [
        {
          "timestamp": "2019-08-24T14:15:22Z",
          "value": 6.4,
          "numSamples": 233,
          "noValueReason": null,
          "extrapolated": 8
        }
      ]
    }
  ]
}
```

#### Panel configuration:

* Data source: **Infinity-COM**

     
* Type: **UQL**   


* Format: **Table**   


* URL: **${url}${reportID}**   


* Method: **GET**   


* Header: Name = **Authorization /** Value = **Bearer ${session}**   


* UQL:

  **parse-json**

  \
  **\| scope "series"**

  \
  **\| project "Servers"="subject.displayName", "Carbon Emissions"="summary.sum"**


* Override: Fields with name = **Carbon Emissions** / Cell display Mode = **LCD Gauge**


* Vizualization: **Table**

  * Unit: **kgCO2e** 
  * Color scheme: **Green-Yellow-Red (by value)**



  <img
    src="/img/2022-10-19-20_26_28-hpe-com-using-infinity-uql-native-api-calls-grafana-—-mozilla-firefox.png"
  />

This concludes this blog post. I hope you find it useful and should you have any feedback, please send me a [message](mailto:lio@hpe.com).