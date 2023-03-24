---
title: Creating DSCC block storage resources using DSCC Ansible playbooks
date: 2023-03-30T14:02:46.043Z
author: Anusha Y and Sijeesh Kattumunda
authorimage: /img/Avatar1.svg
disable: false
---
In my previous blog post, I provided an introduction to Ansible playbooks for DSCC and how to use them. In this post, I will show you how to create an Ansible playbook to create block storage resources 
Use case:
The objective of this use case is to provision a Primera volume from scratch using DSCC APIs.
This use case covers the creation of the following resources in the following order:

1. Create a host 
2. Create a host group
3. Create a volume set
4. Create volumes
5. Update the volume set with the volumes created
6. Export the volume set to the host created
   Let’s look at the Ansible playbook resource-wise.
   Variables in Ansible are similar to variables in any programming language that can be declared and used anywhere in the script. In this use case, certain variables will be used in the playbook and these are declared under the ‘vars’ section. One important variable to watch for here is the “config” variable that provides credentials for the APIs to authenticate the request and the host URL to which the request will be sent. The greenlake_config.json file that is mentioned in the value of the config variable will have the clientID, client secret, and the host URL of the DSCC instance.

   ```yaml
   vars:
       - config: "{{ playbook_dir }}/greenlake_config.json"
       - name: Greenlake DSCC volumeset
       - system_id: 2M29510B8L
       - initiators: []
       - host_name: host_from_ansible
       - host_group_name: hostGroupFromAnsible
       - operating_system: RHE Linux
       - workload: ORACLE_LOG
       - volume_set_name: ansibleVolumeSet
       - volume_name: ansibleVolume
   ```



Contents of greenlake_config.json:

```json
{
  "host": "https://us1.data.cloud.hpe.com",
  "client_id": "009e17ef-c356-4066-8b66-4ee10e1128b1",
  "client_secret": "53a9dd94d61311ec9b7e3ad2f9067b26"
}
```

Creation of host
A host represents a physical server and a host group represents a collection of physical servers. In the context of DSCC API, a host is a definition for a group of initiators that belong to a single server and a host group is a group of initiators across servers. To create a host, initiator information is needed and this can be obtained by a GET call to get the initiator resources. One of the initiators can be used in the creation of the host.
This means that the creation of a host requires two calls;, one to get the initiator and another  to create a host. Along with this, you must mention the name of the host, operating system, and a “user_created” flag must be set to true. Variable names will be mentioned between two curly braces and double quotes as shown in the below code snippet.

```yaml
    - name: Get GreenLake Host Initiators
      greenlake_host_initiator_facts:
        config: "{{ config }}"

    - debug: var=host_initiators

    - set_fact:
          initiators='{{ initiators + [item.id] }}'
      loop: "{{ host_initiators }}"
      when: item.protocol == 'FC' and item.hosts|length <= 0

    - debug: var=initiators

    - name: Create GreenLake DSCC Host
      greenlake_host:
        config: "{{ config }}"
        state: present
        data:
          initiator_ids:
            - "{{initiators.0}}"
          name: "{{host_name}}"
          operating_system: "{{operating_system}}"
          user_created: True

    - debug: var=hosts
```

Creation of host group
A host group can be created using the host created in the previous step. The tasks of this Ansible playbook will be executed sequentially, so the creation of the host group task executes only after the host creation task is successfully completed.
Provide the name of the host group, host Id, and make sure that the “user_created” flag is set to true.

```yaml
    - name: Create GreenLake DSCC Host Group
      greenlake_host_group:
        config: "{{ config }}"
        state: present
        data:
          name: "{{host_group_name}}"
          hostIds:
            - "{{hosts.0.id}}"
          user_created: True

    - debug: var=host_groups
```

Creation of Volume Set
The device type represents whether it’s a Primera or Nimble volume. If it is 1, then it is a Primera volume and if it is 2, then it is a Nimble volume. Mandatory parameters are app_set_name, app_set_importance, app_set_type (which is the kind of workload that is required, like Oracle Database). Optional parameters are commented on in the below snippet.
Note: The request body for Nimble volume creation may vary, so please refer to the documentation for specifics.

```yaml
    - name: Create GreenLake DSCC Volume Set
      greenlake_volumeset:
        config: "{{ config }}"
        device_type: 1
        system_id: "{{system_id}}"
        state: present
        data:
          # app_set_business_unit: "HPE"
          # app_set_comments: "Edit"
          app_set_importance: "MEDIUM"
          app_set_name: "{{volume_set_name}}"
          # name: "ansible_volume_set_1"
          app_set_type: "{{workload}}"
          # members: ["ansible-vol1", "ansible-vol2"]

    - debug: var=volume_sets
```

Creation of Volume (Primera)
The mandatory fields are the name, size, and user CPG. Other parameters are optional.

```yaml
    - name: Create GreenLake DSCC volume
      greenlake_volume:
        config: "{{ config }}"
        system_id: "{{system_id}}"
        state: present
        data:
          comments: "Ansible library test"
          count: 2 #Optional
          data_reduction: True #Optional
          name: "{{volume_name}}"  
          size_mib: 16384
          snap_cpg: "SSD_r6" #Optional
          snapshot_alloc_warning: 10 #Optional
          user_alloc_warning: 10 #Optional
          user_cpg: "SSD_r6"

    - debug: var=volumes
```

Updating the volume set
The volume set will be updated with the volumes created earlier. For this, provide the id of the volume set and the names of the volumes created. Since these are created dynamically during the playbook execution, these are referred to as variables.

```yaml
    - name: Update GreenLake DSCC Volume Set with volumes
      greenlake_volumeset:
        config: "{{ config }}"
        device_type: 1
        system_id: "{{system_id}}"
        state: present
        data:
          id: "{{volume_sets.0.id}}"
          add_members:
            - "{{volume_name}}.0"
            - "{{volume_name}}.1"

    - debug: var=volume_sets
```

Exporting the volume set to the Host Group
Now, the volume set created needs to be exported to the host group created earlier. Provide the system id, host group id, and the volume set id in the form of variables.

I hope you found this blog post helpful. This is just a sample use case one can implement to create resources on DSCC. Admins/users can come up with multiple use cases that can be used to manage the DSCC resources, like cleaning the resources, monitoring the resources, etc. Keep an eye out for new blogs and videos that are on track to be released related to the automation of DSCC operations.