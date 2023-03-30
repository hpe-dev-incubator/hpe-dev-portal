---
title: Automating operations on HPE GreenLake Data Services Cloud Console using
  Ansible Playbooks
date: 2023-03-29T14:00:40.866Z
author: Anusha Y and Sijeesh Kattumunda
authorimage: /img/Avatar1.svg
disable: false
tags:
  - data-services-cloud-console
  - Ansible
---
<style>
li {
    font-size: 27px;
    line-height: 33px;
    max-width: none;
}
</style>


Automation is one of the top trends in technology and the pace of automation is accelerating with more companies opting for developing fully automated systems. Automation reduces time, effort, cost, and manual errors while increasing efficiency and productivity. Gone are those days when many complex coding skills were required to implement automation. Now, there are many low-code tools available in the market, like Ansible, that make automation easier.

In this blog post, I am excited to be able to introduce the Ansible playbooks for HPE GreenLake Data Services Cloud Console and show you how to use them. Along with the [Python SDK](https://github.com/HewlettPackard/greenlake-data-services-python) for HPE GreenLake Data Services Cloud Console, these playbooks should help you in your efforts to automate HPE GreenLake Data Services through an infrastructure-as-code approach.

Ansible is an open-source IT automation tool that automates provisioning, configuration management, application deployment, and many other IT processes. 
Two main features that make Ansible the best choice for automation are:

* Ansible does not require any programming. 
* Idempotence is offered as a built-in feature of many of the Ansible modules. This means the result of performing a task once is the same as performing it multiple times without any intervening actions.

**Why do we need Ansible playbooks for HPE GreenLake Data Services Cloud Console?**

Ansible helps the users/admins automate the deployment of resources and applications without the manual overhead of creating everything from scratch. These playbooks can be configured with conditions, variables, and tasks. Currently, simple playbooks, like performing CRUD operations on the resources, are available. These playbooks can be considered basic building blocks and can be reused to build simple-to-complex use cases.

**[Ansible Modules for HPE GreenLake Data Services Cloud Console](https://github.com/HewlettPackard/greenlake-data-services-ansible):**

The following Ansible modules are currently available for Data Services Cloud Console. You can use the samples given or customize it. 

*greenlake\_audit\_events\_facts* - Get details of audit events

*greenlake_host* - Manage host

*greenlake\_host\_facts -* Get details of a host

*greenlake\_host\_group -* Manage host group

*greenlake\_host\_group\_facts -* Get details of a host group

*greenlake\_host\_initiator\_facts -* Get details of a host initiator

*greenlake\_storage\_system\_facts -* Get details of a storage system

*greenlake\_volume -* Manage volume

*greenlake\_volume\_facts -* Get details of a volume

*greenlake\_volumeset -* Manage volume set

*greenlake\_volumeset_facts -* Get details of a volume set

**Prerequisites to use these Ansible playbooks:**

1. Any machine with Python 3.8 or newer installed. This includes Red Hat, Debian, CentOS, macOS, any of the BSDs, and so on. (Microsoft Windows is not supported - see Note below)
2. The latest and most stable version of Ansible must be installed. (current version is 2.9)
3. HPE GreenLake Data Services Python SDK. (Installation procedure is mentioned below)
4. Cloning the GitHub repo that has these playbooks
5. Setup ANSIBLE\_LIBRARY and ANSIBLE\_MODULE\_UTILS environment variables

>Note: If you are using Windows 10, then an Ubuntu terminal called Windows Subsystem for Linux(WSL) can be used.

**Installing Ansible on Ubuntu**

1. Make sure your system’s package index is up to date. Refresh the package index with the following command:

   ```shell
   $sudo apt update
   ```
2. Next, install Ansible on Ubuntu with the command:

   ```shell
   $sudo apt install ansible
   ```

The installation will prompt you to press Y to confirm, with the rest of the installation process being automated.

3. Check the version of Ansible by using the following command:

   ```shell
   $ansible --version
   ```

For other operating systems, please refer to the official [Ansible documentation](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html).

**Installing the HPE GreenLake Data Services Python SDK**

These Ansible playbooks use the Python libraries of the HPE GreenLake Python SDK. Install the Python SDK using the steps mentioned [here](https://github.com/HewlettPackard/greenlake-data-services-python#installation--usage).

**Cloning the Data Services Cloud Console GitHub repo**	
To clone the repo, execute the following command on the machine where you installed Ansible:

```shell
git clone https://github.com/HewlettPackard/greenlake-data-services-ansible.git
```

This repo mainly consists of two folders:

1. **Libraries**: These are Python libraries that will be used by the Ansible playbooks to perform CRUD operations on Data Services Cloud Console resources.
2. **Examples**: This folder consists of sample Ansible playbooks that perform CRUD operations on Data Services Cloud Console resources. With these examples, one can start building use cases.

**Setting up environment variables**

Set the ANSIBLE\_LIBRARY variable to the greenlake-data-services-ansible/library directory of the repo -

`ANSIBLE_LIBRARY=/home/admin/greenlake-data-services-ansible/library`

Set the ANSIBLE\_MODULE\_UTILS to the module_utils directory under greenlake-data-services-ansible/library directory -

`ANSIBLE_MODULE_UTILS=/home/admin/greenlake-data-services-ansible/library/module_utils`

**Usage**

Let’s have a look at an example used to perform Data Services Cloud Console operations on a host using an Ansible playbook. For any Ansible playbook to be used, an inventory file is required. The Ansible inventory file defines the hosts and groups of hosts on which commands, modules, and tasks in a playbook operate. In this example, we are calling REST APIs from our local machine. This file can be placed anywhere and the path of this file can be given during the Ansible playbook execution. Create an inventory file, name it “hosts” (the name of the file can be anything), and update it with the following details: 

`[localhost]
127.0.0.1 ansible_connection=local ansible_python_interpreter=/home/admin/ansible-env/bin/python`

The IP address given is localhost, which means operations are performed on the local host. Provide the Python interpreter location on your system. Name this file “hosts”.

Let's look at a sample of the host file. Ansible playbooks contain a list/array of tasks that will be performed sequentially. The below code snippet has the following tasks.

1. **Creation** of host

   In this block, the input request parameters are provided under the section ‘data’. In this sample, only required fields for the REST API call are provided such as name, initiator\_ids, user\_created flag, and operating system.
2. **Update** a host

   In an update request, one can update the name, and change the initiators. These input parameters can be provided under the ‘data’ section.
3. **Delete** a host

   To delete a host, all you need to provide is the name of the host.

   ```yaml
   ---
   - hosts: all
     vars:
       - config: "{{ playbook_dir }}/greenlake_config.json"
       - name: "Greenlake DSCC Host"
     tasks:
       - name: Create GreenLake DSCC Host
         greenlake_host:
           config: "{{ config }}"
           state: present
           data:
             initiator_ids:
               - "b015d393e2274592a37cc7a579c8b0ca"
             name: "hostAnsibleTest"
             operating_system: "RHE Linux"
             user_created: True
             # new_name: "hostAnsibleNameUpdated1"

       - debug: var=hosts

       - name: Update GreenLake DSCC Host Name
         greenlake_host:
           config: "{{ config }}"
           state: present
           data:
             initiator_ids:
               - "b015d393e2274592a37cc7a579c8b0ca"
             name: "hostAnsibleTest"
             operating_system: "RHE Linux"
             user_created: True
             new_name: "hostAnsibleTestUpdated"

       - name: Delete GreenLake DSCC Host
         greenlake_host:
           config: "{{ config }}"
           state: absent
           data:
             name: "hostAnsibleTestUpdated"
       - debug: var=hosts
   ```

To execute the Ansible playbook, execute the following command:

```shell
$ansible-playbook examples/greenlake_host.yaml --i ../hosts
```

This is what the result of a playbook execution looks like.

```shell
(ansible_env) anusha@MUCILUR2I5:~/greenlake-data-services-ansible$ ansible-playbook examples/greenlake_host.yaml -i ../hosts
[WARNING]: Found variable using reserved name: name

PLAY [all] ********************************************************************************************************************************************************************************************************

TASK [Gathering Facts] ********************************************************************************************************************************************************************************************
ok: [127.0.0.1]

TASK [Create GreenLake DSCC Host] *********************************************************************************************************************************************************************************
changed: [127.0.0.1]

TASK [debug] ******************************************************************************************************************************************************************************************************
ok: [127.0.0.1] => {
    "hosts": [
        {
            "associated_links": [
                {
                    "resourceUri": "/api/v1/initiators?filter=hostId in (63e338328779477481d44d906866b60b)",
                    "type": "initiators"
                }
            ],
            "associated_systems": null,
            "comment": null,
            "console_uri": "/data-ops-manager/host-initiators/63e338328779477481d44d906866b60b",
            "contact": null,
            "customer_id": "eb00678a466b11ec94d66ec0ab988305",
            "edit_status": "Not_Applicable",
            "fqdn": null,
            "generation": 1655290314,
            "host_groups": [],
            "id": "63e338328779477481d44d906866b60b",
            "initiators": [
                {
                    "address": "c3:33:ff:58:5f:19:00:1e",
                    "id": "b015d393e2274592a37cc7a579c8b0ca",
                    "ip_address": null,
                    "name": "Host Path C333FF585F19001E (1:3:2)",
                    "protocol": "FC",
                    "systems": [
                        "2M29510B8N",
                        "2M29510B8L"
                    ]
                }
            ],
            "ip_address": null,
            "location": null,
            "marked_for_delete": false,
            "model": null,
            "name": "hostAnsibleTest",
            "operating_system": "RHE Linux",
            "persona": null,
            "protocol": null,
            "subnet": null,
            "systems": [
                "2M29510B8N",
                "2M29510B8L"
            ],
            "type": "host-initiator",
            "user_created": true
        }
    ]
}

TASK [Update GreenLake DSCC Host Name] ****************************************************************************************************************************************************************************
changed: [127.0.0.1]

TASK [Delete GreenLake DSCC Host] *********************************************************************************************************************************************************************************
changed: [127.0.0.1]

TASK [debug] ******************************************************************************************************************************************************************************************************
ok: [127.0.0.1] => {
    "hosts": [
        {
            "associated_links": [
                {
                    "resourceUri": "/api/v1/initiators?filter=hostId in (63e338328779477481d44d906866b60b)",
                    "type": "initiators"
                }
            ],
            "associated_systems": null,
            "comment": null,
            "console_uri": "/data-ops-manager/host-initiators/63e338328779477481d44d906866b60b",
            "contact": null,
            "customer_id": "eb00678a466b11ec94d66ec0ab988305",
            "edit_status": "Update_In_Progress",
            "fqdn": null,
            "generation": 1655290320,
            "host_groups": [],
            "id": "63e338328779477481d44d906866b60b",
            "initiators": [
                {
                    "address": "c3:33:ff:58:5f:19:00:1e",
                    "id": "b015d393e2274592a37cc7a579c8b0ca",
                    "ip_address": null,
                    "name": "Host Path C333FF585F19001E (1:3:2)",
                    "protocol": "FC",
                    "systems": [
                        "2M29510B8N",
                        "2M29510B8L"
                    ]
                }
            ],
            "ip_address": null,
            "location": null,
            "marked_for_delete": false,
            "model": null,
            "name": "hostAnsibleTestUpdated",
            "operating_system": "RHE Linux",
            "persona": null,
            "protocol": null,
            "subnet": null,
            "systems": [
                "2M29510B8N",
                "2M29510B8L"
            ],
            "type": "host-initiator",
            "user_created": true
        }
    ]
}

PLAY RECAP ********************************************************************************************************************************************************************************************************
127.0.0.1                  : ok=6    changed=3    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

These Ansible playbooks can be used to fetch details as well. Under the examples folder, there are files with the suffix ‘_facts’ which specify that it is used to get the details of a resource.
For example, take a look at the ‘greenlake\_host\_facts.yaml’. This playbook is used to get the details of the host.

```yaml
---
- hosts: all
  vars:
    - config: "{{ playbook_dir }}/greenlake_config.json"
    - name: "Get Hosts"
  tasks:
    - name: Get GreenLake Hosts
      greenlake_host_facts:
        config: "{{ config }}"
        # id: "fbc6f4e700154bff8cdfebaf10c3b965"
        # params:
        #   limit: 10 # int | Number of items to return at a time (optional)
        #   offset: 5 # int | The offset of the first item in the collection to return (optional)

    - debug: var=hosts
```

In this playbook, you have an option to add filters to it like ID, limit, offset, etc., or else you can get the details of all hosts available.
Use the following command to execute the Ansible playbook:

```shell
$ansible-playbook examples/greenlake_host_facts.yaml --i ../hosts
```

The output looks like this:

```shell
(ansible_env) anusha@MUCILUR2I5:~/greenlake-data-services-ansible$ ansible-playbook examples/greenlake_host_facts.yaml -i ../hosts
[WARNING]: Found variable using reserved name: name

PLAY [all] ********************************************************************************************************************************************************************************************************

TASK [Gathering Facts] ********************************************************************************************************************************************************************************************
ok: [127.0.0.1]

TASK [Get GreenLake Hosts] ****************************************************************************************************************************************************************************************
ok: [127.0.0.1]

TASK [debug] ******************************************************************************************************************************************************************************************************
ok: [127.0.0.1] => {
    "hosts": [
        {
            "associated_links": [
                {
                    "resourceUri": "/api/v1/initiators?filter=hostId in (e1b09ecf837b46cca365044bf7237bc3)",
                    "type": "initiators"
                },
                {
                    "resourceUri": "/api/v1/host-initiator-groups?filter=hostId in (e1b09ecf837b46cca365044bf7237bc3)",
                    "type": "host-groups"
                }
            ],
            "associated_systems": [
                "2M29510B8N",
                "2M29510B8L"
            ],
            "comment": null,
            "console_uri": "/data-ops-manager/host-initiators/e1b09ecf837b46cca365044bf7237bc3",
            "contact": null,
            "customer_id": "eb00678a466b11ec94d66ec0ab988305",
            "edit_status": "Not_Applicable",
            "fqdn": null,
            "generation": 1653561376,
            "host_groups": [
                {
                    "id": "0fb8a5f6616c4465a77a43cb7841e105",
                    "marked_for_delete": false,
                    "name": "HostGroup-01",
                    "systems": [
                        "2M29510B8N",
                        "2M29510B8L"
                    ],
                    "user_created": true
                }
            ],
            "id": "e1b09ecf837b46cca365044bf7237bc3",
            "initiators": [
                {
                    "address": "c3:33:ff:58:5f:19:00:04",
                    "id": "1b6b97741b21480bb916ca3b8c0a2c6e",
                    "ip_address": null,
                    "name": "Host Path C333FF585F190004 (0:3:1)",
                    "protocol": "FC",
                    "systems": [
                        "2M29510B8N",
                        "2M29510B8L"
                    ]
                },
                {
                    "address": "c3:33:ff:58:5f:19:00:24",
                    "id": "1bce3ffd6a0d4b74a8520ddc55e2a1eb",
                    "ip_address": null,
                    "name": "Host Path C333FF585F190024 (1:3:1)",
                    "protocol": "FC",
                    "systems": [
                        "2M29510B8N",
                        "2M29510B8L"
                    ]
                }
            ],
            "ip_address": null,
            "location": null,
            "marked_for_delete": false,
            "model": null,
            "name": "Host-01",
            "operating_system": "Ubuntu",
            "persona": null,
            "protocol": null,
            "subnet": null,
            "systems": [
                "2M29510B8N",
                "2M29510B8L"
            ],
            "type": "host-initiator",
            "user_created": true
        }
    ]
}

PLAY RECAP ********************************************************************************************************************************************************************************************************
127.0.0.1                  : ok=3    changed=0    unreacha-ble=0    failed=0    skipped=0    rescued=0    ignored=0
```

In the current release, only critical resources are supported. New resources will be added moving forward. This is just the beginning.  In the future, there are many use cases to cover.

In this blog, I gave you a preview of the Ansible playbooks for HPE GreenLake Data Services Cloud Console. This SDK is a Beta version with lots of rooms for improvement. I would urge you to try out the features and keep us engaged with your feedback so that we come out with a better version for the GA. Also, look out for other posts in the HPE Developer blog that are related to Data Services Cloud Console.