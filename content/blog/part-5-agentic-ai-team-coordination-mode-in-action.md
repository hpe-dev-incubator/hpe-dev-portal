---
title: "Part 5: Agentic AI: Team coordination mode in action"
date: 2025-07-21T07:24:24.522Z
author: Dinesh R Singh
authorimage: /img/dinesh-192-192.jpg
disable: false
tags:
  - LLM
  - Generative AI
  - Agentic AI
  - AI Agents
---
<style>
li {
   font-size: 27px;
   line-height: 33px;
   max-width: none;
}
</style>

One of the most transformative patterns in Agentic AI is team-based orchestration — a collaborative approach where specialized **agents work together to fulfill complex goals**. In this edition, we explore coordinate mode using the AGNO framework — a design where a team manager delegates, supervises, and integrates the contributions of each agent.

[Inspired by my Medium post.](https://dineshr1493.medium.com/all-you-need-to-know-about-the-evolution-of-generative-ai-to-agentic-ai-part-5-agentic-ai-a-2d6651c9cc5c)

<center><img src="/img/screenshot-2025-07-21-at-12.57.22 pm.png" width="600" height="550" alt="LLM Mode" title="LLM Mode"></center>

## What are agentic AI teams?

An agentic team is a structured collection of AI agents, each performing a specific role with autonomy and tool access. Teams can include roles like:

* Researcher: Finds and filters relevant data
* Writer: Synthesizes content with tone and structure
* Translator: Converts content across languages
* Planner: Organizes execution based on goals

### In Coordinate Mode:

* A team manager Agent directs the flow of tasks
* Individual agents handle sub-tasks independently
* Final results are reviewed, refined, and unified by the manager

## AGNO Framework: Coordinating a multi-agent content team

Let’s examine a professional-grade configuration of a New York Times-style editorial team, where search, writing, and editorial review are handled by distinct agents.

### Imports

```python
from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.team.team import Team
from agno.tools.search import DuckDuckGoTools
from agno.tools.read import Newspaper4kTools
```

### Searcher agent

```python
searcher = Agent(
    name="Searcher",
    role="Searches the top URLs for a topic",
    instructions=[
        "Generate 3 search terms for a topic.",
        "Search the web and return 10 high-quality, relevant URLs.",
        "Prioritize credible sources, suitable for the New York Times."
    ],
    tools=[DuckDuckGoTools()],
    add_datetime_to_instructions=True,
)
```

### Writer agent

```python
writer = Agent(
    name="Writer",
    role="Writes a high-quality article",
    description="Senior NYT writer tasked with long-form editorial content.",
    instructions=[
        "Read all articles using `read_article`.",
        "Write a structured, engaging article of at least 15 paragraphs.",
        "Support arguments with factual citations and ensure clarity.",
        "Never fabricate facts or plagiarize content."
    ],
    tools=[Newspaper4kTools()],
    add_datetime_to_instructions=True,
)
```

### Editor team (Manager agent in Coordinate Mode)

```python
editor = Team(
    name="Editor",
    mode="coordinate",
    model=OpenAIChat("gpt-4o"),
    members=[searcher, writer],
    description="You are a senior NYT editor coordinating the team.",
    instructions=[
        "Delegate research to the search agent.",
        "Delegate drafting to the writer.",
        "Review, proofread, and enhance the final article.",
        "Maintain NYT-level quality, structure, and tone."
    ],
    add_datetime_to_instructions=True,
    send_team_context_to_members=True,
    show_members_responses=True,
    markdown=True,
)
```

### Running the team

```python
Method 1: Print output directly
editor.print_response("Write an article about latest developments in AI.")

Method 2: Get raw result
response = editor.run("Write an article about latest developments in AI.")
```

### Key parameters explained

<table>
  <thead style="background-color:#f2f2f2">
    <tr>
      <th>Parameter</th>
      <th>Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>mode="coordinate"</code></td>
      <td>Enables structured delegation and task flow</td>
    </tr>
    <tr>
      <td><code>members=\\\\\[...]</code></td>
      <td>Assigns role-specific agents</td>
    </tr>
    <tr>
      <td><code>send_team_context_to_members</code></td>
      <td>Shares global task context with all agents</td>
    </tr>
    <tr>
      <td><code>show_members_responses=True</code></td>
      <td>Displays each member's intermediate output</td>
    </tr>
    <tr>
      <td><code>add_datetime_to_instructions</code></td>
      <td>Contextualizes outputs with current date/time</td>
    </tr>
  </tbody>
</table>

## Pro tip: Define success criteria

Adding success criteria helps agents align their efforts with measurable outcomes.

```python
strategy_team = Team(
    members=[market_analyst, competitive_analyst, strategic_planner],
    mode="coordinate",
    name="Strategy Team",
    description="A team that develops strategic recommendations",
    success_criteria="Produce actionable strategic recommendations supported by market and competitive analysis",
)
response = strategy_team.run(
    "Develop a market entry strategy for our new AI-powered healthcare product"
)
```

This ensures agents not only act — but act with strategic purpose and direction.

<center><img src="/img/screenshot-2025-07-21-at-12.57.44 pm.png" width="600" height="550" alt="Agentic AI Parameters" title="Agentic AI Parameters"></center>

## Conclusion

Coordinate Mode in Agentic AI exemplifies intelligent task distribution, where specialized agents work under centralized leadership to deliver complex, high-quality outputs. The AGNO framework simplifies this orchestration through agent roles, tool integration, and goal alignment **—** **enabling scalable, auditable AI workflows.**

From editorial pipelines to business strategy engines, multi-agent coordination is redefining how work gets done **— autonomously, intelligently, and collaboratively.**