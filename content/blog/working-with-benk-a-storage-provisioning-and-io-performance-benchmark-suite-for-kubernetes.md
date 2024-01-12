---
title: "Working with Benk: A storage provisioning and IO performance benchmark
  suite for Kubernetes."
date: 2024-01-12T20:03:16.376Z
author: Michael Mattsson
authorimage: /img/portrait-192.jpg
thumbnailimage: /img/benk-some.png
disable: false
tags:
  - kubernetes
  - devops
  - hpe-alletra
  - hpe-nimble-storage
  - hpe-3par-and-primera
---
Recently Hewlett Packard Enterprise published an open source benchmark suite for storage drivers capable of dynamically provisioning persistent volumes to Kubernetes. The suite is called [Benk](https://github.com/hpe-storage/benk) and it is an acronym that plays with the word bench as in benchmark and Kubernetes. Benk is used internally at HPE for mapping performance metrics around the provisioning process itself as well as IO performance. It’s still a bit rough around the edges and not feature complete but it’s still a very useful tool to capture performance across large swaths of configurations with a high degree of automation and repeatability without too much of user attendance.

A few of the features include:

* Highly customizable rendering of Kubernetes resources through kustomize templates
* A simple Kubernetes batch job that manage all the provisioning, decommissioning and benchmarking
* Single configuration file per job that abstracts Kubernetes constructs and IO parameters
* Uses industry standard FIO for filesystem benchmarking
* Easy to build your own output templates using Jinja2 with the rich metrics in JSON format

Let’s walk through a practical example of configuring, running and reporting a benchmark with Benk.

# Prerequisites

At the time of writing, parts of Benk can only be run on Mac and Linux due to a dependency on Bash. It will of course run in WSL on Windows. Besides cloning the [GitHub repository](https://github.com/hpe-storage/benk) with `git`, a recent version of `kubectl` and Python 3.x needs to be installed.

Some pro-efficiency working with scripts, JSON and Kubernetes is helpful to better understand the workflows.

# Hello Benk!

The synopsis section of Benk on GitHub highlights the main steps to run the default job. It’s a good measure stick to understand if the lights come on and determine if the system under test is ready for a more complex job.

Let’s walk through each step and explain as we go along. Descriptions are below the commands unless noted.

```text
git clone https://github.com/hpe-storage/benk && cd benk
```

Cloning and entering the benk directory is now considered your home. Your logs will go into `logs`, your workload configurations are in `kustomize/overlays` and the Jinja2 templates are in `jinja2`.

```text
pip3 install -r requirements.txt
```

This will install the required Python packages for the Benk `outputter.py` script. Python is not required if you don’t intend to render any output and you just want to use Benk for load generation.

```text
cp kustomize/base/config-dist.env kustomize/base/config.env
cp kustomize/base/storageclass-dist.yaml kustomize/base/storageclass.yaml
```

The two “dist” files are the base of your configuration. A `config.env` file that contains information that will be inserted into the `StorageClass` `Secret` reference. While the base configuration is heavily biased towards the HPE CSI Driver for Kubernetes, any storage driver that uses a `StorageClass` for dynamic provisioning for filesystems `Persistent Volume Claims` (PVC) can be used. Using the `storageclass.yaml` to configure your driver and pertinent details is at your discretion. 

```text
kubectl create ns benk
```

All `Namespace` resources will be provisioned into the “benk” `Namespace`.

```text
kubectl apply -k kustomize/overlays/default
kubectl wait -n benk  --for=condition=complete job/benk
```

This will create the default job and wait for it to complete. It runs a 80/20 read/write random 8K workload for 30 seconds on a single replica `Deployment` using a single `PVC`.

```text
kubectl logs -n benk job/benk | jq
```

This will render the log in pretty JSON. The log is pretty substantial and intentionally left out from the blog. An example log entry from the above job is available [on GitHub](https://github.com/hpe-storage/benk/tree/main/jinja2).

There’s also tiny output template provided in the repository `jinja2/example-default.yaml.j2` that pulls some data out of the log file. 

```text
kubectl logs -n benk job/benk | ./src/benk/outputter.py -t jinja2/example-default.yaml.j2 -l-
---
report:
  name: Example YAML template
  logfile: <stdin>
  jobs:
    - threads: 1
      runtime: 49s
      iops: 1258
      bandwidth: 10MB/s
      bs: 8k
```

Now we’ve completed the three corners of running Benk. Configured the environment and a job, ran the job successfully and distilled the results into something human readable for our demonstration.

# The sequencer

The core of Benk for now, is to run preconfigured jobs with kustomize. It may seem a lot of work for very little output. That’s why the repository contain two important scripts, `sequencer.sh` and `sequencer-cluster.sh`. These scripts will help you run multiple jobs and structure the output to create more meaty reports.

First, copy the “default” kustomize directory into eight separate directories.

```text
for i in {1..8}; do cp -a kustomize/overlays/default kustomize/overlays/mytest-${i}; done
```

Now, edit each `config.env` in each directory. I use `vi` to “:wn” myself through the templates.

```text
vi kustomize/overlays/mytest-*/config.env
```

In each iteration, we’ll double `workloadThreads` so we end up with a sequence like 1, 2, 4, 8, 16, 32, 64 and 128. Would it not be useful if we could run these in sequence and report the results in the same template we used previously to understand if the system scales to when adding more threads to the workload? (The entire demo environment runs in virtual machines on decade old hardware, please don’t judge.)

Run the sequence:

```text
./sequencer.sh mytest-
```

What happens here is that the sequencer script will use globbing to find all overlays that has the prefix “mytest-”. Be mindful how you name things to avoid unexpected jobs to be executed.

Next we can use the same report for all the jobs.

```text
./src/benk/outputter.py -l logs/run-mytest-<unique timestamp>.log -t jinja2/example-default.yaml.j2
---
report:
  name: Example YAML template
  logfile: logs/run-mytest-20240111161937.log
  jobs:
    - threads: 1
      runtime: 55s
      iops: 1664
      bandwidth: 13MB/s
      bs: 8k
    - threads: 2
      runtime: 49s
      iops: 3291
      bandwidth: 26MB/s
      bs: 8k
    - threads: 4
      runtime: 48s
      iops: 8044
      bandwidth: 63MB/s
      bs: 8k
    - threads: 8
      runtime: 53s
      iops: 12075
      bandwidth: 94MB/s
      bs: 8k
    - threads: 16
      runtime: 46s
      iops: 16357
      bandwidth: 128MB/s
      bs: 8k
    - threads: 32
      runtime: 51s
      iops: 17284
      bandwidth: 135MB/s
      bs: 8k
    - threads: 64
      runtime: 48s
      iops: 17489
      bandwidth: 137MB/s
      bs: 8k
    - threads: 128
      runtime: 54s
      iops: 18761
      bandwidth: 147MB/s
      bs: 8k
```

We can now observe that we’re seeing diminishing returns by adding more than 16 threads to this workload.

# A/B comparison

A/B testing is something that has gained popularity in human interaction testing for websites. This is also a crucial testing methodology to analyze systems performance by simply changing a single parameter and rerun the exact same test to compare the outcomes. We’re in luck as Benk allows reporting on two log files at once with just a slightly different data structures being fed to the Jinja2 templates.

Let’s change block size for our previous workload example. We’re going to summarize if increasing the block size will increase the bandwidth for the workload.

Change the “workloadBlockSize” to “64k” with the `vi` ceremony.

```text
vi kustomize/overlays/mytest-*/config.env
```

Re-run the sequencer.

```text
./sequencer.sh mytest-
```

We’ll have to use a different template as Jinja2 now has to deal with managing two log files at a time. The syntax for the `outputter.py` script is also slightly different.

```text
./src/benk/outputter.py -a logs/run-mytest-<unique timestamp>.log -b logs/run-mytest-<unique timestamp>.log -t jinja2/example-default-ab.md.j2
```

This report template will summarize the findings in a markdown table, suitable to include in a GitHub pull request or similar to illustrate a certain discovery.

```text
| Threads | A (MB/s) | B (MB/s) | Diff |
| ------- | -------- | -------- | ---- |
| 1       | 13       | 55       | 4.2x |
| 2       | 26       | 106      | 4.1x |
| 4       | 63       | 181      | 2.9x |
| 8       | 94       | 450      | 4.8x |
| 16      | 128      | 661      | 5.2x |
| 32      | 135      | 748      | 5.5x |
| 64      | 137      | 840      | 6.1x |
| 128     | 147      | 833      | 5.7x |
```

Clearly, the performance increases nearly 5x across the board and we also have a discrepancy in the dataset. Which one?

A good exercise for the reader could be to factor in latency in the report to understand the impact, which there will be as performance plateaus when you add more workload usually result in higher latency. How high?

# More sequencers and examples!

There’s also a `sequencer-cluster.sh` script that allows users to orchestrate load generation across multiple clusters attached to one or many storage systems to isolate problems with high concurrency. The possibilities are quite endless.

Learn more about multi-cluster scaling in [the GitHub repository](https://github.com/hpe-storage/benk#multi-cluster-testing).

You'll also find more practical examples in [the GitHub repository](https://github.com/hpe-storage/benk/tree/main/examples) stemming from real world performance testing conducted by the HPE Hybrid Cloud solutions team.

# Summary

This hopefully gets you started on ideas you’d like to build and use cases you want to explore. The possibilities are endless. Bear in mind that Benk is by all means provided as-is and a very early implementation HPE chose to open source to better collaborate with customers and partners to isolate performance bottlenecks with full transparency. Not all advertised features in `config.env` has been implemented yet as an example and the CLI is not completed yet.

HPE invites collaboration and accepts pull requests to Benk on GitHub. The [first issue](https://github.com/hpe-storage/benk/issues/2) discusses a solution on how to collapse initial configuration and reporting into a single intuitive Python CLI.

Let us know what you’re building or have questions. The team behind the tool are available on HPE Developer Community Slack in the #Kubernetes channel. Sign up [here](https://developer.hpe.com/slack-signup) and sign in at [hpedev.slack.com](https://hpedev.slack.com).