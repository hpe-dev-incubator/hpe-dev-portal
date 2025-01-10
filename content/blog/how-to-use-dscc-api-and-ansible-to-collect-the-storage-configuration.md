---
title: How to use DSCC API and Ansible to collect the storage configuration
date: 2025-02-28T10:15:57.315Z
priority: -1
author: Thomas Beha
authorimage: /img/thomasbeha.jpg
disable: false
---
Capturing the current storage configuration in order to verify it against best practices or configuration rules is a task that customer requested regularly. If the customer is using Ansible as the automation platform, then there is on one hand the [HPE 3PAR Ansible module](https://github.com/HewlettPackard/hpe3par_ansible_module?tab=readme-ov-file), that is  used to create and delete hosts, volumes etc, but it is not really a solution for gathering the complete current configuration. Furthermore, this module uses the WSAPI of individual Alletra storage systems, while the HPE Data Services Cloud Console (DSCC) would be the better option to collect storage configuration data of multiple systems that might even be distributed across multiple sites. The DSCC would over a central, single location to get the data of all storage systems. [Ansible playbooks for the DSCC](https://developer.hpe.com/blog/automating-operations-on-dscc-using-ansible-playbooks/) were discussed in one of the previous HPE developer blogs. The playbooks offer fact gatherings for storage systems, hosts and volumes, but once you dig into the details, you will find that the modules were not updated for  more than two years and for instance do not support the HPE Alletra MP B10000 storage array. In this blog, I will discuss a possible approach for DSCC data gathering using Ansible built-in functionality to overcome the lack of continuous playbook development.

# Basic tasks



## Retrieving a DSCC access token



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



# Gathering the storage configuration