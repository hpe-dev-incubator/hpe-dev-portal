---
title: "Simplivity"
version: v 6.01.8964
description:
image: 
frontpage: false
priority: 2
tags: ["hpe-simplivity"]
---
Getting started
===============

You can develop REST API clients in a variety of languages, including Python, Windows PowerShell, Java, and others. Before starting to create a REST API client, it is important to understand the following basic client workflow:

1 - Identify the user credentials that you plan to use to authenticate to an HPE OmniStack host.

2 - Authenticate to the HPE OmniStack host to generate an access token.

3 - Store the access token for use in all REST API request headers.

4 - Issue a GET request to get a set of instances of an object type, based on the filtering and sorting criteria that you specify.

5 - Issue a POST request or other operation to perform an action that affects this instance.

6 - Poll the returned task instance to monitor the status of the operation.
