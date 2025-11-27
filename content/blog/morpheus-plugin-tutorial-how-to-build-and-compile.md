---
title: A Beginner’s Guide to Building and Compiling HPE Morpheus Enterprise Plugins
date: 2025-11-19T08:43:36.028Z
author: Neil van Rensburg
authorimage: /img/greenlogo.png
disable: false
---
## Introduction

HPE Morpheus Enterprise is a hybrid cloud platform that unifies diverse products and technologies into a consistent workload-lifecycle orchestration, governance, and control framework.

This makes HPE Morpheus Enterprise ideally positioned to integrate with a broad ecosystem of cloud-related service vendors. These integrations are enabled through technology-specific plugin providers. HPE Morpheus Enterprise is extendable with custom plugins for clouds, task types, UI tabs, reports, approvals, cypher, IPAM, backups and more.

This article covers the process of generating and compiling a basic HPE Morpheus Enterprise generic plugin project on Windows 11. To understand how the workflow fits together, this blog will cover:

* Generating a new project using the plugin code generator
* Unzipping and opening the project in an IDE
* Exploring main plugin file components
* Compiling the plugin on Windows
* Uploading the compiled plugin to HPE Morpheus Enterprise
* Compiling the plugin remotely on Linux, using Visual Studio Code
* Compiling the plugin using Docker

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

Another build dependency is the **Gradle build system**. This will automatically be provided by the **Gradle wrapper configuration** under the **gradle directory** of the project we will generate.

## Creating a plugin project

Creating a project that compiles code into usable plugins can be a daunting task, especially for developers who are not familiar with Java, Groovy, or Gradle.

To simplify this process and make it easier for potential plugin builders to get started, the HPE Morpheus Enterprise engineering team created the **Morpheus Plugin Code Generator**.

We’ll use this handy tool as a starting point to create our new plugin project.
The preferred source language for HPE Morpheus Enterprise plugins is **Groovy**.

Groovy features a concise, flexible syntax and includes many helper methods that make coding easier. It’s fully interoperable with Java and compiles to the same JVM bytecode.

1. Using a web browser, navigate to [developer.morpheusdata.com](https://developer.morpheusdata.com/). Click the **Get Started Now** button.

![](/img/1developer_getting_started_button.png "Launch plugin code generator")

2. For this lab, we provide the following field values:

   * **Name**: Plugin Demo
   * **Code**: pluginDemo
   * **Providers**: Generic Integration

![](/img/2developer_generate_plugin.png "Generate plugin project")

3. Unzip the plugin project for use in an IDE. For this example, we will unzip the plugin to the Windows Documents folder.

![](/img/3unzip_plugin_project.png "Extract code project")

## Authoring plugin projects in an IDE

Adding logic and complexity to a working plugin is an exercise in object-oriented programming. Writing code in plain text editors can be tedious, time-consuming, and error prone. To make development easier, we use an IDE such as Visual Studio Code.

Although we use Visual Studio Code in this example, several more powerful Java/Groovy IDEs are available, including IntelliJ IDEA, Eclipse, and NetBeans.

1. Open **Visual Studio Code** and select **Open Folder** from the **File** menu.

![](/img/4vsc_open_folder.png "VS Code Open Folder")

2. Respond **Yes** to the trust prompt. If this is the first project opened of its type, VS Code will prompt for the installation of java related extension packs. Respond by clicking **Install**.

![](/img/5trust_and_install_extensions.png)

3. The extension pack will take a while to install and build/configure the project. This can be seen at the bottom left of the VS Code window.

![](/img/61configuring.png "Extension pack setup")

Wait for the **Gradle: configure project** message to disappear and the **Java: Ready** message to remain.

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
  i.The main plugin entry point class that HPE Morpheus Enterprise will load.\
  ii. Extends **com.morpheusdata.core.Plugin**\
  iii. Specified in the build.gradle file as the **Plugin-Class**\
  iv. Registers **provider** classes that add functionality to the plugin
* **PluginDemoGenericProvider**\
  A provider class that add generic functionality. Many types of providers can be added to plugins.
* **pluginDemoShow.hbs**\
  Handlebars markup to display UI elements in the HPE Morpheus Enterprise web UI.

## Compiling locally on Windows

As a first compile option, we will look at the local Windows environment.

1. Start by opening a terminal. You may need to click the ellipses to exposes the entire menu.

![](/img/81terminal.png "Open terminal")

2. Run the Windows wrapper batch script command:

   ```
   .\gradlew.bat clean build
   ```

   The **shadowJar** parameter can be used instead **build**.

![](/img/8gradlew_bat.png "Build/compile command")

3. Find the generated **.jar** file that was generated on successful build under the **build > libs** directory. Use the **.jar** file suffixed with **\-all**. This file contains all compilation dependencies and is therefore safer to upload into HPE Morpheus Enterprise.

![](/img/9.-jar-file.png "Browse to the jar file")

4. Upload the plugin to the UI by navigating to **Administration > Integrations > Plugins > Add**. Drag the file onto the dialog or browse to the .jar file and click Upload.

![](/img/10.-upload-jar.png "Upload jar file to the UI")

A successful upload will add the plugin name to the list:

![](/img/11.-uploaded.png "Uploaded plugin into list")

To view the registered providers of an uploaded plugin, click the edit pencil to view the dialog.

![](/img/12.-plugin-providers.png "View plugin details")

## Compiling the plugin on Linux

Another compile option is to connect to a **remote Linux** machine using an **SSH** session from **Visual Studio Code.** As a prerequisite for this, unzip the initial project to your Linux machine and ensure remote SSH connectivity. The **Java JDK v17** will need to be present in this environment as well.

1. Click the **Open Remote Window** at the bottom left of the Visual Studio Code window. In the top popup option box, choose **Connect to Host**.

![](/img/13.-connect-to-host.png "Connect to remote host")

2. Choose **'+' Add New SSH Host** and enter your **user@host** combo. Choose any SSH configuration file on the system to save connection details to.

![](/img/13.-specify-host.png "Provide user host pair")

3. Click the **Open Remote Window** at the bottom left of the Visual Studio Code window **again**. Choose **Connect to Host again**. This time, **select the host** that was entered and saved in the previous step.

![](/img/13choose_host.png "Choose host connection")

4. Satisfy any possible certificate security prompts and enter your password when prompted. A new Visual Studio Code window will be opened. As with the previous exercise, **Open Folder** from the main **File menu**.

![](/img/13open_folder.png "Open remote folder")

5. Select your **Plugin Demo** folder and click **OK**. You will be prompted to supply the password again. As before, allow for the installation of the required Java Extension packs and wait for the **Gradle: configure project** message to disappear.

![](/img/61configuring.png "Configuring project")

The **Java: Ready** status message should remain in the bottom status bar.

![](/img/62configured.png "Project configured")

6. From the top main menu, choose **terminal > New Terminal**.

![](/img/14open-terminal.png "Open new terminal")

7. Ensure that the gradle **wrapper script** is **executable** by running the following:

   ```
   chmod +x ./gradlew
   ```
8. This time, we run the **gradlew** script, **instead of gradlew.bat**.

   ```
   ./gradlew clean build
   ```

![](/img/15linux_compile.png "Compile using gradlew")

## Compiling using Docker

To avoid the need for a dedicated local development environment or specific JDK installations, you can compile the plugin inside a **Docker container**. Using the official Gradle image, the build process runs in an isolated environment that already includes the correct JDK version and Gradle tooling. This ensures consistent results across different systems and eliminates dependency issues. 

The prerequisite to this is a **working Docker installation**.

```
sudo docker run --rm \
  -u "$(id -u):$(id -g)" \
  -v "$PWD":/home/gradle/project \
  -v gradle-cache:/home/gradle/.gradle \
  -w /home/gradle/project \
  gradle:8.10.2-jdk17 \
  bash -lc "chmod +x ./gradlew && ./gradlew clean build"
```

## Next steps

From here, we can explore the **mechanics of the interfaces** exposed by the HPE Morpheus Enterprise Plugin Core. These interfaces are organized into various **provider types**, each defining a specific kind of integration point within HPE Morpheus Enterprise.

In essence, a *provider type* represents a particular extension area in the platform — such as a **custom tab**, **analytics page**, **dashboard widget**, or c**ustom report**. These allow developers to inject new functionality directly into the UI or automation workflows.

At the more advanced end of the spectrum are provider types that model **core infrastructure components**. These include integrations for **clouds**, **networks**, **storage systems**, and many others. Such providers tend to be more complex because they interact deeply with HPE Morpheus Enterprise’s provisioning, synchronization, and lifecycle management layers. Understanding how these provider types fit together is key to building powerful, production-grade plugins.

Explore the following resources for more information on the different plugin/provider types:

* https://developer.morpheusdata.com
* https://share.morpheusdata.com (follow the repository link under the plugin details to see the source code of a plugin)
* https://github.com/hewlettpackard
* https://youtu.be/1twoNvPoEV4?si=elUEzCYGo88TIffX