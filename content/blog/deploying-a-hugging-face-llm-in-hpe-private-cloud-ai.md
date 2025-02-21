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

![Computer screen showing the HPE Private Cloud AI user interface and the HPE MLIS tile is highlighted.](/img/mlis.png)

Next select "Add new model".

![Computer screen showing packaged AI models and a selection to add a new model.](/img/new-model.png)

First install openai if you do not already have it and import.

```python
# vLLM Chat OpenAI
# !pip intall openai
from openai import OpenAI
```

For a recorded demonstration that shows the process real time see this screen recording. <https://youtu.be/oqjc-2c1Vtk>

With HPE Private Cloud AI loading new models into the system and providing endpoints is just a few simple clicks and easily integrates with popular tools like Jupyter Notebooks.