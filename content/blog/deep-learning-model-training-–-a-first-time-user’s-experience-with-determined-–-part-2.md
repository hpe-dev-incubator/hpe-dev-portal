---
title: Deep Learning Model Training – A First-Time User’s Experience with
  Determined – Part 2
date: 2022-05-03T13:51:27.971Z
featuredBlog: false
priority: 8
author: Denis Choukroun
authorimage: https://gravatar.com/avatar/f66dd9562c53567466149af06ae9d4f1?s=192
thumbnailimage: /img/detai-high-levl-architecture-thumbnail-v2.png
tags:
  - determined-ai
  - opensource
  - Ezmeral
  - Kubernetes
  - deep-learning
  - data-scientist
  - data-ml-engineer
  - machine-learning
  - developer
  - hpe-machine-learning-development-environment
---
Determined is an open-source training platform that aims to simplify deep learning (DL) model development and experimentation for data science teams by providing tools like distributing training, automatic model tuning, GPU resource management, and automatic experiment tracking.

In [my previous blog post](https://developer.hpe.com/blog/deep-learning-model-training-%E2%80%93-a-first-time-user%E2%80%99s-experience-with-determined-part-1/), I put on my IT operations manager’s hat and discussed how I deployed Determined on a Kubernetes cluster in an on-premises HPE Ezmeral Runtime Enterprise environment. I also showed how easy it is to get started with the Determined CLI, REST API, and Web User Interface to interact with Determined.

In this second part of the series, using  the Determined setup from Part I, I’ll  assume the role of a data scientist/ML Engineer who wants to:
   
* Explore fundamental Determined concepts and features to train a TensorFlow model
* Track and visualize the progress and results of the training process using a single GPU
* Use distributed training across multiple GPUs and fine-tune the model with state-of-the-art hyperparameter search <br/>

I will also use the Determined Python API in a Jupyter Notebook to load and test the trained model and see how well it performs. I’ll evaluate this by making inferences, which uses a trained model and new, unlabelled data to make predictions. 

## Overview of the Determined training model process
In short, Determined permits data science teams to launch deep learning model training tasks, called ***trials***, for their ported model. These tasks are distributed across one or more GPUs and grouped as a Determined ***experiment*** using a particular set of configuration parameters specified in an ***experiment configuration file***. This configuration file tells Determined how to run the model training process on Determined in terms of many different parameters, including, but not limited to, the following:

* The hyperparameters
* The number of GPUs to use for the training task
* The amount of data on which to train a model
* How often the trial task must report the training metrics and the validation metrics to the Determined Master
* How often the trial task must save the model file

The experiment configuration file and the Python code for the model used to load the datasets, build, optimize, and compile the model are collected in a ***model definition directory***. The directory can optionally contain a startup-hook.sh script to install additional Python dependencies and libraries before the training process starts.

> Note: The Experiment configuration file has required and optional fields.  I’ll explore the most common fields in this post. To learn more about Experiment configuration settings, check out the online documentation [here](https://docs.determined.ai/latest/training-apis/experiment-config.html).

## The use case and the model
To get started with Determined, I need a use case and a model to train in Determined. As a Data Scientist running an experiment on Iris species, I pick the simple and well-known *“Iris classification”* model for predicting the likelihood that the flowers are an Iris species (Iris setosa, Iris versicolor or Iris virginica) based on their sepal and petal length and width measurements. 

To take advantage of Determined's functionalities, I need to port the model to Determined framework APIs such as PyTorch, Tensorflow, and Keras, the most commonly used deep learning frameworks. You can check out the *Iris deep learning model* code  — a TensorFlow Keras based model  — in the [Determined GitHub repository](https://github.com/determined-ai/determined/tree/master/examples/computer_vision/iris_tf_keras) and download the complete code for this use case [here](https://docs.determined.ai/latest/_downloads/b8b05d77875d7d5a43ea2bd4b35fb0f4/iris_tf_keras.tgz). I’ll train the model on the publicly available Iris [training dataset](https://storage.googleapis.com/download.tensorflow.org/data/iris_training.csv) and [validation dataset](https://storage.googleapis.com/download.tensorflow.org/data/iris_test.csv), which consist of 120 samples and 30 samples, respectively. Each sample consists of the following Iris flower properties:

* Features: sepal length, sepal width, petal length, petal width 
* Label: the species of Iris to predict 

I’ve also stored a copy of the datasets in the shared storage volume for my Determined deployment described in the [first post of this series](https://developer.hpe.com/blog/deep-learning-model-training-%E2%80%93-a-first-time-user%E2%80%99s-experience-with-determined-part-1/). I simply changed the model code to ensure the data loader function loads and reads training and validation datasets from the shared storage volume. 

> Note: Porting deep learning model code to Determined is beyond the scope of this blog series. The easiest way to learn how to port an existing deep learning model code to Determined is to start with the [PyTorch Porting tutorial](https://docs.determined.ai/latest/tutorials/pytorch-porting-tutorial.html). 

**Time to see Determined in action!**

## Launching my first experiment to train our model on a single GPU
Let’s start by simply launching an experiment with a single training task for the Iris deep learning model on a single GPU by defining the hyperparameters as fixed values in the experiment configuration file. 

### The Experiment configuration file
Here’s a quick look at the experiment configuration file (*const.yaml*):

```yaml
name: iris_const_testuser1
hyperparameters:    # the hyperparameters to use for the training task
  learning_rate: 1.0e-4
  learning_rate_decay: 1.0e-6
  layer1_dense_size: 16
  global_batch_size: 30  # Number of data records within a batch
resources:
  slots_per_trial: 1 # Default. Use 1 GPU to train the model.
searcher:
  name: single       # Single searcher method disables hyperparameter search (HPO)
  metric: val_categorical_accuracy  # The validation metric to evaluate the performance
  smaller_is_better: false  # The higher the metric the better the performance
  max_length:        # Amount of data on which to train the model
    batches: 5000    # Set in the unit of batches (can be expressed as epochs too)	
entrypoint: model_def:IrisTrial # Starting point of the model code
min_validation_period:
  batches: 1000      # Report validation metrics to Master every 1000 batches
scheduling_unit: 100 # Report training metrics to Master every 100 batches (default) 
bind_mounts:         # Training and validation datasets location in shared volume. Ensure the datasets on the shared volume are accessible to the training tasks.
  - host_path: /opt/bluedata/mapr/mnt/<DataFabric-clusterName>/exthcp/tenant-<ID>/fsmount/repo/data
    container_path: /opt/bluedata/mapr/mnt/<DataFabric-clusterName>/exthcp/tenant-<ID>/fsmount/repo/data
    read_only: true
```

At a glance, this configuration YAML file is full of concepts that data scientists and ML engineers are familiar with, such as hyperparameters, batches, batch size, metrics, etc. In other words, using the experiment configuration file allows me, as a data scientist, to describe experiments with the terms I’m familiar with. From this file, Determined can take care of the model training for me.

### Creating the experiment
With the *const.yaml* experiment configuration file and the model code in the model definition directory, after being authenticated as a Determined user (`det user login <username>`), I’m going to start an experiment using the Determined CLI command line:  

```bash
det experiment create const.yaml <model-definition-directory>
```

Determined returns the experiment_Id and schedules the training task as a Kubernetes POD in my Kubernetes cluster. The POD container has all the libraries and dependencies required for training typical deep learning models with common deep learning frameworks like PyTorch, TensorFlow, and Keras.

I can then use a couple more Det CLI commands to track the execution progress of my experiment:

```bash
det experiment list | tail -1
det experiment describe <my-experiment-Id>
```

Once the experiment completes, I can use the CLI command below to discover the performance metric for the best version of the validated model for my experiment:

```bash
det experiment list-checkpoints --best 1 <my-experiment-Id>
```

### Visualizing and inspecting the learning curve of the trained model
I can also access information on both training and validation performance for my experiment using the Determined WebUI. From the dashboard I see my experiment status, as shown in the following screenshot: 

![Determined WebUi Dashboard](/img/webui-myexp-const-status.png "Determined WebUi Dashboard")

Selecting the experiment, I visualize the learning curve, which shows the model validation and training accuracy metric over the number of completed batches:

![Experiment performance visualization](/img/webui-myexp-const-graph.png "Experiment performance visualization")

Here, I see the graph changing in real-time as the experiment runs. Determined plots training metrics every ***100 batches*** of training data (the purple line) by default. Validation metrics (the blue line) are plotted every ***1000 batches*** over the amount of data (5000 batches) based on the parameters I specified in the experiment configuration file.

I can also see the training and the validation metrics along with the checkpoints, which are the saved versions of the best-validated model. With the default checkpoint collection policy, Determined will checkpoint and save to a file the most recently validated model and the best model per training task (trial). If the most recent checkpoint is also the best checkpoint for a given trial, only one checkpoint will be saved for that trial, as in my example above.

For data scientists familiar with TensorBoard, Determined also provides learning curve visualization through TensorBoard. I can launch a TensorBoard task from the WebUI or by using the Det CLI command below to start an instance of TensorBoard server in Determined. 

```bash
det tensorboard start <Experiment-Id>
```

The TensorBoard server instance will be launched as a container POD in the Kubernetes cluster. To stop the instance, I just use the command: 

```bash
det tensorboard kill <tensorboard-Id>
```

### Evaluating the model by making inferences using a local Jupyter Notebook
With the model trained and the best model files saved on the shared storage volume for my Determined deployment, I can now download the checkpoint files for the best version of the model, test it and see how well it performs using the [Determined Python API](https://docs.determined.ai/latest/interact/api-experimental-client.html). Using the command below, I simply start a **CPU-only** JupyterLab server instance with a bind-mounting configured to ensure that the validated model file and checkpoint files are accessible by the JupyterLab instance. Like any other task launched in Determined, the JupyterLab instance is launched as a container POD in the Kubernetes cluster.

```bash
det notebook start --config-file Notebook-config.yaml
```

The *Notebook-config* YAML configuration file below is used to control a JupyterLab instance deployment. When downloading checkpoints from a shared file system, Determined assumes the checkpoints location is mounted to the mount point ***determined\_shared\_fs*** inside the JupyterLab POD container. To learn more about Jupyter Notebook in Determined, check out the [Notebook documentation](https://docs.determined.ai/latest/features/notebooks.html) and [a recent Determined’s blog post on this topic](https://www.determined.ai/blog/maximize-juptyter-notebook-experience-determined).

```yaml
description: My-notebook
resources:
  slots: 0  # Launch a Notebook that does not use any GPU
bind_mounts: # Validated model checkpoints location in the shared volume
  - host_path: /opt/bluedata/mapr/mnt/<DataFabric-clusterName>/exthcp/tenant-<ID>/fsmount/checkpoints
    container_path: /determined_shared_fs # Mount point the host_path is mounted to inside the JupyterLab POD container 
idle_timeout: 30m
```

With the JupyterLab instance deployed, I use the `det notebook list` command to get the Notebook-Id, then connect to a Jupyterlab instance using my browser at the following URL: http://\<DET\_MASTER\_URL\>/proxy/\<Notebook-Id\>. 

Finally, I use the Determined [Python Client API](https://docs.determined.ai/latest/interact/api-experimental-client.html) and its TensorFlow Keras [Checkpoint API](https://docs.determined.ai/latest/post-training/use-trained-models.html) in the following Python code example to download the best model file, load it into memory as a Python process for TensorFlow Keras based model, and make inferences.

Based on the flower's measurements, the model will predict, for each unlabelled example, the likelihood that the flower is the given Iris species (Iris setosa, Iris versicolor or Iris virginica) and print out the actual numeric value for each unlabelled example that has the highest confidence value.

The Python code below:

* Hides the GPU device to run the code on CPU-only Jupyter Notebook
* Disables all logging output from TensorFlow Keras
* Imports the Determined Python libraries
* Authenticates me as Determined user to interact with my Determined experiment
* Downloads and loads the best model checkpoint for my experiment from the shared checkpoint storage volume
* Tests the model by making predictions using the loaded model and unlabelled examples data

```python
import os
os.environ["CUDA_DEVICE_ORDER"]="PCI_BUS_ID"
os.environ["CUDA_VISIBLE_DEVICES"]="-1"
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
#
import numpy as np
from determined.experimental import client
from determined import keras
#
myexpId=”<experiment-Id>”
client.login(master=<DET_MASTER_URL>, user="MyUsername", password="MyPassword")
best_checkpoint = client.get_experiment(myexpId).top_checkpoint()
checkpoint_path = best_checkpoint.download()
model = keras.load_model_from_checkpoint_path(checkpoint_path)
#
# Inferences
X_new = np.array([[5, 3.9, 2, 0.5], [5, 2.5, 3, 1], [6.9, 3.1, 5.4, 2.1]])
prediction = model(X_new)
print("Let's predict the likelihood that the flower is the given Iris species 0: Iris setosa, 1: Iris versicolor, 2: Iris virginica {}".format(prediction))
print("")
print("the prediction of species for the 3 unlabelled examples is:")
print(np.argmax(prediction,axis=1))
```

### Cleaning up computational resources
Once I’ve finished with the test of my model, I can stop the JupyterLab instance and release computational resources on my Kubernetes cluster with the command: 

```bash
det notebook kill <notebook-Id>
```

## Distributed training with multiple GPUs
I’ll now launch another experiment that trains a single instance of my deep learning model using multiple GPUs, known as [distributed training](https://docs.determined.ai/latest/training-distributed/index.html). Similar to my first experiment, this experiment features a single trial with a set of constant hyperparameters.

Determined can coordinate multiple GPUs to train a deep learning model more quickly by leveraging multiple GPUs on a single machine or over multiple machines. Typically, data science teams use distributed training to train models on larger datasets to improve model performance and accuracy, leveraging additional compute resources.

Determined automatically executes [data parallelization](https://www.oreilly.com/content/distributed-tensorflow/) training, where a data set is divided into multiple pieces and distributed across the GPUs, **requiring minimal changes to model code**. Each GPU has the full model code but trains the model on its portion of the data. Determined ensures training coordination across multiple GPUs on a single machine or multiple machines to keep the overall training task in sync.

To launch a multi-GPU experiment, all I need to do is specify the desired number of GPUs I want to use in the experiment configuration file without requiring any model code changes, and Determined takes care of the rest. For example, in the *distributed.yaml* experiment configuration file, I specify two GPUs per trial in the **resources** section:

```Yaml
resources:
  slots_per_trial: 2
```

I launch the experiment using the command:

```bash
det experiment create distributed.yaml <model-definition-directory>
```

With this configuration, Determined runs a single trial for my experiment. The trial uses two GPUs to train my model, whether leveraging two GPUs on a single machine or two GPUs across multiple machines in the Kubernetes cluster.

As with the other experiments, I navigate to the WebUI to monitor the progress of the training task for my experiment and visualize information on both training and validation performance over the number of completed batches. I can use the same ***Det*** CLI commands that I used for my first experiment to discover the performance metric for my model and launch auxiliary tasks, such as a TensorBoard server or a JupyterLab Notebook server. And, of course, I can use the same Determined Python API code I used for my first experiment to load and test the trained model to see how well it performs to make predictions.

## Automatic model tuning with Determined
Previously, I showed you how to easily distribute a training task across multiple GPUs without changing your model code. Here, I’ll look at another way that an experiment can benefit from multiple GPUs. Determined makes it easy for data scientists and ML engineers to apply advanced functionality such as automatic model tuning with hyperparameter search, known as **Hyperparameter Optimization** (HPO), to accelerate the hyperparameter search for their model with minimal effort. [Determined HPO](https://docs.determined.ai/latest/training-hyperparameter/index.html#hyperparameter-tuning) uses a Searcher algorithm like Random, Grid, Adaptive, or PBT, and ranges of hyperparameters, which are specified in the experiment configuration file.

In general, data scientists experiment with several learning algorithms using a variety of hyperparameters on the same dataset by launching several training processes. They do so to find the model that works best for the business problem they are trying to solve. Determined HPO automates this process to find the best-performing model by running many training tasks, or trials, on the same dataset and code. Determined launches the trials simultaneously on different GPUs. Each trial uses a different configuration of hyperparameters **randomly** chosen by the Searcher from the range of values specified in the experiment configuration file. Determined then chooses the set of hyperparameter values that result in a model that performs the best, as measured by the validation metric defined in the experiment configuration file.

I’ll use the following experiment configuration file (*adaptive.yaml*) to launch the HPO experiment in Determined. As you can see, the set of user-defined hyperparameters range and the state-of-the-art searcher method *Adaptive_ASHA* are now defined. In the ***searcher*** section, the ***max_trials*** parameter indicates the number of trials that the experiment will create. Determined will explore *max_trials* model configurations for you. The validation metric and the amount of data on which to train the model are the same as in my previous experiments. Each trial runs on one GPU because the resource parameter slot_per_trial is not specified. Therefore the default setting of a single GPU per trial is used. 

> Note: The Adaptive_ASHA searcher method works best with many hundreds of trials. For the purpose of my experimental use case, I set the maximum number of trials to six. Determined will explore six model configurations.

```yaml
name: iris_adaptivesearch
hyperparameters:   # Hyperparameters specified as ranges
  learning_rate:
    type: log
    minval: -5.0
    maxval: 1.0
    base: 10.0
  learning_rate_decay: 1.0e-6
  layer1_dense_size:
    type: int
    minval: 4
    maxval: 32
  global_batch_size:
    type: int
    minval: 5
    maxval: 30
searcher:
  name: adaptive_asha    # The HPO Searcher algorithm
  metric: val_categorical_accuracy
  smaller_is_better: false
  max_length:
    batches: 5000
  max_trials: 6   # Number of trials to launch for the HPO experiment
entrypoint: model_def:IrisTrial
bind_mounts:
  - host_path: /opt/bluedata/mapr/mnt/<DataFabric-clusterName>/exthcp/tenant-<ID>/fsmount/repo/data
    container_path: /opt/bluedata/mapr/mnt/<DataFabric-clusterName>/exthcp/tenant-<ID>/fsmount/repo/data
    read_only: true
```

I then launch the experiment using the command:

```bash
det experiment create adaptive.yaml <model-definition-directory>
```

As in the previous experiments, I navigate to the WebUI to monitor the training task progress and to access information on both training and validation performance for the experiment trials. As shown in the following figure, Determined hyperparameter search functionality gives me with several [visualization options](https://www.determined.ai/blog/hyperparameter-visualizations-determined) for analyzing results: Learning Curve, Parallel Plot, Scatter Plot, Heat Map.

As the experiment runs, I select the training metric *categorical_accuracy* in the ***Learning Curve*** tab to visualize the model accuracy on training data for each trial over the number of completed batches. I can see that the Searcher Adaptive ASHA's ***early stopping*** capability has stopped poor-performing trials that do not require extra training. Determined releases valuable GPU resources on trials that are evaluated to never produce the best model.

![HPO Adaptive experiment trials visualization](/img/webui-myexp-adaptive-graphs-v2.png "HPO Adaptive experiment trials visualization")

When the Determined experiment is complete, I’ll navigate to the WebUI **Trials** tab and compare the results of different trials and discover the hyperparameters that yield the best model that will enable me to perform better future experiments by further tuning the hyperparameters. One could also use the CLI commands below to get the best trial and discover the hyperparameters values for the best model:

```bash
det experiment list-checkpoints --best 1 <MyExperiment-Id>
det trial describe <Trial-Id>
```

And, of course, I can use the same Python API code I used earlier to load and test the best model and make inferences.  

## Summary
During both parts of this blog series, I wore a couple of hats: an IT operations manager’s hat and a data scientist/ML engineer’s hat.

With my IT operations manager’s hat, I deployed Determined on a Kubernetes cluster running on HPE Ezmeral Runtime Enterprise that provides all the components needed to run Determined: a workload scheduler, such as Kubernetes, a namespace, multi-tenancy, an ingress gateway, persistent storage for experiments tracking, and a shared file system for storing model artifacts and datasets.

With my data scientist/ML engineer’s hat, I used Determined and its interfaces (CLI and the Web User Interface) to get started with Determined fundamental concepts, training a simple Iris classification neural network model using multiple GPUs with distributed training and advanced functionality such as state-of-the-art hyperparameter search. I also used the Determined Python API to load and test the trained model and to make inferences.

The Iris classification example used in this post is relatively simple. In reality, you would use Determined to build and train more complex deep learning models with much larger datasets, probably using a larger compute infrastructure with plenty of GPUs available to parallelize training models across data science teams.

I hope you found this information interesting and useful in helping you get started with Determined. I was able to write this two-part blog series by joining and receiving help from the Determined Community Slack, which you can do by [following this link](https://join.slack.com/t/determined-community/shared_invite/zt-cnj7802v-KcVbaUrIzQOwmkmY7gP0Ew). You can begin training models with Determined today by visiting the [Determined project on GitHub](https://github.com/determined-ai/determined).