---
title: Using HPE OneSphere API interactive documentation
date: 2018-01-24T23:33:27.514Z
author: Didier.Lalli@hpe.com 
tags: ["HPE-OneSphere","API","GettingStarted","REST","Swagger"]
path: using-hpe-onesphere-api-interactive-documentation
---
## Summary
In previous articles, [Getting Started With OneSphere Programming](https://developer.hpe.com/blog/getting-started-with-hpe-onesphere-programming), [Authenticating against HPE OneSphere API](https://developer.hpe.com/blog/Authenticating-against-hpe-onesphere-api) and [Discovering HPE OneSphere API](https://developer.hpe.com/blog/discovering-hpe-onesphere-api), we discovered the [HPE OneSphere REST API](https://developer.hpe.com/api/onesphere), and most of this was done using a powerful tool called [Postman](https://www.getpostman.com/postman), which you can install on your PC or Mac. But there is an alternative way to browse the API with a simple Web browser, which can be handy for tablet users.

## What is Swagger?
Swagger refers to an Open Source framework built by [SmartBear Software]( https://smartbear.com/), which includes a rich set of tools to help with building, documenting and testing REST API. The term Swagger is often used for sake of simplicity to designate the website generated with the tool to  describe the API. This website is built from a YAML description file and can potentially be an interactive documentation site.

## Interactive documentation? 
In your HPE OneSphere Management portal you will find a "Learn" section right below your User avatar after you clicked on it.

![](/uploads/media/2018/1/hpe-onesphere-api-swagger-picture-1-1516976535351.jpg "Learn section in HPE OneSphere")

In the links provided in this section, there is a link to the HPE OneSphere API reference. This is your best source of documentation as it provides a description of all the objects and calls available in the HPE OneSphere API.

![](/uploads/media/2018/1/hpe-onesphere-api-swagger-picture-2-1516837010418.jpg "HPE OneSphere API Swagger")

This version of the documentation is also interactive, meaning that you can test and consume the API directly from the web page. It will use your HPE OneSphere instance to service the calls. We provide also a non-interactive version of the API documentation on [HPE Developer Portal](https://developer.hpe.com/api/onesphere/). On that one, you cannot run any calls interactively however, you do not need an account on any HPE OneSphere to browse the API and understand the capability.

## Follow the arrows
If you select any of the objects on this page, you will be presented with the list of verbs (GET, POST, PATCH, DELETE) supported for these types of objects. For each verb, there is a description of the required parameters (in the URI or in a JSON body) which are expected when placing a request. The page also details the expected status codes and the JSON response. 
If you pay attention, you will also notice a right-arrow located beside each call, as shown below:

![](/uploads/media/2018/1/hpe-onesphere-api-swagger-picture-3-1516837019962.jpg "GET /rest/status description in HPE OneSphere API")

> Note: Remember, the HPE Developer hosted API documentation site isn't interactive so the arrows won't show up.
 
Clicking on this arrow will take you to another Swagger page which allows to directly place this call to the API on your HPE OneSphere environment. 

## Shall we try?
You know from previous articles that **GET /rest/status** is a call that can be placed without authentication, so let's try this first. Click on the arrow then press **Send** to issue the call:

![](/uploads/media/2018/1/hpe-onesphere-api-swagger-picture-4-1516837031696.jpg "GET /rest/status response from HPE OneSphere API")

You can see in the response section that the call was successful (Status=200) and the JSON response shows our HPE OneSphere status as "OK".

## Ok, let's go get a token
The next step is to try to get a session token so we can test any of the other calls of the API. This is done by using a **POST /res/session**. On the page for this call, you are required to provide a username and a password in the JSON body, then press **Send** to retrieve a token as shown below:

![](/uploads/media/2018/1/hpe-onesphere-api-swagger-picture-5-1516837041131.jpg "POST /rest/session response from HPE OneSphere API")

You should get a successful status code and your token in the JSON response. Select that token string and copy it to the clipboard. 

## And use this token everywhere else...
We now have a token which will allow us access to the rest of the calls in the API. So let's try to retrieve the list of Projects in your HPE OneSphere environment. To do this, select the Projects page in Swagger, then the little arrow beside the **GET /rest/projects**. Open the Header section (top right corner), and add an **Authorization** header to the ones already there. Paste from the clipboard to set the value of the header in between double quotes as illustrated below:

````JSON
{
  "Accept": "application/json",
  "Content-Type": "application/json",
  "Authorization": "gAAAAABaaRErH-14d3s3ZcVDHlkeTIQjVGHiOLpEC9tyEsfzPVdJs0EfBUQUzox2sEmIFwiW-utzNuPbtoivsjzvlDQoph-JCmqwiBn9IOAUfYGAS8fogjVMa2-gGFoXsyPUC8kgjzsbpSr0Xl803BoCc5sqSqGfow"
}
````
> Note that the web page also includes a JSON validator, which will alert you in case of a syntax error in the JSON format.

Press **Send** to issue the request. You should get a successful status code and the response in JSON. In our case, we have 9 projects as shown below:

![](/uploads/media/2018/1/hpe-onesphere-api-swagger-picture-6-1516837050248.jpg "GET /rest/projects response from HPE OneSphere API")

You are now ready to explore the entire HPE OneSphere API. Don't forget to use **DELETE /rest/session** when you are done, to invalidate the session token. If you need more flexibility, I still recommend using Postman and the collection of calls provided in [Discovering HPE OneSphere API](https://developer.hpe.com/blog/Discovering-HPE-OneSphere-API).

## Next Step?
In my next article, we will leverage this knowledge of the API to assemble calls into a simple script using a universal tool called cURL.




