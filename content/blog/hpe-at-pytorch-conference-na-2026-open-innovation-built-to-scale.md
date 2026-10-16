---
title: "HPE at PyTorch Conference NA 2026: Open Innovation, Built to Scale"
date: 2026-10-15T22:05:00.000Z
featuredBlog: false
priority: 0
author: Ria Farrell Schalnat
authorimage: ‎/img/riapic.jpg‎
disable: false
tags:
  - AI
  - opensource
  - developer
---

![Pytorch-conference](https://pytorch.org/wp-content/uploads/2025/12/PyTorch-Conference-North-America-2026.png)


Artificial Intelligence moves fast, especially when it is open. The harder part is turning that innovation into something teams can operate securely, reliably, and at scale—without forcing developers to become experts in every layer of infrastructure underneath their models.

That is why HPE is proud to be a gold sponsor of PyTorch Conference North America 2026, taking place October 20–21 in San Jose. PyTorchCon brings together the people building the open AI stack, from PyTorch and vLLM to training, inference, kernel engineering, and the infrastructure that makes all of it work. For HPE, showing up is more than sponsorship. It is about contributing engineering, learning from the community, and helping make open AI easier to mature from experimentation to sustained enterprise use.

## Our theme is simple: open innovation, built to scale.

### Start with the Developer Problem

Developers should be able to choose the frameworks, accelerators, networks, and data platforms that fit their workloads. But as AI systems grow, seemingly straightforward code runs into very real systems problems: moving data fast enough, coordinating work across GPUs and nodes, validating hardware before it reaches production, scaling inference, recovering from failures, and understanding what is happening once a model is serving real traffic.

Those are exactly the areas where HPE teams have been working. At PyTorchCon, we will share practical work across communication, storage, distributed Python, validation, and production inferencing—not as isolated products, but as pieces of an interoperable AI environment.

### HPE demos, talks, and posters

**OpenCLIC: Open Communication for Distributed Inference**

Jesse Treger will introduce OpenCLIC, an open communication framework for connectionless networks integrating with vLLM. The work starts with expert-parallel and mixture-of-experts inference, separating framework interfaces, GPU kernels, and transport implementations. Innovation can leap forward without a requirement to lock onto a single accelerator or network stack. The initial HPE Slingshot implementation uses kernel-initiated OpenSHMEM communication, with a path toward broader open Ethernet and libfabric directions.

**Connectionless Scale-Out Inference and OpenSHMEM**

Naveen Ravichandrasekaran and Nathan Wichmann will share posters focused on connectionless scale-out expert parallelism and OpenSHMEM transport for AI/MoE workloads. The goal is straightforward: give users and developers better ways to handle GPU-initiated communication and increasingly dynamic inference traffic while preserving flexibility across the stack.

**DAOS + PyTorch: Accelerating the Data Path**

Andrey Kudryavtsev will demonstrate how DAOS can serve as an open, high-performance backend for PyTorch datasets and checkpoints while keeping familiar DataLoader and save/load patterns. The interesting part for a PyTorch developer is what does not need to change: training loops can stay familiar while data loading, model loading, and checkpointing take advantage of a distributed storage architecture designed for scale. HPE is a primary developer of DAOS and makes the technology deployable and supportable for enterprise environments.

**DragonHPC for Inference and Training**

Davin Potts will present two views of DragonHPC, the open source distributed runtime that grew from Cray technology and that HPE continues to develop. One talk focuses on scalable inference orchestration around PyTorch and vLLM; the other tackles DataLoader bottlenecks in training. HPE built Dragon around familiar Python interfaces and designed it to help tools such as PyTorch, vLLM, Lightning, Jupyter, and data libraries work together across large systems rather than requiring developers to replace the ecosystem they already use.

**Torch Hammer**

Isa Wazirzada will show how HPE's open source Torch Hammer work can validate GPUs, CPUs, and APUs and surface fleet-level anomalies before production use. The talk blends stress testing with telemetry, thresholds, and reporting—turning hardware validation into something teams can observe and reason about instead of discovering problems after a workload is already running.

**Deploy, Load, Observe: A PyTorch Model's Journey to Production Inference**

Anda Zhou will highlight a PyTorch workflow that starts in a Jupyter notebook and moves through deployment to a live inference endpoint with HPE Private Cloud AI and HPE AI Essentials. The demo trains a LoRA adapter in a notebook and serves production traffic on a vLLM endpoint minutes later, with live observability for latency, usage, and throughput throughout. It is a concrete look at the gap between having a model and operating one—and how much of that operational work can be made repeatable.


### Why this matters beyond the conference

There is a business story behind all of this, but it starts with a developer truth: the easiest infrastructure to adopt is the infrastructure that works with the software people already choose.

For enterprise leaders, that translates into something equally important. Open source can create tremendous choice and speed, but operationalizing carries additional costs in integration, expertise, security, resilience, lifecycle management, and day-two operations. HPE's role is to reduce that burden while preserving choice—bringing system-scale engineering, high-performance networking and data, orchestration, validation, observability, and enterprise operations together around useful AI outcomes.

That is also why community participation matters. Open source is a two-way street. HPE depends on open projects, and those projects benefit when infrastructure vendors contribute real-world engineering experience upstream. Being part of PyTorchCon helps us make sure the paths developers want to use remain performant, portable, and practical on the systems enterprises depend on.

If you are at PyTorch Conference North America in San Jose, October 20–21, come find HPE at Booth #14, catch the theater session and posters, and talk with the engineers behind the work. Bring the scaling problem, I/O bottleneck, inference challenge, or operational headache you are wrestling with, we would love to compare notes.

Learn more about [HPE and open source](https://www.hpe.com/us/en/open-source.html)
