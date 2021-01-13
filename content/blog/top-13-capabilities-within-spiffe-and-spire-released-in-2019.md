---
title: "Top 13 Capabilities Within SPIFFE and SPIRE Released In 2019"
date: 2020-04-21T00:42:07.062Z
author: Umair Khan 
tags: ["spiffe-and-spire-projects","opensource"]
path: top-13-capabilities-within-spiffe-and-spire-released-in-2019
---
With the acquisition of Scytale this past February, Hewlett Packard Enterprise (HPE) acquired a seasoned team of experts in cloud-native security and zero-trust networking. The Scytale team is recognized as founding contributors to Cloud Native Foundation’s (CNCF’s) SPIFFE (the Secure Production Identity Framework for Everyone) and SPIRE (the SPIFFE Runtime Environment) open source projects. 

HPE is fully-committed to continuing Scytale’s stewardship and contributions to SPIFFE and SPIRE, as these projects will play a fundamental role in HPE’s plans to deliver a dynamic, open, and secure edge-to-cloud platform

The *following* content was originally posted on Scytale’s blog:

Over the course of 2019, the Scytale team continued its work shepherding the SPIFFE and SPIRE communities towards building standards and tooling that support the service identity concept. Part of the Cloud Native Computing Foundation (CNCF), these projects have grown in popularity and seen an increasing number of contributions from engineering teams at Amazon, Bloomberg, Google, Pinterest, Square, TransferWise, Uber, Yahoo Japan, and more. 

These community-led innovations and contributions have enabled SPIFFE to authenticate to more types of software systems and improved the deployment, operability, and performance of SPIRE in large-scale environments.  

## Authenticate to Service Mesh, Cloud Platforms, Databases, and more

Until recently, SPIFFE has primarily been used to secure communications between services identified by a shared SPIFFE identity provider (IdP). While numerous contributions were made throughout this past year, thirteen key capabilities were released in 2019, which allow you to use SPIFFE and SPIRE to enable strong trust between cloud-native services and other shared services—including databases, service meshes, and public cloud providers. Some enhance ease of deployment and operability, while others offer performance and scalability improvements. These key features include: 

1. __SPIFFE federation:__ This feature allows services in disparate domains identified by independent SPIFFE identity providers, such as SPIRE, to securely authenticate and communicate with each other.  Key use cases for SPIFFE federation include: 

    * Federation between multiple mesh implementations 
    * Federating trust across different domains within an organization

&nbsp; &nbsp; &nbsp; A number of emerging projects and platforms have adopted SPIFFE. This includes Istio, SPIRE, Scytale Enterprise, and several service meshes,  &nbsp; &nbsp; &nbsp; including NGINX (F5 Networks) and Grey Matter (Decipher Technology Studios). SPIFFE federation will enable service interoperability across &nbsp; &nbsp; &nbsp; all these distributed environments.  View this recent session from KubeCon to see how you can [secure communications between meshes and &nbsp; &nbsp; &nbsp; &nbsp; beyond with SPIFFE federation.](https://www.youtube.com/watch?v=cx_NnvbsCP4)

2. __OIDC federation:__ SPIRE now supports OIDC (OpenID Connect). With federation primitives built into SPIFFE and SPIRE, you can directly authenticate to OIDC-compatible validators without having to generate or manage secrets. For example, a system running within an on-premise data center managed by SPIRE can now directly authenticate to cloud platforms like AWS without sharing secrets or private keys. [Here is a video that demonstrates this capability.](https://www.youtube.com/watch?v=db_3LefoG9k&feature=youtu.be)

3. __Database authentication:__ You can now use SPIRE-issued identities to directly authenticate to databases and other systems that support legacy x509 authentication. This approach negates the need for a secret store and instead relies on short-lived asymmetric keys. This approach can also provide traffic encryption. To learn more, [view this demo.](https://www.youtube.com/watch?v=YFll-3jgFrU&feature=youtu.be)

__Ease of Deployment and Operability__

4. __Plugin infrastructure refactoring:__ This feature enables plugins to provide auxiliary services, such as health check, to the SPIRE core. You can also request services from the SPIRE core or use server-like telemetry. The Notifier Plugin was added as a result of this refactoring. This plugin detects certain events and then performs an action in response.  An example of this is the Kubernetes Bundle notifier plugin, which resolves a bootstrapping problem within Kubernetes. It publishes the latest trust bundle to a Kubernetes ConfigMap when the SPIRE server is started and the bundle is updated. 
5. __Registration API remote access:__ This enhancement allows remote software services to authenticate against the registration API via SVIDs. It enables greater deployment flexibility by allowing software services to manage registrations, even if these services are not running next to a SPIRE server.
6. __Kubernetes workload registrar:__ This registrar automates the registration of Kubernetes workloads on SPIRE when they are registered in Kubernetes. Using this capability, you can interact exclusively with the Kubernetes API server to get SPIRE fully deployed and operational. [View this link for more details.](https://github.com/spiffe/spire/tree/master/support/k8s/k8s-workload-registrar)
7. __Telemetry and logging:__ These capabilities have been significantly improved, helping engineers better track and troubleshoot performance issues in production environments. Several telemetry points were added, including a SQL datastore plugin. In addition, existing points were audited, augmented, and labeled with meaningful descriptions.  Finally, key health and performance metrics from the SPIRE server can now be exported directly to Prometheus, Statsd, and DataDog.
8. __Upstream plugin for AWS Secrets Manager and AWS Certificate Manager:__ This plugin enables you to use AWS Secrets Manager or AWS Certificate Manager as an upstream signing authority for SPIRE-issued identities. It can improve your security posture since keys do not need to be stored on disk. 
9. __MySql support:__ Now, MySql can be used to store configuration data for the SPIRE server.
10. __Docker-based workload attestor:__ This capability enables you to use selectors based on Docker labels and the container's image ID.
11. __Improved documentation:__ New documentation enhancements make it easier to get started on SPIFFE and SPIRE. Documentation now includes a guide for getting started with Kubernetes, as well as use cases and case studies. You can find these on SPIFFE.io. 

__Performance and Scalability Improvements__

12. __Nested SPIRE:__ This new capability enables you to organize your SPIRE deployment into a hierarchy in which one SPIRE server can deliver CA identities to a downstream SPIRE server. This enables you to segregate your SPIRE deployment so you can improve fault management and resiliency. 

13. __Performance improvements:__ The team made several performance improvements, particularly within the datastore plugin. These enhancements optimize database performance and speed up scale-related hot spots. 

HPE and the Scytale team are grateful for all the contributors that help keep the momentum going with SPIFFE and SPIRE. The Scytale team is now working along with the HPE DEV team to expand contribution opportunities. We’re looking forward to even more contributions in 2020. 




