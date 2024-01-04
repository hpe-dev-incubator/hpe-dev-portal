---
title: Kubernetes monitoring using Prometheus and Grafana in HPE GreenLake for
  Private Cloud Enterprise
date: 2024-01-04T09:08:32.582Z
author: Guoping Jia
authorimage: /img/guoping.png
disable: false
tags:
  - Prometheus
  - Grafana
  - Kubernetes monitoring
  - HPE GreenLake for Private Cloud Enterprise
  - HPE GreenLake for Private Cloud Enterprise Containers
---
H﻿ere is the terraform config file. Apart from using the HPE GreenLake _hpegl_ provider, it also uses the _helm_ provider from Hashicorp to deploy both Prometheus and Grafana to the K8s cluster.

```markdown
$ cat main.tf 
terraform {
  required_providers {
    hpegl = {
      source  = "hpe/hpegl"
      version = ">= 0.2.2"
    }
  }
}

provider "hpegl" {
  caas {
    api_url = var.api_url
  }
}

data "hpegl_caas_cluster" "iaccluster" {
  name     = var.cluster_name
  space_id = var.space_id
}

provider "helm" {
  kubernetes {
       host     = yamldecode(base64decode(data.hpegl_caas_cluster.iaccluster.kubeconfig)).clusters[0].cluster.server
       token    = yamldecode(base64decode(data.hpegl_caas_cluster.iaccluster.kubeconfig)).users[0].user.token
       insecure = true
  }
}

resource "helm_release" "prometheus-stack" {
   name = "prometheus-stack"
   repository = "https://prometheus-community.github.io/helm-charts"
   chart = "prometheus"
   version = "23.0.0"
   namespace = "monitoring"
   create_namespace = true

   set {
    name  = "server.service.type"
    value = "NodePort"
  }

   set {
    name  = "prometheus-node-exporter.hostRootFsMount.enabled"
    value = "false"
  }

   set {
    name  = "prometheus-node-exporter.hostNetwork"
    value = "false"
  }

   set {
    name  = "prometheus-node-exporter.hostPID"
    value = "false"
  }
}

resource "helm_release" "grafana-dashboard" {
   name = "grafana-dashboard"
   repository = "https://grafana.github.io/helm-charts"
   chart = "grafana"
   version = "6.57.4"
   namespace = "monitoring"
   create_namespace = true

   set {
    name  = "service.type"
    value = "NodePort"
  }

   set {
    name  = "persistence.enabled"
    value = "false"
  }
}
```
There a few things need to point out in above config file. 

* In Grafana, the persistence by default is disabled. In case the Grafana pod gets terminated for some reason, you will lose all your data. In production deployment, such as HPE GreenLake for Containers, this needs to be enabled to prevent any data lose, * persistence.enabled: true*
* In Prometheus, the DaemonSet deployment of the Node Exporter is trying to mount the *hostPath* volume to the container root “/”, which violates against one deployed OPA policy to the K8s cluster for FS mount protections. Therefore, the DaemonSet deployment will never be ready, keep showing below warning event:

```markdown
Warning  FailedCreate daemonset-controller  Error creating: admission webhook "soft-validate.hpecp.hpe.com" denied the request: Hostpath ("/") referenced in volume is not valid for this namespace because of FS Mount protections.
```



#### Run Terraform init, plan and apply

  * terraform init

```markdown
    $ terraform init
    
    Initializing the backend...
    
    Initializing provider plugins...
    - Finding hpe/hpegl versions matching ">= 0.2.2"...
    - Finding latest version of hashicorp/helm...
    - Installing hpe/hpegl v0.3.17...
    - Installed hpe/hpegl v0.3.17 (signed by a HashiCorp partner, key ID D1F277A1AC66CE3D)
    - Installing hashicorp/helm v2.10.1...
    - Installed hashicorp/helm v2.10.1 (signed by HashiCorp)
    
    Partner and community providers are signed by their developers.
    If you'd like to know more about provider signing, you can read about it here:
    https://www.terraform.io/docs/cli/plugins/signing.html
    
    Terraform has created a lock file .terraform.lock.hcl to record the provider
    selections it made above. Include this file in your version control repository
    so that Terraform can guarantee to make the same selections by default when
    you run "terraform init" in the future.
    
    Terraform has been successfully initialized!
    
    You may now begin working with Terraform. Try running "terraform plan" to see
    any changes that are required for your infrastructure. All Terraform commands
    should now work.
    
    If you ever set or change modules or backend configuration for Terraform,
    rerun this command to reinitialize your working directory. If you forget, other
    commands will detect it and remind you to do so if necessary.
    ```

  * terraform plan    
    
```markdown
    $ terraform plan --var-file=../tfvar_files/variables.tfvars 
    
    Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
      + create
    
    Terraform will perform the following actions:
    
      # helm_release.grafana-dashboard will be created
      + resource "helm_release" "grafana-dashboard" {
          + atomic                     = false
          + chart                      = "grafana"
          + cleanup_on_fail            = false
          + create_namespace           = true
          + dependency_update          = false
          + disable_crd_hooks          = false
          + disable_openapi_validation = false
          + disable_webhooks           = false
          + force_update               = false
          + id                         = (known after apply)
          + lint                       = false
          + manifest                   = (known after apply)
          + max_history                = 0
          + metadata                   = (known after apply)
          + name                       = "grafana-dashboard"
          + namespace                  = "monitoring"
          + pass_credentials           = false
          + recreate_pods              = false
          + render_subchart_notes      = true
          + replace                    = false
          + repository                 = "https://grafana.github.io/helm-charts"
          + reset_values               = false
          + reuse_values               = false
          + skip_crds                  = false
          + status                     = "deployed"
          + timeout                    = 300
          + verify                     = false
          + version                    = "6.57.4"
          + wait                       = true
          + wait_for_jobs              = false
    
          + set {
              + name  = "persistence.enabled"
              + value = "true"
            }
          + set {
              + name  = "service.type"
              + value = "NodePort"
            }
        }
    
      # helm_release.prometheus-stack will be created
      + resource "helm_release" "prometheus-stack" {
         + atomic                     = false
          + chart                      = "prometheus"
          + cleanup_on_fail            = false
          + create_namespace           = true
          + dependency_update          = false
          + disable_crd_hooks          = false
          + disable_openapi_validation = false
          + disable_webhooks           = false
          + force_update               = false
          + id                         = (known after apply)
          + lint                       = false
          + manifest                   = (known after apply)
          + max_history                = 0
          + metadata                   = (known after apply)
          + name                       = "prometheus-stack"
          + namespace                  = "monitoring"
          + pass_credentials           = false
          + recreate_pods              = false
          + render_subchart_notes      = true
          + replace                    = false
          + repository                 = "https://prometheus-community.github.io/helm-charts"
          + reset_values               = false
          + reuse_values               = false
          + skip_crds                  = false
          + status                     = "deployed"
          + timeout                    = 300
          + verify                     = false
          + version                    = "23.0.0"
          + wait                       = true
          + wait_for_jobs              = false
    
          + set {
              + name  = "prometheus-node-exporter.hostNetwork"
              + value = "false"
            }
          + set {
              + name  = "prometheus-node-exporter.hostPID"
              + value = "false"
            }
          + set {
              + name  = "prometheus-node-exporter.hostRootFsMount.enabled"
              + value = "false"
            }
          + set {
              + name  = "server.service.type"
              + value = "NodePort"
            }
        }
    
    Plan: 2 to add, 0 to change, 0 to destroy.
    
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
    
    Note: You didn't use the -out option to save this plan, so Terraform can't guarantee to take exactly these actions if you run "terraform apply" now.
    ```
    
  * terraform apply

```markdown
    $ terraform apply --var-file=../tfvar_files/variables_cmc.tfvars 
    
    Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
      + create
    
    Terraform will perform the following actions:
    
      # helm_release.grafana-dashboard will be created
      + resource "helm_release" "grafana-dashboard" {
          + atomic                     = false
          + chart                      = "grafana"
          + cleanup_on_fail            = false
          + create_namespace           = true
          + dependency_update          = false
          + disable_crd_hooks          = false
          + disable_openapi_validation = false
          + disable_webhooks           = false
          + force_update               = false
          + id                         = (known after apply)
          + lint                       = false
          + manifest                   = (known after apply)
          + max_history                = 0
          + metadata                   = (known after apply)
          + name                       = "grafana-dashboard"
          + namespace                  = "monitoring"
          + pass_credentials           = false
          + recreate_pods              = false
          + render_subchart_notes      = true
          + replace                    = false
          + repository                 = "https://grafana.github.io/helm-charts"
          + reset_values               = false
          + reuse_values               = false
          + skip_crds                  = false
          + status                     = "deployed"
          + timeout                    = 300
          + verify                     = false
          + version                    = "6.57.4"
          + wait                       = true
          + wait_for_jobs              = false
    
          + set {
              + name  = "persistence.enabled"
              + value = "true"
            }
          + set {
              + name  = "service.type"
              + value = "NodePort"
            }
        }
    
      # helm_release.prometheus-stack will be created
      + resource "helm_release" "prometheus-stack" {
          + atomic                     = false
          + chart                      = "prometheus"
          + cleanup_on_fail            = false
          + create_namespace           = true
          + dependency_update          = false
          + disable_crd_hooks          = false
          + disable_openapi_validation = false
          + disable_webhooks           = false
          + force_update               = false
          + id                         = (known after apply)
          + lint                       = false
          + manifest                   = (known after apply)
          + max_history                = 0
          + metadata                   = (known after apply)
          + name                       = "prometheus-stack"
          + namespace                  = "monitoring"
          + pass_credentials           = false
          + recreate_pods              = false
          + render_subchart_notes      = true
          + replace                    = false
          + repository                 = "https://prometheus-community.github.io/helm-charts"
          + reset_values               = false
          + reuse_values               = false
          + skip_crds                  = false
          + status                     = "deployed"
          + timeout                    = 300
          + verify                     = false
          + version                    = "23.0.0"
          + wait                       = true
          + wait_for_jobs              = false
    
          + set {
              + name  = "prometheus-node-exporter.hostNetwork"
              + value = "false"
            }
          + set {
              + name  = "prometheus-node-exporter.hostPID"
              + value = "false"
            }
          + set {
              + name  = "prometheus-node-exporter.hostRootFsMount.enabled"
              + value = "false"
            }
          + set {
              + name  = "server.service.type"
              + value = "NodePort"
            }
        }
    
    Plan: 2 to add, 0 to change, 0 to destroy.
    
    Do you want to perform these actions?
      Terraform will perform the actions described above.
      Only 'yes' will be accepted to approve.
    
      Enter a value: yes
    
    helm_release.grafana-dashboard: Creating...
    helm_release.prometheus-stack: Creating...
    helm_release.grafana-dashboard: Still creating... [10s elapsed]
    helm_release.prometheus-stack: Still creating... [10s elapsed]
    helm_release.grafana-dashboard: Still creating... [20s elapsed]
    helm_release.prometheus-stack: Still creating... [20s elapsed]
    helm_release.grafana-dashboard: Still creating... [30s elapsed]
    helm_release.prometheus-stack: Still creating... [30s elapsed]
    helm_release.grafana-dashboard: Still creating... [40s elapsed]
    helm_release.grafana-dashboard: Creation complete after 43s [id=grafana-dashboard]
    helm_release.prometheus-stack: Still creating... [40s elapsed]
    helm_release.prometheus-stack: Still creating... [50s elapsed]
    helm_release.prometheus-stack: Still creating... [1m0s elapsed]
    helm_release.prometheus-stack: Still creating... [1m10s elapsed]
    helm_release.prometheus-stack: Creation complete after 1m18s [id=prometheus-stack]
    
    Apply complete! Resources: 2 added, 0 changed, 0 destroyed.
```




```markdown

$ k get all -n monitoring 
NAME                                                           READY   STATUS    RESTARTS   AGE
pod/grafana-dashboard-5674bcd6d4-zh8zk                         1/1     Running   0          4d17h
pod/prometheus-stack-alertmanager-0                            1/1     Running   0          4d17h
pod/prometheus-stack-kube-state-metrics-6fb8684695-r7zp6       1/1     Running   0          4d17h
pod/prometheus-stack-prometheus-node-exporter-bcmt2            1/1     Running   0          4d17h
pod/prometheus-stack-prometheus-node-exporter-hgr2x            1/1     Running   0          4d17h
pod/prometheus-stack-prometheus-pushgateway-559cc996d5-jrjdn   1/1     Running   0          4d17h
pod/prometheus-stack-server-7646574d75-zswws                   2/2     Running   0          4d17h

NAME                                                TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
service/grafana-dashboard                           NodePort    10.97.7.23       <none>        80:30488/TCP   4d17h
service/prometheus-stack-alertmanager               ClusterIP   10.101.171.170   <none>        9093/TCP       4d17h
service/prometheus-stack-alertmanager-headless      ClusterIP   None             <none>        9093/TCP       4d17h
service/prometheus-stack-kube-state-metrics         ClusterIP   10.98.134.240    <none>        8080/TCP       4d17h
service/prometheus-stack-prometheus-node-exporter   ClusterIP   10.104.44.251    <none>        9100/TCP       4d17h
service/prometheus-stack-prometheus-pushgateway     ClusterIP   10.104.146.18    <none>        9091/TCP       4d17h
service/prometheus-stack-server                     NodePort    10.106.152.143   <none>        80:30245/TCP   4d17h

NAME                                                       DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR            AGE
daemonset.apps/prometheus-stack-prometheus-node-exporter   2         2         2       2            2           kubernetes.io/os=linux   4d17h

NAME                                                      READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/grafana-dashboard                         1/1     1            1           4d17h
deployment.apps/prometheus-stack-kube-state-metrics       1/1     1            1           4d17h
deployment.apps/prometheus-stack-prometheus-pushgateway   1/1     1            1           4d17h
deployment.apps/prometheus-stack-server                   1/1     1            1           4d17h

NAME                                                                 DESIRED   CURRENT   READY   AGE
replicaset.apps/grafana-dashboard-5674bcd6d4                         1         1         1       4d17h
replicaset.apps/prometheus-stack-kube-state-metrics-6fb8684695       1         1         1       4d17h
replicaset.apps/prometheus-stack-prometheus-pushgateway-559cc996d5   1         1         1       4d17h
replicaset.apps/prometheus-stack-server-7646574d75                   1         1         1       4d17h

NAME                                             READY   AGE
statefulset.apps/prometheus-stack-alertmanager   1/1     4d17h
```



```markdown

$ helm list -n monitoring
NAME             	NAMESPACE 	REVISION	UPDATED                                	STATUS  	CHART            	APP VERSION
grafana-dashboard	monitoring	1       	2023-11-22 15:28:07.986364628 +0100 CET	deployed	grafana-6.57.4   	9.5.5      
prometheus-stack 	monitoring	1       	2023-11-22 15:28:13.290386574 +0100 CET	deployed	prometheus-23.0.0	v2.45.0

```



```markdown

$ kubectl get service/prometheus-stack-server -n monitoring -o jsonpath='{.metadata.annotations.hpecp-internal-gateway/80}'
gl-tor-upc-cp-gw-node1.customer.yyz.gl-hpe.local:10015

```

```markdown

$ kubectl get service/grafana-dashboard -n monitoring -o jsonpath='{.metadata.annotations.hpecp-internal-gateway/80}'
gl-tor-upc-cp-gw-node1.customer.yyz.gl-hpe.local:10016

```

T﻿he Grafana dashboard can be accessed by typing the URL _gl-tor-upc-cp-gw-node1.customer.yyz.gl-hpe.local:10016_. Its admin password can be extracted by the following command

```markdown
$ kubectl get secrets -n monitoring grafana-dashboard -o jsonpath='{.data.admin-password}' | base64 -d
cs3O6LF2H9m0jLrgdR8UXplmZG22d9Co9WbnJNzx
```

T﻿he Prometheus can be configured as the data sources to the Grafana dashboard, by specifying the HTTP URL as _http://gl-tor-upc-cp-gw-node1.customer.yyz.gl-hpe.local:10015/_.

F﻿rom [Grafana Labs](https://grafana.com/grafana/dashboards/), there is a list of dashboard templates you can download and imported them as monitoring dashboards to the Grafana. 

H﻿ere is the imported dashboard for K8s cluster monitoring (via Prometheus):



