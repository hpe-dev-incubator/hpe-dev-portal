---
title: Accessing the HPE OneView Global Dashboard API
date: 2018-10-11T15:14:06.880Z
featuredBlog: false
priority: null
author: Brad Stanleys
authorimage: /img/blogs/Avatar3.svg
thumbnailimage: null
tags:
  - hpe-oneview-global-dashboard
---
By Brad Stanley

Software Engineer working on Global Dashboard## Welcome
With OneView Global Dashboard 1.6, we are happy to introduce its REST API! This means that you can query all of the appliances that have been added to Global Dashboard via command line, and even scripts if you are ambitious enough. There will be more on that later. In addition to querying the appliances, you can also add and delete appliances with our REST API. ### REST API? 

First, HPE OneView has some great blogs about their REST API, and some overhead information about how to use that. 

Check out [this blog](/blog/first-step-with-programming-the-hpe-composable-api) for a quick introduction to REST APIs, which includes information about tools like POSTman. And [here](/blog/curling-through-the-oneview-api) you could read a blog about cURL syntax. 

### Hackathon

Recently, we had a hackathon at work. This gave a few developers a chance to play with our REST API.  It is possible that offers of free doughnuts and pizza also enticed the developers, but hopefully, it was primarily the opportunity to create something new.

In the script we created, a few different things would happen.

First, a OneView appliance was added to a Global Dashboard. 

Then, some summary data was obtained. This was done by using the endpoints for the various resources, e.g. enclosures, server profiles, etc. The most interesting data came from resource alerts. Global Dashboard collects all of the critical alerts from the appliances it monitors. When there are enough critical alerts, you can begin to see the same alerts from different HPE OneView appliances. Using the REST API and some simple scripting, the script would print out how many instances of each alert there are. This could be an extremely useful tool for anyone troubleshooting at a data center.

Let’s say someone has the same exact alert on X different HPE HPE OneView appliances. The script could alert you to which HPE OneView appliances have that same alert, so that the solution could then be applied to quickly address those X alerts. That saves whoever is troubleshooting valuable time. 

Beyond that, you could build an interactive script that would let you type in notes. With that, when a fix is found, you could type in what that fix is and associate it with the critical alert. Then, the next time that alert rears its ugly head, your beloved script could give you a head start by informing you how you solved it last time. The script could grow over time and be a one-stop seek-and-destroy alerts shop.

### Using REST API

There are two key steps in the above example: adding an appliance, and then querying the resource alerts endpoint. 

To add an appliance there are a few steps, and this is where it can be helpful to use a tool like POSTman. 

#### **Add an appliance**

* `POST https://<Global Dashboard IP>/rest/login-sessions`

  * Look at your Global Dashboard’s API docs for more information: `https://<Global Dashboard IP>/apidoc/#tag/Login-Sessions`
  * For Global Dashboard versions 2.1 and earlier, this will need to be done with x-api-version having a value of 2
  * And content-type will need to be specified with application/json
  * If you look at your Global Dashboard’s API docs, you’ll see under Header Parameters that these two fields are required
  * You’ll also notice a required Request Body, which is comprised of your userName, password and optionally an authLoginDomain

    * An example of this can be seen at the same API doc link that is above
  * Send the POST and you’ll get back a response that includes a token
* `GET https://<Global Dashboard IP>/rest/certificates/https/remote/<HPE OneView IP>`

  * Look at your Global Dashboard’s API docs for more information: `https://<Global Dashboard IP>/apidoc/#tag/Certificates`
  * Again, pay attention to the required parameters, one of them is auth which is the token you retrieved from the POST call 
  * This will return a large body of information, which will be needed for the next call* `POST https://<Global Dashboard IP>/rest/certificates/servers`
  * Look at your Global Dashboard’s API docs for more information: `https://<Global Dashboard IP>/apidoc/#tag/Certificates`
  * The request body has a lot of information mentioned in the API docs, but it is simple: copy the whole body that was returned from the previous call, and paste that into the body of this call
* `POST https://<Global Dashboard IP>/rest/appliances`

  * Look at your Global Dashboard’s API docs for more information: `https://<Global Dashboard IP>/apidoc/#tag/Appliances`
  * The POST to /certificates/servers added the HPE OneView certificate to Global Dashboard, which enables the HPE OneView to now be added

#### **Query resource alerts**

* `GET https://<Global Dashboard IP>/rest/resource-alerts`

  * Look at your Global Dashboard’s API docs for more information: `https://<Global Dashboard IP>/apidoc/#tag/Resource-Alerts`
  * This will return at most one page of alerts, which is 25

    * In order to get more alerts, append `?count=-1` to your query so it will look like: `https://<Global Dashboard IP>/rest/resource-alerts?count=-1`
    * That will return up to 500 alerts, and if you have more than 500 alerts you would use a query like the following to get more

      * `https://<Global Dashboard IP>/rest/resource-alerts?count=500&start=500`
    * This endpoint is unique because it also allows the user to get back data in a CSV format

## Until Next Time

Throughout the API docs, which are accessible from your Global Dashboard, there are a number of different endpoints and information about required parameters and how to use them. Keep an eye on this blog for more about our REST API and other exciting features from OneView Global Dashboard.