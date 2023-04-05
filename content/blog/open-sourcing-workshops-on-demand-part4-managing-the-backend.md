---
title: "Open Sourcing Workshops-on-Demand part 4: Manage the Backend"
date: 2023-03-03T13:27:23.312Z
author: Frederic Passeron
authorimage: /img/frederic-passeron-hpedev-192.jpg
disable: false
---
I﻿n previous articles of this series dedicated to the [open sourcing of our Workshops-on-Demand project](https://developer.hpe.com/blog/willing-to-build-up-your-own-workshops-on-demand-infrastructure/), I covered the reasons why we open sourced  the project, how we did it. I also explained in details how you could install your own Workshops-on-Demand backend server. I also took the time to detail the automation that was hosted on this backend server. Today, I plan to describe to you the management of this backend server. What is often refered to as day2 operations.

O﻿nce up and running, the backend server main purpose is to deliver workshops-on-Demand. But to do so, it may require updates, upgrades, new kernels for the Jupyterhub server. If new workshops are created, this means new jinja templates for related workshops' scripts (`create<WKSHP>.sh`, `cleanup<WKSHP>.sh`, `reset<WKSHP>.sh`among others). This also means new variables files. And obviously, these templates and variables will need to be taken into account by scripts and notebooks. Some tasks handle all of this. And we will see now how.

#### B﻿ackend server management:

If you take a look at the file structure of the `wod-backend` directory, you will discover that we did our best to sort things properly depending on their relationship to system  or workshops.

##### C﻿ontent of the backend server:

S﻿imple tree view of the wod-backend directory:

![](/img/wod-blogserie2-tree4.png "Tree view of wod-backend directory")

T﻿he `ansible` folder contains all the necessary playbooks and variables files to support the main functions of the backend server. It provides playbooks for installation of the server or appliances, setup of the servers (backend, frontend, api-db),of appliances or workshops as well as maintenance tasks.

A﻿t the root of this directory can be found:

`C﻿heck*.yml playbooks`: These playbooks are used to perform checks on the different systems. These checks ensure that this a compliant WoD system by checking Firewall rules and many other things. We will see this a bit later in more details.

`C﻿opy_folder.yml`: This is historically one of very first playbook we used and therefore a very important one. It performs the necessary actions to deploy, personnalize (by substituting ansible variables) the selected notebook to the appropriate student home folder.

`c﻿ompile_scripts.yml`: Should you need to hide from the student a simple api call that is made on some private endpoint with non shareable data (credentials for instance), this playbook will make sure to compile it and create a executable file allowing it to happen. 

`d﻿istrib.yml`: This playbook retrieves the distribution name and version from the machine it is run on.

`install_*.yml`: These playbooks take care of installing the necessary packages needed by the defined type (frontend, backend, api-db, base-system or even appliance)

`setup_*.ym`: There are several types of setup playbooks in this directory. 

* `setup_WKSHP-*.yml`: These playbooks are responsible for preparing a base appliance for a given workshop by adding and configuring the necessary packages or services related to the workshop.
* `s﻿etup_appliance.yml`: this playbook is used to perform the base setup for a JupyterHub environment server or appliance. It includes setup_base_appliance.yml playbook.
* `s﻿etup_base_appliance`: takes care of setting the minimal requierements for an appliance. it includes therefore `install_base_system.yml` playbook. On top of it, it creates and configure the necessary users.
* `s﻿etup_docker_based_appliance.yml`: Quite self explanatory ? it performs setup tasks to enable docker on a given appliance.

It also hosts the `inventory` file describing the role of jupyterhub servers. Place your jupyterhub machine (FQDN) in a group used as PBKDIR namerole

```shellsession
#
# Place to your jupyterhub machine (FQDN) in a group used as PBKDIR name
#
[production]
127.0.0.1  ansible_connection=localhost
```

T﻿he `conf` folder hosts configuration files in a jinja format. Once expanded, the resulting files will be used by relevant workshops. I will explain in a future article all the steps and requirements to create a workshop.

A﻿s part of the refacturing work to open source the project, we reaaranged the different scripts locations. We have created an install folder to handle the different installation scripts either from a Jupyterhub 's perpective or from an appliance 's standpoint too.

We separated the workshops related scripts from the pure system ones. When one creates a workshop, one needs to provide a series of notebooks and in some cases some scripts to manage the creation, setup of a related appliance along with additional scripts to manage its lifecycle in the overall workshops-on-Demand architecture (Create, Cleanup, Reset scripts at deployment or Cleanup times). These scripts need to be located in the script folder. On the other hand, the system scripts are located in the sys folder.

![](/img/tree-wkshop2.png "Tree view of the sys directory")

t﻿his directory hosts important configuration files for the system, for Jupyterhub. You can see for instance `fail2ban` configuration files. Some jinja templates are present here too. These templates will be expanded trough the deliver mechanism allowing the creation of files customized with ansible variables. All the wod related tasks are prefixed with wod for better understanding and ease of use.  

They can refer to some Jupyterhub kernel needs like wod-build-evcxr.sh.j2 that aims at creating a script allowing the rust kernel installation. Some other templates are related to the system and Jupyterhub. `wod-kill-processes.pl.j2` has been created after discovering the harsh reality of online mining...In a ideal world, I would not have to explain further as the script would not be needed. Unfortunately, this is not the case, when one offers access to some harware freely online, he can expect sooner or later to  see his original and pure idea to be highjacked...Let's say that you want to provide some AI/ML 101 type of workshops, you may consider providing servers with some GPUs. Any twisted minded cryptominer discovering your ressources will definitely think he hits the jackpot! This little anecdot actually happened to us and not only on GPU based servers, some regular servers got hit as well. We found out that performance on some servers became very poor and wehen looking into it, we found some scripts that were not supposed to be here and to run here...As a result, we implemented monitors to check load on our server and make sure that to  kill any suspicious process before kicking out the misbehaving student.

`wod-test-action.sh.j2` is another interesting template that will create a script that we use for testing. This script mimics the procmail API and allows you to  test the deployment of a workshop from the shell. 

```shellsession
wodadmin@server:/usr/local/bin$ ./wod-test-action.sh
Syntax: wod-test-action.sh <CREATE|CLEANUP|RESET|PURGE|PDF|WORD> WKSHOP [MIN[,MAX]
ACTION is mandatory
wodadmin@server:/usr/local/bin$
```

I﻿t requires the verb, the workshop's name and the student id. Using the script, one does not need to provide participant id.  The script is run locally on the Jupyterhub server.

```shellsession
wodadmin@server:/usr/local/bin$ ./wod-test-action.sh
Syntax: wod-test-action.sh <CREATE|CLEANUP|RESET|PURGE|PDF|WORD> WKSHOP [MIN[,MAX]
ACTION is mandatory
wodadmin@server:/usr/local/bin$ ./wod-test-action.sh CREATE WKSHP-API101 121
Action: CREATE
We are working on WKSHP-API101
Student range: 121
Sending a mail to CREATE student 121 for workshop WKSHP-API101
220 server.xyz.com ESMTP Postfix (Ubuntu)
250 2.1.0 Ok
250 2.1.5 Ok
354 End data with <CR><LF>.<CR><LF>
250 2.0.0 Ok: queued as 9749E15403AB
221 2.0.0 Bye
```

I﻿n order to retrieve the result of the script, you simply need to run a `tail` command

```shellsession
wodadmin@server:~$ tail -100f .mail/from
++ date
....
From xyz@hpe.com  Fri Mar  3 09:08:35 2023
 Subject: CREATE 121 0
  Folder: /home/wodadmin/wod-backend/scripts/procmail-action.sh CREATE       11
+ source /home/wodadmin/wod-backend/scripts/wod.sh
....
+ echo 'end of procmail-action for student 121 (passwd werty123) with workshop WKSHP-API101 with action CREATE at Fri Mar  3 09:11:39 UTC 2023'
```

T﻿he very last line of the trace will provide you with the credentials necessary to test your workshop. 

T﻿here are two types of activities that can occur on the backend server: punctual or regular. The punctual activity is one that is performed once every now and then. The regular one is usually set up on the backend server as a cron job. Sometimes however, one of these cron tasks can be forced manually if necessary. One the main scheduled task is the `deliver` task. I will explain it later on in this chapter. I will start now by explaining an important possible punctual task, the update of the backend server.

##### U﻿pdate of the backend server:

T﻿he backend server hosts all the necessary content for delivering workshops: it implies notebooks and scripts and playbooks to deploy and personalize them. It also hosts some services that are needed by the overall architecture solution (Jupyterhub, Procmail, Fail2ban among others).

S﻿ervices are installed once and for all at the installation time. These services may evolve over time. One may need to update the jupyterhub application to fix a bug or get new features. In the same fashion, you may consider bumping from one python version to a new major one. If you are willing to update these services or add additional ones, you will need to update the relevant installation playbooks in wod-backend/ansible directory.

h﻿ere is a small extract of the `install_backend.yml` playbook: Full version [here](https://github.com/Workshops-on-Demand/wod-backend/blob/main/ansible/install_backend.yml)

```shellsession
vi install_backend
- hosts: all
  gather_facts: true
  vars:
    IJAVAVER: "1.3.0"
    KUBECTLVER: "1.21.6"

  tasks:
    - name: Include variables for the underlying distribution
      include_vars: "{{ ANSIBLEDIR }}/group_vars/{{ ansible_distribution }}-{{ ansible_distribution_major_version }}.yml"

    - name: Base setup for a JupyterHub environment server or appliance
      include_tasks: "{{ ANSIBLEDIR }}/setup_base_appliance.yml"

    - name: Add CentOS SC repository into repo list
      become: yes
      become_user: root
      yum:
        name: centos-release-scl-rh
        state: present
      when:
        - ansible_distribution == "CentOS"
        - ansible_distribution_major_version >= "7"

    - name: Add conda GPG Key to APT
      become: yes
      become_user: root
      apt_key:
        url: https://repo.anaconda.com/pkgs/misc/gpgkeys/anaconda.asc
        state: present
      when:
       - ansible_distribution == "Ubuntu"
       - ansible_distribution_major_version >= "20"

      # TODO: Do it for EPEL if really needed
    - name: Add conda APT repository
      become: yes
      become_user: root
      apt_repository:
        repo: deb [arch=amd64] https://repo.anaconda.com/pkgs/misc/debrepo/conda stable main
        state: present
      when:
       - ansible_distribution == "Ubuntu"
```

P﻿ossible Use Cases:

* U﻿pgrade to a newer version of Jupyterhub
* A﻿dd a new kernel to Jupyterhub
* A﻿dd a new Ansible Galaxy collection
* A﻿dd a new PowerShell library 
* A﻿dd a new package needed by a workshop. For e.g:

  * Kubectl client  
  * T﻿erraform client
  * P﻿owerShell module  
  * P﻿ython Library

 You will start by moving to your public backend forked repository and apply the necessary changes before committing and push locally. 

 Then you will perform a merge request with the main repository. We plan to integrate here  in a proper CICD (continuous integration continous development) pipeline to allow a vagrant based test deployment. Whenever someone performs a merge request on the main repo, the test deployment task kicks in and deploy a virtual backend server on which the new version of the installation process is automatically tested. When successful, the merge request is accepted. Once merged, you will need to move to your backend server and perform git remote update and git rebase on the wod-backend directory. Once done, you will then be able to perform the installation process.

##### R﻿egular maintenance of the backend server:

O﻿n a daily basis, some tasks are launched to check the integrity of the backend server. Some tasks are related to the security integrity of the system. The following playbook is at the heart of this verification: **wod-backend/ansible/check_backend.yml**. Full version of the file is available [here](https://github.com/Workshops-on-Demand/wod-backend/blob/main/ansible/check_backend.yml) for review.

I﻿t checks a quite long list of items like:

* W﻿od System compliancy: is this really a wod system? by calling out [check_system.yml](https://github.com/Workshops-on-Demand/wod-backend/blob/main/ansible/check_system.yml) playbook. 

  T﻿his first check includes:  
* nproc hard and soft limits 
* n﻿ofile hard and soft limits
* Setup sysctl params 

  * net.ipv4.tcp_keepalive_time, value: "1800"  
  * kernel.threads-max, value: "4096000"  
  * kernel.pid_max, value: "200000" 
  * vm.max_map_count, value: "600000"
* S﻿etup UDP and TCP firewall rules
* Enable services:

  * Fi﻿rewalld 
  * N﻿tp 
* S﻿tudent Management:

  * Ensure limits are correct for students accounts 
* Copy the skeleton content under /etc/skel
* Test `.profile` file
* Ensure vim is the default EDITOR
* Setup `logind.conf`
* M﻿anage `/etc/hosts` file
* Install the pkg update script
* Setup `crontab` for daily pkg security update
* Deliver create/reset/setup scripts as ansible template for variable expansion
* Install utility scripts
* Deliver the system scripts (`cleanup-processes.sh.j2`)
* Installation of the cleanup-processes script
* Setup weekly cleanup processes task
* Enable WoD service
* Test private tasks YAML file
* Call private tasks if available. We perform private part before users management to allow interruption of the deliver script during normal operations - waiting till end of users management can take hours for 2000 users. Potential impact: private scripts are run before users creation, so may miss some part of setup.
* U﻿ser Management:

  * Remove existing jupyterhub users
  * Remove Linux users and their home directory
  * Ensure dedicated students groups exist
  * Ensure Linux students users exists with their home directory
  * Ensure jupyterhub students users exist
  * Setup ACL for students with jupyterhub account
  * Setup default ACL for students with jupyterhub account
*