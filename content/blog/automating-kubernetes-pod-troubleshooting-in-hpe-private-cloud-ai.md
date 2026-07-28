---
title: Automating Kubernetes Pod troubleshooting in HPE Private Cloud AI
date: 2026-07-24T10:25:00.000Z
author: Guoping Jia
authorimage: /img/guoping.png
disable: false
tags:
  - "HPE Private Cloud AI "
  - Kubernetes
  - Pods
  - Import Framework
  - Slack
  - Slack Webhook URL
  - "  Helm chart "
  - Istio VirtualService
  - Kyverno ClusterPolicy
---
[HPE Private Cloud AI (PCAI)](https://developer.hpe.com/platform/hpe-private-cloud-ai/home/) runs large‑scale AI and machine learning (ML) workloads on an underlying Kubernetes (K8s) cluster with a large number of K8s Pods executing long‑lived, resource‑intensive jobs continuously. Due to K8s' inherently ephemeral design, Pod restarts are common and expected. However, some Pod restarts can disrupt long‑running training jobs, interrupt inference services, or degrade data-processing pipelines, making it essential to understand the cause of each Pod restart event proactively. Ensuring reliability at PCAI scale requires early visibility into every restart event so engineering teams can detect anomalies quicly and remediate issues before they impact AI workloads. Although K8s provides native diagnostics, node conditions, event streams, and Pod-level status, engineers must manually run the same sequence of commands for each restart event, a workflow that does not scale in PCAI's large cluster environment where workloads are long-running, compute-intensive, and highly sensitive to interruptions. 

This blog post introduces an automated restart‑analysis pipeline designed to eliminate this manual operational burden. Whenever a Pod restarts, the system automatically triggers the Pod info collector, gathers node conditions, Pod events, and contextual signals, and publishes a structured diagnostic report directly to *Slack*. Engineers receive immediate, actionable insight without running a single command. This automation improves observability on the PCAI cluster, accelerates root‑cause identification, and reduces manual overhead, ensuring PCAI workloads remain stable, predictable, and easier to support. 

### The mystery behind every Pod rstart

In large Kubernetes environments, Pod restarts are unavoidable. They can be triggered by memory pressure, transient node instability, failing liveness or readiness probes, application crashes, or simply the platform’s normal reconciliation behavior. Most of the time, these restarts are harmless. But in AI‑ and data‑intensive platforms like HPE Private Cloud AI, even a single unexpected restart can ripple across the system — slowing long‑running training jobs, interrupting inference services, or degrading user‑facing performance.

The real challenge isn’t that Pods restart. It’s understanding why they restart, and doing it quickly enough to prevent small issues from escalating into major incidents. At scale, this becomes a tedious, error‑prone routine: engineers jumping between kubectl commands, combing through logs, checking events, and trying to reconstruct what happened moments before the restart. Multiply that by dozens or hundreds of Pods, and the operational burden becomes overwhelming.

Fortunately, this entire troubleshooting workflow can be automated using existing tooling. This blog post outlines one such automation pipeline built around k8s‑pod‑restart-info-collector — an open‑source utility that quietly solves a noisy problem. Developed by the Airwallex engineering team, it acts as a dedicated watchdog for Pod restarts, automatically capturing the full story behind each event and delivering it straight to your Slack workspace.

At its core, the project is a custom Kubernetes controller powered by the client‑go library. It continuously watches Pod lifecycle changes through the Kubernetes API, and the moment a restart occurs, it springs into action. The controller gathers everything an engineer would normally hunt down manually: restart reasons, timestamps, logs, events, and other contextual signals that explain why the Pod restarted and what happened immediately beforehand.

Once collected, the tool formats these insights into a clean, structured report and posts it to your chosen Slack channel. The result is a lightweight, automated observability loop that keeps teams informed without dashboards, polling, or guesswork — delivering automatic detection, automatic collection, and automatic visibility for every Pod restart.

where reliability and fast diagnosis are critical. With thousands of K8s Pods running long-lived, resource-intensive jobs, such as training pipelines and inference services, distributed across more than a hundred clusters, even small disruptions can impact  or data processing jobs. Because Kubernetes Pods are inherently ephemeral, restart events are common and can be triggered by memory pressure (e.g., OOMKilled), CPU contention, probe failures, infrastructure instability, or application level crashes.

The real challenge is not that Pods restart — it’s understanding why they restart at PCAI scale.
Although Kubernetes provides built in commands to inspect node conditions, events, and Pod level diagnostics, engineers must manually run the same sequence of commands for every restart event. This becomes especially inefficient in PCAI environments where AI workloads are long running, resource intensive, and sensitive to interruptions. Tools like k8s pod info collector help gather node and Pod context, but the workflow still requires manual execution and interpretation.

This repetitive troubleshooting loop slows down incident response and increases operational overhead for our engineering teams.

(may move it to the below section late) The blog details how the automation works, how it leverages existing open‑source tooling, and how it transforms Pod troubleshooting in HPE Private Cloud AI.

To address this, we developed an automated approach that integrates with PCAI’s existing Kubernetes infrastructure. Instead of requiring engineers to fetch diagnostics manually, our system automatically detects each Pod restart event and uses k8s pod info collector to gather node status, Pod events, and relevant context. The collected information is then published directly to Slack, giving engineers immediate visibility into the root cause without running a single command.

This automation reduces manual effort, accelerates troubleshooting, and significantly improves observability coverage across PCAI clusters — ensuring that AI workloads remain stable, predictable, and easier to support.
In this blog post, we walk through how this automation works, how it leverages existing open source tooling, and how it transforms Pod troubleshooting in HPE Private Cloud AI.

### Prerequisites

Ensure that the following prerequisites are fulfilled:

* HPE Private Cloud AI version 1.5.0 or later, running HPE AI Essentials version 1.9.1 or later.
* Access to an HPE Private Cloud AI workspace (with the Private Cloud AI Administrator role), allowing to perform administrative operations.
* Slack app, Webhook URL and a Slack channel.

The deployment examples in the following sections use the kubectl CLI and kubeconfig to display deployment details in the PCAI Kubernetes (K8s) cluster for illustration purposes only. Direct cluster access via kubectl is generally not required, as the full framework setup can be completed through the Import Framework UI.

### Configure a Slack channel and Webhook URL

Slack is a cloud-based collaboration platform that brings people, information, and tools together in a single workspace. It enables teams to communicate through organized channels, collaborate in real time, and quickly access shared conversations, documents, and decisions.

In the HPE Private Cloud AI environment, Slack channels provide immediate visibility into pod restart events, including restart reasons, logs, and Kubernetes events. By centralizing critical operational insights and alerts, Slack enables teams to identify issues faster, collaborate more effectively, and accelerate troubleshooting and resolution, ultimately improving operational efficiency and platform reliability.

If you don’t already have a Slack account, you can create one by following Slack’s [*Getting Started* guide](https://slack.com/intl/en-in/help/categories/360000049043-Getting-started).

In this blog post, I’m using my HPE Slack account and its associated workspace, *'HPE'*, as the environment for hosting the Slack channel and the Slack Webhook URL, along with the workspace’s API token.

Below are the details of the Slack channel, *pcai-pod-monitoring*, created in the workspace *HPE*, along with its associated Webhook URL.

![](/img/slack-webhook-url.png)

Run the following *curl* command to post a test message to the Slack channel via its configured Slack Webhook URL.

```shell
$ curl -X POST -H 'Content-type: application/json' --data '{"text":"Hello, PCAI Pod monitor!"}' https://hooks.slack.com/services/<hidden>
```

After running the command, the text *'Hello, PCAI Pod monitor!'* is posted to the Slack channel *\#pcai-pod-monitoring*.

![](/img/pcai-pod-monitoring-hello.png)

### Deploy Pod restart info collector using the Import Framework

Based on the official [K8s Pod restart info collector Helm charts](https://github.com/airwallex/k8s-pod-restart-info-collector/tree/master/helm) maintained by *Airwallex*, a revised version, available in the GitHub repository *['pcai-helm-examples'](https://github.com/GuopingJia/pcai-helm-examples/tree/main/pod-restart-collector)*, provides HPE Private Cloud AI compatible deployment configurations. This updated Helm chart includes the required Istio *VirtualService* and Kyverno *ClusterPolicy* manifests to ensure alignment with PCAI’s service mesh and policy controls. Prior to deployment, update the configuration values for *clusterName*, *slackWebhookUrl*, and *slackChannel* to match the target PCAI cluster and Slack settings of your environment.

Follow the steps below to deploy the Pod restart info collector *'PodCollect'* into HPE Private Cloud AI using the *Import Framework*.   

* In the PCAI left navigation panel, select **Tools & Frameworks**. Click ***Import Framework***.

![](/img/pcai-tools-frameworks-import-framework.png)

* By following the Import Framework wizard workflow, *PodCollect* can be deployed into the PCAI environment within minutes.

![](/img/tools-frameworks-import-podcollect.png)

* Run the following *kubectl* commands to verify the *PodCollect* deployment in the namespace 'podc' of the PCAI K8s cluster.

```shell
$ kubectl get all -n podc
NAME                              READY   STATUS    RESTARTS   AGE
pod/podcollect-66dff44cb8-gdc5h   1/1     Running   0          95m

NAME                         READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/podcollect   1/1     1            1           4h9m

NAME                                    DESIRED   CURRENT   READY   AGE
replicaset.apps/podcollect-66dff44cb8   1         1         1       95m
replicaset.apps/podcollect-778547dcc9   0         0         0       4h9m
replicaset.apps/podcollect-b68c587b7    0         0         0       97m
```

![](/img/tools-frameworks-podcollect.png)

### Demonstrate Pod restarts through memory stress testing

To validate the capabilities of the deployed Pod restart collector, a test K8s pod was created and placed under memory pressure using *polinux/stress*, a lightweight utility that generates synthetic CPU, memory, I/O, and other system workloads. By increasing the Pod's memory consumption beyond its available resources, the test triggered K8s to terminate and restart the Pod as expected. This controlled scenario effectively demonstrated the collector’s ability to detect pod restart events, capture relevant diagnostic information, and publish the results to Slack, enabling faster troubleshooting and operational analysis under realistic failure conditions.

The following YAML manifest defines the test K8s Pod. 

```shell
[root@ai-cluster ~]# cat oom-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: oom-demo
spec:
  containers:
  - name: oomkilled-demo
    image: polinux/stress
    resources:
      requests:
        memory: "100Mi"
      limits:
        memory: "200Mi"
    command: ["stress"]
    args: ["--vm", "1", "--vm-bytes", "250M", "--vm-hang", "1"]
```

Type the following command to deploy the Pod *'oom-demo'* to the namespace *'podc'*. 

```shell
# kubectl apply -f oom-pod.yaml -n podc
pod/oom-demo created
```

After a brief period in the *'Running'* state, the deployed Pod *'oom-demo'* transitions to *'CrashLoopBackOff'* and then is *OOMKilled*. K8s restarts the Pod, which encounters the same out-of-memory (OOM) condition and is *OOMKilled* again. This cycle repeats continuously, causing the *RESTARTS* count to increase over time. 

```shell
# kubectl  get pods -n podc -w
NAME                          READY   STATUS             RESTARTS     AGE
oom-demo                      0/1     CrashLoopBackOff   1 (3s ago)    10s
oom-demo                      0/1     OOMKilled          2 (18s ago)   25s
oom-demo                      0/1     CrashLoopBackOff   2 (12s ago)   36s
oom-demo                      1/1     Running            3 (25s ago)   49s
oom-demo                      0/1     OOMKilled          3 (26s ago)   50s
oom-demo                      0/1     CrashLoopBackOff   3 (13s ago)   62s
oom-demo                      0/1     OOMKilled          4 (44s ago)   93s
oom-demo                      0/1     CrashLoopBackOff   4 (14s ago)  107s
...
```

The alert *'Pod restarted'* was sent to the Slack channel *'pcai-pod-monitoring'*, showing the Pod name *oom-demo* and its namespace *podc*.

![](/img/pcai-pod-monitoring-oom-demo.png)

Click ***Show more***, a detailed Slack alert message is shown, including *Reason*, *Pod Status*, *Pod Events*, *Node Status and Events*, and *Pod Logs Before Restart*.

![](/img/pcai-pod-monitoring-oom-demo-details.png)

The Pod Restart Collector deployment uses the default value of the *muteSeconds* parameter (i.e., 600 seconds / 10 minutes) to suppress duplicate Pod restart alerts within the configured mute window. Once the 10-minute mute interval expires, a new Pod restart alert is sent to the Slack channel.

![](/img/pcai-pod-monitoring-oom-demo-10m.png)

Click ***Configure*** on the *PodCollect* tile under *Tools & Frameworks* to modify the Pod collector configuration. You can customize various parameters, such as *watchedPodNamePrefixes*, to monitor a specific set of Pod name prefixes within your AI workload.

![](/img/tools-frameworks-podcollect-config.png)

```shell
# kubectl delete pod oom-demo -n podc
pod "oom-demo" deleted
```

### Conclusion

This blog post explored the pre-curated orchestration toolchain available within PCAI and introduced *Dagster* as a modern, asset-centric framework that can be integrated seamlessly into the HPE Private Cloud AI environment via the *Import Framework*. When deployed alongside existing orchestration services such as *Airflow*, *Kubeflow*, and *Ray*, *Dagster* operates as an additional, fully compatible orchestration layer within PCAI. Its modular architecture and clear separation between infrastructure and user code allow all user-defined pipeline definitions to be deployed and executed locally within the HPE Private Cloud AI environment, ensuring strong data sovereignty guarantees. By aligning naturally with PCAI's service model and operational patterns, *Dagster* enriches the platform with a clean, asset-oriented orchestration approach that enhances pipeline reliability while remaining fully compliant with PCAI’s security and governance expectations.

As the pod exceeded its available resources, Kubernetes terminated and restarted it as expected. This scenario provided a realistic way to verify that k8s-pod-restart-info-collector accurately detected the restart event and captured the relevant diagnostic information needed for troubleshooting and analysis.

Please keep coming back to the [HPE Developer Community blog](https://developer.hpe.com/blog/) to learn more about HPE Private Cloud AI and get more ideas on how you can use it in your everyday operations.
