---
title: Do not miss the HPE Composable Infrastructure Bus
date: 2017-09-07T18:09:49.496Z
author: Didier Lalli 
tags: ["HPE-OneView","OneView"]
path: do-not-miss-the-hpe-composable-infrastructure-bus
---
# One API and 2 Busses

In previous articles, we discussed how to get started with programming
the HPE Composable Infrastructure API. We reviewed some of the concept
on the versioning, the authentication and the discovery of the
infrastructure, via a REST API approach. Well, there is an additional
component to the HPE Composable Infrastructure, which we have not yet
discussed called the Message Bus. Actually, there are two of these
busses. One is called the State Change Message Bus (SCMB) and the second
one is called the Metrics Streaming Message Bus (MSMB).

# So what is a message bus?

Before we look at the specific of the HPE Composable Infrastructure
message busses, let us look at what a message bus is. Message bus is a
programming concept, which allows for exchange of data between a
producer and one or more consumer in a guaranteed, and asynchronous
manner. This concept has evolved over time and there is now a well know
standard for it, called AMQP (Advanced Message Queuing Protocol). Most
complex software solutions, which need to communicate asynchronously
between two components, use AMQP to do so nowadays. In this technology
we can identify a Producer (in our case it is going to be our HPE
Composable Infrastructure brain, HPE OneView), which generates and puts
data (called messages), on different message queues (via an Exchange),
and then we can have any number of consumers, which have declared
themselves as subscribers of a given queue. We call Message Bus, the sum
of these message queues. Consumers can be any program implementing AMQP.
This most recognized implementation of AMQP is called RabbitMQ. There
are RabbitMQ server side components and client side components. For
example, HPE OneView has implemented the server side of the message bus
using RabbitMQ.

The following picture illustrate the concept of producer/consumer and
message bus

![Illustrate the concept of producer/consumer and message bus](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/messabus-1-1504810187875.png)

# HPE OneView Message Bus? What for?

HPE OneView is using internally message busses, to exchange data between
its own components. It also exposes two of these busses externally and
allows client applications to subscribe to them and retrieve data from
those asynchronous queues. For example, you can, as an external
application, subscribe to all events relative to creation of new
Networks in HPE Composable Infrastructure. If you followed my previous
articles, and continued exploring the HPE Composable infrastructure API,
you probably know by now, that there is a call to retrieve network
configuration (/rest/networks). So one way (let's call it the "API way")
to achieve this would be with the following algorithm:

	While true

	Do

		Query for list of Network using /rest/networks

		Compare with old list of networks

		If new list of networks bigger then old list of network

		Then compute delta

			For each network in delta do-work-on-new-network(network)

		Endif

		Sleep 15mn

	Endo

We call this technique interval polling. It works fine but it has
several drawbacks:

1.  It's not real time, if a new network is created, you might be aware
    of it, worst case 15mn later

2.  It's pulling a lot of data from the API, especially if you reduce
    the polling interval to be more accurate, or if you are polling
    multiple resource types

3.  It requires to store in memory the state of the networks (this can
    grow big)

4.  It requires a lot of computation to get the delta between the old
    networks list and the new networks list

5.  In most of the cases the delta would be null and you have wasted a
    lot of time and energy polling and computing for nothing

A better approach would be using a message bus (in our case HPE
OneView's SCMB) and the algorithm is the following:

Subscribe to SCMB(Events of Interest= Network.Create,
Callback=Do-Work-On-New-Network)

That's it! All you really need to do is to tell RabbitMQ that you want
to call Do-Work-On-New-Network whenever a new Network is created on the
Composable Infrastructure by the HPE OneView Web interface or by its
REST API.

In fact that is exactly what some of our ecosystem partners have done.
For example, Arista has implemented such a technique to allow
top-of-rack ARISTA switches to detect and react to new networks created
in HPE OneView. In this case, the reaction is to propagate automatically
the VLAN configuration to top of rack switches. HPE Network Management
Tool iMC v7.2 also implemented the same type of automation.

# Routing Keys

When we subscribe to a message bus, we have to specify what we called in
the previous chapter: "Events of Interest". These in HPE OneView is
called a routing key. It specifies the type of messages you are
interested in, and you want to subscribe to. Routing keys are used by
the Exchange to drop messages in the right consumer queues. The generic
form of a routing key is:

.&lt;*resource-category&gt;*.&lt;*change-type&gt;*.&lt;*resource-uri&gt;*

With:

-   exchange-name: scmb or msmb

-   resource-category: any valid resource type from HPE OneView

-   change-type: Create, Deleted or Updated

-   resource-uri: any valid resource URI

The following tables shows a number of valid routing keys for the SCMB:

| Routing Key                                    | Meaning                                        |
|------------------------------------------------|------------------------------------------------|
| scmb.\#                                        | all messages                                   |
| scmb.tasks.\#                                  | all messages about any tasks                   |
| scmb.ethernet-networks.\#                      | all messages about any Ethernet networks       |
| scmb.fc-networks .\#                           | all messages about any FibreChannel networks   |
| scmb.interconnects.\#                          | all messages about any interconnects           |
| scmb.enclosures.\#                             | all messages about any enclosures              |
| scmb.\*.Created.\#                             | only create messages for any type of resources |
| scmb.server-hardware.\#                        | all messages about any server hardware         |
| scmb.connections.Deleted.\#                    | only delete messages for any connections       |
| scmb.enclosures.Updated./rest/enclosures/Encl1 | only update messages from Encl1                |

Note: routing keys are case sensitive. \* means anything for a given
field, while \# means anything for the rest of the string. So scmb.\# is
the same as scmb.\*.\*.\*

The MSMB only accept one routing key: msmb.\#

The following picture show routing keys in action with three different
partner application subscribing to different types of messages from the
HPE Composable Infrastructure.

![routing keys in action with three different partner application subscribing to different types of messages](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/messabus-2-1504810196244.png)

# Security

Security of this mechanism is implemented through SSL. In order to start
using the SCMB or the MSMB, a client application needs to use the REST
API to:

1.  Create the RabbitMQ keypair, if not already created with

    POST /rest/certificates/client/rabbitmq and a body of
    {"type":"RabbitMqClientCertV2","commonName":"default"}

2.  Download the necessary certificate and private key using: GET
    /rest/certificates/client/rabbitmq/keypair/default

3.  Separate and save the client certificate and the private key
    (procedure depends on what language is used by application)

4.  Download the HPE Composable Infrastructure Appliance root CA
    certificate using GET /rest/certificates/ca

5.  Store the root ca certificate in appropriate store (depends on
    language used)

Note: you can use DELETE /rest/certificates/ca/rabbitmq\_readonly and
then POST /rest/certificates/client/rabbitmq to regenerate a new client
certificate and private key

# Message Bus messages attributes

Once queue is setup and application is "listening", it will be receiving
messages in JSON. We can find the format of messages received from each
message bus from the online documentation,
[here](http://h17007.www1.hpe.com/docs/enterprise/servers/oneview2.0/cic-rest/en/content/c_using-msg-bus.html).

The following is an example of an SCMB message:


```json
{"data":null  
"timestamp":"2016-07-04T15:26:02.109Z"  
"resourceUri":"/rest/ethernet-networks/e5facce5-bfe9-4ce2-b793-f0e1d907d620"  
"eTag":"3a7f25c9-9bb0-4405-8d56-7600447e3411"  
"changeType":"Created"  
"newState":"Active"  
"associatedTask":"/rest/tasks/C15F02F8-CE5E-47C9-A090-CB8CFF3F158A"  
"newSubState":null  
"userInitiatedTask":false  
"changedAttributes":null  
"resource":{"type":"ethernet-networkV2"  
"vlanId":2112  
"ethernetNetworkType":"Tagged"  
"internalVlanId":0  
"smartLink":true  
"connectionTemplateUri":"/rest/connection-templates/0a9ecfd2-bfc7-450b-b4cf-48d7bf1044f2"  
"purpose":"General"  
"privateNetwork":false  
"name":"DemoNetwork"  
"state":"Active"  
"description":null  
"status":"OK"  
"category":"ethernet-networks"  
"eTag":"3a7f25c9-9bb0-4405-8d56-7600447e3411"  
"modified":"2016-07-04T15:26:02.050Z"  
"created":"2016-07-04T15:26:02.049Z"  
"uri":"/rest/ethernet-networks/e5facce5-bfe9-4ce2-b793-f0e1d907d620"}}
```

Note: Because it is not using a REST API technique, Message Bus JSON
messages are always sent using the current API version of the appliance

### SCMB vs MSMB

As we have seen, the SCMB is used to get information about changes made
in the HPE Composable Infrastructure. It was the first bus to be exposed
by the HPE Composable Infrastructure and opened to partner consumption.
Since HPE OneView 2.0, a new bus was introduced called MSMB for Metrics
Streaming Message Bus. This bus is used to get regular value of
consumption of the different resources of the HPE Composable
Infrastructure such as dower devices, enclosures and server hardware.

SCMB Consumer applications should always select their routing key with
care and make sure that they can consume messages efficiently, and pick
them up as fast as the appliance puts them on the queues.

# Putting it all together

We have built a demo "consumer" application to browse the HPE OneView
Message Busses, so let us start it up and as a simple example, subscribe
to all Ethernet Networks changes.

![demo "consumer" application to browse the Ethernet network changes of HPE OneView Message Busses](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/messabus-3-1504810203042.png)

Then let us use the HPE OneView web console to create a new Ethernet
network:

![HPE OneView web console to create a new Ethernet network](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/messabus-4-1504810211206.png)

Back on the MessageBus Explorer, we can see that it has been notified of
that change in the HPE Composable Infrastructure and can potentially
take the necessary actions. In our case, it simply displays the details
of the messages in a list.

![displays the modified or created or updated details of the Oneview messages in a list.](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2017/9/messabus-5-1504810217256.png)

We can select to view the JSON details which displays the following
content (highlighted in red are the important fields):


```json
{"data":null  
"timestamp":"2016-07-04T15:26:02.109Z"  
"resourceUri":"/rest/ethernet-networks/e5facce5-bfe9-4ce2-b793-f0e1d907d620"  
"eTag":"3a7f25c9-9bb0-4405-8d56-7600447e3411"  
"changeType":"Created"  
"newState":"Active"  
"associatedTask":"/rest/tasks/C15F02F8-CE5E-47C9-A090-CB8CFF3F158A"  
"newSubState":null  
"userInitiatedTask":false  
"changedAttributes":null  
"resource":{"type":"ethernet-networkV2"  
"vlanId":2112  
"ethernetNetworkType":"Tagged"  
"internalVlanId":0  
"smartLink":true  
"connectionTemplateUri":"/rest/connection-templates/0a9ecfd2-bfc7-450b-b4cf-48d7bf1044f2"  
"purpose":"General"  
"privateNetwork":false  
"name":"DemoNetwork"  
"state":"Active"  
"description":null  
"status":"OK"  
"category":"ethernet-networks"  
"eTag":"3a7f25c9-9bb0-4405-8d56-7600447e3411"  
"modified":"2016-07-04T15:26:02.050Z"  
"created":"2016-07-04T15:26:02.049Z"  
"uri":"/rest/ethernet-networks/e5facce5-bfe9-4ce2-b793-f0e1d907d620"}}
```

# Summary

Message Bus is a very powerful and standard method to integrate with an
ecosystem. In the HPE Composable Infrastructure ecosystem, it provides a
very complementary approach to the existing HPE Composable
Infrastructure REST API, and allows partner applications to integrate
tighter and more efficiently with HPE Composable Infrastructure.