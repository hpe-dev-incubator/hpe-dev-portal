---
title: HPE Sustainability Insight Center API at a glance
date: 2024-06-24T12:44:18.079Z
author: Didier Lalli
authorimage: /img/didier-lalli.png
disable: false
tags:
  - hpe-greenlake-api
---
<style>
li {
   font-size: 27px;
   line-height: 33px;
   max-width: none;
}
</style>

HPE GreenLake provides a new service called HPE Sustainability Insight Center that can assist you in obtaining detailed information about carbon emissions, energy consumption and the cost of the infrastructure that is managed by HPE GreenLake. In this blog post, I will explain how to extract data from this service in a programmatic way using cURL and the HPE Sustainability Insight Center API.

## What is HPE Sustainability Insight Center?

HPE Sustainability Insight Center is a service that runs on HPE GreenLake. I can add it into my workspace from the HPE GreenLake catalogue under the Management & Governance category.

![HPE GreenLake catalogue](/img/sic-blog-1.jpg "HPE GreenLake catalogue")

Once deployed, the service provides a dashboard, which I can use to monitor carbon emissions, energy consumption, and energy cost. You can get more details about HPE Sustainability Insight Center from the [User Guide](https://support.hpe.com/hpesc/public/docDisplay?docId=a00120892en_us&page=GUID-64E2035A-138E-44E8-8A04-7968A272A97E.html).

![HPE Sustainability Insight Center Console](/img/sic-blog-2.jpg "HPE Sustainability Insight Center Console")

In addition to the dashboard, HPE Sustainability Insight Center provides an API, to enable programmatically accessing this same data.

## What can I do with the HPE Sustainability Insight Center API?

Important use cases covered by the HPE Sustainability Insight Center API include:

* **Achieving sustainability goals** — Use data retrieved from the HPE Sustainability Insight Center API to measure your organization's power consumption and carbon footprint. With this data, your organization can make data-infused, informed decisions to reduce its climate impact and ensure its IT assets operate in a way that meets regulatory and business environmental sustainability goals.
* **Monitoring IT costs** — Use data available from the HPE Sustainability Insight Center API to rationalize the power consumption of IT assets operations for cost efficiency. This will free up budget for innovative and growth-orientated investments.
* **Integrating into reporting workflows** — Use data retrieved from the HPE Sustainability Insight Center to incorporate into existing analytics, reporting, dashboards, and forecasting workflows to give your organization a robust understanding of its IT operations.

## Where is the HPE Sustainability Insight Center API documented?

The [API specifications](https://developer.greenlake.hpe.com/docs/greenlake/services/sustainability/public/) are found on the [HPE GreenLake developer portal](https://developer.greenlake.hpe.com/) along with other HPE GreenLake APIs. For HPE Sustainability Insight Center, there are 3 API calls available:

* **usageByEntity**: Retrieves an aggregated energy usage list grouped by individual entities over a defined time frame.
* **usageTotals**: Returns the total aggregated power cost, power consumption, and carbon emissions over a defined time frame and supports filtering by entities.
* **usageSeries**: Retrieves aggregated energy usage statistics grouped by time bucket over a defined time frame and supports filtering by entities.

> Note: You can download the [OpenAPI specs](https://developer.greenlake.hpe.com/docs/greenlake/services/sustainability/public/openapi/sustainability-insight-ctr-latest/overview/) from the [HPE GreenLake developer portal](https://developer.greenlake.hpe.com/), if you want to use the API from a tool such as Postman.

## Be careful with tokens!

A little word of advice about tokens. Because the HPE Sustainability Insight Center is a service, you will need to create a dedicated API client credentials for it in your workspace (under Manage Workspace/API). You cannot use HPE GreenLake platform API client credentials, as it will result in a 403-error code. Also, you’ll need to be careful, as API client credentials are region specific. When creating an API client credentials, say for Europe (EU Central), make sure to use it to call the API endpoint for that region, as shown below (Connectivity Endpoint).

![HPE GreenLake platform API client credentials](/img/sic-blog-3.jpg "HPE GreenLake platform API client credentials")

## Let's give it a try!

Let's start with the first of the 3 calls, **usageByEntity**. From the [documentation](https://developer.greenlake.hpe.com/docs/greenlake/services/sustainability/public/openapi/sustainability-insight-ctr-latest/operation/getUsageByEntity), note that only 2 parameters are mandatory, *start-time* and *end-time*.

> Note: the format of the date used by the API, which is ISO 8601 of the form: YYYY-MM-DDTHH:MM:SS.ss-/+FF:ff. For example: '2023-07-24T04:21:22.00Z' for 4:21AM on the 24th of July, 2023 in UTC (Z=Zero Meridian)

So, you could use the following command in Bash:

```bash
$ curl -s -X GET 'https://eu-central.api.greenlake.hpe.com/sustainability-insight-ctr/v1beta1/usage-by-entity?end-time=2024-06-11T08%3A00%3A00Z&start-time=2024-06-11T08%3A00%3A00Z'-H 'Authorization: Bearer <my-token>' -H "Accept:application/json" | jq
{
  "items": [
    {
      "id": "COMPUTE867962-B21CZJ93402YV",
      "type": "sustainability-insight-ctr/entities",
      "entityId": "COMPUTE867962-B21CZJ93402YV",
      "entityMake": "HPE",
      "entityModel": "ProLiant DL360 Gen10",
      "entityType": "COMPUTE",
      "entitySerialNum": "CZJ93402YV",
      "entityProductId": "867962-B21",
      "entityManufactureTimestamp": "2024-05-25T06:43:32.934Z",
      "locationName": "Sophia Antipolis",
      "locationId": "d1386776-e49d-4333-9ccc-c4bfc2029f40",
      "locationCity": "Mougins",
      "locationState": "PACA",
      "locationCountry": "France",
      "name": "centos82rf2",
      "costUsd": 3.1437287,
      "co2eMetricTon": 0.0015487487,
      "kwh": 23.115652
    },
    {
      "id": "IAPVariousVarious",
      "type": "sustainability-insight-ctr/entities",
      "entityId": "IAPVariousVarious",
      "entityMake": "HPE",
      "entityModel": "Aggregated HPE Aruba access points",
      "entityType": "IAP",
      "entitySerialNum": "Various",
      "entityProductId": "Various",
      "entityManufactureTimestamp": "2024-04-25T09:32:06.996Z",
      "locationName": null,
      "locationId": null,
      "locationCity": null,
      "locationState": null,
      "locationCountry": null,
      "name": "",
      "costUsd": 0.77483493,
      "co2eMetricTon": 0.0021369294,
      "kwh": 4.842718
    }
  ],
  "count": 2,
  "total": 2,
  "offset": 0
}
```

> Note: You can also try this from the HPE GreenLake developer portal by using the **Try it** function:

![HPE GreenLake developer portal](/img/sic-blog-4.jpg "HPE GreenLake developer portal")

Here, you can see from the JSON response obtained for energy cost, CO2 emission and kWh consumption for an HPE ProLiant DL360 and a group of Aruba access points over the selected period.

The next call to try out is **usage-totals**, which is documented [here](https://developer.greenlake.hpe.com/docs/greenlake/services/sustainability/public/openapi/sustainability-insight-ctr-latest/operation/getUsageTotals). The parameters of the call are the same as in the previous call, so let's give it a try:

```bash
$ curl -s -X GET 'https://eu-central.api.greenlake.hpe.com/sustainability-insight-ctr/v1beta1/usage-totals?end-time=2024-06-11T08%3A00%3A00Z&start-time=2024-06-01T00%3A00%3A00Z' -H 'Authorization: Bearer <my-token>' -H "Accept:application/json" | jq
{
  "items": [
    {
      "type": "sustainability-insight-ctr/totals",
      "costUsd": 3.9185636,
      "co2eMetricTon": 0.0036856781,
      "kwh": 27.95837
    }
  ],
  "count": 1
}
```

This call returns the totals Cost, CO2, and kWh for the complete environment. You can apply filters, such as:

* `filter=locationCountry eq 'France'` to reduce scope to only devices located in France
* `filter=entityType eq 'COMPUTE'` to reduce scope to only COMPUTE devices

Let’s try these two:

```bash
$ curl -s -X GET 'https://eu-central.api.greenlake.hpe.com/sustainability-insight-ctr/v1beta1/usage-totals?end-time=2024-06-11T08%3A00%3A00Z&start-time=2024-06-01T00%3A00%3A00Z&filter=locationCountry%20eq%20%27France%27' -H 'Authorization: Bearer <my-token>' -H "Accept:application/json"  | jq
{
  "items": [
    {
      "type": "sustainability-insight-ctr/totals",
      "costUsd": 3.1437287,
      "co2eMetricTon": 0.0015487487,
      "kwh": 23.115652
    }
  ],
  "count": 1
}


$ curl -s -X GET 'https://eu-central.api.greenlake.hpe.com/sustainability-insight-ctr/v1beta1/usage-totals?end-time=2024-06-11T08%3A00%3A00Z&start-time=2024-06-01T00%3A00%3A00Z&filter=entityType%20eq%20%27COMPUTE%27' -H 'Authorization: Bearer <my-token>' -H "Accept:application/json"  | jq
{
  "items": [
    {
      "type": "sustainability-insight-ctr/totals",
      "costUsd": 3.1437287,
      "co2eMetricTon": 0.0015487487,
      "kwh": 23.115652
    }
  ],
  "count": 1
}
```

Finally, give the last call, **usageSeries**, a try. You can see from the [documentation](https://developer.greenlake.hpe.com/docs/greenlake/services/sustainability/public/openapi/sustainability-insight-ctr-latest/operation/getUsageBySeries) that, in addition to *start-time* and *end-time*, there is an additional required parameter called *interval*. *interval* should be formatted as an integer value followed by a unit string. Units can be one of: day, hour, week, month, or year.  

Let's give this a try:

```bash
$ curl -s -X GET 'https://eu-central.api.greenlake.hpe.com/sustainability-insight-ctr/v1beta1/usage-series?end-time=2024-06-11T08%3A00%3A00Z&start-time=2024-06-01T00%3A00%3A00Z&interval=1%20day' -H 'Authorization: Bearer <my-token>' -H "Accept:application/json" | jq
{
  "items": [
    {
      "id": "2024-06-01T00:00:00.000Z",:
      "type": "sustainability-insight-ctr/timeseries",
      "timeBucket": "2024-06-01T00:00:00.000Z",
      "costUsd": 0.403164,
      "co2eMetricTon": 0.00041689575,
      "kwh": 2.858163
    },
    {
      "id": "2024-06-02T00:00:00.000Z",
      "type": "sustainability-insight-ctr/timeseries",
      "timeBucket": "2024-06-02T00:00:00.000Z",
      "costUsd": 0.40312916,
      "co2eMetricTon": 0.0004167917,
      "kwh": 2.8579495
    },
    {
      "id": "2024-06-03T00:00:00.000Z",
      "type": "sustainability-insight-ctr/timeseries",
      "timeBucket": "2024-06-03T00:00:00.000Z",
      "costUsd": 0.4038577,
      "co2eMetricTon": 0.00041880895,
      "kwh": 2.8624988
    },
    {
      "id": "2024-06-04T00:00:00.000Z",
      "type": "sustainability-insight-ctr/timeseries",
      "timeBucket": "2024-06-04T00:00:00.000Z",
      "costUsd": 0.40462032,
      "co2eMetricTon": 0.00042090417,
      "kwh": 2.8672693
    },
    {
      "id": "2024-06-05T00:00:00.000Z",
      "type": "sustainability-insight-ctr/timeseries",
      "timeBucket": "2024-06-05T00:00:00.000Z",
      "costUsd": 0.40372863,
      "co2eMetricTon": 0.00041844492,
      "kwh": 2.861696
    },
    {
      "id": "2024-06-06T00:00:00.000Z",
      "type": "sustainability-insight-ctr/timeseries",
      "timeBucket": "2024-06-06T00:00:00.000Z",
      "costUsd": 0.4039479,
      "co2eMetricTon": 0.00041905773,
      "kwh": 2.8630626
    },
    {
      "id": "2024-06-07T00:00:00.000Z",
      "type": "sustainability-insight-ctr/timeseries",
      "timeBucket": "2024-06-07T00:00:00.000Z",
      "costUsd": 0.30680534,
      "co2eMetricTon": 0.00015114676,
      "kwh": 2.2559216
    },
    {
      "id": "2024-06-08T00:00:00.000Z",
      "type": "sustainability-insight-ctr/timeseries",
      "timeBucket": "2024-06-08T00:00:00.000Z",
      "costUsd": 0.4034695,
      "co2eMetricTon": 0.00041773028,
      "kwh": 2.8600764
    },
    {
      "id": "2024-06-09T00:00:00.000Z",
      "type": "sustainability-insight-ctr/timeseries",
      "timeBucket": "2024-06-09T00:00:00.000Z",
      "costUsd": 0.40351078,
      "co2eMetricTon": 0.00041754392,
      "kwh": 2.8604808
    },
     {
      "id": "2024-06-09T00:00:00.000Z",
      "type": "sustainability-insight-ctr/timeseries",
      "timeBucket": "2024-06-10T00:00:00.000Z",
      "costUsd": 0.40351078,
      "co2eMetricTon": 0.00041754392,
      "kwh": 2.8604808
    },

    {
      "id": "2024-06-10T00:00:00.000Z",
      "type": "sustainability-insight-ctr/timeseries",
      "timeBucket": "2024-06-11T00:00:00.000Z",
      "costUsd": 0.3068089,
      "co2eMetricTon": 0.0001511485,
      "kwh": 2.2559478
    },
  ],
  "count": 11
}
```

You can see that I get measurements from June 1 at 00:00 and then measurements every hour until 00:00 on the 12th of June. At the time I ran the call, it was 5:30PM on the 11th of June, so all values in the future were set to null.

## Using this data externally

You can use this data within a tool such as Excel:

![Data imported in Excel](/img/sic-blog-5.jpg "Data imported in Excel")

And start providing monthly graphs according to your needs:

![Excel graphs](/img/sic-blog-graphs.jpg "Excel graphs")

You could go a step further and feed this time-series data into [Elasticsearch](https://www.elastic.co/elasticsearch) or [influxdb](https://www.influxdata.com/) to build more advanced dashboards with [Kibana](https://www.elastic.co/kibana) or [Grafana](https://grafana.com/). The capture below shows an example of influxdb dashboard showing kWh, CO2 and cost over time.

![](/img/sic-blog-9.jpg)

## Next step

In this article, I described how to retrieve carbon emission, energy consumption, and cost of an Infrastructure managed with HPE GreenLake using the API for the HPE Sustainability Insight Center. I used Bash and cURL, but you could do the same using PowerShell or Python. For more details about how to use these two languages with HPE GreenLake, please check out my previous blog posts:

* [HPE GreenLake edge-to-cloud platform scripting fundamentals](https://developer.hpe.com/blog/hpe-greenlake-edge-to-cloud-platform-scripting-fundamentals/)
* [Bulk onboarding of users in HPE GreenLake edge-to-cloud platform](https://developer.hpe.com/blog/bulk-onboarding-of-users-in-hpe-greenlake-edge-to-cloud-platform/)

If you’re interested in trying out the HPE GreenLake API, you might first want to check out one of our hands-on Workshops-on-Demand. The workshops are free, available 24/7, and very easy to use. They give you a real-world experience without any risk. Check out our [catalog of workshops](https://developer.hpe.com/hackshack/workshops), register for the one you’re interested in and go! It’s as simple as that.

If you still have any questions regarding the HPE GreenLake APIs, join the [HPE Developer Community Slack](https://developer.hpe.com/slack-signup/)  and start a discussion in our [\#hpe-greenlake-api](https://hpedev.slack.com/archives/C02EG5XFK8Q) channel. We’re always here to help.