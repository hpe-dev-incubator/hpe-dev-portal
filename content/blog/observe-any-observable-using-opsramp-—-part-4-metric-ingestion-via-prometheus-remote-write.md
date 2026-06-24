---
title: "Observe any observable using OpsRamp — Part 4: Metric ingestion via
  Prometheus remote write"
date: 2026-06-24T13:37:00.000Z
author: Balasubramanian Vetrivel
authorimage: /img/balasubramanian-photo-new.jpg
disable: false
tags:
  - hpe-opsramp
  - tutorial
  - hybrid-cloud
  - observability
---
*Part 4 of a series on vendor-neutral observability with OpsRamp and OpenTelemetry*

---

## Introduction

In Part 3, I tested the local stack end-to-end using `otel-cli` and `promtool`, confirming that every component of the pipeline works correctly in isolation. Now I am ready to write the actual Python instrumentation code and push real metrics into HPE OpsRamp.

This article covers the complete metric ingestion path: from the Redfish emulator through the Open Telemetry Python SDK (OTel) Python SDK, through the OTel Collector, through Prometheus `remote_write`, and finally into HPE OpsRamp's Metrics Explorer. I will walk through the code in detail — the per-chassis OTel Resource design, the metric instrument definitions, the poll cycle implementation — and then show exactly how to configure Prometheus `remote_write` and verify the configuration in OpsRamp.

The most important design decision in this entire path is one I will return to repeatedly: every metric data point must carry two mandatory attributes — `type="RESOURCE"` and `uuid="<resourceUUID>"` — or OpsRamp will store the metrics without linking them to any managed resource. I will show exactly where in the code these attributes originate, how they propagate, and how to verify they are present.

---

## The metric ingestion architecture

Before diving into code, let me make the complete metric flow clear.
```
Redfish Emulator :5000
      │  HTTP GET /redfish/v1/Chassis/Chassis-1/Power
      │  HTTP GET /redfish/v1/Chassis/Chassis-1/Thermal
      │  HTTP GET /redfish/v1/Systems/System-1
      ▼
agent.py  (OTel Python SDK)
      │  MeterProvider per chassis — Resource carries type + uuid
      │  Gauge instruments: power_consumed_watts, temperature_celsius, fan_rpm, ...
      │  OTLP/gRPC :4317
      ▼
OTel Collector
      │  resource processor: adds deployment.environment, resource.type=RESOURCE
      │  Prometheus exporter :8889
      │  resource_to_telemetry_conversion: enabled  <- promotes Resource attrs to labels
      ▼
Prometheus :9090
      │  remote_write: https://pod7-glp.opsramp.com/...
      │  Authorization: Bearer <oauth2_token>
      │  write_relabel_configs: preserves type and uuid labels
      ▼
OpsRamp Metrics Explorer
      │  Matches type=RESOURCE + uuid=<resourceUUID>
      ▼
Resource Browser → Chassis-1 → Metrics tab
```

The `resource_to_telemetry_conversion: enabled` setting in the collector's Prometheus exporter is critical. Without it, OTel resource attributes (like `type`, `uuid`, `host.name`) remain in the resource scope and are not promoted to Prometheus metric labels. With it enabled, every metric carries all Resource attributes as labels — which is exactly what HPE OpsRamp needs to see.

---

## The resource association design: type and uuid

OpsRamp associates incoming metrics with managed resources using two label values that must be present on every time series:
```
type="RESOURCE"
uuid="5ce1fab8-b706-46bc-8941-47eb32a8f571"
```

The `uuid` value must be the `resourceUUID` that HPE OpsRamp assigned when the resource was created via its REST API. This is not a locally generated UUID — it is the specific identifier HPE OpsRamp uses internally for each managed resource.

I solve this with a module called `resource_context.py` — an in-memory registry that maps each resource hostname to its full identity. Phase 1 (provisioning) populates this registry. Phase 2 (instrumentation) reads from it.

### resource_context.py — the identity registry
```python
# resource_context.py
# Shared in-memory registry: hostname → OpsRamp resource identity
# Ref: https://docs.opsramp.com/integration/opentelemetry/

_registry: dict[str, dict] = {}

def register(
    host_name:    str,
    uuid:         str,   # OpsRamp resourceUUID from POST /resources API response
    ip_address:   str,
    mac_address:  str = "",
    manufacturer: str = "",
    model:        str = "",
    serial:       str = "",
    firmware:     str = "",
    redfish_path: str = "",
) -> None:
    """
    Register a resource after OpsRamp creation.

    Called by opsramp_resources.provision_all_resources() immediately
    after each resource is created and resourceUUID is returned by the API.

    Integration note
    ----------------
    The uuid parameter MUST be the resourceUUID returned by OpsRamp.
    OpsRamp uses this to match incoming OTel signals to managed resources.
    Ref: https://docs.opsramp.com/api/resources/
    """
    _registry[host_name] = {
        "type":            "RESOURCE",  # exactly this string, all caps
        "uuid":            uuid,        # OpsRamp resourceUUID
        "host.name":       host_name,
        "host.ip":         ip_address,
        "host.mac":        mac_address,
        "hw.manufacturer": manufacturer,
        "hw.model":        model,
        "hw.serial_number": serial,
        "hw.firmware":     firmware,
        "redfish.path":    redfish_path,
    }

def as_metric_attrs(host_name: str) -> dict:
    """
    Return attributes for OTel metric instrument.set(value, attrs).

    The returned dict carries type and uuid on every metric data point.
    Prometheus exporter promotes these to metric labels via
    resource_to_telemetry_conversion.
    """
    ctx = get(host_name)
    return {
        "type":      ctx["type"],        # "RESOURCE"
        "uuid":      ctx["uuid"],        # OpsRamp resourceUUID
        "host.name": ctx["host.name"],
        "host.ip":   ctx["host.ip"],
        "host.mac":  ctx["host.mac"],
    }
```

---

## Phase 1: Resource provisioning with opsramp_resources.py

Before any metrics are sent, Phase 1 creates all 34 resources in HPE OpsRamp and populates the ResourceContext registry. I run this once on agent startup.

### REST API flow

The HPE OpsRamp resource creation API requires `global:manage` scope credentials — different from the `logs:write, metrics:write` credentials used by the Collector.

```python
# opsramp_resources.py — core provisioning flow
# Ref: https://develop.opsramp.com/v2/api/resources

def create_or_update_resource(payload: dict) -> str | None:
    """
    Create a resource via HPE OpsRamp REST API.

    HPE OpsRamp returns resourceUUID in the response body:
        {"resourceUUID": "d3878adb-...", "tenantID": "b2ddde6f-..."}

    This UUID is stored in ResourceContext and later attached to
    every OTel signal for resource association.
    """
    resp = requests.post(
        f"{OPSRAMP_API_URL}/api/v2/tenants/{OPSRAMP_TENANT_ID}/resources",
        headers=api_headers(),
        json=payload,
        timeout=10,
    )
    if resp.status_code in (200, 201):
        data        = resp.json()
        resource_id = data.get("resourceUUID") or data.get("id")
        return resource_id
    return None
```

### Building a chassis resource payload

Each chassis is created with full domain attributes including IP address, MAC address, serial number, manufacturer, and custom Redfish-specific attributes.

```python
def build_chassis_resource(chassis_id: str, ip: str) -> dict:
    """
    Build OpsRamp resource creation payload for a Redfish chassis.

    customAttributes carries domain-specific fields that appear in the
    OpsRamp Resource Browser attribute panel for this resource.
    """
    data    = redfish_get(f"/redfish/v1/Chassis/{chassis_id}")
    power   = redfish_get(f"/redfish/v1/Chassis/{chassis_id}/Power")
    thermal = redfish_get(f"/redfish/v1/Chassis/{chassis_id}/Thermal")
    mac     = get_mac_address(f"/redfish/v1/Chassis/{chassis_id}")

    return {
        "hostName":     chassis_id,
        "resourceName": chassis_id,
        "resourceType": "SERVER",
        "ipAddress":    ip,
        "macAddress":   mac,
        "model":        data.get("Model", "Unknown"),
        "serialNumber": data.get("SerialNumber", f"SN-{chassis_id}"),
        "description":  f"Redfish Chassis — {chassis_id}",
        "customAttributes": [
            {"name": "redfishPath",    "value": f"/redfish/v1/Chassis/{chassis_id}"},
            {"name": "chassisType",    "value": data.get("ChassisType", "RackMount")},
            {"name": "manufacturer",   "value": data.get("Manufacturer", "Unknown")},
            {"name": "ipAddress",      "value": ip},
            {"name": "macAddress",     "value": mac},
            {"name": "type",           "value": "RESOURCE"},
            {"name": "environment",    "value": "redfish-poc-v2"},
        ],
    }
```

### Registering the UUID after creation

Immediately after creation, the UUID is registered in ResourceContext:

```python
# In provision_all_resources():
for cid in chassis_ids:
    payload = build_chassis_resource(cid, ip)
    rid     = create_or_update_resource(payload)
    if rid:
        cdata = redfish_get(f"/redfish/v1/Chassis/{cid}")
        mac   = payload.get("macAddress", "")
        rc.register(
            cid,
            uuid=rid,                              # OpsRamp resourceUUID
            ip_address=ip,
            mac_address=mac,
            manufacturer=cdata.get("Manufacturer", ""),
            model=cdata.get("Model", ""),
            serial=cdata.get("SerialNumber", ""),
            redfish_path=f"/redfish/v1/Chassis/{cid}",
        )
```

After this loop completes, ResourceContext holds all 34 UUIDs. Phase 2 can now build OTel resources with real UUIDs.

---

## Phase 2: The OTel agent — per-chassis instrumentation

The agent creates one `MeterProvider` per chassis and one per system. This is the key architectural difference from a naive implementation that uses a single global provider.

### Why per-chassis providers matter

An OTel `MeterProvider` is bound to a single `Resource` object at creation time. Every metric produced by that provider carries the resource attributes — including `host.name`, `type`, and `uuid` — as context. If I use one global provider for all 13 chassis, every metric carries `host.name="Redfish-Server"` and a single UUID. OpsRamp sees all metrics associated with one resource.

With per-chassis providers, each chassis gets its own `host.name="Chassis-1"` and `uuid="d3878adb-..."`. HPE OpsRamp associates each metric with the correct chassis resource.

### Building per-chassis OTel resources

The `make_chassis_resource()` function builds the OTel Resource after Phase 1:

```python
# agent.py
# Ref: https://opentelemetry.io/docs/specs/semconv/resource/

def make_chassis_resource(chassis_id: str, chassis_data: dict) -> Resource:
    """
    Build OTel resource for one chassis.

    IMPORTANT: Called after Phase 1 so ResourceContext has the real HPE
    OpsRamp uuid. The uuid is attached to every metric the resulting
    MeterProvider produces.

    HPE OpsRamp resource association
    ----------------------------
    HPE OpsRamp reads these attributes from OTLP metric payloads and
    Prometheus metric labels (via resource_to_telemetry_conversion) to
    associate signals with the Chassis-N resource in Resource Browser.

    type = "RESOURCE"  <- OpsRamp mandatory
    uuid = "<UUID>"    <- OpsRamp resourceUUID from Phase 1
    """
    ctx = rc.as_otel_resource_attrs(chassis_id)
    return Resource.create({
        # OpsRamp mandatory association attributes
        "type":                   "RESOURCE",
        "uuid":                   ctx.get("uuid", ""),

        # OTel standard host semantic conventions
        # Ref: https://opentelemetry.io/docs/specs/semconv/resource/host/
        "host.name":              chassis_id,
        "host.ip":                ctx.get("host.ip", ""),
        "host.mac":               ctx.get("host.mac", ""),

        # OTel hardware semantic conventions (incubating)
        # Ref: https://opentelemetry.io/docs/specs/semconv/resource/hardware/
        "hw.type":                "chassis",
        "hw.id":                  chassis_id,
        "hw.serial_number":       chassis_data.get("SerialNumber", ""),
        "hw.manufacturer":        chassis_data.get("Manufacturer", "Unknown"),
        "hw.model":               chassis_data.get("Model", "Unknown"),

        # Service identification
        "service.name":           SERVICE_NAME,
        "service.version":        SERVICE_VERSION,
        "service.namespace":      "dmtf",

        # Redfish domain attributes
        "redfish.chassis.id":     chassis_id,
        "redfish.path":           f"/redfish/v1/Chassis/{chassis_id}",

        # Deployment context
        "deployment.environment": "redfish-poc-v2",
    })
```

### Creating per-chassis MeterProviders in main()

```python
# agent.py — main() Phase 2 setup
# Called AFTER provision_all_resources() so ResourceContext has real UUIDs

chassis_meters = {}
for cid in chassis_ids:
    chassis_data = redfish_get(f"/redfish/v1/Chassis/{cid}") or {}

    # Build OTel resource with uuid from ResourceContext
    resource = make_chassis_resource(cid, chassis_data)

    # Each provider is bound to this resource — all its metrics carry
    # type="RESOURCE" and uuid="<chassisUUID>"
    provider = make_meter_provider(resource)
    meter    = provider.get_meter(SERVICE_NAME, SERVICE_VERSION)

    chassis_meters[cid] = make_instruments(meter)

def make_meter_provider(resource: Resource) -> MeterProvider:
    """
    Create a MeterProvider bound to the given resource.

    All metrics from this provider carry the resource's attributes —
    including type and uuid — through OTLP to the Collector and then
    as Prometheus labels via resource_to_telemetry_conversion.

    Ref: https://opentelemetry-python.readthedocs.io/en/stable/sdk/metrics.html
    """
    exporter = OTLPMetricExporter(endpoint=OTLP_ENDPOINT, insecure=True)
    reader   = PeriodicExportingMetricReader(
        exporter,
        export_interval_millis=POLL_INTERVAL_SEC * 1000
    )
    return MeterProvider(resource=resource, metric_readers=[reader])
```

### Metric instrument definitions

I define all metric instruments once per meter. OTel uses `Gauge` instruments for instantaneous readings like power consumption and temperature.

```python
def make_instruments(meter) -> dict:
    """
    Create metric instruments for one chassis or system meter.

    Instrument naming follows OTel semantic conventions where applicable.
    Ref: https://opentelemetry.io/docs/specs/semconv/

    All instruments are Gauge type — appropriate for instantaneous
    physical readings that do not accumulate over time.
    """
    return {
        # Power instruments (Watts)
        "power_consumed_watts": meter.create_gauge(
            "redfish.chassis.power.consumed_watts",
            unit="W",
            description="Total chassis power consumption"
        ),
        "power_capacity_watts": meter.create_gauge(
            "redfish.chassis.power.capacity_watts",
            unit="W",
            description="Chassis power capacity limit"
        ),
        "psu_input_watts": meter.create_gauge(
            "redfish.chassis.psu.input_watts",
            unit="W",
            description="Per-PSU input power"
        ),
        "psu_output_watts": meter.create_gauge(
            "redfish.chassis.psu.output_watts",
            unit="W",
            description="Per-PSU output power"
        ),
        "psu_input_voltage": meter.create_gauge(
            "redfish.chassis.psu.input_voltage",
            unit="V",
            description="PSU line input voltage"
        ),
        # Thermal instruments
        "temperature_celsius": meter.create_gauge(
            "redfish.chassis.thermal.temperature_celsius",
            unit="Cel",
            description="Per-sensor temperature reading"
        ),
        "fan_rpm": meter.create_gauge(
            "redfish.chassis.thermal.fan_rpm",
            unit="RPM",
            description="Per-fan speed"
        ),
        # System instruments
        "memory_gib": meter.create_gauge(
            "redfish.system.memory_gib",
            unit="GiBy",
            description="Total system memory"
        ),
        "processor_count": meter.create_gauge(
            "redfish.system.processor_count",
            unit="1",
            description="Number of processors"
        ),
    }
```

### The poll cycle — collecting and emitting metrics

The `poll_chassis()` function runs every 15 seconds per chassis. It collects power and thermal data from Redfish and records each reading as a gauge value with full resource attributes.

```python
def poll_chassis(chassis_id: str, inst: dict, tracer: trace.Tracer):
    """
    Poll Power and Thermal endpoints for one chassis.

    Every metric data point carries:
        type="RESOURCE"    <- OpsRamp mandatory
        uuid="<UUID>"      <- OpsRamp resourceUUID
        host.name="Chassis-N"
        host.ip="<EC2-IP>"
        host.mac="<MAC>"

    These labels appear in Prometheus after resource_to_telemetry_conversion
    and are forwarded via remote_write to OpsRamp.
    """
    # Get resource context (type, uuid, ip, mac for this chassis)
    ctx = rc.as_metric_attrs(chassis_id)

    with tracer.start_as_current_span("poll.chassis", attributes={
        "chassis.id":    chassis_id,
        "host.name":     chassis_id,
        "type":          "RESOURCE",
        "uuid":          ctx.get("uuid", ""),
    }) as span:

        # Poll Power endpoint
        power = redfish_get(f"/redfish/v1/Chassis/{chassis_id}/Power")
        if power:
            # Base attributes for every metric from this chassis
            attrs = {
                "chassis.id": chassis_id,
                "host.name":  chassis_id,
                "host.ip":    ctx.get("host.ip", ""),
                "host.mac":   ctx.get("host.mac", ""),
                "type":       "RESOURCE",             # OpsRamp mandatory
                "uuid":       ctx.get("uuid", ""),    # OpsRamp resourceUUID
            }

            for pc in power.get("PowerControl", []):
                consumed = safe_float(pc.get("PowerConsumedWatts"))
                capacity = safe_float(pc.get("PowerCapacityWatts"))

                # Record power consumed — carries type + uuid in attrs
                inst["power_consumed_watts"].set(consumed, attrs)
                inst["power_capacity_watts"].set(capacity, attrs)

                span.set_attribute("power.consumed_watts", consumed)

            for psu in power.get("PowerSupplies", []):
                psu_attrs = {
                    **attrs,
                    "psu.id": str(psu.get("MemberId", "0"))
                }
                inst["psu_input_watts"].set(
                    safe_float(psu.get("PowerInputWatts")), psu_attrs)
                inst["psu_output_watts"].set(
                    safe_float(psu.get("PowerOutputWatts")), psu_attrs)
                inst["psu_input_voltage"].set(
                    safe_float(psu.get("LineInputVoltage")), psu_attrs)

        # Poll Thermal endpoint
        thermal = redfish_get(f"/redfish/v1/Chassis/{chassis_id}/Thermal")
        if thermal:
            attrs = {
                "chassis.id": chassis_id,
                "host.name":  chassis_id,
                "host.ip":    ctx.get("host.ip", ""),
                "host.mac":   ctx.get("host.mac", ""),
                "type":       "RESOURCE",
                "uuid":       ctx.get("uuid", ""),
            }

            for sensor in thermal.get("Temperatures", []):
                reading = sensor.get("ReadingCelsius")
                if reading is None:
                    continue
                inst["temperature_celsius"].set(
                    safe_float(reading),
                    {**attrs,
                     "sensor.name": sensor.get("Name", "unknown"),
                     "sensor.id":   str(sensor.get("MemberId", "0"))}
                )

            for fan in thermal.get("Fans", []):
                reading = fan.get("Reading") or fan.get("ReadingRPM")
                if reading is None:
                    continue
                inst["fan_rpm"].set(
                    safe_float(reading),
                    {**attrs,
                     "fan.name": fan.get("Name", "unknown"),
                     "fan.id":   str(fan.get("MemberId", "0"))}
                )
```

---

## Prometheus remote_write configuration

With metrics flowing from the agent through the collector into Prometheus, the final step is configuring Prometheus to push them to HPE OpsRamp via `remote_write`.

### Setting up remote_write in OpsRamp

Before configuring `prometheus.yml`, I need to set up the remote_write integration in HPE OpsRamp:

1. Navigate to **Setup → Integrations → +ADD**
2. Search for **Prometheus** and select it
3. OpsRamp generates a `remote_write` endpoint URL and credentials
4. Copy the endpoint URL — it follows the pattern:
   `https://<tenant>.opsramp.com/api/v2/metric-ingest/prometheus/remote-write`

The credentials for `remote_write` use the same OAuth2 client credentials as the Collector, with `metrics:write` scope.

### prometheus.yml with remote_write

```yaml
# prometheus.yml

global:
  scrape_interval: 15s
  evaluation_interval: 15s
  # External labels are added to every time series sent via remote_write.
  # These help HPE OpsRamp identify the source of the metrics.
  external_labels:
    deployment_environment: "redfish-poc-v2"
    source: "prometheus-remote-write"

scrape_configs:
  - job_name: "otel-collector"
    static_configs:
      - targets: ["otel-collector:8889"]
    # Keep only Redfish metrics from the collector scrape
    metric_relabel_configs:
      - source_labels: [__name__]
        regex: "redfish_.*"
        action: keep

# HPE OpsRamp remote_write configuration
# Ref: https://docs.opsramp.com/integration/prometheus/
remote_write:
  - url: "https://<your-tenant>.opsramp.com/api/v2/metric-ingest/prometheus/remote-write"

    # OAuth2 authentication
    # Scope required: metrics:write
    oauth2:
      client_id: "<collector-client-id>"
      client_secret: "<collector-client-secret>"
      token_url: "https://pod7-glp.opsramp.com/tenancy/auth/oauth/token"

    # Queue configuration — tune for latency vs throughput
    queue_config:
      max_samples_per_send: 1000
      max_shards: 5
      capacity: 10000

    # Write relabel configs — filter and preserve labels for HPE OpsRamp
    write_relabel_configs:
      # Keep only Redfish agent metrics and httpcheck metrics
      - source_labels: [__name__]
        regex: "redfish_.*|otelcol_.*"
        action: keep

      # Ensure type and uuid labels are preserved
      # These are critical for OpsRamp resource association
      - source_labels: [type]
        regex: "RESOURCE"
        action: keep
        # If type label is missing, the metric still flows but won't associate
        # to a resource — it appears in OpsRamp as an unassociated metric
```

Apply the updated `prometheus.yml` without restarting:

```bash
curl -X POST http://localhost:9090/-/reload
```

---

## Verifying metric ingestion in HPE OpsRamp

After the agent runs for at least one poll cycle and Prometheus pushes via remote_write, verify metrics appear in HPE OpsRamp.

### Verify in Prometheus first

```bash
# Confirm power metrics are in Prometheus with type and uuid labels
curl -s "http://localhost:9090/api/v1/query" \
  --data-urlencode 'query=redfish_chassis_power_consumed_watts' | \
  python3 -c "
import sys, json
d = json.load(sys.stdin)
results = d['data']['result']
print(f'Total time series: {len(results)}')
for r in results[:3]:
    labels = r['metric']
    print(f\"  chassis: {labels.get('chassis_id','?')}\")
    print(f\"  type:    {labels.get('type','MISSING')}\")
    print(f\"  uuid:    {labels.get('uuid','MISSING')}\")
    print(f\"  value:   {r['value'][1]} W\")
    print()
"
```

Expected output for each chassis:

```
chassis: Chassis-1
type:    RESOURCE
uuid:    d3878adb-037f-4c43-adaa-65fccfdb0fa8
value:   250.0 W
```

If `type` or `uuid` show as `MISSING`, the ResourceContext was not populated before the agent built its OTel resources. This means provisioning (Phase 1) did not complete successfully, or `SKIP_PROVISION=true` was set and the registry is empty.

### Verify remote_write is sending

```bash
# Check remote_write queue stats
curl -s http://localhost:9090/api/v1/query \
  --data-urlencode 'query=prometheus_remote_storage_samples_total' | \
  python3 -c "
import sys,json
d=json.load(sys.stdin)
for r in d['data']['result']:
    print(f\"  {r['metric'].get('url','?')[:50]}: {r['value'][1]} samples sent\")
"
```

### Verify in HPE OpsRamp Metrics Explorer

Navigate to **OpsRamp → Metrics Explorer** and search for:

```
metric name: redfish_chassis_power_consumed_watts
filter:      type = RESOURCE
```

You should see 13 time series — one per chassis — each associated with a managed resource. Click on any series to see the full label set including `type`, `uuid`, `host_name`, `chassis_id`, and all other labels promoted by `resource_to_telemetry_conversion`.

### Verify resource association in the Resource Browser

Navigate to **Infrastructure → Resources** and search for `Chassis-1`. Click the resource and select the **Metrics** tab. You should see the power and thermal metrics for that specific chassis, time-correlated with any alerts on the same resource.

This is the payoff: HPE OpsRamp is now able to correlate metrics with resources, display them in the resource context, and apply its AIOps capabilities on top.

---

## Troubleshooting: Common issues and fixes

**`uuid` label is empty in Prometheus**

The most common cause is that `agent_resource` was built at module import time before Phase 1 completed. The fix is to ensure `_make_agent_resource()` is called inside `main()` after `provision_all_resources()` returns. In the code I built for this PoC, `agent_resource: Resource = None` is a placeholder at module level — it is replaced inside `main()` after Phase 1.

**`type` label missing from metrics**

Check that `resource_to_telemetry_conversion: enabled: true` is set in the Prometheus exporter section of `otel-collector-config.yaml`. Without this, resource attributes stay in the resource scope and do not appear as Prometheus labels.

**remote_write 401 errors**

The `remote_write` credentials need `metrics:write` scope. Verify the client ID being used has this scope by checking the token:

```bash
curl -s -X POST "https://pod7-glp.opsramp.com/tenancy/auth/oauth/token" \
  -d "grant_type=client_credentials" \
  -d "client_id=<your-client-id>" \
  -d "client_secret=<your-client-secret>" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('scope',''))"
```

Expected: scope includes `metrics:write`.

**Metrics visible in Prometheus but not in HPE OpsRamp**

Check the `write_relabel_configs` section. If the filter is too restrictive, some metrics may be dropped before reaching OpsRamp. Temporarily remove the `write_relabel_configs` section to confirm all metrics flow through, then re-add the filters.

---

## Conclusion and what comes next

I have now built the complete metric ingestion path — from Redfish hardware data through the OTel Python SDK, through the OTel Collector, through Prometheus remote_write, and into HPE OpsRamp's Metrics Explorer with full resource association.

The key insight from this article is that resource association requires precise coordination across three layers: Phase 1 provisioning creates the resources and captures their UUIDs, ResourceContext propagates those UUIDs to the OTel instrumentation layer, and `resource_to_telemetry_conversion` ensures they appear as Prometheus labels that HPE OpsRamp can match.

In the next article I will cover log and event ingestion — a different path that goes directly from the OTel Collector to HPE OpsRamp's log endpoint via OTLP/gRPC, carrying per-resource association through a different mechanism: per-host `LoggerProvider` instances that attach the correct `type` and `uuid` to every log record at the resource level rather than the attribute level.

Stay tuned to the HPE Developer Community [blog](https://developer.hpe.com/blog/) for more insights on HPE OpsRamp (Hybrid Cloud Observability) and practical ideas to apply it in your daily operations.
