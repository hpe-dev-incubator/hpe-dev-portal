---
title: "OpsRamp OpsQL API: Fulfilling wishes for IT Ops management"
date: 2025-03-10T21:32:15.912Z
featuredBlog: true
author: BalaSubramanian Vetrivel
authorimage: /img/balasubramanian-photo-2.png
thumbnailimage: https://www.google.com/imgres?q=opsramp&imgurl=https%3A%2F%2Fwww.opsramp.com%2Fwp-content%2Fthemes%2Ffas-base%2Ffreemium%2Fassets%2Fbrand%2FOpsRamp_Logo_Gray_Blue_RGB.svg&imgrefurl=https%3A%2F%2Fwww.opsramp.com%2F&docid=zXQkTLrgWW4LtM&tbnid=LjasiVSx9A0jAM&vet=12ahUKEwjVvYfK2ICMAxV89DgGHQ9-OQoQM3oECB0QAA..i&w=800&h=239&hcb=2&ved=2ahUKEwjVvYfK2ICMAxV89DgGHQ9-OQoQM3oECB0QAA
disable: false
tags:
  - OpsRamp
  - hpe-opsramp
  - OpsQL
  - OpsRamp API
---
<style>
li {
   font-size: 27px;
   line-height: 33px;
   max-width: none;
}
</style>

In today's data centers, IT Ops managers face mounting challenges in managing and retrieving data efficiently. They've introduced so many network, storage, and computing devices into their environment that they have become unmanageable. At times performance issues and critical services going down keep happening and they're left with headaches, higher costs, and poor performance. If only they had a Kalpavriksha, a magical wish-fulfilling tree that could answer their needs for quickly searching for any resource from their complex, wide data centre to make all their dreams come true.

With OpsRamp, a comprehensive IT operations management platform, they may very well get their wish. With its OpsRamp Query Language (OpsQL) and its powerful API, users can perform complex searches within the OpsRamp platform. It allows users to retrieve specific data based on various attributes and conditions. To quickly access and manipulate data in order to maintain optimal system performance and resolve issues, OpsQL is a Kalpavriksha that truly grants wishes. In this blog post, I will explain the basics of OpsQL and how to use it.

## What is OpsQL?
OpsQL is a flexible and powerful query language to search objects within the OpsRamp platform. It allows users to retrieve specific data based on various attributes and conditions. OpsQL is essential for IT administrators to quickly access and manipulate data, in order to maintain optimal system performance and resolve issues. IT Ops Managers, users can run OpsQL in intuitive OpsRamp UI or using OpsQL API.

## Basic syntax and structure
Let's say you want to make a query. The general syntax for an OpsQL query is very straightforward:

```PlainText
 <attribute> <operator> | <coperator> "<value>" [[<operator> [<attribute> | <coperator> "<value>"[)]] ... ]
```

You can use logical operators  `AND` and `OR` to refine your search further.

## Operators
Operator is the key of the query. It relates the attribute to the value. 
OpsQL supports a variety of operators to create precise queries.
 1.  **Equality operators**
 `=`, `!=` 
 2.  **String operators**
 `CONTAINS`, `STARTS WITH`, `LIKE`
 3.  **Logical operators**
`AND`, `OR`

For example, to find all resources with an agent installed and of type "Windows," you would use:

```PlainText
agentInstalled = "true" AND type = "Windows"
```

## Attributes
Attributes are different types of information available on an object. For instance, a resource might have attributes like `make`, `ipAddress`, and `agentInstalled`, while an alert might have attributes like `priority`, `currentState`, and `createdTime`.

For more details, you can refer to the [OpsRamp Query Language Reference Documentation.](https://docs.opsramp.com/platform-features/feature-guides/query-language-reference/query-language-ref/)

## More examples
Here are some OpsQL examples to search resources on the OpsRamp platform.

### Search for resources that were discovered by an AWS integration​
```PlainText
installedAppName = aws
```
### Search for resources that I tagged in AWS with AWS tag OwnerName :SivaBalaSubramanian
```PlainText
installedAppName = "aws" AND tags.name = "OwnerName" and tags.value = "SivaBalaSubramanian"​
```
### Search for resources with alerts that have been open for the last 2 hours​
```PlainText
createdTime > "-7200sec" ​
createdTime > "-120min"​
```
### Search for open alerts that are critical​
```PlainText
currentState = "CRITICAL" AND status = "OPEN" ​
```
### Search for open and critical alerts that have an open incident​
```PlainText
currentState = "CRITICAL" AND status = "OPEN" AND incidentId IS NOT NULL ​
```
### Search for alerts that have been Open for longer than 2 hours​
```PlainText
createdTime < "-7200sec" ​
``` 
### Search for Open and critical alerts on resources tagged with AWS tag “BU: bu-123”​
```PlainText
currentState = "CRITICAL" AND status = "OPEN" AND resource.tags.name = "Team" AND resource.tags.value = "Opsqa"​
```

## What is OpsQL API?
The OpsQL API is a powerful interface that allows users to execute OpsQL queries programmatically. This API provides the flexibility to filter, search data within the OpsRamp platform, making it an indispensable tool for IT administrators and developers.
IT Administrators can invoke OpsQL API using tools such as Postman, cURL, Python.
 


#### Key features
1.  **Comprehensive querying**: The OpsQL API supports a wide range of query operations, allowing users to filter data based on various attributes and conditions.
2.  **Flexibility**: Users can create complex queries using logical operators and a variety of comparison operators.
3.  **Integration**: The API can be integrated into custom applications, scripts, and workflows, enhancing automation and efficiency.


#### Basic syntax and structure
The general structure of an OpsQL API request involves specifying the tenant ID and the query payload. 

Here’s a basic example:

```
POST /opsql/api/v3/tenants/{tenantId}/queries
```

The request body typically includes:
*    `objectType`: The type of object to query (e.g., resource, alert, ticket).
*    `fields`: The fields to retrieve.
*    `filterCriteria`: The criteria to filter the objects.

## Common use cases and code samples
### Filtering critical alerts
There are times that you would want to filter only critical alerts. This is how that would be done:


```python
import requests
import json
accessToken='valid access token'


url = "https://server/opsql/api/v3/tenants/client_id/queries"

payload = json.dumps({
  "objectType": "alert",
  "fields": [
    "id",
    "clientId",
    "component",
    "currentState"
  ],
  "filterCriteria": "currentState=critical"
})
headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': accessToken
}

response = requests.request("POST", url, headers = headers, data = payload)
```
### Saving OpsQL response as CSV file 
There are times that you would want to save an OpsQL response as a CSV file, perhaps for further analysis. This is how that would be done:



```python
def invoke_opsql() -> None:
  response = requests.request("POST", url, headers = headers, data = payload)
  timestr = time.strftime("%Y%m%d-%H%M%S")
  json_file_name = "siva_aws_resources-" + timestr + ".json"
  csv_file_name = "siva_aws_resources-" + timestr + ".csv"

  with open(json_file_name, "wb") as file:
      file.write(response.content)

  json_to_csv(json_file_name, csv_file_name)

def json_to_csv(resources_json, file_csv) -> None :
        with open(resources_json) as json_file:
            data = json.load(json_file)

        opsql_response = data['results']
        data_file = open(file_csv, 'w')
        csv_writer = csv.writer(data_file)
        count = 0

        for opsql_row in opsql_response:
            if count == 0:
                header = opsql_row.keys()
                csv_writer.writerow(header)
                count += 1

            csv_writer.writerow(opsql_row.values())

        data_file.close()

```
## Conclusion
The OpsQL API is a powerful tool that enhances the capabilities of the OpsRamp platform, providing users with the flexibility to perform complex queries and manage data efficiently. By leveraging the OpsQL API, IT administrators and developers can streamline their operations, improve data management, and enhance overall productivity. Thus OpsQL grants the wishes of IT Ops Managers with a single pane of glass and unified searching capability across their wide, complex real estate.
For more details, you can refer to the [OpsQL API Documentation](https://develop.opsramp.com/v3/api/opsql/tenantid-queries/)