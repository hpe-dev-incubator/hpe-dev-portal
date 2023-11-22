---
title: "Kubernetized Machine Learning and AI Using KubeFlow"
date: 2021-02-05T07:00:42.136Z
author: Rachel Silver 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","machine-learning","AI","kubeflow"]
authorimage: "/img/blogs/Avatar3.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019 may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
"authorDisplayName": "Rachel Silver",
"publish": "2018-08-28T07:00:00.000",
"tags": "nosql"
```

---

In my previous blog, [End-to-End Machine Learning Using Containerization](/blog/EEVLz2X9vmSmZg6k6Dqx/end-to-end-machine-learning-using-containerization), I covered the advantages of doing machine learning using microservices and how containerization can improve every step of the workflow by providing:

*   Personalized Development Environments
*   Agile Training Capabilities
*   Microservices Frameworks for Model Serving

Today, I'd like to talk about an example open source framework called [KubeFlow](https://www.kubeflow.org/). The KubeFlow infrastructure provides the means to deploy best-of-breed open source systems for machine learning to any cluster running Kubernetes, whether on-premises or in the cloud.

## Introduction to KubeFlow

As Suzy Visvanathan states in her blog, [Containers, Kubernetes, and MapR: The Time is Now](/blog/JM9k0E924rtRj1QgQYnM/containers-kubernetes-and-mapr-the-time-is-now),  "Kubernetes has won the container orchestration war."

While the early playing field was rife with competitors, like Mesosphere Marathon, Google Kubernetes, Docker Swarm, OpenStack Magnum, and VMware Photon, it's become clear that Kubernetes is now the industry's de facto standard. And, as a result, an ecosystem of tools has begun to emerge around Kubernetes, similarly to how it did when Hadoop first emerged from [Apache](https://www.apache.org/).

As it began and remains in the Hadoop ecosystem, the Kubernetes ecosystem is starting out as a conglomerate of occasionally integrated and interrelated tools intended for use by data scientists and data engineers. The advantage so far for Kubernetes, in this regard, has been the ability to deploy pre-built offerings from container registries, allowing tools to be easily downloaded (‘pulled') and deployed on systems, without the traditional install pain around compiling from source that was frequently present in Hadoop ecosystem projects.

And this is sufficient for simple deployments of single containers running isolated processes. But, in most cases, users want to scale workflows up and down, using multiple containers to run parallel processes. In order to do this, templatized offerings and the ability to easily deploy them are needed. The most common way that this is managed in Kubernetes is by using [Helm Charts](https://docs.helm.sh/developing_charts/), [Operators](https://coreos.com/operators/), or ksonnets, which are collections of YAML files that describe a deployment template such that it's reproducible and can be used to generate interconnected pods of containers on demand.

What KubeFlow does is make all of this functionality a bit more user-friendly by providing some of the commonly used machine learning projects as pre-built templatized offerings (ksonnets) that are pretested to integrate together in one Kubernetes [namespace](https://kubernetes.io/docs/tasks/administer-cluster/namespaces-walkthrough/) –not unlike our [MapR Ecosystem Packs](https://docs.datafabric.hpe.com/60/MapREcoSystemPacks.html). The initial list is based off of a common [TensorFlow](https://www.tensorflow.org/) deployment pattern and has been opened up, or ['democratized,'](https://en.wikipedia.org/wiki/Democratization_of_technology) to support other engines and modules.

Here are a few of the offerings that are available in KubeFlow, but the list is always growing:

*   [Jupyter Notebook](http://jupyter.org/index.html): an open source web-based data science notebook
*   [Katib](https://github.com/kubeflow/katib): a hyperparameter tuning framework
*   [TensorFlow training](https://www.kubeflow.org/docs/guides/components/tftraining/): support for TensorFlow training jobs on Kubernetes
*   [PyTorch training](https://www.kubeflow.org/docs/guides/components/pytorch/): support for PyTorch training jobs on Kubernetes
*   [Seldon serving](https://www.kubeflow.org/docs/guides/components/seldon/): a model serving framework for Kubernetes that uses Istio

## Integrating MapR with KubeFlow

MapR and KubeFlow are a very natural fit. Both are modeled on the concept of a namespace but use it to manage separate and complementary functions.

In MapR, the global namespace is the key to unified data access and allows the joining of data across any divide, whether it be geographical or architectural. The MapR Global Namespace allows read/write access to any dataset to which the user has access, as if it were a local resource. This enables data security and isolation at the user, team, and tenant levels, and [MapR-SASL tickets](https://docs.datafabric.hpe.com/60/SecurityGuide/Authentication.html) are used to securely authenticate users.

In KubeFlow, a [Kubernetes namespace](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/) is used to manage cluster compute resources, Kubernetes objects (e.g., pods), and application/job deployments. Namespaces are logical entities that are used to isolate and represent cluster compute resources and jobs at the user and tenant level. [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/) are used to authenticate users and can be set up to synchronize with MapR-SASL tickets for seamless integration with platform security.

![](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/image2-1612508426888.png)

In both cases, namespaces are used for access control and to logically isolate tenant processes and data, which is ideal for multi-tenant organizations looking to easily manage security and performance. These namespaces complement and integrate with each other very nicely, leaving the end user with a seamless experience and the DataOps teams with a simple architecture to manage.

## Conclusion

Containerization and a microservices architecture are critical across the entire data science workflow from prototyping to monitoring models in production. KubeFlow is a possible solution that does a really nice job of solving administrative and infrastructure problems while still allowing users to select their own tools. And, with MapR, these workflows can benefit from a best-of-breed data platform to speed the time from sandbox to production.