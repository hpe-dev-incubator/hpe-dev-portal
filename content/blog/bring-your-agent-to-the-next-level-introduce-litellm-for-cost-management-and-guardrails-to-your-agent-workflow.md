---
title: Bring your agent to the next level - Introduce LiteLLM for Cost
  management and Guardrails to your Agent Workflow
date: 2026-08-26T12:01:00.000Z
featuredBlog: false
author: Isabelle Steinhauser & Claudio Calderon
authorimage: /img/Avatar1.svg
disable: false
---
This article provides step by step instructions to enhance your existing Langflow Agent Flow with Guardrails and Cost Management via LiteLLM.

[LiteLLM](https://www.litellm.ai/) is introduced as a new default framework in AI Essentials, it acts as an AI gateway and provides features like Guardrails.

## HPE Private Cloud AI

[HPE Private Cloud AI (HPE PCAI)](https://developer.hpe.com/platform/hpe-private-cloud-ai/home/) offers a comprehensive, turnkey AI solution designed to address key enterprise challenges, from selecting the appropriate LLMs to efficiently hosting and deploying them. Beyond these core functions, HPE Private Cloud AI empowers organizations to take full control of their AI adoption journey by offering a curated set of pre-integrated *NVIDIA Inference Microservices (NIM)* LLMs, along with a powerful suite of AI tools and frameworks for data engineering, analytics, and data science.

HPE Machine Learning Inference Software (MLIS) is an enterprise-grade solution designed to simplify the deployment, management, and monitoring of machine learning (ML) models at scale. It specifically targets the complexities of moving models from development into production, with a particular focus on large language models.

[HPE AI Essentials (AIE)](https://support.hpe.com/hpesc/public/docDisplay?docId=a00aie112hen_us) Software is the integrated software layer that provides the tools for building, deploying, and managing generative AI applications, including HPE MLIS. It provides a flexible **Import Framework** that enables organizations to deploy their own applications or third-party solutions, like Langflow.



## Use Case

An AI Gateway like LiteLLM can not only manage Model Ednpoints but also MCP Servers, Agents and Guardrails. We use an existing Agent, created with a Langflow Flow, for example the Flight Support Agent or Citizen Passport agent, as described [here](https://developer.hpe.com/blog/hpe-private-cloud-ai-build-your-first-agent/).

We will 

An AI Agent can autonomously act leveraging tools provided. In our example the AI Agent gets triggered by a users chat message. As tools regular RAG (Retrieval Augmented Generation) will be provided for retrieving information out of a PDF and the ezPresto MCP (Model Context Protocol) Server that has tools available to retrieve information from a Database. There are two sets of sample data to choose from, one for a flight support agent to answer questions regarding refunds, and one for citizen passport queries, to answer questions around requested passports. In this tutorial we will take the flight support agent example. In order to use the Citizen Passport queries use the according [dataset](https://github.com/ai-solution-eng/ai-solution-demos/tree/main/basic-agent-langflow/data/passport).
