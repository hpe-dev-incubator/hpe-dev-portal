---
title: "HPE GreenLake for Private Cloud Enterprise: Deploying and scaling
  traditional applications"
date: 2023-10-03T03:45:24.053Z
author: Sudheendra Seshachala
authorimage: /img/1695127848528.jpeg
disable: false
tags:
  - hpe-greenlake-for-private-cloud-enterprise
  - " deploy-apps-across-private-public-and-hybrid"
  - GreenLake Private Cloud Enterprise
---
<style>
li {
   font-size: 27px;
   line-height: 33px;
   max-width: none;
}
</style>

In my first blog post on [HPE GreenLake for Private Cloud Enterprise: Exploring a flexible infrastructure resource pool](https://developer.hpe.com/blog/hpe-greenlake-for-private-cloud-enterprise--Exploring-a-flexible-infrastructure-resource-pool/) I underscored the flexible nature of HPE GreenLake for Private Cloud Enterprise infrastructure. Its transparent cost analytics stand out as a significant benefit, aiding organizations in making well-informed financial and infrastructural choices. In our present digital era, having the right infrastructure is imperative, a need that HPE GreenLake for Private Cloud Enterprise aptly fulfills through its robust support for automated tools like Terraform and Ansible, ensuring seamless and efficient infrastructure management and scaling.
In this second segment, I will delve further into the enhanced features of HPE GreenLake for Private Cloud Enterprise: Virtual Machines. This exploration will highlight the substantial support these services extend to modern businesses. By demystifying the intricacies of deploying and efficiently scaling traditional applications, HPE GreenLake for Private Cloud Enterprise stands as a pivotal ally for contemporary enterprise operations.

**Introduction**

In the current business landscape, organizations face the intricate task of integrating their applications, built on traditional time-tested and trusted technology and processes, like three-tier architectures, with the rapid pace and adaptability of modern applications, like containers and serverless computing. These older technologies have proven their reliability and effectiveness over time, forming the backbone of many enterprise systems. Meanwhile, applications have become modernized, emphasizing scalability, agility, and efficiency, and often relying on cloud-native architectures and services to deliver seamless, robust functionality.

Navigating the integration of these disparate systems requires a thoughtful approach, balancing the stability and reliability of traditional architectures with the innovative features of modern application development and deployment strategies. This blending ensures organizations can harness the full potential of both technological paradigms to drive operational excellence and competitive advantage in the marketplace. Addressing this challenge, the HPE GreenLake for Private Cloud Enterprise: Virtual Machines   serves as a comprehensive platform. It is designed to support the simultaneous operation and integration of both traditional and modern application types.

**Traditional architecture**

Figure 1 illustrates a three-tier architecture with the pivotal roles of various components. Their collective functionality in ensuring consistent application responsiveness, user engagement, and efficient processing of requests is highlighted. The architecture is delineated into the Load Balancer, the web-mobile tier, the application/business Logic tier, and the database tier, each playing a significant role in ensuring the smooth and efficient functioning of the application.
Amidst this backdrop, HPE GreenLake for Private Cloud Enterprise emerges as a significant facilitator for deploying traditional applications. It streamlines the complexities intertwined with deployment, enhancing the synchronization between different architectural tiers.

The real advantage that HPE GreenLake for Private Cloud Enterprise delivers lies in its ability to deploy essential components like Tier 0 (top or external tier) and Tier 1 (middle or distribution tier) routers, load balancers, and firewalls. This ability enables customers to seamlessly establish a three-tier application in the private cloud environment, ensuring robustness and efficiency in their operations. Beyond this, HPE GreenLake for Private Cloud Enterprise empowers customers to construct a comprehensive blueprint of a three-tier application, leveraging it for consistent and repeatable deployments. This approach not only simplifies deployment challenges but also enhances the efficiency and reliability of deploying traditional three-tier applications in a cloud environment.

![Figure 1: A Traditional n-tier application to be hosted on Virtual Machine Service](/img/a-traditional-n-tier-application-to-be-hosted-on-virtual-machine-service.png "Figure 1: A Traditional n-tier application to be hosted on Virtual Machine Service")

> > <span style="color:grey; font-family:Arial; font-size:1em">Figure 1: A Traditional n-tier application to be hosted on Virtual Machine Service </span>

By integrating these capabilities, HPE GreenLake for Private Cloud Enterprise stands out as a solution that not only supports the deployment of traditional applications but also underscores the advancements in modern applications, ensuring seamless cloud transitions and robust integration. It adeptly positions enterprises to navigate the intricate waters of technological evolution, ensuring they remain at the forefront of innovation and operational efficiency.

**Deploying and scaling traditional applications**

The Virtual Machine service enables the utilization of virtual machine infrastructure through code, offering support for tools like Terraform and Ansible. This promotes rapid deployments, uniformity, and enhanced scalability. It also strengthens security and consistency by reducing manual steps, priming businesses for efficient digital asset management. 
In this blog post, I’ll help you navigate the HPE GreenLake for Private Cloud Enterprise console to initialize assets for hosting and deploying code. I begin by setting up web layer instances with the compute-optimized (c2i) type and scale them twice based on memory thresholds. Using an Ansible playbook, I will be able to automate tasks and incorporate a load balancer to prevent any single point of failure. Although the focus is on port 80 for HTTP, options for port 443, SSL certificates, and other TCP ports are available for diverse cluster scaling. Screenshots will illustrate instance launches upon reaching scaling thresholds.

Next, I will explore the two key phases of application deployment and scaling: 

### 1. Design and Development: 
In this section, I guide you through managing groups and establishing scaling parameters for CPU and memory. During the Design and Development phase, initiate hosting via the HPE GreenLake for Private Cloud Enterprise console and configure web layer instances using the c2i type. With Ansible's help, introduce threshold-based scaling and incorporate a load balancer for uninterrupted service. While we'll emphasize port 80, several other ports are accessible as well. 

### 2. Runtime
In the Runtime phase, as instances reach scaling thresholds, they are activated and tracked. For detailed insights, I provide a series of screenshots in this post. 

Now lets begin by logging into the HPE GreenLake for Private Cloud Enterprise console, then head to the Virtual Machines section displayed on the dashboard.

**Design and development phase**: 

1. Creating a Group: Start by accessing the Virtual Machines link on the dashboard. Click on **Launch Service console** and then select **Groups** from the **Infrastructures** dropdown. Here, initiates the creation of a designated group, as illustrated in screenshot 1. This approach allows you to bundle associated resources, ensuring streamlined management and clear oversight.

   ![Screenshot 1: Managing groups and setting scaled thresholds for CPU and memory.](/img/managing-groups-and-setting-scaled-thresholds-for-cpu-and-memory.png "Screenshot 1: Managing groups and setting scaled thresholds for CPU and memory.")

> > <span style="color:grey; font-family:Arial; font-size:1em">Screenshot 1: Managing groups and setting scaled thresholds for CPU and memory. </span>

2. Setting scale threshold: Navigate to **Library** and choose **Scale** **threshold**. Here is where you will define specific criteria for automatic scaling as shown in screenshot 1. With this in place, the system self-adjusts, activating anywhere from 1 to 4 instances based on memory consumption. When memory usage is minimal, the system conserves resources by operating fewer instances. Conversely, as memory usage approaches its limit, the system scales upwards, guaranteeing consistent performance without the need for human input.
3. Create NSX-T Load Balancer: Screenshot 2 shows creating the **Scale-Post-LB** load balancer, set to **Small** size and **Enabled**, is in an Up administrative state. Connected to the main network router, **Tier-1 Gateway**, it logs activity at a Warning level. 
     ![Screenshot 2: NSX-T Load Balancer](/img/nsx-t-load-balancer.png "Screenshot 2: NSX-T Load Balancer")

> > <span style="color:grey; font-family:Arial; font-size:1em">Screenshot 2: NSX-T Load Balancer </span>

This tool distributes traffic across servers, enhancing performance and reliability, while granting access to all groups.
4. Instance provisioning: Screenshot 3 takes you through the detailed steps of setting up an instance:
a. Initiating instance creation: Begin by navigating to **Provisioning**, then select **Instances** and click on Create Instance. At this juncture, identify and assign the right group for your resources. It is now also the time to detail key attributes, such as the instance name, its operating environment, and any relevant labels. This meticulous labeling aids in precise resource tracking and management.

![Screenshot 3: Creating and configuring instance](/img/screenshot-3-creating-and-configuring-instance.png "Screenshot 3: Creating and configuring instance")

> > <span style="color:grey; font-family:Arial; font-size:1em">Screenshot 3: Creating and configuring instance </span>

b. Layout configuration: Subsequently, shift your focus to integrating the instance with a load balancer. While many prominent load-balancing options are available, including the likes of F5, the NSX-T Load Balancer (screenshot 2) native to HPE GreenLake for Private Cloud Enterprise  is a good fit. It's equipped with a comprehensive set of features tailored to meet our deployment requirements, ensuring even distribution of incoming traffic across multiple endpoints.
c. Final settings: Concluding the process, determine the root volume size to match your data storage necessities. Concurrently, select and designate the network on which these instances will function. This guarantees flawless interaction and operation within the stipulated digital ecosystem.

![Screenshot 4: Configuring automation, scale factor and load balancer](/img/configuring-automation-scale-factor-and-load-balancer.png "Screenshot 4: Configuring automation, scale factor and load balancer")

> > <span style="color:grey; font-family:Arial; font-size:1em">Screenshot 4: Configuring automation, scale factor and load balancer </span>

In Screenshot 4, as you navigate the automation phase of the instance wizard:

1. Initiate the workflow configuration, opting for Ansible based on your needs. It's worth noting the availability of a Node.js workflow alternative.
2. The Scale type selection follows, referencing the threshold previously established in Screenshot 1. For clarity, you can revisit Screenshot 1.
3. In Screenshot 2, you’ll see how to set up an NSX-T Load Balancer. Port 80 is primarily designated for HTTP traffic. While port 80 is the focus, other ports like 443 for HTTPS or custom ports for database tasks (e.g., 1433, 1521) can be configured. It's crucial to note that, initially, configurations apply only to the servers behind the load balancer. When a new instance arises due to scaling thresholds, it inherits these settings but isn't automatically added to the load balancer. A separate script is required to include the new instance to the load balancer.
4. It's essential to highlight that activating port 443 for HTTPS provides the capability to configure and implement SSL certificates, bolstering security.
5. Additionally, there's flexibility to choose the installation of custom agents on the instances, such as third-party monitoring tools or security vulnerability scanners.

   ![Screenshot 5: Tagging the resources.](/img/tagging-the-resources..png "Screenshot 5: Tagging the resources.")

> > <span style="color:grey; font-family:Arial; font-size:1em">Screenshot 5: Tagging the resources. </span>

In Screenshot 5, you’ll notice an invaluable feature: the ability to create tags during the instance setup. Tagging resources allows organizations to effortlessly track and evaluate their resource consumption, providing insights into patterns, trends, and potential areas of optimization. Furthermore, these tags become indispensable when delving into spend analytics, helping to allocate and manage costs effectively. This functionality is especially crucial within the HPE GreenLake suite, as it promotes both transparency and strategic decision-making for businesses.

**Runtime**: Observe screenshot 6, where you’ll notice instances are activated and are attached to load balancer.

![Screenshot 6: Provisioning – 2 instances up and attached to load balancer.](/img/provisioning-–-2-instances-up-and-attached-to-load-balancer.png "Screenshot 6: Provisioning – 2 instances up and attached to load balancer.")

> > <span style="color:grey; font-family:Arial; font-size:1em">Screenshot 6: Provisioning – 2 instances up and attached to load balancer. </span>

Provisioning: Screenshot 6 shows the final phase of the instance wizard: the Review screen. This overview permits users to review and affirm their established configurations. By clicking the complete button, the provisioning process is activated. Although the instances themselves do not undergo optimization, the earlier described workflow and automation contribute to enhancing application performance. This enhancement is achieved by efficiently scaling out or scaling in the number of virtual machines based on the predefined scale factor, ensuring optimal application operation without manually adjusting the VM count.

![Screenshot 7: Scaled up VMs](/img/scaled-up-vms.png "Screenshot 7: Scaled up VMs")

> > <span style="color:grey; font-family:Arial; font-size:1em">Screenshot 7: Scaled up VMs. </span>

Scaling observation: Now, draw your attention to the tripartite progression of instance scaling that is shown in Screenshot 7.

1. **Initial state**: This stage represents the baseline, illustrating the system's configuration before any significant memory demand. It's the foundation, where the system awaits triggers or conditions to initiate any scaling.
2. **Intermediate phase**: During the transition, memory demand escalates and meets the scaling threshold. This juncture is pivotal — the system responds by initializing new instances. It's an adaptive phase, wherein the system's agility becomes evident, reacting in real-time to the increasing demands.
3. **Final state**: The culmination is a full display of responsiveness. With memory utilization hitting its designated peak, the system maximizes its resources. Four active instances, mirroring the set scaling threshold, now operate cohesively. This not only reflects an adaptive system but also showcases a setup geared for efficiency and robust performance, ensuring user demands are consistently met.

**Conclusion**

In this post, I showed you how HPE GreenLake for Private Cloud Enterprise:  Virtual Machines simplifies the deployment and scaling of traditional applications, making it an efficient choice for modern digital business needs. The Design and Development phase highlights the ease of managing groups and setting scaling thresholds for CPU and memory, emphasized by the detailed visual walkthrough. Through the HPE GreenLake for Private Cloud Enterprise console and Ansible automation, the establishment of a robust and efficient scaling environment is showcased, ensuring operational consistency and responsiveness.
In the Runtime phase, the system’s agility comes to the forefront. The seamless integration with NSX-T Load Balancer and clear, step-by-step provisioning and setup underscore the system’s focus on optimal performance and reliability. The nuanced instance setup process, from initiation to layout configuration and tagging, exemplifies the comprehensive control and oversight organizations hold over their resources and deployment processes.
In conclusion, the HPE GreenLake for Private Cloud Enterprise stands out as a robust, intuitive, and adaptive platform for efficiently deploying and scaling traditional applications. This detailed overview underscores the significant value it brings to enterprises, ensuring consistent meeting of user demands while promoting operational efficiency and innovation. Stay tuned for the final post in this series.