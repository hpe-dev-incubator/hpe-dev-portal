---
title: "LLM Agentic Tool Mesh: Exploring chat service and factory design pattern"
date: 2024-11-21T12:21:15.969Z
author: Antonio Fin
authorimage: /img/afin_photo.jpg
disable: false
tags:
  - HPE
  - Athonet
  - Gen-AI
  - LLM-Agentic-Tool-Mesh
  - Chatbot
---
<style>
li {
    font-size: 27px !important;
    line-height: 33px !important;
    max-width: none !important;
}
</style>

In our previous blog post, we introduced **[LLM Agentic Tool Mesh](https://developer.hpe.com/blog/ll-mesh-democratizing-gen-ai-through-open-source-innovation-1/)**, an **[open-source project](https://github.com/HewlettPackard/llmesh)** aimed at democratizing Generative AI (Gen AI). The initiative addresses both the technical complexity and organizational challenges of adopting Gen AI. The vision behind LLM Agentic Tool Mesh is to make Gen AI accessible and beneficial to a broader audience, empowering users from diverse backgrounds to leverage cutting-edge AI technologies effortlessly.

This blog dives deeper into one of LLM Agentic Tool Mesh's core features: the **Chat Service**. The LLM Agentic Tool Mesh platform provides a robust foundation for creating chat applications using Large Language Models (LLMs).
First, we'll detail its key services. Then, we’ll explore some code that illustrates how the **Factory Design Pattern** empowers it to handle diverse LLM integrations seamlessly. Finally, we’ll highlight some examples in the LLM Agentic Tool Mesh repository that utilize the Chat Service, such as the **chatbot** application and **agentic tools**, showcasing the flexibility and practical applications of these services.

## Key components of LLM Agentic Tool Mesh's Chat Service

Let’s explore the key components and how they enable seamless integration of Gen AI into chat applications.

1. **Prompt rendering**: This service simplifies the creation and management of prompts, which are the backbone of effective LLM interactions. It supports rendering prompts from templates or files and even saving custom prompts to the file system. 
2. **Model management**: It manages the initialization and utilization of different LLMs based on configuration parameters. 
3. **Memory management**: Maintaining context in a chat is essential for meaningful interactions. This service manages storage and retrieval of conversation history. 
4. **Message processing**: This service handles the serialization and deserialization of messages, converting between different data formats to maintain compatibility across components

![](/img/chat-chat.png)

## The power of the Factory Design Pattern

All the previous services are implemented using the **Factory Design Pattern**. This is a creational design approach that provides a flexible interface for object creation. In LLM Agentic Tool Mesh, this pattern ensures that the platform can handle multiple service types dynamically based on configuration parameters.

One of LLM Agentic Tool Mesh's Chat Service features is the **`ChatModel`** factory, which simplifies the creation of specific chat models. Here's an example of how it works:

```python
class ChatModel:
    _models = {
        'LangChainChatOpenAI': LangChainChatOpenAIModel,
        'LangChainAzureChatOpenAI': LangChainAzureChatOpenAIModel,
        'LangChainChatGoogleGenAI': LangChainChatGoogleGenAIModel,
        # Additional models...
    }

    @staticmethod
    def create(config):
        model_type = config.get('type')
        if not model_type:
            raise ValueError("Configuration must include 'type'.")
        model_class = ChatModel._models.get(model_type)
        if not model_class:
            raise ValueError(f"Unsupported model type: {model_type}")
        return model_class(config)
```

Definitions:

1. **Model registry**: The `_models` dictionary maps model types (e.g., `'LangChainChatOpenAI'`) to their corresponding classes.
2. **Dynamic model selection**: The `create` method retrieves the desired model class based on the `type` in the provided `config`. If `type` is missing or unsupported, it raises an error.
3. **Instance creation**: The method initializes and returns the appropriate model class with the given configuration.

The main benefits of this approach are:

* **Encapsulation**: Hides the complexity of model initialization.
* **Flexibility**: Switching models only requires updating the `type` in `config`.
* **Extensibility**: New models can be added by updating the `_models` dictionary without modifying the logic.
* **Error handling**: By validating the configuration and supported model types, the design prevents runtime errors, ensuring the system is robust and user-friendly.

Here’s how a developer might use LLM Agentic Tool Mesh's **`ChatModel`** factory:

```python
from athon.chat import ChatModel
from langchain.schema import HumanMessage, SystemMessage

# Configuration for the Chat Model
LLM_CONFIG = {
    'type': 'LangChainAzureChatOpenAI',
    'api_key': 'your-api-key-here',
    'azure_deployment': 'your-deployment-name',
    'endpoint': 'your-endpoint-url',
    'api_version': 'your-api-version',
    'model_name': ‘gpt-4o’,
    'temperature': 0.7
}

# Initialize the Chat Model
chat = ChatModel.create(LLM_CONFIG)

# Define prompts
prompts = [
    SystemMessage(content="Convert the message to pirate language"),
    HumanMessage(content="Today is a sunny day and the sky is blue")
]

# Invoke the model
result = chat.invoke(prompts)

# Process the response
if result.status == "success":
    print(f"COMPLETION:\n{result.content}")
else:
    print(f"ERROR:\n{result.error_message}")
```

Explanation:

1. The `ChatModel.create()` method dynamically selects and initializes the appropriate chat model based on the configuration.
2. Prompts are processed through the `invoke()` method, which interacts with the LLM to generate responses.
3. Developers handle responses easily, focusing on application logic rather than the complexities of model interaction.

The modular design of LLM Agentic Tool Mesh ensures scalability and maintainability. Here’s a glimpse into its structure:

```plaintext
self_serve_platform/
│
└── chat/
    ├── model.py  # Factory method for creating chat model instances
    └── models/
        ├── base.py  # Abstract base class for chat models
        ├── langchain_chat_openai.py  # OpenAI chat model implementation
        ├── langchain_azure_chat_openai.py  # Azure chat model implementation
        └── ... # Additional implementations
```

## Examples of LLM Agentic Tool Mesh in action

In the [LLM Agentic Tool Mesh GitHub](https://github.com/HewlettPackard/llmesh), there are a series of web applications and tools, complete with examples, to showcase the versatility and capabilities of LLM Agentic Tool Mesh. These examples are designed to demonstrate how the platform's services can be leveraged for real-world applications. Notably, the repository includes:

* **Chatbot application** (`examples/app_chatbot`): A web-based chatbot built using the chat service, offering a hands-on example of how to integrate LLM-powered conversational agents.
* **Agentic tools**:  

  * **Basic copywriter** (`examples/tool_copywriter`): A tool designed to rewrite and improve text, providing explanations for suggested enhancements. For instance, it can refine content while offering insights into the reasoning behind the changes.
  * **Temperature analyzer** (`examples/tool_analyzer`): A tool that generates Python code using an LLM to analyze historical temperature data. It creates visual charts, enabling users to gain a deeper understanding of temperature trends.

You can run these tools and applications individually or use the `run_examples.sh` script to launch them all at once. Once initialized:

1. Access the **chatbot application** via `https://127.0.0.1:5001/` to start chatting or explore its additional features like the **personal chat**. Within Personal Chat, users can enhance text using the copywriter tool by interacting directly in chat or clicking interface buttons.
2. The **basic copywriter** also features a configurable backpanel app accessible at `https://127.0.0.1:5011/`. Without needing to code, users can modify settings such as system prompts, LLM type, or even interface behavior—for example, transforming a formal copywriter into one with a pirate's flair, where  one might start by saying "Welcome to our sale" and it would be transformed into "Ahoy, matey, grab the loot!".
3. The **temperature analyzer** enriches its prompts by incorporating historical temperature datasets. It then uses the chat service to generate code as instructed in the system prompt, executes the analysis, and visualizes the results in a chart.

![](/img/tool-chat.png)

These examples demonstrate the flexibility and potential of LLM Agentic Tool Mesh services, highlighting the power of LLM models and advanced prompt engineering in solving diverse problems. 

### Conclusion

The **LLM Agentic Tool Mesh Chat Service** and accompanying tools exemplify how advanced design principles like the Factory Design Pattern, combined with innovative prompt engineering, simplify and enhance the adoption of Gen AI. By abstracting complexities and providing versatile examples, LLM Agentic Tool Mesh enables developers and users alike to unlock the transformative potential of Gen AI in a variety of domains.

Stay tuned for our next post, where we’ll delve into another key service of LLM Agentic Tool Mesh and explore how it continues to democratize Gen AI!