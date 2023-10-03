---
title: HPE GreenLake for Private Cloud Enterprise (GLPCE) Deploying and scaling
  traditional applications
date: 2023-10-03T03:45:24.053Z
author: Sudheendra Seshachala Rao
authorimage: /img/1695127848528.jpeg
disable: false
---
![]()

<style>
li {
   font-size: 27px;
   line-height: 33px;
   max-width: none;
}
</style>

In my first blog post on [HPE GreenLake for Private Cloud Enterprise (GLPCE): Exploring a flexible infrastructure resource pool](https://developer.hpe.com/blog/hpe-greenlake-for-private-cloud-enterprise--Exploring-a-flexible-infrastructure-resource-pool/)I underscored the flexible nature of HPE GreenLake for Private Cloud Enterprise infrastructure. Its transparent cost analytics stand out as a significant benefit, aiding organizations in making well-informed financial and infrastructural choices. In our present digital era, having the right infrastructure is imperative, a need that GLPCE aptly fulfills through its robust support for automated tools like Terraform and Ansible, ensuring seamless and efficient infrastructure management and scaling.
In this second segment, I will delve further into the enhanced features of HPE GreenLake for Private Cloud Enterprise: Virtual Machines. This exploration will highlight the substantial support these services extend to modern businesses. By demystifying the intricacies of deploying and efficiently scaling traditional applications, GLPCE stands as a pivotal ally for contemporary enterprise operations.

**Introduction**
In the current business landscape, organizations face the intricate task of integrating their applications, built on traditional time-tested and trusted technology and processes, like three-tier architectures, with the rapid pace and adaptability of modern applications, like containers and serverless computing. These older technologies have proven their reliability and effectiveness over time, forming the backbone of many enterprise systems. Meanwhile, applications have become modernized, emphasizing scalability, agility, and efficiency, and often relying on cloud-native architectures and services to deliver seamless, robust functionality.

Navigating the integration of these disparate systems requires a thoughtful approach, balancing the stability and reliability of traditional architectures with the innovative features of modern application development and deployment strategies. This blending ensures organizations can harness the full potential of both technological paradigms to drive operational excellence and competitive advantage in the marketplace. Addressing this challenge, the HPE GreenLake for Private Cloud Enterprise: Virtual Machines   serves as a comprehensive platform. It is designed to support the simultaneous operation and integration of both traditional and modern application types.

**Traditional architecture**

Figure 1 illustrates a three-tier architecture with the pivotal roles of various components. Their collective functionality in ensuring consistent application responsiveness, user engagement, and efficient processing of requests is highlighted. The architecture is delineated into the Load Balancer, the web-mobile tier, the application/business Logic tier, and the database tier, each playing a significant role in ensuring the smooth and efficient functioning of the application.
Amidst this backdrop, HPE GreenLake for Private Cloud Enterprise emerges as a significant facilitator for deploying traditional applications. It streamlines the complexities intertwined with deployment, enhancing the synchronization between different architectural tiers.

The real advantage that HPE GreenLake for Private Cloud Enterprise delivers lies in its ability to deploy essential components like Tier 0 (top or external tier) and Tier 1 (middle or distribution tier) routers, load balancers, and firewalls. This ability enables customers to seamlessly establish a three-tier application in the private cloud environment, ensuring robustness and efficiency in their operations. Beyond this, HPE GreenLake for Private Cloud Enterprise empowers customers to construct a comprehensive blueprint of a three-tier application, leveraging it for consistent and repeatable deployments. This approach not only simplifies deployment challenges but also enhances the efficiency and reliability of deploying traditional three-tier applications in a cloud environment.

![Figure 1: A Traditional n-tier application to be hosted on Virtual Machine Service](/img/a-traditional-n-tier-application-to-be-hosted-on-virtual-machine-service.png "Figure 1: A Traditional n-tier application to be hosted on Virtual Machine Service")

By integrating these capabilities, HPE GreenLake for Private Cloud Enterprise stands out as a solution that not only supports the deployment of traditional applications but also underscores the advancements in modern applications, ensuring seamless cloud transitions and robust integration. It adeptly positions enterprises to navigate the intricate waters of technological evolution, ensuring they remain at the forefront of innovation and operational efficiency.

**Deploying and scaling traditional applications**
The Virtual Machine service enables the utilization of virtual machine infrastructure through code, offering support for tools like Terraform and Ansible. This promotes rapid deployments, uniformity, and enhanced scalability. It also strengthens security and consistency by reducing manual steps, priming businesses for efficient digital asset management. 
In this blog post, I’ll help you navigate the HPE GreenLake for Private Cloud Enterprise console to initialize assets for hosting and deploying code. We'll begin by setting up web layer instances with the compute-optimized (c2i) type and scale them twice based on memory thresholds. Using an Ansible playbook, we will be able to automate tasks and incorporate a load balancer to prevent any single point of failure. Although the focus is on port 80 for HTTP, options for port 443, SSL certificates, and other TCP ports are available for diverse cluster scaling. Screenshots will illustrate instance launches upon reaching scaling thresholds.

Next, we will explore the two key phases of application deployment and scaling: 

1. Design and Development
2. Runtime
   In the Design and Development phase, you will initialize hosting in the HPE GreenLake for Private Cloud Enterprise console and set up web layer instances using the c2i type. Utilizing Ansible, you will implement threshold-based scaling and integrate a load balancer to ensure continuous service. Although the primary focus is on port 80, other ports are also available.
   During the Runtime phase, instances are activated and monitored as they launch upon reaching scaling thresholds. 
   For a clearer understanding, this post will include step-by-step screenshots. To start, log into the HPE GreenLake for Private Cloud Enterprise console and navigate to the Virtual Machines section on the dashboard.

**Design and development phase**: In this section, you’ll learn how to manage groups and set scaling thresholds for CPU and memory.

1. Creating a Group: Start by accessing the Virtual Machines link on the dashboard. Click on **Launch Service console** and then select **Groups** from the **Infrastructures** dropdown. Here, initiates the creation of a designated group, as illustrated in screenshot 1. This approach allows you to bundle associated resources, ensuring streamlined management and clear oversight.

   ![Screenshot 1: Managing groups and setting scaled thresholds for CPU and memory.](/img/managing-groups-and-setting-scaled-thresholds-for-cpu-and-memory.png "Screenshot 1: Managing groups and setting scaled thresholds for CPU and memory.")