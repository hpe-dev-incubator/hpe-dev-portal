---
title: "AI Tips: Why storage is important for KV cache?"
date: 2026-02-16T08:29:33.435Z
author: "Andrea Fabrizi, Product manager for Storage for AI "
authorimage: /img/andrea-fabrizi.png
disable: false
tags:
  - AI
  - Storage
  - HPE DEV
---
Although KV (*Key-value)* cache is usually described as an LLM inference optimization, it is actually best understood as a specialized, high‑performance storage layer that holds intermediate attention states. This article explores this aspect of KV cache and its relationship with storage.


<br/>

---

<br/>


# <span style="color:blue; font-family:Arial; font-size:1em"> What KV-cache is</span>

You can think of KV cache as: a volatile, GPU–resident key–value store that stores per-token features so they don’t need to be recomputed. This makes it essentially like a memory tier within a multi-layer storage hierarchy.

Here’s how to map KV cache to conventional storage concepts:

![](/img/kv-cache-explanantion-table.png "KV cache to conventional storage concepts mapping")

  >>>>>  <span style="color:blue; font-family:Arial; font-size:1em"> *Therefore, the KV cache is the model's “High-Bandwidth Memory (HBM) scratchpad.*</span>

<br/>

---

<br/>

# <span style="color:blue; font-family:Arial; font-size:1em"> Why KV cache is important for AI and Generative AI</span>

## <span style="color:blue; font-family:Arial; font-size:1em">Why KV-cache is important for RAG and inference in general</span>

KV cache is essential for RAG because it lets the model handle long retrieved contexts without having to recompute attention over all those tokens at every decoding step. When a large block of retrieved text is inserted into the prompt, the model encodes it once, stores the keys and values, and then reuses them during generation. This means new tokens only attend to the cached prefix instead of reprocessing thousands of context tokens repeatedly. As the retrieved context grows, KV cache keeps latency stable, prevents compute from exploding with sequence length, and makes long context RAG both feasible and efficient.

## <span style="color:blue; font-family:Arial; font-size:1em"> Why KV cache is important for Agentic AI</span>

### Agentic AI requires:

\*Long contexts, long chains of thought, and multi-turn loops: Agents concatenate system prompts + chat history + retrieved chunks + tool outputs. Every added token expands the KV working set. The model then re reads prior tokens’ K/V at each step.

* Sensitivity to bandwidth: The attention kernel’s speed is often limited by HBM bandwidth, not FLOPs. If KV reads stall, per token latency increases, tail latencies widen, and throughput collapses under concurrency.
* Persistence across actions and Memory of past steps: Agent steps (plan, call tools, reflect) frequently reuse the same conversation context. KV reuse avoids recomputing attention for the past—saving both time and power.

This means agents spend minutes inside a single inference session. That makes KV cache the central runtime storage system for agent state.
If the KV cache is slow, insufficient, or mismanaged:

* The agent must recompute attention → huge latency spike
* The model must truncate context → memory loss
* Multi-step reasoning grinds to a halt

<br/>

---

<br/>

## <span style="color:blue; font-family:Arial; font-size:1em">Why KV-cache is a storage problem</span>

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

When the KV-cache exceeds the HBM memory, it must be stored elsewhere (CPU memory first, then fast storage).

#### KV cache often doesn’t reside in a single GPU

But there is an additional complexity. The KV cache often doesn’t reside in a single GPU. When models run across multiple GPUs, the KV cache is sharded across them. KV cache “follows” the model parallelism:

* Tensor parallelism: shard across layers/heads
* Sequence parallelism: shard by tokens
* Context parallelism: shard by ranges of inputs

This makes KV management like distributed file systems:

* Placement
* Replication
* Access path optimization
* Paging / eviction

 >>>>>  <span style="color:blue; font-family:Arial; font-size:1em"> *In conclusion, KV-cache pagination requires a memory-tiered storage*</span>

Indeed, recent trends see the development of storage systems optimized for tiering with KV-cache. Storage systems are, therefore, part of the KV-cache pagination management:

* GPU HBM → hot KV
* CPU RAM → warm KV
* NVMe / SSD → cold KV
<br/>

---

<br/>

## <span style="color:blue; font-family:Arial; font-size:1em">Finally, why RDMA/GPUDirect (for objects or files) is important for KV cache</span>

This diagram shows the end to end RAG + inference flow and where RDMA / GPUDirect optimizes movement into the GPU—before the KV cache becomes active.

![](/img/screenshot-2026-02-16-at-10.41.09.png "Figure 1 - RDMA/GDS role in a RAG pipeline")

RDMA / GPUDirect help:

* Storage → GPU ingestion:

  * RDMA (object/file) + GPUDirect allow NIC or storage to DMA directly into GPU memory, bypassing CPU copies.
  * This accelerates document load, embedding pipelines, vector index updates, and LLM input streaming.
* Before KV activation:

  * KV cache is populated after tokenization and initial forward passes occur on GPU. RDMA/GPUDirect primarily reduce the time to first token by accelerating data arrival to the GPU.
* During RAG loops:

  * Frequent retrieval (top k) + reranking benefits from GPU-resident vector DB and RDMA reads from warm storage. The faster the context assembly, the sooner the LLM can append to KV cache.

In other words, RDMA/GPUDirect accelerate the front half (docs/embeddings/context into GPU memory). Once generation starts, the KV cache dominates the hot path, acting as the L1/L2 like working store of the decoder.

<br/>

---

<br/>

## <span style="color:blue; font-family:Arial; font-size:1em">Conclusion:</span>

A fast storage is essential for maximizing KV‑cache performance. By placing the right portions of the cache on fast, low‑latency. RDMA- and GDS-enabled storage - such as HPE Alletra MP X10000 - and offloading overflow to cost‑efficient tiers, organizations can balance speed, scale, and efficiency. 

Stay tuned to the [HPE Developer Community blogs ](https://developer.hpe.com/blog/)and AI Tips for more guides and best practices on AI and Storage for AI.