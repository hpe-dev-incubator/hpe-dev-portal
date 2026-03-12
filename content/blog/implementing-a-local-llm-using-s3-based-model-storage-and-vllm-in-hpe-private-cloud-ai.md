---
title: Implementing a local LLM using S3-based model storage and vLLM in HPE
  Private Cloud AI
date: 2026-03-10T15:10:21.099Z
author: Guoping Jia
authorimage: /img/guoping.png
disable: false
---
Deploying a local Large Language Model (LLM) architecture using S3‑compatible object storage and *vLLM* as the inference engine provides a scalable, cost‑efficient, and secure foundation for enterprise AI adoption. This approach enables organizations to operationalize AI workloads while maintaining full control over data, performance, and model lifecycle management.

This blog post outlines the implementation of a fully local LLM deployment within the HPE Private Cloud AI (PCAI) environment. It deploys *MinIO* as a local S3-based object storage platform for model hosting, and uses *vLLM* as the optimized infrerence engine to deliver high-throughput model execution and efficient GPU utilization. Together, these components form a fully self-hosted LLM pipeline within the PCAI environment. 

### HPE Private Cloud AI

[HPE Private Cloud AI (PCAI)](https://developer.hpe.com/platform/hpe-private-cloud-ai/home/) is a unified, private, full-stack AI cloud platform built for enterprises that require complete control over how they deploy, govern, and scale AI. It is designed to give organizations ownership of their AI environment while enabling rapid innovation across diverse use cases. PCAI directly addresses the most pressing challenges enterprises face as AI adoption accelerates: maintaining data sovereignty, ensuring security, reducing operational complexity, and avoiding the escalating costs and inefficiencies of fragmented, multi-vendor AI infrastructure. 

PCAI provides a comprehensive, turnkey foundation for end-to-end enterprise AI. It delivers a secure, scalable, and ready-to-use private cloud environment that includes a curated set of pre-built NVIDIA NIM-optimized LLMs and an integrated suite of AI/ML tools and frameworks for data engineering, analytics, and data science. This creates a consistent, governed operational layer for building and running AI services, ensuring that organizations retain full sovereignty over their data, models, and infrastructure while benefiting from a modern, production-ready AI platform.

At the core of PCAI’s “AI managed by you” philosophy are two complementary approaches that give enterprises both flexibility and operational rigor for deploying and operating AI services: 

* *Import Framework*

The Import Framework offers an open, extensible mechanism for organizations to integrate any AI application, framework or third-party tool into the PCAI environment. It enables customers to import partner or open-source AI frameworks and add domain-specific or business-specific AI applications. Once imported, these components are managed through PCAI’s unified lifecycle management, ensuring consistent deployment, monitoring, and governance across the entire private cloud platform. 
This framework is what makes PCAI truly AI-application agnostic. Customers are not limited to prepackaged tools and can freely build the AI ecosystem that fits their strategy. 

* *Machine Learning Inference Software (MLIS)*

Machine Learning Inference Software (MLIS) is natively integrated into PCAI to provide a production-ready, standardized runtime for large-scale AI inference operations. It delivers a controlled and reproducible execution layer that manages model versioning, GPU resource allocation, performance tuning, and full-stack observability, including availability, latency, and compliance metrics. 

MLIS supports the entire AI service deployment lifecycle, from registry setup and LLM model onboarding to creating model deployments and serving prediction requests. Once a model is registered, PCAI ensures consistent operational behavior across environments, regardless of the model’s origin. 

A key capability of PCAI is its vendor-agnostic support for any LLM model. Beyond the pre-built NVIDIA NIM models, PCAI can run open-source LLMs (such as those from Hugging Face), third-party or proprietary models, and imported artifacts stored in external systems like MinIO deployed via the Import Framework. This flexibility allows organizations to integrate heterogeneous model sources into a unified deployment framework, while maintaining enterprise-grade reliability, observability, and operational consistency. 

### Prerequisites

Ensure that the following prerequisites are fulfilled:

* HPE Private Cloud AI version 1.5.0 or higher, running HPE AI Essentials version 1.9.1 or higher.
* Access to such an HPE Private Cloud AI workspace with the 'Private Cloud AI Administrator' role, allowing administrative operations.

The following sections show application deployment details using the *kubectl* CLI and *kubeconfig* to access the HPE PCAI Kubernetes (K8s) cluster. However, direct cluster access via *kubectl* is generally not required.

### Model storage setup using *MinIO*

#### Deploy MinIO via *Import Framework*

Based on the Helm charts from the official [MinIO site](https://github.com/minio/minio/tree/master/helm/minio), there is the revised MinIO Helm charts, available in the GitHub repository [pcai-helm-examples](https://github.com/GuopingJia/pcai-helm-examples/tree/main/minio). With these customizations, MinIO can be easily deployed into HPE PCAI using the Import Framework:

![](/img/tools-frameworks-import-framework.png)

![](/img/import-framework-minio-logo.png)

![](/img/import-framework-minio-ns.png)

![](/img/import-framework-minio-review.png)

![](/img/import-framework-minio-submit.png)

T﻿ype the following commands to check the *MinIO* deployment to the namespace *minio* in the cluster:

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

After *MinIO* is deployed via the HPE PCAI Import Framework, an Imported *MinIO* tile appears under Tools & Frameworks. 

![](/img/import-framework-minio-imported.png)

Click ***Open*** from the imported *MinIO* tile will open the *MinIO* login page. 

![](/img/import-framework-minio-login.png)

#### Create a dedicated bucket for LLM model weights

Create Push model to to act as the local S3 object store

![](/img/import-framework-minio-ai-bucket.png)

#### Upload model artifacts to the bucket

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

![](/img/import-framework-minio-ai-model.png)

#### Configure access credentails for secure model retrieval

![](/img/import-framework-minio-create-access-key.png)

![](/img/import-framework-minio-access-key.png)

Connecting S3 data source:
HPE AI Essentials Software includes PrestoDB and CSI connectors, enabling connections to multiple types of data sources. Connecting to an external data source is as simple as selecting the data source type and providing the required connection parameters and credentials.

In the left navigation pane, select Data Engineering > Data Sources.

![](/img/data-sources.png)

Select the **Object Store Data** tab. Click ***Add New Data Source***.

![](/img/object-store-data.png)

Locate the tile with the type of data source that you want to connect, and click _**Add MinIO S3**_. 

![](/img/add-minio-s3-data-source-type.png)

In the drawer that opens, enter the connection parameters and then click Add.

![](/img/add-minio-s3-data-source.png)

![](/img/minio-s3-data-source.png)

When registering a S3 data source, you need provide the S3 credentials, such as the access key and secret key along with the S3 connection details.

On the Data Sources page, a tile for a MinIO S3 data source with the name *'minio-s3'* and the enpoint URL, for example, *'http://s3-minio-service.ezdata-system.svc.cluster.local:30000'*. 

It should be noted that after an administrator connects HPE AI Essentials Software to an external object store in AWS, MinIO, or HPE Ezmeral Data Fabric Object Store, you can access data in those data sources through clients such as Spark or Kubeflow notebooks, without providing an access key or secret key. Your HPE AI Essentials Software administrator provides the access credentials when creating the data source connection. Your access to the data source is authorized through HPE AI Essentials Software.

### Model registry configuration in *MLIS*

HPE Machine Learning Inference Software (MLIS) 

Click ***Tools & Frameworks*** on the left-navigation bar, and navigate to the **HPE MLIS** tile and click ***Open***.

![](/img/pcai-mlis.png)


Navigate to ***Registries***, and click ***Create Registry***.

![](/img/create-new-registry.png)

#### Define a local S3 registry mapping model names to S3 uri

Store metadata such as model version, quantization type, and configuration files

Select **Internal S3 registry** as your model registry provider from the available options. Click ***Continue***.

![](/img/mlis-internal-s3-registry.png)

Input details for Name, Select the Object Store from the drop-down, Select the bucket from the drop-down.

![](/img/create-s3-minio-registry.png)

Click ***Create registry***.

![](/img/s3-minio-registry.png)

You have successfully added a new registry to HPE Machine Learning Inferencing Software (MLIS). You can now create a packaged model and associate it with this registry.

#### Ensure vLLM can resolve model paths via S3 endpoints

#### Mount local (cache) directories for efficient model loading (???)

![](/img/create-s3-packaged-model.png)

![](/img/create-s3-packaged-model-storage.png)

![](/img/create-s3-packaged-model-resources.png)

![](/img/create-s3-packaged-model-advanced.png)

![](/img/create-model-deployment.png)

![](/img/create-model-deployment-packaged-model.png)

![](/img/create-model-deployment-scaling.png)

![](/img/create-model-deployment-advanced.png)

![](/img/create-model-deployment-s3-minio-registry.png)

![](/img/create-model-deployment-s3-minio-registry-open.png)

Validate that MinIO exposes the correct S3 API semantics for model downloads

### Integration and runtime operations

Connect product services to the vLLM inference endpoint
Implement request routing, authentication, and rate control as needed - show the benefits using PCAI
Monitor GPU utilization, token throughput, and latency
Automate model updates by pushing new versions to MinIO and triggering vLLM reloads

### Conclusion

This blog post offers you a comprehensive guide on

The outcome is a fully local, privacy-preserving LLM deployment with centralized model storage via MioIO, controlled model lifecycle through a local S3 model registry, high-performance inference powered by vLLM, and seamless integration into the product environment in HPE PCAI. This support scalable, secure, and cost-efficient LLM operations without relying on external APIs. 

A local LLM implementation provides a strategic foundation for future AI initiatives, RAG pipelines, domain-specific fine-tuning, agent frameworks, and multimodal models. The combination of S3 storage and vLLM creates a flexible, externsible architecture that can evolve with emerging AI capabilities without requiring major redesigns or new vendor contracts. 

Please keep coming back to the [HPE Developer Community blog](https://developer.hpe.com/blog/) to learn more about HPE Private Cloud AI and get more ideas on how you can use it in your everyday operations.