---
title: Automate PR Reviews with AI running on HPEs Private Cloud AI
date: 2026-10-07T09:29:00.000Z
author: Isabelle Steinhauser
authorimage: /img/steinhauser_isabelle-copy-copy.jpg
disable: false
tags:
  - hpe-private-cloud-ai
  - tutorial
  - coding-assistant
---
This article provides step-by-step instructions for using OpenCode for automated PR Reviews leveraging GitHub Actions and a model running on HPEs Private Cloud AI. A pitfall when deploying a model on more than 1 GPU is discussed as well.

# HPE Private Cloud AI

[HPE Private Cloud AI ](https://developer.hpe.com/platform/hpe-private-cloud-ai/home/)(HPE PCAI) offers a comprehensive, turnkey AI solution designed to address key enterprise challenges, from selecting the appropriate LLMs to efficiently hosting and deploying them. Beyond these core functions, HPE Private Cloud AI empowers organizations to take full control of their AI adoption journey by offering a curated set of pre-integrated NVIDIA Inference Microservices (NIM) LLMs, along with a powerful suite of AI tools and frameworks for data engineering, analytics, and data science.

HPE Machine Learning Inference Software (MLIS) is an enterprise-grade solution designed to simplify the deployment, management, and monitoring of machine learning (ML) models at scale. It specifically targets the complexities of moving models from development into production, with a particular focus on large language models.

[HPE AI Essentials ](https://support.hpe.com/hpesc/public/docDisplay?docId=a00aie202607hen_us)(AIE) Software is the integrated software layer that provides the tools for building, deploying, and managing generative AI applications, including HPE MLIS. 

# Use Case

AI generated Code is everywhere, the PR reviews are the new bottleneck. Within this article we introduce AI into the PR Review process, where AI will flag standard-issues and double-check the coding standards are followed, so the human can focus on the more complex problems. 

# Prerequisites

This tutorial assumes the Code and PRs to be reviewed are hosted within GitHub, therefore you require a **GitHub Account**. Additionally you need to be the **owner or maintainer of the Repository** where you want to introduce the automatic AI based PR Review. The repository can be public or private. If a private repository is leveraged keep in mind, that the GitHub Runner is using GitHub resources where the free amount is limited. In order to avoid costs being created make sure that Stop usage is enabled for your GitHub Account in Settings/Budgets and licensing/Budgets and alerts for the Product "Actions".

The AI Model to be used is deployed on HPEs PCAI. Either you require the Model Endpoint, Model ID and Token of a PCAI Hosted Model or access to a HPE PCAI with at least **1 free GPU**. A **HuggingFace account** is required.

# Setup

## Deploying a model on HPEs Private Cloud AI

For deploying a model on HPEs PCAI there are several guides available, like this [one](https://developer.hpe.com/blog/hpe-private-cloud-ai-build-your-first-agent/) on GitHub or as part of [other HPE Developer Blogposts](https://developer.hpe.com/blog/hpe-private-cloud-ai-interact-with-sql-database-using-natural-language/). But as for AI Coding and also PR Reviews you might want to use a model, that does not fit on one of your GPUs available within HPEs PCAI, I want to highlight here a Pitfall and a new env var option within MLIS.

In order to deploy a model on more than one GPU select more than one GPU during Packaged Model Creation in the Resources Tab. Multi-GPU deployments are relying on shared memory under /dev/shm that is mounted in the inference service container. The default size of it is 64MiB, which often is not large enough. Increasing that memory is crucial in that case to have a successful deployment, which is why in AIE 2026-07 the environment variable [AIOLI_SHM_SIZE](https://support.hpe.com/hpesc/public/docDisplay?docId=a00aie202607hen_us&page=MLIS/deployments/advanced-configuration.html) is introduced. You can set this either for your Packaged Model or also during the Deployment creation. Specify the allocation as a Kubernetes quantity string (e.g. 512Mi, 2Gi, 4Gi).

If you are running an older AIE version increasing the size of /dev/shm is still possible but a more manual process involving kubectl commands. These can be run from your terminal if you have the kubeconfig for your cluster or alternatively when deploying the model in your personal user project also within a Jupyter Notebook Server in a terminal window.

Create your packaged model and deploy it. Once it's deployed you will see in the namespace a Inferenceservice created `kubectl get isvc` . Identify the inferenceservice belonging to your model deployment and edit it with `kubectl edit isvc <yourinferenceservice>` . We will need to add a volume and a volume mount at the path /dev/shm to it:

```
volumes:
- emptyDir:
    medium: Memory
    sizeLimit: 16Gi
  name: dshm
```

The volume needs to have the same indentation as `tolerations` or `maxReplicas` .

```
  volumeMounts:
  - mountPath: /dev/shm
    name: dshm
```

The VolumeMount needs the same indentation as `image` `name` or `ports` of the `kserve-container` .

After the inferenceservice is updated, the old revision leveraging the old inferenceservice configuration needs to be removed. Identify the old revision with `kubectl get revision `. Delete the old revision with `kubectl delete revision <yourrevisionname> `. The new inferenceservice creates a new revision. Wait until the model deploys, it will take some time. You can check the logs of the model deployment by identifying the pod of your model with `kubectl get pods` . And then the logs of it with `kubectl logs <yourmodelpodname>` .

## Configuring OpenCode

In order to use OpenCode with a local deployed model in GitHub Actions a *opencode.json* at the root level of the GitHub Repository is required. This configuration file defines the permissions of the model as well as which model is being used. In order to create this the Model Endpoint URL, Model ID and Token of the Model are required. You can find this information within AI Essentials, GenAI, selecting your Model.

```
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "pcai": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "MLIS",
      "options": {
        "baseURL": "DEPLOYMENT URL/v1",
        "apiKey" : "{env:MYPROVIDER_API_KEY}"
      },
      "models": {
        "DEPLOYMENT MODEL ID": {
          "name": "MODEL NAME DISPLAYED IN OPENCODE"
        }
      }
    }
  },
  "permission": {
  "edit": "allow",
  "read": "allow",
  "glob": "allow",
  "question": "allow",
  "webfetch": "ask",
  "websearch": "ask",
  "codesearch": "ask",
  "external_directory": "deny",
  "doom_loop": "deny"
  }
}
```

**Replace the following values**:

* DEPLOYMENT URL/v1 replace this with your Model Endpoint URL. Remember to add / keep the /v1 at the end
* DEPLOYMENT MODEL ID replace this with your Model ID. It needs to be the complete model ID you find in GenAI Model Endpoints, like for example deepseek-ai/DeepSeek-V4-Flash-0731
* MODEL NAME DISPLAYED IN OPENCODE replace this with whatever you want this model to be called

For the permission level this sample here works. Feel free to explore more about the action tools and the permissions in the [OpenCode documentation](https://opencode.ai/docs/permissions/).

The apiKey referenced in this config refers to environment variable, this will be defined within the GitHub Action Workflow.

## Configuring the GitHub Action

Within your repository a *review.yaml* file is required. Add this file under the path *.github/workflows* . This File defines the GitHub Action review.

```
name: opencode-review

on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]

jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: write
      pull-requests: write
      issues: write
    steps:
      - uses: actions/checkout@v6
        with:
          persist-credentials: false
      - name: Setup credentials to access private repositories
        run: git config --global url.https://${{ secrets.MY_PAT }}@github.com/.insteadOf https://github.com/
      - uses: anomalyco/opencode/github@latest
        env:
          MYPROVIDER_API_KEY: ${{ secrets.MYPROVIDER_API_KEY }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          model: pcai/DEPLOYMENT MODEL ID
          use_github_token: true
          prompt: |
            Review this pull request:
            - Check for code quality issues
            - Look for potential bugs
            - Suggest improvements
            - comment it with yay this works
```

This defines the action review to be executed whenever a PR is opened, synchronized, reopened or ready for review.

**Replace the following values**:

* DEPLOYMENT MODEL ID replace this with your Model ID as defined in opencode.json. It needs to be the complete model ID you find in GenAI Model Endpoints, like for example deepseek-ai/DeepSeek-V4-Flash-0731

Within jobs the job review is defined to run on *ubuntu-latest*. This defines the image used for the runner to execute this tasks. This configuration as is leverages the runners on GitHub Cloud, which have a low amount of credits to be used for free. A custom defined runner running locally is also possible, this can be VMs that are spinned up and down or Containers in a Kubernetes Cluster as described [here](https://github.com/actions/actions-runner-controller). 

The permissions section defines the permission the runner executing the action gets.

Within steps the steps to be executed are defined. If you are working in a public repository the step *Setup credentials to access private repositories* can be removed.

The environment variables defined starting line 22 need to be configured within the repositories settings, this is explained in the next section of the post.

Adapt the prompt (starting line 28) with the instructions you want to give the model for your review.

## Configuring the secrets

In order to not expose the GitHub Token or the Token of the model it is being referred to secrets. In order to create a secret open your GitHub Repository in a Browser. Navigate to "Settings" of the Repository. Within the Security and quality section of Settings proceed to "Secrets and variables", select "Actions". Define here the following **Repository Secrets:**

* MYGITHUB_TOKEN a personal access token created for your GitHub User within the GitHub Settings, Developer Settings. If you are using fine-grained repo-scoped tokens remember to define access to the private repo being used
* MYPROVIDER_API_KEY as the Token for your Model deployed on HPEs PCAI. You can create a new token within AIE by navigating to GenAI->ModelEndpoints->Select your Model-> Click Create Token.
* MY_PAT a personal access token created for your GitHub User within the GitHub Settings, Developer Settings. If you are using fine-grained repo-scoped tokens remember to define access to the private repo being used

# Working with automatic triggered AI based PR Reviews

Once the setup is completed, for every new PR or reopened PR a run of the defined action is triggered. These runs can be followed by navigating to Actions within the used GitHub Repository. The workflow "opencode-review" will appear. The specific runs, successful or non successful, can be followed from this view.

This is a sample AI based PR review triggered with the configuration described in this blogpost:

![GitHub PR comments](/img/bildschirmfoto-2026-10-07-um-11.02.15.png)

As instructed the comment ends with yay this works.

Stay tuned to the [HPE Developer Community blog](https://developer.hpe.com/blog/) for more guides and best practices on leveraging HPE Private Cloud AI for your AI use cases.
