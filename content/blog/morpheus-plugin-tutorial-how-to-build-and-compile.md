---
title: "Morpheus plugin tutorial: How to build and compile"
date: 2025-11-05T11:51:19.345Z
author: Neil van Rensburg
authorimage: /img/greenlogo.png
disable: false
---
# Introduction

This article deals with generating and compiling a basic Morpheus plugin project on Windows 11.

Topics covered in this article:

* How to generate a new project using the plugin code generator
* Unzip and open the project in an IDE
* Explore main plugin file components
* Compile the plugin on Windows
* Upload the compiled plugin to Morpheus
* Compile the plugin remotely on Linux, using Visual Studio Code
* Compile the plugin using docker

# JDK Prerequisite

For the labs in this document, we assume a **Windows 11 host** with internet access and **Visual Studio Code** installed.

You’ll also need to have **Java JDK 11 or 17** installed. The vendor distribution of Java is not important — both OpenJDK and Oracle JDK are supported.

When using JDK 17, the project’s compile **compatibility level is set to version 1.11** to maintain compatibility with earlier environments.

1. Open a Windows command prompt (Press Win + R or click Start, type cmd, press enter)
2. To install OpenJDK 17, run the following command and click yes to provide administrative privileges where needed:

   ```
   winget install ojdkbuild.openjdk.17.jdk
   ```
3. To verify your OpenJDK install, run:

   ```
   java -version
   ```

   ![](/img/0.-install-jdk.png "Install and verify OpenJDK 17 on Windows 11")
4.