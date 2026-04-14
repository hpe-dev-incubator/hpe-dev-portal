---
title: Redefining Storage Operations with AI and MCP
date: 2026-04-22T19:15:10.329Z
author: Anusha Y
authorimage: /img/im.jpeg
disable: false
---
### The Shift from Scripts to Conversations in Storage Management:

Interacting with storage infrastructure today often means navigating dashboards, writing scripts, or manually stitching together API calls. While powerful, these approaches can slow down operations and create a gap between intent and execution, especially when quick insights or actions are needed.

What if you could ask:

*Which arrays are running low on capacity?*

*Create a volume for this workload.*

*And have those actions carried out reliably?*

In this post, I’ll show how to use the Model Context Protocol (MCP) with **Visual Studio Code** and **GitHub Copilot** to enable natural language interaction with storage systems. By leveraging DSCC’s open API specification, you can expose storage operations as AI-understandable capabilities, turning everyday management tasks into simple, conversational workflows.

## From Queries to Actions: AI-Driven Storage Control

### The Foundation: Why OpenAPI Matters

Before MCP and AI come into the picture, there is a critical enabler, a strong OpenAPI specification.

A well-designed OpenAPI spec provides:

* Clearly defined endpoints 
* Structured request/response schemas 
* Consistent naming and semantics 

This structure is what makes it possible to:

* Programmatically understand capabilities 
* Automatically generate tools 
* Reliably map user intent to actions 

Without a solid API foundation, exposing capabilities to AI would be inconsistent and error-prone.

### The Shift: From APIs to Intent-Driven Operations:

Most storage platforms already provide rich APIs. However, APIs are inherently structured and require users to:

* Understand endpoints and payloads
* Refer to documentation
* Write and execute requests

![](/img/hdd.png "High level workflow")

MCP serves as the translation layer, converting human intent into executable API calls.

**Note:** While this blog demonstrates the setup using **Visual Studio Code** and **GitHub Copilot**, MCP clients are not limited to VS Code. Any compatible AI client can interact with the MCP server. For more information, refer to this [page](https://github.com/ivo-toby/mcp-openapi-server).

### Setting Up MCP with VS Code

To get started, you configure an MCP server locally and connect it to your API layer. Before setting up and using the MCP server, ensure the following prerequisites are met:

* Install Node.js (version 18.0  or later)
* Install and sign in to GitHub Copilot with an active license

#### Step 1: Configuring an MCP server

In Visual Studio Code, start by opening an empty folder. Inside this folder, create a ‘.vscode’ directory to store your workspace configurations. Within the .vscode folder, add a JSON configuration file with the following details: 

```json
{
  "servers": {
    "fleet-openapi": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@ivotoby/openapi-mcp-server",
        "--api-base-url", "https://fleetscale-app.qa.cds.hpe.com",
        "--headers", "Authorization:Bearer BEARER_TOKEN",
        "--openapi-spec", "https://console-us1.data.cloud.hpe.com/doc/api/v1/storage-api.yaml",
        "--name", "fleet-openapi",
        "--tools", "all",
        "--tag", "storage-systems",
        "--tag", "headroom",
        "--tag", "capacity",
        "--tag", "performance",
      ]
    }
  }
}
```

Generate the access token as mentioned in this [blog](https://developer.hpe.com/blog/oauth2-for-hpe-greenlake-data-services-cloud-console/). Replace the BEARER_TOKEN with the generated access token.

* **server-name** → A unique identifier for the MCP server instance. 
* **type** → Specifies how the MCP server communicates (e.g., stdio, http, websocket). 
* **command** → The executable used to start the MCP server (e.g., npx). 
* **args** → Command-line arguments passed to the MCP server at startup.
* **api-base-url** → Base endpoint of the backend service that the MCP server will call.
* **openapi-spec** → Path to the OpenAPI file used to generate tools. 
* **headers** → HTTP headers (like authentication tokens) sent with API requests.
* **tools** → Controls which capabilities (APIs/actions) are exposed to the AI. 
* **"tools": "all"** → Exposes all available tools without filtering.
* **tag** → Filters tools based on OpenAPI tags (logical grouping).

##### Restricting Operations for Safer Execution:

Since MCP enables AI-driven interaction with your storage systems, it’s important to control what actions are allowed, especially in production environments.

Using the --operation flag, you can restrict the MCP server to specific HTTP methods.

```json
{
  "servers": {
    "fleet-openapi": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@ivotoby/openapi-mcp-server",
        "--api-base-url", "https://fleetscale-app.qa.cds.hpe.com",
        "--headers", "Authorization:Bearer BEARER_TOKEN",
        "--openapi-spec", "https://console-us1.data.cloud.hpe.com/doc/api/v1/storage-api.yaml",
        "--name", "fleet-openapi",
        "--tools", "all",
		"--operation", "get",
        "--tag", "storage-systems",
        "--tag", "headroom",
        "--tag", "capacity",
        "--tag", "performance",
      ]
    }
  }
}
```

This limits MCP to read-only APIs, preventing any create, update, or delete actions.

This is useful for:

* Safe initial adoption 
* Monitoring and reporting use cases 
* Security-sensitive environments 

You can gradually enable additional operations as needed, with proper guardrails in place.

This configuration starts the MCP server locally, loads the OpenAPI specification, and exposes the APIs as MCP tools. It also passes the required authentication headers for API calls. To apply the changes, reload the Visual Studio Code window using **Ctrl + Shift + P → “Developer: Reload Window.”**

**Note:** Ensure your organization approves the use of MCP and AI tools, and that all integrations comply with internal security and cybersecurity policies before use.

#### Step 2: Connect with GitHub Copilot and start the MCP server

In Visual Studio Code, install the GitHub Copilot extension and sign in with your GitHub account to start using it. 

To start the MPC server, open the Command Palette (**Ctrl+Shift+p**) and select ‘***MCP: List Servers***’. You should see the server configured in your JSON file (for example, *fleet-openapi*) listed there.

![](/img/2listservers.png "List Servers")

Select the configured server and click “***Start Server***”. Once the server is up and running, you should see a confirmation in the console similar to the example below. 

![](/img/3serverstart.png "MCP server running")

The GitHub Copilot extension allows you to choose from supported LLMs based on your subscription and configuration, as shown below. 

![](/img/4listllms.png "List the LLM models")

GitHub Copilot can leverage the tools discovered by the MCP extension in Visual Studio Code. You can also view the discovered tools using the Command Palette (**Ctrl + Shift + P**) by searching for MCP-related commands. 

![](/img/5listtools.png "List the tools")

#### Step 3: Interacting using natural language

Once everything is set up, you can begin issuing natural language queries.

Examples:

* List all storage arrays 
* Identify arrays above 80% capacity 
* Create a 100GB volume on a specific array 
* Check overall system health 

These queries are interpreted, mapped to MCP tools, and executed via DSCC APIs.

For example, consider the following prompt where the user asks to list storage system details:

![](/img/6liststoragesystems.png "List storage systems-part1")

![](/img/7liststoragesystems.png "List Storage systems-part2")

**Note:** The behaviour and responses may vary depending on the LLM used, as different models can interpret prompts and execute actions with varying accuracy and reasoning.

##### What Happens Behind the Scenes

* The user enters a natural language query (in this case, requesting storage system details)
* Copilot interprets the intent and identifies the relevant operation (e.g., list storage systems)
* The MCP client discovers available tools from the MCP server and selects the most relevant one based on the intent.
* The MCP server maps the request to the corresponding API (derived from the OpenAPI specification) and executes it via DSCC, passing the required authentication headers configured in the server JSON.
* The API returns a structured response, which is then relayed back through the MCP server.
* Structured response is returned 
* The response is presented to the user, often enriched with additional insights (for example, highlighting potential issues such as performance headroom overutilization).

This removes the need to manually:

* Write API calls 
* Look up documentation 
* Handle request formatting
* Parsing responses

Please ensure that the user does not have admin or superuser privileges, as the project is still in its early stages and requires further enhancements in RBAC and guardrails.

#### Conclusion: From APIs to Conversation

What makes this transformation possible is not just MCP or AI, it’s the combination of a strong OpenAPI foundation and a protocol that can leverage it effectively. By layering MCP on top of a well-defined API ecosystem like DSCC, you can unlock a new interaction model where users express intent and systems handle execution.

With tools like Visual Studio Code and GitHub Copilot, users can now manage storage systems using natural language, reducing complexity and speeding up operations.

#### Key Takeaway

Great APIs don’t just enable integrations—they enable entirely new ways of interaction.

And MCP doesn’t replace APIs—it enhances how we interact with them.

By combining:

* OpenAPI specifications
* MCP server
* AI assistants

We move from script-driven operations to intent-driven interactions.

#### Call to Action:

* Try setting up an MCP server using your existing API specifications and explore how natural language can simplify your workflows.
* If you’re already using DSCC, start by exposing a few key operations and experiment with prompts in Visual Studio Code using GitHub Copilot.
* If you have questions or want to explore deeper integrations, feel free to reach out or continue experimenting. This is just the beginning of conversational infrastructure.
* Please check out the [HPE DEV blog](https://developer.hpe.com/blog) for more articles on this topic.