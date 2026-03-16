---
title: Implementing a local LLM using S3-based model storage and vLLM in HPE
  Private Cloud AI
date: 2026-03-10T15:10:21.099Z
author: Guoping Jia
authorimage: /img/guoping.png
disable: false
tags:
  - HPE Private Cloud AI
  - S3 storage store
  - MinIO
  - Import Framework
  - HPE Machine Learning Inference Software
  - Helm chart
  - vLLM
  - Hagging Face
---
Deploying a local Large Language Model (LLM) architecture using S3‑compatible object storage and *vLLM* as the inference engine provides a scalable, cost‑efficient, and secure foundation for enterprise AI adoption. This approach enables organizations to operationalize AI workloads while maintaining full control over data, performance, and model lifecycle management.

This blog post outlines the implementation of a fully local LLM deployment within the HPE Private Cloud AI (PCAI) environment. It deploys *MinIO* as a local S3-based object storage platform for model hosting and uses *vLLM* as the optimized infrerence engine to deliver high-throughput model execution and efficient GPU utilization. Together, these components form a fully self-hosted LLM pipeline within the PCAI environment. 

### HPE Private Cloud AI

[HPE Private Cloud AI (PCAI)](https://developer.hpe.com/platform/hpe-private-cloud-ai/home/) is a unified, private, full-stack AI cloud platform built for enterprises that require complete control over how they deploy, govern, and scale AI. It is designed to give organizations ownership of their AI environment while enabling rapid innovation across diverse use cases. PCAI directly addresses the most pressing challenges enterprises face as AI adoption accelerates: maintaining data sovereignty, ensuring security, reducing operational complexity, and avoiding the escalating costs and inefficiencies of fragmented, multi-vendor AI infrastructure. 

PCAI provides a comprehensive, turnkey foundation for end-to-end enterprise AI. It delivers a secure, scalable, and ready-to-use private cloud environment that includes a curated set of pre-built NVIDIA NIM-optimized LLMs and an integrated suite of AI/ML tools and frameworks for data engineering, analytics, and data science. This creates a consistent, governed operational layer for building and running AI services, ensuring that organizations retain full sovereignty over their data, models, and infrastructure while benefiting from a modern, production-ready AI platform.

At the core of PCAI’s *'AI managed by you'* philosophy are two complementary approaches that give enterprises both flexibility and operational rigor for deploying and operating AI services: 

* *Import Framework*

The PCAI Import Framework offers an open, extensible mechanism for organizations to integrate any AI application, framework or third-party tool into the PCAI environment. It enables customers to import partner or open-source AI frameworks and add domain-specific or business-specific AI applications. Once imported, these components are managed through PCAI’s unified lifecycle management, ensuring consistent deployment, monitoring, and governance across the entire private cloud platform. 

This framework is what makes PCAI truly AI-application agnostic. Customers are not limited to prepackaged tools and can freely build the AI ecosystem that fits their strategy. 

* *Machine Learning Inference Software (MLIS)*

HPE Machine Learning Inference Software (MLIS) is an enterprise‑grade platform designed to streamline and operationalize large-scale deployment, management, and monitoring of machine learning (ML) models. It supports the full AI service lifecycle, including model registry configuration, LLM model onboarding, deployment creation, and high-throughput inference serving. Delivered as a prepackaged PCAI‑integrated application, similar to components such as *Kubeflow* and *Ray*, MLIS provides a controlled execution layer that handles model versioning, GPU scheduling, performance tuning, and comprehensive observability across availability, latency, and compliance metrics.

A core capability of PCAI is its vendor-agnostic support for heterogeneous LLM models. Beyond pre-built NVIDIA NIM models, PCAI can deploy open-source LLMs (e.g., Hugging Face), third-party or proprietary models, and artifacts stored in external or internal object stores such as *MinIO*. This flexibility enables organizations to consolidate diverse model sources within a unified deployment and governance framework while maintaining enterprise-grade reliability, visibility, and operational consistency. 

The following sections detail the implementation of a local LLM deployment within the PCAI environment using the Import Framework and MLIS. 

### Prerequisites

Ensure that the following prerequisites are fulfilled:

* HPE Private Cloud AI version 1.5.0 or later, running HPE AI Essentials version 1.9.1 or later.
* Administrator-level access to an HPE Private Cloud AI workspace (with the *Private Cloud AI Administrator* role), allowing administrative operations.

The deployment examples in the following sections use the *kubectl* CLI and *kubeconfig* to interact with the PCAI Kubernetes (K8s) cluster. However, direct cluster access via *kubectl* is generally not required.

### Setting up model storage using *MinIO*

[MinIO](https://www.min.io/) is a high‑performance, S3‑compatible object storage platform designed for modern, cloud‑native workloads. It serves as an enterprise‑grade alternative to *Amazon S3* that can be deployed locally, on‑premises, or in any cloud environment, offering the same API and operational behavior while remaining fully under your control.

The following sections outline the deployment of MinIO within the PCAI environment using the Import Framework and its configuration as the local model repository for storing and managing LLM artifacts.

#### Deploy MinIO via *Import Framework*

Using a revised MinIO Helm chart, available in the GitHub repository [pcai-helm-examples](https://github.com/GuopingJia/pcai-helm-examples/tree/main/minio), MinIO can be deployed into the PCAI environment through the Import Framework by following the steps outlined below. This Helm chart is derived from the official [MinIO charts](https://github.com/minio/minio/tree/master/helm/minio) and augmented with the required *Istio* *VirtualService* and Kyverno *ClusterPolicy* manifests to ensure compatibility with PCAI’s service mesh and policy controls. 

* In PCAI left navigation panel, select **Tools & Frameworks**. Click ***Import Framework***.

![](/img/pcai-tools-frameworks-import-framework.png)

* Follow up the Import Framework process, *MinIO* can be easily deployed into PCAI.

![](/img/import-framework-minio.png)

T﻿ype the following commands to check the *MinIO* deployment to the namespace *'minio'* in the cluster:

```shell
$ kubectl get all -n minio
NAME          READY   STATUS    RESTARTS   AGE
pod/minio-0   1/1     Running   0          4h30m
pod/minio-1   1/1     Running   0          4h30m
pod/minio-2   1/1     Running   0          4h30m
pod/minio-3   1/1     Running   0          4h30m

NAME                    TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)    AGE
service/minio           ClusterIP   10.96.2.234   <none>        9000/TCP   4h30m
service/minio-console   ClusterIP   10.96.1.181   <none>        9001/TCP   4h30m
service/minio-svc       ClusterIP   None          <none>        9000/TCP   4h30m

NAME                     READY   AGE
statefulset.apps/minio   4/4     4h30m

$ kubectl get pvc -n minio
NAME             STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS      VOLUMEATTRIBUTESCLASS   AGE
export-minio-0   Bound    pvc-8b5e262b-3667-4da8-a886-8e8596b1cbe0   500Gi      RWO            gl4f-filesystem   <unset>                 4h30m
export-minio-1   Bound    pvc-04770c71-301c-47f1-b92f-d7461c8bfca0   500Gi      RWO            gl4f-filesystem   <unset>                 4h30m
export-minio-2   Bound    pvc-527387c5-0ca8-4991-8d0f-340dfdead8b4   500Gi      RWO            gl4f-filesystem   <unset>                 4h30m
export-minio-3   Bound    pvc-d52bfe41-b7a4-4f06-8275-d2b566198012   500Gi      RWO            gl4f-filesystem   <unset>                 4h30m
```

#### MinIO console access via its endpoint

After *MinIO* is deployed via the Import Framework, an imported *MinIO* tile appears under **Tools & Frameworks**. 

![](/img/import-framework-minio-imported.png)

Click ***Open*** from the *MinIO* tile will open the *MinIO* console login page. 

![](/img/import-framework-minio-login.png)

#### Create a dedicated bucket

After log into *MinIO* console, click ***Create a Bucket*** to create a S3 bucket for LLM models.

![](/img/create-minio-bucket.png)

Specify Name, e.g., *'s3-ai-models'* and select optional features for *Versioning*, *Object Locking* or *Quota*. Click ***Create Bucket***.

![](/img/create-ai-model-bucket.png)

#### Upload model artifacts to the bucket

As a sample LLM model, the *'Qwen3-0.6B-Base'* is pulled from the [Hugging Face](https://huggingface.co/Qwen/Qwen3-0.6B-Base) to the local disk.

```shell
$ git clone https://huggingface.co/Qwen/Qwen3-0.6B-Base
Cloning into 'Qwen3-0.6B-Base'...
remote: Enumerating objects: 46, done.
remote: Counting objects: 100% (3/3), done.
remote: Compressing objects: 100% (3/3), done.
remote: Total 46 (delta 0), reused 0 (delta 0), pack-reused 43 (from 1)
Unpacking objects: 100% (46/46), done.
Checking out files: 100% (10/10), done.

$ ls -al  Qwen3-0.6B-Base/
total 1175909
drwxr-xr-x 1 GUJ 1049089          0 Mar  4 18:54 .
drwxr-xr-x 1 GUJ 1049089          0 Mar  4 18:52 ..
drwxr-xr-x 1 GUJ 1049089          0 Mar  4 18:54 .git
-rw-r--r-- 1 GUJ 1049089       1554 Mar  4 18:52 .gitattributes
-rw-r--r-- 1 GUJ 1049089        757 Mar  4 18:52 config.json
-rw-r--r-- 1 GUJ 1049089        144 Mar  4 18:52 generation_config.json
-rw-r--r-- 1 GUJ 1049089      11544 Mar  4 18:52 LICENSE
-rw-r--r-- 1 GUJ 1049089    1823241 Mar  4 18:52 merges.txt
-rw-r--r-- 1 GUJ 1049089 1192135096 Mar  4 18:54 model.safetensors
-rw-r--r-- 1 GUJ 1049089       3030 Mar  4 18:52 README.md
-rw-r--r-- 1 GUJ 1049089    7334926 Mar  4 18:53 tokenizer.json
-rw-r--r-- 1 GUJ 1049089       9916 Mar  4 18:53 tokenizer_config.json
-rw-r--r-- 1 GUJ 1049089    2776833 Mar  4 18:53 vocab.json
```

From the *MinIO* console, click the created bucket *'s3-ai-models'*. 

![](/img/s3-ai-model-bucket.png)

Click ***Upload*** and select **Upload Folder** to upload the model *'Qwen3-0.6B-Base'*. 

![](/img/import-framework-minio-ai-bucket.png)

After few minutes, the bucket *'s3-ai-models'* shows the uploaded LLM model weights from the local folder. 

![](/img/import-framework-minio-ai-model.png)

#### Configure access credentails

Navigate to **Access Keys** in the **MinIO** console, click ***Create access key +***. Specify *Expiry*, *Name*, *Description* and *Comments*. Click ***Create***.

![](/img/import-framework-minio-create-access-key.png)

Save the new *Access Key* and *Secret Key*. 

![](/img/bucket-access-key.png)

These *Access Key* and *Secret Key* will be required in the following configuration steps for secure model retrieval. 

#### Connect S3 data source

As the last model storage setting process, the following steps describe how to register *MinIO* as a S3 data source in PCAI. Rather than accessing *MinIO* directly through its internal service endpoint, PCAI uses a configured S3-compatible *MinIO* endpoint, together with the provided access key and secret key, to retrieve model artifacts. This configured S3 data source functions as the object storage backend that PCAI relies on for model ingestion and runtime access. The same S3 data souce can also be accessed by external clients such as *Spark* or *Kubeflow* Notebooks for unified data interoperability. 

* In the PCAI left navigation panel, select ***Data Engineering > Data Sources***.

![](/img/data-sources.png)

* Select **Object Store Data** tab. Click ***Add New Data Store***.

![](/img/object-store-data.png)

* Locate **MinIO S3** tile. click ***Add MinIO S3***. 

![](/img/add-minio-s3-data-source-type.png)

* Specify *Name* as *'s3-minio'* and *Endpoint*, for example as *'http://minio.minio.svc.cluster.local:90000'*, provide both *Access Key* and *Secret Key* created in the previous steps, and select *Insecure* option. Click ***Add***.

![](/img/add-minio-s3-data-source.png)

* A new tile with the name *'s3-minio'* and the enpoint URL, for example, *'http://s3-minio-service.ezdata-system.svc.cluster.local:30000'*, show on the **Data Sources** page. 

![](/img/minio-s3-data-source.png)

### Model registry configuration in *MLIS*

HPE Machine Learning Inference Software (MLIS) is natively integrated into PCAI to provide a production-ready, standardized runtime for large-scale AI inference operations. 

The following sections describe the S3 model registry configuration, a LLM model creation using the S3 model registry, and the model deployment using vLLM in MLIS. 

#### Define a S3 model registry 

*  In PCAI left navigation pane, select **Tools & Frameworks**. Choose the **HPE MLIS** tile and click ***Open***.

![](/img/pcai-mlis.png)


* Navigate to **Registries**. Click ***Create Registry***.

![](/img/create-new-registry.png)

*  Select **Internal S3 registry** from the list as the model registry provider. Click ***Continue***.

![](/img/mlis-internal-s3-registry.png)

* Specify *Name* as *'s3-minio-registry'*, select *Object store* as *'s3-minio'* and *Bucket* as *'s3-ai-models'* from the drop-down. Click ***Create registry***.

![](/img/create-s3-minio-registry.png)

A registry named *'s3-minio-registry'* shows in the **Registries** page.

![](/img/s3-minio-registry.png)

#### Create a packaged model

* Navigate to **Packaged Models** in MLIS and click ***Create Packaged Model***. Under **Your model** tab, secify *Name* as *qwen3-06b-basae* and *Description* as *'Qwen3-0.6B-Base'*. Click ***Next***.

![](/img/create-s3-packaged-model.png)

* Under **Storage** tab, secify *Registry* as *'s3-minio-registry'*, *Model format* as *'Custom'*, *image* as *'vllm/vllm-openai:latest'*, *URL* as *'s3://s3-ai-models/Qwen3-0.6B-Base'*, and *Model category* as *'llm'*. Click ***Next***.

![](/img/create-s3-packaged-model-storage.png)

* Under **Resources** tab, select *Resource Template* as *'gpu-tiny'* from the list. Click ***Next***.  

![](/img/create-s3-packaged-model-resources.png)

* Under **Advanced** tab, specify *Arguments* as *'--model /mnt/models'*. Click ***Done***. 

![](/img/create-s3-packaged-model-advanced.png)

MLIS will pull the model from this mount point *'/mnt/models'*. 

#### Create model deployment

* Navigate to **Deployments** in MLIS and click ***Create Deployment***. Under **Deployment** tab, specify *Name* as *'s3-minio-registry'* and select *Namespace* as *'project-user-guoping-jia'* from the list. Click ***Next***. 

![](/img/create-model-deployment.png)

* Under **Deployment** tab, select **Packaged model** as *'qwen3-06b-base'* from the drop-down. Click ***Next***. 

![](/img/create-model-deployment-packaged-model.png)

* Under **Scaling** tab, select *Auto scaling template*, for example *'fixed-1'*. Click ***Next***. 

![](/img/create-model-deployment-scaling.png)

* Under **Advanced** tab, specify *Environment Variables*, for example *'AIOLI_DISABLE_LOGGER = 1'*. Click ***Done***. 

![](/img/create-model-deployment-advanced.png)

* After few minutes, the deployment *'s3-minio-registry'* shows in *Ready* status in the **Deployments** page, with a configured model deployment endpoint, for example *'https://s3-minio-registry.project-user-guoping-jia.serving.ai-application.pcai0109.dc15.hpecolo.net/'*.

![](/img/create-model-deployment-s3-minio-registry.png)

* Click **'...'** next to the model deployment *'s3-minio-registry'* and select **Open**, all the details of the model deployment shows under **Timeline** tab.

![](/img/create-model-deployment-s3-minio-registry-open.png)

You have successfully added a new registry using the local *MinIO* S3 data source , create a packaged model and deploy it in MLIS. With managed access tokens, the configured inference service endpoint from the model deployment can be integrated into a broad range of AI tools, including the *VSCode AI Toolkit*, as well as LLM model-serving frameworks like *Open WebUI*, for code generation and virtual assistant capabilities.

### Conclusion

This blog post discussed and demonstrated the implementation of a fully local, privacy-preserving LLM deployment using *MinIO* for centralized S3-compatible model storage and *vLLM* for high-performance inference, integrated into the PCAI environment through the Import Framework and MLIS. This architecture enables scalable, secure, and cost-efficient LLM operations while eliminating reliance on external APIs or thrid-party model hosting services. 

A local LLM deployment provides a strategic foundation for advanced AI initiatives, including RAG pipelines, domain-specific fine-tuning, agent-based systems, and multimodal model integration. By combining S3-compatible storage with vLLM's optimized inference engine, organizations gain a flexible and extensible architecture capable of evolving with emerging AI capabilities without requiring major architectural changes or new vendor dependencies. 

Please keep coming back to the [HPE Developer Community blog](https://developer.hpe.com/blog/) to learn more about HPE Private Cloud AI and get more ideas on how you can use it in your everyday operations.