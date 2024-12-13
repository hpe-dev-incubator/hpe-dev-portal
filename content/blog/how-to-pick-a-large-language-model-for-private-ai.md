---
title: How to Pick a Large Language Model for Private AI
date: 2024-11-13T16:48:01.096Z
priority: -1
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

There are three main things that I do with Cursor: Generate, Edit, and Explain.

* **Generate** is text in, code out. You write a description of the code you want to see, and the model generates it from scratch. For example, a new page on a website, an API call, or a new function in a library. Personally, I've been writing a lot of yaml for k8s recently (is config code?). Also, I don't hit the docs to figure out slurm and linux commands as much anymore (is bash code? alas...)
* **Edit** is code + text in, code out. Editing is similar to generating code, but you're including some existing code in-context for the model to use. For example, you might want to write a unit test, create a function, refactor something, or add comments. The model is reasoning based on existing code.
* **Explain** is code in, text out. For example, you might be moving onto a new project and trying to understand the existing code base. Or you forgot what you were trying to do the night before. Explanations can be helpful.

### Everything Else

Models are improving over time. With the introduction of "multimodal" LLMs, we now have both "Large" and "Language" being misnomers in this acronym. Anyway, this is what I'll call the domain of Everything Else:

* Analyze the contents of an image (say, diagnose an X-Ray for a patient)
* Generate an image (text-to-image)
* Transcribe audio (speech-to-text)
* Generate audio (text-to-speech)
* Generate a video (text-to-video)

You can see that in general, text is still usually the modality of input or output. However, transformer models are being used in unique ways (audio-to-audio, image-to-video, etc.) and research continues. How long until this blog is out of date?

## Types of Performance: Quality vs. Speed

Evaluating LLM performance involves two key metrics:

1. **Quality**: Refers to the accuracy or relevance of the model’s outputs. Quality can be assessed through various benchmarks like the [LMSys Chatbot Arena](https://lmarena.ai/?leaderboard), [MMLU,](https://github.com/hendrycks/test) [HumanEval](https://github.com/openai/human-eval), and [GSM8K](https://github.com/openai/grade-school-math), which measure models on complex reasoning and specific problem-solving tasks.
2. **Speed**: Involves both throughput and latency. Throughput is the volume of outputs the model can generate per unit of time (request/sec or tokens/sec), while latency (time-to-first-token, or TTFT) indicates the delay before generating the first part of a response.

## Comparing Quality

In terms of measuring quality, it's frankly just really hard to understand the objective quality of an LLM. Open source benchmarks exist, but they're usually not representative of your business objectives. To understand how a model performs on the specific downstream task that your organization will be performing, there is really no substitute for user feedback and custom evals. I'm going to leave this topic for a future blog.

Test your models, and talk to your users.

## Comparing Speed

### Throughput

Throughput metrics offer insights into how well models handle large volumes of data. High throughput is especially valuable for batch processing tasks, where efficiency directly translates into time and cost savings.

### Latency (TTFT)

Latency reflects the model’s responsiveness, which is critical for real-time applications. Lower latency means faster initial responses, which is crucial for user-facing applications, like chatbots or customer support systems.

## Continuous Improvement in Runtimes

The field of LLMs is rapidly advancing, with regular improvements in model efficiency and runtime performance. For instance, in a span of just over three months, throughput for certain models nearly doubled thanks to improvements in the vLLM runtime from v0.5.0 (released in June 2024) to v0.6.2 (released in September 2024).

Whether you prefer [ollama](https://ollama.com/), [vLLM](https://docs.vllm.ai/en/latest/), [tgi](https://huggingface.co/docs/text-generation-inference/en/index), [NIMs](https://www.nvidia.com/en-us/ai/), or something else, staying updated with these advancements is important to keep deployments cost-effective over time.

## Conclusion: Infrastructure Sizing

Determining the right infrastructure to support an LLM is critical to deployment success. Hardware requirements are influenced by model size and complexity, since larger models generally require more powerful infrastructure, as well as desired performance, since the need for high throughput or low latency impacts the choice of hardware and the amount of it.

The obvious conclusion to draw here is that there is a tradeoff:

* bigger models provide higher quality output, but are slower (or more expensive to run)
* smaller models provide lower quality output, but are faster (or less expensive to run)

Understanding this tradeoff is critical to ensure that you have control over the cost and performance (quality and speed) of your LLM-powered application.

- - -

Watch this video for more detail, and live demo comparing latency and throughput for three different sizes (8B, 70B, 405B) of the Llama 3.1 Instruct model: https://www.youtube.com/watch?v=sNRqJOEKkCw
