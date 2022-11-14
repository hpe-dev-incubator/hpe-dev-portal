---
title: Galadriel - A SPIRE Federation Alternative
date: 2022-10-31T19:57:46.505Z
priority: 0
author: WILLIAM E BARRERA FUENTES
authorimage: /img/Avatar1.svg
disable: false
tags:
  - SPIRE
  - SPIFFE
  - spiffe-and-spire-projects
---

SPIRE (SPIFFE Runtime Environment) provides a workload identity management solution that allows organizations to establish attestable and verifiable mTLS (Mutual Transport Layer Security) connections among services. These capabilities support the concept of explicit trust beyond the perimeters of cloud providers or data centers. Its platform-agnostic and pluggable architecture gives organizations the flexibility to orchestrate services based on zero trust principles in highly heterogeneous environments. 

SPIRE provides functionality to federate with other entities following the SPIFFE(Secure Production Identity Framework for Everyone) federation specification. It allows workloads to authenticate to peer SPIRE systems on a separate node or environment that may be governed by the same organization or a separate organization. The SPIFFE community and SPIRE users have identified the need to have a scalable alternative to the current federation method. It is difficult to set up and maintain SPIRE federation in large, heterogeneous SPIRE deployments due to the numerous steps involved and issues with keeping the configuration up to date. Galadriel is an alternative approach to SPIRE federation that allows large SPIRE federation deployments to be sustainable, scalable, and secure. Galadriel offers SPIRE users a flexible, multi-tenant, and API driven solution that gets them a step closer to explicit trust. 

## SPIRE concepts

In SPIRE, a trust domain is a discrete zone in which workloads can mutually authenticate each other without the need to set up SPIRE federation. A trust domain typically corresponds to a distinct computing environment, administrative department, or similar division.

SPIRE attests identities by using properties of the cloud provider or on-premises equipment.  In both cases, it maintains a set of key-pairs that represent the trust domain and its boundaries. While the private keys are kept secure, the public keys are published in files called “trust bundles,” which are necessary for validating the X.509 certificates or JWTs (JSON Web Token) that are used to establish secure communications. 

### How does the current SPIRE federation work?

Let’s assume that two SPIRE Servers (A and B) of two different trust domains will enter in a federated relationship. Thus, they will access each other's trust bundles to validate certificates for mTLS connections among workloads that cross trust domains. To configure the trust bundle exchange, the following must occur. 

First, SPIRE Server A exposes its trust bundle via an end-point API. This end-point is accessed by SPIFFE federation counterparts (SPIRE B) and configured in the SPIRE Server A’s configuration file. SPIRE Server B exposes its trust bundle in the same manner. 

Second, each SPIRE server must be configured to retrieve trust bundles from each other. SPIRE Server A “maps” SPIRE Server B’s federation end-point and defines a federated relationship with that server (this can be done via the federation API or via the server’s configuration file). SPIRE Server B sets the same configuration for A. 

Third, federation is bootstrapped in Servers A and B and both must be enabled to fetch trust bundles. They must authenticate the SPIFFE identity of each other to initiate the exchange. 

Fourth, registration entries are created in both servers defining which workloads are federated, so they can establish mTLS across trust domains. 

### Challenges with current SPIRE federation 

Even though SPIRE allows the management of federation configurations dynamically via an API, there are several limitations to the current SPIRE approach that do not allow for large federation use cases. 

First, existing SPIRE federation options require a secure, public endpoint to serve the federation data, either through Web PKI (leveraging publicly trusted certificate authorities) or SPIFFE authentication. This entails a substantial administrative hassle and, in some cases, may be impossible, such as for on-premises use cases due to the security issue of exposing a public endpoint. 

Second, federating many-to-many relationships requires manual creation of federation entries. For example, federating five trust domains to each other requires 20 administrator actions (each domain needs four new configuration changes to federate with the four others). More administrator actions are required when trust points change URLs or relationships change. 

A third limitation relates to the lifecycle and auditing of federated relationships. SPIRE does not provide a mechanism to manage and track the lifecycle of federated relationships. Current techniques rely solely on manual configuration changes, and do not allow for observability of trust bundle exchange.  

## Enter Galadriel

Galadriel is a new open source effort initiated by HPE that extends the existing federation authorization techniques from SPIRE by centralizing the management and exchange of trust bundles. It collects trust bundles from SPIRE Servers, routes them, and presents them to other SPIRE Servers and cloud resources. Galadriel aspires to provide an all-in-one solution for managing and auditing external relationships for SPIRE implementations. 

Galadriel introduces two main components: a server and harvester. These components facilitate the exchange of SPIRE-generated trust bundles among multiple SPIRE Servers. The exchange is enforced via relationship rules established at the Galadriel server level, and the harvesters transfer bundles to and from SPIRE Servers via a central hub. All relationships are mutually consented to and trust bundles are validated before being consumed. The harvester takes a “proxy” role and serves as a middle layer for the configuration of the federation in SPIRE and the trust bundle exchange.

This new federation approach removes the need to have a public end-point configured in the SPIRE Server, streamlines the steps to establish federation, and creates the visibility and maintainability needed to manage federation at scale. 

An initial release of Galadriel is planned for the first half of 2023. For more detailed design information about Galadriel, check out the design proposal [RFC - SPIFFE/SPIRE Federation](https://docs.google.com/document/d/1nkiJV4PAV8Wx1oNvx4CT3IDtDRvUFSL8/edit?usp=sharing&ouid=104807789400318304424&rtpof=true&sd=true)  presented to the SPIRE community. 

To know more about HPE's contributions to SPIFFE and SPIRE, visit the [HPE - SPIFFE/SPIRE](https://developer.hpe.com/platform/spiffe-and-spire-projects/home) website. 


