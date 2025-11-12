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

![](/img/0installjdk.png "Install and test java")

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

![](/img/3unzip_plugin_project.png "Extract code project")

## Authoring plugin projects in an IDE

Adding logic and complexity to a working plugin is an exercise in object-oriented programming. Writing code in plain text editors can be tedious, time-consuming, and error prone. To make development easier, we use an IDE such as Visual Studio Code.

Although we use Visual Studio Code in this example, several more powerful Java/Groovy IDEs are available, including IntelliJ IDEA, Eclipse, and NetBeans.

1. Open **Visual Studio Code** and select **Open Folder** from the **File** menu.

![](/img/4vsc_open_folder.png "VS Code Open Folder")

2. Respond **Yes** to the trust prompt. If this is the first project opened of its type, VS Code will prompt for the installation of java related extension packs. Respond by clicking **Install**.
3. The extension pack will take a while to install and build/configure the project. This can be seen at the bottom left of the VS Code window.

![](/img/61configuring.png "Extension pack setup")

Wait for the **Gradle: configuration** message to disappear and the **Java: Ready** message to remain.

![](/img/62configured.png "Project build")

4. Open the **Explorer** view by clicking the corresponding icon at the top left. The **Welcome** and any open **Extension** tabs can now be closed.

![](/img/7explorer_view.png "Open explorer view")

## Important project files

We will explore some of the most important files briefly. In different article, we will cover the project structure and the build files in more detail.

* **gradlew.bat**\
  OS shell wrapper script used for compiling the plugin on Windows.
* **gradlew**\
  OS shell wrapper script used for compiling on Linux.
* **gradle.properties**\
  Variables used in the in the gradle build. Typically version numbers.
* **build.gradle**\
  This is the actual build script. Build dependencies are declared here. This configures how the .jar file is built.
* **PluginDemoPlugin.groovy**\
  i.The main plugin entry point class that Morpheus will load.\
  ii. Extends **com.morpheusdata.core.Plugin**\
  iii. Specified in the build.gradle file as the **Plugin-Class**\
  iv. Registers **provider** classes that add functionality to the plugin
* **PluginDemoGenericProvider**\
  A provider class that add generic functionality. Many types of providers can be added to plugins.
* **pluginDemoShow.hbs**\
  Handlebars markup to display UI elements in the Morpheus web UI.