---
title: HPE OneView and ServiceNow integration with Stackstorm
date: 2021-09-29T17:53:58.637Z
author: Rick Kauffman
authorimage: /img/Avatar2.svg
---
HPE OneView is a powerful infrastructure automation/management platform used with HPE DL servers and HPE Synergy products. I started thinking, how would I get all the alarms and 'automatically' save them as records in a ServiceNow table. Naturally, my second thought was how can I tweet some vlan information into OneView! 

HPE Oneview has a powerful Restful API and it can be used to get the information in and out of OneView. ServiceNow has a powerful Restful API as well. All that is needed is some middleware and a couple of python bindings (python code that abstracts the API). Turns out the python bindings are already written for both! Seems easy enough, write a couple of python scripts, and we should be good to go, or GTG if you're hip and cool.

This would involve writing the code for **both systems**. What if we leveraged Stackstorm? A quick check of the Stackstorm exchange [exchange.stackstorm.com](exchange.stackstorm.com) and we find that there is Stackstorm integration pack available for ServiceNow. If we use Stackstorm, we only have to write **half** the code. All that needs done is to write the code for a Stackstorm integration pack. 

I have written a couple of other blogs on Stackstorm and if you are interested in trying this approach, I suggest you go to <https://developer.hpe.com/blog/tag/stackstorm> and read my other posts.

Developing the **stackstorm-hpe-oneview** integration pack, which is available here: <https://github.com/HewlettPackard/stackstorm-hpe-oneview>, is fairly straightforward. We are going to need a couple of actions, a couple of rules and some triggers to get the process running based on specific events. Actions are the workhorse of Stackstorm. They are basically the same thing you would write to accomplish this task. All that needs done is to  add just a few lines of code to turn them into Stackstorm actions. 

![]( "Example of an Actio")

The flow of the code is simple. We are going to use two Stackstorm workflows (just a collection of actions). The first will be responsible for getting the alarms from HPE OneView every five minutes. Once the alarms are collected, we will save them in a mongo database. We need a mechanism to determine if we have processed the mongo documents. We will add a field to the mongo record to indicate the the record by default has not been processed. So, process='no' will work just fine. 

![]( "Workflow example")

The second workflow will call another action every five minutes that reads the documents from the mongo database, looks for the processed flag set to no, and sends the document to the ServiceNow action to create a record (this was prewritten and available on the exchange!)

![]( "Workflow example")

That's it! Once both integration packs are installed on a Stackstorm server and authorized, the rules will 'fire' every five minutes and the workflows will do the heavy lifting so we don't have to. 

I could stop the blog post here because the two integration packs are already available and running on the server. However, I know that curious minds would want to know a little more about what is really happening behind the scene. Let's take a look!

The first thing is to get the alarms from the HPE OneView Server. That is a simple action to make the call to fetch all of the alarms. Each alarm is represented as a JSON string which is perfect for storing as a mongo document. The next part of our action would leverage pymongo. We add the extra process field, set to 'no' and save the record. 

Once we have all the alarm data