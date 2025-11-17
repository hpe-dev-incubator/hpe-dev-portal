---
title: Bringing AI assistants to HPE GreenLake with MCP Servers
date: 2025-11-19T18:40:27.066Z
author: Vandewilly Silva
authorimage: /img/Avatar1.svg
disable: false
---
![]()

# Overview

Modern cloud platforms generate vast amounts of operational data. HPE GreenLake customers often find themselves toggling between multiple interfaces, running complex API queries, and piecing together information from various services to understand their infrastructure state. What if your AI assistant could directly interact with your HPE GreenLake environment in a secure, controlled manner?

The Model Context Protocol (MCP) makes this possible by providing a standardized way for AI assistants to access external data sources and tools. This article explores how MCP servers bring intelligent, conversational access to HPE GreenLake APIs while maintaining strict security boundaries.

## The Challenge: Bridging AI and Enterprise APIs

AI assistants have transformed how we work with information, but they face a fundamental limitation when it comes to enterprise platforms: they don't have direct access to your live operational data. When you ask questions about your HPE GreenLake environment, the AI can only provide general guidance, not specific insights based on your actual workspaces, devices, or audit logs.

Traditional approaches to this problem involve building custom integration layers, managing authentication flows, and maintaining bespoke code for each API endpoint. This creates several challenges:

* **Development overhead**: Each integration requires custom code and ongoing maintenance
* **Security concerns**: Storing credentials and managing access control adds complexity
* **Limited reusability**: Custom integrations rarely work across different tools or AI platforms
* **Slow iteration**: Adding new capabilities means writing more integration code

## Introducing the Model Context Protocol

The Model Context Protocol is an open standard that enables AI applications to securely connect to external data sources and tools. Think of it as a universal adapter that allows AI assistants to "plug in" to your enterprise systems in a controlled, standardized way.

MCP operates on a client-server architecture:

![mcp architecture](/img/mcp-architecture.png "mcp architecture")

The protocol defines three core primitives:

1. **Resources**: Data sources that can be read (configuration files, API responses, documents)
2. **Tools**: Functions that can be invoked (API calls, calculations, data transformations)
3. **Prompts**: Reusable templates for common operations

For HPE GreenLake integration, MCP servers primarily expose **tools** that map to API endpoints, allowing AI assistants to query workspaces, retrieve device information, search audit logs, and more.

## Why MCP Servers for HPE GreenLake?

MCP servers designed for HPE GreenLake offer several compelling advantages:

### Local, Read-Only Access

The MCP server runs entirely on your local machine, not in the cloud. Your HPE GreenLake credentials never leave your environment. The server acts as a secure intermediary between the AI assistant and HPE GreenLake APIs, enforcing read-only access patterns.

This architecture ensures:

* **Data sovereignty**: API responses are processed locally before being shared with the AI
* **Credential isolation**: Your OAuth2 client secrets remain on your machine
* **Network control**: The server respects your local network policies and firewall rules

### Personal API Client Pattern

MCP servers use your personal API credentials, similar to how you would interact with HPE GreenLake through the CLI or web console. This means:

* **Workspace scoping**: You only access resources within your authorized workspaces
* **Role-based access**: Your existing RBAC permissions apply to all API operations
* **Individual accountability**: All actions are attributed to your user account
* **No shared secrets**: Each user maintains their own credentials

### Standardized Tool Interface

Once configured, the MCP server exposes HPE GreenLake APIs as standardized tools that any MCP-compatible AI assistant can use. This provides:

* **Consistent experience**: The same tools work in Claude Desktop, VS Code, and other MCP clients
* **Discoverable capabilities**: AI assistants automatically learn available operations
* **Type-safe parameters**: Input validation happens before API calls
* **Structured responses**: API data is returned in predictable formats

### Two Operating Modes

MCP servers for HPE GreenLake support two operational modes to optimize for different API sizes:

**Static Mode**

* Each API endpoint becomes an individual tool
* Explicit, type-safe tool definitions
* Fast invocation with compile-time validation

**Dynamic Mode** (Automatically enabled for APIs with 50+ endpoints):

* > Three meta-tools handle all endpoints: **list_endpoints**, **get_endpoint_schema**, and **invoke_dynamic_tool**
* Runtime endpoint discovery and schema validation
* Memory efficient for large APIs
* Ideal for comprehensive services with extensive API surfaces

## Security Architecture

Security is paramount when connecting AI assistants to production infrastructure. MCP servers for HPE GreenLake implement defense-in-depth principles:

### Authentication and Authorization

![authn authz sequence diagram](/img/authn-seq-diagram.png "Authentication - sequence diagram")

The MCP server handles OAuth2 authentication using the client credentials flow, automatically managing token lifecycle and refresh operations. Your credentials are read from local environment variables or configuration files, never transmitted to the AI service.

### Read-Only Operations

MCP servers for HPE GreenLake deliberately expose only GET operations from the OpenAPI specifications. This design choice ensures:

* **No unintended modifications**: Write operations (POST, PUT, DELETE, PATCH) are excluded
* **Safe exploration**: Users can query extensively without risk of changes
* **Reduced blast radius**: Even if misconfigured, the server cannot modify infrastructure

### Network Isolation

The MCP server communicates with AI assistants via standard input/output (stdio) rather than network protocols. This means:

* **No listening ports**: The server doesn't expose network services
* **Process-level isolation**: Communication happens through OS process pipes
* **No remote access**: The server cannot be accessed from other machines
* **Firewall friendly**: Only outbound HTTPS to HPE GreenLake APIs

### Credential Management

Following security best practices, MCP servers support multiple credential sources in priority order:

1. Environment variables (recommended for development)
2. Local configuration files with restricted permissions
3. Secure credential stores (platform keychain integration)

Credentials are never logged, and API responses are sanitized to remove sensitive tokens before being shared with the AI assistant.

## Real-World Use Case

MCP servers unlock powerful workflows by combining AI reasoning with live HPE GreenLake data:

### Audit Log Analysis

Investigating security events becomes conversational: "Show me all failed login attempts from the last 24 hours and identify patterns."

The MCP server enables:

1. Querying audit logs with time-based filters
2. Natural language parsing of filter syntax
3. Pattern recognition across multiple log entries
4. Correlation with workspace and user data
5. Summary reports with actionable recommendations

### Intelligent Device Inventory Management
Managing thousands of devices across distributed infrastructure becomes conversational: 
"Show me all unassigned compute devices in the production environment".
"Which devices haven't been updated in 30 days and are approaching warranty expiration?"
"Generate an inventory report showing all PCI-compliant devices with their support levels."

The MCP server enables:
1. Querying devices with complex filter expressions
2. Natural language parsing of device attributes
3. Pattern recognition across device types and states
4. Automated capacity planning and forecasting

### Subscriptions
MCP servers unlock powerful workflows by combining AI reasoning with live HPE GreenLake data:

"Show me all subscriptions expiring in the next 90 days and their renewal status."
"Which subscriptions have less than 20% utilization and could be right-sized?"

The MCP server enables:
1. Querying subscriptions with time-based filters
2. Expiration monitoring and alerts
3. License compliance verification
4. Cost forecasting and budgeting

### User Management
Security teams identify access risks conversationally:

"Show me all active users who haven't logged in for 180 days and should be reviewed for deactivation."
"How many new users were onboarded last month and what's their login activity?"

The MCP server enables:
1. Querying users with last-login filters
2. Dormant account detection
3. User growth trend analysis
4. Onboarding metrics tracking
5. Month-over-month comparisons

## Getting Started

Setting up an MCP server for HPE GreenLake requires three steps: obtaining API credentials, configuring the server, and connecting your AI assistant.

### Prerequisites

* HPE GreenLake workspace with API access
* Python 3.10 or higher
* An MCP-compatible AI client (Claude Desktop, VS Code with Claude Code extension)

### Step 1: Obtain API Credentials

From the HPE GreenLake console:

1. Navigate to **Settings** > **API Clients**
2. Create a new API client with appropriate scopes
3. Note the **Client ID**, **Client Secret**, and **Workspace ID**
4. Configure the OAuth2 token issuer URL for your region

### Step 2: Generate and Configure the MCP Server

For this example, we'll set up an audit logs MCP server. The MCP generator tool (used internally by HPE to accelerate development) creates production-ready servers from OpenAPI specifications, though the generated servers can be deployed and configured independently.

```bash
# Clone or download the pre-generated MCP server
git clone https://github.com/hpe/greenlake-mcp-servers
cd greenlake-mcp-servers/audit-logs

# Install dependencies using uv (fast Python package manager)
uv sync

# Configure environment variables
cat > .env.local << EOF
GREENLAKE_API_BASE_URL=https://global.api.greenlake.hpe.com
GREENLAKE_CLIENT_ID=your-client-id
GREENLAKE_CLIENT_SECRET=your-client-secret
GREENLAKE_WORKSPACE_ID=your-workspace-id
GREENLAKE_TOKEN_ISSUER=https://global.api.greenlake.hpe.com/authorization/v2/oauth2/your-workspace-id/token
MCP_TOOL_MODE=static
GREENLAKE_LOG_LEVEL=INFO
EOF

# Test the server
make test
```

### Step 3: Connect Your AI Assistant

For Claude Desktop, add the server to your configuration file (*~/Library/Application Support/Claude/claude_desktop_config.json* on macOS):

```json
{
  "mcpServers": {
    "greenlake-audit-logs": {
      "command": "uv",
      "args": ["run", "python", "__main__.py"],
      "cwd": "/path/to/greenlake-mcp-servers/audit-logs",
      "env": {
        "GREENLAKE_API_BASE_URL": "https://global.api.greenlake.hpe.com",
        "GREENLAKE_CLIENT_ID": "your-client-id",
        "GREENLAKE_CLIENT_SECRET": "your-client-secret",
        "GREENLAKE_WORKSPACE_ID": "your-workspace-id",
        "GREENLAKE_TOKEN_ISSUER": "https://global.api.greenlake.hpe.com/authorization/v2/oauth2/your-workspace-id/token",
        "MCP_TOOL_MODE": "static"
      }
    }
  }
}
```

For VS Code with the Claude Code extension, create or update .vscode/mcp.json in your workspace:

```json
{
  "servers": {
    "greenlake-audit-logs": {
      "type": "stdio",
      "command": "uv",
      "args": ["run", "python", "__main__.py"],
      "cwd": "/path/to/greenlake-mcp-servers/audit-logs",
      "env": {
        "GREENLAKE_API_BASE_URL": "https://global.api.greenlake.hpe.com",
        "GREENLAKE_CLIENT_ID": "your-client-id",
        "GREENLAKE_CLIENT_SECRET": "your-client-secret",
        "GREENLAKE_WORKSPACE_ID": "your-workspace-id"
      }
    }
  }
}
```

Restart your AI client, and the MCP server will automatically connect.

### Example Interaction

Once configured, you can interact naturally:

**You**: "Show me the 10 most recent audit log entries"

**Claude** (using the **getAuditLogs** tool with **limit=10**):

```shell
Here are the 10 most recent audit log entries:

1. [2025-01-15 14:32:15] User Management - User admin@example.com logged in
2. [2025-01-15 14:28:43] Device Management - Device server-01 status changed to active
3. [2025-01-15 14:15:22] Workspace - Workspace Production updated
...
```

The AI automatically invokes the appropriate MCP tool, formats parameters, makes the API call through the server, and presents results in a readable format.

## Architecture Deep Dive

Understanding the internal architecture helps appreciate how MCP servers maintain security while providing powerful capabilities.

### Component Overview

![component overview](/img/component-overview.png "Component Overview")

### Request Flow

1. **AI Request**: The AI assistant formulates a tool invocation (e.g., "get audit logs with category 'User Management'")
2. **MCP Protocol**: The request is serialized as JSON-RPC and sent via stdio to the MCP server
3. **Tool Resolution**: The server's tool registry identifies the corresponding tool implementation
4. **Parameter Validation**: Input parameters are validated against the tool's schema
5. **Authentication Check**: The auth manager verifies token validity and freshness
6. **API Call**: The HTTP client constructs and sends the HTTPS request to HPE GreenLake
7. **Response Processing**: The raw API response is parsed and formatted
8. **MCP Response**: Structured data is returned to the AI via JSON-RPC
9. **AI Presentation**: The assistant formats and presents results to the user

### Tool Implementation

Each MCP tool implements a consistent interface:

```python
class GetAuditLogsTool(BaseTool):
    """Tool for querying HPE GreenLake audit logs."""

    name = "getAuditLogs"
    description = "Retrieve audit logs with optional filtering"

    input_schema = {
        "type": "object",
        "properties": {
            "filter": {"type": "string", "description": "OData filter expression"},
            "limit": {"type": "integer", "default": 100},
            "offset": {"type": "integer", "default": 0}
        }
    }

    async def execute(self, filter: str = None, limit: int = 100, offset: int = 0):
        """Execute the audit log query."""
        # Parameter validation
        params = {"limit": limit, "offset": offset}
        if filter:
            params["filter"] = filter

        # Make authenticated API call
        response = await self.http_client.get("/audit-log/v1/logs", params=params)

        # Return structured data
        return response
```

This abstraction allows the MCP server to expose dozens of API endpoints with minimal code duplication.

### Dynamic Mode Optimization

For large APIs, dynamic mode provides significant performance benefits. Instead of individual tool files for each endpoint, three meta-tools handle all operations:

**1. list_endpoints** - Fast discovery

```python
# Returns: ["GET /audit-logs/v1/logs", "GET /devices/v1/servers", ...]
# Allows AI to browse available operations
```

**2. get_endpoint_schema** - On-demand schema loading

```python
# Input: "GET /audit-logs/v1/logs"
# Returns: Full parameter schema, response types, descriptions
# AI learns how to use an endpoint only when needed
```

**3. invoke_dynamic_tool** - Validated execution

```python
# Input: endpoint, parameters
# Validates parameters against schema
# Makes API call
# Returns structured response
```

This architecture scales efficiently to APIs with hundreds of endpoints without overwhelming the AI's context window.

## Conclusion

MCP servers bridge the gap between AI assistants and enterprise APIs, enabling natural language interaction with HPE GreenLake without sacrificing security or control. By running locally and using personal API credentials, they provide a secure, auditable way to extend AI capabilities into your infrastructure management workflows.

The read-only nature of these servers makes them ideal for exploration, reporting, and analysis tasks. Combined with the power of large language models, they transform how teams interact with cloud platforms, shifting from manual API navigation to conversational queries and automated insights.

Whether you're investigating audit logs, documenting infrastructure, or generating compliance reports, MCP servers make HPE GreenLake data accessible where you need it: in your AI-powered development environment.