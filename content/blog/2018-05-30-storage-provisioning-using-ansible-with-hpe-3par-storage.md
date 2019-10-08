---
title: Storage Provisioning using Ansible with HPE 3PAR Storage
date: 2018-05-30T22:22:15.634Z
author: Chris Snell 
tags: ["3PAR","Ansible","Automation","REST","Storage","hpe-3PAR"]
path: storage-provisioning-using-ansible-with-hpe-3par-storage
---
# Storage Provisioning using Ansible with HPE 3PAR Storage

Recently I was asked to look at getting the HPE 3PAR to work with Ansible. My exposure to Ansible before this, was by name recognition only. I didn’t have any working knowledge with it. So like every good challenge, I set off to learn this new “tool”.

After looking online at several Youtube videos, I got an elementary understanding to what was possible with Ansible. I must say, it was definitely refreshing it was YAML based compared to some of the other languages I had been using i.e. javascript and Ruby. YAML is a much “simpler” language to understand and read.

If you aren’t familiar with YAML, it stands for “YAML Ain't Markup Language”. It is used widely among programming languages as well as configuration files for many of the popular apps. So if you have dug around much within Linux, chances are you have come across YAML.

Here is a quick example from Ansible’s website. Take a look at the documentation to learn more about the formatting for YAML. Reading YAML is pretty straightforward.

``` yaml
# Employee records
-  martin:
    name: Martin D'vloper
    job: Developer
    skills:
      - python
      - perl
      - pascal
-  tabitha:
    name: Tabitha Bitumen
    job: Developer
    skills:
      - lisp
      - fortran
      - erlang
```

Again this is a simple example, but these same principals apply from the most basic to the most complex Ansible playbooks.

Now let’s talk more specifically about Ansible and playbooks.

Ansible’s website says it the best:

>Playbooks are Ansible’s configuration, deployment, and orchestration language. They can describe a policy you want your remote systems to enforce, or a set of steps in a general IT process.
>If Ansible modules (modules are Ansible “plugins” that control system resources, like services, packages, or files) are the tools in your workshop, playbooks are your instruction manuals, and your inventory of hosts are your raw material.
At a basic level, playbooks can be used to manage configurations of and deployments to remote machines. At a more advanced level, they can sequence multi-tier rollouts involving rolling updates, and can delegate actions to other hosts, interacting with monitoring servers and load balancers along the way.

With this in mind, I will be specifically talking about creating Ansible playbooks to automate Storage deployments. Many developers and Operation teams are already using Ansible to help deploy infrastructure as well as apps within their datacenters, so it makes sense to include storage in these processes and workflows. Since I work primarily with the HPE 3PAR Storserv array, naturally I wanted to start there and figure out how to make Ansible talk to the HPE 3PAR’s Web Services API (3PAR’s REST API).

I will be covering two different methods of how you can use Ansible with the 3PAR. If you are already "TLDR", but want to know specifically how to use the new Storage module, you can skip over this section and go the section **"The New Better Way"**

# Old Method (without the Storage Module)


When I first started looking into how to connect to Ansible to the WSAPI, I quickly realized that since we didn’t have a module (at the time) we would have to do it “old school” using REST calls. Since I came from several other projects recently where I had to learn REST (that is another topic in and of itself), this wasn’t going to be too difficult.
I was able to find the Ansible uri module to work with REST. So let’s take a look at how to write a raw playbook using REST and then I can show you the new HPE 3PAR module so you understand the benefits that come from the work done by the HPE engineering team.
Here is a “simple” example of a custom playbook using the uri module to query the HPE 3PAR to get volumes.

Let’s start with creating the playbook. Every playbook (since it is YAML based) starts with `---` and then the name of the playbook. Here you can define the hosts that it will run against. Since we are using the **uri** module on the local machine to connect to a 3PAR, we set this to **localhost**

```yaml
---
- name: Connect to 3par - get volumes
  hosts: localhost

  vars:
    auth_3par_user: "3paruser"
    auth_3par_password: "3parpass"
    ip_address_3par: 192.168.1.50
    rest_api_url_3par: "https://{{ ip_address_3par }}:8080/api/v1"
```

 The next section, includes your variables. These can be included in the playbook (like shown),  at runtime, or in a configuration file. It can also be a mix of these, for example, global variables could be in a configuration file while the runtime variables configured in the playbook or provided at the command line with the -e flag.

>Be aware, **YAML** is space sensitive. Always make sure your sections contain the same number of spaces in front otherwise it may be interpreted differently. Also, TABS have been outlawed in YAML and are not allowed to prevent errors between editors. You have been warned.

The next section contains the task(s). A playbook can contain a single task or multiple tasks to accomplish the desired configuration. Each task is denoted with the `– name:` descriptor and provides a meaningful name to the task. Each task calls upon an Ansible module that is able to accomplish the desired endstate, in our case the **uri** module. Under the **uri** module, you will see the various parameters that are required in order for Ansible to talk with the HPE 3PAR.

```yaml
tasks:
  - name: check if 3par WSAPI is running
    uri:
      url: "{{ rest_api_url_3par }}/credentials"
      method: POST
      headers:
        Content-Type: "application/json"
      body_format: json
      body: "{ 'user': '{{ auth_3par_user }}', 'password': '{{ auth_3par_password }}' }"
      status_code: 201
      return_content: yes
      validate_certs: no
    register: output

  - name: Parsing key
    debug:
      msg: "{{ output.json.key }}"

  - name: GET 3par hosts - get hosts
    uri:
      url: "{{ rest_api_url_3par }}/volumes"
      method: GET
      headers:
        Content-Type: "application/json"
        X-HP3PAR-WSAPI-SessionKey: "{{ output.json.key }}"
        Accept: "application/json"
      status_code: 200
      return_content: yes
      validate_certs: no
    register: host_output

  - name: Parsing Host GET
    debug:
      msg: "{{ host_output }}"

  - name: release authentication key
    uri:
      url: "{{ rest_api_url_3par }}/credentials/{{ output.json.key }}"
      method: DELETE
      headers:
        Content-Type: "application/json"
      validate_certs: no   
```

As you can see, there are 5 tasks in this playbook.

1. Authentication to the HPE 3PAR
2. Acquires the required SessionKey
3. With the SessionKey, Queries the HPE 3PAR for all volumes
4. Outputs the query to the terminal
5. Releases the SessionKey

There are a lot of steps involved here to do something so simple. The nice thing though, once you have this initial playbook built, managing (i.e. provisioning volumes, creating vvsets, etc) your HPE 3PAR is rather straight forward only requiring the change of the REST call `url: "{{ rest_api_url_3par }}/volumes"`.

You can include additional tasks, like exporting volumes, to make these playbooks more robust and part of a larger workflow. When I created a number of these playbooks in this manner, I found out quickly there were a lot of limitations to using the uri module, which I want highlight.

### Impressions of using REST/uri module

**First**, is **_length_** of your playbooks. This was a simple playbook but it was still **57 lines of code**. That is 57 different areas to make a mistake (especially with spaces). When I created some larger bare-metal provisioning workflows, they were hundreds of lines of code which becomes harder to follow, error prone and far more complex than I want.

**Second**, the `uri` module. I had to use native **REST** calls to talk with the 3PAR. I was fortunate to have learned **REST** in previous projects, but it isn’t easy to pick up on the fly so if you had to get up and running quickly with Ansible this would be another HUGE learning curve in addition to learning Ansible.

**Lastly**, there are no _3PAR specific resources_ to work with. I was dependent on the `uri` module and then parsing **json** in order to get specific information I needed in my playbooks like **volume names**, **lun id**, **SessionKeys**, etc. An important part of automation, is the ability target an object (be it an **HPE 3PAR volume**, **ESXi host**, **nginx service**) so you can act upon it later in your workflows.

This is where the HPE 3PAR modules for Ansible comes into play.
https://github.com/HewlettPackard/hpe3par_ansible_module



# New Better Way (with the Storage Module)

Okay like I said, the previous is the long way to do it. If you like to write in **REST** and enjoy having really long playbooks, then continue doing what you are doing. Otherwise, HPE has partnered with Red Hat and the Ansible team to develop high quality storage modules to manage the HPE 3PAR array. This collaboration has led to the development of HPE 3PAR specific storage modules, playbooks and resources in order to manage your HPE 3PAR storage arrays.

The HPE 3PAR modules for Ansible is developed as a set of modules and example playbooks to provision the following:

- CPG
- Host
- Volume
- VLUN
- Host Set
- Volume Set
- Volume Offline Clone
- Volume Online Clone
- Volume Snapshot
- QOS
- Flash Cache

So let’s look at what a playbook looks like using the HPE 3PAR modules for Ansible.

First step to using the storage module, is to download it from Github. As of Ansible 2.5 and earlier, you will need to download it from Github, after the release of Ansible 2.6, it will be part of Ansible core and included when you download future versions.

```
git clone https://github.com/HewlettPackard/hpe3par_ansible_module
```

Once we have it downloaded, you can look at the various items included with the Module.

![image1](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/5/image1-1528126916512.png)

We are most interested in the Modules and playbooks. The Modules folder contains the code (written in Python) behind the playbooks and these specific modules do all of the work on the 3PAR so we don’t have to write lengthy and complex REST calls like in the beginning example. They also provide HPE 3PAR resources and actions that we can then use within our playbooks like create volumes, modify 3PAR hosts, or delete hostsets as an example. We don’t have to modify anything here and they are available when we create our playbooks.

Now let's look at the playbooks. There is a pretty large list of available playbooks here.

![image2](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/5/image2-1528127089601.png)

The name of the playbooks correlates to the actions and resources that you will be working with. So for example if we want to create a **_snapshot_**, we would be working with the **snapshot_playbook.yml** or if we want to manage **_volumes_**, we would be using the **volume_playbook.yml**.

Let’s look at the volume playbook,

![image3](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/5/image3-1528127229536.png)

Variables within **YAML** are defined with curly brackets: `{{ variable }}`. 

Second, **_state_**.
 
The **_state_** option tells Ansible what action to perform. Ansible is a Change Management tool, so you don’t actually write code, instead playbooks define your environment and how it should be configured. 

Let’s look at the **_Create Volume task_** as an example, state=present. Upon running the playbook, the Create Volume task will call the HPE 3PAR storage module to check to see if the volume exists on the array and if it doesn’t, it will be created.  State tells Ansible that the volume must be present. 

Looking back at the **volume_playbook.yml** as well as any of the other playbooks, you will see the many state definitions, each performing a specific action. Some of them include:

  - present
  - convert_type
  - set_snap_cpg
  - change_snap_cpg
  - grow
  - grow_to_size
  - modify
  - delete

Now let’s create another playbook using these modules to create a volume and then export it to a host. 

Open your favorite editor. 

`vi demo_playbook.yml`

Let’s provide a name for our playbook and it will be running against `localhost` again.
  
```YAML
---
- name: Demo 3PAR Ansible playbook
  hosts: localhost
```

Next let’s define our variables. In this example, we will use a combination of locally defined **variables** and an external configuration file (`include_vars`). Under `vars`, we specify the volume specifics.

```YAML
vars:
  volume_name: 'demo_ansible_volume'
  size: 10
  size_unit: 'GiB'
  cpg: 'FC_r1'
  vlun_host_name: 'example_host'
  autolun: False
  lunid: 110

tasks:
  - name: Load Storage System Vars
    include_vars: 'properties/storage_system_properties.yml'
```

Before we go further, here is what the `properties/storage_system_properties.yml` file looks like. It is a simple file with 3 lines, defining the connection information for the HPE 3PAR. 

```YAML
storage_system_ip: "192.168.1.50"
storage_system_username: "3paruser"
storage_system_password: "3parpass"
```

**Note:** You can include any of your variables in a combination of configuration files or within the playbook itself. It is completely up to you. I like to use configuration file for my “global” variables or to use them as “profiles” to limit the user defined variables in my playbooks.

Now let’s create our tasks. Like I mentioned before, we can copy and paste these from the playbook templates found under the playbooks folder in the HPE 3PAR Storage Module. We will be copying the **_Create Volume_** action from the **volume_playbook.yml** and the **_Create VLUN_** action from the **volume_to_host_vlun_playbook.yml** playbook.  

```YAML
- name: Create Volume "{{ volume_name }}"
  hpe3par_volume:
    storage_system_ip="{{ storage_system_ip }}"
    storage_system_username="{{ storage_system_username }}"
    storage_system_password="{{ storage_system_password }}"
    state=present
    volume_name="{{ volume_name }}"
    cpg="{{ cpg }}"
    size="{{ size }}"
    size_unit="{{ size_unit }}"

- name: Create VLUN
  hpe3par_vlun:
    storage_system_ip="{{ storage_system_ip }}"
    storage_system_username="{{ storage_system_username }}"
    storage_system_password="{{ storage_system_password }}"
    state=export_volume_to_host
    volume_name="{{ volume_name }}"
    host_name="{{ vlun_host_name }}"
    lunid="{{ lunid }}"
    autolun="{{ autolun }}"
```

We need to make one minor change. Under the **_Create VLUN_** task, we need to modify the following variable:

```YAML
volume_name="{{ vlun_volume_name }}"
```

to

```YAML
volume_name="{{ volume_name }}"
```

This allows you to link the two tasks by using the volume you created as the volume to export in the following task. Other than that we are done and have created a simple, yet powerful provisioning playbook.

With it all together, it should look like and is ready to run.

```yaml
---
- name: Demo 3PAR Ansible playbook
  hosts: localhost

  vars:
    volume_name: 'demo_ansible_volume'
    size: 100
    size_unit: 'GiB'
    cpg: 'FC_r6'
    vlun_host_name: 'example_host'
    autolun: False
    lunid: 110
  
  tasks:
    - name: Load Storage System Vars
      include_vars: 'properties/storage_system_properties.yml'

    - name: Create Volume "{{ volume_name }}"
      hpe3par_volume:
        storage_system_ip="{{ storage_system_ip }}"
        storage_system_username="{{ storage_system_username }}"
        storage_system_password="{{ storage_system_password }}"
        state=present
        volume_name="{{ volume_name }}"
        cpg="{{ cpg }}"
        size="{{ size }}"
        size_unit="{{ size_unit }}"
      
    - name: Create VLUN
      hpe3par_vlun:
        storage_system_ip="{{ storage_system_ip }}"
        storage_system_username="{{ storage_system_username }}"
        storage_system_password="{{ storage_system_password }}"
        state=export_volume_to_host
        volume_name="{{ volume_name }}"
        host_name="{{ vlun_host_name }}"
        lunid="{{ lunid }}"
        autolun="{{ autolun }}"
  
```

Now let’s run the playbook.

```
ansible-playbook demo_playbook.yml
```

You should see the following output:

![image4 1528127766708_80](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/5/image4-1528127766708_80-1528129228459.png)

If you look at your HPE 3PAR array, you will now see it your new volume.

![image5](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/5/image5-1528128461213.png)

Congratulations on creating a playbook using the HPE 3PAR Storage modules for Ansible. 

The HPE 3PAR Storage modules make the job much simpler as well as you have greater flexibility in integrating HPE 3PAR into your DevOps and Operation team workflows. Again looking back at our original playbook example, it took 57 lines of code to simply read the volumes from the HPE 3PAR. We were able to create and then export the volume to a server in 37.

This really is just the beginning of what you can do with the HPE 3PAR Storage modules for Ansible. This was a standard provisioning playbook. You can create playbooks that include tasks from bare-metal provisioning, OS deployment, storage provisioning all the way to application deployment and management. You can take these playbooks and integrate them into Ansible Tower to build out a self-service portal.  

The future looks brighter than ever when it comes to HPE. The landscape of the datacenter is constantly changing and the demand for storage and rapid deployments continue to grow. Thank you for following this tutorial and hopefully it has been useful and sparked interest and ideas about how to use Ansible and HPE Storage. Wherever you are on your journey, we're very eager to hear what challenges exist out there today. I genuinely believe HPE can help out in a multitude of ways.
