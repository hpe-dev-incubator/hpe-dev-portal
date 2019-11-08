---
title: "Simplivity"
version: v 6.01.8964
description:
image: 
frontpage: false
priority: 2
tags: ["Simplivity"]
---

Getting performance and capacity metrics
========================================

You use the REST API to view IOPs, latency, and throughput data over time. This information is available for individual `hosts`, `omnistack_clusters`, and `virtual_machines`. The metrics that the REST API provides include data about both reads and writes, as well as the date of the metrics sample.

The REST API collects metrics at five-second intervals.

When requesting metrics data, you can specify the following parameters:

- `resolution`: Specify one of the following values:

  - SECOND
  - MINUTE
  - HOUR
  - DAY
- `time_offset`: Specify the `time_offset` from the current date and time or a `time_offset` as a specific date/time.

- `range`: Specify the desired range as a number of seconds from the `time_offset`.

The following example shows how to find the last ten seconds of metrics data for a specific `omnistack_cluster`:

```
GET /api/omnistack_clusters/f25bc244-e70f-4ffb-833d-e797bc2bc231/metrics?range=10&resolution=SECOND
```

This request returns an array of data points similar to the following example:

```
{
  "metrics": [
    {
      "name": "iops",
      "data_points": [
        {
          "reads": 0,
          "writes": 6,
          "date": "2016-09-08T16:11:20Z"
        },
        {
          "reads": 0,
          "writes": 0,
          "date": "2016-09-08T16:11:25Z"
        }
      ]
    },
    {
      "name": "throughput",
      "data_points": [
        {
          "reads": 0,
          "writes": 537,
          "date": "2016-09-08T16:11:20Z"
        },
        {
          "reads": 0,
          "writes": 0,
          "date": "2016-09-08T16:11:25Z"
        }
      ]
    },
    {
      "name": "latency",
      "data_points": [
        {
          "reads": 0,
          "writes": 1259,
          "date": "2016-09-08T16:11:20Z"
        },
        {
          "reads": 0,
          "writes": 0,
          "date": "2016-09-08T16:11:25Z"
        }
      ]
    }
  ]
}
```

Performance chart
=================

The REST API provides a simple one page performance chart that allows you to request host metrics and display them using `Chart.js.` For example:

![Example of the performance chart](https://developer.hpe.com/uploads/media/2018/7/svt-rest-api-perf-chart-1532710805262.png)

The code to generate the sample page looks like this:

```
<!DOCTYPE html>
<!-- Copyright © 2017
SimpliVity Corporation - All Rights Reserved -->
<html>
<head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.1/moment.min.js"></script>
   <script src="lib/jquery-1.11.3.min.js"></script>
    <script src="lib/Chart.js"></script>
</head>

<body>
    <canvas id="myChart" width="400" height="90%"></canvas>
    <div id="query params">
        <form>
        Host:
        <select name="host" id="host" onchange="getHosts()">
            <option>Fetching Hosts</option>
        </select>
        Resolution:
        <select name="resolution" id="resolution">
            <option>Second</option>
            <option>Minute</option>
            <option>Hour</option>
            <option>Day</option>
        </select>
        <input type=button value="Show Metrics" onclick="fetchHostMetrics();">
        </form>
    </div>

<script>
    fetchHosts();

    function fetchHosts() {
        $.ajax({
            url: 'hosts?fields=name,id',
            type: 'GET',
            dataType : "json",
            statusCode: { 401: function() {alert("Invalid Credentials - Login Again"); }}
        })
        .done(function(json) {
            // reset the combo box with the list of hosts
            var hosts = json.hosts;
            var sel = document.getElementById('host');
            sel.innerHTML = "";
            hosts.forEach(function(host) {
                var opt = document.createElement('option');
                opt.innerHTML = host.name;
                opt.value = host.id;
                sel.appendChild(opt);
            })
        })

        .fail(function( xhr, status, errorThrown ) {
            alert( "Sorry, there was a problem!" );
            console.log( "Error: " + errorThrown );
            console.log( "Status: " + status );
            console.dir( xhr );
        })
    }

    function fetchHostMetrics() {
        // find the selected host
        var sel = document.getElementById('host');
        var hostid = sel.value;
        // find the selected resolution
        var sel = document.getElementById('resolution');
        var resolution = sel.value;

        $.ajax({
            url: 'hosts/'+hostid+'/metrics?resolution='+resolution,
            type: 'GET',
            dataType : "json",
            statusCode: { 401: function() {alert("Invalid Credentiald - Login Again"); }}
        })
        .done(function(json) {createLineChart(json)})
        .fail(function( xhr, status, errorThrown ) {
            alert( "Sorry, there was a problem!" );
            console.log( "Error: " + errorThrown );
            console.log( "Status: " + status );
            console.dir( xhr );
        })
    }

    function processJSONintoDatasets(json) {
        // create 6 datasets from the JSON
        var iops_reads = [];
        var iops_writes = [];
        var latency_reads = [];
        var latency_writes = [];
        var throughput_reads = [];
        var throughput_writes = [];

        // process all the metrics
        json.metrics.forEach(function(metric) {
            if (metric.name == "iops") {
                metric.data_points.forEach(function(point) {
                    iops_reads.push({x:point.date, y: point.reads});
                    iops_writes.push({x:point.date, y: point.writes});
                })
            }

            else if (metric.name == "latency") {
                 metric.data_points.forEach(function(point) {
                    latency_reads.push({x: point.date, y: point.reads});
                    latency_writes.push({x: point.date, y: point.writes});
                })
            }

            else if (metric.name == "throughput") {
                 metric.data_points.forEach(function(point) {
                    throughput_reads.push({x:point.date, y: point.reads});
                    throughput_writes.push({x:point.date, y: point.writes});
                })
            }
        })

        // create the data object
        var data = {
            datasets: [
                { label: 'IOPS read', data: iops_reads, yAxisID: "y-axis-left", borderColor: 'rgba(31,120,180,1)',backgroundColor: 'rgba(31,120,180, 0.1)'},
                { label: 'IOPS written', data: iops_writes, yAxisID: "y-axis-left", borderColor: "#33a02c"},
                { label: 'latency read', data: latency_reads, yAxisID: "y-axis-left", borderColor: "#e31a1c" },
                { label: 'latency writes', data: latency_writes, yAxisID: "y-axis-left", borderColor:"#ff7f00" },
                { label: 'throughput read', data:throughput_reads, yAxisID: "y-axis-right", borderColor:"#6a3d9a" },
                { label: 'throughput writes', data: throughput_writes, yAxisID: "y-axis-right", borderColor: "#b15928" }
            ]
        }

        // now set the common options
        data.datasets.forEach(function(dataset) {
            dataset.fill = true;
            dataset.lineTension = 0;
        })
        return data;
    }

    var myLineChart;
    function createLineChart(json) {
        var ctx = document.getElementById("myChart");
        var data =processJSONintoDatasets(json);

        // remove any existing chart before creating a new one
        if (myLineChart)
            myLineChart.destroy();

        myLineChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                title:{
                    display:true,
                    text:"Metrics"
                },
                scales: {
                    xAxes: [{
                        type: "time",
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Time=(GMT)'
                        }
                    }],

                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString:'IOPS/Latency'
                        },
                        position: "left",
                        "id": "y-axis-left"
                    }, {
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Throughput'
                        },
                        position: "right",
                        "id": "y-axis-right"
                    }]
                }
            }
        });
    }
    </script>
</body>
</html>
```

Capacity metrics
================

Each HPE OmniStack `host` and `omnistack_cluster` object returns a set of capacity metrics when you perform a GET operation. You can query for a specific period of time. The REST API provides the following capacity metrics for `host`and `omnistack_cluster` objects:

- allocated_capacity`
- capacity_savings`
- compression_ratio`
- deduplication_ratio`
- efficiency_ratio`
- free_space`
- local_backup_capacity`
- remote_backup_capacity`
- stored_compressed_data`
- stored_uncompressed_data`
- stored_virtual_machine_data`
- used_capacity`
- used_logical_capacity`

The following example returns `free_space` (in bytes) for the last ten seconds for a specific `host`:

```
GET /api/hosts/422ac72f-8437-6e09-eb44-6ffc8bde0aad/capacity?fields=free_space&range=5&resolution=SECOND"
```

The JSON response:

```
{
  "metrics": [
    {
      "name": "free_space",
      "data_points": [
        {
          "value": 5170371316326,
          "date": "2016-09-08T16:29:50Z"
        },
        {
          "value": 5170369843492,
          "date": "2016-09-08T16:29:55Z"
        }
      ]
    }
  ]
}
```
