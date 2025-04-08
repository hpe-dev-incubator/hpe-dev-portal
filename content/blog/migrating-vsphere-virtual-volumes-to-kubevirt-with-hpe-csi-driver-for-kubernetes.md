---
title: Migrating vSphere Virtual Volumes to KubeVirt with HPE CSI Driver for
  Kubernetes
date: 2025-04-21T15:00:00.000Z
featuredBlog: false
author: Michael Mattsson
authorimage: /img/portrait-192.png
disable: true
tags:
  - kubernetes
  - storage
  - kubevirt
  - vmware
---
When we talk about moving to the cloud and the in the advent of cloud repatriation there’s no denying that data has gravity. Sometimes we refer to this phenomenon as "Hotel California" referencing the American rock band song by the Eagles about being held captive within a hotel. Without a doubt, this concept springs to mind when we think about migrating virtual machines (VMs) within our private cloud between hypervisors. Is your data being held captive by your legacy virtual infrastructure? The most likely answer is "It depends". 

There are plenty of migration tools and options out there that will assist application owners to either copy data out, restore from a backup, or similar. This works great for small workloads with a handful of gigabytes. The downtime involved while making the transaction isn't very significant and can thus be performed within existing Service Level Agreements (SLA).

Consider the scenario where you have a large virtual file server with a complex file structure of tiny files where everyone knows that copying or restoring the file structure alone would take days and incremental updates would take hours to traverse. How do you tackle this challenge?

![](/img/intro.png "Migration workflow")

In this blog I’ll revisit the concept of [Lift and Transform Apps with HPE CSI Driver for Kubernetes](https://developer.hpe.com/blog/lift-and-transform-apps-with-hpe-csi-driver-for-kubernetes/) and I'll show you how to apply this same methodology in migrating large data volumes from VMware vSphere to KubeVirt using native features of the HPE CSI Driver for Kubernetes with HPE Alletra Storage MP B10000.

The intermediary clones of the source volume that is used to test migration before cutover is what makes the solution compelling and very powerful. Iteratively testing the migration workflow and carefully planning the cutover will prevent mishaps and unnecessary downtime that might occur with error prone copy and restore procedures.

This blog will go through each relevant step in detail. There’s also a short demo on YouTube that walks through the contents described below for readers who prefer a more audio-visual learning experience.

**Note to reviewer:** A YouTube video will be embedded here once available. Note the requested publication date of 4/21/25

# Assumptions

In this scenario we’ll work with a VM that uses a separate data volume for a MariaDB database. There’s one Fedora VM running on vSphere and one Fedora VM running on KubeVirt. A sample test database is being deployed, cloned and migrated where it’s easy to validate the contents of database from an application perspective at each checkpoint.

For full disclosure, Ansible playbooks are being provided in this blog post to better describe each step in the migration workflow. Since each application and environment will be different for each step of the way, it’s assumed that automation workflows to conduct the migration will be written according to the application’s best practices.

KubeVirt is running on OKD 4.17 (KubeVirt v1.3.1 and Kubernetes v1.30) and has HPE CSI Driver for Kubernetes v2.5.2 installed.

# Environment

The Ansible inventory consists of two VMs; one grouped as “kubevirt” and one grouped as “legacy” to distinguish which VM the plays are executed on. Both share a “common” group to allow certain prerequisites to be fulfilled on both VMs.

The entire migration workflow can easily be done with Ansible but certain steps are illustrated with the respective platform’s graphical user interfaces for demonstrative purposes.

```yaml
all:
  children:
    legacy:
      hosts: 
        mariadb-legacy:
          ansible_user: packer
          source_host_device: /dev/sdb
    kubevirt:
      hosts:
        mariadb-kubevirt:
          ansible_user: fedora
    common:
      children:
        legacy:
        kubevirt:
      vars:
        filesystem_label: mariadb-testdb
        var_lib_mysql: /var/lib/mysql
        test_db_tgz: https://github.com/datacharmer/test_db/releases/download/v1.0.7/test_db-1.0.7.tar.gz
```

The prerequisites playbook is idempotent and can be run as a sanity checker at any time to declare the VMs primed for either cloning or migration. It’s assumed there’s an empty data disk attached to the source VM residing on a VMware vSphere vVol datastore hosted by an HPE Alletra Storage MP B10000 or earlier system. Note that this workflow works with any HPE storage platform compatible with the HPE CSI Driver for Kubernetes. There are nuances on how cloning is executed and how to find the backing vVol volume name but the principles remain the same.

```yaml
---
# Attach data disk to VM prior
- hosts: legacy
  become: yes
  tasks:
  - name: Assert variables
    assert:
      that:
      - source_host_device
      - filesystem_label
      - test_db_tgz

  - name: Gather device info
    stat:
      path: "{{ source_host_device }}"
    register: source_host_device_exist

  - name: Make sure device exist
    assert:
      that:
      - source_host_device_exist.stat.isblk is true

  - name: Create filesystem on device with LABEL
    filesystem:
      dev: "{{ source_host_device }}"
      fstype: ext4
      opts: "-L {{ filesystem_label }}"

  - name: Mount filesystem and persist
    mount:
      path: "{{ var_lib_mysql }}"
      state: mounted
      src: "LABEL={{ filesystem_label }}"
      fstype: ext4

# Install MariaDB on both VMs and download Test_DB
- hosts: common
  become: yes
  tasks:
  - name: Install prereqs manually
    command: dnf install -y virt-what mariadb-server

  - name: Download Test_DB
    unarchive:
      src: "{{ test_db_tgz }}"
      remote_src: yes
      dest: "{{ ansible_user_dir }}"
      creates: test_db

# Disable/stop MariaDB on destination and remove mountpoint
- hosts: kubevirt
  become: yes
  tasks:
  - name: Disable MariaDB
    service:
      enabled: no
      state: stopped
      name: mariadb
  - name: Remove default MariaDB datadir
    file: 
      path: "{{ var_lib_mysql }}"
      state: directory
      recurse: true

# Start/enable MariaDB and deploy TestDB on source
- hosts: legacy
  become: yes
  tasks:
  - name: Set permissions
    file:
      path: "{{ var_lib_mysql }}"
      owner: mysql
      group: mysql
      mode: "0755"
      seuser: system_u
      serole: object_r
      setype: mysqld_db_t
      selevel: s0

  - name: Enable MariaDB
    service:
      name: mariadb
      state: started
      enabled: true

  - name: Deploy Test_DB
    shell: mysql < employees_partitioned.sql
    args:
      creates: "{{ var_lib_mysql }}/employees"
      chdir: "{{ ansible_user_dir }}/test_db"

  - name: Test Test_DB
    shell: mysql -t < test_employees_sha.sql && mysql -t <<< 'select @@hostname as 'VM';'
    args:
      chdir: "{{ ansible_user_dir }}/test_db"
    register: test_db_results

  - name: Show results
    pause:
      prompt: "{{ test_db_results.stdout }}"
      seconds: 10
```

Another detail in the playbook that might need clarification is that the Test_DB sources is downloaded to the destination VM only because the database queries are needed for validation of the cloning and migration.

The last few output lines of the playbook reveal that the database was deployed and tested properly.

```shell
...
+---------+--------+
| summary | result |
+---------+--------+
| CRC     | OK     |
| count   | OK     |
+---------+--------+
+----------------+
| VM             |
+----------------+
| mariadb-legacy |
+----------------+:
ok: [mariadb-legacy]

PLAY RECAP *************************************************************************
mariadb-kubevirt           : ok=6    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
mariadb-legacy             : ok=15   changed=2    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

Once the prerequisites have been installed, you can also inspect the hypervisor platform each VM is running on to ensure what you're doing is actually being executed where expected.

```shell
$ ansible -m command all -b -a virt-what
mariadb-legacy | CHANGED | rc=0 >>
vmware
mariadb-kubevirt | CHANGED | rc=0 >>
redhat
kvm
```

# Preparing for the first failure

What is being described in this blog is a perfectly canned example. In reality, the first experiment always fails. Maybe even the second, and third. The point is that it should be non-disruptive and easy to recover from the failures to iteratively improve as the migration is taken across the finish line with as brief downtime as possible. What happens before the cutover may take days and weeks of planning and risk-free test execution.

In the first iteration, the vSphere vVol needs to be cloned into a PersistentVolume (PV) using a Persistent Volume Claim (PVC). The PVC is then attached to the KubeVirt VM as a disk.

PVC creation may rely on pre-provisioned “static” PVs but more commonly a StorageClass is used to dynamically provision the PV. To allow the PV to clone a pre-existing volume on the storage array, the HPE CSI Driver for Kubernetes needs to be supplied a parameter with the corresponding volume name.

The CSI driver supports a construct that allows Kubernetes users to supply their own values to StorageClass parameters called “allowOverrides”. For this exercise, you'll need to craft a StorageClass that allows users to influence the “importVolumeName” (used for migration) and “importVolAsClone” (used for cloning).

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: legacy-migration
provisioner: csi.hpe.com
parameters:
  csi.storage.k8s.io/controller-expand-secret-name: hpe-backend
  csi.storage.k8s.io/controller-expand-secret-namespace: hpe-storage
  csi.storage.k8s.io/controller-publish-secret-name: hpe-backend
  csi.storage.k8s.io/controller-publish-secret-namespace: hpe-storage
  csi.storage.k8s.io/node-publish-secret-name: hpe-backend
  csi.storage.k8s.io/node-publish-secret-namespace: hpe-storage
  csi.storage.k8s.io/node-stage-secret-name: hpe-backend
  csi.storage.k8s.io/node-stage-secret-namespace: hpe-storage
  csi.storage.k8s.io/provisioner-secret-name: hpe-backend
  csi.storage.k8s.io/provisioner-secret-namespace: hpe-storage
  csi.storage.k8s.io/fstype: ext4
  description: "Volume cloned or imported by the HPE CSI Driver for Kubernetes"
  allowOverrides: importVolumeName,importVolAsClone
  compression: "false"
  provisioningType: ""
reclaimPolicy: Delete
allowVolumeExpansion: true
```

Users then call out the parameter and the value they desire in the PVC using an annotation.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: testdb-cloned
  namespace: hpe-vmi
  annotations:
    csi.hpe.com/importVolAsClone: dat-mariadbl-56480669
spec:
  volumeMode: Block
  storageClassName: legacy-migration
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 128Gi
```

So, where does “dat-mariadbl-56480669” come from? It’s the storage array volume name. It’s available to storage administrators of the storage array and it’s also available through the HPE Storage Integration Pack for VMware vCenter (SIP4VC) when used with HPE Alletra Storage MP B10000 and earlier platforms.

![](/img/sip4vc.png "Virtual machine view in SIP4VC")

Create the PVC and attach the PVC as a disk to the running KubeVirt VM.

```shell
$ kubectl create -f pvc-clone.yaml
```

Next, login to OKD.

![](/img/attach-disk.png "Attach disk to VM")

Once attached, a “migrate” playbook will mount the disk inside the VM and fire up the database and test it.

```yaml
---
# With PVC attached to the KubeVirt VM, mount and start MariaDB
- hosts: kubevirt
  become: yes
  tasks:
  - name: Mount filesystem and persist
    mount:
      path: "{{ var_lib_mysql }}"
      state: mounted
      src: "LABEL={{ filesystem_label }}"
      fstype: ext4

  - name: Ensure correct perms and SELinux labels
    file:
      path: "{{ var_lib_mysql }}"
      owner: mysql
      group: mysql
      mode: "0755"
      seuser: system_u
      serole: object_r
      setype: mysqld_db_t
      selevel: s0 
      recurse: yes
  - name: Enable MariaDB
    service:
      name: mariadb
      state: started
      enabled: true

  - name: Test Test_DB
    shell: mysql -t < test_employees_sha.sql && mysql -t <<< 'select @@hostname as 'VM';'
    args:
      chdir: "{{ ansible_user_dir }}/test_db"
    register: test_db_results

  - name: Show results
    pause:
      prompt: "{{ test_db_results.stdout }}"
      seconds: 10
```

Executing the playbook should reveal the test results and you can see the database is actually running on the KubeVirt VM.

```shell
...
+---------+--------+
| summary | result |
+---------+--------+
| CRC     | OK     |
| count   | OK     |
+---------+--------+
+------------------+
| VM               |
+------------------+
| mariadb-kubevirt |
+------------------+:
ok: [mariadb-kubevirt]

PLAY RECAP *************************************************************************
mariadb-kubevirt           : ok=6    changed=4    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

Success! The cloning process worked. Now, before finalizing with the actual volume. Let’s run a “detach” playbook to stop the database and unmount the filesystem.

```yaml
---
# With PVC attached to the KubeVirt VM, stop MariaDB and unmount the filesystem
- hosts: kubevirt
  become: yes
  tasks:
  - name: Make sure MariaDB is stopped and disabled
    service:
      name: mariadb
      state: stopped
      enabled: no

  - name: Remove data disk mounts
    mount:
      path: "{{ var_lib_mysql }}"
      state: absent
```

In the OKD UI, detach the volume and delete the PVC.

![](/img/detach-disk.png "Detach disk from VM")

```shell
$ kubectl delete -f pvc-clone.yaml
```

Next, let’s migrate the workload permanently.

# Finalizing

The last step involves simply shutting down the source vSphere VM to ensure the source volume isn’t accessed. Once the VM is properly shut down, create a PVC with the “importVolumeName” annotation to move the volume out of the vVol datastore and make it into a PV.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: testdb-migrated
  namespace: hpe-vmi
  annotations:
    csi.hpe.com/importVolumeName: dat-mariadbl-56480669
spec:
  volumeMode: Block
  storageClassName: legacy-migration
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 128Gi
```

Create the PVC.

```shell
$ kubectl create -f pvc-migrate.yaml
```

Now, repeat the step within OKD to attach the PVC as a disk to the running VM. Once attached, run the “migrate” playbook.

```shell
...
+---------+--------+
| summary | result |
+---------+--------+
| CRC     | OK     |
| count   | OK     |
+---------+--------+
+------------------+
| VM               |
+------------------+
| mariadb-kubevirt |
+------------------+:
ok: [mariadb-kubevirt]

PLAY RECAP *************************************************************************
mariadb-kubevirt           : ok=6    changed=4    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

You should see identical results as during the cloning procedure.

Next, delete the source VM in vCenter and plan the next migration.

# Learn more

I’ve barely scratched the surface of the HPE CSI Driver for Kubernetes features with HPE Alletra Storage MP B10000. The “allowOverrides” construct along with “importVolAsClone” and “importVolumeName” lends itself to many different use cases where data migration is one of them. Importing a “foreign” volume to Kubernetes enables sophisticated DevOps processes where terabytes of data can be made available to developers, data analysts, and testing frameworks using CI/CD pipelines.

Visit [scod.hpedev.io](http://scod.hpedev.io) to learn more about the HPE CSI Driver for Kubernetes and neighboring technologies. Sign up to the [HPE Developer Community Slack](https://developer.hpe.com/slack-signup/) to interact with HPE staff and technologists from customers and partners.

New to KubeVirt? Check out the author’s previous blog post on [management paradigms for virtual machines running on Kubernetes](https://developer.hpe.com/blog/management-paradigms-for-virtual-machines-running-on-kubernetes/).
