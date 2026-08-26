---
title: Bring your agent to the next level - Introduce LiteLLM for Cost
  management and Guardrails to your Agent Workflow
date: 2026-08-26T12:01:00.000Z
featuredBlog: false
author: Isabelle Steinhauser & Claudio Calderon
authorimage: /img/Avatar1.svg
disable: false
tags:
  - hpe-private-cloud-ai
  - Langflow
  - LiteLLM
  - Agent
  - tutorial
---
This article provides step by step instructions to enhance your existing Langflow Agent Flow with Guardrails and Cost Management via LiteLLM.

[LiteLLM](https://www.litellm.ai/) is introduced as a new default framework in AI Essentials, it acts as an AI gateway and provides features like Guardrails.

## HPE Private Cloud AI

[HPE Private Cloud AI (HPE PCAI)](https://developer.hpe.com/platform/hpe-private-cloud-ai/home/) offers a comprehensive, turnkey AI solution designed to address key enterprise challenges, from selecting the appropriate LLMs to efficiently hosting and deploying them. Beyond these core functions, HPE Private Cloud AI empowers organizations to take full control of their AI adoption journey by offering a curated set of pre-integrated *NVIDIA Inference Microservices (NIM)* LLMs, along with a powerful suite of AI tools and frameworks for data engineering, analytics, and data science.

HPE Machine Learning Inference Software (MLIS) is an enterprise-grade solution designed to simplify the deployment, management, and monitoring of machine learning (ML) models at scale. It specifically targets the complexities of moving models from development into production, with a particular focus on large language models.

[HPE AI Essentials (AIE)](https://support.hpe.com/hpesc/public/docDisplay?docId=a00aie112hen_us) Software is the integrated software layer that provides the tools for building, deploying, and managing generative AI applications, including HPE MLIS. It provides a flexible **Import Framework** that enables organizations to deploy their own applications or third-party solutions, like Langflow.

## Use Case

An AI Gateway like LiteLLM can not only manage Model Ednpoints but also MCP Servers, Agents and Guardrails. We use an existing Agent, created with a Langflow Flow, for example the Flight Support Agent or Citizen Passport agent, as described [here](https://developer.hpe.com/blog/hpe-private-cloud-ai-build-your-first-agent/).

We use the as MCP Server exposed Langflow Flow, manage the access and costs in LiteLLM and use OpenWebUI as Frontend to interact with it. Additionally we will create a sample Guardrail to block any Insults.



## Prerequisites

This tutorial requires a feature available in newer Private Cloud AI versions—specifically the ezPresto MCP Server, supported since **AIE 1.12**. In addition we are using LiteLLM and OpenWebUI, new default Frameworks included since AIE 1.13/2026070. If you are working on an older version, you can import the frameworks as explained for LiteLLM [here. ](https://developer.hpe.com/blog/llm-observability-and-cost-management-on-hpe-private-cloud-ai/)

[](https://developer.hpe.com/blog/llm-observability-and-cost-management-on-hpe-private-cloud-ai/)[](https://developer.hpe.com/blog/llm-observability-and-cost-management-on-hpe-private-cloud-ai/)We expect an agentic Langflow Flow to be already existing. You can follow [this tutorial](https://developer.hpe.com/blog/hpe-private-cloud-ai-build-your-first-agent/) in order to create one. For creating this sample Agent you will need **at least 1 free GPU** in your platform or a model with tool calling enabled, that's already deployed. If you only have one free GPU you will need to switch to a CPU only embedding model, the one included in that linked instruction is using a GPU. You also need a **HuggingFace account** to deploy the LLM.
