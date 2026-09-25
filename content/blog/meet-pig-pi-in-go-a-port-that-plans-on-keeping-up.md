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
Earlier this year, GitHub [announced](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/) that Copilot would move to usage-based billing on June 1. Most people using the tool seriously weren't surprised. Once you fan work out across more agents doing more ambitious work, token use climbs by an order of magnitude, and a flat monthly fee starts to look like a subsidy. Copilot's subagent feature in particular made it easy to get huge usage out of one subscription.

I wanted something to show for the last weeks of request-based pricing. My plan was to push a few projects far enough with agents that I could finish them later with fewer and cheaper model calls. One of them was a compiled version of the agent harness I already used every day, the program that connects a model to tools and a terminal.

Soon after the announcement, at the end of April, I committed a 5,903-line scaffold of [Pi](https://github.com/earendil-works/pi) rewritten in Go. Pi helped write it, and within a few days it compiled, ran, and passed its own tests. Getting it to the point where I could rely on it daily took most of May.

By the end of May it had a name, PiG ("Pi in Go"), and it was my daily harness. It has run in production in internal HPE tooling ever since. This week it becomes open source, as a community-owned project sponsored by HPE's Open Source Program Office. PiG isn't officially affiliated with Earendil or the Pi project, but it plans to support upstream in any way it can.

![A timeline: GitHub Copilot moves to usage-based billing on June 1; then five steps. Scaffold, a first Go skeleton written with Pi's help. It compiles, and runs and passes its own tests. Daily driver. Production, in internal HPE tooling. Open source, following Pi release by release. The first four steps are the author's account and have no public record.](/img/timeline.png)

*From a scaffold to a daily driver, to production, and now to open source.*

## Why Pi, and why Go

Pi was already my daily harness. I found it while trying to understand how OpenClaw worked and ended up digging into the engine underneath instead. Mario Zechner and the Pi contributors built something small enough to follow. It has an agent loop, a terminal interface, plain session records, support for many model providers, and an extension system for adding whatever the core leaves out. I could see what went into the session and why. Mario's [account of Pi's design](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/) explains the thinking better than I do here.

I wanted that same harness as a single native binary, with no Node.js requirement and the option to compile my extensions in. The goal was never a different harness. PiG is meant to behave like Pi, and where it doesn't, the difference is a bug.

![Pi runs as an npm package, @earendil-works/pi-coding-agent, on the Node.js runtime. PiG packages the same agent loop, terminal UI, sessions, providers, and extensions as one native binary, pig. It needs Node.js only to run TypeScript extensions and Python only for Python extensions.](/img/runtime.png)

*The same harness, packaged as one native binary.*

The repository publishes its own startup and memory measurements in [docs/evals](https://github.com/MichaelKinsy/PiG/blob/main/docs/site/docs/evals.md). On its last run (Linux x86_64, 1 CPU, 10 runs), `pig --version` had a median of 21.5 ms against 300.3 ms for Pi 0.87.1, and peak memory was 24.6 MiB against 101.5 MiB.

For me it came down to Go or Rust, and Go won for practical reasons. We already use it in some internal AI services I work on. Its syntax is small and boring, which helps when you review a lot of generated code. And a harness spends most of its time waiting on model streams, tool processes, and the terminal, which is the kind of concurrency Go handles with less ceremony than most languages. Rust still has a place through the extension SDK, wherever measurements show it's worth the cost of crossing a process boundary.

## From the back of a napkin to a translation system

The original plan could fit on the back of a napkin. Map every TypeScript file to a Go target, have dedicated agents translate, capture Pi's outputs as goldens (reference results to compare against), and fix mismatches until the port matched. Red, green, refactor, repeat.

In one day, nine parallel batches mapped roughly 250 upstream files to Go. The code looked reasonable. The missing behavior was harder to see. Long sessions ran fine for an hour and then slowed to a crawl. The terminal flickered, but only after certain resizes, which is a nice way to add surprise disorientation to your workflow. In terminal extensions, a translation could return the right values while delivering events in the wrong order during cancellation. Everything looked fine until you pressed Ctrl-C at the wrong moment.

So testing became the project. Every upstream file needed a Go target, an explicit deferral, or a reason it didn't apply.

![Five statuses, one per upstream file: ported, partial, not started, deferred, and not applicable.](/img/portmap.png)

*Every upstream file has a row and a status.*

For interactive testing I built a comparison runner that gives Pi and PiG the same inputs and compares what comes out. For the terminal, it starts both programs in separate tmux sessions, sends the same keystrokes, and compares the screens. Most scenarios compare a region of the screen exactly, some including colors; others compare it after normalizing whitespace. That caught cursor problems, stale rows, broken overlays, and resize bugs that unit tests walked past.

![Pi and PiG receive the same keystrokes, /tree, Enter, Up, Enter, from the scenario compaction/03-branch-summarize-via-tree. In each program's screen the same region is compared; line 5 differs, so the scenario fails and the diff is saved. Scenarios are grouped by feature.](/img/runner.png)

*The comparison runner. Both programs get identical keystrokes; if the compared part of the screen differs, the scenario fails and the diff is saved.*

Then the test system needed tests. A scenario could start both programs, wait for some text, and pass without exercising the behavior it was named for. Custom linters started rejecting scenarios that asserted too little or hid real differences behind loose comparisons. The linters had bugs too. Some of May went to fixing the thing that was supposed to tell me whether everything else was fixed.

I also tried letting another model judge the patches. It was less reliable than the patches, so I removed it. Agents still write code and find problems. Tests, side-by-side comparisons, and a person reading the diff decide what ships.

This process also surfaced issues that sent me to read Pi more deeply, and that reading was some of the most valuable part of the work.

By late May, PiG was the default coding-agent runtime for an internal HPE AI services platform and my own daily driver. I still switch back to Pi sometimes, when I need something the port hasn't caught up on. By June the question had changed from "Can PiG replace Pi?" to "Have I stopped noticing that I switched?"

That left the napkin's last step. "Repeat" turned out to be the hardest one. Pi keeps shipping, and PiG has to follow.

The tooling for that grew into the PiG Porter. It started as a list of which Pi files had a Go counterpart. Then the real Pi became the judge: comparison scenarios run the pinned Pi next to PiG, so a scenario passes only when both programs agree. Then each piece of evidence started recording hashes of the upstream source, tests, and fixtures it depends on, so an upstream change reopens only the claims it touches.

Now an agent, the Porter, is being built to work inside those limits. It's meant to read an upstream change, check what the real Pi does, and propose a Go change with the test that should prove it. It doesn't approve its own work, commit, or change the Pi version PiG follows; a person does. It still has gaps and is far from airtight, so manual work is still needed. Making it easier for the project to stay current is one of my main engineering goals.

![A five-step loop. 1, Pi releases: a maintainer moves the pinned Pi version. 2, claims reopen: stored hashes reopen only the evidence an upstream change touches. 3, Porter proposes, in progress and dashed: a Go change and the test meant to prove it; it proposes only and a person decides. 4, Pi is the judge: tests check against Pi's source, and the runner compares both programs. 5, a person merges once tests and the comparisons pass. A loop returns to step 1 for the next release.](/img/porter.png)

*How PiG follows each Pi release. The agent proposes; Pi judges; a person merges.*

## Piglets

I used to keep a few Pi setups for different jobs, each with its own extensions, skills, model, and prompt. I called them pi-flavors, which I thought was clever (as long as I didn't think too hard about what pie has to do with Pi). The idea turned out to be more useful than the name, and in PiG they became Piglets.

A Piglet is one named agent: a PiG configuration that names its extensions, skills, built-in tools, packages, model settings, and system prompt. That makes an agent easy to share, either as a sourced configuration or as a built binary. Install one with `pig piglet add npm:<package>` or `pig piglet add git:<repo>`, publish yours to npm or GitHub Releases, and keep installed Piglets current with `pig piglet update`

`pig piglet build` produces a Piglet Binary which is the Piglet's package and individual components such as a agent configurations extensions, skills, prompts, MCP server definitions, and model settings, all compiled into one executable. You can build one binary per target OS and CPU. Go extensions are fused in, meaning bundled directly into the executable, and Rust extensions ship prebuilt inside it. A binary is a single self-contained file unless it depends on something that must be supplied where it runs, such as a Python extension and a Python runtime. The build records where each extension came from, its hash, and how it runs. Piglet Binaries are signed. At startup, before any model call, the binary checks its signature and that record, and refuses to run if the record or its Piglet file was altered, or if a built-in extension is missing or unexpected.

![Packages carry extensions, skills, prompts, themes, agents, and MCP definitions. A Piglet, here named review, is one named agent with extensions, skills, built-in tools, a model, and a system prompt. It runs from source with pig --piglet review, or builds with pig piglet build review --format binary --out ./review into a Piglet Binary, one per target OS and CPU. The binary records each extension, its hash, and how it runs; the example rows and hashes are illustrative. A Go extension is fused, a Rust one runs as a packed subprocess, and a Python one runs as a subprocess supplied at the target. It runs if the record matches and refuses if something is altered or missing; the check runs at startup before model calls, catches missing or swapped pieces, and isn't a signature. A dashed group, in progress, shows sharing and updating Piglets: pig publish to npm and GitHub Releases, pig update for installed Piglets, and an automatically indexed npm catalog on the PiG platform site. It is one self-contained file unless something must be supplied where it runs.](/img/06-piglet.png)

*A Piglet selects extensions, skills and tools. The binary form is signed, records every extension, and checks both before it starts.*

This keeps core pig close to Pi. PiG Standard is a separate Piglet that adds login personalization and extra features through ordinary extensions, so the project's default opinions live there, where they can be built on, instead of in the core.

With signing, publishing and updates in place, I'd like to take this derivative harness concept as far as I can. I think something like this could help grow or inspire how more "agents as applications" are built and distributed , especially when thinking of security, traceability, and portability.

## Extensions in four languages

PiG runs Pi's TypeScript extensions with Node.js 22.13 or newer. They run together in one Node process, as they do in Pi, and Pi's packages are provided by compatibility modules, so extensions written against Pi's extension API work, while code that builds a whole agent session through Pi's SDK functions doesn't yet. PiG also has extension SDKs for Go, Rust, and Python. An author writes a factory function and PiG generates the runner, so there's no process loop or manifest to maintain. Go, Rust, and Python extensions written as factories share one process per language; each keeps its own socket.

![Inside pig, or a Piglet Binary, the agent loop and terminal UI sit beside the extension host, which gives every extension one contract. Fused Go extensions are compiled into a Piglet Binary and run inside pig, exchanging the same messages over an in-memory pipe with no socket and no separate process; changing one means rebuilding the binary, and only Piglet Binaries fuse. A Piglet Binary fuses every Go factory it can. Separate processes cover Pi extensions in TypeScript or JavaScript, run unchanged by Node.js with one Node process each, and Go, Rust, and Python factories whose runner PiG generates; factories in the same language share one process. Separate processes use a local socket, one per extension. A Piglet is designed to mix both kinds, and a Go extension's source is the same either way.](/img/07-host.png)

*Two ways to run, one contract. Separate processes talk over a local socket; fused Go extensions are compiled into a Piglet Binary and run in-process.*

Here's the same `/hello` command in each language. The TypeScript version is an ordinary Pi extension.

![Four cards. TypeScript runs on Node.js in its own process. Go runs in a shared process, or fused in a Piglet Binary. Rust runs in a shared process and is compiled on first run. Python runs in a shared process and needs Python. In each, typing /hello Bob shows Hello, Bob!](/img/fourlangs.png)

*One command, four languages, the same result. Every snippet below was run in pig.*

```ts
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  pi.registerCommand("hello", {
    description: "Say hello",
    handler: async (args, ctx) => {
      ctx.ui.notify(`Hello, ${args || "world"}!`, "info");
    },
  });
}
```

```go
package hello

import (
	sdk "github.com/MichaelKinsy/PiG/extensions/sdk"
)

func Extension() *sdk.Extension {
	e := sdk.New("hello")

	e.Command("hello", "Say hello",
		func(ctx sdk.Context, args string) error {
			if args == "" {
				args = "world"
			}
			ctx.Notify("Hello, "+args+"!", "info")
			return nil
		})

	return e
}
```

```rust
use pig_sdk::{CommandResult, Extension};

pub fn new_extension() -> Extension {
    let mut ext = Extension::new("hello");
    ext.command("hello", "Say hello", |ctx, args: &str| {
        let name = if args.is_empty() { "world" } else { args };
        ctx.notify(&format!("Hello, {name}!"), "info");
        CommandResult::Ok
    });
    ext
}
```

```python
import pig_sdk


def new_extension() -> pig_sdk.Extension:
    ext = pig_sdk.Extension("hello")

    def hello(ctx, args):
        ctx.notify(f"Hello, {args or 'world'}!", "info")

    ext.command("hello", "Say hello", hello)
    return ext
```

Go and Rust extensions are compiled on your machine the first time and cached, so they need Go or cargo; a Piglet Binary ships them prebuilt. PiG runs on macOS, Linux and Windows, and extensions work on all three.

![Diagram: the pig process, containing the agent loop, terminal UI and extension host, connects over one Unix socket per extension to six processes: two Node processes for two TypeScript extensions, a Go process hosting two Go extensions, a Go process for one standalone extension, a Rust process and a Python process. A side panel explains that if the shared Go process crashes, both of its extensions stop, pig keeps running, and /reload restarts them in separate processes. Extension names are examples.](/img/09-session.png)

*TypeScript extensions share one Node process, as in Pi, while Go, Rust, and Python factories share one process per language, and every extension keeps its own socket. If a shared process crashes, only its extensions stop, and pig restarts them.*

If an extension's process crashes, the crash stays there. pig restarts it and tells you, and your session and every other extension keep running.

To change an extension, edit it and run `/reload`, just like in Pi. Each extension is loaded on its own: if one fails, for example with a syntax error, it's dropped and listed under "Extension issues", the others load normally, and your session keeps running. At startup, a broken extension stops pig with a "Failed to load extension" error and a hint to start with `pig -ne`, as Pi does.

![Typing /reload loads each extension on its own. hello and lint load; bye fails with a syntax error. The loaded extensions are hello and lint, and bye is listed under Extension issues as bye.ts: Failed to load extension. The session keeps running. At startup, a broken extension instead stops pig with Failed to load extension and the hint Start without extensions using pig -ne.](/img/10-reload.png)

*/reload loads each extension on its own. One that fails is dropped and listed under Extension issues; the rest load, and your session keeps running.*

Running extensions in separate processes costs more than Pi's in-process model: startup time, memory (TypeScript extensions share one Node process, as in Pi), and a round trip for every event an extension listens to. In return, the core can host four languages without embedding a JavaScript or Python runtime.

A Piglet Binary compiles every Go factory extension into itself. They run inside pig and exchange the same messages as everywhere else, over an in-memory pipe instead of a socket. Rust extensions in a Piglet Binary still run as separate processes (the binary carries them prebuilt), and Python extensions need Python where the binary runs. Fused and separate-process Go extensions are meant to behave the same, and the conformance tests are starting to check fused Go too. Those tests run the same extension through the Go, TypeScript, Rust, and Python runtimes and check that they behave the same for transports, tool calls, streaming, terminal input, and more.

![Three cards show the same Go factory function running alone in its own process with its own socket, packed into a shared process where it still has its own socket, and fused into a Piglet Binary where it runs inside pig over an in-memory pipe.](/img/11-gomodes.png)

*Write a Go extension once. Stock pig runs it in a separate process, alone or shared, and a Piglet Binary compiles it in.*

## Opening the work

PiG is free and open source, community-owned with a core committee, and sponsored by HPE's Open Source Program Office. The public Git history starts later than the project, because PiG grew inside an internal HPE repository and was copied into its new home fresh.

Keeping PiG faithful to Pi is our job, not Pi's. Anything useful we find should go back upstream as a reproducible report, a test, or a fix. If Pi already fits your work, keep using Pi. Try PiG if a native binary, shareable Piglets, or extensions in Go, Rust, or Python solve a problem you have.

I'm one person with a day job, and more work (even just within HPE) depends on PiG every month. If you've run open-source projects and care about governance, releases, security review, documentation, artwork, or community, I'd welcome your help in any capacity.



I'd also like PiG to be a place to learn open source, with scoped work, a real review, and your name on the result. If you run an educational program, student group, or bootcamp, reach out. There's no program to announce yet. There's a repository, a backlog, and an open community.

## What's next

I'll keep writing on the PiG site and cross-post to the [HPE Developer Community](https://developer.hpe.com/blog/) when it fits. Next up: signed Piglets, publishing Piglets to npm and GitHub with `pig update`, and a package catalog.

![Three columns. Extension hosting ships Go, Rust, Python, and TypeScript extensions; per-extension /reload, like Pi; macOS, Linux and Windows; and packed cells, one process per language. Piglets ship source builds with --format script, binary builds with --format binary, and one binary per OS and CPU; in progress are signing, publishing to npm and GitHub with pig update, and a package catalog. Porter evidence tracking ships hash-bound evidence that reopens on change; end-to-end upgrade proposals are in progress. Solid boxes ship today; dashed boxes tagged In progress are being built now.](/img/12-roadmap.png)

*What is shipping today, and is coming soon.*

Try [PiG](https://github.com/MichaelKinsy/PiG) on a workload you know well, and tell us where it behaves differently from Pi.

*Image credit: The thumbnail includes an adaptation of the Go gopher, designed by Renee French and licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).*

## Links

* [Pi on GitHub](https://github.com/earendil-works/pi)
* [PiG on GitHub](https://github.com/MichaelKinsy/PiG)
* [Mario Zechner, on Pi's design](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/)
