---
title: "DevSecOps: What it is and where it's going"
date: 2021-02-02T11:03:18.395Z
author: George Hulme
authorimage: /img/Avatar1.svg
disable: false
tags:
  - devsecops
---
**Editor’s note: This article was originally posted on HPE Enterprise.nxt on February 2, 2021** 

- - -

Experts basically agree on the definition of DevSecOps, but there isn't a full consensus on how to do it and where it is leading. 

While the practices that drive DevOps are more than a decade old, integrating security with DevOps, often termed [DevSecOps](https://resources.whitesourcesoftware.com/blog-whitesource/devsecops), remains a challenge. What does DevSecOps mean within an organization? What does successful DevSecOps look like? And can a company improve its DevSecOps practices so security can scale as the organization scales? 

Like DevOps itself, DevSecOps developed organically in the community of developers. It didn't come down as standards from on high; rather, developers shared ideas about best practices. Consequently, there isn't one agreed-upon definition of what DevSecOps is, how one implements it, and where current DevSecOps trends are going. 

A recent media panel at [the KubeCon 2020 conference](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/), comprised of technical leaders in the DevSecOps space, sought to tackle the question of how to implement DevSecOps in the enterprise, illustrating where there is and is not consensus. 

![Block Text](/img/devsecops_-what-it-is-and-where-it-s-going.png "Block text")

### DevSecOps: Building apps better for the bottom line

In defining DevSecOps, there was considerable agreement among the panelists—with some caveats. For instance, Emily Fox, DevOps security lead at the U.S. Department of Defense, said DevSecOps is about how DevOps organizations move to a security-first risk posture. What that means, she said, is building services with self-sustaining microperimeters, vetted by "trust but verify" defense-in-depth strategies and interactions with the services around them, within their workload environments.

Nicolas Chaillan, U.S. Air Force chief software officer, agreed, except for security being first. "I want to be careful with 'first,'" Chaillan said. "We don't build software just to be secured. Security needs to be baked in and security needs to be a central piece of the process, but I don't think it's first. I think it's a continuous cycle."

He added, "I certainly agree with continuous monitoring and zero trust enforcement. For us, that means behavior detection and monitoring zero trust enforcement down to the function layer—really reducing the attack surface and continuously monitoring."

According to Peter Bosch, distinguished engineer at Cisco Systems, when it comes to successful DevSecOps, security team members must be adequately integrated with development teams. As a developer "long before DevSecOps was a term," Bosch recalled being stuck writing code and then waiting for three months for a firewall rule to be opened so it could function properly. By integrating those teams, making sure the security team becomes part of the application delivery process, the speed of application development goes up and the robustness of applications increases, he said.

"You will not run into your [OWASP Top 10 security issues](https://owasp.org/www-project-top-ten/) as frequently," Bosch added. "And you will start making applications that actually contribute better to the bottom line."

Sunil James, senior director at Hewlett Packard Enterprise, also sees DevSecOps as a way to move development efforts forward securely and quickly. When done correctly, DevSecOps enables enterprises to move at "cloud speed," he said.

"The impetus for this [DevOps] movement is cloud. And cloud materially drives the cadence of our ability to deliver," James noted. "While not many organizations are delivering at the scale and the pace of a Google or a Netflix, they'd like to. They'd like to get to that point because they can then bring value to their customers faster and faster."

And that's what DevSecOps provides: In addition to a continuous way to deliver secure development and security policies deeper into the application development and operations, DevSecOps also helps "create the consistency and speed with which you can actually offer these capabilities," James said.

### DevSecOps and regulatory compliance

DevSecOps isn't just about software code security, but also about maintaining compliance with various industry and government regulations. As Fox explained, teams must contend with many different types of compliance, including legal compliance, compliance that mandates how data is handled, security policy, and control compliance. Each compliance requirement, she said, helps ensure that organizations can secure their mission, systems, applications, and datasets.

Still, "we have a lot of challenges in this space because cloud native is continually evolving and security is constantly playing catch up," Fox said. "Therefore, the security tooling to allow us to do compliance in a secure, automated, easy-to-understand fashion is still behind and leaves a lot of room for improvement."

Fortunately, better tools are on the way. For one, there is the [Open Security Controls Assessment Language (OSCAL) from NIST](https://pages.nist.gov/OSCAL/), which aims to provide a standardized and automated way to publish, implement, and assess security controls. Chaillan noted that the U.S. Department of Defense is partnering with NIST to implement OSCAL development in its environment and to help automate some of the department's security controls.

Still, the sheer size and complexity of the Defense Department's environment make it challenging. "If you try to reach a complete analysis of your stack every time you make a change, it's very difficult," Chaillan said.

However, by slicing the technology stack into layers, one can automate the mapping of [NIST Special Publication 800-53](https://nvd.nist.gov/800-53) controls with OSCAL. "I think there is something [to this approach]," he said. "Of course, it's very nascent, and there are very few tools that support OSCAL today, so we need companies to bring that capability as a tool."

### Automating security and compliance with 'policy first'

Another way to help DevOps teams succeed at integrating security more tightly into their workflow is to place security controls directly within development environments and continuous pipelines as part of a so-called policy-first initiative. As Fox explained, when developers attempt to commit a project, such in-line controls can help ensure, for example, that secrets aren't part of the package.

One of the most straightforward ways to potentially stop that from happening is with pre-commit hooks. Fox said she expects to see policies like these baked into developer tools. Such checks are then reinforced with additional tests throughout the development pipeline to ensure that workloads being deployed remain compliant.

In addition to NIST's work on the [Open Policy Agent](https://www.openpolicyagent.org/), other standards have been developed to help organizations enable a policy-first footing. One such set of standards is ]SPIFFE (Secure Production Identity Framework For Everyone) and SPIRE](https://www.hpe.com/us/en/insights/articles/zero-trust-makes-business-secure-by-default-2010.html) (a software implementation of the SPIFFE API). "It's been happening around SPIFFE and other standards," James said.


