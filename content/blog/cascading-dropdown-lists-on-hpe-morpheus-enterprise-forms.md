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

The demo environment for this consist of a JSON Server VM and an HPE Morpheus Enterprise appliance. The development environment assumes plugin compile capability as described in the article [A Beginner’s Guide to Building and Compiling HPE Morpheus Enterprise Plugins](https://developer.hpe.com/blog/morpheus-plugin-tutorial-how-to-build-and-compile/).