---
title: Discovering HPE OneSphere API
date: 2018-01-23T16:37:26.792Z
author: Didier.Lalli@hpe.com 
tags: ["HPE-OneSphere","API","GettingStarted","REST"]
path: discovering-hpe-onesphere-api
---
## Summary
In previous articles, [Getting Started With OneSphere Programming](https://developer.hpe.com/blog/getting-started-with-hpe-onesphere-programming) and [Authenticating against HPE OneSphere API](https://developer.hpe.com/blog/authenticating-against-hpe-onesphere-api), we discovered HPE OneSphere REST API, most of which was done using a handy tool called [Postman](https://www.getpostman.com/postman). In this article we'll go a step further in this tool to discover the complete list of calls available in the HPE OneSphere API. 

## Swagger or not Swagger?
Every HPE OneSphere management portal comes with a description of the API in Swagger. The interesting thing about Swagger is not only does it describe the details of each API call and its parameters, but it also allows for issuing those calls directly from a web page. This is handy, however many cool functionalities offered by Postman (such as saving collections of calls, exporting, importing and programming token assignment) are not available in Swagger. So in this article we will continue with Postman.

## Postman is a powerful tool
We have referenced Postman in previous articles and described how to issue a number of calls to the API. You might have noticed that extracting the session token to use as an HTTP header in subsequent calls is tedious and error prone. The first good news is that we can automate this process using Postman's own programming capability. The following capture shows the three lines of JavaScript necessary to extract the token from the JSON response of the **POST /rest/session** call and store it in a (Postman) environment variable for later use. 

![](/uploads/media/2018/1/discovering-hpe-oneview-api-pic1-1516725850394.jpg "Token assignment in Postman")

> Note: you can open the Postman console from the View menu, to see the messages logged by these lines of code

## HPE OneSphere Postman Public Collection
The second part of the good news is that these API calls can be grouped into *Collections*. You can then manipulate those collections (clone, export, import) to share them with peers. To illustrate this  and help you get started, we have built such a collection entirely dedicated to HPE OneSphere.

You can download this collection (a JSON file) [here](https://raw.githubusercontent.com/HewlettPackard/hpe-onesphere-http/master/HPE%20OneSphere%20(Public).postman_collection.json)

Once you have saved this collection on your system, select **Import** from the Collection menu and drag and drop the collection file. This will create a new collection of calls called HPE OneSphere Public.

## Postman Collections and Environments
Collections are groups of calls, which can be applied to different APIs. We now have a collection to work with HPE OneSphere. But which HPE OneSphere environment are we talking about? To keep this better organized Postman has a concept called *Environments*. An Environment is a group of variables which can be configured in Postman and then exported to a simple JSON file. These variables typically describe a given target environment and are expected to be set before the API calls in the collection can run successfully.

You can download a generic HPE OneSphere environment [here](https://raw.githubusercontent.com/HewlettPackard/hpe-onesphere-http/master/HPE%20OneSphere.postman_environment.json)

Once you have saved this environment on your system, select **Manage Environments** from the little cog-wheel in the upper right corner of Postman and **Import** from the downloaded file. You should now have an HPE OneSphere Environment.

![](/uploads/media/2018/1/discovering-hpe-onesphereapi-pic2-1516725892380.jpg "Custom OneSphere Environment in Postman")

You will have to configure the environment so it matches your HPE OneSphere URL, username and password. Also, make sure each property is checked. Leave Token empty for now. Once this is done, you are ready to apply any of the calls from the HPE OneSphere Collection to the HPE OneSphere Environment. 

> Note: if you have more than one HPE OneSphere Environment to test, just duplicate environments and use the same collection of calls after selecting the right environment from the Environment drop-down list in the upper right corner.

## Click & Send
- To test that your environment points to the right URL, use the first call from the collection: **GET /rest/status**
- To get a session token with the credentials you provided in the environment, use the second call of the collection: **POST /rest/session**
- To terminate your API discovering session, call the third call from the collection: **DELETE /rest/session**
- Use any of the other calls provided in the collection to explore the rest of the API
- Feel free to duplicate TAB and create your own calls which you can then Save as... into the collection with a new name

> Note that you might have to edit some of the advanced calls to match the uri of your environment.

## Follow the link!
Let's say we picked one of the calls such as **GET /rest/users** and pressed **Send**. We get presented with the JSON response of the API call as shown below:

![](/uploads/media/2018/1/discovering-hpe-onesphereapi-pic3-1516725898884.jpg "Retrieving HPE OneSphere users in Postman")

You will notice that there are many active links in the response. In our case, the uri of each user is one active link. If we click on one of those links, Postman will open a new tab and automatically populate the verb GET to this uri. All we have to do is click **Send** to drill down on this object.

If you get a status code of 401 (Unauthorized), select the Settings from Postman File menu, and make sure that the option "Retain headers when clicking on links" is ON. This will make sure that HTTP Headers (including our Authorization Header) is carried across links.

![](/uploads/media/2018/1/discovering-hpe-onesphereapi-pic4-1516725904168.jpg "Retaining links while clicking on links in Postman")

Isn't that cool? You are now ready to explore the entire [HPE OneSphere](https://www.hpe.com/us/en/solutions/cloud/hybrid-it-management.html) API. Enjoy!

## Next Step?
In a next article we will leverage this knowledge of the API to assemble calls into a simple script using a universal tool called cURL.


