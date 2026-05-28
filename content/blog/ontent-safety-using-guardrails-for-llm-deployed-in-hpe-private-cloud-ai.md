---
title: Content safety using guardrails for LLMs deployed in HPE Private Cloud AI
date: 2026-05-15T05:43:00.000Z
author: Thirukkannan M
authorimage: /img/thirupp.jpg
disable: false
tags:
  - HPE Private cloud AI
  - Guardrails
  - Content safety
---
Large Language Models (LLMs) are used extensively to automate complex language-based tasks, improve productivity, and generate human-like text, images, and code. These tools understand context and nuances, making them valuable for diverse applications ranging from creative writing to data analysis and software development.  While powerful, it is important to ensure that their AI outputs are safe, accurate, compliant, and on-topic.

AI guardrails are security and governance frameworks that define boundaries for AI models, preventing hallucinations, harmful content, and bias while ensuring data privacy. Guardrails make your LLM-based application safer and more secure by blocking inappropriate, off-topic or malicious user inputs or LLM responses.

Popular tools include NVIDIA NeMo Guardrails, Guardrails AI, and Amazon Bedrock Guardrails, which provide input sanitization, output filtering, and regulatory compliance for LLMs. The[ NVIDIA NeMo Guardrails library](https://github.com/NVIDIA-NeMo/Guardrails) is an open-source Python package for adding programmable guardrails to LLM-based applications.

This blog post walks you through how you can deploy LLMs and content safety models in HPE Private Cloud AI.

**HPE Private Cloud AI**

[HPE Private Cloud AI](https://www.hpe.com/us/en/private-cloud-ai.html) (HPE PCAI) solution is a turnkey AI factory comprised of all the pieces you need to get started to develop and deploy AI initiatives.

HPE PCAI offers a comprehensive, AI solution designed to address key enterprise challenges, from selecting the appropriate LLMs to efficiently hosting and deploying them. Beyond these core functions, HPE Private Cloud AI empowers organizations to take full control of their AI adoption journey by offering a curated set of pre-integrated [NVIDIA Inference Microservices (NIM)](https://www.nvidia.com/en-us/ai-data-science/products/nim-microservices/) LLMs, along with a powerful suite of AI tools and frameworks for data engineering, analytics, and data science.

[HPE AI Essentials (AIE) Software](https://support.hpe.com/hpesc/public/docDisplay?docId=a00aie112hen_us) is the integrated software layer within HPE PCAI, that provides the tools for building, deploying, and managing generative AI applications, including [HPE Machine Learning Inference Software (MLIS)](https://support.hpe.com/hpesc/public/docDisplay?docId=a00aie112hen_us&page=MLIS/mlis.html)

MLIS is an enterprise-grade solution designed to simplify the deployment, management, and monitoring of machine learning (ML) models at scale. It specifically targets the complexities of moving models from development into production, with a particular focus on large language models.

[](https://support.hpe.com/hpesc/public/docDisplay?docId=a00aie112hen_us)

![AI Essentials](/img/1_tools.jpg "AI Essentials")

Follow the steps below to implement the NVIDIA NeMo Guardrails with HPE Private Cloud AI.

1 Deploy an LLM and content safety models with MLIS in Private Cloud AI. Sign in to HPE AI Essentials Software as the Private Cloud AI Administrator.

  1.1 HPE MLIS is accessed by clicking on the **HPE MLIS** tile in **Tools & Frameworks** tab. 

![MLIS in Tools and Frameworks](/img/2_mlis.png "MLIS in Tools and Frameworks")

  1.2 Select **Packaged Models** from left navigation and then click the **Create Packaged Model** button

![Packaged Model](/img/3_packaged_model.png "Packaged Model")

  1.3 Provide the configuration details of LLM model that would be used by the client application. 
    1.3.1 Name: Qwen3-8b

  1.4 Provide the storage configuration details

![packaged model storage configuration](/img/4_storage_config_pm.png "packaged model storage configuration")

  1.5 Provide resource configuration details

![Packaged Model resource configuration](/img/5_resource_config_pm.png "Packaged Model resource configuration")

  1.6 Provide the advanced configuration details 

```bash
# Environment Variables

AIOLI_PROGRESS_DEADLINE 1500s
HUGGING_FACE_HUB_TOKEN <hugging_face_token_value>
```

```bash
# Arguments (for the model hosting)

--model Qwen/Qwen3-8B --enable-reasoning --reasoning-parser qwen3 --enable-auto-tool-choice --tool-call-parser hermes --gpu-memory-utilization 0.9 --port 8080
```

Note: the values provided above are for the Qwen3-8b model. However, it might vary based on the model being deployed. Reference the model specific documentation and/or Private cloud AI documentation to adjust arguments for model as necessary.

  1.7 Save the packaged model

\    1.7.1 Verify the new packaged model status is **Staged**.

  1.8 Create Packaged model for Guardrails in HPE Private Cloud AI

\    1.8.1 Next, you would create a packaged model for **llama-3.1-nemotron-safety-guard-8b-v3:1** using the similar steps above, but with modified configuration. This model is available in [NVIDIA Enterprise](https://www.nvidia.com/en-us/data-center/products/ai-enterprise/?ncid=no-ncid) which comes bundled with HPE Private Cloud AI

  1.9 Click **Create Packaged Model** button
    1.9.1 Name: nemotron

  1.10 Provide the storage configuration details

![Nemotron storage configuration](/img/6_storage_config_nemo_new.jpg "Nemotron storage configuration")

  1.11 Provide the resource configuration details

![Nemotron resource configuration](/img/7_resource_config_nemo.png "Nemotron resource configuration")

  1.12 Click the **Save** button to save the packaged model. Verify the model status is shown as **Staged**

![Model staged](/img/8_model_staged_new.jpg "Model staged")

  1.13 Next, select **Deployments** in left navigation of MLIS.

\    1.13.1 Click **Create deployment** and provide name say nemotron-deploy

\    1.13.2 Click Next and select the Packaged model we created before say nemotron

\    1.13.3 Click Next and provide **Scaling** details. We could select from fixed to custom scaling values required for the deployment

\    1.13.4 Click Done.

\    1.13.5 Deployment is required to be done for both the nemotron and Qwen3 model. Wait for the deployment status to be **Ready**

![Model deployed](/img/9_model_deployed_new.jpg "Model deployed")

  1.14 Next, close the MLIS page and switch to **HPE AI essentials** page.

  1.15 Click **Gen AI** -> Model Endpoints

![Model endpoints](/img/10_model_endpoints.png "Model endpoints")

  1.16 For each of the deployed model click Actions-> Generate API Token

\    1.16.1 Provide details for the number of days the API token must be valid and then copy the token in the next screen. The token is required to connect to the model from the client application.

![Model endpoint list](/img/11_model_endpoint_list_new.jpg "Model endpoint list")

  1.17 Click on any of the models and make note of the **endpoint** and **model** name details. These details along with API token is required for connecting from client applications.

![Model details](/img/12_model_details_new.jpg "Model details")

2 Build client application to consume the LLM model with guardrails for input and output. 

  2.1 Create a project folder say ClientApp and open in VS Code.

  2.2 Create a virtual environment

  2.3 Install packages for guardrails

pip install nemoguardrails

pip install openai asyncio

For more details of installation refer: https://docs.nvidia.com/nemo/guardrails/latest/getting-started/installation-guide.html

  2.4 Configure guardrails by creating a directory in project root using below command

mkdir config 

  2.5 Save the following as config/config.yaml

\    2.5.1 The configuration indicates using Qwen3-8b as the LLM inference endpoint. The input and output are validated based on nemotron model for content safety. The endpoint, model name, and API token have already been generated in HPE AI Essentials.

![Guard rails configuration](/img/13_config.png "Guard rails configuration")

  2.6 Save the following as config/prompt.yaml 

 \ 2.6.1 The content of prompt is documented at URL: [prompt.yaml](https://docs.nvidia.com/nemo/guardrails/latest/getting-started/tutorials/nemotron-safety-guard-deployment.html)

\ 2.6.2 The prompts.yml file contains prompt templates, the parser used to interpret a guardrail model response, and the maximum tokens to generate. The content_safety_check_input task prompt template replaces {{ user_input }} with the user input. The content_safety_check_output task prompt template replaces {{ user_input }} and {{ bot_response }} with the user input and LLM response respectively.

  2.7 Write a sample code to check guardrails in action

\    2.7.1 Create a file main.py

\    2.7.2 Import key packages as mentioned below in line numbers 15 to 17.

![Import packages](/img/17_import_packages.jpg "Import packages")

\    2.7.3 write the code of the client application to call the LLM with guardrails.

![Client Application code to call LLM](/img/14_client_app_code_new.jpg "Client Application code to call LLM")

  2.8 Run the client application two times:

\    2.8.1 First run with harmful content (Line # 129) – Tell me a five-step plan to rob a bank. Response for the first run shown below

![First run response for call with unsafe content](/img/15_first_run_unsafe_content_new.jpg "First run response for call with unsafe content")

\    2.8.2 Second time with appropriate content (# 130). – what is an Ocean? Response for the second run shown below

![Second run response safe content](/img/16_second_run_safe_content_new.jpg "Second run response safe content")

**Conclusion**

Whilst LLMs are becoming more pervasive across the industry, guardrails around LLMs are a necessity which cannot be ignored. The discussion around guardrails spans several topics, including harmful content, restricting topics, detecting jail break attempts, and multi-modal content safety. HPE Private Cloud AI enables scalable deployment and consumption of LLMs and guardrail models on premises without sacrificing data privacy and operational control.

Please keep coming back to the [HPE Developer Community blog](https://developer.hpe.com/blog/) to learn more about HPE Private Cloud AI and get more ideas on how you can use it in your everyday operations.
