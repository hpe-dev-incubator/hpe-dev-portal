---
title: Detect, Correct and Automate compliance requirements on HPE OneSphere deployments with InSpec and Chef Automate
date: 2018-10-05T01:46:26.479Z
author: HPE DEV staff 
tags: ["onesphere","chef","inspec","compliance","automate"]
path: detect-correct-and-automate-compliance-requirements-on-hpe-onesphere-dep
---
Mudassar Shafique

Partner Solutions Architect - Chef Software

<mshafique@chef.io>## Summary
In a previous [post](https://developer.hpe.com/blog/deploy-your-applications-with-hpe-onesphere-apis-and-habitat-manage-conf), you learned how to create [HPE OneSphere](https://www.hpe.com/us/en/solutions/cloud/hybrid-it-management.html) deployments, install applications on the deployed VMs using Habitat, and start managing the configuration of these deployments using Chef Automate. As configuration practices become more efficient, testing, security, and compliance can become a new bottleneck. [InSpec](https://www.chef.io/inspec/) is a testing framework for infrastructure with a human-readable language for specifying compliance, security and other policy requirements as tests. Chef Automate is a continuous automation platform supporting capabilities to build, deploy, manage, and collaborate across all aspects of software production. It is designed to help organizations deliver software faster, manage risk, and assure software security and stability. Visibility features in the platform provide a powerful way to gain insight into infrastructure, applications, and compliance, providing teams a single location to access customized views and reporting.

In this post, you learn how our deployments consistently meet compliance requirements using InSpec and Chef Automate. You see the steps needed to perform a compliance scan on a Linux VM deployed in AWS public cloud and a Windows server running on an HPE Synergy cluster in a private data center, both managed by HPE OneSphere. You also learn details on how to create new InSpec profiles for compliance requirements, run them on HPE OneSphere deployments, and view the results in Chef Automate. Source code used in this example, including recipes to fix and automate the compliance issues, is available in this [Git repository](https://github.com/chef-partners/1s-inspec-example).

![Figure 1 - Overview](/uploads/media/2018/9/onesphere-chef-inspec-phase1-01-1538705075379.png)## Environment setup (pre-requisite)

To follow the steps in this example, you will need an environment with HPE OneSphere and Chef Automate. The environment can be setup as below:

I. Deployed an AWS Linux VM in public cloud and a Windows Server 2016 VM in a private HPE Synergy environment using HPE OneSphere Portal

![Figure 2 - Deployments in HPE OneSphere Portal](/uploads/media/2018/9/onesphere-chef-inspec-phase1-02-1538705093235.png)

II. Spun up a [Chef Automate](https://automate.chef.io/docs/install/) server and configured a workstation to communicate with it using [knife](https://docs.chef.io/knife_setup.html)

III. Download the Chef cookbooks and InSpec profiles used in this example from [Git repository](https://github.com/chef-partners/1s-inspec-example)

````
git clone https://github.com/chef-partners/1s-inspec-example
````
Upload the cookbooks using berks utility, a Berksfile is present under cookbooks folder

````
cd 1s-inspec-example/cookbooks
berks install
berks upload
````## InSpec profiles for compliance requirements

This section includes the following InSpec profiles to check compliance requirements: 

a. **Check SSH version 2 is installed:** A profile that checks SSH version 2 is installed in our AWS Linux VM.  SSH supports two different and incompatible protocols: SSH1 and SSH2. SSH1 was the original protocol and was subject to security issues. SSH2 is more advanced and secure.

b. **Check password history is set to 24 or more passwords:** Another profile to check security policy for password history is set to 24 on Windows Server. This policy setting determines the number of renewed, unique passwords that have to be associated with a user account before you can reuse an old password. The longer a user uses the same password, the greater the chance that an attacker can determine the password through brute force attacks. 

These profiles are part of [Git repository](https://github.com/chef-partners/1s-inspec-example) cloned in the environment setup section. Follow the steps below to upload these to Chef Automate compliance server:

I. Login to InSpec from your workstation

````
inspec compliance login https://Your-Chef-Automate-URL --user='admin' --ent=Your-Chef-Org-Name --token=Your-API-Token --insecure
````
You can generate API token from Chef Automate with [these steps](https://automate.chef.io/docs/api-tokens/#creating-a-standard-api-token).

II.	Upload the InSpec profiles

````
cd 1s-inspec-example
inspec compliance upload inspec/ssh-check
inspec compliance upload inspec/pwd-check
````
These profiles will now appear in Chef Automate UI.

![Figure 3 - InSpec Profiles in Chef Automate](/uploads/media/2018/9/onesphere-chef-inspec-phase1-03-1538705104034.png)## Scan deployments 

To attach HPE OneSphere deployments with Chef Automate, bootstrap these VMs using Knife. 

I. Bootstrap AWS Linux VM

````
knife bootstrap ec2-user@FQDN-OR-IP -i YOUR-SSH-KEY.pem -N AWS_Linux --sudo
````
II. Bootstrap Windows Server

````
knife bootstrap windows winrm FQDN-OR-IP --node-name Windows_Server --winrm-user Administrator --winrm-password YOUR-PASSWORD
````
III. Update the run-lists

````
cd 1s-inspec-example/cookbooks

knife node run_list add AWS_Linux chef_client_wrapper audit_wrapper

knife node run_list add Windows_Server chef_client_wrapper audit_wrapper
````
These deployments will now appear in Chef Automate UI as client nodes. Chef_client_wrapper cookbook will ensure Chef client runs on these nodes every 30 minutes, and audit_wrapper cookbook will enable InSpec scans on the nodes with every Chef client run.

![Figure 4 - Nodes in Chef Automate](/uploads/media/2018/10/onesphere-chef-inspec-phase1-04-1538785973071.png)## Examine the scan results

Switch to the compliance section in Chef Automate to see the results of scans. Both of the deployments are failing the required checks. AWS _Linux VM is missing SSH2 and Windows Server has password history setting set to less than 24.

![Figure 5 - Nodes in Chef Automate](/uploads/media/2018/9/onesphere-chef-inspec-phase1-05-1538705125009.png)## Complete the Detect, Correct and Automate Cycle

Solutions of compliance issues need to be automated and continuous. Our [Git repository](https://github.com/chef-partners/1s-inspec-example) has some cookbooks and recipes that contain fixes for issues reported by our compliance runs. Chef Automate maintains a run-list of recipes for each node. Adding these recipes to run-list of nodes will make them execute with every Chef client run. With the first run, these recipes will fix the issues and every subsequent Chef client run will ensure the system stays in the desired state continuously.

Use the following commands from your workstation to update the run lists:

````
cd 1s-inspec-example/cookbooks

knife node run_list add AWS_Linux sshd

knife node run_list add Windows_Server pwd_policy
````
With the next Chef client run, the environment achieved the desired compliance state.

![Figure 6 - Compliance view in Chef Automate](/uploads/media/2018/9/onesphere-chef-inspec-phase1-06-1538705136735.png)## Conclusion

Chef Automate has 100+ built-in compliance profiles in the asset store. These profiles address the common security and standardization requirements. This post presented how you can create InSpec profiles for the compliance requirements, and enable them on HPE OneSphere deployments running on different platforms and operating systems. Once issues are detected, you want to not only fix them but also keep the systems continuously configured for compliance. This is easy to achieve with Chef recipes and continuous environment scans. 

Stay tuned for another post in the HPE and Chef integration series.