---
title: "Open Sourcing Workshops-on-Demand part2: Deploying the Backend"
date: 2023-01-13T17:08:52.384Z
author: Frederic Passeron
authorimage: /img/fp-hpewod.jpg
disable: false
---
# Open Sourcing Workshops-on-Demand part 2: Deploying the Backend T﻿he How-to now...

I﻿n the first article of this series, I described the reasons behing the decison of open sourcing our workshops-on-demand project. After reading it, you should have a better understanding of our motivation. Moreover, the project's infrastructure has now no longer any secrets to you.

I﻿n this second article, I will cover the backend part of the project. I will explain how to deploy it in a first place. Then I will dive into the usage of the different components that constitutes it.

T﻿he overall infrastructure can run on physical servers or vms. We usuasully consider at least one server for the frontend and a second server for the backend. You could also decide to separate every single component of each side.

![](/img/howto-wod-5.png)

## H﻿ow to deploy your own backend...

A﻿s explained in the previous article, the project is split into multiple repositories from an architectural and public / private aspects. The architecture is divided between frontend and backend and the project admin will decide whether  he is willing to develop and propose public only content to the participants or add some propriatory and private content.

I﻿ will start with the simpliest scenario: A public only approach. Then we will dive into the specificties related the private approach.

### P﻿ublic only Deployment: (No private backend nor workshops)

**Important Note:**  

**T﻿his part is compulsory for any type of deployment. When one is willing to manage some private content, this part remains necessary.**

F﻿irst you need a repository to clone. The github project is available [here](https://github.com/Workshops-on-Demand/). W﻿e have packaged the solution in several github repos. Each repositories represents a role in the overall architecture.

F﻿or the backend side, the repository name is **wod-backend.** This project is the back-end part of our Workshop-on-Demand setup.  It provides:

* A complete jupyterhub with extensions on your system, ready to host Workshops-on-Demand that you can find [here ](https://github.com/Workshops-on-Demand/wod-notebooks.git)[](https://github.com/Workshops-on-Demand/wod-notebooks.git)
* A postfix server used for the procmail API
* An Ansible engine to allow automation
* A fail2ban server
* An Admin user to manage everything
* A﻿ set of scripts to handle different tasks such as:
  -Notebooks deployment
  ﻿-Jupyterhub compliancy
  ﻿-Users compliancy
  ﻿-Security Management

#### Jupyterhub server preparation:

##### Pre requesites:

I﻿n order to setup the jupyterhub server, you will need:

* A fresh OS install on Physical / VM server running Ubuntu 20.04 or Centos 7.9 via ILO e.g: using ubuntu-20.04.1-live-server-amd64.iso or with a VM template or any autodeploy mechanism.
* A linux account with sudo priviledges on your linux distro.

**Note:** In order to support 100 concurrent users :

* 2 cpus or more machine
* 128 Gigas of Ram
* 500 Gigas of Drive[](https://github.com/Workshops-on-Demand/wod-backend/blob/main/INSTALL.md#pre-requesites)

From the wod-backend server aka Jupyterhub server

As created user:  

* you will need to clone the repo first.

```shellsession
sudo su - [user]
git clone https://github.com/Workshops-on-Demand/wod-backend.git
cd wod-backend/install
```

* Examine default installation parameters and adapt when necessary accordingly.
* Look at the following files within ansible/group_vars directory.

  * all.yml file

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

  * wod-backend file

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

  * wod-system

  ```
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

### Installation process:

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

Example :

```shellsession
sudo ./install.sh -t backend -g staging -b jup.example.net -f notebooks.example.io -a api.example.io -e notebooks.example.io -s sender@example.io
```

Install.sh performs the following tasks:

* Calls the install-system-<< distribution name >>.sh script
* Installs minimal requirered (Ansible, git, jq, openssh server, npm)
* Creates an admin user as defined upper (default is wodadmin) with sudo rights
* Calls the install-system-common.sh script that performs the following tasks:

  * cleanup
  * github repos cloning (leveraging install.repo file) : Backend and Private
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
* You will get a new wodadmin user
* You will get a set of students

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

  * Define the WODPRIVREPO with the correct url to clone (example in last line of install.repo) WODPRIVREPO="git clone [git@github.com](mailto:git@github.com):Account/Private-Repo.git wod-private"

**Note: When using a token**

Please refer to the following [url](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) to generate token :

* edit the install.repo file located in install directory of wod-backend:

  * Uncomment line : token=`cat $EXEPATH/token`
  * use the token in the url WODPRIVREPO="git clone <https://user:$token@github.com/....../wod-private.git> wod-private"

Y﻿ou are now ready to perform the installation again to support a private repository. 

```shellsession
sudo ./install.sh -t backend -g staging -b jup.example.net -f notebooks.example.io -a api.example.io -e notebooks.example.io -s sender@example.io
```

Please note that this setup phase can be conccurent with the public setup phase. Indeed, the install script should detect the presence of the private repository owing to the presence of the install.priv file. It will automatically adjust the different scripts and variables to add the relevant content. It will actually overload some of the variables with the private ones.