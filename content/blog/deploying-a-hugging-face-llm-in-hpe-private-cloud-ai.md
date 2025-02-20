---
title: Deploying a Hugging Face LLM in HPE Private Cloud AI
date: 2025-02-20T20:03:50.971Z
author: Dave Wright and Elias Alagna
authorimage: /img/Avatar1.svg
disable: false
---
Deploying new large language models for for users to interact with can be challenging for beginners. HPE has developed Private Cloud AI to help users get to productive AI work quickly and easily. 

Here we will show how to use HPE Machine Learning Inference Service as a part of HPE Private Cloud AI to add a new packaged model from a Hugging Face repository and create an endpoint to query the model. This is done in a Jupyter Notebook.

The Hugging Face model we've chosen is [SmolLM2 1.7B](https://huggingface.co/HuggingFaceTB/SmolLM2-1.7B-Instruct). 

![Computer screen showing the HPE Private Cloud AI user interface and the HPE MLIS tile is highlighted.](/img/hpe-mlis.png)