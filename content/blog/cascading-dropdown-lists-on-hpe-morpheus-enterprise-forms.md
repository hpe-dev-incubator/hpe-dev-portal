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

The focus of this article is on REST Web endpoints and an OptionSourceProvider Plugin. Replace the URL hostname in your lab appropriately then create 3 Options lists that reflect the values below:

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

Verify that the 3 option lists reflect the below:

![](/img/option_lists.png)

## Create the Form Inputs

Navigate to **Library > Options > Inputs**. Click **Add**. Create 3 Form Inputs that correspond to the Option Lists above, with the following values:

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
Navigate to **Library > Automation > Workflows**. Click **Add > Operational Workflow**. Provide **Test Inputs** as the **Name** and add **Country**, **State** and **City** to the type-ahead **Inputs** field:

![](/img/new_workflow.png)

Under **Library > Automation > Workflows**, click the name of the **Test Inputs** workflow. Click the **EXECUTE** button. Check that all 3 drop-downs contain data from the JSON Server endpoints:

![](/img/execute_workflow.png)

## Filtering Data

When filtering, it is important to understand that Option Lists are populated through an inherent **results** object. This **results** construct consists of a list of **name** and **value** pairs.

By default, the Option List is assigned the corresponding **name** and **value** JSON fields within the JSON list. Consider the current country JSON data:

```
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

This issue with the above list is that the **value** key is missing, represented by an **id** property instead. This causes the HTML drop-down **option** tags to have null values:

![](/img/dropdown_html_before.png)

Navigate to **Library** > **Options** > **Options Lists** and edit the previously created **Countries** Option List using the corresponding pencil icon on the right:

![](/img/edit_optionslist_countries.png)

Populating the **Translation Script** text box using the below code, causes the **results** object to be populated by javascript logic instead:

```
for (var x = 0; x < data.length; x++) {
  results.push({"name": data[x].name,"value": data[x].id})
}
```

The above code loops through each entry in the **data** JSON list using a javascript for loop. For each entry, a **name** and **value** object is pushed onto the **results** list. This ensures that the **value** attribute is available on the **input** map for future filtering. 

Inspecting the HTML element on the HPE Morpheus Enterprise UI page, reveals that the drop-down control is now correctly populated.

At the moment, the state drop-down contains all states in the data source, regardless of which country is selected. Similarly, cities also remain unfiltered, regardless of the selected country and state.

This section will look at the 2 available mechanisms for filtering Option List data based on the values of other Form Inputs, **Translation Scripts** and **Request Scripts**.

### Filter the state by country, using a Translation Script

Navigate to **Library** > **Options** > **Options Lists** and edit the previously created **States** Option List using the corresponding pencil icon on the right:

![](/img/edit_optionslist.png)

 Add the following code to the **Translation Script** field and click Save Changes:

```
for (var i = 0; i < data.length; i++) {
  if (data[i].countryId == input.country) {
 	 results.push({"name": data[i].name, "value": data[i].id})  
  }
}
```

![](/img/translation_script_code.png)

As before, we loop through the **data** set and push entries onto the **results** list. The difference is the conditional statement where the selected value of the **country** Form Input must match the **countryId** of the list entry.