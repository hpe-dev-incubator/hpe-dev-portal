---
title: "HPE InfoSight Northbound APIs: Bringing the Power of InfoSight Home"
date: 2021-01-20T11:20:19.782Z
author: Fatima Hassan 
tags: ["hpe-infosight"]
authorimage: "/img/blogs/Avatar4.svg"
featuredBlog: false
priority:
thumbnailimage:
---
![infosight](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2020/12/infosight-1611162508158.jpg)

There is just so much to keep tabs on, isn’t there? There are the tools you use to monitor your Data Center. Then, there are the support & case management and other IT service management (ITSM) & BI tools that you are using such as Service Now, not to mention the complexity introduced when your infrastructure stack consists of products from different companies.  It costs you time and effort to constantly have to manually consolidate information from all of these different places. And, with so many tools each having their own stack, your IT environment can grow quite siloed and you can miss out on critical information related to your infrastructure, which can cost you a lot of money. This can all be quite nightmarish and those of us who developed HPE InfoSight understand that.

Using HPE InfoSight as an integral part of your cloud-based AI Ops and monitoring solution stack, you now have the ability to pull all the critical information regarding the health and wellness of your HPE infrastructure directly from InfoSight into any of your ITSM/BI/Home grown tools such as Service Now. You can use it to apply your own business logic & rules to optimize your work and the environment, quickly and easily. HPE InfoSight does this through harnessing the power of REST APIs in our new offering: “InfoSight North Bound APIs for Nimble Storage”. This product is built on top of the case automation system and integrated with the Wellness Dashboard in HPE InfoSight.

**The current offering:**

HPE InfoSight North Bound APIs for Nimble Storage consists of a set of two public API endpoints for programmatic access to HPE InfoSight Wellness Issue details, enabling synchronization with service desks and other operational tools. 

1. **/Issues:** Retrieve a list of wellness issues with filters for severity, date range, etc.
2. **/Issue:** Get details for a specific wellness issue

It also provides a complementary Service Now Integration Configuration Pack to easily integrate the APIs for those of you who use Service Now. 

**How to access the APIs:**

It is super easy and fast to integrate these APIs into your environment.

1. Log in to [https://infosight.hpe.com](https://infosight.hpe.com/). Note: Admin role is required.
2. Select the correct Organization and navigate to Settings/API Access
3. Add a new Application, select the Wellness API, and generate a Client Key and Client Secret pair. These will be required when making Wellness API calls.
4. Integrate Wellness APIs into your application.

You can learn more about the technical specifications by checking out our [technical specification document](https://infosight.hpe.com/InfoSight/media/cms/active/public/pubs_HPE_infosight_wellness_spec.pdf).

**What’s in store for the future:**

Right now, this offering is available for Nimble Storage and allows access to Wellness Information. We plan on extending this offering to other partner products, as well as add performance and asset metrics, in the future.

Go check out these APIs. We would love to hear what you think. Connect with us on [HPE DEV Slack workspace](https://app.slack.com/client/T5SNJCC7K/GLWKH9CG5) to share your feedback.