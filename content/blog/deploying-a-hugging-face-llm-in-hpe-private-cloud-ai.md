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

First install `openai` if you do not already have it and import.

```python
# vLLM Chat OpenAI
# !pip intall openai
from openai import OpenAI
```

Then using the endpoint and key genered by HPE MLIS enter them into your Jupyter Notebook. Be sure to append /v1 to the URL.

```python
# Grab endpoint URL and API key from MLIS, remember to include "/v1" for latest version of the OpenAI-compatible API
model = "HuggingFaceTB/SmolLM2-1.7B-Instruct"
openai_api_base = "https://smollm2-1-7b-vllm-predictor-dave-wright-hpe-1073f7cd.hpepcai-ingress.pcai.hpecic.net/v1"
openai_api_key = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Mzk5MzgzMzAsImlzcyI6ImFpb2xpQGhwZS5jb20iLCJzdWIiOiI5MjNhM2JhOC1mMGU4LTQxOTQtODNkMS05ZWY4NzNjZGYxOWYiLCJ1c2VyIjoiZGF2ZS53cmlnaHQtaHBlLmNvbSJ9.YwH9gGPxTWxy4RSdjnQA9-U3_u7P0OIcarqw25DV8bOiftU1L4IvvyERHspj2lMGtZWbff1F3uh84wjAePHaHDcDTLoGtq6gJYwo_qRU03xV8Q2lwBetCCLUE4OHqS608gjJ-j1SLyqwxFxlXkqMOtnBY5_nswlAwCzHV28P8u8XxxfWuXFmoJpSA1egCWVVfEoTuK8CTz9kUJJ5opSp6m8qdqJmC2qxH0igcpKmL2H_MZ-62UHfEf240VRtc0DRNlOjeCoDM79aVPs3SjCtGeVkeEHimJwJbfGFIcu3LibX3QjbABUzWb5BPPZjzyEYUVM5ak12_sJ8j1mUW-r0sA"
```

Now we need an OpenAI client interface.

```python
# create OpenAI client interface
client = OpenAI(
    api_key=openai_api_key,
    base_url=openai_api_base,
)
```



![Jupyter Notebook showing imported model endpoint and API key.](/img/jupyter.png)



For a recorded demonstration that shows the process real time see this screen recording. <https://youtu.be/oqjc-2c1Vtk>

With HPE Private Cloud AI loading new models into the system and providing endpoints is just a few simple clicks and easily integrates with popular tools like Jupyter Notebooks.