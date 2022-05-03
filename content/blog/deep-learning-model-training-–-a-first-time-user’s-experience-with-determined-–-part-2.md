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

To take advantage of Determined functionalities, I need to port the model to Determined framework APIs such as PyTorch, Tensorflow, and Keras, the most-commonly used deep learning frameworks. You can check out the _Iris deep learning model_ code  — a TensorFlow Keras based model  — in the [Determined GitHub repository](https://github.com/determined-ai/determined/tree/master/examples/computer_vision/iris_tf_keras) and download the complete code for this use case [here](https://docs.determined.ai/latest/_downloads/b8b05d77875d7d5a43ea2bd4b35fb0f4/iris_tf_keras.tgz). I’ll train the model on the publicly available Iris [training dataset](http://download.tensorflow.org/data/iris_training.csv) and [validation dataset](http://download.tensorflow.org/data/iris_test.csv), which consist of 120 samples and 30 samples, respectively. Each sample consists of four Iris flower properties:

* Features: sepal length, sepal width, petal length, petal width 
* Label: the species of Iris to predict 

I’ve also stored a copy of the datasets in the shared storage volume for my Determined deployment described in the [first post of this series](https://developer.hpe.com/blog/deep-learning-model-training-%E2%80%93-a-first-time-user%E2%80%99s-experience-with-determined-part-1/).


>Note: Porting deep learning model code to Determined is beyond the scope of this blog series. The easiest way to learn how to port an existing deep learning model code to Determined is to start with the [PyTorch Porting tutorial](https://docs.determined.ai/latest/tutorials/pytorch-porting-tutorial.html). 

**Time to see Determined in action!**
