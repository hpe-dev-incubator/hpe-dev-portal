---
title: Is continuous deployment of modern web applications in Microsoft Azure really so difficult? 
date: 2019-09-26T16:24:18.739Z
author: Denis Choukroun 
tags: ["hpe-proliant-for-microsoft-azure-stack"]
path: is-continuous-deployment-of-modern-web-applications-in-microsoft-azure-r
---
In my studies on Microsoft Azure fundamentals, I often need to dive deep into some of the many Azure services available, all the way from Infrastructure-as-a-Service (IaaS) functionalities (compute, networking, storage, firewall, load balancer) to advanced Platform-as-a-Service (PaaS) services. I recently explored how to implement a Continuous Integration/Continuous Delivery (CI/CD) pipeline with the Microsoft Azure PaaS [App Service,](https://docs.microsoft.com/en-us/azure/app-service/overview) a fully-managed web hosting platform used to host any web-based application supported by Azure.

CI/CD is used by software developers to build, test, integrate, deliver, and deploy software rapidly, reliably, and repeatedly with minimal human intervention. Given the increased emphasis on developers to set up CI/CD pipelines, I wanted to assess how difficult this would be to do in this environment.

I created a Web App resource (an instance of Azure App Service) inside my Azure subscription and tried to set up a CI/CD pipeline from the popular DevOps source code version control system, GitHub. It turned out that it was so simple and fast I wanted to show you how to use the Azure App Service and one of its built-in pipeline orchestrators, [Kudu.](https://github.com/projectkudu/kudu/wiki) I will share with you a method similar to what my colleague, Maddu Rebanna, shared in his blog article, [Deploy a full stack application on Netlify that includes a CI/CD pipeline.](https://developer.hpe.com/blog/deploy-a-full-stack-application-on-netlify-that-includes-a-cicd-pipeline) 

Note: Azure offers a free App Service plan SKU (Stock Keeping Unit). It is a great option for developers to quickly deploy, host, and test modern web applications developed in a variety of languages (.NET, .NET Core, Java, Ruby, Node.js, PHP, or Python) at no cost, while enabling continuous deployment from GitHub. If you don’t already have a free Azure account, go ahead and sign up [here.](https://azure.microsoft.com/en-us/free/)  

## THE BASIC STEPS REQUIRED

Azure App Service is a PaaS that provides the complete platform, both hardware (compute resources) and software (OS and runtime stack), on which cloud applications run. This means that you, as developer, just have to focus on designing and developing your web applications.

Once you have an account in GitHub and an account in Azure public cloud, you only need to follow three basic steps to deploy and publish a web application using continuous deployment. These steps are:

   1. Create a *Web App* resource in Azure. Creating a Web App allocates a set of hosting resources within the Azure App Service platform on which your web application will run. For this example, I suggest you use a free dev/test hosting App Service plan so as to not incur any cost for your Azure account. The App Service plan SKU is always a free service, even after the one-year trial period is over.

   2. Authorize your Azure account to connect to your GitHub repository. (This only needs to be done if it is the first time you have established a delivery pipeline between Azure and your GitHub account.)

   3. Connect your GitHub application build repository and branch to the Web App resource you just deployed in your Azure account in order to setup the delivery pipeline.

I used Visual Studio and an ASP.NET Core web application template available in Visual Studio to create a sample web application named AlpineSkiHouse and copied the Visual Studio generated source repo to my organization’s GitHub in a public repository.

## STEP BY STEP GUIDE

Now, from the Azure portal, let’s take a closer look at these three simple steps:

STEP 1:

Create an ASP.NET Web Application in an existing resource group (CICDRg1), specifying a free SKU (Free F1) App Service Plan to host the web application:



![picture1](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/picture1-1569515900610.png)



![picture2](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/picture2-1569515891835.png)

Azure App service gives you a custom URL for your published Web App resource under domain azurewebsites.net. For a production environment, a company would have to use a paid tier App Service Plan to map their [custom DNS domain](https://docs.microsoft.com/en-us/azure/app-service/app-service-web-tutorial-custom-domain) name to their Azure Web App. For this test, you can use the default azurewebsites.net domain. 

![picture3](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/picture3-1569515886048.png)

STEP 2:

Next, select the __Deployment Center__ in the left menu of the Web App resource you just created. Select __GitHub__ and follow the authorization prompts to sign in to your GitHub account. This will authorize the Azure App Service to make the connection to your GitHub account using OAuth, an open-standard authorization protocol. You only need to authorize once with GitHub source control service. 


![picture4](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/picture4-1569515878902.png)

STEP 3:

Then, select __App Service Build Service,__ the built-in pipeline provider Kudu, and specify the GitHub location (organization, repository and branch) of your code to setup the delivery pipeline by clicking on Continue.


![picture5](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/picture5-1569515872332.png)



![picture6](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/picture6-1569515866508.png)

Finally, click Finish to confirm the setup of the delivery pipeline for your Azure Web App.

![picture7](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/picture7-1569515859003.png)

Once your web application build code repository is connected to your Azure Web App, Azure App Service build service provider (Kudu) does the rest for you. It auto-syncs code from the deployment source (GitHub) and executes a series of steps to build and get your application in a runnable state. Kudu will also auto-sync any future committed changes on the code into the Web App hosted in Azure App Service platform.

![picture8](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/picture8-1569515852645.png)



![picture9](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/picture9-1569515845266.png)


After a minute or so, you will see that your web application is deployed and published in Azure App Service. Click on the URL to access your web application from your browser.


![picture10](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/picture10-1569515838569.png)



![picture11](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/picture11-1569515830186.png)

__It’s that easy!!!__

We just explored one of the many methods you can use to set up a CI/CD pipeline and enable continuous deployment in Azure. I hope you will find this blog article helpful to quickly and easily deploy and test your web applications through the Azure App Service built-in pipeline orchestrator, Kudu. The [Azure App Service documentation](https://docs.microsoft.com/en-us/azure/app-service/) will provide you with all of the information you need to jumpstart your knowledge of Azure App Service and Azure continuous deployment services, such as Kudu build service or Azure DevOps pipelines. 

Please remember to follow our [HPE DEV blog](https://developer.hpe.com/blog) posts for more information on this and other topics designed to streamline your application development environment.
