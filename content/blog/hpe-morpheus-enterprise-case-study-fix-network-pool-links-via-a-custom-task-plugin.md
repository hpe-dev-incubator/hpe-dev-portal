---
title: "HPE Morpheus Enterprise case study: Fix Network Pool Links via a Custom
  Task Plugin"
date: 2025-12-18T11:45:51.565Z
author: Neil van Rensburg
authorimage: /img/morpheusgreen.png
disable: false
tags:
  - Morpheus
  - API
  - Plugin
---
![]()

In a previous [blog](https://developer.hpe.com/blog/morpheus-plugin-tutorial-how-to-build-and-compile/), we explored the basics around building and compiling HPE Morpheus Enterprise plugins. In this article, we expand on the subject by implementing a minimal Custom Task plugin. The logic will target IP Pools, where links between the host entries and the VM workloads are broken or missing.

## Problem Statement

In a nutshell, we need a way to link a ***NetworkPoolIp*** entry to a ***ComputeServer*** object, where a network interface falls within the same ***Network***/***NetworkPool***.

These reference links exist via the ***refType*** and ***refId*** properties of the ***NetworkPoolIp*** object, as shown below:

![refType and refId relationship](/img/morphblog_linknetworks_reftype_refid_small.png)

Upon provisioning, the ***refType*** property is set to the literal value of 'ComputeServer' and the ***refId*** property is assigned the ***Id*** of the ***ComputeServer*** object itself.

When a ***NetworkPool*** is migrated/changed, or added to the ***Network*** After instance provisioning, ***NetworkPoolIp*** records are created or synchronized from IPAM, without the ***refId*** link populated. This causes orphan host entries when workloads are later deleted.

To reproduce this, we will provision a single VM instance into a simple lab, then add the IP Pool to the related network, afterward.

## Normal Behavior

First, consider the normal day-today use case. We associate our network with the IP pool as shown below:

![Network with IP Pool](/img/morphblog_linknetwork_network_with_pool.png)

Should we provision a VM instance into this network, a host record entry will be created in the IP pool:

![Instance provisioned](/img/morphblog_linknetwork_instance_provisioned.png)

![Host record created](/img/morphblog_linknetwork_host_record.png)

By querying the host record via the REST API, we can see the link back to the ***ComputeServer*** within the instance:

![Host record via REST API](/img/morphblog_linknetwork_api_host_record.png)

## Provision without IP pool

To illustrate the broken reference issue, we start off by removing the network-to-IP-pool association:

![Network without pool](/img/morphblog_linknetwork_network_without_pool.png)

Then provision a VM to the network:

![Provision VM to network](/img/morphblog_linknetwork_provision_vm.png)

![Provisioned VM to network](/img/morphblog_linknetwork_provisioned_vm.png)

Next, we create a host entry manually within the pool:

![New Pool IP](/img/morphblog_linknetworks_manual_host_record.png)

Finally, we add the IP pool back onto the network:

![Network pool re-added onto network](/img/morphblog_linknetwork_network_pool_readded.png)

This time, we can see that the ***refId*** property is NOT populated on the ***ComputeServer***, despite the matching host name on the VM:

![API host record with no link](/img/morphblog_linknetwork_api_host_record_nolink.png)

## Compiling and loading the Custom Task Plugin

Download or clone the plugin repository from <https://github.com/neilvrhpe/link-network-hosts>.
Open the project directory and compile with the relevant ***gradlew*** (Linux) or ***gradlew.bat*** (Windows) script using the ***shadowJar*** argument:

![Compile the plugin jar file](/img/morphblog_linknetworks_compile_jar.png)

The compiled ***.jar*** file will be found in the ***build/libs*** subdirectory:

![Compiled jar file in build/libs subdirectory](/img/morphblog_linknetworks_compiled_jar.png)

Upload the ***.jar*** file to the ***Administration > Integrations > Plugins > Add*** dialog. The plugin should appear in the list as shown below:

![Plugin uploaded and shown in list](/img/morphblog_linknetworks_plugin_uploaded.png)

## Setup the Custom Task Workflow

Uploading the plugin in the previous step introduced a new ***TaskType*** to the HPE Morpheus Enterprise appliance. This can be seen under the edit dialog of the uploaded plugin:

![New task type introduced](/img/morphblog_linknetworks_new_tasktype.png)

To use this new custom task type in the UI, we will provide an ***OptionSource*** input. We create the corresponding ***OptionList*** under ***Library > Options > Option Lists > Add***. The type is ***Plugin*** and the option list will be ***Link Network Hosts: getNetworkPools***, as provided by the plugin that we uploaded in the previous step. Provide 'ChooseNetworkPool' as the name, so that it matches the name in the next step:

![Create option source](/img/morphblog_linknetworks_create_optionsource.png)

Next, we create the ***Input*** that represents the ***OptionList*** entries to the end user dropdown in the UI, This is done using the ***Library > Options > Inputs > Add*** button. We will provide 'networkPool' as the ***Field Name*** for the custom task to reference in the next step. Choose ***Select List*** as the ***Type*** and use ***ChooseNetworkPool*** as the ***Option List*** field value:

![Create the form input for the option source](/img/morphblog_linknetworks_form_input.png)

To set up the task, we navigate to ***Library > Automation > Add***. Provide a task ***Name*** and a ***Network Pool Id*** value of ***<%=customOptions.networkPool%>***. This reference will insert the value from the input we created in the previous step.

![Custom task setup](/img/morphblog_linknetworks_task_setup.png)

### MATCH FULL FQDN

Checking this box will include the full domain name suffixed to the hostname in the match comparison. Unchecked, only the hostname portion is matched. Matching is case insensitive.

### REPLACE EXISTING LINKS

Checking this box will overwrite any existing ***refId*** links when the hostname matches.

Next, we need an ***Operational Workflow*** to run the task with the correct input context (Pool ID). Create the workflow under ***Library > Automation > Add > Operational Workflow***. Provide a name for the workflow, add the ***task from the previous step*** under ***Tasks*** and add the ***ChooseNetworkPool*** input under ***Inputs***.

![Operational workflow setup](/img/morphblog_linknetworks_workflow_setup.png)

## Run the Workflow against the Network Pool

We review the REST API call to confirm that the host record ***refId*** property is not currently set against our ***ComputeServer***:

![Confirm missing refId link to ComputeServer](/img/morphblog_linknetworks_link_ref_missing.png)

Under ***Library > Automation > Workflows***, click the name of the workflow we created in the previous step to view the workflow details:

![View workflow details](/img/morphblog_linknetworks_workflow_details.png)

The ***Execute*** button brings up the workflow execution dialog. Here we select the pool that our test VM is deployed to. The ***Execution Config/Context*** can be ignored, as this task will always run on the local HPE Morpheus Enterprise appliance in its own context:

![Execute the workflow](/img/morphblog_linknetworks_workflow_execute.png)

Under the ***Executions*** tab we can view the output of the task, showing which ***ComputeServer*** objects have been allocated to host records within the pool, via the ***refId*** property:

![Workflow execution results](/img/morphblog_linknetworks_workflow_executed.png)

Re-running the REST API call confirms that the ***refType*** and ***refId*** link was created:

![Reftype and refId link created](/img/morphblog_linknetwork_api_host_record_linked.png)

## Workflow via the API

In large environments it would be impractical to execute the workflow for each IP pool by hand in the UI. For these scenarios, execute the workflow via the REST API. Provide the ***id*** of the ***workflow*** in the request URL and the ***id*** of the IP pool to the ***networkPool*** body parameter to execute the POST request:

![Execute workflow via API](/img/morphblog_linknetwork_execute_via_api.png)

## Next steps

From here, it would make sense to explore the unused possibilities around Custom Tasks. Whereas this example only ever runs on the local HPE Morpheus Enterprise appliance, tasks can run on different targets (remote, resource) and against different contexts (instances, servers)

In essence, we've only explored a very particular use case to potentially assist in IPAM migrations and day 2 IPAM adoption.

At the more advanced end of the spectrum are provider types that model core infrastructure components. These include integrations for clouds, networks, storage systems, and many others. Such providers tend to be more complex because they interact deeply with HPE Morpheus Enterprise’s provisioning, synchronization, and lifecycle management layers. Understanding how these provider types fit together is key to building powerful, production-grade plugins.

Explore the following resources for more information on the different plugin/provider types:

https://developer.morpheusdata.com 

https://share.morpheusdata.com (follow the repository link under the plugin details to see the source code of a plugin) 

https://github.com/hewlettpackard https://youtu.be/1twoNvPoEV4?si=elUEzCYGo88TIffX