---
title: Why storage is important for KV cache?
date: 2026-02-16T08:29:33.435Z
author: "Andrea Fabrizi, Product manager for Storage for AI "
authorimage: /img/andrea-fabrizi.png
disable: false
---
Although KV (*Key-value)* cache is usually described as an LLM inference optimization, it is actually best understood as a specialized, high‑performance storage layer that holds intermediate attention states. This article explores this aspect of KV cache and its relationship with storage.

# What KV-cache is

You can think of KV cache as: a volatile, GPU–resident key–value store that stores per-token features so they don’t need to be recomputed. This makes it essentially like a memory tier within a multi-layer storage hierarchy.

Here’s how to map KV cache to conventional storage concepts:

![](/img/kv-cache-explanantion-table.png "KV cache to conventional storage concepts mapping")

*Therefore, the KV cache is the model's “High-Bandwidth Memory (HBM) scratchpad.*

# Why KV cache is important for AI and Generative AI

## Why KV-cache is important for RAG and inference in general

KV cache is essential for RAG because it lets the model handle long retrieved contexts without having to recompute attention over all those tokens at every decoding step. When a large block of retrieved text is inserted into the prompt, the model encodes it once, stores the keys and values, and then reuses them during generation. This means new tokens only attend to the cached prefix instead of reprocessing thousands of context tokens repeatedly. As the retrieved context grows, KV cache keeps latency stable, prevents compute from exploding with sequence length, and makes long context RAG both feasible and efficient.

## Why KV cache is important for Agentic AI

### Agentic AI requires:

\*Long contexts, long chains of thought, and multi-turn loops: Agents concatenate system prompts + chat history + retrieved chunks + tool outputs. Every added token expands the KV working set. The model then re reads prior tokens’ K/V at each step.

* Sensitivity to bandwidth: The attention kernel’s speed is often limited by HBM bandwidth, not FLOPs. If KV reads stall, per token latency increases, tail latencies widen, and throughput collapses under concurrency.
* Persistence across actions and Memory of past steps: Agent steps (plan, call tools, reflect) frequently reuse the same conversation context. KV reuse avoids recomputing attention for the past—saving both time and power.

This means agents spend minutes inside a single inference session. That makes KV cache the central runtime storage system for agent state.
If the KV cache is slow, insufficient, or mismanaged:

* The agent must recompute attention → huge latency spike
* The model must truncate context → memory loss
* Multi-step reasoning grinds to a halt

## Why KV-cache is a storage problem

When examined closely, the KV-cache becomes a storage issue.<br />
When a large language model generates text one token at a time, it keeps a memory of everything it has already seen. This memory lives in the KV cache—a set of tensors that store the keys and values for every layer and every past token.

At first, this cache is small. A few tokens, a few layers, a bit of GPU memory. But as the conversation grows longer—say from 1,000 tokens to 32,000—this “memory” expands linearly with the size of the context. The model must keep every past key/value vector around so that new tokens can attend back to them. And suddenly, the KV cache, not the model weights, becomes the largest memory consumer.

As GPUs have limited High-Bandwidth-Memory (HBM), when the KV cache grows too large, systems must decide whether:

* Moving it (offloading) to CPU RAM or even to fast storage helps with capacity but reduces speed, because every new token must fetch pieces of that cache across slower connections interconnects. 
* Compressing it saves space but may reduce accuracy.  
* Storing everything in GPU memory maintains performance but limits the number of users served simultaneously. 

It easy to see that KV cache becomes not just a compute issue but a storage orchestration challenge—balancing capacity, bandwidth, latency, and cost. Long-context models, multi-user serving, and high-throughput inference all rely on how cleverly we can store, move, compress, or reuse this cache. Ultimately, generating text efficiently depends as much on memory engineering as on math.

As KV-cache is a storage orchestration challenge, the ability to move back and foward the KV cache in a fast storage system is a critical strategy for managing the KV cache. Let’s see more in details the reasons.

### KV Cache Requires Extremely High Bandwidth (HBM class). <br />

KV-cache access pattern is:

* Every new token must retrieve all previous keys and values
* Access frequency is per layer × per head

This means KV cache cannot be used if in CPU memory, SSD, or network storage. To be used, it must remain in GPU HBM, which is effectively the highest performance “storage tier” available. 

#### KV Cache often can’t fit in GPU memory<br />
For effectiveness, KV cache must remain in GPU memory, but unfortunately, it often can’t fit there. The size of the KV cache increases linearly with both the context length and the number of layers, creating capacity and bandwidth challenges. 

For example:

* A 70B model can require tens of gigabytes of KV cache just for 32k tokens.
* Larger contexts (100k–1M tokens) would require storage-tier thinking, such as sharding, compression, paging, etc.