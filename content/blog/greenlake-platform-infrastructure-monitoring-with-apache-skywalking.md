---
title: HPE GreenLake for Private Cloud Enterprise infrastructure monitoring with
  Apache Skywalking
date: 2022-12-13T08:52:15.545Z
author: Thirukkannan M
authorimage: /img/thirupp_192x192.jpg
thumbnailimage: /img/thirupp_192x192.jpg
disable: false
tags:
  - Infrastructure Monitoring
  - Apache SkyWalking
  - hpe-greenlake
---
# **Overview**

Modern applications are predominantly distributed microservices based, which are flexible to scale and are developed with varying technology stack. These applications are deployed on a highly available infrastructure composed on multitude of compute (baremetal/virtual machine/container). It is imperative to monitor, in near real time, how the compute resources are utilized, so that necessary proactive actions are initiated to keep the applications in consistently acceptable state. APM (Application performance Management) tools helps to centrally monitor distributed applications and/or compute resources.

SkyWalking is a popular open-source application performance monitoring (APM) tool used to collect, analyze, aggregate, and visualize data from services and cloud-native infrastructures. It provides an easy way to maintain a clear view of your distributed systems, even across clouds. You can use it with HPE GreenLake for Private Cloud Enterprise, the managed, pay-per-use Private Cloud as a Service (PCaaS) solution to enhance monitoring and observability of your workloads.

Because HPE GreenLake for Private Cloud Enterprise provides you with a flexible, self-service environment where you can implement a hybrid approach and run different kinds of bare metal, virtual machine, and containerized workloads, you can take advantage of additional apps and tools like SkyWalking to customize your situation and meet your specific needs.

In this post, I will focus on how you can use SkyWalking and Open Telemetry to do infrastructure host monitoring while taking advantage of how HPE GreenLake provides you with a consistent cloud experience across all your applications and data, whether on- or off-premises.

# **L﻿et's get started**

## Definitions

* **Monitoring** is tooling or a technical solution that allows teams to watch and understand the state of their systems. Monitoring is based on gathering predefined sets of metrics or logs.
* **Observability** is tooling or a technical solution that allows teams to actively debug their system. Observability is based on exploring properties and patterns not defined in advance.

## **Pre-requisites**

* An active service subscription to HPE GreenLake Private Cloud Enterprise.
* VM and/or Bare metal instances are provisioned for the workloads and we are able to login to console.
* SkyWalking instance has been setup either on premises or in Hyperscalers. Ensure that inbound ingress traffic is allowed on port 11800 for SkyWalking instance.

## **Steps to configure monitoring**

### Step 1- Monitoring host metric with node exporter

Login to the console of machine to be monitored.

Next, Download and run the node exporter using below code snippet

```shell
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

Check the metrics endpoint shows metrics exported from the infrastructure node.

```shell
curl <http://localhost:9100/metrics>
```

![](/img/node_metrics.png "Node Metrics")

### Step 2- Setup OTel (OpenTelemetry) collector

OTel provides a set of standardized vendor-agnostic SDKs, APIs, and tools for ingesting, transforming, and sending data to an Observability back-end. We can install OTel collector in the same host, which exposes metrics, or we can create central VM/Bare metal instance to receive telemetry information from several infrastructure instances.

Install OTel collector.

```shell
sudo wget <https://github.com/open-telemetry/opentelemetry-collector-releases/releases/download/v0.54.0/otelcol_0.54.0_linux_amd64.deb>

sudo dpkg -i otelcol_0.54.0_linux_amd64.deb

systemctl status otelcol

# By default, the otelcol systemd service will be started with the --config=/etc/otelcol/config.yaml option after installation.
```

Create a new otel configuration file (say /etc/otelcol/otel-collector-config.yaml) to link the metrics from host nodes to SkyWalking oap. The orange box in below images must be modified to point to correct infrastructure hosts and SkyWalking DNS or IP address.

![](/img/otel_collector_configuration.png "OTeL Configuration")

Change OTel configuration to newly created OTel configuration file.

```shell
cd /etc/otelcol

sudo nano otelcol.conf

#change the path to new configuration file we created in the above step and save


sudo systemctl restart otelcol

sudo journalctl -u otelcol
```

### Step 3- Validate the infrastructure host metrics are seen in the SkyWalking UI

![](/img/skywalking_vm_monitoring.png "SkyWalking UI with Infrastructure details")

# **Conclusion**

Infrastructure and application level monitoring gives holistic picturec of service reliability. We have seen, how easily we could perform compute infrastructure resource monitoring, running in on- or off premises, using OpenTelemetry and Skywalking.

# **Reference**

[Apache SkyWalking](https://skywalking.apache.org/docs/main/v9.3.0/en/concepts-and-designs/overview/)

[Monitoring and observability](https://cloud.google.com/architecture/devops/devops-measurement-monitoring-and-observability)﻿

[Prometheus Node exporter](https://prometheus.io/docs/guides/node-exporter/)

[OpenTelemetry](https://opentelemetry.io/)