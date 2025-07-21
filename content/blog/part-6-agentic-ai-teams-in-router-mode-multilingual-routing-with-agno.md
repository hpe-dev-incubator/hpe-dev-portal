---
title: "Part 6: Agentic AI Teams in Router Mode: Multilingual Routing with AGNO"
date: 2025-07-21T10:04:38.579Z
author: Dinesh R Singh
authorimage: /img/dinesh-192-192.jpg
disable: false
tags:
  - "Language Agents "
  - MultiLingual Application
  - Multilingual
  - Multi Language Agents
---
<style>
li {
   font-size: 27px;
   line-height: 33px;
   max-width: none;
}
</style>

One of the most powerful capabilities in Agentic AI is orchestrating multiple agents to work together—each with its own specialization. In this segment, we explore the Router Mode pattern, a configuration where a central team detects context (like language or domain) and routes queries to the right agent accordingly.

This method is especially effective in scenarios requiring multilingual or domain-specific support. Using the AGNO Framework, we’ll see how to construct a language-routing team that handles diverse user inputs with precision and fallback logic.

[Inspired by my Medium post.](https://dineshr1493.medium.com/all-you-need-to-know-about-the-evolution-of-generative-ai-to-agentic-ai-part-6-agentic-ai-a-39714050857b)

## Router Mode: What It Is ?

In Router Mode, the team acts like a switchboard, rather than executing tasks itself. Its core responsibility is to:

* Analyze user input
* Detect the appropriate context (e.g., language)
* Route the request to a specialized agent
* Handle unsupported inputs gracefully

<center><img src="/img/screenshot-2025-07-21-at-3.38.34 pm.png" width="600" height="550" alt="Route Mode" title="Route Mode"></center>

### Use Case: Multilingual Chat Support

Imagine a chatbot that receives queries in different languages. Router Mode enables:

* Language detection
* Delegation to language-specific agents (e.g., Japanese, French, German)
* Fallback messages for unsupported languages

### Implementation: AGNO Framework Setup

We’ll define a set of language-specific agents and create a routing team that delegates accordingly.

#### Step 1: Define Language Agents

```
from agno.agent import Agent
from agno.models.anthropic import Claude
from agno.models.deepseek import DeepSeek
from agno.models.mistral.mistral import MistralChat
from agno.models.openai import OpenAIChat

english_agent = Agent(
    name="English Agent",
    role="You can only answer in English",
    model=OpenAIChat(id="gpt-4.5-preview"),
    instructions=["You must only respond in English"],
)

japanese_agent = Agent(
    name="Japanese Agent",
    role="You can only answer in Japanese",
    model=DeepSeek(id="deepseek-chat"),
    instructions=["You must only respond in Japanese"],
)

chinese_agent = Agent(
    name="Chinese Agent",
    role="You can only answer in Chinese",
    model=DeepSeek(id="deepseek-chat"),
    instructions=["You must only respond in Chinese"],
)

spanish_agent = Agent(
    name="Spanish Agent",
    role="You can only answer in Spanish",
    model=OpenAIChat(id="gpt-4.5-preview"),
    instructions=["You must only respond in Spanish"],
)

french_agent = Agent(
    name="French Agent",
    role="You can only answer in French",
    model=MistralChat(id="mistral-large-latest"),
    instructions=["You must only respond in French"],
)

german_agent = Agent(
    name="German Agent",
    role="You can only answer in German",
    model=Claude("claude-3-5-sonnet-20241022"),
    instructions=["You must only respond in German"],
)
 

 
```

### Step 2: Create the Router Team

```
from agno.team.team import Team

multi_language_team = Team(
    name="Multi Language Team",
    mode="route",
    model=OpenAIChat("gpt-4.5-preview"),
    members=[
        english_agent,
        spanish_agent,
        japanese_agent,
        french_agent,
        german_agent,
        chinese_agent,
    ],
    show_tool_calls=True,
    markdown=True,
    show_members_responses=True,
    instructions=[
        "You are a language router that directs questions to the appropriate language agent.",
        "If the user asks in a language whose agent is not a team member, respond in English with:",
        "'I can only answer in the following languages: English, Spanish, Japanese, French and German. Please ask your question in one of these languages.'",
        "Always check the language of the user's input before routing to an agent.",
        "For unsupported languages like Italian, respond in English with the above message.",
    ]
)
```

### Step 3: Run Multilingual Examples

```
multi_language_team.print_response("How are you?", stream=True)         # English
multi_language_team.print_response("你好吗？", stream=True)              # Chinese
multi_language_team.print_response("お元気ですか?", stream=True)         # Japanese
multi_language_team.print_response("Comment allez-vous?", stream=True) # French
```

### Output:

```
[English Agent]: I'm doing great! How can I help you today?
[Chinese Agent]: 我很好，谢谢你的关心。你呢？
[Japanese Agent]: 元気です。あなたはお元気ですか？
[French Agent]: Je vais bien, merci. Et vous ?
```

<center><img src="/img/screenshot-2025-07-21-at-3.38.47 pm.png" width="600" height="550" alt="Agent Mode Parameters" title="Agent Mode Parameters"></center>

## Key Parameters Explained

<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
  <thead style="background-color:#f2f2f2">
    <tr>
      <th>Parameter</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>mode="route"</code></td>
      <td>Instructs the team to act as a switchboard, not an executor</td>
    </tr>
    <tr>
      <td><code>show_members_responses=True</code></td>
      <td>Displays individual agent replies for traceability</td>
    </tr>
    <tr>
      <td><code>instructions\[]</code></td>
      <td>Core router logic: detect language, enforce exclusivity, manage fallbacks</td>
    </tr>
    <tr>
      <td><code>model=OpenAIChat(...)</code></td>
      <td>Backbone LLM used by the router team for input analysis</td>
    </tr>
  </tbody>
</table>



## Why Router Mode Works

* Context-awareness: Inputs are analyzed for language, not just keywords
* Agent exclusivity: Each agent strictly operates in its assigned language
* Fallback resilience: Unsupported queries are met with a clear, unified message
* Modularity: Each language agent is replaceable or extendable

## Conclusion

Router Mode in Agentic AI introduces scalable intelligence by structuring agents like a multilingual team. Rather than overwhelming a single agent, you delegate responsibility across specialists and keep interactions clean, accurate, and context-driven.

With the AGNO Framework, creating such intelligent, language-aware teams becomes seamless — and your agents become not just reactive, but well-organized and self-aware of their boundaries.

A structured team, strict instructions, and intelligent routing — that’s the future of responsive AI, sir.