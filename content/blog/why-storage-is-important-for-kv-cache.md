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

| Storage Concept      | LLM Equivalent | Explanation |
| -------------------- | -------------- | ----------- |
| Registers            |                |             |
| L1 / L2 cache        |                |             |
| RAM                  |                |             |
| SSD / Object Storage |                |             |
| Cold Storage         |                |             |
|                      |                |             |

Therefore, the KV cache is the model's “High-Bandwidth Memory (HBM) [scratchpad](<>).