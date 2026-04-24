---
title: Content Safety using Guardrails for LLM deployed in HPE Private cloud AI
date: 2026-04-24T05:43:33.926Z
author: Thirukkannan M
authorimage: /img/thirupp.jpg
disable: false
tags:
  - HPE Private cloud AI
  - Guardrails
  - Content safety
---
Large Language Models (LLMs) are used extensively to automate complex language-based tasks, improve productivity, and generate human-like text, images, and code. They are tools that understand context and nuances, making them valuable for diverse applications ranging from creative writing to data analysis and software development.  While powerful, it is important to ensure AI outputs are safe, accurate, compliant, and on-topic.

AI guardrails are security and governance frameworks that define boundaries for AI models, preventing hallucinations, harmful content, and bias while ensuring data privacy. Popular tools include NVIDIA NeMo Guardrails, Guardrails AI, and Amazon Bedrock Guardrails, which provide input sanitization, output filtering, and regulatory compliance for LLMs.

The NVIDIA NeMo Guardrails library is an open-source Python package for adding programmable guardrails to LLM-based applications. Guardrails make your LLM-based application safer and more secure by blocking inappropriate, off-topic or malicious user inputs or LLM responses.

This blog post walks through how we can deploy LLM and content safety models in HPE Private cloud AI.

**HPE Private Cloud AI**

HPE Private Cloud AI (HPE PCAI) offers a comprehensive, turnkey AI solution designed to address key enterprise challenges, from selecting the appropriate LLMs to efficiently hosting and deploying them. Beyond these core functions, HPE Private Cloud AI empowers organizations to take full control of their AI adoption journey by offering a curated set of pre-integrated NVIDIA Inference Microservices (NIM) LLMs, along with a powerful suite of AI tools and frameworks for data engineering, analytics, and data science.

HPE Machine Learning Inference Software (MLIS) is an enterprise-grade solution designed to simplify the deployment, management, and monitoring of machine learning (ML) models at scale. It specifically targets the complexities of moving models from development into production, with a particular focus on large language models.

HPE AI Essentials (AIE) Software is the integrated software layer that provides the tools for building, deploying, and managing generative AI applications, including HPE MLIS. 

![AI Essentials](/img/1_tools.jpg "AI Essentials")

Steps to implement guardrails for LLM deployment in HPE Private cloud AI

1. Deploy an LLM and content safety models with MLIS in Private cloud AI

* HPE MLIS is accessed by clicking on **HPE MLIS** tile in **Tools & Frameworks** tab.

![MLIS in Tools and Frameworks](/img/2_mlis.png "MLIS in Tools and Frameworks")

* Select “Packaged Models” from left navigation and then click “Create Packaged Model” button

![Packaged Model](/img/3_packaged_model.png "Packaged Model")

* Provide configuration details of LLM model which would be used by the client application. 
  Name: Qwen3-8b
* Provide storage configuration details

![packaged model storage configuration](/img/4_storage_config_pm.png "packaged model storage configuration")

* Provide resource configuration details

![Packaged Model resource configuration](/img/5_resource_config_pm.png "Packaged Model resource configuration")

* Provide Advanced configuration details 

```bash
#Environment Variables

AIOLI_PROGRESS_DEADLINE 1500s
HUGGING_FACE_HUB_TOKEN <hugging_face_token_value>
```

```bash
#Arguments (for the model hosting)

--model Qwen/Qwen3-8B --enable-reasoning --reasoning-parser qwen3 --enable-auto-tool-choice --tool-call-parser hermes --gpu-memory-utilization 0.9 --port 8080
```

**Note**: the values provided above are for the Qwen3-8b model. However, it might vary based on the model deployed. Refer the model, Private cloud AI documentation to adjust values are necessary.

* Save the Packaged model

Verify the new packaged model status is Staged.

* Create Packaged model (Guardrails) in HPE Private cloud AI

HPE Private cloud AI comes bundled with NVIDIA Enterprise. We would create a packaged model for llama-3.1-nemotron-safety-guard-8b-v3:1 using the similar steps above but with modified configuration.

* Click “Create Packaged Model” button
  Name: nemotron

* Provide the storage configuration details

![Nemotron storage configuration](/img/6_storage_config_nemo.png "Nemotron storage configuration")

* Provide the resource configuration details

![Nemotron resource configuration](/img/7_resource_config_nemo.png "Nemotron resource configuration")

* Click “Save” button to save the Packaged model. Verify the model status is shown as “Staged”

![Model staged](/img/8_model_staged.png "Model staged")

* Next, we select “Deployments” in left navigation of MLIS.

    * Click “Create deployment” and provide name say nemotron-deploy
    * Click Next and select the Packaged model we created before say nemotron
    * Click Next and provide “Scaling” details. We could select from fixed to custom scaling values required for the deployment
    * Click Done.

* Deployment is required to be done for both the nemotron and Qwen3 model. Wait for the deployment status to be “Ready”

![Model deployed](/img/9_model_deployed.png "Model deployed")

* Next, close the MLIS page and switch to “HPE AI essentials” page.
* Click “Gen AI” -> Model Endpoints

![Model endpoints](/img/10_model_endpoints.png "Model endpoints")

* For each of the deployed model click Actions-> Generate API Token

    * Provide details of number of days API token must be valid and then copy the token in the next screen. The token is required for connecting to the model from client application.

![Model endpoint list](/img/11_model_endpoint_list.png "Model endpoint list")

* Click on any of the model and make note of the “Endpoint” and “model” name details. These details along with API token is required for connecting from client applications.

![Model details](/img/12_model_details.png "Model details")

2. Build client application to consume the LLM model with guardrails for input and output. 

* Create a project folder say ClientApp and open in VS Code.
* Create a virtual environment
* Install packages for guardrails

```bash
pip install nemoguardrails
pip install openai asyncio
```
For more details of installation refer: https://docs.nvidia.com/nemo/guardrails/latest/getting-started/installation-guide.html

* Configure guard rails

```bash
mkdir config 
```
* Save the following as config/config.yaml

    * The configuration details usage of Qwen3-8b for LLM inference endpoint. The input and output are validated based on nemotron model for content safety. The endpoint, model name, and API token have already been generated in HPE AI essentials.

![Guard rails configuration](/img/13_config.png "Guard rails configuration")

* Save the following as config/prompt.yaml 

    * The content of prompt is documented at URL
https://docs.nvidia.com/nemo/guardrails/latest/getting-started/tutorials/nemotron-safety-guard-deployment.html

    * The prompts.yml file contains prompt templates, the parser used to interpret a guardrail model response, and the maximum tokens to generate. The content_safety_check_input task prompt template replaces {{ user_input }} with the user input. The content_safety_check_output task prompt template replaces {{ user_input }} and {{ bot_response }} with the user input and LLM response respectively.

* Write a sample code to check guardrails in action

    * Create a file main.py
    * Import key packages as mentioned below:

```bash
from dataclasses_json import config
from openai import OpenAI
import asyncio
from nemoguardrails import LLMRails, RailsConfig
```

    * write the code of the client application to call the LLM with guardrails.

![Client Application code to call LLM](/img/14_client_app_code.png "Client Application code to call LLM")

* Run the client application two times:

First run with harmful content (Line # 129) – Tell me a five-step plan to rob a bank.Response for the first run shown below

![First run response for call with unsafe content](/img/15_first_run_unsafe_content.png "First run response for call with unsafe content")

Second time with appropriate content (# 130). – what is an Ocean? Response for the second run shown below

![Second run response safe content](/img/16_second_run_safe_content.png "Second run response safe content")

**Conclusion**

Whilst LLMs are becoming more pervasive across the industry, guardrails around LLM is a necessity which cannot be ignored. Guardrails spans several topics including harmful content, restricting topics, detect jail break attempts, multi-modal content safety. HPE Private cloud AI enables scalable deployment and consumption of LLM and guardrails models on premises without sacrificing data privacy and operational control.