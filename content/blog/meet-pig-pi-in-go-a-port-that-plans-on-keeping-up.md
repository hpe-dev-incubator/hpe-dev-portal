---
title: "Meet PiG: Pi in Go, a port that plans on keeping up"
date: 2026-09-23T06:30:00.000Z
author: Michael Kinsy
authorimage: /img/img-8cda0090-1177-445f-b844-2eb8574c7830.png
thumbnailimage: /img/thumbnail.png
disable: false
tags:
  - AI
  - Gen-AI
  - LLM
  - Harness
  - Agentic-AI
---
Earlier this year, GitHub announced that Copilot would move to usage-based billing on June 1. Most people using the tool seriously weren't surprised. Once you fan work out across more agents doing more ambitious work, token use climbs by an order of magnitude, and a flat monthly fee starts to look like a subsidy. Copilot's subagent feature in particular made it easy to get huge usage out of one subscription.

I wanted something to show for the last weeks of request-based pricing. My plan was to push a few projects far enough with agents that I could finish them later with fewer and cheaper model calls. One of them was a compiled version of the agent harness I already used every day, the program that connects a model to tools and a terminal.

Soon after the announcement, I committed a 5,903-line scaffold of [Pi](https://github.com/earendil-works/pi) rewritten in Go. Pi helped write it, and within a few days it compiled, ran, and passed its own tests. Getting it to the point where I could rely on it daily took most of May.

By the end of May it had a name, PiG ("Pi in Go"), and it was my daily harness. It has run in production in internal HPE tooling ever since. This week it becomes open source, as a community-owned project sponsored by HPE's Open Source Program Office. PiG isn't officially affiliated with Earendil or the Pi project, but it plans to support upstream in any way it can.

## Why Pi, and why Go

Pi was already my daily harness. I found it while trying to understand how OpenClaw worked and ended up digging into the engine underneath instead. Mario Zechner and the Pi contributors built something small enough to follow. It has an agent loop, a terminal interface, plain session records, support for many model providers, and an extension system for adding whatever the core leaves out. I could see what went into the session and why. Mario's [account of Pi's design](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/) explains the thinking.

I wanted that same harness as a single native binary, with no Node.js requirement and the option to compile my extensions in. The goal was never a different harness. PiG is meant to behave like Pi, and where it doesn't, the difference is either a bug or a documented choice.

For me it came down to Go or Rust, and Go won for practical reasons. We already use it in some internal AI services I work on. Its syntax is small and boring, which helps when you review a lot of generated code. And a harness spends most of its time waiting on model streams, tool processes, and the terminal, which is the kind of concurrency Go handles with less ceremony than most languages. Rust still has a place through the extension SDK, wherever measurements show it's worth the cost of crossing a process boundary.

## From the back of a napkin to a translation system

The original plan could fit on the back of a napkin. Map every TypeScript file to a Go target, have dedicated agents translate, capture Pi's outputs as goldens (reference results to compare against), and fix mismatches until the port matched. Red, green, refactor, repeat.

In one day, nine parallel batches mapped roughly 250 upstream files to Go. The code looked reasonable. The missing behavior was harder to see. Long sessions ran fine for an hour and then slowed to a crawl. The terminal flickered, but only after certain resizes, which is a nice way to add surprise disorientation to your workflow. In terminal extensions, a translation could return the right values while delivering events in the wrong order during cancellation. Everything looked fine until you pressed Ctrl-C at the wrong moment.

So testing became the project. Every upstream file needed a Go target, an explicit deferral, or a reason it didn't apply. I built a comparison runner that gives Pi and PiG the same inputs and compares what comes out. For the terminal, it starts both programs in separate tmux sessions, sends the same keystrokes, and diffs the screens character by character. That caught cursor problems, stale rows, broken overlays, and resize bugs that unit tests walked past.

Then the test system needed tests. A scenario could start both programs, wait for some text, and pass without exercising the behavior it was named for. Custom linters started rejecting scenarios that asserted too little or hid real differences behind loose comparisons. The linters had bugs too. Some of May went to fixing the thing that was supposed to tell me whether everything else was fixed.

I also tried letting another model judge the patches. It was less reliable than the patches, so I removed it. Agents still write code and find problems. Tests, side-by-side comparisons, and a person reading the diff decide what ships.

This process also surfaced issues that sent me to read Pi more deeply, and that reading was some of the most valuable part of the work.

By late May, PiG was the default coding-agent runtime for an internal HPE AI services platform and my own daily driver. I still switch back to Pi sometimes, when I need something the port hasn't caught up on. By June the question had changed from "Can PiG replace Pi?" to "Have I stopped noticing that I switched?"

That left the napkin's last step. "Repeat" turned out to be the hardest one. Pi keeps shipping, and PiG has to follow.

The tooling for that grew into the PiG Porter. It started as a list of which Pi files had a Go counterpart. Then the real Pi harness became the judge, so a PiG test can't pass just by agreeing with PiG. Then each mapping started recording hashes of the files it depends on, so an upstream change reopens exactly the claims it touches.

Now an agent works inside those limits. It reads an upstream change, checks what the real Pi harness does, and proposes a Go change with the test that should prove it. It can't approve its own work, commit, or change the Pi version PiG follows. It still has gaps and is far from airtight, so manual work is still needed. Making it easier for the project to stay current is one of my main engineering goals.

## Piglets

I used to keep a few Pi setups for different jobs, each with its own extensions, skills, model, and prompt. I called them pi-flavors, which I thought was clever (as long as I didn't think too hard about what pie has to do with Pi). The idea turned out to be more useful than the name, and in PiG they became Piglets.

A Piglet is one named agent that is a callable PiG configuration with its extensions, tools, packages, model settings, prompts, and other settings tied to the binary or configuration profile. That makes an agent easy to share, either as a sourced configuration or as a built binary.

When you build a Piglet into a binary, the build records where each piece came from, its hash, and how it runs. Some extensions are fused, meaning bundled directly into the executable. Others run as separate processes or stay external. At startup, the binary checks that record and refuses to run if something is missing or swapped.

This keeps core pig close to Pi. PiG Standard is a separate Piglet that adds login personalization and extra features through ordinary extensions, so the project's default opinions live there, where they can be built on, instead of in the core.

Piglets still are early in implementation but I'd like to take this derivative harness concept as far as I can, and I think it could help with how "agents as applications" get built and distributed.

## Extensions in four languages

PiG can run valid Pi extensions through Node.js and has extension SDKs for Go, Rust, and Python. An author writes a factory function and PiG generates the runner, so there's no process loop or manifest to maintain.

To change an extension, edit it and run `/reload`, just like in Pi. Reload uses the same logic as startup and swaps all extensions or none, so a syntax error in new code leaves your session running.

Running extensions in separate processes costs more than Pi's in-process model in startup time, cancellation, and communication overhead. In return, the core can host four languages without embedding a JavaScript or Python runtime. A Go extension can still be fused into a binary from the same source through a Piglet build, as an optimization, but both modes are required to behave the same. Conformance tests are written to ensure the same behavior through each SDK and cover what's implemented so far.

## Opening the work

PiG is free and open source, community-owned with a core committee, and sponsored by HPE's Open Source Program Office. The public Git history starts later than the project, because PiG grew inside an internal HPE repository and was copied into its new home fresh.

Keeping PiG faithful to Pi is our job, not Pi's. Anything useful we find should go back upstream as a reproducible report, a test, or a fix. If Pi already fits your work, keep using Pi. Try PiG if a native binary, shareable Piglets, or extensions in Go, Rust, or Python solve a problem you have.

I'm one person with a day job, and more work (even just within HPE) depends on PiG every month. If you've run open-source projects and care about governance, releases, security review, documentation, artwork, or community, I'd welcome your help in any capacity.

I'd also like PiG to be a place to learn open source, with scoped work, a real review, and your name on the result. If you run an educational program, student group, or bootcamp, reach out. There's no program to announce yet. There's a repository, a backlog, and an open community.

## What's next

I'll keep writing on the PiG site and cross-post to the [HPE Developer Community](https://developer.hpe.com/blog/) when it fits. Next up are the Porter's evidence tracking, Piglet builds, and extension hosting.

Try [PiG](https://github.com/MichaelKinsy/PiG) on a workload you know well, and tell us where it behaves differently from Pi.

*Image credit: The thumbnail includes an adaptation of the Go gopher, designed by Renee French and licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).*

## Links

* [Pi on GitHub](https://github.com/earendil-works/pi)
* [PiG on GitHub](https://github.com/MichaelKinsy/PiG)
* [Mario Zechner, on Pi's design](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/)
