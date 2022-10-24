---
title: SPIFFE/SPIRE graduates, enabling greater security solutions
date: 2022-10-24T18:38:25.659Z
author: HPE DEV
authorimage: /img/Avatar1.svg
thumbnailimage: /img/spiffe-spire-graduation-card-1200-x-675.jpg
disable: false
---
> Late September 2022, the Cloud Native Computing Foundation® (CNCF)[ announced the graduation of the SPIFFE and SPIRE projects](https://www.cncf.io/announcements/2022/09/20/spiffe-and-spire-projects-graduate-from-cloud-native-computing-foundation-incubator/), joining an elite group of only 18 graduated CNCF projects, like HELM and Kubernetes. Being designated a graduated project means that the project is considered stable, with enough governance processes around it, and ready to be widely deployed in production.
>
> ### 
> A Secure Production Identity Framework for Everyone
>
> SPIFFE (Secure Production Identity Framework for Everyone) is designed to work within dynamic and heterogeneous environments to provide a means to securely authenticate workloads using a Zero Trust system. These workloads could be anything from a physical or virtual node to an individual process. By providing a secure identity to every workload, it removes the need for shared secrets and provides a foundation for higher level platform-agnostic security controls.
>
> Rising from the need to better secure today’s cloud-native ecosystem, SPIFFE and SPIRE resolved a fundamental issue – a need for a standardized, cryptographic, platform-agnostic identity foundation to help secure services across heterogeneous cloud production environments. SPIFFE and SPIRE moved from the CNCF Sandbox to the Incubator in 2020, and has grown significantly since, being contributed to by many leading technology companies, including VMWare, Uber, ByteDance, Anthem, Transferwise, IBM, and Hewlett Packard Enterprise (HPE).
>
> ### 
> How HPE puts SPIFFE/SPIRE into action
>
> As a technology company, leading and influencing meaningful innovation in the Open Source community is important to us, as it provides key capabilities that our customers desire and helps us design solutions that meet their needs. SPIFFE and SPIRE are important components of enabling seamless zero trust infrastructures and have become integral parts of a number of HPE projects, including the following:
>
> #### 
> HPE Cray Exascale Super Computer Management
>
> SPIFFE/SPIRE has shown that it can scale and how it’s being used by the Cray System Management (CSM) tooling underscores that super power. HPE Cray Exascale Super Computers are big – data center-sized big - comprised of tens of thousands of compute nodes and high-performance storage. In late 2018, development work began on the Cray CSM, a solution enabling system administrators to manage these large-scale supercomputers leveraging the architecture and advances of hyper-scalers and cloud providers, based on open source code.
>
> When both Scytale and Cray were acquired by HPE in 2019, the synergies found in their technologies started the engineering groups working together. They were quickly able to identify how important and helpful SPIFFE/SPIRE could be to the CSM development effort. Given how CSM helps customers to go beyond the traditional and enable new services, deploy a broad range of workloads, and drive towards an as-a-service experience, the integration of SPIRE makes these implementations even more secure.
>
> Today, SPIRE is an integral part of CSM and running in production at facilities including [Los Alamos National Lab](https://www.hpe.com/us/en/newsroom/press-release/2021/04/us-department-of-energys-los-alamos-national-laboratory-expands-collaboration-with-hewlett-packard-enterprise-on-new-supercomputer-design-to-advance-scientific-research.html) (Lawrence Berkeley National Lab – [National Energy Research Scientific Computing Center](https://www.nersc.gov/)), [EuroHPC JU’s LUMI](https://www.hpe.com/us/en/newsroom/press-release/2020/10/hewlett-packard-enterprise-wins-160m-contract-to-power-one-of-the-worlds-fastest-supercomputers-based-in-finland-to-bolster-europes-research-in-science-and-unlock-economic-growth.html), the [Swiss National Supercomputer Center (CSCS)](https://www.hpe.com/us/en/newsroom/press-release/2021/04/swiss-national-supercomputing-centre-hewlett-packard-enterprise-and-nvidia-announce-worlds-most-powerful-ai-capable-supercomputer.html) and the [UK Met weather service](https://www.hpcwire.com/2021/04/22/microsoft-to-provide-worlds-most-powerful-weather-climate-supercomputer-for-uks-met-office/), with more coming. It is also expected to play a role in enabling federated systems interaction in various scenarios both in HPC and AI/ML operations in many HPE Cray Exascale facilities and beyond.
>
> #### 
> HPE GreenLake
>
> As our customers transition to an everything-as-a-service consumption model, they must deal with situations where applications can straddle multiple data centers, multiple clouds, 3rd party managed service providers and edge locations. A fundamental but complex problem with this digital transformation is how these physically distributed software systems can reliably authenticate to each other and securely communicate at scale, especially over untrusted networks.  
>
> As part of shared security responsibilities with our customers to ensure customers can trust to host their data on HPE GreenLake Edge-to-Cloud solutions, HPE must ensure HPE GreenLake Edge-to-Cloud Platform adheres to zero trust security best practices. HPE GreenLake Edge-to-Cloud Platform leverages SPIFFE and SPIRE to ensure all micro-services running inside the platform, and any external micro-services that the platform needs to talk to, are continuously attested and issued short-lived cryptographic identities (SPIFFE IDs) to establish secure communication with mutual TLS (mTLS) encryption. This protects the platform by eliminating long-lived secrets and minimizing any impact from credential exfiltration attacks.
>
> The SPIFFE/SPIRE cryptographic identities enable other opportunities for use with HPE GreenLake Edge-to-Cloud Platform as well. They offer a global identity foundation that could be leveraged for a broad spectrum of platform eco-system tools and services, such as a service mesh, policy framework, secrets managers, identity and access management (IAM) frameworks, and software supply chain integrity tools. By bootstrapping authentication to authorization tools, one could address the “credential zero” or “secure introduction” problem by eliminating the need for workloads to securely store the credentials needed to authenticate to the secret store.
>
> ### 
> Driving towards the best secured edge-to-platform infrastructure
>
> The examples noted above are just some of the ways HPE is using this innovative technology to provide for a better and more seamlessly secured environment.  There’s a lot more going on. Stay tuned to the [HPE Developer blog](https://developer.hpe.com/blog) to learn about different SPIFFE/SPIRE implementations and other news in this area. You might also want to check out the book, [Solving the Bottom Turtle](https://spiffe.io/book/), for interesting and detailed information about SPIFFE and SPIRE.