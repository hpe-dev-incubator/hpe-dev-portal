---
title: "LLM Agentic Tool Mesh: Harnessing agent services and multi-agent AI for
  next-level Gen AI"
date: 2024-12-12T17:08:46.212Z
author: Antonio Fin
authorimage: /img/afin_photo.jpg
disable: false
---
<style>
li {
    font-size: 27px !important;
    line-height: 33px !important;
    max-width: none !important;
}
</style>

In our previous blog post, we explored the [Chat Service](https://developer.hpe.com/blog/ll-mesh-exploring-chat-service-and-factory-design-pattern/) of [LLM Agentic Tool Mesh](https://developer.hpe.com/blog/ll-mesh-democratizing-gen-ai-through-open-source-innovation-1/), an [open-source project](https://github.com/HewlettPackard/llmesh) aimed at democratizing Generative AI (Gen AI). 

Today, we'll delve into another core feature: the **Agent Service**. We'll discuss what agents are, explain the LLM Agentic Tool Mesh related services, and showcase examples from the LLM Agentic Tool Mesh repository. 

## Understanding LLM agents

In the context of Large Language Models (LLMs), an agent is an autonomous entity capable of:

* **Perceiving its environment**: Agents can gather and interpret information from their surroundings.
* **Making decisions**: Based on the perceived information, agents decide on the best course of action.
* **Acting on decisions**: Agents execute actions to achieve specific objectives.

These agents can operate independently or interact with one another to optimize their collective performance, depending on the complexity of the task.
In fact, multi-agent AI involves coordinating multiple agents, each specialized in a specific domain or function, to collaborate and achieve a common goal. These agents handle:

* **Task Division**: Dividing complex tasks into manageable parts.
* **Specialization**: Each agent specializes in a particular function, such as information retrieval or decision-making.
* **Collaboration**: Agents communicate and share information for effective and efficient task execution.

![](/img/multiagents.png)

Managing such agents typically requires advanced coding and deep knowledge of agent-based systems. However, LLM Agentic Tool Mesh simplifies this process by providing high-level abstractions through intuitive prompts and configuration files. Users can focus on defining tasks and desired outcomes while LLM Agentic Tool Mesh handles the coordination, task distribution, and result aggregation behind the scenes.

## LLM Agentic Tool Mesh Agent Service

LLM Agentic Tool Mesh provides all the necessary tools to build a powerful agentic system by handling:

1. Tool repository
2. Reasoning engine
3. Multi-agent task force

Let's explore each of these components in detail.

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
Retrieving tools based on metadata:
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

Architecture Overview:

![](/img/reasoning.png)

### Task force multi-agents

The Task Force Multi-Agents service enables the orchestration of complex tasks through a network of specialized agents. This service allows users to define a structured workflow where each agent is assigned a specific task, executed in sequence or parallel.
Key Features:
•	LLM-Driven Planning: Integrates with an LLM to plan task sequences, ensuring intelligent coordination.
•	Agent Specialization: Each agent specializes in a particular task, tailored through prompts defining their role, backstory, and goals.
•	Task-Oriented Workflow: Supports both sequential and parallel task execution, configurable through prompts and configuration files.
•	Tool Integration: Agents utilize a suite of tools to complete their tasks, dynamically loaded and executed during task completion.
Example Usage:
from athon.agents import TaskForce

# Configuration for the Task Force Multi-Agents

TASK_FORCE_CONFIG = {
    'type': 'CrewAIMultiAgent',
    'plan_type': 'Sequential',
    'tasks': \[
        {
            'description': 'Perform research to gather information for a blog post on {request}.',
            'expected_output': 'A summary of key insights related to the topic.',
            'agent': {
                'role': 'Research Agent',
                'goal': 'Gather relevant information for the blog post',
                'backstory': 'Expert in researching and summarizing information',
                'tools': []
            }
        },
        # Additional tasks...
    ],
    'llm': {
        'type': 'LangChainChatOpenAI',
        'api_key': 'your-api-key',
        'model_name': 'openai/gpt-4',
        'base_url': 'your-base-url'
    },
    'verbose': True,
    'memory': False
}

# Initialize the Task Force

task_force = TaskForce.create(TASK_FORCE_CONFIG)
Running the task force with an input message:

# Run the task force with an input message

input_message = "Write a blog post about the importance of renewable energy."
result = task_force.run(input_message)

# Handle the response

if result.status == "success":
    print(f"COMPLETION:\n{result.completion}")
else:
    print(f"ERROR:\n{result.error_message}")