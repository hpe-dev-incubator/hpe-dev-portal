---
title: Developing an open source metadata framework to enhance the ML pipeline
  experience
date: 2023-01-15T18:21:10.768Z
featuredBlog: true
priority: 2
author: Dale Rensing
authorimage: /img/Avatar6.svg
disable: false
tags:
  - opensource
---
In this blog series, you’ll meet some of the open source experts working with the HPE Developer Community team. In this post, I’ll be interviewing Annmary Justine K who works in the HPE AI Research Lab on foundations and techniques for data centric trustworthy AI. As an AI Expert, she has been looking into areas like data provenance, data versioning, metadata tracking and lineages. Prior to her work in HPE’s AI research lab, she worked in HPE Storage, focused on various products ranging from file, block, and object level storage. She has published multiple research papers and patent disclosures in her 15 years of industry experience.

Annmary began her open source journey by contributing to the Hierarchical Data Format (HDF) standard, a set of file formats designed to store and organize large amounts of data, especially developed for supercomputing applications.  Originally developed at the U.S. National Center for Supercomputing Applications, it is now supported by the non-profit HDF Group, whose mission is to ensure continued development in this area. Annmary’s work was originally focused on HDF5 and then she went on to create Common Metadata Framework.

### How did you first get involved with contributing to open source?

My journey with open source started with the Hierarchical Data Format project. Hierarchical Data Format (HDF) is a set of file formats (HDF4, HDF5) designed to store and organize large amounts of data and is used extensively in scientific data applications. I started by writing a versioning connector for HDF5 that creates separate sub files for each dataset created in HDF5 and mounts these sub-files as external links in the main file. It enables the versioning of HDF5 files at a dataset boundary.  This work exposed me to the need for integrated versioning and metadata management for data and AI pipelines and the discovery of this gap led to the creation of the Common Metadata Framework (CMF).

### Tell me a little more about this project.

Common Metadata Framework is a metadata tracking library for machine learning (ML) pipelines. Its power lies in its ability to track distributed lineages for pipelines and to track lineages from different experiment variants. It provides abstractions to support datacentric AI /ML development and allows you to gain better insights into the versions of data and artifacts. The information can be exported, i.e. via Openlineage. As such, it is not locked into the platform and can be shared from this platform to others for metadata sharing and collaborative development. It provides a framework to exchange metadata among different team members and enables a Git-like model for the sharing of metadata, making it unique from the other experiment management frameworks in the market. It enables users to push their local metadata to the remote repository, where it is merged to create the global metadata and pulls metadata from the global metadata to the local, to create a local view, which would contain only the metadata of interest.

The information collected by CMF can provide interesting insights about your AI pipelines. For example, it can help identify what could be the sphere of influence of a corrupted dataset. What other downstream artifacts or models were affected by a tainted dataset? How did your model perform for a particular subset of data versus another subset? What other experiments were executed with the dataset and which of these provided the best results? What different intermediate artifacts were created while developing a particular model? These are only some of the questions the information gathered can answer.

These insights not only help in terms of traceability and reproducibility of pipelines. They can also be used to optimize the performance of the pipelines. Pipelines can be optimized for their execution time, execution metrics, carbon footprint etc. The insights can also be used to provide other valuable additions, like providing high-quality representative data from huge volumes of unlabeled datasets.

### How did you get involved with this project?

The HPE AI research lab started CMF from the ground up when the group realized that there was a gap in the ecosystem for a platform that enables the exchange of AI/ML metadata. Reproducibility in AI/ML pipelines are possible only when one knows the source code version, the data version and hyper parameters being used. Tracking this metadata enables the creation of trustworthy models. Although there are many metadata tracking tools in the field, we realized that there is no single framework that enables the integrated tracking of all of these while also enabling the ability to freely share this metadata. That is when we came up with CMF.  We have built CMF on top of existing open source tools (e.g. DVC and ML Metadata) so that we didn’t end up reinventing the wheel and instead provided added value.

### What excites you about your role here?

Being the creator of a new open source project was challenging. Working in open source enables you to don multiple hats at the same time. The role also allows you to stretch beyond your technical skills. It provides opportunities to present your work, collaborate with teams outside of the company, and work towards creating value not just for one company but society at large.  

### What things are you working on right now in regards to this project?

We have just scratched the surface with Common Metadata Framework. The metadata collected from AI pipelines enables further optimization and we are building intelligence for that.  We are working on multiple use cases found in the science community. One specific use case is the High Energy Physics Particle Tracking Pipeline. Deep learning-based pattern recognition methods are now regularly used for High energy Physics (HEP) particle tracking. The leading techniques involve successive filtering of detector impact cloud points from sensors in collider experiments to isolate possible trajectories of exotic particles. This involves metric learning using fully-connected multi-layer perceptron’s, binary classifiers for edge filtering and a graph neural network (GNN) to improve purity of selected points. This work faces numerous challenges, including large datasets and a large parameter space with cascaded inputs/outputs making optimization difficult. Distributed algorithm development and multiple compute environments (HPC, on-prem & cloud) add to the complexity. CMF has been applied in scenarios like this to capture metadata for the entire experiment population by capturing data lineage, metrics, network architecture and hyperparameters. We are working towards optimizing this pipeline to provide a faster turnaround time for experiments and improve model performance.

### Do you have any advice you’d like to pass on?

When working with open source it is important to realize that the road ahead is long and may not provide instant results. Adoption may come only after consistent effort and building a lot of tools around it. You need to continue to persevere and work towards your goals incrementally. 

Open source also offers the opportunity to collaborate and work together with a broader community. It is important to work in tandem with other tools in the ecosystem so that, together, you create a more enhanced ecosystem.
