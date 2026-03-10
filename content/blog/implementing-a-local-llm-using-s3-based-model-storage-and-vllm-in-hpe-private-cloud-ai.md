---
title: Implementing a local LLM using S3-based model storage and vLLM in HPE
  Private Cloud AI
date: 2026-03-10T15:10:21.099Z
author: Guoping Jia
authorimage: /img/guoping.png
disable: false
---
<style> li { font-size: 27px; line-height: 33px; max-width: none; } </style>

This implementation establishes a fully self-hosted LLM pipeline using MinIO as a local S3-compatible object sorage for model management and vLLM for high-performance inference in the HPE Private Cloud AI environment. 

### Overview

[HPE Private Cloud AI (PCAI)](https://developer.hpe.com/platform/hpe-private-cloud-ai/home/) offers a comprehensive, turnkey AI solution designed to address key enterprise challenges, from selecting the appropriate large language models (LLMs) to efficiently hosting and deploying them. Beyond these core functions, HPE PCAI empowers organizations to take full control of their AI adoption journey by offering a curated set of pre-integrated NVIDIA NIM LLMs, along with a powerful suite of AI tools and frameworks for Data Engineering, Analytics, and Data Science.



The Import Framework in HPE PCAI further enhances flexibility by enabling organizations to integrate their own applications or third-party solutions alongside pre-installed components, accommodating a wide range of enterprise-specific use cases.

### Prerequisites

Ensure that the following prerequisites are fulfilled:


* HPE Private Cloud AI running HPE AI Essentials version 1.9.1 or higher.
* Access to such an HPE Private Cloud AI workspace with the 'AI Administrator' role, allowing administrative actions in the HPE AI Essentials.

The following sections show application deployment details using the *kubectl* CLI and *kubeconfig* to access the HPE PCAI Kubernetes (K8s) cluster. However, direct cluster access via *kubectl* is generally not required.

### Model storage setup via *Import Framework*

Deploy a MinIO server instance vi the Import Framework to act as the local S3 object store

![](/img/tools-frameworks-import-framework.png)

![](/img/import-framework-minio-logo.png)

![](/img/import-framework-minio-ns.png)

![](/img/import-framework-minio-review.png)

![](/img/import-framework-minio-submit.png)

![](/img/import-framework-minio-imported.png)

![](/img/import-framework-minio-login.png)

Create a dedicated bucket for LLM model weights

![](/img/import-framework-minio-ai-bucket.png)

![](/img/import-framework-minio-ai-model.png)

Upload model artifacts to the bucket

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

Configure access credentails for secure model retrieval

![](/img/import-framework-minio-create-access-key.png)

![](/img/import-framework-minio-access-key.png)

You can install *MetalLB* and set up the load balancer in the K8s cluster by following the instructions shown in the blog post [Setting up the load balancer with MetalLB](https://developer.hpe.com/blog/set-up-load-balancer-with-metallb-in-hpe-greenlake-for-private-cloud-enterprise/).

T﻿ype the following commands to deploy *Super Mario* and *Tetris* to the namespace *minio* in the cluster:

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

### Model registry configuration in *MLIS*

HPE Machine Learning Inference Software (MLIS) 
Define a local S3 registry mapping model names to S3 uri

![](/img/add-minio-s3-data-source.png)

![](/img/minio-s3-data-source.png)

Store metadata such as model version, quantization type, and configuration files

![](/img/create-s3-minio-registry.png)

![](/img/mlis-internal-s3-registry.png)

![](/img/s3-minio-registry.png)

Ensure vLLM can resolve model paths via S3 endpoints
Mount local (cache) directories for efficient model loading (???)

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

Please keep coming back to the [HPE Developer Community blog](https://developer.hpe.com/blog/) to learn more about HPE Private Cloud AI and get more ideas on how you can use it in your everyday operations.