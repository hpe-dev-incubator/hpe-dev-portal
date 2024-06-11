---
title: Integrating K8sGPT to empower Kubernetes with AI in HPE GreenLake for
  Private Cloud Enterprise
date: 2024-06-11T17:27:56.197Z
author: Guoping Jia
authorimage: /img/guoping.png
disable: false
---
<style> li { font-size: 27px; line-height: 33px; max-width: none; } </style>


### Overview



[HPE GreenLake for Private Cloud Enterprise: Containers](https://www.hpe.com/us/en/greenlake/containers.html), one of the HPE GreenLake cloud services available on the HPE GreenLake for Private Cloud Enterprise, allows customers to create a K8s cluster and deploy containerized applications to the cluster. It provides an enterprise-grade container management service using open source K8s.  



### Prerequisites



Before starting, make sure you have the following:

* A K8s cluster, being provisioned in HPE GreenLake for Private Cloud Enterprise
* The *kubectl* CLI tool, together with the kubeconfig file for accessing the K8s cluster

* The [Python 3.8 or higher](https://www.python.org/downloads/), and *pip* that’s included by default in Python


### K8sGPT




K8sGPT is  an open source project designed to address common and complex issues within K8s clusters using AI. It leverages large language models (LLMs) to enhance troubleshooting, streamline processes, and improve cluster management. K8sGPT supports various AI providers, including OpenAI, Amazon Bedrock, Azure OpenAI GPT and Google Gemini. This blog post describes the process to deploy K8sGPT using Local AI as its backend to empower K8s clusters with AI capabilities in HPE GreenLake for Private Cloud Enterprise. 

### Local AI



[Local AI](https://github.com/mudler/LocalAI) is an open source project that provides an alternative to OpenAI’s offerings for local inferencing. It does not require a GPU and can run on consumer grade hardware without high-end computing resources. By deploying AI solutions within the local infrastructure and keeping all processes in-house, it avoids the costs associated with external AI services and ensures better data soverighty and privcy. 

### Set up LLM 



After you create an account to [Hugging Face]( https://huggingface.co/), log in to the site and share your contact information, you will be granted access to this model. Then typing the following command to clone the LLM mode. Make sure you have [*git-lfs*](https://git-lfs.github.com) installed. 

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

### Set up the local LLM



There are many LLM serving framework and tools that run various LLMs and provide a way to interact with those models to generate text. The [Text Generation Web UI (TGW)]( https://github.com/oobabooga/text-generation-webui) is one such tool based on [Gradio]( https://github.com/gradio-app/gradio/) that builds a web UI and supports many large language model format with OpenAI compatible APIs.

Typing the following commands to install TGW:

```shell
git clone https://github.com/oobabooga/text-generation-webui
cd text-generation-webui
pip install -r requirements.txt
```

Typing the following command to start serving the LLM downloaded in your local environment. The option *--extensions openai * specifies to use the OpenAI extension to provide OpenAI format API. The options *--cpu* & *--load-in-4bit* to load model in 4-bit precision and use the model performed on a CPU to make predictions. This is more cost-effective for inference, and especially helpful in case you don’t have GPU installed in your environment.

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

You can start the browser by typing the local URL * http://0.0.0.0:7860*. You will land to the TGW *Chat* page. Try to ask some question in the Chat page by typing some text and clicking *Generate* button. You may notice it’s a bit slower if you serve the model using CPU inference. But everything should work and you will get the response to your question by *AI*.



![](/img/mario-private.png)


### Set up the load balancer with *MetalLB*

You can install *MetalLB* and set up the load balancer in the K8s cluster by following the instructions shown in the blog post [Setting up the load balancer with MetalLB](https://developer.hpe.com/blog/set-up-load-balancer-with-metallb-in-hpe-greenlake-for-private-cloud-enterprise/).

Type the following commands to deploy *Super Mario* and *Tetris* to the namespace *cfe-games* in the cluster:

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

![](/img/mario-private.png)


### Configure K8sGPT to use the API endpoint

Type the following command to configure K8sGPT to use the API endpoint. Don’t forget to add the *“/v1”* to the API URL. Hit *Enter* when asking for entering OpenAI key.

```shell
$ k8sgpt auth add --backend openai --model Llama-2-13b-chat-hf --baseurl http://localhost:5000/v1
Enter openai Key: 
openai added to the AI backend provider list
```

### Try the K8sGPT with the local LLM



Conclusion

### Conclusion

This blog post offers you a comprehensive guide on 

Utilizing K8sGPT for enhanced troubleshooting

K8sGPT can aid in triaging issues within K8s clusters using AI. Using its versatility and integration capabilities, K8sGPT can be served as a diagnostic asset, interfacing with a variety of AI platforms and services such as OpenAI, Amazon Bedrock, Azure OpenAI and Google Gemini, etc. This flexibility ensures that K8sGPT can be adapted to the specific tools and systems already in use by any organization, leveraging AI to tackle common and complex problems in K8s environments. Integrating K8sGPT with Local AI solutions allows organization to do the cost savings and avoids transmitting data to public cloud provides or relying on external AI services.  

Please keep coming back to the [HPE Developer Community blog](https://developer.hpe.com/blog/) to learn more about HPE GreenLake for Private Cloud Enterprise and get more ideas on how you can use it in your everyday operations.



