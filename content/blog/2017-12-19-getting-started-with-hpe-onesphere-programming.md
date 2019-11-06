---
title: Getting started with HPE OneSphere Programming
date: 2017-12-19T10:04:58.994Z
author: Didier.Lalli@hpe.com 
tags: ["HPE-OneSphere","API","GettingStarted","REST"]
path: getting-started-with-hpe-onesphere-programming
---
## Summary
This article, is the first of a series which will describe how to use the HPE OneSphere API. The articles are targeted at developers and architects willing to understand what capabilities are provided by the API, and how to build automation and integration with HPE OneSphere. 
At the end of this article you should be able to place a first API call to your HPE OneSphere management portal using your own system and some useful REST tools.## HPE OneSphere
In December 2017, in HPE Discover Madrid, HPE announced HPE OneSphere. HPE OneSphere is a new approach towards hybrid IT that provides end-to-end simplicity via a Software-as-a-Service (SaaS) solution delivering cloud Management-as-a-Service, flexibility in composing and operating virtualized and containerized workloads across on-premises, private and public cloud platforms from a single unified user interface and common API.## HPE OneSphere API
Although HPE OneSphere provides functionality through a SaaS delivery mechanism, all the capabilities are also available via an Application Programming Interface (API). This interface allows 3rd party applications or scripts, to interact with HPE OneSphere to retrieve some data and even pilot it remotely. This API uses a de facto standard best known as REST, and is, as such, called a REST API.## REST API in 30 seconds
There are many types of APIs, but the most widely used API in modern software, is called [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) (for Representational State Transfer). A REST API (or RESTful API as it is often referred to) has a number of design principles:

   + It uses HTTP and HTTPS as a communication protocol
   + It uses a very simple set of HTTP verbs to initiate actions (PUT, GET, POST, DELETE, PATCH)
   + Objects are represented by their URI (Universal Resource Identifier)

For example, the following are examples of REST calls:

   * POST [https<nolink>://myonesphere.hpe.com/rest/session](#) (means: apply for a new identity token)
   * GET [https<nolink>://myonesphere.hpe.com/rest/status](#) (means: get the status of the HPE OneSphere platform)

More generically, we can see that any call is in the form of:

 + Verb protocol://server-end-point/URI

Where _Verb_ can be one of the following, and its action is applied to the provided _URI_, over the specified _protocol_ at a given _server endpoint_:

   * GET: to read the value of a resource
   * PUT: to change the value of a resource
   * POST: to create a new instance of a resource
   * DELETE: to remove an instance of a resource
   * PATCH: to update values of a resource.## JSON and HTTP Headers

Now that we understand HTTP Verbs used to access an API, let me introduce two additional concepts. In order to exchange data with an API, that is as input parameters, for example or to retrieve data, we need a standard format. Many format are available, and we could decide to use text or XML, but in the API nowadays, another standard as emerged as the de facto choice and it is called JSON (for JavaScript Object Notation). Most API would support JSON these days, and many only support JSON as an interchange format. If you do not know JSON, it is not a big deal, it is very similar to XML, just a little bit more human readable. There are many web sites for you to learn about JSON, but I have found this online parser very helpful to check the syntax of a JSON payload before using it: [http://jsonparseronline.com](http://jsonparseronline.com).

The following illustration shows an example of a JSON payload used to login to an API:


```json
{
"userName":"administrator", "password":"password"
}
```

The next example is an output response from the API, still formatted in JSON

```json
{
    "total": 5,
    "start": 0,
    "count": 5,
    "members": [
         {
           "id": "3107fb00-0063-4789-9dec-d387e16a2551",
            "name": "MouginsLab1",
            "uri": "/rest/zones/3107fb00-0063-4789-9dec-d387e16a2551",
            "metrics": null,
            "regionUri": "/rest/regions/e624a4e1-ad3f-490b-9ce3-eba36d9536c6",
            "zoneTypeUri": "/rest/zone-types/vcenter",
            "providerUri": "/rest/providers/tmelab",
            "status": "Ok",
            "state": "Disabling",
            "created": "0001-01-01T00:00:00Z",
            "modified": "0001-01-01T00:00:00Z"}
```

Now we have Verbs to control the API and a format to exchange data, we have one last concept called HTTP Headers to understand. This is also part of the original HTTP Protocol specification. It is possible to add addition information to an HTTP call in the form of a series of Key/value pairs. Keys are not standardized, but there are many well-known HTTP Headers such as Content-Type, Accept and Authorization. The following are example of Key/Values for HTTP Headers, which will be used with programming HPE OneSphere

| Header | Value | Explanation |
| --- | --- | --- |
| Content-Type | application/json | This header tells the API about the format of data you are providing in the body |
| Accept | application/json | This header tells the API about the format of data you expect in the response |
| Authorization | Bearer <token> | This is your authorization key to access the API |

Ok, now we understand the verbs you can call against the API, the format we can use to pass data in and out, and the notion of headers. We are ready to place a first API call.

## The API Reference

Well before we can call this API we need to know what calls can be placed against HPE OneSphere. We need to know the list of API calls serviced by a given version of the HPE OneSphere product. There are several ways to provide this information, and one of them is using an OpenSource set of tools called Swagger ( [https://swagger.io](https://swagger.io)). Swagger uses HTML to present the different calls which can be used, together with what parameters needs to be provided and what status code and response is expected. The following example show the Swagger description of the REST API call for **GET /rest/status**.

![API Reference for GET /rest/status](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/12/gettingstartedwithonesphereprogramming-picture1-1515084213559.jpg)

The following capture the details for the **POST /rest/session** call:

![gettingstartedwithonesphereprogramming picture2](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/1/gettingstartedwithonesphereprogramming-picture2-1515084714119.jpg)

Each HPE OneSphere comes with a complete API Reference which link is located in the **Learn** section of the GUI. Alternatively we also host a version of the API Reference at [https://developer.hpe.com/platform/hpe-onesphere/home](https://developer.hpe.com/platform/hpe-onesphere/home)## Pick a REST Tool

So now, we have all the information we need to place our first HPE OneSphere API call to retrieve status. However, if you are new to REST programming, you might ask yourself, how do I place a REST call to an API without writing any code? There are a number of simple solutions for this. The one we recommend and will continue to use in these articles is called **Postman**. This is a free application from Postdot Technologies, and it is available for Windows, Mac, Linux and as a Chrome browser plugin. You can download and install it from [https://www.getpostman.com/postman](https://www.getpostman.com/postman)

![geettingstartedwithonesphereprogramming picture3](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/12/geettingstartedwithonesphereprogramming-picture3-1513678321128.jpg)

## Go for it!

Assuming you now have Postman installed, let us fill out the following fields:

| **Field** | **Value** | | |
| --- | --- | --- | --- |
| **Verb** | GET | | |
| **URL** | https<nolink>://{HPEOneSphere}/rest/status | | |
| **Headers** | **Key** | **Value** | **Explanation** |
| | Accept | application/json | This header tells the API about the format of data you expect in the response |

The response from such a call will be a JSON body and a Status Code of 200.


> Note: Any Status Code in the 200 range is good. Status Code of 404 is most likely a mistake in the URL  used, while 405 is most likely an authorization problem. An error code of 500 is very bad and should not be encountered.

The response body will be of the following format:

```json
{
    "service": "OK",
    "database": ""
}
```## How about security?

From this first call, it would seem like anyone can call the API and do anything on the HPE OneSphere platform. This is not the case. In fact, **GET /rest/status** is the only REST call of the API, which will respond without proper authentication. Any other call will fail with an authentication error status code. Let us just verify this, using the following call:

| **Field** | **Value** | | |
| --- | --- | --- | --- |
| **Verb** | GET | | |
| **URL** | https<nolink>://{HPEOneSphere}/rest/session | | |
| **Headers** | **Key** | **Value** | **Explanation** |
| | Accept | application/json | This header tells the API about the format of data you expect in the response |

If you send such a request with Postman, you shall get a status code of 401 (Unauthorized) and a body with more details about the problem. Obviously, we need a "valid token" to resubmit the request.

![geettingstartedwithonesphereprogramming picture4](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/12/geettingstartedwithonesphereprogramming-picture4-1513678330290.jpg)

## Next step?

In the next article, we will cover how to obtain a valid token to discover the rest of the API of HPE OneSphere.