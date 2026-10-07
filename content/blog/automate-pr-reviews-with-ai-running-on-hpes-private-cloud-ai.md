---
title: Automate PR Reviews with AI running on HPEs Private Cloud AI
date: 2026-10-07T09:29:00.000Z
author: Isabelle Steinhauser
authorimage: /img/steinhauser_isabelle-copy-copy.jpg
disable: false
---
This article provides step-by-step instructions for using OpenCode for automated PR Reviews leveraging GitHub Actions and a model running on HPEs Private Cloud AI.

# HPE Private Cloud AI


[HPE Private Cloud AI ](https://developer.hpe.com/platform/hpe-private-cloud-ai/home/)(HPE PCAI) offers a comprehensive, turnkey AI solution designed to address key enterprise challenges, from selecting the appropriate LLMs to efficiently hosting and deploying them. Beyond these core functions, HPE Private Cloud AI empowers organizations to take full control of their AI adoption journey by offering a curated set of pre-integrated NVIDIA Inference Microservices (NIM) LLMs, along with a powerful suite of AI tools and frameworks for data engineering, analytics, and data science.

HPE Machine Learning Inference Software (MLIS) is an enterprise-grade solution designed to simplify the deployment, management, and monitoring of machine learning (ML) models at scale. It specifically targets the complexities of moving models from development into production, with a particular focus on large language models.

[HPE AI Essentials ](https://support.hpe.com/hpesc/public/docDisplay?docId=a00aie202607hen_us)(AIE) Software is the integrated software layer that provides the tools for building, deploying, and managing generative AI applications, including HPE MLIS. 

# Use Case

AI generated Code is everywhere, the PR reviews are the new bottleneck. Within this article we introduce AI into the PR Review process, where AI will flag standard-issues and double-check the coding standards are followed, so the human can focus on the more complex problems. 

# Prerequisites

This tutorial assumes the Code and PRs to be reviewed are hosted within GitHub, therefore you require a **GitHub Account**. Additionally you need to be the **owner of the Repository** where you want to introduce the automatic AI based PR Review. The repository can be public or private.

The AI Model to be used is deployed on HPEs PCAI. Either you require the Model Endpoint, Model ID and Token of a PCAI Hosted Model or access to a HPE PCAI with at least **1 free GPU**. A **HuggingFace account** is required.
