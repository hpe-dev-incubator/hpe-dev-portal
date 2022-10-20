---
title: Open source contributor helps Istio integrate with SPIRE
date: 2022-10-12T15:24:29.364Z
featuredBlog: true
priority: 2
author: Dale Rensing
authorimage: /img/blog-author-rensing-96.jpg
thumbnailimage: /img/max-lambrecht-istio-with-spire-1200-x-675.jpg
tags:
  - spiffe-and-spire-projects
  - security
  - opensource
  - SPIFFE
  - SPIRE
  - Istio
---
![](/img/max-lambrecht-istio-with-spire-1200-x-675.jpg)

In this blog series, you’ll get to meet some of the open source experts working with the HPE Developer Community team. In this post, I’ll be interviewing Max Lambrecht, a software engineer working with the HPE Security Engineering team on Zero Trust Security. Max has been an open source contributor to both the SPIFFE/SPIRE and Istio projects; most importantly, enabling their integration.

## How did you get involved with open source?

I first became involved with open source in 2018 when I joined Scytale and began working on SPIFFE and SPIRE. Scytale was subsequently acquired by Hewlett Packard Enterprise (HPE) in 2020. In 2021, there were some conversations within HPE engineering about integrating Istio with SPIRE, and a new team was created to research and implement that integration. With my background in SPIFFE and SPIRE, and the experience I had with Istio, the project looked like a good fit for me and a great opportunity to contribute to open source.

## What exactly is Istio?

Istio is by far the most popular service mesh in the world. The Istio service mesh helps developers cope with the challenges of distributed or microservices architectures. It provides a dedicated infrastructure layer through which you can add capabilities, like observability, traffic management, and security, to modern microservice-based applications without adding them to your code. 

The Istio project was started by teams from Google and IBM in partnership with the Envoy teams from Lyft. It’s a huge project with many contributors, including several large companies, from around the world. In April of 2022, Istio was donated to the Cloud Native Computing Foundation, the open-source organization which SPIFFE and SPIRE are also part of. 

## Why was it so important for you to help integrate Istio with SPIRE?

Over the last four or five years, probably just after SPIRE started getting attention from the open-source community and companies started using it, there was interest in using SPIRE as the certificate provider for services running on an Istio deployment, enabling all the powerful capabilities of SPIRE for software identities within that environment. 

Service meshes are becoming more and more relevant as the Zero Trust security model gains traction and the perimeter-based model proves to be untenable in a world of hybrid clouds and increasingly complex microservices architectures. 

To this scenario, SPIRE brings strongly attested identities that are automatically delivered in heterogeneous environments. SPIRE enables multiple mechanisms to assert the identity of a machine and a service running on it. This adds a strong level of security to service meshes, as identities are key in securing communication across services. SPIFFE/SPIRE is a foundational building block of a zero-trust infrastructure.

By bringing together these two technologies, Istio, a powerful service mesh, and SPIRE, a toolchain of APIs for delivering strong identities, I was able to help provide a way to greatly increase the security posture of services deployments. 

## How did the project progress?

The project involved several different activities that ranged from understanding Istio’s complex code base to testing several approaches to achieve integration with SPIRE, and then implementing a proof of concept of the selected approach, documenting it, and presenting it to people from the Istio community (Istio users, Istio maintainers). We discussed the potential solutions during Istio maintainers' calls and received useful feedback that helped us improve the solution. Once we came to an agreement on how to do it, we proceeded by putting together a pull request to submit the implementation into Istio. It was received with very good feedback, and finally accepted and merged. It was a big achievement for the team, for HPE, and for the SPIFFE/SPIRE and Istio communities. It’s something that people in both communities had been looking forward to for years.

## What do you think the future will look like?

In my opinion, I think this will bring about a significant increase in the adoption of SPIFFE and SPIRE, as it will attract contributors to these projects, and they will continue to work on the development of tools to automate the deployment and configuration of SPIRE integrated with Istio.

And given the [recent graduation of SPIFFE and SPIRE as CNCF projects](https://www.cncf.io/announcements/2022/09/20/spiffe-and-spire-projects-graduate-from-cloud-native-computing-foundation-incubator/), I foresee many will be attracted even more to adopting these projects.

## Is there anything else you’d like to share with our readers?

The humble words of wisdom I’d like to leave with readers is this: Contribute back to the community, contribute to open source, find a project that you find interesting and/or one that can be useful to others. Look for tasks that you can take on and engage with the project’s community in Slack. You’ll grow as a professional, you’ll grow your network, you’ll grow your skills, and ultimately feel a huge sense of accomplishment. Sometimes you’ll have to overcome impostor syndrome. We all experience it from time to time. But that’s a good sign... it means that you are getting involved in things that can make you grow and learn.