---
title: HPE OneSphere and ServiceNow integration
date: 2018-03-06T13:17:11.666Z
author: sahana@hpe.com, gandharvas@hpe.com, krishna.kanth-mallela@hpe.com, mpatil@hpe.com, shiva.kum.m@hpe.com 
tags: ["hpe-onesphere","onesphere","servicenow"]
path: hpe-onesphere-and-servicenow-integration
---
## HPE OneSphere ServiceNow Integration

### Summary
[HPE OneSphere](https://www.hpe.com/uk/en/solutions/cloud/hybrid-it-management.html) is a multi-cloud management platform, essentially allowing end users to create an instance for their workload on-demand with a cloud vendor, in a vendor agnostic manner. To use HPE OneSphere, a user will need to create a project in OneSphere. The project should have specific attributes set via tags and also the project members and owners need to be set to ensure only approved members have project access. Once set, the user can login and create instances in any cloud attached to OneSphere. In this blog I will explain how a self service ticketing tool like ServiceNow can be integrated with OneSphere. The use case involves a user requesting a project in OneSphere and, once approved by his manager, the project is created in OneSphere. I have leveraged ServiceNow application integration interfaces and OneSphere REST APIs to build this integration. This blog walks you through the various steps to build an integration and you can reuse the same steps to build other integrations or extend this one in future.

![onesphere app view](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/5/onesphere-app-view-1527851812563.PNG)

### Import sample OneSphere-ServiceNow application
ServiceNow Studio is an IDE for ServiceNow and it is integrated with Git. To get started, open ServiceNow Studio and import from source control. Use the following Git location to import the sample integration https://github.com/HewlettPackard/hpe-onesphere-servicenow

![import project](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/3/import-project-1521118976415.PNG)

### Browse through the sample integration
On the left panel you can see Tables, Forms, Business Rules and workflows. 

![studio form view](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/5/studio-form-view-1527852244358.PNG)

### Edit application to provide the HPE OneSphere details
Open the "Business Rule" (Script Action View) and provide values for these three attribtes

1. oneSphereUri

2. oneSphereUser

3. oneSpherePassword

![business_rule_window](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/5/business_rule_window-1527852410179.PNG)

### Create a new request
Now that you are all setup, launch your first request to OneSphere.
In the search menu, search for "OneSphere". You will see a new form by the name "Create project". Select it to view the new form request. Submit your request with the project name, owner, member, tags etc. 

![submit project](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/7/submit-project-1532708214264.PNG)

### ServiceNow workflow to approve project request
Once the user has submitted a request, this will have to be approved by the project manager before the request is sent to OneSphere. Fred Luddy (in this example) is the manager, will approve the project.

_Trivia : "Fred Luddy" is the founder of ServiceNow !!_



![approve project](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/7/approve-project-1532708926592.PNG)



![workflow](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/5/workflow-1527853418318.PNG)

### What happens after approval ?
The business rule "Create project in OneSphere" kicks in. This JavaScript makes multiple REST API calls to OneSphere as below

> 1. /rest/session to get session token
> 2. /rest/projects to create a project
> 3. /rest/users to get user URI and to add users if non-existent
> 4. /rest/membership-roles to get project-owner and project-member role URIs
> 5. /rest/memberships to add users as project owner or member of a project
> 6. /rest/password-reset to reset user password if the user does not exist and this application created her/him.



![servicenow javascript](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/5/servicenow-javascript-1527853684361.PNG)

### Project created in OneSphere
Post approval the project is then created in OneSphere. If any of the project members or owners do not exist, they are created in OneSphere and a password reset is initiated. The user will be notified via email to change the password. 

![project in onesphere](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/3/project-in-onesphere-1520345191868.PNG)



![project settings](https://hpe-developer-portal.s3.amazonaws.com/uploads/media/2018/3/project-settings-1520345244750.PNG)

### Next Steps
This completes the sample integration for ServiceNow with OneSphere. This can be further extended to change the AWS configuration for the user or add more members, etc. Also, this can be further extended to build a Service Catalog in ServiceNow.
