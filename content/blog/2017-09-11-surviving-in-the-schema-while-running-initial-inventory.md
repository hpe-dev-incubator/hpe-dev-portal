---
title: Surviving in the Schema while running initial inventory
date: 2017-09-11T18:45:18.180Z
author: Didier Lalli 
tags: ["HPE-OneView","OneView","RESTAPI"]
path: surviving-in-the-schema-while-running-initial-inventory
---
In previous articles, we managed to login and acquire a login session.
Now let us discover the Composable Infrastructure managed by HPE
OneView, in a top down approach through the objects available. The
following illustration shows the objects we will check during this
process:

![Datacenter structure](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/ov-inventory-schema-1-1505155314126.png)

# So what exactly is a Datacenter?

From the graph, we know that the top most object is a Datacenter, so let
us use our REST client to browse for available Datacenters in our
configuration using /rest/datacenters. Before we do so, how do we know
what are the properties that make up a Datacenter object? There is a
technique, to find out about this. This technique is to add a /schema at
the end of the URL, for example /rest/datacenters/schema, to retrieve
the schema for datacenter.

Note: This technique is still experimental in HPE OneView v2.0, and not
all resources are described by a GET /schema command, although the ones
typically used to create an initial inventory are. This technique is
subject to evolve in the future

Let us try with our HTTP Requester Client.

![REST call via HTTP to retrieve the datacenters schema](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/ov-inventory-schema-2-1505155330418.png)

If you find the result difficult to read, copy the response JSON and
open another tab of your browser to an JSON online parser (such as
http://json.parser.online.fr), and paste the JSON response in the left
pane there

![JSON online parser to parse the retrieved JSON object](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/ov-inventory-schema-3-1505155337227.png)

From this tool, you can collapse and expand the properties of an object
and understand what is available. For example from the capture below, we
can see that a Datacenter has a dozen properties such as width, depth,
or status.

![JSON online parser have collapse and expand option to understand what is available in the JSON object](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/ov-inventory-schema-4-1505155343740.png)

Alternatively, we can use Postman (from Chrome). The result window
allows to expand or collapse elements directly in the body of the
response, which is very convenient:

![Postman REST tool for chrome allows to expand or collapse elements directly in the body of the response](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/ov-inventory-schema-5-1505155351099.png)

We can continue this exploration and drill down on width, which has a
description, a type (integer), and a min and a max value. We also can
find a required flag, which is important, as required properties are
mandatory when creating new objects with the POST method. We can find
other types of object. For example expand the currency property and you
will see that the type is string.

![drill down to individual properties of an object](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/ov-inventory-schema-6-1505155367635.png)

Integer and string are simple types, but if you continue to scroll down
the list of properties, you will see the contents property, which is an
array of items, of type object. An item is constructed from a number of
properties such as rotation, x, y and a resourceUri. We also call this a
collection.

![Array of items with in JSON object](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/ov-inventory-schema-7-1505155374560.png)

Note: In JSON, integer are integral numeric values (3, -24 …) while
number can be an integer or a floating-point value (3, -24, 1.5, -3.3333
…)

We understood from the exploration of the datacenter schema that, a
datacenter is composed of collection of zero or more racks for which we
now have a resourceUri.

# So what is a Rack?

Before we start exploring the content of our datacenter, let us look at
the schema for a rack by using the /rest/racks/schema URL using our REST
client tool.

![schema for a rack using URL in REST client tool](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/ov-inventory-schema-8-1505155381704.png)

Again, we can cut/paste the REST client response into a JSON parser to
navigate it easily. From there we can discover the properties of a rack,
such as width, height, depth, and a collection of rackMounts, which
represent zero or more items contained in the rack (enclosure,
server-hardware, power delivery device)

![paste the REST client response into a JSON parser to discover the properties of a rack](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/ov-inventory-schema-9-1505155389486.png)

We can expand the rackMounts property to understand what composes a
rack. We discover that it is made of a collection of items, and that
each item has a mountUri to access it.

![expand the rackMounts property to understand what composes a rack](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/ov-inventory-schema-10-1505155395931.png)

We now understand that an HPE OneView instance contains a collection of
one or more datacenters, which is composed of a collection of zero or
more racks, which contains a collection of one or more items such as a
server or an enclosure. We know enough to start our first inventory.

# Let's look it up now!

Let's now use our REST Client to explore the object instances found in
our environment. Starting from the topmost objects, the datacenters.

![REST Client to explore the object instances found in our environment. Starting from the topmost objects, the datacenters](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/ov-inventory-schema-11-1505155402777.png)

From the result JSON we find out that we have only one datacenter,
called "Sophia Antipolis", and in this datacenter we have a single rack
which URI is: /rest/racks/Rack-221.

Note: total is the total number of elements while count is the number of
element returned in this "page". prevPageUri and nextPageUri allow to
navigate to other pages in case of a large number of items

We can now drill down to the content of RACK-221

![drill down to the content of RACK-221](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/ov-inventory-schema-12-1505155409949.png)

From that query, we discover that our Rack-221 is a "HP 42U Intelligent
Series Rack" and in this rack we have, from the bottom up:

-   One 10U enclosure (/rest/enclosures/09SGH102X6J1)

-   Another 10U enclosure (/res/enclosures/09SGH100X6J1)

-   One 2U
    server (/rest/server-hardware/37333036-3831-584D-5131-303030333037)

-   And finally, a 1U
    server (/rest/server-hardware/37333036-3831-584D-5131-303030323038).

We have, with the mountUri property, a direct access to the URI of each
item in the rack.

# Hugh! What is an Enclosure?

We have not yet explored what an enclosure is, so let's be curious and
take a quick look at the schema of an enclosure. In HPE terminology, an
enclosure is a C7000 enclosure, and it look something like this:

![C7000 enclosure](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/ov-inventory-schema-13-1505155418059.png)

It is composed of many elements, such as blade servers (deviceBays),
onboard administrators (managerBays), interconnect modules
(interconnectBays), fans (fanBays), power supplies (powerSupplyBays). If
we look at the schema of an enclosure (/rest/enclosures/schema) we can
confirm that.

![ov inventory schema 14](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/ov-inventory-schema-14-1505155424179.png)

We can also see that an enclosure is composed of a deviceBays array of
items. If we now query our first enclosure
(/rest/enclosures/09SGH102X6J1 for example), we can see there that this
is an enclosure called Encl2, and we can see many of the useful
parameter that make up an enclosure.

![explore enclosure deviceBays array of items](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/ov-inventory-schema-15-1505155430487.png)

We can also discover that it is composed of 16 device bays and that each
of these bays is, in our case a blade server for which we are given the
deviceUri (/rest/server-hardware/31393736-3831-4753-4831-30325837524E
for example). Note that this is a server-hardware resource, similar to
the rackmount servers we already discovered in the rack earlier.

![Explore the enclosure deviceBays array of items](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/ov-inventory-schema-16-1505155436138.png)

If you checked all the items in the deviceBays collection, you would
discover 14 servers, and another 14 servers in the second enclosure
(Encl1), plus our 2 rack-mount systems, which makes a total of 30
server-hardware resources.

Note: servers in bay 1 and 2 are double-height servers, and as such,
they use the bays 9 and 10. Actually, in such case, if you look in the
server URI of bay x, and bay x+8, you shall see the same server URI

# Et voilà! The result of our initial discovery

Based on this information we can now build a complete picture of the
discovered environment. We could represent this in our own software
component, and we could be storing some of the properties for it, plus
the resource URI for quick retrieval of the full object properties.

![complete picture of the discovered environment](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/ov-inventory-schema-17-1505155441995.png)

In a next article, we will discuss how to find and associate the
management processors of each of these servers.