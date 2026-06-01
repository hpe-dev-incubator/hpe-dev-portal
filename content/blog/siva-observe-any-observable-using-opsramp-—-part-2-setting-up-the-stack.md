---
title: "Observe any observable using HPE OpsRamp — Part 2: Setting up the stack"
date: 2026-04-17T12:36:31.686Z
featuredBlog: false
author: Balasubramanian Vetrivel
authorimage: /img/balasubramanian-photo-new.jpg
disable: false
tags:
  - OpsRamp
  - Open Telemetry, Otel
  - "Redfish , Jaeger ,Prometheus , Grafana "
---

*Part 2 of a series on vendor-neutral observability with HPE OpsRamp and OpenTelemetry*

---

## Introduction

In [Part 1](https://developer.hpe.com/blog/siva-observe-any-observable-using-opsramp-open-telemetry-as-the-universal-ingestion-standard/), I described the full architecture of the observability stack — five components wired together through open protocols to deliver end-to-end telemetry from a Redfish hardware domain into HPE OpsRamp. Now it is time to build that stack and verify every component before sending a single signal anywhere.

This article covers installation, configuration, and verification of every component in the local stack: [the Redfish emulator](https://github.com/DMTF/Redfish-Interface-Emulator), [OpenTelemetry Collector(OTel)](https://github.com/open-telemetry), [Prometheus](https://github.com/prometheus/prometheus), [Grafana](https://github.com/grafana/grafana), and [Jaeger](https://github.com/jaegertracing/jaeger). I deliberately exclude the HPE OpsRamp configuration from this article — I want to establish that the local stack is fully functional and producing real data before introducing the cloud management plane. That separation of concerns makes troubleshooting dramatically easier.

By the end of this article, you will have a running stack that you can interact with through five different browser UIs and a smoke test that validates every component automatically.

---

## Prerequisites: What you need before starting

Before beginning, you will need an EC2 instance running Ubuntu 22.04 or later with the following:

- At least 4GB RAM and 2 vCPUs (the full stack with all containers needs headroom)
- Docker and Docker Compose installed
- Python 3.11 or later with `uv` package manager
- Ports 3000, 5000, 9090, 16686, 4317, 4318, 8888, 8889, 55679, 13133 open in your security group

I use EC2 Instance Connect in the browser as my terminal throughout this series, so there is no local SSH key management required.

### Installing uv

`uv` is the modern Python package manager I use throughout this project. [uv](https://github.com/astral-sh/uv) is significantly faster than pip and handles virtual environments cleanly.

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
source ~/.bashrc
uv --version
```

### Installing Docker on Ubuntu

If Docker is not already installed, use the convenience script:

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu
newgrp docker
docker --version
docker compose version
```

---

## The project structure

I organize everything under a single directory to keep the two PoC versions isolated from each other.

```bash
~/sivabala/siva-sdk/
├── poc-v1/                    ← original PoC (v1)
│   └── ...
├── poc-v2/                    ← this article's stack
│   ├── docker-compose.yml
│   ├── otel-collector-config.yaml
│   ├── prometheus.yml
│   ├── grafana/
│   │   └── provisioning/
│   │       ├── datasources/
│   │       └── dashboards/
│   └── opsramp-sdk/
│       ├── pyproject.toml
│       └── src/opsramp_sdk/redfish/
│           ├── agent.py
│           ├── event_listener.py
│           ├── opsramp_resources.py
│           └── resource_context.py
├── start-v1.sh
├── start-v2.sh
├── stop-all.sh
└── status.sh
```

I first create the base directory structure:

```bash
mkdir -p ~/sivabala/siva-sdk/poc-v2/opsramp-sdk/src/opsramp_sdk/redfish
mkdir -p ~/sivabala/siva-sdk/poc-v2/grafana/provisioning/datasources
mkdir -p ~/sivabala/siva-sdk/poc-v2/grafana/provisioning/dashboards
mkdir -p ~/sivabala/siva-sdk/poc-v2/grafana/dashboards
```

---

## Component 1: Docker Compose — the orchestration layer

All five local components run in Docker containers managed by a single `docker-compose.yml`. This file defines the services, their relationships, port mappings, and shared network.

```yaml
# docker-compose.yml
services:

  # 1. Redfish emulator — hardware simulation
  redfish-emulator:
    image: dmtf/redfish-interface-emulator:latest
    container_name: redfish-emulator
    ports:
      - "5000:5000"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-sf", "http://127.0.0.1:5000/redfish/v1/"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 15s
    networks:
      - redfish-poc

  # 2. OpenTelemetry Collector — signal processing and routing
  otel-collector:
    image: otel/opentelemetry-collector-contrib:latest
    container_name: otel-collector
    command: ["--config=/etc/otel/config.yaml"]
    volumes:
      - ./otel-collector-config.yaml:/etc/otel/config.yaml:ro
    ports:
      - "4317:4317"    # OTLP gRPC
      - "4318:4318"    # OTLP HTTP
      - "8888:8888"    # Collector self-metrics
      - "8889:8889"    # Prometheus scrape endpoint
      - "55679:55679"  # zpages debug UI
      - "13133:13133"  # health check
    restart: unless-stopped
    depends_on:
      redfish-emulator:
        condition: service_healthy
    networks:
      - redfish-poc

  # 3. Jaeger — distributed trace visualization
  jaeger:
    image: jaegertracing/all-in-one:latest
    container_name: jaeger
    environment:
      - COLLECTOR_OTLP_ENABLED=true
    ports:
      - "16686:16686"  # Jaeger UI
      - "14317:4317"   # OTLP gRPC for Jaeger
    restart: unless-stopped
    networks:
      - redfish-poc

  # 4. Prometheus — metrics storage and remote write
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    command:
      - "--config.file=/etc/prometheus/prometheus.yml"
      - "--storage.tsdb.path=/prometheus"
      - "--web.enable-lifecycle"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus_data:/prometheus
    ports:
      - "9090:9090"
    restart: unless-stopped
    depends_on:
      - otel-collector
    networks:
      - redfish-poc

  # 5. Grafana — local dashboard visualization
  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_ALLOW_SIGN_UP=false
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning:ro
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards:ro
    ports:
      - "3000:3000"
    restart: unless-stopped
    depends_on:
      - prometheus
      - jaeger
    networks:
      - redfish-poc

volumes:
  prometheus_data:
  grafana_data:

networks:
  redfish-poc:
    driver: bridge
```

I start all containers:

```bash
cd ~/sivabala/siva-sdk/poc-v2
sudo docker compose up -d
```

---

## Component 2: OpenTelemetry Collector — the pipeline configuration

The OpenTelemetry (OTel) Collector configuration defines receivers, processors, exporters, and pipelines. I will focus here on the local stack configuration — the HPE OpsRamp exporters are introduced in Part 4.

```yaml
# otel-collector-config.yaml

extensions:
  zpages:
    endpoint: 0.0.0.0:55679
  health_check:
    endpoint: 0.0.0.0:13133
    path: "/health"

receivers:
  # Receives OTLP signals from the Python agent
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

  # Polls Redfish endpoints directly for health metrics
  httpcheck:
    targets:
      - endpoint: http://redfish-emulator:5000/redfish/v1/
        method: GET
      - endpoint: http://redfish-emulator:5000/redfish/v1/Chassis/Chassis-1/Power
        method: GET
      - endpoint: http://redfish-emulator:5000/redfish/v1/Chassis/Chassis-1/Thermal
        method: GET
    collection_interval: 15s

  # Scrapes the Collector's own metrics
  prometheus/self:
    config:
      scrape_configs:
        - job_name: opentelemetry-collector
          scrape_interval: 30s
          static_configs:
            - targets:
                - localhost:8888

processors:
  resource:
    attributes:
      - action: insert
        key: deployment.environment
        value: "redfish-poc-v2"
      - action: insert
        key: resource.type
        value: "RESOURCE"

  batch:
    send_batch_size: 512
    timeout: 5s

exporters:
  debug:
    verbosity: normal

  prometheus:
    endpoint: "0.0.0.0:8889"
    namespace: "redfish"
    send_timestamps: true
    metric_expiration: 3m
    resource_to_telemetry_conversion:
      enabled: true

  otlp/jaeger:
    endpoint: "jaeger:4317"
    tls:
      insecure: true

service:
  extensions: [zpages, health_check]
  pipelines:
    metrics/agent:
      receivers:  [otlp]
      processors: [resource, batch]
      exporters:  [debug, prometheus]
    metrics/httpcheck:
      receivers:  [httpcheck]
      processors: [resource, batch]
      exporters:  [debug, prometheus]
    metrics/self:
      receivers:  [prometheus/self]
      processors: [batch]
      exporters:  [prometheus]
    logs:
      receivers:  [otlp]
      processors: [resource, batch]
      exporters:  [debug]
    traces:
      receivers:  [otlp]
      processors: [resource, batch]
      exporters:  [debug, otlp/jaeger]
  telemetry:
    logs:
      level: warn
```

---

## Component 3: Prometheus — metrics configuration

The `prometheus.yml` configures Prometheus to scrape the OTel Collector's Prometheus exporter endpoint. The `remote_write` section is added in Part 4.

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: "otel-collector"
    static_configs:
      - targets: ["otel-collector:8889"]
    metric_relabel_configs:
      - source_labels: [__name__]
        regex: "redfish_.*"
        action: keep
```

---

## Component 4: Grafana — datasource provisioning

Grafana is pre-configured with Prometheus and Jaeger datasources through provisioning files, eliminating manual setup.

```yaml
# grafana/provisioning/datasources/datasources.yaml
apiVersion: 1
datasources:
  - name: Prometheus
    type: prometheus
    uid: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: true

  - name: Jaeger
    type: jaeger
    uid: jaeger
    access: proxy
    url: http://jaeger:16686
    editable: true
```

---

## Component 5: The Python SDK — project setup

The Python agent uses `uv` for dependency management. The `pyproject.toml` defines all OTel dependencies.

```toml
# opsramp-sdk/pyproject.toml
[project]
name = "opsramp-sdk"
version = "2.0.0"
description = "OpsRamp SDK v2 — OTel-native resource and telemetry ingestion"
requires-python = ">=3.11"
dependencies = [
    "requests>=2.31.0",
    "opentelemetry-api>=1.24.0",
    "opentelemetry-sdk>=1.24.0",
    "opentelemetry-exporter-otlp-proto-grpc>=1.24.0",
    "opentelemetry-instrumentation-requests>=0.45b0",
    "python-dotenv>=1.0",
]

[project.scripts]
opsramp-redfish-agent-v2  = "opsramp_sdk.redfish.agent:main"
opsramp-redfish-events-v2 = "opsramp_sdk.redfish.event_listener:main"
opsramp-redfish-provision = "opsramp_sdk.redfish.opsramp_resources:provision_all_resources"

[build-system]
requires = ["uv_build>=0.10.9,<0.11.0"]
build-backend = "uv_build"

[tool.uv]
package = true

[dependency-groups]
dev = [
    "pytest>=8.0",
    "pytest-timeout>=2.3",
    "python-dotenv>=1.0",
]
```

Install dependencies:

```bash
cd ~/sivabala/siva-sdk/poc-v2/opsramp-sdk
uv sync
```

---

## Environment configuration: The .env file

All credentials and endpoints are stored in a `.env` file that is loaded automatically by each Python module.

```bash
# poc-v2/.env

# HPE OpsRamp endpoints
OPSRAMP_API_URL=https://api.opsramp.com
OPSRAMP_TENANT_ID=<your-tenant-id>

# Resource API credentials (scope: global:manage) — used for provisioning
OPSRAMP_CLIENT_ID=<client-id>
OPSRAMP_CLIENT_SECRET=<client-secret>

# Collector credentials (scope: logs:write, metrics:write) — used by OTel Collector
OPSRAMP_COLLECTOR_CLIENT_ID=<collector-client-id>
OPSRAMP_COLLECTOR_CLIENT_SECRET=<collector-client-secret>

# Redfish emulator
REDFISH_BASE_URL=http://localhost:5000

# OTel Collector
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317

# Agent behaviour
POLL_INTERVAL_SEC=15
LOG_LEVEL=INFO
SKIP_PROVISION=false

# Event listener
EVENT_SIMULATOR_ENABLED=true
SIM_INTERVAL_SEC=30
```

---

## Verification: Confirming every component is healthy

I wrote a comprehensive smoke test that validates every component automatically. Here is how to run it and what to look for:

### Step 1: Verify Docker containers

```bash
sudo docker compose ps
```

Expected output — all five containers running:

```
NAME               STATUS
redfish-emulator   Up (healthy)
otel-collector     Up
jaeger             Up
prometheus         Up
grafana            Up
```

If `otel-collector` shows `Restarting`, check its logs:

```bash
sudo docker logs otel-collector 2>&1 | grep -i error | tail -10
```

The most common issue is an invalid `address:` field in the `telemetry.metrics` section of the collector config. Remove that field if present.

### Step 2: Verify the Redfish emulator

```bash
curl -s http://localhost:5000/redfish/v1/ | python3 -m json.tool | head -10
```

Expected: JSON response with `RedfishVersion`, `Chassis`, `Systems`, `Managers` links.

```bash
# Verify all 13 chassis are present
curl -s http://localhost:5000/redfish/v1/Chassis | \
  python3 -c "import sys,json; d=json.load(sys.stdin); print(f'Chassis count: {d[\"Members@odata.count\"]}')"
```

Expected: `Chassis count: 13`

```bash
# Verify power data for Chassis-1
curl -s http://localhost:5000/redfish/v1/Chassis/Chassis-1/Power | \
  python3 -c "
import sys,json
d=json.load(sys.stdin)
for pc in d.get('PowerControl',[]):
    print(f'Consumed: {pc.get(\"PowerConsumedWatts\")}W')
"
```

### Step 3: Verify the OTel Collector

```bash
# Health check endpoint
curl -s http://localhost:13133/health
```

Expected: `{"status":"Server available"}`

```bash
# zpages pipeline status — shows all active pipelines
curl -s http://localhost:55679/debug/pipelinez | grep -o "pipeline[^<]*" | head -10
```

```bash
# Verify httpcheck metrics are flowing
curl -s http://localhost:8889/metrics | grep "redfish_httpcheck_status" | head -5
```

Expected: Multiple lines with `redfish_httpcheck_status{...} 1` (1 = endpoint up)

### Step 4: Verify Prometheus

```bash
# Check scrape targets are healthy
curl -s http://localhost:9090/api/v1/targets | \
  python3 -c "
import sys,json
d=json.load(sys.stdin)
for t in d['data']['activeTargets']:
    print(f'{t[\"health\"]:10s} {t[\"scrapeUrl\"]}')
"
```

Expected: `up` for all targets.

```bash
# Query httpcheck metrics
curl -s "http://localhost:9090/api/v1/query?query=redfish_httpcheck_status" | \
  python3 -c "
import sys,json
d=json.load(sys.stdin)
print(f'httpcheck series: {len(d[\"data\"][\"result\"])}')
"
```

### Step 5: Verify Grafana

Open `http://<EC2-IP>:3000` in your browser. Log in with `admin` / `admin`.

Navigate to **Connections → Data sources** and verify both Prometheus and Jaeger datasources show a green "Data source connected" status.

### Step 6: Run the automated smoke test

I wrote a comprehensive shell script that validates all endpoints automatically:

```bash
chmod +x ~/sivabala/siva-sdk/poc-v2/smoke-test.sh
bash ~/sivabala/siva-sdk/poc-v2/smoke-test.sh
```

The script checks every component and reports pass/fail with HTTP status codes. A clean stack shows zero failures before starting the agent.

---

## The zpages debug UI: Live pipeline visibility

One of the most useful tools for understanding what the OTel Collector is doing in real time is the zpages debug interface. I added this specifically for demonstration purposes.

Open `http://<EC2-IP>:55679/debug/pipelinez` in your browser. You will see the complete pipeline topology — every receiver, processor, and exporter — with live counters showing signals flowing through each stage.

The key pages are:

- `/debug/pipelinez` — Pipeline status with signal counts
- `/debug/tracez` — Live trace sampling — watch spans arrive in real time
- `/debug/servicez` — Collector version and running extensions
- `/debug/rpcz` — gRPC connection stats from the agent

This is the single best tool for demonstrating the OTel Collector pipeline to an audience because it shows the data moving in real time without requiring any additional tooling.

---

## Browser access summary

After a successful stack startup, you should have access to five browser UIs:

| UI | URL | What it shows |
|----|-----|--------------|
| Redfish API | `http://<EC2-IP>:5000/redfish/v1/` | Raw hardware data |
| zpages | `http://<EC2-IP>:55679/debug/pipelinez` | Live pipeline |
| Grafana | `http://<EC2-IP>:3000` | Dashboards |
| Jaeger | `http://<EC2-IP>:16686` | Trace waterfall |
| Prometheus | `http://<EC2-IP>:9090` | Metrics queries |

---

## Conclusion and what comes next

The local stack is now running and verified. Using the steps above, I now have five healthy containers, a working Redfish emulator producing real hardware data, an OTel Collector routing signals through its pipelines, and Prometheus, Grafana, and Jaeger ready to visualize that data.

Importantly, I have verified each component independently before combining them with the Python agent or HPE OpsRamp. This incremental verification approach is what makes debugging tractable when something goes wrong.

In Part 3, I will introduce two powerful testing tools — `otel-cli` and `promtool` — and show how to use them to test the Redfish emulator, validate the collector pipeline, and trigger test traces manually. These tools let you probe every part of the stack without writing a single line of Python.

Stay tuned to the [HPE Developer Community blog](https://developer.hpe.com/blog/) for more insights on [HPE OpsRamp](https://www.hpe.com/us/en/opsramp.html) (Hybrid Cloud Observability) and practical ideas to apply it in your daily operations.