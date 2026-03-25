---
title: Integrating Dagster as a modern data orchestration framework in HPE
  Private Cloud AI
date: 2026-03-25T16:14:15.611Z
author: Guoping Jia
authorimage: /img/guoping.png
disable: false
---
HPE Private Cloud AI provides a curated set of pre‑integrated orchestration and machine‑learning frameworks—including Airflow, Kubeflow, and Ray—to streamline the development and operationalization of AI workloads. In this environment, Dagster can be introduced as an additional, asset‑centric data orchestration framework that complements the existing toolchain rather than replacing it. Its modular architecture and cloud‑native design allow it to integrate cleanly with the platform’s services, offering teams a flexible option for managing data pipelines, lineage, and reproducibility when their workflows benefit from Dagster’s modern approach to data‑centric orchestration.

Dagster is a modern, developer‑focused data orchestration platform used to build, run, and monitor data pipelines and data assets. It’s widely used by data engineering and analytics teams to make pipelines more reliable, observable, and maintainable.

What Dagster Actually Does

* Orchestrates data pipelines — schedules, runs, and monitors workflows.
* Manages data assets — treats each dataset or model as a first‑class object with dependencies.
* Improves reliability — strong typing, built‑in testing, and clear lineage help prevent silent failures.
* Provides observability — you can see what ran, what failed, and why.
* Supports AI/ML, analytics, ETL/ELT — works well with warehouses, ML pipelines, and reverse‑ETL.

### Why Dagster?

Dagster introduces an asset‑centric orchestration model that aligns well with the needs of modern data and AI pipelines. Unlike traditional task‑based schedulers, Dagster treats datasets, models, and intermediate outputs as first‑class assets with explicit lineage and dependency tracking. This approach provides clearer visibility into how data flows across the platform, simplifies debugging, and improves reproducibility—key requirements for enterprise‑grade AI workloads. Dagster’s strong typing, modular pipeline definitions, and built‑in testing capabilities also support software‑engineering best practices, enabling teams to develop, validate, and evolve their pipelines with greater confidence. When integrated into HPE Private Cloud AI, 

Dagster complements existing frameworks by offering a more data‑centric orchestration option for teams that prioritize lineage, observability, and maintainability.

Dagster is a modern data orchestration framework built around the concept of data assets. Instead of thinking in terms of tasks, Dagster encourages teams to model their pipelines as interconnected datasets with clear lineage and dependencies. It offers strong developer‑friendly features such as type‑checking, local development tools, built‑in testing, and rich observability. This makes it especially well‑suited for modern data stacks involving dbt, cloud warehouses, and machine‑learning workflows.

Airflow is a mature, widely adopted workflow scheduler that organizes pipelines as Directed Acyclic Graphs (DAGs) composed of tasks. It excels at traditional ETL, batch processing, and cron‑like scheduling, supported by a large ecosystem of operators and community extensions. While powerful and battle‑tested, Airflow’s task‑centric model can make local development, testing, and asset‑level lineage more challenging compared to newer orchestration tools.

In summary, Dagster and Airflow both orchestrate data pipelines, but they approach the problem from different angles. Dagster focuses on data assets, developer experience, and modern observability, making it ideal for contemporary analytics and ML environments. Airflow remains a strong choice for teams needing a stable, task‑based scheduler with a long history and broad integration ecosystem. The best choice depends on whether your workflows are more asset‑driven or task‑driven.

Integration Architecture

Integrating Dagster into HPE Private Cloud AI leverages the platform’s modular, Kubernetes‑native design, allowing Dagster to operate as an additional orchestration service alongside existing components such as Airflow, Kubeflow Pipelines, and Ray clusters. Dagster’s deployment typically consists of a set of containerized services—including the Dagster daemon, web UI, and user code deployments—that run within the platform’s Kubernetes environment. These services interact with HPE Private Cloud AI’s storage, compute, and networking layers through standard interfaces, enabling Dagster to orchestrate pipelines that span data ingestion, transformation, model training, and inference workloads. By using the platform’s built‑in support for container registries, secrets management, and persistent storage, Dagster can be integrated with minimal friction, ensuring that pipelines remain portable, reproducible, and aligned with enterprise operational standards.

### Prerequisites

Before starting, make sure you have the following:

* A K8s cluster, being provisioned in HPE GreenLake for Private Cloud Enterprise
* The *kubectl* CLI tool, together with the kubeconfig file for accessing the K8s cluster

### Set up Harbor as a local image registry

![](/img/harbor.png)

![](/img/harbor-user.png)

### Build and push Dagster user code image

![](/img/harbor-pacidemo-user-code.png)

### Deploy Dagster framework

![](/img/pcai-tools-frameworks-import-framework.png)

![](/img/import-framework-dagster.png)

![](/img/dagster.png)

![](/img/dagster-overview.png)

![](/img/dagster-deployment.png)

![](/img/harbor-audit-logs.png)

```shell
$ kubectl create ns cfe-games
namespace/cfe-games created
 
$ kubectl apply -f super-mario/ -n cfe-games
deployment.apps/mario-deployment created
service/mario-service created
 
$ kubectl apply -f tetris/ -n cfe-games
deployment.apps/tetris-deployment created
service/tetris-service created
```

### Conclusion

This blog post offers you a comprehensive guide on 

Please keep coming back to the [HPE Developer Community blog](https://developer.hpe.com/blog/) to learn more about HPE GreenLake for Private Cloud Enterprise and get more ideas on how you can use it in your everyday operations.