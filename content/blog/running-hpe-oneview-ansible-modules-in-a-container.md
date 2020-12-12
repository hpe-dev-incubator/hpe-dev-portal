---
title: "Running HPE OneView Ansible modules in a container"
date: 2018-10-02T20:58:25.182Z
author: Bob Fraser 
tags: ["HPE-OneView","OneView","Ansible"]
path: running-hpe-oneview-ansible-modules-in-a-container
---
# Running HPE OneView Ansible modules in a container

The [HPE OneView Ansible modules](https://github.com/HewlettPackard/oneview-ansible) are one of the most popular [HPE OneView integrations](https://hpe.com/developers/oneview).
The Ansible modules automate the provisioning of physical infrastructure on-demand using software-defined templates from [HPE OneView](https://hpe.com/info/oneview). A containerized version of the Ansible modules is available at the [Docker Store](https://store.docker.com/community/images/hewlettpackardenterprise/oneview-ansible-debian).

Docker containers provide a low friction way to get developer environments and CI/CD pipelines up and running easily and consistently. The [oneview-ansible-in-container](https://github.com/HewlettPackard/oneview-ansible-samples/tree/master/oneview-ansible-in-container
) sample has an Ansible playbook you can use to try out the `oneview-ansible-debian` container. It also has a [how-to guide](https://github.com/HewlettPackard/oneview-ansible-samples/blob/master/oneview-ansible-in-container/oneview-ansible-in-container.md) that walks you through the steps needed to set up and run the playbook container.  Once you have set up an environment to run Ansible playbooks using the HPE OneView modules in a container, you can switch to other directories and try other samples.