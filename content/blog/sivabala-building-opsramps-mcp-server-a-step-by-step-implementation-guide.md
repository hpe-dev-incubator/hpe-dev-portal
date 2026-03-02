---
title: " Building an MCP server to take advantage of OpsRamp monitoring - A
  Step-by-Step Implementation Guide"
date: 2026-02-25T22:44:12.993Z
featuredBlog: true
author: BalaSubramanian Vetrivel
authorimage: /img/balasubramanian-photo.png
disable: false
tags:
  - "opsramp "
  - AI, MCP, OpsRamp MCP server
---


---

## Introduction

In my [previous article](https://developer.hpe.com/blog/sivabala-model-context-protocol-mcp-the-universal-connector-for-ai-applications/), I explored the Model Context Protocol (MCP) as the universal connector for AI applications. Now, let's roll up our sleeves and dive into the actual implementation of OpsRamp's MCP server, transforming monitoring data into AI-accessible intelligence.

This isn't just another code walkthrough – it's a practical guide that takes you from project setup to a fully functional MCP server that exposes OpsRamp's monitoring capabilities to AI applications like Claude Desktop.

## The OpsRamp challenge: Bridging monitoring and AI

OpsRamp's monitoring platform generates thousands of alerts daily, tracks hundreds of devices, and processes massive volumes of operational telemetry. Yet despite this wealth of data, operations teams working with it have found themselves manually correlating information, parsing through dashboards, and spending valuable time translating monitoring data into actionable insights.

The challenge wasn't lack of data – it was the cognitive overhead of making sense of that data quickly and accurately. What if operations teams could simply ask questions like:

- "Show me all critical alerts from the last hour"
- "What's the current status of our AWS EC2 instances?"
- "Which devices need attention today?"

To make this vision reality, we needed to build an MCP server that bridges OpsRamp's monitoring platform with AI applications.

## Setting up the project with UV

Before diving into code walkthrough, let's set up a modern Python project using UV – a fast, reliable Python package installer and resolver that's become the go-to choice for modern Python development.

### Why UV?

UV offers several advantages over traditional Python package management:
- **Lightning fast**: Up to 10-100x faster than pip
- **Reliable**: Deterministic dependency resolution
- **Modern**: Built-in virtual environment management
- **Simple**: Straightforward commands and workflows

### Installing UV

To install UV on our system, start with this:
```bash
# On macOS and Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# On Windows
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### Creating the project structure

Now let's create our OpsRamp MCP server project:
```bash
# Create a new project directory
mkdir opsramp-mcp-server
cd opsramp-mcp-server

# Initialize a new UV project
uv init

# Create the virtual environment
uv venv

# Activate the virtual environment
# On macOS/Linux:
source .venv/bin/activate
# On Windows:
.venv\Scripts\activate
```

### Installing dependencies

Create a `pyproject.toml` file with our project dependencies:
```toml
[project]
name = "opsramp-mcp-server"
version = "0.1.0"
description = "MCP server for OpsRamp monitoring platform"
readme = "README.md"
requires-python = ">=3.10"
dependencies = [
    "mcp>=0.9.0",
    "aiohttp>=3.9.0",
    "pydantic>=2.0.0",
]

[project.scripts]
opsramp-mcp-server = "opsramp_mcp_server:run_main"

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
```

Install the dependencies:
```bash
uv pip install -e .
```

### Project structure

Your project structure should look like this:
```
opsramp-mcp-server/
├── .venv/                    # Virtual environment (created by UV)
├── opsramp_mcp_server.py     # Main server implementation
├── pyproject.toml            # Project configuration
├── README.md                 # Documentation
└── .env                      # Environment variables (don't commit!)
```

## Architecture overview: The three-layer approach

The MCP server being set up via the instructions in this guide follows a clean three-layer architecture:

1. **Authentication layer**: Handles OAuth 2.0 token management and API security
2. **API Communication layer**: Manages HTTP requests and responses with OpsRamp
3. **MCP Interface layer**: Exposes tools and resources through the MCP protocol

This separation ensures maintainability, testability, and clear boundaries between concerns.

## Implementation deep dive: Building the server

Now let's walk through the implementation step by step, understanding each component and design decision.

### Step 1: Understanding the MCP Python SDK

Before diving into the imports, it's important to understand the MCP Python SDK.

 Anthropic provides an official Python SDK that simplifies building MCP servers by handling the protocol details, message serialization, and transport layer complexity. The SDK provides:

- **Server framework**: Core classes for building MCP servers
- **Type definitions**: Strongly-typed interfaces for tools, resources, and prompts
- **Transport layers**: Built-in support for stdio (standard input/output) communication
- **Protocol handling**: Automatic serialization and deserialization of MCP messages

This allows developers to focus on business logic rather than protocol implementation details.

### Step 2: imports and logging configuration
```python
#!/usr/bin/env python3
"""
OpsRamp MCP Server
Provides access to OpsRamp OpsQL API with OAuth 2.0 client credentials authentication
"""

import asyncio
import json
import logging
import os
import sys

from typing import Any, Dict, Optional
from datetime import datetime, timedelta

import aiohttp
import mcp.server.stdio
import mcp.types as types
from mcp.server import Server
```

**Understanding the MCP imports:**

**`import mcp.server.stdio`**  
This module provides the standard input/output transport layer for MCP servers. It enables communication between your server and AI applications through stdin/stdout streams, which is the standard way MCP servers communicate with host applications like Claude Desktop. This transport mechanism allows your server to run as a subprocess that AI applications can interact with.

**`import mcp.types as types`**  
This module contains all the type definitions for MCP protocol objects including `Tool`, `Resource`, `Prompt`, and `TextContent`. These types ensure type safety and provide clear interfaces for defining what your server exposes to AI applications. For example, `types.Tool` is used to define each tool with its name, description, and input schema, while `types.TextContent` represents the text responses your tools return.

**`from mcp.server import Server`**  
The `Server` class is the core of your MCP server implementation. It provides decorators like `@server.list_tools()` and `@server.call_tool()` that you use to register and implement your server's capabilities. The Server instance handles all the protocol-level details like capability negotiation, message routing, and error handling, allowing you to focus on implementing your specific tools and resources.

**Key decisions here:**

- **Async from the ground up**: We use `asyncio` and `aiohttp` for non-blocking I/O, essential for handling multiple concurrent AI requests efficiently
- **Comprehensive logging**: Detailed logging helps troubleshoot issues in production environments
- **Type hints**: Using Python's type system makes code more maintainable and catches errors early

The logging configuration writes to both a file and console, crucial for debugging MCP servers since they run as background processes:
```python
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(filename)s:%(lineno)d - %(funcName)s - %(message)s',
    handlers=[
        logging.FileHandler('opsramp_opsql_mcp.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
```

### Step 3: The OpsRampClient class - authentication layer

The `OpsRampClient` class handles all interactions with OpsRamp's API, starting with OAuth 2.0 authentication:
```python
class OpsRampClient:
    """Client for OpsRamp API with OAuth 2.0 authentication"""
    
    def __init__(self, base_url: str, client_id: str, client_secret: str, tenant_id: str):
        self.base_url = base_url.rstrip('/')
        self.client_id = client_id
        self.client_secret = client_secret
        self.tenant_id = tenant_id
        self.access_token: Optional[str] = None
        self.token_expires_at: Optional[datetime] = None
        self.session = aiohttp.ClientSession()
```

**Design considerations:**

- **Token caching**: The system stores the access token and its expiration time to avoid unnecessary authentication requests
- **Session reuse**: A single `aiohttp.ClientSession` is maintained for connection pooling and better performance
- **Tenant isolation**: The tenant ID ensures proper data isolation in multi-tenant environments

### Step 4: OAuth 2.0 token management

The `_get_access_token` method implements intelligent token management:
```python
async def _get_access_token(self) -> str:
    """Get or refresh the OAuth 2.0 access token"""
    # Check if we have a valid token
    if (self.access_token and self.token_expires_at and 
        datetime.now() < self.token_expires_at - timedelta(minutes=5)):
        logger.debug("Using existing access token")
        return self.access_token
    
    # Request new token
    token_url = f"{self.base_url}/auth/oauth/token"
    
    data = {
        'grant_type': 'client_credentials',
        'client_id': self.client_id,
        'client_secret': self.client_secret
    }
    
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
    }
    
    async with self.session.post(token_url, data=data, headers=headers) as response:
        if response.status == 200:
            token_data = await response.json()
            self.access_token = token_data['access_token']
            expires_in = token_data.get('expires_in', 3600)
            self.token_expires_at = datetime.now() + timedelta(seconds=expires_in)
            logger.info("Successfully obtained access token")
            return self.access_token
        else:
            error_text = await response.text()
            raise Exception(f"Failed to get access token: {response.status} - {error_text}")
```

**Smart token management:**

- **5-minute buffer**: We refresh tokens 5 minutes before expiration to prevent race conditions
- **Automatic refresh**: Expired tokens are automatically refreshed transparently
- **Error handling**: Failed authentication attempts are logged with detailed error messages

### Step 5: Authenticated API requests

The `_make_request` method wraps all API calls with authentication:
```python
async def _make_request(self, method: str, endpoint: str, **kwargs) -> Dict[str, Any]:
    """Make an authenticated request to the OpsRamp API"""
    access_token = await self._get_access_token()
    
    headers = kwargs.get('headers', {})
    headers.update({
        'Authorization': f'Bearer {access_token}',
        'Accept': 'application/json'
    })
    kwargs['headers'] = headers
    
    url = f"{self.base_url}{endpoint}"
    
    logger.debug(f"Making {method} request to: {url}")
    
    async with self.session.request(method, url, **kwargs) as response:
        response_text = await response.text()
        
        if response.status >= 200 and response.status < 300:
            try:
                return await response.json()
            except json.JSONDecodeError:
                return {"response": response_text}
        else:
            raise Exception(f"API request failed: {response.status} - {response_text}")
```

**Robust request handling:**

- **Automatic authentication**: Every request includes a valid Bearer token
- **Flexible parameters**: The `**kwargs` pattern allows passing any HTTP parameters
- **JSON parsing with fallback**: Attempts to parse JSON, falls back to raw text if needed
- **Comprehensive error reporting**: Failed requests include status codes and response bodies

### Step 6: OpsQL query execution

The `execute_opsql_query` method provides access to OpsRamp's query language:
```python
async def execute_opsql_query(self, query: str) -> Dict[str, Any]:
    """Execute an OpsQL query"""
    logger.info(f"Preparing to execute OpsQL query: {query[:100]}")
    
    endpoint = f"/v3/api/opsql/{self.tenant_id}/queries"
    
    headers = {
        'Content-Type': 'application/json'
    }
    
    result = await self._make_request('POST', endpoint, json=json.loads(query), headers=headers)
    logger.info("OpsQL query executed successfully")
    return result
```

**OpsQL integration:**

- **Tenant-scoped queries**: Queries are automatically scoped to the authenticated tenant
- **JSON payload**: Queries are sent as structured JSON for parsing and validation
- **Result streaming**: Large result sets are handled efficiently through async I/O

### Step 7: MCP server initialization

Now create the MCP server instance:
```python
server = Server("opsramp-mcp-server")
```

This single line creates an MCP server with the name "opsramp-mcp-server" that will be visible to AI applications.

### Step 8: Tool registration

The `@server.list_tools()` decorator registers available tools with the MCP protocol:
```python
@server.list_tools()
async def handle_list_tools() -> list[types.Tool]:
    """List available tools"""
    logger.info("Listing available tools")
    
    tools = [
        types.Tool(
            name="execute_opsql_query",
            description="Execute an OpsQL query against the OpsRamp platform",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The OpsQL query to execute"
                    }
                }
            }
        ),
        types.Tool(
            name="get_alerts",
            description="Get alerts from OpsRamp",
            inputSchema={
                "type": "object",
                "properties": {
                    "query_filter": {
                        "type": "string",
                        "description": "Query filter for alerts"
                    },
                    "limit": {
                        "type": "integer",
                        "description": "Maximum number of alerts to return",
                        "default": 100
                    }
                }
            }
        ),
        types.Tool(
            name="get_minimal_resource_details",
            description="Get Minimal Resource Details from OpsRamp",
            inputSchema={
                "type": "object",
                "properties": {
                    "query_filter": {
                        "type": "string",
                        "description": "Query filter for alerts"
                    }
                }
            }
        ),
        types.Tool(
            name="get_release_version",
            description="Get release version from OpsRamp",
            inputSchema={
                "type": "object"
            }
        ),
        types.Tool(
            name="get_alert_statistics_dashboard",
            description="Get Alert Statistics dashboard from OpsRamp",
            inputSchema={
                "type": "object"
            }
        )
    ]
    
    return tools
```

**Tool design principles:**

- **Clear descriptions**: Each tool has a human-readable description that AI models can understand
- **JSON Schema validation**: Input schemas ensure AI applications provide properly formatted data
- **Intuitive naming**: Tool names follow verb-noun patterns (get_alerts, execute_query)
- **Progressive disclosure**: Simple tools (get_release_version) require no parameters, while complex ones (execute_opsql_query) have detailed schemas

### Step 9: Tool execution handler

The `@server.call_tool()` decorator implements the actual tool logic. This is where the magic happens – where AI requests transform into actual OpsRamp API calls:
```python
@server.call_tool()
async def handle_call_tool(
    name: str, arguments: dict[str, Any] | None
) -> list[types.TextContent]:
    """Handle tool calls"""
    global opsramp_client
    
    if not opsramp_client:
        return [types.TextContent(
            type="text",
            text="Error: OpsRamp client not initialized. Please check your configuration."
        )]
    
    try:
        if name == "execute_opsql_query":
            query = arguments.get("query", "")
            
            if not query.strip():
                return [types.TextContent(
                    type="text",
                    text="Error: Query cannot be empty"
                )]
            
            result = await opsramp_client.execute_opsql_query(query)
            
            return [types.TextContent(
                type="text",
                text=f"Query executed successfully:\n\n```json\n{json.dumps(result, indent=2)}\n```"
            )]
        
        elif name == "get_alerts":
            endpoint = f"/api/v2/tenants/{opsramp_client.tenant_id}/alerts/search"
            query_filter = arguments.get("query_filter", "")
            limit = arguments.get("limit", 100)
            
            result = await opsramp_client._make_request(
                method="GET",
                endpoint=endpoint,
                params={"query": query_filter, "limit": limit}
            )
            
            return [types.TextContent(
                type="text",
                text=f"Query executed successfully:\n\n```json\n{json.dumps(result, indent=2)}\n```"
            )]
        
        elif name == "get_minimal_resource_details":
            endpoint = f"/api/v2/tenants/{opsramp_client.tenant_id}/resources/minimal"
            query_filter = arguments.get("query_filter", "")
            
            result = await opsramp_client._make_request(
                method="GET",
                endpoint=endpoint,
                params={"query": query_filter}
            )
            
            return [types.TextContent(
                type="text",
                text=f"Query executed successfully:\n\n```json\n{json.dumps(result, indent=2)}\n```"
            )]
        
        elif name == "get_release_version":
            endpoint = f"/tenancy/api/v3/release-version"
            result = await opsramp_client._make_request(method="GET", endpoint=endpoint)
            
            return [types.TextContent(
                type="text",
                text=f"Query executed successfully:\n\n```json\n{json.dumps(result, indent=2)}\n```"
            )]
        
        elif name == "get_alert_statistics_dashboard":
            dashboard_link = "https://pod7.opsramp.com/portal/dashboards/4dfc7792-d03d-11ec-9e13-0242ac120006"
            
            return [types.TextContent(
                type="text",
                text=f"Alert Statistics Dashboard: {dashboard_link}"
            )]
        
        else:
            return [types.TextContent(
                type="text",
                text=f"Unknown tool: {name}"
            )]
    
    except Exception as e:
        logger.error(f"Error in tool call {name}: {e}")
        return [types.TextContent(
            type="text",
            text=f"Error executing {name}: {str(e)}"
        )]
```

**Robust tool execution:**

- **Validation first**: Input parameters are validated before making API calls
- **Consistent error handling**: All errors are caught and returned as user-friendly messages
- **JSON formatting**: Results are formatted in readable JSON with syntax highlighting
- **Comprehensive logging**: Every tool call is logged for debugging and audit trails

### Step 10: Query examples helper

The `get_query_examples` function provides AI applications with sample queries to learn from:
```python
def get_query_examples(category: str) -> str:
    """Get OpsQL query examples by category"""
    examples = {
        "alerts": [
            '''{
  "objectType": "alert",
  "fields": ["id", "clientId", "component", "currentState"],
  "filterCriteria": "currentState=critical"
}'''
        ],
        "devices": [
            '''{
  "fields": ["ipAddress", "installedAppName", "name", "clientName"],
  "objectType": "resource",
  "filterCriteria": "availableAppName = 'AWS' and installedAppName = 'OpsRamp PM'",
  "pageNo": 1,
  "pageSize": 50
}'''
        ],
        "topology": [
            '''{
  "objectType": "topology",
  "filterCriteria": "(intAppId = 'INTG-73e5a7fa-8674-4f33-ae53-26a2b9c049ea')",
  "fields": ["id", "sourceId", "targetId", "relation"]
}'''
        ]
    }
    
    if category == "all":
        result = ""
        for cat, queries in examples.items():
            result += f"\n**{cat.upper()} Examples:**\n"
            for i, query in enumerate(queries, 1):
                result += f"{i}. {query}\n"
        return result
    
    elif category in examples:
        result = f"**{category.upper()} Examples:**\n"
        for i, query in enumerate(examples[category], 1):
            result += f"{i}. {query}\n"
        return result
    
    return "Category not found. Available categories: alerts, devices, topology, all"
```

**Learning by example:**

- **Categorized samples**: Examples are organized by domain (alerts, devices, topology)
- **Real-world queries**: Each example represents actual use cases
- **Progressive complexity**: Examples range from simple to complex
- **AI-friendly format**: Structured to help AI models understand query patterns

### Step 11: Main entry point and server startup

The `main` function orchestrates server initialization and lifecycle:
```python
async def main():
    """Main entry point"""
    global opsramp_client
    
    # Get configuration from environment variables
    base_url = os.getenv("OPSRAMP_BASE_URL", "https://develop.opsramp.com")
    client_id = os.getenv("OPSRAMP_CLIENT_ID")
    client_secret = os.getenv("OPSRAMP_CLIENT_SECRET")
    tenant_id = os.getenv("OPSRAMP_TENANT_ID")
    
    if not all([client_id, client_secret, tenant_id]):
        logger.error("Missing required environment variables:")
        logger.error("- OPSRAMP_CLIENT_ID")
        logger.error("- OPSRAMP_CLIENT_SECRET")
        logger.error("- OPSRAMP_TENANT_ID")
        logger.error("Optional: OPSRAMP_BASE_URL")
        return
    
    # Initialize the OpsRamp client
    opsramp_client = OpsRampClient(base_url, client_id, client_secret, tenant_id)
    
    logger.info(f"Starting OpsRamp MCP Server")
    logger.info(f"Base URL: {base_url}")
    logger.info(f"Tenant ID: {tenant_id}")
    
    # Run the server
    async with mcp.server.stdio.stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            server.create_initialization_options()
        )

def run_main():
    """Entry point wrapper"""
    asyncio.run(main())

if __name__ == "__main__":
    run_main()
```

**Startup sequence:**

1. **Environment validation**: Checks for required configuration before starting
2. **Client initialization**: Creates the OpsRamp client with credentials
3. **STDIO transport**: Uses standard input/output for communication with AI applications
4. **Graceful error handling**: Missing configuration results in helpful error messages

## Configuration: Environment variables

Create a `.env` file for your configuration (and add it to `.gitignore`):
```bash
OPSRAMP_BASE_URL=https://develop.opsramp.com
OPSRAMP_CLIENT_ID=your_client_id_here
OPSRAMP_CLIENT_SECRET=your_client_secret_here
OPSRAMP_TENANT_ID=your_tenant_id_here
```

**Security best practices:**

- **Never commit credentials**: Add `.env` to `.gitignore` immediately
- **Use environment-specific configs**: Different values for dev/staging/prod
- **Rotate secrets regularly**: Change client secrets periodically
- **Minimal permissions**: Use credentials with only necessary API access

## Testing the server locally

Before integrating with Claude Desktop, test your server locally:
```bash
# Set environment variables
export OPSRAMP_BASE_URL=https://develop.opsramp.com
export OPSRAMP_CLIENT_ID=your_client_id
export OPSRAMP_CLIENT_SECRET=your_client_secret
export OPSRAMP_TENANT_ID=your_tenant_id

# Run the server
python opsramp_mcp_server.py
```

Watch the log file for connection and authentication messages:
```bash
tail -f opsramp_opsql_mcp.log
```

You should see log entries like:
```
2025-08-12 10:30:15 - __main__ - INFO - Starting OpsRamp MCP Server
2025-08-12 10:30:15 - __main__ - INFO - Base URL: https://develop.opsramp.com
2025-08-12 10:30:15 - __main__ - INFO - Tenant ID: client_123
2025-08-12 10:30:16 - __main__ - INFO - Successfully obtained access token
```

## Key architectural decisions explained

Let's revisit some crucial design choices that make this implementation robust:

### Asynchronous design

I chose `asyncio` and `aiohttp` for several compelling reasons:

- **Concurrent request handling**: Multiple AI applications can query simultaneously without blocking
- **Efficient I/O**: Network requests don't block the event loop
- **Scalability**: The server can handle many concurrent connections with minimal resource overhead
- **Natural fit for MCP**: The MCP protocol itself is designed for async communication

### Token management strategy

The OAuth 2.0 implementation includes intelligent token caching:

- **5-minute expiration buffer**: Prevents edge cases where tokens expire mid-request
- **Automatic refresh**: Transparent to calling code
- **Thread-safe**: Single token instance shared across all requests

### Error handling philosophy

Every layer includes comprehensive error handling:

- **Validation errors**: Caught early with clear messages
- **Network errors**: Logged with full context
- **Authentication errors**: Specific messages for credential issues
- **API errors**: Include status codes and response bodies

### Logging strategy

Multi-level logging provides visibility without overwhelming:

- **DEBUG level**: Detailed request/response information
- **INFO level**: Important lifecycle events
- **ERROR level**: Failures that need attention
- **File + console**: Useful for both development and production

## What's next?

Congratulations! You've successfully built a production-ready MCP server that exposes OpsRamp's monitoring capabilities to AI applications. The implementation demonstrates key patterns:

- **Clean separation of concerns** with distinct layers for auth, API, and MCP
- **Robust error handling** at every level
- **Comprehensive logging** for troubleshooting
- **Async-first design** for performance
- **Type safety** through Python type hints

In my next article, **Part 3: Testing and Integration**, I'll explore:

- Testing the server with MCP Inspector
- Integrating with Claude Desktop
- Real-world usage scenarios and queries
- Debugging tips and common pitfalls
- Performance optimization strategies
- Production deployment considerations


The journey from monitoring data to AI-accessible intelligence continues. Stay tuned for how you can bring this MCP server to life with real AI interactions!

---

*Part 3 of this series will demonstrate testing the OpsRamp MCP server with MCP Inspector and integrating it with Claude Desktop for real-world AI-powered operations workflows.*