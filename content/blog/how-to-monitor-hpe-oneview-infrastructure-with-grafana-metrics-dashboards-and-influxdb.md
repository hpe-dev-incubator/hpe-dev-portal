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

![](RackMultipart20221012-1-156y8v_html_52139c5465cfde75.png)

# HPE OneView metric resources

Multiple metrics resources are supported by HPE OneView through the API: CPU, memory, power consumption, temperature, health, capacity data for some resources like Enclosures, Interconnects and Server hardware. Network statistics and network throughput are also available for each uplink and downlink ports in "interconnects" such as Virtual Connect modules.

**Note** : HPE OneView Metrics are enabled by default.
 For Virtual Connect network statistics, the Utilization Sampling settings defined in the Logical Interconnect Group controls the data collection rate and sample interval value. By default, the HPE Virtual Connect Module sampling rate is 12 samples per hour, as depicted in the following figure:

 ![](RackMultipart20221012-1-156y8v_html_bc827712ce93a781.png)

# InfluxDB Time-series database

The decision to use InfluxDB was made for several reasons: first, InfluxDB can be installed on Windows and Linux, it is an open-source tool, and there are PowerShell modules to interact with. You should know that there are many other options like the Prometheus application which also allows to record real-time metrics in a time-series database. To collect OneView metrics, we use a PowerShell script. This script collects utilization statistics of defined resources from the HPE OneView API periodically and continually transmits the metricsto InfluxDB via the REST API. The timestamped metrics data is saved into the InfluxDB time series database that Grafana uses to generate the graphs.

The script is an independent process that must run continuously.

The following diagram describes the different components of the solution:

![](RackMultipart20221012-1-156y8v_html_3acb334711d27c16.png)

## Pros and Cons about this solution

Pros:

- Enables time-series graphs for the HPE OneView Server hardware utilization statistics and HPE Virtual Connect modules utilization statistics.

- Supports collecting metrics from any API (simply requires the appropriate PowerShell script for the collection)
- Provides a flexible solution using widely used and cross-platform scripting language.
- Cross-platform support, all components can be installed on Windows or Linux.

Cons:

- Requires development of PowerShell scripts if the examples provided do not meet your needs.
- Requires in-depth knowledge of the language, API, authentication, and methods.

# HPE Oneview resource metrics list
HPE Oneview supports many resource metrics that can be retrieved using a collector script:

**Server hardware Metrics:**  
Ambient Temperature: /rest/server-hardware/{id}/utilization?fields=AmbientTemperature  
 Average Power: /rest/server-hardware/{id}/utilization?fields=AveragePower  
 Cpu Average Frequency: /rest/server-hardware/{id}/utilization?fields=CpuAverageFreq  
 Cpu Utilization: /rest/server-hardware/{id}/utilization?fields=CpuUtilization  
 Peak Power: /rest/server-hardware/{id}/utilization?fields=PeakPower  
 Power Cap: /rest/server-hardware/{id}/utilization?fields=PowerCap  

**Enclosures Metrics:**  
Ambient Temperature: /rest/enclosures/{id}/utilization?fields=AmbientTemperature  
Average Power: /rest/enclosures/{id}/utilization?fields= AveragePower  
Peak Power: /rest/enclosures/{id}/utilization?fields=PeakPower  
Ambient Temperature: /rest/enclosures/{id}/utilizationfields=AmbientTemperature  

**Interconnect Metrics:**  
Statistics for the specified port name on an interconnect: /rest/interconnects/{id}/statistics/portname  
Interconnect cpu and memory utilization data: /rest/interconnects/{id}/utilization/  



# Configuration

## Prerequisites

- Grafana and InfluxDB must be installed, started, and enabled
- A firewall rule must be created to allow TCP port 8086 (used by InfluxDB API, by default)
- PowerShell Core for Linux must be installed if a Linux server is used to run the PowerShell scripts
- HPE OneView PowerShell library 6.60 or later must be used.

## Configure InfluxDB http Authentication

By default, all security features are disabled in InfluxDB, so it is recommended to set up authentication by creating an **admin** user.

To launch the influx command line interface (CLI), type:  
_influx_  
Then create a user with an authentication password:  
_CREATE USER admin WITH PASSWORD 'P@ssw0rd' WITH ALL PRIVILEGES_

Once created, authenticate using:  
_auth_  
username:_admin_  
password:_\*\*\*\*\*\*\*\*_  

To enable the http authentication, you need to modify the InfluxDB configuration file. Go to the **[http]** section of **/etc/influxdb/influxdb.conf** and change the **auth-enabled** value to **true.**

_[http]_  
_auth-enabled = true_

Once modified, restart the InfluxDB service:  
_sudo systemctl restart influxdb_

## PowerShell Scripts for HPE OneView metrics collection

PowerShell scripts which allow collecting metrics from the HPE OneView API can be found at [https://github.com/jullienl/HPE-Synergy-OneView-demos/tree/master/Powershell/Grafana%20Metrics](https://github.com/jullienl/HPE-Synergy-OneView-demos/tree/master/Powershell/Grafana%20Metrics)

Two distinct scripts are available, one for the interconnect metrics and one for Compute, enclosure, and server profile metrics.

![](RackMultipart20221012-1-156y8v_html_57b576955ea2c2e4.png)

For each script, it is important to provide all the required variables for HPE OneView and InfluxDB.

![](RackMultipart20221012-1-156y8v_html_5b1f431862921454.png)

For _Grafana-Interconnect-monitoring.ps1_, at the beginning of the script you need to provide the interconnect module names and port IDs that you would like to monitor using a hash table format:

![](RackMultipart20221012-1-156y8v_html_5b1f431862921454.png)

Note that the interconnect modules and port names can be found in the HPE OneView UI (in the Interconnects menu):

![](RackMultipart20221012-1-156y8v_html_72feff01f2a8d2c9.png)

For _Grafana-Server\_Enclosure-monitoring.ps1_, you need to provide at the beginning of the script, the resource names (Server hardware or Server profile or Enclosure) and utilization (CPU, Power, or Temperature) that you want to monitor using a hash table format:

![](RackMultipart20221012-1-156y8v_html_87d5953059589ae1.png)

The names of the resources that need to be provided can be easily identified in the corresponding menus of the OneView user interface.

These scripts are written to collect metrics continually. They can be run in background on a Linux system using a crontab configuration or on a Windows one, usingTask Scheduler.

### How to run the scripts on a Windows machine?

The following commands can be used to schedule both jobs on a Windows machine:

_$trigger = New-JobTrigger -AtStartup -RandomDelay 00:00:30_

_Register-ScheduledJob -Trigger $trigger -FilePath "\<path to file\>\ Grafana-Server\_Enclosure-monitoring.ps1" -Name GrafanaServerEnclosureMonitoring_

_Register-ScheduledJob -Trigger $trigger -FilePath "\<path to file\>\Grafana-Interconnect-monitoring.ps1" -Name GrafanaInterconnectMonitoring_

You can check the job schedule by typing:

_\> Get-ScheduledJob_

![](RackMultipart20221012-1-156y8v_html_a4b83ac307245700.png)

Alternatively, launch Windows Task Scheduler, by pressing Windows + R keys on your keyboard to Run a command, and enter:

_\> taskschd.msc_

![](RackMultipart20221012-1-156y8v_html_b9d188f563cfa77f.png)

As we are using an "at startup" trigger, it is required to restart the server in order to run the scripts.

Restart the server and confirm that scripts are executed. Once restarted, you can run on a Windows machine:

_\> Get-job_

![](RackMultipart20221012-1-156y8v_html_d67dfb7219241448.png)

### How to run the scripts on a Linux machine?

PowerShell can be installed on different Linux distributions today and it works perfectly, using a crontab configuration would make the scripts run in background. This allows using only one Linux machine to host all components (i.e., Grafana, InfluxDB and the execution of the PowerShell scripts).

To learn more, you can refer to [https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-linux?view=powershell-7.2](https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-linux?view=powershell-7.2).

The Linux repositories proposed by Microsoft can be found at the following address: [https://packages.microsoft.com/config/](https://packages.microsoft.com/config/)

![](RackMultipart20221012-1-156y8v_html_2726cd177f3dea5a.png)

On a RHEL/CentOS virtual machine, you can use the following steps:

- Add the Microsoft package repository:  
_curl https://packages.microsoft.com/config/centos/8/prod.repo | sudo tee /etc/yum.repos.d/microsoft.repo_
- Run the PowerShell installation:  
_yum install powershell_
- Copy the script files to the Linux system and set the execution permission on both files:  
_chmod +x Grafana-Interconnect-monitoring.ps1_  
_chmod +x Grafana-Server\_Enclosure-monitoring.ps1_
- Open the crontab configuration:  
_crontab -e_
- Add two configurations, one for each script with a startup execution after a sleep time:  
_@reboot sleep 30 && pwsh -File "/\<path\>/Grafana-Interconnect-monitoring.ps1"_  
_@reboot sleep 30 && pwsh -File "/\<path\>/Grafana-Server\_Enclosure-monitoring.ps1"_
- Restart the Linux machine to trigger the execution:  
_shutdown -r now_

**How to ensure that the scripts have started successfully?**

First, to make sure that the scripts have started, you can check that the databases have been created using the InfluxDB tool.

Connect to the server running InfluxDB and _launch the InfluxDB CLI_:  
_influx_  
 Authenticate using your InfluxDB credentials:  
_auth_  
 Display existing databases:  
_show databases_  

If both databases defined in the script are listed, then both scripts have started successfully:

 ![](RackMultipart20221012-1-156y8v_html_6c428756679a2d4e.png)

To verify that metrics are collected successfully enter "use \<database name\>", where \<database name\> is the name of your database, then show measurements as shown below:  
_use \<database name\>_.  
_show measurements_

![](RackMultipart20221012-1-156y8v_html_c715fb17315e616e.png)

The measurements listed here correspond to the metrics (ports or resources) defined in the PowerShell scripts.

Open one of the measurements to verify that the metric data is coming in:  
_SELECT \* FROM "Frame3-Interconnect3-Q1"_

![](RackMultipart20221012-1-156y8v_html_db00f17d7914a20f.png)

The data shows that the collection of metrics has started and that everything is running fine.

## Adding InfluxDB data sources in Grafana

Now that InfluxDB is configured and the data is collected, we can add the databases (created by the two scripts) to Grafana as new InfluxDB data sources.

Once that is completed, any dashboard we create in Grafana will have access to the metric data collected..

To launch the Grafana IU, open your web browser and navigate to **http://\<grafana\_IP or DNS name\>:3000/**

**Note** : The default HTTP port that Grafana listens to is 3000 unless you have configured a different port.

Click on the gear icon on the side menu and click **Add data Sources**.

![](RackMultipart20221012-1-156y8v_html_db8c6b46335d52ef.png)

Select **InfluxDB** from the data source list.

![](RackMultipart20221012-1-156y8v_html_4817574e86a7ed8d.png)

For Server and Enclosure metrics, enter a data source name, e.g., **InfluxDB-OV-Server-Metrics**

Add the InfluxDB URL; by default it is [**http://localhost:8086**](http://localhost:8086/)

Add the database name that you defined in _Grafana-Server\_Enclosure-monitoring.ps1_

  ![](RackMultipart20221012-1-156y8v_html_2f7efd274e7df7f3.png)

Provide the InfluxDB admin username and password.

 ![](RackMultipart20221012-1-156y8v_html_6fd34d65b2eb3096.png)

Once completed, click on the **Save & Test** button.

If no error is returned, a "Data source is working" message is displayed.

![](RackMultipart20221012-1-156y8v_html_dc81df45f39b36ad.png)

Now repeat the same Add data source procedure for the Interconnect metrics, using this time the data source name **InfluxDB-OV-Interconnect-Metrics**

![](RackMultipart20221012-1-156y8v_html_c1e03aca1232bb42.png)

Again, using the database name you defined in _Grafana-Interconnect-monitoring.ps1_

![](RackMultipart20221012-1-156y8v_html_2c62f693422c45e.png)

![](RackMultipart20221012-1-156y8v_html_3ab27265d7fc38ae.png)

Once this is done, click on the **Save & Test** button and make sure the data source is working.

You can then click on the **Back** button to return to the Data sources configuration window.

We should now have two new Grafana data sources corresponding to the two InfluxDB databases generated by the two PowerShell scripts.

![](RackMultipart20221012-1-156y8v_html_e12023edb884ca81.png) ![](RackMultipart20221012-1-156y8v_html_e12023edb884ca81.png)

This completes the configuration of the Grafana data source.

We are now ready to access our InfluxDB time series databases in Grafana.

## Creating the Grafana dashboard

A Grafana dashboard can aggregate one or more panels using multiple sources. Thus, we can create a single dashboard with Server\_Enclosure and Interconnect metrics panels.

Click on the Dashboards icon on the side menu and click **New dashboard.**

![](RackMultipart20221012-1-156y8v_html_bd9228596083e8c2.png)

Click on **Add a new panel** to create a panel to visualize the first Virtual Connect module metrics.

In Data source, select **Influxdb-OV-Interconnect-Metrics**

![](RackMultipart20221012-1-156y8v_html_67e1b9cc1a185e52.png)

For Query options, it is recommended to set **5m** as the minimum query interval to match the OneView API metrics sampling value of the interconnect interfaces (see below).

![](RackMultipart20221012-1-156y8v_html_cf71712bfe428e41.png)

Then, you need to define a query for each port you specified in the PowerShell script (in the $Ports variable) for this interconnect module name, as shown below:

![](RackMultipart20221012-1-156y8v_html_b115aab6d2d42b18.png)

For example, to set the Q1 port, you need to click on **select measurement** next to **FROM** :

![](RackMultipart20221012-1-156y8v_html_226b24a25a52fc16.png)

A list of all the measurements available in the database is displayed in the drop-down menu, as seen below:

![](RackMultipart20221012-1-156y8v_html_82083fc23ea15670.png)

Select **Q1,** then click on **field (value)** in the **SELECT** row to select the value you want to display:

![](RackMultipart20221012-1-156y8v_html_3bfd36e9f2e5750d.png)

A list of all measurement values recorded in the database displays in the drop-down menu:

![](RackMultipart20221012-1-156y8v_html_531f182ede50339.png)

Select **receiveKilobytesPerSec** for example.

You can then set the alias as **Q1** to replace the default metric name and get a clear legend label on the chart.

![](RackMultipart20221012-1-156y8v_html_6bcd5d4543394237.png)

![](RackMultipart20221012-1-156y8v_html_5aae019669606196.png)

The metric points should already appear on the graph.

Further, you can specify a panel title in the right-side menu using the interconnect name you selected, like **VC Frame3-Interconnect3** (in our example).

![](RackMultipart20221012-1-156y8v_html_75136d74a5d9b73.png)

And for a better visualization, you can select **Always** for **Connect null values** and **Never** for **Show points** in the Graph styles section.

![](RackMultipart20221012-1-156y8v_html_ab41ffa3887ee785.png)

And finally, set the unit data rate you selected in the SELECT row. Scroll down to the **Standard options** section and in **Unit** , select **Data rate** and click on **kilobytes/sec**.

![](RackMultipart20221012-1-156y8v_html_303dbedc865ecb42.png)Rendering should occur as follows:

![](RackMultipart20221012-1-156y8v_html_cabff2e0f3c82e09.png)

This completes the configuration of the first port query.

You will need to click on the **+ Query** button for the other ports and repeat the same query configuration (as previously described) for all the ports defined in the PowerShell script.

![](RackMultipart20221012-1-156y8v_html_1b46a8efd19fd865.png)

![](RackMultipart20221012-1-156y8v_html_fe2e48e0b40ef678.png)

Once all queries have been defined, you can save the panel using the **Save** button in the upper right corner. Type a name for the newly created dashboard like **HPE OneView Metrics**.

![](RackMultipart20221012-1-156y8v_html_2a0e5beb1ccbb14e.png)

We can now duplicate this panel to create another one for the second Virtual Connect module. Click on the panel's context menu, select **More** , then **Duplicate**.

Click on the duplicated panel's context menu then select **Edit**.

Change the panel title with the name of your second Virtua Connect module like **VC Frame3-Interconnect6 Metrics**

Then modify each query by selecting the ports on the second interconnect module that you want to monitor.

![](RackMultipart20221012-1-156y8v_html_53547ad615b4ebb3.png)

Click **Save** then **Apply**.

The dashboard now displays two panels, one for each Virtual Connect module that was defined in _Grafana Interconnect monitoring.ps1_

![](RackMultipart20221012-1-156y8v_html_effdc3d5138055bc.png)

The next step consists in creating panels to display Compute and frame metrics.

Click on the **Add panel** button on the upper bar and select **Add a new panel**.

Select the **InfluxDB-OV-Server-Metrics** data source, then select the resource you want to monitor.

![](RackMultipart20221012-1-156y8v_html_6b2228eba9463ae.png)

Select the measure you need:

![](RackMultipart20221012-1-156y8v_html_d7dea6b4296a6c7b.png)

Then:

- Add a panel title
- Use 5m for the Min interval query options
- Select the graph styles options
  - Connect null values: Always
  - Show points: Never
- Select the correct unit corresponding to the measurement type
  - Power: Energy / Watt
  - Temperature: Temperature / Celsius
  - CPU: simply type GHz
- Add meaningful alias names to reflect reported measurement.

Add any additional measurement you need, using another query.

Here is an example of a frame panel with power and temperature metrics defined:

![](RackMultipart20221012-1-156y8v_html_3eba418a67b927e1.png)

For panels with two different types of measurements (Watt and Celsius) as seen above, we need to define two Y-axes. One for the temperature and one for the power consumption.

Select **Overrides** at the top of the right-side menu, then click on **Add field override** :

![](RackMultipart20221012-1-156y8v_html_7f3ca459ee22ca24.png)

After that, select the following override properties:

- Fields with name: **Temperature**
- Axis placement: **Right**
- Standard options \> Unit: Energy / **Watt (W)**

![](RackMultipart20221012-1-156y8v_html_ea44a4aeedc3a91a.png)

When completed, the panel displays the two Y-axis:

![](RackMultipart20221012-1-156y8v_html_981385626189348e.png)

You can then click on **Save,** then **Apply** buttons to return to the Grafana dashboard. An additional panel to monitor the temperature and power consumption of a frame is displayed.

![](RackMultipart20221012-1-156y8v_html_e4197f6d7e0f0679.png)

Next, you can add as many panels as you have resources defined in your PowerShell scripts.

This concludes this blog post. We hope you find it useful and should you have any feedback, please send me a message.