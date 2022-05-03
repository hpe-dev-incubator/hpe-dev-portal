---
title: Deep Learning Model Training – A First-Time User’s Experience with
  Determined – Part 2
date: 2022-05-03T13:51:27.971Z
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
---
Determined is an open-source training platform that aims to simplify deep learning (DL) model development and experimentation for data science teams by providing tools like distributing training, automatic model tuning, GPU resource management, and automatic experiment tracking.


In [my previous blog post](https://developer.hpe.com/blog/deep-learning-model-training-%E2%80%93-a-first-time-user%E2%80%99s-experience-with-determined-part-1/), I put on my IT operations manager’s hat and discussed how I deployed Determined on a Kubernetes cluster in an on-premise HPE Ezmeral Runtime Enterprise environment. I also showed how easy it is to get started with the Determined CLI, REST API, and Web User Interface to interact with Determined.


In this second part of the series, using  the Determined setup from Part I, I’ll  assume the role of a data scientist/ML Engineer who wants to:



* Explore fundamental Determined concepts and features to train a TensorFlow model   


* Track and visualize the progress and result of training process using a single GPU   



* Use distributed training across multiple GPUs and fine-tune the model with state-of-the-art hyperparameter search    



I will also use the Determined Python API in a Jupyter Notebook to load and test the trained model and see how well it performs. I’ll evaluate this by making inferences, which uses a trained model, and new, unlabelled data to make predictions. 

## Overview of the Determined training model process


In short, Determined permits data science teams to launch deep learning model training tasks, called ***trials***, for their ported model. These tasks are distributed across one or more GPUs and grouped as a Determined ***experiment*** using a particular set of configuration parameters specified in an ***experiment configuration file***. This configuration file tells Determined how to run the model training process on Determined in terms of many different parameters, including, but not limited to, the following:

* The hyperparameters
* The number of GPUs to use for the training task
* The amount of data on which to train a model
* How often the trial task must report the training metrics and the validation metrics to the Determined Master
* How often the trial task must save the model file


The experiment configuration file and the Python code for the model used to load the datasets, build, optimize, and compile the model are collected in a ***model definition directory***. The directory can optionally contain a startup-hook.sh script to install additional Python dependencies and libraries before the training process starts.

>Note: The Experiment configuration file has required and optional fields.  I’ll explore the most common fields in this post. To learn more about Experiment configuration settings, check out the online documentation [here](https://docs.determined.ai/latest/training-apis/experiment-config.html).

## The use case and the model


To get started with Determined, I need a use case and a model to train in Determined. As a Data Scientist running an experiment on Iris species, I pick the simple and well-known _“Iris classification”_ model for predicting the likelihood that the flowers are Iris species (Iris setosa, Iris versicolor or Iris virginica) based on their sepal and petal length and width measurements. 

To take advantage of Determined functionalities, I need to port the model to Determined framework APIs such as PyTorch, Tensorflow, and Keras, the most-commonly used deep learning frameworks. You can check out the _Iris deep learning model_ code  — a TensorFlow Keras based model  — in the [Determined GitHub repository](https://github.com/determined-ai/determined/tree/master/examples/computer_vision/iris_tf_keras) and download the complete code for this use case [here](https://docs.determined.ai/latest/_downloads/b8b05d77875d7d5a43ea2bd4b35fb0f4/iris_tf_keras.tgz). I’ll train the model on the publicly available Iris [training dataset](http://download.tensorflow.org/data/iris_training.csv) and [validation dataset](http://download.tensorflow.org/data/iris_test.csv), which consist of 120 samples and 30 samples, respectively. Each sample consists of the following Iris flower properties:

* Features: sepal length, sepal width, petal length, petal width 
* Label: the species of Iris to predict 

I’ve also stored a copy of the datasets in the shared storage volume for my Determined deployment described in the [first post of this series](https://developer.hpe.com/blog/deep-learning-model-training-%E2%80%93-a-first-time-user%E2%80%99s-experience-with-determined-part-1/).


>Note: Porting deep learning model code to Determined is beyond the scope of this blog series. The easiest way to learn how to port an existing deep learning model code to Determined is to start with the [PyTorch Porting tutorial](https://docs.determined.ai/latest/tutorials/pytorch-porting-tutorial.html). 

**Time to see Determined in action!**

## Launching my first experiment to train our model on a single GPU
Let’s start by simply launching an experiment with a single training task for the Iris deep learning model on a single GPU by defining the hyperparameters as fixed values in the experiment configuration file. 


T### he Experiment configuration file

Here’s a quick look at the experiment configuration file (_const.yaml_):
```Yaml
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
bind_mounts:         # Training and validation datasets location in shared volume
  - host_path: /opt/bluedata/mapr/mnt/<DataFabric-clusterName>/exthcp/tenant-<ID>/fsmount/repo/data
    container_path: /opt/bluedata/mapr/mnt/<DataFabric-clusterName>/exthcp/tenant-<ID>/fsmount/repo/data
    read_only: true
```


At a glance, this configuration YAML file is full of concepts that data scientists and ML engineers are familiar with, such as hyperparameters, batches, batch size, metrics, etc. In other words, using the experiment configuration file allows me, as a data scientist, to describe experiments with the terms I’m familiar with. From this file, Determined can take care of the model training for me.

### Creating the experiment
With the _const.yaml_ experiment configuration file and the model code in the model definition directory, after being authenticated as a Determined user (`det user login <username>`), I’m going to start an experiment using the Determined CLI command line:  

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


I access information on both training and validation performance for my experiment using the Determined WebUI. From the dashboard I can see my experiment status, as shown in the following screenshot: 

[Figure1]


Selecting the experiment, I can visualize the learning curve, which shows the model validation and training accuracy metric over the number of completed batches:

[Figure 2]

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


With the model trained and the best model files saved on the shared storage volume for my Determined deployment, I can now test the best version of the model and see how well it performs using the [Determined Python API](https://docs.determined.ai/latest/interact/api-experimental-client.html). Using the command below, I simply start a **CPU-only** JupyterLab server instance with a bind-mounting configured to ensure that the validated model file and checkpoint files are accessible by the JupyterLab instance. Like any other task launched in Determined, the JupyterLab instance is launched as a container POD in the Kubernetes cluster.

```bash
det notebook start --config-file Notebook-config.yaml
```


The _Notebook-config_ YAML configuration file is used to control a JupyterLab instance deployment. To learn more about Jupyter Notebook in Determined, check out the [Notebook documentation](https://docs.determined.ai/latest/features/notebooks.html) and [a recent Determined’s blog post on this topic](https://www.determined.ai/blog/maximize-juptyter-notebook-experience-determined).


```Yaml
description: My-notebook
resources:
  slots: 0  # Launch a Notebook that does not use any GPU
bind_mounts: # Validated model checkpoints location in shared volume
  - host_path: /opt/bluedata/mapr/mnt/<DataFabric-clusterName>/exthcp/tenant-<ID>/fsmount/checkpoints
    container_path: /determined_shared_fs
idle_timeout: 30m
```


With the JupyterLab instance deployed, I use the `det notebook list` command to get the Notebook-Id, then connect to a Jupyterlab instance using my browser and the following URL: http://\<DET_MASTER_URL\>/proxy/\<Notebook-Id\>. 

Finally, I use the Determined [Python Client API](https://docs.determined.ai/latest/interact/api-experimental-client.html) and its TensorFlow Keras [Checkpoint API](https://docs.determined.ai/latest/post-training/use-trained-models.html) in the following Python code example to download the best model file, load it into memory as a Python process for TensorFlow Keras based model, and make inferences.


Based on the flower's measurements, the model will predict, for each unlabelled example, the likelihood that the flower is the given Iris species (Iris setosa, Iris versicolor or Iris virginica) and print out the actual numeric value for each unlabelled example that has the highest confidence value.

The Python code below:
* Hides the GPU device to run the code on CPU-only Jupyter Notebook
* Disables all logging output from TensorFlow Keras
* Imports the Determined Python libraries
* Authenticates me as Determined user to interact with my Determined experiment
* Downloads and loads the best model checkpoint for my experiment from the shared checkpoint storage volume
* Tests the model by making predictions using the loaded model and unlabelled examples data


```Python
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

