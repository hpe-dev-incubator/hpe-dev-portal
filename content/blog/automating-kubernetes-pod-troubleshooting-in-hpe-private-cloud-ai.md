---
title: Automating Kubernetes Pod restart troubleshooting in HPE Private Cloud AI
date: 2026-07-29T09:39:00.000Z
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
[HPE Private Cloud AI (PCAI)](https://developer.hpe.com/platform/hpe-private-cloud-ai/home/) runs large‑scale AI and machine learning (ML) workloads on an underlying Kubernetes (K8s) cluster with a large number of K8s Pods executing long‑lived, resource‑intensive jobs continuously. Due to K8s' inherently ephemeral design, Pod restarts are common and expected. However, some Pod restarts can disrupt long‑running training jobs, interrupt inference services, or degrade data-processing pipelines, making it essential to understand the cause of each Pod restart event proactively. Ensuring reliability at PCAI scale requires early visibility into every restart event so engineering teams can detect anomalies quickly and remediate issues before they impact AI workloads. Although K8s provides native diagnostics, node conditions, event streams, and Pod-level status, engineers must manually run the same sequence of commands for each restart event, a workflow that does not scale in PCAI's large cluster environment where workloads are long-running, compute-intensive, and highly sensitive to interruptions. 

This blog post introduces an automated restart‑analysis pipeline designed to eliminate this manual operational burden. Whenever a Pod restarts, the system automatically triggers the Pod info collector, gathers node conditions, Pod events, and contextual signals, and publishes a structured diagnostic report directly to *Slack*. Engineers receive immediate, actionable insight without running a single command. This automation improves observability on the PCAI cluster, accelerates root‑cause identification, and reduces manual overhead, ensuring PCAI workloads remain stable, predictable, and easier to support. 

### The mystery behind every Pod restart

In large K8s environments, Pod restarts are unavoidable. They can be triggered by memory pressure, transient node instability, failing liveness or readiness probes, application crashes, or simply the platform’s normal reconciliation behavior. Most of the time, these restarts are harmless. But in AI and data intensive platforms like HPE Private Cloud AI, even a single unexpected Pod restart can ripple across the system, slowing long‑running training jobs, interrupting inference services, or degrading user‑facing performance.

The real challenge is not that Pods restart, but understanding why they restart at PCAI scale and doing so quickly enough to prevent small issues from becoming major incidents. At scale, this becomes a tedious, error‑prone routine: engineers jumping between *kubectl* commands, combing through logs, checking events, and trying to reconstruct what happened moments before the restart. Multiply that by dozens or hundreds of Pods, and the operational burden becomes overwhelming.

Fortunately, this entire troubleshooting workflow can be automated using existing tooling. This blog post outlines one such automation pipeline built around an existing open-source tool, called *k8s‑pod‑restart-info-collector*. After deploying it into PCAI via *Import Framework*, the tool acts as a dedicated watchdog for Pod restarts, automatically capturing the full story behind each event and delivering it straight to your Slack channel. This automation reduces manual effort, accelerates troubleshooting, and significantly improves observability coverage across PCAI clusters, ensuring that AI workloads remain stable, predictable, and easier to support.

### Pod restart information collector

[k8s-pod-restart-info-collector](https://github.com/airwallex/k8s-pod-restart-info-collector) is an open-source K8s troubleshooting tool developed by [Airwallex](https://www.airwallex.com/). Implemented as a K8s *custom controller* using the [client-go](https://github.com/kubernetes/client-go) library, this tool continuously monitors Pod lifecycle changes through the K8s API and automatically captures diagnostic data whenever a Pod restart is detected. Instead of requiring engineers to manually gather logs, events, exit codes, timestamps, and runtime context from multiple sources, the controller collects and consolidates this information into a structured report and delivers it directly to a designated Slack channel. By providing immediate visibility into Pod restart causes and surrounding conditions, the tool transforms Pod restarts from isolated signals into actionable operational insights, helping platform and SRE teams accelerate root cause analysis, reduce troubleshooting effort, and identify recurring reliability issues across large-scale K8s environments.

The following sections describe how to leverage an existing open-source solution by deploying *k8s-pod-restart-info-collector* within HPE Private Cloud AI and integrating it with a dedicated Slack channel. This approach builds on PCAI's existing K8s infrastructure to automate Pod restart diagnostics and accelerate troubleshooting.

### Prerequisites

Ensure that the following prerequisites are fulfilled:

* HPE Private Cloud AI version 1.6.0 or later, running HPE AI Essentials version 1.9.1 or later.
* Access to an HPE Private Cloud AI workspace (with the Private Cloud AI Administrator role), allowing to perform administrative operations.
* Slack app, Webhook URL and a Slack channel.

The deployment examples in the following sections use the *kubectl* CLI and kubeconfig to display deployment details in the PCAI K8s cluster for illustration purposes only. Direct cluster access via *kubectl* is generally not required, as the full framework setup can be completed through the Import Framework UI.

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

### Deploy Pod restart info collector via *Import Framework*

Based on the official [K8s Pod restart info collector Helm charts](https://github.com/airwallex/k8s-pod-restart-info-collector/tree/master/helm) maintained by *Airwallex*, a revised version, available in the GitHub repository *['pcai-helm-examples'](https://github.com/GuopingJia/pcai-helm-examples/tree/main/pod-restart-collector)*, provides HPE Private Cloud AI compatible deployment configurations. This updated Helm chart includes the required Istio *VirtualService* and Kyverno *ClusterPolicy* manifests to ensure alignment with PCAI’s service mesh and policy controls. Prior to deployment, update the configuration values for *clusterName*, *slackWebhookUrl*, and *slackChannel* to match the target PCAI cluster and Slack settings of your environment.

Follow the steps below to deploy the Pod restart info collector *'PodCollect'* into HPE Private Cloud AI using *Import Framework*.   

* In the PCAI left navigation panel, select **Tools & Frameworks**. Click ***Import Framework***.

![](/img/pcai-tools-frameworks-import-framework.png)

* By following the Import Framework wizard workflow, *PodCollect* can be deployed into the PCAI environment within minutes.

![](/img/tools-frameworks-import-podcollect.png)

* Run the following *kubectl* commands to verify the *PodCollect* deployment in the namespace *'podc'* of the PCAI K8s cluster.

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

After Pod info collector is deployed via *Import Framework*, an imported *PodCollect* tile appears under **Tools & Frameworks**.

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

Click ***Configure*** on the *PodCollect* tile under **Tools & Frameworks** to modify the Pod collector configuration. You can customize various parameters, such as *'watchedPodNamePrefixes'* to monitor a specific set of Pod name prefixes within your AI workload and *'watchedNamespaces'* to watch only namespaces that run your AI workloads.

![](/img/tools-frameworks-podcollect-config.png)

### Conclusion

This blog post examined the challenges of troubleshooting Pod restarts in K8s environments, especially within HPE Private Cloud AI deployments where large-scale AI workloads demand high availability, performance, and reliability. Traditional troubleshooting approaches often require engineers to manually collect and analyze diagnostic data for each Pod restart event, resulting in repetitive workflows, slower incident resolution, and increased operational overhead.

To address these challenges, this blog post introduced an automated solution that integrates an existing Pod restart information collection tool into the HPE Private Cloud AI platform. The solution continuously monitors for Pod restart events, automatically gathers relevant Pod and node diagnostics, and delivers the collected insights directly to Slack. This automation removes the need for manual data gathering and significantly simplifies the root cause analysis process, enabling engineers to identify and resolve issues faster.

By building on proven open-source tooling and automating the diagnostic workflow end to end, this approach improves observability, accelerates troubleshooting, and reduces the operational burden on engineering teams. Ultimately, it enhances the stability and reliability of AI workloads while helping organizations operate HPE Private Cloud AI environments more efficiently at scale.

Please keep coming back to the [HPE Developer Community blog](https://developer.hpe.com/blog/) to learn more about HPE Private Cloud AI and get more ideas on how you can use it in your everyday operations.
