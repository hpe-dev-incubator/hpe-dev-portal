---
title: Getting started with Retrieval Augmented Generation (RAG)
date: 2024-11-14T07:42:05.843Z
featuredBlog: true
priority: 1
author: Didier Lalli
authorimage: /img/didier-lalli-192x192.png
disable: false
tags:
  - AI
  - NVIDIA
  - PCAI
  - RAG
  - LLM
---
<style>
li {
   font-size: 27px;
   line-height: 33px;
   max-width: none;
}
</style>

Keeping up with AI technology and understanding more about Generative AI and LLM (Large Language Models) is quickly becoming an imperative. If you are like me, curious but not that much of a data scientist or a mathematician, you don't really want to deep dive into the gory details of a model and, instead, would prefer to consider them as interchangeable black boxes with specific properties and application ranges. Still, it’s important to understand how to consume some of these foundation models in order to build something for your own business. Let’s say, for example, that you want to use AI to help customers on your commercial web site, something often referred to as a Chatbot.  

This blog post will show you how to build a simple questions-answering generative AI application using the LangChain orchestration framework powered by a large language model with a private data source to augment the knowledge of the model and answer the question more effectively. 

## Using a foundation model 

LLMs fall into a category called foundation models (FMs). They are large deep learning neural networks trained on massive datasets. You’ve probably heard about, and even used, foundation models like OpenAI’s GPT, Anthropic’s Claude, or Meta’s Llama. Models like these have been trained using such a large dataset that it can answer all kinds of question from users. You might wonder, why can’t I just use such a foundation model, like GPT or Llama3, on my website to create custom generative AI model? Unfortunately, due to the fact that the model was not trained on your private data, i.e. details of the products you sell on your website, there is little chance that the model would be able to provide a valid response to your customer inquiries. 

At this point, you have two choices:  

1. You can invest time and money into finetuning (training) a large language model that includes your product information or private data. It can be complex, expensive and resource intensive, especially if you finetune your model each time you have new data you want the model to know. Finetuning an LLM can be complicated as it requires the right skill set to do the work correctly. It can also be costly as it requires a lot of compute resources including CPU, GPU, power, and cooling. 
2. You can use the most appropriate pre-trained foundation model that’s available and augment its knowledge with your own data, all without the need to train the model. This is what we call Retrieval Augmented Generation (RAG). 

## RAG to the rescue 

RAG is a combination of a natural language processing (NLP) technique combined with a large language model (LLM). A RAG system augments the knowledge that an LLM provides thanks to its training with its own knowledge base. This allows the model to provide responses based on more specific or private content, which would not be found in the public data used to train the foundation model.

## The components of the RAG system 

In order to build a RAG system, you would need the following: 

* Access to an LLM (locally or in the cloud) such as Meta’s Llama3, OpenAI’s GPT, or many others. 
* The documents you want to put in the RAG database. 
* A Text Embedding model such as NVIDIA NeMo Retriever Text Embedding NIM to convert the documents into numerical vectors. 
* A vector database such as open-source ones including Milvus, Qdrant, or Chroma. A vector database is a collection of data stored as mathematical representations. This is used to store the private data in the form of embeddings, also known as vectors. 
* A chain server such as LangChain or LlamaIndex. This is responsible to coordinating dialogs between the user, the vector database, and the LLM by connecting the LLM to external data sources. 
* You will also need a way for users to enter their prompt and read the responses from the system along with a mechanism for populating your private data into the vector database. The LangChain framework implements the prompt using a prompt template. 

## Seeing is believing 

NVIDIA provides a good way to build this and get your hands (a little) dirty. You can find it on [this GitHub repository](https://github.com/NVIDIA/GenerativeAIExamples).

Once the repository is cloned, you can select [the basic RAG using LangChain](https://github.com/NVIDIA/GenerativeAIExamples/tree/main/RAG/examples/basic_rag/langchain) example.   

As explained in the [README.md](https://github.com/NVIDIA/GenerativeAIExamples/blob/main/RAG/examples/basic_rag/langchain/README.md), the example uses NeMo Retriever Text Embedding NIM as text embedding model, Milvus for its vector database, LangChain for its chain server, and meta/llama3-70b-instruct for its LLM. 

![Architecture of the RAG example](https://github.com/NVIDIA/GenerativeAIExamples/raw/main/docs/images/basic_rag_langchain_arch.png  "Architecture of the RAG example")

**Prerequisites**: To get this working you will need the following: 

* A machine with Ubuntu, Docker and Docker Compose (a GPU is not mandatory) 
* An API key from <https://build.nvidia.com/explore/discover> 
* An NGC API key, which you can get by joining NVIDIA developer program. Refer to these instructions to [generate an NGC API key](https://docs.nvidia.com/ngc/gpu-cloud/ngc-user-guide/index.html#generating-api-key). 

Once you have this ready, you can use Docker Compose to build the solution and start it. Docker Compose will download from the NVIDIA container registry, build, and run the following:

```markdown
$ docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Status}}" 
CONTAINER ID   	NAMES                    		STATUS 
436a1e0e1f2a   	milvus-standalone        		Up 18 hours 
c3a5bf578654   	rag-playground           		Up 18 hours 
78be16cb2ef4   	milvus-minio             		Up 18 hours (healthy) 
dc3bcc2c7b16   	chain-server             		Up 18 hours 
af87e14ff763   	milvus-etcd              		Up 18 hours (healthy) 
```

Let me quickly run through what each container is all about: 

* milvus-standalone, milvus-etcd and milvus-minio: the vector database used as a knowledge base for private data 
* rag-playground: the GUI to capture the user prompt and display the response from the LLM. It also has the GUI for selecting documents to add into the knowledge base  
* chain-server: the LangChain based chain server 

As you can see from the port configuration of the rag-playground container, it's listening to port 8090. 

```markdown
docker port rag-playground 
8090/tcp -> 0.0.0.0:8090 
8090/tcp -> [::]:8090 
```

So, let’s open a browser on this URL to see the RAG in action.

![Connect to web UI](/img/ragblog-1.jpg "Connect to web UI")

### Step 1 - Query using a foundation LLM 

You can see that the model used is meta/llama3-70b-instruct, so first try only using the LLM. To do this, enter some text in the prompt window. For the sake of the example here, I'll pretend to be a mountain bike dealer, carrying the Swiss brand of mountain bikes called Flyer. Imagine that I am looking for details of one model called the *Uproc*. I ask the model: *What is a Flyer Uproc?*.

![Asking what is a flyer uproc without context](/img/ragblog2.jpg "Asking what is a flyer uproc without context")

As you can see from the response, there is a problem, as the LLM was not trained with the information about the Flyer brand. The model did find something about *Flyer Uproc*, but clearly this is not what my customer would expect to find on my web site. 

### Step 2 - Loading data into the knowledge base 

To address this issue, use a PDF that describes the technical specifications of the Flyer Uproc in great detail. In the UI, select **Knowledge base** from the upper right corner, then select the PDF (any PDF, TXT or markdown files can work, too). The system will check the content of the file, then build a series of embeddings to describe it, and then store these embeddings in the vector database. It only takes a few seconds to process the details contained in the PDF.

![Adding a PDF in the knowledge base](/img/ragblog3.jpg "Adding a PDF in the knowledge base")

### Step 3 - Query using RAG 

Now that the knowledge base includes details on the *Flyer Uproc* product line, try the same query, but this time, make sure to check the "use knowledge base" checkbox. 

![Asking what is a flyer uproc with context](/img/ragblog4.jpg "Asking what is a flyer uproc with context")

As you can see, the context, provided by the augmented knowledge base, provides additional knowledge to the LLM, and it is now able to provide a much better result, delivering a lot more value to my customers. The RAG system has retrieved the most relevant information from the vector database and passed the information to the LLM. The LLM then used the information to answer the question more effectively. 

Other examples of customer questions could be:

![Asking more questions to system](/img/ragblog5.jpg "Asking more questions to system")

![Asking more questions to system](/img/ragblog6.jpg "Asking more questions to system")

I think you get the point. If this was a Chatbot on my website, it would clearly be very efficient and helpful to my customers.

## Next steps 

This lab exercise is a great way to put rapidly a RAG system into play. Remember, however, that it calls the NVIDIA API to get to the Llama3 model, which has a cost associated with it. NVIDIA provides a number of credits to get you started, but these credits won’t last forever. 

The next step from here might be to run this entirely on premises, in your datacenter, on GPU-equipped hardware. There is another version of this lab dedicated to doing this [here](<https://github.com/NVIDIA/GenerativeAIExamples/tree/main/RAG/examples/local_deploy>). 

If you are looking for the right platform to run an application like this, please check [HPE Private Cloud for AI,](https://www.hpe.com/us/en/private-cloud-ai.html) which has been developed in collaboration with NVIDIA. It is a platform that has been developed specifically for running these types of workloads and can be sized in accordance with your specific needs.

![HPE Private Cloud for AI](/img/pcai.webp "HPE Private Cloud for AI")