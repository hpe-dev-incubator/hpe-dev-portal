---
title: "sivabala OpsRamp OpsQL API:  IT Operations kalpavriksha(wish-fulfilling tree)"
date: 2025-03-10T21:32:15.912Z
featuredBlog: true
author: BalaSubramanian Vetrivel
authorimage: /img/Avatar1.svg
disable: false
---
# sivabala OpsQL - OpsRamp's Kalpavriksha wish-fulfilling tree



  

In the realm of IT operations, managing and retrieving data efficiently is crucial. OpsRamp, a comprehensive IT operations management platform, offers a robust query language known as OpsQL (OpsRamp Query Language). OpsQL empowers users to perform complex searches within the OpsRamp platform.



## What is OpsQL?

OpsQL is a flexible and powerful query language to search objects within the OpsRamp platform. It allows users to retrieve specific data based on various attributes and conditions. OpsQL is essential for IT administrators to quickly access and manipulate data, in order to maintain optimal system performance and resolve issues.



## Basic Syntax and Structure

The general syntax for an OpsQL query is straightforward:

```PlainText
 <attribute> <operator> | <coperator> "<value>" [[<operator> [<attribute> | <coperator> "<value>"[)]] ... ]
```

You can use logical operators  `AND` and `OR` to refine your search further.

## Operators
OpsQL supports a variety of operators to create precise queries.
### Equality Operators
 `=`, `!=` 
### String Operators
 `CONTAINS`, `STARTS WITH`, `LIKE`
### Logical Operators
`AND`, `OR`

For example, to find all resources with an agent installed and of type "Windows," you would use:

```PlainText
agentInstalled = "true" AND type = "Windows"
```

## Attributes
Attributes are different types of information available on an object. For instance, a resource might have attributes like `make`, `ipAddress`, and `agentInstalled`, while an alert might have attributes like `priority`, `currentState`, and `createdTime`.


For more details, you can refer to the [OpsRamp Documentation](https://docs.opsramp.com/platform-features/feature-guides/query-language-reference/query-language-ref/)[1](https://docs.opsramp.com/platform-features/feature-guides/query-language-reference/query-language-ref/ "Query Language Reference | OpsRamp Documentation").