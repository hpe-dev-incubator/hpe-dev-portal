---
title: Getting started with the HPE GreenLake cloud eventing framework
date: 2025-02-06T13:53:06.527Z
author: Didier Lalli
authorimage: /img/didier-lalli-192x192.png
disable: false
tags:
  - hpe-greenlake-cloud
  - webhooks
---
<style>
li {
   font-size: 27px;
   line-height: 33px;
   max-width: none;
}
</style>

## Polling API or subscribing to events: That IS the question

In one of my previous blog posts, I used the HPE GreenLake API to query the audit log and, if anything appeared in the audit log over the course of the last few minutes, I arranged for it to be displayed on screen. To do this, I had to continuously poll the API at a regular polling interval. While this works, it is not ideal, since it is not real time, and you might get notified of an important event after, at max, your polling interval. A better approach that is often available on software platforms is called events, also referred to as webhooks. HPE GreenLake cloud provides this functionality and, in this post, I will explain how to leverage it.

## It's a publisher/subscriber world

HPE GreenLake cloud provides an eventing framework in which event publishers (any of the HPE GreenLake cloud services) can register event types with the platform, and event subscribers can declare what event types they would like to subscribe to. After they establish a security handshake, HPE GreenLake forwards selected events to the subscriber in a close-to-real-time mode. No polling is necessary as the event handler (webhook) will be notified asynchronously.

The following diagram illustrates the mechanism by which this works:

![HPE GreenLake cloud eventing framework](/img/slide-for-blog-webhooks.jpg "HPE GreenLake cloud eventing framework")

## How do you write webhook handlers?

There are many ways you can write a webhook handler. You could use traditional languages such as Node.js (using Express.js), Python (using Flask) or Ruby (using Sinatra). Also very popular is the use of serverless functions such as AWS Lambda or Google Cloud Functions. You could also use low-code/no-code platforms such as Zapier, Make or Automate.io. Another option is to use an existing platform that supports webhooks such as ServiceNow or HPE OpsRamp.

In any case, a webhook handler will do the following:

1. Wait for an HTTP POST request
2. Verify request validity
3. Parse and process data
4. Return an HTTP status code

Additional requirements for writing a webhook handler for HPE GreenLake include:

* The URL for the endpoint needs to be a Fully Qualified Domain Name (FQDN)
* The endpoint needs to use HTTPS
* The handler needs to respond to the initial challenge through the use of a shared secret key

## Taking the challenge

From the picture above, you can see that the webhook handler is a piece of code that runs outside of the HPE GreenLake cloud, possibly posing a security risk. In order to avoid calling a rogue code, HPE GreenLake will establish a trust relationship with the webhook handler by issuing a challenge request and expecting a very specific response. The challenge is an HTTP POST request that is sent to the webhook handler (via its URL) with a payload containing a **challengeRequest** as shown below:

```json
{
  "data": {
 	"challengeRequest": "8cbecfea-d708-4706-bba3-669225084a10"
  },
  "datacontenttype": "application/json",
  "id": "9d2698f2-0dd4-4870-b026-7e18c755e121",
  "source": "https://global.api.greenlake.hpe.com/events",
  "specversion": "1.0",
  "subject": "3009de2825f211ec8a84fedebcb4a754",
  "time": "2024-12-12T19:09:05Z",
  "type": "com.hpe.greenlake.events.v1beta1.webhooks.verification"
}
```

> > *Example of a challenge payload*

The mission of the challenge handler is to provide the correct answer to the challenge in a timely fashion and with an HTTP response in the following form:

* Status code: **200**
* JSON body: **{ "verification" : "<CHALLENGE-RESPONSE>" }**
* Header: **content-type: application/json**

Where **<CHALLENGE-RESPONSE>** is the computed [SHA-256](https://en.wikipedia.org/wiki/SHA-2) [HMAC](https://en.wikipedia.org/wiki/HMAC) (Hash-based Message Authentication Code) of the **challengeRequest** provided in the input payload.

There are [online ways](https://www.devglan.com/online-tools/hmac-sha256-online) to generate SHA256 MAC encodings and test different options. But what you need to remember is that you have to provide a hexadecimal format of the hash, and that a secret key is used as a “salt” for the calculation of that hash. That secret key is shared by HPE GreenLake cloud and the webhook handler.

### Processing events as they arrive

If the challenge was successful, meaning that the webhook handler has been recognized as a valid target for HPE GreenLake event forwarding, the next task of the webhook handler is to process events as they are received through subsequent POST requests. The payload shown below is an example of an event received from the HPE GreenLake audit log. It describes the fact that a user has logged out of the HPE GreenLake cloud. More details about other event payloads can be found in the [HPE GreenLake developer portal](https://developer.greenlake.hpe.com/docs/greenlake/services/event/public/events/).

```json
{
    	"specversion": "1.0",
    	"id": "uJoQ5JMB_HAPiq2sSllt",
    	"source": "//global.api.greenlake.hpe.com/audit-log",
    	"type": "com.hpe.greenlake.audit-log.v1.logs.created",
    	"datacontenttype": "application/json",
    	"dataschema": "https://developer.greenlake.hpe.com/docs/greenlake/services/audit-logs/public/catalog/audit-log-event-latest/paths/Audit%20Log%20Created/post/",
    	"time": "2024-12-20T12:34:53.161Z",
    	"data": {
        	"id": "uJoQ5JMB_HAPiq2sSllt",
        	"user": {
            	"username": "john.doe@hpedev.io"
        	},
        	"workspace": {
            	"id": "3009de2825f211ec8a84fedebcb4a754",
            	"workspace_name": null,
            	"workspace_type": null
        	},
        	"application": {
            	"id": "00000000-0000-0000-0000-000000000000"
        	},
        	"category": "user_management",
        	"description": "User john.doe@hpedev.io logged out",
        	"created_at": 1734698093161,
        	"updated_at": 1734698093161,
        	"additional_info": {
            	"ip_address": "194.9.99.5",
            	"account_name": "HPEDEV -GLCP- Hackshack",
            	"ip_address_str": "1.1.1.1"
        	},
        	"has_details": false
    	}
```

> > *Example of an event payload*

Now that you have a clear understanding of what has to be done within a webhook handler, let me show you how to build one.

## Using Make.com to create a webhook handler

I decided to use Make (previously known as Integromat , which was a great name as it was a contraction of Integration-Automat and that is exactly what it is) to demonstrate this because:

* it doesn’t require any specific programming language knowledge
* it provides a FQDN of the webhook over HTTPS
* it’s free for simple prototyping usage

It turned out to be a very elegant and fast way to get the work done.

### Getting started with Make

First, you will need to create an account at <https://make.com>. Next you will create a new scenario (aka workflow).

The first step in the scenario will be a Webhooks module:

![Create a webhook in Make](/img/create-a-webhook.jpg "Create a webhook in Make")

Give it a name and leave the rest of the settings as their defaults.

![Use URL of Webhook](/img/create-webhook-2.jpg "Use URL of Webhook")

You can already **Copy address to clipboard** to get the URL of your webhook. Save it for later.

Select the **Add** button, then click on **Show Advanced Option** to add a data structure using the challenge payload example from the Take the challenge section above. Click **generate,** paste the JSON and save it as **challenge**.

Make sure the **challenge** data structure is selected in the advanced settings of the Webhooks module before continuing.

![Select challenge data structure ](/img/select-challenge.jpg "Select challenge data structure ")

Next, add another module to compute the HMAC. Click the plus sign and add a **Tools Set** **variable** module (use search to avoid the long list of modules).

![Add set variable step](/img/add-set-variabke-step.jpg "Add set variable step")

Configure the Set variable module with:

* Variable name: **hmac** 
* Variable value: **sha256( challengeRequest ; ; \<SecretKey\> )**

> Note: you can drag the **challengeRequest** property from the **Webhooks** module, and drop it as your first parameter. \**<SecretKey\>** is a placeholder which you will replace later, once we know the the real shared secret key.

![drag and drop properties](/img/drag-drop-properties.jpg "drag and drop properties")

The final step is to prepare the response of the webhook. For this, you need to add another module after the **Set variable** module, called **Webhook response**.

![Add webhook response](/img/add-webhook-response.jpg "Add webhook response")

Set the status to **200** and the body to **{"verification":"hmac"}**. Feel free to drag/drop the **hmac** property from the **Set variable** step in between the double quotes.

![Set webhook response](/img/setwebhook-response.jpg "Set webhook response")

In the advanced settings, add a custom header for **content-type: application/json**

Your overall workflow basically looks like this:

![Part 1 workflow](/img/step1-final.jpg "Part 1 workflow")

In the parameter of the scenario (bottom of your editor), make sure the green check **to run Immediately as data arrives** is checked.

![Run immediately as data arrives ](/img/run-immediatly.jpg "Run immediately as data arrives ")

### Debugging webhook using Postman

You can use Postman to test this workflow first before you declare it in HPE GreenLake cloud.

For this, create a **POST** request using the URL of the webhook (which you saved earlier) and the challenge example payload in JSON (we used it earlier). Make sure you add a **content-type:application/json** header before clicking **Send**. Check:

* That the status code is 200
* That the response body is the expected **hmac** value

![Try challenge from Postman](/img/postman-challenge.jpg "Try challenge from Postman")

### Handling events in Make

Now that you know how to handle the initial challenge, you need to also take care of the other type of events that will be sent to the webhook handler.

To make that distinction, you will use a new module in Make called a **Router** and insert it in between the **Webhooks** and the **Tools Set variable** modules (right-click add a router to **Webhooks**).

![Add a router](/img/add-a-router.jpg "Add a router")

Next, you will have to place a filter on this first branch (the challenge case) so that only the challenge call gets routed on the topmost branch.

To do this, click on the topmost link and set up a filter to verify that property **challengeRequest** exists in the payload. As earlier, you can use drag/drop to setup the condition of the filter, which is very convenient.

![Setup a filter on top most branch](/img/setup-filter.jpg "Setup a filter on top most branch")

Earlier, I showed an example of a payload received when an event is triggered. You can create another structure in the custom webhook (like what was done with the challenge JSON earlier). Call this structure **event** and make sure it’s selected before continuing.

![Select event structure](/img/select-event-struture.jpg "Select event structure")

Now you can proceed and add a second branch to the router. This branch will be used to process all other events (when it’s not a challenge) received by the handler. For this blog post, I have decided to keep it simple and simply add a row within a Google Sheet.

![Add a Google Sheet](/img/add-a-google-sheet.jpg "Add a Google Sheet")

For this, you must add a Google Sheet module and configure it to fit your needs. As you can see below, I have configured mine with my Google account, and the path to an existing Google Sheet called AuditLog. I also mapped the fields from the data structure that I’d like to record in each new row.

![Build a new row in google sheet](/img/build-a-row.jpg "Build a new row in google sheet")

Finally, you also need to add to this branch a **Webhook response** module (like we did in the topmost branch). This one is simpler, as it only returns a status 200 (no body, no header needed).

![Add a second webhook response](/img/second-webhook-response.jpg "Add a second webhook response")

The last thing you need to do is to place a fallback filter on the bottom branch, so it is used for all events except the challenge.

To do this, select the properties of the bottom branch of the **Router** and select **yes** for **fallback**.

![Set a fallback branch](/img/set-fallback.jpg "Set a fallback branch")

Make sure you save your scenario.

### Debugging webhook using Postman… again

Create a second Postman **POST** request using the same webhook URL but this time, in the body, use the audit log event payload used earlier.

![Post event in Postman](/img/post-event-in-postman.jpg "Post event in Postman")

Click **Send** in Postman, and check in Make (in the scenario’s history) that the second route was taken, as shown below.

![Second route was taken](/img/second-route-taken.jpg "Second route was taken")

You can also verify that in the **Google sheets** module, the content of the payload was mapped to different values (A:, B:, C:,…)

![Google sheet property mapping ](/img/googlesheet-set.jpg "Google sheet property mapping ")

Finally verify that your Google sheet was updated and a new row was added using the payload content, as shown in my Google sheet below.

![Row was added in Google sheet](/img/google-row-visible.jpg "Row was added in Google sheet")

## Putting it all together

It’s now time to put it all together. Connect to HPE GreenLake cloud console and select to **Manage Workspace**. From there, select the **Automations** tile and finally the **Webhooks** tile to access the webhooks configuration section:

![Webhooks in HPE GreenLake cloud](/img/webhooksview.jpg "Webhooks in HPE GreenLake cloud")

To register a new webhook as shown in the capture above, you need to provide:

* A name
* A description
* The URL of the webhook
* The Webhook secret key. (When you set this secret key don’t forget to go back to Make and edit the **Tool Set variable** module to use the same secret key. These keys MUST match exactly!)

![You must use the same secret key on both ends](/img/same-secret-key.jpg "You must use the same secret key on both ends")

### Register your webhook

When you select **Register webhook**, the first thing HPE GreenLake cloud will do is to establish a trust relationship with the webhook pointed by the URL, by sending a challenge payload using an HTTP POST request (as already discussed in the previous section).

If the webhook response is the expected one, then the webhook is placed in **Active** state. Otherwise, after a few attempts, the webhook state will be set to **Critical**. At any point in time you can use the **Test** button, to submit a new challenge (after fixing an issue with your webhook, for example).

### It’s time to subscribe to events

From the web console, you can now **subscribe to events** available from the HPE GreenLake services. You can find the list of those already available from the [HPE GreenLake Developer Portal](https://developer.greenlake.hpe.com/docs/greenlake/services/event/public/ui/#finding-events-on-hpe-greenlake-developer-portal). The list will grow over time as new services adopt this eventing framework.

Select your webhook from the list and select Subscribe to event. Select the source Service manager (there is only HPE GreenLake Platform for now), then cut/paste the event name from the [event catalog](https://developer.greenlake.hpe.com/docs/greenlake/services/#event-catalog). For example:

```markdown
com.hpe.greenlake.audit-log.v1.logs.created
com.hpe.greenlake.subscriptions.v1.expiring-subscriptions
```

![Subscribing to events](/img/subscribe.jpg "Subscribing to events")

Once you select **Subscribe to event**, your webhook handler is now registered to receive these types of events.

![Event subscribed](/img/event-subscribed.jpg "Event subscribed")

Let’s check what happened in the Google Sheet after a while.

![Google Sheet starts being populated with events](/img/events-in-google-docs.jpg "Google Sheet starts being populated with events")

You can see different types of audit log events coming up from the HPE GreenLake cloud. They could be processed on the receiving end, for example, to open incident tickets or take an automatic action.

## Call to action

Webhooks together with the HPE GreenLake cloud eventing framework provide a great way to integrate with HPE GreenLake cloud using modern technology. It provides great flexibility on where you can run the subscriber code, and allows you to choose the language in which to write the webhook code. It also allows you to build a tight integration with an existing platform such as HPE OpsRamp or ServiceNow.

Additional benefits I can see from this technique are:

* no need to verify that a polling code is still running
* no risk of API token expiration
* no loss of events
* it’s well established industry standard mechanism
* there is a huge choice of implementation methods including low code/no code ones

You can request access to this feature by signing up to the Automations/Webhook Access Beta Program [here](https://app.smartsheet.com/b/form/0e61e8c2bd6d48c7829845ab824c11d6).