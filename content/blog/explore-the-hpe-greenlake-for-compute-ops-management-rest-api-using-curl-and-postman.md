---
title: Explore HPE GreenLake for Compute Ops Management REST API using cURL and
  Postman
date: 2022-11-30T12:36:05.351Z
author: Lionel Jullien, Vincent Berger & Frederic Passeron
authorimage: /img/Avatar3.svg
thumbnailimage: ""
disable: false
tags:
  - hpe-greenlake
  - hpe-greenlake-for-compute-ops-management
  - developer
  - devops
  - hpe-greenlake-cloud-platform
	- sre
  - site-reliability-engineer
---
HPE GreenLake for Compute Ops Management automates and transforms complex and time-consuming compute management operations into a simplified experience across edge-to-cloud. Whether you are an IT OPS or a DEV OPS engineer, you know that automation is the key to success. And today’s automation relies heavily on APIs and how one can interact easily with them. So, let us show you how to leverage the API provided so you, too, can take advantage of what HPE GreenLake for Compute Ops Management can provide. In this blog post, we will cover how to do this using cURL and Postman.



![blog figure1](/img/greenlake-com-ops-api-curl1.png)

# HPE GreenLake for Compute Ops Management REST API

HPE GreenLake for Compute Ops Management provides a Restful API to customers who want to manage their devices programmatically or through a command line interface. The API enables customers to invoke operations or tasks such as list devices, see device details, device health, manage a device's firmware and much more.

To learn more about HPE GreenLake for Compute Ops Management API methods and resources, you can refer to the [API reference documentation](https://developer.greenlake.hpe.com/docs/greenlake/services/compute-ops/public/openapi/compute-ops-latest/overview/).

Here are some of the operations you can do with the HPE GreenLake for Compute Ops Management API:

* Obtain the list of servers in your account  
* Obtain the list of firmware bundles 
* Obtain the list of job templates 
* Perform a firmware update
* Run a carbon emissions report
* Power on/off/restart a server

![blog figure1](/img/greenlake-com-ops-api-curl24.png)

We would like to share with you today a few examples of REST API calls that can be made through simple [cURL](https://curl.se/)  commands or [Postman](https://www.postman.com/) examples.

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

The [HPE GreenLake for Compute Ops Management API Reference site](https://developer.greenlake.hpe.com/docs/greenlake/services/compute-ops/public/openapi/compute-ops-latest/overview/) leverages OpenAPI conformant documentation that provides a complete explanation of the operations supported by the Unique Resource Identifiers [(URIs)](<>)as well as sample requests and responses. 

If you are wondering which to use, cURL is probably a good choice if you like command line interfaces, Postman if you prefer graphical user interfaces, and PowerShell or Python if you are really into programming.

# Using cURL

From the command prompt, use a simple cURL command like:

```shell
curl -X GET https://us-west2-api.compute.cloud.hpe.com/compute-ops/v1beta2/servers?limit=2 -H "Authorization:Bearer ,< access_token_here>”**
```

Note that you must use the correct connectivity endpoint according to the region where HPE GreenLake for Compute Ops Management is deployed. Currently, these are the connectivity endpoints for the possible HPE GreenLake for Compute Ops Management regions:

* [EU Central](https://eu-central1-api.compute.cloud.hpe.com)   
* [AP Northeast](https://eu-central1-api.compute.cloud.hpe.com) 
* [US West](https://us-west2-api.compute.cloud.hpe.com)

The request uses the **GET** method for the **/compute-ops/v1beta2/servers** resource to obtain the list of the available servers as described in the API reference.

![blog figure3](/img/greenlake-com-ops-api-curl25.png)

The command uses a header parameter with keyword **"Authorization:Bearer {token}**"

**?limit=2** at the end of the URL is a query parameter to limit the response to a maximum of two servers as documented in the request pane of the *servers* resource:

![blog figure4](/img/greenlake-com-ops-api-curl19.png)

As a result of the command, the API response lists two compute servers that are on-boarded and assigned to the corresponding application for the user's account.

![blog figure4](/img/greenlake-com-ops-api-curl15.png)

To see the API response code, add -I at the end of the command:

```shell
curl -X GET https://us-west2-api.compute.cloud.hpe.com/compute-ops/v1beta2/servers?limit=2 -H "Authorization:Bearer <your access_token_here>” –I
```

![blog figure5](/img/greenlake-com-ops-api-curl2.png)

The response code displays **200 OK.** 

This status response code indicates that the request has succeeded. The complete list of response codes for each resource in the API reference is shown below:

![blog figure6](/img/greenlake-com-ops-api-curl26.png)

The JSON response provided by the API is not formatted, which makes it difficult to read and understand the JSON content, but a tool like [jq](https://stedolan.github.io/jq/)  can prettify the content. Just add “| jq” at the end of the command to get a better visual display.

![blog figure7](/img/greenlake-com-ops-api-curl4.png)

The API supports several query parameters depending on the resource type, such as filter, limit (maximum number of records to return), offset (resource offset to start the response from) and sort (order in which to return the resources in the collection).

Filters provide the ability to limit the resources that take part in the action of a REST call. When a REST call includes a filter, the GET or DELETE action is restricted to a response that meets the filter requirements. Filters are specified by using the query parameter 'filter'.

Here is a simple example of filtering:

**GET <URI>?filter=powerState eq 'Off'**

This example shows a simple filter. The resources returned by the query are limited to results with the attribute **powerState** and the value **Off**.

To use a filter on a nested property name, the '**/**' separator can be specified as follows:

**GET /compute-ops/v1beta2/servers?filter=hardware/model eq 'ProLiant DL365 Gen10 Plus'\*\***\
{\*\*

    **"offset": 0,**

    **"count": 20,**

    **"total": 20,**

    **"items": [**

        **{**

            **"id": "P39368-B21+CN70421C51",**

            **"type": "compute-ops/server",**

            **"platformFamily": "PROLIANT",**

            **"resourceUri": "/compute-ops/v1beta2/servers/P39368-B21+CN70421C51",**

            **"name": "HPE-HOL56",**

            **"createdAt": "2022-04-29T12:35:35.265978+00:00",**

            **"updatedAt": "2022-10-25T19:54:36.572565+00:00",**

            **"generation": 292,**

            **"hardware": {**

                **"serialNumber": "CN70421C51",**

                **"model": "ProLiant DL365 Gen10 Plus",**

                **"uuid": "33393350-3836-4E43-3730-343231433531",**

                **"productId": "P39368-B21",**

                **"powerState": "ON",**

                **"indicatorLed": "OFF",**

                **"health": {**

                  **  "summary": "OK",**

                  **  "healthLED": "OK",**

                  **  "fans": "OK",**

                  **  "fanRedundancy": "REDUNDANT",**

                  **  "liquidCooling": "NOT_PRESENT",**

                  **  "liquidCoolingRedundancy": "NOT_PRESENT",**

                  **  "memory": "OK",**

                  **  "network": "UNKNOWN",**

                  **  "powerSupplies": "OK",**

                  **  "powerSupplyRedundancy": "NOT_PRESENT",**

                  **  "processor": "OK",**

                  **  "storage": "OK",**

                  **  "temperature": "OK",**

                  **  "bios": "OK",**

                  **  "smartStorage": "OK"**

                **},**

                **"bmc": {**

                  **  "mac": "B4:7A:F1:4E:9E:92",**

                  **  "ip": "172.30.231.116",**

                  **  "hostname": "None"**

The following cURL command includes the filter

```shell
curl -X GET “https://us-west2-api.compute.cloud.hpe.com/compute-ops/v1beta2/servers?filter=contains(hardware/model,'DL365')” -H "Authorization:Bearer <your access_token_here>"
```

![blog figure8](/img/greenlake-com-ops-api-curl5.png)

Contains is another filter option to return resources where associated **hardware/model** contains **DL365.** The result of the command shows 4 server resources whose model name contains DL365.

The filter query syntax supports a richer set of filters than the single operation in the previous example. Filtering syntax is broken down by Operations, Logic, and Types. In the previous example, [](<>)the operation was 'eq' for equality. Most comparison operations require the evaluated property name to the left of the operator and a literal to the right.

![blog figure9](/img/greenlake-com-ops-api-curl16.png)

To learn more about Filtering, see [the HPE GreenLake for Compute Ops Management guide.](https://developer.greenlake.hpe.com/docs/greenlake/services/compute-ops/public/guide/#filtering)

The HPE GreenLake for Compute Ops Management API supports many resources that are described in the [API reference](https://developer.greenlake.hpe.com/docs/greenlake/services/compute-ops/public/openapi/compute-ops-latest/overview/) document, as illustrated below:

![blog figure10](/img/greenlake-com-ops-api-curl17.png)

Unique Resource Identifiers [(URIs)](<>)  are used to identify a resource. A URI is a full API path ending in an identification number. 

For example:

* compute-ops/v1beta2/servers/{serverId}
* compute-ops/v1beta1/reports/{id}/data

**v1beta1**, **v1beta2** in the URI is the version of the resource that is being accessed.

One can invoke the common HTTP [](<>)methods, like GET, POST, PUT, PATCH, and DELETE, on resources in the HPE GreenLake for Compute Ops Management API as shown below for the **filters** resource:

![blog figure11](/img/greenlake-com-ops-api-curl23.png)

Refer to the [API reference](https://developer.greenlake.hpe.com/docs/greenlake/services/compute-ops/public/openapi/compute-ops-latest/overview/) site for a complete list of [](<>)methods supported by each API resource.

# Using Postman

Postman is a tool designed to build and use APIs.

To get started, “create a request”, as shown below:

![blog figure12](/img/greenlake-com-ops-api-curl7.png)

In the request URL field, enter the endpoint URL: ﻿

[](<>)**<https://us-west2-api.compute.cloud.hpe.com/compute-ops/v1beta2/servers?limit=2>**

This is the base connectivity endpoint you have seen in earlier, followed by the resource URI you want to query ﻿**/compute-ops/v1beta2/servers** as described in the API reference table.

![blog figure13](/img/greenlake-com-ops-api-curl25.png)

In order to limit the output as documented in the request pane of the *servers* resource:

We use query parameter ﻿**?limit=2**

![blog figure14](/img/greenlake-com-ops-api-curl19.png)

![blog figure15](/img/greenlake-com-ops-api-curl20.png)

In the *Authorization* tab, choose  **Bearer Token** in the *Type* drop-down menu and paste the access token that was generated earlier in the Token field. Postman will generate the appropriate Authorization header when you send the request.

![blog figure16](/img/greenlake-com-ops-api-curl8.png)

Hit the **Send** button to get a **200 OK** status response indicating success and a JSON body with the details of two compute servers on-boarded and assigned to the corresponding application for the user's account.

![blog figure17](/img/greenlake-com-ops-api-curl9.png)

The complete list of response codes is documented for each resource in the API reference table shown below:

![blog figure18](/img/greenlake-com-ops-api-curl21.png)

The API supports several query parameters depending on the resource type, such as filter, limit (maximum number of records to return), offset (resource offset to start the response from) and sort (order in which to return the resources in the collection).

Filters provide the ability to limit the resources that take part in the action of a REST call. When a REST call includes a filter, the GET or DELETE action is restricted to a response that meets the filter requirements. Filters are specified by using the query parameter 'filter'.

A simple example of filtering follows:

**GET <URI>?filter=powerState eq 'Off'**

This example shows a simple filter. The resources returned by the query are limited to results with the attribute **powerState** and the value **Off**.

To use a filter on a nested property name, the '**/**' separator can be specified as follows:

**GET /compute-ops/v1beta2/servers?filter=hardware/model eq 'ProLiant DL365 Gen10 Plus'**

To test this filter, we enter the following URL in the Request field:

**<https://us-west2-api.compute.cloud.hpe.com/compute-ops/v1beta2/servers?filter=contains(hardware/model,'DL365')>**

![blog figure19](/img/greenlake-com-ops-api-curl22.png)

The Authorization tab should still have your Access Token (an access token is valid for 2 hours).

We hit the **Send** button.

The request should indicate success (Status is 200 OK) and, in this example, the response shows 4 server resources whose model name contains DL365.

![blog figure20](/img/greenlake-com-ops-api-curl10.png)

The filter query syntax supports a richer set of filters than the single operation in the previous example. Filtering syntax is broken down by Operations, Logic, and Types. 

In the previous example[,](<>)  the operation was 'eq' for equality. Most comparison operations require the evaluated property name to the left of the operator[](<>) and a literal to the right.

![blog figure21](/img/greenlake-com-ops-api-curl16.png)

To learn more about Filtering, see the [HPE GreenLake for Compute Ops Management guide](https://developer.greenlake.hpe.com/docs/greenlake/services/compute-ops/public/guide/#filtering).

Unique Resource Identifiers (URIs) are used to identify a resource. A URI is a full API path ending in an identification number. 

For example:

* compute-ops/v1beta2/servers/{serverId}
* compute-ops/v1beta1/reports/{id}/data 

**v1beta1**, **v1beta2** in the URI is the version of the resource that is being accessed.

You can invoke the common HTTP methods, like GET, POST, PUT, PATCH, and DELETE,on resources in the HPE GreenLake for Compute Ops Management API as shown below for the **filters** resource:

Refer to the [API reference](https://developer.greenlake.hpe.com/docs/greenlake/services/compute-ops/public/openapi/compute-ops-latest/overview/) site for a complete list of methods supported by each API resource.

Finally, a Postman collection of executable API requests for the HPE GreenLake for Compute Ops Management API can be found [HERE](https://www.postman.com/jullienl/workspace/lionel-jullien-s-public-workspace/collection/991177-10c5377d-892b-4612-9e81-23d75d6c2f0d?ctx=documentation).

# What’s next?

In this blog post, we covered how to get started with the HPE GreenLake for Compute Ops Management REST API, explained how to post simple API calls through cURL commands, and showed you how to leverage Postman to achieve the same results.  In our next article, we will show how similar calls can be performed using Python or PowerShell.

Learn more about [HPE GreenLake](https://www.hpe.com/hpe/greenlake)

Learn more about the [HPE GreenLake for Compute Ops Management REST API](https://developer.greenlake.hpe.com/docs/greenlake/services/compute-ops/public/guide)

Find other tutorials and articles on HPE GreenLake on the [HPE Developer blog](https://developer.hpe.com/blog).
