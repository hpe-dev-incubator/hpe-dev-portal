---
title: "Developing a Client App for Accessing Services via the Open Service Broker API"
date: 2019-08-28T15:36:16.964Z
author: Carson Stone and Kailash Ramakrishnan 
tags: []
path: developing-a-client-app-for-accessing-services-via-the-open-service-brok
---
![picture13](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/picture13-1567007521162.png)

The Open Service Broker (OSB) API gives customers a uniform and less complicated way to access services offered by providers. The service broker acts as the middleman that links the two parties, transfering and implementing services between the two. It is the missing link, allowing for better service consumption and various kinds of client applications to reach services from any provider. The OSB API is the language specification that provides this communication. In this tutorial, we will show you how to develop a client app for accessing services using OSB. For the purposes of this post, we will be using Grommet OSB Broker, a broker we deployed in AWS cloud.

Note: For more information regarding service brokers, please see Pramod Sareddy’s blog post [Using Open Service Broker as a Quick and Easy Way to Offer Everything as-a-Service.](https://developer.hpe.com/blog/using-open-service-broker-as-a-quick-and-easy-way-to-offer-everything-as) You can also view another example walkthrough in Peng Liu’s post about [An Open Service Broker Project Delivers a Sample DevOps Environment to AWS.](https://developer.hpe.com/blog/an-open-service-broker-project-delivers-a-sample-devops-environment-to-a) To access API documentation, access the [Open Service Broker website](https://www.openservicebrokerapi.org/) and the [OSB documentation repository.](https://github.com/openservicebrokerapi/servicebroker/blob/master/spec.md) 

The stand-alone client application we developed is an example of an OSB client with a graphical user interface (GUI). Its purpose is to communicate with service brokers and deploy and manage services for the user. The service broker we use in this example is one that provisions an ec2 instance on AWS and installs a Grommet environment for a developer. 

To register a service broker, you must first know the IP address of a running broker (ex: ip address:port). If you have this address, as well as valid user credentials (username and password), you will be able to connect to the broker. You should also choose a name and description for the local client app’s representation of that broker.

Once registered, the client will fetch a broker’s catalog of services. The app will update to reflect the available services in the catalog page. From there, you can search for, or select, the desired service. Selecting a service will bring up a form for deploying an instance of that service. In this example, you will select the grommet service. You can then choose the service plan you want to use and fill in the inputs the broker needs. A plan is essentially a tier of service that may differ in capabilities, size, price, etc. from other plans.

Here is the workflow for using the Grommet service via our app:

## Step 0 - Download and Install the App
Follow the directions in the README.md and download the source code at the [HPE public GitHub repository.](https://github.com/HewlettPackard/hpe-openservicebroker-clientapp) Installation is simple and fast, and there is no backend to the app. The only prerequisites to have installed are Node >= 8.10 and yarn. 

## Step 1 - Log in to the App
Authentication is not really implemented at this time. Simply enter ‘user’ for the username and ‘password’ for the password to access the platform.


![picture1](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/picture1-1567007165491.png)

## Step 2 – Deploy a broker
In the real world, the broker could be deployed out on the Internet, on a local server, or anywhere in between. For the purposes of this post, we'll be using the Grommet OSB Broker, deployed on AWS. 

## Step 3 - Register Grommet Broker
On the broker settings page, you can register a broker. You should click the ‘add broker’ tile and then complete the register form. You can choose a name and an optional description. The broker’s address (URL) must be known in order to access it, and a username and password are required to authenticate to the broker. The username and password to register our broker are both ‘ubuntu’. If the registration fails, an alert will display an error message. Otherwise, the catalog for the broker will be fetched, which we will soon see reflected in the catalog page of our platform. The broker settings page will then be populated with a new broker tile, displaying the name and description of the registered broker. Clicking on this tile will display a details panel that shows the broker’s address, status, and time created. You may choose to edit the broker’s name and description, or delete the broker. Deleting the broker would remove its services from the catalog.


![picture5](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/picture5-1567007472045.png)



![picture6](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/picture6-1567007478316.png)

## Step 4 - Select Grommet Service from Catalog
You can now click on the ‘Catalog’ link to arrive at a page containing the broker’s service as a tile. There is also a search field that could be useful for finding a specific service by name if there are many on the page. Clicking the ‘grommet’ service tile will enable you to deploy an instance of that service.


![picture7](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/picture7-1567007485144.png)

## Step 5 - Deploy Service Instance
You should select the desired plan for the service. Choosing plan-1 for the Grommet service will produce a form that requires inputs for AWS implementation details. You must also name the instance, and that name must be unique. After clicking the submit button, the app will attempt to order the broker to instantiate the service. If something went wrong with the API call, an error will be displayed, and no instance will be created. If the provisioning is successful, you will be redirected to the Deployed Instances part of the app. You will see a tile that bears the name of the instance you just created.


![picture8](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/picture8-1567007492340.png)

## Step 6 - Access the Instance
Clicking on the aforementioned tile will produce a details panel for accessing that instance. The status should be ‘loading’, because the ec2 provisioning takes a while to process on the broker’s end. The app will continuously poll the broker’s last-operation endpoint to retrieve the status of the deployment. It will only do so for as long as the broker’s maximum-polling property will allow it to, if specified. Eventually, the status should turn green and say ‘loaded’. You will then have access to the instance’s access details, i.e. the public ip address of the ec2 instance.


![picture9](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/picture9-1567007498208.png)

Deployed

![picture10](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/picture10-1567007504694.png)



![picture11](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/picture11-1567007510153.png)

## Step 7 - Delete the Service Instance
On the same panel, you can choose to delete the instance. Clicking the delete button will remove the instance and stop the ec2 instance. Do this only when you are done with the AWS virtual machine!


![picture12](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/8/picture12-1567007515231.png)

## Next Steps
The OSB specification recommends an end point to bind/unbind to a service instance. Essentially, this is where the app and the service instance “connect”. This is currently unavailable in our app and will be developed in the future. After a service instance has been provisioned, you should see a button labeled ‘Bind’ that will initiate a HTTP PUT call to the /v2/service_instances/:instance_id/service_bindings/:binding_id endpoint. This feature must also handle polling the /v2/service_instances/:instance_id/service_bindings/:binding_id/last_operation endpoint until the bind/unbind returns the state ‘succeeded’. These operations will be used by more complex brokers.

Since the OSB specification says authentication is optional, we’ve only implemented basic authentication. This can be enhanced in the future to use JSON web tokens or more robust techniques. Also, session management can be implemented after a user is authenticated successfully. This would involve creating a session store on the backend using an in-memory database like Redis. Right now, if a user refreshes the page, the session info is lost. 

## Resources
Access the Open Service Broker Client App [here on GitHub.](https://github.com/HewlettPackard/hpe-openservicebroker-clientapp)

Click [here to view a video](https://www.youtube.com/watch?v=ERwrlvc1KdU&feature=youtu.be) that steps you through the process.

## Summary
We had a great time developing this client example and hope you will find it helpful in testing and implementing your service brokers. Please remember to follow our [HPE DEV blog](https://developer.hpe.com/blog) posts for more information on this and other topics designed to streamline your application development environment.
