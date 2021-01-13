---
title: "Using Open Service Broker as a Quick and Easy Way to Offer Everything as-a-Service "
date: 2019-08-19T15:29:52.117Z
author: Pramod Sareddy 
tags: []
path: using-open-service-broker-as-a-quick-and-easy-way-to-offer-everything-as
---
![everything as a service 2](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/everything-as-a-service-2-1568045844717.png)

Service brokers can be very helpful in delivering applications, development environments, or anything as-a-Service. Before the use of service brokers, setting up a development environment as-a-Service required a lot of time and manual effort. Service brokers compliant with the Open Service Broker (OSB) API specification can intuitively provision a new instance of a service they offer and provide all of the information your app or container needs to connect to it.

OSB packages all the pieces required for communication between the service provider and the consumer of that service, basically acting as the middle man who ensures clear communication and helps things work in a more automated way. Before OSB, developers had to download or create all the missing linkages. OSB eliminates that need.  

In this tutorial, I will explain what an OSB API is and how to use it. For this example, I will show you how to expose the Grommet development environment as-a-Service.  From there you can use similar methods to offer other application environments in the same way.

## What is an Open Service Broker API
The OSB API defines an HTTP(S) interface between platforms and service brokers.  The OSB API specifies how automated deployment, management, and use of services is handled. For example, app developers can use it to instantiate services and attach them to apps without having to care about how those services are ultimately created or managed. The OSB API is based on the service architecture originally developed for a well-known PaaS platform called Cloud Foundry. 

The client side of the OSB API is implemented by the client platform, i.e. Kubernetes Service Catalog,  that looks to use services exposed by OSB. The server side is implemented by the service provider, and consists of many endpoints the client hits to provision and manipulate services. The three most important endpoints to remember are the catalog, service instances, and service bindings, which I’ll go over in more detail later.

## Why use an Open Service Broker

It’s important to understand the problem the OSB API is attempting to solve. In some cases, an application might require access to a network of resources it depends on -- databases, caches, email systems, subscriptions to subsystem APIs, among others. Previously, these were manually and statically configured; now with today’s agile software development processes, where app instances are quickly spun up and deleted, they must be managed dynamically. 

So, how do we solve this problem? Keep in mind we want to take as much of the cognitive load off the app developers as possible. We don’t want app devs to be responsible for starting or configuring all these services. It’s important to ensure applications are as plug-and-play as possible. Similarly, we don’t want cloud providers to be saddled with that responsibility, either.

Service brokers are the missing link between the consumer and the provider. The broker holds the information about the services being provided, and carries out the details of ordering, provisioning, and connecting these services to the application being built by the consumer. Additionally, it automates steps that used to be performed by IT operations with multiple infrastructure management tools.
## Open Service Broker (OSB) terms
* Broker: A broker offers set of capabilities called services
    * Ex: Grommet Broker, MongoDB Broker

* Catalog: Collection of services is called catalog
    * A marketplace/catalog contains services from one or more brokers

* Service: a capability managed by the service broker
  * Ex: Grommet Dev Environment as a Service

* Service instance: an instantiation of a particular service's capability
  *Ex: Grommet Dev Environment VM

* Binding: relationship between a service instance and an application
  * Ex: Credentials created to access 'Grommmet Dev Environment'

Ok, now that we understand what brokers and all those other terms are and the value that they bring, I’m going to briefly go over how to write a sample broker, like Grommet OSB broker in Python. I’ll also show the basic workflow of registering a Grommet OSB broker to your cloud platform so it can consume the services.

## Register a Service Broker

The first thing that needs to happen is we need to associate a broker with our platform somehow -- this is called registering a broker. To do this, your cloud platform sends a GET request to the /v2/catalog endpoint on the broker, which responds with a 200 OK and a body containing all the information about the services the broker offers. It’s up to the cloud platform to store this data and make it available to users.

* NOTE: The Grommet OSB broker exposes services via /v2/catalog endpoint. Below, you can find the sample Python code exposing the service called “grommet” with two plans - “grommet-plan-1” and “grommet-plan-2”.


```python
def catalog():
    """
    Return the catalog of services handled
    by this broker

    GET /v2/catalog:

    HEADER:
        X-Broker-API-Version: <version>

    return:
      JSON document with details about the
      services offered through this broker

      Using OSB Spec of Get Catalog:
      https://github.com/openservicebrokerapi/servicebroker/blob/v2.13/spec.md
    """
#    api_version = bottle.request.headers.get('X-Broker-API-Version')
    print("inside catalog")
#    if (not api_version or not (api_version_is_valid(api_version))):
#        bottle.abort(
#            409,
#            "Missing or incompatible %s. Expecting version %.0f.%.0f or later" % (
#                X_BROKER_API_VERSION_NAME,
#                X_BROKER_API_MAJOR_VERSION,
#                X_BROKER_API_MINOR_VERSION))
    return {"services": [service]}
```


```python
{
  "services": [
	{
  	"id": " 97ca7e25-8f63-44a7-99d1-a75729eb",
  	"name": "grommet",
  	"description": "Grommet Dev Environment as a Service",
...
  	"plans": [{
      		"id": "123",
      		"name": " grommet-plan-1",
"description": "t2.micro instance with NodeJS",
      		...
    	},
    	{
      		"id": "456",
      		"name": "grommet-plan-2",
"description": "t2.small instance with NodeJS",
      		...
    	},
}
```
## Creating a Service

Now, if I want to create a service, I send a PUT request to /v2/service_instances/:service_id, where the service ID is a unique ID for the service being created. It’s up to the platform to create and track these. Once the service has been created, the broker returns a 201 to the platform.

* NOTE: The Grommet OSB broker exposes a /v2/service_instances/:service_id endpoint to create a service instance. Below, you can find the sample Python code creating a Ec2 instance in an AWS cloud.


```python
def provision(instance_id):
    """
    Provision an instance of this service
    for the given org and space

    PUT /v2/service_instances/<instance_id>:
        <instance_id> is provided by the Cloud
          Controller and will be used for future
          requests to bind, unbind and deprovision

    BODY:
        {
          "service_id":        "<service-guid>",
          "plan_id":           "<plan-guid>",
          "organization_guid": "<org-guid>",
          "space_guid":        "<space-guid>"
        }

    return:
        JSON document with details about the
        services offered through this broker
    """
    if bottle.request.content_type != 'application/json':
        bottle.abort(415, 'Unsupported Content-Type: expecting application/json')
    # get the JSON document in the BODY
    provision_details = bottle.request.json
    # Provision and launch the EC2 instance
    instance_info = create_ec2_instance(image_id, instance_type, keypair_name, user_data)
    global ec2_instance_id
    ec2_instance_id = instance_info["InstanceId"]
    bottle.response.status = 202
    #ec2_ip_addr = instance_info['Instances'][0]['PublicIpAddress']
    dashboard_url = "http://"+ec2_ip_addr+":3000"
    return {"dashboard_url": dashboard_url}
```
## Binding a Service

Once I create an instance, I need to create a binding to access that instance. This is done in a similar way, with a PUT request to /v2/service_instances/:instance_id/service_bindings/:binding_id, where binding_id is some globally unique ID that the platform has created. We again receive a 201 response.

Example: Grommet OSB broker /v2/service_instances/:instance_id/service_bindings/:binding_id endpoint

* NOTE: The Grommet OSB broker exposes
 /v2/service_instances/:instance_id/service_bindings/:binding_id endpoint to create a binding for an instance. Below, you can find the sample Python code used to create access credentials for an Ec2 instance provisioned in the previous step. End users can use these credentials to access the Grommet Dev Environment and start creating Grommet-based web apps.


```python
def bind(instance_id, binding_id):
    """
    Bind an existing instance with the
    for the given org and space

    PUT /v2/service_instances/<instance_id>/service_bindings/<binding_id>:
        <instance_id> is the Cloud Controller provided
          value used to provision the instance
        <binding_id> is provided by the Cloud Controller
          and will be used for future unbind requests

    BODY:
        {
          "plan_id":           "<plan-guid>",
          "service_id":        "<service-guid>",
          "app_guid":          "<app-guid>"
        }

    return:
        JSON document with credentails and access details
        for the service based on this binding
        http://docs.cloudfoundry.org/services/binding-credentials.html
    """
    if bottle.request.content_type != 'application/json':
        bottle.abort(415, 'Unsupported Content-Type: expecting application/json')
    # get the JSON document in the BODY
    binding_details = bottle.request.json
    bottle.response.status = 201
    uri ="http://"+ec2_ip_addr+":3000"
    return {"credentials": {"uri": uri, "username": "ubuntu"}}
```
## UnBinding a Service

Once I am done using the instance and don’t need the instance any more, I can delete the binding to remove the access to that instance. To do this, I send a DELETE request to /v2/service_instances/:service_id/service_bindings/:binding_id, where binding_id is some globally unique ID that the platform has created. I will again receive a 200 or 202 response and the cloud platform will clear the access credentials stored locally.

Example: Grommet OSB broker DELETE /v2/service_instances/:service_id/service_bindings/:binding_id endpoint

* NOTE: The Grommet OSB broker exposes a DELETE /v2/service_instances/:service_id/service_bindings/:binding_id endpoint to delete a binding for an instance. Below, you can find the sample Python code to delete the binding for a previously provisioned Ec2 instance.


```python
def unbind(instance_id, binding_id):
    """
    Unbind an existing instance associated
    with the binding_id provided

    DELETE /v2/service_instances/<instance_id>/service_bindings/<binding_id>:
        <instance_id> is the Cloud Controller provided
          value used to provision the instance
        <binding_id> is the Cloud Controller provided
          value used to bind the instance

    return:
        As of API 2.3, an empty JSON document
        is expected
    """
    return {}
```
## Deprovision Instance
Now, if I want to remove the provisioned service instance, I send a DELETE request to /v2/service_instances/:service_id, where the instanceID is a unique ID for the service being created. It’s up to the platform to create and track these. Once the service has been deleted, the broker returns a 200 OK to the platform, or it returns 202 Accepted if deletion is in progress.

Example: Grommet OSB broker DELETE /v2/service_instances/:service_id/ endpoint

* NOTE: The Grommet OSB broker exposes a DELETE /v2/service_instances/:service_id/ endpoint to delete an instance. Below, you can find the sample Python code used to delete a previously provisioned Ec2 instance.


```python
def deprovision(instance_id):
    """
    Deprovision an existing instance of this service

    DELETE /v2/service_instances/<instance_id>:
        <instance_id> is the Cloud Controller provided
          value used to provision the instance

   return:
        As of API 2.3, an empty JSON document
        is expected
    """
    # send response
    #ec2_client = boto3.client('ec2')
    #ec2.Instance('i-00434b87058703892').terminate()
    #ec2.instances.filter(InstanceIds=ids).terminate()
    deprovision_details = bottle.request.json
    return {}
```
Now, I have shown you the sample Python code of the Grommet OSB broker that will expose Grommet Dev Environment as-a-Service. You can deploy this broker anywhere in the cloud or on premise and share the broker endpoint with users to start consuming the services offered.

## Get and run the OSB broker service
* Create an OSB working folder in the hosting VM. Use any folder you prefer.
* [Get the OSB broker service](https://github.com/reddypramod85/osb-grommet-python)
  * You can download the zip file and unzip the package to the OSB working folder.
* Install the required the packages
  * sudo pip3 install --no-cache-dir -r requirements.txt
* Start the OSB service broker:
  * python3 osb_template.py

## Next Steps

There are many ways to write an OSB broker, like the Grommet OSB Broker, following the OSB API specification. Using Python is one option. In future articles, I will explore other approaches. Keep a look out on the [HPE DEV blog site](https://developer.hpe.com/blog) for my next article, __How to Register a Grommet OSB broker in Kubernetes Service Catalog,__ where I will show how to register and consume the services offered by Grommet OSB Broker in the Kubernetes Service Catalog and show you how to provision, bind, unbind, and deprovision a Grommet Dev instance.
