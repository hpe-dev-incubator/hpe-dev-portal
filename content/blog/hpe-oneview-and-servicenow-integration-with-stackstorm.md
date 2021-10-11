---
title: HPE OneView and ServiceNow integration with Stackstorm
date: 2021-09-29T17:53:58.637Z
author: Rick Kauffman
authorimage: /img/Avatar2.svg
---
![](http://www.techworldwookie.com/blogpost/flowchart.png)

HPE OneView is a powerful infrastructure automation/management platform from Hewlett Packard Enterprise (HPE) used to manage and monitor HPE DL servers and HPE Synergy products. Recently, I wanted to get all the alarms from HPE OneView and automatically save them as records in a ServiceNow table. ServiceNow is a software as a service (SaS) used by many large corporations for automating critical business workflows and information.  I wanted to make a event based automation that would leverage HPE OneView and ServiceNow's Restful APIs. Having developed solutions for this same task in StackStorm (HPE Nimble Storage to ServiceNow), it was super easy to dust off the StackStorm integration pack I created for HPE Nimble and refactor it for HPE OneView. Creating such an integration pack would give users a way to transfer these alarms into a ServiceNow table, with very little human intervention. Naturally, my second thought was how can I use the Twitter platform to 'tweet' some VLAN (or any other) information into HPE OneView! 

HPE OneView has a powerful RESTful API that can be used to get information in and out of HPE OneView. ServiceNow has a powerful RESTful API as well. All that I need to do is some middleware and leverage a couple of Python bindings (Python code that abstracts the API). Turns out the python bindings are already written for both systems and available on GitHub! Seems easy enough, To solve this problem I can write a handful of Python scripts and I should be good to go (or GTG if you're hip and cool).

I quickly realized that, in order to do what I wanted to do, it would involve writing the code for both systems. But what if I were to leverage StackStorm? StackStorm is an event based automation platform with over one hundred and seventy 3rd party integrations just waiting to be consumed! A quick check of the StackStorm Exchange indicates that there's a StackStorm integration pack available for ServiceNow. Using StackStorm, I'd only have to write half the code, as I would only have to write the code for an HPE OneView StackStorm integration pack. The other benefits of using StackStorm is I can take advantage of the programmable rules and triggers. Something I like to call "Real automation".

Note: I have written a couple of other blog posts on StackStorm. If you are interested in trying this approach, I suggest you go to the HPE DEV blog and read my other posts.

Developing the stackstorm-hpe-oneview integration pack (which is available here) is fairly straightforward. For this interaction to function, you will have to write five very short actions and a couple of simple rules. You can see in the chart at the top that two of the actions will be used with the first workflow and three will be need for the second workflow. Actions are the workhorse of Stackstorm. They are basically recycled scripts that you might of used in the past and easily refactored to work with the StackStorm framework. 

For instance, I could use a single action to connect to HPE OneView and request all of the current alarms.

you would write to accomplish this task. All that needs done is to  add just a few lines of code to turn them into Stackstorm actions. Let's have a look!

![](http://www.techworldwookie.com/blogpost/action.png)

The flow of the above code is simple. This is a script that gets the alarms from HPE OneView, checks to see if it is a list and if so, returns it. Super simple. The second action in workflow "A" will format the information into a mongo record, add a process field and save the mongo document. Again, this is very simple to code and test. The class is passed the alarms and iterates through each one, a query to check if the document exists and if not, formats a dictionary and writes the document via pymongo. This is all it takes to collect the alarms and save them in the database. 

![](http://www.techworldwookie.com/blogpost/load.png "Load database example")

The second workflow, workflow "B" will call another action every five minutes that reads the documents from the mongo database, looks for the processed flag set to no, collects the results into a python list and returns it. 

![](http://www.techworldwookie.com/blogpost/get-records.png "Get documents from mongo")

The next task is to send the list of alarms to ServiceNow. Here is where the power of integration packs comes into view. All we need to do is issue a command on the Stackstorm server **"st2 pack install servicenow"**. By issuing this command we gain access to the automation scripts (actions) that are pre-written. This makes the job much easier. What if I wanted to integrate Twitter into my automation flow? Easy, **st2 pack install twitter**.  I won't show you the ServiceNow action script here but you can look at if on the exchange if you like here: <https://github.com/StackStorm-Exchange/stackstorm-servicenow/blob/master/actions/create_record.py>

To finish this up we want to set the process flag to "Yes" so we do not put duplicate records into ServiceNow. It looks like this:

![](http://www.techworldwookie.com/blogpost/process.png "Process flag")

That's it! Once both integration packs are installed on a Stackstorm server and authorized, the rules will 'fire' every five minutes and the workflows will do the heavy lifting so we don't have to. 

Finally, a diagram that shows all the moving parts of workflow "A". The rule that runs on the interval timer, call an action that in turn calls a workflow that calls a couple other actions. Notice that actions can be python scripts or YAML files. It just depends on their function. 

![](http://www.techworldwookie.com/blogpost/full-workflow.png "Workflow \\\"A\\\"")

To make this a truly automated process the ServiceNow account needs to exist and the tables need to be created. In conclusion, this may seem complicated at first. In reality, it a group of small simple scripts that are linked together inside the Stackstorm framework. It also provides for the integration of many different integration packs and allows for the event based automation of many different systems. To learn more about stackstorm, you can take my tutorial and join the automation revolution!

``