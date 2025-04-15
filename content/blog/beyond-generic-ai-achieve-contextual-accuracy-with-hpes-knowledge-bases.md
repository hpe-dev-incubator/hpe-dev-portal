---
title: "Beyond generic AI: achieve contextual accuracy with HPE's Knowledge Bases"
date: 2025-04-15T08:45:24.329Z
priority: 0
author: Abhishek Kumar Agarwal
authorimage: /img/abhi-headshot-.jpeg
thumbnailimage: /img/ai-.jpg
disable: false
tags:
  - "HPE Private Cloud AI "
  - hpe-private-cloud-ai
---
<style>
li {
   font-size: 27px;
   line-height: 33px;
   max-width: none;
}
</style>

The demand for AI applications that deliver accurate, contextually relevant insights from enterprise data is rapidly increasing. However, the challenge of integrating fragmented, often sensitive, data into generative models remains a significant hurdle. 

To solve this, Hewlett Packard Enterprise (HPE) has introduced knowledge bases in HPE AI Essentials Software, the software foundation that makes HPE Private Cloud AI a comprehensive, user-friendly platform for enterprises seeking to deploy and scale AI solutions. This new feature provides a fully managed Retrieval Augmented Generation (RAG) experience, enabling secure and efficient connection between foundation models and internal data. This streamlined approach handles everything from vector database setup to sophisticated query handling, allowing data science professionals to create highly customized and accurate AI applications that are tailored to their specific business needs. 

![HPE AI Essentials workflow to automate connecting LLMs to enterprise data](/img/abhipicture12-img1.png "HPE AI Essentials workflow to automate connecting LLMs to enterprise data")

HPE AI Essentials simplifies the implementation of RAG by automating the critical steps involved with connecting Large Language Modules (LLM) to enterprise data. Users retain control over LLM selection and embedding model choice, while the platform manages the underlying infrastructure. HPE AI Essentials automatically handles the conversion of diverse data formats into vector embeddings and ensures efficient storage and retrieval through a managed vector database. This approach allows developers to focus on application logic, rather than the intricacies of RAG pipeline management. 

The platform manages the creation, storage, maintenance, and updates of vector embeddings, the numerical representations of semantic textual data. This automation simplifies data synchronization, allowing users to efficiently update source data. HPE AI Essentials Software provides granular control over the RAG pipeline through configurable parameters for chunking, retrieval, and response generation. This enables data science professionals to tailor a model's processing and understanding to specific use cases, resulting in improved retrieval accuracy and response coherence. 

![HPE AI Essentials: Streamlining LLM Application with Intuitive Data Source and Model Management.](/img/abhipicture21-img2.png "HPE AI Essentials: Streamlining LLM Application with Intuitive Data Source and Model Management.")

Automated document chunking defaults to 512-word segments, optimized for question-answering tasks. Users can further customize chunk sizes and overlaps, with a recommended 0-20% overlap for accuracy gains, while being aware of the potential for reduced relevancy with excessive overlap. 

HPE AI Essentials features a playground, a dedicated environment for interactive knowledge base exploration and management across multiple sessions. This tool enables iterative refinement of model behavior through customizable response parameters and prompt templates. Users can inject background data, define user-specific constraints, and implement detailed prompting strategies, providing the flexibility required for advanced AI development and optimization. 

![Starting a playground for knowledge base exploration and management.](/img/abhipicture31-img3.png "Starting a playground for knowledge base exploration and management.")

![Customization of knowledge base playground components ](/img/abhipicture42-img4-merged.png "Customization of knowledge base playground components ")

To support applications requiring sophisticated, data-driven workflows, knowledge bases can be accessed programmatically via dedicated endpoints within HPE AI Essentials. Secure authorization is achieved using long-lived authorization tokens, allowing for sustained interaction with these endpoints. The following code example provides a clear demonstration of endpoint usage. 

![Code to programmatically access knowledge base via endpoints](/img/abhipicture51-img5.png "Code to programmatically access knowledge base via endpoints ")

## Summary 

Leverage HPE AI Essentials knowledge bases to streamline the development of data-driven AI applications. The platform automates key RAG pipeline components, including vector embedding management and data synchronization reducing operational overhead. Data scientists can focus on application logic and customization, utilizing programmable endpoints and the interactive playground for efficient development. For implementation details and API integration, refer to the technical resources listed below. 

## Learn more:

* **[HPE Private Cloud AI Documentation](https://www.hpe.com/psnow/product-documentation?oid=1014847366&cc=my&lc=en&jumpid=in_pdp-psnow-docs)**
* **[Administration Guide](https://hpe.com/support/PCAIUserGuide)**
* **[HPE AI Essentials Software ](https://www.hpe.com/support/AIEDocs)**
* **[Tutorials for HPE AI Essentials on HPE Private Cloud AI](https://support.hpe.com/hpesc/public/docDisplay?docId=a00aie16hen_us&page=Tutorials/Tutorials/Tutorials.html)**
* **[GitHub Tutorials in HPE AI Essentials Software ![](Github)](https://github.com/HPEEzmeral/aie-tutorials/tree/aie-1.7.0)**
* **[Technical Demo Video](https://www.brighttalk.com/webcast/19535/640132?utm_source=HPE&utm_medium=brighttalk&utm_campaign=640132)**