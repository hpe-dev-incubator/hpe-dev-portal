---
title: Why is Redfish® different from other REST APIs - Part 1
date: 2024-02-19T16:20:51.657Z
author: François Donzé
authorimage: /img/fdz-photoprofile.png
thumbnailimage: ""
disable: false
tags:
  - Redfish
  - ilo-restful-api
---
<style> li { font-size: 27px; line-height: 33px; max-width: none; } </style> 
## Redfish® brief recap

Redfish® is a low-level management RESTful API standardized by the Distributed Management Task Force (<a href="https://dmtf.org" target="_blank">DMTF</a>) consortium. DMTF publishes several standards related to server management, like the Common Information Model (CIM) implemented as OpenPegasus on Linux and Windows Management Instrumentation (WMI) on Microsoft Windows.

Redfish® was first introduced in August 2015. As of today, more than <a href="https://dmtf.org/about/list" target="_blank">sixty members</a> contribute to its development: computer makers, storage and network device manufacturers and software developers. A funny story relates how "Redfish®" comes from the name of a restaurant near the Compaq drive in Houston, Texas, where initiators of the project were meeting before DMTF took over the entire project.

The main reason Redfish was introduced was to replace the Intelligent Platform Management Interface (<a href="https://www.intel.com/content/www/us/en/products/docs/servers/ipmi/ipmi-home.html" target="_blank">IMPI</a>) originally created by Intel®. In a nutshell, Redfish® is able to monitor, configure and perform actions (i.e. power-on/off) on remote (out-of-band) or local (in-band) servers. Also, it provides an event subscription mechanism that can replace the Simple Network Management Protocol (SNMP).

The adoption of this standard across the industry has been very quick and this article is an attempt to explain some of the specificities that have contributed to its success.

## Redfish® specificities

Redfish® is classified as a RESTful API as all the fundamentals are present, like a client/service model and HTTPS JSON formatted requests transferring representational states from and to identified end points. However, several specificities are unique, like the separation of the protocol and the data model and the possibility to enhance the data model with Original Equipment Manufacturer (OEM) extensions.

### Client/service architecture

The Redfish® service is included in the server management controller firmware and cannot be separated from it. In this article, I will name this controller “BMC”, for “Baseboard Management Controller”. Every modern server worthy of the name has a BMC that starts as soon as an electrical cable is plugged into a power supply. Internally, the BMC communicates with most server subsystems (BIOS, network controllers, storage, power supplies, fans, etc.). It can communicate with the operating system as well, either through a proprietary protocol or a <a href="https://www.dmtf.org/sites/default/files/standards/documents/DSP0270_1.0.0.pdf" target="_blank">host interface</a>. Externally, the BMC includes a network connector that allows it to communicate with other network services (DHCP, SMTP, SNMP, etc.). At HPE, this BMC is called “HPE iLO”, at AMI it is OpenBMC, at Dell iDRAC…

![Figure1: Client/service model](/img/fig-1-modelserviceclient.png "Figure1: Service-Client model")

Redfish® clients are numerous and varied. For development and troubleshooting, the <a href="https://www.postman.com/" target="_blank">Postman API platform</a> is very popular. For one-off actions or “quick and dirty” scripts, <a href="https://curl.se/" target="_blank">cURL</a>, PowerShell, Python or even <a href="https://github.com/HewlettPackard/python-redfish-utility/releases/latest" target="blank">HPE iLOrest</a> do the trick. For more sophisticated client programs, you can use an <a href="https://galaxy.ansible.com/ui/repo/published/hpe/ilo/" target="_blank">Ansible playbook library</a>, Chef or Go and its <a href="https://pkg.go.dev/github.com/stmcginnis/gofish/redfish" target="_blank">Go-Redfish library</a>.

Proprietary monitoring applications (i.e., <a href="https://www.hpe.com/us/en/hpe-greenlake-compute-ops-management.html" target="_blank">HPE Compute Ops Management</a>) or open source applications (<a href="https://github.com/ODIM-Project/ODIM" target="_blank">ODIM</a>, <a href="https://github.com/nsfcac/Nagios-Redfish-API-Integration" target="_blank">Nagios</a>, etc.) constitute native Redfish® clients or can become so using specific plugins.

### Remote or local management

In most cases, Redfish® clients perform <a href="https://en.wikipedia.org/wiki/Out-of-band_management" target="_blank">out-of-band management</a>. However, it is entirely possible to install the client in the OS of the server to be managed and to access the BMC via an internal path to the server (in-band-management). This path can be proprietary like HPE's CHIF (<a href="https://developer.hpe.com/blog/chif-driver-not-found/" target="_blank">Channel Interface</a>) or the <a href="https://en.wikipedia.org/wiki/Ethernet_over_USB" target="_blank">Ethernet over USB</a> protocol, which allows an IP connection between the OS and the BMC.

### Protocol and data model separation

The Redfish® protocol specification is published in DMTF document <a href="https://www.dmtf.org/dsp/DSP0266" target="_blank">DSP0266</a>, while data modeling is in <a href="https://www.dmtf.org/dsp/DSP0268" target="_blank">DSP0268</a>. This separation allows flexibility with regard to the management of version numbers. Without this separation, a minor change to the protocol specifications (e.g. adding an acronym to the glossary) would involve an increment of the overall specification version number and impose a set of unnecessary tests to requalify clients.

#### What’s inside the protocol specification?

* Boring but necessary topics like the normative framework (definitions, symbols, glossary, typographical conventions, etc.).
* Things a little more interesting like compliance with other standards (<a href="https://www.odata.org/" target="_blank">Open Data</a>, <a href="https://swagger.io/specification/" target="_blank">Swagger/OpenAPI</a>, etc.).
* We also find some very practical things like the ways to authenticate (basic authentication, session token, etc.) and the endpoints where authentication is necessary (everywhere except at the root `/redfish/v1`).
* Surprising things like receiving an "error" message for successful requests. Figure 2 shows the successful erasure of a storage logical volume (LUN) whose response contains the `error{}` object with a message explaining the success of the operation! This type of incongruous response is a consequence of compliance with the <a href="https://www.odata.org/" target="_blank">Open Data</a> standard.

![Figure 2: The error contains a success message !](/img/fig2-successerror.png "Figure 2: The error contains a success message !")

#### Data model

Responses to Redfish® requests consist of JSON packets containing key/value properties defined by the DMTF in a schema file. The name of the schema file describing responses is contained in the `@odata.type` property that must be present in each response.

For example, the schema defining the root of the Redfish® tree is `#ServiceRoot`. Its full name returned by `curl -sk https://bmc-ip/redfish/v1 | jq '."@odata.type"'` is: `#ServiceRoot.v1_13_0.ServiceRoot`. Appended to the `#ServiceRoot` fragment, a version number (`1_13_0`) and then a subtype that, in this specific case, is identical to the main schema. All schemas are publicly available on the <a href="at https://redfish.dmtf.org/schemas" target="_blank">DMTF website</a> and, are sometimes included in the service itself (see the [Self Describing Model](#self-describing-model) paragraph below). Note that schema versions can evolve independently of each other.

With a close look to the Redfish® root diagram in (Figure 3), you will notice the presence of endpoints allowing access to the modeling of the server subsystems. For example, the `Chassis{}` object points to `/redfish/v1/Chassis`, which contains the exhaustive collection of URIs (`./{ChassisId}`) modeling the different chassis constituting the server (racks, blades, enclosures, storage enclosures, etc.).

![Figure 3: source dmtf.org/education](/img/fig3-resourcemap.png "Figure 3: source dmtf.org/education")

### OEM extensions

Computer makers are able to model proprietary properties (not standardized), which constitutes added value compared to the competition. For example, HPE iLO can store firmware updates before deploying them to their respective components. This specificity is described in the proprietary schema `#HpeiLOUpdateServiceExt` present in the `Oem.Hpe{}` object under the URI `/redfish/v1/UpdateService` (Figure 4).

![Figure 4: OEM extension](/img/fig4-oemextensions.png "Figure 4: OEM extension")

OEM extensions can also be used by a manufacturer while awaiting the standardization of a functionality unanimously recognized by DMTF members.

## Resource collections

As shown in figure 3 above, links contained in the Redfish root tree, do not provide direct access to the properties of the server subsystems. Instead, they point to “resource collections”. The collection members are described by a unique schema. For example, the response to the GET `/redfish/v1/Chassis` request made against the BMC of an HPE Superdome consisting of 2 chassis in a rack, is a collection containing four members: RackGroup, Rack1, r001u03b and r001u08b (Figure 5). These four members have the `#Chassis` diagram in common.

![Figure 5: HPE Superdome chassis collection](/img/fig5-sdfchassis.png "Figure 5: HPE Superdome chassis collection")

Another example: An HPE ProLiant server containing a storage enclosure connected to a (“modern”) storage controller is represented by two members in the chassis collection; a member pointing to the chassis containing the motherboard of the server (`/redfish/v1/Chassis/1`) and a member pointing to the backplane of the storage enclosure (`/redfish/v1/Chassis/DE040000`).

Each member of the collection is an endpoint for accessing the member properties. Links to related resources constitute transversal access to other subsystems. For example, the storage chassis in Figure 6 contains a cross-link to the storage device under the "Systems" tree (`/redfish/v1/Systems/1/Storage/DE040000`).

![Figure 6: Universal backplane model](/img/fig6-storagechassis.png "Figure 6: Universal backplane model")

### Naming convention of collection members

The naming of collection members is specific to each implementation of the Redfish® service. The BMC endpoint for an HPE ProLiant is: `/redfish/v1/Managers/1`. That of an OpenBMC is: `/redfish/v1/bmc` and that of a Superdome is `/redfish/v1/Managers/RMC`. Dell, SuperMicro, Lenovo probably have their own way of naming their BMCs, while remaining compliant with the specifications.

The naming flexibility given to Redfish® services generates extra work for client developers: their code has to discover the names of collection members before being able to access their properties. If they assume a specific URI, their code will fail when used against another computer maker or after a firmware update.

## Registries

The data modeling described above don't represent resources that have inter-dependencies (i.e., BIOS attribute %1 depends of attribute %2) as well as information or error messages and their arguments (e.g.: "error on disk %s in location %s"). To address this problem, Redfish® uses "registries".

Figure 7 is extracted from a BIOS registry that has the effect of prohibiting the activation of Windows secure mode support if the server does not contain a TPM (Trusted Platform Module). It is interesting to note that the BIOS registry also describes the GUI menus (`MapToProperty=GrayOut`).

![Figure 7: Example of inter-dependency in BIOS registry](/img/fig7-registrebios.png "Figure 7: Example of inter-dependency in BIOS registry")

Figure 8 is taken from the base message registry. It shows the modeling of the “Access prohibited” message with the name of the prohibited resource as an argument (%1).

![Figure 8: Modeling an error message with an argument](/img/fig8-registredesmessagesdebase.png "Figure 8: Modeling an error message with an argument")

## Self-describing model

Redfish® is considered "self-describing" because the information regarding data modeling, operations and possible actions is documented and programmatically accessible. Client programmers no longer have to consult paper specifications before implementing them. They can transfer this task to their code in order to ensure a certain portability in time and space.

The benefits of this "hypermedia API" concept are explained in this <a href="https://developer.hpe.com/blog/getting-started-with-ilo-restful-api-redfish-api-conformance/" target="_blank">blog post</a>

### Accessing Schemas and registries

Redfish® provides access to schemas and registries through the following endpoints:

* `/redfish/v1/JsonSchemas`
* `/redfish/v1/Registries`

These URIs contain links to all schemas and registries used by the service. They point to documents stored in the BMC, if it has the storage capacity, or to the official DMTF website. In the latter case, Redfish® clients must have a means to access the Internet to download those documents. They are helpful to identify property inter-dependencies, supported values or read-write capability.

### Allowed requests

The Redfish® protocol requires GET request responses to contain the `Allow` header indicating the possible operations on the URI. Figure 9 shows that the URI `/redfish/v1/Chassis/{ChassisId}` allows GET, HEAD, and PATCH operations against this URI.

![Figure 9: Possible operations on the URI](/img/fig9-allowheader.png "Figure 9: Possible operations on the URI")

After verification, the client code can change (PATCH) the properties marked as `ReadOnly=False` in the schema. The main server chassis in Figure 9 shows the PATCH method and the `IndicatorLED` property can be modified (Figure 10), so one should be able to turn on the small blue LED on this chassis to better identify it in the data center. A good programmer will perform all of these checks before sending their changes. The bad programmer will not perform any checks and will leave the end user to deal with the error(s) returned by the service!

### Deprecated resources

Over time, certain properties are deprecated. This information is mentioned in the schemas. Thus, clients receiving a “property not found” response will be able to consult the schema and check if by chance this property has not been deprecated. This type of verification will avoid comments from the programmer like "I don’t understand, it worked before!". But before what? Figure 10 shows an excerpt from the `#Chassis` schema, version 1.22.0, stating that the `IndicatorLED` property has been deprecated in version 1.14.0.

![Figure 10: Deprecated property](/img/fig10-propertydeprecated.png "Figure 10: Deprecated property")

## What else?

The separation of protocol from data modeling, collections, OEM extensions and registries form the basis of the Redfish® standard. Access to schemas and registries as well as the list of possible operations for each URI are important features allowing the writing of portable client code in time and space.

However, Redfish® is full of other particularities, conceptual and practical, which are very interesting to study. For example the mode of communication with storage and network cards, firmware updates, or even the use of Swordfish® schemas developed by the Storage and Network Industry Association (<a href="https://www.snia.org/" target="_blank">SNIA</a>) are only a few of them. Many security aspects are also addressed by Redfish® such as the integrity of the various server components. Read the <a href="https://developer.hpe.com/blog/why-is-redfish®-different-from-other-rest-apis-part-2" target="_blank">second part</a> of this Redfish® introduction for a complete view of this standard API.

Don't forget to check out some of my other <a href="https://developer.hpe.com/search/?term=donze" target="_blank">blog posts</a> on the HPE Developer portal to learn more about Redfish tips and tricks.