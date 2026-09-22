---
title: "Meet PiG: Pi in Go, a port that plans on keeping up"
date: 2026-09-23T06:30:00.000Z
author: Michael Kinsy
authorimage: /img/img-8cda0090-1177-445f-b844-2eb8574c7830.png
thumbnailimage: /img/thumbnail.png
disable: false
tags:
  - Gen-AI
  - LLM
  - Harness
  - Agentic-AI
---
Earlier this year, GitHub announced that Copilot would move to usage-based billing on June 1st. People were upset but not surprised. It was more of a surprise, if we look back at some of the numbers, how it took so long in the first place for something to change. \
\
Once people started to fan out and parallelize/scale work in different ways, token use climbed by an order of magnitude, and a flat monthly fee was no longer feeling like a product but a flat out public subsidy. We also can't forget Copilots' subagent tool could be leveraged for essentially infinite model requests, which I'm sure didn't help.

I wanted to spend the final days of Copilots' broken pricing model as efficiently as possible, to me that would be developing as many impactful things to a point that after the subsidy was gone. Then I'd be fine to use less and  just cheaper AI to get them across the finish line. I landed on a few things worthwhile one of which, was a version of the harness I already enjoyed in a native binary for performance and portability.

Soon after the announcement I committed a 5,903-line scaffold of [Pi](https://github.com/earendil-works/pi) rewritten in Go. Pi even helped write it, then within essentially a few days it compiled and seemed to work on surface level and its 'tests'. By the end of May it had a name, PiG ("Pi in Go"), and it was my daily coding-agent harness. Today it is the default agent runtime for multiple internal HPE AI services, dev-tooling, and as of this week is open source. PiG is not a affiliated Earendil/Pi work, but hopes to support the upstream in any way possible.

## Why Pi, and why Go

Pi was already my daily harness by spring, so the first half of this is short. I found it while trying to understand what OpenClaw was doing under the hood, and could not stop reading the engine underneath it.

Mario Zechner and the Pi contributors built something I could actually follow. Pi was a dead simple agent loop, a terminal interface, plain session records, provider portability, and a rich extension system. I understand exactly what the harness was doing when I was using it, the minimalism that could be seen as restraint to some, is the point. Mario's [account of Pi's design](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/) explains the thinking better than I can.

I wanted to port Pi to a compiled language so I could have a single binary and even have my extensions compiled in, with no runtime to install first for them either.  I wanted to avoid requiring Node for the base runtime and simplify native distribution, while also improving resource utilization and performance.

I looked at options but in the end my decision came down to Go or Rust, which I went back and forth on. I  ultimately decided on Go as we used Go for some of our internal AI service I work on (same with many cloud services that might use something like this), Go's syntax is also so small and boring that it suits agentic coding, especially for reviewing a lot of code. Also often the agent harness is a supervisor waiting on a model stream, tool subprocess, and so on doing that for dozens of things at once. Go language features fit that shape with very little ceremony as well. I also lay out later how Rust is still available through the extension SDKs for the operations where performance actually matters, if the numbers over IPC favor it, and I expect they will for some.



## From the back of a napkin to a translation system

The first plan fit on the back of a napkin. I assumed this meant it was elegant. Map every upstream TypeScript file to a Go target. Let agents translate as much as they could. Run Pi and its tests to generate goldens, then having Pi also port all interfaces and the same terminal interactions in a red, green, refactor, and repeat fashion.

Quickly nine non-overlapping batches audited roughly 250 upstream files and mapped them to Go. That produced a lot of code very quickly that also produced omissions, and the omissions were the worst kind as one would expect from AI. They looked completely reasonable right up until the missing behavior mattered. Long sessions would run fine for an hour and then performance would quietly fall off a cliff. The terminal flickered on redraw only in a certain terminal pane resize or specific output sequence out of the blue, which is a great way to find out how frequently you blink. The worst of it lived in the interprocess boundary for TUI extensions, where a translation could return the right values while delivering events in the wrong order during cancellation, and everything looked fine until you hit Ctrl-C at the wrong moment. Those were the bugs that meant understanding what Pi and my code was actually doing instead of what the translated file said it did.

I did attempt to maintain the automation/structured porting process throughout and continued to improve my agentic translator assistant. There was a port map that was the denominator, every tracked upstream file needed a Go target, an explicit deferral, or a reason it did not apply. I also built a black-box differential runner that fed Pi and PiG the same stimulus and compared everything that came out between the two. TUI testing I felt needed something more, so I had the runner launched both programs in isolated tmux sessions, sent the same keystrokes, captured each screen as a grid of characters, and diffed the grids. That helped the porting agent to catch a lot of the cursor errors, resize problems, stale rows, broken overlays, and input handling that many tests missed. I also developed custom linters that helped catch translation anti-patterns discovered over time and more quickly verify where specific problems and gaps were within the port for the agent.

Mario had written that March about slowing down with coding agents, in saltier language than I get to use here. This for me was a good opportunity, as every mismatch sent me back to read Pi more carefully, and those deeper dives were also what became beneficial for me. As I started giving PiG real work, daily use found the next layer of gaps, and each one became a parity scenario, a stronger comparison, a lint rule, and so on.

By nearly the end of May (about a month at this point), the harness was to a point it could be leveraged within an internal HPE AI services platform as its default coding-agent runtime. By then PiG had also replaced Pi for my own daily work (as long as I was up to date otherwise somedays I'd switch while the port caught up), and the question had changed. In April it was "Can PiG replace Pi for this workload?" By June it was "Can I stop noticing that I switched?" Developers in other HPE teams have since run it on their own workloads and contributed fixes as their usage exposed things mine missed.

Which left the napkin's last step. "Repeat" turned out to be the hardest one. Pi keeps changing and the project is purposefully bound to its improvements, and so this process was not something that was going to be escaped. The maintenance side grew the same way the testing side did, one gap at a time, until it was a system that I call the PiG Porter which has just continued to harden the agentic porting process.

## Piglets: one agent, declared once, carried anywhere

PiG, just like Pi, can auto-discover, install, and define many different components of the harness. A Piglet selects and scopes those resources for one named agent definition that can be invoked by name. It can also define tool scope within extensions (or mcp if that is supported via an extension), discovery policy, model scopes, system prompts, environment requirements, and other settings.

Building a Piglet produces an executable plan rather than an unqualified list of paths. The Piglet release records resource origins, digests, the target, whether each executable component is fused, subprocess-hosted, or external. Direct binary startup verifies the recorded closure before model, session, or tool work begins. It does not replace a selected extension with an arbitrary same-named program from PATH or ambient Package discovery.

Stock pig provides the product-neutral runtime and builder. PiG Standard is a separate Piglet composition that selects branding, login identity, and additional capabilities through ordinary extensions. Building that composition produces the "standard" PiG as of now with more opinions/divergences.

A Piglet Binary is target-native but not necessarily completely self-contained. Compatible Go factories can fuse into it. Other components can use prebuilt subprocess runners, a recorded runtime environment, or external services. When a Piglet requires fused realization, every selected extension must be a compatible Go factory and the build fails instead of falling back. Piglet Images have a defined artifact contract, but the image builder is not implemented yet.

What Piglets unlock, at least in my head, is treating PiG as a pipeline/starting-point for building agents as apps. A base Piglet is the basis of narrower ones, each tuned for one job, sharing the foundation without another fork of the harness. This gives a base harness for the project that stays as faithful to Pi as possible, and a growing set of purpose-built agents on top of it, built by people who understand their own domains better than I do.

## Extensions in four languages, one contract

 PiG can run compatible Pi extensions through its Node path and provides extension SDKs for Go, Rust, and Python. An author writes factory functions and PiG generates the runner. There is no extension side main loop required and no manifest to maintain.

Extensions register their capabilities when they start, and PiG checks that the identity the running extension reports. That closes a failure I have hit before where the plugin system metadata says one thing and the loaded code does another. It also helps the development loop remain to just editing code. Add/edit an extension, `/reload`, done. `/reload` uses the same resolver as startup and swaps the whole extension set atomically; if a replacement fails, the working set stays live. A syntax error in your extension does not take down the session you were in the middle of.

The trade: stock PiG hosts extensions across a process boundary, and that costs more than Pi's in-process model in startup, cancellation, reloads, and IPC. What it buys is language independence with no embedded JavaScript/python runtime or dynamic Go plugin loading. A Go factory can still be fused for delivery, and the fused form is required to behave like the subprocess form, so the extension source never needs two implementations. You get the safer subprocess loop while developing and a native executable when you ship. Cross-SDK conformance tests exercise the real transport to keep the four languages honest with each other. I do think there is still a lot more work and things that can be done to take both PiG's extension system and Piglet derivative harnesses further.

## Opening the work

PiG is a community-owned with a core committee, free and open-source project sponsored by HPE. I want people to inspect it, fork it, and build on top of it. I am also an advocate for open harness ecosystems as they are critical for applied AI advancement, and would rather have the scrutiny and potential contributions from the broader community. The public Git history starts later than the project did, as PiG grew inside a proprietary HPE mono-repo with many commits referring to internal HPE IP and therefore was copied into the new repository completely fresh.

Pi remains the behavioral contract, and following it is the projects responsibility. I think agents have made something newly practical here, an upstream project can keep exploring and setting behavior while a downstream implementation follows specific releases under different distribution constraints, and neither has to slow down for the other. That only works if useful findings travel back through Pi's normal contribution routes as reproducible reports, tests, documentation, or fixes, and that is the flow I intend to promote. If Pi already fits your work, keep using Pi. Try PiG if a native Go build, named Piglet composition, or a multi-language extension host solves a problem you have.

I am one person with a day job and a passion for the project, and I have been lucky enough to do both at once for a while now. PiG is continuing to grow in being used within internal HPE AI systems and development flows across teams, and therefore needs to continue to be hardened as more reliance builds on it, hardening operationally as well not just technically. If you have experience in open-source or other relevant projects/roles before and have interest in governance, planning, artwork, releases, security review, documentation, or community leadership I welcome others to establish responsibility/ownership within the project to help its long term success.

I would also like PiG to be a place where someone can learn how open source and software contribution works. Letting learning engineers pick up a scoped piece of work, get a real review, and see their name on the result of a project being used by companies and other people. If you run an educational program, a student group, a bootcamp, or anything else that wants a project to learn on, reach out. I do not have a program to announce. I have a repository, a backlog, and an open mind. Two of those are better organized.

I will keep writing on the PiG site, and cross-post from here when a piece fits the HPE Developer Community. Next up more of the deeper details like the PiG Porter correspondence and evidence tracking system, Piglets, and extension hosting.

Try [PiG](https://github.com/MichaelKinsy/PiG) out for yourself, tell us where it behaves differently, what interrupts you, and what would make it worth keeping. I am looking forward to how the community can help take the project further.

*Image credit: The thumbnail includes an adaptation of the Go gopher, designed by Renee French and licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).*

## Links

* [Pi on GitHub](https://github.com/earendil-works/pi)
* [PiG on GitHub](https://github.com/MichaelKinsy/PiG)
* [Mario Zechner, on Pi's design](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/)
