---
title: Integrating K8sGPT to empower Kubernetes with AI in HPE GreenLake for
  Private Cloud Enterprise
date: 2024-06-11T17:27:56.197Z
author: Guoping Jia
authorimage: /img/guoping.png
disable: false
---
<style> li { font-size: 27px; line-height: 33px; max-width: none; } </style>


This blog post describes the detailed process to integrate [K8sGPT]( https://github.com/k8sgpt-ai/k8sgpt) serving a local LLM model as an AI backend to Kubernetes (K8s) clusters in HPE GreenLake for Private Cloud Enterprise. It explores the convergence of K8s and AI for diagnosing and triaging issues in K8s clusters and reporting back with suggestions from AI backend to fix the issues. 
 
### Overview



[HPE GreenLake for Private Cloud Enterprise: Containers](https://www.hpe.com/us/en/greenlake/containers.html), one of the HPE GreenLake cloud services available on the HPE GreenLake for Private Cloud Enterprise, allows customers to create a Kubernetes (K8s) cluster and deploy containerized applications to the cluster. It provides an enterprise-grade container management service using open source K8s.  

K8s is celebrated for its scalability, self-healing capabilities and compatibility, which make it a preferred choice for developers and organizations. Despite those benefits, operating K8s clusters and managing the deployed applications can present challenges. 




Its ability to automate deployment, scaling, and management of containerized workloads has revolutionized the way organizations build, deploy and manage their applications. K8s has emerged as a cornerstone technology for managing containerized applications at scale. Advancements in artificial intelligence (AI) have opened new horizons for automation, optimization and intelligent decision-making across various domains, including K8s.



K8sGPT is a tool for scanning the K8s clusters, diagnosing and triaging issues in simple English using AI. It detects issues in the K8s cluster and uses supported AI backends to recommend solutions for the issues detected.



This blog post explores the convergence of K8s and AI through K8sGPT. It describes the detailed process to integrate K8sGPT with local LLM model to empower K8s in HPE GreenLake for Private Cloud Enterperise.

This blog post describes the process to deploy K8sGPT using [Local AI](https://github.com/mudler/LocalAI) as its backend to empower K8s clusters with AI capabilities in HPE GreenLake for Private Cloud Enterprise. 

### Prerequisites



Before starting, make sure you have the following:



* A K8s cluster, being provisioned in HPE GreenLake for Private Cloud Enterprise
* The *kubectl* CLI tool, together with the kubeconfig file for accessing the K8s cluster

* The [Python 3.8 or higher](https://www.python.org/downloads/), and *pip* that’s included by default in Python


### K8sGPT and Local AI




K8sGPT is  an open source project designed to address common and complex issues within K8s clusters using AI. It leverages large language models (LLMs) to enhance troubleshooting, streamline processes, and improve cluster management. K8sGPT supports various AI providers, including [OpenAI] (https://openai.com/), [Amazon Bedrock](https://aws.amazon.com/bedrock/), [Azure OpenAI](https://azure.microsoft.com/en-us/products/cognitive-services/openai-service), Google Gemini](https://ai.google.dev/docs/gemini_api_overview) as well as [Local AI](https://github.com/mudler/LocalAI). 

The Local AI is an open source project that provides an alternative to OpenAI’s offerings for local inferencing. It does not require a GPU and can run on consumer grade hardware without high-end computing resources. By deploying AI solutions within the local infrastructure and keeping all processes in-house, it avoids the costs associated with external AI services and ensures better data sovereignty and privacy. 

The following sections describe the process to deploy K8sGPT using Local AI as its backend to empower K8s clusters with AI capabilities in HPE GreenLake for Private Cloud Enterprise. 


### Install K8sGPT



There are two options to install K8sGPT, as a CLI or as a K8s Operator in the K8s cluster. This blog post takes the CLI option to install K8sGPT to the workstation. K8sGPT will be independent of any specific K8s cluster and it can be used for working on any existing K8s clusters. This is helpful, especially when multiple K8s clusters are created in your environment. They can all work with the same K8sGPT installation.



Follow the following instructions to install K8sGPT as a CLI tool on the workstation:

```shell
$ curl -LO https://github.com/k8sgpt-ai/k8sgpt/releases/download/v0.3.24/k8sgpt_386.deb
$ sudo dpkg -i k8sgpt_386.deb
```



Type the following command to verify the K8sGPT installation:



```shell
$ k8sgpt version
k8sgpt: 0.3.24 (eac9f07), built at: unknown

$ k8sgpt -h
Kubernetes debugging powered by AI

Usage:
  k8sgpt [command]

Available Commands:
  analyze     This command will find problems within your Kubernetes cluster
  auth        Authenticate with your chosen backend
  cache       For working with the cache the results of an analysis
  completion  Generate the autocompletion script for the specified shell
  filters     Manage filters for analyzing Kubernetes resources
  generate    Generate Key for your chosen backend (opens browser)
  help        Help about any command
  integration Integrate another tool into K8sGPT
  serve       Runs k8sgpt as a server
  version     Print the version number of k8sgpt

Flags:
      --config string        Default config file (/home/guoping/.config/k8sgpt/k8sgpt.yaml)
  -h, --help                 help for k8sgpt
      --kubeconfig string    Path to a kubeconfig. Only required if out-of-cluster.
      --kubecontext string   Kubernetes context to use. Only required if out-of-cluster.

Use "k8sgpt [command] --help" for more information about a command.
```



K8sGPT comes with a list of built-in analyzers that can be used to find issues in various K8s API objects, such as *Pod*, Service, ReplicaSet, etc. 

Here is a list of supported K8s API objects that can be used in K8sGPT analyzer as the filter to find issue. They are showing under *Active* from the output of the command * k8sgpt filter list*:

```shell
$ k8sgpt filters list
Active:
> Node
> Pod
> Deployment
> ReplicaSet
> PersistentVolumeClaim
> Service
> Ingress
> StatefulSet
> ValidatingWebhookConfiguration
> MutatingWebhookConfiguration
> CronJob
Unused:
> HorizontalPodAutoScaler
> PodDisruptionBudget
> NetworkPolicy
> Log
> GatewayClass
> Gateway
> HTTPRoute
```

You can add other K8s API object, e.g., *HorizontalPodAutoScaler* or *NetworkPolicy*, as the supported filter by typing the command *k8sgpt filter add*.


```shell


```

```shell


```

```shell


```
### Set up Local AI



This section will focus on setting up and utilizing Local AI with a supported LLM model in the local workstation environment. This Local AI setup in the workstation will be integrated with K8sGPT.




#### Download a LLM model

Local AI supports a list of LLM models, such as *LLaMA*, *GPT4ALL*, *Alpaca* and *koala*, etc. The LLM model *`Llama-2–13b-chat-hf`* from [Hugging Face]( https://huggingface.co/) will be downloaded locally and used as AI backend for K8sGPT.



After you create an account to *Hugging Face*, log in to the site and share your contact information, you will be granted access to this model. 

![](/img/hf-llama.png)

Then typing the following command to clone the LLM mode. Make sure you have [*git-lfs*](https://git-lfs.github.com) installed. 



```shell
$ git-lfs clone https://huggingface.co/meta-llama/Llama-2-13b-chat-hf

$ tree Llama-2-13b-chat-hf/
Llama-2-13b-chat-hf/
├── config.json
├── generation_config.json
├── LICENSE.txt
├── model-00001-of-00003.safetensors
├── model-00002-of-00003.safetensors
├── model-00003-of-00003.safetensors
├── model.safetensors.index.json
├── pytorch_model-00001-of-00003.bin
├── pytorch_model-00002-of-00003.bin
├── pytorch_model-00003-of-00003.bin
├── pytorch_model.bin.index.json
├── README.md
├── Responsible-Use-Guide.pdf
├── special_tokens_map.json
├── tokenizer_config.json
├── tokenizer.json
├── tokenizer.model
└── USE_POLICY.md

0 directories, 18 files
```

#### Install text generation web UI



The [Local AI GitHub repo](https://github.com/mudler/LocalAI) can be cloned and the code can be built in the workstation. The built Local AI binary can be used as a tool to serve the downloaded LLM model with OpenAI  compatible API endpoint. There are also many other LLM serving framework and tools that run various LLM models and provide a way to interact with those models to generate text. 



This section introduces the [Text Generation Web UI (TGW)]( https://github.com/oobabooga/text-generation-webui) tool and shows how to set up this tool to support the locally downloaded LLM model as AI backend. The TGW is a [Gradio]( https://github.com/gradio-app/gradio/) based tool that builds a web UI and supports many large language model format with OpenAI compatible APIs.



Typing the following commands to clone the TGW repo and install it:



```shell
git clone https://github.com/oobabooga/text-generation-webui
cd text-generation-webui
pip install -r requirements.txt
```
#### Serve local LLM model




Typing the following command to start serving the downloaded LLM model in your local environment. The option *--extensions openai * specifies to use the OpenAI extension to provide OpenAI format API. The options *--cpu* & *--load-in-4bit* to load model in 4-bit precision and use the model performed on a CPU to make predictions. This is more cost-effective for inference, and especially it’s helpful in case you don’t have GPU installed in your environment.



```shell
$ python3 server.py --listen-host 0.0.0.0 --listen --model Llama-2-13b-chat-hf --model-dir /home/guoping/CFE/AI/models --extensions openai --cpu --load-in-4bit
20:32:39-883617 INFO     Starting Text generation web UI                                                                                         
20:32:39-887086 WARNING                                                                                                                          
                         You are potentially exposing the web UI to the entire internet without any access password.                             
                         You can create one with the "--gradio-auth" flag like this:                                                             
                                                                                                                                                 
                         --gradio-auth username:password                                                                                         
                                                                                                                                                 
                         Make sure to replace username:password with your own.                                                                   
20:32:39-889820 INFO     Loading "Llama-2-13b-chat-hf"                                                                                           
20:32:39-923551 INFO     TRANSFORMERS_PARAMS=                                                                                                    
{'low_cpu_mem_usage': True, 'torch_dtype': torch.float32}

Loading checkpoint shards: 100%|███████████████████████████████████████████████████████████████████████████████████| 3/3 [00:47<00:00, 15.91s/it]
20:33:27-988083 INFO     LOADER: "Transformers"                                                                                                  
20:33:27-989519 INFO     TRUNCATION LENGTH: 4096                                                                                                 
20:33:27-990434 INFO     INSTRUCTION TEMPLATE: "Custom (obtained from model metadata)"                                                           
20:33:27-991414 INFO     Loaded the model in 48.10 seconds.                                                                                      
20:33:27-992350 INFO     Loading the extension "openai"                                                                                          
20:33:28-164441 INFO     OpenAI-compatible API URL:                                                                                              
                                                                                                                                                 
                         http://0.0.0.0:5000                                                                                                     
                                                                                                                                                 
Running on local URL:  http://0.0.0.0:7860
```

The OpenAI compatible API is hosted on *http://0.0.0.0.5000*. 

Apart from above API server URL, the TGW starts running another local web URL, e.g., at *http://0.0.0.0:7860*, providing 3 interface modes, *chat*, *default* & *notebook*, for text generation with the local LLM model backend. You can start the browser by typing this local URL *http://0.0.0.0:7860*. You will land to the *Chat* page. Try to ask some question in the Chat page by typing some text and clicking *Generate* button. You may notice it’s a bit slower if you serve the model using CPU inference. But everything should work and you will get the response to your question by *AI*.






![](/img/local-llm.png)


### Integrate K8sGPT with Local AI



Type the following command to configure K8sGPT to use the API endpoint. Don’t forget to add the *“/v1”* to the API URL. Hit *Enter* when asking for entering OpenAI key.



```shell
$ k8sgpt auth add --backend openai --model Llama-2-13b-chat-hf --baseurl http://localhost:5000/v1
Enter openai Key: 
openai added to the AI backend provider list
```

In case K8sGPT has already added an OpenAI API endpoint, type below command to remove it. Then re-run the *k8sgpt auth add* to add the new API endpint.

```shell
$ k8sgpt auth  remove openai
```



### Detect K8s issues using K8sGPT




#### Deploy an application

Type the following commands to deploy a sample application using *kubectl* CLI to the namespace *cfe-apps*:

```shell
$ kubectl create ns cfe-apps
namespace/cfe-apps created

$ kubectl create deployment app-with-no-image --image=cfe-image-not-exist -n cfe-apps
deployment.apps/app-with-no-image created
```

Check the deployed application using below command:

```shell
$ kubectl get all -n cfe-apps
NAME                                     READY   STATUS             RESTARTS   AGE
pod/app-with-no-image-7ff65f5484-9bt4z   0/1     ImagePullBackOff   0           2m

NAME                                READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/app-with-no-image   0/1     1            0            2m

NAME                                           DESIRED   CURRENT   READY   AGE
replicaset.apps/app-with-no-image-7ff65f5484   1         1         0        2m
```

The output shows some issue in the K8s *Pod* *'app-with-no-image-7ff65f5484-9bt4z'*. Therefore the application deployment keeps showing as *'0/1 READY'*.

#### Run *k8sgpt analyze*





Type the following command to detect issues in the deployed application in the namespace *cfe-apps*:



```shell
$ k8sgpt analyze --filter=Pod --namespace=cfe-apps --explain --no-cache
 100% |██████████████████████████████████████████████████████████████████████████████████████████████████████████| (1/1, 12 it/hr)
AI Provider: openai

0 cfe-apps/app-with-no-image-7ff65f5484-9bt4z(Deployment/app-with-no-image)
- Error: Back-off pulling image "cfe-image-not-exist"
Sure! Here's the simplified error message and solution in no more than 280 characters:

Error: Back-off pulling image "cfe-image-not-exist"

Solution:

1. Check if the image exists in a different registry.
2. If the image is a private image, make sure the registry is correctly configured and the image is properly uploaded.
3. If the image is a public image, try using a different image name or tag.
4. If none of the above solutions work, try deleting the image cache and pulling the image again. 
```

Above command executes the K8sGPT analyze with the option *--explain* and the filter *Pod* in the namespace *cfe-apps*. In addition to the error messages it identified, the analyze also provides the step-by-step solutions to fix the issue. 






Apart from the default English, K8sGPT supports get the response in other languages. Here is an example of getting response in K8sGPT in French:

```shell
$ k8sgpt analyze --filter=Pod --namespace=cfe-apps --language french --explain --no-cache
 100% |██████████████████████████████████████████████████████████████████████████████████████████████████| (1/1, 31 it/hr)
AI Provider: openai

0 cfe-apps/app-with-no-image-7ff65f5484-9bt4z(Deployment/app-with-no-image)
- Error: Back-off pulling image "cfe-image-not-exist"
Sure! Here's the simplified error message and solution in French, within the 280 character limit:

Error: Impossible de tirer l'image "cfe-image-not-exist".

Solution:

1. Vérifiez si l'image est disponible dans le registre de conteneurs.
2. Si l'image n'existe pas, créez-la manuellement en utilisant le commandes `docker pull` ou `docker build`.
3. Essayez à nouveau de tirer l'image en utilisant la commande `kubectl apply`.
```



### Conclusion



K8sGPT is a handy tool which helps in initial trobuleshooting in K8s clusters. It help to improve the Ops experience and make the SRE a lot easier.
This blog post offers you a comprehensive guide on 

Utilizing K8sGPT for enhanced troubleshooting

K8sGPT can aid in triaging issues within K8s clusters using AI. Using its versatility and integration capabilities, K8sGPT can be served as a diagnostic asset, interfacing with a variety of AI platforms and services such as OpenAI, Amazon Bedrock, Azure OpenAI and Google Gemini, etc. This flexibility ensures that K8sGPT can be adapted to the specific tools and systems already in use by any organization, leveraging AI to tackle common and complex problems in K8s environments. Integrating K8sGPT with Local AI solutions allows organization to do the cost savings and avoids transmitting data to public cloud provides or relying on external AI services.  

Please keep coming back to the [HPE Developer Community blog](https://developer.hpe.com/blog/) to learn more about HPE GreenLake for Private Cloud Enterprise and get more ideas on how you can use it in your everyday operations.



