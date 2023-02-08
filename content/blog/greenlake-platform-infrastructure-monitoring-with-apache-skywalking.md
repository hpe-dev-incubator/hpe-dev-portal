---
title: HPE GreenLake for Private Cloud Enterprise monitoring with Apache
  SkyWalking and OpenTelemetry
date: 2023-01-13T08:52:15.545Z
author: Thirukkannan M
authorimage: /img/thirupp_192x192.jpg
thumbnailimage: /img/thirupp_192x192.jpg
disable: false
tags:
  - Infrastructure Monitoring
  - Apache SkyWalking
  - hpe-greenlake
  - hpe-greenlake-for-private-cloud-enterprise
  - cloud-architect
  - devops
  - sre
  - site-reliability-engineer
---
# **Overview**

Modern applications are predominantly distributed microservices-based applications that are flexible for scalability and developed using varying technology stacks. These applications are deployed on a highly available infrastructure composed of a multitude of compute instances (bare metal/virtual machine/container). It is imperative to monitor, in near real time, how the compute resources are utilized, so that necessary proactive actions are initiated to keep the applications in a consistently acceptable state. Application Performance Management (APM) tools help to centrally monitor distributed applications and/or compute resources.

Apache SkyWalking is a popular, open-source application performance monitoring (APM) tool used to collect, analyze, aggregate, and visualize data from services and cloud-native infrastructures. It provides an easy way to maintain a clear view of your distributed systems, even across clouds. You can use it with HPE GreenLake for Private Cloud Enterprise, the managed, pay-per-use Private Cloud as a Service (PCaaS) solution to enhance monitoring and observability of your workloads.

Because HPE GreenLake for Private Cloud Enterprise provides you with a flexible, self-service environment where you can implement a hybrid approach and run different kinds of bare metal, virtual machine, and containerized workloads, you can take advantage of additional apps and tools like SkyWalking to customize your situation and meet your specific needs.

In this post, I will focus on how you can use SkyWalking and OpenTelemetry or OTel for short, to do infrastructure host monitoring while taking advantage of how HPE GreenLake provides you with a consistent cloud experience across all your applications and data, whether on- or off-premises.

# **L﻿et's get started**

## Definitions

* **Monitoring** is tooling or a technical solution that allows teams to watch and understand the state of their systems. Monitoring is based on gathering predefined sets of metrics or logs.
* **Observability** is tooling or a technical solution that allows teams to actively debug their system. Observability is based on exploring properties and patterns not defined in advance.

## **Pre-requisites**

* An active service subscription to HPE GreenLake Private Cloud Enterprise.
* VM and/or Bare metal instances are provisioned for the workloads and you are able to log in to the console.
* SkyWalking instance has been setup either on premises or in Hyperscalers. Ensure that inbound ingress traffic is allowed on port 11800 for SkyWalking instance.

## **Steps to configure monitoring**

### Step 1- Monitoring host metric with node exporter

Log in to the console of machine to be monitored.

Next, download and run the node exporter using the snippet code below.

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

Check that the metrics endpoint shows metrics exported from the infrastructure node.

```shell
curl <http://localhost:9100/metrics>
```

![](/img/node_metrics.png "Node Metrics")

### Step 2- Setup OpenTelemetry (OTel) collector

OTel provides a set of standardized vendor-agnostic SDKs, APIs, and tools for ingesting, transforming, and sending data to an observability back-end. You can install OTel collector in the same host, which exposes metrics, or we can create central VM/Bare metal instance to receive telemetry information from several infrastructure instances.

Install OTel collector.

```shell
sudo wget <https://github.com/open-telemetry/opentelemetry-collector-releases/releases/download/v0.54.0/otelcol_0.54.0_linux_amd64.deb>

sudo dpkg -i otelcol_0.54.0_linux_amd64.deb

systemctl status otelcol

# By default, the otelcol systemd service will be started with the --config=/etc/otelcol/config.yaml option after installation.
```

Create a new OTel configuration file (say /etc/otelcol/otel-collector-config.yaml) to link the metrics from host nodes to SkyWalking Observability Analysis Platform (OAP). The orange boxes shown in the images below must be modified to point to the correct infrastructure hosts and SkyWalking DNS or IP address.

![](/img/otel_collector_configuration.png "OTeL Configuration")

Change the OTel configuration to the newly created OTel configuration file.

```shell
cd /etc/otelcol

sudo nano otelcol.conf

# Change the path to the new configuration file you just created in the 
# above step and save.

sudo systemctl restart otelcol

sudo journalctl -u otelcol
```

### Step 3- Validate the infrastructure host metrics are seen in the SkyWalking UI

![](/img/skywalking_vm_monitoring.png "SkyWalking UI with Infrastructure details")

# **Conclusion**

Infrastructure and application level monitoring gives a holistic picture of service reliability. In this post, I have shown you how easily you can set up compute infrastructure resource monitoring, running in on- or off-premises, using OpenTelemetry and SkyWalking. CPU, Memory, and Disk usage trends showin in the APM tool give the monitoring team early insights into potential system issues that should be addressed before they impact customer applications. Additionally, APM tools often provide trace, logs, metrics monitoring along with alerting, which can be used in conjunction with infrastructure monitoring tools to provide highly reliable services for customers.

# **Reference**

[Apache SkyWalking](https://skywalking.apache.org/docs/main/v9.3.0/en/concepts-and-designs/overview/)

[Monitoring and observability](https://cloud.google.com/architecture/devops/devops-measurement-monitoring-and-observability)﻿

[Prometheus Node exporter](https://prometheus.io/docs/guides/node-exporter/)

[OpenTelemetry](https://opentelemetry.io/)