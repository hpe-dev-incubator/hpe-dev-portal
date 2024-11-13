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


As organizations continue to explore the potential of generative AI, choosing the right Large Language Model (LLM) is crucial for performance, scalability, and integration with existing systems. This post explores key considerations for selecting an LLM, including understanding different classes of models, evaluating performance, and planning for hardware requirements.



## Why HPE for Generative AI?

Hewlett Packard Enterprise (HPE) offers unique advantages for those looking to implement generative AI at scale. With robust infrastructure options and expertise in AI-driven solutions, HPE helps companies leverage LLMs for real business impact. HPE’s AI offerings support high performance, flexibility, and the scalability needed for enterprise use.



## Classes of Language Models: What Does “Large” Mean?

Language models vary significantly in scale, with "large" models generally characterized by the number of parameters they contain. This scale impacts not only model accuracy but also computational requirements, which can affect feasibility for certain applications. Here’s a breakdown:

- **Small Models**: Designed for lightweight applications with quick responses and minimal compute requirements.
- **Medium Models**: Balances performance with efficiency, suitable for a wider range of applications.
- **Large Models**: Ideal for complex tasks, like code generation and nuanced content creation, though they require substantial hardware resources.



In the chart below, I describe 





Understanding these distinctions can help narrow down which model class best suits an organization's goals and budget.



## What Can These AI Models Do?

LLMs have shown remarkable versatility, capable of tasks such as content generation, summarization, translation, question answering, and code assistance. However, capabilities differ widely across models. Performance in each task may depend on the model's architecture, training data, and parameter count.

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

- **Model size and complexity**: Larger models generally require more powerful infrastructure.
- **Desired performance**: The need for high throughput or low latency impacts the choice of hardware.

HPE offers tailored hardware solutions optimized for AI, including options like the DL384, which provides a reliable foundation for handling LLM workloads effectively.

## Continuous Improvement in Runtimes

The field of LLMs is rapidly advancing, with regular improvements in model efficiency and runtime performance. For instance, in a span of just over three months, throughput for certain models nearly doubled. Staying updated with these advancements allows organizations to take advantage of more efficient, cost-effective deployments.





---

Watch this video for more detail, and live demo comparing latency and throughput for three different sizes of the Llama 3.1 Instruct model: https://www.youtube.com/watch?v=sNRqJOEKkCw 

