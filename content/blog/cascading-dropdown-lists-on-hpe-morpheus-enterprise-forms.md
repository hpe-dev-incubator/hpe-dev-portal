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

HPE Morpheus Enterprise allows for the customization of form elements across instance provisioning, workflows, and service catalog items, providing greater flexibility and control. Drop-down lists can be populated using various types of option sources.

This article focuses on demonstrating cascading (interdependent) drop-down lists using both REST-based and plugin-based option sources.

## Demo environment

The demo environment consists of a ***JSON Server*** VM and an ***HPE Morpheus Enterprise*** appliance. This lab works on any HPE Morpheus Enterprise 7.x or 8.x appliance. The development environment assumes plugin compile capability as described in the article [A Beginner’s Guide to Building and Compiling HPE Morpheus Enterprise Plugins](https://developer.hpe.com/blog/morpheus-plugin-tutorial-how-to-build-and-compile/).

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

In this way, the endpoint* **http://demojsonserver/countries*** provides the 3 countries in the* **locations.json*** file:

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

The focus of this article is on ***REST Web*** endpoints and an ***OptionSourceProvider Plugin***. Replace the URL hostname in your lab with the appropriate hostname or IP address of the ***JSON Server*** then create 3 Options Lists that reflect the values below:

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

Verify that the 3 Option Lists reflect the below:

![](/img/option_lists.png)

## Create the Form Inputs

Navigate to ***Library > Options > Inputs***. Click ***Add***. Create 3 Form Inputs that correspond to the Option Lists above, with the following values:

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

## Testing Inputs

A simple way to test Form Inputs in HPE Morpheus Enterprise is to create an Operational Workflow. These workflows can use Form Inputs as Workflow Inputs.
Navigate to ***Library > Automation > Workflows***. Click ***Add* > *Operational Workflow***. Provide ***Test Inputs*** as the ***Name*** and add ***Country***, ***State*** and ***City*** to the type-ahead ***Inputs*** field:

![](/img/new_workflow.png)

Under ***Library* > *Automation* > *Workflows***, click the name of the ***Test Inputs*** workflow. Click the ***EXECUTE*** button. Check that all 3 drop-downs contain data from the JSON Server endpoints:

![](/img/execute_workflow.png)

## Filtering Data

When filtering, it is important to understand that Option Lists are populated through an inherent ***results*** object. This ***results*** construct consists of a list of ***name*** and ***value*** pairs.

By default, the Option List is assigned the corresponding ***name*** and ***value*** JSON fields within the JSON list. Consider the current country JSON data:


```json
[
  {
    "id": "1",
    "name": "United States"<br/>
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

Populating the ***Translation Script*** text box using the below code, causes the ***results*** object to be populated by ***javascript logic*** instead of default behavior:

```js
for (var x = 0; x < data.length; x++) {
  results.push({"name": data[x].name,"value": data[x].id})
}
```

The above code loops through each entry in the ***data*** JSON list using a javascript for loop. For each entry, a ***name*** and ***value*** object is pushed onto the ***results*** list. This ensures that the ***value*** attribute is available on the ***input*** map for future ***filtering*** or for use within ***automation tasks***. 

Add the code to the ***Translation Script*** text box and click ***SAVE CHANGES***:

![](/img/translation_script_code_basic.png)

Navigate back to ***Library > Automation > Workflows*** and click on the name of the ***Test Inputs*** workflow. Click the ***EXECUTE*** button. Inspecting the ***country*** drop-down HTML element on the web UI page, reveals that the drop-down control is now correctly populated with country id values.

![](/img/dropdown_html_after.png)

If the values are still showing up as null, you may need to refresh the browser page.

At the moment, the ***state*** drop-down contains all states in the data source, regardless of which ***country*** is selected. Similarly, ***cities*** also remain unfiltered, regardless of the selected ***country*** and ***state***.

This section will look at the 2 available mechanisms for filtering Option List data based on the values of other Form Inputs, ***Translation Scripts*** and ***Request Scripts***.

### Filter the state by country, using a Translation Script

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

As before, the script loops through the ***data*** set and pushes entries onto the ***results*** list. The difference is the conditional if statement, where the selected value of the ***country*** Form Input must match the ***countryId*** of the JSON list entry, before it is added:

![](/img/country_id.png)

To trigger the refresh of the ***STATE*** drop-down field, navigate to ***Library > Options > Inputs*** and edit the ***State*** Input. Set the value of the ***DEPENDENT FIELD*** to **country**. Click ***SAVE CHANGES***:

![](/img/dependent_on_country.png)

Navigate back to ***Library > Automation > Workflows*** and open the workflow execution dialog for the ***Test Inputs*** workflow again. This time, ***states*** are filtered by the selected ***country*** value:

![](/img/filtered_states.png)

### Filter the city by state, using a Request Script

Some REST web endpoints support filtering by URL parameters. For example, to filter ***cities*** by a ***state*** id of 3, the URL would look like this:

`http://demojsonserver/cities?stateId=3`

Here is the GET request result:

![](/img/cities_filtered_by_url.png)

To implement URL request parameter filtering on the ***cities*** Option Source, navigate to ***Library > Options > Options Lists*** and edit the ***Cities*** Option Source. Populate the* **REQUEST SCRIPT*** text box with the below code:

`results.push({ name: 'stateId', value: data.state || "NoState" });`

![](/img/request_script.png)

This line of code effectively sets the ***stateId*** request parameter to the value of the ***state*** Form Input, or to "NoState" if no state is selected. The reason for this is that a blank **stateId** request parameter value causes JSON Server to remove the filter entirely, thus showing all entries, instead of no entries.

To trigger the refresh of ***cities*** upon the selection of a ***state***, navigate to ***Library > Options > Inputs*** and edit the **State** input using the pencil icon on the right. Set the value of the ***DEPENDENT FIELD*** to **state**. Click ***SAVE CHANGES***:

![](/img/dependent_on_state.png)

The selection of ***city***, is now based on ***state***, which is based on the selected ***country***. Navigate back to ***Library > Automation > Workflows*** and open the workflow execution dialog for the ***Test Inputs*** workflow again. This time, ***cities*** are filtered by the selected ***state*** value:

![](/img/country_state_city.png)

## Explore, compile and upload the Option Source Plugin

Download or clone the plugin repository from <https://github.com/neilvrhpe/OptionSourceDemo>. 

Open the project directory using a simple IDE like Visual Studio code, or even a text editor tool. Exxpand the ***src > main > groovy > com > hpe > morpheus > demo*** directory. View the ***OptionsSourceDemoPlugin.groovy*** class file:

![](/img/plugin_class.png)

This file is the HPE Morpheus Enterprise appliance's entry point into the plugin. ***HPE Morpheus Enterprise plugins*** always register one or more ***provider classes***. The ***provider classes*** supply the plugin functionality. The method call on line 30, ***this.registerProvider***, registers the ***OptionSourceProvider***, which will provide a list of zip codes to the ***ZipCodes Option List*** in the next section.

View the ***DemoOptionSourceProvider.groovy*** class file:

![](/img/provider_class.png)

This class extends ***AbstractOptionSourceProvider***, which enables the plugin to provide a list of ***name*** and ***value*** pairs for an Option List through a collection of methods. The methods are made available to the platform via the ***getMethodNames*** method (line 21). In this example there is only one method called ***listZipCodes*** which is defined on line 45. It returns static **name** and **value** pairs, although the plugin provides flexibility on how the list is built. Data can easlity be retrieved from other systems via SDKs, APIs or database connections.

For more information pertaining to the anatomy of HPE Moprpheus Enterprise Plugins, please refer to the article [A Beginner’s Guide to Building and Compiling HPE Morpheus Enterprise Plugins](https://developer.hpe.com/blog/morpheus-plugin-tutorial-how-to-build-and-compile/).

Open the project directory in a commandline terminal and compile the plugin with the relevant ***gradlew***(Linux) or ***gradlew.bat***(Windows) script using the ***shadowJar*** argument:

![](/img/compile_plugin.png)

The compiled ***.jar*** file will be found in the ***build/libs*** subdirectory:

![](/img/jar_file.png)

Upload the ***.jar*** file to the ***Administration > Integrations > Plugins > Add*** dialog. The Plugin should appear in the list as shown below:

![](/img/uploaded_plugin.png)

Edit the uploaded plugin using the pencil icon to confirm that the ***Option Source Provider*** is present:

![](/img/plugin_provider.png)

## Add the Zip Code Option List and Input

At the moment, only the name of the city is added to the ***City*** drop-down. This is due to the missing ***value*** property, as seen earlier with ***country*** and ***state***. 

Add the following code snippet to the ***cities*** Option List ***TRANSLATION SCRIPT*** field by navigating to **Library** > **Options** > **Options Lists** and clicking the corresponding pencil icon on the right:

```
for (var x = 0; x < data.length; x++) {
  results.push({"name": data[x].name,"value": data[x].name})
}
```

![](/img/cities_translation_script.png)

The above code sets the ***name*** property of a city, to both the ***name*** and ***value*** of the city drop-down entry. You can verify this by opening the execution dialog of the ***Test Inputs*** workflow. Inspecting the HTML once a **city** is selected confirms this:

![](/img/cities_dropdown_html.png)

The ***listZipCodes*** method returns ***name*** and ***value*** pairs with the ***city name*** and the* **zip code value***. As the Request Script will match using the ***city name***, the value of the drop-down has to be the ***city name*** (not the city ***id***).

Navigate to ***Library > Options > Option*** ***Lists*** and click ***Add***. Supply the field values as shown below:

- - -

|                  |                                  |
| ---------------- | -------------------------------- |
| **NAME:**        | ZipCodes                         |
| **TYPE:**        | Plugin                           |
| **OPTION LIST:** | Option Source Demo: listZipCodes |

\
**TRANSLATION SCRIPT:**

```
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

This post only explores HPE Morpheus Enterprise Inputs and Option lists and Option Source Provider Plugins. Under ***Library > Options > Forms***, you can find more advanced Forms as collections of inputs.

At the more advanced end of the spectrum are other Plugin Provider Types that model core infrastructure components. These include integrations for Clouds, Networks, Storage systems, and many others. Such Providers tend to be more complex because they interact deeply with HPE Morpheus Enterprise’s provisioning, synchronization, and lifecycle management layers. Understanding how these Provider Types fit together is key to building powerful, production-grade Plugins.

Explore the following resources for more information on the different Plugin/Provider types:

[https://developer.morpheusdata.com](https://developer.morpheusdata.com/)

[https://share.morpheusdata.com](https://share.morpheusdata.com/) (follow the repository link under the Plugin details to see the source code of a Plugin)

<https://github.com/hewlettpackard> 

<https://youtu.be/1twoNvPoEV4?si=elUEzCYGo88TIffX>