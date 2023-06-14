---
title: Announcing HPE Swarm Learning 2.0.0
date: 2023-06-12T16:48:53.923Z
featuredBlog: true
author: HPE Swarm Learning Team
authorimage: /img/Avatar1.svg
disable: false
tags:
  - swarm-learning
---
We’re excited to announce the HPE Swarm Learning 2.0.0 community release!!

In the previous version of HPE Swarm Learning, if the sentinel Swarm Network (SN) node goes down during Swarm training, the training process would stop, and there was no way to resume it. However, with this release, we have addressed the issue by implementing a mesh topology (connectivity) between SNs, replacing the previous star topology where only the sentinel SN was connected to other SNs. 

Also, we now support multiple blockchain miners instead of just one miner in the sentinel SN. Now, even if the initial sentinel SN goes down, since other SNs also function as miners, it allows the training to continue uninterrupted. Additionally, when the initial sentinel SN is down and if a new SN wants to join the network, it can seamlessly integrate and join the Swarm network with the help of any other SN node. This **high availability configuration** ensures improved resilience and robustness of HPE Swarm Learning.

In the HPE Swarm Learning sync stage (defined by sync frequency), when it is time to share the learning from the individual model, one of the Swarm Learning (SL) nodes is designated as the “leader” node. This leader node collects the individual models from each peer node and merges them into a single model by combining parameters of all the individuals. The **Leader Failure Detection and Recovery (LFDR)** feature enables SL nodes to continue Swarm training during the merging process when an SL leader node fails. A new SL leader node is selected to continue the merging process. If the failed SL leader node comes back after the new SL leader node is in action, the failed SL leader node is treated as a normal SL node and contributes its learning to the swarm global model.

With HPE Swarm Learning v2.0.0 release, user can now extend Swarm client to support other machine learning platforms as well. Currently Swarm client supports machine learning platforms like PyTorch and Keras (based on Tensorflow 2 in backend). Please find the instructions to extend Swarm client [here](https://github.com/HewlettPackard/swarm-learning/blob/master/lib/src/README.md).

#### **2.0.0 release contains following updates:**

* High availability for SN

  * Handling Sentinel node failure.
  * Any SN node can act as sentinel while adding new node.
  * Supports mesh topology of SN network.
* High availability for SL leader

  * Electing new merge leader when a leader failure is detected.
  * Handles stale leader recovery.
* Swarm Learning Management UI (SLM-UI)

  * Swarm product installation through SLM-UI.
  * Deploy and Manage Swarm Learning through SLM-UI.
* Swarm client library

  * Extend Swarm Learning for new ML platforms.
* Improved diagnostics and utility script for logs collection.

#### For complete details on this new release, please refer to the following resources:

* [H﻿PE Swarm Learning home page](https://github.com/HewlettPackard/swarm-learning)
* [H﻿PE Swarm Learning client readme](https://github.com/HewlettPackard/swarm-learning/blob/master/lib/src/README.md)

#### For any questions, start a discussion in our [\#hpe-swarm-learning](https://hpedev.slack.com/archives/C04A5DK9TUK) slack channel on [HPE Developer Slack Workspace](https://slack.hpedev.io/)