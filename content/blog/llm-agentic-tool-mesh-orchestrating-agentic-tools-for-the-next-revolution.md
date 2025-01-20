---
title: "LLM Agentic Tool Mesh: Orchestrating agentic tools for the next revolution"
date: 2025-01-20T08:36:14.226Z
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

In our previous blog posts, we delved into the [Chat Service](https://developer.hpe.com/blog/ll-mesh-exploring-chat-service-and-factory-design-pattern/), [Agent Service](https://developer.hpe.com/blog/llm-agentic-tool-mesh-harnessing-agent-services-and-multi-agent-ai-for-next-level-gen-ai/), and [RAG Service](https://developer.hpe.com/blog/llm-agentic-tool-mesh-empowering-gen-ai-with-retrieval-augmented-generation-rag/) of [LLM Agentic Tool Mesh open source project](https://github.com/HewlettPackard/llmesh). Today, we'll explore the System Services of LLM Agentic Tool Mesh that are essential for managing and orchestrating the mesh of agentic tools. We'll provide insights into these services, showcase an example of a Mesh available in the repository, discuss federated governance, and share our vision for the future evolution of the LLM Agentic Tool Mesh project.

![](/img/mesh.png)

# Understanding LLM Agentic Tool Mesh System Services

The System Services in LLM Agentic Tool Mesh are crucial for the seamless operation and orchestration of agentic tools and web applications. These services ensure consistency, ease of use, and flexibility across the platform. They include:

1. Tool Client Service
2. Tool Server Service

Let's explore each of these components in detail.

## Tool Client Service

The Tool Client Service enables developers to transform any code function into an LLM Agentic Tool Mesh tool by applying a simple decorator. This service abstracts the complexities of tool integration, allowing for quick conversion of functions into reusable tools within the LLM Agentic Tool Mesh ecosystem.

Key Features:

* Decorator-Based: Convert functions into tools using the `@AthonTool` decorator.
* Seamless Integration: Decorated functions are fully integrated into the LL-Mesh platform.

Example Usage:

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

Key Features:

* Tool Discovery: Automatically discover tools within the platform.
* Execution Management: Manage the execution of tools, ensuring efficient operation.

![](/img/tools.png)

Example Usage:

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