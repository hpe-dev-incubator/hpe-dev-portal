---
title: " Get started with the HPE Nimble Storage Content Collection for Ansible "
date: 2020-09-29T18:33:30.419Z
author: Michael Mattsson 
tags: ["hpe-nimble-storage","ansible"]
path: get-started-with-the-hpe-nimble-storage-content-collection-for-ansible
---
With the initial release of the [HPE Nimble Storage Content Collection for Ansible](https://community.hpe.com/t5/around-the-storage-block/introducing-hpe-nimble-storage-content-collection-for-ansible/ba-p/7103452), it’s now possible to manage many aspects of a Nimble array using either Red Hat Ansible Tower or open source Ansible. Ansible is an IT automation platform that embraces an idempotent resource model, which is essential in declarative infrastructure management paradigms. In this blog post, we’ll go through a few examples on how to kickstart your Ansible automation projects with the newly released HPE Nimble Storage modules.

<img src="https://developer.hpe.comhttps://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/screen-shot-2020-10-01-at-15454-pm-1601594378015.png">

All the functionality is embedded in the content collection as modules. For the initial release, these are the available modules.

| Module | Description |
|--------| ------------|
| `hpe_nimble_access_control_record` | Manage access control records |
| `hpe_nimble_array` | Manage array |
| `hpe_nimble_chap_user` | Manage iSCSI CHAP users |
| `hpe_nimble_disk` | Manage disks and media |
| `hpe_nimble_encryption` | Manage encryption settings |
| `hpe_nimble_fc` | Manage fibre channel configuration |
| `hpe_nimble_group` | Manage the array group |
| `hpe_nimble_info` | Query and collect information of any resource from an array |
| `hpe_nimble_initiator_group` | Manage initiator groups |
| `hpe_nimble_network` | Manage network configuration |
| `hpe_nimble_partner` | Manage replication partners |
| `hpe_nimble_performance_policy` | Manage performance policies |
| `hpe_nimble_pool` | Manage storage pools |
| `hpe_nimble_protection_schedule` | Manage protection schedules |
| `hpe_nimble_protection_template` | Manage protection templates |
| `hpe_nimble_shelf` | Manage shelves |
| `hpe_nimble_snapshot_collection` | Manage snapshot collections |
| `hpe_nimble_snapshot` | Manage volume snapshots |
| `hpe_nimble_user` | Manage array users |
| `hpe_nimble_user_policy` | Manage array user policies |
| `hpe_nimble_volume` | Manage volumes |
| `hpe_nimble_volume_collection` | Manage volume collections |

All modules are documented per Ansible community standards. The modules have not yet been merged into the official Collection Index and documentation is provided from [the GitHub repo](https://hpe-storage.github.io/nimble-ansible-modules) as a temporary solution.

# Preface

In the following examples there is one node acting as the Ansible management host (node21) and there are two nodes (node22 and node23) acting as iSCSI SAN hosts. There’s one HPE Nimble Storage array (nva) in the environment. Since an Ansible collection is a fairly new construct in the Ansible universe, version 2.9 is required, along with Python 3.6 or newer for the HPE Nimble Storage SDK for Python (which the Ansible modules rely on). We’ll also assume that iSCSI, multipathing and SAN connectivity is established between the SAN hosts and the HPE Nimble Storage array. NimbleOS 5.0 or newer is required on the array. These requirements are also listed with [the modules' documentation](https://hpe-storage.github.io/nimble-ansible-modules/).

<img src="https://developer.hpe.comhttps://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/9/hpedev-alster-for-blog-reva-1601597390641.png">

Since the collection contains more than a whopping twenty two modules, one blog post won’t be able to cover the entire suite. Expect a series of blog posts over the coming months to cover more use cases. In this first installment, we’ll cover basic volume provisioning, snapshotting, cloning, inspecting, mutations and ultimately decommissioning volumes. Host attachment included!

> Note: All examples listed below are available in [this GitHub repo](https://github.com/NimbleStorage/automation-examples) (change directory to `ansible/introduction`).

# Installation

No special privileges are needed on the Ansible host. Privileges are needed on managed hosts where we want to attach storage. Let’s begin with installing Ansible and the required HPE Nimble Storage SDK for Python using `pip`.

```
$ pip3 install ansible nimble-sdk --user
```

Next, use `ansible-galaxy` to install the HPE Nimble Storage Content Collection for Ansible.

```
$ ansible-galaxy collection install hpe.nimble
```

We’re now ready to create an inventory and start writing playbooks to manage storage resources.

# Inventory

There are many different ways to write inventory files (classic .ini or YAML) and store variables. In this series of playbooks the variables will be stored with the nodes in the inventory groups. Playbooks will use the `-e` flag to provide "extra" variables to make the playbooks reusable for different nodes and storage resources. In a scenario where the infrastructure is managed via source code management (SCM), resources and nodes would be stored in separate variable files.

```
[nodes]
node22 ansible_host=192.168.159.22
node23 ansible_host=192.168.159.23

[nodes:vars]
ansible_user=vagrant
ansible_password=vagrant

[arrays]
nva nimble_host=192.168.59.130 nimble_discovery_ip=192.168.59.130

[arrays:vars]
ansible_connection=local
nimble_user=admin
nimble_pass=admin

[all:vars]
ansible_python_interpreter=/usr/bin/python3
```

Let’s break these sections down:
- **[nodes]** A group of my SAN connected nodes, name resolution is not working in my sandbox so I need to address nodes by IP address
- **[nodes:vars]** All nodes will share these variables
- **[arrays]** A group of arrays I have available in my environment, each with my custom variables to access the REST API and iSCSI discovery IP address
- **[arrays:vars]** All arrays will share these variables, **ansible_connection** is set to local as Ansible is not logging in to the array itself, only indirect via the REST API
- **[all:vars]** Ansible will run on any available Python version (near enough) the Nimble SDK require Python 3.6 or newer

> Note: Don’t put passwords in your inventory file. Use encrypted variable files with `ansible-vault` for that purpose.

Also, an `ansible.cfg` is put in place to pickup the `inventory` file in the current directory.

```
[defaults]
inventory = inventory
```

# Hello world

A pattern I usually employ before doing anything is to check if my inventory is reachable. 

```
$ ansible -m ping all
nva | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
node22 | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
node23 | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
```

I created a playbook that would simplify future playbooks by creating the initiator groups for all nodes on all arrays. Initiator groups are required for assigning access control records (ACRs) to volumes so they could also be incorporated in a task just before assigning the ACR.

```
---
- name: Retrieve node facts
  hosts: nodes

- name: Create iSCSI initators for hosts in nodes group
  gather_facts: false
  hosts: arrays
  collections:
    - hpe.nimble
  tasks:
    - name: Add host
      hpe_nimble_initiator_group:
        host: "{{ nimble_host }}"
        username: "{{ nimble_user }}"
        password: "{{ nimble_pass }}"
        access_protocol: iscsi
        name: "{{ item }}"
        iscsi_initiators: [
          {
            iqn: "{{ hostvars[item]['ansible_iscsi_iqn'] }}",
            label: "{{ item }}"
          }
        ]
        description: "Initiator Group for {{ item }}"
        state: present
      with_items: "{{ groups.nodes }}"
```

Pay attention to the `collections` stanza. That allows the modules to be discovered properly. It’s also possible to omit the collections stanza but then modules need to be called out with their fully qualified names, `hpe.nimble.hpe_nimble_initiator_group`, which isn’t very pretty to look at.

That said, the fully qualified module name is good to know about. If you need to look up any of the module options or examples, it’s available right at your fingertips. For example, to look up the documentation for the `hpe_nimble_initiator_group` module, simply use the `ansible-doc` command.

```
$ ansible-doc hpe.nimble.hpe_nimble_initiator_group
```

Next, run the playbook.

```
$ ansible-playbook connect.yaml

PLAY [Retrieve node facts] *****************************************************

TASK [Gathering Facts] *********************************************************
ok: [node23]
ok: [node22]

PLAY [Create iSCSI initators for hosts in nodes group] *************************

TASK [Add host] ****************************************************************
ok: [nva] => (item=node22)
ok: [nva] => (item=node23)

PLAY RECAP *********************************************************************
node22                     : ok=1    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
node23                     : ok=1    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
nva                        : ok=1    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

The output will vary depending on if the initiator groups already exists or not. This playbook could be re-run for each inventory update to ensure all initiator groups exist as expected.

# Volume provisioning

The next example provide a whole lot more content. The purpose of `provision.yaml` is to:

- Create a new Nimble volume, **volume_name**, on **nimble_array**
- Create an ACR for the **volume_igroup**
- Discover and attach the volume from the host
- Format the volume and mount it on the host
- Make the filesystem writeable by an application

There’s also an optional parameter, `volume_size`. It falls back to `1000` (MiB) if not specified.

By parameterizing the playbook, it becomes very flexible to reuse. It could also quite easily be turned into an Ansible role to make it even more reusable between projects.

``` 
---
- name: Provision a Nimble Volume to a SAN host 
  gather_facts: false
  connection: local
  hosts: "{{ nimble_array }}"
  collections:
    - hpe.nimble
  tasks:
    - block:
        - name: Create Volume
          hpe_nimble_volume:
            host: "{{ nimble_host }}"
            username: "{{ nimble_user }}"
            password: "{{ nimble_pass }}"
            state: present
            name: "{{ volume_name }}"
            size: "{{ volume_size | default('1000') }}"
            description: "Volume for {{ volume_igroup }}"
          register: volume
        
        - name: Set facts to pass on to node play
          set_fact:
            volume_target_name: "{{ volume.attrs.target_name }}"
            volume_serial_number: "{{ volume.attrs.serial_number }}"

      when: volume_clone is not defined

    - block: 
        - name: Create Volume from Snapshot
          hpe_nimble_volume:
            host: "{{ nimble_host }}"
            username: "{{ nimble_user }}"
            password: "{{ nimble_pass }}"
            state: present
            name: "{{ volume_name }}"
            size: "{{ volume_size | default('1000') }}"
            description: "Volume for {{ volume_igroup }}"
            snapshot: "{{ snapshot_name | default(False) }}"
            clone: "{{ volume_clone | default(False) }}"
            parent: "{{ clone_from | default(False) }}"
          register: volume
 
        - name: Set facts to pass on to node play
          set_fact:
            volume_target_name: "{{ volume.attrs.target_name }}"
            volume_serial_number: "{{ volume.attrs.serial_number }}"

      when: volume_clone is defined

    - name: Create ACR
      hpe_nimble_access_control_record:
        host: "{{ nimble_host }}"
        username: "{{ nimble_user }}"
        password: "{{ nimble_pass }}"
        state: present
        initiator_group: "{{ volume_igroup }}"
        volume: "{{ volume_name }}"

- name: Attach a volume, format and mount it on a host
  hosts: "{{ volume_igroup }}"
  tasks:
    - name: Discover Target
      become: yes
      open_iscsi:
        portal: "{{ hostvars[nimble_array]['nimble_discovery_ip'] }}"
        discover: yes
        show_nodes: yes
    
    - name: Attach Target
      become: yes
      open_iscsi:
        target: "{{ hostvars[nimble_array]['volume_target_name'] }}"
        login: yes
        automatic: yes
        show_nodes: yes

    - name: Set volume device fact
      set_fact:
        volume_device_path: /dev/disk/by-id/dm-uuid-mpath-2{{ hostvars[nimble_array]['volume_serial_number'] }}

    - name: Create Filesystem
      become: yes
      filesystem:
        fstype: xfs
        dev: "{{ volume_device_path }}"
    
    - name: Mount the Volume
      become: yes
      mount:
        fstype: xfs
        state: mounted
        path: /mnt/{{ volume_name }}
        src: "{{ volume_device_path }}"

    - name: Set Permissions
      become: yes
      file:
        owner: "{{ ansible_env.LOGNAME }}"
        path: /mnt/{{ volume_name }}
```

There are a few opinionated decisions made here, like mounting the filesystem under `/mnt/volume_name`, but other than that, the example is quite comprehensive. Let’s run it!

```
$ ansible-playbook provision.yaml -e nimble_array=nva \
    -e volume_name=myvol1 -e volume_igroup=node22
    
PLAY [Provision a Nimble Volume to a SAN host] *********************************************************************************

TASK [Create Volume] ***********************************************************************************************************
changed: [nva]

TASK [Set facts to pass on to node play] ***************************************************************************************
ok: [nva]

TASK [Create Volume from Snapshot] *********************************************************************************************
skipping: [nva]

TASK [Set facts to pass on to node play] ***************************************************************************************
skipping: [nva]

TASK [Create ACR] **************************************************************************************************************
changed: [nva]

PLAY [Attach a volume, format and mount it on a host] **************************************************************************

TASK [Gathering Facts] *********************************************************************************************************
ok: [node22]

TASK [Discover Target] *********************************************************************************************************
ok: [node22]

TASK [Attach Target] ***********************************************************************************************************
changed: [node22]

TASK [Set volume device fact] **************************************************************************************************
ok: [node22]

TASK [Create Filesystem] *******************************************************************************************************
changed: [node22]

TASK [Mount the Volume] ********************************************************************************************************
changed: [node22]

TASK [Set Permissions] *********************************************************************************************************
changed: [node22]

PLAY RECAP *********************************************************************************************************************
node22                     : ok=7    changed=4    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
nva                        : ok=3    changed=2    unreachable=0    failed=0    skipped=2    rescued=0    ignored=0

```

Bliss! A new volume was created and correctly mapped to the node. On the node, the LUN was discovered, attached, formatted and mounted (including adding an entry to `/etc/fstab`) and is ready for use. This can be inspected by calling the `command` or `shell` module ad hoc.

``` 
$ ansible -m command node22 -a 'df -h /mnt/myvol1'
node22 | CHANGED | rc=0 >>
Filesystem                                     Size  Used Avail Use% Mounted on
/dev/mapper/223119d4f2e94525f6c9ce900e7f81e0a  997M   33M  965M   4% /mnt/myvol1
```

# Inspecting and mutating resources 

Among the list of modules there’s a module not specifically mapped to a resource — the `hpe_nimble_info` module. This module is a very powerful query tool that allows you to extract any piece of metadata from every API resource available on the array. The result set can also be filtered and limited in the query, hence preserving resources as the array only has to return the objects and metadata being requested. This functionality is also available in the Python SDK and the REST API directly and it made perfect sense to make it available natively in Ansible.

Let’s grab some attributes from the volume we just created. 

```
---
- name: Query a Nimble array volume
  gather_facts: false
  connection: local
  hosts: "{{ nimble_array }}"
  collections:
    - hpe.nimble
  tasks:
    - name: Inspect volume
      hpe_nimble_info:
        host: "{{ nimble_host }}"
        username: "{{ nimble_user }}"
        password: "{{ nimble_pass }}"
        gather_subset:
          - volumes:
              query:
                name: "{{ volume_name }}"
              fields:
                - limit_iops
                - description
                - iscsi_sessions
      register: query

    - name: Results
      debug:
        var: query
```

Here we’re gathering the IOPS limit of the volume along with the iSCSI sessions and description. Let’s see what we get.

```
$ ansible-playbook query.yaml -e nimble_array=nva -e volume_name=myvol1

PLAY [Query a Nimble array volume] *********************************************************************************************

TASK [Inspect volume] **********************************************************************************************************
ok: [nva]

TASK [Results] *****************************************************************************************************************
ok: [nva] => {
    "query": {
        "changed": false,
        "failed": false,
        "message": "Fetched the subset details.",
        "nimble_info": {
            "volumes": [
                {
                    "description": "Volume for node22",
                    "iscsi_sessions": [
                        {
                            "data_digest_enabled": false,
                            "header_digest_enabled": false,
                            "id": "346c943e6f668ac68800000000000000000000000f",
                            "initiator_ip_addr": "192.168.59.190",
                            "initiator_name": "iqn.1994-05.com.redhat:bcbe2e27f0",
                            "num_connections": 1,
                            "pr_key": 0,
                            "session_id": "346c943e6f668ac68800000000000000000000000f",
                            "target_ip_addr": "192.168.59.132"
                        }
                    ],
                    "limit_iops": -1
                }
            ]
        },
        "return_status": true
    }
}

PLAY RECAP *********************************************************************************************************************
nva                        : ok=2    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0

```

The registered fact returned exactly what we asked for, the IOPS limit, description and details about the iSCSI sessions.

Many attributes of a resource can be mutated during runtime. In this example, I want to set a new volume description and limit the IOPS to 1000 for a particular volume. Since Ansible is idempotent, you can add the `limit_iops` and `description` to the “Create Volume” stanza in the `provision.yaml` playbook. But then all subsequent volumes created from the playbook will get the same attributes.

Let’s create a playbook to mutate these fields.

```
---
- name: Mutate a Nimble array volume
  gather_facts: false
  connection: local
  hosts: "{{ nimble_array }}"
  collections:
    - hpe.nimble
  tasks:
    - name: Mutate volume
      hpe_nimble_volume:
        host: "{{ nimble_host }}"
        username: "{{ nimble_user }}"
        password: "{{ nimble_pass }}"
        limit_iops: "{{ volume_iops | default('-1') }}"
        description: "{{ volume_description | default('') }}"
        name: "{{ volume_name }}"
        state: present
```

Run the playbook with a few extra variables.

```
$ ansible-playbook tune.yaml -e nimble_array=nva \
    -e volume_name=myvol1 -e volume_iops=1000 \
    -e "volume_description='Mutated by Ansible'"

PLAY [Mutate a Nimble array volume] ********************************************************************************************

TASK [Mutate volume] ***********************************************************************************************************
changed: [nva]

PLAY RECAP *********************************************************************************************************************
nva                        : ok=1    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0

```

If we re-run the query, we should be able to see the IOPS has been capped and the description updated.

```
$ ansible-playbook query.yaml -e nimble_array=nva -e volume_name=myvol1

PLAY [Query a Nimble array volume] *********************************************************************************************

TASK [Inspect volume] **********************************************************************************************************
ok: [nva]

TASK [Results] *****************************************************************************************************************
ok: [nva] => {
    "query": {
        "changed": false,
        "failed": false,
        "message": "Fetched the subset details.",
        "nimble_info": {
            "volumes": [
                {
                    "description": "Mutated by Ansible",
                    "iscsi_sessions": [
                        {
                            "data_digest_enabled": false,
                            "header_digest_enabled": false,
                            "id": "346c943e6f668ac68800000000000000000000000f",
                            "initiator_ip_addr": "192.168.59.190",
                            "initiator_name": "iqn.1994-05.com.redhat:bcbe2e27f0",
                            "num_connections": 1,
                            "pr_key": 0,
                            "session_id": "346c943e6f668ac68800000000000000000000000f",
                            "target_ip_addr": "192.168.59.132"
                        }
                    ],
                    "limit_iops": 1000
                }
            ]
        },
        "return_status": true
    }
}

PLAY RECAP *********************************************************************************************************************
nva                        : ok=2    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0

```

This is a very brief demonstration on how to accomplish a storage management task in a simple and reusable manner. This playbook could be put on a crontab to throttle IOPS at certain times of day to accommodate a certain business need. It can also be made available to application owners who want to be able to tweak their application storage resources. It’s then practical to use something like Ansible Tower to enable role-based access control (RBAC) for inventories and playbooks. We’ll cover Ansible Tower in a future blog. Stay tuned!

# Snapshotting and cloning

Very advanced workflows can be put together using the snapshot capabilities of the HPE Nimble Storage array. In this very brief example, we’ll create a snapshot of the volume that just got created and attach it to our second host in the inventory. 

First, create some content and flush the buffers. This way we’ll have something to look at once our clone comes up on the target host.

```
$ ansible -m shell node22 -a 'date > /mnt/myvol1/date.txt && sync'
node22 | CHANGED | rc=0 >>
```

Next, create a snapshot with the `snapshot.yaml` playbook.

```
---
- name: Create a Snapshot of a Nimble Volume
  gather_facts: false
  connection: local
  hosts: "{{ nimble_array }}"
  collections:
    - hpe.nimble
  tasks:
    - name: Snapshot operation
      hpe_nimble_snapshot:
        host: "{{ nimble_host }}"
        username: "{{ nimble_user }}"
        password: "{{ nimble_pass }}"
        volume: "{{ volume_name }}"
        name: "{{ snapshot_name }}"
        description: "Snapshot created by Ansible"
        state: "{{ snapshot_state | default('present') }}”
```

Snapshot!

```
$ ansible-playbook snapshot.yaml -e nimble_array=nva \
    -e volume_name=myvol1 -e snapshot_name=mysnap1

PLAY [Create a Snapshot of a Nimble Volume] ************************************************************************************

TASK [Snapshot operation] ******************************************************************************************************
changed: [nva]

PLAY RECAP *********************************************************************************************************************
nva                        : ok=1    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0

```

There’s now a snapshot named “mysnap1” on “myvol1”. We want to create a clone from that snapshot for our new volume that we’re attaching to the second host in the inventory. We’ll reuse the `provision.yaml` playbook by simply adding a few more variables: `snapshot_name`, `volume_clone` and `clone_from`.

```
$ ansible-playbook provision.yaml -e nimble_array=nva \
    -e volume_name=myvol1-clone -e snapshot_name=mysnap1 \
    -e volume_clone=yes -e clone_from=myvol1 \
    -e volume_igroup=node23

PLAY [Provision a Nimble Volume to a SAN host] *********************************************************************************

TASK [Create Volume] ***********************************************************************************************************
skipping: [nva]

TASK [Set facts to pass on to node play] ***************************************************************************************
skipping: [nva]

TASK [Create Volume from Snapshot] *********************************************************************************************
changed: [nva]

TASK [Set facts to pass on to node play] ***************************************************************************************
ok: [nva]

TASK [Create ACR] **************************************************************************************************************
changed: [nva]

PLAY [Attach a volume, format and mount it on a host] **************************************************************************

TASK [Gathering Facts] *********************************************************************************************************
ok: [node23]

TASK [Discover Target] *********************************************************************************************************
ok: [node23]

TASK [Attach Target] ***********************************************************************************************************
changed: [node23]

TASK [Set volume device fact] **************************************************************************************************
ok: [node23]

TASK [Create Filesystem] *******************************************************************************************************
ok: [node23]

TASK [Mount the Volume] ********************************************************************************************************
changed: [node23]

TASK [Set Permissions] *********************************************************************************************************
ok: [node23]

PLAY RECAP *********************************************************************************************************************
node23                     : ok=7    changed=2    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
nva                        : ok=3    changed=2    unreachable=0    failed=0    skipped=2    rescued=0    ignored=0

```

We should now be able to do a visual inspect of the content from our two nodes. Let’s check the file we just created before the snapshot got created.

```
$ ansible -m command node22 -a 'cat /mnt/myvol1/date.txt'
node22 | CHANGED | rc=0 >>
Tue Sep 29 02:17:11 UTC 2020
$ ansible -m command node23 -a 'cat /mnt/myvol1-clone/date.txt'
node23 | CHANGED | rc=0 >>
Tue Sep 29 02:17:11 UTC 2020
```

Presto! The clone may now be manipulated safely without impacting the parent.

In future blogs, we’ll explore how to structure playbooks to idempotent “refresh” a clone from a parent in a safe and secure manner. That, in turn, empowers users to access volumes to allow dev and test on production-like data without running the risk of mistakingly disrupting mission-critical applications.

# Volume decommissioning

Housekeeping is important. What’s being provisioned should also be able to get decommissioned in the same manner. Since provisioning a storage resource and attaching it to a host is a multi-task playbook, one can’t simply declare it “absent”. Tasks needs to be stacked in the reverse order with different verbs to effectively dismantle the data access and volumes.

For completeness, here’s how to unmount and detach a volume from a host and subsequently offline and delete the volume from the Nimble array.

```
---
- name: Prepare to delete Nimble Volume
  gather_facts: false
  connection: local
  hosts: "{{ nimble_array }}"
  collections:
    - hpe.nimble
  tasks:
    - name: Fetch Volume info
      hpe_nimble_info:
        host: "{{ nimble_host }}"
        username: "{{ nimble_user }}"
        password: "{{ nimble_pass }}"
        gather_subset:
          - volumes:
              fields:
                - target_name
              query:
                name: "{{ volume_name }}"
              detail: True
      register: volumes
      failed_when: volumes.nimble_info.volumes.0.target_name is not defined

    - name: Set facts to pass on to node play
      set_fact:
        volume_target_name: "{{ volumes.nimble_info.volumes.0.target_name }}"

- name: Unmount and detach a Nimble Volume from a host
  hosts: "{{ volume_igroup }}"
  tasks:
    - name: Unmount the Volume
      become: yes
      mount:
        fstype: xfs
        state: absent
        path: /mnt/{{ volume_name }}
    
    - name: Detach Target
      become: yes
      open_iscsi:
        target: "{{ hostvars[nimble_array]['volume_target_name'] }}"
        login: no

    - name: Delete Target
      become: yes
      command: iscsiadm -m node -o delete -T {{ hostvars[nimble_array]['volume_target_name'] }}

- name: Delete a Nimble Volume
  gather_facts: false
  connection: local
  hosts: "{{ nimble_array }}"
  tags:
    - array_only
  collections:
    - hpe.nimble
  tasks:
    - name: Offline Volume
      hpe_nimble_volume:
        host: "{{ nimble_host }}"
        username: "{{ nimble_user }}"
        password: "{{ nimble_pass }}"
        state: present
        online: False
        force: True
        name: "{{ volume_name }}"
      register: offline
      until: offline is not failed

    - name: Delete Volume
      hpe_nimble_volume:
        host: "{{ nimble_host }}"
        username: "{{ nimble_user }}"
        password: "{{ nimble_pass }}"
        state: absent
        name: "{{ volume_name }}"
```

Let’s run it! Beware — this operation is irreversible. Make sure volume names and nodes are correct. We'll start with the clone, as the parent can't be removed unless all dependent volumes have been destroyed.

```
$ ansible-playbook decommission.yaml -e nimble_array=nva \
    -e volume_name=myvol1-clone -e volume_igroup=node23

PLAY [Prepare to delete Nimble Volume] *****************************************

TASK [Fetch Volume info] *******************************************************
ok: [nva]

TASK [Set facts to pass on to node play] ***************************************
ok: [nva]

PLAY [Unmount and detach a Nimble Volume from a host] **************************

TASK [Gathering Facts] *********************************************************
ok: [node22]

TASK [Unmount the Volume] ******************************************************
changed: [node22]

TASK [Detach Target] ***********************************************************
changed: [node22]

TASK [Delete Target] ***********************************************************
changed: [node22]

PLAY [Delete a Nimble Volume] **************************************************

TASK [Offline Volume] **********************************************************
changed: [nva]

TASK [Delete Volume] ***********************************************************
changed: [nva]

PLAY RECAP *********************************************************************
node22                     : ok=4    changed=3    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
nva                        : ok=4    changed=2    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

Go ahead and destroy the parent volume.

```
$ ansible-playbook decommission.yaml -e nimble_array=nva \
    -e volume_name=myvol1 -e volume_igroup=node22

...

PLAY RECAP *********************************************************************************************************************
node22                     : ok=4    changed=3    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
nva                        : ok=4    changed=2    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0

```

# Next steps

Expect more content on HPE DEV to frame more use cases relevant for automating storage management with the Ansible modules. This will include more advanced snapshot and clone management, scheduling and resource life-cycles. We also plan on going through user management, advanced reporting and network configuration. Every module will be touched on to describe its use and options to derive value from infrastructure automation.

The HPE Nimble Storage Content Collection for Ansible is available immediately and installable from [Ansible Galaxy](https://galaxy.ansible.com/hpe/nimble/) and the certified collection is also available on [Red Hat Automation Hub](https://cloud.redhat.com/ansible/automation-hub/hpe/nimble).

- Check out [the documentation](https://hpe-storage.github.io/nimble-ansible-modules/) on the hosted GitHub Pages
- The content collection is hosted in the [hpe.nimble](https://galaxy.ansible.com/hpe/nimble) namespace on Ansible Galaxy
- Source Code [is available](https://github.com/hpe-storage/nimble-ansible-modules) on GitHub
- Read the product announcement on [Around The Storage Block](https://community.hpe.com/t5/around-the-storage-block/introducing-hpe-nimble-storage-content-collection-for-ansible/ba-p/7103452)

We are open to feedback and collaboration. Join us on the HPE DEV Slack community and hang out with the team in #NimbleStorage. Signup [here](https://slack.hpedev.io) and join us at [hpedev.slack.com](https://hpedev.slack.com/archives/C7TTAHRUN).