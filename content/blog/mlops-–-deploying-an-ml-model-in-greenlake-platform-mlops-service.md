---
title: ML Ops – Deploying an ML model in HPE GreenLake Platform ML Ops service
date: 2022-08-08T07:48:49.530Z
author: Thirukkannan M
authorimage: /img/Avatar1.svg
tags:
  - hpe-greenlake
  - MLOPS
  - data-ml-engineer
  - cloud-architect
---
## Overview

HPE GreenLake Central is an advanced software-as-a-service platform that provides you with a consistent cloud experience for all your applications and data on-premises or off-premises. It provides you with insights and controls to manage your hybrid IT estate, complementing your use of public clouds and data centers. HPE GreenLake Central gives you the ability to choose where and how to place your workloads and data, and through the services you purchase enables you to monitor security, capacity, resource utilization, and costs.

HPE GreenLake for ML Ops is an on-premises, enterprise-grade ML service, enabling developers and data scientists to rapidly build, train, and deploy ML models from pilot to production, at any scale.

This preconfigured solution comprises an optimized hardware stack and is powered by HPE Ezmeral Runtime Enterprise. It provides data scientists with self-service access to a sandbox environment for prototyping and testing, to eliminate IT provisioning delays, ensure repeatability, and accelerate time-to-value. As a fully managed solution, the HPE GreenLake for ML Ops offering frees IT from routine infrastructure management tasks.

## Machine learning Lifecycle

![ML Life cycle](/img/blog_3.png "ML Life cycle")

The ML project life cycle can generally be divided into three main stages: data preparation, model creation, and deployment. All three of these components are essential for creating quality models that will bring added value to your business. This process is *cyclical* because the insights gained from the existing model will help define the next model to be deployed.

In this article, I will focus on optimal model identified after data preparation and building model. More specifically, as an example, I will show you how to deploy a sample ONNX model available in Kubernetes native MinIO Object storage, using Triton Inference Server.

Triton Inference server supports deployment of any AI model from multiple deep learning and machine learning frameworks, including TensorRT, TensorFlow, PyTorch, ONNX, OpenVINO, Python, RAPIDS FIL, and more. Triton delivers optimized performance for many query types, including real time, batched, ensembles and audio/video streaming. To learn more about Triton Inference server, refer to the References section at the end of the post.

HPE GreenLake for ML Ops platform allows customers to host their favorite cloud native applications, like MLflow, Minio, etc.

## Pre-requisites

* An active service subscription to HPE GreenLake for ML Ops   

* An ML Ops project that has been created by an ML Ops admin for which the user is able to launch to HPE Ezmeral Runtime Enterprise through an ML Ops Project Member role    

* Available access credentials to any S3 based object storage    

* Triton Inference Server container image accessible either through on-prem registry (eg Harbor) or public registry accessible.    


### Steps to deploy a model

**Step 1:** Validation connection to Kubernetes cluster

1. Click HPE GreenLake for ML Ops card in the HPE GreenLake Central **Dashboard,** which shows the number of previously created projects.

   ![Select ML Ops Project](/img/blog_2.png "Select ML Ops Project")

2. Click link “Launch ML Operations Console”   

3. Click “Dashboard” on left navigation of “Ezmeral Container Platform”   

4. Download “kubectl”, “HPE kubectl plugin”, and “kubeconfig”   

5. Set environment variable KUBECONFIG to point to the kubeconfig file   

6. Validate connectivity to the cluster using command “kubectl get no”   


**Step 2:** Place the model in S3 object storage

1. Place the model and configuration file for Triton Inference server in object storage

   ![object storage for model](/img/blog_1.png "object storage for model")

2. Sample configuration file for the model as shown below:

```markdown
name: "braintumor_onnx"

platform: "onnxruntime_onnx"

max_batch_size : 0

input [

  {

    name: "input_1"

    data_type: TYPE_FP32

    dims: \[ 100, 128, 128, 2 ]

  }

]

output [

  {

    name: "conv2d_22"

    data_type: TYPE_FP32

    dims: \[ -1, 128, 128, 4 ]

  }

]
```

**Step 3:** Create a namespace and secret for object storage credentials using the commands shown below:

```shell
kubectl create namespace triton

kubectl create secret generic minio_cred –from-literal=AWS_ACCESS_KEY_ID=<specify_access_key> --from-literal=AWS_SECRET_ACCESS_KEY=<specify_secret_access_key> -n triton
```

**Step 4:** Create a deployment to host the model and check the pods and services are running

```yaml
---

apiVersion: apps/v1

kind: Deployment

metadata:

  labels:

    app: triton

  name: triton

  namespace: triton

spec:

  replicas: 1

  selector:

    matchLabels:

      app: triton

  template:

    metadata:

      labels:

        app: triton

    spec:

      containers:

      - image: nvcr.io/nvidia/tritonserver:21.10-py3

        name: tritonservercont

        command: ["/bin/bash"]

        args: ["-c", "/opt/tritonserver/bin/tritonserver --model-repository=s3://https://<objectstoreurl.com:port>/sample/models --strict-model-config=false"]

        env:

        - name: AWS_ACCESS_KEY_ID

            valueFrom:

              secretKeyRef:

                name: minio-cred

                key: AWS_ACCESS_KEY_ID

        - name : AWS_SECRET_ACCESS_KEY

            valueFrom:

              secretKeyRef:

                name: minio-cred

                key: AWS_SECRET_ACCESS_KEY

        ports:

        - containerPort: 8000

            name: http

        - containerPort: 8001

            name: grpc

        - containerPort: 8002

            name: metrics

        volumeMounts:

        - mountPath: /dev/shm

          name: dshm

        resources:

          requests:

            cpu: 2

            memory: 8Gi

            nvidia.com/gpu: 1

          limits:

            cpu: 2

            memory: 16Gi

            nvidia.com/gpu: 1

      volumes:

      - name: dshm

        emptyDir:

          medium: Memory

      securityContext:

        runAsUser: 1000

        fsGroup: 1000

      nodeSelector:

        gl.hpe.com/instance-type: GL-GP-MLi-Metal

---

apiVersion: v1

kind: Service

metadata:

  name: triton

  namespace: triton

  labels:

    hpecp.hpe.com/hpecp-internal-gateway: "true"

spec:

  type: NodePort

  selector:

    app: triton

  ports:

  - protocol: TCP

      name: http

      port: 8000

      nodePort: 30850

      targetPort: 8000

  - protocol: TCP

      name: grpc

      port: 8001

      nodePort: 30851

      targetPort: 8001

  - protocol: TCP

      name: metrics

      nodePort: 30852

      port: 8002

      targetPort: 8002
```

          **Notes:**

* In the above YAML, replace <objectstoreurl.com:port> and model path with actual object store URL, model sub path. Model refers to location where model and associated configuration is placed.
* Node selector “gl.hpe.com/instance-type: GL-GP-MLi-Metal” is used to place the workload in inference cluster
* Check that the pods and service are running using the commands shown below:

```shell
kubectl get po –n triton

kubectl get svc –n triton
```

* Service labels **hpecp.hpe.com/hpecp-internal-gateway: "true"** is placed to get a gateway endpoint to access the Triton Inference server outside the cluster. To find the endpoint, run this command: 

```shell
kubectl describe svc <service_name> -n triton
```

* Check the metrics endpoints for models hosted in Triton Inference server are accessible:

```shell
kubectl describe svc <service_name> -n triton
```

## Next steps

Once the production model is hosted, then any application can perform inference on the model hosted by Triton inference server. For more on Triton client libraries, refer to the section below.

## References

* [Triton Inference server](https://github.com/triton-inference-server/server)    

* [Triton Client](https://github.com/triton-inference-server/client)   

* [MinIO](https://min.io/)   

* [HPE GreenLake for ML Ops documentation](https://support.hpe.com/hpesc/public/docDisplay?docId=a00092451en_us&page=HPE-GreenLake-for-ML-Ops.html)   

* [HPE Ezmeral Runtime Enterprise Documentation](https://docs.containerplatform.hpe.com/54/reference/HPE_Ezmeral_Container_Platform.html)   

