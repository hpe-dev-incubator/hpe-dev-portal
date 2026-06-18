---
title: "HPE Private Cloud AI: Build your first Agent"
date: 2026-06-18T12:54:00.000Z
featuredBlog: true
author: Isabelle Steinhauser
authorimage: /img/steinhauser_isabelle-copy-copy.jpg
disable: false
tags:
  - hpe-private-cloud-ai
  - MCP
  - Langflow
  - agent
  - tutorial
---
This article provides step by step instructions to build your first AI agent on HPEs Private Cloud AI. To simplify things we will be using Langflow, which is a tool to provide a no-code UI experience. It can be adapted to other UI-based tools like for example N8N.

## HPE Private Cloud AI

[HPE Private Cloud AI (HPE PCAI)](https://developer.hpe.com/platform/hpe-private-cloud-ai/home/) offers a comprehensive, turnkey AI solution designed to address key enterprise challenges, from selecting the appropriate LLMs to efficiently hosting and deploying them. Beyond these core functions, HPE Private Cloud AI empowers organizations to take full control of their AI adoption journey by offering a curated set of pre-integrated *NVIDIA Inference Microservices (NIM)* LLMs, along with a powerful suite of AI tools and frameworks for data engineering, analytics, and data science.

HPE Machine Learning Inference Software (MLIS) is an enterprise-grade solution designed to simplify the deployment, management, and monitoring of machine learning (ML) models at scale. It specifically targets the complexities of moving models from development into production, with a particular focus on large language models.

HPE AI Essentials (AIE) Software is the integrated software layer that provides the tools for building, deploying, and managing generative AI applications, including HPE MLIS. It provides a flexible **Import Framework** that enables organizations to deploy their own applications or third-party solutions, like Langflow.

## Use Case

An AI Agent can autonomously act leveraging tools provided. In our example the AI Agent gets triggered by a users chat message. As tools we will use a regular RAG (Retrieval Augmented Generation) for retrieving information out of a PDF and the ezPresto MCP Server that has tools available to retrieve information from a Database. We provide two sets of sample data, one for a flight support agent to answer questions regarding refunds, and one for citizen passport queries, to answer questions around requested passports. In this tutorial we will take the flight support agent example. In order to use the Citizen Passport queries use the according [dataset](https://github.com/ai-solution-eng/ai-solution-demos/tree/main/basic-agent-langflow/data/passport). 

## Prerequisites

For this tutorial we require a feature in newer Private Cloud AI versions, specifically the ezPresto MCP Server, which is supported since AIE 1.12.

You will need at least 1 free GPU in your platform or a model with tool calling enabled, that's already deployed.

## Import additional Frameworks

We require two additional Frameworks for this tutorial: Langflow and Qdrant. As mentioned Langflow is a low-code/no-code interface we will use to build our agent. Qdrant is the vectordatabase we will be using. Langflow supports also other vectordatabases, feel free to swap it to a different one.

When importing additional Frameworks into the platform we require a Helm Chart. A Helm Chart is a deployment method for Kubernetes Clusters, which AIE basically is. You can find a repository of prepared helm charts [here](https://github.com/ai-solution-eng/frameworks/tree/main). If you have another application you would like to bring into AIE follow [these instructions](https://support.hpe.com/hpesc/public/docDisplay?docId=a00aie112hen_us&page=ManageClusters/importing-applications.html). Please keep in mind, with additional software you might bring additional vulnerabilities into your platform, so be mindful about what you're importing.

In order to import additional Frameworks navigate within AIE to 'Tools & Frameworks' and find the green button Import Framework on the top right.

**INSERT PICTURE**

### Import Langflow

Leverage the icon and Helmchart you can find [here](https://github.com/ai-solution-eng/frameworks/tree/main/langflow), with different versions available use the newest version, which is langflow-0.1.4-1.7.3.tgz while I am writing this blogpost. Follow the instruction in the import Framework Wizard. Use the namespace 'langflow'.

### Import Qdrant

Leverage the icon and Helmchart you can find [here](https://github.com/ai-solution-eng/frameworks/tree/main/qdrant). Use the namespace 'qdrant'. Follow the instruction in the import Framework Wizard. If you decide for a different namespace, please remember that namespace.

## Deploy Models in Private Cloud AI

We will be using two models in this use case: an Embedding Model for the RAG tool and a LLM as agent.

You can use different models of course following the deployment instructions. As an example let's deploy the **nvidia/nv-embedqa-e5-v5** as Embedding Model and **Qwen/Qwen3-8B-Instruct** as LLM. You could also use Nemotron for example.

### Deploy NVIDIA Embedding Model

For Model Deployment we first need to create a Packaged Model so it appears unter our GenAI>Model Catalog. Luckily the Embedding Model we want to use comes as part of the pre-selected NVIDIA NIMs configured ready to deploy. Therefore let's navigate to GenAI-Model Catalog. Identify the NVIDIA Embedding Model and click 'Deploy'. 

**INSERT PICTURE**

As a Autoscaling Policy for now we define 'Fixed 1'. Autoscaling policies are a very cool feature to dynamically adapt the models to the demand of end-users, if you are interested in learning more about it check [this](https://support.hpe.com/hpesc/public/docDisplay?docId=a00aie112hen_us&docLocale=en_US&page=MLIS/deployments/manage-autoscaling-template.html) out.

### Deploy Qwen as LLM

In order to deploy a model that is not yet found within the Model Catalog we need to create a Packaged Model first. In order to do so navigate to Tools & Frameworks > MLIS. Within MLIS you can create registries pointing to HuggingFace, NVIDIA NGC or also a S3 storage.

TO BE CONTINUED

## Data Source Setup

### Upload CSV File

Navigate to Data Engineering > Data Sources > Data Volumes. We will use a CSV File today. Therefore download the sample CSV file [here](https://github.com/ai-solution-eng/ai-solution-demos/blob/main/basic-agent-langflow/data/flight/fake_customer_info.csv) . Navigate to 'shared' and create a new folder called 'langflow-demo'. Navigate into this folder by clicking on it. Create a sub-directory within that folder and name it 'fake_customer_data'. Navigate by clicking on it, click the Upload Button and upload the CSV file.

You can name the folders differently, but then you will need to adapt the Adding Datasource instructions.

**INSERT PICTURE**

### Add as datasource

Once the file is uploaded we want to connect is a datasource. You could also use a database instead of a CSV file if you wanted to. Within AIE navigate to Data Engineering > Data Sources > Structured Data. Click 'Add New Datasource'. Select 'Hive'. Add the connection filling in the following details 

**Name:** fakecustomerinfo

**Hive Metastore:** Discovery

**Data Dir:** file:/data/shared/langflow-demo

**Advanced Field File Type:** CSV

When the connection is successful, if it was created as private (lock icon), click the three docs on the new `fakecustomerinfo` card and select "Change to public access" to make it public (globe icon), this gives all the users on the platform access to that datasource.

TO BE CONTINUED
