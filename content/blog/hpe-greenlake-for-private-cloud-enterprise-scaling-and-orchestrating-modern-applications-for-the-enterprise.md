---
title: "HPE GreenLake for Private Cloud Enterprise: Scaling and orchestrating
  modern applications for the enterprise."
date: 2023-10-19T14:34:37.983Z
author: Sudheendra Seshachala
authorimage: https://media.licdn.com/dms/image/D5603AQGMJCplt_LTFQ/profile-displayphoto-shrink_800_800/0/1695127848528?e=1703116800&v=beta&t=4gbr2tD1-sH5-mhFh6O05iibw3B0UMHnL-1CPVF_2uU
disable: false
tags:
  - hpe-greenlake-for-private-cloud-enterprise
---
In my blog post on [HPE GreenLake for Private Cloud Enterprise: Deploying and scaling traditional applications](https://developer.hpe.com/blog/hpe-greenlake-for-private-cloud-enterprise-glpce-deploying-and-scaling-traditional-applications/), I highlighted how HPE GreenLake for Private Cloud Enterprise seamlessly integrates traditional applications with modern demands, transforming infrastructure into programmable code for optimal flexibility and security. Its strategic approach to scalability ensures businesses consistently operate at their best, making applications resilient to ever-changing requirements. 
In this post, I'll delve into the features and capabilities of HPE GreenLake for Private Cloud Enterprise, with a specific focus on its support for scaling containers using Kubernetes (K8s). Let's explore the advancements and offerings of the HPE GreenLake for Private Cloud Enterprise platform.

# **Introduction**

In today’s rapidly evolving digital landscape, it's imperative for enterprises to have agile and secure solutions that can effortlessly adapt to emerging trends. HPE GreenLake for Private Cloud Enterprise: Containers ("containers service") offers a robust solution tailored to meet these specific demands. Containers service efficiently adjusts resources based on changing workloads, ensuring optimal use. This flexibility eliminates unexpected costs, allowing businesses to pay only for the resources they use. A unified dashboard makes this process even more transparent and manageable. 

HPE GreenLake for Private Cloud Enterprise enables seamless integration between on-premises infrastructure and cloud platforms. This capability ensures that, as workloads move or scale between these environments, the performance remains consistent, providing a dependable experience for users. It's not just about meeting current needs; it's about anticipating the future. By aligning with the latest standards and supporting innovative architectural trends, HPE GreenLake for Private Cloud Enterprise positions businesses at the cutting edge of technology. In essence, containers service is a harmonious blend of traditional and modern needs, paving a clear path for businesses to move confidently into the future with unmatched agility and security.

## **Kubernetes (K8s) on HPE GreenLake Private Cloud Enterprise**

HPE GreenLake for Private Cloud Enterprise provides Kubernetes deployment via its container services. Notably, it's a CNCF-compliant K8s distribution, ensuring adherence to industry standards.

**Key Points:**

1. On-premises Kubernetes: It is designed for on-premises deployments with the ability to scale based on business needs.
2. Ready to use: The platform is pre-configured, reducing setup time.
3. Performance and security: It provides consistent performance and security for operations.
4. Quick Kubernetes start: The platform features one-click provisioning that gets Kubernetes operations running fast.
5. Central Kubernetes management: Its management console allows for easy control over Kubernetes clusters.
6. Pay-as-you-go pricing: It uses a flexible pricing model where businesses pay for what they use.

Containers service stands out by delivering the security, efficiency, and cost-effectiveness modern businesses seek, maximizing resource use. In tandem with Kubernetes, containers service provides a smooth and managed infrastructure. Enhanced by HPE Ezmeral Runtime Enterprise, it gives businesses a refined platform for deploying applications, ensuring scalability, and streamlined operations.

**Under the hood – A fungible infrastructure resource pool**    
As discussed in [Part 1](https://developer.hpe.com/blog/hpe-greenlake-for-private-cloud-enterprise--Exploring-a-flexible-infrastructure-resource-pool/) of this blog series, HPE GreenLake for Private Cloud Enterprise integrates an adaptable infrastructure that leverages the strengths of its infrastructure resource pool and detailed capacity planning. This approach not only addresses present business requirements but also anticipates future needs. Within HPE GreenLake for Private Cloud Enterprise, the resource pool offers flexibility, letting businesses choose container deployments on bare metal, virtual machines, or a combination of both, based on their specific demands. 
Diving into the heart of HPE GreenLake for Private Cloud Enterprise: Containers, we encounter two primary deployment models for Kubernetes: on virtual machines and on bare metal.

Kubernetes on bare metal:

* Tailored for expansive, consistent deployments where performance is paramount. * Efficiency takes center stage, devoid of VM-associated costs. 
* Simplified management structure cuts down on overhead 
* Perfect for business-critical applications or those where speed and responsiveness are crucial, like financial or imaging apps.

Kubernetes on virtual machines:

* Delivers optimal performance in diverse environments, making it an ideal choice for development
* Flexibility in deployments with the convenience of having mixed workloads run simultaneously
* Typical applications include general-purpose web apps and event-driven microservices.

In essence, whether your workload requires the adaptable environment of VMs or the robust power of bare metal, containers service ensures your Kubernetes deployments are optimized to your unique needs.

## **K8s in Action on HPE GreenLake for Private Cloud Enterprise**

In the evolving landscape of enterprise IT, scalability isn't just a luxury; it's a necessity. With HPE GreenLake for Private Cloud Enterprise and Kubernetes at its helm, businesses are equipped to meet dynamic demands head-on. When administrators first work with HPE GreenLake, they can manually allocate resources based on anticipated needs. But as traffic unpredictably rises, Kubernetes springs into action, enabling it to scale. 
Kubernetes, with its sophisticated orchestration capabilities, monitors workloads in real-time on HPE GreenLake for Private Cloud Enterprise. Should traffic surge unexpectedly, Kubernetes autonomously scales containers, ensuring optimal performance without overburdening resources. 
The combined prowess of manual fine-tuning with Kubernetes' automated scalability represents the future-forward approach of HPE GreenLake for Private Cloud Enterprise, promising enterprises reliability, efficiency, and adaptability all in one package.

**Kubernetes Cluster blueprints:**

![Screenshot 1: Creation of Kubernetes cluster blueprint](/img/screenshot-4-creation-of-kubernetes-cluster-blueprint.png "Screenshot 1: Creation of Kubernetes cluster blueprint")

In screenshot 1, Kubernetes cluster blueprints in containers service serve as templates to simplify cluster deployments, including K8s setups. They set configurations like the Kubernetes version, storage class, and node details. Blueprints ensure consistent deployments and allow users to use standard templates or create their own for specific needs. Let me show you a concise demo on how to effortlessly configure clusters and optimize auto-scaling parameters!

**How to create K8s clusters and scale worker nodes (up or down) in a running cluster**

![Screenshot 2: K8s Cluster creation and configuring scaled worker nodes](/img/screenshot-2-k8s-cluster-creation-and-configuring-scaled-worker-nodes.png "Screenshot 2: K8s Cluster creation and configuring scaled worker nodes")

In screenshot 2 , I created a cluster. I selected configurations and resources, set parameters, and containers service provisions and initialized the cluster. 

**Scaling worker nodes in containers service**: With containers service, you can scale worker nodes based on workload. You just increase or decrease the number of worker nodes in a running cluster to align with resource requirements.

**Autoscaler in Kubernetes clusters**: The Autoscaler adjusts the Kubernetes cluster's size based on specific conditions. It scales up when pods can't be scheduled due to resource limitations and scales down if nodes are underutilized for over 10 minutes.

**Key points:**

* Scaling range: Defined by a minimum and maximum node count. The range is between 1 and 200 nodes. By default, autoscaling is off with equal min-max values. 

**Scaling criteria**: 

1. Pending pods due to limited resources trigger a scale-up.    
2. Underutilized nodes for 10 minutes prompt a scale-down, but certain conditions can prevent this:    
   * Recent scale-up within 10 minutes
   * Failed scale-down in the last 3 minutes
   * Nodes with critical pods or those facing specific constraints

3. Autoscaler operates from the control plane, checking conditions every minute.

   ![Screenshot 3: Scale cluster](/img/screenshot-3-scale-cluster.png "Screenshot 3: Scale cluster")

**How to use configure:**

1. Ensure the cluster is ready and familiarize yourself with autoscaler guidelines.
2. Navigate to HPE GreenLake for Private Cloud Enterprise > Containers > Selected Cluster.
3. Choose Scale from Actions. 
4. Set the min-max node count values to either enable or disable autoscaling as shown in Screenshot 3.
5. Optionally, add or remove node pools.
6. To see the autoscaler logs, utilize the given kubectl command.

**Conclusion – The perfect synergy**    
HPE GreenLake for Private Cloud Enterprise, in conjunction with Kubernetes, addresses a broad spectrum of enterprise applications. Whether dealing with brownfield applications that have evolved over time or greenfield applications that are freshly developed, this combination ensures seamless integration and deployment.     

HPE GreenLake for Private Cloud Enterprise, in conjunction with Kubernetes, addresses a broad spectrum of enterprise applications. Whether dealing with brownfield applications that have evolved over time or greenfield applications that are freshly developed, this combination ensures seamless integration and deployment.    

Containers service’s ability to scale resources up or down based on workload demands ensures that businesses can respond effectively to varying operational requirements. 
Additionally, the integrated framework provides a secure stack, reinforcing infrastructure integrity, governance, compliance, and application security. In essence, the union of HPE GreenLake for Private Cloud Enterprise and Kubernetes provides a comprehensive solution that caters to both existing and new enterprise applications, fostering a flexible, responsive, and secure environment.