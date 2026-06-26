---
title: Automating Kubernetes Pod troubleshooting in HPE Private Cloud AI
date: 2026-05-19T15:09:28.396Z
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
[HPE Private Cloud AI (PCAI)](https://developer.hpe.com/platform/hpe-private-cloud-ai/home/) runs large‑scale AI and machine learning (ML) workloads on top of a Kubernetes (K8s) cluster with a large number of K8s Pods running long‑lived, resource‑intensive jobs run continuously in this large cluster environment. Due to K8s inherently ephemeral design, Pod restarts are both common and expected. Some Pod restarts can disrupt long‑running training jobs, interrupt inference services, or degrade the performance of data pipelines operating in the cluster. To maintain reliability at PCAI scale, there is a need to understand the reason behind every Pod restart event proactively, giving engineering teams early visibility into potential issues and enabling faster remediation before they impact AI workloads. Although Kubernetes provides built in commands to inspect node conditions, events, and Pod level diagnostics, engineers must manually run the same sequence of commands for every restart event. This becomes especially inefficient in PCAI environments where AI workloads are long running, resource intensive, and sensitive to interruptions. 

This blog post introduces an automated restart‑analysis pipeline to eliminate this operational burden. Whenever a K8s Pod restarts, the system automatically triggers the Pod info collector, gathers node conditions, Pod events, and contextual signals, and publishes the results directly to Slack. Engineers receive immediate, actionable insight without running a single command. This automation improves observability on the PCAI cluster, accelerates root‑cause identification, and reduces manual overhead — ensuring PCAI workloads remain stable, predictable, and easier to support. 

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

### Set up Slack app and Webhook URL

![](/img/slack-webhook-url.png)


```shell

$ curl -X POST -H 'Content-type: application/json' --data '{"text":"Hello, PCAI Pod monitor!"}' https://hooks.slack.com/services/<hidden>
```

![](/img/pcai-pod-monitoring-hello.png)


### Deploy Pod restart info collector using the Import Framework


Based on the official K8s Pod restart info collector Helm charts, a revised version, available in the GitHub repository pcai-helm-examples, provides HPE Private Cloud AI compatible deployment configurations. This updated chart includes the required Istio VirtualService and Kyverno ClusterPolicy manifests to ensure alignment with PCAI’s service mesh and policy controls. It also incorporates modifications for pulling the user code image from the local Harbor registry.



Follow the steps below to deploy *Pod-Restart-Info-Collector* into HPE Private Cloud AI using the *Import Framework*.   



* In the PCAI left navigation panel, select **Tools & Frameworks**. Click ***Import Framework***.



![](/img/pcai-tools-frameworks-import-framework.png)



* By following the Import Framework wizard workflow, *Pod restart info collector* can be deployed into the PCAI environment within minutes.



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


### OOM demo

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



```shell
# kubectl apply -f oom-pod.yaml -n podc
pod/oom-demo created


# kubectl  get pods -n podc -w
NAME                          READY   STATUS             RESTARTS     AGE
oom-demo                      0/1     CrashLoopBackOff   1 (3s ago)   10s
podcollect-66dff44cb8-gdc5h   1/1     Running            0            97m
oom-demo                      0/1     OOMKilled          2 (18s ago)   25s
oom-demo                      0/1     CrashLoopBackOff   2 (12s ago)   36s
oom-demo                      1/1     Running            3 (25s ago)   49s
oom-demo                      0/1     OOMKilled          3 (26s ago)   50s
oom-demo                      0/1     CrashLoopBackOff   3 (13s ago)   62s
oom-demo                      0/1     OOMKilled          4 (44s ago)   93s
oom-demo                      0/1     CrashLoopBackOff   4 (14s ago)   107s
```

![](/img/pcai-pod-monitoring-oom-demo.png)


![](/img/pcai-pod-monitoring-oom-demo-details.png)



![](/img/pcai-pod-monitoring-oom-demo-10m.png)



![](/img/tools-frameworks-podcollect-config.png)


```shell

```



```shell
# kubectl get pod oom-demo -n podc -o yaml
apiVersion: v1
kind: Pod
…
  - containerID: containerd://9820d784412581930a83e946ffd5631087b2f529d9dc0adbff4f08f18301aac7
    image: docker.io/polinux/stress:latest
    imageID: docker.io/polinux/stress@sha256:b6144f84f9c15dac80deb48d3a646b55c7043ab1d83ea0a697c09097aaad21aa
    lastState:
      terminated:
        containerID: containerd://9820d784412581930a83e946ffd5631087b2f529d9dc0adbff4f08f18301aac7
        exitCode: 1
        finishedAt: "2026-05-07T14:32:28Z"
        reason: OOMKilled
        startedAt: "2026-05-07T14:32:28Z"
    name: oomkilled-demo
    ready: false
    restartCount: 5
    started: false
    state:
      waiting:
        message: back-off 2m40s restarting failed container=oomkilled-demo pod=oom-demo_podc(7528832d-7c0b-4fdd-be13-6d3673e6cee3)
        reason: CrashLoopBackOff
…



```shell


# kubectl delete pod oom-demo -n podc
pod "oom-demo" deleted
```



### Conclusion



This blog post explored the pre-curated orchestration toolchain available within PCAI and introduced *Dagster* as a modern, asset-centric framework that can be integrated seamlessly into the HPE Private Cloud AI environment via the *Import Framework*. When deployed alongside existing orchestration services such as *Airflow*, *Kubeflow*, and *Ray*, *Dagster* operates as an additional, fully compatible orchestration layer within PCAI. Its modular architecture and clear separation between infrastructure and user code allow all user-defined pipeline definitions to be deployed and executed locally within the HPE Private Cloud AI environment, ensuring strong data sovereignty guarantees. By aligning naturally with PCAI's service model and operational patterns, *Dagster* enriches the platform with a clean, asset-oriented orchestration approach that enhances pipeline reliability while remaining fully compliant with PCAI’s security and governance expectations.



Please keep coming back to the [HPE Developer Community blog](https://developer.hpe.com/blog/) to learn more about HPE Private Cloud AI and get more ideas on how you can use it in your everyday operations.
