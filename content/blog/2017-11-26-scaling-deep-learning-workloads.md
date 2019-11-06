---
title: Scaling deep learning workloads
date: 2017-11-26T09:38:36.284Z
author: Sergey Serebryakov 
tags: ["deep-learning-cookbook"]
path: scaling-deep-learning-workloads
---
# Data parallelism, weak and strong scaling, and what you need to know to scale a single training job to multiple CPUs or GPUs 
Training of many state-of-the-art deep neural networks is a very compute-intensive task. It can take hours, days or even weeks to train a model with a single computational  device, such as a CPU or GPU. To speed up the training, you have to scale out, to distribute the computations to multiple devices. The most commonly used approach to distribute the training is `data parallelism`, when every computational device possesses its own replica of a model and computes a model update based on its own shard of data. Two options are possible for data parallelism: `Strong` and `weak` scaling. HPE's [Deep Learning Benchmarking Suite](https://hewlettpackard.github.io/dlcookbook-dlbs) supports both.

#### __Strong scaling__
Strong scaling assumes that the problem size remains the same and we vary the number of computational devices. From a deep learning point of view it means that we fix a batch size and vary a number of CPUs/GPUs to train a neural network. For instance, given a batch size of 1024 training samples, an eight-GPU system will give us the following benchmarking configurations:

| #GPUs |     GPUs IDs    | per-GPU batch size | effective batch size |  
|-------|-----------------|--------------------|----------------------|
|   1   | 0               |        1024        |         1024         |
|   2   | 0,1             |         512        |         1024         |
|   4   | 0,1,2,3         |         256        |         1024         |
|   8   | 0,1,2,3,4,5,6,7 |         128        |         1024         |

The efficiency of strong scaling is calculated in the following manner: 

```
efficiency = t1 / (N * tN) * 100% 
```
Where _t1_ is the time of solving a problem with one compute device, _N_ is the number of compute devices, and _tN_ is the time to solve the same problem with these N devices. For instance, an ideal case is when the _tN_ time is _N_ times smaller than _t1_ and we get ideal efficiency of 100%.

With strong scaling, an `effective batch size` is constant, and per-device batch size is varying. In case of synchronous training, strong scaling with multiple devices is equivalent to training with a single device. The effective batch will be the same, and model updates will happen based on gradients computed for the same number of training samples. 

#### __Weak scaling__
Weak scaling assumes we keep the amount of work per compute device per iteration fixed. With _N_ compute devices we end up solving _N_ times larger problem than with one. In deep learning world it means we keep per-device batch size fixed. With the same hardware setup as it is described above, we get the following benchmarking configurations assuming that the per GPU batch size is 128:

| #GPUs |     GPUs IDs    | per-GPU batch size | effective batch size |  
|-------|-----------------|--------------------|----------------------|
|   1   | 0               |        128         |         128          |
|   2   | 0,1             |        128         |         256          |
|   4   | 0,1,2,3         |        128         |         512          |
|   8   | 0,1,2,3,4,5,6,7 |        128         |        1024          |

The efficiency of weak scaling is calculated in the following way: 

```
efficiency = t1 / tN * 100% 
```
Where _t1_ is the time of solving a problem with one compute device and _tN_ is the time to solve the _N_ times larger problem with _N_ compute devices. Ideally the _tN_ time is exactly the same as _t1_ and we get ideal efficiency of 100%.

With weak scaling, a per-device batch size is constant and the `effective batch size` increases with the assignment of more compute devices to the training job.

It is much easier to utilize a larger number of compute devices efficiently with weak scaling, as the amount of work per unit doesn't decreases when more units are added. At the same time, weak scaling may lead to very large effective batches, when convergence will suffer, and it won't be faster after all.

## Multi-GPU benchmarking with DLBS
All supported frameworks (BVLC/NVIDIA Caffe, Caffe2, MXNet and TensorFlow) can be benchmarked in a multi-GPU mode, excluding Intel's fork of Caffe and apparently NVIDIA's inference engine TensorRT. 


### Weak scaling
The default option implemented in DLBS is a `weak` scaling. Users need to provide a `--exp.device_batch` and `exp.gpus` parameters. The first one is an integer value specifying a per-GPU batch size. The second one is a comma-separated list of GPU identifiers. For instance, the following command line launches TensorFlow benchmark with ResNet50 on a an eight-GPU system with a per GPU batch size being equal to 32:

```bash
python experimenter.py run -Pexp.framework='"tensorflow"' \
                           -Pexp.model='"resnet50"' \
                           -Pexp.gpus='"0,1,2,3,4,5,6,7"' \
                           -Pexp.device_batch=32 \
                           -Pexp.bench_root='"./benchmarks/my_experiment"'\
                           -Pexp.log_file='"${exp.bench_root}/tf_resnet50.log"'
```

DLBS will compute internal parameter `exp.effective_batch` by multiplying number of GPUs by a per-GPU device batch size:

```json
{
    "exp.num_gpus": "$(len('${exp.gpus}'.replace(',', ' ').split()))$",
    "exp.device": "$('gpu' if ${exp.num_gpus} &gt; 0 else 'cpu')$",
    "exp.effective_batch": "$(${exp.num_gpus}*${exp.device_batch} if '${exp.device}' == 'gpu' else ${exp.device_batch})$"
}
```

### Strong scaling
There are several ways to benchmark strong scaling. One is to correctly adjust a per-device batch size with parameter `exp.device_batch` so that the effective batch size does not change. The mechanism of [extensions](https://hewlettpackard.github.io/dlcookbook-dlbs/#/intro/intro?id=extensions) can effectively be used to disable certain benchmarks that result in non-desirable effective batch sizes.

The second approach is to provide effective batch size as a base parameter and compute per-device batch size based on it. For instance, to explore Caffe2's strong scaling with AlexNet model with 1024 images in a batch on an eight-GPU system, users can run the following command:

```bash
python experimenter.py run -Pexp.framework='"caffe2"' \
                           -Pexp.model='"alexnet"' \
                           -Vexp.gpus='["0", "0,1", "0,1,2,3", "0,1,2,3,4,5,6,7"]' \
                           -Pexp.effective_batch=1024\
                           -Pexp.device_batch='"$(${exp.effective_batch}/${exp.num_gpus})$"'\
                           -Pexp.bench_root='"./benchmarks/my_experiment"'\
                           -Pexp.log_file='"${exp.bench_root}/${exp.id}.log"'
```

For an introduction to specifying benchmark configurations, read the [introduction](https://hewlettpackard.github.io/dlcookbook-dlbs/#/intro/intro) section. For commonly used parameters and framework specific parameters, read the [parameters](https://hewlettpackard.github.io/dlcookbook-dlbs/#/parameters/parameters?id=parameters) and the [framework specific parameters](https://hewlettpackard.github.io/dlcookbook-dlbs/#/frameworks/frameworks?id=frameworks) sections.

### BVLC/NVIDIA Caffe
The family of Caffe frameworks supports multi-GPU training with the NCCL/NCCL2 library. The only configuration parameter that affects this is the comma-separated list of  GPUs, `exp.gpus`.

### TensorFlow
We use the [tf_cnn_benchmarks](https://github.hpe.com/labs/dlcookbook/tree/master/python/tf_cnn_benchmarks) project as a backend for TensorFlow framework. The following parameters affect multi-GPU training:

1. `exp.gpus` Comma separated list of GPUs to use.
2. `tensorflow.var_update` The method for managing variables: _parameter\_server_, _replicated_, _distributed\_replicated_, _independent_ ([source code](https://github.hpe.com/labs/dlcookbook/blob/master/python/tf_cnn_benchmarks/tf_cnn_benchmarks.py#L164)).
3. `tensorflow.use_nccl` Whether to use nccl all-reduce primitives where possible ([source code](https://github.hpe.com/labs/dlcookbook/blob/master/python/tf_cnn_benchmarks/tf_cnn_benchmarks.py#L168))
4. `tensorflow.local_parameter_device` Device to use as parameter server: cpu or gpu (see [source code](https://github.hpe.com/labs/dlcookbook/blob/master/python/tf_cnn_benchmarks/tf_cnn_benchmarks.py#L92))

### Caffe2
In the current version of a [Caffe2 backend](https://github.hpe.com/labs/dlcookbook/tree/master/python/caffe2_benchmarks), the only parameter that affects multi-GPU training is `exp.gpus`.

### MXNet
Currently, in our [MXNet backend](https://github.hpe.com/labs/dlcookbook/tree/master/python/mxnet_benchmarks) two parameters affect multi-GPU training:

1. `exp.gpus` Comma-separated list of GPUs to use.
2. `mxnet.kv_store` A method to aggregate gradients 'local', 'device', 'dist\_sync', 'dist\_device\_sync' or 'dist\_async'. See [this page](https://mxnet.incubator.apache.org/how_to/multi_devices.html) for more details.

## References
1. [Modeling Scalability of Distributed Machine Learning](https://arxiv.org/pdf/1610.06276.pdf).
2. [Measuring Parallel Scaling Performance](https://www.sharcnet.ca/help/index.php/Measuring_Parallel_Scaling_Performance)