---
title: Why we created HPE Deep Learning Cookbook
date: 2018-03-21T06:00:26.841Z
author: Natalia Vassilieva, Sergey Serebryakov 
tags: ["hpe-deep-learning-cookbook"]
path: why-we-created-hpe-deep-learning-cookbook
---
A history behind the Cookbook
-----------------------------

In the beginning of 2014, when [Hewlett Packard Labs](https://www.labs.hpe.com/) (still HP Labs back then, within Hewlett-Packard), embarked on its journey towards Memory Driven Computing and [The Machine](https://www.labs.hpe.com/the-machine), “software” people of Labs have been asked to find good applications where something like The Machine will shine. We started with algorithms and problems which were still challenging to run on existing systems. Monte Carlo simulations, graph inference, search space optimization and deep learning were, among others, on our list. We started to model the performance of
these algorithms for different system architectures. How performance will
change, if we have more powerful compute nodes or faster interconnect between
nodes in the system? For deep learning we soon realized that answers largely
depend on a topology of an artificial neural network. An optimal hardware system
to train a deep convolutional neural network is not always the best one to train
a fully connected model. Depending on a model which you want to train (or to use
in production - run inference), you’ll need different hardware to minimize
training or inference time. Similar to cooking, where depending on what do you
want to cook, you need different ingredients in different proportions.

In parallel with our Memory Driven Computing efforts, artificial intelligence
and deep learning started to gain interest from enterprise customers. During our
interactions with customers, we started to hear questions about the choice of
optimal hardware/software environment to run deep learning workloads. How to
choose from a sea of available options today? How to size and configure
infrastructure? A need for the Cookbook became clear.

On our journey towards the Cookbook, we first came up with analytical
performance models to predict performance of various machine learning algorithms
(including deep learning) depending on compute power and a number of compute
nodes in a system, and properties of the interconnect between the compute nodes.
These simple models were useful for rough estimates, but didn’t take into
account many subtitles of compute systems. We had to get into
benchmarking, in addition to analytical modeling, to reason based on real
performance data.

Deep Learning Benchmarking Suite
--------------------------------

We wanted to be able to collect performance data on various hardware systems
with various software and for different deep learning workloads. We wanted the
results to be consistent, reproducible and comparable. This means we need to
make sure that we run exactly the same workloads on multiple systems. We needed
a benchmarking tool. We had several options:

1.  Use existing projects that target the deep learning domain. One of the most
    recognized by a community are [DeepBench](https://svail) from BAIDU and the
    [convnet-benchmarks](https://github.com/soumith/convnet-benchmarks). These
    projects aim at benchmarking low-level functionality such as convolution or
    matrix multiply operations or use simplified models.

2.  Use example training scripts that are part of their respective frameworks,
    something what most companies do. Typical examples are [TensorFlow's
    Inception​,](https://github.com/tensorflow/models/tree/master/research/inception)
    [MXNet's image
    classification](https://github.com/apache/incubator-mxnet/tree/master/example/image-classification)
    and [Caffe2's
    ResNet50​](https://github.com/caffe2/caffe2/tree/master/caffe2/python/examples)

Unfortunately, none of these options provides what we need - a way to collect
performance data for different deep learning workloads (and not only low-level
operations) in a consistent and reproducible manner across a range of software
and hardware combinations. Thus, we decided to create our own tool - [Deep
Learning Benchmarking Suite](github.com/HewlettPackard/dlcookbook-dlbs). It is
open sourced and available on github for everyone who wants to run reproducible
and consistent deep learning benchmarks.

Deep Learning Performance Guide
-------------------------------

We’ve been using Deep Learning Benchmarking Suite internally at HPE for some
time already. We’ve collected a variety of performance data on many hardware and
software configurations, and we continue to collect more and more data. Now we
want to share this data with everyone, so we can guide the choice of optimal
hardware and software environment in the open. Deep Learning Performance Guide
is a tool to do so. It is a web-based tool connected to our vast database of
benchmarking data. We plan to open this tool to the public at the end of March, 2018.
The first version of this tool will be based entirely on data from actual
benchmarks. In the future we plan to incorporate our analytical performance
models into the Performance Guide so it will provide performance estimates for
untested hardware/software configurations alongside with real collected
performance measurements for tested configurations.

Reference Designs
-----------------

Reference designs are the last component of our Cookbook toolset. These are
default hardware recipes for selected classes of deep learning workloads. So far
we have released Image Classification Reference Designs. We created those by
collecting performance data (with our Benchmarking Suite) for most common
convolutional neural networks (widely used for image classification problems),
on multiple hardware and software configurations, and by analyzing the collected
data with Performance Guide.

So, what is in the Cookbook?
----------------------------

HPE Deep Learning Cookbook is a toolset to characterize deep learning workloads
and to guide the choice of optimal hardware and software configurations for any
given workload. It consists of:

-   Deep Learning Benchmarking Suite - a tool to run deep learning benchmarks

-   Deep Learning Performance Guide - a web-based tool to compare and analyze
    the results of deep learning benchmarks. In the next version we will
    integrate into this tool analytical/machine learning models to predict
    performance of deep learning workloads for situations when we cannot run
    actual benchmarks. These performance models already exist, we just need to
    add them to the Performance Guide.

-   Reference Designs - recipes (descriptions) of default recommended hardware
    configurations for classes of selected deep learning workloads, such as
    image classification, natural language processing, speech recognition, video
    analytics, and others.

We created the Cookbook with the following objectives in mind:

1.  To be able to make recommendations to our customers on the optimal
    hardware/software combinations for running their specific and varied deep
    learning workloads for both the development (training) and deployment
    (inference) stages.

2.  To be able to run reproducible and consistent deep learning benchmarks in
    different hardware/software environments that include a range of hardware
    systems, deep learning frameworks and deep learning workloads. This would be
    especially useful for performance benchmarking, capacity planning and
    product qualification.

3.  Provide to the community a standard tool that enables apple to apple
    comparison of various systems.

4.  To be able to validate and justify design options for future products.
