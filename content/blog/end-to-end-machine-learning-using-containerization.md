---
title: "End-to-End Machine Learning Using Containerization"
date: 2021-02-05T06:50:53.739Z
author: Rachel Silver 
tags: ["hpe-ezmeral-data-fabric","hpe-ezmeral","MapR","machine-learning","AI"]
authorimage: "/img/blogs/Avatar5.svg"
featuredBlog: false
priority:
thumbnailimage:
---
**Editor’s Note:** MapR products and solutions sold prior to the acquisition of such assets by Hewlett Packard Enterprise Company in 2019 may have older product names and model numbers that differ from current solutions. For information about current offerings, which are now part of HPE Ezmeral Data Fabric, please visit [https://www.hpe.com/us/en/software/data-fabric.html](https://www.hpe.com/us/en/software/data-fabric.html)

## Original Post Information:

```
"authorDisplayName": "Rachel Silver",
"publish": "2018-06-28T10:00:00.000",
"tags": "mapr-platform"
```

---

Lately, we've been talking a lot about containerization and how Kubernetes and MapR can pair up to enhance the productivity of your data science teams and decrease the time to insights. In this multi-part blog series, I will start with a high-level overview of why Kubernetes and containerization are appealing for data science environments. In a later iteration, I will provide an example of a framework that enables Kubernetized data science on your MapR cluster.

Earlier this year, we released the MapR Volume Driver for Kubernetes, which enabled MapR customers to use Kubernetes clusters as extensions of their MapR computing space. This volume plugin provides the ability to mount directories from the MapR global namespace easily to Kubernetes pods, enabling stateful applications to run using your data in place.

![Kubernetes](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2021/1/kubernetes-1612507940753.jpg)

While the [microservices approach](/blog/VqVzX3gAzrT7p5PzPAZA/event-driven-microservices-on-the-mapr-data-platform) is useful for all types of applications, it's particularly well-suited for the data science life cycle, starting with the exploration phase through to model deployment. Let's look at how it could benefit each phase:

## Personalized Development Environments

The need to experiment in isolation is paramount for data scientists during the exploration phase when experimentation with different algorithms is an important part of developing the executable code used for training models. New, innovative, and domain-specific libraries are emerging every day, and data scientists need the ability to experiment with them in an agile way that does not run afoul of IT policy.

Traditionally, client applications have been enabled using edge nodes. But this paradigm has not worked well for data science as, frequently, the data science teams will be comparing the results from multiple algorithms. The overhead to manage these libraries with all of their dependencies in a shared or distributed environment can be very painful for IT. This makes the potential for an isolated experimental environment very appealing for all sides – especially since security is handled around the perimeter of the container.

The ability to run multiple containers in parallel, each containing and running their own set of libraries and tools, dramatically reduces friction between IT and data scientists and serves to enhance the productivity of data science teams overall.

## Training the Trainer: Separating Compute from Storage

Traditionally, compute was kept very close to the data and, frequently, this required that data be moved or replicated across many cluster silos to accomplish a variety of analytical tasks. There's a lot of overhead involved in moving data, so, frequently, less superior tools were adopted to minimize this cost.

The ability to meaningfully separate compute and storage is a breakthrough that allows developers to easily adjust and test different compute footprints. One example would be moving long-running CPU-based workflows to a GPU to get faster results as research or business priorities change.

While this can be useful in the exploration and development phase, it's critical to the training phase. This is the phase when the executable code, typically developed in a data science notebook, is submitted to a scheduler to run against a larger dataset. The output of this job is typically a model, and the faster this training job completes, the more frequently the data scientist can tune their parameters to update and refine their model.

Where containerization really benefits the training workflow is by allowing you to peg your containerized training code to whatever compute resource that you choose, while not requiring you to move any data. In MapR, this is done in Kubernetes using FUSE via the volume plugin. Because this is a POSIX-compliant interface, any Python algorithm can speak to your distributed data store as if it were stored in the container itself.

This sort of flexibility can really make a difference in getting models out of the sandbox and into production quickly.

## Machine Learning Models as Microservices

Microservices have been described as simple, single-purpose applications that work in unison via lightweight communications, such as data streams. They've traditionally enabled developers to more easily build, integrate, and manage their applications in an agile way that had typically been impossible with monolithic applications.

Data science models are typically integrated into applications in order to generate insights, and containerization frameworks are fundamentally [microservices architectures](/blog/0N796xBvYxcyGq8Yo35N/event-driven-microservices-architecture-patterns-and-examples). In this capacity, model deployment architectures benefit greatly from microservices frameworks, because microservices frameworks are typically intended to accommodate functionally and logically isolated applications, running in parallel. This becomes very useful in model deployment scenarios when A/B testing is used, models need to be updated or replaced in place, or inter-model routing can benefit from a streaming data fabric or services mesh.

## In Conclusion

Data science workflows benefit from containerization in every phase of the pipeline from exploration, training, and deploying models into production.

Checkout the next iteration of this series, [Kubernetized Machine Learning and AI Using KubeFlow](/blog/Oj0pNxBE3JsJB02E2KOj/kubernetized-machine-learning-and-ai-using-kubeflow), where we'll dive deep into a new Kubernetes framework that supports end-to-end machine learning and data science.