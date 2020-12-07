---
title: "Introducing HPE Storage Container Orchestrator Documentation"
date: 2020-04-20T19:56:01.345Z
author: Michael Mattsson 
tags: ["hpe-nimble-storage","hpe-3par-and-primera","hpe-cloud-volumes"]
path: introducing-hpe-storage-container-orchestrator-documentation
---
Writing intuitive, end-user facing documentation for complex systems that is easy to navigate and consume is not a simple task.  The Hewlett Packard Enterprise (HPE) storage team picked up the responsibility of consolidating all documentation pertaining to Kubernetes and Docker integration with HPE storage solutions under one umbrella. [HPE Storage Container Orchestrator Documentation](https://scod.hpedev.io), or SCOD for short, is a documentation portal that is now officially available to customers and partners interested in HPE persistent storage solutions that they can integrate with their Kubernetes or Docker projects. Let's explore the toolchain that makes writing documentation effortless and beautiful!

# Lean and modern tooling
SCOD stores all the documentation source files in markdown on GitHub. When a pull request is merged to the master branch (after a careful review), the documentation portal is automatically rebuilt using a GitHub Action. The site itself is hosted by GitHub and uses GitHub Pages to serve the content. MkDocs is the rendering engine used for SCOD. Its theme is based on the widely popular [readthedocs.io](https://docs.readthedocs.io) look and feel, augmented with some HPE DEV flair.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/3/screen-shot-2020-04-17-at-100820-am-1587412198284.png)

The unique advantage of using MkDocs is that a tech writer may render the entire project locally and immediately observe what the content would look like in the final product. The tech writer may also use their favorite text editing tool as long as it doesn’t add any hidden formatting.  This gives both writers and reviewers a very lean and efficient way to publish documentation without obstacles and impediments posed by dinosaur tools and error prone review processes. It’s single source, single output and provides a shared view in GitHub to review each other’s branches and carefully track changes.

# Full steam ahead!
It’s difficult to estimate how far a system built using the SCOD toolchain would scale, but for single project documentation it’s a very efficient process with minimal overhead and gets everything out of the way for tech writers to simply do what they’re supposed to do – write and review documentation! Expect a flurry up of updates in the coming months. HPE looks forward to helping you learn more about the HPE storage integrations with Kubernetes and Docker through SCOD.

Would you like to know more?

* Learn about [GitHub Pages](https://pages.github.com/)
* Deploy MkDocs [GitHub Action](https://github.com/marketplace/actions/deploy-mkdocs)
* Build your own site with [MkDocs](https://www.mkdocs.org)
* Checkout the [complete cookbook](https://datamattsson.tumblr.com/post/612351271067893760/the-perfect-documentation-storm) for SCOD
* Visit [SCOD](https://scod.hpedev.io)!