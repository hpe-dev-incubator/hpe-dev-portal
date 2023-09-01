---
title: HPE NonStop DevOps
date: 2023-08-30T13:50:59.689Z
author: Kamala Sreenivasan
authorimage: /img/Avatar1.svg
disable: false
tags:
  - hpe-nonstop
  - devops
---
The DevOps approach has gained significant momentum over the past decade as today’s enterprises require shorter development and deployment cycles to gain faster time to market and obtain fast feedback for improvement. DevOps helps in continual product rollouts by bridging silos and streamlining change management practices, improving not only  development efficiency but also ensuring consistency and reliability of deployments.

Gartner forecasts a 5.1% increase in Worldwide IT Spending in 2023, with organizations focused on realizing operational efficiency, cost reductions and/or cost avoidance during the current economic uncertainty. One can infer from this that investments in DevOps and improving DevOps practices is likely to increase. As HPE NonStop customers increasingly embrace DevOps, this is the right time to look at DevOps offerings for the HPE NonStop platform. And now is even more important than ever, as HPE NonStop is takings it steps towards becoming cloud ready!

DevOps is a culture and a continuous process of improving efficiency. It can be applied to the various phases of software development, deployment, and post deployment with the aid of tools and automation. While the culture aspect is organization specific, in this article, I will discuss the tools recommendation, automation and artifacts that aid the DevOps adoption for HPE NonStop.

# HPE NonStop is DevOps ready!

In DevOps, you build and operate Continuous Integration/Continuous Delivery (CI/CD) pipelines. Continuous Integration includes phases such as plan, code, build, and test, while Continuous Delivery (CD) covers the continuous delivery and deployment aspects, including release, deployment, operation, and monitoring of the software. 

HPE NonStop is DevOps ready. This means that, for each of the phases, there are tool sets specific to the platform identified and workflows that can be automated to achieve efficient, repeatable, and reliable production ready software.

# HPE NonStop DevOps starter kits

HPE NonStop supports multiple languages and usage of DevOps for HPE NonStop is classified based on languages. ([CustomerUsageProfileClassification](https://github.com/HewlettPackard/NonStop/blob/main/nsdevops/images/CustomerUsageProfileClassification.jpg)). This classification is not only required for toolset recommendations, but also for demonstrating the tool usages through starter kits. The starter kits are customer usage profile specific, ready to use, developer-friendly and production-ready. Each starter kit consists of a sample application (typically client/server), a set of pipeline scripts and a README file with usage instructions. These are hosted on GitHub <https://github.com/HewlettPackard/NonStop/tree/main/nsdevops>

The intent of the starter kit is to demonstrate pipelines and tools for a language usage profile. These reusable scripts and pipelines in the starter kit are an effortless way to get started with DevOps and try it out with customer applications.

The starter kits currently available are:

<style>
table {
    display: block;
    width: 100%;
    width: max-content;
    max-width: 100%;
    overflow: auto; 
     -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none; 
    border:1px solid grey;
}
td {
   -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    border:1px solid grey;
    text-align: left !important; 
    padding: 10px !important;
}
thead tr:first-child td {
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  border:1px solid grey;
  text-align: center !important; 
  padding: 20px !important; 
  font-weight: bold !important;
}
</style>

| Name | Description | Location |
| ---- |-------------|----------|
| C Starter Kit | CI sample for C/C++  based applications built using cross-compilers | [C](https://github.com/HewlettPackard/NonStop/tree/main/nsdevops/c)            |
| Java Starter Kit | CI sample for Java based applications built off-platform compilers | [java](https://github.com/HewlettPackard/NonStop/tree/main/nsdevops/java) |
| Java JNI Starter Kit | CI sample for polyglot Java and C applications built on-platform on HPE NonStop | [javajni](https://github.com/HewlettPackard/NonStop/tree/main/nsdevops/javajni) |
| Python Starter Kit | CI sample for Pythons based applications | [python](https://github.com/HewlettPackard/NonStop/tree/main/nsdevops/python) |
| CD Starter Kit | Continuous Deployment using HPE NonStop Manageability Framework (NSMF) and Ansible | [cd](https://github.com/HewlettPackard/NonStop/tree/main/nsdevops/cd) |

Most of the starter kits demonstrate continuous integration (CI). For the continuous deployment, NSMF and Ansible-based deployments are used. While the CD starter kit is demonstrated with a Java application, the dev, test and production environment setup and concepts remain the same for application of any language profile. The CD starter kit can also be extended to HPE NonStop system configuration management and HPE NonStop system administration activities.

# Using the Starter Kits  

Developers new to DevOps should use the [HPE NonStop ModernDevOps - Instructions for CI-CD setup](https://github.com/HewlettPackard/NonStop/blob/main/nsdevops/HPE%20Nonstop%20Server-Modern%20DevOps-Instructions-for-CI-CD-Setup%20Documnet_v1.2.pdf) for preparing the environment to get started. If the enterprise already has a DevOps setup, go through the recommended setup ([Recommended Setup](https://github.com/HewlettPackard/NonStop/blob/main/nsdevops/images/RecommendedSetup.jpg)) and the instructions in the above guide to ensure HPE NonStop systems are configured to be accessible in the CI Tool.

Getting started with the starter kits is easy.

* First download the starter kit from the HPE NonStop [git repository](https://github.com/HewlettPackard/NonStop/tree/main/nsdevops).
* Select the appropriate folder applicable to language profile.
* Upload the code from that folder to the organization GIT. Go through the instructions in the README.md file of the starter kit and update the pipeline script to point to the right repository.
* Make appropriate changes based on the environment. Commit the changes to the organization git. The pipelines will start executing.

The scripts can be reused for applications in the same language profile with minor changes, such as modifying GIT repository and build steps, if any.

# Starter Kits are cloud ready!

As more development environments are moving to public cloud, cloud vendors are offering DevOps services. HPE NonStop development environment (NSDEE) and cross-compilers and tools are also available on the public cloud now.

The starter kits have ready-to-use pipelines for popular cloud vendors and their DevOps services, such as AzureDevOps and AWS CodeBuild, can be used to demonstrate how the HPE NonStop development and deployment can be integrated easily using those cloud services.

For the platform agnostic language profiles on HPE NonStop, such as Python and Java, follow the instructions given in the vendors’ DevOps documentation. Alternately, specific scripts are provided in the starter kit. The buildspec.yml file, if present in the root folder of the repository – i.e. the AWS CodeBuild, will automatically build the project. Similarly, while using Azure, create a build script or choose to use the one provided with the starter kit.

The C, Python, Java starter kits are cloud ready. Currently, support is provided for AWS CloudBuild or AzureDevOps. In future, the HPE NonStop development team will include other cloud vendor specific scripts and integrations in the starter kits.

DevOps is supported on HPE NonStop, and starter kits are here to help you get started. Go, explore the HPE NonStop DevOps starter kits now!