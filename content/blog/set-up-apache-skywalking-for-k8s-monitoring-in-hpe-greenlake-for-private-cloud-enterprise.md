---
title: Set up Apache SkyWalking for K8s monitoring in HPE GreenLake for Private
  Cloud Enterprise
date: 2022-12-28T20:19:50.005Z
author: Guoping JIA
authorimage: /img/guoping.png
disable: false
---
## Introduction

Available on the HPE GreenLake Central platform, [HPE GreenLake for Private Cloud Enterprise](https://www.hpe.com/us/en/greenlake/private-cloud-enterprise.html) is composed of the following suite of HPE services that are grouped specifically to create and manage a private cloud:

* HPE GreenLake for Virtual Machines
* HPE GreenLake for Containers
* HPE GreenLake for Bare Metal Servers

I﻿t provides an automated, flexible private cloud customers can use to run, support, and develop any of apps in their private environment, with modern cloud experience for VMs, containers, and bare metal. 

This blog post describes the process of deploying the Apache SkyWalking t﻿o the HPE GreenLake private cloud. in customer production environments. 

## Apache SkyWalking

[Apache SkyWalking](https://skywalking.apache.org/) is an open source application performance monitor (APM) tool, especially designed for microservices, cloud native, and container-based architectures. It provides a list of agents to be used for building `Java`, `.NET Core`, `PHP`, `Node.js`, `Golang`, `LUA`, `Rust` and `C++` apps. This enables the Apache SkyWalking to automatically discover, instrument and collect monitoring metrics from application environment, detect slow services and endpoints, and provide root cause analysis. 

Apache SkyWalking is lightweight and scalable. It can be easily set up as self-managed APM tool within an on-premises data center. This avoids leasing customer data to third party services and matches well with the restricted security restriction in HPE GreenLake for Private Cloud Enterprise environment.

## Prerequisites

Before you start, make sure you meet the following requirements:


* A Kubernetes cluster needs to be created in HPE GreenLake for Private Cloud Enterprise. You need to download the *kubectl* binary, together with the *HPE kubectl plugin* and the *kubeconfig* file of the created cluster, from the launched service console. The downloaded *kubectl* binary and its plugin need to be set up in your environment. To simplify the setup process, you should export the environment variable `KUBECONFIG` and point it to the downloaded kubeconfig file. With these setups in place, you can access the Kubernetes cluster in the HPE GreenLake for Private Cloud Enterprise.

* The [Helm CLI](https://helm.sh/docs/intro/install/) needs to be installed in your environment. This Helm CLI will be used for installing and setting up the Apache SkyWalking.

* The [istioctl](https://istio.io/latest/docs/setup/getting-started/#download) needs to be installed as well in your environment. The istioctl client will be used for installing and set up `Istio`.

With your user access setup, you should have access to permissions that can create and update the following resources in the Kubernetes cluster:

- Kubernetes Service Account(s)
- Kubernetes Roles & RoleBindings

## Setup Details

![](/img/otel-collector.png)

### Deploy Apache SkyWalking

Install SkyWalking using helm charts with *elasticsearch* as storage:

```markdown
$ git clone https://github.com/apache/skywalking-kubernetes 
$ cd skywalking-kubernetes/chart
$ helm repo add elastic https://helm.elastic.co
$ helm dep up skywalking
$ helm install skywalking skywalking –n skywalking \
--set oap.image.tag=9.1.0 \
--set oap.storageType=elasticsearch \
--set ui.image.tag=9.1.0 \
--set elasticsearch.imageTag=7.5.1 \
--set elasticsearch.persistence.enabled=true \
--set elasticsearch.sysctlInitContainer.enabled=false \
--set oap.env.SW_OTEL_RECEIVER=default \
--set oap.env.SW_OTEL_RECEIVER_ENABLED_OC_RULES="k8s-cluster\,k8s-service\,k8s-node" 
```

T﻿he Apache SkyWalking is installed to the K8s cluster namespace *skywalking*. It creates the *elasticsearch* as the `statefulset`, running pod on each worker node. It runs the SkyWalking OAP with replicas as 2 to provide high availability to the pods.

T﻿he last two options enable the OpenTelemetry receiver and define the metrics for K8s service, service instance and endpoint. It requires SkyWalking OAP to have access to Kubernetes API server to query the metadata. 

You can check the details by typing the following *kubectl* command:

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

Y﻿ou can edit the deployed SkyWalking UI service *skywalking-ui* and change its type from *ClusterIP* to *NodePort*. The service will be automatically mapped to gateway host with an assigned port.

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

T﻿he SkyWalking UI can then be accessed in your browser by typing the address *gl2-caas.gl-hpe.local:10037*: 

![](/img/sw-ui.png)

### Deploy kube-state-metrics 

T﻿he Kubernetes *kube-state-metrics* service will be deployed to listen to the Kubernetes API server and generate metrics about the state of the K8s objects.  

```markdown
$ helm install  kube-state-metrics -n skywalking prometheus-community/kube-state-metrics

```
### Set up OpenTelemetry Collector

The OpenTelemetry collector needs to be installed and set up to transfer the metrics to OpenTelemetry receiver from SkyWalking OAP server.

#### Set up Role-Based Access Control (RBAC)



Kubernetes RBAC is a key security control to ensure that cluster users and workloads have access only to resources required to execute their roles. It is important to ensure that, when designing permissions for cluster users, the cluster administrator understands the areas where privilege escalation could occur, to reduce the risk of excessive access leading to security incidents.

To set up RBAC, you create a Service Account, a ClusterRole, and connect the two with a Cluster RoleBinding.

##### 1. Create a YAML file _otel-sa-kubernetes-monitor.yaml_ for the service account:

```markdown
apiVersion: v1
kind: ServiceAccount
metadata:
  name: otel-sa-kubernetes-monitor

```



##### 2. Create a YAML file _otel-role-kubernetes-monitor.yaml_ for the cluster roles:

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

##### 3. Create a YAML file _otel-role-binding-kubernetes-monitor.yaml_ to bind the service account with the cluster access roles:



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

#### Deploy OpenTelemetry Collector

##### 1. Create a YAML file _otel-collector-config.yaml_ to set OpenTelemetry config to scrape the Kubernetes metrics:

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



##### 2. Create a YAML file _otel-collector-deploy.yaml_ for the OpenTelemetry collector deployment:


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

O﻿nce all is done you should see the K8s metrics in Skywalking UI.

-﻿ Kubernetes cluster:

![](/img/sw-k8s-clu.png)

-﻿ Kubernetes overview:

![](/img/sw-k8s-overview.png)

-﻿ Kubernetes nodes:

![](/img/sw-k8s-node.png)

-﻿ Kubernetes worker node:

![](/img/sw-k8s-node-instance.png)

-﻿ Kubernetes services:

![](/img/sw-k8s-svc.png)

## Conclusion

<﻿to be added>