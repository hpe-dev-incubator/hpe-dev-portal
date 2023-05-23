---
title: Announcing HPE Swarm Learning 2.0.0
date: 2023-05-11T04:47:46.996Z
featuredBlog: true
author: HPE Swarm Learning Team
authorimage: /img/Avatar1.svg
disable: false
---
<!--StartFragment-->

We’re excited to announce HPE Swarm Learning 2.0.0 community release!!

In Swarm Learning at the sync stage (defined by Sync Frequency), when it is time to share the learning from the individual model, one of the SL nodes is designated as “leader”. This leader node collects the individual models from each peer node and merges them into a single model by combining parameters of all the individuals.

**Leader Failure Detection and Recovery (LFDR)** feature enables SL nodes to continue Swarm training during merging process when an SL leader node fails. A new SL leader node is selected to continue the merging process. If the failed SL leader node comes back after the new SL leader node is in action, the failed SL leader node is treated as a normal SL node and contributes its learning to the swarm global model.

With this release, user can now extend swarm client to have other machine learning platforms as well. Currently swarm client has machine learning platforms like PyTorch and Keras (based on Tensorflow 2 in backend). Please find the instruction to extend swarm client [here](https://github.com/HewlettPackard/swarm-learning/blob/master/lib/src/README.md).

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

* #### [H﻿PE Swarm Learning home page](https://github.com/HewlettPackard/swarm-learning)
* [H﻿PE Swarm Learning client readme](https://github.com/HewlettPackard/swarm-learning/blob/master/lib/src/README.md)

#### For any questions, start a discussion in our [\#hpe-swarm-learning](https://hpedev.slack.com/archives/C04A5DK9TUK) slack channel on [HPE Developer Slack Workspace](https://slack.hpedev.io/)

<!--EndFragment-->