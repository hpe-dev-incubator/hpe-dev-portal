---
title: SPIRE Maintainer, Agustín Martínez Fayó, Reveals His Passion for
  Information Security
date: 2021-03-02T14:43:49.508Z
featuredBlog: false
priority: null
author: Dale Rensing
authorimage: /img/blogs/Avatar6.svg
thumbnailimage: null
tags:
  - security
  - opensource
  - SPIRE
  - SPIFFE
---
![agustin martinez fayo](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/agustin-martinez-fayo-1614696396460.PNG)

As a leading global, **edge-to-cloud platform-as-a-service company**, Hewlett Packard Enterprise (HPE) prides itself in employing team members who share one common purpose: to advance the way people live and work. In this blog series, you’ll get to meet a number of them as I interview some of the [open source](https://www.hpe.com/us/en/open-source.html) experts on our team.

Agustín Martínez Fayó is a principal engineer for SPIRE, the [Cloud Native Computing Foundation's](https://www.cncf.io/) (CNCF) open source project that provides the ability to securely identify software systems in dynamic and heterogeneous environments. He’s a graduate of the Universidad Tecnológica Nacional in Information Systems Engineering and comes to HPE through its recent acquisition of Scytale where he helped to design and implement solutions to connect cloud and container-based services with on-premises services, extending existing identity providers to the cloud. Previously in his career, he worked on the development of database vulnerability assessment software.

## Can you tell me a little about the SPIRE project and why it’s special?   
[SPIRE](https://www.hpe.com/us/en/software/spiffe-spire-open-source.html#:~:text=SPIRE%20is%20an%20open%2Dsource,a%20wide%20variety%20of%20environments.&text=The%20open%2Dsource%20SPIFFE%20and,between%20multiple%20clouds%20and%20clusters.) is an open source project hosted by the Cloud Native Computing Foundation (CNCF). It implements the [SPIFFE](https://spiffe.io/) (Secure Production Identity Framework for Everyone) standard to securely identify software systems in dynamic and heterogeneous environments. It does so through the use of platform-agnostic cryptographic identities in an automated way. In essence, SPIRE exposes the SPIFFE Workload API, which can attest running software systems and issue SPIFFE IDs and SVIDs to them. This allows two workloads to establish trust between each other.


Both SPIFFE and SPIRE were [recently accepted into the CNCF Incubator](https://www.infoq.com/news/2020/06/spire-identity-framework/) to provide a standard and tooling for establishing trust between software services without necessarily using secrets or network-based security controls. The projects enable organizations to deploy consistent, fine-grained cross-service authentication via a “dial-tone” API across heterogeneous environments. Similar to being able to just pick up a phone and connect with anyone because the system just knows how to do it, the Workload API offers a standard way for authentication when connecting with other workloads, no matter where they are or the infrastructure on which they are running. This enables zero trust architectures by delivering continuously attested service identity across cloud, container, and on-premise enterprise IT infrastructures.


## How did you get involved with SPIFFE/SPIRE?
I tend to be pretty passionate about information security. As I was off looking for new challenges, the SPIFFE project was just getting started. Being able to contribute to SPIFFE and SPIRE right from the start looked like the perfect opportunity to engage with a community of security experts and be able to contribute to the development of software that would really help improve the security posture across organizations.
## What are some of the things you’d like to work on in regards to this project?
Continuing to maintain the SPIRE project is important to me. There are a lot of ongoing efforts and proposals to enhance and extend the SPIRE capabilities that will help make it a suitable solution in more environments and use cases. As a maintainer of the project, I would like to help drive those efforts. It's great to have the opportunity to contribute to the growth and adoption of these projects.

## Is there anything else you’d like to share with our readers? 
Yes, actually. If you’re interested in learning more about SPIFFE, the standard for service identity, and SPIRE, the reference implementation for SPIFFE, you might want to check out the book [*Solving the Bottom Turtle*](https://spiffe.io/book/). The book distills the experience of renowned security experts to provide a deep understanding of the identity problem and how to solve it. I think you’ll find it very informative and interesting.


To learn more about the open source projects that HPE is involved with, please visit our [website](https://www.hpe.com/us/en/open-source.html). Interested in exploring what HPE offers for developers and data scientists? Check out our [HPE DEV site](https://developer.hpe.com/) for a ton of articles, workshops, tutorials, and other resources.

