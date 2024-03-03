---
title: Why is Redfish® different from other REST APIs - Part 2
date: 2024-02-22T17:22:57.520Z
author: François Donzé
authorimage: /img/fdz-photoprofile.png
disable: false
tags:
  - ilo-restful-api
  - Redfish
---
<style> li { font-size: 27px; line-height: 33px; max-width: none; } </style> 

## Introduction

In <a href="https://developer.hpe.com/blog/why-is-redfish®-different-from-other-rest-apis-part-1" target="_blank">part 1</a> of this series, I presented the fundamentals of the Redfish® standard published by the Distributed Management Task Force (DMTF) consortium. This standard issued in 2015 aims to replace the aging Intelligent Platform Management Interface (<a href="https://www.intel.com/content/www/us/en/products/docs/servers/ipmi/ipmi-home.html" target="_blank">IPMI</a>) to manage the lower layers of the local server or remote servers using a modern REST-type API. The most representative fundamentals are the separation of the protocol from the data modeling, a <a href="https://developer.hpe.com/blog/getting-started-with-ilo-restful-api-redfish-api-conformance/" target="_blank">self-describing model</a> and OEM extensions. Here in part 2, you will find other unique properties contributing to the massive adoption of this "hypermedia API" by equipment manufacturers.

## Actions

Redfish® resources support the GET request to retrieve their current state. Modifications or deletions can be performed to certain resources using POST, PUT, PATCH and DELETE requests. Until then, nothing exceptional in the world of REST APIs, except perhaps, that it is possible to retrieve the exhaustive list of possible requests on a given resource, by consulting the `Allow` header of GET request responses. Refer to the <a href="https://developer.hpe.com/blog/why-is-redfish®-different-from-other-rest-apis-part-1" target="_blank">Allowed requests</a> paragraph in part 1.

However, other types of operations are difficult to model with classic HTTP requests. For example, it is impossible to "read" the server's power button to know its status! Asking for the "return to factory settings" of a storage controller may require additional parameters like the preservation (or not) of existing logical volumes.

To address these cases and others, Redfish® offers the concept of **Actions**. These are special POST requests including the operation(s) to be performed and an empty body or a body with parameters. The POST endpoint as well as the parameters and their possible values are described in an `Actions{}` object contained in the response to a GET. Figure 1 shows the retrieval of the list of possible actions on the `ComputerSystem` subsystem of a given server, as well as their description. In this specific case, it is possible to perform a single action (`#ComputerSystem.Reset`) with a parameter (`ResetType`) which can take several values.

![Computer system actions](/img/fig1-descriptionactionreset.png "Computer system actions")

Figure 1: Computer system actions

Figure 2 shows the graceful restart action of a server with its destination (target URI), its payload as well as the payload of the response (`Success`).

![System reset action](/img/fig2-resetaction.png "System reset action")

Figure 2: System reset action

The precise description of possible actions in the main body of GET responses allows Redfish® clients to carry out checks to avoid sending erroneous requests, therefore creating unwanted network traffic.

## The Redfish® event service

The Baseboard Management Controller (BMC) of modern servers communicates with almost all the server's subsystems. This privileged role allows it to be notified of events occurring in the system such as errors appearing in the memory, in the storage controllers or elsewhere. These events are stored in "log" files and SNMP traps can be triggered if the BMC has been configured beforehand.

SNMP is an aging protocol that, due to its design, can saturate a network during an event storm. The processing of events by Network Management Systems (NMS) can also constitute a bottleneck in terms of CPU load or storage. Furthermore, the security linked to SNMP is often mentioned as insufficient.

An alternative to SNMP is the Redfish® Event Service which is based on the subscription principle. The major advantage of this principle is that events are sorted at source according to subscription criteria and sent only to subscribers. Thus, the risk of network saturation is reduced. The security of these messages is based on the Transport Layer Security (TLS) protocol used by HTTPS, and which is unanimously considered as secure.

### Event model

Asynchronous events and error messages are all listed and described in registers (refer to the <a href="https://developer.hpe.com/blog/why-is-redfish®-different-from-other-rest-apis-part-1" target="_blank">first part</a> of this article for an introduction to registers). The registers collection is at the URI `/redfish/v1/Registries`. These objects (events, messages, notifications, etc.) have a common format: `RegistryPrefix.Version.Identifier`. For example, the message for restarting a server (Figure 2) is described in the `Base` registry, version `1.17` and with `Success` as identifier. For more information on this message, simply follow the link `/redfish/v1/Registries/Base` and read the description related to the identifier.

The exhaustive list of registers that can be used to subscribe to events is returned in the `RegistryPrefixes[]` array of a GET on `/redfish/v1/EventService`. Figure 3 shows an example of such a list from an HPE server. Among other things, there are registers containing messages relating to network and storage equipment.

![Enumeration of prefixes available for event subscriptions](/img/fig3-registryprefixes.png "Enumeration of prefixes available for event subscriptions")

Figure 3: Enumeration of prefixes available for event subscriptions

### How to subscribe to events ?

Subscription to events is done by a POST request to the standard URI `/redfish/v1/EventService/Subscriptions` that includes, in its body, the IP address of the listening service and the list of events to send to it.

The listening service is a web service waiting for traffic on port TCP/443 (default) and that will process the received events. The DMTF provides such a service (free of charge) on GitHub to facilitate the learning of this concept and for debugging code.

Figure 4 is an example of subscribing to events generated by storage components in an HPE server. The BMC that receives this subscription must send the events to the IP address contained in the `{{EventListener}}` variable. The `Context` property as well as the optional `HttpHeaders` can be useful to the listening system. OEM properties complement the subscription description, with easy-to-understand properties.

![Event subscription](/img/fig4-eventsubscription.png "Event subscription")

Figure 4: Event subscription

The collection of subscriptions received by the BMC can be found at the URI: `/redfish/v1/EventService/Subscriptions` (Figure 5).

![Subscription collection](/img/fig5-eventcollection.png "Subscription collection")

Figure 5: Subscription collection

The event service also allows you to easily test the subscriptions by creating an test action to `/redfish/v1/EventService/Actions/EventService.SubmitTestEvent` with, in its body, the first part of the `MessageId` property correctly populated so that the test event is sent to the correct system (Figure 6).

![Test event](/img/fig6-testevent.png "Test event")

Figure 6: Test event

## The Telemetry service

Supervising a server fleet involves retrieving indicators such as the temperature of certain components, the energy consumed by power supplies, CPUs or fans, in order to create metric reports, graphs or generate alerts. The most obvious recovery method is to locate the URI of the desired indicators and retrieve them on demand. There is an alternative to this "pull" type method: a "push" of indicators from the BMC towards subscribers. This alternative is possible thanks to the Redfish® telemetry service.

The telemetry entry point is at `/redfish/v1/TelemetryService` and has the following resources:

* **Metric Definitions:** CPU or memory bus usage, power supply consumption, etc. Each definition contains multiple properties such as the indicator type (decimal, integer, percentage), its maximum-minimum values and the URI allowing its value to be retrieved at a given time.
* **Report definitions**: For example, Figure 7 shows a report aggregating all indicators relating to the power used by the system. These definitions also indicate when to generate reports (periodically, on demand, or following a change in state or value). We also find the URI of the generated reports.
* **Definitions of triggering actions**: Depending on the value or trend (increasing or decreasing) of certain indicators, one or more actions will be triggered, such as recording in a log file, generating an event or requesting the generation of a new telemetry report.

![ Metric report definition](/img/fig7-metricreportdefinition.png " Metric report definition")

Figure 7:  Metric report definition

The model shown above is both powerful and extremely flexible. It allows you to:

* Retrieve indicators individually whenever you want.
* Retrieve telemetry reports potentially aggregating several indicators and following a customizable frequency.
* Be informed when an indicator crosses a threshold or leaves a given range following a certain trend.
* Subscribe to telemetry reports asynchronously.

The last point above is an event subscription specifying the particular `MetricReport` format, instead of the default `Event` format used in the previous section. The subscription must specify the list of reports as indicated in Figure 8.

The telemetry service offers undeniable advantages and flexibility. Unfortunately, to date, only platforms based on Intel® components implement it.

![Telemetry event subscription](/img/fig8-souscriptionrapporttelemetrie.png "Telemetry event subscription")

Figure 8: Telemetry event subscription

## Additional components integration

Additional components such as network cards and storage controllers are integrated in the  Redfish® data model transparently to Redfish® clients. The retrieval of their state, their configuration and their firmware update is done in a similar manner to the other components of the server. This is possible with the implementation in the BMC and in these components of the Platform Level Data Model (<a href="https://www.dmtf.org/sites/default/files/standards/documents/DSP0240_1.0.0.pdf" target="_blank">PLDM</a>) protocol.

PLDM, published by the DMTF, standardizes messages between the BMC and server components. Thus, add-on cards manufacturers and generic BMCs providers like <a href="https://www.openbmc.org/" target="_blank">OpenBMC</a>, no longer have to implement proprietary protocols to communicate with the different subsystems.

Figure 9 explains the communication between a Redfish® client and an add-on card. HTTPS requests sent by the client are transformed by the BMC into PLDM messages. These messages are transported by the Management Component Transport Protocol (<a href="https://www.dmtf.org/documents/pmci/mctp-base-specification-121"  target="_blank">MCTP</a>) to the component that will respond via the same communication channel. When the dialogue between the BMC and the component is finished, the BMC aggregates the received PLDM messages and responds to the client via HTTPS/JSON.

![Offload Redfish® processing to device](/img/fig9-pldm4rde.png "Offload Redfish® processing to device")

Figure 9: Offload Redfish® processing to device

### PLDM for RDE

PLDM specifications are generic and must be supplemented to satisfy specific uses such as a Redfish Device Enablement (<a href="https://developer.hpe.com/blog/overview-of-the-platform-level-data-model-for-redfish%C2%AE-device-enablement-standard/" target="_blank">RDE</a>). This <a href="https://www.dmtf.org/content/dmtf-releases-update-pldm-redfish-device-enablement-specification" target="_blank">specification</a> describes a set of specific messages allowing the BMC to communicate with additional components.

But why do I focus on hidden internal server communication protocols? To make certain consequences easier to understand:

* If the server is not powered on, the BMC, which is always powered, will not be able to communicate with the add-on components. In other words, for a Redfish client to be able to communicate with those components, they must be powered (server powered on), and must have been discovered by the BMC. It is recommended to test the <a href="https://developer.hpe.com/blog/master-the-redfish-server-states-to-improve-your-monitoring-and-manageme/" target="_blank">server state</a> before querying additional components.
* If additional component responses contain OEM extensions, they will not mention the server manufacturer, but the component manufacturer.
* Additional components generally indicate the Internet links of the schemas used because they rarely have space to store them locally. Consequently, if the Redfish client does not have access to the Internet, it will not be able to consult the schemas used by these additional cards.

### PLDM for firmware updates

PLDM also facilitates updates of additional components. The <a href="https://developer.hpe.com/blog/benefits-of-the-platform-level-data-model-for-firmware-update-standard/" target="_blank">PLDM for firmware update</a> specification, when implemented in the BMC and in additional components, allows the BMC or the BIOS (UEFI) to perform the update. Specific tools from additional component suppliers are therefore no longer necessary to "flash" the component from the operating system.

Thus, the components of a server powered on but without an operating system can be updated by a remote Redfish® client. PLDM for firmware updates constitutes real progress much appreciated by system managers and other devOps.

## Swordfish® integration

Very quickly after the publication of the first version of Redfish® in 2015, the SNIA, which develops data standards, created an extension of Redfish dedicated to storage and called Swordfish®. Figure 10 shows the headers of a response to a request on a logical volume. The Link header points to a subdirectory dedicated to Swordfish® on the DMTF site. Most storage-related schemes are developed by the Storage Networking Industry Association (<a href="https://www.snia.org/" target="_blank">SNIA</a>) and hosted by the DMTF. A great example of cooperation between standardization organizations!

![ Link to Swordfish® URL](/img/fig10-swordfishschema.png " Link to Swordfish® URL")

Figure 10:  Link to Swordfish® URL

## Security and component integrity

The majority of computer manufacturers have implemented secure production methods that guarantee all the components constituting a server do not contain viruses or other malware when leaving the factory or even when leaving the truck at final destination. Indeed, a lot can happen during intercontinental transport of electronic goods!

However, this warranty does not necessarily apply to additional components purchased on the Internet or at a local electronics store.

Installing additional cards or installing an operating system constitute potential security holes. To minimize the risks of inserting Trojan horses into servers, component suppliers embed authentication elements, kinds of signatures in the microcode, allowing their authenticity and integrity to be verified. The measurement of the integrity of a component is carried out by the BMC when the system starts. It can also be triggered during the run-time of the system. The protocol used for message exchanges between the BMC and the components is the Secure Protocol and Data Model (<a href="https://www.dmtf.org/standards/spdm" target="_blank">SPDM</a>) of the DMTF, transported by MCTP.

The operating system and BMC integrity measurements can be retrieved from the Trusted Platform Module (TPM), a highly secure physical chip located on the motherboard. When the component integrity verification process is enabled, it is possible to define a policy in case of a detected corruption during the system startup: `NoPolicy` allows the continuation of the startup or `HaltOnBoot` to halt abruptly system (Figure 11).

![SPDM configuration](/img/fig11-spdmconfiguration.png "SPDM configuration")

Figure 11: SPDM configuration

## What about the future ?

While the first part of this introduction to Redfish® focused on the architectural specifics of the API, this second part goes deeper in the server data model and its smooth integration with additional components using powerful internal communication standards helping the improvement of security and firmware update.

Overall, the Redfish® API has sufficiently solid foundations to handle future long term developments; on the protocol side, everything is stable with HTTPs and JSON. On the other hand, there are new technologies that are starting to arrive on the market and their modeling by Redfish® is in progress. I am particularly thinking of the "Compute Express Link" (<a href="https://computeexpresslink.org/" target="_blank">CXL</a>) which will change the internal architecture of the servers and which will therefore have to be modeled. The current <a href="https://www.dmtf.org/standards/wip" target="_blank">project</a> can be consulted on the DMTF website.

And so, the best is yet to come!

Don't forget to check out some of my other <a href="https://developer.hpe.com/search/?term=donze" target="_blank">blog posts</a> on the HPE Developer portal to learn more about Redfish tips and tricks.