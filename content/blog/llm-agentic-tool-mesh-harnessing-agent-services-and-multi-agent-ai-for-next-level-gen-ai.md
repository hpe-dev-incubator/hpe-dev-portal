---
title: "LLM Agentic Tool Mesh: Harnessing agent services and multi-agent AI for
  next-level Gen AI"
date: 2024-12-12T17:08:46.212Z
author: Antonio Fin
authorimage: /img/afin_photo.jpg
disable: false
tags:
  - HPE
  - GenAI
  - LAT-Mesh
  - MultiAgents
---
<style>
li {
    font-size: 27px !important;
    line-height: 33px !important;
    max-width: none !important;
}
</style>

In our previous blog post, we explored the [Chat Service](https://developer.hpe.com/blog/ll-mesh-exploring-chat-service-and-factory-design-pattern/) of [LLM Agentic Tool Mesh](https://developer.hpe.com/blog/ll-mesh-democratizing-gen-ai-through-open-source-innovation-1/), an [open-source project](https://github.com/HewlettPackard/llmesh) aimed at democratizing Generative AI (Gen AI). 

Today, we'll delve into another core feature: the **Agent Service**. We'll discuss what agents are, explain the LLM Agentic Tool Mesh related services, and showcase examples from its repository. 

## Understanding LLM agents

In the context of Large Language Models (LLMs), an agent is an autonomous entity capable of:

* **Perceiving its environment**: Agents can gather and interpret information from their surroundings.
* **Making decisions**: Based on the perceived information, agents decide on the best course of action.
* **Acting on decisions**: Agents execute actions to achieve specific objectives.

These agents can operate independently or interact with one another to optimize their collective performance, depending on the complexity of the task.
In fact, multi-agent AI involves coordinating multiple agents, each specialized in a specific domain or function, to collaborate and achieve a common goal. These agents handle:

* **Task division**: Dividing complex tasks into manageable parts.
* **Specialization**: Each agent specializes in a particular function, such as information retrieval or decision-making.
* **Collaboration**: Agents communicate and share information for effective and efficient task execution.

![](/img/multiagents.png)

Managing such agents typically requires advanced coding and deep knowledge of agent-based systems. However, LLM Agentic Tool Mesh simplifies this process by providing high-level abstractions through intuitive prompts and configuration files. Users can focus on defining tasks and desired outcomes while LLM Agentic Tool Mesh handles the coordination, task distribution, and result aggregation behind the scenes.

## LLM Agentic Tool Mesh Agent Service

LLM Agentic Tool Mesh provides all the necessary tools to build a powerful agentic system by handling:

1. **Tool repository**
2. **Reasoning engine**
3. **Multi-agent task force**

### Tool repository

Agents in LLM Agentic Tool Mesh rely on tools to perform specialized tasks like information retrieval, document summarization, or data analysis. These tools extend the agents' capabilities, allowing them to efficiently complete complex operations. The **tool repository** service in LLM Agentic Tool Mesh simplifies and automates the storage, management, and retrieval of these tools.

Key Features:

* **Dynamic tool storage**: Add tools with associated metadata, including tool name, description, function, and usage parameters.
* **Tool retrieval**: Flexible search and retrieval functionality, enabling agents to access tools based on specific criteria.
* **Metadata management**: Store relevant metadata for each tool, aiding in decision-making for task assignments.

Example Usage:

```python
from athon.agents import ToolRepository

# Configuration for the Tool Repository
REPO_CONFIG = {
    'type': 'LangChainStructured'
}

# Initialize the Tool Repository
tool_repository = ToolRepository.create(REPO_CONFIG)
Adding a tool to the repository:
from langchain.tools import tool

@tool
def text_summarizer(text: str) -> str:
    """A simple text summarizer function"""
    return text[:50] 

metadata = {
    'category': 'NLP',
    'version': '1.0',
    'author': 'John Doe'
}

# Add the tool to the repository
add_result = tool_repository.add_tool(text_summarizer, metadata)

if add_result.status == "success":
    print("Tool added successfully.")
else:
    print(f"ERROR:\n{add_result.error_message}")

# Retrieve tools with a metadata filter
metadata_filter = {'category': 'NLP'}
get_result = tool_repository.get_tools(metadata_filter)

if get_result.status == "success":
    print(f"RETRIEVED TOOLS:\n{get_result.tools}")
else:
    print(f"ERROR:\n{get_result.error_message}")
```

### Reasoning engine

The **reasoning engine** orchestrates interactions between the LLM and various tools, enabling agents to seamlessly combine decision-making capabilities with tool-based actions. It extends the chat capabilities by managing the dynamic integration of tools with the LLM, allowing for real-time decision-making and task execution.

Key Features:

* **Tool orchestration**: Coordinates between the LLM and tools, deciding which tools to invoke based on context and user input.
* **Memory management**: Handles storage and retrieval of relevant memory for ongoing tasks or conversations.
* **Dynamic configuration**: Allows users to adjust the Reasoning Engine's behavior dynamically, tailoring interactions between LLMs and tools.

![](/img/reasoning.png)

### Task force

The **multi-agents task force** service enables the orchestration of complex tasks through a network of specialized agents. This service allows users to define a structured workflow where each agent is assigned a specific task, executed in sequence or parallel.

Key Features:

* **LLM-driven planning**: Integrates with an LLM to plan task sequences, ensuring intelligent coordination.
* **Agent specialization**: Each agent specializes in a particular task, tailored through prompts defining their role, backstory, and goals.
* **Task-oriented workflow**: Supports both sequential and parallel task execution, configurable through prompts and configuration files.
* **Tool integration**: Agents utilize a suite of tools to complete their tasks, dynamically loaded and executed during task completion.

Example Usage:

```python
from athon.agents import TaskForce
from custom_tools import DataFetcher, SalesSummarizer, PresentationBuilder

# Example configuration for the Task Force Multi-Agents
TASK_FORCE_CONFIG = {
    'type': 'CrewAIMultiAgent',
    'plan_type': 'Sequential',
    'tasks': [
        {
            'description': 'Analyze the recent sales data.',
            'expected_output': 'A summary report of sales trends.',
            'agent': {
                'role': 'Data Analyst',
                'goal': 'Summarize sales data',
                'backstory': 'Experienced in sales data analysis',
                'tools': ['DataFetcher', 'SalesSummarizer']
            }
        },
        {
            'description': 'Prepare a presentation based on the report.',
            'expected_output': 'A presentation deck summarizing the sales report.',
            'agent': {
                'role': 'Presentation Specialist',
                'goal': 'Create a presentation',
                'backstory': 'Expert in creating engaging presentations',
                'tools': ['PresentationBuilder']
            }
        }
    ],
    'llm': {
        'type': 'LangChainChatOpenAI',
        'api_key': 'your-api-key-here',
        'model_name': 'gpt-4o-mini'
    },
    'verbose': True,
    'memory': False
}

# Initialize the Task Force with the provided configuration
task_force = TaskForce.create(TASK_FORCE_CONFIG)

# Run the task force with an input message
input_message = "Generate a sales analysis report and prepare a presentation."
result = task_force.run(input_message)

# Handle the response
if result.status == "success":
    print(f"COMPLETION:\n{result.completion}")
else:
    print(f"ERROR:\n{result.error_message}")
```

## LLM Agentic Tool Mesh in Action: Examples from the Repository

The LLM Agentic Tool Mesh GitHub repository includes several examples demonstrating the versatility and capabilities of the agent services.

### Chatbot application (examples/app_chatbot)

This chatbot is capable of reasoning and invoking appropriate LLM tools to perform specific actions. You can configure the chatbot using files that define LLM Agentic Tool Mesh platform services, project settings, toolkits, and memory configurations. The web app orchestrates both local and remote LLM tools, allowing them to define their own HTML interfaces, supporting text, images, and code presentations.

Configuration Example:

```yaml
projects:
  - name: "Personal Chat"
    memory:
      type: LangChainBuffer
      memory_key: chat_history
      return_messages: true
    tools:
      - "https://127.0.0.1:5002/"     # Basic Copywriter
  - name: "Project 5G Network"
    memory:
      type: LangChainRemote
      memory_key: chat_history
      return_messages: true
      base_url: "https://127.0.0.1:5010/"
      timeout: 100
      cert_verify: false
    tools:
      - "https://127.0.0.1:5005/"     # OpenAPI Manager
      - "https://127.0.0.1:5006/"     # IMS Expert
  - name: "Project Meteo"
    memory:
      type: LangChainBuffer
      memory_key: chat_history
      return_messages: true
    tools:
      - "https://127.0.0.1:5003/"     # Temperature Finder
      - "https://127.0.0.1:5004/"     # Temperature Analyzer
```

### OpenAPI manager (examples/tool_agents)

The OpenAPI Manager is a multi-agent tool that reads OpenAPI documentation and provides users with relevant information based on their queries. It uses the Task Force service to answer questions related to 5G APIs.

Capabilities:

* **ListOpenApis**: Lists all OpenAPI specifications present in the system.
* **SelectOpenApi**: Selects a specific OpenAPI specification.
* **GetOpenApiVersion**: Returns the OpenAPI version of the selected specification.
* **GetInfo**: Returns the information dictionary of the selected specification.
* **GetMethodsByTag**: Lists all methods of the selected specification for a specific tag.
* **GetMethodById**: Returns detailed information about a method selected by ID.
* **GetRequestBody**: Returns the request body schema of the selected specification.
* **GetResponse**: Returns the response schema of the selected specification.

![](/img/mesh.png)

## Conclusion

The **LLM Agentic Tool Mesh Agent Service** exemplifies how advanced design principles and innovative prompt engineering simplify and enhance the adoption of Gen AI. By abstracting complexities and providing versatile examples, LLM Agentic Tool Mesh enables developers and users alike to unlock the transformative potential of Gen AI in various domains.

Stay tuned for our next post, where we'll explore another key service of LLM Agentic Tool Mesh and continue our journey to democratize Gen AI!