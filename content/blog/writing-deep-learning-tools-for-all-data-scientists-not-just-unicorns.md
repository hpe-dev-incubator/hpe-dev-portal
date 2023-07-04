---
title: Writing Deep Learning Tools for all Data Scientists, Not Just Unicorns
date: 2022-02-11T15:45:26.028Z
author: By Neil Conway and Alex Putnam
authorimage: /img/Avatar1.svg
thumbnailimage: /img/updated-unicorns-picture-smaller.png
tags:
  - determined-ai
  - HPC
  - AI
  - Deep Learning
  - data-scientist
  - data-ml-engineer
  - hpe-machine-learning-development-environment
---
Machine learning (ML) is exploding in popularity, and, as it does, ML tooling is frantically trying to keep up. Tools for everything you can imagine are popping up: data versioning, experiment tracking, model serving, and, yes, even tools to help ML run on Kubernetes. Although some projects are more popular than others, given the newness of this space, there are no clear winners yet and no one has yet established the perfect set of software to enable and accelerate ML.

## Here’s the problem – Kubernetes

Kubernetes is one of the most important pieces of software produced in the last decade and one of the most influential open source projects ever. It was ***built by software engineers specifically for software engineers*** to orchestrate containers in the new cloud-native/DevOps paradigm and has completely revolutionized how applications are developed and how infrastructure is deployed and managed. Given the ease of being able to spin up and down a service, developers now have easier access to more GPU time, resulting in an increased popularity of computationally-demanding applications like deep learning (DL).

As a result, however, the tools that have been developed to train DL models require data scientists to use and understand Kubernetes. If you look at the knowledge base of a data scientist versus a software engineer, you’ll understand why there are two different titles. The few whose skills overlap are considered unicorns… those that can be found are few and far between.

<center><img src="/img/updated-unicorns-picture-smaller.png"></center>

If you happen to be a Unicorn, congratulations! You can use your magic to wield Kubernetes and Deep Learning together and build something beautiful. The rest of us, though, get pretty annoyed when we need to dive deep into computer systems engineering before we can make progress developing new ML models. The crazy thing is, this hassle is completely avoidable! We just need to start developing **ML tools built for data scientists, not software engineers**.

## Diving Deeper

Let’s take a quick look at [Kubeflow](https://www.kubeflow.org/) to understand where ML tooling has gone wrong.  Kubeflow started as an adaptation of how Google was running TensorFlow internally, as a tool that allowed *TensorFlow to run on Kubernetes*. This technology was *very* impactful, creating a much simpler way to use hardware managed by Kubernetes to do deep learning.

That initial version of Kubeflow is now the Kubeflow component called [TFJob](https://www.kubeflow.org/docs/components/training/tftraining/). Without TFJob, running TensorFlow on Kubernetes would be miserable — you would need to specify a complex topology of containers, networking, and storage before you could even start writing your ML code. With TFJob, this is simplified, but, crucially, *it is not nearly simple enough*. To use TFJob, you need to:

***Wrap your ML code up neatly in a container.*** This will be a clunky experience that will require you to package your code and upload it if you want to make changes. Docker is great, but this will slow down your development cycle significantly.

***Write a Kubernetes TFJob manifest.*** This might not sound that intimidating, but for a data scientist not fluent in Kubernetes it can be a daunting task. To do this well, you’ll need to learn a lot about Kubernetes — a far cry from the Python that these scientists are used to. Let’s look at the *most simple version of this, from the Kubeflow docs*:

```yaml
apiVersion: kubeflow.org/v1
kind: TFJob
metadata:
  generateName: tfjob
  namespace: your-user-namespace
spec:
  tfReplicaSpecs:
    PS:
      replicas: 1
      restartPolicy: OnFailure
      template:
        metadata:
          annotations:
            sidecar.istio.io/inject: "false"
        spec:
          containers:
          - name: tensorflow
            image: gcr.io/your-project/your-image
            command:
              - python
              - -m
              - trainer.task
              - --batch_size=32
              - --training_steps=1000
    Worker:
      replicas: 3
      restartPolicy: OnFailure
      template:
        metadata:
          annotations:
            sidecar.istio.io/inject: "false"
        spec:
          containers:
          - name: tensorflow
            image: gcr.io/your-project/your-image
            command:
              - python
              - -m
              - trainer.task
              - --batch_size=32
              - --training_steps=1000
```

This configuration file is **full** of concepts that are foreign to most data scientists. Pods, replicas, sidecars, restart policies, Kubernetes APIs — all of this is confusing, complex, and detracts from our ability to focus on data science.

***Learn the Kubernetes CLI.*** This is minor, but again navigating Kubernetes is not a trivial thing to figure out. Submitting jobs may be relatively straightforward, but seeing results, artifacts, and logs of experiments is unintuitive and clunky.

If you think about where this all came from, it makes sense that it evolved as it did. As this is an adaptation of the technology that Google uses to train DL models, and Google (unlike the rest of the world) tends to have a lot of unicorns, running Deep Learning on Kubernetes for them wasn’t a big deal. 

But not everyone is a Google unicorn – many other highly-skilled data scientists simply bounce off of Kubeflow because Kubernetes is too far outside of their comfort zone.

If you look at some of the other components of Kubeflow, you’ll find similar philosophies: **MPIJob**, **PyTorchJob**, and **Katib** all expect data scientists to work with Kubernetes concepts and APIs. All of them suffer from the exact same usability issues — most data scientists don’t want to dive into the weeds of how Kubernetes is orchestrating the hardware; they just want an easier way to train their models. They want tools that abstract away foreign concepts and let them communicate ML concepts succinctly.

One fascinating thing about Kubeflow is that some of the components of Kubeflow have clearly figured this out and realized that we can do better! The best example is **Kubeflow Pipelines** (KFP). The core underlying technology of Kubeflow Pipelines is [Argo Workflows](https://github.com/argoproj/argo), which are very similar to TFJob, providing a way to declare workflows in Kubernetes. **Kubeflow Pipelines** goes the crucial extra step of providing a Domain Specific Language that allows data scientists to write pipelines *in Python*! The builders of KFP realized that building containers and writing Kubernetes manifests wasn’t how data scientists wanted to interact with their work, so they ***abstracted away the k8s*** and made a tool that data scientists love.

## Where do we go from here?

The key to providing ML practitioners with tools they’ll actually use is to truly understand them – what they like and dislike about their workflows – and then enhancing what they like and slicing out what they don’t. ML tools should allow data scientists to accomplish more with less work. When developing tools for data scientists, it’s important to avoid thinking about them as software engineers, and instead build tools that allow ML people to build, train, and deploy ML models without needing to become DevOps experts. 

Abstractions here can help. Abstractions make it possible to perform high-performance data science on complex, modern infrastructure without needing to be a systems expert. Designing the right abstractions is not easy but it is crucially important to making modern ML more accessible, more convenient, and more cost-effective.

## Consider Determined AI – a tool that speaks your language

[Determined AI](https://developer.hpe.com/platform/determined-ai/home/) accomplishes many of the same goals as a tool like Kubeflow — allowing scientists to build and train deep learning models on Kubernetes (or any hardware, really), but without expecting data scientists to master countless new technologies along the way.

Compare a Determined configuration file to the TFJob configuration above:

```yaml
description: cifar10_pytorch
hyperparameters:
  learning_rate: 1e-4
  learning_rate_decay: 1e-6
  layer1_dropout: 0.25
  layer2_dropout: 0.25
  layer3_dropout: 0.5
  global_batch_size: 32
records_per_epoch: 50000
searcher:
  name: single
  metric: validation_error
  max_length:
    epochs: 32
entrypoint: model_def:CIFARTrial
```

This configuration accomplishes essentially the same goal — describing an ML training workflow. The big difference is that this configuration is *written in the language of data scientists*, with complicated infrastructure concepts abstracted away using terms they are comfortable with, like hyperparameters, epochs, metrics, etc.

This means that users can do more with less. Instead of having to learn Kubernetes or configure a cluster of machines to work with Horovod, they simply need to install Determined and describe experiments with their own terms. Determined unlocks incredibly powerful tools like [distributed training](https://www.determined.ai/blog/faster-nlp-with-deep-learning-distributed-training/), [hyperparameter search](https://www.determined.ai/blog/why-does-no-one-use-advanced-hp-tuning/), and experiment tracking, without placing extra burden on the user to understand what is happening behind the scenes. Determined has carefully built [powerful abstractions that allow data scientists to focus on science](https://www.determined.ai/blog/standardized-models-with-determined/), and not engineering, systems, and infrastructure.

To see it in action, [start with our quick start guide](https://docs.determined.ai/latest/tutorials/quick-start.html)! Determined is open source, so you can see how we do it in our [GitHub repository](https://github.com/determined-ai/determined). To learn more about the issues surrounding today’s DL infrastructure tools and how Determined AI helps resolve them, view this replay of the HPE DEV Munch & Learn seminar on [Golden Age of AI, Dark Ages of AI Infrastructure](https://www.youtube.com/watch?v=ktZFLD-9qgw&list=PLtS6YX0YOX4f5TyRI7jUdjm7D9H4laNlF ).

If you have any questions along the way, [hop on our community Slack](https://join.slack.com/t/determined-community/shared_invite/zt-cnj7802v-KcVbaUrIzQOwmkmY7gP0Ew); we’re happy to help!