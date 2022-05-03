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
