---
title: LLM observability and cost management on HPE Private Cloud AI
date: 2026-03-06T06:06:26.225Z
author: Santosh Nagaraj & Claudio Calderon
authorimage: /img/santosh-picture.jpg
disable: false
---
LLM (Large language Model) observability and cost management are critical for deploying reliable, secure, and financially sustainable AI applications. By tracking metrics like token usage, latency, and output quality, teams can prevent runaway costs, reduce hallucinations, and ensure regulatory compliance.

[LiteLLM](https://www.litellm.ai/) and [Langfuse](https://langfuse.com/) together provide a powerful, open-source stack for LLM observability and cost management (tokenomics), allowing developers to unify, trace, and monitor API usage across hundreds of models. LiteLLM acts as the proxy/SDK to normalize requests and track usage, while Langfuse records these interactions for detailed analysis of token usage, latency, and costs.

This blog post walks you through deployment and configuration of LiteLLM and Langfuse on HPE Private Cloud AI. By leveraging these technologies, organizations can perform token-level cost tracking, granular tracing, output streaming and cost analysis of LLMs and AI applications deployed on HPE Private Cloud AI.

## HPE Private Cloud AI

[HPE Private Cloud AI (HPE PCAI)](https://developer.hpe.com/platform/hpe-private-cloud-ai/home/) offers a comprehensive, turnkey AI solution designed to address key enterprise challenges, from selecting the appropriate LLMs to efficiently hosting and deploying them. Beyond these core functions, HPE Private Cloud AI empowers organizations to take full control of their AI adoption journey by offering a curated set of pre-integrated *NVIDIA Inference Microservices (NIM)* LLMs, along with a powerful suite of AI tools and frameworks for data engineering, analytics, and data science.

HPE Machine Learning Inference Software (MLIS) is an enterprise-grade solution designed to simplify the deployment, management, and monitoring of machine learning (ML) models at scale. It specifically targets the complexities of moving models from development into production, with a particular focus on large language models. 

HPE Private Cloud AI has pre-integrated NVIDIA NIM LLMs, a suite of AI tools (including HPE Machine Learning Inference Software), and a flexible **Import Framework** that enables organizations to deploy their own applications or third-party solutions, like LiteLLM and Langfuse.

![](/img/screenshot-2026-03-06-121708.png)

## Deploy Langfuse and LiteLLM via Import Framework

### 1. Prepare the Helm charts for Langfuse

Obtain the Helm chart for Langfuse from the [GitHub repository](https://github.com/langfuse/langfuse-k8s) and implement the prerequisites. Here's the [reference document](https://support.hpe.com/hpesc/public/docDisplay?docId=a00aie18hen_us&page=ManageClusters/importing-applications.html) for the import framework prerequisites.

These updates are implemented in the revised Langfuse Helm charts, and are available in the [GitHub repository](https://github.com/ai-solution-eng/frameworks/tree/main/langfuse). With these customizations, *Langfuse* can now be deployed on HPE Private Cloud AI using **Import Framework**.

### 2. Deploy and configure Langfuse

Use import framework in HPE Private Cloud AI to deploy Langfuse.

![](/img/screenshot-2026-03-06-152537.png)

![](/img/screenshot-2026-03-06-152941.png)

![](/img/screenshot-2026-03-06-153003.png)

![](/img/screenshot-2026-03-06-153018.png)

After few minutes, Langfuse gets deployed in HPE Private Cloud AI and will be in **Ready** state.

![](/img/screenshot-2026-03-06-153639.png)

### 3. Configure Langfuse and create API Keys

Access the Langfuse application deployed on HPE Private Cloud AI by creating a new sign-in account. Set up your **organization** and **project** in Langfuse and create a new API key for this project. *Project Settings->Project API Keys-> create new API keys*

![](/img/screenshot-2026-03-06-153759.png)

Secure the generated API keys, these will be used while deploying LiteLLM. 

### 4. Prepare the Helm charts for LiteLLM

Obtain the Helm chart for LiteLLM from [litellm-helm](https://github.com/BerriAI/litellm/tree/main/deploy/charts/litellm-helm) repository and implement the prerequisites. Here's the [reference document](https://support.hpe.com/hpesc/public/docDisplay?docId=a00aie18hen_us&page=ManageClusters/importing-applications.html) for the import framework prerequisites.

These updates are implemented in the revised LiteLLM Helm charts, and are available in the [GitHub repository](https://github.com/ai-solution-eng/frameworks/tree/main/litellm-helm).

### 5. Deploy and configure LiteLLM

Use the  **Import Framework** in HPE Private Cloud AI to deploy LiteLLM.

![](/img/screenshot-2026-03-06-160236.png)

![](/img/screenshot-2026-03-06-160303.png)

Set the default username/password (UI_USERNAME/UI_PASSWORD) for LiteLLM application and Langfuse details (LANGFUSE_HOST, LANGFUSE_PUBIC_KEY, LANGFUSE_SECRET_KEY - Obtained in Step#3) in *values.yaml* as shown below. 

![](/img/screenshot-2026-03-06-160517.png)

![](/img/screenshot-2026-03-06-160546.png)

After few minutes, LiteLLM will be deployed in HPE Private Cloud AI and will be in **Ready** state.

![](/img/screenshot-2026-03-06-161531.png)

## 6. Deploy LLM in HPE MLIS

HPE MLIS is accessed by clicking on **HPE MLIS** tile in **Tools & Frameworks** tab.

![](/img/screenshot-2026-03-06-162245.png)

To deploy a pre-packaged LLM (llama-3.1-8b-instruct) in HPE MLIS, you need to create a new deployment as shown below.

![](/img/screenshot-2026-03-06-162547.png)

Click on **Create Deployment**, give a name to the new deployment, choose the appropriate packaged model, and set the scaling factor.

![](/img/screenshot-2026-03-06-162617.png)

![](/img/screenshot-2026-03-06-162630.png)

![](/img/screenshot-2026-03-06-162649.png)

![](/img/screenshot-2026-03-06-162710.png)

After few minutes, the deployment status will be **Ready**.

![](/img/screenshot-2026-03-06-162732.png)

### 7. LLM endpoint and API keys

LLM endpoint details can be obtained via **GenAI**->**Model Endpoints**.

![](/img/screenshot-2026-03-06-163934.png)

Generate an API token for the LLM via, **Actions** -> **Generate API Token**.

![](/img/screenshot-2026-03-06-164059.png)

![]()

After generating and securing the API token, you will configure LiteLLM with the LLM details. 

### 8. Configure LiteLLM

Launch the LiteLLM application deployed on HPE Private Cloud AI and sign-in using the credentials set in *values.yaml* 

![](/img/screenshot-2026-03-06-165129.png)

Add the LLM information, Models + EndPoints -> Add Model and provide the LLM details like Provider, LLM Model Name, API Base and OpenAI API Key.

![](/img/screenshot-2026-03-06-165511.png)

You can associate the cost to this model by updating **Input Cost (per 1M tokens)** and **Output Cost (per 1M tokens)** inside **Model Settings**.

![](/img/screenshot-2026-03-04-114358.png)

Now, create a new virtual key in LiteLLM to access the model, 

![](/img/screenshot-2026-03-06-165904.png)

Using the LiteLLM virtual key and the LiteLLM URL, you can access the LLM (meta/llama-3.1) and use it in any AI application.

Sample code snippet to call meta/llama via LiteLLM. (Replace your LiteLLM API key in the code)

```
import requests
import json

import os

LITELLM_PROXY_API_KEY = "sk-***********"

url = 'https://litellm.ai-application.pcai0109.dc15.hpecolo.net/chat/completions'
headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {LITELLM_PROXY_API_KEY}'
}
data = {
    "model": "openai/meta/llama-3.1-8b-instruct",
    "messages": [
        {
            "role": "user",
            "content": "Describe Angkor Wat in 300 words"
        }
    ]
}

response = requests.post(url, headers=headers, json=data, verify=False)
print(json.dumps(response.json(), indent=2))
```

### 9. LLM observability and cost analysis in Langfuse

Access the Langfuse application deployed on HPE Private Cloud AI and log in using the credentials. The traces of the LLM calls will appear under **Observability** -> **Tracing**.

![](/img/screenshot-2026-03-09-113852.png)

The home page of the project shows various metrics from LLM traces, which provides details on LLM usage, associated costs, etc.

![](/img/screenshot-2026-03-09-114413.png)

Dashboards with custom widgets can be created in Langfuse to observe various parameters of LLM traces. A sample custom dashboard created in Langfuse is shown below.

![](/img/screenshot-2026-03-09-114052.png)

## Conclusion

By combining capabilities of LiteLLM and Langfuse with HPE MLIS’s robust model management, HPE Private Cloud AI empowers organizations to observe perform cost management of LLMs in their AI solutions. This integrated approach ensures data privacy, operational control, and scalability for deployments.

Stay tuned to the [HPE Developer Community blog](https://developer.hpe.com/blog/) for more guides and best practices on leveraging HPE Private Cloud AI for your AI.