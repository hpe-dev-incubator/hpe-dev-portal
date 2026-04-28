---
title: "HPE Private Cloud AI: Natural Language to Structured Query Language"
date: 2026-04-23T11:35:26.524Z
author: Santosh Nagaraj, Isabelle Steinhauser
authorimage: /img/ai.webp
disable: false
tags:
  - HPE Private Cloud AI
  - SQL
  - Natural Language
  - MCP
---
In today's data-driven world, two fundamental languages enable us to interact with information: **Natural Language** and **SQL (Structured Query Language)**. Natural language is the way humans naturally communicate. It allows us to express ideas, ask questions, and convey intentions effortlessly, whether through speech or text. On the other hand, **SQL**  is a specialized language designed for managing and querying structured data stored in databases. While SQL is powerful for precise data retrieval, it often requires technical expertise and familiarity with database schemas.

Bridging the gap between these two languages is crucial for making data accessible and actionable. This is where **generative AI (GenAI)** comes into play. By leveraging advanced artificial intelligence (AI) models, we can translate natural language queries into SQL commands, enabling anyone, regardless of technical background to unlock valuable insights from complex, structured datasets. Using GenAI to interpret and generate queries democratizes data analysis, accelerates decision-making, and helps organizations harness their data's full potential for strategic advantage.

This blog post walks you through steps to deploy and configure various tools, required to demonstrate NL to SQL use case (using manufacturing dataset) on **HPE Private Cloud AI**. By leveraging these technologies, organizations can unlock valuable insights from their data.

## HPE Private Cloud AI

[HPE Private Cloud AI (HPE PCAI)](https://developer.hpe.com/platform/hpe-private-cloud-ai/home/) offers a comprehensive, turnkey AI solution designed to address key enterprise challenges, from selecting the appropriate large language models (LLMs) to efficiently hosting and deploying them. Beyond these core functions, HPE Private Cloud AI empowers organizations to take full control of their AI adoption journey by offering a curated set of pre-integrated *[NVIDIA Inference Microservices (NIM)](https://www.nvidia.com/en-us/ai-data-science/products/nim-microservices/)* LLMs, along with a powerful suite of AI tools and frameworks for data engineering, analytics, and data science.

**[HPE AI Essentials](https://support.hpe.com/hpesc/public/docDisplay?docId=a00aie112hen_us&page=About/aie-overview.html)** is a software and data foundation layer designed to accelerate the development, deployment, and management of artificial intelligence (AI) and GenAI applications. It is part of the **HPE Private Cloud AI** portfolio and provides a curated, ready-to-run suite of open-source and proprietary tools, enabling organizations to move from AI pilots to production quickly.

## Architecture

![](/img/screenshot-2026-04-23-151822.png)

### Prerequisites

Ensure that the following prerequisites are fulfilled:

* HPE AI Essentials version 1.12+, which has PrestoMCP 
* OpenWebUI version v0.6.31+, which supports the MCP server as an external tool.
* Role 'Private Cloud AI Administrator' assigned to the user. This is required to import PostgreSQL framework.
* Hugging Face user access token, to download the LLM.

## Prepare data source

You may connect to your existing database to HPE PCAI using Data Services Connector, available in HPE AI Essentials. Otherwise, you may choose to deploy a database using *Import Framework* feature, described in next section.

### Deploy database and load data

A sample Helm chart for PostgreSQL is available in the GitHub repo, [ai-solution-eng/frameworks.](https://github.com/ai-solution-eng/frameworks/tree/main/postgresql)

Deploy PostgreSQL on HPE Private Cloud AI using *Import Framework*

![](/img/screenshot-2026-04-23-184640.png)

Provide the Name, Description and Icon (from GitHub repo). 

![](/img/screenshot-2026-04-23-184320.png)

Upload the Helm chart that has been downloaded from GitHub.

![](/img/screenshot-2026-04-23-184131.png)

Update the PostgreSQL password in line #38.

![](/img/screenshot-2026-04-23-184251.png)

Review and submit.

![](/img/screenshot-2026-04-23-184352.png)

Within a few minutes, you'll find that the PostgreSQL framework is in 'Ready' state. 

### Load database file

Use the script, *[create_manufacturing_data.py](https://github.com/ai-solution-eng/ai-solution-demos/blob/main/nl-to-sql-mcp-manufacturing/create_manufacturing_data.py)* to create a sample data. Execute the script to create a new ".db" file, which will be used in the following steps.

```shell
python ./create_manufacturing_data.py
```

On HPE AI Essentials, open your Jupyter notebook server and upload the generated ".db" file and *[loaddata.py ](https://github.com/ai-solution-eng/ai-solution-demos/blob/main/nl-to-sql-mcp-manufacturing/loaddata.py)*script. You will need to update the password (that was provided while Importing Postgres), in line #9 of *loaddata.py* script.

After uploading these two files, open a terminal in the Jupyter notebook Server. Execute the following commands,

```shell
pip install psycopg2
python loaddata.py
```

### Connect database to HPE AI Essentials

* Navigate to **Data Engineering > Data Sources**
* In **Structured Data** click on **Add New Data Source**
* Select **PostgreSQL** and click **Create Connection**
* Fill in the details as below:

  * Name* : manufacturingdb
  * Connection URL*: jdbc:postgresql://postgresql.postgres.svc.cluster.local:5432/manufacturing
  * Connection User*: postgres
  * Connection Password*: "YOUR_DEFINED_PASSWORD"
  * Click on 'PostgreSQL Advanced Settings'
  * Case Insensitive Name Matching: Tick

![](/img/screenshot-2026-04-23-191659.png)

### Explore the data catalog

Once the data is loaded and database is connected, you can explore the available data via the Data Catalog.

* Navigate to **Data Engineering > Data Catalog**
* Select **manufacturingdb**
* Tick **public** schema
* See three tables, machine_metrics, machines and operators.
* Select one of the table, click **Data Preview** to get an overview of the data.

![](/img/screenshot-2026-04-23-153224.png)

![](/img/screenshot-2026-04-23-153549.png)

## LLM deployment

Deploy the **Qwen/Qwen3-8B-Instruct** LLM using HPE MLIS (Machine Learning Inference Software) framework, available in HPE AI Essentials. You may replace Qwen/Qwen3-8B-Instruct with any other model of your choice.

In HPE MLIS, **packaged models** -> create packaged model.

![](/img/screenshot-2026-04-23-154513.png)

![](/img/screenshot-2026-04-23-154632.png)

![](/img/screenshot-2026-04-23-154714.png)

Under 'Advanced' tab, set the following,

**Environment Variables:**

HUGGING_FACE_HUB_TOKEN: <<\*\*Your Hugging Face Token\*\*>>

**Arguments:** *\--model Qwen/Qwen3-8B --enable-reasoning --reasoning-parser qwen3 --enable-auto-tool-choice --tool-call-parser hermes --port 8080*

![](/img/screenshot-2026-04-23-200031.png)

After creating the packaged model, you may deploy the model.

**Deployments** -> Create deployment

![](/img/screenshot-2026-04-23-200126.png)

![](/img/screenshot-2026-04-23-200220.png)

![](/img/screenshot-2026-04-23-200318.png)

![](/img/screenshot-2026-04-23-200419.png)

After the model gets deployed, go to **HPE AI Essentials -> GenAI -> Model Endpoints.** 

Click on 'Action -> Generate API Token'. Copy the Model Endpoint and the API token to a text file, as you will need them in next steps.

![](/img/screenshot-2026-04-23-161519.png)

## Chat interface

Use the Open WebUI framework as the chat interface. Follow the steps to configure Open WebUI

#### Connect to LLM

* Open Open WebUI
* Navigate to **Admin Panel >> Settings >> Connections** 
* Add new 'OpenAI API' connection -- provide the Model Endpoint URL and API token saved in previous step.

![](/img/screenshot-2026-04-23-161912.png)

#### Configure MCP server

Navigate in Open WebUI to **Admin Panel >> Settings >> External Tools**

* Add a new Tool Server
* Change the type to MCP Streamable HTTP
* Add the URL of ezPresto MCP server, this can be retrieved from Data Engineering >> Data Sources >> MCP server. Open the menu and click on copy endpoint. 
* Add the [JWT token](https://support.hpe.com/hpesc/public/docDisplay?docId=a00aie112hen_us&page=Security/k8s-secret-auth-token.html) of the user you want to have the Presto Connections. The MCP agent gets access to all datasources this user has access to.
* Provide the ID and Name, PrestoMCP

![](/img/screenshot-2026-04-23-162520.png)

As final step in Open WebUI, you need to **Create a Model** that is leveraging the **Qwen3 8b** base model and has the MCP Server as a Tool. 

* Click in OpenWebUI on Workspace. Click **New Model**.
* Provide your Model a Name for example *Manufacturing* select Qwen/Qwen3-8B as Base Model
* Edit Visibility to *Public* in case you want the model to be available for everyone to chat
* Add a System Prompt for example: "Always use 'manufacturingdb' catalog and the schema 'public' for SQL queries. Syntax: catalog.schema.table is how you reference a table in presto"
* Click on the Advance Params and set *Function Calling* to *Native*, otherwise it will only make one call. You can edit this within your chat as well. Underneath Tools tick the *PrestoMCP Tool* and click Save&Create.

![](/img/screenshot-2026-04-23-163728.png)

## Natural Language to SQL

In Open WebUI, click on 'New Chat', select 'Manufacturing' and enable the 'PRESTOMCP' tool inside the chat interface.

![](/img/screenshot-2026-04-23-164049.png)

Using chat, you may now interact with the SQL database using natural language.

![](/img/screenshot-2026-04-23-190106.png)

## Conclusion

By using the tools in HPE AI Essentials; HPE MLIS's robust model management, PrestoMCP and Open WebUI's intuitive chat interface, one can create a powerful ecosystem for transforming natural language queries into actionable insights. This comprehensive approach democratizes data access, allowing users to effortlessly interact with complex datasets through conversational interfaces.

By enabling natural language to SQL translation, organizations can unlock the full potential of their data which accelerates decision-making, fostering data-driven culture, and gaining valuable insights without requiring deep technical expertise. As AI and data technologies continue to evolve, such implementations will become essential tools for making data more accessible, understandable, and impactful across all levels of an organization. 

Stay tuned to the [HPE Developer Community blog](https://developer.hpe.com/blog/) for more guides and best practices on leveraging HPE Private Cloud AI for your AI use cases.