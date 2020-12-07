---
title: "Leveraging HPE OneView Single Sign On to iLO Management Processors"
date: 2017-09-11T16:49:26.055Z
author: Didier Lalli 
tags: ["HPE-OneView","OneView","ILO"]
path: leveraging-hpe-oneview-single-sign-on-to-ilo-management-processors
---
In this previous article, [Surviving in the Schema… while running our
first
inventory](https://community.dev.hpe.com/t5/Blogs/Surviving-in-the-Schema-while-running-our-first-inventory/ba-p/235998),
we discussed how to run a discovery of the environment managed by HPE
OneView. We derived a tree structure of the following format:

![Datacenter tree structure](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/ov-ilo-sso-1-1505149237398.png)

We can check the schema for a server-hardware using our favorite REST
client tool (Postman extension for Chrome in our case) with the
following command: GET /rest/server-hardware/schema against the HPE
OneView API.

![check the schema for a server-hardware using our favorite REST client tool](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/ov-ilo-sso-2-1505149245923.png)

We notice that a management processor (mp) is also available in a
server-hardware and that some details about the management processor are
provided (mpFirmwareVersion, mpHostInfo, mpModel, mpState).

# Don't you like my iLO?

I am sure most of you are familiar with the concept of management
processor in servers, but in the ProLiant family of servers, these are
best known as iLO (integrated Lights-Out). iLO management cards have
been provided in ProLiant servers since 2001. They have since then been
replaced by a custom chip on server motherboard and are extremely
popular in datacenter management. Today iLO 4 is the current generation
of iLO processors present on Gen8 and Gen9 of ProLiant servers. iLO
management processors provide a wide variety of great options when it
comes to management of servers in an out-of-band manner. To start with,
the management IP address of the iLO offers a web console to manage the
server-hardware.

![ILO remote console to the system](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/ov-ilo-sso-3-1505149253257.png)

But probably the most used feature of the iLO processor, is the
capability to open a remote console to the system, which really allows
to be "on" the system without ever having to enter a computer room, and
whether or not the server is powered on, or installed with an operating
system or not.

![ILO remote console to the system](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/ov-ilo-sso-4-1505149260202.png)

The HPE OneView web console provides a direct link the web interface of
the iLO of any given server-hardware, as well as a direct link to the
iLO Remote Console of the server. This is great but what would also be
nice, is if third party applications integrating with HPE OneView using
the Composable API, could leverage this feature and embed those links in
their application context allowing users to reach, in one single click,
the iLO Web Console or Remote Console of any discovered server-hardware.
This article describes how to do this.

# So how do we SSO?

iLO Management Processors are protected by credentials. Users can be
added to the authorized users list, or you can even leverage an existing
LDAP infrastructure, but to get started you have to access the iLO using
a factory generated administrator password provided with every server
that HPE ships with an iLO. However, because the server was discovered
and placed under the management of HPE OneView, there is a special
"agreement" between HPE OneView and each iLO to allow for a Single Sign
On (SSO) from HPE OneView to login to iLOs. This means that valid
credentials in HPE OneView allow for a pass-through authentication to
all managed iLOs. This is an extremely powerful feature, which allows
configuration of large groups of server iLOs, with simply an HPE OneView
account.

We query for the list of server-hardware available to us using a GET
/rest/server-hardware, and from there pick a given one of them using its
URI (for example
/rest/server-hardware/37333036-3831-4753-4831-30325838524E)

![query for the list of server-hardware available to us](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/ov-ilo-sso-5-1505149266642.png)

We can see all the details about this particular server-hardware iLO
instance. All? Well, not quite, because if we check the HP OneView API
Reference we can find the two following commands:

-   GET /rest/server-hardware/{id}/iloSsoUrl

-   GET /rest/server-hardware/{id}/remoteConsoleUrl

![HPE Oneview API reference to retrieve server hardware](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/ov-ilo-sso-6-1505149274227.png)

Note: As you can see, the HPE OneView API Reference describes it but it
does not appear in the server-hardware description nor in the schema
description

If we try to use the first one:
/rest/server-hardware/37333036-3831-4753-4831-30325838524E/iloSsoUrl

We obtain the following result:

![Retrieve server hardware ILO SSO Url](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/ov-ilo-sso-7-1505149281204.png)

While if we try to query HPE OneView with the following additional URI:
/rest/server-hardware/37333036-3831-4753-4831-30325838524E/remoteConsoleUrl

We get the following response:

![Oneview API reference to get server hardware](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/ov-ilo-sso-8-1505149288674.png)

Using these two calls, we can offer three types of interesting
integrations:

1.  Open the Web interface of the iLO of that given server

2.  Open the iLO Remote Console of that given server

3.  Use the iLO REST API to set/get particular attributes of a given
    server

# Direct link to iLO Web Console

An application might decide to provide a link to the iLO Web Interface
as part of its own representation of a server-hardware object. In this
case, it will need to run a GET /rest/server-hardware/{id}/iloSsoUrl, to
retrieve the URL to use when the user click to obtain the iLO Web
Interface.

# Direct link to iLO Remote Console

In addition to providing a link to the iLO Web Console, an application
might decide to provide a direct link to the iLO Remote Console of a
server. In order to do this, a call to GET
/rest/server-hardware/{id}/remoteConsoleUrl would have to be initiated,
and the retrieved link should be opened.

Note: This link requires the HP iLO Remote Console application installed
on the client machine on which the link is clicked. This application can
be downloaded from the Overview page of the iLO Web Interface of any iLO
management processor

# Use the iLO REST API

Finally, since iLO 4 management processor offers a powerful REST API, it
is also possible to use SSO to manipulate configuration of the iLO using
its REST API. More details about the iLO REST API can be found in the
following web page: [www.hpe.com/info/ilo](http://www.hpe.com/info/ilo)

Note: the iLO REST API is available since firmware version 2.0, and is
Redfish compliant starting at version 2.3

For example, you could decide that the application wants to change the
server power capping value based on some internal rules. For this, you
would have to use a PATCH method to and pass an HTTP Header X-Auth-Token
with the value of the SSO session token retrieved from a GET
/rest/server-hardware/{id}/iloSsoUrl.

Let's review an example and imagine you retrieved from GET
/rest/server-hardware/{Server id}/remoteConsoleUrl, the following:

{"remoteConsoleUrl":"hplocons://addr=**192.168.1.184**&amp;sessionkey=**823b6814fd3aa2d9f82ec9f34504b6d9**"}

You would have to assemble the following PATCH command:

PATCH https://**192.168.1.184/redfish/v1/Chassis/1/PowerMetrics**

With HTTP Header: X-Auth-Token = **823b6814fd3aa2d9f82ec9f34504b6d9**

And a body of: {"PowerLimit": {"LimitInWatts": 250}}

In order to cap the given server-hardware to a maximum power utilization
of 250 Watts.

Note: Priority should be to change settings of server-hardware via the
HPE OneView API, and keep the iLO REST API for things not available in
the HPE OneView API

# Tighter partner integration = best user experience

As we discovered there are different levels of integrations that can be
built into an HPE OneView partner application. Of course, the tighter
the integration is, the richer is the user experience for our joint
customers.