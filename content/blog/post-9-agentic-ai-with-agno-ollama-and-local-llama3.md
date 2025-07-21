---
title: "Post 9 : Agentic AI with AGNO, Ollama, and Local LLaMA3"
date: 2025-07-21T11:12:57.626Z
author: Dinesh R Singh
authorimage: /img/dinesh-192-192.jpg
disable: false
---
<style>
li {
   font-size: 27px;
   line-height: 33px;
   max-width: none;
}
</style>



As Agentic AI evolves, the need for local, private, and flexible inference becomes critical. Frameworks like AGNO provide orchestration, but the ability to plug in LLMs running locally is what sets the next-gen agentic stack apart.

> [My post on Medium,](https://dineshr1493.medium.com/all-you-need-to-know-about-the-evolution-of-generative-ai-to-agentic-ai-part-9-agentic-ai-agno-74d74cd0d9f3)

### In this walkthrough, we explore:

* What is Ollama and how it powers local LLMs
* Running LLaMA 3.2 locally with minimal setup
* Connecting Ollama with AGNO Framework
* Building an offline agent pipeline using only Python
* Why this empowers fully private, offline, and customizable AI deployments

## AGNO Meets Local LLMs via Ollama

One of AGNO’s core strengths is modularity — it can interface with any LLM provider, including:

* OpenAI (gpt-4o, gpt-3.5)
* Claude (3.5 Sonnet, Haiku)
* DeepSeek
* Mistral
* Ollama (local)

This makes it possible to define agents using LLaMA 3, Mistral, or Gemma without cloud dependencies — while maintaining the full Agentic AI loop:**Think → Plan → Act → Reflect**

## What is Ollama?

Ollama is a local inference server that can run transformer models on CPU or GPU. It supports major open-source LLMs like LLaMA, Mistral, DeepSeek, QWEN, and Gemma.

Once running, it exposes a REST API at http://localhost:11434, compatible with OpenAI-style inference.

Official site: [ollama.com](https://ollama.com)

Install and Run Ollama

bash

CopyEdit

\# Mac

brew install ollama

\# Linux

curl -fsSL https://ollama.com/install.sh | sh

\# Run a model

ollama run llama3

This downloads and launches LLaMA 3.2 locally. Once active, it exposes endpoints that work with both synchronous and streaming chat.

- - -

AGNO + Ollama: Agent Example

Let’s build a storytelling agent using AGNO connected to Ollama.

python

CopyEdit

from agno.agent import Agent

from agno.models.ollama import Ollama

agent = Agent(

model=Ollama(id="llama3.2", provider="Ollama"),

description="You are an enthusiastic news reporter with a flair for storytelling!",

markdown=True

)

agent.print_response("Tell me about a breaking news story from New York.", stream=True)

Parameters

|     |     |
| --- | --- |
|     |     |
|     |     |
|     |     |
|     |     |

- - -

No Framework? No Problem.

Frameworks like AGNO offer orchestration, but what if you're running in:

* Air-gapped networks
* Lightweight environments
* Custom experimental setups?

Here’s how to build a raw agent pipeline using just:

* Ollama for LLM
* DuckDuckGo search for tool use
* Custom prompt logic

Full Python Agent Pipeline

python

CopyEdit

from ollama import Client

from duckduckgo_search import DDGS

ollama_client = Client(host='http://localhost:11434')

\# Tool: Web search via DuckDuckGo

def duckduckgo_search(query, max_results=5):

with DDGS() as ddgs:

     return \[r for r in ddgs.text(query, region="wt-wt", safesearch="off", max_results=max_results)]

\# Pipeline logic

def agent_pipeline(user_input):

if "what" in user_input.lower() or "happening" in user_input.lower():

     print("\[Tool] Searching DuckDuckGo...")

     search_results = duckduckgo_search(user_input)

     summary = "\n".join(\[f"- {r['title']}: {r\['href']}" for r in search_results])

else:

     summary = ""

if summary:

     system_prompt = (

         "You are an assistant. I found these recent search results:\n"

         f"{summary}\n"

         "Now generate a helpful answer for the user question below.\n"

         f"User question: {user_input}"

     )

else:

     system_prompt = f"You are a helpful assistant. Answer this: {user_input}"

response = ollama_client.chat(

     model='llama3.2',

     messages=\[{"role": "user", "content": system_prompt}]

)

print("\n\[Agent Response]:")

print(response\['message']\['content'])

- - -

Example Outputs

python

CopyEdit

agent_pipeline("What's happening in New York?")

agent_pipeline("Tell me a joke.")

- - -

Breakdown of Components

|     |     |
| --- | --- |
|     |     |
|     |     |
|     |     |
|     |     |
|     |     |

This pattern gives you full control with zero cloud dependency — and forms the base for private AI workflows.

- - -

Pro Tip

Looking for multi-agent orchestration with Ollama?

Check out Langmanus — a framework for:

* Graph-based agent orchestration
* Streaming LLM outputs
* Agent-task dependencies and coordination

- - -

Final Summary

By combining AGNO, Ollama, and LLaMA3, developers can build fully private Agentic AI systems that:

* Work offline
* Are modular and extensible
* Use both tools and models interchangeably
* Scale from simple scripts to complex workflows

This stack represents the future of agent design — grounded, capable, and locally operable.