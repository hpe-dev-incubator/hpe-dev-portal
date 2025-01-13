---
title: How to use DSCC API and Ansible to collect the storage configuration
date: 2025-02-28T10:15:57.315Z
priority: -1
author: Thomas Beha
authorimage: /img/thomasbeha.jpg
disable: false
---
Capturing the current storage configuration in order to verify it against best practices or configuration rules is a task that customer requested regularly. If the customer is using Ansible as the automation platform, then there is on one hand the [HPE 3PAR Ansible module](https://github.com/HewlettPackard/hpe3par_ansible_module?tab=readme-ov-file), that is  used to create and delete hosts, volumes etc., but it is not really a solution for gathering the complete current configuration. Furthermore, this module uses the WSAPI of individual Alletra storage systems, while the HPE Data Services Cloud Console (DSCC) would be the better option to collect storage configuration data of multiple systems that might even be distributed across multiple sites. The DSCC would over a central, single location to get the data of all storage systems. [Ansible playbooks for the DSCC](https://developer.hpe.com/blog/automating-operations-on-dscc-using-ansible-playbooks/) were discussed in one of the previous HPE developer blogs. The playbooks offer fact gatherings for storage systems, hosts and volumes, but once you dig into the details, you will find that the modules were not updated for  more than two years and for instance do not support the HPE Alletra MP B10000 storage array. In this blog, I will discuss a possible approach for DSCC data gathering using Ansible built-in functionality to overcome the lack of continuous playbook development.

# Capture the storage system configuration

 After learning that the playbooks for the DSCC are not well maintained, I needed to find a different way to capture the configuration data of all arrays of the HPE Customer Technology Center in Böblingen. The <!--StartFragment--> [](https://github.com/HewlettPackard/hpe3par_ansible_module) [HPE 3PAR Ansible module](https://github.com/HewlettPackard/hpe3par_ansible_module?tab=readme-ov-file)<!--EndFragment--> would require to connect to each array individually and does not provide a complete capture of the array configuration. Hence it is not a solution to my current problem. A way forward would be to use the HPE Data Services Cloud Console and the corresponding Data Services REST API (the basics are already discussed in previous blogs on the HPE developer network: <!--StartFragment-->[Data Services on the HPE GreenLake platform | HPE Developer Portal ](https://developer.hpe.com/greenlake/data-services-on-the-hpe-greenlake-platform/home/)<!--EndFragment-->). The Data Services REST API offers a complete list of commands that can be issued on the DSCC. 

The configuration of a storage system would include the configuration data of the storage system itself, the details of the configured volumes of an storage array, the host group and the host details. The first step of gathering the configuration information would be to get a list of storage arrays connected to the Data Services Cloud Console. Once you do have the list, you can go and gather details of each storage array. The Data Services REST API is supporting the data gathering by supplying with every array a list of associated links, that refer to controller, disk etc. information of this array. An example of REST API call response is given below:

![](/img/getstoragesystems.png "Get Storage System")

The complete workflow of the DSCC data capturing is shown in the following flow diagram. First the list of connected storage arrays is compiled and stored in a dictionary. Next the playbook will loop through the storage array dictionary in order to capture the details of each connected storage array (this includes looping through all associated links of a storage array and the gathering of all volumes that are defined on the storage array). Afterwards the host group and host details are captured and stored too. 

![](/img/capturestorage-flowdiagram.png "Capture Storage System Flow Diagram")

Now in order to be independent of any python library (or the lack of updates to a python library) I have decided to use Ansible built-in functionality to create the DSCC capture playbooks. The basic tasks that are used by the playbooks are on one hand the DSCC REST API call using the ansible.builtin.uri function and as a special call variant the retrieval of the DSCC access token - special in terms of the URI used to get the access token. 

# Basic tasks

## Retrieving a DSCC access token

The steps to first generate the client Id and the client secret used to access the DSCC REST API was already described in a blog on the HPE Developer Portal:  <!--StartFragment--> [Using HPE GreenLake Console's API Gateway for Data Services Cloud Console  ](https://developer.hpe.com/blog/api-console-for-data-services-cloud-console/)<!--EndFragment-->.

Once you do have your client id and client secret, you can generate an access token that is valid for two hours. 

```
- name: Include encrypted vars
  include_vars: credentials.yml

- name: Get Access Token
  ansible.builtin.uri:
    url: "{{ sso_url }}"
    headers:
      Content-Type: "application/x-www-form-urlencoded"
      Authorization: "Basic {{ (dscc_id + ':' + dscc_secret) | b64encode }}"
    method: POST
    body: "grant_type=client_credentials"
    validate_certs: false
  register: oauth_response

- name: Define header
  ansible.builtin.set_fact:
    token: "Bearer {{ oauth_response.json.access_token }}"

- name: Store Token
  ansible.builtin.copy:
    content: "{{ token }}"
    dest: 'vars/token.txt'
    mode: "0644"
```

## DSCC REST API call

```
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

Used Playbook hierarchy:

* Capture-Systems.yaml

  * DSCC-API-Call.yaml
  * DSCC-API-401.yaml
  * Loop-Systems.yaml

    * Loop-Links.yaml

Playbooks currently stored at: <https://github.com/tbeha/DSCC-Ansible>