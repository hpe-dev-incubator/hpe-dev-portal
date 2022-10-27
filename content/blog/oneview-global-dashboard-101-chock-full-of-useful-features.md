---
title: "OneView Global Dashboard 101: Chock-Full of Useful Features"
date: 2019-06-18T20:32:33.264Z
author: Brad Stanley  
tags: ["hpe-oneview-global-dashboard"]
authorimage: "/img/blogs/Avatar2.svg"
featuredBlog: false
priority:
thumbnailimage:
---
![5bf2e1a0cd93d0796238ae01-blog-content-1560890766707](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/5/picture1-1560890766706.png)


To simplify the management of hybrid cloud infrastructures, the [HPE OneView](https://www.hpe.com/us/en/integrated-systems/software.html) Global Dashboard (OVGD) provides a unified view of the health and inventory of Hewlett Packard Enterprise (HPE) servers, profiles, enclosures, [HPE Synergy](https://www.hpe.com/us/en/integrated-systems/synergy.html) frames, and HPE 3PAR storage systems across data centers.

HPE just released OVGD version 1.8, and I’m excited to tell you about what’s new. Can you believe it? This is our 9th release in less than three years! Our 10th is planned around OVGD’s 3rd birthday in October of this year. The team prides itself on having met every release on time. We are also happy with the features in each release of the product.

The OVGD team designs software that helps you tame your IT monster, but sometimes features can sneak in unnoticed by users. Let’s take a quick look back and examine some of these newer releases to see if there is something you didn’t know about or a feature you have used and would like to comment on. We constantly strive to make the product better in the hopes of making you more efficient. So, keep us in mind and don’t hesitate to reach out via [Slack](https://slack.hpedev.io/) or [Twitter](https://twitter.com/HPE_Developer) if you think our product team can help you. 
## Data Aggregator  
* OVGD supplies data about:
    * Enclosures
    * Server hardware (You get loads more data with 1.8! Just click the Server hardware page, then choose a particular resource and view all the data in the detailed pane on the right side of your screen).  
    * Server profiles
    * Server profile templates
    * Storage systems
    * Storage pools
    * Volumes
    * SAN managers
    * SANs
    * Converged systems
    * Appliance alerts (critical only)
* Using single sign-on, you can log on and use HPE OneView/Composer to manage a resource with a single click! 
* With all the data provided, OVGD can be your one-stop shop to see your data center’s health, and help you get where you need to go to fix any issues or find out more information.  
* Using the dashboard and critical alert reporting, you can quickly understand system health across data centers and use single sign-on to “drill down” to wherever the problem resides. 
* You can click on the wrench icon   on each resource page to decide what columns will be displayed by default to ensure you get the view you need every time you login.   
* __New in Version 1.8__
    * This version jumps up the scale numbers! We are going from supporting 50 HPE OneView and/or Composers to 75, with up to 20,000 servers and 25 concurrent users.
    * We have a new resource page for your Interconnects.

## Report Generator
* We’ve got sixteen out-of-the-box reports that help you view your data center through different lenses. 


![5bf2e1a0cd93d0796238ae01-blog-content-1560890771858](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2019/5/picture2-1560890771858.png)

* Reports have a lot of flexibility hidden underneath those ellipses you see on the screen.
    * __Manage Report Content,__ with the same familiar wrench icon, lets you choose which columns to display.
    * __Export__ allows you to export the data in CSV format. It also reflects any customizations you’ve made, such as search, sort, filter, and column customizations.
    * __Schedule__ enables a report to be emailed to whomever you’d like at a configurable cadence (with the customizations mentioned above).
    * __Mail__ allows you to mail the report right at the very moment it is ready (again, including any customizations made to the report).
    * If you want to schedule an email with a search applied, a column sorted a certain way, columns added, or filters applied, you’ll need to first __Save__ a custom report and then schedule it. This feature allows you to create custom reports to suit your team’s needs. For example:

    Say Dave is responsible for keeping track of your Gen10s, and Wendy is in charge of your Gen9s and Gen8s. Create the ‘Dave Server Inventory’ report with a filter selected to limit the report and schedule it to arrive at work when he does. You can then do likewise for Wendy and her responsibilities.     

    * __Delete__ is for custom reports that you no longer need.
* New in Version 1.8
    * Two new reports, with all of the same flexibility mentioned above.
        * Interconnect Inventory
        * Enclosure Inventory
        * See the health and status of all your interconnects and enclosures, respectively.

OVGD 1.8 is now available, and we are excited to continue delivering a product that helps you tame your IT monster. We are driven to solve the problems you are facing. Nobody knows those problems better than you, so please get in touch with us to help us best understand your needs.

If you want to know more about OVGD, you might want to check out this product [overview video](https://www.youtube.com/watch?v=qsmNvNoy-qw) or go [here](https://buy.hpe.com/b2c/us/en/enterprise-software/converged-infrastructure-management-software/converged-infrastructure-management/oneview-management-software/hpe-oneview-global-dashboard/p/1009187269) to download it and try it yourself.
