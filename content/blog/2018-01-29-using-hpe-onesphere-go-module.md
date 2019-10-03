---
title: Using HPE OneSphere Go Module
date: 2018-01-29T19:20:07.681Z
author: Peng.Liu@hpe.com 
tags: ["GO","Golang","HPE-OneSphere","API","GettingStarted","REST"]
path: using-hpe-onesphere-go-module
---
## Summary
In previous articles, [Getting Started With OneSphere Programming](https://developer.hpe.com/blog/getting-started-with-hpe-onesphere-programming) and [Authenticating against HPE OneSphere API](https://developer.hpe.com/blog/Authenticating-against-HPE-OneSphere-API), we discovered the [HPE OneSphere](https://www.hpe.com/us/en/solutions/cloud/hybrid-it-management.html) REST API, and most of this was done using a handy tool called Postman. In this article we will see that you can also use Go to access the HPE OneSphere API using the HPE OneSphere Go module. 

## Go
"Go (often referred to as golang) is a programming language created at Google in 2009 by Robert Griesemer, Rob Pike, and Ken Thompson. It is a compiled, statically typed language in the tradition of Algol and C, with garbage collection, limited structural typing, memory safety features and CSP-style concurrent programming features added." [Wikipedia](https://en.wikipedia.org/wiki/Go_(programming_language)) 

"Go will be the server language of the future." - Tobias Lütke, Shopify

## Modules
Programmers can import the HPE OneSphere Go module in a Go script.

## Get the HPE OneSphere Go Module
The easiest way is to get the module from Github and then follow the instructions in README.

### Clone it from Github
The source code for the HPE OneSphere Go module is actually provided on [HPE Github](https://github.com/HewlettPackard/hpe-onesphere-go). So a very simple option is to *git clone* the repository (if you are familiar with the Git toolset) to get a local copy of the module.

### Version
The supported version of the Go module is go1.9.2.

## Use the Go Module in Go Code

Assuming that the folder structure is this:
````
your project foler
     |-- onesphere
          |-- osbinding.go
     |-- sample.go
````

The following is code sample using the module in Go code.
````Go
package main

import (
    osbinding "./onesphere"
    "fmt"
)

func main() {
    osbinding.Connect("https://onesphere-host-url", "username", "password")
    fmt.Println("Token:", osbinding.Token)

    fmt.Println("Status:", osbinding.GetStatus())
    fmt.Println("Session:", osbinding.GetSession("full"))
    fmt.Println("Account:", osbinding.GetAccount("full"))
    fmt.Println("ProviderTypes:", osbinding.GetProviderTypes())
    fmt.Println("ZoneTypes:", osbinding.GetZoneTypes())
    fmt.Println("ServiceTypes:", osbinding.GetServiceTypes())
    fmt.Println("Roles:", osbinding.GetRoles())
    fmt.Println("Users:", osbinding.GetUsers())
    fmt.Println("TagKeys:", osbinding.GetTagKeys("full"))
    fmt.Println("Tags:", osbinding.GetTags("full"))
}
````

Then you can run the Go code:
````Go
$ go run sample.go
````

## Next Step?
There are many ways to consume an API such as HPE OneSphere. Go is one option. The others include PowerShell, Javascript, and Python.
