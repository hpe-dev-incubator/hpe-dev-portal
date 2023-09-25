---
title: "GitOps: The next step in cloud-native development "
date: 2023-09-25T15:37:56.853Z
author: "Steven Vaughan-Nichols "
authorimage: /img/Avatar1.svg
disable: false
---
#### Editor’s note: This article was originally posted on HPE Enterprise.nxt on June 2, 2021 

What do you get when you combine DevOps management and the Git distributed version control system? Say hello to GitOps. 

Automation makes software better and more reliable. GitOps takes automation a step further and merges it with deployment. 

[DevOps](https://www.hpe.com/us/en/insights/articles/devops-lessons-in-software-infrastructure-and-business-success-1702.html), in which system administrators work hand-in-hand with developers, can speed up software development and operational deployments from months to days. At the same time, we use [Kubernetes](https://www.hpe.com/us/en/insights/articles/devops-lessons-in-software-infrastructure-and-business-success-1702.html) to orchestrate containers over clouds to speed up software development and operational deployments. 

Ultimately, both approaches lend themselves to [continuous Integration/continuous delivery (CI/CD](https://www.hpe.com/us/en/insights/articles/continuous-integration-and-delivery-tool-basics-1807.html)). Wouldn't it be great, thought [Weaveworks ](https://www.weave.works/%22%20/t%20%22_blank)CEO Alexis Richardson, if we could combine these approaches and use the [Git distributed version control system as the ultimate source of truth](https://www.weave.works/blog/gitops-git-push-all-the-things%22%20/t%20%22_blank)? So, when there's a dispute over the correct state of the site, people know where to go for the correct version. 

It turns out Richardson was on to something. Cornelia Davis, Weaveworks' CTO, recently said, "[I believe that GitOps is the model that will dominate operations](https://www.itprotoday.com/development-techniques-and-management/why-gitops-model-future-devops). … I think, five years from now, everybody will be doing some level of GitOps." 

Why? Because GitOps is a set of practices that enables you to manage and deploy highly distributed software that's constantly changing without breaking a sweat. 

Now if just a single vendor was promoting its approach, you might be wise to be skeptical. But it's not just Weaveworks. Priyanka Sharma, general manager at the [Cloud Native Computing Foundation (CNCF)](https://www.cncf.io/), believes GitOps is becoming to Kubernetes what Git already is to Linux: the fundamental building tool for the next generation of [cloud-native computing](https://www.hpe.com/us/en/insights/articles/how-to-implement-cloud-native-computing-with-kubernetes-1710.html).

GitOps is designed for and, as it now stands, really applicable to just orchestrated cloud-native applications. 

"GitOps is basically utilizing the Git workflows that every developer is used to. "

###### PRIYANKA SHARMA GENERAL MANAGER OF THE CLOUD NATIVE COMPUTING FOUNDATION 

## So what is GitOps today? 

Officially, Weaveworks defines GitOps as "a way to do Kubernetes cluster management and application delivery. [GitOps works by using Git as a single source of truth for declarative infrastructure and applications](https://www.weave.works/technologies/gitops/%22%20/t%20%22_blank). With GitOps, the use of software agents can alert on any divergence between Git with what's running in a cluster, and if there's a difference, Kubernetes reconcilers automatically update or roll back the cluster depending on the case. With Git at the center of your delivery pipelines, developers use familiar tools to make pull requests, to accelerate and simplify both application deployments and operations tasks to Kubernetes." 

Superficially, GitOps is quite simple. GitOps uses a version control system, Git, to house all information, documentation, and code for a Kubernetes deployment. Kubernetes then automatically deploys changes to the cluster. 

Of course, simple concepts are always more complex in reality. Let's look at the fundamentals. 

### 1) Everything that can be described must be stored in Git. 

By using Git as the source of truth, it is possible to observe your cluster and compare it with the desired state. The goal is to describe everything: policies, code, configuration, and even monitored events and version control. Keeping everything under version control enforces convergence where changes can be reapplied if at first they didn't succeed. 

These descriptions of the entire system are described declaratively in [YAML](https://yaml.org/). This is a human-readable data serialization language. YAML is commonly used for configuration files and data storage and transmission. 

If this sounds a lot like DevOps, you're right, it does. For example, [Ansible](https://www.ansible.com/%22%20/t%20%22_blank), [Azure Pipelines](https://azure.microsoft.com/en-us/services/devops/pipelines/), [Salt](https://saltproject.io/), and [Puppet](https://puppet.com/) all use YAML. No matter the program, the idea is the same: Use declarations written in YAML to control operations. This approach is also known as [infrastructure as code](https://stackify.com/what-is-infrastructure-as-code-how-it-works-best-practices-tutorials/) (IAC). 

Within GitHub YAML files, you find not instructions like "Start 10 MySQL servers" but declarations—for instance, "There are 10 MySQL servers. These are their names." 

The bottom line is to take fundamental DevOps and IAC concepts and move them to the cloud-native world. 

### 2) Use a Kubernetes controller that follows an operator pattern 

With a Kubernetes controller that follows the operator pattern, your cluster is always in sync with your Git repository, the source of truth. Since the desired state of your cluster is kept in Git YAML files, you can easily spot differences between your Git files and the running cluster. 

For GitOps, the most popular controller is the open source program [Flux](https://fluxcd.io/). This is a collection of tools for keeping Kubernetes clusters in sync with YAML files in Git repositories and automating configuration updates when there's new code to deploy. Indeed, although Flux's code is changing rapidly, [Flux has already been recommended by the CNCF for adoption](https://radar.cncf.io/2020-06-continuous-delivery) by CD users. 

With Flux, you can describe everything about the entire desired state of your system in Git. This includes apps, configuration, dashboards, monitoring, and everything else. 

This means everything—and I mean everything—is controlled through pull requests. There's no learning curve for new programmers; they just use the Git commands they already know. If there's a production issue, it's fixed via a pull request instead of manually changing the running system. As a big side benefit, your Git history automatically provides a log of transactions, enabling you to recover your system state from any snapshot. 

Flux also uses [Kubernetes Custom Resources](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/), object state reports, and via Kubernetes Events, integration with [Kubernetes role-based access control (RBAC)](https://kubernetes.io/docs/reference/access-authn-authz/rbac/), making it declaratively configurable. 

The next version, Flux v2, is being built from the ground up to use Kubernetes' API extension system and to integrate with [Prometheus](https://prometheus.io/) and other core Kubernetes components. In version 2, Flux supports multi-tenancy and can sync an arbitrary number of Git repositories, among other long-requested features. The Flux people are building this with the [GitOps Toolkit](https://toolkit.fluxcd.io/components/%22%20/t%20%22_blank), a set of composable APIs and specialized tools for building CD on top of Kubernetes. 

There are non-Flux Kubernetes platforms that support GitOps as well, including [HPE Ezmeral Container Platform](https://www.hpe.com/content/hpe/country/us/en/software/ezmeral-runtime.html). Ezmeral [delivers GitOps through its Centralized Policy Management capabilities](https://docs.containerplatform.hpe.com/53/reference/kubernetes/Policy_Management_Overview.html) using [Argo CD](https://argoproj.github.io/argo-cd/), a declarative, GitOps continuous delivery tool for Kubernetes. 

### 3) Software agents are used to ensure correctness and act on divergence, a.k.a. [Kubernetes reconcilers](https://cluster-api.sigs.k8s.io/developer/providers/implementers-guide/controllers_and_reconciliation.html) 

As Richardson puts it, "One of the most important functions of GitOps is to enable a group of system changes to be applied correctly and then verified. After that, GitOps should enable the users and orchestrators to be notified \[alerted] if any of the systems has drifted from the correct state so that it may then be converged back to the correct desired state, which is in Git." 

So, how would this work in practice? Something like this. 

You make your changes to your Git files. Then, [Jenkins](https://www.jenkins.io/), the open source automation server, pushes these changes to the [Quay](https://www.projectquay.io/) container image registry. Jenkins then pushes the new config, and [Helm](https://helm.sh/), the Kubernetes package manager, charts to the master Git storage bucket. Once the merge request is complete, the automated GitOps operator detects the change and calls Flux to make the changes operational by deploying the updated YAML files to the master Git repository and hence to the operational Kubernetes cluster. 

That may sound complicated, but once it's set up and debugged, it will greatly speed up your deployment of applications. What do you end up with? GitOps is a CI/CD system that's greater than the sum of its parts.

As a corollary to this, you don't use [kubectl](https://kubectl.docs.kubernetes.io/%22%20/t%20%22_blank), the Kubernetes command-line interface, because all changes are handled automatically by the GitOps pipeline. Indeed, Richardson says it's not a good idea to deploy directly to the cluster using kubectl. That's because by relying on kubectl, you're making production potentially open to shell-based hacking attacks. 

## Why GitOps? 

Sharma says, just as "Kubernetes unleashes the power of cloud computing for building software fast and resiliently, GitOps is basically utilizing the Git workflows that every developer is used to." So, how important is this approach? "Not everyone who is touching Kubernetes is using GitOps, but I know everyone wants to because it would make their life easier." 

"Everyone" includes the [CNCF GitOps Working Group](https://github.com/gitops-working-group/gitops-working-group), which is working on best practices for the still quite new GitOps. Its members include Hewlett Packard Enterprise, Amazon Web Services, GitHub, Codefresh, Microsoft, and, of course, Weaveworks. 

Besides best practices, the working group is also [hammering out the GitOps Manifest](https://github.com/gitops-working-group/gitops-working-group). This is very much a work in progress. When done, it will define GitOps' principles and technical aspects in a vendor- and implementation-neutral manner. It will also lay out a common understanding of GitOps systems based on shared principles rather than on individual opinion. Another aim is to encourage innovation by clarifying the technical outcomes rather than the code, tests, or organizational elements needed to achieve them. 

Sharma, [GitLab](https://gitlab.com/users/sign_in%22%20/t%20%22_blank)'s director of technical evangelism, says it best: "For those shops doing DevOps, this approach can be appealing because [GitOps brings the workflow closer to the developer](https://thenewstack.io/what-is-gitops-and-why-it-might-be-the-next-big-thing-for-devops/%22%20/t%20%22_blank)." 

Programmers just keep using the Git tools they already know to push code into production. And since the workflow goes directly through Git, it's recorded and logged. Sharma says, "There is an audit trail, the ability to revert problematic changes, and ultimately a single source of truth of what is happening in the system from both the software development and infrastructure perspective." 

Richardson says, "Imagine a world where every time you do a deployment it's correct. And if it's not correct, then the deployment fails completely, so you can try again or make other intelligent decisions. … That is just an incredible cost-saver in operational overhead—moving from an unsafe, semireliable system to one that is basically more robust." 

But it's not magic. Simply storing your old operational patterns into Git won't get you anywhere. As Cornelia Davis, Weaveworks CTO, comments, "[Just because you put something in Git doesn't make it GitOps.](https://sdtimes.com/softwaredev/gitops-its-the-cloud-native-way/) It isn't actually the central part of GitOps. Ops is the central part of GitOps." 

The biggest mistake people make about GitOps, Davis says, is people don't get that things are always correcting themselves and you always have to respond to change with reconciliation loops. You must think about this and use it in your approach or you'll just be recycling old mistakes in a new concept. 

Do it right, however, and you can expect to reap the following: 

1. Increased CI/CD productivity. 
2. A better developer experience, by letting developers push code instead of managing containers. 
3. Improved stability, thanks to Git's audit log of Kubernetes cluster changes. 
4. Better reliability as a result of Git's built-in revert/rollback and fork from a single source of truth. 
5. And last but never least, improved cost efficiency from less downtime and improved productivity. 

Sound good to you? It does to me. I predicted long before most people did that Kubernetes would become the container orchestration program. I'm now going to go on a limb and predict that GitOps, in turn, is going to become the way most of us will end up deploying programs to the cloud in the next few years. It just makes too much sense for it not to work. 

Tom Phelan, Fellow, big data and storage organization at Hewlett Packard Enterprise, contributed to this article. 

## Lessons for leaders 

* Cloud-native development does an excellent job of enabling new capabilities, including GitOps. 
* GitOps enables more efficient processes and, ultimately, better service for customers than traditional approaches. 
* One of the best reasons to give GitOps a chance is that it uses tools that developers already know. 

This article/content was written by the individual writer identified and does not necessarily reflect the view of Hewlett Packard Enterprise Company. 

## About the author: 

[Steven Vaughan-Nichols](https://www.hpe.com/us/en/insights/contributors/steven-j-vaughan-nichols.html) 

 CEO, Vaughan-Nichols & Associates 53 publications 

Steven J. Vaughan-Nichols, a.k.a. sjvn, has been writing about technology and the business of technology since CP/M-80 was the cutting-edge PC operating system, 300bps was a fast Internet connection, WordStar was the state-of-the-art word processor, and we liked it. His work has been published in everything from highly technical publications (IEEE Computer, ACM NetWorker, Byte) and business publications (eWeek, InformationWeek, ZDNet) to popular technology magazines (Computer Shopper, PC Magazine, PC World) and the mainstream press (Washington Post, San Francisco Chronicle, Businessweek). 

##### Original Enterprise.nxt link: 

<https://www.hpe.com/us/en/insights/articles/gitops-the-next-step-in-cloud-native-development-2106.html>