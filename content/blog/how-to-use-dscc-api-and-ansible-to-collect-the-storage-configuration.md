---
title: How to use the DSCC API and Ansible to collect a storage configuration
date: 2025-08-01T09:15:57.315Z
priority: -1
author: Thomas Beha
authorimage: /img/tb07112025.png
disable: false
tags:
  - data-services-on-the-hpe-greenlake-platform
---
<style> li { font-size: 27px; line-height: 33px; max-width: none; } </style>

Capturing the current storage configuration to verify it against best practices or configuration rules is something that customer request regularly. If the customer uses Ansible as their automation platform, the [HPE 3PAR Ansible module](https://github.com/HewlettPackard/hpe3par_ansible_module?tab=readme-ov-file) can be used to create and delete hosts, volumes etc., but it is not really a solution for gathering the complete configuration. 

Furthermore, this module uses the WSAPI of individual Alletra storage systems. The HPE Data Services Cloud Console (DSCC) would be the better option to collect storage configuration data of multiple systems, evn those that might be distributed across multiple sites. Through a single location, the DSCC would be able to the data of all storage systems. 

[Ansible playbooks for the DSCC](https://developer.hpe.com/blog/automating-operations-on-dscc-using-ansible-playbooks/) were discussed in one of the previous HPE developer blogs. The playbooks offer fact gatherings for storage systems, hosts and volumes. However, once you dig into the details, you will find that the modules have not been updated for  more than two years,  and do not support the HPE Alletra MP B10000 storage array. In this blog post, I will discuss a possible approach for DSCC data gathering using Ansible built-in functionality to overcome the lack of continuous playbook development.

# Capture the storage system configuration

Upon learning tht the playbooks for the DSCC were not well maintained, I looked for a different way to capture the configuration data of all arrays of the HPE Customer Technology Center in Böblingen. The [](https://github.com/HewlettPackard/hpe3par_ansible_module) [HPE 3PAR Ansible module](https://github.com/HewlettPackard/hpe3par_ansible_module?tab=readme-ov-file) requires one to connect to each array individually and does not provide a complete capture of the array configuration. Hence it is not a solution to the problem. A way forward would be to use the HPE Data Services Cloud Console and the corresponding Data Services REST API (the basics are already discussed in previous posts on the HPE Developer Community blog: [Data Services on the HPE GreenLake platform | HPE Developer Portal ](https://developer.hpe.com/greenlake/data-services-on-the-hpe-greenlake-platform/home/)). The Data Services REST API offers a complete list of commands that can be issued on the DSCC. 

The configuration of a storage system generally includes the configuration data of the storage system itself, the details of the configured volumes of a storage array, the host group and the host details. The first step of gathering the configuration information would be to get a list of storage arrays connected to the Data Services Cloud Console. Once you have the list, you can go and gather details of each storage array. The [Data Services REST API](https://console-us1.data.cloud.hpe.com/doc/api/v1/) is supporting the data gathering by supplying with every array a list of associated links, that refer to controller, disk etc. information of this array. An example of REST API call response is given below:

![](/img/getstoragesystems.png "Get Storage System")

In order to be independent of any Python library (or the lack of updates to a Python library), I have decided to use Ansible's built-in functionality to create the DSCC capture playbooks. The basic tasks that are used by the playbooks are on the DSCC REST API call using the ansible.builtin.uri function and as a special call variant, the retrieval of the DSCC access token (which is special in terms of the URI used to get the access token). 

# Basic tasks

## Retrieving a DSCC access token

The steps to first generate the client id and the client secret used to access the DSCC REST API was already described in a post on the HPE Developer Community blog:  [Using HPE GreenLake Console's API Gateway for Data Services Cloud Console  ](https://developer.hpe.com/blog/api-console-for-data-services-cloud-console/). 

Once you have your client id and client secret, you can generate an access token that is valid for two hours. This access token will allow you to issue REST API calls to the Data Services Cloud Console, as it identifies you as the user that is linked with the client ID and secret to create the access token.  Hence, it is best practice to store the client id and secret in a secure place. 

The below code example had the client credentials stored in the credentials.yml file, that was encrypted using ansible-vault. The current Ansible playbook stores the access token in a file that grants access only to the current user (hence, the access mode 600 for this file) to avoid misuse of the retrieved access token. 

```yaml
— name: Include encrypted vars
  include_vars: credentials.yml

— name: Get Access Token
  ansible.builtin.uri:
    url: "{{ sso_url }}"
    headers:
      Content-Type: "application/x-www-form-urlencoded"
      Authorization: "Basic {{ (dscc_id + ':' + dscc_secret) | b64encode }}"
    method: POST
    body: "grant_type=client_credentials"
    validate_certs: false
  register: oauth_response

— name: Define header
  ansible.builtin.set_fact:
    token: "Bearer {{ oauth_response.json.access_token }}"

— name: Store Token
  ansible.builtin.copy:
    content: "{{ token }}"
    dest: 'vars/token.txt'
    mode: "0600"
```

## DSCC REST API call

A DSCC REST API call can be with and without a request body and can have multiple responses depending on the actual API call. Nevertheless, it is good practice to build a modular code approach that uses a generalized REST API call to access the Data Services Cloud Console. The generalized DSCC REST API call has its parameters:

* requestUri (as mentioned in the [](https://developer.hpe.com/greenlake/data-services-on-the-hpe-greenlake-platform/home/)[Data Services REST API](https://console-us1.data.cloud.hpe.com/doc/api/v1/)) 
* request method (GET, POST, DELETE, PUT)
* request body (optional)

 and is shown in the following code block:

```yaml
- name: Include encrypted vars
  include_vars: vars/credentials.yml

- name: Get Access Token
  ansible.builtin.set_fact:
    token: "{{ lookup('file', 'vars/token.txt') }}"

- name: Check the Methood 
  ansible.builtin.fail:
    msg: "DSCC-API-CALL: RestAPI Method is not defined!"
  when: method is not defined

- name: Check for the request Uri 
  ansible.builtin.fail:
    msg: "DSCC-API-Call: Request URI is not defined!"
  when: request_uri is not defined

- name: DSCC Command - {{request_uri}}
  ansible.builtin.uri:
    url: "{{ base_url }}{{ request_uri }}"
    headers:
      Authorization: "{{ token }}"
      Content-Type: "application/json"
    method: "{{ method }}"
    validate_certs: false
    status_code: [200, 201, 202, 401, 404]
  register: result
  when: body is not defined

- name: Set result status
  ansible.builtin.set_fact:
    status: "{{ result.status }}"
    tmpres: "{{ result }}"
  when: body is not defined

- name: DSCC Command with body {{request_uri}}
  ansible.builtin.uri:
    url: "{{ base_url }}{{ request_uri }}"
    headers:
      Authorization: "{{ token }}"
      Content-Type: "application/json"
    method: "{{ method }}"
    body_format: json
    body: "{{ body | to_json }}"
    validate_certs: false
    status_code: [200, 201, 202, 400, 401, 404]
  register: result2
  when: body is defined

- name: Set result status
  ansible.builtin.set_fact:
    status: "{{ result2.status }}"
    tmpres: "{{ result2 }}"
  when: body is defined

- name: Set response when status in [200, 201, 202, 401]
  ansible.builtin.set_fact:
    response: "{{ tmpres }}"
  when: status in ['200', '201', '202','401']

- name: Undefine Response when status not in [200...]
  ansible.builtin.set_fact:
    response: ""
  when: status not in ['200', '201', '202','401']
```

You can see, that it first retrieves the stored access token, then checks that the method and the request URI is available. Next it issues the API call either with or without a call body before the possible response status is checked and the call response is set. 

# System Configuration capture

The complete workflow of the DSCC data capturing is shown in the following flow diagram. First the list of connected storage arrays is compiled and stored in a dictionary. Next the playbook will loop through the storage array dictionary in order to capture the details of each connected storage array (this includes looping through all associated links of a storage array and the gathering of all volumes that are defined on the storage array). Afterwards the host group and host details are captured and stored too. 

![](/img/capturestorage-flowdiagram.png "Capture Storage System Flow Diagram")

This system configuration capture flow chart can now be implemented using the above mentioned basic task in combination with the correct request URIs and request bodies. You can see in the example below, that the playbook first gets the list of storage arrays (request uri: /api/v1/storage-systems) and if the command returns a status code of 401 (i.e. unauthorized access) it repeats the same call after retrieving a refreshed access token (that is the difference between the DSCC-API-Call.yaml and the DSCC-API-401.yaml playbook).  After successfully retrieving the system list, a system dictionary is populated first, followed by looping through the dictionary (Loop-Systems.yml playbook) and storing the system configuration information. Afterwards, the host group and hosts details are retrieved and stored. 

```yaml
 hosts: localhost
  vars:
    method: "GET"

  tasks:
  - name: DSCC API Call GET storage systems
    vars:
      request_uri: "/api/v1/storage-systems" 
    ansible.builtin.include_tasks:
      file: DSCC-API-Call.yaml

  - name: Retry the command if status 401
    vars:
      request_uri: "/api/v1/storage-systems" 
    ansible.builtin.include_tasks:
      file: DSCC-API-401.yaml
    when: status == '401'

  - name: Set Systems
    ansible.builtin.set_fact:
      systems: "{{ response.json['items'] }}"
    when: status in ['200', '201']

  - name: Initialize Storage system dictionary if not defined
    ansible.builtin.set_fact:
      storage_systems: "{{ storage_systems | default({}) }}"
  - name: Create StorageSystems Dictionary
    ansible.builtin.set_fact:
      storage_systems: "{{ storage_systems | combine({item.name: {'id': item.id, 'resourceUri': item.resourceUri}}) }}"
    with_items: "{{ systems }}"

  - name: Loop Systems
    vars: 
    ansible.builtin.include_tasks:
      file: Loop-Systems.yaml
    with_dict: "{{storage_systems}}"
    loop_control:
      loop_var: my_system
  
  - name: Get HostGroups
    vars:
      request_uri: "/api/v1/host-initiator-groups"
    ansible.builtin.include_tasks:
      file: DSCC-API-Call.yaml    
  - name: Store the HostGroups
    ansible.builtin.copy:
      content: "{{ response.json | to_nice_json }}"
      dest: "../Outputs/hostGroups.json"
      mode: '0600'
    when: response.json is defined
  
  - name: Get Hosts
    ansible.builtin.include_tasks:
      file: GetAllHosts.yaml
  - name: Store the Hosts
    ansible.builtin.copy:
      content: "{{ response.json | to_nice_json }}"
      dest: "../Outputs/hosts.json"
      mode: '0600'
    when: response.json is defined 
```

The Loop-Systems.yaml playbook retrieves the storage system details and loops for each system through all the associated links of this array, providing you with a complete capture of the storage array configuration. The captured data is stored in multiple files with the naming structure: **SystemName.associatedLink-Keyname.json.** 

The Ansible playbooks used to capture the system configuration are:

* Capture-Systems.yaml

  * DSCC-API-Call.yaml
  * DSCC-API-401.yaml
  * Loop-Systems.yaml

    * Loop-Links.yaml
    * GetAllSystemVolumes.yaml
  * GetAllHosts.yaml

In order to keep this blog readable and not code overloaded only a few of the playbooks used are shown, but all playbooks (and even some more) can be retrieved on Github at: [https://github.com/tbeha/DSCC-Ansible.](https://github.com/tbeha/DSCC-Ansible)

# Conclusion

It is possible to use Ansible playbooks to capture the storage array configuration using the HPE Data Services Cloud Console REST API and built-in  Ansible functions. Having the storage array captured in one or multiple JSON-files is  leading to an obvious next step: use the captured configuration information to automate the redeployment of a storage array. This is one of my planned next activities. Stay tuned to the [HPE Developer Community blog](https://developer.hpe.com/) for more.