---
title: "Open Sourcing Workshops-on-Demand part3: Understanding the Backend"
date: 2023-03-01T17:24:34.117Z
author: Frederic {Passeron
authorimage: /img/frederic-passeron-hpedev-192.jpg
disable: false
---
I﻿n the previous article [article](https://developer.hpe.com/blog/willing-to-build-up-your-own-workshops-on-demand-infrastructure/) of this series, I explained how to deploy the backend server of our Workshops-on-Demand infrastructure.

I﻿ will take time today to dig into the details of this server. I will cover the inners of the registration process explaining how a workshop is deployed on the backend server. Even though it takes only a few minutes to the backend server to deploy a workshop, there are many processes taking place in the background. We will discover them together today.

I will also cover the daily maintenance of this server as well as some update / upgrade scenarios in a second part of this article.

A﻿s a reminder, here is a diagram showing the different parts of the Workshops-on-Demand infrastructure. I will focus today againon the backend server side and more precisely on the Jupyterhub server where all the automation takes place.

![](/img/wod-blogserie3-archi.png "Workshops-on-Demand Architecture")

#### B﻿ackend server lifecycle:

T﻿he following picture is depicting what happens on the backend server when a participant has registered for a workshop. If you remember the fisrt article, you know that upon registration, the frontend sends through a procmail api call instructions to the backend server so that the latter can proceed with the workshop preparation and deployment. Once done with these different tasks, it informs back the api-db server through api calls with the relevant information.

L﻿et 's now look in details what is really happening  on the backend server's side:

![](/img/wod-blogserie2backend-workflow.png "backend server <CREATE> workflow")

0- The procmail api: This is a mail parsing process allowing the backend server to retrieve the relevant information in order to perform appropriate actions. As any api, it uses verbs to performs actions. In our case, we leverage <CREATE>, <CLEANUP>, <RESET> and <PURGE>. 

If you need more info on procmail usage, check the following \[page](<\[5:51 PM] Cornec, Bruno (Open Source and Linux Technology Strategist)
https://wiki.archlinux.org/title/Procmail>).

T﻿ake a look at the  following template of the `.procmailrc` file that will be expanded at setup time.

```shellsession
MAILDIR=$HOME/.mail      # You'd better make sure it exists
DEFAULT=$MAILDIR/mbox
LOGFILE=$MAILDIR/from

:0b
#* ^From.*{{ WODSENDER }}.*
# \/ defines what will be matched in $MATCH
* ^Subject: *CREATE \/[1-9]+.*
| {{ SCRIPTDIR }}/procmail-action.sh CREATE $MATCH

:0b
#* ^From.*{{ WODSENDER }}.*
# \/ defines what will be matched in $MATCH
* ^Subject: *CLEANUP \/[1-9]+.*
| {{ SCRIPTDIR }}/procmail-action.sh CLEANUP $MATCH

:0b
#* ^From.*{{ WODSENDER }}.*
# \/ defines what will be matched in $MATCH
* ^Subject: *RESET \/[1-9]+.*
| {{ SCRIPTDIR }}/procmail-action.sh RESET $MATCH

:0b
#* ^From.*{{ WODSENDER }}.*
# \/ defines what will be matched in $MATCH
* ^Subject: *PURGE student\/[1-9]+.*
| {{ SCRIPTDIR }}/procmail-action.sh PURGE $MATCH
```

The `From:` is important as `.procmailrc` checks that the sender is the configured one from the frontend server. During the install process, the sender parameter id referring to this. Any mail from any other sender but the configured one is not processed.

This api is actually based on a script `procmail-action.sh`. This script defines the different actions linked to the verbs passed through the api calls via `.procmailrc`

L﻿et's start with a <CREATE> scenario looking at the very first lines of the `procmail` log file.

```
From xyz@hpe.com  Wed Mar  1 15:10:41 2023
 Subject: CREATE 401 825 frederic.passeron@hpe.com
  Folder: /home/wodadmin/wod-backend/scripts/procmail-action.sh CREATE       14
```

In `Subject:`, we look for the API verb **CREATE** followed by **student id,** **participant id** and finally the registered **participant email.** 

H﻿ere the values are respectively:

* s﻿tudent id: 401 
* p﻿articipant id: 825
* p﻿articipant email: frederic.passeron@hpe.com

I﻿n order to work properly, `procmail-action.sh`needs to source 3 files:

1- `w﻿od.sh`

2- `r﻿andom.sh`

3- `f﻿unctions.sh`

`w﻿od.sh` sets a large number of variables: This script is generated at install time as it leverages variables defined at setup time.

```shellsession
# This is the wod.sh script, generated at install
#
# Name of the admin user
export WODUSER=wodadmin

# Name of the wod machine type (backend, api-db, frontend, appliance)
export WODTYPE=backend

# This main dir is computed and is the backend main dir
export WODBEDIR=/home/wodadmin/wod-backend

# BACKEND PART
# The backend dir has some fixed subdirs
# wod-backend (WODBEDIR)
#    |---------- ansible (ANSIBLEDIR)
#    |---------- scripts (SCRIPTDIR defined in all.yml not here to allow overloading)
#    |---------- sys (SYSDIR)
#    |---------- install
#    |---------- conf
#    |---------- skel
#
export ANSIBLEDIR=$WODBEDIR/ansible
export SYSDIR=$WODBEDIR/sys

# PRIVATE PART
# These 3 dirs have fixed names by default that you can change in this file
# they are placed as sister dirs wrt WODBEDIR
# This is the predefined structure for a private repo
# wod-private (WODPRIVDIR)
#    |---------- ansible (ANSIBLEPRIVDIR)
#    |---------- notebooks (WODPRIVNOBO)
#    |---------- scripts (SCRIPTPRIVDIR)
#
PWODBEDIR=`dirname $WODBEDIR`
export WODPRIVDIR=$PWODBEDIR/wod-private
export ANSIBLEPRIVDIR=$WODPRIVDIR/ansible
export SCRIPTPRIVDIR=$WODPRIVDIR/scripts
export SYSPRIVDIR=$WODPRIVDIR/sys
export WODPRIVNOBO=$WODPRIVDIR/notebooks
WODPRIVINV=""
# Manages private inventory if any
if [ -f $WODPRIVDIR/ansible/inventory ]; then
        WODPRIVINV="-i $WODPRIVDIR/ansible/inventory"
        export WODPRIVINV
fi

# AIP-DB PART
export WODAPIDBDIR=$PWODBEDIR/wod-api-db

# FRONTEND PART
export WODFEDIR=$PWODBEDIR/wod-frontend

# These dirs are also fixed by default and can be changed as needed
export WODNOBO=$PWODBEDIR/wod-notebooks
export STUDDIR=/student
#
export ANSPLAYOPT="-e PBKDIR=staging -e WODUSER=wodadmin -e WODBEDIR=/home/wodadmin/wod-backend -e WODNOBO=/home/wodadmin/wod-notebooks -e WODPRIVNOBO=/home/wodadmin/wod-private/notebooks -e WODPRIVDIR=/home/wodadmin/wod-private -e WODAPIDBDIR=/home/wodadmin/wod-api-db -e WODFEDIR=/home/wodadmin/wod-frontend -e STUDDIR=/student -e ANSIBLEDIR=/home/wodadmin/wod-backend/ansible -e ANSIBLEPRIVDIR=/home/wodadmin/wod-private/ansible -e SCRIPTPRIVDIR=/home/wodadmin/wod-private/scripts -e SYSDIR=/home/wodadmin/wod-backend/sys -e SYSPRIVDIR=/home/wodadmin/wod-private/sys"
export ANSPRIVOPT=" -e @/home/wodadmin/wod-private/ansible/group_vars/all.yml -e @/home/wodadmin/wod-private/ansible/group_vars/staging"
```

`r﻿andom.sh` ﻿exports the randomly generated password.

`f﻿unctions.sh` is a library of shell functions used by many scripts among which `procmail-action.sh`.  We will see the details shortly below.

4- `procmail-action.sh` c﻿alls the necessary functions and scripts to perform the < CREATE> operation.

5- `get_session_token()` This function retrieves the necessary token to make api call to the api-db server.

6- `get_workshop_name()`  This function extracts the workshop name from the mail body. In Body: One will find the workshop name: for example, **WKSHP-API101** 

7- `get_workshop_id()` Out of the workshop name, the function `get_workshop_id()` will get the workshop's id from the api-db server.

This id will be used later to get some of the workshop's specifics through additional api calls to the api-db server.

* D﻿oes the workshop require to use the student password as a variable?
* Does the workshop require ldap authentication?
* D﻿oes the workshop require a compiled script?

8- `teststdid()` this function checks the student id provided by procmail API is valid: This function exits when the student id is not in the correct range. For each workshop, a dedicated student range is allocated.

9- `generate_randompwd()` This function creates a random password for a user, it is used both for local and ldap users'passwords. If the workshop requires an LDAP authentication (`get_ldap_status()` functions will get this information) then another function is used to update the LDAP server with the password for the given student (`update_ldap_passwd()`)

The generated password will be sent back to the api-db server so that the frontend server can then send an email to allow participant to connect to his workshop.

10- `erase_student()` This function erases all the content from the allocated student's home directory. We want to make sure that the home directory is not compromised. We start clean.

11- `get_compile_status()` This function will check if he workshop needs some scripts to be compiled. For instance, if you need to authenticate against a private cloud portal and you don't want your participants to see the credentials, make sure to check the relevant box in the workshop table of the database. This compile feature will compile the authentication scripts into an executable that cannot be edited.

12- If an appliance is needed for the workshop, then the following script is called: `create-<WKSHP>.sh` and user env on appliance2 

F﻿or instance, `create-WKSHP-ML101.sh` will perform the following tasks in order to prepare the appliance for the workshop: It will start by reseting the appliance with the `reset-<WKSHP>.sh` s﻿cript. Then, it calls a second script aiming at preparing the appliance `create-appliance.sh`.﻿ Once done with these two, it moves on with the proper customization of the appliance for the given student.

S﻿ee details below.

```shellsession
#!/bin/bash

set -x

source {{ SCRIPTDIR }}/functions.sh

export RTARGET={{ hostvars[inventory_hostname]['IP-WKSHP-ML101'] }}
# Start by cleaning up stuff - do it early as after we setup .ssh content
{{ SCRIPTDIR }}/reset-$ws.sh
{{ SCRIPTDIR }}/create-appliance.sh

NAME=mllab
TMPDIR=/tmp/$NAME.$stdid


mkdir -p $TMPDIR

# Define local variables
echo wid=$wid
APPMIN=`get_range_min $wid`
echo stdid=$stdid
echo APPMIN=$APPMIN
mlport=$(($stdid-$APPMIN+{{ hostvars[inventory_hostname]['MLPORT-WKSHP-ML101'] }}))
mlport2=$(($stdid-$APPMIN+{{ hostvars[inventory_hostname]['MLPORT2-WKSHP-ML101'] }}))
httpport=$(($stdid-$APPMIN+{{ hostvars[inventory_hostname]['HTTPPORT-WKSHP-ML101'] }}))

cat > $TMPDIR/dockerd-entrypoint.sh << EOF
export HTTPPORT
tini -g -- start-notebook.sh &
sleep 3
jupyter lab list | tail -1 | cut -d'=' -f2 | cut -d' ' -f1 > {{ STUDDIR }}/student$stdid/mltoken
sleep infinity
EOF

cat > $TMPDIR/Dockerfile << EOF
FROM ${NAME}:latest
USER root
COPY dockerd-entrypoint.sh /usr/local/bin/
ENTRYPOINT /usr/local/bin/dockerd-entrypoint.sh
RUN mkdir -p {{ STUDDIR }}/student$stdid
RUN useradd student$stdid -u $stdid -g 100 -d {{ STUDDIR }}/student$stdid
RUN chown student$stdid:users {{ STUDDIR }}/student$stdid
# Unlock the account
RUN perl -pi -e "s|^student$stdid:!:|student$stdid:\$6\$rl1WNGdr\$qHyKDW/prwoj5qQckWh13UH3uE9Sp7w43jPzUI9mEV6Y1gZ3MbDDMUX/1sP7ZRnItnGgBEklmsD8vAKgMszkY.:|" /etc/shadow
# In case we need sudo
#RUN echo "student$stdid   ALL=(ALL)       NOPASSWD: ALL" >> /etc/sudoers
WORKDIR {{ STUDDIR }}/student$stdid
USER student$stdid
ENV NB_USER student$stdid
ENV NB_UID $stdid
ENV HTTPPORT $httpport
RUN git clone https://github.com/snowch/ml-101 {{ STUDDIR }}/student$stdid/
RUN /opt/conda/bin/jupyter-nbconvert --clear-output --inplace {{ STUDDIR }}/student$stdid/*.ipynb
EOF


# Look at https://stackoverflow.com/questions/34264348/docker-inside-docker-container
# and http://jpetazzo.github.io/2015/09/03/do-not-use-docker-in-docker-for-ci/
# For security consider using https://github.com/nestybox/sysbox
cat > $TMPDIR/docker-compose.yml << EOF
version: '3.5'
services:
  $NAME$stdid:
    image: $NAME$stdid
    build: .
    #privileged: true
    ports:
      - "$httpport:8888"
      - "$mlport:4040"
      - "$mlport2:4041"
#    volumes:
#      - /var/run/docker.sock:/var/run/docker.sock
EOF
cat > $TMPDIR/launch-$NAME << EOF
#!/bin/bash
cd $TMPDIR
docker-compose up --build -d
EOF
```

1﻿3- T﻿he `copy folder yml` playbook is now executed to deploy the notebooks and scripts necessary for the participant to run the workshop. Remember that the  participant got a student allocated to him at the time of the registration. This student is picked from a range that is allocated for the workshop. The admin decides on the maximum capacity it allocates to a given workshop. `C﻿opy_folder.yml`: This is historically one of very first playbook we used and therefore a very important one. It performs the necessary actions to deploy, personnalize (by substituting ansible variables) the selected notebook to the appropriate student home folder.

1﻿4- In the certain cases, some post deployment actions are needed. For instance, you may want to git clone some repository to leverage some data stored there. This can only occur when done with the deployment. Therefore, a `post-copy-<WKSHP.sh` ﻿is called.

1﻿5- Finally, the workshop is now ready to be used by the participant. The backend therefore, needs to inform back the frontend of this. To do so, it will perform two API calls:

* T﻿he first API call will update the password data for the participant's allocated student.
* T﻿he second API call will update the the participant's allocated student's status to active.

T﻿hese changes will trigger on the frontend web portal application the sending of the second email to the participant.  This email will contain the necessary information for the participant to connect to its notebooks environment.



#### B﻿ackend server management:

##### C﻿ontent of the backend server:

S﻿imple tree view of the wod-backend directory:

![](/img/wod-blogserie2-tree4.png "Tree view of wod-backend directory")

T﻿he `ansible` folder contains all the necessary playbooks and variables files to manage the main functions of the backend server.

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

T﻿he `conf` folder hosts configuration files in a jinja format. Once expanded, the resulting files will be used by relevant workshops.

A﻿s part of the refacturing work to open source the project, we reaaranged the different scripts locations. We have created an install folder to handle the different installation scripts either from a Jupyterhub 's perpective or from an appliance 's standpoint too.

We separated the Workshops related scripts from the pure system ones. When one creates a workshop, one needs to provide a series of notebooks and in some cases some scripts to manage the creation, setup of a related appliance along with additional scripts to manage its lifecycle in the overall workshops-on-Demand architecture (Create, Cleanup, Reset scripts at deployment or Cleanup times). These scripts need to be located in the script folder. On the other hand, the system scripts are located in the sys folder.

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
* A﻿dd a new package needed by a workshop. For e.g:

  * Kubectl client  
  * T﻿erraform client
  * P﻿owerShell module  
  * P﻿ython Library

 You will start by move to your public backend forked repository and apply the necessary changes before committing and push locally. 

 Then you will perform a merge request with the main repository. We plan to integrate here  in a proper CICD (continuous integration continous development) pipeline to allow a vagrant based test deployment. Whenever someone performs a merge request on the main repo, the test deployment task kicks in and deploy a virtual backend server on which the new version of the installation process is automatically tested. When successful, the merge request is accepted. Once merged, you will need to move to your backend server and perform git remote update and git rebase on the wod-backend directory. Once done, you will then be able to perform the installation process.

##### R﻿egular maintenance of the backend server:

O﻿n a daily basis, some tasks are launched to check the integrity of the backend server. Some tasks are related to the security integrity of the system. The following playbook is at the heart of this verification: **wod-backend/ansible/check_backend.yml**. Full version of the file is available [here](https://github.com/Workshops-on-Demand/wod-backend/blob/main/ansible/check_backend.yml) for review.

I﻿t checks a quite long list of items like:

* W﻿od System compliancy: is this really a wod system? by calling out [check_system.yml](https://github.com/Workshops-on-Demand/wod-backend/blob/main/ansible/check_system.yml) playbook

\    T﻿his first check includes:  

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
* Test .profile file
* Ensure vim is the default EDITOR
* Setup logind.conf
* M﻿anage /etc/hosts file
* Install the pkg update script
* Setup crontab for daily pkg security update
* Install utility scripts
* Deliver the system scripts (cleanup-processes.sh.j2)
* Installation of the cleanup-processes script
* Setup weekly cleanup processes task
* Enable WoD service
* Test private tasks YAML file
* Call private tasks if available