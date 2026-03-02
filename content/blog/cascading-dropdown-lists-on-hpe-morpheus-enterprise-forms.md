---
title: Cascading dropdown lists on HPE Morpheus Enterprise forms
date: 2026-02-11T11:16:09.248Z
author: Neil van Rensburg
authorimage: /img/greenlogo.png
disable: false
tags:
  - Morpheus
  - API
  - Plugin
  - OptionList
  - Forms
  - OptionSource
---
## Introduction

Authors frequently need to capture additional information during the provisioning of workloads and services. This information is typically collected through user interface controls such as drop-down lists, often populated dynamically from external systems. Downstream, these selections are consumed by automation workflows that tailor deployments and integrate with ancillary systems such as CMDBs, IPAM platforms, or other operational tooling.

HPE Morpheus Enterprise provides extensive flexibility for customizing form elements across instance provisioning, workflows, and service catalog items. Drop-down Option Lists can be populated using a variety of Option Source types, including REST-based endpoints and plugin-backed integrations.

However, in real-world environments, form inputs are rarely independent. The selection made in one field often determines the valid values in another.

This is where cascading (interdependent) drop-down lists become essential.

By dynamically filtering or populating one field based on the selection of another, cascading drop-downs introduce context awareness into provisioning forms. This reduces user error, improves data integrity, and ensures that deployments align with environmental constraints and governance requirements.

This article demonstrates how to implement cascading drop-down lists in Morpheus using both REST-based and plugin-based option sources.

## HPE Morpheus terms explained

Some of the terminology used in this article may be misleading or confusing due to its ubiquitous use across a wide range of products and technology domains, including ITSM, virtualization platforms, and service orchestration systems. This section explains the common terms used for HPE Morpheus Enterprise concepts throughout the article:

**Option List**
A list of name and value pairs used to populate multi-select UI controls like drop-downs, radio lists and type-ahead boxes. In the HPE Morpheus Enterprise UI, Option Lists are defined under ***Library > Options > Option Lists***.

**Option Source**
Raw data supplied to Option List controls. The Option Source type can be static data in JSON or CSV, REST response data, LDAP query results, HPE Morpheus Enterprise API data, or Option Source plugins. Option sources are defined as part of creating Option Lists.

**Input**
A web UI control used in an HPE Morpheus Enterprise wizard. A wizard usually has several of controls, like when provisining a VM Instance. Input types are checkbox, hidden value, number, password, radio list, select list, text, text area or type ahead. Inputs are defined under ***Library > Options > Inputs***

A select list input is populated by a corresponding Option List. This article will work exclusively with select list Inputs.



## Demo environment

To illustrate how to reference external data sources on form inputs, and then make them interdependent on HPE Morpheus Enterprise forms, this article makes use of 2 demo lab VMs. These include a ***JSON Server*** VM and an ***HPE Morpheus Enterprise*** appliance. This lab works on any HPE Morpheus Enterprise 7.x or 8.x appliance. 

To demonstrate how a plugin can supply the data via custom integration, a development environment assumes plugin compile capability as described in the article [A Beginner’s Guide to Building and Compiling HPE Morpheus Enterprise Plugins](https://developer.hpe.com/blog/morpheus-plugin-tutorial-how-to-build-and-compile/).

For the purposes of this article, the ***JSON Server*** was setup on a clean Debian 12 install, on the same network segment as the ***HPE Morpheus Enterprise*** appliance. Data for the ***JSON Server*** web endpoint below is supplied by a ***locations.json*** file. The content for this file can be found [here](https://github.com/neilvrhpe/OptionSourceDemo/blob/main/locations.json). 

***JSON Server*** ***v1.0.0*** was setup using the following commands:

`apt update`

`apt install nodejs npm -y` 

`npm install json-server` 

`vi locations.json` 

`npx json-server --host 0.0.0.0 --port 80 locations.json`

(Bear in mind that minimal Debian doesn't install with the ***sudo*** command by default. Prepend ***sudo*** to administrative commands where appropriate on your OS distribution)

In this demo, the ***JSON Server*** web endpoint responds on ***http://demojsonserver*** and renders this:

![](/img/jsonserver_home.png)

The 3 sub-pages: ***/countries***, ***/states*** and ***/cities*** reflect the base objects in the ***locations.json*** file:

![](/img/locations_json.png)

As you can see, the endpoint* **http://demojsonserver/countries*** provides the 3 countries in the* **locations.json*** file:

![](/img/locations_json.png)

## Creating the Option Lists

To create the ***Option Lists*** in ***HPE Morpheus Enterprise***, navigate to ***Library > Options > Options Lists***. Click ***Add***. The following dialog will be displayed:

![](/img/add_optionlist.png)

Consider the selection options for the ***Type*** field that controls where Option List data is sourced from.

**REST:** Web endpoint requests.

**Morpheus Api:** HPE Morpheus Enterprise platform elements like VMs or Networks directly.

**LDAP:** Use LDAP Search Filter syntax to populate Option Lists.

**Manual:** Define Option List data with CSV or JSON.

**Plugin:** OptionSourceProvider classes within uploaded plugins supply data in name / value pairs.

In this article, I am focusing on the ***REST Web*** endpoints and an ***OptionSourceProvider Plugin***. For you to obtain proper results, replace the URL hostname with the appropriate hostname or IP address of the ***JSON Server*** and then create 3 Options Lists that reflect the values below:

- - -

|                    |                                 |
| ------------------ | ------------------------------- |
| **NAME:**          | Countries                       |
| **TYPE:**          | REST                            |
| **SOURCE URL:**    | http://demojsonserver/countries |
| **SOURCE METHOD:** | GET                             |
| **REAL TIME:**     | Checked                         |

- - -

|                    |                              |
| ------------------ | ---------------------------- |
| **NAME:**          | States                       |
| **TYPE:**          | REST                         |
| **SOURCE URL:**    | http://demojsonserver/states |
| **SOURCE METHOD:** | GET                          |
| **REAL TIME:**     | Checked                      |

- - -

|                    |                              |
| ------------------ | ---------------------------- |
| **NAME:**          | Cities                       |
| **TYPE:**          | REST                         |
| **SOURCE URL:**    | http://demojsonserver/cities |
| **SOURCE METHOD:** | GET                          |
| **REAL TIME:**     | Checked                      |

Verify that the three Option Lists reflect the below:

![](/img/option_lists.png)

## Create the Form Inputs

To create the Form Inputs, navigate to ***Library > Options > Inputs***. Click ***Add***. Create 3 Form Inputs that correspond to the Option Lists above, with the following values:

- - -

|                  |             |
| ---------------- | ----------- |
| **NAME:**        | Country     |
| **FIELD NAME:**  | country     |
| **TYPE:**        | Select List |
| **LABEL:**       | Country     |
| **OPTION LIST:** | Countries   |

- - -

|                  |             |
| ---------------- | ----------- |
| **NAME:**        | State       |
| **FIELD NAME:**  | state       |
| **TYPE:**        | Select List |
| **LABEL:**       | State       |
| **OPTION LIST:** | States      |

- - -

|                  |             |
| ---------------- | ----------- |
| **NAME:**        | City        |
| **FIELD NAME:**  | city        |
| **TYPE:**        | Select List |
| **LABEL:**       | City        |
| **OPTION LIST:** | Cities      |

Inputs should be created as shown below:

![](/img/inputs.png)

## How to test Option List Inputs

A simple way to test Form Inputs in HPE Morpheus Enterprise is to create an Operational Workflow. These workflows can use Form Inputs as Workflow Inputs.
Navigate to ***Library > Automation > Workflows***. Click ***Add* > *Operational Workflow***. Provide ***Test Inputs*** as the ***Name*** and add ***Country***, ***State*** and ***City*** to the type-ahead ***Inputs*** field:

![](/img/new_workflow.png)

Under ***Library* > *Automation* > *Workflows***, click the name of the ***Test Inputs*** workflow. Click the ***EXECUTE*** button. Check that all three drop-downs contain data from the JSON Server endpoints:

![](/img/execute_workflow.png)

## Filtering data

When filtering, it is important to understand that Option Lists are populated through an inherent ***results*** object. This ***results*** construct consists of a list of ***name*** and ***value*** pairs.

By default, the Option List is assigned the corresponding ***name*** and ***value*** JSON fields within the JSON list. Consider the current country JSON data:

```json
[
  {
    "id": "1",
    "name": "United States"
  },
  {
    "id": "2",
    "name": "Canada"
  },
  {
    "id": "3",
    "name": "Australia"
  }
]
```

This issue with the above list is that the ***value*** key is missing, represented by an ***id*** property instead. This causes the HTML drop-down ***option*** tags to have ***null*** values:

![](/img/dropdown_html_before.png)

Navigate to ***Library*** > ***Options*** > ***Options Lists*** and edit the previously created ***Countries*** Option List using the corresponding pencil icon on the right:

![](/img/edit_optionslist_countries.png)

Populating the ***Translation Script*** text box using the below code causes the ***results*** object to be populated by ***javascript logic*** instead of reverting to the default behavior of ***name*** and ***value*** JSON keys:

```js
for (var x = 0; x < data.length; x++) {
  results.push({"name": data[x].name,"value": data[x].id})
}
```

The above code loops through each entry in the ***data*** JSON list using a javascript for-loop. For each entry, a ***name*** and ***value*** object is pushed onto the ***results*** list. This ensures that the ***value*** attribute is available on the ***input*** map for future ***filtering*** or for use within ***automation tasks***. 

To use ***id*** as the ***value*** key, add the above code to the ***Translation Script*** text box and click ***SAVE CHANGES***:

![](/img/translation_script_code_basic.png)

Navigate back to ***Library > Automation > Workflows*** and click on the name of the ***Test Inputs*** workflow. Click the ***EXECUTE*** button. Inspecting the ***country*** drop-down HTML element on the web UI page reveals that the drop-down control is now correctly populated with country id values.

![](/img/dropdown_html_after.png)

If the values are still showing up as null, you may need to refresh the browser page.

At the moment, the ***state*** drop-down contains all states in the data source, regardless of which ***country*** is selected. Similarly, ***cities*** also remain unfiltered, regardless of the selected ***country*** and ***state***.

This section will look at the two available mechanisms for filtering Option List data based on the values of other Form Inputs, ***Translation Scripts*** and ***Request Scripts***.

### Filter the state by country using a translation script

Navigate to ***Library > Options > Options Lists*** and edit the previously created ***States*** Option List using the corresponding pencil icon on the right:

![](/img/edit_optionslist.png)

Add the following code to the ***TRANSLATION SCRIPT*** field and click ***SAVE CHANGES***:

```js
for (var i = 0; i < data.length; i++) {
  if (data[i].countryId == input.country) {
 	 results.push({"name": data[i].name, "value": data[i].id})  
  }
}
```

![](/img/translation_script_code.png)

As before, the script loops through the ***data*** set and pushes entries onto the ***results*** list. The difference is the conditional if statement. The selected value of the ***country*** Form Input must match the ***countryId*** of the JSON list entry before it can be added to the ***results*** list:

![](/img/country_id.png)

To trigger the refresh of the ***state*** drop-down field, navigate to ***Library > Options > Inputs*** and edit the ***State*** Input. Set the value of the ***DEPENDENT FIELD*** input to **country**. Click ***SAVE CHANGES***:

![](/img/dependent_on_country.png)

Navigate back to ***Library > Automation > Workflows*** and open the workflow execution dialog for the ***Test Inputs*** workflow again. This time, ***states*** are filtered by the selected ***country*** value:

![](/img/filtered_states.png)

### Filter the city by state using a request script

Some REST web endpoints support filtering by URL parameters. For example, to filter ***cities*** by a ***state*** id of 3, the URL would look like this:

`http://demojsonserver/cities?stateId=3`

Here is the GET request result:

![](/img/cities_filtered_by_url.png)

To implement URL request parameter filtering on the ***cities*** Option Source, navigate to ***Library > Options > Options Lists*** and edit the ***Cities*** Option Source. Populate the* **REQUEST SCRIPT*** text box with the below code:

```js
results.push({ name: 'stateId', value: data.state || "NoState" });
```

![](/img/request_script.png)

This line of code effectively sets the ***stateId*** request parameter to the value of the ***state*** Form Input, or to "NoState" if no state is selected. The reason for this is that a blank **stateId** request parameter value causes JSON Server to remove the filter entirely, thus showing all entries, instead of no entries.

To trigger the refresh of ***cities*** upon the selection of a ***state***, navigate to ***Library > Options > Inputs*** and edit the **State** input using the pencil icon on the right. Set the value of the ***DEPENDENT FIELD*** to **state**. Click ***SAVE CHANGES***:

![](/img/dependent_on_state.png)

The selection of ***city*** is now based on ***state***, which is based on the selected ***country***. Navigate back to ***Library > Automation > Workflows*** and open the workflow execution dialog for the ***Test Inputs*** workflow again. This time, ***cities*** are filtered by the selected ***state*** value:

![](/img/country_state_city.png)

## Explore, compile, and upload the Option Source plugin

Download or clone the plugin repository from <https://github.com/neilvrhpe/OptionSourceDemo>. 

Open the project directory using a simple IDE, like Visual Studio code, or even a text editor tool. Expand the ***src > main > groovy > com > hpe > morpheus > demo*** directory. View the ***OptionsSourceDemoPlugin.groovy*** class file:

![](/img/plugin_class.png)

This file is the HPE Morpheus Enterprise appliance's entry point into the plugin. ***HPE Morpheus Enterprise plugins*** always register one or more ***provider classes***. The ***provider classes*** supply the plugin functionality. The method call on line 30, ***this.registerProvider***, registers the ***OptionSourceProvider***, which will provide a list of zip codes to the ***ZipCodes Option List*** in the next section.

View the ***DemoOptionSourceProvider.groovy*** class file:

![](/img/provider_class.png)

This class extends ***AbstractOptionSourceProvider***, which enables the plugin to provide a list of ***name*** and ***value*** pairs for an Option List through a collection of methods. The methods are made available to the platform via the ***getMethodNames*** method (line 21). In this example, there is only one method called ***listZipCodes***, which is defined on line 45. It returns static **name** and **value** pairs, although the plugin provides flexibility on how the list is built. Data can easily be retrieved from other systems via SDKs, APIs, or database connections.

For more information pertaining to the anatomy of HPE Morpheus Enterprise Plugins, please refer to the article [A Beginner’s Guide to Building and Compiling HPE Morpheus Enterprise Plugins](https://developer.hpe.com/blog/morpheus-plugin-tutorial-how-to-build-and-compile/).

Open the project directory in a command line terminal and compile the plugin with the relevant ***gradlew***(Linux) or ***gradlew.bat***(Windows) script using the ***shadowJar*** argument:

![](/img/compile_plugin.png)

The compiled ***.jar*** file will be found in the ***build/libs*** subdirectory:

![](/img/jar_file.png)

Upload the ***.jar*** file to the ***Administration > Integrations > Plugins > Add*** dialog. The plugin should appear in the list as shown below:

![](/img/uploaded_plugin.png)

Edit the uploaded plugin using the pencil icon to confirm that the ***Option Source Provider*** is present:

![](/img/plugin_provider.png)

## Add the zip code Option List and Input

At the moment, only the name of the city is added to the ***City*** drop-down. This is due to the missing ***value*** property, as seen earlier with ***country*** and ***state***. 

Add the following code snippet to the ***cities*** Option List ***TRANSLATION SCRIPT*** field by navigating to **Library** > **Options** > **Options Lists** and clicking the corresponding pencil icon on the right:

```js
for (var x = 0; x < data.length; x++) {
  results.push({"name": data[x].name,"value": data[x].name})
}
```

![](/img/cities_translation_script.png)

The above code sets the ***name*** property of a city to both the ***name*** and ***value*** of the city drop-down entry. You can verify this by opening the execution dialog of the ***Test Inputs*** workflow. Inspecting the HTML once a **city** is selected confirms this:

![](/img/cities_dropdown_html.png)

The ***listZipCodes*** method returns ***name*** and ***value*** pairs with the ***city name*** and the* **zip code value***. As the Request Script will match using the ***city name***, the value of the drop-down has to be the ***city name*** (not the city ***id***).

Navigate to ***Library > Options > Option*** ***Lists*** and click ***Add***. Supply the field values as shown below:

- - -

|                  |                                  |
| ---------------- | -------------------------------- |
| **NAME:**        | ZipCodes                         |
| **TYPE:**        | Plugin                           |
| **OPTION LIST:** | Option Source Demo: listZipCodes |

**TRANSLATION SCRIPT:**

```js
for (var i = 0; i < data.length; i++) {
  if (data[i].name == input.city) {
 	 results.push({"name": data[i].value, "value": data[i].value})  
  }
}
```

- - -

The above populates the ***ZipCodes*** Option List with the ***zip code*** as both the ***name*** and ***value*** (the drop-down ***label*** and ***value***). Click ***SAVE CHANGES***

![](/img/zipcodes_option_list.png)

Navigate to ***Library > Options > Inputs*** and click ***Add***. Use the below field values:

- - -

|                       |             |
| --------------------- | ----------- |
| **NAME:**             | ZipCode     |
| **FIELD NAME:**       | zipCode     |
| **DEPENDENT FIELD:**  | city        |
| **VISIBILITY FIELD:** | city        |
| **TYPE:**             | Select List |
| **LABEL:**            | Zip Code    |
| **OPTION LIST:**      | ZipCodes    |

- - -

![](/img/zipcodes_input.png)

Navigate to ***Library > Automation > Workflows***, click the name of the ***Test Inputs*** workflow andf click ***EXECUTE***. The ***Zip Code drop-down*** now appears in the workflow execution dialog, once the **city** is selected:

![](/img/zipcode_dropdown.png)

Set the corresponding ***VISIBILITY FIELD*** values on the other inputs to make the visibility of each subsequent drop-down depend on the one before. ***State to country***, and ***city to state***.

## Summary

This post only explores HPE Morpheus Enterprise Inputs and Option lists and Option Source Provider Plugins. Under ***Library > Options > Forms***, you can find more advanced Forms as collections of inputs. These form controls enrich functionality on UI forms and enable the customization of the inputs for workloads and services.

At the more advanced end of the spectrum are other Plugin Provider Types that model core infrastructure components. These include integrations for Clouds, Networks, Storage systems, and many others. Such Providers tend to be more complex because they interact deeply with HPE Morpheus Enterprise’s provisioning, synchronization, and lifecycle management layers. Understanding how these Provider Types fit together is key to building powerful, production-grade Plugins.

Explore the following resources for more information on the different Plugin/Provider types:

[https://developer.morpheusdata.com](https://developer.morpheusdata.com/)

[https://share.morpheusdata.com](https://share.morpheusdata.com/) (follow the repository link under the Plugin details to see the source code of a Plugin)

<https://github.com/hewlettpackard> 

<https://youtu.be/1twoNvPoEV4?si=elUEzCYGo88TIffX>