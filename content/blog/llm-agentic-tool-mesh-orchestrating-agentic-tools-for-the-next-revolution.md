---
title: "LLM Agentic Tool Mesh: Orchestrating agentic tools for the next revolution"
date: 2025-01-20T08:36:14.226Z
author: Antonio Fin
authorimage: /img/afin_photo.jpg
disable: false
tags:
  - HPE
  - GenAI
  - LAT-Mesh
---
<style>
li {
    font-size: 27px !important;
    line-height: 33px !important;
    max-width: none !important;
}
</style>

In our previous blog posts, we delved into the [Chat Service](https://developer.hpe.com/blog/ll-mesh-exploring-chat-service-and-factory-design-pattern/), [Agent Service](https://developer.hpe.com/blog/llm-agentic-tool-mesh-harnessing-agent-services-and-multi-agent-ai-for-next-level-gen-ai/), and [RAG Service](https://developer.hpe.com/blog/llm-agentic-tool-mesh-empowering-gen-ai-with-retrieval-augmented-generation-rag/) of [LLM Agentic Tool Mesh open source project](https://github.com/HewlettPackard/llmesh). Today, we'll explore the System Services of LLM Agentic Tool Mesh that are essential for managing and orchestrating the mesh of agentic tools. 

We'll provide insights into these services, showcase an example of a Mesh available in the repository, discuss federated governance, and share our vision for the future evolution of the LLM Agentic Tool Mesh project.

![](/img/mesh.png)

# Understanding the System Services

The System Services in LLM Agentic Tool Mesh are crucial for the seamless operation and orchestration of agentic tools and web applications. These services ensure consistency, ease of use, and flexibility across the platform. They include:

1. **Tool Client Service**
2. **Tool Server Service**

Let's explore each of these components in detail.

## Tool Client Service

The Tool Client Service enables developers to transform any code function into an LLM Agentic Tool Mesh tool by applying a simple decorator. This service abstracts the complexities of tool integration, allowing for quick conversion of functions into reusable tools within the LLM Agentic Tool Mesh ecosystem.

Key features:

* Decorator-based: Convert functions into tools using the `@AthonTool` decorator.
* Seamless integration: Decorated functions are fully integrated into the LLM Agentic Tool Mesh platform.

Example usage:

```python
from athon.system import AthonTool, Logger

config = {
    "greetings": "Hello World! Welcome, "
}
logger = Logger().get_logger()

@AthonTool(config, logger)
def hello_world(query: str) -> str:
    """Greets the user."""
    greeting_message = f"{config['greetings']} {query}!"
    return greeting_message.capitalize()
```

## Tool Server Service

The Tool Server Service provides the necessary infrastructure to manage and run LLM Agentic Tool Mesh tools on the platform. It includes capabilities for tool discovery and execution, ensuring that tools are easily accessible and efficiently managed.

Key features:

* Tool discovery: Automatically discover tools within the platform.
* Execution management: Manage the execution of tools, ensuring efficient operation.

![](/img/tools.png)

Example usage:

```python
from athon.agents import ToolRepository
from athon.system import ToolDiscovery

projects_config = [
    {
        "name": "Simple Project",
        "tools": [
            "examples/local_tool",          # A local tool path
            "https://127.0.0.1:5003/",      # A remote tool URL
        ]
    }
]
tools_config = {
    "type": "LangChainStructured"
}

def discover_and_load_tools(projects_config, tools_config):
    tool_repository = ToolRepository.create(tools_config)
    tool_discovery = ToolDiscovery()
    tool_id_counter = 1

    for project in projects_config:
        for tool_reference in project["tools"]:
            tool_info = tool_discovery.discover_tool(tool_reference)
            if tool_info:
                tool_metadata = {
                    "id": tool_id_counter,
                    "project": project["name"],
                    "name": tool_info["name"],
                    "interface": tool_info.get("interface")
                }
                tool_repository.add_tool(tool_info["tool"], tool_metadata)
                tool_id_counter += 1

    return tool_repository

# Run the tool discovery and loading process
tool_repository = discover_and_load_tools(projects_config, tools_config)

# Display the discovered tools
for tool in tool_repository.get_tools().tools:
    print(f"Discovered tool: {tool['name']} from project: {tool['metadata']['project']}")
```

# Building a mesh of LLM Agentic Tools

We have developed a series of web applications and tools, complete with examples, to demonstrate the capabilities of LLM Agentic Tool Mesh in out [GitHub repo](https://github.com/HewlettPackard/llmesh).

Web Applications:

* **Chatbot** (`examples/app_chatbot`): A chatbot capable of reasoning and invoking appropriate LLM tools to perform specific actions. You can configure the chatbot using files that define LLM Agentic Tool Mesh platform services, project settings, toolkits, and memory configurations. The web app orchestrates both local and remote LLM tools, allowing them to define their own HTML interfaces, supporting text, images, and code presentations.
* **Admin panel** (`examples/app_backpanel`): An admin panel that enables the configuration of basic LLM tools to perform actions via LLM calls. It allows you to set the system prompt, select the LLM model, and define the LLM tool interface, simplifying the process of configuring LLM tool interfaces.

Tools:

* **Basic copywriter** (`examples/tool_copywriter`): A tool that rewrites text, providing explanations for enhancements and changes.
* **Temperature finder** (`examples/tool_api`): Fetches and displays the current temperature for a specified location by utilizing a public API.
* **Temperature analyzer** (`examples/tool_analyzer`): Generates code using a language model to analyze historical temperature data and create visual charts for better understanding
* **Telco expert** (`examples/tool_rag`): A RAG tool that provides quick and accurate access to 5G specifications.
* **OpenAPI manager** (`examples/tool_agents`): A multi-agent tool that reads OpenAPI documentation and provides users with relevant information based on their queries.

## Running the examples

You can run the tools and web applications individually or use the provided `run_examples.sh` script to run them all together. Once everything is started:

* Access the chatbot at `https://127.0.0.1:5001/`
* Access the admin panel at `https://127.0.0.1:5011/`

![](/img/mesh-apps.png)

# Federated governance and standards

In the LLM Agentic Tool Mesh platform, the management of LLM tools is decentralized, promoting flexibility and innovation. To ensure this decentralization does not compromise the platform's integrity, LLM Agentic Tool Mesh implements a unified framework of governance policies and standards.

Key principles:

* **Interoperable standards**: Ensures all tools and services work together seamlessly while adhering to best practices.
* **Ethical compliance**: Emphasizes minimizing biases, ensuring fairness, and upholding ethical principles across all AI tools and models.
* **Security and privacy**: Maintains rigorous standards to protect data and ensure compliance with privacy regulations.
* **Continuous improvement**: Encourages feedback and collaboration to refine governance practices.
* **Automated governance**: Plans to extend code quality checks to enforce governance policies, ensuring comprehensive compliance across the platform.

LLM Agentic Tool Mesh includes a dedicated repository containing text files that outline various policies and standards (`federated_governance/`). These documents cover essential areas such as LLM model usage, RAG processes, and more.

# Vision for LLM Agentic Tool Mesh project evolution

The LLM Agentic Tool Mesh platform is evolving into a comprehensive solution, providing several panel views tailored for various stages of the tool and application lifecycle. 

When creating a new web app, you can build upon the existing examples. With all services fully parameterized, there is unparalleled flexibility to design diverse user experience panels. For instance, current examples include a chatbot as a user interface and an admin panel for configuring an LLM tool. Additionally, web apps can be developed to support deployment tasks or facilitate experiments aimed at optimizing service parameters for specific objectives.

Currently, the platform provides:

**User panel**:

* Implemented features: This panel focuses on engaging with tools like Chat, RAG, and Agent services. It provides a user-friendly interface for interacting with these capabilities.
* Future goals: Enrich the existing services, offering an even more seamless and feature-rich experience for end-users.

**Development panel**:

* Implemented features: This panel has been partially tackled with the backpanel web app example, which allows users to runtime modify the basic copywriter agentic tool and the RAG tool.
* Future goals: Add more system services to support development, including real-time LLM tuning and configuration.

**Deployment panel (future)**:

* Purpose: This panel will focus on deploying the LLM Agentic Tool Mesh tools seamlessly across one or more clusters, enabling large-scale and distributed deployments.
* Planned features: Tools for monitoring deployed tools, orchestrating distributed systems, and managing deployment pipelines.

**Experiment Panel (Future)**:

* Purpose: Designed for tracking and managing experiments to optimize LLM tool performance and suitability.
* Planned features: This panel will allow users to try different configurations and compare outcomes, helping teams evaluate the most effective settings for their use cases.

![](/img/usage.png)

# Our mission ahead

As LLM Agentic Tool Mesh evolves, we aim to continue enhancing the platform by enriching existing services, especially in the user panel, and expanding the development panel with more robust system services. The addition of the deployment panel and experiment panel will complete the platform's vision, enabling a fully integrated lifecycle from development to deployment and optimization.

Stay tuned as we advance toward democratizing Gen AI with a comprehensive, flexible, and user-centric platform!