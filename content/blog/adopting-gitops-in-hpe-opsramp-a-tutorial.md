---
title: "Adopting GitOps in HPE OpsRamp: a tutorial"
date: 2026-07-01T07:00:00.000Z
author: Jorge Martínez López
authorimage: /img/j-final5-square.jpg
disable: false
tags:
  - hpe-opsramp
  - opensource
  - terraform
  - opentofu
  - git
  - tutorial
---
## Introduction

Our HPE colleague Enrique Larriba wrote an excellent post on [automating HPE OpsRamp using Terraform Infrastructure as Code](https://developer.hpe.com/blog/automating-opsramp-with-terraform-infrastructure-as-code-for-autonomous-it-operations/). Customers successfully adopting this practice will benefit from the speed and consistency of deploying configuration declaratively, but may face two challenges in their adoption journey:

1. Unless the configuration is used for a one-off provisioning activity, they will need to maintain a ''golden'' configuration as source of truth.
2. Users running provisioning and configuration activities will need to share the state file that represents the infrastructure that has been built using OpenTofu / Terraform. This state file contains secrets and sensitive information so the file will need to be stored in a secure location.

Fortunately, the first challenge has already been resolved by version control solutions such as Git. The second one can be resolved by setting up a secure file repository.

This post is a tutorial on how to set up a basic GitOps environment with GitHub as configuration and secret credentials version-controlled repository and Amazon Web Services (AWS) S3 as shared storage for the state file.

## Requirements.

For this tutorial we will use:

* HPE OpsRamp API credentials and tenant information obtained via Custom Integration.
* GitHub as configuration repository.
* GitHub Actions as the runner that will carry out the configuration activities.
* Amazon Web Services, specifically S3 to store the state file.

Other Git forges, runners, and remote storage solutions are available.

## Setting up HPE OpsRamp

As the HPE Terraform provider uses the HPE OpsRamp API in the background, we need to create a Custom Integration by browsing to Setup, Account, Integrations. We can give it any name (e.g. "OpenTofu") and then on the Inbound page we will select OAuth2 as authentication type and an administrator role as we will be running administration tasks.

We will then click on the Generate Key button and take a note of the Tenant ID, the Key, the Secret, and the URL that is displayed in the text box below, e.g. example.api.opsramp.com

There is no need to map any attributes, configure any properties, and the Outbound page can be left empty.

## Creating a GitHub repository

We will then [create a new GitHub repository](https://github.com/new) where we are going to manage our configuration. The URL of the repository will look like https://github.com/YOUR_ORGANIZATION/YOUR_REPO and we will take a note of both the name of the organisation and the repository as we will need it in the next step.

## Setting up Amazon Web Services

Log into your AWS account, on IAM [create an OIDC identity provider](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html) with URL https://token.actions.githubusercontent.com and then [create a trust policy](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-idp_oidc.html#idp_oidc_Create_GitHub) with the following content, replacing `AWS_ACCOUNT_ID` with your AWS Account ID, and `YOUR_ORGANIZATION` and `YOUR_REPO` with the values from GitHub repository creation step above.

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Federated": "arn:aws:iam::AWS_ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
            },
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Condition": {
                 "StringEquals": {
                        "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
                    },
                "StringLike": {
                    "token.actions.githubusercontent.com:sub": "repo:YOUR_ORGANIZATION/YOUR_REPO:*"
                }
            }
        }
    ]
}
```

Then create a S3 bucket and take note of its name and the region where it is located.


