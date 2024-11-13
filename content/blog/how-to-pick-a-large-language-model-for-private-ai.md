---
title: How to Pick a Large Language Model for Private AI
date: 2024-11-13T16:48:01.096Z
priority: -1
externalLink: https://www.youtube.com/watch?v=sNRqJOEKkCw
author: Jordan Nanos
authorimage: /img/headshot-01.jpeg
disable: false
---
# How to Pick a Large Language Model for Private AI

*Note: this blog is based on a video and slide deck available [here on YouTube](https://www.youtube.com/watch?v=sNRqJOEKkCw).*

As organizations continue to explore the potential of generative AI, choosing the right Large Language Model (LLM) is crucial for performance, scalability, and integration with existing systems. This post explores key considerations for selecting an LLM, including understanding different classes of models, evaluating performance, and planning for hardware requirements.

## Classes of Language Models: What Does “Large” Mean?

Language models vary significantly in scale, with "large" models generally characterized by the number of parameters they contain. However, "large" has become a misnomer, with many models capable of running on mobile devices like laptops and cell phones. The size of the model will correspond with two types of "performance" -- quality and speed. Understanding these tradeoffs is important when considering the models feasibility for certain applications. \
\
In the chart below I describe five T-Shirt sizes of language models.

![](/img/capture1.png)

## What Can These AI Models Do?

LLMs are remarkably versatile, but capabilities can still differ between models. Understanding these distinctions can help narrow down which model class best suits an organization's goals and budget. Performance on given task that is meaningful to your business may depend on the model's architecture, training data, and parameter count.

Let us define three classes of problems that LLMs can perform: Chat, Code, and everything else.

### Chat

In the domain of Chat, models take in text and output text. It's been the killer app in NLP since ChatGPT was released, and there is no reason to think this trend is slowing down. Seems simple, however there are endless ways in which this can be useful. Here is a list of a few that I have worked on:

* Summarize a long email thread and help me write a response
* Translate a pdf in a foreign language, such as an RFP or product specs and help answer some questions
* Create a study guide, flashcards, and a multiple-choice practice quiz based on a chapter of a textbook
* Classify the audio transcription of a patient's visit with a medical professional to determine who the follow up appointment would be with
* Determine if an auto insurance claim is likely to be fraudulent or not, and explain the reasoning why to a care agent
* Ask questions about the contents of a database, such as local restaurant reviews or the performance of a business over the past month

I may have even used one to help write this blog post 😁

Moving on...

### Code

The second most popular LLM-powered application today seems to be GitHub Copilot. It's already spawned open-source projects (with much more flexibility) such as [Cursor](https://www.cursor.com/) and [Continue](https://continue.dev/). I'm a big Continue user myself.

### Everything Else

asdf

In summary, it's really hard to understand the objective quality of an LLM. Open source benchmarks exist, but they're not representative of your business objectives. To understand how a model performs on the specific downstream task that your organization will be performing, there is really no substitute for user feedback. Test your models, and talk to your users.

## Types of Performance: Quality vs. Speed

Evaluating LLM performance involves two key metrics:

1. **Quality**: Refers to the accuracy or relevance of the model’s outputs. Quality can be assessed through various benchmarks like MMLU and HumanEval, which measure models on complex reasoning and specific problem-solving tasks.
2. **Speed**: Involves both throughput and latency. Throughput is the volume of outputs the model can generate per unit of time, while latency (Time to First Token, or TTFT) indicates the delay before generating the first part of a response.

Understanding how different models perform in these aspects is essential for selecting the right one.

## Comparing Speed

### Throughput

Throughput metrics offer insights into how well models handle large volumes of data. High throughput is especially valuable for batch processing tasks, where efficiency directly translates into time and cost savings.

### Latency (TTFT)

Latency reflects the model’s responsiveness, which is critical for real-time applications. Lower latency means faster initial responses, which is crucial for user-facing applications, like chatbots or customer support systems.

## Hardware Requirements for LLM Applications

Determining the right hardware to support an LLM is critical to deployment success. Hardware requirements are influenced by:

* **Model size and complexity**: Larger models generally require more powerful infrastructure.
* **Desired performance**: The need for high throughput or low latency impacts the choice of hardware.

HPE offers tailored hardware solutions optimized for AI, including options like the DL384, which provides a reliable foundation for handling LLM workloads effectively.

## Continuous Improvement in Runtimes

The field of LLMs is rapidly advancing, with regular improvements in model efficiency and runtime performance. For instance, in a span of just over three months, throughput for certain models nearly doubled thanks to improvements in the vLLM runtime from v0.5.0 (released in June 2024) to v0.6.2 (released in September 2024).

Whether you prefer [ollama](https://ollama.com/), [vLLM](https://docs.vllm.ai/en/latest/), [tgi](https://huggingface.co/docs/text-generation-inference/en/index), [NIMs](https://www.nvidia.com/en-us/ai/), or something else, staying updated with these advancements is important to keep deployments cost-effective over time.

- - -

Watch this video for more detail, and live demo comparing latency and throughput for three different sizes (8B, 70B, 405B) of the Llama 3.1 Instruct model: https://www.youtube.com/watch?v=sNRqJOEKkCw