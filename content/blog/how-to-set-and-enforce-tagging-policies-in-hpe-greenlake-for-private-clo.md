---
title: How to set and enforce tagging policies in HPE GreenLake for Private
  Cloud Enterprise
date: 2020-08-03T13:15:13.523Z
featuredBlog: false
priority: null
author: Thavamaniraja S
authorimage: /img/blogs/Avatar1.svg
thumbnailimage: null
tags:
  - hpe-greenlake
  - hpe-greenlake-for-private-cloud-enterprise
---
**Editor’s Note – NAME CHANGE: HPE GreenLake for Private Cloud is now part of HPE GreenLake for Private Cloud Enterprise.**

- - -

## Introduction
HPE GreenLake for private cloud allows customers to assign metadata to their instances in the form of tags. An instance is a set of virtual machines that compose a horizontally scalable entity or a service suite, like a database. Tags help customers manage, report and filter their instances, providing a business context to resource consumption and cost. The goal of this article is to discuss tags and the process of creating and enforcing tagging policies.  
            

## Tags
A tag is simply a label that consists of a customer-defined key and value that makes it easier to manage and filter instances. Tags allow you to categorize your instances in different ways. For example, you could define a set of tags for your instances that help you track each instances’ owner, department, and purpose. 
          
The following diagram illustrates how tagging works. In this example, I assigned two tags to each instance. One tag defines the key **Owner** and the other delineates the key **Purpose**.



![b1](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/7/b1-1596460810780.png)

## Tag Policies
With HPE GreenLake for private cloud tag policies, you can enforce a tag with a specific key and value or you can enforce the value coming from a specific list of values when an instance is provisioned. The list of acceptable values you designate can be any Option List that already exists in HPE GreenLake for private cloud.       
         
Option Lists can be populated in a number of ways including manually within HPE GreenLake for private cloud or from a REST API. In this article, I will illustrate the process of creating Option Lists designated as type "Manual".

>**NOTE:** Refer to [HPE GreenLake for private cloud documentation](https://cmpdocs.privatecloud.greenlake.hpe.com/en/latest/provisioning/library/library.html) to obtain more information on Option Lists

Other Tag Policy capabilities include:
- Multiple tag policies can be combined to enforce a comprehensive tag compliance program
- An Instance details page will warn when tags are not in compliance
- Administrators have the option to enable strict enforcement, stopping instance provisioning that would violate the tag policies


## Creating an Option List of Type "Manual"
*	Navigate to Provisioning - Library - OPTIONS LISTS and select +ADD key.


![b2](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/7/b2-1596460824531.png)

*	Enter a NAME for the Option List, select **"MANUAL"** type, provide DATASET and click on SAVE CHANGES.

![b3](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/7/b3-1596460832147.png)

>**NOTE:** JSON entries must be formatted as shown in the following example.    
>
```[{"name": "Purpose1","value": "Development"},{"name": "Purpose2","value": "Production"}]```


## Creating a Tag Policy
*	Navigate to Administration - Policies and select +ADD POLICY key.
*	In the TYPE drop-down, select **Tags**. The new policy modal will show options pertaining specifically to tagging, as shown below:


![b4](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/7/b4-1596460839745.png)

* Set the options as required. In this example, the following options are set: 
  * **TYPE:** Tags
  * **NAME:** A name given to this specific policy
  * **ENABLED:** When checked, the policy will be put into effect upon Save
  * **STRICT ENFORCEMENT:** When checked, new instances will not be provisioned if they violate the tag policy. When unchecked, users are only warned for non-compliance.
  * **KEY:** HPE GreenLake for private cloud requires a tag be added with the entered Key
  * **VALUE LIST:** If set, a tag with the key indicated above must have a value contained in the Option List selected
  * **SCOPE:** In this example case, it is set to Global, but tag policies can also be targeted to Groups, Clouds, Users and Roles


![b5](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/7/b5-1596460846266.png)

Once you have clicked "SAVE CHANGES", the policy is in effect so long as the "ENABLED" box is checked (which is true by default for new policies).


## Checking the Tag Policy enforcement
With the Tag Policy currently in place, you can see it in action when trying to provision an instance. Since I am enforcing a tag with key "Purpose" to exist with STRICT ENFORCEMENT, the provisioning wizard will not allow me to progress past the configuration tab if the tag is not set as shown below.


![b6](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/7/b6-1596460852753.png)

If an Option List is associated with the Tag Policy, you will see a similar validation error if you enter a tag key with no value or with a value that is not in the Option List.

![b7](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/7/b7-1596460859332.png)

If you return to the policy and deselect the "STRICT ENFORCEMENT" option, you will no longer be prevented from provisioning it, even when the tags violate the policy. You will, however see a message on the instance details page with information on which tag policy is being violated by the given instance, as shown below:<img src="https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/7/b8-1596470828071.png" height="100" width="700" align="left">

In a future blog entry, I’ll show how you can use tags to provide showback reporting and budgeting with business context in Consumption Analytics. Make sure you check the [HPE DEV blog](/blog) site often to find future posts related to this topic. If you have questions, please feel free to connect with me on the [HPE DEV Slack channel](https://slack.hpedev.io/).
                 
