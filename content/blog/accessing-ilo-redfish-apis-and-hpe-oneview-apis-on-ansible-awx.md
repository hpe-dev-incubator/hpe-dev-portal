---
title: "Accessing iLO Redfish APIs and HPE OneView APIs on Ansible AWX"
date: 2021-02-09T03:40:59.966Z
author: Nathan Lin 
tags: ["ilo-restful-api","hpe-oneview"]
authorimage: "/img/blogs/Avatar3.svg"
featuredBlog: false
priority:
thumbnailimage:
---
There has been a growing demand in infrastructure management automation and an adaption toward infrastructure-as-code (IAC) with Ansible and AWX. Backed by Red Hat, Ansible has become one of the most popular IAC toolings for its simple and easy to understand coding style, masterless and agentless design, and the ability to create custom playbooks and roles for providing extra support to process automation. [AWX](https://github.com/ansible/awx), on the other hand, is the open-sourced version of Ansible Tower, which along with a set of tools, provides a web-based graphical user interface hub for consuming Ansible playbooks. 

Both the [HPE Python iLO REST Library](https://github.com/HewlettPackard/python-ilorest-library) and the [HPE OneView SDK for Ansible](https://github.com/HewlettPackard/oneview-ansible) do not come bundled with AWX. The AWX project does provide instructions on [managing custom Python dependencies](https://github.com/ansible/awx/blob/devel/docs/custom_virtualenvs.md#managing-custom-python-dependencies) on AWX. This blog post is to share the process that we took to set up a custom Python environment for the Python iLO REST Library and the HPE OneView SDK in order to access the iLO Redfish APIs and the HPE OneView APIs from an AWX job.


# Ansible and AWX setup on localhost
Ansible and AWX setup instructions can be found  [here](https://github.com/ansible/awx/blob/devel/INSTALL.md#installing-awx) on GitHub. If running behind proxies, make sure the proxy parameters, such as _http_proxy_, _https_proxy_, and _no_proxy_ are configured accordingly in the installation inventory file. Once installation completes, the Ansible command becomes available on the localhost, and AWX runs as a containerized application, as shown here:
```
bash-4.4# ansible --help
usage: ansible [-h] [--version] [-v] [-b] [--become-method BECOME_METHOD]
               [--become-user BECOME_USER] [-K] [-i INVENTORY] [--list-hosts]
               [-l SUBSET] [-P POLL_INTERVAL] [-B SECONDS] [-o] [-t TREE] [-k]
               [--private-key PRIVATE_KEY_FILE] [-u REMOTE_USER]
               [-c CONNECTION] [-T TIMEOUT]
               [--ssh-common-args SSH_COMMON_ARGS]
               [--sftp-extra-args SFTP_EXTRA_ARGS]
               [--scp-extra-args SCP_EXTRA_ARGS]
               [--ssh-extra-args SSH_EXTRA_ARGS] [-C] [--syntax-check] [-D]
               [-e EXTRA_VARS] [--vault-id VAULT_IDS]
               [--ask-vault-pass | --vault-password-file VAULT_PASSWORD_FILES]
               [-f FORKS] [-M MODULE_PATH] [--playbook-dir BASEDIR]
               [-a MODULE_ARGS] [-m MODULE_NAME]
               pattern
```
```
[root@localhost ~]# docker ps
CONTAINER ID   IMAGE                COMMAND                  CREATED      STATUS      PORTS                  NAMES
79248db66699   ansible/awx:17.0.1   "/usr/bin/tini -- /u…"   5 days ago   Up 5 days   8052/tcp               awx_task
11e9c78d53cf   ansible/awx:17.0.1   "/usr/bin/tini -- /b…"   5 days ago   Up 5 days   0.0.0.0:80->8052/tcp   awx_web
46c529f34016   postgres:12          "docker-entrypoint.s…"   5 days ago   Up 5 days   5432/tcp               awx_postgres
75c8e09ad2de   redis                "docker-entrypoint.s…"   5 days ago   Up 5 days   6379/tcp               awx_redis
```

# Installing the HPE libraries on AWX
The installation of the HPE Python iLO REST library and the HPE OneView Ansible library can be achieved by the following three steps: 

1. Log in to the _awx_task_ container. Create a custom Python virtual environment and install the HPE Python iLO REST library and the HPE OneView Ansible library using the Python package manager.

2. Log in to the _awx_web_ containers. Create a new virtual environment with the same name as the one newly created in the _awx_task_ container, and then install these two HPE Python libraries again using the Python package manager.

3. Lastly, add the new Python environment to the _custom_virtualenvs_ in AWX through its REST APIs.

Keep in mind to create the virtual environments first in _awx_web_ and _awx_task_ before adding it to the AWX custom virtual environment. The following sections talk more about each of the steps.

## Create new custom virtual environments on _awx_task_ and _awx_web_
First, access the container BASH shell with the command _Docker exec -it_  . For example, accessing the _awx task_ shell :
```
[root@localhost ~]# docker exec -it awx_task /bin/bash
bash-4.4#
```
Within the container, create a new Python virtual environment. For this example, the virtual environment is created at _/opt/hpeAutomation/venv_:  
```
bash-4.4# mkdir -p /opt/hpeAutomation/
bash-4.4# chmod 0755 /opt/hpeAutomation/
bash-4.4# python3 -m venv /opt/hpeAutomation/venv
```
## Install the HPE libraries on  _awx_task_ and _awx_web_
On each of the AWX containers, proceed as follows:

1. YUM install the pre-requisites gcc:
```
bash-4.4# yum install gcc -y
```

2. Install the psutil Python module and the HPE libraries:
```
bash-4.4# /opt/hpeAutomation/venv/bin/pip3 install psutil
bash-4.4# /opt/hpeAutomation/venv/bin/pip3 install ansible hpOneView hpICsp python-ilorest-library
bash-4.4# git clone https://github.com/HewlettPackard/oneview-ansible.git
bash-4.4# cd oneview-ansible
bash-4.4# cp library/*.py  /opt/hpeAutomation/venv/lib/python3.6/site-packages/ansible/modules/remote_management/oneview/
bash-4.4# cp library/module_utils/oneview.py  /opt/hpeAutomation/venv/lib/python3.6/site-packages/ansible/module_utils 
```
## Configure the _custom_virtualenvs_ in AWX
Once finished installing the Python modules to _awx_task_ and _awx_web_ , the last step is to add the newly created virtual environment to _custom_virtualenvs_  in AWX. This can be done with a HTTP PATCH to the AWX:
```
[root@localhost ~]# curl -X PATCH http://AWX_admin_username:AWX_adminpassword@AWX_ip_address/api/v2/settings/system/ \
-d '{"CUSTOM_VENV_PATHS": ["/var/lib/awx/venv/ansible", "/opt/hpeAutomation/"]}' \
-H 'Content-Type:application/json'
```

You can verify the _custom_virtualenvs_ in AWX with a HTTP GET request to _/api/v2/config/_ , as shown below:
```
[root@localhost ~]# curl -u AWX_admin_username:AWX_admin_password http://AWX_IP_address/api/v2/config/
{
  "time_zone": "UTC",
  "license_info": {
    "license_type": "open",
    "valid_key": true,
    "subscription_name": "OPEN",
    "product_name": "AWX"
  },
  ...
  ..
  .
  "custom_virtualenvs": [
    "/var/lib/awx/venv/ansible/",
    "/opt/hpeAutomation/venv/"
  ]
}
```
Once completed, the custom virtual environment becomes available as an _Ansible Environment_ in the _AWX Projects_ and the Python libraries become accessible by the Job Templates in the project.
![project](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/pic1-1612842533941.png)
![template](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/pic2-1612842545279.png)

There you have it. The AWX is now ready to run jobs for HPE OneView and iLO.