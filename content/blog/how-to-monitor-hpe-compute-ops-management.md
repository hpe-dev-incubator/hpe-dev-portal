---
title: How to monitor HPE GreenLake for Compute Ops Management infrastructure
  with Grafana Metrics Dashboards
date: 2022-10-19T18:21:24.504Z
author: Lionel Jullien
authorimage: /img/small-size-id.jpg
tags:
  - hpe-greenlake-for-compute-ops-management
  - grafana
  - hpe-greenlake
  - monitoring
  - api
  - COM
---
<style>ul li{ font-size:26px;padding-bottom: 0.5em;}</style>
<style> i{ color:grey;font-family:'Courier New';font-size:22px; } </style>

The purpose of this blog post is to describe how to generate Grafana dashboards to monitor any HPE Compute infrastructure managed by HPE GreenLake for Compute Ops Management.

# Grafana Dashboards

IT infrastructure metrics visualization is critical for health monitoring, prediction, and capacity planning. It provides a powerful way of viewing infrastructure utilization, revealing issues and helping maintain uninterrupted services.

Grafana’s time-series graphs are the perfect enabler for IT infrastructure optimization. They can assist administrators in monitoring temperature changes, network traffic performance, power consumption, and much more. They can be used to compare data over time to note trends and detect issues, allowing administrators to make any necessary adjustments and prevent downtime.

The following picture shows a typical HPE infrastructure dashboard with different panels generated from HPE Compute Ops Management:

![](/img/2022-10-21-11_14_38-hpe-com-using-infinity-uql-native-api-calls-grafana-—-mozilla-firefox.png)

# HPE GreenLake for Compute Ops Management REST API

HPE GreenLake for Compute Ops Management provides a northbound RESTful [API ](https://developer.greenlake.hpe.com/docs/greenlake/services/compute-ops/public/openapi/compute-ops-latest/overview/)that supports many operations. All the data you can get from the HPE Compute Ops Management API can be leveraged to create beautiful and instructive Grafana dashboards. 

To take advantage of this, simply use a generic Grafana plugin that can handle REST requests, parse JSON responses and generate tables. With this solution, we greatly reduce the complexity of the solution which in principle requires a database like Prometheus or InfluxDB. In this post, I will show you how to do it without a database...

HPE GreenLake for Compute Ops Management REST API uses the OAuth 2.0 authentication based on the client credential, which generates a limited lifetime access token.

The access token is a long string in the form of a JSON Web Token that is signed using RS256 algorithm. The access token must be added into the HTTP header with keyword "Authorization: Bearer {token}" for any REST API request. 

For information about how to create API client credentials and how to generate an access token for HPE Compute Ops Management, refer to [this web page](https://developer.greenlake.hpe.com/docs/greenlake/guides/public/authentication/authentication/).

Only a few resource metrics are currently supported by HPE Compute Ops Management via the RESTful API, but things will change quickly in the coming months. Today, the only metric available is the carbon footprint report but many other resources are available to create nice Grafana dashboards such as data related to the number of servers, health of servers, service packs, groups, etc. 

# Grafana Infinity plugin

There are several Grafana plugins that support data collection via the REST API (e.g. Infinity, [JSON](https://grafana.com/grafana/plugins/simpod-json-datasource/), [JSON API](https://grafana.com/grafana/plugins/marcusolsson-json-datasource/)) but [Infinity ](https://grafana.com/grafana/plugins/yesoreyeram-infinity-datasource/)has the great advantage of offering an advanced query language that is essential for manipulating JSON data into a suitable format that Grafana can understand. This language is called [UQL](https://sriramajeyam.com/grafana-infinity-datasource/wiki/uql/), Infinity's unstructured query language.

UQL is not simple at first glance, but I will provide examples in this blog. With UQL, you can customize the results you need regardless of the JSON format returned by the API.

A UQL query can be formed with a list of commands joined by ` | `. Most of the time, fields are referenced in double quotes and string values are referenced in single quotes as shown below:

![](/img/2022-10-21-11_47_58-hpe-software-‎-onenote-for-windows-10.png)

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
* Requires in-depth knowledge of the API, authentication, and methods
* Requires knowledge of the UQL language to manipulate JSON data

# Configuration

## Prerequisites

* Grafana must be installed, started, and enabled
* HPE Compute Ops Management API client credentials are required (this consists of a *client ID* and a *client secret*)

## Infinity plugin installation

From an SSH session on the Grafana server, enter:   
\> <i>grafana-cli plugins install yesoreyeram-infinity-datasource</i>

Then restart the Grafana service:   
\> <i>service grafana-server restart</i>

For more details on how to install the Infinity plugin, you can check out the [Infinity GitHub repository](https://github.com/yesoreyeram/grafana-infinity-datasource).

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

The next steps consist in creating variables and panels for this dashboard. I will describe in this blog each step with a lot of details to give you an overview of the methods I use.

> **Important note**: You have the option to import the dashboard directly from my [GitHub repository](https://github.com/jullienl/HPE-Compute-Ops-Management/tree/main/Grafana) using the JSON file provided, which contains everything you need (layout, variables, styles, data sources, queries, etc.). Once imported in Grafana, the same dashboard that is described in detail below with its different panels will be immediately available, it includes carbon emissions reports, server information and health, firmware bundles, groups information, etc. Refer to the README.md for more details.

Going back to the manual configuration, the next step is to create Grafana variables for this new dashboard. These will be used to simplify the API authentication process and the REST requests you will define later.

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
   * Value: *\<Your endpoint URL>*

   <img
     src="/img/2022-10-19-17_41_55-hpe-com-using-infinity-uql-native-api-calls-grafana-—-mozilla-firefox.png"
       />
2. A variable to generate the access token for the API authentication:

   HPE Compute Ops Management REST API uses the OAuth 2.0 authentication based on the client credential, which generates a limited lifetime access token. So, the variable must be created using:

   * Name: **session**
   * Data source: **Infinity-COM**
   * Query Type: **Infinity**
   * URL: **https://sso.common.cloud.hpe.com/as/token.oauth2**

   <img
     src="/img/2022-10-19-17_52_33-hpe-com-using-infinity-uql-native-api-calls-grafana-—-mozilla-firefox.png"
       />

   Click then on **HTTP method, Query param, Headers** and use the following parameters:

   * Method: **POST**
   * Body: **grant\_type=client\_credentials&client_id=**\<your-client-ID>**&client_secret=**\<your-client-secret>

   Note: *\<your-client-ID>* and *\<your-client-secret>* are the HPE Compute Ops Management API client credentials generated from the HPE GreenLake Cloud Platform (GLCP).

      <img src="/img/2022-10-19-18_07_06-hpe-com-using-infinity-uql-native-api-calls-grafana-—-mozilla-firefox.png"   />

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
3. A variable for the carbon footprint report ID:   

   I use a variable for the carbon footprint report ID, because each time a new report is generated, a new `id` is created. So, by using a variable, I can fetch the last report `id` and be sure that all my CO2 report API requests will be successful.

   For this variable, use the following parameters:

   * Name: **reportID**
   * Data source: **Infinity-COM**
   * Query Type: **Infinity**
   * URL: **${url}/compute-ops/v1beta1/reports**
   * Column 1: **reportDataUri**

   <img
   src="/img/2022-10-19-18_33_40-hpe-com-using-infinity-uql-native-api-calls-grafana-—-mozilla-firefox.png"
   />

   Note: `${variablename}` is the general syntax for calling a variable in Grafana. So `${url}` used in the URL field calls the *url* variable you defined earlier. Same for `${session}` below in the header value, it calls the access token generated by the API.

   * Method: **GET**

   <img
   src="/img/2022-10-19-18_35_09-hpe-com-using-infinity-uql-native-api-calls-grafana-—-mozilla-firefox.png"
   />
   * Header Name: **Authorization**
   * Header Value: **Bearer ${session}**

   <img
  src="/img/2022-10-19-18_34_48-hpe-com-using-infinity-uql-native-api-calls-grafana-—-mozilla-firefox.png"
    />

   Once completed, the URI of the carbon footprint report should be displayed in the *Preview of values* section:

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

The following sections describe different panels you can generate in Grafana with HPE Compute Ops Management. They are provided as examples and the parameters can of course be modified to suit your needs. Each section lists the required parameters, provides API information, and methods and includes the UQL queries (if needed) to transform the JSON data.

### Carbon footprint report (all servers)

Analyzing carbon emissions can help you understand the impact of your servers on the environment. Use the carbon footprint report to view the estimated carbon emissions generated by powering all the servers in a Compute Ops Management application region. The report displays the following information for the past seven days:

* Estimated total carbon emissions for all servers
* Estimated daily carbon emissions for all servers
* Estimated total carbon emissions for each server

The report does not include estimates of the embedded carbon footprint from manufacturing and distribution of the servers.

#### Panel overview

![](/img/2022-10-19-20_06_34-hpe-com-using-infinity-uql-native-api-calls-grafana-—-mozilla-firefox.png)

#### API request

`get /compute-ops/v1beta1/reports/{id}/data`

#### API response

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

#### Panel configuration

* Data source: **Infinity-COM**<br />  
* Type: **UQL**   <br />
* Format: **Time Series** <br />
* URL: **${url}${reportID}** <br /> 
* Method: **GET**   <br />
* Header name: **Authorization** 
* Header value = **Bearer ${session}**
* UQL:   
  **parse-json**   
  **\| jsonata  "series\[subject.type = 'TOTAL']"**   
  **\| scope "buckets"**   
  **\| project "Timestamp"=todatetime("timestamp"), "Carbon Emissions (kgCO2e)"="value"**

   Description of the UQL commands:  
   * **parse-json**:  command to instruct UQL to parse the response as JSON   
   * **jsonata**: command to select the object representing the carbon emission report for all servers available in the `series` array   
   * **scope**: command to set `buckets` as the output data   
   * **project**: command to create a table with two columns (Timestamp and Carbon Emissions (kgCO2e))

  Note: JSONata is an open-source expression language that is used for querying and transforming JSON data. You can refer to the following [JSONata Cheatsheet](https://www.stedi.com/docs/mappings/jsonata-cheatsheet) for tons of examples on how to manipulate JSON data.
* Visualization: **Time Series**
  * Unit: **Number**

![](/img/2022-10-19-20_07_50-hpe-com-using-infinity-uql-native-api-calls-grafana-—-mozilla-firefox.png)

### Carbon footprint report (each server)

This report displays the estimated total carbon emissions for each server.

#### Panel overview

![](/img/2022-10-21-11_23_31-hpe-com-using-infinity-uql-native-api-calls-grafana-—-mozilla-firefox.png)

#### API request

`get /compute-ops/v1beta1/reports/{id}/data`

#### API response

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

#### Panel configuration

* Data source: **Infinity-COM**<br />
* Type: **UQL**   <br />
* Format: **Table**   <br />
* URL: **${url}${reportID}** <br />  
* Method: **GET**   <br />
* Header name: **Authorization** 
* Header value = **Bearer ${session}**
* UQL:   
  **parse-json**   
  **\| scope "series"**   
  **\| project "Servers"="subject.displayName", "Carbon Emissions"="summary.sum"**   
   

   Description of the UQL commands:  
   * **parse-json**:  command to instruct UQL to parse the response as JSON   
   * **scope**: command to set `series` as the output data   
   * **project**: command to create a table with two columns (Servers and Carbon Emissions)
* Override1: Fields with name = **Carbon Emissions** / Cell display Mode = **LCD Gauge**
* Visualization: **Table**   
  * Unit: **kgCO2e**
  * Color scheme: **Green-Yellow-Red (by value)**<br />

<img
    src="/img/2022-10-19-20_26_28-hpe-com-using-infinity-uql-native-api-calls-grafana-—-mozilla-firefox.png"
  />




### Server health and information panel

This panel displays the health and information for each server. The information you want to display in the panel is very flexible, many properties are available in servers resource, such as server model, serial number, model, power status, etc.

#### Panel overview

![](/img/2022-10-21-11_24_26-hpe-com-using-infinity-uql-native-api-calls-grafana-—-mozilla-firefox.png)

#### API request

`get /compute-ops/v1beta2/servers/`

#### API response

```{
    "id": "P39886-B21+CN70490RXS",
    "type": "compute-ops/server",
    "platformFamily": "PROLIANT",
    "resourceUri": "/compute-ops/v1beta2/servers/P39886-B21+CN70490RXS",
    "name": "HPE-HOL17",
    "createdAt": "2022-03-25T16:22:22.373640+00:00",
    "updatedAt": "2022-10-19T20:18:08.466399+00:00",
    "generation": 515,
    "hardware": {
        "serialNumber": "CN70490RXS",
        "model": "ProLiant DL360 Gen10 Plus",
        "uuid": "38393350-3638-4E43-3730-343930525853",
        "productId": "P39886-B21",
        "powerState": "OFF",
        "indicatorLed": "OFF",
        "health": {
            "summary": "WARNING",
            "healthLED": "WARNING",
            "fans": "OK",
            "fanRedundancy": "REDUNDANT",
            "liquidCooling": "NOT_PRESENT",
            "liquidCoolingRedundancy": "NOT_PRESENT",
            "memory": "OK",
            "network": "UNKNOWN",
            "powerSupplies": "OK",
            "powerSupplyRedundancy": "NOT_PRESENT",
            "processor": "OK",
            "storage": "OK",
            "temperature": "OK",
            "bios": "WARNING",
            "smartStorage": "OK"
        },
        "bmc": {
            "mac": "B4:7A:F1:54:71:68",
            "ip": "172.30.231.79",
            "hostname": "None"
        }
    },
    "state": {
        "managed": true,
        "connected": true,
        "connectedModifiedAt": "2022-10-18T17:38:10.624330+00:00",
        "subscriptionState": "SUBSCRIBED",
        "subscriptionTier": "Enhanced",
        "subscriptionExpiresAt": "2027-01-31T19:11:00+00:00"
    },
    "firmwareInventory": [
        {
            "name": "iLO 5",
            "version": "2.72 Sep 04 2022",
            "deviceContext": "System Board"
        },
       ,
        {
            "name": "8 SFF 12G x1SAS UBM2 BC BP",
            "version": "1.20",
            "deviceContext": "Slot=12:Port=2I:Box=1"
        }
    ],
    "softwareInventory": [],
    "lastFirmwareUpdate": {
        "status": "OK",
        "attemptedAt": "2022-10-19T20:12:03.401750Z",
        "firmwareInventoryUpdates": [
            {
                "name": "U46_1.64_08_11_2022.fwpkg",
                "version": "1.64_08-11-2022",
                "status": "OK"
            },
            <...>
            {
                "name": "cp053854.exe",
                "version": "5.32",
                "status": "OK"
            }
        ]
    },
    "host": {
        "osName": "None",
        "osVersion": "None",
        "hostname": "HPE-HOL17",
        "osType": null,
        "osDescription": "None"
    },
    "firmwareBundleUri": "/v1/firmware-bundles/ea469b39ed5106434169397999e816bf",
    "tags": {},
    "biosFamily": "U46",
    "processorVendor": "Intel(R) Xeon(R) Gold 6338 CPU @ 2.00GHz",
    "autoIloFwUpdate": true
}
```


#### Panel configuration

* Data source: **Infinity-COM**<br />
* Type: **JSON**   <br />
* Format: **Table**   <br />
* URL: **${url}/compute-ops/v1beta2/servers?limit=100** <br />  
* Method: **GET**   <br />
* Header name: **Authorization** 
* Header value = **Bearer ${session}**<br />
* Column 1: **name** as **Name**
* Column 2: **hardware.serialNumber** as **Serial Number**
* Column 3: **hardware.model** as **Model**
* Column 4: **hardware.health.summary** as **Health**
* Column 5: **hardware.powerState** as **Power State**
* Column 6: **hardware.bmc.ip** as **iLO IP**
* Column 7: **lastFirmwareUpdate.status** as **Last FW Update Status**


<img
    src="/img/2022-10-20-17_20_28-hpe-com-using-infinity-uql-native-api-calls-grafana-—-mozilla-firefox.png"
  />

* Override1: Fields with name = **Health** / Cell display Mode = **Color text**
* Override2: Fields with name = **Power State** / Cell display Mode = **Color text**
* Override3: Fields with name = **Last FW Update Status** / Cell display Mode = **Color text**


<img
    src="/img/2022-10-20-17_23_49-.png"
  />

* Visualization: **Table**
* Value mappings: 
  * **OK**: Green
  * **WARNING**: Orange
  * **ERROR**: Red
  * **ON**: Green
  * **OFF**: Red


<img
    src="/img/2022-10-20-17_22_27-hpe-com-using-infinity-uql-native-api-calls-grafana-—-mozilla-firefox.png"
  />

Many other panels using other [API resources](https://developer.greenlake.hpe.com/docs/greenlake/services/compute-ops/public/openapi/compute-ops-latest/overview/) can be generated, for example for firmware bundles, groups, activities, etc. And now you have all the basics to get started and create the panels you need in your environment.

This concludes this blog post. I hope you find it useful and should you have any feedback, please send me a [message](mailto:lio@hpe.com).

