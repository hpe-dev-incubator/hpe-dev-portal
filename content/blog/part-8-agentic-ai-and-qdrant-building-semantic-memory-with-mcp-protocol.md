---
title: "Part 8: Agentic AI and Qdrant: Building Semantic Memory with MCP Protocol"
date: 2025-07-21T10:50:25.839Z
author: Dinesh R Singh
authorimage: /img/dinesh-192-192.jpg
disable: false
tags:
  - MCP
  - Agentic AI
  - Generative AI
---
<style>
li {
   font-size: 27px;
   line-height: 33px;
   max-width: none;
}
</style>

As Agentic AI systems evolve from reactive language models to structured thinkers, a new challenge emerges — how do we give these agents memory? Not just logs or files, but real, searchable memory that understands context. Enter Qdrant and the Model Context Protocol (MCP) — a modular pairing that brings semantic search and knowledge storage to agent workflows.

[Inspired by my Medium post](https://dineshr1493.medium.com/all-you-need-to-know-about-the-evolution-of-generative-ai-to-agentic-ai-part-8-agentic-ai-mcp-281567e26838), this article explores how MCP standardizes interactions between intelligent agents and vector databases like Qdrant. By enabling seamless storage and retrieval of embeddings, agents can now “remember” useful information and leverage it in future reasoning.

Let’s walk through the full architecture and code implementation of this cutting-edge pattern.

## Why this matters: Agentic AI + MCP

In Agentic AI, a language model doesn’t just generate — it thinks, acts, and reflects using external tools. That’s where MCP comes in.

Think of MCP as a “USB interface” for AI — it lets agents plug into tools like Qdrant, APIs, or structured databases using a consistent protocol.

Qdrant itself is a high-performance vector database — capable of powering semantic search, knowledge retrieval, and long-term memory for AI agents. However, direct integration with agents can be messy and non-standardized.

This is solved by wrapping Qdrant inside an MCP server, giving agents a semantic API they can call like a function.

### Architecture Overview

```
[LLM Agent]
    |
    |-- [MCP Client]
[MCP Protocol]
    |
    |-- [Qdrant MCP Server]
    |   |-- Tool: qdrant-store
    |   |-- Tool: qdrant-find
    |
[Qdrant Vector DB]
```

### Use Case: Support Ticket Memory for AI Assistants

Imagine an AI assistant answering support queries.

* It doesn't have all answers built-in.
* But it has semantic memory from prior support logs stored in Qdrant.
* It uses qdrant-find to semantically retrieve similar issues and then formulates a contextual response.

## Step-by-Step Implementation

### Step 1: Launch Qdrant MCP Server

```
export COLLECTION_NAME="support-tickets"
export QDRANT_LOCAL_PATH="./qdrant_local_db"
export EMBEDDING_MODEL="sentence-transformers/all-MiniLM-L6-v2"
```

```
uvx mcp-server-qdrant --transport sse
```

## Key Parameters:

* COLLECTION_NAME: Name of the Qdrant collection
* QDRANT_LOCAL_PATH: Local vector DB storage path
* EMBEDDING_MODEL: Embedding model for vectorization

### Step 2: Connect the MCP Client

```
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
async def main():
server_params = StdioServerParameters(
     command="uvx",
     args=\["mcp-server-qdrant"],
     env={
         "QDRANT_LOCAL_PATH": "./qdrant_local_db",
         "COLLECTION_NAME": "support-tickets",
         "EMBEDDING_MODEL": "sentence-transformers/all-MiniLM-L6-v2"
     }
)
```

```
async with stdio_client(server_params) as (read, write):
     async with ClientSession(read, write) as session:
         await session.initialize()
         tools = await session.list_tools()
         print(tools)
```

```
Expected Output: Lists tools like qdrant-store, qdrant-find
```

### Step 3: Ingest a New Memory

```
ticket_info = "Order #1234 was delayed due to heavy rainfall in transit zone."
result = await session.call_tool("qdrant-store", arguments={
"information": ticket_info,
"metadata": {"order_id": 1234}
})
```

This stores an embedded version of the text in Qdrant.

### Step 4: Perform a Semantic Search

```
query = "Why was order 1234 delayed?"
search_response = await session.call_tool("qdrant-find", arguments={
"query": "order 1234 delay"
})
```

## Example Output:

```
[
  {
"content": "Order #1234 was delayed due to heavy rainfall in transit zone.",
"metadata": {"order_id": 1234}
  }
]
```

### Step 5: Use with LLM

```
import openai
context = "\n".join(\[r["content"] for r in search_response])
prompt = f"""
You are a helpful assistant. Use this context to answer:
"""
{context}
"""
Question: Why was order #1234 delayed?
"""
response = openai.ChatCompletion.create(
model="gpt-3.5-turbo",
messages=[{"role": "user", "content": prompt}]
)
print(response\["choices"]\[0]\["message"]\["content"])
```

```
Final Answer:
"Order #1234 was delayed due to heavy rainfall in the transit zone."
```

## Parameter Reference

<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
  <thead style="background-color:#f2f2f2">
    <tr>
      <th>Tool</th>
      <th>Parameter</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>qdrant-store</code></td>
      <td><code>information</code></td>
      <td>Raw string to embed</td>
    </tr>
    <tr>
      <td></td>
      <td><code>metadata</code></td>
      <td>Optional metadata for filtering</td>
    </tr>
    <tr>
      <td><code>qdrant-find</code></td>
      <td><code>query</code></td>
      <td>Natural language query</td>
    </tr>
    <tr>
      <td><code>env var</code></td>
      <td><code>EMBEDDING_MODEL</code></td>
      <td>Model used to create embeddings</td>
    </tr>
    <tr>
      <td><code>env var</code></td>
      <td><code>COLLECTION_NAME</code></td>
      <td>Qdrant vector collection name</td>
    </tr>
  </tbody>
</table>

## Pro Tip: Chain MCP servers

You can deploy multiple MCP servers for different tools and plug them into agent workflows:

* qdrant-find for memory
* google-search for web data
* postgres-query for structured facts

Then orchestrate it all using Agentic AI Teams to perform high-level, multi-tool reasoning.

## Final Thought

By pairing Qdrant with MCP, Agentic AI gains powerful, semantic memory — a critical enabler of contextual understanding and long-term knowledge retention. This pattern abstracts the complexity of vector DBs behind a unified protocol, empowering agents to think, recall, and act without manual data plumbing.

As the AI stack modularizes further, approaches like this will form the backbone of scalable, pluggable, and intelligent multi-agent ecosystems.