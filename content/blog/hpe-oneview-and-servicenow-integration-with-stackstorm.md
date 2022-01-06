---
title: HPE OneView and ServiceNow integration with StackStorm
date: 2021-09-29T17:53:58.637Z
author: Rick Kauffman
authorimage: /img/Avatar2.svg
tags:
  - hpe-oneview
  - StackStorm
  - ServiceNow
---
HPE OneView is a powerful infrastructure automation/management platform from Hewlett Packard Enterprise (HPE) used to manage and monitor HPE DL servers and HPE Synergy products. Recently, I wanted to get all the alarms from HPE OneView and automatically save them as records in a ServiceNow table. 

ServiceNow is a software as a service (SaS) used by many large corporations for automating critical business workflows and information.  I wanted to make an event-based automation that would leverage HPE OneView and ServiceNow's Restful APIs. There is another way to do this but I found it was a bit too 'involved' and I wanted something easy. Who doesn't like easy? 

Having developed solutions to complete an identical task in StackStorm (HPE Nimble Storage to ServiceNow), it was super easy to dust off the StackStorm integration pack I created for HPE Nimble and refactor it for HPE OneView. Creating such an integration pack would give users a way to transfer these alarms into a ServiceNow table, with very little human intervention. Naturally, my second thought was how can I use the Twitter platform to 'tweet' some VLAN (or any other) information into HPE OneView! Can it be done?

HPE OneView has a powerful RESTful API that can be used to get information in and out of HPE OneView. ServiceNow has a powerful RESTful API as well. All that I need to write is some middleware and leverage a couple of Python bindings (Python code that abstracts the API). Turns out the python bindings are already written for both systems and available on GitHub! To solve this problem I can write a handful of Python scripts and I should be good to go (or GTG if you're hip and cool).

I quickly realized that, in order to do what I wanted to do, it would involve writing the code for both systems. But what if I were to leverage [StackStorm](https://stackstorm.com/)? StackStorm is an event based automation platform with over one hundred and seventy 3rd party integrations just waiting to be consumed! A quick check of the [StackStorm Exchange](https://exchange.stackstorm.org/) indicates that there's a StackStorm integration pack available for ServiceNow. Using StackStorm, I'd only have to write half the code, as I would only have to write the code for an HPE OneView StackStorm integration pack. The other benefit of using StackStorm is I can take advantage of the programmable rules and triggers. Something I like to call 'Real automation'.

Note: I have written a couple of other blog posts on StackStorm. If you are interested in trying this approach, I suggest you go to the HPE DEV blog and [read my other posts](https://developer.hpe.com/search/?term=stackstorm).

![](https://techworldwookie.com/blogpost/flowchart.png)

Developing the stackstorm-hpe-oneview integration pack (which is available [here](https://github.com/HewlettPackard/stackstorm-hpe-oneview)) is fairly straightforward. For this interaction to function, I wrote five very short actions and a couple of simple rules. You can see in the chart at the top of this blog that two of the actions will be used with the first workflow and three will be need for the second workflow. Actions are the workhorse of StackStorm. Actions have a 'runner-type' and there are [12 different ones](https://docs.stackstorm.com/actions.html) to choose from. They can be shell scripts, Python scripts, or Orquesta for creating workflows. I could use a single action to connect to HPE OneView and request all of the current alarms and another to format and store the alarms in a MongoDB database for further processing.

In the code example below I am using the alerts.get_all() function to retrieve the alarms from HPE OneView. A quick check to see if the object is a list and return it.

```python
from lib.actions import HpeOVBaseAction

class networks(HpeOVBaseAction):
    def run(self):
        ov_alerts = self.client.alerts.get_all()
        if isinstance(ov_alerts, list):
            return (True, ov_alerts)
        return (False)
```

The second action in workflow "A" will format the information into a MongoDB record, add a process field and save the MongoDb BSON document. Again, this is very simple to code and test. The class is passed the alarms and iterates through each one, a query to check if the document exists and if not, formats a Python dictionary and writes the MongoDb BSON document via pymongo. This is all it takes to collect the alarms and save them in the database. 

```python
import pymongo
from lib.actions import MongoBaseAction


class loadDb(MongoBaseAction):
    def run(self, alarms):

        mydb = self.dbclient["app_db"]
        known = mydb["dwralarms"]

        new_alarm={}

        for alarm in alarms:
            myquery = { "_id" : alarm['created'] }
            records = known.find(myquery).count()
            if records == 0:
                new_alarm['u_vendor']='hpe-oneview'
                new_alarm['u_sev']=alarm['severity']
                new_alarm['u_desc']=alarm['description']
                new_alarm['u_uuid']=alarm['resourceUri']
                new_alarm['_id']=alarm['created']
                new_alarm['u_created']=alarm['created']
                new_alarm['u_process']='no'
                write_record = known.insert_one(new_alarm)
                
        return (records)
```

Here is an example of the StackStorm workflow that calls two actions every five minutes. 

```yaml
version: 1.0

description: A workflow to copy HPE OneView alarms into a mongo database.

tasks:
  getalarms:
    action: hpeoneview.get_alerts
    next:
      - when: <% succeeded() %>
        publish:
          - alarms: <% result().result %>
        do: sendmongo

  sendmongo:
    action: hpeoneview.load-hpeov-alarms alarms=<% ctx().alarms %>
```

The second workflow, workflow "B" will call another action every five minutes that reads the documents from the MongoDB database, looks for the processed flag set to no, collects the results into a Python list and returns it. 

```python
import pymongo
from lib.actions import MongoBaseAction


class loadDb(MongoBaseAction):
    def run(self):

        mydb = self.dbclient["app_db"]
        known = mydb["dwralarms"]

        list_to_process = []

        myquery = { "u_process" : 'no' }
        records = known.find(myquery)

        for r in records:
            list_to_process.append(r)

        return (list_to_process)
```

The next task is to send the list of alarms that have not been processed to ServiceNow. Here is where the power of integration packs comes into view. All I need to do is issue a command on my StackStorm server **"st2 pack install servicenow"**. By issuing this command, I gain access to the automation scripts (actions) that are pre-written for ServiceNow. Now that I am using StackStorm and have access to all the automation on the StackStorm exchange. I can communicate with many other systems without writing any vendor specific code to do so. The following example is the ServiceNow action that creates records in a ServiceNow table.

```python
from lib.actions import BaseAction


class CreateRecordAction(BaseAction):
    def run(self, table, payload):
        s = self.client

        path = '/table/{0}'.format(table)
        response = s.resource(api_path=path).create(payload=payload)
        return response
```

Here is what the workflow looks like for the collection of alarms and sending them to ServiceNow. The first action pulls the unprocessed alarms from the MongoDB database and publishes the array to the 'context', a place to stash variables that can be accessed by other actions. Next it iterates through the array by using the 'with' statement and sends the contents to ServiceNow. 

```yaml
version: 1.0

description: A workflow to copy HPE OneView alarms from mongo and into snow.

tasks:
  getalerts:
    action: hpeoneview.get_mongo_alarms
    next:
      - when: <% succeeded() %>
        publish:
          - alarms: <% result().result %>
        do: snowalerts

  snowalerts:
    with: <% ctx().alarms %>
    action: servicenow.create_record table="u_hpeov_alarms" payload='<% item() %>'
    next:
      - when: <% succeeded() %>
        do: processalarms

  processalarms:
    action: hpeoneview.process_alarms alarms=<% ctx().alarms %>
```

To finish this up, set the process flag to "Yes" so you do not duplicate records into ServiceNow. It looks like the example below:

```python
import pymongo
from lib.actions import MongoBaseAction


class loadDb(MongoBaseAction):
    def run(self, alarms):

        mydb = self.dbclient["app_db"]
        known = mydb["dwralarms"]

        for a in alarms:
            known.update_one({"_id":a['_id']},{"$set":{"u_process":"yes"}})

        return ()
```

That's it! Once both integration packs are installed on a StackStorm server and authorized, the rules will 'fire' every five minutes and the workflows will do the heavy lifting so you don't have to. 

Finally, a diagram that shows all the moving parts of workflow "A". The rule that runs on the interval timer calls an action that, in turn, calls a workflow that calls a couple other actions. Notice that actions can be Python scripts or YAML files. It just depends on their function. 

![](https://techworldwookie.com/blogpost/full-workflow.png "Workflow ")

To make this a truly automated process, the ServiceNow account needs to exist and the tables need to be created in advance. 

**Let's break down the steps to get this going.** 

1. Create the tables in ServiceNow, you will need your instance ID from ServiceNow to authorize the StackStorm server.
2. Install the HPE OneView StackStorm integration pack and authorize it. 
3. Install the ServiceNow StackStorm integration pack and authorize it.
4. Wait five minutes.

In the beginning of this blog I mentioned tweeting information into HPE OneView. I don't know why you would want to do this but yes, with StackStorm it is possible. StackStorm exchange has a Twitter integration pack and it can be installed on the StackStorm server by issuing the command 'st2 pack install twitter'. I can use the twitter StackStorm sensor to 'watch' the twittersphere for any tweets containing a certain word or phrase contained in the tweet-body. If the sensor reacts, it will cause a StackStorm trigger to fire and I can call an action to pull the tweet and collect the information from the tweet-body and send that information to the HPE OneView Stackstorm actions. This can be done with ANYTHING on the StackStorm exchange.

In conclusion, this may seem complicated at first. In reality, its a group of small simple scripts that are linked together inside the StackStorm framework. It also provides for the adoption of many different integration packs and allows for the event-based automation of many different systems. To learn more about StackStorm, you can take my [tutorial](https://github.com/xod442/stackstorm-tutorial), attend the StackStorm Workshop-on-Demand available [here](/hackshack/workshop/21) [](/hackshack/workshop/21)and join the automation revolution!