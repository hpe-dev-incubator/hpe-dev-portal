---
title: Elaborate the Monitoring of KVM-based Private Clouds Using Open Source Tools such as Nagios
date: 2019-05-29T21:28:19.523Z
author: Denis Choukroun  
tags: []
path: elaborate-the-monitoring-of-kvm-based-private-clouds-using-open-source-t
---
Today, many cloud service providers offer OpenStack-based private cloud management solutions that can be delivered as a Software-as-a-Service (SaaS). In SaaS delivery models for OpenStack-based private clouds, there are two main parts: the OpenStack control plane and the node components. The control plane is generally hosted in the cloud and managed, maintained, and operated by the cloud service provider. The compute, network, and storage resources of the private cloud platforms, however, remain on-premises where customers can maintain greater control and security. The OpenStack control plane REST API endpoint is the only control plane component accessible to customers. Host agents are typically installed on compute servers in the data center to connect the customer’s on-premises compute servers to the hosted control plane through a secure communication channel.

While the OpenStack-based control plane is hosted and managed by the cloud service provider, IT professionals continue to report they need guidance about the on-premises components. They want more guidance around what they should monitor with their open source monitoring software, so they know when there is a problem that affects their OpenStack-based private cloud environment.

In this blog, you will learn how to extend your ability to monitor KVM-based private clouds using the enterprise open source monitoring platform Nagios with NRPE (Nagios Remote Plugin Executor) add-on.



## About Nagios – the open source monitoring software

Nagios is an open source enterprise monitoring platform that allows you to monitor systems, networks and infrastructure with alerting services for servers, switches, applications and services.

Installation and configuration of Nagios core and NRPE add-on are beyond the scope of this article.  More information about Nagios can be found [here](https://www.nagios.org/) and a Nagios core installation and configuration guide can be found [here:](https://assets.nagios.com/downloads/nagioscore/docs/nagioscore/4/en/)

Step-by-step instructions to install Nagios Core server, NRPE add-on and NRPE daemon on Linux-based (CentOS7 and Ubuntu) are available here:

[CentsOS7](https://www.digitalocean.com/community/tutorials/how-to-install-nagios-4-and-monitor-your-servers-on-centos-7)

[Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-nagios-4-and-monitor-your-servers-on-ubuntu-14-04#monitor-an-ubuntu-host-with-nrpe)

<br/>

## Services and resources to check for a KVM-based private cloud platform:

* Compute servers general health monitoring
    * Reachability of KVM compute servers from Nagios monitoring server 
   * Health of KVM compute servers (CPU load, processes, storage, memory)
   * NTP clock on KVM compute servers
   * Reachability of proxy server from KVM compute servers (if a proxy server is used to reach the Internet)
   * DNS hostname resolution for OpenStack control plane API  endpoint from KVM compute servers
* OpenStack control plane REST API endpoint status
   * Check status of OpenStack Control plane REST API endpoint
* Secure channel communication between on-premises private cloud platform and hosted control plane
    * Check for error on host agent logs 
    * Check for error on secure communication agent logs
* OpenStack services
    * Check for OpenStack compute services (Nova services)
    * Check for Networking agent services (Neutron services)
    * Check for block storage volumes services (Cinder services)
    * Check for image services (Glance services)
* OpenStack Virtual Machine instance status on private cloud
     * Check Virtual Machine instance status for private cloud 

<br/>

## What does it take to implement this monitoring solution?

* A Nagios core server (the monitoring server) with access to the private cloud compute servers
* Installation of Nagios NRPE add-on on Nagios core server
* Installation of Nagios NRPE daemon on each compute server (the monitored host)
* Installation of NRPE ‘standard’ plugins on each compute server
* A Linux-based workstation with OpenStack command line interface (CLI) installed
* Development and testing of custom Nagios check plugins
* Installation and configuration of custom check plugins on each compute server
* Configuration of ‘servers’ and ‘service’ definitions on Nagios server (monitoring server) for monitoring the resources and services on remote compute servers

<br/>

## Private cloud platform health monitoring with Nagios core and NRPE add-on

Figure 1 and Figure 2 show Nagios Core-based monitoring with NRPE add-on for a KVM-based private cloud services and resources, as well as OpenStack services (nova, neutron, glance, cinder, VM instances status) monitored from a Linux workstation with OpenStack CLI installed: 



![5bf2e1a0cd93d0796238ae01-blog-content-1559166146679](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/5/picture-1559166146677.png)


*Figure 1 – Health monitoring of a compute server*


![5bf2e1a0cd93d0796238ae01-blog-content-1559166225374](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/5/picture11-1559166225373.png)

*Figure 2 – Health monitoring of OpenStack control plane services*In this scenario, standard Nagios NRPE check plugins are used to monitor compute server health (processes, CPU load, storage disk space, reachability, NTP time, DNS resolution). HPE DEV developed a few simple bash scripts and leveraged several others from existing sample codes available in GitHub to create custom checks (also known as plugins). These custom checks are used to monitor the status of the OpenStack services such as Nova, Cinder, Glance, Neutron, and the OpenStack control plane REST API endpoint. They are also used to verify the secure communication channel between the on-premises compute servers and the control plane hosted in the cloud.



## Some of the custom checks are shown here:
__Custom check to monitor the OpenStack control plane endpoint status__

Here is a custom NRPE plugin developed to check status of the OpenStack control plane REST API endpoint:


```bash
#!/bin/bash
#
#Custom Nagios nrpe plugin
#This plugin checks OpenStack control plane REST API endpoint
#status
#

URL="https://< OpenStack-control-plane-endpoint-URL>/rest/status"
proxysrv="http://<proxy-server>:<port>"

status=$(curl -k -x $proxysrv -H "accept: application/json" -X GET $URL | jq -r ".service")

if [ "$status" != "OK" ]; then
echo "CRITICAL - OpenStack control plane API endpoint is not responding - $status"
  	exit 2
else
  	echo "OK- OpenStack control plane API is $status"
  	exit 0
fi
```

<br/>

__Custom check to monitor for error in host agent logs__

Here is a custom NRPE plugin developed to check for a host agent error running on the compute server:


```bash
#!/bin/bash
#
#custom Nagios nrpe plugin
#This plugin checks hostagent log for errors
#

output=`tail -1 /var/log/hostagent.log | grep -i 'error\|failed'`

if [ -z "$output" ]; then
  echo "OK- No error or failure in hostagent.log"
  exit 0
else
  echo "CRITICAL- $output"
  exit 2
fi
```

<br/>

__Custom check (obtained from GitHub) to monitor OpenStack Nova compute services:__

Here is a custom NRPE plugin obtained from GitHub to check for the OpenStack Nova compute services status. Very similar custom checks are used to monitor other OpenStack services such as Cinder, Neutron, and Glance.


```bash
#!/bin/bash
#source: https://github.com/taha-bindas/openstack_nagios
#
#Custom Nagios nrpe plugin for openstack
#This plugin checks nova services if they are enable and up or not
#

export http_proxy=http://<proxy-server>:<port>
export https_proxy=http://<proxy-server>:<port>
#
export OS_AUTH_URL=https://<OpenStack-control-plane-endpoint> /keystone/v3
export OS_IDENTITY_API_VERSION=3
export OS_REGION_NAME="<region-Name>"
export OS_USERNAME="<admin-username>"
export OS_PASSWORD="<admin-password>"
export OS_PROJECT_NAME="<Tenant-Name>"
export OS_PROJECT_DOMAIN_ID=${OS_PROJECT_DOMAIN_ID:-"default"}
export OS_USER_DOMAIN_ID=default

EXIT="GOOD"

CMD=$(openstack compute service list | egrep -v "+----|Binary" | awk -F'|' '{print $2,$3,$4,$5,$6,$7,$8}')
while read ID BINARY HOST ZONE STATUS STATE REASON
do
        if [ "$STATE" != "up" ]
        then
                EXIT="BAD"
                echo "$BINARY on $HOST is $STATE, reason: $REASON"
                continue
        fi
done < <(echo "$CMD")
        if [ "$EXIT" == "BAD" ]
        then
echo "CRITICAL - not all nova services are up and running: $CMD"
                exit 2
        else
                echo "OK - all nova services are up and running"
        		exit 0
        fi
```

<br/>

__Custom check (obtained from GitHub) to monitor OpenStack Virtual Machine instance status:__

Here is a custom NRPE plugin obtained from GitHub to check for OpenStack Virtual Machine instances status for all tenants.


```bash 
#!/bin/bash
#Created by: Taha Ali (tahazohair@gmail.com)
#Created Date: 4/11/2014
#https://github.com/taha-bindas/openstack_nagios
#
#Nagios nrpe plugin for openstack
#This plugin checks each openstack vm if they are showing
#active or not for a given Project/Tenant
#
export http_proxy=http://<proxy-server>:<port>
export https_proxy=http://<proxy-server>:<port>  
#
export OS_AUTH_URL=https://<OpenStack-control-plane-endpoint> /keystone/v3
export OS_IDENTITY_API_VERSION=3
export OS_REGION_NAME="<region-Name>"
export OS_USERNAME="<admin-username>"    
export OS_PASSWORD="<admin-password>"    
export OS_PROJECT_NAME="<Tenant-Name>"    
export OS_PROJECT_DOMAIN_ID=${OS_PROJECT_DOMAIN_ID:-"default"}
export OS_USER_DOMAIN_ID=default

#set -x.     

CMD=$(openstack server list --all-projects | egrep -v "+---------|ID" | awk -F'|' '{print $3,$4,$5}')
echo "$CMD" | while read VM STATUS NETWORK
do
 case $STATUS in
   ERROR)
echo "CRITICAL -  $VM is currently in $STATUS state"
exit 2
;;
   SUSPENDED)
echo "CRITICAL -  $VM is currently in $STATUS state"
exit 2
;;
   PAUSED)
echo "WARNING -  $VM  is currently in $STATUS state"
exit 1
;;
 esac
done
echo "OK - all vm's are in OK state"
exit 0
```
I hope this article helped you determine how to monitor the health of a KVM-based private cloud compute layer including the service availability in the managed OpenStack control plane portion of the service delivered via SaaS. For more tutorials like this, continue to monitor [hpedev.io.](https://developer.hpe.com/) Consider [subscribing to our newsletter](https://developer.hpe.com/newsletter-signup) which highlights our latest posts.