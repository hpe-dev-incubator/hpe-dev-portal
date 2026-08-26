---
title: Bring your agent to the next level - Introduce LiteLLM for Cost
  management and Guardrails to your Agent Workflow
date: 2026-08-26T14:46:00.000Z
featuredBlog: false
author: Isabelle Steinhauser & Claudio Calderon
authorimage: /img/steinhauser_isabelle-copy-copy.jpg
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

An AI Gateway like LiteLLM can not only manage Model Ednpoints but also MCP Servers, Agents and Guardrails. This tutorial covers how to manage access and costs of an existing Agent, for example the Flight Support Agent or Citizen Passport agent, as described [here, ](<>)exposed as MCP Server in LiteLLM and use OpenWebUI as Frontend to interact with it. Additionally Guardrails are introduced.

## Prerequisites

This tutorial requires a feature available in newer Private Cloud AI versions—specifically the ezPresto MCP Server, supported since **AIE 1.12**. In addition we are using LiteLLM and OpenWebUI, new default Frameworks included since **AIE 1.13/2026070**. If you are working on an older version, you can import the frameworks as explained for LiteLLM [here. ](https://developer.hpe.com/blog/llm-observability-and-cost-management-on-hpe-private-cloud-ai/)

this tutorial assumes the agentic Langflow Flow to be already existing. You can follow [this tutorial](https://developer.hpe.com/blog/hpe-private-cloud-ai-build-your-first-agent/) in order to create one. For creating this sample Agent you will need **at least 1 free GPU** in your platform or a model with tool calling enabled, that's already deployed. If you only have one free GPU you will need to switch to a CPU only embedding model, the one included in that linked instruction is using a GPU. You also need a **HuggingFace account** to deploy the LLM.

## Manage a Langflow Flow in LiteLLM as MCP Server

Your Langflow should look similar to this, a project, can be the Starter Project or also another Project, has at least one flow with your agent in it.

![Langflow Flow Overview](/img/langflow-flow-overview.png)

When you open your flow you have a Chat Input, a Chat Output and something in between that is your Agent interaction. In our example we have an Agent with a custom RAG tool available, and a connection to the ezPresto MCP Server.

![Flight Support Agent Flow](/img/flight-support-agent-flow.png)

You can also use your own custom flow. Every Langflow Project is exposed as MCP Server per default. Each Flow in this Project is one tool available in the MCP Server. Navigate to your Project and instead of 'Flows' select 'MCP Server'. 

![Flow Overview MCP Server](/img/flow-overview-mcp-server.png)

This is the MCP Server we are about to use. If you are using the Starter Project you might want to enable Auth first.

When you want to edit the name or the description of the tools available in your MCP Server you can click Edit Tools in order to change those.

![Langflow Edit Tools](/img/langflow-edit-tools.png)

Within the 'JSON' configuration file for Transport Type 'Streamable HTTP' we can see the URL for our MCP Server. This information we need for later. Click on Generate API key in order to have a JSON with a fresh created API Key. These two informations are needed for adding it into LiteLLM in a later step.

![Langflow MCP Server URL](/img/langflow-mcp-server-url.png)

Let's proceed to LiteLLM. Navigate to MCP Servers. In this example we already have a connection to the EzPresto MCP Server. 

![LiteLLM MCP Servers](/img/litellm-mcp-servers.png)

Let's add a new one, therefore click on the button 'Add New MCP Server'.  There are a few predefined, but we will need to create a custom one.

![LiteLLM Add MCP Server](/img/litellm-add-mcp-server.png)

Select 'Custom MCP Sever'. Fill in a custom name and description for your MCP server, for example 'flightagent'. Please select for the Transport Type 'Streamable HTTP'.

![LiteLLM Add Langflow MCP Server Transport Type](/img/litellm-add-langflow-mcp-server-transport-type.png)

For the MCP Server URL enter the URL retrieved from the JSON in Langflow. As Authentication choose API Key and paste in the API Key previously generated within Langflow. The connection status should switch immediately to connected. You will see the tools listed, being the flows you have available in your Project, and can define in the Tool Configuration which of these tools can be called by a user. Within the Cost Configuration define a default cost for a Tool Call of this MCP Server.

![LiteLLM Add Langflow MCP Server URL and API Key](/img/litellm-add-langflow-mcp-server-url-and-api-key.png)

Regarding access you can manage your Teams within LiteLLM and add this new MCP Server to those teams. When creating a Virtual Key you can select within the Optional Settings in the MCP Settings which MCP Servers are allowed with this Virtual Key. Or you can allow the access to this MCP Server per default for all virtual keys. To achieve that click on the Permission Management/Access Control and toggle the 'Allow All LiteLLM Keys'. 

![LiteLLM Add Langflow MCP Server Allow All Keys](/img/litellm-add-langflow-mcp-server-allow-all-keys.png)

With this setting any Virtual Key you create will have access to this MCP Server. Let's click 'Add MCP Server'.

## Interact with your Langflow Flow managed in LiteLLM via Open WebUI

In order to interact with this MCP Server we can use a frontend, like for example Open WebUI. Therefore we need to add an integration. Navigate to Open WebUI -> Admin Panel. 

![OpenWebUI Admin Panel](/img/openwebui-admin-panel.png)

Go to Settings -> Integrations. Click on + to Add a Connection.

![OpenWebUI Add Integration](/img/openwebui-integrations.png)

Change the type to MCP Streamable HTTP add a custom name for example 'flightagent'. The URL is the endpoint of your LiteLLM, usually that would be https://litellm.YOURDOMAINNAME we need to append after that /NAMEOFYOURMCPSERVER/mcp . This results in our example into *https://litellm.YOURDOMAINNAIME/flightagent/mcp* . As Token add any virtualkey you have already created within LiteLLM or create a new one (Virtual Keys -> Create New Key). Click 'Save'.

![OpenWebUI Add MCP Connection](/img/openwebui-add-mcp-connection.png)

In order to interact with this Agentflow create a 'new Chat'. You can select a model to chat with, in this example we use a gpt-oss-120b deployed on the same Private Cloud AI, managed via LiteLLM.

![](/img/models-deployed-in-aie.png "Models deployed in HPEs Private Cloud AI")

 This can be any model with tool calling enabled. When you click Integrations under tools your added Integration should appear. Click the toggle to enable it for your chat message.

![OpenWebUI new chat](/img/openwebui-new-chat.png)

Now enter a chat message, for example 'Hi my name is John and I got downgraded on flight A105. What is my refund' and the Langflow Flow is being executed. In this example the Langflow Flow retrieves the refund policies from a VectorDB and combines it with executing the *ezPrestoMCP* server for some more information on John, eg how much he paid for his ticket.

![](/img/openwebui-chat-with-langflow-agent.png "OpenwebUI chat with Langflow Agent")

If you defined costs per tool call you can see increasing costs in the overview dashboard visible within LiteLLM under 'Usage'.

This is great. Let's explore how we can add Guardrails to this flow.

## Add a guardrail in LiteLLM

Within LiteLLM navigate to Guardrails -> Guardrails and select 'Add New Guardrail'. Click on 'Add Provider Guardrail'.

![LiteLLM Add Provider Guardrail](/img/litellm-add-provider-guardrail.png)

You need to enter a Guardrail Name. We can choose between several Guardrail Providers, some of these being 3rd party where a license would be required. Today select the LiteLLM Content Filter which is built-in. Keep the default mode 'pre_call'. There are several others you could choose like 'post_call' or 'pre_mcp_call'. This decides where your guardrail intercepts, for example before a call to the model is made, after the call is made, or before the model calls a MCP tool. In order for the guardrail to be active select Always On Yes. The guardrail will apply to all models immediately then.

![LiteLLM Create Guardrail](/img/litellm-create-guardrail.png)

In order to proceed click Next. In this view select the Topics you want to block. There are several ones to choose from, as we want to block Insults select 'Insult & Personal Attacks'. When you select a Topic you get a preview of the YAML that applies and contains several keywords that are blocked with this topic. Click the '+ Add' Button additionally in order to add this Topic to your Guardrail.

![LiteLLM Guardrail Topics](/img/litellm-guardrail-topics.png)

You can define the Action that should be executed once the topic is identified with a choice between BLOCK and MASK. Also the Severity Threshold can be selected. For our example choose BLOCK.

![LiteLLM Guardrail Insults Action](/img/litellm-guardrail-insults-action.png)

In the next steps you can add specific patterns, samples like E Mail addresses or custom regex to your guardrail as well as keywords. Continue without those. Proceed through the wizard and click 'Create Guardrail'.

Without any further action the Guardrail immediately applies to all calls to our AI Gateway. The reason for this is the selection of Always on. Let's test it in Open WebUI. If you insult the Agent, your request will be blocked.

![OpenWebUI Request Blocked](/img/openwebui-request-blocked.png)



This concludes the tutorial on how to bring your agent to the next level by introducing Tokenomics and Guardrails.

Please keep coming back to the [HPE Developer Community blog](https://developer.hpe.com/blog/) to learn more about HPE Private Cloud AI and get more ideas on how you can use it in your everyday operations.
