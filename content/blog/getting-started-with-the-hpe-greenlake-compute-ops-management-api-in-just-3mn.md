---
title: Getting started with the HPE GreenLake Compute Ops Management API in just 3mn
date: 2023-01-04T09:57:13.816Z
author: Didier Lalli
authorimage: /img/didier-lalli.png
disable: false
tags:
  - hpe-greenlake-cloud-platform
  - hpe-greenlake-for-compute-ops-management
  - hpe-greenlake
---
<style>
ul li{
 font-size:25px;
}
</style>

<style>
table {
    display: block;
    width: max-content !important;
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
     font-weight: normal !important;
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

## Apply the power of a Developer Community

HPE GreenLake provides APIs for the different applications hosted on the HPE GreenLake Cloud Platform to do what can be done in the GUI through programmatic techniques. One of these applications is HPE GreenLake for Compute Ops Management (COM). HPE GreenLake for Compute Ops Management automates and transforms complex and time-consuming compute management operations into a simplified experience across edge-to-cloud. You can find its API documentation on the HPE GreenLake API portal at [developer.greenlake.hpe.com](http://developer.greenlake.hpe.com).

However, if you are time constrained and prefer to just poke around instead of browsing pages of documentation, this blog post is for you. One of the benefits of working within a community is the ability to take advantage of open collaboration, sharing hints, tools, and resources. In order to discover the API capabilities more rapidly, you can use a (free) tool such as Postman and leverage some of the Postman collections already created by members of the HPE Developer Community. If you are not yet familiar with Postman, no problem! We will provide you with step-by-step instructions.

> Note: You can follow these instructions with the Postman native application as well as the SaaS version of Postman. 

Ready? Let’s start the stopwatch, now!

![](/img/stopwatch1.jpg)

## Step 1 - \[optional] Get yourself a Postman account

If you don’t have a Postman account already, you can request a free one at: <https://identity.getpostman.com/signup>

## Step 2 - Log in to Postman

Log in to your Postman account and, from the search bar, look for the collection “Compute Ops Management”  and select from the list, the one from our Community contributor, Lionel Jullien’s (lio@hpe.com) public workspace. 

> Note: You can access it directly from [here](https://www.postman.com/jullienl/workspace/lionel-jullien-s-public-workspace/collection/991177-a2b4838f-3e9d-4047-b02f-f813b73a6724?ctx=documentation).

## Step 3 - Fork the existing HPE GreenLake Compute Ops management collection

You can fork Lionel’s COM collection into your Postman workspace, which is very similar to a GitHub fork operation. This will copy the content of the collection to your workspace, and maintain a link to the source, which would allow you to get updates (if Lionel does update his collection), or contribute to Lionel’s collection by opening a Pull Request (PR) if you have made changes to the collection. After you forked his collection, you can work on your own copy in your Postman workspace.

> Note: You can also export the collection and import it into your own workspace.

## Step 4 - Prepare your COM environment

The COM collection built by Lionel makes use of environment variables which can be grouped in a Postman environment. You will have to define and initialize these environment variables before using calls from the Postman collection. You can view Lionel’s Postman environment in his workspace, and either fork his environment or recreate it from scratch by creating a new environment in your workspace and setting up the following variables:

* ClientID
* SecretID
* url

> Note: Be careful, as Postman variables are case-sensitive. Also, you can set the type of variable ClientSecret to secret, so the value of the variable is only shown upon request.

## Step 5 - Set your COM environment

You now need to initialize the 3 environment variables that you created in your Postman workspace. In order to do this you need to use the HPE GreenLake Cloud Platform Graphical User Interface (GUI). Please refer to [this blog post](https://developer.hpe.com/blog/how-to-use-an-api-access-token-for-hpe-greenlake-for-compute-ops-management/) to create an API Access in your own HPE GreenLake for Compute Ops Management instance. You do not need to generate an access token from the GUI, as you will do it via the API in the next step.

From the GUI, make note of your Client ID, your Client Secret and the Connectivity Endpoint that corresponds to your region. Then, in your Postman environment, set a value to the 3 variables:

| Variable name | Initial Value              |
| ------------- | -------------------------- |
| ClientID      | Your client ID             |
| ClientSecret  | Your client Secret         |
| url           | Your Connectivity Endpoint |

> Note: Make sure that there isn’t any space or carriage return at the end of the variable values and to save your environment. 

## Step 6 - Obtaining a session token

Open your Postman workspace and locate the COM collection you have forked (or imported). Now, generate a session token using the **Create session** call from the **0_session** folder

> Note:  Before pressing Send, make sure that you have selected your environment in the upper right corner drop down. By default, it is set to **No Environment**.

Once the call returns, make sure you have a Status of 200 OK and check the JSON response body:

```json
{

"access_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IlRFak8tZEJPbThxUDlqRUlxdVE5aXVKX09HTSIsInBpLmF0bSI6ImRlejAifQ.eyJjbGllbnRfaWQiOiJmYWE5ZDZjMi04MjdjLTQzMWYtYTI2My1kNGE1YzY5YjYwZjIiLCJpc3MiOiJodHRwczovL3Nzby5jb21tb24uY2xvdWQuaHBlLmNvbSIsImF1ZCI6ImV4dGVybmFsX2FwaSIsInN1YiI6ImNvbS5kZW1vdXNlckBnbWFpbC5jb20iLCJ1c2VyX2N0eCI6ImIwMDQxNjk0NDM5MjExZWM5MWQ2YzZhZGQyMDZhMjQ3IiwiYXV0aF9zb3VyY2UiOiJjY3NfdG9rZW5fbWFuYWdlbWVudCIsInBsYXRmb3JtX2N1c3RvbWVyX2lkIjoiMzQ2NTJmZjAzMTc3MTFlYzliYzA5Njg3MjU4MGZkNmQiLCJpYXQiOjE2NzEwOTM2ODUsImFwcGxpY2F0aW9uX2luc3RhbmNlX2lkIjoiNjM3ZjA5MzgtMTg4Mi00NzNiLTkyNDQtNGNkMDFkMWExNjY4IiwiZXhwIjoxNjcxMTAwODg1fQ.ajV-eV98TrdZPtQAIynOW_9zrF0HaZo_g8eBdoxjHldEvXlxyomcpT3ElI_Ke2AZAGKDDQB9zihy0bfplSgnMg1yBoH7r2Ih4PJXm-lprFQZPF9dApDvv39sPu-VJZU2RijCGPp5fDqzbcF-37zbCzdhihdYsAnQE3VcGd8xKRTkH8JZVe3Rg22_ndzZOqTR3SAeVcFGuI3PN3r2mJ5GyxlT8ckt_QsUHrxtYPEVwZnOwRFtrT7JB-Ht3vJB8wJJwXdyIadr64gunV3UusMjxMzYk4RpvdMjRuANhhBUAHxdA3Mmnq3MXtnSLu_hPGz2MUzoXO9IPMI9Csq3q5G8Rg",
"token_type": "Bearer",
"expires_in": 7199
}
```

This token is known as a Bearer token and it is valid for 7200 seconds (120 minutes or 2 hours). It will expire after that period and will need to be regenerated by running a Create session call again if you have exceeded that time.

There is javascript code executed at the end of the call to automatically capture the value of the session token and store it in a new environment variable (called **COM_Token**) that is visible in your Postman environment. You can check this code in the Tests tab of the API call:

```js
const responseJson = pm.response.json();

// Set environment variables

pm.environment.set("COM_Token", responseJson.access_token);

// Display in console. To see the console, go to View / Show Postman Console

console.log("COM Token:", pm.environment.get("COM_Token")); 

// Display in Test Results

pm.test("COM session token = " + pm.environment.get("COM_Token"));
```

This code allows you to run any subsequent call from the collection using that saved token (until it expires).

## Step 7 - Collecting API versions

The COM API is an aggregation of multiple independent APIs. To help you find what the latest version of each component is, the collection provides a little “trick” in **2- Get the resource API versions from the API reference** from the **0_session** folder. Call this to populate API versions of each of the component, and before using any other calls from the collection:

![](/img/apicalls.png)

> Note: This is not using an API, but parsing the content of a documentation web page so it might be subject to changes in the future.

## Step 8 - Exploring the API

Now that you have a valid token and have identified the API endpoints, you are ready to explore the rest of the COM API using this handy collection. Pick one call from the **Servers** folder to **List of all ProLiant DL325 Gen10 Plus** and hit Send. You will get the following JSON response (provided you have some of these servers in your environment).

```json
{
    "offset": 0,
    "count": 1,
    "total": 1,
    "items": [
        {
            "id": "P18606-B21+CZJ11105MN",
            "type": "compute-ops/server",
            "platformFamily": "PROLIANT",
            "resourceUri": "/compute-ops/v1beta2/servers/P18606-B21+CZJ11105MN",
            "name": "Geneva-CIC-amd16",
            "createdAt": "2022-11-07T09:42:20.767907+00:00",
            "updatedAt": "2022-12-14T17:20:43.292718+00:00",
            "generation": 27,
            "hardware": {
                "serialNumber": "CZJ11105MN",
                "model": "ProLiant DL325 Gen10 Plus",
                "uuid": "36383150-3630-5A43-4A31-313130354D4E",
                "productId": "P18606-B21",
                "powerState": "ON",
                "indicatorLed": "LIT",
                "health": {
                    "summary": "OK",
                    "healthLED": "OK",
                    "fans": "OK",
                    "fanRedundancy": "REDUNDANT",
                    "liquidCooling": "NOT_PRESENT",
                    "liquidCoolingRedundancy": "NOT_PRESENT",
                    "memory": "OK",
                    "network": "OK",
                    "powerSupplies": "OK",
                    "powerSupplyRedundancy": "REDUNDANT",
                    "processor": "OK",
                    "storage": "OK",
                    "temperature": "OK",
                    "bios": "OK",
                    "smartStorage": "OK"
                },
                "bmc": {
                    "mac": "B4:7A:F1:B0:4C:44",
                    "ip": "10.4.25.209",
                    "hostname": "hdp-sto-amd16-ilo.hpintelco.org"
                }
            },
            "state": {
                "managed": true,
                "connected": true,
                "connectedModifiedAt": "2022-12-14T17:20:43.333272+00:00",
                "subscriptionState": "SUBSCRIBED",
                "subscriptionTier": "Enhanced",
                "subscriptionExpiresAt": "2027-04-21T17:55:00+00:00"
            },
            "firmwareInventory": [
                {
                    "name": "iLO 5",
                    "version": "2.70 May 16 2022",
                    "deviceContext": "System Board"
                },
                {
                    "name": "System ROM",
                    "version": "A43 v2.56 (02/10/2022)",
                    "deviceContext": "System Board"
                },
                {
                    "name": "Intelligent Platform Abstraction Data",
                    "version": "10.1.0 Build 37",
                    "deviceContext": "System Board"
                },
                {
                    "name": "System Programmable Logic Device",
                    "version": "0x11",
                    "deviceContext": "System Board"
                },
                {
                    "name": "Power Management Controller Firmware",
                    "version": "1.0.8",
                    "deviceContext": "System Board"
                },
                {
                    "name": "Power Supply Firmware",
                    "version": "1.00",
                    "deviceContext": "Bay 1"
                },
                {
                    "name": "Power Supply Firmware",
                    "version": "1.00",
                    "deviceContext": "Bay 2"
                },
                {
                    "name": "Redundant System ROM",
                    "version": "A43 v2.54 (12/03/2021)",
                    "deviceContext": "System Board"
                },
                {
                    "name": "Intelligent Provisioning",
                    "version": "3.52.37",
                    "deviceContext": "System Board"
                },
                {
                    "name": "Power Management Controller FW Bootloader",
                    "version": "1.1",
                    "deviceContext": "System Board"
                },
                {
                    "name": "HPE Smart Storage Energy Pack 1 Firmware",
                    "version": "0.70",
                    "deviceContext": "Embedded Device"
                },
                {
                    "name": "Mellanox Network Adapter - 88:E9:A4:02:8C:30",
                    "version": "16.32.10.10",
                    "deviceContext": "PCI-E Slot 1"
                },
                {
                    "name": "HPE SN1600Q 32Gb 2p FC HBA",
                    "version": "1.75.07",
                    "deviceContext": "PCI-E Slot 2"
                },
                {
                    "name": "HPE Smart Array P408i-a SR Gen10",
                    "version": "5.00",
                    "deviceContext": "Storage Slot 12"
                },
                {
                    "name": "10/25Gb 2-port SFP28 BCM57414 OCP3 Adapter",
                    "version": "219.0.144.0",
                    "deviceContext": "OCP 3.0 Slot 10"
                },
                {
                    "name": "Embedded Video Controller",
                    "version": "2.5",
                    "deviceContext": "Embedded Device"
                },
                {
                    "name": "480GB 6G SATA SSD",
                    "version": "HPG1",
                    "deviceContext": "Slot=12:Port=1I:Box=1:Bay=1"
                },
                {
                    "name": "480GB 6G SATA SSD",
                    "version": "HPG1",
                    "deviceContext": "Slot=12:Port=1I:Box=1:Bay=2"
                }
            ],
            "softwareInventory": \[],
            "lastFirmwareUpdate": null,
            "host": {
                "osName": "None",
                "osVersion": "None",
                "hostname": "Geneva-CIC-amd16",
                "osType": null,
                "osDescription": "None"
            },
            "firmwareBundleUri": null,
            "tags": {},
            "biosFamily": "A43",
            "processorVendor": "AMD EPYC 7352 24-Core Processor                ",
            "autoIloFwUpdate": true,
            "serverGeneration": "GEN_10
        }
    ]
}
```

That’s it. No more than 3 minutes!

![](/img/stopwatch2.jpg)

If you have more time, feel free to explore the rest of the collection on your own. Also, don’t hesitate to provide Lionel with feedback on his very convenient collection.

Any questions on HPE GreenLake for Compute Ops Management? Please join the HPE Developer Slack Workspace (<https://slack.hpedev.io/>) and start a discussion in our [\#hpe-greenlake-compute-ops-management ](https://hpedev.slack.com/archives/C03QTQWC213)channel.