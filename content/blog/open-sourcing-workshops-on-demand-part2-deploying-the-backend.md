---
title: "Open Sourcing Workshops-on-Demand part2: Deploying the Backend"
date: 2023-01-13T17:08:52.384Z
author: Frederic Passeron
authorimage: /img/fp-hpewod.jpg
disable: false
tags:
  - open source
---
# Open Sourcing Workshops-on-Demand part 2: Deploying the backend -T﻿he How-to now...

I﻿n the first article of this series, I described the reasons behind the decison of open sourcing our workshops-on-demand project. After reading it, you should have a better understanding of our motivations. Moreover, the project's infrastructure has now no longer any secrets to you.

I﻿n this second article, I will cover the backend part of the project. I will explain how to deploy it in a first place. Then I will dive into the usage of the different components that constitutes it. 

T﻿he overall infrastructure can run on physical servers or vms. We usuasully consider at least one server for the frontend and a second server for the backend. You could also decide to separate every single component of each side.

![](/img/howto-wod-5.png)

## H﻿ow to deploy your own backend...

A﻿s explained in the previous [article](https://developer.hpe.com/blog/willing-to-build-up-your-own-workshops-on-demand-infrastructure/), the project is split into multiple repositories from an architectural and public / private aspects. The architecture is divided between frontend and backend and the project admin will decide whether  he is willing to develop and propose public only content to the participants or add some proprietary and private content.

I﻿ will start with the simpliest scenario: A public only approach. Then we will dive into the specificties related the private approach.

### P﻿ublic only Deployment: (No private backend nor private workshops)

**Important Note:**  

**T﻿his part is compulsory for any type of deployment. Public only or public + private.**

F﻿irst, you need a repository to clone. The github projects are available [here](https://github.com/Workshops-on-Demand/). W﻿e have packaged the solution in several github repos. Each repository represents a role in the overall architecture.

![](/img/wod-blogserie2-repos.png "WOD Repositories")

**[w﻿od-notebooks](https://github.com/Workshops-on-Demand/wod-notebooks):** Public Workshops-on-Demand based on Jupyter Notebooks.

* You can test them live at <https://hackshack.hpedev.io/workshops>

**[w﻿od-frontend](https://github.com/Workshops-on-Demand/wod-frontend):** Frontend part of the Workshops-on-Demand project.

* Based on NGINX and NodeJS technologies, it provides the participatants' registration portal to book workshops.

**[w﻿od-api-db](https://github.com/Workshops-on-Demand/wod-api-db):** Workshops-on-Demand registration portal application

* Open API 3.0 based api used to manage the Workshops-on-Demand project. it also provides a Database hosting the different status of participants, workshops, students. 

**[w﻿od-private](https://github.com/Workshops-on-Demand/wod-private):** Example Private configuration for WoD.

* This provide an example for creating your own cutomization layer on top of the public standard wod Backend / wod Notebooks content. Do not put any confidential data here as this is a public repository !!

**[w﻿od-backend](https://github.com/Workshops-on-Demand/wod-backend):** Back-end part of our Workshop-on-Demand setup.  

It provides:

* A complete JupyterHub server with extensions on your system, ready to host Workshops-on-Demand that you can find [here ](https://github.com/Workshops-on-Demand/wod-notebooks.git)[](https://github.com/Workshops-on-Demand/wod-notebooks.git)
* A postfix server used for the procmail API
* An Ansible engine to allow automation
* A fail2ban service
* An Admin user to manage everything
* A﻿ set of scripts to handle different tasks such as:
  -Notebooks deployment
  ﻿-Jupyterhub compliancy
  ﻿-Users compliancy
  ﻿-Security Management

#### Backend server preparation:

B﻿efore cloning the backend repository, you need to prepare the server that will host the backend features. When ready, you will proceed with the cloning and then the installation process.

##### Pre requesites:

1. I﻿n order to setup the backend server, you will need:

   * A fresh OS install on physical / virtualized server running Ubuntu 20.04 or Centos 7.9 leveraging any deployment mechanism of your choice.(e.g iLO, vagrant, etc.). You may even use this [vagrant file](https://github.com/Workshops-on-Demand/wod-backend/blob/main/install/Vagrantfile) to generate automatically a complete setup leveraging vagrant, libvirt and QEMU/KVM.
   * A linux account with sudo priviledges on your linux distro. Name it `install`

   **Note:** In order to support 100 concurrent users : 

   * 2 cpus or more machine
   * 128 Gigas of Ram
   * 500 Gigas of Drive

     W﻿e are currently using a DL360 gen10 server on our different production sites.
2. W﻿hen done with OS installation and preparation

   * From the wod-backend server aka Jupyterhub server, as the `install` user, you will need to clone the repo first.

   ```shellsession
   install$ git clone https://github.com/Workshops-on-Demand/wod-backend.git
   install$ cd wod-backend/
   ```

   * Examine default installation parameters and adapt when necessary accordingly. Files are self documented.

     * Look at the following files within ```ansible/group_vars``` directory.

       * ```all.yml``` file

         ```shellsession
         vi all.yml
         ---
         # We create fixed user accounts to provide an isolated execution environment to run the jupyter notebooks
         # They are called studentXXX where XXX is comprised between USERMIN and USERMAX defined below poentially with the addition of an offset (UIDBASE) for their uid/gid
         # Their home directory is located under /student and is thus named /student/studentXXX
         # Corresponding JupyterHub accounts are also created
         #
         # USERMIN indicates the starting ID of the Linux and Jupyter user account range
         #
         USERMIN: 1
         #
         # USERMAX indicates the ending ID of the Linux and Jupyter user account range
         #
         USERMAX: 20
         #
         # UIDBASE is the offset used to create the Linux user account IDs
         # Example when creating user 35 with UIDBASE of 2000, the uid created is 2035
         #
         UIDBASE: 2000
         #
         # GIDBASE is the offset used to create the Linux group IDs
         # Example when creating user 35 with GIDBASE of 2000, the gid created is 2035
         #
         GIDBASE: 2000
         #
         # Setup CLEAN to true if you want all Liunx & Jupyter user accounts to be removed before ansible check
         #
         CLEAN: false
         #
         # VAULTPWD is the passwd used to manage the ansible vault
         #
         VAULTPWD: VeryComplexPasswd1234!
         #
         # NOCHECKSSH are ssh options used to dialog with appliances
         # By default avoid checking Host keys and Host file as they may change on a regular base
         #
         NOCHECKSSH: -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null
         #
         # Branding management - Use if you want to customize Logo and Notebooks branding
         #
         BRANDING: "WoD Developer"
         BRANDINGWOD: "WoD Developer"
         BRANDINGLOGO: "![HPEDEVlogo](Pictures/hpe-dev-logo.png)"
         BRANDINGURL: "https://wod.io"
         #
         # Survey management - Use if you want to ask for feedbacks on your Workshops - Look at existing conclusion notebooks
         SURVEYURL: TBD
         SURVEYCHALURL: TBD
         #
         # JPHUB  is the directory used to install the JupyterHub stack (a python venv)
         #
         JPHUB: /opt/jupyterhub
         #
         #
         # These variables are defined in ansible playbooks, do not change without knowing what you do
         #
         STUDDIR: "{{ ansible_env.STUDDIR }}"
         WODBEDIR: "{{ ansible_env.WODBEDIR }}"
         WODPRIVDIR: "{{ ansible_env.WODPRIVDIR }}"
         WODNOBO: "{{ ansible_env.WODNOBO }}"
         WODAPIDBDIR: "{{ ansible_env.WODAPIDBDIR }}"
         WODFEDIR: "{{ ansible_env.WODFEDIR }}"
         SCRIPTDIR: "{{ WODBEDIR }}/scripts"
         ANSIBLEDIR: "{{ WODBEDIR }}/ansible"
         # This is the predefined structure for a private repo
         WODPRIVNOBO: "{{ WODPRIVDIR }}/notebooks"
         SCRIPTPRIVDIR: "{{ WODPRIVDIR }}/scripts"
         ANSIBLEPRIVDIR: "{{ WODPRIVDIR }}/ansible"
         ```
       * ```wod-backend``` file

         ```shellsession
         vi wod-backend
         #
         # These variables are located lower in the ansible tree to allow different values required for different backends while keeping a single frontend
         #
         # BASESTDID is the offset used to create users in the DB. It is required that each backend has a different non overlapping value.
         # Overlap is defined by BASESTDID + USERMAX (from all.yml)
         #
         # Example:
         # for student 35 in location A having BASESTDID to 0 the user is create as id 35
         # for student 35 in location B having BASESTDID to 2000 the user is create as id 2035
         # There is no overlap as long as you do not create more than 2000 users which should be the value of USERMAX in that case.
         #
         # This is different from the offset UIDBASE used for Linux uid
         #
         BASESTDID: 0
         #
         # POSTPORT is the Postfix Port on which the smtp service is listening to receive API mail requests from the frontend
         #
         POSTPORT: "10025"
         #
         # In case we have a LDAP server to use, flag as such the corresponding workshops in the DB and use the following values:
         #
         LDAPSRVNAME: ldap.example.org
         LDAPDMN: example.org
         LDAPPWD: MotDePasseLDAPCompliquéAussi123!!!##
         LDAPPORT: "389"
         #
         # For various existing public WoDs - needed. Adapt but do not remove !
         #
         SSHPORT-WKSHP-Docker101: 14101
         SSHPORT-WKSHP-Ansible101: 16001
         HTTPPORT-WKSHP-Docker101: 14151
         HTTPPORT-WKSHP-Ansible101: 16051
         HTTPPORT-WKSHP-Spark101: 17161
         HTTPPORT-WKSHP-Concourse101: 19061
         HTTPPORT-WKSHP-ML101: 18061
         HTTPPORT-WKSHP-DataVisu101: 22161
         CONCOURSEPORT-WKSHP-Concourse101: 19001
         CONCOURSEPORT2-WKSHP-Concourse101: 19031
         IP-WKSHP-DataVisu101: x.y.z.t
         IP-WKSHP-Concourse101: x.y.z.t
         IP-WKSHP-Docker101: x.y.z.t
         IP-WKSHP-Ansible101: x.y.z.t
         IP-WKSHP-Spark101: x.y.z.t
         IP-WKSHP-ML101: x.y.z.t
         IP-WKSHP-StackStorm101: x.y.z.t
         SPARKPORT-WKSHP-Spark101: 17101
         SPARKPORT2-WKSHP-Spark101: 17131
         MLPORT-WKSHP-ML101: 18101
         MLPORT2-WKSHP-ML101: 18031
         DATAVISUPORT1-WKSHP-DataVisu101: 22101
         DATAVISUPORT2-WKSHP-DataVisu101: 22131
         ```
       * ```wod-system``` file

         ```shellsession
         vi wod-system
         #
         # Backend API management
         #
         # Do not change as the port is fixed in JupyterHub install
         #
         WODBEAPIURL: http://{{ WODBEFQDN }}:8000
         #
         # Replace with a random one - TODO Do that automatically at install time
         #
         WODBETOKEN: 2c0246e2c8564dc6ac7b12c544b25d77
         #
         # You may want to use these variables if you have an OPNSense server as a security FW and allowing http comm internally
         #
         #OPNSENSEKEY:
         #OPNSENSESEC:
         #OPNSENSEIP:
         #OPNSENSEPORT:
         #
         # Front-end API management
         #
         # Do not change as the port is fixed in JupyterHub install
         #
         WODFEAPIURL: https://{{ WODAPIDBFQDN }}/api
         #
         # Adapt to your setup - Used by installer to setup the frontend
         #
         WODFEAPIUSER: moderator
         WODFEAPIPWD: MotDePasseCompliquéAussi125!!!##
         ```

[](https://github.com/Workshops-on-Demand/wod-backend/blob/main/INSTALL.md#for-private-based-workshops-on-demand-private-backend--private-workshops-or-if-you-need-to-modify-defaults)O﻿nce you are done with the files, you can can proceed with the installation itself.

#### B﻿ackend installation process:

T﻿he installation is based on a common install script \[install.sh] that allows the deployment of the different parts of the solution. It can be called as follows:

install.sh usage() { echo "install.sh \[-h]\[-t type]\[-g groupname]\[-b backend]\[-f frontend]\[-a api-db]\[-e external]\[-u user] \[-s sender]"}

\-﻿h provides the help

```shellsession
./install.sh -h
install.sh called with -h
install.sh [-h][-t type][-g groupname][-b backend][-f frontend][-a api-db][-e external][-u user][-s sender]

where:
type      is the installation type
          example: backend, frontend or api-db
          if empty using 'backend'
groupname is the ansible group_vars name to be used
          example: production, staging, test, ...
          if empty using 'production'
backend   is the FQDN of the backend JupyterHub server
          example: be.internal.example.org
          if empty using the local name for the backend
frontend  is the FQDN of the frontend Web server
          example: fe.example.org
          if empty using the external name for the backend
api-db    is the FQDN of the API/DB server
          example: api.internal.example.org
          if empty using the name for the frontend
external  is the external FQDN of the backend JupyterHub server, reachable from the Internet
          example: jphub.example.org
          if empty using the internal name of the backend
user      is the name of the admin user for the WoD project
          example: mywodamin
          if empty using wodadmin
sender    is the e-mail address used in the WoD frontend to send API procmail mails to the WoD backend
          example: sender@example.org
          if empty using wodadmin@localhost
```

Example below for a backend server:

```shellsession
sudo ./install.sh -t backend -g staging -b jup.example.net -f notebooks.example.io -a api.example.io -e notebooks.example.io -s sender@example.io
```

Install.sh performs the following tasks:

* Calls the install-system-<< distribution name >>.sh script
* Installs minimal requirered (Ansible, git, jq, openssh server, npm)
* Creates an admin user as defined upper (default is wodadmin) with sudo rights
* Calls the install-system-common.sh script that performs the following tasks:

  * cleanup
  * github repos cloning (leveraging install.repo file) : public Backend and public Private repos
  * Create ssh keys for wodadmin
  * Creates GROUPNAME variables
  * Creates ansible inventory files
* Calls the install_system.sh script with type (Backend, Frontend, etc..) that performs the following tasks:

  * Install the necessary stack based on selected type
  * Create a wod.sh script in wod-backend directory to be used by all other scripts
  * Source the wod.sh file
  * Setup ansible-galaxies (community.general and posix)
  * Setup Ansible and call the playbook install_<>.yml followed by the ansible\_check\_<>.yml

A﻿ll Playbooks are self documented. Please check for details.

At the end of the installation process:

* you will have a jupyterhub server running on port http 8000
* You will get a new wodadmin user (Default admin)
* You will get a set of 20 students (Default value)

W﻿e leave it to you handle the necessary port redirection and SSL certificates management when needed. In our case, we went for a simple yet efficient solution based on an OPNSense Firewall along with a HAProxy setup to manage ports' redirection,HTTP to HTTPS Redirection, SSL Certification. The backend also includes a Fail2ban service for login security management.

At this point, you should then be able to access your jupyterhub environment with a few pre-installed set of kernels like Bash, Python, ansible, ssh, PowerShell.

Y﻿ou can then start developing new Notebooks for your public based environment. And if you don't know how to achieve this, the next article in the series should allow you to learn more about it.

N﻿ow if you are willing to develop private content that cannot be shared because of dedicated IP with the wider Open Source community, you can read the next part that will explain how to handle this.

### For private based Workshops-on-Demand (private backend + private workshops on top of default public backend and notebooks)

T﻿he principle remains somehow similar with a few differences explained below.

* Y﻿ou will start by forking the following public private repo (<https://github.com/Workshops-on-Demand/wod-private.git>) on github under your own github account.
* Next, you clone the forked repo

```shellsession
git clone <https://github.com/...................../wod-private.git> wod-private
cd wod-private/ansible/group_vars
```

* Please edit the all.yml and << groupname >> files to customize your setup.
* Commit and push changes to your repo
* C﻿lone now your private repo on the jupyterhub server under the same account  used for public setup.
* M﻿ove to the wod-backend/install directory

```shellsession
cd $HOME/wod-backend/install
```

* Create an install.priv file located in install directory when using a private repo 

  * Define the WODPRIVREPO and WODPRIVBRANCH variables as follows:

    * WODPRIVBRANCH="master"   
    * WODPRIVREPO="[git@github.com](mailto:git@github.com):Account/Private-Repo.git wod-private"

**Note: When using a token**

Please refer to the following [url](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) to generate token :

* edit the install.repo file located in install directory of wod-backend:

  * Uncomment line : token=`cat $EXEPATH/token`
  * use the token in the url WODPRIVREPO="git clone <https://user:$token@github.com/....../wod-private.git> wod-private"

Y﻿ou are now ready to perform the installation again to support a private repository. 

```shellsession
sudo ./install.sh -t backend -g staging -b jup.example.net -f notebooks.example.io -a api.example.io -e notebooks.example.io -s sender@example.io
```

Please note that this setup phase can be conccurent with the public setup phase. Indeed, the install script should detect the presence of the private repository owing to the presence of the install.priv file. It will automatically adjust the different scripts and variables to add the relevant content. It will actually overload some of the variables with private ones.

#### B﻿ackend server management:

##### C﻿ontent of the backend server:

S﻿imple tree view of the wod-backend directory:

T﻿he **ansible** folder contains all the necessary playbooks and variables files to manage the main functions of the backend server. 

A﻿t the root of this directory can be found:

**C﻿heck*.yml playbooks**: These playbooks are used to perform checks on the different systems. These checks ensure that this a compliant WoD system by checking Firewall rules and many other things. We will see this a bit later in more details.

**C﻿opy_folder.yml**: This is historically one of very first playbook we used and therefore a very important one. It performs the necessary actions to deploy, personnalize (by substituting ansible variables) the selected notebook to the appropriate student home folder.

**c﻿ompile_scripts.yml**: Should you need to hide from the student a simple api call that is made on some private endpoint with non shareable data (credentials for instance), this playbook will make sure to compile it and create a executable file allowing it to happen. 

**d﻿istrib.yml**: This playbook retrieves the distribution name and version from the machine it is run on.

**install_*.yml**: These playbooks take care of installing the necessary packages needed by the defined type (frontend, backend, api-db, base-system or even appliance)

**setup_*.ym**: There are several types of setup playbooks in this directory. 

* setup_WKSHP-*.yml: These playbooks are responsible for preparing a base appliance for a given workshop by adding and configuring the necessary packages or services related to the workshop.
* s﻿etup_appliance.yml: this playbook is used to perform the base setup for a JupyterHub environment server or appliance. It includes setup_base_appliance.yml playbook.
* s﻿etup_base_appliance: takes care of setting the minimal requierements for an appliance. it includes therefore install_base_system.yml playbook. On top of it, it creates and configure the necessary users.
* s﻿etup_docker_based_appliance.yml: Quite self explanatory ? it performs setup tasks to enable docker on a given appliance.

It also hosts the **inventory** file describing the role of jupyterhub servers. Place your jupyterhub machine (FQDN) in a group used as PBKDIR namerole

```shellsession
#
# Place to your jupyterhub machine (FQDN) in a group used as PBKDIR name
#
[production]
127.0.0.1  ansible_connection=localhost
```

T﻿he **conf** folder hosts configuration files in a jinja format. Once expanded, the resulting files will be used by relevant workshops.

A﻿s part of the refacturing work to open source the project, we reaaranged the different scripts locations. We have created an install folder to handle the different installation scripts either from a Jupyterhub 's perpective or from an appliance 's standpoint too.

We separated the Workshops related scripts from the pure system ones. When one creates a workshop, one needs to provide a series of notebooks and in some cases some scripts to manage the creation, setup of a related appliance along with additional scripts to manage its lifecycle in the overall workshops-on-Demand architecture (Create, Cleanup, Reset scripts at deployment or Cleanup times). These scripts need to be located in the script folder. On the other hand, the system scripts are located in the sys folder.

T﻿here are two types of activities that can occur on the backend server: punctual or regular. The punctual activity is one that is performed once every now and then. The regular one is usually set up on the backend server as a cron job. Sometimes however, one of these cron tasks can be forced manually if necessary. One the main scheduled task is the 'deliver' task. I will explain it later on in this chapter. I will start now by explaining an important possible punctual task, the update of the backend server.

##### U﻿pdate of the backend server:

T﻿he backend server hosts all the necessary content for delivering workshops: it implies notebooks and scripts and playbooks to deploy and personalize them. It also hosts some services that are needed by the overall architecture solution (Jupyterhub, Procmail, Fail2ban among others).

S﻿ervices are installed once and for all at the installation time. These services may evolve over time. One may need to update the jupyterhub application to fix a bug or get new features. In the same fashion, you may consider bumping from one python version to a new major one. If you are willing to update these services or add additional ones, you will need to update the relevant installation playbooks in wod-backend/ansible directory.

h﻿ere is a small extract of the install_backend.yml playbook: Full version [here](https://github.com/Workshops-on-Demand/wod-backend/blob/main/ansible/install_backend.yml)

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