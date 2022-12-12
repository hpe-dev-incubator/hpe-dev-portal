---
title: "Apps and Infrastructure as Code with Ansible using HPE Cloud Volumes and Amazon AWS"
date: 2017-11-29T09:18:49.512Z
author: Michael Mattsson 
tags: ["devops","hpe-cloud-volumes","ansible","docker","hpe-nimble-storage"]
authorimage: "/img/blogs/Avatar5.svg"
featuredBlog: false
priority:
thumbnailimage:
---
[HPE Cloud Volumes](https://cloudvolumes.hpe.com) (formerly [Nimble Cloud Volumes](https://www.nimblestorage.com/cloud/)) introduces the exciting capability of consuming HPE Nimble Storage as a service in the public cloud. We recently came out of beta and we're introducing new features constantly. We just published our [REST API for HPE Cloud Volumes](https://docs.cloudvolumes.hpe.com/help/rest/api-reference) and all of a sudden open up a plethora of new use cases for the service. One of them is the ability to include HPE Cloud Volumes when managing applications and infrastructure as code as most cloud-native shops do today. Also, we added basic HPE Cloud Volumes functionality to the [HPE Nimble Storage Ansible role](https://galaxy.ansible.com/NimbleStorage/Ansinimble/). The following tutorial will walk through deploying [Docker CE](https://www.docker.com/community-edition) on HPE Cloud Volumes and deploy a distributed application on top of Docker Swarm using [Ansible](https://www.ansible.com).

# Introduction
As my day job is primarily in the container space I can't be more excited of being able to consume HPE Nimble Storage as a service in the public cloud. While we don't have any container specific integration at this point (please see Future below), such as a Docker Volume plugin, there are still some unique benefits we bring to the container use case over traditional EBS ([Elastic Block Storage](https://aws.amazon.com/ebs/)) from AWS.

In essence, I'm going to relocate the Docker host `/var/lib/docker` filesystem to a volume hosted by HPE Cloud Volumes. At a glance, these are the immediate realizations:
* Millions of times more reliable block storage over EBS
* Instant snapshots, clones and restore without having to copy objects to S3
* Clone volumes to any cloud, not just AWS
* Instant resize of block devices and immediately being able to expand the filesystem
* Run multicloud Docker Swarm clusters with a single pane of management for storage consumption
* More than twice the random performance and granularly being able to dynamically set IOPS limits

I think these are very compelling reasons why you want to host your applications on HPE Cloud Volumes for better reliability, performance and data services.

We also support replication of on-premises HPE Nimble Storage arrays to HPE Cloud Volumes for data migration and Hybrid IT use cases. This functionality will be covered and included in our Ansible role at a later date. Specifically, how to replicate any on-premises volume and clone it into a container to run workloads.

# Assumptions
Certain assumptions are being made and are not covered in depth and a bit out of scope:
* [Ansible](https://www.ansible.com) is an IT automation platform that lets users define and manipulate the state of apps and infrastructure in simple to read [YAML](https://en.wikipedia.org/wiki/YAML) files. This blog post is not the right forum to get started with Ansible but it's used here merely as an example.
* Following along these examples requires a HPE Cloud Volumes account with automation setup for Amazon AWS as explained in [the HPE Cloud Volumes documentation](https://cloudvolumes.hpe.com/ncv-help/automating/). This includes setting up an IAM role for HPE Cloud Volumes.
* The EC2 security group attached to the VPC requires SSH access from the Ansible host network and access to port 9000.
* We're deploying [Minio](https://minio.io) in distributed mode. Minio is a standalone AWS S3 compatible storage server. Some knowledge of AWS S3 is helpful but not required.

# Overview
This stack diagram illustrate our end-state to help better understand what we're deploying.

![Architecture Overview](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/11/blog-diagram-hpecv-1511946990044.png)

# Setup
The example goes from spinning up eight EC2 instances to consume HPE Cloud Volumes, install Docker, setup a Docker Swarm, deploy [Minio](https://www.minio.io)/[NGINX](https://www.nginx.com) and setup an ELB ([Elastic Load Balancer](https://aws.amazon.com/elasticloadbalancing/)) for external facing traffic. Some utility playbooks shows off some of the Ansible role features and capabilities such as expanding storage and setting new IOPS limits. There's also a playbook provided to destroy all the resources created during the deployment phase.

**DISCLAIMER**: While I've gone through great length to ensure resources are tagged appropriately I do not check for conflicting tags that may have unforeseen side effects when connecting and deleting resources.

## git clone and setup basic parameters
All playbooks and roles are hosted on [GitHub](https://github.com/NimbleStorage/automation-examples). The Ansible host uses Ubuntu 16.04.3 in these examples but any Linux distro will do, please adjust the install procedure accordingly.

Prepare Ansible host (Ubuntu 16.04.3):

```
sudo apt-get update 
sudo apt-get install -y git python python-boto python-boto3 python-jmespath python-pip
sudo pip install --upgrade pyopenssl ansible
git clone https://github.com/NimbleStorage/automation-examples
cd automation-examples/cloud/varlibdocker
ansible-galaxy install -r galaxy.txt 
```

**Important:** The rest of this guide assumes current working directory `automation-examples/cloud/varlibdocker`

Copy `group_vars/all/main.yml-dist` and `group_vars/all/secrets.yml-dist` to their respective basenames:

```
for i in group_vars/all/*-dist; do mv ${i} $(sed -e 's/-dist$//' <<< ${i});done
```

Edit `group_vars/all/main.yml` to fit your AWS environment:

```YAML
---
# Configure these
swarm_region: us-west-1        # This is the region you're provisioning in
swarm_key: myawskey            # This is the named IAM key to use for your EC2 instances
swarm_subnet: subnet-00000000  # The subnet ID your HPE Cloud Volumes will be provisioned to
swarm_cidr: "0.0.0.0/0"        # The CIDR of the above subnet
swarm_cloud: vpc-00000000      # The VPC the HPE Cloud Volumes will be provisioned to
```
There are a few other preference parameters to look at, like instance and cluster sizes. These are not necessary to tune.

Edit `group_vars/all/secrets.yml` and store your HPE Cloud Volumes credentials:

```YAML
---
cloud_portal_access_key: nimble            # Your HPE Cloud Volumes key
cloud_portal_access_secret: nimblestorage  # Your HPE Cloud Volumes secret
```

**Note:** While not required, it's highly recommended to protect credentials with Ansible Vault. 

The next few steps require you to download and install the named AWS key that is referenced in the `swarm_key` variable and name it `ec2.pem`:

```
scp user@host:mykey.pem ec2.pem
chmod 0400 ec2.pem
```

Next, we rely on the latest `ec2.py` dynamic inventory script. Download accordingly:

```
wget -O contrib/inventory/ec2.py https://raw.githubusercontent.com/ansible/ansible/devel/contrib/inventory/ec2.py
chmod 755 contrib/inventory/ec2.py
```

Both the the `ec2.py` inventory script and the Ansible modules relies on environment variables with your access key, secret key and AWS region you're working with:

```
set +o history
export AWS_ACCESS_KEY_ID=nimble
export AWS_SECRET_ACCESS_KEY=nimblestorage
export AWS_REGION=us-west-1
set -o history
```

If you have instances running in EC2 under your account. Now is a good time to see if your credentials are good:

```
./contrib/inventory/ec2.py --list
```

This should eventually list your EC2 instances' external IP addresses in various groupings based on tags, instance names, internal names and a very handy list of variables made available to the instance with an `ec2_` prefix.

**Note:** Building the EC2 dynamic inventory seems to take excessive amount of time on occasion. Please be patient.

# Deploy!
The next few steps discuss the operation of the playbooks provided. Please ensure that environment variables are properly set as described above and that the current working directory is `storage-automation/cloud/varlibdocker`.

## site.yml
As per convention, `site.yml` sets up the environment end-to-end and after execution you should have a Minio environment set up at the ELB URL presented at the end of the play.

Execute as follows:

```
ansible-playbook site.yml
```

Four main plays are executed and divided as follows:
### deploy.yml
This playbook deploys the instances as specified in `group_vars/all/main.yml`. Since the base AMI is the official vanilla Ubuntu from Canonical a few extra bootstrap steps are required to make the instances eligible for Ansible automation. 

The play also creates a Cloud Volume for each instance and attaches it on `/var/lib/docker`. It uses most defaults from the `NimbleStorage.Ansinimble` role which is a 10GiB volume capped at 1000 IOPS and presented on the networks specified in `group_vars/all/main.yml`. You should see eight volumes appear on the HPE Cloud Volumes portal with the naming convention `varlibdocker-`.

The Cloud Volume is then mapped and connected to the instances with the `ncvol` utility which is downloaded and installed from the HPE Cloud Volumes portal as part of the play itself.

### prepare.yml
This play installs Docker from the official repos supplied by Docker, Inc. Plain and simple.

### formation.yml
One of the master nodes is tagged as the pet (or master manager, depending how you see it) and the pet node will initialize the Docker Swarm and join the remaining managers and workers to the cluster.

### app_deploy.yml
Since the Docker integration with Ansible is a bit behind, bare `docker` commands are run on the pet node to deploy the latest official Docker Swarm Minio example [provided by Minio](https://raw.githubusercontent.com/minio/minio/master/docs/orchestration/docker-swarm/docker-compose-secrets.yaml). 

What is important to understand here is that Minio uses locally named volumes in this example and data will be locked to wherever the distributed Minio cluster is instantiated. Therefore, intentionally, I put a constraint on the service post-deploy to lock the services to whichever node they were first started on. Minio will survive loss of half the nodes in distributed mode due to its erasure coding but Docker Swarm has no means to guarantee any two services will be placed correctly and you'll in most cases end up with a broken Minio at the next service update or restart. Highly undesirable. To allow services to roam freely in the cluster a shared filesystem or an external Docker Volume plugin is required. We discuss the latter in the Future section below.

A trained eye will also see that there's an NGINX global service being deployed. This is because of a long-standing [issue with ELB](https://forums.aws.amazon.com/thread.jspa?threadID=33085) and the NGINX trick is simply used to workaround that particular issue (the executive version: you can't have multiple backend ports). The `Dockerfile` and `nginx.conf` file is included in `files/nginx_lb`. The image being pulled is from my personal Docker Hub account, please enjoy! 

The last step deploys an ELB that fronts the NGINX server. The ELB is an unencrypted TCP load-balancer.

## Hello World!
If the `site.yml` play completes successfully, you should see a URL at the end of the play. This is where your Minio instance is running. Please proceed to login with username `nimble` and password `nimblestorage`.

Just before the profile summary and play recap:

```

TASK [deploy_elb : debug] ***************************************************************
Wednesday 22 November 2017  08:10:24 +0000 (0:00:01.599)       0:12:08.675 ****
ok: [localhost] => {
    "msg": "http://minio-271113730.us-west-1.elb.amazonaws.com:9000"
}

PLAY RECAP ******************************************************************************
13.56.224.202              : ok=73   changed=18   unreachable=0    failed=0   
13.56.248.32               : ok=73   changed=18   unreachable=0    failed=0   
13.57.10.167               : ok=73   changed=18   unreachable=0    failed=0   
52.53.127.122              : ok=73   changed=18   unreachable=0    failed=0   
52.53.220.8                : ok=73   changed=18   unreachable=0    failed=0   
54.193.104.48              : ok=73   changed=18   unreachable=0    failed=0   
54.215.225.69              : ok=73   changed=18   unreachable=0    failed=0   
54.241.130.88              : ok=88   changed=31   unreachable=0    failed=0   
localhost                  : ok=23   changed=11   unreachable=0    failed=0   

Wednesday 22 November 2017  08:10:24 +0000 (0:00:00.031)       0:12:08.706 *************
========================================================================================
deploy_minio : ...and add constraints ------------------------------------------ 180.81s
Get Ansible working ------------------------------------------------------------- 28.61s
deploy_ec2 : Launch Workers ----------------------------------------------------- 28.20s
deploy_ec2 : Launch Managers ---------------------------------------------------- 22.56s
install_docker : Install Docker ------------------------------------------------- 18.54s
Refresh inventory --------------------------------------------------------------- 15.24s
NimbleStorage.Ansinimble : Install prerequisite packages ------------------------ 12.69s
NimbleStorage.Ansinimble : Install prerequisite packages ------------------------ 12.62s
NimbleStorage.Ansinimble : Install prerequisite packages ------------------------ 12.62s
NimbleStorage.Ansinimble : Install prerequisite packages ------------------------ 12.54s
NimbleStorage.Ansinimble : Install prerequisite packages ------------------------ 12.51s
NimbleStorage.Ansinimble : Install prerequisite packages ------------------------ 12.51s
NimbleStorage.Ansinimble : Install prerequisite packages ------------------------ 12.45s
NimbleStorage.Ansinimble : Install prerequisite packages ------------------------ 12.41s
install_docker : Add Docker repo ------------------------------------------------- 9.44s
Validate Docker ------------------------------------------------------------------ 7.51s
deploy_minio : command ----------------------------------------------------------- 6.59s
NimbleStorage.Ansinimble : Connect Cloud Volume ---------------------------------- 5.03s
NimbleStorage.Ansinimble : Connect Cloud Volume ---------------------------------- 4.86s
NimbleStorage.Ansinimble : Connect Cloud Volume ---------------------------------- 4.86s
Playbook run took 0 days, 0 hours, 12 minutes, 8 seconds
```

Use a web browser to visit that URL or skip directly to the `mc` part below the screenshots:

![Minio Login](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/11/minio-login-1511947049263.png)

Once logged you'll see something that resembles this:

![Minio Empty](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/11/minio-empty-1511947029503.png)

Here you can either create buckets and upload files or you can simply use the `mc` utility to access Minio:

```
sudo wget -O /usr/local/bin/mc wget https://dl.minio.io/client/mc/release/linux-amd64/mc
sudo chmod 755 /usr/local/bin/mc
mc config host add mys3 http://minio-271113730.us-west-1.elb.amazonaws.com:9000 nimble nimblestorage
```

With `mc` you can perform normal unix-like commands. Let's create a bucket and upload this repo's roles directory:

```
mc mb mys3/mybucket
mc cp -r roles mys3/mybucket
mc ls mys3/mybucket
```

> From an operational perspective, what we've done here is quite powerful. Everything is provisioned from human-readable YAML files that can be revision controlled and peer reviewed. Nothing is manual. Installing all the applications and infrastructure manually is just tedious and error-prone and not repeatable. This is Applications and Infrastructure as Code.

## Expand and boost performance
Included in the repository is a couple of utility playbooks. One expands the capacity and the other sets a new IOPS limit. Both have a fairly low conservative default limit and passing extra variables to the play is recommended. 

Before expanding the volumes, load up the Minio landing page that indicates how much space there is. After the play has finished, reload the page. You should see the extra space accordingly. 

Expand Cloud Volume:

```
ansible-playbook util_expand_cloud_volume.yml -e '{"cloud_volume_size": 1000000}'
```
**Note:** Extra variables such as `-e` can normally be passed as key/value pairs without JSON syntax. However, the REST APIs have strict data types and Jinja2 (the template engine Ansible relies on) converts to plain strings when not passing parameters in JSON.

You should have similar space as observed in the screenshots above if you didn't tinker with the default volume sizes. The new capacity is immediately available to Minio and should look something like this (if you didn't tinker with the cluster size):

![Minio Resized](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/11/minio-resized-1511947069528.png)

While it's entirely possible to write a playbook that takes both capacity and IOPS in one go, it's more intuitive to perform controlled updates in isolated increments.

Set a new IOPS limit:

```
ansible-playbook util_iops_cloud_volume.yml -e '{"cloud_volume_iops": 10000 }'
```

The new limit and capacity should be reflected in the HPE Cloud Volumes portal:

![Portal](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/11/portal-1511947086096.png)

## Destroy
Once done playing in the sandbox, the following playbook destroys **everything** provisioned. Including your HPE Cloud Volumes, ELB and EC2 instances.

```
ansible-playbook util_stack_destroy.yml
```

# Future 
The future looks brighter than ever when it comes to HPE Cloud Volumes and specialized host application integrations such as containers. HPE Nimble Storage has a strong vision that we're currently executing against that will gradually enable more use cases, especially for DevOps. We recently introduced replication to HPE Cloud Volumes, that in conjunction with our on-premises HPE Nimble Storage Docker Volume plugin and the upcoming HPE Nimble Storage Docker Volume plugin for HPE Cloud Volumes will allow for some advanced use cases for multicloud persistent storage. What about running CI/CD pipelines on cloned datasets or present data to ETL workflows and Hybrid IT deployments with multicloud strategies not even remotely possible with the constraints in traditional environments.

Running persistent storage in the public cloud for containers does not come without challenges. Docker Volumes for Docker, Persistent Volumes for Kubernetes or using DVDI to patch in a volume for Marathon with Mesos. They're all subject to the same [inherit limitations](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/volume_limits.html) of EBS (or [Azure Disk Storage](https://docs.microsoft.com/en-us/azure/azure-subscription-service-limits#virtual-machine-disk-limits)). Assessing the storage market there's a number of vendors out there trying to combat the persistent storage on EBS paradigm by abstracting the block devices (with or without filesystems) to container native storage elements and create resiliency in software by replication or mirroring schemes. Storage management becomes part of the application domain and compute cycles and N-way replication schemes becomes part of the end-users accounting along with any software licenses schemes imposed by the vendor. There are of course very viable open source options that are free to use but ties more compexity to the back of the application owner who at the end of the day just wanted some persistent storage for his application.

We hope to address a number of shortcomings with our persistent storage drivers and plugins for the top three container orchestrators and leverage the native storage frameworks provided without any side-effects.

# Conclusions
Thank you for following this tutorial and hopefully it has been useful and sparked interest and ideas about Containers, Hybrid IT and multicloud. Wherever you are on your journey, we're very eager to hear what challenges exist out there today, particularly when it comes to presenting data across public cloud boundaries and data intense use cases. I genuinely believe HPE can help out in a multitude of ways. 

Please join our Slack community, it's just starting up, [register here and say hello](https://www.labs.hpe.com/slack), I'm user `michaelm`. Follow [me](https://twitter.com/drajen) and [HPE DEV](https://twitter.com/HPE_Developer) on Twitter!