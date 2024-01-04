---
title: Open Source Monitoring at the HPE Customer Technology Center Böblingen
date: 2024-01-02T15:34:10.449Z
author: "Thomas Beha "
authorimage: /img/tb10092023.jpg
thumbnailimage: /img/ctcracktemppower.small.png
disable: false
tags:
  - ILO
  - Redfish
  - Prometheus
  - Grafana
  - ilo-restful-api
---
# The Challenge

T﻿he HPE Customer Technology Center (CTC ) Böblingen is a customer visit center in Germany where a wide range of HPE solutions are demonstrated. The core infrastructure of the CTC, based on HPE SimpliVity, is monitored (perfomance, capacity and uptime) already for some time using Prometheus and Grafana. The implementation of the SimpliVity Prometheus connector was described in the [HPE SimpliVity Prometheus connector whitepaper.](https://www.hpe.com/psnow/doc/a50000514enw)  This monitoring environment was extended over time with the [HPE array exporter](https://github.com/hpe-storage/array-exporter) for HPE storage arrays (HPE Alletra 6000, HPE Alletra 9000 and HPE Alletra MP).

In the last summers we did face the challenge, that the initially planned cooling capacity was not sufficient anymore for the new generations of server and storage that we need to deploy in the CTC. As a consequence the lab temperature was rising to a level, that caused several incidents, where HPE ProLiant servers were automatically shutting down to avoid damages. In order to avoid this situation we were looking for a CTC lab temperature warning system that is easy to implement. An heads up of the rising temperature in the CTC would allow us to shutdown equipment that is currently not urgently needed for customer demos - helping us to ensure that the booked customer demos could still run.

# Redfish® iLO RESTful API as a solution?

Each HPE ProLiant server has a lot of temperature sensors spread across the system board, CPU, memory and power supplies. This detailed temperature data is available and visualized on each ILO interface in the Power&Thermal section:

![](/img/ilotemperature.png "ILO Temperature Information")

The first sensor, 01-Inlet Ambient temperature, is measuring the inlet temperature at the front of the server and can be used as an indicator of the CTC temperature.  Now that I have identified a usable data point an automated reading of the temperature values is needed. Having used the SimpliVity REST API to build the SimpliVity-Prometheus connector, that is used to monitor the core infrastructure, it was a natural step for me to look into the [Redfish® iLO RESTful API](https://developer.hpe.com/platform/ilo-restful-api/home/). The Redfish® API ecosystem is an open industry-standard specification (published by the Distributed Management Task Force [DTMF](http://www.dmtf.org/standards/redfish)) and provides remote server provisioning, inventory and monitoring.

A directory of the available Redfish® resources at an interface can be retrieved with the following RESTful API command: 

\`GET {{baseUrl}}/redfish/v1/resourcedirectory\`

I used [Postman](https://www.postman.com/) as an developer tool to retrieve and search the resource directory. The above RESTful API comand was used in Postman with a basic username/password authorization at one of the ILOs in the CTC, where the baseUrl is defined as <https://iloIPaddress>. I searched in the obtained resource directory for "thermal" in order to find the correct command to retrieve thermal data:

![](/img/redfishresourcedirectory.png "Redfish resource directory (Postman output)")

Hence, I can retrieve thermal server data with the following RESTful command:

\`GET /redfish/v1/chassis/1/thermal\`

And using this Get command with Postman confirmed that I do get the values of all temperature sensors of the server:

![](/img/redfishtemparture.png "ILO Redfish thermal information (Postman output)")

# Building the HPE Server Exporter

Great, now that I do know the RESTful command to retrieve the data I am looking for and I do have a Prometheus-Grafana based monitoring established in the Customer Technology Center, I was only missing a Prometheus exporter for the ILO interfaces and the according Grafana dashboards. Hence I needed to write another Prometheus exporter: one for the ILO interface. I decided to use Python as the programming language for this connector, because I could build on the knowledge gained when I developed the SimpliVity-Prometheus exporter. 

First I had to decide which redfish library I want to use: the [DMTF Redfish Python library](https://github.com/DMTF/python-redfish-library) or the [HPE Python Redfish library](https://github.com/HewlettPackard/python-ilorest-library) - they cannot coexist in a Python environment. I decided to use the DMTF Redfish Python library, since I didn't need the additional features of the HPE Python Redfish library for my use case. The retrieved data can easily made digestible for Prometheus with the prometheus_client Python library. The additional libraries, that I used are mainly for providing the input data in XML-format (etree library) and for the permanent monitoring loop (time, sys and os library) and logging (datetime library). Hence, I needed the following libraries included in my Python script:

```python
from lxml import etree 
import time
from datetime import datetime
from prometheus_client import Counter, Gauge, start_http_server, Info
import sys
import redfish
import os
```

I decided to use one username for all ILOs that I want to add into the monitoring realm. Login with read only access privileges were sufficient for the Prometheus exporter user defined local on the ILOs.

![](/img/ilouser.png "ILO Prometheus user")

Testing the initial Prometheus exporter showed, that I can consolidate multiple server ILOs to single connector while keeping the data collection time below 30 to 60 seconds.  The ILO Prometheus exporter itself has a simple structure - I didn't want to complicate things if not absolutely necessary:

![](data:image/png;base64,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 "ILO Prometheus Connector - Architecture")

First, the exporter is reading the input data, i.e. the ILO ip addresses and the ILO username and password. Next the exporter is retrieving the correct URLs for each monitored server and store it in a Python directory.  Afterwards, the script starts the http server and the corresponding Prometheus counters and gauges. Having completed these preparation steps, the script enters an endless loop that first captures the start time of the current iteration, second retrieves the data from the monitored server, third displays the captured data and waits until the current monitoring intervall is completed. Additionally, I have added that at least once per day the input data and monitor URLs are refreshed. This allowed me to change the list of monitored systems without starting and stopping the script. I just needed to edit the input data file to adjust the list of monitored systems.

## Main routine

As a result, the Python main routine of the ILO Prometheus exporter is as simple as (I removed some of the log commands to improve the readability):

```python
if __name__ == "__main__":
    input = getServerList()    
    # Get the monitoring URLs of the server
    monitor_urls = get_server_urls(input['user'], input['password'], input['server'], input['lfile'])
    # Start the http_server and the counters, gauges
    start_http_server(input['port'])
    c = Counter('ilorest_sample','ILO REST sample number')
    node = Gauge('ilorest_node','ILO Node Data',['nodename','rack','nodemetric','metricdetail'])
    delta = Gauge('ConnectorRuntime','Time required for last data collection in seconds')
    inode = Info('node','Additional Node Info',['node'])
    # Start the endless loop
    while True: 
        t0 = time.time()
        start0 = t0
        c.inc()      
        for server in monitor_urls:
            try:
                server_metrics = get_server_data(input['user'], input['password'], monitor_urls[server], input['lfile'])
                display_results(node, inode, server_metrics, monitor_urls[server])
            except Exception as ex:
                log=logopen(input['lfile'])
                logwriter(log,'Exception')
                logwriter(log,str(ex.__context__))
                logclose(log)
                pass
        t1 = time.time()
        delta.set((t1-t0))
        while ((t1-t0) < input['mintervall']):
            time.sleep(1.0)
            t1 = time.time()   
        # update once per day the input
        if ( t1 - start0 > 86400):
            start0 = t1
            input = getServerList() 
            monitor_urls = get_server_urls(input['user'], input['password'], input['server'], input['lfile'])
```

As you can see, I used four Python functions within the main routine:

* *getServerList*
* *get\_server\_urls*
* *get\_server\_data*
* *display\_results*

The first one - *getServerList* - is just reading the input data out of an XML file. Since this is a pretty standard task in Python I do not want to discuss this function here further. It should be sufficient to know, that it is reading the list of server IPs and additional runtime parameters (username, password, monitoring intervall, …) into a Python directory, that is used in the subsequent parts of the script. I want to focus on the other three functions, that are more specific to the ILO Prometheus exporter.

## g﻿et\_server\_urls

The get\_server_urls routine is using the list of ILO IP addresses to gather the correct URLs out of the Redfish resource directory. If the ILO is alive  a Redfish client object for this ILO is created and the redfish resource directory is read. The client object is stored together with the URLs for the thermal, power and computer system information in the python directory server_urls, which is the return value of the routine.

```python
def get_server_urls( login_account, login_password, server, lfile):

    server_urls={}
    if LINUX:
        cmd='ping -c 2 '
    log=logopen(lfile)
    logwriter(log,'get_server_urls')
    for s in server:
        ilo_url="https://"+s['ilo']
        s["url"]=ilo_url
        if LINUX:
            response=os.system(cmd+s['ilo'])   # works on Linux without root priviliges
        else:
            response = ping(address=s['ilo'],count=1)  # requires root priviliges on Linux
            if(response.is_alive):
                response = 0
            else:
                response = 256
        if (response == 0):        
            try:
                # Create a Redfish client object
                REDFISHOBJ = redfish.redfish_client(base_url=ilo_url, username=login_account, password=login_password)  
                # Login with the Redfish client
                REDFISHOBJ.login()
                s["redfish"]=REDFISHOBJ
                resource_instances = get_resource_directory(REDFISHOBJ, lfile)
                for instance in resource_instances:
                    if '#ComputerSystem.' in instance ['@odata.type']:
                        s["ComputerSystem"]=instance['@odata.id'] 
                    if '#Power.' in instance ['@odata.type']:
                        s["Power"]=instance['@odata.id'] 
                    if '#Thermal.' in instance ['@odata.type']:
                        s["Thermal"]=instance['@odata.id']
                if len(s) > 4:
                    server_urls[s['ilo']]=s
                    logwriter(log,s['ilo']+' completed')
            except Exception as ex:
                logwriter(log,'Exception - get_server_urls: '+s['ilo'])
                logwriter(log,str(ex.__context__))
                if len(s) > 4:
                    server_urls[s['ilo']]=s
                pass
        else:
            logwriter(log,'Exception - ILO is not reachable: '+s['ilo'])
    logclose(log)
    return server_urls
```

## g﻿et_server_data

The get_server_data routine is using the obtained server_urls of one of the monitored server together with the Prometheus user information to retrieve the power and thermal data as well as some general system information data. The captured data is packed into a server_data directory and returned to the main program.

```python
def get_server_data( login_account, login_password, server, lfile):

    server_data={}
    try:
        REDFISHOBJ = server["redfish"]
        # System Data
        server_data['System'] = REDFISHOBJ.get(server["ComputerSystem"]).obj
        # Power Data
        uri = REDFISHOBJ.get(server["Power"]).obj.Oem.Hpe['Links']['PowerMeter']['@odata.id']
        server_data["PowerMeter"] = REDFISHOBJ.get(uri).obj
        # Temperatures
        server_data['Temperatures'] = REDFISHOBJ.get(server["Thermal"]).obj["Temperatures"]
        return server_data;
    
    except Exception as ex:
        sys.stderr.write("ERROR during get_server_date: "+server["url"])
        if ex.status == 401:
            REDFISHOBJ = redfish.redfish_client(base_url=server["url"], username=login_account, password=login_password)
            REDFISHOBJ.login()
            server["redfish"] = REDFISHOBJ
        log=logopen(lfile)
        logwriter(log,'Exception')
        logwriter(log,str(ex.__context__))
        logclose(log)        
        pass
```

## d﻿isplay_results

The display_results routine is taking the server_data retrieved by the get_server_data routine and put it into the corresponding Prometheus node gauges.

```python
def display_results( node, inode, server_metrics, server):
    hostname = (server_metrics['System']['HostName']).split('.')[0].replace('-','_')
    cn = server['ilo']
    inode.labels(cn).info({"Model":server_metrics['System']["Model"],"Manufacturer":server_metrics['System']["Manufacturer"],"SerialNumber":server_metrics['System']["SerialNumber"],"Hostname":hostname})
    node.labels(cn,server['Rack'],'Power','State').set(power_state[server_metrics['System']["PowerState"]]) 
    node.labels(cn,server['Rack'],'Power','Average').set(server_metrics["PowerMeter"]['Average'])           
    node.labels(cn,server['Rack'],'Power','Maximum').set(server_metrics["PowerMeter"]['Maximum'])
    node.labels(cn,server['Rack'],'Power','Minimum').set(server_metrics["PowerMeter"]['Minimum'])
    for temperature in server_metrics['Temperatures']:
        if temperature['Status']['State'] == 'Enabled': 
            node.labels(cn,server['Rack'],'Temperature',temperature["Name"]).set(temperature['ReadingCelsius'])
    return 0
```

The complete most current ILO Prometheus connector (iloPromConnector.v4.3.py at the time of writing this blog) together with a routine (createILOcreadentials.v1.0.py) to generate XML-input file with encrypted user credentials is available on [Github](https://github.com/tbeha/iloPrometheus).

# V﻿isualize the data

The CTC monitor is using Prometheus as a time series database to store and Grafana to visualize the gathered data. Prometheus, Grafana, the  [HPE Storage Array Exporter for Prometheus](https://developer.hpe.com/blog/get-started-with-prometheus-and-grafana-on-docker-with-hpe-storage-array-exporter/) and the [HPE SimpliVity Exporter](https://www.hpe.com/psnow/doc/a50000514enw) are deployed as Kubernetes pods in order to easily scale and adjust the CTC monitoring environment. 

In order to include the CTC power and temperature monitoring into this environment I first needed to containerize the HPE Server Exporter.  I based the container on Ubuntu Linux, added Python and the necessary Python libraries to it and stored the server exporter script in the directory /opt/prometheus:

```dockerfile
# User Ubuntu as the base Image
FROM ubuntu
#
LABEL maintainer="Thomas Beha"
LABEL version="4.3"
LABEL copyright="Thomas Beha, 2023"
LABEL license="GNU General Public License v3"
LABEL DESCRIPTION="CTC ILO Redfish Prometheus Connector Python container based on Ubuntu"
#
RUN apt-get update
RUN apt-get -y install python3.6 && \
	apt-get -y install python3-pip  && \
	apt-get -y install iputils-ping
RUN /usr/bin/pip3 install requests && \
	/usr/bin/pip3 install fernet && \
	/usr/bin/pip3 install cryptography && \
	/usr/bin/pip3 install lxml && \
	/usr/bin/pip3 install redfish && \
	/usr/bin/pip3 install prometheus_client
# copy the necessary python files to the container
RUN mkdir /opt/prometheus
COPY ./iloPromConnector.v4.3.py /opt/prometheus
```

I used this Dockerfile to generate a container image and upload it into my registry. Before I could define the Kubernetes pod based on this container image, I had to decide how to provide the input data to the pod. The current HPE server exporter expects to have the input data available at /opt/prometheus/data. The easiest and most flexible way to provide the input data was to use a Kubernetes config map. This allowed me to use the same container image multiple times, each time with a different config map. The large number of server hosted in the CTC required multiple server exporter, each one with a different list of server to monitor. An example of a config map, that I used is given below:

```yaml
apiVersion: v1 
kind: ConfigMap 
metadata: 
  name: iloprom1-xml 
  namespace: svtprometheus 
data: 
  iloprometheus.key: |- 
    LVkjkV5j40Fl6U0O7ratU0RDf5W1NmAE0oqoQ2DaE74=
  iloprometheus.xml: |- 
    <data> 
      <username>Prometheus</username>
      <user>gAAAAABig6ZJgST83R7v5AFjsOKiYt0bdledJpF3-TnUBR5871eNttG8P-O_eYA55-5NyyZgmmeWRnWy3hPAbUFk18_sWNw==</user>
      <password>gAAAAABig6ZJAZL8wS41b0snZ76VWo17JysUq0-k5NUCU1y5AAPw5p1MphkFcB_u6z0TgcPbmR9yJcX39Cx0Egwv5Lou8A==</password>
      <monitoringintervall>30</monitoringintervall>
      <logfile>iloprometheus.log</logfile>
      <port>9091</port>
      <server> <ILO_ip>10.1.40.5</ILO_ip>,<Rack>i5</Rack>,<Loc>16</Loc> </server>
      <server> <ILO_ip>10.1.40.6</ILO_ip>,<Rack>i5</Rack>,<Loc>14</Loc> </server>  
      <server> <ILO_ip>10.1.40.7</ILO_ip>,<Rack>i5</Rack>,<Loc>19</Loc> </server> 
      <server> <ILO_ip>10.1.40.8</ILO_ip>,<Rack>i5</Rack>,<Loc>18</Loc> </server> 
      <server> <ILO_ip>10.0.44.11</ILO_ip>,<Rack>F12</Rack>,<Loc>24</Loc> </server> 
      <server> <ILO_ip>10.0.44.12</ILO_ip>,<Rack>F12</Rack>,<Loc>22</Loc> </server> 
      <server> <ILO_ip>10.0.44.13</ILO_ip>,<Rack>F12</Rack>,<Loc>20</Loc> </server>     
      <server> <ILO_ip>10.1.24.66</ILO_ip>,<Rack>C5</Rack>,<Loc>30</Loc> </server>     
      <server> <ILO_ip>10.0.43.14</ILO_ip>,<Rack>i12</Rack>,<Loc>9</Loc> </server>
    </data>
```

As you can see the config map contains two data parts: the iloprometheus.key and the iloprometheus.xml section. The first one is storing the encryption key, while the second one is storing user and password encrypted with the encryption key iloprometheus.key, the monitoring intervall, the logfile name and the port used by the exporter together with the server data. I used the rack location in addition to the ILO IP address in order to be able to visualize a rack temperature diagram if needed.

T﻿he config map was stored in a YAML-file (iloprom1.yml) and then applied in my Kubernetes environment:

```
kubectl apply -f iloprom1.yml
```

With the config map in place, I could define the Kubernetes pod for the HPE Server exporter. The pod is using the iloprometheus:v4.3.1 container image, mounting the config map data to the /opt/prometheus/data directory in the container and is starting the Python script /opt/prometheus/iloPromConnector.v4.3.py.

```
cat << 'EOF' | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ilo1
  namespace: svtprometheus
  
  labels:
    app: ilo1
spec:
  selector:
    matchLabels:
      app: ilo1
  template:
    metadata:
      labels:
        app: ilo1
    spec:
      containers:
        - name: ilo1
          image: tb1378/iloprometheus:v4.3.1
          command: ["/usr/bin/python3"]
          args: ["/opt/prometheus/iloPromConnector.v4.3.py"]
          volumeMounts:
            - name: iloprometheusxml
              mountPath: /opt/prometheus/data
      volumes:
        - name: iloprometheusxml
          configMap:
            name: iloprom1-xml   # the correct name of the configmap needs to be added here. 
EOF
```

After checking that the pod is up and running, I still needed to define a Kubernetes service using this pod/app in order to have at the end the exporter data available for Prometheus.

```
cat << 'EOF' | kubectl apply -f -
apiVersion: v1
kind: Service
metadata:
  name: ilo1
  namespace: svtprometheus
#  labels: 
#     hpecp.hpe.com/hpecp-internal-gateway: "true"    
spec:
  selector:
    app: ilo1
  ports:
    - port: 9091               # The Port of that the Prometheus connector uses
      targetPort: 9091
      protocol: TCP
  type: NodePort               # expose the Prometheus connector if you want/need to debug it. 
EOF
```

Next, I updated the Prometheus config map to make sure, that the server exporter data is collected and stored in the Prometheus time series database. Hence, I added a job for the server exporter to the existing job list of the Prometheus config map:

```
    - job_name: 'iloredfish'
      static_configs:
      - targets: ['ilo1:9091','ilo2:9091','ilo3:9091','ilo4:9091','ilo5:9091','ilo6:9091']
      honor_timestamps: true
      scrape_interval: 60s
      scrape_timeout: 20s
      metrics_path: /metrics
      scheme: http
```

As you can see, I actually use six server exporter (ilo1 up to ilo6) in the CTC monitoring environment to cover the complete list of server hosted in the CTC. Having the data collected into the Prometheus timeseries database I defined some Grafana dashboards to visualize the collected data. I don't want to get here into the details of defining Grafana dashboards - this is well documented in the Grafana documentation. I just want to give you an example of a dashboard I use:

![](/img/ctcracktemppower.2.png "CTC Rack Temperature & Power Overview")

# C﻿onclusion

I tried to show my approach on solving a challenge we had in the Customer Technology Center Böblingen by using available API interfaces and building on an existing Kubernetes, Prometheus and Grafana environment. I decided to write this rather long blog in order to give you all necessary steps I did in detail with the goal to show you what can be done with public APIs, a little bit of Python scripting and the use of open source tools like Prometheus and Grafana. I do hope, that this is helpful when you need to develop your own data collectors.

The complete Python script together with sample Grafana dashboards and a Jupyter notebook for the deployment as a Kubernetes service is available at <https://github.com/tbeha/iloPrometheus>.