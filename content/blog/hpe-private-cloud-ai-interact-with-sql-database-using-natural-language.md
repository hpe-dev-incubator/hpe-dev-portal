---
title: "HPE Private Cloud AI: Natural Language to Structured Query Language"
date: 2026-04-20T08:24:41.751Z
author: Santosh Nagaraj, Isabelle Steinhauser
authorimage: /img/Avatar1.svg
disable: false
tags:
  - HPE Private Cloud AI, SQL, Natural Language
---
In today's data-driven world, two fundamental languages enable us to interact with information: **Natural Language** and **SQL (Structured Query Language)**. Natural language is the way humans naturally communicate. It allows us to express ideas, ask questions, and convey intentions effortlessly, whether through speech or text. On the other hand, **SQL**  is a specialized language designed for managing and querying structured data stored in databases. While SQL is powerful for precise data retrieval, it often requires technical expertise and familiarity with database schemas.

Bridging the gap between these two languages is crucial for making data accessible and actionable. This is where **Generative AI (GenAI)** comes into play. By leveraging advanced AI models, we can translate natural language queries into SQL commands, enabling anyone, regardless of technical background to unlock valuable insights from complex, structured datasets. Using GenAI to interpret and generate queries democratizes data analysis, accelerates decision-making, and helps organizations harness their data's full potential for strategic advantage.

This blog post walks you through steps to deploy and configure various tools, required to demonstrate NL to SQL use case (using manufacturing dataset) on **HPE Private Cloud AI**. By leveraging these technologies, organizations can unlock valuable insights from their data.

## HPE Private Cloud AI

[HPE Private Cloud AI (HPE PCAI)](https://developer.hpe.com/platform/hpe-private-cloud-ai/home/) offers a comprehensive, turnkey AI solution designed to address key enterprise challenges, from selecting the appropriate LLMs to efficiently hosting and deploying them. Beyond these core functions, HPE Private Cloud AI empowers organizations to take full control of their AI adoption journey by offering a curated set of pre-integrated *NVIDIA Inference Microservices (NIM)* LLMs, along with a powerful suite of AI tools and frameworks for data engineering, analytics, and data science.

**HPE AI Essentials** is a software and data foundation layer designed to accelerate the development, deployment, and management of artificial intelligence (AI) and GenAI applications. It is part of the **HPE Private Cloud AI** portfolio and provides a curated, ready-to-run suite of open-source and proprietary tools, enabling organizations to move from AI pilots to production quickly.

## Architecture

![](/img/screenshot-2026-04-23-151822.png)

### Prerequisites

Ensure that the following prerequisites are fulfilled:

* HPE AI Essentials version 1.12+, which has PrestoMCP 
* OpenWebUI version v0.6.31, which supports the MCP server as an external tool. 

## Prepare Data Source

You may connect to your existing database to HPE PCAI using Data Services Connector, available in HPE AI Essentials. Else, you may choose to deploy a database using *Import Framework* feature, described in next section.

### Deploy Database and load data

Sample Helm chart for PostgreSQL is available in the GitHub repo, [ai-solution-eng/frameworks.](https://github.com/ai-solution-eng/frameworks/tree/main/postgresql)

Deploy PostgreSQL on HPE Private Cloud AI using *Import Framework*

*"Pictures of deployment"*



### Connect Database

Use the script, *[create_manufacturing_data.py](https://github.com/ai-solution-eng/ai-solution-demos/blob/main/nl-to-sql-mcp-manufacturing/create_manufacturing_data.py)* to create a sample data. Execute the script to create a new ".db" file, which will be used in the following steps.

```shell
python ./create_manufacturing_data.py
```

On HPE AI Essentials, open your Jupyter Notebook server and upload the generated ".db" file and *[loaddata.py](https://github.com/ai-solution-eng/ai-solution-demos/blob/main/nl-to-sql-mcp-manufacturing/loaddata.py)*. You will need to update the password (that was provided while Importing Postgres), in line #9 of *loaddata.py* script.

After uploading these two files, open a terminal in the JupyterNotebook Server. Execute the following commands,

```shell
pip installpsycopg2
python loaddata.py
```

### Explore Data Catalog

Once the data is loaded, you can explore the available data via the Data Catalog.

* Navigate to **Data Engineering > Data Catalog**
* Select **manufacturingdb**
* Tick **public** schema
* See three tables, machine_metrics, machines and operators.
* Select one of the table, click **Data Preview** to get an overview of the data.

![](/img/screenshot-2026-04-23-153224.png)

![](/img/screenshot-2026-04-23-153549.png)

## LLM Deployment

Deploy **Qwen/Qwen3-8B-Instruct** LLM using HPE MLIS (Machine Learning Inference Software) framework, available in HPE AI Essentials. You may replace Qwen/Qwen3-8B-Instructwith any other model of your choice.

In HPE MLIS, **Packaged Models** -> Create Packaged Model.

![](/img/screenshot-2026-04-23-154513.png)

![](/img/screenshot-2026-04-23-154632.png)

![](/img/screenshot-2026-04-23-154714.png)

Under 'Advanced' tab, set the following,

Environment Variables:

HUGGING_FACE_HUB_TOKEN: <<Your HuggingFace Token>>

Arguments: *\--model Qwen/Qwen3-8B --enable-reasoning --reasoning-parser qwen3 --enable-auto-tool-choice --tool-call-parser hermes --port 8080*

![](/img/screenshot-2026-04-23-154820.png)

After creating packaged model, you may deploy the model.

**Deployments** -> Create Deployment

![](/img/screenshot-2026-04-23-155623.png)





At the end copy the Model Endpoint and the API tokens to a text file as we will need them in next steps.

<!--EndFragment-->

 generate a API Key

## Chat Interface

 using HPE

### Configure Open-WebUI

steps to configure OpenwebUI

#### Connect to LLM

Steps to conenct to LLM deployed in previous step

#### Configure MCP Server

## Natural Language to SQL

The chat interface is ready and you may now interact with the Database.

## Dashboard

### Superset configuration

#### Connect Superset to Presto

<Describe steps>

#### Create Datasets

<Describe steps>

#### Dashboard

<Describe steps>