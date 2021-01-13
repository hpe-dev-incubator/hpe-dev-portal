---
title: "First step with programming the HPE Composable API"
date: 2017-09-08T16:36:19.453Z
author: Didier Lalli 
tags: ["HPE-OneView","OneView","RESTAPI"]
path: first-step-with-programming-the-hpe-composable-api
---
# A bit of history

In December 2015, in London, HPE announced Synergy, the first platform
architected from the ground up for composability. Earlier that year, HPE
had announced the Composable API, and the Composable ecosystem. This
ecosystem is now growing because more and more software partners have
expressed interest in integrating with the Composable API. Some have
already demonstrated products, some have products in development, but
all of them are using the same Composable API, also referred to as the
HPE OneView API. This API allows HPE OneView and the Synergy Composer
(powered by HPE OneView) to be controlled by another software entity,
thus it is an essential step in building a software-defined
infrastructure. The controlling software entity might be as simple as a
small script (in PowerShell or Python), it might also be a configuration
management system, such as Chef, Ansible or any kind of software that
needs to interact with the underlying infrastructure (VMware vCenter,
Microsoft System Center, Docker Machine, etc.). In all cases an API is a
prerequisite for a software defined infrastructure and the growing
ecosystem around it. HPE OneView and the Synergy Composer is no
exception and it comes with an API since v1.0 in September 2013.

# REST API in 30 seconds

There are many types of APIs, but the most widely used API in modern
software, is called REST (for Representational State Transfer). A REST
API (or RESTful API as it is often referred to) has a number of design
principles:

-   It uses HTTP and HTTPS as a communication protocol

-   It uses a very simple set of HTTP verbs to initiate actions (PUT,
    GET, POST, DELETE, PATCH)

-   Objects are represented by their URI (Universal Resource Identifier)

For example, the following are examples of REST calls:

-   POST https://oneviewsrv.cilab.net/rest/login-sessions (means: apply
    for an identity token)

-   GET https://oneviewsrv.cilab.net/rest/alerts (means: get the list
    of alerts)

More generically, we can see that any call is in the form of:

-   Verb protocol://server-end-point/URI

Where *Verb* can be one of the following, and its action is applied to
the provided URI, over the specified protocol at a given server
endpoint:

-   GET: to read the value of a resource

-   PUT: to change the value of a resource

-   POST: to create a new instance of a resource

-   DELETE: to remove an instance of a resource

-   PATCH: to update values of a resource.

&gt; **Note: PATCH is part of the newest additions to the HTTP protocol and
&gt; it is not yet fully supported by the Composable API**

# RTFM: Read The Fantastic Manuals

Ok, enough talking! Let's try to make our first call to the HPE
Composable API. Where do we start? Well, the API is fully described in
the product’s online Help, and it is also available online at
http://www.hpe.com/info/oneview/docs. There, you will find a
downloadable version of the document, which is nice to have on your
laptop as it presents itself as a set of HTML pages that is easy to
navigate. As an example, once you open the help page, you can search for
"version" and you will find something like this:

![Response of get API version REST call](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/progapi-1-1504889058235.png)

There is a page like this for each single API call available in HPE
OneView. From the information provided, we can see that a call to GET
/rest/version will return the versions supported by the API. Let’s use
this for our first interaction with the HPE OneView API. If you scroll
down a bit in the help page, you will also find what kind of response is
expected:

![Response of get API version REST call](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/progapi-2-1504889064687.png)

We can see, that this API returns a Content-Type of JSON (JavaScript
Object Notation). This is a very popular format used to exchange data
with an API. It is similar to XML, just a little more human readable.
Many APIs are moving away from XML as the exchange format in preference
of JSON. HPE OneView uses JSON for input parameters, and responses.
There are many web sites for you to learn about JSON, but I have found
this online parser very helpful to check the syntax of a JSON payload
before using it: http://json.parser.online.fr/

# Pick a REST Tool

So now we have all the information we need to place our first HPE
OneView API call to retrieve the version numbers. However, if you are
new to REST programming, you might ask yourself: how do I place a REST
call to an API without writing any code? There are a number of simple
solutions for this. For example, there are several browser plug-ins
available and I am sure you will find one for your favorite browser
(HttpRequester for Firefox, POSTman for Chrome, just to name a few). My
favorite is **HttpRequester** for Firefox and it looks like this:

![HttpRequester tool for Firefox](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/progapi-3-1504889071823.png)

If you prefer Chrome, then **POSTman** would look like this:

![POSTman for Google Chrome](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/progapi-4-1504889079190.png)

# Let's go!

Both are very easy to install and intuitive to use, but I will continue
to use HttpRequester in the rest of this document. So let’s fill out the
following fields:

| Field  | Value                                      | Try it here                                |
|--------|--------------------------------------------|--------------------------------------------|
| URL    | https://{HPEOneViewappliance}/rest/version | https://213.30.139.22:37441/rest/version   |
| Verb   | GET                                        |                                            |
| Header | Accept=application/json                    |                                            |

**Note: Before you start, make sure you open a browser connection to
your HPE OneView API at least once and accept the self-signed
certificate. Otherwise HttpRequester will not work.**

There is no request payload to worry about for the GET /rest/version
call. You can specify an HTTP Header to explicitly tell the API that we
expect a response in JSON, you might get XML response otherwise. When
ready, press the **Submit** button.

![Retrieve the oneview version using HttpRequester for firefox](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/progapi-5-1504889085855.png)

HttpRequester will contact the URL specified and call GET version from
the API. In the Response section, as illustrated above, you want to
check the HTTP status code. A value of 200 means it was successful.
Next, you can check the Response body formatted as JSON, to find out
about the version. This response will have to be parsed to retrieve the
currentVersion value. But we can read pretty easily that
currentVersion=200 (meaning HPE OneView V2.0)

Congratulations! You have successfully placed your first call to the HPE
OneView API. As you have seen, GET version does not require any
authentication. In fact, it is one of the few calls you can place
without having to provide proper authentication. In subsequent articles,
we will dive deeper into the API and learn about how to authenticate and
retrieve information about the HPE OneView resources.

Although this example might seems very basic, any integration with HPE
OneView should always start by querying the API versions supported,
therefore, this is always going to be your very first step.
