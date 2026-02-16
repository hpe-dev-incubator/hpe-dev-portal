---
title: Cascading dropdown lists on HPE Morpheus Enterprise forms
date: 2026-02-11T11:16:09.248Z
author: Neil van Rensburg
authorimage: /img/greenlogo.png
disable: false
---
## Introduction

HPE Morpheus Enterprise enables the customization of form elements across instance provisioning, workflows, and service catalog items, providing greater flexibility and control. Drop-down lists can be populated using various types of option sources.

This article focuses on demonstrating cascading (interdependent) drop-down lists using both REST-based and plugin-based option sources.

## Demo environment

The demo environment for this consist of a **JSON Server** VM and an **HPE Morpheus Enterprise** appliance. The development environment assumes plugin compile capability as described in the article [A Beginner’s Guide to Building and Compiling HPE Morpheus Enterprise Plugins](https://developer.hpe.com/blog/morpheus-plugin-tutorial-how-to-build-and-compile/).

For the purposes of this article, the **JSON Server** was setup on a clean Debian 12 install, on the same network segment as the **HPE Morpheus Enterprise** appliance. Data for the **JSON Server** web endpoint below is supplied by a **locations.json** file. The content for this file can be found [here](https://github.com/neilvrhpe/OptionSourceDemo/blob/main/locations.json). 

**JSON Server** was setup using the following commands:

`apt update
apt install nodejs npm -y
npm install json-server
vi locations.json 
npx json-server --host 0.0.0.0 --port 80 locations.json`

(Bear in mind that minimal Debian doesn't install with the **sudo** command by default. Prepend **sudo** to administrative commands where appropriate to your OS distribution)

In this demo, the **JSON Server** web endpoint responds on **http://demojsonserver** and renders this:

![](/img/jsonserver_home.png)

The 3 headings: **countries**, **states** and **cities** reflect the base objects in the **locations.json** file:

![](/img/locations_json.png)

In this way, the endpoint **http://demojsonserver/countries** provides the 3 countries in the **locations.json** file:

![](/img/locations_json.png)

## Creating the Option Lists

To create the **Option Lists** in **HPE Morpheus Enterprise**, navigate to **Library** > **Options** > **Options Lists**. Click **Add**. The following dialog will be displayed:

![](/img/add_optionlist.png)

Consider the selection options for the **Type** field that controls where Option List data is sourced from.

**REST:** Web endpoint requests.

**Morpheus Api:** HPE Morpheus Enterprise platform elements like VMs or Networks directly.

**LDAP:** Use LDAP Search Filter syntax to populate Option Lists.

**Manual:** Define Option List data with CSV or JSON.

**Plugin:** OptionSourceProvider classes within uploaded plugins supply data in name / value pairs.

The focus of this article is on REST web endpoints and an OptionSourceProvider Plugin.