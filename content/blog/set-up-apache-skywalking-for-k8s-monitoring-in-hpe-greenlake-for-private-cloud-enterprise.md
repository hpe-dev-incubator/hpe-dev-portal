---
title: "Handling application performance monitoring on HPE GreenLake for Private
  Cloud Enterprise – Part 3: K8s monitoring using Apache SkyWalking"
date: 2023-01-09T20:19:50.005Z
author: Guoping Jia
authorimage: /img/guoping.png
disable: false
tags:
  - hpe-greenlake
  - hpe-greenlake-for-private-cloud-enterprise
  - Kubernetes
  - application performance monitoring
  - Apache SkyWalking
---
## Why is Kubernetes monitoring so important?

[HPE GreenLake for Private Cloud Enterprise](https://www.hpe.com/us/en/greenlake/private-cloud-enterprise.html) delivers a modern private cloud to support your app workloads running in any combination across your edges, colocations, and data centers. It contains one HPE service, called [HPE GreenLake for Private Cloud Enterprise: Containers](https://www.hpe.com/us/en/greenlake/containers.html), which provides an enterprise-grade container management service using open source Kubernetes. It allows customers to create a Kubernetes cluster, view details about existing clusters, and launch the service console. 

Though Kubernetes dramatically simplifies application deployment in containers and across clouds, it adds a new set of complexities for managing, securing and troubleshooting applications. Container-based applications are dynamic and they are being designed using microservices, where the number of components is increased by an order of magnitude.

To ensure Kubernetes security, it requires self-configuration that is typically specified in code, whether Kubernetes YAML manifests, Helm charts, or templating tools. Properly configuring for workloads, clusters, networks, and infrastructure is crucial for averting issues and limiting the impact if a breach occurs. Dynamic provisioning via Infrastructure as code, automated configuration management and orchestration also add to monitoring and troubleshooting complexity.

Since Kubernetes is widely used for processing customer workloads, the non-availability of both workloads and the cluster itself, from misconfiguration of core components to network connectivity issues in Kubernetes, can adversely impact productivity, business continuity and user experience. To avoid this, enterprises must closely monitor the status of the objects managed and operations performed by Kubernetes, proactively capture abnormalities, and resolve them well before end-users notice.

Kubernetes monitoring is critical to managing application performance, service uptime and troubleshooting. However, it presents a challenge for a traditional, static monitoring approach, emphasizing the need for real time monitoring. Having a good application performance monitoring (APM) tool is becoming essential for Kubernetes monitoring.  

In [my first blog post](https://developer.hpe.com/blog/get-started-with-application-performance-monitoring-tools-overview/), I walked through some of the best APM tools, described their key features and discussed their strengths and weaknesses in detail. In this blog post, I choose one APM tool,  *Apache SkyWalking*, and describe in detail how to set it up in HPE GreenLake for Private Cloud Enterprise for monitoring a Kubernetes cluster.

## Apache SkyWalking

[Apache SkyWalking](https://skywalking.apache.org/) is an open source application performance monitoring (APM) tool, especially designed for microservices, cloud native, and container-based architectures. 

Apache SkyWalking is lightweight and scalable. It can be easily set up as a *self-managed* APM tool within an on-premises data center. This avoids leasing customer data to third party services and matches well with the strict security parameters of HPE GreenLake for Private Cloud environment.

## Prerequisites

Before starting, make sure you have the following:

* A Kubernetes cluster, being provisioned in HPE GreenLake for Private Cloud Enterprise
* The *kubectl*, together with the *HPE kubectl plugin* and the *kubeconfig* file of the Kubernetes cluster. You can download them from the launched service console in HPE GreenLake for Private Cloud Enterprise. To simplify the setup process, you can export the environment variable `KUBECONFIG` and point it to the downloaded *kubeconfig* file.
* The *[Helm](https://helm.sh/docs/intro/install/)* CLI tool, version 3.8.1 or later 

With your user access setup, you should have access to permissions that can create and update the following resources in the Kubernetes cluster:

* Kubernetes Service Account(s)
* Kubernetes Roles & RoleBindings

## Set up Apache SkyWalking for Kubernetes monitoring

Apache SkyWalking leverages the Kubernetes [kube-state-metrics](https://github.com/kubernetes/kube-state-metrics) service for collecting metrics data from Kubernetes cluster. It then leverages the *OpenTelemetry* collector to transfer the Kubernetes metrics to the *OpenTelemetry* receiver in the Apache SkyWalking Observability Analysis Platform (OAP) for Kubernetes monitoring. 

![](/img/otel-collector.png)

### Deploy Apache SkyWalking

In this blog post, I will take the approach to setting up the Apache SkyWalking as a *self-managed* APM tool within the Kubernetes cluster created in HPE GreenLake for Private Cloud Enterprise. This mainly takes into account matching with the strict security parameters of HPE GreenLake for Private Cloud environment. 

To start, install Apache SkyWalking using Helm charts with *elasticsearch* as storage:

```markdown
$ git clone https://github.com/apache/skywalking-kubernetes 
$ cd skywalking-kubernetes/chart
$ helm repo add elastic https://helm.elastic.co
$ helm dep up skywalking
$﻿ kubectl create ns skywalking
$ helm install skywalking skywalking –n skywalking \
--set oap.image.tag=9.2.0 \
--set oap.storageType=elasticsearch \
--set ui.image.tag=9.2.0 \
--set elasticsearch.imageTag=7.1.1 \7
--set elasticsearch.persistence.enabled=true \
--set elasticsearch.sysctlInitContainer.enabled=false \
--set oap.env.SW_OTEL_RECEIVER=default \
--set oap.env.SW_OTEL_RECEIVER_ENABLED_OC_RULES="k8s-cluster\,k8s-service\,k8s-node" 
```

After running the above commands, t﻿he Apache SkyWalking is installed to the Kubernetes cluster's namespace *skywalking*. It creates the *elasticsearch* as the `StatefulSet` resource, running a pod on each worker node. It runs the Apache SkyWalking OAP with replicas as 2 to provide high availability.

T﻿he last two options, *oap.env.SW_OTEL_RECEIVER=default* & *oap.env.SW_OTEL_RECEIVER_ENABLED_OC_RULES="k8s-cluster,k8s-service,k8s-node"*, enable the *OpenTelemetry* receiver and define the metrics for the Kubernetes service, service instance and endpoint. It requires Apache SkyWalking OAP to have access to the Kubernetes API server to query the metadata.

You can check the detailed Apache SkyWalking installation by typing the following *kubectl* command:

```markdown
$ kubectl get all -n skywalking
NAME                                  READY   STATUS      RESTARTS   AGE
pod/elasticsearch-master-0            1/1     Running     0          8m7s
pod/elasticsearch-master-1            1/1     Running     0          8m7s
pod/elasticsearch-master-2            1/1     Running     0          8m7s
pod/skywalking-es-init-m9t5c          0/1     Completed   0          8m7s
pod/skywalking-oap-7f757c7668-nq2cz   1/1     Running     0          8m8s
pod/skywalking-oap-7f757c7668-q8z7m   1/1     Running     0          8m8s
pod/skywalking-ui-549dc5989f-jq9b9    1/1     Running     0          8m8s

NAME                                    TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)               AGE
service/elasticsearch-master            ClusterIP   10.110.35.173    <none>        9200/TCP,9300/TCP     8m5s
service/elasticsearch-master-headless   ClusterIP   None             <none>        9200/TCP,9300/TCP     8m5s
service/skywalking-oap                  ClusterIP   10.108.29.84     <none>        11800/TCP,12800/TCP   8m5s
service/skywalking-ui                   ClusterIP   10.102.186.131   <none>        80/TCP                8m5s

NAME                             READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/skywalking-oap   2/2     2            2           8m6s
deployment.apps/skywalking-ui    1/1     1            1           8m6s

NAME                                        DESIRED   CURRENT   READY   AGE
replicaset.apps/skywalking-oap-7f757c7668   2         2         2       8m9s
replicaset.apps/skywalking-ui-549dc5989f    1         1         1       8m9s

NAME                                    READY   AGE
statefulset.apps/elasticsearch-master   3/3     8m5s

NAME                           COMPLETIONS   DURATION   AGE
job.batch/skywalking-es-init   1/1           7m27s      8m6s
```

Y﻿ou can edit the deployed SkyWalking UI service *skywalking-ui* and change its type from *ClusterIP* to *NodePort*. The service will be automatically mapped to the gateway host with an assigned port.

```markdown
$ k edit service/skywalking-ui -n skywalking

$ k describe service/skywalking-ui -n skywalking 
Name:                     skywalking-ui
Namespace:                skywalking
Labels:                   app=skywalking
                          app.kubernetes.io/managed-by=Helm
                          chart=skywalking-4.2.0
                          component=ui
                          heritage=Helm
                          hpecp.hpe.com/hpecp-internal-gateway=true
                          release=skywalking
Annotations:              hpecp-internal-gateway/80: gl2-caas.gl-hpe.local:10037
                          meta.helm.sh/release-name: skywalking
                          meta.helm.sh/release-namespace: skywalking
Selector:                 app=skywalking,component=ui,release=skywalking
Type:                     NodePort
IP:                       10.102.186.131
Port:                     <unset>  80/TCP
TargetPort:               8080/TCP
NodePort:                 <unset>  32748/TCP
Endpoints:                10.192.7.25:8080
Session Affinity:         None
External Traffic Policy:  Cluster
Events:                   <none>
```

As shown in the ***Annotations*** section of the service description above, t﻿he SkyWalking UI can then be accessed in your browser by typing the address *gl2-caas.gl-hpe.local:10037*: 

![](/img/sw-ui-k8s.png)

### Deploy kube-state-metrics service

T﻿he Kubernetes *kube-state-metrics* service will be deployed to listen to the Kubernetes API server and generate metrics about the state of the Kubernetes objects.  

```markdown
$ helm install  kube-state-metrics -n skywalking prometheus-community/kube-state-metrics
```

### Set up *OpenTelemetry* collector

The *OpenTelemetry* collector needs to be installed and set up to transfer the Kubernetes metrics to *OpenTelemetry* receiver from the SkyWalking OAP server. I use the standard Docker image *otel/opentelemetry-collector:0.50.0* to deploy the *OpenTelemetry* collector to the Kubernetes cluster.

#### Set up role-based access control (RBAC)

Kubernetes RBAC is a key security control to ensure that cluster users and workloads have access only to resources required to execute their roles. It is important to ensure that, when designing permissions for cluster users, the cluster administrator understands the areas where privilege escalation could occur, to reduce the risk of excessive access leading to security incidents.

To set up RBAC, you create a *Service Account*, a *ClusterRole*, and connect the two with a *ClusterRoleBinding*.

##### 1. Create a YAML file *otel-sa-kubernetes-monitor.yaml* for the service account:

```markdown
apiVersion: v1
kind: ServiceAccount
metadata:
  name: otel-sa-kubernetes-monitor
```

##### 2. Create a YAML file *otel-role-kubernetes-monitor.yaml* for the cluster roles:

```markdown
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole

metadata:
  name: otel-role-kubernetes-monitor
rules:
  - apiGroups: [ "" ]
    resources:
      # @feature: kubernetes-monitor; permissions to read resources
      - "endpoints"
      - "pods"
      - "services"
      - "nodes"
      - "nodes/metrics"
      - "nodes/proxy"
    verbs: [ "get", "watch", "list" ]
```

##### 3. Create a YAML file *otel-role-binding-kubernetes-monitor.yaml* to bind the service account with the cluster roles:

```markdown
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: otel-role-binding-kubernetes-monitor
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: otel-role-kubernetes-monitor
subjects:
  - kind: ServiceAccount
    name: otel-sa-kubernetes-monitor
    namespace: skywalking
```

##### 4. Deploy the service account, the cluster role and the cluster rolebinding:

```markdown
$ kubectl apply -f otel-sa-kubernetes-monitor.yaml -n skywalking
$ kubectl apply -f otel-role-kubernetes-monitor.yaml -n skywalking
$ kubectl apply -f otel-role-binding-kubernetes-monitor.yaml.yaml -n skywalking
```

#### Deploy *OpenTelemetry* collector

##### 1. Create a YAML file *otel-collector-config.yaml* to set the *OpenTelemetry* config to scrape the Kubernetes metrics:

```markdown
apiVersion: v1
kind: ConfigMap
metadata:
  name: otel-collector-conf-kubernetes-monitor
  labels:
    app: otel-kubernetes-monitor
data:
  otel-collector-config: |
    service:
      pipelines:
        metrics:
          receivers: [ prometheus ]
          exporters: [ opencensus,logging ]
    exporters:
      opencensus:
        endpoint: "skywalking-oap.skywalking.svc.cluster.local:11800"
        tls:
          insecure: true
      logging:
        loglevel: debug
    receivers:
      prometheus:
        config:
          scrape_configs:
          # @feature: kubernetes-monitor; configuration to scrape Kubernetes Nodes metrics
          - job_name: 'kubernetes-cadvisor'
            scheme: https
            tls_config:
              ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
            bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
            kubernetes_sd_configs:
              - role: node
            relabel_configs:
              - action: labelmap
                regex: __meta_kubernetes_node_label_(.+)
              - source_labels: []
                target_label: cluster
                replacement: cfe-iac-clu
              - target_label: __address__
                replacement: kubernetes.default.svc:443
              - source_labels: [__meta_kubernetes_node_name]
                regex: (.+)
                target_label: __metrics_path__
                replacement: /api/v1/nodes/$${1}/proxy/metrics/cadvisor
              - source_labels: [instance]
                separator: ;
                regex: (.+)
                target_label: node
                replacement: $$1
                action: replace
          # @feature: kubernetes-monitor; configuration to scrape Kubernetes Endpoints metrics
          - job_name: kube-state-metrics
            metrics_path: /metrics
            kubernetes_sd_configs:
            - role: endpoints
            relabel_configs:
            - source_labels: [__meta_kubernetes_service_label_app_kubernetes_io_name]
              regex: kube-state-metrics
              replacement: $$1
              action: keep
            - action: labelmap
              regex: __meta_kubernetes_service_label_(.+)
            - source_labels: []
              target_label: cluster
              replacement: cfe-iac-clu
```

##### 2. Create a YAML file *otel-collector-deploy.yaml* for the *OpenTelemetry* collector deployment:

```markdown
apiVersion: apps/v1
kind: Deployment
metadata:
  name: otel-deployment-kubernetes-monitor
  labels:
    app: otel-kubernetes-monitor
spec:
  replicas: 1
  selector:
    matchLabels:
      app: otel-kubernetes-monitor
  template:
    metadata:
      labels:
        app: otel-kubernetes-monitor
      annotations:
        sidecar.istio.io/inject: "false"
    spec:
      serviceAccountName: otel-sa-kubernetes-monitor
      containers:
        - name: otel-kubernetes-monitor
          image: otel/opentelemetry-collector:0.50.0
          command:
            - "/otelcol"
            - "--config=/conf/otel-collector-config.yaml"
          volumeMounts:
            - name: otel-collector-config-vol-kubernetes-monitor
              mountPath: /conf
      volumes:
        - name: otel-collector-config-vol-kubernetes-monitor
          configMap:
            name: otel-collector-conf-kubernetes-monitor
            items:
              - key: otel-collector-config
                path: otel-collector-config.yaml
```

##### 3. Deploy the OpenTelemetry collector:

```markdown
$ kubectl apply -f otel-collector-config.yaml -n skywalking
$ kubectl apply -f otel-collector-deploy.yaml -n skywalking
```

```markdown
$ kubectl  get all -n skywalking -l app=otel-kubernetes-monitor
NAME                                                      READY   STATUS    RESTARTS   AGE
pod/otel-deployment-kubernetes-monitor-798cdd8486-gz885   1/1     Running   0          93d

NAME                                                 READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/otel-deployment-kubernetes-monitor   1/1     1            1           96d

NAME                                                            DESIRED   CURRENT   READY   AGE
replicaset.apps/otel-deployment-kubernetes-monitor-798cdd8486   1         1         1       96d
```

After all setup steps are finished, the Kubernetes metrics will show up in the SkyWalking UI, under the *Kubernetes* tab:

![](/img/sw-k8s-clu.png)

You can check the﻿ Kubernetes overview from the SkyWalking UI:

![](/img/sw-k8s-overview.png)

And the Kubernetes nodes:  

![](/img/sw-k8s-node.png)

The Kubernetes worker node:

![](/img/sw-k8s-node-instance.png)

And the  Kubernetes services:

![](/img/sw-k8s-svc.png)

## Conclusion

In this blog post, I discussed the challenges in Kubernetes monitoring and why it’s important for Kubernetes monitoring in HPE GreenLake for Private Cloud Enterprise. I then took the Apache SkyWalking as the application performance monitoring (APM) tool and showed the detailed process of setting it up, as a *self-managed* environment in HPE GreenLake for Private Cloud Enterprise for monitoring a Kubernetes cluster. It provides a way to gain the visibility of the objects and operations performed by Kubernetes, and to resolve issues in the cluster.