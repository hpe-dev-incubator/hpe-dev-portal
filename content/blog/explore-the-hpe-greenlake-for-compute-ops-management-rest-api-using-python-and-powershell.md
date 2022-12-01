---
title: Explore the HPE GreenLake for Compute Ops Management REST API using
  Python and PowerShell
date: 2022-12-01T12:28:58.682Z
author: Vincent Berger & Frederic Passeron
authorimage: /img/vb-fp192.png
disable: false
---
HPE GreenLake for Compute Ops Management automates and transforms complex and time-consuming compute management operations into a simplified experience across edge-to-cloud. Whether you are an IT OPS or a DEV OPS engineer, you know that automation is the key to success. And today’s automation relies heavily on APIs and how one can interact easily with them. So, let us show you how to leverage the API provided so you, too, can take advantage of what HPE GreenLake for Compute Ops Management can provide.

![figure1](/img/greenlake-com-ops-api-curl1.png)

**HPE GreenLake for Compute Ops Management REST API**

HPE GreenLake for Compute Ops Management provides a Restful API to customers who want to manage their devices programmatically or through a command line interface. The API enables customers to invoke operations or tasks such as list devices, see device details, device health, manage a device's firmware and much more.

To learn more about HPE GreenLake for Compute Ops Management API methods and resources, you can refer to [the API reference documentation](https://developer.greenlake.hpe.com/docs/greenlake/services/compute-ops/public/openapi/compute-ops-latest/overview/).

Here are some of the operations you can do with the HPE GreenLake for Compute Ops Management API:

* Obtain the list of servers in your account 
* Obtain the list of firmware bundles
* Obtain the list of job templates
* Perform a firmware update
* Run a carbon emissions report
* Power on/off/restart a server



![figure2](/img/greenlake-com-ops-api-pyt-pow9.png)

I﻿n a previous [blog](https://developer.hpe.com/blog/explore-the-hpe-greenlake-for-compute-ops-management-rest-api-using-curl-and-postman), we covered some of basics of this API using cURL or Postman. We would like to share with you today a few examples of REST API calls that can be made through simple Python and PowerShell codes examples

The HPE GreenLake for Compute Ops Management REST API uses the OAuth 2.0 HPE GreenLake authentication flow, where a limited lifetime access token is provided in the header of each REST API request as the authorization bearer. The process to generate this necessary access token is well described in the blog post written by **Nisha Thomas**, entitled [How to use an API access token for HPE GreenLake for Compute Ops Management](https://developer.hpe.com/blog/how-to-use-an-api-access-token-for-hpe-greenlake-for-compute-ops-management/). If you are not familiar with this token generation and usage,  we would strongly advise you to read it as it represents the very first and important steps to be performed prior to getting the chief benefits described above.

* Sign up for an HPE Account 
* Connect to HPE GreenLake
* Create API Client Credentials 
* Generate an Access Token based on your credentials and relevant connectivity endpoint (HPE GreenLake for Compute Ops Management in our case) 

Once the access token is generated, it can be used to make API calls to perform any HTTP method against the desired HPE GreenLake for Compute Ops Management resource. To do this, you simply add the access token to the HTTP header with the keyword "Authorization: Bearer {token}". The name “Bearer authentication” can be understood as “give access to the bearer of this token”.

There are several ways to invoke the API:

* Using REST directly or from JavaScript 
* Using cURL
* Using Python
* Using Go
* Using PowerShell
* Using Ansible, Terraform, etc.

The [HPE GreenLake for Compute Ops Management API Reference site](https://developer.greenlake.hpe.com/docs/greenlake/services/compute-ops/public/openapi/compute-ops-latest/overview/) leverages an OpenAPI conformant documentation that provides a complete explanation of the operations supported by the Unique Resource Identifiers [(URIs)](<>)as well as sample requests and responses.