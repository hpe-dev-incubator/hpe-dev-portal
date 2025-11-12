---
title: "Morpheus plugin tutorial: How to build and compile"
date: 2025-11-19T08:43:36.028Z
author: Neil van Rensburg
authorimage: /img/greenlogo.png
disable: false
---
## Introduction

This article deals with generating and compiling a basic Morpheus plugin project on Windows 11.

Topics covered in this article:

* How to generate a new project using the plugin code generator
* Unzip and open the project in an IDE
* Explore main plugin file components
* Compile the plugin on Windows
* Upload the compiled plugin to Morpheus
* Compile the plugin remotely on Linux, using Visual Studio Code
* Compile the plugin using docker

## JDK Prerequisite

For the labs in this document, we assume a **Windows 11 host** with internet access and **Visual Studio Code** installed.

You’ll also need to have **Java JDK 11 or 17** installed. The vendor distribution of Java is not important — both OpenJDK and Oracle JDK are supported.

When using JDK 17, the project’s compile **compatibility level is set to version 1.11** to maintain compatibility with earlier environments.

1. Open a Windows command prompt (Press Win + R or click Start, type cmd, press enter)
2. To install OpenJDK 17, run the following command and click yes to provide administrative privileges where needed:

   ```
   winget install jdkbuild.openjdk.17.jdk
   ```

   To verify your OpenJDK install, run:

   ```
   java -version
   ```

![](/img/0installjdk.png)

## Creating a plugin project

Creating a project that compiles code into usable plugins can be a daunting task, especially for developers who are not familiar with Java, Groovy, or Gradle.

To simplify this process and make it easier for potential plugin builders to get started, the Morpheus engineering team created the **Morpheus Plugin Code Generator**.

We’ll use this handy tool as a starting point to create our new plugin project.
The preferred source language for Morpheus plugins is **Groovy**.

Groovy features a concise, flexible syntax and includes many helper methods that make coding easier. It’s fully interoperable with Java and compiles to the same JVM bytecode.

1. Using a web browser, navigate to [developer.morpheusdata.com](https://developer.morpheusdata.com/). Click the **Get Started Now** button.

![](/img/1developer_getting_started_button.png "Launch plugin code generator")

2. For this lab, we provide the following field values:\
   **Name**: Plugin Demo\
   **Code**: pluginDemo\
   **Providers**: Generic Integration

![](/img/2developer_generate_plugin.png "Generate plugin project")

3. Unzip the plugin project for use in an IDE. For this example, we will unzip the plugin to the Windows Documents folder.

![](/img/3unzip_plugin_project.png)