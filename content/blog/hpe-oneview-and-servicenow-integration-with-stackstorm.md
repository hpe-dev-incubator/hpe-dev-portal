---
title: HPE OneView and ServiceNow integration with Stackstorm
date: 2021-09-29T17:53:58.637Z
author: Rick Kauffman
authorimage: /img/Avatar2.svg
---
![](http://www.techworldwookie.com/blogpost/flowchart.png)


HPE OneView is a powerful infrastructure automation/management platform used with HPE DL servers and HPE Synergy products. I started thinking, how would I get all the alarms and 'automatically' save them as records in a ServiceNow table. Naturally, my second thought was how can I tweet some vlan information into OneView! 

HPE Oneview has a powerful Restful API and it can be used to get the information in and out of OneView. ServiceNow has a powerful Restful API as well. All that is needed is some middleware and a couple of python bindings (python code that abstracts the API). Turns out the python bindings are already written for both! Seems easy enough, write a couple of python scripts, and we should be good to go, or GTG if you're hip and cool.

This would involve writing the code for **both systems**. What if we leveraged Stackstorm? A quick check of the Stackstorm exchange [exchange.stackstorm.com](exchange.stackstorm.com) and we find that there is Stackstorm integration pack available for ServiceNow. If we use Stackstorm, we only have to write **half** the code. All that needs done is to write the code for a HPE OneView Stackstorm integration pack. 

I have written a couple of other blogs on Stackstorm and if you are interested in trying this approach, I suggest you go to <https://developer.hpe.com/blog/tag/stackstorm> and read my other posts.

Developing the **stackstorm-hpe-oneview** integration pack, which is available here: <https://github.com/HewlettPackard/stackstorm-hpe-oneview>, is fairly straightforward. For this integration to function we will have to write five very short actions and a couple of simple rules. You can see in the chart at the top that two of the actions will be used with the first workflow and three will be need for the second workflow. Actions are the workhorse of Stackstorm. They are basically the same thing you would write to accomplish this task. All that needs done is to  add just a few lines of code to turn them into Stackstorm actions. Let's have a look!

![](http://www.techworldwookie.com/blogpost/action.png)

The flow of the code is simple. This is a very simple script that gets the alarms from HPE OneView

![]( "Workflow example")

The second workflow will call another action every five minutes that reads the documents from the mongo database, looks for the processed flag set to no, and sends the document to the ServiceNow action to create a record (this was prewritten and available on the exchange!)

![]( "Workflow example")

That's it! Once both integration packs are installed on a Stackstorm server and authorized, the rules will 'fire' every five minutes and the workflows will do the heavy lifting so we don't have to. 

I could stop the blog post here because the two integration packs are already available and running on my Stackstorm server. However, I know that curious minds would want to know what is really happening behind the scene. Let's take a look!

The first thing is to get the alarms from the HPE OneView Server. That is a simple action to make the call to fetch all of the alarms. Each alarm is represented as a JSON string which is perfect for storing as a mongo document. The next part of our action would leverage pymongo. We add the extra process field, set to 'no' and save the record. 

Once we have all the alarm data

``

``