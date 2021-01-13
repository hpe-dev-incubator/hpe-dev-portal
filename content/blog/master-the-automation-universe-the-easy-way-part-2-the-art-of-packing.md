---
title: "Master the automation universe the easy way!  Part 2: The Art of Packing! "
date: 2020-07-28T13:46:21.282Z
author: Rick Kauffman 
tags: ["automation","StackStorm"]
path: master-the-automation-universe-the-easy-way-part-2-the-art-of-packing
---
![StackStorm integration pack](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/7/stackstorm-part2-1-1595944683785.png)

Recently, [I introduced you to StackStorm](https://developer.hpe.com/blog/master-the-automation-universe-the-easy-way-part-1-introduction-to-stack). In this post, I'll present StackStorm integration packs! StackStorm is one of the most innovative automation platforms I have had the opportunity of becoming familiar with. When you first start working with StackStorm, it can appear to be a bit overwhelming. But fear not. I will share with you all the secrets I have discovered in my unceasing googling of the interwebs. Naturally, I can't take you on a super deep dive in this post, so I will leave that to the documents page. But you can check out the full documentation over [here](https://docs.stackstorm.com/packs.html). Now, let's dive in!

A StackStorm integration pack is a predefined set of actions, sensors, rules, Python or shell scripts, and other miscellaneous items. A StackStorm pack has a specific structure that looks like what's shown in the picture below. Nested under the actions directory is the workflow directory.

```
# Contents of a pack
actions/                     #
rules/                       #
sensors/                     #
aliases/                     #
policies/                    #
tests/                       #
etc/                         # any additional things (e.g. training, scripts)
config.schema.yaml           # Configuration schema
packname.yaml.example        # example of config, used in CI
pack.yaml                    # pack definition file
requirements.txt             # requirements for python packs
requirements-tests.txt       # requirements for python tests
icon.png                     # 64x64 /png icon                        
```
The good news is, if you have some existing Python or shell scripts you are using for automating things, you will be able to recycle them with StackStorm. I will be working with Python scripts in this example. 

The first thing to do is pair the Python file **myPython.py** with a **myPython.yaml** file. When this is done, the resulting pair of files represents a StackStorm **action**. It can get a little confusing here. You will need a YAML file and a Python script in the **action directory** and both of them should have **the same name**. You can think of the YAML file as something that introduces the Python script.

**Actions**

Since the best place to start a journey is at the beginning, let me show you how easy it is to start packing by taking a look at the action YAML file.


```yaml
---
name: get_switches
pack: hpecfm
description: Get an array of switches from the hpecfm controller
runner_type: python-script
entry_point: get_switches.py
enabled: true
```

As you can see, defining the action is fairly straight forward. **YAML** files start with the action name and the name of the pack where the action is located. The obligatory description is always recommended. The runner type is a Python script but there are many others you can use as well (e.g. shell scripts, webhooks). Our entry point will be a Python script called **get\_switches**.

Here's a closer look at the get\_switches Python script:


```python
# A python script for getting a dictionary of switches

from pyhpecfm import fabric
from lib.actions import HpecfmBaseAction


class switchLookup(HpecfmBaseAction):
    def run(self):
        # Get switches from hpecfm controller.
        switches = fabric.get_switches(self.client)
        if isinstance(switches, list):
            # Setup a list for holding dictionaries
            switch_data = []
            # Iterate through switch data from CFM API
            for i in switches:
                # Build dictionary for return
                out = {
                      'u_health': i['health'],
                      'u_ip_address': i['ip_address'],
                      'u_mac_address': i['mac_address'],
                      'u_name': i['name'],
                      'u_sw_version': i['sw_version']
                      }
                switch_data.append(out)

            return (True, switch_data)
        return (False, switches)
```

You can take just about any Python script you have written in the past and wrap it up in a Python class where you reference the base action. **HpecfmBaseAction** is the script that performs the **API** authentication (other actions would have a different base action). It uses credentials in the **/opt/stackstorm/configs** directory to authenticate.

The script runs the **fabric.get\_switches()** function and assigns the output to a variable called **switches**. As the script runs, a little checking is performed and verifies the returned items are a Python list. If verified, the script proceeds. You'll receive a lot of information back in the returned results, but you only need a few fields. So, setup a loop and grab the five variables that you need and return the **switch\_data** array. By creating this action, you can now reference it in workflows.

**Workflows**

Workflows are YAML files that can run one or many actions. **Orquesta**, StackStorm's new workflow application, allows you to do some fairly complex workflows. If you're interested in learning more, check out [Orquesta](https://docs.stackstorm.com/orquesta/index.html).

Typically, a **sensor** would identify an event, load a **trigger,** and that trigger would cause a **workflow** to spring into action. Getting to know StackStorm is like eating an elephant, you'll have to take one bite at a time. Because of this, I will discuss sensors, triggers, and rules in another blog.

Earlier, I talked about how actions need the same name, but different file types. Workflows will appear odd at first because they will have the exact same name **and** file type. A workflow needs a YAML file, stored in the actions directory, just like the actions. It will also require **another YAML** file with the exact same name stored in the **/actions/workflows** directory. Don't worry. After you make several hundred StackStorm integration packs, you will get used to this. My little "trick" to help keep things straight in my head is to use an underscore in the title. For example, for an action, I would use **do\_this.yaml** and for a workflow I would use **dothis.yaml**.

OK, I'm getting to the end. I am going to wrap it up now with this example. Here, I have an action, **get\_switches**, but it's just an action. If I want to really automate, I need a workflow to run this action and then do something with the results. Below you will find the **getswitches** workflow. If we start with the introductory YAML, it will get us to the entry\_point, another YAML called getswitches.


```yaml
---
name: getswitches
description: A workflow for getting plexxi switches into stackstorm.
runner_type: orquesta
entry_point: workflows/getswitches.yaml
enabled: true
```

Here is a screenshot of the **getswitches** workflow YAML file stored in the actions/workflow directory.


```yaml
version: 1.0

description: A workflow to copy switch inventory from hpecfm to ServiceNow.

tasks:
  getswitches:
    action: hpecfm.get_switches
    next:
      - when: <% succeeded() %>
        publish:
          - switches: <% result().result %>
        do: sendsnow

  sendsnow:
    action: hpecfm.sendsnow switches=<% ctx().switches %>
```

When the workflow runs, it calls the action to **get\_switches**. We just have to prefix the action with the name of the pack that contains it. Once it has the Python list from the action, it can **publish** it in the **context,** in an array called switches. The information is stored in the context, which is a strange concept at first, but it's just a place for saving things so other actions can read from it. The workflow goes on to run a final action called **sendsnow**. You can see that the **sendsnow** (no underscore) is another **workflow** in the hpecfm StackStorm pack. Yes, workflows can call other workflows. I'll just pause here a second and let that sink in…

This is the introductory YAML file for **sendsnow**. It informs StackStorm to run the workflow sendsnow, but here it tells the workflow to expect an array (Python list) called **switches** with the **parameters** tag.


```yaml
---
name: sendsnow
description: A workflow for sending plexxi switches to servicenow.
runner_type: orquesta
entry_point: workflows/sendsnow.yaml
enabled: true
parameters:
  switches:
    required: true
    type: array
```

I use **with** and **item** to iterate through the switches array. Remember, StackStorm saved the array in the context referenced by ctx().


```yaml
version: 1.0

description: "Send hpecfm switches to snow"

input:
  - switches

tasks:

    snowswitches:
      with: <% ctx().switches %>
      action: servicenow.create_record table="u_cfm_asset" payload='<% item() %>'
```

What is interesting to note is the final action being called is in another StackStorm integration pack called **servicenow**. This means I have the ServiceNow integration pack installed, and it has an action called create\_record. StackStorm integration packs are freely available on the StackStorm Exchange [here](https://exchange.stackstorm.org/).

Note that, in this example, I have workflows that can call any series of actions (or workflows) from a variety of integration packs, which are just waiting for you to use them. If you are not using StackStorm, guess what? You are going to have to write all those Python scripts yourself. Why reinvent the wheel? Using StackStorm, you can save yourself from having to write thousands of lines of Python and instead just use a handful of simple YAML files to stitch things together.

After this workflow runs, all of the switches in the network are added to an asset inventory tracking database in Service Now. You could easily modify this for asset management of servers or storage devices as well. Keep an eye out on the [HPE DEV blog site](https://developer.hpe.com/blog) for my next post where I will be talking about sensors, triggers, and rules. Our journey into StackStorm is just getting started, so stay tuned, you seekers of knowledge!