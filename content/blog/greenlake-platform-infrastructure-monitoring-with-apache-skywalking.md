---
title: GreenLake Platform Infrastructure monitoring with Apache SkyWalking
date: 2022-12-13T08:52:15.545Z
author: Thirukkannan M
authorimage: /img/thirupp_192x192.jpg
thumbnailimage: /img/thirupp_192x192.jpg
disable: false
tags:
  - Infrastructure Monitoring
  - Apache SkyWalking
---
**Overview**

HPE GreenLake Central is an advanced software-as-a-service platform that provides you with a consistent cloud experience for all your applications and data - on-premises or off-premises. It provides you with insights and controls to manage your hybrid IT estate, complementing your use of public clouds and data centers. HPE GreenLake Central gives you the ability to choose where and how to place your workloads and data, and - through the services you purchase - enables you to monitor security, capacity, resource utilization, and costs.

HPE GreenLake for Private Cloud Enterprise is a managed, pay-per-use, Private Cloud as a Service (PCaaS) solution that provides a self-service environment where you can implement a hybrid approach to run different kinds of bare metal, virtual machine, and container workloads. These workloads run from a single site without the need to create dedicated isolated environments and manage the underlying infrastructure, resulting in more flexibility and better ROI with the least operational overhead.

SkyWalking is an open source observability platform used to collect, analyze, aggregate and visualize data from services and cloud native infrastructures. SkyWalking provides an easy way to maintain a clear view of your distributed systems, even across Clouds. It is a modern APM (Application performance Management), specially designed for cloud native, container based distributed systems.

**Monitoring** is tooling or a technical solution that allows teams to watch and understand the state of their systems. Monitoring is based on gathering predefined sets of metrics or logs.

**Observability** is tooling or a technical solution that allows teams to actively debug their system. Observability is based on exploring properties and patterns not defined in advance.

SkyWalking could be used for monitoring and observability. In this blog post we would focus on how we could setup monitoring of infrastructure (Virtual Machine and/or Bare metal) instances using popular APM tool like SkyWalking.

**Pre-requisite**

* An active service subscription to HPE GreenLake Private Cloud Enterprise.
* VM and/or Bare metal instances are provisioned for the workloads and we are able to login to console.
* SkyWalking instance has been setup either on premises or in Hyperscalers. Ensure that inbound ingress traffic is allowed on port 11800 for SkyWalking instance.

 **Steps to configure monitoring**

1. Monitoring host metric with node exporter

* Login to the console of machine to be monitored
* Download and run the node exporter

```
wget https://github.com/prometheus/node_exporter/releases/download/v1.4.0-rc.0/node_exporter-1.4.0-rc.0.linux-amd64.tar.gz

tar xvfz node_exporter-1.4.0-rc.0.linux-amd64.tar.gz

rm -rf node_exporter-1.4.0-rc.0.linux-amd64.tar.gz

cd node_exporter-1.4.0-rc.0.linux-amd64

cp node_exporter /usr/sbin

cat<<EOF >nodeexporter.service

[Unit]
Description=Service to start the node_exporter on the node
[Service]
Type=Simple
ExecStart=/usr/sbin/node_exporter
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=%n

[Install]
WantedBy=multi-user.target

EOF


mv nodeexporter.service /etc/systemd/system
systemctl daemon-reload
systemctl enable nodexporter.service
systemctl start nodexporter.service
```

 

*  Check the metrics endpoint shows metrics exported from the infrastructure node

```
curl <http://localhost:9100/metrics>
```

 

![](/img/node_metrics.png "Node Metrics")

2. Setup OTel (OpenTelemetry) collector

OTel provides a set of standardized vendor-agnostic SDKs, APIs, and tools for ingesting, transforming, and sending data to an Observability back-end. We can install OTel collector in the same host which exposes metrics or we can create central VM/Bare metal instance to receive telemetry information from several infrastructure instances.

* Install OTel collector

```
sudo wget <https://github.com/open-telemetry/opentelemetry-collector-releases/releases/download/v0.54.0/otelcol_0.54.0_linux_amd64.deb>

sudo dpkg -i otelcol_0.54.0_linux_amd64.deb

systemctl status otelcol
```

 

**Note:** By default, the otelcol systemd service will be started with the --config=/etc/otelcol/config.yaml option after installation.

* Create a new otel configuration file (say /etc/otelcol/otel-collector-config.yaml) to link the metrics from host nodes to SkyWalking oap. The orange box in below images must be modified to point to correct infrastructure hosts and SkyWalking DNS or IP address.

  

![](/img/otel_collector_configuration.png "OTeL Configuration")

* Change OTel configuration to newly created OTel configuration file

```
cd /etc/otelcol

sudo nano otelcol.conf

#change the path to new configuration file we created in the above step and save


sudo systemctl restart otelcol

sudo journalctl -u otelcol
```



3. Validate the infrastructure host metrics are seen in the SkyWalking UI 

![](/img/skywalking_vm_monitoring.png "SkyWalking UI with Infrastructure details")

**Conclusion**

SkyWalking in a popular APM tool used for monitoring and observability of customer workloads. This blog focused on how we could do, infrastructure host monitoring using OpenTelemetry and SkyWalking. There are other blogs which gives insight into how could use it for application level monitoring for distributed microservices based workload. Infrastructure and application level monitoring gives holistic picture of service reliability.

 

**Reference**

\[Apache SkyWalking](https://skywalking.apache.org/docs/main/v9.3.0/en/concepts-and-designs/overview/)

\[Monitoring and observability](<https://cloud.google.com/architecture/devops/devops-measurement-monitoring-and-observability>

\[Prometheus Node exporter](<https://prometheus.io/docs/guides/node-exporter/>

\[OpenTelemetry](<https://opentelemetry.io/>