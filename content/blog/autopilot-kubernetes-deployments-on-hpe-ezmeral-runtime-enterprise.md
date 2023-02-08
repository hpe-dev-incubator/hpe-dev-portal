---
title: Autopilot Kubernetes Deployments on HPE Ezmeral Runtime Enterprise
date: 2021-11-23T18:20:34.352Z
author: Vinothini Raju
authorimage: /img/vinothini-192x192.jpg
tags:
  - gopaddle
  - hpe-ezmeral
  - devops
  - site-reliability-engineer
  - sre

---
‘Autopilot’ is a concept that is familiar to many in the aviation and automobile industries. As it pertains to airplanes, autopilot systems aid pilots in focusing on crucial tasks by automating and controlling every aspect of the flight, from take-off to landing. Modern-day autopilot systems can be customized and pilots can decide on which features are to be manually controlled. Drawing parallels, in the context of Kubernetes, an autopilot system can manage the end-to-end automation of deployments as well as the maintenance of applications, relieving developers from the pain of manual intervention.  A system like this incorporates the necessary checks and balances to ensure the health of the applications and the CI/CD (continuous integration/continuous delivery) pipelines.

It’s important to note that the success of such an autopilot system relies on the extent to which developers can fine-tune and intervene in the autopilot capabilities. Just like a pilot warming up the aircraft during take-off, developers need to prepare their applications for an autopilot system to kick in. This largely depends on how the applications are structured/architected. 

In this post, I will cover autopilot systems for Kubernetes and how the combination of gopaddle and HPE Ezmeral Runtime Enterprise enables enterprises to speed up their modernization journey. Before I do that, let me first explain the need for such systems. It all starts with a demand for efficiency of the business operations.

## Addressing the need to optimize operations

Application development has changed significantly in recent years, with the introduction of microservices, DevOps processes, and Kubernetes. Maintaining a traditional, monolithic application is arduous. It requires coordinated releases, as the entire team contributes to a single binary, which is then configured and re-configured to suit the hybrid environments it may encounter. Depending upon where the application is deployed, the application has to be configured to fit the underlying infrastructure. How you scale the application or how you react to an application’s downtime would greatly depend on where the application is being deployed and used. These sequential and tedious software releases result in sub-optimal business operations.

When businesses start adopting a microservices architecture and Kubernetes, they gain multiple benefits. A microservices architecture is nimble and gives developers the independence required to build and deploy their services as long as they conform to their API contracts. Using a microservices architecture, developers can more easily incorporate new features and ship them quickly. Kubernetes aids these agile practices by standardizing the infrastructure. Using these cloud-native technologies is a great win for  businesses, as they help them respond to the market quickly and deliver more in a short period of time.

![Kubernetes is complex to manage](/img/fig1-k8s-complex-gopaddle.png "Kubernetes management requirements")

But, even though the value of Kubernetes is apparent, implementing Kubernetes requires a huge cultural shift amongst developers. Developers are now responsible for the operational demands of how to configure and deploy their microservices and maintain those services at scale. This introduces a huge learning curve. In addition, developers end up in a cycle of maintenance and automation that, in turn, pushes them away from innovation. In other words, implementing Kubernetes can become stressful and counter-productive.

## Autopilot System for Kubernetes

The answer to this double-edged requirement of balancing business efficiency without compromising developer productivity and morale is to leverage an autopilot system for Kubernetes. Such a system should abstract the complexity across the three stages of a Kubernetes implementation.

1. **Infrastructure** — Provisioning and maintaining Kubernetes environments
2. **Application** — Deploying and maintaining applications on Kubernetes
3. **Automation** — DevOps automation, i.e., CI/CD, monitoring, logging, and alerting

![Autopilot system for Kubernetes](/img/fig2-hpe-gopaddle-solution.png "Autopilot system for Kubernetes")

HPE Ezmeral Runtime Enterprise and gopaddle offer a combined solution that addresses these end-to-end requirements for developers.

[HPE Ezmeral Runtime Enterprise](https://www.hpe.com/us/en/software/ezmeral-runtime.html) provides you with an enterprise-grade container orchestration platform that is designed to run modern applications (both cloud-native and non-cloud-native monolithic applications) with persistent data.   

[gopaddle](https://gopaddle.io/) is a no-code platform used to build, deploy and maintain Kubernetes workloads across hybrid environments. It offers with three main capabilities: 

1. **Accelerate modernization** — With its intelligent scaffolding, gopaddle can transform      code into Kubernetes deployments in minutes.
2. **Increase productivity** — With its out-of-the-box tools integration and ready-to-use templates, gopaddle reduces the overhead of tedious maintenance and increases productivity.
3. **Increase operational efficiency** — gopaddle’s centralized control plane helps      provision and manage Kubernetes clusters across clouds and on-premise/edge environments.

## How does the solution work?

### 1. Installing the gopaddle Enterprise edition on HPE Ezmeral Runtime Enterprise platform

gopaddle is available in two variations. gopaddle SaaS is a subscribe and pay-as-you-go model where the Kubernetes cluster managed by HPE Ezmeral Runtime Enterprise can be registered with gopaddle, securely via a bastion host. An external cluster in the context of gopaddle is a cluster that is not provisioned by gopaddle. The second variation  described in detail in this post, is to install the gopaddle Enterprise edition on the Kubernetes cluster. gopaddle Enterprise edition is available as a Helm chart and can be installed on a Kubernetes cluster running on HPE Ezmeral Runtime Enterprise platform within the corporate firewall. To achieve a self-contained CI/CD environment within the corporate firewall, the GitLab repository and container registry can be installed on the Kubernetes cluster and registered with gopaddle.

### 2. Registering and configuring HPE Ezmeral Runtime Environment with gopaddle

Once gopaddle Enterprise Edition is installed on the Kubernetes cluster managed by HPE Ezmeral Runtime Enterprise, you can register that Kubernetes cluster securely with gopaddle for further application build and/or deployment processes.

![gopaddle dashboard](/img/fig3-hpe-cluster-dashboard-gopaddle.png "gopaddle dashboard")

At the time of Kubernetes cluster registration, gopaddle also installs a set of add-ons, like Prometheus, Event exporters and Grafana, on the Kubernetes cluster for monitoring and alerting.

![Add-ons, container builds and applications](/img/fig4-hpe-addons-builds-apps-gopaddle.png "Add-ons, container builds and applications")

As soon as the Kubernetes cluster is registered, gopaddle discovers the nodes and gives a visual representation of their configurations. Configurations like node labels and taints can be updated from the gopaddle UI.

![Kubernetes nodes details](/img/fig5-hpe-node-detail-gopaddle.png "Kubernetes nodes details")

The node logs section can be used for troubleshooting HPE Ezmeral Runtime Enterprise managed Kubernetes node-related issues.

![Kubernetes nodes logs](/img/fig6-hpe-node-logs-gopaddle.png "Kubernetes nodes logs")

The Kubernetes cluster can now be used for building and deploying applications.

### 3. Registering source control repositories and Docker registries

Before modernizing the applications, the source control repository and a container registry need to be registered with gopaddle. Below is a sample configuration for registering the on-premise GitLab repository installed on the HPE Ezmeral Runtime Enterprise managed Kubernetes cluster registered with gopaddle. First, a custom GitLab authenticator is registered and then the GitLab repository is registered using the custom authenticator. Once registered, the GitLab repository can now be used to create containers within gopaddle. Similarly, an on-premise GitLab container registry can be registered with gopaddle to push Docker images.

![GitLab source control repository and Container registry](/img/fig7-hpe-code-rep-reg-updated-gopaddle.png "GitLab source control repository and Container registry")

### 4. Building and deploying applications

Source code projects in the GitLab repository can be on-boarded either through the gopaddle’s intuitive wizard-based UI or through its command-line utility — ***gpctl***.

For instance, ***gpctl*** can be installed locally on the developer’s desktop and can be used to perform an intelligent scaffolding — a process that automatically converts a source code project to a Kubernetes deployment or a Helm chart. Here is an example of how *gpctl init* can be used to import the ‘Contentful’ application from the GitLab repository to the registered Kubernetes cluster running on HPE Ezmeral Runtime Enterprise. The outcome of this utility is the access URL of the application deployed on the HPE Ezmeral Runtime Enterprise. This transformation process takes less than 10 minutes to onboard the ‘Contentful’ application on the HPE Ezmeral Runtime Enterprise.

As you can see, the HPE Ezmeral Runtime Enterprise is used seamlessly for both building the container image and for deploying the application. gpctl supports any type of Linux workloads like NodeJS, Java, Python, GoLang, Ruby, .NET Core. More information on ***gpctl*** can be found [here](https://help.gopaddle.io/en/articles/5056807-initializing-a-microservice-from-scratch).

![gopaddle gpctl command line interface](/img/fig8-hpe-gpctl-init-1-gopaddle.png "gopaddle gpctl command line interface")

### 5. CI/CD automation

To enable continuous integration for the containers, the CI toggle must be enabled for the container from the gopaddle UI. When enabled, any changes to the source code will be automatically detected and a new container build will be triggered. 
Using gopaddle’s alerts and notification channels, the Jenkins pipeline can be triggered to run a custom workflow — say, run a regression suite or perform a rolling update on an application.

![gopaddle enables Continuous Integration](/img/fig9-enable-ci-gopaddle.png "gopaddle enables Continuous Integration")

### 6. HPE Ezmeral Runtime Enterprise for Stateful Applications

gopaddle integrates with HPE Ezmeral Runtime Enterprise seamlessly to manage stateful workloads. HPE Ezmeral Runtime Enterprise provides a pre-integrated Data Fabric (formerly known as MapR Data Platform) for persistent volumes for stateful applications that require persistence of data The below screenshot gives an overview of the Data Fabric volumes and the applications/services using those volumes.

![gopaddle dashboard for volumes](/img/fig10-hpe-volumes-gopaddle.png "gopaddle dashboard for volumes")

The HPE Ezmeral Runtime Enterprise and gopaddle joint solution is a great autopilot solution for developers. While HPE Ezmeral Runtime Enterprise offers a robust enterprise-grade Kubernetes environment, gopaddle automates the deployment and application lifecycle on the HPE Ezmeral platform. Developers can now focus on creativity, innovation, and collaboration rather than spending their time on resolving configuration issues. At the same time, businesses can achieve operational efficiency without compromising on developer productivity.


More information on the HPE Ezmeral Runtime Enterprise and gopaddle joint solution can be found [here](https://www.hpe.com/psnow/doc/a50005229enw). Check back on the [HPE DEV blog](https://developer.hpe.com/blog) for more articles on how to automate and improve your DevOps environment. You can follow Vinothini (Founder & CEO @gopaddle.io) and her team on Twitter [@gopaddle.io](https://twitter.com/gopaddleio?lang=en). You can also reach Vinothini directly on [LinkedIn](https://www.linkedin.com/in/vinothini-raju-9817ab5/).
