---
title: Using HPE OneSphere Python Module
date: 2018-01-26T00:32:52.749Z
author: Peng.Liu@hpe.com 
tags: ["Python","HPE-OneSphere","API","GettingStarted","REST"]
path: using-hpe-onesphere-python-module
---
## Summary
In previous articles, [Getting Started With OneSphere Programming](https://developer.hpe.com/blog/getting-started-with-hpe-onesphere-programming) and [Authenticating against HPE OneSphere API](https://developer.hpe.com/blog/Authenticating-against-HPE-OneSphere-API), we discovered the [HPE OneSphere](https://www.hpe.com/us/en/solutions/cloud/hybrid-it-management.html) REST API, and most of this was done using a handy tool called Postman. In this article we will see that you can also use Python to access the HPE OneSphere API using the HPE OneSphere Python module. 

## Why Python?
"Python is an interpreted high-level programming language for general-purpose programming. Created by Guido van Rossum and first released in 1991, Python has a design philosophy that emphasizes code readability, and a syntax that allows programmers to express concepts in fewer lines of code, notably using significant whitespace. It provides constructs that enable clear programming on both small and large scales. Python features a dynamic type system and automatic memory management. It supports multiple programming paradigms, including object-oriented, imperative, functional and procedural, and has a large and comprehensive standard library.
Python interpreters are available for many operating systems." [Wikipedia](https://en.wikipedia.org/wiki/Python_(programming_language)) 

## Cmdlets and Modules
Programmers can either call Python commands in a Python interpreter environment (available on both Windows and Linux) or import the module in a Python script.

## Get the HPE OneSphere Python Module
The easiest way is to get the module from Github and then follow the instructions in README.

### Clone it from Github
The source code for the HPE OneSphere Python module is actually provided on [HPE Github](https://github.com/HewlettPackard/hpe-onesphere-python). So a very simple option is to *git clone* the repository (if you are familiar with the Git toolset) to get a local copy of the module.

### Both Python 2 and Python 3
The Python modules are placed in the folder onesphere. There are two Python files in it. The osbinding2.py is for Python 2.7.x and above. The osbinding3.py is for Python 3.5.2 and above.

## Use the Python Module in Command Line
First, start the Python interpreter.

````Python
$ python
````
or run python3 to start the Python 3 interpreter.

````Python
$ python3
````
Then next step is to import the modules.

````Python
>>> import json
>>> import onesphere.osbinding2 as osb
````
Or the following for Python 3:

````Python
>>> import json
>>> import onesphere.osbinding3 as osb
````
The next step is to create an instance of the OSClient class (OneSphere Client).

````Python
>>> osinst = osb.OSClient('onesphere-host-url', 'username', 'password')
````
> onesphere-host-url: in the format of https://host-name.domain.com

> username: the user name for the HPE OneSphere environment

> password: the password of the user for the HPE OneSphere environment

The last step is to understand the set of APIs in the modules and then starting calling the methods off the instance (osinst). All the methods return values in JSON format. You can use json.dump to convert that into string.

````Python
obj = osinst.GetRoles()
str = json.dump(obj)
````

## Use the Python Module in Python Code

The following is code sample of using the module in Python code.

````Python
# sample.py

import json

# for Python 2 (2.7.x and above), import the onesphere.osbinding2
# for Python 3 (3.5.2 and above), import the onesphere.osbinding3
import onesphere.osbinding3 as osb

def run():

    osinst = osb.OSClient('https://onesphere-host-url', 'username', 'password')

    print("GetStatus: " + json.dumps(osinst.GetStatus()))
    print("GetConnectApp: " + json.dumps(osinst.GetConnectApp("windows")))
    print("GetSession: " + json.dumps(osinst.GetSession()))
    print("GetAccount: " + json.dumps(osinst.GetAccount()))
    print("GetProviderTypes: " + json.dumps(osinst.GetProviderTypes()))
    print("GetZoneTypes: " + json.dumps(osinst.GetZoneTypes()))
    print("GetServiceTypes: " + json.dumps(osinst.GetServiceTypes()))
    print("GetRoles: " + json.dumps(osinst.GetRoles()))
    print("GetUsers: " + json.dumps(osinst.GetUsers()))
    print("GetTagKeys: " + json.dumps(osinst.GetTagKeys()))
    print("GetTags: " + json.dumps(osinst.GetTags()))

    del osinst


if __name__ == '__main__':
    run()
````

Then you can run the Python code:

````Python
$ python3 sample.py
````
Or for Python 2:

````Python
$ python sample.py
````

## Next Step?
There are many ways to consume an API such as HPE OneSphere. Python is one option. The others include PowerShell, Javascript, and GO.
