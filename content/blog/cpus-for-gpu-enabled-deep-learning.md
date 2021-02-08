---
title: "CPUs for GPU-enabled deep learning"
date: 2017-11-26T09:48:58.426Z
author: Sergey Serebryakov 
tags: ["deep-learning-cookbook"]
path: cpus-for-gpu-enabled-deep-learning
---
# A role of CPUs in Deep Learning pipelines and how many CPU cores is enough for training on a GPU-enabled system

## How CPUs are typically used in deep learning pipelines

Although GPUs are the main engine today used to train deep neural networks, training is not possible without CPUs. And not only because a CPU is required to manage GPU kernels. It has other tasks to perform.

### Preprocessing
A common use for CPUs in Deep Learning pipelines is to perform data preprocessing. There are several reasons why preprocessing should be done on CPUs.

* CPUs provide the ability to overlap data preprocessing with training. In this case two operations happens simultaneously: 1) preparing data for a next batch (on CPUs), and 2) optimizing a neural network on a current batch (on GPUs). The main goal is to constantly keep GPUs busy crunching numbers. We want GPUs to be focused on training and not waiting for the next batch of samples to be ready.
* An opportunity to stage the data feeding pipeline with CPUs, if data is stored in a high latency storage. With CPUs the pipelined process looks as follows (see reference below for TensorFlow high performance models that introduced this schema):
  * Stage 1: Copy data from database or remote file system into a host memory;
  * Stage 2: Preprocess data on CPUs and store result in host memory;
  * Stage 3: Copy preprocessed data from host memory to GPU memory.
* If raw training data is large and needs to be transformed during the preprocessing (for image classification, this may mean resizing original high resolution images to a standard _256x256_ resolution), doing it on GPUs has the following implications:
  * Copying large volumes of data from host memory to GPU memory via PCIe lanes;
  * Allocating large amount of expensive GPU memory for data preprocessing, stealing it from training operators.
* For preprocessing on GPUs there should exist efficient GPU implementation of preprocessing operations
* Some frameworks like TensorFlow, if doing preprocessing on GPUs:
  * Will first copy data from host memory to GPU memory;
  * Will do preprocessing on GPU;
  * Will copy preprocessed data back to host memory;
  * Will copy again preprocessed data to GPU memory.
* CPUs are a better fit for certain data transformation tasks than GPUs.

## How many cores/CPUs do we need?

How do we decide how many CPUs (and how many cores per CPU) do we need to run a training job on a GPU-enabled system?

* One factor to consider is the memory bandwidth. The optimal number of CPU cores is the number of cores that saturate memory bandwidth. If we have more cores, they start to fight for memory access slowing down the entire preprocessing pipeline.

* The topology of a neural network and its computational profile also influences the choice of CPU cores. Deeper models with higher computational complexity take a longer time for a single forward/backward pass to complete, leaving enough time for a CPU to prepare the next batch of training samples.  Neural network models with lower computational complexity may benefit from more CPU cores, as it will speed up the preprocessing and prevent the GPUs from being stalled while waiting for the next batch of data.

* If data preprocessing is overlapped with forward/backward passes, we need at least two CPU cores for a one-GPU system. One core is responsible for launching CUDA kernels for each layer/operator in forward/backward passes. The second core is responsible for prefetching data for the next batch.

Let's now discuss some of the options in greater details. 

### Option 1: No CPU/GPU overlapping.
   The simplest approach is to not overlap preprocessing with training. We first fetch data from data store, preprocess it, copy it to GPU, compute gradients and update weights. We then continue to fetch data for a next batch. Can this be efficient? It depends on where data is stored and on the computational complexity of the model. Several observations to take into account:

  * If a model is computationally expensive, data feeding may take a relatively small time compared to forward/backward passes on a GPU. In this case the difference in time between overlapped and sequential processing may be small and may not worth the trouble of an overlapped option.
  
  * If data is stored on a low latency storage with a high bandwidth interconnect, data fetching may not be an issue either.
  
  * If data is already preprocessed, and data fetching is fast enough, again, one might skip overlapping.

### Option 2: Overlapping CPU/GPU with non-pipelined preprocessing
   In general case, we need one CPU core per GPU to run CUDA kernels and <i>M</i> cores to do prefetching/preprocessing. _M_ will depend on the complexity of preprocessing and the complexity of the model. If we want to copy data asynchronously, we need an additional CPU core per GPU for that.

### Option 3: Overlapping CPU/GPU with pipelined preprocessing
  Google in a blog post on high performance TensorFlow models suggests that it makes sense to use pipelined (staged) preprocessing routines. In particular, they suggest having three running stages:
  * Fetching data from remote storage into host local memory
  * Preprocessing data in host local memory
  * Copying data from host memory to GPU memory
  The three stages communicate to each other via queues. In this case, we need at least three CPU cores for preprocessing.

## Data preprocessing with popular frameworks
### Caffe
Caffe's default data layers (written in C++) can have one background thread to prefetch data. They can prefetch up to <i>prefetch_count</i> batches. That prefetching thread is responsible for fetching data and preprocessing it. It then copies data to GPU in asychnronous mode. Having multiple prefetched batches will result in larger memory consumption. This basically means that we need just two CPU cores per GPU. But you can write your own, non-standard data layer that will take advantage of multiple prefetch threads.

### TensorFlow
A great post on efficient data feeding is the [TensorFlow high performance models]
(https://www.tensorflow.org/performance/performance_models). In theory, we can utilize as many cores as we have.