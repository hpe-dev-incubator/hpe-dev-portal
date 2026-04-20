---
title: "HPE Private Cloud AI: Interact with SQL Database using Natural Language"
date: 2026-04-20T08:24:41.751Z
author: Santosh Nagaraj, Isabelle Steinhauser
authorimage: /img/Avatar1.svg
disable: false
tags:
  - HPE Private Cloud AI, SQL, Natural Language
---
<< Explain about Natural Language(NL) and Structured Query Language(SQL). Importance of this using GenAI to unlock the insights from data.>>>

This blog post walks you through steps to deploy and configure various tools, required to demonstrate NL to SQL use case on HPE Private Cloud AI. By leveraging these technologies, organizations can enable non-technical users to interact with SQL Database and explore the possibilities of extracting various insights from their data.

## HPE Private Cloud AI

[HPE Private Cloud AI (HPE PCAI)](https://developer.hpe.com/platform/hpe-private-cloud-ai/home/) offers a comprehensive, turnkey AI solution designed to address key enterprise challenges, from selecting the appropriate LLMs to efficiently hosting and deploying them. Beyond these core functions, HPE Private Cloud AI empowers organizations to take full control of their AI adoption journey by offering a curated set of pre-integrated *NVIDIA Inference Microservices (NIM)* LLMs, along with a powerful suite of AI tools and frameworks for data engineering, analytics, and data science.

HPE AI Essentials is a software and data foundation layer designed to accelerate the development, deployment, and management of artificial intelligence (AI) and Generative AI (GenAI) applications. It is part of the **HPE Private Cloud AI** portfolio and provides a curated, ready-to-run suite of open-source and proprietary tools, enabling organizations to move from AI pilots to production quickly.

## Architecture

Explain the tools and frameworks used. 

Presto

HPE MLIS

Open-WebUI

MCP

Superset

## Prerequisites

The minimum OpenWebUI version needed is v0.6.31, which supports the MCP server as an external tool. HPE AI Essentials with MCP feature (v1.12 or greater).

## Prepare Data Source

You may connect to your existing database to HPE PCAI using Data Services Connector, available in HPE AI Essentials. Else, you may choose to deploy a database using *Import Framework* feature.

### Deploy Database and load data

https://github.com/ai-solution-eng/frameworks/blob/main/postgresql/postgresql-latest.tar.gz

### Connect Database

### Explore Data Catalog



## LLM Deployment

Deploy LLM using HPE MLIS framework, available in AI Essentials.

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