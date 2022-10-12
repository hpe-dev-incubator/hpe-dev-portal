---
title: How to monitor HPE OneView infrastructure with Grafana Metrics Dashboards
  and InfluxDB
date: 2022-10-12T10:00:35.115Z
author: Lionel Jullien
authorimage: /img/small-size-id.jpg
---
The purpose of this blog post is to describe how to generate Grafana dashboards using InfluxDB and PowerShell scripts to monitor any HPE Compute infrastructure managed by HPE OneView.

# Grafana Dashboards

IT infrastructure metrics visualization is critical for health monitoring, prediction, and capacity planning. It provides a powerful way of viewing infrastructure utilization, revealing issues and helping maintain uninterrupted services.

Grafana's time series graphs are the perfect enabler for IT infrastructure metrics evolution over time; examples include, temperature changes, network traffic performance, power consumption and many more. They are useful to compare data over time and see the trends, detect issues and allow administrators to make infrastructure adjustments and prevent downtime.

The following picture shows a typical HPE infrastructure dashboard with Synergy frame, compute, and interconnect metrics:

![](/img/image001.png)

# HPE OneView metric resources

Multiple metrics resources are supported by HPE OneView through the API: CPU, memory, power consumption, temperature, health, capacity data for some resources like Enclosures, Interconnects and Server hardware. Network statistics and network throughput are also available for each uplink and downlink ports in "interconnects" such as Virtual Connect modules.

**Note** : HPE OneView Metrics are enabled by default.
 For Virtual Connect network statistics, the Utilization Sampling settings defined in the Logical Interconnect Group controls the data collection rate and sample interval value. By default, the HPE Virtual Connect Module sampling rate is 12 samples per hour, as depicted in the following figure:

 

![](/img/image002.png)

# InfluxDB Time-series database

The decision to use InfluxDB was made for several reasons: first, InfluxDB can be installed on Windows and Linux, it is an open-source tool, and there are PowerShell modules to interact with. You should know that there are many other options like the Prometheus application which also allows to record real-time metrics in a time-series database. To collect OneView metrics, we use a PowerShell script. This script collects utilization statistics of defined resources from the HPE OneView API periodically and continually transmits the metricsto InfluxDB via the REST API. The timestamped metrics data is saved into the InfluxDB time series database that Grafana uses to generate the graphs.

The script is an independent process that must run continuously.

The following diagram describes the different components of the solution:

![](/img/image003.png)

## Pros and Cons about this solution

Pros:

* Enables time-series graphs for the HPE OneView Server hardware utilization statistics and HPE Virtual Connect modules utilization statistics.
* Supports collecting metrics from any API (simply requires the appropriate PowerShell script for the collection)
* Provides a flexible solution using widely used and cross-platform scripting language.
* Cross-platform support, all components can be installed on Windows or Linux.

Cons:

* Requires development of PowerShell scripts if the examples provided do not meet your needs.
* Requires in-depth knowledge of the language, API, authentication, and methods.

# HPE Oneview resource metrics list

HPE Oneview supports many resource metrics that can be retrieved using a collector script:

**Server hardware Metrics:**\
Ambient Temperature: /rest/server-hardware/{id}/utilization?fields=AmbientTemperature\
 Average Power: /rest/server-hardware/{id}/utilization?fields=AveragePower\
 Cpu Average Frequency: /rest/server-hardware/{id}/utilization?fields=CpuAverageFreq\
 Cpu Utilization: /rest/server-hardware/{id}/utilization?fields=CpuUtilization\
 Peak Power: /rest/server-hardware/{id}/utilization?fields=PeakPower\
 Power Cap: /rest/server-hardware/{id}/utilization?fields=PowerCap  

**Enclosures Metrics:**\
Ambient Temperature: /rest/enclosures/{id}/utilization?fields=AmbientTemperature\
Average Power: /rest/enclosures/{id}/utilization?fields= AveragePower\
Peak Power: /rest/enclosures/{id}/utilization?fields=PeakPower\
Ambient Temperature: /rest/enclosures/{id}/utilizationfields=AmbientTemperature  

**Interconnect Metrics:**\
Statistics for the specified port name on an interconnect: /rest/interconnects/{id}/statistics/portname\
Interconnect cpu and memory utilization data: /rest/interconnects/{id}/utilization/  

# Configuration

## Prerequisites

* Grafana and InfluxDB must be installed, started, and enabled
* A firewall rule must be created to allow TCP port 8086 (used by InfluxDB API, by default)
* PowerShell Core for Linux must be installed if a Linux server is used to run the PowerShell scripts
* HPE OneView PowerShell library 6.60 or later must be used.

## Configure InfluxDB http Authentication

By default, all security features are disabled in InfluxDB, so it is recommended to set up authentication by creating an **admin** user.

To launch the influx command line interface (CLI), type:\
*influx*\
Then create a user with an authentication password:\
*CREATE USER admin WITH PASSWORD 'P@ssw0rd' WITH ALL PRIVILEGES*

Once created, authenticate using:\
*auth*\
username:*admin*\
password:*\*\*\*\*\*\*\*\**  

To enable the http authentication, you need to modify the InfluxDB configuration file. Go to the **\[http]** section of **/etc/influxdb/influxdb.conf** and change the **auth-enabled** value to **true.**

*\[http]*\
*auth-enabled = true*

Once modified, restart the InfluxDB service:\
*sudo systemctl restart influxdb*

## PowerShell Scripts for HPE OneView metrics collection

PowerShell scripts which allow collecting metrics from the HPE OneView API can be found at <https://github.com/jullienl/HPE-Synergy-OneView-demos/tree/master/Powershell/Grafana%20Metrics>

Two distinct scripts are available, one for the interconnect metrics and one for Compute, enclosure, and server profile metrics.

![](/img/image004.png)

For each script, it is important to provide all the required variables for HPE OneView and InfluxDB.

![](/img/image005.png)

For *Grafana-Interconnect-monitoring.ps1*, at the beginning of the script you need to provide the interconnect module names and port IDs that you would like to monitor using a hash table format:

![](/img/picture1.png)

Note that the interconnect modules and port names can be found in the HPE OneView UI (in the Interconnects menu):

![](/img/image006.png)

For *Grafana-Server_Enclosure-monitoring.ps1*, you need to provide at the beginning of the script, the resource names (Server hardware or Server profile or Enclosure) and utilization (CPU, Power, or Temperature) that you want to monitor using a hash table format:

![](/img/image007.png)

The names of the resources that need to be provided can be easily identified in the corresponding menus of the OneView user interface.

These scripts are written to collect metrics continually. They can be run in background on a Linux system using a crontab configuration or on a Windows one, usingTask Scheduler.

### How to run the scripts on a Windows machine?

The following commands can be used to schedule both jobs on a Windows machine:

*$trigger = New-JobTrigger -AtStartup -RandomDelay 00:00:30*

*Register-ScheduledJob -Trigger $trigger -FilePath "<path to file>\ Grafana-Server_Enclosure-monitoring.ps1" -Name GrafanaServerEnclosureMonitoring*

*Register-ScheduledJob -Trigger $trigger -FilePath "<path to file>\Grafana-Interconnect-monitoring.ps1" -Name GrafanaInterconnectMonitoring*

You can check the job schedule by typing:

*\> Get-ScheduledJob*

![](/img/image008.png)

Alternatively, launch Windows Task Scheduler, by pressing Windows + R keys on your keyboard to Run a command, and enter:

*\> taskschd.msc*

![](/img/image009.png)

As we are using an "at startup" trigger, it is required to restart the server in order to run the scripts.

Restart the server and confirm that scripts are executed. Once restarted, you can run on a Windows machine:

*\> Get-job*

![](/img/image010.png)

### How to run the scripts on a Linux machine?

PowerShell can be installed on different Linux distributions today and it works perfectly, using a crontab configuration would make the scripts run in background. This allows using only one Linux machine to host all components (i.e., Grafana, InfluxDB and the execution of the PowerShell scripts).

To learn more, you can refer to <https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-linux?view=powershell-7.2>.

The Linux repositories proposed by Microsoft can be found at the following address: <https://packages.microsoft.com/config/>

![](/img/image011.png)

On a RHEL/CentOS virtual machine, you can use the following steps:

* Add the Microsoft package repository:\
  *curl https://packages.microsoft.com/config/centos/8/prod.repo | sudo tee /etc/yum.repos.d/microsoft.repo*
* Run the PowerShell installation:\
  *yum install powershell*
* Copy the script files to the Linux system and set the execution permission on both files:\
  *chmod +x Grafana-Interconnect-monitoring.ps1*\
  *chmod +x Grafana-Server_Enclosure-monitoring.ps1*
* Open the crontab configuration:\
  *crontab -e*
* Add two configurations, one for each script with a startup execution after a sleep time:\
  *@reboot sleep 30 && pwsh -File "/<path>/Grafana-Interconnect-monitoring.ps1"*\
  *@reboot sleep 30 && pwsh -File "/<path>/Grafana-Server_Enclosure-monitoring.ps1"*
* Restart the Linux machine to trigger the execution:\
  *shutdown -r now*

**How to ensure that the scripts have started successfully?**

First, to make sure that the scripts have started, you can check that the databases have been created using the InfluxDB tool.

Connect to the server running InfluxDB and *launch the InfluxDB CLI*:\
*influx*\
 Authenticate using your InfluxDB credentials:\
*auth*\
 Display existing databases:\
*show databases*  

If both databases defined in the script are listed, then both scripts have started successfully:

 

![](/img/image012.png)

To verify that metrics are collected successfully enter "use <database name>", where <database name> is the name of your database, then show measurements as shown below:\
*use <database name>*.\
*show measurements*

![](/img/image013.png)

The measurements listed here correspond to the metrics (ports or resources) defined in the PowerShell scripts.

Open one of the measurements to verify that the metric data is coming in:\
*SELECT * FROM "Frame3-Interconnect3-Q1"*

![](/img/image014.png)

The data shows that the collection of metrics has started and that everything is running fine.

## Adding InfluxDB data sources in Grafana

Now that InfluxDB is configured and the data is collected, we can add the databases (created by the two scripts) to Grafana as new InfluxDB data sources.

Once that is completed, any dashboard we create in Grafana will have access to the metric data collected..

To launch the Grafana IU, open your web browser and navigate to **http://<grafana_IP or DNS name>:3000/**

**Note** : The default HTTP port that Grafana listens to is 3000 unless you have configured a different port.

Click on the gear icon on the side menu and click **Add data Sources**.

![](/img/image015.png)

Select **InfluxDB** from the data source list.

![](/img/image016.png)

For Server and Enclosure metrics, enter a data source name, e.g., **InfluxDB-OV-Server-Metrics**

Add the InfluxDB URL; by default it is **[http://localhost:8086](http://localhost:8086/)**

Add the database name that you defined in *Grafana-Server_Enclosure-monitoring.ps1*

 

![](/img/image017.png)

Provide the InfluxDB admin username and password.

![](/img/image018.png)

Once completed, click on the **Save & Test** button.

If no error is returned, a "Data source is working" message is displayed.

![](/img/image019.png)

Now repeat the same Add data source procedure for the Interconnect metrics, using this time the data source name **InfluxDB-OV-Interconnect-Metrics**

![](/img/image020.png)

Again, using the database name you defined in *Grafana-Interconnect-monitoring.ps1*

![](/img/image021.png)

![](/img/image022.png)

Once this is done, click on the **Save & Test** button and make sure the data source is working.

You can then click on the **Back** button to return to the Data sources configuration window.

We should now have two new Grafana data sources corresponding to the two InfluxDB databases generated by the two PowerShell scripts.

![](/img/image023.png)

This completes the configuration of the Grafana data source.

We are now ready to access our InfluxDB time series databases in Grafana.

## Creating the Grafana dashboard

A Grafana dashboard can aggregate one or more panels using multiple sources. Thus, we can create a single dashboard with Server_Enclosure and Interconnect metrics panels.

Click on the Dashboards icon on the side menu and click **New dashboard.**

![](/img/image024.png)

Click on **Add a new panel** to create a panel to visualize the first Virtual Connect module metrics.

In Data source, select **Influxdb-OV-Interconnect-Metrics**

![](/img/image025.png)

For Query options, it is recommended to set **5m** as the minimum query interval to match the OneView API metrics sampling value of the interconnect interfaces (see below).

![](/img/image026.png)

Then, you need to define a query for each port you specified in the PowerShell script (in the $Ports variable) for this interconnect module name, as shown below:

![](/img/image027.png)

For example, to set the Q1 port, you need to click on **select measurement** next to **FROM** :

![](/img/image028.png)

A list of all the measurements available in the database is displayed in the drop-down menu, as seen below:

![](/img/image029.png)

Select **Q1,** then click on **field (value)** in the **SELECT** row to select the value you want to display:

![](/img/image030.png)

A list of all measurement values recorded in the database displays in the drop-down menu:

![](/img/image031.png)

Select **receiveKilobytesPerSec** for example.

You can then set the alias as **Q1** to replace the default metric name and get a clear legend label on the chart.

![](/img/image032.png)

![](/img/image033.png)

The metric points should already appear on the graph.

Further, you can specify a panel title in the right-side menu using the interconnect name you selected, like **VC Frame3-Interconnect3** (in our example).

![](/img/image034.png)

And for a better visualization, you can select **Always** for **Connect null values** and **Never** for **Show points** in the Graph styles section.

![](/img/image035.png)

And finally, set the unit data rate you selected in the SELECT row. Scroll down to the **Standard options** section and in **Unit** , select **Data rate** and click on **kilobytes/sec**.

![](/img/image036.png)

Rendering should occur as follows:

![](/img/image037.png)

This completes the configuration of the first port query.

You will need to click on the **+ Query** button for the other ports and repeat the same query configuration (as previously described) for all the ports defined in the PowerShell script.

![](/img/image038.png)

![](/img/image039.png)

Once all queries have been defined, you can save the panel using the **Save** button in the upper right corner. Type a name for the newly created dashboard like **HPE OneView Metrics**.

![](/img/image040.png)

We can now duplicate this panel to create another one for the second Virtual Connect module. Click on the panel's context menu, select **More** , then **Duplicate**.

Click on the duplicated panel's context menu then select **Edit**.

Change the panel title with the name of your second Virtua Connect module like **VC Frame3-Interconnect6 Metrics**

Then modify each query by selecting the ports on the second interconnect module that you want to monitor.

![](/img/image041.png)

Click **Save** then **Apply**.

The dashboard now displays two panels, one for each Virtual Connect module that was defined in *Grafana Interconnect monitoring.ps1*

![](/img/image042.png)

The next step consists in creating panels to display Compute and frame metrics.

Click on the **Add panel** button on the upper bar and select **Add a new panel**.

Select the **InfluxDB-OV-Server-Metrics** data source, then select the resource you want to monitor.

![](/img/image043.png)

Select the measure you need:

![](/img/image044.png)

Then:

* Add a panel title
* Use 5m for the Min interval query options
* Select the graph styles options

  * Connect null values: Always
  * Show points: Never
* Select the correct unit corresponding to the measurement type

  * Power: Energy / Watt
  * Temperature: Temperature / Celsius
  * CPU: simply type GHz
* Add meaningful alias names to reflect reported measurement.

Add any additional measurement you need, using another query.

Here is an example of a frame panel with power and temperature metrics defined:

![](/img/image045.png)

For panels with two different types of measurements (Watt and Celsius) as seen above, we need to define two Y-axes. One for the temperature and one for the power consumption.

Select **Overrides** at the top of the right-side menu, then click on **Add field override** :

![](/img/image046.png)

After that, select the following override properties:

* Fields with name: **Temperature**
* Axis placement: **Right**
* Standard options > Unit: Energy / **Watt (W)**

![](/img/image047.png)

When completed, the panel displays the two Y-axis:

![](/img/image048.png)

You can then click on **Save,** then **Apply** buttons to return to the Grafana dashboard. An additional panel to monitor the temperature and power consumption of a frame is displayed.

![](/img/image049.png)

Next, you can add as many panels as you have resources defined in your PowerShell scripts.

This concludes this blog post. We hope you find it useful and should you have any feedback, please send me a message.