---
title: Introduction to Redfish Interoperability Profiles
date: 2024-07-03T10:58:04.215Z
author: François Donzé
authorimage: /img/fdz-photoprofile.png
disable: false
tags:
  - Redfish
  - ilo-restful-api
---
<style> li { font-size: 27px; line-height: 35px; max-width: none; } </style>

<style> figcaption {font-style: italic; font-size: 15px; line-height: 33px; max-width: none;} </style>

## Introduction

When I explain to an audience that the <a href="https://redfish.dmtf.org" target="_blank">Redfish® standard</a>
requires the implementation of only a subset of the properties mentioned in the entire <a href="https://developer.hpe.com/blog/why-is-redfish%C2%AE-different-from-other-rest-apis-part-1/#data-model" target="_blank">data model</a>, I can see people looking at me with big eyes and this question in mind:

"*What ? potentially, some BMCs in my data center do not implement the `FirmwareVersion` property and they are considered as compliant to the standard?*".

The answer is "*yes*"; Redfish services not implementing properties not labeled "required" are compliant.

This blog post elaborates the above statement and provides use cases where it can be a problem. Then it introduces the <a href="https://www.dmtf.org/dsp/DSP0272" target="_blank"> Redfish Interoperability Profiles Specification</a> that has been created by the Distributed Management Task Force (<a href="https://dmtf.org" target="_blank">DMTF</a>) to address those use cases.

The Redfish Interoperability Profiles specification constitutes another Redfish specificity that could be added to the list presented in <a href="https://developer.hpe.com/blog/why-is-redfish%C2%AE-different-from-other-rest-apis-part-1/" target="_blank">part 1</a> and <a href="https://developer.hpe.com/blog/why-is-redfish%C2%AE-different-from-other-rest-apis-part-2/" target="_blank">part 2</a> of the *Why is Redfish different from other REST APIs* blog posts.

### Redfish services can omit defined properties

The DSP0266 standard document states in its <a href="https://www.dmtf.org/sites/default/files/standards/documents/DSP0266_1.20.1.html#properties" target="_blank">Properties overview</a> paragraph:

* *Required properties shall always be returned in a response.*

![Figure 1: DMTF Properties overview paragraph from DSP0266](/img/fig1-dmtfpropertiesoverview.png "Figure 1: DMTF Properties overview paragraph from DSP0266")

<figcaption>Figure 1: DMTF Properties overview paragraph from DSP0266</figcaption>

This assertion suggests that some properties are not "required" in the implementation of the service. As an example, in the data model of the <a href="https://redfish.dmtf.org/schemas/v1/Manager.v1_19_1.json" target="_blank">Baseboard Manager Controller</a> (BMC) (Figure 2), the only required properties are: `@odata.id`, `@odata.type`, `Id` and `Name`. Since the `FirmwareVersion` property is not listed in this normative document, its implementation is not required in Redfish services.

![Manager required properties](/img/fig2-managerrequiredproperties.png "Manager required properties")

<figcaption>Figure 2: Manager required properties</figcaption>

Requiring the implementation of only a small number properties *provide\[s] significant flexibility, and allow conforming implementations on a wide variety of products* as mentioned in the abstract of the <a href="https://www.dmtf.org/sites/default/files/standards/documents/DSP0272_1.8.0.pdf" target="_blank">standard document</a>

### Who cares?

Flexibility is great, but too much flexibility can be a problem for standard organizations, sofware projects or end users willing to move from the Intelligent Platform Management Interface (<a href="https://www.intel.com/content/www/us/en/products/docs/servers/ipmi/ipmi-home.html" target="_blank">IPMI</a>) to Redfish for hardware management.

Concerning standard organizations and software projects, the <a href="https://www.opencompute.org/about" target="_blank">Open Compute Project®</a> (OCP) and the <a href="https://wiki.openstack.org/wiki/Main_Page" target="_blank">OpenStack</a> projects can only adopt Redfish as their preferred management technique if they can easily define some sort of "baseline" containing which property must, should or could be implemented in their managed nodes.

Concerning OCP, the charter of the <a href="https://www.opencompute.org/projects/hardware-management" target="_blank">Hardware Management Project</a> mentions: "*The hardware management specification incorporates \[...] tools and best practices \[...] for remote machine management*". This means that any server compliant to this specification must implement the network protocol(s) mentioned in the baseline.

Systems eligible by the OpenStack <a href="https://wiki.openstack.org/wiki/Ironic" target="_blank">Ironic</a> (bare metal machine provisioning) and the <a href="https://wiki.openstack.org/wiki/Valence" target="_blank">Valence</a> projects (system lifecycle management) must implement as well a baseline of features containing at least the possibility to be started or stopped from remote.

Redfish clients designed for managing multi-vendor systems have also a need for a list of mandatory and recommended features. For example, if a system cannot return the firmware version of its BMC, the client will have difficulties to perform firmware updates.

## Redfish Interoperability Profiles

To address the baseline issue mentioned above, the DMTF created the
<a href="https://www.dmtf.org/dsp/DSP0272" target="_blank">DSP0272</a> specification document that defines Interoperability Profiles. A Redfish Interoperability Profile (or Profile) is a JSON document enumarating resources and properties that must, should or could be implemented in a Redfish service.

### Didactic minimal Profile example

The following example is a minimal profile created for didactic purpose. It is not relevant for use in a real life context.

A summary of this example could be the following: "To be compliant to this Profile, Redfish services must model at least one manager (BMC) and must be able to return the manager's `FirmwareVersion` value".

> NOTE: The content of Interoperability Profiles is described in a versioned schema file. All the Profile versioned schema files are grouped in compressed bundles (`.zip`) and can be <a href="https://www.dmtf.org/dsp/DSP8013" target="_blank">downloaded from the DMTF</a>. The following example is compliant with version 1.8.0 as specified in the `SchemaDefinition` key of the following example (first line).

```json
{
    "SchemaDefinition": "RedfishInteroperabilityProfile.v1_8_0",
    "ProfileName": "FDZ's minimal profile",
    "ProfileVersion": "1.0.0",
    "Purpose": "This is a minimal educational Redfish interoperability profile.",
    "OwningEntity": "Koulapic",
    "ContributedBy": "FDZ",
    "License": "CC BY-SA",
    "ContactInfo": "fdz@koulapic.com",
    "Protocol": {
        "MinVersion": "1.6"
    },
    "Resources": {
        "ManagerCollection": {
            "Purpose": "Every implementation must have at least one BMC.",
            "PropertyRequirements": {
                "Members": {
                    "MinCount": 1
                }
            }
        },
        "Manager": {
            "Purpose": "Make sure Manager is conformant to schema 1.5.1 or later and implements the `FirmwareVersion` property",
            "MinVersion": "1.5.1",
            "PropertyRequirements": {
                "FirmwareVersion": {
                    "ReadRequirement": "Mandatory"
                }
            }
        }
    }
}
```

Profiles contain administrative "self explanatory" keys like `ProfileName`, `ContactInfo`, or `Purpose`. The normative definition of those properties is in the schema mentioned in the above note. For this example I extracted in the next JSON block, the descripion of the `Protocol/MinVersion` property, which mentions that it is to be compared to the `ServiceRoot/RedfishVersion` of the evaluated Redfish service.

```json
{
        "Protocol": {
            "type": "object",
            "description": "Requirements related to the Redfish protocol outside of the JSON resources.",
            "additionalProperties": false,
            "properties": {
                "MinVersion": {
                    "$ref": "#/definitions/MinVersion",
                    "description": "Indicates the minimum version of the Redfish Specification protocol support required by this profile.  This version shall be reported by the Redfish service in the `ServiceRoot` resource property `RedfishVersion`.  The version shall be represented using a `<major>.<minor>.<errata>` format, including an optional errata version.  If this property is absent, the minimum value shall be `1.0.0`."
                }
            }
        }
}
```

The `Resources{}` object of the above Profile contains two members: `ManagerCollection{}` and `Manager{}`. The first one requires at least one BMC modeled in the evaluated Redfish service (`MinCount = 1`). The second requires the implementation of the `Manager/FirmwareVersion` (`ReadRequirement = Mandatory`).

The other possible values for the `ReadRequirement` property are listed and described in the Profile schema and I pasted them in the following JSON block. It is interesting to notice that, in addition to obvious values like `Mandatory` or `Recommended`, others (i.e. `Conditional`, `IfImplemented`) need more attention.

```json
{
        "ReadRequirement": {
            "type": "string",
            "description": "The read (HTTP GET) requirements for this property.  The default value, or if `ReadRequirement` is not present, is `Mandatory`.  For object properties, requirements of the embedded properties will apply only if the object is present.",
            "enum": [
                "Mandatory", "Supported", "Recommended", "IfImplemented", "IfPopulated", "Conditional", "None"
            ],
            "enumDescriptions": {
                "Mandatory": "This property is required in all instances of this resource.  For array properties, the property is required in all non-null array items.  If `Values` is defined, at least one instance of each enumeration value is required among instances of this property.",
                "Supported": "This property is required to be supported by the service, but may not appear in all instances of this resource.  The requirement is met if the property appears in at least one instance of this resource.",
                "Recommended": "It is recommended, but not required, that this property be supported.",
                "IfImplemented": "This property is required if the underlying functionality is implemented.  For object properties, requirements on embedded properties within the object will only apply if the object is present.",
                "IfPopulated": "For property-level requirements, this property is required if the `State` property within the `Status` object for the object or resource does not contain `Absent`.  This value is useful for properties within absent resources where empty slots, sockets, or bays are rendered with minimal properties until they are populated by a device.  For resource-level requirements, this value indicates that the resource is required, but may not be present (populated) in the service at all times.",
                "Conditional": "This property is only required if `ConditionalRequirements` items apply to this instance of the resource.",
                "None": "This property is not required by this profile.  It is listed here for clarity."
            }
        }
}
```

### Stacking Profiles

An interesting feature of Redfish Interoperability Profiles is that you can extend at will existing Profiles with your own definitions; to create a Profile that extends the <a href="https://github.com/openstack/ironic/tree/master/redfish-interop-profiles" target="_blank">Ironic Profile</a>, just use the `RequiredProfile{}` object as shown in the next example.

This example specifies the URL and minimum version of the Ironic Profile and yours.

```json
    "RequiredProfiles": {
        "Ironic": {
            "Repository": "https://github.com/openstack/ironic/tree/master/redfish-interop-profiles",
            "MinVersion": "1.0.0"
        },
        "MyRequiredProfile": {
                "Repository": "https://koulapic.com/MyInteropProfiles",
                "MinVersion": "1.0.0"
        }
    }
```

Now that you understand the basic architecture of Redfish Interoperability Profiles I encourage you to study the <a href="https://github.com/opencomputeproject/HWMgmt-OCP-Profiles" target="_blank">OCP</a> and OpenStack public <a href="https://github.com/openstack/ironic/tree/master/redfish-interop-profiles" target="_blank">Profiles</a>. Don't forget to refer to the <a href="https://www.dmtf.org/dsp/DSP8013" target="_blank">Profile schemas</a> in case you have problem understanding some properties, directives or objects.

## How to validate Profiles?

Profile conformance can be easily performed with the <a href="https://github.com/DMTF/Redfish-Interop-Validator" target="_blank">Interoperability Validator</a> provided by the DMTF. It is a Python script that takes as input a configuration file and a Profile. The main output is an HTML report.

The following code block clones the Validator GitHub repository and asks to create a configuration file and a Profile. Then it launches the Validator with those two files as input.

```shell
git clone https://github.com/DMTF/Redfish-Interop-Validator.git
cd Redfish-Interop-Validator
# Create configuration file and profile
python RedfishInteropValidator.py -c config/ilo-scott380g11-1.ini FdzMiniProfile.v1_0_0.json
```

The Profile used in the above code example is the minimal Profile mentioned [earlier](#didactic-minimal-profile-example). This profile requests at least one manager in the manager <a href="https://servermanagementportal.ext.hpe.com/docs/concepts/datatypesandcollections/#resource-collections" target="_blank">collection</a> and a `FirmwareVersion` property in the `Manager` resource. To be sure the Validator verifies those requirements, the configuration file (next code block) specifies `payload = tree /redfish/v1/Managers`. This line tells the Validator to verify the Profile directives at `/redfish/v1/Managers` and then follow recursively each and every link it finds and process them. The exact crawling algorithm is explained in the <a href="https://github.com/DMTF/Redfish-Interop-Validator/blob/main/README.md" target="_blank">Validator GitHub README.md</a> file. In addition to t

```shell
# Profile Validator configuration file.
#
# Parameter description at:
# https://github.com/DMTF/Redfish-Interop-Validator/blob/main/README.md 

[Tool]
Version = 2
Copyright = Redfish DMTF (c) 2021
verbose =

[Host]
ip = https://ilo-scott380g11-1
username = username
password = password
description = iLO 6
forceauth = False
authtype = Session
token =

[Validator]
# The following `tree` keyword tells the Validator
# to crawl the Redfish tree starting at the following
# starting point.
#
# An alternative is `single` to only validate the
# starting point.
payload =  tree /redfish/v1/Managers
logdir = ./logs
oemcheck = False
online_profiles = False
required_profiles_dir = 
debugging = False
collectionlimit =
```

The Validator outputs two files in the directory specified in the configuration file (`logdir`): a report in HTML format and a text file containing the different steps of the validation process.

Figure 3 below is a portion of the Validator report showing three successful verifications. The first one (`Service level requirements`) requires the existence of the `ManagerCollection` and `Manager` end points. It has been automatically added by the Validator as a mandatory condition before proceeding the verification of the other requirements mentioned in the Profile.

You can view as well on this figure the results of the two verifications required in the Profile.

![Figure 3: Redfish conformance test report](/img/fig3-conformancetestreport.png "Redfish conformance test report")

<figcaption>Figure 3: Redfish conformance test report</figcaption>

## Leveraging Redfish Interoperability Profiles

Although present for a long time (January 2018) and despite an introduction <a href="https://www.youtube.com/watch?v=iVAYSEPwmV8" target="_blank">video</a>, the Redfish Interoperability Profile specification is not very well known and it could be better leveraged by Redfish client programmers supervising heterogeneous data centers; this standard along with the Interoperability Validator highlight the differences between Redfish implementations and can help them to fast produce a more efficient code. If you already know a property is absent in a Redfish service, you can anticipate adapt your code early in the development process. 

Then, Interoperability Profiles could also be leveraged by the purchasing departments of large organizations with several computer suppliers. By including such Profiles in their Requests for Proposal (RFPs) documents, they could make sure that the computers they purchase have a common baseline in terms of management features. Having a clear knowledge of such baseline is TBD

One important drawback of IPMI was that there were as many standard as computer makers. Not leveraging Redfish Interoperability Profiles and its companion Validator may lead to the same problem. 



Don't forget to check out some of my other <a href="https://developer.hpe.com/search/?term=donze" target="_blank">blog posts</a> on the HPE Developer portal to learn more about Redfish tips and tricks.