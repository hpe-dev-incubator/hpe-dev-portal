---
title: "From Data Centers to Centers of Data: Navigating the Pull of Data Gravity"
date: 2025-05-09T11:31:10.538Z
author: Denis Vilfort
authorimage: /img/denisvilfort_head_shot_2.png
disable: false
tags:
  - datacenter
  - edge
  - data gravity
---
<style>
li {
   font-size: 27px;
   line-height: 33px;
   max-width: none;
}
</style>

> ***“Son, when I don’t have the data—people die.“***

The room fell silent as a highly decorated Army colonel spoke about supporting frontline combat operations with real-time IT. His point landed hard: in the fog of war, data isn’t just a convenience—it’s a lifeline. Without it, decisions are delayed. And in combat, delays can cost lives.

It may sound extreme, but business leaders face a strikingly similar reality. When data is missing, late, or incomplete, decisions suffer. Opportunities are missed. Customers leave. Competitors surge ahead. Whether in warfare or in business, the equation remains simple: **data drives decisions—but only if it can be processed within time to matter**.

In my [previous blog post](https://hybridcloud.hpecorp.net/blog/rise-of-distributed-enterprise), I described the rise of the distributed enterprise and how businesses are moving away from centralized data centers and embracing a model that brings technology closer to where value is created. In this post, I'll get into details about data gravity and the effect it has had on this shift.

## Ever expanding data—and why you can’t centralize your way out

Workloads are getting increasingly complex. The data needed to precisely calibrate a business decision today has grown by several magnitudes. New infrastructure capabilities drive new workloads which in turn expand data mass exponentially. We have witnessed the required data mass more than double every year. This trend has been observable for at least a decade. What used to be a manageable trickle has become a roaring flood. Real-time analytics, new AI models, IoT sensors, and always-on digital services all demand access to more—and faster—data.

But here’s the problem: traditional, centralized data center architectures can’t keep up. Trying to move petabytes of data across wide-area networks (WANs) introduces costly delays. Even with WAN speeds improving, they’re simply not accelerating fast enough to match data’s pace. As a result, there is a growing impedance mismatch between data generated at a company’s location and the ability to get it processed at the other end of a network connection before the window of opportunity slams shut.

Today’s reality? **We’re generating too much data, too quickly, in too many places**. And that’s forcing us to rethink how, and where, we process it.

**Enter: Data Gravity**

Data isn’t just growing—it’s anchoring itself, an effect referred to as ***data gravity***. Like a star with enough mass to pull planets into orbit, large datasets tend to attract everything around them: applications, services, even more data. And the larger the dataset, the harder—and more expensive—it becomes to move back to a centralized data center or public cloud availability zone for processing.

Instead, the smarter, faster move is to **bring processing power to the data**, not the other way around.



![Data needed to make a business decision](https://hybridcloud.hpecorp.net/assets/data-needed-to-make-decisions.png "Data needed to make a business decision")

> *Source: HPE research*

This is especially true at distributed enterprise locations, where data is being created at unprecedented rates: in hospitals, factories, smart cities, autonomous vehicles, and beyond. These environments demand **real-time** decision making—and that means they can’t wait for data to go elsewhere to be processed.

## The numbers tell the story

Over the last ten years, we’ve witnessed a staggering transformation in the way data is generated, consumed, and leveraged. This change hasn't just been a byproduct of digital transformation; it's been a foundational force behind the rise of artificial intelligence, particularly large language models (LLMs) and agentic AI systems.

Over the past decade, global data volumes have increased by **115% per year**. That’s not just exponential growth—it’s super-exponential. Think about it: a terabyte of data generated today will likely be a petabyte in just a few years given current trends.

But as data mass expands, our ability to move that data hasn't kept pace. During this same period of time, wide-area network (WAN) bandwidth has grown at just **69% per year**. While that might sound impressive in isolation, it pales in comparison to the data it's supposed to support.

Here’s the stark reality:

* Over the last 10 years, the mass of decision-making data has increased **2,250X**.
* WAN bandwidth? It’s only grown about **200X**.

Let that sink in. We’re facing a dramatic performance drag—at the exact moment when speed is becoming a critical business differentiator. This gap between data growth and bandwidth growth has led to a critical WAN infrastructure strain.

![Relative data mass to WAN bandwidth impedance mismatch](https://hybridcloud.hpecorp.net/assets/impedence-mismatch.png "Relative data mass to WAN bandwidth impedance mismatch")

> *Source: HPE research*

The bandwidth shortfall has real consequences. The lag in WAN infrastructure has introduced an additional 11 seconds of delay per every second of decision-making time over the past decade. In high-speed trading, autonomous vehicles, or real-time AI systems, those seconds are unacceptable. They're not just delays—they're the difference between relevance and irrelevance, or in some cases, safety and disaster.

Take a quality control system in a manufacturing plant, for example. It might generate 100MB of camera data **every second**. To ascertain product quality, that data needs to be processed instantly. Transmitting it to a central data center requires a 1.2 Gbps link—technically possible, but prohibitively expensive and complex, especially at scale.

The smarter move? **Process it on site**. Act on it in real time. Let the factory floor become the “center of data.”

## A new equation for the real-time enterprise

Modern AI systems, especially large language models and agentic AI, are data-hungry by nature. Training a state-of-the-art LLM requires ingesting massive datasets that span languages, domains, and formats. But it's not just about training—it's about real-time inference, adaptation, and autonomy.

Agentic AI, which refers to systems that can act autonomously and make decisions in complex environments, amplifies this need. These systems rely on vast amounts of localized, real-time data: sensor feeds, user interactions, environmental inputs, and more. Their effectiveness hinges not only on access to data but on how quickly and efficiently that data can be processed.

We need a new way to measure value in a data-driven world.

**Try this:**

***Data Mass/Processing Time = Business Value***

It’s not just about how much data you have—it’s about how quickly you can turn that data into decisions. And the infrastructure to support that transformation is finally here.

A few years ago, you needed 24 racks to get 768 CPU cores. Today, you can get that same horsepower in **just three 1U servers**. Flash storage like NVMe drives is **35x faster** than traditional disks. 400 Gbps networking between servers is no longer bleeding-edge—it’s becoming standard. But only at a given location.

So, location-specific hardware is ready. The question is whether our thinking—and architecture—has caught up. To fully realize the potential of LLMs and agentic AI, we need to rethink how and where AI is deployed. The future isn't about massive, centralized models alone. It's about hybrid architectures that combine the power of the cloud with the immediacy of the edge.

We’ve entered a new era—one where **location** is just as important as **speed** or **scale**. As data volumes balloon and decision windows shrink, the old model of hauling everything to a central data center no longer works.

The new model? Flip the script.

* Build **edge-native, distributed** systems that eliminate bottlenecks.
* Leverage r**eal-time intelligence** at the point of creation so you can act on data where it lives, and then move it when it grows cold
* Design **for gravity**—not against it—by aligning compute and storage with the natural flow of data.

## Taking your data’s temperature into account

To be clear, not all data needs to stay at the edge forever. Hot, high-value data—the kind that feeds real-time decisions—should absolutely be processed on site. However, when today’s data cools – or becomes less active – then it should move. What? We were just discussing how IT infrastructure like servers, networks, storage, and orchestration needed to move to the distributed locations and no longer remain in the classic old data center. That still stands. And precisely because IT infrastructure now is distributed, it must only be used for data that drives decisions where operational value is high. But as data cools, it can (and should) be archived or moved to lower-cost, centralized storage.

Too often, organizations treat all data the same, hoarding everything on an expensive, high-performance infrastructure. That’s a recipe for inefficiency. Instead, take a smarter approach and implement **data lifecycle management** strategies that balance performance, cost, and compliance.

In other words: **keep your fast storage clean. Let cold data go**. Make room for what matters now.

## Data Mass/Time to process X Probability of data reuse = Business Value

For most data, the probability of data reuse declines exponentially over time. Fresh data generated now has a 100% chance of data use. But the same data set 60 days from now may have fallen to only a ten percent chance of data being accessed. This is a powerful insight.

![Data skew](https://hybridcloud.hpecorp.net/assets/data-scew.png "Data skew")

> *Source: Patent number: 9372636 - Dave Zeryck, Denis Vilfort, June 21, 2016*

Since WAN bandwidth is constant, the data set will take the same amount of time to move, but now has 1/10th the impact on operations. Thus, there comes a point in the data lifecycle where the time to move the data outweighs the risk while the savings of freeing up hundreds of GBs of NVMe storage saves considerable cost in purchasing more storage capacity for that location. Moving data promotes good ROI and lowers operating costs by enabling location-specific special re-use. Data movement can be combined further with data de-duplication and data compression for deep archiving of cold data in a central location while recycling location-specific IT infrastructure and making capacities available for new fresh incoming data. Think of this strategy as “hot edge – cold core”.

## A call to act on data where it lives – Now is the time to evolve

The last decade of data growth hasn't just enabled AI—it's made it inevitable. But it’s also made clear that our old architectures won’t scale. The math is against us: data growth is outpacing our ability to move it, and data gravity is only increasing.

To keep up, we need a compute paradigm that respects the physics of data. That means putting AI where the data is, embracing distributed intelligence, and designing systems that can thrive in a world of fragmented, fast-moving, and increasingly immobile information.

Modern infrastructure gives us the tools. High-performance compute, GPU scaling, NVMe flash, and next-gen networking let us act on data where it lives, unlocking insights without dragging data across expensive networks. And since the business value of a given data set decreases over time, we must modify the impact of data gravity for that data set as it cools, moving it away to make room for new insights.

If your organization is still operating on a centralized data model, now is the time to evolve. The data gravity challenge isn’t going away—it’s only getting stronger. But with the right architecture, strategy, and partners, it’s also an incredible opportunity.

At HPE, we help enterprises rethink their infrastructure to meet this challenge head-on—building **centers of data** that maximize performance, reduce waste, and accelerate decision-making.

Don’t wait. Don’t move your data.

Act on it**—where it lives**.