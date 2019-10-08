---
title: The Power of Single Sign-On with HPE OneView
date: 2019-07-11T19:44:24.540Z
author: Vincent Berger 
tags: ["HPEOneView"]
path: the-power-of-single-sign-on-with-hpe-oneview
---
An infrastructure management tool, like [HPE OneView,](https://www.hpe.com/us/en/integrated-systems/software.html) allows IT to do most day-to-day infrastructure administration tasks. But there are cases where other related tools can be useful too. It can be tedious to remember how to log on to all these different tools. Sure, you can use a password safe tool, or (please don’t do this…) a TXT file edited with Notepad. 

A better way is to use a single sign-on between different tools, meaning that you log on once with the most encompassing tool, and then drill down to other dependent tools without having to log on again. This is very straightforward when you use a GUI that allows you to follow hyperlinks, but it can also be done with APIs and your favorite programming language.

In this article I will show you how to use [Postman](https://www.getpostman.com/) to work with REST APIs. I will begin with [HPE OneView Global Dashboard](https://buy.hpe.com/b2c/us/en/software/converged-infrastructure-management-software/converged-infrastructure-management/oneview-management-software/hpe-oneview-global-dashboard/p/1009187269) which gives you an overall view of a datacenter, one that could be very large (up to 20,000 servers are supported in the latest version). From there, I will drill down with single sign-on (SSO) to an HPE OneView appliance. And from there, to the [Redfish API](https://developer.hpe.com/platform/ilo-restful-api/home) provided by the iLO of a server – all without having to pass credentials again after the initial logon.

So, let’s start with the HPE OneView Global Dashboard and log on with a POST call to /rest/login-sessions with a few headers shown below and a body set to this JSON content:
{"userName":"your_username","password":"your_password"}

You should see a response like this:


![5bf2e1a0cd93d0796238ae01-blog-content-1562874385558](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/5/picture1-1562874385556.png)

The important data returned is the content of the token key, or sessionID, which is the same value. We will carry this token in the “auth” header of all subsequent calls to the HPE OneView Global Dashboard API.

Let’s look at how to connect to an HPE OneView appliance that was previously registered in our HPE OneView Global Dashboard. We can get a list of appliances with a GET to /rest/appliances, from which we get the UUID of the appliance we want. Here it is shown as 5224a1f9-f272-4501-8fbb-80b3d9c13339.

When we do a GET on /rest/appliances/5224a1f9-f272-4501-8fbb-80b3d9c13339/sso we receive a response like this:


![5bf2e1a0cd93d0796238ae01-blog-content-1562874422292](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/5/picture2-1562874422291.png)


Once again, the value we are interested in here is the sessionID.  We will use it in the auth header for subsequent calls to the HPE OneView appliance. We did not have to pass a username/password to the HPE OneView appliance, since we received a token from our HPE OneView Global Dashboard authenticated session. We can use this token to do anything we want to this particular HPE OneView appliance. For instance, we can get a list of servers managed by the appliance with a GET call to /rest/server-hardware, this time directing it to the IP address of the HPE OneView appliance instead of HPE OneView Global Dashboard.


![5bf2e1a0cd93d0796238ae01-blog-content-1562874460780](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/5/picture3-1562874460779.png)

Now, I’ll show you how to use the Redfish-compliant REST API of the iLO of a server to get more details than what surfaces in HPE OneView. Following the same principle, we will find the UUID of the server we are interested in, and we will make a GET call to /rest/server-hardware/{uuid}/remoteConsoleUrl

![5bf2e1a0cd93d0796238ae01-blog-content-1562874508773](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/5/picture5-1562874508772.png)

From the response, we get a link to the iLO remote console of that server, but we can use the data for other purposes as well. It gives us the IP address of the iLO (192.168.3.105) and a session key (8da4257ecf181c186f2510a03ac2a2fe). With that, we can make calls to the iLO without having to create a session with username/password credentials. For example, we can get the list of all DIMM memory slots in the server and which DIMMs are installed in them.

![5bf2e1a0cd93d0796238ae01-blog-content-1562874564544](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/5/picture6-1562874564543.png)



![5bf2e1a0cd93d0796238ae01-blog-content-1562874569156](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/5/picture7-1562874569155.png)

As you can see, single sign-on is an easy, yet powerful, way to use different tools with minimum hassle. I hope you found this tutorial useful. Please continue to follow our [blog posts](https://developer.hpe.com/blog) for more ways to optimize your software development environment. I would be very interested to see how you are creating your own shortcuts. Feel free to connect with me and the team on [Slack](https://slack.hpedev.io/) to share your experiences and ask questions.