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

# **HPE GreenLake for Compute Ops Management REST API**

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

# Using PowerShell

From a Terminal application, I start a PowerShell environment and set some variables that will be used later. 

```
# Store our Compute Ops Manager API endpoint
$endpoint = "https://us-west2-api.compute.cloud.hpe.com"
# Initialize an empty headers array
$headers = @{} 	
# Add a header for authorization, using the Access Token generated in task 2	
$headers["Authorization"] = "Bearer_access_token_here"
```

![figure3](/img/greenlake-com-ops-api-pyt-pow1.png)

Our first request:

```
$response = Invoke-webrequest "$endpoint/compute-ops/v1beta2/servers?limit=2" -Method GET -Headers $headers
```

When the request is successful, the response should display 200:

![figure4](/img/greenlake-com-ops-api-pyt-pow2.png)

```
$response.StatusCode
```

The JSON data returned by the request is in $response.Content but it is rather hard to read as is, I can prettify it a bit with: 

```
$response.Content | ConvertFrom-Json | Format-List
```

Now, the request returned 2 objects (count : 2) and the actual server details are in the items array property.

![figure5](/img/greenlake-com-ops-api-pyt-pow3.png)

The API supports several query parameters depending on the resource type, such as filter, limit (maximum number of records to return), offset (resource offset to start the response from) and sort (order in which to return the resources in the collection).

Filters provide the ability to limit the resources that take part in the action of a REST call. When a REST call includes a filter, the GET or DELETE action is restricted to a response that meets the filter requirements. Filters are specified by using the query parameter 'filter'.

A simple example of filtering follows:

**GET <URI>?filter=powerState eq 'Off'**

This example shows a simple filter. The resources returned by the query are limited to results with the attribute powerState and the value Off. 

To use a filter on a nested property name, the '/' separator can be specified as follows:

**GET /compute-ops/v1beta2/servers?filter=hardware/model eq 'ProLiant DL365 Gen10 Plus'**

To test this filter, I run  the following command: 

```
$response = Invoke-webrequest "$endpoint/compute-ops/v1beta2/servers?filter=contains(hardware/model,'DL365')" -Method GET -Headers 
$headers
```

I start by checking the request was successful as before:

```
$response.StatusCode
```

it should display 200

Then I parse the result with the following command:

```
$response.Content | ConvertFrom-Json | select count
```

it should display 4, the number of servers with 'DL365' in the hardware model in my environment.

Now I can look at the actual content:

**($response.Content | ConvertFrom-Json).items**

![figure6](/img/greenlake-com-ops-api-pyt-pow4.png)

Refer to the following [blog](https://developer.hpe.com/blog/) for more information on filter query syntax and API references.

# Using Python

from a Python 3 environment:
At the Python interpreter prompt >>>, I import 2 modules to make HTTP requests and to work with JSON data

```
import requests
import json
```

I need to set some variables that I will use later:

```
# Store our Compute Ops Manager API endpoint
endpoint = "https://us-west2-api.compute.cloud.hpe.com"
# Add a header for authorization, using the Access Token generated in task 2	
headers = {"Authorization": "Bearer " + "paste_access_token_here"}
```

![figure8](/img/greenlake-com-ops-api-pyt-pow5.png)

I can now send my first request:

```
response = requests.get(url=endpoint + '/compute-ops/v1beta2/servers?limit=2', headers=headers)
```

Once again, I check if the request was successful, the response status code should display 200:

```
print(response.status_code)
```

In order to display the JSON data returned by the request in a human-readable form:

```
print(json.dumps(response.json(), indent=2))
```

![figure 9](/img/greenlake-com-ops-api-pyt-pow6.png)

I see the request returned 2 objects **(count : 2)** and the actual server details are in the **items** array property.

The API supports several query parameters depending on the resource type, such as filter, limit (maximum number of records to return), offset (resource offset to start the response from) and sort (order in which to return the resources in the collection).

Filters provide the ability to limit the resources that take part in the action of a REST call. When a REST call includes a filter, the GET or DELETE action is restricted to a response that meets the filter requirements. Filters are specified by using the query parameter 'filter'.

A simple example of filtering follows:

**GET <URI>?filter=powerState eq 'Off'**

This example shows a simple filter. The resources returned by the query are limited to results with the attribute powerState and the value Off. 

To use a filter on a nested property name, the '/' separator can be specified as follows:

**GET /compute-ops/v1beta2/servers?filter=hardware/model eq 'ProLiant DL365 Gen10 Plus'**

I can test with the following command:

```
response = requests.get(url= endpoint + "/compute-ops/v1beta2/servers?filter=contains(hardware/model,'DL365')", headers=headers)
```

First check if the request was successful as before

```
print(response.status_code)
```

should display 200

Display the number of objects in the response


```
print(response.json()\['count'])
```

It should display 4 

![figure 10](/img/greenlake-com-ops-api-pyt-pow7.png)

Display the JSON data returned by the request in a human-readable form


```
print(json.dumps(response.json(), indent=2))
```

![figure 11](/img/greenlake-com-ops-api-pyt-pow8.png)

Refer to previous sections for more information on filter query syntax and API references.

## What’s next?

In this blog post, I covered how to get started with HPE GREENLAKE FOR COMPUTE OPS MANAGEMENT REST API explained how to post simple API calls through Python and PowerShell. Some future Workshops-on-Demand will allow you to run experiment these examples live, stay tuned.

[Learn more about HPE GreenLake](<>)

Learn more about the [HPE GreenLake for Compute Ops Management REST API](https://developer.greenlake.hpe.com/docs/greenlake/services/compute-ops/public/guide/#filtering)

This [GitHub repository](https://github.com/jullienl/HPE-Compute-Ops-Management) hosts many script samples for the Compute Ops Management API including PowerShell, Python, Ansible playbooks and others.

Find other tutorials and articles on HPE GreenLake on the [HPE Developer blog](https://developer.hpe.com/blog).