---
title: "Using Postman with HPE SimpliVity "
date: 2018-11-09T17:39:07.394Z
featuredBlog: false
priority: null
author: Ron Dharma
authorimage: /img/blogs/Avatar1.svg
thumbnailimage: null
tags:
  - hpe-simplivity
---
# Summary

This article is the first in a series that describes how to use the HPE SimpliVity API. The articles are targeted at developers and architects that want to understand the REST API’s capabilities and are interested in learning how to build automation and integration with HPE SimpliVity. 

This article uses Postman to place HPE SimpliVity REST API calls without writing any code. Postman is a free application from Postdot Technologies. It is available for Windows, Mac, Linux and as a Chrome browser plugin. You can download and install it from `https://www.getpostman.com/postman`. 

At the end of this article, you should be able to use Postman to create variables to store the values that you need to use in other Postman exercises and to retrieve the set of virtual machines managed by an HPE SimpliVity federation. 

This article assumes that you understand how to navigate and use the Postman interface. If you are totally new to Postman, I recommend that you watch a few videos on creating variables in Postman.

# Let's get started!

To begin, I need the credentials to access to the HPE SimpliVity virtual controller through TCP/IP.  You can use the vCenter local SSO administrator for the vCenter used in the HPE SimpliVity federation. I  use my domain username which has the `username@domainname` format.  

I also need to disable Postman’s certificate validation. To turn the feature off, I click the icon on the Postman ribbon. (You can skip this if you have signed the SSL certificate used by HPE SimpliVity with trusted root.) 


![svt turn off ssl cert](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/11/svt-turn-off-ssl-cert-1542122449127.png)

# Set up environment variables

I use variables to store the values that I know I need to use in my Postman requests. First, I declare the  variables that I use as input to REST API requests: 

* `OVC_IP`: Stores the virtual controller IP address. 
* `VcenterAdminName`:  Stores my vCenter user name. 
* `vCenterAdminPasswd`: Stores my vCenter password. 

Next, I declare a set of variables to store the results of my REST API requests:  

* `token`: Stores the access token that is returned from an authenticated session. (We’ll learn how to authenticate in the next article.) I'll need this for many requests, so storing it in a variable makes it easy to transfer it among the requests.
* `TASKID`: Stores HPE SimpliVity task IDs. 
* `VMID`: Stores the virtual machine ID. 

For example: 

![svt postman variable definitions](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/11/svt-postman-variable-definitions-1542122682743.png)

# Define the URI, header, and body parameters to request an access token

For my first REST request, I use the POST action to send the access token request. I need to define the URI, header, and body parameters for it. 

The URI to request an access token has this syntax: 
``https://simplivity@<OVC_IP>/api/oauth/token``

 I use the `OVC_IP` variable that I defined earlier. 

I need to send the `Accept` and the `Content-Type` headers with my request, so I define two key-value pairs for them. For example:


![svt url body params](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/11/svt-url-body-params-1542122702407.png)

Finally, I define three key-value pairs for the Body of the request: `grant_type`, `username`, and `password`. 

In Postman, I select `form-data` to store these key-value pairs. I assign the `VcenterAdminName` and `vCenterAdminPassword` variables to the username and password keys. 

For example: 

![svt formdata body params](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/11/svt-formdata-body-params-1542122691875.png)

I then move to the Tests tab where I define a script that intercepts the return value from the REST request. It parses the keyword token and stores it into the `data_access_token` variable.

For example:

![svt test script postman](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/11/svt-test-script-postman-1542124697949.png)

Assuming that you have entered the `OVC_IP`, `username`, `password` and the key-value pairs, you are ready to send a REST request by clicking **Send**. 
That's it! You just made your first HPE SimpliVity REST request. 

This request returns the access token that you need to use on many HPE SimpliVity requests. The access token value from my example is shown highlighted in yellow in the following example. 

![svt request access token](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/11/svt-request-access-token-1542124824497.png)


You can now validate that the token’s current value is the same as the value in the body of the POST result. It’s so easy isn’t it?# This is easy, let's take it up a notch!

Now that I have the access token, I can perform other REST operations using the same variables that I built before. 

Let’s give it a try and get all of the virtual machines managed by HPE SimpliVity. 

Start by creating a GET operation in a new Request tab of Postman.  Just like before, we need to define the URI for the GET request. It has this syntax: 

``https://<OVC_IP>/api/virtual_machines``

Since I have defined the variable OVC_IP, let’s use it for our next adventure.

![svt get all vms url](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/11/svt-get-all-vms-url-1542125040577.png)

Enter the parameters for this request by clicking on the Params tab. 

Provide the `limit`, `offset`, and `show_optional_fields`, as defined in the specification for the REST API GET VM call. You can find the definition here: 
https://developer.hpe.com/api/simplivity/endpoint?&path=%2Fvirtual_machines




![svt get all vms params](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/11/svt-get-all-vms-params-1542125124954.png)

I also need to provide the access token that I acquired in the previous POST request.  Because I used variables, there is no need to worry about copying the 16+ character hexadecimal value without error. I just enter the Authorization value in the form of `Bearer {{token}}` then click *Send*, and let Postman do the magic. 


![svt get all vms headers](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/11/svt-get-all-vms-headers-1542125232197.png)

The request returns the list of the virtual machines that are managed by HPE SimpliVity. You can see the offset value and the limit value for validation of the parameters that I entered for this request. 

I highlighted the VM ID below because it is one of the fields that is useful for many other requests. 

You can use the same strategy that I did above by entering the VM ID into another variable and so on.

![svt offset limit](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/11/svt-offset-limit-1542125309822.png)

That's it! # What have I learned? 

Postman is great for experimentation to develop my understanding of the REST API. Postman supports the use of variables that can be manipulated with very little effort. 

Do I want to write a script using Postman? Probably not. I use PowerShell as my choice for automation as you can see in the following YouTube video: https://www.youtube.com/watch?v=pBnadRc1Vsw  

Scripting languages, such as PowerShell, provide a rich library of features that I need to perform automation.


To learn more about using Python curl to obtain an access token, go to https://developer.hpe.com/platform/hpe-simplivity/authenticating-against-hpe-omnistack-api.


